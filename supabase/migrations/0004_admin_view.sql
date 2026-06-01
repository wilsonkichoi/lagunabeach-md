-- ════════════════════════════════════════════════════════════════════════════
-- Taiwan.md feedback — 管理視圖 feedback_admin  (0004)
--
-- 哲宇一行看全部回報：`select * from feedback_admin;`（含 email + 暱稱 + 狀態 + issue）。
--
-- 🔴 安全鐵律：Postgres view 預設繞過底層表 RLS。這個 view join 了 profiles.email（PII），
--    所以**必須**擋掉 anon + authenticated，否則任何人拿 anon key 打 REST 就能讀到所有 email。
--    雙重保護：
--      (1) security_invoker = true — view 改用「查詢者的權限」跑（anon 經 REST → 套 anon 的 RLS
--          → 看不到任何列；service_role / dashboard postgres → bypass RLS → 看全部）。
--      (2) revoke from anon, authenticated — 明確撤掉 REST 角色的存取（belt + suspenders）。
--    哲宇在 Dashboard 的 SQL Editor / Table Editor 用 postgres/service_role 角色 → 照樣看全部。
-- ════════════════════════════════════════════════════════════════════════════

create or replace view public.feedback_admin
with (security_invoker = true) as
select
  f.created_at,
  f.display_name as nickname,
  p.email,
  f.type,
  f.status,
  f.page_kind,
  f.article_title,
  f.article_slug,
  f.lang,
  f.body,
  f.quote,
  f.correct_info,
  f.source_url,
  f.issue_number,
  f.issue_url,
  f.triage_note,
  f.triaged_at,
  f.id,
  f.uid
from public.feedback f
left join public.profiles p on p.uid = f.uid
order by f.created_at desc;

-- 撤掉 public REST 角色（只留 service_role / dashboard owner 看得到 email）。
revoke all on public.feedback_admin from anon, authenticated;
