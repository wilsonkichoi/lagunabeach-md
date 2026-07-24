# ADR 006: Adopter-owned AGENTS.md and dev-plugin encapsulation

**Status:** Accepted (2026-07-19, Wilson-approved plan
`~/.claude/plans/before-we-start-phase-steady-spring.md`)
**Deciders:** Wilson Choi
**Executes:** LB-41 (sekai-kb side, release v1.0.2) + LB-42 (lagunabeach-md side)

## Context

The agent-toolkit dev plugin 0.0.55 encapsulates all plugin state under
`.agent-toolkit/` (the `dev.md` config plus promoted `rules/`), discovered through a
single reference line in a `context_file`. Three problems in the pre-0.0.55 layout
forced a set of ownership rulings:

1. **Codex had no path to the dev config or rules.** LB's config lived at
   `.claude/dev.md` with no `context_file`/`rules_dir` keys; Codex reads `AGENTS.md`,
   which pointed nowhere at the dev workflow. A Codex session in LB booted blind to
   the tracker contract and the 20 promoted rules.
2. **The 5.1 rules split shipped dev-process rules to adopters.** Rules are lessons
   from developing the framework's `src/`/`scripts/`; adopters never touch those
   trees (iron rule), so shipping them to a fresh instance is noise.
3. **The 5.4 (LB-33) `merge=ours` list omitted `AGENTS.md`.** That left the AGENTS.md
   starter framework-owned, so it would clobber an instance's customized AGENTS.md
   the moment a Codex adopter personalized it.

## Decision

(a) **`AGENTS.md` is adopter/instance-owned from clone time.** It carries
`merge=ours` in `.gitattributes`; framework tag-merges never overwrite it. The
instance edits it freely to describe its place and how its agents work.

(b) **Rules are dev-plugin state, not framework content — the template ships none.**
The `.agent-toolkit/rules/` tree holds promoted engineering + process lessons for
developing *this* repo. The sekai-kb template exposes zero rules to adopters; each
adopted instance grows its own set via `dev:retro`.

(c) **The init wizard strips dev-plugin state at adoption.** `scripts/init/writer.mjs`
removes the `.agent-toolkit/` tree and the dev-plugin reference line from
`AGENTS.md`/`CLAUDE.md`; `scripts/init/check-init.sh` asserts their absence. A fresh
instance ships no dev-plugin state at all.

(d) **`/upgrade` must reconcile instance-owned starter files conversationally.**
`merge=ours` is deliberately blunt: it keeps the instance's version of every
instance-owned file and silently discards the framework's improvements to that same
file. For *starter* files the wizard seeded (at minimum `AGENTS.md`), a release that
improves the boilerplate would vanish with no signal. `/upgrade` therefore diffs each
instance-owned starter against the incoming tag and walks the difference with the
user, adopting only the improvements that do not clobber the user's own edits
(`docs/runbook/UPGRADE.md` §6 + the `upgrade` skill).

(e) **The dev-plugin config relocates to `.agent-toolkit/`.** `.claude/dev.md` →
`.agent-toolkit/dev.md` with `context_file: AGENTS.md` and
`rules_dir: .agent-toolkit/rules/`; the 20 rules move `.claude/rules/` →
`.agent-toolkit/rules/`. The config's `## Rules` index is tiered: doctrine rules are
`@`-imported (inlined every session via the `CLAUDE.md` → `@AGENTS.md` →
`@.agent-toolkit/dev.md` → rule chain); narrow build-gotcha rules are indexed by path
plus a trigger hook and opened only when their trigger fires.

## Supersession of the STRATEGIC-DIRECTION instance-owned baseline

`.fable/STRATEGIC-DIRECTION.md` §B/§E named a 5-file instance-owned baseline
(`place.config.ts`, `knowledge/**`, `public/media/**`, `CNAME`, `CLAUDE.md`). Ruling
(a) adds `AGENTS.md` and ruling (e) adds `.agent-toolkit/**` to that set. Per the
binding spec's own conflict rule (STRATEGIC-DIRECTION is the frozen source of record;
conflicts surface to Wilson, never silently resolved), this divergence was surfaced
to and approved by Wilson at the 2026-07-19 plan approval. STRATEGIC-DIRECTION stays
frozen; this ADR is the operative record of the superseding decision.

## Consequences

- Codex and Claude Code sessions in an instance reach the same dev config + doctrine
  rules through `AGENTS.md` (native for Codex, via the `@AGENTS.md` shim for Claude
  Code).
- Adopters get a clean instance with zero dev-plugin state; the framework's own
  `.agent-toolkit/` never lands in an adopted clone.
- Every framework release's starter improvements to `AGENTS.md` are surfaced at
  upgrade time instead of being silently dropped by `merge=ours`.
- The `merge=ours` list is now: `place.config.ts`, `knowledge/**`, `public/media/**`,
  `CNAME`, `CLAUDE.md`, `AGENTS.md`, `README.md`, `docs/baselines/**`,
  `scripts/ci/genericity-denylist.local.txt`, `.agent-toolkit/**`.

## Addendum (2026-07-19): AGENTS.md is the single source of truth for agent instructions

**Status:** Accepted (2026-07-19, Wilson-approved). **Executes:** sekai-kb release
v1.0.3 (framework side) + the matching lagunabeach-md instance restructure.

The original decision left `AGENTS.md` and `CLAUDE.md` as two content-bearing files:
`CLAUDE.md` was "the boot document" and `AGENTS.md` pointed back to it ("Read
CLAUDE.md — it is the boot document"). Two documents holding agent instructions means
content can drift between them, and Codex (which reads `AGENTS.md` natively) reached
the substance only by a redirect. This addendum collapses them:

- **`AGENTS.md` holds ALL agent instructions** — place identity, where things live,
  how work happens, the iron rules, the language boundary, the semiont probe, the
  content working set, and (for a repo that keeps it) the dev-plugin sentinel block.
- **`CLAUDE.md` is a pure one-line `@AGENTS.md` shim** with no content of its own.
  Claude Code inlines it recursively (`CLAUDE.md` → `AGENTS.md` →
  `@.agent-toolkit/dev.md` → doctrine rules, within the import-depth limit); Codex
  reads `AGENTS.md` directly.
- **This supersedes the "CLAUDE.md is the boot document" framing** in ruling-era text
  and in the `AGENTS.md` "Read CLAUDE.md" pointer (now removed). No content is lost in
  the move and none is duplicated across the two files.

Mechanism update to ruling (c): the init wizard no longer strips a dev-plugin
*reference line* from a seeded `AGENTS.md`; it **renders `AGENTS.md`
place-specifically** (carrying no dev-plugin sentinel block) and writes `CLAUDE.md` as
the `@AGENTS.md` shim (`scripts/init/writer.mjs`; `scripts/init/check-init.sh` asserts
the new shape). Ruling (d) still holds, with `CLAUDE.md` exempt from starter
reconciliation as a fixed shim. Because `AGENTS.md`, `CLAUDE.md`, and
`.agent-toolkit/**` are `merge=ours`, an existing instance mirrors this consolidation
as a manual instance-side edit after merging the framework tag (see the
`sekai-kb-v1.0.3` CHANGELOG upgrade note).

## Addendum (2026-07-19): stripped dev-plugin state persists across upgrades

**Status:** Accepted (2026-07-19, Wilson-approved). **Executes:** LB-44.

Ruling (c) establishes that wizard adoption removes `.agent-toolkit/`, while ruling
(e) makes that path instance-owned when it exists. The original consequences incorrectly
assumed `merge=ours` also protects a deleted path. Git does not apply a content merge
driver when one side deleted the path: a shared-history framework modification produces a
modify/delete conflict, and an unrelated-history first tag merge adds the framework tree
back as theirs-only content.

`/upgrade` therefore treats dev-plugin presence or absence as persistent instance state:

- **Stripped:** `.agent-toolkit/` is absent and `AGENTS.md` has no active
  `@.agent-toolkit/dev.md` reference. The upgrade preserves both absences, automatically
  resolving framework-side additions or modify/delete conflicts under
  `.agent-toolkit/**` before finalizing the merge.
- **Installed:** `.agent-toolkit/dev.md` exists and `AGENTS.md` carries the active
  reference. The existing `merge=ours` ownership rule preserves the adopter's config and
  rules.
- **Inconsistent:** only one half of the installed state exists. The upgrade stops with a
  diagnostic instead of guessing whether to delete or install dev-plugin state.

This rule applies to routine shared-history upgrades and the first
`--allow-unrelated-histories` tag merge. Framework dev-plugin state is never an implicit
upgrade payload for a stripped adopter; running `dev:setup` is the deliberate opt-in.

## Addendum (2026-07-24): dual-harness validation record

**Status:** Validated (2026-07-24). **Executes:** LB-43. This addendum adds no decision;
it records the evidence that the rulings above hold on both supported agent CLIs, so a
later reader can tell what was actually exercised rather than assumed.

**Tested plugin versions.** Claude Code ran dev **0.0.65**; Codex ran dev **0.0.66**.
`scripts/resolve_project_rules.py` is byte-identical between the two, and both produced
identical output against the same revision, so the cross-harness evidence below is
cross-version consistent rather than confounded.

### Codex resolves the adopted topology natively

A fresh Codex session (codex-cli 0.145.0, cwd `lagunabeach-md`, `FRAMEWORK-VERSION`
`v1.0.4`) confirmed the ruling chain end to end: `CLAUDE.md` is byte-for-byte
`@AGENTS.md\n` (11 bytes, `xxd` → `4041 4745 4e54 532e 6d64 0a`); `AGENTS.md` is the file
read natively at session start; the active reference at `AGENTS.md:111` resolves to
`.agent-toolkit/dev.md`; and its `context_file`, `rules_dir`, `tracker`,
`work_in_progress_limit`, and `test_command` were quoted back verbatim. This is the
2026-07-19 SSOT addendum working for the harness it was written for.

### Rule loading, both repositories, both harnesses

Rules are discovered by walking `rules_dir` and reading each file's `tier` frontmatter
(LB-48/LB-49), not by `@` import. Resolver runs with empty objective, empty
definition-of-done, and no changed paths:

| Repository | Revision | Doctrine loaded | Gotchas skipped | Warnings |
|---|---|---|---|---|
| `lagunabeach-md` | `69ccb74` | 6 | 16 | none |
| `sekai-kb` | `05ae5bc` | 3 | 12 | none |

Zero resolution errors and zero discovery hard stops in both; every rule file is
accounted for under exactly one of loaded / skipped / excluded. `Rules loaded: none`,
the pre-LB-49 state, no longer occurs in either repository.

Trigger discrimination was evidenced in both directions on both harnesses: under Codex,
`shell-script-portability.md` moved from `Rules skipped:` to `Rules loaded:` when the
task carried `--changed-path scripts/ci/check-genericity.sh` plus matching objective and
definition-of-done text, with all three trigger types reported; under Claude Code, the
same discrimination held for `visual-parity-comparison-target.md` and for the two rules
promoted by this task's retro. Both harnesses opened a triggered rule and read its body,
not merely its path.

### Cross-repository lifecycle proof (LB-50, under Codex)

LB-50 is the named proof: its tracker record lives in `lagunabeach-md` while its code
lands in `sekai-kb`, so it exercises the Phase 5+ routing that ADR 006's encapsulation
makes possible. Codex drove it through the normal gates —
[PR #17](https://github.com/wilsonkichoi/sekai-kb/pull/17), reviewed SHA
`3698657af1bceddfd536bb72596628b915a51c36`, independent review verdict approve (0
blockers, 1 suggestion), verification 8/8 mechanical criteria, required CI green
(Genericity, Test, Init wizard self-check, Build), squash merge
`05ae5bc0a6a00e0f05cc428286f9ccb529cfecee`, worktree and branches cleaned, Linear moved
to Done. The review's one suggestion was filed as a Backlog stub (LB-51) rather than
folded into the merge.

That run also demonstrates the transition it implemented: the execute session began with
`sekai-kb` resolving zero doctrine rules and ended, after its own commits, resolving the
three it added.

**Supporting evidence, LB-44.** LB-44 was originally named as the lifecycle proof, but
its gates split across harnesses: Claude Code ran execute and the review-fix; Codex ran
both independent review rounds, verification, the merge, and the immutable
`sekai-kb-v1.0.5` tag. It is recorded here as cross-harness hand-off evidence — a task
whose gates were exchanged between CLIs mid-flight without loss — and LB-50 supplies the
single-harness end-to-end proof.

### Status parity and the memory loop

Back-to-back status runs against `lagunabeach-md` agreed on every state fact (Phase 5
19/20 done, WIP 1/2, no open pull requests in either repository, no consistency
findings). The one divergence was reporting granularity, not state: the Codex run
summarized rule resolution at the tracker repository only, which understates the
per-repository picture tabulated above.

The Claude Code memory loop closed on the same topology: a retro on LB-42 produced two
promotions, applied to `.agent-toolkit/rules/` with `tier` frontmatter, indexed, gated by
`check-rule-registry.mjs`, and committed as `69ccb74`.

### What this does not validate

- Codex's `test-writer` subagent is still unexercised; neither LB-50 nor LB-44 required
  authored tests, so only `reviewer` and `verifier` have been driven.
- LB-50 merged under the standing `auto_merge: true` policy via `dev:auto`, not an
  interactive per-merge human gate. LB-44's merge did pass an explicit authorization
  step, so both modes are represented, but neither task exercised a human-judgment DoD
  criterion.
- All evidence comes from a single workstation and a single Linear workspace. Nothing
  here validates a second contributor, a fork topology, or a non-GitHub CI.
