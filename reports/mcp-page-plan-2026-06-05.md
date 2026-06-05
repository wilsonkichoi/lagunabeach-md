---
title: 'taiwan.md/mcp 頁面 — 規劃'
type: 'design-report'
status: 'plan (執行中)'
author: 'Taiwan.md (Full-mode session 2026-06-05-174805-manual)'
trigger: '哲宇：建一個 taiwan.md/mcp 頁面，放 MCP + CLI 完整介紹與範例，先規劃歸檔 report 後執行'
parent: 'reports/claude-code-connector-evolution-2026-06-05.md'
autonomy: '哲宇 explicit directive 建頁 = 授權；上 main→CF deploy 仍待 review（先在 branch）'
last_updated: 2026-06-05
---

# taiwan.md/mcp 頁面 — 規劃

> 哲宇：「建一個 taiwan.md/mcp 頁面專門放這些，包含 MCP 工具跟 CLI 工具的完整介紹與範例，還有一切大家想看或需要的東西。先規劃歸檔 report 後執行。」
> 這份是執行前的規劃（歸檔）。寫完即按此執行，產出 `/mcp` 頁面在 branch `connector-phase0-1`，上 main → CF deploy 待哲宇 review。

---

## 1. 目標

一頁公開頁 `taiwan.md/mcp`，是 Taiwan.md connector + CLI 的**單一權威入口**：

- 開發者 30 秒就能裝起來用（Claude Code 一行）
- MCP 6 工具 + CLI 26 指令的完整介紹 + 可複製範例
- 講清楚差異化（免費 / 無 key / 本地優先 / 開源）
- 回答「大家想看或需要的」：怎麼裝、各客戶端、隱私、FAQ、fork

對應 connector 主報告 Phase 1 的「一頁 docs」，但升級成站上正式頁（不只 cli/CONNECTOR.md）。

---

## 2. 技術方案（對齊站上慣例）

站上 page 是 thin-page + template 模式（`src/pages/X.astro` → `src/templates/X.template.astro`）。

| 檔案                               | 動作 | 說明                                                                         |
| ---------------------------------- | ---- | ---------------------------------------------------------------------------- |
| `src/pages/mcp.astro`              | 新增 | 薄殼，import template                                                        |
| `src/templates/mcp.template.astro` | 新增 | 內容主體。model after `semiont-page.template.astro`（零 `t()`，zh-TW first） |
| `src/components/Header.astro`      | 改   | nav 加 `/mcp`（或收進既有群組，避免 nav 過長）                               |
| `src/i18n/ui.ts`                   | 改   | 加 `nav.mcp` label（zh-TW/en/ja…，至少 zh-TW + en）                          |

**為什麼 zh-TW-first 自包含、不走 `t()` 全 i18n**：`data.template` 用 `t()` keys 是 2994 行 + i18n 字串管理的重機具。MCP/CLI 頁的內容主體是**程式碼 + 指令 + 工具表**，這些跨語言通用（`npx`、`claude mcp add` 不翻譯）。散文部分 zh-TW first，ja/en 鏡像當 follow-up（跟 `/semiont` 同模式：先 zh-TW，再長 `/en/semiont`）。降低首版複雜度、加快做好。

**資料準確性（dogfood）**：

- CLI 指令清單以 `node cli/src/index.js --help` 為準（已抓，26 指令），不憑記憶
- MCP 工具以 `cli/src/lib/mcp-server.js` 6 工具為準
- 文章數從 `src/data/content-stats.json` 動態讀（自動更新，不寫死）
- 範例輸出用真實工具跑出來的格式（不杜撰）

**樣式**：Tailwind v4 utilities + 必要的 scoped `<style>`。沿用站上設計 token（PageHero、卡片圓角、深色 hero 漸層）。code block 要有複製感（等寬字 + 邊框 + 可選 copy 互動）。

---

## 3. 資訊架構（頁面分段）

對「一切大家想看或需要的東西」的拆解：

1. **Hero** — 一句話定位（「把台灣裝進你的 AI」）+ 最關鍵的一行 `claude mcp add taiwanmd -- npx -y taiwanmd mcp serve` 直接擺在最顯眼處 + 三標籤（免費 · 無 API key · 本地優先）
2. **30 秒快速開始** — Claude Code 一行（複製）→ 直接問 Claude 台灣事 → 它會用 `taiwanmd_rag` / `taiwanmd_cite`。給「裝完馬上有反應」的勝利
3. **這是什麼 / 為什麼** — free/no-key/local-first/open 四點 + vs 商業 gateway 對比表（價格 / API key / 查詢在哪跑 / 開源）
4. **安裝（各客戶端）** — Claude Code（一行）/ Claude Desktop（.mcpb 雙擊）/ Cursor / Copilot CLI / Codex CLI / Cline / Continue / 任意 MCP client。卡片 + 可複製片段
5. **MCP 工具（6）** — 每個：名稱 + 一句功能 + 範例呼叫 + 範例輸出。`taiwanmd_cite` 反幻覺重點 highlight
6. **CLI 工具（26）** — `npm i -g taiwanmd` / `npx`，再分組指令表 + 範例：
   - 讀者探索：search / read / list / random / today / quiz / explore / graph / diff / terminology
   - AI / RAG：rag / cite / mcp
   - 貢獻品質：contribute / validate / audit / inbox / sync
   - 生命體：organs / stats / sense / spore / supporters
   - 工具：profile / mailmap
7. **運作原理 + 隱私** — 本地 stdio / 首用自動 sync 到 `~/.taiwanmd` / 查詢不外送 / CC BY-SA + MIT / 遠端 endpoint 是規劃中的可選入口（非預設）
8. **FAQ / Troubleshooting** — 首查慢、npx not found、版本 pin、跟 Twinkle 之類的關係、要不要付費（不用）
9. **開源 / fork / 這是 Semiont 的身體** — repo / npm / issues 連結 + 「這個 connector 是 Taiwan.md 繁殖系統的一部分」一句，連到 /semiont

---

## 4. 驗證計畫

- `preview_start` 跑 dev server → 開 `/mcp` → `preview_snapshot` 看結構 + `preview_console_logs` 看 error
- 響應式：`preview_resize` 看手機版（指令表 / 卡片不爆版）
- build sanity：確認 thin-page route 正常、無 broken import
- 連結驗證：頁內所有連結（GitHub / npm / /semiont）可解析
- 完成後 `preview_screenshot` 給哲宇看成果

---

## 5. 自主權 + 範圍

- **建頁**：哲宇 explicit directive，授權。
- **上線**：頁在 branch `connector-phase0-1`，merge 進 main → CF deploy 才公開。merge 仍待哲宇 review（跟 connector 同 gate）。
- **i18n 鏡像（ja/en/ko/es/fr）**：首版 zh-TW + en nav label；其他語言版頁面當 follow-up（babel 飛輪 / 後續），不阻塞首版。
- **不碰**：main 上 72 個 babel dirty 檔 + 並行 session scope（explicit add 隔離）。

---

## 6. 執行順序

1. 寫 `src/templates/mcp.template.astro`（主體）
2. 寫 `src/pages/mcp.astro`（薄殼）
3. Header.astro + ui.ts 加 nav
4. preview 驗證（structure / console / 響應式 / screenshot）
5. 修到綠 → commit + push branch
6. 給哲宇 screenshot + 待 review merge

🧬

_plan · 執行於 branch connector-phase0-1 · 上線待 review_
