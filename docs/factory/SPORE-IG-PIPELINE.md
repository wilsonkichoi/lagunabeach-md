---
title: 'SPORE-IG-PIPELINE'
description: 'IG 圖文孢子產線 — 4 階段 PICK → CURATE → DRAFT → RENDER（+ SHIP / HARVEST archived future）。物種紀律 + 母片系統 + 字數 floor/ceiling + 單一識別色。v0.8：Stage 4 加「人眼層」自檢 gate（機械全綠≠過人眼）+ code 語法高亮 + 圖表 honesty（waffle 三 tint 分離 / line ref 虛線基準 / heatmap 二次對比）+ cover 副標 em。v0.7：cover date + section code/截圖。v0.6：graph.md 7 圖表母片全落地 + 頁數 10-20。'
type: 'factory-canonical'
status: 'canonical'
current_version: 'v0.8'
last_updated: 2026-06-07
last_session: '2026-06-07-124521-carousel-charts'
sister_docs:
  - 'SPORE-PIPELINE.md'
  - 'SPORE-WRITING.md'
  - 'SPORE-VERIFY.md'
  - 'SPORE-HARVEST-PIPELINE.md'
upstream_canonical:
  - '../semiont/MANIFESTO.md'
  - '../editorial/EDITORIAL.md'
  - '../editorial/graph.md'
related:
  - '../../reports/ig-carousel-strategy-2026-06-03.md'
  - '../../reports/carousel-pipeline-design-2026-06-03.md'
audience: 'AI session 接續 + 哲宇 review'
---

# SPORE-IG-PIPELINE.md — IG 圖文孢子產線（方法論 canonical）v0.1

> **第一性原理**：這份文件是 AI 可執行的。任何 AI session 讀完本檔，應該能獨立把一篇 knowledge/ 長文，策展成一組可滑動、值得讀者**停下來看完並按收藏**的 IG carousel — 像 SPORE 但載體不同、策展深度更厚。
>
> 設計理由：文字 SPORE 跑在 Threads/X，拼觸及與單一弧線；IG 圖文跑的是**收藏 / 分享 / 跨群轉傳**。同樣的素材，要重新策展、不是搬運。SPORE 的「150-300 字單一故事」放不下文章的多層次敘事；IG carousel 一次 10-20 頁，剛好是「**把長文濃縮成一組 micro-scene**」的尺寸。
>
> 本檔=方法論 + 母片 spec；不是程式碼。生成器、發佈 SOP、回填屬未來分檔。

---

## 🗺️ ASCII spine

```
╭──────────────────────────────────────────────────────────────────────────╮
│       SPORE-IG-PIPELINE 4 階段 — PICK → CURATE → DRAFT → RENDER         │
│                                                                          │
│   🧭 核心紀律                                                            │
│            ├── 讀者拇指：1 秒決定滑不滑（封面 hook）                     │
│            ├── 策展不搬運（重新編排，不是截段貼上）                      │
│            ├── 一頁一意（每張 slide 只裝一個 takeaway）                  │
│            ├── 10-20 張（floor 10 / ceiling 20；IG 上限 20）            │
│            ├── 來源即招牌（末頁固定來源 + 連結 = 差異化武器）            │
│            └── 單一識別色（TWMD #1a3c34 主底 + #00d4aa 唯一 accent，v0.4 拿掉分類色）│
│                                                                          │
│   ──── 4 階段主流程 ──────────────────────────────────────              │
│                                                                          │
│   Stage 1: PICK ──→ 選文 + 選 archetype                                 │
│            ├── 選文（剛 EVOLVE / 旗艦 / SPORE-INBOX P0-P1）             │
│            ├── 選 archetype（§母片庫 6 種挑一種主導敘事）               │
│            └── 評估配圖素材（hero / inline / footnote 中可被視覺化的）  │
│                                                                          │
│   Stage 2: CURATE ──→ 綱要骨架（slide-by-slide，純結構）                │
│            ├── 從讀者拇指軌跡反推（§讀者觀點）                          │
│            ├── 6-10 頁，每頁一句話 + 版型 + 配圖預定                    │
│            └── 過骨架閘門：hook 夠勾？敘事弧完整？payoff 在第 N 頁？    │
│              ↳ 落 docs/factory/CAROUSEL-BLUEPRINTS/{slug}.outline.md   │
│                                                                          │
│   Stage 3: DRAFT ──→ 正式文（每頁 slot 灌字 + 配圖選定）                │
│            ├── 依母片 spec 寫每張 slide（字數鎖死、版型欄位齊全）       │
│            ├── 過 SPORE-VERIFY 既有閘門（事實查核 / §11 / 紀實煽情）    │
│            └── 落 docs/factory/CAROUSEL-BLUEPRINTS/{slug}.json (slide script) │
│              ↳ Hard gate: 每頁字數合規 + 必填欄位齊全 + 來源頁齊全     │
│                                                                          │
│   Stage 4: RENDER ──→ 圖（依 JSON 出 N 張 1080×1350 PNG + 自檢）        │
│            ├── 生成 → 逐張 AI 視覺自檢（hero 對 / 排版不溢 / 對齊）    │
│            ├── 不過 → 回 Stage 2/3 修綱要或文字                         │
│            └── 過 → 落 public/carousel-images/{slug}/slide-NN.png      │
│              ↳ Hard gate: 8 條視覺自檢（§Stage 4 checklist）            │
│                                                                          │
│   ──── 未來分檔（archived future）───────────────                       │
│   _ SHIP ──→ 發佈（手動 app / Graph API），多語 caption_                │
│   _ HARVEST ──→ saves/shares 回填 → 改版迭代_                           │
│                                                                          │
│   ✅ Carousel ready                                                      │
╰──────────────────────────────────────────────────────────────────────────╯
```

---

## ⚠️ Top 6 最常忘的 step

1. **🚨 物種差異最重要**（§〇）— IG carousel **不是** SPORE 一條 punchline，是 10 張 packed micro-essay。每張 body 要 80-120 字、kw 10-20 字（看得懂、含動作或具體 context、不能只是名詞）。寫成「精煉一句話」風格 = 讀者霧煞煞 = 整 deck 失敗。**轉述測試**：讀完的人能不能跟朋友說清楚這篇在講什麼？不能 = 物種錯了 = 回 Stage 2。
2. **策展不搬運** — 不是把原文段落塞進 slide。是**為手機、為拇指、為 1 秒注意力重新編排**。直接複製貼上 = 違反第一性原理。對應 §gushi.tw 編輯心法。
3. **CURATE 在 DRAFT 之前** — 必須先過綱要（純結構 + 一句話/頁），確認敘事弧再灌字。跳這步 = 寫到第 7 頁才發現結構錯了要全改。
4. **每頁字數雙鎖：floor + ceiling**（標題也要過自檢）— 每種母片有 hard 字數上下限（§五字數規範）。**超 ceiling = 砍或拆**；**低於 floor = 補因果/規模/為什麼，不是 ship**。寫太短 = 霧煞煞，寫太長 = 視覺密度爆。**標題（kw）floor 升到 10 字** — 5 字以下 = 簡訊縮寫，讀者看不懂；10-20 字 1-2 行、含動作或具體 context = 看得懂。
5. **末頁固定來源 + 連結** — 這是 Taiwan.md 的差異化武器（多數台灣知識 IG 來源偏弱）。沒末頁來源 = 失去 traceability DNA = 像匿名懶人包。
6. **單一識別色不變**（v0.4 升級）— TWMD `#1a3c34` 主底 + **單一** `#00d4aa` accent 識別色每張都在（kicker / idx / em 高亮 / 引號 / source bullet 全用同一個 accent）。**v0.4 拿掉分類色**（哲宇 directive「主題色效果不好」）— 分類色（nature 綠 / culture 紫 etc）在深主底色上對比度不夠，且 profile feed 顏色雜亂；統一識別色後對比強、視覺一致。

---

## 跨檔案職責分工

| 檔案                                                                                                   | 範圍                                                                                                                |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| **本檔（SPORE-IG-PIPELINE）**                                                                          | IG carousel 方法論 + 4 階段 + 母片 spec + 讀者觀點 + 範例                                                           |
| [SPORE-PIPELINE.md](SPORE-PIPELINE.md)                                                                 | 文字孢子 5 階段（Threads/X）— 平行 pipeline，共用 fact blueprint / §11 gate / 紀實煽情閘                            |
| [SPORE-VERIFY.md](SPORE-VERIFY.md)                                                                     | gate layer — 事實查核 7 類 / §11 prose-health / 紀實煽情閘 **直接沿用**                                             |
| [SPORE-WRITING.md](SPORE-WRITING.md)                                                                   | 文字孢子 craft — 字數哲學可參考但 IG slide 字數**更嚴格**（見 §字數規範）                                           |
| [EDITORIAL.md](../editorial/EDITORIAL.md)                                                              | 塑膠句禁用 + 對位句型紀律 — IG slide 也適用                                                                         |
| [graph.md](../editorial/graph.md)                                                                      | 資料視覺化 canonical — 資料關係→圖型 taxonomy + 5 設計原則，§3.9-3.10 圖表母片從這移植（AI 可讀性那層不 port）      |
| [MANIFESTO §11](../semiont/MANIFESTO.md)                                                               | 書寫節制 — slide 字少更敏感，違規即重寫                                                                             |
| [REWRITE-PIPELINE.md](../pipelines/REWRITE-PIPELINE.md)                                                | 「轉譯」概念對齊：長文重寫為 IG 節奏 ≈ REWRITE 重寫為手機節奏                                                       |
| [reports/carousel-pipeline-design-2026-06-03.md](../../reports/carousel-pipeline-design-2026-06-03.md) | 視覺研究 + 品牌色 verify + Graph API archived                                                                       |
| [reports/ig-carousel-strategy-2026-06-03.md](../../reports/ig-carousel-strategy-2026-06-03.md)         | 國際 + 台灣標竿分析（含驗證註記）                                                                                   |
| **未來分檔**                                                                                           | _SPORE-IG-VERIFY.md（slide-specific gate）/ SPORE-IG-SHIP.md（發佈 SOP）/ SPORE-IG-HARVEST.md（saves/shares 回填）_ |

---

## 〇、物種差異：IG carousel 不是 SPORE（最根本的紀律）

> ⚠️ **第一性原理**：在進讀者觀點 / 策展原則 / 母片 spec 之前，**先把「物種差異」這條搞清楚**。多數 session 失敗的根因不在排版、不在字數、不在配圖，而在用錯物種的策展風格。

### 0.1 兩個物種

| 維度       | SPORE（文字孢子）                      | SPORE-IG（圖文 carousel）                                       |
| ---------- | -------------------------------------- | --------------------------------------------------------------- |
| 載體       | 一條 punchline                         | **10 張 micro-explainer**                                       |
| 字數哲學   | 150-300 字一篇、單一弧、精煉到極致     | 每張 30-50 字、共 300-500 字、**多 micro-scene 串成弧**         |
| 讀者期待   | 「停下拇指看完，覺得有趣，可能點連結」 | 「滑完整組，理解一個議題，覺得值得**收藏 / 分享**」             |
| 策展目標   | hook + 故事 + payoff（單條）           | hook + **建立 stake + 補因果 + 規模感** + payoff + 餘韻（多層） |
| 成功的 KPI | 觸及 / 互動率                          | 收藏 / 分享 / **轉述率**（讀者能不能跟朋友說清楚）              |

### 0.2 最常見的失敗模式：把 SPORE 風格搬進 IG（= 霧煞煞）

AI session 預設會把 IG slide 寫成「SPORE 的精煉一句話」風格 — 每張 slide 只丟一個 keyword + 一句點題。結果：

```
讀者實際讀到：
  slide 3: 「飛進颱風眼 / 追風計畫的飛機真的衝進颱風中心」
  slide 4: 「從太空看雲，四分鐘算三十天 / 福衛七號 + AI」
  slide 5: 「莫拉克 / 6.5% 被氣候變遷放大的雨」
  slide 6: 「但那個清晨 / 獻肚山崩、小林村 462 條人命」

讀者內心：
  「追風計畫是什麼？為什麼飛進颱風眼厲害？」（不知道）
  「福衛七號跟 AI 是怎麼一起工作的？4 分鐘算三十天厲害在哪？」（不知道）
  「莫拉克規模多大？6.5% 是什麼意思？」（不知道）
  「獻肚山崩為什麼會吞掉小林村？」（不知道）

→ 整組讀完還是「霧煞煞」。讀者看到一堆名詞但不懂為什麼厲害、
   看到事件但不懂規模、看到結果但不懂因果。
```

**為什麼會這樣**：SPORE 一條 punchline 自帶「點連結看原文」的補位機制；IG carousel 沒有 — 讀者**只看 10 張 slide**，看不到原文。所以 IG 必須**把因果 / 規模 / 為什麼 packed 進每張 body**。

### 0.3 正確的物種紀律

| 紀律                                           | 操作                                                                                                                                                                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **每張 body 自包含解釋（packed micro-essay）** | 不只說「追風計畫」，要說「2003 年 9 月 1 日，台大團隊開著改裝的 ASTRA 噴射機真的衝進颱風中心，丟下探空儀。亞洲第一個颱風飛機觀測計畫，截至 2012 年完成 49 颱風 64 航次、投擲 1,051 枚探空儀，第一手資料讓 24-72 小時路徑預報誤差砍掉 20%」 |
| **名詞必伴規模 / 因果**                        | 提到「莫拉克」必伴規模（3000mm 雨 / 史上最強颱賀伯 1.5 倍 / 台北全年降雨量三天倒完）；提到「Kakanami 部落溪水變濁」必伴因果（上游山體鬆動徵兆 / 部落千年口傳的山崩警訊）                                                                   |
| **80-120 字 body 是 sweet spot（v0.2 升級）**  | < 80 字 = 讀者霧煞煞；80-120 字 = 一個 packed micro-essay，給足規模 + 因果 + 為什麼；> 130 字 = 視覺密度爆                                                                                                                                 |
| **標題（kw）要看得懂、不能只是名詞**           | 「飛進颱風眼」（5 字）= SPORE 風格簡訊縮寫、讀者看不懂；「衝進颱風中心，把資料帶回來」（12 字）= 自帶動作 + 結果、看得懂。10-20 字 1-2 行                                                                                                  |
| **轉述測試**                                   | 讀完 10 張的人，**能不能跟朋友轉述這篇在講什麼**？不能 = 物種錯了 / 內容深度不足 = 回 Stage 2 重 CURATE                                                                                                                                    |

### 0.4 為什麼這條要放在最前面

CURATE / DRAFT 階段的所有自檢、母片 spec 的所有欄位、字數規範的所有 floor — 全部都是這條物種紀律的具體落實。沒搞清楚物種差異，後面的所有原則都會做半套。

**這條是 Taiwan.md SPORE-IG 跟所有人「漂亮但內容空」的圖文懶人包之間最大的差異化武器**。報導者級的可信度不只來自來源標註，**也來自每張 slide 真的把議題講清楚**。

---

## 一、讀者觀點：好的 IG slides 從讀者拇指反推

### 1.1 讀者實際怎麼讀 IG（事實基礎）

- **第 1 張 = 全部**：在 feed 只露第 1 張。Hook 不抓 = 滑過去 = 你寫的 8 頁沒人看。
- **拇指軌跡**：滑 → 停 → 滑 → 停。每張 slide 平均**< 2 秒**注意力；只有 2 秒裡有東西能抓住，才會給你下一個 2 秒。
- **三個關鍵動作**（IG 演算法的 intent signal，依強到弱）：**收藏 > 分享 > 留言 > 讚**。知識型內容母語勝場是「值得存起來」。
- **離開的時機**：(a) 封面平淡 (b) 中段資訊密度爆掉 (c) 整組沒 payoff，到第 N 頁還在鋪陳。
- **profile 九宮格效應**：所有貼文一起看。**品牌一致性 = 信任**；雜亂 = 取消追蹤。

### 1.2 從讀者反推的 7 條策展原則

1. **封面 = 標題 + 反差**：不是文章標題複製。要從文章裡找「最反直覺的一句」或「最尖銳的一個對比」。範例：颱風文不要用「台灣與颱風的四百年」當封面字（太教科書），用「能預測風雨，預測不了命運」（標題裡藏的悖論）。
2. **每頁回答一個讀者潛在的問題**：「為什麼？」「結果呢？」「跟我有什麼關係？」每張 slide 設計成回答其中一個。
3. **payoff 不能晚於第 N-2 頁**：N = 總頁數。最後兩頁是來源 + CTA，倒數第三頁是收尾。最大資訊衝擊（the「對啊！」moment）應落在 6-7 頁的位置（10 頁 deck）。
4. **每頁能獨立存活**：讀者可能從中間進來（截圖、轉傳）。每張 slide 不靠前一張也要有意義。
5. **數字要嵌畫面、不要堆**：「172 公里 → 57 公里」+ 一句「25 年壓掉三分之二」遠比「2000-2025 路徑誤差變化率 67%」有力。
6. **引言要短、要狠**：超過 25 字 = 讀者開始跳行。長引言拆成兩張或重寫。
7. **末頁不只 CTA，要有「為什麼追蹤我們」**：明確一句話告訴讀者 Taiwan.md 是什麼。多數讀者第一次看到你 = 從這篇 carousel。

### 1.3 從標竿研究萃取的可執行規則

> 來自 Chrome MCP 一手觀察報導者 / 泛科學 / Vogue / 故事（詳見 [carousel-pipeline-design-2026-06-03 §2](../../reports/carousel-pipeline-design-2026-06-03.md)）+ 國際 / 台灣標竿分析（詳見 [ig-carousel-strategy-2026-06-03](../../reports/ig-carousel-strategy-2026-06-03.md)）。

| 標竿                          | 觀察                                                                                   | 落實到 SPORE-IG 規則                                                                                |
| ----------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **報導者 @twreporter**        | 紅 tag + 暗化照片 + 巨大粗體思源宋標題；內頁用**標註過的證據截圖**；強紅品牌           | 規則 A：cover 必有 kicker tag + hero 暗化遮罩。規則 B：figure 型 slide 可以是「截圖 + 圈註 + 圖說」 |
| **Vogue Taiwan @voguetaiwan** | 滿版照片 + 半透明 masthead + 極簡文字；克制即高級                                      | 規則 C：當 hero 圖夠強時，文字越少越貴。封面副標 ≤ 16 字                                            |
| **故事 @gushi.tw**            | 暖色實底 + 巨大粗體思源宋標題 + 日期/資訊錨點；改版後粉絲 40K→115K；自我定位「轉譯者」 | 規則 D：實色 section slide 用 Noto Serif TC 900。規則 E：每張 slide 角落可放「日期/錨點」當輔助資訊 |
| **泛科學 @pansci**            | 已影片化但**圖上標出 Source/journal name**                                             | 規則 F：data 型 slide 引用數字必標來源（小字、角落）                                                |
| **@monachalabi**（普立茲）    | 「視覺隱喻就是標題」— 把數字畫成形狀                                                   | 規則 G：stat 型 slide 用襯線特大號數字 + accent 色「畫」出感官重量                                  |
| **@so.informed**              | 固定版型契約：每篇必有 hook → 一頁一重點 → 末頁總結                                    | 規則 H：所有 deck 結構必有 cover / body / source 三段（不可省略 source）                            |

---

## 二、4 階段主流程

### Stage 1 — PICK（選什麼）

**選文**（優先序，沿用 SPORE）：

1. SPORE-INBOX §Pending P0-P1（觀察者明確點名 / news-lens 熱點）
2. 剛 EVOLVE 過的旗艦文章（lastVerified ≤ 7 天）
3. 數字 / 反差 / 場景密度高的題（colorful + 有 hero 圖）

**評估配圖庫存**：

- 文章 `image:` hero（必有）
- 文章 inline `![]()` 圖（可用作 figure slide）
- 文章 footnote 連結的影片 / iframe（不能用，但截圖可作 figure）
- public/article-images/{cat}/{slug}/ 整資料夾

**選 archetype**（依素材最強項，§四詳述）：

| 文章特徵                            | 主導 archetype                       |
| ----------------------------------- | ------------------------------------ |
| 有時間軸 / 漸進反差（精度從 X → Y） | **stat-reveal**                      |
| 有強人物弧 / 受訪語錄               | **quote-led**                        |
| 有概念要逐步建立（X 是 Y，因為 Z…） | **explainer**                        |
| 有可視化圖表 / 地圖 / 時序          | **figure-narrative**                 |
| 有強 hero 影像（衛星雲圖 / 紀實照） | **photo-essay**                      |
| 多面向短摘要                        | **listicle**（少用，最容易 generic） |

**第二根選擇軸：資料關係 → 圖表母片**（v0.5）。archetype 選敘事版型；同時掃文章有沒有可圖表化的**資料關係**（比較 / 排名 / 部分對全體 / 趨勢 / 矩陣 / 多個關鍵數字）。有 → 那幾頁排 §3.9-3.10 圖表母片，不要硬塞進 `section` 用一句話講。判圖型查 [graph.md §二](../editorial/graph.md)。範例：一段並列 3-4 個數字 → `chart-stat`；兩三個類別的數值對比 → `chart-bars`。

**輸出**：選文 slug + archetype + 配圖清單 + 圖表母片候選頁，記到 outline 檔頂層 frontmatter。

---

### Stage 2 — CURATE（策展綱要）

> 核心：**「先確認結構再寫字」**。這一步只列骨架，不寫正式文。對應 SPORE 的「Fact Blueprint 先列 bullet 再寫 prose」。

**動作**：**10-20 頁** carousel（floor 10 / ceiling 20；IG 2024 起 carousel 上限 20。素材夠厚 → 往 20 走、敘事更完整；不足 10 = 浪費 algorithm exposure），每頁列一行：

```
slide-NN | <type> | <一句話重點> | <配圖預定> | <字數預算>
```

**敘事弧檢查（讀者觀點）**：

- [ ] **slide 1（cover）有 hook 嗎？** 是反問 / 數字反差 / 反直覺主張？不是平淡標題？
- [ ] **slide 2-3 有引讀者進來嗎？** 鋪 stake / 給 context 但**不解答**？
- [ ] **slide 4-6 有 payoff 嗎？** 最大資訊衝擊 / 反轉 / 解答？
- [ ] **slide N-1 有收束嗎？** 情感 / 引言 / 首尾呼應？
- [ ] **slide N（source）齊全嗎？** 來源 + URL + CTA？
- [ ] **每張能獨立存活嗎？**（截圖轉傳測試）

**🚨 物種紀律檢查（最重要、最常被跳過）**：

- [ ] **轉述測試**：讀完這 10 張 outline，**沒讀過原文的人能跟朋友轉述這篇在講什麼嗎**？不能 = 內容深度不足 = 補因果 / 規模 / 為什麼
- [ ] **名詞 ↔ 規模 / 因果配對**：每個專有名詞（追風計畫 / 福衛七號 / 莫拉克 / Kakanami…）旁邊都有規模或因果嗎？只有名詞 = 讀者霧煞煞
- [ ] **每張 body 預算 80-120 字**（v0.2 升級）：grep outline 表，body 預算 < 80 字的 row → 補因果規模；> 130 字的 row → 拆兩張
- [ ] **每張 kw（標題）預算 10-20 字**（v0.2 升級）：kw < 10 字 = SPORE 風格簡訊縮寫，讀者看不懂 → 加動作或具體 context（範例：「飛進颱風眼」5 字 ✗ →「衝進颱風中心，把資料帶回來」12 字 ✓）

**輸出**：`docs/factory/CAROUSEL-BLUEPRINTS/{slug}.outline.md`（純綱要 md 表格，不是 JSON）。

**閘門**：未通過敘事弧 6 項檢查 → 不准進 Stage 3。

---

### Stage 3 — DRAFT（正式文 + 配圖選定）

> 依母片 spec（§三）逐 slide 灌字。每種 type 有 hard 欄位 + 字數鎖。

**動作**：

1. 把 outline 升格成 slide script JSON：`docs/factory/CAROUSEL-BLUEPRINTS/{slug}.json`
2. 每張 slide 依母片 spec（§三）填欄位：標題長度 / 內文長度 / 配圖路徑 / 高亮 keyword / 來源註腳
3. 過 **SPORE-VERIFY 沿用閘門**：
   - 事實查核 7 類（日期 / 數字 / 引語 / 人名 / 地名 / 時序 / 最高級宣稱）
   - §11 書寫節制（每張 slide 過 prose-health：對位句型 / 破折號連用 / 塑膠句）
   - 紀實 / 煽情閘（敏感題：死亡 / 創傷 / 未成年 觸發四問）
4. **配圖選定**：figure / photo-essay 型 slide 指定來源圖檔路徑（已在 public/article-images/）

**字數鎖（hard）**：見 §三母片 spec 每種 type 的 hard limit。

**輸出**：`{slug}.json` slide script + 已 cache 的圖（如有）。

**閘門**：

- 任一 slide 字數超 hard limit → 重寫（不是 ignore）
- 缺 source slide → 整 deck 不放行
- §11 / 事實查核任一 fail → 退回修正

---

### Stage 4 — RENDER（圖）

> 把 slide script JSON 轉成 N 張 1080×1350 PNG，逐張 AI 視覺自檢。

**動作**：

1. 跑生成器 → 出 N 張 PNG 到 `public/carousel-images/{slug}/slide-NN.png`
2. **逐張自檢 — 兩層**（hard）：

   **A. 機械層（AI / 工具抓得到）**：
   - [ ] cover hero 圖正確顯示，暗化遮罩到位
   - [ ] 標題 / 副標 / body 沒被裁切、沒撞 brandrow/footer
   - [ ] 每張 keyword / accent 高亮對地方 / page number / progress bar 對齊
   - [ ] watermark / 來源頁齊全 / 字體渲染完整（Noto Serif TC 900 真載入）
   - [ ] 換行在語意斷點（無「車，」這種孤字；cover 主標 ≤ 8 CJK/行免 auto-wrap）
   - [ ] 整 deck 視覺一致（主色 / 字體系統）

   **B. 🧠 人眼層（v0.8 新增 — 機械層全綠「也要」過這層）**：

   > **核心教訓**：「機械層全綠」是過了 AI 自己設的檢查，**不是過了人眼**。2026-06-07 同一批圖，AI 逐張自檢回報「全綠」三輪，哲宇 + 2 個 critic agent 每輪各抓到 ~6 條 AI 看不到的（accent 刺眼 / 圖缺數值線條 / waffle 類別數不出來 / cover hook payoff 沉掉 / 基準線像實測）。同 REFLEXES #31「自評會騙人」，擴張到視覺自評。
   - [ ] **假裝第一次看到**：每張問「霧不霧 / 刺不刺 / 亂不亂 / 數不數得出來」，不是只問「有沒有溢出、欄位齊不齊」
   - [ ] **大面積 accent 填色刺不刺眼**：accent 是小面積強調色；heatmap / waffle 大格填色要降 alpha 或用明度階，別滿版純 accent
   - [ ] **圖表誠不誠實**：長條從 0 / 基準線畫虛線單標籤（不畫成實測兩點+端點）/ 不在一張 sorted bar 混「時序＋橫斷面＋基準」（混維度 REFLEXES #38，基準移 note 或 ref 線）/ waffle 類別彼此＋對主底都要明顯分得開 / heatmap < 3 列色階無意義
   - [ ] **hook 的 payoff 詞有沒有被強調**：cover reversal 關鍵詞用 `<em>` accent，別沉在 dim 副標裡（最高 stop-rate 槓桿）
   - [ ] **跨張節奏**：別連 ≥ 3 張同形（section 後接 stat / chart / quote 換氣）
   - [ ] **高 stake deck 建議 spawn critic agent 當「外部冷檢查」**（讀 PNG 逐張批判）— 比自檢可靠，是「量測先於設計」的視覺版

3. 不過 → 回 Stage 2（結構問題）或 Stage 3（文字 / 配圖 / 圖表 honesty 問題）
4. **v0.4 升級**：生成器結尾**自動開啟 outDir 資料夾**（macOS `open` / Linux `xdg-open` / Windows `explorer`），方便觀察者立即視覺檢視整 deck。CI / cron / headless 用 `--no-open` 或 `CAROUSEL_NO_OPEN=1` 關掉。

**輸出**：`public/carousel-images/{slug}/slide-01.png` 到 `slide-NN.png`。

---

### Stage 5+ — SHIP / HARVEST（archived future）

> 本檔不展開。設計詳見 [carousel-pipeline-design-2026-06-03.md §7](../../reports/carousel-pipeline-design-2026-06-03.md)。MVP 走手動 IG app last-mile；Phase 3 才上 Meta Graph API + babel 多語 caption + saves/shares 回填。

---

## 三、母片系統（slide type spec）

> **核心觀念**：母片不是版型清單，是**內容模具**。每種 type 規定「裝什麼欄位、字數多少、配圖怎麼擺」。寫的時候像填表格，不像自由排版。
>
> 共通規範：尺寸 **1080×1350（4:5）** / 主底色 `#1a3c34` 漸層 / **單一 accent `#00d4aa`**（v0.4：拿掉分類色 accent2，所有 kicker/idx/em/qmark/source bullet 都用同一個識別色） / 字體 Noto Serif TC（標題 900）+ Noto Sans TC（內文）/ 每張右下 wordmark + 進度條 + page indicator。

### 3.1 cover（封面）

**用途**：第 1 張，feed 唯一可見。決定整 deck 的 swipe 率。

**欄位**：

| 欄位      | 型                    | 限制                             | 說明                                                                           |
| --------- | --------------------- | -------------------------------- | ------------------------------------------------------------------------------ |
| kicker    | string                | ≤ 6 字                           | 分類 tag，用 categoryConfig 分類色實底圓角標籤                                 |
| title     | string (\n 允許)      | 主標 hard ≤ 18 字（允許 1 換行） | 巨大粗體 Noto Serif TC 900；hook 一定要在這                                    |
| subtitle  | string                | ≤ 22 字                          | 副標 Noto Serif TC 400，dim 色                                                 |
| hero      | bool + heroImage path | 1 張，建議 ≥ 1600px 寬           | 滿版暗化遮罩（0.45→0.95 漸層）；無 hero → 純主色實底                           |
| date      | string (optional)     | ≤ 24 字                          | 副標下方日期 / 期間錨點（**週報必填**「2026.05.31 – 06.07」）accent 色（v0.7） |
| swipe_cue | bool                  | default true                     | 右下「滑看完整故事 →」accent 色                                                |

**配圖規則**：

- 用文章 frontmatter `image:`（已 cache）
- aspect 不限，CSS background-size:cover 處理；但**人臉/主體要在中軸**（aspect 護欄）
- 暗化遮罩**必須**（純亮圖文字看不清）

**禁止**：

- 文章標題複製貼上當主標（教科書 lead，必違反 hook）
- 無 kicker（profile 失去分類辨識）
- 主標 > 18 字（拇指 1 秒讀不完）

---

### 3.2 quote（引言）

**用途**：傳遞文章核心一句話、受訪者原話、author voice 收尾。

**欄位**：

| 欄位         | 型                | 限制                                    |
| ------------ | ----------------- | --------------------------------------- |
| text         | string (\n 允許)  | hard ≤ 32 字（含 2 換行）；推薦 ≤ 24 字 |
| by           | string (optional) | 出處 ≤ 16 字（人名 / 角色 / 媒體）      |
| accent_glyph | bool              | default true，左上大型「”」(accent 色)  |

**配圖規則**：純文字、無配圖（讓引言獨占視覺）。

**禁止**：

- 杜撰引語（必須與文章中能 Ctrl-F 對得到逐字）— 沿用 SPORE-VERIFY 事實鐵三角
- 從英文 summary 回譯（觸犯 EDITORIAL 紅線）
- 換行不在語意斷點

---

### 3.3 stat（數字 / 視覺隱喻）

**用途**：核心數字反差、規模、時間跨度。最高槓桿的「對啊！」slide。

**欄位**：

| 欄位        | 型                | 限制                                                                 |
| ----------- | ----------------- | -------------------------------------------------------------------- |
| value       | string            | hard ≤ 8 字元（含「→」「:」等符號）；範例「172→57」「1/4」「3000mm」 |
| unit        | string            | ≤ 4 字（「公里」「條人命」「秒」）                                   |
| label       | string            | hard ≤ 40 字（解釋這個數字代表什麼）                                 |
| source_note | string (optional) | ≤ 16 字小字角落，引自 footnote                                       |

**配圖規則**：純文字主導；數字本身 = 視覺。極大號（8.5rem+）襯線特粗 + accent 色。

**禁止**：

- 一張塞 3 個以上數字（拆兩張）
- 數字無 label 解釋（純數字 = 沒 context）
- 無 source_note（特別是專業領域數字）

---

### 3.4 section（主題講解）

**用途**：把文章一個 H2 段落 / 一個概念 / 一個論點濃縮成一頁。**最常用的母片**。

**欄位**：

| 欄位    | 型                        | 限制                                                                                             |
| ------- | ------------------------- | ------------------------------------------------------------------------------------------------ |
| idx     | string (optional)         | 「01」「02」… 序號 accent 色襯線數字                                                             |
| kw      | string (\n + `<em>` 允許) | hard ≤ 24 字；keyword 高亮用 `<em>` 包，渲染為 accent 色                                         |
| body    | string                    | floor 80 / ceiling 130 字（見 §五）；連貫 prose（非條列）                                        |
| caption | string (optional)         | 圖說 ≤ 30 字（如有配圖 / 截圖）                                                                  |
| image   | path (optional)           | 可選支援圖 / 截圖；圖在 kw 下方，slide top-align（v0.7 secmedia 落實）。圖當主角改用 figure 母片 |
| code    | string (optional)         | code-block 風節錄一小段（系統名 / 指標 / 短輸出）；≤ 4 行，CJK+latin 混用 OK（v0.7）             |

**配圖規則**：

- 可選配圖；配了就要有 caption
- 圖在 kw 下方 / body 上方（垂直 stack）；圖高度約 slide 1/3
- 圖須帶**圖說 caption**（誰拍 / 來源），呼應 Taiwan.md citation DNA

**禁止**：

- kw + body 加總超 hard limit（拆兩張或砍 body）
- body 寫成條列（IG 不適合 markdown bullet；要用連貫 prose）
- 配圖無 caption（成 stock photo）

---

### 3.5 figure（圖文）

**用途**：圖是主角（紀實照 / 地圖 / 圖表 / 截圖），文字輔助說明。

**欄位**：

| 欄位        | 型                | 限制                                          |
| ----------- | ----------------- | --------------------------------------------- |
| image       | path              | **必填**，圖佔 slide 上 60-65%                |
| caption     | string            | hard ≤ 50 字，圖說 + 來源                     |
| pull        | string (optional) | ≤ 20 字小標題，置於圖上方（accent 色 kicker） |
| body        | string (optional) | ≤ 60 字，圖下方補充                           |
| source_note | string            | ≤ 16 字（攝影者 / 機構）                      |

**配圖規則**：

- aspect 4:3 / 16:9 / 1:1 都可（CSS object-fit:cover 處理）
- **暗角或邊框**保證圖跟主底色有清楚邊界
- caption 必含 attribution（沿用 article-images 已 cache 的圖 + 已有 caption）

**禁止**：

- 圖無 caption（違反 traceability）
- 圖佔比 < 50%（變成圖塞角落的 section slide）
- 熱連結外站圖（沿用 SPORE 配圖規則：必 cache 本地）

---

### 3.6 bullets（列表）

**用途**：3-5 個並列概念 / 步驟 / 比較項。**慎用**，最容易 generic。

**欄位**：

| 欄位       | 型                | 限制                                                        |
| ---------- | ----------------- | ----------------------------------------------------------- |
| title      | string            | ≤ 18 字，列表的主題                                         |
| items      | string[]          | **3-5 項**；每項 hard ≤ 18 字                               |
| item_style | enum              | `dot`（圓點 accent 色）/ `num`（編號）/ `arrow`（→ 表流程） |
| caveat     | string (optional) | ≤ 30 字補充說明 / 例外                                      |

**配圖規則**：無配圖（列表本身已是視覺密集）。

**禁止**：

- ≤ 2 項或 ≥ 6 項（前者用 section，後者拆兩張）
- 每項超 18 字（讀者一眼讀不完）
- 連續 2 張 bullets（節奏單調）

---

### 3.7 source（來源 + CTA）

**用途**：**末頁固定**。Taiwan.md 差異化武器。

**欄位**：

| 欄位    | 型                | 限制                                                      |
| ------- | ----------------- | --------------------------------------------------------- |
| sources | string[]          | 3-6 個來源機構名稱（Ex: 「中央社」「國家太空中心 TASA」） |
| url     | string            | 文章 URL（taiwan.md/{cat}/{slug}）                        |
| cta     | string (\n 允許)  | hard ≤ 60 字；推薦三行：收藏 / 分享 / 追蹤                |
| about   | string (optional) | ≤ 28 字「Taiwan.md 是什麼」一句話（首次接觸讀者用）       |

**配圖規則**：無配圖；**換深色底**（`#03080a`）區隔結尾感。

**禁止**：

- 缺 sources（不寫就是匿名懶人包）
- 缺 url（讀者沒法找到原文）
- CTA 寫「你覺得呢？」「同意請按讚」（虛榮指標，要喊收藏 / 分享 / 追蹤）

---

### 3.8 母片組合範式（速查表）

> **10-20 張**（floor 10 / ceiling 20，IG 2024 起 carousel 上限 20）。低於 10 = 浪費 algorithmic exposure（IG 把每張 slide 當獨立 engagement event）；素材夠厚 → 往 20 走，每多一張都是一個 engagement event + 更完整敘事。**10 是 floor 不是 default**——颱風那種單一悖論收在 10、國宅那種五十年史詩鋪到 15-20。

| 文章類型                       | 推薦母片序列                                                                                                                    | 範例                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **概念悖論型**（颱風）         | cover → stat → section ×2 → figure → section → quote → section → section（氣候變遷）→ source                                    | 10 頁，精度躍進 vs 命運接不住 |
| **人物深度型**（李洋）         | cover (hero) → quote (童年語) → section ×2 (場景) → figure (人物照) → stat (金額) → section → quote (現在語) → section → source | 10 頁，少年→現在弧線          |
| **歷史時間軸型**（戒嚴 38 年） | cover → section（起點）→ figure ×2 → stat → section ×2 → quote → bullets（主要事件）→ source                                    | 10 頁，事件 + 史實照          |
| **資料調查型**（半導體市佔）   | cover → stat ×2 → figure (圖表) → section ×2 → bullets → quote → section → source                                               | 10 頁，數字 + 圖表主導        |
| **文化現象型**（珍奶）         | cover (hero) → section（起源）→ figure (老照片) → section ×2 (傳播) → bullets (口味) → figure → quote → source                  | 10 頁，照片豐富               |

---

### 3.9 資料視覺化母片家族（v0.6 全落地，← graph.md 移植）

> **縫在哪**：§3.1-3.8 的母片選擇是「**敘事原型 → 版型**」（概念悖論 / 人物深度…）；缺一根「**資料關係 → 圖表**」的軸。原本唯一的數據母片 `stat` 只做單一數字或 before→after。[graph.md §二](../editorial/graph.md) 的 FT Visual Vocabulary 表正是 spore-ig 該長出來的第二根軸。**v0.6 起 7 種資料視覺化母片全部落地進生成器**（chart-stat / chart-bars / versus / chart-timeline / chart-waffle / chart-line / chart-heatmap）。
>
> **設計原則直接沿用 [graph.md §三](../editorial/graph.md)**：標題說重點不說標籤 / 直接標籤＞圖例 / 長條必從 0（誠實軸）/ 幾乎都該排序（大→小）/ 色盲友善且顏色非唯一編碼。這五條對 PNG carousel 圖表跟對文章 inline SVG 一模一樣適用。
>
> **annotation 是同源 DNA**：graph.md「別給中性圖、給帶觀點的標註」＝ spore-ig §〇「名詞必伴規模 / 因果」。圖表母片的 `note` / `source_note` 欄位就是物種紀律的圖表版。
>
> **⚠️ 誠實邊界（不能 over-claim）**：graph.md 最核心的「AI 可讀性」（semantic HTML / 資料表 fallback /「絕不寫如上圖」）**不 port 到 carousel** — IG 是 PNG，AI 爬蟲本來就讀不到圖。主權價值活在 carousel 連回去的**那篇文章**裡，不在 slide。別讓未來 session 以為「carousel 圖表＝主權視覺化」。

**`chart-stat`（← graph.md `tw-stat`）** — 2-4 個並排關鍵數字。

| 欄位        | 型       | 限制                                         |
| ----------- | -------- | -------------------------------------------- |
| title       | string?  | ≤ 20 字，takeaway 標題（非「數據統計」標籤） |
| stats       | object[] | **2-4 項**；每項 `{ value, label, note? }`   |
| stats.value | string   | ≤ 8 字元（大數字本身＝視覺）                 |
| stats.label | string   | ≤ 12 字（這數字代表什麼）                    |
| stats.note  | string?  | ≤ 14 字小字                                  |
| source_note | string?  | ≤ 20 字角落來源                              |

何時用：一段塞了 3-4 個並列數字（規模盤點 / 一週代謝）。**禁止**：> 4 項（拆兩張）/ 單一數字（用 `stat`）。

**`chart-bars`（← graph.md `tw-bars`）** — 水平比例條（比較 / 排名）。

| 欄位         | 型       | 限制                                                                |
| ------------ | -------- | ------------------------------------------------------------------- |
| title        | string   | ≤ 20 字，說 takeaway（範例「誰每天在讀台灣？」）                    |
| bars         | object[] | 2-6 項（portrait 上限 6）；每項 `{ label, value, display?, note? }` |
| bars.label   | string   | ≤ 12 字（短標籤；細項放 note）                                      |
| bars.value   | number   | 縮放用數值（自動 max → 100% 寬，**從 0**）                          |
| bars.display | string?  | 條上顯示值（「83%」「16.6 倍」）；缺則用 value                      |
| bars.note    | string?  | ≤ 24 字，條下 annotation                                            |
| sort         | bool?    | default true 排序大→小；固定類別（年份 / 月份）設 false             |
| source_note  | string?  | ≤ 24 字角落來源                                                     |

何時用：少量類別的數值比較或排名（AI 爬蟲西方 vs 對岸 / 房價所得比各縣市）。**禁止**：> 6 條（portrait 高度放不下——實測 8 器官分數會撞 brandrow/footer；多類別改 listicle 或拆兩張）/ 截斷軸（value 一律從 0）/ 用顏色當唯一編碼。

**`versus`（← graph.md `tw-versus`）** — 兩制度 / 兩路線逐點對照。欄位 `{ title?, left, right, rows:[{l,r}] }`；`left`/`right` ≤ 8 字標題、每 row `l`/`r` ≤ 16 字。何時用：兩種制度 / 立場 / 前後的逐點對比（台灣國宅 vs 香港居屋）。**禁止**：> 4 row（拆兩張）。

**`chart-timeline`（← graph.md `tw-timeline`）** — 節點時間軸。欄位 `{ title?, nodes:[{year,label,desc}] }`；`year` ≤ 6 字、`label` ≤ 14 字、`desc` ≤ 24 字。**3-5 節點**。何時用：政策 / 制度的關鍵節點脈絡（國宅 1975→2026）。**禁止**：當正文編年體用（節點是脈絡輔助不是逐年流水）。

**`chart-waffle`（← graph.md `tw-waffle`）** — 100 格部分對全體。欄位 `{ title?, cells:[{label,pct}], source_note? }`；pct 加總 ≈ 100。**2-5 類**。生成器用 accent 明度階上色（色盲友善，非色相）。何時用：比例組成（大安國宅誰拿到 48/37/14）。**禁止**：> 5 類（圖太碎）/ 加總遠離 100。

**`chart-line`（← graph.md `tw-line`）** — 趨勢折線（inline SVG，自動 y 軸 + 每點數值標籤 + 終點直接標籤）。欄位 `{ title?, x:[...], series:[{name, points:[...], ref? }], source_note? }`。**多序列同尺度**。`ref:true` 把該序列畫成**虛線基準**（dim、無點、無值標籤、單一右標，名稱建議含值如「世銀警戒線 5.1」）— 用在常數門檻/基準，避免畫成「實測兩點」誤導（v0.8）。何時用：≥ 3 時間點趨勢 / 同尺度多序列對照（全國 vs 台北 / 實測 vs 基準）。**禁止**：雙 Y 軸（不同尺度兩指標 → 拆兩張）/ 截斷 y 軸誇大 / 標題不講清楚是誰的數（「全國」要寫進標題免得跟另一張的台北數打架）。

**`chart-heatmap`（← graph.md `tw-heatmap`）** — 矩陣（每欄各自正規化成 accent 不透明度）。欄位 `{ title?, corner?, cols:[...], rows:[{label,values:[...]}], source_note? }`。何時用：地區 × 指標、年 × 類別的矩陣比較（台北/全國 × 房價/房貸）。**禁止**：> 4 欄或 > 6 列（手機讀不清）。

### 3.10 母片 ↔ graph.md 對照表（7 種資料視覺化母片全落地，v0.6）

選圖型**先查 [graph.md §二 資料關係表](../editorial/graph.md)**（從「這問題要用什麼資料關係回答」選，不從「好看」選），再對應母片。graph.md 的 5 條設計原則（標題說 takeaway / 直接標籤＞圖例 / 長條從 0 / 排序 / 色盲友善）已內建進生成器：

| graph.md 模組 | carousel 母片    | 資料關係     | 狀態    |
| ------------- | ---------------- | ------------ | ------- |
| `tw-stat`     | `chart-stat`     | 多個關鍵數字 | ✅ v0.5 |
| `tw-bars`     | `chart-bars`     | 比較 / 排名  | ✅ v0.5 |
| `tw-versus`   | `versus`         | 兩制度對比   | ✅ v0.6 |
| `tw-timeline` | `chart-timeline` | 節點時序     | ✅ v0.6 |
| `tw-waffle`   | `chart-waffle`   | 部分對全體   | ✅ v0.6 |
| `tw-line`     | `chart-line`     | 趨勢         | ✅ v0.6 |
| `tw-heatmap`  | `chart-heatmap`  | 矩陣         | ✅ v0.6 |

> **完整 worked example**：[視覺化母片型錄](CAROUSEL-BLUEPRINTS/視覺化母片型錄.json)（IG 版，對應 [graph.md 視覺化模組型錄](../editorial/graph.md) article）— 15 張用《[國宅與居住正義](../../knowledge/Society/國宅與居住正義.md)》真實資料 exercise 全部 14 母片，每個數字對得回該文腳註。是新增圖表母片時的 render 基準。
>
> **dogfood**：[weekly-2026-06-07](CAROUSEL-BLUEPRINTS/weekly-2026-06-07.json)（chart-stat 310/28/82 + chart-bars AI 爬蟲 83 vs 16）。

新增 / 改圖表母片＝生成器加 CSS block + `__renderSlide` 分支（模 `chart-bars` / `chart-line` pattern）+ 本節加 spec + 跑型錄 render 自檢。

---

## 四、CURATE 階段詳述（綱要表範本）

> Stage 2 產出的就是這張表，落 `{slug}.outline.md`。

```markdown
# {slug} carousel outline

article: knowledge/{Cat}/{slug}.md
archetype: 概念悖論型 / 人物深度型 / 歷史時間軸型 / ...
target_pages: 8
date: YYYY-MM-DD

## 配圖庫存盤點

- hero: /article-images/{cat}/{slug}-hero.jpg
- inline: /article-images/{cat}/{slug}-{topic1}.jpg, ...
- 影片截圖可選: -

## 綱要

| #   | type    | 一句話重點                | 配圖預定 | 字數預算        |
| --- | ------- | ------------------------- | -------- | --------------- |
| 1   | cover   | hook = ...                | hero     | 主18 副22       |
| 2   | stat    | 172→57 公里 25 年精度躍進 | —        | label 40        |
| 3   | section | 飛進颱風眼                | —        | kw 18 / body 70 |
| ... |
| N   | source  | 來源 + CTA                | —        | cta 60          |

## 敘事弧自檢（讀者觀點）

- [ ] slide 1 hook 反差度？
- [ ] slide 4-6 payoff 對嗎？
- [ ] 每張獨立存活測試（截圖任 1 張仍有意義）？
- [ ] payoff 不晚於倒數第 3 頁？
- [ ] 收尾呼應開場？

## 觀察者拍板

- [ ] 哲宇 review outline → 通過 / 修改
```

---

## 五、字數規範（rationale）

> 跟文字 SPORE 的字數哲學不同：SPORE 是「150-300 字單一弧」，IG slide 是「**每頁拇指 2 秒讀完 + 給足 context 不留霧煞煞**」。

### 兩條失敗模式

| 失敗                         | 症狀                                                                                              | 為什麼會發生                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **寫太短**（字數 < floor）   | 讀者讀完整 deck 還是「霧煞煞」 — 看到名詞但不懂為什麼厲害、看到事件但不懂規模、看到結果但不懂因果 | AI 預設用 SPORE 的「精煉一句話」風格寫 IG slide，但 IG carousel 是「**10 張 micro-explainer**」不是「一條 punchline」 |
| **寫太長**（字數 > ceiling） | 視覺密度爆、像簡報、拇指滑過                                                                      | 把文章原段落直接塞進 slide                                                                                            |

### Floor / sweet spot / ceiling（hard）

> **floor 是強制下限**，不是建議；body 寫不到 floor → 補因果 / 規模 / 為什麼，不是 ship。

| 欄位                   | floor (≥) | sweet spot | hard ceiling (≤) | rationale                                                                                                                                |
| ---------------------- | --------- | ---------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| cover 主標             | 10 字     | 12-18      | 20               | 1-2 行、要看得懂、自帶反差或 thesis                                                                                                      |
| cover 副標             | 14 字     | 16-22      | 25               | 副標補 hook 不足的 context                                                                                                               |
| **section kw（標題）** | **10 字** | **12-20**  | **24**           | **1-2 行、要看得懂、含動作或具體 context；< 10 字 = 簡訊縮寫讀者看不懂（「飛進颱風眼」5 字 ✗ vs「衝進颱風中心，把資料帶回來」12 字 ✓）** |
| **section body**       | **80 字** | **90-115** | **130**          | **packed micro-essay；< 80 字 = 名詞無 context = 讀者霧煞煞 / 90-115 = 規模+因果+為什麼齊全 / > 130 = 視覺密度爆**                       |
| stat value             | —         | 4-7 字元   | 10 字元          | 純數字 + 符號（「172→57」）                                                                                                              |
| **stat label**         | **60 字** | **70-95**  | **110**          | label 是 stat 的「為什麼這個數字重要」+ so what，足以講一個完整 micro-story                                                              |
| **figure caption**     | **20 字** | **25-40**  | **55**           | 至少 attribution + 場景一句                                                                                                              |
| **figure body**        | **60 字** | **70-90**  | **100**          | 圖佔 60% 不能塞太長；70-90 是圖文比例 sweet spot                                                                                         |
| quote text             | 8 字      | 12-26      | 32               | 引言超 32 字跳行；引言短才有力，不用追長                                                                                                 |
| bullets item           | 8 字      | 10-16      | 20               | 列表項一眼讀完                                                                                                                           |
| source cta             | 45 字     | 50-60      | 65               | 三件套（收藏 / 分享 / 追蹤）剛好                                                                                                         |

**v0.2 升級理由（2026-06-03 哲宇 callout）**：v0.1 規範 body 30-50 字、kw 5 字 floor 跑颱風 9-slide 後，哲宇看完整組覺得「霧煞煞」+「描述太少」+「標題看不懂」。根因：**SPORE 物種習慣的「精煉一句話」風格被帶進 IG，但 IG carousel 沒有「點連結看原文」的補位機制，讀者只看 10 張 slide**。所以：(1) body 升到 80-120 字才能 packed 完整 micro-essay；(2) kw floor 升到 10 字才能避免「飛進颱風眼」這種簡訊縮寫；(3) stat label + figure body 也按比例升。視覺端對應升級：body 字級從 2.15rem 降到 1.85rem 容納 6-8 行 prose。

**核心原則**：

- 寫超 ceiling = 砍或拆，**不是縮字級**（縮字級 = 違反 thumb-friendly）
- 寫不到 floor = 補因果 / 規模 / 為什麼，**不是 ship**（ship = 讀者霧煞煞）
- **「讀完這 10 張，沒讀過原文的人，能跟朋友轉述這篇在講什麼嗎？」** 不能 = 內容深度不足 = 回 Stage 2 重 CURATE

---

## 六、完整範例：颱風（概念悖論型，8 頁）

> 本範例直接落為 `docs/factory/CAROUSEL-BLUEPRINTS/颱風.outline.md` + `颱風.json`。

### 6.1 綱要（outline）

```markdown
# 颱風 carousel outline

article: knowledge/Nature/颱風.md
archetype: 概念悖論型（精度躍進 vs 命運接不住 + Kakanami 部落 reversal）
target_pages: 8
hero: /article-images/nature/morakot-modis-satellite-2009.jpg
inline: /article-images/nature/morakot-minxiong-flood-2009.jpg

| #   | type    | 一句話重點                                      | 配圖預定      | 字數預算        |
| --- | ------- | ----------------------------------------------- | ------------- | --------------- |
| 1   | cover   | hook = 能預測風雨，預測不了命運                 | hero 衛星雲圖 | 主18 副22       |
| 2   | stat    | 172→57 公里：25 年壓掉三分之二                  | —             | label 40        |
| 3   | section | 追風計畫真的飛進颱風眼                          | —             | kw 18 / body 70 |
| 4   | section | 福衛七號 + AI 四分鐘算三十天                    | —             | kw 24 / body 80 |
| 5   | figure  | 2009 莫拉克：嘉義民雄淹水紀實照                 | inline 淹水   | caption 50      |
| 6   | section | 那個清晨：獻肚山崩、小林村 462 條人命           | —             | kw 18 / body 70 |
| 7   | quote   | 再精準的預報，都接不住那一秒                    | —             | text 28         |
| 8   | section | Kakanami 部落看見溪水變濁，全村及時撤離         | —             | kw 24 / body 80 |
| 9   | source  | 中央社 / 國家太空中心 / 原視 / 中央氣象署 + CTA | —             | cta 60          |

敘事弧自檢：

- [x] cover hook = 「能預測風雨，預測不了命運」反差（科技精度 vs 命運）
- [x] payoff 在 #7-#8（quote 重擊 + reversal）
- [x] 每張獨立存活（測試：#5 圖文獨立可懂；#7 quote 獨立有力）
- [x] payoff 在第 7-8 頁，倒數第二/三正確
- [x] 收尾 #8 部落 reversal 呼應 cover「預測不了命運」 → 「真正接住他們的」
```

> 註：上表 9 列是因為加了 figure 後總頁變 9；按需要可砍其中一頁回 8 頁（IG carousel ≤ 10 張）。

### 6.2 正式文（slide script JSON 結構，文字部分）

```json
{
  "slug": "颱風",
  "category": "nature",
  "accent2": "#15803d",
  "url": "taiwan.md/nature/颱風",
  "heroImage": "public/article-images/nature/morakot-modis-satellite-2009.jpg",
  "slides": [
    {
      "type": "cover",
      "kicker": "氣候與災害",
      "title": "能預測風雨，\n預測不了命運",
      "subtitle": "台灣與颱風的四百年",
      "hero": true
    },
    {
      "type": "stat",
      "value": "172→57",
      "unit": "公里",
      "label": "這 25 年，台灣把颱風 24 小時路徑預報的誤差，壓掉了三分之二。"
    },
    {
      "type": "section",
      "idx": "01",
      "kw": "飛進<em>颱風眼</em>",
      "body": "追風計畫的飛機真的衝進颱風中心，丟下探空儀，把第一手資料帶回來。"
    },
    {
      "type": "section",
      "idx": "02",
      "kw": "從太空看雲，\n四分鐘算三十天",
      "body": "福爾摩沙衛星七號每天從軌道丟下數千筆大氣資料；六組 AI 在四分鐘內，鋪出未來三十天的預警地圖。"
    },
    {
      "type": "figure",
      "image": "public/article-images/nature/morakot-minxiong-flood-2009.jpg",
      "pull": "2009 莫拉克",
      "caption": "嘉義民雄一座村落在連日豪雨後淹水。Photo: zilupe, CC BY 2.0",
      "body": "那 6.5% 被氣候變遷放大的雨，最後變成的就是這樣的水。"
    },
    {
      "type": "section",
      "idx": "03",
      "kw": "但那個清晨",
      "body": "獻肚山在三天豪雨後崩下來，吞掉小林村 462 條人命。"
    },
    { "type": "quote", "text": "再精準的預報，\n都接不住那一秒。" },
    {
      "type": "section",
      "idx": "04",
      "kw": "真正接住他們的，\n是一條<em>混濁的溪</em>",
      "body": "同一年，台東 Kakanami 部落的人看見溪水變濁，預警山崩，全村及時撤離。救他們的，不是衛星。"
    },
    {
      "type": "source",
      "sources": [
        "中央社",
        "國家太空中心 TASA",
        "原住民族電視台",
        "交通部中央氣象署"
      ],
      "url": "taiwan.md/nature/颱風",
      "cta": "覺得值得記住 → 收藏這篇\n想讓更多人看見 → 分享出去\n追蹤 Taiwan.md — 台灣人自己寫的台灣"
    }
  ]
}
```

字數查核：

- cover 主標 18 字 / 副標 9 字 ✅
- stat label 36 字 ✅
- section #03 kw 5 字 + body 35 字 ✅
- section #04 kw 14 字 + body 50 字 ✅
- figure caption 35 字 ✅
- quote 14 字 ✅
- source CTA 56 字 ✅

事實查核：

- 172→57 公里 [^11]（中央氣象署）✅
- 追風計畫飛機 [^9]（吳俊傑/DOTSTAR）✅
- 福衛七號 + AI [^11] ✅
- 莫拉克 6.5% 氣候變遷放大 [^1] ✅
- 獻肚山 / 小林村 462 [^1] ✅
- Kakanami 部落溪水變濁 [^12]（原視）✅
- 「再精準的預報，都接不住那一秒」= author voice（非他人引語，不杜撰）✅

紀實/煽情閘（死亡 462 觸發）四問：

1. 以死亡作情感鉤？否，核心是預測 vs 命運悖論 ✅
2. 細節必要？必要、且無逐秒重構 / 無遺容 ✅
3. 主體公開行動？用集體 462 不點名 ✅
4. 活下來的人在做什麼？Kakanami 部落 reversal 為收尾 ✅

---

## 七、常見陷阱

| 陷阱                                | 症狀                                                                                                      | 解法                                                                                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **🚨 用 SPORE 風格寫 IG（最致命）** | 每張 slide 只丟 keyword + 一句點題 → 讀者讀完整組「霧煞煞」、不知道議題在講什麼、看到名詞但不懂為什麼厲害 | 物種紀律（§〇）：每張 body 30-50 字，名詞必伴規模/因果。寫不到 30 字 = **不是 ship，回 Stage 2 補**。過轉述測試（§二 CURATE 自檢）才能進 RENDER |
| 跳 CURATE，直接寫 DRAFT             | 寫到 slide 6 才發現 payoff 在 slide 3、後面空                                                             | 強制 outline ledger，過敘事弧檢查才進 DRAFT                                                                                                     |
| 字數超 hard limit，縮字級           | slide 看起來「文字小、密、累」                                                                            | 砍字或拆頁，**永遠不縮字級**                                                                                                                    |
| 把文章 H2 當 slide 標題             | 教科書感，無 hook                                                                                         | section.kw 重寫成「動詞 + keyword」（範例：「飛進颱風眼」不是「追風計畫」）                                                                     |
| 末頁來源寫得潦草                    | 失去 traceability DNA                                                                                     | source slide 必填 sources[] + url + cta 三欄齊全                                                                                                |
| 換主底色為分類色                    | profile feed 失去 TWMD 辨識                                                                               | 主底永遠 `#1a3c34`，分類色只當 kicker / em 高亮                                                                                                 |
| 配圖無 caption                      | figure / section 變 stock photo                                                                           | figure 強制 caption 必填，section 有圖也必補 caption                                                                                            |
| 引言 > 32 字                        | 讀者跳行、失去衝擊                                                                                        | 拆兩張 quote 或重寫精煉                                                                                                                         |
| bullets 連用 2 張以上               | 節奏單調、像簡報                                                                                          | 中間插 section 或 stat 轉節奏                                                                                                                   |
| stat 一張裝 2-3 個數字              | 視覺爆掉、focus 分散                                                                                      | 拆兩張 stat，每張一個數字主角                                                                                                                   |
| cover 用文章原標題                  | 多數文章標題不是 IG hook                                                                                  | 從文章裡找「最反直覺一句」當主標                                                                                                                |

---

## 八、跟 SPORE 的對照

| 維度         | SPORE（文字孢子）                  | SPORE-IG（圖文 carousel）                                   |
| ------------ | ---------------------------------- | ----------------------------------------------------------- |
| 載體         | 純文字 + 1 張海報                  | 6-10 張可滑動圖                                             |
| 字數         | 150-300 字一篇                     | 每頁 hard limit（cover 18 / section body 80…）總 200-500 字 |
| 平台         | Threads / X                        | Instagram                                                   |
| 母語勝場 KPI | 觸及 / 互動率                      | **收藏 / 分享**                                             |
| 結構         | 單一故事弧                         | 6-10 個 micro-scene 串成弧                                  |
| 寫作 craft   | SPORE-WRITING 18 條 + 起手式 5 種  | 本檔母片 spec + §一讀者觀點原則                             |
| Fact gate    | SPORE-VERIFY 7 類 / §11 / 紀實煽情 | **直接沿用**                                                |
| 配圖         | make-spore.sh 1 張 OG              | 每張 slide 各自配圖（figure / cover hero）                  |
| 發佈 SOP     | SOCIAL-POSTING X/Threads           | future — 手動 app or Graph API                              |
| 回填         | SPORE-HARVEST cron                 | future — IG insights API                                    |

---

## 九、未來分檔（roadmap）

- [ ] **SPORE-IG-VERIFY.md** — slide-specific gate（字數鎖檢查、母片必填欄位、視覺自檢 8 條儀器化）
- [ ] **SPORE-IG-SHIP.md** — IG 發佈 SOP（手動 app SOP + Graph API archived future）
- [ ] **SPORE-IG-HARVEST.md** — saves / shares / reach 回填 + 改版迭代
- [ ] **生成器**（`scripts/tools/generate-carousel-slides.mjs` 已存在 v0.1，下一步 extend 全 6 種母片支援）
- [ ] **CAROUSEL-LOG.md** — 已發 IG carousel 紀錄表（仿 SPORE-LOG）

---

## 十、本檔狀態

### v0.1 → v0.4 進化軌跡（2026-06-03 同 session 5 次升級）

| 版本       | 觸發                                                                                        | 升級點                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **v0.1**   | 哲宇 directive「先寫整個方法論」                                                            | 4 階段 + 6 母片 + 颱風 worked example                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **v0.2**   | 哲宇 callout「沒啥內容、霧煞煞」                                                            | §〇 物種紀律誕生（IG ≠ SPORE，是 10 張 micro-essay）+ 轉述測試 + 名詞↔規模配對 + Top 6 #1 物種差異                                                                                                                                                                                                                                                                                                                                                                            |
| **v0.2.1** | 哲宇 directive「default ≥ 10 張」                                                           | 9→10 張 + 母片組合速查 + 拉出未來感 slide 完成 thesis 弧                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **v0.3**   | 哲宇 callout「字太小、寬度用滿、1.2x」                                                      | 字級全 ×1.2 + body max-width 移除 + 字數規範 floor/sweet/ceiling 三層（body 80-120 / kw 10-20）                                                                                                                                                                                                                                                                                                                                                                               |
| **v0.4**   | 哲宇 directive「主題色效果不好，先不要用」                                                  | 拿掉分類色 accent2，全 deck 統一 TWMD 識別色 `#00d4aa`；RENDER 結尾自動開啟資料夾                                                                                                                                                                                                                                                                                                                                                                                             |
| **v0.5**   | 哲宇 directive「用 graph.md 強化 spore-ig」                                                 | §3.9-3.10 資料視覺化母片家族（`chart-stat` / `chart-bars` 落地 + 5 roadmap）；§Stage 1 加「資料關係→圖表」第二選擇軸；誠實邊界（AI 可讀性不 port 到 PNG）；週報 carousel dogfood 首發                                                                                                                                                                                                                                                                                         |
| **v0.6**   | 哲宇 directive「母片先進化做進生成器 + 完整範例 + 頁數放寬」                                | 補完 5 母片（`versus` / `chart-timeline` / `chart-waffle` / `chart-line` SVG / `chart-heatmap`）= 7 種資料視覺化母片全落地；**頁數政策 10→10-20**（IG 2024 起上限 20，10 是 floor 不是 default）；視覺化母片型錄 15 張 worked example（exercise 全 14 母片）；§3.10 全標 ✅                                                                                                                                                                                                   |
| **v0.7**   | 哲宇出圖 review callout（6 條視覺）                                                         | `chart-waffle` 明度階調色板（類別清楚 + 不刺眼）；`chart-line` 每點數值標籤 + x/y 軸線（解決「缺圖說跟線條」）；`chart-heatmap` alpha .92→.55（大面積 accent 不刺眼）；cover 加 `date`（週報首頁日期區間）；section 加 `code`（code-block 節錄）+ 落實 `image`/`caption`（secmedia top-align）；Playwright 截 Sweden.md 首頁進週報；chart-bars portrait ≤6                                                                                                                    |
| **v0.8**   | 哲宇「code 要 syntax highlight + 每頁深度分析 + 記回 pipeline」+ 2 critic agent 逐張 review | **Stage 4 加「人眼層」自檢 gate**（機械全綠≠過人眼，連 REFLEXES #31；建議 spawn critic agent 外部冷檢查）；code-block 語法高亮（terminal 配色 tokenizer）；圖表 honesty 修：`chart-waffle` 三 tint 明度+彩度雙軸分離且全部亮於主底（critic 抓到 dark 類沉進背景）/ `chart-line` 加 `ref:true` 虛線基準（不畫成實測兩點）/ `chart-heatmap` 二次曲線拉大值差 / `chart-bars` 不混維度（基準移 ref 線）；cover 副標 `<em>` accent 強調 reversal 詞；`bcaveat` punchline 升 accent |

### 已驗證

- 敘事母片 7 種：cover / quote / stat / section / figure / bullets / source
- **資料視覺化母片家族 7 種**（v0.6 全落地，← graph.md）：`chart-stat` / `chart-bars` / `versus` / `chart-timeline` / `chart-waffle`（accent 明度階）/ `chart-line`（inline SVG 自動 y 軸 + 終點標籤）/ `chart-heatmap`
- **4 篇 worked example**：颱風（概念悖論型，nature）+ 天燈（概念悖論 + 歷史時間軸 hybrid，culture）+ weekly-2026-06-07（生命體週報，chart dogfood）+ 視覺化母片型錄（國宅，exercise 全 14 母片）
- 跨 archetype / category / ethical flag 通用性已驗證
- 沿用 gate：SPORE-VERIFY 事實查核 7 類 / §11 prose-health / 紀實煽情閘四問

### archived future

- SPORE-IG-VERIFY 分檔（字數 + 物種紀律 + 視覺自檢 8 條 instrument 化）
- SPORE-IG-SHIP 分檔（IG 發佈 SOP / Graph API）
- SPORE-IG-HARVEST 分檔（saves/shares 回填）
- 生成器 v0.7+（CSS scale variable / chart-waffle 調色板更高對比 / VERIFY plugin 把字數鎖 + 視覺自檢 8 條儀器化）
- AI 自動產 outline（給定 slug + archetype → outline 草稿）
