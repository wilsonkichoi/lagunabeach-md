---
title: 'per-language editorial guides'
description: 'Structure stub for per-target-language translation guides. Empty for LagunaBeach.md (which ships only EN as SSOT, with zh-TW as a dormant target); a future language-birth regenerates per-language guidance.'
type: 'editorial-index'
status: 'canonical'
current_version: 'v1.1'
last_updated: 2026-06-28
last_session: '2026-06-28-de-taiwan-per-language-delete'
upstream_canonical:
  - '../EDITORIAL.md'
  - '../TERMINOLOGY.md'
  - '../../pipelines/TRANSLATION-PIPELINE.md'
audience: 'translator (human + AI) / maintainer'
---

# Per-language editorial guides — index

**No per-language guides yet — a future language-birth generates them.** This directory
is a structure stub. LagunaBeach.md's single source of truth is English (`knowledge/`),
and its only translation target is zh-TW — itself currently dormant. So LB's only live
translation direction is EN→zh-TW, and LB ships no outbound languages that would need a
per-target-language style guide here.

LB's own translation methodology lives in [`../../pipelines/TRANSLATION-PIPELINE.md`](../../pipelines/TRANSLATION-PIPELINE.md); SSOT writing conventions are in [`../TERMINOLOGY.md`](../TERMINOLOGY.md).

## When LagunaBeach.md activates an outbound language

A per-language guide is a target-language style guide: personal-name romanization,
place-name conventions, cultural vocabulary, register. When LB adds an outbound language,
language-birth runs a research-and-extract pass for that language against LB place names,
people, and cultural vocabulary, and drops a `TRANSLATION-{lang}.md` here. Until then the
directory stays empty.

---

_v1.1 | 2026-06-28 — Reduced to a structure stub. The five inherited upstream guides
(en/ja/ko/es/fr — Taiwan.md's zh-TW→outbound style guides) were deleted in Phase D
de-Taiwan: LB does not have those languages, and a future language-birth regenerates
per-language guidance rather than inheriting Taiwan's. v1.0 (2026-05-24) held the inherited
index._
