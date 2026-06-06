# The Pudding 深度研究報告

> 為 Taiwan.md 文章視覺化系統設計提供素材
> 研究日期：2026-06-06
> 搜尋次數：21 次（英文為主）+ 直接抓取 pudding.cool 一手頁面 18 次

---

## 搜尋日誌

| #   | 查詢字串                                                                     | 主要 finding                                                |
| --- | ---------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | The Pudding pudding.cool editorial philosophy visual essays data journalism  | 確認定位、Wikipedia 條目、Storybench 分析                   |
| 2   | The Pudding scrollytelling technique scrollama D3.js tech stack 2024 2025    | Scrollama 由 Russell Samora 建立，IntersectionObserver 基礎 |
| 3   | The Pudding "film dialogue" gender visual essay 2016 methodology             | 4 million lines / 2000 scripts，Peabody 得獎前身            |
| 4   | The Pudding "rap vocabulary" OR "hip hop words" visual essay interactive D3  | 2 個招牌 hip hop 詞彙分析，t-SNE + tf-idf                   |
| 5   | The Pudding Svelte starter kit github workflow Google Docs archieml          | SvelteKit + ArchieML + Google Docs 工作流                   |
| 6   | The Pudding "where slang comes from" OR "slang" visual essay scrollytelling  | 找到 slang 追蹤地圖，scrollytell.ing 分析                   |
| 7   | The Pudding "how music taste evolved" OR "music taste" visual essay          | Billboard Top 5 可互動時間軸，Internet Scout 存檔           |
| 8   | The Pudding "making it big" bands scrollytelling funnel V-shape              | V 形敘事、7000 dots → 21 bands，dot plot                    |
| 9   | pudding.cool SEO how do visual essays rank Google search traffic             | 791K visits/month，film dialogue 是 pageviews 冠軍          |
| 10  | The Pudding "scrollytelling" vs "static charts" mobile performance tradeoffs | responsive-scrollytelling.md，prefers-reduced-motion 支援   |
| 11  | The Pudding "abortion mazes" OR "queueing theory" OR "birthday effect" 2024  | 深度優先搜尋算法生成迷宮，Guttmacher 資料                   |
| 12  | The Pudding "walkachusetts" walk home 2025 visual essay diary                | 160 miles，hybrid 日記+地圖，非傳統 scrollytelling          |
| 13  | The Pudding Peabody award 2017 recognition                                   | 2017 Peabody，Interactive Digital Journalism 類別           |
| 14  | The Pudding team size 2024 2025 Matt Daniels Russell Goldenberg              | 6-7 人 journalist-engineer，2024 不招 cohort                |
| 15  | The Pudding "making it big" bands scrollytelling funnel V-shape（重查）      | scrollytell.ing 深析：sticky pattern + IntersectionObserver |
| 16  | pudding.cool SEO markdown AI readable accessibility crawlability             | 找不到 pudding 自己的 SEO 策略公開說明（negative finding）  |
| 17  | pudding.cool articles static no JavaScript lightweight HTML CSS              | CSS sticky 處理 graphic stickiness，JS 只用 step triggers   |
| 18  | The Pudding "naked truth" beauty industry shade names foundation 2021        | 6816 個色號，racial bias，data 公開於 GitHub                |
| 19  | The Pudding "how bad is your streaming music" Spotify interactive            | OAuth 接 Spotify，fake AI roasting，純互動非 scrollytelling |
| 20  | The Pudding design principles annotation color mobile responsive             | Storybench 訪談，message-first、static-before-code          |
| 21  | The Pudding "sledgehammer stat" "central question" annotation principles     | "sledgehammer stat" 概念確認，Making Internet Things Part 3 |

**Negative finding**：pudding.cool 沒有公開的 style guide / color guide / typography spec；他們的 design principles 散在 Making Internet Things 系列與訪談，沒有單一設計文件。

---

## 一、The Pudding 是什麼

### 定位

**官網自述**（verbatim）：「The Pudding explains ideas debated in culture with visual essays.」

- **類型**：獨立數位出版物，非新聞通訊社，非學術期刊
- **創立**：2017 年，Matt Daniels、Ilia Blinderman、Russell Goldenberg 共同創辦
- **名稱來源**：「the proof is in the pudding」——嚴謹但親切
- **獎項**：2017 年 Peabody Award（Interactive Digital Journalism 類別）、2023 Online Journalism Award
- **流量**：約 791K 次/月（Similarweb 2024 資料），bounce rate 52.36%

### 為什麼紅

1. **填補空白**：長篇文字報導的「too long didn't read」問題，The Pudding 用資料視覺化解決
2. **沒有截稿壓力**：「There are no deadlines because we are not tied to news events」——允許每篇花數週到數月
3. **人人可跑完整流程**：每個 journalist-engineer 從 research → data → design → code → publish 全包，不需要分工協作
4. **病毒式分享機制**：「How Bad Is Your Streaming Music?」這類個人化互動產品讓讀者分享自己的結果

### 團隊規模

- 約 6-7 名全職 journalist-engineers（2024）
- 多元背景：心理學、電腦科學、新聞學、哲學、海洋生物學、自學
- **不是層級制**：「We operate as a collective rather than hierarchical team」
- 商業模式：Polygraph（data design studio）承接客戶案維持運作，The Pudding 本身無廣告無訂閱牆

---

## 二、招牌格式分類

The Pudding 的 visual essay 可分四種主要形態，實際作品常混用：

### 形態 A：Scrollytelling（捲動觸發視覺狀態）

**機制**：圖表固定（sticky），文字滑過觸發圖表狀態轉換。讀者控制節奏，但無法選擇路徑。

**代表作**：

1. **The Unlikely Odds of Making It Big**（https://pudding.cool/2017/01/making-it-big/）
   - 7000 個 dot 代表樂團 → scroll 逐步過濾 → 21 個達到大場地
   - 為什麼好：V 形敘事結構純粹，從「可能性」到「不可能性」的情感旅程靠 dot 密度傳遞
2. **Film Dialogue by Gender**（https://pudding.cool/2017/03/film-dialogue/）
   - 2000 劇本 4 百萬台詞，scroll 觸發類型/年代切換
   - 為什麼好：「顯而易見的偏見」被量化，從感覺變事實，每個 scroll step 是一個新維度的驗證
3. **Middle School Sucks（The Middle Ages）**（https://pudding.cool/2025/02/middle-school/）
   - 合成學生點陣圖，scroll 從 5 年級追蹤到 8 年級的歸屬感下降
   - 為什麼好：把 40 million 個調查資料還原成「學生臉孔」，情感溫度遠高於 bar chart

### 形態 B：Interactive Explorer（讀者可篩選 / 輸入 / 玩）

**機制**：讀者直接操作資料，過濾、搜尋、選擇、輸入。敘事框架建立後，探索權交給讀者。

**代表作**：

1. **How Bad Is Your Streaming Music?**（https://pudding.cool/2021/10/judge-my-music/）
   - OAuth 接 Spotify，假 AI 評分「roast」你的音樂品味
   - 為什麼好：完全個人化的輸出讓分享率極高（「看看它怎麼評我」），satirical AI 框架消除防衛心

2. **The Largest Vocabulary in Hip Hop**（https://pudding.cool/2017/02/vocabulary/）
   - beeswarm plot，讀者可 hover 每個 rapper 的位置與莎士比亞/Moby Dick 比較
   - 為什麼好：文化名作當 benchmark（Shakespeare, Moby Dick）讓抽象數字有了文化重量

3. **NBA Jersey Colors**（https://pudding.cool/2024/10/nba-uniforms/）
   - dropdown 選隊，即時顯示該隊整季 jersey rotation + "flair score"
   - 為什麼好：個人化 + fan identity，任何 NBA 球迷都有自己的「入口」進入資料

### 形態 C：Annotated Static Charts（標註型靜態圖）

**機制**：圖表靜態（無滾動觸發），用標注（annotation）把「為什麼重要」直接寫在圖上。詞少資料密。

**代表作**：

1. **Are you more likely to die on your birthday?**（https://pudding.cool/2025/04/birthday-effect/）
   - bar chart + spike chart + histogram，birthday cake icon 標記峰值
   - 為什麼好：一條一條教 z-score、p-value、seasonality 調整，讀者同步學統計同步看資料

2. **The Language of Hip Hop**（https://pudding.cool/2017/09/hip-hop-words/）
   - 散點圖（hip-hop frequency vs other genres），triangle annotation 標籤 genre-specific 詞彙
   - 為什麼好：統計方法（tf-idf）的直覺解釋藏在圖形語言裡，不需要讀方法論段落

### 形態 D：Conceptual Metaphor Visualization（概念隱喻型）

**機制**：用非傳統圖表類型把政策/資料轉化成可感受的形狀/空間/遊戲。

**代表作**：

1. **Abortion Mazes**（https://pudding.cool/2024/10/abortion-mazes/）
   - 每州生成一個迷宮，難度 = 該州墮胎政策複雜度（28 個 data points 加權）
   - 為什麼好：「障礙」不是圖表，是真的要走的路；身體感受替代了認知負荷

2. **Walkachusetts**（https://pudding.cool/2025/10/walk/）
   - 日記格式 + 手繪插圖 + 每日路線地圖，step counter 倒數
   - 為什麼好：用「走路」的實體旅程結構代替資料結構，情感敘事優先於資訊密度

---

## 三、招牌作品深挖（6-8 篇）

### 作品 1：Film Dialogue by Gender（2017）

- **URL**：https://pudding.cool/2017/03/film-dialogue/
- **主題**：2000 劇本、4 百萬台詞，量化好萊塢性別代表不平等
- **視覺手法**：互動篩選圖表（依類型/年代），年齡比較折線圖，個別電影搜尋資料庫
- **敘事資料融合**：每次 filter 切換都是一個新「發現」——不是研究者告訴你，是讀者自己操作後「發現」的。迪士尼 30 部裡 22 部男聲主導，這件事靠讀者點 "Disney" 篩選後自己看到
- **讀者體驗**：主動發現型，讀者是調查者而不是被告知者
- **為什麼 landmark**：Peabody 得獎主因；把「感覺」量化讓媒體/學術/業界難以反駁；方法論全公開（GitHub + Google Doc FAQ）

### 作品 2：The Largest Vocabulary in Hip Hop（2017）

- **URL**：https://pudding.cool/2017/02/vocabulary/
- **主題**：用每位 rapper 首 35,000 個 unique words 排名詞彙量
- **視覺手法**：Beeswarm plot，x 軸 = unique word count（2900–6400+），regional color coding，Shakespeare 和 Moby Dick 當 benchmark 標注
- **敘事資料融合**：從「Shakespeare would be here」開始 → 文化錨點讓統計量有了人文意義。結尾的哲學提問（詞彙量 vs 商業成功無相關）讓資料結論開放
- **讀者體驗**：hover 探索，每個 rapper 都是點，fan 會找自己喜歡的人在哪裡
- **為什麼好**：把 tf-idf 這個技術概念包裝成「誰的歌詞最豐富」的文化問題，兩端讀者都滿足

### 作品 3：The Unlikely Odds of Making It Big（2017）

- **URL**：https://pudding.cool/2017/01/making-it-big/
- **主題**：紐約市 3 年 75,000 場演出資料，量化樂團成功機率
- **視覺手法**：Sticky radial scatter（7000 dots），顏色對應場館規模，scroll 過濾 → timeline dot plot → 最後「Everybody Else」巨型文字牆
- **敘事資料融合**：V 形結構——7000 → 21 是 V 底，然後鏡頭拉近看 21 個成功案例，最後「Everybody Else」的文字量讓讀者感受到失敗的規模
- **讀者體驗**：情感弧線，看到最後那堵牆時有視覺衝擊
- **為什麼好**：sheer volume 當論據——幾千個 band 名稱排成牆面比任何統計數字都更有感

### 作品 4：The Naked Truth（2021）

- **URL**：https://pudding.cool/2021/03/foundation-names/
- **主題**：6816 個粉底色號分析，揭示美妝業在命名和編號上的種族偏見
- **視覺手法**：Scrollytelling 開場（scroll 揭露命名規律）→ 尾段 interactive explorer（5000+ 色號可篩選過濾）
- **敘事資料融合**：「mocha、latte、espresso = 深色皮膚」這件事靠顏色本身可視化，不需要文字解釋。編號方向（淺色在前）靠 97% 這個數字收結
- **讀者體驗**：scroll 先被引導「看見」，再被邀請「探索」——兩個模式的混合
- **為什麼好**：隱喻不藏在文字裡，資料就是論據本身；方法論可重現（Sephora/Ulta 2021年1月爬蟲），GitHub 公開資料

### 作品 5：Abortion Mazes（2024）

- **URL**：https://pudding.cool/2024/10/abortion-mazes/
- **主題**：每州的墮胎政策複雜度視覺化為迷宮難度
- **視覺手法**：Depth-first search 算法生成迷宮，難度分數 = Guttmacher Institute 28 個 data points 加權；6 個真人故事嵌入選定州的迷宮
- **敘事資料融合**：迷宮不是裝飾——「abortion access has rarely been a straight line」這個 metaphor 變成了字面上可體驗的迷宮路徑
- **讀者體驗**：混合 scrollytelling（intro）+ 互動迷宮（主體），6 個真人敘事讓政策數字有人臉
- **為什麼好**：政策倡議類視覺化最難的是「感受落差」——迷宮讓身體感受替代了認知說服

### 作品 6：Birthday Effect（2025）

- **URL**：https://pudding.cool/2025/04/birthday-effect/
- **主題**：用 1990-2024 死亡資料證明生日當天死亡率統計顯著較高
- **視覺手法**：Annotated bar charts + spike charts + birthday cake icon 標記，逐步揭露 z-score、p-value、seasonality 調整
- **敘事資料融合**：每個 scroll step 是一個方法論決策的解釋——資料科學教學和故事敘述同步進行。「Gus、Gretchen、Randall」等虛構人物作為統計說明的載體
- **讀者體驗**：學習旅程，讀完後讀者理解了 z-score；annotation 是主角不是裝飾
- **為什麼好**：把統計可信度的建立過程本身變成敘事，讀者參與方法論驗證

### 作品 7：Musical Motifs（2025）

- **URL**：https://pudding.cool/2025/12/motifs
- **主題**：Hamilton、Les Mis、Wicked 等音樂劇的主題旋律（leitmotif）視覺化
- **視覺手法**：時間軸圖表（x = 出現位置），可篩選角色/歌曲，嵌入音頻播放器，鋼琴示意圖標記旋律相似性
- **敘事資料融合**：「Click play and see if you can hear how the melody is the same」——視覺和聽覺同步激活，資料點即時對應耳朵聽到的東西
- **讀者體驗**：視聽雙通道，大幅提升音樂理論抽象概念的理解
- **為什麼好**：音樂分析長期只有文字，這篇把「主題重複」這個理論上的說法變成可點擊可聆聽的時間線

### 作品 8：Middle Ages（2025）

- **URL**：https://pudding.cool/2025/02/middle-school/
- **主題**：追蹤數百個孩子從小學到中學的「歸屬感」變化，解釋為什麼中學這麼痛苦
- **視覺手法**：合成學生點陣面孔（反映 Panorama Education 40 million 調查比例），scroll 逐年級揭露歸屬感下降，加入 120 年中學制度歷史時間軸
- **敘事資料融合**：不是 bar chart 而是「臉孔」，讓統計降幅變成一張張學生消失的感受
- **讀者體驗**：情感沉浸，讀者跟著這些學生往下走
- **為什麼好**：「synthetic sample」設計讓真實資料保護隱私，同時保有「個別人物」的敘事溫度

---

## 四、視覺與編輯原則

### 核心原則（從一手資料萃取）

**1. Data has to provide a conclusion**

> 「Data has to really speak and be able to provide a conclusion. Visual stories really need clear, hard, underlying conclusions.」—— Ilia Blinderman（via Storybench）

不是「用資料探索」，而是「用資料回答問題」。先有明確的中心問題，再找資料。

**2. Central question first, then data**

> 「The heart of The Pudding process is finding a question you want to answer.」—— Caitlyn Ralph

資料集不是起點，問題才是起點。「Often the dataset doesn't exist, but the data is out there.」（Russell Goldenberg）

**3. Sledgehammer stat for simple stories**
直接開門見山給最強的 finding，不藏招。「Presenting your most exciting insight to a reader quickly...tends to make tangential and related points more intriguing.」

**4. Character-as-engine for complex stories**

> 「The use of a character's experiences as the engine used to move the reader through a story is paramount.」

複雜主題用「人物旅程」帶路（Middle Ages 的孩子臉孔、Making It Big 的 Sylvan Esso）。

**5. Variety in shape with change**
Goldenberg 描述 V 形（Making It Big）vs 倒 V 形（microbrew 分析）：故事形狀從資料本身長出來，不是套模板。「Successful stories feature variety in shape with change as the narrative progresses—never remaining static.」

**6. 漸進揭露（Progressive Disclosure）**
Birthday Effect 的方法論教學 / Making It Big 的 dot 過濾：每個 scroll step 是新維度的揭露，不是同一維度的重複。

**7. Static before interactive**

> 「For most people...designing on the fly in JavaScript isn't a viable option: it's too easy to get bogged down in bugs and syntax.」

先用 Keynote/Figma 設計靜態版，確認視覺傳達訊息後再 code。

**8. Story > aesthetics**

> 「The story. Something could be really beautiful and really cool but I'm getting nothing from it. It has to have an interesting point, not just saying water is wet.」—— Caitlyn Ralph

視覺美不是目的，說故事才是。

**9. Transparency as trust**
方法論公開（GitHub 資料 + FAQ）：「Those that may have reservations about our findings will have more faith in our analyses」when calculations are explained.

**10. Accessibility built-in**

- `prefers-reduced-motion` media query
- Animation toggle（可見的 off 按鈕）
- ARIA labels for screen readers
- 「The most delightful experiences are also the most inclusive ones」

### 標題原則

沒有找到公開的標題規則，但 pattern 觀察：

- 問句：「Are you more likely to die on your birthday?」「How Bad Is Your Streaming Music?」
- 挑釁數字：「The Largest Vocabulary in Hip Hop」「4 million lines」
- 日常入口：「Dicing Onions」「Women's Sizing」「Kids Book Animals」
- 避免新聞式標題，傾向 evergreen / curiosity-driven

---

## 五、技術 Stack

### 核心框架（2023-2026）

| 層        | 工具                                    | 用途                                    |
| --------- | --------------------------------------- | --------------------------------------- |
| Framework | **SvelteKit**                           | 主框架，靜態 SSR 輸出                   |
| Viz       | **D3.js**                               | 資料視覺化，動畫，複雜圖表              |
| Scroll    | **Scrollama.js**（Russell Samora 自建） | scrollytelling IntersectionObserver     |
| CMS       | **ArchieML + Google Docs/Sheets**       | 文字/資料內容管理，`npm run gdoc` fetch |
| Design    | **Figma**、**Adobe Illustrator**        | 靜態設計、向量圖                        |
| Maps      | **Mapbox**                              | 互動地圖                                |
| Deploy    | AWS（production）、GitHub（staging）    | 靜態 build                              |

### Scrollama.js 原理

- 使用 **IntersectionObserver API** 取代 scroll event listener
- 解決問題：傳統 scroll event 造成 "scroll jank"（卡頓）
- 三個功能：Step triggers / Step progress（0-100%）/ Sticky graphic helper
- 完全 vanilla JS，無 jQuery/D3 依賴
- 官方 repo：https://github.com/russellsamora/scrollama

### Sticky Graphic Pattern（CSS-first）

```css
.scroll__graphic {
  position: sticky;
  top: 0;
}
```

關鍵洞察：**CSS position sticky 處理圖形固定，JS (Scrollama) 只處理 step triggers**。「Much simpler to write two lines of CSS than a bunch of JavaScript.」IE 無支援但優雅降級（static flow）。

### 開源工作流

- 289+ 個公開 repo（github.com/the-pudding）
- svelte-starter：450 stars，60 forks，是業界學習 pudding 做法的主要入口
- `data` repo：所有作品的原始資料集公開，MIT license
- 每篇作品結束後方法論/資料公開是慣例

### 非互動作品的工具

- R + ggplot（靜態圖表，特別地理資料）
- Flourish（快速原型）
- Plotly（某些圖表類型）

---

## 六、可借鏡 vs 難移植（對 Taiwan.md 的判斷）

Taiwan.md 的特性：靜態 SSR（Astro）、純 markdown SSOT、多語、重視 SEO/AI 爬蟲可讀性、不想背重 JS 框架。

### 可借鏡（輕量或純 CSS 可做）

#### ✅ 1. CSS-only Sticky Scrollytelling 骨架

**做法**：`position: sticky` + CSS class toggle 觸發視覺狀態轉換
**成本**：極低，純 CSS，無 JS 依賴
**效果**：圖表跟著讀者走，不同 scroll 位置顯示不同 annotation
**Taiwan.md 應用**：長篇文章中的地圖類比較、時間軸、資料表的逐步揭露

#### ✅ 2. Annotated Static Charts（靜態標注型圖）

**做法**：SVG 或 HTML 圖 + 直接在圖上加 `<text>` annotation
**成本**：低，Astro MDX component 包裝即可
**效果**：Birthday Effect 的方式——數字就在圖上，不需要讀文字對應
**Taiwan.md 應用**：人口統計、歷史事件時間軸、統計比較圖

#### ✅ 3. Progressive Disclosure 段落結構（純 markdown）

**做法**：問句 lead → 最強 finding（sledgehammer stat）→ 逐層展開
**成本**：零（寫作規範）
**效果**：文章本身即使沒有互動也有「漸進揭露」感
**Taiwan.md 應用**：所有文章的 opening 段落設計原則

#### ✅ 4. Sidebar Annotation Pattern

**做法**：圖旁邊的文字框 annotation（CSS + HTML）
**成本**：低
**Taiwan.md 應用**：解釋統計數字、補充上下文，不需要 hover

#### ✅ 5. Small Multiples（CSS Grid）

**做法**：同樣的小圖表排成 grid，讀者一眼比較
**成本**：CSS Grid，低
**效果**：比「一張 interactive chart」的資訊密度更適合靜態場景
**Taiwan.md 應用**：多語言比較、多年份數據、縣市比較

#### ✅ 6. 「Character as Engine」敘事框架（寫作規範）

**做法**：以一個人物/案例開場，然後拉到統計
**成本**：零（寫作規範）
**Taiwan.md 應用**：人物文章 + 社會議題文章的開場設計

#### ✅ 7. Data-Driven Metaphor（概念隱喻視覺化）

**做法**：把政策/資料轉化為空間隱喻（迷宮/地圖/樹狀）
**Taiwan.md 可用場景**：台灣制度複雜度（健保、法規）可以用空間隱喻呈現
**成本**：依複雜度，SVG 版低，互動版高

---

### 難移植（需要重 JS，要取捨）

#### ❌ 1. 完整 Scrollytelling（D3 + Scrollama + Svelte）

**為什麼難**：

- SvelteKit + D3 + Scrollama 是一套完整 JS 框架，Astro 混搭需要 island architecture
- SEO/AI 爬蟲看到的是 JS-rendered 內容，可讀性差
- 多語環境下每個語言需要各自 render，複雜度×語言數
  **取捨建議**：可以做 1-2 個重點文章的 scrollytelling showcase，但不應作為預設模式

#### ❌ 2. OAuth 型個人化互動（Spotify Judge）

**為什麼難**：需要後端 + OAuth，靜態 SSR 不支援
**取捨建議**：不適合 Taiwan.md 的靜態架構

#### ❌ 3. 大規模 Canvas/WebGL 渲染（7000 dots beeswarm）

**為什麼難**：效能需求高，移動端首屏 bundle 太大
**取捨建議**：Taiwan.md 資料規模不需要這個層級，SVG 圖就夠

#### ❌ 4. 音頻整合（Musical Motifs 的 click-to-play）

**為什麼難**：瀏覽器 autoplay policy + 多語環境下音頻資源管理複雜
**取捨建議**：可嵌入 YouTube embed，不需要自己管音頻

#### ⚠️ 5. Full Interactive Explorer（大型篩選資料庫）

**可以做輕量版**：Astro 的 island + preact/alpine.js 做小型篩選，不用完整 Svelte
**限制**：SEO 可讀性取決於 SSR 是否輸出靜態 HTML fallback，需要仔細設計

---

### Taiwan.md 的核心取捨建議

**Pudding 最可學的，不是他的互動技術，是他的編輯哲學**：

- 問題先於資料（中心問題 → 找資料，不是反過來）
- 結論要明確（「water is wet」不算 finding）
- 讀者是偵探不是被告知者（互動設計讓讀者「發現」結論）
- 靜態可以很好（Birthday Effect 主要靠 annotation，不靠互動）

**技術建議**：

1. Astro MDX + CSS sticky = 輕量 scrollytelling（80% 的 Pudding 體驗，5% 的複雜度）
2. SVG annotation + CSS grid = 高品質靜態圖，對 SEO/AI 友好
3. Svelte island（只用在需要互動的區塊）= 最小化 JS bundle

---

## 七、關鍵 URL 清單

### 一手資料

| URL                                                           | 內容                      |
| ------------------------------------------------------------- | ------------------------- |
| https://pudding.cool/about/                                   | 官方定位 + 團隊 + 使命    |
| https://pudding.cool/resources/                               | 完整工具清單 + 教學系列   |
| https://pudding.cool/process/how-to-make-dope-shit-part-1/    | Data 工作流               |
| https://pudding.cool/process/how-to-make-dope-shit-part-2/    | Design 工作流             |
| https://pudding.cool/process/how-to-make-dope-shit-part-3/    | Storytelling 原則         |
| https://pudding.cool/process/introducing-scrollama/           | Scrollama 介紹            |
| https://pudding.cool/process/scrollytelling-sticky/           | CSS sticky scrollytelling |
| https://pudding.cool/process/responsive-scrollytelling/       | 手機最佳化                |
| https://pudding.cool/process/how-to-implement-scrollytelling/ | 6 個 library 比較         |
| https://github.com/the-pudding/svelte-starter                 | Svelte starter template   |
| https://github.com/the-pudding/data                           | 所有公開資料集            |
| https://github.com/russellsamora/scrollama                    | Scrollama.js source       |

### 招牌作品

| URL                                            | 作品                             |
| ---------------------------------------------- | -------------------------------- |
| https://pudding.cool/2017/03/film-dialogue/    | Film Dialogue by Gender          |
| https://pudding.cool/2017/02/vocabulary/       | Largest Vocabulary in Hip Hop    |
| https://pudding.cool/2017/09/hip-hop-words/    | Language of Hip Hop              |
| https://pudding.cool/2017/01/making-it-big/    | Unlikely Odds of Making It Big   |
| https://pudding.cool/2021/03/foundation-names/ | The Naked Truth                  |
| https://pudding.cool/2021/10/judge-my-music/   | How Bad Is Your Streaming Music? |
| https://pudding.cool/2024/10/abortion-mazes/   | Abortion Mazes                   |
| https://pudding.cool/2025/04/birthday-effect/  | Birthday Effect                  |
| https://pudding.cool/2025/02/middle-school/    | Middle Ages (Middle School)      |
| https://pudding.cool/2025/12/motifs/           | Musical Motifs                   |
| https://pudding.cool/2025/10/walk/             | Walkachusetts                    |
| https://pudding.cool/2025/04/music-dna/        | Music DNA Legacies               |

### 分析與訪談

| URL                                                                                | 內容                        |
| ---------------------------------------------------------------------------------- | --------------------------- |
| https://www.storybench.org/pudding-structures-stories-visual-essays/               | Goldenberg 談敘事結構       |
| https://www.storybench.org/the-proof-is-in-the-pudding-...                         | 完整製作流程訪談            |
| https://www.brandwatch.com/blog/interview-the-pudding-data-visualization/          | Ralph + Goldenberg 直接引言 |
| https://datajournalism.com/read/newsletters/visual-storytelling-inside-the-pudding | Diehm 談 Svelte + 流程      |
| https://peabodyawards.com/award-profile/the-pudding/                               | Peabody 2017 得獎紀錄       |

---

## 最重要洞察（5-6 句）

1. **The Pudding 的核心競爭力不是技術，是編輯哲學**：「問題先於資料」「結論要明確」「讀者是偵探」——這三條原則適用任何媒體形式，Taiwan.md 寫文章時可以直接套用，不需要任何 JS。

2. **Scrollytelling 的 80% 效果可以用 CSS position sticky 達到**：The Pudding 自己發現 CSS sticky + Scrollama step triggers 已夠用，圖形固定是兩行 CSS 的事，剩下的 JS 只是「偵測哪個段落在視窗裡」；Taiwan.md Astro 環境完全能用 island architecture 輕鬆實作。

3. **靜態 annotated chart 在 SEO/AI 爬蟲可讀性上勝過互動圖**：Birthday Effect 幾乎全部靠標注型靜態圖表傳達分析，可讀性極高，這是 Taiwan.md 多語 + SEO 優先場景的最佳模板。

4. **招牌作品的「形狀」從資料長出來，不是套模板**：V 形（Making It Big）、inverted V（microbrew）、迷宮（政策複雜度）——每個視覺形態都是論點本身，Taiwan.md 的文章視覺化應該先問「這個主題的資料形狀是什麼」，而不是先選圖表類型。

5. **The Pudding 的病毒機制是「個人化出口」**：Judge My Spotify 讓人分享自己的結果；NBA Jerseys 讓球迷選自己的隊；這個「每個讀者都有自己的入口」設計，Taiwan.md 的翻譯覆蓋儀表板 / 作者貢獻頁可以借鏡，讓 contributor 看到「我翻譯的文章現在覆蓋哪些語言」。

6. **The Pudding 的 SEO 策略靠 evergreen 問題而非時事**：791K visits/month 的流量主要靠「Film Dialogue by Gender」這種永久相關的文化問題，和 Taiwan.md 的知識庫定位高度吻合——文章不追新聞，問的是有長期搜尋需求的「為什麼台灣的 X 是這樣？」。

---

_檔案已寫入 `/Users/cheyuwu/Projects/taiwan-md/reports/research/2026-06/viz-pudding-raw.md`_
_研究者：Taiwan.md Semiont / 2026-06-06_
