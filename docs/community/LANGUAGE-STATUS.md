# Language Status — LagunaBeach.md multilingual support

> **For contributors who want to translate articles or add a new language.**
> SSOT for this list: [`src/config/languages.ts`](../../src/config/languages.ts)

---

## TL;DR

| Language    | Code    | Status            | Routes       | Articles |
| ----------- | ------- | ----------------- | ------------ | -------- |
| 🇺🇸 English  | `en`    | ✅ Default (SSOT) | /            | 18       |
| 🇹🇼 繁體中文 | `zh-TW` | ⏸️ **Preview**    | ❌ no routes | 0        |

LagunaBeach.md is English-first: the source of truth is English (`knowledge/{Category}/`). The i18n architecture is preserved but dormant, with Traditional Chinese (`zh-TW`) as the first translation target. (Note the direction is reversed from upstream Taiwan.md, where Chinese was canonical and English a translation.)

---

## ✅ Active language

English is fully wired into:

- Astro routing (`/...` URLs)
- Sitemap (`hreflang` tags)
- Language switcher
- Search index
- Dashboard translation coverage
- llms.txt for AI crawlers

---

## ⏸️ Preview language

Files in `knowledge/zh-TW/` are accepted in PRs **but the language has no routes yet** — articles exist as data only.

### Why preview rather than active

Promoting a language to active requires:

1. ✅ Article translations (a contributor can do this)
2. ⏳ UI-string translation (~150 i18n keys, maintainer work)
3. ⏳ Flipping `enabled: false` to `true` in [`src/config/languages.ts`](../../src/config/languages.ts)
4. ⏳ Build verification (hreflang / sitemap / language-switcher tests)

Steps 2–4 are the maintainer's responsibility. A contributor can submit step-1 translation PRs now; they'll be merged but stay offline. Once UI translation is done, **all accumulated preview translations go live at once**.

### Current status

**🇹🇼 繁體中文 (zh-TW)**

- 0 translations so far (the corpus is 18 English articles)
- UI strings: not started
- Activation: when there's enough translated content + a UI-string translation to justify enabling routes

To translate an article into `zh-TW`, see [`docs/community/TRANSLATION-BOARD.md`](TRANSLATION-BOARD.md). Required frontmatter:

```yaml
---
title: '繁體中文標題'
description: '...'
date: 2026-06-19
tags: [...]
category: 'Trails'
translatedFrom: 'Trails/top-of-the-world.md' # ← required, prevents orphans
---
```

The `translatedFrom` field is the **most important** addition — it lets the system detect orphan translations even if `_translations.json` is incomplete.

---

## 🌱 Adding a brand-new language (de / es / ja ...)

**Simple steps:**

1. Add an entry in [`src/config/languages.ts`](../../src/config/languages.ts):

   ```typescript
   {
     code: 'de',
     displayName: 'Deutsch',
     hreflang: 'de',
     enabled: false, // start as preview
     notes: 'New language pending UI translation',
   }
   ```

2. Mirror the edit in [`src/config/languages.mjs`](../../src/config/languages.mjs) (a sync check verifies the two files match)

3. Start submitting article translation PRs — they land in `knowledge/de/` but get no routes

4. When someone translates the UI strings (copy each `src/i18n/*.ts` block and adapt to the new language):
   - flip `enabled: false` to `true`
   - run `npx astro build` to confirm the pages pass
   - push → the `/de/` routes generate automatically

The `LANGUAGES_REGISTRY` refactor reduced this to 2 files to edit instead of the ~15 it used to take.

---

## 🛡️ Orphan prevention

Every translation file **must** declare `translatedFrom` in its frontmatter:

```yaml
translatedFrom: 'Trails/top-of-the-world.md'
```

This field is the SSOT. `knowledge/_translations.json` is a cache auto-generated from frontmatter, not a hand-maintained source of truth.

**Why this is more reliable than a central `_translations.json` mapping:**

- File-level self-documentation (no need to consult a central table)
- Even if `_translations.json` misses an entry, the file still knows its source
- A pre-commit hook can enforce it
- When a source article is renamed/deleted, you can immediately detect which translations became orphans

A pre-commit hook rejects any new translation PR missing `translatedFrom`.

---

_Maintained alongside src/config/languages.ts — when adding a language, update both._
_Last updated: 2026-06-28_
