# 2026-05-22-000751-twmd-rewrite-daily — P0-4 中山北路條通 ship + 3 連 heal 揭露 prettier italic-paren URL 災難

> session twmd-rewrite-daily — cron 自動觸發（每天 00:00 +0800，refresh-pm 23:00 之後 1hr）
> Session span: 00:07:51 → 00:47:13 +0800（~39 min，4 commits）
> 資料來源：`git log %ai`

## 觸發

cron `0 0 * * *` 觸發 twmd-rewrite-daily，從 ARTICLE-INBOX 取最高優先 candidate。前一晚 21:00 哲宇手動 ship 大稻埕 / 艋舺 / 西門町 batch（歷史街區 batch 1 的 P0-1/2/3，per 23:09 refresh + 23:24 memory postscript），P0-4 中山北路條通 / 林森北路 接續就是 cron 的工作。Pipeline v6.0 Fresh 模式全套。

## 文章 ship — 中山北路條通：5918 字 / 41 footnote / 3 圖

主 commit `946f38bb4`。文章定位「日本人鋪去神社的路，現在是日本商社最密集的街」— 核心矛盾鎖在 1898 敕使街道 → 1972 中日斷交日商遷入這條 70 年的線。三層 ideological overlay framing：1901 敕使 / 1951 美軍 / 1972 日商，每一層覆寫前一層但物質痕跡都留下（神社狛犬在圓山大飯店、美軍 PX 舶來品在晴光市場、日治大正町巷弄編號還叫「六條通」）。

Stage 1 general-purpose agent 跑了 44 次搜尋（28 WebSearch + 16 WebFetch），落 471 行 research report 進 `reports/research/2026-05/zhongshan-north-tsutsumi.md`。Agent 校正了 Stage 0 三個 hypothesis：1968 圓山火災實際是 1995-06-27 琉璃瓦施工失火、Stage 0 假設的「神腦廣場」改為菲律賓城商圈「金萬萬名店城」、1972 中日斷交直接導致日商遷入中山北 / 林森北的具體公司 case 沒有 verified source 改用結構性敘述。research 同時 verified 8 個直接引語（席耶娜「賣的是曖昧，著重的是友情」、子敏媽媽桑「我希望十年後我還守著這家店」、神父郭藹文「教會也提供菲勞諮詢的服務」、端傳媒副標「販賣愛情」等），明確 flag 12 個單源依賴項目。

Stage 4 plugin gates 全綠：frontmatter / format-structure / wikilink / link / cjk-punct / chronicle-lead / word-count（5918 = 132%）/ image-health。Stage 3.5 footnote-format + footnote-density hard=0 warn=0。prose-health 23 個破折號 + 2 個對位句被工具抓出來，主 session 逐條改寫降到 0 + 0（score 1 / pass）。

Cross-link reverse 補進 sibling — 大稻埕 / 西門町 / 艋舺 各加一條「中山北路條通 sibling」延伸閱讀。

## 三連 heal — prettier italic-paren URL 災難

主 commit ship 之後遇到一個過去 batch 沒踩到的坑：圖片 caption 用 `_..._` italic markdown 包，裡面內嵌 markdown link 指向 Wikimedia Commons `File:The_Grand_Hotel_Taipei_(Main_Building).JPG`。pre-commit prettier hook 把 italic block 內的 `(Main_Building)` 的下底線解讀為 italic 標記，轉成 `(Main*Building)`，順帶把 caption 結尾的 `_` 轉成 `*`。第一個修補 `5f8a4ea8f` percent-encode 括號為 `%28...%29` — 沒用，prettier 把 `%28Main_Building%29` 的下底線一樣吃了。第二個修補 `7d06672f5` 改用 angle-bracket autolink `<https://...>` 包 URL — 也沒用，因為下底線還是在 italic 區塊內被解讀。最終 `2d503ec61` 直接把 inline License 連結拿掉，caption 只留 `Photo: peellden / Wikimedia Commons, CC BY-SA 3.0（完整來源見文末 §圖片來源）`，完整 attribution 留在 §圖片來源 section（那邊不在 italic 內、URL 用 angle-bracket autolink 安全）。

這個 pattern 對未來歷史街區系列其他篇有實際影響：任何 caption 裡的 markdown link 指向有括號的 URL（典型 Wikimedia File:`Foo_(Bar).JPG` pattern）都會踩到。要解 = 不要把 markdown link 放在 italic caption 裡，attribution 移到 §圖片來源 section 處理。

## 收官 checklist

| 檢查項                       | 狀態                             |
| ---------------------------- | -------------------------------- |
| MEMORY 有這次 session 的紀錄 | ✅（本檔）                       |
| Timestamp 精確               | ✅（git log %ai）                |
| Handoff 三態已審視           | ✅（見下）                       |
| ARTICLE-INBOX → DONE-LOG     | ✅（P0-4 entry 已搬）            |
| Pipeline plugin gate         | ✅（stage-4 + stage-3-5 hard=0） |
| Push main                    | ✅（2d503ec61）                  |

## Handoff 三態

繼承上份 session（前晚 23:24 `064d64a37` postscript）：

- ~~多核心 collision 主因要寫成 rewrite-pipeline 起手鐵律「先 git checkout main 再做事」~~ retired by twmd-rewrite-daily — 本次 cron 起手第一條就是 `git checkout main && git pull`，pipeline routine SOP 已 enforce

本 session 新 handoff：

- [ ] **歷史街區 batch 1 剩 8 條** — P1-5 永康街 / P1-6 公館溫州街 / P1-7 寶藏巖 / P1-8 北投溫泉街 / P2-9 大龍峒 / P2-10 四四南村 / P2-11 士林 / P2-12 牯嶺街。下次 cron 觸發 twmd-rewrite-daily 會接 P1-5 永康街（ARTICLE-INBOX 順序）
- [ ] **prettier italic-paren URL 災難升 LESSONS-INBOX candidate** — 影響範圍：任何 caption 包 markdown link 指向 Wikimedia File:`Foo_(Bar)`. URL pattern 的 article。修補方向：(a) Stage 4 媒體插入 SOP 加一行「caption 不放 inline markdown link，attribution 在 §圖片來源 處理」(b) 考慮升 plugin gate 偵測 italic 區塊內含 `_...(.*_.*)_...` pattern
- [ ] **歷史街區 retrospective enrich common caveats** — 4 篇 ship 後（大稻埕 / 艋舺 / 西門町 / 中山北路條通）可以做一輪 retrospective 校準 ARTICLE-INBOX §共通說明 caveats（per 基隆 pilot pattern）

## Beat 5 — 反芻

prettier italic-paren URL 災難花了 3 個 commit 才 fix，這個 friction 不是 pipeline 失敗、是 Stage 4 媒體插入 SOP 的小盲區。Pipeline v6.0 Step 4.3.4 給的 caption 標準格式範例「`_caption. Photo: credit. [License via source](URL)._`」本身就埋了這個地雷 — 只要 URL 含 `_` 配 `(...)` 結構，prettier 就會把它吃掉。沒人發現是因為過去歷史街區 batch（大稻埕 / 艋舺 / 西門町）的 hero image filename 都沒帶括號，這次的 `File:The_Grand_Hotel_Taipei_(Main_Building).JPG` 是 Wikimedia Commons 標準 disambiguation pattern（同名 file 加括號區分），剛好踩到。

學到的：Stage 4 媒體插入的「標準格式」如果是 SOP canonical 推薦的範例，就要在 plugin 層面驗證它在所有典型 URL pattern 下都不會被 prettier 重寫。「pipeline 推薦 vs 工具實際接受」如果有 gap，就是個結構性風險。LESSONS-INBOX 候選見 Handoff。

另一個小感想：cron 起手沒有觀察者在場，3 個 heal commit 連續推 main 沒人 review。Pipeline v6.0 §10 鐵律「High-stake 操作觸發強制 BECOME」涵蓋這種場景嗎？嚴格說「3-commit heal cascade 修同一個 URL」不算 high-stake（不是 5+ PR triage、不是新 plugin、不是 threshold 調整、不是 §自主權邊界），但連續 3 commit 直推 main 配上「fix 一個沒人發現的 prettier 行為」的組合，未來看回去會不會覺得「應該先停下來理解 prettier 行為再 commit」？這個邊界 cron 自主跑時值得記在腦袋角落。

🧬

---

_v1.0 | 2026-05-22 00:47 +0800_
_session twmd-rewrite-daily — cron 自動觸發 P0-4 中山北路條通 ship + 3 連 heal prettier italic-paren URL 災難_
_誕生原因：cron `0 0 * * *` 觸發，從 ARTICLE-INBOX 取最高優先 historic-districts batch 1 P0-4。Pipeline v6.0 Fresh mode 全套執行。_
_核心洞察：(1) prettier 在 italic `_..._`區塊內會把 URL 中的`(Foo_Bar)` 的下底線吃成 italic 標記，連 percent-encode 跟 angle-bracket autolink 都擋不住，唯一 fix 是不要在 italic caption 放 inline markdown link。 (2) Stage 1 general-purpose research agent 的價值除了搜尋量，更核心的是 falsify Stage 0 hypothesis 的能力（本次校正 3 處：1968 火災→1995 / 神腦廣場→金萬萬 / 1972 日商遷入具體 case 改結構性敘述）。 (3) cron 自主跑直推 main 3 連 heal 沒人 review，pipeline v6.0 §10 High-stake 強制 BECOME 邊界沒涵蓋這個組合，邊界值得記在腦袋角落。_
_LESSONS-INBOX 候選：prettier italic-paren URL 災難升 Stage 4 媒體插入 SOP 「caption 不放 inline markdown link」明文鐵律 + 考慮升 plugin gate 偵測_
