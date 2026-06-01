# 2026-06-01 feedback-login-system — 讀者參與器官誕生（v1→v2→v3→第三階段）

> session 2026-06-01-134740-feedback-login-system（worktree）。哲宇 directive 連續 4 波，
> 從「評估計劃」一路做到「完整實作 + 上線 + git 主權 + GA + 完整測試」。
> 完整設計：[reports/feedback-login-system-design-2026-06-01.md](../../../reports/feedback-login-system-design-2026-06-01.md)
> 上線紀錄：[reports/feedback-go-live-log-2026-06-01.md](../../../reports/feedback-go-live-log-2026-06-01.md)

## 一句話

taiwan.md 長出**讀者參與器官**：全站浮動 feedback widget（登入 + 勘誤/網站問題/新主題/想法 +
文章選文段精準標註），外掛 Supabase（隔離失敗域，主站零改動），cron `twmd-feedback-triage`
把回報轉成 GitHub issue 接 MAINTAINER 飛輪，**canonical 紀錄落進 git**（主權），全程 GA4 遙測。

## 四波 directive → 做了什麼

1. **評估 + 計劃**：完整調查（靜態 GitHub Pages / 既有 Protico / issue 飛輪）→ 報告。建議 Supabase
   （開源/可攜/cron 順，對齊 sovereignty）。
2. **完整實作**：widget（adapter: Supabase + Mock）+ schema/RLS/rate-limit + triage（dry-run default，
   no-email regex 守）+ pipeline + skill + ROUTINE #15 + from-feedback label + deploy.yml env。
3. **v2 全站 + 選文段 + 極低阻力**：Layout 全頁 render + pageKind 變形；選文段→浮藥丸→quote +
   **W3C Text Fragment 深連結**（維護者一點直達高亮）；OAuth 跳暱稱。
4. **v3 Grokipedia 閉環可見性**：「我的回報」狀態 view + AI 初判透明（triage_note）。
5. **第三階段**：**git 主權 archive**（docs/feedback/archive/ 存回報+issue 對話，無 email）+
   **GA4 8 事件**（數據驅動 EVOLVE 飛輪）+ **24 unit + 10 UX(Playwright) test 全綠**。

## 上線狀態（go-live log SSOT）

哲宇做了（§自主權邊界）：Supabase 專案 + migration 0001/0002/0003 + Email/Google(已發布)/GitHub
3 provider + service key env + repo Variables。TWMD 用 Chrome MCP 代操作 Google/GitHub OAuth 設定。
前端 merged 進 main + deploy。**剩**：cron 排程（Step 9）+ 真送一筆端到端煙霧（Step 10）。

## 教訓（候選 LESSONS）

- **「CI 失敗」常是 concurrency cancelled**：deploy.yml `pages` group cancel-in-progress，新 push 取消舊
  deploy，cancelled 圖示易誤判為 failure。先 `gh run list --json conclusion` 查 failure 再下判斷。
- **外掛結構也能守主權**：BaaS 是 live 層，triage 把 canonical mirror 進 git（archive.mjs 純函式 +
  mergeComments idempotent）→ Supabase 死也不丟資料。對應 MANIFESTO 知識在 git。
- **憑證邊界**：OAuth secret 用 find/copy 不讀進對話；GitHub sudo passkey 哲宇本人過；service key 進
  ~/.env 不進 repo。Google API policy 代勾有向哲宇 flag（OAuth 設定必要步驟）。
- **UX test = 自動化 mock e2e**：用既有 `playwright` pkg（非 @playwright/test）寫 self-contained
  node script，spawn dev server + chromium 全流程，比手動 preview e2e 可重跑。

## Handoff（給下一個 session）

- feedback widget live 在 supabase mode（PUBLIC_FEEDBACK_MODE=supabase）。三登入 + 選文段 + 我的回報 all live。
- **未完**：排 cron `twmd-feedback-triage`（ROUTINE.md #15，07:00，gated on env）；端到端煙霧（真送→issue→status）。
- triage `--commit` 會寫 docs/feedback/archive/ + sync issue 留言；routine 收官要 `git add docs/feedback/archive/`（skill HG9）。
- 設計但 phase-next：文章修訂史 surface git log（report §v3.5）+ 貢獻者個人頁（§v3.6）。
- Protico 去留：哲宇未決（report §9）。
