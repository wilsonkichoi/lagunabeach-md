---
session_id: '2026-06-14-070727-twmd-feedback-triage'
type: 'routine-log'
routine: 'twmd-feedback-triage'
mode: 'review'
date: '2026-06-14'
---

✅ BECOME ack: mode=review / 8 organ 最低=🛡️免疫 v3=55（yellow 漂移）/ Q13 anti-bias=PASS / Q14 cross-session=PASS

# twmd-feedback-triage — 2026-06-14 07:00

讀者站上回報 → GitHub issue 機械 routing，接 MAINTAINER 飛輪。env (`~/.taiwanmd-feedback.env`) 已配置，Supabase 連得上。

## 處置

- **fetched 1 / file=1 / reject=0 / skip=0 / hold=0**
- dry-run 先看分類（HG5 spam / HG6 dedupe 都過）→ `--commit` ship。
- 開 issue [#1147](https://github.com/frank890417/taiwan-md/issues/1147) `[Fact Check]` · labels `needs-verification` + `from-feedback`
- 主題：justfont 與台灣字體發展。讀者署名 **「justfont 煒翔」**——回報的是文章主角本人（蘇煒翔，justfont 共同創辦人）。指出文章先寫「跟字體研究者柯志杰一起」但共著《字型散步》的另一人是蘇煒翔，名字在下一段才出現，屬寫作順序的小瑕疵。
- archive 落 git：`docs/feedback/archive/2026-06/458760dc-37d5-4e4d-b0cb-fea8348286f0.md`（HG9）

## HARD gate 驗證

- HG2 無 email：✅ issue body + archive 只放 display_name「justfont 煒翔」，零 PII
- HG3 verbatim：✅ 讀者原文未改寫
- HG4 provenance：✅ feedback id `458760dc…` 入 body + archive
- HG8 不以維護者身份回覆/close/merge：✅ 只開 issue，查核留 08:30 twmd-maintainer-am 人類 gate
- archive-comments-synced=0（issue 剛開，無留言可 sync）

## commit scope（胼胝體鐵律 §8）

working tree 有大量他 session/routine 未 commit 檔（babel-patches / research draft / weekly dossier / SPORE blueprint / src/i18n）—— **非本任務範疇，不碰**。只 stage：本 memory + archive + MEMORY index row。

## Handoff 三態

- **接住的事**：#1147 已開 + push main。Supabase status=filed 回寫完成。archive 入 git。
- **待續**：#1147 由 08:30 twmd-maintainer-am 收割 → 維護者查核 justfont 名字歸屬（蘇煒翔）後 heal/REWRITE + 回覆讀者（人類 gate）。這是文章主角本人勘誤，回覆優先級高。
- **沒接的事**：working tree 他 session 滯留檔（非本 routine 範疇）；LESSONS-INBOX 未消化 253 條 + MEMORY index 膨脹（兩條已知 yellow，留 distill-weekly）。

## Beat 5 反芻

值得記一條：這筆回報的署名是「justfont 煒翔」——**被寫的人來修自己的條目**。Taiwan.md 寫人物 / 組織時，主角本人有可能成為最精準的 fact-checker。feedback 系統把「主角校稿」這條路打通了（站上回報 → verbatim → issue → 維護者），比我自己事後 cross-validation 更可靠。下次寫在世人物 / 現存組織時，可意識到「他們可能會來看、會來修」是品質的外部約束，也是信任訊號（[[error_boundary_traceability]] traceable error → public handle）。

🧬
