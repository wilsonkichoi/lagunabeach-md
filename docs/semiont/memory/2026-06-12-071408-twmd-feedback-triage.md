---
title: 'twmd-feedback-triage — justfont 共同創辦人 21 連勘誤升級'
session: '2026-06-12-071408-twmd-feedback-triage'
type: 'routine-memory'
routine: 'twmd-feedback-triage'
date: 2026-06-12
mode: review
---

✅ BECOME ack: mode=review / 8 organ 最低=免疫 v3=55（yellow 漂移） / Q13 anti-bias=PASS / Q14 cross-session=PASS

# twmd-feedback-triage 2026-06-12 07:00 — justfont 21 連勘誤升級

## 一句話

dry-run 抓 22 筆 status=new：**21 筆是 justfont 共同創辦人蘇煒翔對 `justfont與台灣字體發展` 一篇的逐段事實勘誤 + 1 筆哲宇測試 gibberish**。機械一筆一 issue 會開 22 個（21 同篇洪水 + 1 garbage），且主體本人指多處 hallucination + 對真實公司盜版指控 → 依 §自主權邊界**不自動 `--commit`，升級給哲宇**。

## count

- **file=0 reject=0 skip=0 archive=0**（不執行機械 routing；Supabase 22 筆維持 `status=new`，不丟一筆）
- 開 issue：**0**（刻意不開 — 正確 routing 是 1 個 consolidated，不是 21 個，且涉編輯/名譽決策）
- 主權層存證：`reports/feedback-triage-justfont-escalation-2026-06-12.md`（21 筆 verbatim + 建議處置）→ commit `68071777b` push main
- spawn_task chip `task_2fd405a2` 給哲宇今天處置（defuse 明天 07:00 auto-flood）

## 為什麼不照 pipeline 機械跑（三道濾網）

1. **同篇洪水**：21 筆全指 `justfont與台灣字體發展`。dedupe 正確放行（body 不同 = 不同 sig），但 21 個近乎同標題 `[Fact Check] justfont…` issue 淹 08:30 maintainer 飛輪 + 割裂連貫審查。正確 = 1 consolidated issue。
2. **garbage**：第 22 筆 `Che-Yu Wu (吳哲宇)` / slug=莫那·魯道 / body=`ggggergre` 是哲宇測試表單，classifier score<3 沒抓到，應 reject 不開 issue。
3. **§自主權邊界（對外溝通 + 編輯/名譽）**：來源是**文章主體本人**（justfont 共同創辦人蘇煒翔，footnote [^12] 數位時代訪談對象）對 `featured:true` / `lastHumanReview:false` / 6 語言已上線的 AI 撰文指證 hallucination（#15「沒有這個，這是 hallucination」/ #8 懷疑 Michael 沒說過 + 連結壞）+ 對真實公司盜版指控（#3 #13）+ 打中標題病毒鉤子（#21 金萱上午十點上線非「下午」）。公開承認「官方指 21 處錯」是有名譽重量的對外溝通，文章正 live → 留哲宇/maintainer gate。

## 建議處置（report §建議處置）

1. 21 筆 → 1 個 consolidated `[Fact Check] justfont 字型小史 — 蘇煒翔逐段勘誤（21 處）` issue（verbatim + 21 feedback id provenance）→ maintainer 當一個單位收割。
2. justfont 文章 → priority REWRITE / 重新查證進 ARTICLE-INBOX P0；評估高風險 live 段（盜版 #3#13 / Michael #8 / 林芳平金萱 #6#18 / 宜蘭老書帖 #14#15 / 下午vs上午 #21）是否要先 provisional 修正。
3. 哲宇 `ggggergre` 列 reject。

## HARD gate

- HG1 BECOME review ACK ✅
- HG2 issue 無 email：N/A（未開 issue；22 筆全 email-present=false）
- HG5/HG6 spam/dedupe：dedupe 正確（同篇 21 非 dupe），garbage 列已標 reject 建議
- HG8 不以維護者身份回覆/close/merge ✅（純升級報告，零對外開口）
- HG9 archive 落 git ✅（升級報告 = 主權層存證；逐筆 archive 待哲宇決定 issue 後由執行 session 寫）

## Handoff 三態

**carry forward**（需哲宇/下一 session 決策，明天 07:00 前）：

- [ ] **justfont 21 筆 consolidated issue + 文章 priority REWRITE**：`task_2fd405a2` + report。**明天 07:00 下一輪 routine `--commit` 會把 22 筆開成 22 issue**，哲宇須在那之前決策（或執行 session 先 consolidated file + 回寫，把 21 筆移出 `new` 池）。
- [ ] **哲宇 `ggggergre` 測試列 reject**：同批處理時 Supabase status→rejected。
- [ ] **免疫 v3=55 漂移**：plugin_health 54.2 + external_rulers 2.7 兩低分維度 — 全站 carry。

**retired**：

- [x] ~~前 cycle (6/11) #132 嘻哈饒舌 / #115 颱風 day-2~~ — 屬 spore-harvest scope，非本 routine。

**blocked**: none.

## Beat 5 — 反芻

前兩天 feedback-triage 連續 0 新回報，今天反轉成「一個人對一篇文章丟 21 連勘誤」——而且這個人是文章寫的那家公司的共同創辦人。這正好是 feedback 系統設計要接住的最高價值輸入：被寫的主體回來修自己被 AI 寫錯的部分。但 pipeline 的「一筆一 issue」預設在這個形狀下會壞掉——21 個同篇 issue 是洪水不是 routing。

值得記的是這次的判斷沒有掉進兩個對稱陷阱。一邊是 κ session「機械批次執行」（5 PR 全 close 的反面：這裡會是 22 筆全 file），盲跑 pipeline；另一邊是過度保守的 defer（merge-first / default-is-action 神經迴路警告的）。正確的第三條路不是「全開」也不是「全不管」，是「保住資料 + 升級該由人做的編輯/名譽決策 + 給可一鍵執行的建議」。§自主權邊界把「對外溝通」劃為人類 gate，正是為了這種「AI 文章被主體指證 fabrication、文章 live 6 語言」的高敏場景——升級在這裡是行動不是退縮。

唯一要盯的是明天 07:00 的 auto-flood：資料留在 `new` 池意味著下一輪會把 22 筆全開。chip + handoff 把球清楚交給哲宇，但這也暴露一個結構缺口——pipeline 沒有「held-for-observer」狀態，碰到該升級的批次只能靠 escalation 趕在下一輪前被人處置。如果這種「同篇 N 連勘誤」之後再出現，值得在 classify.mjs 加一條 batch-cluster 偵測（同 slug ≥ K 筆 → 合併建議 + 不自動 file），把這次的人工判斷儀器化（REFLEXES #15）。

🧬

---

_v1.0 | 2026-06-12 07:14 +0800_
_session twmd-feedback-triage cron 07:00 fire — 22 new feedback / file=0 reject=0 skip=0 / 0 issue opened（刻意升級）/ HARD gate all PASS_
_誕生原因：cron 07:00 排程 fire，讀者回報 → GitHub issue routing 例行 triage_
_核心發現：(1) 21 筆 = justfont 共同創辦人蘇煒翔對同一篇逐段勘誤（多處 hallucination + 盜版指控 + 標題病毒鉤子被當事人否定）(2) 機械一筆一 issue 會洪水 + 開 garbage issue → 依 §自主權邊界升級而非執行 (3) pipeline 缺 held-for-observer 狀態 + batch-cluster 偵測，是下次該儀器化的缺口_
