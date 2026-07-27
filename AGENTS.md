# LagunaBeach.md (rebuild — Sekai KB instance #1)

Knowledge base for Laguna Beach, CA. Fresh rebuild of the retired taiwan-md fork
(now archived as `lagunabeach-md-v1`) and instance #1 of the **sekai-kb**
framework. Built with Astro; content is plain Markdown under `knowledge/`.

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

- **Product SSOT:** `docs/PRD.md` — goals, customer value, north star, and non-goals.
- **Engineering SSOT:** `docs/SPEC.md` and `docs/adr/` — architecture, contracts,
  extraction/disposition decisions, risk controls, and accepted decisions.
- **Delivery SSOT:** `docs/ROADMAP.md` — phase order, detailed task blocks, amendments,
  dependencies, and phase gates. Linear is the SSOT for live task state.
- **Instance history:** `CHANGELOG.md` — LB work only. Framework release notes stay in
  the `sekai-kb` changelog and are read from release tags during `/sekai-upgrade`.
- **Versions:** `VERSION` is LB's release SSOT. `FRAMEWORK-VERSION` records the
  adopted Sekai release. `package.json.version` mirrors `VERSION` without the
  leading `v`; routine article PRs do not bump it. Explicit releases use `/sekai-release`.
- **Operations:** `docs/runbook/DEPLOY.md`, `docs/runbook/UPGRADE.md`, and
  `docs/runbook/RELEASE.md` cover deployment, framework adoption, and explicit LB
  releases.
- Conflicts among these documents go to Wilson, never silently resolved.
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
`@`-imports the config (`AGENTS.md` → `@.agent-toolkit/dev.md`). The promoted rules
themselves are **not** `@`-imported: project bootstrap discovers them by walking
`rules_dir` and reading each file's `tier` frontmatter, loading doctrine into every
dev session and gotchas only on a trigger match (see the `## Rules` section of
`dev.md` and the dev plugin's `runtime_contracts/project-bootstrap.md`).

## How the site builds

`knowledge/` → `scripts/core/sync.sh` → parallel prebuild (KB index, search,
content dates, git info, related articles, changelog, map markers, and dashboard)
→ `astro build` → post-build contract checks. `src/content/` and `src/data/` are
derived, gitignored projections of `knowledge/`; never edit them directly.

## Iron rules

1. **SSOT:** `knowledge/` is the only content source of truth; `src/content/` is
   derived (gitignored, written by sync) and never edited directly.
2. **Genericity + English-only:** zero place-specific strings and zero CJK/multi-language
   code paths in any code tree; test fixtures are code, and so are the framework skills
   under `.agents/skills/`. Place identity flows from `place.config.ts` + `knowledge/` +
   `public/media/`. Machine-gated by `npm run genericity`, whose two gates carry
   **different** instance-mode scan roots: `scripts/ci/check-genericity.sh` (place-name
   denylist) scans `src/`, `scripts/`, `tests/`, `.agents/skills/`;
   `scripts/ci/check-english-only.mjs` (CJK codepoints) scans `src/`, `scripts/`,
   `tests/`, `workers/`, `.agents/skills/`; in template mode (the `.sekai-template`
   marker, absent in this adopted instance) both scan the whole repository. Each root
   is scanned only where the directory exists, so a root that has not arrived yet is
   silently unguarded rather than an error — `workers/` is in the CJK gate's roots
   alone, so a denylisted place string under `workers/` would go unchecked. History:
   CI-gated from 0.3; scope extended to `tests/` plus the CJK-codepoint scan in LB-20
   under the English-only doctrine; `.agents/skills/` joined both gates with the
   framework skills in 5.6 (`docs/SPEC.md` Negative requirements).
   `scripts/ci/check-scan-root-docs.mjs` keeps every scan-root statement in this
   repository synchronized with the gates.
3. **Extraction over invention:** design and components are copied from
   `${SRC_HOME}/lagunabeach-md-v1` per `docs/SPEC.md`'s extraction map, then genericized — never
   re-prompted from description.
4. **Framework vs instance:** `src/`, `scripts/`, and `.agents/skills/` are
   framework-owned. Customize through `place.config.ts`, `knowledge/`, and
   `public/media/`. Upstream deeper changes to sekai-kb and pull them back through
   an immutable release tag.

## Skill discovery and ownership

Codex discovers project skills natively from `.agents/skills/*/SKILL.md`. Claude
Code must discover them from the same path by reading each file's YAML `name` and
`description`, then load the full file when the user names a skill or the request
matches its description. Claude needs the explicit instruction because
`CLAUDE.md` delegates all project instructions to this file and the skills do not
live under Claude's default `.claude/skills/` path.

The skills under `.agents/skills/` use the `sekai-` prefix to avoid collisions
with adopter and tool-provided skills. They are framework-owned, like `src/` and
`scripts/`, and framework upgrades manage them. Configure them through
`place.config.ts`, `knowledge/`, and the editorial playbook, not by editing their
bodies.

- Adding an instance skill is conflict-free when it uses a new directory and a
  non-`sekai-` name under `.agents/skills/`. The `/sekai-kb` router discovers the
  directory dynamically.
- Overriding a framework skill requires upstreaming the change to sekai-kb or
  accepting a local fork that `/sekai-upgrade` will flag when the same path
  changes upstream.

Both genericity gates scan `.agents/skills/`; agent-executed instructions are code
under the genericity and English-only rules.

## Language support boundary

UI strings and editorial tooling are English-calibrated; Latin-script content
largely works (plain word tokenization; article-health prose thresholds may need
retuning per instance); CJK content is unsupported until the post-project
multi-language revisit. `place.locale` and `place.languages[]` are declared but
dormant schema seams — don't build on them.

## Semiont probe

`semiont/config.json` at the repo root configures the autonomous-organ layer
(memory, routines — arrives in a later framework release). Skills and scripts that
look for it must **no-op gracefully when it is absent**. It is absent in this
release; nothing should require it.

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
`context_file` points here); the reference line below `@`-imports the config
(`dev.md`). The promoted rules are loaded by project bootstrap discovering
`rules_dir` by each file's `tier` frontmatter, not by `@` import. Adopting this
instance as a template strips this block and the `.agent-toolkit/` tree.

Dev workflow (agent-toolkit dev plugin): @.agent-toolkit/dev.md
<!-- dev-plugin:end -->
