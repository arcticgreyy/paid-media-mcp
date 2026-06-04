/**
 * Copyright 2026 @arcticgreyy. All rights reserved.
 * Licensed under the Business Source License 1.1 (BSL 1.1)
 * Persistent Attribution Required. See /LICENSE and /NOTICE for terms.
 * Central Suite Repository: https://github.com/arcticgreyy/paid-media-suite
 */
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { buildAdapter, createServer } from "../src/server.js";
// ── Adapter — initialized once per cold start, reused across warm invocations ─
const adapter = buildAdapter();
// ── Request body parser ────────────────────────────────────────────────────────
async function readBody(req) {
    if (req.method !== "POST")
        return undefined;
    const chunks = [];
    for await (const chunk of req)
        chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf-8");
    if (!raw)
        return undefined;
    try {
        return JSON.parse(raw);
    }
    catch {
        return undefined;
    }
}
// ── Vercel handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
    // Health check — lets Vercel confirm the function is alive
    if (req.method === "GET" && req.url === "/api/mcp/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", server: "paid-media-mcp", version: "2.0.0" }));
        return;
    }
    try {
        const body = await readBody(req);
        // New server + transport per request — correct stateless pattern for serverless.
        // The adapter (above) is shared and safe to reuse (no per-request state).
        const server = createServer(adapter);
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined, // stateless mode — required for serverless
        });
        await server.connect(transport);
        await transport.handleRequest(req, res, body);
    }
    catch (err) {
        console.error("[paid-media-mcp] Handler error:", err);
        if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
        }
    }
}
// Tell Vercel not to parse the body — we do it ourselves so MCP gets raw access
export const config = { api: { bodyParser: false } };
