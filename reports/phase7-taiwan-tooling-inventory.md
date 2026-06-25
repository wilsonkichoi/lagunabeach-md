# Phase 7 Taiwan-Tooling Disposition Inventory

This inventory catalogs every dormant Taiwan-inheritance script and skill remaining
in the repo. Originally produced as a pre-deletion triage (R15); updated R16 after
Wilson approved Batch A/B + twmd-bench deletion and split Batch C into port-first (7)

- held (twmd-become).

## Disposition key

| Code                 | Meaning                                                        | Action                                        |
| -------------------- | -------------------------------------------------------------- | --------------------------------------------- |
| 1. generic-keep      | LB needs this capability; in build chain or trivially reusable | Keep as-is (Taiwan ref is stale comment only) |
| 2. port-seed-dormant | Capability-specific, adapt when LB grows the precondition      | Keep dormant until precondition met           |
| 3. superseded-delete | An existing `lb-*` already replaces it                         | Safe to delete                                |
| 4. no-analog-delete  | No LB path exists or can exist                                 | Safe to delete                                |

## Headline counts (post-R16 deletions)

| Disposition            | scripts/bench/  | scripts/tools/ | Skills                        | Total   |
| ---------------------- | --------------- | -------------- | ----------------------------- | ------- |
| 1. generic-keep        | 0               | 48             | 0                             | 48      |
| 2. port-seed-dormant   | 0               | 38             | 7 (idea-reusable, port-first) | 45      |
| 3. superseded-delete   | 0               | 0              | 3 (DELETED R16)               | 3       |
| 4. no-analog-delete    | 9 (DELETED R16) | 0              | 1 (DELETED R16)               | 10      |
| 5. held (load-bearing) | 0               | 0              | 1 (twmd-become)               | 1       |
| **Total inventoried**  | **9**           | **86**         | **12**                        | **107** |
| **Deleted this round** | 9               | 0              | 4                             | **13**  |

---

## A. scripts/bench/ (9 files, all disposition 4)

The entire `scripts/bench/` directory implements Sovereignty-Bench-TW, a Taiwan-specific
LLM benchmark measuring sovereignty-preservation in Chinese AI models. LB dropped the
sovereignty lens per CLAUDE.md ("Sovereignty-preservation framing ... is irrelevant here
and intentionally not carried forward"). No LB analog exists or is planned.

| path                                       | type   | build chain? | disp. | evidence                                                     |
| ------------------------------------------ | ------ | ------------ | ----- | ------------------------------------------------------------ |
| `scripts/bench/run-bench.sh`               | script | No           | 4     | No `package.json` ref. 0 consumers outside `scripts/bench/`. |
| `scripts/bench/runner.py`                  | script | No           | 4     | Same. Internal self-refs only.                               |
| `scripts/bench/scorer.py`                  | script | No           | 4     | Same.                                                        |
| `scripts/bench/merge-judgments.py`         | script | No           | 4     | Same.                                                        |
| `scripts/bench/generate-public-results.py` | script | No           | 4     | Same.                                                        |
| `scripts/bench/providers/__init__.py`      | script | No           | 4     | Same.                                                        |
| `scripts/bench/providers/base.py`          | script | No           | 4     | Same.                                                        |
| `scripts/bench/providers/ollama.py`        | script | No           | 4     | Same.                                                        |
| `scripts/bench/providers/openrouter.py`    | script | No           | 4     | Same.                                                        |

**Consumer count for batch:** 0 outside the directory itself. Only self-references (`runner.py` imports `scorer.py`, etc.).

---

## B. scripts/tools/ — Taiwan-ref files (86 items)

### B.1 In build chain (disposition 1: generic-keep)

These scripts are referenced in `package.json` `prebuild:*`/`postbuild:*`/`build` and
execute on every deploy. Taiwan refs are stale comments only (0-2 refs each). **Never delete.**

| path                             | package.json script                    | Taiwan refs | notes                                               |
| -------------------------------- | -------------------------------------- | ----------- | --------------------------------------------------- |
| `article-health.py`              | `prebuild:dashboard`, `article-health` | 0           | Core quality tool                                   |
| `article-health.config.toml`     | (loaded by article-health.py)          | 1           | Config for above                                    |
| `lib/article_health/` (21 files) | (imported by article-health.py)        | ~50 total   | Checks library; refs are terminology/prose examples |
| `lib/sense_client.py`            | (imported by analytics scripts)        | 5           | Sense API client                                    |
| `sync-translations-json.py`      | `prebuild:status`                      | 0           |                                                     |
| `sync-spore-links.py`            | `prebuild:status`                      | 1           |                                                     |
| `verify-contributors.mjs`        | `prebuild:verify-contributors`         | 0           |                                                     |
| `generate-spore-records.py`      | `prebuild:spores`                      | 0           |                                                     |
| `generate-dashboard-spores.py`   | `prebuild:spores`                      | 1           |                                                     |
| `i18n-coverage-audit.sh`         | `prebuild:i18n`                        | 1           |                                                     |
| `generate-content-stats.js`      | `prebuild:content-stats`               | 0           |                                                     |
| `refresh-llms-txt.py`            | `prebuild:llms`                        | 0           |                                                     |
| `update-stats.sh`                | `prebuild:stats`                       | 2           |                                                     |
| `verify-internal-links.sh`       | `postbuild:internal-links`             | 0           |                                                     |
| `image-ingest.mjs`               | `image-ingest`                         | 2           |                                                     |
| `lang-sync/status.py`            | `prebuild:status`                      | 1           | Only `status.py` in chain                           |

**Subtotal: 16 entries (counting `lib/` as 1 group) = 37 files**

### B.2 Not in build chain, but generic editorial/quality tooling (disposition 1: generic-keep)

These serve LB editorial workflows directly (quality checks, terminology, linting,
link validation, i18n, media processing). Taiwan refs are stale comments/examples
that would be trivially cleaned in a comment pass. No deletion warranted.

| path                              | Taiwan refs         | LB capability served                        |
| --------------------------------- | ------------------- | ------------------------------------------- |
| `footnote-format-fix.py`          | 8                   | Markdown footnote normalization             |
| `check-canonical-frontmatter.py`  | 2                   | Frontmatter schema enforcement              |
| `check-cjk-punct.py`              | 0                   | CJK punctuation linting (zh-TW content)     |
| `check-freshness.js`              | 2                   | Staleness detection                         |
| `verify_internal_links.py`        | 2                   | Python link checker (used by `.sh` wrapper) |
| `terminology-prose-fix.py`        | 5                   | Terminology consistency                     |
| `terminology-yaml-audit.py`       | 50                  | Terminology YAML validation                 |
| `terminology-yaml-clean.py`       | 8                   | YAML dedup/clean                            |
| `terminology-yaml-dedup.py`       | 3                   | YAML dedup                                  |
| `i18n-fill-gaps.py`               | 2                   | Translation gap-filler                      |
| `i18n-translate.py`               | 5                   | Translation helper                          |
| `check-hardcoded-langs.sh`        | 0                   | Hardcoded language audit                    |
| `check-language-registry-sync.sh` | 0                   | Language registry sync check                |
| `check-scoped-css-size.mjs`       | 0                   | CSS size guard                              |
| `category-check.sh`               | 0                   | Category validation                         |
| `check-aspect.sh`                 | 1                   | Image aspect ratio check                    |
| `assign-subcategory.cjs`          | 1                   | Subcategory assignment util                 |
| `orphan-translation-check.sh`     | 0                   | Orphan translation detection                |
| `people-title-check.sh`           | 0                   | People article title format                 |
| `translation-ratio-check.sh`      | 0                   | Translation ratio monitoring                |
| `backfill-translated-from.py`     | 0                   | Frontmatter backfill                        |
| `dead-cross-ref-scan.sh`          | 0                   | Dead wikilink detection                     |
| `cross-link.sh`                   | 1                   | Cross-link insertion                        |
| `og-rename-sync.mjs`              | 0                   | OG image rename sync                        |
| `land-media-batch.mjs`            | 0                   | Media landing script                        |
| `migrate-images-webp.mjs`         | 0                   | WebP migration                              |
| `viz-shot.mjs`                    | 0                   | Visual screenshot capture                   |
| `sitemap-prune-hreflang.sh`       | 5                   | Hreflang pruning (stale TW refs)            |
| `fix-fn-comma.sh`                 | 0                   | Footnote comma fix                          |
| `build-parity-diff.sh`            | 0                   | Build parity check                          |
| `analyze-crawler-404.py`          | 0                   | 404 analysis                                |
| `attribution-risk-audit.py`       | 0                   | Attribution auditing                        |
| `wiki-fetch.py`                   | 0                   | Wikipedia data fetcher                      |
| `bulk-pr-analyze.sh`              | 0                   | PR analysis                                 |
| `archive-stale-reports.py`        | 1                   | Report archival                             |
| `generate-reports-index.py`       | 2                   | Report index generation                     |
| `research-report-health.py`       | 4                   | Report health scoring                       |
| `analysis-report-health.py`       | 0                   | Analysis report scoring                     |
| `review-pr.sh`                    | 4                   | PR review script                            |
| `audit-batch.sh`                  | (in TOOL-INVENTORY) | Batch audit helper                          |
| `TOOL-INVENTORY.md`               | (doc)               | Inventory documentation                     |

**Subtotal: 41 files (generic-keep, not in build chain but serve LB)**

### B.3 Port-seed-dormant (disposition 2)

These implement capabilities LB will need when specific preconditions are met. They
remain dormant until then. Preconditions noted per item.

| path                                | Taiwan refs | precondition for LB use                 |
| ----------------------------------- | ----------- | --------------------------------------- |
| `fetch-ga4.py`                      | 11          | GA4 property connected                  |
| `fetch-cloudflare.py`               | 8           | Cloudflare analytics enabled            |
| `fetch-search-console.py`           | 11          | Search Console verified                 |
| `fetch-search-events.py`            | 3           | Search Console events API               |
| `cf-query.py`                       | 8           | Cloudflare API key                      |
| `ga-query.py`                       | 0           | GA4 property                            |
| `ga-window-compare.py`              | 0           | GA4 property                            |
| `sc-query.py`                       | 0           | Search Console property                 |
| `generate-dashboard-analytics.py`   | 17          | Any analytics source                    |
| `referral-attribution.py`           | 0           | Traffic data                            |
| `converter-analytics.py`            | 3           | GA4 + conversion events                 |
| `converter-demand.py`               | 5           | Demand data source                      |
| `fetch-sense-data.sh`               | 8           | Sense API (LB equivalent TBD)           |
| `sense-diff.py`                     | 1           | Sense API                               |
| `install-sense-cron.sh`             | 3           | Sense cron setup                        |
| `register-ga4-custom-dimensions.py` | 3           | GA4 property                            |
| `fetch-nml-data.py`                 | 2           | Equivalent LB museum/institution        |
| `fetch-nmth-overseas-data.py`       | 3           | Equivalent institution                  |
| `fetch-pansci-data.py`              | 3           | Equivalent science outlet               |
| `fetch-tft-data.py`                 | 6           | Equivalent partner org                  |
| `twinkle-hub-crawl.py`              | 0           | Social media monitoring                 |
| `twinkle-hub-verify.py`             | 4           | Social media verification               |
| `generate-carousel-slides.mjs`      | 11          | Carousel/social feature built           |
| `generate-spore-image.mjs`          | 5           | Spore visual pipeline activated         |
| `make-spore.sh`                     | 4           | Spore pipeline activated                |
| `spore-db.py`                       | 0           | Spore pipeline activated                |
| `bootstrap-spore-ssot.py`           | 0           | Spore pipeline activated                |
| `validate-spore-data.py`            | 0           | Spore pipeline activated                |
| `spore-content-hash-audit.py`       | 0           | Spore pipeline activated                |
| `migrate-spore-log-to-harvests.py`  | 0           | Spore pipeline activated                |
| `music-media-audit.py`              | 1           | Media/arts content + iframe strategy    |
| `manage-featured.sh`                | 4           | Featured article system (> 20 articles) |
| `send-email-resend.py`              | 4           | Newsletter/email system                 |
| `send-contributor-survey.sh`        | 10          | Active contributor base                 |
| `weekly-report-prep.py`             | 2           | Weekly report pipeline activated        |
| `refresh-data.sh`                   | 1           | Analytics + data sources                |
| `cron-impact-tracker.sh`            | 0           | Cron automation activated               |
| `cherry-merge-prs.sh`               | 3           | Active PR workflow                      |

**Subtotal: 38 files (port-seed-dormant)**

### B.4 Semiont operational scripts (disposition 1 or 2, no deletes)

These support the Semiont cognitive layer. They reference Taiwan in operational paths
(diary, consciousness, routine) but the underlying capability (memory management,
routine drift detection, DNA auditing) is generic and will serve LB when the organs
grow. Classified as **generic-keep** if the tool is universally useful now, or
**port-seed-dormant** if it needs an organ that doesn't exist yet.

Included in B.2 and B.3 counts above where applicable. Key ones:

| path                        | Taiwan refs | disp. | reason                      |
| --------------------------- | ----------- | ----- | --------------------------- |
| `routine-audit.py`          | 12          | 2     | Needs active routines       |
| `routine-drift.sh`          | 6           | 2     | Needs active routines       |
| `routine-status.sh`         | 2           | 2     | Needs active routines       |
| `routine-sync-check.py`     | 3           | 2     | Needs active routines       |
| `consciousness-snapshot.sh` | 0           | 2     | Needs consciousness organ   |
| `update-consciousness.sh`   | 0           | 2     | Needs consciousness organ   |
| `compress-memory.sh`        | 0           | 2     | Needs session memory volume |
| `memory-index-lint.py`      | 0           | 2     | Needs memory index          |
| `lessons-distill.py`        | 0           | 2     | Needs LESSONS-INBOX         |
| `inbox-audit.py`            | 0           | 2     | Needs inbox system          |
| `inbox-signal.sh`           | 0           | 2     | Needs inbox system          |
| `instrumentation-audit.py`  | 3           | 2     | Needs instrumentation layer |
| `dna-split-audit.sh`        | 2           | 2     | Needs DNA organs active     |
| `semiont-worktree.sh`       | 0           | 1     | Generic git worktree helper |
| `session-id.sh`             | 0           | 1     | Generic session ID          |
| `git-session-span.sh`       | 0           | 1     | Generic git util            |
| `worktree-gc.sh`            | 0           | 1     | Generic git cleanup         |

Note: These 17 are already counted in B.2/B.3 above. Listed separately for clarity on the semiont-operational cluster.

### B.5 lang-sync/ subdirectory (31 files beyond status.py)

`lang-sync/status.py` is in the build chain (B.1). The remaining 30 files form the
multi-model translation fleet (Babel pipeline). Taiwan refs in 13 files. The `lb-translate`
skill wraps a different pipeline (`TRANSLATION-PIPELINE.en.md`), but the fleet machinery
(OpenRouter batch, Ollama local, codex backend, priority schema) is generic translation
infrastructure that will serve LB when translation volume grows beyond single-article
manual runs.

**Disposition: 2 (port-seed-dormant).** Precondition: translation volume requiring
automated batching (currently LB has ~5 zh-TW articles, all manually translated).

Already counted in B.3 totals (grouped under "translation infrastructure").

### B.6 Remaining miscellaneous

| path                            | Taiwan refs | disp. | evidence                                           |
| ------------------------------- | ----------- | ----- | -------------------------------------------------- |
| `translate.sh`                  | 17          | 2     | Single-file translate helper; generic when cleaned |
| `quality-report-2026-03-24.txt` | (report)    | 1     | Historical quality snapshot; harmless              |
| `rewrite-queue.txt`             | (data)      | 1     | Queue file for rewrite pipeline                    |

---

## C. Skills (12 items inventoried)

### C.1 DELETED R16 — superseded (3 skills)

Deleted in R16 commit. Each had a confirmed `lb-*` replacement.

| skill               | superseded by | pre-delete consumer count |
| ------------------- | ------------- | ------------------------- |
| `twmd` (router)     | `lb` (router) | 0 outside README.md       |
| `taiwanmd-search`   | `lb-search`   | 0 outside README.md       |
| `taiwanmd-validate` | `lb-validate` | 0 outside README.md       |

### C.2 DELETED R16 — no-analog (1 skill)

| skill        | reason                                                               | pre-delete consumer count |
| ------------ | -------------------------------------------------------------------- | ------------------------- |
| `twmd-bench` | Sovereignty-Bench dropped per CLAUDE.md; scripts/bench/ also deleted | 0 outside README.md       |

### C.3 HELD — load-bearing (1 skill)

| skill         | disposition                | evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `twmd-become` | held-until-dependents-gone | 28 KEPT planned-port skills gate on `/twmd-become` (grep confirms: twmd-analyze, twmd-babel, twmd-diary, twmd-distill, twmd-embeddings, twmd-evolve, twmd-feedback-triage, twmd-finale, twmd-harvest, twmd-heartbeat, twmd-language-birth, twmd-maintainer, twmd-memory, twmd-music-media-audit, twmd-news-lens, twmd-peer, twmd-pr-review, twmd-refresh, twmd-release, twmd-rewrite, twmd-routine, twmd-routine-audit, twmd-self-evolve, twmd-spore, twmd-spore-pick, twmd-spore-publish, twmd-translate, twmd-weekly-report + heartbeat). Cannot delete until all dependents are ported to `lb-become` or deleted. |

### C.4 Port-first dormant (7 idea-reusable skills)

Wilson's decision: these stay as reference until their `lb-*` rebirth is built, then
the `twmd-*` original gets deleted. NOT straight-deletable.

| skill                    | LB rebirth concept                                                      | blocker                          |
| ------------------------ | ----------------------------------------------------------------------- | -------------------------------- |
| `twmd-music-media-audit` | `lb-media-audit` — LB article media/iframe embed audit                  | Queued for port (Phase 6 Tier C) |
| `twmd-news-lens`         | `lb-news-lens` — LB local-news content opportunity lens                 | Queued for port (Phase 6 Tier C) |
| `twmd-peer`              | `lb-peer` — LB local-institution curation (LAM, LBHS, Festival of Arts) | Queued for port (Phase 6 Tier C) |
| `twmd-harvest`           | `lb-harvest` — social engagement scraping                               | Blocked: LB social presence      |
| `twmd-spore`             | `lb-spore` — social post authoring                                      | Blocked: LB social presence      |
| `twmd-spore-pick`        | `lb-spore-pick` — daily candidate selection                             | Blocked: LB social presence      |
| `twmd-spore-publish`     | `lb-spore-publish` — auto-publish to social                             | Blocked: LB social presence      |

---

## Executed deletions (R16)

### Batch A: scripts/bench/ (9 files) — DELETED

Sovereignty-Bench-TW. No LB analog, 0 consumers. Entire directory removed.

### Batch B: Skills - superseded (3 skills) — DELETED

`twmd` (router), `taiwanmd-search`, `taiwanmd-validate`.
Each had a confirmed `lb-*` replacement. 0 external consumers.

### Batch C partial: twmd-bench — DELETED

Skill wrapper over the deleted Batch A bench scripts. No LB analog.

**Total deleted this round:** 9 scripts + 4 skills = 13 items.

---

## Port-first roadmap (7 idea-reusable skills)

Wilson's rule: port first, then delete the original. Grouped by readiness:

### Editorial-rebornable NOW (queued for Phase 6 Tier C port)

These can be ported without external preconditions. Tracked in MIGRATION.md Phase 6.

| twmd-\* source           | lb-\* target     | scope note                                                                |
| ------------------------ | ---------------- | ------------------------------------------------------------------------- |
| `twmd-music-media-audit` | `lb-media-audit` | Audit LB articles for media/image/iframe against EDITORIAL media standard |
| `twmd-news-lens`         | `lb-news-lens`   | LB local-news lens; must define LB news sources (not copy Taiwan's 三源)  |
| `twmd-peer`              | `lb-peer`        | LB local-institution curation (Laguna Art Museum, LBHS, Festival of Arts) |

### Social-gated (blocked on LB social presence)

These remain dormant reference-only until LB has active social accounts.

| twmd-\* source       | lb-\* target       | precondition                          |
| -------------------- | ------------------ | ------------------------------------- |
| `twmd-harvest`       | `lb-harvest`       | LB Threads/X/social accounts          |
| `twmd-spore`         | `lb-spore`         | LB social accounts + posting strategy |
| `twmd-spore-pick`    | `lb-spore-pick`    | LB social accounts                    |
| `twmd-spore-publish` | `lb-spore-publish` | LB social accounts                    |

### HELD: twmd-become

28 kept planned-port skills gate on it. Deleted only after all dependents port to
`lb-become` or are themselves deleted.

---

**NOT deletable (0 scripts/tools/ files):** Every `scripts/tools/` file with Taiwan
refs is either in the build chain, serves a generic editorial capability, or is a
port-seed waiting on a precondition. None qualify for disposition 3 or 4.

---

## Appendix: Phase-6 planned ports (out of scope)

The following `twmd-*` skills have active Phase-6 port plans and are NOT part of this
inventory's delete scope:

`twmd-evolve`, `twmd-analyze`, `twmd-maintainer`, `twmd-pr-review`, `twmd-heartbeat`,
`twmd-finale`, `twmd-routine`, `twmd-routine-audit`, `twmd-probe`, `twmd-babel`,
`twmd-batch-audit`, `twmd-weekly-report`, `twmd-release`, `twmd-language-birth`,
`twmd-translate`, `twmd-rewrite`, `twmd-embeddings`, `twmd-refresh`, `twmd-diary`,
`twmd-distill`, `twmd-memory`, `twmd-self-evolve`, `twmd-feedback-triage`.

These remain as upstream inheritance until their `lb-*` port is completed per the
Phase-6 tier/gate plan.
