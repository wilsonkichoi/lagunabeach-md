# Round 31 task — for implementer (2026-06-30) — ROADMAP Horizon 0.6 / Group 2

## Context

Horizon 0.6 Group 1 (lang-sync/ 25 files) confirmed done. Group 2 is the
article-health check plugins.

## Task

Translate Chinese comments/docstrings to English in `scripts/tools/lib/article_health/`
(17 files, ~350 CJK lines). These are the quality-check plugins that run during
`prebuild:dashboard` and `pre-commit`.

### Files

```
scripts/tools/lib/article_health/__init__.py
scripts/tools/lib/article_health/loader.py
scripts/tools/lib/article_health/types.py
scripts/tools/lib/article_health/checks/cjk_punct.py
scripts/tools/lib/article_health/checks/correction_meta.py
scripts/tools/lib/article_health/checks/cross_reference.py
scripts/tools/lib/article_health/checks/footnote_density.py
scripts/tools/lib/article_health/checks/footnote_format.py
scripts/tools/lib/article_health/checks/footnote_url.py
scripts/tools/lib/article_health/checks/frontmatter_title.py
scripts/tools/lib/article_health/checks/image_alt.py
scripts/tools/lib/article_health/checks/image_health.py
scripts/tools/lib/article_health/checks/link_target.py
scripts/tools/lib/article_health/checks/prose_health.py
scripts/tools/lib/article_health/checks/rationale_presence.py
scripts/tools/lib/article_health/checks/spore_writing.py
scripts/tools/lib/article_health/checks/viz_health.py
scripts/tools/lib/article_health/checks/wikilink_target.py
```

### Key considerations

- These plugins have `APPLIES_TO` fields. Some are `["zh-TW"]` only (cjk_punct,
  spore_writing). Those are dormant on LB but kept per Horizon 0.4 decision.
  Translate their comments anyway.
- CJK in regex patterns that MATCH article content (Chinese heading patterns,
  punctuation matchers, title puffery word lists) is KEEP. These are the tool's
  detection logic for zh-TW articles.
- `EDITORIAL_REF` strings that reference Chinese section names (like
  `"SPORE-WRITING.md §進階寫作技術"`) are data pointers. KEEP if the referenced
  file still uses that heading; translate if the heading was already translated.

## Must-fix carried over

None.

## Constraints

- Do everything in THIS session. No subagents/agents.
- Verify: `uvx --with pyyaml pytest tests/article_health -q` (229 tests must pass)
- Verify: `python3 -c "import py_compile; ..."` for each edited .py
- Build after: `npm run prebuild` green
- Commit: `refactor(de-taiwan): translate article-health check plugins to English`
- Report back in DONE / VERIFIED / DEFERRED 3-table format.
