---
title: 'REWRITE-PIPELINE (English / LB)'
description: 'Article write/rewrite step-sequencer for LagunaBeach.md — 6 stages, mode-agnostic after Stage 0'
type: 'pipeline-canonical'
status: 'canonical'
current_version: 'v1.0'
last_updated: 2026-06-24
last_session: '2026-06-24-r7-impl'
sister_docs:
  - '../editorial/EDITORIAL.en.md'
  - '../editorial/QUALITY-CHECKLIST.md'
---

# REWRITE-PIPELINE.en.md — Article Write/Rewrite v1.0

> All articles (new or rewrite) follow one linear pipeline. Mode is determined
> in Stage 0; Stages 1-5 are mode-agnostic.

---

## Stage 0: Perspective

Determine scope before research begins.

1. **Mode**: new article or rewrite of existing?
2. **Angle**: what makes this topic relevant to Laguna Beach specifically?
   What's the local memory, cultural context, or geographic connection?
3. **Existing material** (rewrite only): read current `knowledge/` file,
   extract what to keep vs. what to rework.
4. **Editorial load**: read [`docs/editorial/EDITORIAL.en.md`](../editorial/EDITORIAL.en.md)
   in full. It defines voice, structure, quality bar.

Output: mental model of what you're writing and why. No file written yet.

---

## Stage 1: Research

Gather facts. Every claim must be sourceable.

1. Search for relevant information (web, local files, prior knowledge base articles).
2. Cross-check any numbers, dates, or names against at least two sources.
3. Note gaps: if a fact can't be verified, flag it rather than guessing.

**Hard gate**: no fabricated facts. If `knowledge/` has no answer and research
can't confirm it, write nothing for that claim (Rule 12).

---

## Stage 2: Draft

Write the article per [`EDITORIAL.en.md`](../editorial/EDITORIAL.en.md) standards.

- Structure: frontmatter → lede → body → sources (where applicable).
- Voice: authoritative but accessible. Local perspective, not tourist-brochure.
- Length: match depth to topic. No padding; no artificial brevity.
- Target: `knowledge/{Category}/{slug}.md`.

---

## Stage 3: Fact-check

Self-audit the draft against Stage 1 sources.

1. Every named date, number, person, or place: verify against research notes.
2. Any claim without a source: either source it or cut it.
3. If web sources were used: confirm URLs are reachable.

---

## Stage 4: Quality-checklist gate

Run the article against [`docs/editorial/QUALITY-CHECKLIST.md`](../editorial/QUALITY-CHECKLIST.md).

Check:

- Frontmatter complete and valid
- No orphan links
- Word count appropriate for category
- No EDITORIAL.en.md violations (voice, structure, sourcing)

Fix any failures before proceeding.

---

## Stage 5: Sync

Run `/lb-sync` (or `bash scripts/core/sync.sh`) to project the new/updated
`knowledge/` file into `src/content/`.

Verify the synced file appears correctly. Done.

---

_v1.0 | 2026-06-24 — initial LB rewrite pipeline (stage names from upstream REWRITE-PIPELINE.md; content written for LagunaBeach.md context)._
