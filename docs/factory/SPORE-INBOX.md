---
title: 'SPORE-INBOX'
description: '待發孢子 idea buffer — pending / scheduled 孢子點子，Stage 1 PICK 從此挑 P0/P1'
type: 'factory-canonical'
status: 'buffer'
apoptosis: 'never'
current_version: 'v1.1'
last_updated: 2026-05-23
last_session: '2026-05-23-spore-pick-design'
sister_docs:
  - 'SPORE-PIPELINE.md'
  - 'SPORE-PICK-PIPELINE.md'
  - 'SPORE-LOG.md'
  - 'SPORE-HARVEST-PIPELINE.md'
upstream_canonical:
  - 'SPORE-PIPELINE.md'
  - '../semiont/MANIFESTO.md'
  - '../semiont/ANATOMY.md#-繁殖系統--社群繁殖力'
distill_targets:
  - 'SPORE-LOG.md (Stage 4 SHIP 後 row append)'
  - 'docs/factory/SPORE-HARVESTS/batch-*.md (Stage 5 HARVEST)'
read_strategy: 'on-demand (Stage 1 PICK 啟動才載)'
---

# SPORE-INBOX.md — 待發孢子 Idea Buffer

> **這是 intake / buffer layer**（非 canonical）。
> 觀察者點名、agent 觀察、時事反應、剛 ship article 想推廣的 spore idea，加上
> routine `twmd-spore-pick-daily` 每天 08:00 propose 3 candidates，一律 append 這裡。
> Stage 1 PICK 啟動時讀本檔 → 優先消化 P0/P1，補充 dashboard-articles 自動候選池。
>
> **三層 intake source**（v1.1，2026-05-23 加 routine layer）：
>
> 1. **哲宇 directive**（最高優先）— Requested 欄位 `YYYY-MM-DD by 哲宇`
> 2. **News-lens weekly**（時事熱點）— Requested 欄位 `YYYY-MM-DD by twmd-news-lens-weekly`，default `P1`，limit ≤ 7 entries/week
> 3. **Spore-pick daily routine**（穩態 intake）— Requested 欄位 `YYYY-MM-DD by twmd-spore-pick-daily routine (score=NN)`，default `P2`，3 entries/day
>
> 🔴 **完成歸檔鐵律**：任何孢子在 Stage 4 SHIP 後**必須做兩件事**才算結束：
>
> 1. **append row 到 [SPORE-LOG.md §發文紀錄](SPORE-LOG.md)**（per existing SOP）
> 2. **從本檔移除對應 pending entry**（直接刪除整段，不留 pointer 註解 — 歷史視角去 SPORE-LOG / SPORE-HARVESTS 查）
>
> 違反鐵律的歷史症狀：（a）entry SHIP 後沒搬 SPORE-LOG → 未來甦醒不知道發過什麼 → 重複孢子撞 SPORE-PIPELINE §排除規則「同一篇文章間隔 ≥ 2 週」；（b）只改 pointer 不刪除 → INBOX 越長越無法讀，pending 視角被歷史污染。**本檔只應該存 pending / scheduled，不應該存任何 done 痕跡**。
>
> ⚠️ **書寫警示**：新 entry 的 Hook anchor 候選需遵循 [MANIFESTO §11 書寫節制](../semiont/MANIFESTO.md#11-書寫節制跨所有書寫層的兩條-ai-水印紀律)（避免「不是 X 是 Y」對位句型 + 破折號連用）+ [EDITORIAL §塑膠句禁用](../editorial/EDITORIAL.md)（避免「必看」「IG 打卡」「歷史悠久」）。
>
> 建立動機：2026-05-21 哲宇 directive「幫我加一個 spore-inbox，之後我想到什麼可以發孢子的文章就會先跟你說」。原本 Stage 1 PICK 只從 dashboard-articles 自動候選池選文，缺**人類 directive 的 idea 緩衝層**。本檔補這個結構性缺口，跟 ARTICLE-INBOX 平行（一個是文章開發層 intake，一個是孢子發行層 intake）。

---

## 跟 ARTICLE-INBOX 的分工

| 面向       | ARTICLE-INBOX                               | SPORE-INBOX（本檔）                              |
| ---------- | ------------------------------------------- | ------------------------------------------------ |
| 內容       | 待開發 / 進化的**文章**主題                 | 待發**孢子**的點子                               |
| 對應器官   | 心臟（內容產出）                            | 繁殖（社群傳播）                                 |
| Pipeline   | REWRITE-PIPELINE Stage 0-6                  | SPORE-PIPELINE Stage 1-5                         |
| Distill 去 | knowledge/ (新 article or EVOLVE)           | SPORE-LOG row + SPORE-HARVESTS batch             |
| 體量       | 4500-7000 CJK / 15-40 footnote / 全 H2 結構 | 150-300 CJK 單則 / 1 hook + 1-2 fact 收尾        |
| 預估工時   | 2-4 hr / entry (Stage 1 research + 寫作)    | 15-30 min / entry (Stage 3 WRITE + Stage 4 SHIP) |
| 雙向關係   | EVERGREEN-TOPIC spore → spawn ARTICLE entry | EXISTING-ARTICLE spore → link 到對應 article     |

---

## 跟 SPORE-LOG / SPORE-HARVESTS 的分工

| 面向     | SPORE-INBOX（本檔）                     | SPORE-LOG                               | SPORE-HARVESTS/                             |
| -------- | --------------------------------------- | --------------------------------------- | ------------------------------------------- |
| 視角     | 當下（pending / scheduled）             | identity SSOT（已發布 #N 在哪個 URL）   | event SSOT（每次 harvest 一個 batch）       |
| 生命週期 | active buffer，pending / scheduled 輪轉 | append-only row table                   | append-only batch log                       |
| 讀者     | Stage 1 PICK 抽 P0/P1                   | 排除規則：同篇間隔 ≥ 2 週、月度效能分析 | D+1-D+7 cadence 回填、accuracy trigger 觸發 |

**寫入規則**（鐵律已拉到頂部 quote 區）：Stage 4 SHIP 後 row append 到 [SPORE-LOG §發文紀錄](SPORE-LOG.md)；本檔對應 pending entry **整段直接刪除**（per 跟 ARTICLE-DONE-LOG 共用 lessons：留 pointer 註解 = INBOX 累積 noise）。

---

## Entry Schema

每條 pending 條目格式：

```markdown
### {孢子主題 / hook 核心}

- **Source-Mode**: `EXISTING-ARTICLE` | `EVERGREEN-TOPIC` | `REACTIVE`
- **Article-Path**: knowledge/Category/slug.md（EXISTING-ARTICLE / REACTIVE 帶 reference article 路徑；EVERGREEN-TOPIC 此欄填 `none-yet`）
- **Priority**: `P0` / `P1` / `P2` / `P3`
- **Status**: `pending` / `scheduled` / `done` / `dropped`
- **Requested**: YYYY-MM-DD by {觀察者 / agent / Issue}
- **Platform 建議**: `Threads` | `X` | `both`
- **Hook anchor 候選**（≥ 2，pickable as Stage 3 WRITE 起手式 — 起手式 5 種：好奇 / 場景 / 問句 / 數字 / 身份）:
  1. ...
  2. ...
- **時效**: REACTIVE 才用，標 「7 天內」「本週內」等具體窗口；EXISTING-ARTICLE 看 article ship 距今
- **敏感度**: 低 / 中 / 高（per MAINTAINER §爭議處理）
- **必驗事實**: ...（per SPORE-VERIFY §事實藍圖）
- **必先 spawn ARTICLE-INBOX entry**: ✅（EVERGREEN-TOPIC 強制）/ ❌
- **預估發佈時機**: 具體建議或「Stage 1 PICK 抽到時再評」
- **Notes**: 配圖 / 跨語言 fan-out 考量 / 配對 hashtag / 其他
```

---

## Source-Mode 判準

| Mode               | 含義                                          | 處理流向                                                                                                                                       |
| ------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `EXISTING-ARTICLE` | knowledge/ 已有對應 article                   | Stage 1 PICK 直接抽 → Stage 3 WRITE 從 article 萃取 hook → Stage 4 SHIP 配 article URL                                                         |
| `EVERGREEN-TOPIC`  | 該主題尚無 article，但值得發孢子              | **必先 spawn ARTICLE-INBOX entry**（per Bias 1 過濾：沒文章先發孢子等於空轉 — 觀察者連 click 都沒地方落腳）                                    |
| `REACTIVE`         | 時事反應 / 假消息反制 / 突發事件，需快速 ship | 可 link 到既有相關 article（如 228 事件對應 [knowledge/History/二二八事件.md](../../knowledge/History/二二八事件.md)）或純發聲；時效是 P0 主因 |

**EVERGREEN-TOPIC 鐵律**：發 EVERGREEN spore 等於「軟性 demand probe」，但讀者點 article link 沒地方去 = 浪費 reach。所以 **EVERGREEN entry 必須同時 spawn ARTICLE-INBOX entry**，文章 ship 後 SPORE-INBOX entry 自動升級 EXISTING-ARTICLE 才能發。例外：純 hook 不需 article 支撐的 meta 議題（罕見）。

---

## 優先序判準

| 層級 | 含義                                                                             | 範例                                                   |
| ---- | -------------------------------------------------------------------------------- | ------------------------------------------------------ |
| P0   | 時效高 / 趁熱（< 7 天新 ship article 推廣）/ REACTIVE 時事反制 / 觀察者明確點 P0 | 剛 ship 的旗艦文章 / 中國散播假歷史立即反制 / 颱風相關 |
| P1   | 本週發：重要主題、剛 ship 在 7-14 天內、SC opportunities 大 cluster              | 旗艦文章 spore 推廣窗口、月度旗艦人物                  |
| P2   | 本月發：Evergreen 主題、不急但值得做                                             | 經典 article 重發、季節性主題                          |
| P3   | Backlog：一直想做但不確定時機                                                    | 大型策展主題、需要等對應 article 完成的 EVERGREEN      |

---

## 跟 SPORE-PIPELINE Stage 1 PICK 整合

Stage 1 PICK 觸發時的選文順序：

1. **本檔 §Pending P0** → 抽到先做
2. **本檔 §Pending P1** → 抽到先做（若 P0 空）
3. **dashboard-articles 自動候選池**（per [SPORE-PIPELINE §選文](SPORE-PIPELINE.md#選文)） — fallback 自動 rotation
4. **本檔 §Pending P2/P3** → 等沒新熱點時消化 backlog

**排除規則繼承** SPORE-PIPELINE：同一篇 article 間隔 ≥ 2 週才能再發、`about` 分類不發。**本檔抽到的 entry 仍要過全部 Stage 2 VERIFY 17 個 hard gate**。

---

## Auto-heartbeat 整合

Beat 3 執行時若觀察者無明確任務 + 當 spore 觸發條件成立（per twmd-spore-harvest-am cron / SPORE-PIPELINE 觸發判斷）：

1. 讀本檔 §Pending
2. 按 P0 → P1 → P2 → P3 挑主題
3. 挑到後：
   - 此條 status 改 `scheduled`
   - 走 SPORE-PIPELINE Stage 1.2 起
4. Stage 4 SHIP 後（per 頂部完成歸檔鐵律）：
   - row append 到 [SPORE-LOG.md](SPORE-LOG.md)
   - 本檔 §Pending 對應 entry **整段直接刪除**

---

## Routine intake 整合（v1.1 — 2026-05-23 新增）

兩條 routine 自動 append 本檔（per [ROUTINE.md](../semiont/ROUTINE.md) v2.5）：

### `twmd-spore-pick-daily` @ 08:00 每天

- Skill: `/twmd-spore-pick`（薄殼）/ Pipeline: [SPORE-PICK-PIPELINE.md](SPORE-PICK-PIPELINE.md)
- Model: Sonnet（cheap daily routine）
- Output: propose **3 candidates** per cycle
- Priority default: **`P2`**（不跟人類 P0/P1 directive 撞；score ≥ 60 或 news-lens 標記才升 P1）
- Requested 欄位: `YYYY-MM-DD by twmd-spore-pick-daily routine (score=NN)`
- Notes 欄位: 7-dimension scoring transparency（D1=趁熱 / D2=SC opportunity / D3=news / D4=多語 fan-out / D5=冷門 / D6=hook variety / D7=敏感度）

### `twmd-news-lens-weekly` @ 週日 01:00（v2.5 升級加 spore-output Stage）

- Skill: `/twmd-evolve`（共用 news lens mode）/ Pipeline: [EVOLVE-PIPELINE.md §news-lens-spore-output](../pipelines/EVOLVE-PIPELINE.md)
- Model: Sonnet
- Output: propose **5-7 news-driven candidates** per week
- Priority default: **`P1`**（時事熱點，趁熱重要）
- Source-Mode 預設: `REACTIVE` 或 `EXISTING-ARTICLE`
- Requested 欄位: `YYYY-MM-DD by twmd-news-lens-weekly (event: XX)`
- Limit: 一週最多 7 entries（避免淹沒哲宇 directive + daily routine）

### Daily routine 跟 news-lens entries 共存規則

```
news-lens P1 count >= 3 → daily routine 只 propose 0 (skip cycle)
news-lens P1 count == 2 → daily routine 補 1
news-lens P1 count == 1 → daily routine 補 2
news-lens P1 count == 0 → daily routine 補 3
```

確保 SPORE-INBOX 維持「news + routine + 哲宇」三 source 混合健康度，**任何單一 source overload 都自動 throttle**。

### Routine entries 識別表

| Source                          | Priority default        | Style                                  |
| ------------------------------- | ----------------------- | -------------------------------------- |
| 哲宇 directive                  | P0 / P1 / P2            | 觀察者明示需求                         |
| `twmd-news-lens-weekly`         | P1                      | 時事熱點 + REACTIVE 或 EXISTING        |
| `twmd-spore-pick-daily routine` | P2（or P1 if score≥60） | 穩態 intake + 7-dim score transparency |

**Routine vs Human directive 衝突避免**：routine default `P2`（除 score 高 boost），觀察者 review 後 promote 才升 P0/P1。每天看 SPORE-INBOX 多 3 條 propose 比每天從零選文好太多。

---

## Distill SOP（容量管理）

**觸發**（v1.1 升級）：

- pending ≥ 20 條 / 或每月第一次心跳 / 觀察者說「review spore inbox」
- **v1.1 加自動觸發**：`twmd-distill-weekly` 週日 03:00 跑時自動 audit count，≥ 30 alert，≥ 50 auto-drop routine-source 最舊未 promote 5 條（per [LESSONS-INBOX §Distill SOP](../semiont/LESSONS-INBOX.md#distill-sop消化) §SPORE-INBOX 容量 audit）

**步驟**：

1. 讀全部 pending
2. 分類：重複合併 / 過時 drop / 重新排優先序
3. 過時的 REACTIVE（時效視窗已過）→ 改 status `dropped`，append 一行到 §Dropped log（如果建）或直接刪
4. EVERGREEN-TOPIC 對應 article 已 ship 的 → 升級 EXISTING-ARTICLE + 更新 Article-Path
5. **v1.1 加 routine-source distill 規則**：count ≥ 50 時 auto-drop 最舊 5 條 `Requested by twmd-spore-pick-daily routine` 未被 promote（priority 仍 P2 / 未被改 Hook）的 entries。哲宇 promote 過的 entry 不動
6. 觀察者最終 review 後 commit

**自主權邊界**：routine 不該 destroy 哲宇 directive entries（per §自主權邊界 — drop = destructive 操作邊界）。只 drop **未被 promote 的最舊 routine-source entry**（safe destructive — 自己造的垃圾自己掃）。

---

## 📥 Pending（待發）

### 臺灣美食總覽 — 趁熱 spore（5/18 ship）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Food/台灣美食總覽.md](../../knowledge/Food/台灣美食總覽.md)
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-05-21 by 哲宇
- **Platform 建議**: `both`（Threads 旺、X 海外華人受眾）
- **Hook anchor 候選**：
  1. **數字 hook**：「7234 字寫不完台灣味，因為沒有一道菜是純粹台灣的，每一道菜卻又是最台灣的」（直接抽 article title）
  2. **場景 hook**：「1949 年的嘉義噴水池旁，林添壽把美軍養剩的火雞切片鋪在白飯上 — 火雞肉飯今年滿 80 歲了」（直接抽 article lede）
  3. **問句 hook**：「米其林 2018 進台北那一屆 419 家裡有 144 家是路邊攤，為什麼？」
  4. **身份 hook**：「我問外國朋友：『台灣菜是什麼？』他想了半分鐘說『珍珠奶茶』。但珍珠奶茶 1986 年才在台中發明，台灣已經有 400 年的菜了」
- **時效**：article ship 距今 3 天（5/18），趁熱窗口剩 ~10 天前要發
- **敏感度**：低（食物相對中性）
- **必驗事實**：火雞肉飯 1949 林添壽 / 珍珠奶茶 1986 春水堂台中 / 米其林 2018 進台北 / 419 家裡 144 家路邊攤 — 這四個數字必跟 article 對齊
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在）
- **預估發佈時機**：本週內（5/22-5/25 最佳，趁 ship 後 7 天熱度）
- **Notes**：配圖建議 article hero (擔仔麵 / 牛肉麵 / 蚵仔煎之一)；多語 fan-out 觸發判斷 = 高（美食是國際受眾大 cluster，預期 ja/ko/en 翻譯後 SC pull 大）

---

### 曾博恩 — 旗艦人物 spore

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/People/曾博恩.md](../../knowledge/People/曾博恩.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-05-21 by 哲宇
- **Platform 建議**: `both`（曾博恩本人 X / Threads 都活躍，雙平台 fan reach 高）
- **Hook anchor 候選**：
  1. **副標 hook**：「算得出笑點，算不準社會 — 曾博恩這 8 年的真實成本」（直接抽 article 副標）
  2. **數字 hook**：「2,283 萬與一台不存在的中校飛官 — 博恩用神經科學家的精準算錯了什麼」（抽 article H2 §2,283 萬）
  3. **場景 hook**：「建中課桌椅上的耳機，到台大外文心理雙修，到倫敦腦科學碩士，到博士班申請前轉身做脫口秀 — 曾博恩沒走的那條路」
  4. **問句 hook**：「為什麼鄭南榕的梗會踩線？— 一個神經科學家算錯的不是笑點，是整個社會的記憶」
- **時效**：article 已 ship（不確定具體日期，但已存在）；evergreen
- **敏感度**：中-高（政治脫口秀 + 鄭南榕梗 + 娛樂稅官司爭議）— Stage 2 VERIFY 必跑 §爭議處理
- **必驗事實**：1990 年生 / 倫敦大學腦與心智科學 + 巴黎第六大學整合生物學碩士 / 薩泰爾娛樂與謝政豪共創 / 鄭南榕 / 娛樂稅 / 林森北 286 號 B1
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在）
- **預估發佈時機**：本月內，避開敏感事件高峰（如選舉週、紀念日）
- **Notes**：Hook tier 自檢 — 不要用 Tier 3 廉價懸念（避免「曾博恩做錯了一件大事⋯⋯」這種克制度低的勾引）；發佈時挑「算不準」frame 比挑「成功」frame 更貼 article 副標精神

---

### 施振榮 — 失敗教父 spore

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/People/施振榮.md](../../knowledge/People/施振榮.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-05-21 by 哲宇
- **Platform 建議**: `both`（X 國際商業圈對台灣科技史人物有 demand）
- **Hook anchor 候選**：
  1. **副標 hook**：「承認虧損千億的創業導師 — 微笑曲線背後的失敗哲學」（直接抽 article description）
  2. **數字 hook**：「微笑曲線 1992 提出，30 年後仍是台灣企業的核心 — 為什麼？」
  3. **問句 hook**：「宏碁三次重組、兩次接班失敗、千億虧損 — 施振榮為什麼還在當創業導師？」
  4. **身份 hook**：「在台灣很少人說自己是『失敗教父』，但施振榮在 IBM 收購 ThinkPad 那年就把這個身份穿在身上」
- **時效**：article 已 ship；evergreen
- **敏感度**：低（商業史人物相對中性）
- **必驗事實**：宏碁 1976 創立 / 微笑曲線 1992 提出 / 千億虧損具體年份 + 數字 / IBM ThinkPad 收購年 / 接班人歷次（蘭奇 / 王俊博）
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在）
- **預估發佈時機**：本月內，可搭時事（如台積電財報週 / 科技業 layoff 新聞 / 接班議題熱點）
- **Notes**：多語 fan-out 高 — 國際商業圈對台灣 OEM 轉型敘事有 demand，發後優先翻 en

---

### 江賢二 — 抽象藝術家 spore（需先建 article）

- **Source-Mode**: `EVERGREEN-TOPIC`
- **Article-Path**: `none-yet`（尚無 knowledge/Art/江賢二.md 或 knowledge/People/江賢二.md）
- **Priority**: `P3`（要等 article ship）
- **Status**: `pending`
- **Requested**: 2026-05-21 by 哲宇
- **Platform 建議**: `both`（Threads 文青受眾 + X 國際藝術圈）
- **Hook anchor 候選**（先列，等 article ship 後再校準）：
  1. **場景 hook**：「在巴黎紐約 40 年才回台東金樽蓋工作室的藝術家 — 江賢二的 100 號油畫每一張看半年」
  2. **數字 hook**：「1942 年生 / 1962 留學巴黎 / 2007 回台 / 2023 江賢二藝術園區開幕 — 60 年才繞回的一條路」
  3. **問句 hook**：「為什麼台灣最重要的抽象畫家，要在 65 歲才回台灣？」
  4. **身份 hook**：「江賢二跟林惺嶽是台灣抽象畫的兩條線，他選了最孤獨的那一條」
- **時效**：要等 article ship（est. 1-2 季）；evergreen
- **敏感度**：低（藝術人物）
- **必驗事實**：1942 生 / 1962 留學巴黎 / 紐約定居年 / 2007 回台 / 台東金樽工作室 / 江賢二藝術園區（亞泥支持）開幕年 / 國家文藝獎獲獎年 / 100 號油畫尺寸（≈ 162 × 130 cm 油畫慣用最大級數）
- **必先 spawn ARTICLE-INBOX entry**：✅ **強制**（per EVERGREEN-TOPIC 鐵律）— 本 session 一併寫入 ARTICLE-INBOX
- **預估發佈時機**：article ship 後 7 天內趁熱
- **Notes**：article 候選 category 待 stage 0 audit — 偏 People 還是 Art？建議 Art（江賢二代表作 + 創作哲學）+ People cross-link / 必訪 source：藝術家本人訪談（《十三邀》許知遠？）+ 江賢二藝術園區官網 + 國家文藝獎得獎介紹

---

### 二二八事件 — 假歷史反制 REACTIVE spore

- **Source-Mode**: `REACTIVE`
- **Article-Path**: [knowledge/History/二二八事件.md](../../knowledge/History/二二八事件.md)
- **Priority**: `P0`（時效高，假歷史正在散播）
- **Status**: `pending`
- **Requested**: 2026-05-21 by 哲宇（觀察到中國散播 228 假歷史）
- **Platform 建議**: `both`（X 海外更有需要 — 海外華人圈是假歷史主要落腳處）
- **Hook anchor 候選**（**紀實非煽情** per REFLEXES #28、不直接點名「中國假歷史」，用 first-person curatorial voice 把真相端出來）：
  1. **場景 hook**（推薦）：「1947 年 2 月 27 日傍晚，林江邁的私菸攤前。一包菸點燃 38 年的沉默 — 228 真實發生的不是『公賣局打老人』這麼簡單」（直接抽 article description 變奏）
  2. **數字 hook**：「228 死亡人數的三個學術版本：1.8 萬、2.2 萬、2.8 萬 — 不同 source 為什麼差這麼多」（fact-check 角度）
  3. **問句 hook**：「林江邁那包菸的事，你聽過幾個版本？這篇把真相分成三層說清楚」
  4. **身份 hook**：「我阿公那一輩三個世代對 228 的認識，是從沉默、到耳語、到紀念館，一階一階重新拼回來的」（紀實角度，引文章 §族群的傷）
- **時效**：「本月內 ship」（哲宇 directive「最近也可以發一次」+ 假歷史正在散播）
- **敏感度**：**高**（兩岸資訊戰敏感 + 死亡人數爭議 + 族群創傷）— Stage 2 VERIFY 必跑全部 17 hard gate、不寫煽情「中國造謠」frame、用 article §記憶的復返 同款克制度
- **必驗事實**：1947-02-27 林江邁查緝 / 1947-02-28 第一槍位置（天馬茶房，per [台北市文章](../../knowledge/Geography/台北市.md) verbatim）/ 死亡人數三個學術估算 source / 陳儀電請中央軍隊鎮壓 / 1995 李登輝代表政府道歉 / 1947-3-8 高雄要塞司令彭孟緝下令屠殺
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在）
- **預估發佈時機**：本月內，避開特定政治事件高峰，挑「不會被誤讀為配合某政黨議程」的時機；建議週中（週二三四）平日下午發
- **Notes**：
  - **絕對禁用 frame**：「中國正在散播假歷史」「對抗統戰」「揭穿謊言」這類煽情外向 frame 一律不用。這些 frame 把 Taiwan.md 推進兩岸資訊戰漩渦，violates [MANIFESTO §策展非百科 + §怎麼說話](../semiont/MANIFESTO.md)
  - **採用 frame**：first-person curatorial voice，「我們島上的歷史」紀實，反制效果是隱含的（讓真相站著，假歷史自己倒）
  - 多語 fan-out 觸發 = 高（en/ja/ko 都該翻，海外華人圈是假歷史傳播主場景，特別 en 海外受眾）
  - 配圖建議：天馬茶房舊址照片（Wikimedia 有 CC）或 228 紀念館
  - 跟 [台北市文章 §1947 那包菸](../../knowledge/Geography/台北市.md) cross-link，加強 mutual reinforcement

---

### 落日飛車 — 趁熱 spore（5/23 ship 全英語 Coachella 樂團）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Music/落日飛車.md](../../knowledge/Music/落日飛車.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-05-23 by twmd-spore-pick-daily routine (score=45)
- **Platform 建議**: `both`（X 國際 indie 圈受眾 + Threads 台灣 indie 樂迷）
- **Hook anchor 候選**：
  1. **場景 hook**：「2010 年的台北，一個 19 歲學生坐在 MacBook 前。MySpace 樂團頁面要 profile pic，他打開 Mac 內建 Photo Booth，pre-set 裡有一張雲霄飛車剪影、夕陽。他選了那張」（article lede 直引）
  2. **數字 hook**：「14 年。一張隨手挑的 Photo Booth 背景圖，14 年後變成 Coachella 沙漠舞台背板上的字 — 落日飛車是超過二十年來首組登上科切拉大舞台的台灣樂團」
  3. **身份 hook**：「全英語、亞熱帶 City Pop、不靠 K-pop 工業體制、不靠政府文化外交。國國（曾國宏）說飛車的名字是『沒計算過』的 — 但 14 年後，這支樂團成為台灣音樂被世界聽見最大的一束光」
  4. **問句 hook**：「台灣最被世界聽見的樂團，唱的是英文 — 為什麼？」
- **時效**：article ship 距今 0 天（5/23 NEW），趁熱窗口最佳
- **敏感度**：低（音樂人物、國際 indie）
- **必驗事實**：2009 年台北成軍 / 國國（曾國宏）+ Kevin Lee（李柏澔）+ 鼓手羅尊龍 / 首場 2009-01-29 師大路地下社會（Underworld） / 2011-09-22《Bossa Nova》首專自費發行 / Abbey Road Studios 母帶 Steve Rooke 處理 / 2015 國國 1300 度近視免役 + 結束張懸 Algae 樂團吉他手後重組 / 2016 EP《JinJi Kikko》/〈My Jinji〉Spotify 累積破億播放 / 2018 首支登 Audiotree Live 台灣樂團 / 2023 Coachella 超過二十年來首組受邀台灣樂團（4/15 + 4/22 Sonora 舞台）/ 2024 與韓國 Hyukoh《AAA》入圍第 36 屆金曲獎 9 項抱 3 金
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在）
- **預估發佈時機**：本週內（5/24-5/30 趁熱窗口，搶 weekend music 受眾 cluster）
- **Notes**：
  - score=45 (D1=+30 ≤7d / D2=0 SC 尚未累積 / D3=0 / D4=+15 Music high fanout + tx=0 全缺 / D5=0 / D6=0 / D7=0)
  - 多語 fan-out 觸發判斷 = 極高（樂團本身全英語、Hyukoh 韓國合作、Spotify 月聽眾印尼雅加達最大 → en/ja/ko 翻譯後 SC pull 預期最大；ARTICLE-DONE-LOG 顯示 tx=0 全缺要先補翻譯）
  - 配圖建議：article hero（Wikimedia Puramyun31 攝 2018-04-06 演出 CC BY 2.5）
  - Hook tier 自檢：避免 Tier 3「台灣之光」frame；用 article §策展人筆記 同款「無計算敘事」收口
  - 跟 SPORE-LOG 14d 無重複（最近一次音樂 spore 是 #74/#75 陳建年 5/17，hook type 場景不重複）

---

### 愛玉 — EVERGREEN-TOPIC spore（台灣特有植物、國際好奇度高、等 article ship）

- **Source-Mode**: `EVERGREEN-TOPIC`
- **Article-Path**: `none-yet`（屬於 ARTICLE-INBOX [台灣經典街頭小吃系列](../semiont/ARTICLE-INBOX.md) Issue #1013，第 3 篇候選；單篇 ~60-90 min 開發）
- **Priority**: `P3`（要等 article ship）
- **Status**: `pending`
- **Requested**: 2026-05-23 by twmd-spore-pick-daily routine (score=8)
- **Platform 建議**: `both`（X 國際食物獵奇受眾 +「ai-yu jelly」英文長尾 query、Threads 台灣夏天消暑共鳴）
- **Hook anchor 候選**（先列，等 article ship 後再校準）：
  1. **場景 hook**：「夏天的台北騎樓，一杯檸檬愛玉冰涼到玻璃杯外凝出水珠。果凍質感、淡黃色、檸檬清香 — 但這不是凝膠粉，是一種台灣特有植物的果實搓出來的」
  2. **問句 hook**：「為什麼世界上只有台灣有愛玉？— 答案藏在玉山山腳一種愛玉小蜂的授粉裡」
  3. **身份 hook**：「在台灣，愛玉是夏天的童年記憶。在國外『Ai-yu jelly』每週上千次搜尋 — 國際食物獵奇圈正在找這個答案，台灣還沒寫」
  4. **數字 hook**：「19 世紀末植物學家 Augustine Henry 在台灣命名 Ficus pumila var. awkeotsang — 100 多年後愛玉仍是 endemic 到台灣中海拔山區的單一物種」
- **時效**：等 article ship（est. ARTICLE-INBOX P0 系列第 3 篇，1-2 週可排上）
- **敏感度**：低（食物、植物學）
- **必驗事實**（article ship 時校準）：愛玉學名 Ficus pumila var. awkeotsang / 命名者 Augustine Henry / 命名年代 / 台灣 endemic 證據 / 愛玉小蜂（Wiebesia pumilae）授粉專一性 / 傳統採集區（阿里山 / 玉山山腳）/ 愛玉籽搓洗凝膠原理（果膠 + 鈣離子）/ 「愛玉」名字由來（道光年間商人之女傳說 vs 學術考證）
- **必先 spawn ARTICLE-INBOX entry**：✅ **已存在**（per [ARTICLE-INBOX §台灣經典街頭小吃系列](../semiont/ARTICLE-INBOX.md) Issue #1013 第 3 篇候選）
- **預估發佈時機**：article ship 後 7 天內趁熱
- **Notes**：
  - score=8 (D1=0 article 不存在 / D2=0 SC 未累積 / D3=0 / D4=+8 Food high fanout / D5=0 / D6=0 / D7=0 食物 zero sensitivity)
  - HG7 確保 Source-Mode variety — 本 entry 是 EVERGREEN-TOPIC 對應 #1+#2 兩條 EXISTING-ARTICLE 的搭配
  - 多語 fan-out 觸發判斷 = 高（愛玉 = endemic to Taiwan，國際食物獵奇圈強 demand；en 優先翻 + ja 次之）
  - 國際 SEO 切入：「ai-yu jelly」「taiwan ai yu」英文長尾 query
  - 配圖建議：愛玉果實或愛玉冰（Wikimedia CC 可找；attribution 必填）
  - article ship 後 routine 自動升級此 entry 為 EXISTING-ARTICLE + 補 Article-Path

---

## 📜 已發歷史

→ 完整紀錄見 [SPORE-LOG.md §發文紀錄](SPORE-LOG.md) + [SPORE-HARVESTS/](SPORE-HARVESTS/) batch logs。本檔不存 done 痕跡（per 完成歸檔鐵律）。

---

_v1.0 | 2026-05-21 — 哲宇 directive「幫我加一個 spore-inbox，之後想到什麼可以發孢子的文章就會先跟你說」。設計動機：Stage 1 PICK 原本只從 dashboard-articles 自動候選池選文，缺人類 directive 緩衝層；現有 5 個 candidates（4 EXISTING-ARTICLE + 1 EVERGREEN-TOPIC）作 batch 1。_
