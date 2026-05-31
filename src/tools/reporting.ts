import { z } from "zod";
import type { PaidMediaAdapter } from "../adapters/base.js";

export const reportingTools = (adapter: PaidMediaAdapter) => [
  {
    name: "list_reporting_templates",
    description:
      "List available reporting and dashboard templates. Filter by audience (executive, media_team, client, internal). Returns template structure, metrics, delivery format, and cadence.",
    inputSchema: z.object({
      audience: z
        .enum(["executive", "media_team", "client", "internal"])
        .optional()
        .describe("Filter templates by intended audience"),
    }),
    handler: async (args: { audience?: string }) => {
      const templates = await adapter.getReportingTemplates(args.audience);
      if (templates.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No reporting templates found. Add them to data/reporting-templates.json.",
            },
          ],
        };
      }
      // Return a summary view (full sections can be retrieved via get_reporting_template)
      const summaries = templates.map((t) => ({
        id: t.id,
        name: t.name,
        type: t.type,
        audience: t.audience,
        cadence: t.cadence,
        delivery_format: t.delivery_format,
        section_count: t.sections.length,
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ count: templates.length, templates: summaries }, null, 2),
          },
        ],
      };
    },
  },

  {
    name: "get_reporting_template",
    description:
      "Get the full structure of a reporting template including all sections, metrics, dimensions, and visualizations.",
    inputSchema: z.object({
      template_id: z.string().describe("The reporting template ID"),
    }),
    handler: async (args: { template_id: string }) => {
      const template = await adapter.getReportingTemplate(args.template_id);
      if (!template) {
        return {
          content: [
            {
              type: "text",
              text: `No reporting template found with ID: ${args.template_id}`,
            },
          ],
        };
      }
      return { content: [{ type: "text", text: JSON.stringify(template, null, 2) }] };
    },
  },

  {
    name: "build_performance_report",
    description:
      "Generate a narrative performance report for a campaign or team, combining live performance data with the appropriate reporting template. Best used with a reporting template ID to match the intended audience format.",
    inputSchema: z.object({
      target_type: z.enum(["campaign", "team"]).describe("Whether to report on a campaign or a team"),
      target_id: z.string().describe("Campaign ID or team ID"),
      date_from: z.string().describe("Report start date (YYYY-MM-DD)"),
      date_to: z.string().describe("Report end date (YYYY-MM-DD)"),
      template_id: z.string().optional().describe("Reporting template to use for structure/format"),
    }),
    handler: async (args: {
      target_type: "campaign" | "team";
      target_id: string;
      date_from: string;
      date_to: string;
      template_id?: string;
    }) => {
      const [records, template] = await Promise.all([
        adapter.getPerformance({
          [args.target_type === "campaign" ? "campaign_id" : "team_id"]: args.target_id,
          date_from: args.date_from,
          date_to: args.date_to,
        }),
        args.template_id ? adapter.getReportingTemplate(args.template_id) : Promise.resolve(null),
      ]);

      const entity =
        args.target_type === "campaign"
          ? await adapter.getCampaign(args.target_id)
          : await adapter.getTeam(args.target_id);

      const payload = {
        report_for: { type: args.target_type, id: args.target_id, name: (entity as { name: string } | null)?.name },
        date_range: { from: args.date_from, to: args.date_to },
        template: template
          ? { id: template.id, name: template.name, sections: template.sections }
          : null,
        data: {
          record_count: records.length,
          records,
        },
        instructions:
          "Use the template sections as the report structure. Compute totals and rates from the raw records. Highlight trends, anomalies, and recommendations.",
      };

      return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
    },
  },
];
