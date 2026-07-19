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
