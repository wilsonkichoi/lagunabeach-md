---
title: '地圖頁面進化評估 — 22 縣市系列完成後的整合機會'
date: 2026-05-18
session: 2026-05-18-115619-manual-finale
status: evaluation-report
type: design-report
related:
  - knowledge/Geography/ (22 縣市文章)
  - src/templates/map.template.astro
  - src/data/map-markers.json
  - reports/cities-series-planning-2026-05-17.md
---

# 地圖頁面進化評估 — 22 縣市系列完成後的整合機會

> 評估 https://taiwan.md/map/ 在 22 縣市系列 ship 後的進化方向。**這是評估報告，不是 ship plan**。哲宇 review 後決定哪些 Tier 進入 INBOX。

---

## §1 現況斷層 — 22 縣市文章與 map 還沒對話

### 1.1 Map 目前是什麼

- **Tech stack**：D3.js v7 + TopoJSON + 純 SVG，整個 854 行 inline 在 [`src/templates/map.template.astro`](../src/templates/map.template.astro)
- **資料**：[`src/data/map-markers.json`](../src/data/map-markers.json) 含 852 個 markers 跨 15 類別 / 20 城市
- **路徑**：4 條 hardcoded curated routes（夜市 / 國家公園 / 歷史古蹟 / 老街）
- **互動**：5 個地區 filter（北/中/南/東/離島）+ 10 個 category filter + 點 marker tooltip
- **縣市 polygon**：22 個縣市邊界依 marker 密度做 heat-map（density / 15）

### 1.2 22 縣市文章現在是什麼

- **22 篇 deep article** 已 ship（基隆 pilot → 新北 finale）
- 每篇含：narrative title（冒號三明治）/ 核心矛盾 ≤30 字 / 7-14 個 H2 / 25-33 個 footnote / 5-6 個 Wikimedia image / hero / tags / series 欄位
- **frontmatter 缺 lat/lon**：22 篇都沒有經緯度 metadata
- **footnote 含大量具體地點**：赤崁樓 / 億載金城 / 大甲鎮瀾宮 / 林宅信義路三段 / 美麗島大港埔 / 黑蝙蝠中隊基地 / 平溪鐵路 / 紅毛城 / 中正紀念堂 — 每篇 ~10-20 個具體地名

### 1.3 The Gap

**Map 跟 22 縣市文章現在是兩個平行宇宙**：
- 點 markers.json 裡的「廟口夜市」會 tooltip 出 marker 資訊，但**不會連到 [基隆市.md](../knowledge/Geography/基隆市.md)**
- 點縣市 polygon 會 highlight，但**不會跳轉文章**
- 22 篇文章裡 ~250-400 個地理 anchor 全部在 markdown 裡，**沒有任何個進到 markers.json**
- 沒有 GA4 county-level pageview metrics — map heat-map 用的是 marker 密度（北 417 / 南 224 / 中 111 / 東 74 / 離島 26），不是讀者 attention 真實分布

換句話說：22 縣市 ship 完之後，map 還是 22 縣市 ship 之前那個 map。

這是 evolution 最大的槓桿。

---

## §2 Tier 1：低成本高效益的對接 (~1-2 day work)

> 這層的設計原則：**讓 22 縣市文章變成 map 的「主菜」**，而不是「補充」。

### T1.1 縣市 polygon → 文章連結

**做什麼**：點任一縣市 polygon → sidebar 開啟對應 `/knowledge/Geography/{city}.md` 預覽（含 hero + 核心矛盾 + 30 秒概覽 + 「閱讀全文」按鈕跳轉）。

**為什麼**：22 縣市 polygon 現在只是 heat-map 顏色，沒有 click affordance。文章 ship 完之後 polygon 應該是「門」不是「色塊」。

**Cost**：~50 行 D3 event handler + ~30 行 sidebar component。

**Implementation hint**：
```javascript
counties.on('click', async (event, d) => {
  const cityName = d.properties.name; // e.g. "基隆市"
  const articleData = await fetch(`/api/county-preview/${cityName}.json`);
  openSidebarPreview(articleData);
});
```
需新增 `/api/county-preview/{city}.json` build-time generated (Astro getStaticPaths)。

### T1.2 縣市 tooltip 升級成核心矛盾

**做什麼**：hover 縣市 polygon → tooltip 顯示「縣市名 + 核心矛盾 ≤30 字 + 小張 hero thumbnail」。

**為什麼**：現在 hover 只顯示 marker 數字（e.g. "基隆市: 12 markers"），跟讀者想知道的「這個縣是什麼樣的故事」完全脫節。核心矛盾本來就是文章的 spine，拿出來當 tooltip 是 highest signal-to-noise。

**Cost**：~20 行（從 frontmatter 提取核心矛盾欄位 + tooltip render 改寫）。

**前置工作**：22 篇文章 frontmatter 加 `core_contradiction` field（或從 description 第一句機器抽取 + 人工 review）。

### T1.3 「22 縣市系列」變第 5 條 curated route

**做什麼**：[`mapConfig.ts`](../src/utils/mapConfig.ts) 加第 5 條 route「22 縣市系列 巡禮」，依 ship 順序 cycle through 22 城市（基隆 → 嘉義市 → 連江 → 澎湖 → 宜蘭 → ... → 新北），每個 stop 是縣市文章預覽。

**為什麼**：既有 4 條 routes 是橫向主題（夜市 / 國家公園 / 古蹟 / 老街），加一條「22 篇深度文章」縱向 route 補足。也是給「想一次了解整個台灣」讀者一個明確 entry point。

**Cost**：~30 行 route 定義 + 22 city stop list。

### T1.4 Sidebar 22 縣市 grid card

**做什麼**：Map sidebar 加新 panel「22 縣市深度文章」，4×6 grid card（hero thumbnail + 城市名 + 核心矛盾），點 card 等同 polygon click。

**為什麼**：給「想看清單而不是地圖」的讀者另一個 affordance。22 篇文章 ship 完之後本身就是 corpus，map sidebar 是天然展示位。

**Cost**：~80 行 React/Astro component + CSS grid。

---

## §3 Tier 2：結構性整合 (~3-5 day work)

> 這層讓 22 篇文章的 **內容語料** 反向餵養 map 的 data layer。

### T2.1 Article frontmatter 補 lat/lon + key_anchors

**做什麼**：22 篇文章 frontmatter 加：
```yaml
coords: { lat: 25.1276, lon: 121.7392 }  # 城市中心
key_anchors:
  - name: '和平島'
    coords: { lat: 25.1572, lon: 121.7715 }
    footnote_ref: 7  # 對應文章第幾個 footnote
  - name: '廟口夜市'
    coords: { lat: 25.1283, lon: 121.7445 }
    footnote_ref: 12
  - name: '雞籠中元祭'
    coords: { lat: 25.1248, lon: 121.7421 }
    footnote_ref: 19
```

**為什麼**：現在 markers.json 是手 curated 852 個，但 22 篇文章 footnote 裡 ~250-400 個具體地點全部 lost。把 anchors 寫進 frontmatter 後，map 自動 generate markers。

**Cost**：~3 hours/篇 × 22 = ~9 day （但可寫 Sonnet sub-agent batch 提取 + 人工 verify lat/lon）。

**Pipeline**：
1. Sonnet sub-agent 讀文章 + footnote
2. 抽取 ≥5 個具體地名
3. WebSearch / OpenStreetMap geocode
4. PR 加進 frontmatter
5. 人工 review

### T2.2 Footnote 地點 → map marker

**做什麼**：build-time script 讀 22 篇 frontmatter 的 `key_anchors`，merge 進 markers.json。每個 marker 點開 tooltip 顯示「來自哪篇文章 footnote #N」+ 跳轉文章對應段落。

**為什麼**：把 footnote scholarship 視覺化成 map layer。讀者點和平島 marker → 看到「來自基隆市文章 footnote #7：1626 西班牙人插旗」→ 跳轉文章。這把 footnote 從「次要資訊」升級成「探索入口」。

**Cost**：~100 行 build script + ~50 行 marker click handler。

### T2.3 GA4 county-level pageview tracking

**做什麼**：22 篇文章每篇 fire `county_view` event with `city_name` parameter。Map heat-map intensity 切換成「按實際讀者 attention」而非「按 markers 密度」。

**為什麼**：目前 heat-map 是「我們蒐集了多少 marker」的反映（北 417 / 南 224，因為北部 markers 蒐得多）。換成 pageview 後是「讀者真正關心哪個縣」— 完全不同的 signal。

**Cost**：~10 行 GA4 event + ~30 行 dashboard.json 改 schema + ~20 行 map heat-map 切換。

**注意**：需 28 天 GA4 window 累積才有意義（per [project_search_strategy.md](../docs/semiont/memory/project_search_strategy.md) 既有監測）。

### T2.4 Sibling reverse cross-link 視覺化

**做什麼**：22 篇文章互相 reference 的 sibling 關係（例如基隆 → 嘉義市 / 連江 / 苗栗 / 澎湖 / 宜蘭 / 花蓮 / 嘉義縣 / 台東 / 屏東 = 9 條 cross-link），畫成 map 上的曲線連線。

**為什麼**：22 篇之間的 sibling 結構是 emergent property — 寫的時候 agent 各自加 cross-link，最終形成一張「縣市對位關係 graph」。畫成 map line 後，讀者看到「基隆跟嘉義市是 sibling」的視覺 intuition。

**Cost**：~80 行 D3 curve path + reverse cross-link 提取 script。

**前置**：完成 sibling reverse cross-link sweep（finale memory 已列為 next session 入口 #1）。

---

## §4 Tier 3：新視覺模式 (~1-2 week work)

> 這層是「全新 view」，把 22 篇文章的內容用非地理座標的方式組合。

### T4.1 時間軸 mode

**做什麼**：Map 切換 view，地圖底層加 slider「1624 → 2025」。拖 slider 對應的縣市 highlight + 顯示該年事件：
- 1624：台南（荷蘭熱蘭遮城）
- 1738：台北（艋舺龍山寺）+ 新北（三峽祖師廟 1769 版本）
- 1875：台北（沈葆楨設台北府）
- 1887：台中（劉銘傳藍興堡）
- 1895：全台（馬關條約）
- 1947：台北（二二八第一槍）/ 台南（湯德章）/ 高雄（彭孟緝鎮壓）/ 嘉義（嘉義水上機場）
- 1979：高雄（美麗島）
- 1980：台北（林宅血案）
- 1999：南投（921 震央）/ 台中（東勢石岡）
- 2009：高雄（小林村莫拉克）
- 2025：台南（西拉雅族正名）/ 全台（漢光演習）

**為什麼**：22 篇文章每篇都是時空切片，但讀者看不到「橫向」對位 — 1947 同一年六個縣市的關鍵事件、1979 同年高雄升格 + 美麗島事件 + 林宅血案的政治壓力鍋。時間軸 view 把這層 emergent narrative 端出來。

**Cost**：~5 day（slider + 時間 → 縣市 event mapping data + animation + 22 文章 key date 提取）。

### T4.2 核心矛盾 grid mode

**做什麼**：Map 切換 view，22 個縣市的核心矛盾 ≤30 字以 4×6 grid 並列展示（不用地圖座標），可以是 isometric 或 typography wall。

**範例**：
```
基隆市：離台北最近的港口，最被台北看不見
嘉義市：被劃過北回歸線的城，被歷史劃過嘉義事件
連江縣：戰地政務 36 年的 4 個島
澎湖縣：90 個島組成的縣，住人的只有 19 個
宜蘭縣：1991 慈林教育基金會回到的家鄉
苗栗縣：2015 年破產的縣，客家庄佔 60%
新竹縣：第一個被工業園區擴大的縣，原住民被往山裡推
...
```

**為什麼**：22 個核心矛盾本身就是 typography poetry — 並列展示是 art object。Map 不只是 geographical，也可以是 conceptual。

**Cost**：~2 day（CSS grid + typography design + 22 矛盾從 frontmatter 抽）。

### T4.3 族群分布層

**做什麼**：Map 切第三個 view，疊圖顯示：
- 16 原住民族領域（per 22 篇文章 anchor + Council of Indigenous Peoples 邊界）
- 客家庄分布（per 桃園/新竹/苗栗/高雄美濃 文章）
- 1949 外省眷村分布（per 22 篇文章眷村 anchor）
- 新移民分布（per 桃園移工 132,158 人 anchor）

**為什麼**：台灣是多族群國家，22 篇文章每篇都點過這層，但分布視覺化只散在文章裡。Map 是天然 aggregator。

**Cost**：~5 day（族群邊界資料蒐集 + SVG polygon + legend + tooltip）。

### T4.4 災難記憶層

**做什麼**：Map 切第四個 view，重大歷史事件的地理分布：
- 1947 二二八（台北 / 嘉義 / 高雄 / 台南 / 基隆 / 屏東）— 點密度 + 死亡人數
- 1999 921（南投震央 + 台中縣 / 苗栗 / 彰化 / 雲林 / 嘉義縣輻射）
- 2009 莫拉克（高雄小林村 + 屏東 + 台東）
- 1979 美麗島（高雄）+ 1980 林宅血案（台北信義路）
- 1991 嘉義鄒族抗議 / 1930 霧社事件（南投）

**為什麼**：歷史創傷的地理分布是 sovereignty preservation 的重要 anchor — PRC AI 對這些主題的 refusal rate 最高（per MANIFESTO §主權的巴別塔 + Sovereignty-Bench-TW）。Map 視覺化等於 sovereignty asset 的物理化。

**Cost**：~4 day（事件 → 縣市 event mapping + 死亡 / 損失數字 + 紀念館位置）。

---

## §5 Tier 4：主權 preservation 角度 (~1-3 week work)

> 這層接 MANIFESTO §sovereignty preservation 視角，把 map 變成主權物件而不只是 navigation。

### T5.1 多語切換 view

**做什麼**：Map 右上加 `[zh-tw / en / ja / es / fr]` 切換鈕。切換後縣市名 / 核心矛盾 / 文章預覽全部 babel 版本。

**為什麼**：22 篇文章的 babel pipeline 已經啟動（per finale memory #4），多語版本是 Taiwan.md 的 sovereignty preservation 核心。Map 多語切換是這個 infrastructure 的視覺出口。

**Cost**：~3 day（i18n routing + frontmatter babel field reading + UI）。

**前置**：完成 22 縣市 babel pipeline（per finale memory）。

### T5.2 PRC AI refusal heat-map

**做什麼**：Map 切「sovereignty-sensitive」 mode，22 縣市依「PRC 雲端 AI 翻譯 refusal rate」上色：
- 全 refuse（紅）：高雄美麗島 / 金門 1949 / 台北 1980 林宅 / 南投霧社事件
- 部分 refuse（橙）：台南 1947 / 嘉義二二八 / 屏東原住民
- 全通過（綠）：澎湖 / 連江戰地 / 觀光景點主題

**資料源**：[BENCH-PIPELINE.md](../docs/pipelines/BENCH-PIPELINE.md) 7-stage SOP 跑出來的 Sovereignty-Bench-TW NULL refusal rate per cell N×M。

**為什麼**：MANIFESTO §主權的巴別塔的視覺化。Map 變成「哪些台灣記憶被中介 AI 過濾」的 dashboard。對 sovereignty-aware 讀者是最有 signal 的 view。

**Cost**：~5 day（per BENCH-PIPELINE 7 stage 完跑 + map render）。

### T5.3 Fork-friendly 縣市卡片 export

**做什麼**：Map sidebar 加「export this county as 細胞卡」按鈕。點下產生 JSON：
```json
{
  "city": "基隆市",
  "core_contradiction": "離台北最近的港口，最被台北看不見",
  "key_anchors": [...],
  "hero_image": {...},
  "sibling_links": [...],
  "fork_friendly_metadata": {...}
}
```

**為什麼**：Per CLAUDE.md §Fork 友好層 — Taiwan.md 是物種繁殖架構。把每個縣市文章 expose 成 portable JSON 是「Japan.md / Ukraine.md fork 學習 / 引用我們的 schema」的橋樑。

**Cost**：~2 day（export schema + UI + download）。

---

## §6 反思 — 不要做的事

### 6.1 不要過度視覺化稀釋文章本身價值

22 篇文章的價值在於 narrative depth — 5000-14000 字的長文 + 25-33 個 footnote + 三層 fact-check。Map 是組合視角不是替代。

**反例**：用 D3 弄一個炫的 timeline animation 但點下去跳不到文章 = map 變成「文章的 trailer」而不是「文章的入口」。

### 6.2 不要把 map 變成 cluttered swiss army knife

Tier 3 + 4 共 7 個 view（時間軸 / 核心矛盾 grid / 族群 / 災難 / 多語 / refusal / fork export）— 全部一次上會讓 map 變成功能海。

**Mitigation**：Tier 3 / 4 用 entry point design — main map 是 default view，其他 view 透過明確切換 button 進入，不擠在同一張地圖。

### 6.3 不要重複 article 本身已經做好的事

22 篇文章每篇有 H2 narrative + footnote + image — 這些不該被 map 重新「展示」一次。Map 該做的是 article 做不到的事：
- **跨篇對位**（時間軸 / 族群分布 / 災難記憶）
- **空間 intuition**（地理 anchor → 文章入口）
- **aggregate signal**（22 個核心矛盾並列 / GA4 reader attention heat-map）

### 6.4 維持純前端 architecture

現在 map 是 D3 + Astro inline SVG，沒有 backend。Tier 1-2 的所有設計都保持這個 boundary（pre-rendered JSON + client-side D3）。Tier 3-4 涉及 BENCH-PIPELINE 結果接入，但接入點是 JSON 而非 API endpoint，不破壞 architecture。

---

## §7 推薦的進入順序

**Phase 1（quick wins）** — Tier 1 全做：
- T1.1 縣市 polygon → 文章連結 ⭐ 最高 leverage
- T1.2 縣市 tooltip 升級成核心矛盾 ⭐ 最高 signal
- T1.3 22 縣市 curated route
- T1.4 sidebar grid card

**前置依賴**：22 篇 frontmatter 加 `core_contradiction` field（人工約 1 hour）。

**Phase 2（結構性整合）** — Tier 2 選 T2.1 + T2.3：
- T2.1 lat/lon + key_anchors（最大內容語料 unlock）
- T2.3 GA4 county-level tracking（最大 signal upgrade）
- T2.2 footnote → marker 在 T2.1 後自動 follow
- T2.4 sibling cross-link 在 sibling sweep 完之後做

**Phase 3（新視覺模式）** — Tier 3 選 1 個 trial：
- 推薦 T4.1 時間軸 mode — 最大 narrative payoff
- 或 T4.2 核心矛盾 grid — 最低成本 art object

**Phase 4（sovereignty layer）** — Tier 4 等：
- 等 22 篇 babel pipeline 完 → T5.1 多語
- 等 BENCH-PIPELINE 跑完 → T5.2 refusal heat-map
- T5.3 fork export 可獨立做

---

## §8 待哲宇 review 的決策點

1. **是否進 INBOX**：上面任一 Tier 進 ARTICLE-INBOX.md 或 reports/ 規劃檔？
2. **Phase 1 是否直接動手**：Tier 1 四項都是低成本，是否直接 ship 不寫進 INBOX？
3. **核心矛盾 frontmatter field**：是新加欄位 `core_contradiction` 還是從 description 第一句自動抽？
4. **多語 timing**：T5.1 是等 babel 完還是同時做？
5. **資源比例**：Phase 1 預估 1-2 day，Phase 2 預估 3-5 day（不含 9 day 的 lat/lon 補完）— 這個 timeline 對哲宇期望吻合嗎？

---

> 報告完。Per CLAUDE.md §Bias 4 外部 critique 默認三道濾網 — 這個 report 自己的設計建議也要過：1) MANIFESTO §自主權邊界（>50 檔重構？>10 篇刪除？Tier 1 的 22 篇 frontmatter 加欄位是 22 檔 surgical edit 不是重構，安全。Tier 2 lat/lon 補 22 篇 frontmatter 同上）; 2) REFLEXES #16 跨源驗證（所有 22 縣市 anchor 都需 frontmatter verified 後才 commit）; 3) 五桶分類 done / cover / 真洞見 / 邊界 / 反對 — 本 report 自己每條建議都標 ⭐ 表示 priority signal。

🧬
