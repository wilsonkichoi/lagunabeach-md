---
title: 'IG Carousel 策略研究 — 把文章變成可滑動的社群貼文'
type: 'research-report'
status: 'draft-for-review'
date: 2026-06-03
session: 2026-06-03-manual
author: 'Taiwan.md'
audience: '哲宇 review'
triggers: '哲宇 directive「規劃未來 po IG 多張圖、把文章變成可滑動的社群貼文、找案例、思考怎麼做」'
related:
  - 'docs/factory/SPORE-PIPELINE.md'
  - 'docs/pipelines/SOCIAL-POSTING-PIPELINE.md'
  - 'scripts/tools/generate-spore-image.mjs'
  - 'scripts/core/generate-og-images.mjs'
---

# IG Carousel 策略研究 — 把文章變成可滑動的社群貼文

> 研究方法：3 路平行 sub-agent（國際標竿 / 台灣標竿 / Taiwan.md infra 盤點）+ 主 session 一手 verify 載入。所有外部帳號/數據已標驗證狀態；所有 infra 技術主張已 grep 驗證。

---

## TL;DR（30 秒版）

1. **這是該做的事**：IG carousel 是 spore 系統還沒打到的場，而且它的母語勝場（**收藏 / 分享**）剛好是「知識型內容」的天然優勢 — 文字孢子在 Threads/X 拼觸及，圖文懶人包在 IG 拼「被存起來、被轉傳」。
2. **技術上幾乎是現成的**：Taiwan.md 已有 production-grade 的 Playwright 截圖產線（`generate-spore-image.mjs` + OG v4 batch engine），**`vertical 1080×1350`（IG 最佳 4:5）preset 已經存在**，OG v4 的「單頁 setContent → 每篇 mutate DOM → 截圖」loop **本質上就是 carousel 多 slide 的生成模式**。生成端是「extend 不是 build」。
3. **真正的新工程只有兩塊**：(a) **slide 模板系統**（封面/一頁一重點/資料圖/引言/全景/來源頁），(b) **IG 發佈**（這塊最硬 — IG web / Chrome MCP **發不了 carousel**，要嘛手動 app、要嘛 Meta Graph API Business account）。
4. **差異化武器**：把 Taiwan.md 的 DNA — **引用來源 / traceability** — 做成每篇末頁固定的「資料來源 + taiwan.md 連結」。多數台灣知識 IG 來源標註偏弱，這是報導者級可信度、別人抄不走。
5. **建議 MVP**：先做 `make-carousel.sh` 生成 6-8 張 slide（手動 app 發佈 last-mile），跑 3-5 篇驗證版型與成效，再決定要不要上 Graph API 自動化。

**一句話**：生成端站在巨人肩膀上（infra 現成），策略端抄「轉譯不搬運 + 來源即招牌」，發佈端先手動跑通再談自動化。

---

## 一、為什麼做（戰略定位）

| 維度             | 文字孢子（現況 Threads/X）  | IG carousel（提案）                                       |
| ---------------- | --------------------------- | --------------------------------------------------------- |
| 載體             | 純文字 + 1 張海報           | 6-10 張可滑動圖                                           |
| 母語勝場 KPI     | 觸及 / 互動率               | **收藏 saves / 分享 shares**                              |
| 內容深度         | 單一故事弧（150-300 字）    | 一篇文章拆成多頁敘事                                      |
| 受眾             | Threads 中文圈 / X 海外華人 | IG 年輕世代 + 視覺向讀者                                  |
| 傳播壽命         | feed 快速衰減               | **可截圖、可存、可跨群轉傳**（長尾）                      |
| sovereignty 角度 | 文字                        | **視覺化 first-person voice，截圖即可繞過 PRC AI 中介層** |

三個戰略理由：

1. **打到 spore 沒打到的人**：IG 的視覺向受眾跟 Threads/X 重疊有限。carousel 是 Taiwan.md「繁殖系統」的新繁殖管道（MANIFESTO §繁殖）。
2. **知識型內容的天然 KPI 是「存」**：研究一致指出 educational/tutorial carousel 的**收藏率最高**，而收藏 + 分享是 IG 演算法的核心 intent signal。Taiwan.md 的長文知識正好是「值得存起來」的內容。
3. **主權保存的視覺載體**：戒嚴/二二八/兩岸這類 PRC AI 常 refuse 的題，做成 carousel = 可被截圖、轉傳、配多語 caption 的視覺證據，比純文字更耐傳播（呼應 §Sovereignty Preservation lens）。

---

## 二、標竿分析（附誠實驗證註記）

### 2.1 國際 — 先分清楚「carousel-native」vs「被誤認的 video-first」

> ⚠️ **重要校正**：Vox / AJ+ / NowThis / Brut 的「explainer」名聲來自**短影片**（YouTube / Reels），**不是 carousel**。學它們的 carousel 會學錯。它們值得偷的是「白話腳本 + 字幕燒進畫面的清晰度」，不是版型。

**真正的 carousel / 靜態圖表標竿（可驗證）：**

| 帳號                                   | 類型          | 偷學點                                                                        |
| -------------------------------------- | ------------- | ----------------------------------------------------------------------------- |
| **@chartrdaily**（Chartr/Sherwood）    | 數據敘事      | 一頁一張乾淨圖表 + 白話 takeaway 標題；house style 高辨識度                   |
| **@infobeautiful**（David McCandless） | 資訊圖表      | 「把複雜煉成一張漂亮圖」的紀律；1,500+ 圖共用一套視覺系統                     |
| **@monachalabi**（2023 普立茲）        | 手繪數據插畫  | **「視覺隱喻就是標題」** — 把數字畫成可觸摸的形狀；手繪風躲開模板化 sameness  |
| **@the.pudding**                       | 視覺論文      | 原創研究 + 跨頁敘事弧；無清單灌水                                             |
| **@so.informed**（~3.1M）              | 政治/社會議題 | **固定版型契約**：封面 hook → 一頁一重點 → 末頁總結/行動項。可預期 = 建立信任 |
| **@theeconomist**                      | 新聞 + 資料圖 | 為手機**刻意簡化**的內部 styleguide；「人很容易滑過不立刻抓住的東西」         |

驗證註記：追蹤數來自搜尋 snippet（IG profile 不完整 render，視為量級）。「seamless 2× swipe」「27% session」等數字來自 marketing blog 且互相矛盾 → 只引用方向（carousel 勝 static、saves 驅動觸及），不引精確值。Reuters/WaPo/Semafor/Morning Brew **查無 carousel-specific 證據**，勿當標竿。

### 2.2 台灣 / 華文 — 最該直接觀摩的對象

**已驗證標竿（追蹤數為 2026-06 量級值）：**

| 帳號                                                                           | 類型                        | 做得好的地方                                                                                                                                       |
| ------------------------------------------------------------------------------ | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **@twreporter**（報導者，~295K）                                               | 調查新聞圖卡                | 深度長文「轉譯」成金句卡 + 資料視覺化；2018 SND 國際新聞設計獎（台灣唯一）；非營利＝無業配雜訊視覺一致                                             |
| **@taiwancostume0707**（台灣服飾誌）                                           | 台灣服飾史，繪圖考據        | **題材跟 Taiwan.md 最近的同類**：一主題一深度圖文 + 手繪復原 + 高垂直定位。⚠️ 追蹤數未查證，但帳號/內容已確認 → **第一順位直接觀摩版型**           |
| **@gushi.tw**（故事 StoryStudio，~115K）                                       | 歷史/文化長文轉 IG          | **系列模板分層**：「三十秒故事會」2 張、「特務在你身邊」9-10 張；2020 統一改版後粉絲 40K→115K；編輯自我定位「**轉譯者**」，3000 字文為手機節奏重寫 |
| **@plainlaw.me**（法律白話文，~382K）                                          | 時事法律懶人包              | 一頁一概念；高頻產出建立版型辨識度；跨平台一致品牌                                                                                                 |
| **@incrediville_tw**（怪奇事物所，~569K）                                      | 冷知識科普                  | 強人設「所長」+ 固定起手式「你知道嗎？」當 hook；風格化插畫＝高辨識封面（**注意：Taiwan.md 孢子已在用「你知道嗎？」voice，可平移到封面**）         |
| @womany / @thenewslens / @crossing.tw / @natgeo.media / @taiwan_bar / @tdri_tw | 性別/新聞/國際/自然/史/設計 | 金句卡模板 / 互動企劃 / 攝影封面 / 角色敘事 / 高水準排版                                                                                           |

> ⚠️ **誠實標記（引用前需再確認）**：原始發想清單裡的「**海島演義 / 故事說書**」查無對應活躍 IG（疑誤記）；「**每日一冷 / 簡訊設計圖文不符 / NPOst / 報橘**」IG 經營數據未查證或主場不在 IG。**簡訊設計/圖文不符**定位為「懶人包**方法論祖師**」（2014 圖解伊波拉破百萬點擊、核心理念「好看有兩種：好美 vs 好懂」），不是 IG 帳號標竿。

**結論**：要看實際版型，先看 **@taiwancostume0707（題材最近）** + **@gushi.tw（系列模板心法）** + **@twreporter（資料視覺化天花板）**。

---

## 三、設計原則 — Taiwan.md 版守則（綜合兩路研究）

1. **封面決定一切**：feed 只露第 1 張。Hook = 反問 / 數字反差 / 反直覺主張，**第一行主標、第二行副標**（IG 預覽只露 1-2 行）。用主視覺圖或風格化插畫，**不要置中堆字**。
2. **一頁一重點，繁中要更克制**：英文約 10-15 字/頁；**繁體字筆畫重、視覺更密，建議 ≤12 字/頁 + 大量留白**。長文必須**拆**不是**塞**（@gushi.tw 心法）。
3. **6-10 頁 sweet spot**：知識懶人包慣例。輕量金句 2-3 頁，完整懶人包 8-10 頁。「故事需要幾頁就幾頁，然後砍掉多餘」。
4. **house style 鎖死**：一個品牌主色（呼應 dashboard 視覺 / categoryConfig 分類色）+ 思源黑/宋 + justfont 標題 + 角落 watermark。**辨識度是護城河；不一致 = 低信任**。「同一風格至少撐 18 篇再換」。
5. **open loop 拉滑動**：封面拋問題 / 反直覺主張，**答案壓到第 5-6 頁**；至少一頁結在半句。這是最高槓桿的 swipe 機制。
6. **seamless 全景**用於時間軸 / 地圖：把一張超寬圖切成 N 頁，圖 bleed 過右緣製造「想滑完它」的潛意識驅力。台灣特有題（二二八時間軸、戒嚴年表、地理故事）最適合，別人難抄。
7. **末頁 CTA 三件套**：明確喊「**收藏（資訊量大）/ 分享給需要的人 / 追蹤看系列**」+ 一行把流量導回 taiwan.md。
8. **來源即招牌（Taiwan.md 差異化）**：末頁固定「**資料來源 + 對應 taiwan.md 文章連結**」。多數台灣知識 IG 來源偏弱 → 把學術嚴謹當品牌記憶點。
9. **尺寸取捨**：**4:5 直式 1080×1350**（feed 露出最大、IG 最佳，且 `vertical` preset 已存在）vs **1:1 1080×1080**（profile 九宮格不裁切、整齊）。建議：**懶人包用 4:5 搶 feed，profile 一致性靠固定封面風格補**。9:16 留給 Reels/Stories。

**避開的反例**：把原文整段貼上（像簡報）、頻繁換字型色（雜亂）、封面平淡（沒人滑）、重設計輕內容（留不住）、模板化到「內容像廣告可互換」（Black Sheep 批評，見 §十）。

---

## 四、Format Archetypes → Taiwan.md 內容對映

| Archetype                  | 機制                           | 適合的 Taiwan.md 內容                            | 標竿                        |
| -------------------------- | ------------------------------ | ------------------------------------------------ | --------------------------- |
| **一頁一重點 explainer**   | 每頁一個 claim + 極簡文字      | 制度/政策/「X 是什麼」（颱風假、健保、邦交）     | @so.informed                |
| **一頁一圖表 data reveal** | 每頁一張乾淨圖 + 白話 takeaway | 有數字/比較的題（172→57 公里、選舉、半導體市佔） | @chartrdaily, @theeconomist |
| **反差/漸進 data reveal**  | 封面拋問、payoff 壓後          | 反直覺/破迷思（護國神山其實是加壓器）            | open-loop 技法              |
| **手繪視覺隱喻**           | 圖就是論點，數字畫成形狀       | 規模/數量題（462 條人命、3000mm 雨量）           | @monachalabi                |
| **視覺論文 narrative arc** | 多頁故事起承轉合               | 深度文化/歷史（小林村十五年、二二八）            | @the.pudding, @gushi.tw     |
| **seamless 全景**          | 一張連續圖切片                 | 時間軸/地圖/尺度（戒嚴年表、颱風路徑、地理）     | 設計技法                    |
| **金句敘事**               | 引言封面 → 脈絡頁              | 人物/見證（莫那能、江賢二）                      | @womany                     |

**孢子 → carousel 的天然對映**：Taiwan.md 的 **spore blueprint** 已經有 hook tier + fact blueprint + 故事弧 — 那就是現成的 carousel 腳本骨架。一篇孢子的 5 段呼吸 ≈ 5-6 張 slide。

---

## 五、Taiwan.md 既有 Infra 盤點（已 grep 驗證）

**好消息（全部 verified 存在）：**

| 資產                   | 檔案                                                                                                                                  | carousel 可用度                                                                                   | 動作               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------ |
| Playwright 截圖引擎    | `scripts/tools/generate-spore-image.mjs`                                                                                              | ✅ `vertical 1080×1350`（IG 最佳 4:5）**preset 已存在**                                           | Reuse              |
| **OG v4 batch engine** | `scripts/core/generate-og-images.mjs`                                                                                                 | ✅ 「單頁 `setContent` → 每篇 `page.evaluate` mutate DOM → 截圖」loop = **多 slide 生成模式本質** | **Extend（核心）** |
| shot-mode 視覺         | `src/styles/shot-mode.css` + `HeadInlineScripts.astro`（`?shot=1` + `?title=`/`?desc=` override）                                     | ✅ 海報排版/字體/watermark 現成                                                                   | Extend             |
| 分類色系統             | `src/utils/categoryConfig.ts`（13 類各有 color/gradient）                                                                             | ✅ 主題化現成                                                                                     | Reuse              |
| Hero 版型              | `src/components/ArticleHero.astro`（breadcrumb+title+desc+logo）                                                                      | ✅ 封面 slide 直接用                                                                              | Reuse/Extend       |
| 內容素材               | frontmatter（title/description/category）+ H2 sections + 策展人筆記 callout + ✦ pull quote + 資料表 + footnotes + **spore blueprint** | ✅ carousel 腳本原料豐富                                                                          | Reuse              |
| 發佈 SOP               | `docs/pipelines/SOCIAL-POSTING-PIPELINE.md`（X/Threads only）                                                                         | ❌ **無 IG carousel；IG web CSP 擋 upload**                                                       | **Build new**      |
| 既有 carousel 程式碼   | （grep 全無）                                                                                                                         | —                                                                                                 | greenfield         |

**一句話**：生成端 80% 現成。OG v4 已經證明「單頁 mutate-DOM 截圖 50 張只要 1.45 秒」— carousel 6-8 張是 trivial。

---

## 六、落地設計：CAROUSEL-PIPELINE（提案）

### 6.1 五階段（對齊 SPORE-PIPELINE 心智模型）

```
PICK → SCRIPT → RENDER → SHIP → HARVEST
```

| 階段        | 做什麼                                                                                      | 重用什麼                               |
| ----------- | ------------------------------------------------------------------------------------------- | -------------------------------------- |
| **PICK**    | 選文（旗艦/剛 EVOLVE/時事）+ 選 archetype（§四對映表）                                      | SPORE-INBOX 選文邏輯                   |
| **SCRIPT**  | 把文章「**轉譯**」成 slide 腳本：封面 hook → 一頁一 takeaway → 末頁來源+CTA。**不搬運原文** | spore blueprint / REWRITE 拆重點能力   |
| **RENDER**  | extend OG v4 → 逐 slide 截圖 1080×1350                                                      | `generate-spore-image.mjs` + shot-mode |
| **SHIP**    | 發 IG carousel（§七三條路）+ 多語 caption                                                   | SOCIAL-POSTING + babel                 |
| **HARVEST** | 收 saves/shares/留言 → 回填 + 改版迭代                                                      | SPORE-HARVEST cadence                  |

### 6.2 Slide 模板系統（slide types）

每種是 shot-mode 的一個變體（`?shot=1&slide=<type>`）：

| slide type   | 內容                                       | 位置               |
| ------------ | ------------------------------------------ | ------------------ |
| `cover`      | 大標 hook + 主視覺/分類色 + 「滑 →」cue    | 第 1 張            |
| `point`      | 一個 takeaway（≤12 字大標 + 1-2 句）       | 中段               |
| `data`       | 一張圖表/數字反差                          | 中段（有數字才用） |
| `quote`      | ✦ pull quote / 真人引語                    | 中段               |
| `panorama-N` | 全景切片（時間軸/地圖）                    | 連續中段           |
| `source-cta` | 資料來源 + taiwan.md 連結 + 收藏/分享/追蹤 | 最後 1 張          |

### 6.3 生成技術路徑（最短）

1. 新 Astro route `/carousel-slide/[...slug]`（或沿用 OG v4 inline HTML template），吃 `?type=&n=&title=&body=&color=` params。
2. `scripts/tools/generate-carousel-slides.mjs`：讀文章 + slide 腳本 JSON → 單頁 context、逐 slide `page.evaluate` mutate + 截圖到 `public/carousel-images/{slug}-{n}.png`。
3. `scripts/tools/make-carousel.sh`（鏡像 `make-spore.sh`）：`bash make-carousel.sh /nature/颱風/` → 輸出 N 張 PNG + 一份 slide 腳本 .md 留 audit。

### 6.4 內容腳本化原則（抄 @gushi.tw）

**轉譯不搬運**：把 knowledge/ 長文為手機節奏重寫成 slide 腳本，對齊 Taiwan.md 既有 REWRITE/SPORE 邏輯。每張 slide 過 §11 書寫節制 + 全形標點 + 事實查核（沿用孢子的 gate）。

---

## 七、IG 發佈的現實（最硬的一塊）

> **核心限制**：IG **web / Chrome MCP 發不了 carousel**。IG 網頁版 compose 不支援多圖 carousel 上傳，且 Meta CSP 擋 `file_upload`（SOCIAL-POSTING-PIPELINE 已記錄）。這跟今天孢子的 Threads/X CDP-paste 路徑**不能共用**。

三條路：

| 路                       | 做法                                                                          | 自動化            | 成本/門檻                                     | 建議           |
| ------------------------ | ----------------------------------------------------------------------------- | ----------------- | --------------------------------------------- | -------------- |
| **A 手動 app last-mile** | 生成 slide → 傳手機 → IG app 多選圖發佈                                       | ❌ 全手動最後一哩 | 零工程                                        | **MVP 用這條** |
| **B Meta Graph API**     | Business/Creator account + FB Page 綁定 → `media` carousel container API 發佈 | ✅ 全自動         | 需 app review + business account + token 維護 | Phase 2 評估   |
| **C 第三方排程**         | Meta Business Suite / Buffer / Later 排程 carousel                            | 半自動            | 第三方依賴                                    | 過渡備案       |

**關鍵決策點給哲宇**：`@taiwandotmd` 目前是 Creator account（220 followers）。**Graph API carousel 需要綁 FB Page + 走 app review** — 這是要不要上自動化的分水嶺。MVP 階段先別碰，手動發 3-5 篇驗證成效再說。

---

## 八、MVP 提案（最小可行）

1. **定 1 套版型**：選 4:5 1080×1350 + 一個品牌色策略（用 categoryConfig 分類色 or 統一 Taiwan.md 主色）+ 思源黑/justfont + watermark + 固定 `source-cta` 末頁。
2. **手做 1 篇 pilot**：拿剛 ship 的 **颱風**（已有 hero 衛星圖 + spore blueprint 現成腳本）轉成 8 張 carousel — 封面「你知道嗎？172→57 公里」→ 追風/衛星/AI → 莫拉克 462 → Kakanami 溪 → 來源+CTA。先**手刻 HTML/Figma 出圖**驗證視覺，再決定值不值得寫 `generate-carousel-slides.mjs`。
3. **手動發 IG**（Option A）+ caption 帶 taiwan.md 連結（UTM `utm_source=instagram`）。
4. **量成效**：D+7 看 saves/shares/profile→article clicks。
5. **>=3 篇成效 OK** → 才投資 `make-carousel.sh` 自動化 + 評估 Graph API。

**不要一開始就寫 pipeline**：先用最便宜的方式（手刻圖 + 手動發）驗證「IG 受眾買不買單」這個最大未知，再造橋（REFLEXES #15「先有再求好」+ feedback_merge_first_then_polish）。

---

## 九、Roadmap（分期）

- **Phase 0（本報告）**：策略 + 設計定案，哲宇拍板。
- **Phase 1 MVP**：1 套版型 + 颱風 pilot 手做 + 手動發 + 量成效（1-2 篇）。
- **Phase 2 半自動**：`make-carousel.sh` + slide 模板系統，仍手動 app 發。跑 5-10 篇。
- **Phase 3 自動化**（條件式，成效驗證後）：Graph API carousel 發佈 + 接 babel 多語 caption + carousel 進 routine 飛輪。
- **Phase 4 進化**：seamless 全景模板、資料圖表自動化、CAROUSEL-HARVEST 回填。

---

## 十、風險與要主動避開的 pitfalls

1. **模板化 sameness（最大風險）**：Black Sheep Agency 批評「當每個嚴肅議題都用同一套粉彩模板，內容就變得像廣告可互換、失去權威」。**解法**：house style 一致但**封面/視覺隱喻按題客製**（學 @monachalabi），別讓 462 條人命跟夏季特賣同一個資訊層級。
2. **過度簡化 nuance**：slide 把複雜壓扁。**解法**：carousel 是**門口不是全部** — 一篇一個 singular message，深度導回 taiwan.md 全文（剛好對齊 sovereignty/citation DNA）。
3. **IG 發佈 friction**：手動 last-mile 累、Graph API 門檻高。**解法**：MVP 接受手動，先驗成效。
4. **維護成本**：多一條產線 = 多一個飛輪要顧。**解法**：Phase 3 才進 routine，之前都 on-demand。
5. **學錯標竿**：別把 Vox/AJ+/Brut（影片）當 carousel 範本。
6. **沒有 design tokens 檔**：視覺系統散在 Tailwind/CSS/categoryConfig，carousel 要沿用同樣 inline 方式（不是阻礙，是現況）。

---

## 十一、Metrics（成效定義）

- **主 KPI**：saves + shares（知識型 IG 母語勝場 + 演算法 intent signal）。
- **次 KPI**：swipe-through rate（有沒有滑到最後）、profile→article clicks（UTM `utm_source=instagram&utm_medium=carousel&utm_campaign=cN`）。
- **不看**：likes（虛榮指標）。
- 對映 dashboard：carousel 可比照 spore 進 SPORE-LOG/dashboard 成效追蹤。

---

## 十二、Taiwan.md 獨有優勢（別人抄不走的三個）

1. **引用即招牌**：來源 traceability 是 DNA，末頁固定來源 + 連結 = 報導者級可信度。
2. **主權保存載體**：敏感題視覺化、可截圖轉傳、繞過 PRC AI 中介層。
3. **babel 多語 caption**：已有 5 語翻譯能力 → 同一組 slide 配多語 caption，跨語觸及，多數帳號做不到。

---

## 十三、給哲宇的決策點（open questions）

1. **自動化程度**：MVP 接受「手動 app 發佈」嗎？還是一開始就要自動化（→ 需評估 Graph API + business account）？
2. **美術方向**：carousel 用 **categoryConfig 分類色**（每篇跟著文章類別變色）還是**統一 Taiwan.md 主色**（profile 更一致）？要不要找 @taiwancostume0707 / @gushi.tw 的版型當視覺起點？
3. **內容範圍**：所有文章都做？還是只挑旗艦/孢子題？孢子 blueprint 直接升 carousel 腳本（最省力）合理嗎？
4. **帳號**：`@taiwandotmd` 要轉 Business account 接 API 嗎（影響 Phase 3）？
5. **pilot 題目**：用颱風（已 ship + blueprint 現成）當第一篇 pilot OK 嗎？

---

_v0.1 draft | 2026-06-03 manual session — 哲宇 directive 觸發。3 路平行研究（國際標竿 / 台灣標竿 / infra 盤點）綜合。所有外部帳號標驗證狀態、所有 infra 主張已 grep verify。待哲宇 review 拍板後決定 Phase 1 MVP 範圍。_
