# P0 算力疊實驗：語意索引 + 史料轉錄（2026-06-14）

> 哲宇「完整做 P0 實驗+驗證+紀錄+進化」。深度盤點（[fleet-compute-all-pipelines](./fleet-compute-all-pipelines-2026-06-14.md)）的 P0 兩件，趁 fleet 在實機跑、驗、記、進化。

---

## P0-1：語意索引 keystone（一次建、八條機制用）

### 實驗
新增 `scripts/core/build-embeddings.mjs`：讀全 corpus（793 篇 × 6 語）→ 每篇 article-level embed text（title + description + headings + 首段）→ fleet bge-m3（4090，`/api/embeddings`，1024d）→ L2-normalize + int8 量化 → 產出：
- `public/api/related/{lang}.json` — 每篇 top-6 cosine 鄰居（reader「你可能也想看」，零客戶端成本）
- `public/api/rag/{lang}/{meta.json, vectors-i8.bin}` — AI/MCP 語意檢索 shard
- `public/api/rag/manifest.json` — schema/model/dim/quant，**model-versioned 可換**

硬體：bge-m3 在 4090（always-on，非 5090——embedding 輕量、4090 就夠，**所以語意索引不是 6/16-urgent**，跟 bench 的 5090-only LLM 模型不同）。

### 驗證（cross-lingual 語意搜尋——keystone 的核心價值）
新增 `scripts/core/rag-query.mjs`（consumer prototype）。實測：

| query（語言） | top 命中 | 證明 |
| --- | --- | --- |
| **台湾の民主主義と選挙**（ja） | 選挙過程 0.63 / 政治環境と選挙制度 / 中選会制度 / 選挙と政党政治 | **ja 讀者今天關鍵字搜零母語結果 → 語意全命中**。這是 4 語讀者的 visibility 修復 |
| indigenous Taiwanese culture（en） | Indigenous Music / 16 Peoples Cultural Map / Prehistoric Era / Mythology / Land Justice | **跨類別**語意 discovery（music+culture+history+society+nature） |
| 戒嚴與白色恐怖的歷史（zh-TW） | 戒嚴時期 0.57 / 台灣白色恐怖 / 媒體與新聞自由 / 解嚴後台灣文學 / 國民政府遷台 | 精確 + 語意鄰接（媒體自由、解嚴文學） |

related-articles 也語意連貫（樟腦戰爭 → 二二八/乙未之役/三個外國人看乙未，全台灣殖民衝突史）。**keystone 成立**。

### 進化
`rag-query.mjs` 是 consumer 原型，也是未來 `taiwanmd` MCP `semantic_search` tool 的參考實作。下一步（非本 session）：MCP tool（hybrid RRF = minisearch 詞彙 + cosine）+ reader related-articles UI（文章頁 footer）。

### 待哲宇拍板 / caveat
- **steady-state 架構**：本次是 fleet-bge-m3 **bootstrap**（全量一次性，最高品質 1024d）。日常增量該走 CI-e5-small（deploy-coupled、飛輪自轉、19MB）還是 always-on fleet bge-m3（品質高、51MB）——manifest version 化所以可換，但要哲宇定。dist 已 1.7GB > Pages 1GB，bge-m3 全量 ~9MB（related ~4MB + vectors ~5MB）佔比可接受但非零。
- 本次提交的索引是**地端 snapshot**：新文章不在內，直到 CI/fleet 重跑。bootstrap 證明能力，不是 steady-state。

---

## P0-2：史料轉錄 POC（不能上雲、唯一地端解）

### 實驗
fleet `transcribe`（3090 faster-whisper CUDA）。源：國家人權博物館 2018 形象短片（公開機構影片，比個別受難者證言低敏感，但同 PEER-INGESTION 的 人權館 use case）。yt-dlp 取前 90s 音檔 → `fleetctl run transcribe`（scp 到 3090 → faster-whisper → 取回 srt/txt，**全程不出境**）。

### 驗證
3090 CUDA、lang=zh、90s → 19 段、546 字。轉出**連貫的人權館口述史**：

> 「後來又被判十年的徒刑，沒有做什麼，只是愛看詩、愛唱歌，這樣的就是被關了十年…我們台灣進步很多…追求我們本來就有的人權，不讓他再像過去一樣受到壓制，受到侵害，天賦人權」

srt 帶時間戳（可引用：`30.00→32.96 後來又被判十年的徒刑`）。**機制 + 品質都成立，這正是 REWRITE Stage 1 / PEER-INGESTION 的影音來源 → 可引用 text 解鎖**。

### 進化 / caveat
- **s2t 必補**：faster-whisper 輸出簡體（后来/爱/没），Taiwan.md 用繁體 → 要接 OpenCC s2t 後處理。這是 transcribe 進 REWRITE/PEER 產線前的必經閘（小、已知）。
- 首段「中文字幕由 Amara.org 社群提供」是影片內嵌字幕殘留，落地要去頭。
- 個別政治受難者證言（高敏感）要人權館提供實際音檔——本 POC 用公開形象短片證明能力。**不出境是這條的鐵律**（證言永遠不離台）。

---

## 一句話

兩件 P0 都從紙上證到實機。語意索引一份建好、八條機制（搜尋/related/去重/factcheck/feedback/dashboard/distill）能接；史料轉錄證明了一個不能上雲的全新 peer 類別。算力疊基礎設施不是空話——cross-lingual 搜尋讓 ja 讀者從零結果到全命中，transcribe 讓政治受難者證言能在不出境的前提下變成可引用史料。

---

_v1 | 2026-06-14 | build-embeddings.mjs + rag-query.mjs（4090 bge-m3）+ fleet transcribe（3090）實機驗證。keystone + 史料轉錄都成立。steady-state 架構 + s2t 待落地。_
