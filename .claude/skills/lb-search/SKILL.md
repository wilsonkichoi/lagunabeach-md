---
name: lb-search
description: |
  Search the LagunaBeach.md knowledge base (Laguna Beach articles across 8
  categories: History, Art & Galleries, Nature & Marine Life, Food, Beaches,
  Trails, Events & Festivals, Neighborhoods). Use when you need LB context, want
  to find a specific article, or are writing LB content and need a reference.
  Returns top matches (title / category / relevance); can then read full articles.
  TRIGGER when: user asks about Laguna Beach, names a local place/topic, or needs
  LB knowledge to answer; also "/lb-search", "search articles", "find article".
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
---

# 🌊 LagunaBeach.md — Search (CLI thin wrapper)

> SSOT is `knowledge/` (en default at `knowledge/{Category}/`, zh-TW at
> `knowledge/zh-TW/{Category}/`). Prefer the CLI for ranking; read from
> `knowledge/` for full content.

## Search

```bash
node cli/src/index.js search "<QUERY>" --limit 5
node cli/src/index.js search "<QUERY>" --json --limit 5     # programmatic
```

## Read a match

```bash
node cli/src/index.js read "<SLUG>" --raw    # clean markdown, ideal for context injection
```

## Browse

```bash
node cli/src/index.js list <category>        # e.g. beaches, food, trails
node cli/src/index.js list --categories      # all 8 categories with counts
node cli/src/index.js random                 # discovery
```

## Workflow

1. `search` for the topic → 2. `read` the top match `--raw` → 3. use the content
   to inform the answer or the article you're writing. When writing/fact-checking,
   ground every claim in what `knowledge/` actually says (Rule 12 — no fabrication);
   if the corpus has no answer, say so rather than inventing one.
