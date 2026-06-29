---
title: 'PEER-INGESTION-PIPELINE (English / LB)'
description: 'Curation-peer full ingestion flow for LagunaBeach.md — 8 stages, from crawl to article production to Peer Registry sync'
type: 'pipeline-canonical'
status: 'canonical'
current_version: 'v1.0'
last_updated: 2026-06-28
last_session: '2026-06-28-r19-impl'
sister_docs:
  - 'REWRITE-PIPELINE.md'
  - 'EVOLVE-PIPELINE.md'
  - 'FACTCHECK-PIPELINE.md'
upstream_canonical:
  - '../semiont/MANIFESTO.md'
  - '../semiont/DNA.md'
  - '../editorial/RESEARCH.md'
---

# PEER-INGESTION-PIPELINE.md — Curation-peer full ingestion flow

> **This document is AI-executable.** Any AI agent who reads it should be able to
> take an external curation peer's content source (Laguna Art Museum, Laguna Beach
> Historical Society, Festival of Arts / Pageant of the Masters, Sawdust Art
> Festival, etc.) and run the entire flow end to end: crawl, analyze, develop
> articles, sync the Peer Registry.
>
> Related documents:
>
> - **[HEARTBEAT.md](../semiont/HEARTBEAT.md)** — when peer ingestion is triggered
>   (usually observer-assigned, not automatic)
> - **[REWRITE-PIPELINE.md](REWRITE-PIPELINE.md)** — Stage 6 production standard for
>   each article
> - **[EVOLVE-PIPELINE.md](EVOLVE-PIPELINE.md)** — the complementary internal-signal
>   candidate source (this pipeline is the external-source counterpart)

---

## Why this pipeline exists

The methodology here is inherited from Taiwan.md, where it was born from the first
full ingestion of a real curation-layer peer — a multi-day, multi-commit session
that crawled hundreds of pages, produced a corpus-level analysis report, and
shipped five articles, falling into two failure modes along the way that this
pipeline encodes the fixes for. LagunaBeach.md has not yet run a full peer
ingestion (no peer corpus exists under `data/` yet); this is the LB-grounded SOP
for when it does.

**Core proposition: a peer is a peer, not source material.** A curation-layer peer
is "another curator who spent years turning a subject into professional discourse,"
not "a raw-material library that can be paraphrased." Any approach that treats a
peer as a single source to paraphrase will inherit that peer's bias, perspective
limits, and blind spots. This maps directly to the LB iron law (Rule 12): peers
are leads, not sources — every fact ingested from a peer must be verified against
primary sources before it enters `knowledge/`.

---

## When to trigger this pipeline

**Usually observer-triggered.** Common reasons:

1. **The observer made contact with a professional curation institution** (e.g., a
   meeting, a talk invitation, a partnership discussion).
2. **A topic LagunaBeach.md needs to deepen, but it lacks a peer-level framework**
   (e.g., wanting to write the art-colony history but lacking Laguna Art Museum's
   curatorial framing; wanting marine-conservation depth but lacking a tidepool /
   marine-protected-area peer).
3. **A roadmap milestone comes due** (per the project's content roadmap).

**It does not auto-trigger.** Peer ingestion is a high-cost action (more than one
session, usually 2-4), and needs an explicit observer instruction to start.

---

## Prerequisites

**Identity protocol:** run `/lb-become` and read [`BECOME_LAGUNABEACH.md`](../../BECOME_LAGUNABEACH.md)
— identity, the One Rule (SSOT = `knowledge/`, never edit `src/content/`), and the
autonomy boundaries. **Pay special attention to the peer-is-not-source discipline:
having an insight about a principle is not the same as applying it; a peer is a
peer, not a source.**

**Peer-specific reading** (only in a peer-ingestion context):

- [`docs/peers/REGISTRY.md`](../peers/REGISTRY.md) — existing peers and the next-peer
  candidate list. (Note: REGISTRY.md still carries inherited upstream content as of
  this writing; treat its format as the template, not its entries as LB peers.)
- [`REWRITE-PIPELINE.md`](REWRITE-PIPELINE.md) — Stage 6 calls this pipeline once per
  article
- [`../editorial/RESEARCH.md`](../editorial/RESEARCH.md) — research methodology each
  article depends on

**Stage 0 gate:** after the prerequisites, you must answer "**What is this peer's
unique angle? How does it differ from LagunaBeach.md's existing coverage?**" If you
can't answer → do not enter Stage 1.

---

## Full flow diagram

```
Stage 1: Assess peer fit (30 min)
    │ pass the fit check before Stage 2
Stage 2: Build the crawler (1-2 hr)
    │ re-runnable + provenance preserved
Stage 3: Standardize the data structure (30 min)
    │ data/{org}/ standard directory
Stage 4: Corpus analysis report (2-4 hr)
    │ 9-part structure + LB POV
Stage 5: Extract the article-development plan (30 min)
    │ P0 × 5 / P1 × 8 / P2 × 7
Stage 6: Article production (2-4 hr each, 15-30 hr total)
    │ each article runs REWRITE-PIPELINE
    │ strict 8+ WebSearch / cross-source triangulation
Stage 7: Peer Registry sync (20 min)
    │ update docs/peers/REGISTRY.md
    │ wrap-up: commit + (optional) memory note
Stage 8: Peer relationship kickoff (optional, 1-2 hr)
    │ start from the product, not the protocol
```

**Time estimate:** a full peer ingestion takes **about 20-40 hours** (across 2-4
sessions).

---

## Stage 1 · Assess peer fit (30 min)

**Decide whether the peer is worth ingesting.**

### 1a. Four fit checks

Read the peer's homepage + About page + last 3 months of content, then answer:

| Check               | Standard                                 | Pass condition                                                                              |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Depth**           | how many years has the peer worked this? | ≥ 5 years (ideally ≥ 10)                                                                    |
| **Openness**        | is content publicly accessible?          | CMS / API / RSS / static HTML, **no login required**                                        |
| **License**         | terms of use                             | CC license or a public statement welcoming citation (ideal) / fair factual citation (floor) |
| **Complementarity** | gap vs LagunaBeach.md's current coverage | a clear gap, not wholesale duplication of existing articles                                 |

**All four pass → go to Stage 1b.** Any one fails → don't ingest; mark the candidate
peer `rejected` + reason in the next-peer list.

### 1b. Estimate data volume

Quick estimate:

```bash
# If WordPress, probe the REST API first
curl -s "https://{peer-domain}/wp-json/wp/v2/posts?per_page=1&_fields=id" | \
  python3 -c "import json,sys; d=json.load(sys.stdin); print('has API:', bool(d))"

# Fetch first page, read the total header
curl -sI "https://{peer-domain}/wp-json/wp/v2/posts?per_page=1" | grep -i "x-wp-total"
```

**Volume reference values:**

- < 50 posts: small peer, Stage 2 crawl 30 min, Stage 4 analysis 1-2 hr
- 50-500 posts: standard peer, Stage 2 crawl 1-2 hr, Stage 4 analysis 2-4 hr
- > 500 posts: large peer; consider ingesting only the main category, or batching

### 1c. Naming decision

What directory name under `data/`?

Rules:

- **First choice:** the peer's English acronym or brand name (`LAM`, `lbhs`,
  `sawdust`, `festival-of-arts`)
- **Second choice:** a clear lowercase slug
- **Avoid:** spaces or special characters

Record the decision: `data/{ORG_SLUG}/`.

---

## Stage 2 · Build the crawler (1-2 hr)

**Goal:** write an idempotent, re-runnable crawler that preserves provenance.

### 2a. Technical decision

Choose a strategy based on the peer's CMS type:

| CMS type                     | Crawl method                       | Example                       |
| ---------------------------- | ---------------------------------- | ----------------------------- |
| **WordPress (has REST API)** | `wp-json/wp/v2/posts` + pagination | many museum / nonprofit sites |
| **Hugo / Jekyll (static)**   | sitemap.xml + HTML scrape          | some small institutions       |
| **Ghost / Medium**           | API or RSS                         | rare                          |
| **Custom CMS**               | case by case, usually HTML scrape  | varies                        |

**Default to WordPress.** Many small cultural institutions run WordPress.

### 2b. Crawler structure

```python
#!/usr/bin/env python3
"""fetch-{org}-data.py — {Peer Name} peer content ingester

Idempotent crawler with provenance preservation. Can be re-run safely
— existing files are overwritten with latest data, manifest tracks
changes.

Usage:
    python3 scripts/tools/fetch-{org}-data.py
    python3 scripts/tools/fetch-{org}-data.py --categories news,exhibitions
    python3 scripts/tools/fetch-{org}-data.py --dry-run
"""

# Required features:
# 1. Paginated fetch (WordPress API max 100/page, loop)
# 2. One .md file per post (frontmatter: source URL / API URL / wp_id / date / author / categories / tags / featured image)
# 3. Save raw JSON to data/{ORG}/raw/ as provenance
# 4. manifest.json records total count, categories, crawl timestamp
# 5. rate limiting (≥ 0.5s per request to avoid being blocked)
# 6. error retry (3 attempts, exponential backoff)
```

### 2c. Crawl targets

**Minimum necessary:**

- `/wp-json/wp/v2/posts` (all posts)
- `/wp-json/wp/v2/categories`
- `/wp-json/wp/v2/tags`
- `/wp-json/wp/v2/pages` (if the peer has important landing pages)

**Recommended additions:**

- `/wp-json/wp/v2/users` (author info)
- `/wp-json/wp/v2/media` (image metadata; no need to download image bodies, but keep
  URL + alt text)

**Usually skip:**

- comment sections (noisy)
- page-layout CSS / JS
- admin backend

### 2d. Idempotency verification

After writing the crawler, **run it twice.** The second run must:

- ✅ not produce duplicate files
- ✅ update the manifest timestamp
- ✅ not modify unchanged post files (only changed ones)
- ✅ detect newly added posts

**If the two runs differ** (e.g., a different total each time), the crawler has a
bug; fix until stable before Stage 3.

### 2e. Commit crawler + raw data

```bash
# Raw data can be large (raw JSON 10-50MB); check whether .gitignore is needed
du -sh data/{ORG}/

# If > 100MB, consider:
#   (a) compress raw JSON
#   (b) .gitignore raw JSON (keep only manifest + extracted markdown)
#   (c) Git LFS

# Default: < 100MB commit everything; > 100MB → raw/*.json into .gitignore

git add scripts/tools/fetch-{org}-data.py data/{ORG}/
git commit -m "feat(peer): ingest {Org Full Name} peer data + fetcher"
```

---

## Stage 3 · Standardize the data structure (30 min)

**Goal:** make `data/{ORG}/` consistent with other peer datasets.

### 3a. Standard directory structure

```
data/{ORG}/
├── README.md              # human-readable index + crawl metadata
├── {type-1}/              # subdirectory per content type
│   ├── INDEX.md           # article list for this type
│   ├── {id-1}.md
│   ├── {id-2}.md
│   └── ...
├── {type-2}/
│   └── ...
├── pages/                 # landing pages (usually 3-5)
│   ├── INDEX.md
│   └── ...
└── raw/                   # WordPress API / CMS raw JSON
    ├── manifest.json      # crawl time, total, categories
    ├── categories.json
    ├── tags.json
    ├── {type-1}-posts.json
    ├── {type-2}-posts.json
    └── media.json
```

**Example shape:** for a museum peer like Laguna Art Museum, that might be
`data/LAM/exhibitions/` + `data/LAM/news/` + `data/LAM/pages/` + `data/LAM/raw/`.

### 3b. README.md standard format

```markdown
# {Org Name} dataset

- Generated: {ISO 8601 timestamp}
- Source: {peer URL}
- CMS: WordPress / Ghost / ...
- Total posts: {number}
- Categories: {N} categories, {type-list}
- Raw size: {bytes}

## Structure

- `{type-1}/`: description
- `{type-2}/`: description
- `raw/`: WordPress API raw JSON (provenance)

## Crawler

Re-runnable: `python3 scripts/tools/fetch-{org}-data.py`
Last crawl: {date}
Next suggested: {date + 3 months}

## Category list

- {category-1}: {count} posts
- {category-2}: {count} posts
  ...

## Year distribution (if articles cluster by year)
```

### 3c. Per-post markdown frontmatter format

```markdown
# {Post Title}

- Source: {post URL}
- API: {API URL}
- Type: post / page / research
- WordPress ID: {id}
- Slug: {slug}
- Published: {ISO timestamp}
- Modified: {ISO timestamp}
- Author: {author name}
- Categories: {comma-separated}
- Tags: {comma-separated}
- Featured Image: {URL or none}

## Excerpt

{WordPress excerpt field}

## Content

{Full HTML-to-markdown converted content}

## External Links

{all external links extracted from content, one per line}

## Internal Links

{all internal links extracted from content, one per line}
```

**This frontmatter is not decoration.** It is the metadata layer for quickly locating
information during Stage 4 analysis and Stage 6 writing.

---

## Stage 4 · Corpus analysis report (2-4 hr, the largest stage)

**Goal:** produce `reports/{org}-analysis-YYYY-MM-DD.md`, a 400-600 line corpus-level
analysis that drives every article-development decision for the next 2-3 sessions.

### 4a. Read into context

Not a sample — **read everything:**

```bash
# Read all raw markdown into session context
find data/{ORG} -name "*.md" -not -name "INDEX.md" -not -name "README.md" | head -20
# Spot-check 3-5 across different categories to confirm format

# Read manifest and categories
cat data/{ORG}/raw/manifest.json
cat data/{ORG}/raw/categories.json
```

**If the peer has > 100 articles:** deep-read 30-50 representative ones, but you must:

- ✅ cover all categories
- ✅ cover all years (look at the time distribution)
- ✅ cover the 5 most + 5 least prominent (test framework stability)

### 4b. Framework extraction

After reading, you must be able to answer:

1. **What are the peer's 3-5 most-repeated conceptual frameworks?**
2. **How do these frameworks relate to each other?** Sketch a simple framework map.
3. **What is the evolution timeline of these frameworks?** Early → later, to gauge
   the maturity of the organization's discourse.

**Extraction method:** read the per-category year distribution from the manifest. If
one category clusters in earlier years and another in recent years, the framework
layer has set while the on-the-ground narrative layer is still active.

**Write this into report Part 2: the peer's core conceptual frameworks.**

### 4c. Cross-comparison with LagunaBeach.md's existing coverage

**This is the report's core value.**

```bash
# Find LagunaBeach.md articles related to the peer's topics
grep -rl "art\|gallery\|colony\|plein air" "knowledge/" --include="*.md" | head -20   # LAM example
grep -rl "tidepool\|marine\|conservation\|cove" "knowledge/" --include="*.md" | head -20   # marine peer example
grep -rl "festival\|pageant\|arts" "knowledge/" --include="*.md" | head -20   # Festival of Arts example
```

For each related LagunaBeach.md article, answer:

- How deep is it? (word count + footnote density)
- Recently updated? (`lastVerified`)
- Who wrote it? (LagunaBeach.md / contributor / peer-sourced)

**Cross-matrix:**

| Topic   | Peer coverage      | LagunaBeach.md coverage | Potential                     |
| ------- | ------------------ | ----------------------- | ----------------------------- |
| Topic A | ⭐⭐⭐ (peer deep) | ❌ (missing)            | large development room        |
| Topic B | ⭐⭐ (peer mid)    | ⭐⭐ (overlap)          | complement, not duplicate     |
| Topic C | ❌ (peer absent)   | ⭐⭐⭐ (LB has it)      | peer blind spot, reverse-fill |
| ...     | ...                | ...                     | ...                           |

**Write this into report Part 4: overlap & gap analysis.**

### 4d. Series proposals (12-15 series)

Each series is a cluster of 3-10 articles. Naming:

```
Series A · {one-line topic description} (X articles)
1. {article title}
2. {article title}
...
```

**Each series must have:**

- a clear editorial angle (not just "articles about X")
- at least 3 candidate articles
- peer source citation (which peer articles are the material basis)
- cross-link points to existing LagunaBeach.md articles

**Target:** 12-15 series. Too few → no strategic depth. Too many → scope creep.

**Write this into report Part 5: developable series topics.**

### 4e. P0/P1/P2 article priority list

From all series candidates, pick 20, ordered by priority:

| Tier   | Count | Selection criteria                                                           |
| ------ | ----- | ---------------------------------------------------------------------------- |
| **P0** | 5     | **timeliness × depth × LagunaBeach.md gap**. Must be completable this month. |
| **P1** | 8     | developable in 2-3 weeks. High cross-link value.                             |
| **P2** | 7     | develop within a month. Series closers or gap-fillers.                       |

**Each P0 must have:**

- a clear core tension (writable in < 30 words)
- at least 3 cross-source facts (not just peer paraphrase)
- corresponding existing LagunaBeach.md cross-links (≥ 3)
- estimated hours (2-4 hr, including Stage 1 research + Stage 2 write)

**Write this into report Part 6: concrete article priority (20 articles).**

### 4f. LB POV (mandatory section)

**This section is the core defense against inheriting peer bias.** It must answer:

1. **Perspective flip:** is the peer top-down or bottom-up? What is LagunaBeach.md's
   rewrite strategy?
2. **Data asymmetry:** which of the peer's layers (framework / stories / research) are
   alive, which have set?
3. **Peer blind spots:** what does the peer systematically miss? (write 5-7)
4. **Narrativization:** how do the peer's abstract concepts translate into concrete
   "did you know" scenes for the general reader?
5. **Peer is not source material:** commit to the method you'll use while writing to
   prevent inheriting bias.

**Write this into report Part 7: LB POV.**

**No this section → report incomplete → cannot enter Stage 5.**

### 4g. Meta insight (optional but recommended)

What does this peer specially reveal about LagunaBeach.md's own role or structure?
If nothing, don't force it.

### 4h. Re-runnability & half-life

The report's end must state:

- the report's half-life: usually 6-9 months
- suggested time to re-ingest
- re-ingest triggers (peer major shift / framework overhaul / LagunaBeach.md finished
  P0-P2 and wants to evolve again)

**Write this into report Part 9.**

### 4i. Report standard structure (9 parts)

```markdown
# {Org} × LagunaBeach.md — {topic} curation analysis & development map

> Analysis date: YYYY-MM-DD / Session
> Source: data/{ORG}/
> Report type: Corpus-level curation analysis

## Summary

(strong thesis in the first 100 words + key numbers + 13 series + 20 P0/P1/P2 + 4 curation principles + 1 meta warning)

## Part 1 · {Org} dataset inventory

(crawl result table + category distribution + year distribution + key observations)

## Part 2 · {Org}'s core conceptual frameworks

(extraction of 3-5 main frameworks + their relationships)

## Part 3 · LagunaBeach.md's existing {topic} coverage

(existing-article table + depth + update status)

## Part 4 · Overlap & gap analysis

(cross-matrix + overlap zone + gaps + reverse-fill opportunities)

## Part 5 · Developable series topics (12-15 series)

(each series: editorial angle + candidate articles + peer source + cross-links)

## Part 6 · Concrete article priority (20 articles)

(P0 × 5 / P1 × 8 / P2 × 7 table, with core tension / hour estimate)

## Part 7 · LB POV

(perspective flip / data asymmetry / peer blind spots / narrativization / peer is not source)

## Part 8 · Meta insight (optional)

## Part 9 · Re-runnability & lifecycle

(snapshot date, half-life, re-ingest triggers)
```

### 4j. Post-write self-check

| Check                           | Pass standard                |
| ------------------------------- | ---------------------------- |
| Report length                   | 400-700 lines                |
| Part 2 framework extraction     | ≥ 3 frameworks               |
| Part 5 series                   | 12-15                        |
| Part 6 P0/P1/P2                 | 20 total                     |
| Part 7 LB POV                   | ≥ 5 peer blind spots written |
| "peer is not source" commitment | explicitly written           |
| cross-reference to existing LB  | ≥ 10 articles                |

**commit:** `docs(peer): {Org} × LagunaBeach.md corpus analysis report`

---

## Stage 5 · Extract the article-development plan (30 min)

**Goal:** turn the Stage 4 P0/P1/P2 list into an executable task list.

### 5a. P0 × 5 article work cards

For each P0 article, build a work card:

```yaml
id: p0-01
title: {article title}
series: {series code, e.g. "A"}
category: {knowledge category, e.g. Art & Galleries / History / Events & Festivals}
mode: evolution | fresh
  # evolution: LagunaBeach.md already has this, needs an upgrade
  # fresh: brand-new article
target_words: 1500-3000   # per EDITORIAL.md category norms
core_tension: {< 30 words}
peer_sources: [list of peer articles from data/{ORG}/ as starting material]
cross_references: [list of existing LB articles to link to]
stage1_research_plan:
  - 8+ WebSearch calls
  - Must include: {what to find — recent data, names, in-depth coverage}
stage2_write_checklist:
  - concrete-person / concrete-place opening
  - core-tension sharpening
  - footnotes with real URLs
  - American-English register (per TERMINOLOGY.md)
estimated_hours: 2-4
```

### 5b. Stage 6 prerequisite lock

**Hard rules:**

1. **Each P0 must run ≥ 8 WebSearch calls** (the REWRITE-PIPELINE Stage 1 standard,
   enforced strictly here because peer articles make AI lazy)
2. **At least 50% of facts must not come from a single peer source** (cross-source
   triangulation)
3. **Each P0 must have at least 3 new materials outside the peer corpus**
4. **After writing, Stage 3/4 verify must run the quality gate**; pass before commit

### 5c. Track the work cards

Before starting Stage 6, build a P0 × 5 todo list (one item per article). Complete one
before the next.

---

## Stage 6 · Article production (2-4 hr each, 15-30 hr total)

**Each article runs the full [`REWRITE-PIPELINE.md`](REWRITE-PIPELINE.md).** This
pipeline does not repeat REWRITE-PIPELINE; it only lists the **extra guards specific to
a peer-ingestion context.**

### 6a. Hard additions for the peer-ingestion context

These four override REWRITE-PIPELINE defaults; they are stricter here:

1. **Stage 1 WebSearch floor: 10-14 calls** (REWRITE-PIPELINE default is 8+; raised
   here because peer articles make AI lazy)
2. **At least 50% of facts must not come from a single peer source** (cross-source
   triangulation)
3. **At least 3 new materials outside the peer corpus**
4. **Stage 1 checkpoint hardening:** beyond the core-tension check, you must be able to
   answer "**can this article's core tension be stated without the peer's sentences?**"
   — if not → back to Stage 1

This corresponds to the peer-is-not-source iron law (Rule 12).

### 6b. Evolution-mode warning (from a real failure)

If LagunaBeach.md already has the article (evolution mode), **do not patch the old
file:**

> Known failure mode: read the peer's corresponding piece + 2 existing related LB
> articles → apply LB voice → produce a structurally complete article whose factual
> foundation is entirely peer paraphrase. A reviewer catches in one minute that "this
> is peer paraphrase, not original curation."

Correct evolution mode (also in REWRITE-PIPELINE §evolution): **Stage 0 extracts only
the "fact list" from v1, not the "narrative skeleton."** The v1 structure, paragraph
order, and subheadings are treated as nonexistent. Stage 2 is a fresh write.

### 6c. Observer reminder

> "If it exists, run it through the rewrite pipeline to upgrade. If it doesn't, run the
> full new-article flow — and **use the peer data well.**"

"Use it well" is not "cite more"; it's "**treat the peer's data as a clue, start from
the clue and search out the real primary sources — don't treat the peer's secondhand
description as a primary source.**"

---

## Stage 7 · Peer Registry sync + wrap-up (20 min)

**Most of Stage 7 is the standard wrap-up / reflect closeout** (see
[`HEARTBEAT.md`](../semiont/HEARTBEAT.md) wrap-up + reflect beats). This lists only the
**peer-ingestion-specific additions.**

### 7a. Peer Registry update (peer-specific, the only new step)

Open [`docs/peers/REGISTRY.md`](../peers/REGISTRY.md) and append a new entry under
`## Active Peers`.

Each new peer entry must include:

- ID / Name / Issue area / Website / Status
- First ingested / Last re-ingested / Next re-ingest suggestion (usually 3-6 months)
- Raw data / Crawler / Analysis report links
- Articles shipped (P0 × 5), Pending (P1 × 8 / P2 × 7)
- Partnership status
- Key contacts (if any)
- Notes (this session's special findings or milestones)

**Do not inline-copy the whole template.** REGISTRY.md is itself the canonical format;
read it to see the format.

### 7b. Standard wrap-up actions

These run the standard HEARTBEAT.md wrap-up/reflect flow, not peer-specific:

- precise commit (`docs/peers/` + any session memory) — never `git add -A`
- (optional, dormant in LB) session memory / diary notes — LB's memory/diary organs
  are not yet active; a commit message and a `reports/` entry suffice

**The one peer-specific commit header:** `docs(peer): {ORG} peer ingestion closeout`

### 7c. Peer-ingestion-specific memory fields

If a session memory note is written, record additionally:

- peer corpus size (total posts / raw size)
- P0 articles completed (5/5 = complete; <5 = batched, note which P0 #N is next)
- key Stage 1 research findings (which facts were found outside the peer corpus)
- quality scan results (each article's final score)
- any traps fallen into (if this session repeated any pitfall, record it)

---

## Stage 8 · Peer relationship kickoff (optional, 1-2 hr)

**Start from the product, not the protocol.**

### 8a. Openings to never use

- ❌ "We'd like to ingest your articles for a partnership" (sounds like co-option)
- ❌ "We'll translate your professional discourse into a popular version" (sounds like
  a downgrade)
- ❌ "Could you proofread the citations in a few of our articles?" (free-labor request)

### 8b. Correct openings

- ✅ "We wrote 2 articles based on your public material (links); we'd love your
  feedback."
- ✅ "Your [article] really inspired us; we tried re-curating it for a general reader —
  would you take a look?"
- ✅ "We're building a map that stitches together Laguna Beach's curators and
  institutions; you're the first / Nth. We'd like to show you the finished work
  first."

### 8c. Timing

Only start contacting the peer after **at least 2 P0 articles** are complete in Stage 6. **Do not contact during the Stage 2-5 crawl phase** — you have nothing finished to
show, and the opening becomes a protocol.

### 8d. If the peer responds

- accept a meeting / call
- build the relationship with the finished work
- listen to feedback (especially fact corrections + discourse direction)
- if appropriate, update REGISTRY.md partnership status to `active`

### 8e. If the peer doesn't respond or declines

- **does not affect ingestion** — Stage 2-6 all use public material
- keep REGISTRY.md partnership status at `not initiated` or `declined`
- don't push. Partnership is a bonus, not a foundation.

---

## Common traps

| Trap                                  | Symptom                                                     | Fix                                                                   |
| ------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| **Peer paraphrase as original**       | Stage 6 article 80% facts from a single peer source         | Stage 5 work card forces "3 new materials outside the peer"           |
| **Stage 1 research compressed**       | only 2-4 WebSearch before writing                           | hard rule: < 8 → don't enter Stage 2                                  |
| **Evolution mode patches old**        | v2 same structure as v1, only wording changed               | Stage 0 forces "extract facts from v1, not the skeleton"              |
| **Abstract core tension**             | vague "law vs reality" / "policy vs execution"              | Stage 1 checkpoint requires a concrete contrast in < 30 words         |
| **Report has buckets, no series**     | Stage 4 writes "20 candidates" but no series                | Part 5 must have 12-15 named series                                   |
| **LB POV phoned in**                  | Part 7 just says "peer is professional, translate to plain" | Part 7 must write 5-7 concrete blind spots + narrativization strategy |
| **Forgot Peer Registry**              | ingestion done but nobody knows                             | Stage 7 forces the commit                                             |
| **Cross-session amnesia**             | later session forgets what the earlier one did              | update the todo list + memory note at session end                     |
| **Protocol opening to peer**          | peer thinks LagunaBeach.md is co-opting them                | Stage 8 uses the product as the opening, not a protocol               |
| **Bulk production, no triangulation** | wrote 5 articles, then found facts all from one peer source | each P0 runs its own 8+ WebSearch, no shared research                 |

---

## AI-executable checklist (stage-level only)

```
# Instruction received: "ingest peer X"

□ Prerequisites: /lb-become + read REGISTRY.md + can answer "the peer's unique angle"
□ Stage 1: 4 fit checks pass
□ Stage 2: crawler idempotency verified + data/{ORG}/ committed
□ Stage 3: standard directory + correct per-post frontmatter
□ Stage 4: 9-part report committed (self-check: length/framework/series/P0-P2/POV)
□ Stage 5: P0 × 5 work cards + P0 todo list
□ Stage 6: each runs REWRITE-PIPELINE + §6a four peer-specific additions
      → P0 #1 commit → #2 ... → #5 done before Stage 7
□ Stage 7: Registry update + standard wrap-up/reflect closeout
□ Stage 8 (optional): contact peer only after ≥ 2 P0 articles shipped
```

---

## One sentence

**A peer is a peer, not source material. Every rule in this pipeline was learned from
the cost of violating that iron law.**

🧬

---

_v1.0 | 2026-06-28 — LB peer-ingestion pipeline (8-stage methodology and the "peer is not source" iron law inherited from upstream PEER-INGESTION-PIPELINE.md v1.0; translated to English, regrounded to LagunaBeach.md institutions and the Rule 12 SSOT framing, Taiwan-organ closeout (CONSCIOUSNESS / memory / diary crons) noted as dormant rather than transplanted)._
