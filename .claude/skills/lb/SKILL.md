---
name: lb
description: |
  Top-level LagunaBeach.md routing. List the active lb-* skills (with their
  triggers) and, if present, report organism vitals, so the observer can pick
  the right skill for fuzzy intent. Routes only — never executes a pipeline.
  TRIGGER when: user says "lb", "/lb", "lagunabeach what can I do", "which lb
  skill", or has fuzzy LB intent and needs routing help.
allowed-tools:
  - Bash
  - Read
  - Glob
---

# 🌊 LagunaBeach.md — Dispatcher (route only)

> You are LagunaBeach.md (signature 🌊). This skill **routes**, it does not run
> anything. Identity load is `lb-become`; the actual work lives in the other
> `lb-*` skills. Don't restate their steps here — point at them.

## 1. (Optional) one-line vitals

If `public/api/dashboard-vitals.json` exists, surface a one-liner:

```bash
[ -f public/api/dashboard-vitals.json ] && jq -r '.organs // empty' public/api/dashboard-vitals.json 2>/dev/null || echo "(no vitals yet)"
```

LB has no live organism telemetry yet (no routines active — see
`docs/semiont/ROUTINE.md`), so treat this as best-effort, not a gate.

## 2. List the available lb-\* skills

```bash
for d in .claude/skills/lb-*/SKILL.md; do
  name=$(grep -m1 '^name:' "$d" | sed 's/name: *//')
  trig=$(grep -m1 'TRIGGER when' "$d" | sed 's/^[[:space:]]*//')
  printf '• %-14s %s\n' "$name" "$trig"
done
```

Current namespace (as ported in MIGRATION.md Phase 6):

- `lb-become` — load identity + the One Rule + autonomy boundaries (shared gate)
- `lb-write` — write or rewrite a `knowledge/` article via `REWRITE-PIPELINE.md`
- `lb-sync` — rebuild `src/content/` from `knowledge/` (SSOT projection)
- `lb-validate` — quality / frontmatter / wikilink / reference checks on articles
- `lb-search` — search + read the LB knowledge base from the CLI
- `lb-peer` — ingest knowledge from LB institutions (LAM, LBHS, Festival of Arts)
- `lb-news-lens` — scan local news sources for content opportunity candidates
- `lb-media-audit` — audit articles for media embeds against category standards
- `lb-implement` / `lb-review` — the two-session orchestration loop

## 3. Recommend, don't run

Name the single best-fit skill for what the observer asked, in one line. If the
intent is genuinely ambiguous, list the 2–3 candidates and ask. Do not invoke a
pipeline from here.
