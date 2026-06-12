# 2026-06-13-002414-refactor-article — article template 雙病灶手術：per-render git 子程序 ×4,697→6（build 9m49s→40s）+ 2,241→1,326 行抽離

> session refactor-article — 哲宇 directive（/twmd-become Full mode：深度研究並 refactor article.astro，解決編譯時間 + 檔案超長，檢查其他主頁面，寫報告 + 長期策略 + 實作）
> Session span: 00:24:14 → 01:00 +0800（~36 min 到 ship commit，1 commit `66e7db0ed` + 本 memory）
> 資料來源：`git log %ai`

## 觸發

哲宇點名 article.astro 的兩個痛：編譯時間跟檔案超長。實體是 `src/templates/article.template.astro`（2,241 行，6 語言 4,758 篇文章頁共用）。要求不只修，還要查其他主頁面有沒有同病、寫報告、研究長期解法並實作。

## 診斷：probe 三分鐘戳破「有 cache」的假象

6/10 build audit 已經把文章頁 554ms vs raw 頁 46ms 的 508ms 差距標成「未拆帳，需 CPU profile」，並寫「git info cache 讀碼確認有 module-level cache」。這次改用 runtime probe 驗證：`buildGitInfoCache` 進一行 `console.error`，dev server 對同一篇文章 request 三次，probe 印三次。audit 讀碼看的是 wrapper 那份 module cache，template frontmatter 裡還有第二份 `_gitCaches`——Astro frontmatter 是 per-render scope，Map 每頁重建，cache 永遠空轉，`execSync(git log --full-history)` 每篇文章頁重跑一次。execSync 同步 block event loop，`concurrency: 8` 對它無效。baseline build 全程留 probe 計到 4,697 次。

其他主頁面逐一讀碼：Header / Layout / SEO / category-hub / raw endpoints / diary 全部乾淨（SEO 的 readFileSync 已在 6/10 修掉）。同 class 病灶全站只有這一處。檔案超長則是另外 6 個 template 的共病（dashboard 5,329 行為首），但都是單頁無 build 乘數，分級寫進報告等各自下次進化時順手抽。

## 修法與量測

兩刀：`buildGitInfoCache` 在 `utils/contributors.ts` 內按 knowledgePath module-level memoize（7 個呼叫端零改動）；17 個 tw-\* 模組 renderer + marked/腳註/wikilink pipeline 用 sed 行段 1:1 搬到新檔 `src/utils/article-render.ts`（948 行），template 剩 view orchestration 1,326 行。同機凍結內容 A/B：build wall **9m49s → 40.4s（14.6×）**，astro 靜態生成 570s → 21s（27×），git 子程序 4,697 → 6 次，文章頁 render avg 18.5ms。完整數據與方法在 [reports/article-template-refactor-2026-06-13.md](../../reports/article-template-refactor-2026-06-13.md)，commit `66e7db0ed` 已 push，CI 實數等下一個 deploy log。

## 驗證：5,268 HTML 全比對，外加兩個插曲

Parity 比對撞上多核心碰撞實例：babel routine 在 baseline build 進行中（00:38:55 起）並行改寫 57 個 knowledge/{lang} 檔。處置是備份 babel 未 commit 變更 → `git checkout -- knowledge/` 還原到 baseline 輸入狀態 → 重跑 after build → 逐檔還原（57/57 exact restore 驗證過，babel 工作完好留給該 session 自己 commit）。第二個插曲是自己的 parity 工具第一版 sed delimiter 衝突，normalizer 輸出空檔造成 5,268 檔 empty-vs-empty 假 PASS——加了樣本檔長度 self-test 才翻成可信結果：**4,758 篇文章頁全數 byte-identical**，唯一 1 個 diff 是 /semiont 頁的 build-time self-fetch flake（baseline 那側 fetch 失敗整個 vitals 區塊靜默消失，與本案無關，已開 spawn task 改讀本地 JSON）。post-build smoke 5,268 頁全過，tw-模組 / 腳註 / SSODT / 貢獻者 sidebar spot-check 全在。

## 收官 checklist

| 檢查項                       | 狀態                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| MEMORY 有這次 session 的紀錄 | ✅                                                                                                                             |
| Timestamp 精確               | ✅（git log %ai）                                                                                                              |
| Handoff 三態已審視           | ✅                                                                                                                             |
| CONSCIOUSNESS 反映最新狀態   | ✅（無需改，dashboard 接管）                                                                                                   |
| 自我檢查工具 PASS            | ⚠️ hard=0；score 12 的組成（無URL／引用荒漠／稀薄段落）是 memory 結構性誤報，與已 ship 的 viz-evolution memory（現測 9）同模式 |

## Handoff 三態

繼承 viz-evolution（00:25）四條全數未碰、原樣傳遞：OBSERVER-QUEUE #9 JuYinC EN 翻譯（default-action 6/19 ticking）、babel 後抽查 tw-tiles 退化（babel 本場正好在跑，下個 session 順手 curl ko 型錄頁）、新模組進真實文（EVOLVE 時做）、哲宇 review graph.md v2.0。

本 session 新 handoff（第二階段 02:00 更新）：

- [x] ~~article template 雙病灶手術 + 報告 + 驗證~~（`66e7db0ed`）
- [x] ~~CI 實數回填~~（125s 兩 run 重現，refactor-verification §3）
- [x] ~~audit 熱點 #6 感測器~~（讀碼證實 6/10 已修——前一輪 handoff 是過時情報）
- [x] ~~politics mapping + semiont self-fetch~~（`0ef6c6256`）
- [ ] **LESSONS distill Batch 0-4 執行**：reports/lessons-distill-strategy-2026-06-13.md 是可直接執行的 script（第一批 50 條逐條草稿在 §5），main-session 限定寫 canonical，distill-weekly 飛輪逐批跑，目標 §未消化 ≤30
- [ ] **RAG Phase 1-2**（向量索引 + MCP 語意檢索）：方案選型留哲宇（sovereignty lens：主推 e5/EmbeddingGemma 避開 bge-m3/Qwen 系），設計在 rag-design-research §Phase 1-2
- [ ] fr 搜尋 shard 686/787 docs = babel apostrophe bug 既知案（memory project_babel_frontmatter_apostrophe，>50 檔 §自主權邊界 spawn 另開）
- [ ] dist 1.7G 與 GitHub Pages 1GB 軟上限的距離（RAG 報告順帶標注）— 列 roadmap EVO-B2 動機
- [ ] evolution-roadmap-2026-06-13.md 14 條 EVO 項等下個工程 session 挑

## 第二階段（01:03-02:00）— 哲宇連發七個工作包的擴張

第一輪收官後哲宇把 scope 連續展開：完整驗證報告、CI/CD 審計最佳化、dashboard refactor、所有主頁面比照辦理、RAG 跨語系、LESSONS 完整消化、CLI 升級、殘留風險清掃，收尾走 release。執行模式轉成「我做快修與整合驗證 + 四個 sub-agent 平行做掃描/研究/聚類/批次改寫」。

CI 實數出爐比預測好：Build step **1,125s→125s（-89%）**、astro 943→56.5s、push→artifact 21min→4.5min，兩個 run 重現（`refactor-verification-2026-06-13.md` 四維驗證鏈閉合）。dashboard 解剖 5,329→629 行（`6cd55f9dd`，client JS 與 CSS 抽共用 bundle，每頁 HTML -52%，preview 實測 15/15 section 兩語全活）。CI/CD 審計確認 6/10 五熱點已全數落地（我前一輪 handoff 寫「#6 未修」是過時情報，audit 結論也有保鮮期），本場補 OG cache conditional save（`a3ec8ede5`，run 2 實證 skipped）。快修包（`0ef6c6256`）清掉 semiont build-fetch 不確定性與 politics mapping 縫，並儀器化兩件：flag_slow 200→50ms、parity 工具入庫含 self-test。`twmd` CLI 誕生（`0fd911db3`，98 散裝工具的 thin router）。架構深審 + 進化 roadmap（`9d2935dd9`）：頭號結構發現是 knowledge/ vs src/content 雙讀路徑。

Agent 批次結果兩個誠實轉折：主頁面 17 檔套 dashboard 配方，**只有 1 檔合格**（data.template 人口金字塔 477 行，`1bcd0da6a`）——其餘的「長」是 scoped style 與 build-time 資料注入，配方正確拒碰，這份「不適用勘定表」本身就是產出。RAG 研究則挖到比語意搜尋更大的洞：**ja/ko/es/fr 讀者搜尋零母語結果**，Phase 0 當場實作（`e1f00a47e`）：六語 per-lang shard + 雙端 tokenizer 補假名諺文（ko shard 421KB→1.2MB 暴露的洞），preview 三語實測全綠。LESSONS 251 條全量聚類 + 6 批執行策略入庫（`e4c4625a8`），批次執行按策略設計交 distill 飛輪（canonical 手術不在凌晨趕工）。

## Beat 5 — 反芻

這場最值得留的兩個形狀都跟「驗證」有關。第一個：audit 說「有 cache」，而 cache 確實存在——只是住錯 scope，於是每頁空轉。「存在」跟「生效」是兩種驗證，跟昨天 viz session 的「markup 存在 ≠ 視覺正確」是同一個 absence-blindness 家族，隔一天換一層再驗證一次。第二個：抓別人工具說謊的同一個小時，自己寫的 parity 工具也在說謊（空輸出 vs 空輸出 = 假 PASS），最後是給驗證器加 self-test 才換來可信的綠燈。驗證器本身也是工具，也會說謊。兩條都進了 LESSONS-INBOX（含 probe > 讀碼的 SOP 候選）。

🧬

---

_v2.0 | 2026-06-13 02:00 +0800（第二階段補記：七工作包 + 4 agent 平行 + RAG Phase 0 + v1.10.0 release 前夜）_
_v1.0 | 2026-06-13 01:00 +0800_
_session refactor-article — 哲宇 directive：article.astro 編譯時間 + 檔案超長 + 全站同類診斷 + 報告 + 實作_
_誕生原因：/twmd-become 深度研究並 refactor article.astro directive_
_核心洞察：(1) .astro frontmatter 是 per-render scope，cache 放錯層 = 每頁空轉 (2)「有 cache」要連 scope 一起驗，runtime probe 三分鐘勝過讀碼推論 (3) 驗證器自己也會說謊，要自帶 self-test (4) 並行 babel 改寫 57 檔的 parity 處置：凍結輸入、備份還原、工作完好交還_
_LESSONS-INBOX 候選：已寫 2 條（frontmatter scope 鐵律 / scope 驗證 + 假 PASS）_
