---
session_id: 2026-06-09-190901-twmd-rewrite-daily
date: 2026-06-09
handle: twmd-rewrite-daily
mode: routine
trigger: cron twmd-rewrite-daily 18:00 (per ROUTINE.md SSOT)
duration_min: ~120
articles_shipped: ['knowledge/Music/蘇打綠.md']
commits: ['73443b2a4']
pipeline_version: 'REWRITE v6.9 / EDITORIAL v6.9 / Research SSOT v6.5 八段 / Multi-agent orchestration v6.3'
---

# 2026-06-09 routine twmd-rewrite-daily — 蘇打綠 EVOLVE 一條龍收官

## Session 概要

routine `twmd-rewrite-daily` 18:00 cron fire → 全程跑 multi-agent orchestration v6.3 一條龍：
BECOME Full mode → PICK 蘇打綠（從 ARTICLE-INBOX P1）→ Stage 0-1 viewpoint + 4 parallel research agents fan-out 86 query → research-report-health depth tier HARD GATE PASS → spawn fresh Opus writer ~17 min 寫 12.8k CJK → Stage 3-5 plugin gates + 媒體 fetch + 修對位 + cross-link → ship main `73443b2a4`。

SPORE chain DEFER 至次日 10:00 twmd-spore-publish-daily routine（per pipeline 150 min wall-clock boundary，本 cycle 已 ~120 min）。

## Beat 1 — 診斷

- 過去 24hr：8 cron routine fire（rewrite-daily 19:47 yesterday `89b1cc6bb` 年級生世代 / maintainer-pm / data-refresh-pm / babel-nightly / data-refresh-am / spore-harvest-am / feedback-triage / maintainer-am），都正常
- ARTICLE-INBOX：79 pending / 1 in-progress；3/19 早批 audit batch 第 3 篇候選明確（INBOX L977-1041 蘇打綠 EVOLVE entry 含完整 Stage 0 pre-work：4 title 候選 / 3 核心矛盾候選 / 6 facts to verify / ~20-25K 目標）
- 既有 蘇打綠.md：2,400 CJK / 82 行 / 5 H2 / 6 footnote / 無 hero image / 完全缺 1999-2003 草創 + 韋瓦第四部曲完整時間軸 + 國際巡演

## Beat 2 — 進化

選文：蘇打綠 EVOLVE。Mode = Evolution（非 callout-triggered，純品質提升）。理由：

- INBOX entry pre-populated 完整 Stage 0
- 對應 3/19 早批 audit batch 「樂團成員↔樂團 + 歌手↔獎項屆次」高風險維度
- 既有 article 規模偏薄 + single-narrative 偏 framing（只有 林暐哲訴訟）+ SC opportunities 264 imp / 0 click cluster

## Beat 3 — 執行（multi-agent orchestration v6.3 全跑）

### Stage 0-1：研究 fan-out（4 parallel agents，aggregate 86 query）

- §A 政大草創期（agent 33 query）— 抓最大 falsification：「**1999 成軍 → 2001-04**」「政大社團 → 報名金旋獎組起來」「6 人 → 創團 4 人」「綠是高中歌詞 → 青峰最愛顏色 + 小威提蘇打」「不男不女、高的嚇人 → 別人說的 + 林暐哲改寫成『忽男忽女』；『高的嚇人』5+ 次搜尋零 hit」
- §B 韋瓦第四部曲（agent 22 query）— 抓 partial：「**四季三部曲 → 四部曲 / 4 張**」「冬未了 2014 → 2015」「太空人 2018 → 2019」「2017《十年一刻》 → 「樂計畫」+ After Summer」「馬世芳具名評論 unverified」
- §C 訴訟魚丁糸（agent 33 query）— 抓 verbatim 修正：「**我一直把他當父親** → 「**我曾經視為父親的人**」」「**我沒有一絲愧歉** → 4000 字聲明開頭「**我於理、於情都毫無虧欠**」」「2019 起訴 → 2020-02-24 北檢正式刑事起訴」「270 多首 → 自由時報 275 首是青峰累積總數，非訴狀範圍」「2023 小巨蛋 = 二十年一刻 → 實為《池堂影夜》，二十年一刻是 2024-2025 巡迴」
- §D 國際巡演+媒體（agent 22 query）— 抓最大 fabrication：「**2017 倫敦 Royal Albert Hall「亞洲樂團首組」→ 完全 fabricated 蘇打綠從未在 RAH 演出，2017 已休團，22 次搜尋零 hit**」「2007 馬來西亞首場 → 新加坡共和理工學院 2007-08-11」「2009 北京工人體育場 → 工人體育館，差 5 倍量級」+ 提供 10 official YouTube + 8 Wikimedia CC BY-SA 圖片 manifest

### Stage 1 SSOT v6.5 八段 + research-report-health HARD GATE PASS

68 distinct URLs / 5 EN / 6 primary / 86 信度標記 / 654 行 — 一次 hard fail（16 URL/0 EN/0 primary）後補完整 URL 表通過。

### Stage 2 fresh Opus writer（context isolated，~17 min）

writer 只讀 fact-pack §6 + EDITORIAL + CITATION-GUIDE，不開舊文。產出 12,704 CJK / 51 footnote / 3 iframes（後補 1 = 4）。

### Stage 3-5 主 session 收尾

- prose-health：對位句型一輪 7 → fix 4 → 6 → fix 3 → **3**（≤ MANIFESTO §11 threshold ≤3）
- cjk-punct 2 hard：《秋:故事》→《秋：故事》（保留 footnote URL 半形）
- image-health：fetch hero（Wikimedia API thumburl 2560px）+ 3 inline（the-wall-2008 / vivaldi-07 / vivaldi-09）→ sips 1600px + exiftool 清 EXIF GPS
- 第 4 iframe 補在 §4 韋瓦第（〈無與倫比的美麗〉NA4otP-v6iI 2007 第 19 屆金曲）→ 總 4 iframe + 4 image = 8 media ≥ length-scaled HARD
- correction-meta warn 修一處「不是常被誤記的馬來西亞」改成積極敘事
- 吉暝水 verbatim Ctrl-F ✗ → de-quote 改轉述（per agent verify rule）

### Stage 5 cross-link

- forward 5 條（張懸與安溥 / 台灣獨立音樂 / 台灣音樂祭文化 / 五月天 / 流行音樂與金曲獎）
- reverse 補 1 條（台灣獨立音樂 PASS sibling 格式預檢，既有已 mention 蘇打綠）
- 其他 4 篇 siblings sibling 格式預檢 warn level / 缺延伸閱讀 section → **DEFER** per Step 5.3 規則

### Ship

`73443b2a4` main-direct push，pre-commit hook narrative-scope warning（content-ssot + public + other 跨 domain）正常 for full EVOLVE cycle。

## Beat 4 — 收官

- ARTICLE-INBOX L977-1041 蘇打綠 entry 整段刪除（per 完成歸檔鐵律「直接刪不留 pointer」）
- 3/19 早批 audit batch 進度註記更新（補蘇打綠 worked example summary）
- ARTICLE-DONE-LOG 頂端 append 完整 entry
- 本 memory append

## Beat 5 — 反芻（候選 → diary 寫 / LESSONS）

### LESSONS-INBOX 候選 1：INBOX 預備 hypothesis 也會幻覺，falsification-first 不分階段

**模式**：ARTICLE-INBOX entry 寫得越完整（Stage 0 pre-work 4 title 候選 / 3 核心矛盾候選 / 6 facts to verify），越容易讓主 session 以為「Stage 0 已經做完了」直接跳 Stage 1 純驗證。

但 INBOX 預備 hypothesis 本身是過去某個 session 用搜尋寫的，那個 session 可能就帶幻覺。本次 9 條 hypothesis 中 7 條被 falsified（含 INBOX 寫的「1999 成軍」「政大社團」「6 人創團」「Royal Albert Hall 亞洲首組」「四季三部曲」「2017 十年一刻巡演」「馬來西亞首場」），等於 78% 命中率。

**規則 candidate**：Stage 1 fan-out agent prompt 強制標 falsification-first，即使 hypothesis 來自 INBOX pre-work 也要 try to break，不要 try to confirm。本次 §A §B §C §D 4 個 agent prompt 都明確寫「你的工作不是 confirm 我給的 hypothesis，是 break it」，這條 prompt 設計直接救了文章的事實精度。

### LESSONS-INBOX 候選 2：Royal Albert Hall 級 fabrication 必須 binary check

「2017 倫敦 Royal Albert Hall 亞洲樂團首組」這個 hypothesis 如果上稿會是 Lee Yang spore #29「清晨四點搭捷運」級別的 verifiable wrong fact（讀者一查 venue 官方歷史就破）。§D agent 用 22 次搜尋 + venue 官網 cross-check + 維基完整演唱會列表三源確認蘇打綠**從未**在 RAH 演出過，2017 已休團。

**模式**：「某地某年某成就」級別的 superlative claim（亞洲首組 / 首支 / 第一個 / 唯一）需要明確 binary 一手 source。沒有的話就降級為「在這場規模 X 的演出中演出」這種非 superlative 敘事。

### LESSONS-INBOX 候選 3：對位句型「不是 X，是 Y」自然就會出來，要寫完後系統性 strip

fresh Opus writer 寫完一輪是 7 處對位（含 strict ban prompt），第二次 review 還是 6 處，第三次降到 3。對位句型是中文寫作的自然語感（並非 AI 特有，台灣報導者也用），但 MANIFESTO §11 ≤ 3 threshold 是 AI 水印的天花板。寫作時不可能完全避免，**只能寫完後系統性 strip**。

**規則 candidate**：spawn writer prompt 明確說「對位句型 ≤ 3 但允許 7-10 處，後續主 session 會幫你 strip 到 3」可能比要求 zero 更有 productivity（writer 不會卡死在每個句子）。

### LESSONS-INBOX 候選 4：媒體 length-scaled HARD gate 在 routine context 容易吃 surprise budget

本次 image-health HARD 跳「圖 1 + 影片 3 = 4 < 8 下限」，需要補 3 張 inline 圖 + 1 個 iframe 才能過。Wikimedia API thumburl 抓圖 + sips 處理 + exiftool 清 EXIF + 插入 markdown 共 ~15 min。

**模式**：routine context 的 writer agent 容易低估媒體完整度成本。pipeline §v6.8 length-scaled image-health（`max(3, round(prose-CJK/1200))`）對 long-form 是好事但對 routine budget 是 surprise charge。

**規則 candidate**：spawn writer prompt 在 Music/People 條目強制明列具體 4-5 個 inline 圖 placeholder（不只 hero + 3 iframe），主 session 同步啟動 image fetch parallel 工作流不要等 writer 寫完才開始。

## Handoff 三態

繼承（routine fleet chronic，非本 session scope，續由 cron 追）：

- ⏳ immune drift（drift_velocity 90 / plugin_health 56.5）/ broken-link 4.41% / vc=5 maintainer escalation 等哲宇 A/B/C 拍板

本 session 新 handoff：

- [x] ~~蘇打綠 EVOLVE ship + 雙向 cross-link 台灣獨立音樂 + 多語待 babel routine 接~~
- [ ] SPORE chain DEFER 至次日 10:00 twmd-spore-publish-daily routine — 蘇打綠 EVOLVE 是高品質候選（剛 ship 12.8K + 8 media + 完整訴訟弧線 + 「我們是『蘇打綠』！」場景），下次 routine 應該 PICK 第一順位
- [ ] LESSONS-INBOX 候選 4 條待 distill（INBOX 預備 hypothesis 幻覺 / RAH 級 fabrication binary check / 對位句型寫後 strip / 媒體 length-scaled routine surprise）
- [ ] 下批 3/19 早批 audit batch 候選：羅大佑 / 伍佰 / 張惠妹 / 林俊傑 / 蕭青陽 / 五月天（樂團成員↔樂團 高風險）— 下次 routine PICK 優先

## 工具產出檢核

- [x] research-report-health depth tier hard=0 PASS（68 URL / 5 EN / 6 primary / 86 信度）
- [x] rewrite-stage-3-5 hard=0 PASS（footnote-format + footnote-density + correction-meta）
- [x] rewrite-stage-4 hard=0 PASS（9 plugin）
- [x] 對位句型 = 3（≤ 3）
- [x] 破折號 71 / 12.8k CJK = 8.3/1500（≤ 15）
- [x] 主 session spot-check：8+ verbatim 引語對 fact-pack §4 全 ✓ Ctrl-F 通過；唯一 ✗ 吉暝水 quote 已 de-quote 改轉述
- [x] Timestamp 精確（git %ai）：commit 73443b2a4 at 2026-06-09 ~20:30
- [x] Handoff 三態已審視
- [x] 自我檢查工具 PASS：rewrite-stage-4 / rewrite-stage-3-5 / research-report-health

🧬

---

_v1.0 | 2026-06-09 routine twmd-rewrite-daily — 蘇打綠 EVOLVE 一條龍ship_
_session 2026-06-09-190901-twmd-rewrite-daily — multi-agent orchestration v6.3 全跑_
_誕生原因：routine 18:00 cron fire，從 ARTICLE-INBOX 抽 P1 蘇打綠 EVOLVE 完整跑完 article cycle_
_核心洞察：(1) INBOX 預備 hypothesis 自帶幻覺 78% 命中 falsified，falsification-first prompt 不分階段 (2) 「Royal Albert Hall 亞洲首組」級 fabrication 必須 binary check (3) 對位句型 ≤3 是寫後 strip 不是寫時避免 (4) 媒體 length-scaled HARD 在 routine 是 surprise charge_
_LESSONS 候選：INBOX hypothesis falsification / RAH fabrication binary / 對位 strip / 媒體 length-scaled surprise_
