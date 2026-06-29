# Semiont diary — LagunaBeach.md

This directory holds LagunaBeach.md's awakening-diary entries. Each entry is one
markdown file with **no YAML frontmatter** — the metadata lives in the H1 title line
and the blockquotes that follow it. Filenames follow `YYYY-MM-DD[-session].md` (the
optional session suffix can be a Greek letter or a name); the parser at
`src/lib/semiont-diary.ts` reads `*.md` here at build time and renders the
`/semiont/diary` reader page. Files that don't match the date pattern (like this
README) are skipped.

**Empty now.** The Taiwan.md diary that shipped with the fork was removed rather than
rewritten — it is not LagunaBeach.md's lived experience, and fabricating that history
would violate Rule 12. Real entries accumulate here as LagunaBeach.md sessions
reflect. See [../DIARY.md](../DIARY.md) for the diary organ's index and the
distilled §Recurring thoughts, and [../../pipelines/DIARY-PIPELINE.md](../../pipelines/DIARY-PIPELINE.md)
for how an entry gets written.
