# article.template.astro 深度勘查與 refactor — 2026-06-13

> session `2026-06-13-002414-refactor-article`（哲宇 directive：深度研究並 refactor article.astro，
> 解決編譯時間 + 檔案超長，檢查其他主頁面同類情況，研究長期解法並實作）
>
> 相關前案：[build-pipeline-audit-findings-2026-06-10.md](build-pipeline-audit-findings-2026-06-10.md)（CI 1099s 拆帳 + 熱點 #1-#8）

---

## TL;DR

1. **編譯時間的主因找到了，而且不是「component tree 太重」**：`article.template.astro` 把 git info cache（`_gitCaches` Map）放在 frontmatter。Astro 的 frontmatter 是 **per-render scope**——每頁重跑。結果是每一篇文章頁 render 都重新 `execSync(git log --full-history)` 掃整個 knowledge 樹一次。本機一次 326ms × 4,895 article 頁 = build 時間的本體。6/10 audit 量到「文章頁 554ms vs raw 頁 46ms，相差 ~508ms 未拆帳」——508ms 裡九成是這一條 git 子程序。
2. **修法是把 memoization 移進 module scope**（`src/utils/contributors.ts` 內按 `knowledgePath` memo）。Astro 的 module scope 整個 build 進程共享，git log 從 4,895 次降到 6 次（每語言一次）。
3. **檔案超長的主因是 17 個 tw-\* 視覺模組的 renderer（~775 行）+ markdown pipeline（~130 行）長在 template frontmatter 裡**。抽到 `src/utils/article-render.ts`（sed 行段 1:1 搬運，輸出 byte-identical），template 2,241 → 1,326 行（-41%），剩下的部分是 props/orchestration（~200）+ markup（~720）+ client script（~75）+ scoped style（~315）——單一職責的 view 檔。
4. **量測**：見 §5（baseline vs after 同機同內容 A/B + probe 計數 + HTML parity diff）。
5. **其他主頁面**：同 class 的 per-render 病灶**只有 article template 一處**（SEO.astro readFileSync 已在 6/10 修；lang-switch / staticRoutes / articles-index 都已 module cache，逐一讀碼確認）。「檔案超長」則是另外 6 個 template 的共病（dashboard 5,329 行為首），但它們都是單頁 × 1-6 語言，沒有 build 乘數，分級列在 §6。

---

## 1. 兩個病灶的解剖

### 1.1 編譯時間：per-render scope 裡的 git 子程序

`article.template.astro`（refactor 前）第 122-133 行：

```ts
// ── Git helpers (per-lang cache so 6 wrappers don't collide) ─────────────
const _gitCaches = new Map<string, Map<string, GitInfo>>();
function getGitInfoForLang(lang: Lang, filePath: string): GitInfo {
  let cache = _gitCaches.get(lang);
  if (!cache) {
    cache = buildGitInfoCache(knowledgeBase); // ← execSync git log --full-history
    _gitCaches.set(lang, cache);
  }
  ...
}
```

註解寫著「per-lang cache」，**但這個 Map 活在 frontmatter**。Astro compiler 把
frontmatter 編譯成 component render function 的函式本體——每渲染一頁，`new Map()`
重新執行，cache 永遠是空的，`buildGitInfoCache`（內含
`execSync('git log --full-history -z --name-only ... -- knowledge/')`）每頁重跑。

更糟的是 `execSync` 是同步呼叫，**block 整個 event loop**——`build.concurrency: 8`
對它完全無效，所有頁面的 git 掃描是純序列化的。

**實證**（不是讀碼推論）：

- dev server 對同一篇文章 request 3 次 → `buildGitInfoCache` probe 印 3 次，全部來自
  `article.template.astro getGitInfoForLang`
- baseline `astro build` 全程 probe 計數：**見 §5 表**（≈ 文章頁數），caller 全部是
  template 的 render chunk（`dist/.prerender/chunks/article.template_*.mjs`）
- 單次 `git log --full-history -- knowledge/`：本機 326ms（repo 4,649 commits）

### 1.2 為什麼 6/10 audit 沒抓到

audit 結論寫「已排除的嫌犯（實測/讀碼確認都有 module-level cache）：articles-index、
**git info cache**、lang-switch registry…」。讀碼確認的對象是 **wrapper**
（`src/pages/[category]/[slug].astro`）的 module-level `let _gitCache`——那個確實是
module scope、確實只跑一次。但 template 裡還有第二份 cache，跟 wrapper 同名同功能、
**不同 scope**。兩份程式碼都「有 cache」，只有一份的 cache 真的活著。

教訓的形狀（進 LESSONS-INBOX）：**「有 cache」不是 binary 屬性，要連 scope 一起驗證**。
對 .astro 檔案，唯一可信的驗證是 runtime probe（counter / console），不是讀碼。
這也呼應 REFLEXES #24「工具在說謊的三種形式」——這次是「註解在說謊」。

### 1.3 檔案超長：logic 長在 view 裡

refactor 前 2,241 行的分佈：

| 段落                                            | 行數     | 性質                              |
| ----------------------------------------------- | -------- | --------------------------------- |
| frontmatter：props / SEO 日期 / git / related   | ~190     | per-article orchestration（合理） |
| frontmatter：`renderTwModule` 17 個 tw-\* 模組  | **~775** | 純函式 data-transform             |
| frontmatter：marked renderer / 腳註 / split     | ~165     | 純函式 data-transform             |
| markup（Layout + hero + 三欄 + related + rail） | ~720     | view（合理）                      |
| client `<script>` ×3                            | ~75      | view（合理）                      |
| scoped `<style define:vars>`                    | ~315     | view（合理）                      |

940 行純函式跟 view 綁在同一個檔案的代價：(a) 每次改視覺模組都讓 2,241 行檔案更難進
context window（LLM maintainer 的實際工作成本）；(b) frontmatter 的函式/物件
allocation 每頁重複執行（小成本，但無謂）；(c) 純函式無法被單元測試。

---

## 2. 修法（本次已實作）

### 2.1 `src/utils/contributors.ts` — module-level memo

```ts
const _gitInfoCacheByPath = new Map<string, Map<string, GitInfo>>();
export function buildGitInfoCache(knowledgePath: string) {
  const memo = _gitInfoCacheByPath.get(knowledgePath);
  if (memo) return memo;
  ...（原邏輯不動）
  _gitInfoCacheByPath.set(knowledgePath, cache);
  return cache;
}
```

- 一個 build 進程內 git log 每 `knowledgePath` 只跑一次：`knowledge/` + 5 × `knowledge/{lang}/` = 6 次
- 7 個呼叫端（6 wrapper getStaticPaths + template per-render）全部受益，呼叫端零改動
- trade-off：dev server 存活期間 contributor 資訊不隨新 commit 更新（跟
  articles-index.ts 同款 trade-off，static build 無影響）

### 2.2 `src/utils/article-render.ts`（新檔，948 行）— logic 抽離

- `renderTwModule`（17 模組）/ marked renderer hooks / `processFootnotes` /
  `resolveWikilinks` 用 **sed 行段 1:1 verbatim 搬運**（不重打字，零 transcription 風險）
- 新增唯一的組合介面：`renderArticleHtml(title, content) → { fullHtml, splitIndex }`
- marked `renderer` 從「每頁 `new marked.Renderer()` + 重掛 hooks」變 module-level
  singleton（全部 hooks 無狀態，sync parse 無 re-entrancy 問題）
- template 端只剩 SSODT split 決策（`hasSSoDT` × `splitIndex`）——行為判斷留在 view，
  data-transform 進 module

### 2.3 template 瘦身結果

| 檔案                       | Before | After     |
| -------------------------- | ------ | --------- |
| article.template.astro     | 2,241  | **1,326** |
| utils/article-render.ts    | —      | +948      |
| utils/contributors.ts memo | 135    | +10       |

（淨 +43 行：module header 註解 + memo 註解——拿 43 行換掉 4,889 次 git 子程序，可以。）

刻意 **沒做** 的部分：

- markup 區塊（share row / latest rail / explore categories）**沒拆成 component**——
  單一消費者、拆了沒有 perf 收益（component boundary 反而增加 render 開銷與 whitespace
  diff 風險），且 per 哲宇 component-unification 邊界原則（≥3 新 prop = 不遷移）。
  1,326 行的 view 檔是單一職責，可讀。
- scoped `<style define:vars>` 沒外移——搬出去會改變 Astro scoping hash，破壞
  byte-parity 驗證，零收益。

---

## 3. 驗證閘門（兩個 build 的 A/B）

同機（Apple Silicon）、同內容（兩個 build 之間 knowledge/ 與 src/content/ 零變動、
git HEAD 不動）、同指令（`NODE_OPTIONS=--max-old-space-size=12288 npx astro build`，
跳過 prebuild/postbuild 讓 astro 階段乾淨計時）。

結果見 §5。驗證項目：

1. **wall time**（`time` real）
2. **probe 計數**（baseline 留 probe 計 git 掃描次數；after 已移除 probe = 0，
   memo 命中由 wall time + parity 證明）
3. **HTML parity**：`diff -r dist-baseline dist`（normalize 掉 Astro 每次 build 隨機的
   bundle hash 後，內容 diff 必須為空）
4. **postbuild smoke**：`node scripts/core/post-build-check.mjs` + 內鏈驗證

---

## 4. 其他主頁面同類診斷（哲宇問的「其他主頁面有沒有類似情況」）

### 4.1 Per-render 病（build 乘數 × frontmatter 昂貴操作）——逐一讀碼結果

| 檔案                                 | 頁面乘數        | 判定                                                                                  |
| ------------------------------------ | --------------- | ------------------------------------------------------------------------------------- |
| article.template.astro               | ×4,895          | 🔴 **本次修掉**（git execSync per render）                                            |
| Header.astro（1,811 行）             | ×8,400+（每頁） | ✅ frontmatter 全是 string 組裝；`getLangSwitchPath` / `staticRoutes` 已 module cache |
| Layout.astro（984 行）               | ×8,400+         | ✅ 純 props 推導                                                                      |
| SEO.astro（645 行）                  | ×8,400+         | ✅ readFileSync 已在 6/10 修成 import（audit 熱點 #5）                                |
| category-hub.template.astro（2,297） | ×84             | ✅ 只有 4 個 JSON read（Promise.all），無 git/exec                                    |
| raw md endpoints（×4 lang）          | ×3,171          | ✅ 46ms/頁，純 fs read                                                                |
| semiont/diary/[slug]                 | ×250            | ✅ thin wrapper + lib module                                                          |
| lifetree/[slug]（359 行）            | ×少數           | ✅                                                                                    |

**結論：同 class 的 per-render 昂貴操作只有 article template 一處。** 這符合結構直覺：
它是 5/03 從 6 個 wrapper 統一抽 template 時、把 wrapper 的 module-level cache pattern
複製進 frontmatter 的歷史產物（unification 本身是對的，scope 搬錯層）。

### 4.2 檔案超長病（無 build 乘數，維護成本問題）

| Template                     | 行數  | 頁面數    | 建議                                                                  |
| ---------------------------- | ----- | --------- | --------------------------------------------------------------------- |
| dashboard.template.astro     | 5,329 | 1         | P2：下次大改 dashboard 時抽 data-assembly 進 utils（同 §2.2 pattern） |
| about.template.astro         | 3,299 | ×2 lang   | P3：穩定頁，動機弱                                                    |
| data.template.astro          | 2,994 | 1         | P2.5：data 充電站持續長大中，抽 data loaders                          |
| map.template.astro           | 2,473 | 1         | P3                                                                    |
| contribute.template.astro    | 2,338 | ×2        | P3                                                                    |
| category-hub.template.astro  | 2,297 | ×84       | P2.5：唯一有乘數的，順手時抽                                          |
| Header.astro                 | 1,811 | component | P3：markup 重（nav SVG/dropdown），拆分是 UI 風險、無 perf 收益       |
| SemiontOrganismDiagram.astro | 1,809 | ×1        | P3                                                                    |
| terminology/converter.astro  | 1,236 | ×1        | P3                                                                    |

原則：**有乘數的先修（已修完），沒乘數的等該頁下次自然進化時順手抽**——不為拆而拆
（merge first, polish later 的反向應用：不需要的 polish 不做）。

---

## 5. 量測結果

同機 A/B（Apple Silicon / `npx astro build` 直跑，prebuild・postbuild 不計入 /
兩輪輸入內容凍結在同一個 git HEAD 狀態，方法見 §7）：

| 指標                       | Baseline（refactor 前）                   | After（refactor 後）             | 改善      |
| -------------------------- | ----------------------------------------- | -------------------------------- | --------- |
| **總 wall time**           | **9m49.4s**（589s）                       | **40.4s**                        | **14.6×** |
| astro 靜態生成階段         | 570.28s                                   | 21.07s                           | **27×**   |
| git log 子程序執行次數     | **4,697**（runtime probe 實數）           | 6（每 knowledgePath 一次）       | ÷783      |
| 文章頁 render（n=4,792）   | —（probe 污染 log，無法逐頁拆；554ms CI） | avg 18.5ms / p50 14ms / p95 26ms |           |
| build 進程 CPU（user+sys） | 477s + 124s                               | 32s + 14s                        | ÷13       |
| 生成頁數 / HTML 檔         | 8,437 / 5,268                             | 8,437 / 5,268                    | 不變 ✓    |

讀數的三個重點：

1. **probe 4,697 次**：4,758 篇文章頁 + 6 次 wrapper getStaticPaths − 約 67 篇
   politics 頁（template `categoryMapping` 沒列 politics → 該分類跳過 render-time
   git 查找、走 props fallback——pre-existing 行為，parity 驗證輸出不變；列入
   後續可順手補的小縫）
2. **execSync 是同步呼叫**：baseline 的 CPU（601s）≈ wall（589s），event loop 被
   git 子程序佔滿，`concurrency: 8` 形同虛設。修掉之後文章頁有效平行度回來了
   （88.7s 累計 render / 21s wall ≈ 4.2）
3. **CI 投影**：6/10 audit 的 CI astro 階段 931s 中，文章頁佔 2,701s 累計
   （554ms/頁）。修掉 git 子程序後本機文章頁 18.5ms；CI（x86 4 vCPU）預期
   astro 階段降到 ~150-350s 區間。**下一個 deploy 的 build log 會給實數**
   →（第二階段補記）實數出爐：astro 56.5s / Build step 125s，比預測更好，
   完整拆帳見 [refactor-verification-2026-06-13.md §3](refactor-verification-2026-06-13.md)。

---

## 6. 長期解法與策略

### 6.1 鐵律（這次的 class of bug 不再發生）

**「.astro frontmatter 是 per-render scope——任何 cache、昂貴初始化、跨頁共享狀態
必須住在被 import 的 .ts module。」**

- 已寫進 `article-render.ts` / `contributors.ts` / template 三處的程式註解（下一個
  在這些檔案工作的 session 第一眼看到）
- LESSONS-INBOX 候選 ×2（本報告 §1.2 的「cache 要連 scope 一起驗證」+ 這條鐵律），
  distill 後建議升 REFLEXES
- 驗證手段標準化：懷疑 per-render 重複 → **console probe + dev server 同頁 3 request**
  （本次用的方法，3 分鐘出證據，比讀碼可信）

### 6.2 量測儀器（讓下次退化自己浮上來）

- ~~6/10 audit 熱點 #6（build-perf 感測器壞掉）仍未修~~ **更正（同 session 第二階段讀碼證實）**：
  #6 已修——`extract-build-perf.mjs` 的 `grep -o` 修正 + 真 7d/30d 時間窗 + coverage_days +
  CI self-skip 都已落地（見 [refactor-verification-2026-06-13.md §4.1](refactor-verification-2026-06-13.md)）。
  初稿寫「未修」是憑 6/10 audit 快照推論、沒重讀現碼——「audit 結論也有保鮮期」
- 後續可加：`dashboard-build-perf.json` 加 `astro_ms_per_article_page` 維度（文章頁
  跟 raw 頁分開算，乘數頁的退化才不會被 raw 頁稀釋）

### 6.3 結構性天花板（頁數 +27/天的增長曲線）

修掉 git 子程序後，astro 階段回到「頁數 × 真實 render 成本」的線性曲線。下一階的選項
（按 effort 排序）：

1. **（零成本，已生效）** execSync 移除後 `build.concurrency: 8` 的有效平行度上升——
   event loop 不再被同步 git 呼叫 block
2. **（低）** raw md endpoints ×3,171 改 prebuild 直接 cp 檔案（46ms × 3,171 ≈ 146s
   CI 預算，但屬於 audit 範疇，另案）
3. **（中）** git info 全面 prebuild 化：把 contributors/lastModified/revisionCount
   併進 `build-content-dates.mjs` 的輸出 JSON（已有 pattern），template 讀 JSON、
   `contributors.ts` 退役為 prebuild script 的內部 util。好處：astro 階段完全零 git
   依賴、CI 可以 shallow clone（目前 `--full-history` 需要完整 clone）
4. **（大、另案）** Astro 官方增量 build 還在 roadmap 討論（[withastro/roadmap#237](https://github.com/withastro/roadmap/discussions/237)，
   已同意探索、未 ship；Astro 6 的 experimental route caching 是 SSR 取向，對
   GitHub Pages 靜態部署不適用）。在那之前，「增量」語意只能靠 mtime + OG cache 這類
   prebuild 層自建（audit 熱點 #1 修 mtime restore 是地基）

### 6.4 對「檔案超長」的長期姿勢

`article-render.ts` 立了 pattern：**view（.astro）跟 data-transform（.ts）分檔**。
§4.2 的 P2/P2.5 template 不主動大改，等各自下次功能進化時把 frontmatter 的
data-assembly 段抽到 `src/utils/`（或該 template 專屬的 `src/lib/`），每次一檔。
6 個月後回看，monster template 應該自然降到 view-only 規模。

---

## 7. Verification log

### 7.1 Runtime probe（假設證實）

1. `buildGitInfoCache` 進 `console.error` probe → dev server 對**同一篇**文章 request
   3 次 → probe 印 3 次，caller 全是 `article.template.astro getGitInfoForLang`
   （frontmatter cache 完全沒生效的直接證據）
2. baseline `astro build` 全程留 probe：4,697 次，caller 全是
   `dist/.prerender/chunks/article.template_*.mjs`（build mode 同病確認）

### 7.2 HTML parity（5,268 HTML 檔全比對）

**方法**：兩輪 build 之間發生 babel routine 並行寫入 knowledge/（57 檔，多核心
碰撞實例）→ 比對前先把 babel 未 commit 變更備份、`git checkout -- knowledge/`
還原到 baseline 輸入狀態（babel 最早寫入 00:38:55 晚於 baseline getStaticPaths
讀檔 ~00:36，HEAD 狀態 = baseline 輸入成立）、重跑 after build、再逐檔還原
babel 變更（57/57 exact restore 驗證 ✓）。

**Normalizer**：`/_astro/` asset hash 檔名 + astro scope id（`astro-XXXXXX` /
`data-astro-cid-*`）正規化後逐檔 `cmp`。normalizer 自帶 self-test（樣本檔輸出
< 100 bytes 即 fail）——第一版 sed 用 `|` 同時當 delimiter 和 alternation，錯誤
時輸出空檔造成 empty-vs-empty 假 PASS，被抓掉重跑（工具在說謊 self-instance，
詳 §7.4）。

**結果**：`checked=5268, content-diff=1`。唯一 diff 是 `/semiont/index.html`——
baseline 缺 8 器官 vitals 區塊。根因是該 template build 時
`await fetch(new URL('/api/dashboard-organism.json', Astro.url)).catch(() => null)`
——**對自己的 API 走網路 fetch + 靜默空 fallback**，baseline build 期間機器被
git 子程序風暴打滿 → fetch fail → 區塊靜默消失。跟本次 refactor 無關（該頁不經
article-render / contributors / article template），且 baseline 那側才是壞的。
Latent bug 已開 spawn task（改讀本地 JSON，同 SEO.astro pattern）。

**文章頁本體：4,758 頁全數 byte-identical（normalized）。**

### 7.3 功能 spot-check + smoke

- `post-build-check.mjs`：✅ 5,268 頁，六語言 lang attribute 全過
- tw-\* 模組（視覺化模組型錄頁 8 處）/ 腳註（justfont 頁 42 處）/ SSODT spore
  footprint（台灣國樂頁）/ 貢獻者 sidebar（zh 8、en 8、politics props-fallback 7）
  全部存在 ✓
- prettier 3 檔 ✅ / probe 殘留 grep ✅ clean

### 7.4 過程中抓到的兩個 meta-bug（已寫 LESSONS-INBOX）

1. **6/10 audit 的「git info cache 已確認 module-level」結論驗證的是 wrapper 那份
   cache，不是 template 那份**——「有 cache」要連 scope 一起驗，.astro 一律 probe
2. **自己的 parity 工具第一版也在說謊**（sed delimiter 衝突 → 空輸出 → 假 PASS）
   ——驗證工具要自帶 self-test，這次 normalizer 加了樣本檔長度 guard 才可信

---

_作者：Taiwan.md 🧬（session 2026-06-13-002414-refactor-article）_
_方法：dev-server runtime probe → baseline build（probe 留存計數）→ module 抽離（sed 1:1）→ after build → parity diff_
