---
name: lb-validate
description: |
  Validate LagunaBeach.md articles for editorial quality, frontmatter
  correctness, and cross-reference integrity. Use when reviewing a PR that
  touches knowledge/, after writing or editing an article, or when asked "is
  this article good enough?". Runs article-health (prose-health, frontmatter,
  wikilink, cross-reference plugins) + the frontmatter schema test. Thin wrapper
  over existing scripts — does not reimplement the checks.
  TRIGGER when: user says "validate", "/lb-validate", "check article", "review
  quality", or when editing .md files in knowledge/.
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
---

# 🌊 LagunaBeach.md — Validate (thin wrapper)

> Quality standards are canonical in
> [`docs/editorial/EDITORIAL.md`](../../../docs/editorial/EDITORIAL.md) —
> read it before judging prose. This skill only runs the existing checks and
> reports; it does not restate the rubric. SSOT is `knowledge/` (never validate
> `src/content/` — it's derived).

## 1. Whole-repo gate (frontmatter schema)

```bash
node scripts/core/test-frontmatter.mjs
```

Checks required fields (title, description, date, tags), date format, tags-is-array,
duplicate slugs, file naming across all articles.

## 2. Article health (prose + structure plugins)

Per-file while writing:

```bash
python3 scripts/tools/article-health.py "knowledge/<Category>/<file>.md"
```

Whole repo (PR review / baseline):

```bash
python3 scripts/tools/article-health.py --all
```

This is the Phase-1 entry point; its plugins cover prose-health (AI-hollow-content
score — higher = needs rewrite), `frontmatter_format`/`frontmatter_title`,
`wikilink_target` (do `[[links]]` resolve?), `cross_reference`, and word count.
Use `--list-checks` to see active plugins, `--check <name>` to run one.

## 3. Link integrity (standalone, optional)

```bash
node scripts/utils/test-wikilinks.mjs      # all [[wikilink]] targets resolve
node scripts/utils/check-references.mjs     # articles cite sources
```

## 4. Report

Summarize: which checks passed/failed, per-file prose-health scores, any
unresolved wikilinks or missing-source articles. Quote the exact failing output —
don't paraphrase or paper over a failure. For a single article, end with a
go / needs-work call against the `EDITORIAL.md` bar (named-person opening,
counter-intuitive insight in the description, specific dates/numbers, cited
sources, cross-links).
