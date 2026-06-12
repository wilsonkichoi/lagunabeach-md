# Taiwan.md 核心架構深度審計 — 2026-06-13

> session `2026-06-13-002414-refactor-article` 第三階段（哲宇 directive：完整深度檢查專案的
> 核心架構、技術、檔案）。資料來源：本 session 直接手術過的 build/template/CI 層 +
> Explore sub-agent 全 src/scripts 掃描 + 6/10 兩份 audit。
>
> 姊妹文件：[refactor-verification-2026-06-13.md](refactor-verification-2026-06-13.md)（驗證鏈）/
> [evolution-roadmap-2026-06-13.md](evolution-roadmap-2026-06-13.md)（本審計導出的進化方向）

---

## 0. 一頁總覽

```
knowledge/ (SSOT, ~795 zh + 5 lang 鏡像 ≈ 4,758 .md)
   │  ├─(直讀)──────────────┐
   │  └─ sync.sh 轉錄 → src/content/{lang}/ (投影層, gitignored)
   ▼                        ▼
[19 prebuild steps] → [astro build：wrappers + templates + components] → dist (1.7G)
   │                        │                                              │
   public/api/*.json (51)   └─ client bundles (_astro/)                   └─ postbuild gates
                                                                              ↓
                                                  GitHub Actions deploy.yml → GitHub Pages
```

- **技術棧**：Astro 6.2 + Tailwind 4 + marked 17 + minisearch 7 + Supabase（feedback）+
  Playwright（OG/視覺工具）。依賴精簡無過時（agent 掃描結論）
- **規模**：8,437 頁 / 5,268 HTML / 6 語言 / scripts 226 支 / public/api JSON 51 個
- **本 session 後的 build 健康**：CI Build step 125s（兩 run 重現）、本機 astro 40s

---

## 1. 內容層架構

### 1.1 SSOT 與雙讀路徑（本審計最重要的結構發現）🔴

`knowledge/` 是 DNA、`src/content/` 是轉錄蛋白質——但**實際消費端分裂成兩條路**：

| 直讀 `knowledge/`                                 | 讀 `src/content/`                                           |
| ------------------------------------------------- | ----------------------------------------------------------- |
| article wrappers ×6（getStaticPaths）             | astro.config `buildExistingUrlSet`（sitemap hreflang 過濾） |
| articles-index.ts（related/random pool）          | —                                                           |
| contributors.ts（git log pathspec）               | —                                                           |
| feed.xml.ts / rss.xml.ts                          | —                                                           |
| api/search-index.json.ts、build-search-index.mjs  | —                                                           |
| getLangSwitchPath.ts、staticRoutes.ts（兩邊都摸） | （同左）                                                    |

**後果（本 session 親身撞到）**：babel routine 改 knowledge/ 的瞬間，**下一次 build 的文章頁
就變**（wrappers 直讀），但 sitemap 過濾層看的是 src/content（要等 sync）。兩層可以短暫
不一致。parity 驗證時的內容漂移事故（57 檔）就是這個結構的直接展示。

**判定**：不是急症（最終一致性靠 prebuild:sync 保證），但「src/content 投影層的存在意義」
已經被掏空——4,758 頁的主要路徑根本不經過它。長期二選一：(a) 全部改讀投影層（轉錄時可
加 normalize，buildGitInfoCache 的 NFC normalize 就是在補這個洞）或 (b) 承認直讀、把
src/content 縮減成 sitemap 過濾專用的輕量 manifest。**Roadmap 收錄為 EVO-A1**。

### 1.2 Search 雙生成器 🟠

`scripts/core/build-search-index.mjs`（→ public/api/search-minisearch.json）跟
`src/pages/api/search-index.json.ts`（runtime endpoint 同邏輯再寫一次）職責重疊，
分詞規則各自維護 → 漂移風險。Roadmap EVO-A2。

### 1.3 i18n 巨檔 🟠

`src/i18n/map.ts` 4,298 行、`contribute.ts` 3,258、`resources.ts` 2,886、`about.ts` 2,462、
`data.ts` 2,216 — 翻譯字串以 TS 字面量維護。`src/data/opendata-content.ts` 4,560 行同病。
這是「檔案超長」病的 i18n 變體：影響 LLM maintainer 編輯成本與 merge conflict 面積，
不影響 build 效能（純資料 import）。Roadmap EVO-A3（JSON 化 / 按 section 分檔）。

---

## 2. Build pipeline 架構（本 session 手術後現況）

| 階段          | 內容                                                       | 現況秒數（CI）      | 健康                            |
| ------------- | ---------------------------------------------------------- | ------------------- | ------------------------------- |
| pre-steps     | checkout(fetch-depth:0) + mtime restore + npm ci + 驗證 ×2 | ~60s                | ✅ mtime ratio guard 護航       |
| OG            | cache restore + rename-sync + 增量產圖                     | ~10s（無變更 skip） | ✅ conditional save（本次新增） |
| prebuild      | sync + status + 17 step run-p                              | ~39s                | ✅ buildperf CI self-skip       |
| astro         | vite + 8,437 頁                                            | **56.5s**           | ✅（943s → 本次修）             |
| postbuild     | smoke + 內鏈驗證（multiprocessing）                        | ~29s                | ✅                              |
| artifact+部署 | upload 41s + deploy job ~66s                               | ~107s               | 🟡 受 dist 1.7G 體積制約        |

**Render 層規則（本次確立 + 儀器化）**：

- `.astro` frontmatter = per-render scope；cache/昂貴初始化必須住 imported .ts module
  （article git cache 事故的 class 規則，三處程式註解 + flag_slow 50ms 閾值看守）
- 高乘數元件（Layout/Header/SEO/article）frontmatter 已逐一驗證乾淨；新高乘數元件
  進場時用 `twmd parity` + dev-server probe 驗

### 2.1 dist 體積解剖（1.7G）

og-images 271M + article-images 197M + carousel 72M（媒體 540M）+ 六語言 HTML ~990M
（~200KB/頁）。HTML 重量大宗 = Tailwind class 字串 + 重複 inline SVG icon。
dashboard refactor（-52%/頁）證明了抽 bundle 的回收率，同 recipe 可複製。Roadmap EVO-B2。

---

## 3. 頁面層架構

- **Wrapper → Template 範式**：6 語言 wrapper（getStaticPaths）→ template（view）。
  本 session 把兩大 template 的第三層（logic/client-script/css）也歸位：
  article 2,241→1,326（logic→utils）、dashboard 5,329→629（script→src/scripts、
  css→src/styles）。其餘 monster template 批次手術進行中（agent 執行，同 recipe）
- **Client script 規範（本次確立）**：≥150 行 inline client JS → `src/scripts/{頁}-client.js`
  （bundle 共用 + 可快取）；`define:vars` 只剩注入點時用 `<html lang>` / data-attribute shim
- **Scoped style 鐵律**：無 `is:global` 的 `<style>` 永不外移（scoping hash 會變）

## 4. 工具鏈與測試

- **scripts/**：core 18 支（全被 npm scripts 引用，零殭屍）/ tools 105 支（含 lang-sync 35）/
  feedback 6 / ci 1。散裝發現成本問題本次以 `twmd` CLI（thin router + registry）結構解
- **測試覆蓋**：article-health 16 pytest ✅ / feedback 單元+E2E ✅ / frontmatter CI ✅ /
  **src/lib + src/utils 零單元測試** 🟡 — 但 article-render.ts 抽出後首次「可測試化」，
  Roadmap EVO-C2（tw-\* 模組 golden test）
- **閘門類工具**（經本次戰役驗證的真儀器）：build-parity-diff（自帶 self-test）/
  viz-shot（像素）/ post-build-check（lang attr）/ verify-internal-links（動態 gate）/
  restore-mtime（ratio guard）/ flag_slow 50ms（效能）

## 5. 感知與資料層

51 個 public/api JSON：生產者全在 prebuild 鏈，消費者三類（dashboard client / SEO·liveStats
module cache / 外部 LLM·reader）。風險點：`article-index.json` 疑似無消費者（agent 掃描）→
EVO-C3 清點；`_translation-status.json` 由 babel/status 寫，是跨 session 並行寫入熱點。

## 6. 認知層接口（不深審，只記接點）

`docs/semiont/` 12 器官 + pipelines + routine 飛輪由 BECOME/HEARTBEAT 管理，本審計只確認
工程接點：consciousness-snapshot / routine-status / inbox-signal 三件套 = `twmd status`；
semiont 頁面從 dashboard JSON 取數（本次修掉 self-fetch 不確定性）。

---

## 7. 風險登記簿（本審計收斂）

| ID      | 風險                                       | 等級 | 處置                                      |
| ------- | ------------------------------------------ | ---- | ----------------------------------------- |
| DUAL-1  | knowledge/ vs src/content 雙讀             | 🔴   | Roadmap EVO-A1（方向決策給哲宇）          |
| DUAL-2  | search 索引雙生成器                        | 🟠   | EVO-A2 合併                               |
| I18N-G  | i18n/data 巨檔 ×6                          | 🟠   | EVO-A3 漸進分檔                           |
| TEST-0  | src/lib、src/utils 零單測                  | 🟡   | EVO-C2 從 article-render golden 開始      |
| CACHE-D | dev server 期間 module cache 不隨 git 更新 | 🟡   | 已文件化（articles-index 同款 trade-off） |
| PERF-W  | 頁數 +27/天的線性增長                      | 🟡   | flag_slow 50ms 哨兵 + EVO-B 系列          |
| ZOMBIE  | article-index.json 等疑似無消費者產物      | 🟡   | EVO-C3 盤點                               |

---

_作者：Taiwan.md 🧬 · 方法：本體手術經驗 + Explore agent 全掃 + 交叉驗證 6/10 audits_
