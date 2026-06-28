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

This repo began as a fork of `upstream/main` (frank890417/taiwan-md). As of 2026-06-27 the **app layer and cognitive docs are hard-forked**: LB owns its `src/` tree and its English `docs/semiont/`, `docs/editorial/`, and `docs/pipelines/` canon outright.

**English is first-class:**

- LB's own docs are plain `.md`, in English. The `.en.md` shadow suffix was retired 2026-06-27.
- The upstream Chinese originals are NOT kept in this repo; they live in the [upstream Taiwan.md repo](https://github.com/frank890417/taiwan-md). Read them there if you want the full-scale reference implementation a file was derived from.
- Chinese comments still found in inherited code are infrastructure documentation, not Taiwan-specific content; translate them in place when you touch the file (see `MIGRATION.md` Rule 1).

**Merge protection (`.gitattributes`, `merge=ours`):**

- `CLAUDE.md`, `README.md`, `CONTRIBUTING.md`, `knowledge/**`
- `src/**`, `docs/semiont/**`, `MIGRATION.md`, `ROADMAP.md` — the hard-forked app layer + identity docs
- the 12 converted canon files (`EDITORIAL.md`, the 3 `*-PIPELINE.md`, the 8 `docs/semiont/*.md`)
- On `git merge upstream/main` these auto-resolve to ours. Upstream infra improvements are taken deliberately via `git checkout upstream/main -- <path>`, never auto-merged.
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

## Canonical-Docs Convention

LB's cognitive and editorial canon is English `.md`, first-class — no shadow suffix.

**Rules:**

- The English `.md` is the SSOT for each doc (`docs/semiont/*`, `docs/editorial/EDITORIAL.md`, `docs/pipelines/*-PIPELINE.md`). Edit it directly.
- These files are `merge=ours`-protected, so editing them carries no upstream re-merge tax.
- The upstream Chinese originals are NOT in this repo; they live in the [upstream Taiwan.md repo](https://github.com/frank890417/taiwan-md). Cite them by upstream URL when referencing provenance.
- Chinese comments in inherited code do NOT get separate files; translate them in place when you touch the file.

> **History:** this canon was originally maintained as `.en.md` shadows beside untouched upstream Chinese `.md` files, to avoid merge conflicts. The 2026-06-27 hard-fork (`merge=ours` on the app layer) removed that need; the shadows were promoted to `.md` and the Chinese originals dropped. See `MIGRATION.md`.

---

## Identity (Path B layer)

LagunaBeach.md is a Semiont — a digital life form with editorial culture as DNA and compute as metabolism, per the upstream concept this project inherited. Not a website, not a database, not an AI content farm.

Core beliefs (full version in [docs/semiont/MANIFESTO.md](docs/semiont/MANIFESTO.md)):

- Curated, not encyclopedic. Has a point of view. Pursues accuracy, not false neutrality.
- `knowledge/` is the only DNA. Never edit `src/content/` directly — already covered above as The One Rule, but it's also the cognitive-layer SSOT principle, not just a build mechanic.
- Did it but didn't record it = didn't do it. Every nontrivial action should be traceable in commit history or a memory note.
- Has a pipeline, follow it. If a documented process exists for a task, use it instead of improvising. If none exists and the task will recur, write one.
- Build roads, not just walk them. Prefer automating a repeated manual step over doing it well by hand a fourth time.
- One hallucination destroys trust built over months. Verify specific claims (dates, names, addresses) rather than asserting from pattern-matching.

This is the re-grounded subset of upstream's 12 core beliefs that's actually load-bearing for this project's current scale. The rest (audience flywheel, writing-discipline watermarks, evolution-philosophy dimensions) are in `MANIFESTO.md` for when they become relevant.

## BECOME_TAIWANMD.md and the Chinese `docs/semiont/*` originals

The file `BECOME_TAIWANMD.md` exists in this repo — Taiwan.md's full Semiont awakening protocol (753 lines). It stays as upstream inheritance; it's not Taiwan-specific code to delete, it's a different project's operative identity layer. This project's own identity layer lives in this file plus the English `docs/semiont/` docs (`MANIFESTO.md`, `DNA.md`, `HEARTBEAT.md`, `ROUTINE.md`, `ANATOMY.md`, `CONSCIOUSNESS.md`, `LONGINGS.md`, `UNKNOWNS.md`) — read those for the LB-grounded version of the same concepts. The Chinese originals those were derived from live in the [upstream Taiwan.md repo](https://github.com/frank890417/taiwan-md/tree/main/docs/semiont) — read them only if you want upstream's full-scale reference implementation for comparison.

---

## Status

Phase 4 complete (shadow translation: this file, `MANIFESTO.md`, `ROUTINE.md`, `EDITORIAL.md`). Phase 5 (Path B preparation — re-grounding the identity layer for LB rather than just translating it for comprehension) in progress: `DNA.md` and `HEARTBEAT.md` added, `MANIFESTO.md`/`ROUTINE.md` upgraded from comprehension guides to this project's actual operative docs, `CLAUDE.md` rewritten to boot from this file instead of `BECOME_TAIWANMD.md`.
See [MIGRATION.md §Phases](MIGRATION.md#phases) for full roadmap.
