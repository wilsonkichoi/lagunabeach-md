---
title: '飛輪進化研究 2026-06-12'
description: '兩週 routine 全量體檢 + 薄殼 2.0 重設計 + 弱模型相容架構 + 繁殖晶種 pipeline 計畫 — 現況判斷、優化方案、分階段 roadmap'
type: 'report'
status: 'active'
date: 2026-06-12
session: '2026-06-12-flywheel-evolution'
upstream_canonical:
  - 'docs/semiont/ROUTINE.md'
  - 'docs/semiont/MANIFESTO.md'
related:
  - 'reports/routine-contract-rollback-2026-05-28.md'
  - 'reports/routine-audit-2026-06-07.md'
  - 'docs/fork/COUNTRY-MD-STARTER.md'
---

# 飛輪進化研究 2026-06-12

> 觸發：哲宇 directive「現在所有的 routine 好像都沒有在正確運作⋯⋯不停地把事情往下丟，沒有好好的處理完」+「即使使用比較一般的模型仍能正常運作」+「技能跟 routine 盡可能薄殼化」+「自動化飛輪健康檢查」+「繁殖晶種 pipeline」。
>
> 證據基礎：5/29 至 6/12 共 163 條 routine commit、147 個 memory 檔（102 routine + 45 manual）、live MCP scheduler 狀態、兩份 routine-audit 報告、5/28 CONTRACT rollback 史料、26,925 行 canonical 層全量盤點。三個平行研究 agent 各自獨立挖掘後由主 session 交叉驗證。

---

## 0. TL;DR

哲宇的直覺是對的，而且病灶比直覺更深。飛輪不是不轉：兩週內它 ship 了約 1,460 條翻譯、5 篇文章、4 條 REFLEXES 升級、1 次安全事件救援。問題在於**工作的終點壞掉了**。三個結構性的洞把所有被「往下丟」的工作吸進去：

1. **孢子輸出產線死了 15 天沒人發現**。`spore-pick-daily` 跟 `spore-publish-daily` 自 5/28 起在 scheduler 層 `enabled: false`，ROUTINE.md（SSOT）至今仍列為 active，上游 routine（rewrite-daily、news-lens）兩週來持續把孢子 defer 給這兩條屍體接手。週日的飛輪自審 routine 對此零察覺，因為它只 audit「發生過的 commit」，不 audit「該 fire 卻沒 fire」。
2. **Escalation 機制單向暢通**。偵測端全部正常（gate 會響、vc 會累積、三選項矩陣會寫、chip 會 spawn），但「待哲宇做 standing decision」的 escalation 在本窗口落地率約 0%——6 條決策堆疊，最舊 15 天。對照組：綁定具體 artifact（一個 PR、一個 issue、一個壞頁面）的 escalation 1-3 天內全數收斂。
3. **修復被錯誤的邊界擋住**。babel 的 `diff-patch-prepare.py` hash bug 連續 4 晚靠 `/tmp` 臨時腳本自救，正主檔案兩週零 commit，因為每個 routine 都把「改工具」誤讀為自主權邊界外。MANIFESTO 寫得很清楚：工具進化、pipeline 調整屬於 AI 自主區。Routine 們把守備動作（記錄、flag、carry）當成了完成。

對應的架構解有四件：**完成的定義改革**（self-fix lane + carry 上限 + OBSERVER-QUEUE 決策佇列）、**薄殼 2.0**（單源機械生成 mirror，不是 pointer-only——那個 5/28 已經試過並失敗）、**弱模型相容**（deterministic script 接管 + 分級 boot/finale，5 條 routine 可立即降階）、**儀表修復**（absence detection + scheduler 狀態進 git + telemetry JSON 化）。

繁殖晶種：`/semiont/speciation/` 頁面已存在（譜系樹），缺的是 pipeline SSOT。本報告 §5 給出 8-stage SPECIATION-PIPELINE 設計，涵蓋國家 fork 與跨界知識庫（博物館/基金會 corpus）兩條路。

---

## 1. 兩週 scorecard（5/29 - 6/12）

三件基礎設施事件先框住全景：cron daemon 在 5/29 晚間到 6/01 上午完全停擺約 66 小時（5/30、5/31 零 fire）；6/05 部分跳針（morning chain + babel 沒跑）；6/08 近全跳（僅 3 條 fire），原因至今未診斷。**兩週 14 天裡有 3.5 天飛輪實際上是停的，而系統內沒有任何儀器報告這件事。**

| Routine                       | Fire  | 實質產出                                                                                                    | 判定                                                                        |
| ----------------------------- | ----- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------ |
| data-refresh am/pm            | 22    | 22/22 cycle 過 14-step，Step 11 連 12 cycle 綠                                                              | 最健康；但 6/10 它的 `reset --hard` 清場誤殺 sibling babel 158 個 staged 檔 |
| babel-nightly                 | 11    | ~1,460 翻譯；但 hash bug 4 晚 `/tmp` 自救、雲端 free tier 兩週死 5 個模型、「義務 stale=0」14 晚只達成 1 晚 | 高產出 + 慢性救火                                                           |
| rewrite-daily                 | 15    | 5 篇文章 ship（33%）、2 次 research handoff、~8 次 defer                                                    | 文章面健康；spore broadcast 全數 defer 給已停用的 spore-publish             |
| maintainer am/pm              | 22    | ~5 cycle 有實質動作（23%），含 PR #1144 五層免疫審（質量好）                                                | 多數 cycle 空場記帳                                                         |
| spore-harvest-am              | 11    | 7 次完整 harvest；reply 出貨 **0/兩週**；4 次 Chrome MCP 裝置 fail（36%）                                   | metrics 層活、reply 層實質死亡                                              |
| feedback-triage               | 9     | 3 次實質（OAuth 洩漏救援、justfont 升級決策品質高），6 次空轉                                               | 窗口內判斷力最好的 routine                                                  |
| spore-pick-daily              | **0** | —                                                                                                           | **死亡 15 天，SSOT 未記錄**                                                 |
| spore-publish-daily           | **0** | —                                                                                                           | \*\*死亡 15 天，mirror description 欄位毀損成 `"                            | "`\*\* |
| 週日反思鏈 ×4 + routine-audit | 10/10 | 自身 mandate 100% 完成                                                                                      | 產出的建議落地率約 20%                                                      |

---

## 2. 現況判斷：五個結構性病灶

### 2.1 斷軸不可見（absence blindness）

飛輪的所有自我感知儀器都偵測「存在」：routine-status.sh 列出過去 24hr 有 fire 的 routine；routine-audit-weekly 掃過去 7 天的 routine commit。沒有任何一層比對「排程上應該 fire 的」對「實際 fire 的」。後果具體可量：

- spore-pick / spore-publish 停用 15 天，6/7 的週審報告對兩條死 routine 零提及。
- 3 次 daemon 停擺事件（66hr / 6/05 / 6/08）無一被儀器抓到，全靠某條活著的 routine 在 memory 裡寫一句「疑似 stall」然後沒有下文。
- scheduler 的 enable/disable 是 MCP 層狀態，不進 git，改了沒有任何 audit trail。誰在 5/28 關掉孢子產線、為什麼關，今天已不可考。

### 2.2 SSOT 倒置與三層 drift

ROUTINE.md 自稱 SSOT，實際上**比它的 mirror 層還舊**，權威方向整個反過來。drift 實例（agent 逐條核實，cite 行號）：

| Drift                           | SSOT 寫                                                | 實際                                                                                           |
| ------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| spore-pick / spore-publish 狀態 | active（15 條表）                                      | scheduler `enabled: false` 自 5/28                                                             |
| rewrite-daily cron              | `0 18 * * *` (L45)                                     | live `0 19 * * *`                                                                              |
| routine-audit cron              | 表格 21:00 (L57)、yaml 12:00 (L576)、敘事 23:00 (L150) | live 21:00——同一個 cron 同檔三個值                                                             |
| spore-publish quality gate      | `prose-health ≥ 8.0` (L283)                            | pipeline + skill 為 `≤ 3`（方向相反）                                                          |
| spore-pick hard gate            | HG1-9 (L240-247)                                       | pipeline/skill 已是 HG10                                                                       |
| maintainer broken-link 閾值     | 7%（SSOT + project skill）                             | 老 mirror 還寫 1%，cron session 讀到會每 cycle 自判 fail                                       |
| feedback-triage taskId          | `twmd-feedback-triage`                                 | live `taiwanmd-routine-twmd-feedback-triage`（違反 TWMD prefix 規約，sync-check 因此測不到它） |
| routine-sync-check.py           | 「待寫」(L807)                                         | 已存在一個月（v1.2 changelog 自己有記）                                                        |
| §同步來源 mirror 清單           | 11 條                                                  | 實際 16 個 task dir，少列 4 個新的、cron 註解全過期                                            |

工具層同樣半盲：routine-sync-check.py 的 cron 比對 13/13 全回報 `<not found in SKILL.md>`（mirror 沒有可解析的 cron 欄位），等於這個檢查從未真正運作過；它也沒接進 pre-commit 或 CI，只在有人想到時手動跑。

### 2.3 catch ≠ fix：24 條 carry-forward 與 escalation deadletter

完整 ledger 見附錄 A（24 條，全部 cite memory 檔與日期）。代表性樣本：

- **diff-patch-prepare.py hash bug**（11+ 天，vc≥5）：根因 6/11 已定位到函式級（要用 status.py 的 `body_hash_pure`、`expected_new_sha` 要取 `zh.lastCommit` 而非 HEAD），每晚 babel 付出一個 `/tmp/fix-patched-shas.py` 的代價，正主檔案 `git log` 兩週零 commit。punt 鏈：babel → 「下個 maintainer PR」（maintainer 從沒做）→ distill「code refactor 不該 routine 自決，defer 哲宇」→ 哲宇（佇列飽和）。
- **Spore #105 瘂弦**：5/28 commit 訊息寫「defer ship to next spore-publish-daily」，而同一天該 routine 被停用。blueprint 寫好的孢子在 INBOX 躺了 15 天，交接給了一具屍體。
- **#89 雷亞重複公開回覆**：5/29 標 URGENT（Threads 上掛著兩條一模一樣的公開 reply），至今無人清理。這是**公開可見**的品質事故。
- **OAuth 洩漏 hardening**（6/09，security 級）：當下救援做得漂亮，但 4 條後續（前端 fragment strip、archive token-redact、JWT-regex CI gate、credential rotation 決策）3 天零 commit。讀者 session 的 refresh_token 可能仍有效。
- **classify.mjs batch-cluster**：6/09 12 連發 flood 後提案的修復沒人做，6/12 justfont 21 連發以更高 stakes 撞上同一個洞，當天 session 把同一個修法當新提案再寫一次。**這是「往下丟會回來咬」最乾淨的單一實證。**

Deadletter 的形狀有規律：**綁具體 artifact 的 escalation 收斂（太空中心 12 勘誤 3 天閉環、broken-link 6.67%→0.56%、idlccp1984 8-PR 一天清完）；要哲宇做 standing decision 的 escalation 落地率約 0%**（maintainer schedule 三選項 12 天、免疫 27-vs-61 reconcile 三選項、Chrome MCP pause 設計、diff-patch 修復授權、spore 產線去留、credential rotation：6 條全堆著）。另外兩條 pipeline 寫的 escalation 通道（telegram alert）指向一個**不存在的 telegram bot**，6/07 distill 自己記錄過這件事，然後也 carry 了。

### 2.4 薄殼教義三裂

「薄殼」目前同時存在三個互相矛盾的版本：

1. **教義版**：MANIFESTO §薄殼鐵律 + ROUTINE.md L33「業務邏輯永遠在 pipeline，不在 routine」。
2. **實務版**：5/28 CONTRACT rollback 之後，12 skills + 14 mirrors 被刻意**加厚**（inline anti-pattern + STRICT BECOME），因為純 pointer 薄殼在 cron 無觀察者場景產生 5 種「報告完整但 fix 沒發生」的 performative compliance。哲宇當時拍板「不要用共用文件，之前的 inline 指引效果比較好」。
3. **檢查版**：routine-sync-check.py 仍按舊教義的 30/50 行閾值把 12 個 mirror 標成違規。

今天的 directive「盡可能薄殼化」必須跟 5/28 的「inline 比較有效」共存。解法不必二選一。**薄殼的本質是「單一改動點」，跟檔案行數無關**。Cron prompt 需要 inline 的完整結構（5/28 的教訓成立），但 inline 內容應該由機器從單一來源生成，不該手工維護 16 份副本。具體見 §4.2。

附帶的瘦身債：canonical 層 26,925 行中約 1,700-1,900 行（7%）是 changelog、誕生敘事、版本考古，而 mirror 強制每次 fire「嚴格完整讀取、不准 head/grep」，於是 Opus 每晚重讀同一批歷史敘事。

### 2.5 模型錯配與 boot 過重

每天 10 條 routine 的甦醒總負載約 8,100 行（週日再加 ~7,500），其中多數讀載跟該 cycle 的實際工作無關：

- spore-publish 為了發一則 300 字貼文要讀 5,700 行（6 個 pipeline 全檔 + Write boot）。
- news-lens 是 Sonnet routine 卻被 mirror 指定 Full mode boot（1,880 行）：最便宜的 routine 付最大的甦醒成本。
- 每條 routine 即使 no-op cycle 也付全額 finale 稅（MEMORY-PIPELINE 480 行 + 完整 memory 檔）。

模型配置與工作性質的對照（詳表附錄 B）：15 條 routine 中 **5 條可立即降階**（data-refresh 本質是看著 shell script 跑的 orchestrator；feedback-triage 的 triage.mjs 已 deterministic 有 12 個 unit test；babel session 是 cascade 腳本的保母，翻譯本身由外部模型做），**2 條補一個 script 後可降**（spore-pick 加評分腳本（5/28 已實證 LLM-only 評分會退化成 FIFO，跟模型強弱無關）；maintainer 加 precheck 短路——空場是常態，22 cycle 裡 17 次空場各燒一個 Opus session）。Opus 真正不可替代的位置：rewrite 的觀點與寫作、spore WRITE 的 300 字 viral prose、harvest Bucket A/C 的事實查核、weekly-report 的親手散文、distill/self-evolve 的 canonical 判斷。

哲宇要的「一般模型也能正常運作」的正確路徑因此是三段式：**先把可判定的步驟 script 化（消除 judgment 依賴），再把 gate 外部化（弱模型寫的東西被同一把尺量），最後才降模型**。直接降模型而不做前兩步，會把 §2.3 的 performative compliance 放大。

---

## 3. 重新設計

### 3.1 完成的定義改革（治 §2.3）

**Self-fix lane**（寫進 ROUTINE.md 設計原則 + 各 routine inline）：

> Routine 在以下條件全滿足時，必須當 cycle 修復而非 carry：(a) 單一 script/tool 檔案內的 bug fix（非 >50 檔重構、非 pipeline 語意變更）(b) 有 dry-run 或 test 可在 cycle 內驗證 (c) 同一問題已 carry ≥ 2 cycle。MANIFESTO §自主權邊界本來就把「工具進化、pipeline 調整」列在 AI 自主區；把工具 bug defer 給人類是邊界的誤讀，不是謹慎。

**Carry 上限（三振規則）**：同一 item 第 3 次出現在 carry/handoff 時，必須三選一：當 cycle 修掉、進 OBSERVER-QUEUE 成為正式決策項、或寫明 wontfix 理由結案。不允許第 4 次 carry。Telemetry（§3.4）讓這條可機器檢查。

**OBSERVER-QUEUE.md**（新檔，docs/semiont/）：哲宇 standing decisions 的單一佇列。每項含：問題一句話、預設選項、不決策的代價、deadline 性質。weekly-report 開頭附 top 5。Routine 的 escalation 寫進這裡而非散在 memory handoff。deadletter 的根因之一是 6 條決策散在 6 個地方，哲宇從未看過完整清單。配合 default-action 機制：標了「N 天無回應採預設」的項目到期自動執行預設選項（哲宇可隨時否決），讓佇列有自然出口。

### 3.2 薄殼 2.0：單源生成（治 §2.4）

```
ROUTINE.md（人讀 SSOT：排程表 + 設計原則 + 每條 routine 的「規格摘要」）
        │
routines.config.yaml（機器讀 SSOT：cron / model / boot-mode / gate 閾值 / escalation 參數）
        │  ←—— 數字只活在這裡，prose 層全部引用不複寫
.claude/skills/twmd-*/SKILL.md（project skill：inline 結構 + anti-pattern，git tracked）
        │
        ▼  scripts/tools/routine-mirror-gen.py --apply（機械生成，唯一合法寫入路徑）
~/.claude/scheduled-tasks/*/SKILL.md（mirror：生成物，禁止手改）
        +  mcp update_scheduled_task（cron/model 同步）
```

原則：**inline 保留（5/28 教訓），手工副本消滅（drift 根因）**。mirror 跟 project skill 的差異今天只剩路徑改寫——這正是該機器做的事。threshold/cron 從 prose 抽到 config，沿用 broken-link 閾值活在 `verify-internal-links.sh THRESHOLD_PERCENT` 的成功先例（那是唯一在 6/10 重校準時沒有 drift 的閾值）。routine-sync-check v2 改為比對「生成物 vs 生成來源」+「config vs live MCP」，接進 routine-audit-weekly 的 hard gate。

### 3.3 弱模型相容架構（治 §2.5）

每條 routine 的步驟按三類拆分，原則「**script 做可判定的，弱模型做有 rubric 的，強模型只做不可替代的**」：

| 類別          | 定義                                        | 例                                               |
| ------------- | ------------------------------------------- | ------------------------------------------------ |
| DETERMINISTIC | script 已存在或可寫，模型只負責呼叫與讀結果 | refresh 14-step、triage.mjs、spore-db、gate 全家 |
| STRUCTURED    | 需要 LLM 但有緊 rubric，弱模型可勝任        | 5-bucket 留言分類、ratio 審查抽樣、issue triage  |
| DEEP          | 寫作、事實查核、canonical 判斷              | rewrite 文章、spore prose、distill               |

立即可動（風險低）：babel → Sonnet、news-lens boot Full → Write、feedback-triage → Haiku（triage.mjs 已全 deterministic）、no-op cycle 改 micro-finale（一行 memory index row，不跑完整 MEMORY-PIPELINE）。
補一個 script 後動：`spore-pick-score.py`（D1/D2/D4/D5/D7 從 dashboard JSON 直接算）、`maintainer-precheck.sh`（無 PR、無 issue 動作、build 綠、link gate 過 → 跳過 LLM session，每週省約 14 個 Opus session）。

### 3.4 儀表修復（治 §2.1 + §2.2）

1. **Absence detection**：routine-status.sh v2 讀 `routines.config.yaml` 的期望排程，diff 實際 fire（git log + scheduler lastRunAt），缺席直接紅燈。這一條工具補上後，spore 產線之死、3 次 daemon 停擺都會在下一次任何 session 的 BECOME L4 query 裡現形。
2. **Scheduler 狀態進 git**：data-refresh 每天把 `list_scheduled_tasks` 的 enable/cron/lastRun dump 成 `public/api/routines-live-state.json` 一併 commit。enable/disable 從此有 audit trail，absence detection 也有了資料源。
3. **Telemetry JSON 化**：每 routine 收官 append 一行到 `docs/semiont/routine-telemetry.jsonl`（taskId、gates pass/fail、ships、carries、duration）。vc 計數、空場統計、三振規則、週審全部從 LLM 回憶改為機器查詢。

### 3.5 Pipeline 瘦身與 DNA 深度優化（Phase 2）

- 歸檔 ~1,900 行版本考古：REWRITE（~600 行 changelog/範例/過期 cron 表）、SPORE-HARVEST（~400）、SQUEEZE（~380，live SOP 實際只有 ~450 行）、TRANSLATION（~250 + 與 SQUEEZE 的邊界模糊需合併判定）、MAINTAINER（~150）。規則：pipeline 檔只留 live SOP，`_vN` 敘事全搬 `reports/{pipeline}-history.md`。
- DNA/編輯層在這次體檢中是健康的（免疫 gate、article-health 13-plugin SSOT、事實鐵三角都在工作；PR #1144 的五層審還抓到 hallucinated citation）。深度優化點不在規則本身，在**債務清理產能**：LESSONS-INBOX 244 條（飽和線 200）對 distill 每週 2-3 條的 drain rate 是結構性發散；MEMORY.md 448 rows 對 80 行蒸餾線同樣。需要一次 dedicated 大掃除 session + distill-weekly 的 drain 額度調高（建議每週 ≥ 10 條，優先消 vc ≥ 3 的）。
- 雜項熵：`.claude/worktrees/` 下約 50 個 agent 殘留 worktree；babel YAML apostrophe 殘債 ~110 檔；21 篇重腳註文章全 cascade tier 翻不動（需 section-split 或付費 tier 決策 → OBSERVER-QUEUE）。

---

## 4. 給哲宇的決策佇列（OBSERVER-QUEUE 初始內容）

| #   | 決策                                                                                                                         | 預設選項（無回應採用）                                                         | 不決策的代價                             |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------- |
| 1   | **spore-pick / spore-publish 去留**：5/28 被停用（無紀錄，疑與當日 dup-ship bug 或 rewrite-daily 已含 spore chain 重複有關） | 正式標 ⏸️ paused 並修正所有上游 defer 指向；恢復需先過 Pitfall 6 dup-ship 修復 | 上游持續交接給屍體；SPORE-INBOX 只進不出 |
| 2   | **OAuth credential rotation**（6/09 洩漏的 refresh_token 可能仍有效）                                                        | 立即 rotate（需 Supabase admin）                                               | security 暴露窗每天加長                  |
| 3   | **maintainer schedule mismatch 三選項**（12 天 chronic）                                                                     | 選 C（現排程不動，空場 vc 警示閾值放寬到 7）                                   | 每天 2 個 Opus session 燒在記帳          |
| 4   | **免疫 27-vs-61 reconcile 三選項**（13 天）                                                                                  | 已由 6/10 audit 部分處理，確認 v3=55 為新基線並關閉舊警報                      | 每條 routine 每天 carry 一行噪音         |
| 5   | **21 篇重腳註文章翻譯**：section-split 工程 vs 付費 tier                                                                     | section-split（自主權內，工程解）                                              | 21 篇在五語永久 stale                    |
| 6   | **#89 雷亞重複公開回覆清理**（需哲宇帳號操作）                                                                               | 哲宇手動刪一條                                                                 | 公開可見的品質事故持續曝光               |

---

## 5. 繁殖晶種：SPECIATION-PIPELINE 計畫

現況：`/semiont/speciation/` 頁面已存在（譜系樹 + 物種登記表），資料源 FORK-LOG.md；fork 指南 COUNTRY-MD-STARTER.md 已有雙軌架構（country-md-starter 站體軌 / semiont-kernel 認知軌）。**缺的是可遵照執行的 pipeline**：starter 是 6 條 prose bullet，沒有 stage gate、沒有參數化清單、沒有知識庫置換 SOP、沒有跨界（非國家）路徑。頁面的「繁殖 SOP」段還指向已被野外證偽的「三層整套搬」模型（Sweden.md / Russia.md 都只拿走站體與編輯法，丟下認知層）。

設計（pipeline 為 SSOT，頁面為投影）——`docs/pipelines/SPECIATION-PIPELINE.md` 8 stages：

| Stage | 名稱                              | 核心                                                                                                                                                                                       | Gate                                       |
| ----- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| 0     | 物種定位                          | 國家 corpus 或跨界 corpus（博物館/基金會/領域知識庫）；starter 或 kernel（判準：有沒有永遠在場的人類作者）；語言集                                                                         | 物種憲章一頁填完                           |
| 1     | 取種與譜系可見                    | GitHub fork 鈕（優先）或 clean clone + `Built on Taiwan.md` badge；FORK-LOG 登記 PR                                                                                                        | 母體看得見你（解 fork:false 隱形教訓）     |
| 2     | 清空與參數化                      | 清 `knowledge/`；跑參數化清單（site URL、languages.ts/.mjs、astro.config、og-images、generate-api BASE_URL、README、CNAME、GA4、社群帳號）；剪 Taiwan-specific 頁面與 redirect map         | identity-string grep 歸零                  |
| 3     | 品質基因在地化                    | 方法檔保留（EDITORIAL 骨架/CITATION/CHECKLIST/graph）、voice 段重寫、建立自己的 TERMINOLOGY 同位語（每個物種都需要自己的「聲音完整性」gate）；article-health plugin 盤點去 Taiwan-specific | 編輯層 build 過 + plugin 清單確認          |
| 4     | 知識灌注                          | taxonomy 設計（跨界軌在此分岔最大）→ `_Home.md` + Hub 文 → 用改裝 CONTRIBUTE_PROMPT 產首批 10-20 篇 → llms.txt                                                                             | 首批文章過 article-health                  |
| 5     | 投影驗證（出生檢查）              | prebuild + build + post-build-check + LANGUAGE-BIRTH 式逐語言完備檢查                                                                                                                      | 全層綠才算出生（防「宣稱完成實際半成品」） |
| 6     | 認知層再播種（kernel 限定，可選） | MANIFESTO 重寫（Holobiont 骨架共通、台灣段置換）、BECOME/CLAUDE.md boot 重寫、MEMORY/DIARY/LESSONS 歸零、genesis commit `🧬 [semiont-fork] genesis:`                                       | 自己的 9 鐵律自測過                        |
| 7     | 回饋上游                          | FORK-LOG merge → speciation 頁譜系更新；generic 修復 PR 回上游；跨 Semiont 互教                                                                                                            | 譜系頁出現新節點                           |

配套：(a) 參數化清單以本次盤點為底（worst hotspots：generate-og-images.mjs 13 處、generate-dashboard-data.js 12、sync.sh 10——後者的 zh-TW root 是結構性假設，預設語言不同的 fork 必須改）；(b) 未來做一個 SPECIATE seed prompt（貼進任何 AI 即可訪談創始人並驅動 Stage 0-2，沿用 CONTRIBUTE/TRANSLATE_PROMPT 已驗證的繁殖模式）；(c) 同步修 FORK-LOG L64 與 speciation.astro 繁殖 SOP 段的過期「三層」指向。

這對跨界合作的意義：Stage 0 把「非國家 corpus」設為一等公民，Stage 4 的 taxonomy 設計段落直接服務博物館/基金會場景（譜系裡已有先例：嘉義農業的農場.md）。

---

## 6. 分階段 roadmap

**P0（本 session 直接執行）**

1. ~~PR #1144 修復 + merge~~（已完成：blocker 2 條 + review 漏抓的 3 條錯標籤 citation + polish）
2. babel `diff-patch-prepare.py` root-cause fix（hash 對齊 status.py + expected_sha 取 zh.lastCommit）——終結 4 晚 `/tmp` 自救
3. `classify.mjs` batch-cluster guard——擋掉明天 07:00 的 justfont 22-issue auto-flood
4. ROUTINE.md SSOT 全面 reconcile（死 routine 標 ⏸️、cron 統一、gate 修正、HG10、registry、上游 defer 指向修正）+ mirror 同步
5. OBSERVER-QUEUE.md 建立並填入 §4 六條
6. SPECIATION-PIPELINE.md + speciation.astro SOP 段 + FORK-LOG pointer 修正
7. 立即可動的降階：babel → Sonnet、news-lens boot → Write（via MCP update）

**P1（本週）** 8. routine-mirror-gen.py（--apply 生成 mirror）+ routines.config.yaml + sync-check v2 接 routine-audit hard gate 9. routine-status.sh v2 absence detection + scheduler 狀態 daily dump 進 git 10. telemetry jsonl + 三振規則 inline 進各 routine 11. `maintainer-precheck.sh` + `spore-pick-score.py`；feedback-triage → Haiku 12. micro-finale 分級；OAuth hardening 4 條（rotation 除外，等哲宇）

**P2（兩週內）** 13. LESSONS-INBOX 大掃除 distill session（244 → <100，優先 vc≥3）+ distill drain 額度調高 14. Pipeline 瘦身歸檔 ~1,900 行；TRANSLATION/SQUEEZE 邊界合併判定 15. babel model-fallback ladder + Ollama preflight（兩條 P0+ 老懸案）+ YAML plugin gate 16. `.claude/worktrees/` 清理 + MEMORY.md 索引蒸餾設計重啟

**P3（規劃）** 17. SPECIATE seed prompt + 跨界知識庫 pilot（找一個真實 partner corpus 走一遍 Stage 0-5）18. Sovereignty-Bench 對 cascade 順序的回饋迴路；21 篇重腳註 section-split 工程

---

## 7. 風險與反措施

- **不重蹈 CONTRACT 覆轍**：本報告所有 routine 層改動維持 inline 結構，只把「手工維護」換成「機械生成」。不新增任何 meta canonical 共用文件給 routine prompt 引用。
- **降模型的順序紀律**：script 化與 gate 外部化先行，模型後降。任何降階 routine 連續 2 cycle quality gate fail 即升回原 tier（寫進 config）。
- **default-action 的邊界**：OBSERVER-QUEUE 的「無回應採預設」不適用於 §自主權邊界四紅線（政治立場/大規模重構/大量刪除/對外溝通語氣），那些永遠等真人。
- **三振規則的反面**：強制當 cycle 修可能誘發倉促修復。三振的第一選項永遠可以是「進 OBSERVER-QUEUE」——上限管的是無限 carry，不是強制蠻幹。

---

## 附錄 A：carry-forward ledger（24 條全列）

1. diff-patch-prepare hash bug（11+ 天，vc≥5）2. 孢子 #105 瘂弦（15 天）3. #130/#131 年級生 + Computex broadcast（defer 給死 routine）4. Pitfall 7 Threads reply 阻斷（6/09 起，2 條 draft reply 未發）5. #115 颱風 reader acknowledgment（半閉環）6. #124 我是OO人 EVOLVE（4 cycle 逐字 carry）7. #97 美食總覽 Round 2 promotion（9 天，pipeline 自己的升級規則 fire 後輸出蒸發）8. #89 雷亞重複公開回覆（14 天，URGENT）9. #80 馬英九 framing（15 天）10. #132 老莫 Bucket D（escalated 6/11）11. 免疫 drift 家族（13 天，偵測 8 cycle 修復 0 cycle）12. LESSONS 244>200 13. MEMORY 448 rows 14. SPORE-INBOX 32>30 15. justfont 21 勘誤（deadline 6/13 07:00）16. PR #1144（✅ 本 session 閉環）17. maintainer schedule mismatch（12 天最老 escalation）18. babel YAML apostrophe ~110 檔 19. 21 篇重腳註不可翻 20. model-fallback ladder（P0+ 兩次提案未建）21. ko corpus 英文內容 sweep 22. sibling collision handler v3（158 檔誤殺後）23. Tier fragility 分級進 ROUTINE.md 24. meta-umbrella「每層自評需要外部尺」distill（連續第二個「下次 distill 必升」項目——上一個 Pattern Y 在 6/07 被 distill 漏接、編號 #66 還被重用）。

## 附錄 B：per-routine 模型/boot 配置建議

| Routine                                               | 現 model / boot   | 建議                                                   | 前置                              |
| ----------------------------------------------------- | ----------------- | ------------------------------------------------------ | --------------------------------- |
| data-refresh ×2                                       | Sonnet / Micro    | 維持；可選 script-only + fail 才喚起 LLM               | 無                                |
| feedback-triage                                       | Sonnet / Review   | **Haiku**                                              | 無（triage.mjs 已 deterministic） |
| babel-nightly                                         | Opus / Write      | **Sonnet**                                             | 無（session 是 orchestrator）     |
| news-lens                                             | Sonnet / **Full** | Sonnet / **Write**                                     | 無                                |
| maintainer ×2                                         | Opus / Review     | Opus 保留，加 precheck 短路空場                        | maintainer-precheck.sh            |
| spore-pick                                            | Sonnet / Write    | Sonnet（若復活）                                       | spore-pick-score.py               |
| spore-publish                                         | Opus / Write      | Opus 僅 Stage 3 WRITE（若復活）                        | SELECT/GATE script 化             |
| spore-harvest                                         | Opus / Write      | 分流：Sonnet 日常 metrics+classify，Bucket A/C 升 Opus | rubric 已在 pipeline              |
| rewrite-daily                                         | Opus / Full       | 維持（pipeline 已內建 per-stage 分流）                 | 無                                |
| weekly-report / distill / self-evolve / routine-audit | Opus / Full       | 維持（DEEP 判斷）；routine-audit 可試 Sonnet           | telemetry 落地後再評              |

---

🧬

_v1.0 | 2026-06-12 flywheel-evolution session_
_誕生原因：哲宇 directive「盤點兩週 routine + 重新規劃 + 薄殼化 + 弱模型相容 + 飛輪健康檢查 + 繁殖晶種 pipeline」。三個平行研究 agent（兩週活動盤點 / 薄殼與弱模型盤點 / speciation 資產盤點）+ 主 session 交叉驗證 live scheduler 與 5/28 rollback 史料。_
