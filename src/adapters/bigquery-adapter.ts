/**
 * BigQueryAdapter
 *
 * Extends FileAdapter so that:
 *   - Campaign metadata and daily performance come from BigQuery
 *   - Org knowledge (teams, attribution, audiences, measurement, etc.) still
 *     comes from local JSON files in data/
 *
 * This is the recommended starting point when your platform data is exported
 * to BigQuery (via Fivetran, Supermetrics, Stitch, dbt, etc.) but your
 * organizational metadata lives in files or isn't available via an API.
 *
 * INSTALLATION
 * ------------
 * npm install @google-cloud/bigquery
 *
 * AUTHENTICATION
 * --------------
 * Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of
 * a service account JSON key file, or run on GCP infrastructure with a
 * service account that has BigQuery Data Viewer access.
 *
 * EXPECTED TABLE SCHEMAS
 * ----------------------
 * campaigns:
 *   id STRING, name STRING, account_id STRING, team_id STRING,
 *   platform STRING, status STRING, objective STRING, funnel_stage STRING,
 *   budget_amount FLOAT64, budget_type STRING, budget_currency STRING,
 *   start_date DATE, end_date DATE, notes STRING, tags STRING (comma-separated)
 *
 * daily_performance:
 *   date DATE, campaign_id STRING,
 *   impressions INT64, clicks INT64, spend FLOAT64,
 *   conversions INT64, conversion_value FLOAT64
 *
 * benchmarks (optional):
 *   platform STRING, objective STRING,
 *   avg_ctr FLOAT64, avg_cpc FLOAT64, avg_cpm FLOAT64,
 *   avg_cpa FLOAT64, avg_roas FLOAT64
 *
 * Adapt the queries below to match your actual column names.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BigQueryClient = any;

export interface BigQueryAdapterConfig {
  /** GCP project ID */
  projectId: string;
  /** BigQuery dataset name */
  dataset: string;
  /** Override individual table names if they differ from the defaults */
  tables?: {
    campaigns?: string;        // default: "campaigns"
    performance?: string;      // default: "daily_performance"
    benchmarks?: string;       // default: "benchmarks" (optional table)
  };
  /** Path to local JSON data directory for org knowledge domains */
  dataDir?: string;
}

import { FileAdapter } from "./file-adapter.js";
import type { CampaignFilters, PerformanceFilters } from "./base.js";
import type {
  Campaign,
  CampaignObjective,
  CampaignStatus,
  PerformanceRecord,
  Platform,
} from "../types.js";

// Lazy-load @google-cloud/bigquery so the server starts even if the package
// isn't installed. Only throws when you actually try to use a BQ-backed method.
async function getBigQuery(projectId: string): Promise<BigQueryClient> {
  try {
    const { BigQuery } = await import("@google-cloud/bigquery" as string as never) as { BigQuery: new (opts: { projectId: string }) => BigQueryClient };
    return new BigQuery({ projectId });
  } catch {
    throw new Error(
      "BigQueryAdapter requires @google-cloud/bigquery. " +
      "Run: npm install @google-cloud/bigquery"
    );
  }
}

export class BigQueryAdapter extends FileAdapter {
  private readonly config: Required<BigQueryAdapterConfig> & { tables: Required<NonNullable<BigQueryAdapterConfig["tables"]>> };
  private bq: BigQueryClient | null = null;

  constructor(config: BigQueryAdapterConfig) {
    super(config.dataDir ?? "./data");
    this.config = {
      ...config,
      dataDir: config.dataDir ?? "./data",
      tables: {
        campaigns: config.tables?.campaigns ?? "campaigns",
        performance: config.tables?.performance ?? "daily_performance",
        benchmarks: config.tables?.benchmarks ?? "benchmarks",
      },
    };
  }

  private async client(): Promise<BigQueryClient> {
    if (!this.bq) {
      this.bq = await getBigQuery(this.config.projectId);
    }
    return this.bq;
  }

  private table(name: keyof Required<NonNullable<BigQueryAdapterConfig["tables"]>>) {
    return `\`${this.config.projectId}.${this.config.dataset}.${this.config.tables[name]}\``;
  }

  // ── Campaigns ──────────────────────────────────────────────────────────────

  override async getCampaigns(filters: CampaignFilters = {}): Promise<Campaign[]> {
    const bq = await this.client();
    const conditions: string[] = [];

    if (filters.team_id)        conditions.push(`team_id = '${filters.team_id}'`);
    if (filters.account_id)     conditions.push(`account_id = '${filters.account_id}'`);
    if (filters.platform)       conditions.push(`platform = '${filters.platform}'`);
    if (filters.status)         conditions.push(`status = '${filters.status}'`);
    if (filters.objective)      conditions.push(`objective = '${filters.objective}'`);
    if (filters.funnel_stage)   conditions.push(`funnel_stage = '${filters.funnel_stage}'`);
    if (filters.start_date_after) conditions.push(`start_date >= '${filters.start_date_after}'`);
    if (filters.end_date_before)  conditions.push(`end_date <= '${filters.end_date_before}'`);

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `SELECT * FROM ${this.table("campaigns")} ${where} ORDER BY name`;

    const [rows] = await bq.query(query);
    return rows.map(rowToCampaign);
  }

  override async getCampaign(id: string): Promise<Campaign | null> {
    const bq = await this.client();
    const [rows] = await bq.query(
      `SELECT * FROM ${this.table("campaigns")} WHERE id = @id LIMIT 1`,
      { params: { id } }
    );
    return rows.length ? rowToCampaign(rows[0]) : null;
  }

  // ── Performance ────────────────────────────────────────────────────────────

  override async getPerformance(filters: PerformanceFilters = {}): Promise<PerformanceRecord[]> {
    const bq = await this.client();
    const conditions: string[] = [];

    if (filters.campaign_id) {
      conditions.push(`p.campaign_id = '${filters.campaign_id}'`);
    } else if (filters.team_id) {
      conditions.push(`c.team_id = '${filters.team_id}'`);
    } else if (filters.platform) {
      conditions.push(`c.platform = '${filters.platform}'`);
    }

    if (filters.date_from) conditions.push(`p.date >= '${filters.date_from}'`);
    if (filters.date_to)   conditions.push(`p.date <= '${filters.date_to}'`);

    const needsJoin = filters.team_id || filters.platform;
    const from = needsJoin
      ? `${this.table("performance")} p JOIN ${this.table("campaigns")} c ON p.campaign_id = c.id`
      : `${this.table("performance")} p`;

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `
      SELECT
        FORMAT_DATE('%Y-%m-%d', p.date) AS date,
        p.campaign_id,
        p.impressions,
        p.clicks,
        p.spend,
        p.conversions,
        p.conversion_value
      FROM ${from}
      ${where}
      ORDER BY p.date DESC
    `;

    const [rows] = await bq.query(query);
    return rows.map((r: Record<string, unknown>) => ({
      date: String(r.date),
      campaign_id: String(r.campaign_id),
      metrics: {
        impressions: Number(r.impressions ?? 0),
        clicks: Number(r.clicks ?? 0),
        spend: Number(r.spend ?? 0),
        conversions: Number(r.conversions ?? 0),
        conversion_value: Number(r.conversion_value ?? 0),
      },
    } satisfies PerformanceRecord));
  }

  override async getBenchmarks(
    platform?: Platform,
    objective?: CampaignObjective
  ) {
    try {
      const bq = await this.client();
      const conditions: string[] = [];
      if (platform)  conditions.push(`platform = '${platform}'`);
      if (objective) conditions.push(`objective = '${objective}'`);
      const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
      const [rows] = await bq.query(
        `SELECT avg_ctr, avg_cpc, avg_cpm, avg_cpa, avg_roas FROM ${this.table("benchmarks")} ${where} LIMIT 1`
      );
      if (!rows.length) return null;
      const r = rows[0] as Record<string, unknown>;
      return {
        avg_ctr: r.avg_ctr != null ? Number(r.avg_ctr) : undefined,
        avg_cpc: r.avg_cpc != null ? Number(r.avg_cpc) : undefined,
        avg_cpm: r.avg_cpm != null ? Number(r.avg_cpm) : undefined,
        avg_cpa: r.avg_cpa != null ? Number(r.avg_cpa) : undefined,
        avg_roas: r.avg_roas != null ? Number(r.avg_roas) : undefined,
      };
    } catch {
      // Fall back to file-based benchmarks if the table doesn't exist
      return super.getBenchmarks(platform, objective);
    }
  }
}

// ── Row mapping ──────────────────────────────────────────────────────────────

function rowToCampaign(r: Record<string, unknown>): Campaign {
  return {
    id: String(r.id),
    name: String(r.name),
    account_id: String(r.account_id),
    team_id: String(r.team_id),
    platform: String(r.platform) as Platform,
    status: String(r.status) as CampaignStatus,
    objective: String(r.objective) as CampaignObjective,
    funnel_stage: r.funnel_stage ? String(r.funnel_stage) as "upper" | "mid" | "lower" : undefined,
    budget: {
      amount: r.budget_amount != null ? Number(r.budget_amount) : 0,
      // BQ exports typically use "daily" or "lifetime"; map to Budget.type
      type: (String(r.budget_type ?? "lifetime")) as "daily" | "lifetime" | "monthly",
      currency: String(r.budget_currency ?? "USD"),
    },
    start_date: String(r.start_date ?? ""),
    end_date: r.end_date ? String(r.end_date) : undefined,
    notes: r.notes ? String(r.notes) : undefined,
    tags: r.tags ? String(r.tags).split(",").map(t => t.trim()).filter(Boolean) : undefined,
  };
}
