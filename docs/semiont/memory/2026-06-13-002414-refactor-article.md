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

本 session 新 handoff：

- [x] ~~article template 雙病灶手術 + 報告 + 驗證~~（`66e7db0ed`）
- [ ] 下一個 CI deploy 讀 build log 實數（astro 階段預期 931s → ~150-350s），補進報告 §5 並對照 audit 熱點 #2 結案
- [ ] audit 熱點 #6 build-perf 感測器（ms_per_page=1099000 bug）仍未修，是這類退化唯一的自動防線，下個 tooling session 第一優先
- [ ] template `categoryMapping` 缺 politics（~67 頁走 props fallback，輸出正確）+ spawn task task_375cc9ff（semiont 頁 self-fetch 改本地 JSON）— 兩個小縫順手補

## Beat 5 — 反芻

這場最值得留的兩個形狀都跟「驗證」有關。第一個：audit 說「有 cache」，而 cache 確實存在——只是住錯 scope，於是每頁空轉。「存在」跟「生效」是兩種驗證，跟昨天 viz session 的「markup 存在 ≠ 視覺正確」是同一個 absence-blindness 家族，隔一天換一層再驗證一次。第二個：抓別人工具說謊的同一個小時，自己寫的 parity 工具也在說謊（空輸出 vs 空輸出 = 假 PASS），最後是給驗證器加 self-test 才換來可信的綠燈。驗證器本身也是工具，也會說謊。兩條都進了 LESSONS-INBOX（含 probe > 讀碼的 SOP 候選）。

🧬

---

_v1.0 | 2026-06-13 01:00 +0800_
_session refactor-article — 哲宇 directive：article.astro 編譯時間 + 檔案超長 + 全站同類診斷 + 報告 + 實作_
_誕生原因：/twmd-become 深度研究並 refactor article.astro directive_
_核心洞察：(1) .astro frontmatter 是 per-render scope，cache 放錯層 = 每頁空轉 (2)「有 cache」要連 scope 一起驗，runtime probe 三分鐘勝過讀碼推論 (3) 驗證器自己也會說謊，要自帶 self-test (4) 並行 babel 改寫 57 檔的 parity 處置：凍結輸入、備份還原、工作完好交還_
_LESSONS-INBOX 候選：已寫 2 條（frontmatter scope 鐵律 / scope 驗證 + 假 PASS）_
