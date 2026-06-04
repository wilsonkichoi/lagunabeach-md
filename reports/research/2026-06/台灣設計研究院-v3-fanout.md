---
article: knowledge/Society/台灣設計研究院.md
stage: 1-research
date: 2026-06-04
session: 2026-06-04-102449-深度研究-設計研究院
mode: Evolution
agents: [Explore×5 parallel fan-out]
search_count:
  {
    stage0: 16,
    stage1: 142,
    total: 158,
    breakdown: 'a1=27 a2=22 a3=25 a4=30 a5=38',
  }
source_count: { distinct: 90+, zh: many, en: 25+, primary: 25+, opposition: 8 }
core_contradiction: 一個靠「被看見」存活的機構，把最大賭注押在你沒感覺的地方
viewpoint_formed: true
verification:
  high_confidence:
    - 財團法人（公設財團法人），統編 99330539，主管機關經濟部（tdri.org.tw + 維基 + 經濟部 + opengovtw 多源）
    - 「設計力就是國力」「Made in Taiwan → Designed in Taiwan」= 蔡英文（總統府 2019-10-23 + 2020-09-30 兩篇一手）；張基義 2021 FAM 另說過「設計就是國力！」屬後呼應
    - 中山站再設計 = 金點設計獎 2024 年度最佳（形構設計提案）；2021 紅點獎是台北捷運企業識別系統（Plan b + Bito），兩者不同案不同獎不同年
    - 選票印刷字體 = 思圓黑體（開源，思源黑體圓角衍生），過去用標楷體（ETtoday verbatim）
    - 台灣設計展人次：2019 屏東 425 萬 / 2020 新竹 280 萬 / 2022 高雄 600 萬 / 2023 新北 658 萬（歷屆最高，多源）/ 2024 台南 420 萬
  single_source:
    - 「97% 選民認同」（TDRI 線上問卷，無樣本數/抽樣說明 — 引用須標方法）
    - 台創「與民爭利 / 組織位階不明」（典藏 ARTouch content-12274，403 只取到摘要）
    - 學美·美學 iF 金獎（2021 多處提及但類別未從官方確認）
  unverified:
    - 2025 彰化設計展 784 萬人次（5 agent 共 38 次搜尋查無任何官方/媒體來源，只有開幕首日 44 萬）→ 不可寫「破七百萬」
    - TDRI 揭牌精確日（2020 年 2 月哪天，無官方一手）
    - 「第四金」（出自 YouTuber 影片標題，非金點官方定位，非張基義可查逐字）
    - 張基義出生年月日（推算約 1963）/「民主跟設計並進」逐字 / 艾淑婷學歷
    - 健保卡 / 長照 / 戶政 / 報稅 / 防疫口罩 = 查無 TDRI 主導
---

# Research Report: 台灣設計研究院（TDRI）— v3 五路 fan-out 整合

> **整合說明（anti-regression）**：本報告 §8 完整保留 5 個研究 agent 的原始輸出（不摘要，REFLEXES #22 raw 永不刪）；§1-7 是 orchestrator 疊加的合成層，不取代 §8。對比 v1（192 行 fact-pack，丟掉 agent 軌跡）= v6.5 修補的退化案例。本報告 = SSOT。

## 1. 觀點成型（Stage 0）

- **記憶 anchor**：多數人不知道「設研院」，但摸過它的東西——不像衛生所的衛生所、改造的母校、選票、每年秋天巡迴的台灣設計展、金點獎。世代差異：老一輩「MIT = 便宜貨」、中生代 2016 世界設計之都、年輕世代 IG 洗版的設計展。
- **核心矛盾（鎖定）**：**一個靠「被看見」存活的機構（金點獎、百萬人次設計展、國際得獎、設計外交），把最大賭注押在你「沒感覺」的隱形治理（衛生所、選票、校園）——而中山站那次，剛好證明被看見有多危險。**
- **歷史底色**：台灣代工島（OEM→ODM→OBM），「Made in Taiwan = king of knockoffs」，外貿協會 1979 推設計，蕭萬長 2011 喊「Designed in Taiwan」、蔡英文 2019/2020 喊「設計力就是國力」。設研院賭台灣能不能自己決定東西長什麼樣子——包括政府碰到人民的方式。
- **多選一核心矛盾候選**：(a) 被看見 vs 沒感覺〔首選〕 (b) 代工島 → 設計島 (c) 美感當國策的政績/品味質疑。→ 以 (a) 當脊椎、(b) 開場縱深、(c) 編進爭議。

## 2. 搜尋日誌 / 方法論（aggregate 158 次跨 5 agent）

5 路 parallel fan-out，各 agent 完整 §搜尋日誌見 §8 raw。各支次數：沿革/法人 27、張基義 22、公共服務 25、金點/設計展/國際 30、代工史/批評/英文 38。**negative findings 全記在 §5**。英文/國際/學術來源由第 5 支補足（CNN / Taiwan Panorama / Metropolis / AmCham / WDO / IASDR 論文 / PDR Research / MDPI）。

## 3. Findings by sub-topic（信度標於括號）

### §3A 沿革 / 法人 / 預算 / 組織

- **法人**：財團法人（公設財團法人），統編 99330539，主管機關經濟部，登記地址松山文創園區（高信度，多源一手）。**falsification：≠ 行政法人**（常見混淆，公設財團法人是私法人）。資本額 6,800 萬（單一來源）。
- **沿革**：外貿協會 CETRA 產品設計推廣處 1979-03-16（首任處長鄭源錦）→ 1990 設計推廣中心 → 2003-06 台灣創意設計中心 TDC 成立（首任執行長張光民）、2004-02-07 對外開放、法人登記 2004-03-12 → 2018-02-26 張基義接董事長（前任林榮泰 2012-2018）→ 2019-10-23 蔡英文宣布升格 → 2019-12-05 蘇貞昌拍板 → **2020 年 2 月揭牌**（精確日未驗證）。
- **預算**：2019 台創 4.24 億（另一說 3.9 億，分歧揭露）→ 2020 升格 5.3 億 → 2021 約 5.35 億（單一來源維基）；2022+ 各年 PDF 無法讀（未驗證）。預算結構：經濟部 41%＋他部會 40%＋民間 19%。
- **組織**：三所（研究發展所/產業創新所/服務創新所）11 組 + 不只是圖書館 + 台灣設計館（2011 成立）。員工數官方未公佈（未驗證）。
- **領導**：院長張基義（2020-，仍在任）；副院長林鑫保、艾淑婷；董事長何晉滄（經濟部政務次長兼，接任日未驗證）。
- **官方五大功能**：建立設計政策 / 驅動產業設計創新 / 推動公共服務創新 / 發展社會設計創新 / 推展國際設計外交（一手官方逐字）。

### §3B 張基義 + 領導

- **bio**：淡江建築學士（1987）→ 俄亥俄州立建築碩士（1992）→ 哈佛設計學院 MDes（1994）；Peter Eisenman 事務所設計師（1993，紐約）；A+@ 建築主持人 1997-2011；交大建築所教授兼所長 2005-2011；台東縣副縣長 2011/03-2014/12；台創董事長 2018；TDRI 院長 2020-；WDO 理事 2019 當選/2022 連任（高信度逐字）。出生年約 1963（未驗證）。
- **falsification（關鍵）**：「設計力就是國力」「Made→Designed in Taiwan」= **蔡英文**（總統府 2019-10-23「DIT, Designed in Taiwan」+ 2020-09-30「設計力就是國力」兩篇一手 Ctrl-F ✓）。張基義 2021 FAM 說過「設計就是國力！」（四字，後呼應，不同用詞）。**slogan 不掛張基義名下**。
- 林鑫保：大同工設 + 辛辛那提設計管理碩士，外貿協會→台創→TDRI 20+ 年；艾淑婷：主導台灣設計展（2014 接手）+ T22 + 文博會 9 年，學歷未驗證。

### §3C 公共服務設計（核心）

- **衛生所再設計**：新北市衛生局，汐止+鶯歌示範，13 個月，三型態（都會/新市鎮/鄉鎮）模組「積木般可拆裝」；設計團隊坐設計陳羿冲 + 選選研林唯哲 + 顧問趙璽；新北 29 區衛生所；後續板橋三重（單一來源，原頁 404）。
- **學美·美學**：教育部委託 TDRI 執行，2019 起；第一屆 9 校（北港/大同高中/沙崙/山峰華德福/明禮/豐林/新東/竹東高中/和平高中）；官方累計 **112+ 改造案例 / 200+ 合作學校 / 30+ 顧問**；獲日本 Good Design + 德國 iF 金獎（類別未確認）。
- **選舉美學（中選會）**：四年三階段，12 設計項目（公投/選舉公報、票、政見會、中央選情中心、投開票所指標、投票通知單、遮屏、當選證書）；2021-12 公投公報真用了（寄發約 895 萬份，提案平面室，獲 2022 金點傳達設計類）；**選票字體 = 思圓黑體**（開源，過去用標楷體，ETtoday verbatim）；候選人名用全字庫宋體；遮屏只 1 間示範（瑠公國中 804）；113 年 1,989 萬選民；2024 iF UX 獎。**97% 選民認同**（TDRI 線上問卷，無樣本數 — 標方法）。
- **公共圖標 CNS16282**：經濟部標準檢驗局 2026-03 公布，253 個，8 大類，CC BY 4.0，與交通部/衛福部/國土署/資源循環署共創。**五堂課**：報名 7,450、滿意度 4.8、《公共服務設計應用指南》（原頁 404，單一來源搜尋引文）。
- **T22**：鶯歌陶瓷 2019 起 + 北投/花蓮/彰化。**北花線回遊號**：2020 蘇花改通車，「全台首個公路品牌」（TDC/TDRI 時序跨越，官方納為案例）；公會理事長曾嗆「你們都是讀書的啦！」（張基義轉述初期阻力）。
- **中山站再設計**：2021 啟動 2022-10-19 公開第一階段（售票區）；空間形構設計、視覺 IF OFFICE+平面室、產品 NAKNAK；**得 2024 金點年度最佳設計獎（整合設計類，形構設計提案）— 不是紅點**。2022-10 爭議 verbatim（CTS）：「做得不錯，以後別做了」「是在設計車站還是設計旅客？」「UI 重新設計，但 UX 完全沒改？」「機台高度沒考慮輪椅、小朋友」。設研院回應「優化進行中，將會同各共創單位持續修正」；後路線圖高度有調整回。
- **哪些不是 TDRI（falsification）**：美感教科書 = 美感細胞協會（陳慕天等交大畢業生，2013 NGO，與 TDRI 有聯展但業務不同）；健保卡/長照/戶政/報稅/防疫口罩 = 查無主導（negative finding）。
- **設計導入官僚之難**：《台灣設計力報告》官方「設計難以納入標準化預算評估機制」；實習生（2025 hsiehchengyi.com，單一來源 intern blog）「設計被當成缺乏客觀依據的玄學」「公共服務組於各單位間奔走」。

### §3D 金點 / 設計展 / 國際

- **金點獎**：1981 優良產品評選 → 2005 國家設計獎 → 2009 改名金點 → 2014 國際化（全球徵件）→ 2015 三獎分立。主辦經濟部產業發展署（前工業局），執行 TDRI。規模：2023 近 8,000 件 23 地 25 件年度最佳 / 2024 642 標章 14 地 / 2025 28 國海外過半。**「第四金」非官方**（YouTuber 標題，未驗證）。
- **台灣設計展人次**（見 frontmatter，2023 新北 658 萬最高，**2025 彰化 784 萬未驗證不可用**）。
- **設計外交**：張基義 WDO 理事 2019 當選（以台創身份）/2022 連任；台灣設計週 2023 首屆松菸 22 萬 / 2024 第二屆 25 萬，2024 波蘭「夥伴國」（**非 MOU，未驗證**），韓國/石井裕未確認。
- **國際排名**：World Design Rankings 2013 第 38 → 2019 第 8 → 2023-24 第 7；2025 iF 台灣 369 vs 375 件（口徑分歧）；台科大 Red Dot 亞太院校連 5 年第一。
- **falsification（獎項）**：2021 紅點 = 台北捷運企業識別系統（Plan b + Bito）；中山站 = 金點 2024。兩件事不可互換。

### §3E 代工史 / 世界設計之都 / 批評 / 學術

- **代工史**：OEM(1960-70s)→ODM(1980-90s，施振榮 1992 微笑曲線)→OBM(2000s-)；「Made in Taiwan = king of knockoffs」；Taiwan Panorama《Remade in Taiwan》(1994)：美國車店掛「We do not repair bikes from Taiwan」、廠商撕標籤、CETRA 顧問 David Lightle「Taiwan's problem...lies in its image」（英文一手 verbatim）；蕭萬長 2011 IDA「Designed in Taiwan not Made in Taiwan」（比蔡英文早）。
- **2011 IDA Congress Taipei**：IDA 學術主辦，**TDC 執行主辦**，經濟部+台北市政府；3,036 人 56 國。**2016 世界設計之都**：WDO 指定，**台北市政府文化局主辦、TDC 執行主辦**（falsification：非中央文化部；執行長吳漢中）；645+ 工作坊、800+ 專業者、37 校改造、167 校園美化。
- **批評（反方，這次大豐收）**：WDC 2016「四不像市集」「大拜拜」（The News Lens，403 摘要）；公民參與批評（Ketagalan「citizens still don't feel they can influence public decisions」）；MDPI 學術指 City Designer Village 因「political and financial pressure」被砍；典藏 ARTouch「與民爭利/組織位階不明/人才難留」（403 摘要，升格理由之一）；Taipower logo 爭議（聶永真 NT$100 萬「換六個字」/ 關係設計 / 政績）；PDR Research「Visions are not enough, there have to be tangible metrics」「忽略環境永續的設計政策 way off the mark」。
- **學術**：JAPP 2025「Design-driven innovation in the public sector...Taiwan」（指資源限制/官僚延遲/法規約束）；IASDR 2025 兩篇（作者全是 TDRI 人，自我研究）；台灣 World Design Ranking 升至第 7-8。

## 4. 引語庫（verbatim，Ctrl-F 標）

**張基義（高信度）**：

- 「我們希望設計在公部門裡變成基本的 DNA。」（500輯 Ctrl-F✓）
- 「設計不只是推廣、展覽，設計能夠帶動社會的創新，能夠帶動公共服務。」（500輯✓）
- 「台創中心在做的是價值的實現，研究院則是創造價值，創造是主動的。」（La Vie✓）
- 「當這些生態成熟，就會變成台灣經驗，可以和世界交流、做設計外交。」（La Vie✓）
- 「我期待有一天，我不用再跟人談設計，當臺灣眼光所及都是美學、設計成為生活的一部分時，我們就成功了。」（1% Style✓）
- 「設計就是國力！……將『設計力』推升到國家戰略的高度。」（FAM 2021✓ — 後呼應蔡英文）
- 「設計是要解決問題，不只是看起來美而已。」（放言✓）/「我是設計人暨建築人、教育工作者、美學志工。」（500輯✓）
- （選舉美學）「全台灣有近 1 千 9 百萬的選民，怎樣透過設計改變選舉美學……在原法規、與原預算限制裡面逐步創新。」（自由✓ 記者引述）

**蔡英文（總統府一手）**：「設計力就是國力」+「不僅是有 Made in Taiwan，也認識 Designed in Taiwan」（2020-09-30✓）；「以前臺灣以 MIT 聞名，未來要有 DIT, Designed in Taiwan」（2019-10-23✓）。

**中山站負評（CTS verbatim）**：「做得不錯，以後別做了」「是在設計車站還是設計旅客？」「UI 重新設計，但 UX 完全沒改？」

**代工史（英文一手）**：「We do not repair bikes from Taiwan」（1994 美國車店掛牌）；David Lightle「Taiwan's problem does not lie in its reality...The problem lies in its image.」；蕭萬長 2011「Designed in Taiwan, rather than Made in Taiwan」。

**爭議**：PDR Research「Visions are not enough, there have to be tangible metrics and evaluation indicators.」；Ketagalan「citizens still don't feel they can influence public decisions in a direct and meaningful way」。

## 5. 反例 / 護欄（不能說的話 / 必驗 / 不採信）

1. **不可寫「中山站得 2021 紅點獎」** — 紅點是北捷企業識別（Plan b+Bito）；中山站是金點 2024。
2. **不可寫「2025 彰化 784 萬」「設計展破七百萬」** — 784 萬零來源（未驗證）；確認最高是 2023 新北 658 萬。
3. **不可把「設計力就是國力 / Designed in Taiwan」掛張基義** — 是蔡英文（張基義後呼應）。
4. **不可把美感教科書算 TDRI** — 是美感細胞 NGO。
5. **不可寫健保卡/長照/戶政/防疫口罩是 TDRI** — 查無。
6. **「97% 選民認同」不可當硬事實** — TDRI 線上問卷無樣本數，引用須標「設研院自述調查」。
7. **「第四金」不可當官方定位或張基義逐字** — YouTuber 框架。
8. **選票字體寫思圓黑體**（不是思源黑體、不是「傳統書法」改的，過去是標楷體）。
9. **2016 世界設計之都主辦是台北市政府文化局**（TDC 執行主辦），不是中央文化部、不是只「協辦」。
10. **強論證 = 政府/來源自身矛盾 + 被看見的危險**，不必選邊；TDRI 自我研究（IASDR 論文作者全是 TDRI 人）不可當獨立評估。

## 6. Clean Fact-Pack + Stage 2 操作規範

- **核心矛盾脊椎**：被看見（金點/設計展/國際） vs 沒感覺（衛生所/選票/校園）；中山站 = 被看見反咬。
- **開場物件候選**：改造後的汐止衛生所候診區 / 美感選票 / 松山文創（老菸廠→設計總部 = 代工→設計縮影）。
- **小標題候選（非編年體）**：連自己杯子都別人設計的島 / 升格那年任務換了 / 把設計塞進衛生所選票校園 / 設計導入官僚是說服戰 / 看得見那面金點百萬人次 / 中山站被看見反咬 / 你沒注意到他們的時候。
- **結尾**：好的公共服務設計消失在無縫體驗裡，你沒感覺就是它成功——呼應開場衛生所。
- **不可忽略校正點（vs 既有 article 的錯）**：① 紅點→改金點 2024 ② 784 萬→改 658 萬/2023 或刪「破七百萬」 ③ 字體→思圓黑體 ④ 加 §爭議深度（ARTouch 與民爭利 + Taipower logo + 學術 PDR critique）。
- **幻覺候選 Ctrl-F 清單**：紅點/金點、784 萬、第四金、97%、MOU、石井裕。

## 7. 參考文獻 + Verification Table

主要一手：[總統府 24937](https://www.president.gov.tw/NEWS/24937) / [總統府 25611](https://www.president.gov.tw/News/25611) / [TDRI about](https://www.tdri.org.tw/about/) / [TDRI CNS16282](https://www.tdri.org.tw/zh-TW/CNS16282) / [金點 about](https://goldenpin.org.tw/goldenpin/zh-TW/about) / [金點 winners/2275 中山站](https://www.goldenpin.org.tw/goldenpin/zh-TW/winners/2275) / [行政院議案](https://www.ey.gov.tw/Page/448DE008087A1971/ae86b160-5aae-4f88-b5e2-23fa8931bdb9) / [votetw 張基義](https://votetw.com/wiki/%E5%BC%B5%E5%9F%BA%E7%BE%A9)。
中文二手：[CNA 升格](https://www.cna.com.tw/news/firstnews/201912050118.aspx) / [ETtoday 思圓黑體](https://www.ettoday.net/news/20240104/2657499.htm) / [自由 選舉美學](https://art.ltn.com.tw/article/breakingnews/4542250) / [CTS 中山站爭議](https://news.cts.com.tw/) / [500輯 張基義](https://500times.udn.com/wtimes/story/12670/4901138) / [La Vie](https://www.wowlavie.com/article/ae2002047) / [fundesign.tv 衛生所](https://www.fundesign.tv/tdri-public-health-center/)。
英文/學術：[Taiwan Panorama Remade in Taiwan](https://www.taiwan-panorama.com/en/Articles/Details?Guid=edab24ee-3ca3-4192-8940-91923c3a29cc) / [Metropolis WDC2016](https://metropolismag.com/viewpoints/uncovering-taipei-inside-world-design-capital-2016/) / [AmCham 2016](https://topics.amcham.com.tw/2016/03/2016-taipei-citys-year-of-design/) / [PDR Research Taiwan design policy](https://www.pdr-research.com/news/trends-in-design-policy-from-taiwan) / [Ketagalan WDC2016](https://ketagalanmedia.com/2016/10/26/25739/) / [Taipei Times 2011 IDA](https://www.taipeitimes.com/News/feat/archives/2011/09/29/2003514437) / [ICoD TDRI](https://www.theicod.org/resources/news-archive/new-member-taiwan-design-research-institute-taiwan)。

| 高風險 atom   | sources                           | Ctrl-F | 信度   | verdict             |
| ------------- | --------------------------------- | ------ | ------ | ------------------- |
| 中山站獎項    | 金點 winners/2275 + 北捷 CIS 新聞 | ✓      | 高     | 金點 2024（非紅點） |
| 2025 彰化人次 | 38 次搜尋                         | ✗      | 未驗證 | 不寫 784 萬         |
| slogan 歸屬   | 總統府 ×2                         | ✓      | 高     | 蔡英文              |
| 選票字體      | ETtoday                           | ✓      | 高     | 思圓黑體            |
| 97% 認同      | TDRI 線上問卷                     | —      | 單一   | 標方法              |

---

# 8. Agent 原始輸出（raw，不摘要，5 路 fan-out 全保留）

> 以下 5 段是 5 個研究 agent 的完整回報原文 verbatim（含各自 §搜尋日誌）。SSOT raw，§1-7 是其蒸餾。aggregate 158 次搜尋（a1=27 / a2=22 / a3=25 / a4=30 / a5=38）。

## 8.1 Agent 1 raw — 沿革 / 法人治理 / 預算 / 組織

**法人**：財團法人台灣設計研究院（TDRI）。維基標「公設財團法人」[高信度][中]；TDRI 官網自稱「財團法人」「國家級設計研究院」，原文「政府於2020年成立國家級設計研究院『財團法人台灣設計研究院』」（tdri.org.tw/about Ctrl-F✓ 一手）。**falsification：公設財團法人≠行政法人，TDRI 從未被定性為行政法人**[高信度]。統編 99330539[多源]；主管機關經濟部[高信度一手]；登記地址松山文創園區北向製菸工廠2樓；資本額 6,800 萬[單一來源 opengovtw]；法定代表人何晉滄（經濟部政務次長兼董事長）[高信度]。

**沿革時間軸**：1979-03-16 外貿協會 CETRA 設「產品設計推廣處」首任處長鄭源錦[高信度 維基+TDC官網]；1990 擴編設計推廣中心；2003-06 經濟部成立財團法人台灣創意設計中心 TDC 首任執行長張光民[高信度]；2004-02-07 對外開放；2004-03-12 法人登記日[高信度 opengovtw]；2012-2018 林榮泰董事長[高信度 工商時報]；2018-02-26 張基義接董事長（經濟部主秘陳怡鈴監交）[高信度 工商時報 Ctrl-F✓]；2019-10-23 蔡英文全國設計論壇宣布升格（總統府 24937 一手）；2019-12-05 蘇貞昌核定、2020 預算5.3億（行政院+CNA 一手）；2020-02 揭牌（精確日：多源僅標「2020年2月」，「2月4日」出現於 AI 摘要 Ctrl-F✗ **[未驗證]**）。

**預算**：2019(108)台創 4.24億[高信度 CNA]（另工商時報 3.9億 [單一來源]，分歧揭露——可能舊年度/估算）；結構 經濟部41%+他部會40%+民間19%；2020(109)約5.3億（亦見5.35億維基[單一]）；2021 維基標535,000,000元、決算收入455,273,789/支出449,849,180[單一來源]；2022(111)後各年 PDF 在 Google Drive，WebFetch 無法讀，**各年金額[未驗證]**（搜9次無果）。

**組織**：三所（研究發展所/產業創新所/服務創新所）下11組（設計研發/前瞻研發/政策研發/國際發展/產業創新/產業前瞻/品牌推廣/公共服務/人文創新/地方創新/營運推廣）[高信度多源]；附設「不只是圖書館」（120+設計雜誌/1.2萬本書）+ 台灣設計館（2011成立，全球華人第一座設計博物館）；辦公地：台北松山文創+信義+高雄流行音樂中心。**員工數官方未公佈[未驗證]**（搜18次無果）。

**五大功能**（官網 about 一手 Ctrl-F✓）：建立設計政策機制/驅動產業設計創新/推動公共服務創新/發展社會設計創新/推展國際設計外交。**三大使命**（行政院議案 2019-12-05 一手 Ctrl-F✓）：跨部會合作擴大設計影響力/搭建設計創意平台/提升企業設計位階。**定位原文**「台灣唯一以設計為核心價值，促進產業、公共服務及社會創新為目標的國家級研究智庫與跨領域整合平台」[一手]。

**歷任**：TDC 張光民(首任執行長)→陳文龍(產業界,短)→宋同正(學術界,短)[單一來源需cross-check]→林榮泰董事長(2012-2018)→張基義董事長(2018-02-26)。TDRI 張基義院長(2020-,仍在任)；副院長林鑫保、艾淑婷；董事長何晉滄(接任日[未驗證])。2003-2012董事長空白[未驗證]。

**§搜尋日誌(27次)**：法人性質統編/台創成立外貿協會/2020揭牌蔡英文/TDRI budget annual report/林榮泰張基義歷任/about-tdri/行政院議案/總統府24937/TDC about01/揭牌2020年2月具體日/法人登記日2003月份/組織架構員工/預算4.24億5.3億/年報2021決算/成立2020年2月新聞/何晉滄董事長接任/林榮泰鄭源錦首任/年報2021預算/公設財團法人行政法人爭議/2021-2023預算/五大功能/何晉滄2024次長/院長2024-2025人事/99330539設立日2004-03-12/三個所/員工人數/決算收入支出。**負面發現**：揭牌精確日未驗證；公設財團法人≠行政法人；2019預算3.9億vs4.24億分歧；員工數未公佈；何晉滄接任日無公告；2003-2012董事長空白；111年後預算PDF無法讀。

**Sources**：[維基 TDRI](https://zh.wikipedia.org/zh-tw/%E5%8F%B0%E7%81%A3%E8%A8%AD%E8%A8%88%E7%A0%94%E7%A9%B6%E9%99%A2)、[TDRI about](https://www.tdri.org.tw/about/)、[行政院議案](https://www.ey.gov.tw/Page/448DE008087A1971/ae86b160-5aae-4f88-b5e2-23fa8931bdb9)、[總統府24937](https://www.president.gov.tw/News/24937)、[CNA升格5.3億](https://www.cna.com.tw/news/firstnews/201912050118.aspx)、[TDRI財務頁](https://www.tdri.org.tw/zh-TW/bulletin/financial_infos)、[TDRI經營團隊](https://www.tdri.org.tw/zh-TW/about/management)、[TDRI功能任務](https://www.tdri.org.tw/zh-TW/about/about-tdri)、[TDC about](https://tdc.org.tw/about01.htm)、[工商時報張基義接任](https://www.chinatimes.com/newspapers/20180308000376-260208)、[台灣英文新聞升格](https://www.taiwannews.com.tw/ch/news/3830881)、[自由蘇貞昌拍板](https://news.ltn.com.tw/news/politics/breakingnews/2999530)、[opengovtw 99330539](https://opengovtw.com/ban/99330539)、[2025實習分享](https://hsiehchengyi.com/blog/tdri-winter-internship-review-2025/)、[工商時報2019-10-15](https://www.ctee.com.tw/news/20191015700538-439803)、[en.wiki TDRI](https://en.wikipedia.org/wiki/Taiwan_Design_Research_Institute)。

## 8.2 Agent 2 raw — 張基義 + 領導層

**bio**：淡江建築學士1982/09-1987/06、俄亥俄州立建築碩士1990/09-1992/01、哈佛設計學院 MDes 1993/09-1994/06[高信度 votetw+TDRI官網+台東縣府]；Peter Eisenman 事務所設計師1993紐約（亦曾 URS Consultants 1992）[votetw]；A+@建築主持人1997-2011/03；交大建築所教授兼所長2005-2011/03；台東縣副縣長兼文化處長2011/03-2014/12[高信度 votetw+台東縣府逐字]；台創董事長2018/02/26；WDO理事2019當選(印度海德拉巴第31屆)/2022連任；TDRI院長2020/02-仍在任；陽明交大教授現任。出生年約1963(2011任副縣長「48歲生日前兩天」反推)[單一來源/推算，年月日未驗證]。

**verbatim quotes(Ctrl-F✓)**：①「我來自台東，我是設計人暨建築人、教育工作者、美學志工。」(500輯 2020-10-06)②「我們希望設計在公部門裡變成基本的DNA。」+「設計不只是推廣、展覽，設計能夠帶動社會的創新，能夠帶動公共服務。」(500輯)③「台創中心在做的是價值的實現，研究院則是創造價值，創造是主動的，我們嫁接一個生態系統。」(La Vie)④「當這些生態成熟，就會變成台灣經驗，可以和世界交流、做設計外交。」(La Vie)⑤「設計就是國力！我們努力創造典範案例，希望有朝一日輸出國際、推動設計外交，而設研院就是要持續扮演公私部門及各產業間的橋樑，將『設計力』推升到國家戰略的高度。」(FAM 準建手札 2021-07-01)⑥「科學，是找出萬物單一面向的絕對答案；而設計，是融合文化藝術、科技商業的複雜學問。」(1% Style 2024)⑦「我期待有一天，我不用再跟人談設計，當臺灣眼光所及都是美學、設計成為生活的一部分時，我們就成功了。」(1% Style)⑧「設計其實一點都不困難，困難的是溝通」+「設計是要解決問題，不只是看起來美而已。」(放言)⑨「我一直期許自己，以個人微小的努力帶動公共價值的創造。」(FAM)⑩「不要在同溫層裡找機會。」「與其對環境有所不滿，不如進場參與改變。」(La Vie)。

**falsification(關鍵)**：「設計力就是國力」「Made→Designed in Taiwan」=**蔡英文**。蔡英文 2019-10-23「設計力不僅是國力的展現...以前臺灣以MIT聞名，未來要有 DIT, Designed in Taiwan」(總統府24937 一手Ctrl-F✓)；2020-09-30 新竹設計展「設計力就是國力」「不僅是有Made in Taiwan，也認識Designed in Taiwan」(總統府25611 一手Ctrl-F✓)。張基義 2021 FAM 說「設計就是國力！」(四字,後呼應,不同用詞)。林鑫保亦用「讓設計力成為國力」(記者轉述)。**結論：slogan 不掛張基義名下**。

**領導**：林鑫保(大同工設1982-1986+辛辛那提設計管理碩士1991-1993；外貿協會→台北設計中心駐大阪東京→台創副執行長2012→TDRI副院長2020；WDO理事兼財務長2023-2025)[高信度]；艾淑婷(2003起參與台灣設計展、2014接手主導、台創副執行長、T22發起、文博會9年、2020校園美學獲Good Design；直引「設計不是只有變漂亮這件事情，它也是行動策略，去解決城市整合的問題。」VERSE✓；學歷[未驗證])。

**理念三階段**：建築教育(發現應培養「會欣賞專業的消費者」)→台東治理實驗2011-2014(全台最沒資源地方,建直屬縣長設計中心,城市美學翻轉)→設計治理國家化2018台創→2020 TDRI。

**§搜尋日誌(22次)**：張基義學歷/verbatim設計外交/設計力就是國力誰說/台東副縣長交大台創/領導層林鑫保艾淑婷/Eisenman出生年/TDRI管理頁(fetch✓)/500輯(fetch✓)/總統府2020-09-30(fetch✓)/La Vie(fetch✓)/NYCU(redirect✗)/1%Style(fetch✓)/hengstyle(fetch✓)/IxDTW林鑫保(fetch✓)/DNA verbatim/選舉美學法規/蔡英文2020-09-30完整稿/FAM(fetch✓)/放言(fetch✓)/votetw傳記(fetch✓)/台東縣府(fetch✓)/林鑫保學歷WDO。**負面**：「民主跟設計並進」逐字無法找到[未驗證]；出生年月日無一手；艾淑婷學歷無;TNL 403。

**Sources**：[TDRI經營團隊](https://www.tdri.org.tw/zh-TW/about/management)、[500輯張基義](https://500times.udn.com/wtimes/story/12670/4901138)、[La Vie](https://www.wowlavie.com/article/ae2002047)、[1% Style](https://onepercent.storm.mg/article/4998826)、[FAM準建手札](https://forgemind.net/media/張基義：設計就是用個人微小努力創造公共價值/)、[放言](https://www.fountmedia.io/article/88587)、[總統府25611](https://www.president.gov.tw/News/25611)、[總統府24937](https://www.president.gov.tw/News/24937)、[votetw張基義](https://votetw.com/wiki/%E5%BC%B5%E5%9F%BA%E7%BE%A9)、[台東縣府](https://www.taitung.gov.tw/News_Content.aspx?n=13370&s=21387)、[IxDTW林鑫保](https://ixdtw2021.ixda.org.tw/press/oliver-lin/)、[VERSE艾淑婷](https://www.verse.com.tw/article/tdri)、[TNL張基義](https://www.thenewslens.com/article/153602)。

## 8.3 Agent 3 raw — 公共服務設計（核心，≥25 次）

**衛生所再設計**[高信度一手]：TDRI+新北市衛生局；汐止+鶯歌示範同步；歷時13個月；設計書「以設計導入公共服務—打造以人為中心的衛生所場域」；團隊空間總監陳羿冲(坐設計)、視覺總監林唯哲(選選研)、顧問趙璽(室內設計協會理事長)；三型態(都會/新市鎮/鄉鎮)「積木般可拆裝模組」(三種單元尺寸暖白牆/三種濃淡大地色地板)；新北29區衛生所；後續板橋三重[單一來源,原頁/32621/ 404]。

**學美·美學**[高信度一手]：教育部委託 TDRI 執行(wowlavie ae1902383逐字「由教育部委託台灣設計研究院執行」)；2019(108學年)啟動；第一屆9校(北港國小/大同高中/沙崙國小/山峰華德福/明禮國小/豐林國小/新東國小/竹東高中/和平高中)；改造教室司令台川堂中廊垃圾站餐廳指標管線；官網 campusfield 累計**112+ 改造案例/200+ 合作學校與團隊/30+ 顧問**；獎項 Good Design Best 100(2020)+ 德國iF金獎(2021,類別[需cross-check])。

**選舉美學**[高信度一手+多源]：中選會委託 TDRI 執行「四年三階段」；12設計項目(公投公報紙本/電子、選舉公報紙本/電子、公投票、選舉票、政見發表會、中央選情中心、投開票所指標、投票通知單、遮屏、當選證書)；113年1,989萬選民；第一階段2021-12公投公報(寄發約895萬份,刊頭書法字改黑體,提案平面室設計工作室,獲2022金點傳達設計類)；**選票字體=思圓黑體**(ETtoday逐字「最後以『思圓黑體』來設計,這不但是開源免費字體...過去使用標楷體」),候選人名用全字庫宋體[單一來源];遮屏首試僅瑠公國中804教室1間示範(art.ltn逐字「率先引至2024總統大選之1間示範投開票所」);**97%選民認同**(TDRI線上問卷,無樣本數/抽樣[單一來源,需標方法]);2024 iF UX類獎;張基義引語「全台灣有近1千9百萬選民...在原法規與原預算限制裡面逐步創新」(art.ltn記者轉述)。

**CNS16282**[高信度一手 tdri.org.tw/CNS16282]：經濟部標準檢驗局2026-03公布,253個圖標,8大類(公共設施/交通/旅遊觀光/體育/商業/公共行為/基本安全/無障礙),CC BY 4.0,共創交通部+衛福部+國土署+資源循環署,2024-01起草納國標。**五堂課**「公共服務場域調研-設計之前的五堂課」報名7,450/滿意度4.8/《公共服務設計應用指南》[單一來源,原頁/44847//45957/ 404]。

**T22**：鶯歌陶瓷2019起+北投(都市農業)花蓮(石材)彰化。**北花線回遊號**[高信度+機構釐清]：2019與交通部公路局合作,2020-01-06上路,「全台首個公路品牌」「3個第一」;主辦經濟部產業發展署執行TDRI(官網/46900/);TDC升格TDRI時序跨越[單一來源需cross-check];車輛公會理事長嗆「你們都是讀書的啦！」(張基義轉述)。

**中山站再設計**[高信度官方+多源]：2021啟動,2022-10-19公開第一階段(售票機區),北市府新聞稿111-11-07,執行TDRI;團隊空間形構設計/視覺IF OFFICE+平面室/產品NAKNAK/細部UPGA;**獎項釐清:紅點(2021)=北捷企業識別系統(非中山站);中山站再設計=金點2024年度最佳設計獎(整合設計類城市及公共設計,提案形構設計,goldenpin winners/2275)**。2022-10爭議 verbatim(CTS news 2022-10-20《設研院北捷優化案開箱 網一看:做得不錯,以後別做了》):「做得不錯,以後別做了」「設計得不錯,可以改回原本的嗎」「是在設計車站還是設計旅客？」「UI重新設計,但UX完全沒有改？」「這個設計不錯,結果是Before」「還是舊版好看」「這是設計師的設計,而不是滿足使用者的設計」;ebc補:「機台高度沒考慮到輪椅、小朋友」「以前買單程票看藍藍圖示就知道,改成文字很不直覺」。設研院回應「優化進行中,設研院將會同各共創單位持續修正」(city.gvm);後路線圖高度調整回(mottimes)。公共服務組組長(2025 hsiehchengyi實習轉述[單一來源intern])「一般民眾僅能就感知到的部分做評論...背後的人員、時程、預算等限制看不到」。

**falsification 哪些不是TDRI**[高信度]：美感教科書=社團法人美感細胞協會(陳慕天/張柏韋/林宗諺交大生,2013 NGO)做教科書再造;與TDRI有聯展但業務不同(美感細胞=教科書版面/學美美學=校園空間);健保卡/戶政/報稅/防疫口罩=多輪搜尋查無TDRI主導[negative finding];長照[未驗證]。**設計導入官僚之難**:《台灣設計力報告》(tdri news/544)「設計難以被納入標準化的預算評估機制」;2025實習生「設計被視為個人主觀美感偏好,缺乏客觀依據的玄學」「公共服務組於各單位間奔走」[單一來源intern blog,非官方用語]。

**§搜尋日誌(25次)**：衛生所汐止鶯歌陳羿冲/學美美學iF金獎/選舉美學字體思源/CNS16282/中山站爭議紅點/fundesign衛生所/tdri 46454(404)/46545(404)/32290(404)/ettoday思圓黑體/思圓黑體選票/wowlavie 9校/campusfield 112+/CNS16282頁/CTS中山站/ebc中山站/hsiehchengyi實習/goldenpin 2275/goldenpin 205/美感細胞TDRI差異/健保口罩戶政TDRI/北花線TDC/T22鶯歌北投花蓮/設計力報告採購法/中山站回應verbatim。**負面**:字體是思圓黑體非思源黑體;遮屏僅1間示範;97%方法不透明;美感教科書非TDRI;紅點是北捷識別非中山站;北花線時序;健保戶政查無;「玄學」是實習生個人表述。

**Sources**：[fundesign衛生所](https://www.fundesign.tv/tdri-public-health-center/)、[wowlavie學美9校](https://www.wowlavie.com/article/ae1902383)、[campusfield](https://campusfield.design.org.tw/zh-TW)、[TDRI CNS16282](https://www.tdri.org.tw/zh-TW/CNS16282)、[ettoday思圓黑體](https://www.ettoday.net/news/20240104/2657499.htm)、[自由選舉美學](https://art.ltn.com.tw/article/breakingnews/4542250)、[CTS中山站爭議](https://news.cts.com.tw/)、[金點winners/2275中山站](https://www.goldenpin.org.tw/goldenpin/zh-TW/winners/2275)、[金點winners/205公投公報](https://www.goldenpin.org.tw/goldenpin/zh-TW/winners/205)、[TDRI設計力報告news/544](https://www.tdri.org.tw/zh-TW/news/544)、[hsiehchengyi實習](https://hsiehchengyi.com/blog/tdri-winter-internship-review-2025/)。

## 8.4 Agent 4 raw — 金點 / 設計展 / 國際（30 次）

**金點獎**[高信度]：主辦經濟部產業發展署(前工業局)、執行TDRI(金點官網 about);沿革1981優良產品評選→2005國家設計獎→2009改名金點(公開徵選+全民票選)→2014開放全球徵件確立國際定位→2015三獎分立(設計獎已量產/概念獎未量產/新秀獎在校生);規模2023近8000件23地590標章25年度最佳/2024 642標章14地32年度最佳/2025 429標章28國海外過半。**「第四金」[未驗證]**:未在官方/新聞/學術找到正式出處,最早源YouTuber「七七Vlog」影片標題,屬自媒體非官方定位。

**台灣設計展人次(triangulate)**：2019屏東「超級南」16天(10/5-10/20)**425萬**[高信度 屏東縣府委託中華電信];2020新竹「Check in新竹-人來風」11天**280萬**[高信度 ETtoday+自由+PTT];2021嘉義「家意·以城為家」10天逾100萬(中期數字,最終未見官方公告)[單一來源];2022高雄「台灣設計設計台灣」17天**600萬**[高信度 CNA+TDRI+陳其邁,當時歷屆最高];2023新北(鶯歌)「○起來」17天**658萬**[高信度 TDRI標題+新北市府,超越600萬成新高];2024台南「是台南,當是未來」16天**420萬**[高信度 TDRI news/463];2025彰化「彰化行」17天(10/10-10/26)**未確認**:開幕首日(+試營運)44萬,**「784萬」說法查無任何官方/媒體來源**[未驗證];2026桃園(已確認地點未舉行)。**關鍵結論:破七百萬不成立——2023新北658萬是確認最高,784萬零來源**。

**設計外交**[高信度]：張基義2019當選WDO理事(以台創身份,從15位他國代表脫穎)/2022連任(TDRI身份,原頁23881/36957現404);台灣設計週2023首屆12/1-10松菸主題「彈性橋接」54組台灣+5海外9國論壇**22萬**/2024第二屆12/7-15「The Gateway」34組首推夥伴國**波蘭**(波蘭平面設計基金會)**25萬**;**MOU查無正式文件,屬展覽夥伴合作[未驗證]**;韓國夥伴+石井裕台灣設計週連結未確認[未驗證]。

**國際排名**：iF2025台灣369 vs 375件(口徑分歧,與韓365德338日266名列前茅,確切名次官網403無法確認);Red Dot 2020台灣108項,2021北捷企業識別(非中山站)獲紅點,2024/25數字未找到[未驗證];Good Design Best 100 2019台灣《本地》《新富町》入選,**「學美美學獲Good Design Best 100」本次搜尋未能確認**[未驗證];World Design Rankings 2013第38→2019第8→2023-24第7;台科大Red Dot亞太院校連5年第一。

**falsification獎項張冠李戴(關鍵)**：台北捷運**企業識別系統**(新Logo動態識別,Plan b+Bito Studio)=德國**紅點2021**;台北捷運**中山站再設計**(模組化改造,形構設計等)=**金點2024**年度最佳(整合設計類城市及公共設計)。兩個不同項目/不同獎/不同年。北捷官網「臺北捷運企業識別榮獲2021德國紅點設計獎」Ctrl-F✓;金點winners/2275中山站2024 Ctrl-F✓。

**§搜尋日誌(30次)**：金點沿革1981/設計展歷屆人次/Golden Pin history organizer/goldenpin about(fetch✓)/tdri goldenpin(404)/tdri news/463 2024台南(fetch✓)/goldenpin en about(fetch✓)/第四金金馬金曲金鐘/2019屏東2020新竹人次/CNA 2019閉幕(fetch✓)/自由2020新竹/2021嘉義/tdri 45134(404)/2025彰化784萬(negative)/designexpo about(fetch✓)/tdri news/594彰化開幕(fetch✓)/2025彰化閉幕總人次(negative)/張基義WDO理事/tdri 23881(404)/台灣設計週2023石井裕/NTPC新北658萬(fetch✓)/北捷紅點2021中山站企業識別/北市府新聞稿(fetch✓)/goldenpin 2275(fetch✓)/2024設計週波蘭MOU韓國/2022高雄tdri(404)/CNA 2022高雄600萬/設計週22萬/金點2023收件。**負面**:784萬查無;第四金非官方;2021嘉義最終人次無;MOU查無;石井裕未確認;iF排名403;紅點類別未確認;學美iF金獎未確認。

**Sources**：[金點about](https://goldenpin.org.tw/goldenpin/zh-TW/about)、[TDRI news/463 2024台南](https://www.tdri.org.tw/zh-TW/news/463)、[CNA 2019屏東](https://www.cna.com.tw/news/acul/201910200146.aspx)、[CNA 2022高雄600萬](https://www.cna.com.tw/news/acul/202210240071.aspx)、[新北市府2023新北658萬](https://www.ntpc.gov.tw/)、[金點winners/2275](https://www.goldenpin.org.tw/goldenpin/zh-TW/winners/2275)、[TDRI news/594彰化](https://www.tdri.org.tw/zh-TW/news/594)、[designexpo](https://www.designexpo.org.tw/)。

## 8.5 Agent 5 raw — 代工史 / 世界設計之都 / 批評 / 學術 / 英文（38 次）

**代工史**[高信度英/學術]：OEM(1960-70s廉價勞力cheap and fine,接受境外設計,1966高雄出口加工區)→ODM(1980-90s,施振榮1992微笑曲線)→OBM(2000s-);Taiwan Panorama《Taiwan's Design Power》引文化評論Chan Wei-hsiung「an overnight blossoming after a 40-year night」(✓);《Remade in Taiwan》1994(✓):美國車店掛「We do not repair bikes from Taiwan」、Gallup民調台灣產品排第10僅優於墨俄、廠商撕「Made in Taiwan」標籤、CETRA顧問David Lightle「Taiwan's problem does not lie in its reality; its reality is fine. The problem lies in its image.」(✓);Wiki「Made in Taiwan」1980s西方稱「king of knockoffs」、1991外貿協會委託Bright&Associates改形象;TELDAP「雨傘王國/玩具王國/塑膠鞋王國」。外貿協會1979設計推廣中心(CETRA Design Center,多搜尋摘要,Wiki正式條目只記2003 TDC[1979需中文一手檔案確認]);1988品質提升/1989設計能力提升/1990 IEP形象提升;1993 Taiwan Excellence Awards。**「Designed in Taiwan」**:蕭萬長2011 IDA開幕「Designed in Taiwan, rather than Made in Taiwan」(Taipei Times 2011-10-25✓,**比蔡英文早**);AmCham 2019設計師Shikuan Chen「Without research and design, we would sink.」(✓);TDRI官方《Perspective:A Discourse about DIT》三支柱善創享[一手自我論述]。

**2011 IDA Congress Taipei**[高信度英一手]：IDA學術主辦,**TDC執行主辦(host organizer)**,經濟部+台北市政府;3,036人56國,176講者25國,台北世界設計博覽會34國46,931㎡19展區6000+作品;打敗19競爭城市,首次亞洲;策展人Sean Hu「when a lot of people think of Taiwan, they still think of original equipment manufacturing.」(Taipei Times✓)。**2016世界設計之都WDC**[高信度英一手]：WDO指定,**台北市政府文化局主辦、TDC執行主辦**(執行長吳漢中Han Wu,文化局長謝佩霓);**falsification:非中央文化部**(AmCham確認under台北市文化局);645+工作坊/800+專業者/45 Stir Design bottom-up/26 Public Policy by Design top-down/37校改造+167校園美化/50→150店招牌/3500志工/國際設計獎4246件59國;市長柯文哲「If we want to change Taiwan, we want to start by changing the capital, and that is Taipei.」(Metropolis✓)。

**批評(反方大豐收)**：WDC2016「四不像市集」「大拜拜」(浪費納稅人錢,The News Lens《How a Lack of Global Thinking Doomed Taipei's WDC》,403摘要[單一來源]);Ketagalan「Taiwanese citizens still don't feel that they can influence public decisions in a direct and meaningful way」「catchphrases without much actual meaning」(✓);MDPI 6064學術:City Designer Village因「political and financial pressure」被砍(✓);典藏ARTouch content-12274「與民爭利/組織位階不明/人才難留(張光民後繼任者任期短,2019執行長由董事長張基義兼代)/升格理由之一」(403摘要[單一來源待中文補]);Taipower logo爭議(聶永真NT$100萬「換六個字」/「綠色友好設計師」關係設計/刪于右任書法,Taipei Times 2026-05「若事先說明設計理由和歷史研究,或許能減少『偷換符號』或『浪費公帑』的指控」✓;風傳媒葉元之批評官商勾結);PDR Research「Visions are not enough, there have to be tangible metrics and evaluation indicators.」「A design policy that overlooks the environmental sustainability dimension is way off the mark.」(✓最具實質獨立批評)。**負面**:「美感是中產品味霸權」英文學術/評論薄弱(只個人去殖民論述);劉雯婷投書英文庫查無[未驗證];2018設計雙年展爭議是北美館策展資格(藝術非設計)。

**學術**[高信度英]：JAPP 2025《Design-driven innovation in the public sector...Taiwan》(分析TDRI 6案例,挑戰=資源限制/官僚延遲/法規約束✓);IASDR 2025《How Design Supports Local Governments...Taiwan Design Expo》+《Institutional Design in Practice》(作者全TDRI人,自我研究,建議強化institutional support);MDPI 6064 WDC準備;MDPI 12578台灣設計趨勢1960-2020;Springer《Design for Democratic Innovation in Taiwan》PDIS;PDR Research《Trends in Design Policy from Taiwan》。

**英文國際來源**：CNN《Made in Taiwan: From mass manufacturing to high design》(451);Dezeen《Taipei announced as WDC 2016》+台灣設計週媒體夥伴;Wallpaper WDC2016「the real work has just begun」「over 300 works by 60 artists」(✓);Metropolis(統計+柯文哲引語✓);Taiwan Panorama《Taiwan's Design Power》《Remade in Taiwan》《Charting the Aesthetic Map》[英一手];AmCham 2016(吳漢中「The WDC project aims to use design to change Taipei」✓)+2019設計師批評;WDO官方(選舉美學報導);ICoD TDRI入會「design as valuable to central governance and as a national defense strategy」(✓);Taipei Times(2011 IDA+2026 Taipower)。國際設計4獎台灣2003僅16件→2018累計3825件142金獎[單一]→World Ranking第7-8。

**§搜尋日誌(38次)**：Taiwan OEM ODM history academic/TAITRA 1979 design center/Taipei WDC 2016 organizer/2011 IDA Congress organizer/TDRI criticism governance/CNN(451)/wdc2016(timeout)/Dezeen(403)/Taiwan design policy paper/ARTouch與民爭利/Tandfonline(403)/Springer WDC(redirect)/ResearchGate(403)/MDPI 6064/Designed in Taiwan diplomacy/MDPI 6064(403)/MDPI 12578(403)/2018雙年展(無)/WDC 37 schools/Taipei Times TDRI(無批評)/IASDR 88(fetch✓)/IASDR 56(fetch✓)/PDR News(fetch✓批評)/ARTouch批評摘要/WDC四不像大拜拜/Taiwan Panorama Remade(fetch✓)/Design Power(fetch✓)/Metropolis(fetch✓)/AmCham 2016(fetch✓)/WDO Taipei 2016(fetch✓)/ARTouch 12274(403)/Taipower logo(fetch✓)/Aaron Nieh controversy/TDC organizational issues/Taiwan Panorama Aesthetic Map(fetch✓)/Global Taiwan Institute(fetch✓)/TDRI ICoD(fetch✓)/Ketagalan WDC(fetch✓)。

**Sources**：[Taiwan Panorama Remade in Taiwan](https://www.taiwan-panorama.com/en/Articles/Details?Guid=edab24ee-3ca3-4192-8940-91923c3a29cc)、[Taiwan Panorama Design Power](https://www.taiwan-panorama.com/en/Articles/Details?Guid=a920bb87-b672-4db6-9cbd-bcd61bcd7ab5)、[Metropolis WDC2016](https://metropolismag.com/viewpoints/uncovering-taipei-inside-world-design-capital-2016/)、[AmCham 2016](https://topics.amcham.com.tw/2016/03/2016-taipei-citys-year-of-design/)、[AmCham 2019設計師批評](https://topics.amcham.com.tw/2019/03/good-design-is-more-than-good-business/)、[PDR Research](https://www.pdr-research.com/news/trends-in-design-policy-from-taiwan)、[Ketagalan WDC2016](https://ketagalanmedia.com/2016/10/26/25739/)、[Taipei Times 2011 IDA](https://www.taipeitimes.com/News/feat/archives/2011/09/29/2003514437)、[Taipei Times 2026 Taipower](https://www.taipeitimes.com/News/lang/archives/2026/05/19/2003857553)、[ICoD TDRI](https://www.theicod.org/resources/news-archive/new-member-taiwan-design-research-institute-taiwan)、[IASDR 88設計展治理](https://dl.designresearchsociety.org/iasdr/iasdr2025/posterpapers/88/)、[MDPI 6064 WDC](https://www.mdpi.com/2071-1050/11/21/6064)、[Wikipedia Made in Taiwan](https://en.wikipedia.org/wiki/Made_in_Taiwan)、[Smiling curve](https://en.wikipedia.org/wiki/Smiling_curve)、[風傳媒聶永真](https://www.storm.mg/lifestyle/11130569)。
