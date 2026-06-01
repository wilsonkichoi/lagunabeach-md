---
title: '讀者帳號登入 + 即時 Feedback + cron→GitHub issue 飛輪整合：架構評估與計劃'
description: '在 taiwan.md 現有 100% 靜態（GitHub Pages）架構上，加一層 Google/多平台登入 + 結構化勘誤/修正/新主題回報，用 managed BaaS 做隔離失敗域，再用一條新 routine 把回報自動轉成 GitHub issue 接進既有 maintainer 飛輪。'
type: 'design-report'
status: 'draft-for-observer-review'
author: 'Taiwan.md (Semiont) 🧬'
observer: '哲宇 (creator/BDFL)'
date: 2026-06-01
session: '2026-06-01-twmd-become-full'
boundary: '命中 §自主權邊界（新 workflow / 對外溝通 / service account 授權 / 經費訂閱）→ blueprint，等哲宇 ratify 才動帳號與錢'
related:
  - 'docs/pipelines/MAINTAINER-PIPELINE.md'
  - 'docs/semiont/ROUTINE.md'
  - 'docs/semiont/MANIFESTO.md#我的存在結構'
  - '.github/ISSUE_TEMPLATE/'
---

# 讀者登入 + 即時 Feedback + cron→issue 飛輪整合

> 哲宇 2026-06-01 的問題：在 twmd 架構上加 Google 登入 + 即時 feedback 留言（勘誤 / 修正 / 新主題），盡量維持 serverless、只有少部分伺服器輔助、壞了也不影響主站；用什麼資料庫（firebase / supabase）；最簡單的多平台登入；以及我們這邊未來怎麼排定時任務，把最新的勘誤留言自動轉成 GitHub issue（content / bug / newtopic）接進既有飛輪。
>
> 本檔是**完整調查 + 計劃**。底下每個哲宇問的點都有明確建議，最後一節列出需要哲宇拍板的決策（帳號 / 錢 / 對外責任，per §自主權邊界）。

---

## 0. 一句話結論

**主站一行 code 都不用改失敗域**：feedback 子系統做成一塊**隔離的 client-side 掛件 + managed BaaS（建議 Supabase）**，主站（GitHub Pages 靜態）完全不知道它存在；BaaS 掛了，掛件自己 graceful degrade 成「改用 GitHub issue」的 fallback，文章頁照常 render。回報資料躺在 BaaS，**一條新 routine `twmd-feedback-triage`**（跑在哲宇現有的 cron runner 上，不是新伺服器）每天把新回報分類成 content / bug / newtopic，**用跟現有 issue template 一模一樣的格式開成 GitHub issue**，直接被現有 `MAINTAINER-PIPELINE` 飛輪收割。

整套新增的「伺服器」只有兩塊，而且兩塊都可以壞：

1. **managed BaaS**（Auth + DB，零自管伺服器）—— 壞了 = 不能登入/留言，主站無感。
2. **每日一條 cron routine**（複用既有 routine runner）—— 壞了 = 回報還在 DB 裡累積，issue 晚一天開，零資料遺失。

---

## 1. 現狀調查（先確認我們站在哪）

我把專案完整摸了一遍，跟這個需求相關的事實：

### 1.1 主站是 100% 靜態，沒有任何 server runtime

| 項目         | 現況                                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- |
| 框架         | Astro 6.2.1，`astro.config.mjs` 設 `output: 'static'`，**沒有 SSR adapter**                  |
| 託管         | **GitHub Pages**（`.github/workflows/deploy.yml` → `actions/deploy-pages`）                  |
| 網域         | `taiwan.md`（`public/CNAME`）                                                                |
| 部署觸發     | push to `main` → GitHub Actions build → 上 Pages                                             |
| 「API」      | **全部是 prebuild 生出來的靜態 JSON**（`public/api/*.json`，20 個檔），不是 runtime endpoint |
| 唯一動態路由 | `src/pages/api/search-index.json.ts` —— 也是 build 時靜態產出，不是 server route             |

**關鍵約束**：GitHub Pages 不能跑任何 server code。要有「登入 + 寫留言」這種需要持久化 + 認證的動態行為，**寫入端一定得在站外**。這恰好符合哲宇「主站維持 serverless、只有少部分伺服器輔助」的方向 —— 我們把那「少部分」整個推到 managed BaaS，主站連 build 流程都不碰。

### 1.2 站上已經有一個第三方留言 widget（Protico）

`src/components/ProticoScript.astro` 已經在注入 `https://main.protico.io/api/v1/taiwan.md/protico-frame.js`（host-gate 只在 taiwan.md 跑）。

這代表：

- **掛 client-side 第三方互動 widget 的 pattern 站上已經存在且運作中**，新 feedback widget 走同樣的注入方式不是新東西。
- 但 Protico 是封閉第三方，**給不了我們三件這次要的東西**：(a) 我們自己掌握的 Google 登入 + 身份；(b) 結構化的「勘誤 / 修正 / 新主題」分類欄位；(c) 回報資料的程式化讀取，好讓 cron 轉成 issue 接飛輪。
- 所以新系統是 **complement / 最終 replace Protico**，不是重複造輪子。要不要同時下掉 Protico 是哲宇的決策點（見 §9）。

### 1.3 掛載點乾淨

- 文章頁：`src/pages/[category]/[slug].astro` → `src/templates/article.template.astro`，frontmatter（title / slug / category / lang）都拿得到，widget 知道自己掛在哪篇文章。
- `Layout.astro:852` 已經用 `{readerSettings && <ReaderSettings lang={lang} />}` 在 `<Footer/>` 之後掛一個浮動 panel。**新 `<FeedbackWidget/>` 浮動鈕掛在同一個位置，零結構衝突。**
- 站上已有多個 client-side 互動元件（`ReaderSettings` / `TextToSpeech`），互動 widget 不是先例突破。

### 1.4 GitHub issue 飛輪已經長好，且早就吃 cron 生的 issue

| 已存在              | 內容                                                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Issue templates     | `bug-report.yml`（label `bug`）/ `fact-correction.yml`（label `needs-verification`）/ `article-proposal.yml`（label `content`）/ `broken-link.yml` / `translation.yml` |
| Labels              | `content` / `needs-verification` / `needs-rewrite` / `bug` / `content-gap` / `enhancement` …                                                                           |
| 主流程              | `docs/pipelines/MAINTAINER-PIPELINE.md` v2.3，4-stage（Scan → Triage → Act → Wrap）                                                                                    |
| **cron→issue 先例** | MAINTAINER Step 2.1.1「**[Content] issue digest sub-flow**」**已經在處理 cron 生成的內容建議 issue**，含 4-route dedupe + priority scoring                             |
| Routine 收割        | `twmd-maintainer-pm`（22:00）+ `twmd-maintainer-am`（08:30）每天兩次清 PR/issue backlog                                                                                |

這是整個計劃最省力的地方：**我不用發明新的 issue 處理流程**。只要 cron 開出來的 issue 長得跟現有 template 一樣（同 label、同 title 前綴、同欄位結構），現有 maintainer 飛輪就直接收割。`newtopic` 類甚至剛好掉進已經存在的 [Content] digest 4-route dedupe。

### 1.5 現有 routine 飛輪（要接進去的對象）

`docs/semiont/ROUTINE.md` 是 SSOT，14 條 TWMD-prefix cron routine。每條 routine = 「在 X 時間呼叫 `/twmd-Y` skill + quality gate + escalation + `/twmd-finale` 收官」，**業務邏輯永遠在 skill/pipeline，routine 本身是薄殼**。新 routine 照這個範式長就好。Routine 跑在哲宇的機器（cron runner），**不是新伺服器**。

---

## 2. 設計原則（這套東西要遵守什麼）

1. **隔離失敗域（核心）**：主站 = 一個失敗域（靜態，永遠活）。Feedback 子系統 = 另一個失敗域（BaaS + widget + cron）。兩域之間**只有 client-side 的單向、async、可失敗的呼叫**，沒有 build-time 依賴、沒有 server 耦合。子系統整個炸掉，主站的 Lighthouse 分數不動一分。
2. **Serverless 純度最大化**：寫入端能不寫自管 server 就不寫。BaaS 的 client-direct write + 安全規則（RLS / Security Rules）就能做到「瀏覽器直接寫 DB、沒有中間 server」。唯一的「server-ish」是每天跑一次的 cron，而它複用既有 runner。
3. **登入摩擦極小化**：登入 → 留言的步數壓到最低。Google One-Tap（有現成 Google session 直接一鍵）為主，其他平台為輔。匿名也能先打字、送出前才要求登入（lazy auth）。
4. **對外責任守 §自主權邊界**：「發 issue / PR comment to GitHub」「批准 merge」「對外溝通語氣」屬於 human-required。所以這套系統的設計把「機械性 routing」（把讀者的原話轉成 issue）跟「維護者開口回覆」嚴格分離 —— cron 只做前者，後者留給 MAINTAINER-PIPELINE 的人類 gate。
5. **資料主權 / 反鎖定（Semiont 價值觀）**：MANIFESTO 的 sovereignty / distributed un-killability 精神延伸到這層 —— 優先選**開源、可自架、資料可完整匯出**的後端，不把讀者的勘誤資料鎖進 Google 專有格式。這條直接影響 §4 的 DB 選型。

---

## 3. 整體架構（失敗域地圖）

```
┌─────────────────────────────── 失敗域 A：主站（永遠活）────────────────────────────────┐
│  GitHub Pages 靜態網站 taiwan.md                                                          │
│  Astro build → dist → Pages。760 篇文 × 6 語。零 server。                                 │
│                                                                                          │
│   文章頁 article.template.astro                                                          │
│     └─ <FeedbackWidget articleSlug=… lang=… />   ← 浮動鈕，掛在 Layout footer 之後        │
│          │  (client-side only，async 載入，失敗就降級)                                    │
└──────────┼───────────────────────────────────────────────────────────────────────────────┘
           │  瀏覽器直接呼叫（HTTPS，帶 RLS/Security Rules，無中間 server）
           ▼
┌─────────────────────────── 失敗域 B：feedback 子系統（可以壞）──────────────────────────┐
│  Managed BaaS（建議 Supabase）                                                            │
│   ├─ Auth：Google One-Tap / Apple / GitHub / Email magic-link                            │
│   └─ DB：feedback 表（uid, article_slug, lang, type, body, source_url, status, ts…）      │
│         + RLS：登入者只能 insert 自己的 row；公開讀依模式而定                              │
│                                                                                          │
│  ┌──────────────── 每日 cron（複用既有 routine runner，不是新伺服器）─────────────────┐  │
│  │  routine: twmd-feedback-triage  →  skill /twmd-feedback-triage                      │  │
│  │   1. 讀 status='new' 的 feedback（REST / supabase-js, service key）                 │  │
│  │   2. LLM 分類 + 反 spam + 跨源驗證 + dedupe（對 ARTICLE-DONE-LOG / 既有 issue）     │  │
│  │   3. 開 GitHub issue（格式對齊現有 template，加 from-feedback provenance label）    │  │
│  │   4. 回寫 status='filed' + issue_url 進 BaaS                                        │  │
│  │   5. /twmd-finale 收官（memory 必寫）                                               │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────┼───────────────────────────────────────────────────────────────────────────────┘
           │  gh issue create（機械性 routing，讀者原話 verbatim + 署名）
           ▼
┌─────────────────────────── 失敗域 C：既有 GitHub 飛輪（早就在轉）───────────────────────┐
│  GitHub issue（labels: from-feedback + needs-verification / bug / content）              │
│     └─ twmd-maintainer-am / pm routine → MAINTAINER-PIPELINE                             │
│          ├─ content/勘誤 → Stage 3 heal / REWRITE                                        │
│          ├─ bug        → Stage 3 修站                                                    │
│          └─ newtopic   → Step 2.1.1 [Content] digest 4-route dedupe → 排進 ARTICLE-INBOX │
│     └─ 維護者開口回覆（人類 gate，§自主權邊界）                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

三個失敗域，三段可獨立 down 的鏈，沒有一段 down 會回頭打死上一段。這就是哲宇要的「壞了也沒差不影響主站」。

---

## 4. 用什麼資料庫 + 怎麼登入（哲宇直接問的）

### 4.1 Firebase vs Supabase 逐項比較

| 維度                  | Firebase (Firestore + Firebase Auth)                | Supabase (Postgres + GoTrue Auth)                                  | 對 twmd 誰贏                  |
| --------------------- | --------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------- |
| **Google 登入摩擦**   | 最低，Google One-Tap + FirebaseUI drop-in 最成熟    | `signInWithOAuth({provider:'google'})`，也支援 One-Tap，差距已很小 | Firebase 微勝                 |
| **多平台登入**        | Google/Apple/GitHub/Email/匿名，齊                  | Google/Apple/GitHub/Email magic-link/匿名，齊                      | 平手                          |
| **反 spam / 反 bot**  | **App Check（reCAPTCHA Enterprise）免費且強**       | 需自接 Cloudflare Turnstile / hCaptcha                             | Firebase 勝                   |
| **cron 讀取做 issue** | Admin SDK（service account JSON），需 SDK           | **auto REST（PostgREST）`?status=eq.new` 一個 GET 就好** + SQL     | **Supabase 勝**               |
| **資料可攜 / 反鎖定** | 專有 Firestore，難搬                                | **標準 Postgres，`pg_dump` 隨時整碗端走**                          | **Supabase 勝**               |
| **開源 / 可自架**     | 閉源，只能在 Google 上跑                            | **開源，未來可自架，符合 sovereignty 哲學**                        | **Supabase 勝**               |
| **免費額度**          | Spark：Firestore 1GiB、5 萬 MAU、讀 5 萬/日（夠用） | Free：DB 500MB、5 萬 MAU、egress 5GB（夠用）                       | 平手                          |
| **免費層陷阱**        | 不會自動暫停                                        | 連續 7 天**零活動**會 pause —— 但我們每日 cron 會打它，不會 pause  | Firebase 微勝（被 cron 抵銷） |
| **RLS / 權限模型**    | Security Rules（自家 DSL）                          | **Postgres RLS（標準 SQL policy），更透明可審計**                  | Supabase 微勝                 |
| **即時（realtime）**  | Firestore listener 原生                             | Supabase Realtime（Postgres logical replication）                  | 平手                          |

### 4.2 建議：Supabase（主），Firebase（備案）

**我推 Supabase**，三個對 Semiont 最重要的理由：

1. **資料主權 / 反鎖定**：勘誤資料是讀者貢獻給台灣知識庫的公共財。躺在標準 Postgres、隨時 `pg_dump` 端走、未來能自架，跟 MANIFESTO「分散式不可殺滅性 / 不被中介層綁架」同構。鎖進 Firestore 違反這條。
2. **cron→issue 最省力**：飛輪整合的核心動作是「讀新回報」。Supabase 一個 `GET /rest/v1/feedback?status=eq.new` 帶 service key 就拿到 JSON，cron skill 不用裝 SDK；要複雜查詢直接 SQL。這是這個專案的決定性操作，Supabase 在這點明顯順。
3. **開源同源**：可自架的後端，跟「只要有一個 fork 活著就沒死」的精神一致。

**但 Firebase 有一個真實優勢值得哲宇知道**：**App Check 免費且強**。讀者 UGC（user-generated content）→ 自動轉公開 GitHub issue，spam/濫用是真風險。Firebase App Check 開箱即用擋 bot；Supabase 要自己接 Cloudflare Turnstile（不難，但多一塊）。

→ **若哲宇最在意「登入摩擦最小 + spam 防護開箱即用、不在意鎖定」→ 選 Firebase**。**若認同資料主權 + cron 順手 + 開源（我的推薦）→ 選 Supabase**，spam 用 Turnstile + cron 端 LLM 分類器補。這是帳號 + 錢 + 價值觀的決策，列進 §9 等哲宇拍板。

### 4.3 登入摩擦極小化（不管選哪個後端都這樣做）

1. **Lazy auth**：浮動鈕點開 → 讀者**先打字**選類別寫內容，**按「送出」才觸發登入**。先有貢獻衝動、再要身份，不要一進來就擋登入牆。
2. **Google One-Tap 為主**：有現成 Google session 的人，One-Tap 一下就登入回填，不離開頁面、不跳轉。
3. **多平台備援**：One-Tap 下面放 Apple / GitHub / Email magic-link。GitHub 對工程讀者特別順（他們本來就有帳號）。
4. **登入後記住**：session 留著，第二次回報不用再登。
5. **送出即時確認**：optimistic UI，按下立刻顯示「收到了，謝謝 🧬」，背景 async 寫 BaaS，寫失敗才退一格提示。「即時」感由這個確認體驗給，不靠公開即時留言串。

---

## 5. Feedback widget 設計（讀者那一端）

### 5.1 三個類別（對齊哲宇要的 content / bug / newtopic）

| widget 類別     | 讀者看到的                 | 對應 issue label     | 對應現有 template      |
| --------------- | -------------------------- | -------------------- | ---------------------- |
| **勘誤 / 修正** | 「這篇哪裡寫錯了？」       | `needs-verification` | `fact-correction.yml`  |
| **網站問題**    | 「頁面/連結/顯示有 bug？」 | `bug`                | `bug-report.yml`       |
| **建議新主題**  | 「想看台灣的什麼？」       | `content`            | `article-proposal.yml` |

widget 收的欄位**故意對齊現有 issue template 的欄位**（哪篇文章 / 哪裡有誤 / 正確資訊 + 來源 / 分類），這樣 cron 轉 issue 是直接 field-mapping，零資訊損失。文章 slug / lang / URL 由 widget 自動帶（讀者不用填）。

### 5.2 可見性：v1 先做「私訊式」，v2 再評估公開串

- **v1 私訊式回報（建議先做）**：讀者送的回報只有讀者自己 + 維護者看得到。**零公開 UGC moderation 負擔**，是 sovereignty/品質防線最低風險的起點。「即時」由送出確認 + 「我之前的回報狀態」清單滿足。
- **v2 公開勘誤串（可選，之後評估）**：文章下方顯示「讀者勘誤」公開列表（Supabase Realtime 即時刷新）。價值是社群感 + 透明，但帶來公開 UGC 審核面（要 moderation + 反洗版），且跟既有 Protico 功能重疊。**先不做，留到 v1 跑順、看真實流量再決定**。

### 5.3 Graceful degradation（壞了也不影響主站的具體 UI）

| 故障              | widget 行為                                                         | 主站影響 |
| ----------------- | ------------------------------------------------------------------- | -------- |
| BaaS SDK 載入失敗 | 浮動鈕 fallback 成「用 GitHub issue 回報」連結（連到既有 template） | 無       |
| Auth 服務 down    | 顯示「登入暫時無法使用，可改用 GitHub issue」+ 連結                 | 無       |
| 寫入失敗          | optimistic UI 退回，提示「沒送出去，要不要改用 GitHub issue」       | 無       |
| 整個子系統關掉    | 移除 `<FeedbackWidget/>` import 一行，主站 build 照常               | 無       |

widget 整個用 `try/catch` + 動態 import 包起來，**任何 throw 都 swallow 成 fallback**，永遠不讓 feedback 子系統的錯誤 bubble 到主站 render。

---

## 6. cron → GitHub issue 飛輪整合（哲宇問的「未來怎麼排定時任務」）

### 6.1 新增一條 routine：`twmd-feedback-triage`

照 ROUTINE.md 薄殼範式長。建議排程**每天 08:00**，剛好接在 `twmd-spore-pick`（08:00）前後、`twmd-maintainer-am`（08:30）**之前** —— 讓 feedback 先轉成 issue，30 分鐘後 maintainer routine 就一起收割，當天成閉環。

| 欄位     | 值                                                                         |
| -------- | -------------------------------------------------------------------------- |
| TaskId   | `twmd-feedback-triage`                                                     |
| Cron     | `0 8 * * *`（每天 08:00，maintainer-am 之前）                              |
| Skill    | `/twmd-feedback-triage`（新 skill，薄殼）                                  |
| Pipeline | `docs/pipelines/FEEDBACK-TRIAGE-PIPELINE.md`（新 canonical，業務邏輯放這） |
| Model    | Sonnet（分類 + dedupe，不需 Opus）                                         |
| 收官     | `/twmd-finale`（memory 必寫）                                              |

### 6.2 skill 5 步（業務邏輯 canonical 在 pipeline，routine 只 pointer）

1. **Pull**：讀 BaaS `status='new'` 的回報（Supabase REST 一個 GET）。
2. **分類 + 驗證**：
   - LLM 把每則歸到 content / bug / newtopic（讀者自選的類別當 hint，不盲信）。
   - **反 spam / 反濫用**：明顯廣告 / 攻擊 / 空洞 → `status='rejected'`，不開 issue。
   - **跨源驗證**（REFLEXES #4 #16）：勘誤類先比對該文章原文 + 既有 footnote source，標記「可驗證 / 待查」。讀者的回報是線索不是事實。
   - **Dedupe**：對既有 open issue + ARTICLE-DONE-LOG 去重（newtopic 直接複用 MAINTAINER Step 2.1.1 的 4-route dedupe）。
3. **開 issue**：`gh issue create`，body 用讀者原話 verbatim + 署名（Google 顯示名 / 「匿名讀者」）+ provenance 行（`🤖 由 twmd-feedback-triage 從站上回報轉入，原始 feedback id: …`）。Label = `from-feedback` + 對應類別 label。Title 對齊既有前綴（`[Fact Check]` / `[Bug]` / `[Article]`）。
4. **回寫**：BaaS `status='filed'` + `issue_url`，避免下次重開。讀者下次登入能在「我的回報」看到「已轉成 issue #N」。
5. **收官**：`/twmd-finale`。

### 6.3 §自主權邊界怎麼守（重要）

MANIFESTO §自主權邊界明寫「**發 issue/PR comment to GitHub 需要 human**」。這條怎麼跟「自動開 issue」相容？

**關鍵區分**：

- cron **開 issue** = 把**讀者自己的原話**機械性 routing 成 issue（讀者是 author、Google 登入有身份、verbatim + 署名 + provenance）。這跟 `broken-link.yml` template 讓讀者自己開 issue 是同一件事，只是代填表單。**這是 transcription，不是維護者開口**。→ 可自動。
- cron **絕不**做的事：在 issue / PR 上**以維護者身份回覆**、close、merge、改判讀者對錯。這些留給 MAINTAINER-PIPELINE 的人類 gate。

為了讓哲宇放心，提供**兩種 gate 模式當決策點**（§9）：

- **模式 A（建議，省力）**：bug + 勘誤類**自動開 issue**（低風險、高價值、時效性強），加 `from-feedback` label 好過濾；newtopic 也自動開，掉進既有 [Content] digest（本來就有 dedup + scoring + 人類 review）。spam 由 cron LLM 擋在開 issue 之前。
- **模式 B（保守）**：全部新回報先進一個 buffer `docs/factory/FEEDBACK-INBOX.md`（仿 SPORE-INBOX），哲宇/maintainer routine **promote 過的才開 issue**。多一層人類，但慢一天、多一個要顧的 inbox。

我建議 **A**：issue 很便宜、可關、有 provenance label 可一鍵 filter，而且現有 maintainer 飛輪本來就在 triage cron 生的 issue。把人類 gate 留在「回覆 / merge」這個真正需要 human 承擔的點，比卡在「開 issue」更符合邊界的哲學（輸入端機械 / 輸出端人類）。

### 6.4 接進既有飛輪（零新 triage 邏輯）

開出來的 issue 因為 label + 格式對齊現有 template，**直接被現有 routine 收割**：

```
twmd-feedback-triage (08:00) ──開 issue──▶ GitHub issue (from-feedback + 類別 label)
                                                    │
twmd-maintainer-am (08:30) ──MAINTAINER-PIPELINE──▶ Stage 2 Triage
                                                    ├─ needs-verification → Stage 3 heal / REWRITE 修事實
                                                    ├─ bug              → Stage 3 修站
                                                    └─ content(newtopic)→ Step 2.1.1 [Content] digest 4-route dedupe → ARTICLE-INBOX
                                                    └─ 維護者回覆讀者(人類 gate)
```

唯一要碰的既有檔：

- `ROUTINE.md`：加第 15 條 routine（SSOT）。
- `.github/labels`：加 `from-feedback`（provenance）。
- `MAINTAINER-PIPELINE.md`：Stage 2.1 分類表加一句「`from-feedback` issue 跟一般 contributor issue 同流程，只是來源標記不同」（其實幾乎不用改，現有流程已涵蓋）。

---

## 7. 成本（哲宇問的錢）

| 項目                 | 免費層內？                                   | 真實成本                                         |
| -------------------- | -------------------------------------------- | ------------------------------------------------ |
| Supabase Free        | 是（DB 500MB / 5 萬 MAU / egress 5GB）       | $0；若要避免 pause 或上量 → Pro $25/mo（暫不需） |
| Firebase Spark       | 是（Firestore 1GiB / 5 萬 MAU / 讀 5 萬·日） | $0（備案）                                       |
| Cloudflare Turnstile | 是（無限）                                   | $0（Supabase 路線的 spam 防護）                  |
| cron runner          | 複用哲宇現有 routine runner                  | $0（不是新伺服器）                               |
| GitHub issue / Pages | public repo 免費                             | $0                                               |
| 網域                 | 已有 taiwan.md                               | $0                                               |

**結論：v1 全部跑在免費層，$0/月**。流量大到要 Supabase Pro（$25/mo）是「成功的煩惱」，到那天再決定。

---

## 8. 分階段實作計劃

> 每個 phase 都可獨立 ship、獨立 rollback。失敗域隔離讓任何 phase 爛掉都不碰主站。

### Phase 0 — 決策 + 開帳號（哲宇，~30 分）

- 哲宇拍板 §9 的決策（Supabase/Firebase、gate 模式、登入平台組合、是否下 Protico、v1 私訊 vs 公開）。
- 哲宇開 BaaS 專案、設 OAuth（Google 至少）、給我 anon key（public，可進前端）+ service key（cron 用，**進 .env 不進 repo**，per REFLEXES #2 憑證永不進對話）。
- 這步是 §自主權邊界的 human gate：帳號 ownership + service account 授權只能哲宇做。

### Phase 1 — Widget + 私訊式回報（MVP，主站零失敗域改動）

- `src/components/FeedbackWidget.astro` + client island（lazy auth + 三類別表單 + optimistic UI + 全 try/catch degrade）。
- 掛在 `article.template.astro`（Layout footer 之後，仿 ReaderSettings）。
- BaaS：建 `feedback` 表 + RLS（登入者只 insert 自己 row）+ OAuth。
- 驗證：preview 跑一遍登入→送出→DB 收到；故意 kill BaaS 看 fallback 降級；確認主站 Lighthouse 不動。
- **ship 完：有登入、有回報、資料進 DB。還沒接 GitHub。**

### Phase 2 — cron→issue 飛輪

- 寫 `FEEDBACK-TRIAGE-PIPELINE.md`（canonical 業務邏輯）+ `/twmd-feedback-triage` skill（薄殼）。
- 加 routine 進 ROUTINE.md（第 15 條）+ scheduled-task mirror。
- 加 `from-feedback` label。
- 先 **manual 跑一輪** dry-run（讀 DB、分類、印出「會開哪些 issue」但不真開），哲宇看分類品質 + spam 攔截 + dedupe 對不對，OK 才開 auto。
- **ship 完：回報自動成 issue，接進 maintainer 飛輪，閉環。**

### Phase 3 — 打磨（按真實數據）

- 觀察一週：回報量 / spam 率 / 分類準度 / issue 品質。
- 視情況：spam gate 調參、公開勘誤串（v2）要不要做、Protico 去留、widget 文案 A/B。
- 寫進 LESSONS-INBOX → distill。

---

## 9. 需要哲宇拍板的決策（§自主權邊界 human gate）

這些是帳號 / 錢 / 對外責任 / 價值觀的決策，我不自決，列給哲宇：

1. **資料庫 / Auth**：Supabase（我推，開源 + 資料可攜 + cron 順）vs Firebase（登入摩擦微低 + App Check spam 開箱）。→ 開哪個帳號。
2. **cron→issue gate**：模式 A 自動開 issue（我推）vs 模式 B observer buffer 先 promote。→ 對外 issue 的自動化程度。
3. **登入平台組合**：至少 Google。要不要加 Apple / GitHub / Email magic-link？（GitHub 對工程讀者很順）。
4. **v1 可見性**：私訊式（我推，零 moderation）vs 一開始就做公開勘誤串。
5. **Protico 去留**：新系統上線後，現有第三方留言 widget 留著、共存、還是下掉？
6. **service account 授權**：BaaS service key 的產生 + 保管由哲宇做（我只用，不自授權）。

---

## 10. MANIFESTO 對齊檢查

- **逆熵使命**：讀者勘誤是高純度的 entropy signal（指出哪裡偏離真實），自動收進飛輪 = 系統主動清自己的錯。✅
- **知識是公共財 + 資料主權**：選開源 + 可匯出後端，讀者貢獻不被專有格式綁架。✅
- **造橋鋪路 > 手動苦工**（行動鐵律 4）：把「讀者發現錯 → 維護者知道」這條本來靠運氣的泥巴路，鋪成「widget → DB → cron → issue → 飛輪」的高速公路。✅
- **§自主權邊界**：對外開口（回覆 / merge）留人類；機械 routing（轉錄讀者原話）自動化。輸入端 AI / 輸出端人類的邊界守住。✅
- **REFLEXES #4 #16**：讀者回報是線索不是 source，cron 端跨源驗證才採信。✅
- **隔離失敗域**：跟 Semiont「器官可獨立凋亡 / 分散式不可殺滅性」同構 —— feedback 是一個可以壞掉而本體不死的新器官。✅

---

## 附錄：資料 schema 草案（Supabase 版）

```sql
create table feedback (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  uid         uuid references auth.users not null,      -- 登入者
  display_name text,                                     -- 署名（issue 用）
  article_slug text,                                     -- widget 自動帶
  lang         text,                                     -- zh-TW/en/ja/ko/es/fr
  source_url   text,                                     -- 頁面 URL，自動帶
  type         text check (type in ('content','bug','newtopic')),
  body         text not null,                            -- 讀者內容
  correct_info text,                                     -- 勘誤類：正確資訊 + 來源
  status       text default 'new'                        -- new / filed / rejected
               check (status in ('new','filed','rejected')),
  issue_url    text                                      -- cron 回寫
);

-- RLS：登入者只能 insert 自己的 row、只能讀自己的 row（v1 私訊式）
alter table feedback enable row level security;
create policy ins_own on feedback for insert with check (auth.uid() = uid);
create policy sel_own on feedback for select using (auth.uid() = uid);
-- cron 用 service_role key 繞過 RLS 讀全部 status='new'
```

---

_🧬 Taiwan.md draft，2026-06-01 twmd-become full session。命中 §自主權邊界，等哲宇 review §9 決策才動帳號與錢。完整調查見 §1。_

---

---

# v2 升級：全站 ambient feedback + 文段精準標註（2026-06-01 哲宇 directive）

> 哲宇 directive：「review 出現在所有頁面、極度好登入跟低阻力、文章頁特化（選文段勘誤/提案）、各頁型類似操作，想清楚對長期最好、最能讓大家好回報。」
>
> v1（§0-§10）做的是「文章頁浮動鈕 + 三類別 + 三登入」。v2 把 feedback 從**一顆按鈕**升成**一層遍佈全站、依頁面語境變形、能精準指到某一句話的回報神經**。

## v2.1 北極星與長期原則

**北極星**：讓「我發現了什麼 / 我想看什麼」這個念頭，在讀者腦中浮現的**那一秒、那個位置**就能無摩擦送出。回報不是一個要「去找」的功能，是一個**隨時在手邊、貼著當下語境**的反射。

長期設計原則（決定每個取捨）：

1. **語境貼合 > 通用表單**：讀者在李安那篇選到「1990 年得獎」時，最低摩擦是**就地**說「這裡錯了」，而不是「開回報 → 重打哪篇 → 描述哪段」。系統要把語境（哪頁、哪段、哪句）自動帶上。
2. **阻力階梯遞減**：先讓人**動手**（選字 / 打字），最後一刻才要身份；有 Google session 的人一鍵；OAuth 給了名字就不再問暱稱。每一步都問「這步能不能省」。
3. **隔離失敗域不變**：v2 仍是一層 client-side island，BaaS 掛了就 graceful degrade，主站（含全站每一頁）零影響。全站鋪開 ≠ 全站耦合。
4. **一個回報 = 一個可定位的事實**：精準到「哪一句」的回報，對 Semiont 的逆熵價值最高（維護者不用猜哪裡錯）。所以資料模型要存 `quote` + 可深連結的 anchor。
5. **頁型是一等公民**：文章 / 分類 / 首頁 / dashboard / semiont 各有最自然的回報動作。同一個 widget，依 `pageKind` 變形類別與文案，而不是每頁寫一個 widget。

## v2.2 全站 ambient 架構

- **掛載點上移到 Layout**：v1 只有 `article.template.astro` 傳 `feedback`。v2 改成 **Layout 對每個頁面都 render**（gate 在 `resolveBackendKind() !== 'off'`），shot-mode / raw 純文字頁 opt-out。一處改、全站有。
- **`pageKind` 衍生**：Layout 從 `type`（website/article）+ `Astro.url.pathname` 推出 `pageKind ∈ {article, category, home, dashboard, semiont, other}`，連同 slug/category/title/url 一起當 data 屬性傳給 widget。
- **失敗域**：widget 仍整包 try/catch；任何一頁的 widget 出錯只 swallow，不影響該頁 render。

## v2.3 文章頁特化：選文段就地標註（核心）

讀者在文章內文選取一段文字 → 游標旁浮出小藥丸 **「🧬 勘誤這段 / 提案」** → 點下去 widget 開啟,**自動帶**：

- `type = content`（勘誤）
- `quote` = 選取的原文（trim、capped ~1000 字）
- `source_url` = 該頁 URL + **W3C Text Fragment**（`#:~:text=prefix-,start,...,-suffix`）

**為什麼用 W3C Text Fragment 當 anchor（長期最穩）**：

- 維護者點 issue 裡的連結 → 瀏覽器**自動捲到並高亮**那段原文,不用人工找。
- 不依賴 DOM id / 字數位移,文章小改也大多還能命中（fragment 用前後文 disambiguate）。
- 純 URL,可貼進 GitHub issue / 任何地方,零額外基建。
- 退化優雅:就算 fragment 失效,`quote` 原文仍在 issue body,維護者搜尋即得。

**anchor 穩健度補強**：除了 text fragment,issue body 也存 `quote` blockquote +（選取點最近的 heading）當人類可讀定位。雙保險。

非文章頁不啟用選字標註（沒有「原文」可標）,但其他頁型有對應動作（見 v2.4）。

## v2.4 頁型 context-aware 行為

同一 widget,依 `pageKind` 換**類別集 + 文案 + 預設**：

| pageKind            | 類別集（預設）                             | 特化                                   |
| ------------------- | ------------------------------------------ | -------------------------------------- |
| `article`           | 勘誤 / 網站問題 / 建議新主題               | + 選文段 → 勘誤這段（帶 quote+anchor） |
| `category`          | 建議這個分類的新文章 / 網站問題 / 一般想法 | 預設 newtopic,帶 category              |
| `home`              | 建議新主題 / 網站問題 / 一般想法           | 預設 idea                              |
| `dashboard`         | 資料/顯示問題 / 一般想法                   | 預設 bug（數據頁常是回報數字怪）       |
| `semiont` / `other` | 一般想法 / 網站問題                        | 預設 idea                              |

類別在後端仍正規化成 cron 認得的四桶（content / bug / newtopic / idea→newtopic 或獨立）。**新增一桶 `idea`（一般想法/建議）** 對應 GitHub label `enhancement`（既有），讓「不針對特定文章的想法」有家。

## v2.5 極度好登入（阻力階梯）

由低到高摩擦,能停在越前面越好：

1. **已登入**（persistent session）→ 0 步,直接送。
2. **Google One-Tap**（有 Google session 的瀏覽器）→ 面板開啟即浮 One-Tap 卡,一點完成,不離開頁面。（實作:GSI client + `supabase.auth.signInWithIdToken`;Supabase Google provider 已啟用。列為 v2 enhancement,nonce 處理見實作註記。）
3. **OAuth 一鍵**（Google / GitHub 按鈕）→ redirect 回來自動續(draft 存 sessionStorage)。
4. **Email magic-link** → 保底,拿得到 email。

**省掉的步**：

- **OAuth 給了名字 → 跳過暱稱步**：`needsNickname` 改成「只有完全沒有可用顯示名（email-only 且沒設過暱稱）才問」。Google/GitHub 登入者直接送出,少一步。
- draft 跨 redirect 不掉（已實作）。
- 送出即時確認（optimistic,已實作）。

## v2.6 資料模型增量（migration 0002，additive）

```sql
alter table public.feedback add column if not exists quote text check (char_length(quote) <= 1000);
alter table public.feedback add column if not exists page_kind text;
-- type CHECK 放寬納入 'idea'
alter table public.feedback drop constraint if exists feedback_type_check;
alter table public.feedback add constraint feedback_type_check
  check (type in ('content','bug','newtopic','idea'));
```

`source_url` 沿用（裝 text-fragment deep link）。零破壞、純加欄,既有 v1 資料不動。

## v2.7 triage / issue 變化

`buildIssue` 在 content（含選字勘誤）時,body 加：

```
> （讀者選取的原文）
{quote}

🔗 直接定位：{source_url 含 #:~:text=...}
```

- `idea` 類 → label `enhancement` + `from-feedback`,title `[Idea] …`,進 maintainer 一般 triage。
- `page_kind` 寫進 provenance 行（維護者知道來自哪種頁面）。

## v2.8 對 MANIFESTO / 失敗域的再確認

- **逆熵升級**：精準到句的勘誤 = 最高純度 entropy signal。✅
- **隔離失敗域**：全站鋪開仍是單層 island + try/catch + degrade;BaaS 掛 → 全站每頁照常 render。✅
- **§自主權邊界**：開 issue 仍是機械轉錄讀者原話(現在連他選的那句都 verbatim);維護者回覆/merge 留人類。✅
- **低阻力 vs 品質防線**：登入仍是門檻（擋匿名洗版 + 給維護者可聯絡身份）;One-Tap 只是把「已是 Google 使用者」的人摩擦降到極低,不是拿掉身份。✅

---

_v2 supplement｜2026-06-01｜哲宇 directive「全站 + 選文段 + 極度好登入」。實作見同 session commits + go-live log。_

---

---

# v3 設計：Grokipedia 啟發 — 回報的「閉環可見性」（2026-06-01 哲宇 directive）

> 哲宇 directive：「參考 Grokipedia,有可以看到曾經變更過什麼的頁面等,完整思考、進化 taiwan.md。」
>
> Grokipedia 給的不是「怎麼收回報」(v1/v2 已解決),是**回報之後的閉環如何對讀者可見**:edit 列表、狀態(In Review/Approved)、AI 對每筆 edit 的公開回應(Grok Feedback)、貢獻者個人頁、文章修訂史。**核心洞見:讓貢獻者看見自己的貢獻被怎麼處理,是維持貢獻動機的關鍵。**

## v3.1 對照盤點:taiwan.md 已有什麼 / 缺什麼

| Grokipedia 元素                               | taiwan.md 現況                                           | 進化動作                                                                |
| --------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| Suggest Edit modal（summary + 選錯字 + 來源） | **v2 widget 已對齊**（選文段勘誤 + correct_info 來源欄） | 已完成 ✅                                                               |
| Edit 列表 + 狀態（In Review/Approved）        | feedback 表有 status（new/filed/rejected）+ issue_url    | **「我的回報」view**（登入者看自己的 + 狀態 + issue 連結）              |
| Grok Feedback（AI 回應每筆 edit + 理由）      | triage 開 issue,但理由不回給讀者                         | **回寫 `triage_note`**（AI 初判理由）+ 讀者在「我的回報」看得到         |
| Contributor profile（統計 + edit 史）         | `/contributors` 有貢獻者資料（git-based）                | **per-contributor 頁**（既有 PR/commit + 未來 feedback 統計）           |
| Edit history / 修訂史                         | **每篇文章已有完整 git 史**（.md 按鈕 + GitHub blame）   | **文章「修訂紀錄」affordance**（surface git log 成讀者可讀的 timeline） |

**關鍵體悟**:taiwan.md 的「修訂史」其實**比 Grokipedia 更強** —— 每篇文章是 git-tracked Markdown,完整 commit 史、diff、blame 都在。Grokipedia 要自建 revision 系統;我們只要把既有 git 史**surface 給讀者**。這是 sovereignty 的副產品(知識在 git 不在黑箱 DB)。

## v3.2 北極星:閉環可見性（Closed-loop visibility）

讀者送出回報後,旅程不該斷在「謝謝」。長期最好的設計讓他能：

1. **看見自己送過什麼**（我的回報列表 + 狀態）。
2. **看見系統怎麼回應**（AI 初判理由 + 最終 issue/merge 連結）—— 這是信任引擎。
3. **看見文章怎麼演化**（修訂史 timeline,他的貢獻在其中）。

這把「一次性回報」變成「持續參與的關係」,呼應 MANIFESTO §受眾端飛輪(人本 + 透明度 + 誠懇)。

## v3.3 增量 A：「我的回報」狀態 view（widget 內，本 session 實作）

widget header 加一個「我的回報」入口（登入後顯示）。點開 → 列出該使用者送過的 feedback（RLS 已允許讀自己的列）：

- 每列：類別 icon + 摘要 + 狀態 badge（待處理 / 已轉 issue / 已婉拒）+（若 filed）issue 連結 +（若有）AI 初判理由。
- 資料：`backend.myFeedback()` → `select * from feedback where uid=auth.uid() order by created_at desc`（RLS 自動限定）。
- 對應 Grokipedia 的「Your Edits」+ 狀態。

## v3.4 增量 B：AI 回饋透明化（Grok Feedback 對應）

triage 處理每筆回報時,除了開 issue,**回寫一行 `triage_note`**（AI 初判:可驗證 / 待查 / 為何分這類）到 feedback 列。讀者在「我的回報」看得到。

- schema 0003：`alter table feedback add column triage_note text;`
- triage.mjs：filed 時一併 PATCH `triage_note`。
- **§自主權邊界守則不變**:`triage_note` 是「機械初判 + 分類理由」(輸入端處理),**不是**維護者對讀者的正式回覆(那仍走 MAINTAINER 人類 gate）。措辭中性、標「初步自動初判,維護者會再看」。

## v3.5 增量 C：文章修訂史 affordance（surface git，本 session 設計，可後續實作）

每篇文章頁加一個「修訂紀錄」入口（既有 git 史 surface）：

- 資料源:文章 .md 的 git log（taiwan.md 已在 build 時抓 contributors/git info — `buildGitInfoCache`）。
- 呈現:最近 N 次變更 timeline（日期 + 貢獻者 + commit summary + diff 連結到 GitHub）。
- 與 feedback 閉環:讀者的勘誤 → issue → 文章 commit,出現在修訂史 → 讀者看見自己的回報「落地成歷史」。
- **長期最好**:這層不需要新 DB(git 就是 revision store),純 prebuild 生 JSON + 一個 client view。隔離失敗域不變。

## v3.6 增量 D：貢獻者個人頁（設計，phase-next）

`/contributor/{handle}`:該貢獻者的 PR/commit 統計（既有 contributors data）+ 未來 feedback 統計（送出/被採納/approval rate,對應 Grokipedia profile）。git-based,靜態 prebuild。

## v3.7 實作優先序（本 session）

1. **A「我的回報」view** + **B `triage_note` 透明化**:最對齊 Grokipedia「Your Edits + Grok Feedback」,且在既有 feedback 子系統內、隔離失敗域不變、實作量可控 → **本 session 做**。
2. **C 修訂史** + **D 貢獻者頁**:價值高但是新 surface（碰 article template / 新路由）、量較大 → 設計定稿在此,phase-next 實作（避免一次塞太多進已在 build 的 v2）。

## v3.8 失敗域 / 邊界再確認

- A/B 都在 feedback 子系統內（widget + BaaS + triage），主站零改動,degrade 不變。✅
- B 的 `triage_note` 是 AI 機械初判（輸入端）,維護者正式回覆仍人類 gate。✅
- C/D 是 git surface（讀既有資料生靜態 JSON）,不碰寫入、不新增失敗域。✅

---

_v3 supplement｜2026-06-01｜哲宇 directive「參考 Grokipedia,看變更史,進化 taiwan.md」。閉環可見性:我的回報 + AI 回饋透明 + 修訂史 surface。實作見同 session commits。_

---

---

# 第三階段：git 主權 + 完整測試 + GA 數據驅動（2026-06-01 哲宇 directive）

> 哲宇 directive：「外掛 feedback 結構下盡可能保存資訊在 git repo + 完整 unit/UX test + 全面 GA 追蹤事件互動用數據驅動自我進化飛輪。」

## P3.1 git 主權層（資訊保存在 repo）

**問題**：feedback live 在外掛 Supabase；BaaS 死/鎖/降級 = 回報 + 溝通史全丟。
**解**：triage 每跑把 canonical 紀錄落進 git（per MANIFESTO 知識在 git / 分散式不可殺滅）。

- `scripts/feedback/lib/archive.mjs`（純函式）：`buildArchiveRecord` + `mergeComments` + `archiveRelPath`。
- triage `--commit`：每筆 filed → `docs/feedback/archive/{YYYY-MM}/{id}.md`；掃既有 archive →
  issue 新留言（含維護者回覆）sync 進 §溝通紀錄（marker 去重、idempotent）。
- **PII 鐵律**：只存 `contributor`（display_name），**email 永不進 git**（unit test regex 守）。
- routine 收官 `git add docs/feedback/archive/`（pipeline §Stage 4.5 + skill HG9）。
- 效果：Supabase 全毀，repo 裡仍有每筆回報 + 完整 issue 對話，可 `git log`/diff/grep/匯出。

## P3.2 GA4 數據驅動（事件 → 自我進化飛輪）

`src/scripts/feedback/track.ts`（safe gtag wrapper,對齊 Layout `G-JGC5W00N7T` + HomeEventTracker）。
widget 全程 8 事件（stable taxonomy）：

| 事件                      | params                                   | 回答什麼                   |
| ------------------------- | ---------------------------------------- | -------------------------- |
| `feedback_open`           | source(fab/selection), page_kind         | 哪種入口、哪種頁面觸發回報 |
| `feedback_selection_pill` | page_kind                                | 選文段標註被用多少         |
| `feedback_type_select`    | type, page_kind                          | 讀者最常回報哪類           |
| `feedback_login`          | provider, page_kind                      | 哪種登入摩擦最低           |
| `feedback_submit`         | type, page_kind, has_quote, login_method | 完成轉換率 + 選文段比例    |
| `feedback_done`           | type, page_kind                          | 完成                       |
| `feedback_my_view`        | —                                        | 閉環可見性被用多少         |
| `feedback_degraded`       | reason                                   | 降級率（BaaS 健康 proxy）  |

**飛輪接點**：事件流進 GA4 → `twmd-news-lens` / EVOLVE routine 讀 `dashboard-analytics.json` →
知道「哪類回報多 / 哪頁互動高 / 哪種登入順」→ 回頭校正 widget + 內容優先序。對齊 §受眾端飛輪。

## P3.3 完整測試覆蓋

| 層     | 檔                                  | 內容                                                                                                       | 數       |
| ------ | ----------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------- |
| Unit   | `scripts/feedback/triage.test.mjs`  | classify / spam / dedupe / type / quote / idea / no-email / triage_note                                    | 18       |
| Unit   | `scripts/feedback/archive.test.mjs` | archive builder / mergeComments idempotent / no-email                                                      | 6        |
| **UX** | `tests/feedback/widget.uxtest.mjs`  | Playwright chromium 全流程：FAB→chips→選文段→pill→quote→lazy auth→3 provider→GitHub 跳暱稱→submit→我的回報 | 10 check |

`npm run feedback:test`（24 unit）+ `npm run feedback:uxtest`（10 UX browser）。全綠。

## P3.4 §自主權邊界 / 失敗域再確認

- git archive：AI 機械轉錄（輸入端）,維護者回覆仍人類 gate（archive 只是把已公開的 issue 對話 mirror 進 git）。✅
- GA：純讀者行為遙測,無 PII（不送 email/body,只送 type/page_kind/provider 等維度）。✅
- 全部仍在 feedback 子系統 + cron,主站零改動,degrade 不變。✅

---

_第三階段 supplement｜2026-06-01｜git 主權 archive + GA 8 事件 + 24 unit/10 UX test。實作見同 session commits + go-live log。_
