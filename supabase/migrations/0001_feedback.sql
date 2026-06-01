-- ════════════════════════════════════════════════════════════════════════════
-- Taiwan.md feedback 子系統 schema  (0001)
--
-- 兩張表：
--   profiles  — 一個登入者一列。email 落地在這裡（goal:「帳號至少要拿到 email」）。
--               nickname 選填，留空時 widget 端回退成帳號（見 resolveDisplayName）。
--   feedback  — 一筆讀者回報。只存 display_name（暱稱/回退名），不存 email
--               （email 是 PII，留在 profiles；public GitHub issue 永遠不該有 email）。
--
-- 安全：RLS 全開。登入者只能 insert / select 自己的列。cron triage 用 service_role
-- key 繞過 RLS 讀全部 status='new'。anon key 在前端是安全的（RLS 把關）。
-- ════════════════════════════════════════════════════════════════════════════

-- ── profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  uid         uuid primary key references auth.users (id) on delete cascade,
  email       text,
  nickname    text check (char_length(nickname) <= 40),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = uid);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert with check (auth.uid() = uid);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = uid) with check (auth.uid() = uid);

-- ── feedback ────────────────────────────────────────────────────────────────
create table if not exists public.feedback (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  uid           uuid not null references auth.users (id) on delete cascade,
  display_name  text not null,                          -- 暱稱/回退名（issue 署名用，非 email）
  article_slug  text,
  article_title text,
  category      text,                                   -- category slug（history/food/...）
  lang          text,                                   -- zh-TW/en/ja/ko/es/fr
  source_url    text,
  type          text not null check (type in ('content','bug','newtopic')),
  body          text not null check (char_length(body) between 4 and 4000),
  correct_info  text check (char_length(correct_info) <= 4000),
  status        text not null default 'new'
                  check (status in ('new','filed','rejected')),
  issue_url     text,                                   -- triage 回寫
  issue_number  integer,                                -- triage 回寫
  triaged_at    timestamptz
);

create index if not exists feedback_status_idx on public.feedback (status, created_at);
create index if not exists feedback_uid_idx on public.feedback (uid);

alter table public.feedback enable row level security;

-- 登入者只能 insert 自己的回報，且 status 必須是 'new'（不能自己標 filed/rejected）。
drop policy if exists feedback_insert_own on public.feedback;
create policy feedback_insert_own on public.feedback
  for insert with check (auth.uid() = uid and status = 'new');

-- 登入者只能讀自己送過的回報（v1 私訊式；v2 若要公開勘誤串再加 public view）。
drop policy if exists feedback_select_own on public.feedback;
create policy feedback_select_own on public.feedback
  for select using (auth.uid() = uid);

-- 注意：故意「不」給 anon/authenticated 任何 update/delete policy。
--       status 變更（new→filed/rejected）+ issue 回寫只能由 service_role（cron）做。

-- ── 基本反濫用：每人每小時最多 20 筆 ─────────────────────────────────────────
-- （硬上限，擋暴力洗版；細緻 spam 由 cron 端 LLM 分類器處理。）
create or replace function public.feedback_rate_limit()
returns trigger language plpgsql as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
  from public.feedback
  where uid = new.uid and created_at > now() - interval '1 hour';
  if recent_count >= 20 then
    raise exception 'feedback rate limit exceeded (20/hour)';
  end if;
  return new;
end;
$$;

drop trigger if exists feedback_rate_limit_trg on public.feedback;
create trigger feedback_rate_limit_trg
  before insert on public.feedback
  for each row execute function public.feedback_rate_limit();

-- ── profiles.updated_at 自動更新 ────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_trg on public.profiles;
create trigger profiles_touch_trg
  before update on public.profiles
  for each row execute function public.touch_updated_at();
