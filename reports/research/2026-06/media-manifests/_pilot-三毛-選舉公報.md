# Media manifests — pilot (三毛 / 選舉公報)

> 2026-06-13 媒體增補 pilot 的 2 份 manifest（綠島監獄已落地 commit bd0134b2b）。
> 軍團 fan-out（wf_e8998aa1-f1b）排除這 2 篇，故在此持久化以免遺失。
> 落地用 `image-ingest ingest`；File: 頁 URL 直接吃（Special:FilePath 解析）。

## 三毛（People, 4926字, target 4）

**hero 難題**：無 CC/PD 肖像。`Sanmao.jpg`（zh.wikipedia）fair-use only 且不可熱連結。
→ 兩條路：(a) fair-use 肖像走 皇冠 author.crown.com.tw/echo/ 找直連圖；(b) 用撒哈拉地景當 thematic Tier B hero（《撒哈拉的故事》代表作，CC 乾淨）。**建議 (b)** + 文末誠實標 Tier B。

可落地 CC 圖：
- inline `sanmao-gran-canaria-house-2018` — 故居 Calle Lope de Vega 3, Telde, Gran Canaria。CC BY-SA 4.0 / Sino Yu / 2048×1536。File: `https://commons.wikimedia.org/wiki/File:The_house_of_Calle_Lope_de_Vega_3_in_Telde,_Gran_Canaria,_Canary_Islands,_Spain.JPG`（已 dry-run 驗證可下載）
- hero/inline `sanmao-western-sahara-1973` — 西撒哈拉沙漠地景。attribution-only / Radosław Botev / 1840×1232。`https://upload.wikimedia.org/wikipedia/commons/a/ae/Western_Sahara_desert_1.jpg`
- inline（直版，僅 inline）`sanmao-olivo-oceano-memorial-2016` — La Palma「海洋的橄欖樹」荷西溺亡海岸紀念裝置。CC BY-SA 4.0 / Sino Yu / 2000×3552 portrait。File: `El olivo del océano 20161025 066.jpg`
- inline `sanmao-wufeng-dream-house` — 五峰鄉三毛夢屋（台灣端連結）。CC BY-SA 4.0 / Outlookxp（亦有 lienyuan lee CC BY 3.0 版）

negative：書封《撒哈拉的故事》皇冠版權內，需 fair-use editorial（© 皇冠文化）。無官方紀錄片 YouTube。

## 選舉公報（Politics/abstract, 5717字, target 5 → 誠實 realistic 1 圖 + viz）

可落地：
- hero `election-gazette-2000-presidential` — 2000 第十任總統副總統選舉公報封面（國立台灣歷史博物館藏 2004.028.4054）。**PD-ROC-exempt**（著作權法§9 官方文件）。2048×1507（1.36 ratio ✓ hero）。`https://upload.wikimedia.org/wikipedia/commons/b/b8/Public_announcement_papers_of_Presidential_Election_of_Republic_of_China_%28Taiwan%29_2000.jpg`

**只有 1 真圖 → 需 viz 補到 media 標準**（image-health min 3）。agent viz_recommendation：
- 台/日/韓/美/英 五國公報制度比較表（tw-* 模組）
- 公報製作六週接力流程圖

→ 抽象 Politics 的範式：1 真封面圖 + 自製 viz，不塞 generic stock。**此篇歸入「需 viz 授權」子批**（連 graph.md），非純 image-ingest。
