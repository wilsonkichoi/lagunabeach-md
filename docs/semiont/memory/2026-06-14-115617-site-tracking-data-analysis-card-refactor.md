# 2026-06-14-115617 — 上線語意索引後：全站埋點 + 一個月資料盤點 + 文章卡共用化

_續 103403（語意 related 落地）的同日長 session。哲宇連續 directive：merge PR → 全站 event tracker → 完整挖一個月 GA4+SC + pipeline 盲點 + 主軸方向 → 資源地圖 → 6 篇 P0 → 記孢子 → 文章卡 refactor（/goal）。全部上 main、已 push。16 commit。_

## 做了什麼

1. **PR #1148 merge 進 main**（b4143b2ec）：語意 related-articles + 跨頁追蹤 + embedding routine 全部上線。本地 main 有 cherry-pick 的 memory commit（6bedbc3d8），用 `--no-rebase` merge reconcile origin（59deb6dd2）再 push。

2. **EventTracker 全站化**（9d947ac78）：原本只裝 home + article，generalize 進 `Layout.astro` 一處 mount，`page_type` 從 props/URL derive（article 有 slug / category 有 category / else URL 首段 lang-strip）→ 22 個 template + 未來頁全 cover。home/article 移除冗餘 mount。實機驗 home/about/latest/dashboard/explore/category/article page_type 全對。

3. **一個月 GA4+SC 深度盤點 + pipeline 盲點**（46a3e5b64，report：reports/research/2026-06/data-state-analysis-2026-06-14.md）：**主軸＝CTR 是瓶頸**（390k 曝光 1.35% CTR vs 目標 3%；美國 108k 曝光 0.23%）。流量穩定（38.6k/28d，非衰退）。**結構發現：EVOLVE pipeline 自己 doc 寫要用 per-page bounce/exit/striking-distance/zero-result 選題，fetch 腳本根本沒抓** → 內容進化在用流量量級而非 CTR 訊號。**進化 fetch-ga4.py 補 per-page bounce（close B10）**，第一跑就抓到 /latest 97% bounce（死路）。**broken-instrument 自捕**：ga-query 預設按 metric 排序非日期，假造「-47% 衰退」，畫日序 sparkline 才破。

4. **ANATOMY §資源地圖**（794bfbfc7）：SSOT / 資料源（committed vs gitignored）/ 共用元件（**ArticleCard 是 canonical 文章卡，第 13 行明寫 expose :global 給 client innerHTML 重用**）/ utils 索引。誕生：站上最新 rail 我手刻 RelatedArticleCard 樣式，沒查到既有共用元件 → 重造輪子。哲宇 callout 建地圖。

5. **6 篇 P0 EVOLVE 進 ARTICLE-INBOX**（d0364fd8e）：報導者/台灣網路社群遷徙史/台灣流行音樂/造山者/沈伯洋/蔡英文（後兩政治高敏，事實鐵三角從嚴 + 中立）。

6. **記孢子 #136/#137**（3c9444926）：哲宇 6-13 第 83 天 meta 里程碑串文（80K views/4.4K likes viral；留言串作者公開 RAG+related PR #1148）。category=meta（無文章 identity 孢子）。

7. **文章卡共用化（/goal）**（c92a8fa69 + 17aea29dd）：進化 `ArticleCard` premium 成 canonical 樣式；站上最新 rail 改 **template-clone**（server-render 一份 <ArticleCard> 進 <template>，client clone+填 slot，不手刻不 :global）；你可能也想讀 grid 遷 ArticleCard；**退役 RelatedArticleCard**。哲宇 refine：`align-items:stretch` 修 hero 沒撐滿（flex-column 被 base flex-start 咬成左側條）+ desc clamp 2→4。驗 rail+related 都 393×220 同元件、前後視覺一致、/latest /map home 不受影響。

## 洞察（→ diary）

**我手上明明有一張資源地圖該查，卻先動手重造了輪子。** 站上最新 rail 我憑感覺手刻 RelatedArticleCard 樣式，沒先問「站上是不是已經有共用文章卡」——有，ArticleCard，而且元件註解白紙黑字寫了它就是為這種重用存在的。哲宇要的不是修這一塊，是要我建一張「動手前先查」的地圖。而真正的共用不是 :global 把 class 字串貼來貼去，是把真元件 clone 出來填——template-clone 才是 client 端重用元件的正解。

## Handoff 三態

- [ ] **pending**：map.template 是最後一個 :global innerHTML 消費者（sidebar 卡），未來改 template-clone 後 ArticleCard 可全 scope。
- [ ] **pending**：首頁 GA4 explorations 引用舊 homepage_* → 改指 generic events filtered page_type=home（raw 不受影響）。
- [ ] **pending（CTR 飛輪，data 分析給的方向）**：striking-distance（pos 5-15）查詢 title/snippet 工程 + converter 前端事件插管（月僅 47 次）+ 404/zero-result action loop。
- [ ] **pending**：6 篇 P0 rewrite 待 twmd-rewrite routine / 哲宇挑。
- [x] **retired**：RelatedArticleCard.astro（→ ArticleCard premium）；手刻 rail innerHTML（→ template-clone）。

## 反覆出現（LESSONS 候選）

- **git add 撞已 rm 的 pathspec → abort → 只 commit 部分 → main 中途壞**（第 2 次：HomeEventTracker + RelatedArticleCard）。含刪除的 commit 要 `git add -A` 或讓已 staged 的 deletion 自己 ride，別把 rm'd 檔列進 `git add`。
- **preview iframe scroll / fixed-positioning 不可信做視覺截圖**（offsetHeight 0 假警報；hide-ancestor 把祖先 display:none）→ 用 scrollIntoView + 正常 flow 量測。
- **base align-items:flex-start 會咬到 flex-column variant**（premium hero 變左側條）→ column variant 要 reset stretch。
- **template-clone = client 端重用 server 元件的 canonical pattern**（vs :global innerHTML 手刻）。
