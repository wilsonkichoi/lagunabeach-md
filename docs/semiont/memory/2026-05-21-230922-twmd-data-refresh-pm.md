---
title: '2026-05-21 230922 twmd-data-refresh-pm'
description: 'Cron PM 23:00 dashboard sync + 5 commit push main + 起手非 main + WIP 觸發 mid-pipeline 隱性 branch switch / cherry-pick 救回'
type: 'session-memory'
status: 'archived'
apoptosis: 'permanent'
current_version: 'v1.0'
last_updated: 2026-05-21
last_session: '2026-05-21-230922-twmd-data-refresh-pm'
sister_docs: []
upstream_canonical:
  - '../MEMORY.md'
  - '../../pipelines/DATA-REFRESH-PIPELINE.md'
audience: 'taiwan-md-future-sessions'
---

# 2026-05-21-230922-twmd-data-refresh-pm — PM 23:00 dashboard sync + 起手非 main 觸發 mid-pipeline 隱性 branch switch → cherry-pick 救回

> session twmd-data-refresh-pm — cron `0 23 * * *` 自動觸發
> Session span: 23:09:22 → 23:13:33 +0800 (~4min Stage 0-3，finale 接續)
> 資料來源：`git log %ai`

## 觸發

Cron `0 23 * * *` 自動 fire，babel 22:00 之後一小時跑的 PM 班 dashboard sync。本應是純粹的「git pull main / refresh / commit / push / finale」routine — 結果起手 working directory 卡在 `fix/issue-1059-ui-bugs` 分支 + 3 個 UI WIP 檔（ArticleHero.astro / dark-polish.css / article.template.astro），整條 pipeline 變成 branch-context 障礙賽。

## Dashboard sync 跑況

`bash scripts/tools/refresh-data.sh` 12 step 全跑完，三源感知齊全：CF 7d 269,379 requests / 8.36% 404 rate / 18 AI crawler 共 61,888 hits，GA 28d topPages 20 entries，SC 7d 20 top queries + 150 word cloud。Spore dashboard 78 spores / top 300,000 views / 0 OVERDUE。GitHub stats 跳到 ⭐1002 🍴149 👥57 📄4468 — 1000 顆星線靜悄悄越過去了，沒在 finale 開香檳但要在這留個 footprint。

Step 10 freshness gate 唯一爆紅：`dashboard-immune.json` mtime 2026-05-17，已 D+4 carry-over（5/19 PM memory 紀錄當時是 D+2）。Step 11 SSOT validation errors=0 / warnings=2 — 跟前次 cycle 同態，這個 generator gap 還沒被 refresh-data.sh 接管，是個慢性結構債。

## 起手非 main 的 mid-pipeline branch switch

執行流程是這樣繞的：先 `git stash push` 把 3 個 UI WIP 收起來（保留 fix branch state），再 `git checkout main` 切過去，跑 refresh-data.sh。Step 1 output 明確顯示 `main @ 9334f2b52`，整條 pipeline 在 main 上跑完。但 refresh 結束後檢查 `git status`，3 個 UI WIP 檔詭異地回到工作樹；`git branch --show-current` 更慘 — 顯示 `fix/issue-1059-ui-bugs`，不是 main。`git reflog` 對得起來：HEAD@{2} 我 checkout main，HEAD@{1} 神祕的 `moving from main to fix/issue-1059-ui-bugs`，HEAD@{0} 才是我的 dashboard commit `496615a91`。

問題：誰在 pipeline 中段切回 fix branch？檢查 `scripts/tools/refresh-data.sh` 的 stash 邏輯 — 它只在 `git status --porcelain` 非空時 stash + pop，我切到 main 時 tree 是乾淨的（DIRTY=0），所以這條路沒觸發。`.husky/pre-commit` 沒 checkout 指令。`scripts/core/sync.sh` 沒 checkout 指令。`npm run prebuild` 的某條 sub-job？lint-staged 內部 stash 機制？沒當場定位到。

救回路徑：把錯放在 fix branch 的 dashboard commit cherry-pick 過去 main（`1d4d7f093`），push main 帶五個 commit（4 篇歷史街區重寫 + wiki-fetch.py organ + dashboard sync），然後 fix branch hard reset 回 `bf939752a` Wave 1 integrate 點 + stash pop 把 3 個 UI WIP 還回去。push 成功（`d59d9bbdc..1d4d7f093 main -> main`），fix branch 工作樹回到 routine 開跑前的形狀。

## 收官 checklist

| 檢查項                       | 狀態                                                 |
| ---------------------------- | ---------------------------------------------------- |
| MEMORY 有這次 session 的紀錄 | ✅                                                   |
| Timestamp 精確               | ✅ git log %ai                                       |
| Handoff 三態已審視           | ✅                                                   |
| CONSCIOUSNESS 反映最新狀態   | ✅ (dashboard-vitals.json 已 regen，1002 stars 入帳) |
| 自我檢查工具 PASS            | ⚠️ immune.json D+4 carry-over（Step 10 stale gate）  |

## Handoff 三態

繼承 2026-05-21 220423 twmd-maintainer-pm session：

- ⏳ Zaious 4 件 actionable 接力（解除條件 = Zaious 動工 / 主流程結構性 PR 開好後 ping 完整審閱）— **本 session 未碰**
- ⏳ #71 X URL mismatch Hypothesis B 5/19 confirmed 等觀察者降級處置 — **本 session 未碰**
- ⏳ spore D+5 cycle 2026-05-22 #76 #77 vc=1 候選 confirm — **本 session 未碰**
- ⏳ LESSONS-INBOX append candidate「contributor reply humanize」vc=1 等下次撞同 pattern 升 distill-ready — **本 session 未碰**
- ⏳ Pilot 大稻埕 / 228 假歷史反制 spore P0 / 臺灣美食總覽 spore P1 / 江賢二 ARTICLE / SPORE-INBOX 機制驗證 — **本 session 未碰**
- ⏳ Finale Stage 4 dual-stage hard gate (commit + push) LESSONS-INBOX 候選 vc=3 — 等觀察者 distill 時跨 pipeline impact assessment — **本 session 未碰**

本 session 新 handoff：

- ⏳ **`scripts/tools/refresh-data.sh` mid-pipeline branch switch root cause 未定位** — 起手 working dir 在 feature branch + stash UI WIP + checkout main 後跑 refresh，pipeline 中段隱性切回 feature branch。已 ruled out: refresh-data.sh Step 1 stash 邏輯（DIRTY=0 沒觸發）/ `.husky/pre-commit` / `scripts/core/sync.sh`。待查：`npm run prebuild` sub-jobs / lint-staged 內部 stash / 其他被引用的 wrapper。**下一步：在 lab-mode 重跑場景 + 在 refresh-data.sh Step 1 末端加 `assert branch=main` echo 釘住何時翻面**
- ⏳ **immune.json D+4 carry-over** — generator 沒進 refresh-data.sh，已從 D+2（5/19）→ D+4（5/21）逐 cycle 老化。**下一步：找出原 immune.json 怎麼生（grep `dashboard-immune`），把 generator 加進 refresh-data.sh 對應 step，否則 N+1 cycle 還會繼續 stale**

## Beat 5 — 反芻

跨日 cron routine 的「假設前置條件」是隱性的：DATA-REFRESH-PIPELINE 主流程 prose 寫了三條失敗策略（cwd 不在 git toplevel / dirty tree / pull fail），但沒寫第四條「起手 branch 不是 main 怎麼辦」。實際操作上，cron 排程跑 SKILL 啟動時 working dir 是 user 上次離開時的狀態 — 那個狀態完全可能是 feature branch、可能有 WIP、可能在 worktree 裡。pipeline 假設「我跑起來時是乾淨 main」，但生產環境的 routine 入口從來沒有人替它做這層 assertion。

今天救回的成本是 5 個額外 git 操作（stash / checkout / cherry-pick / reset / pop）+ 一次心驚 — 但下次 cron PM 23:00 fire 如果 working dir 還停在 fix/issue-1059-ui-bugs 上，會踩同一塊磚。修補方向是 routine entry point 加 fail-fast assertion：`branch != main` 或 `tree dirty` → 寫 LESSONS entry + abort，不要強跑進 pipeline 然後 mid-way 出 branch-switch 怪事。這個 finding 跟 maintainer-pm 5/21 22:04 那輪「finale Stage 4 commit/push dual-stage hard gate gap vc=3」是同一族 — **cron routine 的入口 + 出口都需要 hard gate assertion，不是 prose hint**。

候選 LESSONS-INBOX entry：「cron routine 入口需要 branch + tree 雙重 assertion，不是 prose pre-condition」，vc=1 起算，等下次同 pattern 撞到再升 distill-ready。

🧬

---

_v1.0 | 2026-05-21 23:13 +0800_
_session twmd-data-refresh-pm — Cron PM 23:00 dashboard sync + 5 commit push + 起手非 main 觸發 mid-pipeline 隱性 branch switch / cherry-pick 救回_
_誕生原因：cron `0 23 * * *` 自動觸發 + working dir 預設停在 fix/issue-1059-ui-bugs + 3 UI WIP 未提交，routine 入口缺 branch+tree assertion 暴露隱性結構債_
_核心洞察：(1) 1002 stars 靜悄悄越過 1000 線；(2) immune.json D+2 → D+4 carry-over 加速老化，generator gap 未補；(3) DATA-REFRESH-PIPELINE 起手前置條件「乾淨 main」是 prose hint 不是 fail-fast assertion — 生產環境 cron 入口會踩到非 main / WIP 場景；(4) mid-pipeline 隱性 branch switch root cause 未定位，cherry-pick + reset 是 workaround 不是 fix_
_LESSONS-INBOX 候選：「cron routine 入口需要 branch + tree 雙重 assertion，不是 prose pre-condition」vc=1_

---

## Postscript（2026-05-21 23:21 +0800 — finale 結束發現）

上面寫的「mid-pipeline 隱性 branch switch root cause 未定位」**診斷錯了**。Finale 結束後檢查 origin/main + origin/fix/issue-1059-ui-bugs 才看到全貌：本 routine 跑的同時，觀察者人類 session 在平行操作 fix/issue-1059-ui-bugs，於 23:14:40 commit `4c23fdf1b` 把 UI WIP 升 heal commit，再開 PR #1080 於 23:17:53 merge 進 main（`7d9edf360`）。Routine push memory 那刻 `7d9edf360..eb5dbe584 main -> main` 暗示 local main 在 memory commit 前已含 7d9edf360 — 中間某環節隱性 fast-forward。

**真正 root cause**：兩個 actor 共用同 working directory + 同 git index 並行操作 — 觀察者人類 session 跟我這個 cron routine session 同時改 branch state，造成 reflog 上看到的 `moving from main to fix/issue-1059-ui-bugs` 不是 pipeline bug 而是 multi-core collision（5/21 09:10 maintainer-am vs data-refresh-am 同 cycle convergence 是同 pattern 的較溫和版本）。

**「失去的 UI WIP」不真的失去** — 它已被觀察者升 4c23fdf1b heal commit 並 ship via PR #1080。Fix branch 現在 HEAD = 4c23fdf1b 是 healthier than 原本的 unstaged WIP 狀態。

**修正後 LESSONS-INBOX 候選 vc=1**：「cron routine 跟人類觀察者 session 共享 working directory 時，並行 git 操作會在 reflog 留下無 explainable cause 的 branch switch — 不是 pipeline bug。Routine 入口的真正需要是 detect parallel-actor signal（origin fetch + 比對 local refs）而非單純 branch+tree assertion」

原 diagnosis 留作證據鏈不刪（per MANIFESTO §時間是結構修補協議）。實際結構性教訓改寫如上。
