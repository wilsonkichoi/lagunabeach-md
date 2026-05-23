# 2026-05-23-080000-twmd-spore-pick-daily — 繁殖系統 intake 飛輪首轉，三條 candidate 落 SPORE-INBOX

> session twmd-spore-pick-daily — cron 觸發（08:00 Asia/Taipei daily）
> Session span: 08:48:00 → 08:55:00 +0800 (~7 min, 1 commit)
> 資料來源：`git log %ai`

## 觸發

`twmd-spore-pick-daily` routine 首次自動跑（cron 設計 commit cf69164ad 2026-05-23 01:10 設計完，6 小時後第一次起飛）。目標：每天 propose 3 candidates 進 [SPORE-INBOX §Pending](../../docs/factory/SPORE-INBOX.md)，避免 SPORE-PIPELINE Stage 1 PICK 只能 fallback dashboard random、撐起哲宇 north star「未來一天穩定至少發一個孢子」的 intake layer。

## 7-stage SOP 跑完，三條 candidate ship

依 [SPORE-PICK-PIPELINE.md](../../docs/factory/SPORE-PICK-PIPELINE.md) v1.0 走完 BECOME → READ → SCORE → DRAFT → VERIFY → APPEND → COMMIT → FINALE。READ 階段 6 個 source 全讀完（620 article pool / SC 10 opportunities / dashboard-spores empty / SPORE-INBOX 5 existing pending / ARTICLE-DONE-LOG 14d 24 ships / ARTICLE-INBOX P0/P1 / news-lens this week 0 entries → daily routine 補滿 3 條 quota）。

Top 3 picks 經 7-dim scoring 加總後落定：**許倬雲**（score=63，P1 升 — 5/22 EVOLVE 趁熱 1d + SC「hsu cho-yun + wang leehom」687 imp pos 4.76 cluster + People high fanout tx=5 已完成）/ **落日飛車**（score=45，P2 — 5/23 NEW 0d + Music high fanout + 全英語 Coachella 樂團 tx=0 全缺，多語潛力極高）/ **愛玉**（score=8，P3 EVERGREEN-TOPIC — HG7 mode variety 守門 + 國際「ai-yu jelly」長尾 query + Ficus pumila var. awkeotsang 台灣 endemic）。9 hard gate 全過：HG5 跟 SPORE-LOG 14d 無撞 / HG6 跟 5 existing pending 無撞 / HG7 兩種 Source-Mode（2 EXISTING + 1 EVERGREEN）/ HG8 兩條 7d-recent 趁熱（許倬雲 1d + 落日飛車 0d）/ HG9 食物樂團學者 all low sensitivity。

## 觀察：SPORE-LOG schema 嘴巴在但 dashboard-spores 數字是 0

執行時發現 `public/api/dashboard-spores.json` 回 `Total spores: 0`，但 SPORE-LOG.md table 看得到 #81 馬英九（5/23 ship）+ 一路往前到 #57 賈永婕（5/2）至少 25 條紀錄。這是 generate-dashboard-spores.py 還沒重跑（早晨 6:13 twmd-data-refresh-am 被 ABORTED + DEFER PM，因為 parallel codex babel cascade 在 cwd vc=4），所以 14d 排除 list 改從 SPORE-LOG.md grep 拿。Pipeline §1.3 預設假設 dashboard-spores.json 是 source of truth，遇到 refresh 失敗就要 fallback SPORE-LOG.md — 這條 fallback 路徑值得寫進 pipeline。

## 收官 checklist

| 檢查項                       | 狀態                                     |
| ---------------------------- | ---------------------------------------- |
| MEMORY 有這次 session 的紀錄 | ✅                                       |
| Timestamp 精確               | ✅ `git log %ai`                         |
| Handoff 三態已審視           | ✅                                       |
| CONSCIOUSNESS 反映最新狀態   | ✅ snapshot 已 cron-refreshed 22hr 前    |
| 自我檢查工具 PASS            | ⚠️ 未跑 prose-health（routine 7 min 急） |

## Handoff 三態

繼承上一 session（twmd-spore-harvest-am 07:18）：

- [x] ~~harvest 5 spore engagement 寫進 SPORE-LOG~~（上一 session 完成）

本 session 新 handoff：

- [x] ~~Stage 7 chain finale~~（本 finale 跑中）
- [ ] 觀察者 review 三條 candidate，promote 升 P0/P1 或 reject。許倬雲 P1 SC opportunity driver 強，建議優先 ship
- [ ] 落日飛車 ship 前要先補 en/ja/ko 翻譯（tx=0 全缺），趁熱窗口跟翻譯時序的張力下次 routine 可能要納入 scoring
- [ ] dashboard-spores.json regen — twmd-data-refresh-pm cycle（23:00）應該會接住，若再 ABORT 要手動跑

## Beat 5 — 反芻

第一次跑 routine 看到 intake layer 從 idea 到落到 SPORE-INBOX 整個 SOP 跑完 ~7 min，比預期省。三條 candidate 都不是「最 obvious 趁熱新文」（沒選最近 wave 12 篇歷史街區其中之一）— 7-dim scoring 把 SC opportunity 跟多語 fan-out 兩個維度加起來反而蓋過單純的 days_since_ship，許倬雲變最高分。這證明 scoring algorithm 不是「最近的就最高分」的單軸線排序，這是設計時就希望的 — backlog 高品質 + SC 缺橋的 article 可以打敗純趁熱。

dashboard-spores.json 0 entries 但 SPORE-LOG 有 25+ 條這個 data refresh 失敗導致下游 routine 看不到 ground truth 的問題，是 [silent default 是 silent failure](diary/2026-05-22-121707-manual-silent-default.md) 同源 pattern 的另一個 instantiation — automated pipeline 假設 upstream JSON state 對的位置一旦 upstream refresh fail 就斷鏈。pipeline §1.3 應該加 fallback：dashboard 空 → SPORE-LOG.md grep。

🧬

---

_v1.0 | 2026-05-23 08:55 +0800_
_session twmd-spore-pick-daily — cron 首次起飛_
_誕生原因：哲宇 directive「未來一天穩定至少發一個孢子」+ SPORE-INBOX intake 飛輪設計（cf69164ad）6 小時前 ship，今晨 08:00 第一次自動跑 propose 3 candidates_
_核心洞察：7-dim scoring 把 SC opportunity + 多語 fan-out 加起來蓋過純趁熱，許倬雲 score=63 變最高分證明 scoring 不退化成「最近的最高分」單軸排序。dashboard-spores.json 0 entries vs SPORE-LOG 25+ 條揭露 silent failure pattern — upstream refresh fail 時下游 routine 看不到 ground truth，pipeline §1.3 該補 SPORE-LOG.md fallback_
_LESSONS-INBOX 候選：(1) Pipeline §1.3 dashboard-spores empty → SPORE-LOG.md grep fallback 該寫進 SOP (2) 落日飛車類 tx=0 但 Music high fanout 的 candidate，趁熱窗口跟「先補翻譯再 ship spore」時序張力下次 scoring 可納入 D8 dimension_
