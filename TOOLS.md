# paid-media-mcp — Tools, Resources & Prompts Reference

Complete reference for the 68 tools, 17 resources, and 15 prompt templates exposed by the paid-media-mcp server. For setup and data configuration, see [README.md](./README.md).

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
   - [Analytics & live data tools](#analytics--live-data-tools)
   - [Account-based analytics tools](#account-based-analytics-tools)
   - [Identity & signal tools](#identity--signal-tools)
   - [Data governance tools](#data-governance-tools)
   - [Agent integration tools](#agent-integration-tools)
   - [Media action tools](#media-action-tools)
2. [Resources](#resources)
   - [Org knowledge resources](#org-knowledge-resources)
   - [Schema & data contract resources](#schema--data-contract-resources)
   - [Live data resources](#live-data-resources)
3. [Prompts](#prompts)
   - [Analysis prompts](#analysis-prompts)
   - [Action prompts](#action-prompts)
4. [Example conversations](#example-conversations)

---

## Tools

Tools are actions Claude takes to retrieve your data. They are called automatically when relevant, or can be requested explicitly.

### Campaign tools

| Tool | What it does |
|---|---|
| `list_campaigns` | Filter campaigns by team, platform, status, objective, funnel stage, or tag |
| `get_campaign` | Full details for one campaign by ID |
| `list_accounts` | All accounts, optionally filtered by team |
| `get_account` | Full account details by ID |

### Team tools

| Tool | What it does |
|---|---|
| `list_teams` | All teams with objectives, KPIs, platforms |
| `get_team` | Team details + its members + its accounts |
| `get_team_for_account` | Which team owns a given account |
| `list_team_members` | Members, optionally filtered by team |
| `get_team_member` | Full member details |

### Performance tools

| Tool | What it does |
|---|---|
| `get_campaign_performance` | Per-day records + aggregated totals for a campaign |
| `get_team_performance` | Aggregated totals by team, broken down per campaign |
| `get_benchmarks` | Industry benchmarks by platform and objective |

### Attribution tools

| Tool | What it does |
|---|---|
| `list_attribution_models` | All configured attribution setups |
| `get_attribution_model` | Full details for one model |
| `compare_attribution_models` | Side-by-side diff of two models |

### Reporting tools

| Tool | What it does |
|---|---|
| `list_reporting_templates` | Templates filtered by audience |
| `get_reporting_template` | Full template with all sections |
| `build_performance_report` | Assembles raw data + template for Claude to narrate |

### Asset tools

| Tool | What it does |
|---|---|
| `get_asset_library` | DAM system info, access instructions, guidelines links, category summary |
| `list_asset_categories` | All asset categories, optionally filtered by type (image, video, copy, etc.) |
| `get_asset_category` | Full details for one category: location, naming convention, specs |
| `get_asset_specs` | Platform-specific specs (dimensions, file size, format) for a given asset type and platform |

### Testing tools

| Tool | What it does |
|---|---|
| `get_testing_methodology` | Confidence threshold, stat sig rules, winner criteria, and testing tools in use |
| `list_tests` | All tests filtered by status, type, team, or platform — covers both A/B tests and vendor/partner evaluations |
| `get_test` | Full details for one test: hypothesis, all variants, results, and vendor context (for DSP/agency/tool evaluations) |
| `get_test_learnings` | Summarized learnings from completed tests — includes recommendation field for vendor evaluations |

### Audience tools

| Tool | What it does |
|---|---|
| `get_audience_library_overview` | High-level summary: 1P count, data providers, onboarding platforms, LAL strategy |
| `list_first_party_audiences` | All 1P segments filtered by business unit or platform |
| `list_data_providers` | Contracted data providers filtered by contract status |
| `get_lookalike_strategy` | Full LAL strategy: seed audiences, expansion sizes, best performers |
| `list_third_party_audience_layers` | Overlay segments filtered by platform, default use, or best-performer flag |
| `get_onboarding_platforms` | Data onboarding and clean room platforms in use |

### Measurement tools

| Tool | What it does |
|---|---|
| `get_measurement_overview` | High-level tracking stack: TMS, pixel count, CAPI count, measurement partners |
| `get_tag_management` | TMS details: platform, container ID, implementation type, server-side endpoint |
| `list_pixels_and_tags` | All platform pixels filtered by platform: events tracked, implementation |
| `list_conversion_apis` | All Conversion API implementations: events, match rate, deduplication method |
| `get_cm360_setup` | CM360 account, Floodlight config ID, and all u-variables with descriptions |
| `get_website_data_capture` | Data layer status/variables, analytics platform, first-party cookie setup |
| `list_measurement_partners` | MMM, incrementality, brand lift, attribution partners filtered by type |

### GMP platform tools

| Tool | What it does |
|---|---|
| `list_bulk_upload_platforms` | Lists configured GMP platforms (DV360, SA360, CM360) with a summary of supported entity types |
| `get_bulk_upload_schema` | Full field schema for a platform + entity type combo (e.g. DV360 line_item), including required fields, valid values, and org defaults |
| `get_platform_org_defaults` | All org-level defaults for a platform: naming conventions, standard field values, notes |
| `get_bulk_upload_instructions` | Step-by-step instructions for generating and uploading a bulk file for DV360 SDF, SA360 Bulksheet, or CM360 Trafficking Sheet |

### Analytics & live data tools

These tools query the live BigQuery data layer on-demand — the same data the autonomous agents monitor on a schedule. Require BigQuery mode (`BIGQUERY_PROJECT_ID` env var set).

| Tool | What it does |
|---|---|
| `get_daily_performance` | Daily spend + impressions + clicks + conversions by platform and campaign for a date range |
| `get_ad_performance` | Ad-level (creative-level) performance metrics — identify top and bottom performers within a campaign |
| `get_keyword_performance` | Keyword-level performance for search campaigns — spend, clicks, conversions, CPC, Quality Score |
| `get_pacing_report` | Budget pacing status across active campaigns — expected vs. actual spend, over/under-pacing flags |
| `get_channel_efficiency` | Cross-channel efficiency ranking — ROAS, CPA, and marginal ROI comparison by platform |
| `get_roas_comparison` | ROAS by campaign and channel side-by-side, with trend indicators vs. the prior period |
| `get_campaign_performance_report` | Full campaign performance report assembled for a specified date range and campaign set |

### Account-based analytics tools

Account-level B2B attribution — IP-resolved company profiles, session journeys, and pipeline funnel tracking. Require BigQuery mode.

| Tool | What it does |
|---|---|
| `get_company_profile` | IP-resolved firmographic profile for a target account: company name, domain, industry, employee count, intent score |
| `get_company_sessions` | All website sessions attributed to a specific company domain, with session depth and UTM attribution |
| `get_company_engagement` | Engagement summary for a company across all paid channels — touches, sessions, funnel stage |
| `get_target_account_activity` | Recent activity for a target account list — signals pipeline accounts are engaging with paid media |
| `get_target_account_funnel` | Funnel stage distribution for a target account list: awareness → engaged → MQL → opportunity |
| `get_dark_funnel_coverage` | Coverage of target accounts in identity graph — which accounts are visible vs. dark (no match) |

### Identity & signal tools

| Tool | What it does |
|---|---|
| `list_identity_namespaces` | All registered signal types (gclid, fbclid, li_fat_id, ttclid, GA4 client_id, etc.) with capture quality and coverage |
| `get_identity_namespace` | Full details for one namespace: signal type, platform, match confidence, and schema |
| `get_identity_signal_coverage` | Which signals are being captured for a given platform set — identifies gaps |
| `query_account_journey` | Full multi-touch attribution path for a specific company domain across all channels |

### Data governance tools

| Tool | What it does |
|---|---|
| `get_watchdog_alerts` | Active data quality alerts from the Watchdog agent — signal failures, CRM anomalies, forensic trap triggers |
| `check_signal_capture_health` | Live capture rates for all monitored identity namespaces with trend indicators |
| `detect_crm_null_fields` | CRM records missing paid media identifiers — surfaces attribution gaps at the lead level |

### Agent integration tools

| Tool | What it does |
|---|---|
| `get_analyst_insights` | Findings and recommendations from the most recent Analyst agent run |
| `get_attribution_results` | Multi-touch attribution credit output by channel from the latest model run |
| `get_attribution_run_history` | History of all attribution model runs with model type, date, and status |
| `get_pending_approvals` | Operator agent actions awaiting human approval before execution |
| `trigger_agent_run` | Trigger an on-demand run of Watchdog, Analyst, or Operator |

### Media action tools

| Tool | What it does |
|---|---|
| `push_audience_suppression` | Add company domains to platform exclusion lists (DV360, Meta, LinkedIn) — suppress pipeline accounts from top-of-funnel acquisition |
| `reallocate_media_budget` | Shift budget between campaigns across platforms (DV360, SA360, Meta, LinkedIn) with guardrail enforcement |

---

## Resources

Resources are documents Claude can read as context (similar to attaching a file). Claude reads `paid-media://system` automatically on startup to understand the deployment mode.

### Org knowledge resources

| Resource URI | What it contains |
|---|---|
| `paid-media://system` | Server mode (BigQuery vs. JSON), connected data sources, and tool routing guide — Claude reads this first to understand the deployment context |
| `paid-media://overview` | Company metadata + all teams + all accounts |
| `paid-media://campaigns` | All campaigns |
| `paid-media://team-structure` | Teams enriched with their members |
| `paid-media://attribution-models` | All attribution configurations |
| `paid-media://reporting-templates` | All reporting templates |
| `paid-media://asset-library` | Full asset library: DAM info, categories, and specs |
| `paid-media://testing-program` | Full testing program: methodology, tools, and all tests |
| `paid-media://audience-library` | Full audience library: 1P, providers, LAL strategy, 3P layers |
| `paid-media://measurement-setup` | Full tracking stack: TMS, pixels, APIs, CM360, data capture |
| `paid-media://gmp-platforms` | DV360 SDF v7, SA360 Bulksheet, and CM360 Trafficking Sheet schemas with org defaults |

### Schema & data contract resources

| Resource URI | What it contains |
|---|---|
| `paid-media://schema/identity` | Identity graph table schemas — entity, signal, and namespace definitions for text-to-SQL |
| `paid-media://schema/attribution` | Attribution table schemas, credit formula weights, and model run structure |
| `paid-media://schema/reporting` | Reporting view schemas — pre-built cross-channel metrics structure |
| `paid-media://config/attribution-milestones` | B2B pipeline stage definitions, conversion type values, and model credit weights |

### Live data resources

| Resource URI | What it contains |
|---|---|
| `paid-media://account-analytics/overview` | Account-based analytics summary — coverage stats, top engaged accounts, dark funnel gap |
| `paid-media://agent-status` | Current status of all three autonomous agents (Watchdog, Analyst, Operator) with last run timestamps |

---

## Prompts

Pre-built prompt templates that guide Claude through multi-step analysis tasks. Access them from Claude's prompt picker (the `/` command in supported clients).

### Analysis prompts

| Prompt | Arguments | What it does |
|---|---|---|
| `campaign_performance_review` | `campaign_id`, `date_from`, `date_to` | Full performance review with pacing and benchmark comparison |
| `team_weekly_report` | `team_id`, `week_start` | Weekly scorecard using your team's reporting template |
| `attribution_analysis` | `campaign_id` | Explains model options and recommends the right one for the campaign objective |
| `budget_pacing_check` | `team_id` (optional), `check_date` | Flags over/under-pacing campaigns with specific actions |
| `channel_mix_analysis` | `team_id`, `date_from`, `date_to` | Channel efficiency ranking and reallocation recommendations |
| `test_and_learn_review` | `team_id` (optional), `platform` (optional) | Summarizes test history, active tests, gaps, and recommends next experiments |
| `audience_strategy_review` | `platform` | Full audience strategy audit: 1P usage, LAL quality, 3P layer gaps, recommendations |
| `measurement_audit` | _(none)_ | End-to-end tracking audit: signal gaps, deduplication risks, attribution reliability |
| `asset_readiness_check` | `campaign_id` | Checks whether required assets exist for a campaign's platform and generates a trafficking checklist |

### Action prompts

These prompts guide Claude through complex, multi-step tasks that produce structured outputs — campaign briefs, optimization plans, reports, or upload-ready GMP bulk files.

| Prompt | Arguments | What it does |
|---|---|---|
| `create_campaign_brief` | `objective`, `platform`, `team_id`, `budget`, `start_date`, `end_date` (optional), `output_format` (optional), `additional_context` (optional) | Generates a full campaign brief informed by team context, historical benchmarks, audience strategy, creative specs, and test learnings. Set `output_format` to `dv360_sdf`, `sa360_bulksheet`, or `cm360_trafficking_sheet` to get upload-ready CSV output instead of a brief narrative. |
| `optimize_campaign` | `campaign_id`, `date_from`, `date_to`, `output_format` (optional) | Audits an active campaign's performance vs. benchmarks and produces a prioritized optimization action list. Set `output_format` to a GMP platform to get edit rows for bulk upload directly. |
| `analyze_performance` | `team_id` (optional), `date_from`, `date_to`, `compare_to_prior_period` (optional) | Full portfolio or team performance analysis with KPI scorecard, channel breakdown, trend analysis, top/bottom performers, and recommendations. Automatically calculates the prior period for comparison. |
| `create_report` | `audience`, `scope`, `date_from`, `date_to`, `template_id` (optional) | Generates an audience-appropriate report (executive, media_team, client, or internal) using your configured reporting templates. `scope` can be `all`, a `team_id`, or a `campaign_id`. |
| `generate_attribution_report` | `team_id` (optional), `date_from`, `date_to` | Cross-channel model comparison, signal quality assessment, incrementality context, and per-use-case attribution recommendations based on your configured models and measurement setup. |
| `generate_bulk_upload` | `platform`, `action`, `campaign_id` (optional), `brief_context` (optional) | Generates a ready-to-upload GMP bulk file (DV360 SDF, SA360 Bulksheet, or CM360 Trafficking Sheet) for a given action. Pulls your org defaults from `platforms.json` and pre-fills naming conventions, standard field values, and audience targeting. |

**`output_format` values for `create_campaign_brief` and `optimize_campaign`:**

| Value | Output |
|---|---|
| `brief` (default) | Narrative campaign brief or optimization action plan |
| `dv360_sdf` | DV360 SDF v7-compatible CSV sections (Campaign, Insertion Order, Line Item, Ad Group) |
| `sa360_bulksheet` | SA360 Bulksheet CSV with Row Type column (Campaign, Ad Group, Keyword, Ad) |
| `cm360_trafficking_sheet` | CM360 Trafficking Sheet column structure (Placement, Ad, Creative) for pasting into the Excel template |

> **CM360 note:** CM360 requires uploading changes via its own Excel template, not a generated CSV. When using CM360 output format, Claude produces column-matching content for you to paste into your downloaded trafficking sheet.

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
