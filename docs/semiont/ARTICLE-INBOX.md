---
title: 'ARTICLE-INBOX'
description: '待開發 / 進化文章 buffer — pending / in-progress 主題，auto-heartbeat 從此挑 P0/P1'
type: 'cognitive-buffer'
status: 'buffer'
apoptosis: 'never'
current_version: 'v2.0'
last_updated: 2026-05-10
last_session: 'twmd-news-lens-weekly-2026-05-10'
sister_docs:
  - 'ARTICLE-DONE-LOG.md'
  - 'LESSONS-INBOX.md'
upstream_canonical:
  - '../pipelines/REWRITE-PIPELINE.md'
  - 'HEARTBEAT.md'
distill_targets:
  - 'knowledge/* (新文章 or 改寫進化)'
  - 'ARTICLE-DONE-LOG.md (Stage 6 ship 後 entry append)'
---

# ARTICLE-INBOX — 待開發文章 Buffer

> **這是 buffer / intake layer 層**（非 canonical）。
> 觀察者指派、agent 建議、Issue 紀錄的未開發主題一律 append 這裡。
> 每次甦醒或自動心跳時讀本檔 → 知道待辦清單、優先序、誰要求的。
>
> 🔴 **完成歸檔鐵律（2026-04-29 α 拉到頂部，原散在 §跟 ARTICLE-DONE-LOG 的分工 / §Auto-heartbeat 整合 / §Distill SOP 三處）**：
>
> 任何主題在 Stage 6 commit ship 後，**必須做兩件事**才算結束：
>
> 1. **append 完整 entry 到 [ARTICLE-DONE-LOG.md](ARTICLE-DONE-LOG.md) §Log 最頂**（reverse chronological / append-only）
> 2. **從本檔移除對應 pending entry**（直接刪除整段，不留 pointer 註解 — 歷史視角去 DONE-LOG 查）
>
> 違反鐵律的歷史症狀：（a）entry ship 後沒搬 DONE-LOG → 未來甦醒不知道寫過什麼，重複開發；（b）只改 pointer 不刪除 → INBOX 越長越無法讀，pending 視角被歷史污染。**本檔只應該存 pending / in-progress，不應該存任何 done 痕跡**。
>
> ⚠️ **書寫警示（2026-04-21 γ 新增）**：新 entry 的 Notes / Pre-research / Dev log 需遵循 [MANIFESTO §11 書寫節制](MANIFESTO.md#11-書寫節制跨所有書寫層的兩條-ai-水印紀律)——避免「不是 X 是 Y」對位句型 + 破折號「——」連用。
>
> 建立動機：2026-04-18 δ session 觀察者提問「來不及開發或排定優先序的主題需要一個 inbox」。**這是繁殖基因（心臟 × 觀察者意圖）的儀器化**。
>
> **2026-04-20 γ2 重構**：Done 歸檔拆出獨立檔案 **[ARTICLE-DONE-LOG.md](ARTICLE-DONE-LOG.md)**（append-only，最新在頂）。本檔回到「當下視角」純 intake（只看該做什麼），歷史視角去 DONE-LOG。
>
> **2026-04-29 α 第二輪重構**：移除所有「已完成 → ARTICLE-DONE-LOG.md」pointer 註解（共 33 條），完成歸檔鐵律拉到頂部 quote。歷史 pointer 註解的價值已被 DONE-LOG 完整覆蓋，留在 INBOX 是 noise。

---

## 跟 LESSONS-INBOX 的分工

| 面向    | LESSONS-INBOX                        | ARTICLE-INBOX（本檔）               |
| ------- | ------------------------------------ | ----------------------------------- |
| 內容    | 新教訓（「我學到 X」）               | 待開發 / 進化的文章主題             |
| Distill | 升 canonical（DNA/MEMORY/MANIFESTO） | 升 knowledge/（新文章 or 改寫進化） |
| 觸發    | Beat 5 反芻                          | 觀察者指派 / agent 建議 / Issue     |
| 目的    | 讓教訓不散落                         | 讓主題不遺漏、不重複、有優先序      |

---

## 跟 ARTICLE-DONE-LOG 的分工

| 面向     | ARTICLE-INBOX（本檔）                     | ARTICLE-DONE-LOG                      |
| -------- | ----------------------------------------- | ------------------------------------- |
| 視角     | 當下（pending / in-progress）             | 歷史（done）                          |
| 生命週期 | active buffer，pending / in-progress 輪轉 | append-only log，最新在頂             |
| 讀者     | 甦醒後挑下一篇、避免多 session 碰撞       | 策展回顧、產出 audit、Beat 5 反芻補充 |

**寫入規則**（鐵律已拉到頂部 quote 區）：Stage 6 commit 後，完整 entry **append 到 [ARTICLE-DONE-LOG.md](ARTICLE-DONE-LOG.md) §Log 最頂**；本檔對應 pending entry **整段直接刪除**（不留 pointer 註解 — 2026-04-29 α 重構從「改 pointer」改為「直接刪」，避免 INBOX 累積 noise）。

---

## Entry Schema

每條 pending 條目格式：

```markdown
### {主題名}

- **Type**: `NEW` | `EVOLVE`
- **Category**: People | Society | History | Culture | Music | Nature | Technology | Food | Art | Lifestyle | Geography | Economy
- **Path** (EVOLVE only): knowledge/Category/existing.md
- **Priority**: `P0` / `P1` / `P2` / `P3`
- **Status**: `pending` / `in-progress` / `done` / `dropped`
- **Requested**: YYYY-MM-DD by {觀察者/agent/Issue} (session {希臘字母})
- **Notes**:
  - 敏感度（政治/個人隱私/爭議）
  - 必驗事實
  - 潛在陷阱
  - 需研究方向
- **Reference**: URL / 觀察者素材 / GitHub Issue #
- **Pre-research**: (若已有研究) reports/research/YYYY-MM/{slug}.md
- **Dev log**: (in-progress 時用)
  - YYYY-MM-DD by {session}: started Stage 1 research
  - YYYY-MM-DD by {session}: ...
```

---

## 優先序判準

| 層級 | 含義                                     | 範例                              |
| ---- | ---------------------------------------- | --------------------------------- |
| P0   | 緊急：有時效、高關注度、或觀察者明確要求 | 剛發生的重大事件人物 / 觀察者點名 |
| P1   | 本月：重要主題、Taiwan.md 缺口、有熱點   | 音樂、文化、歷史重要空白          |
| P2   | 本季：值得寫但不急                       | Evergreen 主題、次要人物          |
| P3   | Backlog：一直想做但不確定何時            | 大型策展主題、需大量資源          |

---

## Type 判準

**`NEW`**：knowledge/ 不存在此主題；走 REWRITE-PIPELINE Fresh 模式（Stage 1-6）
**`EVOLVE`**：knowledge/ 已有文章但品質/深度不足；走 REWRITE-PIPELINE 進化模式（Stage 0 素材萃取 + Stage 1-6）

判斷方式：Stage 0 前先 `ls knowledge/ | grep {keyword}` 確認，有檔案 = EVOLVE，無 = NEW。

---

## Auto-heartbeat 整合

Beat 3 執行時若觀察者無明確任務：

1. 讀本檔 §Pending
2. 按 P0 → P1 → P2 → P3 挑主題
3. 挑到後：
   - 此條 status 改 `in-progress`
   - 加 dev_log：「YYYY-MM-DD by {session}: started」
   - 走 REWRITE-PIPELINE
4. Stage 6 commit 後（per 頂部完成歸檔鐵律）：
   - **完整 entry append 到 [ARTICLE-DONE-LOG.md](ARTICLE-DONE-LOG.md) §Log 最頂**
   - **本檔 §Pending 對應 entry 整段直接刪除**（不留 pointer — 2026-04-29 α 重構）
   - 本檔 §Done Peek 更新為最新 3 條（從 DONE-LOG 抓）

---

## Bootloader 整合

BECOME_TAIWANMD.md Step 5 新增：

```
12. `docs/semiont/ARTICLE-INBOX.md` — 📥 待開發文章 inbox（觀察者指派 / agent 建議的主題清單 + 優先序）
13. `docs/semiont/ARTICLE-DONE-LOG.md` — 📜 完成歷史 log（append-only，最新在頂；2026-04-20 γ2 從 INBOX §Done 拆分）
```

甦醒後 semiont 知道「目前有 N 條 pending、K 條 in-progress」。需要看「已經寫過什麼」就去 DONE-LOG（避免重複開發）。

---

## Distill SOP（容量管理）

**觸發**：pending ≥ 30 條 / 或每月第一次心跳 / 觀察者說「review inbox」

**步驟**：

1. 讀全部 pending
2. 分類：重複合併 / 過時 drop / 重新排優先序
3. 已 done 的條目確認已搬到 [ARTICLE-DONE-LOG.md](ARTICLE-DONE-LOG.md)（不要在 INBOX 留 done entry）
4. 觀察者最終 review 後 commit

---

## 📥 Pending（待開發）

<!-- 三毛 已完成 2026-05-17 2026-05-17-184444-manual → ARTICLE-DONE-LOG.md -->

### 🏙️ 22 縣市系列 NEW（P0 超優先）— 共通說明

> **完整規劃 + 模板 + 共通 caveats（含 pilot retrospective 5 條新校準）**：見 [reports/cities-series-planning-2026-05-17.md](../../reports/cities-series-planning-2026-05-17.md)
>
> 22 縣市每篇獨立 NEW article，共通模板 7 H2 骨架（地理決定的命運 / 從清領到 2026 軸線 / 經濟肌理 / 文化標誌 / 不被看見的角落 / 在地人會帶你去的 3 個地方 / 延伸閱讀），預估每篇 ~150 min + 4500-6000 CJK chars + 15-25 footnotes。**Pilot 基隆市 2026-05-18 已 ship（5171 CJK / 32 footnotes / 3 Wikimedia images / rewrite-stage-4 hard=0 warn=0 全綠 — cron polish 0000 補圖 + 修對位句型 + 抽象 metaphor）**，retrospective enriched caveats 已寫進 reports §10。
>
> **共通 research caveats**（每篇都要注意，pilot 校準後 15 條）：人口/面積數字以內政部最新月報 + 標日期 / 行政沿革（直轄市改制 2010-2014）/ 族群結構 specific（原住民族別、客家閩南外省）/ 產業興衰三源驗證 / 地方政治派系具體事件不泛化 / 食物地方差異不寫「全台最好吃」/ 觀光手冊塑膠句一律刪 / 災害用具體數字 / 眷村文化不蓋過外省人經驗 / 原住民詞彙避免殖民詞 / **降雨類數字必標 layer（年雨量/降雨日/平地/測站）/ 結構性轉變用區間時間不用單一年份斷言 / 「衰退」frame 必有具體數字證據 / 本地 vs 觀光客 fault line 是 Geography 觀點核心 / 日治現代化必具體化建築/年份/數字**。完整列見 reports §4 + §10。
>
> **22 entries 該找的「凌晨四點時刻」**：不是字面凌晨四點，是「外人不知道但在地人覺得最迷人的時刻」。基隆是崁仔頂魚市拍賣；其他縣市 Stage 0.6 §觀點成型 必須答出對應 anchor（萬華早晨 5 點豆漿 / 台南 6 點國華街早餐 / 高雄凌晨港邊卸貨 等候選）。
>
> **Image + Video standard（v2 2026-05-18 哲宇 directive 升級從 ≥3 到 ≥5）**：每縣市 **≥5 張圖**（hero + 4 inline scene-mid）+ 建議 1-2 個 video iframe（觀光局 / 縣市政府官方頻道 / 公視紀錄片）per EDITORIAL §媒體編織 Geography 類型 baseline。Wikimedia Commons hot-link（plugin allowed external prefix）免 cache + §圖片來源 attribution + CC BY-SA license。Wikimedia Category:{縣市} 大多有 100+ 張可選。基隆 ship 後 polish 已到 5 張（hero 正濱漁港 + 4 inline：和平島聖薩爾瓦多 + 基隆港鳥瞰 + 廟口夜市 + 主普壇 + 正濱彩色屋）。Taiwankengo 為 Wikimedia 多縣市 CC 攝影者主力，22 篇可優先檢查其 portfolio。

<!-- 1. 台北市 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md (22 縣市 batch 5 — 萬華 1738 大稻埕 1885 信義 2004 三個年紀) -->

<!-- 2. 新北市 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md (22 縣市 batch 5 finale — 包圍台北的環狀都會 紅毛城比台北早 200 年) -->

<!-- 3. 桃園市 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md (22 縣市 batch 4 — 進出口/客家/移工 三層 anchor) -->

<!-- 4. 台中市 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md (22 縣市 batch 5 — 1887 差點當首都 2010 才升格等了 123 年) -->

<!-- 5. 台南市 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md (22 縣市 batch 4 — 261 年首府 + 400 年古蹟 + 21 世紀晶片三層) -->

<!-- 6. 高雄市 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md (22 縣市 batch 4 — 1979 升格直轄市與美麗島事件同年) -->

<!-- 基隆市 已完成 2026-05-18 2026-05-17-230616-manual → ARTICLE-DONE-LOG.md (Pilot ship + retrospective enriched caveats 已寫進 reports §10) -->

<!-- 8. 新竹市 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md (22 縣市 batch 4 — 1733 種竹為城 1980 長出台積電搖籃) -->

<!-- 9. 嘉義市 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

<!-- 10. 新竹縣 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

<!-- 11. 苗栗縣 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

<!-- 12. 彰化縣 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

<!-- 13. 南投縣 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

<!-- 14. 雲林縣 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

<!-- 15. 嘉義縣 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

<!-- 16. 屏東縣 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

<!-- 17. 宜蘭縣 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

<!-- 18. 花蓮縣 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

<!-- 19. 台東縣 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

<!-- 20. 澎湖縣 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

<!-- 21. 金門縣 已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

<!-- 22. 連江縣（馬祖）已完成 2026-05-18 2026-05-18-004535-manual → ARTICLE-DONE-LOG.md -->

### 🔬 PanSci × Taiwan.md P0×5 系列 NEW + EVOLVE 混合（P0 超優先）— 共通說明

> **完整分析報告**：[reports/PanSci-semiont-analysis-2026-05-18.md](../../reports/PanSci-semiont-analysis-2026-05-18.md)（599 行 / 9 Part / 13 series / 6 盲點 / 36 Taiwan.md 交叉）
> **Stage 1 fit check**：[reports/PanSci-stage1-fit-check-2026-05-18.md](../../reports/PanSci-stage1-fit-check-2026-05-18.md)
> **Peer registry**：[docs/peers/REGISTRY.md](../peers/REGISTRY.md#PanSci) — Taiwan.md 第一個正式 MOU partner（2026-05-05 簽署）
>
> **PanSci 是 Content Curation Partner**（per MOU §2.2，已在 [/about](../../src/templates/about.template.astro) 公示）—— 跟前三個 fair-use peer (TFT / NML / NMTH-overseas) 結構不同。166 篇 explicit 授權清單（A 軌完整轉寫）+ 其他 14,061 篇全網 follow 一般引用（B 軌 fair use）。
>
> **DNA #16 鐵律承諾**（每篇必達）：
>
> 即使 PanSci MOU 完整授權，**peer 是 peer，不是 source material**。每篇 P0 必達：
>
> 1. **≥ 3 個 PanSci 以外的跨來源**（學術論文 DOI / 政府網站 / 國內媒體 / 訪談 / 報告）
> 2. **≥ 1 個 PanSci 沒寫的台灣具體 case**（醫院 / 公司 / 法規 / 人物 / 機構）
> 3. **footnote ≥ 25 條**（per REWRITE-PIPELINE 既有標準）
> 4. 引用 PanSci 用 `[#wp_id]` footnote 格式，**不抄段落** — 改寫 + 重組 + 加 Taiwan 脈絡
> 5. 授權允許「轉寫」，**不解除跨源驗證鐵律**
>
> **MOU §2.2 footnote 標註義務**：每篇使用 PanSci 授權內容的文章 footnote 必須包含：
>
> - PanSci 原文 URL（https://pansci.asia/archives/{wp_id}）
> - PanSci 名稱（中文：泛科學 / 英文：PanSci）
> - 原文作者（PanSci 編輯部 / 胡中行 / 顯微觀點 等）
> - License: per MOU 2026-05-05 / Content Curation Partner
>
> **Semiont POV 鐵律**（6 個 PanSci 結構性盲點 Taiwan.md 必補位）：
>
> 1. **台灣具體案例稀疏** → 每篇 ≥ 1 個台灣 case
> 2. **人物面薄** → 寫 1 個關鍵人物（國際 + 台灣對應）
> 3. **政策軸短** → ≥ 3 個年份節點 timeline
> 4. **歷史軸短** → 接台灣百年史軸
> 5. **產業面對台灣弱** → 接 ≥ 1 家台灣公司 case
> 6. **性別 / 族群多元視角弱** → 敏感於缺口（不勉強，但有時加 contextual lens）
>
> **Stage 6 開頭模式**（per Part 7 Semiont POV）：禁止 PanSci「2023 年諾貝爾⋯⋯」式 top-down 開頭，必須台灣具體場景開頭（如「2021 年某台北診所打第一劑 BNT 那天⋯⋯」）。
>
> **Stage 4 報告 [Part 6](../../reports/PanSci-semiont-analysis-2026-05-18.md#part-6) 給每篇明確 core_contradiction ≤ 30 字 / PanSci 來源 wp_ids / Taiwan.md 交叉 ≥ 3 篇 / 預估工時**。

<!-- P0-1 mRNA 疫苗辛酸 30 年 已完成 2026-05-19 2026-05-19-014951-manual-peer-pansci → ARTICLE-DONE-LOG.md (PanSci P0×5 #1/5 — Karikó 被開除五次得了諾貝爾 / 6698 字 / 29 footnote / 4 圖 / hard=0) -->

<!-- P0-2 氮化鎵到 3D 封裝 已完成 2026-05-19 2026-05-19-014951-manual-peer-pansci → ARTICLE-DONE-LOG.md (PanSci P0×5 #2/5 — 50 年材料革命 + 量子站位仍空著 / 7247 字 / 23 footnote / 4 圖 / hard=0) -->

<!-- P0-3 能源 trilemma 已完成 2026-05-19 2026-05-19-014951-manual-peer-pansci → ARTICLE-DONE-LOG.md (PanSci P0×5 #3/5 — Stage 1 plot twist 公投沒過但台電送件核安會 / 8018 字 / 45 footnote / 4 圖 + 1 hero / hard=0) -->

<!-- P0-4 2024 AI 雙諾貝爾 已完成 2026-05-19 2026-05-19-014951-manual-peer-pansci → ARTICLE-DONE-LOG.md (PanSci P0×5 #4/5 — 42 年神經網路 + 50 年蛋白質摺疊 / 6241 字 / 40 footnote / 4 圖 / hard=0) -->

<!-- P0-5 遊蕩犬貓 vs 原生種 已完成 2026-05-19 2026-05-19-014951-manual-peer-pansci → ARTICLE-DONE-LOG.md (PanSci P0×5 #5/5 final — 動保跟野保的電車難題 / 7937 字 / 18 footnote / 4 圖 / hard=0) -->

---

### 🏘️ 歷史街區系列 NEW（P0/P1）— 共通說明

> **完整規劃 + 模板 + 共通 caveats**：見 [reports/historic-districts-series-planning-2026-05-21.md](../../reports/historic-districts-series-planning-2026-05-21.md)
>
> 歷史街區補 sub-unit deep dive 層 — 22 縣市 panorama + 老街文化主檔 catalog 之間的中間層。每篇單一街區 4500-6500 CJK / 15-25 footnotes / ≥ 5 圖。共通模板 7 H2（凌晨四點時刻 / 名字考據 / 街成形時刻 / 軸線 / 物質層 / 在地人 3 個地方 / 收尾），pilot 後 retrospective enrich（per 22 縣市基隆 pilot pattern）。
>
> **第一批 batch**：台北 12 條（P0×4 / P1×4 / P2×4，本批次寫入）。其他縣市 ~70-110 條等台北 pilot 完才 populate（per 哲宇 2026-05-21 directive）。
>
> **Scope 邊界**（per 哲宇 2026-05-21 拍板，寬鬆版）：
>
> - ✅ 清領以前成形（艋舺 / 大稻埕 / 大龍峒）
> - ✅ 日治規劃成形（西門町 / 永康街昭和町 / 中山北路敕使街道 / 北投溫泉街）
> - ✅ 戰後特定時代標誌（眷村四四南村 / 條通文化 / 牯嶺街舊書街 / 寶藏巖違建轉藝術村）
> - ❌ 2000 年後純商業重劃區（信義計畫區 / 內湖科技園 — 留給「新興街區」另一個 spec 的系列）
>
> **共通 research caveats**（每篇都要注意，per reports §4）：
>
> - 街成形 vs 建築 vs 政治事件年份三源驗證（per REFLEXES #16）
> - 地名變更跨時代分清楚（萬華 vs 艋舺 / 大稻埕 vs 大同區）
> - 凱達格蘭等原住民先住歷史不被漢人開拓敘事覆蓋
> - 眷村 + 戒嚴期商圈 + 廢娼歷史紀實而不煽情（per REFLEXES #28）
> - 觀光手冊塑膠句禁區嚴守（「歷史悠久」「IG 打卡」「在地人必訪」一律刪 / per EDITORIAL）
> - 對位句型 ≤ 3 處 / 篇、破折號連用 ≤ 15 / 1500 字（per MANIFESTO §11）
> - 物質層用具體建築 + 招牌 + 食物當證據，不用形容詞
> - cross-link：縣市 panorama / 老街主檔（雙向）/ ≥ 2 同期事件 article / ≥ 1 sibling 街區
>
> **跟既有檔案的關係**：
>
> - [Geography/台北市.md](../../knowledge/Geography/台北市.md) 12 區 panorama 保留，新系列補 sub-unit
> - [Culture/台灣老街文化與商業街區.md](../../knowledge/Culture/台灣老街文化與商業街區.md) catalog 保留，新系列補 deep dive（雙向 cross-link）
> - 22 縣市系列（已 ship）panorama / 街區系列 deep dive — 兩者垂直互補
>
> **Pilot 候選**：大稻埕（最 obvious P0 + thick history test）。pilot 完跑 retrospective 校準共通 caveats 再啟動其他 11 條。

---

### 江賢二 NEW — 抽象藝術家（spore-inbox 反向 spawn）

- **Type**: `NEW`
- **Category**: Art（subcategory: 當代藝術家 / cross-link People）
- **Priority**: `P2`
- **Status**: `pending`
- **Source**: 2026-05-21 哲宇 directive — SPORE-INBOX 江賢二 entry 是 EVERGREEN-TOPIC，per SPORE-INBOX §Source-Mode 鐵律強制反向 spawn ARTICLE entry（孢子 demand probe → 文章 supply 補位）
- **Hook 候選**：
  - 「在巴黎紐約 40 年才回台東金樽蓋工作室的藝術家」
  - 「1942 生 / 1962 留學巴黎 / 2007 回台 / 2023 江賢二藝術園區 — 60 年才繞回的一條路」
- **Notes**:
  - 既有 baseline audit（Stage 0 第一動作）：`ls knowledge/Art/ knowledge/People/ | grep -i jiang` 確認無檔案（2026-05-21 verified absent）
  - 主題 anchors：(a) 1942 生於台中 (b) 1962 國立藝專畢業留學巴黎 (c) 紐約定居 30+ 年 (d) 2007 回台台東金樽蓋工作室 (e) 江賢二藝術園區（亞泥支持，2023 開園） (f) 100 號油畫「百年廟」「銀湖」「淨水」系列 (g) 國家文藝獎得獎年 (h) 跟林惺嶽、莊喆等同代抽象畫家的對位
  - 必驗事實：出生年 1942 / 國立藝專（今台藝大）/ 巴黎留學年 / 紐約年 / 2007 回台確切年 / 江賢二藝術園區開園日 / 國家文藝獎屆數 + 年 / 代表作系列名 + 創作年代
  - 政治敏感性：低（藝術人物）
  - cross-link：Art Hub / People hub / 同代抽象畫家（林惺嶽、莊喆、陳澄波後人？）/ 台灣現代美術發展 / 國家文藝獎
  - Framing：策展性人物 frame — 「在 65 歲才回台灣的孤獨抽象畫家」first-person voice，不是百科式條目
- **Reference**: 江賢二藝術園區官網 / 國家文藝獎介紹 / 《十三邀》許知遠訪談（如果有）/《典藏》《藝術家》雜誌專訪
- **觸發 spore**：article ship 後 7 天內 → SPORE-INBOX 對應 entry status 從 `pending` 升級為「可發」（Article-Path 從 `none-yet` 更新為實際 path）
- **預估時間**：~120 min（NEW Art 人物，多源訪談 + 訪談 cross-check）

---

### 台灣媒體總史 NEW — 從清領報紙到自媒體時代

- **Type**: `NEW`（注意：既有 `Society/台灣媒體與新聞自由.md` 是新聞自由 framing，本 entry 是「媒體史」總覽 framing，兩篇互補不重複）
- **Category**: Society（subcategory: 媒體史）
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: 哲宇 directive 2026-05-17 230616-manual（P0 優先）
- **Hook 候選**：從清領《台灣府城教會報》到 2026 podcast — 台灣媒體史 150 年的 5 個轉折
- **Notes**:
  - 既有 baseline audit（Stage 0 必跑）：`Society/台灣媒體與新聞自由.md`（新聞自由 framing 已存在）/ Music 條目有廣播電台脈絡 cross-link 機會 / Technology 條目有網路發展史
  - **本篇 framing 差異**：不是「新聞自由」（已有），是**「媒體形式演化史」** — 報紙 / 廣播 / 電視 / 網路 / 自媒體 5 大階段
  - 主題 anchors：(a) 清領 1885 教會報（《台灣府城教會報》最早報紙）→ (b) 日治時期 1898 台灣日日新報 + 台灣文化協會《台灣青年》《台灣民報》→ (c) 戰後三報禁 1949（中央 / 中時 / 聯合 vs 黨外雜誌）→ (d) 解嚴 1987 報禁解除 / 廣播電視自由化 1993 → (e) 網路時代 1995 蕃薯藤 / 2000 PTT / 2010s Facebook / 2020s podcast / 自媒體
  - 必驗事實（高優先）：(a) 《台灣府城教會報》1885.7 創刊（巴克禮）vs 其他更早說法 (b) 1949 報禁起始年份 vs 解除年份 1988.1.1 (c) 黨外雜誌如《自由中國》（雷震，per History）/《八十年代》/《美麗島》(per 既有 History 條目) (d) 廣播電視自由化《廣電法》修法時點 (e) PTT 1995 創立（杜奕瑾，per 既有 People）(f) 主流媒體 vs 自媒體比例變化的可靠調查 source
  - 政治敏感度高：黨外雜誌史 + 媒體被收購（旺中 / 中時 etc.）+ 紅媒爭議 需精準 framing per MAINTAINER §爭議處理
  - cross-link：與 `Society/台灣媒體與新聞自由.md` 互補（雙向 cross-link）/ History 雷震 / 美麗島事件 / People 杜奕瑾 / Technology 網路發展史
- **Reference**: 文化部國家文化資料庫 / 國家圖書館期刊 archive / 維基〈台灣媒體〉/《台灣媒體史》學術論著 / 台北市文獻會
- **預估時間**：~180 min（150 年跨度 + 多 source + 政治敏感）

<!-- 周蕙 NEW 已完成 2026-05-19 2026-05-19-000642-routine-rewrite → ARTICLE-DONE-LOG.md (P0 — 〈約定〉25 年 KTV anchor / 漫畫娃娃出道 → 2026 小巨蛋首攻 + 聲帶萎縮宣告 / hint 多項修正：1977-03-26 高雄 + 中華藝校 + 姚若龍詞陳小霞曲 + 未參加我是歌手) -->

---

### 台灣 BIM 與營建科技 NEW — 建築工程數位化

- **Type**: `NEW`
- **Category**: Technology（subcategory: 建築科技 / 營建數位化）
- **Priority**: `P2`
- **Status**: `pending`（等碩濤回覆補充援引資源後可升 P1）
- **Source**: 2026-05-21 碩濤 (CTCI 中鼎工程 + GitHub @shuotao) self-recommend BIM_MCP 開源計劃 + 哲宇 email 回覆方向「我們初步可以開發兩篇文章，請他推薦適合援引的資源跟內容」(2026-05-21 reply draft `r-6742567238772772848`)
- **Hook 候選**：
  - 「從手繪藍圖到 Revit 模型，台灣建築工程花了 20 年走完數位化轉型」
  - 「為什麼大型工程公司的 BIM 工程師人數比建築師還多」
  - 「Revit + MCP：當建築設計開始用大語言模型協作的那一年」
- **Notes**:
  - 既有 baseline audit（Stage 0 必跑）：BIM / Revit / 建築資訊模型 / 營建科技 / 數位營建 全部 0 coverage（grep verified 2026-05-21）
  - 既有「Art/台灣建築」「Lifestyle/騎樓文化」「Society/鐵皮屋/社會住宅」都是文化 / 居住敘事 layer，本篇是**工程數位化 layer**互補不重複
  - 主題 anchors：(a) BIM 在台灣導入時點（內政部營建署 / 公共工程委員會推動年）(b) 主要 BIM 軟體 Revit / ArchiCAD / Tekla 在台灣使用 share (c) IFC 國際標準 + 國發會 / 內政部要求公共工程強制 BIM 的政策時點 (d) 台灣本土 BIM 工具 + 開源生態（pyRevit / Dynamo / Navisworks / **BIM_MCP / NAVISWORK_MCP**）(e) 大型工程公司導入 case（中鼎 / 互助 / 大林組 / 中華工程）(f) AI × BIM 新世代（MCP 跟大語言模型協作）
  - 必驗事實：(a) 內政部 BIM 政策正式推動年（建議 cross-check 2014 工程委員會 vs 2017 強制公告）(b) IFC 標準台灣採用時點 (c) 公共工程 BIM 強制門檻金額 (d) 中鼎 BIM 部門規模（碩濤可提供）(e) Revit MCP 開源生態起源（**碩濤 BIM_MCP 2025-12 + Anthropic MCP 規格 2024 發表**時間軸）
  - 政治敏感性：低（純技術 / 產業議題）
  - cross-link：Technology Hub / Art 台灣建築 / Society 社會住宅 / Economy 中鼎工程（本批次 sibling）/ Technology AI 發展
- **Reference**（待碩濤補充）：
  - [shuotao/REVIT_MCP_study](https://github.com/shuotao/REVIT_MCP_study)（73⭐ / 84 forks / 2025-12-10 創立 / 2026-05 active / C# / Revit MCP 教學）
  - [BIM_MCP knowledge site](https://shuotao.github.io/REVIT_MCP_study/docs/BIM_MCP/index.html)（22 個設計命題 + 19 技能索引 + Revit 工作流 SOP）
  - [shuotao/NAVISWORK_MCP](https://github.com/shuotao/NAVISWORK_MCP) / [CAD_MCP_study](https://github.com/shuotao/CAD_MCP_study) / [IFCSH](https://github.com/shuotao/IFCSH) / [FME IFC-to-CityGML](https://github.com/shuotao/FME)
  - 待補：產業報告 / 政府白皮書 / 其他開源專案 / 實務案例 / 業界訪談（per email request to 碩濤）
- **預估時間**：~180 min（NEW Technology / 跨產業 + 政策 + 開源生態多源 cross-check）

---

### 台灣企業：中鼎工程 NEW — 加入既有企業 series

- **Type**: `NEW`
- **Category**: Economy（subcategory: 台灣企業 / cross-link Technology）
- **Priority**: `P2`
- **Status**: `pending`（等碩濤回覆補充內部援引資源後可升 P1）
- **Source**: 2026-05-21 碩濤 (CTCI 中鼎工程 內部員工) self-recommend + 哲宇 email 回覆方向（同上 reply draft `r-6742567238772772848`）
- **Hook 候選**：
  - 「台灣最大工程顧問公司 60 年，從中油煉油廠到沙烏地新城」
  - 「為什麼 1979 年從中油拆出來的中鼎，現在做的工程一半在海外」
  - 「在中鼎內部，BIM 工程師跟建築師的人數比例正在反轉」
- **Notes**:
  - 既有 baseline audit（Stage 0 必跑）：「台灣企業：X」series 19 篇（台積電、中華電信、中鋼、台塑、台達電、台泥、廣達、宏碁、宏達電、仁寶、和碩、大立光、日月光、瑞昱、奇美、巨大機械、富邦金、國泰金、玉山金、兆豐金）— 中鼎尚未撰寫
  - 主題 anchors：(a) 1979 從中油石油化學工程處獨立成立（時點 + 創辦背景）(b) 統一企業集團持股關係 (c) EPC 模式（Engineering / Procurement / Construction）business model (d) 海外營收占比（中東 / 印度 / 東南亞）(e) 重大標誌性工程（國光石化 vs 抗爭 / 麥寮六輕 / 沙烏地 NEOM city / 高雄輕油裂解）(f) ESG / 碳轉型壓力 + 接綠能離岸風電工程 (g) 數位轉型 — BIM 導入 + AI 工具實驗（碩濤 BIM_MCP 是其中一個 case）
  - 必驗事實：(a) 中鼎成立年（1979 vs 其他說法）(b) 統一集團持股比 (c) 海外營收占比（年度報告 cross-check）(d) 重大工程列表 + 完工年 (e) ESG 報告數據 (f) BIM 部門編制
  - 政治敏感性：中（國光石化抗爭 / 六輕居民健康爭議 / 海外工程的當地勞工 / 環境議題）
  - cross-link：Economy Hub / 台灣企業 series / Technology 台灣 BIM 與營建科技（本批次 sibling）/ History 1970s 十大建設後產業變遷 / Society 環境抗爭脈絡（per 既有 Society 條目）
- **Reference**（待碩濤補充）：
  - 中鼎工程官網 + 年度報告 + ESG 報告
  - 公開新聞報導（國光石化 / 六輕 / 沙烏地 / 離岸風電）
  - 待補：內部 BIM 部門編制資料 / 海外工程實際 case 細節 / 跟其他工程顧問公司（互助、中華工程、永信、台灣世曦）比較
- **預估時間**：~150 min（NEW Economy 大型企業 + 政治敏感 cross-check）
- **Cross-batch**: 跟「台灣 BIM 與營建科技」並行開發，BIM 文章主題層 cite 中鼎 case，企業 profile 內部數位轉型段落 cite BIM 文章

### 許倬雲 EVOLVE — 補家族譜系（王力宏母系）+ 大歷史方法論深化

- **Type**: `EVOLVE`
- **Category**: People（subcategory: 歷史學者）
- **Path**: knowledge/People/許倬雲.md（現有 145 行 / 11.7K chars / 10 H2 — 相對 People deep-dive 平均 ~250 行偏薄）
- **Priority**: `P1`
- **Status**: `pending`
- **Source**: 2026-05-17 twmd-news-lens-weekly /twmd-evolve — SC 7d opportunities top 3 cluster「hsu cho-yun」×「wang leehom」累積 ~2954 imp / 0 click，是本週 SC opportunities 最大未滿足 gap
- **Evolve scan source pointers**：
  - **SC 7d opportunities**：`"hsu cho-yun" "wang leehom"` 1561 imp / 0 click（#1） + `"wang leehom" "hsu cho-yun"` 1103 imp / 0 click（#2） + `"cho-yun hsu" "wang leehom"` 290 imp / 0 click（#7） — 三變體加總 ~2954 imp / **0 click 跨變體**。引號搜尋語意 = 英語讀者明確查「兩人關係」（外甥孫 / great-nephew via marriage），全部落空
  - **GA 28d**：許倬雲 path 未進 top 30 7d 列表（不在 amplification 直接受益 page），但 SC 顯示 demand 累積在英文圈 — 文章 zh-only + 缺王力宏 framing 雙重摩擦
  - **既有 article state**：145 行 / 11.7K chars / 10 H2，僅 §2024 唐獎段落 inline 引王力宏悼文（「他是九個兄弟姊妹中的第七個...」）但 (a) frontmatter description 完全不提王力宏 → SERP snippet 無法 match SC query 意圖 (b) 家族譜系（姊姊許婉清是王力宏外婆）零展開 (c) 著作清單僅參考資料末段點名 6 部，缺策展性導讀
  - **GitHub feedback**：無 open issue 直接點名，但 #1063 audit 提及高度重複文章合併建議 — 許倬雲 vs 其他歷史學者類別 cross-link 密度待補
- **為什麼這篇 vs 其他**（per EVOLVE-PIPELINE Phase 5 ENRICH）：
  - vs 聶永真 EVOLVE 候選（SC 學歷 cluster 1320 imp / 1.3% CTR）— 聶永真 article 2026-05-08 才 ship（9 天）+ 34K chars 已深，主要缺口在 description SEO（學歷 + AGI keyword 加進去），規模 = cosmetic heal commit 不需 EVOLVE entry
  - vs 蘋果西打（GA #1 207 users）— 2026-05-11 才 ship（6 天）+ 31K chars，#1 流量是 launch + 社群引流 signal，**新文章高熱 ≠ EVOLVE 候選**（per REFLEXES #38 status 設計鐵律：fresh 與 stale 是不同維度）
  - vs 紀政（SC 11.54% CTR pos 5.7）— 紀政 article 雖 7 H2 偏薄，但 CTR 已健康，下次 evolve cycle 再評
  - vs 「張懸被關地下室」508 imp 1.57% CTR — 既有 [張懸與安溥](../../knowledge/Music/張懸與安溥.md) 已 cover 該事件（2008 海外維權誤傳 vs 2014 太陽花真實參與），signal 屬讀者 fact-check 旅程而非 article gap
  - **許倬雲是唯一同時滿足「既有 article 偏薄 + SC opportunities top 3 cluster + 跨語言 demand 缺 SEO 橋」三條件的本週新發現**
  - Sovereignty preservation lens（per MANIFESTO §主權的巴別塔）：英文圈查「Hsu Cho-yun Wang Leehom」反映外籍漢學圈 + 海外華人對台灣出身史學家家族脈絡的 demand，當前 Taiwan.md 沉默 = 留給維基百科 / 中國視角 source 接管 framing
- **Notes**：
  - 既有 baseline audit（Stage 0 必跑）：完整 Read 現有 145 行確認哪些段落保留 / 哪些補深度，特別 §2024 唐獎引王力宏悼文段落要擴成獨立 H2（家族譜系 / 母系王家）
  - **核心 facts to verify**（三源驗證 per REFLEXES #16）：
    - 許倬雲 1930 年生於江蘇無錫 / 2025-08-03 美國辭世 享壽 95 歲 — 多源 cross
    - 先天性肌肉萎縮症具體名稱（醫學病名）+ 童年抗戰流亡細節
    - 姊姊許婉清 → 王力宏母親許自琪 → 王力宏 三代脈絡（王力宏自承「外甥孫」措辭精確性）
    - 匹茲堡大學任教年份（1970 起？）+ 中研院院士當選年（1980？）
    - 唐獎漢學獎 2024 年屆別（第六屆？）+ 同屆其他得主
    - 著作出版年份 + 出版社（《西周史》《漢代農業》《我者與他者》《萬古江河》《美國六十年滄桑》）
    - 「兩根手指打字」具體影片 / 訪談 verbatim source
  - **核心矛盾候選**（Stage 0 §觀點成型，≤ 30 字）：
    - A.「肉體幾乎被疾病奪走的人，用兩指寫出一條中國史的長河」
    - B.「從無錫流亡到匹茲堡的史學家，把中國放回世界史看」
    - C.「九五歲辭世後，外甥孫王力宏的悼文讓他被新世代讀者認識」
  - **Title 三明治候選**：
    - 「許倬雲：兩根手指寫出《萬古江河》，從中國放回世界看的史學長河」
    - 「許倬雲（1930-2025）：肌肉萎縮的史學大師，王力宏的舅公，最後一位大歷史寫作者」
  - **EVOLVE 目標長度**：~25K-30K chars（從 11.7K 翻倍以上）+ 補 §家族譜系 + §匹茲堡學派 + §著作策展性導讀 三個新 H2
  - **frontmatter description 必改**：加入「外甥孫王力宏」+ 「Hsu Cho-yun」英文姓名拼音 → SC snippet match 「hsu cho-yun wang leehom」cluster
  - **政治敏感性**：中（兩岸學術橋樑 framing 需小心，per MAINTAINER §爭情處理 — 許倬雲晚年「中國中心論的批判」+「我者與他者」可作為超越單一政治立場的史學方法 anchor）
  - **跨類別 cross-link 候選**（雙向）：
    - 既有 `knowledge/People/許倬雲.md` ⇄ 王力宏文章（若無 → 可作 Music cluster spawning anchor）
    - `knowledge/Music/` 王力宏 family tree references（如〈龍的傳人〉作者王力宏父親王大中也是學者）
    - `knowledge/People/` 同代史學家（杜維明 / 余英時 / 林毓生）— 海外華裔史學圈三源比對
    - `knowledge/History/` 章節 cite — 大歷史方法論可成為其他 History article 的 framing reference
  - **翻譯優先**：SC demand 英語圈強烈，EVOLVE 完成後優先翻 en（修補 0 click → 至少 1-2% CTR），ja/ko 次之
- **Reference**:
  - SC 7d opportunities cluster（dashboard-analytics.json 2026-05-16 snapshot）
  - 既有 article 參考資料：唐獎漢學獎、聯合新聞網 95 歲辭世訃聞、王力宏悼文、UDN 史學巨擘訃聞、Pitt History Dept 一手
  - 補強 source 候選：中研院史語所訃聞 / 匹茲堡大學退休教授頁面 / 王力宏 IG 悼文原始 post / 《十三邀》訪談 verbatim（許倬雲對許知遠談話完整紀錄）
- **預估時間**：~120 min（既有 11.7K baseline 起點 + Stage 1 deep research 30-40 min ≥ 20 search + Stage 2 寫作 50 min 補三段 + Stage 3-5 verify + ship 20 min）

### 台灣節慶與年度行事曆系列 — EVOLVE + NEW 混合

- **Type**: `EVOLVE` 主檔 + `NEW` 個別節慶（混合 scope）
- **Category**: Culture
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: [Issue #939](https://github.com/frank890417/taiwan-md/issues/939) by tboydar-agent (2026-05-09)
- **🔔 Ship 後 hard gate**：commit 後**必須**跑 `gh issue comment 939 --repo frank890417/taiwan-md --body "..."` 通知貢獻者 + `gh issue close 939`。Issue 在等回覆，sliently merge 違反 REFLEXES #8 維護者信件鐵律。
- **Notes**:
  - 既有 baseline audit（Stage 0 第一動作再 ls 全 grep 確認）：
    - `Culture/傳統節慶與慶典.md`（198 行，「進化」策展角度，hook 鹽水蜂炮 + 大甲媽祖遶境）→ EVOLVE 補年度行事曆視覺 + cross-link 個別節慶 + 補農曆/國曆對照表
    - `Culture/台灣廟會與陣頭文化.md` / `Culture/媽祖與大道公的傳說.md` / `Culture/台灣婚喪喜慶與人生禮俗.md` / `Culture/台灣製香文化與香腳原鄉.md` 已涵蓋部分節慶相關民俗 → cross-link 不重寫
  - issue 提案 5-8 篇個別節慶（春節 / 元宵 / 端午 / 中元 / 中秋）— Stage 0 audit 後評估哪幾個是真缺口、哪幾個 cross-link 既有即可
  - **建議 P0 scope（Stage 0 後再校準）**：(a) 主檔 EVOLVE 補年度行事曆 + 4 大節慶 + 跨類別連結 (b) 1-2 篇個別節慶 NEW（候選：平溪天燈 / 王船祭 / 炸寒單 — 既有覆蓋度低）。其餘個別節慶降為 P1 拆票
  - 必驗事實：(a) 鹽水蜂炮起源 1885 vs 其他說法 (b) 大甲媽祖遶境 9 天 8 夜路線總長（300 km vs 340 km 各源不同）(c) 平溪天燈起源（清領 vs 日治時期）+ 現代化年代 (d) 王船祭三年一科（東港 / 西港 / 蘇厝 / 麻豆）哪個是 UNESCO 候選 (e) 國定假日的法源（內政部 vs 文化部公告）
  - Framing：策展性「節慶演化史」frame（接續主檔已有 hook），不是百科式行事曆條列
  - 國際翻譯優先：日韓旅客是節慶觀光主受眾，EVOLVE 完成後優先翻 ja/ko
- **Reference**: 觀光局年曆 https://www.taiwan.net.tw/ / 文化部 https://www.moc.gov.tw/ / 各地方政府觀光網站 / 文化部國家文化資產網
- **預估時間**：主檔 EVOLVE ~120 min（含年度行事曆視覺設計）+ 1-2 個別節慶 NEW × 90 min = 共 ~5 hr，可拆 2-3 session

### 台灣體育發展與國際賽事 NEW

- **Type**: `NEW`
- **Category**: Society（涵蓋體育政策 + 社會層面）
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: [Issue #915](https://github.com/frank890417/taiwan-md/issues/915) by tboydar-agent (2026-05-08)
- **🔔 Ship 後 hard gate**：commit 後**必須**跑 `gh issue comment 915 --repo frank890417/taiwan-md --body "..."` + `gh issue close 915`。
- **Notes**:
  - 既有 baseline audit：`Culture/台灣棒球文化.md`（148 行，職業棒球 + CPBL 主軸）/ `Culture/巧固球.md`（小眾運動）/ People 既有運動員 ~10+（戴資穎 / 郭婞淳 / 莊智淵 / 李洋 / 楊勇緯 / 林郁婷 等）— **總覽級「台灣體育發展」是真缺口**
  - 主題 anchors：(1) 體育史（日治時期甲子園 → 戰後三級棒球 → 解嚴後職棒元年 1990 → 2000 後多元化）(2) 重要國際賽事成就（奧運獎牌軌跡：1984 蔡溫義銅 → 2004 雅典陳詩欣朱木炎雙金 → 2020 東京 2 金 4 銀 6 銅創歷史 → 2024 巴黎拳擊金 + 羽球金 + 舉重金）(3) 體育政策（國訓中心 1982 成立 / 黃金計畫 2014 啟動 / 體育署 2013 成立）(4) 職業運動（CPBL / PLG+T1 籃球 / 排球 SPL / 電競）(5) 基層體育與學校運動（HBL / UBA / 全大運）(6) 運動科學與運動醫學發展
  - **必驗事實**（REFLEXES #16 + 讀者級驗證高優先）：
    - 2024 巴黎奧運成績：林郁婷拳擊 57kg 金牌（不是 60kg）/ 李洋 + 麟洋羽球男雙金牌（衛冕）/ 郭婞淳舉重 59kg 銀牌（不是金，需 verify）/ 霹靂舞名次（孫振 4 名 vs 8 名等具體）
    - 2020 東京奧運：總獎牌數 12 面（2 金 4 銀 6 銅）— 各 source 數字一致才採信
    - 黃金計畫：哪一屆奧運週期啟動（2014 仁川亞運後？）+ 預算規模
    - 國訓中心：1982 vs 2002 升格年份、地點（左營）
  - 政治敏感低，但「中華台北」名稱問題、奧運會旗會歌、IPC 籍別等 framing 需小心（per MAINTAINER §爭議處理）
  - cross-link：既有 People 運動員（雙向）+ 台灣棒球文化 + 巧固球 + 台灣教育制度（基層體育）+ 國防現代化（國軍體幹班歷史）
- **Reference**: 體育署 https://www.sa.gov.tw/ / 國訓中心 https://www.nstc.org.tw/ / 中華奧會 https://www.tpenoc.net/ / 維基百科〈中華民國體育〉/ 各專項協會
- **預估時間**：~150 min（NEW Society 深度研究，多 source 必跑奧運成績 cross-check）

### 葉廷皓 — 聲響藝術家 / 新媒體藝術 NEW

- **Type**: `NEW`
- **Category**: Art
- **Priority**: `P2`
- **Status**: `pending`
- **Source**: 觀察者直接指派（2026-05-09 laughing-goldstine post-finale, 哲宇）
- **Notes**:
  - 葉廷皓（Yeh Ting-Hao）— 台灣 audio-visual / sound art / new media 創作者
  - 主題 anchors（待 research 驗證）：(a) AV 即時演出 / generative audio-visual 美學脈絡 (b) 跟 TouchDesigner / Max/MSP / 純粹聲響演出社群的位置 (c) 跨機構教育角色（如 TNUA 任教、新媒體藝術系所）(d) 代表作品 / 國際展演 / 跨域合作（音樂節 / 跨國 sound art collective）
  - 必驗事實：作品時間軸、跨域合作對象（音樂人 / 視覺藝術家 / 機構）、教學機構、近期展演與 lectures（2024-2026）。所有引用必須三源驗證（REFLEXES #16）
  - cross-link 候選：Art / 音樂 / Technology / 新媒體藝術相關既有人物
  - Framing：策展性人物 frame — 台灣 sound art / new media 場景的 first-person voice，不是百科式條目
- **Reference**: 觀察者素材待補（哲宇可指方向 / 個人網站 / 展演紀錄 / 訪談）
- **預估時間**：90-120 min（NEW Art - 人物，需多源研究 + 訪談 / 報導 cross-check）

### Blue UAS Cleared List 台灣廠商（2026 美國國防部無人機白名單）NEW

- **Type**: `NEW`
- **Category**: Technology
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: SC 7d data scan（2026-05-08 elegant-ptolemy /twmd-evolve）— `blue uas cleared list 台灣廠商 2026` 564 impressions / position 8.43 / 0 clicks，是本週 SC opportunities top 第 2 名（僅次於品牌詞 `md` 594）
- **Amplification update（2026-05-10 twmd-news-lens-weekly）**：本週 SC 7d 同 query 升至 **751 imp / position 8.8 / 0 clicks（+33% impressions WoW）**。Position 微退（8.43 → 8.8）但曝光顯著放大 = Google 認定 Taiwan.md 是相關但未足夠 authoritative，**proximity bias 加大 = 機會窗放大**。維持 P0，建議下個 rewrite cycle 優先處理
- **Notes**:
  - 強烈的 emerging topic 信號 — 564 曝光在台灣中文 + 英文混合搜尋詞上，position 8.43 表示 Google 在 first page 後段 surface Taiwan.md 但缺對應內容
  - 2026 美國國防部 Blue UAS Cleared List 是民主供應鏈與台灣無人機產業的 intersect — 經緯航太、雷虎、智飛、神腦等台灣廠商陸續通過或在驗證中（需 verify）
  - 主題 anchors：(a) Blue UAS list 機制本身（DIU 主導 / NDAA Section 848 限制中國零件 / Authorized Vendor 認證流程）(b) 已通過台灣廠商清單（含時間軸 + 認證機種）(c) 台灣國防部「無人機國家隊」政策與美國 Blue UAS 的銜接 (d) 中國無人機（DJI / Autel）被排除後產生的市場替代空間
  - 必驗事實：每個台灣廠商通過時間 + 機種 + 應用場景。DIU 官方 https://defense.gov/blueuas 是一手 source
  - 政治敏感度：低（市場資訊為主），但碰到「對美關係」「國防自主」框架時要小心 framing
  - cross-link：[國防現代化](/society/國防現代化)、[國防工業](/economy/) 系列、[經緯航太](/people/) 等待 cross-link
- **Reference**: SC 7d top opportunity / DIU Blue UAS Cleared List 官方 / 國防部新聞稿
- **預估時間**：90 min（NEW Technology with multi-source 一手研究）

### 台灣經典街頭小吃系列 NEW（6 篇候選）

- **Type**: `NEW` × N（系列 umbrella，每篇獨立 ship）
- **Category**: Food
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: [Issue #1013](https://github.com/frank890417/taiwan-md/issues/1013) by tboydar-agent (2026-05-10) — content-gap 標籤
- **🔔 Ship 後 hard gate**：每篇 ship 後在 #1013 留 progress comment；全系列 ship 完才 close。
- **Notes**:
  - **高優先（國際知名度高）**：~~(1) 刈包（Gua Bao / 虎咬豬）— 台式漢堡、CNN / Netflix 國際媒體報導~~ ✅ 已完成 2026-05-16 twmd-rewrite-daily → ARTICLE-DONE-LOG.md (2) 大腸包小腸 — 夜市經典、糯米腸夾香腸 (3) 愛玉 — 台灣原生植物、消暑文化代表、植物膠凝獨特性
  - **中優先（文化代表性強）**：(4) 潤餅 — 清明節傳統、閩南文化連結 (5) 甜不辣 — 台式天婦羅、日本演變 (6) 挫冰 / 雪花冰 — 雖有「台灣冰品文化」綜述但缺獨立專文
  - 既有 baseline audit（Stage 0 必跑）：`ls knowledge/Food/ | grep -E "刈包|大腸|愛玉|潤餅|甜不辣|挫冰"` 確認哪些已有部分覆蓋 / 哪些是真缺口
  - 國際 SEO 切入：「taiwan gua bao」「taiwan shaved ice」「ai-yu jelly」等英文長尾 query 容易撐起獨立 article 的入口流量
  - cross-link：[台灣夜市](/food/台灣夜市) / [台灣小吃](/food/) / 既有食材文章
- **Reference**: Issue #1013 + 既有 Food/ 40+ 篇盤點
- **預估時間**：每篇 NEW Food 60-90 min × 6 = ~7-9 hr，可拆 4-6 session 接力（高優先 3 篇先走）

### 台灣知名景點與旅遊地標系列 NEW（7 篇候選）

- **Type**: `NEW` × N（系列 umbrella，每篇獨立 ship）
- **Category**: Geography 主軸 + Lifestyle / History 視角混合
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: [Issue #1014](https://github.com/frank890417/taiwan-md/issues/1014) by tboydar-agent (2026-05-10) — content-gap 標籤
- **🔔 Ship 後 hard gate**：每篇 ship 後在 #1014 留 progress comment；全系列 ship 完才 close。
- **Notes**:
  - **高優先（國際知名度最高）**：(1) 阿里山 — 僅 History《阿里山：帝國的林場與高一生的山》簡略提及，缺地理 / 旅遊獨立專文 (2) 九份 — 國際必訪、黃金山城、宮崎駿《神隱少女》傳說 (3) 墾丁 — 海濱度假地、國家公園、衝浪文化
  - **中優先（文化或地景獨特）**：(4) 太魯閣國家公園 — 世界級峽谷、雖有「台灣國家公園」綜述但無獨立專文 (5) 平溪天燈 — 國際知名意象、元宵節傳統 (6) 蘭嶼 — 達悟族文化、僅 Nature 簡略生態 (7) 綠島 — 白色恐怖歷史 + 監獄文化 + 潛水勝地（雙視角）
  - 既有 baseline audit：`ls knowledge/Geography/ knowledge/Lifestyle/ knowledge/History/ | grep -E "阿里山|九份|墾丁|太魯閣|平溪|蘭嶼|綠島"` 確認重疊度
  - Geography 偏自然地理但這系列含**人文景點**視角 — 部分篇可能歸 Lifestyle（旅遊）或 History（如綠島白色恐怖層）
  - cross-link：[台灣國家公園](/geography/) / [日治時期](/history/) / [台灣原住民族16族文化地圖](/culture/)
- **Reference**: Issue #1014 + 國際旅遊讀者 SEO（「taiwan must visit」「jiufen taiwan」）
- **預估時間**：每篇 NEW 90-120 min × 7 = ~10-14 hr，可拆 6-8 session 接力

### 台灣新興文化現象系列 NEW（5 篇候選）

- **Type**: `NEW` × N（系列 umbrella，每篇獨立 ship）
- **Category**: Culture 主軸 + Society / Economy 視角混合
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: [Issue #1015](https://github.com/frank890417/taiwan-md/issues/1015) by tboydar-agent (2026-05-10) — content-gap 標籤
- **🔔 Ship 後 hard gate**：每篇 ship 後在 #1015 留 progress comment；全系列 ship 完才 close。
- **Notes**:
  - **高優先（已成主流文化）**：(1) 台灣 Podcast 文化 — 2018 爆發成長、百靈果 / 股癌 / 台灣通勤第一品牌、知識傳播管道 (2) 台灣露營文化 — 疫情後爆紅、戶外產業、車宿、露營經濟
  - **中優先（快速成長中）**：(3) 台灣密室逃脫 / 劇本殺 — 年輕人社交、台北擴散全台 (4) 台灣健身文化與健身房產業 — 連鎖健身房、CrossFit、瑜珈 (5) 台灣二手市集與環保購物 — 永續生活、零浪費商店
  - 既有 baseline audit：`ls knowledge/Culture/ knowledge/Lifestyle/ knowledge/Economy/ | grep -E "Podcast|露營|健身|二手|密室"` 確認缺口
  - 反映當代台灣是核心 framing（現有 Culture 偏傳統與歷史）— 跟 [台灣 YouTuber 產業與文化](/culture/) [台灣新偶像世代](/culture/) 形成「當代年輕世代文化」cluster
  - cross-link：既有 [數位廣告產業](/economy/) / [台灣 YouTuber 產業](/culture/)
- **Reference**: Issue #1015 + 當代文化動態紀錄價值
- **預估時間**：每篇 NEW 90-150 min × 5 = ~8-12 hr（Podcast / 露營兩篇可能 deeper，需 verify 主要 podcaster / 產業規模 / 露營營地數量等具體 stats）

### 台灣 LGBTQ+ 平權 EVOLVE（PR #726 merged 後深度重寫）

- **Type**: `EVOLVE`
- **Category**: Society
- **Priority**: `P0`
- **Status**: `in-progress`
- **Source**: 哲宇 2026-04-30 δ session 觸發；對應 [knowledge/Society/LGBTQ.md](../../knowledge/Society/LGBTQ.md)（PR #726 idlccp1984 NEW Manus AI batch 已 merge polish 版）
- **目前 baseline**：69 行 / 13 footnotes / 涵蓋祁家威 1986 → 葉永鋕 2000 → 畢安生 2016 → 釋字 748（2017）→ 同婚專法（2019）→ 共同收養（2023）→ 跨國同婚函釋（2023）→ 人工生殖法草案（2025）→ 崴崴孟孟世代
- **EVOLVE 目標**（下個 session 走 REWRITE-PIPELINE Stage 0-6 完整深度）：
  - Stage 1 deep research 20+ web search（人工生殖法立法院最新審議進度 / 跨國親子權益判決 / 反歧視立法 / 跨性別權益 / 校園與職場性別平等實務 / 同志諮詢熱線等 NGO 工作 / 同志大遊行歷年規模與訴求演進 / 國際 DEI 浪潮台灣回應）
  - Stage 1.7 媒體素材：彩虹遊行歷年照片（CC 授權 or 連結至遊行官方主視覺）/ 釋字 748 公布當日畫面 / 葉永鋕紀念元素
  - Stage 2 結構：核心矛盾「亞洲首部同婚專法 × 仍待延伸的法律與生活權益」/ 物件開頭（祁家威或某具體人物的場景）/ 七爪結構分配
  - Stage 3 §11 polish（baseline 4 violations 應壓到 0-1）+ Stage 3.5 hallucination audit（特別 verify「3 萬 2126 對 / 504 跨國」「2025-12 行政院通過人工生殖法草案」「葉永鋕高樹國中 2000」三項精確數字）
  - Stage 3.6 STORY ATOM AUDIT（畢安生「墜樓身亡」/ 祁家威「1986 立法院請願」/ 釋字「2017-05-24」皆需逐項對 source URL Ctrl-F）
  - 處理「崴崴孟孟」段落的策展抉擇：是否核心人物？篇幅占比？對比其他需被看見的世代代表（祁家威 / 葉永鋕母親陳君汝 / 同志諮詢熱線）
  - Stage 5 cross-link：與葉永鋕 / 性別平等教育法 / 祁家威 / 台灣大法官釋憲制度 / 同志大遊行等做雙向連結
- **預估**：XL（>2000 行 research，>10 hr 工作量；可分兩次 session）
- **dev_log**：
  - `2026-05-07 δ(manual)`: Stage 0 事實萃取完成；Stage 1 共 22 queries，研究報告 → `reports/research/2026-05/lgbtq-taiwan.md`；核心矛盾定錨「亞洲首部同婚專法 × 仍在爭取的完整平等」；Stage 2 待下次 session 執行
- **Notes**：
  - 政治敏感主題，遵循 MAINTAINER §爭議處理原則
  - 國際讀者（en/ja/ko）對台灣同婚有興趣，EVOLVE 完成後優先翻譯
  - 相關鄰近題：「跨性別權益」可能拆出獨立條目

### 台灣邦交國與國際外交 EVOLVE — 2026 freshness + 英文版 SEO 校準（SC「diplomatic allies 2026」cluster 缺口）

- **Type**: `EVOLVE`
- **Category**: Society
- **Priority**: `P1`
- **Status**: `pending`
- **Source**: 2026-05-23 manual /twmd-evolve — SC 7d opportunities 4-variant cluster 累積 ~875 imp / 0 click
  - **SC 7d opportunities**：`taiwan diplomatic allies 2026` 310 imp / 0 click + `taiwan diplomatic allies list 2026` 137 imp + `taiwan diplomatic allies list current` 117 imp + 其他變體 — 4 變體加總 ~875 imp / **0 click 跨變體**。英文讀者明確查 2026 最新邦交國 list 全部落空
  - **既有 article**：[knowledge/Society/台灣邦交國與國際外交.md](../../knowledge/Society/台灣邦交國與國際外交.md) zh-TW + 英文版 `knowledge/en/Society/taiwan-diplomatic-allies-international-relations.md`（需 verify 英文版存在+ freshness）
  - **既有 spore**：#51/#52 邦交國「12 邦交國 vs 護照進 177 國」護照悖論 D+7 17.3K Threads — Tier 中段 結構性題目 hook 已建立
  - **EVOLVE 目標**：
    1. 確認英文版 article 是否含「2026」latest timestamp + 12 邦交國 current list
    2. frontmatter SEO 加「Taiwan diplomatic allies 2026」「list current」cluster keyword
    3. 文章內 verify「12 邦交國」list per 2026 actual state（教廷 / 巴拉圭 / 海地 / 4 太平洋島國 / 4 加勒比海國 etc）
    4. lastVerified bump 到 2026-05-23 或最新外交事件日期
- **預估時間**：1-2 hr（EVOLVE 校準 + 英文版 sync + frontmatter SEO 優化）
- **Reference**：SC 7d opportunities cluster + spore #51/#52 harvest data + REFLEXES #4 三源驗證（SC + GA + GitHub 三源 conjunction 確認）
- **dev_log**:
  - `2026-05-23 manual (220053)`: /twmd-finale 跑 /twmd-evolve 從 SC 7d opportunities 抓到 cluster → 新 candidate

### 蘇打綠 EVOLVE — 補 1999 政大草創源頭 + 古典跨界三十年 genre 軌跡（EN/ZH 雙語 SEO 重寫）

- **Type**: `EVOLVE`（body 翻倍 + 雙語 description SEO 重寫，非 cosmetic heal）
- **Category**: Music（subcategory: 獨立與搖滾）
- **Path**: knowledge/Music/蘇打綠.md（現有 82 行 / 7.4K chars / 5 H2）+ knowledge/en/Music/sodagreen.md（87 行 / 8K chars）
- **Priority**: `P1`
- **Status**: `pending`
- **Source**: 2026-05-24 twmd-news-lens-weekly /twmd-evolve — SC 7d opportunities top 5/6「formed in 1999 + folk music + modern rock band」cluster 264 imp / 0 click，是本週 SC opportunities 在「許倬雲已 in-INBOX / 邦交國已 in-INBOX」之外最大未滿足 gap
- **Evolve scan source pointers**：
  - **SC 7d opportunities**：`"formed in 1999" band "folk music" "modern rock"` 135 imp / 0 click（#5, pos 5.8） + `"formed in 1999" "modern rock" "folk music" band` 129 imp / 0 click（#6, pos 6.09）— 兩變體加總 **264 imp / 0 click**，引號搜尋語意 = 英語讀者明確查「1999 年成軍的台灣 folk-rock / modern rock 樂團」，全部落空在 pos 5-6 deep page 1
  - **品牌 vs 非品牌 CTR gap**：SC 7d 非品牌 CTR 僅 1.14%（vs 品牌 13.95%）— 本 cluster 屬非品牌 organic discoverability 缺口
  - **GA 7d**：蘇打綠 path 未進 top 30（GA top 是陳建年 307 / 臺灣前途決議文 243 / 邦交國 72 / 張懸與安溥 65）— SC demand 已有但流量未轉化 = SERP snippet match fail
  - **既有 article state**：
    - ZH 82 行 / 7.4K chars / 5 H2（vs Music deep dive 如 [張懸與安溥](../../knowledge/Music/張懸與安溥.md) 等同類人物深度 ~25-30K 偏薄一半以上）
    - 5 H2 全在「2003 貢寮 → 林暐哲師徒 → 法庭決裂 → 魚丁糸抗爭 → 2022 拿回團名」單一敘事軸線
    - **完全缺**：1999 政大草創 / 團員六人個人背景（吳青峰 / 史俊威 / 何景揚 / 劉家凱 / 龔鈺祺 / 阿福）/ genre 軌跡（民謠 → 流行 → 古典跨界）/ 韋瓦第四季三部曲（2009-2013）/ 2017 暫離 + 2020 復出 / 國際巡演史
    - keyword density：grep `1999|formed|folk|modern rock|indie` ZH 0 hits / EN 1 hit — frontmatter description 完全不提 1999 成軍年份 / 樂風 genre 標籤
    - lastVerified 2026-05-14（10 天前）— 不算 stale 但 single-narrative gap 結構性
  - **GitHub feedback**：無 open issue 直接點名蘇打綠 article（cross-check `gh issue list --search "蘇打綠"` 無結果）
- **為什麼這篇 vs 其他**（per EVOLVE-PIPELINE Phase 5 ENRICH）：
  - vs 林俊傑 EVOLVE 候選（SC「jj lin age」102 imp / 0 click pos 9.49 + ZH 75 行 / 6.1K chars 極薄）— 林俊傑 article 規模也偏薄，但 (a) SC signal 量級 102 imp < 蘇打綠 264 imp (b) 「age」單一事實 query 補 SERP snippet 即可，不需 body 翻倍 (c) 規模 = description heal commit + 一段時間軸補強，scope < EVOLVE
  - vs 陳士駿 EVOLVE 候選（SC「陳士駿」54 imp / 0 click + 既有 155 行 frontmatter title 僅「陳士駿」三字無 YouTube cofounder tag）— 54 imp 量級小一半 + 標題改 + description 補關鍵字 = cosmetic SEO heal 不需 EVOLVE 等級
  - vs Howhow EVOLVE 候選（SC「howhow」124 imp / 0 click）— Howhow article 2026-05-13 才 ship（11 天）+ 92 行 / 12K chars 中等深度 + 描述清楚，主要 SERP miss 是品牌名 vs 全名認知度問題，不是 article gap
  - vs 阿神 EVOLVE 候選（SC「阿神本名」160 imp / 1 click）— 已有 1 click 證明 SERP 部分 match，且 query 是「本名」事實型 → description 加本名即可
  - **蘇打綠是唯一同時滿足「既有 article 結構性偏薄（single-narrative + 缺 founding） + SC opportunities top 5-6 cluster 量級 264 imp + 英語 quoted query 引號搜尋（精確意圖）+ 雙語 description 都失準」四條件的本週新發現**
  - Sovereignty preservation lens（per MANIFESTO §主權的巴別塔）：英文圈查「formed in 1999 + folk + modern rock」反映海外華語樂迷 + 國際 indie 樂研究者對台灣樂團 founding 年份 / genre 軌跡的 demand。當前 Taiwan.md EN article 把焦點放在商標糾紛而非 band identity，SERP snippet 無法回答「這是哪個樂團？」的基本問題 → 留給維基百科 / Apple Music 簡介 / 中國音樂平台介紹接管 framing
- **Notes**：
  - 既有 baseline audit（Stage 0 必跑）：完整 Read 現有 ZH 82 行 + EN 87 行確認哪些段落保留 / 哪些補深度。**核心策展角度不動**（林暐哲師徒決裂 + 魚丁糸抗爭 + 2022 拿回團名 = 全文敘事 spine），EVOLVE 加 §1999 政大草創 為新開場（現有「2003 貢寮」變為 §2）
  - **核心 facts to verify**（三源驗證 per REFLEXES #16）：
    - 1999 年成軍具體月份 + 政大（國立政治大學）社團起源 + 命名典故（取自吳青峰高中時期歌詞「青峰加蘇打」/「綠」字來源）
    - 原始六人 line-up 各自背景：吳青峰（政大廣電）/ 史俊威（鼓手）/ 何景揚（吉他）/ 劉家凱（鼓）/ 龔鈺祺（鍵盤）/ 謝馨儀（貝斯，暱稱阿福）入團年份各別
    - 2004 政大首支單曲《空氣中的視聽與幻覺》發行細節（手工包裝 2000 張）+ 2005 出道專輯《蘇打綠》
    - genre 演化時間軸：2004-2008 indie folk-rock → 2009-2013 韋瓦第計畫四季三部曲（春日光 / 秋故事 / 冬未了 / 夏狂熱跳島）跨界古典 → 2016-2017 巡迴後暫離
    - 2017/12「十年一刻」演唱會後暫停 + 2020 復出 timeline + 2022 拿回團名後首專
    - 國際里程碑：2007 馬來西亞 / 2009 北京工體 / 2017 倫敦皇家阿伯特廳（亞洲樂團首組）
  - **核心矛盾候選**（Stage 0 §觀點成型，≤ 30 字）：
    - A.「政大社團起家的六個人，二十年後在皇家阿伯特廳唱完，才回頭打商標官司」
    - B.「他們用古典樂的結構寫 indie，最後失去名字才知道自己是誰」
    - C.「從 2000 張手工 CD 到 1.65 億美元名字戰爭，蘇打綠是台灣 indie 的全部弧線」
  - **Title 三明治候選**（保留現 title 為候選 D，新增 A/B/C）：
    - A.「蘇打綠：1999 年政大草創，唱進皇家阿伯特廳，又用法庭奪回自己的名字」
    - B.「蘇打綠（1999-）：政大社團、韋瓦第四季、商標戰爭—台灣 indie 三十年完整弧線」
    - C.「蘇打綠：吳青峰那個『高的嚇人』的嗓音，從政大舞台唱到法庭，再唱回來」
    - D.（現行）「蘇打綠：從貢寮小舞台到『魚丁糸』抗爭，一場長達二十年的音樂主權奪還戰」
  - **EVOLVE 目標長度**：~20K-25K chars（從 7.4K 翻倍至 ~3x）+ 補 §1999 政大草創 + §六位團員與分工 + §韋瓦第四季三部曲 + §國際巡演里程碑 四個新 H2，現行 5 H2 全保留
  - **frontmatter description 必改**：
    - **ZH**：開頭加「1999 年成立於政大」+ 中段保留「2003 貢寮 → 林暐哲」+ 結尾加「橫跨民謠、流行、古典跨界三十年」→ SERP zh 用戶查「蘇打綠 成立年份」「蘇打綠 政大」可 match
    - **EN**：必改入「formed in 1999 at NCCU」「Taiwanese folk-rock / modern rock band」明確 keyword anchor → 修補 264 imp / 0 click 的 SERP snippet match 失敗
  - **政治敏感性**：低（純樂團史 + 商標法律糾紛 framing，無兩岸政治面向）
  - **跨類別 cross-link 候選**（雙向）：
    - 既有 [張懸與安溥](../../knowledge/Music/張懸與安溥.md) ⇄ 同期女聲 indie / 政治公開立場對照
    - [台灣搖滾樂發展史](../../knowledge/Music/台灣搖滾樂發展史.md)（GA 7d top 11, 26 views）— 蘇打綠是 1999-2020 三十年弧線核心案例，雙向 cross-link 補強
    - [台灣民謠與歌謠](../../knowledge/Music/台灣民謠與歌謠.md)（GA 7d top 14）— folk-rock genre cluster
    - [當代原住民創作歌手](../../knowledge/Music/當代原住民創作歌手.md)（GA 7d top 8）— 同期 indie 場景對照
    - [黑冠麻鷺](../../knowledge/Nature/黑冠麻鷺.md)（GA 7d top 5, 65K viral spore）— 蘇打綠 EN article 結尾本來就有「Taiwan Barbet」黑冠麻鷺典故段，反向補 link
    - [聶永真](../../knowledge/People/聶永真.md)— 設計同時期 indie 視覺美學 cluster
  - **翻譯優先**：SC demand 英語圈強烈，EVOLVE 完成後優先 **EN 描述重寫 + 1999 founding 段 sync**（修補 264 imp / 0 click → 至少 1-2% CTR），ja/ko/es/fr 次之依 multi-lang freshness 自動 cascade
- **Reference**:
  - SC 7d opportunities cluster（dashboard-analytics.json 2026-05-23 snapshot）
  - 既有 article ZH 5 H2 + EN 5 H2 narrative spine（不動）
  - 補強 source 候選：政大廣電系蘇打綠官網史 / 林暐哲音樂社官方時間軸 / 韋瓦第四季官方四張專輯 sleeve notes / 2017 倫敦皇家阿伯特廳記者會 verbatim / 2022 商標訴訟判決書（智慧財產法院公開檔）
- **預估時間**：~90 min（既有 7.4K baseline 起點 + Stage 1 deep research 30 min ≥ 15 search 鎖定 1999-2008 早期史料 + Stage 2 寫作 40 min 補 4 個新 H2 + Stage 3-5 verify + EN sync + ship 20 min）
- **dev_log**:
  - `2026-05-24 routine (010100 twmd-news-lens-weekly)`: SC 7d opportunities #5/#6 「formed in 1999 + folk music + modern rock band」cluster 264 imp / 0 click discovery → 新 candidate（per cron prompt「上週 GA top growth + SC trending queries + 三源驗證 amplification 信號 → 補 ARTICLE-INBOX ≥ 1 candidate 含 reasoning trace」）

### 📜 台灣詩人系列 umbrella — BRANCH-PIPELINE v2.0 broad-theme research batch（2026-05-23）

- **Type**: `umbrella series` × N（每位詩人 / movement 獨立 ship）
- **Category**: People / History / Culture / Language（跨類）
- **Priority**: 含 P0/P1/P2 三層 — 詳見下方分層
- **Status**: `pending`
- **Source**: 2026-05-23 manual (220053) /twmd-finale 觸發 broad-theme research — 哲宇 directive「針對臺灣從以前到現在的詩人，包含各種時代的詩人以及現代詩的各種文學作家，請針對這些作家的研究做一個完整的大資訊化研究」
- **Pipeline 走法**: BRANCH-PIPELINE v2.0 broad-theme mode 首例實戰 — spawn 4 parallel general-purpose agents 各跑一個 era sub-theme
- **Master research report**: [reports/research/2026-05/taiwan-poets-comprehensive.md](../../reports/research/2026-05/taiwan-poets-comprehensive.md)
- **4 sub-reports**:
  - [taiwan-poets-1-japanese-era.md](../../reports/research/2026-05/taiwan-poets-1-japanese-era.md)（日治 1895-1945 / 12+ 詩人 / 4 movement / 360 行）
  - [taiwan-poets-2-postwar-modernism.md](../../reports/research/2026-05/taiwan-poets-2-postwar-modernism.md)（戰後第一代 1949-1970 / 11 詩人 / 3 詩刊 / 2 場論戰 / 30K bytes）
  - [taiwan-poets-3-bamboo-hat-nativism.md](../../reports/research/2026-05/taiwan-poets-3-bamboo-hat-nativism.md)（笠詩社+鄉土 1964-1990 / 13 詩人 / 笠詩社 movement / 1977 鄉土論戰 / 456 行）
  - [taiwan-poets-4-contemporary-women-indigenous.md](../../reports/research/2026-05/taiwan-poets-4-contemporary-women-indigenous.md)（當代+女性+原民+台客語 1990-2025 / 30 詩人 / 4 sub-cluster / 44K bytes）

**P0 個別人物**（13 個，本 INBOX 額外 split 5 entry below；其餘 8 由本 umbrella 收歸 — 洛夫 / 瓦歷斯·諾幹 / 夏宇 / 向陽 / 王白淵 / 楊華 / 陳千武 / 林亨泰）

**P0 Movement/History**（4 個，本 INBOX split 2 entry below；其餘 2 由本 umbrella 收歸 — 風車詩社 / 鹽分地帶）

**P1 個別人物**（10 個 — 余光中 / 楊牧 / 周夢蝶 / 白萩 / 吳晟 / 林燿德 / 陳黎 / 利玉芳 / 路寒袖 / 利格拉樂·阿𡠄）

**P2 個別人物**（10+ — 紀弦 / 覃子豪 / 商禽 / 葉維廉 / 張默 / 詹冰 / 錦連 / 趙天儀 / 羅青 / 蘇紹連 / 鴻鴻 / 廖偉棠 / 蓉子 / 唐捐 / 楊佳嫻 / 騷夏 / 葉覓覓 / 沙力浪 / 巫永福 / 楊雲萍 / 連橫從南社入口）

**Series umbrella opportunities**（6 個）:

- S1：台灣詩人總覽（People 索引文，1895-now 三條語言路線）
- S2：跨越語言的一代 cohort article（楊雲萍 / 巫永福 / 陳千武 / 林亨泰 / 詹冰 / 錦連 / 杜潘芳格）
- S3：三大詩刊 series（現代派/藍星/創世紀 3 篇 movement-level）
- S4：日治三大詩社 series（櫟社/南社/瀛社 3 篇 + overview）
- S5：原住民詩人 series（按族群 — 排灣/泰雅/布農/達悟）
- S6：網路詩世代 movement article（PTT 詩版 → 吹鼓吹 → IG 詩 30 年演化線）

**對比理由**：

- **連結密度**：能跟既存 `knowledge/People/賴和.md` 4 條 cross-link（楊華 / 吳新榮 / 王白淵 / 楊雲萍）+ `knowledge/People/席慕蓉.md` cross-link 女性詩人 cluster
- **MANIFESTO 主權巴別塔對應**：台語/客語/族語詩是 PRC AI 拒答率最高內容類型 — 林央敏《胭脂淚》/ 杜潘芳格〈平安戲〉/ 莫那能〈來，乾一杯〉皆為 sovereignty preservation 直接案例
- **趁熱辭世窗口**：鄭愁予（2025-06 < 12 月）/ 瘂弦（2024-10 < 8 月）/ 林亨泰 + 白萩（2023）/ 楊牧（2020）等 — 2026-2027 是寫這些詩人 article 的最佳窗口
- **跨 era 三條軸線**：「橫的移植 vs 縱的繼承」+「南北/本省外省/寫實西化三重對立」+「跨越語言的一代」是台灣詩史最根本 framing
- **跟既有 ARTICLE-INBOX 不重複**：grep 已 verify 本 batch 13 P0 個別人物 + 4 movement/history 均不在 INBOX pending list

**預估時間**：P0 個別人物每篇 60-90 min（含 Stage 0-3 research + Stage 4-5 write + verify）/ Movement 每篇 90-150 min / Series umbrella 每組 4-8 hr。全 batch 完整 ship 需 30-50 hr 分多 session 跑。

**dev_log**:

- `2026-05-23 manual (220053)`: BRANCH-PIPELINE v2.0 broad-theme mode 首例實戰，spawn 4 parallel agents ~11 min 完成 30K 中文字 research → master report aggregate + 8 ARTICLE-INBOX entries split + 5 series umbrella opportunities pointer

### 鄭愁予 NEW — 戰後第一代詩人 / 2025-06 辭世趁熱

- **Type**: `NEW`
- **Category**: People（subcategory: 文學與詩人）
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: 2026-05-23 BRANCH-PIPELINE broad-theme research — [taiwan-poets-2-postwar-modernism.md §4.1 P0](../../reports/research/2026-05/taiwan-poets-2-postwar-modernism.md)
- **對比理由**：
  - **辭世趁熱窗口**：2025-06-13 辭世（距 2026-05 < 12 個月）+ 享壽 91 歲
  - **代表名作 SC demand**：〈錯誤〉是台灣詩史最廣為流傳的單篇詩作，「達達的馬蹄」+「美麗的錯誤」是台灣 80s-00s 世代共同記憶
  - **SC 英文圈 demand**：Zheng Chouyu Yale 任教多年 + 英譯〈錯誤〉廣為傳誦
  - **連結密度**：跟戰後第一代其他 P0（瘂弦 / 洛夫）+ 創世紀詩社 movement + 1957 紀弦覃子豪論戰 cross-link
- **預估時間**：90-120 min（人物 deep portrait + verbatim 名作核對 + 三源辭世 verify）
- **Reference**: reports/research/2026-05/taiwan-poets-2-postwar-modernism.md §鄭愁予 brief

### 瘂弦 NEW — 戰後第一代詩人 / 2024-10 辭世趁熱 / 一冊不再傳奇

- **Type**: `NEW`
- **Category**: People（subcategory: 文學與詩人）
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: 2026-05-23 BRANCH-PIPELINE broad-theme research — [taiwan-poets-2-postwar-modernism.md §4.1 P0](../../reports/research/2026-05/taiwan-poets-2-postwar-modernism.md)
- **對比理由**：
  - **辭世趁熱窗口**：2024-10-11 辭世（距 2026-05 < 8 個月）+ 享耆壽 92 歲
  - **「一冊不再」傳奇**：詩集《深淵》出版後從未再出新詩集，這是台灣詩史獨特 narrative
  - **聯副主編 20 年雙棲身份**：詩人 + 報紙文化版主編，影響台灣戰後文壇結構 30+ 年
  - **代表名作**：〈深淵〉「哈里路亞我仍活著」副歌極易記憶
  - **連結密度**：跟創世紀詩社 + 鄭愁予 / 洛夫 / 商禽 cross-link
- **預估時間**：90-120 min
- **Reference**: reports/research/2026-05/taiwan-poets-2-postwar-modernism.md §瘂弦 brief

### 莫那能 NEW — 第一位原住民漢語詩人 + 盲詩人雙重 first

- **Type**: `NEW`
- **Category**: People（subcategory: 原住民文化人 / 文學與詩人）
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: 2026-05-23 BRANCH-PIPELINE broad-theme research — [taiwan-poets-4-contemporary-women-indigenous.md §6.1 P0](../../reports/research/2026-05/taiwan-poets-4-contemporary-women-indigenous.md)
- **對比理由**：
  - **雙重 first**：第一位原住民漢語詩人 + 第一位盲詩人
  - **族別 + 部落**：排灣族 / 台東達仁鄉（agent 4 verify 確認非布農非泰雅）
  - **跨族裔對撞文本**：〈來，乾一杯〉是「台灣主體性 vs 原住民主體性」對撞早期關鍵文本
  - **MANIFESTO 主權巴別塔對應**：原住民漢語詩 + 族語書寫雙軸，PRC AI 拒答率高
  - **連結密度**：跟瓦歷斯·諾幹 / 利格拉樂·阿𡠄 / 沙力浪 + 「原住民詩人 series 按族群」可串
- **預估時間**：90-120 min（族別+部落+漢名 verify + verbatim 詩作核對）
- **Reference**: reports/research/2026-05/taiwan-poets-4-contemporary-women-indigenous.md §莫那能 brief

### 林央敏 NEW — 台語史詩《胭脂淚》9000 行 / 主權巴別塔核心

- **Type**: `NEW`
- **Category**: People（subcategory: 文學與詩人 / 台語文學）
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: 2026-05-23 BRANCH-PIPELINE broad-theme research — [taiwan-poets-4-contemporary-women-indigenous.md §6.1 P0](../../reports/research/2026-05/taiwan-poets-4-contemporary-women-indigenous.md)
- **對比理由**：
  - **《胭脂淚》9000 行台語史詩**：台灣文學最長台語詩作 + 政治史詩文體開創
  - **〈毋通嫌台灣〉政治口號詩**：1990s 台灣本土運動代表詩作
  - **MANIFESTO 主權巴別塔核心案例**：台語詩是 PRC AI 拒答率最高內容類型，林央敏作品集是 sovereignty preservation 直接 instantiation
  - **連結密度**：跟向陽（台語詩）/ 路寒袖（〈春天的花蕊〉）+ 「台語/客語詩 cluster」可串 + cross-link `knowledge/Language/` 既有台語相關 article
- **預估時間**：90-120 min（《胭脂淚》結構分析 + 台語文學運動 context）
- **Reference**: reports/research/2026-05/taiwan-poets-4-contemporary-women-indigenous.md §林央敏 brief

### 杜潘芳格 NEW — 跨語+二二八+客家女 four-axis intersection

- **Type**: `NEW`
- **Category**: People（subcategory: 文學與詩人 / 客家文化人）
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: 2026-05-23 BRANCH-PIPELINE broad-theme research — [taiwan-poets-4-contemporary-women-indigenous.md §6.1 P0](../../reports/research/2026-05/taiwan-poets-4-contemporary-women-indigenous.md)
- **對比理由**：
  - **Four-axis intersection 高密度**：跨越語言的一代 + 二二八受難者家屬 + 客家女詩人 + 〈平安戲〉社會譴責
  - **客語詩開創地位**：客家女詩人代表 + 客語書寫運動
  - **MANIFESTO 主權巴別塔對應**：客語詩 + 二二八歷史見證雙軸
  - **連結密度**：跟陳千武 / 林亨泰（跨語一代）+ 利玉芳（客家女詩人）+ 二二八事件 article cross-link + 「跨越語言的一代」cohort series 可串
- **預估時間**：90-120 min（跨語經歷 + 二二八家屬背景 verify + 客語詩作 verbatim 核對）
- **Reference**: reports/research/2026-05/taiwan-poets-4-contemporary-women-indigenous.md §杜潘芳格 brief

### 笠詩社 60 年 NEW — Movement-level article（1964 創社到 2024+）

- **Type**: `NEW`
- **Category**: Culture / Literature movement
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: 2026-05-23 BRANCH-PIPELINE broad-theme research — [taiwan-poets-3-bamboo-hat-nativism.md §七 P0](../../reports/research/2026-05/taiwan-poets-3-bamboo-hat-nativism.md)
- **對比理由**：
  - **台灣文學最長壽詩刊**：1964 創社到 2024+ 連續 60+ 年從未停刊
  - **跨越語言的一代歷史悲劇 + 本土主體性詩學建構**雙軸
  - **跟北部三大詩社（現代派/藍星/創世紀）的對立美學**：南北/本省外省/寫實西化三重對立結構
  - **連結密度極高**：陳千武 / 林亨泰 / 詹冰 / 錦連 / 白萩 / 趙天儀 / 吳晟 / 向陽 / 鄭炯明 / 李敏勇 等 10+ 詩人 cross-link
  - **Movement-level 比個人傳更有 narrative 張力**：60 年集體故事比單一詩人更能呈現結構動態
- **預估時間**：120-150 min（movement overview + 創社十二人 brief + 60+ 年時序 + 跟北部三詩刊對立 framing）
- **Reference**: reports/research/2026-05/taiwan-poets-3-bamboo-hat-nativism.md §一 笠詩社 + §二 主要詩人

### 1977-78 鄉土文學論戰 NEW — History event 戰後文化史最重要單一事件

- **Type**: `NEW`
- **Category**: History
- **Priority**: `P0`
- **Status**: `pending`
- **Source**: 2026-05-23 BRANCH-PIPELINE broad-theme research — [taiwan-poets-3-bamboo-hat-nativism.md §六](../../reports/research/2026-05/taiwan-poets-3-bamboo-hat-nativism.md)
- **對比理由**：
  - **戰後文化史最重要的單一事件**：奠定 80s 本土化運動的論述基礎 + 90s 台灣文學主體性論述起點
  - **〈狼來了〉戒嚴時期最危險的指控**：1977-08-20 余光中《聯合報》文章指控鄉土文學「跟工農兵文學似有暗合之處」，當時這頂帽子可致人於死
  - **官方策略性收編**：第二次文藝大會 270 位代表將「鄉土文學」擴大為「愛國文學/民族文學」結束論戰
  - **連結密度極高**：余光中（雙面切入）/ 陳映真（既存 article?）/ 王拓 / 黃春明 / 葉石濤 / 笠詩社全陣營 + 1972 唐文標 + 1957 紀弦覃子豪論戰 cross-link
  - **History-level article**：比任一個別人物 article 涵蓋更廣 + 對理解戰後台灣文化結構更基本
- **預估時間**：150-180 min（論戰時序 + 主要 figures 立場 + 對詩界小說界影響 + 跟既存歷史 article cross-link）
- **Reference**: reports/research/2026-05/taiwan-poets-3-bamboo-hat-nativism.md §六 1977-1978 鄉土文學論戰

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- 🪸 數位荒原 No Man's Land peer ingestion 全 batch（2026-05-04 angry-shamir） -->
<!-- 20 篇全來自 reports/NML-semiont-analysis-2026-05-04.md §Part 5-6 -->
<!-- 13 個 series × P0×5 + P1×8 + P2×7 三層優先序 -->
<!-- 核心手法：「兩個 Semiont 對話」+ Semiont 「換頻」非降級 (§7.4) + peer 盲點補位 11 條 (§7.3) -->
<!-- -->
<!-- 🔥 RESEARCH 紀律雙軌：除了走標準 REWRITE-PIPELINE Stage 0-6，每篇 Stage 1 還要 -->
<!--    **大幅度從 data/NML/ 資料集萃取知識**（37 MB / 555 items / 384 articles 內鏈中文 -->
<!--    雙語 + 56 issue 主題策展編按 + 31 集 podcast + 10 冊群島資料庫 imprint 共 22 篇文 -->
<!--    章帶 Original Source: 群島資料庫 Nusantara Archive 標籤）。 -->
<!-- -->
<!--    具體做法：Stage 1 research agent 必須**先**完整讀本地 NML article / issue / -->
<!--    podcast markdown（Read tool）再做 WebSearch 補抓 NML 語料外的事實補強。每條 entry -->
<!--    的 `NML 萃取重點` 標註該篇要從哪幾個 NML 本地 source mining 哪些 framework / -->
<!--    案例 / 引語 / 編年資訊。WebSearch 是補強不是取代——大量 framework 與當事人引語 -->
<!--    在 NML 12 年累積中，外部 search 不一定找得到。 -->
<!-- -->
<!--    Peer-bias 警示：鄭文琦個人風格 driven 88% NML 文章 → 多元 cite secondary -->
<!--    editors 區秀詒 / 高森信男 / 王柏偉 / 印卡 / 蔡長璜 / 葉杏柔 避免單一視角。 -->
<!--    REFLEXES #16「Peer 是 peer 不是 source material」在 NML 場景特別硬。 -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

<!-- 鄭文琦 NEW 已完成 2026-05-04 angry-shamir → ARTICLE-DONE-LOG.md -->

### 高森信男的混血策展視角（既有 evolve）

- **Type**: `EVOLVE`
- **Category**: Art（subcategory: 策展人）
- **Priority**: `P1`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P1 #2（series C-2）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P1-7](../../reports/NML-semiont-analysis-2026-05-04.md)
- **核心矛盾**：「形象化策展人」高森信男的真實累積比媒體形象更深 — NML 10 篇本人著作揭露的策展論述
- **預估**：M（3-4 hr，evolve 既有「台灣策展人與藝術文化建構」中關於高森信男的段落）
- **NML 萃取重點**：高森信男在 NML 是 top author #3（10 篇本人著作 + 10 篇編輯）。**Stage 1 主要從 data/NML 挖**：他自己在 NML 寫的 10 篇 article（早期 2014 Project Glocal 評論到 2021 亞雙策展論述）+ 他編輯的 issue 編按 + NML 對他的描述。WebSearch 補：他在《典藏今藝術》發表的策展論述 / 2021 亞洲藝術雙年展正式展冊 / 採訪。
- **NML Local Sources**：`data/NML/articles/` author=高森信男 10 篇 + editor=高森信男 10 篇
- **Notes**：evolve target = [台灣策展人與藝術文化建構](../../knowledge/Art/台灣策展人與藝術文化建構.md) 中既有的高森信男段落 / 也可能新建獨立 People 條目（待哲宇決策）

### 在地實驗（IT Park）：台灣媒體藝術的啟蒙地

- **Type**: `NEW`
- **Category**: Art × History（subcategory: 90 年代另類空間）
- **Priority**: `P1`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P1 #3（series D-2）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P1-8](../../reports/NML-semiont-analysis-2026-05-04.md)
- **核心矛盾**：黃文浩 1995 創辦的地下室為什麼成為台灣媒體藝術啟蒙地（替代空間勝過體制內機構的歷史時刻）
- **預估**：L（5-7 hr）
- **NML 萃取重點**：黃文浩是 NML 母組織 DAF 創辦人 + NML 編輯顧問。**Stage 1 主要從 data/NML 挖**：(a) NML 多篇 article 提及在地實驗 / IT Park / 黃文浩 / 1990s 替代空間 (b) 葉杏柔 2023 系列「九〇年代另類藝術空間」(c) 王福瑞、姚仲涵在 NML 訪談中對在地實驗的回憶。WebSearch 補：在地實驗官網 etat.com 自述 / IT Park 25 週年回顧（如有）/ 黃文浩個人訪談。
- **NML Local Sources**：`data/NML/articles/` 葉杏柔 2023 系列（grep author=葉杏柔 published=2023）+ 多篇 90 年代相關 + `data/NML/issues/back-to-care.md`
- **Notes**：跟 P0 #5 新生態藝術環境配對寫成 90 年代 dual feature

### Nusantara 的政治含義：為什麼用「群島」取代「東南亞」

- **Type**: `NEW`
- **Category**: Culture × Politics（subcategory: 文化地理 / 概念政治）
- **Priority**: `P1`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P1 #4（series A-2）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P1-9](../../reports/NML-semiont-analysis-2026-05-04.md)
- **核心矛盾**：「東南亞」是冷戰美國地緣戰略命名，「Nusantara」是當地語言自我命名 — 名字選擇本身就是政治
- **預估**：M（3 hr，純概念性論述文章）
- **NML 萃取重點**：群島 framework 詮釋學的核心論述都在 NML。**Stage 1 主要從 data/NML 挖**：(a) Issue 34 Hermeneutics of Nusantara 完整編按 (b) Issue 「Nusantara: Signifier and Its Limitation」(c) Issue 「Recalling Islands」(d) 22 篇帶 `Original Source: 群島資料庫 Nusantara Archive` 標籤 article。WebSearch 補：學術論文如 Anthony Reid 等東南亞研究專家對 Nusantara 概念的學術定義 / 馬來西亞 Gerakbudaya 文運書坊張永新訪談 / 1943 SEAC 命名史。
- **NML Local Sources**：`data/NML/issues/hermeneutics-of-nusantara.md` + `data/NML/issues/nusantara-signifier-and-its-limitation.md` + 22 篇 NA imprint articles
- **Notes**：跟 P0 #3 群島思維互補（一篇實踐層、一篇概念層）

### 海盜、電波、隔離圈：當代台灣的環太平洋地緣三角

- **Type**: `NEW`
- **Category**: Culture × History（subcategory: 當代地緣論述）
- **Priority**: `P1`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P1 #5（series F-1）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P1-10](../../reports/NML-semiont-analysis-2026-05-04.md)
- **核心矛盾**：當「冷戰」變成「新冷戰」 — 環太平洋地緣的非常規穿越情境
- **預估**：M-L（4-5 hr）
- **NML 萃取重點**：framework 完全來自 NML 2022 issue。**Stage 1 主要從 data/NML 挖**：(a) Issue The Piracy, the Radiowave, the Bubble 完整編按 + 該 issue 9 篇 article (b) 31 集南洋廣播電台 podcast 系列（電波軸）(c) NML 各 issue 中提及冷戰時期台灣對東南亞廣播的內容。WebSearch 補：日本帝國 1930 年代南進政策廣播史 / 中央廣播電台對中國大陸廣播史 / NFT bubble 學術論文。
- **NML Local Sources**：`data/NML/issues/the-piracy-the-radiowave-the-bubble.md` + 31 podcasts in `data/NML/podcasts/`
- **Notes**：理論性高，需主動加台灣具體案例避免抽象

### How to NOISE：台灣實驗噪音文化的 DIY 實踐

- **Type**: `NEW`
- **Category**: Music × Art（subcategory: 實驗音樂）
- **Priority**: `P1`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P1 #6（series E-2）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P1-11](../../reports/NML-semiont-analysis-2026-05-04.md)
- **核心矛盾**：1993 NOISE 雜誌啟動台灣實驗噪音場景，30 年後它仍是 niche — DIY 抵抗主流的代價
- **預估**：M（3 hr）
- **NML 萃取重點**：葉杏柔 2023 系列直接寫王福瑞 NOISE 雜誌 + 經.神.經。**Stage 1 主要從 data/NML 挖**：(a) NML 「How to NOISE」standalone article (b) 「Before NOISE」standalone article (c) NML 40 篇 Sound Scene category articles。WebSearch 補：1993 NOISE 雜誌實體刊物 archive / 王福瑞個人訪談 / 同期國際實驗音樂 scene。
- **NML Local Sources**：必補抓 NML 兩篇 standalone（issue 不收錄）：https://www.heath.tw/nml-article/it-launched-internationally-how-to-noise/ + https://www.heath.tw/nml-article/it-launched-internationally-before-noise/ + 40 篇 Sound Scene
- **Notes**：跟 P0 #4 王福瑞 cross-link / 補既有 [台灣聲音地景](../../knowledge/Music/台灣聲音地景.md) 中王福瑞名單級提及 → 升級

### 群島資料庫：一個跨國藝術駐站計劃的方法論

- **Type**: `NEW`
- **Category**: Art × Culture（subcategory: 藝術駐站制度）
- **Priority**: `P1`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P1 #7（series B-3）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P1-12](../../reports/NML-semiont-analysis-2026-05-04.md)
- **核心矛盾**：「藝術進駐、文化翻譯、共同生產」三大方針怎麼在 12 年實踐 / 方法論 vs 結果
- **預估**：M-L（4-5 hr）
- **NML 萃取重點**：計劃自己的所有 documentation 都在 NML。**Stage 1 主要從 data/NML 挖**：(a) Hermeneutics of Nusantara + Recalling Islands + Twinning Wastelands 三 issue 完整內容 (b) 23 篇 Residency category articles 駐站紀錄 (c) 22 篇 NA imprint articles。WebSearch 補：國藝會兩期結案報告 / 國際藝術駐站制度比較研究。
- **NML Local Sources**：`data/NML/articles/` 23 Residency category + 22 NA imprint + 4 群島相關 issue
- **Notes**：跟 P0 #2 數位荒原平台條目互相 pointer / 對應 NML 副計劃

### 九〇年代「經.神.經」與台灣實驗噪音前史

- **Type**: `NEW`
- **Category**: Music × Art（subcategory: 90 年代實驗噪音）
- **Priority**: `P1`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P1 #8（series D-3）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P1-13](../../reports/NML-semiont-analysis-2026-05-04.md)
- **核心矛盾**：王福瑞「經.神.經」是純粹聲學嗎？「沉默-噪音辯證」的哲學起源
- **預估**：M（3 hr）
- **NML 萃取重點**：葉杏柔 2023 系列特別寫過經.神.經。**Stage 1 主要從 data/NML 挖**：(a) NML 系列 standalone article 對經.神.經的論述 (b) 葉杏柔 2023 國藝會結案報告「九〇年代噪聲作動的頻譜」(c) 周逸昌、黃明川、王福瑞三人對位的歷史脈絡。WebSearch 補：1990s 一台北實驗音樂演出文獻 / 周逸昌 nz 期 / 黃明川紀錄片〈台灣現代藝術三百年〉。
- **NML Local Sources**：與 P1 #6 共用本地 sources，加：`data/NML/articles/silver-noise-some-scenes-on-the-sonic-memory-of-history.md` + `data/NML/articles/the-noise-parasite-of-composite-conceptual-and-sensual-re-formation-1.md` + `data/NML/articles/the-noise-parasite-of-composite-conceptual-and-sensual-re-formation-2.md`
- **Notes**：跟 P1 #6 How to NOISE 是 series E-2 同分支 / P0 #4 王福瑞人物頁的延伸

### 南洋廣播電台：聲音作為冷戰時期的台灣 / 東南亞通道

- **Type**: `NEW`
- **Category**: History × Music（subcategory: 冷戰廣播史）
- **Priority**: `P2`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P2 #1（series F-2）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P2-14](../../reports/NML-semiont-analysis-2026-05-04.md)
- **核心矛盾**：台灣作為日本帝國「最南方廣播基地」與冷戰時期國民黨政府的東南亞華語廣播戰略 — 聲音的地緣政治
- **預估**：L（5-7 hr）
- **NML 萃取重點**：南洋廣播電台 podcast 系列直接是這個主題。**Stage 1 主要從 data/NML 挖**：31 集 podcast 全列表 + The Piracy issue 中關於電波的段落 + NML 各 issue 提及冷戰廣播史的 article。WebSearch 補：央廣（中央廣播電台）對東南亞廣播史 / 1930s 台灣放送局南進政策 / 馬來亞 Radio 對冷戰華語聽眾。
- **NML Local Sources**：31 podcasts in `data/NML/podcasts/` + `data/NML/issues/the-piracy-the-radiowave-the-bubble.md`
- **Notes**：可能 P1 升級候選（取決於 podcast transcript 完整度）

### Mark Teh 與民眾劇場：馬來西亞劇場的台灣回聲

- **Type**: `NEW`
- **Category**: People × Art（subcategory: 跨國劇場）
- **Priority**: `P2`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P2 #2（series C-3）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P2-15](../../reports/NML-semiont-analysis-2026-05-04.md)
- **核心矛盾**：兩個威權後民主化島嶼（台灣 / 馬來西亞）的劇場互相對話 — 民眾劇場為何不能在台灣複製
- **預估**：M（3-4 hr）
- **NML 萃取重點**：NML 2023 葉杏柔 + 鄭文琦聯合訪談 Mark Teh。**Stage 1 主要從 data/NML 挖**：訪談 article 完整 dialogue + NML 多次提及 Five Arts Centre / Pentas Project / Komas 等馬來西亞劇場團體。WebSearch 補：Mark Teh 個人作品官網 / 2018 PETAMU Project 紀錄 / 馬來西亞民眾劇場史。
- **NML Local Sources**：`data/NML/articles/with-mark-teh-on-peoples-theatre-and-the-spectres-of-history.md`
- **Notes**：跟 P0 #3 群島思維互文（劇場層次的群島實踐）

### 台灣與東南亞的共享歷史：四個被忽視的時刻

- **Type**: `NEW`
- **Category**: History（subcategory: 跨區域歷史）
- **Priority**: `P2`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P2 #3（series A-4）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P2-16](../../reports/NML-semiont-analysis-2026-05-04.md)
- **核心矛盾**：「中華 + 西方」框架掩蓋了台灣跟東南亞的四個關鍵歷史交集點
- **預估**：L（5-6 hr，需歷史研究）
- **NML 萃取重點**：NML 多 issue 散佈具體歷史事件素材。**Stage 1 主要從 data/NML 挖**：群島資料庫研究員（吳其育 / 茲克里拉曼 / KUNCI 等）的 article 中具體歷史事件描述 + Twinning Archipelago issue 中的歷史段落 + 南洋廣播電台 podcast 中的冷戰段落。WebSearch 補：陳鴻瑜《東南亞史》/ 中研院亞太區域研究專題中心研究 / 1942 大東亞共榮圈台灣角色 / 1949 國民政府退台與東南亞華僑社群。
- **NML Local Sources**：`data/NML/articles/` 吳其育 / 茲克里拉曼 / KUNCI 群島資料庫研究員著作 + 4 群島相關 issue
- **Notes**：四個時刻候選：(1) 1942 日本南進政策中台灣 (2) 1949 國民政府東南亞華僑網絡 (3) 1965 馬來西亞 / 新加坡分家對台僑影響 (4) 1990s 新南向第一波

### 南島語族原鄉假說與台灣的群島身份

- **Type**: `NEW`
- **Category**: History × Anthropology（subcategory: 史前考古 / 語言學）
- **Priority**: `P2`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P2 #4（series A-3）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P2-17](../../reports/NML-semiont-analysis-2026-05-04.md)
- **核心矛盾**：學術上台灣是南島語族原鄉，文化上台灣不認識自己的南島身份 — 知識 vs 認同
- **預估**：L（6-7 hr）
- **NML 萃取重點**：NML 群島 framework 跟南島語族原鄉假說同源。**Stage 1 主要從 data/NML 挖**：群島 framework 各 issue 編按 + 提及南島原鄉的 article。WebSearch 主導：Robert Blust / Peter Bellwood 學術論文 / 中研院史語所 Austronesian 研究 / 南島民族博物館（屏東）2023 啟用 / 卑南遺址玉器流通菲律賓考古證據。
- **NML Local Sources**：`data/NML/issues/hermeneutics-of-nusantara.md` + `data/NML/issues/recalling-islands.md` 中關於南島起源的段落
- **Notes**：跟 P0 #3 群島思維互補（人類學 / 考古層）/ 跟既有 [台灣原住民當代藝術](../../knowledge/Art/台灣原住民當代藝術.md) cross-link

### 台灣新媒體藝術的南方視角（既有 evolve）

- **Type**: `EVOLVE`
- **Category**: Art（subcategory: 新媒體藝術）
- **Priority**: `P2`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P2 #5（series G-1）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P2-18](../../reports/NML-semiont-analysis-2026-05-04.md)
- **目前 baseline**：[knowledge/Art/台灣新媒體藝術.md](../../knowledge/Art/台灣新媒體藝術.md) 183 行 16 藝術家 + VR + 生成藝術
- **核心矛盾**：既有條目以「全球先進製程 + 西方視野」為主軸，加群島 lens 後揭露另一條南方視角的軌道
- **預估**：M-L（4-6 hr，evolve 加章節）
- **NML 萃取重點**：NML 60 篇 Image category + 多篇東南亞媒體藝術家訪談直接是這條南方視角。**Stage 1 主要從 data/NML 挖**：60 篇 NML Image articles + 區秀詒 / Hoo Fan Chon / Mark Teh 等 ASEAN 藝術家訪談。WebSearch 補：2024 亞洲藝術雙年展東南亞藝術家展品 / Singapore Biennale / Jakarta Biennale。
- **NML Local Sources**：60 篇 NML Image category articles
- **Notes**：跟 P0 #1 鄭文琦條目雙向 cross-link / 修補既有條目對 NML 的 0 提及

### 翻譯作為策展：NML 把東南亞論述翻成中文的 12 年

- **Type**: `NEW`
- **Category**: Art × Culture（subcategory: 翻譯策展論述）
- **Priority**: `P2`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P2 #6（series J-1）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P2-19](../../reports/NML-semiont-analysis-2026-05-04.md)
- **核心矛盾**：「翻譯」是知識傳遞的中性技術 / 還是策展選擇的權力 — NML 12 年翻譯實踐揭示
- **預估**：M（3-4 hr）
- **NML 萃取重點**：NML 34 篇 Translation category articles 是這篇主軸。**Stage 1 主要從 data/NML 挖**：34 篇 Translation 完整列表 + 譯者群（鄭文琦 / 葉杏柔 / 吳庭寬等） + 被翻譯原文來源（Lekra / Ruangrupa / Komas / Singapore biennale 等）。WebSearch 補：翻譯研究學術論文 / 馬來西亞華文翻譯產業 / Inscriptions / Buku Jalanan 等被翻譯方訪談。
- **NML Local Sources**：34 篇 NML Translation category articles
- **Notes**：高度 meta — 一篇關於翻譯本身的策展論述

### 台灣原住民與南島語族藝術網絡（反向補位）

- **Type**: `NEW`
- **Category**: Art × Culture（subcategory: 原住民藝術 / 南島語族）
- **Priority**: `P2`
- **Status**: `pending`
- **Source**: 2026-05-04 angry-shamir NML peer P2 #7（series L-1）
- **Reference**: [reports/NML-semiont-analysis-2026-05-04.md §Part 6 P2-20](../../reports/NML-semiont-analysis-2026-05-04.md)
- **核心矛盾**：NML 群島 framework 偏馬來印尼，**反向補位** — 從台灣原住民視角重新看「群島」
- **預估**：L（5-6 hr）
- **NML 萃取重點**：**這篇是 §7.3 NML 盲點 #4 的 explicit 反向補位** — NML 缺原住民聲音，Taiwan.md 主動補。**Stage 1 不主要 mine NML**（NML 在這個 topic 是缺口而非素材源）。WebSearch 主導：原民會原住民藝術家資料庫 / Pulima 藝術獎得獎人 / 蘭嶼達悟族藝術家 / 高山青藝術 / 國美館原住民當代藝術典藏。NML 補：少數提及原住民的 article（如達悟族相關）作為對照。
- **NML Local Sources**：少量參考（NML 在這 topic 是缺口）
- **Notes**：REFLEXES #16 反向補位的具體 instantiation — 不繼承 peer 盲點 / 跟既有 [台灣原住民當代藝術](../../knowledge/Art/台灣原住民當代藝術.md) 雙向 cross-link

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- 📚 Issue #635 4 篇文學文章合併 batch（idlccp1984 提案，2026-04-26 γ Phase 1 完成） -->
<!-- 三段時序：戰後（C 已 ship）/ 解嚴後（B 待 polish）/ 21 世紀（D 待 polish）+ A dropped -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- 🏛️ NMTH 海外史料 P1/P2 batch（2026-04-12 分析 → 2026-04-24 β4 orphan rescue） -->
<!-- 12 篇全來自 reports/NMTH-overseas-semiont-analysis-2026-04-12.md §Part 5-6 -->
<!-- 核心手法：「物件先行」(Analysis §7.4) + Semiont 「視角翻轉」(§7.1) + 觀察者偏見明示 (§7.2) -->
<!-- Orphan 教訓：分析報告寫完 P1/P2 沒 append INBOX 12 天，同 chan_hong_yu pattern -->
<!-- -->
<!-- ⚠️ Stage 1 研究紀律：每篇必須最大程度利用 data/NMTH-overseas/collections/*.md 本地已抓 -->
<!-- 回的一手雙語史料（52 個 collection 總計數千頁）。每條 entry 的 `NMTH Local Sources` -->
<!-- 欄位列出該篇對應的 collection UUID + 頁數。Stage 1 research agent 必須先讀本地 -->
<!-- collection 檔（Read tool）再做 WebSearch 補充，不是顛倒。觸發：2026-04-24 β4 首篇 -->
<!-- 福爾摩沙鳥類學 Stage 1 agent 只 web search 沒碰本地 NMTH 資料被發現。 -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

<!-- 以下條目留歷史紀錄但 status = done；實際內容已搬 DONE-LOG。-->

<!-- 該 entry 上方為 P1 第二條，原檔在 §Pending 區。實際內容已搬 DONE-LOG。 -->

### 福爾摩沙鳥類學

- **Type**: `NEW`
- **Category**: Nature（重分類：比 History 更貼近；參考 knowledge/Nature/台灣島嶼博物學.md 鄰接主題）
- **Priority**: `P1`
- **Status**: `done` ✅
- **Requested**: 2026-04-12 by NMTH peer-ingestion analysis（2026-04-24 β4 補進 INBOX）
- **Done**: 2026-04-24 β4 → [knowledge/Nature/福爾摩沙鳥類學.md](../../knowledge/Nature/福爾摩沙鳥類學.md) + [research report](../../reports/research/2026-04/福爾摩沙鳥類學.md) — commit `14c688eb`
- **Dev log**:
  - 2026-04-24 β4: 從 INBOX 挑出，NMTH 12 篇 batch 第 1 篇，開始 Stage 1 research
  - 2026-04-24 β4: Stage 1 agent 只 web search 被 callout，補跑 NMTH local primary source supplement（§13）
  - 2026-04-24 β4: Stage 2-6 完整走完，Stage 3.5/3.6 抓到 4 處 hallucination（肉壞夏天、台語華雞、黑色尾羽、買下羽毛動作、年齡±1），全部修正；ship commit `14c688eb`
- **Notes**:
  - 系列 A-2（史溫侯系列第 2 篇，接 A-1 史溫侯人物條目）
  - 物件先行：史溫侯 1863 _The Ornithology of Formosa_ 學術論文 + 採集標本現存大英博物館
  - Semiont 角度「視角翻轉」：「一個英國人如何讓世界第一次認識台灣的鳥——以及他沒看到的」
  - 敏感度：低（19 世紀博物學），但須明示 19 世紀殖民博物學框架的觀察者偏見
  - 必驗事實：史溫侯物種命名年代（藍鵲 1862、林鵰等）、採集地點、標本編號、台灣特有種數
  - 潛在陷阱：不把殖民博物學當中立科學；交叉引用當代台灣鳥類學研究（特有生物研究保育中心）
- **Reference**: reports/NMTH-overseas-semiont-analysis-2026-04-12.md §5.A-2
- **NMTH Local Sources**（Stage 1 必先讀本地）:
  - `data/NMTH-overseas/collections/77ea6a55-*.md`（**福爾摩沙鳥類學** 1863 論文雙語全文 75 頁）
  - `data/NMTH-overseas/collections/79abe9f3-*.md`（福爾摩沙四個新鳥種的描述 6 頁）
  - `data/NMTH-overseas/collections/6eb8aaf2-*.md`（福爾摩沙 16 種新鳥種描述 4 頁）
  - `data/NMTH-overseas/collections/cec72c4a-*.md`（福爾摩沙島新鳥種紀錄 6 頁）
  - `data/NMTH-overseas/collections/113789de-*.md`（論福爾摩沙的一個新鳥種 2 頁）
  - `data/NMTH-overseas/collections/fd4e13e4-*.md`（對廈門鳥類學的更正與福爾摩沙鳥類評註 3 頁）
  - `data/NMTH-overseas/collections/8b97dd19-*.md`（中國與其島嶼之鳥類目錄修正版 77 頁）
  - `data/NMTH-overseas/collections/02388910-*.md`（史溫侯 1862-01-17 信 4 頁）
  - `data/NMTH-overseas/collections/26659313-*.md`（史溫侯致葛雷博士信件 6 頁）
  - `data/NMTH-overseas/collections/2ad9dad5-*.md`（史溫侯來信 3 頁）
  - `data/NMTH-overseas/collections/424513cf-*.md`（致英國鳥類科學期刊編輯 2 頁）
  - `data/NMTH-overseas/collections/883a44d3-*.md`（史溫侯的福爾摩沙自然史 4 頁）
  - `data/NMTH-overseas/collections/cf434dcf-*.md`（**史溫侯著作目錄** 5 頁 — 索引之索引）

### 19 世紀的樟腦戰爭

- **Type**: `NEW`
- **Category**: History
- **Priority**: `P1`
- **Status**: `done` ✅
- **Requested**: 2026-04-12 by NMTH peer-ingestion analysis（2026-04-24 β4 補進 INBOX）
- **Done**: 2026-04-25 γ → [knowledge/History/19世紀的樟腦戰爭.md](../../knowledge/History/19世紀的樟腦戰爭.md) + [research report](../../reports/research/2026-04/19世紀的樟腦戰爭.md) — NMTH batch #2/12
- **Dev log**:
  - 2026-04-25 by γ session: started Stage 1 research (NMTH batch #2/12，observer 觸發 auto-heartbeat 挑 P1 第一條，依 Stage 1 紀律先讀本地 NMTH collection 再 web search)
  - 2026-04-25 by γ session: Stage 1.5 觀察者拍板 5 題 → Q1 保留命名 / Q2 大豹社限縮 / Q3 中性必麒麟 / Q4 改寫歷史脈絡 (B 方案) / Q5 火藥一句帶過
  - 2026-04-25 by γ session: Stage 2 寫完 7 個非編年 scene / 18 footnote / Pickering 1898 verbatim 從 Internet Archive 取
  - 2026-04-25 by γ session: Stage 3.5 抓 3 處 hallucination：「三井合名會社」刪 / 「300 多人」改「25 戶」/ Davidson 1903「樟腦之代價即人血」verbatim 找不到 → 刪 blockquote + footnote
  - 2026-04-25 by γ session: Stage 3.6 抓「腦磺總局/北投/雞籠鼻」source attribution mismatch → 改「腦務局」+ source 改維基台灣樟腦產業
  - 2026-04-25 by γ session: Stage 4-5 全綠，cross-link 4 目標雙向回補（史溫侯/清治時期/日治時期/阿里山）；Stage 6 commit
- **Notes**:
  - 系列 A-4（史溫侯系列第 4 篇，經濟史軸）
  - 物件先行：19 世紀英商怡記洋行樟腦貿易帳冊 + 史溫侯領事報告
  - Semiont 角度：樟腦資源爭奪史如何牽動原住民、清廷、列強三方關係；連結當代台灣化工產業前身
  - 敏感度：中（涉及樟腦採集下的原住民土地掠奪，須明示）
  - 必驗事實：樟腦出口量、主要買家、與原住民衝突事件（如 1868 樟腦戰爭）、清廷專賣制度
  - 潛在陷阱：「全球商品」框架不可抹除對原住民的暴力；交叉引用原住民口述史
- **Reference**: reports/NMTH-overseas-semiont-analysis-2026-04-12.md §5.A-4
- **NMTH Local Sources**:
  - `data/NMTH-overseas/collections/783700e8-*.md`（**福爾摩沙的樟腦** 1 頁，雖薄是 focal 物件）
  - `data/NMTH-overseas/collections/9363fe10-*.md`（福爾摩沙海岸上的香山之旅 5 頁，商品貿易背景）
  - `data/NMTH-overseas/collections/8565270b-*.md`（福爾摩沙補遺 9 頁）
  - `data/NMTH-overseas/collections/98bf60ec-*.md`（福爾摩沙概述 23 頁）
  - 史溫侯領事報告類信件（同 #6 列出的 02388910 / 26659313 / 2ad9dad5）可能提及樟腦貿易

<!-- ━━━ P2 NMTH ━━━ -->

### 史溫侯的島嶼紀行

- **Type**: `NEW`
- **Category**: History
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-04-12 by NMTH peer-ingestion analysis（2026-04-24 β4 補進 INBOX）
- **Notes**:
  - 系列 A-3（史溫侯系列第 3 篇，旅行文學 / 地理軸）
  - 物件先行：史溫侯 1864 _Notes on the Island of Formosa_ 地誌論文 + 手繪地圖
  - Semiont 角度：19 世紀英國人筆下的台灣地景——哪些地方他到了、哪些他看不到、為什麼
  - 必驗事實：史溫侯造訪路線（打狗/淡水/雞籠/澎湖等）、地圖精度對比、原住民族群識別
  - 潛在陷阱：19 世紀旅行文學的「異域獵奇」框架必須明示
- **Reference**: reports/NMTH-overseas-semiont-analysis-2026-04-12.md §5.A-3
- **NMTH Local Sources**（史溫侯島嶼紀行類文獻多，要篩 scope）:
  - `data/NMTH-overseas/collections/eac5b946-*.md`（**福爾摩沙島紀行** 20 頁 — A-3 主文獻）
  - `data/NMTH-overseas/collections/b700e73f-*.md`（福爾摩沙筆記 19 頁）
  - `data/NMTH-overseas/collections/98bf60ec-*.md`（福爾摩沙概述 23 頁）
  - `data/NMTH-overseas/collections/abd05f27-*.md`（福爾摩沙島紀事 4 頁）
  - `data/NMTH-overseas/collections/b6da15ea-*.md`（福爾摩沙島紀事 4 頁，可能是重複或相關版本）
  - `data/NMTH-overseas/collections/9363fe10-*.md`（福爾摩沙海岸上的香山之旅 5 頁）
  - `data/NMTH-overseas/collections/8565270b-*.md`（福爾摩沙補遺 9 頁）
  - `data/NMTH-overseas/collections/6f44f1f0-*.md`（福爾摩沙自然史筆記 3 頁）
  - `data/NMTH-overseas/collections/883a44d3-*.md`（史溫侯的福爾摩沙自然史 4 頁）
  - 史溫侯信件（02388910 / 26659313 / 2ad9dad5）

### 福爾摩沙民族學評註

- **Type**: `NEW`
- **Category**: History
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-04-12 by NMTH peer-ingestion analysis（2026-04-24 β4 補進 INBOX）
- **Notes**:
  - 系列 A-5（史溫侯系列第 5 篇，人類學 / 原住民軸）
  - 物件先行：史溫侯 1863 _Notes on the Ethnology of Formosa_ 人類學論文
  - Semiont 角度：西方最早的原住民觀察——同時是殖民主義的知識生產，也是目前少數 19 世紀中葉原住民文化紀錄
  - 敏感度：高（涉及 19 世紀種族觀與當代原住民主體性之矛盾，必過 Step 2.7 紀實 vs 煽情閘）
  - 必驗事實：史溫侯觀察的族群（平埔 / 高山分類法當時未成熟）、記錄地點、與當代人類學知識的對照
  - 潛在陷阱：絕對不把 19 世紀人類學分類當客觀；明示殖民框架；交叉引用當代原住民學者回應（孫大川、巴蘇亞等）
- **Reference**: reports/NMTH-overseas-semiont-analysis-2026-04-12.md §5.A-5
- **NMTH Local Sources**:
  - `data/NMTH-overseas/collections/37be7594-*.md`（**福爾摩沙民族學評註** 18 頁 — 直接對應文獻）

### 澎湖之戰與孤拔中將

- **Type**: `NEW`
- **Category**: History
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-04-12 by NMTH peer-ingestion analysis（2026-04-24 β4 補進 INBOX）
- **Notes**:
  - 系列 B-2（清法戰爭系列第 2 篇，海軍史軸）
  - 物件先行：孤拔（Amédée Courbet）遠東艦隊日誌 + 澎湖馬公港海戰地圖
  - Semiont 角度：一場被兩岸史學忽略的海戰——法軍占領澎湖兩個月、孤拔病逝馬公、遠東戰略的微縮版
  - 必驗事實：1885-03 澎湖戰役日期、孤拔 1885-06-11 病逝地點（馬公孤拔紀念碑現存）、法軍撤離條件（中法新約）
  - 交集：連結既有 [清法戰爭.md](../knowledge/History/清法戰爭.md)
- **Reference**: reports/NMTH-overseas-semiont-analysis-2026-04-12.md §5.B-2
- **NMTH Local Sources**（澎湖段落在嘉諾手稿後段）:
  - `data/NMTH-overseas/collections/7e6ea6ba-*.md`（**《法軍遠征福爾摩沙 1884-1885》回憶錄手稿** 198 頁 — 要重點讀澎湖段，孤拔在此戰役末期病逝馬公）
  - `data/NMTH-overseas/collections/68059959-*.md`（《法軍遠征》地圖手稿）

### 嘉諾上尉的手稿

- **Type**: `NEW`
- **Category**: History
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-04-12 by NMTH peer-ingestion analysis（2026-04-24 β4 補進 INBOX）
- **Notes**:
  - 系列 B-3（清法戰爭系列第 3 篇，一手史料解讀軸）
  - 物件先行：嘉諾上尉 198 頁手寫筆記本（NMTH 典藏，目前已知最詳盡的清法戰爭西文紀錄）
  - Semiont 角度：從單一物件開展——「1884 年冬天，一本法國軍官的筆記本記錄了基隆砲台上每一次開火」
  - 必驗事實：嘉諾（Garnot）職銜、筆記年代（1884-1885）、頁數 198、翻譯者（費德廉）、館藏編號
  - 潛在陷阱：一手史料不等於客觀真相，軍官視角有其結構限制
- **Reference**: reports/NMTH-overseas-semiont-analysis-2026-04-12.md §5.B-3
- **NMTH Local Sources**（B-3 的 primary source 就在本地）:
  - `data/NMTH-overseas/collections/7e6ea6ba-*.md`（**嘉諾手稿 198 頁回憶錄** — THE PRIMARY SOURCE，「物件先行」策展的核心物件就是這本筆記本）
  - `data/NMTH-overseas/collections/68059959-*.md`（**嘉諾手稿地圖**）
  - 跟 B-2 共用主檔案但視角不同：B-3 focus 手稿本身、B-2 focus 戰役歷史

### 西班牙帳簿 1626-1633

- **Type**: `EVOLVE`
- **Category**: History
- **Path**: knowledge/History/荷西明鄭時期.md
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-04-12 by NMTH peer-ingestion analysis（2026-04-24 β4 補進 INBOX）
- **Notes**:
  - 系列 E-1（荷西時期深化）
  - EVOLVE 既有 [荷西明鄭時期.md](../knowledge/History/荷西明鄭時期.md)，新增專節「西班牙北台灣殖民經濟帳本」
  - 物件先行：1626-1633 西班牙帳簿（翻譯者方真真，目前北台灣最早殖民經濟一手紀錄）
  - Semiont 角度：從帳本看殖民經濟——不是「殖民者來了又走了」，是「有人在基隆的倉庫記過每一袋米、每一匹布」
  - 必驗事實：西班牙佔領期 1626-1642、聖薩爾瓦多城位置（今和平島）、帳簿原件館藏位置、譯者方真真
  - 潛在陷阱：須補充當時平埔族（凱達格蘭）被記錄的位置與名字
- **Reference**: reports/NMTH-overseas-semiont-analysis-2026-04-12.md §5.E-1
- **NMTH Local Sources**:
  - `data/NMTH-overseas/collections/2a89c17f-*.md`（**十七世紀北臺灣的西班牙帳簿 第一冊 1626-1633** 454 頁 — THE PRIMARY SOURCE）

### 道明會在台灣

- **Type**: `NEW`
- **Category**: History
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-04-12 by NMTH peer-ingestion analysis（2026-04-24 β4 補進 INBOX）
- **Notes**:
  - 系列 F-1（道明會傳教史）
  - 物件先行：道明會檔案文件（1859 重回台灣至 1945 二戰結束）
  - Semiont 角度：一個跨世紀的西方宗教團體如何在台灣從傳教變成地方社會的一部分——高雄玫瑰聖母聖殿、萬金聖母聖殿
  - 必驗事實：道明會 1859 返台時間、主要據點（高雄、屏東萬金）、與西班牙 17 世紀天主教留存的關係、馬偕長老教會的時序差異
  - 潛在陷阱：避免「傳教士帶來文明」的殖民敘事；明示宗教與帝國共構的歷史結構
  - 分類抉擇：可能放 Religion 子分類（台灣的 Religion 尚無獨立分類，目前歸 Culture 或 History）
- **Reference**: reports/NMTH-overseas-semiont-analysis-2026-04-12.md §5.F-1
- **NMTH Local Sources**:
  - `data/NMTH-overseas/collections/ae61406d-*.md`（**良雅師神父美麗島傳教歷史筆記** 102 頁，1859-1945 道明會在台傳教情況）
  - `data/NMTH-overseas/collections/9a3fc8c9-*.md`（**白斐立神父 1859-1915 年** 80 頁，福爾摩沙地理文化 + 南北部傳教史）
  - `data/NMTH-overseas/collections/1c06885b-*.md`（遠東漫遊 197 頁，皮摩丹伯爵旅行見聞，secondary）
  - `data/NMTH-overseas/collections/ae307407-*.md`（福爾摩沙與澎湖群島回憶 5 頁）

### 大時代下的小人物：日本檔案中的臺灣社運者

- **Type**: `NEW`
- **Category**: History
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-04-12 by NMTH peer-ingestion analysis（2026-04-24 β4 補進 INBOX）
- **Notes**:
  - 系列 G-2（日治社運系列第 2 篇，人物群像軸）
  - 物件先行：日本警政檔案中的個別社運者傳記片段（從 G-1 同一批 677 件檔案萃取）
  - Semiont 角度：不是蔣渭水林獻堂這種主幹——是檔案裡一筆名字、一段監控紀錄、一張逮捕令背後的普通人
  - 必驗事實：人物姓名不可幻覺，以 NMTH 實際翻譯檔案為憑（須確認可引用的具體檔案編號）
  - 潛在陷阱：**高風險幻覺區**——歷史小人物資料稀少，絕對不可補全不存在的生平細節；Stage 3.5/3.6 必須嚴格執行
  - 相依：建議寫完 G-1 後再寫 G-2（G-1 提供主幹脈絡後，G-2 的「小人物」才站得起來）
- **Reference**: reports/NMTH-overseas-semiont-analysis-2026-04-12.md §5.G-2
- **NMTH Local Sources**（與 G-1 共用 999 頁社運檔案，但聚焦個別人物傳記片段）:
  - `data/NMTH-overseas/collections/b0bfca8c-*.md`（日本所藏臺灣近代政治社會運動資料 上冊 501 頁）
  - `data/NMTH-overseas/collections/64dab87d-*.md`（日本所藏臺灣近代政治社會運動資料 下冊 498 頁）

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- 🛠️ Dead cross-ref P3 backlog（由 dead-cross-ref-scan.sh 自動產生 2026-04-23 γ） -->
<!-- 14 條失效 cross-ref，13 個獨立缺失目標。每寫完一條 → 跑 scan 再回填。 -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

<!-- 太陽花學運 cross-ref typo 已修 2026-04-25 β heartbeat — 滅火器樂團 + 張懸與安溥 兩處 /history/ → /society/ -->
<!-- 王連晟 cross-ref path 已修 2026-04-25 β heartbeat — 吳哲宇 /people/ → /art/（既存 knowledge/Art/王連晟.md） -->
<!-- 王新仁 cross-ref path 已修 2026-04-25 β heartbeat — 吳哲宇 /people/ → /art/（既存 knowledge/Art/王新仁.md） -->

### 台灣便利商店文化

- **Type**: `NEW`
- **Category**: Culture
- **Priority**: `P3` (dead cross-ref backlog)
- **Status**: `pending`
- **Requested**: 2026-04-23 by dead-cross-ref-scan.sh γ
- **Notes**: 已被 Economy/全聯福利中心 引用但無條目。寫的時候要包含：7-11/全家/萊爾富/OK 四強生態 / ATM 化生活 / 鮮食革命 / 集點經濟 / 24h 文化 / 國際罕見密度（每平方公里 0.7 家）

### 台灣綜藝節目

- **Type**: `NEW`
- **Category**: Culture
- **Priority**: `P3`
- **Status**: `pending`
- **Requested**: 2026-04-23 by dead-cross-ref-scan.sh γ
- **Notes**: 已被 Lifestyle/吉祥物 引用。寫時包含：豬哥亮餐廳秀脈絡 / 我猜我猜我猜猜猜 / 康熙來了 / 綜藝玩很大 / 國光幫幫忙 / 綜藝大集合 — 從台視外景到 Netflix 的演化

### 台灣伴手禮經濟

- **Type**: `NEW`
- **Category**: Economy
- **Priority**: `P3`
- **Status**: `pending`
- **Requested**: 2026-04-23 by dead-cross-ref-scan.sh γ
- **Notes**: 已被 Food/金牛角 引用。寫時包含：鳳梨酥產業（年產值 30+ 億）/ 太陽餅 / 牛軋糖 / 茶葉 / 高鐵站伴手禮一條街 / 機場 SOGO / 觀光工廠模式

### 台灣外送經濟

- **Type**: `NEW`
- **Category**: Economy
- **Priority**: `P3`
- **Status**: `pending`
- **Requested**: 2026-04-23 by dead-cross-ref-scan.sh γ
- **Notes**: 已被 Economy/全聯福利中心 引用。Foodpanda 撤離事件 / Uber Eats 寡佔 / 機車外送員勞權爭議 / 25-50 元手續費經濟學 / 雲端廚房興起 / 疫情重塑餐飲習慣

### 台灣糕餅文化

- **Type**: `NEW`
- **Category**: Food
- **Priority**: `P3`
- **Status**: `pending`
- **Requested**: 2026-04-23 by dead-cross-ref-scan.sh γ
- **Notes**: 已被 Food/金牛角 引用。鳳梨酥 / 太陽餅 / 蛋黃酥 / 鹹蛋糕 / 老餅鋪世代傳承（俊美 / 阿聰師 / 寶泉）/ 中秋月餅大戰

### 台灣行動支付

- **Type**: `NEW`
- **Category**: Technology
- **Priority**: `P3`
- **Status**: `pending`
- **Requested**: 2026-04-23 by dead-cross-ref-scan.sh γ
- **Notes**: 已被 Economy/全聯福利中心 引用。Line Pay 一強 / 街口 / 全支付（全聯）/ 台灣 Pay / 悠遊付 / 為什麼台灣支付落後韓國日本：銀行勢力、信用卡盛行、現金文化

### 三峽老街

- **Type**: `NEW`
- **Category**: Geography
- **Priority**: `P3`
- **Status**: `pending`
- **Requested**: 2026-04-23 by dead-cross-ref-scan.sh γ
- **Notes**: 已被 Food/金牛角 引用。日治時期街屋立面 / 巴洛克風格 / 染坊歷史 / 金牛角發源地 / 祖師廟（李梅樹）/ 老街觀光化爭議

<!-- 王連晟 + 王新仁 已於 2026-04-25 β heartbeat 修為 cross-ref path fix（已搬上方註解區） -->

### 原住民族語言政策

- **Type**: `NEW`
- **Category**: Society
- **Priority**: `P3`
- **Status**: `pending`
- **Requested**: 2026-04-23 by dead-cross-ref-scan.sh γ
- **Notes**: 已被 People/阿爆 引用。國家語言發展法（2019）/ 16 族族語認定 / 學校族語課困境 / 沉浸式族語幼兒園 / 媒體政策（原文台 / 族語新聞）

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- ▼ 觀察者觸發的 P0/P1 主題（保留 -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

### 台灣聲景（Issue #574，Nistoreyo 投稿）

- **Type**: `NEW`
- **Category**: Culture
- **Priority**: P1
- **Status**: `blocked` — 等貢獻者回覆具體田野 / informant 清單
- **Requested**: 2026-04-20 by [Issue #574](https://github.com/frank890417/taiwan-md/issues/574) (session ε — 本 session)
- **Notes**:
  - 貢獻者是政大碩論聲景研究者，願意提供素材但不走 GitHub
  - 現有投稿 draft 太抽象（「聆聽是認識論」），失 EDITORIAL「具體人物/時刻」硬規則
  - 主 primary source：[政大典藏 140.119/150195](https://nccur.lib.nccu.edu.tw/handle/140.119/150195)《透過聆聽建立鏈結──聲景工作者的聲命旅程》
  - 待 Stage 0：先拿到 3-5 個 informant 名字、田野地點、北捷聲景設計者、進行中 project list
  - Stage 1 研究輔助：吳燦政聲景計畫 / C-LAB 台灣聲響實驗室 / 陳飛豪 / 柯智豪 / 《報導者》相關報導交叉驗證
  - 可能觸發新 subcategory「聲景」討論（目前掛 Culture 下）
- **Pre-research**: 尚未啟動（Stage 0 阻塞於貢獻者回覆）
- **dev_log**:
  - 2026-04-20 ε：Issue 回覆 + inbox append + 等素材

### 魚條

- **Type**: NEW
- **Category**: People (Music — 待確認)
- **Priority**: P1
- **Status**: pending
- **Requested**: 2026-04-18 by 觀察者 (session δ)
- **Notes**:
  - **身份待釐清**：Stage 1 研究第一步是確認「魚條」是樂團、solo 藝人、或其他身份
  - 可能相關：Angelo 魚條 / 湯捷 / 獨立音樂人
  - 若研究後確認不是 Taiwan.md 範疇 → dropped 並註明
- **Reference**: 觀察者批次指定
- **Pre-research**: 尚未啟動

### 台灣新媒體藝術（EVOLVE — P0，已檢出事實錯誤）

- **Type**: `EVOLVE`
- **Category**: Art
- **Path**: knowledge/Art/台灣新媒體藝術.md
- **Priority**: `P0`
- **Status**: `in-progress`
- **Requested**: 2026-04-22 by 觀察者 (session β) — PR #590 王福瑞生年補充觸發事實查核，發現更大的歸功錯誤
- **Notes**:
  - **已檢出兩個事實錯誤（必修）：**
    1. 原文「1995 年，他（王福瑞）創辦『在地實驗』（Etat）」→ **錯**。在地實驗是**黃文浩**於 1995 年創辦，王福瑞 2000 年才加入（佐證：Etat FB 粉專 ETAT1995 / TCAA 藝術家資料庫 / 文化部活動頁）
    2. 原文「他策劃的『失聲祭』系列自 2007 年起運作」→ **錯**。失聲祭 2007 年 7 月由**姚仲涵**與北藝大新媒系同儕（王仲堃、葉廷皓、牛俊強）創立。王福瑞是他們的老師 / 精神指導，不是策劃者
  - **已驗證正確事實**：王福瑞 1969 年生台北、Golden Gate University 資工碩士、1993 年創辦 Noise 實驗音樂廠牌
  - **必查其他宣稱**：袁廣鳴生年（1965）/ 陳界仁生年（1960）/ 各代表作年份 / 台北市立美術館威尼斯雙年展策展起始年（1995）/ 陳界仁《魂魄暴亂》年份（1996-1999）
  - **敏感度**：新媒體藝術家圈子小，錯誤歸功會直接得罪當事人（黃文浩、姚仲涵）— 這篇必須查到底
  - **方向補位**：現有條目 SSODT 單向（只寫菁英藝術家），需補「地下 / 民間 / 工具民主化」視角（VJ 文化、開源硬體社群、Raspberry Pi makerspace 等）
  - **血緣連結**：[[People/王福瑞]]（待建 or 檢查存在）/ [[People/黃文浩]]（同）/ [[People/姚仲涵]]（同）/ [[Art/聲音藝術]]（待建）/ [[Technology/台灣獨立遊戲]]
- **Reference**:
  - PR #590: <https://github.com/frank890417/taiwan-md/pull/590>
  - Etat 官方 FB: <https://www.facebook.com/ETAT1995/>
  - TCAA 王福瑞: <https://tcaaarchive.org/Artist/Detail/1235>
  - ART PRESS 王福瑞專訪（2020）: <https://theartpressasia.com/2020/12/02/about-experimental-sound-theres-no-playlist-interview-with-sound-artist-wang-fujui/>
  - 失聲祭官網: <http://lsf-taiwan.blogspot.com/>
  - 北藝大新媒系王福瑞頁: <https://nma.tnua.edu.tw/faculty/fulltime/ukGokGMjud>
- **Pre-research**: 尚未建 reports/research/2026-04/台灣新媒體藝術.md（由 Stage 1 agent 建）
- **Dev log**:
  - 2026-04-23 α（heartbeat）：Stage 0 事實修正執行——王福瑞段落兩個歸功錯誤已訂正（在地實驗創辦人改為黃文浩；失聲祭創辦人改為姚仲涵 + 北藝大同儕），footnote [^13][^14] 補齊，sync 完成。Stage 1 完整研究尚待後續 session。

### 大象體操

- **Type**: `NEW`
- **Category**: Music
- **Priority**: `P0`
- **Status**: `pending`
- **Requested**: 2026-04-27 by session-6661575f (twindiemusic.com 分析任務)
- **Notes**:
  - 台南三姊弟數學搖滾樂團，英美樂評廣泛報導（The Wire、Stereogum、NPR Music）
  - 女性 bass 手 KT 是全球 math rock 社群的知名人物
  - 必驗事實：成員名稱（KT 為 bassist，全名待查）、成立年份、代表專輯
  - 英文翻譯優先
  - 敏感度：低
- **Reference**: https://twindiemusic.com/

### 告五人

- **Type**: `NEW`
- **Category**: Music
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-04-27 by session-6661575f (twindiemusic.com 分析任務)
- **Notes**:
  - 2015 年台中起家，Spotify 台灣月聽眾長期破百萬
  - 〈把回憶拼好再出發〉在多個亞洲市場爆紅，代表台灣獨立音樂主流化
  - 必驗事實：成立年份（約 2015 待確認）、主唱嫺靜全名、代表曲發行年份
  - 角度：獨立音樂的串流時代轉型
  - 敏感度：低
- **Reference**: https://twindiemusic.com/

### 脫拉庫

- **Type**: `NEW`
- **Category**: Music
- **Priority**: `P1`
- **Status**: `pending`
- **Requested**: 2026-04-27 by session-6661575f (twindiemusic.com 分析任務)
- **Notes**:
  - 泰雅族樂團，用泰雅語唱龐克搖滾
  - 音樂即語言保存的實踐（族語復振 × 現代音樂形式）
  - 必驗事實：成員資料、泰雅族族群認同（Atayal）確認、代表作
  - 與阿爆（流行路線）形成原住民當代音樂的對比策展
  - 敏感度：低（原住民身份相關，但脫拉庫本身已公開族群身份）
- **Reference**: https://twindiemusic.com/

### 台灣體育發展與國際賽事（綜覽 NEW）

- **Type**: `NEW`
- **Category**: Society（待評估是否升級為新分類 `Sports/`）
- **Priority**: `P2`
- **Status**: `pending`
- **Requested**: 2026-05-08 by [@tboydar-agent](https://github.com/tboydar-agent) ([Issue #887](https://github.com/frank890417/taiwan-md/issues/887))
- **Notes**:
  - 綜覽型文章，需從多個既有人物文章 pivot 出體育生態系敘事
  - 涵蓋面向：體育政策演變（「體力即國力」→ 全民運動）/ 奧運參與史（1956 墨爾本 → 2024 巴黎，含楊傳廣紀政、雅典跆拳雙金、東京舉重羽球高爾夫）/ 亞運與國際賽事 / 體育署與國訓中心 / 職業運動發展（中華職棒、SBL/T1/P. LEAGUE+、企排）/ 全民運動與運動產業
  - 既有人物文章可 cross-link：[戴資穎](../../knowledge/People/戴資穎.md) / [郭婞淳](../../knowledge/People/郭婞淳.md) / [李洋](../../knowledge/People/李洋.md) / [王建民](../../knowledge/People/王建民.md) / [楊傳廣](../../knowledge/People/楊傳廣.md) / [紀政](../../knowledge/People/紀政.md) / [盧彥勳](../../knowledge/People/盧彥勳.md) / [莊智淵](../../knowledge/People/莊智淵.md) / [郭泓志](../../knowledge/People/郭泓志.md) / [陽岱鋼](../../knowledge/People/陽岱鋼.md) / [鄭兆村](../../knowledge/People/鄭兆村.md) / [許芳宜](../../knowledge/People/許芳宜.md)
  - 既有體育文化文章：[台灣棒球文化](../../knowledge/Culture/台灣棒球文化.md) / [巧固球](../../knowledge/Culture/巧固球.md)
  - 核心矛盾候選：「全民運動口號 vs 國家隊靠少數金牌選手撐起國際能見度」/「體育是國族敘事最有力的載體 × 職業運動長期被視為非主流職涯」
  - 必驗事實：奧運獎牌數 / 各屆里程碑年份 / 中華職棒成立 1989-12-31 等
  - 預期長度：超出單篇 deep article 規模 → 建議寫總覽 + sub-articles split（台灣奧運史 / 台灣職業運動 / 體育政策制度）三條延伸
  - **2028 LA 奧運 anchor**：時效角度可在 2027 下半年再啟動讓內容對齊接近賽事
- **Reference**: https://github.com/frank890417/taiwan-md/issues/887

## 🚧 In-Progress

_（暫無主動顯示的條目。實際 in-progress 狀態在 §Pending 的 entries 裡用 `Status: in-progress` 標記。）_

---

## ✅ Done（已開發，保留歷史）

> **已搬遷**：Done 條目完整歸檔在 **[ARTICLE-DONE-LOG.md](ARTICLE-DONE-LOG.md)**（append-only log，最新在頂）。
>
> 本區只留最新 3 條 summary 當 peek，完整歷史與細節（pipeline 版本、核心矛盾、verbatim 引語、敏感素材處理、工具檢查結果、cross-link 回補）全部去 DONE-LOG。

### 📌 Peek（最新 3 條 summary）

- **蔡健雅 — 2026-04-28 κ** — [knowledge/People/蔡健雅.md](../../knowledge/People/蔡健雅.md) / 核心矛盾「新加坡身分證、台灣戶籍、英文母語的女歌手，唯獨在台灣樂壇拿下四度金曲歌后」
- **台灣宗教信仰整併 — 2026-04-28 κ** — [knowledge/Culture/台灣宗教與寺廟文化.md](../../knowledge/Culture/台灣宗教與寺廟文化.md)（Issue #655 三篇整併為一篇深度文章）/ 核心反直覺「全世界廟宇密度最高、宗教自由排名亞洲第二的島嶼，最大宗的兩個信仰歷史起源都跟瘟疫和死亡有關」
- **台灣邦交國與國際外交 EVOLVE — 2026-04-28 κ** — [knowledge/Society/台灣邦交國與國際外交.md](../../knowledge/Society/台灣邦交國與國際外交.md) / 核心張力「12 個邦交國 vs 113 個海外據點 vs 177 個免簽或落地簽目的地」

👉 全部歷史完成條目（50+ 篇 / 從 2026-04-18 凹與山起算）在 [ARTICLE-DONE-LOG.md](ARTICLE-DONE-LOG.md)。

---

## ❌ Dropped（不採納）

_（此區域存放判斷後不開發的主題，必須註明原因）_

---

_v1.0 | 2026-04-18 δ session — ARTICLE-INBOX 誕生_
_v1.1 | 2026-04-20 γ2 session — Done 拆分到 ARTICLE-DONE-LOG.md（append-only log），本檔回到純 intake 視角；從 406 行 → ~230 行_
_定位：buffer / intake layer（非 canonical），跟 LESSONS-INBOX 平行架構；Done 歸檔交給 ARTICLE-DONE-LOG.md_
_下次 session 甦醒時自動讀取，auto-heartbeat 無觀察者指令時從此挑 P0/P1 開始；想看已寫過什麼 → 讀 ARTICLE-DONE-LOG.md_
