# Migration: taiwan-md -> lagunabeach-md

Fork of [frank890417/taiwan-md](https://github.com/frank890417/taiwan-md) following the [country-md-starter](https://github.com/frank890417/taiwan-md/blob/main/docs/fork/COUNTRY-MD-STARTER.md) Path A pattern, with intent to grow into Path B (Semiont system) over time.

---

## READ FIRST: Rules and Anti-Patterns

These rules exist because they were all violated in the first migration session. Each violation cost significant time to fix. DO NOT skip this section.

### Rule 1: Chinese comments ≠ Taiwan-specific code

The upstream codebase is written by a Chinese-speaking developer. All comments, error messages, and documentation are in Chinese. They describe UNIVERSAL infrastructure: quality gates, credential detection, build optimization, SEO hreflang filtering, parallel actor safety, etc.

**WRONG:** "This code is in Chinese, it must be Taiwan-specific. Remove it."
**RIGHT:** "This code is in Chinese. It does X. Is X specific to Taiwan content/identity, or is it universal infrastructure?" If universal, keep it. Add English comment next to it if needed.

**Test:** If removing the code would break the build, quality gates, SEO, or developer experience for ANY fork (Japan.md, Sweden.md, etc.), it's universal. Keep it.

**Clarification (2026-06-24): this rule is anti-lazy-deletion, NOT keep-Taiwan-forever.** It exists because a past session deleted _useful universal infrastructure_ rather than do the work of adapting it. It does NOT mean Taiwan-specific content/identity inheritance is preserved indefinitely. The end goal of this migration is to replace _everything_ Taiwan.md → LagunaBeach.md: for each Taiwan artifact, either **rewrite it for LB** or, **if it has no LB use and isn't worth rewriting, delete it** (e.g. `reports/` Taiwan session history, sovereignty framing, Taiwan spore/peer data). "Don't strip universal infra" and "do delete dead Taiwan inheritance" are both true — Rule 6 (verify before removing) is how you tell which is which. See Phase 7.

### Rule 2: Never remove packages, scripts, or dependencies

In Phase 1, all devDependencies (playwright, sharp, pixelmatch, opencc-js) and 38 npm scripts were stripped from package.json because they "weren't needed yet" or "might fail." Every single one referenced files that still exist in the repo. They are all universal infrastructure.

**WRONG:** Remove a script from package.json because it errors without Taiwan data.
**RIGHT:** Add `|| true` to make the script non-fatal. The script still exists, the infrastructure stays intact, it will work once the data is provided.

**WRONG:** Remove a dependency because it's not used "right now."
**RIGHT:** Keep it. If it's in the upstream package.json, it's there for a reason. Something uses it.

**WRONG:** `bunx` not found, so rewrite the hook to use `npx` with fallback logic.
**RIGHT:** Install bun. `curl -fsSL https://bun.com/install | bash`.

### Rule 3: Never rewrite a file from scratch

In Phase 1:

- `astro.config.mjs` was reduced from 413 lines to 99 (stripped hreflang SEO filter, sitemap i18n, build perf tuning, redirects system)
- `scripts/core/sync.sh` was rewritten from scratch (lost frontmatter fixing, image health check, all comments)
- `.husky/pre-commit` was gutted to 3 lines (stripped credential detection, scope pollution warning, language registry sync, frontmatter auto-fix, article health gate)

All of these deletions removed universal infrastructure and had to be manually restored.

**WRONG:** "I'll rewrite this file clean for our needs."
**RIGHT:** Restore the original (`git show upstream/main:path/to/file > path/to/file`), then make ONLY the necessary changes. A good adaptation changes 5-20 lines in a 400-line file.

### Rule 4: Know what IS and ISN'T Taiwan-specific

**Taiwan-specific (correct to change):**

- Content in `knowledge/` (articles about Taiwan)
- Branding strings: "Taiwan.md" -> "LagunaBeach.md"
- Domain: `taiwan.md` -> `lagunabeach.md`
- Repository: `frank890417/taiwan-md` -> `wilsonkichoi/lagunabeach-md`
- Category names: Taiwan's 14 categories -> LB's 8 categories
- Statistics: "400+ years", "59,000 species", "90% chips"
- Social handles: `@taiwandotmd` -> `@lagunabeachmd`
- Hero/page narrative prose about Taiwan's history, geography, politics

**NOT Taiwan-specific (do not remove):**

- Pre-commit quality checks (ALL of them: credential detection, frontmatter validation, narrative scope, language registry sync, hardcoded lang detection)
- Build scripts in scripts/core/ and scripts/tools/ (article-health, dashboard, contributors, OG images, embeddings, map markers, changelog)
- All devDependencies (playwright, sharp, opencc-js, pixelmatch, husky, lint-staged, npm-run-all2)
- CJK bigram tokenizer in search (we have zh-TW enabled as a language)
- i18n infrastructure (multilingual routing, language switcher, fallback chains)
- Comments written in Chinese (they explain the code logic)
- Semiont docs, skills, routines (dormant, will grow into them)
- The `postbuild` smoke tests and internal link verification
- The `postinstall` sync hook
- Visual regression testing infrastructure

### Rule 5: Minimal change principle

For each upstream file, ask: **"What is the MINIMUM edit to make this work for LagunaBeach.md?"**

The answer is almost always one of these mechanical substitutions:

1. Swap a CATEGORY_MAPPING/CATEGORIES array (Taiwan's 14 -> LB's 8)
2. Change `lang === 'zh-TW'` to `lang === 'en'` where it means "is this the default language?"
3. Change `taiwan.md` domain to `lagunabeach.md`
4. Change `frank890417/taiwan-md` to `wilsonkichoi/lagunabeach-md`
5. Change branding text "Taiwan.md" to "LagunaBeach.md"
6. Change Taiwan statistics/narrative to LB equivalents

**Everything else stays untouched.** If you're deleting more than 20 lines from a file, stop and ask yourself why.

### Rule 6: Verify before calling something "unnecessary"

Before removing ANY code, function, script, or dependency:

1. `grep -r "functionName" src/` - is it referenced somewhere?
2. Does the file it references still exist in the repo?
3. Would removing it break the build, quality gates, or developer workflow?
4. Would another fork (Japan.md, Sweden.md) need this same code?

If ANY answer is yes: keep it.

### Rule 7: Don't replicate upstream's visual approach when the context is different

In Phase 3, multiple iterations tried to replicate Taiwan.md's D3+TopoJSON SVG map (which works for an island nation) for a small coastal city. Hand-drawn neighborhood polygons produced ugly gaps and misalignment. The correct answer: use Leaflet+OpenStreetMap tiles. A real map with streets, terrain, and coastline.

**WRONG:** "Taiwan.md uses D3+SVG for maps, so we should too."
**RIGHT:** "Taiwan.md is an island. A self-contained SVG works. Laguna Beach is a coastal city bordering other cities. It needs a real tile map with geographic context."

**Test:** If the upstream approach looks ugly or confusing when applied to your content, the approach itself is content-specific, not universal infrastructure.

### Rule 8: Before removing/hiding HTML elements, grep for JS references

In Phase 3, the marker count badge (`#totalMarkers`) was hidden but JS still referenced `document.getElementById('totalMarkers').textContent = ...`. The null error silently broke the entire filter-to-sidebar-cards chain. No console error was visible to the user; the filters just "didn't work."

**WRONG:** Remove/hide a DOM element because it looks unnecessary.
**RIGHT:** `grep -n "elementId" src/templates/*.astro` before removing. If JS references it, either keep it or null-guard the reference.

### Rule 9: Filter data-filter values must match actual data field values

In Phase 3, filter buttons had `data-filter="Coastal"` / `"Cultural"` / `"Nature"` but markers had `region: "The Village"` / `"South Laguna"`. The filter UI looked correct but matched zero markers.

**WRONG:** Name filter values by abstract categories.
**RIGHT:** Filter `data-filter` values must exactly match the `region`/`category` strings in the marker JSON data.

### Rule 10: Rename Taiwan references immediately, not later

Left `drawTaiwanMap` function name across multiple iterations until user pointed it out. Find-and-replace all Taiwan function/variable names at the start of adaptation, not incrementally.

### Rule 11: Spawned agents must use the exact same model as the main session

In Phase 3, agents were spawned without specifying the model, causing them to use Opus 4.7 instead of Opus 4.6 (1M context) (the main session's model). The `model: "opus"` parameter alone is insufficient if multiple Opus versions exist. Specify the exact model explicitly.

**WRONG:** `Agent({ prompt: "..." })` — inherits wrong model version.
**WRONG:** `Agent({ prompt: "...", model: "opus" })` — may resolve to a different Opus version.
**RIGHT:** Verify which model the main session uses and ensure agents match exactly. If the session is Opus 4.6 (1M context), agents must also run Opus 4.6 (1M context).

### Rule 12: Never fabricate a fact. Verify every number, date, and name against SSOT.

A later session rewriting `public/llms.txt` invented "1887 incorporation" for Laguna Beach. The real year is 1927 (`knowledge/History/founding-and-early-history.md`). It also wrote "Incorporated: 1927" four lines later in the same file — fabrication produces internal contradictions. A separate pre-existing error (`visualization-catalog.md` said 1941) survived because nobody cross-checked it.

**Second `llms.txt` fabrication (caught 2026-06-24 review, fixed):** the rewrite stated the 1993 Firestorm destroyed "366 homes". SSOT says **441** (`knowledge/History/the-1993-firestorm.md:18`, `visualization-catalog.md:42,55`); 366 appeared nowhere else in the repo. Fixed to 441. Same file, same failure mode as 1887 — DO cross-check every number in `llms.txt` against `knowledge/`, not just the famous one.

**Unsourced stat resolved (2026-06-24):** "Population: ~23,000 (2020 census)" had no source in `knowledge/`. Dropped from `llms.txt` per Rule 12. If sourced later, can be re-added.

Every factual claim you write — a year, a population, a count, a person's name, an award, a statistic — must be traceable to a source BEFORE you write it. The source for LB facts is `knowledge/` (the SSOT). The source for "how many files / how many refs" is the actual `grep`/`ls` output, not memory.

**WRONG:** "Laguna Beach was incorporated in 1887." (plausible-sounding, never verified, wrong)
**WRONG:** Fill a content gap with a number that "feels right" to make prose flow.
**RIGHT:** `grep -rin "incorporat" knowledge/` → find `1927` → write `1927`. If `knowledge/` has no answer, write nothing and flag the gap; do NOT invent one.

**Test:** For every concrete claim, can you name the file and line it came from? If not, it is fabrication — delete it or go verify it.

**When you find an SSOT contradiction** (two `knowledge/` files disagree, like 1927 vs 1941): stop, determine the true value, fix BOTH, and tell the user. Don't silently pick one.

### Rule 13: Build delete/rewrite lists by grep, not by guessing. Include every variant.

A later session's Phase 4.5 list named `src/pages/taiwan-shape.astro` but missed its five locale copies (`en/es/ja/ko/fr/taiwan-shape.astro`); named `bench.template.astro` but not its page-wrapper `src/pages/bench.astro`; claimed `contribute.template.astro` had "40+ Taiwan refs" when it had 0 (already cleaned) and double-listed `contribute.ts`. Acting on that list as written would orphan wrappers, break builds, and waste effort on already-done files.

Before adding ANY file to a cleanup checklist:

1. **Find all locale variants by `ls`, never by assumption.** A page at `src/pages/X.astro` usually has locale copies at `src/pages/{lang}/X.astro` — but coverage is NOT uniform: `taiwan-shape`/`opendata`/`soundscape`/`terminology` have 5 locales (en/es/fr/ja/ko), while `bench`/`elections` have only 3 (en/ja/ko), and `companies`/`feedback-uxtest`/`lifetree` have none. Run `ls src/pages/*/X.astro` and `ls src/pages/*/<subdir>/X.astro` for nested pages. List every file the `ls` returns, or none. Do NOT pattern-match a locale set from another page.
2. **Find the page-wrapper ↔ template pair.** `src/templates/X.template.astro` is rendered by a thin `src/pages/X.astro` (or `src/pages/X/index.astro`) wrapper. Deleting one without the other breaks the build. List both.
3. **Verify ref counts with `grep -ic`, never estimate.** Write the actual number. If it's 0, the file is already done — don't list it.
4. **No double-listing.** If `contribute.ts` appears in the i18n section, it must not also ride along on a template line.
5. **Distinguish stale content from intentional upstream credit.** `about.template.astro` keeps a deliberate "Taiwan.md Contributors (Upstream)" attribution block (commit `7faa14848`). A raw `grep` hit is not automatically something to remove — read the context.

**Test:** Run `grep -rilZ "台灣\|taiwan" src/pages src/templates | tr '\0' '\n' | sort` and reconcile EVERY hit against the checklist. A hit that's on neither the list nor a documented keep-list is an omission.

---

## Core Architecture

### Shadow Translation Pattern

- Upstream Chinese files stay UNTOUCHED in the repo
- Create `.en.md` alongside for English versions when needed
- `.gitattributes` protects `CLAUDE.md` and `knowledge/**` with `merge=ours`
- To pull upstream: `git fetch upstream && git merge upstream/main`
- Only `CLAUDE.md` and `knowledge/**` auto-reject upstream changes; everything else merges normally
- Shadow `.en.md` files never conflict (upstream never creates them)

### Upstream Remote

```bash
git remote -v
# origin    git@github.com:wilsonkichoi/lagunabeach-md.git
# upstream  https://github.com/frank890417/taiwan-md.git
```

### Default Language

- English is default (no URL prefix, content at `knowledge/{Category}/`)
- zh-TW is secondary (URL prefix `/zh-TW/`, content at `knowledge/zh-TW/{Category}/`)
- All `lang === 'zh-TW'` checks in upstream code changed to `lang === 'en'` for "is this the default language?" logic

### Category Structure

8 categories (vs Taiwan's 14):

```
knowledge/
├── History/
├── Art & Galleries/
├── Nature & Marine Life/
├── Food/
├── Beaches/
├── Trails/
├── Events & Festivals/
└── Neighborhoods/
```

Slug mapping (used in URLs and src/content/):

- `history`, `art-galleries`, `nature-marine-life`, `food`, `beaches`, `trails`, `events-festivals`, `neighborhoods`

### Files Changed from Upstream (CATEGORY_MAPPING locations)

These files contain hardcoded category arrays that MUST match the 8 LB categories:

| File                                    | What was changed                                                                                                            |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `scripts/core/sync.sh`                  | CATEGORIES array, default lang `en`, slugify function                                                                       |
| `scripts/core/build-search-index.mjs`   | CATEGORY_MAP, legacy dedup fix                                                                                              |
| `src/utils/categoryConfig.ts`           | 8 LB categories with colors/icons (this one is a full rewrite, justified because category definitions ARE content-identity) |
| `src/utils/category-static-paths.ts`    | CATEGORY_MAPPING, default lang check                                                                                        |
| `src/pages/[category]/[slug].astro`     | CATEGORY_MAPPING, lang='en'                                                                                                 |
| `src/templates/article.template.astro`  | categoryMapping, lang checks, GitHub edit link                                                                              |
| `src/templates/home.template.astro`     | categoryFolders, hallGroups, isDefault logic                                                                                |
| `src/components/CategoryGrid.astro`     | Dynamic from categoryConfig (not hardcoded)                                                                                 |
| `src/components/Header.astro`           | categoryList array, isEnActive logic, langOptions order, dropdown bg color                                                  |
| `src/components/home/HomeEnHalls.astro` | Full rewrite with LB narrative (justified: this is pure content prose)                                                      |

---

## Phases

### Phase 0: Pre-Fork Preparation ✅ COMPLETE

- Tagged standalone repo: `v0.1-standalone`
- Archived to `wilsonkichoi/lagunabeach-md-v0`
- Exported 16 articles and portable assets to `_research/`
- Freed `lagunabeach-md` name for the fork

### Phase 1: Fork + First Build ✅ COMPLETE

- Forked taiwan-md, renamed to lagunabeach-md
- Set up upstream remote
- Created `.gitattributes` (merge=ours for CLAUDE.md and knowledge/\*\*)
- Cleared Taiwan content from knowledge/, added 8 LB category dirs with 15 articles
- Updated `src/config/languages.mjs/.ts`: English default + zh-TW enabled
- Updated `scripts/core/sync.sh`: 8 LB categories, slugify with sed, `en` as default
- Updated `astro.config.mjs`: site URL only (kept all other infrastructure intact)
- Updated CATEGORY_MAPPING in all files listed above
- Fixed duplicate ID bug in search index (when DEFAULT_LANGUAGE.code === 'en')
- Updated `.husky/pre-commit`: PATH for $HOME/.bun/bin, kept ALL quality checks
- Updated `package.json`: name/description/version only, all scripts retained with `|| true` for failing ones
- Updated `public/CNAME`: lagunabeach.md

### Phase 2: Localization ✅ COMPLETE

- Typography: Inter as primary body/interface font, Georgia for titles (Noto TC kept as zh-TW fallback)
- Color palette: systematic swap from Taiwan green to ocean blue (12 color mappings across 52+ files, including hex and rgba values)
- Branding: LagunaBeach.md throughout (title, BrandMark, hero, footer, SEO, structured data)
- SEO.astro: all metadata, JSON-LD, keywords, social links localized
- Header: English active by default, 8 LB categories in dropdown, nav links to own repo, dropdown bg ocean blue
- Footer: own repo/social links, "Built with love in Laguna Beach"
- Banner: only shows on non-default lang paths (not on English root)
- HomeEnHalls: full rewrite with LB narrative (4 halls: Coast, Story, Land, Life)
- CoverStory: LB timeline (Acjachemen, 1904 painters, 1918 Art Association, 1933 Pageant, 1993 firestorm, today)
- i18n/home.ts: all English strings localized
- All `frank890417/taiwan-md` refs -> `wilsonkichoi/lagunabeach-md`
- All `taiwan.md` domain refs -> `lagunabeach.md`
- Remaining: i18n strings in secondary pages (contribute, data, about, taiwanShape) still have Taiwan content. These pages render but have stale prose. Fix as those pages are adapted.

### Phase 3: Infrastructure Adaptation ✅ COMPLETE

- Acquired Laguna Beach + 5 neighboring city boundaries via Overpass Turbo API
- Created `src/data/laguna-beach-geocode.json` (7 neighborhoods + 16 landmarks with lat/lng)
- Adapted `scripts/core/generate-map-markers.js` for English place names, neighborhood assignment by coordinates
- Map page: replaced D3+TopoJSON SVG with Leaflet.js + OpenStreetMap tiles (real map with streets, terrain, coastline)
- Map sidebar: neighborhood filter (North Laguna, Village, South Laguna, Top of the World, Canyon) + category filter, both update markers AND article cards
- Knowledge graph: center node "LagunaBeach.md", 8 category nodes, English UI
- All prebuild scripts pass natively (removed all `|| true` guards from package.json)
- OG images: existing pipeline works (no-op when no images need generation)
- RSS feed: 8 LB categories, English language, correct URLs verified
- Sitemap: working with hreflang, correct lagunabeach.md domain
- Explore/search: 15 articles indexed, MiniSearch working
- Post-build smoke test: LB categories, adjusted thresholds
- Internal links verifier: CDPATH shell fix
- Favicon: replaced Taiwan island with "LB" blue circle
- BrandMark: text-only (removed Taiwan island image)
- Map routes: Taiwan routes removed (Night Markets, National Parks, etc.)
- Taiwan sidebar content removed (22 Counties Deep Dive panel, county cards)
- About page: "Why LagunaBeach.md?" (i18n updated)
- Explore page: "Explore LagunaBeach.md" branding

Remaining known stale content (tracked in Phase 4.5):

- `/about` team/timeline/origin story still has Taiwan.md narrative
- Footer category links still reference Taiwan's 12 categories
- These pages need full content rewrites with LB-specific material, not mechanical substitution

### Phase 4.5: Stale Taiwan Content Cleanup ✅ COMPLETE

> Every path below verified to exist (`ls`) on 2026-06-23; ref counts are `grep -ic "台灣\|taiwan"` on the named file at that time. Re-verify before actioning (files change). Per Rule 13: when deleting a page, delete its locale variants AND its page-wrapper/template pair together.

> **Before any deletion, run `grep -rln "<basename>" src/ scripts/ astro.config.mjs` (Rule 6) — several items have surviving importers and MUST be sequenced or the build breaks. Known dependencies as of 2026-06-23:**
>
> - **`category-hub` rewrite must come BEFORE deleting `taiex-yearly`/`taiwan-cpi`/`taiwan-housing`/`taiwan-salary.json`** — `category-hub.template.astro` imports all four. Delete the JSONs only after the rewrite drops the imports.
> - **opendata is a 3-part chain**: `opendata.template.astro` → `src/data/opendata-content.ts` → `src/data/opendata-curation.json`. Delete all three together. (`scripts/tools/twinkle-hub-crawl.py` also references the JSON — it's a generator script, handle separately.)
> - **terminology is wired into lang-switch infra**: `src/utils/getLangSwitchPath.ts:254` lists `'terminology'` — remove that entry when deleting the pages. (`Header.astro`'s terminology mention is only a comment — safe.)
> - **`data/NML|NMTH-overseas|TFT|PanSci` dirs are NOT in the npm build chain** (only standalone `scripts/tools/*.py` fetch/report scripts reference them) — deleting them won't break `npm run build`. Lower urgency; can defer.

Public-facing files actively misidentifying the site (HIGH priority):

- [x] `public/robots.txt` — Taiwan sovereignty narrative + `taiwan.md` sitemap URL
- [x] `public/llms.txt` — entire file was Taiwan knowledge guide for LLM crawlers
- [x] `public/google-site-verification.txt` — domain references

Entire pages that are 100% Taiwan-specific (need delete or full rewrite). Delete ALL locale variants + the page-wrapper/template pair together:

- [x] `taiwan-shape` cartography page — **6 page files**: `src/pages/taiwan-shape.astro` + `src/pages/{en,es,ja,ko,fr}/taiwan-shape.astro`, plus template `src/templates/taiwan-shape.template.astro` + `src/i18n/taiwanShape.ts`
- [x] `projects` civic-tech page (g0v, night market app) — `src/pages/projects.astro` + locale `src/pages/en/projects.astro`
- [x] `companies` top-50 bubble chart — `src/pages/companies.astro`
- [x] `bench` Sovereignty-Bench-TW — DELETED (pages + locales + template + i18n keys in ui.ts)
- [x] `elections-2026` — `src/pages/elections/2026/index.astro` + locales + template
- [x] `opendata` — 6 page files + template + `src/data/opendata-content.ts` + `opendata-curation.json`
- [x] `soundscape` — 6 page files + template + `src/data/soundscape-data.ts`
- [x] `terminology` — 8 page files + removed from `getLangSwitchPath.ts`
- [x] `lifetree` — both page files + removed lifetree CTA from article.template.astro
- [x] `src/pages/semiont/speciation.astro` — deleted + removed speciation section from semiont-landing.template.astro
- [x] `src/pages/feedback-uxtest.astro` — deleted

Template pages with deep Taiwan content (need substantial rewrite):

- [x] `src/templates/category-hub.template.astro` — TAIEX import removed; food-universe section DELETED (HTML + 596-line script + CSS). Economy-chart scaffolding fully removed (R3): data arrays, parser, render block, CSS, SVG script (-359 lines). 0 taiwan refs remain.
- [x] `src/templates/data.template.astro` — verified 0 refs (already clean)
- [x] `src/templates/resources.template.astro` — `taiwanmdLinks` renamed to `projectLinks`, mindmap root node `id: 'taiwan'` → `'root'`, all edge sources updated. 0 refs remain.
- [x] `src/templates/assets.template.astro` — DELETED (6 page wrappers + template + i18n). No LB SVGs exist. `nav.assets` keys removed from ui.ts.
- [x] `src/pages/en/graph.astro` — re-centered to `🌊 LagunaBeach.md`, 8 LB categories, all node/edge refs updated (0 refs remain).
- [x] `src/templates/about.template.astro` — 6 refs verified: line 148 comment (keep), lines 352-361 upstream credit block (intentional, per Rule 13.5). All i18n-driven content already LB via `about.ts`.
- [x] `mcp` page — `src/pages/mcp.astro` + `src/templates/mcp.template.astro` (verified 0 refs)
- [x] `src/templates/map.template.astro` — fixed: `bgGradient` swapped from `#14532d` to `#1e5a8a` (ocean blue); stale 22-county/d3/topojson comment replaced with concise Leaflet description (0 refs remain).

Taiwan data files to remove:

- [x] `src/data/taiex-yearly.json` — Taiwan stock index
- [x] `src/data/taiwan-cpi.json` — Taiwan CPI
- [x] `src/data/taiwan-housing.json` — Taiwan housing data
- [x] `src/data/taiwan-salary.json` — Taiwan salary data
- [x] `src/data/taiwan-geocode.json` — Taiwan geocode (LB version already exists)
- [x] `src/data/opendata-curation.json` — deleted with opendata chain

Taiwan data directories to remove:

- [x] `data/history-roadmap.md` — DELETED (Taiwan National History Museum roadmap)
- [x] `data/NML/` — DELETED (Taiwan art archive "No Man's Land")
- [x] `data/NMTH-overseas/` — DELETED (Taiwan National Museum of History)
- [x] `data/TFT/` — DELETED (Teach for Taiwan)
- [x] `data/PanSci/` — DELETED (Taiwan science media)
- [ ] `data/terminology/` — KEPT (used by prebuild:china-terms in build pipeline)
- [x] `data/ilhaformosa/` — DELETED (Portuguese-era Taiwan reference)

i18n files needing rewrite:

- [x] `src/i18n/map.ts` — DELETED (832 dead keys, zero `t('map.*')` consumers anywhere). Import removed from `ui.ts`.
- [x] `src/i18n/resources.ts` — NOT dead (imported indirectly via ui.ts spread). Full zh-TW rewrite to LB content (4 chapters: civic, history, nature, community). English stale sections also fixed. 0 refs remain.
- [x] `src/i18n/about.ts` — 6 refs are all INTENTIONAL upstream credit ("forked from Taiwan.md" origin narrative). Keep per Rule 13.5.
- [x] `src/i18n/ui.ts` — zh-TW strings fixed (nav, footer, categoryConfig descriptions, aria). 2 residual hits are key names only (`article.exploreTaiwan`), values already LB.
- [x] `src/i18n/assets.ts` — DELETED with assets page set. Import/spread removed from ui.ts.
- [x] `src/i18n/contribute.ts` (zh-TW strings) — all 32 Taiwan refs rewritten to LB equivalents. 0 refs remain.
- [x] `src/i18n/explore.ts` (zh-TW strings) — meta, search placeholder, hot searches, categories subtitle all updated
- [x] `src/i18n/home.ts` — hero stats, cover heading/lead/closing, historical quotes timeline all rewritten to LB. 3 residual hits are key names only (`.taiwanmd` suffix), values already LB. zh-TW Hall prose replaced with placeholder (no zh-TW knowledge/ content yet).

> Pattern: Phase 2 localized only English i18n strings. Updated ref counts (`grep -ic "台灣\|台北\|taiwan"`, 2026-06-24 post-cleanup): `map.ts` DELETED, `resources.ts` 0, `contribute.ts` 0, `home.ts` 3 (key names only), `ui.ts` 2 (key names only), `about.ts` 6 (intentional upstream credit). `assets.ts` DELETED (was 46 refs; removed with assets page set per line 366).

### Sovereignty-framing purge (Taiwan geopolitical lens — NOT applicable to LB)

Per CLAUDE.md, the sovereignty / PRC-censorship-bypass lens is explicitly dropped for LB (no equivalent dynamic for a SoCal beach town). Remove it everywhere it's live, but do NOT touch files that already disclaim it.

- [x] `ROADMAP.md` — DELETED (was 100% Taiwan sovereignty doctrine)
- [x] bench page set + i18n + route — deleted (see above)
- [x] Organism-diagram "sovereignty loop" naming — RENAMED `sovereign` → `visibility` across all 4 files (i18n keys, CSS classes, comments). `grep -in sovereign` returns 0 on all target files. Build passes.
- [x] `src/scripts/dashboard-client.js:612` — comment updated ("sovereignty preservation" → "multilingual visibility")

**VERIFIED CLEAN — do NOT "fix" these (they mention sovereignty only to explicitly DISCLAIM it; Rule 13.5):** `docs/semiont/MANIFESTO.en.md`, `docs/semiont/DNA.en.md`, `docs/semiont/LONGINGS.en.md`. These are correct re-grounding. A raw `grep "sovereign"` hit here is intentional, not a target.

Low priority / cosmetic:

- [x] `src/templates/latest.template.astro` — comment fixed ("come discover Laguna Beach")
- [x] `CONTRIBUTING.md` — verified: all Taiwan.md refs are intentional upstream credit/lineage (per Rule 13.5). No action needed.
- [x] `.github/pull_request_template.md` — REWRITTEN to English with LB's 8 categories and conventions.
- [x] `src/components/home/CommunityFeedback.astro` — Korean user quote replaced with LB fact-check anecdote
- [x] `public/images/wiki/url-mapping.txt` — cleared Taiwan mappings (file kept for cache-images.sh infra).

### Phase 4: Shadow Translation ✅ COMPLETE

- `docs/editorial/EDITORIAL.en.md` (280 lines) - universal writing principles with LB examples (scene/object/contradiction finding, opening/ending discipline, article grading, concrete detail requirements)
- `BECOME_LAGUNABEACH.md` (220 lines) - AI identity boot file: project identity, upstream relationship, key rules, category structure, editorial principles, dev workflow, shadow-translation convention
- `docs/semiont/MANIFESTO.en.md` (149 lines) - Semiont philosophy comprehension guide: core beliefs, evolution dimensions, tropical rainforest theory
- `docs/semiont/ROUTINE.en.md` (138 lines) - automation system guide: design principles, 5-stage lifecycle, 16-routine inventory, adoption roadmap for LB
- Shadow-translation convention documented in BECOME_LAGUNABEACH.md §Shadow Translation Convention (rules, current inventory table)

### Phase 5: Path B Preparation (Semiont Scaffolds) ✅ COMPLETE

Tasks:

- [x] Review all 33 `.claude/skills/twmd-*/SKILL.md` (+4 siblings) - categorize as reusable vs Taiwan-specific → [`reports/phase5-skill-audit.md`](reports/phase5-skill-audit.md) (21 reusable, 11 Taiwan-specific, 5 defer)
- [x] Create LB skills (scope locked 2026-06-24; "3 skills" superseded — write+rewrite merge into one, `lb-become` added):
  - [x] `lb-become` — thin identity-load (Read `BECOME_LAGUNABEACH.md`, confirm identity + SSOT rule + autonomy boundaries). No Step 0-9 / mode dispatcher (Rule 5). Shared gate for the others. **(R6)** → [`.claude/skills/lb-become/SKILL.md`](.claude/skills/lb-become/SKILL.md)
  - [x] `lb-sync` — wrap `scripts/core/sync.sh` (SSOT rebuild `src/content/` ← `knowledge/`; NOT translation). **(R6)** → [`.claude/skills/lb-sync/SKILL.md`](.claude/skills/lb-sync/SKILL.md)
  - [x] `docs/pipelines/REWRITE-PIPELINE.en.md` — SHORT (~1pg) step-sequencer (mode → research → draft per `EDITORIAL.en.md` → fact-check → quality-checklist gate → `lb-sync`). Do NOT translate upstream's 206KB v7.0. **(R7)** → [`docs/pipelines/REWRITE-PIPELINE.en.md`](docs/pipelines/REWRITE-PIPELINE.en.md)
  - [x] `lb-write` — thin shell: `lb-become` gate → read `REWRITE-PIPELINE.en.md` → execute. Handles BOTH new + rewrite (one skill). **(R7)** → [`.claude/skills/lb-write/SKILL.md`](.claude/skills/lb-write/SKILL.md)
- [x] Adapt `scripts/tools/article-health.py` for English content **(R8)** — source-lang swap zh-TW→en, `_get_all_zh`→`_get_all_source`, zh-TW added to exclusion lists; word_count.py already calibrated (250-word, APPLIES_TO=en); CJK plugins auto-skip via APPLIES_TO=zh-TW
- [x] Adapt `scripts/core/build-embeddings.mjs` — CATEGORY_MAP Taiwan→LB **(R9)**, tag-overlap shipped as derived prebuild artifact **(R10)**: `prebuild:related` runs `build-related-tagoverlap.mjs` → `src/data/related/en.json` (gitignored, regenerated each build). bge-m3 tabled (manual-run only, revisit at 50+ articles / for RAG chatbot). Stale Taiwan `src/data/related/*.json` untracked. Comparison in `reports/phase5-related-experiment.md`.
- [x] Create minimal `ROUTINE.md` (2-3 inactive routines documented) **(R8)** — satisfied by [`docs/semiont/ROUTINE.en.md`](docs/semiont/ROUTINE.en.md) (v2.0, 3 proposed inactive routines, 5-stage lifecycle, design principles; CLAUDE.md boot flow already points here)
- [x] Test upstream merge: `git fetch upstream && git merge upstream/main --no-commit` then abort
- [x] Verify `.gitattributes` protects correctly (merge.ours.driver=true confirmed; per-clone config required)

> **Fork-integrity notes (Round 4, 2026-06-24):**
>
> - `merge.ours.driver=true` is per-clone config (not stored in repo). Any fresh clone must run `git config merge.ours.driver true` before merging upstream.
> - Root-level protected files (CLAUDE.md, README.md, CONTRIBUTING.md): merge=ours works perfectly, 0 incoming changes.
> - `knowledge/**` limitation: merge=ours cannot auto-resolve modify/delete conflicts (193 files upstream modified that we deleted) or block NEW files upstream adds (36 new Taiwan articles would land). Future merges need manual cleanup of these two categories.
> - Upstream divergence at fetch (cadd10fad..244ced555): 1866 files changed, +41636/-15442 lines.

### Phase 6: Skill Namespace Migration (`lb-*` skills + router) 🔄 IN PROGRESS

Phase 5 audited all 37 skills ([`reports/phase5-skill-audit.md`](reports/phase5-skill-audit.md): 21 reusable / 11 Taiwan-specific / 5 defer) but only ported the core content loop (`lb-become`, `lb-write`, `lb-sync`) plus the new orchestration loop (`lb-implement`, `lb-review`). This phase ports the remaining reusable skills into the `lb-*` namespace and adds an `lb` router so they're discoverable.

**Porting pattern** (same thin-shell discipline as `lb-become`/`lb-sync` — see [`.claude/skills/README.md`](.claude/skills/README.md) design tenets):

1. **Thin shell.** SKILL.md = trigger keywords + a forced "read pipeline / run script" line + a one-line wrap-up note. No restated stages (drift = decay).
2. **Gate on `lb-become`**, never `twmd-become`/`BECOME_TAIWANMD.md`. Reference `BECOME_LAGUNABEACH.md` + the `.en` docs.
3. **English triggers** in `description` (this fork is English-default). Swap Taiwan content/accounts/`三源`/sovereignty framing for LB equivalents or drop it.
4. **Point at real LB scripts** (verify with `ls` per Rule 6 — several upstream paths moved: `test-frontmatter.mjs` is in `scripts/core/`, `test-wikilinks.mjs`/`check-references.mjs` in `scripts/utils/`).
5. **Don't translate the 200KB Chinese pipeline docs.** Where a skill needs a pipeline, write a SHORT `.en.md` sequencer (the `lb-write` ← `REWRITE-PIPELINE.en.md` precedent), or make the skill self-contained if it just wraps a script.

**Tiers** (do cheapest/highest-value first; a skill is only worth creating if its capability works for LB _now_ — no speculative dead skills):

- **Tier A — self-contained, no pipeline doc, useful now:**
  - [x] `lb` — router. Globs `.claude/skills/lb-*`, lists them + LB vitals, routes only (no execution). → [`.claude/skills/lb/SKILL.md`](.claude/skills/lb/SKILL.md)
  - [x] `lb-validate` ← `taiwanmd-validate`. Runs `article-health.py` + `scripts/core/test-frontmatter.mjs` + `scripts/utils/{test-wikilinks,check-references}.mjs`; standards from `EDITORIAL.en.md`. → [`.claude/skills/lb-validate/SKILL.md`](.claude/skills/lb-validate/SKILL.md)
  - [x] `lb-search` ← `taiwanmd-search`. Wraps `cli/src/index.js search/read/list` over LB content. → [`.claude/skills/lb-search/SKILL.md`](.claude/skills/lb-search/SKILL.md)
- **Tier B — wraps an existing LB build script (light adaptation):**
  - [x] `lb-embeddings` ← `twmd-embeddings` — wrap `prebuild:related` / `build-related-tagoverlap.mjs` (bge-m3 tabled per Phase 5 R10; tag-overlap is current). → [`.claude/skills/lb-embeddings/SKILL.md`](.claude/skills/lb-embeddings/SKILL.md)
  - [x] `lb-refresh` ← `twmd-refresh` — wrap `prebuild:dashboard` + `prebuild:llms` (drop `三源`/sense fetch — no GA4/SC/CF accounts yet). → [`.claude/skills/lb-refresh/SKILL.md`](.claude/skills/lb-refresh/SKILL.md)
  - [ ] `lb-release` ← `twmd-release` — release tagging + changelog (only once LB starts tagging releases).
  - [ ] `lb-language-birth` ← `twmd-language-birth` — register a new locale (zh-TW already enabled; useful when adding a 3rd lang).
- **Tier C — needs a SHORT `.en.md` pipeline sequencer first:**
  - [x] `lb-translate` ← `twmd-translate` (`TRANSLATION-PIPELINE.en.md`) → [`.claude/skills/lb-translate/SKILL.md`](.claude/skills/lb-translate/SKILL.md) + [`docs/pipelines/TRANSLATION-PIPELINE.en.md`](docs/pipelines/TRANSLATION-PIPELINE.en.md)
  - [x] `lb-factcheck` ← `twmd-factcheck` (`FACTCHECK-PIPELINE.en.md`; pairs with Rule 12) → [`.claude/skills/lb-factcheck/SKILL.md`](.claude/skills/lb-factcheck/SKILL.md) + [`docs/pipelines/FACTCHECK-PIPELINE.en.md`](docs/pipelines/FACTCHECK-PIPELINE.en.md)
  - [ ] `lb-evolve` ← `twmd-evolve` (`EVOLVE-PIPELINE.en.md`; needs analytics to be non-trivial)
  - [ ] `lb-analyze` ← `twmd-analyze` (`ANALYSIS-PIPELINE.en.md`)
  - [ ] `lb-maintainer` ← `twmd-maintainer` / `lb-pr-review` ← `twmd-pr-review` (`MAINTAINER-PIPELINE.en.md`; needs PR volume)
  - [ ] `lb-heartbeat` ← `twmd-heartbeat` / `heartbeat`, `lb-finale` ← `twmd-finale`, `lb-routine` ← `twmd-routine`, `lb-routine-audit`, `lb-probe`, `lb-babel`, `lb-batch-audit`, `lb-weekly-report`
- **DEFER — blocked on LB organs that don't exist yet** (diary, LESSONS-INBOX, MEMORY-PIPELINE, Supabase feedback): `lb-diary`, `lb-distill`, `lb-memory`, `lb-self-evolve`, `lb-feedback-triage`. Build the organ first, then the skill.
- **Taiwan-specific — DELETED R16+R17:** `twmd` (router), `taiwanmd-search`, `taiwanmd-validate`, `twmd-bench`, `twmd-music-media-audit`, `twmd-news-lens`, `twmd-peer`. **HELD:** `twmd-become` (25 remaining skills gate on it). **Port-first dormant:** `twmd-harvest`, `twmd-spore{,-pick,-publish}` (4 skills stay as reference until their lb-\* port is built, then deleted).
- **Tier C — editorial-rebornable ports** (from Phase 7 disposition triage, queued R16):
  - [x] `lb-media-audit` ← `twmd-music-media-audit` — audit LB articles for media/image/iframe embeds against EDITORIAL media standard. Then `git rm` the `twmd-music-media-audit` original. **DONE R17.**
  - [x] `lb-news-lens` ← `twmd-news-lens` — LB local-news content opportunity lens. Must define LB news sources (not copy Taiwan's 三源). Then `git rm` the `twmd-news-lens` original. **DONE R17.**
  - [x] `lb-peer` ← `twmd-peer` — LB local-institution curation (Laguna Art Museum, LBHS, Festival of Arts). Must scope LB institutions (not copy TFT/NMTH). Then `git rm` the `twmd-peer` original. **DONE R17.**

> **Soft spots flagged in the Phase 5 audit, still open:** (1) verdicts were assigned by reading SKILL.md descriptions, not by test-porting — a "reusable" skill may still have Taiwan assumptions in its pipeline doc that only surface on first run (same failure class as the supporters/spores leaks). Port + run each before trusting it. (2) Tier C skills are blocked on writing their `.en.md` pipeline sequencers; that's the bulk of the remaining work.

### Phase 7: Taiwan-inheritance resolution (rewrite-or-delete sweep) 🔄 IN PROGRESS

The fork conversion (Phases 0–5) localized the _site_. This phase finishes the job on the _non-shipped_ inheritance: for every remaining Taiwan-specific artifact, **rewrite it for LB or delete it** (per the Rule 1 clarification). Default to delete when there's no LB use and rewriting isn't worth it. These are dev-only files (not user-facing, no leak risk like the supporters/spores site leaks) — lower urgency, but they're noise and they misrepresent the repo as Taiwan's.

> **Upstream-merge caveat:** none of these paths are `merge=ours`-protected, so a future `git fetch upstream && git merge upstream/main` will re-flood them with Taiwan files. When that happens, re-run the relevant sweep below (or extend `.gitattributes` if a path should permanently reject upstream).

- [x] **`reports/` — Taiwan session history (592 → 8).** Deleted 584 Taiwan operational/research reports (analytics, spore harvests, sovereignty-bench, peer ingestion, election hub, SEO, incident logs, session handoffs). **Kept:** the 2 LB reports (`phase5-skill-audit`, `phase5-related-experiment`), `README.md` (dir mechanism — rewrite for LB's own future reports), and a small pipeline/methodology design-rationale set for Tier-C ports (`analysis-pipeline-design`, `research-methodology-synthesis`, `research-pipeline-v65-experiment`, `rewrite-pipeline-v5-stage-spine-design`, `routine-spec`).
- [x] **`reports/README.md` + the kept design docs** — README rewritten for LB; 5 Taiwan methodology docs marked with header note ("Taiwan-inheritance reference, methodology kept for LB skill ports, not LB content"). All 5 still referenced by active docs/pipelines.
- [ ] **~14 `src/` comment citations** of deleted report filenames (e.g. `SporeFootprint.astro`, `article-render.ts`) — now dangling doc-references. Cosmetic; clean up when next editing each file (don't touch code just for comments).
- [x] **Spores** — owner chose **empty-data-keep-pipeline-dormant** (2026-06-25). Emptied SSOT `spore-log.json`/`spore-metrics.json` to `[]` (was 137 Taiwan posts + engagement), deleted `SPORE-BLUEPRINTS/` (60) + `SPORE-HARVESTS/` (40), reset `SPORE-LOG.md`/`SPORE-INBOX.md` buffers, regenerated derived (`src/data/spores.json`, `public/api/spores.json`, `dashboard-spores.json` → 0). Kept dormant: `prebuild:spores`, `scripts/tools/spore-*.py`, `SporeFootprint` + components, `SPORE-*-PIPELINE.md`. Commits `3c18ef16a` + `10c71aab7`. Build PASS.
- [x] **Analytics** (`public/api/dashboard-analytics.json`) — emptied to neutral no-data shape (consumers guard with try/catch + `if (cf)`). Was 47KB/24 Taiwan refs → now 11-line placeholder, 0 Taiwan refs. Build PASS.
- [x] **`docs/factory/` Taiwan spore/peer machinery** — deleted Taiwan operational data (HARVEST-EVOLVES-PENDING/ 8, HARVEST-FRAMING-PENDING/ 7, HARVEST-REPLIES-PENDING/ 6, CAROUSEL-BLUEPRINTS/ 10 = 31 files). Kept dormant pipeline docs (Rule 1). `spore-content-fingerprints.json` + `spore-defer.json` already neutral (empty data). No build-chain consumers (all refs in dormant `scripts/tools/`).
- [x] **Residual sovereignty / Taiwan refs** — Phase 4.5 did the framing purge; re-grep `台灣|taiwan|sovereignty|@taiwandotmd` across non-`knowledge/`, non-intentional-credit paths to catch leftovers.
  - R12 (2026-06-25): shipped src/ surface fixed — Layout.astro zh-TW meta description, feedback i18n.ts zh-TW hint, Layout.astro dead `/resources` redirect removed. Dormant `tw-tiles` renderer kept (Rule 1).
  - R13 (2026-06-25): i18n.ts all 4 remaining locales (ja/ko/es/fr) typeNewtopicHint fixed. content-dates generator ghost-path bug fixed (added currentTree existence filter; 879→18 entries, 0 Taiwan refs). CAT_TO_SLUG extended with 6 LB categories. MIN_EXPECTED lowered to 5. Remaining: scripts/ ~62 files (bench/tools) — owner scope call.
  - R15 (2026-06-25): disposition inventory produced: [`reports/phase7-taiwan-tooling-inventory.md`](reports/phase7-taiwan-tooling-inventory.md).
  - R16 (2026-06-25): `scripts/bench/` deleted (9 files, 0 consumers). `scripts/tools/` deliberate-keep (48 generic-keep build-chain/editorial + 38 port-seed-dormant). DONE.
- [ ] **Taiwan-specific skills** (the 12 from R15 inventory) — port-first rule applied.
  - R15 (2026-06-25): disposition inventory produced: [`reports/phase7-taiwan-tooling-inventory.md`](reports/phase7-taiwan-tooling-inventory.md).
  - R16 (2026-06-25): deleted 4 (twmd router, taiwanmd-search, taiwanmd-validate, twmd-bench). 7 idea-reusable kept dormant (port-first: 3 editorial-rebornable queued in Phase 6 Tier C, 4 social-gated blocked). 1 held (twmd-become, 28 dependents).
  - R17 (2026-06-25): ported 3 editorial-rebornable (twmd-peer → lb-peer, twmd-news-lens → lb-news-lens, twmd-music-media-audit → lb-media-audit), then `git rm` originals. 4 social-gated remain dormant. twmd-become dependents 28 → 25.

---

**Migration core complete (2026-06-24).** Phases 0–5 done (site fully localized). Phase 6 (skill namespace) + Phase 7 (Taiwan-inheritance sweep) in progress — tracked above. Build green (en 0 broken, 0.12% overall). Remaining pre-existing items (6 `/zh-TW` dead links from enabled-but-empty locale) are operational debt, not migration.

---

## Key Facts

- Working directory: `/Users/wchoi/src/lagunabeach-md`
- Old standalone (archived): `/Users/wchoi/src/lagunabeach-md-v0`
- User has RTX 4090 (for embeddings when ready)
- User is native Chinese speaker (can validate translations)
- bun is installed at ~/.bun/bin/bun
- Node >= 22.12.0 required
- Dev server: `npm run dev` (port 4321 or next available)
- Build: `npm run build` (~25s for 15 articles)
- Upstream sync: `git fetch upstream && git merge upstream/main`
