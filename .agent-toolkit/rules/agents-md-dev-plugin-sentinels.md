---
tier: gotcha
triggers:
  paths:
    - "AGENTS.md"
    - "scripts/init/**"
---

# The AGENTS.md dev-plugin block must stay inside its strip sentinels

`scripts/init/writer.mjs` strips the dev-plugin block from adopter clones by matching
the `<!-- dev-plugin:start … -->` / `<!-- dev-plugin:end -->` comment pair, and
`scripts/init/check-init.sh` asserts the strip removed the `@.agent-toolkit/dev.md`
reference. A dev-plugin section written as plain prose makes the strip a silent no-op
and fails the required Init wizard self-check job.

- Keep the whole dev-workflow block between the sentinels.
- Keep the `Dev workflow (agent-toolkit dev plugin): @.agent-toolkit/dev.md` reference
  line *outside* the HTML comments, so the import chain stays live while the block
  remains strippable.
- Run `bash scripts/init/check-init.sh` locally before pushing an AGENTS.md change.

**Why (LB-42):** the first AGENTS.md used a plain `## Dev workflow` section; the strip
was a no-op, the reference survived, and the Init wizard self-check failed
(run 29708513780) — one CI fix cycle. The sentinels are still load-bearing today at
`AGENTS.md:99` and `AGENTS.md:112`, with `check-init.sh --build` wired at
`.github/workflows/deploy.yml:126`.
