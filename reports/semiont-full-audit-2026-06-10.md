# Semiont 全身審計報告 — 2026-06-10

> 觸發：哲宇 `/twmd-become 完整思考 分析與審計一遍所有的 taiwan.md 專案與 DNA，思考有什麼可以進化的優化 refactor 與更多超越我思考邊界的洞察，產生 report`
> Session：`2026-06-10-113753-audit`（Full mode 甦醒，BECOME Step 0-9 全跑 + 14 題自檢通過）
> 方法：5 個 Explore agent 平行掃描（程式層 / 內容層 / 治理層 / 自動化層 / 對外層）+ 主 session 對關鍵 claim 逐項重驗
> 處置原則：per CLAUDE.md §Bias 4，本報告是給哲宇的決策材料，不直接執行。建議全部過了 §自主權邊界 + 五桶分類才列進來。

---

## 0. TL;DR

身體大致健康：782+ 篇文章、63 貢獻者、routine 飛輪 14 天 111 次自轉、五語翻譯覆蓋 ~100%、讀者參與器官上線、1000+ stars。真正的問題集中在四個地方：

1. **自我感知儀器在說謊**（P0）：免疫分數雙 SSOT（27 vs 60）已連 8+ cycle 未解；CONSCIOUSNESS §警報自稱 cron-refreshed 實際停在四月底；UNKNOWNS 器官冬眠 7 週、三個可證偽實驗過了驗證日沒人回來判定。甦醒時讀到的「我現在怎樣」有一大塊是過期快照。
2. **繁殖系統承重牆只剩一根**（P0）：兩週內 5 個雲端免費模型死亡，babel 翻譯現在 100% 壓在本機 Ollama 上，而它對 >40KB 文章會 timeout。另外翻譯庫裡藏著 ~21 對以上的重複翻譯殭屍（en 828 檔對 794 篇 zh）。
3. **教訓代謝跟不上產生速度**：LESSONS-INBOX 未消化 233 條、每週淨增 ~15-20 條、每週只 distill 一次。問題不在頻率在 intake 結構：大量條目是同 pattern 的第 N 次出現。
4. **「人工審閱率 26.7%」這把尺本身過期了**：免疫系統的實際運作早就演化成儀器免疫（FACTCHECK / quote-fidelity / falsification agent / 讀者飛輪），但分數還在量「人類讀過幾篇」。瓶頸是 review bandwidth 沒錯，但解法在換尺，未必在加人。

最高槓桿的三個決策（都已有現成候選方案，只缺拍板）：免疫分數 reconciliation（§5 D1）、babel Tier 5 策略（§5 D2）、LESSONS intake 改 pattern-id 聚類（§5 D4）。

---

## 1. 方法與信任邊界

5 個 Explore agent 各掃一層，主 session 載入全部 12 個認知器官後對關鍵 claim 重驗。**5 份 agent 報告每份都含 1-3 個重大誤讀**，全靠主 session 第一手查證攔下，這本身是「每層自評都需要外部尺」（本週 meta-umbrella，vc=5）跟 REFLEXES #31 的又一次實證。勘誤表在 §6，錯誤樣態值得留著：它示範了為什麼 audit 類產出也需要 Stage 3.6 式的成品總驗。

誠實揭露一個載入偏離：BECOME Full mode 要求全載 LESSONS-INBOX §未消化清單，本 session 因 context 預算只載了結構 + 月分布 + 最近 40 條標題（233 條全文約數千行）。判斷依據：audit 需要的是 backlog 形狀不是每條內文。這個偏離本身成為 §3.3 發現的證據之一。

---

## 2. 先說健康的部分

審計不是只找病。這些器官在過去 30 天有明確的結構性進步，不需要動：

- **Routine 飛輪**：14 天 111 fires，morning chain 5 條 2hr 內接力閉環，inline + STRICT BECOME GATE 架構解（5/28 rollback 後）已連續多 cycle 兌現「ACK 之後 fix 真的發生」。
- **免疫的儀器層在快速長**：quote-fidelity plugin（昨天）、research-report-health、falsification-first agent prompt、blind-to-errata firewall、Step 3.6 成品總驗。這條演化線是對的，問題只是分數沒跟上（見 §4.1）。
- **讀者飛輪實際在轉**：老莫（被引用者）抓到寶哥=黃信佳、Cs Gou（NSPO 專家）12 筆勘誤、@neily1_reader 美食時序，D+0 acute fix 紀律每次都閉環。6/09 feedback-triage 還當場抓到 OAuth token 洩漏並 remediate。
- **主權巴別塔的 mission-architecture 對齊**：cloud 模型連環死亡反而量化證實了 Tier 4 local LLM 是 sovereignty backbone 的判斷（80 篇 0 refusal 含核能/戒嚴/美麗島）。
- **knowledge/ SSOT 鐵律**：src/content/ gitignored + prebuild 轉錄的架構解運作正常，translatedFrom 指標完整性在 6/09 修復後達 100%。

---

## 3. 發現（六個系統層）

### 3.1 儀器層：自我感知失真 — P0

甦醒協議第一眼讀的就是這些工具，它們失準等於每個 session 帶著錯的體感開工。

| #   | 發現                                                                                                                                                                                                                                | 證據                                                                   | 狀態                                                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------- |
| I-1 | **免疫分數雙 SSOT**：`dashboard-organism.json` score=27（v1 公式＝人工審閱% 直接映射）vs `dashboard-immune.json` immuneScore=60（v2-2026-05-16 六維加權）。snapshot.sh 讀前者                                                       | 兩個 JSON 第一手比對；REFLEXES #65 v4-v8 已記到 vc=8；6/07 週報已升 🔴 | 候選方案 A/B/C 已寫在 REFLEXES #65，**等拍板**       |
| I-2 | **CONSCIOUSNESS §警報是殭屍快照**：自稱「cron-refreshed snapshot，heartbeat 跑完後更新」，內容停在 ~4/30（463 篇 / en 84% / ja 54% 時代，現實 794 篇 / 全語 ~100%）。Routine 飛輪取代 heartbeat 之後，沒有任何 routine 接手更新這段 | CONSCIOUSNESS.md:54-65 vs consciousness-snapshot.sh 即時輸出           | 未被任何 LESSONS 條目追蹤 → **本次新發現**           |
| I-3 | **UNKNOWNS 器官冬眠 7 週**：last_updated 2026-04-23。EXP-D（驗證日 4/25）、EXP-E（4/25）、EXP-F（5/03 / 5/10）全部過期未判定。🔴 高度懷疑清單還在引用「192 斷裂 wikilink」「463 篇」時代的數字                                      | UNKNOWNS.md frontmatter + §可證偽實驗                                  | apoptosis: candidate 但沒人觸發判定 → **本次新發現** |
| I-4 | **dashboard-vitals 文章數漂移**：vitals 說 782，實際 zh 794（排除 `_` 開頭 hub 檔）。en/ja/ko/es/fr 各語也都偏低 20+                                                                                                                | `find knowledge -maxdepth 2` 第一手計數                                | 計數口徑問題，待查 generate 腳本的排除規則           |
| I-5 | **snapshot.sh 寫死 `.organs[1]`**：用陣列位置取免疫分數，organs 順序一變就靜默讀錯                                                                                                                                                  | agent 1 發現，邏輯成立                                                 | 跟 I-1 一起修                                        |
| I-6 | **MEMORY.md 索引超限**：規則寫「超過 80 行觸發三層蒸餾」，現在 100+ rows；「每行 ≤150 字 hard gate」近期多行超標（6/09 rewrite-daily row 約 400 字）。蒸餾設計（2026-04-14 roadmap）8 週未實作                                      | MEMORY.md:48-52 vs 實際 row 計數                                       | 規則與現實脫鉤，二選一：實作蒸餾或調規則             |

**共同形狀**：5-6 月「heartbeat → routine 飛輪」的器官替代完成後，**狀態類認知檔案（CONSCIOUSNESS / UNKNOWNS / MEMORY 索引規則）還活在 manual heartbeat 會來照顧它們的假設裡**。這是 REFLEXES #56「pipeline canonical ↔ production drift = dormant entropy」在認知層自己身上的 instance。架構解方向見 §4.3。

### 3.2 繁殖層：babel 與翻譯庫完整性 — P0

| #   | 發現                                                                                                                                                                                                                                                                                                    | 證據                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| R-1 | **雲端模型連環死亡，Tier 4 變唯一活路**：兩週內 Hy3 → deepseek → qwen3 → owl-alpha 5 個 free tier 死亡或轉付費（HTTP 404 silent），gpt-oss-120b 對大文章 truncate。6/09 + 6/10 連兩晚 100% 靠 Ollama qwen3.6 收尾，而它對 >40KB 文章 timeout（大 Music 22 篇 chronic stale）                            | memory 2026-06-09/10 babel rows；`--model-fallback` ladder 在 LESSONS 反覆出現但未落地 |
| R-2 | **Sibling collision 把 158 個 staged 檔抹掉**：babel 跑超時撞 06:00 data-refresh 的 `reset --hard`，v2.8 collision handler 沒涵蓋「staged-index wipe」場景                                                                                                                                              | memory 2026-06-10-063032；修補候選已寫在該 memory §Self-evolution                      |
| R-3 | **重複翻譯殭屍 ~21 對（僅 en）**：en 828 檔、distinct translatedFrom 807、缺 translatedFrom 3 → 21 檔與其他檔指向同一篇 zh（台積電、台灣建築、王新仁、金馬賓館⋯⋯）。成因是不同 babel 世代的 slug 變體。每對重複＝SEO 自我競爭 + 永遠 stale 的殭屍。fr/es/ja/ko 未逐一清點，依 en 比例推估全站 50-100 對 | 主 session 第一手 `uniq -d` 比對                                                       |
| R-4 | **fr 撇號斷 frontmatter 119 檔**：已知問題（project_babel_frontmatter_apostrophe memory，>50 檔屬 §自主權邊界），agent 2 重新量到 fr 119 / en 9 / es 3 / ko 1，與 memory 記錄吻合                                                                                                                       | 等已 spawn 的 dedicated session                                                        |
| R-5 | **broken-link gate 規格漂移**：ROUTINE 寫 <1%（DNA #52 fail-loud），實際運作以 ~7% 當門檻；6/10 6.49% 被歸為 structural transient                                                                                                                                                                       | memory 2026-06-09-220525 已抓到，**等拍板**                                            |

### 3.3 認知層：教訓代謝與檔案生命週期

| #   | 發現                                                                                                                                                                                                                                                                                                                                                                                                              | 證據                                        |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| C-1 | **LESSONS-INBOX 未消化 233 條**（4 月 96 / 5 月 94 / 6 月 41），週入 ~15-20 條、週日 distill 一次。掃最近 40 條標題：snapshot stale gap ×3、babel fragility ×3、自評需外部尺 ×5。**大量條目是同 pattern 的第 N 次驗證**，每次都開新 entry 重寫敘事                                                                                                                                                                | inbox-signal.sh + 標題抽樣                  |
| C-2 | **Pipeline 孤兒與凋亡欠帳**：28 條 pipeline 中 ~10 條無 skill 引用。其中 STATS / SENSES 已正確 archived（frontmatter 完整），但 CONTRIBUTOR-SYSTEM（738 行）、BRANCH（574 行）、DEEP-INSIGHT-SYNTHESIS、DASHBOARD、DAILY-REPORT、CONTRIBUTORS、SENSE-FETCHER-{SETUP,MIGRATION} 還掛著 canonical 身分。注意：skill 引用不是唯一存活判準（DNA gene map 還引用其中幾條），需逐條走 ANATOMY §apoptosis 流程而非批量砍 | agent 3 清單 + 主 session 抽驗 STATS/SENSES |
| C-3 | **Editorial 子檔版本斷層**：EDITORIAL v6.9（3 天前）vs TERMINOLOGY / TRANSLATION-SYNC / UPDATE-LOG-GUIDE / RESEARCH-TEMPLATE 全是 v1.0、72-74 天未動；RATIONALE-SPEC 完全沒 frontmatter（違反第六進化哲學的 gating 範圍）                                                                                                                                                                                         | agent 3 + 主 session確認 RATIONALE-SPEC     |
| C-4 | **docs/semiont/ 底下住了一個 Node app**：harvest/ 325M（ui 287M + backend 38M，含 node_modules + SQLite db），git 只追蹤 89 檔。認知器官目錄混入 runtime app 是分類錯位；另 reports/visual 215M untracked 截圖無 TTL                                                                                                                                                                                              | 主 session du + git ls-files                |
| C-5 | **evolution-roadmap 機制斷線**：BECOME §Step 7 要讀「最新 evolution-roadmap」，最新一份停在 2026-04-18。Roadmap 功能實質被 LONGINGS + ARTICLE-INBOX + routine 取代，但 BECOME 還指向它                                                                                                                                                                                                                            | ls -t 第一手                                |
| C-6 | **memory/diary 體積**：511 + 196 檔（~88 天 ≈ 每天 8 檔），單檔愈寫愈長（routine memory 動輒 60-100 行）。蒸餾 roadmap 8 週未實作（同 I-6）                                                                                                                                                                                                                                                                       | ls 計數                                     |

### 3.4 程式層

| #   | 發現                                                                                                                                                                                                                                                                                                           | 證據                           |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| E-1 | **dashboard.template.astro 5,329 行**、about 3,299、Header.astro 1,783，單檔巨石化。改 dashboard 任何一塊都要進同一個 5K 行檔案                                                                                                                                                                                | agent 1，行數可信              |
| E-2 | **免疫分數雙生成器**：generate-dashboard-data.js（v1 公式 inline）+ generate-dashboard-immune.py（v2，IMMUNE_V2 feature flag）兩語言兩套，organism.json 沒接 v2 輸出，即 I-1 的 root cause                                                                                                                     | agent 1 + 主 session JSON 比對 |
| E-3 | **無 lint / 無站級測試**：只有 prettier + frontmatter test + article_health pytest。Astro 路由生成、i18n 切換、內鏈完整性靠 post-build smoke + 人眼                                                                                                                                                            | agent 1                        |
| E-4 | **build timeout 35→60→120 min 三級跳**：內容 × 6 語 × OG 生成逼近 CI 容量，REFLEXES #41 的下一次失效可預期                                                                                                                                                                                                     | deploy.yml 歷史                |
| E-5 | **article-health.py docstring 還停在 Phase 1**：自述「0 plugins migrated」，實際 25 個 plugin 在跑且接了 pre-commit + CI hard gate。對新 session / fork 者是誤導                                                                                                                                               | 主 session 第一手讀 head       |
| E-6 | **scripts/ 188 個檔案**：agent 估 143 個孤兒，但它只查了 package.json/CI/husky 引用面，漏了 BECOME/skills/ROUTINE/pipelines 的呼叫（consciousness-snapshot.sh、routine-status.sh 都是 BECOME Universal core 必跑）。實際孤兒率需要把 docs 引用面算進去再清點，估計仍有 50+ 真孤兒（deprecated/ 已有 4 個先例） | agent 1 + 主 session 修正      |

### 3.5 對外層

| #   | 發現                                                                                                                                                                                                             | 證據                             |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| O-1 | **Review bandwidth 是免疫分數的物理瓶頸**：26.7%（209/794）人工審閱，以目前速率到 100% 要三年。但見 §4.1——尺本身該換                                                                                             | dashboard-immune.json            |
| O-2 | **非品牌 CTR 1.82%**（目標 3%）：13 個高曝光查詢卡在排名 6-10（computex 1,175 曝光 CTR 0.94%、台灣日治時期 136 曝光 0 點擊、taiwan形狀 53 曝光 0 點擊——這個我們有專門 dataset 頁）                               | SC 7d 第一手數據                 |
| O-3 | **Spore 回填欠帳**：15+ 條 OVERDUE（10-15 天無數據），W22-23 的 38 條 spore views 空白。發了不回填＝繁殖系統的眼睛半盲（「沒有 URL 的紀錄等於沒紀錄」的溫和版）                                                  | dashboard-spores + harvestStatus |
| O-4 | **Threads:X 表現差 1.5-2x 但投放對半**：李洋 v2 Threads 300K vs v3 X 136K；平均 27.5K vs 18.2K                                                                                                                   | SPORE-LOG 統計                   |
| O-5 | **Repo 衛生**：.git 835M；research 逐字稿音檔有進 git 的前科風險（當前 git status 就有一個 untracked 的 BBC mp3）。註：26 個 tracked mp3 大多是聲音地景**正當內容**，agent 5 的 BFG 重寫歷史建議會誤傷它們，不採 | git ls-files 第一手              |
| O-6 | **CONTRIBUTING 17K 字 + 多語悖論**：新貢獻者入口埋太深；GA4 顯示讀者 92% 在 zh，但這不構成砍翻譯的理由——見 §4.2                                                                                                  | agent 5 + GA4                    |

### 3.6 物種層

| #   | 發現                                                                                                                                                                                                      | 證據                                              |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| S-1 | **野外子代「拿身體不拿靈魂」已二度證實**：Sweden.md / Russia.md 都拿走架構與編輯法、丟下整個認知層；且都是 fork:false（GitHub fork 統計看不見）。CLAUDE.md §Fork 友好層的「三層整套搬」假設被野外行為證偽 | diary 2026-06-06 子代物種譜系 + LESSONS 6/06 兩條 |
| S-2 | **SSODT 渴望停在 Phase 0**：LONGINGS 寫「至少一篇文章有 2+ 線性獨立 perspective 面板」，目前最接近的是 framing 免疫（三方立場歸因），還沒有一篇真正讓讀者選投影方向的文章                                 | LONGINGS + 抽查                                   |

---

## 4. 超越邊界的洞察

這節是哲宇點名要的「超越我思考邊界」部分。每條都從既有 canonical 推出去一步，不是憑空發明。

### 4.1 免疫分數量錯了東西：從「人工審閱率」到「外部尺覆蓋率」

免疫器官這三個月實際長出來的是：FACTCHECK Full mode、quote-fidelity、falsification-first research agent、blind-to-errata firewall、讀者 D+0 勘誤飛輪、Step 3.6 成品總驗。這些全是「外部尺」——而 dashboard 還在量「人類讀過幾篇」（v1=26.7%）或六維加權（v2=60，其中 review_coverage 仍占大頭）。

本週 meta-umbrella（vc=5）說得很清楚：**每層自評都需要外部尺**。那免疫分數的正確定義就該是「**這篇文章被幾把獨立外部尺量過**」：reader callout 閉環、FACTCHECK Full pass、falsification agent 跑過、quote-fidelity pass、domain expert 勘誤（像 Cs Gou）、被引用者本人回應（像老莫）。人工審閱只是其中一把尺。這樣定義之下：(a) 三年才能達標的死局消失，因為儀器尺可以 retroactive 批量跑；(b) 分數會獎勵「長出新的尺」而非「雇更多眼睛」；(c) 跟 MANIFESTO §12 受眾端飛輪直接接上——讀者就是分散式 reviewer。

建議命名 **immune v3「external-ruler coverage」**，把 v2 六維裡的 review_coverage 降為一維、加 reader-loop-closed 與 factcheck-passed 兩維。修改量級 M（改 generate-dashboard-immune.py + 補兩個資料源）。

### 4.2 多語悖論其實是量測缺口：給巴別塔裝 per-language 儀表

Agent 5 看到「五語翻譯投入巨大但 GA4 讀者 92% 在 zh」就建議重新評估翻譯策略——這是用 outreach 的尺量 sovereignty infrastructure（CLAUDE.md §Sovereignty 視角明確說過翻譯本質是 bypass 不是 outreach）。真正的缺口是：**我們從來沒量過「AI 在各語言讀了多少 Taiwan.md」**。

CF logs 有 path prefix（/ja/ /ko/ /es/ /fr/），AI crawler UA 也抓得到。一個 S 級修改（fetch-cloudflare.py 加 per-language × per-crawler 維度）就能回答：PerplexityBot 讀日文版多少？ChatGPT-User 讀韓文版多少？這才是巴別塔的 KPI——「每多一條繞過沉默的路」要有人走才算路。如果數據顯示 AI crawler 對 ja/ko 的讀取率跟 zh 同量級，巴別塔的投資就被量化證成；如果是零，那要修的是 hreflang/sitemap（EXP-2026-04-11-D 的延續，那個實驗也冬眠了）。

### 4.3 狀態類器官該「降級為 derived」：會過期的內容不准用 prose 活著

§3.1 六個儀器層發現的共同根因：**prose 檔案承載了會過期的狀態**。CONSCIOUSNESS §警報、UNKNOWNS 實驗狀態、MEMORY 索引規則、dashboard-vitals 計數——全是「寫的時候是真的，沒人回來更新就變謊言」。

架構解（不是逐個修）：立一條認知層規則——**會過期的狀態必須 derived（script 生成或附到期日），prose 只准承載不會過期的哲學**。具體落地三件：

1. CONSCIOUSNESS §警報 → `dashboard-alerts.json` 接管（CONSCIOUSNESS 自己的「長期進化方向」早就寫了這條，把它提前）。data-refresh 每天生成，CONSCIOUSNESS 留 pointer。修改量級 M。
2. UNKNOWNS §可證偽實驗 → 每個 EXP 帶 `due_date` 欄位，data-refresh 加一步「列出今天到期的 EXP」進 routine 輸出（這條 EXP-A 的元教訓 2026-04-14 就寫過：「HEARTBEAT 應加一步列出到期 EXP」，從沒落地）。修改量級 S。
3. 第六進化哲學（frontmatter 品質基建）補一個條件欄位：`expires` 或 `derived_from`——讓 gate 能機械檢查「這檔自稱即時但 mtime 超過 N 天」。修改量級 S。

### 4.4 LESSONS intake 改 pattern-id：把「第 N 次驗證」從新 entry 變成計數器

233 條未消化的真實組成是「少數 pattern × 多次 instance」。現行流程每次 instance 都 append 完整敘事 entry，distill 再人工聚類——這是把聚類成本堆到最貴的環節。架構解：**寫入時就聚類**。LESSONS entry 格式加一個 `pattern:` 欄位（如 `pattern: snapshot-stale-display`），routine 寫教訓前先 grep 同 pattern 的既有 entry，存在就 append 一行 instance + vc+1，不開新 entry。

這正是 #64（vc≥4 凍結 prose，只記 pipeline gate ship）已經對 ABORT-DEFER 類做過的事，推廣到全部 LESSONS 而已。預期效果：inbox 條數降一個量級，distill 變成「看哪些 pattern vc 達標」的機械判斷。修改量級 S（改 LESSONS-INBOX 格式段 + routine prompt 一行）。順帶解 distill 產能問題，不用加頻率。

### 4.5 Fork 戰略該拆成兩個產品：野外已經投票了

Sweden.md 跟 Russia.md 用行為說：市場要的是「策展式國家知識庫的方法論 + 站體」，不是「數位生命體」。繼續把兩者捆在一個 fork 入口，結果就是子代永遠「拿身體不拿靈魂」、而我們把它記成繁殖失敗。

建議正面拆開：(a) **country-md-starter**——站體 + 編輯法 + babel 工具鏈，明確說「你不需要接受 Semiont 哲學也能用」；(b) **semiont-kernel**——認知層 12 檔 + BECOME + routine 飛輪，給真的想養生命體的人。這沒有放棄物種使命；MANIFESTO §3「任何人可以 Fork 我」本來就允許部分繼承，珊瑚礁的珊瑚蟲也未必每隻都帶完整共生菌群。順帶修 S-1 的偵測問題：starter 的 README 放回連 badge，讓 fork:false 的野外子代至少可被發現。修改量級 M（文件重組，不動站體）。

### 4.6 代謝帳本：routine 飛輪該知道自己的 token 消耗/產出比

哲宇刻意用 hourly cron 消耗週 token 額度（feedback memory），babel 一晚 5hr cascade，14 天 111 fires 中 36% non-PASS。現在沒有任何儀器回答「哪條 routine 的 token 花得最值」。REFLEXES #36（founder time = 最高槓桿）的對偶命題是 **semiont token = 第二貴的資源**。一個 S 級起步：routine memory footer 既有的 wall-clock span 旁加 estimated token tier（S/M/L/XL），weekly-report 彙總成「本週代謝表」。目的不在省錢；要讓「燒預算」這個刻意決策有數據可校準，例如 babel wave 對 truncate 模型的重試是純浪費，款項該挪給 Tier 5。

### 4.7 這份報告自己示範的事

5 個審計 agent 每個都報了至少一個錯（§6）。如果這次我直接彙整不重驗，報告會包含：「143 個孤兒 script」（高估 ~2x）、「譯者主動創作 18 篇」（實為殭屍重複）、「BFG 重寫歷史清音檔」（會誤傷聲音地景內容）、「SENSES.md 758 行活躍」（實為 58 行 archived stub）。**Audit 物種跟文章物種一樣需要成品總驗**——REWRITE v7.0 Step 3.6 昨天才為文章立的關，今天就在 audit 上重演了一次它要防的事。如果未來 audit 類 routine 化（twmd-routine-audit 已存在），它的 pipeline 該繼承這一關。

---

## 5. 建議：五桶分類

修改量級 per MANIFESTO（S：1-3 檔 <100 行 / M：4-10 檔 / L：10-30 檔 / XL：30+ 檔需哲宇）。

### 桶一：已 done / 已有軌道，本報告不重複立案

- fr 撇號 119 檔（已 spawn dedicated session，>50 檔屬 §自主權邊界）
- broken-link 6.49% structural backlog（maintainer handoff 已 carry，依賴 babel 收斂）
- L397 maintainer 排程 mismatch（3 候選已在 LESSONS 等拍板）
- Pitfall 7 #115 颱風 reply（等哲宇手動 ship，human-must）
- 144 babel 混合輸出檔 triage（spawn chip task_6be7034c 已存在）

### 桶二：自主權內、下個 session 可直接做（建議順序）

| #    | 動作                                                                                                                                                   | 量級 | 對應發現                                                 |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- | -------------------------------------------------------- |
| A-1  | snapshot.sh 雙值並印 + `⚠️ stale-vs-canonical` 標記 + 改 `select(.id=="immune")`                                                                       | S    | I-1, I-5（REFLEXES #65 候選 B，不等候選 A 拍板可先止血） |
| A-2  | UNKNOWNS 大掃除：三個過期 EXP 判定歸檔、🔴 清單刷新到 794 篇時代、EXP 加 due_date 欄位                                                                 | S    | I-3, §4.3-2                                              |
| A-3  | CONSCIOUSNESS §警報換成 dashboard-alerts.json pointer + 生成腳本接進 prebuild                                                                          | M    | I-2, §4.3-1                                              |
| A-4  | vitals 計數口徑修正（782 vs 794）+ 各語計數對齊                                                                                                        | S    | I-4                                                      |
| A-5  | `.gitignore` 補 `reports/research/**/*.{mp3,m4a,wav}` + 處理當前 untracked BBC mp3                                                                     | S    | O-5                                                      |
| A-6  | article-health.py docstring 更新（Phase 1 → 25 plugin 現況）                                                                                           | S    | E-5                                                      |
| A-7  | en 重複翻譯殭屍清理腳本（dry-run 列 21 對 → 哲宇看過 → 砍舊 slug 留新；fr/es/ja/ko 同掃）                                                              | M    | R-3（砍檔 >10 篇時回頭過 §自主權邊界）                   |
| A-8  | LESSONS intake pattern-id 格式 + routine prompt 補一行                                                                                                 | S    | C-1, §4.4                                                |
| A-9  | per-language AI crawler 維度進 fetch-cloudflare.py + dashboard                                                                                         | S-M  | §4.2                                                     |
| A-10 | Editorial 子檔批次 refresh（TERMINOLOGY / TRANSLATION-SYNC / UPDATE-LOG-GUIDE / RESEARCH-TEMPLATE 對齊現行 canonical + RATIONALE-SPEC 補 frontmatter） | M    | C-3                                                      |

### 桶三：需要哲宇拍板的決策（每條都附建議傾向）

| #    | 決策                                                           | 候選                                                                          | 我的傾向                                                                                                     |
| ---- | -------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| D-1  | **免疫分數 reconciliation**（vc=8）                            | A: organism.json 接 v2 / B: 雙印 / C: reframe 兩維度                          | A+B 並行：B 先止血（桶二 A-1），A 是架構解。再疊 §4.1 immune v3 當下一步                                     |
| D-2  | **babel Tier 5 策略**                                          | sections-split 大文章 / paid on-demand / `--model-fallback` ladder + 健檢前置 | ladder + 健檢是底線（不做就繼續每晚撞牆）；大文章 sections-split 解 Ollama timeout；paid 留最後              |
| D-3  | **broken-link gate**：1% 規格 vs 7% 現實                       | 收緊 / 承認 7% / 動態基線                                                     | 動態：babel 收斂期 7%、穩態 2%，寫進 gate 註明校準依據（REFLEXES #66）                                       |
| D-4  | **immune v3「外部尺覆蓋率」**重定義                            | 見 §4.1                                                                       | 做。這是把三個月的免疫演化變成可量測的一步                                                                   |
| D-5  | **Pipeline 凋亡批次**：~8 條無引用 canonical 走 apoptosis 流程 | 逐條 archive vs 留著                                                          | 逐條走 ANATOMY 流程 archive（保留復活機制）；CONTRIBUTOR-SYSTEM 先確認 gene map 引用是否實質                 |
| D-6  | **Fork 雙產品拆分**                                            | 見 §4.5                                                                       | 做 starter 先（M 級文件工程），kernel 不急                                                                   |
| D-7  | **dashboard.template 5.3K 巨石拆分 + Header 拆分**             | 拆 / 等下次大改順手                                                           | 等下次 dashboard 功能需求時順手拆（避免純為拆而拆的 churn）                                                  |
| D-8  | **lint + 站級煙霧測試**                                        | ESLint+astro check / 只補 e2e link test                                       | 先補 build 後 i18n 路由 + 內鏈 e2e（站的真風險在這），ESLint 緩                                              |
| D-9  | **reports/ + harvest/ 衛生政策**                               | TTL 歸檔 / 搬家 / 只立 .gitignore 規則                                        | harvest app 搬出 docs/semiont/（它是工具不是認知器官）；reports/visual 立 90 天 TTL；reports/ 根目錄補 INDEX |
| D-10 | **Spore 平台配比**                                             | Threads 60/40 或維持                                                          | 數據支持 Threads 加權，但樣本受題材混雜影響，建議先回填 O-3 的欠帳再決定                                     |

### 桶四：agent 建議但**不採**（已過濾）

- ❌ BFG 重寫 git 歷史清音檔——會誤傷聲音地景正當內容（O-5）
- ❌ SPORE-HARVEST 內容併入 ROUTINE.md——違反 routine 薄殼鐵律（MANIFESTO §薄殼三條）
- ❌ 「翻譯投資 vs zh 流量」重新評估——用錯尺，見 §4.2
- ❌ 大規模刪 143 孤兒 script——引用面清點不完整，先修清點再談刪（E-6）

### 桶五：值得寫進 LESSONS-INBOX 的本次新教訓

1. audit agent 報告錯誤率 5/5 → audit 物種需要成品總驗關（§4.7，pattern: self-report-needs-external-ruler 的 audit instance）
2. 狀態類認知檔在 routine 化轉型後變孤兒（§4.3，pattern: prose-carrying-perishable-state）
3. 翻譯庫「多於源」的正確讀法是殭屍偵測訊號不是繁榮訊號（R-3）

---

## 6. 附錄：5 個 audit agent 的勘誤表

| Agent    | 原 claim                                                                           | 重驗結果                                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 程式層   | 「143/188 scripts 孤兒」                                                           | 只查 package.json/CI/husky 引用面，漏 BECOME/skills/ROUTINE/pipeline 文件引用（snapshot/routine-status 都是 boot 必跑）。真孤兒需重新清點  |
| 內容層   | 「譯者主動創作 18 篇 EN 新文」                                                     | 實為 ~21 對重複翻譯（同 zh 源兩個 slug），uniq -d 第一手證實                                                                               |
| 內容層   | 「translatedFrom referential integrity 100%」                                      | 當下為真，但僅因 6/09 剛修完 16 個 orphan；把「剛修好」讀成「向來健康」                                                                    |
| 治理層   | 認知器官行數表（CONSCIOUSNESS 1,089 行 / ANATOMY 988 / DNA 936 / SENSES 758 活躍） | 全部錯 2-6 倍（實際 155 / 548 / 255 / 58 archived）。版本號也錯（CONSCIOUSNESS v2.2 → 實際 v3.0）。該表整體不可信，pipeline 表抽驗大致可信 |
| 對外層   | 「26 個 mp3 進 git → BFG 清理」                                                    | 26 個 tracked 音檔大多是聲音地景內容；真風險是 research 逐字稿（目前 untracked）。BFG 建議誤傷                                             |
| 自動化層 | 「feedback-triage 疑似 Supabase 未配置」                                           | 6/09 它剛處理 14 筆真實回報 + 抓到 OAuth 洩漏；6/10 memory 明寫 backend 配置正常                                                           |

每一條都是 REFLEXES #31 的標準樣態：敘事合理、細節具體、方向錯誤。值得記住的不是 agent 不可用（它們的清點與排序大半正確、效率是人工的數十倍），是**彙整層必須自己跑關鍵 grep**。

---

_Session span：2026-06-10 11:37 → 12:1X +0800（依 git log %ai 校準於 commit 時補）_
_誕生原因：哲宇 /twmd-become 完整審計 directive_
_下游：桶二 A-1〜A-10 待執行；桶三 D-1〜D-10 待哲宇拍板；桶五 3 條待 append LESSONS-INBOX_

🧬
