# SPEC: LagunaBeach.md / Sekai KB

**Approved 2026-07-07; consolidated 2026-07-26.** This is the engineering SSOT for
architecture, contracts, extraction and inherited-fork disposition, negative
requirements, and risk controls. Product intent lives in `docs/PRD.md`; delivery detail
lives in `docs/ROADMAP.md`; accepted decisions live in `docs/adr/`. Conflicts go to
Wilson (see `.agent-toolkit/dev.md`). Engineering diagrams (SSOT): `docs/diagrams/architecture.drawio`,
`data-flow.drawio`, `repo-topology.drawio` — updated in the same PR as any architecture
change they depict.

## Stack

- **Astro 6.x + Tailwind 4.x**, zero client-side frameworks; vanilla JS on interactive
  pages. Node ≥ 22.12.
- **MiniSearch** client-side search, index prebuilt; plain word tokenization (English-only
  site, no CJK code path).
- **D3 from CDN** for the knowledge graph only; **Chart.js from CDN** only if the dashboard
  needs it.
- **Leaflet + OSM tiles** for the map (deviation from upstream's D3/TopoJSON SVG map),
  CDN-loaded, page-scoped.
- **Python ≥ 3.12 via uv** for editorial tooling (added Phase 4): `article-health.py` and
  its pytest suite run through `uv run`; `pyproject.toml` + `uv.lock` ship with the
  framework, and `npm run prebuild:dashboard` shells into the tool (absent-safe: `|| true`).
  The 5.3 runbook documents uv setup for adopters.
- **Cloudflare Workers (free tier)** for all dynamic capability: feedback (Worker + D1),
  on-demand OG (Satori + resvg-wasm), RAG chat. RAG model space: **bge-m3, 1024-dim** for
  both corpus (offline: 4090 or Workers AI) and query (Workers AI `@cf/baai/bge-m3` —
  mandatory, the 4090 is unreachable at request time). At LB scale, retrieval is in-worker
  cosine over static JSON vectors; Vectorize is the documented path at ~4k+ vectors.
  Worker skeleton/chunking/CPU-limit details: v0 research §"RAG Chatbot" (mandatory
  pre-read for 7.2 executors, see `.agent-toolkit/dev.md` binding references).

## Repo topology

Phases 0-4: one repo (`lagunabeach-md`). After Phase 5: `sekai-kb` (framework SSOT, GitHub
template repo) + `lagunabeach-md` (instance #1, re-based onto it). Instances merge **tagged
releases only, never framework main**; determinism guaranteed by (a) immutable semver tags
+ CHANGELOG upgrade notes, (b) zero place content in the template, (c) `merge=ours` on
instance-owned files (`place.config.ts`, `knowledge/**`, `public/media/**`, `CNAME`,
`CLAUDE.md`, `AGENTS.md`, `README.md`, `CHANGELOG.md`, `VERSION`, `FRAMEWORK-VERSION`, `docs/baselines/**`,
`scripts/ci/genericity-denylist.local.txt`, `.agent-toolkit/**`), (d) the **ownership
rule**: instance `src/` and `scripts/` are framework-owned — customization flows through
config/content/media; anything more is upstreamed to sekai-kb first and pulled back as a
release. `VERSION` records the instance's own release. `FRAMEWORK-VERSION` records the
adopted Sekai release. The template carries only `FRAMEWORK-VERSION`; init creates
adopter `VERSION`. Each repository's npm manifest mirrors its own release SSOT without
the leading `v`. The `/upgrade` skill wraps fetch → capture adopter package state →
merge tag → reconcile mixed-ownership manifests → build-verify → conflict report.
Framework and instances use the same directory shape except for adopter-only `VERSION`:

```text
sekai-kb/
├── place.config.ts
├── knowledge/                 # instance-owned Markdown SSOT
├── public/media/              # instance-owned media
├── src/
│   ├── components/
│   ├── layouts/
│   ├── templates/
│   ├── pages/
│   ├── styles/
│   ├── content/               # derived, gitignored
│   └── data/                  # derived build outputs
├── scripts/
│   ├── core/
│   ├── tools/
│   └── ci/
├── workers/                   # optional Cloudflare Workers
├── semiont/                   # optional organ layer
├── .claude/skills/            # framework-owned skills
├── docs/playbook/
├── docs/runbook/
├── CHANGELOG.md               # instance work only; merge=ours
├── VERSION                    # adopter only: instance release; merge=ours
├── FRAMEWORK-VERSION          # adopted tag; merge=ours, then /upgrade bumps it
├── AGENTS.md                  # instance-owned agent-instruction SSOT
└── CLAUDE.md                  # one-line @AGENTS.md shim
```

> **Dev-plugin state persistence (2026-07-19, ADR 006 addendum):** `merge=ours`
> protects content only when the path exists on both merge sides; it does not preserve an
> intentionally absent `.agent-toolkit/` tree. `/upgrade` must classify dev-plugin state
> before merging: **stripped** means both `.agent-toolkit/` and the active
> `@.agent-toolkit/dev.md` reference are absent; **installed** means the adopter's
> `.agent-toolkit/dev.md` and active reference are present. A stripped instance stays
> stripped across shared-history upgrades and unrelated-history first tag merges; an
> installed instance keeps its own config and rules. Mixed states are invalid and stop the
> upgrade with a diagnostic. Framework dev-plugin state is never reacquired implicitly;
> `dev:setup` is the only opt-in path.

> **Skill ownership (2026-07-11 (c), task 5.6):** the framework skills under
> `.claude/skills/` (`/write`, `/validate`, `/factcheck`, router, plus `/adopt`,
> `/seed-articles`, `/upgrade`, `/release`) are framework-owned, same class as `src/`. Adopters ADD
> new skills freely — new files never conflict on upgrade. Overriding a framework skill
> means upstreaming the change to sekai-kb first, or accepting a conflict-managed local
> fork that `/upgrade` flags on every release. ADR 006 extends the original five-file
> instance-owned baseline by adding `AGENTS.md`, `README.md`, `CHANGELOG.md`, `VERSION`, `FRAMEWORK-VERSION`,
> `docs/baselines/**`, `scripts/ci/genericity-denylist.local.txt`, and
> `.agent-toolkit/**`; `CLAUDE.md` remains
> instance-owned as the byte-exact one-line `@AGENTS.md` shim.

> **Release train for post-cut feature phases (9-11, ADR 005):** those phases execute in
> `sekai-kb`; each ships as a tagged release, and instances (LB first) adopt via
> `/upgrade` per `docs/runbook/UPGRADE.md` (task 9.3). The upgrade pull into LB is part of
> each phase's exit gate.

## `place.config.ts`

Schema: `place {name, tagline, domain, locale, languages}`,
`categories[] {slug, title, icon, description, color?, colorLight?}` (5-14), `map {center, zoom, maxBounds}`,
`features {graph, map, dashboard, soundscape, feedback, chat, social, analytics}`,
`links {repo, email, social {twitter?, threads?, instagram?}}`,
`seo {defaultOgImage, twitterHandle?}`. Init-time: written only by the `npm run init`
wizard (~8 prompts, or `--answers <json>` from `/adopt` — single writer, no drift).
Runtime-toggleable: `features`, languages, semiont organs.

> **`links` (added 1.1a):** the shell's Footer/SEO/Header need a GitHub repo URL,
> contact email, and social handles, which the original schema did not define. Wilson
> approved extending the schema rather than dropping the links. `links.social.*`
> render only when `features.social` is true; the init wizard (5.2) includes `links`
> prompts. Tracked on LB-3.

> **`categories[].color?` / `colorLight?` (added LB-40):** optional hex color strings
> for category display (hero tints, tag badges, sidebar accents). Absent-safe: when
> omitted, `categoryConfig.ts` falls back to `DEFAULT_COLOR`. This moves category
> colors from a framework-owned slug-keyed palette to instance data, eliminating the
> per-upgrade conflict on `categoryConfig.ts` that every non-demo-slug adopter hits.
> Wilson approved extending the schema 2026-07-25. Tracked on LB-40.

> **Phase 9-11 extensions (approved 2026-07-07, ADR 005):** `features.mcp` (task 9.1)
> and `analytics` IDs (GA4 measurement ID, CF Web Analytics token — task 10.1) extend the
> schema under the same intentional-divergence pattern as `links`; init-wizard prompts
> tracked on the citing tasks (or Backlog stubs if 5.2 is closed when they land).
> **Absent-safe rule (spec invariant):** every new `place.config` key must default to
> feature-off when missing, so existing instances upgrade across framework releases
> without config edits.

> **`home` (added 1.1b):** the entire home-page copy surface — hero, stats, doors, cover
> story, exhibition halls, feature cards, section headings — lives in the config as a
> `home` block (~230 lines for LB). This keeps `src/` string-free (genericity win) but
> exceeds any init interview: the wizard (5.2a) writes generic defaults for `home.*`, and
> `/adopt` may draft place-specific copy behind the same human-approval gate as
> `/seed-articles`. The 5.1 demo place ships authored demo copy. Same
> intentional-divergence pattern as `links`.

## Content model

`knowledge/` is SSOT (plain Markdown + YAML frontmatter, `[[wiki-links]]`);
`scripts/core/sync.sh` projects it into gitignored `src/content/`, never edited directly.
Wiki-links resolve at build time into hyperlinks + graph edges. Map frontmatter key is
`geo: Name,lat,lng,Area` (the fork's actual schema — there is no `coordinates:` key).
Multi-language: 3-line wrapper pages per language importing `src/templates/*` bodies;
adding a language = wrapper dir + `languages` entry + `knowledge/{lang}/` content. The
translation cascade/babel tooling is NOT ported (see `Inherited-fork disposition`). This is a design sketch only:
the site is English-only through the current roadmap and language support is a
post-project revisit (PRD non-goals).
Adopter-facing boundary (2026-07-11 (c)): v1 tooling is English-calibrated; Latin-script
content largely works (plain tokenization; article-health prose thresholds may need
per-instance retuning); CJK is unsupported until that revisit (LB-24). Task 5.3 states
this in the adopter docs — documented honestly, never patched with code.

## Build pipeline

`sync.sh` → parallel prebuild (`run-p`: kb-index, search, content-dates, git-info,
related, changelog, map-markers, dashboard-lite) → latest → `astro build` → post-build
contract checks (`run-s`: smoke, internal-links, map-markers, graph, dashboard). Target
< 60s at 50 articles. The dashboard-lite job shells into article-health (uv) absent-safe.

**Static-endpoint naming: `/kb/`, not `/api/`** — `/kb/topics.json`,
`/kb/articles/{slug}.md`, `/kb/search-index.json`, plus `/llms.txt` at root. This is the
vendor-agnostic lazy-loading knowledge protocol: any browsing-capable AI reads `llms.txt`
→ `topics.json` → fetches only the articles it needs. `generate-api.js` ports as
`build-kb-index.mjs` with `/kb/` output paths.

## Pages

`index`, `[category]/index`, `[category]/[slug]`, `explore`, `graph`, `map` (Leaflet, new),
`latest`, `about`, `contribute`, `changelog`, `dashboard`, `404`, `feed.xml`/`rss.xml`,
`llms.txt`, `/kb/*`. Phase 6 adds `soundscape` + feedback widget; Phase 7 adds `/chat`.

## New builds

1. **Leaflet map.** GeoJSON markers come from article `geo:` frontmatter and use category
   colors. Popups link to articles. A simplified municipal-boundary GeoJSON overlays the
   map. Source candidates and constraints are in the v0 research section "Laguna Beach
   GIS & TopoJSON Notes"; Leaflet consumes GeoJSON directly.
2. **Feedback capability.** `FeedbackWidget.astro` posts to `workers/feedback/`, a
   Cloudflare Worker backed by D1. A triage skill reads D1 and files GitHub issues. This
   replaces the fork's 89-file Supabase harvest orchestrator; none of that code survives.
3. **Social publishing pipeline.** `/snippet` selects an article, generates a short-form
   draft, queues it in `knowledge/SNIPPET-INBOX.md`, and requires human approval before a
   platform adapter publishes it. It reuses the concept, not the fork's spore code.
4. **Soundscape.** A native HTML5 audio page reads a `knowledge/sounds/` manifest. No
   player library is introduced.
5. **On-demand OG images.** `workers/og/` renders slug-keyed cards with Satori and
   `resvg-wasm`, cached at the Cloudflare edge. Static `og-default.png` remains fallback.
6. **RAG chat and QR flow.** `build-embeddings.mjs` chunks articles at 300-500 tokens on
   `##` boundaries and embeds them with bge-m3 at 1024 dimensions. `workers/chat/` embeds
   queries with Workers AI `@cf/baai/bge-m3`, performs in-worker cosine retrieval over
   static JSON vectors, and calls Claude with citation-required prompting. QR codes deep
   link to `/chat?ctx=<location>`. The mandatory implementation pre-read is the v0
   research section "RAG Chatbot".
7. **Framework scaffolding.** The primary path is GitHub "Use this template" followed by
   `/adopt`. The skill interviews for place identity, domain, map, language, categories,
   and grounding material; it calls `npm run init -- --answers <json>`, then offers
   `/seed-articles`. The wizard remains the single writer of `place.config.ts` and also
   seeds category directories, `CNAME`, `AGENTS.md`, adopter `VERSION`, and
   `FRAMEWORK-VERSION`, and writes adopter package identity whose npm version mirrors
   `VERSION`. Framework delivery includes `/upgrade`, `/release`, the playbook/runbooks,
   template README, and the generic `/write`, `/validate`, `/factcheck`, and router
   skills.
8. **Semiont plugin layer.** ADR 003 governs the optional organ architecture. The stable
   boot hook lives in adopter-owned `AGENTS.md`; framework-owned organ logic lives under
   `semiont/`. Core is MEMORY + REFLEXES with a boot read below 150 lines. Other organs
   are opt-in and may not read one another's files.

## Extension capabilities — Phases 9-11 (ROADMAP extension blocks govern detail; ADR 005)

### MCP delivery (`workers/mcp/`, Phase 9)

Stateless Streamable-HTTP MCP server on Cloudflare Workers (createMcpHandler pattern, no
Durable Objects at LB scale — free-tier verified 2026-07, ADR 005; McpAgent/DO documented
as the scale-up path for adopters needing sessions). Tools: `list_topics`
(/kb/topics.json), `get_article` (/kb/articles/{slug}.md), `search` (keyword over
/kb/search-index.json), `semantic_search` (query embed via Workers AI `@cf/baai/bge-m3` +
in-worker cosine over the 7.2a vectors — same model space as chat, §Stack). Retrieval
code shared with `workers/chat/` lives in `workers/lib/`. Behind `features.mcp`. The
`/ai` page + `/kb/agent.md` boot file (task 9.2) document every AI consumption path;
cross-ref v0 research §"MCP Server and Alternative Knowledge Delivery" (mandatory
pre-read for 9.1/9.2 executors, same rule as the 7.2 pre-reads in `.agent-toolkit/dev.md`).

### Analytics (`features.analytics`, Phase 10)

Full stack: GA4 + Google Search Console + Cloudflare Web Analytics (ADR 005). Beacon/gtag
injected by HeadInlineScripts only when the flag is on; IDs live in `place.config.ts`,
never in `src/`. Fetchers (ported from the v1 archive when the named trigger fires) emit
`src/data/analytics/*.json` behind `npm run fetch:analytics`; dashboard renders panels
from them and the build stays green when they are absent. Credentials via local env /
Actions secrets, documented in the runbook.

### Autonomous routines (Phase 11)

Hybrid substrate (ADR 005): deterministic pipelines (embeddings/index refresh, analytics
fetch) run as GitHub Actions cron/push-triggers; AI routines (maintainer, feedback-triage,
trend-discovery, social-publish, rewrite) run as Claude Code native scheduled tasks on
Wilson's machine. `semiont/organs/routine/ROUTINE.md` is the SSOT — each routine =
`{id, substrate, schedule, skill, model, depends, ship-mode}`; the `/schedule` skill
registers/unregisters against the declared substrate. Lifecycle contract (taiwan-md's 5
stages with PR discipline replacing direct push): sync main → run skill → ship via PR per
ship-mode (`auto-merge-data` for data-only artifacts, `human-merge` for content) → finale
writes the MEMORY organ. Kill switch: disabling the routine organ in
`semiont/config.json` stops all routines.

## Extraction map

Extraction source rule: **prefer the fork's copy** (`${SRC_HOME}/lagunabeach-md-v1`)
where de-Taiwan work is done; upstream (`${SRC_HOME}/taiwan-md`) is design reference
only. Both source trees were verified on 2026-07-04.

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

Dispositions for everything else are in `Inherited-fork disposition`; there is no
"dormant" state.

> **article-health language policy (2026-07-11, LB-20):** the tool ports English-only.
> The original "parameterize the CJK-specific checks by language" direction is
> superseded (approved 2026-07-07, extended 2026-07-11): checks with a mixed
> language implementation keep their English core only; pure-CJK checks (`cjk_punct`,
> zh-TW pattern sets) are not carried. No language profile or `APPLIES_TO` gate exists.
> Scope fix (2026-07-11 (b)): the doctrine is whole-project — `tests/` fixtures are
> code and ship English-only with no fork place-brand strings; the tool's target set
> is exactly `knowledge/{Category}/*.md` (never spore/semiont/memory/report paths, which
> do not exist in this repo's content model — dead fork path-skips are removed).

## Inherited-fork disposition

The fork is the read-only `lagunabeach-md-v1` archive. "Delete" means not extracted and
no successor planned. Deferred capability has a named ROADMAP trigger.

| Subsystem | Disposition | Contract |
|---|---|---|
| Design CSS | Extracted and genericized | Six files from the extraction map; non-font tokens remain unchanged. |
| Component library | Split | Named components in the extraction map survive. Taiwan-wired backends and Taiwan-specific concepts, including spore, supporter, diary, life-tree, perspectives, text-to-speech, reading-path, and old semiont components, are deleted. |
| Template bodies | Split | Named templates survive. `bench`, companies, elections, Taiwan-shape, opendata, assets/data, old MCP, and old semiont templates are deleted. Soundscape remains a Phase 6 design reference. |
| Locale wrappers and i18n toolchain | Delete | The translation cascade, babel jobs, language sync, coverage, CJK tokenizer, language profiles, and CJK fixtures do not ship. Multi-language support is rebuilt only after Phase 11. |
| `knowledge/zh-TW/` | Void | It did not exist in the fork. No content was available to carry. |
| Harvest orchestrator and Supabase feedback | Delete | Feedback and social return as the Phase 6 Worker/D1 and snippet designs. Zero harvest code survives. |
| `twmd-*` skills | Delete | Taiwan business logic remains readable in the upstream archive only. |
| `lb-*` skills | Split and renamed | `/write`, `/validate`, `/factcheck`, and the router shipped in 5.6; sync/search became documented npm workflows; embeddings returns in 7.2a; semiont boot returns in 8.1; refresh/news-lens/peer/media-audit concepts return as Phase 11 routines; translate waits for the post-project language revisit; migration and old execution-loop skills are deleted. |
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

## Risk controls

1. **Design-parity failure.** Copy design as files, keep side-by-side screenshot
   acceptance and visual baselines, and require Wilson's Phase 1 sign-off. If a page
   misses the bar, copy the fork page wholesale and re-genericize it.
2. **Genericity erosion.** CI runs place-name and CJK gates, `place.config.ts` is the
   only code-facing identity ingress, and the real second-place adoption proof validates
   the abstraction empirically.
3. **Framework deferral.** Tasks 6.x and 7.x depend on 5.4. Reordering is a scope change
   requiring Wilson's explicit approval.
4. **Two-repo drift.** The template contains no place content, instance-owned paths use
   `merge=ours`, instances merge immutable tags only, and framework-owned changes land in
   `sekai-kb` before instances adopt them. ADR 004 and ADR 006 govern the full contract.
5. **Lost upstream improvements.** This is an accepted cost. Taiwan.md remains readable;
   useful ideas are reimplemented generically, never merged automatically.
6. **Framework overreach.** A framework feature exists only when LB uses it or it is one
   of the six named adopter needs. Additional framework surface waits for a real adopter
   requirement.

## Deployment

GitHub Pages via Actions + Cloudflare DNS/CDN. Workers deploy via `wrangler` from
`workers/`, documented in the runbook. No paid services.

## Negative requirements

- **Genericity + English-only (CI-gated from 0.3; scope extended in LB-20):** zero
  place-specific strings in any code tree — `src/`, `scripts/`, `tests/`, and future
  `workers/`/plugin code; `scripts/ci/check-genericity.sh` fails the build on denylist
  hits, and the CI gate additionally fails on any CJK codepoint in those trees
  (English-only doctrine, machine-enforced; ADR 002 and ROADMAP task 0.3).
  `.claude/skills/` joins both gates' scan roots when the framework
  skills land (task 5.6) — agent-executed prose is code for doctrine purposes.
- **No build-time OG generation ever**; static default until the Phase 7 worker.
- **Site builds with `semiont/` deleted**; no organ reads another organ's files (ADR 003).
- **CI must run on pull requests**: build + genericity jobs trigger on `pull_request`
  (deploy job only on push to `main`) — every task PR gets CI (dev-plugin adoption
  amendment, 2026-07-07).
- **Phases 6-7 depend on 5.4**: no LB fun-features before the framework ships (ADR 002;
  `Risk controls`).
- **Routines never push main directly** (Phase 11, ADR 005): every routine ships via a
  PR behind CI — `auto-merge-data` on green for data-only artifacts, `human-merge` for
  content. The dev-plugin iron rule (no work done outside a verified merge) applies to
  automation, not just humans.
- **New `place.config` keys must be absent-safe**: a missing key means the feature is
  off; framework upgrades never require config surgery on existing instances.
- **Design parity fallback**: if any page misses the visual bar, copy that page's fork
  implementation wholesale and re-genericize; never re-prompt from description (`Risk controls`).

## Change log

- **2026-07-26, Wilson-approved version ownership correction:** Sekai carries only
  `FRAMEWORK-VERSION`; adopters carry `VERSION` plus their adopted
  `FRAMEWORK-VERSION`. Each private npm manifest mirrors the repository's own release
  SSOT without the leading `v`. Adopter releases are explicit through `/release`; routine
  article PRs do not bump. `/upgrade` reconciles the manifests' mixed ownership. ADR 007
  records the init, release, upgrade, and CI contracts.
- **2026-07-26, Wilson-approved ownership correction:** `CHANGELOG.md` is instance-owned
  and records instance work only. The init wizard replaces the template's framework
  release log with an instance changelog. `/upgrade` reads framework release notes from
  the target tag and preserves the local changelog through `merge=ours`.
  `FRAMEWORK-VERSION` is also merge-protected; `/upgrade` bumps it explicitly after
  successful verification.
- **2026-07-19, Wilson-approved LB-44 delta:** added the dev-plugin state-persistence
  contract for framework upgrades. This corrects the false assumption that
  `.gitattributes merge=ours` preserves a deleted `.agent-toolkit/` path. ROADMAP order is
  unchanged; LB-44 closes the Phase 5 upgrade-determinism guarantee before LB-43 validates
  the dual-harness workflow.
