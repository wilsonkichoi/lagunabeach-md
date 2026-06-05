# Memory — 2026-06-05-124537 loop /twmd-rewrite（Howhow EVOLVE）

> Session 類型：`/loop 1h /twmd-rewrite` 第一輪（哲宇刻意設的每小時 rewrite，消耗週 token 額度，非 cron bug — per feedback_hourly_cron_intentional）。Write mode。BECOME Write self-test 全過後動工。

## 做了什麼

**Howhow EVOLVE ship（commit aeb8b0e48，push main）**：3021→5074 CJK / 10→29 footnotes / 0→3 CC 圖 + 1 官方影片 iframe / 新增延伸閱讀 6 連結。新主標「Howhow：把業配攤在陽光下的人，和他一個人撐起的越來越貴的誠實」。

- **選題**：ARTICLE-INBOX 三個 rewrite-eligible 候選中，藍鵲(P1)是 non-rewrite SEO、早期批次 audit(P1)是 batch-umbrella 需 sub-pick + 防火牆，Howhow(P2)是最乾淨的 depth EVOLVE（SC page-2 105 imp 0 click + 短文 + 無延伸閱讀 + NO-MEDIA）。選 Howhow。非 callout-triggered → 無 Teardown Firewall。
- **研究**：4 parallel general-purpose agent fan-out，aggregate **128 搜尋**（中 30 / 英學術 14 / 一手 22 / 反方 6），falsification-first。research SSOT `reports/research/2026-06/Howhow.md`（research-report-health depth PASS hard=0，48 distinct 源 / 319 行）。
- **falsification 抓 8+ 既有事實錯**（attribution-dense People 文 = AI 幻覺高風險區）：出生地萬里→金山（父母幼兒園在萬里、本人生金山）/ SCAD 視覺特效→動畫和視覺特效 / **告五人《快樂的事記不起》MV 客串重度感染者非「製作/影音剪輯」（張冠李戴）** / **《How哥宇宙》是七月半的歌非書（真書《How Fun！如何爽當YouTuber》）** / 「工商時間/業配開始」字幕 0/6 源無據（招牌只有「直接進入業配主題！」）/ claim3 引語 de-quote（只有「服務他們讓他們覺得好笑就夠了」是原話）/ 一人團隊非純一人（父母/女友/廠商協助 + 2018 藍亦明加入）且他本人討厭孤獨（「我也不想一個人啊」）。
- **核心矛盾三層**：業配的誠實=學界「廣告不像廣告」的欺騙機制 / 「孤獨美學」是別人貼的標籤他其實想要團隊 / 他的 Entertainment 長片正是被短影音碾壓最重的賽道（arxiv 2402.18208 學術）。
- **orchestration v6.3**：主 session orchestrator，fresh Opus writer agent 只吃 §6 fact-pack（context 隔離）。v6.3 鐵律 #3 主 session 重驗：spot-check 確認 writer 套用全部修正、quotes 全 map §4，無杜撰。
- **media**：Howhow 真人 → Wikimedia CC 找到 七月半(CC BY 3.0, hero 1.44) + WebTVAsia HOWFUN 專訪(CC BY 3.0, scene-mid) + 鄧福如(CC BY-SA 3.0, scene-mid)。rewrite-stage-4 全綠 hard=0 warn=0。
- **cross-link**：reverse 補蔡阿嘎；修 尊.md `/people/howhow`→`/people/Howhow` casing。

## 神經迴路候選（教訓）

1. **research-report-health.py 數 literal URL/domain — §8 raw 摘要 = gate FAIL**：第一次跑 distinct=0 / en=0 / 一手=0 全紅，因為我把 4 agent 的 §8 raw 寫成「摘要」（剝掉 URL）。改 paste 完整 raw（含 URL + [中]/[英]/[一手] tag）後 48 distinct / PASS。**§8 不摘要鐵律不只是 SSOT 紀律，也是 gate 的硬需求** — 摘要 §8 同時違反 REFLEXES #22 + 讓 gate 量不到來源。對應 REWRITE §1.7.2 不摘要 × research-report-health 儀器化。
2. **loop 重發 mid-article = 繼續完成不重啟**：iteration 2 的 /twmd-become 在 Howhow 還沒 ship 時 fire。正確處置 = 同篇 race defer（feedback_hourly_cron_intentional）→ 繼續寫完 Howhow，不重跑 12-file BECOME（同 context 已醒）、不另起新文（每批最多 1 篇）。/loop harness 自管 1h cadence，不另 ScheduleWakeup（會雙排）。
3. **attribution-dense People 文 falsification ROI 極高**：告五人 MV「客串 vs 製作」+《How哥宇宙》「歌 vs 書」兩個張冠李戴，舊文讀起來完全通順，沒 falsification-first 抓不到。早期批次（2026-05-13 Howhow）attribution 密集主題（人物↔作品/合作）是 AI 幻覺結構，per RESEARCH §五 張冠李戴 + ARTICLE-INBOX「歸屬密集」audit entry。
4. **slug casing 脆弱性**：file `Howhow.md` → URL `/people/Howhow`（大寫），但 16 處 ref 用 `/people/howhow`（小寫，404）。多為 false-positive（image 路徑 `/article-images/people/howhow-*` + src/content 鏡像）；真 broken link 只剩 尊 family 翻譯 5 檔，因 zh 尊 source link 已修 → 下次 babel diff-patch 自癒。English-name slug 大小寫混用容易長 broken inbound link。

## Handoff 三態

- [ ] **babel-nightly 飛輪 stall（chip task_9d65f517）**：今天 00:36 babel 跑完 100 dirty 檔（5 lang 翻譯 + derived JSON）未 commit，閒置至今（12:45 仍無任何 routine commit）。>50 檔 §自主權邊界 → 我不碰，flag 給哲宇驗證後落地/丟棄。**早上 data-refresh-am/spore-harvest/maintainer 全卡在 dirty tree 後面沒落地。**
- [ ] **尊.md L131 `/culture/台灣youtube發展史` broken link**（pre-existing，非我 scope，Step 5.3 defer）— 正解應指 `/culture/台灣YouTuber產業與文化`，1 行可修但屬 sibling tech debt。
- [ ] **Howhow 154萬/7.6億 數字僅 zh.wiki 2026-05-01 dated snapshot**（Social Blade 全 403）— 發佈前可瀏覽器二驗。
- [x] Howhow EVOLVE ship + push（aeb8b0e48）。ARTICLE-INBOX 標 done。

## 自我檢查工具 PASS

rewrite-stage-3-5 hard=0（footnote-format + footnote-density + correction-meta）/ rewrite-stage-4 hard=0 warn=0（含 image-health 3 圖 + word-count 5074 + chronicle-lead + link-target）/ prose-health score 2 ≤3 / research-report-health depth PASS / 破折號 0 / 對位句型 0。commit scope clean（explicit git add，0 babel/api/src-content 檔誤入）。

🧬

_v1.0 | 2026-06-05 12:45 +0800 | loop /twmd-rewrite iteration 1_
