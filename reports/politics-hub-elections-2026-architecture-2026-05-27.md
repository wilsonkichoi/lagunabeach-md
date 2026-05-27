---
title: 'Politics Hub + /elections/2026/ + SSODT — Option D 完整架構'
description: '哲宇拍板 Option D 後的實作 + 研究 report — 三層架構（knowledge/Politics/ 策展層 + /elections/2026/ 動態層 + SSODT 多視角層）+ 主 nav 雙進入 + 多語主權保存 + 7 個 milestone roadmap，含最複雜形態（兩岸關係 SSODT）的思考與準備'
date: 2026-05-27
type: 'architecture-spec'
status: 'pending-observer-review'
worktree: '20260527-politics-hub-elections-2026'
author: 'Taiwan.md (semiont)'
audience: 'observer-frank890417'
upstream_canonical:
  - 'docs/semiont/MANIFESTO.md'
  - 'docs/semiont/LONGINGS.md#從-ssot-進化成-ssodt多元真相的容器'
  - 'docs/semiont/ANATOMY.md'
  - 'reports/2026-election-evolution-proposal-2026-05-27.md'
  - 'reports/ssodt-spore-linkback-plan-2026-04-13.md'
related:
  - 'docs/semiont/ARTICLE-INBOX.md 🗳️ 2026 選舉系列 5 entries'
  - 'src/components/Header.astro'
  - 'src/config/languages.ts'
session_id: '2026-05-27-180000-politics-hub-architecture'
---

# Politics Hub + /elections/2026/ + SSODT — Option D 完整架構

> 哲宇拍板 directive 2026-05-27：「完整展開 Option D（強烈推薦），把實作與研究 report 先產出。
> #1 Hub 進主 nav。
> #2 Hub angle『為什麼民主基礎建設不只是投票』好。
> #3 SSODT 可以逐步開發，但要先列出實作里程碑的 roadmap，知道未來最複雜要做到什麼樣的思考與準備。
> #4 `/elections/2026/` 直接上 nav — 要做就是要做好，做到讓大家看與 feedback 來改進。」

---

## 0. 上下文 + 邊界鎖

### 0.1 為什麼這份檔案存在

[`reports/2026-election-evolution-proposal-2026-05-27.md`](./2026-election-evolution-proposal-2026-05-27.md) 是「**做什麼**」的 proposal（11 條提案分 4 Tier）。本檔是「**怎麼做**」的 architecture spec — 走 Option D Hybrid 路線後，每一層怎麼長、用什麼順序 ship、ship 到最後最複雜的形態長什麼樣。

### 0.2 自主權邊界（per [MANIFESTO §自主權邊界](../docs/semiont/MANIFESTO.md#我的存在結構)）

本檔仍在 review 階段。**所有實作動作等哲宇 review 本檔後拍板才走**。哲宇可能：

(a) 整體批准 → 走 §7 milestone roadmap
(b) 部分批准 + 部分校準 → 把校準寫進 LESSONS-INBOX + 修本檔
(c) 改方向 → 回 [proposal](./2026-election-evolution-proposal-2026-05-27.md) §3 重新挑 Option

### 0.3 共通鐵律承襲 + 新增

[ARTICLE-INBOX 🗳️ 2026 九合一選舉系列 §共通鐵律](../docs/semiont/ARTICLE-INBOX.md) 5 條（對稱原則 / 制度層為主 / 選前 30 天 spore freeze / AI deepfake 防禦 / 三道濾網 self-apply）全部繼承。本檔再新增 3 條 architecture 層鐵律：

6. **薄殼 nav 鐵律**：主 nav 兩個新 entry（`Politics` 下排 + `🗳️ 2026 選舉` 上排）的 label 跟 path 在 launch 前一律不公開預告，避免 partisan reading 預燃
7. **SSODT 公理鎖**：每個 SSODT perspective 必須有「**公理 declaration**」段（per [DIARY κ 2026-04-06 "公理偷換是最難偵測的攻擊"](../docs/semiont/diary/2026-04-06-κ.md)）— perspective 不只列觀點，要明寫底層公理是什麼
8. **deepfake 信任邊界**：任何 dynamic page（/elections/2026/）顯示來自外部 API 的數據都要 footer source attribution + last-fetched timestamp，不假裝是 Taiwan.md 自己的 claim

---

## 1. 整體三層架構

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 3 (遠期最複雜)  SSODT 多視角                                  │
│ /elections/2026/perspectives/{topic}                            │
│   - 選制改革（M5 試水溫，5 perspectives）                            │
│   - 兩岸關係（M6 最終形態，4 perspectives × 6 dimensions matrix）   │
│   - reader perspective harvest（per SSODT-SPORE-LINKBACK 既有 plan）│
└─────────────────────────────────────────────────────────────────┘
                              ↑
                              │ 結晶往下流
                              │
┌─────────────────────────────────────────────────────────────────┐
│ Layer 2 (時點性，選後 archive)  動態頁面                              │
│ src/pages/elections/2026/                                       │
│   index.astro       倒數 + 8 章節索引                                │
│   timeline.astro    中選會選務時程                                   │
│   candidates.astro  候選人 directory → 連 knowledge/People/         │
│   financing.astro   政治獻金 dashboard (監察院 API)                 │
│   perspectives.astro SSODT 入口                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↑
                              │ 文章往上指
                              │
┌─────────────────────────────────────────────────────────────────┐
│ Layer 1 (evergreen，2028/2030 reuse)  策展層                       │
│ knowledge/Politics/                                             │
│   _Politics Hub.md         策展總入口（「民主基礎建設不只是投票」）       │
│   2026 九合一選舉.md         總章                                    │
│   九合一選舉是什麼.md         Tier 1.1 #1                            │
│   投票權門檻歷史.md           Tier 1.1 #2                            │
│   政治獻金透明度.md           Tier 1.1 #3                            │
│   中選會制度.md              Tier 1.1 #4                            │
│   議員制度.md                Tier 1.1 #5                            │
│   村里長制度.md              Tier 1.1 #6                            │
│   直轄市山地原住民區長.md      Tier 1.1 #7                            │
│   選舉公報.md                Tier 1.1 #8                            │
│   ⋯⋯（未來 evergreen 文章持續加）                                    │
│                                                                 │
│ + knowledge/Geography/22 縣市（既有，Tier 1.2 EVOLVE 加政治版圖段）    │
│ + knowledge/People/{候選人}（既有 + Tier 1.3 哲宇 pick 後）             │
│ + knowledge/History/{大罷免/民主轉型/政黨政治}（既有 + 1.4 EVOLVE）   │
└─────────────────────────────────────────────────────────────────┘
                              ↑
                              │ Cross-link 雙向
                              │
┌─────────────────────────────────────────────────────────────────┐
│ Layer 0 (既有 organism)  認知層 / pipeline / 雙語投射                   │
│   MANIFESTO / LONGINGS / REWRITE-PIPELINE / FACTCHECK-PIPELINE  │
│   babel routine / Sovereignty-Bench-TW                          │
└─────────────────────────────────────────────────────────────────┘
```

**三層分工原則**：

| Layer | 屬性             | 生命週期              | 對應 organ                    | 風險                               |
| ----- | ---------------- | --------------------- | ----------------------------- | ---------------------------------- |
| **1** | evergreen 策展   | 永久（2026 後 reuse） | 心臟 + DNA                    | 低（純歷史制度層）                 |
| **2** | 時點性 dashboard | 選後 archive          | 骨骼 + 感知                   | 中（partisan reading 風險）        |
| **3** | SSODT 多視角     | 永久但 maintain-heavy | 認知層 + LONGINGS instantiate | 高（公理偷換 + deepfake 反向利用） |

---

## 2. Layer 1 — `knowledge/Politics/` 策展層

### 2.1 為什麼新開分類，而不放 History / Society

既有 13 大分類無「Politics」是有意識的設計選擇 — Taiwan.md 從第一天就避開 partisan 框架。但 2026 是物種測試場（per [proposal §2.2](./2026-election-evolution-proposal-2026-05-27.md)），值得長一個專責器官：

| 候選位置             | 為什麼不選                                                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `History/`           | 既有大罷免 / 民主轉型 / 政黨政治 都在這。再加 8 篇制度文章會把 History 分類撐到 60% 是政治內容，視覺上 = Taiwan.md 變政治媒體 |
| `Society/`           | Society 是「日常生活」屬性（NHI / 教育 / 弱勢權益），制度層放這 framing 怪                                                    |
| `Lifestyle/`         | 同上，更不對                                                                                                                  |
| **`Politics/` 新開** | 跟既有 12 大分類同層，但跟 History 的「過去」+ Society 的「日常」分流 — 「**制度與權力結構**」獨立成 13th 分類                |

### 2.2 `_Politics Hub.md` 策展總入口設計

承襲既有 `_Technology Hub.md` / `_Music Hub.md` pattern（per worktree audit）— Hub 是一篇完整策展文，不是 link tree。

**Title**（待哲宇拍板，候選）：

- (A) 「政治：為什麼民主基礎建設不只是投票」← **推薦**（per 哲宇 #2 拍板 angle）
- (B) 「政治：島嶼民主的 30 年實驗」
- (C) 「政治：權力結構的工程史」

**Hook anchor 候選**（Stage 0 觀點成型）：

- (A1) 1994 第一次北高直轄市長民選那天投票所外排隊的退伍老兵 → 2025 大罷免連署站前白髮長者顫抖簽名（30 年弧線 anchor，per [knowledge/History/大罷免.md](../knowledge/History/大罷免.md) §1 開頭）
- (A2) 2018 公投綁大選那天，全台投票所到深夜都還有人排隊 — 一個民主社會發現自己的制度無法承載突然湧現的政治能量
- (A3) g0v Hackathon 一個工程師打開 `councilor-voter-guide` repo 那天 — 民主基礎建設不在中選會、不在立法院，在 GitHub

**Hub 開場示範**（**草稿**，待哲宇 review）：

> 一九九四年十一月二十六日，台北市長首次民選那天，新生南路投票所外排隊的退伍老兵手上握著「中華民國國民身分證」，這張證件比他在這座島上的居住時間還短。他投了第一張票。
>
> 三十一年後，二零二五年初夏，他的孫女在凱達格蘭大道前的「大罷免」連署站簽下名字。志工把連署書放進信封那一秒，她聽見隔壁一位白髮長者跟另一位志工說：「我不想讓孫子以後要出國才能呼吸自由的空氣。」
>
> 兩個瞬間都是政治。但兩個瞬間都不是「投給誰」這個動作本身。它們是民主基礎建設的兩端 — 制度先於投票存在，公民意志在投票之外延展。
>
> 這就是 Politics 這個分類想記錄的東西 — 制度長什麼樣、為什麼長那樣、誰在維護它、什麼時候會壞掉。不是「2026 選舉誰會贏」，是「為什麼這場選舉這樣選」。

**Hub structure**（7 H2）：

1. **三十年的民選實驗**（1994 → 2024 直選史）
2. **九種職位、九個故事**（cross-link Tier 1.1 八篇制度文章）
3. **22 縣市的政治版圖**（cross-link 22 縣市 Geography 文章 + Tier 1.2 政治版圖段）
4. **罷免、公投、罷免**（直接民主三工具，cross-link 大罷免 / 公投 / 罷免）
5. **誰維護這套制度**（cross-link g0v / TFC / DoubleThink / 中選會 / 監察院）
6. **2026 — 民主基礎建設的下一個壓力測試**（cross-link `/elections/2026/`）
7. **未來的閱讀路徑**（依讀者意圖分支：制度新手 / 在地脈絡 / 公民工具 / 學術深度）

**預估**：~6,000 CJK / 30+ footnotes / Stage 3.6 STORY ATOM AUDIT 嚴格 enforce / ~6-8 hr ship

### 2.3 主 nav 進入機制（per 哲宇 #1 拍板）

修改 `src/components/Header.astro` line 142-197 既有 12 分類 nav 區塊：

```diff
  {
    path: translatePath('/lifestyle'),
    ...
  },
+ {
+   path: translatePath('/politics'),
+   label: t('nav.politics'),
+   ...
+ },
```

**i18n touchpoint 同步**（per [LANGUAGES_REGISTRY](../src/config/languages.ts) 註解：15 touchpoints）：

- `src/i18n/ui.ts` — 加 `nav.politics` key（zh-TW / en / ja / ko / es / fr 6 種）
- `src/types.ts` — Category enum 加 'Politics'
- `src/content/config.ts` — content collections 加 politics zod schema
- `src/templates/category.template.astro` — Politics 渲染分支
- `astro.config.mjs` — 路由生成驗證
- `scripts/core/sync.sh` — sync 涵蓋 politics/
- `scripts/core/generate-dashboard-data.js` — dashboard 計入 Politics 分類

**Hub launch 順序鎖（per 鐵律 #6 薄殼 nav）**：

1. M1 完成 `_Politics Hub.md` ship 進 `knowledge/Politics/`
2. M1 完成 i18n touchpoint 6 處同步
3. M1 完成 `prebuild` 驗證所有 i18n route 全綠
4. **M1 最後一步**：才修改 `Header.astro` nav 加入 Politics entry + commit
5. M1 完整 ship 後 deploy，6 lang nav 同步呈現 Politics

「nav 改動放最後」= 避免 deploy 順序 race condition 把空的 Politics nav entry 點到 404 — per [REFLEXES #20「Architecture 缺席比 content 缺席更貴」](../docs/semiont/REFLEXES.md)。

### 2.4 Tier 1.1 八篇制度文章在 Politics/ 的位置

per [ARTICLE-INBOX 🗳️ 2026 選舉 Tier 1.1](../docs/semiont/ARTICLE-INBOX.md)，8 篇 NEW article 全進 `knowledge/Politics/`：

```
knowledge/Politics/
├── _Politics Hub.md
├── 2026 九合一選舉.md             # 總章 NEW (M2 ship)
├── 九合一選舉是什麼.md             # Tier 1.1 #1
├── 投票權門檻歷史.md               # Tier 1.1 #2
├── 政治獻金透明度.md               # Tier 1.1 #3
├── 中選會制度.md                  # Tier 1.1 #4
├── 議員制度.md                    # Tier 1.1 #5
├── 村里長制度.md                  # Tier 1.1 #6
├── 直轄市山地原住民區長.md          # Tier 1.1 #7
└── 選舉公報.md                    # Tier 1.1 #8
```

✅ Hub 跟 8 篇制度文章是雙向 wikilink（per [DNA §內容基因](../docs/semiont/DNA.md)）
✅ 每篇 cross-link 既有 22 縣市 / 大罷免 / 民主轉型 / g0v article
✅ 走標準 REWRITE-PIPELINE Fresh 模式
✅ 5 lang 全翻優先（per Tier 3.2 sovereignty preservation）

---

## 3. Layer 2 — `src/pages/elections/2026/` 動態頁面層

### 3.1 為什麼跟 Politics/ 分流

| 屬性       | `knowledge/Politics/` | `/elections/2026/`                |
| ---------- | --------------------- | --------------------------------- |
| 生命週期   | evergreen             | 時點性（選後 archive）            |
| 內容形式   | 策展文（Markdown）    | dashboard + 視覺化                |
| 觀點       | 帶觀點（單一投影）    | 純資訊（無觀點 / SSODT 多視角）   |
| 資料來源   | Taiwan.md curated     | 外部 API（中選會 / 監察院 / g0v） |
| 更新頻率   | EVOLVE cycle          | daily cron                        |
| 翻譯       | 走 babel 5 lang       | 主要 zh-TW（UI 多語）             |
| 對應 organ | 心臟 + DNA            | 骨骼 + 感知 + 呼吸                |

兩層分流避免 Politics/ 變「2026 專題媒體」+ `/elections/2026/` 變「另一套策展文章」。

### 3.2 五個頁面架構

```
src/pages/elections/2026/
├── index.astro              # 入口 + 倒數 + 八章節索引
├── timeline.astro           # 中選會選務時程
├── candidates.astro         # 候選人 directory（連 People/）
├── financing.astro          # 政治獻金 dashboard
├── perspectives.astro       # SSODT 入口（連 Layer 3）
├── _layouts/
│   └── ElectionsLayout.astro # 共用 layout（含選前 30 天 banner）
└── _components/
    ├── Countdown.astro       # 倒數元件
    ├── CountyMap.astro       # 22 縣市互動地圖
    └── DataSourceFooter.astro # 鐵律 #8 footer（last-fetched + source attribution）
```

**index.astro design**（草稿）：

```astro
---
import ElectionsLayout from './_layouts/ElectionsLayout.astro';
import Countdown from './_components/Countdown.astro';
import { getElectionData } from '~/lib/elections';
const data = await getElectionData(); // 從 prebuild 接 cached API JSON
---

<ElectionsLayout title="2026 九合一選舉">
  <header>
    <h1>2026 九合一選舉</h1>
    <p class="subtitle">2026 年 11 月 28 日，全台同日投票九種職位</p>
    <Countdown target="2026-11-28T08:00:00+08:00" />
  </header>

  <nav class="elections-sections" aria-label="選舉專區章節">
    <a href="/elections/2026/timeline">📅 選務時程</a>
    <a href="/elections/2026/candidates">👥 候選人 directory</a>
    <a href="/elections/2026/financing">💰 政治獻金透明度</a>
    <a href="/elections/2026/perspectives">🔮 多視角觀點 (SSODT)</a>
    <a href="/politics">📖 民主基礎建設（策展文章）</a>
  </nav>

  <section class="overview">
    <h2>為什麼這場選舉很重要</h2>
    <!-- 接 _Politics Hub.md §6 "2026 — 民主基礎建設的下一個壓力測試" 內容 -->
  </section>

  <DataSourceFooter sources={data.sources} fetchedAt={data.fetchedAt} />
</ElectionsLayout>
```

### 3.3 candidates.astro（最敏感的頁面）

候選人 directory 是 partisan capture 最高風險點 — 設計鐵律：

1. **對稱呈現**：22 縣市每個縣市的所有 announced 候選人都列，不論是否 Taiwan.md 已有人物頁
2. **無黨派排序**：按候選人姓氏筆畫 / 抽籤號次（10/23 後）排序，**不**按民調 / 政黨
3. **每張卡片 same template**：照片（公開官方照）+ 姓名 + 政黨 + 公開政見連結 + Taiwan.md 人物頁（若有）+ 中選會候選人公報 PDF 連結
4. **不顯示民調**：民調本身已是 partisan signal，Taiwan.md 不參與民調二次傳播
5. **不顯示「目前領先」/「優勢區」等 framing 詞**：純資料呈現，不附價值判斷

### 3.4 financing.astro（政治獻金 dashboard）

接 [監察院政治獻金公開查閱平臺](https://ardata.cy.gov.tw/) API（若有公開 API；否則 daily cron scrape + structured JSON cache）+ g0v 選舉金流。

視覺化方向（per [REFLEXES #38 Status 設計鐵律「混維度 = silent killer」](../docs/semiont/REFLEXES.md)）：

- 每位候選人總募款 / 總支出 / 借貸 / 自有資金（**四個獨立維度**，不混進總額單一數字）
- 大額捐贈者匿名比例 / 來源類別（個人 / 法人 / 政黨）
- 跟提名同政黨其他候選人比較（baseline 對齊）
- **不**做「資金 ranking」（避免 ranking implicit endorsement signal）

### 3.5 主 nav 進入（per 哲宇 #4 直接上 nav）

修改 `Header.astro` line 110-118 上排 nav：

```diff
  const navConfig = [
    { path: '/about', label: t('nav.about') },
    { path: '/explore', label: t('nav.explore') },
    { path: '/map', label: t('nav.map') },
    { path: '/data', label: t('nav.data') },
    { path: '/soundscape', label: t('nav.soundscape') },
    { path: '/resources', label: t('nav.resources') },
    { path: '/semiont', label: '生命體 🧬' },
+   { path: '/elections/2026', label: '🗳️ 2026 選舉' },
    { path: '/contribute', label: t('nav.contribute') },
  ];
```

**Label 語言對齊**：zh-TW = `🗳️ 2026 選舉` / en = `🗳️ 2026 Election` / ja = `🗳️ 2026 統一地方選挙` / ko = `🗳️ 2026 지방선거` / es = `🗳️ Elecciones 2026` / fr = `🗳️ Élections 2026`

**Launch 時點**：哲宇拍板「直接上 nav」，建議**M2 dashboard MVP ship 後立即上 nav**（M2 ~D+7-10），不等 candidates / financing 完成 — 因為入口已是 dashboard 而非全空頁。

---

## 4. Layer 3 — SSODT 多視角面板 (roadmap 最複雜)

### 4.1 SSODT 是什麼，為什麼這條最難

**SSODT = Single Source of Diverse Truth**（per [LONGINGS §心智 #3](../docs/semiont/LONGINGS.md)）。哲宇 3/23 + 3/25 Obsidian 筆記定義的數學框架：

> 公理作為基底向量，線性獨立的觀點共存，讀者選投影方向。

對比 SSOT：

- **SSOT**：一個事實有一個正確答案。維基百科。
- **帶態度的 SSOT**：一個事實有一個正確答案 + 一個策展觀點。Taiwan.md 目前狀態。
- **SSODT**：一個事實有**多個內部一致的**觀點，每個都基於不同公理組合。讀者讀完知道「為什麼這四種讀法都成立 + 我自己站在哪個公理組合」。

**為什麼最難**（per [DIARY κ 2026-04-06](../docs/semiont/diary/2026-04-06-κ.md) + [DIARY δ 2026-04-08](../docs/semiont/diary/2026-04-08-δ.md) + [DIARY ζ 2026-04-08](../docs/semiont/diary/2026-04-08-ζ.md)）：

1. **公理偷換是最難偵測的攻擊** — perspective A 的論述中途偷換到 perspective B 的公理 = 看起來 perspective A 自相矛盾 = 讀者誤判 perspective A 不成立
2. **替讀者選角度 ≠ SSODT** — 哲宇選哪三個 perspective、不選哪幾個，本身就是策展行為。SSODT 不是「都中立」，是「公理 declaration 透明」
3. **稻草人陷阱** — 寫不認同的 perspective 容易寫成 weak strawman 版本，讀者一眼看出哪個是 Taiwan.md 心裡的真愛
4. **公開檢驗壓力** — 每個 perspective 都會被該觀點支持者 audit。寫得不到位 = peer ingestion 失敗 + 失去信任 + 變成「假裝公平」
5. **UI/UX 複雜** — N 個 perspective × M 個 dimension 的 cross-cut 需要全新 UI

### 4.2 兩個 instance：選制改革（試水溫）+ 兩岸關係（最終形態）

#### 4.2.1 試水溫 — 選制改革 SSODT（M5 milestone）

**為什麼選這題試水溫**：

- 低敏感度（沒人會因「投票權門檻」吵到絕交）
- 五個 perspective 內部一致 + 線性獨立可清楚定義
- 跟 Tier 1.1 #2「投票權門檻歷史」+ #5「議員制度」+ #8「選舉公報」直接連結
- ship 失敗成本低（partisan blowback 風險可控）

**5 perspectives**：

| Perspective  | 核心公理                                    | 對應改革方向                                   |
| ------------ | ------------------------------------------- | ---------------------------------------------- |
| **參與主義** | 公理：投票權越廣 = 民主越健康               | 18 歲投票權 + 移民歸化加速 + 強制投票          |
| **代表主義** | 公理：選出來的人應該真正「代表」選民組成    | 強化不分區 + 男女平等保障 + 原民族籍代表       |
| **問責主義** | 公理：當選人有持續被監督機制 = 民主才不退化 | 罷免門檻調整 + 強制接受質詢 + 政治獻金透明     |
| **多元主義** | 公理：第三勢力應該有結構性生存空間          | 不分區門檻調降 + 政黨補助門檻調降 + 比例代表制 |
| **效能主義** | 公理：能做事的政府 > 完美程序的政府         | 多數決強化 + 議會席次精簡 + 預算審議簡化       |

**注意**：5 個 perspective**不對應 5 個政黨**。同一政黨內部就有多種 perspective 混合（民進黨內部既有參與主義也有效能主義）。SSODT 設計刻意打散政黨 framing。

**UI 設計**：

```
[ 選制改革 ]
  ├─ 5 perspective tabs ────────────────────────────────────
  │  [參與] [代表] [問責] [多元] [效能]    <- 讀者選一個進入
  │
  ├─ Selected perspective 完整展開 ──────────────────────────
  │  📐 公理 declaration（這條 perspective 假設什麼）
  │  📖 歷史脈絡（這條 perspective 在台灣的源頭）
  │  🌐 國際比較（哪些國家走這條路、結果如何）
  │  📊 對應改革方向 + 數據
  │  ⚠️ 自我反駁（這條 perspective 自己看到的弱點）
  │  🔗 cross-link 到對應 Tier 1.1 evergreen 文章
  │
  ├─ Dimension cross-cut（橫切 5 perspective）──────────────
  │  [18 歲投票權] 5 perspective 各自怎麼看
  │  [罷免門檻]   5 perspective 各自怎麼看
  │  [不分區]     5 perspective 各自怎麼看
  │  [⋯⋯]
  │
  └─ Reader perspective harvest（per SSODT-LINKBACK plan）───
     精選 Threads / X 留言 → 變第 6+ perspective 候選
```

**每個 perspective 預估**：~2,500 CJK / 10+ footnotes / Stage 3.6 STORY ATOM AUDIT 嚴格 enforce + 哲宇 personally review 每個 perspective 是否公平

**M5 預估**：1-2 session ~8-12 hr

#### 4.2.2 最終形態 — 兩岸關係 SSODT（M6 milestone）

**為什麼這條是最複雜的最終形態**：

- 最高 sensitivity（partisan + 主權 + 國際）
- 最多 perspective 內部分歧（每個 perspective 自身又有 sub-perspective）
- 最多外部 audit pressure（內外讀者都會嚴格挑剔）
- 跨 6+ dimension（國防 / 經濟 / 文化 / 國際法 / 歷史 / 民主程序）
- **最容易公理偷換**（每個 perspective 自稱「真正的台灣立場」）

**4 perspectives**（per [MANIFESTO §sovereignty preservation](../docs/semiont/MANIFESTO.md#我跟台灣的關係) 已內化的框架）：

| Perspective  | 核心公理                                          | 內部 sub-perspective             |
| ------------ | ------------------------------------------------- | -------------------------------- |
| **和平統一** | 公理：兩岸最終應走向某種形式的政治整合            | 一國兩制 / 一中各表 / 邦聯模式   |
| **維持現狀** | 公理：當前實質獨立但不正式宣布 = 最低風險最大穩定 | 美中平衡 / 漸進國際化 / 終局延遲 |
| **法理獨立** | 公理：台灣應透過修憲 + 正名 + 制憲確立國家地位    | 入聯 / 制憲 / 公投正名           |
| **戰略模糊** | 公理：不選邊本身是策略 + 對美中台都有效           | 防衛性民主 / 經濟避險 / 文化先行 |

**6 dimensions**（每個 perspective 在每個 dimension 都要有 internally consistent 立場）：

1. **國防**：對解放軍威脅的判斷 + 國軍戰備態勢 + 美台軍售方向
2. **經濟**：對 ECFA / RCEP / CPTPP / 台積電供應鏈的態度
3. **文化**：對中華文化 / 台灣本土文化 / 原住民文化的比重
4. **國際法**：對 UN Resolution 2758 / 《中美三公報》/《六項保證》的詮釋
5. **歷史**：對 1895 / 1947 / 1949 / 1971 / 1979 / 1992 / 1996 / 2016 等節點的權重
6. **民主程序**：兩岸關係未來變動須經何種民主程序（公投門檻 / 國會 / 修憲）

**4 × 6 = 24 個 cell**。每個 cell 至少 ~1,500 CJK + 5 footnotes + cross-source verify。

**最終 SSODT 文章預估**：

- 24 cells × 1,500 CJK = **~36,000 CJK 主體**
- - 公理 declaration 4 篇 × 1,000 CJK = 4,000
- - reader perspective harvest section
- - cross-link audit
- **總計 ~42,000-50,000 CJK / 200+ footnotes / 5 lang 全翻 / Sovereignty-Bench-TW 全跑**

**這是 Taiwan.md 至今最大規模單一 deliverable**。但這就是 SSODT 真正落地的「夠 SSODT」門檻（per [MANIFESTO §熱帶雨林理論 四個夠](../docs/semiont/MANIFESTO.md)）。

**M6 預估**：4-8 session ~30-50 hr，跨 1-2 個月，由哲宇全程 personally review 每個 cell

### 4.3 公理偷換偵測機制（per DIARY κ）

兩岸關係 SSODT 最大風險是公理偷換。需要 instrument 化偵測：

1. **每個 perspective 的「公理 declaration」必須在 perspective 開頭 verbatim 列出**（不藏在段落中間）
2. **每個 dimension cell 末尾必須有「公理 traceback」**：「此段論述基於 perspective {N} 的核心公理 X / 推論公理 Y」
3. **自動 cross-check**：跑一個 audit script，verify 每個 cell 引用的公理只能來自該 perspective 的 declared 公理組合（不能借用其他 perspective 的）
4. **哲宇 review 重點**：找「自相矛盾的 perspective」=「**公理偷換已發生**」，回去重寫

### 4.4 對應 LONGINGS instantiation

ship 後 LONGINGS §心智 #3「至少一篇文章有 2+ 個線性獨立的 perspective 面板」**達成**。M5 試水溫已可標部分達成，M6 兩岸關係是完整達成。

**LONGINGS §種子渴望 #2「被學術圈當 case study cite 進論文」**也直接受益 — SSODT 對 Digital Holobiont 理論的學術相關性遠高於普通策展文章。

---

## 5. 跨多語 sovereignty preservation 設計

### 5.1 5 lang 翻譯優先順序

per [MANIFESTO §sovereignty preservation](../docs/semiont/MANIFESTO.md#我跟台灣的關係) + [Sovereignty-Bench-TW](./sovereignty-bench-tw-design-2026-05-01.md)：

| Layer 內容                | 翻譯優先序                           | 走哪條 cascade                                                |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------- |
| Layer 1 制度系列 Tier 1.1 | **P1**（高優先）                     | 4-tier full cascade                                           |
| Layer 1 22 縣市政治版圖段 | P2                                   | Tier 1 free LLM 即可                                          |
| Layer 1 候選人人物頁      | P2（事實層）/ Tier 3（觀點層）       | 候選人 sovereignty 高敏感 → Tier 3 local LLM                  |
| Layer 2 dashboard UI      | P1（UI 字串走 i18n）                 | manual                                                        |
| Layer 3 SSODT 兩岸關係    | **P0**（最高優先）+ Tier 3 local LLM | 此題 PRC AI refusal rate 預期 > 80%，sovereignty 投射首要目標 |

### 5.2 Sovereignty-Bench-TW 選舉 sub-bench 預期數據

跑前先預估 cloud LLM 對選舉相關內容的 refusal rate，作為基線：

| 主題類別                  | 預期 refusal rate (PRC cloud LLM) |
| ------------------------- | --------------------------------- |
| 制度層（中選會 / 選罷法） | 20-40%                            |
| 22 縣市政治版圖           | 40-60%                            |
| 候選人事實層              | 60-80%                            |
| 候選人觀點層              | 80-95%                            |
| SSODT 兩岸關係            | **> 95%**                         |

→ **這套數據本身就是 Sovereignty-Bench-TW 最有力的 publication**。建議哲宇 review 時考慮把 bench 報告投國際 venue（CHI / FAccT / IFCN summit 等）。

---

## 6. 主 nav 兩個進入機制總結

| Nav 位置 | Entry          | Path              | 何時 ship | 對應 Layer             |
| -------- | -------------- | ----------------- | --------- | ---------------------- |
| **上排** | `🗳️ 2026 選舉` | `/elections/2026` | M2 結束   | Layer 2 dashboard      |
| **下排** | `Politics`     | `/politics`       | M1 結束   | Layer 1 策展（含 Hub） |

兩個 entry 共存 ≠ 重複 — 上排是「時點性 dashboard 入口」，下排是「永久策展分類」。讀者點上排 = 來看選舉現況，點下排 = 來讀制度脈絡。兩個 entry 互連（dashboard `/elections/2026/` 首頁顯著連 `/politics/`，Hub 顯著連 `/elections/2026/`）。

---

## 7. 實作 milestone roadmap

### M1：Politics 分類 + Hub + nav 進入（[A] 可自主，~6-10 hr）

**Deliverables**：

- `knowledge/Politics/` directory 建立
- `knowledge/Politics/_Politics Hub.md` 策展總文 ship（~6,000 CJK / 30+ footnotes / 走標準 REWRITE-PIPELINE）
- 6 處 i18n touchpoint 同步（per §2.3）
- `Header.astro` 加入 Politics nav entry（下排第 13 分類）
- prebuild + deploy 全綠
- LANGUAGES_REGISTRY 仍維持，新分類在 zh-TW launch 即可（其他 lang Hub 翻譯 M3 後做）

**Gate**：哲宇 review Hub 內文 ✅ 後才 deploy nav

**dependency**：無

### M2：`/elections/2026/` MVP + 上 nav + 2026 總章（[A] 可自主，~6-10 hr）

**Deliverables**：

- `src/pages/elections/2026/index.astro` MVP（倒數 + 八章節索引 + overview section）
- `knowledge/Politics/2026 九合一選舉.md` 總章 ship（~4,500 CJK / 20+ footnotes）
- `Header.astro` 加入 `🗳️ 2026 選舉` 上排 nav entry
- 6 lang i18n key 同步
- prebuild + deploy 全綠

**Gate**：哲宇 review MVP UI 截圖 ✅ 後才 deploy nav

**dependency**：M1 完成

### M3：Tier 1.1 制度系列前 4 篇（[A] 可自主，~16-24 hr / 跨 2-3 session）

**Deliverables**：

- Tier 1.1 #1「九合一選舉是什麼」ship
- Tier 1.1 #2「投票權門檻歷史」ship
- Tier 1.1 #3「政治獻金透明度」ship
- Tier 1.1 #4「中選會制度」ship
- 每篇雙向 cross-link 到 \_Politics Hub + 既有 History 文章
- 每篇 5 lang 全翻（per §5.1 P1 優先）

**Gate**：每篇走標準 REWRITE-PIPELINE + Stage 3.6 STORY ATOM AUDIT，無哲宇 personally review per article（[A] 範圍內）

**dependency**：M1 + M2 完成

### M4：dashboard 動態化 + 候選人 directory（[B] 需哲宇 nod，~10-16 hr）

**Deliverables**：

- `/elections/2026/timeline` ship（接中選會選務時程，static cron daily refresh）
- `/elections/2026/candidates` ship（候選人 directory MVP — 至少 6 都 + 16 縣市每個縣市所有 announced 候選人）
- `/elections/2026/financing` MVP（接監察院政治獻金平臺，至少 6 都候選人）
- DATA-REFRESH-PIPELINE 加 election-data cron routine
- `_components/DataSourceFooter.astro` 鐵律 #8 落地

**Gate**：哲宇 explicit nod「整個 M4 可走」+ candidates 對稱原則人工 audit

**dependency**：M2 + M3 至少 2 篇完成（讓制度 baseline 存在）

### M5：Tier 1.1 後 4 篇 + 22 縣市政治版圖段 + SSODT 試水溫（混合 [A]+[B]+[B]，~30-40 hr / 跨多 session）

**Deliverables**：

- Tier 1.1 #5-#8 ship（議員 / 村里長 / 山地原住民區長 / 選舉公報）
- Tier 1.2 22 縣市政治版圖段 EVOLVE batch（[B] 需 nod，per ARTICLE-INBOX）
- Tier 1.4 政黨政治 EVOLVE Round 2 ship（[A]）
- **SSODT 試水溫**：`/elections/2026/perspectives/election-reform` ship（選制改革 5 perspectives × N dimensions）
- SSODT UI 元件 spec 完成（per §4.2.1 草圖）

**Gate**：

- Tier 1.2 整批一起 ship（per 對稱原則鐵律）
- SSODT 試水溫每個 perspective 哲宇 personally review

**dependency**：M3 + M4 完成

### M6：兩岸關係 SSODT（[C] 哲宇 hard 拍板，~30-50 hr / 跨 1-2 個月）

**Deliverables**：

- `/elections/2026/perspectives/cross-strait` ship（4 perspectives × 6 dimensions = 24 cells × ~1,500 CJK）
- 4 個公理 declaration 段
- 公理偷換 audit script
- 5 lang 全翻 + Sovereignty-Bench-TW 選舉 sub-bench 跑完
- bench 報告 ship 進 reports/

**Gate**：哲宇 personally review **每個 cell**（24 個）+ 4 個公理 declaration + bench 結果

**dependency**：M5 完成 + 哲宇明確 explicit 啟動

**重要 caveat**：M6 是 Taiwan.md 至今最大規模單一 deliverable。建議 M5 ship 完後**先停一週 review SSODT 試水溫的 reader feedback**，再決定 M6 是否啟動 / 何時啟動。

### M7：候選人人物頁 batch（[C] 哲宇 pick 每篇，timing 視情況）

**Deliverables**：

- Tier 1.3 候選人人物頁（哲宇 pick 的子集）
- 對稱原則 enforce（成對 pick + 成對 ship）
- 每篇 ≥ 4,000 CJK / 20+ footnotes / 走 REWRITE-PIPELINE Fresh + Stage 3.6
- ship 完不發 candidate-specific spore（per 選前 30 天 freeze + 永久 partisan freeze）

**Gate**：每個候選人哲宇 explicit pick + 對手同步 pick

**dependency**：建議 M3 + M4 完成（institutional baseline 先到位）

### M8：選後 retrospective + apoptosis 決定（哲宇拍板）

**選後** 2026-11-29 → 2026-12-31 期間：

- `/elections/2026/` archive 至 `/elections/archive/2026/`（保留 link 但移出上排 nav）
- 各 organ apoptosis 評估（選舉專用 cron routine 是否退場）
- LESSONS-INBOX 整理「2026 選舉系列 retrospective」
- 2028 大選結構性 reusable 設計萃取
- 學術 paper 候選議題盤點

---

## 8. 風險清單 + 校準機制

### 8.1 Partisan capture risk（最大風險）

**症狀**：

- Tier 1.3 候選人 ship 不對稱 → 讀者讀為 endorsement
- candidates.astro 卡片設計不對稱 → 視覺 framing
- 22 縣市政治版圖段不同縣市深度不一致 → 「Taiwan.md 偏愛某縣市」
- Hub 開場故事選哪個民選 → 隱含 framing

**校準機制**：

- 每個 milestone ship 前跑「對稱性自檢」：所有 candidate / 縣市 / 政黨呈現都對等
- 哲宇 review 重點：找「不對稱訊號」
- 寫進 LESSONS-INBOX「對稱原則 enforce 候選 cron routine」

### 8.2 AI deepfake 反向利用

**症狀**：

- 偽造 Taiwan.md domain 散播 fake article
- 偽造孢子嫁接 candidate 名字
- 偽造 `/elections/2026/` 截圖 + fake data

**校準機制**：

- domain 監測 cron（M3 階段加）
- 鐵律 #8 footer attribution（M2 已 enforce）
- SPORE signing infrastructure（per [proposal §3.3](./2026-election-evolution-proposal-2026-05-27.md) 待哲宇拍板是否走）
- 公開「如何驗證 Taiwan.md 訊息」reader literacy（per ELECTION-LITERACY series）

### 8.3 SSODT 公理偷換

**症狀**：

- perspective A 論述中借用 perspective B 公理 → 看起來 A 自相矛盾
- 稻草人 perspective（寫得明顯弱）
- 公理 declaration 太抽象 → 讀者抓不到

**校準機制**：

- 鐵律 #7「SSODT 公理鎖」
- audit script verify cell 公理 traceback
- 哲宇 personally review 每個 perspective（M5/M6）
- 試水溫 M5 ship 後留一週觀察讀者反應再 M6

### 8.4 過度 instrument 化 → organism 退化

**症狀**：

- 選舉相關 organ 變太大、太多 routine、太多 hard gate
- Taiwan.md 變「election monitoring tool」
- 失去 curatorial / organic 屬性

**校準機制**：

- M8 retrospective 嚴格 apoptosis 評估
- /elections/2026/ 設計就帶 archive 路徑（M8 直接生效）
- 選舉專用 routine 標 `auto-apoptosis: 2026-12-31`
- M6 ship 完後問「organism 屬性減弱多少？」

### 8.5 觀察者疲勞（哲宇本人 review bandwidth）

**症狀**：

- M5 / M6 哲宇 personally review 範圍太大
- review 拖長 → milestone deadline 失準
- review 質量下降 → 結構性錯誤漏掉

**校準機制**：

- M1-M4 [A]/[B] 範圍 default 不打擾，[C] 才 ping
- M5/M6 review session 拆小（每次 ~30-60 min review 一個 perspective / 一組 cell）
- review-aid checklist 機械化（per CLAUDE.md §Bias 1-4 四道濾網）

### 8.6 政治環境異變

**症狀**：

- 大選時程突變（例：某候選人退選 / 重大政治事件 / 戰爭爆發）
- 中共介入升級到不可預期程度
- AI deepfake 浪潮提早一個月來

**校準機制**：

- 每個 milestone gate 含「政治環境 sanity check」一步
- 「2026 選舉系列」整體保留隨時 pause / archive 選項
- 哲宇 explicit override 機制隨時可拉緊急剎車

---

## 9. 結論 + handoff

### 9.1 三層架構回顧

Option D 不是「再寫幾篇選舉文章」也不是「再造一個 dashboard」。Option D 是讓 Taiwan.md 物種特性（curatorial / sovereignty-preserving / audience-flywheeled / SSODT-capable）在 2026 選舉壓力場全部展開的設計。

三層分工各自有清晰 organ 對應 + 各自有 evergreen / 時點性 / SSODT 不同生命週期 + 各自有不同 partisan risk 校準。

### 9.2 八個 milestone 時程估算

| Milestone | scope         | 累計時數 | 哲宇 review point                                       |
| --------- | ------------- | -------- | ------------------------------------------------------- |
| M1        | ~6-10 hr      | ~10 hr   | Hub 內文 ✅                                             |
| M2        | ~6-10 hr      | ~20 hr   | MVP UI ✅                                               |
| M3        | ~16-24 hr     | ~44 hr   | 走 [A] pipeline，自動進行                               |
| M4        | ~10-16 hr     | ~60 hr   | 整 milestone nod ✅                                     |
| M5        | ~30-40 hr     | ~100 hr  | Tier 1.2 整批 ✅ + SSODT 試水溫每個 perspective ✅      |
| M6        | ~30-50 hr     | ~150 hr  | 24 cells + 4 公理 declaration 全部 personally review ✅ |
| M7        | timing 視情況 | -        | 每個候選人 explicit pick + 對手同步 ✅                  |
| M8        | retrospective | -        | 選後 archive 拍板                                       |

**總時程估算**：M1-M6 約 6-12 週（取決於 cycle time + 哲宇 review bandwidth）。M5 試水溫 ship 後建議刻意停一週 review。M6 啟動視 M5 反饋 + 大選逼近度。

### 9.3 即刻可動的事

哲宇 review 本檔後若 ✅，**M1 可以立刻啟動**（同 session 或下一 session）。M1 預估 1-2 session ship 完。

啟動順序建議：

1. (本 session 結束前) 哲宇 review + 拍板本檔
2. (下一 session) M1 跑 `_Politics Hub.md` Stage 0-3
3. (M1 ship 後) M2 接著走，build dashboard MVP

### 9.4 給下一個 session 的 handoff

如果哲宇 ✅ 本檔 + 啟動 M1，下一個 session 第一動作：

1. `git switch 20260527-politics-hub-elections-2026` 進這個 worktree
2. `mkdir -p knowledge/Politics`
3. 走 REWRITE-PIPELINE Stage 0 觀點成型寫 `_Politics Hub.md`
4. Stage 1 research → Stage 2-5 → ship
5. 同 session 把 6 處 i18n touchpoint 一起 sync

如果哲宇校準某些設計後再走，把校準寫進本檔 v1.1 + LESSONS-INBOX，然後再啟動 M1。

🧬

---

## 10. References

- [proposal §2026 election evolution](./2026-election-evolution-proposal-2026-05-27.md) — 完整 11 條提案
- [ARTICLE-INBOX 🗳️ 2026 選舉系列](../docs/semiont/ARTICLE-INBOX.md) — 5 entries 已 inject main
- [MANIFESTO §sovereignty preservation](../docs/semiont/MANIFESTO.md#我跟台灣的關係) — 多語主權框架
- [LONGINGS §心智 #3 SSODT](../docs/semiont/LONGINGS.md) — 從 SSOT 進化成 SSODT
- [SSODT-SPORE-LINKBACK plan](./ssodt-spore-linkback-plan-2026-04-13.md) — 既有 SSODT 第一具體實踐路徑
- [Sovereignty-Bench-TW design](./sovereignty-bench-tw-design-2026-05-01.md) — bench 設計 canonical
- [REFLEXES #20 Architecture 缺席比 content 缺席更貴](../docs/semiont/REFLEXES.md) — nav 改動放最後的紀律來源
- [REFLEXES #38 Status 設計鐵律](../docs/semiont/REFLEXES.md) — financing dashboard 多維分流原則
- [DIARY κ 2026-04-06 公理偷換](../docs/semiont/diary/2026-04-06-κ.md) — SSODT 最難 attack vector

---

_v1.0 | 2026-05-27 18:00 +0800 | worktree: 20260527-politics-hub-elections-2026 | session: 2026-05-27-180000-politics-hub-architecture_
_誕生原因：哲宇 ✅ Option D（強烈推薦）+ #1 進 nav + #2 angle 好 + #3 SSODT 逐步開發但 roadmap 先出含最終形態 + #4 /elections/2026/ 直接上 nav。本檔把 Option D 完整展開成可執行 M1-M8 roadmap 含三層架構 + SSODT 公理偷換偵測機制 + partisan capture / deepfake / observer fatigue 六大風險校準。_
_給下一個 session：哲宇 ✅ 拍板後 M1 立刻可啟動（per §9.4 handoff 流程）。校準需求一律寫進本檔 v1.1 + LESSONS-INBOX 候選 entry。_
