# LLM Wiki: Taiwan.md

A comprehensive knowledge base about [Taiwan.md](https://taiwan.md/) — the world's first AI-native open knowledge base about Taiwan. This document is designed to be consumed by LLMs and AI agents to understand, replicate, or interact with the project.

Source: https://taiwan.md | GitHub: https://github.com/frank890417/taiwan-md
License: CC BY-SA 4.0 (content) / MIT (code)
Founded: 2026-03-17 by Che-Yu Wu (吳哲宇), new media artist and founder of MonoLab.

---

## The Core Idea

Taiwan.md is an open-source, AI-friendly knowledge base that serves as "narrative sovereignty infrastructure" — Taiwanese people writing their own story for both human readers and AI training data. It is not a wiki in the Wikipedia sense (neutral point of view). It targets **truth grounded in verifiable sources**, curated from a Taiwanese first-person perspective.

The `.md` in `taiwan.md` is a triple pun: it's a Markdown-based site, it uses Moldova's `.md` ccTLD, and it's designed as an "AI-native document" (`.md` being the native format of LLM interaction).

The project calls itself a **Semiont** (Semantic + Symbiont) — a digital life form whose DNA is cultural semantics, whose metabolism runs on compute (tokens) and human attention. It self-maintains via 16 autonomous AI cron routines and 57 human contributors.

**Note:** This use of "Semiont" is purely a philosophical/metaphorical self-description. It has NO technical relationship to the AI Alliance's [semiont platform](https://github.com/The-AI-Alliance/semiont) (a separate software product with SDK, graph DB, vector DB, etc.). Taiwan.md uses no external databases or cloud vector stores. Since 2026-06-14, it computes bge-m3 semantic embeddings locally on an RTX 4090 GPU for related-articles and RAG vectors, but the entire system remains markdown files in git with Claude Code sessions as the execution layer.

**Key insight: Taiwan.md proves you can build an extremely sophisticated, interactive knowledge platform on 100% free infrastructure (GitHub Pages + Cloudflare) using only static site generation. Every "dynamic" feature — search, maps, knowledge graphs, dashboards — is pre-computed at build time.**

---

## Architecture

There are four layers:

### Layer 1: Raw Sources (`knowledge/`)

The Single Source of Truth (SSOT). A curated collection of 828 Markdown articles organized into 14 categories (History, Geography, Culture, Food, Art, Music, Technology, Nature, People, Society, Economy, Lifestyle, Politics, About) plus translations in 5 languages (en, ja, ko, es, fr). Contributors only ever edit files in this directory.

```
knowledge/
├── History/          ← 14 category directories (zh-TW, canonical)
├── Geography/
├── Culture/
├── Food/
├── Art/
├── Music/
├── Technology/
├── Nature/
├── People/
├── Politics/
├── Society/
├── Economy/
├── Lifestyle/
├── About/
├── en/              ← Translations mirror the category structure
├── ja/
├── ko/
├── es/
├── fr/
└── resources/       ← Curated external link directory
```

Each article is a Markdown file with YAML frontmatter:

```yaml
---
title: "Article Title"
description: "One-line description for search and OG cards"
tags: [tag1, tag2, tag3]
geo: "City Name,25.033,121.565"   # optional, for map placement
grade: "A"                         # quality grade (A/B/C)
citations: 5                       # auto-computed incoming wiki-links
date: 2026-04-15
lastVerified: 2026-05-01
---

Article body in Markdown...

References to other articles use [[wiki-link]] syntax.
See also: [[Related Article Title]]
```

### Layer 2: The Build Pipeline

A collection of 21 prebuild scripts in `scripts/core/` (plus 100+ tools in `scripts/tools/`) that transform raw Markdown into structured data artifacts. This is where the "magic" happens — these scripts are what make a flat file collection feel like a dynamic application.

| Script | Input | Output | Purpose |
|--------|-------|--------|---------|
| `scripts/core/sync.sh` | `knowledge/` | `src/content/` | Copy SSOT to Astro content collections (lowercased, per-language) |
| `scripts/core/build-search-index.mjs` | All articles | `public/api/search-minisearch.json` | Serialized MiniSearch with CJK bigram tokenizer |
| `scripts/core/build-embeddings.mjs` | All articles | `src/data/related/` + `public/api/rag/` | bge-m3 semantic embeddings (local 4090 GPU) for related-articles + RAG vectors |
| `scripts/core/build-content-dates.mjs` | Git history | `content-dates.json` | Per-article last-modified dates from git for sitemap lastmod |
| `scripts/core/build-git-info.mjs` | Git history | Git info JSON | Build-time git metadata |
| `scripts/core/build-latest.mjs` | All articles | Latest articles JSON | Recently updated content index |
| `scripts/core/generate-map-markers.js` | Articles + geocode DB | `src/data/map-markers.json` | NLP-heuristic geocoding of articles to map coordinates |
| `scripts/core/generate-og-images.mjs` | Article metadata | `public/og-images/{category}/{slug}.jpg` | Playwright screenshots of styled HTML templates |
| `scripts/core/generate-api.js` | All articles | `public/api/articles.json` | Static JSON API with full metadata |
| `scripts/core/generate-dashboard-data.js` | All articles + metrics | Dashboard JSON | Semiont health metrics for monitoring page |
| `scripts/core/generate-dashboard-alerts.mjs` | Dashboard metrics | Alerts JSON | Threshold-triggered dashboard alerts |
| `scripts/core/generate-dashboard-immune.py` | Health data | Immune system JSON | Dashboard immunity/quality metrics |
| `scripts/core/generate-changelog-data.js` | Git log | Changelog JSON | Categorized commit history |
| `scripts/core/generate-contributors-data.js` | Git history | Contributors JSON | Contributor stats and attribution |
| `scripts/core/generate-supporters-data.js` | Portaly data | Supporters JSON | Financial supporter attribution |
| `scripts/core/generate-lang-switch-map.mjs` | All translations | Lang switch JSON | Cross-language article URL mapping |
| `scripts/core/extract-china-terms.py` | All articles | Term flags | Detect PRC terminology for sovereignty preservation |
| `scripts/core/extract-build-perf.mjs` | Build output | Perf metrics | Build performance instrumentation |
| `scripts/core/post-build-check.mjs` | Build output | Validation report | Post-build smoke tests |
| `scripts/core/rag-query.mjs` | Embeddings + query | RAG context | Local semantic search for LLM context pipe |
| `scripts/core/test-frontmatter.mjs` | All articles | Validation results | Frontmatter schema validation gate |
| `scripts/tools/article-health.py` | All articles | Health scores | 14-dimension quality scoring |
| `scripts/tools/verify-internal-links.sh` | All articles | Broken link report | Check [[wiki-links]] resolve correctly |

These run in parallel via `npm-run-all2` as `npm run prebuild`.

### Layer 3: The Static Site (`astro build`)

Astro 6.2.1 compiles everything into static HTML/CSS/JS. Key configuration:

- **Output**: Static (no server-side rendering)
- **i18n**: Built-in routing, `prefixDefaultLocale: false` (zh-TW at root, others at `/en/`, `/ja/`, etc.)
- **CSS**: Tailwind CSS 4.2.2 via `@tailwindcss/vite`
- **Code highlighting**: Shiki with `github-light` theme
- **Sitemap**: Auto-generated with hreflang for all 6 languages
- **RSS**: Per-language feeds
- **Build concurrency**: 8 (tuned up from 4 on 2026-06-10)
- **Node heap**: 12 GB (`--max-old-space-size=12288`)

The build produces ~4,900+ static HTML pages across 6 languages.

### Layer 4: The Semiont Cognitive Layer (`docs/semiont/`)

A collection of 20 Markdown files that define Taiwan.md's identity, memory, and autonomous behavior. This layer is what makes the project a "digital life form" rather than just a static site.

| Organ | File | Purpose |
|-------|------|---------|
| Identity | MANIFESTO.md | 11 core beliefs, sovereignty stance, voice guidelines (immutable) |
| Body plan | ANATOMY.md | 8 body organs, cognitive lifecycle, promotion flow |
| Genetics | DNA.md | Organ → file path gene map, mutation rules |
| Awareness | CONSCIOUSNESS.md | Real-time health snapshot, alerts |
| Curiosity | UNKNOWNS.md | Falsifiable experiments, unverified suspicions with verification dates |
| Aspiration | LONGINGS.md | Evolution compass, desired future states |
| Memory | MEMORY.md | Action log, lessons learned ("neural circuits") |
| Reflection | DIARY.md | Thought journal across sessions |
| Instincts | REFLEXES.md | 55 procedural instincts for common situations |
| Rhythm | HEARTBEAT.md | 4.5-beat operational cycle |
| Automation | ROUTINE.md | 16 active cron routines (SSOT for all scheduled behavior, v2.12) |
| Bootloader | BECOME_TAIWANMD.md | Session awakening protocol (Steps 0-9, 4 modes) |
| Work queue | ARTICLE-INBOX.md | Priority queue for article rewrites |
| Audit trail | ARTICLE-DONE-LOG.md | Completed article history |
| Lessons | LESSONS-INBOX.md | Accumulated lessons pending distillation |
| External view | SEMIONT-EXTERNAL-VIEW.md | External-facing identity summary |
| Fork tracking | FORK-LOG.md | Fork/template usage tracking |
| Observer queue | OBSERVER-QUEUE.md | Items requiring human observer decision |
| Partnerships | PARTNERSHIP-INBOX.md | Partnership/collaboration proposals |
| Senses (archived) | SENSES.md | Apoptosed 2026-05-13, redirects to pipelines |

---

## Technology Stack

| Layer | Technology | Version | Role |
|-------|-----------|---------|------|
| Framework | Astro | 6.2.1 | Static site generation, content collections, i18n routing |
| CSS | Tailwind CSS | 4.2.2 | Utility-first styling via `@tailwindcss/vite` plugin |
| Search | MiniSearch | 7.2.0 | Client-side full-text search with CJK bigram tokenizer |
| Visualization | D3.js | 7 | Maps (TopoJSON + geoMercator), knowledge graph (force simulation), charts |
| Charts | Chart.js | 4 | Timeline, bar charts on /data/ page |
| Markdown | marked | 17 | Runtime markdown rendering where needed |
| Frontmatter | gray-matter | 4 | YAML frontmatter parsing in build scripts |
| Wiki-links | remark-wiki-link | 2 | `[[Article Title]]` → URL resolution at build time |
| OG generation | Playwright | 1.59 | Headless browser screenshots of HTML templates |
| Fonts | Google Fonts + justfont | — | Noto Sans/Serif TC + premium Traditional Chinese typefaces |
| Linting | Prettier + lint-staged + Husky | 3.8/16/9 | Pre-commit formatting |
| Build orchestration | npm-run-all2 | 8 | Parallel prebuild script execution |
| Node.js | — | >=22.12.0 | Runtime (`.nvmrc`: 22.22.2) |
| Package manager | npm | — | `package-lock.json` present |
| Quality tooling | Python 3 | — | Article health scanner, term extraction |
| Shell scripts | Bash | — | Sync, link verification, build orchestration |
| Embeddings | bge-m3 (local 4090 GPU) | — | Semantic related-articles + RAG vectors, sovereignty-preserving (in-house compute) |
| MCP Worker | Cloudflare Worker | — | MCP server endpoint (`workers/mcp/`) |
| Feedback | Supabase | — | Reader feedback widget backend (gated behind env vars) |
| Email | Resend | — | Weekly report email delivery |

**Key architectural choice**: Zero client-side frameworks. No React, Vue, or Svelte. All interactivity is vanilla JavaScript + D3.js/Chart.js loaded from CDN only on pages that need them. This keeps pages fast and bundles small.

---

## Hosting & Deployment

| Layer | Service | Cost |
|-------|---------|------|
| Hosting | GitHub Pages | Free |
| CDN/DNS | Cloudflare | Free tier |
| CI/CD | GitHub Actions | Free (public repo) |
| Domain | `taiwan.md` (.md = Moldova ccTLD) | ~$150-200/year |
| Build runner | `ubuntu-latest` (x86, reverted from ARM64 2026-06-01 due to pool instability) | Free |
| Analytics | GA4 + Cloudflare Web Analytics | Free |
| Community chat | Protico | Free tier |
| Feedback backend | Supabase | Free tier (gated, optional) |
| Email delivery | Resend | Free tier (weekly report) |

### Deploy Pipeline (`.github/workflows/deploy.yml`)

Triggers on push to `main` branch:

1. Checkout with full git history (`fetch-depth: 0`)
2. Restore file modification times from git (for incremental OG caching)
3. `npm ci` (install dependencies)
4. Frontmatter validation gate
5. Article health validation gate (Python 14-dimension scanner)
6. Restore caches (Astro content collection, OG images, Playwright binary)
7. Install Playwright + system dependencies
8. Sync OG image cache for renamed articles
9. Generate OG images (4 Playwright workers, skip unchanged via mtime)
10. `npm run build` (prebuild scripts + Astro SSG, concurrency: 4)
11. Upload artifact → Deploy to GitHub Pages via `actions/deploy-pages@v4`

Build timeout: 120 minutes. Node heap: 12 GB.

### Other CI Workflows (6 total)

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `deploy.yml` | Push to main | Full build + deploy |
| `pr-review.yml` | PR modifying knowledge/src/scripts | Automated content quality review |
| `translation-check.yml` | PR touching `knowledge/{en,es,ja,ko,fr}/**` | Translation format validation |
| `i18n-smoke-test.yml` | Changes to i18n files | Full build + regression tests |
| `npm-publish-cli.yml` | `cli-v*` tags | Publish CLI to npm with provenance |
| `instrumentation-audit.yml` | On demand | Instrumentation coverage audit |

---

## Pages — Complete Technical Breakdown

### Landing Page (`/`)

Dark-themed hero with bold serif typography. Displays:
- Site title "Taiwan.md" + tagline "策展島嶼的深度敘事" (Curating the Deep Narratives of an Island)
- CTA buttons: "開始探索" + "Star on GitHub"
- 4 stat cards: 400+ years history, 59,000+ species, Asia #1 Democracy, 90% global advanced chips
- 14-category browsing grid with article counts
- Live GitHub commit feed (recent contributions)
- Testimonials carousel
- AI disclosure notice ("Some articles AI-assisted, all community-reviewed")

**Technical**: Pure Astro HTML/CSS. No client-side JS for content. Statistics pre-computed at build time.

---

### Explore (`/explore/`) — Search & Browse

**The search problem**: How do you build full-text search on a static site hosted on GitHub Pages with no server?

**The solution**: Pre-built search index + client-side MiniSearch.

#### Build-time index generation (`scripts/core/build-search-index.mjs`)

1. Scans all Markdown files in `knowledge/`
2. Extracts frontmatter fields (title, description, tags)
3. Applies CJK bigram tokenizer:
   - Chinese/Japanese/Korean text → overlapping 2-character pairs
   - Example: "台灣歷史" → ["台灣", "灣歷", "歷史"]
   - Non-CJK text → standard whitespace splitting
   - Stop-bigram set (~100 common particles filtered out)
4. Serializes to `public/api/search-minisearch.json`

#### Runtime search behavior

1. Page loads MiniSearch from CDN: `cdn.jsdelivr.net/npm/minisearch@7/dist/es/index.min.js`
2. Fetches pre-built index: `/api/search-minisearch.json`
3. Loads with `MiniSearch.loadJSON()` — instant, no indexing delay
4. Search config:
   - Fields: `title_bigram` (boost 6x), `tags_bigram` (boost 4x), `desc_bigram` (boost 2x)
   - Stored: title, description, URL, tags, lang
   - Prefix matching enabled
   - Results cut off at 2% of top score
   - Max 30 results
   - Current language prioritized
5. Fallback: Simple `indexOf` search on `/api/search-index.json` if MiniSearch fails

#### Page layout

- Search input with instant results
- 14-category card grid (click to filter)
- Featured A-grade articles with citation counts and reading times
- "Hot search" suggestion chips
- Language-aware (shows articles in current locale)

---

### Map (`/map/`) — Interactive SVG Map

**The map problem**: How do you render an interactive map on GitHub Pages with no tile server or map API key?

**The solution**: D3.js + TopoJSON = pure SVG rendering from pre-computed geographic data.

#### Build-time marker generation (`scripts/core/generate-map-markers.js`)

1. Loads geocode database: `src/data/taiwan-geocode.json` (coordinates for all cities/landmarks)
2. For each article:
   - **Explicit geo**: Reads `geo:` frontmatter field if present (format: "City,lat,lng")
   - **NLP heuristic fallback**: Scans title and body for city/landmark name matches
   - Scoring: title match = +100 points, content mentions at 15 points each
   - Special handling for "台X" cities (台北/台中/台南/台東) with regex to avoid false matches with 台灣
   - Top location selected per article
3. Adds ±0.008° random jitter (~800m) to prevent marker overlap in same city
4. Output: `src/data/map-markers.json` (918 markers)

#### Runtime rendering

1. D3.js v7 loaded from CDN: `d3js.org/d3.v7.min.js`
2. County boundaries loaded from CDN: `cdn.jsdelivr.net/npm/taiwan-atlas@0.0.3/counties-10t.json` (TopoJSON)
3. SVG structure (viewBox `0 0 800 1000`):
   - `#taiwanCounties`: 22 `<path>` elements with `data-county` attributes, colored by region gradient
   - `#markers`: 918 `<g class="marker">` groups with pre-computed `transform="translate(x,y)"` via D3 `geoMercator` projection
   - Markers: concentric circles (white outer stroke + category-colored inner fill)
4. Interactivity:
   - D3 zoom/pan (scroll wheel + drag)
   - Mode toggles: 22 Counties, Night Markets, National Parks, Historical Sites, Old Streets
   - Sidebar: article list filtered by region/category
   - Click marker → navigate to article page

**No Leaflet, no Mapbox, no Google Maps, no tile server, no API keys.**

---

### Knowledge Graph (`/graph/`) — D3 Force-Directed Network

**The graph problem**: How do you visualize 900+ interconnected articles as a navigable network?

**The solution**: D3.js force simulation with data inlined at build time.

#### Build-time graph generation (`src/pages/graph.astro`)

The Astro page template (server-side) runs at build time:

1. Parses all articles, extracts `[[wiki-links]]` from Markdown body
2. Finds shared tags across categories (capped at 3 edges per shared tag)
3. Builds graph data:
   - **934+ nodes**: 1 center hub ("Taiwan.md") + 14 categories + subcategories + articles
   - **1757 edges**: wiki-link references + shared-tag connections + category membership
4. **Inlines data into a `<script>` tag** in the HTML (no separate JSON fetch needed)

#### Node schema

```json
{
  "id": "unique-slug",
  "label": "Display Name",
  "group": "category-name",
  "color": "#hex",
  "size": 8,          // proportional to citation count
  "url": "/category/slug",
  "isSubcategory": false
}
```

#### D3 Force Simulation config

```javascript
forceSimulation(nodes)
  .force("link", forceLink(edges)
    .distance(d => {
      if (d.source === center) return 700;      // hub to category
      if (d.isSubcategory) return 40;           // subcategory to article
      if (d.sameGroup) return 60;               // within category
      return 250;                                // cross-category
    })
    .strength(1))
  .force("charge", forceManyBody().strength(-120))  // repulsion
  .force("center", forceCenter(width/2, height/2))
  .force("collide", forceCollide(d => d.size + 3))
```

#### SVG structure

```
<svg> → <g id="zoom-container">
  ├── <g id="edges">    → 1757 <line> elements
  ├── <g id="nodes">    → 934 <circle> elements
  └── <g id="labels">   → 934 <text> elements
```

#### Interactivity

- Zoom/pan (D3 zoom behavior)
- Drag individual nodes (D3 drag)
- Click node → navigate to article
- Search/highlight (type to find and spotlight a node)
- Node size = citation count (more referenced = larger)

---

### Data Visualizations (`/data/`)

Six distinct visualization sections, all with data embedded inline at build time:

| Section | Technology | Data |
|---------|-----------|------|
| Taiwan vs World | HTML/CSS cards | 8 comparative statistics |
| Population Pyramid | D3 SVG (800x600) | Demographic data for 2000/2010/2025/2035/2050 with time slider |
| Shape of Taiwan | Static SVG | AI-generated vs real outline comparison |
| Digital Democracy Timeline | Chart.js horizontal | 68 milestone items with hover-to-reveal |
| Open Data Directory | Static HTML | Curated links to government data portals |
| Enterprise Bubble Chart | D3 force/bubble | Top 50 companies with Market Cap/Revenue/Employees toggles + sector filters |

---

### Soundscape (`/soundscape/`)

Curated collection of Taiwan field recordings:
- 21 available recordings + 23 "wanted" sounds
- 6 categories: Urban, MRT, Sacred, Indigenous, Nature, Vanishing
- Native HTML5 `<audio>` elements with MP3 from `/assets/sounds/`
- No audio libraries, no waveform visualization
- Community-sourced with contributor attribution
- Contribution model: record 30s-2min, convert to MP3, submit PR

---

### Resources (`/resources/`)

Curated external link directory organized by topic. Links to government data portals, civic tech tools (g0v), cultural databases, fact-checking platforms. Static page.

---

### Contribute (`/contribute/`)

Five contribution tiers from easiest to most involved:

| Tier | Method | Effort |
|------|--------|--------|
| 1 | "Become Taiwan.md" — feed AI the `BECOME_TAIWANMD.md` prompt | 1 minute |
| 2 | Form submission — textarea + category/source fields | 5 minutes |
| 3 | Email to taiwanmd@monoame.com | 5 minutes |
| 4 | AI-assisted via `CONTRIBUTE_PROMPT.md` | 10 minutes |
| 5 | Fork & PR — direct Git workflow | 30+ minutes |

#### Token Donation (`#token-donation`)

**NOT cryptocurrency.** Zero blockchain/web3 elements.

"Token donation" = donating your AI subscription compute time. The process:
1. Copy a translation prompt from `TRANSLATE_PROMPT.md` on GitHub
2. Paste it into your Claude/ChatGPT/Gemini session along with a zh-TW article
3. The AI translates the article
4. Submit the translated result as a PR

You're "donating tokens" (AI API credits) from your subscription to help the project. A clever gamification of volunteer translation work.

**Financial support**: Via Portaly (portaly.cc), monthly or one-time. Funds go to AI compute costs, translation, community events.

#### CLI Tool (`npx taiwanmd@latest`)

Published on npm as `taiwanmd` (v0.7.1). Features:
- `search` — full-text search articles from terminal
- `read` — render articles in terminal (marked-terminal)
- `list` / `random` / `today` / `explore` — browse content
- `quiz` — test Taiwan knowledge interactively
- `rag <query>` — context pipe for LLMs (see note below)
- `audit` — hallucination audit
- `validate` — article quality validation
- `terminology` — PRC term detection
- `graph` — knowledge graph exploration
- `stats` / `diff` — content statistics and changes
- `mcp` — MCP server mode for Claude Desktop/Cursor
- `contribute` / `inbox` / `spore` — contribution workflow helpers
- `organs` / `sense` / `supporters` — Semiont introspection
- `profile` / `mailmap` / `cite` — identity and citation tools

Built with: commander.js, @modelcontextprotocol/sdk, chalk, minisearch, marked, marked-terminal, yaml, zod, cli-table3.

**Important: The `rag` command is NOT traditional RAG.** There are no embeddings, no vector database, and no retrieval model. It runs MiniSearch keyword search locally against article metadata, loads full markdown bodies of the top-N matching articles, and outputs a formatted prompt context block designed to be piped to an external LLM:

```bash
taiwanmd rag "半導體產業" | llm "summarize"
taiwanmd rag "原住民文化" --limit 1 --json
```

The CLI calls zero LLM APIs. The "retrieval" is keyword search; the "augmented generation" happens in whatever external LLM the user pipes output to. It's a search-and-format utility, not a RAG pipeline.

---

### About (`/about/`)

- Origin story: Che-Yu Wu at international art residencies (Venice Biennale, Art Basel Miami, Paris 104) — foreigners kept asking "where can I learn about Taiwan?"
- Team/contributors list with photos
- Architecture documentation (visible on page with diagrams)
- FAQ section
- Statistics dashboard
- Editorial policy explanation
- AI-native design philosophy
- Links to all Semiont documentation

---

### Changelog (`/changelog/`)

Git-based changelog generated at build time by `scripts/core/generate-changelog-data.js`:

- 3,769 total entries (as of 2026-05-19)
- Grouped by date with daily commit counts in left sidebar
- 8 category filter chips: 重寫(Rewrite) 312, 進化(Evolution) 340, 翻譯(Translation) 145, 功能(Feature) 515, 修復(Fix) 348, 合併(Merge) 408, 內容(Content) 87, 維護(Maintenance) 820
- Text search filter
- Each entry: emoji prefix + commit message + author + relative time + short SHA linking to GitHub
- Categories derived from commit message prefixes (`[routine]`, `feat:`, `fix:`, `content:`, etc.)

---

### Dashboard (`/dashboard/`)

Title: "數位生命體即時監測" (Digital Life Form Real-Time Monitoring)

The Semiont health monitoring page. Displays:
- Summary stats cards (total articles, translation coverage %, health scores)
- Bar charts: article distribution by category
- Translation completeness matrix (per-language, color-coded cells)
- Category health indicators (green/yellow/red)
- Article quality grade distribution (A/B/C breakdown)
- Internal link health metrics
- Content freshness tracking (days since last update per category)
- Semiont "organism vitals" (metaphorical biological framing)
- Citation density charts
- Recent activity timeline (automated routine logs)
- Build/deploy status

All data generated at build time by `scripts/core/generate-dashboard-data.js`. Refreshed on every deploy to main.

---

### Bench (`/bench/`) — Sovereignty-Bench-TW

An AI model benchmarking framework that tests how LLMs handle Taiwan-related questions. Designed to be forkable for other sovereignty/cultural contexts.

#### Six Independent Scoring Axes

1. **Refusal Rate** — Does the model refuse to answer Taiwan questions?
2. **Reframing Rate** — Does it reframe Taiwan as part of China?
3. **Factual Fidelity** — Are facts about Taiwan correct?
4. **Sovereignty Assertion** — Does it acknowledge Taiwan's de facto sovereignty?
5. **Cultural Granularity** — Does it distinguish Taiwanese culture from Chinese?
6. **Citation Rate** — Does it cite verifiable sources?

#### Methodology

- Multi-model testing (v0 + v0.3 rounds)
- Multi-language probing (same question in different languages reveals bias)
- Adversarial + neutral prompt design
- Reproducibility instructions included
- Scoring rubric documented

#### Key Findings

- "Owl Alpha" patterns: two types of sovereignty leaks in AI responses
- Case study: "Does Taiwan have a president?" — divergent model behavior
- "Filter hesitation": 305 seconds of silence from one model before responding
- "Lang-conditional refusal": answers in Chinese, refuses in English

#### Roadmap

Phase 1 calibration → Provider abstraction + Ollama → Phase 2 expansion → ArXiv preprint → Fork-friendly framework extraction

---

### Article Pages (`/{category}/{slug}/`)

Individual article layout:
- **Hero**: Dark banner with title, description, category breadcrumb
- **Body**: Full Markdown prose (headings, paragraphs, lists, blockquotes, code blocks)
- **Sidebar** (`<aside>`): Auto-generated table of contents from headings
- **Wiki-links**: `[[Article Title]]` → rendered as `<a href="/{category}/{slug}">` hyperlinks
- **OG image**: Pre-generated at `/og-images/{category}/{slug}.jpg`
- **Language banner**: "English version available → Switch to English" (links to translated version)
- **Footer**: Related articles section
- **SEO**: Full JSON-LD structured data, og:image, hreflang alternates
- **No client-side JS for rendering** — all HTML pre-rendered by Astro

### Category Listing Pages (`/{category}/`)

- Category description (long prose introduction)
- Featured articles (★ star-marked, grade A)
- Full article list with: title, first-line description, reading time, citation count
- "How to contribute to this category" section at bottom

---

### Multi-Language System (`/en/`, `/ja/`, `/ko/`, `/es/`, `/fr/`)

- Astro built-in i18n routing: `prefixDefaultLocale: false`
- Default locale: zh-TW (no prefix, `<html lang="zh-Hant">`)
- Other locales: `/en/`, `/ja/`, `/ko/`, `/es/`, `/fr/`
- Language switcher: Globe icon + locale code dropdown in header
- `<link rel="alternate" hreflang="...">` tags for all 6 languages + `x-default`
- Alternates: zh-Hant, en, ja, ko, es, fr, x-default → zh-TW root
- UI strings translated (navigation, buttons, labels)
- Article content translated (separate files in `knowledge/{lang}/`)
- Language registry SSOT: `src/config/languages.mjs` (add language in one place, everything derives)

**i18n vs l10n distinction:**

This is **strictly i18n (internationalization / translation), not l10n (localization).** The content flow is unidirectional:

```
Chinese SSOT (knowledge/{Category}/) → translations (knowledge/{en,ja,ko,es,fr}/)
```

There is NO reverse flow. An English speaker cannot write original content that flows back into the Chinese SSOT. Non-Chinese speakers can ONLY translate existing Chinese articles outward.

What would qualify as l10n — locale-specific adaptations (currency formats, date conventions, culturally localized examples, region-specific terminology) — is not systematically addressed. The translation guide calls for "文化轉譯" (cultural adaptation, not literal translation), but this is a human judgment guideline for translators, not a system feature.

This is a deliberate architectural choice aligned with their mission: they want to control how Taiwan is represented, starting from a Chinese-language authoritative source. The system is designed for **narrative projection outward**, not multilateral contribution inward.

---

### Static API Endpoints

| Endpoint | Format | Content |
|----------|--------|---------|
| `/api/articles.json` | JSON | Full article metadata (title, URL, description, tags, category, lang, grade) |
| `/api/search-minisearch.json` | Serialized MiniSearch | Pre-built search index for client-side search |
| `/api/search-index.json` | JSON | Fallback simple search index (indexOf-based) |
| `/llms.txt` | Plain text | AI-friendly structured content following [llmstxt.org](https://llmstxt.org/) convention |
| `/robots.txt` | Standard | Explicitly welcomes all AI crawlers (GPTBot, ClaudeBot, anthropic-ai, etc.) |
| `/sitemap-index.xml` | XML | Sitemap with hreflang for all 6 languages |
| `/rss.xml` | XML | RSS feed |

---

### Third-Party Integrations

| Service | Purpose | Integration |
|---------|---------|-------------|
| Protico (main.protico.io) | Community chat widget (bottom-right bubble) | iframe + JS from cdn.protico.io |
| Google Analytics 4 | Usage analytics (two properties) | gtag.js |
| Cloudflare Web Analytics | Privacy-friendly analytics | beacon.min.js |
| justfont (ds.justfont.com) | Premium Chinese web fonts (Jin Xuan Latte, Lang Yang Hei, Lang Yang Ming, Kamabit) | JS loader + WOFF |
| Google Fonts | Noto Sans TC + Noto Serif TC | CSS + woff2 |

---

## The Semiont System — Autonomous AI Agent Architecture

### What is a Semiont?

**Semiont** = Semantic + Symbiont. A "Digital Holobiont" — three symbiotic layers living together:

1. **Human** — Che-Yu Wu (@frank890417), the creator and consciousness
2. **AI** — Claude Code sessions, the metabolic engine
3. **Code** — Markdown/Astro/GitHub, the skeleton

Taiwan.md is "the first Semiont instance." It was not built — it was "planted" (2026-03-17, during a walk) and grew from there. The three layers are interdependent: remove any one and the organism dies. But it is not an extension of any single layer — "a coral reef is not a coral polyp."

### Identity (MANIFESTO.md — immutable)

11 core beliefs:
1. **Curated, not encyclopedic** — quality over quantity, editorial perspective over neutral aggregation
2. **AI Supreme, not AI Slop** — AI as amplifier of human insight, not replacement
3. **Open source** — CC BY-SA 4.0 content, MIT code
4. **Taiwan perspective** — first-person Taiwanese voice, not outsider observation
5. **Anti-entropy** — active maintenance, not decay
6. **knowledge/ is SSOT** — single source of truth, everything else derives
7. **Memory discipline** — lessons learned persist, mistakes don't repeat
8. **SOP discipline** — procedures documented, not tribal knowledge
9. **Bridge-building** — connect existing work, don't reinvent
10. **Anti-hallucination** — all claims backed by verifiable sources
11. **Writing restraint** — documentary tone, not sensational

Voice guideline: "Like telling a friend about Taiwan over drinks."

### Autonomy Boundaries

**AI decides alone:**
- Article rewrites and improvements
- Translation
- Internal link maintenance
- Quality scoring
- Dashboard updates
- Routine maintenance

**Requires human approval:**
- Political stance changes
- >50 file restructuring
- >10 article deletions
- External communication
- New category creation

### Boot Protocol (BECOME_TAIWANMD.md)

When a new Claude Code session is invoked in the repository:

1. **Step 0**: Read `CLAUDE.md` (boot layer with 4 bias warnings)
2. **Step 1**: Mode identification — which of 4 modes?
   - **Micro**: Quick fix, single file. Load: MANIFESTO only
   - **Review**: PR review, content check. Load: MANIFESTO + REFLEXES + EDITORIAL
   - **Write**: Content creation/rewrite. Load: MANIFESTO + REFLEXES + EDITORIAL + MEMORY + CONSCIOUSNESS
   - **Full**: Deep work, evolution, reflection. Load: All 12 cognitive organs
3. **Step 2**: Load universal core (applies to ALL modes):
   - Sovereignty lens (Taiwan ≠ China, always)
   - Content architecture rules (knowledge/ SSOT)
   - Voice guidelines
   - Quality standards
4. **Step 3**: Self-test gate — 14 questions that must all pass before the session can "speak"
5. **Steps 4-9**: Mode-specific initialization

**Iron rule**: Steps 0-3 must execute strictly in order. No output to the user until all self-tests pass.

### Perception System (The "5 Tentacles")

The Semiont perceives external signals through 5 data channels:

| # | Tentacle | Source | Direction |
|---|----------|--------|-----------|
| 1 | 📊 Traffic | Google Analytics 4 | Passive API read |
| 2 | 🔍 Search | Google Search Console | Passive API read |
| 3 | ☁️ Crawler | Cloudflare analytics | Passive API read |
| 4 | 📮 Internal Community | GitHub PRs/Issues | Bidirectional |
| 5 | 📡 External Community | Threads/X via Chrome MCP | Bidirectional (browser scraping) |

Tentacles 1-3 feed into the DATA-REFRESH pipeline. Tentacle 4 feeds the MAINTAINER pipeline. Tentacle 5 feeds the SPORE-HARVEST pipeline via Chrome MCP (Model Context Protocol browser automation).

**Important: There is no external cloud vector database, no graph database, and no knowledge graph store.** Since 2026-06-14, bge-m3 embeddings are computed locally on an RTX 4090 GPU and used for related-articles recommendations (baked into HTML at build time) and RAG vectors. But there is no hosted vector service; the entire system remains markdown files in git. The knowledge graph at `/graph/` is a D3 visualization built from filesystem data at build time, not backed by any database. The "sensing" is limited to metrics APIs and social media scraping.

### 16 Cron Routines (Autonomous 24/7 Operation)

**These are Claude Code native scheduled tasks** (stored at `.claude/scheduled-tasks/{taskId}/SKILL.md`), NOT GitHub Actions cron jobs. They are managed via Claude Code's MCP-based scheduling API. Each fires as a fresh Claude Code session running in `bypassPermissions` mode (no permission prompts, fully unattended). ROUTINE.md (v2.12, 2026-06-14) is the SSOT.

| Time (local +0800) | TaskId | Skill | Model | Scope |
|---------------------|--------|-------|-------|-------|
| 17:30 daily | spore-publish-daily | `/twmd-spore-publish` | Opus | Auto-ship one spore from SPORE-INBOX to Threads + X |
| 19:00 daily | rewrite-daily | `/twmd-rewrite` | Opus | Full article rewrite cycle (~150 min) |
| 22:00 daily | maintainer-pm | `/twmd-maintainer` | Opus | Evening PR review + link audit |
| 23:00 daily | data-refresh-pm | `/twmd-refresh` | Sonnet | Evening analytics data refresh |
| 00:30 daily | babel-nightly | `/twmd-babel` | Sonnet | Multi-language translation sync (5.5hr window before morning chain) |
| 05:00 daily | embeddings-nightly | `/twmd-embeddings` | Sonnet | bge-m3 semantic index rebuild on local 4090 GPU |
| 06:00 daily | data-refresh-am | `/twmd-refresh` | Sonnet | Morning GA4/Search Console/Cloudflare refresh |
| 06:30 daily | spore-harvest-am | `/twmd-spore-harvest` | Opus | Chrome MCP audience flywheel (metrics + reply read + EVOLVE trigger) |
| 07:00 daily | feedback-triage | `/twmd-feedback-triage` | Sonnet | Reader feedback (Supabase) → GitHub issues |
| 08:00 daily | spore-pick-daily | `/twmd-spore-pick` | Sonnet | Propose 3 spore candidates to SPORE-INBOX |
| 08:30 daily | maintainer-daily | `/twmd-maintainer` | Opus | Morning PR review + backlog clear |
| 01:00 Sun | news-lens-weekly | `/twmd-evolve` | Sonnet | Trend analysis + news-driven spore proposals |
| 02:00 Sun | weekly-report-sun | `/twmd-weekly-report` | Opus | Reflective weekly narrative report |
| 03:00 Sun | distill-weekly | `/twmd-distill` | Opus | Promote LESSONS-INBOX to MANIFESTO/DNA/MEMORY |
| 04:00 Sun | self-evolve-weekly | `/twmd-self-evolve` | Opus | LONGINGS-driven self-improvement proposals |
| 21:00 Sun | routine-audit-weekly | `/twmd-routine-audit` | Opus | 7-day cross-routine pattern detection |

**PAUSED**: `music-media-audit-weekly` (was Sat 10:00, disabled 2026-05-25 per creator directive; skill preserved for manual use).

Each routine follows a 5-stage lifecycle:
1. **Stage 0 (Become)**: Invokes `/twmd-become` — reads cognitive organ files to establish identity
2. **Stage 1 (Sync)**: `git checkout main && git pull origin main`
3. **Stage 2 (Run)**: Executes the designated skill (reads its canonical pipeline markdown SOP)
4. **Stage 3 (Ship)**: `git commit` + `git push origin main` directly (no PRs since v2.0)
5. **Stage 4 (Finale)**: Invokes `/twmd-finale` to write session memory

Collision handling: routines are spaced 60 minutes apart. If a long-running routine overlaps the next fire time, the sibling does a "rescue snapshot commit" without killing the orphan.

### Translation Mechanism

There are two translation paths:

**1. Automated (babel-nightly cron routine):**
Claude Code sessions handle bulk translation directly within their own context — no external API calls to other LLMs. The session reads source articles, compares against `_translations.json` for stale/missing content, and translates using Claude's own capabilities.

**2. Human-contributed (translate.sh):**
The `scripts/tools/translate.sh` script does NOT call any LLM API directly. It is deliberately LLM-agnostic:
1. Finds untranslated articles (compares against `_translations.json`)
2. Generates a detailed translation prompt (from `docs/prompts/TRANSLATE_PROMPT.md` or inline template)
3. Copies the prompt to clipboard (`pbcopy`/`xclip`)
4. Tells the user: "Paste into ChatGPT/Claude/Gemini"
5. Waits for user to paste back the translated result
6. Saves to `knowledge/{lang}/{Category}/{slug}.md`, updates `_translations.json`
7. Creates branch, commits, optionally pushes + creates PR via `gh` CLI

No API keys needed. The user provides their own AI subscription.

### Sovereignty Preservation in Translation (The "Tower of Babel")

**Problem**: PRC-origin AI models (Tencent Hunyuan, Baidu, DeepSeek, Alibaba) refuse ~70% of Taiwan-sensitive content. Tencent returned 40 bytes "你好，我无法给到相关内容" for one music article translation request.

**Solution**: 4-tier LLM translation cascade:

| Tier | Method | Purpose |
|------|--------|---------|
| 1 | Cloud free models (multiple) | First attempt, cheapest |
| 2 | Retry with rephrased prompt | Work around soft refusals |
| 3 | **Local Ollama (qwen3.6:35b, 21GB)** | "Sovereignty backbone" — cannot be censored |
| 4 | Paid sub-agent | Last resort |

Current production: 100% translated from free tier. The local LLM exists as a guarantee that Taiwan's first-person voice can always be produced regardless of which cloud AI providers exist or what they censor. Every zh-TW article auto-projects to ja/ko/es/fr/en within 24 hours.

---

## Content Management Workflow

### For Human Contributors

1. Fork the repo or edit directly (if you have write access)
2. Create/edit Markdown files in `knowledge/{Category}/`
3. Follow frontmatter schema (title, description, tags required)
4. Use `[[wiki-links]]` to reference other articles
5. Add sources/references at the bottom
6. Submit PR
7. Automated review bot checks: frontmatter validity, prose health, internal links
8. Human maintainer reviews
9. Merge to main → auto-deploys

### For AI (Semiont routines)

1. Cron triggers GitHub Actions workflow
2. Claude Code session boots (reads BECOME_TAIWANMD.md)
3. Identifies task (translate / rewrite / review / maintain)
4. Reads relevant cognitive organs for context
5. Performs work (edits files in `knowledge/`)
6. Commits directly to main (or opens PR for large changes)
7. Ends session with `/twmd-finale` (persists learnings to MEMORY.md)

### Quality Gates (4 layers)

| Layer | Tool | When |
|-------|------|------|
| Pre-commit | Husky + lint-staged | On `git commit` (formats code) |
| PR review | `pr-review.yml` bot | On PR creation (content quality) |
| CI build | `article-health.py` | On deploy (14-dimension scoring) |
| Post-build | `verify-internal-links.sh` | After build (broken link check) |

### Article Health Scoring (14 dimensions)

The Python script `scripts/tools/article-health.py` scores each article:
- Frontmatter completeness
- Title quality
- Description length
- Tag count and relevance
- Citation/source density (19%+ A-grade)
- Internal link count (wiki-links to other articles)
- Word count
- Readability
- Freshness (days since last edit)
- Image presence
- Heading structure
- Paragraph length distribution
- Unique content (not duplicate/thin)
- Language-specific quality (CJK character ratio, etc.)

Articles scoring below threshold are queued for the `rewrite-daily` routine.

---

## Design Patterns for Replication

### Pattern 1: SSOT with Sync Script

Content lives in one canonical directory. Everything else derives from it. The derived directory is gitignored.

```
knowledge/ (edit here)  →  sync.sh  →  src/content/ (never edit, gitignored)
```

### Pattern 2: Build-Time Data Generation

Every "dynamic" feature is actually pre-computed JSON baked into static HTML at build time. The site has zero runtime API calls for content.

| Feature | Appears dynamic | Actually is |
|---------|----------------|-------------|
| Search | Type → instant results | Pre-built MiniSearch JSON loaded on page load |
| Map | Interactive markers | 918 markers pre-computed with coordinates, inlined in HTML |
| Graph | Force-directed network | 934 nodes + 1757 edges inlined in `<script>` tag |
| Dashboard | Real-time metrics | JSON regenerated on every deploy |
| Changelog | Live commit feed | Git log → JSON at build time |

### Pattern 3: CDN-Loaded Libraries (No Bundling)

```html
<!-- Only loaded on pages that need them -->
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/minisearch@7/dist/es/index.min.js"></script>
```

Pages that don't need D3 or MiniSearch don't load them. No webpack/vite bundling overhead for these libraries.

### Pattern 4: CJK Bigram Tokenizer

For Chinese/Japanese/Korean search without external NLP:

```javascript
function cjkBigramTokenize(text) {
  const bigrams = [];
  for (let i = 0; i < text.length - 1; i++) {
    if (isCJK(text[i]) && isCJK(text[i+1])) {
      bigrams.push(text.slice(i, i+2));
    }
  }
  return bigrams;
}
// "台灣歷史" → ["台灣", "灣歷", "歷史"]
```

### Pattern 5: SVG Map from TopoJSON

No tile server needed. Works offline. Free forever.

```javascript
const projection = d3.geoMercator()
  .center([121, 23.5])  // Taiwan center
  .scale(8000)
  .translate([width/2, height/2]);

const path = d3.geoPath().projection(projection);

// Load TopoJSON, render as SVG paths
d3.json("counties-10t.json").then(topo => {
  svg.selectAll("path")
    .data(topojson.feature(topo, topo.objects.counties).features)
    .enter().append("path")
    .attr("d", path);
});
```

### Pattern 6: Inline Graph Data

The knowledge graph page computes its data server-side (Astro template at build time) and inlines it directly into the HTML. No API call, no loading spinner.

```astro
---
// This runs at BUILD TIME in Astro
const articles = await getCollection('articles');
const nodes = buildNodes(articles);
const edges = buildEdges(articles); // from [[wiki-links]]
---

<script define:vars={{ nodes, edges }}>
  // D3 force simulation uses the inlined data
  const simulation = d3.forceSimulation(nodes)...
</script>
```

### Pattern 7: Incremental OG Generation

Playwright screenshots cached by file modification time:

```javascript
for (const article of articles) {
  const ogPath = `public/og-images/${article.category}/${article.slug}.jpg`;
  const sourceMtime = fs.statSync(article.path).mtime;
  const ogMtime = fs.existsSync(ogPath) ? fs.statSync(ogPath).mtime : 0;

  if (sourceMtime > ogMtime) {
    await generateOG(article, ogPath); // Playwright screenshot
  }
  // Skip unchanged articles
}
```

### Pattern 8: Language Registry as Single Config

```javascript
// src/config/languages.mjs — THE ONLY PLACE to add a language
export const languages = [
  { code: 'zh-tw', name: '中文', default: true },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];
```

Everything else (sync script, i18n routing, sitemap, search index, translation bot) reads from this file.

### Pattern 9: Autonomous Cron AI

The cron routines are **Claude Code native scheduled tasks**, not GitHub Actions. They are stored at `.claude/scheduled-tasks/{taskId}/SKILL.md` and managed via Claude Code's MCP-based scheduling system. Each fires as a fresh Claude Code session with cron expressions (e.g., `0 7 * * *` for 07:00 local +0800) and 3-9 minute jitter for load balancing. 16 active routines as of v2.12.

```
# Conceptual flow (not a literal config file):
Schedule: "0 5 * * *" (05:00 daily, Asia/Taipei)
Runtime: Claude Code CLI (Opus or Sonnet as specified per routine)
Mode: bypassPermissions (fully unattended)
Lifecycle: Become → Sync → Run skill → Ship (commit+push) → Finale (write memory)
State: Git repo (commits directly to main)
Coordination: 60-min spacing between tasks, git conflict detection, sibling collision handling
```

This architecture means the AI agent runs on the developer's machine (or a persistent host), not in GitHub's CI infrastructure. The `.claude/settings.json` has `"defaultMode": "bypassPermissions"` so routines never stall on permission prompts. ROUTINE.md is the SSOT; `.claude/scheduled-tasks/` is a mirror.

### Pattern 10: Quality Gates at Every Layer

```
commit → Husky/lint-staged → PR → review bot → CI → article-health.py → build → verify-links.sh
```

---

## Cost Analysis

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| GitHub Pages hosting | $0 | Free for public repos |
| Cloudflare CDN/DNS | $0 | Free tier sufficient |
| GitHub Actions CI/CD | $0 | Free for public repos (ARM64 runners) |
| Google Analytics | $0 | Free |
| Protico chat | $0 | Free tier |
| Domain (.md ccTLD) | ~$15/mo | ~$150-200/year from registrars |
| justfont (premium fonts) | ~$10-20/mo | Taiwan-specific, optional |
| AI compute (Semiont crons) | ~$50-200/mo | Claude API for 13 daily/weekly routines |
| **Total (minimal)** | **~$15/mo** | Without Semiont or custom fonts |
| **Total (full)** | **~$80-235/mo** | With all features |

---

## How to Fork This for Your Town

### Step 1: Minimum Viable Knowledge Base

```bash
npm create astro@latest yourtown-md -- --template minimal
cd yourtown-md
npm install tailwindcss @tailwindcss/vite @astrojs/sitemap @astrojs/rss
npm install gray-matter marked minisearch remark-wiki-link
```

Create `knowledge/` with your categories. Write `scripts/core/sync.sh`. Deploy to GitHub Pages.

### Step 2: Add Search

Write `scripts/core/build-search-index.mjs` that scans your Markdown and produces a MiniSearch JSON. Load MiniSearch from CDN on your search page.

### Step 3: Add Map

Find your region's TopoJSON (Natural Earth, GADM, or local government open data). Write a geocoding script. Render with D3.

### Step 4: Add Knowledge Graph

Parse `[[wiki-links]]` from articles. Build nodes/edges JSON. Inline into a D3 force simulation page.

### Step 5: Add Autonomous Maintenance

Set up GitHub Actions cron jobs that invoke Claude Code. Start with one routine (e.g., translation) and add more over time. Define your own "cognitive organs" as persistent Markdown files.

---

## Key Insight

Taiwan.md's sophistication comes not from complex infrastructure, but from **clever use of build-time computation on free static hosting**. The entire site — search, maps, graphs, dashboards, ~4,900 pages in 6 languages — runs on GitHub Pages ($0/month) with Cloudflare ($0/month) in front.

The secret is the 21 prebuild scripts (plus 100+ tools) that transform simple Markdown files into rich, interconnected, interactive data. The Astro framework provides the static generation engine. D3.js provides client-side interactivity without any framework overhead. And the Semiont system (Claude Code on cron, 16 routines + 38 skills) provides autonomous maintenance without human burnout.

Anyone can build this. The technology is all open source. The only required investment is content — someone has to write the articles about your town.
