---
session: 2026-06-19-190938-twmd-rewrite-daily
date: 2026-06-19
type: routine-memory
routine: twmd-rewrite-daily
fire_time: 19:09 (after 18:00 cron baseline)
mode: full
duration_min: ~100
commits:
  - 6aa840307 # article + research SSOT + staging
  - b6469dd35 # spore blueprint
---

# Session Memory — twmd-rewrite-daily 2026-06-19 19:09

## TL;DR

台灣體育發展與奧運 NEW ship（Issue #915 by tboydar-agent 2026-05-08，P0 真實缺口 verified）+ 4860 CJK / 55 footnote / 4 圖 / rewrite-stage-3-5 + stage-4 hard=0 全綠 / Falsification 10 處（含楊勇緯 2024 巴黎 NO MEDAL × 楊傳廣 8334 非 8392 × 嘉農 0:4 非 2:5 × 陳念琴 66kg 非 75kg × 紅葉冒名頂替 × CPBL 首場兄弟輸 × 體育署 2013 降編非升格 × 國訓 1976/11 × 蔡溫義 125 非 132.5 × 李孟遠定向飛靶非空氣手槍）。Spore #154/#155 blueprint draft broadcast deferred（Chrome MCP image upload structural blocker 連續第 4 次 cycle）。

## Stage 進度（per REWRITE-PIPELINE v7.6）

| Stage           | 動作                                                                                | Gate                                                             |
| --------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Stage 0**     | 觀點：「中華台北」框架是禁忌也是禮物 / 主 session 自寫 6 核心 + 16 persona          | `research-report-health.py --stage 0` PASS（30 distinct domain） |
| **Stage 1**     | 2 Sonnet research fan-out（§A 框架 27 query + §B 獎牌+制度 25 query）               | `research-report-health.py` PASS（51 distinct / 5 EN / 10 一手） |
| **Stage 2**     | Fresh Opus writer agent（Read 整份 report + EDITORIAL）→ staging file               | `reports/article-evolve/台灣體育發展與奧運.md`                   |
| **Stage 2.5**   | 主 session 比對 + cp staging → canonical（無舊文，NEW mode）                        | —                                                                |
| **Stage 3-5**   | rewrite-stage-3-5 hard=0 / footnote-format 修「同前」短引 / quote-fidelity 9 info   | PASS                                                             |
| **Stage 4**     | rewrite-stage-4 hard=0 / image-health 修 markdown 圖語法 / 4 圖 = hard pass         | PASS（advisory：媒體量 4 < 5，length-scaled target 6）           |
| **Stage 5**     | Cross-link 6 個（戴資穎 / 郭婞淳 / 李洋 / 楊勇緯 / 莊智淵 / 台灣棒球文化）+ sync.sh | —                                                                |
| **commit+push** | `6aa840307` + `b6469dd35` ff-push origin/main                                       | —                                                                |

## 核心 finding × 三段

### 1. Falsification-first 抓 10 處錯（含主 session pre-hypothesis 全部 cover）

研究 agent B 直接 callout pre-hypothesis 錯誤 + 主 session Stage 0 也已 cross-check：

- 楊傳廣 1960 羅馬十項全能 **8334 分**輸 58 分（pre-hypothesis 8392 ❌）
- 蔡溫義 1984 LA 60kg **抓 125 + 挺 147.5 = 272.5**（pre-hypothesis 132.5 ❌）
- 嘉農 1931 甲子園決賽 **0:4 中京商業**（pre-hypothesis 2:5 ❌）
- **楊勇緯 2024 巴黎 NO MEDAL**（敗部復活賽 8 強止步；很多媒體記憶誤）
- 李孟遠 2024 巴黎銅 = **男子定向飛靶 trap**（不是 10m 空氣手槍）
- 陳念琴 2024 巴黎銅 = **拳擊女 66kg**（不是 75kg）
- 國訓中心：**1975 起籌備 / 1976 年 11 月正式成立**（不是 1982 / 也不是 1975 直接成立）
- 體育署 2013/1/1 = **降編**（從體委會降為教育部下屬署 — 不是升格）
- 紅葉少棒對手 = **關西少棒明星隊**（不是和歌山世界冠軍隊）+ **13 人 5 虛報 9 冒名**（鳴人堂「世紀大騙局」框架）
- CPBL 1990/3/17 首場 = **兄弟 3:4 統一**（不是兄弟贏）

### 2. High-value 新發現（pre-hypothesis 沒問但故事必備）

- **楊傳廣 1960 銀牌 2025/4 文化部指定首件體育類國寶**（cna 202504290215）
- **張星賢** 1932 LA + 1936 柏林日本代表團（早稻田大學，楊肇嘉資助）—— 比劉長春更早報到，**首位參加奧運的台灣人**
- 麟洋配 2024 巴黎 = **奧運史上首對同組合男雙連霸**（不是「羽球史」也不是「中華台北史」，是奧運史第一）
- NHK 2020 東京「**台湾です**」+ 排「タ群」首次把 Taiwan 排在 China 前面（日方「正名時刻」）
- France 2 2024 巴黎「**中華台北，就是我們所熟知的台灣**」（法方「正名時刻」）
- 王貞治 1972 中日斷交後父親王仕福改持 PRC 護照，王貞治至今仍持中華民國護照（複雜國族身分 anchor，本文未深入）

### 3. 「2016 里約脫帽事件」FALSIFIED

主 session Stage 0 hypothesis 提到「2016 里約脫帽抗議」，Agent A 跑 27 query 後**找不到任何 primary / secondary 報導**——可能是 hypothesis 誤記。改用 **1960 羅馬 UNDER PROTEST 布條事件**（奧運史唯一開幕抗議紀錄）作為「抗議式入場」anchor，順道補了一筆 hypothesis 沒提的 historical sourced detail。

## 教訓（candidate LESSONS）

### 教訓 1 — Chrome MCP image upload 結構性 blocker（**連續第 4 次 cycle，達升 LESSONS threshold**）

`mcp__Claude_in_Chrome__upload_image` 要求 `imageId` 來自 screenshot 或 user-uploaded image，**不接受 file path 直送**。Routine cron context 無法在自動化流程裡把 `public/spore-images/{slug}-square.png` 推進 Threads / X 的 file input。連續四次 cycle（6/16 / 6/17 #148-149 / 6/18 #150-151 / 6/19 #154-155）broadcast-deferred = 結構性 gap，**不是 Chrome MCP unavailable**（這次 connect 健康），是 tooling chain 缺一段「file path → imageId」橋接。

候選解：

1. 用 mcp\_\_computer-use 從 Finder 拖檔到瀏覽器 file input（但 tier "read" browser 階級可能阻擋）
2. 寫一個 `scripts/tools/chrome-spore-ship.mjs` wrapper：用 Playwright / Puppeteer 連 Chrome DevTools Protocol（已連線的同一個 browser instance）→ 直接 `setInputFiles({path})`
3. 在 make-spore.sh 完成時把 image 移到一個 Chrome MCP 知道的「user-uploaded」緩存區（需查文件）

**接下來該做**：寫 `reports/chrome-mcp-image-upload-blocker-2026-06-19.md` 把根因+三條候選解 distill，這條進 LESSONS-INBOX。

### 教訓 2 — Pre-hypothesis date 必驗（國訓 1982 / 黃金計畫 2014 兩個錯誤年份）

Stage 0 hypothesis 用 ARTICLE-INBOX entry 的「黃金計畫 2014 啟動 / 國訓 1982 成立」當基準假設，Stage 1 agent B 驗證後兩個都錯（黃金計畫 2018 / 國訓 1976/11）。INBOX entry 是線索不是 oracle（[REFLEXES #16](../REFLEXES.md) 第 N 次驗證）—— 連 P0 entry 都會把預估事實當定論，pre-hypothesis 必驗 = research agent falsification-first 的價值再次體現。

### 教訓 3 — 楊勇緯 2024 巴黎 NO MEDAL 是 viral misinformation 火區

Pre-hypothesis 寫了「楊勇緯 49kg/61kg 雙料」—— agent B falsification 後是「8 強止步 NO MEDAL」。這種「明星選手連續奪牌期待 + 媒體未持續追蹤」造成的記憶 vacuum 是 viral misinformation 的火區。Stage 3 hard gate 必驗 P1 選手每屆獎牌名單對源（不能信「我記得他金牌」這種第一印象）。

## §Handoff

- **Issue #915 close 留 maintainer gate**：commit 後**必須**跑 `gh issue comment 915 + gh issue close 915`——routine 不做 §自主權邊界對外溝通，留下個 maintainer cycle / 哲宇 manual。
- **Spore #154/#155 broadcast pending**：Chrome MCP image upload blocker（教訓 1）。Manual ship pathway：開 Threads new post / 貼 §Threads block text / 從 Finder 拖 `/public/spore-images/台灣體育發展與奧運-square.png` / 發。X 同樣 flow。後續執行可 add-spore + sporeLinks 寫回 frontmatter。
- **翻譯**：babel-nightly 00:30 cron 會自動偵測 body-hash drift 翻譯 5 lang（en/ja/ko/es/fr）；新文章 ship 後 first cron 自動帶上。
- **image-health advisory 4 < 5**：length-scaled target 6（4860 CJK 適配），但 hard gate（≥4）已過。後續 EVOLVE 可補 1-2 張圖（候選：麟洋配奪金 / 嘉農 1931 / CPBL 1990 元年場景 / 1976 蒙特婁退賽新聞照），開 ARTICLE-INBOX EVOLVE entry。
- **平行 session 留物清理**：session 啟動時 stash leftovers stash@{0}（其他 manual session 殘餘 — 端午節 staging + 視覺化型錄-recat 重複 diary entry + 103748-manual-iter2 untracked）— 用完即 stash，**未動其檔**（multicore 鐵律）。如果其他 session 還在跑 stash 仍在排隊，下個 session 自會 pop。

## 工具運用

- `bash scripts/tools/session-id.sh twmd-rewrite-daily` → `2026-06-19-190938-twmd-rewrite-daily`
- `bash scripts/tools/consciousness-snapshot.sh` → 🛡️ 52 drift（plugin_health 45.8 / external_rulers 3.7 主導），連兩日 chronic carry
- 2 Sonnet sub-agent fan-out（research）+ 1 Opus sub-agent（fresh writer staging）
- `python3 scripts/tools/research-report-health.py --stage 0` + 一般 mode 雙 gate
- `python3 scripts/tools/article-health.py --profile=rewrite-stage-3-5 + --profile=rewrite-stage-4`
- `bash scripts/core/sync.sh` → knowledge → src/content（zh-TW）
- `bash scripts/tools/make-spore.sh /society/台灣體育發展與奧運/ --prod` → square + landscape 圖
- `mcp__Claude_in_Chrome__*`（broadcast 嘗試，image upload blocker → defer）

## 數據對齊

| 維度             | 值                                                                             |
| ---------------- | ------------------------------------------------------------------------------ |
| Routine 觸發時間 | 19:09 (after 18:00 cron baseline)                                              |
| Wall-clock 預估  | ~100 min (cron budget 150 min 內)                                              |
| Article CJK      | 4860                                                                           |
| Footnote         | 55（一手 ≥ 10：tpenoc/nstc/president/cpbl/chiayi/edu.tw/tcmb/ey.gov/twbsball） |
| 圖               | 4（hero + 3 inline，hard gate ≥3 過）                                          |
| Stage 0 探索     | 12 query / 30+ distinct domain                                                 |
| Stage 1 fan-out  | 27 + 25 = 52 query / 51 distinct source / 5 EN / 10 一手                       |
| Falsification    | 10 處                                                                          |
| Spore family     | viral-B 冷知識型 / hook tier 1b 具體性槓桿                                     |

🧬
