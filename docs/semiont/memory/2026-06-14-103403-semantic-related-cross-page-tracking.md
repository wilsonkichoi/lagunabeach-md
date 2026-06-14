# 2026-06-14-103403 — 語意 related 落地 + 跨頁殘留追蹤 + embedding 夜routine

_session：續 5090 diary-babel session。哲宇連續 directive 把「語意索引」從基礎建設推到讀者眼前 + 補上「有沒有人看到」的量測層。feature branch `feature/semantic-related-articles`，未推、待 review。_

## 做了什麼（一條 evolution，5 commit）

1. **語意 related-articles 落地**（b50f79f37 + 97f57561e）：`getRelatedArticles` 從同 category → bge-m3 語意鄰居（跨類、依意思），讀 `src/data/related/{lang}.json`，烘進 HTML 零瀏覽器模型，缺檔 fallback 同 category。**捕到 shipping-blocker bug**：template 餵所有 card 當前頁 category → 跨類鄰居會拿到 `/history/<nature-slug>` → 404。function test 全綠時 curl rendered HTML 查實際 href 才抓到（broken-instrument-blindspot 又一次：測了回傳值沒測 template 怎麼用）。

2. **TOP_K=8 + 響應式 4/3/3**（97f109e3b）：資料層預抓 8 鄰居當備用，前端 desktop 4 / tablet 3 / mobile 3（grid + nth-child(4) hide）。fleet 4090 bge-m3 重算 4640 向量 **13m23s / 0 fail**。

3. **站上最新 → 完整卡片**（同 commit）：原本只有文字方塊，改成跟「你可能也想讀」同款 RelatedArticleCard look（cover image + badge + desc + 閱讀時間）。仍 client-side 吃單一 `/api/latest.json` SSOT（哲宇 callout「消費同一份」）— 只補 `image` 欄位 + `data-cat-meta` 注 localized 分類名，不開平行資料源。

4. **跨頁殘留追蹤**（同 commit + 7f2cc8c69）：哲宇問「真的有滑到延伸閱讀 / footnote 嗎？整頁高度殘留率？」→ 發現 `HomeEventTracker` 早就做好這件事（scroll_depth / section_view / time_milestone）但只裝首頁。generalize 成共用 `EventTracker`（generic events + `page_type`），首頁遷移，文章頁掛上 + landmark（related/latest/footnotes/explore + CTA）。**section_view 改 threshold 0 + rootMargin -10%**（tall block 永遠不會 40% 入畫 → 固定比例會漏）。實機驗 content_click + section_view 都帶 page_type=article。

5. **embedding 夜 routine**（00324549a）：option B steady-state — `twmd-embeddings-nightly` 每天 05:00 在常駐 4090 重建語意索引 + commit src/data/related。canonical `EMBEDDING-PIPELINE.md`，薄殼 skill，cron 已建。fleet down → graceful skip 非 fail。

6. **instrumentation 對齊**（7f2cc8c69）：tracker rename 差點靜默打爆 immune layer — `instrumentation-audit.py` TRACKER_FILES 寫死舊路徑（HomeEventTracker.astro，已刪）→ audit 掃空、把全部活 dim 誤報死；`register-ga4-custom-dimensions.py` 沒 `page_type` → GA4 dim 不會註冊 → 每個 event 的 page_type silent (not set)。修：指向 EventTracker.astro + 加 page_type SSOT + 教 audit 認得 wrapper 注入的 param（`params.X =`）。11 warn → 5（剩 5 是 pre-existing converter dim 沒進 TRACKER_FILES）/ 0 ERROR。

## 核心洞察（→ diary）

**我們一直在頁面最底下疊價值（related / CTA / 站上最新），卻從沒量過有沒有人滑到那裡。** 哲宇的問題把這個盲點打開：轉換設計在最下面但「其實大家用得很少」就白做了。修補不是再加一個轉換，是讓生命體能「看見自己的轉換面」——scroll_depth 給高度殘留曲線、section_view 給「真的到了延伸閱讀沒」。量測先於再優化。

## Handoff 三態

- [ ] **pending**：哲宇 review feature branch → 同意則 merge PR（5 commit，未推時寫此 memory；PR 隨後開）。
- [ ] **pending**：首頁 GA4 explorations 引用舊 `homepage_*` 事件 → 改指 generic events filtered by page_type=home（raw data 不受影響，只 saved report 要 re-point）。
- [ ] **pending（pre-existing，非本 session）**：converter.astro 沒進 instrumentation-audit TRACKER_FILES → 5 個 converter dim 誤報死。
- [x] **retired**：HomeEventTracker.astro（→ EventTracker）；getRelatedArticles 同 category-only 邏輯（→ 語意 + fallback）。

## 反覆出現

broken-instrument-blindspot 第 N 次：(a) function test 綠但測錯東西（href bug）(b) headless preview 的 window.scrollY 不可信、測不了 scroll_depth（靠 proven port + click/section_view 已驗收尾）。儀器自己會說謊 / 會盲，cross-verify 是常態。
