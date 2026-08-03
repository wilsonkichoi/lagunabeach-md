---
dev_plugin_repository: wilsonkichoi/agent-toolkit
dev_plugin_release: dev-v0.0.72
tracker: linear
linear_team: LB
linear_project: "LB Rebuild"
test_command: "npm run dev-plugin:check && npm run test:ci && npm run article-health -- --all --profile=ci-deploy && npm run build"
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

## Document authority and precedence

Since LB-62 the planning documents are split across two repositories at the same paths,
so authority is stated per document **and** per repository (ADR 008, upstream). Read the
one that owns the question; never reconcile them by editing the other side's copy.

| Document | `lagunabeach-md` (this repo) owns | `sekai-kb` owns |
|---|---|---|
| `docs/PRD.md` | what lagunabeach.md is for: its goals, customers, north star, non-goals | what the framework is for and who adopts it |
| `docs/SPEC.md` | deployment and domain, LB's content and categories, the extraction map, the inherited-fork disposition, instance risk controls | stack, repo topology, `place.config.ts` schema, content model, build pipeline, pages, new builds, phase 9-11 capabilities, framework risk controls, negative requirements |
| `docs/ROADMAP.md` | phases 0-5 (the rebuild and the framework cut) and, per later phase, the instance-owned adoption step | the phase 6-11 task blocks, their amendments, ordering rules, and phase gates |
| `docs/adr/` | ADRs 001-002, the rebuild decisions (`docs/adr/README.md` indexes both sides) | ADRs 003-008, which govern framework code |

Linear owns live task state, as one project spanning both repositories. Task packets are
converted from the owning repository's ROADMAP blocks, never re-derived. Any conflict —
between two documents, or between the two repositories' copies of one — is surfaced to
Wilson, never silently resolved in either direction.

## Genericity rule (negative requirement)

Zero place-specific strings in `src/` or `scripts/`. All place identity flows from
`place.config.ts` + `knowledge/` + `public/media/`. CI-gated by
`scripts/ci/check-genericity.sh` from task 0.3 onward; until then, reviewers grep manually.

## Binding references (extraction sources — outside this repo, absolute paths)

| Reference | Role | Rule |
|---|---|---|
| `docs/PRD.md`, `docs/SPEC.md`, `docs/ROADMAP.md`, `docs/adr/` — in **whichever repository owns the question** (see the precedence table above) | product, engineering, and delivery SSOTs | every task packet names the ROADMAP task block it executes, in the repository that carries that block, and cites the relevant SPEC/ADR contracts from the owning side |
| `${SRC_HOME}/sekai-kb` (framework SSOT, GitHub `wilsonkichoi/sekai-kb`) | framework template + release train | Phase 5+ code lands here (LB-26 cut); instances merge **tagged releases only** (`sekai-kb-vX.Y.Z`), never framework `main` — per `docs/runbook/UPGRADE.md` + ADR 004. LB re-based onto `sekai-kb-v1.0.0` in LB-33 |
| `${SRC_HOME}/lagunabeach-md-v1` (the renamed fork checkout) | extraction source | the SPEC extraction map prefers the fork's copy; reviews verify extraction claims against this tree, **byte-diff where the map says verbatim** |
| `${SRC_HOME}/taiwan-md` | design reference | consult for design rationale; never a content source |
| `${SRC_HOME}/lagunabeach-md-v0/_research/taiwan-md-research.md` + `taiwan-md-llm-wiki.md` | v0 deep research | SPEC and ROADMAP section pointers are mandatory pre-reads for the executor of the citing task (2.1 boundary sourcing, Phase 5 adopter needs, 7.1/7.2 worker designs) |
| v1 archive `MIGRATION.md` | lessons only | not process; the migration apparatus is retired per the SPEC inherited-fork disposition |

A session loads only the references its task cites — nothing else.

## Execution repo (Phase 5+): sekai-kb, tracker stays here

From Phase 5, task **code** executes in the **sekai-kb** repo
(`git@github.com:wilsonkichoi/sekai-kb.git`, cloned at `~/src/sekai-kb`) — the framework
template cut in LB-26. The Linear tracker (team `LB`, project "LB Rebuild") stays one
project across both repositories. Since LB-62 the **planning documents no longer all live
here**: each repository carries the PRD, SPEC, ROADMAP, and ADRs for the work committed in
it (see the precedence table above). This file and `.agent-toolkit/rules/` remain
instance-side; `sekai-kb` has its own copies of both, governing its own work.

**Which repo a session runs in.** Both repos carry their own `.agent-toolkit/dev.md`
since LB-41, and each governs the work committed in it (the sekai-kb copy says so in its
own words). `gh` defaults to the working-directory repo, so the working directory is what
makes cross-repo targeting correct rather than a per-call flag. **A session runs in the
repository that owns the documents it reads and the commits it makes** — those are always
the same repository, which is what makes the rule decidable without a lookup table:

- **Execution skills** — `dev:execute`, `dev:review-pr`, `dev:verify` — run in the repo
  named by the packet's `Execution repo:` field. For Phase 6+ framework work that is
  `sekai-kb` (`~/src/sekai-kb`), so `gh` resolves PR numbers, CI runs, and review threads
  against the right repo with no `-R` flag and no bare-`#N` ambiguity. Instance-owned
  packets (feature flags, analytics IDs, content, `/sekai-upgrade` adoptions) name
  `lagunabeach-md` and run here.
- **`/dev:plan`** runs in the repo whose ROADMAP carries the phase being decomposed, and
  amends that ROADMAP there. Phases 6-11 are framework phases: plan them in `sekai-kb`,
  reading its ROADMAP blocks. Plan LB's own instance work here. The **Forward
  constraints** and **Downstream** conventions below apply on whichever side the session
  runs; a forward constraint that lands on the other repository is recorded in the packet
  and surfaced to Wilson, never written into the other repo's ROADMAP from this side.
- **`/dev:backlog`** runs where the change lands. A stub that becomes a framework task is
  triaged in `sekai-kb` against its SPEC/ROADMAP; a stub about LB's content, config, or
  adoption is triaged here. The Linear stub itself is repo-neutral — triage is what picks
  a side, and the resulting packet's `Execution repo:` field records the choice.
- **`/dev:status` and `/dev:retro`** read the tracker, which spans both repositories, so
  either working directory answers correctly. Run `/dev:retro` in the repo whose rules it
  may promote into: a lesson about framework code belongs in `sekai-kb`'s
  `.agent-toolkit/rules/`, one about this instance's process belongs here. A retro that
  produces both writes each rule on its own side.
- Every packet states `Execution repo:` — that field is what makes the rule mechanical.
  Record the full PR URL on the Linear task either way, since the tracker spans both
  repos and PR numbering does not.

The `sekai-kb` copy of this rule landed in
[sekai-kb#43](https://github.com/wilsonkichoi/sekai-kb/pull/43) (LB-67, released as
`sekai-kb-v1.0.15`, adopted by this branch through `sekai-kb-v1.0.16`), and states the same routing for
`/dev:execute`, `/dev:review-pr`, `/dev:verify`, `/dev:plan`, `/dev:backlog`,
`/dev:status`, and `/dev:retro` from the framework side. The two copies must not
disagree again. Where they do, this repository's copy governs LB commits and
`sekai-kb`'s governs framework commits — and the disagreement is a defect to report, not
a choice to make.

Superseded 2026-07-29 (LB-62): the previous text said "**all** process/planning docs
(this file, `.agent-toolkit/rules/`, and `docs/`) stay in `lagunabeach-md`" and routed
`/dev:plan`, `/dev:backlog`, and `/dev:retro` here unconditionally. That was true while
planning was single-repo. ADR 008 moved the framework's PRD, SPEC, ROADMAP, and ADRs
003-008 to `sekai-kb`, so planning a framework phase from this repository would now read
documents this repository no longer owns.

Superseded 2026-07-27 (LB-60): the text before that had `dev:execute` claim from
`lagunabeach-md` and reach across with `-R wilsonkichoi/sekai-kb` on every `gh` call. It
was written on 2026-07-19, hours before LB-41 gave `sekai-kb` its own dev config, and the
two files then prescribed different behavior for the same operation.

After **5.4** (LB-33, done), `lagunabeach-md` is **instance #1** of the framework (still the
live `lagunabeach.md` site), re-based onto `sekai-kb-v1.0.0` with the merge base established
(`git merge --allow-unrelated-histories`) and `merge=ours` on the instance-owned file list.
Feature phases 6-11 execute in `sekai-kb` and ship as tagged releases; `lagunabeach-md`'s
only commits are instance-owned — adopting each release via `/sekai-upgrade` (part of every phase's
exit gate; mechanics + the required `git config merge.ours.driver true` per-clone step in
`docs/runbook/UPGRADE.md`), `features.*` flags in `place.config.ts`, analytics IDs, ROUTINE
entries, and its own content/media. `FRAMEWORK-VERSION` records the adopted tag.

## Adopter dev-plugin upgrade state

The framework SPEC's `Repo topology` and ADR 006 (both in `sekai-kb`) define
`.agent-toolkit/` presence as persistent instance state. Before a framework tag merge, `/sekai-upgrade` classifies the instance as
stripped (tree and active AGENTS.md reference both absent) or installed (config and
reference both present). Stripped stays stripped across shared and unrelated histories;
installed keeps its adopter-owned config and rules. A mixed state is invalid and stops.
LB-44 implements and regression-tests this Phase 5 upgrade contract.

## Instance history and version ownership

`CHANGELOG.md` records LagunaBeach.md work only and carries `merge=ours`. It is not a
local copy of the framework release log. `/sekai-upgrade` reads framework notes directly from
the target tag with `git show <tag>:CHANGELOG.md`, while the merge keeps LB's changelog
unchanged. `FRAMEWORK-VERSION` remains the separate marker for the adopted Sekai tag.
It carries `merge=ours` too, but that attribute alone does **not** hold it: a merge driver
runs only on a three-way content merge, so on an instance that has not edited the file
since the merge base git takes the incoming value and the marker claims a release nothing
has verified. What holds it is `/sekai-upgrade`'s package-state capture before the merge
and restore after it (`scripts/upgrade/package-state.mjs`, from `sekai-kb-v1.0.15`), which
puts the pre-merge value back; the explicit bump then happens only after verification
succeeds. That capture only runs because the upgrade bootstraps every helper from the
**target tag**, never from the instance's tree copy (`sekai-kb-v1.0.16`) — the tree copy
shipped with the release being left, so the tree-first form ran a pre-capture helper on
exactly the upgrade that introduced the capture. All three halves are fixture-tested by
`npm run upgrade:check` (cases 12 and 13).

`VERSION` is the LagunaBeach.md release SSOT and also carries `merge=ours`; framework
upgrades never change it. `FRAMEWORK-VERSION` is not LB's release and must be described
as the adopted Sekai version. `package.json` is a private Node manifest shared with the
framework for scripts and dependencies; it carries neither release value.

## Milestones and model policy

- Milestones = Linear project milestones on project "LB Rebuild", one per phase
  ("Phase 0" … "Phase 11"), spanning both repositories. A phase's task blocks live in
  exactly one `docs/ROADMAP.md` — this repo's for phases 0-5 and LB's own instance work,
  `sekai-kb`'s for the framework phases 6-11 — and packets convert from those blocks
  exactly, on the owning side.
  Phase transitions are Wilson gates: `/dev:plan` for phase n+1
  runs only after Wilson confirms phase n closed **and** the phase-n retro confirms every
  Backlog discovery stub from the phase is triaged — each stub either became a
  ROADMAP/SPEC edit (via `dev:backlog` triage), was pulled into the phase-n+1 plan, or was
  closed Wont Do with rationale. Untriaged stubs block the next plan.
- Wilson gates from the ROADMAP (1.1c design sign-off, 3.2 domain cutover, 5.2c dana-point proof)
  are manual DoD criteria on those tasks — `/dev:verify` must stop for Wilson on them.
- Packet `Model:` notes (version-less, e.g. `Model: Opus`) are advisory; Wilson picks each
  session's model. Reviews default to Sonnet; a `Review-Model: Opus` note on a task
  (1.1c, 1.2b, each phase-closing task) overrides.

## Tracker mechanics specific to this workspace

- **`Blocked` is the `blocked` label, not a workflow state.** The LB team's Linear
  workflow has exactly `Backlog`, `Todo`, `In Progress`, `In Review`, `Done`,
  `Canceled`, `Duplicate` — there is no `Blocked` state. Per the dev plugin's Linear
  backend mapping, a blocked task therefore **keeps its workflow state** and carries the
  team label `blocked` plus a diagnostic comment; the `blocked by` issue relation records
  what it waits on. The label was created during LB-74 (2026-08-02), which is the first
  time a task needed it. Do not add a `Blocked` workflow state to work around this: the
  mapping is what the plugin's skills read.
- **Never overwrite a Linear description you have not just re-read.** `save_issue` with a
  `description` replaces the whole body. Use its `patch` operations instead — they anchor
  on exact current text and fail loudly when the body moved under you. In LB-74 a full-body
  write to LB-77 destroyed a triaged packet (Objective, DoD, spec excerpts, suggested
  steps) that had been written in the four hours since that stub was filed.

## Planning conventions

- **Verify extraction sources before citing them.** When a packet names a fork file as the
  extraction source for specific fields, confirm that file actually contains those fields
  before writing the packet. In LB-1 the packet cited `src/utils/category-static-paths.ts`
  `CATEGORY_MAP` for category icons/descriptions, but that const is slug→title only — the real
  source is `src/utils/categoryConfig.ts`, forcing a mid-task source hunt.
- **Mirror the fork's exact dep versions, not caret ranges** — see
  `.agent-toolkit/rules/extraction-version-pinning.md`. A packet's `^`/`~` ranges are advisory; the
  fork's installed version is the contract.
- **Read ahead, plan JIT.** When decomposing phase n, `/dev:plan` must read the ROADMAP
  sections for phases n+1 and n+2 and include a **Forward constraints** section in the dry
  run: every phase-n decision a later phase depends on, one line each, citing the future ROADMAP
  unit it serves. A dry run without this section is incomplete — Wilson rejects it.
- **`Downstream:` field in every packet.** Each minted packet names the future ROADMAP tasks that
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
  `sekai-kb` repo (`github.com/wilsonkichoi/sekai-kb`, `${SRC_HOME}/sekai-kb`) per the
  framework roadmap's "Execution repo flow"; the Linear tracker spans both repositories,
  each repository carries the planning documents for its own work (LB-62), and
  instance-owned tasks still commit in lagunabeach-md. Run the execution
  skills **in** the repo the packet names (see "Execution repo (Phase 5+)" above) so
  `gh` resolves against it natively. If a session must reach the other repo anyway,
  resolve the PR from the URL in the task's work-summary comment and pass the repo
  explicitly on every gh call (`gh -R wilsonkichoi/sekai-kb …`); a bare `gh pr <n>`
  is always wrong across repos, because each has its own PR numbering.
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

CI gates complete classification with the dev plugin's own checker
(`resolve_project_rules.py --check`), run through the upstream composite action
declared by `dev_plugin_repository` and `dev_plugin_release` in this file's
frontmatter. This repository vendors no second copy of that checker. The
`npm run dev-plugin:check` gate fails if a `check-rules` workflow reference drifts
from that declaration. The action step lives in the `test` job of
`.github/workflows/deploy.yml`, which runs on every pull request and push to
`main`; `build` needs `test` and `deploy` needs `build`, so a red check blocks
deployment through the job graph. As checked 2026-07-25, `main` has no branch
protection, so `test` is not a GitHub required status check. Doctrine rules are not
indexed here: the resolver inlines every one of them into each dev session, so a
summary line would restate content already in context. The gotcha table below is a
human index of what is promoted, because gotchas load only on a trigger match; the
resolver's source of truth is each file's own frontmatter, not this list.

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
