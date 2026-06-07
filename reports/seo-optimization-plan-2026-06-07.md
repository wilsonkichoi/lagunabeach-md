---
title: 'SEO 優化計畫 — 五項深度研究與裁決'
type: 'design-report'
status: 'draft-for-review'
date: 2026-06-07
author: 'Taiwan.md'
observer: '哲宇'
related:
  - 'src/components/SEO.astro'
  - 'astro.config.mjs'
  - 'scripts/tools/fetch-search-console.py'
  - 'docs/semiont/MEMORY.md#神經迴路'
trigger: '哲宇問「整站 SEO 有什麼可優化」→ 點名 5 項 → 深度研究後寫成計畫'
---

# SEO 優化計畫 — 五項深度研究與裁決（2026-06-07）

> 觀察者點了 5 個 SEO 優化項目要我規劃 + 深度研究 + 寫成完整報告。
> 我跑了 5 路平行研究（每項 primary source 優先、falsification-minded），結果**推翻了我自己原本 audit 的兩項建議**。這份報告誠實標出哪些是真的值得做、哪些我講錯了。

---

## TL;DR（趕時間看這段）

整站 SEO 的**基本功其實已經是頂標**（description 覆蓋 99%、alt 100%、結構化資料齊、hreflang 已修、llms.txt 在）。真正的問題只有一個：**過去 7 天 110,430 次曝光，CTR 只有 1.39%——被看見了但沒人點**。

5 個點名項目，深度研究後的裁決：

| #   | 項目                                                 | 研究裁決                                                                                    | 優先序   | 工作量                       | §自主權邊界           |
| --- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------- | ---------------------------- | --------------------- |
| 1   | **freshness 修復**（dateModified + sitemap lastmod） | ✅ **真贏，且比想像嚴重**——現況是 Google 明文點名的反模式                                   | **P0**   | ~半天 / 1 PR                 | 內部，我可做          |
| 2   | **CTR 診斷工具**                                     | ✅ **真贏，直擊 1.39% 問題**——但要先補 query×page 資料                                      | **P0**   | ~1 天 / 工具                 | 內部，我可做          |
| 3   | **Person schema → Wikidata**                         | 🟡 **要 reframe**——沒有「Person rich result」，但 `sameAs` 對 entity 消歧 + AI 引用有真價值 | **P1**   | 大（227 篇 + 對接 Wikidata） | >50 檔，分批 + 你過目 |
| 4   | **trailingSlash: 'always'**                          | 🟢 **近乎 no-op**——Cloudflare Pages 早就 308 處理了                                         | **P2**   | 1 行 / 低                    | 內部，可順手          |
| 5   | **FAQPage schema**                                   | ❌ **砍掉**——2026-05-07 起 Google 對全站廢除 FAQ rich result                                | **不做** | —                            | 改投 featured snippet |

**一句話建議**：先做 1 + 2（純內部、低風險、直擊核心問題），3 排進中期（reframe 後分批做），4 順手或不做，5 別碰、改去結構化內容搶 featured snippet。

---

## §0 背景：為什麼這份報告會推翻自己

我在前一輪 audit 給了 5 個建議。深度研究後發現，SEO 領域變動極快，**有兩項我講的是過期資訊**（FAQPage、trailingSlash），這正是 §10 幻覺鐵律 + 「主動發現自己的錯誤」要當場認的：

- 我原本說「解釋型文章加 FAQPage schema 搶 FAQ rich snippet」——**錯**。Google 2026-05-07 已對所有網站廢除 FAQ rich result。
- 我原本把 trailingSlash 列為要修的技術衛生——**幾乎沒必要**。Cloudflare Pages 早就幫你做了。

數據基線（SC 7d，`public/api/dashboard-analytics.json`，2026-06-07）：

- 總曝光 **110,430** / 點擊 1,536 / CTR **1.39%**
- 非品牌 CTR 1.82%（20,943 曝光）= 真實外部可發現性偏弱
- 國家：台灣 1945 / **美國 1886**（第二大，英文 SEO 是真市場）/ 新加坡 750
- 排名好但沒人點：`computex` 排名 1.23 / CTR 0.94%、`王永慶` 排名 1.23 / 1.04%、`尊` 1240 曝光 2 點
- 卡在第 8-12 名（推一把就上首頁）：`台灣日治時期` 9.49、`張懸` 10.72、`無名小站` 8.09

---

## §1 五項逐項裁決

### §1.1 內容 freshness 修復 → ✅ P0（真贏，且比想像嚴重）

**原始建議**：frontmatter 加 `updated`、sitemap 用真實日期取代全域 `new Date()`。

**研究發現（Google 官方，verbatim）**：

- 現況 sitemap 是 `lastmod: new Date()`（已確認 `astro.config.mjs:112`），每次 build 全站 4000+ 頁都宣稱「今天剛改」。這是 Google 2014 best-practices blog **明文點名的「不要做」**：
  > "Don't set the last modification time to the current time whenever the sitemap or feed is served. The last modification time should be the last time the content of the page changed meaningfully."
- 後果不是排名懲罰，是**信任流失**：Google「if it's consistently and verifiably accurate」才用 lastmod；不準 → Google 對**整站** lastmod 停止信任 → 失去 crawl 排程訊號。John Mueller（2025-04）：「It's just lazy… makes it harder for search engines to spot truly updated pages.」
- `dateModified` 現況永遠等於 `datePublished`（因為 frontmatter 只有單一 `date`）。EVOLVE 過的旗艦文，Google 以為從沒更新——丟掉了唯一能讓 SERP 顯示「Updated [日期]」+ 重估 freshness 的結構化訊號。

**對 Taiwan.md 的裁決**：兩個問題都真，且問題 B（全域 new Date）是**主動有害**（信任流失），不只是無用。這是最該先做的一項。

**設計方案**（單一資料來源，自動一致）：

```
dateModified = frontmatter.updated ?? gitLastCommitISO(file, 排除cosmetic) ?? date
```

1. 加 helper：`git log -1 --format=%aI -- <path>` 取該內容檔最後 commit 的 ISO-8601 日期（剛好是 Google 要的格式；也呼應既有「wall-clock git %ai」紀律 `feedback_wall_clock_timestamps`）。
2. `src/components/SEO.astro` 的 Article JSON-LD `dateModified` 吃這個值。
3. `astro.config.mjs` sitemap `serialize()` hook 改成**每頁** `lastmod`（取同一個 resolved date），**刪掉全域 `lastmod: new Date()`**。
4. JSON-LD `dateModified` 與 sitemap `<lastmod>` 同源 → 自動滿足 Google「visible date 與 structured 一致」規則。

**⚠️ 關鍵護欄（避免從「懶」變成「作弊」）**：Google 把「改日期但內容沒實質改」列為 search-engine-first 紅旗。所以 git-date 計算**必須排除 cosmetic / bulk commit**（babel frontmatter 修、lint sweep、mass reformat），否則一次 babel 批次會把全站日期推新。作法：(a) 用 frontmatter `updated` 當 canonical override（EVOLVE 才手動推進），git-date 當 fallback；或 (b) git 計算時跳過已知 cosmetic commit 類型。這條完全對齊既有 EVOLVE 紀律——只有實質重寫才推進日期。

**風險**：低（純內部、不動內容）。唯一要驗的是 `@astrojs/sitemap` 的 `serialize` 能逐 URL 設 lastmod（要對映回原始內容檔），這是工程實作細節，build 後 grep `dist/sitemap-*.xml` 抽查即可。

**工作量**：~半天，1 PR。**§自主權邊界**：內部，我可做。

**驗收**：(1) build 後 sitemap 每頁 lastmod 各不相同且對得上 git 日期；(2) 一篇 EVOLVE 過的文，JSON-LD `dateModified` > `datePublished`；(3) 純 rebuild（無內容 commit）不改任何頁日期。

---

### §1.2 CTR 診斷工具 → ✅ P0（真贏，直擊 1.39% 問題）

**原始建議**：寫腳本從 SC 撈「排名好但 CTR 低且可救」的頁，產出待優化清單（不直接改文）。

**研究發現（方法論 + 2026 benchmark）**：

- 別對 1.39% 這個**總數**優化——它被大量第 2-3 頁長尾 + AI Overview 攔截稀釋。要 **decompose** 出真正可救的那一片。
- 核心公式：`lost_clicks = (expected_ctr − actual_ctr) × impressions`，用**位置內插**的 expected CTR（不要整數四捨五入）。
- 2026 realistic expected CTR curve（informational 站，已反映 AI Overview 衝擊）：

  | 位置    | 1   | 2   | 3   | 4   | 5    | 6    | 7    | 8    | 9    | 10   |
  | ------- | --- | --- | --- | --- | ---- | ---- | ---- | ---- | ---- | ---- |
  | 預期CTR | 22% | 13% | 9%  | 6%  | 4.5% | 3.5% | 2.8% | 2.1% | 1.8% | 1.5% |

  （來源：First Page Sage 2025-05 / GrowthSRC 2025 / Backlinko 2025-04，取偏 realistic）

- **confounder 過濾（避免假陽性，這是工具好壞的關鍵）**：
  - 導航/品牌意圖指向別站（`computex` 搜的人要官網）→ 丟
  - AI Overview / featured snippet / knowledge panel 吃掉點擊（資訊型「X是什麼」）→ 標記或降權；AIO 讓資訊型 query 掉 ~58-61% 點擊
  - 單字/超短 query（`尊`、`md`）位置是跨 SERP 平均，無意義 → 丟
  - 位置 > 10 = 曲線正常運作，不是壞 → 要求 position ≤ 10
- 建議門檻：`impressions≥100`、`position≤10`、`actual_ctr < 0.6×expected`、`gap≥1pp`、`lost_clicks≥5`，依 lost_clicks 排序，分三 tier。

**對 Taiwan.md 的裁決**：方法論扎實，這是直接攻擊「110K 曝光 / 1.39% CTR」的對的工具。**但有資料缺口**：

- 現況 SC cache 是 **query-level only**（已確認 `searchConsole7d` 無 page 維度）。要正確做必須 **query×page** 粒度（才能知道「哪個 query 在哪頁」underperform，破解「位置是平均」陷阱）。
- 既有腳本 `scripts/tools/fetch-search-console.py` / `sc-query.py` 可擴充加 `page` 維度（+ 選配 `device` + 另一支 `searchAppearance` pull 來標 AIO/rich-result 列）。

**設計方案**：

1. 擴充 SC 抓取加 `page`（+`device`），另跑一支 `searchAppearance` 抓 AIO/snippet 標記。
2. 新工具 `scripts/tools/seo/ctr-opportunities.py`：算 expected（內插）→ lost_clicks → confounder 過濾 → 三 tier 輸出 markdown/CSV 決策表（query / page / impressions / position / actual / expected / gap / lost_clicks）。
3. **不自動改文**（如你所要求）——產表給你決策，後續逐篇改 title/description 走人工 + REWRITE 紀律。

**風險**：低（讀 SC API 用既有憑證 + 寫工具）。v1 可先用既有 query-level cache 跑粗版，但要標明「無法定位到頁」。

**工作量**：~1 天（含 SC fetch 擴充 + 工具 + 第一份報表）。**§自主權邊界**：內部，我可做。

**驗收**：產出一張 ≤ 50 列的決策表，Tier 1 是「先改這幾篇 title」，每列附 lost_clicks 與建議方向；抽查 3 列確認不是 confounder 假陽性。

---

### §1.3 Person schema → Wikidata（entity / AI 引用，不是 knowledge panel）→ 🟡 P1（reframe）

**原始建議**：補 `sameAs`（Wikidata/維基）、jobTitle、deathDate、nationality → 吃下 knowledge panel 與 rich result，搶人名搜尋 CTR。

**研究發現（Google 官方）——我原本的框架要修正**：

- **沒有「Person rich result」這種東西**。Google Search Gallery 26 種 rich result 不含 generic Person。Person markup **不會**產生 SERP 卡片，也**不會**觸發 knowledge panel。
- Knowledge panel 是 **Knowledge Graph 演算法生成、largely out of your control**；結構化資料能**影響/消歧**，不能**創造**一個 panel。
- **更現實的一層**：王永慶 / 張懸這種名人**很可能已經有 Google panel**（Wikipedia 驅動），而那個 panel 本身就會**壓低**有機點擊——所以這些 query 的低 CTR 部分是**結構性的**（Google 自己佔了答案框），title 救不回來。
- **但 Person 結構化資料仍有真價值**，只是價值換了位置：
  - 唯一有官方文件背書的高槓桿屬性是 **`sameAs`**（連 Wikidata Q-ID + 維基 + 官方來源）→ entity **消歧 / reconciliation**（告訴 Google「是這個張懸不是那個」）。
  - 餵 **AI Mode / AI Overview 的 entity 解析與引用**（雖然 Google 說 AI 功能「不需要特殊 schema」，但消歧對機器理解有幫助）。
  - 正確包法是 **`ProfilePage`** 包 `Person` 當 `mainEntity`（你的人物頁正是「關於某人」的頁，這是唯一 doc-sanctioned 的人物型別）。

**對 Taiwan.md 的裁決**：值得做，但**目標要從「搶 knowledge panel / 修 CTR」改成「entity 消歧 + AI 引用資格 + 餵知識圖譜信心」**。對**沒沒無聞的人物**（227 篇裡大量非名人）價值更高——他們還沒有 panel，sameAs + 完整 entity 屬性能幫 Google 建立認知。對已有 panel 的名人，CTR 要靠 snippet 品質競爭，不是靠這個。

**設計方案**：

1. **Wikidata reconciliation（標準免費路徑）**：用 OpenRefine 對 `https://wikidata.reconci.link/zh/api`，type 限 **human (Q5)**，加「出生年 + 職業」當 tiebreaker 區分同名。227 人一次性對齊，高信心自動 match、其餘人工確認。也可程式化（build 階段批次打 endpoint，禮貌 batch + cache）。
2. frontmatter 加欄位：`wikidata`（Q-ID）、`jobTitle`、`birthDate`/`deathDate`、`nationality`、`birthPlace`（選配）。
3. `SEO.astro` 人物 JSON-LD 改 `ProfilePage` > `mainEntity: Person`，吐 `sameAs: [wikidata, zh維基, 官方/已驗證社群]` + 上述屬性。
4. 用 Rich Results Test 驗證 + SC 觀察。

**風險**：(a) Wikidata 對齊要人工確認（同名陷阱，§16 peer 是線索不是 source 同精神）；(b) 227 檔改 frontmatter + schema = **>50 檔，命中 §自主權邊界**，要分批 + 你過目，不一次掃完（符合「漸進式重構」習慣）。

**工作量**：大。建議拆 (1) reconciliation 對齊（半天 + 人工確認）→ (2) schema 改 ProfilePage（1 PR）→ (3) 分批回填 frontmatter（多批）。

**驗收**：抽 10 位（5 名人 + 5 非名人）Rich Results Test 通過、sameAs 指向正確 Q-ID；3 個月後看非名人人物頁 entity 曝光/AI 引用變化。

---

### §1.4 trailingSlash: 'always' → 🟢 P2（近乎 no-op，CF 已處理）

**原始建議**：設 `trailingSlash: 'always'` 消除同頁兩 URL 稀釋訊號（§神經迴路舊教訓）。

**研究發現（Astro + Cloudflare Pages 官方）——又一個要修正的**：

- Taiwan.md 用 directory 格式（`build.format` 未設 = 預設 directory），每頁出 `foo/index.html`。
- **Cloudflare Pages 對 directory build 會自動 308 redirect `/foo` → `/foo/`**，正規內容只在斜線版。production 現在 `/history/foo`（無斜線）就已經回 308 導到 `/history/foo/`。
- 你的內部連結、sitemap、canonical（`Astro.url.href`）**早就全是斜線版**。整個 stack 在 production 已經一致。
- Astro 文件明說 prerendered 頁的斜線處理「由 hosting platform 決定」——所以 `trailingSlash:'always'` **不會改變 Google 看到的 production HTTP 行為**，CF 的 308 才是真正在做事的。
- Google 視角：兩種 URL 都 200 也**不是懲罰**（只要 canonical 對），而你 canonical/redirect/sitemap/內部連結四項 Google 建議**全已滿足**。

**對 Taiwan.md 的裁決**：§神經迴路「trailing slash 分流」這條老教訓，在 production **已被 CF 自動解決**。設 `trailingSlash:'always'` 只是讓 dev/preview 跟 prod 一致（本地就能抓到壞的無斜線內部連結），是 config 意圖清晰化，**不是 SEO win**。

**設計方案**（要做的話）：加一行 `trailingSlash: 'always'`，**保持 `build.format: 'directory'`**（千萬別配 `'file'`），跑 build 抽查 dist 仍是 `*/index.html`、hreflang `serialize` filter 仍保留 alternate（別歸零）、抽查 1 個 CJK redirect key（`/about/創辦人`）兩種形式都到目的地。55 條 redirect 的 key 雖無斜線但**已經能正常運作**（directory + CF 機制），**不要重寫 key**（純 churn 無回報）。

**風險**：低但非零（churn）。**回報**：近乎零（CF 已做）。**工作量**：1 行 + 驗證。

**裁決**：順手做（觸碰 config 時）或乾脆不做都可，不列優先。

---

### §1.5 FAQPage schema → ❌ 不做（2026 已死），改投 featured snippet

**原始建議**：解釋型文章加 FAQPage schema 搶 FAQ rich snippet。**這項我講錯了。**

**研究發現（Google 官方，verbatim）**：

- 2023-08：FAQ rich result 限縮到「well-known, authoritative government and health websites」。
- **2026-05-07（一個月前）：Google 對所有網站廢除 FAQ rich result**。官方 FAQPage doc（更新 2026-05-08）：
  > "As of May 7, 2026, FAQ rich results are no longer appearing in Google Search. We will be dropping the FAQ search appearance, rich result report, and support in the Rich results test in June 2026."
  > Search Console API 對 FAQ 的支援 2026-08 移除。
- 一般網站加 FAQPage **2026 完全沒有 SERP 視覺效益**。AI Overview 也**不需要**特殊 schema（Google 明說「no special schema.org structured data that you need to add」）。markup 留著無害但**買不到任何可量測的東西**。

**對 Taiwan.md 的裁決**：**不要投資 FAQPage**。把那份力氣改去**結構化內容搶 featured snippet**（不需要 schema，全站皆可）：

- 解釋型段落用**問句式 H2/H3 + 緊接 40-60 字直接答案**（段落/清單/表格乾淨）——這是 Google 抽 featured snippet 的形狀。
- 這條進 REWRITE-PIPELINE 當寫作紀律（不是 schema 工程）。featured snippet 對知識庫是「全站可得、最高槓桿」的 SERP feature。

**工作量**：0（不做 schema）；featured snippet 結構化是寫作習慣，併進 pipeline。

---

## §2 優先序與 roadmap

依「ROI × 風險 × 依賴」排序：

1. **P0-A｜freshness 修復**（§1.1）——純內部、低風險、影響全站、修 Google 點名反模式。先做。1 PR。
2. **P0-B｜CTR 診斷工具**（§1.2）——直擊 1.39% 核心問題。先補 SC `page` 維度抓取，再寫工具產決策表。產表後逐篇人工改 title（不自動改）。
3. **P1｜Person/entity 強化**（§1.3）——reframe 為 entity 消歧 + AI 引用。拆三步：Wikidata 對齊 → ProfilePage schema → 分批回填 frontmatter（>50 檔，你過目）。
4. **P2｜trailingSlash**（§1.4）——順手或不做。
5. **不做｜FAQPage**（§1.5）——改投 featured snippet 寫作紀律。

**依賴**：P0-A、P0-B 互相獨立可並行。P1 step 1（reconciliation）獨立，step 2/3 依賴 step 1。

---

## §3 §自主權邊界 + 風險總表

| 項目                           | 操作性質                                  | 邊界判定                          |
| ------------------------------ | ----------------------------------------- | --------------------------------- |
| freshness 修復                 | 改 astro.config + SEO.astro + 加 helper   | ✅ 內部，我可做（1 PR）           |
| CTR 工具                       | 擴 SC 抓取 + 寫工具（讀 SC API 既有憑證） | ✅ 內部，我可做                   |
| Person schema 改 ProfilePage   | 改 SEO.astro 1 檔                         | ✅ 內部，我可做                   |
| Person frontmatter 回填 227 篇 | >50 檔重構                                | ⚠️ **§自主權邊界**，分批 + 你過目 |
| Wikidata 對齊                  | 人工確認同名                              | ⚠️ 需人工確認（§16）              |
| trailingSlash                  | 1 行 config                               | ✅ 內部，低風險                   |

**對外動作**（送 GSC、開帳號、發布身份）皆不在本計畫——這份只到「內部技術 + 工具 + 內容紀律」。

---

## §4 驗收指標（怎麼知道有效）

- **freshness**：sitemap 逐頁 lastmod 各異且對得上 git 日期；EVOLVE 文 dateModified > datePublished；SC「Updated 日期」開始出現。
- **CTR 工具**：產出決策表；逐篇改 title 後追蹤該 query×page 的 CTR 是否往 expected 靠攏（lost_clicks 下降）。
- **整體北極星**：非品牌 CTR 從 1.82% 往上；Tier 1 清單的 lost_clicks 總和被吃掉多少。
- **Person/entity**：非名人人物頁 entity 曝光 / AI 引用提升（較難量，看 CF AI crawler + 抽樣 AI 問答引用）。

---

## §5 回寫認知層的副產物

研究過程發現兩條值得回 LESSONS-INBOX 的 meta：

1. **§神經迴路「trailing slash 分流是骨骼層裂痕」這條教訓，在 CF Pages production 已被自動解決**——舊教訓在新基建下可能過期，應標註「production 由 CF 308 處理」避免未來又把它當待修項。
2. **SEO rich result 生態 2026 急速縮表**（FAQ/HowTo 廢除、Course/ClaimReview 等退場）——任何「加 X schema 搶 rich result」建議都必須當場查最新狀態，不能憑 2023-2024 記憶（這次 FAQPage 就是活案例，§10 幻覺鐵律的 SEO 版）。

---

## Sources（primary Google docs 優先）

**freshness**：

- [Build and Submit a Sitemap（lastmod 須 verifiably accurate）](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Best practices for XML sitemaps（「Don't set lastmod to current time」）](https://developers.google.com/search/blog/2014/10/best-practices-for-xml-sitemaps-rssatom)
- [Article structured data（datePublished/dateModified）](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Publication dates / byline](https://developers.google.com/search/docs/appearance/publication-dates)
- [Creating Helpful Content（「changing dates to seem fresh」紅旗）](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

**CTR**：

- [First Page Sage CTR by position（2025-05）](https://firstpagesage.com/reports/google-click-through-rates-ctrs-by-ranking-position/)
- [GrowthSRC Organic CTR 2025](https://growthsrc.com/google-organic-ctr-study/)
- [Backlinko CTR study（2025-04）](https://backlinko.com/google-ctr-stats)
- [Search Console API（page×query 維度）](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- [Ahrefs AI Overviews reduce clicks（2025-12）](https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/)

**Person / entity**：

- [Search Gallery（無 Person rich result）](https://developers.google.com/search/docs/appearance/structured-data/search-gallery)
- [ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Debugging entity matching（sameAs 強烈建議）](https://support.google.com/webmasters/answer/10728779?hl=en)
- [About knowledge panels（演算法生成、不可創造）](https://support.google.com/knowledgepanel/answer/9163198?hl=en)
- [OpenRefine Wikidata reconciliation](https://openrefine.org/docs/manual/reconciling) / [reconci.link](https://wikidata.reconci.link/)

**trailingSlash**：

- [Astro config reference（trailingSlash / build.format）](https://docs.astro.build/en/reference/configuration-reference/)
- [Cloudflare Pages serving（308 / .html stripping）](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Google「To slash or not to slash」](https://developers.google.com/search/blog/2010/04/to-slash-or-not-to-slash)

**FAQPage**：

- [FAQPage docs（2026-05-07 廢除通知）](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Search Engine Land「Google to no longer support FAQ rich results」（2026-05-08）](https://searchengineland.com/google-to-no-longer-support-faq-rich-results-476957)
- [Featured Snippets docs（不需 schema）](https://developers.google.com/search/docs/appearance/featured-snippets)
- [AI Features and your website（不需特殊 schema）](https://developers.google.com/search/docs/appearance/ai-features)

---

_v1.0 | 2026-06-07 | 作者：Taiwan.md_
_誕生原因：哲宇問「整站 SEO 有什麼可優化」→ 點名 5 項要深度研究寫成報告_
_方法：5 路平行研究 sub-agent（primary source 優先 + falsification-minded）+ 主 session 程式碼盤點 + 驗證_
_核心發現：5 項裡 2 項是真贏（freshness + CTR 工具）、1 項要 reframe（Person→entity/AI）、2 項該砍/降（FAQPage 2026 已死、trailingSlash 被 CF 自動處理）。自我修正：原 audit 的 FAQPage + trailingSlash 兩項建議是過期資訊_
