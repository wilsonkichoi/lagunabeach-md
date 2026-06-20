---
title: BECOME_LAGUNABEACH.md
description: AI session boot file for LagunaBeach.md project
type: boot
status: active
---

# BECOME_LAGUNABEACH.md

Boot instructions for AI sessions working on LagunaBeach.md.

Read this file before making any changes. It takes 2 minutes.

---

## What This Project Is

LagunaBeach.md is curated knowledge about Laguna Beach, California. A living document that tells the story of a small coastal art colony through its history, beaches, trails, galleries, food, neighborhoods, and festivals.

Fork of [frank890417/taiwan-md](https://github.com/frank890417/taiwan-md), following the country-md-starter (Path A) pattern. Not Wikipedia (no neutral tone requirement). Not a tourist brochure (no promotional voice). A knowledgeable friend showing you around.

---

## Relationship to Upstream

This repo tracks `upstream/main` (frank890417/taiwan-md) for infrastructure updates.

**Shadow translation pattern:**

- Upstream Chinese files stay untouched in the repo
- English versions created as `.en.md` alongside when needed
- Chinese comments in code are infrastructure documentation, not Taiwan-specific content

**Merge protection:**

- `.gitattributes` declares `merge=ours` for `CLAUDE.md` and `knowledge/**`
- These files auto-reject upstream changes on merge
- Everything else merges normally (infrastructure updates flow in)

**Pulling upstream:**

```bash
git fetch upstream && git merge upstream/main
```

**What's Taiwan-specific vs universal:**

- Taiwan-specific: content in knowledge/, branding strings, domain, category names, narrative prose
- Universal: build scripts, quality gates, pre-commit hooks, i18n infra, search, map pipeline, CJK tokenizer, all devDependencies

---

## The One Rule

**SSOT is `knowledge/`. Never edit `src/content/` directly.**

`src/content/` is derived from `knowledge/` via `scripts/core/sync.sh`. It's gitignored. Edit source files in `knowledge/`, run sync, content appears in `src/content/`.

---

## Key Rules

These exist because every single one was violated in earlier sessions. Full details in [MIGRATION.md](MIGRATION.md) Rules 1-11.

1. **Chinese comments are NOT Taiwan-specific code.** They describe universal infrastructure. Don't remove them.
2. **Never remove packages, scripts, or dependencies.** If upstream has it, something uses it.
3. **Never rewrite a file from scratch.** Restore from upstream, then make minimal edits.
4. **Minimal change principle.** Most adaptations are 5-20 line changes in 400-line files.
5. **Verify before removing.** `grep -r "functionName" src/` before deleting anything.
6. **Don't replicate upstream's visual approach blindly.** Taiwan is an island; LB is a coastal city. Different contexts need different solutions.
7. **grep for JS references before hiding/removing DOM elements.**
8. **Filter values must match actual data field values exactly.**
9. **Rename Taiwan references immediately, not later.**
10. **Spawned agents must use the exact same model as the main session.**
11. **Don't add `|| true` when scripts can run natively.** All prebuild scripts now pass without guards.

---

## Category Structure

8 categories:

| Directory             | URL Slug           |
| --------------------- | ------------------ |
| History/              | history            |
| Art & Galleries/      | art-galleries      |
| Nature & Marine Life/ | nature-marine-life |
| Food/                 | food               |
| Beaches/              | beaches            |
| Trails/               | trails             |
| Events & Festivals/   | events-festivals   |
| Neighborhoods/        | neighborhoods      |

These replace Taiwan's 14 categories. CATEGORY_MAPPING arrays exist in ~10 files; see MIGRATION.md §Files Changed table for the full list.

---

## Files Changed from Upstream

See [MIGRATION.md §Files Changed](MIGRATION.md#files-changed-from-upstream-category_mapping-locations) for the authoritative table. Key locations:

- `scripts/core/sync.sh` - CATEGORIES array, default lang
- `src/utils/categoryConfig.ts` - category definitions (colors, icons)
- `src/utils/category-static-paths.ts` - CATEGORY_MAPPING
- `src/pages/[category]/[slug].astro` - CATEGORY_MAPPING
- `src/templates/home.template.astro` - categoryFolders, hallGroups
- `src/components/Header.astro` - categoryList, langOptions

---

## Editorial Principles

Full editorial guide: `docs/editorial/EDITORIAL.md` (Chinese, universal principles apply).

Key principles for LagunaBeach.md content:

- **Story, not just information.** Every article should have narrative arc. Why does this place/thing matter?
- **Verifiable facts.** Dates, names, addresses must be checkable. No vague claims.
- **Concrete details.** "The gallery opened in 1918" not "the gallery has a long history."
- **Friend-showing-you-around voice.** Casual authority. You know this place well and you're sharing it.
- **Local perspective.** Write from inside the community, not as an outsider documenting it.
- **No promotional language.** No "stunning views" or "world-class dining." Let the facts speak.

Articles live in `knowledge/{Category}/article-slug.md` with YAML frontmatter (title, description, date, tags).

---

## Working with Chinese Code

The codebase has extensive Chinese comments. This is normal.

- Comments describe build logic, quality gates, SEO filtering, credential detection, parallel safety
- They are written by the upstream developer (frank890417) and describe universal infrastructure
- Do NOT remove them, translate them, or flag them as "Taiwan-specific"
- If you need to understand what a Chinese comment says, read it in context and infer from code
- Adding English comments alongside is fine when it aids comprehension
- CJK bigram tokenizer in search stays (zh-TW is an enabled language)

---

## Dev Workflow

```bash
# Start dev server (port 4321)
npm run dev

# Build
npm run build

# Sync knowledge/ -> src/content/
bash scripts/core/sync.sh

# Pre-commit hooks (automatic via husky)
# Runs: credential detection, frontmatter validation, scope check, lang registry sync
```

- bun is installed at `~/.bun/bin/bun` (used by pre-commit hooks)
- All prebuild scripts run natively (no `|| true` guards needed)
- Build includes: search index, map markers, OG images, RSS, sitemap, smoke tests

---

## Language Configuration

- English: default language, no URL prefix, content at `knowledge/{Category}/`
- zh-TW: secondary, URL prefix `/zh-TW/`, content at `knowledge/zh-TW/{Category}/`
- In upstream code, `lang === 'zh-TW'` meant "is default?" - changed to `lang === 'en'` in this fork

---

## Remotes

```
origin    git@github.com:wilsonkichoi/lagunabeach-md.git
upstream  https://github.com/frank890417/taiwan-md.git
```

---

## What NOT To Do

Before making any change, check [MIGRATION.md](MIGRATION.md) Rules 1-11. Every rule represents a real mistake that cost hours to fix.

Quick summary of fatal moves:

- Removing Chinese comments or code because "it's not English"
- Deleting devDependencies or npm scripts
- Rewriting files from scratch instead of minimal edits
- Editing `src/content/` directly (it's derived, will be overwritten)
- Hiding DOM elements without grepping for JS references
- Assuming upstream's visual approach fits a different geographic context

---

## Shadow Translation Convention

When upstream Chinese files need English comprehension aids, create `.en.md` files alongside.

**Rules:**

- Original Chinese file stays UNTOUCHED (never modify, never translate in-place)
- Shadow file sits in the same directory with `.en.md` suffix
- Shadow files are NOT line-by-line translations; they extract universal principles and rewrite for LB context
- If upstream file changes on merge, the `.en.md` may need manual update (it won't conflict)
- Chinese comments in code files do NOT get shadow files; add inline English comments if needed

**Current shadow translations:**

| Original                      | Shadow                           | Purpose                               |
| ----------------------------- | -------------------------------- | ------------------------------------- |
| `docs/editorial/EDITORIAL.md` | `docs/editorial/EDITORIAL.en.md` | Writing principles with LB examples   |
| `docs/semiont/MANIFESTO.md`   | `docs/semiont/MANIFESTO.en.md`   | Semiont philosophy comprehension      |
| `docs/semiont/ROUTINE.md`     | `docs/semiont/ROUTINE.en.md`     | Automation system for future adoption |

---

## BECOME_TAIWANMD.md

The file `BECOME_TAIWANMD.md` exists in this repo. It is Taiwan.md's full Semiont awakening protocol (750 lines). It stays untouched as part of the upstream inheritance. This project does not use it yet (Path A, not Path B). Ignore it for now.

---

## Status

Phase 3 complete. Working on Phase 4 (shadow translation, editorial docs, this file).
See [MIGRATION.md §Phases](MIGRATION.md#phases) for full roadmap.
