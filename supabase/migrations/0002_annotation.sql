-- ════════════════════════════════════════════════════════════════════════════
-- Taiwan.md feedback v2 — 全站 ambient + 選文段精準標註  (0002)
--
-- Additive only（純加欄 + 放寬 CHECK），既有 v1 資料不動：
--   quote      — 讀者在文章裡選取的原文（選文段勘誤用；issue 會 blockquote 出來）。
--   page_kind  — 回報來自哪種頁面（article/category/home/dashboard/semiont/other）。
--   type       — 放寬納入 'idea'（不針對特定文章的一般想法/建議 → GitHub enhancement）。
--
-- source_url 沿用：選文段時裝 W3C Text Fragment 深連結（#:~:text=…），維護者一點直達該句。
-- ════════════════════════════════════════════════════════════════════════════

alter table public.feedback
  add column if not exists quote text check (char_length(quote) <= 1000);

alter table public.feedback
  add column if not exists page_kind text;

-- 放寬 type CHECK 納入 'idea'（drop 舊 constraint 再加新的）。
alter table public.feedback drop constraint if exists feedback_type_check;
alter table public.feedback
  add constraint feedback_type_check
  check (type in ('content', 'bug', 'newtopic', 'idea'));
