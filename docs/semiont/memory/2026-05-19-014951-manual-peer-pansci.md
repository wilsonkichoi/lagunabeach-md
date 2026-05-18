---
session_id: 2026-05-19-014951-manual-peer-pansci
date: 2026-05-19
session_type: manual-observer-directive-peer-ingestion
handle: manual-peer-pansci
status: shipped
---

# 2026-05-19 manual peer pansci (014951) — Taiwan.md 第一個正式 MOU partner / Stage 1-5 全跑完 + About 公示 + INBOX P0 工作卡

> session manual peer pansci — PEER-INGESTION-PIPELINE Stage 1-5 完整跑完
> Session span: 2026-05-18 20:43 (Stage 1 啟動) → 2026-05-19 01:49:51 +0800 (~5h wall-clock)
> 上一段：[map-evolution 140415](2026-05-18-140415-manual-map-evolution.md)（Stage 4 hung 解 + 主 session 直寫）
> 資料來源：`git log %ai`

## 觸發

哲宇晚上 directive：「`/twmd-peer 泛科學`，額外附上跟對方談好他們能完整授權/轉寫的文章清單（pansci_2022_2025_authorize.xlsx），其他所有文章 follow 一般來源網址處理；同時給你合作備忘錄（Taiwan md 合作備忘錄.pdf）」。

附件就揭露**這是一個全新的 peer ingestion model**：跟 TFT / NML / NMTH-overseas 三個 fair-use peer 不同，**PanSci 是 Taiwan.md 第一個簽署 MOU 的 Content Curation Partner**。

## 進度（Stage 1-5 全跑完）

### Stage 1 fit check (commit `e05767bac`)
- 深度 15 年 / WP REST API 公開 / **MOU + 166 篇 explicit 授權** / 互補性（科學主題 Taiwan.md 缺）
- 寫成 [reports/PanSci-stage1-fit-check-2026-05-18.md](../../reports/PanSci-stage1-fit-check-2026-05-18.md)（雙軌處理 framework：A 軌 166 篇授權 / B 軌 14,061 篇 fair-use）
- MOU PDF gitignored per §6 保密義務（PDF 含對方聯繫資訊不入 public repo）

### Stage 2 爬取器 + 完整爬完
- 寫 [scripts/tools/fetch-pansci-data.py](../../scripts/tools/fetch-pansci-data.py)（idempotent + rate limit 1.2s + retry + HTML→md）
- 166/166 篇授權內容全部爬完（163 fetched + 3 從測試已存在 / 0 failed）
- 30,449 tags + 68 categories + 完整 raw provenance

### Stage 3 標準目錄
- [data/PanSci/README.md](../../data/PanSci/README.md) 雙軌處理 framework
- [docs/peers/REGISTRY.md](../peers/REGISTRY.md) 新增 PanSci 為**第 3 active peer + 第 1 MOU partner**

### Stage 4 corpus analysis report (commit `fa30da18a`)
- 寫成 [reports/PanSci-semiont-analysis-2026-05-18.md](../../reports/PanSci-semiont-analysis-2026-05-18.md)（599 行 / 9 Part）
- 13 series / 20 P0-P2 / 6 PanSci 盲點 / 36 Taiwan.md 交叉引用
- 4 core framework distill：學術翻譯雙軌（科學生 77 / 一般 89）/「來自 YT」53.6% / 流行文化錨點 / 跨諾貝爾年度

### Stage 5 INBOX 工作卡 (commit `2dc26e3b6`)
- 5 篇 P0 寫進 ARTICLE-INBOX，每篇含：核心矛盾 / PanSci 來源 wp_ids / Taiwan.md 交叉 / 台灣具體 case / 必驗事實 / 潛在陷阱 / 工時 / MOU footnote 標註提醒
- 共通說明區寫進 MOU §2.2 footnote 義務 + DNA #16 鐵律 + Semiont POV 6 盲點補位

### Stage 7 partial — About 頁 Curation Partner 公示 (commit `74d643d89`)
- [src/templates/about.template.astro](../../src/templates/about.template.astro) Curation Partner section 加 PanSci card（接 NMTH 之後第二張）
- 6 lang (en/ja/ko/zh-TW/fr/es) 文案完整，不公示 2029 期限（per 哲宇 directive）
- Logo 修了 `main img { object-fit: cover; max-height: 400px; border-radius: 12px }` global CSS 對 sponsor logo 的 clipping bug

## Lessons (今天的 finale 新增)

### Lesson #1：Sub-agent 跑 Stage 4 1h47min hung 1.5h 無 output

**症狀**：Opus sub-agent worktree+background spawn 後 JSONL 卡死，CPU 0.5% idle，1h33min 無寫入，0 output file。

**判斷**：靠 JSONL 最後 modified time + line count + last line role 確認 hung（不能靠 process alive check 因為它還在跑只是沒做事）。

**原因可能**：Sub-agent context overload — 我要它讀 PEER-INGESTION-PIPELINE (canonical) + TFT report (range) + NML report + Stage 1 report + 30-40 個 PanSci articles + Taiwan.md grep + DNA + REGISTRY。Context 撐不住。

**Fix**：kill PID + 主 session 直接寫。**Stage 4 不適合 sub-agent**，corpus analysis 需要連貫 thesis 形成，sub-agent 切換成本太高。

寫進 PEER-INGESTION-PIPELINE retrospective「Stage 4 always main session」。

### Lesson #2：MOU partner 跟 fair-use peer 是兩種完全不同 model

不能套用 fair-use peer 的處理方式。MOU partner 必須：

1. **獨立 fit check report**（含 MOU 條款摘要 + 操作含義）
2. **雙軌處理 framework**（authorized vs fair-use）
3. **gitignored MOU PDF**（保密義務）
4. **REGISTRY 加 expiry alert**（2029-12-31）
5. **About 頁 Curation Partner 公示**（§2.2 站方義務）
6. **每篇 footnote 完整 PanSci credit**（§2.2 文章層義務）
7. **Fork 友好層阻斷 caveat**（§3 不可轉讓 → Japan.md fork 不能繼承）

未來其他 MOU peer 可以套用這個 7-point checklist。

### Lesson #3：CSS global override `main img { object-fit: cover }` 對 logo 是 bug

`main img` 全域規則 set `object-fit: cover + max-height: 400px + border-radius: 12px` — 是給文章內 inline image 用的，但會誤傷 sponsor logo。NMTH logo 剛好 aspect 對得起所以看不出來，PanSci logo 626×260 aspect 才 expose 這個 bug。

**Fix**：`.sponsor-card-logo img` 加 `object-fit: contain !important + border-radius: 0 !important + max-height: none !important`。

**Pattern matching**：全域 main img rule 還會影響哪些地方？需要 grep 檢查所有 logo-like image 是否都有 escape hatch。

### Lesson #4：哲宇 directive「不寫 2029」說明 MOU 條款層級分離

INBOX P0 entries 跟 REGISTRY 內留 2029 timer，About **對外公示**不寫期限。內外資訊層級分離。

未來其他 MOU partner：合約期限是內部 admin info，對外公示用「正式 partner」表述即可。

## Next session 入口（Stage 6-8 跨 session）

### Stage 6 — 5 篇 P0 走 REWRITE-PIPELINE
INBOX P0×5 工作卡完整，可直接 spawn `/twmd-rewrite P0-1 mRNA 疫苗辛酸 30 年`：
1. mRNA 疫苗辛酸 30 年（evolution / 再生醫療雙法）
2. 氮化鎵到 3D 封裝（evolution / 半導體產業）
3. 能源 trilemma（evolution / 氣候危機與淨零轉型）
4. 2024 AI 雙諾貝爾（evolution / 台灣 AI 戰略）
5. 遊蕩犬貓 vs 原生種（evolution / 流浪動物文化）

預估總工時 17-19 hr 跨 2-3 sessions

### Stage 7 — 完整 partnership 公示

- ✅ About 頁公示已完成
- ⏳ 每篇使用授權內容的文章 footnote 完整 PanSci 標註（per MOU §2.2）— 5 P0 ship 時逐篇 enforce
- ⏳ REGISTRY status 更新（5/5 P0 ship 後）

### Stage 8 — 同步成品給王喆宣（PanSci 聯繫窗口）

- 至少 2-3 篇 P0 ship 後同步成品 + 收 feedback
- 確認 footnote 標註 format 是否符合 PanSci 期待
- 評估是否擴大授權範圍（166 → 更多）

### 其他 follow-up

- **2029-06-30**（MOU 到期 6 個月前）強制 audit + 協議延長
- 22 縣市圖片 cache 補完（前次 session 25/114 partial）
- Map evolution Tier 2-4（lat/lon frontmatter / 時間軸 view / 多語 / sovereignty refusal heat-map）

## 收尾

**Taiwan.md 第二階段（Meta-Index → Partnership layer）正式啟動**。

從第一個 fair-use peer (TFT 2026-04) 到 NML 到 NMTH-overseas 到 PanSci（**第一個 MOU partner**）—— 四個 peer / 四種 model / Taiwan.md 的策展層次擴張。

5 commit ship 整套 PanSci ingestion：
- `e05767bac` Stage 1-3 (爬取器 + 166 篇 + Registry)
- `fa30da18a` Stage 4 (9-part 分析報告)
- `74d643d89` Stage 7 partial (About 公示)
- `2dc26e3b6` Stage 5 (INBOX P0×5 工作卡)
- 加上 Stage 4 sub-agent hang lesson 主 session 直寫

Stage 6 next session 開跑。

🧬

🇹🇼 Taiwan.md v0.1.6 — 第一個 Content Curation Partner 落地。Fair-use peer 跟 MOU partner 從此並存兩條軌道。
