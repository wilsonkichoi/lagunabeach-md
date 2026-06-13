# EVO-A4：git 資料 prebuild 化 — astro render 階段零 git 依賴

> session `2026-06-13-002414-refactor-article`（Opus 接手段，哲宇 directive：完整執行 handoff +
> 選最佳長期架構解 + 自我進化）。本報告記錄 roadmap EVO-A4 的設計、實作、驗證、收益歸因。
>
> 前置：[article-template-refactor-2026-06-13.md](article-template-refactor-2026-06-13.md)（Fable 的
> per-render-scope 修復，4,697 → 6）/ [architecture-deep-audit-2026-06-13.md](architecture-deep-audit-2026-06-13.md)（DUAL-1 雙讀路徑）

---

## TL;DR

本 session per-render-scope 教訓的**結構終局**：Fable 把 article git cache 從 4,697 次
execSync memo 到 6 次，本 commit（`faf72e580`）再從 **6 次降到 0 次**——git pass 整個移出
astro，搬進 prebuild（`scripts/core/build-git-info.mjs`，一次 git log 涵蓋全 6 語言）。
contributors.ts 的 `buildGitInfoCache` 改讀 `src/data/git-info.json`，**介面零變**，
article.template + 6 wrapper 不動。四關驗證全綠（含 CI 真環境）。

---

## 1. 為什麼這是「終局」

Fable 的修復（module-level memo）讓 git log 從每頁一次降到每語言一次（6 次）。但**那 6 次
git subprocess 仍然在 astro build 裡跑**——意味 astro render 階段依賴一份完整 git history。
這留下三個結構債：

1. **astro 階段帶最後一個 execSync**：render 不純，仍 shell out
2. **CI 被釘在 full clone**：`git log --full-history` 需要完整歷史，astro 階段一旦依賴它，
   就不能談 shallow clone
3. **contributors.ts 直讀 git = babel read-tear 面**：架構審計 DUAL-1 的一塊——babel routine
   並行寫 knowledge/ 時，astro 直讀 git 的結果跟投影層可能短暫不一致

把 git pass 移到 prebuild 一次解掉前兩個結構面，緩解第三個（render 不再即時讀 git）。

## 2. 實作

### 2.1 `scripts/core/build-git-info.mjs`（新，prebuild step）

- 移植 `resolveContributor` + profile 解析（從 contributors.ts——build-time-only 邏輯，
  prebuild 是正確歸屬，零 render-time 消費者）
- **一次** `git log --full-history -z --name-only --format="...%aN|%aE" -- knowledge/`
  涵蓋全 6 語言（原本 6 次分語言；實測一次 0.38s）
- 解析每個 `knowledge/**/*.md`：contributors（resolve + 去重 by login）/ lastModified
  （最新 commit date）/ commitHash / revisionCount
- 寫 `src/data/git-info.json`，key = repo-relative NFC path

**parity-critical invariant**：contributor 去重順序（newest-first push）+ lastModified =
最新 commit + revisionCount 語義，逐字複製舊 in-astro 邏輯，否則 4,758 篇 sidebar 會變。

### 2.2 `src/utils/contributors.ts`（改，介面零變）

`buildGitInfoCache(knowledgePath)` 從「跑 execSync」改成「讀 JSON + filter prefix」。
回傳 `Map<absPath, GitInfo>`，消費端用絕對路徑查——跟舊行為完全一致。prefix 語義精確對齊
舊 git pathspec（`'knowledge/'` → 全語言；`'knowledge/en/'` → en only）。

### 2.3 tracking 決策：gitignore + dynamic read + graceful fallback

| 選項                                 | 結論                                                                                                                    |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| tracked（如 content-dates.json）     | ❌ git-info.json 1.5MB **高頻變動**（每個碰 knowledge/ 的 commit 都改 revisionCount/hash），tracked 會撐爆 git 歷史     |
| **gitignore + dynamic readFileSync** | ✅ 零 git 膨脹；缺檔 → empty sidebar 不掛（非 static import 的 vite resolve error）；dev/build 鏈 prebuild:gitinfo 自產 |

對比 content-dates.json（387KB，cosmetic filter 讓它低頻變動）適合 tracked；git-info.json
高頻大檔適合 gitignore。**變動頻率是 tracked vs gitignore 的判準**。

## 3. 驗證（四關全綠）

| 關                   | 方法                                                   | 結果                                                    |
| -------------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| 1. parity            | git-log 版 vs JSON 版 build，5,274 HTML normalized cmp | **PASS**（contributor sidebar byte-identical）          |
| 2. graceful fallback | 移走 git-info.json build                               | **exit 0**，文章頁仍生成（sidebar 空）                  |
| 3. prebuild 重產     | `npm run prebuild:gitinfo`                             | 6,110 files，1 git pass                                 |
| 4. **CI 真環境**     | push → deploy run 27453983712                          | **success**，prebuild:gitinfo 在 run-p 鏈跑，Build 122s |

## 4. 收益歸因（誠實版）

| 維度          | 數字                              | 評註                                                           |
| ------------- | --------------------------------- | -------------------------------------------------------------- |
| astro 階段    | 38.7 → 37.3s（本機 -1.4s）        | **小**——Fable 已 memo 過 6 次，剩餘 git 成本本來就低。不要誇大 |
| git pass 次數 | 6 → 1（prebuild）；astro 內 6 → 0 | 架構純化的真實指標                                             |
| CI Build step | 125 → 122s                        | 持平（git pass 從 astro 移到 prebuild，net 略快）              |

**A4 真正的價值不在秒數**，在三個結構面：

1. **astro render 階段零 git**——最後一個 execSync 移除，render 是純函式
2. **消 babel read-tear**——contributors 不再即時讀 git，並行寫入面縮小（DUAL-1 一塊）
3. **方向性解鎖 shallow clone**——但**尚未真正解鎖**（見 §5 誠實 nuance）

## 5. shallow clone 的誠實 nuance（避免下個 session 誤判）

A4 讓 **astro render** 不依賴 git，但 **prebuild 仍依賴**：`build-git-info.mjs` +
`build-content-dates.mjs` + `restore-mtime.py` 三個 prebuild step 都跑 `git log --full-history`，
需要完整歷史。所以 **CI 現在還不能 shallow clone**（fetch-depth: 0 仍必要）。

A4 是「astro 階段零 git」的完成，不是「整個 CI 零 git」。真正解鎖 shallow clone 要等所有
git-log-dependent prebuild 都能用 committed 衍生資料或 incremental git——那是更大的 EVO
（roadmap 應新增 EVO-A5「prebuild git 用法收斂 → CI shallow clone」，依賴本 A4 + content-dates
的 tracked JSON pattern）。

## 6. 後續（roadmap 更新）

- **EVO-A5（新）**：三個 git-log prebuild step 收斂——把 build-git-info / content-dates /
  restore-mtime 合併成一次 git pass（現在各跑一次 `git log -- knowledge/`，重複掃描），
  並評估 incremental（只算 HEAD 變動的檔案）→ 為 shallow clone 鋪路
- 順手機會：build-git-info + build-content-dates 共用同一次 git log（兩者都掃 knowledge/，
  解析不同欄位），省一次全量掃描

---

_作者：Taiwan.md 🧬（Opus 接手段）· 方法：per-render lesson 推到結構終局 + 四關驗證（含 CI 真環境）_
