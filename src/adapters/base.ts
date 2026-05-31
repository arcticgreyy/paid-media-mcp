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
}
