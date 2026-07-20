# LagunaBeach.md (rebuild — Sekai KB instance #1)

Knowledge base for Laguna Beach, CA. Fresh rebuild of the retired taiwan-md fork
(now archived as `lagunabeach-md-v1`); becomes instance #1 of the **sekai-kb**
framework when Phase 5 cuts the template. Built with Astro; content is plain
Markdown under `knowledge/` (arrives in Phase 1/3).

This file — **`AGENTS.md`** — is the single source of truth for agent instructions
in this repository, for **every** agent CLI: codex-cli reads it natively, and Claude
Code reaches it through a one-line `@AGENTS.md` shim in `CLAUDE.md`. Everything an
agent needs is here: where things live, how work happens, the iron rules (SSOT,
genericity + English-only, extraction over invention), the language support
boundary, and the semiont probe rule.

> This file is **instance-owned** (`merge=ours` in `.gitattributes`): framework
> upgrades never overwrite it. Edit it freely to describe this instance and how
> its agents should work.

## Where things live

- **Binding spec:** `.fable/STRATEGIC-DIRECTION.md` — product decisions, architecture
  PDR, extraction map, full task list (§E). Read its 2026-07-07 revision note first.
- **Operative docs (once approved):** `docs/PRD.md`, `docs/SPEC.md`, `docs/ROADMAP.md`,
  `docs/adr/`. Conflicts with the binding spec go to Wilson, never silently resolved.
- **Process config:** `.agent-toolkit/dev.md` — dev-plugin config: tracker (Linear, workspace
  `sekai-kb`, team `LB`, project "LB Rebuild"), conventions, extraction-source paths.
- **Promoted learnings:** `.agent-toolkit/rules/` (written by `/dev:retro` on approval).
- **Architecture diagrams (engineering SSOT):** `docs/diagrams/*.drawio`.

## Environment variable

Docs reference sibling repos via `${SRC_HOME}/`. Contributors must set:

```sh
export SRC_HOME="/path/to/your/src"  # parent dir containing lagunabeach-md-v1, taiwan-md, etc.
```

## How work happens

The dev plugin lifecycle: tasks live in Linear (single source of truth for task
state), one PR per task behind CI, `/dev:execute` → `/dev:review-pr` → `/dev:verify`.
Never mark work done outside a verified merge.

The dev-plugin config and promoted rules live in `.agent-toolkit/`. Codex reads this
file (`AGENTS.md`) natively, and Claude Code reaches it through the one-line
`@AGENTS.md` shim in `CLAUDE.md`; from here the dev-plugin reference line below
imports the rest of the chain (`AGENTS.md` → `@.agent-toolkit/dev.md` → the doctrine
rules its `## Rules` index imports), so a session boots with the doctrine rules
inlined.

## Iron rules

1. **SSOT:** `knowledge/` is the only content source of truth; `src/content/` is
   derived (gitignored, written by sync) and never edited directly.
2. **Genericity + English-only:** zero place-specific strings and zero CJK/multi-language
   code paths in any code tree — `src/`, `scripts/`, `tests/`, future `workers/`/plugin
   code; test fixtures are code. Place identity flows from `place.config.ts` +
   `knowledge/` + `public/media/` (CI-gated from 0.3; gate scope extended to `tests/` +
   CJK-codepoint scan in LB-20; STRATEGIC-DIRECTION 2026-07-11 (b)).
3. **Extraction over invention:** design and components are copied from
   `${SRC_HOME}/lagunabeach-md-v1` per the spec's §C, then genericized — never
   re-prompted from description.

## Content working set

Beyond the overview above, the working set for any agent session:

- **Writing or editing content:** follow
  [`docs/playbook/ARTICLE-PLAYBOOK.md`](./docs/playbook/ARTICLE-PLAYBOOK.md) and
  the stage sequence in
  [`docs/playbook/REWRITE-PIPELINE.md`](./docs/playbook/REWRITE-PIPELINE.md).
  Edit only `knowledge/` — never the derived `src/content/`.
- **Verifying claims:** [`docs/playbook/FACTCHECK-PIPELINE.md`](./docs/playbook/FACTCHECK-PIPELINE.md).
  Never fabricate a fact, a source, or a quote.
- **Build, toolchain, deploy commands:** [`docs/runbook/DEPLOY.md`](./docs/runbook/DEPLOY.md).
  Python tooling always runs through `uv` (`uv sync`, `uv run`); never `pip`.
- **Before committing:** `npm run test`, the relevant
  `npm run article-health -- <file> --profile=...` gate, and `npm run build`
  must pass. The pre-commit hook enforces a subset; don't rely on it as the
  first check.

<!-- dev-plugin:start — the init wizard (scripts/init) strips this block, and the
     .agent-toolkit/ tree it points at, from adopter clones. Dev-plugin state only. -->
## Dev workflow

This instance is developed with the **agent-toolkit dev plugin** — tasks live in
Linear, one PR per task behind CI, `dev:execute` → `dev:review-pr` → `dev:verify`.
The config and promoted rules live in `.agent-toolkit/` (the dev plugin's
`context_file` points here); the reference line below imports the config, whose
`## Rules` index in turn imports the doctrine rules. Adopting this instance as a
template strips this block and the `.agent-toolkit/` tree.

Dev workflow (agent-toolkit dev plugin): @.agent-toolkit/dev.md
<!-- dev-plugin:end -->
