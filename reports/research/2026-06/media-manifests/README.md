# 媒體增補批次 — 落地接力手冊（2026-06-13）

> 哲宇 directive：「近期 100 篇沒有媒體素材的都增補進化完畢，符合最新 rewrite-pipeline 標準」+「影像後處理檢驗+調整工具全部儀器化，圖片以 WebP 為基準」。
> 本目錄是這個批次的 SSOT。任何 session（或哲宇）照本手冊就能繼續落地，不需重跑研究。

## 現況（截至 commit 8a230ddb2）

- **scope**：近期 100 篇（git 建檔 2026-05-15 → 06-13），audit 後實際 need-media = **52 篇**（28 ZERO + 24 POOR），其餘 46 篇已達標。
- **工具鏈（已 commit，儀器化完成）**：
  - `scripts/tools/image-ingest.mjs` — 單張 SSOT：ingest（下載/magic-byte/清EXIF/縮放/WebP/壓budget/命名/aspect/attribution）、check（檢驗 gate）、audit（全站體檢）。
  - `scripts/tools/land-media-batch.mjs` — 批次驅動器：讀 manifest + slug + prefix → 跑 image-ingest 每張 → 印整篇編輯計畫。
- **研究（軍團已跑完）**：`army-raw.json` = 49 篇 verified manifest（綠島/三毛/選舉公報是 pilot，另存）。每篇有 images[]（source_page/license/author/caption/alt/tier）+ videos[] + viz_recommendation + negative_findings。
- **已落地（3 篇）**：綠島監獄（commit bd0134b2b）、蛋撻、街頭塗鴉（commit 8a230ddb2）。

## 落地一篇的 SOP

```bash
# 1. 下載+處理該篇所有圖（File: URL 自動 Special:FilePath 解析）
node scripts/tools/land-media-batch.mjs --manifest reports/research/2026-06/media-manifests/army-raw.json \
  --slug <中文slug> --prefix <ascii-prefix>     # 印出編輯計畫

# 2. 把印出的 frontmatter image: / inline ![]()+caption / §圖片來源 貼進 knowledge/<Cat>/<slug>.md
#    （inline 放進主題對應的段落；hero 在 frontmatter 自動 render）

# 3. gate
python3 scripts/tools/article-health.py knowledge/<Cat>/<slug>.md --check=image-health --profile=rewrite-stage-4

# 4. commit（分 category 批次）
```

## ⚠️ Wikimedia rate-limit（必讀）

下載受 upload.wikimedia.org **429** 嚴格限流。一個 session 連續抓 ~12 張後被 ban 一陣子。
- 工具已有 8s 漸進退避 + 驅動器 5s/圖；但**仍需分波 + 波間 cooldown（建議 20s/篇、被 ban 後停 5+ 分鐘）**。
- 全 49 篇 × 3 圖 ≈ 147 張，務必慢慢來。`/tmp/paced-cache.sh` 是分波範本。

## 落地優先序（依 army-raw.json bucketing）

1. **rich-clean ZERO（最乾淨，0→3）**：擎天崗 黃氏兄弟 十大建設 台灣月老地圖 中華菱利 選舉過程 台灣科技園區外圍商圈生態 投票權門檻歷史 總統的寵物 楊維哲（+蛋撻✓ 街頭塗鴉✓）
2. **rich-clean POOR（補缺口，注意別跟既有圖重複）**：Geography 縣市（新北/花蓮/台中/連江/高雄/雲林/永康街/西門町/大稻埕/新竹/台北）、國家人權博物館、台灣與核能、群島思維、台灣BIM、天燈、用數據看台灣22縣市、刈包、台灣前50大企業、鄭愁予、台灣傳統工藝
3. **partial（2 圖，需找第 3 張或配 viz）**：臺灣前途決議文 消失的遊樂園 台灣統獨光譜 直轄市山地原住民區長 政治獻金透明度 議員制度 村里長制度 九合一選舉是什麼 新生態藝術環境
4. **需 viz/fair-use 人工子批**：
   - 抽象 Politics（選舉公報等）→ 1 真圖 + 自製 viz 圖表（connect graph.md），viz 不算 image-health count，故 image gate 會停在 WARN，可接受。
   - 無 CC 肖像 People（三毛/傅崐萁/區秀詒）→ thematic Tier B hero 或 fair-use 肖像（人工 source + © 標註）。
   - fair-use 個案（葉廷皓/蘋果麵包/飲料封膜機）→ 人工確認 `--include-fair`。

## WebP 全站遷移 roadmap（哲宇拍板項）

`image-ingest audit` 揭露：412 張圖 / 181.5MB / **0 webp** / 296 張 EXIF 殘留 / 145 超 budget。
- 新媒體已預設 WebP（本批次驗證）。
- **全站回頭轉 412 張 = §自主權邊界**（改所有 `image:`/`![]()` 引用 + 重 cache + 清 EXIF）。需哲宇拍板再做。估省 45-63MB + 清掉 EXIF 洩漏。
- 工具已備：`image-ingest ingest --src <既有檔> --format webp` 可逐張轉；批次遷移需另寫 migrate 腳本（讀文章引用 → 轉檔 → 改路徑）。
