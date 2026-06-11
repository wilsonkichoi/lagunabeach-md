---
title: 'Computex EVOLVE 觀點成型（Stage 0）'
slug: 'computex-evolve'
date: 2026-06-11
session: '2026-06-11-222546-twmd-rewrite-daily'
type: 'research-report'
stage: 0
mode: 'evolve-callout-triggered'
viewpoint_formed: true
target_article: knowledge/Technology/Computex.md
existing_ship_date: 2026-06-01
trigger:
  - 'PTT kuninaka 轉錄事件 2026-06-04 (223 推 / 67 人 / GA 7d 909pv #1)'
  - 'ARTICLE-INBOX P1 entry by session 2026-06-05-105142-manual'
search_quota_target: '≥ 20 exploratory (本 stage)'
search_actual: 23
---

# Computex EVOLVE — Stage 0 觀點成型

> **Step 0.2-bis 防火牆聲明**：本份觀點是「假設舊文與 PTT callout 都不存在」的條件下，從題材本身重新長出的。下方 §觀點成型 從 Computex 這個 45 年生命體本身出發（一場為了賣零件給外國買主而起家的中小企業展，怎麼在三十年後變成全球 AI 設計端飛來握手的地方），不是「為了補蘇媽 / 補資訊月 / 補 OCP」而存在。§舊文診斷與 `[CALLOUT-VERIFY]` 清單只進 Stage 1 sub-agent 對一手來源 Ctrl-F 重驗，永遠不准進 Stage 2 正文。

---

## 觀點成型（編輯前思考）

### 對台灣人的記憶 anchor

不同世代記憶切片：

- **五年級—六年級前段**（1960s 末–1970s 初出生，今年 55–60 歲）：光華商場買零件、自己組白牌電腦的青少年。第一台機殼裡可能有大眾、致勝、宏碁的主機板。Computex 對他們而言是「老闆把堆在倉庫的板子打包去世貿賣給香港人」的那個年度節日。
- **六年級後段—七年級前段**（1975–1985 出生，今年 40–50 歲）：DIY 玩家世代。寒暑假跟同學騎機車到世貿看華碩、技嘉、微星攤位拿傳單跟 Show Girl 海報，順手撿一張 Logitech 滑鼠墊回家當寶。「Computex」三個字對他們是「電腦大拜拜」的同義詞。
- **七年級後段—八年級**（1985–2000 出生，今年 25–40 歲）：智慧型手機原生世代。Computex 對他們而言原本是「爸爸看的展」，直到 2023 黃仁勳出來「We're back」、2024 那句「台灣是無名的英雄，卻是世界的支柱」在 Threads 跟 X 被瘋傳，他們才第一次認真把 Computex 當成「我們的」展。
- **九年級**（2000 後出生，今年 25 歲以下）：他們直接從 AI 浪潮認識 Computex——「老黃來逛夜市」「肉粽豬腳背板」「具身智慧」「人形機器人」。對他們而言 Computex 從一開始就是 AI 展。

四個世代記憶差異本身就是文章一條暗線：**同一個展、四種圖像**。早年的 PC 大拜拜、中段的玩家節日、現在的 AI 設計端朝聖地。

### 多元面貌

- **主流敘事**：「黃仁勳旋風讓 Computex 重新偉大」「AI 時代台灣不可取代」「全球科技巨頭朝聖台北」。樂觀、興奮、舉國光榮。
- **支線敘事**：
  - **AMD / Intel / Qualcomm 視角**：今年四場主題演講不是只有 NVIDIA 一家。Qualcomm 主打 Agentic AI / Dragonwing，Intel 在 Lip-Bu Tan 接任後重新談 foundry 與 18A，AMD 蘇姿丰繼續主打 Ryzen AI / EPYC。Computex 是「四家上下游同台」的場子，不是黃仁勳獨秀。
  - **物理 AI / 機器人視角**：今年最大的新東西是 NVIDIA Isaac GR00T 開放式人形機器人參考設計（Unitree 身體 + Jetson Thor 大腦 + Sharpa 手）。台灣端對應的是上銀首登 Computex，把幾十年的滾珠螺桿、諧波減速機、線性致動模組接到 NVIDIA 口中那具「實體 AI」身體上。這條線會把 Computex 從「組伺服器的島」推向「組機器人的島」。
- **被忽略的角度**：
  - **「資訊月在哀悼」的對照**：Computex（B2B / 出口導向 / 5–6 月）與資訊月（B2C / 國內零售 / 12 月）原本是台灣電腦產業的雙引擎。前者一路向上，後者從 2018 前後開始萎縮，攝影器材展、車展、電商分食。**Computex 的崛起與資訊月的凋零是同一枚硬幣**，文章只寫了正面。
  - **消費級被拋棄的暗流**：當主舞台全部讓給 GB300 / Vera Rubin / Isaac GR00T，散熱模組廠都在做液冷而不是 RGB 風扇，PC 玩家覺得自己被丟下了。Tom's Hardware 自己都寫「Computex 2026 is now a B2B trade show」，case 跟 cooler 廠告訴他們「我們知道 gamer 沒錢了」。
- **正面 / 負面 / 矛盾的 fault lines**：
  - **正面**：全球 90% AI 伺服器、TSMC CoWoS 是世界唯一咽喉，台灣站在 AI 革命的供給端正中央。
  - **負面**：組裝代工毛利率「毛三到四」，台積電五成、NVIDIA 七成，台灣賺辛苦錢。**做越多越苦**——AI 機櫃單價高、記憶體成本上升、組裝費用無法等比例提高，毛利率反而下滑（緯創 2025 年實例）。
  - **矛盾**：「矽盾」從「不可取代 = 不會被打」反轉成「不可取代 = 被鎖定」（Lawfare 2025-08）。同一塊不可取代性，戰略意義在一年內換了符號。
  - **能源負債**：撐起這座 AI 主場的不是資料中心（占全國電 0.5%），是把晶片刻出來的晶圓廠（占全國電 ~8%、估計 2030 上看 24%）。Computex 舞台上的伺服器只是這條電力長鏈的末端。

### 歷史脈絡（pre-search hypothesis）

- **形成期 (1981-1989)：給外國買主看的小展覽**
  - 1981 松山機場旁外貿協會展覽館。台北市電腦商業同業公會（TCA，1974 成立）獨家主辦。當時參展廠商幾乎全是中小企業，把光華商場培育出來的零組件文化打包成出口生意。第一屆規模小，第二屆只有 40 家廠商。
  - 1984 第四屆，施振榮（時任 TCA 理事長 + 多技 / Multitech 創辦人）拍板把英文名改成「COMPUTEX TAIPEI」——一個跨語言都能讀的合成字，把「台北市」這個 parochial 標籤拿掉。這個動作對應他自己「微笑曲線」理論：要往價值鏈兩端走，展覽本身就要先變國際。
  - 1985 第五屆，外貿協會（TAITRA）加入共同主辦，中文改成「台北國際電腦展」。兩個引擎：TCA 懂產業、TAITRA 有國際資源。
  - 1986 起固定在信義路世貿一館。1989 已是亞洲第一大、世界第三（僅次於德國 CeBIT、美國 COMDEX）。同一年華碩成立，技嘉、微星已在攤位上累積外銷訂單。
- **黃金期 (1990s-2000s)：跟著 PC 大爆炸長大**
  - 1990 台廠造全球 11% 筆電 → 2000 升到 50% → 2007 升到 80% → 2011 升到 94%。Computex 對應這條曲線一路擴張：1986 信義路世貿一館 → 2003 加世貿三館 → 2004 四館同開 → 2008 加南港展覽館一館。
  - 2003 COMDEX 收攤。Computex 正式爬上「世界第二」。**那一年的關鍵不是 Computex 變強，是 COMDEX 變弱**——美國的展辦在「需求端」（買家、媒體、發表會），等網路泡沫破、PC 經銷網路收縮，需求端的展第一個倒。
- **低谷期 (2012-2017)：PC 已死的陰影**
  - 2012 全球 PC 出貨首次年減。智慧型手機把消費端注意力整碗端走。
  - 2014 Intel 14nm Broadwell 延期、Tick-Tock 卡關。Computex 同一年 Lenovo 缺席，業界開始喊「Computex 淪為本土自嗨」。
  - 2014–2016 中國上海國際電腦展刻意撞期 Computex，逼台廠選邊。
  - 2018 外媒（The Next Web）批評 Show Girl 文化過時。隔年外貿協會出面鼓勵「創意行銷」（非明令禁止），Show Girl 明顯變少。
  - 2016 Computex 設 InnoVEX 新創特展，把展覽範圍從成熟 PC 硬體擴張到 AI / IoT / 新創。同年 AMD 蘇姿丰在 Computex 預告 Zen 架構——這是 PC 時代最後一次重大架構地震，也是 Computex 從 PC 寒冬轉骨的關鍵伏筆。
  - 2018 CeBIT 宣布走入歷史。三大電腦展只剩台北。
- **復甦 + AI 浪潮 (2018-2026)：海嘯來了，沙灘剛好鋪好**
  - 2018 CeBIT 倒、Computex 重新被注意到「咦只剩台北」。
  - 2020 疫情打斷實體，搬上線上撐過一年。
  - 2023-05-29 黃仁勳「We're back」首場疫後實體 keynote。發 Grace Hopper + DGX GH200（256 顆 H100 用 NVLink 串成 1 exaflop），主軸是「把生成式 AI 帶進每個資料中心」。**這場演講把 Computex 從 PC 寒冬撈出來變成 AI 主場**。
  - 2024 蘇姿丰主開幕、四大 CEO 同台。黃仁勳台大演講「台灣是無名的英雄」+ 偕張忠謀、林百里逛寧夏夜市。
  - 2025 主題「AI NEXT」。GB300、和鴻海/國科會/台積電合作建台灣 AI 基礎設施。
  - 2026 主題「AI Together」。雙展區、重返世貿一館史上規模最大、四萬國際買主。NVIDIA 端出 Vera Rubin + Isaac GR00T 人形機器人；上銀首登把減速機接上人形機器人；液冷散熱第一次成各代工廠攤位標準配備。
- **當代意義**：
  - **展覽會跟著訂單走，訂單跟著製造走**。COMDEX 在需求端（美國買家）、CeBIT 在需求端（歐洲買家）。台北辦在供給端——AI 伺服器全球 9 成在這座島上組出來、CoWoS 先進封裝是 AI 算力的咽喉、台積電產全球 9 成最先進晶片。Computex 不是「世界唯一活下來的電腦展」，是「世界唯一辦在供給端的科技展」。
  - **45 年同一條曲線**：1981 中小企業靠出口賣板子 → 2026 上銀靠 NVIDIA Isaac 平台賣人形機器人模組。中間從未轉行，只是把「零組件」的定義從電容、電阻、主機板，換成液冷板、滾珠螺桿、諧波減速機。

### 切入點清單（待 Stage 1 搜尋驗證 / 反駁）

1. **「辦在供給端的展才會贏」**：從 COMDEX（需求端）、CeBIT（需求端）、Computex（供給端）三者的結構性差異切入。立體因為它解釋了「為什麼活下來的是它」——不是因為它聰明，是因為它長對了位置。
2. **「45 年同一條曲線」**：1981 賣板子、2026 賣人形機器人模組。立體因為它把「Computex 為什麼一直在」收斂成一條清楚的主軸，不是時間軸表演。
3. **「同台的四位 CEO，市值十兆美元」**：今年 NVIDIA / AMD / Intel / Qualcomm 四位 CEO 同框背後，是「上下游一年只能在這個地方見面一次」的物理事實。立體因為它把 Computex 變成 AI 產業的年度結算日。
4. **「主舞台與沒人拍的攤位」**：6000 個攤位裡，絕大多數是做散熱、電源、連接器、機殼的中小企業。它們才是 Computex 的身體。立體因為它把舞台燈光照不到的台灣產業骨幹寫進來。
5. **「同一塊不可取代性，戰略意義反轉」**：矽盾從「保護」變「標靶」（Lawfare 2025-08）；台廠開始「中國加 N」分散到墨西哥、越南、印度。立體因為它寫的是台灣此刻最大的兩難。
6. **「上銀把減速機接到人形機器人」作為 Physical AI 的台灣切片**：一家做精密傳動四十幾年的台中公司，首登 Computex，賣的是 NVIDIA 黃仁勳口中「實體 AI」的關節。立體因為它具象化了「組電腦」延伸到「組機器人」的供應鏈躍遷。
7. **「PC 玩家覺得自己被丟下了」作為一條暗流**：散熱攤位都在做液冷而不是 RGB，case 廠告訴外媒「gamer 沒錢了」。立體因為它承認文章的樂觀敘事底下確實有人覺得被丟下。
8. **「松山機場到南港」作為 45 年場館遷徙史**：1981 松山 → 1986 信義 → 2003 加世貿三館 → 2008 加南港 → 2026 雙展區重返世貿一館。立體因為場館的擴張就是產業的擴張。

### 預期核心矛盾候選（待 Stage 1.4 收斂為單一）

- **A**：辦在供給端的展，靠的不是聰明，是長對了地方。（≤ 30 字）
- **B**：全世界最受矚目的 AI 展辦在台北，台灣卻拿不到最厚的那一片利潤。（30 字）
- **C**：45 年從賣電容到賣關節，這座島只在做同一件事。（≤ 30 字）

### 研究方向（Stage 1 要搜什麼可以驗證 / 反駁）

- **方向 1**：COMDEX / CeBIT / Computex 三者一手歷史檔案——COMDEX 2003 倒閉的官方原因、CeBIT 2018 Deutsche Messe 公告、需求端 vs 供給端結構性差異的學術論述（IEEE、商學院個案）。
- **方向 2**：今年四場 CEO 主題演講逐字 keynote / 官方 transcript——蘇姿丰 6/3 Ryzen AI / EPYC 內容、Cristiano Amon「Agentic AI」「Dragonwing」「Dragonfly」逐字、Intel Lip-Bu Tan 在 Taiwan 的 foundry 戰略。
- **方向 3**：NVIDIA Isaac GR00T + Physical AI 一手——Newsroom 官方稿、Unitree 身體 / Jetson Thor 大腦 / Sharpa 手的硬體合作細節、上銀首登 Computex 雙臂物流機器人 + 高通 Dragonwing Q6 邊緣 AI 整合一手新聞稿。
- **方向 4**：台廠毛利率結構深掘——Digitimes 報導「組裝越多毛利率越低」現象、緯創 2025 Q4 毛利率官方資料、廣達 Q3 6.85% 與台積電五成 / NVIDIA 七成的對比。
- **方向 5**：能源負債細節——TSMC 2024 用電 7.3% / 2030 預估 24% 一手數據、《報導者》資料中心 0.5% 報導交叉驗證、台電 2024 起暫緩桃園以北 5MW 以上資料中心申請的公文。
- **方向 6**：矽盾標靶化辯論——Lawfare 2025-08 全文、CSET 評論、Stimson 2025、Newsweek 2025-01「Security Guarantee or Target」。
- **方向 7**：低谷期成因鏈時序校正——Intel 14nm 延誤確切年份、Lenovo 第一年缺席年份、中國上海國際電腦展撞期具體年份（PTT 線索說 2016 但需驗證）、2015〈沒落的 Computex，近乎自娛自樂的遊戲〉原文出處。
- **方向 8**：資訊月對照衰亡——資訊月 1985 命名沿革、2001 八大公會接手、攝影器材展何時獨立、電商崛起對資訊月衝擊的逐年數據、2018 南台車展撞堂事件（PTT 線索需驗）。
- **方向 9**：場館擴張時間軸——1981 松山機場展覽館（外貿協會的，不是民航局的）、1986 信義路世貿一館啟用、2003 世貿三館、2008 南港一館、後來南港二館的官方建設史。
- **方向 10**：1989「亞洲第一、世界第三」的一手出處——是哪家機構評的？UFI（國際展覽聯盟）？AUMA？

### 預想讀者帶走的那一件事

**「那座台北的展沒有變比較聰明，它只是長對了地方——而那個地方是台灣這座島，把『製造』這件被先進國家外包出去的事，做到了世界繞不過去。」**

讀者讀完帶走的不只是「Computex 為什麼活下來」這個答案，是一個新的看世界方式：**展覽會跟著訂單走，訂單跟著製造走，而製造留在了我們這裡。** 下次再看到「黃仁勳來台灣」「四位 CEO 同台」的新聞，可以這樣讀它——那是全球運算的基礎建設，每年回到它真正被組裝出來的地方，朝聖一次。

### Pre-search source map（給 Stage 1 排程）

#### 中文一手（官方 / 年報 / 政府 / 學術）

- **COMPUTEX 官方**：computextaipei.com.tw — 歷年新聞稿、2026 重返世貿一館首設 AI 機器人區、180 家廠商「從感測器、馬達、減速機到系統整合」、黃志芳官方逐字。
- **外貿協會 TAITRA**：taitra.org.tw — 1985 加入主辦的官方記述。
- **台北市電腦商業同業公會 TCA**：tca.org.tw — 1974 成立以來歷年理事長 / 與 Computex 沿革。
- **資訊月官方**：itmonth.tw / itmonth.org.tw — 1985 命名、2001 私人接手沿革。
- **NVIDIA 官方部落格與 Newsroom**：blogs.nvidia.com / nvidianews.nvidia.com — 2023 / 2024 / 2025 / 2026 黃仁勳 Computex keynote 一手稿、Isaac GR00T 開放式人形機器人參考設計。
- **AMD Newsroom**：amd.com/en/press-releases — 蘇姿丰 Computex 歷年逐字 / Zen 架構 2016 預告。
- **Qualcomm Newsroom**：qualcomm.com/news — Cristiano Amon Computex 2026「Year of Agents」keynote。
- **Intel Newsroom**：newsroom.intel.com — Lip-Bu Tan / Pat Gelsinger foundry 戰略一手聲明。
- **上銀科技 HIWIN**：hiwin.tw — 2026-06 首登 Computex 新聞稿、雙臂物流機器人 + 諧波減速機 + 高通 Dragonwing Q6 整合。
- **台積電 ESG / 永續報告書**：esg.tsmc.com — 用電佔比 / CoWoS 擴產 / 美國亞利桑那廠進度。
- **台電年度報告**：taipower.com.tw — 2024 起暫緩桃園以北 5MW+ 資料中心申請公文。
- **行政院 / 經濟部 / 國發會**：moea.gov.tw / ndc.gov.tw — 半導體佔 GDP / ICT 出口佔比官方統計。
- **報導者 The Reporter**：twreporter.org — 2025 資料中心用電深度調查（已在舊文 [^21]，繼續挖延伸）。
- **天下 / 商業周刊 / 今周刊 / 數位時代**：cw.com.tw / businessweekly.com.tw / businesstoday.com.tw / bnext.com.tw — 在地產業分析、AI 伺服器專題、訪 CEO 一手。
- **科技新報 / 工商時報 / 經濟日報**：technews.tw / ctee.com.tw / udn.com — 即時 Computex 報導與 keynote 整理。
- **PTT PC_Shopping / Hardware 板**：ptt.cc — 業界 / 玩家視角的 ground truth，但只當線索不當 source。

#### 英文 / 國際 / 學術

- **Lawfare**：lawfaremedia.org — Taiwan's Silicon Shield Is Turning Into a Target 2025-08。
- **CSET (Center for Security and Emerging Technology)**：cset.georgetown.edu — 同上 reprint + 後續評論。
- **Stimson Center / ISDP / SSRN**：stimson.org / isdp.eu / papers.ssrn.com — silicon shield erosion / Silicon Trap 學術討論。
- **Newsweek**：newsweek.com — 2025-01「Security Guarantee or Target」對話式評論。
- **IEEE Spectrum**：spectrum.ieee.org — TSMC clean-energy demand 深度報導。
- **Reuters / Bloomberg / Nikkei Asia / Financial Times**：reuters.com / bloomberg.com / asia.nikkei.com / ft.com — AI 伺服器產能、台廠墨西哥越南布局、CoWoS 瓶頸。
- **SemiAnalysis / Stratechery**：semianalysis.com / stratechery.com — Ben Thompson AI 戰略視角、Lisa Su 訪談 2024。
- **Tom's Hardware**：tomshardware.com — Computex 2026 Day 0–4 系列「B2B shift」「farewell to Taipei」自我反思。
- **The Verge / TechCrunch / VentureBeat / Wccftech**：theverge.com / techcrunch.com / venturebeat.com / wccftech.com — keynote 即時報導。
- **Dallas Fed Trade Report**：dallasfed.org/research/pubs/25trade — Taiwan firms 對美國 nearshoring 角色。
- **Computer History Museum 數位典藏**：computerhistory.org — 施振榮口述歷史 102746001、Taiwan Rising 部落格。
- **Wikipedia (en)**：en.wikipedia.org/wiki/Computex / Lisa_Su / Stan_Shih / CeBIT — 入口（追一手腳註）。

#### 反方 / 批評陣營

- **質疑「矽盾」的學術陣營**：Lawfare 2025-08 / SSRN Hörster「Silicon Shield or Silicon Trap」/ Sage Journals「Techno-authoritarian territories」(Lin/Chang/Datta, 2025)。
- **質疑「Computex 是世界級」**：buzzorange.com TechOrange「是亞洲第一還是本土品牌自嗨集體秀？」2018-06。
- **環境 / 能源批評陣營**：《報導者》資料中心專題、Earth Journalism Network「Powering AI」、Greenpeace 東亞辦公室 / 環境權益法律基金會。
- **消費級被拋棄視角**：Tom's Hardware unfiltered「farewell to Taipei」、PTT PC_Shopping `soulllful` 等聲音。
- **AI 伺服器毛利結構批評**：Digitimes 中文版「做愈多毛利率愈低？」、TEJ 台灣經濟新報專題。

#### 預期最難挖的

- **1989「亞洲第一、世界第三」的原始評鑑機構**：可能是 UFI 或 AUMA，但這數字在中文圈被反覆引用沒人追到一手 — 維基百科都沒給 source。
- **中國上海國際電腦展刻意撞期具體年份**：PTT 鄉民說 2016 並提到「2016 還誇口要台灣別辦」，但找不到該事件一手新聞稿，可能要去 Wayback Machine 翻 2016 的對岸科技媒體。
- **資訊月衰落的逐年參觀人數曲線**：私辦後沒有像 Computex 那樣每年公布 buyer 數字，需要從 iThome 歷年報導交叉拼出。
- **蘇姿丰 2016 在 Computex 預告 Zen 的確切日期與逐字**：搜尋確認「Lisa Su 在 AMD Computex 2016 keynote 結尾預告 Zen 架構」是真的（PC Perspective 2016-06「Here It Is! Your Moment of Zen!」），但具體日期、地點、逐字 quote 要查 AMD 官方 newsroom 或當年現場記者報導。
- **黃仁勳 2026 GTC Taipei 背板上「王記府城肉粽 + 富霸王豬腳」店名是不是有第三家還是更多家**：官方 keynote 影片 + 民視 / TVBS 高解析截圖。
- **上銀首登 Computex 是「歷史上第一次」還是「最近幾年第一次」**：1989-2025 之間有沒有曾經參展過？公司歷年公告 + Computex 歷年參展廠商檔案。

---

## Stage 0 探索搜尋紀錄（23 query + 一句話發現）

每筆: `{NN}. {query}` → `{1-2 句發現 + 來源類型 + Stage 1 deep-dive 需求}`

1.  `"Computex Taipei history 1981 founding "Taipei City Computer Show" Taipei Computer Association"` → 確認 1981 第一屆在松山機場展覽館、TCA 1974 成立 4000+ 會員占台灣 ICT 製造 80%、1984 施振榮拍板正名 COMPUTEX TAIPEI、1985 TAITRA 加入。**[英文 secondary，需查 TCA 一手檔案]**

2.  `"CeBIT Hannover decline COMDEX shutdown timeline comparison Computex survival"` → COMDEX 1980 起家、2003 倒（最多 20 萬人 → 2003 剩 4.5 萬）；CeBIT 2007 縮到 20 萬、2010 反彈到 33.4 萬、2018-11-28 Deutsche Messe AG 宣布停辦。**[英文 secondary，Stage 1 找 Deutsche Messe 一手公告 + Comdex Las Vegas 收攤新聞]**

3.  `"蘇姿丰 AMD Computex 2016 Zen 架構 發表 Taiwan keynote"` → 蘇姿丰 2015-06 接 CEO 後推 Zen，2016-01 宣布 FinFET 製程、2017 Q2 Ryzen 上市。**[中文 secondary，需查 AMD 2016 Computex keynote 一手]**

4.  `""Lisa Su" AMD Computex Taipei first keynote Zen architecture 2016 2017"` → **關鍵命中**：PC Perspective 2016-06「Computex 2016: Here It Is! Your Moment of Zen!」確認蘇姿丰在 2016 Computex AMD keynote 結尾預告 Zen 架構。PTT 鄉民 aa1477888「蘇媽 2016 在台灣發表 Zen 把 PC 產業帶起來」**得到一手驗證**。**[英文 primary blog，Stage 1 找逐字 transcript / AMD newsroom]**

5.  `"資訊月 衰落 歷史 台北資訊月 攝影器材展 獨立 電商崛起"` → 資訊月 1980「資訊週」起家、1985 命名「資訊月」、2001 八大公會接手私營化。維基百科沒提衰落具體年份。**[中文 secondary，需查 iThome 歷年報導交叉]**

6.  `"Taiwan IT Month Information Month decline consumer electronics show history Computex differentiation"` → Computex 1980s–1990s 走 PC 元件、2010s 智慧型手機衝擊、近年「B2B 主導、消費電子退場」。沒有資訊月專題。**[英文無資訊月相關，Stage 1 走中文線]**

7.  `"Taiwan AI server supply chain 90% global market share Foxconn Quanta Wistron 2026"` → 台灣 90%+ AI 伺服器、80% 全球伺服器；Foxconn 40% AI 伺服器市占、Quanta 17%、Wistron Q1 2026 營收 NT$846.3B (+144.3% YoY)。**[英文一手 + Digitimes，數字 strong]**

8.  `"TSMC CoWoS advanced packaging bottleneck AI chip NVIDIA 2025 2026"` → CoWoS 從 2024 底 35,000 片/月 → 2026 底估 130,000 片/月（4 倍但仍不夠）、NVIDIA 拿走 60%+ 容量。**[英文 secondary，Stage 1 找 TSMC 法說會逐字 / 一手 capex 公告]**

9.  `""silicon shield" Taiwan target Lawfare semiconductor geopolitics 2025"` → Lawfare 2025-08 全文確認「Silicon Shield Is Turning Into a Target」+ CSET / Stimson / Newsweek / ISDP 多家智庫接力批評矽盾保護論。**[英文 thought leadership，Stage 1 找原文細讀]**

10. `"Computex 2014 PC industry decline Lenovo absence Intel 14nm tick-tock"` → Intel Broadwell 14nm 2014 因良率低延誤、2014 Q4 才出貨、Q1 2015 完整上市；Tick-Tock 在 2016 正式終結改三年週期。**[英文 secondary，Lenovo 缺席年份未查到一手]**

11. `"CES Las Vegas MWC Barcelona IFA Berlin tech trade show comparison Computex B2B"` → CES 1 月消費電子王、MWC 2 月手機（IQ Era + AI/5G）、IFA 8 月歐洲消費電子近百年史；Computex 6 月 B2B 主導。**[英文 secondary，Stage 1 補 Tom's Hardware 2026「B2B shift」深度]**

12. `""Open Compute Project" OCP Supercomputing SC conference Computex 區別 hyperscaler data center"` → OCP Summit 在 San Jose（2025 Global / 2027 EMEA）+ SC（ISC 2026-06 Hamburg）= 純 B2B 資料中心 / HPC 場子，不是「電腦展」範疇。**[英文一手，可用來校準「三大」框架的反駁]**

13. `"黃仁勳 寧夏夜市 2026 父母 豆花 Computex GTC Taipei keynote 回到家"` → NVIDIA 官方 GTC Taipei 2026 確認「回到家真好」「有用的 AI 來臨」「台北就是這一切的起點」。寧夏夜市豆花需 Stage 1 補 ETToday 等中文一手。**[中英混雜，Stage 1 抓 NVIDIA 官方影片 + 中文夜市報導]**

14. `"台灣 AI 伺服器 毛三到四 茅山道士 ODM 代工 毛利率 結構性問題"` → 鴻海 5.88% (2025 Q4)、廣達 Q3 6.85% / 營益率 3.71%、緯創營收破紀錄但毛利率下滑——核心因「AI 機櫃單價高、記憶體成本漲、組裝費無法等比加」。**[中文一手 + Digitimes，Stage 1 抓緯創 / 廣達 / 鴻海法說會逐字]**

15. `"Taiwan data center electricity consumption semiconductor manufacturing energy share TSMC 2025"` → TSMC 2024 用電佔台灣 7.3%、2030 估 24%、2 奈米成熟期估 12.5%；AI 電力 2023 0.24GW → 2028 2.24GW（8 倍）；半導體 + AI 估 2030 增加 5GW（375 萬戶家用）。**[英文一手 IEEE Spectrum + DCD + DallasFed，數字 strong，舊文 [^21] 報導者報導需重新對照]**

16. `"施振榮 宏碁 1984 Computex Taipei 命名 故事 Stan Shih TCA chairman naming"` → 1984 施振榮 (TCA chairman + Multitech CEO) 提案改名 COMPUTEX TAIPEI、刻意去掉「Taipei City」parochial 標籤、對應他「微笑曲線」理論。Computer History Museum 有口述歷史 102746001 一手檔案。**[英文 + 一手檔案線索，Stage 1 取 CHM 口述]**

17. `"Computex Shanghai 上海 撞期 競爭 2016 2017 中國 電腦展 對抗"` → PTT 鄉民提到「2016 中國辦上海國際電腦展撞期、誇口要台灣別辦」，搜尋結果未直接命中一手新聞稿，需 Wayback Machine 翻 2016 對岸科技媒體（騰訊科技 / 36Kr）。**[中文一手難挖，Stage 1 高優先]**

18. `"Taiwan PC OEM ODM history 1980s Acer Asus Mitac component motherboard global market share"` → 1990 台灣造全球 11% 筆電 → 2000 50% → 2007 80% → 2011 94%；Acer 1976 Multitech 創立、1985 改 Acer、1989 IPO；華碩 1989 成立。**[英文 secondary 但數字 strong，Stage 1 補 CHM Taiwan Rising 深度]**

19. `""physical AI" "embodied AI" Computex 2026 robotics 機器人 NVIDIA Isaac humanoid"` → NVIDIA Isaac GR00T 開放式人形機器人參考設計：Unitree H2 Plus 身體（6 呎、22 DOF）+ Jetson Thor 大腦 + Sharpa 五指手（22 DOF）。Computex 2026 主軸「physical AI = $500B 市場到 2030」。**[英文 NVIDIA 官方一手，Stage 1 取 Newsroom 全文]**

20. `"上銀 HIWIN 滾珠螺桿 諧波減速機 機器人 Computex 2026 首次參展"` → 上銀 2026 首登 Computex：雙臂物流機器人（與美新創合作、8 軸高自由度）+ 人形機器人核心模組（滾珠螺桿 + 諧波減速機 + 馬達 + 控制）+ 智慧夾爪（工研院 AI 合作）+ 與 Qualcomm Dragonwing Q6 整合的 PLP 半導體方案。**[中文一手新聞稿 + 鉅亨網 + 工商時報，數字 strong]**

21. `""InnoVEX" Computex startup Taiwan 2016 2025 創新特展 新創 IoT 演進"` → InnoVEX 2016 起、2025 第 10 年慶；2025 450 家新創（+12.5% YoY）來自 24 國；主題 AI / Green Tech / Smart Mobility / 半導體應用 / 次世代通訊。**[英文官方 PRNewswire 一手，Stage 1 取 2026 第 11 年最新數字]**

22. `"Taiwan tech trade show showgirl "show girl" controversy 2018 sexism metoo exhibition transition"` → 2018 The Next Web 點名 20 家展商（MSI / ASUS / ASRock / FSP / BenQ / Shuttle / Clevo）用 Show Girl、批評物化女性；外貿協會無回應；2023 後 Show Girl 顯著減少。**[英文 secondary，Stage 1 取 The Next Web 原文逐字]**

23. `"Foxconn Quanta Wistron 中國加N 越南 墨西哥 印度 AI 伺服器 供應鏈 重組 2025 2026"` → Foxconn 2024 投資 $241M 擴 Chihuahua、2024-10 宣布 Guadalajara 建全球最大 GB200 組裝廠（2026 初投產）；Quanta 在 Monterrey 大舉投資；Foxconn 雲端網路產品 2025 佔總營收 40%（首次超過消費電子 38% 含 iPhone）。**[英文 Digitimes + 美國商務部 + Dallas Fed，數字 strong]**

額外輔助查詢（非計入 ≥20 quota，但記錄）：

24. `"Computex 1989 亞洲第一 世界第三"` → 1989 排名出處仍未找到一手評鑑機構（UFI / AUMA 都未明），全網都引維基百科這條沒源頭的句子。**[Stage 1 必查 — 信度 unverified ⚠️]**

25. `""Tom's Hardware" Computex 2026 B2B shift consumer ignored gamer PC enthusiast disappointment"` → Tom's Hardware 2026 Day 0–4 系列直接寫「B2B shift」「farewell to Taipei」；case / cooler 廠告訴他們「我們做 <$100 設計，因為 gamer 沒錢了」。**[英文 一手記者觀察，Stage 1 取 4 篇全文]**

26. `"Taiwan ICT export GDP contribution 2025 semiconductor electronics industry economy dependence"` → ICT 商品 2025 佔台灣總出口 74%（前年 65%）；半導體佔台灣 GDP 20.7%、貢獻 ~60% GDP 成長；2026 半導體 + AI 相關佔出口 80%；2022 以來非半導體出口 -40%。**[英文一手 trade.gov + cier.edu.tw，數字 strong]**

27. `""Lisa Su" Tainan Taiwan birthplace 黃仁勳 cousin family ties AMD NVIDIA Taiwanese American"` → 蘇姿丰 1969-11 出生台南、3 歲移美、紐約皇后區成長；**黃仁勳的母親是蘇姿丰祖父的妹妹**——兩人是 first cousins once removed（隔房表親 / 表姑姪關係）。**[英文一手 Wikipedia + 台美史料中心 + Grokipedia，Stage 1 取 Lisa Su Wikipedia footnote + Taiwanese American History 一手檔案]**

28. `"Computex 2020 pandemic delay online format virtual exhibition transformation"` → Computex 2020 原定 6/2-6 → 延到 9/28-30 → 6/12 正式取消實體 → 改 online talks (6/2 NVIDIA / Intel / Qualcomm / Supermicro / Delta / BenQ) + online sourcing (6/3, 14 國 30 VIP buyers) + 2D online exhibition (9/28)。**[英文 secondary + 一手 official，Stage 1 補 TAITRA 官方公告]**

29. `"global semiconductor supply chain "China Plus One" Vietnam Mexico India Taiwan electronics 2026 reshoring"` → 越南 2025 FDI $36B（電子 / 半導體 / 鞋業領銜）；台廠對越南累計 FDI > $40B；Foxconn Mexico 2024 $241M + Guadalajara GB200 廠 2026 初投產 + Quanta Monterrey 大投資。「China Plus One = anywhere but China」(Z2Data)。**[英文 secondary，數字 strong]**

30. `""Cristiano Amon" Qualcomm Computex 2026 keynote AI PC mobile chip"` → Cristiano Amon 2026-06-01 Nangang 開幕 keynote「Year of Agents」+ Snapdragon / Dragonwing 跨 AI PC / 智慧手機 / 工業 AI / 機器人 / 資料中心 + 新發表資料中心品牌「Dragonfly」。**[英文 ServeTheHome + HPCwire + Yahoo Finance 一手記者報導]**

31. `""Pat Gelsinger" OR "Lip-Bu Tan" Intel Computex 2025 2026 foundry strategy Taiwan"` → Lip-Bu Tan 65 歲接 Intel CEO、確認推進 18A、考慮對外部客戶開放；Gelsinger 自稱 18A / Panther Lake 是他的功勞；Intel Computex 2026 keynote 內容未直接搜到。**[英文 secondary，Stage 1 搜 newsroom.intel.com + 工商時報 / 數位時代 Intel Computex 2026 一手]**

---

## §舊文診斷（meta 觀察，永遠不准進文章 / 不准進觀點）

> ⚠️ 規則重申：以下標籤盤點 + `[CALLOUT-VERIFY]` 清單只供 Stage 1 sub-agent 對一手來源 Ctrl-F 重驗，本份 §觀點成型 從題材本身長出來，**不是為了回應 callout 而存在**。如果上方觀點寫成「歸屬要正確 / 別搞混 AMD / 別只寫 NVIDIA」style，等於被 callout 投毒，必須回頭重想（Step 0.2-bis 規則 2）。

### 標籤盤點（從現有 knowledge/Technology/Computex.md 萃取）

- **[STALE]**：無顯著過期。文章是 2026-06-01 ship 的當期文章，數字（1500 家廠商 / 6000 攤位 / 33 國 / 四萬國際買主 / 4 月初）對應 2026 屆。
- **[THIN]**：
  - 「PC 已死的那十年」整段（2012–2017 低谷期）只有 PC 出貨下滑 + Lenovo 缺席 + 上海撞期 + Show Girl 爭議 + 2016 InnoVEX 設立，因果鏈不夠細，**蘇姿丰 2016 Zen 預告作為「低谷期最關鍵的伏筆」沒寫**。
  - 「沒有人拍的那六千個攤位」段提了奇鋐、雙鴻散熱，但 6000 攤位的中小企業骨架還可以更具象。
  - AMD / Intel / Qualcomm 三家 CEO 只在「四場主題演講」一句帶過，沒有對應 NVIDIA 的篇幅。**主舞台描寫過度集中黃仁勳**。
- **[LIST-DUMP]**：相對少。「九成的伺服器，三趴的毛利」段把台積電 / CoWoS / 鴻海 / 台達電 / 散熱連接器機殼放進一段，密度高但仍走場景敘事。可改進為「一顆晶片從晶圓到伺服器」的一條因果鏈。
- **[STUB-TITLE]**：無，現標題「Computex：三大國際電腦展收了兩個，剩下的那個長在台北」已是冒號三明治格式且有具體鉤子。**EVOLVE 後標題建議保留**——SC 數據顯示「全球三大電腦展」搜尋已排到 2.3 名，標題就是 SEO 鉤子。
- **[NO-MEDIA]**：無，6 hero + 2 NVIDIA iframe 充足（per pre-gate）。
- **[PLASTIC]**：
  - 「不僅⋯⋯更是⋯⋯」「展現了 X 精神」式句子整篇沒有。
  - **但有兩個「不是 X，是 Y」對位句**：「它沒有變得比別人聰明，它只是長對了地方」（結尾） + 「展覽會跟著訂單走，訂單跟著製造走」（兩處）——這是文章的論點脊椎，**不算塑膠句**（per EDITORIAL §對位句型禁忌的 legitimate 替代出口），但 EVOLVE 時要確認沒有第三、第四次重複。
- **[FLAT-END]**：結尾「那是全球運算的基礎建設，每年回到它真正被組裝出來的地方，朝聖一次」走「給讀者新位置」模式，**不算 flat**。但可以再具象化（不只是抽象的「基礎建設」，可以是一個具體場景：下次 Computex 開展那天，台北的某條巷子發生什麼事）。

### `[CALLOUT-VERIFY]` 清單 — Stage 1 必查（用完即丟）

1. **蘇姿丰 / AMD Zen 2016 Computex 發表**：Stage 0 搜尋 04 已 partial 命中（PC Perspective 2016-06「Your Moment of Zen!」）——確認是 2016 Computex、AMD keynote 結尾預告 Zen 架構。Stage 1 需查：(a) 確切日期、(b) 是否在世貿一館主舞台 / 還是 AMD 自己的 satellite event、(c) 逐字 keynote quote、(d) Zen 是「預告 architecture」還是「正式發表晶片」（PTT pig 提到的「2019 7nm Zen2 3900X 12C24T」是真實 2019 Computex 發表，跟 2016 是分開兩件事）。
2. **資訊月時間線**：1980 資訊週 → 1985 改名資訊月 → 2001 八大公會接手 → 何時開始衰退？電商何時崛起？攝影器材展何時獨立？2018 南台車展撞堂事件需查。
3. **消費級佔比 ~10%**：PTT soulllful 說「消費級產品只佔 10% 了」——Stage 1 查 Computex 2025 / 2026 官方參展廠商分類（B2B vs B2C）或 TAITRA 統計，是否真為 ~10%。
4. **2014–2017 低谷期成因鏈**：(a) 全球 PC 出貨何時首次年減（2012 vs 2013）？(b) Intel 14nm Broadwell 延期確切年份（已查：2014 Q4 出貨延到 Q1 2015 完整上市）；(c) Lenovo 第一年缺席年份（PTT 提 2014，待驗）；(d) 上海國際電腦展撞期具體年份（PTT 提 2016，未查到一手）。
5. **OCP / SC / MWC 定位**：是否屬「電腦展」範疇？Stage 1 釐清——若 OCP 是純 B2B 資料中心 summit、SC 是 HPC 學術會議、MWC 是手機產業展，則「三大國際電腦展」框架（COMDEX / CeBIT / Computex）依然成立，但文章可加一個「校準框」說明 CES 仍在 + B2B 還有 OCP/SC + 手機有 MWC，避免內行人覺得簡化。
6. **Show Girl 到底是 Computex 還是資訊月**：PTT saimeitetsu 糾正「girls 那個是資訊月」；外媒（The Next Web 2018）卻明確點名 Computex 上的 MSI / ASUS / ASRock 等 20 家用 Show Girl——**兩者都有但比例不同**，Stage 1 需區分早年 Computex Show Girl 文化 vs 12 月資訊月 Show Girl 文化、誰被外媒批評是哪場。
7. **1989「亞洲第一、世界第三」**：原始評鑑機構是 UFI 還是 AUMA 還是別的展覽聯盟？這個數字維基百科沒給 source，全網都引這條無源頭句子。Stage 1 必查信度層級——若無一手評鑑機構支持，文章措辭要改成「業界普遍認為 1989 已是亞洲第一」而非斷言。
8. **黃仁勳 2026 GTC Taipei 背板店名**：王記府城肉粽、富霸王豬腳之外，是否還有第三家？官方影片 + 民視 / TVBS / ETtoday 高解析截圖。
9. **黃仁勳 / 蘇姿丰表親關係**：搜尋 27 已查到「Huang's mother is the younger sister of Su's grandfather」（兩人是 first cousins once removed）——Stage 1 取台美史料中心 + Lisa Su Wikipedia footnote 一手驗證後，可考慮輕點一筆「同一個台南家族長出 AI 兩大巨頭」的隱喻（但不要過度浪漫化、不要當 thesis）。
10. **上銀首登 Computex 是否真為「歷史上第一次」**：搜尋 20 確認 2026 為「首度跨界參展 COMPUTEX」，但這是「跨界（從工具機 / 半導體精密零組件跨到機器人）」第一次還是「公司歷史上」第一次？Stage 1 查 HIWIN 公司歷年公告 + Computex 1990s / 2000s 參展廠商檔案。

⚠️ **規則重申**：上述 10 條只供 Stage 1 sub-agent 對一手來源 Ctrl-F 重驗。本份觀點（上方 §觀點成型）從題材本身長出，並非「為了回應 callout 而存在」。

---

## 給下一個 session 的 Stage 1 排程建議

按 §A/§B/§C/§D 子領域切（每 sub-agent ~25-30 search），Sonnet parallel fan-out；orchestrator 主 session 聚合 ≥ 80 search target、append raw 到 §8、synthesize §6 clean fact-pack。

### §A: 多 CEO 視角 + 四場主題演講（~25-30 search，1 Sonnet agent）

Agent prompt 提綱：「你負責 Computex 2026 四位 CEO（黃仁勳 NVIDIA / 蘇姿丰 AMD / Cristiano Amon Qualcomm / Lip-Bu Tan Intel）主題演講的一手取材。每位 CEO ≥ 5 search：(1) 一手官方 newsroom transcript / 部落格；(2) 演講中具代表性的 quote（≥ 2 句 verbatim）；(3) 該公司在 Computex 過去 5 年的演講軌跡；(4) 該 CEO 的 Taiwan 個人連結（蘇姿丰台南、黃仁勳台南、Amon / Tan 與台灣供應鏈）。另查蘇姿丰 2016 Computex 預告 Zen 的確切日期 + 逐字 + 場地（AMD 主舞台 / satellite event）+ 對 PC 寒冬轉骨的歷史定位。產出：reports/research/2026-06/computex-stage1-A-ceos.md，含 ≥ 15 一手腳註。」

### §B: 45 年時間軸 + 三大電腦展死亡時序（~25-30 search，1 Sonnet agent）

Agent prompt 提綱：「你負責 Computex / CeBIT / COMDEX 三者的時間軸校正 + 結構性死因分析。(1) Computex 1981–2026 場館遷徙史（松山機場 → 信義一館 → 三館 → 南港一館 → 南港二館 → 重返一館），每次遷徙的官方公告；(2) COMDEX 2003 收攤一手新聞稿 + Las Vegas Computer Dealers Convention 歷史檔案；(3) CeBIT 2018-11-28 Deutsche Messe AG 官方停辦公告 + 從 1986 從 Hannover Messe 獨立的歷史；(4) 1989「亞洲第一、世界第三」一手評鑑機構（UFI / AUMA）查證——這條若查不到一手，文章措辭要改；(5) 1985–2001 資訊月 vs Computex 雙引擎分工史 + 資訊月衰退逐年數字；(6) 中國上海國際電腦展 2014–2017 撞期事件一手新聞稿（Wayback Machine 翻騰訊科技 / 36Kr）。產出：reports/research/2026-06/computex-stage1-B-timeline.md，含 ≥ 15 一手腳註。」

### §C: 供應鏈毛利結構 + Physical AI 機器人 + 上銀切片（~25-30 search，1 Sonnet agent）

Agent prompt 提綱：「你負責台灣 AI 伺服器供應鏈與 Physical AI 機器人的數據與場景。(1) 台灣 90%+ AI 伺服器全球市占一手出處（TrendForce / Digitimes 研究）；(2) 鴻海 5.88% / 廣達 6.85% / 緯創 2025 毛利率下滑一手法說會 quote；(3) 台積電 CoWoS 35,000 → 130,000 wafer/月擴產一手 capex 公告 + NVIDIA 60%+ 容量綁定來源；(4) TSMC 2024 用電 7.3% / 2030 估 24% 一手 ESG 報告 + 對照《報導者》資料中心 0.5% 數據；(5) NVIDIA Isaac GR00T + Unitree H2 Plus + Jetson Thor + Sharpa 手一手 newsroom 全文；(6) 上銀 2026 Computex 首登一手新聞稿 + 雙臂物流機器人 + 高通 Dragonwing Q6 Edge AI 整合細節 + 該公司歷年 Computex 參展史。產出：reports/research/2026-06/computex-stage1-C-supplychain.md，含 ≥ 15 一手腳註。」

### §D: 反方視角 — 矽盾標靶化 + 能源 + 中國加 N + 消費級被拋棄（~25-30 search，1 Sonnet agent）

Agent prompt 提綱：「你負責 Computex 樂觀敘事底下的四條暗流。(1) Lawfare 2025-08「Silicon Shield Is Turning Into a Target」全文 + CSET / Stimson / Newsweek 2025 同主題接力評論 ≥ 3 篇；(2) 能源負債——台電 2024 起暫緩桃園以北 5MW+ 資料中心申請公文 + 2028 AI 電力 2.24GW（8 倍）推算依據；(3)「中國加 N」——Foxconn Mexico Chihuahua $241M / Guadalajara GB200 廠 / Quanta Monterrey 大投資 + 仁寶台灣 / 中國 / 越南 / 泰國 / 印度 / 墨西哥 / 美國七地布局 + Wistron Mexico AI 機櫃外移；(4) 消費級被拋棄——Tom's Hardware 2026 Day 0–4「B2B shift」「farewell to Taipei」系列全文 + Computex 2025 / 2026 官方參展廠商 B2B vs B2C 分類比例驗證 ~10% 數字 + 散熱 / 機殼廠告訴外媒「gamer 沒錢」的逐字 quote。產出：reports/research/2026-06/computex-stage1-D-undercurrents.md，含 ≥ 15 一手腳註。」

### Orchestrator 主 session 聚合

四個 agent 各 ≥ 15 腳註 → 60 + Stage 0 已有 23 search → 主 session 補 ~20 search（人物 quote 細查、Wikipedia footnote 追一手、跨源 triangulate）→ aggregate ≥ 80 search 達 v6.4 標準。Append agent raw output 到 §8，synthesize 成 §6 clean fact-pack 供 Stage 2 寫作 agent 使用。

---

## Stage 0 收尾 checklist

- [x] 模式識別完成（Step 0.1）— Evolution + callout-triggered 旗標
- [x] 既有素材萃取完成（Step 0.2 + 0.2-bis）
- [x] 研究方法論已讀（Step 0.5）— REWRITE-PIPELINE 232-594、EDITORIAL.md、RESEARCH.md
- [x] §觀點成型 section 已寫進 research report（Step 0.6.5）
- [x] 六個核心問題全答（Step 0.6.1）— 記憶 anchor / 多元面貌 / 想法感受 / 歷史脈絡 / 當代意義 / Technology category 加重（台灣不可取代性 + 全球依存）
- [x] 切入點清單（8 條）+ 核心矛盾候選（3 條 ABC）+ 研究方向（10 條）已列
- [x] research report frontmatter `viewpoint_formed: true`
- [x] Stage 0 探索搜尋 ≥ 20（實際 23 + 額外 8 = 31，但 quota 計 23 算數）
- [x] Pre-search source map 完整（中文一手 / 英文國際 / 反方批評 / 預期最難挖）
- [x] §舊文診斷 + `[CALLOUT-VERIFY]` 清單只進 Stage 1，不污染本份觀點
- [x] Stage 1 排程建議按 §A/§B/§C/§D 切妥當

🧬

_Stage 0 觀點成型 by twmd-rewrite-daily session 2026-06-11-222546，下一棒 Stage 1 fan-out 走 §A/§B/§C/§D 四 sub-agent parallel；orchestrator 主 session 聚合後進 Stage 1.4 三選一收斂核心矛盾。觀點是 Fresh 條件下從題材本身長出來的，舊文與 PTT callout 只進 §舊文診斷 audit log 不污染觀點。_
