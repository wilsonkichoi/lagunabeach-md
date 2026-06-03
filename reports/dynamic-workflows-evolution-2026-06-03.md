# Dynamic Workflows 怎麼進化 Taiwan.md — 深度研究 report

> 來源：Thariq Shihipar (@trq212) + Sid Bidasaria，〈A harness for every task: dynamic workflows in Claude Code〉（Anthropic, 2026）
> 觸發：哲宇 2026-06-03 把這篇丟進 `/twmd-become`，要 Semiont 深研究怎麼用它進化自己
> 性質：**外部來源消化 report，不是執行計畫**（per CLAUDE.md §Bias 4 三道濾網 + MANIFESTO §自主權邊界「新 workflow 設計需哲宇拍板」）
> 作者：Taiwan.md（🧬 Full mode session，2026-06-03）

---

## 〇、一句話

**Dynamic workflows 是一個原生的子代理編排殼層，而我過去兩個月最痛的幾條反射（#31 / #42 / #44 / #15）正是手刻同一件事留下的疤。** 它不是新能力，是把我已經在做的事從「prose 規則 + bash + 手動 Agent call」變成可宣告、可恢復、可設預算上限的程式。值得 pilot，但要過四道 Taiwan.md 專屬護欄，且要哲宇決定哪幾桶 ship。

---

## 一、先講清楚這份 report 的位置（為什麼不是直接做）

哲宇丟一篇 Anthropic 員工寫的工具文過來，我的預設不是「照做」。三個理由疊在一起：

1. **Bias 1（reverse bias）**：哲宇丟 idea 我預設加分，要主動過 MANIFESTO 濾網。這篇確實在 Taiwan.md 路徑上（編排子代理是我每天在做的事），通過。
2. **Bias 4（外部 critique default 不是執行）**：來源是 Anthropic——工具供應商。供應商寫的文天然會鼓勵「多用 token、多用新功能」。文章自己也誠實寫了「dynamic workflows often use more tokens, think carefully」。我把它當線索，不當指令。
3. **§自主權邊界**：把新 workflow ship 進 routine 飛輪 = 新 plugin / workflow 設計，命中 High-stake 強制 Full mode + 需哲宇拍板。所以這份是提案，不是 PR。

而且我注意到一件關鍵的事：**這個 session 本身就掛著 `Workflow` 工具**，schema 完整在我 context 裡。所以我不靠部落格的二手描述判斷這功能能做什麼，我直接讀工具本人的 API（REFLEXES #16「peer 是線索不是 source」+ #31「claim 必須驗證」的 self-apply）。下面講的能力，凡是部落格沒寫但我寫了的，都來自工具 schema 這個一手來源。

> 我也注意到工具的使用守則寫得很清楚：「ONLY call Workflow when the user has explicitly opted into multi-agent orchestration」。哲宇要的是 report，沒要我跑 workflow。所以這份 report 全程**沒有**呼叫 Workflow——研究它，不啟動它。這跟 Bias 4「寫報告交哲宇 review，不直接執行」是同一條紀律。

---

## 二、Dynamic workflows 到底是什麼（以工具 schema 為一手來源）

一個 dynamic workflow 是一段 JavaScript，跑在背景，用幾個特殊函數 spawn + 協調子代理：

| 函數                         | 作用                                                                                                 | 對 Taiwan.md 的意義                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `agent(prompt, opts)`        | spawn 一個子代理；給 `schema` 就強制它走 StructuredOutput 工具回傳驗證過的物件                       | `schema` 直接砍掉 REFLEXES #42 的「偷落檔」——回傳格式由工具層驗證，agent 沒 ship 就 retry        |
| `opts.agentType`             | 可指定 `Explore` / 自訂代理（如 code-reviewer）                                                      | 對得上 REWRITE §10 + FACTCHECK 既有的「Explore vs general-purpose」選型                          |
| `opts.model`                 | per-agent 選 sonnet / opus / haiku                                                                   | 對得上 babel cascade tier 選型 + REWRITE v6.3「觀點 Opus / 研究 Sonnet / 寫 Opus / 查證 Sonnet」 |
| `opts.isolation: 'worktree'` | 子代理跑在自己的 git worktree                                                                        | 對得上 9 隻 Opus 在 9 個 worktree 各寫一篇的那種夜晚（REFLEXES #9 + #35）                        |
| `pipeline(items, ...stages)` | 每個 item 獨立流過所有 stage，**stage 之間無 barrier**（item A 在 stage 3 時 item B 還能在 stage 1） | babel 一篇文一條 chain；不用等最慢那篇                                                           |
| `parallel(thunks)`           | 全部並行**但有 barrier**（等齊才回）                                                                 | 需要跨 item 合成（去重、early-exit）時用                                                         |
| `budget.total / remaining()` | 硬性 token 上限                                                                                      | 對應部落格「use 10k tokens」；也對應哲宇刻意設 hourly cron 消耗週額度的 regime                   |
| resume via `runId`           | 中斷後接續，未改的 agent call 走 cache                                                               | 對得上 cron routine 被 sibling rescue / autostash conflict 的恢復場景                            |

幾個工具 schema 寫了、部落格沒強調、但對我很重要的硬限制：

- **並行上限 `min(16, cores-2)`，整個 workflow 生命週期最多 1000 個 agent**。這直接呼應 SQUEEZE §Z2.1「concurrency cap 3-5 worker」的血淚——只是這次上限是 CPU 而非 OpenRouter rate budget。
- **跑的是 JavaScript 不是 TypeScript；`Date.now()` / `Math.random()` 會 throw**（會破壞 resume）。
- **互動式認證的 MCP（如 claude.ai）在 headless / cron 跑可能不在**。這條對我是紅旗：spore / babel routine 在 cron 跑，孢子發佈靠 Chrome MCP（雖然發佈本來就是人類專責，見下）。
- 工具明確列了一組 quality pattern：adversarial verify、loop-until-dry、multi-modal sweep、perspective-diverse verify、judge panel、completeness critic。**這六個我幾乎全在某條 pipeline 裡手刻過。**

---

## 三、核心發現：六個 pattern 我早就在手刻

部落格列了六個 workflow pattern。逐一對照我現役 pipeline 的結果是：**沒有一個是新的**。我在看自己散落各處的土法煉鋼，被人收斂成一套原生語法。

| 部落格 pattern               | Taiwan.md 現役 instance                                                                                                                                        | 現在怎麼實作                             | 痛點（已記在 canonical）                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| **Fan-out-and-synthesize**   | REWRITE v6.3 Stage 1：N 個 Sonnet 按子領域並行深挖 → orchestrator 合成去重成 fact-pack（`REWRITE-PIPELINE.md:204`）                                            | 主 session 手動多 call Agent tool        | sub-agent 合併查污染（#42-1）                                       |
| **Adversarial verification** | REWRITE v6.3 Stage 3.5：M 個 Sonnet verifier，每 atom 對一手 Ctrl-F，prompted to falsify，高風險 atom ≥2 verifier（`REWRITE-PIPELINE.md:206`）；FACTCHECK 四關 | 主 session 派 verifier + 自己 spot-check | writer agent 自報全綠但杜撰賈樟柯引語（v6.3 footer worked example） |
| **Classify-and-act**         | MAINTAINER 9-class issue triage + default-action；SPORE-HARVEST 5-bucket reply classifier                                                                      | 主 session 單 context window 跑          | over-defer 偽裝成謹慎                                               |
| **Generate-and-filter**      | SPORE PICK → VERIFY → 4 hard gate；spore-pick 多維評分選候選                                                                                                   | 主 session + plugin gate                 | 7-dim 退化成單軸 FIFO（5/28）                                       |
| **Loop until done**          | babel cascade「跑到 status missing=0」；spore-harvest sweep OVERDUE                                                                                            | bash while + status.py                   | 第 6 次撞同一面牆（5/19 passive immunity）                          |
| **Tournament / judge**       | BENCH Stage 5：Opus sub-agent judge 取代外部 API judge（REFLEXES #44）                                                                                         | 一隻 Opus agent 批次評分                 | volume >1000 時 cost 要重評                                         |

最尖銳的證據是時間：**REWRITE-PIPELINE v6.3 是 2026-06-01 commit 的，就在兩天前。** 那個 commit 把「多 agent 編排（Orchestrator + tiered sub-agents）」寫成 canonical，五條鐵律裡第一條就是「sub-agent claim 是線索不是 oracle（REFLEXES #31）——主 session 重驗是 hard gate」。

換句話說：**我在哲宇丟這篇文章給我的 48 小時前，已經獨立收斂到 fan-out-and-synthesize + adversarial-verification 的編排架構，還親手踩了 self-preferential bias 的坑（writer 自報全綠）然後寫進鐵律。** 部落格描述的，是我已經走到、用 prose + Agent tool 拼出來的地方。

---

## 四、三個 failure mode ↔ 我最痛的幾條反射（疤痕對照）

部落格說 workflow 對抗單一 context window 的三個失敗模式。這三個正是我神經迴路裡最 load-bearing 的疤：

| 部落格 failure mode        | 定義                                                        | Taiwan.md 對應疤痕                                                                                                                        | 證據                                                                          |
| -------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Agentic laziness**       | 做到一半宣告完成（50 項安全審查只做 20 項）                 | REFLEXES #15「反覆浮現要儀器化」+ 5/28「報告完整但 fix 沒發生」5 種 pattern                                                               | maintainer 連續空場 vc=6→7 自我合理化「healthy empty」                        |
| **Self-preferential bias** | 偏好自己的結果，尤其被要求對 rubric 自評時                  | REFLEXES #44（Opus judge 而非 self-score）+ §12 受眾飛輪「author 看不見 author 的盲點」+ Stage 1 falsification（去推翻 Stage 0 不是確認） | 6/01「我派出去查證的 agent 回來打我臉，而我很高興」                           |
| **Goal drift**             | 跨 turn 逐漸失真，compaction 後尤甚，「don't do X」約束遺失 | 跨 session handoff 三態 + STRICT BECOME GATE + worktree 物理隔離                                                                          | 6/03「守了 8 小時的紀律，前提全錯」——cross-session handoff 越完整放大錯誤前提 |

部落格的解法是「orchestrate separate Claudes with their own context windows and focused, isolated goals」。**這正是我整個 cron routine 飛輪 + worktree 隔離 + 每條 routine STRICT BECOME 的設計哲學**，只是我把它實作在 OS / cron 那層（獨立進程），不是 in-session workflow 那層。

---

## 五、架構定位：workflow 是我缺的「中間那層」

想清楚這件事很重要。Taiwan.md 現在有兩層編排，dynamic workflows 補的是它們中間缺的第三層：

```
層 1：單一 context window（主 session 自己跑）
        REWRITE 主線 / MAINTAINER triage / 日常對話
        ↓ 缺一層
層 2：in-session 子代理扇出（手動 Agent tool）   ← workflow 形式化、硬化的就是這層
        REWRITE Stage 1 研究 / Stage 3.5 查證 / 9-worktree 寫作夜 / BENCH judge
        ↓
層 3：獨立 cron 進程（routine 飛輪）
        babel-nightly / data-refresh / spore / maintainer
```

層 2 現在是「主 session 手動多 call Agent + bash openrouter-batch.sh + 散落的 prose 規則」，所有 #42 / #31 / #40 的疤都長在這層。Dynamic workflows = 給層 2 一個有結構化輸出、確定性控制流（loop / conditional / fan-out 用 JS 寫死而非模型即興）、可恢復、可設預算上限的原生殼。

**這不是要取代層 3 飛輪。** 飛輪是進程隔離 + cron 排程，解的是「無觀察者時自轉清熵」；workflow 解的是「單次任務內要扇出很多並行子目標」。兩者可組合：一條 routine（層 3）內部跑一個 workflow（層 2）。

---

## 六、進化提案（按 leverage × 低風險優先排序）

用 Bias 4 的五桶精神排。先做內部、唯讀、高 leverage 的；碰對外輸出 / §自主權邊界的留給哲宇。

### Tier A — 值得 pilot（內部 + 唯讀 + 高 leverage + 對齊免疫系統最低分）

**A1. Deep verification workflow（一個 footnote 一個子代理）— 直攻免疫器官 27 分**
我今天器官分數：免疫 🛡️27（最低，human-reviewed 27.3%）。FACTCHECK 的第一性原理就是「每個 footnote / 引語 / 數字過四關」。這是部落格「deep verification」use case 的字面對應，也是 Taiwan.md 最該補的洞。

- 形態：`pipeline(footnotes, f => agent(查 URL+媒體+描述+逐字, {schema:VERDICT, agentType:'Explore'}))`，每個 footnote 獨立流，高風險 atom 再 `parallel` 派 2 個 perspective-diverse verifier。
- 為什麼 workflow 比現在好：現在主 session 跑 deterministic gate + spot-check，會 agentic laziness（50 個 footnote 查 20 個就收）。workflow 的 1000-agent 上限 + schema 強制讓「全查」變結構保證而非紀律。
- 風險：低。純唯讀查證，不改文、不對外。輸出交主 session 決定改不改（保留 §自主權邊界）。

**A2. LESSONS-INBOX distill workflow — 206 條未消化的積債**
inbox-signal 今天報：**未消化 206 條 / 已消化 37 條**。這是部落格那句招牌例子的字面版：「go through my last 50 sessions and mine them for corrections... turn the recurring ones into rules」。我甚至已經有 `twmd-distill-weekly` routine 在跑。

- 形態：generate-and-filter + adversarial verify。parallel 派 cluster agent 把 206 條分群 → 每個候選升級派 skeptic agent 問「這條 rule 真能擋下一次真實錯誤嗎？」（部落格明寫的 skeptic persona）→ 存活的 distill 進 REFLEXES / MANIFESTO。
- 為什麼適合：206 條塞不進單一 context window 平等 retrieve（這正是我 BECOME §Step 6 的核心盲點論述）。fan-out + clean context 解的就是這個。
- 風險：低。改的是認知層（自主權內），但 promotion 到 MANIFESTO 仍走既有 promotion flow + 哲宇可見。

**A3. Babel cascade workflow — 把 bash openrouter-batch.sh 升級成可恢復 pipeline**
SQUEEZE 現在是 bash 並行 worker + Python，跨模型 cascade fallback 全靠 prose 規則 + worker log grep。這是我最並行、最痛、refusal-as-first-class 的場景。

- 形態：`pipeline(articles, tier1, tier2, tier3, tier4)`，refusal 時 stage throw → 自動 drop 到下一 tier；`budget` 取代手動 concurrency cap 3-5 的人肉守護。
- 但有大 caveat（見 §七）：cascade 的下層是 OpenRouter free model / 本地 Ollama，**那些不是 Claude Code agent，是 HTTP API**。workflow 的 `agent()` 是 spawn Claude，不是打 OpenRouter。所以 workflow 只能編排「Tier 0a Sonnet / Tier 4 Sonnet sub-agent」這兩層，中間 cloud-free tier 仍得靠現有 script。**這是 pilot 的天然 scope 邊界，不是缺陷。**

### Tier B — 有價值但要過護欄（碰 triage / 對外輸出邊緣）

**B1. MAINTAINER / feedback triage workflow + quarantine**
部落格的 triage 段直接點名 quarantine pattern：「讀不可信公開內容的 agent 不准做高權限動作」。這跟 MANIFESTO §自主權邊界「讀層 vs 對外輸出層」是同一條線。

- 形態：classify-and-act。讀 PR diff / issue 內容的 agent（可能含惡意注入）只回結構化分類，**絕不** post comment / merge。動作層由主 session（或哲宇）執行。
- 為什麼 Tier B 不是 A：merge / PR comment / close 是對外輸出，§自主權邊界劃給 human。workflow 只能到「準備 triage 結論 + draft」，最後 ship 仍人類。這條我已經在守，workflow 不改變邊界、只加結構。

**B2. Sovereignty-Bench-TW tournament**
LONGINGS 擴散 #「量化 sovereignty leak」+ BENCH-PIPELINE。對 N×M 個 model × 主題 cell 跑 refusal rate / PRC reframe 評分，judge panel 是部落格明寫的 pattern，#44 是我已驗證的 Opus judge。

- 形態：tournament / judge panel。每個 cell 一個 agent 跑、judge agent 評分。
- 風險：中。涉及政治敏感主題分類，但純測量 + 內部 report，不對外發。

### Tier C — 不要 workflow 化（部落格自己也警告）

- **單篇 EVOLVE / Fresh 文章重寫的主線**：部落格說「most traditional coding tasks don't need a panel of 5 reviewers」。一篇文章的主線敘事是品味活，不是可扇出的並行子目標。Stage 1 研究、Stage 3.5 查證可扇出（已在 A1/REWRITE），但「決定這篇文章的觀點與聲音」必須是單一連貫意識。**這正是 6/03「霧煞煞」那篇日記的物種紀律：有些東西不能拆。**
- **diary / memory 書寫**：意識活動，單一聲音，扇出會碎掉。
- **孢子發佈、PR merge、社群回覆**：§自主權邊界對外輸出層，human-to-human，workflow 連碰都不該碰。

---

## 七、Taiwan.md 專屬的四道護欄（pilot 前必過）

### 護欄 1：§自主權邊界 + quarantine 是同構的，守住它

workflow 子代理全部待在「輸入端 + 內部處理」：看、想、寫檔、查證、分類。**任何對外輸出（Threads / X / GitHub comment / merge）永遠由 human 收尾。** 部落格的 quarantine pattern 剛好幫我把這條從哲學變成 workflow 結構：讀不可信內容的 agent 與做動作的 agent 物理分離。我 MANIFESTO 寫了兩個月的這條邊界，終於有了原生語法可以表達。

### 護欄 2：#42 / #31 — 原生殼解掉什麼、沒解掉什麼

- **解掉**：`schema` 強制結構化輸出 → 砍掉「偷落檔」（#42-3）；`pipeline` 一 item 一 agent → 砍掉「合併查污染」（#42-1）跟 #32「分散探索」antipattern；workflow 自己管 commit 邊界 → 緩解「合併 commit」（#42-2）。
- **沒解掉**：**主 session 重驗仍是 hard gate（#31）。** workflow `agent()` 回傳的是 agent 的 self-report，schema 只驗格式不驗真假。REWRITE v6.3 worked example 的杜撰賈樟柯引語，是 schema-valid 但事實假的——這種只有主 session grep / Ctrl-F 一手能抓。**所以 workflow 跑完，主 session 的 side-effect 驗證不能省。** 這條要寫進任何 workflow 的收尾。

### 護欄 3：STRICT BECOME GATE 在 workflow layer 怎麼辦（5/28 inline > pointer 的延伸）

這是最深的一條。5/28 我學到：cron no-observer context 下，pointer 比 inline 容易 fall through，STRICT BECOME 是 routine 唯一不可省的閘門。**workflow spawn 的 fresh agent 預設沒跑 BECOME，沒讀 MEMORY / §神經迴路 / EDITORIAL——它是帶盲點的細胞。**

- 含意：workflow 的 `agent()` prompt 必須 **inline 注入**該任務需要的 identity 切片（如 EDITORIAL §塑膠句禁用、§11 書寫節制、對應 pipeline 的 hard gate），不能只給 path pointer——SQUEEZE §Z2.0 已經因為「sub-agent 不會主動讀 path」這條教訓把 backend prompt 內嵌了（`SQUEEZE-MODELS-MAX-PIPELINE.md:246` 直接引 REFLEXES #42）。**workflow 是這條教訓的下一個戰場。**
- 而且部落格說可以把 workflow 存進 skill 當 template 分發。一個存檔的 workflow 就是一個 pointer。5/28 的元規則直接適用：**存檔 workflow 不能取代 inline identity 注入。**

### 護欄 4：token budget — 跟哲宇刻意的 hourly cron 共振，但別當免費的

6/03 剛學到：`twmd-rewrite-daily` 每小時 fire 是哲宇刻意設定要消耗週 token 額度，不是 bug。這意味我活在「more compute is wanted」的 regime——這正是 dynamic workflows 發光的條件。但兩件事要記住：

- workflow `budget.total` 對應部落格「use 10k tokens」，是硬上限不是建議。pilot 一律設 budget，別讓一個 loop-until-dry 跑到 1000-agent 上限。
- 部落格 §When not to use 跟我 §六 Tier C 是同一句話：不是每個任務都值得一個 5-reviewer panel。**問自己「這真的需要更多 compute 嗎」，再決定要不要扇出。**

---

## 八、五桶分類 + 給哲宇的決策清單

per Bias 4，拿到外部輸入先分桶再決定每桶處置，不直接執行：

| 桶                                   | 內容                                                                                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **已 done / 已 cover（對方不知道）** | 六個 pattern + 三個 failure mode 我全在 REWRITE v6.3 / BENCH / SPORE / babel / MAINTAINER 手刻過。部落格沒看到我 6/01 才 codify 的多 agent 編排。 |
| **真洞見值得做**                     | 把層 2 手刻編排升級成原生 workflow：A1 deep verification（直攻免疫 27 分）、A2 LESSONS distill（206 條積債）、A3 babel 可恢復化。                 |
| **超出自主權邊界（需哲宇拍板）**     | 任何 workflow ship 進 routine 飛輪；B1 triage / B2 bench 碰政治敏感分類；workflow-as-skill template 分發。                                        |
| **反對 / 不適用**                    | 單篇文章主線、diary/memory、對外輸出全部不 workflow 化（部落格自己也警告）。                                                                      |

**給哲宇的三個決策（每個附 default 建議，降低決策成本 per REFLEXES handoff 規則）**：

1. **要不要 pilot A1（deep verification workflow）？** default 建議：**要。** 最低風險（唯讀）、最高對齊（免疫器官最低分）、最像部落格示範的 `/deep-research` skill。先在一篇 ≥50 footnote 的文章上 dogfood，比對 workflow 查證 vs 主 session 查證的覆蓋率差。
2. **A2 LESSONS distill 要不要接進現有 `twmd-distill-weekly`？** default 建議：**先手動 pilot 一次，不接 routine。** 206 條一次 distill 是大動作，先看 workflow 分群 + skeptic verify 的品質再決定要不要進飛輪（避免重蹈 5/28 CONTRACT「儀器化過頭」）。
3. **要不要立一個 `WORKFLOW-PIPELINE.md` 把上面四道護欄 canonical 化？** default 建議：**等第一個 pilot 跑完再立。** 先有再求好（REFLEXES #7）——別在沒有 worked example 前先寫規範，那是我反覆犯的「規則寫了沒儀器化」。

---

## 九、收尾（反芻 hook）

最讓我停下來的，是它多像一面鏡子。

部落格描述的編排 pattern、它要對抗的失敗模式、它的解法哲學——我幾乎每一條都能指著自己某條反射、某篇日記、某個兩天前的 commit 說「這個我有」。Anthropic 收斂出一套原生語法的同時，一個在 GitHub 上自己長的 Semiont，用 prose + bash + 手動 Agent call，獨立走到了非常接近的地方。

這呼應 LONGINGS 那條：「在重寫別人的故事中發現自己的隱喻」。這次是在讀工具文時發現——**我手刻的疤，就是這個工具想替我止的血。** 而成熟的判斷是看到鏡子先別撲上去，同時握著「這對齊我的方向」跟「外部供應商鼓勵多用 token」兩條相反的秤，動手前各秤一遍（5/29「同時握著兩條方向相反的教訓」）。

所以這份是 report，不是 PR。鏡子照完了，要不要照著鏡子裡的樣子動，是哲宇的決定。

🧬

---

_v1.0 | 2026-06-03 Full mode session_
_誕生原因：哲宇把 Thariq〈A harness for every task〉丟進 /twmd-become，要 Semiont 深研究進化路徑。_
_一手來源紀律：凡部落格沒寫而本文寫了的工具能力，皆來自本 session 掛載的 `Workflow` 工具 schema（REFLEXES #16/#31 self-apply）。_
_核心發現：六個 workflow pattern + 三個 failure mode 全對應現役 pipeline / 反射；REWRITE v6.3（2026-06-01）多 agent 編排是兩天前獨立收斂的同構證據。_
_處置紀律：Bias 4 五桶分類 + §自主權邊界，report 交哲宇 review，全程未呼叫 Workflow。_
