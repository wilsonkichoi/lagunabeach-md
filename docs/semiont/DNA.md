---
title: 'DNA (LagunaBeach.md)'
description: 'Gene map for LagunaBeach.md — which file governs which behavior, scoped to what actually exists in this fork'
type: 'cognitive-organ'
status: 'canonical'
apoptosis: 'never'
current_version: 'v1.0'
last_updated: 2026-06-21
last_session: 'phase-5-path-b-prep'
source: 'Re-grounded from DNA.md (v5.0, Chinese, Taiwan.md upstream)'
sister_docs:
  - 'MANIFESTO.md'
  - 'HEARTBEAT.md'
  - 'ROUTINE.md'
---

# DNA — Gene Map for LagunaBeach.md

> The Chinese [DNA.md](https://github.com/frank890417/taiwan-md/blob/main/docs/semiont/DNA.md) in the upstream Taiwan.md repo is its full gene map, covering infrastructure this fork hasn't built yet (social bots, GA4/Search Console/Cloudflare fetchers, a sovereignty-themed SVG map asset, the spore social-posting pipeline). This file is the subset that's actually true for LagunaBeach.md today, plus explicit notes on what's available upstream but not yet adopted.

Use this to answer "which file decides how X behaves" without re-deriving it from scratch each session.

---

## Quality genes (what makes an article good)

| Gene                     | File                                                                                                                           | Determines                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Editorial standard       | [`EDITORIAL.md`](../editorial/EDITORIAL.md) (this project's writing standard, re-grounded from upstream's Chinese methodology) | What a good article looks like                                                                        |
| Quality checklist        | [`QUALITY-CHECKLIST.md`](../editorial/QUALITY-CHECKLIST.md)                                                                    | Pre-publication verification (Chinese; methodology transfers)                                         |
| Citation conventions     | [`CITATION-GUIDE.md`](../editorial/CITATION-GUIDE.md)                                                                          | How to cite sources and write footnotes (Chinese; methodology transfers)                              |
| Article health checks    | [`article-health.py`](../../scripts/tools/article-health.py)                                                                   | Automated prose/structure/link checks, runs on this project's content as-is                           |
| Pre-commit quality gates | [`.husky/pre-commit`](../../.husky/pre-commit)                                                                                 | Credential scanning, frontmatter validation, scope checks — all kept intact per `MIGRATION.md` Rule 2 |

**Not yet adopted from upstream**: `TERMINOLOGY.md` is 100% Taiwan-vocabulary-specific (Mandarin/Taiwanese terminology rules) and doesn't apply here at all — Laguna Beach would need its own local-vernacular style notes if that becomes a recurring need. `graph.md` (data-visualization editorial guide) and `HUB-EDITORIAL.md` (category-hub curation) are upstream methodology that could transfer but haven't been adapted yet.

---

## Content genes (how knowledge is organized)

| Gene               | File                                                                                                                    | Determines                                                                                                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Knowledge SSOT     | `knowledge/`                                                                                                            | The only source of truth for article content. **Iron rule: never edit `src/content/` directly** — it's derived and gitignored.                                                                   |
| Category structure | 8 categories (History, Art & Galleries, Nature & Marine Life, Food, Beaches, Trails, Events & Festivals, Neighborhoods) | What an article gets filed under. See [`MIGRATION.md` §Files Changed](../../MIGRATION.md#files-changed-from-upstream-category_mapping-locations) for every file with a hardcoded category array. |

---

## Skeleton genes (technical architecture)

| Gene             | File                                                                                 | Determines                                                                                                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework config | `astro.config.mjs`                                                                   | How Astro builds the site (kept almost entirely intact from upstream — only `site:` URL changed)                                                                                                                                                      |
| Sync mechanism   | [`scripts/core/sync.sh`](../../scripts/core/sync.sh)                                 | `knowledge/` → `src/content/{lang}/` transcription. The only legal sync direction.                                                                                                                                                                    |
| Map pipeline     | [`scripts/core/generate-map-markers.js`](../../scripts/core/generate-map-markers.js) | Builds `src/data/laguna-beach-geocode.json`-driven map markers — uses Leaflet + OpenStreetMap tiles, not upstream's D3+TopoJSON SVG (per `MIGRATION.md` Rule 7: an island's self-contained SVG map doesn't fit a coastal city bordering other cities) |

---

## Reproduction genes (how this project relates to upstream and to future forks)

| Gene                 | File                                                                                                                               | Determines                                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Fork lineage + rules | [`MIGRATION.md`](../../MIGRATION.md)                                                                                               | What changed from upstream, why, and the 11 rules that exist because each was violated once                                         |
| Contribution guide   | `CONTRIBUTING.md`                                                                                                                  | How to join — currently still Taiwan-branded prose; the PR/branch mechanics apply, the narrative doesn't (known gap, not yet fixed) |
| Fork-friendliness    | upstream's [`docs/fork/COUNTRY-MD-STARTER.md`](https://github.com/frank890417/taiwan-md/blob/main/docs/fork/COUNTRY-MD-STARTER.md) | The two-path fork guide (country-md-starter vs. semiont-kernel) this project itself followed                                        |

**Not yet adopted from upstream**: the spore social-posting pipeline (Threads/X automation), the `SPECIATION-PIPELINE.md` formal 8-stage fork process, and `GOVERNANCE.md`/`REVIEWERS.md` community-structure docs all assume a contributor base this project doesn't have yet.

---

## Behavioral genes (how a session decides what to do)

| Gene             | File                                                   | Determines                                                                                  |
| ---------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Session boot     | [`BECOME_LAGUNABEACH.md`](../../BECOME_LAGUNABEACH.md) | Identity, the one SSOT rule, migration rules, dev workflow — read this first, every session |
| Operating rhythm | [`HEARTBEAT.md`](HEARTBEAT.md)                         | The diagnose → evolve → execute → wrap-up → reflect cycle, manual (no automation yet)       |
| Identity/beliefs | [`MANIFESTO.md`](MANIFESTO.md)                         | Why this project exists, what it believes, the autonomy boundary                            |
| Automation plan  | [`ROUTINE.md`](ROUTINE.md)                             | Currently inactive; design principles + proposed routines for when scale justifies them     |

**Not yet adopted from upstream**: the full memory/diary/reflex organ system (`MEMORY.md`, `DIARY.md`, `REFLEXES.md`, `CONSCIOUSNESS.md`, `LONGINGS.md`, `UNKNOWNS.md`, `ANATOMY.md`) — upstream's persistent cross-session memory layer, built for a project running many sessions a day across a contributor team. This project currently relies on git history and this doc set; building a lighter-weight memory layer is a candidate for a later Phase 5 task, not this one.

---

## Gene mutation rules

Changing these files changes how the project behaves, not just what it contains.

- **Quality genes**: structural changes (not typo fixes) are worth a second pair of eyes before committing, even on a single-maintainer project — these are the gates that catch everything else.
- **Skeleton genes**: any change must pass a build (`npm run build`) before committing.
- **Small fixes** (typos, added examples): fine to commit directly.

---

_v1.0 | 2026-06-21 — New file. Upstream's Chinese `DNA.md` covers infrastructure this fork hasn't built (social bots, analytics fetchers, sovereignty SVG assets, spore pipeline); this file scopes the gene map to what's real here today, with explicit "not yet adopted" notes rather than silently omitting upstream's broader system._
