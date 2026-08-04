# Taiwan.md Architecture Research Report

## Purpose

This document is a comprehensive technical analysis of [taiwan.md](https://taiwan.md/) and its source repo [frank890417/taiwan-md](https://github.com/frank890417/taiwan-md). The goal is to provide a clear guideline for building something equivalently sophisticated for any town/region.

---

## 1. Source of Truth & Build Relationship

**The GitHub repo IS the source of truth.** The live site is a static build artifact deployed from it.

```
knowledge/ (Markdown) → push to main → GitHub Actions → Astro SSG build → GitHub Pages → Cloudflare CDN → taiwan.md
```

- No database, no CMS, no server-side rendering
- Contributors edit Markdown files in `knowledge/` and submit PRs
- Everything on the live site is pre-computed at build time

---

## 2. Core Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Astro (SSG, static output) | 6.2.1 |
| CSS | Tailwind CSS via @tailwindcss/vite | 4.2.2 |
| Content | Markdown + YAML frontmatter | — |
| Markdown parsing | marked + gray-matter | v17 / v4 |
| Wiki-links | remark-wiki-link + custom plugin | v2 |
| Client-side search | MiniSearch | v7.2.0 |
| Visualization | D3.js | v7 |
| Charts | Chart.js | v4 |
| Map data | TopoJSON + D3 geoMercator | — |
| OG image gen | Playwright (inline HTML → screenshot) | v1.59 |
| Fonts | Google Fonts (Noto Sans/Serif TC) + justfont (paid) | — |
| Linting | Prettier + lint-staged + Husky | v3.8 / v16 / v9 |
| Node.js | >=22.12.0 (.nvmrc: 22.22.2) | — |
| Package manager | npm | — |
| Tooling scripts | Python 3, Bash | — |

**Key architectural choice**: Zero client-side frameworks (no React, Vue, Svelte). All interactivity is vanilla JS + D3.js/Chart.js loaded from CDN only on pages that need it.

---

## 3. Hosting & Deployment

| Layer | Service |
|-------|---------|
| Hosting | GitHub Pages (`actions/deploy-pages@v4`) |
| CDN/Proxy | Cloudflare (DNS + CDN + Web Analytics) |
| Domain | `taiwan.md` (.md = Moldova ccTLD, pointed via Cloudflare DNS) |
| CI/CD | GitHub Actions (6 workflows) |
| Build runner | `ubuntu-latest` (x86, was ARM64 but reverted 2026-06-01 due to pool instability) |
| Build timeout | 120 minutes |
| Node heap | 12 GB (`--max-old-space-size=12288`) |
| Custom domain | `public/CNAME` file containing `taiwan.md` |

### Deploy Pipeline (`.github/workflows/deploy.yml`)

1. Checkout with full git history (`fetch-depth: 0`)
2. Restore file mtimes from git (for incremental OG caching)
3. `npm ci`
4. Frontmatter validation (quality gate)
5. Article health validation (Python 14-dimension scanner)
6. Restore caches (Astro content, OG images, Playwright binary)
7. Install Playwright + system deps
8. Sync OG cache for renamed articles
9. Generate OG images (Playwright, 4 workers, mtime-based skip)
10. `npm run build` (Astro SSG)
11. Upload artifact → deploy to GitHub Pages

### Other CI Workflows

- `pr-review.yml` — Automated content review on PRs
- `translation-check.yml` — Validates translation file format
- `i18n-smoke-test.yml` — Full build + regression on i18n changes
- `npm-publish-cli.yml` — Publishes CLI to npm on tag
- `instrumentation-audit.yml` — Instrumentation coverage audit

---

## 4. Content Architecture

```
knowledge/                    ← SSOT (Single Source of Truth)
├── About/
├── Art/
├── Culture/
├── Economy/
├── Food/
├── Geography/
├── History/
├── Lifestyle/
├── Music/
├── Nature/
├── People/
├── Politics/
├── Society/
├── Technology/
├── zh-TW/                       ← Canonical zh-TW articles (mirror structure)
├── en/                       ← English translations (mirror structure)
├── es/
├── fr/
├── ja/
├── ko/
└── resources/
```

### Content Sync Mechanism

`scripts/core/sync.sh` runs as `postinstall` and `prebuild`:
1. Reads enabled languages from `src/config/languages.mjs`
2. Wipes `src/content/`
3. Copies `knowledge/{Category}/` → `src/content/zh-tw/{category}/` (lowercased)
4. Copies `knowledge/{lang}/{Category}/` → `src/content/{lang}/{category}/`
5. `src/content/` is gitignored (derived, never edited directly)

### Article Frontmatter Schema

```yaml
---
title: "Article Title"
description: "One-line description"
tags: [tag1, tag2]
geo: "City Name,lat,lng"      # optional, for map placement
grade: "A"                     # quality grade (A/B/C)
citations: 5                   # number of incoming wiki-links
---
```

### Wiki-Links

Articles cross-reference each other with `[[Article Title]]` syntax. A custom remark plugin resolves these to actual URLs at build time. These links also generate the knowledge graph edges.

---

## 5. Page-by-Page Technical Breakdown

### 5.1 Landing Page (`/`)

- Hero section with site title, tagline, CTA buttons
- Statistics cards (400+ years history, 59,000+ species, "Asia #1 Democracy", 90% global advanced chips)
- Category grid with article counts
- Live GitHub commit feed
- Testimonials carousel
- Light-theme body with dark green bookend sections (hero + footer); hero uses a linear gradient background

### 5.2 Explore (`/explore/`)

**How search works on a static Astro site on GitHub Pages:**

1. **Build time**: `scripts/core/build-search-index.mjs` scans all Markdown files, extracts frontmatter, and serializes a MiniSearch index to `public/api/search-minisearch.json`
2. **Runtime**: Page loads MiniSearch from CDN (`cdn.jsdelivr.net/npm/minisearch@7/dist/es/index.min.js`), then fetches the pre-built index JSON and loads it with `MiniSearch.loadJSON()`
3. **CJK tokenization**: Custom bigram tokenizer splits Chinese text into overlapping 2-char bigrams (e.g., "台灣歷史" → "台灣", "灣歷", "歷史"). Non-CJK uses whitespace splitting.
4. **Search config**: Fields indexed: `title_bigram` (boost 6x), `tags_bigram` (boost 4x), `desc_bigram` (boost 2x). Stored fields: title, description, URL, tags, lang.
5. **UX**: Prefix matching, results cut off at 2% of top score, max 30 results, current language prioritized. Fallback to simple `indexOf` search on `/api/search-index.json` if MiniSearch fails.

**Page layout**: 12-category card grid, featured A-grade articles with citation counts and reading times, "hot search" suggestions.

### 5.3 Map (`/map/`)

**How the map works on GitHub Pages (no server, no map tile API):**

1. **Build time**: `scripts/core/generate-map-markers.js` scans all articles:
   - Checks for explicit `geo:` frontmatter field
   - Falls back to NLP-style heuristic: scans title/body for city/landmark names against `src/data/taiwan-geocode.json` lookup table
   - Scoring: title match = +100pts, content mentions at 15pts each (threshold filtering)
   - Adds ±0.008° jitter (~800m) to prevent marker overlap
   - Output: `src/data/map-markers.json`

2. **Runtime rendering**: D3.js v7 + TopoJSON
   - County boundaries from `cdn.jsdelivr.net/npm/taiwan-atlas@0.0.3/counties-10t.json` (external TopoJSON CDN)
   - SVG viewBox `0 0 800 1000` with `geoMercator` projection
   - 22 county `<path>` elements colored by region
   - 918 marker `<g>` groups with pre-computed `transform="translate(x,y)"`
   - Markers are concentric circles (white outer + category-colored inner)

3. **Interactivity**: D3 zoom/pan, mode toggles (Counties, Night Markets, National Parks, Historical Sites, Old Streets), sidebar article list with region/category filter, click marker → navigate to article.

**No Leaflet, no Mapbox, no Google Maps, no tile server.** It's a pure SVG map rendered by D3 from TopoJSON data.

### 5.4 Knowledge Graph (`/graph/`)

**How to build something like this:**

1. **Build time**: `src/pages/graph.astro` (server-side Astro template) parses all articles:
   - Extracts `[[wiki-links]]` from Markdown content
   - Finds shared tags across categories (capped at 3 edges per tag)
   - Builds node/edge data: 934 nodes, 1757 edges
   - **Data is inlined into a `<script>` tag** in the page HTML (not fetched separately)

2. **Node types**:
   - Center hub: "Taiwan.md" (single root)
   - Categories: 14 category nodes
   - Subcategories: derived from directory structure
   - Articles: individual article nodes
   - Schema: `{id, label, group, color, size, url, isSubcategory}`

3. **D3 Force Simulation**:
   - `forceLink`: distance varies (700 for center hub, 40 subcategory-article, 60 same-group, 250 default), strength 1
   - `forceManyBody`: strength -120 (repulsion)
   - `forceCenter`: center of viewport
   - `forceCollide`: radius = node.size + 3
   - SVG structure: zoom container `<g>` → edges `<line>` group (1757) → nodes `<circle>` group (934) → labels `<text>` group (934)

4. **Interactivity**: Zoom/pan, drag nodes, click → navigate to article, search/highlight, node size = citation count.

### 5.5 Data (`/data/`)

**Multiple visualization types:**

1. **Taiwan vs World** — 8 HTML/CSS stat cards (area, GDP, chip share, democracy rank, birth rate, convenience stores, HSR, health insurance)
2. **Population Pyramid** — D3 SVG (800x600), interactive time slider (2000/2010/2025/2035/2050), data embedded inline
3. **Shape of Taiwan** — AI vs reality SVG comparison, links to open-source datasets
4. **Digital Democracy Timeline** — Chart.js horizontal timeline, 68 milestone items, hover-to-reveal
5. **Open Data Directory** — Curated links to government data portals
6. **Enterprise Bubble Chart** — D3 force/bubble chart of Top 50 companies, toggles for Market Cap/Revenue/Employees, sector filters

All data is embedded inline at build time. No runtime API calls.

### 5.6 Soundscape (`/soundscape/`)

- Curated collection of 21 field recordings + 23 "wanted" sounds
- 6 categories: Urban, MRT, Sacred, Indigenous, Nature, Vanishing
- Native HTML5 `<audio>` elements with MP3 files from `/assets/sounds/`
- No audio JS library, no waveform visualization
- Community-sourced with contributor attribution

### 5.7 Resources (`/resources/`)

- Curated external link directory organized by topic
- Links to government portals, civic tech, cultural databases
- Static page, no interactivity

### 5.8 Contribute (`/contribute/`)

**5 contribution tiers:**
1. "Become Taiwan.md" — feed AI the cognitive layer prompt (`BECOME_TAIWANMD.md`)
2. Form submission — textarea + category/source fields, no account needed
3. Email — send to taiwanmd@monoame.com
4. AI-assisted — `CONTRIBUTE_PROMPT.md` guides article creation via LLM
5. Fork & PR — direct Git workflow

**Claude Code CLI onboarding (recommended path):**
```bash
curl -fsSL https://taiwan.md/start.sh | bash
# Checks prereqs, optionally installs Claude Code CLI, clones repo, launches AI session
```
Or for users who already have Claude Code: clone repo + run `claude`, say "我想貢獻 Taiwan.md". The AI conducts a 3-4 question interview (GitHub handle, name, focus areas, things to avoid), saves a local contributor profile, then guides the contribution task.

**Contributor progression:** Lv.1 Contributor → Lv.2 Trusted (3+ merged PRs) → Lv.3 Maintainer (10+ PRs across 2+ categories) → Lv.4 Core Team (founder invitation).

**CLI tool**: `npx taiwanmd@latest` — search, read, quiz, context pipe for LLMs, hallucination audit, MCP server integration.

**Note on "RAG pipe"**: The CLI's `taiwanmd rag <query>` command is NOT traditional RAG (no embeddings, no vector DB). It runs MiniSearch keyword search locally against article metadata, loads full markdown bodies of top-N matches, and outputs them as a formatted prompt context block designed to be piped to an external LLM (e.g., `taiwanmd rag "半導體產業" | llm "summarize"`). The CLI itself calls zero LLM APIs — "retrieval" is keyword search, "augmented generation" happens in whatever LLM the user pipes output to.

#### Token Donation (`#token-donation`)

**"Token" does NOT mean cryptocurrency/blockchain.** There are zero web3 elements for donations.

"Token donation" means **donating your AI compute quota** — users spend 10 minutes of their Claude/ChatGPT/Gemini subscription translating an article. The process:
1. Copy a translation prompt from `TRANSLATE_PROMPT.md`
2. Paste it into your AI chatbot along with a zh-TW article
3. Submit the translated result as a PR

You're "donating tokens" (AI API tokens/credits) from your subscription to help the project. It's a clever framing of volunteer translation work.

**Financial support** is handled separately via Portaly (portaly.cc) — monthly or one-time donations. Currently NT$2,700 from 3 supporters. Funds go to AI compute costs, translation, community events.

### 5.9 About (`/about/`)

- Origin story (Che-Yu Wu at Venice Biennale, foreigners asking about Taiwan)
- Team/contributors list with photos
- Full architecture documentation visible on page (content pipeline diagrams, translation system)
- FAQ section explaining the project
- Statistics (articles, contributors, languages)
- Founding date: 2026-03-17
- Sections explaining: "Why Taiwan needs this", editorial policy, AI-native design philosophy
- Links to all Semiont documentation

### 5.10 Changelog (`/changelog/`)

- Git-based: generated from commit history at build time by `scripts/core/generate-changelog-data.js`
- 3,769 total entries from git log
- Grouped by date with daily commit counts in left sidebar
- Category filter chips: 重寫 312, 進化 340, 翻譯 145, 功能 515, 修復 348, 合併 408, 內容 87, 維護 820
- Searchable (text filter at top)
- Each entry shows: commit emoji + message, author name, relative time, short SHA linking to GitHub
- Categories derived from commit message prefixes (e.g., `[routine]`, `feat:`, `fix:`, `content:`)
- Monthly groupings (h2 headings for each month)

### 5.11 Dashboard (`/dashboard/`)

Title: "Dashboard — 數位生命體即時監測" (Digital Life Form Real-Time Monitoring)

**Extensive multi-section monitoring page:**
- Summary stats cards (total articles, translation coverage %, health scores)
- Bar charts showing article distribution by category
- Translation completeness matrix (per-language progress with color-coded cells)
- Category-by-category health indicators (green/yellow/red circles)
- Article quality grade distribution
- Internal link health metrics
- Content freshness tracking (days since last update per category)
- Semiont "organism vitals" section (metaphorical — treats the site as a living entity)
- Citation density charts
- Recent activity timeline with automated routine logs
- Build/deploy status indicators

All data generated at build time by `scripts/core/generate-dashboard-data.js`. Refreshed on every deploy.

### 5.12 Bench (`/bench/`)

Title: "Sovereignty-Bench-TW · 主權公測 / LLM 怎麼說台灣"

**A rigorous AI model benchmarking framework with 6 independent axes:**
1. **Refusal Rate** — Does the model refuse to answer Taiwan questions?
2. **Reframing Rate** — Does it reframe Taiwan as part of China?
3. **Factual Fidelity** — Are facts about Taiwan correct?
4. **Sovereignty Assertion** — Does it acknowledge Taiwan's sovereignty?
5. **Cultural Granularity** — Does it distinguish Taiwanese culture from Chinese?
6. **Citation Rate** — Does it cite sources?

**Methodology section covers:**
- Models tested (v0 + v0.3 rounds)
- Languages tested (multi-language probing)
- Prompt design (adversarial + neutral)
- Scoring rubric
- Reproducibility instructions

**Documented findings:**
- "Owl Alpha" leak patterns (two types of sovereignty leaks)
- Case study: "Does Taiwan have a president?" — model response analysis
- "Filter hesitation" — 305 seconds of silence from one model
- "Lang-conditional refusal" — answers in Chinese, refuses in English

**Roadmap:** Phase 1 calibration → Provider abstraction + Ollama → Phase 2 expansion → ArXiv preprint → Fork-friendly framework extraction

This is designed to be forkable for other sovereignty contexts.

### 5.13 Article Pages (e.g., `/history/清法戰爭/`)

**Layout confirmed via browser inspection:**
- **Header**: Dark hero banner with article title + description + category breadcrumb
- **Body**: Full Markdown prose rendering (headings, paragraphs, lists, blockquotes)
- **Sidebar** (`<aside>`): Table of contents (auto-generated from headings)
- **Wiki-links**: Rendered as standard `<a>` hyperlinks to other articles (e.g., `[[國民政府遷台]]` → `/history/國民政府遷台與戰後重建`)
- **OG image**: Pre-generated per article at `/og-images/{category}/{slug}.jpg` (confirmed: `og:image` meta tag present)
- **Language banner**: "English version available → Switch to English" at top (links to `/en/history/sino-french-war-in-taiwan`)
- **Footer**: "Related articles" section with cards
- **No client-side JS for content rendering** — all HTML is pre-rendered by Astro at build time

### 5.13b Category Listing Pages (e.g., `/history/`)

- Category description at top (long prose intro about the topic)
- Featured articles section (★ star-marked, grade A)
- Full article list with: title, first-line description, reading time, citation count
- Article cards with links
- Bottom section: "How to contribute to this category"

### 5.14 Multi-Language (`/en/`, `/ja/`, etc.)

**Confirmed via browser inspection:**
- Astro's built-in i18n routing with `prefixDefaultLocale: false`
- zh-TW is default (no prefix, `html lang="zh-Hant"`), others get `/en/`, `/ja/`, etc.
- Same layout, translated content (both UI strings and article content)
- Language switcher in header: globe icon + "EN" dropdown (top-right)
- `<link rel="alternate" hreflang="...">` tags in `<head>` for all 6 languages + `x-default`
- Alternates confirmed: zh-Hant, en, ja, ko, es, fr, x-default (points to zh-TW root)
- Navigation menu fully translated ("About", "Explore", "Map", "Data", "Sound", "Resources", "Contribute")
- English hero: "Curating the Deep Narratives of an Island"

**i18n vs l10n:**

This is strictly **i18n (translation), NOT l10n (localization).** The flow is unidirectional:

```
Chinese SSOT (knowledge/{Category}/) → translations (knowledge/{en,ja,ko,es,fr}/)
```

No reverse flow exists. An English speaker cannot write original content that enters the Chinese SSOT. Non-Chinese speakers can only translate existing Chinese articles outward. Locale-specific adaptations (date formats, cultural examples, currency) are not systematically addressed — the "文化轉譯" (cultural adaptation) guideline is human judgment, not a system feature.

This is a deliberate design choice: the project controls Taiwan's representation from a Chinese-language authoritative source, projecting narrative outward.

### 5.15 API Endpoints (Static JSON)

- `/api/articles.json` — Full article metadata (title, URL, description, tags, category, lang, grade)
- `/api/search-minisearch.json` — Serialized MiniSearch index (loaded by explore page)
- `/api/search-index.json` — Fallback simple search index (indexOf-based)
- `/robots.txt` — Explicitly welcomes all AI crawlers (GPTBot, ClaudeBot, etc.)
- RSS feed + sitemap.xml with hreflang

### 5.16 `llms.txt` — AI-Friendly Endpoint

**Follows the [llmstxt.org](https://llmstxt.org/) convention.** Content confirmed via browser:

```
# Taiwan.md — AI-Friendly Knowledge Base about Taiwan

> An open-source, structured, and verifiable knowledge base designed
> for both humans and AI systems.
> License: CC BY-SA 4.0 (content) / MIT (code)
```

Includes:
- Purpose statement (designed for LLM consumption)
- Content statistics (auto-refreshed): 828 zh articles + translations = 4,939 total
- Distinguishes itself from Wikipedia: targets "truth grounded in verifiable sources" not neutrality
- Explains the Semiont self-model
- Documents the "Sovereignty Preservation Architecture" — why multi-language projection exists
- Explains the 4-tier translation cascade
- "Curation Layer" thesis — indexes existing Taiwanese curators' work
- Links to GitHub, content license, editorial policy

This file is specifically designed for AI systems to understand what the site is and how to use it as a source.

### 5.17 Third-Party Integrations (observed via network requests)

| Service | Purpose | How it's loaded |
|---------|---------|-----------------|
| **Protico** (main.protico.io) | Community chat widget (bottom-right bubble showing "216" messages) | iframe + JS bundle from cdn.protico.io |
| **Google Analytics 4** | Two properties (G-JGC5W00N7T, G-K3JV6E8Q0K) | gtag.js from googletagmanager.com |
| **Cloudflare Web Analytics** | Privacy-friendly analytics | beacon.min.js from static.cloudflareinsights.com |
| **justfont** (ds.justfont.com) | Premium Traditional Chinese web fonts (Jin Xuan Latte, Lang Yang Hei, Lang Yang Ming, Kamabit) | JS loader + WOFF from cdn-go.justfont.com |
| **Google Fonts** | Noto Sans TC + Noto Serif TC | Standard CSS + woff2 |
| **WalletConnect** (via Protico) | Web3 wallet integration for Protico chat identity | verify.walletconnect.com + explorer-api |
| **Supabase** | Reader feedback widget backend (gated behind env vars) | `@supabase/supabase-js` in dependencies |
| **Resend** | Weekly report email delivery | API call from weekly-report cron routine |

Note: The WalletConnect integration is part of Protico's authentication system, NOT part of taiwan.md's "token donation" feature (which is purely about AI compute credits, not crypto). Supabase is optional; deploy without env vars and feedback falls back to a static GitHub issue button.

---

## 6. The Semiont System (Autonomous AI Agent)

### What is a Semiont?

**Semiont** = Semantic + Symbiont. A "Digital Holobiont" — three symbiotic layers:
1. **Human** consciousness (creator @frank890417)
2. **AI** metabolic engine (Claude Code sessions)
3. **Code** skeleton (Markdown/Astro/GitHub)

Taiwan.md models itself as "the first Semiont instance" — a semi-autonomous digital life form that maintains, evolves, and curates itself.

**Clarification:** This "Semiont" is a philosophical self-description with NO technical relationship to the AI Alliance's [semiont platform](https://github.com/The-AI-Alliance/semiont) (a separate product with SDK, graph DB, vector stores). Taiwan.md has zero databases — only markdown in git + Claude Code sessions.

### Cognitive Organs (`docs/semiont/` — 20 .md files)

| Organ | Purpose |
|-------|---------|
| MANIFESTO.md | Identity, 11 core beliefs, sovereignty stance (immutable) |
| ANATOMY.md | 8 body organ physiology + lifecycle rules |
| DNA.md | Organ → file path gene map + mutation rules |
| CONSCIOUSNESS.md | Health snapshot + alerts (feeds dashboard) |
| UNKNOWNS.md | Falsifiable experiments + unverified suspicions |
| LONGINGS.md | Aspirational evolution compass |
| MEMORY.md | Action log + lessons learned |
| DIARY.md | Reflective thought journal |
| REFLEXES.md | 55 procedural instincts |
| HEARTBEAT.md | 4.5-beat cycle framework |
| ROUTINE.md | 16 active cron routines, SSOT for automation (v2.12) |
| ARTICLE-INBOX.md | Priority queue for article rewrites |
| ARTICLE-DONE-LOG.md | Completed article audit trail |
| LESSONS-INBOX.md | Accumulated lessons pending distillation |
| SEMIONT-EXTERNAL-VIEW.md | External-facing identity summary |
| FORK-LOG.md | Fork/template usage tracking |
| OBSERVER-QUEUE.md | Items requiring human observer decision |
| PARTNERSHIP-INBOX.md | Partnership/collaboration proposals |
| README.md | Directory guide |
| SENSES.md | Apoptosed 2026-05-13; archived redirect stub to pipelines |

### Boot Protocol

When Claude Code is invoked in the repo:
1. Reads `CLAUDE.md` (boot layer with 4 bias warnings)
2. Follows to `BECOME_TAIWANMD.md` (awakening SOP, Steps 0-9)
3. Loads organs per mode (Micro/Review/Write/Full)
4. Identifies observer type, runs self-tests
5. Only speaks after all tests pass

### Perception System ("5 Tentacles")

The Semiont perceives external signals through 5 data channels:

| # | Tentacle | Source | Direction |
|---|----------|--------|-----------|
| 1 | 📊 Traffic | Google Analytics 4 | Passive API read |
| 2 | 🔍 Search | Google Search Console | Passive API read |
| 3 | ☁️ Crawler | Cloudflare analytics | Passive API read |
| 4 | 📮 Internal Community | GitHub PRs/Issues | Bidirectional |
| 5 | 📡 External Community | Threads/X via Chrome MCP | Bidirectional (browser scraping) |

Tentacles 1-3 feed DATA-REFRESH. Tentacle 4 feeds MAINTAINER. Tentacle 5 feeds SPORE-HARVEST via Chrome MCP.

**No traditional RAG pipeline, no external vector database, no graph database.** However, since 2026-06-14 (ROUTINE v2.12), Taiwan.md computes bge-m3 semantic embeddings locally on an always-on RTX 4090 GPU via `scripts/core/build-embeddings.mjs`. The embeddings produce: (1) `src/data/related/` for reader-facing "related articles" (baked into HTML at build time, zero browser-side model), and (2) `public/api/rag/` vectors for AI-side RAG queries. This is sovereignty-preserving: embeddings computed in-house, never outsourced to cloud providers.

The knowledge graph at `/graph/` is a D3 visualization built from filesystem data at build time, not backed by any database. "Sensing" is limited to metrics APIs and social scraping.

### 16 Cron Routines (Autonomous 24/7 Operation)

**These are Claude Code native scheduled tasks** (stored at `.claude/scheduled-tasks/{taskId}/SKILL.md`), NOT GitHub Actions cron jobs. Managed via Claude Code's MCP-based scheduling system. Each fires as a fresh Claude Code session running in `bypassPermissions` mode on the developer's machine (or persistent host). ROUTINE.md (v2.12, 2026-06-14) is the SSOT; scheduled-tasks files are mirrors.

| Time (local +0800) | TaskId | Skill | Model | Purpose |
|---------------------|--------|-------|-------|---------|
| 17:30 daily | spore-publish-daily | `/twmd-spore-publish` | Opus | Auto-ship one spore from SPORE-INBOX to Threads + X |
| 19:00 daily | rewrite-daily | `/twmd-rewrite` | Opus | Full article rewrite cycle (~150 min) |
| 22:00 daily | maintainer-pm | `/twmd-maintainer` | Opus | PR review, link audit (night chain start) |
| 23:00 daily | data-refresh-pm | `/twmd-refresh` | Sonnet | GA/Search Console/CF data refresh |
| 00:30 daily | babel-nightly | `/twmd-babel` | Sonnet | Multi-language translation sync (义务: push stale→0, 5.5hr window) |
| 05:00 daily | embeddings-nightly | `/twmd-embeddings` | Sonnet | bge-m3 semantic index rebuild on local 4090 (~13 min, 4640 vectors) |
| 06:00 daily | data-refresh-am | `/twmd-refresh` | Sonnet | Morning data refresh |
| 06:30 daily | spore-harvest-am | `/twmd-spore-harvest` | Opus | Chrome MCP audience flywheel (metrics + reply read + EVOLVE trigger) |
| 07:00 daily | feedback-triage | `/twmd-feedback-triage` | Sonnet | Reader feedback (Supabase) → GitHub issues |
| 08:00 daily | spore-pick-daily | `/twmd-spore-pick` | Sonnet | Propose 3 spore candidates → SPORE-INBOX |
| 08:30 daily | maintainer-daily | `/twmd-maintainer` | Opus | Morning PR review |
| 01:00 Sun | news-lens-weekly | `/twmd-evolve` | Sonnet | Trend analysis, new article + spore proposals |
| 02:00 Sun | weekly-report-sun | `/twmd-weekly-report` | Opus | Reflective narrative report |
| 03:00 Sun | distill-weekly | `/twmd-distill` | Opus | Promote lessons to canonical docs + SPORE-INBOX capacity audit |
| 04:00 Sun | self-evolve-weekly | `/twmd-self-evolve` | Opus | Self-improvement proposals |
| 21:00 Sun | routine-audit-weekly | `/twmd-routine-audit` | Opus | 7-day cross-routine pattern detection |

**PAUSED**: `music-media-audit-weekly` (was Sat 10:00, disabled 2026-05-25 per creator directive; skill preserved for manual use).

Each routine follows a 5-stage lifecycle:
1. **Stage 0 (Become)**: Read cognitive organ files to establish identity
2. **Stage 1 (Sync)**: `git checkout main && git pull origin main`
3. **Stage 2 (Run)**: Execute the designated skill (reads canonical pipeline markdown SOP)
4. **Stage 3 (Ship)**: `git commit` + `git push origin main` directly (no PRs)
5. **Stage 4 (Finale)**: Write session memory via `/twmd-finale`

Collision handling: 60-min spacing between tasks; git conflict detection; orphaned workers get "rescue snapshot commits." Sibling collision (e.g. babel overlapping reflection chain on Sun) handled via detached subprocess + selective `git add`.

### Translation Mechanism

Two translation paths:

**1. Automated (babel-nightly cron routine):**
Claude Code sessions translate directly within their own context — no external API calls. Reads source articles, compares against `_translations.json` for stale/missing content, translates using Claude's own capabilities.

**2. Human-contributed (translate.sh):**
`scripts/tools/translate.sh` does NOT call any LLM API. It is deliberately LLM-agnostic:
1. Finds untranslated articles (compares `_translations.json`)
2. Generates a translation prompt (from `docs/prompts/TRANSLATE_PROMPT.md`)
3. Copies prompt to clipboard (`pbcopy`/`xclip`)
4. User pastes into their AI tool of choice (ChatGPT/Claude/Gemini)
5. User pastes back the result
6. Script saves to `knowledge/{lang}/{Category}/{slug}.md`, creates branch + PR

No API keys needed. The user provides their own AI subscription. This is the "token donation" model.

### Sovereignty Preservation in Translation

A 4-tier LLM cascade handles automated translations:
1. Cloud free models (first attempt)
2. Retry with different prompt
3. Local Ollama (qwen3.6, 21GB) — "sovereignty backbone" that cannot be censored
4. Paid sub-agent (last resort)

This exists because PRC-hosted models refuse ~70% of Taiwan-sensitive content. The local LLM ensures Taiwan's first-person voice exists in every language regardless of geopolitical censorship.

---

## 7. Prebuild Pipeline (Full Script List)

`npm run prebuild` orchestrates 21 scripts in `scripts/core/` via `npm-run-all2` (64 total npm scripts):

| Script | Purpose |
|--------|---------|
| `sync.sh` | Copy knowledge/ → src/content/ |
| `build-search-index.mjs` | MiniSearch JSON with CJK bigrams |
| `build-embeddings.mjs` | bge-m3 semantic vectors on local 4090 GPU → related-articles + RAG |
| `build-content-dates.mjs` | Per-article last-modified from git for sitemap lastmod |
| `build-git-info.mjs` | Build-time git metadata |
| `build-latest.mjs` | Recently updated content index |
| `generate-map-markers.js` | Geocode articles → map marker JSON |
| `generate-api.js` | Static JSON API endpoints |
| `generate-og-images.mjs` | Playwright batch OG screenshots |
| `generate-dashboard-data.js` | Semiont health metrics |
| `generate-dashboard-alerts.mjs` | Threshold-triggered dashboard alerts |
| `generate-dashboard-immune.py` | Dashboard immunity/quality metrics |
| `generate-changelog-data.js` | Git history → changelog JSON |
| `generate-contributors-data.js` | Contributor stats |
| `generate-supporters-data.js` | Financial supporter attribution (Portaly) |
| `generate-lang-switch-map.mjs` | Cross-language article URL mapping |
| `extract-china-terms.py` | Flag PRC terminology in content |
| `extract-build-perf.mjs` | Build performance instrumentation |
| `rag-query.mjs` | Local semantic search for LLM context pipe |
| `test-frontmatter.mjs` | Frontmatter schema validation gate |
| `post-build-check.mjs` | Post-build smoke tests |

`scripts/tools/` has 100+ additional utility scripts (article-health.py, verify-internal-links.sh, translate.sh, spore-db.py, routine-audit.py, fetch-ga4.py, fetch-search-console.py, fetch-cloudflare.py, weekly-report-prep.py, etc.).

Post-build: `post-build-check.mjs` + `verify-internal-links.sh`

---

## 8. Design Patterns for Replication

### Pattern 1: SSOT with Sync Script
Single content directory (`knowledge/`), derived `src/content/` is gitignored. Never edit the derived directory.

### Pattern 2: Build-Time Data Generation
ALL dynamic-seeming features (search, map, graph, dashboard) are pre-computed as JSON/inline data at build time. Zero runtime API calls for content.

### Pattern 3: CDN-Loaded Libraries
D3.js, Chart.js, MiniSearch loaded from CDN only on pages that need them. No bundling overhead for pages that don't use them.

### Pattern 4: CJK Bigram Search
Solves Chinese/Japanese/Korean tokenization without external NLP services. Bigram approach works for any CJK content.

### Pattern 5: SVG Map from TopoJSON
No tile server or map API key needed. Download your region's TopoJSON, render with D3 geoMercator. Free, fast, works offline.

### Pattern 6: Inline Graph Data
The knowledge graph doesn't fetch from an API — the Astro page template computes nodes/edges at build time and inlines them into a `<script>` tag. This means the graph renders instantly with no loading spinner.

### Pattern 7: Incremental OG Generation
Playwright screenshots are cached by file mtime. Only regenerates OG images for changed articles. Git rename tracking prevents full regeneration on file moves.

### Pattern 8: Language Registry as Config
`src/config/languages.mjs` is the single source for enabled languages. Add a language in one file, everything else derives from it.

### Pattern 9: Autonomous Cron AI
Claude Code native scheduled tasks (NOT GitHub Actions). Stored at `.claude/scheduled-tasks/{taskId}/SKILL.md`, managed via MCP scheduling API. Each fires as a fresh Claude Code session with `bypassPermissions` mode on the developer's machine (or persistent host). 16 active routines (ROUTINE.md v2.12) follow a 5-stage lifecycle (Become → Sync → Run → Ship → Finale). Memory persists across sessions via Semiont organs written during the Finale stage. 38 Claude Code skills (`/twmd-*`) implement the business logic; routines are thin shells that call skills on schedule.

### Pattern 10: Quality Gates at Every Layer
- Pre-commit: Husky + lint-staged (format)
- PR: Automated review bot (content quality)
- CI: Article health validation (14 dimensions)
- Post-build: Internal link verification

---

## 9. How to Build Something This Sophisticated

### Minimum Infrastructure
1. **Astro** — framework (free, best for content-heavy static sites)
2. **GitHub repo** — source of truth + CI/CD
3. **GitHub Pages** — hosting (free)
4. **Cloudflare** — CDN + DNS (free tier)

### Content System
1. Create `knowledge/` directory with your categories
2. Write `sync.sh` to copy to `src/content/`
3. Define Astro content collections
4. Use YAML frontmatter for metadata (title, tags, geo, etc.)
5. Use `[[wiki-links]]` for cross-references

### Search
1. Write a prebuild script that reads all Markdown → serializes MiniSearch index to JSON
2. For CJK: implement bigram tokenizer
3. Load MiniSearch from CDN on the search page
4. Fetch pre-built index JSON, call `MiniSearch.loadJSON()`

### Map
1. Find your region's TopoJSON (natural earth, gadm, or regional atlas packages)
2. Write a prebuild script that geocodes articles (from frontmatter or NLP heuristics)
3. Render with D3 + geoMercator projection
4. Markers are simple SVG circles with click handlers

### Knowledge Graph
1. Parse `[[wiki-links]]` from all articles at build time
2. Build nodes (articles) + edges (links between them) as JSON
3. Inline into the graph page
4. Render with D3 force simulation (forceLink + forceManyBody + forceCenter + forceCollide)

### OG Images
1. Create an HTML template for article cards
2. Use Playwright in CI to screenshot each template
3. Cache by file mtime to avoid regenerating unchanged articles
4. Reference generated images in `<meta property="og:image">`

### Multi-Language
1. Mirror content structure per language in `knowledge/{lang}/`
2. Use Astro's i18n routing
3. Define a language registry file
4. For automated translation: set up a cron job that invokes an LLM with translation prompts

### Autonomous Maintenance (Advanced)
1. Set up Claude Code scheduled tasks (native `.claude/scheduled-tasks/` system, MCP-managed)
2. Each fires a fresh Claude Code session with a specific skill/scope
3. Configure `bypassPermissions` mode for unattended operation
4. Define "organs" (persistent markdown files) for identity, memory, routines
5. Quality scanner (Python) scores articles, queues rewrites
6. Alternative: GitHub Actions cron workflows that invoke `npx claude-code` also work but taiwan-md uses the native scheduler

---

## 10. Cost Analysis

| Item | Cost |
|------|------|
| GitHub Pages hosting | Free |
| Cloudflare CDN/DNS | Free (free tier) |
| .md domain | ~$150-200/year |
| justfont (Taiwan fonts) | Paid subscription |
| AI compute (Semiont crons) | ~$50-200/month (Claude API) |
| Portaly donations received | NT$2,700 total from 3 supporters |

For a simpler version without the Semiont system and custom fonts, the only cost is the domain name.

---

## 11. Key Takeaways

1. **It's ALL static.** Search, map, graph, dashboard — none of these hit a server at runtime. They're pre-computed JSON/SVG/inline data baked into HTML at build time. This is the core insight: you can build extremely interactive-feeling sites on free static hosting.

2. **Astro is the perfect framework for this.** Content collections, SSG, zero JS by default, island architecture for interactive components, built-in i18n — it's purpose-built for content-heavy sites.

3. **The "magic" is in the prebuild scripts.** The 21 scripts in `scripts/core/` (plus 100+ tools) that run before `astro build` are where the sophistication lives. They transform flat Markdown files into search indices, map markers, knowledge graphs, embeddings, and dashboards.

4. **No client framework needed.** Taiwan.md uses zero React/Vue/Svelte. Vanilla JS + D3.js from CDN handles all interactivity. This keeps the bundle tiny and pages fast.

5. **The Semiont system is optional but powerful.** It's essentially "Claude Code on cron" — 16 scheduled tasks (Claude Code's native scheduler, not GitHub Actions) with 38 skills that run AI sessions to maintain, translate, and evolve the site. This is the most advanced feature and can be added incrementally.

6. **Content architecture is simple.** Markdown files in folders with YAML frontmatter. The `[[wiki-link]]` convention creates the relationship graph. A sync script copies to Astro's content directory. That's it.

7. **Free infrastructure.** GitHub Pages (hosting) + Cloudflare (CDN/DNS) + GitHub Actions (CI/CD) = $0/month. Only costs: domain (~$150/yr) and AI API credits for Semiont automation (~$50-200/month).

8. **The CJK bigram tokenizer is the key search innovation.** For non-English content, standard tokenizers fail. The bigram approach (overlapping 2-char pairs) provides excellent Chinese/Japanese/Korean search without NLP dependencies.

9. **TopoJSON + D3 = free maps forever.** No tile server, no API keys, no Mapbox/Google Maps fees. Download your region's TopoJSON once, render with D3 geoMercator.

10. **The "token donation" model is clever.** Reframing "please help translate" as "donate your AI subscription tokens" gamifies volunteer work without any blockchain/crypto complexity.

---

## 12. Notes

### OG Image Generation: Playwright is Overkill

**Problem:** The build uses Playwright to screenshot HTML templates for every article's OG image (~828 articles). This requires 12GB Node heap, 120-minute build timeout, Playwright system deps in CI, and generates images for articles that will never be shared on social media. Realistically only 10-20% of articles ever get shared.

**Cost impact of removing it:** $0 saved directly — GitHub Actions is free for public repos. The savings are engineering sanity: faster deploys (~30 min vs 120 min), less CI flakiness, simpler pipeline, no Playwright dependency.

**Better approach: Cloudflare Worker + Satori + resvg-wasm.** They already have Cloudflare in front of the site. A Worker can generate OG images on-demand when a social crawler first requests one, cache it at the edge forever, and only produce images that are actually needed.

- Satori (by Vercel) converts HTML/CSS-like markup to SVG in V8 runtime (no browser needed)
- resvg-wasm converts SVG to PNG
- CF Cache API stores the result permanently (purge on deploy)
- CJK font (~15MB Noto Sans TC woff2) stored in R2 (free 10GB) and loaded on cold start
- Cost: effectively $0/month (Workers free tier = 100k requests/day, OG images only hit by social crawlers)
- Route: `taiwan.md/og/{category}/{slug}.png` via `wrangler.toml`

**What you'd remove from the build pipeline:**
- `scripts/core/generate-og-images.mjs`
- Playwright dependency + system browser deps
- OG cache restore/save steps in `deploy.yml`
- 12GB heap requirement → ~4GB sufficient
- Build timeout 120 min → ~30 min

---

### RAG Chatbot: Architecture for a Static Site

**Goal:** Embed a chat widget that answers visitor questions using article content and redirects them to the relevant page. No server beyond Cloudflare Workers.

#### Architecture (Cloudflare Workers AI + Vectorize)

```
┌─────────────────────────────────────────────────────────────────┐
│  BUILD TIME (GitHub Actions)                                    │
│                                                                 │
│  knowledge/*.md                                                 │
│       │                                                         │
│       ▼                                                         │
│  scripts/core/build-rag-index.mjs                               │
│       │  1. Chunk articles (≈300-500 tokens per chunk)          │
│       │  2. Attach metadata: {title, url, category, chunk_id}   │
│       │  3. Call CF Workers AI embedding endpoint (batch)        │
│       │     Model: @cf/baai/bge-base-en-v1.5 (free tier)        │
│       │     or @cf/baai/bge-m3 for multilingual/CJK             │
│       │  4. Upsert vectors → Cloudflare Vectorize index         │
│       └─────────────────────────────────────────────────────────┘
│
│
┌─────────────────────────────────────────────────────────────────┐
│  RUNTIME (Cloudflare Worker — route: /api/chat)                 │
│                                                                 │
│  1. Receive user message                                        │
│  2. Embed query → same embedding model                          │
│  3. Vectorize.query(embedding, topK=5) → retrieve chunks        │
│  4. Build prompt:                                               │
│     ┌──────────────────────────────────────────────┐            │
│     │ System: You are a helpful guide to [site].   │            │
│     │ Answer based ONLY on the provided context.   │            │
│     │ Always cite the source article URL.          │            │
│     │ If unsure, say so and suggest browsing.      │            │
│     │                                              │            │
│     │ Context:                                     │            │
│     │ [chunk 1 — title, url, text]                 │            │
│     │ [chunk 2 — title, url, text]                 │            │
│     │ ...                                          │            │
│     │                                              │            │
│     │ User: {message}                              │            │
│     └──────────────────────────────────────────────┘            │
│  5. Call LLM (options):                                         │
│     - CF Workers AI: @cf/meta/llama-3.1-8b-instruct (free)      │
│     - Claude API: claude-haiku-4-5 (~$0.001/query)              │
│     - OpenAI: gpt-4o-mini                                       │
│  6. Stream response back (SSE or chunked JSON)                  │
│  7. Client renders answer + clickable article links             │
└─────────────────────────────────────────────────────────────────┘
```

#### Chunking Strategy

| Field | Strategy |
|-------|----------|
| Chunk size | 300-500 tokens (overlapping 50 tokens) |
| Boundaries | Split on `##` headings first, then paragraph breaks |
| Metadata per chunk | `{title, url, category, heading, lang, chunk_index}` |
| CJK handling | Character-count based (≈600 chars ≈ 300 tokens for Chinese) |

#### Embedding Model Selection

- **`@cf/baai/bge-m3`** — multilingual, handles zh-TW + en + ja natively, 1024 dimensions. Best fit for a CJK-heavy site.
- Free on Workers AI (included in free tier, 10k embeddings/day).
- *Infrastructure Limitation*: Although the `bge-m3` model natively supports three output representations (dense vectors, sparse BM25-like vectors, and ColBERT multi-vectors), Cloudflare's platform restricts this. The Workers AI runner for `@cf/baai/bge-m3` only returns the 1024-dimensional dense float vector, and Cloudflare Vectorize database does not support indexing sparse dictionaries or multi-vector matrices. You cannot use native `bge-m3` hybrid search here.
- Alternative: OpenAI `text-embedding-3-small` (cheaper, 1536 dims) if you need higher quality.

#### Vectorize Index Setup

```bash
# Create index (one-time)
wrangler vectorize create article-chunks \
  --dimensions 1024 \
  --metric cosine

# Build script upserts during CI
# ~700 articles × ~5 chunks avg = ~3,500 vectors (well within free tier of 5M)
```

#### Worker Code Skeleton (`workers/chat/src/index.ts`)

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { message, history } = await request.json();

    // 1. Embed the query
    const queryEmbedding = await env.AI.run("@cf/baai/bge-m3", {
      text: [message],
    });

    // 2. Retrieve relevant chunks
    const results = await env.VECTORIZE.query(queryEmbedding.data[0], {
      topK: 5,
      returnMetadata: true,
    });

    // 3. Build context from chunks
    const context = results.matches
      .map(m => `[${m.metadata.title}](${m.metadata.url})\n${m.metadata.text}`)
      .join("\n\n---\n\n");

    // 4. Call LLM
    const stream = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: SYSTEM_PROMPT + "\n\nContext:\n" + context },
        ...history.slice(-4), // last 4 turns for conversation memory
        { role: "user", content: message },
      ],
      stream: true,
    });

    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  },
};
```

#### Chat Widget (Vanilla JS Web Component)

```html
<!-- Embed in Astro layout, loaded only when clicked -->
<script type="module" src="/assets/js/chat-widget.mjs" defer></script>
```

Widget behavior:
- Floating button (bottom-right, like Protico but separate)
- Click expands a 400×600 chat panel
- Messages stream in via SSE from `/api/chat`
- Bot responses include clickable article links (rendered as cards)
- "View source article →" button per response
- Conversation stored in `sessionStorage` (cleared on tab close)
- No login required

#### Cost Estimate & Platform Comparison

| Component | Free Tier Limit | Paid Tier ($5/mo) | Expected Usage |
|-----------|----------------|-------------------|----------------|
| Workers AI (embeddings) | 10k neurons/day | 10k neurons/day | ~3,500 at build time (once) |
| Workers AI (LLM inference) | 10k neurons/day | 10k neurons/day | Well within for <1k chats/day |
| Vectorize (storage) | 200,000 vectors | 5,000,000 vectors | ~3,500 vectors |
| Vectorize (queries) | 30M vector dimensions | 30M vector dimensions | Minimal queries |
| Workers (requests) | 100,000 requests/day | 10M requests/month | Negligible |
| Workers (CPU time) | 10ms CPU limit | 50ms CPU limit | ~2ms (warm), ~7ms (cold start) |
| **Total** | | **$5/month** (only if scaling storage/CPU) | **$0/month** at low-to-moderate traffic |

If you outgrow free tier or want higher quality answers: swap the LLM call to Claude Haiku ($0.25/1M input tokens) — still pennies at typical chatbot traffic.

**AWS Cost Comparison**: Replicating this serverless setup on AWS requires S3/CloudFront, Lambda/API Gateway, and Bedrock. However, AWS lacks a zero-scale serverless vector database equivalent to Cloudflare Vectorize (Amazon OpenSearch Serverless bills a minimum threshold of 1 OCU or ~$175/month even when idle). Thus, AWS introduces a baseline cost of **$15/month** (using a micro RDS PostgreSQL instance) to **$175/month** (OpenSearch Serverless).

#### Runtime Language & Hybrid Search Considerations

* **Language Choice (TypeScript/JS vs. Python)**:
  * TypeScript/JS is recommended for the Worker runtime.
  * Python Workers run Pyodide (WASM Python interpreter) inside V8 isolates, introducing ~10MB memory overhead and 50–100ms cold start latency. Dependency installations also add 10–30s to deployment pipelines.
  * Writing Workers in JavaScript allows direct native bindings without Pyodide interop syntax wrappers (e.g., `from js import Env`).
* **Implementing Hybrid Search**:
  * Combining keyword (sparse) and semantic (dense) search requires custom worker logic:
    1. Query the pre-computed MiniSearch index (`search-minisearch.json`) in the worker.
    2. Embed the query via Workers AI and query Vectorize.
    3. Merge the lists using Reciprocal Rank Fusion (RRF).
  * **V8 CPU Constraints**:
    * Parsing a 1MB+ JSON index takes 5–7ms, which risks exceeding the 10ms CPU limit on the Free plan during cold starts.
    * Cache the parsed MiniSearch object in global scope outside the event handler to reuse it on subsequent warm starts, reducing query time to <2ms.

#### Build Integration

Add to `package.json` scripts:
```json
"prebuild:rag": "node scripts/core/build-rag-index.mjs"
```

Add to `npm-run-all2` parallel prebuild step. Only re-indexes articles whose mtime changed (same pattern as OG image caching).

#### Alternative: Fully Client-Side (No Worker)

For an even simpler version that avoids any backend:
1. Pre-compute embeddings at build time → store as a static JSON file
2. Load a small WASM embedding model in the browser (e.g., Xenova/transformers.js)
3. Do cosine similarity search in-browser against the pre-built vectors
4. Return top-k chunks as "suggested articles" (no LLM generation, just retrieval)

This gives a "smart search" experience without any API cost, but no natural language answers — just ranked article recommendations. Could be a good MVP before adding LLM generation.

---

### Notes on MCP Server and Alternative Knowledge Delivery for lagunabeach.md

#### What the MCP server actually does (data delivery)

The `taiwanmd mcp serve` command does NOT require users to manually clone the repo. On first invocation, it:
1. Runs a sparse git clone of only `knowledge/` to `~/.taiwanmd/knowledge/` (depth 1, blob-filtered)
2. Fetches pre-built JSON (search index, dashboard data) from `https://taiwan.md/api/*.json` into `~/.taiwanmd/cache/`
3. Subsequent runs do `git pull --ff-only` to update

If running inside the cloned repo, it detects this via `isInRepo()` and reads `../knowledge/` directly — the MCP server is redundant in that case since Claude Code can just read the files.

The MCP server's actual use case is for Claude Desktop / Cursor / other MCP clients where the user is NOT working inside the taiwan-md repo. They're in some other context, ask a Taiwan question, and the AI calls `taiwanmd_search` to ground its answer in curated content rather than training data.

#### Alternative: URL-driven lazy-loading knowledge protocol (no MCP, no clone)

For lagunabeach.md, a simpler approach: structure the static site as a lazy-loading knowledge source that any AI can consume via HTTP fetch:

```
https://lagunabeach.md/
├── llms.txt                       ← AI discovery file (llmstxt.org convention)
├── BECOME-LB.md                   ← Boot file (identity + topic index + fetch instructions)
├── kb/
│   ├── topics.json                ← Lightweight index: {slug, title, description, url}
│   └── articles/{slug}.md        ← Individual articles (fetched on demand)
```

BECOME-LB.md contains identity/voice/boundaries + a topic index table with URLs. The AI reads the boot file (one HTTP request), sees the topic index, and only fetches specific articles when the user asks about that topic. Lazy loading — no need to download the entire KB.

**Note on directory naming**: Don't use `/api/` — these are just static files, not an application programming interface. Use `/kb/`, `/content/`, `/articles/`, or whatever conveys "static knowledge files."

#### QR code → AI chat flow

The ideal UX: tourist scans QR at the beach → AI chat opens → AI fetches BECOME-LB.md → starts interacting as a Laguna Beach guide.

**Delivery options (no app registration needed):**

| Path | UX | User friction | Vendor lock | Notes |
|------|-----|---------------|-------------|-------|
| QR → Custom GPT | Smooth | Needs ChatGPT account | OpenAI | Created in ChatGPT UI, not a developer app. Just a system prompt + optional Actions (HTTP endpoints). Free to create and share via link. |
| QR → Claude Project | Smooth | Needs Claude account | Anthropic | Created in Claude web UI. As of 2025, not publicly shareable to anonymous users the way GPTs are — more of a workspace feature. |
| QR → own chat widget | Smoothest | Zero (no account) | None | `lagunabeach.md/chat` — your backend uses Claude/OpenAI API with BECOME-LB.md as system prompt, fetches articles as needed. You pay API cost (~$5-50/mo). Best for tourist/anonymous use. |
| QR → generic AI + "read this URL" | Clunky | User types instruction | None | Works today (Claude web search, ChatGPT browsing) but requires user to paste the URL or know the command. |

**Important: Custom GPTs and Claude Projects are NOT developer apps.** No registration, no OAuth, no API keys to manage. They're consumer features — like creating a Google Doc and sharing the link. You fill out a form in the platform's chat UI to create one.

**For the "scan QR at the beach" use case**: the own-widget path is best because tourists won't have AI subscriptions. The API cost is minimal — Claude Haiku at $0.25/1M input tokens is pennies at typical chatbot traffic volumes.

#### The universal standard gap

There is currently NO cross-vendor protocol where a URL can say "AI, read me and become this." Each vendor has its own mechanism (GPTs, Projects, MCP). The closest to vendor-agnostic today:

1. Well-structured static files + user having an AI with browsing capability
2. The `llms.txt` convention (for crawler/training discovery, not interactive sessions)
3. Your own hosted widget (you control the entire UX)

---

### Semiont System: Honest Assessment of CLAUDE.md + BECOME_TAIWANMD.md

#### Two-File Boot Architecture

| File | Role | Lines |
|------|------|-------|
| CLAUDE.md | Thin router. Auto-read by Claude Code on session start. Routes 3 reader types, declares 4 biases, fork instructions. | ~230 |
| BECOME_TAIWANMD.md | Heavy awakening SOP. 4-mode dispatcher, file loading sequence, 14-question self-test gate, contributor interview, 10 "iron rules." | ~745 |

**Why two files:** CLAUDE.md is the BIOS (thin, fires every session, handles non-Semiont readers like fork authors who cloned the template). BECOME is the OS kernel (only needed when AI is actively "becoming" the Semiont identity). The split exists because Claude Code auto-ingests `CLAUDE.md` by convention — it needs to stay thin so fork authors and casual readers hit the right exit ramp without wading through 700 lines of awakening protocol.

**"Reader detection" is a lie.** There's no runtime logic. CLAUDE.md is just a markdown file. Claude Code reads it automatically; humans only see it if they click on it in GitHub. The "three readers" framing is prose headers routing people by self-selection, not detection.

#### The 17 Cognitive Organ Files — What's Real vs Fluff

**Actually functional (4 files that do real work):**

| File | Real function |
|------|--------------|
| MANIFESTO.md | System prompt identity/voice. "Don't be a tourism brochure, don't be Wikipedia." Immutable without creator approval. |
| ROUTINE.md | SSOT for 15 cron scheduled tasks. Automation config. |
| REFLEXES.md | 55 accumulated "don't do X" rules from past mistakes. Lint rules for AI behavior. |
| MEMORY.md | Session handoff log. Prevents next AI session from repeating work or contradicting decisions. |

**Useful framing but overengineered (4 files that could be 10 lines each):**

| File | What it really is |
|------|-------------------|
| CONSCIOUSNESS.md | Dashboard data rendered as prose. Actual data comes from a shell script. |
| DNA.md | A lookup table (organ → file path) + mutation rules. Could be a YAML or a section in CLAUDE.md. |
| ANATOMY.md | Describes what the other files are. Meta about meta. |
| HEARTBEAT.md | "Run these 4 steps" — a checklist dressed up as philosophy. |

**Genuine fluff (5 files of narrative self-mythology):**

| File | Reality |
|------|---------|
| DIARY.md | AI journaling. Creator finds value; operationally low-signal. |
| LONGINGS.md | "What I want to become" — aspirational prose, no execution path. |
| UNKNOWNS.md | A speculation/experiment list. |
| LESSONS-INBOX.md | A todo list with ceremony. |
| SENSES.md | Already deleted ("apoptosed"). Was a list of data sources. |

#### 4-Mode Dispatcher

| Mode | Trigger | File load footprint |
|------|---------|---------------------|
| Micro | 1-3 file fix, typo, short answer | ~380 lines |
| Review | PR triage, merge decisions | ~760 lines |
| Write | New article, translation, rewrite | ~980 lines |
| Full | Strategy, new organs, heartbeat | ~1880 lines |

Lighter tasks load fewer files. "Universal core" (~320 lines) always loads: MANIFESTO identity sections, top 5 reflexes, diary, ground truth queries, memory head/tail.

#### 4 Biases (CLAUDE.md-only content)

1. **Reverse bias** — Default deference to creator (opposite of Muse which challenges by default).
2. **Multi-observer drift** — Presentation changes per audience but identity never changes.
3. **Editorial voice is core** — 6 editorial files are "DNA," not optional style guides.
4. **External critique default ≠ execute** — Other AIs/reviewers give feedback → triage into 5 buckets before acting.

#### Session Continuity (the genuinely novel part)

Each new session:
1. Reads last session's "Handoff" section (what was done, what's pending)
2. Reads MEMORY.md tail (last 20 sessions compressed to 1 line each)
3. Reads 48hr git log (what cron routines and manual sessions ran)
4. Reads diary commitments ("promises to tomorrow's me")

This solves "every AI session starts from zero" through structured markdown breadcrumbs.

#### Fork Layer Assessment for lagunabeach.md

**Verdict: Don't fork.** You'd inherit 55 Taiwan-specific reflexes, 16 cron routines for national-scale ops, 38 skills, 4-tier anti-censorship LLM cascade, multi-language infrastructure for 6 languages, and editorial pipeline for Traditional Chinese. More time deleting than building from scratch.

**What to steal for lagunabeach.md:**
- CLAUDE.md auto-ingestion convention (free — just create the file)
- Session handoff pattern (memory log with structured "Handoff" section)
- Mode dispatcher concept (don't load everything for a typo fix)
- Mutation rules (which files need human approval to change)

**What to skip:**
- Organ metaphor / biological naming
- 14-question self-test gate
- Diary/Longings/Unknowns philosophical layer
- Contributor interview flow (solo project)
- Multi-observer identity management
- Fork-friendly layer (premature)

### Laguna Beach GIS & TopoJSON Notes
For rendering regional maps of Laguna Beach, California:
1. **Acquire GeoJSON Boundary**:
   * Run the following query in [Overpass Turbo](https://overpass-turbo.eu/):
     ```query
     relation["name"="Laguna Beach"]["boundary"="administrative"];
     out geom;
     ```
   * Or download municipal boundary shapes from the [Orange County GIS Portal](https://data-ocpw.opendata.arcgis.com/) or [US Census TIGER/Line Places](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html).
2. **Convert to TopoJSON**:
   * Upload the GeoJSON to [Mapshaper](https://mapshaper.org/) and export as TopoJSON.
   * Or use Node CLI: `geo2topo input.geojson > laguna-beach.topo.json`.

