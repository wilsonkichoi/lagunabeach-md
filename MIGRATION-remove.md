# Removal Candidates

These files/features are Taiwan-specific and don't apply to LagunaBeach.md.
Review and approve/reject each before removal.

Items marked with Taiwan ref counts to show scope.

---

## Pages to remove

- `src/pages/taiwan-shape.astro` — Taiwan island SVG interactive page (route: /taiwan-shape)
- `src/pages/en/taiwan-shape.astro` — English route for Taiwan shape page
- `src/pages/es/taiwan-shape.astro` — Spanish route for Taiwan shape page
- `src/pages/fr/taiwan-shape.astro` — French route for Taiwan shape page
- `src/pages/ja/taiwan-shape.astro` — Japanese route for Taiwan shape page
- `src/pages/ko/taiwan-shape.astro` — Korean route for Taiwan shape page
- `src/pages/companies.astro` — Taiwan companies/corporations page
- `src/pages/en/projects.astro` — Taiwan open source projects page
- `src/pages/projects.astro` — Taiwan open source projects page (zh-TW)
- `src/pages/terminology/index.astro` — Taiwan terminology converter (Chinese Traditional/Simplified)
- `src/pages/terminology/converter.astro` — Terminology conversion tool
- `src/pages/terminology/[id].astro` — Individual terminology entries
- `src/pages/lifetree/index.astro` — Taiwan "life tree" feature
- `src/pages/lifetree/[slug].astro` — Individual life tree entries
- `src/pages/feedback-uxtest.astro` — UX test page (Taiwan-specific feedback)
- `src/pages/fork-graph.astro` — Fork lineage graph (Taiwan.md ecosystem tracking)

## Templates to remove

- `src/templates/taiwan-shape.template.astro` — Taiwan island SVG template
- `src/templates/elections-2026.template.astro` — Taiwan 2026 elections page
- `src/templates/opendata.template.astro` — Taiwan open data portal template
- `src/templates/semiont-landing.template.astro` — Semiont landing page (Taiwan.md specific)
- `src/templates/semiont-page.template.astro` — Semiont sub-pages
- `src/templates/semiont-diary-list.template.astro` — Semiont diary listing

## Components to remove

- `src/components/semiont/TaiwanSketch.astro` — Taiwan island sketch SVG component
- `src/components/semiont/SemiontOrganismDiagram.astro` — Semiont organism visualization
- `src/components/LifeTree.astro` — Life tree visualization component
- `src/components/ProticoScript.astro` — Protico feedback widget (Taiwan.md specific)

## i18n files to remove or fully rewrite

- `src/i18n/taiwanShape.ts` — Taiwan shape page i18n (all 6 languages, Taiwan island SVG labels)
- `src/i18n/map.ts` — **2037 Taiwan refs**. Contains Taiwan county names, routes (Night Markets, National Parks, etc.), all fully Taiwan geographic data. Needs full replacement with LB map data (already done in Phase 3 for the map page itself, but this i18n file still has legacy Taiwan content)
- `src/i18n/data.ts` — **412 Taiwan refs**. Taiwan open data descriptions, dataset listings
- `src/i18n/resources.ts` — **298 refs**. Taiwan-specific resource links, organizations
- `src/i18n/about.ts` — **402 refs**. Taiwan.md origin story, team, sponsors (justfont, Portaly)
- `src/i18n/assets.ts` — **111 refs**. Taiwan-themed SVG asset library descriptions
- `src/i18n/semiont.ts` — **54 refs**. Semiont page UI strings specific to Taiwan.md identity
- `src/i18n/contribute.ts` — **218 refs remaining** after partial cleanup. Many in non-English blocks

## Data files to remove or fully rewrite

- `src/data/soundscape-data.ts` — **29 refs**. Taiwan field recordings, locations
- `src/data/opendata-content.ts` — **300 refs**. Taiwan government open data sources
- `src/data/resources-data.ts` — **50 refs**. Taiwan-specific resource links
- `src/data/mcp-content.ts` — **108 refs**. MCP server content referencing Taiwan.md
- `src/data/feedbacks.ts` — **41 refs**. User feedback/testimonials about Taiwan.md

## Semiont pages (keep dormant per MIGRATION.md Phase 5)

These pages are Semiont system pages. Per MIGRATION.md, Semiont docs/skills/routines are "dormant, will grow into them." Keep the files but they contain Taiwan.md-specific identity content that will need adaptation in Phase 5:

- `src/pages/semiont/anatomy.astro`
- `src/pages/semiont/consciousness.astro`
- `src/pages/semiont/dna.astro`
- `src/pages/semiont/heartbeat.astro`
- `src/pages/semiont/longings.astro`
- `src/pages/semiont/manifesto.astro`
- `src/pages/semiont/speciation.astro`
- `src/pages/semiont/unknowns.astro`

## Notes

- Footer justfont sponsor section already removed in this session
- Footer categories already updated to LB's 8 categories
- Header branding already updated in Phase 2
- Map page already replaced with Leaflet in Phase 3
- The map.ts 2037 refs are mostly dead code (Taiwan routes/counties no longer rendered) but kept per Rule 2 (don't remove infrastructure)
