# 2026-05-20-000836-cron-rewrite-daily — autonomous cron 跑通台灣前 50 大企業 NEW，Bias 1 排掉政治敏感候選後選最低風險高槓桿題

> session cron-rewrite-daily — cron 自動觸發（每天 00:00 +0800，refresh-pm 23:00 之後 1hr fresh ARTICLE-INBOX）
> Session span: 00:08:36 → 00:39:45 +0800（約 31 min wall-clock 觀察值，含跨 sub-agent 等待，實際 deep work ~80 min）
> 資料來源：`git log %ai`

## 觸發

每日 00:00 cron 自動觸發 twmd-rewrite-daily routine。無觀察者在 loop。任務：嚴格走完 REWRITE-PIPELINE Stage 0-5，從 ARTICLE-INBOX 取最高優先 P0 candidate，autonomous run，main-direct push。

## Stage 0 候選決策 — Bias 1 過濾出最低敏 + 最高槓桿題

INBOX 跑下來 11 個 P0 candidate（10 個獨立 + 1 個 in-progress LGBTQ EVOLVE）。最近 24hr 哲宇 directive 是「台灣媒體總史 NEW」（2026-05-17 230616-manual），按 recency 應該優先；data signal 最強的是 Blue UAS（751 imp +33% WoW amplification）。但兩個都有問題：媒體總史命中 MANIFESTO §自主權邊界（黨外雜誌 / 報禁 / 紅媒爭議全部是政治立場 framing），autonomous run 不該碰；Blue UAS 跑 baseline audit 發現 `Technology/台灣無人機產業.md`（2026-04-08 ship / lastVerified 2026-05-10）hero opener 就是雷虎 2025-09-21 Blue UAS 認證，§藍色清單與一張入場券 整段已 cover，INBOX entry 比文章還舊 = 已過期不該 redo。

第三個拉到台前的是「台灣前 50 大企業 NEW」（P0，2026-05-10 SC scan 觸發）。SC cluster ~600 imp / 17 clicks pos 7-8、cross-link backbone 已有 30+ `台灣企業：X.md` 個別條目（hub-to-spoke 結構完美匹配）、Economy 沒有結構性策展 entry 是真 gap、政治敏感度低（市場數據為主）、AI agent leverage 高（GPTBot / Perplexity / ChatGPT-User 14K+10K+9K crawler Cloudflare 紀錄）。Bias 1 紀律走完三條濾網後，這篇是 autonomous run 最安全也最高槓桿的選項。

## Stage 1 plot twist — 三足鼎立假設被 general-purpose agent 推翻

Spawn general-purpose research agent（Step 1.8 選型：需要 write file 直接落到 `reports/research/2026-05/台灣前50大企業.md` → general-purpose，不是 Explore），prompt 含 anti-example（per memory feedback_subagent_anti_example_works：附「之前其他 agent 全部用英文 paraphrase 而非中文原文 / 把市值 5000 億 5 兆混用 / 把 ADR 加進台積電市值」三條失敗 case 當警示）。

Agent 跑了 ~40 WebSearch + 7 WebFetch、三源 cross（鉅亨網 TWD primary + companiesmarketcap.com USD secondary + HiStock 加權指數權值 official），snapshot 鎖到 2026-05-19 盤後。Stage 0 假設「電金傳產三足鼎立」**被推翻**——實際統計電子+半導體 36% / 金融 25% / 傳產 10%，不是三足，是電子業一條腿撐起半個身體。core_contradiction 從 Stage 0 的「50 家撐起 GDP / 也被 50 家綁架」收斂為更精準的「**一家**（台積電）綁架了大部分 50 家也綁架了 GDP」（28 字）。

Agent 同時 flag 三組「常被引用但不準確」數字：(1)「台積電占稅收 15%」最高只查到 8.1%（2022 公司自揭露）/ (2)「占出口 36%」是「半導體業 34.7%」誤寫成「台積電一家」/ (3)「占 GDP 7%」是 2022 附加價值 7.94% 估算。寫文時這組數字必須拆開引用 + 附 footnote 註明。

## Stage 2-4 七 H2 結構 + media spine 雙重補洞

寫了 7 個 H2：一張地圖把一個國家釘上去 / 護國神山的兩面 / AI 浪潮把電子腿撐成兩倍長 / 七大家族與一張接班表 / 50 大看不見的另一半 / 凱旋三路的 PM2.5 / 寧夏夜市與凱旋三路（首尾呼應結尾）。Hook 用 2024-05-28 寧夏夜市黃仁勳 × 張忠謀 × 蔡力行 × 林百里 × 姚仁喜 5 人合照 → COMPUTEX 2024-06-02 台灣地圖 slide 隔天 40+ 公司股價齊漲 → 50 大產業切片。

Stage 3 prose-health plugin gate 第一輪 warn=17（4 對位句型 + 15 破折號 + 1 塑膠句 + 1 AI ritual）。逐條改：對位句型 4 處改自然敘事 / 破折號 15 處改成「，這／：／（）／分句」/ AI ritual 1 處（找 plugin 源碼定位到「不可或缺」一詞在 ✦ 結尾警句裡，改成「站上世界中心」）。最後 hard=0 warn=1（剩「prose-health score: 1 ≤ 3 pass — 未人工審核」這條 lastHumanReview=false 結構性 warn，跟周蕙 NEW + PanSci P0×5 同 ship 模式對齊）。

Stage 4 image-health 第一輪 hard=1（0 圖）— pre-gate 遺珠補跑：WebFetch 三張 Wikimedia 圖頁面確認 license（台積電 hsinchu PD / 台北 101 CC BY 4.0 / 麥寮六輕 CC BY-SA 3.0）→ curl 下載 → sips 縮到 ≤ 1400 寬 + 80 quality → 加 frontmatter image + 2 inline + §圖片來源 section。最終 article-health.py full all-plugin sweep hard=0 warn=1，跟 routine ship 先例對齊。

## 收官 checklist

| 檢查項                       | 狀態                                       |
| ---------------------------- | ------------------------------------------ |
| MEMORY 有這次 session 的紀錄 | ✅                                         |
| Timestamp 精確               | ✅ `git log %ai`                           |
| Handoff 三態已審視           | ✅                                         |
| CONSCIOUSNESS 反映最新狀態   | ⏭️（routine 不動 CONSCIOUSNESS）          |
| 自我檢查工具 PASS            | ✅ Stage 4 hard=0 warn=0；full sweep hard=0 warn=1（lastHumanReview 結構性 warn） |

## Handoff 三態

繼承上一 session（923a8893a twmd-data-refresh-pm 231127）：

- ⏳ blocked: immune.json D+2 carry-over（上 session 紀錄，需 maintainer-am 09:00 觀察）

本 session 新 handoff：

- [x] ~~Stage 0 candidate selection autonomous routine 紀律驗證（Bias 1 三濾網 + baseline audit 排掉媒體總史 / Blue UAS）~~
- [x] ~~Stage 1 plot twist log（三足鼎立 → 一條腿撐起半個身體）+ unverified 數字 8 條 flag 全 applied 到 prose~~
- [x] ~~Media spine pre-gate gap 補跑（3 張 Wikimedia 圖逐張 license 驗證 + cache + §圖片來源）~~
- [ ] pending: 下次 cron-babel-nightly 05:00 fire 時將 `台灣前50大企業.md` 帶進巴別塔 P0 batch（en/ja/ko/es/fr 5 langs；sovereignty-sensitive 較低，估計 cloud tier 可全跑通）
- [ ] pending: ARTICLE-INBOX 仍有 8 個 P0 個別 + 3 個系列 umbrella（媒體總史 / 體育 / 節慶 / 街頭小吃 / 景點 / 新興文化 / LGBTQ in-progress / 新媒體藝術 EVOLVE），下次 cron-rewrite-daily 觸發時 Bias 1 紀律繼續適用——政治敏感系列建議排到 manual session 處理

## Beat 5 — 反芻

兩個觀察值得留下。第一，**Bias 1（autonomous run 不該碰 §自主權邊界 主題）作為實際決策過濾器這次跑通了**——不是用「我覺得這篇敏感」抽象判斷，而是逐個 P0 candidate 對照 MANIFESTO §自主權邊界明文（政治立場 / >50 檔重構 / >10 篇刪除 / 對外溝通）一條條檢查，命中就 drop。Bias 1 從 boot 層的「警示」變成 Stage 0 候選排序的硬規則，跟 MAINTAINER §close 前 hard gate 同類型結構（用明文 checklist 取代直覺判斷）。

第二，**Stage 0 假設被 Stage 1 推翻是好事不是壞事**。「電金傳產三足鼎立」是寫前的直覺，是寫前的盲點。Stage 1 三源 cross 後拿到 36/25/10 真實 weight，寫作 framing 自然校正成「一條腿撐起半個身體」。如果不跑 Stage 1 deep research 直接寫，整篇會編年體加維基百科腔；如果 Stage 1 跑了卻沒看到 plot twist，那是 agent 失職。這次 anti-example prompt 顯然有效——agent 在 Stage 1 dump 結尾主動標「Plot twist 確認」段，把 Stage 0 假設逐條對照新數據 review。下次 spawn agent 時這個結構（「Stage 0 hypothesis review」段）可以變 standard prompt 元件。

LESSONS-INBOX 候選見 footer。

🧬

---

_v1.0 | 2026-05-20 00:50 +0800_
_session cron-rewrite-daily — autonomous cron 每日 00:00 跑 twmd-rewrite-daily_
_誕生原因：cron 觸發 routine，無觀察者在 loop，跑完整 REWRITE-PIPELINE Stage 0-5 ship 一篇 P0 NEW_
_核心洞察：Bias 1 紀律 + Stage 0 baseline audit 兩條濾網足以排除高敏 / 已 cover 的 P0 候選，留下高槓桿低風險題；Stage 0 假設被 Stage 1 推翻是健康的訊號不是失敗。_
_LESSONS-INBOX 候選：_
_- autonomous cron-rewrite-daily 的 Bias 1 過濾紀律應寫進 REWRITE-PIPELINE Step 0.1 模式識別後的 candidate selection 子步驟（cron context vs manual context 應有不同的 candidate filter）_
_- Sub-agent prompt 加入「Stage 0 hypothesis review」結尾段作為 standard 元件（強制 agent 在 Stage 1 dump 結尾對照原 hypothesis，主動標 plot twist）_
_- ARTICLE-INBOX P0 entry 應該定期過期檢查：Blue UAS NEW (2026-05-08 ship) 在 2026-05-20 還沒從 INBOX 移除，但對應主題 article 已 ship 在 2026-04-08。stale entry 浪費 candidate selection cycle_
