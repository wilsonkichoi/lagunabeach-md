# Refactor 完整驗證報告 — 功能性 / 渲染 / CI 編譯 / Before-After — 2026-06-13

> session `2026-06-13-002414-refactor-article` 第二階段（哲宇 directive：完整 report 確認功能性
> 與渲染沒問題、CI/CD 編譯順利、改善前後比較；+ CI/CD pipeline 審計最佳化 + dashboard refactor）
>
> 姊妹報告：[article-template-refactor-2026-06-13.md](article-template-refactor-2026-06-13.md)（診斷 + 修法 + 方法論）
> 前案：[build-pipeline-audit-findings-2026-06-10.md](build-pipeline-audit-findings-2026-06-10.md)

---

## TL;DR

| 維度             | 結果                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------ |
| **功能性**       | ✅ 4,758 篇文章頁 byte-identical；dashboard 15/15 section 全活（zh+en）；console 零錯誤    |
| **渲染（線上）** | ✅ production 部署後 spot-check：tw-模組 / 腳註 / 六語言 / dashboard 全正常                |
| **CI 編譯**      | ✅ run 27430636879 success（含 article refactor 的第一個 deploy 全綠）                     |
| **Before/After** | CI Build step **1,125s → 125s（-89%）**；push→artifact ~21min → **4.5min**；本機 9m49s→40s |
| **CI/CD 審計**   | 6/10 五大熱點已全數落地（本次驗明）+ 本次補 OG cache churn 修（每天省 ~2.8GB quota）       |
| **dashboard**    | 5,329 → 629 行；每頁 HTML -52%（189.8KB→90.3KB ×6 語言）；bundle 共用可快取                |

---

## 1. 功能性驗證

### 1.1 Article 路徑（4,758 頁 ×6 語言）

- **HTML parity**：5,268 個 HTML 檔全比對（normalize asset hash / scope id 後逐檔 `cmp`），
  文章頁 **4,758/4,758 byte-identical**。唯一 1 個 diff 是 `/semiont/index.html`，根因是該頁
  build 時對自己 API 的網路 fetch flake（baseline 那側壞），與 refactor 無關（詳姊妹報告 §7.2，
  已開 spawn task）
- **Feature spot-check（build 輸出）**：tw-\* 視覺模組（型錄頁 8 處）/ GFM 腳註（justfont 42 處）/
  SSODT spore footprint / 貢獻者 sidebar（zh 8、en 8、politics props-fallback 7）全部存在
- **post-build smoke**：`post-build-check.mjs` ✅ 5,268 頁、六語言 lang attribute 全過
- **內鏈 gate（CI 實跑）**：verify-internal-links PASSED — gated broken ratio 0.73% < 7.0%

### 1.2 Dashboard 路徑（本次 refactor，6 語言頁）

`astro preview` 對 refactor 後 build 的實測（2026-06-13 01:1x）：

- **15/15 section 全部渲染有料**（vitals 145ch / activity 475 / registry **63,919** /
  health-distribution / organism / translation / i18n / immune / spores 1,091 /
  contributors 926 / growth / content-analysis / **analytics 3,459（d3 詞雲，CDN defer 路徑）** /
  supporters / next-steps），thin/empty = 0
- **/en/dashboard** 同樣 15/15；`isEn` 分支驗證：registry 表分類標籤輸出英文（Culture/History/
  Technology），`<html lang>` shim 取值正確（en）
- **Console**：error + warning 零條；hero stats（793 文章 / 6 語言 / 63 貢獻者）+
  「資料更新 …（2 小時前）」相對時間 helper 正常 → 截圖存證於 session transcript
- lang 注入機制變更（`define:vars` → 讀 `<html lang>`）的安全網：post-build-check 每 build
  驗證六語言頁的 lang attribute 正確性，等於每次部署都回歸測試這個 shim 的輸入

### 1.3 Production 驗證（deploy 後線上 spot-check）

| URL                                   | 結果                      |
| ------------------------------------- | ------------------------- |
| `/technology/justfont與台灣字體發展/` | ✅ 43 個腳註/模組 feature |
| `/en/art/taiwan-new-media-art/`       | ✅ 13 feature             |
| `/society/視覺化模組型錄/`            | ✅ 7 個 tw-\* 模組        |
| `/ja/dashboard/`                      | ✅ HTTP 200               |

（dashboard refactor 的 production 驗證在第二個 deploy（a3ec8ede5）落地後比照 §1.2 重抽——
deploy 約 5 分鐘，run 27431236634。）

---

## 2. CI/CD 編譯順利性（實證）

**Run [27430636879](https://github.com/frank890417/taiwan-md/actions/runs/27430636879)**（5ed784cfb，
含 article refactor 的第一個 deploy）：**conclusion = success**，build job 全步驟綠：

```
Checkout 27s → restore-mtime 0s → npm ci 19s → frontmatter 2s → article-health 9s
→ OG cache restore 5s → Playwright 25s → OG generate SKIPPED（mtime incremental 生效）
→ Build 125s → Upload artifact 41s
build job 合計 4m31s；deploy job 接手 → production 上線
```

Build step 內部（CI log 實測）：prebuild ~39s + **astro 56.5s**（vite 0.5s + 靜態生成 46.3s）

- postbuild ~29s（post-build-check + 平行化內鏈驗證 28s）。

第二個 deploy（dashboard refactor + OG cache split，run 27431236634）發稿時 in-flight，
結果補記於 §6。workflow 變更（cache restore/save 拆分）的語法與行為由該 run 直接驗證。

---

## 3. Before / After 比較（哲宇問的「有沒有被改善」）

### 3.1 CI 實數（GitHub Actions，4 vCPU x86）

| 指標                      | 6/10 audit 基線 | 本次 run 27430636879 | Δ        |
| ------------------------- | --------------- | -------------------- | -------- |
| **Build step（CI 計時）** | 1,125s          | **125s**             | **-89%** |
| astro 階段                | 943.2s          | **56.5s**            | **-94%** |
| 靜態頁生成                | 931.2s          | 46.3s                | **20×**  |
| postbuild 內鏈驗證        | 64.4s           | ~28s                 | -57%     |
| OG 步驟                   | ~66s 全量重產   | SKIPPED（增量生效）  | -66s     |
| **push → artifact**       | ~21 min         | **4.5 min**          | **-79%** |

> 注意歸因：astro 943→56.5s 是本次 article refactor（git 子程序 ×4,697→6）；OG/內鏈/感測器
> 三項是 6/10 audit 修補在本 run 的首次乾淨量測（之前被 astro 的 943s 蓋住不顯眼）。

### 3.2 本機 A/B（Apple Silicon，內容凍結，僅 astro build）

| 指標              | Before   | After  |
| ----------------- | -------- | ------ |
| wall              | 9m49s    | 40.4s  |
| 文章頁 avg render | ~330ms+  | 18.5ms |
| git log 子程序    | 4,697 次 | 6 次   |

### 3.3 頁面重量（dashboard refactor）

| 指標                       | Before                   | After                         |
| -------------------------- | ------------------------ | ----------------------------- |
| dashboard.template.astro   | 5,329 行                 | 629 行（-88%）                |
| dashboard HTML（每語言頁） | 189.8KB                  | 90.3KB（**-52%**）            |
| client JS                  | 內嵌 ×6 頁各一份         | 62.6KB hashed bundle 六頁共用 |
| CSS                        | 內嵌 `<style is:global>` | 32.9KB bundle，瀏覽器可快取   |

### 3.4 檔案長度（兩場手術合計）

| 檔案                     | Before | After | 抽出去向                                                            |
| ------------------------ | ------ | ----- | ------------------------------------------------------------------- |
| article.template.astro   | 2,241  | 1,326 | utils/article-render.ts（948）                                      |
| dashboard.template.astro | 5,329  | 629   | scripts/dashboard-client.js（2,741）+ styles/dashboard.css（1,981） |

---

## 4. CI/CD pipeline 完整審計（2026-06-13 現況）

逐步讀 deploy.yml + prebuild 鏈 + 關鍵腳本後的盤點：

### 4.1 已修（6/10 audit top-5 的落地驗證，本次逐一讀碼 + run 實證）

| 熱點                           | 現況                                                                                                                                                             |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #1 mtime restore 壞掉          | ✅ 已換 repo 自有 `scripts/ci/restore-mtime.py --verify-min-ratio 0.9`（ratio guard，再壞 fail loud）；本 run OG SKIPPED 證明生效                                |
| #4 內鏈驗證單執行緒            | ✅ 已抽 `verify_internal_links.py` multiprocessing；本 run 28s（原 64s）                                                                                         |
| #6 build-perf 感測器假數據     | ✅ `grep -o` 修正 + 真 7d/30d 時間窗 + coverage_days + CI self-skip（31 次 serial API 移出關鍵路徑）。**前一輪 handoff 寫「#6 未修」是過時情報，以本次讀碼為準** |
| #7 死 content-collection cache | ✅ 已移除（deploy.yml 留註解）                                                                                                                                   |
| #2 astro 943s 本體             | ✅ 本次 article refactor 解掉（diagnosis 在姊妹報告）                                                                                                            |

### 4.2 本次新修

- **OG cache churn**（audit §⑤）：`actions/cache@v4`（key 含 run_id = 每 run 必存 186MB，
  ~15 run/天 ≈ 2.8GB/天 quota churn，會 LRU 擠掉 npm / playwright cache）→ 拆
  `cache/restore` + `cache/save`，save 僅在 `og-changes.needed == true`。功能等價論證：
  needed=false ⟺ OG 內容無變更 ⟺ 存回去是純浪費；og-rename-sync 的 mv 冪等，skip save
  最壞情況 = 下一 run 重做 mv（commit a3ec8ede5）

### 4.3 評估後不動（理由記錄，防止未來重複評估）

| 候選                           | 不動的理由                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| sync.sh rm-rf 全量重建（13s）  | 冪等性是 SSOT 轉錄器官的核心保證；rsync --delete 等價但 blast radius 高、省 ~10s 不值                |
| node_modules 整包 cache        | postinstall 觸發 sync.sh 的耦合 + cache 失效邊界複雜；npm cache 已涵蓋下載，省 ~10s 不值             |
| checkout fetch-depth: 0（27s） | restore-mtime + buildGitInfoCache + content-dates 都吃完整 git history；shallow 化是長期項（見 4.4） |
| timeout-minutes: 120           | 安全墊，無害                                                                                         |

### 4.4 長期項（依賴先後排序）

1. git 資料全面 prebuild 化（contributors/lastModified/revisionCount 併進 content-dates 的
   JSON 產線）→ astro 階段零 git 依賴 → **CI 才能 shallow clone**（checkout 27s → ~5s）
2. HTML 頁面重量（~200KB/頁 → artifact 1.7G）：Tailwind class 字串與重複 inline SVG 是大宗，
   屬獨立工程（dashboard 模式可複製到其他 inline-heavy 頁）
3. Astro 官方增量 build：roadmap [#237](https://github.com/withastro/roadmap/discussions/237)
   已同意探索、未 ship；route caching（Astro 6 experimental）是 SSR 取向，靜態部署不適用

---

## 5. 殘留風險與緩解

| 風險                                        | 緩解                                                                  |
| ------------------------------------------- | --------------------------------------------------------------------- |
| dashboard lang shim 依賴 `<html lang>` 正確 | post-build-check 每 build 驗證六語言 lang attribute（既有 gate）      |
| dev server 期間 git info 不隨新 commit 更新 | 與 articles-index 同款 trade-off；static build 無影響（程式註解已標） |
| OG conditional save 邊界（rename 視窗）     | mv 冪等；最壞情況下一 run 重做；ratio guard 守 mtime 端               |
| /semiont 頁 build-time self-fetch flake     | 既有 latent bug（非本次引入），spawn task task_375cc9ff 待修          |

---

## 6. 第二個 deploy 結果補記

**Run [27431236634](https://github.com/frank890417/taiwan-md/actions/runs/27431236634)**（a3ec8ede5，
dashboard refactor + OG cache 拆分）：**success**。

- **Build step 124s** — 跟 run 1 的 125s 一致，快 build 穩定重現，且本 run 已含 dashboard refactor
- **`Save OG image cache: skipped`** — 本 commit 沒碰 knowledge/，conditional save 如設計跳過
  （186MB churn 消失的第一個實證）；`Generate OG: skipped` 同步證明 mtime 增量持續健康
- **Production 終驗**：`/dashboard` HTTP 200 / 90.6KB（原 ~190KB），HTML 引用的
  `dashboard.template…riAnwfwr.js`（62,562B）與 `dashboard.BBSxqsJj.css`（32,907B）皆 200，
  **hash 與本機 preview 功能實測（§1.2 的 15/15 section）的 bundle 完全相同** —
  線上跑的就是驗過的那份。`/en/dashboard` 200 / 91KB

驗證鏈閉合：local parity → preview 功能實測 → CI 兩 run 全綠 → production 資產 hash 一致。

---

_作者：Taiwan.md 🧬（session 2026-06-13-002414-refactor-article 第二階段）_
_驗證方法鏈：HTML parity（normalized cmp ×5,268）→ preview 功能實測（15 section ×2 lang）→ CI run 實證 → production spot-check_
