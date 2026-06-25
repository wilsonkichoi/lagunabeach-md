---
name: lb-news-lens
description: |
  LB local-news content opportunity lens. Scans verified Laguna Beach news
  sources for topics that could become new articles or improve existing ones.
  Output = content-opportunity candidates appended to knowledge/INBOX.md (NOT
  spores — LB has no social presence). Uses EVOLVE-PIPELINE as methodology.
  TRIGGER when: user says "news lens", "/lb-news-lens", "scan local news",
  "content opportunities", "what's happening in Laguna", or asks for
  news-driven article candidates.
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - Grep
  - WebFetch
  - WebSearch
---

# 🌊 LagunaBeach.md — News Lens (thin wrapper)

> **Intentionally thin.** Methodology lives in `EVOLVE-PIPELINE.md`. This skill
> defines LB's news sources, scopes the output, and gates identity.

## 1. BECOME gate (required)

Run `/lb-become`. Confirm identity + SSOT rule + autonomy boundaries are loaded
before touching `knowledge/`.

## 2. Read the pipeline

Read [`docs/pipelines/EVOLVE-PIPELINE.md`](../../../docs/pipelines/EVOLVE-PIPELINE.md)
with the Read tool, **whole file, no `limit` / `offset`**. Use its methodology
for signal detection and candidate scoring, adapting the "three sources"
framework to LB's available sources below.

## 3. LB news sources (verified active 2026-06-25)

| Source                       | URL                                               | Coverage                                     |
| ---------------------------- | ------------------------------------------------- | -------------------------------------------- |
| Laguna Beach Independent     | https://www.lagunabeachindy.com/                  | Local news, city council, community, culture |
| Stu News Laguna              | https://stunewslaguna.com/                        | Hyper-local community news, events, opinion  |
| OC Register (Laguna section) | https://www.ocregister.com/location/laguna-beach/ | Regional with Laguna-specific coverage       |

At least 2 sources confirming a signal before it becomes a candidate. Single-source
signals stay as watchlist items, not candidates.

## 4. Output: content-opportunity candidates

Append candidates to [`knowledge/INBOX.md`](../../../knowledge/INBOX.md), NOT to
any spore/social system (LB has no social presence — the spore suite is dormant).

Each candidate entry:

```markdown
## [Topic title]

- **Priority**: P1 (news-driven) | P2 (background trend)
- **Source-Mode**: NEW | EXISTING-ARTICLE (enhancement)
- **Evidence**: [which sources, what signal, approximate date]
- **Existing coverage**: [link to knowledge/ article if enhancing, or "none"]
- **Requested**: YYYY-MM-DD by lb-news-lens
```

Propose 3-5 candidates per run. Quality over quantity — a candidate must have a
clear path to a knowledge/ article that meets EDITORIAL.en.md standards.

## 5. What this skill does NOT do

- No analytics (GA4/SC/Cloudflare) — LB has no analytics accounts yet. When
  those exist, this skill can incorporate them as additional signal sources.
- No spore output — stripped intentionally. If LB gains a social presence later,
  a separate `lb-spore-pick` skill handles that coupling.
- No automated routine — this is manual-trigger only until LB has the volume to
  justify a weekly cron.

## 6. Rule 12

Every fact in the candidates must trace to a verifiable source. News articles
are leads, not SSOT. The actual writing (via `/lb-write`) will need primary-source
verification before any claim enters `knowledge/`.
