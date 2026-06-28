---
title: 'CITATION-GUIDE'
description: 'Source-citation and footnote standard — how every claim traces to a source + footnote-format SSOT'
type: 'editorial-canonical'
status: 'canonical'
current_version: 'v1.0'
last_updated: 2026-04-12
last_session: 'historical'
sister_docs:
  - 'EDITORIAL.md'
  - 'RESEARCH.md'
  - 'QUALITY-CHECKLIST.md'
upstream_canonical:
  - 'EDITORIAL.md'
  - '../semiont/MANIFESTO.md'
---

# CITATION-GUIDE.md — source-citation and footnote standard

> Every article's source citations must follow this standard.
> For design rationale see [CITATION-SYSTEM.md](../design/CITATION-SYSTEM.md).
> For the writing workflow see [REWRITE-PIPELINE.md](../pipelines/REWRITE-PIPELINE.md) Stage 2.

---

## Format: Footnote-First (v4, since 2026-03-31)

Use Markdown footnote syntax `[^n]` to tie a source precisely to the sentence it supports, instead of a list at the end of the article:

```markdown
The 1993 firestorm destroyed 441 homes in Laguna Beach.[^1] One resident later said, "Before the fire and after the fire is how we date everything now."[^2]

## References

[^1]: [City of Laguna Beach — 1993 Laguna Fire after-action report](URL) (1994)

[^2]: [Oral history interview, Laguna Beach Historical Society](URL) (2018)
```

---

## Three citation scenarios

| Scenario                    | Method                       | Example                                    |
| --------------------------- | ---------------------------- | ------------------------------------------ |
| Data (numbers, percentages) | Add `[^n]` in the body       | `16,000 acres burned[^3]`                  |
| Quotation ("...")           | Add `[^n]` after the quote   | `"That was the most fragile moment."[^5]`  |
| Source inside a callout     | Inline link (not a footnote) | `([Laguna Beach Historical Society](URL))` |

---

## Citation-density standard

At least 1 footnote per 300 words.

| Article tier | Lines   | Minimum footnotes |
| ------------ | ------- | ----------------- |
| S tier       | 200-300 | 10+               |
| A tier       | 120-200 | 7+                |
| B tier       | 80-120  | 5+                |

---

## Footnote-format standard

**Format: link + dash + full description**

```markdown
[^1]: [Laguna Beach Historical Society — early-village archive](URL) — local-history collection; documents the city's growth from artist colony to incorporation (1927), with primary-source records of the early village.
```

**Rules:**

- **Description length**: at least 20-30 words; describe the source's publication background, what it covers, and its historical value.
- **No bare links**: `[^1]: [URL]` or `[^1]: URL` is not acceptable.
- **No "ibid."**: when you cite the same source again, still write a full description (it can be shorter, but never blank).

**Comparison:**

| Not acceptable           | Acceptable                                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[^1]: [Wikipedia](URL)` | `[^1]: [Wikipedia: Laguna Beach, California](URL) — overview of the city's geography, incorporation history, and demographics, with sourced citations.` |
| `[^2]: ibid.`            | `[^2]: [same source](URL) — covers the 16,000 acres burned and the $528 million in 1993-dollar damages from the firestorm.`                             |
| `[^3]: URL`              | `[^3]: [City of Laguna Beach](URL) — official municipal site; publishes the city's incorporation record (1927) and emergency-preparedness documents.`   |

---

## Source-quality requirements

- A URL must point to a **specific page**, not just a homepage (❌ `https://www.lagunabeachcity.net/` / ✅ `https://www.lagunabeachcity.net/content_xxx`)
- A single website counts as at most 2 sources (5 Wikipedia links ≠ 5 sources)
- At least **2 primary sources** (government / academic / official report)
- At least **1 source** that is a recognized authority (museum, historical society, peer-reviewed work)

---

## Position in the article structure

```
body
  ↓
Further reading (**Further reading**: + markdown links)
  ↓
## References          ← this heading must exist
  ↓
[^1]: ...              ← footnote definitions
[^2]: ...
```

**The `## References` heading must exist**, placed after Further reading and before the footnote definitions.

**Backward compatibility:** an older article's `## References` bullet list still renders, but new articles and rewrites always use footnotes.

---

## The iron rule while writing

**⚠️ Insert footnotes as you write — do not backfill them afterward.**

Matching sources back to sentences after the fact is extremely time-consuming. The Stage 1 research notes already pair "fact → source"; in Stage 2 cite them directly as you write.

---

_Version: v1.0 | 2026-04-04_
_Split from EDITORIAL.md v4.1 §source-citation; consolidates the citation-density standard and footnote-format rules._
