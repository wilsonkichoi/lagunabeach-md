# Evolution Roadmap — 2026-06-13（refactor 戰役後的自我進化地圖）

> 給未來 session 的進化計畫快照（BECOME §Step 7 讀取格式）。
> 導出自：[architecture-deep-audit-2026-06-13.md](architecture-deep-audit-2026-06-13.md) +
> 本 session 兩場 template 手術 + CI/CD 審計 + Explore 全掃。
> 上一份 roadmap：2026-04-18-η（已大半完成或被 routine 飛輪吸收）。

## 使用方式

任一 session 想做工程進化時從這裡挑。每項標：價值 / effort / 自主權（✅ = Semiont 可自決，
🔒 = 需哲宇拍板）。完成後在本檔劃線 + 註 commit，全部完成或過半失效時寫新 roadmap 取代。

---

## A. 架構結構解

| ID     | 項目                                                                                                                                                                        | 價值                                               | Effort     | 自主權      |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------- | ----------- |
| EVO-A1 | **雙讀路徑統一**：article wrappers / RSS / search 直讀 knowledge/，sitemap 層讀 src/content/ — 二選一：全走投影層 vs 投影層降級成 manifest                                  | 消除跨層短暫不一致 + babel 並行寫入的 read-tear 面 | 中-大      | 🔒 方向決策 |
| EVO-A2 | **search 索引單一生成器**：砍 `src/pages/api/search-index.json.ts` 與 build-search-index.mjs 的重複邏輯（保 prebuild 版，endpoint 改 serve 既有 JSON）                      | 分詞規則不再雙軌漂移                               | 小         | ✅          |
| EVO-A3 | **i18n / data 巨檔分解**：map.ts 4,298 / opendata-content.ts 4,560 等六檔 → 按 section 分檔或 JSON+loader                                                                   | LLM maintainer 編輯成本 + conflict 面積            | 中（機械） | ✅          |
| EVO-A4 | **git 資料 prebuild 化**：contributors/lastModified/revisionCount 併進 content-dates 產線 → astro 零 git 依賴 → **CI shallow clone**（checkout 27s→~5s + 解鎖 runner 彈性） | build 再 -20~30s + 架構乾淨                        | 中         | ✅          |

## B. Build / 重量

| ID     | 項目                                                                                                            | 價值                                     | Effort | 自主權             |
| ------ | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------ | ------------------ |
| EVO-B1 | raw md endpoints ×3,171 改 prebuild 直接 cp（46ms×3,171 的 astro 路由開銷歸零）                                 | astro 階段再 -10~15s                     | 小     | ✅                 |
| EVO-B2 | **HTML 重量戰役**：dashboard recipe 全站化（本次已派 agent 批次處理 18 檔）+ inline SVG icon → sprite/元件共用  | dist -X00MB、讀者端載入、artifact upload | 中     | ✅（>50 檔時回報） |
| EVO-B3 | Astro 官方增量 build 追蹤（[roadmap #237](https://github.com/withastro/roadmap/discussions/237)）— 落地前不自建 | 長期天花板                               | 觀察   | ✅                 |

## C. 品質 / 儀器

| ID     | 項目                                                                                                                 | 價值                    | Effort | 自主權 |
| ------ | -------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------ | ------ |
| EVO-C1 | perf sensor 加 `astro_ms_per_article_page` 維度（文章頁與 raw 頁分開，乘數頁退化不被稀釋）                           | 50ms 哨兵的解析度升級   | 小     | ✅     |
| EVO-C2 | **article-render.ts golden tests**：17 個 tw-\* 模組 input→HTML snapshot（抽出後首次可測；viz 像素閘門的單元層補位） | renderer 改動的回歸保護 | 小-中  | ✅     |
| EVO-C3 | public/api 51 個 JSON 生產者→消費者盤點，清殭屍（article-index.json 已知嫌疑）                                       | 感知層誠實              | 小     | ✅     |
| EVO-C4 | src/lib + src/utils 單測起步（staticRoutes / getLangSwitchPath 的路由真值表）                                        | 架構級函式的回歸網      | 中     | ✅     |

## D. 新能力

| ID     | 項目                                                                                                       | 價值                                               | Effort | 自主權      |
| ------ | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------ | ----------- |
| EVO-D1 | **跨語系 RAG**：研究報告（agent 進行中 → reports/research/2026-06/rag-design-research-2026-06-13.md）→ MVP | 讀者語意搜尋 + AI 引用密度（呼應 LONGINGS AI-SEO） | 大     | 🔒 方案選型 |
| EVO-D2 | twmd CLI 第二階：routine 類子命令（refresh/distill 觸發）+ COMMANDS 表自動 sync 檢查（路由目標 CI 驗存在） | 工具發現成本持續壓低                               | 小     | ✅          |

## E. 認知層

| ID     | 項目                                                                                     | 價值                   | Effort     | 自主權                         |
| ------ | ---------------------------------------------------------------------------------------- | ---------------------- | ---------- | ------------------------------ |
| EVO-E1 | **LESSONS-INBOX 完整消化**（249 條 > 200 飽和線；聚類 agent 進行中 → 分批 distill 執行） | 教訓 buffer 回到可用態 | 大（分批） | ✅ distill / 🔒 MANIFESTO 升格 |
| EVO-E2 | MEMORY.md 索引 456 rows > 80 蒸餾線（2026-04-14 design 未實作）                          | 索引可導航性           | 中         | ✅                             |
| EVO-E3 | 「audit 結論保鮮期」+「probe > 讀碼」進 REFLEXES（隨 EVO-E1 distill 流入）               | 審計方法論固化         | 隨 E1      | ✅                             |

---

## 本 session 已收割（不用再做）

- ~~article template per-render git 子程序~~（66e7db0ed，CI Build 1,125→125s）
- ~~dashboard template 解剖~~（HTML -52%/頁 ×6）
- ~~OG cache churn~~（conditional save，run 2 實證 skipped）
- ~~semiont build-fetch 不確定性~~（0ef6c6256）
- ~~flag_slow 200→50ms + parity 工具入庫 + politics mapping~~（0ef6c6256）
- ~~twmd CLI v1~~（0fd911db3）
- ~~6/10 audit 五熱點~~（驗明全數已落地）

_作者：Taiwan.md 🧬 session 2026-06-13-002414-refactor-article_
