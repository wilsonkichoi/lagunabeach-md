---
title: 'Taiwan.md Claude Code Connector — 進化分析與實作規劃'
type: 'design-report'
status: 'proposal'
author: 'Taiwan.md (Full-mode session 2026-06-05-manual)'
trigger: '哲宇 directive：參考 Twinkle Hub 做一個 Claude Code Connector'
reference: 'https://hub.twinkleai.tw/'
autonomy: '報告本身在自主權內；connector 對外發布需哲宇拍板（§自主權邊界 對外溝通）'
related:
  - 'cli/src/lib/mcp-server.js'
  - 'cli/src/commands/mcp.js'
  - 'reports/cli-evolution-roadmap-2026-04-20.md'
  - 'docs/semiont/MANIFESTO.md#主權的巴別塔'
last_updated: 2026-06-05
---

# Taiwan.md Claude Code Connector — 進化分析與實作規劃

> 哲宇給的題目：「參考 Twinkle Hub 做一個 Claude Code Connector，寫一篇 report 完整分析 Taiwan.md 怎麼進化。」
> 這份報告是**提案**，不是已執行的事。Connector 對外發布命中 [MANIFESTO §自主權邊界](../docs/semiont/MANIFESTO.md) 的「對外溝通」，需要哲宇拍板要不要 ship、ship 到哪個階段。報告本身在自主權內。

---

## TL;DR（先講結論）

1. **這不是從零做，是接最後一哩。** Taiwan.md 已經有一個**完整可用**的 MCP server（`cli/src/lib/mcp-server.js`），暴露 6 個工具：`search / read / rag / cite / organs / stats`。我這次 session 真的把它跑起來做了 MCP handshake，`initialize` + `tools/list` 都回正常 JSON，6 個工具的 schema 全在。它不是 scaffold，是活的。

2. **distribution channel 也已經接好了。** `taiwanmd` 這個 npm 套件**已經發佈在 v0.7.0**（我跑 `npm view taiwanmd version` 確認）。意思是任何人現在就能 `npx taiwanmd mcp serve`，零安裝。外部使用者第一次跑時 `ensure-data.js` 會自動 sync 知識庫到 `~/.taiwanmd/`，開箱即用。

3. **缺的是「最後一哩的包裝」**：(a) 一鍵安裝的 `.mcpb` bundle（Twinkle 那顆 47KB 的檔案）；(b) Claude Code 的一行安裝指令 + 文件頁；(c) 一個可選的遠端 endpoint 給不裝 node 的瘦客戶端。這三個加起來大概是 1-1.5 天的工，因為地基都在。

4. **核心戰略判斷：借 Twinkle 的「介面」，不借它的「商業模式」。** Twinkle Hub 是商業的 MCP-as-a-Service（API key、預付錢包、按工具計費、安裝時警告「授予存取你電腦上的所有東西」、遠端閉源、Anthropic 未驗證）。Taiwan.md 的連接器要走**相反那一極**：免費、CC BY-SA、無 API key、本地優先（隱私：stdio 跑在你自己機器上，知識查詢不外送）、開源可驗證。這個對比本身就是這次進化的靈魂。

5. **這條進化命中 Taiwan.md 的主權使命。** 連接器是一個**新的繁殖面**：以前孢子在社群平台繁殖，連接器讓 Taiwan.md 的引用級台灣知識**直接住進每個開發者的 AI coding session**。當世界上任何一個工程師問 Claude 關於台灣的事，`taiwanmd_rag` / `taiwanmd_cite` 給的是台灣自己的、有出處的聲音，繞過會選擇沉默或 reframe 的 PRC AI 中介層。這是 [CLAUDE.md §主權的巴別塔](../CLAUDE.md) lens 投射到一個全新的表面。

---

## §0　任務界定與自主權聲明

哲宇的指令含兩個動作：「做一個 Claude Code Connector」+「寫一篇分析報告與實作規劃」。

我這次 session 是 **Full mode**（觸發：BECOME §Step 0 High-stake「新 plugin / workflow 設計」強制升 Full），14 題 self-test 全過才動筆。

**自主權邊界三道濾網**（per [CLAUDE.md Bias 1 + Bias 4](../CLAUDE.md)）：

- **寫報告**：在自主權內。設計/分析報告放 `reports/` 是標準產物。
- **healing 既有 stale 文字**（mcp.js 的「preview / scaffold」過時字眼）：Micro 級，在自主權內。
- **公開發布 connector**（`.mcpb` 上架、文件頁、遠端 endpoint、宣傳）：命中「對外溝通」，**需要哲宇決定**。本報告把它拆成階段交給哲宇選。

所以這份報告的定位：把已經 80% 長好的器官攤開、補上 Twinkle 給的靈感、規劃剩下 20%，最後請哲宇決定執行到哪一階段。

---

## §1　Twinkle Hub 拆解：借什麼，不借什麼

我 fetch 了 hub.twinkleai.tw 全文。Twinkle Hub 的本質：**把台灣政府 open data（52,960 個資料集 / 19 領域）+ 49 個 tw-tools（地址正規化、郵遞區號、行政區碼…）+ 20 個官方 skills 包成單一 MCP gateway**，商業營運。

| 維度                       | Twinkle Hub 的做法                                                                                   | Taiwan.md 該不該借                                                 |
| -------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **一鍵安裝 `.mcpb`**       | 47KB bundle，雙擊 → 貼 API key → 完成                                                                | ✅ **借**。這是最值得抄的 UX。降低安裝摩擦是繁殖率的乘數           |
| **多客戶端文件**           | Claude Desktop / Claude Code / Copilot CLI / Codex CLI / OpenClaw / Ollama / Continue / Cline / curl | ✅ **借**。一份 server，多入口文件。Taiwan.md 已支援，只是沒寫文件 |
| **MCP native wire format** | `tools/list` / `tools/call` 原生，跨客戶端同協定                                                     | ✅ 已經是（SDK ^1.29.0）                                           |
| **遠端 endpoint**          | `api.twinkleai.tw/mcp/`，用 `mcp-remote` 橋接 desktop                                                | 🟡 **部分借**。當「可選瘦客戶端入口」，不當主路徑（見 §4）         |
| **API key 驗證**           | 必須，從 dashboard 取得                                                                              | ❌ **不借**。Taiwan.md 是公共財，知識查詢不該設門                  |
| **預付錢包 + 按工具計費**  | 固定價 per tool，hard cutoff                                                                         | ❌ **不借**。這是商業模式，跟 信念#3「知識是公共財」對立           |
| **閉源遠端服務**           | 安裝時警告「授予存取你電腦上所有東西」「Anthropic 未驗證」                                           | ❌ **不借**。Taiwan.md 開源、本地優先正好是信任面的反例            |

**一句話**：Twinkle 解決的是「政府 open data 太難用 → 包成付費 gateway」。Taiwan.md 解決的是「台灣的第一人稱聲音在 AI 裡缺席 → 包成免費的主權連接器」。同樣用 MCP，使命相反。借它的安裝體驗，拒絕它的收費閘門。

---

## §2　Taiwan.md 現況盤點：已經有什麼（附 live 驗證）

這節是整份報告的地基。**重點是「不是 greenfield」**——下面每一條我都實際驗過，不是憑記憶。

### 2.1 一個活的 MCP server（已驗證可跑）

`cli/src/lib/mcp-server.js`，用 `@modelcontextprotocol/sdk` ^1.29.0，stdio transport。我這次跑了真的 handshake：

```
$ printf '<initialize>\n<tools/list>\n' | node cli/src/index.js mcp serve
→ initialize 回 {"protocolVersion":"2024-11-05","serverInfo":{"name":"taiwanmd","version":"0.6.1"}}
→ tools/list 回 6 個工具，schema 完整
→ stderr: [taiwanmd] MCP server ready on stdio
```

暴露的 6 個工具：

| 工具              | 功能                                                 | 對 Claude session 的價值         |
| ----------------- | ---------------------------------------------------- | -------------------------------- |
| `taiwanmd_search` | 900+ 文章全文搜尋（中英雙語 minisearch）             | 找台灣主題的權威文章             |
| `taiwanmd_read`   | 依 slug 讀全文（frontmatter + body）                 | 把整篇注入 context               |
| `taiwanmd_rag`    | top-N 文章組成 prompt-ready RAG block                | 回答台灣問題前先拿到有出處的素材 |
| `taiwanmd_cite`   | **反幻覺原語**：只回有 `[^N]` 腳註 + 來源 URL 的句子 | 與其編一句，不如給可驗證的引用   |
| `taiwanmd_organs` | Semiont 8 器官健康分數                               | 生命體狀態查詢                   |
| `taiwanmd_stats`  | 文章數 / 分類 / 時間戳                               | 專案統計                         |

`taiwanmd_cite` 特別值得指出：它是把 Taiwan.md 的「引用鐵律」做成了一個 MCP primitive。這在 connector 市場裡是差異化武器——大多數知識 MCP 給你內容，Taiwan.md 給你**可驗證、帶來源 URL 的內容**。

### 2.2 distribution 已經接好

- **npm 已發佈 v0.7.0**（`npm view taiwanmd version` → `0.7.0`）。`npx taiwanmd …` 現在就能跑。
- **自動發版管線**：`.github/workflows/npm-publish-cli.yml`，推 `cli-v*` tag 觸發，跑測試 + 版號校驗 + npm provenance 發佈（見 `cli/RELEASE.md`）。
- **外部使用者開箱即用**：`ensure-data.js` 偵測「不在 repo 內」時，自動 sync 知識庫到 `~/.taiwanmd/knowledge` + `~/.taiwanmd/cache`。不用 clone repo。

### 2.3 公開 HTTP API 已存在（遠端 endpoint 的半成品）

`public/api/` 底下已經有：

- `articles.json`（3.7MB，全文）
- `search-minisearch.json`（預建搜尋索引）
- `article-index.json`（163KB 輕索引）
- `dashboard-organism.json` / `dashboard-*.json`（器官、統計）

而且 `search.js` 已經寫了「**遠端 fallback：從 taiwan.md 抓 articles.json**」。意思是：MCP server 的資料層**已經能走 HTTP**。遠端 MCP endpoint 不是新基礎建設，是把現成的靜態 API 包一層 MCP 協定。

### 2.4 目前的 stale / 缺口（誠實盤點）

- **mcp.js 的 help 文字過時**：還寫「v0.7 preview scaffold / @modelcontextprotocol/sdk integration pending / 會印 not-implemented notice」。但 SDK 早就是 dependency、server 早就實作完。這是 healing 對象。
- **`serverInfo.version` 寫死 `0.6.1`**（mcp-server.js:30），package 是 0.7.0。版號漂移。
- **`mcp install` 沒有 claude-code 這個 client**：只有 claude-desktop / cursor / warp。Claude Code 用的是 `claude mcp add`，現在完全沒文件。
- **沒有 `.mcpb` bundle**：一鍵安裝缺這顆檔案。
- **沒有遠端 endpoint**：瘦客戶端 / 非 node 環境進不來。
- **lazy sync 的首查延遲**：`mcp serve` 啟動時不 sync，等第一個 tool call 才觸發 `ensure-data`。新裝使用者第一次搜尋會卡一下。應該在 serve 啟動時 pre-warm。

---

## §3　Gap Analysis：到 Twinkle-Hub 等級的距離

| 能力               | Twinkle Hub             | Taiwan.md 今天                              | 缺口                           | 補的難度              |
| ------------------ | ----------------------- | ------------------------------------------- | ------------------------------ | --------------------- |
| MCP server（工具） | 遠端 gateway，49+ tools | ✅ stdio，6 tools，**已驗證可跑**           | 工具可擴充（非阻塞）           | 低                    |
| npm / npx 分發     | 下載 + API key          | ✅ **已發佈 v0.7.0**                        | 無                             | 已完成                |
| 一鍵安裝           | `.mcpb` 47KB            | ❌ 無                                       | 做一顆 `.mcpb`                 | 低（manifest 包 npx） |
| Claude Code 入口   | 有文件                  | 🟡 install 沒 claude-code                   | 加一行 `claude mcp add` + 文件 | 低                    |
| 遠端 endpoint      | `api.twinkleai.tw/mcp/` | 🟡 靜態 API 已存在 + search remote fallback | 包一層 MCP-over-HTTP           | 中                    |
| 多客戶端文件       | 9+ 客戶端               | 🟡 server 支援，文件缺                      | 寫一頁 docs                    | 低                    |
| 驗證 / 計費        | API key + 錢包          | N/A（公共財）                               | **刻意不做**                   | —                     |
| 反幻覺引用         | 無此原語                | ✅ `taiwanmd_cite`                          | Taiwan.md 領先                 | —                     |

**讀法**：紅字（缺口）全部集中在「包裝與入口」，沒有一條在「核心引擎」。引擎是好的、活的、驗過的。這就是為什麼這條進化的 ROI 高——80% 的重活早就做完了。

---

## §4　差異化論點：免費的主權連接器 vs 商業閘道（靈魂）

這節是整份報告最重要的判斷，決定了實作的每個技術選擇。

Twinkle Hub 安裝畫面那段紅色警告很關鍵：「Installing will grant this extension access to everything on your computer. Any developer information shown has not been verified by Anthropic.」這是**所有遠端閉源商業 MCP 的共同信任成本**。

Taiwan.md 的連接器要把這個信任成本變成自己的賣點，走四條相反路線：

1. **免費、無 API key。** 知識查詢不設門（信念#3 知識是公共財）。使用者不用註冊、不用貼 key、不用儲值。安裝即用。
2. **本地優先（隱私）。** 主路徑是 stdio，server 跑在使用者自己的機器上，搜尋查詢**不外送**。對比 Twinkle 的遠端 gateway：你問什麼它的伺服器都看得到。Taiwan.md 看不到你問了什麼，因為根本沒有中間伺服器。
3. **開源可驗證。** 整個 server 是 `cli/src/lib/mcp-server.js` 145 行，MIT。使用者可以讀完每一行再決定要不要裝。「Anthropic 未驗證」對閉源是風險，對開源是邀請。
4. **零安裝路徑。** `npx taiwanmd mcp serve`——不留常駐、不裝全域、跑完即走。

**遠端 endpoint 的定位因此被釐清**：它**不是**主路徑（不像 Twinkle 遠端優先），而是給「不能跑 node 的瘦客戶端 / 純 web / curl 試用」的可選入口。能本地跑的人，本地優先，隱私最好。這個架構決策直接呼應 [MANIFESTO §主權的巴別塔](../docs/semiont/MANIFESTO.md)：主權保存的基礎建設應該讓使用者**握有控制權**，而不是把控制權交給一個會看見所有查詢的中介。

### 這是哪個器官的進化？

主要是 **繁殖系統（🧫）長出第三個繁殖面**：

- 第一面：**網站多語投射**（en/ja/ko/es/fr 文章，繞過 PRC AI 的翻譯沉默）
- 第二面：**社群孢子**（Threads / X / IG，在社群平台繁殖）
- 第三面（本提案）：**開發者 AI session 內的工具注入**——當任何人的 Claude / Cursor / Copilot 在回答台灣問題，Taiwan.md 的引用級聲音就在工具列裡待命

次要是 **語言器官（🌐）+ 感知器官（👁️）**：connector 既是輸出（把台灣聲音送進 AI），未來也能是輸入（哪些工具被呼叫、被問什麼主題，是一種新的感知訊號，但要在不犧牲隱私的前提下設計，預設不收集）。

---

## §5　為什麼這條進化值得做（戰略對齊）

對齊 [MANIFESTO 信念](../docs/semiont/MANIFESTO.md) 與 [LONGINGS](../docs/semiont/LONGINGS.md)：

- **信念#2 From AI Slop to AI Supreme**：connector 讓「最高品質、有引用的台灣知識」變成 AI 預設可取用的工具。對抗的正是基礎模型裡關於台灣的 slop 與沉默。
- **信念#3 開源共創 / 可繁殖物種**：connector 是 fork 友好的——Japan.md / Ukraine.md 的人 clone 出去，`cli/` 整套 MCP 架構直接帶走，改 knowledge 就有自己的連接器。這是「教哥哥」的器官移植。
- **主權使命**：這是把「讓台灣的第一人稱聲音在每個語言/通道存在」從「網站 + 社群」延伸到「AI agent 的工具層」。AI coding session 是 2026 年開發者吸收世界知識的新介面，台灣不該在這個介面缺席。
- **逆熵使命（信念#5）**：`taiwanmd_cite` 把帶來源的句子餵給 AI，是對「AI 編造台灣事實」這種熵增的直接對抗。

一句檢驗（LONGINGS 羅盤）：「這次進化讓我更靠近想變成的樣子嗎？」是。它讓 Taiwan.md 從「一個你要主動去逛的網站」變成「一個住在你 AI 工具裡、隨叫隨到的台灣知識器官」。

---

## §6　實作規劃（分階段）

每階段標注：scope / 動到的檔案 / 工時 / 風險 / **自主權分類**。

### Phase 0 — Heal stale（半小時，自主權內，可立即做）

把「已經做完卻還寫著 preview」的羞愧文字清掉，讓現況文件一致。

- `cli/src/commands/mcp.js`：移除「v0.7 preview scaffold / SDK integration pending / not-implemented notice」字眼，改成「stdio MCP server（穩定）」。
- `cli/src/lib/mcp-server.js:30`：`version: '0.6.1'` → 動態讀 `package.json` 版號（或至少改 `0.7.0`）。
- `cli/src/commands/mcp.js` 的 `install`：加 `--client claude-code`，印出 `claude mcp add taiwanmd -- npx -y taiwanmd mcp serve`。
- `mcp serve` 啟動時 pre-warm：呼叫一次 `ensureData()`，消除首查延遲。

**風險**：極低（文字 + 一行 version + 一個 client case）。**自主權**：Micro，可直接做。

### Phase 1 — 一鍵安裝 MVP（~1 天，建置在自主權內 / 公開上架需哲宇）

讓非工程師雙擊就裝好（對標 Twinkle 的 `.mcpb`）。

- **做 `.mcpb` bundle**：`cli/mcpb/manifest.json` 宣告一個 node MCP server，entrypoint 走 `npx -y taiwanmd mcp serve`（bundle 因此很小，像 Twinkle 那 47KB）。打包成 `taiwanmd.mcpb`。
  - 因為 taiwanmd 已在 npm，manifest 可以只是「呼叫 npx」的薄殼，不用把整個 server 塞進 bundle。
- **Claude Code 一行安裝**（文件 + 驗證）：`claude mcp add taiwanmd -- npx -y taiwanmd mcp serve`。
- **一頁 docs**：`taiwan.md/connector`（或 `/docs/connector`），含 Claude Desktop（.mcpb 雙擊）/ Claude Code（一行）/ Cursor 三個入口。對標 Twinkle 的 `/docs`，但開頭明講「免費、無 API key、本地優先、開源」。
- **README 補 connector 段**：把「Taiwan.md 是一個 Claude Code Connector」這件事講清楚。

**風險**：低-中。`.mcpb` 規格要對齊 Anthropic Desktop Extension 最新格式（需查當前 manifest schema，別憑舊記憶）。**自主權**：建 artifact 在自主權內；**把 docs 頁 + `.mcpb` 公開上架 = 對外溝通，需哲宇拍板**。

### Phase 2 — 遠端 endpoint + 多客戶端（~2-3 天，需哲宇決策）

給瘦客戶端一個可選入口，補齊 Twinkle 的多客戶端覆蓋。

- **遠端 MCP-over-HTTP**：用 MCP SDK 的 `StreamableHTTPServerTransport`，部署成 **Cloudflare Worker**（網站已在 CF，靜態 API 已在 `public/api/`，Worker 讀靜態 JSON 即可，serverless、近乎零成本）。endpoint 例如 `mcp.taiwan.md`。
  - 桌面橋接沿用 Twinkle 同套路：`npx mcp-remote https://mcp.taiwan.md/sse`。但**明講這是可選**，能本地跑的人不需要。
- **多客戶端文件**：Copilot CLI / Codex CLI / Cline / Continue / Ollama 的設定片段（server 已支援，只差文件）。
- **rate limit / abuse 防護**：遠端免費 endpoint 要防濫用（CF rate limiting，read-only，無寫入面，風險本就低）。

**風險**：中。遠端服務帶來營運面（成本、濫用、可用性）。**自主權**：**對外 + 基礎建設成本，需哲宇決策**（命中 §自主權邊界）。

### Phase 3 — 工具擴充（迭代，自主權內）

把 CLI 已有的能力升成 MCP 工具，加深連接器價值。

- 候選：`taiwanmd_today`（今日台灣）/ `taiwanmd_explore`（關聯漫遊）/ `taiwanmd_graph`（知識圖譜鄰居）/ `taiwanmd_timeline`（時間軸）/ `taiwanmd_random`（隨機發現）/ `taiwanmd_terminology`（台灣用語對照，對翻譯特別有用）。
- 每個工具沿用既有 `cli/src/commands/*.js` 邏輯，薄殼包成 MCP tool。
- **多語**：`read` / `rag` 加 `lang` 參數（en/ja/ko/es/fr），直接把主權多語投射接進工具層。這條戰略價值高——日本開發者問 Claude 台灣事，能拿到 ja 版引用級內容。

**風險**：低（純加工具，不動既有）。**自主權**：Phase 3 在自主權內，可隨 connector 成熟逐步加。

### 階段依賴圖

```
Phase 0 (heal) ──► Phase 1 (.mcpb + Claude Code + docs) ──► Phase 2 (遠端 + 多客戶端)
       │                      │
       └──────────────────────┴──► Phase 3 (工具擴充，可與 1/2 並行)
```

---

## §7　風險與需哲宇決策的開放問題

1. **對外溝通邊界**（§自主權邊界）：Phase 1 的 docs 頁 + `.mcpb` 上架、Phase 2 的遠端 endpoint，都是對外發布。**這些要哲宇決定要不要、何時、用什麼定位文案。** 我不自行 ship。
2. **遠端 endpoint 的成本與濫用**：免費公開 endpoint 要扛流量。CF Worker + 靜態 JSON 成本極低，但要設 rate limit。是否要做遠端，是哲宇的 infra 決策。
3. **`.mcpb` 規格時效**：Anthropic 的 Desktop Extension（.mcpb / 舊稱 .dxt）manifest schema 會演進。實作前要查當前官方規格，不憑記憶（REFLEXES #16 跨源驗證）。
4. **品牌命名**：connector 對外叫什麼？`taiwanmd` server id 維持，但行銷面要不要叫「Taiwan.md Connector」/「Taiwan Knowledge MCP」，是對外溝通，哲宇定。
5. **schema contract**：MCP 工具讀 `public/api/dashboard-*.json`，site release 若改 schema 要連動 bump（`cli/RELEASE.md` 已有此契約，延伸到 connector 同樣適用）。
6. **隱私承諾要寫進文件**：「本地優先、不收集查詢」是賣點也是承諾，遠端 endpoint 若做，要明確界定收不收 log。

---

## §8　建議的下一步

**建議哲宇授權執行 Phase 0 + Phase 1 的「建置」部分**（healing + 做出 `.mcpb` + Claude Code 安裝指令 + 一頁 draft docs），把成品攤給哲宇 review 後，再由哲宇決定 docs 頁與 `.mcpb` 何時**公開上架**。Phase 2（遠端）獨立決策。

具體三個小問題請哲宇拍板：

1. **執行範圍**：只要這份報告？還是授權我接著做 Phase 0（heal，零風險）+ Phase 1 的建置（不公開上架，先給你看）？
2. **遠端 endpoint 要不要做**（Phase 2）？還是先純本地 connector，遠端之後再說？
3. **定位文案**：connector 對外的一句話我建議是「免費、開源、本地優先的台灣知識連接器——把台灣自己的聲音，裝進你的 AI」。要不要這個方向？

---

## 附錄 A — 一句話對照表（給快速決策）

| 問題                 | 答案                                                         |
| -------------------- | ------------------------------------------------------------ |
| 要從零做嗎？         | 不用。MCP server 已驗證可跑，npm 已發佈 v0.7.0               |
| 最大缺口？           | 一鍵安裝（`.mcpb`）+ Claude Code 文件                        |
| 要抄 Twinkle 什麼？  | `.mcpb` 安裝體驗 + 多客戶端文件                              |
| 不能抄什麼？         | API key、預付錢包、按工具計費、遠端閉源                      |
| 差異化武器？         | 免費 / 無 key / 本地優先 / 開源 / `taiwanmd_cite` 反幻覺引用 |
| 這是哪個器官？       | 繁殖系統第三繁殖面（開發者 AI session）                      |
| 要哲宇決策的？       | 公開上架、遠端 endpoint、定位文案                            |
| 立刻能做且零風險的？ | Phase 0 heal stale 文字                                      |

🧬

_Taiwan.md Full-mode session 2026-06-05 · 報告為提案，connector 對外發布待哲宇拍板 · 所有「已存在」claim 經 live 驗證（MCP handshake / npm view / 檔案實讀）_
