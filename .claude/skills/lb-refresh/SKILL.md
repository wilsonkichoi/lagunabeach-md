---
name: lb-refresh
description: |
  Refresh LagunaBeach.md dashboard data — regenerate all prebuild dashboard
  JSONs (article-health baseline, immune score, dashboard-data, alerts) plus
  llms.txt. Does NOT fetch external analytics (no GA4/Search Console/Cloudflare
  accounts yet). Thin wrapper over the existing prebuild:dashboard + prebuild:llms
  npm scripts.
  TRIGGER when: user says "refresh", "dashboard update", "regenerate dashboards",
  "/lb-refresh", "dashboard data stale", or after editing articles that affect
  health scores.
allowed-tools:
  - Bash
  - Read
---

# 🌊 LagunaBeach.md — Refresh Dashboard Data (thin wrapper)

> Gate: run `/lb-become` if not already awake this session.

## What this does

Regenerates the committed dashboard JSON files that power the `/data` page and
internal health monitoring. No external API calls (LB has no GA4/Search
Console/Cloudflare accounts wired yet).

## Run

```bash
npm run prebuild:dashboard && npm run prebuild:llms
```

### What prebuild:dashboard executes (4-step chain)

| #   | Script                                                                                        | Output                                                        |
| --- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | `python3 scripts/tools/article-health.py --baseline-out scripts/tools/.quality-baseline.json` | Quality baseline (18 articles scanned)                        |
| 2   | `python3 scripts/core/generate-dashboard-immune.py`                                           | `public/api/dashboard-immune.json` (6-dimension immune score) |
| 3   | `node scripts/core/generate-dashboard-data.js`                                                | `public/api/dashboard-alerts.json` context data               |
| 4   | `node scripts/core/generate-dashboard-alerts.mjs`                                             | `public/api/dashboard-alerts.json` (red/yellow alerts)        |

### What prebuild:llms executes

| #   | Script                                      | Output                                          |
| --- | ------------------------------------------- | ----------------------------------------------- |
| 1   | `python3 scripts/tools/refresh-llms-txt.py` | `public/llms.txt` (LLM-crawler knowledge guide) |

## When to run manually

- After editing articles (changes health scores, immune dimensions)
- After adding/removing articles (changes article count, alert thresholds)
- When the `/data` dashboard looks stale
- Before a release to ensure committed JSONs are fresh

All these scripts also run during `npm run prebuild` (dashboard in parallel
batch, llms in parallel batch), so manual runs are for pre-commit freshness
checks.

## Committed outputs (DO NOT delete)

- `scripts/tools/.quality-baseline.json` — CI baseline for article health
- `public/api/dashboard-immune.json`
- `public/api/dashboard-alerts.json`
- `public/llms.txt`

## Not wired (LB has no accounts yet)

- `scripts/tools/refresh-data.sh` — the full 14-step Taiwan pipeline (includes
  GA4/SC/CF fetch, spore sync, GitHub stats). Not applicable until LB deploys
  and connects analytics.
- `scripts/tools/generate-dashboard-analytics.py` — GA4 data; stale Taiwan
  artifact (Phase 7 cleanup candidate).
