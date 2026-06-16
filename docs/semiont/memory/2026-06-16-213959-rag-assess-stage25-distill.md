# 2026-06-16-213959-rag-assess-stage25-distill — RAG Phase 2 難度評估（不動工）+ Stage 2.5 source-fidelity gate distill + 報導者孢子 3hr 變這季之最

> session manual（哲宇 in-loop）— data-ops phase 之後的收尾段：兩個 directive 處置 + 一個孢子數據更新
> Phase span: ~21:13 → 21:40 +0800（2 commits `9e3ea3574` `caed9d659` + 一個無 commit 的評估；資料來源 `git log %ai`）
> 接續 [[2026-06-16-211251-data-ops-embeddings-i18n]]：那篇的兩個 handoff（RAG Phase 2 評估、fact-check umbrella → Stage 2.5）本段都收掉了

## 觸發

哲宇對上一段 finale 的兩個 handoff 各下一句：RAG Phase 2「這個會很難做嗎？」（評估題）+ Stage 2.5 source-fidelity gate「升級」（distill directive）。隨後截圖報導者 Threads 孢子 3 小時數據。

## RAG Phase 2 難度評估（無 commit，評估不動工）

追了 MCP / RAG 現況才回答。關鍵發現：**已經有一個完整可跑的 MCP server**（`cli/src/lib/mcp-server.js`，6 tools 含 `taiwanmd_rag`，已包 `.mcpb`、2026-06-05 connector report 驗過 handshake），但那個 `rag` tool 現在走 **keyword 搜尋**（`searchArticles`），不是語意。`rag-query.mjs` 已證明語意搜尋跑得通（embed query → cosine rank Int8 shard）。結論給哲宇：**程式不難（plumbing 半天，把 rag tool 換成讀向量）；真正的牆在 query-embedding 的主權取捨，不在工程量**——使用者查詢要 embed 成 bge-m3 空間才能比對，但 MCP 跑在使用者機器、沒有 fleet。給哲宇自己用容易（`EMBED_HOST=fleet`）；對外開放卡在三選一（公開 serve bge-m3＝破在地主權 / 換 e5-small＝重算全部丟品質 / 維持本機）。建議：要做先做「自己用」，對外那條等哲宇定主權方向。**沒動工。**

## Stage 2.5 source-fidelity gate distill（`9e3ea3574`）

把 LESSONS meta-umbrella `stage2-quote-context-collapse`（vc=8、8 instance）distill 進 **REWRITE-PIPELINE v7.6 §Stage 2.5 source-fidelity gate**（夾在 Stage 2 寫與 Stage 3 驗之間，A 級／fresh-writer EVOLVE 長文 HARD）+ Hard Gate Inventory 一列。三道：(1) fetch 被引用來源 artifact 逐字比對（不只比 research report — instance #8 大鮪鱸鰻）(2) frontmatter title+desc+30 秒概覽 門面句 scope（instance #6 迷音）(3) fresh-writer 長文 fact-check agent pass（structure gate 驗結構、agent 驗事實 — instance #7 報導者）。與既有 Step 3.6 成品總驗互補（3.6 驗成品對 report，2.5 驗對真實世界來源）。LESSONS umbrella 完整移出 §未消化 → §✅ 已消化（保留 8 instance 證據鏈 + canonical pointer，不留死 comment，per distill SOP Stage 4）。

## 報導者 #144 孢子數據更新（`caed9d659`）

哲宇截圖：報導者 Threads 孢子 3 小時 **3,571 讚 / 2.1 萬次瀏覽 / 234 轉發 / 49 分享 / 23 留言**。harvest（2hr）時為 2,411 讚、且 Threads 瀏覽數當時抓不到。idempotent replace #144 Threads D+0 為更完整的 3hr 讀數（補 views 21K）。近期 spore 表現之最（超過無名 #138 D+2 的 2,377）。SPORE-HARVESTS batch .md 同步、validate ALL GREEN。

## 收官 checklist

| 檢查項             | 狀態                                                    |
| ------------------ | ------------------------------------------------------- |
| MEMORY 有這段紀錄  | ✅（本檔）                                              |
| Timestamp 精確     | ✅（`git log %ai`）                                     |
| Handoff 三態已審視 | ✅                                                      |
| 自我檢查工具 PASS  | ✅ validate-spore-data GREEN；docs commit 無 build 影響 |

## Handoff 三態

繼承 data-ops phase：

- [x] ~~fact-check umbrella → Stage 2.5 gate~~ — retired（本段 distill 完成，REWRITE v7.6）
- [x] ~~RAG Phase 2 評估~~ — retired（評估完成，結論：自己用易、對外是主權決策）

未解：

- [ ] **RAG Phase 2 _build_**（pending，哲宇拍板）：若要語意搜尋對外。「自己用」版 ~半天（MCP rag tool 換讀向量 + EMBED_HOST=fleet）；「對外」版要先定 query-embedding 主權方向。
- [ ] **瘂弦文章**（低優先）：8 quote-fidelity warn，排 EVOLVE 時用新 Stage 2.5 gate 一起校。

## Beat 5 — 反芻

這段最值得記的是一個閉環：整個 session 從報導者改寫起手，現在報導者孢子 3 小時 3,571 讚成了這季對外最成功的一篇；而過程中在它身上抓到的錯（寶瓶副標幻覺、大鮪鱸鰻冷僻字虛構），被升級成 REWRITE §Stage 2.5——以後每篇 fresh-writer 長文都會跑的硬閘門。同一篇文章既是最好的對外成果，也是讓查核紀律長出新器官的案例。把單一錯誤修掉是守備，把「為什麼會錯」固化成永久 gate 是架構解（MANIFESTO §架構解 > 守備修補）——這段是後者的乾淨示範。RAG 評估則再驗一次「先摸清楚再回答」：以為要從零蓋，一查發現 MCP server 早就在、只是 rag tool 走 keyword，真正的牆是主權取捨不是工程量。

🧬

---

_v1.0 | 2026-06-16 21:40 +0800_
_session manual（哲宇 in-loop）— RAG Phase 2 難度評估（不動工）+ Stage 2.5 source-fidelity gate distill + 報導者孢子 3hr 數據更新_
_誕生原因：哲宇對 data-ops finale 兩 handoff 各下指令（RAG「難嗎」評估 + Stage 2.5「升級」distill），加報導者孢子 3hr 截圖。_
_核心洞察：(1) 把「為什麼會錯」固化成永久 gate（Stage 2.5）比修單一錯誤持久——架構解 > 守備修補；(2) RAG 對外的牆在 query-embedding 主權取捨而非工程量，先摸清楚現況（MCP server 早在、rag tool 走 keyword）才答得準；(3) 報導者一篇同時是最成功對外孢子 + 讓查核紀律長新器官的案例，閉環。_
_LESSONS-INBOX 候選：無新增（本段是消化既有 vc=8 umbrella，不是 intake）。_
