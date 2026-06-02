import type {
  Account,
  Campaign,
  CampaignStatus,
  CampaignObjective,
  Platform,
  Team,
  TeamMember,
  PerformanceRecord,
  AttributionConfiguration,
  AttributionChannelSummary,
  AttributionRun,
  ReportingTemplate,
  AssetLibrary,
  AssetCategory,
  AssetType,
  TestingProgram,
  Test,
  TestStatus,
  TestType,
  AudienceLibrary,
  FirstPartyAudience,
  DataProvider,
  ThirdPartyAudienceLayer,
  MeasurementSetup,
  PixelTag,
  ConversionAPI,
  PlatformsConfig,
  IdentityNamespace,
  WatchdogAlert,
  AnalystInsight,
  OperatorPendingApproval,
} from "../types.js";

export interface CampaignFilters {
  team_id?: string;
  account_id?: string;
  platform?: Platform;
  status?: CampaignStatus;
  objective?: CampaignObjective;
  funnel_stage?: "upper" | "mid" | "lower";
  tag?: string;
  start_date_after?: string;
  end_date_before?: string;
}

export interface PerformanceFilters {
  campaign_id?: string;
  team_id?: string;
  platform?: Platform;
  date_from?: string;
  date_to?: string;
}

/**
 * Implement this interface to connect the MCP server to any data source.
 * The included FileAdapter reads from local JSON files.
 * For live data, implement a GoogleAdsAdapter, MetaAdapter, etc.
 */
export interface PaidMediaAdapter {
  // Meta
  getMetadata(): Promise<{
    company_name: string;
    industry?: string;
    primary_currency: string;
    fiscal_year_start: string;
    last_updated: string;
  }>;

  // Accounts
  getAccounts(team_id?: string): Promise<Account[]>;
  getAccount(id: string): Promise<Account | null>;

  // Teams
  getTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | null>;
  getTeamByAccount(account_id: string): Promise<Team | null>;

  // Team members
  getTeamMembers(team_id?: string): Promise<TeamMember[]>;
  getTeamMember(id: string): Promise<TeamMember | null>;

  // Campaigns
  getCampaigns(filters?: CampaignFilters): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | null>;

  // Performance
  getPerformance(filters?: PerformanceFilters): Promise<PerformanceRecord[]>;
  getBenchmarks(
    platform?: Platform,
    objective?: CampaignObjective
  ): Promise<{
    avg_ctr?: number;
    avg_cpc?: number;
    avg_cpm?: number;
    avg_cpa?: number;
    avg_roas?: number;
  } | null>;

  // Attribution
  getAttributionConfigurations(): Promise<AttributionConfiguration[]>;
  getAttributionConfiguration(id: string): Promise<AttributionConfiguration | null>;

  // Reporting
  getReportingTemplates(audience?: string): Promise<ReportingTemplate[]>;
  getReportingTemplate(id: string): Promise<ReportingTemplate | null>;

  // Assets
  getAssetLibrary(): Promise<AssetLibrary>;
  getAssetCategories(type?: AssetType): Promise<AssetCategory[]>;
  getAssetCategory(id: string): Promise<AssetCategory | null>;

  // Testing
  getTestingProgram(): Promise<TestingProgram>;
  getTests(filters?: { status?: TestStatus; type?: TestType; team_id?: string; platform?: Platform }): Promise<Test[]>;
  getTest(id: string): Promise<Test | null>;

  // Audiences
  getAudienceLibrary(): Promise<AudienceLibrary>;
  getFirstPartyAudiences(filters?: { business_unit?: string; platform?: Platform }): Promise<FirstPartyAudience[]>;
  getDataProviders(status?: string): Promise<DataProvider[]>;
  getThirdPartyLayers(filters?: { platform?: Platform; is_default?: boolean; is_best_performer?: boolean }): Promise<ThirdPartyAudienceLayer[]>;

  // Measurement
  getMeasurementSetup(): Promise<MeasurementSetup>;
  getPixelTags(platform?: Platform): Promise<PixelTag[]>;
  getConversionAPIs(platform?: Platform): Promise<ConversionAPI[]>;

  // GMP Platforms / Bulk Upload
  getPlatformsConfig(): Promise<PlatformsConfig>;

  // ── Identity ──────────────────────────────────────────────────────────────

  /** All registered identity namespaces from the shared schema registry. */
  getIdentityNamespaces(category?: string): Promise<IdentityNamespace[]>;

  /** A specific namespace definition by ID. */
  getIdentityNamespace(namespace_id: string): Promise<IdentityNamespace | null>;

  // ── Attribution Results (written by Analyst agent) ─────────────────────────

  /** Latest attribution channel summary from the most recent Analyst run. */
  getLatestAttributionResults(conversion_type?: string): Promise<AttributionChannelSummary | null>;

  /** History of attribution model runs. */
  getAttributionRuns(limit?: number): Promise<AttributionRun[]>;

  // ── Agent Outputs ──────────────────────────────────────────────────────────

  /** Active data quality alerts from the Watchdog agent. */
  getWatchdogAlerts(status?: "open" | "acknowledged" | "resolved"): Promise<WatchdogAlert[]>;

  /** Insights and recommendations from the Analyst agent. */
  getAnalystInsights(filters?: { priority?: "high" | "medium" | "low"; status?: string; limit?: number }): Promise<AnalystInsight[]>;

  /** Media actions proposed by the Operator agent awaiting human approval. */
  getOperatorPendingApprovals(): Promise<OperatorPendingApproval[]>;

  /**
   * Trigger a run of a specific autonomous agent.
   * Requires PAID_MEDIA_AGENT_URL env var to be set.
   * Returns the job ID or a "pending approval" message.
   */
  triggerAgentRun(agent: "watchdog" | "analyst" | "operator", reason: string): Promise<{ triggered: boolean; job_id?: string; message: string }>;

  // ── Analytics & Data Governance ───────────────────────────────────────────

  /**
   * Return the full multi-touch path for all sessions mapped to an account domain.
   * Requires BigQuery mode.
   */
  queryAccountJourney(
    account_domain: string,
    lookback_days: number,
    conversion_type?: string
  ): Promise<{
    account_domain: string;
    entity_count: number;
    touchpoints: object[];
    conversions: object[];
    path_summary: object;
  } | null>;

  /**
   * Return capture rate time series for all monitored namespaces.
   * Reads from watchdog_capture_rate_log.
   */
  getSignalCaptureRates(
    hours_back: number,
    platform?: string
  ): Promise<object[]>;

  /**
   * Return CRM null-field statistics for recent lead records.
   */
  getCrmNullFieldStats(since_hours: number): Promise<{
    source: string;
    hours_sampled: number;
    total_leads: number;
    null_media_ids: number;
    null_pct: number;
    threshold_pct: number;
    breach: boolean;
  } | null>;

  // ── Interactive Media Actions ─────────────────────────────────────────────

  /**
   * Log and optionally execute an audience suppression on a platform.
   * Routes to the Operator agent if PAID_MEDIA_AGENT_URL is set.
   */
  pushAudienceSuppression(
    platform: string,
    advertiser_id: string,
    audience_list_id: string,
    domains: string[],
    rationale: string
  ): Promise<object>;

  /**
   * Log and optionally execute a budget reallocation between campaigns.
   * Routes to the Operator agent if PAID_MEDIA_AGENT_URL is set.
   */
  reallocateMediaBudget(
    platform: string,
    advertiser_id: string,
    source_campaign_id: string,
    target_campaign_id: string,
    amount_usd: number,
    rationale: string
  ): Promise<object>;
}
