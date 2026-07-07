# SPEC: LagunaBeach.md / Sekai KB

**Derived 2026-07-07 from `.fable/STRATEGIC-DIRECTION.md` §B (architecture PDR), §C
(extraction map), §D (build-new list).** This document is the operative spec for
dev-plugin skills; the strategic direction is the frozen source of record — where this
spec compresses, the cited section governs detail. Conflicts go to Wilson (see
`.claude/dev.md`). Engineering diagrams (SSOT): `docs/diagrams/architecture.drawio`,
`data-flow.drawio`, `repo-topology.drawio` — updated in the same PR as any architecture
change they depict (§B).

## Stack (§B "Stack")

- **Astro 6.x + Tailwind 4.x**, zero client-side frameworks; vanilla JS on interactive
  pages. Node ≥ 22.12.
- **MiniSearch** client-side search, index prebuilt; CJK bigram tokenizer kept as a code
  path gated by `place.config.languages` (Latin-only places get word tokenization).
- **D3 from CDN** for the knowledge graph only; **Chart.js from CDN** only if the dashboard
  needs it.
- **Leaflet + OSM tiles** for the map (deviation from upstream's D3/TopoJSON SVG map),
  CDN-loaded, page-scoped.
- **Cloudflare Workers (free tier)** for all dynamic capability: feedback (Worker + D1),
  on-demand OG (Satori + resvg-wasm), RAG chat. RAG model space: **bge-m3, 1024-dim** for
  both corpus (offline: 4090 or Workers AI) and query (Workers AI `@cf/baai/bge-m3` —
  mandatory, the 4090 is unreachable at request time). At LB scale, retrieval is in-worker
  cosine over static JSON vectors; Vectorize is the documented path at ~4k+ vectors.
  Worker skeleton/chunking/CPU-limit details: v0 research §"RAG Chatbot" (mandatory
  pre-read for 7.2 executors, see `.claude/dev.md` binding references).

## Repo topology (§B "Repo topology", diagram `repo-topology.drawio`)

Phases 0-4: one repo (`lagunabeach-md`). After Phase 5: `sekai-kb` (framework SSOT, GitHub
template repo) + `lagunabeach-md` (instance #1, re-based onto it). Instances merge **tagged
releases only, never framework main**; determinism guaranteed by (a) immutable semver tags
+ CHANGELOG upgrade notes, (b) zero place content in the template, (c) `merge=ours` on
instance-owned files (`place.config.ts`, `knowledge/**`, `public/media/**`, `CNAME`,
`CLAUDE.md`), (d) the **ownership rule**: instance `src/` and `scripts/` are
framework-owned — customization flows through config/content/media; anything more is
upstreamed to sekai-kb first and pulled back as a release. `FRAMEWORK-VERSION` records the
instance's version; the `/upgrade` skill wraps fetch → merge tag → build-verify → conflict
report. Directory shape: §B's tree (same shape for framework and instances).

## `place.config.ts` (§B — THE ingress for place identity)

Schema (full version in §B): `place {name, tagline, domain, locale, languages}`,
`categories[] {slug, title, icon, description}` (5-14), `map {center, zoom, maxBounds}`,
`features {graph, map, dashboard, soundscape, feedback, chat, social, analytics}`,
`seo {defaultOgImage, twitterHandle?}`. Init-time: written only by the `npm run init`
wizard (~8 prompts, or `--answers <json>` from `/adopt` — single writer, no drift).
Runtime-toggleable: `features`, languages, semiont organs.

## Content model (§B — unchanged and non-negotiable)

`knowledge/` is SSOT (plain Markdown + YAML frontmatter, `[[wiki-links]]`);
`scripts/core/sync.sh` projects it into gitignored `src/content/`, never edited directly.
Wiki-links resolve at build time into hyperlinks + graph edges. Map frontmatter key is
`geo: Name,lat,lng,Area` (the fork's actual schema — there is no `coordinates:` key).
Multi-language: 3-line wrapper pages per language importing `src/templates/*` bodies;
adding a language = wrapper dir + `languages` entry + `knowledge/{lang}/` content. The
translation cascade/babel tooling is NOT ported (§B, §F).

## Build pipeline (§B)

`sync.sh` → parallel prebuild (~9 jobs: kb-index, search, map-markers, related,
content-dates, git-info, latest, dashboard-lite) → `astro build` → post-build smoke +
internal-link check. Target < 60s at 50 articles.

**Static-endpoint naming: `/kb/`, not `/api/`** — `/kb/topics.json`,
`/kb/articles/{slug}.md`, `/kb/search-index.json`, plus `/llms.txt` at root. This is the
vendor-agnostic lazy-loading knowledge protocol: any browsing-capable AI reads `llms.txt`
→ `topics.json` → fetches only the articles it needs. `generate-api.js` ports as
`build-kb-index.mjs` with `/kb/` output paths.

## Pages (LB v1 complete list, §D)

`index`, `[category]/index`, `[category]/[slug]`, `explore`, `graph`, `map` (Leaflet, new),
`latest`, `about`, `contribute`, `changelog`, `dashboard`, `404`, `feed.xml`/`rss.xml`,
`llms.txt`, `/kb/*`. Phase 6 adds `soundscape` + feedback widget; Phase 7 adds `/chat`.

## New builds (§D, summarized — §D governs detail)

Leaflet map with GeoJSON markers + municipal boundary overlay (sourcing researched, v0
research §"Laguna Beach GIS"); feedback capability (Worker + D1 + ~100-line widget +
triage skill — replaces the 89-file Supabase harvest orchestrator); snippet social
pipeline (concept from spores, zero spore code); soundscape (native HTML5 audio);
on-demand OG worker; RAG chat + QR flow; framework scaffolding (init wizard, `/adopt`,
`/seed-articles`, `/upgrade`, playbook, runbook); semiont plugin layer (§A3: default-on
core = boot identity <150 lines, MEMORY, REFLEXES; everything else opt-in; no
cross-organ dependencies).

## Extraction map — the implementation contract (§C)

Extraction source rule: **prefer the fork's copy** (`/Users/wchoi/src/lagunabeach-md-v1`)
where de-Taiwan work is done; upstream (`/Users/wchoi/src/taiwan-md`) is design reference
only. §C's lists are the contract: 6 CSS files verbatim-then-font-swap (byte-diff
verifiable); ~16 named components + `home/`/`timeline/` subdirs with a genericity pass;
10 template bodies; `graph.astro` whole; ~10 `scripts/core/` ports (incl. `generate-api.js`
→ `build-kb-index.mjs`); editorial tooling (`article-health.py` + config,
`verify-internal-links.sh`, `refresh-llms-txt.py`, visual-regression scripts, pre-commit
hooks); fork's `EDITORIAL.md` + `QUALITY-CHECKLIST.md` seed the playbook. `CATEGORY_MAP`
dies; categories come from `place.config.ts`. Dispositions for everything else: §F
(rewrite-now / delete-now / port-on-named-trigger — no "dormant").

## Deployment (§B)

GitHub Pages via Actions + Cloudflare DNS/CDN. Workers deploy via `wrangler` from
`workers/`, documented in the runbook. No paid services.

## Negative requirements

- **Genericity (CI-gated from 0.3):** zero place-specific strings in `src/` or `scripts/`;
  `scripts/ci/check-genericity.sh` fails the build on denylist hits (§A2, §E 0.3).
- **No build-time OG generation ever** (§B); static default until the Phase 7 worker.
- **Site builds with `semiont/` deleted**; no organ reads another organ's files (§A3).
- **CI must run on pull requests**: build + genericity jobs trigger on `pull_request`
  (deploy job only on push to `main`) — every task PR gets CI (dev-plugin adoption
  amendment, 2026-07-07).
- **Phases 6-7 depend on 5.4**: no LB fun-features before the framework ships (§A2,
  §G risk 3).
- **Design parity fallback**: if any page misses the visual bar, copy that page's fork
  implementation wholesale and re-genericize — never re-prompt from description (§G risk 1).
