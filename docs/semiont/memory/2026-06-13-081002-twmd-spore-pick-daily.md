# 2026-06-13-081002-twmd-spore-pick-daily — 3 candidates ship（蘇打綠 / 莫那魯道 / Howhow）+ HG10 multi-dim 全過 + Source-Mode 二態達標

> session twmd-spore-pick-daily — routine cron 08:00 fire
>
> span: 2026-06-13 08:00 → 08:10（單 commit 069386ac5）
> trigger: scheduled-task twmd-spore-pick-daily
> 來源：dashboard-articles.json (793) + dashboard-analytics.json (SC7d 10 opps) + spore-log.json + SPORE-INBOX 31 pending + ARTICLE-DONE-LOG 14d + git log 48hr

## BECOME ACK

write mode 完整跑過 BECOME §Step 0-9 mode subset 9 題。

- organ snapshot（consciousness-snapshot.sh）：🫀90↑ 🛡️55↑（最低）🧬95↑ 🦴90→ 🫁85→ 🧫100↑ 👁️90→ 🌐93↑
- 24hr routine fires 10 條全綠（feedback-triage / maintainer am+pm / spore-publish / rewrite-daily / data-refresh am+pm / babel-nightly / spore-harvest-am）
- 48hr git log 跨日 cross-session continuity：manual session ship justfont EVOLVE（6/12 ef8fab38e）+ 莫那魯道 EVOLVE（6/11 8f070a887）+ refactor-article（6/13 凌晨 14.6× build 加速）+ viz-evolution v2.0 + RAG Phase 0 + twmd 統一 CLI 誕生 + dashboard template 解剖（5,329→629 行）
- inbox signal：LESSONS 251 / articles pending 82 / spores pending 31（pre-append；append 後 34）
- Q14 cross-session continuity PASS：handoff（從 07:08 feedback-triage memory）讀到「下個 routine fire 08:30 maintainer-am」+「LESSONS 候選 spore body vs article body D+N drift」+「免疫 v3=55 漂移持續 yellow」

## Stage 1 — 6 source READ

deterministic 全跑、不抽樣：

- `dashboard-articles.json` 793 篇，過濾 about + wc<2000 + 已 covered 14d（10 條）+ 已 pending（31 條）= **pool 235**
- `dashboard-analytics.json` SC7d opportunities **10 條**（top: 'jj lin age' 269 imp / 'ㄤ仔標' 137 imp / 'bim ... taiwan' 127 imp / 'howhow' 65 imp / '侯孝賢' 63 imp）
- `spore-log.json` 14d 覆蓋 10 篇（Computex / 中華台北 / 台灣嘻哈與饒舌發展 / 國宅與居住正義 / 國家太空中心 / 天燈 / 我是OO人 / 開放文化基金會 / 颱風 / 黃山料）
- `SPORE-INBOX §Pending` 31 條 Article-Path slug exclude
- `ARTICLE-DONE-LOG.md` 14d ship：justfont (6/12) / 莫那魯道 (6/11) / 蘇打綠 (6/9) / 黃山料 (6/7) / 台灣辦桌文化 (6/7) / Howhow (6/5) / 李宗盛 (6/5) / 開放文化基金會 (6/4) / 台灣設計研究院 (6/4) / 莫那能 (6/3) / 尊 (6/3) / 李安 (6/1) / 台灣影視配樂 (6/1)
- `ARTICLE-INBOX P0/P1` 未顯示 EVERGREEN candidate（grep 沒命中常規 anchor）

## Stage 2 — 7 dim SCORE

`qualityScore` 欄位實測 range 0-16 不是 0-100（max 16 / mean 2.5），D5 「qs≥70」實質沉默維度本 cycle 未 active。`healthScore` range 29-100 mean 61 才是真實 quality proxy，但 pipeline 仍鎖 qs threshold — **這是 D5 結構性沉默的證據**，列 LESSONS 候選。

D1+D4 變主軸：所有 top 候選都是 People/Music/Food 趁熱 ship。Top viable=17 條，全部 score≤38；無 SC opp 拿 D2≥+15（top opp 'howhow' 65 imp < 100 threshold）。

## Stage 3 — 3 picks

| Pick     | Cat    | Score | D1  | D4  | Source-Mode      | 趁熱                                  |
| -------- | ------ | ----- | --- | --- | ---------------- | ------------------------------------- |
| 蘇打綠   | Music  | 38    | +30 | +8  | EXISTING-ARTICLE | D+4 (6/9 EVOLVE)                      |
| 莫那魯道 | People | 38    | +30 | +8  | EXISTING-ARTICLE | D+2 (6/11 EVOLVE)                     |
| Howhow   | People | 23    | +15 | +8  | REACTIVE         | D+8 (6/5 EVOLVE) + SC 'howhow' 65 imp |

Howhow 升 REACTIVE 而非 EXISTING-ARTICLE，因 SC 'howhow' query 跨語 demand 65 imp pos 11.22 是「補位」動機（per [SPORE-INBOX 台灣藍鵲 entry §REACTIVE pattern](../factory/SPORE-INBOX.md) 同 SC 補位 frame）—— 也讓 HG7 Source-Mode 二態達標。

每 candidate 三 hook anchor（場景 / 數字 / 問句 / 身份 cross-mix 至少 2 種起手式）+ 必驗事實 10+ 條對 article 校準。

## Stage 4 — 10 hard gate 全過

| HG                           | Status | 證據                                                                                                                       |
| ---------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------- |
| HG1 BECOME write mode        | ✅     | BECOME ACK 段已 emit / Q14 PASS                                                                                            |
| HG2 6 source 全讀            | ✅     | dashboard-articles 793 / analytics SC 10 / spore-log 14d 10 / SPORE-INBOX 31 / DONE-LOG 13 / ARTICLE-INBOX 已 inbox-signal |
| HG3 7 dim 都算               | ✅     | 235 pool 全跑 D1-D7，Notes 欄位 transparency                                                                               |
| HG4 ≥2 hook anchor + ≥2 type | ✅     | 三 candidate 各 3 hook（場景+數字+身份/問句 mix）                                                                          |
| HG5 0 dup 14d                | ✅     | spore-db.py last-spore exit 3 對三 candidate 全 null                                                                       |
| HG6 0 dup pending            | ✅     | 三 slug 都不在 31 條 Article-Path                                                                                          |
| HG7 ≥2 Source-Mode           | ✅     | EXISTING-ARTICLE ×2 + REACTIVE ×1                                                                                          |
| HG8 ≥1 DONE-LOG 7d           | ✅     | 蘇打綠 D+4 + 莫那魯道 D+2（均 ≤7d）                                                                                        |
| HG9 高敏感 非 REACTIVE skip  | ✅     | 莫那魯道中敏感但走 §策展人筆記中性 frame + Notes 明寫「政治立場 frame review 留 manual gate」per §自主權邊界               |
| HG10 multi-dim or score≥35   | ✅     | 三 candidate non_zero 都=2（D1+D4），蘇打綠/莫那魯道 score=38≥35，Howhow score=23 但 non_zero=2                            |

**HG10 v2 真實 active**：5/28 audit 的「三 candidate 全 D1 單軸」病灶這次沒重現 — D4 高 fan-out 類別 boost 讓 People/Music/Food 三類別自動拿 +8，不靠 D1 單軸湊數。但**未來若 cat=Technology/Society/Geography/Art 趁熱 ship**（如今天 justfont 與台灣字體發展 cat=technology D1=30 但 D4=0 score=30 non_zero=1 → HG10 fail），routine 會丟出來。這次 pool 剛好類別友好，但是運氣不是設計。

## Stage 5-6 — APPEND + COMMIT

`docs/factory/SPORE-INBOX.md` 從 31 pending append 到 34。commit 069386ac5 push origin main 走 v2.0 main-direct（不開 PR）。lint-staged prettier + canonical frontmatter check 全綠。

## Handoff 三態

- **Continue**：下個 routine 接力 10:00 twmd-spore-publish 從新 34 條 pending 抽 P2 entry（蘇打綠 / 莫那魯道 / Howhow 三條都 P2 default safe，與 P0/P1 哲宇 directive entry 不撞）→ 22:00 twmd-rewrite-daily → 23:00 twmd-data-refresh-pm → 00:30 twmd-babel-nightly
- **Defer / Pending（前 cycle 延續，非本 routine scope）**：
  - spore-harvest handoff 3 Bucket E ack + 2 Bucket B EVOLVE（番膏 anti-bias hold / 黃蘿蔔片）等 manual session
  - feedback-triage cycle 0 新 issue 無 carry，maintainer-am 照常處理 contributor queue
  - LESSONS-INBOX 251 distill + ms-page threshold 200→50（全站 carry）
  - 莫那魯道 spore 中敏感 frame review：建議 SPORE-PUBLISH Stage 1 PICK 時若選此 entry → 升 manual gate（避免 routine ship 踩記憶政治線）— Notes 欄位已標
- **LESSONS 候選 vc=1**：D5 結構性沉默 — `qualityScore` 欄位實測 range 0-16（max 16 / mean 2.5）vs pipeline §Stage 2 D5 鎖 `qs >= 80 / 70` 永遠不命中。本 cycle 17 viable 全靠 D1+D4，D5 全 0。需求：D5 改用 `healthScore` 而非 `qualityScore`（hs range 29-100 mean 61 才是真實 quality proxy）—— 這是 pipeline canonical bug 不是 routine bug，append LESSONS-INBOX 由 distill cycle 處理 + 哲宇 review

## Beat 5 反芻

今天的 pool 235 過濾後跑分，HG10 全過是運氣 + 結構雙重作用：People/Music/Food 高 fan-out 類別在 D4 自動拿 +8，讓「趁熱單軸」自動升「趁熱+類別」雙軸，不靠 D1 單軸湊數。但若 6/12 ship 的是 justfont（cat=technology）我會被 HG10 拒絕 — 這篇技術主題六語 5/5 已 done，但 D4 不命中 Music/People/Food/Sports/History，D1=30 D4=0 score=30 non_zero=1 → 整篇被 routine skip 掉，沒辦法 propose 給觀察者。HG10 v2 防止「單軸 FIFO」退化，但**代價是 cat=Technology/Society/Geography 永遠進不來 routine pick** — 即使 6/12 那種 9976 字深度技術文章。這是設計取捨，不是 bug，但值得記一筆：routine 飛輪天然偏好高 fan-out 類別，technical/civic 主題的 spore intake 仍需哲宇 manual gate 兜底（per §自主權邊界 軸線）。🧬

---

_下個 routine fire: 2026-06-13 08:30 twmd-maintainer-am。本 cycle 3 candidates append SPORE-INBOX，spore-publish 10:00 cycle 有新 P2 fresh pool 可抽。_
