# LagunaBeach.md (rebuild — Sekai KB instance #1)

Knowledge base for Laguna Beach, CA. Fresh rebuild of the retired taiwan-md fork
(now archived as `lagunabeach-md-v1`); becomes instance #1 of the **sekai-kb**
framework when Phase 5 cuts the template. Built with Astro; content is plain
Markdown under `knowledge/` (arrives in Phase 1/3).

## Where things live

- **Binding spec:** `.fable/STRATEGIC-DIRECTION.md` — product decisions, architecture
  PDR, extraction map, full task list (§E). Read its 2026-07-07 revision note first.
- **Operative docs (once approved):** `docs/PRD.md`, `docs/SPEC.md`, `docs/ROADMAP.md`,
  `docs/adr/`. Conflicts with the binding spec go to Wilson, never silently resolved.
- **Process config:** `.claude/dev.md` — dev-plugin config: tracker (Linear, workspace
  `sekai-kb`, team `LB`, project "LB Rebuild"), conventions, extraction-source paths.
- **Promoted learnings:** `.claude/rules/` (written by `/dev:retro` on approval).
- **Architecture diagrams (engineering SSOT):** `docs/diagrams/*.drawio`.

## How work happens

The dev plugin lifecycle: tasks live in Linear (single source of truth for task
state), one PR per task behind CI, `/dev:execute` → `/dev:review-pr` → `/dev:verify`.
Never mark work done outside a verified merge.

## Iron rules

1. **SSOT:** `knowledge/` is the only content source of truth; `src/content/` is
   derived (gitignored, written by sync) and never edited directly.
2. **Genericity:** zero place-specific strings in `src/` or `scripts/`; place identity
   flows from `place.config.ts` + `knowledge/` + `public/media/` (CI-gated from 0.3).
3. **Extraction over invention:** design and components are copied from
   `../lagunabeach-md-v1` per the spec's §C, then genericized — never re-prompted
   from description.
