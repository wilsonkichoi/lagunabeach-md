# 語意 related-articles 落地報告 — RAG Phase 1 讀者端第一塊

_2026-06-14 | branch `feature/semantic-related-articles` (b50f79f37) | 未推送，待哲宇 review_

把 bge-m3 語意索引接到文章頁 footer 的「延伸閱讀」。從「同 category 取前三」升級成「依意思取跨類鄰居」，零瀏覽器模型——鄰居連結在 build 時就烘進 HTML。這是整套語意基礎建設裡最安全、最快讓讀者看到價值的一塊。

---

## 1. 改了什麼

| 檔案 | 改動 |
| --- | --- |
| `src/utils/articles-index.ts` | `getRelatedArticles` 改語意優先：讀 `src/data/related/{lang}.json` 取鄰居 slug → 用 memo 化的 `cat/slug → ArticleSummary` 查回完整摘要。索引缺檔或文章未入索引 → fallback 回原同-category 邏輯。回傳型別不變（`ArticleSummary[]`），呼叫端與 card component 零改動。 |
| `src/templates/article.template.astro` | **Bug fix**：card 改用「鄰居自己的 category」算 href + badge，不再用當前頁的 category（跨類鄰居否則會拿到 `/history/<nature-slug>` → 404）。 |
| `src/i18n/ui.ts` | `article.moreInCategory` → `article.relatedReads`（6 語）。文案改成 category-neutral（「你可能也想讀」），因為鄰居現在跨類，「同分類更多文章」已是錯的。 |
| `scripts/core/build-embeddings.mjs` | 多寫一份精簡 `src/data/related/`（只留鄰居 slug，~0.9MB）當 committed build-input，未來 fleet 重建時跟著同步。完整 `public/api/related/`（~5MB 含 title/url/score）維持 gitignored fleet 產出。 |

資料契約：`src/data/related/{lang}.json` = `{ "cat/slug": ["cat/s1", …5] }`。`cat/slug` 對齊知識庫實際 category + bare slug。

---

## 2. 渲染速度影響（實測，非宣稱）

微基準：對 zh-TW 全 796 篇各跑一次 `getRelatedArticles`（warm cache），對照舊同-category 邏輯同迴圈。

```
cold 首呼（一次性 JSON 讀 + flat-map build + lookup）: 1.0ms / lang
warm 每呼：
  新語意路徑 : 1.1µs/call
  舊 category : 1.6µs/call
  delta      : -0.4µs/call（新的反而快）
```

**結論：無負面影響，反而微幅變快。** 語意路徑每篇只做 ~3 次 map lookup；舊路徑要 filter 整個 category 陣列（50–200 篇）。唯一新增成本是每語一次性的 JSON 讀 + flat-map build（~1ms/lang，全站 6 語 ~6ms，build 期間攤提一次）。6950 頁的 build 完全感覺不到。

兩個 memo 化（`_semanticRelated` per-lang JSON、`_bySlug` per-lang flat index）沿用既有 `getArticlesIndex` 的 module-level cache 範式，跨整個 build 共享。

---

## 3. 怎麼跟 production 站整合

**資料已經在 main 上**（`514b7b64c` data-refresh routine 06:00 順手 sweep 進去的 commit，格式正確）。目前 production 已經 ship 了這份資料——但**舊 code 完全沒讀它**，所以是惰性的、無害的。

**合併這個 feature branch = 啟動既有資料。** 沒有額外部署步驟：

1. CF Pages build 跑 `astro build` → 每頁靜態生成時 `getRelatedArticles` 在 build 端讀 committed 的 `src/data/related/` → 語意鄰居烘進 HTML。
2. `src/data/related/` 是 git-tracked build-input（跟 `content-dates.json` 同類），CI 直接拿得到，**不需要 fleet/GPU**。
3. 萬一資料缺檔（fresh fork 沒跑過 fleet）→ graceful fallback 回同-category，站不會壞。

驗證：dev SSR 實機 render `/history/19世紀的樟腦戰爭/`，footer card href 正確跨類（`/nature/福爾摩沙鳥類學`、`/geography/金瓜石`），零 broken `/history/` 連結，標題顯示「你可能也想讀」。cross-lingual 也驗了：ja `19th-century-camphor-wars` 浮出同一組概念（苗栗縣/福爾摩沙鳥類學/金瓜石），證明 bge-m3 把六語映到同一意思空間。

---

## 4. 未來怎麼持續更新 + CI/CD 整合

**現況的關鍵事實**：`build-embeddings.mjs` 沒接進任何地方——不在 package.json、不在 routine、不在 prebuild。它是 fleet-only 獨立 script（要 bge-m3 GPU，CI 跑不了）。main 上那份資料是**手動 fleet 快照**被 routine 順手 sweep，不是自動產生的。所以目前**沒有自動 regen 機制**。

三條 steady-state 路線：

| 選項 | 機制 | 優 | 缺 |
| --- | --- | --- | --- |
| **A 手動快照（現況）** | 文章大改後在 fleet 機器手跑 `node scripts/core/build-embeddings.mjs` → commit `src/data/related/` | 零基建 | 手動、會 stale |
| **B fleet routine（建議 steady-state）** | 新 routine（週級）在常駐 4090（已有 bge-m3）跑 build-embeddings + commit slim 資料 | 自動、**主權保留**（embedding 在地算）、CI 零依賴 | 需 routine host 有 fleet access |
| **C CI e5-small** | 換 CI 可跑的 e5-small（ONNX, 384d, 見 rag-design-research）每次 deploy 重算 | 永遠新鮮、零 fleet 依賴 | 多語不如 bge-m3、**失去在地主權性質**、CI 要 CPU 算 |

**建議**：landing 先吃 A（已經能跑，fallback 兜底）。steady-state 走 **B**——一條 `twmd-embeddings` 週級 routine 在 4090 上重算 + commit，把「意思的座標在地端算」這個主權性質保住（呼應 `用念頭找到台灣` 日記第 13 段：主權延伸到「內容怎麼被檢索表示」這層）。C 只有在哪天完全砍掉 fleet 依賴才考慮，代價是把 embedding 外包出去、丟掉在地性。

**staleness 行為**（B 之前都適用）：新文章沒進索引 → 那篇 fallback 同-category（仍有 related）；既有文章的鄰居清單不含最新文章，直到下次重算。週級 routine 把 staleness 上限框在一週。讀者永遠有東西看，最差是「漏掉上週新增的鄰居」，不是壞頁。

---

## 5. 要留意的

1. **routine 會 sweep working tree**：data-refresh routine 的廣域 `git add` 已經把我沒 commit 的檔案掃進 main commit（src/data/related 就是這樣上去的）。**教訓**：未 review 的改動不能留在 main 的 working tree——這也是這次堅持先進 feature branch 的直接原因。
2. **資料目前在 main 但 code 在 feature branch**：production 現在 ship 惰性資料。若長期不合併 feature，這份 1MB 資料就是純佔位。要嘛合併啟動、要嘛之後若放棄就連資料一起撤。
3. **slim 資料是 derived-but-committed**：跟 `content-dates.json` 同模式（build-time import 需要）。可接受，但要記得它是 fleet 產出的快照，不是 SSOT；SSOT 是 `knowledge/` + bge-m3 模型。重算才是真相來源。
4. **跨類 href bug 是這次最重要的捕捉**：function 層測試「全綠」時，template 還在用當前頁 category 餵所有 card → 跨類鄰居全部 404。儀器化（curl rendered HTML 查實際 href）才抓到。對應 broken-instrument-blindspot pattern——function test 對、但測的是 ArticleSummary 內容，沒測 template 怎麼用它。
5. **TOP_K=5 但 footer 只顯示 3**：slim 留 5 個鄰居給未來彈性（footer limit=3）。若要顯示更多直接調 template 的 limit，不必重算資料。

---

## 6. Handoff

- [ ] **哲宇 review** → 同意則 push branch + 開 PR（目前未推）。
- [ ] steady-state 決策：建議建 `twmd-embeddings` 週級 fleet routine（選項 B）。決定後接進 ROUTINE.md。
- [ ] （可選）把 footer 「查看全部 {category}」CTA 重新想：現在 card 跨類了，底部仍連當前 category index，語意上略不連貫但可接受。
- [x] 渲染速度實測（無負面、微快）
- [x] 跨類 href bug fix + 實機驗證
- [x] cross-lingual 語意驗證（ja/zh-TW 同概念）

🧬

_作者：Taiwan.md | 觸發：哲宇要求接讀者端 related-articles 當語意索引第一個落地，並要求查渲染速度 / CI-CD 整合 / 風險 / 歸檔報告_
