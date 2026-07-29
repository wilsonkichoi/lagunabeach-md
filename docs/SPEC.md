# SPEC: LagunaBeach.md

**Approved 2026-07-07; consolidated 2026-07-26; scope split 2026-07-29 (LB-62).** This is
the engineering SSOT **for this instance**: how lagunabeach.md is deployed, what its
content looks like, where its code came from, and what happened to the fork it replaced.
Product intent lives in `docs/PRD.md`; delivery detail lives in `docs/ROADMAP.md`;
LB's accepted decisions live in `docs/adr/`. Conflicts go to Wilson (see
`.agent-toolkit/dev.md`).

> **The framework's engineering SSOT is a different document.** Stack, repo topology, the
> `place.config.ts` schema, the content model, the build pipeline, the page set, the
> phase 9-11 extension capabilities, framework risk controls, and the negative
> requirements (including the genericity and English-only gates) are framework contracts.
> They live in
> [`sekai-kb/docs/SPEC.md`](https://github.com/wilsonkichoi/sekai-kb/blob/main/docs/SPEC.md)
> with ADRs 003-008, beside the code they govern. LB cannot change any of them without a
> framework release, so restating them here would only create a second copy to drift
> (ADR 008, upstream). Everything below is something LB can change on its own.

Engineering diagrams (`docs/diagrams/architecture.drawio`, `data-flow.drawio`,
`repo-topology.drawio`) depict the framework architecture and are updated in the same PR
as any architecture change they depict.

## Deployment and domain

**lagunabeach.md** is served from GitHub Pages via Actions, with Cloudflare providing DNS
and CDN. The apex domain is pinned by `CNAME` (instance-owned, `merge=ours`); the domain
cutover from the retired fork happened in task 3.2. Cloudflare Workers, when a framework
phase ships one, deploy separately via `wrangler` from `workers/`, per
[`docs/runbook/DEPLOY.md`](./runbook/DEPLOY.md). No paid services: GitHub Pages plus the
Cloudflare and Workers free tiers only (`docs/PRD.md` non-goals).

Instance identity — place name, tagline, domain, map center, categories, feature flags,
links, and the home-page copy block — is data in `place.config.ts`, never code. That file
is instance-owned; the wizard is its only writer at adoption time, and LB edits it
directly thereafter.

## Content

`knowledge/` is this instance's Markdown SSOT and the only place LB content is edited;
`src/content/` is a derived, gitignored projection written by `scripts/core/sync.sh`.

- **Categories:** 8, declared in `place.config.ts` (`categories[]`, each with slug, title,
  icon, description, and optional `color`/`colorLight`). Changing LB's category set is a
  `place.config.ts` edit plus the matching `knowledge/` directories — no framework change.
- **Corpus:** the Phase 3 migration landed 16 articles plus About and an `INBOX.md`
  capture file. `knowledge/` has grown since; the live counts are whatever the build
  reports, and this document does not restate them.
- **Map data:** article frontmatter carries `geo: Name,lat,lng,Area`. A simplified
  municipal-boundary GeoJSON at `public/data/boundary.geojson` overlays the Leaflet map;
  the map and the SystemDiagram both degrade gracefully when it is absent.
- **Editorial bar:** [`docs/playbook/ARTICLE-PLAYBOOK.md`](./playbook/ARTICLE-PLAYBOOK.md)
  and [`REWRITE-PIPELINE.md`](./playbook/REWRITE-PIPELINE.md) govern writing;
  [`FACTCHECK-PIPELINE.md`](./playbook/FACTCHECK-PIPELINE.md) governs verification.
  `docs/baselines/article-health-fork.md` is LB's own health baseline, carried from the
  fork for parity comparison and instance-owned.
- **Language:** LB's content is English-only. Multi-language support is a post-project
  revisit (`docs/PRD.md` non-goals); the framework's schema seams (`place.locale`,
  `place.languages[]`) are declared but dormant, and LB does not build on them.

## Extraction map

The record of which fork file seeded which file in the rebuild. Extraction source rule:
**prefer the fork's copy** (`${SRC_HOME}/lagunabeach-md-v1`) where de-Taiwan work is done;
upstream (`${SRC_HOME}/taiwan-md`) is design reference only. Both source trees were
verified on 2026-07-04. Reviews verify extraction claims against the fork tree,
byte-diffing where this map says verbatim.

- **Design system, copy verbatim then remove CJK font fallbacks:**
  `src/styles/tokens.css`, `global.css`, `article-modules.css`, `dark-polish.css`,
  `dashboard.css`, and `shot-mode.css`. Keep every non-font token unchanged. Do not port
  `semiont.css` until a semiont page ships.
- **Components, extract and genericize:** `Header.astro`, `Footer.astro`, `SEO.astro`,
  `HeadInlineScripts.astro`, `ArticleCard.astro`, `ArticleHero.astro`,
  `ArticleSidebar.astro`, `TableOfContents.astro`, `CategoryGrid.astro`,
  `PageHero.astro`, `Banner.astro`, `BrandMark.astro`, `FeatureCards.astro`,
  `HeroStats.astro`, `ReaderSettings.astro`, `TopicCard.astro`, plus `home/` and
  `timeline/`. Strings and links come from `place.config.ts`, never literals.
- **Templates, extract as design bodies and rewrite data wiring:**
  `home.template.astro`, `article.template.astro`, `category-hub.template.astro`,
  `explore.template.astro`, `latest.template.astro`, `about.template.astro`,
  `contribute.template.astro`, `changelog.template.astro`, `dashboard.template.astro`.
  Extract `map.template.astro` for page chrome only. Use `soundscape.template.astro` as
  the Phase 6 design reference.
- **Pages:** port `src/pages/graph.astro` whole, including its inline wiki-link graph
  builder; source hub nodes from `place.config.ts`. Rewrite thin wrapper pages.
- **Core scripts:** `sync.sh`, `build-search-index.mjs` with plain word tokenization,
  `generate-map-markers.js` rewritten to GeoJSON, `build-related-tagoverlap.mjs`,
  `build-git-info.mjs`, `build-content-dates.mjs`, `build-latest.mjs`,
  `generate-api.js` renamed to `build-kb-index.mjs`, `post-build-check.mjs`, and
  `test-frontmatter.mjs`.
- **Editorial and quality tooling:** `article-health.py`,
  `article-health.config.toml`, `verify-internal-links.sh`, `refresh-llms-txt.py`,
  `scripts/visual/capture-baseline.mjs`, `scripts/visual/diff.mjs`, and the credential
  scan/frontmatter-validation pre-commit substance.
- **Docs:** use the fork's `docs/editorial/EDITORIAL.md` and
  `QUALITY-CHECKLIST.md` to seed the generic framework playbook.
- **Genericization rules:** category identity comes from `place.config.ts`; the legacy
  `CATEGORY_MAP` dies. The map key remains `geo: Name,lat,lng,Area`; there is no
  `coordinates:` key. The six CSS files, after the font edit, `sync.sh`,
  `test-frontmatter.mjs`, and visual-regression scripts otherwise remain byte-verifiable.

Dispositions for everything else are in `Inherited-fork disposition` below; there is no
"dormant" state.

> **article-health language policy (2026-07-11, LB-20):** the tool ported English-only.
> The original "parameterize the CJK-specific checks by language" direction is
> superseded (approved 2026-07-07, extended 2026-07-11): checks with a mixed
> language implementation keep their English core only; pure-CJK checks (`cjk_punct`,
> the fork's locale-specific pattern sets) are not carried. No language profile or
> `APPLIES_TO` gate exists.
> Scope fix (2026-07-11 (b)): the doctrine is whole-project — `tests/` fixtures are
> code and ship English-only with no fork place-brand strings; the tool's target set
> is exactly `knowledge/{Category}/*.md` (never spore/semiont/memory/report paths, which
> do not exist in this repo's content model — dead fork path-skips are removed).

## Inherited-fork disposition

The fork is the read-only `lagunabeach-md-v1` archive. "Delete" means not extracted and
no successor planned. Deferred capability has a named ROADMAP trigger; those triggers now
fire in the framework roadmap's phases, and LB adopts the result.

| Subsystem | Disposition | Contract |
|---|---|---|
| Design CSS | Extracted and genericized | Six files from the extraction map; non-font tokens remain unchanged. |
| Component library | Split | Named components in the extraction map survive. Taiwan-wired backends and Taiwan-specific concepts, including spore, supporter, diary, life-tree, perspectives, text-to-speech, reading-path, and old semiont components, are deleted. |
| Template bodies | Split | Named templates survive. `bench`, companies, elections, Taiwan-shape, opendata, assets/data, old MCP, and old semiont templates are deleted. Soundscape remains a Phase 6 design reference. |
| Locale wrappers and i18n toolchain | Delete | The translation cascade, babel jobs, language sync, coverage, CJK tokenizer, language profiles, and CJK fixtures do not ship. Multi-language support is rebuilt only after the framework's Phase 11. |
| `knowledge/` locale subtree | Void | It did not exist in the fork. No content was available to carry. |
| Harvest orchestrator and Supabase feedback | Delete | Feedback and social return as the Phase 6 Worker/D1 and snippet designs. Zero harvest code survives. |
| Upstream Taiwan-specific skills | Delete | Taiwan business logic remains readable in the upstream archive only. |
| Fork instance skills | Split and renamed | `/sekai-write`, `/sekai-validate`, `/sekai-factcheck`, and the router shipped in 5.6; sync/search became documented npm workflows; embeddings returns in 7.2a; semiont boot returns in 8.1; refresh/news-lens/peer/media-audit concepts return as Phase 11 routines; translate waits for the post-project language revisit; migration and old execution-loop skills are deleted. |
| `SemiontOrganismDiagram.astro` | Design reference only | `SystemDiagram.astro` is the config-driven successor. No i18n wiring, CJK fonts, or hardcoded boundary path carries. |
| Semiont organ docs | Delete shells, salvage prose selectively | Phase 8 builds the organ layer fresh. MANIFESTO and REFLEXES prose may be salvaged by hand. |
| Heartbeat and old cron system | Delete implementation | ROUTINE plus `/schedule` returns in Phase 11, one opt-in routine per named need. |
| Data-viz pages and bench | Delete | A future LB data page must be designed fresh against LB data. |
| Build-time OG | Delete | Static fallback shipped first; Phase 7.1 provides the on-demand worker. |
| Dashboard suite | Split | Dashboard-lite survives. GA4, Search Console, and Cloudflare fetchers return only in Phase 10. |
| Embeddings and RAG | Named trigger | Port/rebuild in Phase 7.2; tag overlap remains the pre-RAG related-article mechanism. |
| Feedback widget and scripts | Delete | Phase 6.1 rebuilds against Worker + D1. |
| Visual regression | Extract and genericize | It is the design-parity instrument and remains in the framework. |
| `fork-graph` | Delete | Rebuild only after at least three live instances exist. |
| Knowledge graph | Extract and genericize | `graph.astro` is governed by the extraction map and ROADMAP 2.2. |
| MCP page/endpoint | Rebuild on named trigger | Phase 9 delivers the remote MCP server and `/ai` surface after 7.2c. |
| Pre-commit, frontmatter, internal-link checks | Extract and genericize | These remain permanent quality gates. |
| Migration ledgers and `.handoff/` loop | Delete | Linear and the dev-plugin lifecycle own execution state. Historical material remains in the v1 archive and git history. |
| Deprecated, bench, supporter, contributor, and spore build jobs | Delete except named trigger | Contributor automation returns only when a second human contributor lands a merged PR. |

## Instance risk controls

The framework's risk controls (genericity erosion, two-repo drift, framework overreach,
framework deferral) are in the framework SPEC. Two are LB's own, because they concern the
fork LB replaced:

1. **Design-parity failure.** Design was copied as files, not re-prompted from
   description. Side-by-side screenshot acceptance and visual baselines are the standing
   instrument, and Wilson's Phase 1 sign-off was the gate. Fallback, still operative for
   any page that misses the visual bar: copy that page's fork implementation wholesale and
   re-genericize it — never re-prompt from description
   (`.agent-toolkit/rules/visual-parity-comparison-target.md`).
2. **Lost upstream improvements.** An accepted cost. The upstream project remains
   readable; useful ideas are reimplemented generically, never merged automatically
   (`docs/PRD.md` non-goals; ADR 001).

## Change log

This document's own history. Framework contract changes are recorded in the framework
CHANGELOG and read from the target tag at upgrade time.

- **2026-07-29 (LB-62), Wilson-approved ownership split:** the framework's sections —
  stack, repo topology, `place.config.ts`, content model, build pipeline, pages, new
  builds, phase 9-11 extension capabilities, framework risk controls, and negative
  requirements — moved to `sekai-kb/docs/SPEC.md` with ADRs 003-008, and are pointed at
  rather than restated. What remains is deployment and domain, LB's content, the
  extraction map, the inherited-fork disposition, and the two instance risk controls.
- **2026-07-26, Wilson-approved version ownership correction:** Sekai carries only
  `FRAMEWORK-VERSION`; adopters carry `VERSION` plus their adopted
  `FRAMEWORK-VERSION`. Each private npm manifest mirrors the repository's own release
  SSOT without the leading `v`. Adopter releases are explicit through `/sekai-release`; routine
  article PRs do not bump. `/sekai-upgrade` reconciles the manifests' mixed ownership. ADR 007
  records the init, release, upgrade, and CI contracts.
- **2026-07-26, Wilson-approved ownership correction:** `CHANGELOG.md` is instance-owned
  and records instance work only. The init wizard replaces the template's framework
  release log with an instance changelog. `/sekai-upgrade` reads framework release notes from
  the target tag and preserves the local changelog through `merge=ours`.
  `FRAMEWORK-VERSION` is also merge-protected; `/sekai-upgrade` bumps it explicitly after
  successful verification.
- **2026-07-19, Wilson-approved LB-44 delta:** added the dev-plugin state-persistence
  contract for framework upgrades. This corrects the false assumption that
  `.gitattributes merge=ours` preserves a deleted `.agent-toolkit/` path. ROADMAP order is
  unchanged; LB-44 closes the Phase 5 upgrade-determinism guarantee before LB-43 validates
  the dual-harness workflow.
