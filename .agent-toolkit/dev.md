---
tracker: linear
linear_team: LB
linear_project: "LB Rebuild"
test_command: "npm run test:ci && npm run article-health -- --all --profile=ci-deploy && npm run build"
ci_workflow: deploy.yml        # GH Actions workflow: genericity + build on every PR, deploy on push to main (LB-2)
merge_policy: squash
review_action_installed: false # auto PR-review GitHub Action (claude-review.yml) is set up; flips true at task 11.3
work_in_progress_limit: 2      # max tasks simultaneously In Progress + In Review
max_fix_attempts: 3            # CI-fix or review-fix cycles before a task goes Blocked
max_tasks_per_run: 5           # batch cap for /dev:auto and /loop /dev:execute
auto_merge: true               # standing merge approval for /dev:auto (see that skill)
context_file: AGENTS.md        # AGENTS.md is the agent-instruction SSOT + carries the dev-plugin reference line; CLAUDE.md is a one-line @AGENTS.md shim
rules_dir: .agent-toolkit/rules/  # promoted learnings, one file per rule (dev:retro writes here)
---

# Project conventions

## Binding spec and doc precedence

Binding spec: `.fable/STRATEGIC-DIRECTION.md` (see its 2026-07-07 revision note). Task
packets are converted from its §E, never re-derived. Once `docs/PRD.md`, `docs/SPEC.md`,
and `docs/ROADMAP.md` are approved, they are the operative docs for dev-plugin skills;
STRATEGIC-DIRECTION.md is the frozen source of record. Any conflict between them is
surfaced to Wilson — never silently resolved in either direction.

## Genericity rule (negative requirement)

Zero place-specific strings in `src/` or `scripts/`. All place identity flows from
`place.config.ts` + `knowledge/` + `public/media/`. CI-gated by
`scripts/ci/check-genericity.sh` from task 0.3 onward; until then, reviewers grep manually.

## Binding references (extraction sources — outside this repo, absolute paths)

| Reference | Role | Rule |
|---|---|---|
| `.fable/STRATEGIC-DIRECTION.md` (this repo) | binding spec | every task packet names the §E sub-unit it executes |
| `${SRC_HOME}/sekai-kb` (framework SSOT, GitHub `wilsonkichoi/sekai-kb`) | framework template + release train | Phase 5+ code lands here (LB-26 cut); instances merge **tagged releases only** (`sekai-kb-vX.Y.Z`), never framework `main` — per `docs/runbook/UPGRADE.md` + ADR 004. LB re-based onto `sekai-kb-v1.0.0` in LB-33 |
| `${SRC_HOME}/lagunabeach-md-v1` (the renamed fork checkout) | extraction source | §C prefers the fork's copy; reviews verify extraction claims against this tree, **byte-diff where §C says verbatim** |
| `${SRC_HOME}/taiwan-md` | design reference | consult for design rationale; never a content source |
| `${SRC_HOME}/lagunabeach-md-v0/_research/taiwan-md-research.md` + `taiwan-md-llm-wiki.md` | v0 deep research | §B/§D section pointers are mandatory pre-reads for the executor of the citing task (2.1 boundary sourcing, Phase 5 adopter needs, 7.1/7.2 worker designs) |
| v1 archive `MIGRATION.md` | lessons only | not process; the migration apparatus is dead per §F |

A session loads only the references its task cites — nothing else.

## Execution repo (Phase 5+): sekai-kb, tracker stays here

From Phase 5, task **code** executes in the **sekai-kb** repo
(`git@github.com:wilsonkichoi/sekai-kb.git`, cloned at `~/src/sekai-kb`) — the framework
template cut in LB-26. The Linear tracker (team `LB`, project "LB Rebuild") and **all**
process/planning docs (this file, `.agent-toolkit/rules/`, `.fable/STRATEGIC-DIRECTION.md`,
`docs/`) stay in `lagunabeach-md`. A packet's `Execution repo:` field names where its code
lands; absent that field, assume `sekai-kb` for Phase 5+.

Consequences for the dev-plugin skills (there is no `github_repo` in the frontmatter, and
`gh` defaults to the working-directory repo, which is `lagunabeach-md` — with its **own**,
unrelated PR numbering):

- **`dev:execute`** claims the task from Linear (run from `lagunabeach-md`) but does the
  worktree → commit → PR in `sekai-kb`. Record the full PR URL on the Linear task.
- **`dev:review-pr` / `dev:verify`** take the **task id** (e.g. `LB-27`), never a bare
  `#N` (a bare `#N` resolves against `lagunabeach-md`). They load the packet from Linear,
  read the PR URL from the task's work-summary comment, and must target every `gh pr …`
  call with `-R wilsonkichoi/sekai-kb`.

After **5.4** (LB-33, done), `lagunabeach-md` is **instance #1** of the framework (still the
live `lagunabeach.md` site), re-based onto `sekai-kb-v1.0.0` with the merge base established
(`git merge --allow-unrelated-histories`) and `merge=ours` on the instance-owned file list.
Feature phases 6-11 execute in `sekai-kb` and ship as tagged releases; `lagunabeach-md`'s
only commits are instance-owned — adopting each release via `/upgrade` (part of every phase's
exit gate; mechanics + the required `git config merge.ours.driver true` per-clone step in
`docs/runbook/UPGRADE.md`), `features.*` flags in `place.config.ts`, analytics IDs, ROUTINE
entries, and its own content/media. `FRAMEWORK-VERSION` records the adopted tag.

## Adopter dev-plugin upgrade state

SPEC `Repo topology` and ADR 006 define `.agent-toolkit/` presence as persistent
instance state. Before a framework tag merge, `/upgrade` classifies the instance as
stripped (tree and active AGENTS.md reference both absent) or installed (config and
reference both present). Stripped stays stripped across shared and unrelated histories;
installed keeps its adopter-owned config and rules. A mixed state is invalid and stops.
LB-44 implements and regression-tests this Phase 5 upgrade contract.

## Milestones and model policy

- Milestones = Linear project milestones on project "LB Rebuild", one per phase
  ("Phase 0" … "Phase 11"): 0-8 from §E, 9-11 from the ROADMAP "Extension task blocks"
  appendix (ADR 005) — packets convert from those blocks exactly as from §E.
  Phase transitions are Wilson gates: `/dev:plan` for phase n+1
  runs only after Wilson confirms phase n closed **and** the phase-n retro confirms every
  Backlog discovery stub from the phase is triaged — each stub either became a
  ROADMAP/SPEC edit (via `dev:backlog` triage), was pulled into the phase-n+1 plan, or was
  closed Wont Do with rationale. Untriaged stubs block the next plan.
- Wilson gates from §E (1.1c design sign-off, 3.2 domain cutover, 5.2c dana-point proof)
  are manual DoD criteria on those tasks — `/dev:verify` must stop for Wilson on them.
- Packet `Model:` notes (version-less, e.g. `Model: Opus`) are advisory; Wilson picks each
  session's model. Reviews default to Sonnet; a `Review-Model: Opus` note on a task
  (1.1c, 1.2b, each phase-closing task) overrides.

## Planning conventions

- **Verify extraction sources before citing them.** When a packet names a fork file as the
  extraction source for specific fields, confirm that file actually contains those fields
  before writing the packet. In LB-1 the packet cited `src/utils/category-static-paths.ts`
  `CATEGORY_MAP` for category icons/descriptions, but that const is slug→title only — the real
  source is `src/utils/categoryConfig.ts`, forcing a mid-task source hunt.
- **Mirror the fork's exact dep versions, not caret ranges** — see
  `.agent-toolkit/rules/extraction-version-pinning.md`. A packet's `^`/`~` ranges are advisory; the
  fork's installed version is the contract.
- **Read ahead, plan JIT.** When decomposing phase n, `/dev:plan` must read the §E / ROADMAP
  sections for phases n+1 and n+2 and include a **Forward constraints** section in the dry
  run: every phase-n decision a later phase depends on, one line each, citing the future §E
  unit it serves. A dry run without this section is incomplete — Wilson rejects it.
- **`Downstream:` field in every packet.** Each minted packet names the future §E units that
  consume its output (`Downstream: none` allowed, but must be stated), so the executor knows
  which interfaces are load-bearing contracts versus internal choices.
- **State the PR merge mode when history is the deliverable.** A packet whose DoD involves
  merge topology (tag merges, merge-base establishment, ancestry) must say its PR merges
  with a real merge commit — the `merge_policy: squash` default silently flattens
  history-shaped deliverables. Found as LB-33 review B1;
  `.agent-toolkit/rules/upgrade-prs-merge-commit-never-squash.md` carries the execution/verify
  guard.

## Execution conventions

- **Deferred-discoveries capture.** Any discovery during execute/review/verify that belongs
  to a future phase is captured immediately as a Linear **Backlog** stub: title, two
  sentences, link to where it surfaced. No milestone, no packet — stubs are state
  ("untriaged discovery exists"), not intent; intent enters the docs only at phase-close
  triage (see Milestones). Stubs are never worked directly; they become tasks only through
  `/dev:plan` or `dev:backlog` triage.
- **Every PR description carries a `Deferred discoveries:` section** — listing the stubs
  filed from that task, or an explicit `none`. `/dev:review-pr` treats a missing section as
  a review finding.
- **In-scope work is never a deferred discovery.** If a finding is required by the
  claimed task's Objective or DoD, it is implemented in that task; stubs are only for
  work belonging to a future phase. Stubbing DoD work is a review finding (blocker).
- **"Test-backed" DoD before the 4.1 test runner.** Until real tests arrive (task 4.1),
  `test_command` is `npm run build`. A DoD criterion whose evidence says "test-backed" is
  satisfied by a **postbuild check script** in the repo idiom
  (`scripts/core/post-build-check.mjs`, `check-internal-links.mjs`): a node script that
  asserts the contract and `process.exit(1)` on violation, wired into the `postbuild` `run-s`
  chain so it runs on every build locally and in CI. Do not leave "test-backed" as a one-off
  `jq` in the PR — wire the assertion so it guards regressions.
- **Cross-repo PR targeting (Phase 5+).** Framework code tasks execute in the
  `sekai-kb` repo (`github.com/wilsonkichoi/sekai-kb`, `${SRC_HOME}/sekai-kb`) per
  docs/ROADMAP.md "Execution repo flow"; the Linear tracker and process docs stay
  here, and some tasks (5.4, instance-owned edits) still commit in lagunabeach-md.
  `dev:review-pr` / `dev:verify` must therefore resolve the PR from the URL in the
  task's work-summary comment and pass its repo explicitly to every gh call
  (`gh -R wilsonkichoi/sekai-kb …`). Never use a bare `gh pr <n>` — it defaults to
  the working directory's repo (lagunabeach-md), which has its own PR numbering.
  Do NOT set the `github_repo:` frontmatter key for this; it is reserved for
  `secondary_intake: github` routing.

## Rules

Promoted engineering + process lessons (`dev:retro`) live in `rules_dir`
(`.agent-toolkit/rules/`), one file per rule. Project bootstrap **discovers**
them by walking `rules_dir` and reading each file's `tier` frontmatter — it does
not `@`-import a registry list, so nothing here is a bare `@path` line (a leftover
`@` import would make a harness inline every gotcha each session, defeating the
triggers). Every Markdown file under `rules_dir` must declare a valid `tier`; an
unclassified file fails the bootstrap closed rather than being silently dropped.
See the dev plugin's `runtime_contracts/project-bootstrap.md` for the loading
contract and trigger matching.

- **`tier: doctrine`** — always selected by project bootstrap; standing judgment
  about how work is scoped, reviewed, and shipped here, inlined into every dev
  session on either harness.
- **`tier: gotcha`** — selected only when a `triggers:` entry matches the task: a
  `paths` glob against the changed files, or an `objective` / `definition_of_done`
  case-insensitive substring. A gotcha needs at least one trigger.
- **`tier: none`** — a non-rule Markdown file that stays in place, loaded by nothing.

`.agent-toolkit/scripts/check-rule-registry.mjs` gates complete classification in
CI (every rule file carries a valid tier; every gotcha declares a trigger; no
`## Rules` entry is a bare `@path`); the required `test` job in
`.github/workflows/deploy.yml` runs it whenever `.agent-toolkit/dev.md` is present.
The tier tables below are a human index of what is promoted; the resolver's source
of truth is each file's own frontmatter, not this list.

### Doctrine

- `.agent-toolkit/rules/dod-is-the-scope.md` — the claimed task's Objective + DoD is the whole scope; never trim a DoD criterion citing "don't over-engineer"/simplicity/phase boundaries — silent scope-drop is a review blocker.
- `.agent-toolkit/rules/clean-rebuild-no-dead-fork-code.md` — this is a clean rebuild: dead fork-era code (unreachable branches, zh-TW fallbacks, fork-context comments) is a review **blocker**, not a nit; strip it at extraction, sweep ported files for CJK before hand-off.
- `.agent-toolkit/rules/fork-sweep-semantic-not-encoding.md` — a "dead fork code removed" claim needs a semantic grep (SPORE/APPLIES_TO/zh-TW/taiwan.md/…) plus the codepoint grep; enumerate the fork's vocabulary once, sweep `scripts/` + `tests/` together, ship a mechanical guard.
- `.agent-toolkit/rules/upgrade-prs-merge-commit-never-squash.md` — a PR whose branch history is the deliverable (framework-upgrade / tag-merge / merge-base) merges with `gh pr merge --merge`, never squash, and asserts `git merge-base --is-ancestor` after.
- `.agent-toolkit/rules/dod-guard-suite-must-run-in-ci.md` — a test suite cited as a DoD regression guard counts only if the CI workflow actually runs it; check `deploy.yml` for the exact script name and wire it in if missing — a green local run is not a gate.
- `.agent-toolkit/rules/genericity-gate-scope.md` — what the genericity + English-only gates check (place-name denylist grep + CJK-codepoint scan over `src/` + `scripts/` + `tests/`), what they don't (hex colors), and that they scan comments/doc-strings too.

### Gotchas

- `.agent-toolkit/rules/extraction-version-pinning.md` — pin build-toolchain deps (`astro`, `tailwindcss`, `@tailwindcss/vite`) to an exact build-verified version, never a caret range; security patches take precedence over matching the fork; the gate is a green build, not a vite-major count.
- `.agent-toolkit/rules/visual-parity-comparison-target.md` — visual-parity DoD compares against the v1 fork (`../lagunabeach-md-v1`, `npm run dev -- --port 4322`) at desktop and ~375px for every touched page; run both servers side-by-side before the PR.
- `.agent-toolkit/rules/dev-plugin-upgrade-reverify-rule-loading.md` — the harness's `@` expansion and the plugin's resolver are two different loaders; only `resolve_project_rules.py`'s `Rules loaded:` output is evidence, and a plugin version bump can invalidate the wiring with no project-side commit.
- `.agent-toolkit/rules/agents-md-dev-plugin-sentinels.md` — keep the AGENTS.md dev-plugin block inside its `dev-plugin:start/end` comment pair (reference line outside), or the init wizard's strip is a no-op and the Init wizard self-check job fails.
- `.agent-toolkit/rules/astro-geojson-import-raw.md` — build-time import of a `.geojson` (or other non-JSON data extension): use `?raw` + `JSON.parse`; Vite has no loader for the bare extension.
- `.agent-toolkit/rules/astro-json-island-escape.md` — emitting build-time JSON into a `set:html` `<script type="application/json">` island: escape every `<` to its `\u003c` form (`JSON.stringify` does not), or a `</script>` inside a string value breaks out of the island.
- `.agent-toolkit/rules/astro-static-paths-scope.md` — `getStaticPaths` helpers must be inlined or exported; non-exported frontmatter helpers are tree-shaken from the prerender chunk and throw at build.
- `.agent-toolkit/rules/external-link-arrow-exclusion.md` — adding a `target="_blank"` link inside an article surface: give it `class="no-external-icon"` or global CSS appends a stray ↗.
- `.agent-toolkit/rules/github-actions-least-privilege.md` — a workflow that runs PR code sets `permissions: contents: read` top-level; grant write scopes only on the job that needs them.
- `.agent-toolkit/rules/gray-matter-date-normalization.md` — normalize `matter().data.date` to an ISO string immediately; gray-matter silently coerces unquoted YAML dates to `Date`, breaking sort/`slice`.
- `.agent-toolkit/rules/lockfile-cross-platform.md` — after a dependency change verify `rm -rf node_modules && npm ci`; fully regenerate the lockfile when a package has platform-conditional native bindings.
- `.agent-toolkit/rules/optional-build-time-json-readfilesync.md` — an optional (maybe-absent) build-time JSON file: read it with `readFileSync` + `try/catch`, never `await import()` (Rollup fails to resolve before the catch runs).
- `.agent-toolkit/rules/prebuild-parallel-no-sibling-rm.md` — a `run-p` prebuild script cleans only its own output subtree, never a shared parent dir a sibling writes into concurrently.
- `.agent-toolkit/rules/prebuild-scripts-compute-not-fabricate.md` — prebuild scripts have full fs/git access: compute values from real repo data; hardcoding constants (with a "no access" comment) is fabricated data and a review blocker.
- `.agent-toolkit/rules/remark-plugin-no-dynamic-import.md` — remark/rehype plugins can't dynamically `import()` project config inside Vite's module runner; pass project data as plugin options from `astro.config.ts`.
- `.agent-toolkit/rules/shell-script-portability.md` — `scripts/**` must run on macOS bash 3.2 and CI bash 5: no `mapfile`/`readarray`, `unset CDPATH` before `cd`-in-`$()`.
