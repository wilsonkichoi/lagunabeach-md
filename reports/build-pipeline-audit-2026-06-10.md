---
title: 'Build pipeline 完整審計 — 1099 秒解剖、30 天變慢歸因、六項修復'
date: 2026-06-10
session: '2026-06-10-spore-data-architecture'
type: 'audit'
status: 'shipped'
trigger: '哲宇：「頁面 build 還有沒有加速的空間，最近又越來越慢了 — 完整分析與審計歸檔 report」'
related:
  - 'reports/research/astro-build-speed-2026-05-04.md'
  - 'reports/build-pipeline-audit-findings-2026-06-10.md'
---

# Build pipeline 完整審計 — 2026-06-10

> **一句話**：30 天內 build 從 719s 漲到 1125s（+56%），三個來源：5/26 一次 mtime 修補靜默壞掉整個增量體系（OG 每 build 全量重產 3,325 張，+66s）、頁數 +15%（7,339 → 8,436）、每頁 render 本身 +22% 變重。本次修掉六項（含 root cause），預期回到 ~950s；若 concurrency A/B 成功再降至 ~850s。量測明細（agent 實測 + CI log 解剖）歸檔於 [build-pipeline-audit-findings-2026-06-10.md](build-pipeline-audit-findings-2026-06-10.md)。

## 1. 量測方法

- 背景 agent 逐步 `time` 實測 21 個 prebuild step（本機 + CI log 對照）；astro 階段不重跑，用三份 CI build log（05-11 / 05-26 / 06-10）的 per-page timing 解剖
- 30 天趨勢：GitHub Actions jobs API 每日抽一個成功 run
- Agent 的 5 條 load-bearing 主張（mtime root cause / getCollection=0 / SEO per-render read / sensor grep bug / allArticles embed）全部由主 session 重新讀碼驗證後才動手（REFLEXES #31）

更正一個過時認知：`article-health.py --all` 實測只要 3.9s（CI 9s）—「要 2 分鐘」是 SSOT consolidation 之前的舊印象。另一個事實校正：deploy 是 **GitHub Actions + GitHub Pages**（deploy.yml），不是 CF Pages；Cloudflare 只在前面做 DNS/proxy。

## 2. 1099 秒的解剖（CI run 27265438981 實測）

```
Build step 1099s
├─ prebuild                 90.6s   (8.2%)   ← prebuild:og 全量重產佔 ~66s（壞掉的 mtime）
├─ astro build             943.2s  (85.8%)
│   └─ 靜態頁生成          931.2s   ← 8,436 頁 @ concurrency 4（有效平行度 3.08）
│       └─ 文章頁 4,895 頁 × 554ms = render 時間的 94.2%
└─ postbuild                65.2s   (5.9%)   ← verify-internal-links 64.4s 單執行緒
```

push → 上線全程 ≈ 22 分鐘（Build 之外另有 checkout/npm ci/playwright/artifact upload ~135s + deploy job 66s）。

## 3. 30 天變慢歸因（719 → 1125s，+406s）

| 來源                             | Δ         | 性質                                                                                           |
| -------------------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| astro 靜態生成 664.7 → 931.2s    | **+266s** | 頁數 +15% × 每頁 +22%（90.6 → 110.4 ms/頁；6/6 起新增 tw-\* 視覺模組、文章變長、內嵌清單變大） |
| OG 全量重產 regression           | **+65s**  | 5/27 起，root cause 見 §4.1                                                                    |
| verify-internal-links            | +26s      | 頁數線性成長（38 → 64s）                                                                       |
| prebuild sync/status 進 build 鏈 | +18s      | 5/12 架構改變（合理成本）                                                                      |
| npm ci / article-health 等       | +21s      | 雜項                                                                                           |

目前斜率 ≈ +27 頁/天 ≈ 每天再慢 ~3s — 頁數驅動的部分是健康成長，要對付的是單頁成本與固定稅。

## 4. 修復 ledger（本次 ship）

### 4.1 mtime 增量體系修復（root cause，預期 -66s）

5/26 的 heal 把失聯的 chetan action 換成 apt 版 `git-restore-mtime`（git-tools 2022.12）— 它內部呼叫 `git whatchanged`，而 GitHub runner 的 git ≥ 2.51 已廢除該指令 → **12,343/12,352 個檔案的 mtime 靜默沒還原** → OG generator 的 mtime 增量檢查全失效，每 build 重產 3,325 張（CI log 實證：05-11 queue 6 → 05-26 216 → 05-27 起 3,325）。

修法：[scripts/ci/restore-mtime.py](../scripts/ci/restore-mtime.py)（零依賴自有實作，60 行，`git log --no-renames --name-only` 單趟流式；本機實測 12,352/12,352 還原、0.7s）+ deploy.yml 換用並加 `--verify-min-ratio 0.9` guard — **這個體系靜默壞過一次，不准再靜默壞第二次**（fail loud，對應 REFLEXES #52）。

### 4.2 verify-internal-links 平行化（實測 6x，CI 預期 -45s）

Python 主體從 .sh heredoc 抽成 [verify_internal_links.py](../scripts/tools/verify_internal_links.py) + multiprocessing.Pool（≤8 workers，per-worker href cache）。同一份 dist 新舊對跑：**關鍵報表數字逐字一致**（317,931 links / 1,659 broken / gated 0.56%），本機 25.6s → 4.3s。報表格式不變（maintainer routine 有 grep 它）。

### 4.3 `build.concurrency: 4 → 8` A/B（潛在 -80~150s，下個 build 量測）

有效平行度 3.08/4 顯示排程有空隙；heap 已 12GB。**這是 A/B：下一個 CI build 看 wall + RSS，OOM 或變慢就回退 4**（5/4 的 1→4 已證過這條槓桿有效）。

### 4.4 build-perf 感測器修復（專抓變慢的儀器自己在說謊）

- `grep -c '<url>'` 數行數，sitemap 是單行 → page_count 永遠 1 → dashboard 長期顯示 `ms_per_page: 1099000` + `flag_slow` 永真。改 `grep -o | wc -l` → 實際 213ms/頁
- 「7d/30d avg」實際是「最近 7/30 個 run」（每天 ~15 run → 所謂 30d 其實 < 1 天）。改成真的按 `started_at` 時間窗過濾 + 輸出 `coverage_days` 誠實揭露涵蓋天數
- CI 上整步 skip（31 次 serial gh api ≈ 8s 純網路在 build 關鍵路徑；JSON 是 git tracked，本機 routine 每日刷新即可）

對應 REFLEXES #59「製造數字的人最易被數字騙」：build 變慢 30 天沒被儀表板抓到，是因為儀表板自己壞了。

### 4.5 SEO.astro per-render readFileSync hoist（~-2s）

`dashboard-vitals.json` 的讀取寫在 component frontmatter = 每頁 render 重跑（8,400+ 次 syscall/build）。Hoist 到 [src/utils/liveStats.ts](../src/utils/liveStats.ts) module-level cache，fallback 容錯保留（該 JSON gitignored，fresh clone dev 不能 crash）。

### 4.6 移除死掉的 .astro content-collection cache（-2s + 簡化）

repo 內 `getCollection(` 出現次數 = 0（文章走 fs 直讀），cache 實測 4.5KB — restore/save 兩步是死重，移除。

## 5. 建議（未 ship，按 ROI 排序）

1. **拔掉每篇文章頁內嵌的 50KB `allArticles` JSON**（article.template.astro:1425 `define:vars`）—「隨機探索」按鈕把整語言文章清單序列化進每一頁：dist ~250MB 純重複、artifact upload 52s 與 link-scan 連動變慢、讀者每頁多載 50KB。改 fetch 共用 JSON endpoint（latest.json pattern 現成）。已開 spawn chip 待接。
2. **per-page render profile**（`node --cpu-prof` 跑一次 build）— 文章頁 554ms vs raw 端點 46ms，~508ms 在 component tree 本身；不 profile 就動手是瞎槍。長期天花板在這。
3. **OG cache 條件 save**：目前每 run 必存 186MB cache（~15 run/天 ≈ 2.8GB/天 churn，會把別的 cache 從 10GB quota 擠掉）。改「OG step 真的有產圖才 save」。
4. **node_modules 整包 cache**（key=lock hash）：npm ci 18s → ~8s。
5. **刪 src/content/config.ts 的 collections 定義**（零消費者）— 需先驗證對 astro sync/型別無副作用，小工程另案。

## 6. 防回歸

- mtime guard：restore ratio < 90% → CI fail loud（4.1）
- 感測器修復後 `ms_per_page` 回到真值 + `coverage_days` 欄位 — 下次變慢儀表板自己會抓到，alert 線（>200ms）已經在 generate-dashboard-alerts 接著
- concurrency A/B 結果（wall + RSS）記在下個 build 後的 routine memory；回退條件寫在 astro.config.mjs 註解

---

_v1.0 | 2026-06-10 | 量測：背景 agent（65 tool calls / 三份 CI log 解剖 + 21 step 實測）；驗證與修復：主 session_
_同日另兩份：[spore-data-architecture](spore-data-architecture-2026-06-10.md)（解耦）+ [spore-json-ssot](spore-json-ssot-2026-06-10.md)（SSOT 翻轉）_
