---
title: 'memory — 2026-05-22-061238-twmd-data-refresh-am'
session_id: '2026-05-22-061238-twmd-data-refresh-am'
date: '2026-05-22'
handle: 'twmd-data-refresh-am'
mode: 'Full (cron)'
type: 'session-memory'
status: 'aborted-defer'
trigger: 'cron `0 6 * * *` twmd-data-refresh-am'
outcome: 'data refresh aborted — parallel babel routine detected, deferred to PM cycle'
---

# 2026-05-22 06:12 — data-refresh-am aborted: parallel babel routine collision

## 一句話

Cron `0 6 * * *` 觸發 data-refresh-am，BECOME Full 跑完發現 working tree dirty 含 52 modified + 25 untracked translation files，`ps` 確認 gemini babel process (PID 56785, cwd = main repo) 自 06:08 起仍在寫翻譯 — refresh-data.sh 的 auto-stash 會 race babel 的 in-flight writes 在 pop 時造成 silent data loss。**Abort pipeline，defer 到 PM 23:00 cycle**，寫 memory + LESSONS-INBOX vc=2 補強 5/17 cross-routine collision 既有 entry。

## 起手狀態 (06:12)

| Item              | 值                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branch            | main ✅                                                                                                                                           |
| Working tree      | dirty — 52 modified knowledge/{en,es,fr,ja,ko}/\*.md + 25 untracked Geography + Technology                                                        |
| Untracked pattern | bangka / dadaocheng / ximending / zhongshan-north-road-tiaotong / beverage-sealing-machine — 5 lang × 5 article (新 ship 文章的 babel projection) |
| Modified pattern  | jeremy-lin / chen-chien-nien / pansci / beef-noodle-soup ... — babel 翻譯精修 (substantive content diff)                                          |
| Parallel process  | gemini PID 56785 started 06:08 AM, cwd `/Users/cheyuwu/Projects/taiwan-md` (main, not worktree)                                                   |
| File mtime        | knowledge/en/People/jeremy-lin.md → 05:30, knowledge/en/Geography/bangka.md → 05:18 — 連續被寫入                                                  |
| Last commit       | e8af22e45 2026-05-22 00:53 (rewrite-daily diary postscript)                                                                                       |

## 為什麼 abort 而非 trust auto-stash

DATA-REFRESH-PIPELINE Step 1 設計：working tree dirty → `git stash push --include-untracked` + pull + prebuild + `git stash pop`。設計假設 = single-actor cwd。

**並行 babel 場景下的失敗模式**：

1. `git stash push --include-untracked` 在時刻 T₀ snapshot 當下 dirty files
2. Pipeline Step 2-10 跑 prebuild / dashboard JSON regen 約 N 分鐘（歷史 baseline ~3-8 min）
3. 期間 T₀+30s ... T₀+N 內 babel 繼續寫新翻譯到同一些檔案 path
4. `git stash pop` 在 T₀+N 還原 T₀ snapshot — overwriting babel 在這段 window 寫的所有新內容
5. Pop conflict 或 silent overwrite — babel 認為 commit 成功的內容部分丟失

**這是 PM session (2026-05-21 23:21 postscript) 標的「cron routine 跟人類觀察者 session 共享 working directory 時，並行 git 操作會在 reflog 留下無 explainable cause 的 branch switch」的姊妹 pattern** — 那次是 cron-vs-human collision，這次是 cron-vs-cron collision，同樣的 shared cwd race surface。

**也是 5/17 babel-nightly LESSONS entry「data-refresh-am sweep-in 是新 cross-routine collision pattern (vc=2)」的同源**：5/17 那次是 refresh-am 用 `git add -A` 把 babel in-flight 工作 sweep 進自己 commit，這次差別在 refresh-am 還沒到 commit 階段就 detect 到 — 升級 awareness 從「commit 階段的 sweep-in 風險」到「stash 階段的 race overwrite 風險」。

## Abort 決策依據

1. **Cron 場景無觀察者**：BECOME §鐵律 10 high-stake 強制 BECOME 涵蓋的 4 條觸發都沒命中（< 5 PR / 不是新 plugin / 不是 threshold 調整 / 不是 §自主權邊界），但「parallel-actor cwd race 可能 silent overwrite N 個檔案的翻譯工作」是 sovereignty preservation infrastructure 的潛在資產損失 — 對 PRC AI 沉默主題的多語翻譯本來就是分散 + 高成本 capture，丟失成本不可接受
2. **Pipeline canonical 沒涵蓋 parallel-actor detection**：v2.0 12-step 主流程的 Hard Gate Inventory 9 條全屬於「single-actor 假設下的 git/data 完整性」，無一處檢測 cwd 並行 process — 結構性 gap
3. **Defer 成本可接受**：data-refresh-pm 在 23:00 fire（同日內 17 hr 後），babel 屆時應已完成 (歷史 babel-handoff ~2-4 hr 量級)。Dashboard JSON 將是「上次 PM run + 17hr 數據缺口」狀態，但 GA4/SC/CF cache 仍然會 fall through 到次日 fetch — 沒有不可逆損失
4. **重跑成本可接受**：寫 memory + LESSONS entry + commit + push 約 3-5 min；trigger 下次 cron 時 babel 應已退場，cwd 乾淨

## Handoff 三態

繼承 2026-05-21 230922 twmd-data-refresh-pm session 6 條 carry-over：

- ⏳ Zaious 4 件 actionable 接力 — **本 session 未碰**
- ⏳ #71 X URL mismatch Hypothesis B 等觀察者降級處置 — **本 session 未碰**
- ⏳ spore D+5 cycle 2026-05-22 #76 #77 vc=1 候選 confirm — **本 session 未碰**
- ⏳ LESSONS-INBOX append「contributor reply humanize」vc=1 等下次撞同 pattern 升 distill-ready — **本 session 未碰**
- ⏳ Pilot 大稻埕 / 228 假歷史反制 spore P0 / 江賢二 ARTICLE / SPORE-INBOX 機制驗證 — **本 session 未碰**
- ⏳ Finale Stage 4 dual-stage hard gate (commit + push) LESSONS-INBOX 候選 vc=3 — **本 session 未碰**
- ⏳ refresh-data.sh mid-pipeline branch switch root cause（PM session diagnose 後修正為 multi-core collision，非 pipeline bug）— 本 session 之 abort 是同族 pattern 的不同觸發點，evidence 已寫入 LESSONS

繼承 2026-05-22 000751 twmd-rewrite-daily session：

- ⏳ 歷史街區 batch 1 剩 8 條 P1-P2 — **本 session 未碰**（順便 note：今天 babel routine 看起來在處理這批 article 的多語 projection — bangka/dadaocheng/ximending/zhongshan-north-road-tiaotong 5 lang × 4 articles 出現在 untracked）
- ⏳ prettier italic-paren URL 災難 LESSONS-INBOX candidate — **本 session 未碰**
- ⏳ 歷史街區 retrospective enrich common caveats — **本 session 未碰**

本 session 新 handoff：

- ⏳ **DATA-REFRESH-PIPELINE Step 1 升 parallel-actor detection gate** — Pipeline v2.0 Step 1 加 pre-stash gate：`pgrep -f "gemini|babel|sync.sh|translate" | head -1` 或更精確的 `lsof` cwd 對比 — detect parallel process before stash. 偵測到 = soft skip + write LESSONS entry + abort. 對應 LESSONS-INBOX 本 session append entry vc=2 待 distill
- ⏳ **本日 PM data-refresh-pm (23:00) 預期 cwd 乾淨後正常跑** — 觀察點：(a) PM cycle 起手時 babel 是否已退場 (b) untracked Geography + Technology 5×5 files 是否已被 babel commit + push (c) immune.json D+5 carry-over 是否進一步老化（從 5/19 D+2 起累積至本 PM 應達 D+6，generator gap 未補的情況）
- ⏳ **immune.json generator gap 累積 D+6** — 5/19 D+2 → 5/21 D+4 → 預測 5/22 PM D+5 → 若無人介入會持續單調老化。觸發 immediate fix：grep `dashboard-immune` find generator，加進 refresh-data.sh 對應 step。本 session 未動因為 cwd dirty 無法安全執行 prebuild — defer 到 PM 乾淨後

## 自我檢查 quality_gate

| Item                              | 狀態                                                                              |
| --------------------------------- | --------------------------------------------------------------------------------- |
| Branch on main                    | ✅                                                                                |
| Pipeline canonical 讀完           | ✅ DATA-REFRESH-PIPELINE v2.0 12-step                                             |
| Parallel-actor detected           | ✅ gemini PID 56785 cwd 對比                                                      |
| Abort 理由文件化                  | ✅ (本 memory + LESSONS entry)                                                    |
| Memory + LESSONS 寫入             | ✅                                                                                |
| Commit scope = explicit allowlist | ✅ 只 stage memory + MEMORY index + LESSONS — 不碰 babel in-flight knowledge/     |
| Push                              | ⚠️ small explicit-allowlist commit, accept push collision risk with babel routine |
| Stage 4 dual-stage hard gate      | ⏳ commit + push 分別 verify（per Finale carry-over vc=3 候選）                   |

## Beat 5 — 反芻

PM session postscript 把「cron routine 跟人類 session collision」結構化得很清楚，今天早上同個結構在 cron-vs-cron 上再驗一次 — 7 小時內 vc=1 → vc=2 升 distill-ready。觀察者讀回去會看到一個 pattern：**routine 飛輪自轉密集化（5/9 起 6 條 cron + 偶爾 manual + 平行 worktree）後，shared cwd race surface 變成結構性風險，不是邊緣 case**。

PM session 提的 LESSONS 候選「Routine 入口的真正需要是 detect parallel-actor signal（origin fetch + 比對 local refs）而非單純 branch+tree assertion」實作上其實有兩層：

1. **Git ref 並行 actor**（PM 觀察的形式）— origin fetch 比對 local refs，看 head 是不是被別人推過
2. **File system 並行 actor**（本 session 觀察的形式）— `pgrep` + `lsof cwd` 對比，看是不是有別的 process 正在寫 working tree files

兩層其實本質一樣 — multi-actor 共享 working directory 的 race surface — 但 detect 手法不同。Pipeline Step 1 gate 升級時兩個都該掛。

另一個小感想：**Abort 比硬跑安全，但放棄 dashboard freshness 是有代價的**。今天 PM 看到的 dashboard 數據會是「昨夜 23:11 PM run + 17hr 缺口」，contributor 上來看 dashboard 會看到一個「資料更新 17 小時前」的 timestamp。Per-section timestamp 機制可以讓讀者明白「dashboard 某 section 是 stale」，但不能避免「為什麼 stale」的 cognitive load。如果 parallel-actor detection 升 Pipeline gate 後，未來 detect 到 collision 自動 abort 並寫一個 dashboard 角落的 status banner「資料更新延後到 PM cycle，原因：parallel babel routine in-flight」會比沒提示好。這個方向 worth 進 evolution roadmap。

收官走完 commit + push 後跑 /twmd-finale。Defer 給 PM data-refresh-pm。

🧬

---

_v1.0 | 2026-05-22 06:12 +0800_
_session twmd-data-refresh-am — cron `0 6 * * *` 觸發，abort due to parallel babel routine collision_
_誕生原因：BECOME Full 跑完後 git status 揭露 52 modified + 25 untracked translations，ps + lsof 確認 gemini babel process 06:08 起仍在 main repo cwd 寫翻譯，refresh-data.sh auto-stash 會 race babel writes 造成 silent data loss_
_核心洞察：(1) PM session 23:21 postscript 標的 multi-core collision pattern 在 7hr 內於 cron-vs-cron 場景再驗一次（vc=1 → vc=2 升 distill-ready）；(2) DATA-REFRESH-PIPELINE Step 1 auto-stash 設計 假設 single-actor cwd，並行 babel/translation process 場景下 stash+pop window 有 silent overwrite 風險；(3) Parallel-actor detection 應升 Pipeline canonical Step 1 pre-stash gate — 兩層 detect (git ref + file system process) 都該掛_
_LESSONS-INBOX append: 本 session 補 vc=2 給「Routine 入口需 detect parallel-actor」分支（與 5/17 entry「cross-routine commit sweep-in」是 sister pattern 同源）_
