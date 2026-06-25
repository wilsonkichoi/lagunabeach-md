---
name: lb-embeddings
description: |
  Rebuild the LagunaBeach.md related-articles index via tag-overlap
  (scripts/core/build-related-tagoverlap.mjs → src/data/related/en.json).
  bge-m3 neural embeddings (build-embeddings.mjs) are tabled until the corpus
  reaches ~50-80 articles or a RAG/chatbot use case emerges.
  TRIGGER when: user says "rebuild related", "embeddings", "related articles",
  "/lb-embeddings", "rebuild semantic index", or after adding/retagging articles.
allowed-tools:
  - Bash
  - Read
---

# 🌊 LagunaBeach.md — Embeddings (related-articles rebuild)

> Gate: run `/lb-become` if not already awake this session.

## What this does

Regenerates the tag-overlap related-articles index that powers the "Related
Articles" sidebar on every article page. Output: `src/data/related/en.json`
(gitignored, regenerated each build via `prebuild:related`).

## Run

```bash
npm run prebuild:related
```

Which executes:

```bash
node scripts/core/build-related-tagoverlap.mjs
```

Expected output: `tag-overlap: N articles → src/data/related/en.json`

## When to run manually

- After adding new articles or changing tags in `knowledge/`
- After bulk tag cleanup
- To verify related-articles output before a commit

The same command runs automatically during `npm run prebuild` (part of the
parallel batch), so manual runs are only needed for pre-commit inspection.

## bge-m3 (tabled)

`scripts/core/build-embeddings.mjs` implements neural embeddings via bge-m3 on
the local RTX 4090. Currently tabled per Phase 5 decision: tag-overlap is
sufficient at current corpus size (18 articles). Revisit trigger: corpus past
~50-80 articles, or building the RAG/QR tourist chatbot. The script exists and
is adapted (CATEGORY_MAP = LB's 8), but is not wired into prebuild.

## Notes

- `src/data/related/en.json` is gitignored (derived artifact).
- `build-related-tagoverlap.mjs` currently hardcodes `en.json`; generalize to
  loop enabled langs when zh-TW gets real content.
- No content diff → output is identical (idempotent, no spurious diffs).
