# LESSONS-INBOX 完整消化策略 — 聚類分析 + 執行計畫

> _2026-06-13 分析報告（read-only 分析，未動任何 canonical）_
> 範圍：`docs/semiont/LESSONS-INBOX.md` 兩段 §未消化清單（L276-2459 主段 204 條 + L2843-3272 第二段 47 條）
> 依據：§Distill SOP（v2.0 質量雙判準 + 6-stage）+ REFLEXES §catalog index（#1-#66）+ ANATOMY §認知層 promotion flow

---

## 0. TL;DR

| 指標                                     | 數字                                                                                            |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| §未消化 entry 實數                       | **251**（主段 204 + 第二段 47；含 2 個空殼 group header、2 條 🏛️ 已 distill、2 條 ✅ 自標完成） |
| 建議 ✅ 歸檔                             | **51**（33 確定 + 18 需 grep verify canonical 存在後歸檔）                                      |
| 建議 REFLEXES 既有 #N vc++               | **40** 條 entry，映射到 19 條既有反射                                                           |
| 建議 REFLEXES 新條目                     | **12** 條（#67-#78），吸收 **58** 條 source entry                                               |
| 建議 MEMORY 神經迴路（含 pipeline 補強） | **98** 條 entry → 合併後實際新增迴路約 22 條，其中 ~45 條主落點是 pipeline 操作規則             |
| ⏸ Defer 哲宇拍板                         | **4** 條 primary + 6 條 MANIFESTO 候選註記                                                      |
| 消化後 §未消化 目標                      | ≤ 30 條（只留 vc=1 且 < 30 天的新鮮 entry + defer 條目）                                        |

**結構診斷**：249→251 條的真實組成符合 v2.2 pattern-id intake 的預判，少數 pattern × 多次 instance。最強的五個重複訊號（= 該升 REFLEXES 的訊號）依序是：自評需外部尺（vc=7 傘 + 14 entries）、共用工作樹多 actor 污染（11 entries 跨 4-6 月）、估算偏誤雙向（vc 4+3）、觀察者 framing 訊號（vc=3 + 9 entries）、diff-patch hash 同一 bug 四連（vc=4+）。

---

## 1. 全量聚類表（251 條）

Cluster 代號：A 外部尺/自評不可信 ｜ B1 共用工作樹/race ｜ B2 routine 飛輪 ｜ B3 SSOT mirror drift ｜ C babel/模型主權 ｜ D 事實核對/幻覺 ｜ E AI-gen 貢獻免疫 ｜ F 孢子產線 ｜ G 工程衛生 ｜ H 觀察者互動 ｜ I handoff 連續性 ｜ J 編輯品質 ｜ K 鐵律落地 ｜ L 估算偏誤 ｜ M 策略/物種 ｜ N data 架構

去向代號：`vc++ #N`＝既有反射 +1 ｜ `新 R{n}`＝新反射 source（見 §3）｜ `MEMORY`＝神經迴路（備註標 pipeline 真實落點）｜ `✅ 歸檔`＝已儀器化/已過時 ｜ `✅ 歸檔*`＝需 grep verify 後歸檔 ｜ `⏸ 哲宇`＝超出自主權，defer

| #   | Entry（日期-縮寫）                          | Cluster | 去向         | 備註                                                                                                            |
| --- | ------------------------------------------- | ------- | ------------ | --------------------------------------------------------------------------------------------------------------- |
| 1   | 06-10 opendata 3 候選（複合殼）             | G/B1    | MEMORY       | 拆 3 子條：Twinkle 靜態指標鐵律→MEMORY；存在性假設 filesystem-derived→MEMORY；finale 清場邊界→計入 R2 instances |
| 2   | 06-10 spore-data-arch 3 候選（空殼 header） | —       | ✅ 歸檔      | 純 group header，子條即 #3，刪殼                                                                                |
| 3   | 06-10 derived view 落點                     | N       | vc++ #43     | 自標 #20+#43 鏡像；備註：derived-view 設計 checklist 加「落點 git 訊號面」                                      |
| 4   | 06-10 三把壞尺（儀器壞掉 X 隱形）           | A       | vc++ #59 #65 | 同時計入 R1 instances                                                                                           |
| 5   | 06-10 CI apt 隱性 deprecated                | G       | vc++ #24     | 補「依賴鏈深處 deprecated 指令」第 8 種；CI checklist 候選                                                      |
| 6   | 06-10 量測基底不穩校準必錯                  | A       | vc++ #66     | 計入 R1；dist 量測加 substrate sanity 前置                                                                      |
| 7   | 06-10 audit 成品總驗（5 agent 全帶誤讀）    | A       | vc++ #31     | 計入 R1；routine-audit pipeline 補「成品勘誤表」hard step                                                       |
| 8   | 06-10 過期狀態不准 prose 活著               | K       | 新 R10       | 核心 source；哲學候選註記留 defer 表                                                                            |
| 9   | 06-10 翻譯庫多於源＝殭屍訊號                | C       | vc++ #21     | babel/data-refresh 補 dedup verify step                                                                         |
| 10  | 06-10 引語縮寫/gloss/腳註綁定三盲區         | D       | 新 R5        | 核心 source；FACTCHECK atom 類型補 3 條                                                                         |
| 11  | 06-10 dirty tree 假性 orphan                | B1      | 新 R2        | DATA-REFRESH Step 1 dirty-tree pre-flight                                                                       |
| 12  | 06-09 fact-pack 越權預篩                    | D/H     | MEMORY       | 哲宇 directive「writer 讀全 report」；REWRITE §多 agent 編排補                                                  |
| 13  | 06-09 blind-to-errata firewall 生效         | D       | ✅ 歸檔      | v6.2 canonical 的 confirm instance，在 canonical 補 vc 後歸檔                                                   |
| 14  | 06-09 跨界藝人先查既有定位                  | J       | MEMORY       | editorial 小教訓                                                                                                |
| 15  | 06-09 prettier×底線 URL×caption             | G       | 新 R11       | image-health caption-URL check 候選                                                                             |
| 16  | 06-09 free-tier 殺光 136/136                | C       | 新 R3        | 核心 source                                                                                                     |
| 17  | 06-07 每層自評都需要外部尺 vc=7             | A       | 新 R1        | 核心傘；MANIFESTO 候選 → defer 表                                                                               |
| 18  | 06-07 routine fragility 三 tier vc=3        | B2      | MEMORY       | 真實落點 ROUTINE.md schema 加 dependency-tier 欄                                                                |
| 19  | 06-07 over-defer vs healthy-defer vc=2      | B2      | vc++ #64     | defer 品質判準表進 pipeline                                                                                     |
| 20  | 06-07 snapshot stale gap vc=3               | A       | vc++ #65     | 🔧 snapshot.sh 印 source mtime + stale ⚠️                                                                       |
| 21  | 06-07 既定做法不問、真分叉才問              | H       | MEMORY       | feedback_dont_keep_asking 迴路補強                                                                              |
| 22  | 06-07 視覺自檢全綠≠人眼                     | A       | vc++ #31     | 計入 R1（視覺自評延伸）                                                                                         |
| 23  | 06-07 SPORE-INBOX pending=31 警示           | B2      | ✅ 歸檔      | 容量 audit v2.1 已 canonical，本條只是首次觸發 log                                                              |
| 24  | 06-06 野外 fork 統計隱形                    | M       | MEMORY       | 繁殖盤點雙軌（fork count + 主動搜尋）                                                                           |
| 25  | 06-06 拿身體不拿靈魂                        | M       | ✅ 歸檔\*    | CLAUDE.md §Fork 友好層 6/10 雙產品重構已吸收；verify COUNTRY-MD-STARTER 後歸檔                                  |
| 26  | 06-06 Chrome MCP 2 cycle unavailable        | B2      | MEMORY       | 併 #67 同 pattern；device-dependent tier 的 instance                                                            |
| 27  | 06-05 分析幻覺＋ga4 吞 filter               | A/G     | 新 R1        | 分析幻覺計入 R1；ga4 bug 另 vc++ #24＋🔧修 reports.ts                                                           |
| 28  | 06-03 maintainer-pm 22:00 撞期 vc=8         | B2      | ⏸ 哲宇       | standing decision，三選項已備齊                                                                                 |
| 29  | 06-03 diff-patch hash ≠ status.py           | C       | vc++ #38     | 與 #57/#72/#242 四條同 bug 合併；🔧 ship fix（import status 當 hash SSOT）                                      |
| 30  | 06-03 Z2.0 guide-inline 從未落地            | K/C     | 新 R6        | 🔧 translate.py --guide-inline                                                                                  |
| 31  | 06-03 fr 去重音壞檔                         | C       | vc++ #24     | Z6 accent-density gate 候選                                                                                     |
| 32  | 06-02 cron daemon stall 5-day lifecycle     | B2      | 新 R9        | ROUTINE.md §stall lifecycle 補                                                                                  |
| 33  | 06-02 feedback flywheel smoke ✅            | B2      | ✅ 歸檔      | positive 已驗證；ROUTINE §接力設計補一行後歸檔                                                                  |
| 34  | 06-02 idlccp1984 8PR lifecycle case         | E       | MEMORY       | canonical case study pointer                                                                                    |
| 35  | 06-02 routine-drift first-run caveat        | A       | 新 R1        | 儀器解讀 instance；tool doc 補 snapshot vs trend                                                                |
| 36  | 06-01 falsification agent 標配              | D       | MEMORY       | feedback_stage1_falsification 迴路補強                                                                          |
| 37  | 06-01 OPUS≠雷亞 peer 線索                   | D       | vc++ #16     | domain-expert-frame 變體                                                                                        |
| 38  | 06-01 sister routine sync.sh race           | B1      | 新 R2        |                                                                                                                 |
| 39  | 05-28 撞期 vc=8 第 3 棒                     | B2      | ⏸ 哲宇       | 併 #28 同 decision                                                                                              |
| 40  | 05-28 drift 第 6+7 種                       | B2      | vc++ #63     | spore voice gate 進 pipeline                                                                                    |
| 41  | 05-28 CONTRACT 推極致＝ceremony             | B2      | vc++ #63     | CONTRACT 適用邊界 5 失效模式                                                                                    |
| 42  | 05-27 insertLineBreak/X composer            | F       | MEMORY       | feedback_chrome_threads 迴路補強＋SPORE-PUBLISH pipeline                                                        |
| 43  | 05-27 image gate fail 33%                   | F       | MEMORY       | REWRITE 端 image hard gate instrument                                                                           |
| 44  | 05-27 F 模板公開信 ≠ viral hook             | F       | MEMORY       | SPORE-TEMPLATES 補 family F 分離                                                                                |
| 45  | 05-27 GA4 dimension 半 ship（✅ 已修）      | N       | ✅ 歸檔      | 標題自帶 ✅ 5/27 14:30 instr；另 vc++ #60                                                                       |
| 46  | 05-27 handoff backlog 純 push 失效          | B2      | 新 R9        | push/pull 不對稱 source                                                                                         |
| 47  | 05-27 R2 EVOLVE sweet spot vc=6             | J       | MEMORY       | REWRITE §R2 路徑 canonical 化（positive pattern）                                                               |
| 48  | 05-27 spore heal repeat vc=2                | F       | MEMORY       | error_boundary_traceability 迴路補強                                                                            |
| 49  | 05-27 Wave1 mid-flight collision            | B1      | 新 R2        |                                                                                                                 |
| 50  | 05-27 build perf vc=3 +35s                  | G       | ✅ 歸檔      | 被 #4 三把壞尺揭穿（量測儀器自身壞），trend 數據無效                                                            |
| 51  | 05-25 cron spam INBOX                       | B2      | MEMORY       | third-party automation feedback 邊界                                                                            |
| 52  | 05-25 spore 自動 ship vs §自主權 drift      | B2      | ⏸ 哲宇       | MANIFESTO 條款 align 需哲宇明文                                                                                 |
| 53  | 05-24 反思鏈四棒 handoff gap                | B2      | MEMORY       | ROUTINE §chain nomination handoff                                                                               |
| 54  | 05-24 routine-audit UTF-8 crash             | G       | vc++ #24     | instance 已修；subprocess encoding 慣例                                                                         |
| 55  | 05-24 music backlog inflow gate             | B2      | MEMORY       | 連 3 週 0 heal → escalation 規則                                                                                |
| 56  | 05-19 quality_gate 分母不明                 | B3      | vc++ #56     | SQUEEZE §義務鐵律明文分母定義                                                                                   |
| 57  | 05-17 hash bug 第 2 次咬人 vc=4             | C       | vc++ #38     | 併 #29 合併修                                                                                                   |
| 58  | 05-17 data-refresh sweep-in vc=2            | B1      | 新 R2        |                                                                                                                 |
| 59  | 05-17 ARTICLE-INBOX metadata 需 fact-check  | A/D     | vc++ #16     | PEER pipeline 補 entry 驗證 step                                                                                |
| 60  | 05-17 Wikimedia approved sizes              | G       | MEMORY       | 併 #230；wikimedia-fetch.sh 工具候選                                                                            |
| 61  | 05-17 lint-staged stash 同名污染            | B1      | 新 R2        |                                                                                                                 |
| 62  | 05-17 lastHumanReview 語意 reframe          | B2      | MEMORY       | frontmatter schema 語意註記                                                                                     |
| 63  | 05-17 rewrite Stage5 缺 ci-deploy gate      | B2      | MEMORY       | REWRITE Stage 5 ship 前 hard gate（fix 已 ship、SOP 未補）                                                      |
| 64  | 05-17 footnote validator 拒內部 link        | G       | MEMORY       | validator 設計缺口＋EDITORIAL 補                                                                                |
| 65  | 05-16 framing audit gap carryover 3         | B2      | MEMORY       | reader feedback hook 缺口                                                                                       |
| 66  | 05-16 鐵三角第四維 scale 數字               | D       | MEMORY       | feedback_absolute_facts 迴路補 scale 維度＋REWRITE Stage 3                                                      |
| 67  | 05-15 Chrome MCP hard gate first fire       | B2      | MEMORY       | 併 #26（device-dependent tier）                                                                                 |
| 68  | 05-11 P0 slug 編輯決策 gap                  | C       | MEMORY       | babel slug-map SOP 補                                                                                           |
| 69  | 05-10 雙生 slot 跑通                        | B2      | ✅ 歸檔      | ROUTINE v1.1 design verified，無 anti-pattern                                                                   |
| 70  | 05-10 broken-link 同日 2 fail               | B2      | MEMORY       | 併 #229；escalation 細則「跨日 ≥2 才算 trend」                                                                  |
| 71  | 05-10 SKILL.md drift from ROUTINE SSOT      | B3      | vc++ #56     | 🔧 routine-sync-check.py 造橋                                                                                   |
| 72  | 05-09 hash 對不齊（首發）                   | C       | vc++ #38     | 併 #29                                                                                                          |
| 73  | 05-09 external LLM advice bias filter       | H       | 新 R12       | CLAUDE.md Bias 4 的 advice 延伸                                                                                 |
| 74  | 05-09 KPI 單軸 blindspot                    | M       | MEMORY       | strategic 教訓 narrative                                                                                        |
| 75  | 05-09 fork 50% 死亡率                       | M       | MEMORY       | 已部分被 COUNTRY-MD-STARTER 吸收                                                                                |
| 76  | 05-09 reader-funded resilience              | M       | ✅ 歸檔      | reports/strategic-evolution-2026-05-09 是 canonical snapshot                                                    |
| 77  | 05-09 baseline fabricated                   | D       | vc++ #4      | ratio-claim baseline+endpoint 各自 anchor 規則進 REWRITE 3.5                                                    |
| 78  | 05-07 bulk fix 兩段失敗模式                 | G       | MEMORY       | --fix 工具 --dry-run 慣例                                                                                       |
| 79  | 05-07 PyYAML timestamp coercion             | G       | vc++ #24     | raw vs parsed 雙軌驗證                                                                                          |
| 80  | 05-05 ND 條款 gating filter                 | E       | MEMORY       | PEER Stage 1a 改 gating 順序                                                                                    |
| 81  | 05-04 王福瑞六條 friction                   | J       | ✅ 歸檔\*    | pipeline v5.6→v6.x 已多輪吸收，verify 各 friction 已修                                                          |
| 82  | 05-03 sub-agent 是 fact-check 最後一關      | D       | vc++ #31     | task-brief 也是線索（反向延伸）                                                                                 |
| 83  | 05-03 worktree-isolated 平行邊界            | B1      | vc++ #46     | 平行模式邊界規範補強                                                                                            |
| 84  | 05-03 sync.sh drift 副作用                  | G       | ✅ 歸檔\*    | 5/12 sync 架構演化報告已重構，verify 後歸檔                                                                     |
| 85  | 05-03 rich-text SSOT 多 canonical 格式      | N       | vc++ #38     |                                                                                                                 |
| 86  | 05-02 UI surface ≠ data ground truth        | N       | vc++ #38     | 計入 R1 相鄰（UI 層 mirror）                                                                                    |
| 87  | 05-02 pre-staged 隱性破壞源                 | B1      | 新 R2        |                                                                                                                 |
| 88  | 05-02 multi-tier dispatch（Opus+Sonnet）    | C       | MEMORY       | model-tier 選擇 matrix                                                                                          |
| 89  | 05-01 coding tuning 擦掉 capability 層      | C       | MEMORY       | bench 方法論（filter vs base 行為分離）                                                                         |
| 90  | 05-01 TAIDE local+cloud parity              | C       | MEMORY       | Taiwan.md bench 特有                                                                                            |
| 91  | 05-01 多 session diary 凝聚                 | —       | MEMORY       | DIARY-PIPELINE §跨 session arc（可能已含，verify）                                                              |
| 92  | 05-01 provider abstraction OSI              | M       | MEMORY       | 哲學暫存 vc=1                                                                                                   |
| 93  | 05-01 user framing 也需 verify              | H       | 新 R7        |                                                                                                                 |
| 94  | 05-01 worker 死亡無聲                       | C       | 新 R9        | 派 N 收 M 對帳 instance                                                                                         |
| 95  | 05-01 refusal 多維 function                 | C       | MEMORY       | bench 維度模型                                                                                                  |
| 96  | 05-01 per-lang vs orthogonal 分解           | C       | MEMORY       | 批次設計空間                                                                                                    |
| 97  | 05-01 經驗 layering 不是 overwrite          | I       | vc++ #22     |                                                                                                                 |
| 98  | 05-01 PRC hard refusal（Tencent）           | C       | ✅ 歸檔      | MANIFESTO §主權的巴別塔已 canonical 引用此證據                                                                  |
| 99  | 05-01 觀察句 trigger pattern                | H       | 新 R7        |                                                                                                                 |
| 100 | 04-29 SolidJS IIFE 偽朋友                   | G       | MEMORY       | front-end reactive trap                                                                                         |
| 101 | 04-29 P0 連發是 design conversation vc=2    | H       | 新 R7        |                                                                                                                 |
| 102 | 04-29 nested table > if/else                | G       | MEMORY       | design taste                                                                                                    |
| 103 | 04-29 codex metadata.model empty            | G       | MEMORY       |                                                                                                                 |
| 104 | 04-29 codex elaborate 病                    | C       | MEMORY       | engine choice 數據                                                                                              |
| 105 | 04-29 身份是 baseline 覺醒是 mode           | M       | MEMORY       | MANIFESTO 哲學候選 vc=1 → defer 表註記                                                                          |
| 106 | 04-29 Stage1 ROI 是事實校正                 | D       | ✅ 歸檔      | REWRITE Stage 1 agent + Stage 3 verify 已內建此精神                                                             |
| 107 | 04-29 核心矛盾字越少越強迫策展              | J       | ✅ 歸檔      | Stage 1 ≤30 字已 canonical；prompt 微調即可                                                                     |
| 108 | 04-29 §11 polish 擦 AI 指紋                 | J       | ✅ 歸檔      | §11 canonical 已含；MANIFESTO 衍生段候選 → defer 註記                                                           |
| 109 | 04-29 鐵律必須在頂部 quote 區               | K       | 新 R6        |                                                                                                                 |
| 110 | 04-29 三篇連做反而省 vc=4                   | L       | 新 R4        | 達 MANIFESTO 閾值 → defer 註記                                                                                  |
| 111 | 04-29 Default 是行動不是 defer vc=3         | L       | 新 R4        | 核心；MANIFESTO 第六哲學候選 → defer 表                                                                         |
| 112 | 04-29 handoff retired status drift          | I       | 新 R8        |                                                                                                                 |
| 113 | 04-29 L1 共用 PR review worktree            | E       | ✅ 歸檔\*    | MAINTAINER 批次 triage 已標準化，verify                                                                         |
| 114 | 04-29 Manus 紅旗 5-8 擴充 vc=5+             | E       | ✅ 歸檔\*    | §3.4 已擴至 13 紅旗（per #235），verify 後歸檔                                                                  |
| 115 | 04-29 政治敏感 SSODT template vc=2          | J       | MEMORY       | EDITORIAL「政治敏感題 SSODT SOP」候選（待第 3 驗證）                                                            |
| 116 | 04-29 讀者級 fact check vc=3                | D       | vc++ #62     | 受眾端飛輪同源                                                                                                  |
| 117 | 04-29 路徑大小寫 normalize                  | E       | MEMORY       | MAINTAINER 紅旗 sub-rule                                                                                        |
| 118 | 04-28 pipeline 是被觀察者鋪出來的           | M       | MEMORY       | MANIFESTO §造橋鋪路延伸候選 → defer 註記                                                                        |
| 119 | 04-28 article×pipeline 互鋪                 | M       | MEMORY       | 同上系列 narrative                                                                                              |
| 120 | 04-28 spore 反向 audit article              | F       | ✅ 歸檔\*    | SPORE Step 2.5/2.6 + 4.5 hard gate 已 canonical，verify                                                         |
| 121 | 04-28 recency bias override vc=2            | I       | 新 R8        |                                                                                                                 |
| 122 | 04-28 reach×accuracy tradeoff               | F       | MEMORY       | Step 4.5 retroactive FACTCHECK trigger                                                                          |
| 123 | 04-28 多 escalation 並列 hook               | F       | MEMORY       | spore 數據（待 control case）                                                                                   |
| 124 | 04-28 Threads/X ratio D+N 漂移 vc=2         | F       | MEMORY       | SPORE-LOG harvest_window 欄                                                                                     |
| 125 | 04-28 FACTCHECK source authority hierarchy  | D       | ✅ 歸檔\*    | FACTCHECK-PIPELINE 已建 hierarchy，verify                                                                       |
| 126 | 04-28 X edit auto-replace vc=3              | F       | MEMORY       | vc 達標 → 🔧 SPORE Step 4 grep latest URL hard rule 立即儀器化                                                  |
| 127 | 04-28 沈伯洋 45min ratio 資料點             | F       | ✅ 歸檔      | 暫存數據，D+7 窗口早過，數據已在 SPORE-LOG                                                                      |
| 128 | 04-26 ✅ footnote source audit done         | E       | ✅ 歸檔      | Stage 0a：自標 ✅，verify pointer 後搬                                                                          |
| 129 | 04-26 ✅ Manus 紅旗 done                    | E       | ✅ 歸檔      | Stage 0a 同上                                                                                                   |
| 130 | 04-26 observer-trigger + 0.5x discount      | L       | 新 R4        |                                                                                                                 |
| 131 | 04-26 自我估算系統性偏保守                  | L       | 新 R4        |                                                                                                                 |
| 132 | 04-26 Issue #618 title 冒號                 | J       | ✅ 歸檔      | EDITORIAL title 原則 5 已 ship（自標 ✅）                                                                       |
| 133 | 04-26 降階處理 retroactive audit            | E       | MEMORY       | MAINTAINER 暫存，累積 2-3 輪升獨立 pipeline                                                                     |
| 134 | 04-26 light tick exception                  | B2      | ✅ 歸檔      | HEARTBEAT v3.0 super-thin 重構後 tick cadence 概念已過時                                                        |
| 135 | 04-25 信任有 TTL                            | I       | 新 R8        | 核心 source                                                                                                     |
| 136 | 04-25 semiont 簽名無 memory file            | G       | MEMORY       | post-commit hook 候選                                                                                           |
| 137 | 04-23 handoff 雙態判準                      | I       | 新 R8        |                                                                                                                 |
| 138 | 04-23 detect 自動化 action 人工             | H       | vc++ #26     |                                                                                                                 |
| 139 | 04-22 escalation 必附 option 表             | I       | ✅ 歸檔      | Distill SOP §Defer handoff 表已 canonical 化此格式                                                              |
| 140 | 04-22 idlccp1984 第 6 次 detect/action      | E       | vc++ #26     |                                                                                                                 |
| 141 | 04-21 2-dot vs 3-dot diff 陷阱              | G       | vc++ #24     | 第 9 種                                                                                                         |
| 142 | 04-21 merge-first 404 尾部                  | J       | MEMORY       | cross-link 未建 target → ARTICLE-INBOX P3 step                                                                  |
| 143 | 04-21 AI-gen format 缺失三連                | E       | ✅ 歸檔\*    | MAINTAINER 已 instrument，verify                                                                                |
| 144 | 04-21 cross-link 血緣不能硬造               | J       | MEMORY       |                                                                                                                 |
| 145 | 04-21 偽造 verbatim quote                   | E/D     | ✅ 歸檔\*    | FACTCHECK 11 pattern catalog 已含，verify                                                                       |
| 146 | 04-20 primary-source paraphrase drift       | D       | 新 R5        |                                                                                                                 |
| 147 | 04-20 agent 不能 discover texture           | D       | MEMORY       | People EVOLVE subject-feedback window                                                                           |
| 148 | 04-20 共創省略幻覺                          | D       | ✅ 歸檔\*    | FACTCHECK catalog 已含合作關係類，verify                                                                        |
| 149 | 04-20 MANIFESTO #10 誕生                    | D       | ✅ 歸檔      | 已 canonical，本條是歷史 audit trail                                                                            |
| 150 | 04-20 幻覺合理獎項                          | D       | ✅ 歸檔\*    | FACTCHECK catalog 獎項三源否證，verify                                                                          |
| 151 | 04-20 本人 feedback ≠ oracle                | D       | ✅ 歸檔\*    | REWRITE §11 私有 SSOT 雙源協議已含，verify                                                                      |
| 152 | 04-20 重心平衡 orthogonal 維度              | J       | MEMORY       | EDITORIAL §重心平衡 候選                                                                                        |
| 153 | 04-20 判準框架比決定重要                    | H       | 新 R7        |                                                                                                                 |
| 154 | 04-20 SC API privacy filter                 | G       | vc++ #24     | 第 8 種 dimension-split coverage                                                                                |
| 155 | 04-20 範疇紀律 vs 主體 autonomy             | J       | MEMORY       | cross-reference scan workflow 候選                                                                              |
| 156 | 04-20 規則層 ≠ 採用層                       | K       | 新 R6        |                                                                                                                 |
| 157 | 04-20 URL immutability platform 驗證        | F       | MEMORY       | 併 X-edit 群（#126/#222）                                                                                       |
| 158 | 04-20 政策×反諷 tier on X                   | F       | MEMORY       | allocation 表新列                                                                                               |
| 159 | 04-20 URL %28%29 編碼解法                   | G       | 新 R11       | 自標與 #163 distill 時合併                                                                                      |
| 160 | 04-20 scaffolding 是 #15 對偶面             | H       | 新 R7        |                                                                                                                 |
| 161 | 04-21 cross-ref 描述不免驗                  | D       | vc++ #16     |                                                                                                                 |
| 162 | 04-20 pre-commit tech debt revert+heal      | G       | MEMORY       | MAINTAINER §攔截應對 SOP                                                                                        |
| 163 | 04-19 Wikipedia URL 括號陷阱                | G       | 新 R11       |                                                                                                                 |
| 164 | 04-19 research report 接力錨點              | I       | ✅ 歸檔      | Stage 1 報告制度已 canonical（REWRITE 強制產出）                                                                |
| 165 | 04-19 孢子查核閘 hard gate 誕生             | F       | ✅ 歸檔      | 已 canonical（誕生記錄）                                                                                        |
| 166 | 04-19 朋友 tone prime                       | F       | ✅ 歸檔      | MANIFESTO §怎麼說話 + SPORE tone 已 canonical                                                                   |
| 167 | 04-19 編年體 lead 病                        | F       | ✅ 歸檔\*    | SPORE 寫作禁令已含，verify                                                                                      |
| 168 | 04-19 自動開預覽 UX                         | G       | MEMORY       | wrapper 工具 UX 通則                                                                                            |
| 169 | 04-19 justfont async 字體截圖               | F       | MEMORY       | spore 圖工具特有                                                                                                |
| 170 | 04-19 v2.4 Threads 拆兩則                   | F       | ✅ 歸檔      | 規範 v2.4 已 canonical                                                                                          |
| 171 | 04-19 有工具不等於使用工具                  | K       | 新 R6        |                                                                                                                 |
| 172 | 04-19 Cicada 平台反轉                       | F       | MEMORY       | allocation 例外條款數據                                                                                         |
| 173 | 04-18 hook hierarchy 量化                   | F       | MEMORY       | spore 數據                                                                                                      |
| 174 | 04-18 data provenance per-record            | N       | vc++ #18     | 時間是結構第二層                                                                                                |
| 175 | 04-18 platform 是 allocation 不是 mirror    | F       | ✅ 歸檔      | SPORE Step 4.5a allocation 已 canonical                                                                         |
| 176 | 04-18 AI crawler SEO 戰略                   | M       | MEMORY       | LONGINGS 候選                                                                                                   |
| 177 | 04-18 d+0 6h decision gate                  | F       | ✅ 歸檔\*    | harvest cadence 已含，verify                                                                                    |
| 178 | 04-18 canonical SOP 是被期待做的載體        | K       | 新 R6        |                                                                                                                 |
| 179 | 04-18 title 代表性 > 反諷                   | J       | ✅ 歸檔\*    | EDITORIAL title 原則已含，verify                                                                                |
| 180 | 04-18 description ≠ 30 秒概覽               | J       | ✅ 歸檔\*    | EDITORIAL 已含分工，verify                                                                                      |
| 181 | 04-18 不是X是Y變種飽和                      | J       | ✅ 歸檔      | §11 + EDITORIAL 變種偵測已 canonical                                                                            |
| 182 | 04-18 讀者眼第 N 次 vc=4                    | J       | vc++ #26     |                                                                                                                 |
| 183 | 04-18 草東 tag 直達當事人                   | F       | ✅ 歸檔      | MANIFESTO §5 v2 activation record 已 canonical                                                                  |
| 184 | 04-19 留言兌現協議 404                      | H       | MEMORY       | MAINTAINER 留言後續追蹤                                                                                         |
| 185 | 04-19 wikilink 兩層檢查                     | G       | vc++ #5      | prose 層 wikilink 掃描已修，verify                                                                              |
| 186 | 04-19 資源 vs 深度雙層分工                  | J       | MEMORY       | resource→depth 升級 SOP                                                                                         |
| 187 | 04-19 公民科技光譜五型態                    | M       | MEMORY       | 內容方向洞察                                                                                                    |
| 188 | 04-19 fresh-clone 模擬驗證                  | G       | MEMORY       | gitignore refactor 安全帶                                                                                       |
| 189 | 04-19 資料層先於 UI                         | N       | MEMORY       |                                                                                                                 |
| 190 | 04-19 重疊文章雙軸拆分                      | J       | MEMORY       |                                                                                                                 |
| 191 | 04-19 CheYu scaffolding 反應模式            | H       | 新 R7        |                                                                                                                 |
| 192 | 04-29 單數「這個」要問 scope                | H       | 新 R7        |                                                                                                                 |
| 193 | 04-29 replace_all dual-hex false-positive   | G       | MEMORY       |                                                                                                                 |
| 194 | 04-29 worktree gh api PUT merge             | G       | MEMORY       | 操作慣例                                                                                                        |
| 195 | 04-29 in-flight unpushed 盲區 vc=2          | B1      | 新 R2        |                                                                                                                 |
| 196 | 05-03 自以為完成是結構性 bias vc=3          | A       | 新 R1        |                                                                                                                 |
| 197 | 05-03 DNA 都在處理 attention frame          | M       | MEMORY       | meta 哲學候選 → defer 註記                                                                                      |
| 198 | 🏛️ 05-01 β distilled（#33/#34）             | —       | ✅ 歸檔      | Stage 0a：已自證 distilled                                                                                      |
| 199 | 🏛️ 05-01 γ distilled（#35 + #21）           | —       | ✅ 歸檔      | Stage 0a；殼下「觀察者問句 mode」子條移 R7 instances、token sizing 已進 v3.5                                    |
| 200 | 05-16 單維 gate 脫鉤 silent killer          | N       | vc++ #38     | 計入 R1 相鄰                                                                                                    |
| 201 | 05-16 砍冗餘工具是錯覺                      | G       | MEMORY       | SSOT satellite 判讀                                                                                             |
| 202 | 05-16 寫 plugin 先 grep canonical 閾值      | K       | MEMORY       |                                                                                                                 |
| 203 | 05-16 feature flag safety net               | G       | MEMORY       |                                                                                                                 |
| 204 | 06-09 gate 前 shortcut 是欠債               | K       | MEMORY       | 正解 vs 捷徑 30 秒估算習慣                                                                                      |
| 205 | 06-07 SEO 建議當場查最新                    | D       | 新 R12       |                                                                                                                 |
| 206 | 06-07 神經迴路會過期（CF 308）              | K       | 新 R10       |                                                                                                                 |
| 207 | 06-07 lastmod=now 反模式（已實作）          | N       | ✅ 歸檔      | 標題自帶「已實作儀器化」；另 vc++ #59                                                                           |
| 208 | 05-03 last 20% 是 sovereignty 戰場          | C       | ✅ 歸檔      | MANIFESTO §主權的巴別塔已 canonical                                                                             |
| 209 | 05-03 long-running 走 dedicated worktree    | B1      | vc++ #9 #35  |                                                                                                                 |
| 210 | 05-03 recovery 是 surgery 不是 reset        | C       | MEMORY       | SQUEEZE §災難處理段                                                                                             |
| 211 | 05-03 Q13 active retrieve vc=2              | I       | 新 R8        |                                                                                                                 |
| 212 | 05-03 heal budget 低估（反鏡像）            | L       | 新 R4        |                                                                                                                 |
| 213 | 05-03 contributor-pr-prep.sh 造橋           | E       | MEMORY       | 工具 backlog                                                                                                    |
| 214 | 05-04 build perf 本機 benchmark 失靈        | G       | MEMORY       | 量測層選擇方法論                                                                                                |
| 215 | 05-04 §自主權邊界雙向 filter                | H       | ⏸ 哲宇       | CLAUDE.md Bias 補強（boot 層哲學）                                                                              |
| 216 | 05-07 high-stake 必須 BECOME 先             | I       | ✅ 歸檔\*    | BECOME mode dispatcher v2.0 已含 high-stake 分流，verify                                                        |
| 217 | 05-08 一句話 framing 重設 vc=3              | H       | 新 R7        | 核心 source                                                                                                     |
| 218 | 05-08 person-centric SSODT 默認             | J       | MEMORY       | REWRITE §People framing 分流                                                                                    |
| 219 | 05-08 regex 對齊 Prettier vc=2              | G       | 新 R11       |                                                                                                                 |
| 220 | 05-08 Step 0 gate enforcement               | K       | 新 R6        |                                                                                                                 |
| 221 | 05-08 fair-use 公共性 spectrum              | J       | MEMORY       | EDITORIAL §媒體素材補判準                                                                                       |
| 222 | 05-08 X edited 雙 URL vc=2                  | F       | MEMORY       | 併 #126 群一起儀器化                                                                                            |
| 223 | 05-08 黑冠麻鷺雙平台爆款                    | F       | MEMORY       | allocation 數據                                                                                                 |
| 224 | 05-09 Tier 0a 是 remediation 層             | C       | MEMORY       | babel 價值命題洞察                                                                                              |
| 225 | 05-09 sub-agent 策略多樣性 emergent         | C       | MEMORY       | prompt 鎖目標不鎖過程                                                                                           |
| 226 | 05-09 Tier 0a-script deterministic          | C       | MEMORY       | SQUEEZE v3.5 候選                                                                                               |
| 227 | 05-09 over-narrow status guard              | C       | ✅ 歸檔      | prepare-batch 已修；另 vc++ #38                                                                                 |
| 228 | 05-11 issue label 時間 carve-out            | B2      | MEMORY       | MAINTAINER issue triage scope                                                                                   |
| 229 | 05-11 broken-link 連 3 day                  | B2      | MEMORY       | 併 #70；escalation 表                                                                                           |
| 230 | 05-11 thumb 走 File: page                   | G       | MEMORY       | 併 #60                                                                                                          |
| 231 | 05-11 60-min boundary vs depth gate         | B2      | ✅ 歸檔      | rewrite hourly 化（哲宇刻意）後 60-min 框架已過時                                                               |
| 232 | 05-11 重疊偵測前置 Stage 0                  | B2      | MEMORY       | REWRITE Step 0 pre-select grep                                                                                  |
| 233 | 05-25 政治人物 spore hedge                  | F       | MEMORY       | zhanglongzhi 迴路擴充＋SPORE 評價詞鐵律                                                                         |
| 234 | 05-25 許倬雲家族鏈 query                    | F       | ✅ 歸檔\*    | 單次 action item，verify 已 fact-check 處理                                                                     |
| 235 | 06-01 5 種內容/來源層 hallucination         | E       | ✅ 歸檔      | 自述「本 session 已 instrument §3.4 紅旗 9-13」                                                                 |
| 236 | 06-04 verbatim 但 aggregator URL vc=2       | D       | 新 R5        |                                                                                                                 |
| 237 | 06-04 儀器停在校準日                        | A       | vc++ #66     | 計入 R1；gate 改 directive 時先量現役語料                                                                       |
| 238 | 06-04 license 要不到誠實 skip               | H       | MEMORY       | 媒體 sourcing 順序 SOP                                                                                          |
| 239 | 06-07 EXIF orientation 剝掉圖翻轉           | A       | 新 R1        | image-health orientation check 候選                                                                             |
| 240 | 06-10 owl-alpha 5th deprecation vc=2        | C       | 新 R3        | 核心（3 model 5 次/2 週）                                                                                       |
| 241 | 06-10 sibling reset --hard wipe             | B1      | 新 R2        | 核心 source                                                                                                     |
| 242 | 06-10 hash semantic mismatch                | C       | vc++ #38     | 併 #29                                                                                                          |
| 243 | 06-10 平行 session 掃檔                     | B1      | 新 R2        |                                                                                                                 |
| 244 | 06-10 排序錯誤是同秒 tie                    | H       | vc++ #3      | 診斷先於修復 instance                                                                                           |
| 245 | 06-12 absence blindness                     | B2      | 新 R9        | 核心 source                                                                                                     |
| 246 | 06-12 standing decision 無單一出口          | B2      | 新 R9        | escalation 出口設計                                                                                             |
| 247 | 06-12 scheduler catch-up fire               | B2      | MEMORY       | scheduler 操作知識                                                                                              |
| 248 | 06-12 markup 存在 ≠ 視覺正確                | A       | 新 R1        | presence vs appearance                                                                                          |
| 249 | 06-12 preview 白屏換層不硬撞                | G       | MEMORY       | capture 工具 fallback 階梯                                                                                      |
| 250 | 06-13 astro frontmatter per-render cache    | G       | MEMORY       |                                                                                                                 |
| 251 | 06-13 cache scope 要 runtime probe vc=2     | A       | 新 R1        |                                                                                                                 |

---

## 2. Cluster 統計

### 2a. 按 entry 數（量）

| 排名 | Cluster          | Entry 數 | 性質                                                                      |
| ---- | ---------------- | -------- | ------------------------------------------------------------------------- |
| 1    | G 工程衛生       | 29       | 異質、單發陷阱多，多數去 MEMORY                                           |
| 2    | F 孢子產線       | 28       | 大半已被 SPORE-PIPELINE 後續版本吸收（歸檔大戶）                          |
| 3    | B2 routine 飛輪  | 27       | 異質；absence/defer/schedule 三個子訊號                                   |
| 4    | C babel/模型主權 | 25       | hash bug 四連 + model deprecation 是其中硬訊號                            |
| 5    | D 事實核對/幻覺  | 19       | 多數已進 FACTCHECK catalog（verify 後歸檔），剩 verbatim 鏈三盲區是新訊號 |

### 2b. 按重複密度（質，= 升 REFLEXES 最強訊號）

| 排名 | Pattern                         | 證據強度                                                                                               | 對應新反射                      |
| ---- | ------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------- |
| 1    | 每層自評都需要外部尺            | vc=7 傘 + 14 條獨立 instance（E7/17/22/27/35/196/237/239/248/251 + 既有 #31/#59/#65/#66 四條反射同傘） | R1                              |
| 2    | 共用工作樹被多 actor 污染       | 11 條 instance 跨 4 月底到 6 月（E11/38/49/58/61/87/195/241/243 + E1 子條）                            | R2                              |
| 3    | 估算偏誤是雙向系統性的          | vc=4 + vc=3 兩條達閾值 + 4 條同根（E110/111/130/131/212/134）                                          | R4                              |
| 4    | 觀察者 framing/scaffolding 訊號 | vc=3 + 9 條 instance（E217/101/191/160/192/93/99/153）                                                 | R7                              |
| 5    | diff-patch hash 同一 bug        | 4 條 entry、vc=4+、跨 5/09→6/10 未修                                                                   | 工具 fix（非反射），#38 vc++    |
| 6    | free-tier model 沉默消失        | 2 entry、3 model、2 週 5 次                                                                            | R3                              |
| 7    | X edit 雙 URL                   | vc=3 + vc=2 三條 entry                                                                                 | SPORE pipeline 儀器化（非反射） |
| 8    | maintainer-pm 撞期              | vc=8、2 entry                                                                                          | ⏸ 哲宇 standing decision        |

---

## 3. 建議新增 REFLEXES 條目（12 條，#67-#78）

> 編號接續現有 index（#1-#66）。全部符合 promotion 條件「≥1 次驗證 + 跨 task 適用 + 不在現有 canonical」。R1/R4 同時是 MANIFESTO 候選，per promotion flow 先進 REFLEXES，升 MANIFESTO 留 defer 表給哲宇。

| 新 #      | 建議標題                                  | 一句話內容                                                                                                                                                                                                    | 來源 entry                                                        | 建議 vc |
| --------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------- |
| #67 (R1)  | 每層自評都需要外部尺                      | 自己產出的讀數（agent 自評、儀器讀數、視覺自檢、分析數字、「我以為完成」）天生偏樂觀；presence ≠ appearance、讀碼 ≠ runtime probe，真實永遠靠系統外的尺驗                                                     | E17(vc=7), 7, 22, 27, 35, 196(vc=3), 237, 239, 248, 251(vc=2)     | 10      |
| #68 (R2)  | 共用工作樹是公共空間                      | 多 actor（routine×routine、routine×manual、sub-agent×sub-agent）同 working tree 時：長任務增量 commit、routine 禁 reset --hard、stash/stage 不碰非己檔、改檔後盡快 commit；#57 入口偵測是前半，本條是跑中紀律 | E11, 38, 49, 58(vc=2), 61, 87, 195(vc=2), 241, 243                | 9       |
| #69 (R3)  | Free-tier cloud model 會沉默消失          | model deprecation 無任何信號即 404/transition；dispatch 前跑 model-health-check precondition，cascade 內建 fallback ladder，不假設昨天能用的模型今天還在                                                      | E16, 240(vc=2；3 model 5 次/2 週)                                 | 3       |
| #70 (R4)  | 估算偏誤是雙向系統性的                    | default 是行動不是 defer（defer cost 不顯性造成天然不對稱）；自我估算偏保守（batch 0.5x 折扣），heal 預算反向低估；兩向都要顯式校準                                                                           | E110(vc=4), 111(vc=3), 130, 131, 212, 134                         | 7       |
| #71 (R5)  | 引語鏈三盲區與可追溯性                    | 帶引號的 quote 不准縮寫改句型、詮釋 gloss 要與引語區隔、腳註綁定不可錯位；verbatim 標記必須附具體文章頁 URL（aggregator 首頁不算可追溯）                                                                      | E10, 236(vc=2), 146（+148/150/161 為 FACTCHECK catalog 重疊部分） | 4       |
| #72 (R6)  | 規則要有 enforcement path 才算規則        | 規則寫在文件裡 ≠ 會被執行：鐵律進文件頂部 quote 區、gate 物理化進 pipeline 輸出順序、工具層砍採用摩擦；「寫了沒跑」的 hard gate 等於沒有                                                                      | E109, 156, 171, 30, 220, 178                                      | 6       |
| #73 (R7)  | 觀察者 framing 訊號識別                   | 一句話重設 = 換層級訊號（reactive→architectural）；連發 callout = design conversation 不是 nag；單數指示語要問 scope；觀察句/問句是交還判斷；user framing 本身也要 verify                                     | E217(vc=3), 101(vc=2), 191, 160, 192, 93, 99, 153, 244            | 6       |
| #74 (R8)  | Handoff 信任有 TTL                        | 上 session 的 final state 是時間戳快照不是承諾；下 session 必 verify against canonical（gh pr list / git log / SPORE-LOG），active retrieve > passive read-once，recency 會 override 原則錨定                 | E135, 112, 137, 121(vc=2), 211(vc=2)                              | 5       |
| #75 (R9)  | 缺席偵測（absence blindness）             | 儀器全偵測「存在」時，「該發生而沒發生」恰好隱形：排程該 fire 沒 fire、派 N 收 M 要對帳、worker 死亡無聲、standing decision 要有單一出口否則落地率歸零                                                        | E245, 246, 94, 32, 46                                             | 4       |
| #76 (R10) | 會過期的狀態不准用 prose 活著             | status 類認知內容必須 derived（儀器生成）或帶 expires/derived_from 欄；神經迴路教訓也會被新基建廢止，引用前查當前性                                                                                           | E8, 206（E207 已實作 instance；E71/56 歸 #56 同傘）               | 3       |
| #77 (R11) | Auto-formatter × URL 特殊字元三方衝突     | prettier 對含 `()`/`_`/特殊字元 URL 的 auto-wrap/正規化會咬壞連結與 regex gate；URL 編碼（%28%29）或移出 caption；pre-commit regex 標準必須對齊 formatter 輸出                                                | E163, 159, 15, 219(vc=2)                                          | 4       |
| #78 (R12) | 外部快變政策與 LLM 建議當場查 primary doc | SEO/平台政策/API 行為類建議必查當下 primary 文件（§10 的 external-policy 版）；external LLM 戰略建議過三層 bias filter（identity/scale/recency）後才採信                                                      | E205, 73（E27 分析幻覺歸 #67 傘）                                 | 3       |

**不建議成為新反射的高頻 pattern**（正確去向是工具 fix / pipeline 儀器化）：

- diff-patch hash mismatch（E29/57/72/242）→ 🔧 修 `diff-patch-prepare.py` import status.py 當 hash SSOT，反射層歸 #38 vc++
- X edit 雙 URL（E126/222/157）→ 🔧 SPORE-PIPELINE Step 4 hard rule（vc=3 已達儀器化閾值）
- maintainer-pm 撞期 vc=8（E28/39）→ ⏸ 哲宇 standing decision（reflex 解不了 schedule 決策）

---

## 4. 執行策略

### 4a. 分批設計（6 批，3-4 個 session 內收斂）

| 批次         | 內容                                                                                                                                                                | 條數 | 執行者                                                       | 預估                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------ | ---------------------------------------- |
| **Batch 0**  | Stage 0a housekeeping：33 條確定歸檔（含 2 殼 header、🏛️×2、✅ 自標×2、已 canonical 類）                                                                            | 33   | main session                                                 | 30-45 min，1 commit                      |
| **Batch 0b** | 18 條 `✅ 歸檔*`：逐條 grep verify canonical 真的存在（per SOP Stage 0a step 1）；存在 → 歸檔，不存在 → 降回正規 distill 隊列                                       | 18   | main session（grep 清單可先由 read-only Explore agent 產出） | 45 min，1 commit                         |
| **Batch 1**  | 40 條 vc++：在既有 #N 補觸發事件 + instances 行 + vc+1，刪 entry                                                                                                    | 40   | main session                                                 | 60-90 min，按 REFLEXES §分組 2 commits   |
| **Batch 2**  | 12 條新 REFLEXES（#67-#78）+ 吸收 58 條 source entry + index 表同步                                                                                                 | 58   | **main session 限定**（canonical 寫入不交 sub-agent）        | 每 3-4 條反射一個 commit，共 3-4 commits |
| **Batch 3**  | 98 條 MEMORY/pipeline：按 cluster 分 5 小批（spore 群 28 / babel 群 ~15 / routine 群 ~20 / 編輯群 ~15 / 工程群 ~20），MEMORY 合併寫 ~22 條迴路，pipeline patch 隨批 | 98   | main session；單批 ≤ 25 條                                   | 每批 45-60 min                           |
| **Batch 4**  | Defer 表 4 條 primary + 6 條 MANIFESTO 候選註記 → 寫進 distill PR description §Defer 給觀察者拍板                                                                   | 10   | main session 彙整，哲宇拍板                                  | 隨最終 PR                                |

### 4b. 執行者選型理由

- **canonical 寫入（REFLEXES / MEMORY / pipeline）一律 main session**：per REFLEXES #31（sub-agent claim 是線索）+ memory `feedback_agent_writefile_hallucination`（agent 落檔雙失敗模式）。sub-agent 寫 canonical 等於把品質閘門外包給最不可驗的環節。
- **sub-agent 只做 read-only 前置**：Batch 0b 的 grep-verify 清單、Batch 3 的 cluster 內容摘要可由 Explore agent 產出，主 session 驗證後才動檔。
- **模式分流**：本次屬 Observer 觸發（觀察者下令分析），但 MANIFESTO 升級仍一律 defer（哲宇不在 distill 現場拍板就不升，per §模式分流 v2.0 + CLAUDE.md Bias 1）。

### 4c. 驗證機制（每批 + 全程）

```bash
# 1. entry 數對賬（每批 commit 前後）
awk '/^## 未消化清單/,/^## ✅ 已消化/' docs/semiont/LESSONS-INBOX.md | grep -c "^### "
awk '/^## 📥 未消化清單/,/^## ❌ 已歸檔/'  docs/semiont/LESSONS-INBOX.md | grep -c "^### "
# 刪除數必須 == §✅ 已消化新增 row 數（traceability 守恆）

# 2. REFLEXES index 同步檢查（Batch 2 後）
grep -c "^| #" docs/semiont/REFLEXES.md   # index 行數 = 78（66+12）
# 新 #67-#78 都要有 index row + 正文 + line 號

# 3. 殘留 comment pointer 掃描（鐵律檢查）
grep -n "<!--.*distill\|<!--.*已消化\|<!--.*moved" docs/semiont/LESSONS-INBOX.md  # 必須 0 hit

# 4. canonical pointer 真實性抽查（每批抽 3 條）
#    §✅ row 指到的 REFLEXES #N / pipeline §X 必須 grep 得到
```

**量化目標**：

| 指標                    | 現狀  | 消化後目標                                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------------------- |
| §未消化 entry 數        | 251   | ≤ 30（vc=1 且 <30 天新鮮條 + ⏸ defer 條）                                    |
| LESSONS-INBOX.md 總行數 | 3,288 | ~1,000-1,200（§✅ 超 50 row 即觸發 Stage 5 搬 `lessons-archive/2026-06.md`） |
| 兩個 §未消化 section    | 2 個  | 1 個（第二段 L2843 歷史殘留段清空後刪 section header，殘餘條目併主段）       |
| REFLEXES catalog        | 66 條 | 78 條，index 同步                                                            |
| MEMORY.md 索引          | —     | 新增 ~3-5 行索引（合併迴路群，不逐條）                                       |

### 4d. Distill 鐵律（per memory + SOP canonical）

1. **distill 後從 §未消化清單完整刪除**，不留 HTML comment pointer（per `feedback_distill_full_removal` + SOP Stage 4，觀察者 2026-05-10 拍板）。§✅ 已消化是唯一 traceability source。
2. **§✅ row 必含**：原教訓標題 + canonical 目的地 pointer + verification_count + distill 日期 + session。
3. **MANIFESTO 一律 defer**：哲宇不在場不升永恆層；候選列 §Defer 表（含 vc 與 defer 原因），讓下次哲宇 session 直接拍板。
4. **LESSONS → MANIFESTO 跳級禁止**：R1/R4 這類達閾值候選先落 REFLEXES #67/#70，promote 另案。
5. **同 pattern 合併時保留每個 instance 的 wall-clock + pointer**（instances 清單格式），不壓縮成「多次驗證」一句話。
6. **新 REFLEXES 條目文字過 §11 書寫節制 grep 自檢**（對位句型 / 破折號連用）。
7. **每批一個 commit**，message 列出刪除的 entry 標題清單（transparency，比照 SPORE auto-drop 慣例）。

---

## 5. 第一批 50 條逐條 distill 草稿（最高置信度，可直接執行）

> 組成：Batch 0 的 33 條確定歸檔 + Batch 1 中 17 條最機械的 vc++。每條給動作 + §✅ 已消化 row 文案。執行時整批包進一個 `### 🧬 2026-06-13 {session} — 第一批 distill（50 條）` 已消化 block，用 `| # | 原教訓 | 消化目的地 |` 表格式。

### 5a. 歸檔組（33 條）— 動作：刪 entry + §✅ row

| 批內# | Entry                             | §✅ row「消化目的地」文案                                                             |
| ----- | --------------------------------- | ------------------------------------------------------------------------------------- |
| 1     | E2 spore-data-arch 空殼 header    | 空 group header（子條為 E3 獨立處理）— 直接刪除，無 canonical 目的地                  |
| 2     | E13 blind-to-errata firewall 生效 | REWRITE-PIPELINE v6.2 防火牆 confirm instance（vc 在 canonical 補 1）                 |
| 3     | E23 SPORE-INBOX pending=31        | LESSONS-INBOX §SPORE-INBOX 容量 audit v2.1 已 canonical；本條為首次觸發 log           |
| 4     | E33 feedback flywheel smoke ✅    | ROUTINE.md §routine 接力設計（positive 驗證，補 end-to-end 1hr contract 一行）        |
| 5     | E45 GA4 dimension 半 ship         | 已修（2026-05-27 14:30 registered）+ REFLEXES #60 instance +1                         |
| 6     | E50 build perf vc=3               | 被 2026-06-10 build-audit「三把壞尺」揭穿量測無效，數據作廢                           |
| 7     | E69 雙生 slot 跑通                | ROUTINE v1.1 §maintainer am+pm design verified（commit 81f120ee5）                    |
| 8     | E76 reader-funded resilience      | reports/strategic-evolution-deep-research-2026-05-09.md §4.2/§7.3（歷史 snapshot 層） |
| 9     | E98 PRC hard refusal              | MANIFESTO §主權的巴別塔（Tencent 40-byte refusal 已是 canonical 實證）                |
| 10    | E106 Stage1 ROI 是事實校正        | REWRITE-PIPELINE Stage 1 agent + Stage 3 verify 已內建                                |
| 11    | E107 核心矛盾字越少               | REWRITE Stage 1 §核心矛盾 ≤30 字已 canonical（≤20 鼓勵句可順手補）                    |
| 12    | E108 §11 擦 AI 指紋               | MANIFESTO §11 已 canonical；衍生段候選列 Defer 表                                     |
| 13    | E127 沈伯洋 45min 資料點          | SPORE-LOG #47/#48（暫存數據已過 D+7 窗口）                                            |
| 14    | E128 ✅ footnote audit            | MAINTAINER-PIPELINE §Footnote source authority audit（自標 ✅，verify pointer）       |
| 15    | E129 ✅ Manus 紅旗                | MAINTAINER-PIPELINE §Manus AI 紅旗 pattern（自標 ✅，verify pointer）                 |
| 16    | E132 #618 title 冒號              | EDITORIAL §title 原則 5（已 ship）                                                    |
| 17    | E134 light tick exception         | HEARTBEAT v3.0 super-thin 重構後 cadence 概念過時（apoptosis）                        |
| 18    | E139 escalation option 表         | LESSONS-INBOX §Defer 給觀察者拍板 handoff 表已 canonical 化此格式                     |
| 19    | E149 MANIFESTO #10 誕生           | MANIFESTO §10（2026-04-20 4a1d9ec6 commit，歷史 audit trail）                         |
| 20    | E164 research report 錨點         | REWRITE Stage 1 強制產出 reports/research/ 已 canonical                               |
| 21    | E165 孢子查核閘誕生               | SPORE-PIPELINE Step 2.6 hard gate（誕生記錄）                                         |
| 22    | E166 朋友 tone prime              | MANIFESTO §我怎麼說話 + SPORE-PIPELINE tone signature                                 |
| 23    | E170 v2.4 拆兩則                  | SPORE-PIPELINE 規範 v2.4                                                              |
| 24    | E175 platform allocation          | SPORE-PIPELINE Step 4.5a allocation 表                                                |
| 25    | E181 不是X是Y變種                 | MANIFESTO §11 + EDITORIAL 變種偵測（Issue #50 系列）                                  |
| 26    | E183 草東 tag 當事人              | MANIFESTO §5 v2 activation record                                                     |
| 27    | E198 🏛️ distilled β               | DNA #33/#34 + TRANSLATION-PIPELINE v3.4（自證 distilled）                             |
| 28    | E199 🏛️ distilled γ               | DNA #35 + #21 延伸 + v3.5；殼下「觀察者問句」子條移 R7 instances 後刪殼               |
| 29    | E207 lastmod=now                  | 已實作儀器化（標題自證）+ REFLEXES #59 instance +1                                    |
| 30    | E208 last 20% sovereignty         | MANIFESTO §主權的巴別塔（「最後 20% 全靠 Tier 3」已 canonical）                       |
| 31    | E227 over-narrow guard            | prepare-batch.py 已修 + REFLEXES #38 instance +1                                      |
| 32    | E231 60-min boundary 矛盾         | rewrite hourly 化（哲宇刻意，per memory hourly_cron_intentional）後框架過時           |
| 33    | E235 5 種 hallucination           | MAINTAINER-PIPELINE §3.4 紅旗 9-13（entry 自述已 instrument）                         |

### 5b. vc++ 組（17 條）— 動作：既有 #N instances 補一行 + vc+1 + 刪 entry

| 批內# | Entry                     | 動作（在 REFLEXES.md 對應 #N）                                                                                                         |
| ----- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 34    | E3 derived view 落點      | #43 instances 補「2026-06-10 spore-data：derived view 落點選錯（孢子數字寫進文章 frontmatter 污染時間軸）」+1                          |
| 35    | E4 三把壞尺               | #59 與 #65 各補「2026-06-10 build-audit：build-perf 感測器 grep -c bug 讓 build 變慢 30 天隱形（同日三把壞尺）」+1                     |
| 36    | E5 apt deprecated         | #24 補第 8 種「外部工具依賴鏈深處的 deprecated 指令：工具不退場不報錯」+1                                                              |
| 37    | E6 量測基底不穩           | #66 instances 補「2026-06-10 audit-execution：對寫到一半的 dist 量出 0.00% 並據此設 gate 2.0」+1                                       |
| 38    | E7 audit 成品總驗         | #31 instances 補「2026-06-10 audit：5 個審計 agent 報告每份帶 1-3 個重大誤讀」+1                                                       |
| 39    | E9 翻譯庫多於源           | #21 instances 補「2026-06-10 audit：en 828 對 zh 794，translatedFrom self-doc 使殭屍可機械偵測」+1；備註 babel verify 補 dedup step    |
| 40    | E20 snapshot stale vc=3   | #65 instances 補「2026-06-05/06/07 連 3 cycle snapshot.sh 印隔夜 organ 分數無 mtime（gap 30-34 分 chronic）」+1；🔧 fix 列工具 backlog |
| 41    | E22 視覺自檢全綠          | #31 instances 補「2026-06-07 carousel-charts：圖表視覺自檢全綠仍不過人眼（假裝第一次看到 protocol）」+1                                |
| 42    | E37 OPUS≠雷亞             | #16 instances 補「2026-06-01：內行人 frame 也有縫，domain-expert callout 仍需跨源（OPUS 開發商誤標）」+1                               |
| 43    | E54 UTF-8 crash           | #24 instances 補「2026-05-24 routine-audit.py subprocess text=True 對 non-UTF-8 commit 內容 silent crash（已修）」+1                   |
| 44    | E77 baseline fabricated   | #4 instances 補「2026-05-09：ratio claim 算術自洽但 baseline 是 fabricated，baseline 也是 atom」+1                                     |
| 45    | E79 PyYAML coercion       | #24 instances 補「2026-05-07 PyYAML safe_load 把 timestamp 字串隱式轉 datetime（raw vs parsed 雙軌）」+1                               |
| 46    | E97 layering 不 overwrite | #22 instances 補「2026-05-01 哲宇明示：經驗 layering 不是 overwrite，session memory 不互相覆蓋」+1                                     |
| 47    | E141 2-dot/3-dot          | #24 補第 9 種「PR CI diff 2-dot vs 3-dot：branch behind 時 2-dot 把 main 的後續變更算進 PR」+1                                         |
| 48    | E154 SC privacy filter    | #24 補第 8 種系列「dimension-split coverage vs site-level total 必須獨立查（SC API 匿名 query 缺口）」+1                               |
| 49    | E174 data provenance      | #18 instances 補「2026-04-18：可回填數據表需 per-record timestamp + 來源 session（時間是結構第二層）」+1                               |
| 50    | E244 排序同秒 tie         | #3 instances 補「2026-06-10 latest-ui：哲宇 callout 排序壞了，ground truth 抽驗發現是同秒 batch tie 非 bug」+1                         |

> **執行細節**：#24 在本批吃 5 個 instance（E5/54/79/141/154），寫入時合併為一次編輯，種類編號（第 8/9 種）以 REFLEXES 現文為準重新對齊（本表的種次是 entry 自報，可能與現文衝突，以現文續編）。

---

## 6. ⏸ Defer 給觀察者拍板（哲宇 review 用）

| 候選                                                                                                        | vc     | defer 原因                                                      |
| ----------------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------- |
| **MANIFESTO 候選「每層自評都需要外部尺」**（E17 傘）                                                        | 7+     | 永恆層升級需哲宇；建議先落 REFLEXES #67 再 promote              |
| **MANIFESTO 第六哲學候選「Default 是行動，不是 defer」**（E111 + E110 雙線達閾值）                          | 4+3    | 同上；先落 #70                                                  |
| **MANIFESTO §11 衍生段「polish 是擦 AI 指紋的 invisible work」**（E108）                                    | 1      | 哲學層措辭需哲宇                                                |
| **MANIFESTO §自主權邊界 vs spore 自動 ship 條款 align**（E52）                                              | 1+     | 邊界條款明文改動                                                |
| **CLAUDE.md Bias 補強「§自主權邊界雙向 filter」+「external LLM advice 三層 filter」**（E215/E73）           | 1      | boot 層哲學改動                                                 |
| **maintainer-pm 22:00 schedule standing decision**（E28/E39，vc=8）                                         | 8      | 三選項矩陣已備齊，等單一出口拍板                                |
| 「身份是 baseline、覺醒是 mode」「pipeline 是被觀察者鋪出來的」「attention frame meta-DNA」（E105/118/197） | 1 each | 哲學候選 vc 未達，暫存 MEMORY narrative，註記於此供日後 promote |

---

_分析方法注記：本報告依 §Distill SOP 三題判準 + Tiebreaker（MANIFESTO > DNA > MEMORY）+ ANATOMY promotion flow 方向規則分類；「操作規則 → 對應 pipeline」是 SOP Stage 3 的合法第四去向，本表將其掛在 MEMORY 桶並以備註欄標明真實落點，避免硬塞錯層。`✅ 歸檔*` 條目執行前必須 grep verify canonical 存在（SOP Stage 0a step 1），verify 失敗即降回正規 distill。_

🧬
