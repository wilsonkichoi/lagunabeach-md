# Taiwan.md feedback 子系統 — Supabase 設定

> 這層是「隔離失敗域」。掛了只影響登入/留言,主站（GitHub Pages 靜態）無感。
> 完整架構：[reports/feedback-login-system-design-2026-06-01.md](../reports/feedback-login-system-design-2026-06-01.md)

## 哲宇要做的事（一次性,~15 分鐘）

### 1. 開 Supabase 專案

- [supabase.com](https://supabase.com) → New project（區域選 `Northeast Asia (Tokyo)` 最近台灣）。
- 記下 `Project URL` + `anon public` key（Settings → API）。
- 記下 `service_role` key（**機密,只給 cron 用,永遠不進 repo / 前端**）。

### 2. 跑 migration

Dashboard → SQL Editor → 貼上 `migrations/0001_feedback.sql` 整份 → Run。
（或裝 [Supabase CLI](https://supabase.com/docs/guides/cli)：`supabase link` 後 `supabase db push`。）

### 3. 開登入方式（Authentication → Providers）

- **Email**：預設開,給 magic-link 登入（拿得到 email,不需外部 OAuth app）。
- **Google**（建議）：
  - Google Cloud Console → 建 OAuth 2.0 Client（Web）。
  - Authorized redirect URI 填 Supabase 給的 callback（`https://<project>.supabase.co/auth/v1/callback`）。
  - 把 Client ID + Secret 填回 Supabase Google provider。
- Authentication → URL Configuration → Site URL 設 `https://taiwan.md`,Redirect URLs 加 `https://taiwan.md/**`。

### 4. 前端上線（設環境變數後 rebuild）

GitHub repo → Settings → Secrets and variables → Actions → Variables 加：

| 變數                        | 值                             |
| --------------------------- | ------------------------------ |
| `PUBLIC_FEEDBACK_MODE`      | `supabase`                     |
| `PUBLIC_SUPABASE_URL`       | 你的 Project URL               |
| `PUBLIC_SUPABASE_ANON_KEY`  | anon public key                |
| `PUBLIC_FEEDBACK_PROVIDERS` | `google,email`（或只 `email`） |

> `PUBLIC_*` 設計上可公開（RLS 把關）。沒設這些之前,widget 自動降級成「用 GitHub 回報」按鈕,ship 也安全。

`.github/workflows/deploy.yml` build 步驟要把這些 Variables 帶進 env（見該檔註解）。

### 5. cron triage 的機密（只在哲宇的 routine runner 機器）

在 `~/.taiwanmd-feedback.env`（**不在 repo**）放：

```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_KEY=<service_role key>
```

`scripts/feedback/triage.mjs` 讀這個檔（或同名環境變數）讀新回報、開 issue、回寫 status。

## 本地測試（不用真帳號）

不想開 Supabase 也能測整個前端流程：

```
PUBLIC_FEEDBACK_MODE=mock npm run dev
```

MockBackend 用瀏覽器 localStorage 模擬 login→email→nickname→submit,完整可點。

## 資料表

- `profiles(uid, email, nickname, …)` — 一個登入者一列,**email 落地處**。
- `feedback(id, uid, display_name, type, body, correct_info, status, issue_url, …)` —
  一筆回報,**只存 display_name 不存 email**（public issue 不洩 PII）。

RLS：登入者只能 insert/select 自己的列;`status` 變更 + issue 回寫只能 service_role 做。
反濫用：DB trigger 每人每小時上限 20 筆 + cron 端 LLM spam 分類。
