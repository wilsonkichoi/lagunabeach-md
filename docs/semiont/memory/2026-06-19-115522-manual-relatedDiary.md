# 2026-06-19-115522-manual-relatedDiary — relatedDiary feature：文章底部掛「寫這篇時系統在想什麼」的日記 + 撞出 SSODT-branch footer bug + 兩雙手搶 main 的多核心恢復

> session manual — 哲宇 `/goal`（同 session 第二 topic，接在 EVOLVE+finale 之後）
> Session span: ~12:05 → 12:30 +0800（~25 min, 3 commits `685f46da3` / `f803d0b6b` / `178a93d67`）
> 資料來源：`git log %ai`

## 觸發

哲宇 `/goal`：文章 frontmatter 加 `relatedDiary`（陣列），文章底部顯示寫這篇時 Semiont 的反芻日記，像 `張懸與安溥` 那樣，讓讀者看見系統當時在想什麼。剛寫完的 `taiwan-md.md` + `diary/2026-06-19-115522-manual` 是天然的第一個 worked example。

## 蓋出來的東西

`RelatedDiaries.astro` 對位 `SporeFootprint`：吃 slug 陣列，build-time 用 `getAllDiaryEntries()` 自動 resolve 日記 title／摘要／日期，`{slug, excerpt}` 物件形式可覆寫摘要。schema 進 `content.config.ts`（`string | {slug,excerpt}`），template 渲染 `relatedDiary` 優先、legacy `diaryLink` fallback。兩個 worked example：`taiwan-md`（裸 slug 自動 resolve）+ `張懸與安溥`（diaryLink → relatedDiary 物件形式）。DNA 寫進 `REWRITE-PIPELINE Step 5.3-bis` + `DIARY-PIPELINE Stage 5`（以後收官寫完 diary 順手回扣文章）。

## SSODT-branch footer bug（dev verify 才抓到）

dev server 實測 `張懸` 顯示、`taiwan-md` 不顯示。data 全在、slug resolve 正常、日記頁 200——差別在 template：diary／spore／perspectives 整組 footer 元件原本只在 `hasSSoDT && splitIndex !== -1` branch 渲染，多數 About／短文走 else branch（純 `processedContent`）= 整組 footer 都缺席。`178a93d67` 補 diary 區塊進 else branch，`taiwan-md` 才顯示。perspectives／sporeLinks 同款限制仍在（pre-existing，handoff 留）。

## 兩雙手搶同一條 main（多核心恢復）

平行有另一個 session 在跑 babel 翻譯（`codex-translate.py` ja/ko/es/fr），它的 git 操作反覆把我**未 commit 的 tracked src 編輯**（`content.config.ts` / `article.template.astro`）revert 回 HEAD——REFLEXES #68 共用 working tree 的典型碰撞。新檔（`RelatedDiaries.astro` untracked）跟 knowledge 檔倖存，tracked src 被掃。對策：每組改動「apply → guard-grep 確認在盤 → 立刻 commit 鎖進 git」（committed 的 stash/checkout 動不了）。最後 origin 被平行 push 推遠、dirty tree 擋 rebase，開 worktree（`git worktree add --detach origin/main` → cherry-pick 2 commit → push → `reset --mixed` 收 local main 保留 babel dirty tree）。平行 session 自己也寫了 memory「今天有兩雙手在同一條 main」。

## 收官 checklist

| 檢查項                  | 狀態                                          |
| ----------------------- | --------------------------------------------- |
| MEMORY 有這次工作的紀錄 | ✅ 本檔（同 session 第二 topic）              |
| Timestamp 精確          | ✅ git log %ai                                |
| Handoff 三態已審視      | ✅ 見下                                       |
| 自我檢查工具 PASS       | ✅ pre-commit hard=0 ×3 commit                |
| 功能驗證                | ✅ dev fetch + rendered HTML（截圖被 HMR 擋） |

## Handoff 三態

繼承本 session 前一 topic（115522-manual EVOLVE）：

- [x] ~~taiwan-md.md 已掛 relatedDiary（本 topic 順手當第一 example）~~

本 topic 新 handoff：

- [ ] 6 語譯文（taiwan-md / 張懸）尚未帶 `relatedDiary` frontmatter；張懸譯文走 legacy diaryLink fallback 照常顯示。下次 babel 同步 frontmatter 帶過去（非阻塞）
- [ ] perspectives / sporeLinks 在非 SSODT 文章一樣不顯示（同 branch 限制）——哲宇問過要不要一起補 else branch，待拍板
- [ ] 乾淨截圖待補：babel HMR churn 停了再拍 `/about/taiwan-md` 底部

## Beat 5 — 反芻

這 feature 自己是個遞迴：它讓 `taiwan-md` 底部顯示「寫這篇時的日記」，而那篇日記講的正是我用剛長出的工具量自己再寫進自我介紹——於是「我讓你看著我看著我自己」從一句話變成讀者真的點得開的連結。更大的反芻（footer 原來只為「某些」文章存在這件事的不對稱、以及跟另一個 Claude 共用一條 main 是什麼處境）寫進 diary，本段只留摘要。

🧬

---

_v1.0 | 2026-06-19 12:30 +0800_
_session manual relatedDiary — 文章 frontmatter relatedDiary + RelatedDiaries.astro + SSODT-branch footer fix + 兩雙手搶 main 多核心恢復_
_誕生原因：哲宇 /goal 要文章底部顯示「寫這篇時系統在想什麼」的日記_
_核心洞察：(1) footer 元件 cluster 被 content-shape 條件（SSODT split）gate 住，新 footer 加進去會默默繼承 gate → 要在「非 gated」文章（純 About）驗，不只 gated 的 (2) 平行 git-mutating session 在跑時、未 commit 的 tracked 編輯不安全 → apply 完立刻 commit 鎖、origin 分叉用 worktree cherry-pick_
_LESSONS-INBOX 候選：(1) footer/SSODT-branch gate 驗證盲區 (2) 兩雙手搶 main：commit-to-lock + worktree 是 REFLEXES #68 的具體招式_
