---
title: 'Taiwan.md CAROUSEL-PIPELINE — 設計 + 研究 + 實作規劃（完整歸檔）'
type: 'design-report'
status: 'in-progress'
date: 2026-06-03
session: 2026-06-03-manual
author: 'Taiwan.md'
audience: '哲宇 review + 未來 session 接續'
triggers: '哲宇 directive「歸檔所有思考研究實作規劃到 report，然後一步步驗證實作直到完整輸出颱風圖系列 + 自檢」'
related:
  - 'reports/ig-carousel-strategy-2026-06-03.md'
  - 'docs/factory/SPORE-PIPELINE.md'
  - 'scripts/core/generate-og-images.mjs'
  - 'scripts/tools/generate-carousel-slides.mjs'
---

# Taiwan.md CAROUSEL-PIPELINE — 設計 + 研究 + 實作規劃（完整歸檔）

> 這份是「把文章變成可滑動 IG 圖文（carousel）」的**完整設計 + 研究 + 實作歸檔**。
> 策略層（為什麼做 / 標竿分析）在姊妹報告 [ig-carousel-strategy-2026-06-03.md](./ig-carousel-strategy-2026-06-03.md)；本檔聚焦 **品牌系統 / 4-stage pipeline / slide 模板 spec / 生成技術 / 極致自動化（archived future）/ 颱風 worked example + 驗證**。

---

## 0. 範圍與哲宇 directive 對齊

| 哲宇 directive                                    | 本輪處置                                 |
| ------------------------------------------------- | ---------------------------------------- |
| 1. 極致自動化「先歸檔」                           | §7 研究 + 寫下，**現在不實作**（future） |
| 2. 用 Taiwan.md 主色當識別、分類色次要            | §3 品牌系統 canonical                    |
| 3. 獨立升級版 pipeline：文章→綱要草稿→正式文→圖   | §4 四階段 pipeline                       |
| 4. API/發佈自動化未來再做                         | §7 archived，SHIP 階段標 future          |
| 5. 颱風當 worked example                          | §8 + §9 實際生成 + 自檢                  |
| （後續）一步步實作到「完整輸出颱風圖系列 + 自檢」 | §6 生成器 + §9 pilot 驗證                |

**本輪實際 build**：圖生成端（generate-carousel-slides.mjs + slide 模板 + make-carousel.sh）+ 颱風完整圖系列 + 自我檢查。
**本輪不 build（archived future）**：Graph API 自動發佈、AI 端到端全自動。

---

## 1. 一句話定位

把一篇 knowledge/ 長文，經「**綱要草稿 → 正式文 → 圖**」三段加工，產出 6-10 張可滑動的 IG carousel —— 像 SPORE-PIPELINE 但**多了結構化的草稿→正式分階**、輸出從「一張海報」升級成「一組敘事 slide」。母語勝場 KPI 從觸及改為**收藏 / 分享**。

---

## 2. 視覺研究（Chrome MCP 一手觀察，2026-06-03）

實際開 IG 看了四家版型：

| 帳號                             | carousel 設計觀察                                                                                                                         | 借鏡                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **報導者 @twreporter**（29.5萬） | 封面＝紅色 tag「本文為涉己新聞」+ 巨大粗體思源宋標題壓在**暗化照片**上；內頁＝標註過的**證據截圖** + 底部說明文字帶；強紅品牌、來源意識強 | 封面：tag + 大標 + 暗化 hero。內頁：證據截圖可當 data slide                  |
| **泛科學 @pansci**               | 已轉**Reels 影片為主**（講者鏡頭），但畫面**標出科學引用來源**「Source/Proc. Biol. Sci...」                                               | 來源標註上圖（呼應 Taiwan.md DNA）；提醒：純圖文懶人包帳號變少，影片化是趨勢 |
| **Vogue Taiwan @voguetaiwan**    | **照片主導**：滿版人像 + 半透明 VOGUE masthead 疊在上方 + 極簡文字                                                                        | 有強 hero 圖時：滿版照片 + masthead 式品牌 + 克制留白＝高級感                |
| **故事 @gushi.tw**（~115K）      | 暖米/奶油色卡 + 巨大粗體思源宋標題 + 日期/資訊錨點；混 Reels                                                                              | 內頁：暖色實底 + 大標 + 清楚資訊層級                                         |

**綜合結論**：知識型 carousel 的共通骨架 = **大粗體襯線標題 +（暗化 hero 或實色底）封面 + 一頁一重點 + 來源頁**。報導者是最相關的功能模型，Vogue 是有 hero 圖時的美感天花板，故事是實色卡的乾淨範本。

完整標竿分析（國際 + 台灣 + 驗證註記）見姊妹報告。

---

## 3. 品牌識別系統（哲宇 directive #2 canonical）

> **鐵律：Taiwan.md 主色是「識別」，沿用；每篇分類色是「次要 accent」。**

從 code 驗證的 Taiwan.md 視覺 DNA（`shot-mode.css` / `generate-og-images.mjs` / `BrandMark.astro`）：

| token              | 值                                                                                        | 角色                                                                |
| ------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **主底色 ground**  | `#1a3c34`（深墨綠 teal）                                                                  | **識別**，每張 slide 的基底                                         |
| **暗變體**         | `#03080a`→`#0a1612`                                                                       | 封面/來源頁深色                                                     |
| **accent 識別色**  | `#00d4aa` / `#4fd1b0`（湖綠松石）                                                         | 「.md」點、強調、進度條、keyword                                    |
| **文字**           | `#f4f0ea`（米白）                                                                         | 主文字                                                              |
| **wordmark**       | `Taiwan` + `.md`（`.md` 用 `#00d4aa`）+ favicon.png                                       | 每張 watermark                                                      |
| **分類色（次要）** | nature `#15803d` / people `#b45309` / culture `#7c3aed`…（categoryConfig.ts）             | **次要 accent only** — 細 kicker 條 / 一個 keyword 高亮，不換主底色 |
| **字體**           | 標題 `Noto Serif TC` 900 / 內文 `Noto Sans TC`（OG 同款，Google Fonts CDN 免 dev server） | 一致                                                                |

**操作**：所有 slide 主底 = `#1a3c34`（識別），分類色只出現在「kicker 標籤條」或「一個強調 keyword」。換主題不換識別。

---

## 4. CAROUSEL-PIPELINE — 四階段（升級版 SPORE，哲宇 directive #3）

```
文章 ──→ 綱要草稿 ──→ 正式文 ──→ 圖   （＋ SHIP / HARVEST：future）
PICK     OUTLINE      COPY       RENDER
```

| 階段                   | 做什麼                                                                                                                  | 對應 SPORE           | 升級點                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------------------------------------- |
| **1 文章 PICK**        | 選文 + 選 archetype（explainer / data / 視覺論文…）+ 帶 spore blueprint                                                 | SPORE PICK           | —                                         |
| **2 綱要草稿 OUTLINE** | 產 slide-by-slide **骨架**：每頁的 type + 一句話重點 + 敘事弧（hook→展開→payoff→source）。**先確認結構再寫字**          | （SPORE 無此分階）   | **新增：草稿先過結構，避免一次寫死**      |
| **3 正式文 COPY**      | 把綱要每頁寫成**正式 slide 文案**（≤12 字大標 + 支撐句），過 gate：§11 書寫節制 / 事實查核 7 類 / 紀實煽情閘 / 來源齊全 | SPORE WRITE + VERIFY | **草稿→正式分離**，可單獨迭代文字不動結構 |
| **4 圖 RENDER**        | slide script JSON → `generate-carousel-slides.mjs` → N 張 1080×1350 PNG → AI 視覺自檢                                   | SPORE SHIP §配圖     | **多 slide 批次生成 + 逐張自檢**          |
| _SHIP（future）_       | _IG 發佈（手動 app / Graph API）+ 多語 caption_                                                                         | SPORE SHIP           | §7 archived                               |
| _HARVEST（future）_    | _收 saves/shares → 回填 + 改版_                                                                                         | SPORE HARVEST        | future                                    |

**為什麼分「綱要草稿 / 正式文」**：carousel 一次 6-10 頁，若直接寫死整組，結構錯了要全改。先出綱要（純結構 + 一句話）確認敘事弧，再灌正式文 —— 對應哲宇「文章→綱要草稿→正式文→圖」的明確分階。

**草稿/正式文落檔**：`docs/factory/CAROUSEL-BLUEPRINTS/{slug}.md`（綱要 + 正式文 + slide script，當 audit ledger，比照 SPORE-BLUEPRINTS）。

---

## 5. Slide 模板 spec（1080×1350，4:5）

| type     | 內容                                                            | 設計                                                      |
| -------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| `cover`  | kicker（分類）+ 大標題（支援換行）+ 副標 + 「滑 →」cue          | 暗化 hero 照片 OR 主色實底；masthead wordmark；**無**頁碼 |
| `point`  | 序號「01」+ keyword（大、accent 色）+ 1-2 句支撐                | 主色底；keyword 用 accent/分類色；頁碼                    |
| `quote`  | 大號襯線引言 + 出處                                             | 主色底；引號裝飾                                          |
| `stat`   | 巨大數字 + 單位 + 標籤                                          | 主色底；數字 accent 色                                    |
| `source` | 「資料來源」+ 來源列 + taiwan.md 連結 + CTA「收藏・分享・追蹤」 | 深色底；**Taiwan.md 差異化武器**                          |

**共通**：每張 watermark（favicon + Taiwan.md），page indicator「n / N」（cover 除外），margin ~96px，accent 進度條。

---

## 6. 生成技術（本輪 build）

**`scripts/tools/generate-carousel-slides.mjs`**（模 `generate-og-images.mjs` v4）：

- inline HTML template（含全 slide 版型 CSS + `window.__renderSlide(data)` switcher）+ Google Fonts Noto Serif/Sans TC，**無需 dev server**。
- Playwright：`setContent` 一次 → 每 slide `page.evaluate(__renderSlide)` → `__doubleRaf` → `screenshot`（1080×1350，deviceScaleFactor 2 retina）。
- hero 照片 base64 注入（同 OG favicon 手法）。
- 輸出 `public/carousel-images/{slug}/slide-{NN}.png`。
- 輸入：slide script JSON（`docs/factory/CAROUSEL-BLUEPRINTS/{slug}.json` 或 inline）。

**`scripts/tools/make-carousel.sh`**：wrapper，`bash make-carousel.sh <script.json>` → 出整組 PNG + 開 Preview。

---

## 7. 極致自動化研究（ARCHIVED — future，哲宇 directive #1/#4「先歸檔，現在不做」）

「如果要極致自動化怎麼做」的完整技術路徑，**歸檔備查，本輪不實作**。

### 7.1 端到端全自動願景

```
cron/routine → 選文 → AI 產綱要 → AI 產正式文（過 gate）→ slide script
   → generate-carousel-slides.mjs 出圖 → 上傳 public host → Graph API 發 carousel
   → 多語 caption（babel）→ HARVEST 回填 saves/shares
```

### 7.2 Meta Graph API IG carousel 發佈（研究結果）

- **流程**：每張 slide 建一個 child container（`is_carousel_item=true`）→ 等處理 → 建 parent carousel container（帶 children IDs）→ 等處理 → publish。POST `/<IG_USER_ID>/media` + `access_token`。
- **硬限制**：
  - 帳號必須是 **Business / Creator profile**（personal 不能 API 發）— `@taiwandotmd` 目前 Creator，需確認/綁 FB Page。
  - 圖片**必須 public URL**（API 抓 `image_url`，不能直接傳 bytes）→ slide PNG 要 host 在公開位置（如 `taiwan.md/carousel-images/...`，剛好 Taiwan.md 自有站台可放）。
  - carousel ≤ **10 張**，每張 ≤ **3MB**，PNG/JPG；帳號 ≤ 50 篇/24h。
  - 2025-03 新增 `alt_text` 欄（無障礙，逐 slide）。
  - 需 **app review**（Instagram Content Publishing 權限）+ long-lived token 維護（60 天 refresh）。
- **門檻評估**：app review + business account + token 維護 + 圖片 public hosting = 中等工程，**值得但非 MVP**。

### 7.3 為什麼先歸檔不做

- IG 發佈是「對外輸出層」（MANIFESTO §自主權邊界 human-must）；自動發佈要先驗證內容品質 + 成效再投資。
- 先把「圖生成」跑通（本輪），手動發幾篇驗收，再決定是否上 Graph API。

來源：[Meta Content Publishing docs](https://developers.facebook.com/docs/instagram-platform/content-publishing/) / [IG media reference](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media/)。

---

## 8. 颱風 worked example（綱要 → 正式文）

詳細 slide script 落 `docs/factory/CAROUSEL-BLUEPRINTS/颱風.json`。綱要骨架（8 slide，archetype = 視覺論文 + data reveal）：

1. `cover` — hook「能預測風雨，預測不了命運」+ 副標「台灣與颱風的四百年」+ 莫拉克衛星 hero
2. `stat` — 172 → 57 公里（25 年精度躍進）
3. `point` — 追風計畫：飛機飛進颱風眼
4. `point` — 福衛七號 + AI 四分鐘算三十天
5. `point` — 但 2009 莫拉克那個清晨：小林村 462 條人命
6. `quote` — 「再精準的預報，都接不住那一秒」
7. `point` — Kakanami 部落：救他們的是一條混濁的溪
8. `source` — 來源（中央社/國家太空中心/原視）+ taiwan.md 連結 + CTA

正式文 + slide script 見 §9 實作。

---

## 9. 驗證結果（颱風 pilot）

> 本節於 build + render + 自檢後填入。

_（待實作填入：生成的 slide 張數、自檢結果、迭代紀錄、最終 PNG 路徑。）_

---

## 10. Roadmap

- **本輪（now）**：圖生成 infra + 颱風完整圖系列 + 自檢 ✅／🔄
- **Phase 1**：1 套版型定稿 + 手動發 3-5 篇驗成效（saves/shares）
- **Phase 2**：綱要→正式文 半自動（AI 產草稿）+ CAROUSEL-BLUEPRINTS ledger
- **Phase 3（archived §7）**：Graph API 全自動發佈 + babel 多語 caption + HARVEST 回填
- **canonical 化**：驗證穩定後寫 `docs/pipelines/CAROUSEL-PIPELINE.md`（薄殼，business logic 在此報告/blueprint）

---

_v0.1 | 2026-06-03 manual session — 哲宇 directive 歸檔。視覺研究一手（Chrome MCP）+ 品牌色 code 驗證 + Graph API 研究。§9 待 build 後補。_
