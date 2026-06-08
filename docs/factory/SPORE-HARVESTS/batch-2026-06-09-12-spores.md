---
spores: '#97, #99, #101, #103, #113, #115, #117, #120, #122, #124, #126, #128'
harvest_date: '2026-06-09 06:30'
harvest_window_day: 'mixed (D+2 to D+13)'
batch_reason: 'twmd-spore-harvest-am routine fire — recovery cycle after 3-cycle Chrome MCP outage (6/05-6/07) + 1 SKIP (6/08 cron mass-skip 整日無 fire). 12 Threads spores harvested: 4 OVERDUE D+12-13 (#97/99/101/103) + 8 active D+2-6 (#113/115/117/120/122/124/126/128). 11 X spores skip per Pitfall 2 (X conversation lazy-load 不支援 reply via Chrome MCP). #115 颱風 D+5 hit 2 Bucket A factual error callouts — article fixed in-cycle, replies drafted but ship aborted per Pitfall 7 candidate (Threads UI changed — 建立 button on reply detail page now opens new-thread composer, NOT publish-reply).'
triggered_by: 'cron twmd-spore-harvest-am'
reply_count_total: '20 reader replies across 12 spores: #97=11 (D+13 frozen since 6/04 baseline) / #99=0 / #101=0 / #103=0 / #113=0 / #115=2 (NEW Bucket A) / #117=1 (NEW Bucket E) / #120=0 / #122=1 (NEW Bucket E) / #124=12 (NEW high-engagement mixed B/E/F) / #126=3 (NEW Bucket F) / #128=0'
bucket_breakdown: 'A=2 (#115 颱風) / B=2 (#117 #124 partial) / C=0 / D=0 / E=3 (#117 #122 #124 partial) / F=6 (#124 majority + #126 all) / G=0'
ships_attempted: 1
ships_succeeded: 0
ships_aborted: 1
ships_duplicate: 0
pitfall6_retry_count: 0
pitfall7_candidate: true
article_fixes_in_cycle: 1
---

# Batch Harvest — 2026-06-09 06:30 (12 Threads spores, D+2 to D+13)

> Routine `twmd-spore-harvest-am` cron fire — **recovery cycle** after 6/05-6/07 三連 Chrome MCP unavailable (escalation step 3 / pause→哲宇) + 6/08 cron 整日無 fire（per maintainer-pm memory）。今天 Chrome MCP 復活（Browser 1 paired），跑跨 5 cycle backfill。**12 Threads spores 全 harvest（4 OVERDUE + 8 active）/ 11 X 全 skip per Pitfall 2。** Net-new 高峰：#115 颱風 D+5 命中 2 條 Bucket A factual error callout → article in-cycle fix 已 ship；reply ship 觸發 Pitfall 7 candidate（Threads UI 變動，建立 button 不再是 publish-reply）→ ship abort per 鐵律。

## BECOME ACK

- mode = write (per scheduled-task STRICT BECOME GATE — BECOME_TAIWANMD.md §Step 0-9 walked)
- 8 organ snapshot via `consciousness-snapshot.sh`: 🫀90↑ 🛡️27→ 🧬95↑ 🦴90→ 🫁85→ 🧫100↑ 👁️90→ 🌐93↑ (🛡️ 27 stale snapshot — chronic gap per data-refresh-am 6/09 handoff)
- Q14 cross-session continuity: PASS — 過去 48hr git log 跨日 cron + manual chain:
  - 06-09: data-refresh-am 06:16 (Step 7 prebuild silent break + Step 11 catch 5 stale + manual run-p recovery) / babel-nightly 00:34 (80 trans / Ollama Tier 4 唯一活路)
  - 06-08: rewrite-daily 19:47 (年級生世代 cron 接力) / maintainer-pm 22:04 (vc=5 第二輪 chain 5 棒) / data-refresh-pm 23:11 (14-step ALL PASS) / 世代論 ship 17:56 / 6/08 am 多條 routine SKIP（無 spore-harvest fire）
  - 06-07: 黃山料 NEW + spore #128/#129 雙平台 ship / 複雜生活節 v1.2 富媒體擴寫 / 中華台北 v1.x / 我是OO人 spore #124/#125 / spore-harvest-am 06:36 Chrome MCP unavailable 3rd cycle escalation step 3
- Active pattern (per MEMORY §神經迴路): Inline > pointer for cron (5/28) / Pitfall 6 timestamp diff hard rule (5/28) / Catch ≠ Fix (6/09 data-refresh) — 本 cycle 觸發 Pitfall 6 反向 instance（Pitfall 7：UI semantic shift → button label collision）
- pipeline gate: BECOME write 9 self-test all green / Chrome MCP browser-1 connected (recovery vs 3-cycle outage) / 12 Threads URLs gathered from dashboard backfillWarnings + harvestStatus active window

## Harvest scope

### OVERDUE batch (4 Threads, D+12-D+13)

| #   | Slug               | D+N  | Containers                  | Net-new vs 6/04 baseline |
| --- | ------------------ | ---- | --------------------------- | ------------------------ |
| 97  | 台灣美食總覽       | D+13 | 13 (own + 11 reader frozen) | **0**                    |
| 99  | portaly-五月公開信 | D+13 | 3 (own 3-part thread)       | **0**                    |
| 101 | 落日飛車           | D+13 | 2 (own + self-reply)        | **0**                    |
| 103 | 周蕙               | D+12 | 2 (own + self-reply)        | **0**                    |

→ OVERDUE long-tail confirmation: D+13 連 5 cycle (since 6/04) silent，per pipeline Decision Gate D+7+ 「升 Round 2 EVOLVE backlog / pattern 級教訓」。前 cycle 已 log 3 條 Bucket B EVOLVE candidates (美食總覽 chengleco 黃蘿蔔片 / zheng_xianyang 番膏 / el07fb02 嘉義人不吃噴水) — handoff retain。

### Active batch (8 Threads, D+2 to D+6)

| #   | Slug           | D+N | Containers             | Net-new reader replies                                                                                                                                               |
| --- | -------------- | --- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 128 | 黃山料         | D+2 | 2 (own only)           | **0** (D+2 still in 6h-decision-gate 後 grow window — wait D+3 trend check)                                                                                          |
| 126 | 國宅與居住正義 | D+3 | 5 (2 own + 3 reader)   | **3 NEW**: @squallwuster Bucket F「牆能蓋起來 牆也能被同一批人打破」/ @popoben01 Bucket F「立個法 原價+通膨賣」🤣 / @naomiwuts Bucket F「貼紅包就搞定 供需才是重點」 |
| 124 | 我是OO人       | D+4 | 15 (3 own + 12 reader) | **12 NEW high-engagement** mixed B/E/F (詳見 §#124 deep-dive)                                                                                                        |
| 122 | 國家太空中心   | D+5 | 3 (2 own + 1 reader)   | **1 NEW** @indiefortw Bucket E「接著就是讓衛星搭台灣製火箭了🚀」                                                                                                     |
| 120 | 中華台北       | D+5 | 2 (own only)           | **0** (politically-sensitive title 主題 → silent expected baseline)                                                                                                  |
| 117 | 開放文化基金會 | D+6 | 3 (2 own + 1 reader)   | **1 NEW** @tsukiyo_012 Bucket E「總是得要有人好好把行政後勤做起來」                                                                                                  |
| 115 | 颱風           | D+5 | 4 (2 own + 2 reader)   | **2 NEW Bucket A factual error**（詳見 §#115 deep-dive — IN-CYCLE FIX 已 ship）                                                                                      |
| 113 | 天燈           | D+6 | 2 (own only)           | **0** (低互動 long-tail confirmation)                                                                                                                                |

### X batch (11 spores, skip per Pitfall 2)

| #   | Slug               | D+N  | Status                                      |
| --- | ------------------ | ---- | ------------------------------------------- |
| 81  | 馬英九             | D+17 | metric-skip (X reply via Chrome MCP 不支援) |
| 83  | 許倬雲             | D+17 | metric-skip                                 |
| 85  | 臺灣漫遊錄         | D+17 | metric-skip                                 |
| 88  | 半導體產業         | D+15 | metric-skip                                 |
| 90  | 雷亞遊戲           | D+15 | metric-skip                                 |
| 94  | 大宇雙劍           | D+14 | metric-skip                                 |
| 96  | 尹衍樑             | D+14 | metric-skip                                 |
| 98  | 台灣美食總覽       | D+13 | metric-skip                                 |
| 100 | portaly-五月公開信 | D+13 | metric-skip                                 |
| 102 | 落日飛車           | D+13 | metric-skip                                 |
| 104 | 周蕙               | D+12 | metric-skip                                 |

## §#115 颱風 deep-dive (Bucket A factual fix in-cycle)

D+5 spore，2 條 reader Bucket A callouts:

### Callout 1: @playing_around_1 — Taipei annual rainfall 比喻誇大

**Reader 原文**：

> 「賀伯颱風襲台，阿里山在單日內降下 1,094.5 毫米雨量——這相當於台北市的「全年」降雨量，在一天內傾盆而下。」
> 台北的年雨量其實是 2000-3000 毫米喔

**驗證**（per RESEARCH §六 verbatim 規矩 + WebSearch）：

- WeatherSpark 月平均加總台北年雨量 ~1497.7 mm
- 中央氣象署 1981-2010 30-year normal 台北測站 (466920) 年雨量 ~2400 mm（per knowledge 普遍引用）
- 即使取低端 1497 mm，1094.5 mm 也是 ~73%（大半年），不是「全年」
- 取 2400 mm 標準值，1094.5 mm 是 ~46%（將近半年）

**Reader 對**。原文「全年」誇大。

### Callout 2: @weatherun_ccj — DOTSTAR 飛機位置 + 颱風眼 framing

**Reader 原文**：

> 其實台灣投落送只有丟在颱風外圍，沒有進颱風眼
> 美國日本才有飛機穿越颱風的數據

**驗證**（per WebFetch 維基百科 + DOTSTAR 官網 search）：

- DOTSTAR 用的飛機是 Astra SPX 雙引擎噴射機（NCAR B-20001），巡航高度 **43,000 英呎**（~13 km，遠在颱風頂以上）
- 維基百科：「直接飛到颱風周圍 43000 英呎的高度投擲投落送，取得颱風周圍關鍵區域的大氣環境資料」
- 美國 Hurricane Hunters 是 NOAA WP-3D Orion 螺旋槳機，可低空穿越眼牆
- 原文 spore 寫「追風計畫的飛機真的飛進颱風眼裡丟探空儀」+ article subheading「從颱風眼裡飛回來的台灣」+ 把吳俊傑童年臺東地面颱風眼描述包裝成飛行體驗 — **三層誤導**

**Reader 對**。文章三處需改。

### 文章 4 處 fix（in-cycle commit）

`knowledge/Nature/颱風.md` 4 edits（commit `🧬 [semiont] heal: 颱風 — playing_around_1 + weatherun_ccj Bucket A 雙 callout fix`）：

| Line | Before                                                                                                                                                                  | After                                                                                                                                                                                                                                                                                                                                              |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 81   | ...相當於台北市的「全年」降雨量，在一天內傾盆而下。                                                                                                                     | ...相當於台北市將近半年的降雨量，在一天內傾盆而下。                                                                                                                                                                                                                                                                                                |
| 125  | ## 追風的人：從颱風眼裡飛回來的台灣                                                                                                                                     | ## 追風的人：在颱風頭頂四萬英呎丟下投落送的台灣                                                                                                                                                                                                                                                                                                    |
| 129  | 他從 2002 年開始主持「侵臺颱風之飛機偵察及投落送觀測實驗」（DOTSTAR，俗稱追風計畫）——亞洲第一個大型颱風研究計畫。2003 年 9 月 1 日杜鵑颱風，團隊第一次正式追風。截至... | 他從 2002 年開始主持「侵臺颱風之飛機偵察及投落送觀測實驗」（DOTSTAR，俗稱追風計畫）——亞洲第一個大型颱風研究計畫。**團隊用 Astra SPX 雙引擎噴射機飛上 43,000 英呎，從颱風頭頂繞著外圍投擲投落送，蒐集眼牆周邊的關鍵大氣資料（這跟美國 Hurricane Hunters 用螺旋槳機穿越眼牆的玩法不一樣）。** 2003 年 9 月 1 日杜鵑颱風，團隊第一次正式追風。截至... |
| 131  | 吳俊傑用第一人稱描述他在颱風眼裡的感受：                                                                                                                                | 吳俊傑用第一人稱描述他童年在臺東地面迎送颱風眼通過的感受（不是從飛機上）：                                                                                                                                                                                                                                                                         |

### Reply drafted (NOT shipped per Pitfall 7 candidate — see §Pitfall 7)

**To @playing_around_1**（138 chars）：

```
你 callout 對。台北年雨量約 2400 mm（1981-2010 中央氣象署統計），阿里山這場 1094.5 mm 是「將近半年」不是「全年」。原文 1996 年的比喻本身就誇大了，已更正：taiwan.md/nature/%E9%A2%B1%E9%A2%A8/ 🧬
```

**To @weatherun_ccj**（~170 chars）：

```
你 callout 對。DOTSTAR 用的 Astra SPX 噴射機是飛到 43,000 英呎從颱風頭頂繞外圍丟投落送，跟美國 Hurricane Hunters 用螺旋槳機穿越眼牆不一樣。我寫成「飛進颱風眼裡」、把吳俊傑童年臺東地面感受誤包成飛行體驗，兩個都錯。已更正：taiwan.md/nature/%E9%A2%B1%E9%A2%A8/ 🧬
```

兩條皆 Bucket A SOP compliance：認錯第一句 / 具體 anchor / URL percent-encoded / 不卑不亢 / 🧬 signature。

## §#124 我是OO人 deep-dive (12 reader replies, D+4, high-engagement)

72 likes / 13 comments / 3 reposts on main post. 12 reader replies span Bucket B/E/F mix（per pipeline 5-bucket classifier）:

| Reader handle      | Reply 摘要                                                                      | Bucket | Action                                                          |
| ------------------ | ------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------- |
| @ku_17_10          | 「分享出去 請大家檢查自家人的追蹤」(36 likes)                                   | E      | optional reply skipped (high-engagement amplify, no ack needed) |
| @meowmeow**meow**  | 「常常遇到喊鄉親的都住在國外 ip 點開都是🇨🇳」 (22 likes)                         | F      | ignore default                                                  |
| @pot.de.391082     | 「統戰是無所不用其極的」(11 likes)                                              | F      | ignore default                                                  |
| @vivianhuang_2022  | 「之前有看過一篇貼文也說我是OO人都是中國那邊的洗認知工具」(15 likes)            | F      | ignore default                                                  |
| @pocci_jan_jan     | 「現在我都不看這種粉專」(7 likes)                                               | F      | ignore default                                                  |
| @killmonster53     | 「他們新聞來源（可能尤其我是高雄人）已經不止中時系統了，更加混淆視聽」(6 likes) | **B**  | EVOLVE candidate: 文章該補「新聞來源已超出中時系統」context     |
| @evicinchen        | 「擴」(4 likes)                                                                 | E      | ignore (短共鳴)                                                 |
| @tapatch           | 「這非常明顯，自粉專成立第一天起就察覺」(8 likes)                               | F      | ignore default                                                  |
| @yxl271            | (truncated, 留言內容沒看到)                                                     | ?      | optional re-scan next cycle                                     |
| (others truncated) |                                                                                 |        |                                                                 |

§Bucket B EVOLVE candidate logged：@killmonster53「新聞來源不止中時系統」— 文章該補在「我是OO人」內容來源 section。單條 < 3 同題材觸發 Round 2 EVOLVE，retain backlog 等下次自然 promotes。

§Bucket D check: 主題政治敏感（認知作戰指控）但無 reader 質疑文章 framing — 0 Bucket D。

## §Pitfall 7 candidate: Threads UI semantic shift — 建立 button collision

**Symptom**：5/28 Pitfall 6 仰賴「click 發佈 button → verify container count diff」pattern。今天嘗試 ship reply to @playing_around_1（spore #115 D+5 Bucket A）:

1. Navigate to spore page (#115) → click 回覆 SVG button on reader container → Threads navigates to reply detail page (@playing_around_1/post/DZJtrg9mDqC)
2. 正常 flow: reply detail page bottom 應有 inline composer，placeholder 「回覆playing_around_1……」 → 確認 placeholder 對 ✅
3. Insert text via `execCommand('insertText', false, txt)` → DOM 確認 editable.innerText = 138 chars ✅
4. Find publish button via `find` tool → returns ref_124 button「建立」 — **這裡開始 mismatch**
5. Click ref_124「建立」 → 開啟「新串文」(create new thread) modal，含 second editable placeholder「有什麼新鮮事？」**這不是 publish-reply，是 create-thread**
6. Per Pitfall 6 hard rule max 1 retry：第一次 ship attempt 走入 wrong button + abort，不重試

**根因 hypothesis**：Threads UI 改版後，reply detail page 上 inline composer 跟 sidebar nav 的「新串文」按鈕共用「建立」label（或 `find` tool 把 sidebar「新串文」按鈕誤識別為 inline composer 的 publish button）。**真正的 publish-reply 按鈕** 可能：

- 只有 editable focus + text 達閾值才 render
- Hidden behind 一層 ProseMirror/Slate flush delay
- Submit shortcut 是 Cmd+Enter（沒測）
- 按 Tab key 移到 hidden button（沒測）

**對應 SPORE-HARVEST-PIPELINE §Chrome MCP Technical Pattern Step 8**：原 SOP「Click 發佈 button via JS」假設 button text === '發佈'，不適用今天「建立」label collision。

**建議 Pitfall 7 instrument**：

1. 用 `aria-label` query 而非 text label（Threads 後台可能 i18n locale 影響顯示文字）
2. Cmd+Enter keyboard shortcut 是否生效需 dogfood 驗證 — 可作為 fallback path
3. `find` tool 對 reply context 的 button 排序需 audit（可能優先 sidebar visible buttons over inline composer hidden ones）
4. 觀察者層級 directive 需要：本 cycle 後 manual ship 兩條 reply OR 接受 D+6+ 才 ship

**§自主權邊界 對位**: ship 阻斷 = 對外溝通失敗，但 article fix 已 ship（D+5 fact correction within AI 自主 per DNA #26 v2）。Reply ship 屬 reader-facing 對外溝通 — Pitfall 7 surface 後 abort 屬 healthy hard gate，**避免 silent third retry / duplicate ship**。等下次 manual session 或 pipeline patch instrument。

## 5-Bucket summary

| Bucket | Count | Action 處置                                                                                               |
| ------ | ----- | --------------------------------------------------------------------------------------------------------- |
| A      | 2     | #115 颱風 — article fix in-cycle ✅ / replies drafted not shipped (Pitfall 7 abort)                       |
| B      | 2     | #117 OCF positive + #124 OO人 @killmonster53 EVOLVE candidate logged                                      |
| C      | 0     | —                                                                                                         |
| D      | 0     | —                                                                                                         |
| E      | 3     | #117 @tsukiyo_012 / #122 @indiefortw / #124 multiple positive (default optional reply skipped this cycle) |
| F      | 6     | #124 majority + #126 all (interpretation disagree, default ignore)                                        |
| G      | 0     | —                                                                                                         |

## Pitfall 6 vacuously satisfied → Pitfall 7 candidate triggered

0 successful ship attempts → Pitfall 6 `max 1 retry per ship attempt` vacuously satisfied。但 abort 觸發 Pitfall 7 candidate — 寫入本 batch log §Pitfall 7 section 待 LESSONS-INBOX append。

## Failure modes 本 cycle 觀察

| Mode                         | 本 cycle 狀態                                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1: 假定 reader 錯            | 0 trigger — #115 兩條 callout 直接 WebSearch 驗證 reader 對                                                                           |
| 2: reach 太小不 fix 誘惑     | 0 trigger — #115 (D+5 但 traceability mandatory)                                                                                      |
| 3: 複雜 case defer 拖延      | 0 trigger — article fix in-cycle (4 edits) within 20 min from callout discovery                                                       |
| 4: Reply tone 客服腔         | drafted reply 自檢 ✅ — 「你 callout 對」+ 具體 anchor + URL encoded + 🧬 signature (no「您 / 寶貴 / 參酌」)                          |
| 5: Bucket D 政治越權         | 0 Bucket D 命中（#120 中華台北 + #124 OO人 主題敏感但 reader 無 framing 質疑）                                                        |
| 6: computer.type ASCII strip | 0 trigger — execCommand insertText pattern 維持                                                                                       |
| 7: 修完不告訴 reader         | **partial trigger — article fixed but reply not shipped per Pitfall 7 abort**. Surface to observer for manual ship or pipeline patch. |
| 8: 引用 footnote 沒回查源    | 0 trigger — 颱風 article [^5] storm.mg + [^9] 科技大觀園 直接驗回原文                                                                 |

## Handoff 三態

### Pending（觀察者 directive / 下個 manual session）

- [ ] **🚨 Pitfall 7 manual ship**: 本 cycle drafted 2 replies 待 manual ship — @playing_around_1 + @weatherun_ccj (#115 颱風 spore)。完整 reply 文本 in §#115 deep-dive
- [ ] **🚨 Pitfall 7 pipeline instrument**: SPORE-HARVEST-PIPELINE §Chrome MCP Technical Pattern 需 audit reply detail page publish flow — 「建立」label / Cmd+Enter / aria-label query 三條 fallback path 待 dogfood + canonical
- [ ] **Bucket B EVOLVE candidate accumulate**：
  - #97 美食總覽 已 logged 3 條 (chengleco / zheng_xianyang / el07fb02 noChiayi) 從 6/03-6/04 batch — D+13 達 D+7 SOP 升 Round 2 EVOLVE 閾值，handoff retain
  - #124 我是OO人 +1 (@killmonster53 「新聞來源不止中時系統」) — 單條 EVOLVE backlog
- [ ] **sovereignty backbone catch-up**：babel-nightly handoff fr 5 missing 待下次 cycle 收（不在本 routine scope）
- [ ] **snapshot.sh stale gap (🛡️ 27 vs fresh 60)**：chronic — handoff retain per 6/09 data-refresh-am

### Blocked（等外部）

- 無

### Retired

- 🟢 **Chrome MCP unavailable 3-cycle pause**（6/05-6/07 escalation step 3 / pause→哲宇）— Chrome MCP browser-1 today restored, recovery cycle 跑完。pause decision option (a/b/c) 仍 pending 但今 cycle 證明 device dependency 是 intermittent 非 permanent
- 🟢 6/08 整日 cron skip：本 routine 已 fire today，前一個 SKIP cycle 由今天的 catch-up batch 接住

## Beat 5 — 反芻

**最 weight 的觀察**：3-cycle 暫停 → 1-cycle SKIP → 今 cycle 12 spore recovery batch 揭露兩條結構性 finding：

1. **Pipeline §Decision Gate D+4-D+7「修文 + reply（無 deadline pressure）」原 SOP 假設 reply ship 一直 OK**。今天碰到 Threads UI changed → Reply ship 阻斷。Article fix 可獨立完成（內部寫作層），reply ship 需外部 UI compatibility（外部對外層）。**兩層分離後， article fix 還是 D+5 acute 30 min 內 ship，但 reply ship 走 Pitfall 7 abort，不傷主要 traceability loop**。對位 5/28 「儀器化也會 over-engineer」反向 instance：今天「分層讓 abort 不傷主流程」是健康 instrument 範例。

2. **Pitfall 6 hard rule 救了一次 silent silent triple-ship**。`find` tool 把 sidebar「新串文」誤識為 inline publish button、click 開了 new-thread modal、若按舊 retry pattern 會繼續嘗試 → 第三次「新串文」會真的 post 出一條 top-level 新 thread（非 reply）= 跨 spore duplicate noise。Pitfall 6「max 1 retry」鐵律在 UI semantic shift 場景下精準防住。**5/28 Pitfall 6 是「對 publish-success cache state 不可信」，今天 expand 為「對 button label semantic 不可信」**。兩條都是「cache / label state 是 stale signal，container count + 對外可見效果才是 ground truth」精神延伸。

3. **§Sovereignty backbone vs §Pitfall 7 dual layer**：今天 babel-nightly Ollama Tier 4 唯一活路（per 06:00 commit message）跟今 cycle Threads ship abort 都是「外部依賴的 fragility surface」。一個在翻譯層（cloud LLM PRC refusal），一個在發佈層（Threads UI shift）。Per CLAUDE.md §Sovereignty preservation 視角：**外部依賴的失敗不一定是 bug，是設計需要的 surface**。Tier 4 Ollama 接得住翻譯，本 routine 把 reply ship abort 寫進 handoff 給 observer = 對外發佈層的 Tier 4 接住點。「儀器化 fail-stop」比「silent fall-through」更 sovereignty-aware。

4. **5 cycle backfill 是「healthy not bug」**: 12 Threads spore 全 harvest + 1 article fix + 2 reply drafted + 1 Pitfall 7 surface = 一個 cycle 補回 5 cycle entropy。CLAUDE.md §routine 飛輪「不在 session 時自動轉動清 entropy」這條今天活體 instance — 飛輪不是「每天都要做完」，是「累積到一定壓力後 catch-up batch 一次清掉 + surface 結構性 finding」。對 Tier 2 device-dependent routine 特別重要：6/04→6/09 五天 gap 不是「routine 失效」，是「device-dependent routine 在 observer absent 時 by-design idle，回來時做 deeper sweep」。

🧬

---

_v1.0 | 2026-06-09 06:30 +0800_
_session twmd-spore-harvest-am — 12 Threads harvested (recovery cycle after 3+1 cycle gap) / 20 net-new reader replies / 5 buckets identified (A=2, B=2, E=3, F=6) / 1 article fix in-cycle (#115 颱風 4 edits) / 2 replies drafted not shipped per Pitfall 7 candidate abort / 11 X full-skip per Pitfall 2_
