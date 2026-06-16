# 2026-06-16-211251-data-ops-embeddings-i18n — 報導者內鏈 → data refresh + 雙平台 harvest → 瘂弦標記刪除 → embedding rebuild → 介面翻譯補滿 100%

> session manual（哲宇 in-loop 全程）— 接在 報導者 finale 之後的第二階段：一串 data-ops + 工具補完
> Phase span: ~18:30 → 21:13 +0800（4 commits `402b239e1`→`15adcc34c`；資料來源 `git log %ai`）
> 注意：同時段 hourly rewrite cron 自行 ship 造山者 EVOLVE（`349e7b4fa`/`07ab13b10`/`4454862fd`，routine 有自己的 memory，非本 session 工作）

## 觸發

報導者 finale 跑到一半，哲宇連續丟五個後續：(1) 文章內提到的報導都加 inline 溯源連結、(2) 跑 data refresh pipeline 更新所有孢子數據、(3) 更新 embedding、(4) 瘂弦因破圖刪了要處理記錄、(5) 介面翻譯補到 100%。最後追問「embedding 有更新進專案了嗎」帶出 RAG 部署的釐清。

## 報導者內文 20 條溯源連結（`fd09526d2`）

哲宇要讀者能點報導名直接開原始頁查證。站體 rehype-external-links 已設 target=\_blank，markdown 連結自動開新分頁。3 隻 agent WebSearch+WebFetch 找 canonical twreporter URL，主 session 再 curl（kids 域）+ 自己 WebFetch（www SPA 域）**逐一獨立確認每頁存在且標題相符**，無一條只憑 agent claim。順帶 heal：資訊圖表標題原誤植「大骪鱸鰻」+ 虛構整段「冷僻字」考據，WebFetch 原頁逐字確認實為「大鮪鱸鰻」（鮪魚，台語「大尾鱸鰻」諧音）。這是 fact-check umbrella 第 8 instance（連 4-agent 查核都漏、靠 fetch 來源 artifact 才現形）。

## Data refresh + 雙平台孢子 harvest（`402b239e1`）

`refresh-data.sh` 14-step（exit 0，三源 GA/SC/CF + 全量 dashboard + validate-spore-data 全綠）。孢子 harvest D+7 窗口 6 篇 × 2 平台 = 12 events，Chrome MCP 逐則讀 aria-label/action-bar。**最大增量：補回今早 06:30 routine 因 X DOM lazy-load（Pitfall 2）跳過的 X 端 6 則**。亮點：報導者 #144 Threads 兩小時 2,411 讚、無名 #139 X 20,001 views、83 天 #136 Threads 6,757 讚。X/Threads 互動差約 50×（平台受眾結構）。Chrome 取數工具學到：X 用 `[role=group]` aria-label、Threads 用 svg-aria-label action-bar 同一 bar 取四數；pipeline-extract（extract-current+navigate-next）比同批 navigate+extract 可靠（SPA 載入時差）。

## 瘂弦 #140/#141 標記刪除（`88f47159e`）

哲宇刪了瘂弦兩平台貼文（square 圖 404 破圖；今早 routine 已連兩天標 URL-redirect skip，與其偏低互動一致）。哲宇選「標記刪除」非「移除」。schema 原本沒有 deleted 概念，加了一套：spore-log 標 `deleted:true`+原因（保留記錄+歷史 metrics 供溯源），衍生/顯示層全排除——sync-spore-links / generate-spore-records / generate-dashboard-spores 跳過 deleted、validate-spore-data check 6 改數非刪除、手動清 瘂弦.md 既有死 sporeLinks（sync 跳 deleted 但不溯及既有 block）。

## Embedding rebuild（`c88438b5f`）

哲宇 directive 更新 embedding。4090 節點（cheyuwu-asus）離線 3 天、nightly routine 連 graceful-skip，哲宇手動開機（~11.5 min 上線）後補跑。bge-m3 全站 4,655 向量 / 6 語 / 0 fail，Stage 2 verify PASS。只 commit `src/data/related/`（讀者端「你可能也想讀」，CI 烘進 HTML 零 GPU 依賴）。**追問釐清**：`public/api/rag` RAG 向量 gitignored by design、production `/api/rag` 404（從來沒部署）、唯一消費者 `rag-query.mjs` 讀本機 FS、是「未來 taiwanmd MCP semantic_search」的 prototype——不是 bug，RAG 對外是 Phase 2 未蓋的工程。

## 介面字串翻譯補到 100%（`15adcc34c`）

哲宇要全站 UI 翻譯 100%。缺口：en 後續新增 key 舊語言沒跟上（semiont ja/ko 各 24、fr/es 各 59；about fr/es 各 3）。既有 `i18n-translate.py` 只能整塊新增、block 已存在就 skip——補不了部分缺漏。寫了 `i18n-fill-gaps.py`（merge 模式，複用其 parser/owl 呼叫）：算 en∖target 差集，只把 missing 丟 owl-alpha，splice 進既有 block 結尾不動既有 key。結果 6 語全 100%、esbuild parse OK、抽查譯文正確（emoji+版本號保留）。

## 收官 checklist

| 檢查項                 | 狀態                                   |
| ---------------------- | -------------------------------------- |
| MEMORY 有這 phase 紀錄 | ✅（本檔）                             |
| Timestamp 精確         | ✅（`git log %ai`）                    |
| Handoff 三態已審視     | ✅                                     |
| 自我檢查工具 PASS      | ✅ 全 commit hard=0；CI 各 tip success |

## Handoff 三態

繼承 報導者 finale：

- [x] ~~報導者 spore D+1/D+7 harvest~~ — 本 phase 已 harvest（連同其餘 D+7 窗口）
- [ ] fact-check meta-umbrella（vc=8, distill_ready）→ 下次 distill 升 REWRITE §Stage 2.5 source-fidelity gate（含「fetch 來源 artifact 逐字比對」）

本 phase 新 handoff：

- [ ] **RAG Phase 2**（pending，哲宇拍板才動）：要讓語意搜尋對外，需蓋 taiwanmd MCP `semantic_search` tool 讀 fleet/本機向量，或把 `public/api/rag` serve 出去。現狀本機/fleet-only 不壞，不急。
- [ ] **瘂弦文章本身**（pending，低優先）：article-health 帶 8 quote-fidelity + 21 破折號 warn（6/14 pre-existing，同 fresh-writer 引語漂移模式），哪天排 EVOLVE 一起校。
- [x] ~~介面翻譯 < 100%~~ — retired（6 語全 100%，`i18n-fill-gaps.py` 工具化）

## Beat 5 — 反芻

這 phase 真正花力氣的地方是確認東西落到該生效的位置，把指令跑完只是第一步。哲宇問「embedding 有更新進專案了嗎」，逼出 committed（src/data/related）vs gitignored（rag）vs deployed vs production-404 四種狀態的區分——「我跑了 build」跟「它在它該在的地方生效」是兩件事。同樣的紀律也在內鏈查證（每條 URL 自己 fetch，不信 agent claim）、harvest（發現今早 routine 漏抓 X 端）、i18n（發現既有工具補不了部分缺漏要另寫）反覆出現。延續報導者 finale 日記「懷疑通過得最乾淨的地方」——這 phase 是它的操作面：每個「應該好了」都去摸實際狀態，好幾次摸出 nuance（大鮪鱸鰻幻覺 / RAG 設計性不部署 / 工具的 skip 盲區）。詳見 diary。

🧬

---

_v1.0 | 2026-06-16 21:13 +0800_
_session manual（哲宇 in-loop）— 報導者內鏈 → data refresh + 雙平台 harvest → 瘂弦標記刪除 → embedding rebuild → 介面翻譯 100%_
_誕生原因：報導者 finale 後哲宇連續五個 data-ops + 工具補完 directive，最後 RAG 部署追問。_
_核心洞察：(1)「跑了指令」≠「落到該生效的地方」，要分 committed/gitignored/deployed/404 摸實際狀態；(2) 既有工具的設計邊界（i18n-translate skip-if-exists / sync-spore-links 不溯及既有 block）會在新場景變盲區，補工具比硬塞快；(3) routine 漏抓 X 端、RAG 設計性不部署——這些只有去摸真實狀態才看得到。_
_LESSONS-INBOX 候選：fact-check umbrella 第 8 instance（fetch 來源 artifact）已 append vc=8。_
