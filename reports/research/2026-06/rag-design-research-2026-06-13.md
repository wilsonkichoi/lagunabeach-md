# Taiwan.md RAG 設計研究：6 語系靜態站的檢索增強方案

> _2026-06-13 research draft。研究範圍：在「GitHub Pages 純靜態 + GitHub Actions free tier」約束下，為 4,800+ 篇 × 6 語系語料設計可用、可增量、可被讀者與 AI 兩種受眾消費的 RAG 方案。本報告是設計草稿，按 CLAUDE.md Bias 4 慣例交哲宇 review 後才動工，不直接執行。_

---

## 0. TL;DR

**主推方案：「雙層 RAG」——詞彙層修復給讀者、向量層掛在 MCP/manifest 給 AI。**

1. **讀者層（瀏覽器）**：不做瀏覽器端 embedding（最小可用的多語 query encoder `multilingual-e5-small` ONNX q8 要 118 MB，下載成本不成比例）。把現有 minisearch 索引從「zh+en、只有 title/desc/tags」擴成 **6 語系、按語言切 shard、加 headings + 首段欄位**——這是今天 ja/ko/es/fr 讀者完全搜不到東西的根本修復，成本半天。語意能力用「預計算 related-articles」補（零客戶端成本）。
2. **AI 層（向量 RAG 本體）**：CI 內用 **`intfloat/multilingual-e5-small`（384 維，ONNX int8，經 `@huggingface/transformers` + onnxruntime-node）** 做 chunk 級 embedding，**以 content-hash 增量**（沿用 OG cache pattern + 既有 `sourceContentHash` 慣例），產物為 `public/api/rag/` 下按語言切的 int8 向量 shard + manifest。消費端三條路：
   - `taiwanmd` CLI/MCP（已存在，v0.7.1）升級出 `taiwanmd_semantic_search`，hybrid = RRF(minisearch 詞彙分 + cosine)，query encoder 在 agent 機器本地跑（一次性下載 118 MB 到 `~/.cache`）；
   - `public/api/rag/manifest.json` 讓任何外部 agent 自己 fetch 向量 shard 算 cosine；
   - 無運算能力的 LLM 走 llms.txt → meta.json（titles/headings）→ `/raw/{cat}/{slug}.md` top-k fetch（既有端點，零新建設）。
3. **跨語系**：**每語言獨立索引 + `translatedFrom` 橋接**為主（語料 ~98% 平行，橋接幾乎無損且單語檢索品質最高），mE5 多語共空間當未翻譯缺口的 fallback（查詢語言 shard ∪ zh canonical shard，按 canonical slug 去重）。

**備選方案：同架構、換 encoder 為 GitHub Models 免費 `openai/text-embedding-3-small`（MRL 截到 256 維）。** CI 零 CPU 成本、零模型下載、品質略升；代價是外部依賴（preview 條款、限流 150 req/day——增量綽綽有餘、全量要分 4 天）與 MCP 查詢端需要使用者自己的 GitHub token。適合當 CI 吞吐實測不及格時的 plan B。

**關鍵數字**：6 語系 chunk 級索引（~50K chunks、384 維 int8）≈ **19 MB 向量 + ~9 MB metadata（gzip 後 ~3 MB）**，按語言切 shard 後單一語言 4.5–6 MB；MVP 先做 zh+en ≈ 9–10 MB。CI 增量日常 delta（~30 篇/300 chunks）≈ **10–20 秒**；全量重建 25–45 分鐘（只在 workflow_dispatch 手動跑）。API 路線全量一次 **$0.65**（OpenAI 3-small）。MVP 全套 **~3 人日**（可拆 3 個獨立 session）。

---

## 1. 現況盤點（2026-06-13 實測 repo）

| 資產                                                                       | 實況                                                                                                                                                                                                                | 對 RAG 的意義                                                                        |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 語料                                                                       | 4,824 篇 .md（zh 808 / en 811 / es 806 / fr 798 / ja 794 / ko 807），共 ~99.4 MB，平均 21.6 KB/篇                                                                                                                   | chunk 後約 50K chunks（估算見附錄 A）                                                |
| `knowledge/_translations.json`                                             | 3,971 筆 `{lang}/{cat}/{slug}.md → zh canonical` 映射                                                                                                                                                               | 跨語系橋接的 SSOT，免費的平行語料圖                                                  |
| 翻譯 frontmatter                                                           | `translatedFrom` + `sourceCommitSha` + `sourceContentHash: sha256:16hex`                                                                                                                                            | **content-hash 增量已有先例**，embedding cache 直接沿用同一慣例                      |
| minisearch 索引                                                            | `public/api/search-minisearch.json` 2.8 MB；**只索引 zh+en 的 title/desc/tags**（`scripts/core/build-search-index.mjs`）；Layout.astro 懶載入                                                                       | **ja/ko/es/fr 讀者今天搜不到任何東西**——比缺語意檢索更大的洞                         |
| `taiwanmd` CLI + MCP                                                       | v0.7.1，`cli/src/lib/mcp-server.js` 已有 `taiwanmd_search/read/rag/cite/organs/stats` 六工具；search 是 minisearch 詞彙比對 + remote articles.json fallback                                                         | AI 受眾的 RAG 介面**已經存在**，缺的只是檢索品質——向量層直接掛進去，不用新發明介面   |
| `/raw/{cat}/{slug}.md`                                                     | 4 組語言路由（zh/en/ja/ko，`src/pages/{lang}/raw/[category]/[slug].md.ts`），dist 內 3,000+ 檔                                                                                                                      | 外部 LLM 的 fetch 端點現成                                                           |
| `public/llms.txt`                                                          | 11 KB 策展版，`refresh-llms-txt.py` 自動 patch 數字                                                                                                                                                                 | 加一行指向 rag manifest 即可接上 AI 發現鏈                                           |
| `public/api/articles.json` / `article-index.json` / `lang-switch-map.json` | 3.6 MB / 159 KB（793 canonical + langs 覆蓋表）/ 1.1 MB                                                                                                                                                             | manifest 不必重造文章層 metadata                                                     |
| CI                                                                         | ubuntu-latest x86 4 vCPU free runner、build ~4.5 min、timeout 120 min、`NODE_OPTIONS=12GB`；OG pattern：`restore-mtime.py` + `actions/cache` restore/save 拆分 + `git diff HEAD~1` 變更偵測 + ratio guard fail-loud | 增量 embedding 的 cache 骨架照抄即可                                                 |
| GitHub Pages 限制                                                          | 發佈站 ≤ 1 GB（**本機 dist 實測已 1.7 GB**，含 og-images——本身已是獨立隱憂）、流量 soft 100 GB/月、Pages deploy 10 min timeout                                                                                      | 向量產物必須 int8 + 按語言 shard；+28 MB 相對佔比 1.6% 可接受，但別用 fp32（+77 MB） |
| 其他                                                                       | `@supabase/supabase-js` 已在 deps（feedback widget）                                                                                                                                                                | pgvector 變體技術上存在，但被否決（§3.4）                                            |

---

## 2. 方案比較

### 2.1 軸一：Embedding 索引層（誰來算向量）

成本與時間以 **~50K chunks / ~32M tokens 全量、日常 delta ~30 篇（~300 chunks / ~140K tokens）** 計，計算依據見附錄 A。

| 方案                   | 模型 / 維度                                                                                                  | 一次性成本                                   | CI 時間：增量 / 全量                                                   | 向量體積（int8）                           | 增量可行性            | 品質參考                                                                                | 主要風險                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------ | --------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **(a1) CI 開源｜主推** | multilingual-e5-small / 384d                                                                                 | $0                                           | **~10–20s / 25–45 min**（4 vCPU，q8，估 25–50 chunk/s，需 bench 驗證） | **19.2 MB**                                | content-hash 完美增量 | MIRACL nDCG@10 ≈ 59–61（足夠 hybrid 用）                                                | CPU 吞吐估算未實測；模型/ORT 版本必須 pin                                                                                                                |
| (a2) CI 開源           | EmbeddingGemma-300m / 768→MRL 256d                                                                           | $0                                           | ~1–2 min / **2–4 hr（不可行於 CI 全量）**                              | 12.8 MB（256d）                            | 同上                  | MTEB 多語 <500M 第一名；QAT 後 RAM <200 MB                                              | 全量只能在 Mac 跑；計算量 ~4–6× e5-small                                                                                                                 |
| (a3) CI 靜態模型       | potion-multilingual-128M（Model2Vec，bge-m3 蒸餾）/ 256d 或 static-similarity-mrl-multilingual-v1 / 1024→MRL | $0                                           | **<10s / <2 min**（CPU 比 e5-small 快 ~125×）                          | 12.8 MB（256d）                            | 同上                  | STS 達 mE5-small 的 92.3%，**但官方明言 similarity 模型「not intended for retrieval」** | retrieval 品質未證，需自建 eval set 把關                                                                                                                 |
| **(b1) API｜備選**     | GitHub Models `openai/text-embedding-3-small` / 1536→MRL 256d                                                | **$0**（free tier）                          | ~1–2 min / 全量需分 ~4 天（150 req/day × 64K tok/req = 9.6M tok/day）  | 12.8 MB（256d）                            | 同上                  | 英文最強、CJK 中上                                                                      | preview 條款與限流可變；增量 OK、全量痛                                                                                                                  |
| (b2) API 付費          | OpenAI text-embedding-3-small（直連）                                                                        | **$0.65 全量**（batch $0.33）；月增量 <$0.05 | ~1–2 min / ~10 min（純網路）                                           | 12.8 MB（256d）                            | 同上                  | 同上                                                                                    | repo secret 管理；外部依賴進 deploy 路徑                                                                                                                 |
| (b3) API 付費          | gemini-embedding-001 / voyage-4-lite                                                                         | $4.9 / $0.65（voyage 首 200M tokens 免費）   | 同上                                                                   | 768d MRL→12.8 MB                           | 同上                  | gemini 商用榜第一（MTEB 68.3）                                                          | 同上、且 gemini 貴 7.5×                                                                                                                                  |
| (c) 本機 Mac/Ollama    | bge-m3 / 1024d（Ollama 1.2 GB，M 系 GPU 全量 ~10–30 min）                                                    | $0                                           | CI 0 / Mac 跑                                                          | **51.2 MB**（1024d 無 MRL，要 PCA 自己降） | hash 同樣可增量       | MIRACL 67.8（dense），最強開源                                                          | **人肉 in loop**：index 跟 content 在每次 push 解耦，哲宇不開機 = index 過期；違反 routine 飛輪「無人在場自轉」原則；50 MB 產物進 repo/branch 的歷史膨脹 |

**判定**：(a1) 主推。理由：零成本、零外部依賴、deploy-coupled（index 永遠跟 content 同步）、增量後日常 CI 負擔 <30 秒、查詢端可以用同一顆模型對稱編碼。品質是六案中偏弱的一檔，但 (i) hybrid RRF 把詞彙層的精確比對補回來，(ii) schema 帶版本欄位，日後直接整批換 EmbeddingGemma-256d 或 Mac 產的 bge-m3，消費端不用改。(c) 只當「第一次全量 bootstrap 加速器」，不當 steady state。

### 2.2 軸二：查詢端（兩種受眾分開評）

**受眾 1：讀者（瀏覽器搜尋框）**

| 選項                                 | 首載成本                                                                                                                            | 延遲                                    | 實用判定                                                                                                                         |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| (a) transformers.js 載 query encoder | mE5-small ONNX q8 = **118 MB**（XLM-R 系 250K 詞表是底價，換模型也降不下來；EmbeddingGemma q4 也 ~170 MB）                          | WebGPU 下單句 <50 ms，但冷載 30s–數分鐘 | ❌ MVP 不做。手機/弱網直接勸退，對「查一篇文章」的報酬不成比例。Phase 3 可做「深度搜尋」opt-in（WebGPU + Cache API，明示下載量） |
| (b) minisearch 6 語系修復 + shard    | 每語言 shard ~1.2–1.6 MB（≈今天 2.8 MB 單檔的改善）                                                                                 | <10 ms                                  | ✅ **讀者側最高實用**。今天 4 個語言是 0 分，修復是從 0 到 1；語意是從 1 到 1.3                                                  |
| (b+) 跨語 query 擴展                 | 從 `_translations.json` 同篇文章的 6 語 tags 挖平行詞表（如 珍珠奶茶 ↔ bubble tea ↔ タピオカミルクティー），純靜態 JSON ~100–200 KB | <10 ms                                  | ✅ 零成本的「假跨語檢索」，cover 專有名詞場景（讀者跨語查詢的大宗）                                                              |
| (b++) 預計算 related-articles        | 文章級 centroid cosine top-6 → `public/api/related/{lang}.json` ~700 KB                                                             | 0（build 時算完）                       | ✅ 把語意價值用「不需要 query encoding」的形態交付給讀者                                                                         |

**受眾 2：AI agent（引用 Taiwan.md 的 LLM）**

| 選項                   | 形態                                                                                                                                                                                                                                        | 實用判定                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| (c1) MCP/CLI 向量檢索  | `taiwanmd` MCP 新工具：下載 `public/api/rag/` shard（ensure-data 既有模式），query 在 agent 機器本地編碼（@huggingface/transformers，一次性 118 MB 到 `~/.cache/huggingface`；或 `gh auth token` 走 GitHub Models 免下載），hybrid RRF 排序 | ✅ **AI 側最高實用**。`taiwanmd_rag` 的品質瓶頸（lexical bigram 只看 title/desc/tags）直接解掉；對 Claude/Cursor 等 MCP 生態零新協定 |
| (c2) rag-manifest.json | 靜態 manifest 宣告 model/dim/quant/shard URLs，任何有運算能力的 agent 自取向量自算 cosine（10K chunks × 384 int8 點積 <5 ms）                                                                                                               | ✅ 開放標準姿態，跟 Semiont「對 AI 可讀」的 llms.txt 路線同構                                                                        |
| (c3) llms.txt 強化     | llms.txt 加一節指向 manifest + meta.json；無運算 LLM 讀 meta.json 的 title/headingPath 自己挑，再 fetch `/raw/`                                                                                                                             | ✅ 零建設成本（端點全部現成），cover「只會 fetch 的 LLM」長尾                                                                        |

**判定**：讀者走 (b)+(b+)+(b++)，AI 走 (c1)+(c2)+(c3)。瀏覽器 query embedding 是唯一被砍掉的支線——它是六個選項裡成本最高、受益最薄的。

### 2.3 軸三：跨語系策略

| 策略                                                    | 檢索品質                                                                                                                                                     | 體積                                                       | 判定                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | --------------------- |
| (i) 多語共空間單一索引（zh query 直接撈 ja chunks）     | mE5 跨語對齊可用但弱於單語匹配（小模型跨語是最先犧牲的能力）；6 語混索引 top-k 會被同篇文章的 6 個譯本互相佔位，需 slug 去重                                 | 50K chunks 必須全載（19 MB）才能服務任一查詢               | ❌ 不當主路徑         |
| (ii) **每語言獨立 shard + `translatedFrom` 橋接｜主推** | 查詢語言 shard 內做**單語匹配（embedding 模型最強的場景）**；命中後沿 `_translations.json` 1:1 映射到讀者語言。語料 ~98% 平行 → 橋接近乎無損且 precision = 1 | 單次查詢只 fetch 一個 shard（4.5–6 MB，本地 cache 後為 0） | ✅                    |
| (ii+) 缺口 fallback                                     | ~2% 未翻譯文章：查詢語言 shard ∪ zh canonical shard（zh 是 SSOT 超集），靠 mE5 共空間吃 zh chunks，結果標注「未翻譯，回 zh 原文」                            | +zh shard 4.5 MB                                           | ✅ 共空間只在這裡出場 |

**結論**：這個語料的平行性是稀有資產——多數 RAG 系統羨慕不來的 ground-truth 跨語映射。讓 embedding 做它擅長的單語匹配，讓翻譯圖做跨語，是品質/體積雙優解。唯一要全 6 語都 embed 的理由（而非只 embed zh）也在此：ja 讀者用 ja 查詢在 ja shard 的命中率，顯著高於 ja 查詢跨語打 zh shard。

### 2.4 被否決的旁支（記錄否決理由）

- **Supabase pgvector**（deps 裡已有 supabase-js）：向量可以塞免費 tier，但讀者端查詢仍需 query 向量——靜態站沒地方算（Edge Function = serverless，超出約束）；CJK 全文檢索 tsquery 不支援；free tier 一週不活躍會 pause，對「基礎設施」級功能不可靠。feedback widget 用它是低 stakes，RAG 不是。
- **Pagefind 整站取代 minisearch**：fragment 按需載入很適合靜態站，CJK 用 Intl.Segmenter 也能用，但 CJK 無詞形展開、與既有 minisearch/CLI 雙端共用 tokenizer 的架構衝突，遷移成本 > 邊際收益。保留為「未來想索引全文 body 時」的再評估項。
- **llms-full.txt**：4,800 篇 × 21.6 KB ≈ 100 MB，超出單檔合理範圍；manifest + `/raw/` 分頁取代。

---

## 3. 推薦架構（文字版）

```
                            GitHub Actions（deploy.yml，每次 push）
 ┌────────────────────────────────────────────────────────────────────────┐
 │ knowledge/**.md (SSOT, 6 langs)                                        │
 │   │  git diff HEAD~1 → 有 .md 變更才進入（沿用 OG skip-detect）          │
 │   ▼                                                                    │
 │ scripts/core/build-embeddings.mjs                                      │
 │   ├─ chunk-markdown.mjs：heading-aware 切塊（目標 ~450 tokens）          │
 │   ├─ chunk hash = sha256(modelRev+lang+canonical+text)[:16]            │
 │   ├─ 與上一版索引 diff（actions/cache → 失敗 fallback 抓線上版）          │
 │   ├─ 只 embed 新/變 chunks：mE5-small ONNX int8（onnxruntime-node）     │
 │   │   "passage: " 前綴 → L2 normalize → int8 量化（×127）               │
 │   └─ 輸出 public/api/rag/{manifest.json, {lang}/meta.json,             │
 │        {lang}/vectors-i8.bin} + public/api/related/{lang}.json         │
 └────────────────────────────────────────────────────────────────────────┘
                  │ astro build → dist → GitHub Pages（純靜態）
                  ▼
   https://taiwan.md/api/rag/manifest.json          https://taiwan.md/api/search-{lang}.json
        │                     │                                  │
        ▼                     ▼                                  ▼
 ┌──────────────┐   ┌────────────────────┐          ┌─────────────────────────┐
 │ AI：MCP/CLI   │   │ AI：外部 agent      │          │ 讀者：瀏覽器              │
 │ taiwanmd ≥0.8 │   │ (manifest 自取向量) │          │ minisearch per-lang shard │
 │ query 本地編碼 │   │ 或 llms.txt →      │          │ + tag 跨語詞表            │
 │ hybrid = RRF( │   │ meta.json →        │          │ + related-articles        │
 │  minisearch,  │   │ /raw/{cat}/{slug}  │          │ （無瀏覽器端模型）         │
 │  cosine )     │   │ top-k fetch        │          └─────────────────────────┘
 │ → /raw/ 取文  │   └────────────────────┘
 └──────────────┘
 跨語系：query lang shard 單語檢索 → _translations.json 橋接顯示語言
         未翻譯缺口 → ∪ zh shard（mE5 共空間）→ 標注回 zh 原文
```

### 索引 schema（`rag-v1`）

```jsonc
// public/api/rag/manifest.json
{
  "schema": "rag-v1",
  "model": "intfloat/multilingual-e5-small",
  "modelRevision": "<HF commit sha>",          // 換版本 = 全量重建，消費端據此驗相容
  "dim": 384,
  "quant": "i8-unit",                          // 單位向量 ×127 → Int8；點積≈cosine（誤差 <0.5%）
  "queryPrefix": "query: ",
  "passagePrefix": "passage: ",
  "builtAt": "2026-06-13T00:00:00Z",
  "sourceCommit": "<git sha>",
  "langs": {
    "zh-TW": { "chunks": 7700, "meta": "/api/rag/zh-TW/meta.json", "vectors": "/api/rag/zh-TW/vectors-i8.bin" },
    "en":    { "chunks": 10200, "meta": "...", "vectors": "..." }
    // ... 6 langs
  }
}

// public/api/rag/{lang}/meta.json — 陣列順序 = vectors 列順序
{ "chunks": [
  { "i": 0,
    "id": "history/源興牛#3",                  // canonical 路徑 + chunk 序
    "slug": "history/源興牛",                  // → /raw/history/源興牛.md、/{lang}/{slug}
    "t": "擎天崗的19頭牛…",                     // 文章 title
    "h": "1933年，基隆港靠岸的黑牛",             // headingPath（給無運算 LLM 掃讀）
    "o": [812, 1604],                          // body 字元 offset（取證用）
    "x": "0be561fb740254b6" }                  // chunk content hash（增量 diff key）
] }

// vectors-i8.bin：Int8Array，長度 = chunks × 384，row-major
```

---

## 4. CI/CD 整合設計

### 4.1 增量機制（content-hash，不用 mtime）

OG 用 mtime 是因為產物對「檔案」一對一；embedding 對「chunk」一對一，**hash 比 mtime 更強也更穩**（且 repo 已有 `sourceContentHash` 心智模型）：

1. 載入上一版 `meta.json`（所有語言），建 `hash → vector` 映射。
2. 重新 chunk 全語料（純字串操作，50K chunks <10 秒），算新 hash 集。
3. `新集 − 舊集` = 要 embed 的 chunks；`舊集 − 新集` = 要刪的。重排時 hash 不變、只搬位置，零重算。
4. 改 chunker 規則 / 換模型版 = hash 全變 = 自動全量（modelRev 入 hash 的設計讓「忘記手動觸發重建」不可能發生）。

### 4.2 Cache key 設計（鏡像 OG pattern 的 restore/save 拆分）

```yaml
# deploy.yml 新增三步（Build 之前）
- name: Restore RAG embeddings cache
  uses: actions/cache/restore@v4
  with:
    path: .rag-cache # 上一版 meta.json + vectors-i8.bin（≈28 MB，遠低於 10 GB quota）
    key: rag-emb-v1-${{ hashFiles('scripts/core/build-embeddings.mjs', 'scripts/core/chunk-markdown.mjs') }}-${{ github.run_id }}
    restore-keys: |
      rag-emb-v1-${{ hashFiles('scripts/core/build-embeddings.mjs', 'scripts/core/chunk-markdown.mjs') }}-
      rag-emb-v1-

- name: Build embeddings (incremental)
  run: node scripts/core/build-embeddings.mjs --incremental --max-new-chunks 3000
  # --max-new-chunks：增量安全閥。超過（= cache 失效且 fallback 也失敗）就 skip + 警告，
  # 不讓 deploy 卡 30 分鐘。全量走 workflow_dispatch inputs.rag_full=true（timeout 120 min 夠用）。

- name: Save RAG embeddings cache
  if: steps.rag.outputs.embedded != '0' # 同 OG：沒算新東西就不存，避免 cache churn
  uses: actions/cache/save@v4
  with: { path: .rag-cache, key: <同上含 run_id> }
```

模型檔（118 MB ONNX）另用一條 `actions/cache`，key = `hf-model-${modelRevision}`，避免每次 run 下載。

### 4.3 失敗 fallback 鏈（沿用「fail loud, degrade graceful」）

1. **actions/cache miss**（7 天未用被逐出 / key 改版）→ `--warm-from-live`：fetch `https://taiwan.md/api/rag/manifest.json`，驗 `schema+modelRevision` 相符後把線上 shard 當 warm base。線上版本身就是上次成功 build 的產物，這條鏈讓 cache 逐出的代價從「30 分鐘全量」降到「多 fetch 28 MB」。
2. **warm base 也失敗且 delta > 閾值** → skip 該步驟、`public/api/rag/` 不產出 → 消費端 graceful degrade：MCP 偵測 404 退回 lexical search；同時寫一筆進 dashboard-alerts pattern（不准靜默壞第二次，REFLEXES 同款紀律）。
3. **embedding 中途錯誤**（單 chunk OOM/壞字元）→ 該 chunk 記 null 並續跑，結尾 ratio guard：成功率 <99% 就 fail loud。

### 4.4 產物切檔策略

- **按語言 shard**（決策確定）：消費端永遠只需要 1–2 個語言 → 單次 fetch 4.5–6 MB 而非 28 MB；增量更新時未動語言的 .bin 位元組不變，CDN cache 命中。
- 不按 category 再切：單語 shard 已 <6 MB，再切徒增請求數。
- `.bin` 與 `meta.json` 分離：向量是高熵資料 gzip 無感，metadata 是 JSON gzip 後 ~30%；分離讓 Pages/Fastly 對後者自動壓縮。
- `public/api/rag/` 加進 `.gitignore`（同 search-minisearch.json 慣例）——**不 commit 進 repo**，杜絕 git 歷史膨脹；持久性由 actions/cache + 線上 fallback 雙保險承擔。

### 4.5 CI 時間預算

| 場景                                   | 新增時間                                   | 佔現有 ~4.5 min build 比例          |
| -------------------------------------- | ------------------------------------------ | ----------------------------------- |
| 無 .md 變更（skip-detect 短路）        | +0 s                                       | 0%                                  |
| 日常（~30 篇變更 ≈ 300 chunks）        | +15–40 s（含 chunk 全掃 + 模型冷載 ~10 s） | ~10%                                |
| babel 大批次（~300 篇 ≈ 3,000 chunks） | +2–4 min                                   | 安全閥邊界，可調 `--max-new-chunks` |
| 全量（手動 dispatch）                  | 25–45 min                                  | 一次性事件                          |

---

## 5. MVP 實作清單

### Phase 0：讀者搜尋修復（0.5 人日，獨立可 ship，不依賴向量層）

1. `scripts/core/build-search-index.mjs`：掃描範圍 zh+en → 6 語（路徑模式照 `_translations.json` key 結構）；輸出改為 `public/api/search-{lang}.json` 六個 shard；欄位加 `headings_bigram`（H2/H3 文字）。
2. `src/layouts/Layout.astro` `_initSearchEngine()`：按 `document.documentElement.lang` fetch 對應 shard；結果列加 lang-switch 連結（`lang-switch-map.json` 既有）。
3. `.gitignore` 加 `public/api/search-*.json`；舊單檔保留一版 redirect 期。
4. 驗收：ja 頁面搜「夜市」有結果（今天是 0 筆）；shard 大小 ≤ 1.8 MB/語言。

### Phase 1：向量索引層（1.5 人日）

5. `scripts/core/chunk-markdown.mjs`（新檔）：gray-matter 去 frontmatter → 按 H2/H3 切段 → 目標 450 tokens（CJK ≈ 700 字、Latin ≈ 1,800 字元）、下限 120 tokens 併入前段、跨段 overlap 1 句；回傳 `{id, slug, lang, title, headingPath, offsets, text, hash}`。**先寫 `tests/rag/chunker.test.mjs`**（邊界：無 heading 長文、表格、footnote 區塊）。
6. `scripts/bench/embed-throughput.mjs`（新檔）：500 chunks 實測 4 vCPU 吞吐——**這是 go/no-go 閘門**：≥15 chunk/s 走主推；<15 切備選 GitHub Models。
7. `scripts/core/build-embeddings.mjs`（新檔）：§3 schema + §4.1 增量 + §4.3 fallback；依賴 `@huggingface/transformers`（Node 下自動用 onnxruntime-node；devDependencies）；`--incremental / --full / --warm-from-live / --max-new-chunks / --langs zh-TW,en`。
8. `package.json`：加 `"rag:build": "node scripts/core/build-embeddings.mjs --incremental"`、`"rag:full": "... --full"`（**不**進 prebuild run-p——它需要 cache 語境，由 deploy.yml 獨立 step 跑；本機開發用 npm script 手動）。
9. `deploy.yml`：§4.2 三步 + `workflow_dispatch` inputs `rag_full`。
10. 範圍控制：MVP 先 `--langs zh-TW,en`（~18K chunks，全量 10–15 min 一次搞定，索引 ~9–10 MB），跑順一週再開 4 語。
11. 順手產物：`public/api/related/{lang}.json`（文章 centroid top-6，build 內多 30 行）。

### Phase 2：AI 消費端（1 人日）

12. `cli/src/lib/semantic.js`（新檔）：ensure-data 模式下載 manifest+shard 到本地 cache；query 編碼雙路：(a) `@huggingface/transformers` 本地（首次下載 118 MB，明示進度）、(b) `--gh-models` 用 `gh auth token` 打 GitHub Models（免下載）；Int8 點積 top-50。
13. `cli/src/lib/mcp-server.js`：新工具 `taiwanmd_semantic_search`；`taiwanmd_rag` 改 hybrid：RRF(k=60) 合併 minisearch top-50 與 cosine top-50，取 top-N 讀全文。模型不可用時靜默退回現行 lexical（介面不變）。
14. `cli/package.json` bump 0.8.0 + `cli/CONNECTOR.md` 補文件。
15. `public/llms.txt` 加 3 行「Machine-readable retrieval index」段指向 manifest（`refresh-llms-txt.py` 不需改——它只 patch 數字行）。
16. 驗收 query set：6 語各 10 條（含跨語專名、口語問句、sovereignty 敏感主題各 2 條），對照 lexical-only 的 top-5 命中率，寫進 `reports/research/2026-06/` 後續 bench 檔。

**工時合計：~3 人日**（三個 phase 各自獨立可 merge；最小切法 = Phase 1 zh+en + Phase 2 的 12–13 步 ≈ 1.5–2 人日即有可用的 AI 端語意 RAG）。

---

## 6. 風險

| #   | 風險                                                                                                                                                                                                           | 機率×衝擊       | 緩解                                                                                                                                                                                         |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **4 vCPU 吞吐估算失準**（25–50 chunk/s 是文獻外推，非實測）                                                                                                                                                    | 中×中           | Phase 1 第 6 步 bench 閘門先行；不及格直接切 GitHub Models 備選，架構其餘部分不變                                                                                                            |
| 2   | **mE5-small 品質天花板**（MIRACL ~59–61 vs bge-m3 67.8）                                                                                                                                                       | 高×低           | hybrid RRF 補詞彙精確匹配；manifest 帶 modelRevision，升級 EmbeddingGemma-256d / Mac 產 bge-m3 是換檔不換架構                                                                                |
| 3   | **ORT/模型版本飄移污染索引**（不同版本算的向量混在一起 = 靜默品質劣化）                                                                                                                                        | 中×高           | modelRevision 進 chunk hash（§4.1 第 4 點）——版本一變整批 hash 失效，物理上不可能混用                                                                                                        |
| 4   | actions/cache 7 天逐出 → 意外全量                                                                                                                                                                              | 高×低           | `--warm-from-live` fallback（§4.3）把代價降到一次 28 MB fetch                                                                                                                                |
| 5   | **Pages 1 GB 上限**：本機 dist 已 1.7 GB（og-images 為主），+28 MB 是雪上加霜                                                                                                                                  | 中×高           | 與本案獨立的既有隱憂，但本案堅持 int8 + 不產 fp32；建議另開 task 查 og-images 體積（4,800 張 jpg 的壓縮率）                                                                                  |
| 6   | Pages 100 GB/月流量：MCP 客戶端反覆拉 shard                                                                                                                                                                    | 低×中           | CLI 本地 cache + ETag 條件請求（ensure-data 既有模式）；shard 按語言已最小化                                                                                                                 |
| 7   | GitHub Models 備選的條款/限流變動                                                                                                                                                                              | 中×中（僅備選） | 備選降級鏈回主推自算；embedding tier 64K tokens/req 的 batch 打包要守住                                                                                                                      |
| 8   | **Sovereignty lens**：候選模型中 bge-m3（北京智源）、Qwen3（阿里）出身 PRC 體系。embedding 模型沒有 refusal 行為，但敏感主題（二二八/戒嚴/主權）的語意空間是否有意識形態指紋**未經驗證**——理論風險，非已證事實 | 低×高           | 主推已選 e5（Microsoft）、升級首選 EmbeddingGemma（Google）自然避開；若未來評估 bge-m3，先用 Sovereignty-Bench-TW 的 query set 跑 retrieval 偏移對照（這正是 BENCH-PIPELINE 基建的用武之地） |
| 9   | chunk 邊界品質（CJK 斷句、表格、腳註）拖累檢索                                                                                                                                                                 | 中×中           | chunker 單測先行（第 5 步）；meta 帶 offsets 可追溯，壞 case 修 chunker 後 hash 自動失效重算                                                                                                 |

---

## 附錄 A：計算依據

**Chunk 數估算**（heading-aware、目標 450 tokens、overlap ~12%、扣 frontmatter/footnote ~10%）：

| 語言     | 原始 bytes | 估字元數                       | 每 chunk 字元 | chunks                        |
| -------- | ---------- | ------------------------------ | ------------- | ----------------------------- |
| zh-TW    | 12.97 MB   | ~4.8M（CJK ~2.7 B/字元混合比） | ~700          | ~7.7K                         |
| ja       | 16.87 MB   | ~6.0M                          | ~700          | ~9.6K                         |
| ko       | 16.43 MB   | ~6.3M                          | ~700          | ~10.1K                        |
| en       | 16.43 MB   | ~16.4M                         | ~1,800        | ~10.2K                        |
| es       | 18.19 MB   | ~17.3M                         | ~1,800        | ~10.8K                        |
| fr       | 18.52 MB   | ~17.6M                         | ~1,800        | ~11.0K                        |
| **合計** | 99.4 MB    |                                |               | **~50K（不確定區間 45–55K）** |

**Token 總量**：CJK 以 ~1.1 字元/token、Latin 以 ~4 字元/token 估 → 全語料 ≈ 29M ×1.12 overlap ≈ **32M tokens**。

**體積公式**：`chunks × dim × bytes/維`。50K × 384 × 1 (int8) = 19.2 MB；fp16 38.4 MB；fp32 76.8 MB；MRL 256d int8 = 12.8 MB。metadata ≈ 180 B/chunk × 50K ≈ 9 MB（gzip ~3 MB）。文章級 centroid only：4,824 × 384 int8 ≈ 1.9 MB。

**int8 量化**：先 L2 normalize 再逐維 ×127 取整；單位向量點積即 cosine，量化誤差對排序的影響 <0.5%（384 維下可忽略，不需 per-vector scale）。

## 附錄 B：主要資料來源

- [Xenova/multilingual-e5-small（ONNX，q8 ≈ 118 MB，384d，100 語）](https://huggingface.co/Xenova/multilingual-e5-small) ／ [mkdocs-material 靜態站語意搜尋討論（同款模型選型結論）](https://github.com/squidfunk/mkdocs-material/discussions/5483)
- [Multilingual E5 技術報告（MIRACL nDCG@10：small ~59–61 / large 65.4–66.5）](https://arxiv.org/pdf/2402.05672) ／ [BGE-M3（dense 67.8，1024d，8192 ctx）](https://www.emergentmind.com/topics/bge-m3-model)
- [EmbeddingGemma 官方發佈（308M，768d MRL→512/256/128，QAT <200 MB RAM，MTEB 多語 <500M 第一）](https://developers.googleblog.com/en/introducing-embeddinggemma/) ／ [HF blog（transformers.js / ONNX 支援）](https://huggingface.co/blog/embeddinggemma)
- [Qwen3-Embedding 系列（0.6B/4B/8B，100+ 語，8B MTEB 多語榜首 70.58）](https://qwenlm.github.io/blog/qwen3-embedding/)
- [sentence-transformers static 模型（CPU 100–400× 快；multilingual 版 STS 92.3% of mE5-small；**非 retrieval 用途**）](https://huggingface.co/blog/static-embeddings) ／ [potion-multilingual-128M（256d，101 語，bge-m3 蒸餾）](https://huggingface.co/minishlab/potion-multilingual-128M)
- [Embedding API 定價彙整 2026（OpenAI 3-small $0.02/M、voyage-4-lite $0.02/M、gemini-embedding-001 $0.15/M）](https://pecollective.com/tools/text-embedding-models-compared/) ／ [Gemini API 官方定價](https://ai.google.dev/gemini-api/docs/pricing)
- [GitHub Models embeddings REST API](https://docs.github.com/en/rest/models/embeddings) ／ [免費限流（Embedding tier：15 req/min、150 req/day、64K tokens/req、併發 5）](https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models)
- [GitHub Pages 限制（站 ≤1 GB、流量 soft 100 GB/月、deploy 10 min）](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [FastEmbed（CPU ~5K tokens/s 量級、qint8 加速 1.38×）](https://qdrant.tech/articles/fastembed/) ／ [Transformers.js v3（WebGPU，Node 端 onnxruntime-node）](https://huggingface.co/blog/transformersjs-v3)
- [Pagefind CJK 現況（Intl.Segmenter、fragment 按需載入）](https://github.com/Pagefind/pagefind/issues/987) ／ [Ollama bge-m3（1.2 GB）](https://ollama.com/library/bge-m3)

---

_研究方法註記：repo 數據全部來自 2026-06-13 本機實測（檔數、bytes、既有 index 體積、deploy.yml/CLI 原始碼）；模型與定價數據來自上列 2025–2026 公開來源；CI 吞吐為文獻外推值，已在 MVP 第 6 步設 bench 閘門強制實測後才放行。_
