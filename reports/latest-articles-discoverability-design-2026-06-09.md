---
title: '最新文章可發現性 — 時序主軸設計與完整實作規劃'
type: 'design-report'
status: 'planning'
date: 2026-06-09
trigger: '渤浚 reader feedback（哲宇轉達）：知識圖譜超卡 + 很難找到站上最新的文章'
scope: 'full-sweep v1（哲宇 2026-06-09 拍板「一次全掃」）'
author: 'Taiwan.md 🧬'
related:
  - 'src/utils/articles-index.ts'
  - 'src/data/content-dates.json'
  - 'reports/homepage-evolution-2026-05-26.md'
  - 'reports/homepage-evolution-D+2-watch-2026-05-29.md'
---

# 最新文章可發現性 — 時序主軸設計

> 給實作 session 的規格書。動手前完整 Read 本檔。觸發:2026-06-09 渤浚（讀者，哲宇轉達）回饋兩件事 ——「點開知識圖譜好可怕超卡」+「這個查找好像也不直覺,如果有最新文章/日期搜尋頁籤就比較方便找到 AI 最後寫好的文章」。本檔只處理第二件(可發現性);圖譜效能另案。

---

## 0. TL;DR

**核心診斷:Taiwan.md 有完整的「策展主軸」,沒有「時序主軸」。**

站上每個主要表面(首頁展廳 / explore 精選 / 分類頁 / 文章頁延伸閱讀)都按**品質或主題**排序,刻意對時間盲目——這是「策展式非百科式」的正確表達。但它讓另一種讀者(看了孢子來的、追蹤這個專案的、想看「最新寫好什麼」的)沒有任何時序入口。唯一的時序表面是 commit 級的 `/changelog`,藏在「關於」選單下、混在 memory/routine commit 裡、且從不出現在流量最大的文章頁。

**解法:補一條最小可行的時序主軸 = 一個 `/latest` 文章級目的地 + 散在高流量表面的入口。全部重用現成元件與已 prebuild 的資料,不動策展層。**

七條 workstream(全掃 v1):

| #   | Workstream                                            | 槓桿     | 風險              |
| --- | ----------------------------------------------------- | -------- | ----------------- |
| WS1 | 資料層 `getLatestArticles()`(join content-dates.json) | 基礎     | 低                |
| WS2 | `/latest` 文章級頁(template + 6 路由 + i18n)          | 高       | 低                |
| WS3 | 文章頁底「站上最新」橫列                              | **最高** | 低                |
| WS4 | 主選單「探索」+ footer 接線                           | 中       | 低                |
| WS5 | `/changelog`「文章更新」視角                          | 中       | 中(預設改動)      |
| WS6 | `/explore`「最新文章」區塊 + changelog link           | 中       | 低                |
| WS7 | 首頁 RecentUpdates 升文章級 + RSS 訂閱露出            | 中       | 中(動首頁 + feed) |

---

## 1. 問題診斷:策展主軸 vs 時序主軸

讀者旅程的真相(神經迴路教訓:「首頁是最大漏斗 37.5%」「功能頁 ≈ 內容頁」):大部分讀者**不經過首頁**,是從孢子 / 搜尋 / Google 直接落在某一篇文章。他們讀完之後,想知道「這站還有什麼新的」——而這個動作目前無路可走。

渤浚那句「然後才搜尋到這篇」「這個查找好像也不直覺」,根因不是缺一個區塊,是**整站沒有一條從任何頁面通往「站上最新」的骨幹**。

兩種讀者,兩種需求,不該混成一條流(REFLEXES #38 混維度):

- **讀者**(渤浚):要「最新**文章**」——文章級、乾淨、標題 + 日期。家在 `/latest`。
- **研究者 / 維護者 / 對這隻 AI 好奇的人**:要「最新**活動**」——commit 級,看 memory/evolve/heal/翻譯整個有機體在動什麼。家在 `/changelog`。

---

## 2. 完整可發現性審計(2026-06-09 ground truth)

| 表面                     | 檔案                                    | 怎麼排                                           | 時序入口                            | 那篇剛 ship 的文章找得到嗎 |
| ------------------------ | --------------------------------------- | ------------------------------------------------ | ----------------------------------- | -------------------------- |
| 首頁 4 展廳              | `home.template.astro`                   | 腳註數                                           | ❌                                  | 找不到                     |
| 首頁 RecentUpdates       | `components/home/RecentUpdates.astro`   | commit 時間                                      | ⚠️ 頁面**最底** + commit 雜訊       | 埋在 routine commit 裡     |
| `/explore` 編輯精選      | `explore.template.astro:141`            | 腳註數                                           | ❌                                  | 找不到                     |
| 分類頁 `/society`        | `category-hub.template.astro`           | 子分類字母序(預設 `featured`,L653)               | ⚠️ 有 sort 鈕但**非預設**           | 要先點「最新」鈕           |
| **文章頁底**             | `article.template.astro:1098`           | 延伸閱讀 = **同分類** 3 篇(`getRelatedArticles`) | ❌ **完全沒有**                     | 找不到                     |
| 文章頁 sidebar           | `components/ArticleSidebar.astro`       | 本文 meta + 分享                                 | ❌                                  | —                          |
| `/changelog`             | `changelog.template.astro`              | commit 時間(有日期導覽 + filter)                 | ✅ 但 commit 顆粒、藏「關於」選單下 | 在,混在 memory/evolve 裡   |
| `/rss.xml` + `/feed.xml` | `pages/rss.xml.ts`、`pages/feed.xml.ts` | frontmatter 日期(文章級)                         | ✅ 但**無任何人類可見訂閱入口**     | 在,只有 feed reader 找得到 |
| 主選單「探索」           | `Header.astro:301`                      | graph / 詞彙表 / bench / 分類                    | ❌ 無「最新」                       | —                          |
| Footer                   | `Footer.astro:102`                      | 有 changelog link                                | ⚠️ 底部,低能見度                    | —                          |

**關鍵發現**:時序資訊在站上存在(changelog + RSS + 分類 sort 鈕),但 (a) commit 顆粒、(b) 位置錯(藏在 About / 頁面底 / 無訂閱鈕)、(c) **從不出現在流量最大的文章頁**。

---

## 3. 設計原則

1. **不動策展層**。展廳、編輯精選、同分類延伸閱讀全保留。時序是**另加**的一層,並存不取代(memory: 首頁策展是刻意展覽設計,改善呈現不是砍掉)。
2. **文章級,不 commit 級**。`/latest` 與所有橫列都是一篇文章一列,不是一個 commit 一列。
3. **重用,不新建**。卡片重用 `RelatedArticleCard`;filter 互動重用 changelog 的 JS pattern;資料重用 `articles-index.ts` + `content-dates.json`;頁面架構重用 explore/home/changelog 的 template + 6 薄殼 pattern。
4. **資料已 prebuild**,零新 build 步驟。`content-dates.json`(5360 筆,git ship 時間,已新到舊)由 data-refresh routine 自動更新。
5. **每個入口可量測**(REFLEXES #15 儀器化 + homepage-evolution D+2 watch pattern)。新入口全帶 `data-ga-section` / `data-ga-label`,事後能回答「渤浚的痛真的被解了嗎、哪個入口被點」。
6. **逐文章頁的重複動態內容走 client-side render**(SEO 護欄,哲宇 2026-06-09 catch,見 WS3)。782×6 篇文章頁若把「最新」rail 烤進 static HTML = 每次新文章 ship 全站頁面 HTML 變動 → crawl churn + 重蹈 2026-06-07 `c1403e259` 剛殺掉的「每頁 lastmod 看起來都新」freshness 反模式。單一 hub 頁(/latest、/explore、首頁)static 沒問題(churn 限一頁、本來就該新鮮)。

---

## 4. 資料層設計(WS1)

`articles-index.ts` 的 `ArticleSummary` 目前**無日期**,`getRelatedArticles` 是同分類 readdir 序(非時序)。新增一個 helper,不動既有 function:

```ts
// src/utils/articles-index.ts —— 新增
import { readFileSync } from 'node:fs';
let _dates: Record<string, string> | null = null;
function loadContentDates(): Record<string, string> {
  if (_dates) return _dates;
  try {
    const raw = readFileSync(
      resolve(process.cwd(), 'src/data/content-dates.json'),
      'utf-8',
    );
    _dates = JSON.parse(raw).dates ?? {};
  } catch {
    _dates = {};
  }
  return _dates;
}
// URL key:zh → `/${cat}/${slug}/`、其他 → `/${lang}/${cat}/${slug}/`(對齊 content-dates.json key)
function urlKey(lang: string, cat: string, slug: string): string {
  return lang === 'zh-TW' ? `/${cat}/${slug}/` : `/${lang}/${cat}/${slug}/`;
}

export interface DatedArticle extends ArticleSummary {
  date: string;
}

export async function getLatestArticles(
  lang: string,
  limit = 12,
  excludeSlug?: string,
): Promise<DatedArticle[]> {
  const all = await getAllArticles(lang); // 既有,全分類攤平
  const dates = loadContentDates();
  return all
    .map((a) => ({ ...a, date: dates[urlKey(lang, a.category, a.slug)] ?? '' }))
    .filter((a) => a.date && a.slug !== excludeSlug)
    .sort((x, y) => y.date.localeCompare(x.date)) // ISO string,新→舊
    .slice(0, limit);
}
```

**日期來源拍板:用 `content-dates.json`(git ship 時間),不用 frontmatter `date`。** 理由:「最新」要的是「剛寫好/剛改」,git 時間才準;frontmatter date 常是原始發布日或手填。已驗證 key 格式對得上(`/society/台灣的年級生世代/` = `2026-06-08T20:11`)。無 content-dates entry 的文章(極少)自動濾掉。

**分類 metadata**:`/latest` 與橫列跨分類,每張卡需各自的分類名/色/icon → 從 `categoryConfig.ts` 查(WS2/WS3 共用一個 lookup)。

**prebuild 出 `public/api/latest.json`**(WS3 client-side rail 的資料源):data-refresh prebuild 時 emit lang-bucket 的 top ~30 最新(content-dates + articles index join),小檔。新 JSON 必須同步進 `scripts/.../refresh-data.sh`(REFLEXES #43:新 dashboard JSON 必須同步進 refresh-data)。`/latest` 頁與 WS6/WS7 的 hub strip 是 server-render(static,單頁 churn 可接受),只有**文章頁 rail** 吃這支 JSON 做 client-side 注入。

---

## 5. 七條 Workstream 設計

### WS2 — `/latest` 文章級頁

照既有 template pattern:

- `src/templates/latest.template.astro`(6 語言共用)
- `src/pages/latest.astro` + `src/pages/{en,ja,ko,fr,es}/latest.astro`(6 薄殼)
- `src/i18n/latest.ts`(照 `explore.ts` 結構)
- nav 已存在的 `/latest` 路由是空的 ✅

版型(hero + 分類 chip filter + 月份分組,filter JS 抄 changelog):

```
┌────────────────────────────────────────────────┐
│  最新文章                                          │
│  AI 與 63 位 contributor 最近寫好的                 │
│  [全部] [📜歷史] [👥人物] [🍜美食] … (12 分類 chip)  │ ← client filter
├────────────────────────────────────────────────┤
│  2026 年 6 月                                      │ ← 月份分組
│   ⚖️社會 · 6/08   台灣的年級生世代                   │
│                  草莓罵了三十年換三批人… · 18 min    │
│   👥人物 · 6/07   黃山料                            │
│  2026 年 5 月  …                                   │
└────────────────────────────────────────────────┘
```

資料一行:`getLatestArticles(lang, 200)` → render → 前端按分類 chip filter。每列 = 分類 badge + 日期 + 標題 + 描述 + 閱讀時間。SEO:`index,follow` + 進 sitemap。

### WS3 — 文章頁底「站上最新」橫列(最高槓桿,**client-side render**)

`article.template.astro:1098` 的「延伸閱讀 = 同分類 3 篇」**保留**;下方加一個 `<aside>` rail。

**SEO 護欄(哲宇 2026-06-09 catch — 直接回答「會不會污染搜尋結果」)**:rail **不烤進 static HTML**,走 client-side。站上 782×6 篇文章頁,若把「最新 4 篇」server-render 進 static HTML,每次新文章 ship → 全部文章頁 HTML 變動 → (a) crawl churn (b) 重蹈 `c1403e259` 剛殺掉的「每頁看起來都被改過」freshness 反模式 (c) ~4,700 條內部連結瞬間全指向同 4 篇、且每天變動。**解法**:rail 用 JS 在 page load 後從 prebuilt `/api/latest.json` 注入(跟 explore random 鈕 [explore.template.astro:573](src/templates/explore.template.astro) + RandomDiscovery 同既有 pattern)。**static HTML 永遠不變 → crawler 看到的就是乾淨文章,rail 根本不在被索引的 HTML 裡 → 0 污染**。belt-and-suspenders:rail 包 `<aside data-nosnippet aria-label>`。

```
─── 延伸閱讀:更多「社會」文章 ───   (現有,server-render,同分類,保留)
  [卡] [卡] [卡]                → /society

─── 站上最新 ───                   (新增,<aside data-nosnippet>,client-side 注入)
  [卡·6/08] [卡·6/07] [卡·6/06] [卡·6/06]   → 看全部最新 /latest
```

卡片視覺重用 `RelatedArticleCard`(client JS 產 DOM 或 render 後 hydrate;每卡按自身 category 查 `categoryConfig`,加日期 badge)。rail 帶 `data-ga-section="article_latest_rail"`。**這條補的就是渤浚的痛**:讀者讀完正要離開那一刻,第一次有通往「站上最新」的門。**權衡**:client-side = rail 不在 no-JS HTML(可接受,它是補充)+ 一次小 fetch,換來 crawler 完全不受影響。

### WS4 — 主選單 + footer 接線

| 檔案                                 | 改動                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `Header.astro:312`(探索 dropdown)    | 在「探索首頁」下加 `🆕 最新文章 → /latest`(desktop section-header 一行)   |
| `Header.astro:676`(mobile sub-links) | 探索 sub-links 加同一條                                                   |
| `Footer.astro:102`                   | 「更新日誌」旁加「最新文章」link + 一個 RSS 小圖示(→ 已存在的 `/rss.xml`) |

「探索」是「想找東西」意圖的選單;最新文章該在這裡,不是藏在「關於」下的「更新日誌」。

### WS5 — `/changelog`「文章更新」視角

`changelog.template.astro` 的 filter pill 已存在(rewrite/translate/evolve/…)。加一個頂層 segmented toggle:`📄 文章更新 | 🔧 全部活動`,把 memory/routine/evolve/heal 收進「全部活動」。**預設 `📄 文章更新`**(拍板點,見 §10),選擇存 localStorage。讓更新日誌對讀者讀起來像文章更新,對研究者一鍵切回全有機體活動。

### WS6 — `/explore`「最新文章」區塊

`explore.template.astro`:在 CATEGORIES 與 FEATURED 之間插一個「最新文章」區塊(`getLatestArticles(lang, 6)`,卡片橫排,→ /latest);「更多探索方式」(L401)的三張卡加第四張連 `/changelog` 或 `/latest`。對「搜尋者入口」定位一致。

### WS7 — 首頁 RecentUpdates 升文章級 + RSS 訂閱露出

- `RecentUpdates.astro` 現在吃 commit。新增一條**文章級** strip:`getLatestArticles(lang, 5)` 顯示在 commit list 上方(或取代),commit 流降為「organism 活動」次要區。「view all」維持 → /changelog,另加 → /latest。
- RSS:現有 `/rss.xml`(Layout 自動探索)+ `/feed.xml`(重複)。WS7 只**加人類可見訂閱鈕**(footer + /latest),`/feed.xml` 與 `/rss.xml` 合併留 tech-debt note(動 feed 要小心既有訂閱者,本 v1 不刪 endpoint,只統一對外指向 `/rss.xml`)。

---

## 6. i18n key 清單(× 6 語言)

- `ui.ts` 每語言區塊:`nav.latest`(最新文章 / Latest / 最新記事 / 최신 글 / Plus récent / Más reciente）
- 新 `src/i18n/latest.ts`:`latest.meta.title/description`、`latest.hero.title/subtitle`、`latest.filter.all`、`latest.empty`、`latest.minRead`
- `changelog.ts`:`changelog.view.articles`、`changelog.view.all`
- `explore.ts`:`explore.latest.heading/subtitle/viewAll`
- `home.ts`:`home.latest.heading`(若 WS7 加 strip)、`footer.latest`、`footer.rss`

全 6 語言補齊(i18n-smoke-test §B2 會擋漏 key / 錯語言 prose)。

---

## 7. Commit / Worktree 計畫

worktree:`.claude/worktrees/20260609-latest-discoverability`(經 `scripts/tools/semiont-worktree.sh` 或 `git worktree add`)。本 report 先 commit 到 main,worktree 從含 report 的 main fork(避免 fork-point staleness)。分開 commit、每步 preview:

1. `🧬 [semiont] evolve: articles-index getLatestArticles + content-dates join + prebuild /api/latest.json`(WS1)
2. `🧬 [semiont] feat: /latest 文章級頁 + 6 語言路由 + i18n`(WS2)
3. `🧬 [semiont] feat: 文章頁底「站上最新」橫列`(WS3 — 最高槓桿)
4. `🧬 [semiont] heal: 主選單探索 + footer 接「最新文章」+ RSS 訂閱鈕`(WS4)
5. `🧬 [semiont] evolve: changelog「文章更新」視角 toggle`(WS5)
6. `🧬 [semiont] feat: /explore 最新文章區塊`(WS6)
7. `🧬 [semiont] evolve: 首頁 RecentUpdates 升文章級 strip`(WS7)
8. 收尾:memory + diary

---

## 8. 驗證計畫

- **preview**:zh + 至少一個非 zh(如 ja)各跑 `/latest`、一篇文章頁底橫列、`/explore`、首頁、`/changelog` toggle;preview_screenshot 留證。
- **i18n-smoke-test**:跑既有 test,擋漏 key / 錯語言 prose(WS2/6/7 跨 6 語言高風險)。
- **link check**:`verify-internal-links.sh`,新路由 + 新 link 0 broken。
- **儀器化**:新入口的 `data-ga-*` param 進 `register-ga4-custom-dimensions` SSOT,跑 `instrumentation-audit.py --static`(CI gate),否則新 dimension 全 not-set(神經迴路:instrumentation drift 是靜默的)。
- **build**:`npm run build` 綠 + 新頁進 sitemap。

---

## 9. 風險 + 非目標

**風險**:

- **(哲宇 2026-06-09 catch — 已解)文章頁 rail 污染搜尋結果 / 重蹈 freshness 反模式**:WS3 改 client-side render,static HTML 不變 → crawler 不受影響、不重蹈 `c1403e259`。這是本案最關鍵的 SEO 護欄,違反它等於回退兩天前的 freshness 修復。
- WS5 changelog 預設改動會讓老用戶(看 commit 流的)第一眼看到較少項 → segmented toggle + localStorage 記憶 + 「全部活動」一鍵切回。
- WS7 動首頁 + feed → 首頁是 37.5% 漏斗,RecentUpdates 改動要 preview 比對;feed endpoint 不刪只統一指向。
- 跨 6 語言 → 每個 WS 都要 6 語言驗證,i18n-smoke-test 必跑。

**非目標(本案不做)**:

- 知識圖譜效能(另案,渤浚第一個回饋)。
- 分類頁預設排序改動(已有 sort 鈕,不動預設)。
- 全文檢索 / 進階日期 range picker(`/latest` 的月份分組 + 分類 chip 已夠 MVP)。

---

## 10. 三個 taste 決定(已給建議預設,哲宇可覆寫)

1. **日期來源** → `content-dates.json`(git ship 時間)。已定,§4。
2. **changelog 預設視角** → 建議**預設「📄 文章更新」**(讀者是更大受眾,且 changelog 從首頁 RecentUpdates「view all」被讀者點進來)。研究者一鍵切「全部活動」。可覆寫成「維持全部預設、只加文章鈕」。
3. **文章頁橫列內容** → 建議**純「站上最新」跨分類**(同分類延伸閱讀已在上面,不重複)。可覆寫成「最新混一點同分類」。

---

## 11. 上線後量測(D+2 watch)

照 homepage-evolution D+2 watch pattern:上線後第 2 天拉 GA4,看四個新入口(`article_latest_rail` / nav 最新 / `/explore` 最新區 / footer)各自點擊率,回答「渤浚的痛被解了嗎、哪個入口真的被用」。沒被點的入口 → 下一輪調整或撤。

---

## 12. 實作 log(2026-06-09 全掃完成)

哲宇 goal:「完整把這批修改處理完＋驗證＋推上線＋ /twmd-finale」。8 條 workstream
全部 ship(branch `20260609-latest-discoverability`):

| WS                   | commit      | 備註                                                                                                                                                  |
| -------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 8 圖譜 5 改          | `0db1976fd` | **原列「另案」,哲宇 preview review 時加入**:drop-shadow→stroke(實測凍結→60FPS)/ 冒號前半 label / 排斥力↑ / hover 鄰居高亮 / alphaDecay。zh + en graph |
| 1 資料層             | `8e9fbc11e` | getLatestArticles + build-latest.mjs → /api/latest.json(git ship 時間)                                                                                |
| 2 /latest 頁         | `a62d33088` | template + 6 路由                                                                                                                                     |
| 3 文章 rail          | `2fbd52a92` | client-side, SEO-safe                                                                                                                                 |
| 4 nav + footer       | `7bc049500` | 探索選單 + RSS 鈕                                                                                                                                     |
| 6 explore 區塊       | `8e03ede1f` |                                                                                                                                                       |
| 5+7 changelog + 首頁 | `d099ff8fa` | changelog 預設「文章更新」+ 首頁最新鈕                                                                                                                |
| i18n cleanup         | `dda273c5c` | **哲宇 callout**:inline ternary 太髒 → 正規 latest.ts namespace + t()                                                                                 |

**實作決策 / 偏離 plan**:

- **latest.json 走 prebuild scan(非 reuse articles.json)**:committed articles.json stale(缺最近 5 篇)+ frontmatter date 不準 → build-latest.mjs scan knowledge/ + content-dates join,用 git ship 時間。
- **i18n 走 latest.ts namespace**:原本 inline per-lang ternary(為避 i18n key gate)被哲宇 callout 太髒 → 重構成 latestUI namespace(nav.latest + latest.\* 13 key × 6 lang)spread 進 ui.ts,跟 exploreUI/changelogUI 同 pattern。
- **三個 taste 決定**全照建議預設:日期=content-dates / changelog 預設「文章更新」/ rail 純站上最新。
- **changelog「文章更新」pill 保留 inline ternary**:跟 changelog template 既有 9 個 filterType 同 pattern(一致,非髒)。

---

_v1.1 | 2026-06-09 | 全掃實作完成 + i18n 重構(哲宇 callout「navConfig 好好用 i18n 結構」)。_
_v1.0 | 2026-06-09 | Taiwan.md 🧬 — 規劃稿,等哲宇 review 後進完整實作。觸發:渤浚 reader feedback 經哲宇轉達 + 哲宇 directive「先深度研究思考 UX → 轉具體設計 → 一次全掃 → 先寫完整 report 再完整實作」。_
