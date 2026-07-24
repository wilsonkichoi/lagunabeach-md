---
tier: gotcha
triggers:
  paths:
    - ".agent-toolkit/**"
    - "AGENTS.md"
    - "CLAUDE.md"
  objective:
    - "dev plugin"
    - "rule"
  definition_of_done:
    - "rules load"
    - "rule loading"
---

# Verify rule loading with the resolver, not by reading the import chain

Agent-instruction wiring has two independent loaders: the harness's native `@`
expansion, and the dev plugin's `resolve_project_rules.py`. They are not the same
mechanism and they disagree. Only the resolver's `Rules loaded:` output is evidence.

- After any change to `.agent-toolkit/dev.md`, `rules_dir`, `AGENTS.md`, or
  `CLAUDE.md`, run the resolver and read the actual `Rules loaded:` /
  `Rules skipped:` lists. "A Claude session sees the rules inlined" is not
  verification; Codex has no `@` expansion at all.
- After a dev-plugin version bump, re-run it before starting the next task and
  compare against the previous list. A plugin upgrade can invalidate project-side
  wiring with no commit on the project side.

**Why (LB-42 → LB-49):** LB-42 shipped a tiered `## Rules` index against dev 0.0.55,
which had no resolver and no bootstrap contract, and verified it with an import-chain
spot check that was valid at that version. The resolver arrived in 0.0.58 and
fail-closed discovery in 0.0.63/0.0.64; from then the `- @path — description` bullet
form matched nothing and lagunabeach-md resolved `Rules loaded: none` on both
harnesses for five days and roughly six tasks, until LB-49 probed it on 2026-07-24.
No commit caused the regression, so no review could have caught it.
