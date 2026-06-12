---
title: 'OBSERVER-QUEUE'
description: '哲宇 standing decision 單一佇列 — routine escalation 的正式出口（含預設選項 + default-action 機制）'
type: 'cognitive-organ'
status: 'canonical'
apoptosis: 'candidate'
current_version: 'v1.0'
last_updated: 2026-06-12
last_session: '2026-06-12-flywheel-evolution'
sister_docs:
  - 'ROUTINE.md'
  - 'LESSONS-INBOX.md'
upstream_canonical:
  - 'MANIFESTO.md'
  - 'ROUTINE.md'
---

# OBSERVER-QUEUE — 哲宇待決佇列

> 相關：[ROUTINE.md §Routine 完成義務](ROUTINE.md)（誰寫進來）| [MANIFESTO §自主權邊界](MANIFESTO.md)（哪些決策必須等真人）

需要哲宇做 standing decision 的事項集中在這裡。一項一列，永遠帶**預設選項**。

**為什麼存在**：2026-06-12 兩週體檢（[flywheel-evolution §2.3](../../reports/flywheel-evolution-2026-06-12.md)）發現綁具體 artifact 的 escalation 1-3 天收斂，但 standing decision 散在各 routine 的 memory handoff 裡，兩週落地率約 0%——哲宇從未看過完整清單。這個檔案修的是可見性與出口。

**規則**：

- Routine / session 觸發三振規則（carry ≥ 3 cycle）選項 2 時 append 這裡，**同時從自己的 handoff carry 清單移除**（這裡是 canonical，handoff 不重複背）
- 每項必填：問題一句話、預設選項、不決策的代價、default-action 日期（可填「無」）
- **default-action**：到期無哲宇回應 → 任何 session 可執行預設選項並把該項移到 §已決。§自主權邊界四紅線（政治立場 / >50 檔重構 / >10 篇刪除 / 對外溝通語氣）**不適用** default-action，標 `🔒 等真人`
- weekly-report Stage 開頭附本檔 top 5
- 哲宇拍板 → 移 §已決（留一行紀錄 + 日期），執行交給下一個對應 session / routine

---

## 待決

| #   | 進佇列日   | 決策                                                                                                                                                                                                                                                                                                                                                | 預設選項                                                                                                                                       | 不決策的代價                                                                                   | default-action                                    |
| --- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 2   | 2026-06-12 | **OAuth credential rotation**：6/09 洩漏事件中讀者 session（c033ff43）的 refresh_token 可能仍有效，rotate 需 Supabase admin                                                                                                                                                                                                                         | 立即 rotate                                                                                                                                    | security 暴露窗每天加長                                                                        | 🔒 等真人（帳號 ownership）                       |
| 3   | 2026-06-12 | **maintainer schedule mismatch 三選項**（6/03 起 12 天 chronic，empty-vc 記帳每天燒 2 個 Opus session）                                                                                                                                                                                                                                             | 選 C：排程不動，空場 vc 警示閾值放寬 + precheck script 短路空場（P1 工具）                                                                     | Opus 配額持續燒在記帳                                                                          | 2026-06-19 起預設＝C                              |
| 4   | 2026-06-12 | **免疫 27-vs-61 reconcile 三選項**（13 天；6/10 audit 已部分處理）                                                                                                                                                                                                                                                                                  | 確認 v3=55 為新基線，關閉舊 snapshot 警報線                                                                                                    | 每條 routine 每天 carry 一行噪音                                                               | 2026-06-19 起預設＝確認新基線                     |
| 5   | 2026-06-12 | **21 篇重腳註文章翻譯路線**：section-split 工程 vs 付費 API tier                                                                                                                                                                                                                                                                                    | section-split（自主權內工程解，P2 排程）                                                                                                       | 21 篇在五語永久 stale（含莫那·魯道 / 美麗島事件）                                              | 2026-06-26 起預設＝section-split                  |
| 6   | 2026-06-12 | **#89 雷亞重複公開回覆清理**（5/29 標 URGENT，Threads 上兩條相同公開 reply 掛 14 天，刪除需帳號操作）                                                                                                                                                                                                                                               | 哲宇手動刪一條（~1 分鐘）                                                                                                                      | 公開可見的品質事故持續曝光                                                                     | 🔒 等真人（帳號 ownership）                       |
| 7   | 2026-06-12 | **justfont 21 連勘誤處置**（蘇煒翔逐段勘誤含 fabrication 指控，文章 live 六語；batch-cluster guard 已擋住明天 auto-flood）                                                                                                                                                                                                                          | 開 1 個 consolidated issue + 排 REWRITE-PIPELINE 全文重查（對外溝通與名譽，等哲宇 gate per 6/12 triage 升級報告）                              | 文章帶被當事人否定的內容繼續 live                                                              | 🔒 等真人（對外溝通 + 名譽）                      |
| 8   | 2026-06-12 | **Computex EVOLVE Stage 2-5 + SPORE chain + broadcast handoff**（19:00 fire 已交付 Stage 1 SSOT 138 search / 83 sources / research-report-health PASS；舊文 [knowledge/Technology/Computex.md](../../knowledge/Technology/Computex.md) 6/01 ship 仍 live）；SPORE broadcast 撞 spore 產線重開實驗觀察條款（連 3 ship cycle 0 dup / 0 事實 callout） | 明日 18:00 twmd-rewrite-daily fire 跑 Stage 2 fresh Opus writer 接力 Stage 3-5 ship（SPORE chain + 對外溝通 broadcast 仍 hold 到觀察條款穩定） | EVOLVE 5 校正點不落地（蘇媽 2016 Zen / 三 CEO 而非四 / 資訊月對照 / B2B shift / 三大框架校準） | 2026-06-13 18:00 起預設＝明日 fire 接力 Stage 2-5 |

---

## 已決

| 日期       | 決策                            | 結果                                                                                                                                                                                                 |
| ---------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-12 | spore-pick / spore-publish 去留 | 哲宇拍板**重開實驗**（goal directive：「缺席那部分是我刻意關的⋯⋯現在有事實查核關卡，可以開起來實驗」）。觀察條款在 ROUTINE.md v2.10 §🧪：連 3 ship cycle 0 dup / 0 事實 callout，爆即 pause 回本佇列 |

---

_v1.0 | 2026-06-12 flywheel-evolution session_
_誕生原因：兩週體檢揭露 standing decision deadletter pattern（6 條堆疊最舊 15 天），哲宇 directive「routine 裡面要確保所有事情都有被完成」——完成的前提是決策有單一出口。_
