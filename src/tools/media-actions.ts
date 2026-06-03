/**
 * Copyright 2026 @arcticgreyy. All rights reserved.
 * Licensed under the Business Source License 1.1 (BSL 1.1)
 * Persistent Attribution Required. See /LICENSE and /NOTICE for terms.
 * Central Suite Repository: https://github.com/arcticgreyy/paid-media-suite
 */
/**
 * Interactive media action tools
 *
 * These let practitioners trigger Operator-style actions manually from a
 * skill session, without waiting for the autonomous agent's cron schedule.
 * All actions are logged to operator_action_log and, if approval is required,
 * to operator_pending_approvals — same tables the autonomous Operator writes to.
 *
 * Tools:
 *   push_audience_suppression — add domains to platform exclusion list
 *   reallocate_media_budget   — shift budget between campaigns/line items
 */

import { z } from "zod";
import type { PaidMediaAdapter } from "../adapters/base.js";

export const mediaActionTools = (adapter: PaidMediaAdapter) => [

  {
    name: "push_audience_suppression",
    description:
      "Add a list of company domains to an audience exclusion list on a supported ad platform " +
      "(DV360, Meta, LinkedIn) to stop showing top-of-funnel ads to accounts already in open pipeline. " +
      "This is the 'closed-loop' action that connects CRM pipeline data to media buying. " +
      "The action is logged to operator_action_log. If PAID_MEDIA_AGENT_URL is configured, " +
      "the request is forwarded to the autonomous Operator agent for execution with guardrails. " +
      "Otherwise, it is queued as a pending approval with full context for manual execution.",
    inputSchema: z.object({
      platform: z
        .enum(["dv360", "meta", "linkedin"])
        .describe("Which platform to push the exclusion to"),
      advertiser_id: z
        .string()
        .describe("Platform advertiser / account ID"),
      audience_list_id: z
        .string()
        .describe("The exclusion audience list ID in the platform"),
      domains: z
        .array(z.string())
        .describe(
          "Company domains to exclude, e.g. ['acme.com', 'bigcorp.io']. " +
          "Get these from get_accounts_in_open_pipeline or a Salesforce export."
        ),
      rationale: z
        .string()
        .describe(
          "Why this suppression is being pushed — which accounts, which pipeline stage. " +
          "Shown in the approval queue if approval is required."
        ),
    }),
    handler: async (args: {
      platform: string;
      advertiser_id: string;
      audience_list_id: string;
      domains: string[];
      rationale: string;
    }) => {
      const result = await adapter.pushAudienceSuppression(
        args.platform,
        args.advertiser_id,
        args.audience_list_id,
        args.domains,
        args.rationale
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  },

  {
    name: "reallocate_media_budget",
    description:
      "Shift budget from an underperforming campaign or line item to one with higher " +
      "attributed pipeline contribution. Supports DV360, SA360, and Google Ads. " +
      "The reallocation is capped at the configured max_budget_shift_pct guardrail. " +
      "The action is logged to operator_action_log with full attribution rationale. " +
      "If PAID_MEDIA_AGENT_URL is configured, forwarded to the Operator agent. " +
      "Otherwise queued for manual execution with a pending approval record. " +
      "Always provide the attribution insight that drives the recommendation.",
    inputSchema: z.object({
      platform: z
        .enum(["dv360", "sa360", "google_ads"])
        .describe("Which platform the campaigns are on"),
      advertiser_id: z
        .string()
        .describe("Platform advertiser or manager account ID"),
      source_campaign_id: z
        .string()
        .describe("The underperforming campaign or line item to reduce budget from"),
      target_campaign_id: z
        .string()
        .describe("The high-performing campaign or line item to increase budget for"),
      amount_usd: z
        .number()
        .describe("Dollar amount to move. Will be rejected if it exceeds the guardrail cap."),
      rationale: z
        .string()
        .describe(
          "The attribution-based reasoning. Include: which model, which metric drove the decision, " +
          "and what the expected impact is. E.g. 'Paid social has 42% attributed pipeline credit " +
          "but only 18% of budget. Shifting $2,000 from display awareness to LinkedIn retargeting.'"
        ),
    }),
    handler: async (args: {
      platform: string;
      advertiser_id: string;
      source_campaign_id: string;
      target_campaign_id: string;
      amount_usd: number;
      rationale: string;
    }) => {
      const result = await adapter.reallocateMediaBudget(
        args.platform,
        args.advertiser_id,
        args.source_campaign_id,
        args.target_campaign_id,
        args.amount_usd,
        args.rationale
      );
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    },
  },

];
