import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import { FileAdapter } from "./adapters/file-adapter.js";
import { campaignTools } from "./tools/campaigns.js";
import { teamTools } from "./tools/teams.js";
import { performanceTools } from "./tools/performance.js";
import { attributionTools } from "./tools/attribution.js";
import { reportingTools } from "./tools/reporting.js";
import { assetTools } from "./tools/assets.js";
import { testingTools } from "./tools/testing.js";
import { audienceTools } from "./tools/audiences.js";
import { measurementTools } from "./tools/measurement.js";
import { platformTools } from "./tools/platforms.js";
import { registerResources } from "./resources/index.js";
import { prompts } from "./prompts/index.js";

// ── Config ────────────────────────────────────────────────────────────────────

const DATA_DIR = process.env.PAID_MEDIA_DATA_DIR ?? "./data";

// ── Adapter ───────────────────────────────────────────────────────────────────
// To connect to a live API instead of files, swap FileAdapter for your own
// implementation of the PaidMediaAdapter interface (src/adapters/base.ts).

const adapter = new FileAdapter(DATA_DIR);

// ── Tools ─────────────────────────────────────────────────────────────────────

const allTools = [
  ...campaignTools(adapter),
  ...teamTools(adapter),
  ...performanceTools(adapter),
  ...attributionTools(adapter),
  ...reportingTools(adapter),
  ...assetTools(adapter),
  ...testingTools(adapter),
  ...audienceTools(adapter),
  ...measurementTools(adapter),
  ...platformTools(adapter),
];

const toolMap = new Map(allTools.map((t) => [t.name, t]));

// ── Resources ─────────────────────────────────────────────────────────────────

const allResources = registerResources(adapter);
const resourceMap = new Map(allResources.map((r) => [r.uri, r]));

// ── Prompts ───────────────────────────────────────────────────────────────────

const promptMap = new Map(prompts.map((p) => [p.name, p]));

// ── Server ────────────────────────────────────────────────────────────────────

const server = new Server(
  { name: "paid-media-mcp", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {}, prompts: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: zodToJsonSchema(t.inputSchema),
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = toolMap.get(request.params.name);
  if (!tool) {
    throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${request.params.name}`);
  }
  try {
    const parsed = tool.inputSchema.parse(request.params.arguments ?? {});
    return await tool.handler(parsed as never);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid arguments: ${err.message}`);
    }
    throw new McpError(
      ErrorCode.InternalError,
      `Tool error: ${err instanceof Error ? err.message : String(err)}`
    );
  }
});

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: allResources.map((r) => ({
    uri: r.uri,
    name: r.name,
    description: r.description,
    mimeType: r.mimeType,
  })),
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const resource = resourceMap.get(request.params.uri);
  if (!resource) {
    throw new McpError(ErrorCode.InvalidRequest, `Resource not found: ${request.params.uri}`);
  }
  const text = await resource.handler();
  return { contents: [{ uri: request.params.uri, mimeType: resource.mimeType, text }] };
});

server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: prompts.map((p) => ({
    name: p.name,
    description: p.description,
    arguments: p.arguments,
  })),
}));

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const prompt = promptMap.get(request.params.name);
  if (!prompt) {
    throw new McpError(ErrorCode.InvalidRequest, `Prompt not found: ${request.params.name}`);
  }
  const args = (request.params.arguments ?? {}) as Record<string, string>;
  return {
    description: prompt.description,
    messages: [
      {
        role: "user",
        content: { type: "text", text: prompt.handler(args) },
      },
    ],
  };
});

// ── Zod → JSON Schema (minimal, covers all input types used) ──────────────────

function zodToJsonSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  if (schema instanceof z.ZodObject) {
    const properties: Record<string, unknown> = {};
    const required: string[] = [];
    for (const [key, value] of Object.entries(schema.shape as Record<string, z.ZodTypeAny>)) {
      properties[key] = zodToJsonSchema(value);
      if (!(value instanceof z.ZodOptional)) required.push(key);
    }
    return { type: "object", properties, required: required.length ? required : undefined };
  }
  if (schema instanceof z.ZodOptional) return zodToJsonSchema(schema.unwrap());
  if (schema instanceof z.ZodEnum) return { type: "string", enum: schema.options };
  if (schema instanceof z.ZodString) {
    const result: Record<string, unknown> = { type: "string" };
    const desc = schema.description;
    if (desc) result.description = desc;
    return result;
  }
  if (schema instanceof z.ZodNumber) return { type: "number" };
  if (schema instanceof z.ZodBoolean) return { type: "boolean" };
  return {};
}

// Carry Zod descriptions through to JSON Schema
z.ZodString.prototype.describe = function (desc: string) {
  const clone = this._def ? Object.create(Object.getPrototypeOf(this)) : this;
  Object.assign(clone, this);
  clone._def = { ...this._def, description: desc };
  clone.description = desc;
  return clone;
};

// ── Start ─────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Paid Media MCP server running. Data dir:", DATA_DIR);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
