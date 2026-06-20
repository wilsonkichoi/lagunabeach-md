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

Remaining known stale content (not blocking, documented for Phase 5+):

- `/about` team/timeline/origin story still has Taiwan.md narrative
- `/data`, `/soundscape`, `/contribute`, `/mcp`, `/resources` pages still have Taiwan content
- Footer category links still reference Taiwan's 12 categories
- These pages need full content rewrites with LB-specific material, not mechanical substitution

### Phase 4: Shadow Translation ✅ COMPLETE

- `docs/editorial/EDITORIAL.en.md` (280 lines) - universal writing principles with LB examples (scene/object/contradiction finding, opening/ending discipline, article grading, concrete detail requirements)
- `BECOME_LAGUNABEACH.md` (220 lines) - AI identity boot file: project identity, upstream relationship, key rules, category structure, editorial principles, dev workflow, shadow-translation convention
- `docs/semiont/MANIFESTO.en.md` (149 lines) - Semiont philosophy comprehension guide: core beliefs, evolution dimensions, tropical rainforest theory
- `docs/semiont/ROUTINE.en.md` (138 lines) - automation system guide: design principles, 5-stage lifecycle, 16-routine inventory, adoption roadmap for LB
- Shadow-translation convention documented in BECOME_LAGUNABEACH.md §Shadow Translation Convention (rules, current inventory table)

### Phase 5: Path B Preparation (Semiont Scaffolds) ⬜ NOT STARTED

Tasks:

- [ ] Review all 38 `.claude/skills/twmd-*/SKILL.md` - categorize as reusable vs Taiwan-specific
- [ ] Create 3 LB skills: `lb-write`, `lb-rewrite`, `lb-sync`
- [ ] Adapt `scripts/tools/article-health.py` for English content
- [ ] Adapt `scripts/core/build-embeddings.mjs` for local RTX 4090 (bge-m3 works for English)
- [ ] Create minimal `ROUTINE.md` (2-3 inactive routines documented)
- [ ] Test upstream merge: `git fetch upstream && git merge upstream/main --no-commit` then abort
- [ ] Verify `.gitattributes` protects correctly

---

## Key Facts

- Working directory: `/Users/wchoi/src/lagunabeach-md-fork`
- Old standalone (archived): `/Users/wchoi/src/lagunabeach-md` (points to lagunabeach-md-v0)
- User has RTX 4090 (for embeddings when ready)
- User is native Chinese speaker (can validate translations)
- bun is installed at ~/.bun/bin/bun
- Node >= 22.12.0 required
- Dev server: `npm run dev` (port 4321 or next available)
- Build: `npm run build` (~25s for 15 articles)
- Upstream sync: `git fetch upstream && git merge upstream/main`
