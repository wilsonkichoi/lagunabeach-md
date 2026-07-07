---
tracker: linear
linear_team: LB
linear_project: "LB Rebuild"
test_command: "npm run build"  # real tests arrive with task 4.1; update this field then
ci_workflow: ""                # deploy.yml does not exist until task 0.3; that task's DoD sets this to deploy.yml
merge_policy: squash
review_action_installed: false # auto PR-review GitHub Action (claude-review.yml) is set up
work_in_progress_limit: 2      # max tasks simultaneously In Progress + In Review
max_fix_attempts: 3            # CI-fix or review-fix cycles before a task goes Blocked
max_tasks_per_run: 5           # batch cap for /dev:auto and /loop /dev:execute
auto_merge: false              # standing merge approval for /dev:auto (see that skill)
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
| `/Users/wchoi/src/lagunabeach-md-v1` (the renamed fork checkout; also sibling `../lagunabeach-md-v1`) | extraction source | §C prefers the fork's copy; reviews verify extraction claims against this tree, **byte-diff where §C says verbatim** |
| `/Users/wchoi/src/taiwan-md` | design reference | consult for design rationale; never a content source |
| `/Users/wchoi/src/lagunabeach-md-v0/_research/taiwan-md-research.md` + `taiwan-md-llm-wiki.md` | v0 deep research | §B/§D section pointers are mandatory pre-reads for the executor of the citing task (2.1 boundary sourcing, Phase 5 adopter needs, 7.1/7.2 worker designs) |
| v1 archive `MIGRATION.md` | lessons only | not process; the migration apparatus is dead per §F |

A session loads only the references its task cites — nothing else.

## Milestones and model policy

- Milestones = Linear project milestones on project "LB Rebuild", one per §E phase
  ("Phase 0" … "Phase 8"). Phase transitions are Wilson gates: `/dev:plan` for phase n+1
  runs only after Wilson confirms phase n closed.
- Wilson gates from §E (1.1c design sign-off, 3.2 domain cutover, 5.2c dana-point proof)
  are manual DoD criteria on those tasks — `/dev:verify` must stop for Wilson on them.
- Packet `Model:` notes (version-less, e.g. `Model: Opus`) are advisory; Wilson picks each
  session's model. Reviews default to Sonnet; a `Review-Model: Opus` note on a task
  (1.1c, 1.2b, each phase-closing task) overrides.
