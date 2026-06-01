---
title: 'Feedback 系統 go-live 紀錄'
description: '讀者登入 + feedback 飛輪系統上線的逐步 runbook + 驗證紀錄。哲宇做 §自主權邊界 內的帳號/錢/service key 步驟,Taiwan.md 驗證 + 記錄。'
type: 'runbook-log'
status: 'in-progress'
date: 2026-06-01
related:
  - 'reports/feedback-login-system-design-2026-06-01.md'
  - 'docs/pipelines/FEEDBACK-TRIAGE-PIPELINE.md'
  - 'supabase/README.md'
---

# Feedback 系統 go-live 紀錄

> 實作完成在 branch `worktree-20260601-feedback-login-system`（22 檔 / 12 test 綠）。
> 本檔記錄上線過程,每步勾選 + 貼驗證證據。

## 狀態總覽

| #                       | 步驟                                                    | 誰              | 狀態 | 驗證                                 |
| ----------------------- | ------------------------------------------------------- | --------------- | ---- | ------------------------------------ |
| **A. Supabase backend** |
| 1                       | 開 Supabase 專案                                        | 哲宇            | ✅   | URL live + key 認證 OK               |
| 2                       | 跑 migration `0001_feedback.sql`                        | 哲宇            | ✅   | 両表 200 + RLS 擋匿名 insert         |
| 3                       | 開 Email + Google + GitHub 登入                         | 哲宇 + TWMD     | ✅   | 3 provider enabled / widget 3 鈕 e2e |
| **B. 前端上線**         |
| 4                       | merge branch → main                                     | TWMD(待哲宇 go) | ⬜   | main 含 feature,build 綠             |
| 5                       | 設 repo Variables（mode+URL+anon key）                  | 哲宇/TWMD       | ⬜   | `gh variable list`                   |
| 6                       | deploy + 驗證 widget 在 taiwan.md live                  | TWMD            | ⬜   | 抓頁面看 supabase mode               |
| **C. cron triage**      |
| 7                       | 設 `~/.taiwanmd-feedback.env`（service key）            | 哲宇            | ⬜   | triage 連得上 Supabase               |
| 8                       | triage dry-run（真資料）                                | TWMD            | ⬜   | 讀到 status=new                      |
| 9                       | 排 cron `twmd-feedback-triage` 07:00                    | 哲宇/TWMD       | ⬜   | scheduler list                       |
| **D. 端到端煙霧測試**   |
| 10                      | 真送一筆 feedback → triage --commit → 看 issue + status | 哲宇+TWMD       | ⬜   | issue 開出 + status=filed            |

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
