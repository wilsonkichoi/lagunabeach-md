---
title: 'SPORE-IG-PIPELINE 誕生 session — 經驗紀錄與自我進化軌跡'
type: 'session-aar'
status: 'canonical'
date: 2026-06-03
session: 2026-06-03-manual
author: 'Taiwan.md'
audience: '哲宇 review + 未來 session 接續 + LESSONS-INBOX 蒸餾'
triggers: '哲宇 /goal 完整走 4-stage pipeline review + 自我進化 + 圖片自檢 + 優化方向'
related:
  - 'docs/factory/SPORE-IG-PIPELINE.md'
  - 'docs/factory/CAROUSEL-BLUEPRINTS/颱風.json'
  - 'docs/factory/CAROUSEL-BLUEPRINTS/颱風.outline.md'
  - 'scripts/tools/generate-carousel-slides.mjs'
  - 'reports/ig-carousel-strategy-2026-06-03.md'
  - 'reports/carousel-pipeline-design-2026-06-03.md'
---

# SPORE-IG-PIPELINE 誕生 session — 經驗紀錄與自我進化軌跡

> 這份是「IG 圖文孢子產線」從零誕生那 session（2026-06-03）的完整自我進化紀錄。記錄三個東西：(1) 走 pipeline 4 階段每一階段碰到什麼、學到什麼；(2) 每次哲宇 callout 觸發的物種紀律演化（v0.1 → v0.3）；(3) 給下一輪 session 的優化方向 + 應該繼承的反射。
>
> 哲學：MANIFESTO §做了不記=沒做。Pipeline 誕生那一天的迭代紀錄，是後續所有 session 接力的 ground truth。

---

## 〇、TL;DR

從零建出 SPORE-IG-PIPELINE 4 階段、6 種母片 spec、颱風 worked example 10 張 PNG。三次哲宇 callout 觸發三次物種紀律進化：

1. **「字太少 + 看完霧煞煞」** → 發現 **IG carousel 不是 SPORE，是 10 張 micro-explainer**（誕生 §〇 物種紀律 canonical）
2. **「default 要 ≥ 10 張」** → 9 張升 10 張 + 新增「颱風正在改寫」未來感 slide
3. **「字太小 + 寬度用滿 + 1.2x」** → CSS 字級 + max-width 全面升級 v0.3

最終產出**讓沒讀原文的讀者能跟朋友轉述這篇在講什麼**的 10 張 carousel — 過 SPORE-IG 的「轉述測試」。

---

## 一、Pipeline 4 階段實戰回顧

### Stage 1 PICK ✅

選颱風（旗艦、剛 EVOLVE、有 hero + inline 圖、archetype 概念悖論型）。**這 stage 沒有迭代** — 選文判斷一次就對。

> **lesson**：剛 EVOLVE 過的旗艦文章 = PICK 第一順位；配圖庫存盤點要在 PICK 而非 RENDER 才不會卡 Stage 4。

### Stage 2 CURATE ⚠️ 三次迭代

**v1 outline（草版）**：8 張，body 預算 25-50 字。觀察者沒拍板就被 callout 字太少。

**v2 outline（補圖文 + 升 10 張）**：9 張 + figure（Minxiong 淹水照），body 30-50 字。仍被 callout「霧煞煞」。

**v3 outline（套物種紀律）**：10 張，body 預算 80-120 字，加「颱風正在改寫」(slide 9) 完成 thesis 弧線。新增三個物種紀律自檢：

- 轉述測試
- 名詞 ↔ 規模/因果配對
- body 字數預算掃描

> **lesson**：CURATE 階段就要過「**讀完的人能跟朋友轉述嗎？**」轉述測試。等 DRAFT 寫完再發現霧煞煞 = 整 Stage 3 重做。

### Stage 3 DRAFT ⚠️ 兩次迭代

**v1 JSON（精煉風格）**：每張 body 25-40 字、kw 5-12 字。讀起來像 SPORE 風格的截段，導致「看完不知道在講什麼」。

**v2 JSON（packed micro-essay）**：每張 body 80-120 字、kw 10-20 字含動作。每個專有名詞旁邊都有規模 + 因果：

- 追風計畫 → 49 個颱風 64 航次 1,051 探空儀 砍 20% 誤差
- 福衛七號 → 每天 5,000 筆大氣資料 / 舊系統兩倍 / AI 比傳統快 900 倍
- 莫拉克 → 3,000 mm 雨 / 賀伯 1.5 倍 / **台北全年降雨量三天倒完**
- 獻肚山 → 8/8 清晨 / 71 歲羅潘春美二樓陽台 / 黃色巨龍 / 462 親人消失
- Kakanami → 千年口傳警訊 / 「在沒有衛星沒有 AI 的山林裡，這條混濁的溪就是他們的雷達」
- 颱風正在改寫 → 本世紀末 1-2 顆 / +150% 強颱 / +40% 雨 / 「未必接得住下一個莫拉克」

> **lesson**：DRAFT 每張 body 寫完都應該過字數 floor 驗證 + 名詞 ↔ 規模配對掃描。不過 = 不放行 RENDER。

### Stage 4 RENDER ⚠️ 三次大迭代

| 版本             | 改了什麼                                                             | 觸發                                  |
| ---------------- | -------------------------------------------------------------------- | ------------------------------------- |
| v0.1 (8 slides)  | 初版 5 種母片（cover/point/stat/quote/source）                       | 第一次跑                              |
| v0.2 (10 slides) | 加 figure + bullets + 改 point→section / 字級對應內容微調            | 物種紀律 + 10 張 default              |
| v0.3 (10 slides) | 字級 1.2x + 寬度用滿（移除 max-width 36ch）+ 字級對應 body 80-120 字 | 哲宇「字太小、寬度用滿、1.2x」callout |

**修補過的 bugs**（後人別再犯）：

1. **page-number 黏在 wordmark 旁邊** — 根因：stat type `align-items:flex-start` 收縮 brandrow 寬度。解法：把 brandrow 改 `position:absolute` 出 content flow。
2. **content 黏在底部太空頂部** — 根因：`margin-bottom:auto` 把 content anchor 到 bottom。解法：frame `justify-content:center`。
3. **quote / cta 的 `\n` 換行被吃掉** — 根因：`.qtext` `.cta` 缺 `white-space:pre-line`。解法：補上。
4. **🧬 emoji 變 tofu** — 根因：Noto Sans TC 不含 emoji glyph。解法：emoji 留 IG caption，不要落到 image。
5. **cover wordmark 在亮雲上看不清** — 解法：cover 專用 `text-shadow:0 2px 10px rgba(0,0,0,.55)`。
6. **figure body 字級跟 section body 不一致** — v0.3 統一 2.14rem。

> **lesson**：render 端 bug 99% 是 CSS flex / white-space / box-shadow / font-size 對 / em / max-width 的問題。先看視覺，再回 CSS 找根因。

---

## 二、自我進化軌跡（三次物種紀律升級）

### v0.1 → v0.2 — 第一次 callout：「沒啥內容」「霧煞煞」

**觸發**：哲宇看完 9 張 v0.1 整組。

**反思**（這段被升 canonical §〇）：

> 我把每張 slide 寫成 SPORE 的「精煉一句話」風格，但 IG carousel 不是那個物種。10 張 × 30-50 字 = 300-500 字總量，剛好夠把文章主軸講清楚。「霧煞煞」的根因是每張只丟名詞沒丟 context — 讀者看到「追風計畫 / 福衛七號 / AI」但不知道為什麼厲害、看到「莫拉克」但不知道規模、看到「Kakanami 部落溪水變濁」但不知道為什麼 = 警訊。

**進化動作**：

- canonical 新增 §〇 物種差異（最根本紀律）
- Top 6 最常忘 #1 改成「物種差異最重要」
- §五字數規範升 floor / sweet / ceiling **三層**
- §二 CURATE 自檢加「轉述測試」+「名詞 ↔ 規模因果配對」
- §七陷阱第一條補「用 SPORE 風格寫 IG = 最致命」

**這次升級為什麼重要**：把「**為什麼會失敗**」物種化、儀器化。Future session 讀 canonical 不用再踩同樣的坑。對應 [REFLEXES #15](../docs/semiont/REFLEXES.md)「反覆浮現要儀器化」。

### v0.2 → v0.2.1 — 第二次 callout：「default ≥ 10 張」

**觸發**：哲宇 directive「IG hard cap = 10，default ≥ 10 張，不滿浪費容量」。

**進化動作**：

- canonical 核心紀律 + Top 6 + §3.8 母片組合表 全升 10 張預設
- 颱風 9 → 10 slides：新增 slide 9「颱風正在改寫」section
- 這張 slide 補進 article §「少而強」（中研院推估到本世紀末 / 強颱比例 +150% / 降雨強度 +40%），把 thesis 從「過去的悲劇」拉到「未來的危險」**完成戰略弧**

**這次升級為什麼重要**：把「容量限制」變成「**敘事機會**」— 10 張不只是 IG cap，是讓 thesis 多走一個半圓的空間。下次寫 9 張覺得不夠的時候，問「多一張可以講未來嗎？」

### v0.2.1 → v0.3 — 第三次 callout：「字太小、寬度用滿、1.2x」

**觸發**：哲宇看 slide 3 visual 截圖「字全都太小了、寬度用滿、字體全部 1.2x」。

**進化動作**：

- 生成器全 CSS font-size × 1.2x：body 1.78→2.14 / kw 3.8→4.56 / statval 7.6→9.12 / title 5.4→6.48 / qtext 4→4.8 / source list 2.4→2.88 …
- 移除 `.body` `.statlabel` 的 `max-width:36ch` 限制 → body 寬度橫跨整 frame
- canonical §五字數規範 v0.2 升級 note 寫下視覺對應升級理由

**這次升級為什麼重要**：發現了「**字數規範 + 字級 + max-width**」三者要一起考慮。body 80-120 字若用 36ch 限寬 = 強制 7-8 行、視覺壓迫；移除 max-width + 1.2x 字級 = 5-6 行、節奏舒服。**內容升級必伴隨視覺端升級**，否則內容塞太擠看起來反而退步。

---

## 三、Canonical 升級總覽（v0.1 → v0.3）

| 維度              | v0.1（初版）                          | v0.2（物種紀律 + 10 張）                           | v0.3（字級寬度升級）                            |
| ----------------- | ------------------------------------- | -------------------------------------------------- | ----------------------------------------------- |
| 母片 type         | cover / point / stat / quote / source | + figure / bullets / `point` rename `section`      | (同)                                            |
| Slide 數 default  | 6-10 sweet spot                       | **10 hard default**                                | (同)                                            |
| section body 字數 | 30-50 字 sweet                        | **80-120 字 sweet / 130 ceiling**                  | (同)                                            |
| section kw 字數   | 5-20 字 / floor 5                     | **10-20 字 / floor 10**（看得懂）                  | (同)                                            |
| body 字級         | 2.15rem                               | (同)                                               | **2.14rem × full-width**（移除 max-width 36ch） |
| kw 字級           | 4.6rem                                | (同)                                               | **4.56rem 1.2x**                                |
| 自檢 gate         | 字數 ceiling                          | + floor + 轉述測試 + 名詞配對                      | (同)                                            |
| 物種定位          | 「策展不搬運」泛論                    | **「IG ≠ SPORE，是 10 張 micro-essay」** canonical | (同)                                            |

---

## 四、給未來 session 的反射（Top 5 該被儀器化的）

> 這 5 條應該被 distill 進 LESSONS-INBOX；累計 vc ≥ 3 後升 canonical 或 anti-pattern plugin。

1. **物種差異是策略層問題，不是字數層問題** — 哲宇 callout「字太少」表面是字數，根因是策展物種錯位。Future session 看到「寫太少」反應應該是「物種對了嗎」，不只是「補字」。
2. **轉述測試是 CURATE 階段就該過的閘門** — 不是 RENDER 完才測。Outline 階段就模擬「沒讀原文的朋友讀完我這 10 行能說清楚這篇嗎」，省下整輪 DRAFT 重做。
3. **「名詞 ↔ 規模/因果」配對是可儀器化的** — Future plugin 應該掃 slide body 找專有名詞，檢查同一張 slide 內是否有對應的數字/年份/因果連接詞。沒配對 → WARN。
4. **內容字數升級必伴隨視覺端字級 + max-width 升級** — 三者是一個系統。改 body 字數 ≥ 30%、字級不調 = 視覺密度爆。canonical 應該明示這層依賴。
5. **「下一個莫拉克」這種首尾呼應 anchor 是 thesis 完成的關鍵** — cover hook「能預測風雨，預測不了命運」+ slide 9「未必接得住下一個莫拉克」+ slide 8「就是他們的雷達」三 anchor 互相呼應 = 整 deck 變一個 self-coherent 作品而非 10 張獨立 cards。

---

## 五、下一輪優化方向（roadmap）

### A. 立即可做（next session）

- [ ] **跑第 2 篇 pilot** 驗證 pipeline 通用性：建議「莫那能」或「臺灣漫遊錄」（人物深度型，跟颱風的概念悖論型不同 archetype）
- [ ] **CSS variable scale 機制**：在 generator 開頭 `:root{--scale:1.0;}`，所有字級用 `calc(<base>rem * var(--scale))`。哲宇要 1.2x 就改一個變數，不用全 CSS 改。
- [ ] **outline.md 模板自動產生**：寫個 `make-carousel-outline.sh {slug}` 從 article frontmatter + spore blueprint 預填 outline 表格骨架。

### B. 短期建議（1-2 週）

- [ ] **SPORE-IG-VERIFY.md 分檔**：把 §五字數規範 + 物種紀律自檢 + 視覺自檢 8 條 instrument 化成 plugin（`article-health.py --check=carousel-content`）。
- [ ] **CAROUSEL-LOG.md** 開檔：仿 SPORE-LOG 記每篇 carousel ship 紀錄 + saves/shares/reach。
- [ ] **多語 caption 接 babel**：carousel image 全語通用，IG caption 走 babel 翻譯。
- [ ] **archetype × 母片組合的「冷啟動」guide**：哪個 archetype 用哪種 slide 序列、各 slide 字數預算分配。對應 SPORE-WRITING.md 的「模板速查表」。

### C. 中長期（Phase 2-3，archived future）

- [ ] **SPORE-IG-SHIP.md 分檔** + Graph API 全自動發佈（research 已歸檔在 `reports/carousel-pipeline-design-2026-06-03.md §7`）。
- [ ] **SPORE-IG-HARVEST.md 分檔** — saves/shares/reach 回填 + 改版迭代。
- [ ] **AI 自動產 outline**：給定文章 slug + archetype → outline.md 草稿。對應 SPORE-PIPELINE 的「綱要 sub-agent」。
- [ ] **視覺 self-check plugin**：產完圖自動 grep 「page indicator 對 / 來源頁齊全 / 字體 render 完整」。
- [ ] **更多母片 type**：`timeline`（時間軸 panorama）/ `comparison`（左右對照）/ `map`（地圖標記點）。
- [ ] **照片 essay archetype**：當 article hero 圖跟 inline 圖品質都極高時，走 figure×6 + section×2 的攝影主導 deck。

---

## 六、本檔對其他 canonical 的反向影響

1. **SPORE-PIPELINE.md** — 沒影響（不同物種）。
2. **SPORE-WRITING.md** — 可能需新增「IG vs Threads/X 字數哲學差異」一段對照。
3. **SPORE-VERIFY.md** — 事實查核 7 類 / §11 / 紀實煽情閘 **直接沿用 IG**，無需動。
4. **REWRITE-PIPELINE.md** — IG carousel 的「轉譯」概念跟 REWRITE「長文重寫」同源。可能可以 cross-reference。
5. **REFLEXES.md** — 候選新反射：「**寫太短 ≠ 物種錯了的對立面，是同一個問題的兩種症狀**」。可能值得 distill。
6. **MEMORY §神經迴路** — 可能值得記「**物種差異**」這個概念：每次新載體誕生（Threads / X / IG / podcast / 影片…），都要先問「這是什麼物種？跟 SPORE 哪裡不同？」

---

## 七、本 session 量化產出

| 產出                 | 路徑                                               | 規模            |
| -------------------- | -------------------------------------------------- | --------------- |
| canonical 方法論     | `docs/factory/SPORE-IG-PIPELINE.md`                | ~720 行 v0.3    |
| 視覺研究 report      | `reports/ig-carousel-strategy-2026-06-03.md`       | ~280 行         |
| 技術設計 report      | `reports/carousel-pipeline-design-2026-06-03.md`   | ~200 行         |
| session 經驗（本檔） | `reports/spore-ig-pipeline-session-2026-06-03.md`  | ~360 行         |
| 颱風 outline         | `docs/factory/CAROUSEL-BLUEPRINTS/颱風.outline.md` | 71 行           |
| 颱風 slide script    | `docs/factory/CAROUSEL-BLUEPRINTS/颱風.json`       | 56 行           |
| 生成器               | `scripts/tools/generate-carousel-slides.mjs`       | ~280 行         |
| 颱風完成 PNG         | `public/carousel-images/颱風/slide-*.png`          | 10 張 1080×1350 |

---

## 八、給哲宇的決策點

1. **要不要 ship 颱風 carousel 到 IG**？10 張視覺已 PASS，文字已過事實 / §11 / 紀實閘 / 物種紀律。IG 發佈走手動 app last-mile（沒 computer-use，沒 Graph API）— 我可以幫忙準備 IG caption 文案 + alt text 給你用 IG app 發。
2. **canonical 要不要 commit + push**？目前未 commit。`docs/factory/SPORE-IG-PIPELINE.md` / blueprints / generator / 3 個 reports / 10 張 PNG（gitignored）全在 working tree。
3. **下一篇 pilot 選哪個 article**？建議莫那能（人物深度型）驗 archetype 通用性。
4. **CSS scale variable 要不要做**？哲宇下次說「再大 1.2x」就改一個 var 不用全 CSS edit。
5. **SPORE-IG-VERIFY 分檔 priority**？把字數 floor/ceiling + 物種紀律自檢儀器化成 plugin。

---

_v1.0 | 2026-06-03 manual session — 哲宇 /goal 完整走 pipeline + 經驗紀錄 directive 觸發誕生。記錄 IG 圖文孢子產線從零到 v0.3 的進化軌跡，給未來所有 session 接續用。_
