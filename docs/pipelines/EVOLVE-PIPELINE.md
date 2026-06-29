---
title: 'EVOLVE-PIPELINE (English / LB)'
description: 'Data-driven content evolution system for LagunaBeach.md — Phase 1-7 SCAN→SCORE→RANK→CHECK→ENRICH→APPEND→SHIP + Mode 3 pipeline self-refactor'
type: 'pipeline-canonical'
status: 'canonical'
current_version: 'v1.0'
last_updated: 2026-06-28
last_session: '2026-06-28-r19-impl'
sister_docs:
  - 'REWRITE-PIPELINE.md'
  - 'PEER-INGESTION-PIPELINE.md'
  - 'FACTCHECK-PIPELINE.md'
upstream_canonical:
  - '../semiont/HEARTBEAT.md'
  - '../semiont/DNA.md'
  - '../semiont/MANIFESTO.md'
---

# EVOLVE-PIPELINE.md — Data-driven content evolution system

> **First principle:** LagunaBeach.md is a digital life form. The Evolve Pipeline is
> its metabolism. It decides what to change not by intuition but by signal —
> cross-analyzing available sources to produce a content-evolution list.
>
> **LB grounding note:** the methodology here is inherited from Taiwan.md, which ran a
> three-source pipeline (web analytics + search console + community feedback). LB does
> not yet have analytics accounts (GA4 / Search Console / Cloudflare). The skill that
> loads this pipeline, [`/lb-news-lens`](../../.claude/skills/lb-news-lens/SKILL.md),
> adapts the three-source framework to LB's currently-available sources: **verified
> local news + GitHub feedback + the existing-corpus self-scan**. Analytics tiers are
> documented below but marked dormant until those accounts exist.

---

## ASCII spine

```
╭──────────────────────────────────────────────────────────────────────────╮
│         EVOLVE-PIPELINE — data-driven content evolution, 7 phases         │
│                                                                          │
│   Core discipline                                                        │
│            ├── multi-source cross-validation (single-source = suspect)   │
│            ├── evolution score, 7 dimensions (traffic/CTR/quality/age/   │
│            │     source/graph/community)                                 │
│            └── candidate must include "why this one vs others"           │
│                                                                          │
│   ──── Phase 1-7 main flow ───────────────────────────────              │
│                                                                          │
│   Phase 1: SCAN ──→ multi-source signal collection                      │
│            ├── 1A Local news (verified LB sources)                       │
│            ├── 1B Search/analytics (DORMANT — no accounts yet)           │
│            └── 1C GitHub feedback (issue / PR / star)                    │
│                                                                          │
│   Phase 2: SCORE ──→ evolution score                                    │
│            └── 7 weighted dimensions                                     │
│              ↳ gate: score ≥ 60 to count as a candidate                  │
│                                                                          │
│   Phase 3: RANK ──→ candidate ordering                                   │
│                                                                          │
│   Phase 4: CHECK ──→ dedupe against existing INBOX                       │
│              ↳ gate: don't duplicate an existing candidate               │
│                                                                          │
│   Phase 5: ENRICH ──→ add the comparison rationale                      │
│              ↳ gate: candidate carries source pointers                   │
│                                                                          │
│   Phase 6: APPEND ──→ write knowledge/INBOX.md                          │
│            └── priority + evidence + existing-coverage                   │
│                                                                          │
│   Phase 7: SHIP commit ──→ observer review                              │
│                                                                          │
│   ✅ Candidates appended to knowledge/INBOX.md                           │
│                                                                          │
│   ──── cross-pipeline boundary ──────────────────────                   │
│   → write candidate: knowledge/INBOX.md                                  │
│   → write actual article: REWRITE-PIPELINE.md                           │
│   → external curation peer ingest: PEER-INGESTION-PIPELINE.md           │
╰──────────────────────────────────────────────────────────────────────────╯
```

---

## Hard Gate Inventory

| Gate                               | Phase   | Condition         | Tool / method           | Fail = ?                 |
| ---------------------------------- | ------- | ----------------- | ----------------------- | ------------------------ |
| ≥ 2 sources confirm a signal       | Phase 1 | before scoring    | manual cross-check      | watchlist, not candidate |
| Evolution score ≥ 60               | Phase 2 | candidate article | manual formula          | not a candidate          |
| Not a duplicate of INBOX           | Phase 4 | before append     | grep knowledge/INBOX.md | skip                     |
| Candidate has comparison rationale | Phase 5 | before append     | manual                  | re-add reasoning         |
| Candidate has source pointer       | Phase 5 | within candidate  | manual                  | add source link          |
| At least 1 candidate per run       | Phase 6 | each run          | manual                  | note the empty run       |

---

## Top 5 most-forgotten steps

1. **Cross-validate first** — single-source conclusions are suspect; require ≥ 2
   sources confirming a signal before it becomes a candidate.
2. **Cross "high readership × stale `lastVerified`"** — the highest-ROI evolution
   candidates sit in that intersection (once analytics exist; until then, use the
   corpus self-scan for stale articles).
3. **A gap with coverage but no article → new candidate** — a topic appearing in news
   or search with no corresponding article is a content gap.
4. **GitHub feedback: read the issue body, not just the title** — the title may be
   vague; the body holds the concrete request.
5. **A candidate written to INBOX must carry its comparison rationale** — "why this one
   vs others," so the next reviewer understands the priority.

---

## Cross-file responsibilities

| File                                                     | Scope                                                             |
| -------------------------------------------------------- | ----------------------------------------------------------------- |
| **this file**                                            | data-driven candidate production (signals → knowledge/INBOX.md)   |
| [REWRITE-PIPELINE.md](REWRITE-PIPELINE.md)               | write the actual article (pick a candidate, run the stages)       |
| [PEER-INGESTION-PIPELINE.md](PEER-INGESTION-PIPELINE.md) | external curation-peer source — complements this file, no overlap |
| [FACTCHECK-PIPELINE.md](FACTCHECK-PIPELINE.md)           | audit a candidate after it ships                                  |
| [knowledge/INBOX.md](../../knowledge/INBOX.md)           | candidate output location                                         |

**Boundary: this file vs PEER-INGESTION:**

- **this file (EVOLVE)** = internal signals (news + feedback + corpus self-scan) →
  identify "what new article to write / which article to evolve"
- **PEER-INGESTION** = external curation peer → identify "what existing curation to
  ingest"
- both produce INBOX candidates, but from different sources

---

## Concept

Cross-analyze multiple signal sources to produce a content-evolution list:

```
Local news (events/topics)  ──┐
Search/analytics (DORMANT)  ──┼── cross-analysis ──→ evolution score → Rewrite / new / SEO
GitHub feedback             ──┘
```

---

## Phase 1: Signal collection

### 1A. Local news (LB primary source)

Per [`/lb-news-lens`](../../.claude/skills/lb-news-lens/SKILL.md), scan the verified LB
news sources (Laguna Beach Independent, Stu News Laguna, OC Register Laguna section).
Require at least 2 sources confirming a signal before it becomes a candidate;
single-source signals stay as watchlist items.

**Cross-dimension:** a news topic × the existing `knowledge/` corpus → find topics with
news interest but no article (gaps), or existing articles a current event makes worth
updating.

### 1B. Search / web analytics (DORMANT)

> LB has no GA4 / Search Console / Cloudflare accounts yet. This tier is the inherited
> methodology, documented for when those accounts exist. Until then it produces no
> signals and is skipped.

When analytics exist, the standard metrics are:

| Metric                          | Use                               |
| ------------------------------- | --------------------------------- |
| Top page views                  | most-read articles                |
| Per-page bounce rate            | which articles readers leave fast |
| Per-page avg engagement time    | stickiness                        |
| Landing pages                   | SEO entry points                  |
| High-impression + low-CTR (<5%) | title/description needs tuning    |
| Impressions but no article      | content gap → new                 |

### 1C. GitHub feedback (LIVE)

| Source                 | Signal                              |
| ---------------------- | ----------------------------------- |
| Issue reports          | factual error, bias, stale, missing |
| PR frequency per topic | what the community cares about most |
| Star growth curve      | word-of-mouth effect                |

---

## Phase 2: Cross-analysis → evolution score

### Evolution score

```
evolution score = (traffic importance × 0.20)
                + (CTR gap            × 0.15)
                + (quality defect     × 0.20)
                + (article age        × 0.10)
                + (traffic source quality × 0.15)
                + (graph density      × 0.10)
                + (community signal   × 0.10)
```

| Dimension                  | Weight | Calculation                                                          |
| -------------------------- | ------ | -------------------------------------------------------------------- |
| **Traffic importance**     | 20%    | page views (log-scale normalized) — DORMANT until analytics          |
| **CTR gap**                | 15%    | expected CTR (by rank position) − actual — DORMANT                   |
| **Quality defect**         | 20%    | quality-scan hollowness + insufficient length + stale `lastVerified` |
| **Article age**            | 10%    | days since the last meaningful update                                |
| **Traffic source quality** | 15%    | organic/direct weighted 3x over one-off social spikes — DORMANT      |
| **Graph density**          | 10%    | how many articles wikilink it? is it an island?                      |
| **Community signal**       | 10%    | issue/PR mention count + community feedback                          |

> Until analytics exist, the live dimensions are **quality defect, article age, graph
> density, and community signal**. Score on those; the three analytics-dependent
> dimensions contribute zero. Re-weight or re-introduce them when GA4 / Search Console
> are wired.

#### Fake-traffic filter (applies once analytics exist)

Auto-downweight or exclude:

- **One-off social referral spikes**: a burst from a single social post
- **Routing-bug traffic**: non-organic views from a UI bug (e.g., a "Random" button)
- **Detection:** if `sessionSource` is 90%+ from a single social source and the article
  has no search impressions → mark `inflated`

### Output: actions

| Action             | Trigger condition                                          | Estimated time |
| ------------------ | ---------------------------------------------------------- | -------------- |
| 🔴 **Rewrite**     | high interest + poor quality (short / stale / high bounce) | 30-60 min      |
| 🟠 **SEO tune**    | high impression + low CTR + quality OK → fix title/desc    | 5 min          |
| 🟢 **New article** | search/news demand confirmed with no existing article      | 60-90 min      |

> The upstream pipeline had a fourth action, **translate** (zh-TW → other languages),
> driven by the multi-language sovereignty mission. LB is EN-SSOT with a single dormant
> zh-TW translation target, so the multi-language sync apparatus does not apply; see the
> **Inherited: multi-language sync** appendix below.

---

## Phase 3: Execute

### Rewrite

Run [REWRITE-PIPELINE.md](REWRITE-PIPELINE.md), ordered by evolution score, batch the
top few per run.

Be specific to the paragraph level when scoping a rewrite:

```
❌ bad:  "add depth"
✅ good: "add a §3 section (50 lines) on the founding dispute, with: timeline,
         the named parties, concrete quotes"
```

### Translation

Run [TRANSLATION-PIPELINE.md](TRANSLATION-PIPELINE.md). LB translates EN → zh-TW
(zh-TW is a dormant target; translate only when the observer asks). The English source
is the SSOT and is finalized before any translation.

### SEO tune

Lightweight: change only frontmatter `title` / `description`; add a year, long-tail
keywords.

### New article

⚠️ First confirm the search/news term doesn't already point to an existing article
(avoid duplication), then run the full REWRITE-PIPELINE.

---

## Phase 4: Tracking & closing the loop

### evolveHistory

Record before/after in frontmatter on each rewrite, for long-term measurement:

```yaml
evolveHistory:
  - date: 2026-03-31
    action: rewrite
    linesBefore: 51
    linesAfter: 189
    reason: 'stale + factual error'
```

### Evolution report

After each Evolve run, produce `reports/evolve-YYYY-MM-DD.md`:

- this run's signal snapshot
- evolution score top 10
- actions executed
- next run's priorities
- effect tracking on the prior run's rewrites (evolveHistory comparison)

---

## Six feedback loops

### Loop 1: Search-intent clustering

Cluster search/news terms by **intent**, not just category. Terms in one intent cluster
should funnel to one strongest canonical article, not three articles competing with each
other.

**Method:** cluster terms → assign one canonical article per cluster → other articles
wikilink to drive traffic to it.

### Loop 2: Content freshness score

| Freshness type | Update cadence | Example                                                           |
| -------------- | -------------- | ----------------------------------------------------------------- |
| 🔴 Realtime    | monthly        | festival dates, business openings/closings, city-council outcomes |
| 🟡 Annual      | yearly         | population figures, event attendance, rankings                    |
| 🟢 Evergreen   | rarely         | historical events, geographic features, art-colony heritage       |

Add `freshness: realtime | annual | evergreen` to frontmatter; trigger review on expiry.

### Loop 3: Competitive gap analysis (anti-Wikipedia positioning)

LagunaBeach.md doesn't compete with Wikipedia on "look up facts"; it competes on
"**understand Laguna Beach.**"

| Wikipedia style                      | LagunaBeach.md style                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| "Laguna Beach incorporated in 1927." | "By 1927 the artists who'd been squatting in the canyons wanted a town of their own." |
| neutral, bulleted facts              | a point of view, a curator's voice, an emotional arc                                  |
| reader comes to look something up    | reader finishes and wants to share it                                                 |

### Loop 4: Reader-journey mapping

Single-page data isn't enough. Track the reader journey:

```
Landing page → second page → third page → Exit
```

- most readers seeing one page and leaving = internal-linking failure
- article-footer wikilinks and related articles = the evolution target
- (once analytics exist) page-path flow → analyze the most common reader paths

### Loop 5: Community-as-sensor

Contributors aren't just writers — they're sensors. What they choose to write = a market
signal.

- PR topic distribution → what the community thinks matters
- issue request topics → what readers think is missing
- articles modified after a fork → which content people are unsatisfied with

### Loop 6: Seasonal & event-driven

Build an events calendar and update related articles ahead of each: Festival of Arts /
Pageant of the Masters / Sawdust Art Festival (summer), winter king tides and tidepool
season, the Hospitality Night and holiday parade (December), gray-whale migration
(winter-spring). Update related articles early in the relevant month.

---

## Three-layer evolution architecture

> A true life form doesn't just react; it grows on its own initiative.

### Layer 1: Reactive (immune system) — live

Signals → find a problem, then fix it. Necessary but not sufficient.

### Layer 2: Predictive (growth hormone)

Don't ask "what's being searched now," ask "**what will be searched next month.**"

- **events calendar** → update ahead
- **trend detection** → track rising terms (once analytics/trends data exist)
- **content freshness score** → auto-review on expiry

### Layer 3: Emergent (nervous system)

Let the **relationship network** between articles decide what should grow.

- evolution metric adds: "how many articles wikilink this?" "is it an island?"
- **knowledge-graph density analysis** → sparse zones = need a new article or hub
- **reader-journey mapping** → look at the whole path, not single pages

---

## Automation roadmap

### Phase A: Manual + script-assisted (current)

Manual signal review + corpus self-scan, no automation. LB has no analytics export or
cron yet.

### Phase B: Semi-automatic (future)

```bash
# One command to run the Evolve Pipeline
bash scripts/evolve/run.sh

# Flow:
# 1. fetch signals (news + analytics once wired)
# 2. quality-scan full corpus
# 3. cross-analyze → evolution score order
# 4. produce reports/evolve-YYYY-MM-DD.md
# 5. list suggested actions (no auto-execute)
```

### Phase C: Fully automatic (future)

A weekly cron: collect signals → score → auto-report; seasonal calendar auto-triggers
review; content-freshness expiry auto-reminds. Gated on LB having the volume and the
analytics accounts to justify it.

---

## Inherited: multi-language sync (DORMANT for LB)

> Upstream's EVOLVE-PIPELINE v2.0 added a large multi-language sync subsystem driven by
> Taiwan.md's "sovereignty preservation" mission — projecting content across 5 languages
> with a 3-state staleness classifier, a 4-tier model cascade (free cloud models →
> local Ollama → paid fallback), and N-key budget rotation, all to keep PRC-sensitive
> content translatable without depending on models that refuse it.
>
> **None of this applies to LagunaBeach.md.** LB is EN-SSOT with a single dormant zh-TW
> target and no sovereignty dynamic (see CLAUDE.md "Dropped from upstream"). The
> multi-language cascade, the babel batch tooling, the 5-key rotation, and the 3-state
> classifier are inherited Taiwan organs, kept here as lineage but not run. If LB ever
> grows to many active languages, this is the prior art to re-ground; until then it is
> dormant.

The one transferable idea: a **bump-vs-translate** distinction — when a source article's
change is trailer-only (References / further-reading / footer), bump the translation's
recorded source hash without re-translating; only re-translate on true body drift.

---

## Mode 3: Pipeline self-refactor (meta-evolution)

> v1/v2 are **content-layer** evolution (article evolution / multi-language sync); Mode 3
> is **pipeline-layer** evolution (meta-pipeline). The three are EVOLVE-PIPELINE's three
> modes: article evolution / language sync / pipeline self-refactor.

### Trigger signals (pipeline self-refactor needed)

Any one triggers:

| Signal                              | Threshold                             | Example                                   |
| ----------------------------------- | ------------------------------------- | ----------------------------------------- |
| **Numbering bloat 3 levels deep**   | Step X.X.X appears + number gaps      | a pipeline with Step 4.5e.iv              |
| **Single file > 1000 lines**        | wc -l > 1000                          | an over-grown pipeline                    |
| **Multi-file boundary confusion**   | same SOP canonical in two places      | two pipelines redefining one step         |
| **Prose rules not instrumented**    | accumulated rules with no plugin gate | 18 prose rules, 1 in the linter           |
| **"I know it, no need to read"**    | repeatedly verified skip-reading      | a pipeline run N times then steps skipped |
| **Doc-to-product density too high** | SOP lines / product words > 5:1       | 1334 SOP lines / 200-word output          |

### First-principles refactor SOP (7 stages)

```
SCAN → DESIGN → SPLIT → REWIRE → INSTRUMENT → VERIFY → SHIP
```

**Stage 1: SCAN** — inventory the whole file + ecosystem (line count, cross-ref scope,
numbering depth, prose-vs-plugin ratio). Decide whether a refactor is triggered.

**Stage 2: DESIGN** — redesign from first principles, not incremental edits:

- 5±2 stages (Miller's law cognitive range)
- one verb per stage (PICK / VERIFY / WRITE / SHIP)
- no Step X.X.X numbering — use `## stage verb` + `### sub-heading`
- single-concern canonical: one focus per file (process / craft / gate / post-publish)
- separate the historical layer from the canonical layer: active SOP in canonical,
  historical lessons in git log

**Stage 3: SPLIT** — if a single file > 1000 lines, split into process / craft / gate /
post-publish files in the same directory. Cross-ref protection: keep the main file path
unchanged; split sub-files into the same dir; update active-canonical pointers; keep
historical-layer descriptions as-is; turn merged files into stub redirects (don't
delete).

**Stage 4: REWIRE** — update active-canonical cross-references; exclude the historical
layer (memory / diary / lessons) from updates.

**Stage 5: INSTRUMENT** — promote prose rules to plugin gates. A real gate needs all
layers: philosophy → rule definition → tool implementation → hook integration → pipeline
call site. Instrument regex-only rules first; leave complex rules (LLM-as-judge) for a
later wave.

**Stage 6: VERIFY** — checklist: all sub-files pass `article-health.py
--check=prose-health` with hard=0 warn=0; existing products regress clean on the new
plugin; no dead pointers in active-canonical docs; sample bad cases trigger the plugin;
main-path line count −30%+.

**Stage 7: SHIP** — atomic commit sequence, one logical milestone per commit.

> The worked example for this mode is upstream's SPORE-PIPELINE refactor (1334 → 445
> lines). LB has no spore pipeline; the methodology is general and applies to any LB
> pipeline that hits the trigger signals above.

🧬

---

_v1.0 | 2026-06-28 — LB content-evolution pipeline (Phase 1-7 spine, evolution score, six feedback loops, three-layer architecture, and Mode 3 pipeline self-refactor inherited from upstream EVOLVE-PIPELINE.md v3.5; translated to English, regrounded to LB sources (local news + GitHub feedback + corpus self-scan) and LB output (knowledge/INBOX.md), analytics tiers (GA4 / SC / CF) and the multi-language sovereignty sync subsystem relabeled dormant rather than transplanted; examples regrounded to Laguna Beach (anti-Wikipedia 1927-incorporation framing, seasonal events calendar))._
