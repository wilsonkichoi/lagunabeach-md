# Migration: taiwan-md -> lagunabeach-md

Fork of [frank890417/taiwan-md](https://github.com/frank890417/taiwan-md) following the [country-md-starter](https://github.com/frank890417/taiwan-md/blob/main/docs/fork/COUNTRY-MD-STARTER.md) Path A pattern, with intent to grow into Path B (Semiont system) over time.

## Core Principles

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
- All `lang === 'zh-TW'` checks in upstream code are replaced with `lang === 'en'` for "is this the default language?" logic

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
- Created `.gitattributes` (merge=ours for CLAUDE.md and knowledge/**)
- Cleared Taiwan content from knowledge/, added 8 LB category dirs with 15 articles
- Updated `src/config/languages.mjs/.ts`: English default + zh-TW enabled
- Updated `scripts/core/sync.sh`: 8 LB categories, slugify with sed, `en` as default
- Updated `astro.config.mjs`: site URL only (kept all other infrastructure intact)
- Updated CATEGORY_MAPPING in: `[category]/[slug].astro`, `category-static-paths.ts`, `categoryConfig.ts`, `article.template.astro`, `build-search-index.mjs`
- Updated `CategoryGrid.astro`: dynamic from categoryConfig instead of hardcoded
- Fixed duplicate ID bug in search index (when DEFAULT_LANGUAGE.code === 'en')
- Simplified `.husky/pre-commit`: bunx with $HOME/.bun/bin PATH, kept ALL quality checks
- Updated `package.json`: name/description/version only, all scripts retained with `|| true` for failing ones
- Updated `public/CNAME`: lagunabeach.md

### Phase 2: Localization ✅ COMPLETE

- Typography: Inter as primary body/interface font, Georgia for titles (Noto TC kept as zh-TW fallback)
- Color palette: systematic swap from Taiwan green to ocean blue (12 color mappings across 52+ files, including hex and rgba values)
- Branding: LagunaBeach.md throughout (title, BrandMark, hero, footer, SEO, structured data)
- SEO.astro: all metadata, JSON-LD, keywords, social links localized
- Header: English active by default, 8 LB categories in dropdown, nav links to own repo
- Footer: own repo/social links, "Built with love in Laguna Beach"
- Banner: only shows on non-default lang paths (not on English root)
- HomeEnHalls: full rewrite (511 lines) with LB narrative (4 halls: Coast, Story, Land, Life)
- CoverStory: LB timeline (Acjachemen, 1904 painters, 1918 Art Association, 1933 Pageant, 1993 firestorm, today, LagunaBeach.md)
- i18n/home.ts: all English strings localized (hero, stats, cover, features, etc.)
- Remaining: i18n strings in secondary pages (contribute, data, about templates) still have Taiwan content in non-English languages. These pages render but have stale prose. Fix as those pages are adapted.

### Phase 3: Infrastructure Adaptation ⬜ NOT STARTED

Tasks:
- [ ] Acquire Laguna Beach TopoJSON (Overpass Turbo: `relation["name"="Laguna Beach"]["boundary"="administrative"]; out geom;`)
- [ ] Create `src/data/laguna-beach-geocode.json` (landmarks with lat/lng)
- [ ] Adapt `scripts/core/generate-map-markers.js` for English place names, LB geocode data
- [ ] Update map page: D3 projection centered on ~33.54N, 117.78W, mode toggles for LB
- [ ] Knowledge graph: center node "LagunaBeach.md", 8 category nodes
- [ ] Re-enable prebuild scripts one by one: map markers, dashboard-data, contributors-data
- [ ] OG images: static fallback for now (no Playwright pipeline needed yet)
- [ ] RSS + sitemap: verify single-language output with correct URLs
- [ ] Explore page: verify search works with English content

### Phase 4: Shadow Translation ⬜ NOT STARTED

Tasks:
- [ ] `docs/editorial/EDITORIAL.en.md` - extract universal writing principles
- [ ] `BECOME_LAGUNABEACH.md` - AI identity boot file
- [ ] `docs/semiont/MANIFESTO.en.md` - shadow translate for comprehension
- [ ] `docs/semiont/ROUTINE.en.md` - shadow translate for future adoption
- [ ] Document shadow-translation convention in CLAUDE.md

### Phase 5: Path B Preparation (Semiont Scaffolds) ⬜ NOT STARTED

Tasks:
- [ ] Review all 38 `.claude/skills/twmd-*/SKILL.md` - categorize as reusable vs Taiwan-specific
- [ ] Create 3 LB skills: `lb-write`, `lb-rewrite`, `lb-sync`
- [ ] Adapt `scripts/tools/article-health.py` for English content
- [ ] Adapt `scripts/core/build-embeddings.mjs` for local RTX 4090
- [ ] Create minimal `ROUTINE.md` (2-3 inactive routines documented)
- [ ] Test upstream merge: `git fetch upstream && git merge upstream/main --no-commit` then abort
- [ ] Verify `.gitattributes` protects correctly

---

## Files Changed from Upstream (CATEGORY_MAPPING locations)

These files contain hardcoded category arrays that MUST match the 8 LB categories:

| File | What was changed |
|------|-----------------|
| `scripts/core/sync.sh` | CATEGORIES array, default lang `en`, slugify function |
| `scripts/core/build-search-index.mjs` | CATEGORY_MAP, legacy dedup fix |
| `src/utils/categoryConfig.ts` | Full rewrite (8 LB categories with colors/icons) |
| `src/utils/category-static-paths.ts` | CATEGORY_MAPPING, default lang check |
| `src/pages/[category]/[slug].astro` | CATEGORY_MAPPING, lang='en' |
| `src/templates/article.template.astro` | categoryMapping, lang checks, GitHub edit link |
| `src/templates/home.template.astro` | categoryFolders, hallGroups, isDefault logic |
| `src/components/CategoryGrid.astro` | Dynamic from categoryConfig (not hardcoded) |
| `src/components/Header.astro` | categoryList array, isEnActive logic, langOptions order |
| `src/components/home/HomeEnHalls.astro` | Full rewrite with LB narrative |

---

## MISTAKES MADE (read this before touching the codebase)

### Anti-Patterns: Rules for Future Sessions

#### 1. NEVER strip code because comments are in Chinese

Chinese comments ≠ Taiwan-specific code. The codebase is written by a Chinese-speaking developer. Comments explain universal infrastructure (quality gates, credential detection, parallel actor safety, etc.). If the comment is in Chinese, keep it. Add English translation next to it if needed.

**Rule:** If removing code, the reason must be "this code references Taiwan-specific DATA or IDENTITY" (e.g., Taiwan category names, Taiwan social links, Taiwan domain). Never "it's written in Chinese."

#### 2. NEVER remove packages/scripts because they "might fail"

In Phase 1, all devDependencies (playwright, sharp, pixelmatch, opencc-js) and 38 npm scripts were stripped from package.json because they "weren't needed yet." They all reference files that still exist in the repo. The scripts are universal infrastructure.

**Rule:** If a script might fail due to missing data, add `|| true` to make it non-fatal. Never remove it from package.json. Install missing packages rather than removing dependencies.

#### 3. NEVER rewrite a file from scratch when adapting

The `astro.config.mjs` was reduced from 413 to 99 lines. The `sync.sh` was rewritten from scratch. The pre-commit hook was gutted to 3 lines. All of these stripped universal infrastructure (hreflang SEO filter, sitemap i18n, build performance tuning, quality gates).

**Rule:** Restore the original file first (`git show upstream/main:path/to/file > path/to/file`), then make ONLY the changes that are necessary. A good adaptation changes 5-20 lines in a 400-line file, not rewrites it to 99 lines.

#### 4. NEVER assume "Taiwan-specific" without verifying

Things that ARE Taiwan-specific (correct to change):
- Content in `knowledge/` (articles about Taiwan)
- Taiwan.md branding (site name, domain, social handles)
- Taiwan category names (History, Geography, Culture, etc. -> LB categories)
- Taiwan statistics (400+ years, 59000 species)
- SPORE-LOG URL enforcement (their social media publishing workflow)
- Parallel actor detection process names (babel-handoff, lang-sync)

Things that are NOT Taiwan-specific (incorrect to remove):
- Pre-commit quality checks (credential detection, frontmatter validation, scope detection)
- Build scripts (article-health, dashboard, contributors, OG images)
- Dependencies (playwright, sharp, opencc-js, pixelmatch)
- CJK bigram tokenizer (still useful for zh-TW content)
- i18n infrastructure (we have zh-TW enabled)
- Comments in Chinese (they explain the code)

#### 5. Minimal change principle

For each file, ask: "What is the MINIMUM edit to make this work for LagunaBeach.md?"

Usually the answer is one of:
- Change a CATEGORY_MAPPING array (swap Taiwan's 14 categories for LB's 8)
- Change `lang === 'zh-TW'` to `lang === 'en'` for "is default language?" checks
- Change `taiwan.md` domain to `lagunabeach.md`
- Change `frank890417/taiwan-md` repo to `wilsonkichoi/lagunabeach-md`
- Change branding strings (Taiwan.md -> LagunaBeach.md)

Everything else stays.

#### 6. Install missing tools, don't work around them

When `bunx` wasn't found, the correct fix was `curl -fsSL https://bun.com/install | bash`, not rewriting the hook to use npx with a fallback. When a Python script fails, install the dependency, don't remove the script.

---

## Working Directory

The fork lives at: `/Users/wchoi/src/lagunabeach-md-fork`
The old standalone (archived): `/Users/wchoi/src/lagunabeach-md` (points to lagunabeach-md-v0)

## Key Facts

- User has RTX 4090 (for embeddings when ready)
- User is native Chinese speaker (can validate translations)
- bun is installed at ~/.bun/bin/bun
- Node >= 22.12.0 required
- Dev server: `npm run dev` (port 4321 or next available)
- Build: `npm run build` (~25s for 15 articles)
- Upstream sync: `git fetch upstream && git merge upstream/main`
