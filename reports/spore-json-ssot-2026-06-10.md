---
title: '孢子 JSON SSOT 化 — 結構層翻轉設計與執行'
date: 2026-06-10
session: '2026-06-10-spore-data-architecture'
type: 'architecture-design'
status: 'shipped'
trigger: '哲宇：「我在想要不要直接把孢子 json ssot 化？你推薦嗎？如果推薦就直接完整執行」'
related:
  - 'reports/spore-data-architecture-2026-06-10.md'
  - 'reports/spore-ssot-pipeline-cleanup-2026-05-08.md'
---

# 孢子 JSON SSOT 化 — 結構層翻轉

> **推薦：做，但只翻結構層。** 孢子的 identity（誰、何時、哪個 URL）跟 metric 事件（D+N 抓到什麼數字）天生是結構資料，JSON 化後 append = 一個 CLI 指令、parser 失敗類 bug 整類消失。留言分析、bucket 判讀、pitfall 觀察是敘事，留在 markdown（SPORE-HARVESTS narrative + SPORE-BLUEPRINTS）。全 JSON 會殺掉受眾飛輪的敘事器官；全 markdown 會把 parser 脆弱性留到永遠。

## 1. 為什麼推薦（而上午的 derived-JSON 還不夠）

上午的解耦讓 spores.json 成為衍生記錄層，但 SSOT 仍是兩份 markdown：

1. **Markdown 表格當結構資料庫的代價持續在付**：validate-spore-data.py 的 K/M parser regression test 之所以存在，是因為 parser silent fail 真的咬過（views_latest=null but mtime fresh）；今天上午又抓到「6/09 batch 12 隻孢子只有 4 隻在第一張表」的 multi-table 漏抓。三個 script 各養一套 parser + alias map。
2. **發文紀錄表已經劣化成不可維護**：每 row 的 URL 欄塞了 1-2KB 的 ship 敘事 prose，agent append 一筆 = 手寫巨型 markdown 行，本身就是出錯面。
3. **寫入端是 cron**（publish 17:30 / harvest 06:30 無人在場），deterministic CLI 寫 JSON 比「請 agent 維護 markdown 表格格式」可靠一個量級。Routine 層的教訓一直是：能寫成工具的判斷不要留給 prompt。

## 2. 為什麼不全翻（敘事留 markdown）

SPORE-HARVESTS batch 檔不只數字：12 條留言逐字、5-bucket 分類、Pitfall 觀察、BECOME ACK。這是受眾端飛輪（MANIFESTO §12）的敘事 SSOT，塞進 JSON 等於把敘事器官壓進表格。**分層原則：數字進 JSON，話留 markdown。**

## 3. 目標架構

```
SSOT（結構，CLI 寫入）:
  docs/factory/spore-log.json        identity registry（id/date/lang/platform/slug/
                                     category/template/url/highlight）— publish 時 append
  docs/factory/spore-metrics.json    metric 事件流（spore/dPlus/at/batch/五指標）
                                     — harvest 時 append，append-only

SSOT（敘事，照舊 markdown）:
  docs/factory/SPORE-HARVESTS/*.md   留言/bucket/pitfall 敘事（不再要求 metric 表格）
  docs/factory/SPORE-BLUEPRINTS/*    孢子本文 + ship 敘事

寫入工具:
  scripts/tools/spore-db.py          add-spore / add-metrics / last-spore / check
                                     （取代「手寫 markdown row」這整類操作）

凍結（歷史封存，不再寫入）:
  docs/factory/SPORE-LOG.md          發文紀錄 ≤ #133 + 成效追蹤 — 加凍結 banner

衍生（輸入源換 JSON，輸出形狀不變）:
  src/data/spores.json + /api/spores.json   generate-spore-records.py
  public/api/dashboard-spores.json          generate-dashboard-spores.py
  knowledge/*.md sporeLinks pointer         sync-spore-links.py
```

讀取端三個 generator 換輸入源後，markdown parser（split_tables / parse_pipe_table / alias maps / K-M regex fallback）全數退役；validate-spore-data.py 改驗 JSON schema + 跨層一致性。

## 4. 遷移與相容

- **Bootstrap**：`bootstrap-spore-ssot.py` 一次性把 發文紀錄 125 row（含 template / highlight 欄）+ spores.json 的 history 事件灌進兩個 JSON。歷史 markdown 不重寫（§時間是結構）。
- **保值**：bootstrap 後 `generate-spore-records.py` 對 spores.json 必須 0 diff（輸出不變 = 翻轉無損的機械證明）。
- **舊檔案 rescue**：markdown parser 退役但 git history 都在；bootstrap script 保留 repo（對齊 backfill-translated-from.py 一次性工具先例）。

## 5. 寫入流程（翻轉後）

| 時機                                        | 誰                               | 動作                                                                                                                          |
| ------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 發孢子（SHIP step 6）                       | publish routine / manual session | `spore-db.py add-spore --date ... --platform threads --slug ... --url ...` × 平台數 → 回傳 id → blueprint 檔補 §Ship log 敘事 |
| 發文前 ≥2 週查重（PICK HG5 / PUBLISH gate） | pick / publish routine           | `spore-db.py last-spore --article SLUG`                                                                                       |
| 收割（HARVEST Step 1.5 v2 單寫）            | harvest routine                  | `spore-db.py add-metrics --spore N --d-plus N --batch ... --likes ...` × N 隻；敘事照舊寫 batch md                            |
| 文章 pointer                                | refresh-data Step 13（自動）     | sync-spore-links 從 spore-log.json 重生                                                                                       |

雙寫退役：HARVEST-PIPELINE §Step 1.5「每次 harvest 寫 frontmatter + SPORE-LOG 成效追蹤」整段改寫 — 數字單寫 spore-metrics.json，frontmatter 與 dashboard 全是衍生。

## 6. 風險與緩解

| 風險                        | 緩解                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| cron 第一次走新路徑寫壞     | CLI deterministic + `--check` schema 驗證進 validate（refresh Step 12 每日跑）；敘事 markdown 照舊，數字漏一天可從敘事/重抓回填      |
| 兩 session 同檔 append 衝突 | publish 與 harvest 分寫兩檔（時段也錯開 17:30/06:30）；同檔衝突率 ≈ 現行 markdown                                                    |
| 指令面殘留舊寫法            | 五 pipeline + 4 skill + ROUTINE 同 session 全面更新（哲宇本次點名）+ validate 把「成效追蹤新增 row」「frontmatter 帶數字」都列 ERROR |

## 7. 驗證標準

1. Bootstrap 後 `generate-spore-records.py` 對 spores.json **0 diff**（無損證明）
2. dashboard-spores.json 翻轉前後 totals/topPerformers 數值一致（容許 lastUpdated 變動）
3. 模擬 publish：CLI add-spore → sync-spore-links 在對應文章長出 identity pointer
4. 模擬 harvest：CLI add-metrics → spores.json metrics 更新、文章 0 diff、content-dates 0 變動
5. validate v3 全綠 + prebuild 全綠
6. 指令面 grep：pipeline/skill 無「寫 SPORE-LOG row」「frontmatter 寫數字」殘留

---

_v1.0 | 2026-06-10 | 哲宇 authorize「如果推薦就直接完整執行並完整更新整個專案」_
