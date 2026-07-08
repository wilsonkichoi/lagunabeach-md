# External links in article surface need no-external-icon class

Global CSS (`src/styles/global.css`) appends a ↗ pseudo-element to any
`main a[target='_blank']` that doesn't carry one of the exclusion classes. When adding
`target="_blank"` links inside article templates or components (sources, share buttons,
contribution links, image credits), add `class="no-external-icon"` to suppress the arrow.

The exclusion list in the CSS selector covers: `.nav-link`, `[class*='btn']`, `.card-link`,
`.logo`, `.category-card`, `.floating-md`, `.contributor-card`, `.no-external-icon`. Article
surface links match none of these by default.

**Why (LB-7):** source URLs and share/edit buttons rendered with trailing ↗ arrows and
misaligned layout because they had `target="_blank"` but no exclusion class. Fixed by adding
`no-external-icon` to every external link in article.template.astro and ArticleSidebar.astro.
