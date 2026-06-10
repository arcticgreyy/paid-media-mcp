# paid-media-mcp — Tools, Resources & Prompts Reference

> **Generated file — do not edit the tool/resource/prompt tables by hand.**
> Regenerate with `npm run tools:md`. Edit example conversations in
> `docs/tools-examples.md`.

Complete reference for the 73 tools, 17 resources, and 17 prompt templates exposed by the paid-media-mcp server. For setup and data configuration, see [README.md](./README.md).

---

## Table of Contents

1. [Tools](#tools)
   - [Campaign tools](#campaign-tools)
   - [Team tools](#team-tools)
   - [Performance tools](#performance-tools)
   - [Attribution tools](#attribution-tools)
   - [Reporting tools](#reporting-tools)
   - [Asset tools](#asset-tools)
   - [Testing tools](#testing-tools)
   - [Audience tools](#audience-tools)
   - [Measurement tools](#measurement-tools)
   - [GMP platform tools](#gmp-platform-tools)
   - [Identity & signal tools](#identity-signal-tools)
   - [Agent integration tools](#agent-integration-tools)
   - [Analytics & live data tools](#analytics-live-data-tools)
   - [Media action tools](#media-action-tools)
   - [Account-based analytics tools](#account-based-analytics-tools)
   - [Reporting view tools](#reporting-view-tools)
2. [Resources](#resources)
3. [Prompts](#prompts)
4. [Example conversations](#example-conversations)

---

## Tools

Tools are actions Claude takes to retrieve your data. They are called automatically when relevant, or can be requested explicitly. Tools that query live BigQuery data require BigQuery mode (`PAID_MEDIA_GCP_PROJECT` env var set).

### Campaign tools

| Tool | What it does |
|---|---|
| `list_campaigns` | List and filter paid media campaigns. |
| `get_campaign` | Get full details for a single campaign by its ID. |
| `get_account` | Get details for an ad account, including which team manages it and its budget. |
| `list_accounts` | List all ad accounts, optionally filtered by team. |

### Team tools

| Tool | What it does |
|---|---|
| `list_teams` | List all media teams, their objectives, KPIs, managed platforms, and account assignments. |
| `get_team` | Get full details for a single media team: objectives, KPIs, platforms, members, and managed accounts. |
| `get_team_for_account` | Look up which team owns a given ad account. |
| `list_team_members` | List team members, their roles, platform specialties, and responsibilities. |
| `get_team_member` | Get full details for a single team member by ID. |

### Performance tools

| Tool | What it does |
|---|---|
| `get_campaign_performance` | Get historical performance data for a campaign. |
| `get_team_performance` | Get aggregated performance data across all campaigns for a team, within an optional date range. |
| `get_benchmarks` | Get industry/platform benchmarks for key metrics (CTR, CPC, CPM, CPA, ROAS) to compare against actual performance. |

### Attribution tools

| Tool | What it does |
|---|---|
| `list_attribution_models` | List all attribution configurations used by the team: model type (last-click, data-driven, etc.), windows, conversion events, and which platforms each applies to. |
| `get_attribution_model` | Get full details for a specific attribution configuration: model, window, conversion events, cross-device settings, and intended use cases. |
| `compare_attribution_models` | Compare two attribution configurations side-by-side to understand how they differ in model type, windows, conversion events, and use cases. |

### Reporting tools

| Tool | What it does |
|---|---|
| `list_reporting_templates` | List available reporting and dashboard templates. |
| `get_reporting_template` | Get the full structure of a reporting template including all sections, metrics, dimensions, and visualizations. |
| `build_performance_report` | Generate a narrative performance report for a campaign or team, combining live performance data with the appropriate reporting template. |
| `get_campaign_performance_report` | Query live campaign performance from BigQuery. |
| `get_pacing_report` | Return budget pacing status for all campaigns that have started flying. |
| `get_roas_comparison` | Compare platform-reported ROAS vs MTA attributed ROAS vs margin ROI for each channel. |
| `get_channel_efficiency` | Cross-channel efficiency report showing attributed CPA, attributed ROAS, pipeline share, and spend share per channel. |
| `get_ad_performance` | Ad/creative level performance with multi-touch attribution credit. |
| `get_keyword_performance` | Keyword performance with spend, quality scores, and Google impression share metrics. |
| `get_daily_performance` | Daily performance time series across all campaigns. |

### Asset tools

| Tool | What it does |
|---|---|
| `get_asset_library` | Get the asset library overview: DAM system name and URL, access instructions, brand and copy guidelines links, and a summary of asset categories available. |
| `list_asset_categories` | List asset categories (image, video, copy, etc.) with their storage locations, naming conventions, and platform specs. |
| `get_asset_category` | Get full details for an asset category: location URL, naming convention, and per-platform specs (dimensions, file size limits, formats, aspect ratios). |
| `get_asset_specs` | Get platform-specific asset specs (dimensions, file size, aspect ratio, duration limits) for a given asset type and platform combination. |

### Testing tools

| Tool | What it does |
|---|---|
| `get_testing_methodology` | Get the team's testing methodology: confidence threshold (e.g. |
| `list_tests` | List tests — active, planned, completed, or all. |
| `get_test` | Get full details for a single test: hypothesis, all variants, results, confidence level, primary metric lift, conclusion, and action taken. |
| `get_test_learnings` | Summarize completed test results: what was tested, which variant won, lift achieved, whether stat sig was reached, and action taken. |

### Audience tools

| Tool | What it does |
|---|---|
| `get_audience_library_overview` | Get a high-level overview of the full audience library: count of first-party audiences, contracted data providers, onboarding platforms, lookalike strategy summary, and third-party layer count. |
| `list_first_party_audiences` | List first-party audiences (CRM lists, pixel-based, customer match, suppression lists, lookalike seeds, etc.). |
| `list_data_providers` | List contracted third-party data providers (e.g. |
| `get_lookalike_strategy` | Get the full lookalike audience strategy: seed audiences used per platform, expansion percentages tested, best-performing expansion sizes, and strategic notes. |
| `list_third_party_audience_layers` | List third-party audience segments and layers used as targeting overlays. |
| `get_onboarding_platforms` | Get details on first-party data onboarding platforms and clean rooms in use (e.g. |

### Measurement tools

| Tool | What it does |
|---|---|
| `get_measurement_overview` | Get a high-level overview of the full measurement and tracking setup: tag management system, implementation type (client-side/server-side/hybrid), pixel count, conversion API count, and measurement partners. |
| `get_tag_management` | Get full tag management system details: platform (GTM, Tealium, etc.), container ID, implementation type, server-side endpoint, and configuration notes. |
| `list_pixels_and_tags` | List all platform pixels and tracking tags: implementation type (client/server-side), events tracked, custom parameters. |
| `list_conversion_apis` | List all Conversion API implementations (Meta CAPI, Google Enhanced Conversions, TikTok Events API, etc.): events sent, match rate, deduplication method. |
| `get_cm360_setup` | Get Campaign Manager 360 configuration: account ID, Floodlight configuration ID, and all u-variables (custom dimensions) with their names, types, descriptions, and example values. |
| `get_website_data_capture` | Get the website data capture setup: data layer implementation status and variables, analytics platform and property ID, first-party cookie config (domain, duration, captured data). |
| `list_measurement_partners` | List measurement and analytics partners (MMM, incrementality testing, brand lift, attribution providers). |

### GMP platform tools

| Tool | What it does |
|---|---|
| `list_bulk_upload_platforms` | List the GMP platforms that support bulk upload (DV360 SDF, SA360 Bulksheet, CM360 Trafficking Sheet) with a summary of their format, entity types, and upload process. |
| `get_bulk_upload_schema` | Get the full field schema for a platform bulk upload entity type (e.g. |
| `get_platform_org_defaults` | Get the org-configured default field values and naming conventions for a platform's entity types. |
| `get_bulk_upload_instructions` | Get step-by-step upload instructions and file naming requirements for a GMP platform's bulk upload format. |

### Identity & signal tools

| Tool | What it does |
|---|---|
| `list_identity_namespaces` | List all registered identity signal types from the shared schema namespace registry. |
| `get_identity_namespace` | Get full details for a specific identity signal namespace, including capture method, lifetime, PII status, which platforms use it, and implementation notes. |
| `get_identity_signal_coverage` | Review which identity signal namespaces are active for a given set of platforms and identify gaps in coverage. |

### Agent integration tools

| Tool | What it does |
|---|---|
| `get_attribution_results` | Get the latest multi-touch attribution results from the most recent Analyst agent run. |
| `get_attribution_run_history` | List recent attribution model runs: model used, date range, number of paths modeled, identity match rate, and run status. |
| `get_watchdog_alerts` | Get data quality alerts from the Watchdog agent. |
| `get_analyst_insights` | Get insights and recommendations produced by the Analyst agent: channel anomalies, attribution model readiness assessments, stitching quality findings, budget efficiency observations, and incrementality signals. |
| `get_pending_approvals` | Get media actions proposed by the Operator agent that are awaiting human approval. |
| `trigger_agent_run` | Trigger an on-demand run of one of the autonomous agents: 'watchdog' (data quality audit), 'analyst' (attribution model run), or 'operator' (media optimization pass). |

### Analytics & live data tools

| Tool | What it does |
|---|---|
| `query_account_journey` | Query the BigQuery data warehouse to return the full multi-touch attribution path for all users mapped to a specific company account domain. |
| `check_signal_capture_health` | Check the current capture rates for all monitored identity signal namespaces (platform click IDs and analytics cookies) against their thresholds. |
| `detect_crm_null_fields` | Scan recent CRM lead records for missing media identifier fields — a key signal that the tracking pipeline has broken. |

### Media action tools

| Tool | What it does |
|---|---|
| `push_audience_suppression` | Add a list of company domains to an audience exclusion list on a supported ad platform (DV360, Meta, LinkedIn, Google Ads, TikTok, Reddit Ads) to stop showing top-of-funnel ads to accounts already in open pipeline. |
| `reallocate_media_budget` | Shift budget from an underperforming campaign or line item to one with higher attributed pipeline contribution. |

### Account-based analytics tools

| Tool | What it does |
|---|---|
| `get_company_profile` | Look up the enriched firmographic profile for a company domain. |
| `get_target_account_funnel` | Return ranked target accounts from the dark funnel, sorted by composite priority score. |
| `get_company_sessions` | Return de-anonymized web sessions for a specific company over a lookback window. |
| `get_company_engagement` | Return the rolling engagement summary for a company, including composite intent score. |
| `get_dark_funnel_coverage` | Classify target accounts by web presence: 'dark' (never seen on website), 'lapsed' (last seen >90 days ago), or 'visible' (recent web activity detected). |
| `get_target_account_activity` | Return the daily activity history for a specific target account: web sessions (today/7d/30d/90d), pricing and demo visits, paid touchpoints, intent spikes, and coverage completeness score. |

### Reporting view tools

| Tool | What it does |
|---|---|
| `get_campaign_performance_metrics` | Query daily campaign spend, impressions, clicks, and platform-reported conversions across all active channels (Meta, Google Ads, TikTok, Reddit) from the unified `v_unified_daily_spend` BigQuery view. |
| `get_campaign_downstream_roi` | Compare campaign performance across three measurement layers using the `v_reporting_campaign_roi` BigQuery view: • **Platform layer** — ad-network pixel conversions and platform CPA • **Traffic layer** — paid sessions, unique visitors, and web conversion events via GA4 • **Revenue layer** — CRM leads, MQLs, Closed-Won count, pipeline ARR, and revenue ROAS Also includes MTA attribution comparison (attributed ROAS vs. |
| `get_monthly_budget_pacing` | Retrieve current calendar-month pacing status for all active campaigns from the `v_reporting_monthly_pacing` BigQuery view. |

---

## Resources

Resources are reference documents Claude can read for context (schemas, conventions, contracts).

| Resource URI | Name | Description |
|---|---|---|
| `paid-media://system` | Paid Media MCP — System Context | Start here. |
| `paid-media://overview` | Company & Team Overview | Company metadata, all teams, and their account/platform assignments |
| `paid-media://campaigns` | All Campaigns | Full list of all campaigns across all teams and platforms |
| `paid-media://team-structure` | Team Structure | All teams, their members, objectives, KPIs, and account assignments |
| `paid-media://attribution-models` | Attribution Models | All attribution configurations including models, windows, and conversion events |
| `paid-media://reporting-templates` | Reporting Templates | All reporting and dashboard templates by audience and cadence |
| `paid-media://asset-library` | Asset Library | DAM system info, asset categories, naming conventions, and per-platform specs |
| `paid-media://testing-program` | Testing Program | Testing methodology, tools, and full test history (active, planned, completed) |
| `paid-media://audience-library` | Audience Library | First-party audiences, data providers, onboarding platforms, lookalike strategy, and third-party layers |
| `paid-media://measurement-setup` | Measurement & Tracking Setup | Tag management, pixels, conversion APIs, CM360 u-variables, website data capture, and measurement partners |
| `paid-media://gmp-platforms` | GMP Platform Bulk Upload Schemas | DV360 SDF, SA360 Bulksheet, and CM360 Trafficking Sheet schemas with field definitions, valid values, and org defaults |
| `paid-media://schema/identity` | Identity Schema Reference | The paid-media-schema identity layer table schemas: identity_signals, identity_entities, identity_entity_signals, identity_stitching_log. |
| `paid-media://schema/attribution` | Attribution Schema Reference | The paid-media-schema attribution layer table schemas: attribution_paths, attribution_runs, attribution_results, attribution_channel_summary. |
| `paid-media://config/attribution-milestones` | Attribution Milestones & Model Config | B2B pipeline stage definitions and attribution model weight configurations. |
| `paid-media://schema/reporting` | Reporting Views Schema Reference | The paid-media-schema reporting layer view schemas (06_reporting.sql): v_campaign_performance, v_pacing_status, v_roas_comparison, v_channel_efficiency, v_ad_performance, v_keyword_performance, v_daily_performance. |
| `paid-media://account-analytics/overview` | Account Analytics Overview | Summary of B2B dark funnel visibility: top target accounts by intent, dark funnel coverage breakdown (dark/lapsed/visible), and recent intent spikes. |
| `paid-media://agent-status` | Autonomous Agent Status | Current status of all three autonomous agents: latest Watchdog alerts, most recent Analyst attribution run, and any Operator actions pending approval. |

---

## Prompts

Prompt templates for common workflows — invoke from the prompt picker in Claude.

| Prompt | Description |
|---|---|
| `campaign_performance_review` | Generate a structured performance review for a campaign over a given period, including pacing analysis and recommendations. |
| `team_weekly_report` | Generate a weekly performance report for a media team across all their campaigns. |
| `attribution_analysis` | Explain how different attribution models would affect campaign credit allocation and recommend the best model for a given objective. |
| `budget_pacing_check` | Check whether all active campaigns are on track to deliver their budgets by end of flight. |
| `channel_mix_analysis` | Analyze the current channel/platform mix and recommend optimizations based on performance and objectives. |
| `test_and_learn_review` | Review the full test-and-learn history for a team, summarize key learnings, and recommend next tests based on gaps in the testing roadmap. |
| `audience_strategy_review` | Review the full audience strategy for a platform: first-party segments available, lookalike setup, third-party layers in use, and recommendations for improving targeting efficiency. |
| `measurement_audit` | Audit the full measurement and tracking setup: identify gaps, deduplication risks, signal quality issues, and attribution reliability concerns. |
| `asset_readiness_check` | Check whether assets are ready for a campaign launch: verify specs compliance, identify missing sizes or formats, and confirm asset locations. |
| `create_campaign_brief` | Design a new paid media campaign using your team's historical performance, audience library, attribution setup, and platform knowledge. |
| `optimize_campaign` | Analyze a campaign's performance and produce a prioritized optimization action list. |
| `analyze_performance` | Generate a comprehensive performance analysis across all campaigns for a team or the full portfolio. |
| `create_report` | Generate a formatted performance report for a specific audience (executive, media team, client, internal) using your configured reporting templates. |
| `generate_attribution_report` | Generate a cross-channel attribution analysis comparing how different attribution models distribute credit across platforms and campaigns, and recommend the optimal model for each use case. |
| `generate_bulk_upload` | Generate a ready-to-upload bulk file for DV360 (SDF), SA360 (Bulksheet), or CM360 (Trafficking Sheet) based on a campaign brief or optimization action list. |
| `diagnose_tracking_drop` | Watchdog workflow: diagnose a suspected tracking degradation across the full pipeline. |
| `optimize_high_value_pathways` | Analyst workflow: identify campaigns that are driving outsized pipeline contribution but are being underfunded, and recommend precise budget reallocations grounded in multi-touch attribution data. |

---

## Example conversations

Once connected, you can ask Claude things like:

**Campaign lookup**
> "What active Meta campaigns does the performance team have running right now?"

> "Show me all upper-funnel campaigns tagged q2-2026."

**Performance analysis**
> "How did the search always-on campaign perform last week? Compare it to our benchmarks."

> "Which of our campaigns had the best ROAS in May?"

**Pacing**
> "Is our Q2 Meta prospecting campaign on pace to deliver its budget?"

> "Check pacing across all active campaigns as of today."

**Team and ownership**
> "Who manages the LinkedIn account and what are their KPIs?"

> "I need to talk to someone about our Meta creative strategy — who should I contact?"

**Attribution**
> "We're seeing a big discrepancy between Meta reported conversions and GA4. Can you explain why that might be based on our attribution setup?"

> "Should we use last-click or data-driven attribution for our Google Shopping campaigns?"

**Reporting**
> "Write a weekly performance report for the performance team for the week of May 26."

> "Generate an executive summary of our Q2 paid media results."

**Assets**
> "What video specs do I need for TikTok? What about YouTube?"

> "Where do I find the Q2 brand campaign assets and what's the naming convention?"

> "Are we ready to launch the Meta prospecting campaign? Do we have all the required creative sizes?"

**Testing — in-campaign**
> "What have we learned from our Meta creative tests this year?"

> "We want to test bid strategies on Google Ads — has anyone tested tROAS vs tCPA before? What happened?"

> "What should we test next on LinkedIn? We haven't run any tests there in 6 months."

> "Is the TikTok creator test statistically significant yet?"

**Testing — vendor and partner evaluations**
> "Have we ever evaluated The Trade Desk vs. DV360? What did we find?"

> "Our social agency contract is up for renewal. Do we have any historical evaluation data on their performance?"

> "We're considering adding Taboola to the media plan. Have we tested native ad networks before? What was the outcome?"

> "What vendor and tool evaluations do we have on record? I want to see all of them."

> "We're evaluating a new MMM provider — what criteria did we use last time we reviewed our measurement tools?"

**Audiences**
> "What first-party audiences do we have available on Meta right now?"

> "Explain our lookalike strategy — what seed audiences are we using and what expansion size performs best?"

> "We have an Experian contract — are we using all the segments we're paying for?"

> "What third-party audience layers should we apply to a new DV360 campaign targeting homeowners?"

**Measurement**
> "Do we have server-side tracking on Meta? What's our Conversions API match rate?"

> "What are our CM360 u-variables and what does u3 capture?"

> "We're seeing a discrepancy between Meta CAPI and GA4 purchase counts — why might that happen based on our setup?"

> "Is our data layer capturing order value correctly for all conversion events?"

> "What measurement partners do we use and when is our next MMM run?"

**Campaign creation**
> "Create a campaign brief for a Meta prospecting campaign. Objective: conversions. Budget: $30,000/month. Team: performance. Start: July 1."

> "Build the same brief but output it as a DV360 SDF so I can upload it directly."

> "I need a new SA360 campaign for the brand team — here's the brief: [paste brief]. Generate the bulksheet."

**Optimization**
> "Audit campaign C-001 for May. What's underperforming and what should I change?"

> "Optimize that campaign and give me the DV360 SDF edits so I can upload them."

**Performance analysis**
> "Analyze full portfolio performance for Q2 2026 and compare it to Q1."

> "How did the performance team do in May vs. April? Break it down by channel."

**Reporting**
> "Write a client-ready report for the performance team covering May 2026."

> "Generate an executive summary of Q2 results for the whole portfolio."

**Attribution**
> "Generate an attribution report for the performance team for Q2. Which model should we use for each channel?"

**GMP bulk upload**
> "What entity types does the DV360 SDF support and what fields are required for a line item?"

> "Show me our org defaults for SA360 — what naming convention and bid strategy do we use by default?"

> "Generate a DV360 SDF to pause all line items in campaign C-001."

> "What's the process for uploading a CM360 trafficking sheet? Walk me through it step by step."

**Account-based analytics** _(BigQuery mode)_
> "Pull the attribution journey for cloudflare.com — every paid touchpoint in the last 90 days."

> "Which of our target accounts are actively engaging with paid media this week?"

> "How many target accounts are we missing entirely in our identity graph? Which verticals are dark?"

> "Show me the funnel stage breakdown across all target accounts."

**Data governance** _(BigQuery mode)_
> "Are there any open Watchdog alerts I should know about?"

> "What's our gclid capture rate trending at this week?"

> "How many CRM leads in the last 30 days have no paid media identifiers attached?"

**Channel efficiency** _(BigQuery mode)_
> "Give me a cross-channel ROAS comparison for the last 30 days."

> "Which campaigns are overpacing and underpacing right now?"

> "Show me ad-level performance for the Meta prospecting campaign this month — which creative is dragging the CPA?"
