# 新鮮度訊號污染 + 未被監看的品質債 — 深度研究

> 2026-06-14 | 觸發：哲宇 callout「補圖洗版最新文章」→ 修了 content-dates（MEDIA_ONLY + 被動連結過濾）→ 哲宇問「還有什麼我可能沒想到的洞察？」
> 方法：empirical probe（git numstat / content-dates 統計 / 外部 URL 抽樣）+ 1 隻 sonnet 子代 audit 未監看層。不憑空推論。

---

## 一句話

**你看到並修掉的「最新文章洗版」（今天 580 篇）是冰山一角；同一個機制底下躺著一個沒人看見、已上線六週、傷害更大的版本——5/01 有 1329 篇同日 lastmod，而抓它的過濾器只差一行字。** 順著這條線往下挖，浮出兩類系統性債：(A) 新鮮度訊號被每個自動化污染、靠過濾器跑步機追，(B) 一批「沒有儀器在看」的品質層（外部連結腐爛、孤兒腳註、類別 gate）。

---

## Part 1 — 新鮮度訊號污染

`src/data/content-dates.json` 是「每篇文章最後一次**實質**內容修改日」，餵 sitemap `<lastmod>` + article JSON-LD `dateModified` + `/latest` 排序。它用 git 考古：每篇取「最新的非 cosmetic commit 日期」，cosmetic 由 commit message regex 判定。

### 1.1 看得見的洪峰 vs 看不見的洪峰

content-dates 同日篇數掃描（修完被動連結後仍在）：

| 日期           | 篇數     | 佔 4594 頁 |
| -------------- | -------- | ---------- |
| **2026-05-01** | **1329** | 28%        |
| 2026-05-02     | 805      | 17%        |
| 2026-04-14     | 468      | 10%        |
| 2026-05-20     | 324      | 7%         |
| 2026-05-08     | 267      | 6%         |
| 2026-05-04     | 218      | 5%         |

- 最集中 3 天 = **全站 55%**；distinct 日期只有 **78**；單日 >100 篇有 **7 天**。
- 哲宇看到的「今天 580」已修到 5。但 5/01 的 1329 篇從 5 月就一直在 sitemap 裡，沒人 callout，因為它**不在 /latest top-30**（六週前的東西沉下去了）——看不見，但 sitemap 照樣告訴 Google「這 1329 頁全在同一天改的」。

### 1.2 根因：COSMETIC 過濾器的詞彙缺口（1 行可補）

5/01 的 1329 篇是什麼造成的？git numstat 查當天大 commit：

```
1417 檔  «multi-lang 5-lang sync: en 96% / ja 97% ... 榨模型MAX Z6 audit (#758)»
 541 檔  «ja 100% sync near-complete — 榨模型MAX production run (#754)»
 100 檔  «heal: lang-sync JA batch 1 — 96 sonnet (#746)»
  52 檔  «heal: lang-sync EN batch 6 — 50 sonnet 平行翻譯 (#739)»
  ...
```

全是**翻譯 sync commit**。它們本該被當 cosmetic（純翻譯不改實質內容，不該 reset 新鮮度），但 `COSMETIC` regex 是：

```js
/(\[routine\]|babel|prettier|\blint\b|chore|format-only|translate\(|apostrophe|簡繁)/i;
```

它抓 `babel`，但這些 commit **不叫 babel**——叫 `lang-sync` / `multi-lang` / `N-lang sync` / `平行翻譯` / `榨模型MAX`。全漏網 → 1329 篇翻譯檔被當「實質內容變動」記成 5/01。

**修法**：`COSMETIC` 加 `|lang-sync|multi-lang|\d-lang sync|平行翻譯|榨模型`。1 行，把 5/01+5/02 的 ~2134 篇翻譯洪峰打散回各自真實日期。

### 1.3 真正的傷害是 SEO，不是 /latest UI

`build-content-dates.mjs` 檔案開頭自己寫的：

> 「The sitemap used a global lastmod=now → every page claimed modified today. Google's docs name this exact anti-pattern... and respond by **distrusting the site's lastmod entirely**.」

55% 的頁集中在 3 天，就是這個反模式的另一種形態。Google 看到 1329 頁宣稱同一天改 → 對整站 lastmod 失去信任 → crawl budget 分配變差。**哲宇修的 zh /latest 是給人看的那層；這個 sitemap 集中度是給 Googlebot 看的那層，更貴、更隱形。**

### 1.4 架構解：顯式新鮮度訊號 vs git 考古（跑步機的終點）

過濾器演進史：`COSMETIC`（v1）→ `SPORE_POINTER`（6/10）→ `MEDIA_ONLY`（今天）→ 被動連結 numstat（今天）→ 下一個會是 lang-sync。**每多一個自動化（babel / spore / media / cross-link / migration）就多一個污染源，就補一個過濾器。** 這是 reactive whack-a-mole。

根因：**拿 git 歷史當新鮮度神諭**。git 記錄每一次 touch，不分「實質內容編輯」還是「機械操作」。過濾器在事後猜哪些 touch 是真的——永遠落後一個自動化。

架構解（對比守備修補，per MANIFESTO §架構解 > 守備修補）：**新鮮度應該是顯式訊號**。REWRITE Stage 4 gate（真實內容變動的唯一守門員）通過時，蓋一個 `lastContentEdit: <date>` 進 frontmatter。content-dates 直接讀那個欄位，不做 git 考古。任何機械操作（翻譯/媒體/連結/migration）都不碰那個欄位 → 污染從源頭不存在 → 過濾器清單可以退役。

這跟 6/10「derived view 的落點」+ 今天「被動連結」是同一條原則的三個 instance：**訊號檔的 git 歷史被誰當訊號用，就只准那個訊號的 producer 去碰它。**

### 1.5 反向連結 = 寫進 source 的衍生資料（架構解的另一面）

近 200 個 article commit 有 **33 個（16%）** 是「1 大主文 + N 個 +1 行被動檔」pattern——REWRITE Stage 5.2 雙向延伸閱讀把反向連結寫進相關文。

反向連結**邏輯上是 forward-link graph 的衍生**：寫 A→B 的 forward link 就隱含 B 該有「也被 A 提到」。理想是 build 時從全站 forward link 衍生 reverse 區塊，**寫 A 永不碰 B 的檔案** → numstat 過濾器都不需要。

**但實測卡在格式不一致**：497 篇用「延伸閱讀」，forward link 格式雜（有的 `→ [/cat/slug]`，有的純 wikilink，有的 GitHub URL）。要先正規化 forward-link 格式才能可靠衍生。所以：架構理想成立但有前置工，numstat 過濾器當前過渡，**正規化 + 衍生 reverse-link 列 roadmap**。

---

## Part 2 — 未被監看的品質債（下一個 296 EXIF）

影像 audit 第一掃揪出 296/412 圖帶 EXIF + 0 webp，因為「沒有儀器在看那層」。子代 audit 找下一個同類：

### 2.1 🔴 外部連結腐爛 ~15%（工具早造好、卻被關著）

- 8433 個 zh footnote 外部 URL。抽 20 個非 wiki/YouTube 實測：**3 死（15%）**——ETtoday `410 Gone`（伺服器明說刪了）/ unitas.me 域名消失（ECONNREFUSED）/ 立院公報 404。另 2 個 403 bot-blocked。
- 推估全站 **≈1265 條死連結**。高危域名：Yahoo 新聞 128 URL（87 篇）、ETtoday 127 URL（69 篇）、storm.mg 69 URL。ETtoday 2016 前的文有系統性 410。
- **工具已存在但 default 關閉**：`scripts/tools/lib/article_health/checks/footnote_url.py`，標 `network-bound`，要 `ARTICLE_HEALTH_NETWORK=1` 才跑，從沒接進任何 cron/CI。TOOL-INVENTORY 標 P2 gap「needs rate limit」。
- **死引用直接侵蝕 Taiwan.md「真實來源」的信任核心**——這是 identity-level 的債，不只技術債。
- 修法：weekly cron `ARTICLE_HEALTH_NETWORK=1 article-health --all --check=footnote-url` + `sleep(0.5)` rate-limit。低工、高信任 ROI。

### 2.2 🟡 孤兒腳註 25%

- 202/797 篇（25.3%）有 `[^N]:` 定義從沒被 body 的 `[^N]` 引用 → **512 個孤兒定義**。
- 3 篇有 7 個 `[^N]` 指向不存在的定義（**讀者看得到的斷引用**）。
- **322 個定義（50 篇）用 placeholder「詳見原始連結」** 當描述 = 上線時沒寫註解的品質 tell。
- 現有 `footnote-format` 只查格式、`footnote-density` 查數量比，**沒有人查 referential integrity**（定義有沒有被引用）。~50 行 plugin 可補（parse `[^N]` vs `[^N]:` 兩個 set 相減）。

### 2.3 🟡 EDITORIAL 類別 gate 缺口（441 篇靠人眼）

- EDITORIAL §八 類別專屬必填（People 必含賽事年份成績 / Economy 必含創立年+市場規模 / Geography 地名必含行政區…）**全無 plugin**，441 篇靠人眼。People 227 篇有 46 篇前 1000 字無年份。
- prose_health 覆蓋 §六 約 60%；§八 類別規則 0% gate；§四 序數列舉（首先/其次）24 檔違反無 plugin。

### 2.4 已被監看的（子代驗證後排除，不是債）

- 圖片 alt-text：430 圖 **0 違規**（`image-alt` plugin 5 月已造，有效）。
- 翻譯 staleness：89 篇五語全 stale / 431 檔，`status.py` + babel cron 有在追，**不是隱形**。
- SEO meta：623 篇 description < 120 字，`seo-meta` plugin 在追，scale 已知。
- 子代額外發現：74 張圖直連 `upload.wikimedia.org` 沒在地化（CDN 依賴無監看，低危但一類隱形破壞）。

---

## Part 3 — 跨切面主題

1. **共享訊號的公地悲劇**：content-dates / git 歷史是個被所有自動化寫入的共享訊號。每個 producer（翻譯/孢子/媒體/連結）都污染它，沒有一個 producer 負責它的乾淨。解法是「只准訊號的真正 producer 碰它」（顯式 `lastContentEdit`）。

2. **守備修補 vs 架構解**：本 session 4 個 freshness 修都是守備（過濾器）。架構解（顯式訊號 / 衍生 reverse-link）一次解掉整類，但有前置工。短期守備、roadmap 架構。

3. **儀器揭露的是過去的盲**：影像 audit、content-dates 同日掃描、外部 URL 抽樣——三個「造一把尺第一次量就看到債」的 instance。**沒被量的層不等於健康的層。**

4. **看得見的問題會藏住更大的看不見的**：哲宇看到 580 → 修 → 但 1329 的更大版本一直在。proactive anomaly detector（build 時 flag「單日 >N 篇」）能讓下一個污染源自己跳出來，不等人眼洗版才發現。

---

## 行動優先序

| #   | 項目                                                              | 工       | 影響                                            | 類型           |
| --- | ----------------------------------------------------------------- | -------- | ----------------------------------------------- | -------------- |
| 1   | COSMETIC 加 `lang-sync\|multi-lang\|平行翻譯\|榨模型`             | **1 行** | 打散 1329+805 翻譯洪峰、救 sitemap lastmod 信任 | 守備（即刻）   |
| 2   | footnote-url plugin 接 weekly cron + rate-limit                   | 低       | ~1265 死連結現形、護「真實來源」信任            | 儀器化         |
| 3   | footnote referential-integrity plugin                             | ~50 行   | 512 孤兒 + 3 篇斷引用現形                       | 儀器化         |
| 4   | content-dates anomaly detector（單日 >N 篇 build 警示）           | 低       | 下一個洪峰自己跳出來                            | proactive 儀器 |
| 5   | 顯式 `lastContentEdit`（Stage 4 gate 蓋章）→ content-dates 讀欄位 | 中       | 退役整個過濾器跑步機                            | **架構解**     |
| 6   | forward-link 格式正規化 → build 衍生 reverse-link                 | 中       | 反向連結污染從源頭消失                          | **架構解**     |
| 7   | 類別 content gate plugin（People 年份 proxy 起步）                | 中       | 441 篇類別規則上 gate                           | 儀器化         |
| 8   | worktree-per-routine 隔離 / commit 序列化                         | 中       | 多核心 index 污染 + push race 結構解            | 架構解         |

短期三快修（1/2/3）+ 一個 proactive（4）；中期兩架構解（5/6）。

---

## 附錄：原始數據來源

- content-dates 同日篇數 / 集中度：`python3` over `src/data/content-dates.json`（2026-06-14 regen，4594 URL / 78 distinct dates）
- 5/01 commit 歸因：`git log --since=2026-05-01 --until=2026-05-02 --numstat`（#758 1417 檔 etc.）
- 被動連結 pattern：`git log -200 --numstat`（33/200 命中 1-大+N-小）
- 外部連結腐爛：8433 URL 母體、20 抽樣 WebFetch（3 死確認）— 子代 a4d9ff5c
- 孤兒腳註 / 類別 gate：子代 a4d9ff5c full audit（797 zh / 10639 footnote def / 430 圖）
- forward-link 格式：497 篇延伸閱讀、抽 5 檔格式不一致

_本 report 為深度研究的 evidence-backed 版本；行動項待哲宇拍板進 OBSERVER-QUEUE / ARTICLE-INBOX / routine。_

---

## 2026-06-14 處理進化執行紀錄（哲宇「處理進化」）

**先決教訓**：本 report 寫完同一晚，被動連結 numstat 改動撞 CI `core.quotepath` 把 production /latest 打崩（CJK 文章全漏日期）。這讓「處理進化」的風險計算改變——**對剛炸過的 build-content-dates 動手要極度保守，且任何 git 解析改動必須模擬 CI（強制 quotepath=true）本機驗過**。

**✅ 已 ship（commit 見下）**：

- **#4 content-dates anomaly guard**（最高 ROI、零風險）：build 時掃 (a) 單日 ≥120 篇 = batch-op 漏網洪峰 (b) 總 dated < 3000 = parser/env 回歸（如 quotepath 崩塌）。純 `console.warn`，零輸出變更。**這個 guard 同時抓得到本 session 兩次災難**（媒體洪峰 + quotepath 崩塌）——下一個污染源/回歸會自己在 build log 跳出來，不等人眼看 /latest。實測即刻抓到 4 個歷史洪峰日（5/04=2866 / 5/01=844 / 5/08 / 5/20）。
- **#1 派生（修正版）**：翻譯文 content-date 繼承 zh 源日期（**派生而非過濾**）。report 原寫的「COSMETIC 加 lang-sync 過濾」**經 re-examine 是危險的**——翻譯文的 commit 幾乎全是翻譯 commit，過濾掉它們會讓翻譯文無日期 → 外語 /latest 崩塌（跟 quotepath 同款失敗）。改用派生：翻譯繼承 zh freshness，安全（實測六語 /latest 全 30 不崩、CI-sim quotepath=true 通過）。

**🅿️ 重新評估後 defer（附理由）**：

- **翻譯洪峰完整修**（5/04=2866 等）：根因比 report 想的深——大量文章由 `[routine] twmd-rewrite` 寫成、被既有 `[routine]` COSMETIC 規則過濾掉 → 連 zh 源都沒日期 → 翻譯無從派生。完整解要動 `[routine]` 過濾器（風險高，會影響所有 routine commit 的 freshness 歸屬）+ COSMETIC-extend + seen-set 派生，需專門 session 設計 + CI 測。**anomaly guard (#4) 現在盯著它**，不會再隱形。
- **#3 footnote 完整性 plugin**（512 孤兒）：安全（獨立 plugin 不碰站體），但本 session 已超長 + 剛炸過，留下次乾淨 pickup。
- **#2 footnote-url cron / #5 顯式 lastContentEdit / #6 reverse-link 衍生 / #7 類別 gate / #8 worktree 隔離**：roadmap（中大型，#5/#6 是退役過濾器跑步機的真架構解，但都要前置工 + 測）。

**判斷總結**：剛炸過的檔只加「零風險 guard + 已驗證安全的派生」，把脆弱的洪峰完整修留給有餘裕的 session。guard 讓所有 deferred 的污染問題持續可見。守備修補的盡頭仍是 #5 顯式訊號——但那要在沒有 production 壓力的時候做。
