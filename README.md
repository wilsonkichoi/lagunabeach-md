# LagunaBeach.md

A knowledge base for Laguna Beach, CA, with plain Markdown content rendered as a
fast, AI-native static site. It is built with [Astro](https://astro.build/) as
instance #1 of the [`sekai-kb`](https://github.com/wilsonkichoi/sekai-kb)
framework.

Content lives under `knowledge/` and is the single source of truth. The build
projects it into gitignored `src/content/` and `src/data/` trees before Astro
generates the site.

## Prerequisites

- Node.js 22.13 or newer, with npm.
- [uv](https://docs.astral.sh/uv/) for Python editorial tooling.
- [GitHub CLI](https://cli.github.com/) for GitHub Pages setup and CI operations.

Install and deployment commands are documented in
[`docs/runbook/DEPLOY.md`](./docs/runbook/DEPLOY.md). Framework upgrades use
[`docs/runbook/UPGRADE.md`](./docs/runbook/UPGRADE.md), and explicit Laguna Beach
releases use [`docs/runbook/RELEASE.md`](./docs/runbook/RELEASE.md).

## Writing articles

The editorial canon is under [`docs/playbook/`](./docs/playbook/):

- [`ARTICLE-PLAYBOOK.md`](./docs/playbook/ARTICLE-PLAYBOOK.md) defines voice,
  structure, sourcing, and the quality bar.
- [`REWRITE-PIPELINE.md`](./docs/playbook/REWRITE-PIPELINE.md) defines the required
  writing and rewriting stages.
- [`FACTCHECK-PIPELINE.md`](./docs/playbook/FACTCHECK-PIPELINE.md) defines claim
  verification.

Edit only `knowledge/{Category}/*.md`. Validate content with the applicable
`article-health` profile, then run `npm run test` and `npm run build` before
committing.

## Repository structure

- `place.config.ts` contains Laguna Beach identity, categories, map settings,
  features, links, and home-page copy.
- `knowledge/` contains the Markdown content SSOT.
- `public/media/` contains instance-owned images and media.
- `docs/playbook/` and `docs/runbook/` contain editorial and operational guidance.
- `src/`, `scripts/`, and `.agents/skills/` are framework-owned and arrive through
  tagged sekai-kb upgrades.
- `dev_docs/` holds this instance's PRD, SPEC, ROADMAP, ADRs, baselines, draw.io
  architecture sources, and the archived research the rebuild was grounded in.

## Genericity

Place identity must enter code only through `place.config.ts`, `knowledge/`, and
`public/media/`. `npm run genericity` enforces the boundary with a place-name
denylist and an English-only codepoint gate. Each gate states its own roots; both
scan `src/`, `scripts/`, `tests/`, `workers/`, and `.agents/skills/` today, and
either can gain a root without the other.

## Language support

UI strings and editorial tooling are English-calibrated. Latin-script content
largely works, but article-health thresholds can require per-instance tuning. CJK
content is unsupported until the planned multi-language revisit.

## License

Dual-licensed (see [`LICENSE`](./LICENSE)):

- **Content** (`knowledge/`, `public/media/`) — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/):
  free to share and adapt with attribution, share-alike.
- **Code** (everything else) — MIT.
