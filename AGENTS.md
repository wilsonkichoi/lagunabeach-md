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

Two repositories carry planning documents at the same paths, and which one answers a
question depends on whether the question is about **this instance** or about the
**framework** (ADR 008, upstream). The instance's documents are here and are
`merge=ours`, so framework upgrades never overwrite them:

- **Product SSOT:** `dev_docs/PRD.md` — what lagunabeach.md is for: goals, customer value,
  north star, and non-goals.
- **Engineering SSOT:** `dev_docs/SPEC.md` and `dev_docs/adr/` — LB's deployment and domain, its
  content and categories, the extraction map, the inherited-fork disposition, the
  instance risk controls, and ADRs 001-002 (the rebuild decisions).
- **Delivery SSOT:** `dev_docs/ROADMAP.md` — phases 0-5 (the rebuild and the framework cut,
  which happened here) and, for each later phase, the instance-owned adoption step LB
  executes. Linear is the SSOT for live task state.

The framework's own PRD, SPEC, ROADMAP, and ADRs 003-008 live in
[`sekai-kb/dev_docs/`](https://github.com/wilsonkichoi/sekai-kb/tree/main/dev_docs) beside the
code they govern. Read them there for the stack, repo topology, the `place.config.ts`
schema, the content model, the build pipeline, the page set, the negative requirements
(including the genericity gates), framework risk controls, and the phase 6-11 task
blocks. `dev_docs/adr/README.md` indexes both sides. Nothing is duplicated across the two
repositories: a statement lives in exactly one of them.
- **Instance history:** `CHANGELOG.md` — LB work only. Framework release notes stay in
  the `sekai-kb` changelog and are read from release tags during `/sekai-upgrade`.
- **Versions:** `VERSION` is LB's release SSOT. `FRAMEWORK-VERSION` records the
  adopted Sekai release. `package.json.version` mirrors `VERSION` without the
  leading `v`; routine article PRs do not bump it. Explicit releases use `/sekai-release`.
- **Operations:** `docs/runbook/DEPLOY.md`, `docs/runbook/UPGRADE.md`, and
  `docs/runbook/RELEASE.md` cover deployment, framework adoption, and explicit LB
  releases.
- **Cloudflare Workers:** `workers/*/` — one directory per worker (`feedback`, `chat`,
  `og`, `mcp`), each with its own committed `wrangler.toml` template, `migrations/`, and
  `node:test` suite; `npm run worker-config` derives the gitignored
  `wrangler.generated.toml` this instance actually deploys. Deployed by hand, with one
  narrow exception: `.github/workflows/corpus-refresh.yml` rebuilds the corpus artifact
  and redeploys the workers that bundle it (`chat` and `mcp`), because that artifact is
  built from `knowledge/` and bundled at deploy time, so a manual-only path leaves the
  deployed retrieval index a snapshot of the last hand deploy. LB has opted in: the
  `CF_ACCOUNT_ID` and `CF_AI_TOKEN` repository secrets are set. The exception's four
  bounds — push to `main` only and never `pull_request`, opt-in through secrets whose
  absence makes the job no-op green, `contents: read` everywhere, and a documented token
  blast radius — are machine-checked by `npm run corpus-refresh:check` on every PR.
- Conflicts among these documents go to Wilson, never silently resolved.
- **Process config:** `.agent-toolkit/dev.md` — dev-plugin config: tracker (Linear, workspace
  `sekai-kb`, team `LB`, project "LB Rebuild"), conventions, extraction-source paths.
- **Promoted learnings:** `.agent-toolkit/rules/` (written by `/dev:retro` on approval).
- **Instance-owned guards:** `.agent-toolkit/scripts/`, run by
  `.github/workflows/instance-guards.yml`. Guards that only make sense for this
  instance live here rather than in the framework-owned `deploy.yml`, so a tag merge
  never conflicts with them and adopters never inherit them.
- **Architecture diagrams (engineering SSOT):** `dev_docs/diagrams/*.drawio`.

## Environment variable

Docs reference sibling repos via `${SRC_HOME}/`. Contributors must set:

```sh
export SRC_HOME="/path/to/your/src"  # parent dir containing lagunabeach-md-v1, taiwan-md, etc.
```

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
   `public/media/`. Machine-gated by `npm run genericity`, whose two gates each carry
   their **own** instance-mode scan roots: `scripts/ci/check-genericity.sh` (place-name
   denylist) scans `src/`, `scripts/`, `tests/`, `workers/`, `.agents/skills/`;
   `scripts/ci/check-english-only.mjs` (CJK codepoints) scans `src/`, `scripts/`,
   `tests/`, `workers/`, `.agents/skills/`; in template mode (the `.sekai-template`
   marker, absent in this adopted instance) both scan the whole repository. Each root
   is scanned only where the directory exists, so a root that has not arrived yet is
   silently unguarded rather than an error. The two lists agree today but are never
   merged into one claim, so either gate can gain a root without the other. History:
   CI-gated from 0.3; scope extended to `tests/` plus the CJK-codepoint scan in LB-20
   under the English-only doctrine; `.agents/skills/` joined both gates with the
   framework skills in 5.6; the denylist gate gained `workers/` in
   `sekai-kb-v1.0.17`, closing the gap where a denylisted place string under
   `workers/` went unchecked (framework SPEC, Negative requirements).
   `scripts/ci/check-scan-root-docs.mjs` keeps every scan-root statement in this
   repository synchronized with the gates.
3. **Extraction over invention:** design and components are copied from
   `${SRC_HOME}/lagunabeach-md-v1` per `dev_docs/SPEC.md`'s extraction map, then genericized — never
   re-prompted from description.
4. **Framework vs instance:** `src/`, `scripts/`, `workers/`, and `.agents/skills/`
   are framework-owned, the framework ships them and every release replaces them
   wholesale. That is a **default and an upgrade contract, not an access boundary**:
   this is your repository and you may edit any file in it. The recommended routes
   are still the cheap ones, customize through `place.config.ts`, `knowledge/`, and
   `public/media/`, and upstream anything larger to sekai-kb so it comes back as a
   tagged release and stops conflicting. What a direct edit costs is a merge conflict
   on that file at the next `/sekai-upgrade`, and the framework's job is to say so
   rather than to prevent it: a gate running in an instance fails the build only for
   something that harms a party other than the person editing, account-scoped
   collisions (a Worker `name`, a D1 `database_name`), committed credentials,
   security boundaries. Every other divergence warns, names both values, and names
   that cost (ADR 010; `docs/runbook/UPGRADE.md` §Framework-owned files). The
   genericity gate remains the structural guarantee for rule 2, which is a different
   rule and stays fatal. `CHANGELOG.md` becomes instance-owned at adoption; framework
   release notes remain available from immutable tags.
5. **Absent-safe schema evolution:** every new `place.config.ts` key must be safe
   when missing. A missing key leaves the new feature off, so an existing instance
   upgrades and builds without editing its config. Framework upgrades never require
   config surgery. The target tag's `CHANGELOG.md` Upgrade note names the opt-in key
   and the capability left off. LB's own config is `merge=ours`, so a release's schema
   addition never arrives through the tag merge — transcribing the declaration and
   opting in is the instance's step 2 (`sekai-kb-v1.1.5`, `features.mcp` and the
   `workers.mcp*` keys, adopted in LB-99).

   **Nothing machine-checks that transcription against the framework.**
   `npm run place-config:check` compares three statements of the schema that all live
   in this repository — the declaration in `place.config.ts`, the wizard's re-emission
   of it (`scripts/init/writer.mjs` reads the committed file, so it can only agree),
   and the prompt table — and never reads a framework tag. The comparison is manual,
   at adoption time:

   ```sh
   diff <(git show sekai-kb-vX.Y.Z:place.config.ts | awk '/^export interface PlaceConfig/,/^}/') \
        <(awk '/^export interface PlaceConfig/,/^}/' place.config.ts)
   ```

   Prose divergence is expected — this copy's comments record LB's own adoption
   history. A missing or renamed **key** is the defect to look for. LB-99 found one
   that way: `place.brandSuffix` had never been transcribed, while five `src/` files
   read it.

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

`/sekai-framework-release` is template-maintainer-only and hard-stops after
adoption when `.sekai-template` is absent.

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
Linear (single source of truth for task state), one PR per task behind CI,
`dev:execute` → `dev:review-pr` → `dev:verify`. Never mark work done outside a
verified merge. The config and promoted rules live in `.agent-toolkit/` (the dev
plugin's `context_file` points here); the reference line below `@`-imports the
config (`dev.md`). The promoted rules are loaded by project bootstrap discovering
`rules_dir` by each file's `tier` frontmatter, not by `@` import. Adopting this
instance as a template strips this block and the `.agent-toolkit/` tree.

Dev workflow (agent-toolkit dev plugin): @.agent-toolkit/dev.md
<!-- dev-plugin:end -->
