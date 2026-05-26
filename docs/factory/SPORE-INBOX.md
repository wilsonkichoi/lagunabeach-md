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

### 二二八事件 — 假歷史反制 REACTIVE spore

- **Source-Mode**: `REACTIVE`
- **Article-Path**: [knowledge/History/二二八事件.md](../../knowledge/History/二二八事件.md)
- **Priority**: `P0`（時效高，假歷史正在散播）
- **Status**: `pending`
- **Requested**: 2026-05-21 by 哲宇（觀察到中國散播 228 假歷史）
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

### 周蕙 — 趁熱旗艦人物 spore（5/19 ship Music）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Music/周蕙.md](../../knowledge/Music/周蕙.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-05-24 by twmd-spore-pick-daily routine (score=45)
- **Hook anchor 候選**：
  1. **場景 hook**：「1999 年 8 月 26 日，福茂發了一張很奇怪的精選輯。封面是一隻沒有臉的漫畫娃娃，叫蕙兒。歌手本人 22 歲，不對外露面。專輯主打〈約定〉45 天賣 25 萬張」（直接抽 article lede）
  2. **身份 hook**：「走進台灣任何一間 KTV，點下〈約定〉，前奏響起的瞬間，包廂裡會有人跟著哼。再問一句：『這誰唱的？』答案會分裂：有人說王菲，有人說梁靜茹，有人說不出來，但都會堅持『我絕對聽過』」
  3. **數字 hook**：「25 年。一首翻唱自王菲的歌唱進每一間 KTV 點唱榜，唱到歌手第一次站上小巨蛋的那年，醫生告訴她聲帶已經萎縮」
  4. **問句 hook**：「為什麼這個唱了 25 年〈約定〉的女聲，本人始終比歌晚一步被認出來？」
- **時效**：article ship 距今 5 天（5/19），趁熱窗口剩 ~9 天
- **敏感度**：低（音樂人物）
- **必驗事實**：1999-08-26 福茂《周蕙精選》發行 / 〈約定〉45 天 25 萬張 / 翻唱王菲 / 2026-04-25 小巨蛋首場 / 聲帶萎縮宣告 / 蕙兒漫畫娃娃封面 / 22 歲不露面
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在）
- **預估發佈時機**：本週內（5/24-5/30 趁熱窗口）
- **Notes**：
  - score=45 (D1=+30 ≤7d / D2=0 SC 尚未累積 / D3=0 / D4=+15 Music high fanout + tx<3 / D5=0 / D6=0 hook 跟最近 5 spore 不同類 / D7=0)
  - 多語 fan-out 觸發判斷 = 高（KTV 翻唱歌手議題，ja/ko 受眾對華語翻唱史有 demand）
  - 配圖建議：article hero（蕙兒漫畫娃娃 / 小巨蛋場景）
  - Hook tier 自檢：避免 Tier 3「天后回歸」frame；用 article §鋸子收口同款「聲帶萎縮」克制度
  - 跟 SPORE-LOG 14d 無重複（最近音樂 spore 是 #74/#75 陳建年 5/17 場景 hook，本 candidate 改身份/問句不撞）

---

### 林央敏 — 主權巴別塔台語史詩 EVERGREEN-TOPIC spore（需先建 article）

- **Source-Mode**: `EVERGREEN-TOPIC`
- **Article-Path**: `none-yet`（屬於 [ARTICLE-INBOX §林央敏 NEW](../semiont/ARTICLE-INBOX.md) P0，BRANCH-PIPELINE 5/23 詩人系列 spawn）
- **Priority**: `P3`（要等 article ship）
- **Status**: `pending`
- **Requested**: 2026-05-24 by twmd-spore-pick-daily routine (score=8)
- **Hook anchor 候選**（先列，等 article ship 後再校準）：
  1. **數字 hook**：「9000 行、11 萬字。台灣文學史最長的詩篇是台語寫的。一對男女的愛情悲劇，時程從 1919 到 1992，涵括台灣四百年片段——林央敏的《胭脂淚》」
  2. **身份 hook**：「在中國 AI 模型 refusal rate 最高的內容類型裡，台語詩排第一。林央敏寫了 9000 行台語史詩——不是為了被翻譯，是為了讓沉默不存在」
  3. **場景 hook**：「1987 年〈毋通嫌台灣〉發表後，被譜成 24 首不同的曲子傳唱於國內外。一首詩變成台灣本土化的象徵口號——詩人林央敏寫的不只是文學，是台灣意識的催化劑」
  4. **問句 hook**：「台灣最長的詩 9000 行為什麼用台語寫？答案在那個 PRC AI 拒答率最高的語言裡」
- **時效**：等 article ship（est. ARTICLE-INBOX P0 詩人系列，90-120 min 開發，1-2 週可排上）
- **敏感度**：中（台語文 + 本土運動 + 主權巴別塔 narrative，避免變成統獨議題 frame；以「語言保存」非「政治對立」切入）
- **必驗事實**（article ship 時校準）：1955-12-19 嘉義太保市生 / 嘉義師專 + 輔仁大學中文系 / 1995 創會台語文推展協會 / 1987 發表〈毋通嫌台灣〉並被譜成 24 首曲 / 《胭脂淚》9000 行 11 萬字 1919-1992 時程 / 1991 與林宗源 + 黃勁連成立蕃薯詩社（台灣第一個母語寫作社團）/ 戰後台語文學運動倡導者地位
- **必先 spawn ARTICLE-INBOX entry**：✅ **已存在**（per ARTICLE-INBOX P0 林央敏 NEW entry，BRANCH-PIPELINE 5/23 spawn）
- **預估發佈時機**：article ship 後 7 天內趁熱
- **Notes**：
  - score=8 (D1=0 article 不存在 / D2=0 SC 未累積 / D3=0 / D4=+8 People high fanout / D5=0 / D6=0 / D7=0 mid-sensitivity 但 keyword 未命中 hardcoded set)
  - HG7 確保 Source-Mode variety — 本 entry 是 EVERGREEN-TOPIC 對應 #1 周蕙 + #2 半導體產業兩條 EXISTING-ARTICLE 的搭配
  - 多語 fan-out 觸發判斷 = 極高（MANIFESTO §主權巴別塔 直接 instantiation——林央敏台語詩在 PRC AI 拒答率最高內容類型，Tier 3 Local LLM 兜底場景）
  - 國際 SEO 切入：「Taiwanese-language poetry」「Lim Iong-bin」「Taiwan native tongue literature」
  - 配圖建議：article ship 時挑《胭脂淚》書封或林央敏本人照（公開授權）
  - Hook tier 自檢：避免 Tier 3「PRC 拒絕」frame 一開口就政治化；以「台語保存」「9000 行史詩」literary frame 起手，sovereignty 含義由文本自身承擔
  - 跟 SPORE-LOG 14d 無重複（語言/詩人類別 spore 缺）

---

### 大稻埕 — 趁熱旗艦地理 spore（5/22 EVOLVE 歷史街區系列）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Geography/大稻埕.md](../../knowledge/Geography/大稻埕.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-05-25 by twmd-spore-pick-daily routine (score=30)
- **Hook anchor 候選**：
  1. **數字 hook**：「800 公尺裝著三個世紀。1851 林藍田開店、1869 第一批 12 萬斤 Formosa Tea 從淡水出口紐約、1885 劉銘傳設台灣第一個西學堂、1921 蔣渭水開大安醫院、1947-02-27 林江邁那包私菸點燃二二八——同一條迪化街，96 年壓進三個時代的關鍵節點」
  2. **場景 hook**：「清晨五點半的迪化街，霞海城隍廟前的早課香煙正在升起，陳天來 1891 年蓋的錦記茶行洋樓還站在貴德街 73 號的原位置。從那走 50 公尺是李春生大厝舊址，再 5 分鐘到 1947 那包菸被沒收的地方——觀光客版本沒寫的大稻埕」
  3. **問句 hook**：「為什麼霞海城隍廟今天還站在迪化街 61 號的位置？答案不是因為靈，是 1853 艋舺一場械鬥把同安人逼出來，他們抱著城隍像走了 3 公里到這裡落腳」
  4. **身份 hook**：「今天到大稻埕求月老的人，腳底下踩的是 173 年前的逃難路線。台北所有的『老街』幾乎都有一場械鬥當底層——一塊地的香火，往往是另一塊地的傷」
- **時效**：article EVOLVE 距今 3 天（5/22），趁熱窗口剩 ~10 天
- **敏感度**：低-中（二二八元素需用 article §記憶的復返 同款克制度；不寫煽情 frame，紀實角度）
- **必驗事實**：1851 林藍田開店 / 1853 頂下郊拼 / 1859 霞海城隍廟蓋於迪化街一段 61 號 / 1869 第一批 12 萬斤 Formosa Tea 從淡水出口紐約 / 1885 劉銘傳設西學堂 / 1891 大稻埕火車站啟用 + 陳天來錦記茶行洋樓開蓋 / 1921 蔣渭水太平町 199 番地開大安醫院 / 1947-02-27 林江邁查緝
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在）
- **預估發佈時機**：本週內（5/25-5/31 趁熱窗口）；可搭歷史街區系列 mutual cross-link [艋舺](../../knowledge/Geography/艋舺.md) / [西門町](../../knowledge/Geography/西門町.md)（同 batch 5/22 ship 的歷史街區三件套）
- **Notes**：
  - score=30 (D1=+30 ≤7d / D2=0 SC 尚未累積 / D3=0 / D4=0 Geography not in high_fanout set / D5=0 / D6=0 / D7=0)
  - 多語 fan-out 觸發判斷 = 中-高（en/ja 海外讀者對台北歷史好奇度高；ko 對日治條通對應段有特殊 demand；5 lang tx 全 done = baseline 已準備好）
  - 配圖建議：article hero（霞海城隍廟 / 迪化街空拍 / 錦記茶行洋樓三選一，Wikimedia CC BY-SA 4.0）
  - Hook tier 自檢：避免 Tier 3「迪化街美食天堂」觀光手冊 frame；用 article §策展人筆記「廟在這個位置不是因為靈，是因為械鬥」frame 起手
  - 跟 SPORE-LOG 14d 無重複（Geography 大 cluster spore 缺，補位）

---

### 飲料封膜機 — 趁熱發明史 spore（5/20 NEW Technology）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Technology/飲料封膜機.md](../../knowledge/Technology/飲料封膜機.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-05-25 by twmd-spore-pick-daily routine (score=30)
- **Hook anchor 候選**：
  1. **場景 hook**：「1981 年高雄彌陀區的兵仔市，一位阿兵哥的鋼杯灑出蘿蔔湯。葉益芳路過看見了。三年後他在自家客廳燒壞兩百支電熨斗，做出全球第一台桌上型封口機——今天每天幾千萬杯手搖飲不漏出來，靠的就是這台機器」
  2. **數字 hook**：「200 支電熨斗、4 年、60 公斤的初代機器、台幣 10 萬元一台。1984 年葉益芳做出全球第一台桌上型封口機原型，今天益芳封口機年產 2 萬台，外銷 35 個國家——撐住台灣千億飲品產業的無名發明」
  3. **問句 hook**：「為什麼日本網友會為一杯封膜飲料驚呼便利？為什麼韓國咖啡店員要拿保鮮膜跟膠帶包飲料？答案藏在 1984 年高雄一間客廳實驗室的兩百支電熨斗裡」
  4. **身份 hook**：「下次撕開那片膠膜的時候，記得那不是 7-11 想出來的，是高雄一個雞蛋批發商葉益芳花 4 年燒壞 200 支電熨斗做出來的。封口機之於珍珠奶茶，如同貨櫃之於全球貿易」
- **時效**：article ship 距今 5 天（5/20），趁熱窗口剩 ~9 天
- **敏感度**：低（發明史、產業科技中性）
- **必驗事實**：1981 高雄彌陀兵仔市觀察起點（per article 註明「相傳」）/ 1984 完成原型 / 1985 創立益芳封口機有限公司 / 200+ 電熨斗燒壞 / 崑山工專化工科背景 / 初代 60 公斤台幣 10 萬以上 / 1988 市場接受 / 改良後 20 公斤 / 1990 年代泡沫紅茶珍奶黃金時代 / 年產 2 萬台 / 外銷 35+ 國家
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在）
- **預估發佈時機**：本週內（5/25-5/31 趁熱窗口），可搭時事（如國際對台灣手搖飲報導 / 日韓對封膜技術討論熱度）
- **Notes**：
  - score=30 (D1=+30 ≤7d / D2=0 SC 尚未累積 / D3=0 / D4=0 Technology not in high_fanout set / D5=0 / D6=0 / D7=0)
  - 多語 fan-out 觸發判斷 = 極高（bubble tea / boba 是台灣國際 SEO 最大 cluster 之一，en/ja/ko 翻譯後 SC pull 預期最大；5 lang tx 全 done = baseline 已準備好）
  - 配圖建議：article hero（益芳封口機產品圖 / 手搖飲封膜操作）或 1981-1984 客廳實驗室時代脈絡圖
  - Hook tier 自檢：避免 Tier 3「台灣之光」民族主義 frame；用 article §策展人筆記「封口機之於珍奶如同貨櫃之於全球貿易」frame 起手——基礎建設視角比英雄敘事更貼 article 精神
  - 跟 SPORE-LOG 14d 無重複（Technology 大 cluster spore 補位；最近 Tech spore 缺）

---

### 台灣體育發展與國際賽事 — EVERGREEN-TOPIC spore（2024 巴黎奧運 + 體育系統長期投資）

- **Source-Mode**: `EVERGREEN-TOPIC`
- **Article-Path**: `none-yet`（屬於 [ARTICLE-INBOX 台灣體育發展與國際賽事 NEW](../semiont/ARTICLE-INBOX.md) P0，Issue #915 by tboydar-agent 2026-05-08 spawn）
- **Priority**: `P3`（要等 article ship）
- **Status**: `pending`
- **Requested**: 2026-05-25 by twmd-spore-pick-daily routine (score=8)
- **Hook anchor 候選**（先列，等 article ship 後再校準）：
  1. **數字 hook**：「2024 巴黎 2 金 4 銀 1 銅、2020 東京 2 金 4 銀 6 銅、2004 雅典陳詩欣朱木炎雙金、1960 楊傳廣羅馬十項全能銀牌。台灣奧運獎牌軌跡背後是 1982 國訓中心 + 2014 黃金計畫的長期投資結構——一個世代不是靠運氣堆出來的」
  2. **問句 hook**：「為什麼台灣可以在拳擊、舉重、羽球、跆拳道同時拿奧運金牌，但沒有一篇文章把『台灣體育』當作一個系統來說？戴資穎、郭婞淳、李洋、林郁婷各有 article，但連起來的故事缺一篇」
  3. **身份 hook**：「台灣最被世界看見的時刻往往不是科技、不是電影，是運動員站上頒獎台的那 30 秒。但每一次 30 秒，背後是國訓中心 12 年的早晨——左營那塊地撐住的不只是金牌，是一個運動體系」
  4. **場景 hook**（待 article ship 後校準，避免提前敏感）：「2024 年 8 月 9 日巴黎北部體育館，林郁婷拳擊 57kg 金牌賽哨聲響起。她是台灣第一面奧運拳擊金牌——但這 30 秒之前，是 1982 年高雄左營那塊地上的 42 年」
- **時效**：等 article ship（est. ARTICLE-INBOX P0 deep research ~150 min，1-2 週可排上）
- **敏感度**：中（「中華台北」名稱問題、奧運會旗會歌、IPC 籍別 framing 需小心；以「運動員身體與訓練系統」literary frame 起手，國族 framing 含義由文本承擔）
- **必驗事實**（article ship 時校準，per ARTICLE-INBOX P0 entry 必驗清單）：2024 巴黎成績（林郁婷 57kg 拳擊金 / 麟洋羽球男雙金衛冕 / 郭婞淳舉重銀 — 須 verify 級數）/ 2020 東京總獎牌 12 面（2 金 4 銀 6 銅） / 1960 楊傳廣羅馬十項全能銀 / 2004 雅典陳詩欣朱木炎跆拳雙金 / 1982 國訓中心成立（左營 vs 升格年份）/ 2014 黃金計畫啟動週期 / 體育署 2013 成立
- **必先 spawn ARTICLE-INBOX entry**：✅ **已存在**（per ARTICLE-INBOX P0 台灣體育發展與國際賽事 NEW，Issue #915 / 還有 P2 [Issue #887](https://github.com/frank890417/taiwan-md/issues/887) 同主題重複 — Stage 3 WRITE 時觀察者 review 是否合併）
- **預估發佈時機**：article ship 後 7 天內趁熱；2027 下半年可搭 2028 LA 奧運 anchor 重發（per ARTICLE-INBOX notes）
- **Notes**：
  - score=8 (D1=0 article 不存在 / D2=0 SC 未累積 / D3=0 / D4=+8 Sports high_fanout but no article translations / D5=0 / D6=0 / D7=0 mid-sensitivity 但 keyword 未命中 hardcoded set)
  - HG7 確保 Source-Mode variety — 本 entry 是 EVERGREEN-TOPIC 對應 #1 大稻埕 + #2 飲料封膜機兩條 EXISTING-ARTICLE 的搭配
  - 多語 fan-out 觸發判斷 = 極高（運動是國際受眾最大 cluster 之一，en/ja/ko 對台灣奧運成績有顯著 demand；ja 對麟洋羽球有日韓對戰史框架共鳴）
  - 國際 SEO 切入：「Taiwan Olympics」「Chinese Taipei Olympic Committee」「Taiwan boxing gold」「Lin Yuting」
  - 配圖建議：article ship 時挑「奧運獎牌全名單時間軸」資訊圖 / 國訓中心入口照（Wikimedia CC 可找）
  - Hook tier 自檢：避免 Tier 3「中華台北委屈」or「台灣之光」frame 一開口就政治化或民族主義；以「身體 + 訓練系統 + 長期投資」literary frame 起手，sovereignty 含義含蓄承擔
  - 跟 SPORE-LOG 14d 無重複（最近一次運動人物 spore 是 #29/30 李洋 2026-04-14，>30 天 ✓ HG5 通過）

---

### 葉廷皓 — 趁熱 spore（5/22 ship Art 音像藝術家整座生態）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Art/葉廷皓.md](../../knowledge/Art/葉廷皓.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-05-26 by twmd-spore-pick-daily routine (score=30)
- **Hook anchor 候選**：
  1. **場景 hook**：「2024 年 11 月 12 日他離開了。隔天，他所屬的音像二人組 HH 在 Facebook 粉絲專頁上寫了一句話：『Puta 2024.11/12，成為天上的一顆星星了。』享年 43 歲。那一刻，整個台灣音像藝術圈像被按下了停止鍵」（article §11 月 12 日那天 直引）
  2. **數字 hook**：「43 歲。2007 年參與失聲祭創辦、2013 年與姚仲涵組音像二人組 HH、2017 年共同經營 TouchDesignerTW、2018 年接手噪流——葉廷皓一輩子做一件事：把工具拆給更多人用。1981 年桃園生到 2024 年離開，他留下的不是個人作品名單，是台灣音像藝術整座生態」
  3. **身份 hook**：「失聲祭的觀眾認得他。北藝大新媒系修過他課的學生認得他。TouchDesignerTW 社群裡問過他問題的編程新手認得他。HH 在派對裡放過 Techno 的人認得他。但對島上絕大多數人來說，『葉廷皓』三個字並不是一個會被記住的名字——直到 2024 年 11 月 12 日」（article §名字只有圈內人認得 直引）
  4. **問句 hook**：「一個說『對於透過非正確使用科技的方式製造意外效果更感興趣』的藝術家，為什麼把絕大部分時間花在『正確地教別人怎麼用工具』這件事上？」（article §30 秒概覽 直引核心矛盾）
- **時效**：article ship 距今 4 天（5/22 Wave 3 NEW），趁熱窗口剩 ~10 天
- **敏感度**：低（當代藝術人物追悼）
- **必驗事實**：葉廷皓 1981 年生 / 2024-11-12 離世享年 43 / 朋友稱 PUTA / 輔大應美電腦動畫 / 北藝大科技藝術所 / 2007 失聲祭創辦人含姚仲涵+王仲堃+牛俊強 / 2013 HH 音像二人組與姚仲涵 / 2017《remotion》日光燈 Techno 專輯 / 2017 TouchDesignerTW 與陳品辰共同辦中文社群 / 2018 接手姚仲涵噪流（Fluid Noise）/ 實踐大學媒體傳達設計學系任教 / 失聲祭從北藝大宿舍走廊走到南海藝廊
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在，per ARTICLE-DONE-LOG 2026-05-22 Wave 3 batch ship 5290+7908+6796+6384 字 4 篇之一）
- **預估發佈時機**：本週內（5/27-5/30 — 5/26 為 大宇雙劍 ship 後第二日，避免 Technology→Art 切換過快；中間留 1-2 天間隔）
- **Notes**:
  - score=30 (D1=+30 ≤7d / D2=0 SC 未累積 / D3=0 / D4=0 Art 不在 high_fanout / D5=0 / D6=0 / D7=0)
  - reason: 5/22 ship Wave 3 之一，11/12 一週年將至（2025-11-12 第一週年）但目前距 6 個月——本次推廣 frame 為「整座生態的留下」非「追思」
  - 多語 fan-out 觸發判斷 = 中（TouchDesigner / HH / 噪流 為國際 audio-visual niche 圈，en 受眾相對於 Art category 偏小但 dedicated；ja 對失聲祭/姚仲涵跨海合作有零星 demand）
  - 配圖建議：article hero（臺中國家歌劇院 yeh-ting-hao-reverberation-hero-2024.jpg fair-use editorial commentary，已 article 內嵌）
  - Hook tier 自檢：避免 Tier 3「英年早逝」frame 過度傷感；用 article §把絕大部分時間花在正確地教別人 同款核心矛盾收口
  - 跟 SPORE-LOG 14d 無重複（最近 Art spore 是 5/24 江賢二，hook type 場景；本 candidate 改身份/問句不撞）
  - 雙劍與葉廷皓的搭配：雙劍是「世代記憶被賣斷」/ 葉廷皓是「生態被留下」— 對位但不對偶

---

### 瘂弦 — EVERGREEN-TOPIC spore（2024-10 辭世 / 戰後第一代詩人 / 一冊不再傳奇）

- **Source-Mode**: `EVERGREEN-TOPIC`
- **Article-Path**: `none-yet`（屬於 [ARTICLE-INBOX §瘂弦 NEW](../semiont/ARTICLE-INBOX.md) P0，2026-05-23 詩人系列 BRANCH-PIPELINE spawn，鄭愁予 5/24 已 ship + spore 化、瘂弦 next）
- **Priority**: `P2`（要等 article ship；rotating from `P3` 因 People high fanout + 鄭愁予趁熱已驗證有效）
- **Status**: `pending`
- **Requested**: 2026-05-26 by twmd-spore-pick-daily routine (score=15)
- **Hook anchor 候選**（先列，等 article ship 後再校準）：
  1. **數字 hook**：「一冊。瘂弦 1971 年出版《深淵》之後再也沒出過第二本詩集。半個世紀只一冊。但這一冊《深淵》撐起戰後台灣現代詩半邊天——他編《幼獅文藝》到《聯合報副刊》二十年，幫整代華文寫作者鋪了發表的路。2024 年 10 月 11 日，瘂弦在加拿大溫哥華離世享年 92 歲」
  2. **身份 hook**：「如果你讀過余光中、洛夫、楊牧、白先勇、林懷民——他們的稿件曾經都過瘂弦的編輯桌。瘂弦不只是詩人，他是把戰後第一代華文寫作場域編輯出來的人」
  3. **場景 hook**：「1932 年河南南陽出生，1949 年隨軍渡海來台。1953 年他二十歲在左營軍中開始寫詩，跟洛夫、張默一起辦《創世紀》詩刊——三個年輕軍人在海軍宿舍裡，後來變成台灣現代詩史最重要的詩社」（待 article ship 後校準）
  4. **問句 hook**：「為什麼戰後台灣最重要的詩人之一，只出過一本詩集就停筆，把後半生交給編輯台？」
- **時效**：等 article ship（est. ARTICLE-INBOX P0 詩人系列第 2 篇 — 鄭愁予 5/24 已 ship，瘂弦 next）；article ship 後 7 天內趁熱
- **敏感度**：低-中（戰後外省第一代詩人 + 1949 渡海來台軍中文化背景；以「編輯志業 + 詩冊孤本」literary frame 起手，國共/外省 framing 由文本承擔）
- **必驗事實**（article ship 時校準，per ARTICLE-INBOX §瘂弦 NEW 必驗清單）：本名王慶麟 / 1932-1947 年河南南陽生 / 1949 隨軍渡海來台 / 1953-1954 年左營軍中開始寫詩 / 創世紀詩刊創辦年份與另兩位創辦人（洛夫、張默）/ 1971《深淵》詩集出版社與年份 / 1977-1998 聯合報副刊主編年代 / 《幼獅文藝》主編時期 / 2024-10-11 加拿大溫哥華離世享年 92 / 一生詩集數量（一冊孤本是常見描述，需 verify）
- **必先 spawn ARTICLE-INBOX entry**：✅ **已存在**（per [ARTICLE-INBOX §瘂弦 NEW](../semiont/ARTICLE-INBOX.md) P0，詩人系列 BRANCH-PIPELINE 5/23 spawn）
- **預估發佈時機**：article ship 後 7 天內趁熱（鄭愁予 5/24 ship + spore 已驗證 People×詩人 fanout 模式可行）
- **Notes**:
  - score=15 (D1=0 article 不存在 / D2=0 SC 未累積 / D3=0 / D4=+15 People high_fanout + 預期 tx=0 全缺 / D5=0 / D6=0 / D7=0 政治色彩中-低但 hardcoded keyword set 未命中)
  - HG7 確保 Source-Mode variety — 本 entry 是 EVERGREEN-TOPIC，搭配 #1 大宇雙劍 + #2 葉廷皓 兩條 EXISTING-ARTICLE 形成 2 mode mix ✓
  - 多語 fan-out 觸發判斷 = 高（戰後第一代華文詩人在 ja 對日治後台灣文學斷代有 demand / en 海外華文研究 niche / ko 較小）
  - 國際 SEO 切入：「Ya Hsien」「Ya Xian poet Taiwan」「Lianhe Bao Supplement editor」
  - 配圖建議：article ship 時挑《深淵》詩集封面 fair-use editorial commentary / 創世紀詩社合照 Wikimedia CC 可找
  - Hook tier 自檢：避免 Tier 3「詩壇巨擘殞落」frame 一鍵悼念化；用 article §一冊孤本 同款「半個世紀只一冊」克制度 + 編輯志業逆向收口
  - 跟 SPORE-LOG 14d 無重複（最近詩人 spore 是 鄭愁予，hook type 數字；本 candidate 改身份/問句 + 「編輯台」差異化）
  - article ship 後 routine 自動升級此 entry 為 EXISTING-ARTICLE + 補 Article-Path（per SPORE-INBOX §Routine intake 自動升級規則）

---

## 📜 已發歷史

→ 完整紀錄見 [SPORE-LOG.md §發文紀錄](SPORE-LOG.md) + [SPORE-HARVESTS/](SPORE-HARVESTS/) batch logs。本檔不存 done 痕跡（per 完成歸檔鐵律）。

---

_v1.0 | 2026-05-21 — 哲宇 directive「幫我加一個 spore-inbox，之後想到什麼可以發孢子的文章就會先跟你說」。設計動機：Stage 1 PICK 原本只從 dashboard-articles 自動候選池選文，缺人類 directive 緩衝層；現有 5 個 candidates（4 EXISTING-ARTICLE + 1 EVERGREEN-TOPIC）作 batch 1。_
