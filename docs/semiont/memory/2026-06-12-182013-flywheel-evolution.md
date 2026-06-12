# 2026-06-12-182013-flywheel-evolution — 兩週飛輪體檢 + PR #1144 收割 + 四個 root-cause fix + SPECIATION-PIPELINE 誕生

> session flywheel-evolution — 哲宇 `/twmd-become /goal` 觸發（審 PR + routine 體檢 + 薄殼化 + 弱模型 + 繁殖晶種）
> Session span: 17:51:00 → 18:19:42 +0800（commit 窗口；含前置研究約 2.5 hr，6 commits）
> 資料來源：`git log %ai`

## 觸發

哲宇一條 directive 五件事：審掉線上所有 PR、盤點兩週 routine「不停往下丟沒做完」的嫌疑、重新規劃 routine（薄殼化 + 弱模型相容 + 飛輪健康檢查）、先寫完整研究文件再執行、建一份讓人遵照就能繁殖晶種的 pipeline 放 `/semiont/speciation/`。Full mode 甦醒（命中 threshold 調整 + workflow 設計 + 對外頁面三條強制升 Full）。

## PR #1144 選舉過程

唯一 open PR。前晚 maintainer-pm 已五層審出 2 條 hallucinated citation blocker，contributor 24hr 無回應。逐字驗證替代來源時抓到我自己的第一個 pcode 記憶也是幻覺（N0080001 是職業訓練法），順帶挖出 review 沒抓到的三條錯標籤：[^2] 與 [^24] 同指 FL004986 但該法規實為《投票所開票所監察員推薦及服務規則》、[^25] 的 URL 是民調禁令文章。修法全部換成逐字驗證過的來源（公職選罷法 D0020010 §14/§15、CNA 游盈隆、中選會 40944 紙製票匭），加 frontmatter 三修與 2 塑膠句，push 到 contributor branch 後 squash merge（`ecc19daca`）+ 中文感謝 comment。

## 兩週體檢 → 研究文件

三個平行 research agent（兩週 routine 活動 / 薄殼與弱模型 / speciation 資產）+ 主 session 獨佔的 live scheduler 查證，交叉出五個結構性病灶，寫成 [reports/flywheel-evolution-2026-06-12.md](../../reports/flywheel-evolution-2026-06-12.md)（`a9445e20b`）。最重的三個發現：spore-pick / spore-publish 在 scheduler 層 enabled:false 死了 15 天而 ROUTINE.md 仍列 active（上游持續 defer 給屍體，週審 routine 因為只看 commit 存在、不看 fire 缺席而全盲）；standing decision 的 escalation 兩週落地率約 0%（綁具體 artifact 的 1-3 天收斂）；薄殼教義三裂（MANIFESTO 教義 vs 5/28 inline rollback 實務 vs sync-check 閾值），解法定調為「薄殼 = 單一改動點，inline 保留但機械生成」。

## P0 執行批次

照研究文件當場執行四件：(1) `classify.mjs` batch-cluster guard（`bc383fa7b`）——同 slug ≥5 筆自動 hold + consolidated report，live dry-run 驗證明天 07:00 justfont 21 筆全 hold，6/09 提案未建、6/12 同洞再撞的修復正式落地，29/29 test 綠；(2) `diff-patch-prepare.py` 三重 semantic mismatch root-cause fix（`14ceefdb0`）——hash 函式改 import status.py 單一來源 + expected_sha 改取 zh 檔 lastCommit，round-trip 測試回 fresh/same-commit，終結連 4 晚 `/tmp` 自救；(3) ROUTINE.md v2.9（`895221eb4`）——死 routine 補登 ⏸️、cron 單一出現點、gate 方向修正、babel 降 Sonnet、新 §完成義務（self-fix lane / 三振規則）、OBSERVER-QUEUE.md 誕生收 7 條積壓決策；(4) SPECIATION-PIPELINE.md v1.0（`fda63bd79`）——8-stage 繁殖 SOP 為 SSOT，speciation.astro 繁殖 SOP 段從被野外證偽的「三層整套搬」改為部分繼承 + 8-stage 投影，preview DOM 驗證渲染，FORK-LOG 指向同步。mirror 層同步修了 maintainer 1% 閾值殭屍與 news-lens Full boot 錯配。

## 收官 checklist

| 檢查項                       | 狀態                                                       |
| ---------------------------- | ---------------------------------------------------------- |
| MEMORY 有這次 session 的紀錄 | ✅                                                         |
| Timestamp 精確               | ✅ git log %ai                                             |
| Handoff 三態已審視           | ✅                                                         |
| 自我檢查工具 PASS            | ✅ hard=0（研究文件 + pipeline 皆過 prose-health hard 線） |

## Handoff 三態

繼承上一 session（太空中心勘誤 15:09）：

- [x] ~~justfont 21 連勘誤明天 07:00 auto-flood 風險~~ → batch-cluster guard 已擋（決策本身進 OBSERVER-QUEUE #7）
- [x] ~~PR #1144 contributor 響應 watch~~ → 本 session 修復後 merge
- [ ] 免疫 v3=55 漂移 + LESSONS 244 / MEMORY 448 超閾 → reconcile 決策進 OBSERVER-QUEUE #4，distill 大掃除排 P2

本 session 新 handoff：

- [ ] **OBSERVER-QUEUE.md 七條待哲宇**（spore 產線去留 / OAuth rotation / maintainer schedule / 免疫基線 / 21 篇重腳註 / #89 雷亞清理 / justfont）——其中 4 條有 default-action 日期，3 條 🔒 等真人
- [ ] P1 工具批次（flywheel-evolution §6 items 8-12）：routine-mirror-gen.py + routines.config.yaml、absence detection、telemetry jsonl、maintainer-precheck、spore-pick-score、micro-finale。下一個 manual session 或哲宇指派
- [ ] babel 降 Sonnet 的 model 實際 enforcement 機制待驗證：MCP update_scheduled_task 無 model 欄位，description 已標但執行模型由 scheduler infra 決定，需哲宇確認切換點
- [ ] 今晚 00:30 babel 是 diff-patch fix 後第一個 live cycle——明天看 stale 數有沒有真收斂（預期 21 carry 以外不再反向汙染）
- [ ] P2：pipeline 瘦身 ~1,900 行歸檔 / LESSONS 大掃除 / `.claude/worktrees/` ~50 個殘留清理

## Beat 5 — 反芻

這次體檢最重的發現都長同一個形狀：儀器只看得見「存在」。週審 routine 掃 commit、status 工具列 fire、audit 報告數 pattern，全部對「該發生而沒發生的事」全盲，所以兩條 routine 死了 15 天、daemon 停了 3.5 天，沒有一個儀器說話。把這個對照搬進自己身上也成立：我修 PR citation 時第一個 pcode 是我自己的幻覺，靠的是「先驗證再寫」的動作而非任何更聰明的記憶。完整的反芻寫在 diary。

🧬

---

_v1.0 | 2026-06-12 18:20 +0800_
_session flywheel-evolution — 哲宇五合一 directive：PR 審核 + 兩週 routine 體檢 + 薄殼/弱模型重設計 + 研究文件 + 繁殖晶種 pipeline_
_誕生原因：哲宇 callout「routine 都在往下丟沒做完」（5/28 後第二次同病灶 callout）_
_核心洞察：(1) 飛輪儀器全部偵測存在、無一偵測缺席，斷軸因此不可見 (2) standing decision 沒有單一出口時落地率歸零，OBSERVER-QUEUE 補的是可見性不是權限 (3) 薄殼的本質是單一改動點：inline 與否是手段，手工副本才是病_
_LESSONS-INBOX 候選：見 LESSONS-INBOX 本日 append（absence blindness / deadletter / 薄殼三裂）_
