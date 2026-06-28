---
title: 'TRANSLATION-SYNC'
description: 'Translation sync report — the spec for keeping languages consistent, plus the report format'
type: 'editorial-canonical'
status: 'archived'
apoptosis: 'archived'
superseded_by:
  - '../pipelines/TRANSLATION-PIPELINE.md'
  - '../pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md'
  - 'scripts/tools/lang-sync/status.py (live sync-status SSOT)'
current_version: 'v2.0'
last_updated: 2026-06-28
last_session: 'phase-d-batch3-editorial-deTaiwan'
sister_docs:
  - 'EDITORIAL.md'
  - 'TERMINOLOGY.md'
upstream_canonical:
  - 'EDITORIAL.md'
  - '../pipelines/TRANSLATION-PIPELINE.md'
  - '../pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md'
---

# LagunaBeach.md Translation Sync Report

> ⚠️ **ARCHIVED**: This file is a frozen one-time snapshot, not a living "cross-language consistency spec." That function lives in three places: the sync spec → [TRANSLATION-PIPELINE](../pipelines/TRANSLATION-PIPELINE.md) + [SQUEEZE-MODELS-MAX](../pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md); live status → `python3 scripts/tools/lang-sync/status.py` + `/api/dashboard-i18n.json`. Kept as the evidence chain.
>
> Re-grounded for LagunaBeach.md (Phase D). Upstream origin: Taiwan.md's 2026-03-25 freeze, taken at its 401-zh / 483-en scale, where Chinese was the source language and English the translation target. This fork inverts that — **English is the source language, zh-TW is the (still dormant) translation target** — and the corpus is a fraction of the size, so the snapshot below reflects this fork's real measured state, not Taiwan's.

Generated: 2026-06-28 (re-measured against `knowledge/`)

## Per-Category Summary

Source language: **EN**. Translation target: **zh-TW** (dormant — no translations produced yet).

| Category             | EN  | zh-TW | zh-TW Outdated | zh-TW Missing |
| -------------------- | --- | ----- | -------------- | ------------- |
| About                | 3   | 0     | 0              | 3             |
| Art & Galleries      | 2   | 0     | 0              | 2             |
| Beaches              | 2   | 0     | 0              | 2             |
| Events & Festivals   | 2   | 0     | 0              | 2             |
| Food                 | 1   | 0     | 0              | 1             |
| History              | 2   | 0     | 0              | 2             |
| Nature & Marine Life | 2   | 0     | 0              | 2             |
| Neighborhoods        | 2   | 0     | 0              | 2             |
| Trails               | 2   | 0     | 0              | 2             |

## Totals

- EN articles: 18
- zh-TW articles: 0
- zh-TW outdated (en modified after zh): 0
- zh-TW missing (en exists, no zh match): 18
- **Action needed: 18 articles — but deferred; translation is dormant until the corpus is bigger**

## Status: translation dormant

Unlike upstream, this fork has not begun translating. The multilingual machinery is inherited and intact (`scripts/tools/lang-sync/`, `TRANSLATION-PIPELINE`, the `/{lang}/` route shells), but no zh-TW article exists yet. That is a deliberate sequencing choice: at 18 English articles, translation effort is better spent growing and hardening the English corpus first. When translation activates, `lang-sync/status.py` becomes the live SSOT and this frozen report is irrelevant.

## Priority Queue (for when translation activates)

No frozen priority queue — at this size the queue would just be "all 18, roughly in traffic order," and there's no analytics wired to order it. When translation starts, generate the live queue from `lang-sync/status.py` rather than hand-maintaining a list here.
