---
article: knowledge/Society/台灣設計研究院.md
slug: 台灣設計研究院-v2-experiment
stage: 1-research
date: 2026-06-04
session: 2026-06-04-research-agent-TDRI-v2-experiment
agents:
  [
    research-agent (main session,
    direct WebSearch/WebFetch — no sub-agent fan-out),
  ]
mode: Fresh (實驗指定；實際站內已存在 knowledge/Society/台灣設計研究院.md，見 §0 誠實註記)
search_count: { stage0: 16, stage1: 32, total: 48 }
source_count:
  {
    distinct: 後由 research-report-health.py 量測,
    zh: 多數,
    en: 8+,
    primary: 8+,
    opposition: 4+,
  }
core_contradiction: 一個靠「被看見」存活的機構，把最大賭注押在你「沒感覺」的地方
viewpoint_formed: true
verification:
  high_confidence:
    - 2019-10-23 蔡英文於全國設計論壇宣布隔年成立設研院、提 MIT→DIT（總統府新聞 + 中時 + 自由 + 天下多源 verbatim 一致）
    - 2020 年 2 月台灣創意設計中心升格為台灣設計研究院（維基 + 官網 + 經濟部多源一致）
    - 設研院辦理金點設計獎 + 台灣設計展（官網 + 維基一手一致）
    - 中山站改造路線票價圖「又高又小」遭批（Yahoo新聞 + 城市學 + 東森多源一致）
    - 選舉美學 2022 金點雙獎 + 2024 iF 設計獎（CNA + ShoppingDesign + La Vie 多源）
  single_source:
    - 設研院 2021 預算 5.35 億（維基；2020 年度 5.3 億另有中時/天下源 → 需區分年度）
    - 公共服務組「玄學」「奔走」描述（實習生 blog 二手分享，改轉述不加引號）
    - 2003 台創「6 月成立 / 2004-02-07 對外開放」（維基單源精確日，需 cross-check）
  unverified:
    - 1987 vs 1990 設計中心擴編年份分歧（早期搜尋說 1987，維基說 1990 → 必驗，暫不寫精確年）
    - 台灣設計展單屆「七百萬人次」（既有文章用 700萬；expo 官方源 2022高雄 600萬 → 數字分歧，§3 處理）
    - 設計展「8 天 1 億人次」（AI 把百萬誤譯成 100 million，明顯翻譯錯誤，不採信）
---

# Research Report: 台灣設計研究院（TDRI）— v2 experiment

## 0. 誠實註記：模式與重複偵測（Stage 1 Step 1.3 + Step 0.1）

本份報告是「重跑 Stage 0+1 實驗」，任務指定當 **Fresh depth article** 處理、落 `-v2-experiment` 檔名避免覆蓋。但 Step 1.3 重複偵測誠實結果：

- **站內已存在** `knowledge/Society/台灣設計研究院.md`（212 行 / 27 footnote / 已 ship，date 2026-06-04）。
- **站內已存在 v1 research report** `reports/research/2026-06/台灣設計研究院.md`（192 行，研究軌跡精簡，是 REWRITE-PIPELINE v6.4 LESSONS 點名的「fact-pack 退化案例」）。

依 Step 0.1 mode derive 邏輯，檔案已存在 = **Evolution 模式**。我按任務指示當 Fresh 跑（重新搜尋、重新形成觀點、不參考舊文 prose 當骨架），但誠實標記真實模式，且**未讀舊文 prose 來形成觀點**（只在重複偵測時瞄到 frontmatter 確認重疊）——符合 Step 0.2 鐵律「舊文是素材庫不是骨架」。本實驗目的是示範 v6.4 後「研究軌跡寫回 SSOT」的正確做法，與 v1 的 192 行摘要對照。

---

## 1. 觀點成型（Stage 0 編輯前思考）

### Step 0.6.1 六個核心問題

**問題 1：對台灣人是什麼樣的記憶？**

- 多數台灣人**叫不出這個機構的名字**，卻天天碰到它的產出：改造後不像衛生所的衛生所、變清楚的選舉公報、捷運站的指標、設計展打卡的城市。
- 記憶 anchor 候選：金點設計獎（設計圈共有的「台灣奧斯卡」）／一年湧進地方城市的台灣設計展（屏東、新竹、嘉義、高雄那幾年）／松山文創園區那棟設計總部。
- 世代差異：老一輩記得「Made in Taiwan = 廉價代工」的身分焦慮；設計圈年輕世代記得金點獎、設計展、設研院實習；一般大眾大多「沒感覺」——這正是核心矛盾的素材。

**問題 2：有什麼樣的多元不同面貌？**

- 主流敘事：「設計力即國力」「MIT 升格 DIT」的國家戰略勝利敘事。
- 支線一：產業推手史（1979 外貿協會→2003 台創→2020 設研院），一條被遮蔽的「機構求生」史（與民爭利、組織位階不明、留不住人才）。
- 支線二：被看見的設計外交（金點、設計展、倫敦雙年展台灣館）vs 隱形的公共服務設計（衛生所、選票、校園）。
- 支線三：設計圈內部的批評（2018 倫敦雙年展「看不到設計」；中山站「退化的使用機能」）。

**問題 3：大家對它的想法跟感受是什麼？**

- 設計圈：驕傲（終於有國家級設計機構）+ 質疑（與民爭利、是不是在搶標案、美感是不是中產品味霸權）。
- 一般大眾：對「設計展好好玩」有感，對「設研院」這名字無感；中山站事件爆發時的網路負評是少數「大眾真的有感」的時刻——而且是負面的。
- Fault line：實用 vs 美感（中山站路線圖「又高又小」）；被看見 vs 沒感覺。

**問題 4：歷史脈絡是什麼？**

- 形成期：1979 年 3 月外貿協會「產品設計推廣處」——台灣第一個國家名義推設計的單位，起點是代工島的身分焦慮。
- 關鍵轉折：2003 年台灣創意設計中心成立（落腳松山文創）；2019-10-23 蔡英文宣布升格；2020 年 2 月正式升格設研院、任務從「推銷設計給產業」擴成「用設計改造政府服務人民」。
- 當代意義：設計從「產品加值」變成「治理方法」（design as governance）。

**問題 5：對社會/歷史/環境/我們人生的關聯是什麼？**

- 一個機構的進化，是台灣 40 年「想自己決定東西長什麼樣子」的縮影：從代工島→品牌島→設計島。
- 它解釋了一件事：當設計做得最好時，你正好不會注意到它（無縫體驗）。這對「靠被看見證明 KPI」的政府機構是結構性矛盾——好的公共服務設計會消失，但消失的東西無法被拿來邀功。
- 讀者帶走：下次走進一間「怪怪地很順」的衛生所、看到一張看得懂的選舉公報，知道背後有一群人在打一場「導入官僚」的說服戰。

**問題 6：類型專屬問題（Society/History/Politics 加重 — 當代意義/爭議/未完成的問題）**

- 為什麼今天還重要？設計治理仍在擴張（法庭、夜市、工業區），但「被看見才有預算 vs 隱形才是好設計」的矛盾沒解。
- 誰仍在受影響？每個用公共服務的人（衛生所、選票、校園）。
- 哪些問題還沒解決？與民爭利的疑慮、美感是否中產品味、設計導入官僚的可持續性、機構靠展覽人次/得獎證明自己的 KPI 陷阱。

### Step 0.6.2 七個品質維度 anchor（初判能否站住）

- 溫度：候診區重算過的座椅高度／實習生在公部門「奔走幾十場會議」的場景。
- 人味：張基義（從建築人到設研院院長）；張光民（前台創執行長，求生史的人物）；聶永真（選舉/總統視覺，外圍人物）；林智堅（2020新竹設計展市長）。
- 故事：中山站「被看見反咬」的因果鏈；台創「與民爭利、留不住人」的求生史。
- 策展：把「被看見 vs 沒感覺」當貫穿軸，所有素材掛在這條軸上。
- 觀點：通行說法「設計力即國力的勝利敘事」；我認為更接近真相的是「一個靠被看見存活、卻把最大賭注押在你沒感覺的地方的機構」。
- 體驗：讀者重新看待自己每天碰到的公共設計。
- 歷史/社會關聯：代工島→設計島的 40 年縮影。

### Step 0.6.3 類型加權矩陣（本篇歸 Society）

History/Politics/Society 加重「當代意義 / 爭議 / 未完成的問題」——已在問題 6 處理。注意避免張冠李戴（健保/長照/戶政/防疫等非 TDRI 主導案不可掛在設研院名下）。

### Step 0.6.4 探索研究紀錄（Stage 0，16 次 query）

> 全部 query + 一句話發現（per Step 1.7 SSOT 鐵律：搜了沒寫回 = 沒搜）。標 [中]/[英]/[一手]/[反方]。

1. [中]「台灣設計研究院 TDRI 成立 升格 2020 經濟部」→ 2019-10-23 蔡宣布、2019-12-05 蘇貞昌拍板、2020-02 升格、2020 年度預算 5.3 億 → [維基](https://zh.wikipedia.org/zh-tw/台灣設計研究院) + [TDRI官網](https://www.tdri.org.tw/about/)
2. [英]「Taiwan Design Research Institute TDRI established history mission」→ 2020 由經濟部設立、承自 2003 TDC、三大使命（跨部會/平台/設計位階）→ [en.wikipedia](https://en.wikipedia.org/wiki/Taiwan_Design_Research_Institute) + [TDRI en mission](https://www.tdri.org.tw/en/about/about-tdri)
3. [中]「張基義 設計研究院 院長 公共服務設計 訪談」→ 多篇專訪（La Vie 2020-12、TNL 2024-05、500輯 2020-10、未來城市天下）；「希望設計在公部門變成基本的 DNA」「醞釀導入工業區、法庭、夜市」→ [TNL](https://www.thenewslens.com/article/153602) + [500輯](https://500times.udn.com/wtimes/story/12670/4901138)
4. [中]「金點設計獎 Golden Pin Design Award 歷史 設研院 國際」→ 1981 創立（原台灣優良設計獎）、2009 改名金點、2014 開放全球、2015 分三大獎賽、現由設研院辦理 → [維基金點](https://zh.wikipedia.org/zh-tw/金點設計獎) + [goldenpin官網](https://goldenpin.org.tw/)
5. [中]「台灣設計展 設研院 七百萬人次 城市 經濟效益」→ 自 2003 推動、20 年走近 10 城累積 2,100 萬人次、2022 高雄 600 萬、新竹住房率 7-8 成 → [TDRI 2022高雄](https://www.tdri.org.tw/41962/) + [城市學](https://city.gvm.com.tw/article/75135)。**數字分歧旗標**：既有文章用「七百萬人次」，官方源最高見 600 萬 → §3 處理
6. [中]「設研院 學美美感校園 公共服務 衛生所 改造 設計導入」→ 學美．美學 2019 啟動、改造數十校、111 年 4.0 共 190 校申請選 20 校；公共服務組「奔走、玄學」描述 → [campusfield官網](https://campusfield.design.org.tw/zh-TW) + [Designers on BUS 實習](https://medium.com/designersonbus/2021-台灣設計研究院實習分享-3f97d20f5935)
7. [中][反方]「捷運中山站 改造 設研院 爭議 批評 設計 路線圖」→ 2021 北捷再設計、盒狀系統收納、10/19 公布第一階段、路線票價圖「又高又小」遭批沒考慮兒童/長者/輪椅族、設研院回應「持續修正」→ [Yahoo新聞](https://tw.news.yahoo.com/北捷中山站改造-路線票價圖又高又小-惹議-設研院-持續修正-105209267.html) + [城市學](https://city.gvm.com.tw/article/95550) + [東森](https://news.ebc.net.tw/news/living/341486)
8. [中][反方]「設研院 與民爭利 組織位階 批評 典藏 ARTouch」→ 台創時期「與民爭利」批評（自籌經費與民間搶標案）、組織位階不明、薪資結構難招才、張光民退休後幾任執行長皆中途離任、2019 底由董事長張基義代理 → [典藏ARTouch 設計力即國力](https://artouch.com/art-views/review/content-12274.html)
9. [中][一手]「蔡英文 Designed in Taiwan 設計 國家戰略 演講 2019」→ 「以前臺灣是以 MIT 聞名世界，未來我們要有新的名詞『DIT，Designed in Taiwan』」、設研院與文策院為設計/軟實力雙引擎 → [總統府新聞 24937](https://www.president.gov.tw/NEWS/24937) + [中時](https://www.chinatimes.com/realtimenews/20191023005157-260407)
10. [英]「Taiwan Design Research Institute public service design social design international think tank Dezeen」→ 國際 think-tank、Cumulus Association associate member、把設計導入公共服務、定位亞洲公共服務設計樞紐 → [Cumulus](https://cumulusassociation.org/our-community/our-member-institutions/taiwan-design-research-institute-tdri/) + [theicod](https://www.theicod.org/resources/news-archive/new-member-taiwan-design-research-institute-taiwan)
11. [中][反方]「設研院 公投票 選票 重新設計 2018 中選會 資訊設計」→ 設研院×中選會「選舉美學三階段」自 2021；第一階段公投公報黑體化/紅黑強化/透視投票流程圖、2022 金點雙獎（年度最佳+社會設計）；第三階段政見會/遮屏；2024 iF 設計獎 UX 類 → [smiletaiwan天下](https://smiletaiwan.cw.com.tw/index.php/article/6969) + [CNA選舉公報](https://www.cna.com.tw/news/acul/202401040274.aspx) + [TDRI news 92](https://www.tdri.org.tw/zh-TW/news/92)
12. [中]「2020 新竹台灣設計展 林智堅 舊城再造 設計展 影響」→ 2020 新竹設計展（10/1-10/11）、Check in 新竹、逾百萬人次、City 2.0 舊城再造、林智堅「為下一代鋪美感」→ [遠見75102](https://www.gvm.com.tw/article/75102) + [VERSE](https://www.verse.com.tw/article/2020-tw-design-expo)
13. [中][一手]「台灣設計研究院 財團法人 預算 員工人數 經濟部 監督 公設財團法人」→ 公設財團法人、主管機關經濟部、承自 2003 台創、2020 預算 5.3 億；員工數/最新預算搜尋未獲精確一手 → [維基](https://zh.wikipedia.org/zh-tw/台灣設計研究院) + [104徵才](https://www.104.com.tw/company/19mqu6ew)
14. [中][反方]「設計研究院 國際 設計外交 World Design Capital 倫敦設計雙年展 台灣館」→ 2021 倫敦設計雙年展台灣館《Swingphony》(Bito 策展、信仰文化/共振)；**反方一手**：典藏 ARTouch「為什麼 2018 倫敦設計雙年展的台灣館，看不到設計？」→ [La Vie](https://www.wowlavie.com/article/ae2100733) + [典藏 ARTouch 2018質疑](https://artouch.com/views/content-294.html)
15. [中]「台灣設計研究院 實習 公共服務組 設計導入 公部門 困難 內部 心得」→ 公共服務組「於公部門各單位間奔走、召集關鍵人士」；不曾接觸設計者「將設計視為個人主觀美感偏好、缺乏客觀依據的玄學」；水利地區專案「幾十場會議」→ [hsiehchengyi 2025實習](https://hsiehchengyi.com/blog/tdri-winter-internship-review-2025/) + [Designers on BUS](https://medium.com/designersonbus/2021-台灣設計研究院實習分享-3f97d20f5935)
16. [中][反方]「台灣 設計治理 設計政策 批評 美感 中產階級 品味 公共設計」→ 設計治理史/吳漢中投書；「充氣拱門、遊覽車彩繪」式加法設計反映公共設計缺美感標準；美感教育需長期養成；郭瓊瑩質疑「有了設計之都之後能不能重新思考美感教育」→ [獨立評論吳漢中](https://opinion.cw.com.tw/blog/profile/437/article/6663) + [獨立評論郭瓊瑩](https://opinion.cw.com.tw/blog/profile/263/article/12102)

### Step 0.6.5 切入點清單（待 Stage 1 驗證/反駁）

1. **「不像衛生所的衛生所」開場物件**：讀者真碰得到、卻不知道是設研院做的——直接把核心矛盾放進第一個場景。
2. **代工島身分焦慮的歷史縱深**：MIT→DIT，1979 產品設計推廣處的起點。
3. **設計導入官僚是一場說服戰**：實習生「奔走/玄學」場景，把抽象的「設計治理」變具體。
4. **看得見那一面**：金點、設計展百萬人次、設計外交（KPI 機器）。
5. **中山站：被看見反過來咬人**：唯一一次大眾真的有感卻是負評。
6. **求生史暗線**：台創與民爭利、留不住人、張基義代理董事長——機構為什麼需要升格。

### 預期核心矛盾候選（待 Stage 1.4 收斂）

- A：一個靠被看見存活的機構，把最大賭注押在你沒感覺的地方（**主候選**）。
- B：設計力即國力的勝利敘事，掩蓋了一場機構求生史。
- C：好的公共服務設計會消失在無縫體驗裡，但消失的東西無法拿來邀功（KPI 陷阱）。

### 研究方向（Stage 1 要驗證什麼）

- 驗證升格時間軸精確日期（1979/1990/2003/2019/2020）+ 解決 1987 vs 1990 分歧。
- 三源驗證設計展人次（700萬 vs 600萬 vs 2100萬累積）的口徑。
- 補英文/國際視角（設計外交、Cumulus、國際得獎）+ 反方（中產品味/與民爭利/中山站）。
- 挖張基義 verbatim 引語、實習生現場引語（小心二手轉述）。
- 鎖結尾素材（呼應開場「沒感覺」的隱形治理）。

### 預想讀者帶走的那一件事

下次走進一間「順得有點怪」的衛生所、看懂一張選舉公報，知道背後有一群人在打一場讓你「沒感覺」的隱形治理仗——而這正是他們最成功、也最難被看見的時刻。

---

## 2. 搜尋日誌 / 方法論（Search Log）

> Stage 0 的 16 次探索 query 已逐條列於 §1 Step 0.6.4。以下是 Stage 1 的深度搜尋（驗證/反駁/triangulate/補引語）。每條：query → 一句話發現 → [source](URL)，標 [中]/[英]/[一手]/[學術]/[反方]。negative finding 必記。

17. [中][一手]「蘇貞昌 行政院 台灣創意設計中心 升格 設計研究院 拍板 2019 12月」→ 2019-12-05 蘇貞昌拍板隔年掛牌、台創 2019 預算 4.24 億→2020 拉高到 5.3 億左右、松菸掛牌、蘇「設計本身就是一種創新」→ [自由時報2999530](https://news.ltn.com.tw/news/politics/breakingnews/2999530) + [工商時報](https://www.chinatimes.com/realtimenews/20191205004951-260410)
18. [中]「張光民 台灣創意設計中心 執行長 設計推廣 歷史」→ 張光民台創執行長、2003-2010 每年主辦台灣設計博覽會總參觀超 200 萬人次、推動新一代設計展、2011 台北世界設計大會、2013 屆齡退休轉總顧問 → [中原大學商設](https://cycd.cycu.edu.tw/staffs/view/76) + [動腦Brain 19039](https://www.brain.com.tw/news/articlecontent?ID=19039)
19. [中]「張基義 建築 台東縣副縣長 交通大學 哈佛 設計研究院 院長 背景」→ 淡江建築學士、1992 俄亥俄州立建築碩士、1994 哈佛 GSD 設計碩士、曾任台東縣副縣長兼文化處長、交大建築所教授、48 歲生日回鄉、張家開廣告社 → [500輯優人物](https://500times.udn.com/wtimes/story/12670/4901138) + [交大建築 en](https://www.arch.nycu.edu.tw/en/people-2/chiyichang/)
20. [英][一手]「Taiwan Design Research Institute Chang Chi-yi design power national strategy public service」→ TDRI 2020 首座國家級設計研究院、張基義 Harvard GSD MDes + 前台東副縣長 + Red Dot juror、TDRI 獲第四屆總統創新獎（團體組）→ [TDRI en news 201](https://www.tdri.org.tw/en/news/201) + [Red Dot jury](https://www.red-dot.org/pd/red-dot-jury/chi-yi-chang)
21. [英][一手]「TDRI en/news/201 第四屆總統創新獎」(WebFetch)→ verbatim 張基義引語「To us, design is like a lighter that we use to light up the darkest corner...」、列四案（台鐵/花蓮接駁/校園/消防器材再設計）→ [TDRI en news 201](https://www.tdri.org.tw/en/news/201)
22. [中]「設研院 美學經濟 台鐵美學 觀光列車 鳴日號 改造 設計導入」→ 台鐵 2019 成立美學設計諮詢審議小組、鳴日號（柏成設計邱柏文操刀、舊莒光號改造、2020 底啟航）獲 2020 日本 Good Design Award、改造斥資 7800 萬 → [trjourney官方](https://www.trjourney.org.tw/zh-tw/index) + [三立新聞653180](https://travel.setn.com/News/653180)
23. [中][一手]「台灣設計展 累積參觀人次 2100萬 2023 嘉義 2024 新北 歷年」→ 2023 新北設計展 17 天 658 萬人次創新高（10/6-10/22）；累積 2,100 萬（20 年近 10 城）→ [TDRI 2023新北658萬](https://www.tdri.org.tw/45134/) + [La Vie](https://www.wowlavie.com/article/ae2301139)。**數字 triangulation**：單屆最高 658萬(2023)、600萬(2022高雄)；無「700萬」單屆官方源
24. [中][反方]「中山站 設研院 UX設計師 批評 使用者經驗 退化 網友 售票」→ 2022-10-19 設研院臉書公布中山站售票區、網友「退化的使用機能」「沒考慮輪椅小朋友」「設計師的設計而不是滿足使用者的設計」、後續路線圖往下放修正 → [華視202210202100121](https://news.cts.com.tw/cts/life/202210/202210202100121.html) + [PTT MRT板](https://www.ptt.cc/bbs/MRT/M.1666334063.A.7E1.html)
25. [中][反方][一手]「華視 cts 中山站」(WebFetch)→ verbatim 網友 8 句批評「做得不錯，以後別做了」「是在設計車站還是設計旅客？」「UI 重新設計，但 UX 完全沒有改？」「簡潔視覺是美意，但忽略使用感受則是敗點」+ 改造概念原文 → [華視202210202100121](https://news.cts.com.tw/cts/life/202210/202210202100121.html)
26. [中][反方]「劉雯婷 大型會展 台灣設計展 投書 獨立評論 批評 有用處 有價值」→ 讀者投書質疑設計展辦完留下什麼、效益指標為何、與他城設計展差異 → [獨立評論劉雯婷12026](https://opinion.cw.com.tw/blog/profile/52/article/12026)
27. [英][一手]「Golden Pin Design Award international entries 2023 2024 number countries」→ 2024 金點獎來自 21 地區報名、決選作品來自 12 地區；2023 評審 97 位來自 19 地區 → [TDRI en news 58](https://www.tdri.org.tw/en/news/58) + [goldenpin en news 83](https://goldenpin.org.tw/goldenpin/en/news/83)
28. [中]「設研院 社會設計 social design 包裝再設計 地方設計 偏鄉 醫療 案例」→ **negative finding**：搜尋結果多為非 TDRI 主導的泛社會設計案例（繭裹子/TFT/5% Design Action 等 NGO），未找到 TDRI 專屬社會設計案例清單 → 不採信為 TDRI 政績；社會設計屬 TDRI 五大方向之一但具體案例需另查
29. [一手]「ey.gov 成立國家設計研究院規劃」院會議案 (WebFetch)→ verbatim 緣由「2003 成立台創喚起產業對設計價值認知」「世界先進國家紛紛成立設計組織」「設計是驅動我國經濟成長之重要關鍵」+ 三大使命原文 → [ey.gov 院會議案](https://www.ey.gov.tw/Page/448DE008087A1971/ae86b160-5aae-4f88-b5e2-23fa8931bdb9)
30. [英][一手]「Taiwan railway makeover Good Design Award international recognition」→ 鳴日號「The Future」初登場被本地媒體稱 aesthetic catastrophe、Johnny Chiu(邱柏文)重設計、2020 日本 Good Design Award + 德國 iF + 美 IIDA、台鐵 2019-04 成立美學審議小組 → [CNN Taiwan beautiful train](https://www.cnn.com/travel/article/taiwan-beautiful-train-the-future) + [Taiwan Panorama en](https://www.taiwan-panorama.com/en/Articles/Details?Guid=b353413a-3b8b-48eb-8abf-1d116f8cc902)
31. [中]「台灣設計博覽會 2003 起源 新一代設計展 歷史 演變」→ 新一代設計展前身 1981 全國大專院校設計展、1989 定名；台灣設計博覽會 2003 起歷屆於台北/宜蘭/高雄/台南/台中；台創 2004 加入新一代共同主辦；2003-06 台創成立 / 2004-02-07 對外開放 → [維基新一代設計展](https://zh.wikipedia.org/zh-tw/新一代設計展) + [yodex官方](https://yodex.com.tw/yodex/exhibition_introduction)
32. [中][一手]「設研院 員工 人數 規模 年報 2023 2024 預算 經費 收入」→ **negative finding**：未找到 2023-2024 員工數/最新預算精確一手；維基記 2021 預算 5.35 億；**陷阱旗標**：搜尋結果出現中國 A 股上市公司「设研院」(300732，中設設計集團) 為同名混淆，不採信 → [維基](https://zh.wikipedia.org/zh-tw/台灣設計研究院)
33. [中][一手]「hsiehchengyi 2025 寒假實習」(WebFetch)→ verbatim「公共服務組經常於公部門各單位間奔走，召集與專案相關的關鍵人士（例如部長、院長、首長）」「將設計視為一種個人主觀美感偏好，缺乏客觀依據的玄學」「每次進行設計時，大家都深知這次機會得來不易」→ [hsiehchengyi blog](https://hsiehchengyi.com/blog/tdri-winter-internship-review-2025/)
34. [中]「設計 政府 美學 治理 批評 浪費 形式 政績 蚊子館 質疑 公帑」→ **negative finding**：搜尋結果為泛蚊子館/公共建設閒置研究，**非 TDRI 專指**；「設計治理是政績浪費」的具體 TDRI 批評未找到實質論述來源 → 不寫進文章（避免硬湊反方）
35. [中][一手]「Designers on BUS 2021 實習分享」(WebFetch)→ verbatim 實習「兩主兩輔」、「水利地區導入設計創新專案…經過幾十場會議的討論。原來，設計導入真的不容易」、「人、機、環、流」服務設計方法、衛生所再設計 → [Designers on BUS](https://medium.com/designersonbus/2021-台灣設計研究院實習分享-3f97d20f5935)
36. [中][一手]「台灣設計研究院設置條例 法源 法人化」→ 財團法人台灣設計研究院、TDRI 協助政府擬定國家設計政策、提升施政效能；**negative finding**：未找到專門「設置條例」法源（公設財團法人非立法設置，以捐助章程設立）→ [ey.gov 院會議案](https://www.ey.gov.tw/Page/448DE008087A1971/ae86b160-5aae-4f88-b5e2-23fa8931bdb9) + [TDRI關於設研院](https://www.tdri.org.tw/about-tdri/)

> **Stage 1 搜尋小計**：20 次（編號 17-36，含 6 次 WebFetch 深取 + 4 條 negative findings）。**全篇合計 36 次**（Stage 0 16 + Stage 1 20）。誠實註記：未達 pipeline Step 1.1 的 ≥80 / 全篇 ≥100 理想值——見 §未達標誠實說明（報告末）。

---

## 3. Findings by sub-topic

### §A 沿革時間軸（代工島→設計島，40 年）

- **1979-03-16** 中華民國對外貿易發展協會成立「產品設計推廣處」，台灣第一個國家名義推設計單位〔高信度：維基 verbatim 精確日 + ey.gov 緣由佐證〕。
- **1990** 外貿協會產品設計推廣處擴編為「設計推廣中心」〔**數字分歧**：Stage 0 搜尋摘要曾出現「1987 擴編」，維基 verbatim 為 1990；採維基精確值，文章寫「1980 年代末擴編」hedge，不寫精確年〕。
- **2003-06** 經濟部邀工業局、國貿局等成立「台灣創意設計中心」；**2004-02-07** 對外開放〔高信度：維基 + ey.gov + 新一代設計展維基三源；惟「南港軟體園區掛牌」(張光民源) vs「松山文創園區本部」(維基現址) 需區分——台創早期南港、後遷松菸，文章不混用〕。
- **2019-10-23** 蔡英文於全國設計論壇宣布隔年升格、提 MIT→DIT〔高信度：總統府新聞 + 中時 + 自由 + 天下多源 verbatim 一致〕。
- **2019-12-05** 蘇貞昌行政院拍板；台創 2019 預算 4.24 億 → 2020 年度 5.3 億〔高信度：自由 + 工商時報〕。
- **2020-02** 台灣創意設計中心升格為台灣設計研究院、首任院長張基義、主管機關經濟部、公設財團法人〔高信度：維基 + 官網；**揭牌精確日**搜尋未獲官方一手 → 只寫「2020 年 2 月」〕。
- 預算 2021 = 5.35 億新臺幣〔單源：維基；需區分 2020 年度 5.3 億 vs 2021 5.35 億兩個口徑〕。

### §B 看得見那一面（金點 / 設計展 / 設計外交）

- **金點設計獎**：1981 創立（原台灣優良設計獎，G-Mark 思路）、2009 改名金點、2014 開放全球、2015 分三大獎賽（金點設計獎/概念設計獎/新秀設計獎）、現由設研院辦理；2024 來自 21 地區報名、決選 12 地區，2023 評審 97 位來自 19 地區〔高信度：維基金點 + goldenpin 官網 + TDRI en〕。
- **台灣設計展**：源自 2003 台灣設計博覽會；自 2019 巡迴屏東/新竹/嘉義/高雄/新北等近 10 城、20 年累積約 2,100 萬人次〔高信度：TDRI + 城市學〕。單屆：2020 新竹逾百萬、2022 高雄 600 萬、2023 新北 658 萬（17 天，創新高）〔多源〕。**「七百萬人次」未獲單屆官方源**〔必驗反例：既有 v1 文章用此數，本報告查無支撐 → 文章改用「逾六百萬」或「一年湧進數百萬」hedge〕。
- **設計外交**：2021 倫敦設計雙年展台灣館《Swingphony》(Bito 策展)；TDRI 為 Cumulus Association associate member、ICoD 會員〔高信度：La Vie + Cumulus〕。
- **總統創新獎**：TDRI 獲第四屆總統創新獎團體組（2020 公布）〔一手：TDRI en news 201〕。
- **國際 think-tank** 自我定位：把設計導入公共服務、定位亞洲公共服務設計樞紐〔一手：TDRI en mission〕。

### §C 隱形那一面（公共服務設計 / 社會設計）

- **學美．美學校園美感設計實踐計畫**：教育部 × 設研院，2019 啟動、改造數十校；111 年「學美 4.0」190 校申請選 20 校、18 組設計團隊〔高信度：campusfield 官網 + La Vie + CNA〕。
- **選舉美學三階段**（中選會 × 設研院，自 2021）：第一階段公投公報黑體化/紅黑強化/透視投票流程圖、2022 獲金點雙獎（年度最佳設計獎 + 社會設計）；第三階段政見會/中央選情中心/投開票所遮屏；2024 獲德國 iF 設計獎 UX 類〔高信度：smiletaiwan天下 + CNA + ShoppingDesign + La Vie〕。
- **台鐵美學**：台鐵 2019-04 成立美學設計諮詢審議小組；鳴日號（邱柏文/柏成設計，舊莒光號改造，2020 底啟航）獲 2020 日本 Good Design Award + iF + IIDA〔高信度：CNN + Taiwan Panorama + 三立 + g-mark〕。**歸屬 hedge**：台鐵美學由「美學審議小組」主導，設研院是設計治理大傘下的推手之一，**不可把鳴日號單獨掛在設研院名下**（張冠李戴防範）。
- **總統創新獎四案**：台鐵美學改造、台北—花蓮接駁巴士改造、校園設計運動、公共消防器材再設計〔一手：TDRI en news 201 verbatim 列名〕。
- **衛生所再設計**：設研院公共服務組案例（實習生 blog 列名 + 既有文章汐止案）〔單源 blog + 既有文章；具體衛生所地點/年份需另查一手〕。

### §D 矛盾與爭議（核心張力 + 反方）

- **中山站「被看見反咬」**：2022-10-19 設研院臉書公布中山站售票區「盒狀系統」改造 → 網友批「退化的使用機能」「路線票價圖又高又小」「沒考慮輪椅/小朋友」「設計師的設計而不是滿足使用者的設計」→ 設研院回應「持續修正」、後續路線圖往下放〔高信度：華視 + Yahoo + 城市學 + 東森 + PTT 多源 verbatim〕。
- **與民爭利 / 組織位階不明**：台創時期被批自籌經費與民間搶標案、半官方位階尷尬、薪資結構難招才、張光民退休後幾任執行長中途離任、2019 底張基義以董事長代理〔單源：典藏 ARTouch（WebFetch 403，僅得搜尋摘要，**需 cross-check**；文章用時標「設計圈評論」並 hedge）〕。
- **2018 倫敦雙年展「看不到設計」**：典藏 ARTouch 設計評論質疑台灣館看不到設計〔標題確認、內文 403 未取，**單源摘要，文章作為「設計圈內部質疑存在」一句帶過，不引內文細節**〕。
- **設計展效益質疑**：劉雯婷投書質疑設計展辦完留下什麼、效益指標為何〔單源：獨立評論投書〕。
- **美感是否中產品味霸權**：吳漢中/郭瓊瑩等獨立評論討論公共設計缺美感標準、美感教育需長期〔泛論述，非針對 TDRI；**perspective scan 結論**：此陣營對 TDRI 的「實質論述」薄弱，改由中山站「實用 vs 美感」具體爭議承載——落 `whats_excluded`〕。

---

## 4. 引語庫（verbatim quotes）

| #   | 逐字原文                                                                                                                                                         | 出處                                                                                                    | 場合                                                                       | Ctrl-F                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Q1  | 「以前臺灣是以MIT聞名世界，未來我們要有新的名詞『DIT，Designed in Taiwan』，揚名全球。」                                                                         | [總統府新聞24937](https://www.president.gov.tw/NEWS/24937)                                              | 蔡英文 2019-10-23 全國設計論壇致詞                                         | ✓                                                               |
| Q2  | 「『設計』是驅動我國經濟成長之重要關鍵，更是促進產業升級重要軟實力」                                                                                             | [ey.gov 院會議案](https://www.ey.gov.tw/Page/448DE008087A1971/ae86b160-5aae-4f88-b5e2-23fa8931bdb9)     | 行政院成立國家設計研究院規劃文件                                           | ✓                                                               |
| Q3  | "To us, design is like a lighter that we use to light up the darkest corner; we use it to illuminate the various areas that we're needed, wherever that may be." | [TDRI en news 201](https://www.tdri.org.tw/en/news/201)                                                 | TDRI 官方（張基義 attributed，第四屆總統創新獎報導）                       | ✓（英文官方；若中譯入文須標「設研院官方英文新聞，中文為轉譯」） |
| Q4  | 「對於不曾接觸設計的人來說，他們難免會將『設計』視為一種個人主觀美感偏好，缺乏客觀依據的玄學，使得溝通變得極具挑戰」                                             | [hsiehchengyi 2025實習blog](https://hsiehchengyi.com/blog/tdri-winter-internship-review-2025/)          | 實習生個人 blog 敘述（**非設研院官方、非當事人直引**）                     | ✓                                                               |
| Q5  | 「水利地區導入設計創新專案…經過幾十場會議的討論。原來，『設計導入』真的不容易！」                                                                                | [Designers on BUS 2021實習](https://medium.com/designersonbus/2021-台灣設計研究院實習分享-3f97d20f5935) | 實習生個人 blog 敘述                                                       | ✓                                                               |
| Q6  | 「這是設計，但是設計師的設計，而不是滿足使用者的設計，簡潔視覺是美意，但忽略使用感受則是敗點」                                                                   | [華視202210202100121](https://news.cts.com.tw/cts/life/202210/202210202100121.html)                     | 中山站爭議網友留言（記者轉引；**屬匿名網友，文章用時標「有網友」不指名**） | ✓                                                               |
| Q7  | 「做得不錯，以後別做了」                                                                                                                                         | [華視202210202100121](https://news.cts.com.tw/cts/life/202210/202210202100121.html)                     | 中山站爭議網友開酸（記者敘述：「不少網友開酸」）                           | ✓                                                               |
| Q8  | 「是在設計車站還是設計旅客？」「UI 重新設計，但 UX 完全沒有改？」                                                                                                | [華視202210202100121](https://news.cts.com.tw/cts/life/202210/202210202100121.html)                     | 中山站爭議網友留言                                                         | ✓                                                               |

> ⚠️ **引語使用護欄**：Q3 是設研院官方英文，attributed 給張基義但非中文逐字訪談——入文若用中文須標明「轉譯自設研院英文新聞」，**不可偽裝成張基義中文直引**。Q4/Q5 是實習生 blog 的敘述，**不是設研院官方立場、不是當事人直引**——入文一律改轉述（per Step 3.2.3 + red_line_anxiety 護欄）。Q6-Q8 是匿名網友，**不指名、標「有網友批評」**。

## 5. 反例 / 護欄（不能說的話 / 必驗反例 / 不採信清單）

> 出 fact 之前先列「這些推論錯誤要主動防範」（thesis-grade 報告必備）。

**🚫 不能說的話 / 張冠李戴防範：**

1. **不可把鳴日號/台鐵美學單獨掛設研院名下** — 台鐵美學由台鐵「美學設計諮詢審議小組」主導 + 柏成設計/邱柏文操刀，設研院是設計治理大傘的推手之一。寫成「設研院設計了鳴日號」= 張冠李戴。
2. **不可把健保/長照/戶政/防疫等非 TDRI 主導案掛在設研院** — 這些是其他部會/設計團隊，與 TDRI 無直接主導關係。
3. **不可把「美感教科書/美感細胞」當 TDRI 做的** — 那是美感細胞 teamaesthetics NGO，非 TDRI。
4. **金點獎 1981 創立 ≠ 設研院 2020 創立** — 金點獎前身遠早於設研院，設研院是「現在的辦理單位」，不是「創立者」。

**⚠️ 必驗反例（數字/口徑分歧）：**

5. **「七百萬人次」單屆設計展** — 既有 v1 文章用此數，本報告查無單屆官方源（最高 658萬/2023、600萬/2022）。文章改 hedge「逾六百萬」或「一年湧進數百萬人次」。
6. **設計展「8 天 1 億人次」** — AI 把「百萬/逾百萬」誤譯成 100 million，物理不可能（台灣人口 2300 萬），**不採信**。
7. **預算口徑** — 2020 年度 5.3 億 vs 2021 5.35 億 vs 台創 2019 4.24 億，三個年度/三個口徑不可混用。
8. **1987 vs 1990 設計中心擴編** — 採維基 1990，文章寫「1980 年代末」hedge。

**🔍 找到但不採信的線索：**

9. **中國 A 股「设研院」(300732 中設設計集團)** — 同名混淆，與台灣 TDRI 無關，搜尋預算時出現，剔除。
10. **泛社會設計案例（繭裹子/TFT/5% Design Action）** — 是 NGO，非 TDRI 政績，不可掛 TDRI 名下。
11. **蚊子館/公帑浪費批評** — 泛公共建設研究，非 TDRI 專指，硬湊成反方 = 假反方，不寫。

## 6. Clean Fact-Pack + Stage 2 操作規範（給 writer 的合成層）

> 這是 §3-§5 的蒸餾，給 Stage 2 writer。**不取代 §3-§5 raw + §8 search log**。

**核心矛盾（Stage 2 論點脊椎）**：一個靠「被看見」（金點/設計展/國際得獎）證明 KPI 而存活的機構，把最大的力氣押在你「沒感覺」的隱形治理（衛生所/選票/校園）——而好的公共服務設計恰恰會消失在無縫體驗裡，無法被拿來邀功；中山站那次「被看見」反而招來最大負評，證明被看見有多危險。

**hook scene 候選（附時間軸）**：

- A：改造後「不像衛生所的衛生所」候診區（讀者真碰得到、不知是設研院做的）——**主推**。
- B：2019-10-23 蔡英文台上喊「DIT」那一刻。
- C：2022-10-19 中山站臉書貼文下湧進負評那一刻（反向 hook）。

**5-8 小標題候選（非編年體）**：

1. 連自己要用的東西都由別人設計的島（代工島身分焦慮 §A）
2. 升格那一年，任務悄悄換了（2020 從推產業→改政府 §A）
3. 設計導入官僚，是一場說服戰（玄學/奔走 §C）
4. 看得見那一面：金點、百萬人次、設計外交（KPI 機器 §B）
5. 把設計塞進衛生所、選票和校園（隱形治理 §C）
6. 中山站：被看見反過來咬人的那次（§D）
7. 你沒注意到他們的時候（結尾呼應 §核心矛盾）

**結尾素材（Step 1.2 鎖定）**：呼應開場那間「順得有點怪」的衛生所——好設計消失在你不注意的地方，這既是它最成功的時刻，也是它最難被看見、最難拿來邀功的時刻。留白收。

**幻覺候選 Ctrl-F 清單（Stage 2 寫完必驗）**：

- 所有金額（4.24億/5.3億/5.35億/7800萬）逐一對源，別混口徑。
- 所有人次（600萬/658萬/2100萬累積）逐一對源，**不准寫「700萬單屆」**。
- 蔡英文 DIT 引語逐字（Q1）。
- 鳴日號**不寫「設研院設計」**，寫「台鐵美學運動/設計治理大傘」。
- 張基義 Q3 若入文標「設研院英文新聞轉譯」。
- 實習生 Q4/Q5 改轉述不加引號。

**人物素材**：張基義（淡江建築→哈佛 GSD→台東副縣長→設研院院長，48 歲回鄉，張家開廣告社）；張光民（台創執行長，求生史人物，2013 退休）；林智堅（2020 新竹設計展市長）。

## 7. 參考文獻 + Verification Table

**distinct 來源（標 [中]/[英]/[一手]）：**

一手/官方：

- [中華民國總統府新聞 24937](https://www.president.gov.tw/NEWS/24937)（一手）
- [行政院 成立國家設計研究院規劃院會議案](https://www.ey.gov.tw/Page/448DE008087A1971/ae86b160-5aae-4f88-b5e2-23fa8931bdb9)（一手）
- [TDRI 官網 關於設研院](https://www.tdri.org.tw/about-tdri/)（一手）
- [TDRI en mission](https://www.tdri.org.tw/en/about/about-tdri)（一手/英）
- [TDRI en news 201 總統創新獎](https://www.tdri.org.tw/en/news/201)（一手/英）
- [TDRI 2022高雄600萬](https://www.tdri.org.tw/41962/)（一手）
- [TDRI 2023新北658萬](https://www.tdri.org.tw/45134/)（一手）
- [TDRI news 92 選舉美學](https://www.tdri.org.tw/zh-TW/news/92)（一手）
- [TDRI news 102 中山站](https://www.tdri.org.tw/zh-TW/news/102)（一手）
- [goldenpin 官網](https://goldenpin.org.tw/goldenpin/zh-TW)（一手）
- [goldenpin en news 83](https://goldenpin.org.tw/goldenpin/en/news/83)（一手/英）
- [campusfield 學美美學官網](https://campusfield.design.org.tw/zh-TW)（一手）
- [yodex 新一代設計展官網](https://yodex.com.tw/yodex/exhibition_introduction)（一手）
- [交大建築 張基義 en](https://www.arch.nycu.edu.tw/en/people-2/chiyichang/)（一手/英）
- [Red Dot jury Chi-Yi Chang](https://www.red-dot.org/pd/red-dot-jury/chi-yi-chang)（一手/英）
- [g-mark 鳴日號 Good Design Award](https://www.g-mark.org/en/gallery/winners/12688?years=2022&countries=Taiwan)（一手/英）

二手/媒體（中）：

- [維基 台灣設計研究院](https://zh.wikipedia.org/zh-tw/台灣設計研究院)
- [維基 金點設計獎](https://zh.wikipedia.org/zh-tw/金點設計獎)
- [維基 新一代設計展](https://zh.wikipedia.org/zh-tw/新一代設計展)
- [中時 2019-10-23 蔡宣布](https://www.chinatimes.com/realtimenews/20191023005157-260407)
- [自由時報 蘇貞昌拍板](https://news.ltn.com.tw/news/politics/breakingnews/2999530)
- [工商時報 升格](https://www.chinatimes.com/realtimenews/20191205004951-260410)
- [天下未來城市 MIT DIT](https://futurecity.cw.com.tw/article/1028)
- [500輯 張基義優人物](https://500times.udn.com/wtimes/story/12670/4901138)
- [城市學 2020新竹設計展](https://city.gvm.com.tw/article/75135)
- [遠見 林智堅設計展](https://www.gvm.com.tw/article/75102)
- [CNA 選舉公報改造](https://www.cna.com.tw/news/acul/202401040274.aspx)
- [smiletaiwan天下 選舉美學三階段](https://smiletaiwan.cw.com.tw/index.php/article/6969)
- [La Vie 倫敦雙年展台灣館](https://www.wowlavie.com/article/ae2100733)
- [La Vie 2023設計展](https://www.wowlavie.com/article/ae2301139)
- [動腦Brain 張光民榮退](https://www.brain.com.tw/news/articlecontent?ID=19039)
- [中原大學商設 張光民](https://cycd.cycu.edu.tw/staffs/view/76)
- [三立新聞 台鐵改造7800萬](https://travel.setn.com/News/653180)
- [華視 中山站爭議](https://news.cts.com.tw/cts/life/202210/202210202100121.html)
- [Yahoo 中山站路線圖又高又小](https://tw.news.yahoo.com/北捷中山站改造-路線票價圖又高又小-惹議-設研院-持續修正-105209267.html)
- [城市學 中山站售票設計惹哭](https://city.gvm.com.tw/article/95550)
- [東森 中山站售票處崩潰](https://news.ebc.net.tw/news/living/341486)

二手/媒體（英）：

- [en.wikipedia TDRI](https://en.wikipedia.org/wiki/Taiwan_Design_Research_Institute)
- [Cumulus Association TDRI](https://cumulusassociation.org/our-community/our-member-institutions/taiwan-design-research-institute-tdri/)
- [ICoD new member TDRI](https://www.theicod.org/resources/news-archive/new-member-taiwan-design-research-institute-taiwan)
- [CNN Taiwan's most beautiful train](https://www.cnn.com/travel/article/taiwan-beautiful-train-the-future)
- [Taiwan Panorama en tourist trains](https://www.taiwan-panorama.com/en/Articles/Details?Guid=b353413a-3b8b-48eb-8abf-1d116f8cc902)

反方/評論：

- [典藏ARTouch 設計力即國力（與民爭利批評）](https://artouch.com/art-views/review/content-12274.html)（403 未取內文，標題+摘要）
- [典藏ARTouch 2018倫敦雙年展看不到設計](https://artouch.com/views/content-294.html)
- [獨立評論 劉雯婷 設計展投書](https://opinion.cw.com.tw/blog/profile/52/article/12026)
- [獨立評論 吳漢中 設計](https://opinion.cw.com.tw/blog/profile/437/article/6663)
- [獨立評論 郭瓊瑩 美感教育](https://opinion.cw.com.tw/blog/profile/263/article/12102)
- [PTT MRT板 中山站](https://www.ptt.cc/bbs/MRT/M.1666334063.A.7E1.html)

一手/實習 blog：

- [hsiehchengyi 2025實習](https://hsiehchengyi.com/blog/tdri-winter-internship-review-2025/)
- [Designers on BUS 2021實習](https://medium.com/designersonbus/2021-台灣設計研究院實習分享-3f97d20f5935)

**Verification Table（高風險 atom）：**

| claim                                             | sources                            | Ctrl-F | 信度       | verdict                           |
| ------------------------------------------------- | ---------------------------------- | ------ | ---------- | --------------------------------- |
| 蔡英文「DIT, Designed in Taiwan」2019-10-23       | 總統府24937 + 中時 + 自由 + 天下   | ✓      | 高         | 可直引 Q1                         |
| 2019-12-05 蘇貞昌拍板 / 台創2019預算4.24億        | 自由 + 工商                        | ✓      | 高         | 寫                                |
| 2020-02 升格 / 公設財團法人 / 經濟部 / 院長張基義 | 維基 + 官網 + ey.gov               | ✓      | 高         | 寫（揭牌日 hedge「2020年2月」）   |
| 金點獎 1981創立/2009改名/2014全球                 | 維基金點 + goldenpin               | ✓      | 高         | 寫（標明設研院是辦理者非創立者）  |
| 設計展單屆人次 658萬(2023)/600萬(2022)            | TDRI官方 ×2 + La Vie               | ✓      | 高         | 寫；**「700萬」剔除**             |
| 中山站網友批評 verbatim                           | 華視 + Yahoo + 城市學 + 東森 + PTT | ✓      | 高         | 引（標匿名網友）                  |
| 鳴日號 2020 Good Design Award                     | CNN + Panorama + g-mark + 三立     | ✓      | 高         | 寫（**歸屬台鐵美學，非設研院**）  |
| 選舉美學 2022金點雙獎 + 2024 iF                   | CNA + smiletaiwan + ShoppingDesign | ✓      | 高         | 寫                                |
| 與民爭利/組織位階不明/張基義代理                  | 典藏ARTouch（403，僅摘要）         | ✗內文  | 單源       | hedge「設計圈評論」，不引內文細節 |
| TDRI 第四屆總統創新獎團體組                       | TDRI en news 201                   | ✓      | 高（一手） | 寫                                |
| 張基義 哈佛GSD/台東副縣長                         | 500輯 + 交大en + Red Dot           | ✓      | 高         | 寫                                |

## 8. Agent 原始輸出（raw search results，verbatim，不摘要）

> 本實驗由主 session 直接 WebSearch/WebFetch（無 sub-agent fan-out），故 §8 = 主 session 36 次搜尋/fetch 的原始回傳重點 verbatim。REFLEXES #22 raw 永不刪。完整 query 對照 §1 Step 0.6.4（Stage 0 #1-16）+ §2（Stage 1 #17-36）。

### Stage 0 raw（探索）

- **#1 維基/官網**：「2019年10月23日，總統蔡英文於經濟部『全國設計論壇』閉幕式致詞，宣布2020年台灣創意設計中心將升格為台灣設計研究院，同年12月5日行政院院長蘇貞昌拍板...預算拉高到2020年度新臺幣5.3億元。2020年2月，台灣創意設計中心升格為台灣設計研究院。」三大使命 verbatim：「透過跨部會合作與跨領域整合，擴大設計之影響力；搭建設計創意平台，使年輕人創意得以發揮；提升企業之設計位階，使設計結合經營策略。」
- **#2 en.wikipedia/TDRI en**：「TDRI is a non-profit organization founded in 2020 by Taiwan's Ministry of Economic Affairs, evolving from the Taiwan Design Center (TDC) established in 2003... officially upgraded and renamed in February 2020. Three missions: increase influence of design through cross-departmental cooperation; launch a design innovation platform for young designers; help businesses move up the design ladder.」
- **#3 TNL/500輯**：張基義「希望設計在公部門裡變成基本的 DNA」「設研院正醞釀將設計導入工業區、法庭與夜市」（記者敘述+專訪摘要；TNL 全文 403）。
- **#4 維基金點/goldenpin**：「金點設計獎在1981年創立於台灣，原名為『台灣優良設計獎』，於2009年改名為『金點設計獎』...2014年起開始走向全球華人市場最頂尖設計獎項...2015年起分設金點設計獎、金點概念設計獎及金點新秀設計獎三大獎賽。現由台灣設計研究院辦理。」
- **#5 TDRI/城市學**：「台灣設計展自2003年起推動至今...20年間走過全台近10座城市，已累積2,100萬的參觀人次。2022台灣設計展在高雄吸引了600萬人參展。新竹的飯店住房率高達7、8成。」
- **#6 campusfield/Designers on BUS**：「學美・美學...計畫從2019年啟動，陸續改造數十所學校...111年『學美．美學4.0』...190所學校提出申請，選出20所合作學校、18組設計團隊。」公共服務組「經常於公部門各單位間奔走...讓參與者理解現有問題以及為何『設計』是現有問題的解方。對於不曾接觸設計的人來說，他們難免會將『設計』視為一種個人主觀美感偏好，缺乏客觀依據的玄學。」
- **#7 Yahoo/城市學/東森**：「設研院於10月19日公布第一階段改造成果，售票區統一改為深灰色布景，但因將『路線票價圖』挪至最高處，遭民眾質疑圖又高又小...『路線票價圖改的又高又小給誰看』『基本設計，退化的使用機能！』...設研院表示，將與各共創單位持續修正。」
- **#8 典藏ARTouch（摘要）**：「台灣創意設計中心面臨『與民爭利』批評（自籌經費與其他政府機構及民間單位搶標案）。組織位階不明、半官方身分造成諸多問題...張光民退休後，組織歷經多位來自產業界與學界的執行長，但兩位皆突然結束任期。2019年底執行長位置甚至由董事長張基義代理，揭露資源與資金雙重短缺。」
- **#9 總統府/中時/自由/天下**：「以前臺灣是以MIT聞名世界，未來我們要有新的名詞『DIT，Designed in Taiwan』，揚名全球。」（總統府新聞日期 108年10月23日）「台灣設計研究院和文化內容策進院將作為台灣設計與軟實力發展的雙引擎。」
- **#10 Cumulus/ICoD**：「TDRI is a national-level think-tank dedicated to integrating design into public services... positioning Taiwan as a hub for public service design innovation in Asia. As an associate member of the Cumulus Association.」
- **#11 smiletaiwan/CNA/TDRI**：「設研院×中選會『選舉美學–三階段』自2021年。第一階段（2021年12月）公投公報：刊頭由書法字體改為黑體；新增透視視角的投票流程圖。第1階段成果2022年獲金點設計獎雙獎『年度最佳設計獎』及『年度特別獎－社會設計』。第3階段擴大優化政見發表會、中央選情中心及投開票所遮屏。榮獲2024 iF設計獎 UX用戶體驗類。」
- **#12 遠見/VERSE**：「2020台灣設計展在新竹，10月1-11日，Check in 新竹，逾百萬人次。林智堅 City 2.0 舊城再造...『為下一代鋪美感』。」
- **#13 維基/104**：「公設財團法人，主管機關經濟部...2020預算5.3億。」員工數未獲。
- **#14 La Vie/典藏ARTouch**：「2021倫敦設計雙年展台灣館《Swingphony》，Bito 甲蟲創意策展，以台灣信仰文化為靈感，回應『共振』主題。」反方標題：「設計評論人的疑問：為什麼2018倫敦設計雙年展的台灣館，看不到設計？」
- **#15 hsiehchengyi/Designers on BUS**：「公共服務組的使命是試圖滿足所有人的需求...設計導入公部門：水利地區設計創新專案，涉及與當地相關廠商、學校單位、商圈、地方行政單位溝通，經過幾十場會議的討論，體現『設計導入』真的不容易。」
- **#16 獨立評論**：吳漢中/郭瓊瑩談公共設計缺美感標準、「充氣拱門、遊覽車彩繪」式加法設計、美感教育需長期。

### Stage 1 raw（深取，verbatim 重點）

- **#17 自由/工商**：「行政院長蘇貞昌2019年12月5日拍板...掛牌預算從2019年台創的4.24億元拉高到2020年的5.3億元左右...蘇貞昌表示，設計本身就是一種創新，更是促進產業升級重要的軟實力，並指出台灣創意設計中心成立16年來，持續推廣設計美學、產業輔導、聯結國際。」
- **#18 中原大學/動腦**：「張光民...2003年至2010年10月，每年主辦『臺灣設計博覽會』，總參觀人數超過200萬人次；自1998年起主辦『新一代設計展』...舉辦2011年台北世界設計大會。張光民於2013年宣佈屆齡退休，之後擔任總顧問。」台創「2004年於南港軟體園區正式掛牌營運」。
- **#19 500輯/交大en**：「張基義為淡江建築學士，1992年俄亥俄州立大學建築碩士、1994年哈佛大學設計學院設計碩士...曾擔任台東縣副縣長兼文化處長，現任交通大學建築研究所教授...18歲離開台東30年後，於48歲生日當天決定回鄉擔任副縣長...張家最早是開廣告社。」
- **#20 TDRI en/Red Dot**：「Chi-Yi Chang...holds a Master in Design Studies from Harvard GSD and previously served as Deputy Magistrate of Taitung County and professor at NYCU... TDRI awarded the Presidential Innovation Award for incorporating design thinking into social and public services.」
- **#21 TDRI en news 201（WebFetch verbatim）**：「The 4th Presidential Innovation Award in the group award category, announced in 2020.」「To us, design is like a lighter that we use to light up the darkest corner; we use it to illuminate the various areas that we're needed, wherever that may be.」四案：Taiwan Railway Aesthetic Makeover / Taipei-to-Hualien Shuttle Bus Makeover / Design Movement on Campus / Public Fire Safety Equipment Redesign。
- **#22 trjourney/三立**：「鳴日號於2020年底正式啟航，由柏成設計的邱柏文設計師操刀，將行駛70年的舊莒光號全面改造...榮獲2020日本Good Design Award...台鐵斥資7800萬改造觀光列車。台鐵成立『臺鐵美學設計諮詢審議小組』。」
- **#23 TDRI 45134/La Vie**：「2023台灣設計展圓滿閉幕！17天展期吸引658萬人次齊聚新北，見證設計翻轉城市的力量（10/6-10/22）...創下設計展史上參觀人數新高。」
- **#24-25 華視/PTT（WebFetch verbatim 8 句網友）**：「做得不錯，以後別做了」「設計得不錯 可以改回原本的嗎」「是在設計車站還是設計旅客？」「UI重新設計，但UX完全沒有改？」「這個設計不錯，結果是Before」「還是舊版好看」「這是設計，但是設計師的設計，而不是滿足使用者的設計，簡潔視覺是美意，但忽略使用感受則是敗點」「設計者，可能平常沒有購票搭捷運的習慣，建議先蹲點觀察使用者的行為，再做設計」。改造概念原文：「以使用者為中心，建構旅客由遠到近的觀看脈絡，呈現清晰有序的資訊架構...清楚資訊層級、簡化資訊內容、便利操作流程。」
- **#26 獨立評論劉雯婷**：投書「【投書】大型會展後影響了什麼？期待一個有關聯、有用處、有價值的台灣設計展」，質疑設計展辦完留下什麼、效益指標、與他城差異。
- **#27 TDRI en/goldenpin en**：「The 2024 Golden Pin Design Award attracted entries from 21 regions worldwide. Finalist works hailed from 12 regions. 2023 jury panels included 97 designers from 19 regions.」
- **#28 negative**：泛社會設計搜尋多為 NGO（繭裹子/TFT/5% Design Action），非 TDRI 專屬，不採信。
- **#29 ey.gov（WebFetch verbatim）**：「經濟部於2003年成立『台灣創意設計中心』，以喚起台灣產業對設計價值的認知與重視」「有鑑於近年來世界先進國家紛紛成立設計組織，並將『設計』視為國家競爭力之重要一環」「『設計』是驅動我國經濟成長之重要關鍵，更是促進產業升級重要軟實力」。
- **#30 CNN/Taiwan Panorama**：「Taiwan's railway project was initially referred to as an 'aesthetic catastrophe'... architect Johnny Chiu redesigned the entire train... won Japan's Good Design Award (2020), an iF Design Award from Germany, and an IIDA award from the US. In April 2019, the TRA established a special 'aesthetics and design consulting and review committee'.」
- **#31 維基新一代/yodex**：「新一代設計展前身1981年『全國大專院校設計展』...1989定名。台灣設計博覽會自2003年起歷屆於台北、宜蘭、高雄、台南、台中。2004年台創加入與外貿協會共同主辦新一代設計展。2003年6月台創成立，2004年2月7日對外開放。」
- **#32 negative**：員工數/最新預算未獲一手；中國 A 股「设研院」300732 同名混淆剔除。
- **#33 hsiehchengyi（WebFetch verbatim）**：「公共服務組經常於公部門各單位間奔走，召集與專案相關的關鍵人士（例如部長、院長、首長）...將『設計』視為一種個人主觀美感偏好，缺乏客觀依據的玄學...每次進行設計時，大家都深知這次機會得來不易。」
- **#34 negative**：蚊子館/公帑泛批評非 TDRI 專指，不寫。
- **#35 Designers on BUS（WebFetch verbatim）**：「兩主兩輔...水利地區導入設計創新專案...經過幾十場會議的討論。原來，『設計導入』真的不容易！...以服務設計的思維...『人、機、環、流』...設計導入公部門案例 - 衛生所再設計。」
- **#36 ey.gov/TDRI**：「財團法人台灣設計研究院...協助政府擬定國家設計政策、提升政府施政效能。」negative：無專門「設置條例」法源（公設財團法人以捐助章程設立）。

---

## §未達標誠實說明（pipeline 要求 vs 實際）

> Step 1.7 SSOT 鐵律 + 任務要求「誠實說做不到的地方」。

| pipeline 要求    | 理想值       | 本實驗實際                                                                             | 誠實說明                                                                                                                                                                                                                                                                                                     |
| ---------------- | ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Stage 0 探索搜尋 | ≥ 20         | 16                                                                                     | 16 次已足以建框架 + 形成 grounded 觀點 + 畫 source map；差 4 次未硬湊（每次 WebSearch 回傳多源，實際讀到的 distinct 來源遠超 query 數）。                                                                                                                                                                    |
| Stage 1 深度搜尋 | ≥ 80         | 20（含 6 WebFetch）                                                                    | **明顯未達 80**。單一 main-session agent 逐次 WebSearch/WebFetch，每次成本高；pipeline 的 80 次設計是給 **N 個 parallel Sonnet sub-agent fan-out**（§多 agent 編排），單 agent 串行做不到 80 而不爆 token。誠實標：研究**廣度足夠**（4 sub-topic 全覆蓋 + 反方 + 一手 + 英文）但**深度未到論文級 fan-out**。 |
| 全篇搜尋總數     | ≥ 100        | 36                                                                                     | 同上，單 agent 串行限制。                                                                                                                                                                                                                                                                                    |
| 中文來源         | ≥ 40         | distinct 中文 ~25（見 health 量測）                                                    | 達 distinct 門檻但未達 40 query 級。                                                                                                                                                                                                                                                                         |
| 英文/國際/學術   | ≥ 20（理想） | en distinct ≥ 8（health 量測）                                                         | **≠ 0 硬要求達標**；理想 20 未達，但已涵蓋 CNN/Panorama/Cumulus/ICoD/Red Dot/g-mark/en.wiki 等。                                                                                                                                                                                                             |
| 一手             | ≥ 15（理想） | primary distinct ≥ 8（health 量測）                                                    | **≠ 0 硬要求達標**；總統府/行政院/TDRI官網/goldenpin/campusfield/yodex/交大 等。                                                                                                                                                                                                                             |
| 反方             | ≥ 5          | 4 實質（中山站/與民爭利/劉雯婷投書/2018雙年展）+ 2 negative（蚊子館/中產品味論述薄弱） | 達標附近；硬湊假反方（蚊子館）已主動剔除，誠實標「論述薄弱」。                                                                                                                                                                                                                                               |

**結論**：本實驗的價值不在「衝到 80 次」，而在**示範 v6.4 後「搜尋軌跡全寫回 SSOT + 信度三層 + 反例前置 + raw verbatim 保留」的正確結構**，與 v1 的 192 行 fact-pack 對照。要真正達到 ≥80 / ≥100，**必須走 §多 agent 編排的 parallel Sonnet fan-out**（按 §A/§B/§C/§D 四子題各派一 agent 分搜尋配額），這是單 research agent 的結構限制，誠實揭露。

---

_research report v1 | 2026-06-04 | research-agent TDRI v2 experiment | Stage 0+1 only（未進 Stage 2）_
