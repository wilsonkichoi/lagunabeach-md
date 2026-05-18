---
spores: '#71, #72, #73, #74, #75, #76, #77'
harvest_date: '2026-05-19 07:00'
harvest_window_day: 'mixed (D+2 to D+9)'
batch_reason: 'routine twmd-spore-harvest-am daily cycle — 7 backfillWarnings; apple sidra pair (#72/#73) D+7 main KPI cutoff; Chen Chien-nien pair (#74/#75) D+2 trajectory check Tier 1a 爆發確認; 臺灣前途決議文 pair (#76/#77) D+2 中段 trajectory; #71 X URL 6th-cycle mismatch carry-over.'
triggered_by: 'cron twmd-spore-harvest-am 07:00 Asia/Taipei'
reply_count: '~25+ across 6 valid spores (most on #74 Chen Chien-nien with strong Puyuma community resonance)'
---

# Batch Harvest 2026-05-19 — 7 spores (routine cycle)

> Daily auto-fire of `twmd-spore-harvest-am` 07:00 cron (per ROUTINE.md §TWMD spore harvest (am) + SPORE-HARVEST-PIPELINE.md v2.2). Today's cohort spans three release waves: drone X-only (#71, D+9 carry-over mismatch), apple sidra pair (#72/#73, D+7 — main KPI cutoff today), Chen Chien-nien pair (#74/#75, D+2 Tier 1a trajectory), and 臺灣前途決議文 pair (#76/#77, D+2 中段 trajectory). Drone Threads (#70) closed its D+7 main KPI yesterday and is out of routine window.
>
> **#71 X URL content-hash mismatch — 6th cycle**（per v2.10 §Content-hash mismatch 偵測 + LESSONS-INBOX #5 vc=5+1）: URL `2053101189034860856` 仍 resolves to #69 TSMC content (utm_campaign=s69, "1985 年 9 月 4 日，行政院政務委員李國鼎..."). Previous 5 cycles (5/12 dry-run + 5/13 + 5/16 + 5/17 + 5/18) all observer schema fix pending. Today carry-over: skip metric update, no fingerprint baseline build attempt. Per 5/18 batch §carryover, today (6th) should re-escalate observer prompt — entry vc=6 → LESSONS distill 候選.

## 數據總覽

| #   | Article           | Platform | D+N | URL                  | Views   | Likes | Reposts | Replies | Bookmarks | Rate   | Notes                                                                       |
| --- | ----------------- | -------- | --- | -------------------- | ------- | ----- | ------- | ------- | --------- | ------ | --------------------------------------------------------------------------- |
| 71  | 台灣無人機產業    | X (ERR)  | D+9 | 2053101189034860856  | n/a     | n/a   | n/a     | n/a     | n/a       | —      | 🚩 6th-cycle mismatch — URL resolves to #69 TSMC. Skip update. Re-escalate.  |
| 72  | 蘋果西打          | Threads  | D+7 | DYPI9W0kyPP          | 4,805 views   | 47    | 8       | 2       | —         | 1.20%  | +45 views vs 5/18. **D+7 main KPI cutoff** — 中段 plateau confirmed at ~5K  |
| 73  | 蘋果西打          | X        | D+7 | 2054158652588863776  | 19,029 views  | 236   | 33      | 2       | 27        | 1.56%  | +12 views vs 5/18. **D+7 main KPI cutoff** — Tier 1b plateau at ~19K        |
| 74  | 陳建年            | Threads  | D+2 | DYbYsqOldKC          | 38,000 views  | 2,722 | —       | 14+     | —         | 7.16%+ | 🔥 +8K views / +584 likes vs D+1. Tier 1a 爆發確認 — Puyuma community 共鳴 |
| 75  | 陳建年            | X        | D+2 | 2055881969976873375  | 9,569 views   | 265   | 42      | 1       | 22        | 3.45%  | 🔥 +5K views / +123 likes vs D+1. X niche 文化/音樂 community ramping up    |
| 76  | 臺灣前途決議文    | Threads  | D+2 | DYca5etE80R          | 26,000 views  | 349   | —       | 8+      | —         | 1.37%  | +15K views / +158 likes vs D+1. 中段 超出 17K 上限 — 川習會新聞熱度 boost   |
| 77  | 臺灣前途決議文    | X        | D+2 | 2056026352298688935  | 186 views     | 16    | 3       | 0       | 1         | 10.75% | +77 views vs D+1. 仍低段 — Tier 1b 政治-歷史 hook X 演算法 unfavorable      |

## Tier 分布觀察（per SPORE-PIPELINE §Hook tier hierarchy v3.1）

- **Tier 1a 知名度槓桿（D+7 100K-180K viral 預期）**：#74 陳建年 Threads D+2 38K — 從 D+1 30K → D+2 38K，trajectory 健康但 slope 趨緩（D+1→D+2 +27% vs viral 需要 +50%+ pattern）。D+7 落點推估 60-80K（不及 viral top 100K-180K 但符合 Tier 1a 中段 expected range）。第一次驗證「4 天王 + 警察雙身份」hook combo 維持中強 traction
- **Tier 1b 具體性槓桿（10K-65K）**：#73 蘋果西打 X 19.0K（D+7 plateau confirmed）— peak ~19K，落在 Tier 1b 中下段
- **中段 結構性題目（2K-17K）**：#72 蘋果西打 Threads 4.8K（D+7 final）/ #76 前途決議文 Threads 26K（D+2，已超 17K 中段上限 — 政治即時新聞熱度 boost 超預期）
- **低段 文化人物 / 冷門（0.5K-1.5K）**：#75 陳建年 X 9.5K 已脫離低段進入中段（X niche 文化/音樂 community received well）/ #77 前途決議文 X 186 確認低段 (Tier 1b political-history hook 不被 X 演算法買單)
- **N/A（data error）**：#71 6th cycle 仍 mismatch

**Engagement rate leader**：#77 X 10.75%（但 base 太小 — 低觸及下 high rate 不代表 hook 強）/ #74 陳建年 Threads 7.16%+（爆發中持續 Tier 1a 高 quality engagement）/ #73 蘋果西打 X 1.56%（plateau）/ #72 蘋果西打 Threads 1.20%（plateau）/ #76 前途決議文 Threads 1.37%（即時新聞 boost reach 但 engagement 偏 中段標準）

## Trajectory deltas（5/18 → 5/19 24hr）

| #   | Δviews  | Δlikes | Δreposts | Δreplies | Notes                                                                  |
| --- | ------- | ------ | -------- | -------- | ---------------------------------------------------------------------- |
| 71  | n/a     | n/a    | n/a      | n/a      | 6th-cycle mismatch carry-over (observer schema fix pending)             |
| 72  | +45     | 0      | 0        | 0        | **D+7 main KPI cutoff — final**. Reach window closed at 4,805 views    |
| 73  | +12     | 0      | 0        | 0        | **D+7 main KPI cutoff — final**. Flat plateau at 19,029 views          |
| 74  | +~8,000 | +584   | —        | —        | Tier 1a continued ramp — slope decelerating but 60-80K D+7 plausible   |
| 75  | +5,004  | +123   | +22      | 0        | X niche 文化 community lift — 4.5K → 9.5K +110% growth                 |
| 76  | +15,000 | +158   | —        | —        | 即時新聞 boost — 11K → 26K +136% growth, 超 中段 17K 上限                |
| 77  | +77     | +8     | +2       | 0        | Marginal X niche pickup — Tier 1b political-history hook 演算法 不買單  |

**Pattern**：apple sidra cohort 今天 D+7 KPI 結算（Threads 4.8K 中段 / X 19K Tier 1b 中下段，整體合理但未達 Tier 1b 上端 65K viral）；Chen Chien-nien pair 持續 ramping（Threads Tier 1a 38K D+2 / X 9.5K niche pickup）；前途決議文 pair Threads 即時新聞 boost 26K（中段超 ceiling）vs X 186（低段確認）— 平台對「政治-歷史 + 即時新聞」反差 routing 結果迥異。

## Comment 質性筆記（per Step 2 categorization）

### #72 蘋果西打 Threads (D+7 final, 2 replies — same as 5/18)

@tsaiguoian collaboration suggestion to @kandao.tw 仍是唯一 substantive reply (5/16 ago, 2 天前 unchanged). 24hr 內 0 new substantive reply. D+7 closure: low reply density 符合 mid-tier 結構性題目 expected pattern.

### #73 蘋果西打 X (D+7 final, 2 replies — same as 5/18)

X 端 reply 內容未展開。本 cycle 0 new substantive reply. D+7 closure unchanged.

### #74 陳建年 Threads (D+2, 14+ visible replies — mostly carry-over from 5/18 first harvest)

Yesterday batch (5/18 §74) 已詳細 categorize 14+ 共鳴/擴寫 replies (@puyumaemily 卑南族個人經驗 / @sheilahsiu 金曲歐巴桑敘事 / @br_he 原民世界觀詮釋 / @artdirectortodj 陸森寶家族脈絡 / @loofahlinn 蘭嶼派出所 anecdote 等)。本 cycle (D+2) 未見明顯新增 substantive reply (likes 從 2,138 → 2,722 +584 表示繼續被閱讀分享，但 reply density 在 14+ 範圍 holding steady).

**0 條 correction**（持續整 D+1 + D+2 觀察）。0 條 attack/敵意。0 條 AI 書寫質疑。質性極正面，符合文化人物 Tier 1a 預期。

**處理建議**：
- 不修文章本體
- Perspective frontmatter 候選 batch（@puyumaemily / @br_he / @artdirectortodj / @loofahlinn）— 仍 pending observer 決定
- @br_he 「敬天畏地的同時又勇於開創」考慮 pull-quote 候選

### #75 陳建年 X (D+2, 1 reply visible — same as 5/18)

X 端 reply count 仍 1 — 內容未展開（X UI 本 cycle 不深入抓單 reply）. Likes +123 indicates continued circulation but reply 不擴增是 X 平台正常 pattern.

### #76 臺灣前途決議文 Threads (D+2, 8+ visible replies — mostly carry-over from 5/18)

Yesterday batch (5/18 §76) 已 categorize 8+ replies (政治辯論 cluster: @santsaitsai 共鳴「目前=維持現狀 高智慧」/ @1106danolo 擴寫鄭麗文 context / @suriyon.taywan 共鳴「前人智慧」/ @rayboy197564 攻擊「世界最孬種獨派團體」邊界類 / @seanhsin 政治路線質疑 / @chia23123 質疑「民眾沒同意」)。本 cycle (D+2) 配合 +15K views 大增, reply 數應該也擴增但 visible count 仍 ~8+（Threads UI 折疊回覆 mechanism — 全 reply 需展開）.

**0 條 correction**（D+1+D+2 觀察）。**1 條政治攻擊** (carry from 5/18)。**3+ 條政治質疑** — 屬正常結構性題目 engagement.

**處理建議**：
- 不修文章本體
- @santsaitsai / @suriyon.taywan 共鳴可選 perspective 歸檔（低優）
- 不主動 reply — 政治辯論 cluster 自然引發，無 misinterpretation 需校正

### #77 臺灣前途決議文 X (D+2, 0 reply — first harvest day continuation)

X 端 186 views / 0 reply / 16 likes / 3 reposts — reach 仍偏低 not enough to ignite discussion. 確認 Tier 1b 政治-歷史 hook X 演算法 unfavorable; 未來 X 政治題材建議 fan out 但 expected reach low.

## #71 Content-hash mismatch 第 6 次驗證 — 觀察者 schema 修正 仍 pending

> Per SPORE-HARVEST-PIPELINE v2.10 + 5/18 batch §#71 carry-over — 連 5 cycle 同 URL mismatch 已遠超 vc=3 threshold，今日 6th cycle 仍 mismatch（routine 仍跑但 skip metric update）。

**Verification trail** (carry-over from 5/18 batch + 1):

| Cycle | Date           | Action                | Finding                                                    |
| ----- | -------------- | --------------------- | ---------------------------------------------------------- |
| 1     | 2026-05-12 dry-run | manual harvest        | URL maps to #69 TSMC content                               |
| 2     | 2026-05-13     | routine cycle         | Mismatch confirmed                                         |
| 3     | 2026-05-16     | routine cycle         | Mismatch confirmed (vc=3 reached per LESSONS #5)           |
| 4     | 2026-05-17     | routine cycle         | 4th — vc=4，5/17 batch 升級給觀察者                        |
| 5     | 2026-05-18     | routine cycle         | 5th — observer schema fix pending                           |
| **6** | **2026-05-19** | **本 cycle**          | **6th — re-escalation triggered. vc=6, LESSONS distill 候選確定** |

**Action required**（observer 持續 pending — escalation level 2）：以下兩個 hypothesis 之一是真（per 5/17 batch §71 spec）：

A. SPORE-LOG row #71 URL 寫錯：實際 X 孢子在另一 status ID，本 URL 屬 #69 → 修 SPORE-LOG row #71 URL OR 標記為 INVALID
B. #71 X 版從未發布：drone Threads (#70) 是唯一發布版本，X #71 row 是 placeholder → 標記 #71 為 NOT_POSTED / SKIP_FROM_BACKFILL

連 6 cycle 完全相同 finding（URL → #69 TSMC content / utm_campaign=s69）= 結構性錯誤確認，非偶發 cache 問題. Per ROUTINE.md §暫停 SOP 連 2 day fail = LESSONS entry / 連 3 day = 升級, 本案已遠超 — 屬「routine 自身仍跑 ok，但個別 spore SSOT 結構性錯誤」class，需 observer 在 SPORE-LOG schema 層介入修正而非 routine 暫停。

LESSONS-INBOX #5 vc=6 — distill 候選 escalation level 2: 明日若仍未修正建議生成 telegram alert（per Escalation §連 3 fail 升級條款 — 雖然 routine 整體 PASS, 但個別 spore 連 6 cycle 同 finding 已等同 routine fail signal）.

## 下次 harvest 建議時機

- **D+14 milestone** for drone pair (#70 Threads only, #71 仍 mismatch): 2026-05-24
- **D+14 milestone** for apple sidra (#72/#73): 2026-05-26 (本日 D+7 main KPI cutoff 已完成)
- **D+3 trajectory check** for Chen Chien-nien (#74/#75): 2026-05-20 (明日 — 確認 Tier 1a slope 是否維持 vs 開始 plateau)
- **D+3 trajectory check** for 前途決議文 (#76/#77): 2026-05-20 (明日 — 確認 Threads 是否 push 過 30K mid-tier 上限 / X 是否仍卡在 200 views)
- **D+7 main KPI cutoff** for Chen Chien-nien + 前途決議文: 2026-05-24

## Validation snapshot (pre-commit)

跑 `python3 scripts/tools/validate-spore-data.py` 結果見 commit log. Dashboard regen via `generate-dashboard-spores.py`.
