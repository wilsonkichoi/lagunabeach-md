---
title: 'Feedback 系統 go-live 紀錄'
description: '讀者登入 + feedback 飛輪系統上線的逐步 runbook + 驗證紀錄。哲宇做 §自主權邊界 內的帳號/錢/service key 步驟,Taiwan.md 驗證 + 記錄。'
type: 'runbook-log'
status: 'live — Step 1-8+10 ✅，Step 9 routine 之後建立'
date: 2026-06-01
related:
  - 'reports/feedback-login-system-design-2026-06-01.md'
  - 'docs/pipelines/FEEDBACK-TRIAGE-PIPELINE.md'
  - 'supabase/README.md'
---

# Feedback 系統 go-live 紀錄

> 實作完成（v1→v2→v3→第三階段，PR #1117-1120 全 merged，24 unit + 10 UX test 綠）。
> 本檔記錄上線過程,每步勾選 + 貼驗證證據。Step 1-8 + 10 ✅；Step 9 routine 哲宇 directive「之後再建立」。

## 狀態總覽

| #                       | 步驟                                                    | 誰          | 狀態 | 驗證                                       |
| ----------------------- | ------------------------------------------------------- | ----------- | ---- | ------------------------------------------ |
| **A. Supabase backend** |
| 1                       | 開 Supabase 專案                                        | 哲宇        | ✅   | URL live + key 認證 OK                     |
| 2                       | 跑 migration `0001_feedback.sql`                        | 哲宇        | ✅   | 両表 200 + RLS 擋匿名 insert               |
| 3                       | 開 Email + Google + GitHub 登入                         | 哲宇 + TWMD | ✅   | 3 provider enabled / widget 3 鈕 e2e       |
| **B. 前端上線**         |
| 4                       | merge branch → main                                     | TWMD        | ✅   | PR #1117 merged → main e90c400a3           |
| 5                       | 設 repo Variables（mode+URL+anon key）                  | TWMD        | ✅   | 4 Variables set（gh variable list）        |
| 6                       | deploy + 驗證 widget 在 taiwan.md live                  | TWMD        | ✅   | v3 deploy 成功上線（phase3 deploy 中）     |
| **C. cron triage**      |
| 7                       | 設 `~/.taiwanmd-feedback.env`（service key）            | 哲宇        | ✅   | 「env 好了」                               |
| 8                       | triage dry-run（真資料）                                | TWMD        | ✅   | triage 連上 Supabase，讀 0 new（無真資料） |
| 9                       | 排 cron `twmd-feedback-triage` 07:00                    | TWMD        | ⏸️   | 之後建立（Claude routine / RemoteTrigger） |
| **D. 端到端煙霧測試**   |
| 10                      | 真送一筆 feedback → triage --commit → 看 issue + status | TWMD        | ✅   | issue #1121 全驗證 + 清理（見下方）        |

---

## 逐步紀錄

（每步完成後我 append 驗證輸出 + 時間戳）

### Step 1 ✅ 開 Supabase 專案（2026-06-01）

- Project name: Taiwan.md / ref `peaukuolztyiepblwuos` / region ap-northeast-1 (Tokyo) / Free。
- **Project URL**: `https://peaukuolztyiepblwuos.supabase.co`
- anon/publishable key: `sb_publishable_…`（public-safe,Step 5 設成 repo Variable）。
- 驗證:
  - `GET /auth/v1/health` + `/rest/v1/` 無 key → HTTP 401「No API key found」= 端點 live。
  - `GET /rest/v1/feedback?...` 帶 publishable key → `PGRST205 Could not find the table 'public.feedback'`（HTTP 404）= **金鑰認證成功**,只差 migration 建表。

### Step 2 ✅ 跑 migration（2026-06-01）

- SQL Editor 跑 `0001_feedback.sql` → Success。
- 驗證(帶 publishable key 打 REST):
  - `GET /rest/v1/feedback` → HTTP 200 `[]`（表建好,RLS 對 anon 回空）。
  - `GET /rest/v1/profiles` → HTTP 200 `[]`。
  - 匿名 `POST /rest/v1/feedback` → `42501 new row violates row-level security policy`（HTTP 401）= **RLS 正確擋下未登入寫入**。

### Step 3a ✅ Email 登入 + URL 設定（2026-06-01，TWMD 用 Chrome MCP 代操作）

- Auth → URL Configuration：
  - **Site URL** = `https://taiwan.md`（從預設 localhost:3000 改）。
  - **Redirect URLs** = `https://taiwan.md/**` + `http://localhost:4330/**`（後者本機端到端測試用）。
- Auth → Sign In / Providers：
  - **Email** provider = Enabled ✅
  - **Allow new users to sign up** = on ✅（不然新讀者無法註冊）。
- Step 3b（Google OAuth）狀態見下方決策。

### Step 3b ✅ Google OAuth + GitHub OAuth（2026-06-01，TWMD 用 Chrome MCP 代操作）

哲宇 directive「現在就設 Google」+「也加入 github oauth」+「用 taiwanmd@monoame.com」。

**Google OAuth**（GCP 專案 `taiwan-md-sense`,複用既有）：

- Google Auth Platform 同意畫面:app name `Taiwan.md` / support email `taiwanmd@monoame.com` /
  user type **外部 (External)** / contact `taiwanmd@monoame.com`。
- 同意 Google API Services User Data Policy（TWMD 代勾,屬 OAuth 設定必要步驟,已向哲宇 flag）。
- OAuth client（Web）`Taiwan.md feedback (Supabase)`,redirect URI =
  `https://peaukuolztyiepblwuos.supabase.co/auth/v1/callback`。
- Client ID + secret 填入 Supabase Google provider + 啟用 + Save（"Successfully updated settings"）。
- **發布狀態 = 實際運作中 (Production)** → 任何 Google 帳號讀者可登入（basic scope 免驗證）。

**GitHub OAuth**（owner frank890417）：

- GitHub OAuth App `Taiwan.md feedback`,homepage `https://taiwan.md`,callback = 同上 Supabase callback。
- Client ID `Ov23liw4xEh1YqErFAGC` + secret（哲宇本人過 sudo passkey 後生成,TWMD 不碰憑證輸入）。
- 填入 Supabase GitHub provider + 啟用 + Save（"Successfully updated settings"）。

**Email**:provider Enabled + Allow signups on + Confirm email on（magic-link 即確認）。

**widget 程式碼**:generalize `signInWithGoogle` → `signInWithOAuth(provider)`,renderAuth 改 iterate
`FEEDBACK_PROVIDERS`（google,github,email）。e2e（mock）驗證 auth step 出現 3 鈕,GitHub 登入
captured email `tester@users.noreply.github.com` → 進 nickname step。12 unit test 仍綠。

**Supabase callback（3 provider 共用）**:`https://peaukuolztyiepblwuos.supabase.co/auth/v1/callback`。

### Step 8 ✅ triage 連線真資料（2026-06-01）

`node scripts/feedback/triage.mjs`（無 --seed）讀 `~/.taiwanmd-feedback.env` → 連上 Supabase REST →
`fetched 0 new feedback`（當下無真資料，連線+認證 OK）。

### Step 10 ✅ 端到端煙霧測試（2026-06-01，TWMD 全程驅動 + 清理）

1. **建測試資料**（service key admin API）：test auth user + feedback row（type=content / quote /
   correct_info / status=new，body 標「[煙霧測試]」）。
2. **`node scripts/feedback/triage.mjs --commit`** → `fetched 1 · FILE [content] [Fact Check] 李安 ·
labels needs-verification+from-feedback · → issue #1121 · 📁 archive 寫入`。
3. **驗證全鏈**：
   - GitHub issue #1121：title/labels 對 + body 含 quote blockquote + 🔗 W3C 深連結 + provenance
     `回報者:煙霧測試讀者 · feedback id · 來源頁:article` + **無 email**。
   - git archive `docs/feedback/archive/2026-06/{id}.md`：frontmatter（contributor=display_name，無 email）
     - 回報內容 + 選取原文 + 系統初判（triage_note）。
   - Supabase write-back：`status='filed'` + `issue_number=1121` + `triage_note` ✅。
4. **清理**：刪 feedback row + test user / 關 issue #1121（附說明 comment）/ rm 未 commit 的測試 archive。零殘留。

→ **整條飛輪（widget→Supabase→triage→issue→git 主權 archive→write-back→我的回報狀態）驗證打通。**

### Step 9 ⏸️ 排 routine（之後建立）

哲宇 directive「之後再建立」。建立方式（Claude routine via RemoteTrigger / `/schedule`）：

- name `twmd-feedback-triage` / cron `0 23 * * *`（UTC = 07:00 Asia/Taipei，maintainer-am 08:30 前）/
  model sonnet / repo taiwan-md / tools Bash+Read+Write+Edit+Glob+Grep。
- prompt：STRICT BECOME GATE（`/twmd-become review`）→ `/twmd-feedback-triage` skill →
  `node scripts/feedback/triage.mjs --commit` → `git add docs/feedback/archive/` → commit+push → `/twmd-finale`。
- **cloud 環境前提**：CCR 環境要有 `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` env（cloud 讀不到本機
  `~/.taiwanmd-feedback.env`；triage.mjs 已 `process.env` 優先）+ `gh`/git 推送權限。未設則 emit
  「backend 未配置, skip」不算 fail。
- ROUTINE.md #15 SSOT entry 已寫好（schedule canonical）。
