---
title: '四頁策展深度審視 — 首頁 / 關於 / 資源 / 參與'
description: '2026-06-10 哲宇 directive：深度研究四個門面頁的視覺與策展現狀，產出優化提案（assessment，未實作）'
type: 'report'
status: 'proposal'
date: 2026-06-10
session: '2026-06-10-curation-audit'
related:
  - 'docs/editorial/HUB-EDITORIAL.md'
  - 'reports/semiont-full-audit-2026-06-10.md'
  - 'docs/semiont/LONGINGS.md'
---

# 四頁策展深度審視 — 首頁 / 關於 / 資源 / 參與

> 觸發：哲宇「幫我深度研究跟思考首頁/關於/參考這 3 個頁面，完整的看過所有頁面跟他們的視覺」，中途補「我要參與頁面也一起看」。
> 方法：production（今日 13:08 部署解封後）桌面 1440px 全長截圖逐段細讀 + 行動 375px 抽查 + 深色模式探針 + 四個 template 與 i18n 源碼 + GA 28 天數據。dev preview 視窗被平行 opendata session 佔用，改用獨立 headless browser，互不干擾。
> 性質：**assessment + 提案**。本報告不動任何頁面，所有建議等哲宇挑。

---

## 一、數據基準：四頁的角色與真實流量

GA 2026-05-13 → 06-10（28 天，全站 48,078 views）：

| 頁面          | 28 天 views         | 全站排名 | 頁高（1440px 桌面） | 它的工作          |
| ------------- | ------------------- | -------- | ------------------- | ----------------- |
| `/` 首頁      | 8,322（17.3%）      | #1       | 20,506px ≈ 15 屏    | 門面 + 漏斗第一關 |
| `/about`      | 741                 | #6       | 22,629px ≈ 17 屏    | 身份敘事          |
| `/resources`  | < 307（前 20 之外） | —        | 14,001px ≈ 10 屏    | 外部資源圖書室    |
| `/contribute` | < 307（前 20 之外） | —        | 13,116px ≈ 10 屏    | 轉化端點          |

兩個對照組：`/map` 461、`/graph` 314、`/dashboard` 307。功能頁全贏過 resources 和 contribute。

LONGINGS 的首頁渴望（hook 強到 10 秒內說「這不一樣」、參與 ≥ 40 秒）：4/6 基線 19 秒，6/01 里程碑記錄 +104% engagement，已逼近目標。首頁 wave 2 埋了 `section_view` + `scroll_depth` + `time_milestone` 事件，**改版前可以直接拉 section 漏斗定基線**，這是四頁裡唯一已儀器化的。

---

## 二、跨頁共同發現（六條）

### 1. 「長卷策展」是簽名，但四頁都在用同一招

四頁合計 70,252px。長卷在首頁是資產（四展廳是別人沒有的東西），在 about 是負債（最有靈魂的「Taiwan.md 是活的」段落被推到 12.5K 深，90% 訪客按 scroll depth 規律看不到）。每頁都想當完整的展覽，結果是身份敘事在一次訪客旅程裡出現 5+ 次：首頁 FeatureCards、首頁 OrganismPreview、首頁 LanguageStatement、about 全頁、contribute 中段 dark 區。

### 2. 手維指標漂移 — 「指標 over 複寫」該走進這兩頁

- `about.stats.contributors.number: '57+'` 硬編碼 ×6 語言，真值 63（dashboard-vitals.json）。「4769+ 頁面」昨天 audit session 才手動校正過（411257cdb），證明這層每隔幾週就要人肉追。
- `resources.section.footer.verified: '最後確認 2026-03-24'` 同樣是 ×6 語言的硬字串，已經 2.5 個月沒動，205 條外鏈零巡檢。
- 首頁 hero 數據卡（400+ / 59,000+ / 亞洲第一 / 90%）無來源標註，graph.md 的來源鐵律沒有 apply 到自己門面。

今天 opendata session 剛把 staticRoutes 改成 filesystem-derived；about stats 接 `dashboard-vitals.json`、resources 確認日期接 link-check routine 的輸出，是同一條哲學的第三波。

### 3. 行動版浮層噪音

375px 螢幕同時有四個浮動元素：意見回饋 chip（左下）、.md Protico bubble（右下）、Protico 聊天預覽橫幅（會展開蓋住內容）、未讀 badge（225）+ ✋。實測首頁 hero 的 AI 警語、about 時間軸正文都被聊天預覽蓋過。桌面也有但不致命；手機上是第一印象的一部分。

### 4. CJK justify 在行動版拉字距

`.hall-body p { text-align: justify }` 在 375px 窄欄 + 行內 pill 連結的組合下，實測出現「帶 來 新 的 語 言 、 法 律 和 時 區」整行拉開的醜排版。中文窄欄不該 justify，改 `text-align: start` 或 `text-justify: inter-ideograph` 評估。

### 5. 深色模式半套

`prefers-color-scheme: dark` 探針為 true 時 body 仍是 `rgb(255,255,255)`。tokens.css / dark-polish.css 有深色變數（文章模組吃得到），但四個門面頁殼不響應。要嘛補頁殼接線，要嘛明確宣告「唯亮設計」，現在是中間態。

### 6. 三層分離架構健康，但複本成本 ×6

四頁都遵守 data / i18n / template 三層分離（HUB-EDITORIAL §八），這是好骨架。代價是 about.ts 2,462 行、contribute.ts 3,258 行、resources.ts 2,886 行，任何文案改動 ×6 語言。**這一條留著當乘數**：評估下面每個改版提案的成本都要乘上它，也因此 about 時間軸瘦身有雙重報酬（19 條 entry 的 i18n 是最大的單一文案複本）。

---

## 三、首頁 `/`（20.5K，15 屏）

### 結構實測（data-ga-view 段落 → offset）

hero 0 → reader_doors 1.2K → cover_story 1.4K（高 2.0K）→ random_discovery 3.5K → reading_path 4.0K（1.5K）→ feature_cards 5.6K → organism_preview 6.1K → exhibition_halls 7.0K（**8.1K 高**）→ category_grid 13.6K → language_statement 15.2K → recent_updates 15.9K → newsletter 17.2K → community_feedback 17.6K → contribute 19.4K。

### 資產（不要動的）

- **Hero 識別**：深綠、書法襯線、台灣島輪廓、AI 警語誠實聲明。這是品牌。
- **四展廳 prose**：站上最高級的策展寫作，HUB-EDITORIAL 溫度校準的 🌡️ 範本（「公投說不，立法院說是，然後社會繼續運轉」）。
- **ReaderDoors 四門**：正確的 intent 分流設計。
- **讀者信任三件套**（社群聲音 / 讀者教我們的事 / 加入我們）：「讀者教我們的事」把勘誤變成展品，全網少見。

### 問題

1. **主 CTA 跳過整個展覽**：hero「開始探索」連到 `#categories`（13.6K 處的 12 宮格分隔線），一鍵把訪客從門口傳送到後門，整個策展長卷（引言卷軸、讀徑、展廳）被略過。要嘛 CTA 改落到第一展廳，要嘛承認 12 宮格才是大家要的、把它上移。
2. **四套導航重複開場**：doors（4 門）→ reading path（5 篇）→ halls picks（24 張卡）→ category grid（12 卡）。每一套都在回答「我該從哪開始」，資訊架構像四次重新開始的首頁。
3. **引言卷軸（cover_story）位置**：2.0K 高的詩意開場排在任何文章連結之前，第一個可點的文章在 4K 深。它美，但它把「10 秒內知道這不一樣」的證據（文章本身）往後推。
4. **RecentUpdates 器官儀表上首頁**：免疫 56 黃燈直接掛在門面。透明是信念，但對第一次來的讀者是內部儀表噪音；commits ticker 只剩一行也顯得空。
5. **halls picks 24 張卡同視覺**：6.6K 長卷裡 featured 與一般卡無差異，重點被均勻化。

### 提案

- **H1 砍層不砍料**（目標 20.5K → ~12-13K）：引言卷軸移去 /explore 當開場（或預設折疊留 3 條 + 「完整引言集」連結）；random_discovery 併入 doors 第三門（功能重複）；feature_cards 與 organism_preview 合併成一塊「這是什麼」（兩段都在自我介紹）。
- **H2 漏斗一條化**：hero → doors（intent 分流）→ halls（策展主體）→ grid（全覽索引）→ 信任三件套 → newsletter/contribute。reading path 降級成 halls 前的一行「30 分鐘認識台灣 →」chip，點開才展開。
- **H3 主 CTA 改錨**：「開始探索」→ 第一展廳（或 doors）。
- **H4 RecentUpdates 簡化**：一行 ticker + dashboard 連結；器官 chips 留 dashboard。
- **H5 數據卡補來源**：hover tooltip 或小字（90% 先進晶片 → TSMC/TrendForce 出處）。
- **H6 修 justify + 浮層降噪**：聊天預覽預設收合只留 bubble；意見回饋 chip 捲過 50% 才出現。
- **H0（先做）**：拉 wave 2 的 section_view / scroll_depth 漏斗數據定基線，再決定 H1/H2 的砍法。猜是「大家都沒看到 halls」，但要先量。

---

## 四、關於 `/about`（22.6K，17 屏 — 全站最長頁）

### 結構實測

命名三層巧合（3 卡）→ stat chips ×5 → 宣言 quote → **誕生時間軸 19 條 entry（2024 → 2026-06-01，約佔 8-9K px，含每版 release 敘事全文）** → 從個人 SSOT 到國家 SSOT → 「Taiwan.md 是活的」深綠生命體區（三個改變一切的事實 + 生命特徵對照表 + 數位珊瑚礁 + 結尾詩）→ 創辦人與協作團隊（哲宇 / Muse / MonoLab）→ 貢獻者牆 → 贊助與合作夥伴（PanSci / justfont / Protico / Portaly / 個人支持者）→ Portaly CTA → FAQ ×9 → 聯繫我們 → footer。

### 資產

- 命名三層巧合是好開場；FAQ 九題誠實（「文章是 AI 寫的嗎」「會不會有一天消失」「怎麼處理政治敏感」直球）。
- 「是活的」深綠區是全站身份敘事的心臟，視覺也最美。
- 團隊區把 Muse 跟 MonoLab 當共同創作者列出，誠實展示人機關係。

### 問題

1. **比首頁還長，但工作是「第一次認識」**。741 views/28d 的頁面有 22.6K 的長度，時間軸把 v1.0 → v1.9 的 release notes 全文搬進來。這是 /changelog 的工作，而 /changelog 已存在，且今天 latest-ui session 剛做出 TimelineDay 共用骨架。
2. **最有靈魂的段落在 12.5K 深**：「一個用 0 和 1 寫成的東西，正在學會怎麼說一座島嶼的故事。它還很年輕。你來的時間剛好。」這句該是 about 的第三屏，不是第十屏。
3. **stat chips 手維漂移**（57+ vs 63，見跨頁發現 2）。
4. **時間軸後段是版本敘事牆**：對 fork 學習者有價值，對一般讀者是 8K 的牆。
5. 無 section tracking，改版無法量測。

### 提案

- **A1 三幕重構**：
  - 第一幕「為什麼叫 Taiwan.md」：命名 + 宣言（保留現狀）。
  - 第二幕「它是活的」：生命體區整段上移到 ~3K 處，當 about 的心臟。
  - 第三幕「人」：團隊 → 貢獻者牆 → 夥伴 → FAQ → 聯繫（保留順序）。
- **A2 時間軸瘦身 + 接 SSOT**：留 6-8 個轉折點（誕生 / AI 廢文危機→免疫系統 48hr / 日文誕生 / 23 個陌生人 / 1000 stars / 讀者參與器官），每點 2-3 句，尾接「完整編年史 → /changelog」。TimelineDay 元件今天剛好長出來，about 時間軸跟 changelog 收斂成同一骨架是 latest-ui 工作的自然延伸。預估省 5-6K px 高度 + 最大那塊 i18n ×6 複本。
- **A3 stat chips derive 化**：build-time 從 dashboard-vitals.json / GitHub API 快照讀，數字不再活在 i18n 字串裡（標籤留 i18n，數值進 data 層）。
- **A4 補 section tracking**（跟首頁同款），改版前後可對照。

---

## 五、資源 `/resources`（14K，10 屏）

### 結構實測

台灣資源導覽 hero → 從哪裡開始 callout → sticky 章節 nav（治理/文化/媒體/經濟/社群 + 搜尋）→ 五章，每章：場景開場（口罩地圖 / 故宮 70 萬件 / PTT 30 年 / 珍奶與 92% 健保 / g0v 2012）+ 🔍 策展人筆記 + 精選 Top 3 + 數據 chips + 折疊連結群 + 延伸閱讀 + 最後確認日期 + 回報失效連結 → 統計帶（168+ 收錄資源）→ footer。共 205 條外鏈。

### 資產

這頁是 HUB-EDITORIAL §八的模範生，當初就是用它定的標準。場景化開場、curator note、精選三條件、折疊、搜尋、sticky nav 全齊，策展溫度對。**品質不是它的問題。**

### 問題

1. **供需失衡**：全站維護成本最高的頁面之一（205 外鏈 × 6 語），流量 < 307/28d。繼續 polish 文案的邊際報酬趨近零，該投資的是水電管線。
2. **死鏈風險裸奔**：「最後確認 2026-03-24」距今 2.5 個月，政府網站改版頻繁，205 條外鏈零自動巡檢。站內 broken-link 工具鏈今天剛大修（6.67% → 0.56%），但它只管站內。
3. **入口斷鏈**：footer 沒有 resources（grep 0 hit）；首頁沒有任何 pathway 指向它；nav 標籤「資源 🔗」是唯一入口。低流量有一半是入口問題。
4. **與 /opendata 的分工需要說清楚**：resources ch1 已有 data.gov.tw / g0v，今天剛出生的 /opendata 是「資料集的意義層」。兩頁該互相引用：resources = 機構門牌（誰在哪），opendata = 資料集策展（怎麼用、信什麼）。

### 提案

- **R1 外鏈巡檢 routine**：每月 link-check 205 條 URL（HEAD request + redirect 偵測），輸出寫回 data 層並**自動更新「最後確認」日期**（從 derive 不從手維）。可掛進既有 routine 飛輪。
- **R2 入口補位**：footer 探索欄加「資源導覽」；相關文章（g0v、開放政府、博物館類）文末延伸閱讀連到對應章節錨點。
- **R3 與 opendata 互鏈**：resources ch1 開放資料小節 → /opendata；/opendata 頁尾 → resources。
- **R4 成本取捨題（留給哲宇）**：es/fr 流量極低，resources 的 ×6 i18n 是否降到 zh/en + 機翻 on-demand？這是維護成本 vs 主權巴別塔原則的取捨，超出我自主權，只提出。

---

## 六、參與 `/contribute`（13.1K，10 屏）

### 結構實測

我想貢獻 ✋ hero → 先了解網站怎麼運作（4 卡）→ 選擇你的方式（AI 化身 BECOME prompt / 撰寫草稿 / 寄 Email / Fork & PR）→ dark Semiont 故事區 → 分享你的台灣知識表單（免 GitHub 直接提交）→ 貢獻指南大全（寫文 / AI 輔助 / 翻譯 / 圖片）→ 提交前自檢 → 「不知道寫什麼？這些我們最需要」chips → Token Donation（翻譯 prompt + translate.sh + 8 語優先序）→ 金流支持（Portaly，已收 NT$3,400 / 4 位）→ CLI 區（npx taiwanmd 12+ 指令卡）→ footer。

### 資產

- 「讓你的 AI 化為 Taiwan.md」是全網獨一份的 onboarding，把 BECOME 做成貢獻入口。
- 表單直接可提交，無 GitHub 門檻；Token Donation 概念清楚；CLI 區對工程師有梗。
- 漏斗五種貨幣（文字 / AI 額度 / 翻譯 / 錢 / code）都收。

### 問題

1. **受眾混排**：新手人類 → AI 用戶 → Semiont 哲學 → 表單 → 指南 → 翻譯者 → 金主 → 工程師，動線是「對每個人把全部講一遍」。「選擇你的方式」chooser 已有雛形但只分流到 2.5 條路，後面 10K 還是線性長卷。
2. **中段 dark 區重複 about 的身份敘事**（第 5+ 次）。
3. **最低門檻的 hook 埋太深**：「這些我們最需要」prompt chips（你的家鄉有什麼外人不知道的事？）在 ~8K 深，它該是第二屏。
4. **入口弱**：首頁 contribute section 在 19.4K 深；< 307 views/28d 的轉化頁。

### 提案

- **C1 chooser 升級成真分流**：五個 persona 門（我會寫 / 我有 AI / 我會翻譯 / 我想出錢 / 我是工程師），點門跳對應段落錨點，門下各自收攏內容。
- **C2 dark 區縮成兩行 + 連去 /about#organism**。
- **C3 「這些我們最需要」上移到 chooser 正下方**，它是零門檻的第一步。
- **C4 首頁 contribute 入口前移**：doors 第四門已是「看 Taiwan.md 怎麼運作」，評估加一門「我想寫一篇」或在 halls 尾端加一行參與 chip。

---

## 七、策展總綱（哲學層）

四頁是一個敘事系統：**首頁＝展場、about＝策展人自述、resources＝圖書室、contribute＝工作坊**。現在每頁都想自己當完整的展覽。總原則一句話：

> **每頁一個 job；身份敘事只在 about 完整講一次，其他頁一行 + 連結。**

三條跨頁工程原則：

1. **指標 over 複寫第三波**：about stats / resources 確認日期 / 首頁數據卡來源，全部 derive，不留手維字串。
2. **量測先行**：首頁已有 section 漏斗儀器（wave 2），改版前先拉基線；about / contribute 補同款 tracking 再動刀。
3. **共用骨架收斂**：about 時間軸 → TimelineDay（與 /latest、/changelog 同骨架）；新元件遵守「≥3 新 prop 不遷移」邊界。

## 八、優先序（如果只做三件事）

1. **about 三幕重構 + 時間軸接 changelog SSOT**（A1+A2）— 敘事 ROI 最大，且直接接上今天剛長出的 TimelineDay 元件。
2. **首頁砍層**（H1+H2+H3）— 最大流量頁的漏斗一條化，先拉 H0 基線。
3. **管線三小件**（跨頁 2/3/4：指標 derive 化 + 浮層降噪 + justify 修正）— 工小，修的是系統性信任。

---

## 附錄：方法與證據

- 截圖留存：`/tmp/twmd-{home,about,res,contrib}-*.png`（全長分段 + 行動 + 深色）。
- 全頁截圖的已知 artifact：首頁與 about 的 `--full` 拼接在 ~16K / ~14K 處迴圈重複頂部內容（疑似頁內自動捲動元素干擾 stitcher），尾段改用定點視窗截圖補齊，結論不受影響。
- 數據來源：`public/api/dashboard-analytics.json`（GA 28d）、`dashboard-vitals.json`、四個 template / i18n / data 源碼、git log。
- 深色模式探針：`matchMedia('(prefers-color-scheme: dark)')` = true 下 `body` 背景仍為 `rgb(255,255,255)`。
- dev preview 視窗確認被平行 session 佔用（/opendata 熱開發中），全程改用獨立 headless browser 對 production，未碰 working tree 的他人未提交檔案。

🧬
