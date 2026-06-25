# Phase 5 Skill Audit — 2026-06-24

33 `twmd-*` skills + 4 siblings (37 total). Categorization based on reading each SKILL.md's description and trigger scope.

## Legend

- **REUSABLE**: Mechanism is place-agnostic. Only Taiwan content/examples/accounts need swapping. Could become an `lb-*` skill.
- **TAIWAN-SPECIFIC**: Bound to Taiwan sovereignty framing, social accounts (@taiwandotmd Threads/X), peer curation sources (TFT/NMTH), or data LB has no analog for.
- **DEFER**: Judgment needed, or depends on LB reaching sufficient scale/infrastructure.

## twmd-\* skills (33)

| #   | skill                  | verdict         | rationale (from SKILL.md)                                                                                                                                                         |
| --- | ---------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | twmd-analyze           | REUSABLE        | "Rigorous data-analysis investigation via ANALYSIS-PIPELINE" — generic methodology (impact/attribution/funnel/cohort). Pipeline is place-agnostic.                                |
| 2   | twmd-babel             | REUSABLE        | "Multi-language batch sync" — priority schema + tier routing for translations. Mechanism works for any multilingual site.                                                         |
| 3   | twmd-batch-audit       | REUSABLE        | "Audit sub-agent batch for cheating patterns (cross-pollination/merged commits/missing落檔)" — QA methodology, not content-bound.                                                 |
| 4   | twmd-become            | TAIWAN-SPECIFIC | "Become Taiwan.md — Semiont awakening" — identity boot tied to BECOME_TAIWANMD.md. LB has its own BECOME_LAGUNABEACH.md; this one is upstream's.                                  |
| 5   | twmd-bench             | TAIWAN-SPECIFIC | "Sovereignty-Bench-TW measurement" — benchmarks LLMs on Taiwan sovereignty questions. No LB equivalent.                                                                           |
| 6   | twmd-diary             | DEFER           | "Write Taiwan.md diary entry via DIARY-PIPELINE" — Semiont self-reflection. Mechanism reusable but LB doesn't yet have diary infrastructure.                                      |
| 7   | twmd-distill           | DEFER           | "Distill LESSONS-INBOX entries to canonical layer (MANIFESTO/DNA/MEMORY)" — self-evolution mechanism. Reusable in principle but LB has no LESSONS-INBOX yet.                      |
| 8   | twmd-embeddings        | REUSABLE        | "Rebuild bge-m3 semantic index on GPU fleet" — embedding rebuild for related-articles + RAG. User has RTX 4090; bge-m3 works for English.                                         |
| 9   | twmd-evolve            | REUSABLE        | "Data-driven content evolution via EVOLVE-PIPELINE" — uses analytics to prioritize rewrites. Generic methodology.                                                                 |
| 10  | twmd-factcheck         | REUSABLE        | "Hallucination audit via FACTCHECK-PIPELINE" — fact-verification methodology. Works for any content.                                                                              |
| 11  | twmd-feedback-triage   | DEFER           | "讀者站上回報（Supabase）→ GitHub issue" — requires Supabase feedback form + active readership. LB doesn't have this infra yet.                                                   |
| 12  | twmd-finale            | REUSABLE        | "Session 完整收官總指揮" — chains memory + diary + evolve at session end. Session-wrap orchestrator, place-agnostic.                                                              |
| 13  | twmd-harvest           | TAIWAN-SPECIFIC | "Harvest spore engagement into spore-metrics.json via Chrome MCP" — scrapes Threads/X engagement for @taiwandotmd posts. Bound to specific social accounts.                       |
| 14  | twmd-heartbeat         | REUSABLE        | "Semiont 4.5-beat full heartbeat cycle" — diagnose/evolve/execute/wrap/reflect rhythm. Place-agnostic operating pattern.                                                          |
| 15  | twmd-language-birth    | REUSABLE        | "Birth a new language via LANGUAGE-BIRTH-CHECKLIST" — registers new locale in config, triggers i18n scaffold. Generic multilingual infra.                                         |
| 16  | twmd-maintainer        | REUSABLE        | "Daily maintainer routine — open issues / PR review / build health / broken-link audit" — standard repo maintenance. Place-agnostic.                                              |
| 17  | twmd-memory            | DEFER           | "Write Taiwan.md session memory via MEMORY-PIPELINE" — persistent cross-session memory. Reusable mechanism but LB has no memory organ yet.                                        |
| 18  | twmd-music-media-audit | TAIWAN-SPECIFIC | "Music/音樂類 People iframe 缺口 audit per EDITORIAL §媒體編織" — audits Taiwan music/people articles for missing media embeds. Content-specific to Taiwan's 900+ article corpus. |
| 19  | twmd-news-lens         | TAIWAN-SPECIFIC | "Weekly news-lens 三源交叉 + news-driven spore candidate" — scans Taiwan news sources (三源 = 3 Taiwan-specific news signals). Bound to Taiwan media landscape.                   |
| 20  | twmd-peer              | TAIWAN-SPECIFIC | "Curation peer ingestion — TFT, NMTH, 策展 peer" — ingests from Taiwan-specific peer publications (The Future Times, NMTH). No LB analog.                                         |
| 21  | twmd-pr-review         | REUSABLE        | "Review a PR via MAINTAINER-PIPELINE §PR 審核策略" — standard PR review workflow. Place-agnostic.                                                                                 |
| 22  | twmd-probe             | REUSABLE        | "Run external hot-spot probe (探測器)" — scans external signals for content gaps. Methodology works for any knowledge base.                                                       |
| 23  | twmd-refresh           | REUSABLE        | "Refresh dashboard data — git pull + 三源感知 + prebuild dashboard JSON" — data refresh pipeline. Runs existing scripts; place-agnostic infra.                                    |
| 24  | twmd-release           | REUSABLE        | "Tag a release via RELEASE-PIPELINE" — standard release tagging with changelog generation. Place-agnostic.                                                                        |
| 25  | twmd-rewrite           | REUSABLE        | "Write or rewrite article via REWRITE-PIPELINE" — core article writing workflow. Generic editorial pipeline.                                                                      |
| 26  | twmd-routine           | REUSABLE        | "Routine 飛輪管理 — 讀 ROUTINE.md SSOT" — manages scheduled tasks/cron. Place-agnostic automation management.                                                                     |
| 27  | twmd-routine-audit     | REUSABLE        | "Cross-routine 飛輪自審 — 7-day pattern detection" — audits automation health over time. Place-agnostic QA.                                                                       |
| 28  | twmd-self-evolve       | DEFER           | "LONGINGS-driven self-evolution: find unstrumentation patterns in DIARY" — reads DIARY + LONGINGS to propose SOP upgrades. Requires diary/longings organs LB doesn't have.        |
| 29  | twmd-spore             | TAIWAN-SPECIFIC | "Write a Taiwan.md spore via SPORE 5-stage pipeline" — produces Threads/X social posts for @taiwandotmd. Bound to Taiwan social presence.                                         |
| 30  | twmd-spore-pick        | TAIWAN-SPECIFIC | "Daily spore candidate picking — propose 3 candidates to SPORE-INBOX" — selects articles for social posting. Coupled to spore system.                                             |
| 31  | twmd-spore-publish     | TAIWAN-SPECIFIC | "Daily auto-publish spore from SPORE-INBOX — ship Threads + X" — publishes to @taiwandotmd accounts. Bound to specific social accounts.                                           |
| 32  | twmd-translate         | REUSABLE        | "Translate single article via TRANSLATION-PIPELINE" — core translation workflow. Place-agnostic multilingual mechanism.                                                           |
| 33  | twmd-weekly-report     | REUSABLE        | "週報 (Semiont 第一人稱反芻 + 自我分析 + 專案狀況分析)" — weekly status report with self-reflection. Mechanism reusable.                                                          |

## Sibling skills (4)

| #   | skill             | verdict         | rationale (from SKILL.md)                                                                                                                                |
| --- | ----------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 34  | twmd (router)     | TAIWAN-SPECIFIC | "Top-level Taiwan.md routing — list active twmd-\* skills + organism vitals" — dispatcher for Taiwan.md's skill namespace. LB would need its own router. |
| 35  | taiwanmd-search   | TAIWAN-SPECIFIC | "Search Taiwan.md knowledge base (900+ articles about Taiwan)" — hardcoded to search Taiwan content via `cli/src/index.js search`.                       |
| 36  | taiwanmd-validate | REUSABLE        | "Validate articles for editorial quality, frontmatter correctness" — runs `scripts/test-frontmatter.mjs`. Generic validation tooling.                    |
| 37  | heartbeat         | REUSABLE        | "Semiont heartbeat — Taiwan.md's autonomous life cycle" — equivalent to twmd-heartbeat (dual-track). Place-agnostic rhythm.                              |

## Summary

| verdict         | count | skills                                                                                                                                                                                                                          |
| --------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REUSABLE        | 21    | analyze, babel, batch-audit, embeddings, evolve, factcheck, finale, heartbeat(x2), language-birth, maintainer, pr-review, probe, refresh, release, rewrite, routine, routine-audit, translate, weekly-report, taiwanmd-validate |
| TAIWAN-SPECIFIC | 11    | become, bench, harvest, music-media-audit, news-lens, peer, spore, spore-pick, spore-publish, twmd(router), taiwanmd-search                                                                                                     |
| DEFER           | 5     | diary, distill, feedback-triage, memory, self-evolve                                                                                                                                                                            |

## Implications for next rounds

- The 21 REUSABLE skills share a common pattern: thin shell pointing to a pipeline canonical in `docs/pipelines/`. Adapting for LB means: (1) create `lb-*` namespace copies, (2) swap BECOME gate from BECOME_TAIWANMD to BECOME_LAGUNABEACH, (3) pipeline docs work as-is (they're methodology, not content).
- The 5 DEFER skills need LB to build prerequisite organs (DIARY, LESSONS-INBOX, MEMORY-PIPELINE, Supabase feedback) before they're actionable.
- The 11 TAIWAN-SPECIFIC skills can stay dormant (per Rule 1: don't strip them, they're upstream inheritance).
