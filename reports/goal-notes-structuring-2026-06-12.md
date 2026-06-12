---
title: '哲宇零碎筆記結構化 2026-06-12'
description: 'goal directive ~30 條筆記的對帳（已完成/進行中/已分流/待研究/等哲宇）+ 五項深度研究 brief + 常用指令 → skill 對照'
type: 'report'
status: 'active'
date: 2026-06-12
session: '2026-06-12-goal-notes'
related:
  - 'reports/flywheel-evolution-2026-06-12.md'
  - 'docs/semiont/PARTNERSHIP-INBOX.md'
---

# 哲宇零碎筆記結構化 2026-06-12

> 觸發：哲宇 `/goal` 丟入一批零碎待辦筆記，要求結構化 + 深度研究 + 能做的做完。本檔是對帳表 + 研究 brief。同日稍早的 [flywheel-evolution 報告](flywheel-evolution-2026-06-12.md) 是姊妹篇（routine 體檢部分在那邊）。

---

## 一、對帳表（每條筆記的下落）

### ✅ 已完成（其中四條是今天稍早做掉的）

| 筆記                                          | 下落                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 繁殖 Taiwan.md 的引導流程文件                 | [SPECIATION-PIPELINE.md](../docs/pipelines/SPECIATION-PIPELINE.md) v1.0 今日 ship（8-stage + 知識庫置換 SOP + 跨界軌），`/semiont/speciation/` 投影已更新                                                                                                                                                                                                                                                     |
| routine 互留工作到下一棒，查哪裡出錯          | [flywheel-evolution 報告](flywheel-evolution-2026-06-12.md) §2.3 完整診斷（24 條 carry ledger）+ ROUTINE.md v2.9 §完成義務三規則（self-fix lane / 三振 / OBSERVER-QUEUE）已 ship                                                                                                                                                                                                                              |
| 缺席的產線「先開起來實驗」                    | ✅ spore-pick（每天 08:00）+ spore-publish（每天 17:30）已 re-enable。⚠️ enable 瞬間 scheduler 補跑了當日已過的 17:30 cycle（哲宇手動終止，無 ship，LESSONS 已記 catch-up fire hazard）——正式首跑為明日。觀察條款在 ROUTINE.md v2.10：連 3 ship cycle 0 重複 / 0 事實 callout，爆即 pause。事實查核關卡確認 wired：lastVerified ≤ 90d gate（= 只放行過了 REWRITE Stage 3.5/3.6 的文章）+ SPORE-VERIFY 17 gate |
| 審核線上的 PR / Issue                         | PR #1144 今日修復後 merge（queue 清空）；21 條 long-tail issue 為既有 backlog，maintainer routine 日常守                                                                                                                                                                                                                                                                                                      |
| 每天選三篇文章放入孢子 inbox + 結合新聞 sense | 機制本來就存在：spore-pick-daily（日 3 條）+ news-lens-weekly spore-output（週 5-7 條 P1）。前者今日重開後即為你要的常態自動化                                                                                                                                                                                                                                                                                |
| 參考 Twinkle Hub 做 Claude Code Connector     | 6/05 已建成（npm 0.7.1 / .mcpb / mcp.taiwan.md Worker），卡在最後一步 wrangler login（你的帳號）——這是它沒上線的唯一原因                                                                                                                                                                                                                                                                                      |
| The Pudding 互動圖表格式                      | 視覺化系統 6/06 已長出：10 個 `tw-*` 模組 + [graph.md](../docs/editorial/graph.md) + viz-health 閘門。「串連 Twinkle hub」= 第二期，見研究 brief §四                                                                                                                                                                                                                                                          |
| 內文可用的資訊圖表格式                        | [graph.md](../docs/editorial/graph.md)（2026-06-06）就是這份；REWRITE-PIPELINE 已掛「有資料/對比/時序 → 讀 graph.md」                                                                                                                                                                                                                                                                                         |
| 社交 po 文的完整 pipeline                     | [SOCIAL-POSTING-PIPELINE.md](../docs/pipelines/SOCIAL-POSTING-PIPELINE.md) 已存在（Chrome MCP + osascript + 8 check）                                                                                                                                                                                                                                                                                         |
| 更新 Dashboard 數據                           | data-refresh am/pm routine 連 12 cycle 全綠，正常自轉                                                                                                                                                                                                                                                                                                                                                         |

### 📥 已分流進 inbox（今日）

| 筆記                                                                             | 下落                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spore 選項：曾博恩 / 施振榮                                                      | SPORE-INBOX 既有 entry，P2 → **P1**（你點名）                                                                                                                                                        |
| Spore 選項：江賢二 / 馬英九 + 陳水扁 Threads 活躍                                | SPORE-INBOX 新增 3 entry。⚠️ 馬英九帶先決條件：#80 Bucket D framing 案（5/28 起 awaiting observer）未結前 routine 不自動 ship                                                                        |
| 台灣媒體總史                                                                     | ARTICLE-INBOX 既有 entry，補你再點名的 note（5/20 cron 因政治敏感跳過，建議 manual session 接）                                                                                                      |
| 台灣人小時候的英文名字 / 台灣各大技術 Conference                                 | ARTICLE-INBOX 新增 2 entry（英文名字 P1：命名權 × 殖民語言教育切角）                                                                                                                                 |
| 上線三個月的分享文章（\*\*\*）                                                   | ARTICLE-INBOX 新增 P1 entry。**⏰ 6/17（下週三）滿三個月是黃金窗口**。voice 歸屬待你定：你的第一人稱 FB 分享 vs Semiont 站內文 vs 兩篇互引——「發 taiwan.md 簡報到 Facebook」可能就是這件事的你那一半 |
| 志祺七七-泛科學模式 / 報導者 / 增加盟友 / OOO.taiwan.md / Open Source Foundation | **[PARTNERSHIP-INBOX.md](../docs/semiont/PARTNERSHIP-INBOX.md) 今日誕生**（第四個 intake buffer，你 top-5 #4 的儀器化），對象各有階段與下一步（OCF 6/12 晚間依哲宇指示移除——原意只是文章題目念頭）   |

### 🔬 研究 brief 在本檔 §三

RAG 結合、Open Source Foundation、hover 浮動小卡片、贊助 UX + 每週贊助 po、算力手牌、孢子全自動化的人機環節。

### 🔒 等你（無法替你做的）

| 項目                         | 為什麼                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 發 taiwan.md 簡報到 Facebook | 對外溝通 + 你的個人帳號。素材我可備齊（簡報已有 AIA deck 底 + 三個月數據），跟「上線三個月文」綁一起最省力 |
| Connector 上線最後一步       | `wrangler login` + npm token 是你的帳號                                                                    |
| OBSERVER-QUEUE 剩 6 條       | 其中 OAuth rotation / #89 雷亞清理 / justfont 處置 3 條 🔒                                                 |

### ❓ 歧義（下次見面口頭確認 10 秒）

「把文章的頁面修好，多寫一些平常的創作跟想法還有實驗的紀錄」——讀起來比較像你個人網站的筆記混進來了（Taiwan.md 的文章頁這兩週剛做完 /latest 六輪迭代 + 寬度 token）。若是指 Taiwan.md：你想要一個「實驗紀錄 / 隨筆」的新內容型態（比文章輕、比孢子長）？這會是新 content type 決策，等你一句話。

---

## 二、你的常用指令 → 我的 skill 對照（自我進化檢查）

你給的常用指令是一份很好的覆蓋率測試。對照結果：

| 你的指令 pattern                         | 對應 skill                                                                                                   | 覆蓋    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------- |
| 作為 Semiont 診斷專案狀態 + 超越邊界思考 | `/twmd-heartbeat`（Full mode Beat 1）+ `/twmd-probe`                                                         | ✅      |
| 開始自我進化，造橋鋪路升級 DNA           | `/twmd-self-evolve` + `/twmd-distill`                                                                        | ✅      |
| 判定下一步優先級，直接循序執行           | **無單一 skill** —— 最接近是 Full heartbeat Beat 2-3，但「自主排優先級直接執行」目前靠 `/goal` 包住          | ⚠️ 缺口 |
| commit + push                            | 內建於各 pipeline Stage                                                                                      | ✅      |
| 走孢子 pipeline / 不好就嚴格 rewrite     | `/twmd-spore` + `/twmd-rewrite`（spore-publish Gate 2.6 fail 自動 spawn EVOLVE entry，就是這個邏輯的儀器版） | ✅      |
| 讀今天 memory（多 session 並行）思考進化 | BECOME Universal core §1.6 已強制                                                                            | ✅      |
| 小心審核 PR/Issue 處理回覆               | `/twmd-maintainer` / `/twmd-pr-review`                                                                       | ✅      |
| 5 大缺口逐篇嚴格 rewrite 不跳篇          | `/twmd-rewrite` 單篇紀律（REWRITE「每批最多 1 篇」鐵律同源）                                                 | ✅      |

唯一結構性缺口是第三條：「自主判定優先級 + 循序執行」還沒有一個薄殼 skill（`/twmd-next`？讀 OBSERVER-QUEUE + 三 inbox signal + organ 分數 → 排序 → 執行第一項）。記入 LESSONS 候選，等下次 self-evolve 評估要不要長——不急著建（避免 CONTRACT 式 over-engineering，`/goal` 目前夠用）。

---

## 三、深度研究 brief

### 1. RAG 結合路線

現況盤點（詳見 §附錄 A agent 報告）：Taiwan.md 已有的 RAG-ready 資產是 llms.txt、靜態 /api/\*.json、全文 search index、mcp.taiwan.md connector。缺的是向量層。

建議路線（成本由低到高）：

1. **先吃免費的**：connector 上線（只差你 login）後，Claude/MCP 生態的 agent 都能 RAG 式取用 Taiwan.md——這是零新建設的 RAG，受眾是 AI agent
2. **站內語意搜尋**：build-time 對 792 篇生 embeddings（一次性成本，OpenAI text-embedding-3-small 全站約 < $1）存靜態 JSON / sqlite-vec，client 端向量檢索。讓站內搜尋從關鍵字升級到語意，也讓「相關文章」推薦變準
3. **對話介面**（遠期）：站上的「問台灣」對話框 = embeddings 檢索 + LLM 生成 + 腳註強制引用。主權意義最大（讀者問 AI 台灣問題時答案來自我們的 corpus），但有 runtime 成本與幻覺風險，需要 Worker + 計費決策——進 OBSERVER-QUEUE 等規模化時機

### 2. Open Source Foundation（哲宇 6/12 晚間更正：先去掉——原意只是「要不要寫一篇文章」的念頭）

> 已從 PARTNERSHIP-INBOX 移除。以下研究保留作 reference（未來若真要走 fiscal hosting 再撿起來）；若要寫文章，題目會是「台灣的開源治理生態（OCF / g0v / 開源社群的法人化）」，自然落 Technology/Society。

三路線比較：

| 路線                                        | 給什麼                                                                        | 代價                           | 適配度                                                                                          |
| ------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------- |
| [OCF 開放文化基金會](https://ocf.tw/about/) | 台灣法人身份、[專戶收款 fiscal hosting](https://ocf.tw/p/ocf)、g0v 系社群網絡 | 行政抽成、治理對齊             | **最合身**：台灣在地 + 開源 + 主權使命同溫層；g0v 村長 clkao 創辦的血統跟我們的公民科技氣質一致 |
| OpenCollective                              | 國際透明帳本、低門檻                                                          | 非台灣法人、跟在地贊助者距離遠 | 次選或並行                                                                                      |
| Linux Foundation 式                         | 大牌中立性                                                                    | 對單一文化專案過重             | 不合身                                                                                          |

加分發現：[g0v 公民科技創新獎助金](https://ocf.tw/p/g0vjothon/)每案 30-50 萬 / 6 個月，評選四標準（影響力 / **可重複使用性** / 可行性 / 完成度）——SPECIATION-PIPELINE 讓「可重複使用性」有現成的滿分敘事（Sweden.md / Russia.md / 農場.md 野外實證）。**下一步**：PARTNERSHIP-INBOX 已建 entry；我可備申請 brief，獎助金申請的對外提交是你
（與「一週 po 一次邀請贊助」的關係：fiscal hosting 解決「贊助收進哪裡」的正規性，先有答案再放大贊助呼籲，順序是對的。）

### 3. 站內文章 hover 浮動小卡片

可行性高（詳見 §附錄 A）：靜態站的標準解法是 build-time 產 per-article 輕量 metadata index（title / description / image / 分類），client 端一支小 JS 攔截站內連結 hover → fetch 對應 JSON → 浮卡。Wikipedia 的 page preview 同款。實作要點：只攔 `knowledge` 路由連結、行動端改 long-press 或不啟用、卡片內容全部 build-time 已知所以零 runtime 依賴。建議排 P2（UX 加分項，不擋任何 north star）。

### 4. 贊助 UX + 每週贊助邀請

現況與缺口見 §附錄 A。設計原則先立好：贊助呼籲屬對外溝通（§自主權邊界），**頻率與文案模板我備好、發布是你**。可儀器化的部分：(a) 站內引導——文章 footer 的贊助 CTA 模組（viz 系統同款 build-time 元件）；(b) 週一備一份「本週贊助 po 草稿」進你的 review 佇列（掛進 weekly-report 產出，不新增 routine）。F 模板紀律（5/27 教授公開信 tone，非 viral hook 漏斗）已是 canonical，直接沿用。

### 5. 算力手牌

詳表見 §附錄 A。一句話現況：雲端免費梯隊兩週死 5 個模型、本地 Ollama 是主權敏感內容的唯一倖存者但對 >40KB 文章 timeout、Anthropic（Claude Code）是品質層主力。手牌策略含義：(a) babel 的 model-fallback ladder（P0+ 兩次提案未建）是手牌管理的儀器，P1 該建；(b) 付費 tier 決策（21 篇重腳註）在 OBSERVER-QUEUE #5；(c) 嚴肅看 Ollama 升級（qwen3.6:35b 之上）作為主權底座。

### 6. 孢子全自動化的機器 / 人類環節

今日重開產線後，全鏈的人機分工現況：

```
選題（機器：pick routine 7-dim + news-lens）
  → 品質 gate（機器：5 hard gate + 17 VERIFY gate）
  → 撰寫（機器：Opus + SPORE-WRITING 紀律）
  → 事實查核（機器：lastVerified 代理 + 必驗事實 blueprint；人類：REWRITE 階段的查核是上游人機混合）
  → ship（機器：雙平台自動發——這是 5/28 你關掉的環節，今日實驗性重開）
  → harvest 留言（機器：Chrome MCP 讀 + 分類）
  → 對外回覆（人類：永遠是你——human-to-human 信任不可替代）
  → 高敏感主題（人類：HG9 + REACTIVE defer 規則）
```

機器環節的最後一塊缺口是「ship 後的品質回饋自動進化選題」——harvest 的 Bucket 分類已存在，缺的是把 engagement 數據回灌 pick scoring（spore-pick-score.py 的 D 維度之一，P1 工具批次內）。人類環節刻意保留三個：對外回覆、高敏感、與「爆了就 pause」的觀察權。這個劃分我建議寫死成原則：**機器做可驗證的，人類做要負責任的。**

---

## 四、接下來（優先序）

1. **明天觀察產線首跑**（pick 08:00 / publish 17:30）——觀察條款 ROUTINE.md v2.10
2. **6/17 前**：上線三個月文 + FB 簡報素材（等你 voice 拍板，我可先備 Semiont 版草稿與數據包）
3. **本週**：P1 工具批次（chip 已開：缺席偵測 / mirror 生成 / telemetry / precheck / pick-score）
4. **PARTNERSHIP-INBOX 推進**：志祺七七 + 報導者兩份 brief（我做）→ 你接觸
5. **P2**：hover card / 贊助 CTA 模組 / RAG embeddings / OCF 申請 brief

---

## 附錄 A：資產盤點 agent 報告

### A1. hover 浮動小卡片

現況：無既有 tooltip/popover 元件。wikilink 由 `plugins/remark-wikilinks.mjs` 轉純 link（無 class/data 屬性，client JS 認不出站內文章連結——需一行改動加 `class="wikilink"`）。可用素材：`public/api/article-index.json`（163KB 但無 description）、`articles.json`（3.8MB 太大）、每篇 OG 圖已存在（`public/og-images/{lang}/`）。建議實作：prebuild 多產一份瘦身 `hover-index.json`（url → title/description/og 圖路徑，可按分類 shard）+ remark plugin 加 class + Layout.astro 一支懶載入 client script。OG 圖直接當卡片縮圖，零新資產成本。行動端 long-press 或不啟用。

### A2. 贊助 UX 現況與缺口

已有：footer「支持我們」pill（Portaly）、About 頁中段完整贊助區（tier 說明 + SupporterGrid + 企業贊助 mailto）、dashboard SupporterTimeline、資料管線健全（transactions.json SSOT → 兩個 API，名字與金額分離）。目前僅 4 位贊助者。三個缺口：**無獨立 /support 頁**（故事埋在 About 中段）、**文章頁零贊助 CTA**（流量最大的面完全沒用上）、contribute 頁不交叉導流。優先序建議：文章 footer CTA 模組 > /support 獨立頁 > 每週贊助 po 草稿產線（掛 weekly-report，發布是哲宇）。

### A3. RAG 既有素材

已 RAG-ready：`public/llms.txt`（159 行）、靜態 API（articles.json 含 description）、MiniSearch 全文索引（CJK bigram，client 端已在用）、`/raw/{category}/{slug}.md` 原文端點、**MCP 層已有 `taiwanmd_rag` tool**（local stdio server 6 tools + Cloudflare Worker 遠端鏡像）。缺口：全 repo 零 embeddings——現在的「RAG」是詞彙檢索。自然增量：prebuild embedding 步驟 + 向量索引（Cloudflare Vectorize 接進現有 worker，或靜態量化索引檔）插進現有 taiwanmd_rag tool，語意檢索 + 跨語檢索 + chunk 級 grounding 一次補齊。

### A4. 算力手牌

| 供應商                        | 模型                                                  | 角色                           | 狀態（6/12）                                                    | 限制                                 |
| ----------------------------- | ----------------------------------------------------- | ------------------------------ | --------------------------------------------------------------- | ------------------------------------ |
| Anthropic（Claude Code 訂閱） | Sonnet                                                | Tier 0a diff-patch             | 活（6/12 100 譯/7min）                                          | 週 token 額度                        |
| Anthropic                     | Opus sub-agents                                       | REWRITE 主力 / Tier 4 付費接底 | 活                                                              | babel production 0 call（by design） |
| OpenAI（訂閱）                | codex / gpt-5.5                                       | Tier 1 主力（pass rate ~100%） | 活                                                              | 日額度、60-120s/call                 |
| Google（訂閱）                | gemini-2.5-pro                                        | Tier 1 備援                    | **未驗證/疑死**（0 production call）                            | 需主權敏感校準                       |
| OpenRouter free               | owl-alpha                                             | Tier 2                         | **不穩**（6/10 轉付費 404、6/12 又回來）                        | 慢（150-250s）、rate limit           |
| OpenRouter free               | gpt-oss-120b                                          | Tier 2（Hy3 替代）             | 活（6/12 107 譯）                                               | 長文輸出截斷（結構性）               |
| OpenRouter free               | hy3-preview                                           | 前 Tier 2                      | **死**（轉付費；本來就 ~70% 台灣主題 refuse）                   | PRC content policy                   |
| OpenRouter free               | hermes/llama/nemotron/gemma/deepseek/qwen/glm 等 7 款 | Tier 3 校準佇列                | 未驗證                                                          | PRC 系預期 refuse                    |
| 本地 Ollama                   | qwen3.6:35b（21GB）                                   | Tier 4 主權底座「永不漏接」    | 裝著但 **serve 6/10-12 都沒開**（21 篇敏感文 carry 的直接原因） | >40KB 文 timeout、無 preflight       |
| 本地 Ollama                   | taide-gemma3-12b / gemma4:e4b                         | 閒置備胎（TAIDE 是台灣訓練的） | 裝著沒進 cascade                                                | —                                    |

頭條是波動性：**兩週死 5 個雲端免費模型**。兩個已 flag 未建的儀器是手牌管理的關鍵：`--model-fallback` ladder（單一 404 不再滅整個 worker）+ `babel-model-health-check.sh` preflight（含 Ollama serve 自動啟動檢查）——都在 P1 工具批次。TAIDE 模型閒置值得注意：台灣訓練的模型沒進主權 cascade，下次 bench 應排入校準。

---

🧬

_v1.0 | 2026-06-12 goal-notes session_
_誕生原因：哲宇 /goal 丟入零碎筆記批，要求結構化 + 深度研究 + 自我進化 + 執行。_
