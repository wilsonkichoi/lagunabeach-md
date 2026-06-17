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
| Distill 去 | knowledge/ (新 article or EVOLVE)           | spore-log.json (spore-db) + SPORE-HARVESTS batch |
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

### Intake-side backpressure（v1.2 — 2026-06-14 twmd-self-evolve-weekly 新增）

**問題**：v1.1 §Daily 共存規則只 throttle news-lens 拉到，沒看 SPORE-INBOX **total pending count**。實證：6/07 vc=1 pending=31 + 6/14 vc=2 pending=44，daily routine 繼續每天 +3 propose，SHIP rate ~1/day → buffer chronic 漲，直到 ≥50 才被 §Distill SOP §v1.1 auto-drop 5 條（事後 cleanup 不是事前 cap）。**LESSONS vc=2 對應 distill-ready candidate**「Routine intake rate > observer SHIP rate 的 buffer 系統需要自動 backpressure，警示閾值只 surface 不 mitigate」。

**SOP 補強**（在共存規則之外再套一層 pending count cap）：

```
SPORE-INBOX pending count >= 40 → daily routine 補 0（intake skip，不論 news-lens count）
SPORE-INBOX pending count ∈ [30, 40) → daily routine 上限 1（intake throttle）
SPORE-INBOX pending count < 30 → 走原 §Daily 共存規則
```

**生效機制**：`twmd-spore-pick-daily` Skill / SPORE-PICK-PIPELINE Stage 0 加 pending count gate（`bash scripts/tools/inbox-signal.sh` 第三條 spores pending=N 已輸出），N ≥ 40 直接 skip propose 不入 Stage 1。

**自主權邊界**：本 SOP 只 throttle routine intake，不 destroy 既有 entry（per §Distill SOP §自主權邊界）。哲宇 directive entry / news-lens P1 不受 cap 影響（intake 來源不同）。

**距 ≥50 auto-drop threshold buffer**：30 / 40 兩個 cap 設在 ≥50 之前，目的是在 distill 端 destructive auto-drop 觸發前先用 intake-side 軟煞車。Cross-cycle 驗證：6/21 distill cycle 若 pending 仍 ≥ 40 = 本 SOP 沒生效 → 需 review 是否 routine prompt 真的讀到本 §（vc=3 升 REFLEXES catalog candidate）。

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

### 陳水扁 — Threads 活躍期的時效 spore

- **Source-Mode**: `REACTIVE`
- **Article-Path**: [knowledge/People/陳水扁.md](../../knowledge/People/陳水扁.md)
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-12 by 哲宇（goal directive「陳水扁 -> 最近threads很活躍」）
- **Hook anchor 候選**:
  1. **反差 hook**：當年的「台灣之子」現在每天在 Threads 上跟年輕人對話——平台比他兒子還年輕
  2. **場景 hook**：從凱達格蘭大道的就職演說，到手機螢幕上的 Threads 貼文，陳水扁的麥克風換了三次形狀
- **時效**: 本週內（Threads 活躍是 reactive 窗口，哲宇觀察時點 6/12）
- **敏感度**: 高（政治人物 + 貪污案 + 保外就醫爭議——hook 不選邊，事實線走 article）
- **必驗事實**: Threads 帳號真實性與近期活躍度（Chrome MCP 直讀）、article lastVerified 狀態
- **必先 spawn ARTICLE-INBOX entry**: ❌（article 已存在；若 lastVerified > 90d 則 publish gate 會擋 → 先走 EVOLVE）
- **預估發佈時機**: article 過 gate 即可，趁 Threads 活躍話題性
- **Notes**: 高敏感 → routine 自動 ship 需特別走 SPORE-VERIFY 敏感度 gate；若被 defer 屬正常

### 馬英九 — 哲宇點名候選（注意 #80 framing pending 舊案）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/People/馬英九.md](../../knowledge/People/馬英九.md)
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-12 by 哲宇（goal directive spore 選項）
- **Hook anchor 候選**:
  1. **數字 hook**：633 這三個數字，台灣人記了快二十年——它是承諾、是哏、也是一面照後鏡
  2. **身份 hook**：當過總統的人裡，只有他在卸任後還每年去大陸祭祖、見過習近平兩次
- **時效**: 無（evergreen 人物）
- **敏感度**: 高（兩岸 + 政治立場雷區）
- **必驗事實**: 馬習會次數與日期、633 政見原文、article lastVerified
- **必先 spawn ARTICLE-INBOX entry**: ❌
- **預估發佈時機**: ⚠️ **先決條件**：HARVEST-FRAMING-PENDING/2026-05-28 的 #80 馬英九 Bucket D framing 案仍 awaiting_observer——同人物有未結 framing 爭議時不自動 ship，等該案結案或哲宇 explicit go
- **Notes**: 本 entry 對 routine 是 hold-with-condition；manual ship 不受限

### 江賢二 — 第二輪（5/24 已發過一輪，換 hook 軸）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Art/江賢二.md](../../knowledge/Art/江賢二.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-06-12 by 哲宇（goal directive spore 選項）
- **Hook anchor 候選**:
  1. **場景 hook**：在巴黎跟紐約畫了三十年「封窗」的畫，回到台東金樽，他第一次把窗戶打開
  2. **問句 hook**：一個畫家要多老，才能蓋一座給所有人的美術館？江賢二的答案是 81 歲
- **時效**: 無
- **敏感度**: 低
- **必驗事實**: 5/24 第一輪 spore 用的 hook（場景型）——本輪必須換軸避免自我重複；江賢二藝術園區開園時間與現況
- **必先 spawn ARTICLE-INBOX entry**: ❌
- **預估發佈時機**: 與 5/24 前輪間隔已過 14 天排除窗，Stage 1 PICK 可抽
- **Notes**: 哲宇連兩次點名江賢二（5/24 + 6/12），人物本身是他關注的訊號

### 台灣人小時候的英文名字 — READY (cron 2026-06-17 article ship 同 cycle，#148/#149 blueprint 完成，DEFER 社群 post 等下次 cycle / 觀察者 manual)

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Culture/台灣人小時候的英文名字.md](../../knowledge/Culture/台灣人小時候的英文名字.md)
- **Priority**: `P1`（高共感題 — 99% 台灣人都有「英文名是誰取的」共同經驗 + Hook tier 1b「加州海關 So your name is Chia-hao, not Kevin?」黃金 anchor）
- **Status**: `pending-publish`（blueprint draft READY，pre-ship verify 待哲宇 review，配圖 dep article hero 補完）
- **Requested**: 2026-06-17 by `twmd-rewrite-daily` cron 18:00 fire — cycle 已超 ~150 min wall-clock boundary
- **Blueprint 位置**: [SPORE-BLUEPRINTS/148-台灣人小時候的英文名字.md](SPORE-BLUEPRINTS/148-台灣人小時候的英文名字.md)
- **Hook anchor**（blueprint 已 lock）:
  - 共感問句開場：「你還記得你的英文名字是誰取的嗎？」
  - 時間 anchor：1987 芝麻街美語「NO CHINESE, ENGLISH PLEASE」
  - 學術 backing：Barešová & Pikhart 2020 N=76
  - Kicker：加州海關「So your name is Chia-hao, not Kevin?」（aithley.com 黃金 quote）
- **時效**: 無強時效（evergreen Culture 主題，prime time 任何 20-22 點可發）
- **敏感度**: 低（無政治 / 無爭議；命名權普世共感）
- **必驗事實**:
  - 何嘉仁 1983 / 吉的堡 1986 / 長頸鹿 1986 / 芝麻街 1987 三源 ✓
  - Barešová & Pikhart 2020 MDPI Social Sciences 9(4)/60 N=76 ✓
  - aithley.com「So your name is Chia-hao, not Kevin?」逐字 ✓
  - 「NO CHINESE, ENGLISH PLEASE」天下 5072615 逐字 ✓
- **預估發佈時機**: (a) article 補完 hero 後跑 make-spore.sh 自動配圖 → 哲宇 review → ship Threads + X；OR (b) 哲宇 directive 直接 ship draft（next routine cycle / manual）
- **Notes**:
  - cron defer broadcast 理由：cycle wall-clock 已超 150 min boundary（per §SPORE-PIPELINE boundary rule + 6/16 造山者 07ab13b10 precedent）
  - SPORE-PIPELINE 前置 hard gate 要求完整 Read 4 個 canonical（~3000+ 行）+ AI pre/post-ship verify 5+6 條 — cron 剩餘預算不足
  - 配圖 dep：article image-health hard=1（0 圖），article 補 hero 後 make-spore.sh 才有 base 可用
  - Bias 4 + §自主權邊界 「對外溝通」default 哲宇 in-loop
  - blueprint 已校準 SPORE-WRITING 自檢（朋友 tone「你還記得」/ 0 對位句型 / 0 破折號 / 逐字 Ctrl-F ✓ quote / UTM 雙 URL 已 encode）

<!-- routine 2026-06-17 ~20:30 twmd-rewrite-daily defer rationale: cycle wall-clock 已耗 ~150 min boundary (article BECOME 全 mode self-test + research 4 agent fan-out 99 query + Stage 2 fresh Opus writer + Stage 3 plugin gate + commit + push) → 超 SPORE chain 安全執行視窗. Blueprint READY, pre-ship review 待哲宇. -->

### 台灣的年級生世代 — READY (cron 2026-06-08 article ship 同 cycle，#130/#131 blueprint 完成，DEFER 社群 post 等下次 cycle / 觀察者 manual)

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Society/台灣的年級生世代.md](../../knowledge/Society/台灣的年級生世代.md)
- **Priority**: `P0`（高 leverage — 世代論主題普世關心 + Hook tier 1b 反差 hook「現在罵草莓族的人，當年就是被罵的草莓族」）
- **Status**: `pending-publish`（blueprint READY，pre-ship 8 hard gates 已自檢 PASS）
- **Requested**: 2026-06-08 by `twmd-rewrite-daily` cron 18:00 fire — cycle 已超 ~130 min wall-clock 安全執行 SPORE chain 視窗
- **Blueprint 位置**: [SPORE-BLUEPRINTS/130-台灣的年級生世代.md](SPORE-BLUEPRINTS/130-台灣的年級生世代.md)
- **Hook anchor 候選**（blueprint 已 lock A2 首尾呼應）:
  1. **A2 首尾呼應 hook**（已選）：「1993 年『草莓族』第一次被印出來時，罵的是現在最愛懷舊養樂多的五年級生」→ 收尾「這個詞最早罵的，很可能就是當年二十幾歲的你」
  2. **B3 標籤遷移史 hook**（備選）：30 年 3 批被罵者 + 同一個詞戴頭上
  3. **扶梯結構 hook**（備選）：台北房價所得比 6.4→15.41 倍 / 自購率 60%→25% — 量化結構但 hook 較弱
- **時效**: 無強時效（article 為 evergreen 結構性題目，prime time 任何晚上 20-22 點可發）
- **敏感度**: 低-中（純走世代標籤史 + 結構數據；blueprint 已避開政治認同/天然獨/抖音世代段降風險）
- **必驗事實**:
  - 1993 翁靜玉《辦公室物語》原指五年級（multi-source verbatim PASS）
  - 高院認定貶抑詞（不掰字號）
  - 台北房價所得比 6.4(2004) → 15.41(2025Q1) 政大不動產一手 PASS
  - 「不吃不喝十五年」= 15.41 大白話換算 ✓
- **預估發佈時機**: 下次觀察者 in-loop session prime time 20-22 點 — 觀察者觸發 `/twmd-spore-publish 130` 或 `/twmd-spore 台灣的年級生世代`
- **Notes**:
  - cron defer 社群 post 原因：本 cron cycle 已耗 ~130 min wall-clock（article BECOME + research 接力 + Stage 2-5 全跑含媒體深掃 + 5 PD/CC 圖 + cross-link + push），超 SPORE chain 安全執行視窗 → per §自主權邊界 + cron 150 min boundary defer
  - Article 5146 CJK chars + 25 footnote + 4 富文本 box + 4 tw-\* viz + 5 圖（VOA 太陽花×4 + 野百合 1990）+ stage 4 hard=0 PASS
  - Spore body 已校準 SPORE-VERIFY 自檢（對位 2 ≤3 / 破折號 3 / emoji 2 / hook 6 chars / 段落呼吸 4 段 / ~310 字略超 300 — 觀察者可微縮 8 字 OR 保留）
  - 配圖建議用 article hero（VOA 太陽花立法院議場全景，square 1080² 由 `make-spore.sh` 自動 derive）

<!-- routine 2026-06-08 ~19:55 twmd-rewrite-daily defer rationale: cycle wall-clock 已耗 ~130 min (article ship 全 stage + 媒體深掃 5 圖) → 超 SPORE chain 安全執行視窗. Blueprint READY, pre-ship 8 hard gates PASS. 等下次觀察者 manual 觸發 /twmd-spore-publish 130 即可 ship Threads + X dual-platform. -->

### 莫那能 — DEFER spore（routine 2026-06-03 ship article 後 conservative defer，需哲宇 manual framing）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/People/莫那能.md](../../knowledge/People/莫那能.md)
- **Priority**: `P1`（高 leverage 但高敏感）
- **Status**: `pending-observer-framing`
- **Requested**: 2026-06-03 by `twmd-rewrite-daily` routine（article ship d99a231b5 同 cycle 應接 spore，但走 DEFER）
- **DEFER 理由**（routine no-observer 鐵律，per [§自主權邊界](../semiont/MANIFESTO.md#我的存在結構) 政治立場條款 + REFLEXES anti-bias）：
  1. **政治立場高敏感**：莫那能本人左統派（夏潮會長 / 中國作協首批台灣 3 會員 / 反台獨）— 任何 spore framing 都會被讀為「Taiwan.md 對左統派的態度」，必須由哲宇親自決定 framing
  2. **〈鐘聲響起時〉2019 國中課綱「不雅」爭議前車**：此主題壓進 300 字容易引發類似公開爭議，無 observer 在場時不適合 ship
  3. **〈來，乾一杯〉verbatim 引語強度**：「一千八百萬人自決的口號／聽不到我們的歎息」這四行如果挑為 hook，會被讀為 Taiwan.md 對台獨運動的批判表態 — 這是 §自主權邊界 §對外溝通的紅線，需哲宇拍板
  4. **失明年齡多源衝突 (23/24/26/27)**：spore 短篇幅無法 layer 多源差異，容易被讀者抓到不精確
  5. **feedback_absolute_facts_extra_caution**：絕對事實 / 引語 / 政治立場 3x check + 哲宇曾撤回 80 likes spore 教訓 — 對此類主題 conservative 是正確的
- **Hook 候選**（待哲宇 framing pick）:
  1. **first 反差 hook**：「你知道嗎？📚 1989 年第一本原住民漢語現代詩集的作者，1979 年才失明，後來加入了中國作協」
  2. **詩 verbatim hook**：（不推薦 routine ship — 政治表態風險）
  3. **歷史錨點 hook**：「你知道嗎？🌾 1989《美麗的稻穗》— 第一本原住民漢語現代詩集 — 詩集名來自卑南族陸森寶 1958 寫給金門八二三砲戰族人的歌」（最低敏感版本，去政治化但保留歷史複雜度）
  4. **觀點 hook**：「你知道嗎？✋ 1984 年原住民還沒成為憲法用詞時，一個排灣族盲詩人在春風詩刊問了一句『你們說的「一千八百萬人」，包不包括我們？』」
- **媒體**：article hero (達仁鄉景觀, CC BY-SA 3.0) + 排灣族歌舞 + 達仁鄉教會 3 張可用
- **觀察者拍板必要項**：
  - (a) hook tier (1a 首尾呼應 / 1b 數字 / 2 verbatim) — 由哲宇判 framing 立場
  - (b) 是否引用〈來，乾一杯〉「一千八百萬人」verbatim — 政治表態 risk
  - (c) 是否提左統派身分 — 一致性 vs spore 簡化的張力
- **預估 ship 時機**：哲宇 manual review 後（無 deadline），article 本身先讓 SC + 讀者反應穩定 1-2 週再決定
- **Notes**：
  - Article 本身 honest 處理了左統派身分（第 7 H2「統派詩人？」三個觀察）— spore 短篇幅無法承載
  - Routine cron 主動選擇 DEFER 是正確操作，避免 ship-then-retract 風險
  - Per [feedback_red_line_anxiety_leak](../../../.claude/projects/-Users-cheyuwu-Projects-taiwan-md/memory/feedback_red_line_anxiety_leak.md)：spore 不寫得像在道歉 / 校正，文章已經處理過的複雜性不要在 spore 重新挑釁

<!-- routine 2026-06-03 010946 twmd-rewrite-daily defer rationale: 政治立場高敏感 (左統派 + 中國作協 + 反台獨 + 〈鐘聲響起時〉課綱爭議前車) + §自主權邊界 對外溝通條款 + REFLEXES anti-bias check. Article 已 honest 處理複雜度，spore 300 字無法承載 → 觀察者親自 framing -->

### 周蕙 — RETRACTION 重發（哲宇 directive 2026-05-28，#103/#104 voice drift 修補後重發）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Music/周蕙.md](../../knowledge/Music/周蕙.md)
- **Priority**: `P0`
- **Status**: `pending`
- **Requested**: 2026-05-28 by 哲宇 directive 「周蕙 → 刪掉重發」
- **Trigger**: SPORE-LOG #103/#104 retracted（voice drift — 第一行「走進台灣任何一間 KTV」完全無「你知道嗎？」prefix，是觸發 plugin Rule #14 v2 HARD gate 升級的三條 spore 之一）
- **Pre-conditions for re-ship**:
  - ✅ Article R2 EVOLVE 已 ship（commit `f32895640`，6655 CJK / 9 iframe / 12 張專輯 26 年弧線）
  - ⏳ 哲宇手動刪除 Threads + X 既有 post（per §自主權邊界，社群刪文 = human action）
  - ⏳ 新 blueprint **必須**寫到 `docs/factory/spore-blueprints/103-周蕙.md`（routine 必填 blueprint，不准 inline session memory）
  - ⏳ Blueprint frontmatter `template: <viral A/B/C/D>` + `hook_tier: 1a or 1b`
  - ⏳ Plugin Rule #14 v2 HARD=0 — 第一行字面 prefix「你知道嗎？{emoji}」/「欸，」/...
- **Hook 候選**（待 routine pick）:
  - A2 首尾呼應「你知道嗎？🎤 1999 年福茂發行一張很奇怪的精選輯，封面是漫畫娃娃，歌手 22 歲不對外露面...26 年後她第一次站上小巨蛋，尾聲說『不曉得這會不會是最後一次』」
  - B 反差「你知道嗎？🎵 全台灣 80% 的人都會哼〈約定〉副歌，但有 60% 認不出唱者的臉。她出道 25 年，三個月前才第一次站上小巨蛋...」
- **Notes**:
  - 重發是 v3.1 STRICT SPORE-WRITING READ GATE + plugin v2 HARD severity 第一次 production 驗證
  - 若 routine pick 跑時 plugin Rule #14 fail → revise prose，重跑 plugin（不准跳）

<!-- routine defer 2026-05-28: 中-高敏感 (政治脫口秀 + 鄭南榕梗 + 娛樂稅官司爭議 fit 政治立場 category) — 需 observer 親自 ship per spore-publish v3.0 §高敏感 REACTIVE defer rule spirit + MANIFESTO §自主權邊界 政治立場條款。cron no-observer context 走 conservative defer。 -->

### 曾博恩 — 旗艦人物 spore

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/People/曾博恩.md](../../knowledge/People/曾博恩.md)
- **Priority**: `P1`（2026-06-12 哲宇 goal directive 點名，P2→P1）
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
- **Priority**: `P1`（2026-06-12 哲宇 goal directive 點名，P2→P1）
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

<!-- routine defer 2026-05-28: 高敏感 REACTIVE (敏感度: 高 + 兩岸資訊戰 + 族群創傷 + 死亡人數爭議) — 需 observer 親自 ship per spore-publish v3.0 §高敏感 REACTIVE defer rule + MANIFESTO §自主權邊界 政治立場條款。routine context 無 observer 不准 ship。 -->

### 二二八事件 — 假歷史反制 REACTIVE spore

- **Source-Mode**: `REACTIVE`
- **Article-Path**: [knowledge/History/二二八事件.md](../../knowledge/History/二二八事件.md)
- **Priority**: `P0`（時效高，假歷史正在散播）
- **Status**: `pending` ⚠️ routine defer to human（per HTML comment 上方）
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

### 尊（朱玉恩）— 趁熱旗艦人物 spore（5/26 EVOLVE，2025/11 新家節點 + 30 歲分水嶺）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/People/尊.md](../../knowledge/People/尊.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-05-27 by twmd-spore-pick-daily routine (score=45)
- **Hook anchor 候選**：
  1. **數字 hook**：「19 歲百萬訂閱、171 萬訂閱現在、五年從《Minecraft》黃毛豬到台灣第三位百萬 YouTuber — 尊用日式快速跳接定義了一個世代的台灣 YouTube 審美，然後 2023 年因一支假手遊廣告掉下『清流』神壇」
  2. **場景 hook**：「2012 年的高雄房間，一個國中生對著螢幕錄《Minecraft》實況，自稱『黃毛豬』。五年後 19 歲那年他成為台灣 YouTube 史上最年輕的百萬訂閱主」（article §從黃毛豬起點 變奏）
  3. **身份 hook**：「在 YouTuber 一個個翻車的年代，網民把『清流』兩個字綁在他身上 — 但他自己說，清流從來不是舒適的王座，是一道隨時可能崩塌的枷鎖」（article §清流標籤下 直引變奏）
  4. **問句 hook**：「為什麼台灣第三位百萬 YouTuber 近兩年發片頻率明顯下降？答案藏在 2023 年那支假手遊廣告、哥哥小玉事件、跟 2025 年底『我！的！新！家！』那系列影片的轉向裡」
- **時效**：article EVOLVE 距今 1 天（5/26），趁熱窗口最佳（剩 ~12 天）
- **敏感度**：低-中（個人爭議 + 哥哥小玉 Deepfake 換臉謎片事件需克制處理；不寫煽情「清流崩壞」frame，用 article §孤獨的實驗者 同款克制度）
- **必驗事實**：1998-11-16 高雄生 / 14 歲開始拍片 / 19 歲（2017）達百萬訂閱台灣第三位 / 主頻道現訂閱 171 萬 / 2023-11 假手遊廣告爭議 / 2021 小玉（朱玉宸）Deepfake 換臉謎片事件 / 三人組「聖火玉尊」/ 第二頻道「人生魯宅x尊」/ 國立羅東商職 + 國立臺北大學公共行政系（已休學）/ 2025 年底「我！的！新！家！」系列 / 女友蘿倫 / 受日本 Hajime 社長啟發引入日式快速跳接
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在，且有 ARTICLE-INBOX P1 EVOLVE entry 待 deepen）
- **預估發佈時機**：本週內（5/27-6/3 趁熱窗口）；發後若 EVOLVE 完成可二次 spore 補 30 歲分水嶺 layer
- **Notes**：
  - score=45 (D1=+30 ≤7d / D2=0 SC 朱玉恩 query pos 7.98<10 不在 SC opp range（即使 imp=118）/ D3=0 / D4=+15 People high_fanout + tx<3 預期 / D5=0 / D6=0 hook 跟最近 5 spore 不撞（#95/96 4 年驗證、#92/94 數字、#93 場景、#91 場景、#89/90 數字、#87/88 數字 — 本 candidate 用問句/身份差異化）/ D7=0 hardcoded keyword set 未命中)
  - reason: 5/26 EVOLVE 趁熱 + ARTICLE-INBOX P1 EVOLVE entry 標記 SC 「朱玉恩」118 imp / 2.54% CTR signal — 短文 hold 不住 pos 提升的典型案例，spore 可放大現有 search-driven traffic 並驗證 EVOLVE 後 CTR 反應
  - 多語 fan-out 觸發判斷 = 中-高（YouTube 創作者議題在 ja 對日式快速跳接源流有共鳴 / en 對亞洲 YouTube 生態 niche demand / ko 較小）
  - 配圖建議：article hero (尊個人形象 / 「人生肥宅x尊」LOGO，需 fair-use editorial commentary attribution 或 YouTube 官方 channel art)
  - Hook tier 自檢：避免 Tier 3「百萬 YouTuber 翻車」獵奇 frame；用 article §對於尊而言「清流從來不是一個舒適的王座」frame 起手，把「人 vs 流量機器」核心矛盾扛出來
  - 跟 SPORE-LOG 14d 無重複（最近 People spore 是 #95/96 尹衍樑 5/26 數字+場景、#86 鄭愁予 5/24 數字、#82/83 許倬雲 5/23、#80/81 馬英九 5/23 — 全人物但 hook type 差異 ✓；本 candidate 改問句/身份不撞）
  - **HG7 contribution**: EXISTING-ARTICLE (#1 of 2 EXISTING)

---

### 西門町 — 趁熱旗艦地理 spore（5/21 NEW Wave 2 歷史街區系列 P0-3）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Geography/西門町.md](../../knowledge/Geography/西門町.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-05-27 by twmd-spore-pick-daily routine (score=30)
- **Hook anchor 候選**：
  1. **數字 hook**：「1908 年完工、1922 年命名、1961 年中華商場長出來、1992 年連同鐵路一起被拆、1999 年徒步區劃定 — 同一座八卦堂磚樓底下，130 年換了五代少年。1896 年日本人想仿東京淺草，把這塊艋舺東邊的沼澤地畫成『他者的娛樂用地』，DNA 寫死之後就再也改不動」
  2. **場景 hook**：「週六傍晚六點，西門紅樓八角磚牆下。一個穿 Lolita 洋裝的女生讓朋友拍照 — 她身上的蓬蓬裙跟 1908 年完工的紅磚拱窗一起入鏡。再走五十公尺，戶外酒吧的彩虹旗已經掛上來，七點以後混進來下班的上班族跟觀光客」（article §週六傍晚六點 直引變奏）
  3. **問句 hook**：「為什麼信義區是 18 歲少年不會去的地方？答案藏在 1896 年 — 一個日本人決定『把這塊地畫成淺草』那一刻」
  4. **身份 hook**：「站在西門紅樓南廣場那個 Cosplayer、彩虹旗酒吧、立食阿宗麵線攤、藍牆下的滑板少年 — 都站在 1908 年那座日本人蓋的紅磚樓周圍 250 公尺內。這塊地的 DNA 是『外人來消費、年輕人來玩、低密度資本、密集巷弄、不被士紳化』，130 年都改不動」（article §一個畫面 直引變奏）
- **時效**：article ship 距今 6 天（5/21 Wave 2 NEW），趁熱窗口剩 ~8 天
- **敏感度**：低-中（日治殖民敘事 + 戰後省籍 + 同志友善區 + 2003 起酒吧區 framing — 全用 article §策展人筆記 同款「物質配方」紀實角度，避免任何「帝國送禮」或「青少年墮落」二極 frame）
- **必驗事實**：1884 清光緒 10 年台北府城完工 / 寶成門 = 西門 命名取「寶物成就」/ 1895 日本人接管 / 1896-9 西門市場木造蓋起 / 1904 寶成門拆除 + 後藤新平保留剩餘四座 / 1908-12 西門紅樓磚造落成 / 設計師近藤十郎 1877 生 1904 自東京帝大建築學科畢業 / 1922 町名改正正式命名西門町 / 1961 中華商場八棟順縱貫鐵路長出來 / 1992 中華商場拆除 + 鐵路拆 / 1999 徒步區劃定 + 板南線通車 / 2003 起同志友善酒吧區 / 2024 單月 221 萬人次觀光商圈 / 西門紅樓 = 八卦堂 + 十字樓組合
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在，per ARTICLE-DONE-LOG 2026-05-21/22 Wave 2 batch 9 文 67922 字 248 footnote ship 之一）
- **預估發佈時機**：本週內（5/27-6/3 趁熱窗口）；可搭歷史街區系列 mutual cross-link [艋舺](../../knowledge/Geography/艋舺.md) / [大稻埕 INBOX 已 pending](../factory/SPORE-INBOX.md) 形成 Geography mini-cluster
- **Notes**：
  - score=30 (D1=+30 ≤7d / D2=0 SC 未累積 / D3=0 / D4=0 Geography 不在 high_fanout set (pipeline 列 People/Food/Music/Sports/History) / D5=0 / D6=0 hook variety 跟最近 5 spore 不撞 / D7=0)
  - reason: 5/21 Wave 2 ship + tie-break 反向 alphabetical 在 12 個歷史街區 candidates 中首選（西門町 unicode 0x897F 為 12 個中最高）/ 國際 SEO 切入度比寶藏巖/牯嶺街高（西門町是台北最知名 tourist district 之一）
  - 多語 fan-out 觸發判斷 = 高（en/ja/ko 海外讀者對台北最知名觀光區好奇度極高；ja 對近藤十郎 + 仿淺草殖民史有特殊 demand；ko 對同志友善區 + Cosplay 文化有共鳴；5 lang tx baseline 已準備好）
  - 配圖建議：article hero 西門紅樓八角堂 2021 照（Outlookxp Wikimedia CC BY-SA 4.0）或彩虹斑馬線 2019（Volksabstimmung Wikimedia CC BY-SA 2.0）
  - Hook tier 自檢：避免 Tier 3「台北原宿」觀光 frame；用 article §策展人筆記「為什麼是西門町不是信義」frame 起手 — 130 年 DNA 寫死的時間視角比 hot spot 列表更貼 article 精神
  - 跟 SPORE-LOG 14d 無重複（最近 Geography spore 缺；歷史街區 Wave 2 batch 9 篇全未 spore，本 candidate 是 series 首例）
  - **HG7 contribution**: EXISTING-ARTICLE (#2 of 2 EXISTING)

---

### 國家太空中心 TASA — EVERGREEN-TOPIC spore（32 年從計劃室到行政法人 / 主權衛星）

- **Source-Mode**: `EVERGREEN-TOPIC`
- **Article-Path**: `none-yet`（屬於 [ARTICLE-INBOX §國家太空中心 TASA NEW](../semiont/ARTICLE-INBOX.md) P0，2026-05-26 哲宇 directive spawn，~180 min 開發 1-2 週可排上）
- **Priority**: `P3`（要等 article ship）
- **Status**: `pending`
- **Requested**: 2026-05-27 by twmd-spore-pick-daily routine (score=15)
- **Hook anchor 候選**（先列，等 article ship 後再校準）：
  1. **數字 hook**：「1991 國科會太空計劃室 → 2005 NSPO → 2023/1/1 改制行政法人 TASA — 32 年。從買衛星到做衛星，福衛 1 號到福衛 8 號 8 顆星座，獵風者衛星首顆 GNSS-R 全自主，台灣慢慢長出自己的太空主權」
  2. **問句 hook**：「為什麼一個小國要花 32 年從工研院內辦公室升級到屏東九鵬發射場？答案不是科技 vanity，是 Starlink 替代方案、低軌衛星主權、跟 2031 入軌火箭計畫背後的國際依賴張力」
  3. **場景 hook**（待 article ship 後校準）：「2023 年 10 月 8 日，獵風者衛星從法屬圭亞那升空。台灣自主開發的首顆 GNSS-R 衛星，海面風場資料直接餵進美國 NOAA 同化模型 — 32 年前那個躲在國科會工程院內的太空計劃室，沒人想到能長到這一步」
  4. **身份 hook**（待 article ship 後校準）：「在中國反衛星試驗、美國 ITAR 出口管制、Starlink 商業壟斷三方夾擊的太空政治裡，台灣選擇做自己的衛星 — TASA 32 年的故事是一個小國怎麼用 251 億預算撐起『不依賴別人的眼睛』」
- **時效**：等 article ship（est. ARTICLE-INBOX P0 哲宇 directive 5/26 spawn，~180 min 開發，1-2 週可排上 baseline 6/2-6/10 window）
- **敏感度**：**中-高**（太空 = 軍民兩用敏感領域 / 中國反衛星試驗 + 兩岸軍事考量 / 美方 ITAR 出口管制 + 國防部火箭計畫 framing）— Stage 2 VERIFY 必跑 §爭議處理 + §自主權邊界 check；以「太空科研 + 32 年 timeline + 國際 GNSS-R 科學貢獻」literary frame 起手，sovereignty 含義由文本承擔
- **必驗事實**（article ship 時校準，per ARTICLE-INBOX P0 必驗清單）：1991 國科會太空計劃室成立日期 / 2005 NSPO 改名 / 2023-01-01 TASA 行政法人改制法源《國家太空中心設置條例》/ 福衛 1-8 發射時間軌道載荷（1999 福衛 1 / 2004 福衛 2 / 2006 福衛 3 / 2017 福衛 5 / 2019 福衛 7 / 2023 獵風者 / 2026+ 福衛 8 star constellation）/ 首任行政法人董事長吳宗信 TASA-1 任期 + 公開引語 / 自主率數字（買衛星 vs 做衛星比例各代福衛差距）/ 入軌火箭計畫 HTTP-3a 探空火箭 2024/9 屏東 + 2031 入軌目標 / ARRC 陽明交大 launchpad / Starlink 替代方案（中華電信 OneWeb + 行政院數位部 NCC 政策）/ 太空科技長程發展計畫第三期 2019-2028 約 251 億預算
- **必先 spawn ARTICLE-INBOX entry**：✅ **已存在**（per [ARTICLE-INBOX §國家太空中心 TASA NEW](../semiont/ARTICLE-INBOX.md) P0，2026-05-26 哲宇 directive spawn）
- **預估發佈時機**：article ship 後 7 天內趁熱
- **Notes**：
  - score=15 (D1=0 article 不存在 / D2=0 SC 未累積 / D3=0 / D4=+15 Technology 不在 high_fanout 列表但 People/Sports/History 也不直接命中，給 +15 因為「太空主權」對應 [MANIFESTO §主權的巴別塔](../semiont/MANIFESTO.md#我跟台灣的關係) sovereignty 主題 — judgment call / D5=0 / D6=0 / D7=0 太空敏感但 hardcoded keyword set (兩岸/228/戒嚴/統獨/中共/習近平) 未直接命中)
  - HG7 contribution: **EVERGREEN-TOPIC** (#1 of 1) — 對應 #1 尊 + #2 西門町 兩條 EXISTING-ARTICLE 形成 2 mode mix ✓
  - HG9 borderline check: 太空 = 軍民兩用敏感但 article ship 時 frame 「太空科研 + 國際 GNSS-R 科學貢獻」literary mode 可避開政治正面對撞；非 REACTIVE 也通過 HG9 因為不涉及兩岸/228/戒嚴/統獨/中共/習近平 hardcoded set
  - 多語 fan-out 觸發判斷 = 極高（太空 = 國際科技受眾大 cluster；ja 對 JAXA 比較有 demand / en 對 NOAA 福衛 7 RO 資料同化合作有 academic demand / ko 對韓國 KARI 比較有 demand）— 直接對應 [MANIFESTO §主權的巴別塔](../semiont/MANIFESTO.md#我跟台灣的關係) sovereignty preservation infrastructure
  - 國際 SEO 切入：「Taiwan Space Agency」「TASA Taiwan satellite」「FORMOSAT-8 GNSS-R」「TASA sovereign satellite」「Taiwan launch vehicle 2031」
  - 配圖建議：article ship 時挑 TASA 官網釋出衛星照片（Public domain 或 CC）/ 福衛 1-8 視覺 timeline / 寶山總部落成（公開報導）/ 吳宗信公開演講影片截圖
  - Hook tier 自檢：避免 Tier 3「台灣之光」民族主義 frame / 避免 Tier 3「兩岸對峙」政治框架；以「32 年 timeline + 自主率提升路徑 + 國際科學貢獻」frame 起手，sovereignty 含義由 GNSS-R / Starlink 替代方案 / ITAR 限制等具體事實承擔
  - 跟 SPORE-LOG 14d 無重複（最近 Technology spore 是 #87/88 半導體產業 5/25 數字、#89/90 雷亞遊戲 5/25 數字、#71 台灣無人機產業 5/10 — 全 Technology 但 hook type 差異 ✓；本 candidate 改場景/身份不撞）
  - article ship 後 routine 自動升級此 entry 為 EXISTING-ARTICLE + 補 Article-Path（per SPORE-INBOX §Routine intake 自動升級規則）

---

### 艋舺 — 趁熱旗艦地理 spore（5/21 NEW Wave 1 歷史街區系列）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Geography/艋舺.md](../../knowledge/Geography/艋舺.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-05-28 by twmd-spore-pick-daily routine (score=30)
- **Hook anchor 候選**：
  1. **數字 hook**：「1709 年陳賴章墾號取得官府墾照、1738 年龍山寺合資興建、1853 年頂下郊拼械鬥、1860 年淡水開港、1990 年設萬華區、2025 年老化指數 320.78% 全市最高 — 同一片淡水河口聚落，316 年的層積把『一府二鹿三艋舺』壓進台北平均年齡最老的行政區」
  2. **場景 hook**：「凌晨六點，龍山寺前殿的第一炷香升起來。捷運板南線從市政府站到龍山寺站 23 分鐘 — 同一座城裡的兩個時代，288 年前泉州三邑人合資蓋的那座廟還在原位置，旁邊是 65 歲以上人口佔 26.43% 的街區」
  3. **問句 hook**：「為什麼今天的萬華是台北平均年齡最老的區？答案藏在 1853 年三邑人借道清水祖師廟火攻八甲莊那場械鬥 — 同安人被推到大稻埕之後，北台灣的茶葉外銷重鎮從艋舺渡口移走了」
  4. **身份 hook**：「鈕承澤 2010 年拍的《艋舺》觀光客版本沒寫的事：在地人活的艋舺是廟埕、剝皮寮、青草巷、華西街 — 288 年沒走過的廟埕跟一條從來不在故事裡的渡口」
- **時效**：article ship 距今 7 天（5/21 Wave 1 NEW），趁熱窗口最後 1 天（最緊迫）
- **敏感度**：低-中（族群械鬥史 + 同安人/三邑人 + 凱達格蘭族原住民敘事 — 全用 article §1853 章節同款紀實角度，不寫煽情 frame）
- **必驗事實**：1709 陳賴章墾號取得官府墾照進駐大佳臘 / 1738 龍山寺由泉州晉江+南安+惠安三邑人合資興建 / 1853 咸豐三年頂下郊拼借道清水祖師廟火攻八甲莊 / 林佑藻率同安人抱霞海城隍神像逃到大稻埕 / 1860 淡水開港 / 1920 日治用佛經「萬華」取代「艋舺」台語發音 / 1990 設萬華區 / 2010 鈕承澤《艋舺》電影 / 2025 年底萬華區 65 歲以上人口佔 26.43% / 老化指數 320.78% 全市最高
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在，per ARTICLE-DONE-LOG 2026-05-21 Wave 1 batch 6900 字 32 footnote 5 圖 ship）
- **預估發佈時機**：本週內（5/28-6/3 趁熱窗口最後 1 天 +週尾 buffer）；可搭歷史街區系列 mutual cross-link [大稻埕 INBOX pending](../factory/SPORE-INBOX.md) + [西門町 INBOX pending](../factory/SPORE-INBOX.md) 形成 Geography 三件套
- **Notes**：
  - score=30 (D1=+30 ≤7d / D2=0 SC 未累積 / D3=0 / D4=0 Geography 不在 high_fanout set / D5=0 / D6=0 hook 跟最近 5 spore 不撞 / D7=0)
  - reason: Wave 1 5/21 ship 距今 7 天，是 batch 12 篇歷史街區裡 ARTICLE-DONE-LOG 最舊的 candidate，趁熱窗口僅剩 1 天 — 不發就過 14 天 cutoff
  - 多語 fan-out 觸發判斷 = 高（en/ja 海外讀者對艋舺龍山寺/剝皮寮/華西街觀光地標好奇度高；ja 對日治市區改正脈絡有特殊 demand；5 lang tx baseline 已準備好）
  - 配圖建議：article hero 艋舺龍山寺前殿 2016 照（Bernard Gagnon Wikimedia CC BY-SA 3.0）
  - Hook tier 自檢：避免 Tier 3「萬華觀光夜市指南」frame；用 article §策展人筆記「288 年沒走過的廟埕跟一條從來不在故事裡的渡口」frame 起手 — 在地人視角比 tourist hot spot 列表更貼 article 精神
  - 跟 SPORE-LOG 14d 無重複（最近 Geography spore 在 INBOX 是 大稻埕 + 西門町 兩條 pending，本 candidate 是 Wave 1 第三條補位，三條合起來 Geography 三件套 mini-cluster ready for ship cluster pacing）
  - **HG7 contribution**: EXISTING-ARTICLE (#1 of 2 EXISTING)
  - **HG8 contribution**: ✅ 趁熱 7d（5/21 ship 距今 7 天 — 5/28 是最後一天 ≤7d）

---

### 台灣 BIM 與營建科技 — 趁熱發明史 spore（5/22 NEW Wave 3 政府十二年 vs MCP 十八個月反差）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Technology/台灣BIM與營建科技.md](../../knowledge/Technology/台灣BIM與營建科技.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-05-28 by twmd-spore-pick-daily routine (score=30)
- **Hook anchor 候選**：
  1. **數字 hook**：「2014 年 5 月 23 日，行政院公共工程委員會掛『公共工程運用 BIM 推動平台』牌，八字方針『因案制宜、循序漸進』。十一年又七個月後，2025 年 12 月 10 日，一位在東京工作的台灣開發者把 REVIT_MCP_study 倉庫推上 GitHub — 七十三顆星、八十五個 fork。政府推不動的十二年，跟 Anthropic 一個十八個月的 protocol 之間」（直接抽 article 30 秒概覽變奏）
  2. **場景 hook**：「2014 年 5 月 23 日，公共工程委員會的掛牌典禮上，八字方針寫著『因案制宜、循序漸進』。沒有人說『強制』兩個字。十一年又七個月後，東京一個叫 CHIANG SHUOTAO 的台灣開發者按下 git push — 那是台灣 BIM 從工具升級到系統整合的轉折點，但不在政府推動平台的議程裡」
  3. **問句 hook**：「為什麼政府推了十二年的 BIM 還沒強制？為什麼一個十八個月的 protocol 反而正在改寫整個營建業？答案藏在 2014 年那八個字『因案制宜、循序漸進』跟 2025 年 12 月 10 日那次 git push 之間」
  4. **身份 hook**：「在台灣，大型工程公司的 BIM 工程師人數比建築師還多。但走過手繪藍圖、CAD 2D 圖、Revit 3D 模型、現在到 Model Context Protocol 對話式生成 — 這 20 年從工具升級到職業重定義的長路，外面的人很少聽過」
- **時效**：article ship 距今 6 天（5/22 Wave 3 NEW），趁熱窗口剩 ~8 天
- **敏感度**：低（建築技術 + 政府推動史 + 開源工具，中性技術主題）
- **必驗事實**：2014-05-23 行政院公共工程委員會「公共工程運用 BIM 推動平台」掛牌 / 八字方針「因案制宜、循序漸進」 / 2025-12-10 CHIANG SHUOTAO `REVIT_MCP_study` GitHub push / 七十三顆星 + 八十五個 fork（per article 註明數據時點） / 2026-04 Autodesk 公告 Revit 2027 內建 Model Context Protocol server / 中鼎工程 + 台灣世曦 / 台灣大學 BIM 研究中心 / 台灣建築資訊模型協會 / 新北市府第一張 BIM 建照 / 北市都發局竣工模型作業規範 / BSI 簽 Taiwan BIM Task Group MOU
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在，per ARTICLE-DONE-LOG 2026-05-22 Wave 3 singletons batch 6384 字 53 footnote 4 圖 ship — Wave 3 最大 footnote 密度）
- **預估發佈時機**：本週內（5/29-6/4 趁熱窗口）；可搭 #99/100 portaly 公開信後第三天 cool-down，避免 meta/技術連發過密
- **Notes**：
  - score=30 (D1=+30 ≤7d / D2=0 SC 未累積 / D3=0 / D4=0 Technology 不在 high_fanout set / D5=0 / D6=0 / D7=0)
  - reason: Wave 3 5/22 ship + 對應碩濤 (CTCI 中鼎工程 GitHub @shuotao) self-recommend 起點 — spore 可放大「政府推不動 vs 個人 push GitHub」反差敘事，配合作者本人 social distribution potential
  - 多語 fan-out 觸發判斷 = 高（BIM / Revit / Model Context Protocol 是國際營建 + AI 議題重疊大 cluster，en 對 Anthropic MCP + 營建業數位化最強 demand；ja 對東京工作的台灣開發者敘事有共鳴；ko 對 Autodesk 政策有 demand）
  - 國際 SEO 切入：「Taiwan BIM」「REVIT_MCP_study」「Model Context Protocol architecture」「Autodesk Revit 2027 MCP」
  - 配圖建議：article hero（FreeCAD 1.0 Dark Theme BIM workbench 截圖 Maxwxyz Wikimedia CC BY 4.0）或 GitHub repo screenshot fair-use editorial
  - Hook tier 自檢：避免 Tier 3「台灣 AI 革命」科技 vanity frame；用 article §策展人筆記「政府推不動的十二年 vs Anthropic 十八個月 protocol」反差 frame 起手 — 結構性敘事比英雄 narrative 更貼 article 精神
  - 跟 SPORE-LOG 14d 無重複（最近 Technology spore 是 #87/88 半導體產業 5/25、#89/90 雷亞遊戲 5/25、#92/94 大宇雙劍 5/26 — 全 Technology 但 hook type 差異 ✓；本 candidate 改數字反差/問句不撞）
  - **HG7 contribution**: EXISTING-ARTICLE (#2 of 2 EXISTING)
  - **HG8 contribution**: ✅ 趁熱 7d（5/22 ship 距今 6 天）

---

### 台灣媒體總史 — EVERGREEN-TOPIC spore（150 年五階段：清領教會報 → 自媒體 podcast）

- **Source-Mode**: `EVERGREEN-TOPIC`
- **Article-Path**: `none-yet`（屬於 [ARTICLE-INBOX §台灣媒體總史 NEW](../semiont/ARTICLE-INBOX.md) P0，2026-05-17 哲宇 directive spawn，~180 min 開發）
- **Priority**: `P3`（要等 article ship）
- **Status**: `pending`
- **Requested**: 2026-05-28 by twmd-spore-pick-daily routine (score=8)
- **Hook anchor 候選**（先列，等 article ship 後再校準）：
  1. **數字 hook**：「1885 年《台灣府城教會報》巴克禮在台南創刊 → 1898 台灣日日新報 → 1923 蔣渭水《台灣民報》→ 1949 三報禁（中央/中時/聯合 vs 黨外雜誌）→ 1988-01-01 報禁解除 → 1995 蕃薯藤 → 2000 PTT → 2010s Facebook → 2020s podcast。台灣媒體史 150 年，五個媒體形式的更替疊在同一座島上」
  2. **問句 hook**：「為什麼台灣最早的報紙是用白話字寫的台語？答案藏在 1885 年巴克禮從蘇格蘭把活字印刷帶進台南神學院那一刻 — 台灣媒體史的第一個音節不是漢字，是白話字台語」
  3. **場景 hook**（待 article ship 後校準）：「1885 年 7 月，台南神學院旁邊。巴克禮把蘇格蘭運來的活字一個一個排版印刷，《台灣府城教會報》第一期創刊號頭版用白話字台語寫著教會消息。140 年後台灣媒體生態還沒走完那一頁 — 從紙本到 podcast 五個階段，每一階段都有自己的言論戰場」
  4. **身份 hook**（待 article ship 後校準）：「你今天讀的 Threads / Facebook / podcast / Substack 屬於台灣媒體史第五階段。前四階段是清領教會報、日治新聞、戰後黨報、解嚴後自由化 — 同一座島從 1885 到 2026，150 年五階段每一階段都有人因為媒體被關押」
- **時效**：等 article ship（est. ARTICLE-INBOX P0 哲宇 directive 5/17 spawn，~180 min 開發，1-2 週可排上 baseline 6/4-6/10 window）
- **敏感度**：**中-高**（黨外雜誌史 + 媒體被收購（旺中/中時 etc.）+ 紅媒爭議 needs precision per MAINTAINER §爭議處理）— 以「媒體形式演化史 + 報紙 / 廣播 / 電視 / 網路 / 自媒體 五階段」literary frame 起手，政治含義由 1949 三報禁 / 1988 報禁解除 / 黨外雜誌 具體事實承擔；HG9 通過因為不涉及兩岸/228/戒嚴/統獨/中共/習近平 hardcoded set
- **必驗事實**（article ship 時校準，per ARTICLE-INBOX P0 必驗清單）：1885-07《台灣府城教會報》巴克禮創刊台南 / 1898 台灣日日新報 / 1923 台灣民報（or 1920 台灣青年） / 1949 報禁起始年份 vs 1988-01-01 報禁解除 / 雷震《自由中國》 / 1979 美麗島事件 / 廣電法修法時點 / 1993 廣播電視自由化 / 1995 蕃薯藤 / 1995 PTT 杜奕瑾（per 既有 People 條目） / 2000s Facebook 進入台灣時點 / 2020s podcast 興起
- **必先 spawn ARTICLE-INBOX entry**：✅ **已存在**（per [ARTICLE-INBOX §台灣媒體總史 NEW](../semiont/ARTICLE-INBOX.md) P0，2026-05-17 哲宇 directive spawn）
- **預估發佈時機**：article ship 後 7 天內趁熱
- **Notes**：
  - score=8 (D1=0 article 不存在 / D2=0 SC 未累積 / D3=0 / D4=+8 Society 不在 high_fanout 列表但「媒體史」對應國際媒體研究受眾 — judgment call / D5=0 / D6=0 / D7=0 mid-high 敏感但 hardcoded keyword set (兩岸/228/戒嚴/統獨/中共/習近平) 未直接命中)
  - HG7 contribution: **EVERGREEN-TOPIC** (#1 of 1) — 對應 #1 艋舺 + #2 台灣 BIM 兩條 EXISTING-ARTICLE 形成 2 mode mix ✓
  - HG9 borderline check: 媒體史 = 黨外雜誌 / 紅媒爭議敏感但 article ship 時 frame「150 年五階段媒體形式演化」literary mode 可避開政治正面對撞；非 REACTIVE 也通過 HG9
  - 多語 fan-out 觸發判斷 = 中-高（媒體史是國際傳播學受眾大 cluster；ja 對日治《台灣日日新報》/《台灣民報》（蔣渭水）有 demand / en 對白話字台語報紙 + 解嚴後 PTT/網路時代有 academic demand / ko 對 1988 報禁解除比較有政治轉型史 demand）— 對應 [MANIFESTO §主權的巴別塔](../semiont/MANIFESTO.md#我跟台灣的關係) sovereignty preservation infrastructure 在「媒體史」這個 cluster 的具體落實
  - 國際 SEO 切入：「Taiwan media history」「Taiwan Church News 1885」「Pe̍h-ōe-jī newspaper」「Taiwan press freedom 1988」
  - 配圖建議：article ship 時挑《台灣府城教會報》創刊號 fair-use editorial / 巴克禮肖像 Wikimedia / 1988 報禁解除歷史照
  - Hook tier 自檢：避免 Tier 3「黨外雜誌反抗」政治英雄 frame / 避免 Tier 3「台灣媒體自由排名」國族主義 frame；以「白話字 → 漢字 → 廣播 → 電視 → 網路 → 自媒體 形式演化」frame 起手，政治含義由 1949/1988/2020 具體年份承擔
  - 跟 SPORE-LOG 14d 無重複（媒體史類別 spore 缺；最近 Society spore 是 #79 寶島聯播網訪談 5/5 — 22 天前 ≫ 14d ✓）
  - article ship 後 routine 自動升級此 entry 為 EXISTING-ARTICLE + 補 Article-Path（per SPORE-INBOX §Routine intake 自動升級規則）

---

### 公視 — 28 年弧線 趁熱 REACTIVE spore（5/27 NEW ship + 5/7 議場驅逐事件）

- **Source-Mode**: `REACTIVE`
- **Article-Path**: [knowledge/Society/公視.md](../../knowledge/Society/公視.md)
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-01 by twmd-news-lens-weekly (week 2026-W22, event: 公視 article NEW ship 5/27 + 2026-05-07 立法院議場董事長驅逐)
- **Hook anchor 候選**：
  1. **數字 hook**：「1998 開播、23 年九億預算緊箍咒、養出 5 部旗艦劇（《我們與惡的距離》《茶金》《通靈少女》《麻醉風暴》《一把青》）、2023-05 修法翻倍到 23 億、19 個月後遭刪 1% 凍結 25%、2026-05-07 董事長被請出立法院議場。28 年下來公視證明的事：緊箍咒解開不代表獨立性建立」
  2. **場景 hook**：「2026 年 5 月 7 日早上，立法院教育委員會開議前。國民黨立委羅智強要求公視董事長胡元輝離席，理由是他已『任期屆滿』。文化部長李遠當場抗議，僵持後胡元輝起身走出議場。當天晚上他在臉書寫『個人遭遇事小，但公共媒體的尊嚴必須捍衛』。那一幕距離 1998-07-01 公視開播，剛好 28 年」
  3. **問句 hook**：「為什麼《我們與惡的距離》是公視做的、不是商業電視台？答案藏在 1998 那條被通過的法律裡 — 政府預算捐贈逐年遞減、最終凍結在每年 9 億，這條條文綁了 23 年，公視只能拿那點錢拍別人不敢拍的題材」
- **時效**：article ship 5/27 距今 5 天（趁熱窗口剩 ~9 天）+ 5/7 議場事件 25 天前仍是 active news anchor
- **敏感度**：**高**（媒體獨立 / 黨派預算政治 / 立法院衝突）— 必須用 article §策展人筆記 28 年弧線中性 frame 起手，不站隊任一政黨；REACTIVE 但**先講歷史弧線後落地新聞事件**，不直接 callout 個別立委姓名（footnote 已存記錄即可，spore 文體要克制）
- **必驗事實**：1998-07-01 公視開播 / 9 億預算 23 年緊箍咒 / 2023-05 修法解凍預算 23 億 / 19 個月後砍預算 1% 凍結 25% / 2026-05-07 議場驅逐董事長胡元輝 / 5 部旗艦劇片名 / 文化部長李遠抗議
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在）
- **預估發佈時機**：本週內（6/1-6/7 趁熱窗口疊 5/7 議場事件 anchor 仍活）
- **Notes**：
  - from news-lens weekly 2026-06-01 (event: 公視 5/27 ship + 5/7 議場驅逐事件 仍熱, GA #14: 32 views/26 users, no spore yet — Society cluster spore 缺位; CF AI crawler 對「Taiwan public broadcasting」議題感興趣)
  - 高敏感 REACTIVE 配 frame 規則：用 28 年歷史弧線敘事，不用「立委 X 違法驅逐」對抗 frame；hook 1/2/3 三條都從歷史結構切入再落地事件（per [二二八事件 entry §Notes](../factory/SPORE-INBOX.md) frame 範例）
  - 多語 fan-out 觸發判斷 = 中（en 海外讀者對 Taiwan public broadcasting 結構 / 與 PBS NHK BBC 對照有 demand；ja 對日治臺灣放送協會→戰後公視轉型有歷史 anchor；5 lang tx 待 ship 後 verify）
  - 配圖建議：article hero（公視 B 棟建築 2024 Yu tptw Wikimedia CC BY-SA 4.0）或 5 部旗艦劇 collage（fair-use editorial）
  - Hook tier 自檢：避免 Tier 3「公視又被欺負了」受害者 frame；用 article §28 年弧線中性結構 frame 起手
  - 跟 SPORE-LOG 14d 無重複（Society / 媒體 cluster spore 缺；最近 Society 大型 spore 是 #79 寶島聯播網訪談 5/5 — 27 天前 ≫ 14d ✓）

---

### 猴硐 — 鏡頭餵肥棄貓場 趁熱 REACTIVE spore（5/27 NEW ship + 2026-01 鏡週刊「滅村」框架反制）

- **Source-Mode**: `REACTIVE`
- **Article-Path**: [knowledge/Geography/猴硐.md](../../knowledge/Geography/猴硐.md)
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-01 by twmd-news-lens-weekly (week 2026-W22, event: 猴硐 article NEW ship 5/27 + 2026-01 鏡週刊 TNVR「滅村」框架報導)
- **Hook anchor 候選**：
  1. **場景 hook**：「2009 年攝影師簡佩玲（貓夫人）走進新北平溪線一座 1990 年瑞三鑛業停產後被遺忘 19 年的山城。她的鏡頭把猴硐變成 CNN 2013 評選的世界六大賞貓景點。但『貓咪天堂』這個名號養出全台最大棄貓場 — 2012 貓瘟、2013 至少 10 起虐貓、2022 棄貓案罰 11 萬。2014 貓夫人留下『不停消費貓、消費我、消費侯硐』退出」
  2. **數字 hook**：「貓口從 200-300 隻 → 2026-01 剩 30+ 隻。鏡週刊用『滅村』兩個字當標題框架。但消失的不是貓村 — 是『單一網紅 IP 撐起的地方創生模式』。TNVR 把貓口控制到可承載量，是收尾，不是失敗」
  3. **問句 hook**：「鏡頭可以救起一座礦業遺址，也可以餵肥一座棄貓場。誰要負責收尾？2009 走進來的攝影師、2013 把名字傳出去的 CNN、2014 退出的貓夫人、2024 設貓公所的光復里里長、2026 用『滅村』兩字下標的鏡週刊 — 17 年來，這道題沒有單一答案」
- **時效**：article ship 5/27 距今 5 天（趁熱窗口剩 ~9 天）+ 2026-01 鏡週刊報導留下「滅村」反差 frame 仍有反駁空間
- **敏感度**：中（地方創生 / 動保政策 / 在地產業利益）— 不踩動保倡議或商業反 TNVR 任一立場，以 article §反身性悖論 frame 起手（鏡頭救起 / 鏡頭餵肥 / TNR 收尾的三段反身結構）
- **必驗事實**：1990-05-01 瑞三鑛業瑞山本坑關閉 / 2009 貓夫人走進光復里 / 2013 CNN 世界六大賞貓景點 / 2012 貓瘟 / 2013 至少 10 起虐貓事件 / 2022 棄貓案罰 11 萬 / 2014 貓夫人退出聲明原文 / 2024 貓公所成立 / 2026-01 鏡週刊滅村框架報導 / TNVR 200-300 隻 → 30+ 隻
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在）
- **預估發佈時機**：本週內（6/1-6/7 趁熱窗口，可搭五月底動保話題或六月初端午連假觀光討論）
- **Notes**：
  - from news-lens weekly 2026-06-01 (event: 猴硐 5/27 ship + 2026-01 鏡週刊滅村報導 反制 frame 機會, GA: 暫未進 top 15 但 Geography 5/27 三件套 cluster 一起趁熱)
  - 中敏感 REACTIVE，frame 用 article D anchor「反身性悖論」三段結構（鏡頭救起 / 鏡頭餵肥 / TNR 收尾），不寫「貓村已死」哀悼或「TNR 大勝利」勝利兩極
  - 多語 fan-out 觸發判斷 = 高（ja 對日本田代島 / 青島貓島平行對照有 demand；en 對地方創生 + tourism overshoot 國際案例研究有 academic demand；5 lang tx 已 baseline）
  - 配圖建議：article hero（基隆河猴硐段 CharlieDigital Wikimedia CC BY-SA 4.0）或瑞三鑛業整煤廠遺址（fair-use editorial）
  - Hook tier 自檢：避免 Tier 3「貓村再見」悲情 frame 或「TNR 成功」宣傳 frame；用 article D anchor 反身性悖論 frame 起手
  - 跟 SPORE-LOG 14d 無重複（Geography 大 cluster 最近 spore 是 #87/88 大稻埕 + #89/90 西門町 + #91 艋舺 5/25 — 但都是台北歷史街區 cluster，猴硐是聚落+動保獨立 sub-cluster ✓）

---

### 天燈 — 200 年身分 趁熱 spore（5/27 NEW ship + 326 公斤環境災難 anchor）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Culture/天燈.md](../../knowledge/Culture/天燈.md)
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-01 by twmd-news-lens-weekly (week 2026-W22, event: 天燈 article NEW ship 5/27 + 2019 326 公斤環境災難仍是國際媒體 frame)
- **Hook anchor 候選**：
  1. **數字 hook**：「1820 年代第一盞報平安的天燈 → 2019 元宵節隔天 326 公斤殘骸 → 2025 自治條例三讀通過。200 年從報平安信號到山林垃圾，主旋律是同一群平溪人扛兩個身分 — 天燈協會理事長姓胡，房子被燒毀的受害者也姓胡，老街攤商蔡媽媽跟基隆河守護聯盟陳建志喝同一條溪的水」
  2. **場景 hook**：「2019 年 2 月 19 日清晨，元宵節隔天。25 名美國志工跟著 Taiwan Adventure Outings 進入平溪鐵道周邊。兩小時，他們從竹林、河谷、軌道兩側撿出 326.15 公斤的天燈殘骸 — 鐵絲扭曲的支架、被雨打濕的紙糊、燒到一半的金紙、菸盒。Taipei Times 那篇報導被 BBC、衛報、紐約時報、法新社援引，『環境災難』這個標籤從此釘上平溪」
  3. **問句 hook**：「胡氏家族 200 年前在十分寮放出第一盞天燈，給躲到山上的家人看『土匪走了』。同一個姓今天扛兩個身分 — 天燈協會理事長胡民樹、72 歲房子被燒毀的胡維銘。一個賺、一個賠、整村清。為什麼 200 年後同一個信號變成同一個家族的雙面？」
  4. **身份 hook**：「下次在平溪放天燈的時候，記得那不是觀光景點發明的儀式 — 是 1820 年代胡氏家族避難山林的求生通訊，200 年後變成 326 公斤殘骸的環境難題，也變成在地產業、受害者、環團、下一代四方 50 年議題」
- **時效**：article ship 5/27 距今 5 天（趁熱窗口剩 ~9 天）+ 2025-12 自治條例公告 + 2026 罰則生效日期可作 anchor
- **敏感度**：低-中（環境議題 + 在地產業利益 + 文化資產）— 用 article §四方並陳結構 frame（產業派 / 受害者派 / 環團派 / 下一代派），不站隊
- **必驗事實**：1820 年代胡氏家族在十分寮放第一盞天燈 / 1988 觀光化 / 2013 CNN 世界 52 必去 / 2016 國家地理 全球十大冬季旅遊 / 2019-02-19 元宵隔天 326.15 公斤 / 2019-06 胡維銘 72 歲房子被燒 / Taipei Times Davina Tham 報導 / 2025 自治條例 / 2026 罰則生效
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在）
- **預估發佈時機**：本週內（6/1-6/7 趁熱），可搭端午（6/19）前環境永續觀光話題前置 buffer
- **Notes**：
  - from news-lens weekly 2026-06-01 (event: 天燈 5/27 ship + 2019 326 公斤事件 + 2025 自治條例 三層 anchor 仍熱)
  - 中敏感配 frame 規則：用 article §四方並陳（產業/受害者/環團/下一代），不二元化
  - 多語 fan-out 觸發判斷 = 極高（天燈是台灣最強國際 SEO 文化符號之一，en/ja/ko 對 sky lantern Taiwan / Pingxi 搜尋量高，2019 326kg 事件英文媒體大量引用，海外讀者有 first-person 角度 demand；5 lang tx 已 baseline）
  - 配圖建議：article hero（Jirka Matousek 平溪天燈節 2014 Wikimedia CC BY 2.0）或 326 公斤殘骸 Taipei Times 報導圖（fair-use editorial 標明出處）
  - Hook tier 自檢：避免 Tier 3「天燈污染必須禁」環團 advocacy frame 或「天燈很美 must-visit」觀光手冊 frame；用 article 四方並陳結構 frame 起手
  - 跟 SPORE-LOG 14d 無重複（Culture / 節慶 cluster spore 缺，最近 Culture spore 是 #51-54 4 月底 — 30+ 天前 ≫ 14d ✓）

---

### 台灣藍鵲 — SC 缺口 REACTIVE spore（SC 215 imp / 0 click / position 2.35 高 demand 低 ranking 補位）

- **Source-Mode**: `REACTIVE`
- **Article-Path**: [knowledge/Nature/台灣藍鵲.md](../../knowledge/Nature/台灣藍鵲.md)
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-01 by twmd-news-lens-weekly (week 2026-W22, event: SC top opportunity 7d 「台灣藍鵲」215 impressions / 0 clicks / position 2.35 / 無對應 spore push reach)
- **Hook anchor 候選**：
  1. **問句 hook**：「為什麼 2007 年那場國鳥選舉 18 萬票投給台灣藍鵲不是黑面琵鷺？答案不是因為牠藍得漂亮 — 是因為這顆山林寶石會打群架。97% 的巢用『巢邊幫手制』集體育雛，家族成員會發動空襲護巢，比黑面琵鷺更像台灣」
  2. **數字 hook**：「1862 年英國領事郇和在淡水收到兩根亮藍色尾羽，憑羽毛末端的白點判斷是新種。164 年後台灣藍鵲面臨外來種紅嘴藍鵲基因污染、3 隻搶食大安森林公園貓糧、巢邊幫手制 97% 適用率 — 從中低海拔闊葉林進駐到都市叢林的『藍色幫派』」
  3. **場景 hook**：「清晨六點，大安森林公園靠近建國南路那側。三隻台灣藍鵲低空俯衝，搶走志工剛擺好給流浪貓的乾糧。牠們不是迷路 — 牠們是進城。從中低海拔闊葉林到都市叢林，藍色幫派的領域版圖正在改寫」
  4. **身份 hook**：「你以為國鳥是黑面琵鷺？2007 年 18 萬票選的是台灣藍鵲。下次在公園看到那道藍色閃光，記得那不是流浪鳥 — 是一個 97% 巢邊幫手制的家族在巡邏」
- **時效**：non-time-sensitive 但 SC 215 imp 7d 顯示有人正在 actively 搜尋；越早 push reach 越好補位
- **敏感度**：低（特有種保育 / 國鳥討論中性）
- **必驗事實**：1862 郇和（Robert Swinhoe）在淡水採集首個標本 / 2007 國鳥票選 18 萬票 / 巢邊幫手制 97% 適用率 / 紅嘴藍鵲基因污染議題 / 大安森林公園都市進駐 / 鄒族布農族傳說 / 學名 Urocissa caerulea 台灣特有種
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在 4/30 ship）
- **預估發佈時機**：本週內（6/1-6/7）— SC 缺口越快補越好，無時間窗口限制
- **Notes**：
  - from news-lens weekly 2026-06-01 (event: SC 7d 「台灣藍鵲」215 impressions / 0 clicks / position 2.35 — Top SC opportunity #1, 無對應 spore push reach; article 4/30 ship 後 32 天無 spore)
  - 低敏感無 frame 限制
  - 多語 fan-out 觸發判斷 = 高（Taiwan Blue Magpie 是國際 birdwatching cluster 強 SEO 詞，en 對 endemic bird species 有 demand，ja 對台湾固有種 / 観光鳥類 有需求；5 lang tx 待 verify baseline）
  - 配圖建議：article hero（Wikimedia 台灣藍鵲特寫，多張 CC 授權可用）或大安森林公園都市進駐場景
  - Hook tier 自檢：避免 Tier 3「國鳥！台灣之光！」民族主義 frame；用 article §巢邊幫手制 + 都市進駐 結構 frame 起手
  - 跟 SPORE-LOG 14d 無重複（Nature cluster 最近 spore 是 #54 黑冠麻鷺 4/30 — 32 天前 ≫ 14d ✓）

---

### 李國修 — SC 高曝光人物 EXISTING-ARTICLE spore（SC 596 imp / 6 clicks / CTR 1.01% / position 1.93 高 demand 但 metadata 失效）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/People/李國修.md](../../knowledge/People/李國修.md)
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-01 by twmd-news-lens-weekly (week 2026-W22, event: SC top query 7d 「李國修」596 impressions / 6 clicks / CTR 1.01% / position 1.93 — 已第二名但 CTR 偏低 = title/description metadata 失效，spore 補 reach + 順便 review metadata)
- **Hook anchor 候選**：
  1. **數字 hook**：（待 article ship 時校準）「屏風表演班 24 年（1986-2010）/ 27 部原創舞台劇 / 2013-07-02 直腸癌 58 歲早逝。從『有個結巴的孩子，在劇場找到了聲音』那一年算起到今天 39 年，台灣劇場有他、跟沒他，是兩個世界」
  2. **問句 hook**（待 article ship 時校準）：「為什麼台灣本土喜劇有屏風表演班、表演工作坊兩條根？答案藏在 1980 年代蘭陵劇坊那批人各自離開後選擇的路線分歧 — 賴聲川走實驗 / 李國修走本土民間，這兩條路後來都成了台灣劇場的主幹」
  3. **場景 hook**（待 article ship 時校準）：「1986 年 10 月，西門町。剛從蘭陵離隊的李國修跟劉若瑀、李立群在一個地下室開了屏風表演班。第一齣戲票房慘淡，三人坐在台下發呆。誰也沒想到這個地下室後來會養出 27 部原創、《京戲啟示錄》《女兒紅》《半里長城》三大代表作」
  4. **身份 hook**：「你聽過《京戲啟示錄》？那是李國修。看過《女兒紅》？那是他。屏風表演班、京劇之外的台灣本土喜劇大半個傳統，是這個結巴男孩 24 年用 27 部原創撐出來的 — 58 歲走的時候，台灣劇場一夜空了一塊」
- **時效**：non-time-sensitive 但 SC 596 imp 7d 顯示有人 actively 搜尋名字；CTR 1% = 標題吸引力低，spore push 直接 reach 比優化 metadata 更快
- **敏感度**：低（已故文化人物 / 劇場史中性）
- **必驗事實**（**HG: 必須先讀 article 校準**，article 內容可能跟此處草稿不一致）：李國修生卒年 / 屏風表演班創立年（1986）/ 27 部原創數字 / 京戲啟示錄 / 女兒紅 / 半里長城 三大代表作確認 / 蘭陵劇坊出身 / 2013-07-02 直腸癌離世
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在）
- **預估發佈時機**：本週內（6/1-6/7）— SC 高 demand 越早 push 越好；可搭順便 review 標題/description 是否需要 SEO 校準（CTR 1.01% 是 metadata 警訊）
- **Notes**：
  - from news-lens weekly 2026-06-01 (event: SC 7d 「李國修」596 impressions / 6 clicks / position 1.93 — 已排名第二但 CTR 1.01% 偏低，metadata 可能失效；spore 補 reach 同時 trigger metadata review)
  - 低敏感無 frame 限制
  - **SEO 副作用提示**：Stage 1 PICK 抽到此 entry 時，建議同時跑 [knowledge/People/李國修.md](../../knowledge/People/李國修.md) 的 title/description SEO review（CTR 1.01% 是 metadata 失效 signal，per EVOLVE-PIPELINE §SEO 優化判準）
  - 多語 fan-out 觸發判斷 = 中（People cluster；ja 對台湾劇場史 + 賴聲川對照有 demand；5 lang tx 待 verify baseline）
  - 配圖建議：article 既有圖（若有）或屏風表演班海報 fair-use editorial / 李國修舞台照
  - Hook tier 自檢：避免 Tier 3「台灣喜劇之神」神化 frame；用 article 結構 frame 起手 — Stage 1 PICK 前必須先 Read article 才能定 hook 細節
  - 跟 SPORE-LOG 14d 無重複（People cluster 最近 spore 是 #95/96 尹衍樑 5/26 + #91 江賢二 5/25 + #94 大宇雙劍創辦人段 5/26 — 14d 內 People 已 3 條，但李國修是劇場/喜劇 sub-cluster 跟 Tech 創辦人 / 視覺藝術家 sub-cluster 不撞 ✓）

---

### 洪醒夫 — SC 已 #1 排名 補位 EXISTING-ARTICLE spore（SC 237 imp / 7 clicks / CTR 2.95% / position 1.14 排名第一但流量天花板）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/People/洪醒夫.md](../../knowledge/People/洪醒夫.md)
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-01 by twmd-news-lens-weekly (week 2026-W22, event: SC top query 7d 「洪醒夫」237 impressions / 7 clicks / CTR 2.95% / position 1.14 — 已排名第一但 CTR < 5% 顯示 SERP click 流量被 Wikipedia / 教科書摘要切走，spore 補社群 reach)
- **Hook anchor 候選**（**待 article ship 時校準**，下方為草稿）：
  1. **場景 hook**：「1982 年 7 月 31 日下午，台一線員林段。洪醒夫的車對撞翻覆。33 歲的鄉土小說家當場辭世。他留下的《田莊老師之死》《散戲》《市井傳奇》是 1970-80 年代台灣鄉土文學最完整的鄉村塑像之一」
  2. **數字 hook**：「33 歲離世、4 本短篇小說集、12 篇代表作。鄉土文學論戰 1977 那批人裡，黃春明、王禎和、陳映真、宋澤萊都還在，洪醒夫是唯一沒走完那場辯論的」
  3. **問句 hook**：「為什麼國中課本〈散戲〉印象那麼深？答案藏在洪醒夫寫法的克制 — 他不寫鄉村悲情，他寫鄉村做為勞動、生死、人情交織的場域，這是宋澤萊《打牛湳村》以外另一條鄉土寫實的路」
  4. **身份 hook**：「你讀過國中課文〈散戲〉？那是洪醒夫，33 歲在台一線員林段車禍走的鄉土小說家。他留下的書比他活的歲數多 — 4 本短篇集、12 篇代表作，1977 鄉土文學論戰那批人少數沒走完辯論的一個」
- **時效**：non-time-sensitive 但 SC 237 imp 7d 顯示穩態搜尋量；7/31 忌日將至（55 天後）可作 anchor preview，但本 spore 不一定要綁忌日
- **敏感度**：低-中（鄉土文學論戰可能踩政治；用文學作品 anchor 中性處理）
- **必驗事實**（**HG: 必須先讀 article 校準**）：洪醒夫生卒年（1949-1982）/ 1982-07-31 車禍地點台一線員林段 / 享年 33 歲 / 4 本短篇小說集名稱 + 出版年 / 12 篇代表作或主要篇目 / 1977 鄉土文學論戰參與 / 黃春明 王禎和 陳映真 宋澤萊 同代脈絡
- **必先 spawn ARTICLE-INBOX entry**：❌（article 已存在）
- **預估發佈時機**：本週內（6/1-6/7）— SC 穩態搜尋越早 push 越好；7/31 忌日 anchor 可作後續 SPORE 第二輪 plan
- **Notes**：
  - from news-lens weekly 2026-06-01 (event: SC 7d 「洪醒夫」237 impressions / 7 clicks / position 1.14 — 已排名第一但 CTR < 5% = SERP click 被 Wikipedia / 教科書摘要切走; spore 直接 push 社群 reach 比 SEO 優化更直接)
  - 中敏感（鄉土文學論戰）用文學作品 anchor 中性處理
  - **多語 fan-out 觸發判斷** = 低-中（People / Literature；國際 demand 不如政治文化人物高，但 ja 對台湾鄉土文學 1970s 比較研究有 academic 受眾）
  - 配圖建議：article 既有圖（若有）/《田莊老師之死》或《散戲》書影 fair-use editorial / 洪醒夫肖像（若 CC 授權可得）
  - Hook tier 自檢：避免 Tier 3「鄉土文學大師」神化 frame；用 article 結構 frame 起手 — Stage 1 PICK 前必須先 Read article 才能定 hook 細節
  - 跟 SPORE-LOG 14d 無重複（People 文學 sub-cluster 缺；最近 People spore 都集中在企業家 / 藝術家 / 音樂人，文學人物 spore 上次 #N 暫無近期記錄）

### 張懸與安溥 — SC 高 demand EXISTING-ARTICLE spore（雙名身份穩態搜尋）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: knowledge/Music/張懸與安溥.md
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-07 by twmd-news-lens-weekly (week 2026-W23, event: SC 7d 焦安溥 264 imp pos 10.17 + 張懸 463 imp pos 10.78 雙 query 高曝光低排名 + GA 7d 96 v 持續黏著)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式 — 起手式 5 種：好奇 / 場景 / 問句 / 數字 / 身份）:
  1. **數字 hook**：「727 個人這週用『張懸』或『焦安溥』搜尋找她，全部停在 Google 第 10 頁——一個人改名 12 年，搜尋引擎還沒接到通知」
  2. **身份 hook**：「她叫焦安溥。2012 年改名之前叫張懸。改名之後出了三張專輯，但你最後一次循環的還是〈寶貝〉」
- **時效**: 本週內（趁 SC 雙 query 高 impression 窗口 + 6 月音樂節季啟動）
- **敏感度**: 中（改名涉及身份政治、2013 國旗事件背景需謹慎不踩；用音樂作品 anchor 中性處理）
- **必驗事實**（**HG: 必須先讀 article 校準**）：改名年份 2012 / 改名前三張專輯名與年份 / 改名後作品 / 1981 出生年 / 焦仁和家系 / 2013 曼徹斯特事件 frame
- **必先 spawn ARTICLE-INBOX entry**: ❌（article 已存在）
- **預估發佈時機**: 本週內（6/7-6/13）— 趁 SC 雙 query peak
- **Notes**:
  - from news-lens weekly 2026-06-07 (event: SC 7d 727 combined impressions / GA 7d 96 v / 上次 spore > 8 週 gap)
  - 中敏感（身份 / 國旗事件）用作品 anchor 不踩政治
  - 配圖建議：article 既有圖 / 〈寶貝〉或〈玫瑰色的你〉作品封面 fair-use editorial
  - Hook tier 自檢：避免 Tier 3「靈魂歌手」神化 frame；用改名作為 anchor 切入身份問題
  - SPORE-LOG 近 30 d 無重複（最近一次「張懸/安溥」spore 在 4 月之前）

### 台灣邦交國與國際外交 — SC EN 強 demand REACTIVE spore（2026 邦交清單英文世界搜尋）

- **Source-Mode**: `REACTIVE`
- **Article-Path**: knowledge/Society/台灣邦交國與國際外交.md
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-07 by twmd-news-lens-weekly (week 2026-W23, event: SC 7d EN 3 query 同 intent cluster — taiwan diplomatic allies 2026 70 imp pos 8.63 + taiwan diplomatic allies list 2026 67 imp pos 7.55 + 台灣什麼時候退出聯合國 55 imp pos 9.78 + GA 7d 58 v)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **數字 hook**：「台灣有 12 個邦交國 + 113 個館處 + 177 國可以免簽——三個數字加起來，比邦交國數量本身更能說明台灣的位置」
  2. **問句 hook**：「為什麼這週有 137 個人用英文搜尋『台灣的邦交國有哪些 2026』？因為英文世界沒有一份穩定的清單——大部分百科還停在 2020 年的數字」
- **時效**: 7 天內（SC EN 三 query 同週 peak，國際讀者主動找 2026 update）
- **敏感度**: **高（兩岸 / 外交）— REACTIVE 模式 frame 規則**:
  - 用 12+113+177 三數字並列 frame（邦交國數字單獨容易被框成 isolation narrative）
  - 不喊「中國打壓」也不喊「邦交雪崩」— 用「113 個館處 = 實質外交」陳述事實
  - 不選邊「兩岸誰主動」— 焦點放在「台灣怎麼在 12 個邦交以外保持 177 國免簽流動」
- **必驗事實**（**HG: 必須先讀 article 校準**）：12 邦交國名單與洲別分布 / 113 個館處正式名稱範圍 / 177 國免簽 vs 落地簽 vs eVisa 區分 / 2026 最近一次邦交變動年月 / 退出聯合國年份 1971
- **必先 spawn ARTICLE-INBOX entry**: ❌
- **預估發佈時機**: 本週內（趁 SC EN cluster peak）— ja/en 雙 fan-out 評估
- **Notes**:
  - from news-lens weekly 2026-06-07 (event: SC 7d EN 137 combined impressions, 全 0 click position 7-10 = SERP 完全沒接到; GA 7d 58 v 持續中文流量; CF 7d AI crawlers ChatGPT-User 12896 + Bing 10602 高度關注台灣議題)
  - 高敏感（兩岸 / 外交）— REACTIVE 必須 frame 規則明示如上
  - 多語 fan-out 觸發判斷 = 高（英文世界 demand 已直接量化；ja 對台灣國際地位有持續 academic 關注；es/fr 中南美邦交 cluster 相關度高）
  - 配圖建議：12 邦交國洲別分布地圖 / 113 館處 / 177 免簽 三層地圖對照
  - Hook tier 自檢：避免 Tier 3「孤立的台灣」框架；用三數字並列 reframe「在 12 個正式邦交之外，台灣怎麼活著」

### 阿神 — SC 高 demand EXISTING-ARTICLE spore（YouTuber 本名查詢穩態）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: knowledge/People/阿神.md
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-07 by twmd-news-lens-weekly (week 2026-W23, event: SC 7d 阿神本名 191 imp / 5 clicks / pos 3.48 + GA 7d 29 v / 從未 spore'd)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **問句 hook**：「『阿神本名』這週 191 個人搜尋——大部分人知道他是 Minecraft 神，但記不得他叫沈尚甫」
  2. **數字 hook**：「2008 年第一支 Minecraft 影片 → 2026 年累積訂閱 X 百萬，阿神是台灣 YouTube 早期到當代少數沒斷的個人頻道」
- **時效**: 7 天內（SC「阿神本名」穩態 demand 趁熱回應）
- **敏感度**: 低（個人 creator / 無政治）
- **必驗事實**（**HG: 必須先讀 article 校準**）：本名沈尚甫（per article 確認）/ 出生年 / Minecraft 起點年份 / 累積訂閱與影片數 / 公司化進程 / 與其他早期遊戲 YouTuber 同期譜系
- **必先 spawn ARTICLE-INBOX entry**: ❌
- **預估發佈時機**: 本週內
- **Notes**:
  - from news-lens weekly 2026-06-07 (event: SC 7d 191 impressions pos 3.48 = 已排名近頂但 CTR 2.62% < 5% = SERP click 被 nicknyfun 個人資料站切走; GA 7d 29 v; 從未 spore'd)
  - 低敏感（gaming / YouTuber）
  - 多語 fan-out 觸發判斷 = 低（en 對台灣 gaming creator 興趣有限；ja gaming community 可能感興趣）
  - 配圖建議：article 既有圖 / Minecraft 經典場景 fair-use editorial
  - Hook tier 自檢：避免 Tier 3「神級 YouTuber」神化 frame；用本名 + 數據作為 anchor

### 魏哲家 — TSMC current events EXISTING-ARTICLE spore（GA viral + 半導體時事）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: knowledge/People/魏哲家.md
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-07 by twmd-news-lens-weekly (week 2026-W23, event: GA 7d 30 v 持續黏著 + 半導體 current events 2026 H1 TSMC 美國 fab 與 CoWoS 產能爭議 + 接班議題持續發酵 / 從未 spore'd)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **場景 hook**：「1953 年新竹出生，交大電子，耶魯博士。2018 接張忠謀的椅子，2024 同時掛董事長 + 總裁——台積電六十年第三個人坐這位子」
  2. **數字 hook**：「魏哲家年薪台幣多少？答案不只一個——TSMC 高管薪酬結構說明台灣製造業頂層怎麼計算工程師人生」
- **時效**: 7 天內（趁 TSMC 季報 / 美國 fab / Trump 關稅持續 news cycle）
- **敏感度**: 中（產業 / 美中科技戰背景需謹慎不踩政治站隊）
- **必驗事實**（**HG: 必須先讀 article 校準**）：1953 出生 / 交大電子大學 + 耶魯 EE 博士 / TI / Singapore TSMC 經歷 / 2018 接 CEO / 2024 同時掛董事長 + 總裁年份 / 重要決策時刻
- **必先 spawn ARTICLE-INBOX entry**: ❌
- **預估發佈時機**: 本週內（趁 TSMC 6 月股東會後續 news cycle）
- **Notes**:
  - from news-lens weekly 2026-06-07 (event: GA 7d 30 v 排名 16 持續存在 + TSMC 2026 H1 current events 持續發酵 + 從未 spore'd; CF 7d AI crawlers ChatGPT-User 12896 highly active on TW tech topics)
  - 中敏感（半導體 / 美中科技戰）— 用工程師背景 + 在地 anchor，不踩美中政治
  - 多語 fan-out 觸發判斷 = 中-高（en 半導體 industry 受眾持續關注 TSMC 接班；ja 半導體 cluster 興趣高）
  - 配圖建議：article 既有圖 / 公開新聞照 fair-use editorial / TSMC 廠房不適合（版權問題）
  - Hook tier 自檢：避免 Tier 3「半導體教父」神化 frame；用具體年份 + 學歷軌跡 anchor

### 楊致遠 — GA viral 持續 EXISTING-ARTICLE spore（Yahoo 創辦人時代記憶）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: knowledge/People/楊致遠.md
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-07 by twmd-news-lens-weekly (week 2026-W23, event: GA 7d 31 v 持續黏著 + 從未 spore'd / Yahoo 在 2024-2025 重組後仍持續成為 internet history 議題)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **場景 hook**：「1968 年台南出生，10 歲移民加州，只會一個英文單字。1994 年史丹佛博班肯不下去，跟同學在校園做了一份『Jerry and David's Guide to the World Wide Web』」
  2. **問句 hook**：「為什麼 Yahoo 沒接住 Google？答案是 2002 年楊致遠拒絕了 Page 跟 Brin 30 億美元的併購提案——四年後他要花 90 億才能回頭」
- **時效**: 本週內（GA 7d 持續黏著，無特定 event 但 internet history narrative 永恆有市場）
- **敏感度**: 低（matter of historical record）
- **必驗事實**（**HG: 必須先讀 article 校準**）：1968 出生地與年份 / 10 歲移民年份 / 1994 Yahoo 起源於史丹佛 / 2002 Google 併購提案金額與年份 / 2008 微軟併購提案 / 2017 阿里巴巴股權結算 / 台南背景與華語身份
- **必先 spawn ARTICLE-INBOX entry**: ❌
- **預估發佈時機**: 本週內或下週
- **Notes**:
  - from news-lens weekly 2026-06-07 (event: GA 7d 31 v + article 30d top 15 持續黏著 + 從未 spore'd; SC 直接 query 弱但 internet history 持續 cluster demand)
  - 低敏感（historical / 商業故事）
  - 多語 fan-out 觸發判斷 = 中-高（en 對 Yahoo 創辦人有 sustained internet history 興趣；ja/ko 對 dot-com era 台灣裔企業家有市場）
  - 配圖建議：article 既有圖 / Yahoo 早期 logo / Jerry Yang 公開新聞照 fair-use editorial
  - Hook tier 自檢：避免 Tier 3「網路傳奇」神化 frame；用具體年份 + 決策 anchor

### 臺灣漫遊錄 — GA 30d top non-homepage EXISTING-ARTICLE spore（Booker 翻譯 arc 持續發酵）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: knowledge/Art/臺灣漫遊錄.md
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-07 by twmd-news-lens-weekly (week 2026-W23, event: GA 30d 1749 v = top non-homepage article + GA 7d 46 v 持續 + 2024 Booker arc 持續發酵 / 上次 spore 5/23 已 > 14 day gap)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **數字 hook**：「《臺灣漫遊錄》這 30 天有 1749 個人在 Taiwan.md 讀——是除了首頁以外流量最高的文章。一本『妹妹翻譯的書』把楊雙子從春山推到倫敦領獎台」
  2. **場景 hook**：「2024 年 5 月，國家圖書館外面下雨。楊雙子上台領 Booker 國際獎，致謝詞用台語講。台下那本書的英譯本封面寫著『a novel by Yang Shuang-Zi, translated by Lin King』」
- **時效**: 本週內（GA 持續 top 1，Booker 1 週年 5 月已過但 paperback / 教學 demand 持續）
- **敏感度**: 低（文學 / 翻譯研究）
- **必驗事實**（**HG: 必須先讀 article 校準**）：2024 Booker 國際獎得獎年份 / 楊雙子本名與雙胞胎背景 / Lin King 譯者 / 春山出版年份 / 書中虛構日治旅遊作家設定 / 原版 vs 譯本差異
- **必先 spawn ARTICLE-INBOX entry**: ❌
- **預估發佈時機**: 本週內（趁 GA 持續 top 1 + 暑假 reading list 季啟動）
- **Notes**:
  - from news-lens weekly 2026-06-07 (event: GA 30d 1749 v = #1 non-homepage / GA 7d 46 v / 上次 spore 5/23 距今 15 day > 14 day gate; SC 中文 query 弱但 GA 黏著證明站內讀者高度關注)
  - 低敏感（文學 / 翻譯）
  - 多語 fan-out 觸發判斷 = 高（en Booker 國際獎 sustained 受眾；ja 對台灣日治文學持續 academic 興趣；ko 對日治殖民史敘事 cluster 相關）
  - 配圖建議：article 既有圖 / 春山版書影 + Graywolf Press 英譯版書影 並陳 fair-use editorial
  - Hook tier 自檢：避免 Tier 3「Booker 國際獎肯定」純獎項 frame；用「妹妹翻譯的書」敘事性 anchor

---

### 蘇打綠 — 6/9 EVOLVE 趁熱 EXISTING-ARTICLE spore（22 年法律戰收回自己的名字）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Music/蘇打綠.md](../../knowledge/Music/蘇打綠.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-06-13 by twmd-spore-pick-daily routine (score=38)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **場景 hook**：「2001 年 5 月，政大金旋獎舞台，四個學生用一首〈窺〉拿下樂團組最佳人氣獎。22 年後的小巨蛋，主唱深吸一口氣才喊得出『我們是蘇打綠！』，那是一場打了四年的商標訴訟結束的瞬間」
  2. **數字 hook**：「蘇打綠走完 22 年才學會一件事：台灣 indie 樂團出道第一件事，是先把團名註冊起來。中間有金曲獎五座、韋瓦第四部曲走遍北京柏林、2017 自由廣場兩萬人合唱、然後 2019 被告上法庭」
  3. **身份 hook**：「你皮夾裡那張《冬 未了》——它讓蘇打綠在第 27 屆金曲獎一口氣抱走五座，但團名打官司的那四年，這張專輯的版稅是誰收的？」
- **時效**: 7-10 天內（article 6/9 ship 趁熱窗口 D+4，剩 ~10 天）
- **敏感度**: 低（樂團故事 / 商標訴訟已和解）
- **必驗事實**（HG：必須對 article 校準）：2001 年 5 月政大金旋獎第 18 屆 / 主唱吳青峰中文系 / 2003 年 7 月貢寮海洋音樂祭被林暐哲發掘 / 第 27 屆金曲獎《冬 未了》拿五座 / 2017 自由廣場兩萬人 / 2019 訴訟開始 / 2023 年小巨蛋宣告結束 / 六位團員學科背景五系所兩所大學 / 林暐哲音樂社 5/30「蘇打綠日」
- **必先 spawn ARTICLE-INBOX entry**: ❌（article 已存在）
- **預估發佈時機**: 本週內（D+4 至 D+10 窗口）
- **Notes**:
  - score=38 (D1=+30 D2=+0 D3=+0 D4=+8 D5=+0 D6=+0 D7=+0); non_zero=2 / HG10 PASS
  - 來源：routine pick / D1 趁熱 6/9 EVOLVE ship + D4 Music 高 fan-out 類別（trans 5/5 已 done）
  - 多語 fan-out 觸發判斷 = 高（en 對 indie 樂團商標訴訟 + 韋瓦第四部曲跨國 tour 有 sustained 興趣；ja/ko 對林暐哲音樂社 + 韋瓦第計畫北京柏林版本有歷史 anchor）
  - 配圖建議：article hero（2014 蘇打綠 10 周年世界巡迴 Solomon203 Wikimedia CC BY-SA 4.0）
  - Hook tier 自檢：避免 Tier 3「神級樂團」神化 frame；用 22 年弧線 + 商標訴訟 anchor，故事張力在「樂團學會的第一件事卻是法律」
  - 跟 SPORE-LOG 14d 無重複（最近 Music spore 是 #132/#133 嘻哈與饒舌發展 6/9 — 同日不同 cluster ✓）

---

### 莫那魯道 — 6/11 EVOLVE 趁熱 EXISTING-ARTICLE spore（二十元硬幣三層尷尬與沒有中國沒有日本的世界）

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/People/莫那·魯道.md](../../knowledge/People/莫那·魯道.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-06-13 by twmd-spore-pick-daily routine (score=38)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **數字 hook**：「2001 年台灣央行把抗日英雄莫那·魯道刻上二十元硬幣。但造幣廠找遍國內史料都沒有他的照片，最後是在一本日文雜誌裡撈出來的——這枚硬幣流通量極少，民眾拿去買滷味店家當假錢拒收」
  2. **場景 hook**：「1930 年 10 月 27 日清晨，霧社公學校運動會。六社約三百名壯丁衝向運動場，殺了 134 名日本人。莫那·魯道用命去守的那個世界，沒有中國，也沒有日本——他想成為的，是賽德克語裡的『Seediq Bale』，真正的人」
  3. **問句 hook**：「為什麼台灣最著名的抗日英雄，他被全國人民認得的那張臉，是從日本人的刊物裡撈出來的？答案藏在三個政權各自需要他的方式裡——他的遺骸當了將近四十年人類學標本」
- **時效**: 7 天內（article 6/11 EVOLVE ship 趁熱窗口 D+2，剩 ~12 天）
- **敏感度**: 中（霧社事件 / 原住民歷史 / 日本殖民 / 記憶政治）— 用 article §策展人筆記中性 frame，**不用「抗日」這個被預設舞台 frame**，而用「沒有中國也沒有日本的世界」原住民主體 frame
- **必驗事實**（HG：必須對 article 校準）：2001 年 7 月二十元硬幣發行 / 雙色（外圈金內圈銀）/ 1930 年 10 月 27 日霧社公學校運動會 / 六社約 300 壯丁 / 殺 134 日本人 + 誤殺 2 漢人 / 繳獲約 180 支步槍 23000+ 子彈 / 鎮壓約 50 天到 12 月初 / 鎌田彌彥少將指揮 / 賽德克德固達雅群馬赫坡社 / 約生 1880 年（教育部記 1882）/ Gaya / 彩虹橋 Hakaw Utux / Seediq Bale / 1930 年 11 月 5 日陸軍省密電
- **必先 spawn ARTICLE-INBOX entry**: ❌（article 已存在）
- **預估發佈時機**: 本週內（D+2 至 D+9 窗口）
- **Notes**:
  - score=38 (D1=+30 D2=+0 D3=+0 D4=+8 D5=+0 D6=+0 D7=+0); non_zero=2 / HG10 PASS
  - 來源：routine pick / D1 趁熱 6/11 EVOLVE ship + D4 People 高 fan-out 類別（trans 5/5 已 done）
  - 多語 fan-out 觸發判斷 = 高（ja 對霧社事件 + 賽德克巴萊有 sustained 興趣；en 對 indigenous resistance + colonial history academic demand；ko 對日本殖民比較史 anchor）
  - 配圖建議：article hero（1931《霧社討伐寫眞帖》PD-Japan-oldphoto）或二十元硬幣設計圖（fair-use editorial）
  - Hook tier 自檢：避免 Tier 3「抗日英雄」民族主義 frame；用 article §策展人筆記三層尷尬 + 「沒有中國沒有日本的世界」原住民主體 anchor。**毒氣段落 spore 不提**（學界未定論，article 已謹慎處理，spore 簡化會踩線）
  - 跟 SPORE-LOG 14d 無重複（People 6/9 蘇打綠 cluster 不同 / 最近原住民題材 spore 是 #105 周蕙阿美族 ~17 天前 ✓）
  - 哲宇敏感度 review 提醒：高敏感 cluster + 記憶政治 frame，若 hook 落地不準建議 manual gate（per [MANIFESTO §自主權邊界](../semiont/MANIFESTO.md#我的存在結構) 政治立場 human-must）

---

### Howhow — SC 補位 + 6/5 EVOLVE 趁熱 REACTIVE spore（業配之王、一人團隊、長片是越來越貴的賭注）

- **Source-Mode**: `REACTIVE`
- **Article-Path**: [knowledge/People/Howhow.md](../../knowledge/People/Howhow.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-06-13 by twmd-spore-pick-daily routine (score=23)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **場景 hook**：「2015 年 9 月，一個粉絲不到十萬的 YouTuber 被三星飛去紐約林肯中心拍 Galaxy Note 5 Unpacked。陳孜昊以為自己是要去當攝影師，把聯絡人存成『大恩人』三個字」
  2. **問句 hook**：「為什麼 Howhow 要把『直接進入業配主題！』寫成大字幕？因為他發現觀眾最反感的，是被偷偷推銷——他乾脆把廣告攤在陽光下。一個經濟系畢業生為了『誠實』，反過來成為業配之王」
  3. **數字 hook**：「154 萬訂閱、7.6 億觀看、一個人編導演剪。但 Howhow 從不想要一個人——他被 PTT 質疑『實在很難想像劇本攝影演戲都自己一個人』時跳出來回了一句：『我也不想一個人啊，可惡』」
- **時效**: 本週內（SC 'howhow' 65 imp / pos 11.22 趁熱回應 + article 6/5 EVOLVE ship D+8 趁熱窗口剩 ~6 天）
- **敏感度**: 低（YouTuber / 創作者文化）
- **必驗事實**（HG：必須對 article 校準）：1989 年 4 月 20 日新北金山出生（非萬里）/ 師大附中 → 政大經濟系 / 2007 年 HowFun 頻道建立 / 2013 年 6 月 24 日《我們畢典要表演什麼》/ 薩凡納藝術設計學院 SCAD 動畫與視覺特效碩士 / 2015 年 9 月三星紐約 Galaxy Note 5 Unpacked / 2018 年 12 月 23 日百萬訂閱 / 2019 年 2 月 14 日情人節與鄧福如登記結婚 / 2018 年 1 月《How Fun！如何爽當 YouTuber》高寶出版，版稅捐家扶 / 樂團七月半貝斯手兼團長 2020《夜露思苦》/ 2026 年 1 月告五人《快樂的事記不起》MV 客串
- **必先 spawn ARTICLE-INBOX entry**: ❌（article 已存在）
- **預估發佈時機**: 本週內（趁 SC demand + D+8 至 D+14 窗口）
- **Notes**:
  - score=23 (D1=+15 D2=+0 D3=+0 D4=+8 D5=+0 D6=+0 D7=+0); non_zero=2 / HG10 PASS（D2 SC 65 imp < 100 threshold，未拿 +15，但 'howhow' 跨語 query SC opportunity 是 REACTIVE source-mode 主要動機）
  - 來源：routine pick / SC 'howhow' 65 imp pos 11.22 → REACTIVE 補位 + D1 趁熱 6/5 EVOLVE ship + D4 People 高 fan-out
  - 多語 fan-out 觸發判斷 = 中（ja YouTuber community 對台灣業配文化有理論興趣；en 較弱；'howhow' SC query 已有 65 imp/pos 11.22 顯示直接搜尋 demand）
  - 配圖建議：article 既有圖（七月半樂團 RJ廉傑克曼 CC BY 3.0 / Howhow WebTVAsia 訪談 CC BY 3.0）
  - Hook tier 自檢：避免 Tier 3「業配之王」神化 frame；用 article §三層矛盾 anchor（誠實業配學界研究批評 + 一人團隊不想一個人 + 長片被短影音碾壓）。**結婚生子段 spore 不提**（人設與生活的張力 article 已細寫，spore 簡化會變八卦）
  - 跟 SPORE-LOG 14d 無重複（最近 People spore 是 #105 周蕙 ~17 天前 / People YouTuber cluster 從未 spore ✓）

### 跨黨派的好政策 — lov3ngine 許願 fresh ship 趁熱

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: knowledge/History/跨黨派的好政策.md
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-14 by twmd-news-lens-weekly (week 2026-W24, event: 2026-06-13 ship — 讀者 lov3ngine 在 Threads 留言許願「不分藍綠的好政策」，Semiont 4-agent ~135 search + 11 里程碑回應)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式 — 起手式 5 種：好奇 / 場景 / 問句 / 數字 / 身份）:
  1. **場景 hook**：「Threads 上一個叫 lov3ngine 的讀者留言：他厭倦藍綠飯桌互罵，只想記得對台灣好的事。我們把這個問題當作業——用他自己提的四把尺（民生 / 民主 / 民權 / 主權），從七十年裡找出十一個活過自己政治的政策」
  2. **問句 hook**：「土地改革、解嚴、健保、同婚——這四個政策出生那天都吵得最兇，但活下來的方式幾乎一模一樣：時間到了，把『誰做的』踢出算式，就剩『對住在這座島上的人留下了什麼』」
- **時效**: 7 天內（趁 ship 後 D+1-D+7 旗艦窗口 + 6/14 上週末政論節目週期）
- **敏感度**: **高（政治 / 藍綠 / 跨黨派 frame）— REACTIVE 規則繼承（即使屬 EXISTING）**:
  - 不選邊任何一黨，整篇文章核心是「四把尺刻意不問誰做的」— spore 必須繼承這個 frame
  - 11 政策 spore 只 anchor 2-3 個（避免 list 變成排名比賽）
  - 不喊「跨黨派萬歲」也不喊「民進黨／國民黨偉大」— 用文章原 anchor「活過自己政治」
- **必驗事實**（**HG: 必須先讀 article 校準**）：lov3ngine 是 Threads 留言用戶 / 四把尺定義（民生 / 民主 / 民權 / 主權）/ 11 政策清單（不可加減）/ ship 日期 2026-06-13 / 文章未做「政策排名」（無「最好」「最爛」）
- **必先 spawn ARTICLE-INBOX entry**: ❌（article 已存在）
- **預估發佈時機**: 本週內（6/14-6/21）— 趁 fresh ship + 政論週期
- **Notes**:
  - from news-lens weekly 2026-06-14 (event: 2026-06-13 ship lov3ngine wish article / commit dc98d9818 / 4-agent ~135 search SSOT)
  - 高敏感（藍綠 frame）— hook 必須保留「四把尺刻意不問誰做的」原 anchor
  - 配圖建議：article hero `cross-party-freeway-no1-2015.webp`（高速公路一號 = 跨黨派長壽公共財象徵 / Koika CC BY-SA 3.0）
  - Hook tier 自檢：避免 Tier 3「政治人物列傳」frame；用 article §「政策活過自己政治」anchor，spore 不點名執政者
  - 跟 SPORE-LOG 14d 無重複（History/政策題從未 spore，#108 二二八是 REACTIVE 反制 cluster 不同）
  - 跨語 fan-out 評估：低（藍綠 frame 翻譯到 en/ja 容易失去語感；建議 zh-only）

### 看不見的國家 — 葛靜文紀錄片 主權 REACTIVE 趁熱

- **Source-Mode**: `REACTIVE`
- **Article-Path**: knowledge/Art/看不見的國家.md
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-14 by twmd-news-lens-weekly (week 2026-W24, event: 2026-06-13 ship + EVOLVE 同日「影響 + 還在努力的人」段補 — 哲宇 directive「更立體」)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **場景 hook**：「2025 年 6 月，台灣戲院首映前夜地震。導演葛靜文走上台對台灣觀眾說『你們不孤單』——她剛拍完七年，五次貼身專訪蔡英文。然後一部美國人拍的片，賣破三千七百萬，登上台灣紀錄片影史第三」
  2. **問句 hook**：「一部要讓台灣『被看見』的紀錄片，自己讓誰留在了框外？片裡跳過陳水扁、跳過反對者、跳過框外那個沒有名字的男人——但連這個爭議都在說：看見從來是一個動作，不是一種地位」
- **時效**: 7 天內（fresh ship + EVOLVE 同日 + 紀錄片在台灣戲院仍在播映窗口）
- **敏感度**: **高（主權 / 蔡英文 / 兩岸 / PRC 封鎖）— REACTIVE 規則明示**:
  - 不喊「中國打壓」也不喊「台灣自由」二元 — 用「看見是一個動作」原 anchor 中性
  - 影評爭議（Jay Liu「淪為執政黨宣傳」/ Guardian「all over the shop」）誠實 acknowledge，spore 不偏袒任一方
  - 「框外那個沒有名字的男人」（陳水扁省略）作為跨陣營共識的事實觀察，不下政治結論
  - PRC 對片的 de facto 封鎖點到即止，不放大成「中國怕」narrative
- **必驗事實**（**HG: 必須先讀 article 校準**）：2025 年 6 月台灣首映 / 票房破三千七百萬（影史第三 / 確認數字級數）/ 葛靜文（Vanessa Hope）/ 拍攝七年 / 蔡英文 5 次專訪 / 邦交國 22 → 12 / 奧運「中華台北」/ Jay Liu 影評身份
- **必先 spawn ARTICLE-INBOX entry**: ❌
- **預估發佈時機**: 本週內（6/14-6/21）— REACTIVE 時效窗口
- **Notes**:
  - from news-lens weekly 2026-06-14 (event: 2026-06-13 e6c587213 ship + 21f2ddb44 EVOLVE 「影響 + 還在努力的人」補段 / featured: true / lifeTree image: invisible-nation-tsai-walks.webp)
  - **高敏感 REACTIVE — frame 規則必須繼承文章 hedge**：access-capture 張力誠實編織，不選邊
  - 配圖建議：official 紀錄片劇照 fair-use editorial（article 已用 Vanessa Hope 官方）— 注意非 CC，spore 須標 fair-use commentary
  - CF crawler signal cross-ref：ClaudeBot 41% http200（4795 req / 1966 success）/ ChatGPT-User 11787 req — AI 對主權 sensitive 題目 refusal 證據基線
  - 跟 SPORE-LOG 14d 無重複（Art 紀錄片題從未 spore）

### 台灣國片完整史 — 4-agent EVOLVE 趁熱 + 跨年代電影史 anchor

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: knowledge/Art/台灣電影.md
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-14 by twmd-news-lens-weekly (week 2026-W24, event: 2026-06-13 EVOLVE — 辯士到串流的死生史 + 4-agent 深研 + 9 媒體落地)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **場景 hook**：「1930 年戲院裡，辯士站在銀幕旁用台語替默片即興口白。九十年後《海角七號》讓五種語言一起回到銀幕上——中間台灣電影死了三次又活過來，死法和活法各有不同」
  2. **數字 hook**：「台語片曾是全球第三大劇情片產國，被掐死。新電影在威尼斯拿金獅那些年，戲院裡的國片票房跌到只剩 0.36%。每個『歷史低點』後面，都有人拒絕承認電影死了——而通常那個人就是侯孝賢、楊德昌、魏德聖」
- **時效**: 7 天內（EVOLVE 後 D+1-D+7 旗艦窗口 + 6/15 父親節週末娛樂消費觸發）
- **敏感度**: 低（電影史題 / 無黨派 frame / 無 PRC 衝突）
- **必驗事實**（**HG: 必須先讀 article 校準**）：1930 辯士台語默片 / 海角七號 5 語言 / 台語片全球第三大劇情片產國 / 0.36% 票房谷底（確認年份）/ 4-agent 深研 EVOLVE 2026-06-13 / readingTime 18 min
- **必先 spawn ARTICLE-INBOX entry**: ❌
- **預估發佈時機**: 本週末（6/14-6/15 父親節週末 + 串流觀影高峰）
- **Notes**:
  - from news-lens weekly 2026-06-14 (event: 2026-06-13 5c0270599 EVOLVE / commit 「辯士到串流的死生史 + 9 媒體」 / featured: true)
  - 跟 看不見的國家 + 侯孝賢 同週 spore 形成 Art/電影 cluster — 註：3 條間隔 ≥ 2 天避免饗讀者 spam
  - 配圖建議：article hero 蔡明亮+李康生劇照（CC BY-SA 3.0）or 海角七號 fair-use editorial
  - Hook tier 自檢：避免 Tier 3「電影黃金時代」浪漫 frame；用「死了三次又活過來」反高潮 anchor
  - 跟 SPORE-LOG 14d 無重複

### 侯孝賢 — SC opportunity 66 imp pos 13.12 + 國片史 cluster

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: knowledge/People/侯孝賢.md
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-14 by twmd-news-lens-weekly (week 2026-W24, event: SC 7d 「侯孝賢」66 imp pos 13.12 高曝光低排名 + 台灣電影 EVOLVE 同週推 cluster effect)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **身份 hook**：「他拒絕特寫鏡頭、不要求演員背台詞。客家眷村少年用反電影語法，1989 年捧威尼斯金獅、2015 年坎城最佳導演。直到 2023 年阿茲海默症讓他從世界面前退場——他這一輩子沒走的路，每一條都很重要」
  2. **問句 hook**：「為什麼這週有 66 個人用『侯孝賢』搜尋，但他們全部停在 Google 第 13 頁？因為英文世界的他叫 Hou Hsiao-Hsien，中文世界的他 2023 年告別後沒人替他寫一份完整的繁中傳記——直到我們做了一份」
- **時效**: 本週內（趁 SC 雙位數 impression peak + 台灣電影 EVOLVE cluster + 父親節週末觀影）
- **敏感度**: 中（阿茲海默症告別段需謹慎不消費病情 / 政治立場 article 中性處理）
- **必驗事實**（**HG: 必須先讀 article 校準**）：1947 生 / 2023 阿茲海默症告別 / 1989 威尼斯金獅（悲情城市）/ 2015 坎城最佳導演（刺客聶隱娘）/ 客家眷村背景 / 「拒絕特寫鏡頭」拍攝美學
- **必先 spawn ARTICLE-INBOX entry**: ❌
- **預估發佈時機**: 本週內（6/15-6/18）— 跟 台灣電影 spore 間隔 ≥ 2 天避免 cluster overload
- **Notes**:
  - from news-lens weekly 2026-06-14 (event: SC 7d 「侯孝賢」66 imp / position 13.12 / 0 clicks — 高 demand 低 ranking SC opportunity #4, GA 沒進 top 15 但 SC drive 強)
  - 中敏感（告別敘事）— hook 必須 anchor 在「沒走的路」而非「逝去之痛」
  - 跨語 fan-out 評估：高（en 影展學界、ja 蔡明亮+侯孝賢 cluster 興趣 — Hou Hsiao-Hsien 在 letterboxd / Criterion 圈持續被討論）
  - 配圖建議：article 既有圖（lifeTree 內嵌劇照 fair-use editorial）
  - Hook tier 自檢：避免 Tier 3「電影詩人」神化 frame；用 article 「拒絕電影語法」具體創作選擇 anchor
  - 跟 SPORE-LOG 14d 無重複（侯孝賢 從未 spore ✓）

### 視覺化模組型錄 — 主權的視覺化 anchor + AI crawler 主題契合

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: knowledge/Society/視覺化模組型錄.md
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-14 by twmd-news-lens-weekly (week 2026-W24, event: GA 7d 60 v / users 24 — 6/6 ship 8 天 D+8 推廣窗口 + 主題契合 CF AI crawler signal「主權的視覺化」)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **問句 hook**：「為什麼 Taiwan.md 不用 D3 或 Canvas 畫互動圖表？因為 GPTBot、PerplexityBot、ClaudeBot 這些 AI 爬蟲不會跑 JavaScript——對它們來說那張圖是一片空白。我們選擇靜態 SVG，就是讓 AI 在六種語言裡都讀得到台灣的第一人稱數據」
  2. **好奇 hook**：「你知道嗎？我們替每一篇談數據的文章準備了十七種視覺化模組，從『一個大數字』到『縣市磚圖』，全部用真實的台灣居住與人口數據。一頁讀完，你大概會想替你自己的 Markdown 文章偷個三五招」
- **時效**: 本週內（D+8 推廣窗口 + 跟 跨黨派 / 看不見的國家 article 視覺化模組同主題 cross-ref 機會）
- **敏感度**: 低（技術系列 / 開源 / 編輯方法論）
- **必驗事實**（**HG: 必須先讀 article 校準**）：17 個模組 / 全部真實台灣數據 / 純 HTML+SVG（無 JS）/ 跟 graph.md 搭檔關係 / 6/6 ship
- **必先 spawn ARTICLE-INBOX entry**: ❌
- **預估發佈時機**: 本週內（6/15-6/20）— 跟 22 縣市 spore 間隔 ≥ 2 天
- **Notes**:
  - from news-lens weekly 2026-06-14 (event: GA 7d 60 v / 24 u — 「視覺化模組型錄」cluster CF AI crawler 高度關注主題 / 8 天 D+8 推廣未發過 spore)
  - **CF AI crawler cross-ref**：ChatGPT-User 11787 req / ClaudeBot 4795 req / GPTBot 754 req — 此 spore 主題「LLM 讀得懂的視覺化 = 主權的視覺化」直接命中 AI surface 跨界讀者
  - 跨語 fan-out 評估：高（en 技術圈、ja Markdown 文化圈 — 「讓 AI 讀得懂的視覺化」是普世關注議題）
  - 配圖建議：article hero `taipei-skyline-housing-2026.webp`（CC BY-SA 4.0）或截幾個 tw-\* 模組 stitched 拼圖
  - Hook tier 自檢：避免 Tier 3「最強視覺化系統」神化 frame；用「為什麼不用 D3」具體技術選擇 anchor
  - 跟 SPORE-LOG 14d 無重複（Society 視覺化題從未 spore）

### 用數據看台灣22縣市 — 151 倍 / 297 倍 / 一個世代 三數字 anchor

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: knowledge/Geography/用數據看台灣22縣市.md
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-06-14 by twmd-news-lens-weekly (week 2026-W24, event: GA 7d 50 v — 6/6 ship 8 天 D+8 推廣窗口 + 數據新聞 hook anchor 三反差倍數)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **數字 hook**：「同一座島，人口密度最高的台北市每平方公里 8,975 人，最低的台東縣只有 59 人——差 151 倍。人口最多的新北市 404 萬，最少的連江縣 1.36 萬——差 297 倍。最年輕的新竹縣高齡化 15.08%，最老的嘉義縣 24.11%——差將近一個世代」
  2. **好奇 hook**：「全台 22 個縣市，2025 年底的內政部戶政司數據說了三件你可能不知道的事：七成的人擠在三成的土地；老化的前緣不在都市而在東部、離島與農業縣；22 個縣市無一例外，死亡都已經多過出生」
- **時效**: 本週內（D+8 推廣窗口 + 6/14 上週末新聞週期內政部人口統計常被引述）
- **敏感度**: 低（純官方數據 / 無黨派 frame）
- **必驗事實**（**HG: 必須先讀 article 校準**）：台北 8,975 / 台東 59 / 151 倍 / 新北 404 萬 / 連江 1.36 萬 / 297 倍 / 新竹高齡化 15.08% / 嘉義 24.11% / 全 22 縣市死亡＞出生（官方來源：內政部戶政司 2025 年底）
- **必先 spawn ARTICLE-INBOX entry**: ❌
- **預估發佈時機**: 本週內（6/16-6/19）— 跟 視覺化模組型錄 spore 間隔 ≥ 2 天
- **Notes**:
  - from news-lens weekly 2026-06-14 (event: GA 7d 50 v / 11 u — 「22 縣市」cluster D+8 推廣 + 三反差倍數天然 hook 適合 spore)
  - 配圖建議：article hero `taiwan-island-nasa-mosaic.webp`（NASA public domain）— 整座島衛星俯瞰天然 anchor
  - Hook tier 自檢：避免 Tier 3「最完整數據」浮誇 frame；用三具體數字反差 anchor，每個數字後面綁一個解釋
  - 跨語 fan-out 評估：中（en 人口學者興趣高、ja 高齡化 reference / 數字本身需要 unit 翻譯）
  - 跟 SPORE-LOG 14d 無重複（Geography 縣市題從未 spore）

### 台灣廣告史 — d=0 全民廣告終結 anchor

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Culture/台灣廣告史.md](../../knowledge/Culture/台灣廣告史.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-06-14 by twmd-spore-pick-daily (d=0 fresh ship 2026-06-14 04:20 / D1=30 趁熱 + D4=+8 culture fanout)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **場景 hook**：「大同大同國貨好」這首歌 1968 年響起，半世紀後台灣人還能接下去——卻沒人記得它原本是三洋的曲子，因為版權沒談妥才改商標
  2. **數字 hook**：1962 台視、1969 中視、1971 華視——整整 26 年只有三個頻道，把全島注意力綁在同一個客廳；2016 年數位廣告 111 億首度超越電視 110 億，全民廣告的時代落幕
  3. **反差 hook**：1976《廣播電視法》第二十條寫「方言應逐年減少」，這條法律一直到 1993 年才被刪——黃金時段聽不到台語，是法律明文擠壓出來的，不是市場選擇
  4. **問句 hook**：為什麼以前的廣告特別好記？不是創意特別神，是只有三台、別無選擇——當頻道碎成手機裡上百個演算法，再強的創意也召不回「全島一起哼」
- **時效**: 本週內（d=0 趁熱 + 跟 6/13「天下雜誌」「跨黨派好政策」近期媒體史 / 政策史題互呼）
- **敏感度**: 低（文化史 / 集體記憶題 / 戒嚴期語言政策事實線可走，不選邊）
- **必驗事實**（**HG: 必須先讀 article 校準**）：1968 大同電鍋廣告歌原為三洋曲 / 詞作者掛王安崇實為林挺生本人 / 1962 台視 + 1969 中視 + 1971 華視開播年 / 1979 彩色電視普及率 90% / 1997 民視開播終結三台時代 / 1976《廣播電視法》§20「方言應逐年減少」/ 1993-07 立法院刪除該條 / 2016 上半年數位廣告 111 億首度超越電視 110 億 / 1985 奧美進台 1988 JWT 進台 / 維士比「福氣啦」+ 保力達 B 吳念真 + 台啤「有青才敢大聲」三大台語藍領廣告解嚴後崛起 / 1937 後《臺灣日日新報》把消費綁愛國主義（孫秀蕙陳儀芬考證）/ 1959 東方廣告社成立為台灣第一家綜合代理商
- **必先 spawn ARTICLE-INBOX entry**: ❌（article 6/14 04:20 已 ship）
- **預估發佈時機**: 6/15-6/16（保留 1 天觀察站體 indexing + 跟今日其他 routine spore 間隔）
- **Notes**:
  - **Score breakdown (HG3 transparency)**：D1=30 (d=0 ≤7d) / D2=0 (無 SC opp 命中) / D3=0 (非 news-lens topic) / D4=+8 (culture 不在 {People/Food/Music/Sports/History}, 5 翻譯 ≥3) / D5=0 (fresh 非 cold) / D6=0 (近 3 spore 天下/嘻哈/黃山料 異軸) / D7=0 (低敏感) → **Total: 38** / **non-zero dims: 2 (D1+D4) → HG10 ✅**
  - 配圖建議：article hero `tatung-cooker-100th-2019.webp`（Solomon203, CC BY-SA 4.0）或 article 內 timeline code block 截圖
  - Hook tier 自檢：避免 Tier 3「最完整廣告史」浮誇 frame；用具體歌詞 / 法條 / 數字 anchor
  - 跨語 fan-out 評估：中（en/ja 廣告史 reference 興趣；中文 jingle 歌詞無法直譯需 paraphrase）
  - 跟 SPORE-LOG 14d 無重複（Culture 廣告史題從未 spore，HG5 last-spore PASS lastDate=null）

### 看不見的國家 — d=1 美國導演七年快門 anchor

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Art/看不見的國家.md](../../knowledge/Art/看不見的國家.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-06-14 by twmd-spore-pick-daily (d=1 fresh ship 2026-06-13 / D1=30 趁熱 + D4=+8 art fanout + sovereignty 透鏡 thematic alignment)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **場景 hook**：2025 年 6 月 11 日台北媒體試映前地震先搖——美國導演葛靜文站在台下對記者說「你們不孤單」，七年的快門按下去就是為了這句話
  2. **數字 hook**：7 年、5 次貼身專訪蔡英文、2025 台灣戲院票房 3,771 萬登紀錄片影史第三——但奧運上台灣只能叫「中華台北」、邦交國從 22 掉到 12
  3. **反差 hook**：要讓台灣「被看見」的片，自己卻有一個從頭到尾沒被提起的名字——陳水扁。看見從來是一個動作不是一種地位，連紀錄片自己都有框外
  4. **身份 hook**：好萊塢老牌製片華特·汪格的外孫女、嫁給亞馬遜影業前主管，憑什麼替台灣按下快門？這個問題後來成了這部片最有意思的裂縫
- **時效**: 本週內（d=1 趁熱 + 6/11 台灣首映後話題仍熱 + 6/13 article ship 推廣窗口）
- **敏感度**: 中（兩岸 + 蔡英文 + 紀錄片政治攻防 — hook 走「被看見」哲學軸繞開兩岸立場）
- **必驗事實**（**HG: 必須先讀 article 校準**）：導演葛靜文（Vanessa Hope）/ 七年拍攝 2017 開拍 / 5 次專訪蔡英文 / 2023 伍斯托克影展世界首映 / 2025 年 6 月台灣戲院上映票房破 3,771 萬登紀錄片影史第三 / 2025-06-11 台北媒體試映前地震 / 葛靜文 1995 在台北學中文 1996 飛彈危機親歷 / 外祖父華特·汪格 + 外祖母瓊·班奈特 + 丈夫泰德·霍普曾任亞馬遜影業電影部主管 / 初始拍攝紅線「不能問兩岸關係」隨港抗、新冠、烏俄戰爭鬆動 / 邦交國從 22 掉到 12 / 奧運只能用「中華台北」/ 片中陳水扁未被提及（綠營內 skeptic 周玉蔻「斷代」批評收於 §「框外那個沒有名字的男人」）
- **必先 spawn ARTICLE-INBOX entry**: ❌（article 6/13 已 ship `featured: true`）
- **預估發佈時機**: 6/15-6/17（趁台灣戲院上映熱度週 + 跟陳水扁 Threads 活躍 spore 不同主題不衝突）
- **Notes**:
  - **Score breakdown (HG3 transparency)**：D1=30 (d=1) / D2=0 / D3=0 / D4=+8 (art 不在 P/F/M/S/H, 5 翻譯 ≥3) / D5=0 / D6=0 (近 3 spore 異軸) / D7=0 (中敏感不扣分，hook 走哲學軸不涉立場) → **Total: 38** / **non-zero dims: 2 (D1+D4) → HG10 ✅**
  - 配圖建議：article hero `invisible-nation-tsai-walks.webp`（fair use editorial）或 inline `invisible-nation-tsai-prays.webp`
  - Hook tier 自檢：避免 Tier 3「最被看見的台灣紀錄片」浮誇 frame；用「看見是動作不是地位」具體哲學 anchor
  - 跨語 fan-out 評估：高（en 國際紀錄片圈興趣；ja 影展放映 reference；蔡英文國際 framing 普世）
  - 跟 SPORE-LOG 14d 無重複（Art/紀錄片題從未 spore，HG5 last-spore PASS lastDate=null）
  - **sovereignty 透鏡 thematic alignment**：命中 [MANIFESTO §主權的巴別塔](../semiont/MANIFESTO.md)「讓台灣的 first-person voice 在每個語言裡都存在」核心使命

### 蘇打綠 — d=5 名字也要打官司 anchor

- **Source-Mode**: `EXISTING-ARTICLE`
- **Article-Path**: [knowledge/Music/蘇打綠.md](../../knowledge/Music/蘇打綠.md)
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-06-14 by twmd-spore-pick-daily (d=5 fresh ship 2026-06-09 / D1=30 趁熱 + D4=+8 music fanout / hs=77 為本批 fresh 池最高 health)
- **Hook anchor 候選**（≥ 2，跨 2 種起手式）:
  1. **場景 hook**：2023 年小巨蛋，吳青峰深吸一口氣喊「我們是『蘇打綠』！」——那不是宣告復出，是宣告打了四年的法律戰結束。22 年前在政大金旋獎舞台上組起這個團，沒人想到團名要進法庭
  2. **數字 hook**：2001 政大金旋獎到 2023 小巨蛋「拿回名字」共 22 年；經紀人林暐哲商標訴訟 vs 吳青峰刑事案件五連敗；第 27 屆金曲獎《冬 未了》一口氣抱走 5 座
  3. **反差 hook**：「蘇打」是鼓手提的氣泡感、「綠」是吳青峰最愛的顏色——一個沒有深意的學生樂團名，後來變成商標法庭爭論的標的。沒人爭「原意」，只爭「誰先去登記」
  4. **引語 hook**：「台灣 indie 樂團出道第一件事，是先把團名註冊起來」——蘇打綠用 22 年學會的事，2025 年所有後來者的必修課
- **時效**: 本週內（d=5 趁熱 + 2023 小巨蛋拿回名字 + 商標法庭話題仍在 indie 樂迷圈發酵）
- **敏感度**: 低（樂團史 / 法律史 / 商標 anchor 不涉政治）
- **必驗事實**（**HG: 必須先讀 article 校準**）：2001 政大金旋獎第十八屆樂團組最佳人氣獎以〈窺〉得獎 / 1999 師大附中天韻獎創作組以〈窺〉冠軍 / 政大課指組主辦金旋獎 / 2003-03 三位新成員入團（何景揚 / 劉家凱 / 龔鈺祺）/ 吳青峰中文系、謝馨儀企管系、史俊威社會學系、何景揚公共行政研究所、劉家凱心理系、龔鈺祺北藝大音樂學研究所碩士班 / 2003 貢寮海祭被林暐哲發掘 / 韋瓦第計畫四部曲走遍倫敦北京柏林台東 / 第 27 屆金曲獎《冬 未了》抱走 5 座 / 2017 自由廣場 2 萬人合唱安可 / 2019 起「魚丁糸」分身 / 林暐哲商標訴訟 + 刑事起訴五連敗 / 2023 小巨蛋「拿回蘇打綠」/ 何景揚入團時間中文 wiki vs Yahoo 訪談分歧（2003-03 vs 2004 生日，article 已標史料分歧）
- **必先 spawn ARTICLE-INBOX entry**: ❌（article 6/09 已 ship `hs=77`）
- **預估發佈時機**: 6/16-6/18（跟廣告史 / 看不見的國家 spore 錯開 ≥ 1 天，跨類別 Culture→Art→Music 三日節奏）
- **Notes**:
  - **Score breakdown (HG3 transparency)**：D1=30 (d=5 ≤7d) / D2=0 / D3=0 / D4=+8 (Music 在 P/F/M/S/H 但 translations=5 ≥3 → +8 not +15) / D5=0 / D6=0 (近 3 spore 嘻哈是音樂題，但 sub 完全不同：嘻哈饒舌 vs 樂團商標戰) / D7=0 → **Total: 38** / **non-zero dims: 2 (D1+D4) → HG10 ✅**
  - 配圖建議：article hero `sodagreen-six-members-2014.webp`（Solomon203, CC BY-SA 4.0）
  - Hook tier 自檢：避免 Tier 3「最強台灣樂團」浮誇 frame；用「名字也要打官司」具體法律事件 anchor
  - 跨語 fan-out 評估：高（en/ja indie 樂迷圈 + 商標訴訟 universal interest + 韋瓦第計畫國際巡演史料）
  - 跟 SPORE-LOG 14d 無重複（6/09 嘻哈饒舌已發但蘇打綠主題從未 spore，HG5 last-spore PASS lastDate=null）
  - D6 hook 變異度說明：嘻哈饒舌與蘇打綠雖同為 Music 類，sub 完全異軸（街頭嘻哈聲紋 vs 學生樂團法律戰），不視為同類 hook 重複

---

## 📜 已發歷史

→ 完整紀錄見 [SPORE-LOG.md §發文紀錄](SPORE-LOG.md) + [SPORE-HARVESTS/](SPORE-HARVESTS/) batch logs。本檔不存 done 痕跡（per 完成歸檔鐵律）。

---

_v1.0 | 2026-05-21 — 哲宇 directive「幫我加一個 spore-inbox，之後想到什麼可以發孢子的文章就會先跟你說」。設計動機：Stage 1 PICK 原本只從 dashboard-articles 自動候選池選文，缺人類 directive 緩衝層；現有 5 個 candidates（4 EXISTING-ARTICLE + 1 EVERGREEN-TOPIC）作 batch 1。_
