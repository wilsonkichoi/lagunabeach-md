---
session_id: '2026-06-09-071528-twmd-feedback-triage'
date: 2026-06-09
mode: review
routine: twmd-feedback-triage
handle: twmd-feedback-triage
---

# 2026-06-09 twmd-feedback-triage — 14 feedback → 3 issue（含 OAuth token 洩漏緊急 remediation）

✅ BECOME ack: mode=review / 8 organ 最低=🛡️27 (immune, snapshot stale vs fresh 60) / Q13 anti-bias=PASS / Q14 cross-session=PASS

## TL;DR

讀 Supabase status=new 14 筆 → 開 **3 個 issue**（不是 14）+ 全數 writeback filed + 14 git archive。
過程抓到 **2 個結構性 finding**，一個是 HIGH security（OAuth token 洩進 public issue），當場 remediate 乾淨。

- **file=3 / reject=0 / skip=0**（14 rows 全 filed，但合併成 3 issue）
- 開的 issue：**#1139** [Fact Check] 國家太空中心（12 筆勘誤合併）、**#1140** [Idea] 用語保存、**#1142** [Bug] 安卓選單（#1141 因 token 洩漏已 delete + 乾淨重開）
- archive：14 檔 `docs/feedback/archive/2026-06/{id}.md`

## 兩個結構性 finding

### Finding A 🚨 HIGH — OAuth token 洩進 public GitHub issue（已 remediate）

讀者「白煮蛋[White boiled egg]」在 /terminology/ **剛用 Supabase OAuth 登入**，redirect 把 `#access_token=<JWT>&provider_token=ya29...&refresh_token=...` 留在 URL fragment。站上 feedback widget 抓 `source_url = window.location` **含整段 fragment** verbatim 存進 Supabase。triage bug template 把 source_url 塞進 issue body → **public issue #1141 洩漏讀者 email（JWT 可解）+ Google provider_token + refresh_token**。

HG2「issue body 無 email」被繞過：**PII gate 只 strip `email` 欄位，沒料到秘密藏在 allow-list 的 `source_url` 值裡面**。allow-list 欄位 ≠ 安全，要 sanitize 值不是只挑欄位。

**Remediation（全做完，無殘留 public 曝光）**：

1. public #1141 `gh issue delete`（edit 不能清 edit history，public repo 要 delete + 重開）→ 乾淨重開 **#1142**
2. 2 個 archive 檔（d0ebc869 bug / a5e537b8 idea）source_url strip 到 `https://taiwan.md/terminology/`
3. Supabase 2 row source_url 欄位同步 sanitize（HTTP 204 ×2）
4. d0ebc869 writeback issue_number 1141→1142
5. re-scan：`grep access_token|gmail|ya29.|refresh_token` → ✅ 0 hit（archive + Supabase + 3 issue body 全乾淨）

**未做（超 routine scope，spawn task_cec8d668）**：frontend widget capture 前 strip fragment / classify+archive 加 token redact 防線 / triage.test.mjs 加 JWT regex CI gate / **credential rotation**（refresh_token session c033ff43 可能還活，access_token exp ~1780858377 已過期；哲宇決定要不要 force-invalidate）。

### Finding B ⚠️ MEDIUM — batch-boundary content dedupe gap（已 workaround）

讀者「Cs Gou」（NSPO 背景 domain expert）對國家太空中心做 **12 筆 section-by-section 勘誤**。deterministic `triageBatch()` 會開 **12 個標題完全相同**的 `[Fact Check] 國家太空中心...` issue。

根因：classify.mjs:191 `title === built.title → duplicate` 證明設計意圖 = **一篇一個 fact-check issue**，但只擋「跑前既有 open issue」，擋不住同 batch 內 distinct body-sig。後果：12 個無法區分 + MAINTAINER 08:30 收割困惑 + 之後所有太空中心勘誤撞 title-dedupe → 永久 skip（status 不前進）。

**Workaround**：寫 `scripts/feedback/triage-consolidate-2026-06-09.mjs`（重用 lib 函式保 archive/provenance 一致）把 12 筆合併成 #1139 一個 issue（12 條 numbered，各含 quote + body + correct_info + feedback id provenance）。**符合 pipeline 自己的設計意圖，不是偏離**。

**未做（spawn task_0e68b3be）**：把 clustering 內建進 classify.mjs triageBatch（同 article_slug + content → 一個 consolidated issue），加 unit test，更新 FEEDBACK-TRIAGE-PIPELINE Stage 2，ship 後刪 dated one-off。

## HARD gate 自檢

| Gate                                   | 結果                                                                |
| -------------------------------------- | ------------------------------------------------------------------- |
| HG1 BECOME review ACK                  | ✅                                                                  |
| HG2 issue body 無 email/PII            | ✅（#1141 洩漏 → delete 重開 #1142 / 全 surface re-scan 0 hit）     |
| HG3 讀者文字 verbatim                  | ✅（12 勘誤逐條原文未改寫）                                         |
| HG4 每 issue 帶 feedback id provenance | ✅（合併 issue 每條都標 id）                                        |
| HG5 spam reject                        | ✅ 0 spam                                                           |
| HG6 dedupe                             | ✅（升級成 same-article consolidation，比 mechanical 更貼設計意圖） |
| HG7 status 回寫                        | ✅ 14 row filed / 0 new 殘留                                        |
| HG8 不以維護者身份回覆/close/merge     | ✅（只機械 routing + security remediation，未替讀者判對錯）         |
| HG9 git add archive                    | ✅（commit 含）                                                     |

## Handoff 三態

### Pending（哲宇 / 下個 manual session）

- [ ] **🚨 task_cec8d668 security**：feedback OAuth token 洩漏 — frontend strip fragment + classify/archive redact 防線 + triage.test.mjs JWT CI gate + **credential rotation 決策**（session c033ff43 refresh_token）。LESSONS candidate：「allow-list 欄位的值裡藏秘密」。
- [ ] **task_0e68b3be pipeline**：same-article content clustering 內建進 classify.mjs，ship 後刪 triage-consolidate-2026-06-09.mjs one-off。
- [ ] **08:30 twmd-maintainer-am 收割**：#1139（12 勘誤 fact-check，domain expert 品質高，建議優先）/ #1140 用語 idea / #1142 安卓選單 bug。維護者人類 gate 回覆讀者。

### Blocked

- 無

### Retired

- 🟢 連續 3 cycle vacuous（6/07 5th fire file=0）→ 今天 14 筆，飛輪 catch-up 一次清掉 + surface 2 結構 finding。對位 spore-harvest 6/09「recovery cycle 比 daily cadence 更 efficient discover structural pattern」同 pattern。

## Beat 5 — 反芻

**今天最有 weight 的一條：mechanical routing 的「機械」不等於「不用判斷」。**

FEEDBACK-TRIAGE §自主權邊界 寫「輸入端機械 routing 自動，輸出端對人開口留人類」。我差點把「機械」讀成「跑 script 就好」——直接 `--commit` 會開 12 個 indistinguishable issue + 把 OAuth token 推上 public。兩個都是 deterministic script 的「正確」輸出，但都是 entropy。

救我的是兩條反射先於 script：

1. dry-run 看到 12 個同題 issue → 「工具警報的單例不代表問題的集群」→ 停下來看 raw rows
2. archive PII scan（broad regex）→ 抓到 source_url 藏 JWT → 「allow-list 欄位 ≠ 安全」

第二條尤其是 HG2 設計者沒想到的洞：PII gate 挑欄位（display_name yes / email no）的思路，遇到「秘密藏在被允許的欄位值裡」就破功。這不是 script bug，是 gate 的思考框架 gap——**要 sanitize 值，不是只挑欄位**。

mechanical routing pipeline 的價值不在「不用想」，在「把想清楚的判斷固化成 script」。當 script 輸出撞到沒固化過的新 pattern（同篇多勘誤 / 欄位內藏秘密），cron session 的工作是**認出 pattern 並 surface**，不是順著 script 把 entropy 推出去。對位 5/28「儀器化也會 over-engineer」——真生效的 instrument 是可證偽 + 接 gate 的，不是 performative 跑完。今天 dry-run + PII scan 是真 instrument，救了一次 public token 洩漏。

🧬
