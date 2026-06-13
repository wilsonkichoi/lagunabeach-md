# Taiwan.md × 算力軍團：全 pipeline 加速與進化深度盤點（2026-06-14）

> 哲宇 directive：完整深度盤點——這套地端 GPU 系統怎麼幫到 rewrite-pipeline / 其他所有 pipeline 的任何部分，以及用算力疊出 Taiwan.md 其他運作機制裡的加速與進化。
>
> 方法：4 個 Explore agent 平行讀 30 條 pipeline + 104 個 tool + 軍團 6 服務，主 session 綜合。**agent 的 claim 當線索不當 oracle**（REFLEXES #31）——effort 估算、「現在用雲端 SD」這類未驗的說法已標記。

---

## 0. 核心論點：算力不是加速器，是會疊的基礎設施

把「用 5090/fleet」想成「讓某一步快一點」會低估它。真正的槓桿在三件事：

1. **一次建、N 條用的 keystone**：語意 embedding 索引建一次（fleet bge-m3），**搜尋 + 相關文章 + 選題去重 + factcheck 段落召回 + feedback 聚類 + dashboard 趨勢 + distill 預聚類**八條機制同時變聰明。這是「疊」字的核心——單一算力投資、多 pipeline 升級。
2. **解鎖原本不可能的事（evolve > accelerate）**：人權館口述歷史史料**不能上雲**（政治受難者證言出境＝主權風險），地端 transcribe 是唯一解。這不是「快一點」，是「從 0 到 1」。
3. **複合迴路**：transcribe 出新素材 → 餵 rewrite → 出更好文章 → 出更好孢子；embed 出更好 discovery → 更高 engagement → 更準的 EVOLVE 訊號 → 更好選題。算力在迴路裡，產出回頭餵入口。

**分層契約（貫穿全部）**：雲端 Claude＝0→1 策展 / 最終判斷 / editorial / 對外 prose；軍團＝高頻寬肌肉（批次 / 草稿 / 預篩 / 私密 / 結構化）。軍團輸出一律「claim-as-input-not-oracle」——預篩 / 草稿 / 評分，人或 Opus 守最終閘。

---

## 1. 六服務 × 運作面（去重後的全景）

### 🎙 transcribe（faster-whisper）— 最大的 evolve 解鎖

| 落點 | 解鎖 | A/E | 值/工 | 主權 |
| --- | --- | --- | --- | --- |
| **PEER-INGESTION 史料**（人權館口述歷史 / 政治受難者證言 / 演講） | 音檔→可引用 text，**現在不可能**（不能上雲）→ 開一個全新 peer 類別 | **Evolve（最高）** | H/H | **不出境鐵律**——這是唯一只能地端的 |
| **REWRITE Stage 1 RESEARCH**（影片 / podcast / 新聞 video 來源） | 口語來源→可引用逐字 + 可查證 → 補足「只有文字來源」的偏食 | Evolve | H/H | 引語查證仍 cloud |
| **media-richness audit**（文章 iframe 影片） | 自動抽影片逐字 + metadata → 餵 richness scorer（現在只數 iframe） | Evolve | M/H | 官方影片公開 |

### 🖼 image（diffusers SDXL）— 補媒體閘門 + 解 Wikimedia 瓶頸

| 落點 | 解鎖 | A/E | 值/工 |
| --- | --- | --- | --- |
| **REWRITE Stage 4 MEDIA** hero / inline 場景圖 | 沒 CC 圖時生成候選（人審後 ship）→ 從「沒圖就 ship」進化到「生成候選過 editorial 閘」 | Evolve | H/H |
| **SPORE 配圖**（1080×1080 square） | 孢子視覺資產地端生成、零成本 | Evolve | M/M |
| **media-richness gate**（EDITORIAL ≥2 靜態圖硬底） | 抬高媒體深度基線、不靠 Wikimedia 429 | Evolve | M/H |

> ⚠️ 鐵律：生成圖一律**人審後才 ship**（避免幻覺技術細節 / 版權漂移 / 維持品牌）。主權敏感視覺（抗爭 / 政治地理）地端生成繞 PRC filter。
> ⚠️ 待驗：agent 說「現在 hero 走雲端 SD spend」——**Taiwan.md 目前用 Wikimedia/CC 圖、未確認有雲端 SD 花費**，別當成本論據。

### 🔢 embed（bge-m3 / e5-small）— keystone 語意層（見 §2）

八條落點共用同一索引：跨語搜尋、related-articles、ARTICLE-INBOX 去重、FACTCHECK 段落召回、FEEDBACK 聚類、spore 去重、dashboard 語意趨勢、DISTILL 預聚類。**這是「疊」的支點，獨立成 §2。**

### 🧠 llm（gemma4:26b，主權安全，零成本）— 預篩 / 草稿肌肉

| 落點 | 解鎖 | A/E | 值/工 | 品質邊界 |
| --- | --- | --- | --- | --- |
| **MAINTAINER §2.3 紅旗 pre-screen** | PR diff 預篩 10 紅旗（placeholder / 冒名 / 政治 / bulk delete）→ 雲端只看可疑的 | Accelerate | H/M | 預篩 only，close 決定留人 |
| **FACTCHECK Phase 2-3** atom 抽取 + 首過 claim-match | 批次抽 8 類 atom + 標 source 不符 → 縮人工閱讀面 | Accelerate | H/M | 逐字 Ctrl-F / 4 維審計留雲端 |
| **prose-health 語意預篩**（memory/diary/article） | 對位句 / 破折號 / meta-tag 的**語意**評分（補 regex 閘） | Evolve | H/L | hard=0 regex 閘仍是真相 |
| **EVOLVE Phase 2-5** 評分 + 比較 reasoning | GA/SC/GitHub 三源批次評分 + 草稿「為什麼這篇」 | A+E | M/M | 哲宇審最終優先序 |
| **BENCH Stage 5a** heuristic pre-filter | gemma4 先標 tier 0-1 短路 → Opus 只判可疑 → 省 30-50% Opus | Accelerate | M/L | Opus 判定 canonical |
| **ROUTINE-AUDIT / DISTILL 預聚類** | commit 分類 + 4 lens 評分 + LESSONS 按 pattern 預聚類 + 標 vc=3 | Accelerate | M/M | 報告 prose / distill 升級留人 |
| **frontmatter 草稿** | readingTime / tags / category 批次草稿 | Accelerate | M/L | maintainer spot-check |
| **REWRITE/SPORE 草稿 scaffold** | quota 緊時 fleet 生草稿 → Opus 精修，省 Opus token | Accelerate | M/M | 最終 prose 必過 Opus |

### 🎬 encode（ffmpeg NVENC）— 媒體批次

| 落點 | 解鎖 | A/E | 值/工 |
| --- | --- | --- | --- |
| **image-ingest / land-media-batch** WebP / video 批次轉碼 | GPU 轉碼平行化；Mac 下載+驗 license 同時 3090 編前一批（**解 Wikimedia 429 瓶頸**） | Accelerate | M/L |
| **viz 模組 raster 快照**（email / social 用） | graph.md 禁 image-type viz（AI crawler 黑洞），但 email/social 要 raster → 自動截 tw-* 模組 | Evolve | M/M |

### 🌐 translate — 已上線

diary babel nightly（REMOTE-GPU v2.0，gemma4 + 整合性閘門）。article babel 留雲端品質天花板。

---

## 2. Keystone：語意索引（一次建、八條用）

這是整份盤點最重要的一塊。**Taiwan.md 今天完全沒有語意層**——搜尋是 MiniSearch 純關鍵字，related-articles 是 category 鄰近，選題去重靠 grep。建一份 embedding 索引（fleet bge-m3 或 CI e5-small），八條機制同時升級：

| # | 機制 | 從 → 到 | 值/工 |
| --- | --- | --- | --- |
| 1 | **跨語搜尋** | ja/ko/es/fr 讀者今天母語**零結果** → 六語 shard 語意命中 | H/M |
| 2 | **related-articles** | category 鄰近（genre 錯配）→ 跨類語意手足（People↔Society、跨語 cousin），零客戶端成本 | M/M |
| 3 | **ARTICLE-INBOX 去重** | grep（2026 底 DONE-LOG 破百＝破功）→ 語意比對新候選 vs 既有 | M/L |
| 4 | **FACTCHECK 段落召回** | Ctrl-F 低召回（同義/釋義/跨語 miss）→ 語意找候選段落、人眼確認逐字（**抓 over-citing 幻覺**） | H/M |
| 5 | **FEEDBACK 聚類** | exact-substring dedup → 「8 個讀者報同一錯」聚成 1 issue | M/L |
| 6 | **spore 去重** | 無 → 「上月發過蘇打綠、這次別重複」 | L/L |
| 7 | **dashboard 語意趨勢** | 生數字 → 「本週 5 個浮現 cluster：半導體×科技 +45%」→ 餵 Beat 5 反芻看盲點 | M/H |
| 8 | **DISTILL 預聚類** | 人工讀全 INBOX → 按 pattern 預聚 + 標 vc=3 ready | M/L |

**這就是「用算力疊出」的字面意思**：#4 的 factcheck 召回、#1 的搜尋、#3 的去重，都是同一份索引的不同 query。建一次，八條受益。

> ⚠️ Flywheel caveat（RAG 設計文件 2026-06-13 的決定）：拒絕 local-GPU embedding 當 **steady-state**（哲宇不開機→index 過期→違反飛輪自轉），主推 **CI e5-small**（deploy-coupled、永遠同步）。**但**那決定先於 always-on fleet（3090 桌機常開）。和解：**5090 走前做一次性全量 bge-m3 bootstrap（最高品質、它走前的不可替代捕捉），CI e5-small 維護日常增量**（schema 版本化、可換）。或 always-on 3090 維護增量。這是要哲宇拍板的架構選擇（品質 vs 飛輪韌性 vs 體積——dist 已 1.7GB > Pages 1GB，bge-m3 1024d ~51MB vs e5-small 384d ~19MB）。

---

## 3. 三條複合迴路（產出回頭餵入口）

**迴路 A — 內容品質**：transcribe 史料/影片 → 新可引用素材 → REWRITE 更深 → 更好文章 → 更好孢子 → 更多 engagement。**算力在源頭擴張了可寫的東西**。

**迴路 B — discovery 飛輪**：embed → related + 跨語搜尋 → 讀者找得到更多 → engagement↑ → GA/SC 訊號更豐 → EVOLVE 選題更準 → 寫對的文章 → 又餵 embed。**算力讓「讀者讀懂台灣」這個使命的觸及面變大**。

**迴路 C — 信任閘門**：embed（factcheck 召回）+ llm（atom 抽取）→ 更快更深的 factcheck → 抓出 over-citing/幻覺 → 可追溯性↑ → 信任訊號（error boundary = traceability）。**算力把品質閘門從「抽樣」推向「全覆蓋」**。

---

## 4. 優先 roadmap（值/工 + 解鎖性 + 5090 時窗）

**P0 — keystone + 不可替代（趁 5090 在）**
- **語意索引 bootstrap**（§2）：5090 全量 bge-m3 跑一次（它走前的不可替代捕捉）→ 先落 related-articles（#2，700KB 零客戶端）+ 跨語搜尋骨架（#1）。一份索引解鎖八條。
- **transcribe 史料 POC**（人權館）：唯一只能地端的 evolve。接一個口述歷史音檔→可引用 text，證明 peer 新類別。

**P1 — 高值快贏**
- **image 進 REWRITE Stage 4 / SPORE**：補媒體閘門 + 解 Wikimedia 429。人審閘。
- **llm pre-screen：MAINTAINER 紅旗 + FACTCHECK atom**：最大人工時間節省（factcheck 是 A 級文章 90-180min 瓶頸）。
- **prose-health 語意預篩**：所有 Semiont 產出共用閘，高值低工。

**P2 — 系統變聰明**
- FEEDBACK 聚類、dashboard 語意趨勢、DISTILL 預聚類、ROUTINE-AUDIT lens 評分、spore 去重。

---

## 5. 紀律與 caveat（別越界）

1. **品質邊界永遠是人/Opus**：fleet 全是 pre-screen / draft / score。最終 editorial、判斷、對外 prose 留雲端（§自主權邊界）。
2. **graceful degrade 鐵律**：fleet 離線＝skip 不算 fail，下 cycle 重試 / fallback（同 diary babel）。不能讓地端失效 block 飛輪。
3. **主權閘**：Taiwan content 的 llm 一律 gemma4 家族（bench 驗過 Tier 3-4）；史料/analytics 不出境。
4. **快取 insight 不快取 input**：llm 分類（atom / lens / watermark）存結構化 JSON 供人審；同 input 不重跑。
5. **待驗 claim**：本報告的 effort 估算、「雲端 SD spend」說法、各 pipeline 行號，是 agent 線索，落地前主 session 重驗（REFLEXES #31）。

---

## 6. 一句話收束

Taiwan.md 不缺算力的「點」（單步加速），缺的是**把算力當基礎設施疊起來**——一份語意索引餵八條機制、transcribe 開一個不能上雲的史料類別、image 補媒體閘門、llm 把品質閘從抽樣推向全覆蓋。雲端是 0→1 的腦，軍團是讓腦的每個決定都站在更厚素材 + 更聰明 discovery + 更深品質閘上的肌肉。**5090 走前（6/16）最該做的一次性事：全量語意索引 bootstrap + 人權館史料 transcribe POC——兩件都是「它走後做不了或做不好」的。**

---

_v1 | 2026-06-14 | 4 Explore agent 平行盤點 30 pipeline × 6 fleet 服務，主 session 綜合複合迴路 + keystone + roadmap。核心：算力是會疊的基礎設施，不是加速器。落地前各 claim 重驗。_
