# Task: Horizon 0.6 — scripts/ English-only translation (Group 1)

## What

Translate Chinese comments, docstrings, and print strings to English in
`scripts/tools/lang-sync/` (25 files, ~400 CJK lines). This is Group 1 of 8
in ROADMAP.md §3.6 (Horizon 0.6).

## Context

The build pipeline is already fully English (scripts/core/ + build-path tools done
2026-06-30). These remaining 163 files are developer tools not in the build path.
They function correctly — the CJK is cosmetic (comments/docstrings), but the goal
is a codebase readable by English-only contributors.

## Method (from ROADMAP.md §3.6)

Per file:

1. **Read and understand** what the script does, its data dependencies, and whether
   it's LB-relevant or Taiwan-only dead code.
2. **Decide disposition:** translate / delete / keep-dormant.
3. **Translate** comments, docstrings, print/log strings, argparse help, error
   messages to English. Reground `taiwan.md` → `lagunabeach.md`, `哲宇`/`CheYu`
   → generic terms where it's not an upstream credit.
4. **Keep CJK** in regex patterns matching zh-TW content and in translation prompt
   templates (those are the tool's function).
5. **Verify** `python3 -c "import py_compile; py_compile.compile('<file>', doraise=True)"`
   for each .py file after editing. `bash -n <file>` for .sh.

Do NOT do mechanical dictionary substitution. Each file needs contextual reading.

## Files (Group 1: lang-sync/)

```
scripts/tools/lang-sync/audit-quality.py
scripts/tools/lang-sync/backends/__init__.py
scripts/tools/lang-sync/backends/_base.py
scripts/tools/lang-sync/backends/_prompt.py
scripts/tools/lang-sync/backends/codex.py
scripts/tools/lang-sync/backends/gemini.py
scripts/tools/lang-sync/backends/ollama.py
scripts/tools/lang-sync/backends/openrouter.py
scripts/tools/lang-sync/backfill-frontmatter.py
scripts/tools/lang-sync/backfill-source-body-hash.py
scripts/tools/lang-sync/backfill-source-sha.py
scripts/tools/lang-sync/bump-source-sha.py
scripts/tools/lang-sync/codex-translate.py
scripts/tools/lang-sync/compare-decomposition.sh
scripts/tools/lang-sync/cross-lang-audit.py
scripts/tools/lang-sync/diary-translate.py
scripts/tools/lang-sync/diary-translation-audit.py
scripts/tools/lang-sync/diff-patch-prepare.py
scripts/tools/lang-sync/lang-renormalize.py
scripts/tools/lang-sync/ollama-translate.py
scripts/tools/lang-sync/openrouter-stress.sh
scripts/tools/lang-sync/openrouter-translate.py
scripts/tools/lang-sync/optimized-translate.py
scripts/tools/lang-sync/prepare-batch.py
scripts/tools/lang-sync/prioritize-batch.py
scripts/tools/lang-sync/refresh.sh
scripts/tools/lang-sync/slug-suggest.py
scripts/tools/lang-sync/status.py (already done — verify only)
scripts/tools/lang-sync/sync-on-update.py
scripts/tools/lang-sync/translate.py
scripts/tools/lang-sync/verify-batch.py
scripts/tools/lang-sync/verify-translation.py
```

## Verification

- All .py files pass `py_compile`
- All .sh files pass `bash -n`
- `npm run prebuild` still green (these aren't in the build path, but sanity check)
- Commit message: `refactor(de-taiwan): translate scripts/tools/lang-sync/ to English`

## After this group

Update ROADMAP.md: check off Group 1. Then seed this file with Group 2
(article-health checks) for the next session.
