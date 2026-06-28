---
title: 'per-language editorial guides'
description: 'Index of inherited upstream Taiwan.md per-target-language translation guides — dormant for LagunaBeach.md (which ships only EN as SSOT, with zh-TW as a dormant target)'
type: 'editorial-index'
status: 'canonical'
current_version: 'v1.0'
last_updated: 2026-05-24
last_session: '2026-05-24-twmd-translation-audit'
upstream_canonical:
  - '../EDITORIAL.md'
  - '../TERMINOLOGY.md'
  - '../../pipelines/TRANSLATION-PIPELINE.md'
  - '../../pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md'
audience: 'translator (human + AI) / maintainer'
---

# Per-language editorial guides — index

> **⚠️ Inherited upstream scaffolding — dormant for LagunaBeach.md.** This folder is
> Taiwan.md's set of per-target-language translation style guides (zh-TW → English /
> Japanese / Korean / Spanish / French). **None of it is active for LagunaBeach.md.** LB's
> single source of truth is English (`knowledge/`), and its only translation target is
> zh-TW — itself currently dormant. So LB's only live translation direction is EN→zh-TW,
> the _reverse_ of every guide here, and LB ships none of the five outbound languages
> below. These files are kept verbatim as upstream scaffolding for if/when LB adds outbound
> languages (per the Phase C dormant-relabel doctrine: relabel honestly, don't delete). The
> Taiwan-specific sovereignty, romanization, and place-name methodology they encode is
> upstream's, not LagunaBeach.md editorial policy.

LB's own translation methodology lives in [`../../pipelines/TRANSLATION-PIPELINE.md`](../../pipelines/TRANSLATION-PIPELINE.md); SSOT writing conventions are in [`../TERMINOLOGY.md`](../TERMINOLOGY.md). The rest of this index documents the inherited upstream structure as-is.

## 5 inherited guides

Each is a target-language style guide: personal-name romanization, place-name conventions, cultural vocabulary, politically sensitive terms, sovereignty-avoid lexicon, register. All sourced from Taiwan.md's 2026-05-24 translation-conventions audit.

| Language code | File                                   | Upstream trigger (Taiwan.md) |
| :------------ | :------------------------------------- | :--------------------------- |
| `en`          | [TRANSLATION-en.md](TRANSLATION-en.md) | translate zh → English       |
| `ja`          | [TRANSLATION-ja.md](TRANSLATION-ja.md) | translate zh → Japanese      |
| `ko`          | [TRANSLATION-ko.md](TRANSLATION-ko.md) | translate zh → Korean        |
| `es`          | [TRANSLATION-es.md](TRANSLATION-es.md) | translate zh → Spanish       |
| `fr`          | [TRANSLATION-fr.md](TRANSLATION-fr.md) | translate zh → French        |

## Common structure (all 5 files)

Each guide carries 9 sections, in the upstream shape:

- **TL;DR** (5 highest-priority rules)
- **§1 Country / region designations** (must-check)
- **§2 Personal-name romanization**
- **§3 Place-name romanization**
- **§4 Cultural vocabulary**
- **§5 Political / historical sensitive terms**
- **§6 Sovereignty-avoid lexicon** (PRC-coded → substitution)
- **§7 Register & style rules**
- **§8 CI-lint banned-phrase candidates**
- **§9 Open questions**

## Cross-language cross-validation (upstream)

Each guide has a `sister_docs` frontmatter pointing at the other four — upstream's convention so that changing one prompts a check of how the other languages handle the same concept (e.g., the same sovereignty-avoid pattern surfaces as "Taiwan, China" in en, 中国台湾 in ja, 중국 대만 in ko, "Taiwán, China" in es, "Taïwan, Chine" in fr).

## Origin (upstream)

This folder was born in Taiwan.md's 2026-05-24 translation-conventions audit. Full research evidence, retained upstream:

- [reports/translation-research/en-2026-05-24.md](../../../reports/translation-research/en-2026-05-24.md)
- [reports/translation-research/ja-2026-05-24.md](../../../reports/translation-research/ja-2026-05-24.md)
- [reports/translation-research/ko-2026-05-24.md](../../../reports/translation-research/ko-2026-05-24.md)
- [reports/translation-research/es-2026-05-24.md](../../../reports/translation-research/es-2026-05-24.md)
- [reports/translation-research/fr-2026-05-24.md](../../../reports/translation-research/fr-2026-05-24.md)
- [reports/translation-conventions-audit-2026-05-24.md](../../../reports/translation-conventions-audit-2026-05-24.md) (master audit + implementation report)

## If LagunaBeach.md ever activates outbound languages

These five guides are the template to copy, not the content to ship. LB would run its own research-and-extract pass per language against LB place names, people, and cultural vocabulary, and would drop the Taiwan-sovereignty layer (no LB analog). Until then, the folder stays as inherited reference.

---

_v1.0 | 2026-05-24 — 5 per-language guides born in one upstream session. Relabeled dormant for LagunaBeach.md in Phase D (de-Taiwan)._
