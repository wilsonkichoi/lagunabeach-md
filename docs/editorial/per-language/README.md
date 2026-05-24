---
title: 'per-language editorial guides'
description: 'Taiwan.md 各語言翻譯規範索引 — 何時載入哪份 canonical guide'
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

# Per-language editorial guides — 索引

> 中文 SSOT 寫作規範在 [`../TERMINOLOGY.md`](../TERMINOLOGY.md)（台灣用語、A/B 類替換）。本資料夾收錄**每個目標語言的翻譯規範**：人名 romanization、地名標記、文化詞彙、政治敏感語、sovereignty-avoid lexicon、register。

## 5 份 canonical guides

| 語言代碼 | 檔案                                   | 觸發時機           |
| :------- | :------------------------------------- | :----------------- |
| `en`     | [TRANSLATION-en.md](TRANSLATION-en.md) | 翻譯 zh → 英文     |
| `ja`     | [TRANSLATION-ja.md](TRANSLATION-ja.md) | 翻譯 zh → 日本語   |
| `ko`     | [TRANSLATION-ko.md](TRANSLATION-ko.md) | 翻譯 zh → 한국어   |
| `es`     | [TRANSLATION-es.md](TRANSLATION-es.md) | 翻譯 zh → español  |
| `fr`     | [TRANSLATION-fr.md](TRANSLATION-fr.md) | 翻譯 zh → français |

## 何時載入

| 場景                                    | 必載                                             | 選載        |
| :-------------------------------------- | :----------------------------------------------- | :---------- |
| 單篇翻譯（TRANSLATION-PIPELINE A 模式） | 目標語言對應 guide 全檔                          | TERMINOLOGY |
| 批次翻譯（C 模式 sub-agent）            | sub-agent prompt 內嵌目標語言 guide              | —           |
| 多語 batch（SQUEEZE-MODELS-MAX）        | 每個 target lang 載對應 guide                    | —           |
| Manual review / polish                  | 目標語言 guide §6 sovereignty-avoid + §8 CI lint | 全檔        |

## 載入規則

1. **不憑記憶**（per [REFLEXES #15](../../semiont/REFLEXES.md)）— 即使「我熟了」也每次重讀對應 guide §1-§8
2. **Sub-agent prompt 內嵌** — 不要只給 pointer，把 §1 國名 / §2 人名 / §3 地名 / §6 sovereignty-avoid 4 個 table 內嵌到 prompt（per [REFLEXES #42](../../semiont/REFLEXES.md) sub-agent 三偷吃步教訓）
3. **Frontmatter 三選一** — 寫翻譯前 grep `upstream_canonical` 確認指到 guide

## 共通結構（5 份檔案）

每份 guide 有 9 個 section：

- **TL;DR**（5 條最高優先規則）
- **§1 國名 / 地區指稱**（必查）
- **§2 人名 romanization**
- **§3 地名 romanization**
- **§4 文化詞彙**
- **§5 政治 / 歷史 sensitive terms**
- **§6 Sovereignty-avoid lexicon**（PRC-coded → 替代）
- **§7 Register & 風格規則**
- **§8 CI Lint banned phrases 候選**
- **§9 Open questions**

## 跨語言 cross-validation

每份 guide 都有 `sister_docs` frontmatter 指向其他 4 份 — 改動一份時請看其他語言對相同概念的處理是否同步（例：「Taiwan, China」在 en / 中国台湾 在 ja / 중국 대만 在 ko / Taiwán, China 在 es / Taïwan, Chine 在 fr 是同一條 sovereignty-avoid pattern）。

## 進化來源

本資料夾 v1.0 從 2026-05-24 翻譯規範審計 session 誕生（觸發：哲宇上週五演講有專業韓文譯者 callout「韓文的台灣通常不是用我們網站上的翻法」）。完整研究證據：

- [reports/translation-research/en-2026-05-24.md](../../../reports/translation-research/en-2026-05-24.md)
- [reports/translation-research/ja-2026-05-24.md](../../../reports/translation-research/ja-2026-05-24.md)
- [reports/translation-research/ko-2026-05-24.md](../../../reports/translation-research/ko-2026-05-24.md)
- [reports/translation-research/es-2026-05-24.md](../../../reports/translation-research/es-2026-05-24.md)
- [reports/translation-research/fr-2026-05-24.md](../../../reports/translation-research/fr-2026-05-24.md)
- [reports/translation-conventions-audit-2026-05-24.md](../../../reports/translation-conventions-audit-2026-05-24.md)（master audit + 實作報告）

## 維護

- 翻譯時發現 guide 漏抓某條 → 寫進該 guide §9 Open questions，週期性 distill 進該 section
- 新語言加入（如 vi / de / pt）→ 用本 5 份當 template 跑同樣 5-stage 研究 + extract 流程
- 跨語言衝突（例：某個術語在不同語言處理方式應該統一但目前不一致）→ 升級到 TERMINOLOGY.md 或開新檔 `CROSS-LANG-CONSISTENCY.md`

---

_v1.0 | 2026-05-24 — 5 份 per-lang guides 同 session 誕生。_
