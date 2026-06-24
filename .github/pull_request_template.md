## What does this PR do?

<!-- Brief description of the change -->

## Change type

- [ ] New article
- [ ] Edit/update existing article
- [ ] Translation (en -> zh-TW or other lang)
- [ ] Bug fix (factual correction, typo, broken link)
- [ ] Technical change (code, styles, config)
- [ ] Documentation update (README, CONTRIBUTING, etc.)

## Self-check

- [ ] Article has complete frontmatter (title, description, date, tags, category)
- [ ] `category` is one of the 8 canonical slugs: `history`, `art-galleries`, `nature-marine-life`, `food`, `beaches`, `trails`, `events-festivals`, `neighborhoods`
- [ ] `author: 'LagunaBeach.md Contributors'`
- [ ] `featured: false` (featured is managed by maintainers)
- [ ] Footnotes use canonical format: `[^N]: [Title](URL) - description`
- [ ] Content has verifiable sources (no vague "see related literature" citations)
- [ ] No plagiarism or copyright issues
- [ ] Local build passes (`npm run build`, recommended but not required)

## If touching styles (non-content PRs only)

- [ ] No hardcoded hex colors, use `var(--token)` or Tailwind arbitrary values (`bg-[#xxxxxx]`)
- [ ] Prefer inline Tailwind utilities; scoped `<style>` only for repeated patterns, JS state machines, `:global()`, or CSS variable state machines
- [ ] No new `@layer components`, `@apply`, or `@theme` bridge
- [ ] If removing class markup, also remove the corresponding scoped rule in the same commit
- [ ] Check [`docs/refactor/DESIGN.md`](../docs/refactor/DESIGN.md) decision tree

## Related Issue

<!-- If applicable, reference the issue number -->

Closes #

## Screenshots (if visual change)

<!-- Optional: before/after comparison -->
