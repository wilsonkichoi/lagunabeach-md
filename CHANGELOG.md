# LagunaBeach.md changelog

Notable changes to the LagunaBeach.md instance are recorded here. This file contains
LB work only. Framework release notes remain in the
[`sekai-kb` changelog](https://github.com/wilsonkichoi/sekai-kb/blob/main/CHANGELOG.md)
and are read from the target release tag during `/sekai-upgrade`.

This file is instance-owned (`CHANGELOG.md merge=ours` in `.gitattributes`). Framework
tag merges must never replace it. `FRAMEWORK-VERSION` separately records the adopted
framework release.

## Unreleased

### Changed

- **Framework skills moved into the shared agent namespace.** LB now inherits
  them under `.agents/skills/`, with `sekai-` prefixed folder names, YAML names,
  invocation names, and cross-skill references. Codex discovers the standard
  path natively, `AGENTS.md` tells Claude Code how to discover it, and both
  genericity gates scan it.

- **Release identity is separated from framework adoption.** `VERSION` is now the
  LB release SSOT at `v0.0.1`; `FRAMEWORK-VERSION` remains the adopted Sekai
  release. `package.json.version` and the lockfile root versions mirror `VERSION`
  as `0.0.1`. Explicit `/sekai-release` requests can bump patch, minor, or major;
  routine article PRs never change the release. The bump command preserves every
  non-version byte in both npm manifests. Upgrade package reconciliation keeps that
  adopter identity while accepting incoming framework scripts and dependencies.

- **Project documentation was consolidated before Phase 6.**
  - Deleted `.fable/README.md` and `.fable/STRATEGIC-DIRECTION.md`.
  - `docs/PRD.md` now owns product intent and non-goals.
  - `docs/SPEC.md` now owns architecture, extraction rules, inherited-fork
    disposition, negative requirements, and risk controls.
  - `docs/ROADMAP.md` now owns phase ordering and detailed active task blocks for
    Phases 6-11.
  - Completed Phases 0-5 remain summarized in ROADMAP. Their final packets and
    evidence remain in Linear; obsolete `.handoff` instructions remain only in
    git history.
  - Updated `AGENTS.md`, dev config, `place.config.ts`, all six ADRs, runbook
    references, source comments, CI diagnostics, and promoted rules.
  - No `.fable`, `STRATEGIC-DIRECTION`, or legacy §A-§G references remain in the
    repository.
- **The LB changelog was separated from the framework release log.** Historical
  framework release entries were removed, notable LB work was reconstructed from
  LB's first-parent history, and `CHANGELOG.md` became instance-owned so `/upgrade`
  cannot overwrite it.

## Phase 5: Sekai KB instance adoption and workflow hardening, 2026-07-11 to 2026-07-25

### Added

- Added the Phase 5 framework plan, content-lifecycle skill amendment, and later
  Phases 9-11 for MCP delivery, analytics, and autonomous routines.
- Added ADR 006 for adopter-owned `AGENTS.md`, encapsulated dev-plugin state, and
  persistent stripped/installed state across upgrades.
- Added dual-harness validation evidence for Codex and Claude Code.

### Changed

- Rebased LagunaBeach.md onto `sekai-kb` as instance #1 and established permanent
  tagged-release ancestry.
- Adopted framework releases through `v1.0.6`; `FRAMEWORK-VERSION` records the
  currently adopted tag.
- Consolidated agent instructions into instance-owned `AGENTS.md`; reduced
  `CLAUDE.md` to the byte-exact `@AGENTS.md` shim.
- Moved LB's dev-plugin config and promoted rules into the instance-owned
  `.agent-toolkit/` tree and upgraded rule loading to the discovery bootstrap.
- Added persistent upgrade handling for instances that strip dev-plugin state and
  instances that install and own it.
- Moved category colors into LB's `place.config.ts` entries.
- Declared and CI-guarded the required agent-toolkit release.

## Phase 4: Quality tooling, 2026-07-11

### Added

- Ported and genericized the Python/uv article-health tool with fork-baseline parity.
- Added frontmatter validation, Husky pre-commit checks, credential scanning, and CI
  test gates.
- Added the dashboard-lite data pipeline and dashboard page.
- Added visual-regression commands and baselines for all eleven page surfaces.

### Changed

- Made the English-only and genericity doctrine whole-project and machine-enforced,
  including test fixtures and future code trees.
- Removed dead CJK, fork-brand, spore, and migration-era code from extracted tooling.

## Phase 3: Content migration and cutover, 2026-07-10

### Added

- Migrated the Laguna Beach knowledge corpus, About content, and INBOX into the
  Markdown SSOT.
- Recorded the article-health baseline and verified all content through category,
  search, graph, map, and raw-Markdown surfaces.

### Changed

- Cut `lagunabeach.md` over to the rebuilt site and retired the v1 deployment.
- Fixed the LagunaBeach wordmark, compact page spacing, raw-Markdown links, and
  default reader settings across all pages.

## Phase 2: Visual exploration, 2026-07-10

### Added

- Added the Leaflet map with article-marker GeoJSON and the municipal boundary
  overlay.
- Added the D3 knowledge graph with categories as hubs.
- Added map and graph navigation to the site header.

## Phase 1: Core site and knowledge delivery, 2026-07-07 to 2026-07-10

### Added

- Built the shared layout, navigation, footer, SEO, fonts, reader controls, and
  responsive shell from the extracted design system.
- Built the home page, article page, category hubs, explore/search, latest, 404,
  RSS/feed, About, Contribute, and Changelog surfaces.
- Added the Markdown sync pipeline, Astro content schema, wiki-link resolution,
  related-article data, search index, build metadata, and post-build checks.
- Added `/llms.txt`, `/kb/topics.json`, raw article Markdown, and the remaining
  static knowledge endpoints for AI consumers.
- Added side-by-side visual-parity tooling and completed the Phase 1 design sign-off.

### Fixed

- Removed the unused CJK bigram tokenizer and other dead fork-era code.
- Migrated Astro Markdown processing to the supported processor API.
- Added missing favicon and Apple touch icon assets.

## Phase 0: Rebuild foundation, 2026-07-07

### Added

- Created the fresh Astro 6 repository with strict TypeScript, pinned dependencies,
  Tailwind 4, `place.config.ts`, and the extracted design CSS.
- Added GitHub Pages deployment, pull-request CI, the genericity denylist gate, and
  the initial agent-toolkit/Linear workflow.
- Added the original PRD, SPEC, ROADMAP, ADRs 001-004, README, and dual-license
  structure.

### Security

- Updated Astro from 6.2.1 to 6.4.8 to address three XSS/SSRF advisories.
