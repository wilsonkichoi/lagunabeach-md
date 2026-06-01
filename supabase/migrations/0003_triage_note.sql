-- ════════════════════════════════════════════════════════════════════════════
-- Taiwan.md feedback v3 — AI 初判理由透明化（Grokipedia「Grok Feedback」對應）(0003)
--
-- triage_note：cron triage 對每筆回報的「機械初判 + 分類理由」（可驗證/待查/為何分這類）。
-- 讀者在 widget「我的回報」看得到 → 閉環可見性 + 透明度。
--
-- §自主權邊界：triage_note 是 AI 機械初判（輸入端處理），不是維護者對讀者的正式回覆
--             （那仍走 MAINTAINER 人類 gate）。措辭中性、標「初步自動初判」。
-- Additive only。
-- ════════════════════════════════════════════════════════════════════════════

alter table public.feedback
  add column if not exists triage_note text check (char_length(triage_note) <= 2000);
