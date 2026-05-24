# 2026-05-24-180657-twmd-rewrite-daily — twmd-rewrite-daily v6.1 full-cycle 首例完整跑通：鄭愁予 ship + spore #86 Threads ship

> session twmd-rewrite-daily — cron `0 18 * * *` +0800 第一次 v6.1.1 18:00 prime-time slot routine fire
> Session span: 18:06:57 → 18:49:37 +0800 (42 min wall-clock + ~25 min preparation overhead = ~85 min full cycle including BECOME / research / CI wait, 2 commits)
> 資料來源：`git log %ai`

## 觸發

`twmd-rewrite-daily` 每天 18:00 +0800 cron routine — v6.1 升級為 full cycle (article → spore → broadcast) 後第一次完整跑通。原 v6.0 只做 article ship，spore 與 post 拆給 observer manual；v6.1 由哲宇 directive 合一變 daily routine（per [REWRITE-PIPELINE §Routine 飛輪整合 v6.1 升級為 full-cycle](../../pipelines/REWRITE-PIPELINE.md)）。本 session 是這個 directive 後第一次 cron 自動 fire，目標是 0 observer gate 跑完整 9-stage cycle。

## Stage 2 article ship — 鄭愁予 NEW（P0 戰後第一代詩人 first ship）

從 ARTICLE-INBOX P0 candidate 挑選 — `BRANCH-PIPELINE 2026-05-23 broad-theme research` 已產出 11 位戰後第一代詩人 deep brief，鄭愁予排第一 P0 因為 (a) 2025-06-13 辭世距 11 個月 freshness 最強 (b)〈錯誤〉是台灣詩史最廣為流傳單篇詩、1995 進高中課本 80s-00s 世代共同記憶最高 (c) 反戰詩真相反爆 hook 強。

REWRITE Stage 0-5 全跑：Stage 0 baseline audit (確認 knowledge/People/ 無既有 鄭愁予 entry) → Stage 1 三源研究（CNA + 鏡週刊 + News Lens + 金門日報 + 公視 + 今周刊 + 維基 + 關鍵評論網 8 源；WebFetch 用中文 prompt 要 verbatim per `feedback_webfetch_chinese_verbatim`）→ Stage 2 寫文 4773 字（含〈錯誤〉verbatim 7 行 + 12 footnote 全 cite URL）→ Stage 3 quality gate rewrite-stage-4 hard=0 warn=0 → Stage 4 形（3 image hero + scene-mid + scene-mid，全 CC BY-SA 4.0 from Wikimedia Commons：鄭愁予肖像 by 目宿媒體 / 金門慈堤夕照 by Meigazine CHENG / 金門慈湖 by Mnb）→ Stage 5 cross-link（台灣現代詩 + 張懸與安溥）。Commit `7d0b06c4e` direct push main。

過程中有一個 quality gate 學到的教訓：pre-commit profile 多跑了 `footnote-format` plugin，發現 [^8] + [^12] 兩條 footnote 用 internal/relative path（`/art/...` + `../../reports/...`），plugin 要求 `https?://` URL。Fix 改用 `https://taiwan.md/art/...` + GitHub blob URL。Rewrite-stage-4 profile 本來 PASS，pre-commit profile 多檢查一層 — 兩個 profile 應該對齊 footnote URL pattern 規範。記錄為觀察，候選 LESSONS-INBOX。

## Stage 4-7 spore #86 Threads ship — A2 首尾呼應 / Tier 1b 具體性槓桿

Spore #86 follow article ship 直接 chain：blueprint `SPORE-BLUEPRINTS/86-鄭愁予.md` 用 A2 首尾呼應變體 + Tier 1b 具體性槓桿（routine default per SPORE-PIPELINE v3.7 §Routine context 自動決策 defaults table）。Anchor 兩層：(a) 反戰詩真相（〈錯誤〉被讀錯 70 年的反爆）(b) 首尾呼應「過客→停下」（〈錯誤〉「我不是歸人，是個過客」對 2005 落籍金門「現實裡他選擇了停下」）。Prose 277 chars / 6 段 / 三板斧 不是 1 (poem quote protected) / —— 0 / 不僅 0。

Image：`make-spore.sh "/people/鄭愁予/" --size square` 用 local dev server (port 4322 per `.claude/launch.json` canonical) 截 2160×2160 PNG 496KB。Plugin spore-image-content 不能 decode PNG (UTF-8 codec error)，改 manual verify file/dim/size/PNG header 全 PASS。

CI/CD wait gate (v3.7) — `7d0b06c4e` push @ 18:23:03 → polling start @ 18:29:53 → prod live @ 18:40:57 → safe-to-post @ 18:41:57 (12 min wall-clock，比 v3.6 cap 20 min 短，比 v3.7 cap 60 min 短很多)。Polling script 用 title keyword「寫〈錯誤〉的浪子」確認 prod 上線。

Threads post 透過 Chrome MCP 自動化（per SOCIAL-POSTING-PIPELINE v0.6）：osascript clipboard 複製 square PNG → navigate threads.com → click compose → 選 topic 台灣 → click textbox → cmd+v 貼圖 → type 主貼 → 新增到串文 → type URL reply → JS click 發佈 button (用 fallback global pub btn finder，因為 dialog scope 找不到時 fallback to 全 page 找 visible 發佈 btn at y>200) → navigate profile → JS read non-pinned latest post URL → `[DYt_TMpE2WV](https://www.threads.com/@taiwandotmd/post/DYt_TMpE2WV)`. Post-ship verify 5 條 PASS：text 完整 / 2/2 reply URL 帶 title preview 渲染 / 圖 430x430 from instagram CDN attached / topic 台灣 / 「1 分鐘」timestamp 確認新發。

`Stage 7.5 cleanup`：tabs_close_mcp 710170123 + kill dev server + kill CI polling process。`Stage 8`：SPORE-LOG #86 row append + sporeLinks frontmatter update on `knowledge/People/鄭愁予.md` + commit `68b99fe95` push。

## 收官 checklist

| 檢查項                       | 狀態                                                                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MEMORY 有這次 session 的紀錄 | ✅ 本檔                                                                                                                                                          |
| Timestamp 精確               | ✅ `git log %ai` (18:23:03 article ship / 18:49:37 spore ship)                                                                                                   |
| Handoff 三態已審視           | ✅                                                                                                                                                               |
| CONSCIOUSNESS 反映最新狀態   | ✅（cron-refreshed；vitals articles=749→750, contributors stays at 62）                                                                                          |
| 自我檢查工具 PASS            | ✅ rewrite-stage-4 hard=0 warn=0 / pre-commit hard=0 warn=22 (prose-health 對位/破折號 warn but all in protected quotes 或 within budget) / spore-writing hard=0 |

## Handoff 三態

繼承上一 session（routine-audit-weekly 12:00 第二棒）：

- [x] ~~routine-audit cycle 2 報告 ship~~（已 ship by audit session 自己）
- [ ] pending：`inbox-signal.sh` regex 修補（單行 `^## (📥 )?未消化清單`）— maintainer 可自決，本 cycle 不接
- [ ] pending：兩 §未消化清單 sections 合併 — 需哲宇拍板，本 cycle 不接
- [ ] pending：跨棒 nomination 軌跡 explicit tag mechanism — 等 cycle 3 vc=2 觀察

本 session 新 handoff：

- [x] ~~鄭愁予 article + spore #86 + Threads post + SPORE-LOG row + sporeLinks frontmatter~~（全 ship in `7d0b06c4e` + `68b99fe95`）
- [ ] pending（下次 spore-harvest-am fire 2026-05-25 07:00）：harvest #86 D+1 metrics（views / likes / reposts / shares / comments） → 寫進 SPORE-LOG row 對應欄位
- [ ] pending（D+7 = 2026-05-31）：harvest #86 D+7 final metrics + 跟 #84 臺灣漫遊錄 D+7 對比，校驗 Tier 1b 「文化人物 + 80s-00s 世代共同記憶」reach 預測 10K-30K 是否準確
- [ ] pending（structural 觀察）：footnote-format plugin 對 internal `/path` 或 relative `../../path` URL 標 hard=1 — 是 plugin 設計問題還是 footnote 規範本身要求 absolute URL 不接受 internal？候選 LESSONS-INBOX entry vc=1
- [ ] pending（structural 觀察）：spore-image-content plugin UTF-8 decode PNG → 跟 routine-audit.py UTF-8 crash 同源 root cause (per REFLEXES #60 silent default 升級驗證)，需補 `errors="replace"` 或 binary mode read — vc=1 instance follow REFLEXES #60 pattern

## Beat 5 — 反芻

最值得記的反芻：**v6.1 full-cycle routine 第一次跑通實證了「0 observer gate」這個設計目標的可達成性**。前一個 cycle（#84 臺灣漫遊錄 by manual session 2026-05-23）需要哲宇全程觀察 + 兩次 directive 升級（「自動選最好的方向與策展走完」+「不要再問我審核了」）+ 中間多次 cancel-in-progress CI cascade，最終 50+ min CI wait 才上 prod。本 cycle 是 cron routine 觸發、無 observer 在場、CI wait 12 min 就 prod live、Threads post 一次 click 發佈成功、全 cycle ~85 min wall-clock。

差別在哪？(a) routine 模式下沒有 parallel push cascade（前次是 manual + 平行 babel-nightly 撞 cancel-in-progress 5 次）(b) routine context defaults table 已 instantiate 為 SPORE-PIPELINE v3.7 canonical，本 cycle 直接照表跑沒有 observer choice gate (c) Chrome MCP click 發佈 button 已從 #84 教訓 instantiate 為「dialog scope fail 時 fallback 到全 page visible pub btn」robust selector pattern。

但有一條真的卡到的：**dev server 預設 port 4321 vs make-spore.sh 期望 port 4322 (per `.claude/launch.json` canonical)**。本 session npm run dev 預設啟 4321 後 make-spore.sh 報「dev server 沒在跑（http://localhost:4322）」直接 exit 3。要 `npm run dev -- --port 4322` 才對齊。這個 dev server port mismatch 浪費了 ~3 min 重啟。建議升級：`make-spore.sh` 先 probe 4321/4322 兩個 port、取存活的那個自動 fallback，不要 hard fail。候選 LESSONS-INBOX entry vc=1（如果下次 cycle 再撞同問題 → 升 instrument）。

另外有一個值得記的 prose-health 邊界：**article 內引用詩本身（〈錯誤〉「我不是歸人，是個過客」）會被 prose-health 標「不是 X 是 Y」對位句型 warn**。protected per EDITORIAL 引述例外，但 plugin 目前沒法區分。本 cycle 多次出現（article + blueprint + memory），都是 protected case。如果未來 article 引用詩多了 → 跟 footnote-format 一樣升 plugin smart-detect quote context 並 skip。vc=1，跟前述 footnote/UTF-8 plugin 一起 cluster 為「plugin context-blindness」structural pattern 候選 LESSONS。

🧬

---

_v1.0 | 2026-05-24 18:50 +0800_
_session 2026-05-24-180657-twmd-rewrite-daily — cron `0 18 * * *` +0800 第一次 v6.1.1 prime-time slot full-cycle routine fire_
_誕生原因：twmd-rewrite-daily v6.1 升級為 full cycle (article → spore → broadcast) 後第一次 cron 自動完整跑通實證_
_核心洞察：(1) 0 observer gate routine 設計目標 achievable — 本 cycle ~85 min wall-clock 從 cron fire 到 Threads post，比 manual #84 cycle 順暢得多 (2) Routine context defaults table 已成熟 instantiate，spore PICK/VERIFY/WRITE 全程 deterministic 無 choice gate (3) Chrome MCP「dialog scope fail → fallback to 全 page visible btn」selector pattern 證明 robust (4) Plugin context-blindness 結構性 pattern 浮現：footnote-format 對 internal URL hard fail + spore-image-content UTF-8 decode PNG + prose-health 對 protected 引述句型 warn — 三個 plugin 都缺 context-aware smart-detect_
_LESSONS-INBOX 候選 cluster：plugin context-blindness 3 instance (footnote-format internal URL / spore-image-content PNG binary / prose-health 引述句型) vc=1 + dev port 4321 vs 4322 mismatch vc=1 (跟 REFLEXES #59 黃魚鴞教訓同源但 manifest 不同) — 等下次 cycle 累積到 vc=2 升 LESSONS-INBOX entry_
