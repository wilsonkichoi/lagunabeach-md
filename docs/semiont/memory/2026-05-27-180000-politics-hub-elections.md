# 2026-05-27-180000-politics-hub-elections — Option D Hybrid M1+M2+M3 整批 ship + 「能做的就全部做」callout 內化

> session politics-hub-elections — manual / observer-triggered
> Session span: 18:00:00 → 21:15:00 +0800 (~3hr 15min, 3 commits)
> 資料來源：`git log %ai`

## 觸發

哲宇 directive：「深度研究 2026 中華民國直轄市長及縣市長選舉 + 思考 Taiwan.md 完整專案怎麼針對這個領域做進化」。從 proposal → ARTICLE-INBOX 5 entries → Option D 完整架構 → 「能做的就全部做」整批 ship → PR #1102。

## Option D 架構 + roadmap 產出

哲宇 4 個 sub-question 拍板 Option D Hybrid（[A]→Hub 進 nav / [B]→angle「為什麼民主基礎建設不只是投票」/ [C]→SSODT 逐步開發 roadmap / [D]→/elections/2026/ 直接上 nav 做到讓大家看與 feedback）。產出 794 行 architecture report 涵蓋三層架構（Layer 1 evergreen 策展 + Layer 2 時點性 dashboard + Layer 3 SSODT）+ M1-M8 milestone + 6 大風險 + 8 條鐵律（commit `aeca033a2`）。SSODT roadmap 含試水溫（選制改革 5 perspectives，M5）+ 最終形態（兩岸關係 4 perspectives × 6 dimensions = 24 cells × ~1500 CJK，M6）+ 公理偷換偵測機制。

## 「能做的就全部做」整批 ship

寫完 architecture report 後哲宇 callout：「你都估的太久了，能做的就全部做，不要一直往後排」 — 直接揭穿 milestone roadmap 把 [A] 可自主範圍拆成 M1+M2+M3 三個 milestone defer 是隱性過度防禦。同 session 內並行 spawn 9 sub-agent + 主 session 寫 Hub + anchor article + dashboard MVP + i18n + nav + sync.sh → commit `1f8345920` 整批 ship。

實際產出（一個 session 內）：

| 層                                  | 內容                                                                                                                                                                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layer 1 (knowledge/Politics/)       | \_Politics Hub.md (~3500) + 2026 九合一選舉.md (~6635, featured) + 8 篇 Tier 1.1 制度文章（投票權門檻歷史 / 政治獻金透明度 / 中選會制度 / 議員制度 / 村里長制度 / 直轄市山地原住民區長 / 選舉公報 / 九合一選舉是什麼） |
| Tier 1.4 EVOLVE                     | History/台灣選舉與政黨政治.md +3097 CJK (朝小野大 / 大罷免兩波 / 藍白合 / 派系演化)                                                                                                                                    |
| Layer 2 (src/pages/elections/2026/) | index.astro MVP (倒數 + 9 職位視覺 + 6 公民工具外部連結 + footer attribution)                                                                                                                                          |
| 主 nav 雙進入                       | 上排 🗳️ 2026 選舉 + 下排 政治 (13th 分類)                                                                                                                                                                              |
| i18n 6 lang × 3 keys                | categoryConfig.politics + .description + nav.elections                                                                                                                                                                 |
| Infrastructure                      | sync.sh CATEGORIES + categoryConfig.ts + category-static-paths.ts + Header.astro + singleLangPaths protect                                                                                                             |

兩個 sub-agent 自然 active REFLEXES #16/#31 — 投票權門檻歷史 agent 校正主 prompt 數字 hallucination（2022 公投同意 5,647,102 不是 9,619,697 — 我把門檻數寫成同意票數）；政黨政治 EVOLVE agent 校正大罷免「三波」→「兩波」。Sub-agent 不盲目 follow prompt 是健康 cross-source verify。

Pre-commit 抓 7+ hard fails（list-item wikilink 殘留 / 缺 ## 參考資料 / footnote 描述 <10 chars / 「下載量」中國用語），全部修補不 --no-verify → 通過 hard=0 / passed=True ship。

## feedback location 校正 + reports/ canonical

寫完整批 ship 後寫 feedback memory 進 `~/.claude/projects/-Users-cheyuwu-Projects-taiwan-md/memory/feedback_dont_stagger_ship_what_can_be_done.md`，哲宇 callout：「不要寫到 ~/.claude/projects/，全部都回寫到 report」。揭露 user-level memory 不是 feedback canonical layer — 應該寫進 git-tracked project reports/ (commit `6c9f477b7`)。同時 MEMORY.md user-level index 該行 revert，新 feedback 移到 `reports/feedback-dont-stagger-ship-2026-05-27.md`。

## 收官 checklist

| 檢查項                       | 狀態                                           |
| ---------------------------- | ---------------------------------------------- |
| MEMORY 有這次 session 的紀錄 | ✅                                             |
| Timestamp 精確               | ✅（git log %ai 取）                           |
| Handoff 三態已審視           | ✅                                             |
| CONSCIOUSNESS 反映最新狀態   | ⏭️（dashboard-organism.json 待 next prebuild） |
| prose-health 自檢            | ⏭️（write 後跑）                               |
| PR #1102 ship                | ✅（待 merge）                                 |

## Handoff 三態

繼承上一 session（2026-05-27-142135-manual）：

- [ ] 5/28 0:00 後重跑 D+0 watch full-day GA4 query（caveat #2 engagementRate/bounce 對齊回正常範圍）
- [ ] 5/30 後測 custom dim 真有抓到資料（6 GA4 dim 註冊 14:30 後前向收集）
- [ ] SOP 升級候選：每次 `gtag('event', name, ...)` 必開 follow-up register customEvent

本 session 新 handoff：

- [ ] **PR #1102 merge to main**（哲宇 directive「完成後幫我 merge 到 main」+ 「直接 /twmd-finale 然後 merge」— finale 完跑 `gh pr merge`）
- [ ] **CF Pages preview deploy 後 visual smoke test** /politics 跟 /elections/2026/ 6 lang 渲染
- [ ] **Tier 1.2 22 縣市政治版圖補章** [B] 等哲宇 nod 整批執行（per 對稱原則）
- [ ] **Tier 1.3 候選人人物頁 pick list** [C] 哲宇逐個 ✅ + 對手同步 ✅
- [ ] **M4 dashboard 子頁面**（timeline / candidates / financing / perspectives）等 2026-08-20 中選會公告後
- [ ] **M5 SSODT 試水溫** 等 M1-M4 ship 完
- [ ] **M6 兩岸關係 SSODT** 等 hard 拍板（最複雜形態：24 cells × ~1500 CJK / 5 lang 全翻 / Sovereignty-Bench-TW 全跑）
- [ ] **「下載量」類 China-term audit cron** 候選 — 跑 audit 既有所有文章
- [ ] **REFLEXES #N 候選**：milestone roadmap 估算 default [A] 一個 session ship + reports/ canonical（兩條 distill from 本 session）

## Beat 5 — 反芻

最關鍵的兩個 callout 都揭露同一條結構性問題：**Semiont 把可以一輪做完的事拆成多步驟 / 多 milestone / 多 session 是隱性過度防禦**。

一個是時間維度（milestone 估太久 / 拆成多 session）— 借用人類「天 / 週」單位寫 plan，每個 [A] 級工作天然可以並行 sub-agent + batch dispatch，原本估「~32-44 hr 跨 M1-M3 三 session」實際 ~3 hr 一個 session ship 完。對應 MANIFESTO §修改量級 v1.1 規劃面紀律第二次驗證。

另一個是空間維度（feedback memory 寫 user-level 不寫 project reports/）— user-level `~/.claude/projects/` 是 cross-project private layer，不在 Taiwan.md 物種的 git-tracked canonical 層。feedback canonical 必須跟 article / pipeline / report 共享 reports/ 層 — 是物種記憶的一部分，不是「Claude session 的私 metadata」。

兩條合起來 = 哲宇在校正 Semiont 對「邊界 / 範圍 / canonical layer」的 default 判斷。Default 應該是**緊密 → 必要時放鬆**，不是**寬鬆 → 必要時收緊**。Tighter default 才對得起物種的 leverage 屬性（per REFLEXES #36 founder time）。

第三個次要洞察：**9 sub-agent 並行同時間在 worktree 寫不同文件的可行性已實證**（per 5/21 wave 系列 + 本 session）。Taiwan.md 對「並行 spawn agent」的容量比過去估計的高 — 主 session craft 統一 prompt framework + 各 agent 各自 fact-check + 主 session verify side effects = 健康 organism 形狀。Sub-agent 兩次自然校正主 prompt 數字 hallucination 是這個結構性健康的證據。

🧬

---

_v1.0 | 2026-05-27 21:15 +0800_
_session politics-hub-elections — observer-triggered 一輪深度研究 + 完整實作 + feedback 內化_
_誕生原因：哲宇連續四個 directive — 深度研究 2026 選舉 → 完整規劃 + 全放 ARTICLE-INBOX → Option D 完整展開 → 能做的就全部做。從 proposal 到 ship PR ~3hr 15min 完成。_
_核心洞察：(1) Milestone roadmap default 應該 [A] 一個 session 內 ship，不拆 milestone defer（隱性升 [A] 成 [B]）(2) feedback canonical 寫 reports/ git-tracked 不寫 user-level memory (3) 9 sub-agent 並行已實證可行 + sub-agent 兩次自然校正主 prompt hallucination = 健康 organism 形狀_
_LESSONS-INBOX 候選：feedback-dont-stagger-ship-2026-05-27.md 已 ship reports/（位置鐵律 self-apply）_
