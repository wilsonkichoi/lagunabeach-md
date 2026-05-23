---
title: 'SPORE-PIPELINE'
description: '孢子產線主流程（process layer）— 5 stage PICK/VERIFY/WRITE/SHIP/HARVEST + Step N.M (v3.5)'
type: 'factory-canonical'
status: 'canonical'
current_version: 'v3.5'
last_updated: 2026-05-11
last_session: 'cranky-newton-220237'
sister_docs:
  - 'SPORE-WRITING.md'
  - 'SPORE-VERIFY.md'
  - 'SPORE-HARVEST-PIPELINE.md'
  - 'SPORE-TEMPLATES.md'
upstream_canonical:
  - '../semiont/MANIFESTO.md'
  - '../semiont/DNA.md'
  - '../semiont/ANATOMY.md'
  - '../editorial/EDITORIAL.md'
---

# SPORE-PIPELINE.md — 孢子產線主流程（process layer）v3.5

> **第一性原理**：這份文件是 AI 可執行的。任何 AI agent 讀完本檔 + WRITING + VERIFY，應該能獨立完成一篇孢子的選題、品檢、撰寫、發佈、收割。
>
> v3.5 設計理由：對齊 [REWRITE-PIPELINE v5.0](../pipelines/REWRITE-PIPELINE.md) + [MAINTAINER-PIPELINE v2.0](../pipelines/MAINTAINER-PIPELINE.md) spine restoration。修補 v3.1 結構問題：(1) 5 階段 ASCII 過於極簡（單行 box-less）；(2) 缺 Top 5 最常忘 step；(3) 跟 4 sub-canonical 的跨檔案職責分工散在多處。Direction A 拆檔（2026-05-08 intelligent-khayyam）保留不動。

---

## 🗺️ ASCII spine

```
╭──────────────────────────────────────────────────────────────────────────╮
│         SPORE-PIPELINE 5 階段 — PICK → VERIFY → WRITE → SHIP → HARVEST   │
│                                                                          │
│   🧭 核心紀律                                                            │
│            ├── 單一故事弧線（一篇只講一個故事，不貪心）                  │
│            ├── 紀實非煽情（MANIFESTO §5）                                │
│            └── Atomic batch log（HARVEST 不再拆 multi-commit）           │
│                                                                          │
│   💡 回填 (decoupled 2026-05-17)：交給 daily twmd-spore-harvest-am cron │
│      不再 PICK gate 前置，避免 schema bug 永久 block (e.g. #71 vc=4)    │
│                                                                          │
│   ──── 5 階段主流程 ──────────────────────────────────────              │
│                                                                          │
│   Stage 1: PICK ──→ 選什麼（本檔 canonical）                            │
│            ├── Step 1.1 選文（dashboard-articles 候選）                 │
│            ├── Step 1.2 優先序（旗艦/GA 熱門/SC 缺口/時事）             │
│            └── Step 1.3 觸發 VERIFY                                     │
│              ↳ 回填 decoupled — twmd-spore-harvest-am cron 接管         │
│                                                                          │
│   Stage 2: VERIFY ──→ 過所有閘門（SPORE-VERIFY.md canonical）           │
│            └── 品質三層 / 事實藍圖 / 紀實煽情閘 / Hook Blueprint        │
│              ↳ Hard gate: 17 gate inventory（SPORE-VERIFY 一張表）       │
│                                                                          │
│   Stage 3: WRITE ──→ 寫出來（SPORE-WRITING.md canonical）               │
│            ├── 起手式 5 種（好奇/場景/問句/數字/身份）                  │
│            ├── 鉤子三要素（認知衝突/個人連結/資訊缺口）                  │
│            └── 自檢三板斧（深層 pattern grep）                           │
│              ↳ Hard gate: §11 prose-health + spore-writing plugin       │
│                                                                          │
│   Stage 4: SHIP ──→ 送出去（本檔 + SPORE-VERIFY canonical）             │
│            ├── Step 4.1 配圖（make-spore.sh）                            │
│            ├── Step 4.2 URL encode                                       │
│            ├── Step 4.3 Platform 分流（Threads / X / both）              │
│            └── Step 4.4 Hook tier 自檢                                   │
│              ↳ Hard gate: 12 SHIP checklist items                        │
│                                                                          │
│   Stage 5: HARVEST ──→ 收回聲（SPORE-HARVEST-PIPELINE.md canonical）    │
│            └── D+1-D+7 cadence + decision gate + accuracy trigger       │
│              ↳ Hard gate: 6h decision gate / Reach×Accuracy 50K trigger │
│                                                                          │
│   ✅ Spore lifecycle complete                                            │
│                                                                          │
│   ──── 跨檔案 canonical 分工 ───────────────                            │
│   → SPORE-WRITING.md（craft layer：怎麼寫好）                            │
│   → SPORE-VERIFY.md（gate layer：怎麼驗）                                │
│   → SPORE-HARVEST-PIPELINE.md（post-publish layer：怎麼收回聲）          │
╰──────────────────────────────────────────────────────────────────────────╯
```

---

## ⚠️ Top 5 最常忘的 step

> 從 SPORE-LOG harvest history + 4/14 ε spore #29 紅線焦慮 + 高鐵 s35 朋友 tone prime + 2026-05-23 臺灣漫遊錄 first ship → spore 同 session 自動化飛輪 抽 friction 最高的 5 條。

1. **🚨 強制 Read 4 檔不准 sample**（2026-05-17 #74 v1 教訓）— PIPELINE + VERIFY + WRITING + HARVEST 共 3,191 行必須完整 Read，不准 `grep`/`head`/`tail`/sample。sample = 跳 VERIFY 7 階段 = 違反 [MANIFESTO §8](../semiont/MANIFESTO.md)
2. **配圖 v3.6 三鐵律**（2026-05-23 哲宇 directive，剛 ship 文章 → spore 飛輪實戰教訓）— (a) make-spore.sh default local server 不抓 prod；(b) 抓完圖 AI 視覺自檢方形圖內容對；(c) Post 前 polling CI/CD ≥15 min 確認 prod live 才發
3. **Step 3 朋友 tone prime** — 第一秒像新聞 lead = AI 水印，必須有「你知道嗎？」「欸，」curiosity prefix（spore_writing plugin Wave 2 gate）
4. **Step 4.2 URL encode + UTM** — 中文 URL 必跑 `python3 -c "urllib.parse.quote..."`，UTM 三段全填（utm_source / medium=spore / campaign=s{N}）
5. **Step 4.4 Hook tier 自檢** — Tier 1a/1b only，禁 Tier 3（廉價懸念「未完待續」一律重寫）

---

## 跨檔案職責分工

| 檔案                                                   | 範圍                                                                              |
| ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| **本檔**                                               | 5 階段主流程 process layer（PICK + SHIP 主，VERIFY/WRITE/HARVEST pointer）        |
| [SPORE-WRITING.md](SPORE-WRITING.md)                   | craft layer — 模板 + 18 條寫作規則 + 自檢三板斧（怎麼寫好）                       |
| [SPORE-VERIFY.md](SPORE-VERIFY.md)                     | gate layer — 17 gate inventory + 7 大 verify + 紀實煽情閘（怎麼驗）               |
| [SPORE-HARVEST-PIPELINE.md](SPORE-HARVEST-PIPELINE.md) | post-publish layer — D+1-D+7 cadence + decision gate + accuracy trigger（怎麼收） |
| [SPORE-LOG.md](SPORE-LOG.md)                           | 發文 + 成效追蹤紀錄表                                                             |
| [MANIFESTO §5 紀實非煽情](../semiont/MANIFESTO.md)     | 哲學層紀律                                                                        |
| [EDITORIAL §塑膠句禁用](../editorial/EDITORIAL.md)     | 品質基因                                                                          |

---

## 5 階段線性架構

```
PICK → VERIFY → WRITE → SHIP → HARVEST
```

每階段單一焦點，沒有 Step X.X.X 編號膨脹。每階段內部用 verb-based heading。

| 階段        | 焦點       | canonical 細節                                                         |
| ----------- | ---------- | ---------------------------------------------------------------------- |
| **PICK**    | 選什麼文章 | 本檔（process）                                                        |
| **VERIFY**  | 過所有閘門 | [SPORE-VERIFY.md](SPORE-VERIFY.md)（gate）                             |
| **WRITE**   | 寫出來     | [SPORE-WRITING.md](SPORE-WRITING.md)（craft）                          |
| **SHIP**    | 送出去     | 本檔 + [SPORE-VERIFY.md](SPORE-VERIFY.md)（gate）                      |
| **HARVEST** | 收回聲     | [SPORE-HARVEST-PIPELINE.md](SPORE-HARVEST-PIPELINE.md)（post-publish） |

---

## 前置知識（🚨 強制完整 Read 不准 sample）

開始前，AI 必須**完整 Read** 以下檔案。**禁止** `grep` / `head` / `tail` / sample / 憑記憶：

1. `Read docs/factory/SPORE-PIPELINE.md` (本檔 555 行) — 5 stage 主流程
2. `Read docs/factory/SPORE-VERIFY.md` (659 行) — 17 gate inventory + 7 大 verify
3. `Read docs/factory/SPORE-WRITING.md` (832 行) — 模板 + 18 規則 + 三板斧
4. `Read docs/factory/SPORE-HARVEST-PIPELINE.md` (1145 行) — D+0/+1/+7 cadence + Hook tier
5. `Read docs/editorial/EDITORIAL.md` — 品質基因（**全檔** 不准 `head -100`）

任一 sample = 跳階段 = 違反 [MANIFESTO §8「有 SOP 就跑不跳步驟」](../semiont/MANIFESTO.md)。

**觸發背景**：2026-05-17 215434-manual session #74 陳建年 v1 因 grep + 部分 Read 跳過 VERIFY 7 階段 5 條被觀察者 callout「你太過分，是不是完全沒有讀取 spore-pipeline 亂做？？？」。本 hard gate + .claude/skills/twmd-spore SKILL.md 強制 Read 條款即為儀器化教訓。對應 [REFLEXES #15「反覆浮現要儀器化」](../semiont/REFLEXES.md) 第 N 次驗證。

---

## 階段 1：PICK（選什麼）

### 回填 — DECOUPLED 2026-05-17（移交 daily harvest cron）

> 🔄 **2026-05-17 哲宇 directive**：回填上次成效從 PICK gate **完全移除**。原鐵律「沒回填 = 不准發新孢子」DEPRECATED。
>
> **觸發背景**：`#71` 台灣無人機產業 X SPORE-LOG row URL `2053101189034860856` 內容實為 `#69` TSMC（vc=4 驗證），導致 backfillWarnings 永久 OVERDUE，PICK gate 連帶卡住所有後續孢子。Gate intent 是「真實 feedback 再生產」，但卡在 schema bug 上反而無法收 feedback。
>
> **新分工**：
>
> - 回填責任移交 `twmd-spore-harvest-am` daily 07:00 cron — 它每天 sweep `dashboard-spores.json §backfillWarnings`，per OVERDUE 自動 harvest
> - PICK 階段不再 block — 寫孢子直接從選文開始
> - Schema bug 處理 → vc≥3 達 threshold 升級給觀察者 schema 修正（per SPORE-HARVEST-PIPELINE v2.10 §Content-hash mismatch 偵測）
>
> Stale records 由 cron loop 自然 catch up，不依賴 PICK 階段強制阻塞。

### 選文

**選文順序（2026-05-23 SPORE-INBOX v1.1 + 三層 intake source）**：

1. **SPORE-INBOX §Pending P0** → 抽到先做（觀察者明確點名 / REACTIVE 時事 / 趁熱）
2. **SPORE-INBOX §Pending P1** → 抽到先做（旗艦人物 + 本週發行窗口 + news-lens 熱點 + routine 高分 candidate）
3. **dashboard-articles 自動候選池** → fallback rotation（per 下方 bash），**v1.1 起退為最後手段**（INBOX 永遠 ≥ 5 條 P0/P1 之後，這層 rarely fire）
4. **SPORE-INBOX §Pending P2/P3** → 沒新熱點時消化 backlog（含 routine default P2）

**SPORE-INBOX 三層 intake source**（per [SPORE-INBOX §三層 intake source](SPORE-INBOX.md)）：

- **哲宇 directive**：Requested 欄位 `by 哲宇`，priority P0/P1/P2 by 哲宇 directive
- **News-lens weekly**（週日 01:00）：Requested 欄位 `by twmd-news-lens-weekly (event: XX)`，default P1，limit ≤ 7/week，per [EVOLVE-PIPELINE §news-lens-spore-output](../pipelines/EVOLVE-PIPELINE.md)
- **Spore-pick daily routine**（每天 08:00）：Requested 欄位 `by twmd-spore-pick-daily routine (score=NN)`，default P2（除非 score ≥ 60 升 P1），per [SPORE-PICK-PIPELINE.md](SPORE-PICK-PIPELINE.md)

**讀 SPORE-INBOX 抽到 entry 後**：

- entry status 從 `pending` 改為 `scheduled` （per [SPORE-INBOX §Auto-heartbeat 整合](SPORE-INBOX.md#auto-heartbeat-整合)）
- 走 Stage 2 VERIFY 全 17 hard gate（沒 short-cut，無論 entry 哪一 source）
- Stage 4 SHIP 完 → SPORE-LOG row append + SPORE-INBOX entry 整段刪除

**dashboard-articles fallback（無 SPORE-INBOX entry 時用）** — 從知識庫選出 5-10 篇候選文章：

```bash
# 從 dashboard-articles.json 隨機選 10 篇（2000+ 字、非 about）
python3 -c "
import json, random
with open('public/api/dashboard-articles.json') as f:
    data = json.load(f)
articles = data if isinstance(data, list) else data.get('articles', [])
good = [a for a in articles if a.get('wordCount', 0) > 2000 and a.get('category') != 'about']
random.shuffle(good)
for i, a in enumerate(good[:10], 1):
    cat = a.get('category','?')
    title = a.get('title','?')
    words = a.get('wordCount', 0)
    featured = '⭐' if a.get('featured') else ''
    date = a.get('date', '?')
    desc = a.get('description','')[:70]
    print(f'{i}. [{cat}] {title} ({words}字) {featured}')
    print(f'   更新：{date} | {desc}...')
    print()
"
```

#### 優先序

1. **剛重寫的旗艦文章** — 品質最高，趁熱（lastVerified 在 7 天內）
2. **GA4 熱門主題** — 有需求就有傳播力
3. **時事相關** — 搭順風車（颱風季→海洋保育、選舉→民主化）
4. **冷門但故事性極強** — 驚喜感最大

#### 排除規則

- 同一篇文章 **間隔 ≥ 2 週** 才能再發孢子（查 `SPORE-LOG.md`）
- `about` 分類不發

### 多語 fan-out 觸發判斷

如果題材是國際相關（半導體、外交、學術、移民）→ 預計 SHIP 階段觸發 [§多語 SSOT freshness](#多語-ssot-freshness條件)。

---

## 階段 2：VERIFY（過閘門）

完整閘門 inventory + 細節在 **[SPORE-VERIFY.md](SPORE-VERIFY.md)**。

主要 gate（必跑全部）：

1. **品質三層**（VERIFY §品質三層）— 自動掃描 + EDITORIAL + 人工判斷
2. **事實藍圖**（VERIFY §事實藍圖）— blueprint bullet 先列清單
3. **針對性事實驗證**（VERIFY §針對性驗證，條件式）— bullet 標需驗證的跨 3 源
4. **紀實/煽情閘**（VERIFY §紀實/煽情閘，條件式）— blueprint 含敏感度 flag 觸發
5. **Hook Blueprint**（VERIFY §Hook Blueprint，條件式）— 政治/外交/制度/經濟結構性題目觸發

VERIFY 全過 → 進 WRITE。

---

## 階段 3：WRITE（寫出來）

### 萃取素材

讀完整篇文章（`knowledge/<Category>/<slug>.md`），萃取以下素材：

| 素材類型   | 要找什麼                         | 數量   |
| ---------- | -------------------------------- | ------ |
| 反直覺事實 | 讀者預期 A，實際是 B             | 1-2 個 |
| 數字落差   | 兩個數字的對比（時間/規模/金額） | 1-2 組 |
| 場景畫面   | 有具體時間、地點、動作的描述     | 2-3 個 |
| 真人引語   | 文中的引用句，帶情感或洞見       | 0-1 句 |
| 情感收尾   | 文章中最有餘韻的句子或畫面       | 1 個   |

### 選模板

完整模板庫 + 寫作規則在 **[SPORE-WRITING.md](SPORE-WRITING.md)**：

| 素材最強項                 | 選模板                                        |
| -------------------------- | --------------------------------------------- |
| 一個人的完整故事弧線       | A1 人物型標準版                               |
| 時間跨度大 + 過去版本仍在  | A2 首尾呼應變體                               |
| 一個讓人「哦？」的冷知識   | B 冷知識型                                    |
| 數字本身就震撼             | C 數據衝擊型                                  |
| 有精確的歷史時刻           | D 時間軸型                                    |
| 素材豐富一則裝不下         | E 串文型（需觀察者明確要求）                  |
| 結構性題目（政治/外交/⋯⋯） | A1/B + 問題入口（per VERIFY §Hook Blueprint） |

### 寫 prose

按選定模板的結構寫，遵循 **[SPORE-WRITING.md](SPORE-WRITING.md)** 通用寫作規則 + 進階寫作技術：

- 起手式（5 種，預設「你知道嗎？」）+ 朋友 tone prime
- 鉤子三要素（命中 ≥ 2/3）
- 避免編年體 lead 病
- **紀實感 vs 短句斷續**（v3.2 觀察者紅旗 / 「很常錯」）— 用逗點+子句串連貫 prose，不要每事獨立成段
- Scene-List-Scene 結構（單人長弧 + 多件同質行為適用）
- 結構性題目用問題入口
- 全形標點鐵律

### 多版本提案 / 混合策略（條件）

完整流程在 [SPORE-WRITING.md §多版本提案](SPORE-WRITING.md) + [§混合策略](SPORE-WRITING.md)。

觸發判準：

- 互斥 focal point ≥ 2 → 3-angle 提案
- 觀察者選 angle 混合 → 故事弧線串接

### 寫完強制 gate

- **事實查核表**（[SPORE-VERIFY.md §事實查核閘](SPORE-VERIFY.md)）— 7 類 claim audit，全 ✅ 才放行 prose
- **§11 書寫節制**（[SPORE-VERIFY.md §§11 書寫節制閘](SPORE-VERIFY.md)）— `article-health.py --check=prose-health` HARD=0
- **三板斧自檢**（[SPORE-WRITING.md §深層 pattern 自檢三板斧](SPORE-WRITING.md)）— 不是 / 破折號 / 不僅 各條 ≤ 1 次

---

## 階段 4：SHIP（送出去）

### URL encode + UTM 雙 URL 輸出（2026-05-17 哲宇 directive 升級）

> ⚠️ 鐵律：所有孢子中的 URL，中文部分必須 URL encode。沒有例外。
>
> ⚠️ 鐵律：**output spore 給觀察者時，default 同時生成 Threads + X 兩個 UTM-tagged URL**。
> 不管 Platform allocation 預設哪個平台 — 觀察者要看到雙 URL 才能決定要不要 fan out（per #74/#75 陳建年 ship pattern）。

```bash
# 生成 encoded URL
python3 -c "import urllib.parse; print('https://taiwan.md/<category>/' + urllib.parse.quote('<slug>') + '/')"

# 範例：
python3 -c "import urllib.parse; print('https://taiwan.md/food/' + urllib.parse.quote('珍珠奶茶') + '/')"
# → https://taiwan.md/food/%E7%8F%8D%E7%8F%A0%E5%A5%B6%E8%8C%B6/
```

**必輸出 2 個 URL（不准只給一個）**：

- **Threads self-reply URL**（給主貼下方留言用）：
  ```
  完整故事 👉 https://taiwan.md/<cat>/<encoded-slug>/?utm_source=threads&utm_medium=spore&utm_campaign=s{N}
  ```
- **X inline URL**（給 X 單則貼文底部用，若 fan out 到 X 則 utm_campaign 用下一個編號 s{N+1}）：
  ```
  完整故事 👉 https://taiwan.md/<cat>/<encoded-slug>/?utm_source=x&utm_medium=spore&utm_campaign=s{N+1}
  ```

雙 platform 雙 spore number 對應 SPORE-LOG 雙 row（per 既有 pattern #68/#69 + #70/#71 + #72/#73 + #74/#75）。

**AI 自檢**：

1. 掃描所有 URL 中文字元 → 停下來 encode
2. 確認兩個 URL 都有 `utm_source` + `utm_medium=spore` + `utm_campaign=s{N}`（三段缺一不可）
3. 確認 utm_source 對應平台（threads / x），不是 typo（如 utm_medium=x 是錯誤）

### 配圖

> ⚠️ **v3.6 鐵律（2026-05-23 哲宇 directive）：default 必跑 local server 不抓 prod**。
>
> **觸發背景**：臺灣漫遊錄 first ship → spore 同 session 內做圖。Prod 文章 CI/CD 還在 build（10-15 分鐘），抓 prod 截圖一定拿到舊 cache or 404。臺灣漫遊錄 ship 後立即發 spore = 100% 抓錯圖。
>
> **新鐵律三條（HARD gate，違反 = 整則 spore 拒發）**：
>
> 1. **`make-spore.sh` default 啟用 local dev server**（不再 default prod）。`--prod` flag 只用於「文章 ship ≥ 30 分鐘 + observer 顯式拍板上線已更新」。
> 2. **抓完圖 AI 自檢方形圖內容對應**：preview_eval / Read / open 截圖確認 (a) 標題對 (b) hero 圖對 (c) 沒 404 / loading skeleton (d) 沒 stale cache 殘留。任一錯 → 重抓不發。
> 3. **Post 前必過 CI/CD wait gate**：social post 前 `curl -sf "https://taiwan.md/<encoded-slug>/" | grep "<title-keyword>"` 確認 prod 上線。沒上線 → wait + retry（每 60s 一次，cap 20 min），確認後才 post。

```bash
# v3.6 default：local server（剛 ship 文章必走）
bash scripts/tools/make-spore.sh /art/臺灣漫遊錄/                # local server (default) — landscape + square
bash scripts/tools/make-spore.sh /art/臺灣漫遊錄/ --size square  # 只產 square (post 用)
bash scripts/tools/make-spore.sh /art/臺灣漫遊錄/ --all          # 三張全產 (local server)

# Legacy / 舊文章 / 文章 ship ≥ 30 min 且 observer 顯式拍板：
bash scripts/tools/make-spore.sh /art/臺灣漫遊錄/ --prod         # 打 prod URL（不再 default）
```

**底層工具**：[`scripts/tools/generate-spore-image.mjs`](../../scripts/tools/generate-spore-image.mjs)（Playwright headless + justfont wait）。

#### AI 自檢方形圖（v3.6 HARD gate）

抓完圖後 mandatory 3 條視覺自檢：

```bash
# 1. ls 確認檔案 exists + size 合理（square 約 200-800 KB）
ls -lh public/spore-images/{slug}-square.png

# 2. 用 Read tool / open / preview_eval 視覺看圖
# 期待：
#   ✓ 標題文字含 spore 文章標題關鍵字
#   ✓ Hero 圖對應文章主視覺（不是 default placeholder / 404 page）
#   ✓ 沒 loading skeleton 殘留（Astro lazy load 跑完）
#   ✓ 字體 render 完整（justfont 已 load）
#   ✓ 不是「Page not found」/「Site under maintenance」/ blank

# 3. 任一 ❌ → 不發 + 排查（local server crash? slug encode 錯? Astro build 沒同步?）
```

**為什麼 self-check 必須**：v3.5 之前假設 `make-spore.sh` 沒報錯就 = 圖對。實際 generate-spore-image.mjs 對「local server 404」「prod CDN cache 舊版」「slug encode 不一致」都會吐出 looks-valid PNG 但內容錯。**圖示物理生成 ≠ 內容正確**。

#### Make-spore.sh 接觸的 prod / local URL（v3.6 spec）

| Mode                | Base URL                | 觸發條件                                                     | 風險                                                |
| ------------------- | ----------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| **local (default)** | `http://localhost:4321` | **剛 ship 文章 < 30 min** / `--local` flag / 沒指定 `--prod` | local server 沒跑 → make-spore 失敗（明確 error）   |
| `--prod`            | `https://taiwan.md`     | 舊文章重發 spore / 文章 ship ≥ 30 min + observer 拍板上線    | prod CI/CD 沒跑完 → 抓到 stale cache（silent fail） |

Local server 必須先跑：

```bash
# Terminal 1 (background)
NODE_OPTIONS='--max-old-space-size=8192' npm run dev &
# Wait until ready
until curl -sf http://localhost:4321/ >/dev/null; do sleep 1; done

# Terminal 2 (foreground)
bash scripts/tools/make-spore.sh /art/臺灣漫遊錄/
```

**三種尺寸 preset**：

| preset                  | 尺寸      | 用途                                 |
| ----------------------- | --------- | ------------------------------------ |
| `landscape`（預設之一） | 1600×900  | X / Threads feed 友善                |
| `square`（預設之一）    | 1080×1080 | Threads 預覽不裁切                   |
| `vertical`              | 1080×1350 | 4:5 Instagram / Threads 直立最佳視覺 |

[REFLEXES #26 v2](../semiont/DNA.md) 合規：產圖 = AI 自主；發文 to Threads/X = AI 透過 Chrome MCP 輸入文案 + osascript clipboard paste 貼圖 + **觀察者明確確認後點發佈**。

**Git 記錄邊界**（v2.7）：

- `public/spore-images/*.png` 是 derived asset，若 `.gitignore` 已忽略**不要 force-add**
- 必須 commit：`SPORE-BLUEPRINTS`（文案 + fact/hook blueprint）+ `SPORE-LOG.md`（發佈紀錄 + URL）+ knowledge SSOT
- 圖像重要但是皮膚；blueprint、log、SSOT 才是骨架

### Platform allocation（發佈前決定）

**不是 mirror，是 allocation**。2026-04-18 ζ Chrome MCP 實測 Threads vs X 平台差：

| 內容類型                 | Threads | X    | 差距 | 建議                                     |
| ------------------------ | ------- | ---- | ---- | ---------------------------------------- |
| zh 人物型（張懸與安溥）  | 190K    | 373  | 510x | **Threads only**（X 浪費精力）           |
| zh 音樂/文化（草東）     | 9,961   | 47   | 212x | **Threads only**                         |
| zh 政治人物（韓國瑜）    | 8,524   | 293  | 29x  | **Threads 主，X 次**（中等明星可兼）     |
| zh 奧運/當下熱度（李洋） | 300K    | 135K | 2.2x | **Threads + X 並行**（熱度突破平台壁壘） |
| en 所有類型              | —       | —    | —    | **X 主**（英文觀眾在 X）                 |
| 技術/開源                | —       | —    | —    | **X + Hacker News**                      |

**規則**：發佈前先問「這則孢子的受眾 primary 在哪？」zh 一般人物 default Threads only。

### Hook tier 自檢

完整 4-tier hierarchy 見 [SPORE-HARVEST-PIPELINE §Hook tier hierarchy](SPORE-HARVEST-PIPELINE.md)。簡述（v3.1，從 9 spore batch 數據進化）：

- Tier 1a 知名度槓桿 → D+7 100K-180K viral
- Tier 1b 具體性槓桿（**具體 anchor + 反差 hook**，不限人物題材）→ D+7 10K-65K
- 中段 結構性題目（政治/制度 + 問題入口）→ D+7 2K-17K
- 低段 文化人物 / 冷門 → D+7 0.5K-1.5K（接受 niche reach 但 engagement rate ≥ 10%）
- ~~Tier 3 意境型~~ — 已 deprecated（時空 framing 先行 → d+0 6h <500，永遠不該用）

### 品檢清單（12 項）

發出前逐項檢查：

- [ ] **🚨 事實查核閘已通過**（[SPORE-VERIFY §事實查核閘](SPORE-VERIFY.md)）
- [ ] **拇指測試**：第一句話會讓滑手機的人停下來嗎？
- [ ] **問題入口測試**（結構性題目必做）：有讀者日常物件 + 真矛盾問題嗎？
- [ ] **場景測試**：有沒有至少一個「畫面」（不是描述）？
- [ ] **數字落差**：數字有對比嗎？還是只列了一個數？
- [ ] **塑膠檢測**：有沒有「不僅...更是」「展現了...精神」「值得紀念」？
- [ ] **獨立存活**：不點連結，這篇本身有價值嗎？
- [ ] **情感收尾**：最後一句是讓人「停一下」還是「嗯知道了」？
- [ ] **長度**：150-300 字（Threads 最佳閱讀長度）
- [ ] **URL 可點**：連結完整、中文已 URL encode（不含任何中文字元）、末尾有 `/`
- [ ] **朋友 tone prime**：第一行符合「你知道嗎？」或等效 prefix？
- [ ] **全形標點**：中文 prose 無半形 `,` `.` `:` `(` `)` `?` `!`（URL 與整句英文除外）
- [ ] **多語 SSOT freshness**（國際題目必做）：英文 knowledge 對齊 zh SSOT 嗎？
- [ ] **不重複**：查 SPORE-LOG.md 確認 ≥ 2 週未發過

### 🚦 v3.6 CI/CD wait gate（HARD — post 前必過）

> ⚠️ **2026-05-23 哲宇 directive**：social post 前必須確認 prod 版本已上線。否則讀者點 UTM URL 拿到 404 / 舊版 = 整個 spore 效益歸零。
>
> **CI/CD timeline**：commit + push to main → Cloudflare Pages build 約 10-15 min → prod 上線（cache invalidate）≈ 15 min total。
>
> **強制 gate**（spore post 前 mandatory）：

```bash
# 1. URL probe with title keyword check
SLUG_ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('臺灣漫遊錄'))")
TITLE_KEYWORD="妹妹翻譯的書"  # 從 frontmatter title 抽 unique substring
URL="https://taiwan.md/art/${SLUG_ENCODED}/"

# 2. Polling loop (60s interval, cap 20 min)
DEADLINE=$(($(date +%s) + 1200))  # 20 min hard cap
while [ $(date +%s) -lt $DEADLINE ]; do
  if curl -sf "$URL" | grep -q "$TITLE_KEYWORD"; then
    echo "✅ Prod live with title keyword. Safe to post."
    break
  fi
  echo "⏳ Waiting for CI/CD... ($(($DEADLINE - $(date +%s)))s remaining)"
  sleep 60
done

# 3. 20 min still 沒上 → escalate observer，不 silent post
[ $(date +%s) -ge $DEADLINE ] && echo "❌ CI/CD timeout 20 min. Halt post + report observer." && exit 1
```

**為什麼 polling not single-check**：CI/CD 時間 variance 大（5-25 min）。固定 sleep 15 min = sometimes 早 sometimes 晚。Polling 60s 一次 + 20 min hard cap = converge on actual live time + bounded wait.

**Cache invalidation 額外考量**：

- 第一次 fetch live 後 wait 額外 60s 再 post（Cloudflare edge cache propagation buffer）
- 多語版本（en/ja/ko/es/fr）有獨立 build path，本 gate 只 check 中文 prod
- 若 spore 含 fan-out 到其他語言文章 link → 個別 check 每個 locale

**驗證 keyword 選擇**：

- ✅ frontmatter title 中**獨特**字串（如「妹妹翻譯的書」「絕食 19 歲」「Cipriani」）— 不可能被其他文章撞
- ✅ 文章首段獨有 phrase
- ❌ 通用詞如「2026」「台灣」「楊」— grep 撞其他文章

### 發佈

**連結處理策略（分平台預設）**：

- **Threads = 主貼 + self-reply 兩則**
  - 主貼：孢子本體（150-300 字，純故事，**不含連結**）
  - 主貼發出後，自己在該貼下 reply 一則：`完整故事 👉 {文章連結}?utm_source=threads&utm_medium=spore&utm_campaign=s{number}`
  - **理由**：Threads 演算法對含外部連結的單則貼文降觸及；拆兩則避開
- **X = 單則 = Threads 主貼內容 + 連結 inline**
  - 直接用 Threads 主貼**同一份文案**，底部加一行 `完整故事 👉 {文章連結}?utm_source=x&utm_medium=spore&utm_campaign=s{number}`
  - **理由**：X 演算法對外部連結不敏感，不用拆兩則

**發文步驟**：

1. 孢子本體（= Threads 主貼 = X 主文）寫好
2. UTM 必加（`utm_source` 對應平台 / `utm_medium=spore` / `utm_campaign=s{number}`）— 不加 UTM = 不記錄的心跳
3. **AI pre-ship self-check 6 條公開報告給觀察者**（[SOCIAL-POSTING-PIPELINE §AI pre-ship self-check](../pipelines/SOCIAL-POSTING-PIPELINE.md)）：prose 跟 blueprint 對齊 / inline UTM URL 三段全填 / image attached / 帳號對 / Post button enabled / 字數安全。全 PASS 立即進 step 4（不等觀察者回覆）。任一 FAIL → stop + report。觀察者仍可 in-chat「先停 / 改 X / 取消」介入
4. **透過 Chrome MCP + osascript 自動發文**（[SOCIAL-POSTING-PIPELINE](../pipelines/SOCIAL-POSTING-PIPELINE.md)）：
   - **圖片先進剪貼簿**：`osascript -e 'set the clipboard to (read (POSIX file "{square 配圖絕對路徑}") as «class PNGf»)'`
   - **X**：navigate x.com → compose → Cmd+V 貼圖 → 輸入文案 + inline「完整故事 👉 {X UTM URL}」→ AI 自 click Post button
   - **Threads**：navigate threads.net → 新串文 → 第一則 Cmd+V 貼圖 + 輸入文案 → 點「新增到串文」→ 第二則輸入「完整故事 👉 {Threads UTM URL}」→ AI 自 click「發佈」
5. **發文後自行擷取 post URL + post-ship verify**：navigate 到 @taiwandotmd profile → JS query 最新 post href → navigate post URL → JS read 5 條 verify（textHasHook / textHasQuote / textHasCloseLine / imageCount ≥ 1 / UTM 留痕，per [SOCIAL-POSTING-PIPELINE §AI post-ship verify](../pipelines/SOCIAL-POSTING-PIPELINE.md)）。任一 FAIL 立即 report observer，不沉默 silent ship
   - X URL 格式：`https://x.com/taiwandotmd/status/{status_id}`
   - Threads URL 格式：`https://www.threads.com/@taiwandotmd/post/{post_code}`
6. 記錄到 `SPORE-LOG.md` §發文紀錄（**URL 必填**；Threads 記主貼 URL，reply URL 可選填）
   - **URL 乾淨化**：記錄前**必須把 query string 整段剝掉**。從 app share 複製的 URL 常帶 `?xmt=...&slof=1` 這類追蹤參數，統一剝掉
   - ✅ 正確：`https://www.threads.com/@taiwandotmd/post/DXVpBlLk4oE`
   - ❌ 錯誤：`https://www.threads.com/@taiwandotmd/post/DXVpBlLk4oE?xmt=...&slof=1`
7. **寫回源文章 frontmatter `sporeLinks`** — 讀者層 single-snapshot：

   ```yaml
   sporeLinks:
     - platform: 'threads' # 或 'x'
       date: '2026-04-DD'
       url: '<乾淨化 URL>'
       views: 0 # 初次發佈用 0，等 HARVEST 回填
       likes: 0
       reposts: 0
       comments: 0
       shares: 0 # X 為 bookmarks 數、Threads 為 shares 數
   ```

   - schema canonical：`src/components/SporeFootprint.astro` interface `SporeLink`
   - **不寫入 = 讀者看不到這篇孢子的存在**

8. **Threads 和 X 同時發中文版**。英文版只在 X 發，且僅限國際話題

### 發文節奏

- **頻率**：每天 1-2 篇，不貪多
- **時段**：午休 12:00-13:00 或晚間 20:00-22:00（台灣活躍時段）
- **語言**：中文 80% + 英文 20%
- **多平台**：Threads + X 同發中文版。X 可加 hashtag

### 多語 SSOT freshness（條件）

> 觸發：國際題材（半導體 / 外交 / 學術 / 移民）。47% 讀者在 /en/ 路徑（θ session GA4 數據）。

**檢查英文文章狀態**：

```bash
# 檢查英文版是否存在
ls knowledge/en/{Category}/{english-slug}.md 2>/dev/null

# 如果不確定 slug，查映射表
grep "{中文slug}" knowledge/_translations.json
```

**三種情況**：

| 情況                | 處置                                                           |
| ------------------- | -------------------------------------------------------------- |
| 英文版不存在        | **重寫式翻譯**（見 TRANSLATION-PIPELINE）                      |
| 英文版存在但過時    | **更新英文版**：讀中文新版 → 重寫英文版對應段落 → 保留所有腳註 |
| 英文版存在且品質 OK | 直接用                                                         |

**freshness 4 條判斷**（任一即視為過時）：

- `date` 早於中文 SSOT 最近大改日期，且中文文章新增了核心事實 / 敘事段落
- title / description 沒吃進最新主軸或最新數字
- 英文內文仍保留舊口徑（例：邦交國 12 allies / 113 offices / 177 destinations）
- `lastVerified` 早於中文 `lastVerified`，且題目涉及外交、法律、統計、選舉、人物近況等易變事實

**處理原則**：更新英文 knowledge 是必跑的一步，不是「之後有空再翻」。如果這次只發中文孢子，也要完成 freshness check。

### 寫英文孢子（國際題材時）

**素材不用重新萃取** — 中文孢子剛寫完，核心素材還在腦裡。

英文孢子的調整：

- 用同一組素材重新寫給英文讀者，不是逐句翻中文孢子
- 台灣特有概念要加一句解釋（如 "Mazu (媽祖), the sea goddess"）
- 長度可比中文稍長（文化解釋需要空間），但不超過 250 words
- 連結用英文版 URL（slug 通常是英文，不需 encode 但驗證一下）

額外品檢：

- [ ] 台灣專有名詞有中英並列嗎？
- [ ] 英文讀者不需要任何台灣背景知識就能讀懂嗎？
- [ ] 語氣像英文母語者寫的，不像翻譯體？

---

## 階段 5：HARVEST（收回聲）

完整收割流程在 **[SPORE-HARVEST-PIPELINE.md](SPORE-HARVEST-PIPELINE.md)**：

- 前置：Hook tier 自檢 + d+0/+1/+7/+30 cadence + d+0 6h decision gate + re-hook 救援
- Step 1: COLLECT 抓留言（Chrome MCP）
- Step 1.5: 雙寫（SPORE-LOG + frontmatter sporeLinks）
- Step 2: CATEGORIZE 分類（8 類 dimension）
- Step 3: 跨源驗證
- Step 4: 整合入文章本體
- Step 5: Perspectives frontmatter 更新
- Step 6: 回覆讀者留言（human only）
- Step 7: 跟 LESSONS-INBOX 互動
- Step 8: Harvest Log
- Step 9: Pipeline 本身的進化

---

## 完整流程圖（AI 執行用）

```
觀察者觸發 / cron / HEARTBEAT Beat 3 社群沉默警報
│
├─ PICK
│   ├─ 從 dashboard-articles.json 選 5-10 篇候選
│   ├─ 排除 2 週內已發
│   └─ 觀察者選定文章
│   (回填 decoupled — 交 twmd-spore-harvest-am 07:00 cron)
│
├─ VERIFY  → 詳見 SPORE-VERIFY.md
│   ├─ 品質三層
│   ├─ 事實藍圖 → 針對性驗證
│   ├─ 紀實/煽情閘（敏感度觸發）
│   └─ Hook Blueprint（結構性題目觸發）
│
├─ WRITE  → 詳見 SPORE-WRITING.md
│   ├─ 萃取素材
│   ├─ 選模板（A1/A2/B/C/D/E）
│   ├─ 寫 prose（依 18 條規則 + 三板斧）
│   ├─ 多版本 / 混合策略（條件）
│   └─ 寫完跑事實查核 + §11 gate
│
├─ SHIP
│   ├─ URL encode + UTM
│   ├─ 配圖（make-spore.sh）
│   ├─ Platform allocation + Hook tier 自檢
│   ├─ 品檢清單 12 項
│   ├─ 發佈（Threads 主貼+reply / X 單則）
│   ├─ SPORE-LOG 記錄 + frontmatter sporeLinks 寫回
│   └─ 多語 SSOT freshness（國際題目觸發）
│
└─ HARVEST  → 詳見 SPORE-HARVEST-PIPELINE.md
    ├─ d+0 1h/3h/6h harvest
    ├─ d+0 6h decision gate (views < 500 → re-hook)
    ├─ d+1/+7/+30 milestone
    └─ 回流文章本體 + perspectives + 回覆留言
```

---

## 常見陷阱（process 級）

| 陷阱                 | 症狀                                                   | 解法                                                   |
| -------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| 原文品質差           | 孢子寫出來也空洞                                       | 先過 VERIFY 品質三層，不合格回爐                       |
| URL 被截斷           | `taiwan.md/peopl…`                                     | 中文 slug 必須 URL encode（用 python3 指令，不要手打） |
| URL 含中文           | `taiwan.md/food/珍珠奶茶/`                             | Threads/X 會斷開，必須 encode 成 `%E7%8F%8D...`        |
| Briefing 病          | 政治/外交/制度題目只排數字，沒讀者可抓住的物件         | 回 VERIFY §Hook Blueprint 找日常物件 + 矛盾問題        |
| 英文 SSOT 過時       | 中文孢子拿最新數字，英文 knowledge 還停在舊標題/舊日期 | SHIP §多語 SSOT freshness 先同步英文 knowledge         |
| 跳過 fact-check gate | 直接 output prose 給觀察者                             | VERIFY §事實查核閘 是 hard gate，不過不放行            |
| 沒寫 sporeLinks      | 讀者看不到這篇孢子的存在                               | SHIP §發佈 step 6 強制寫回 frontmatter                 |

寫作層面陷阱（重複專名 / 引語倒裝 / 編年體 lead / 排比過硬等）→ 見 [SPORE-WRITING.md](SPORE-WRITING.md)。

---

## 跟其他檔案的分工

| 檔案                                                   | 職責                            |
| ------------------------------------------------------ | ------------------------------- |
| **本檔（PIPELINE）**                                   | 5 stage 主流程                  |
| [SPORE-WRITING.md](SPORE-WRITING.md)                   | 寫作手藝：模板、文體、規則      |
| [SPORE-VERIFY.md](SPORE-VERIFY.md)                     | 閘門集中地：所有 Hard/Soft gate |
| [SPORE-HARVEST-PIPELINE.md](SPORE-HARVEST-PIPELINE.md) | 發布後收割流程                  |
| [SPORE-LOG.md](SPORE-LOG.md)                           | 發文紀錄（data，非 SOP）        |
| [SPORE-BLUEPRINTS/](SPORE-BLUEPRINTS/)                 | 每孢子 fact + hook blueprint    |
| [SPORE-HARVESTS/](SPORE-HARVESTS/)                     | 收割 log（per-spore + batch）   |

---

_v3.0 | 2026-05-08 intelligent-khayyam — 從第一性原則重組，1334 行 prose dump 拆 4 single-concern canonical（PIPELINE / WRITING / VERIFY / HARVEST）。廢除 Step X.X.X 編號膨脹，改用 5 stage verb-based heading（PICK/VERIFY/WRITE/SHIP/HARVEST）。對應 [reports/spore-pipeline-evolution-plan-2026-05-08.md](../../reports/spore-pipeline-evolution-plan-2026-05-08.md) Direction A 完整實作。_

_設計原則：每個 file 單一焦點 / 每階段 verb-based / cross-file pointer 不複寫 / 歷史 v 累積保留 git log_

_前一版 v2.9（2026-05-03）含 1334 行 prose dump + Step 0/1/2.5/2.6/2.7/3a/3b/3b.5/3c/3c.5/3c.7/3d/3e/3.5/3.6/4/4.5a-e.v/5a-d/6 三層深編號 — 完整 changelog 在 git log + [reports/spore-pipeline-evolution-plan-2026-05-08.md](../../reports/spore-pipeline-evolution-plan-2026-05-08.md) 評估。_

_v3.5 | 2026-05-11 cranky-newton — Spine restoration 對齊 REWRITE v5.0 + MAINTAINER v2.0：頂部加 ASCII spine（5 stage box-frame + Step N.M 顯化）+ Top 5 最常忘 step + 跨檔案職責分工 standalone table（明確跟 WRITING / VERIFY / HARVEST 4 sub-canonical 分工）。觸發：[reports/pipelines-audit-2026-05-11.md](../../reports/pipelines-audit-2026-05-11.md) Tier A.2 SPORE family audit。5 階段 prose body 不動（已健康，Direction A 拆檔保留）。_
