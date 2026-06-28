---
title: 'TRANSLATION-PIPELINE (English / LB)'
description: 'EN→zh-TW translation methodology for LagunaBeach.md — 5 phases, SSOT-preserving, frontmatter-disciplined'
type: 'pipeline-canonical'
status: 'canonical'
current_version: 'v1.0'
last_updated: 2026-06-25
last_session: '2026-06-25-r9-impl'
sister_docs:
  - 'REWRITE-PIPELINE.md'
  - 'FACTCHECK-PIPELINE.md'
  - '../editorial/EDITORIAL.md'
---

# TRANSLATION-PIPELINE.md — EN→zh-TW Translation v1.0

> **Core principle:** translation is projection, not word substitution. Rebuild
> the English article's editorial perspective in zh-TW, preserving factual
> anchors (dates, names, numbers, citations) verbatim while reframing cultural
> context for the target reader.

---

## Preconditions

| Check                    | How                                                       | Fail action                           |
| ------------------------ | --------------------------------------------------------- | ------------------------------------- |
| Target language enabled  | `grep 'zh-TW' src/config/languages.mjs` → `enabled: true` | STOP — run `/lb-language-birth` first |
| Source article exists    | `ls knowledge/{Category}/{article}.md`                    | STOP — write it first via `/lb-write` |
| Source passes validation | Run `/lb-validate` on the source                          | Fix source before translating         |

---

## Phase 1: Select and Prepare

1. **Identify source article.** Must be an EN article in `knowledge/{Category}/`.
2. **Check existing translation.** `ls knowledge/zh-TW/{Category}/{article}.md`
   — if it exists, this is an update (re-translate from current EN), not a new
   translation.
3. **Create target directory if needed:** `mkdir -p knowledge/zh-TW/{Category}/`
   (matching the source Category name exactly, including spaces/ampersands).
4. **Read the source article in full.** Identify: factual anchors (dates, names,
   numbers, URLs), wikilinks, frontmatter keys, structural sections.

---

## Phase 2: Translate

Translate the article body following these rules:

1. **Prose:** rewrite in natural zh-TW. Not machine-translation tone. Use
   Traditional Chinese characters. Match the source's register (academic for
   history, casual for food/trails).
2. **Factual anchors:** dates, proper nouns, numbers, URLs stay verbatim. Do not
   localize "1927" to "民國16年" — use Western year format for consistency.
3. **Wikilinks:** preserve `[[Target Article]]` syntax. Do NOT convert to
   markdown links — the build system handles cross-language link resolution.
4. **Length:** translation should be proportional to source. zh-TW is typically
   0.6-0.9x the English word count (CJK is denser). Significant divergence
   (< 0.5x or > 1.2x) signals truncation or padding — investigate.
5. **Section structure:** mirror the source's heading hierarchy (H2, H3, etc).
   Section titles are translated, not transliterated.
6. **Do not add content** that isn't in the source. Translation is projection,
   not expansion. If context is needed for zh-TW readers, add a brief
   parenthetical, not a new paragraph.

---

## Phase 3: Frontmatter

The translated file's frontmatter must include:

```yaml
---
title: '繁體中文標題'
description: '繁體中文描述'
category: '{Category}' # English, matching source exactly
translatedFrom: '{Category}/{filename}.md' # NO 'knowledge/' prefix
date: YYYY-MM-DD # mirror source
tags: [...] # translate tags to zh-TW equivalents
---
```

**Hard rules:**

- `category` — always English, identical to source (e.g., `'History'`, not `'歷史'`).
- `translatedFrom` — relative path from `knowledge/` root, no `knowledge/` prefix.
  Example: `'History/laguna-beach-history.md'`, not `'knowledge/History/...'`.
- `date` — mirror the source article's date exactly.
- `featured` — mirror the source. Translator does not change this.

---

## Phase 4: Verify

Run these checks before committing:

1. **Frontmatter schema:** `node scripts/core/test-frontmatter.mjs` — must pass.
2. **Wikilink integrity:** `node scripts/utils/test-wikilinks.mjs` — no broken
   internal links.
3. **File location:** translated file is at `knowledge/zh-TW/{Category}/{filename}.md`
   (same filename as source).
4. **Sync test:** `bash scripts/core/sync.sh` — zh-TW file must appear at
   `src/content/zh-TW/{category-slug}/{filename}.md`.
5. **Build:** `npm run build` — no regressions.

---

## Phase 5: Commit and Sync

1. **Commit** the new/updated file in `knowledge/zh-TW/` with message:
   `feat(i18n): translate {article} to zh-TW`
2. **Run `/lb-sync`** to project into `src/content/zh-TW/`.
3. **Update `knowledge/_translation-status.json`** if the project tracks
   per-article translation state (check if this file has the article entry).

---

## Output path summary

```
Source:  knowledge/{Category}/{article}.md          (EN, SSOT)
Target:  knowledge/zh-TW/{Category}/{article}.md    (zh-TW translation)
Synced:  src/content/zh-TW/{category-slug}/{article}.md  (derived, gitignored)
```

The sync path is driven by `scripts/core/sync.sh` `sync_lang()`: for non-default
languages (anything except `en`), source is `knowledge/{lang}/{Category}/` and
destination is `src/content/{lang}/{category-slug}/`.

---

_v1.0 | 2026-06-25 — LB translation pipeline (method extracted from upstream TRANSLATION-PIPELINE.md v4.0; Taiwan-specific framing dropped, EN→zh-TW direction established, LB sync paths verified, Rule 12 SSOT grounding preserved)._
