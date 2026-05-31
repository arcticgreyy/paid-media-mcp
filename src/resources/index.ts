import type { PaidMediaAdapter } from "../adapters/base.js";

export const registerResources = (adapter: PaidMediaAdapter) => [
  {
    uri: "paid-media://overview",
    name: "Company & Team Overview",
    description: "Company metadata, all teams, and their account/platform assignments",
    mimeType: "application/json",
    handler: async () => {
      const [metadata, teams, accounts] = await Promise.all([
        adapter.getMetadata(),
        adapter.getTeams(),
        adapter.getAccounts(),
      ]);
      return JSON.stringify({ metadata, teams, accounts }, null, 2);
    },
  },

  {
    uri: "paid-media://campaigns",
    name: "All Campaigns",
    description: "Full list of all campaigns across all teams and platforms",
    mimeType: "application/json",
    handler: async () => {
      const campaigns = await adapter.getCampaigns();
      return JSON.stringify({ count: campaigns.length, campaigns }, null, 2);
    },
  },

  {
    uri: "paid-media://team-structure",
    name: "Team Structure",
    description: "All teams, their members, objectives, KPIs, and account assignments",
    mimeType: "application/json",
    handler: async () => {
      const [teams, members] = await Promise.all([
        adapter.getTeams(),
        adapter.getTeamMembers(),
      ]);
      const enriched = teams.map((t) => ({
        ...t,
        members: members.filter((m) => m.team_ids.includes(t.id)),
      }));
      return JSON.stringify({ teams: enriched }, null, 2);
    },
  },

  {
    uri: "paid-media://attribution-models",
    name: "Attribution Models",
    description: "All attribution configurations including models, windows, and conversion events",
    mimeType: "application/json",
    handler: async () => {
      const configs = await adapter.getAttributionConfigurations();
      return JSON.stringify({ count: configs.length, configurations: configs }, null, 2);
    },
  },

  {
    uri: "paid-media://reporting-templates",
    name: "Reporting Templates",
    description: "All reporting and dashboard templates by audience and cadence",
    mimeType: "application/json",
    handler: async () => {
      const templates = await adapter.getReportingTemplates();
      return JSON.stringify({ count: templates.length, templates }, null, 2);
    },
  },

  {
    uri: "paid-media://asset-library",
    name: "Asset Library",
    description: "DAM system info, asset categories, naming conventions, and per-platform specs",
    mimeType: "application/json",
    handler: async () => {
      const lib = await adapter.getAssetLibrary();
      return JSON.stringify(lib, null, 2);
    },
  },

  {
    uri: "paid-media://testing-program",
    name: "Testing Program",
    description: "Testing methodology, tools, and full test history (active, planned, completed)",
    mimeType: "application/json",
    handler: async () => {
      const program = await adapter.getTestingProgram();
      return JSON.stringify(program, null, 2);
    },
  },

  {
    uri: "paid-media://audience-library",
    name: "Audience Library",
    description: "First-party audiences, data providers, onboarding platforms, lookalike strategy, and third-party layers",
    mimeType: "application/json",
    handler: async () => {
      const lib = await adapter.getAudienceLibrary();
      return JSON.stringify(lib, null, 2);
    },
  },

  {
    uri: "paid-media://measurement-setup",
    name: "Measurement & Tracking Setup",
    description: "Tag management, pixels, conversion APIs, CM360 u-variables, website data capture, and measurement partners",
    mimeType: "application/json",
    handler: async () => {
      const setup = await adapter.getMeasurementSetup();
      return JSON.stringify(setup, null, 2);
    },
  },

  {
    uri: "paid-media://gmp-platforms",
    name: "GMP Platform Bulk Upload Schemas",
    description: "DV360 SDF, SA360 Bulksheet, and CM360 Trafficking Sheet schemas with field definitions, valid values, and org defaults",
    mimeType: "application/json",
    handler: async () => {
      const config = await adapter.getPlatformsConfig();
      return JSON.stringify(config, null, 2);
    },
  },
];
