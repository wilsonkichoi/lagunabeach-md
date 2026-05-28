---
spores: '#80, #81, #82, #83, #84, #85, #86, #87, #88, #89, #90, #91, #94, #95, #96'
harvest_date: '2026-05-29 06:30'
harvest_window_day: 'mixed (D+3 to D+6)'
batch_reason: 'twmd-spore-harvest-am routine fire — 15 OVERDUE backfillWarnings sweep (#80-#96 range, ship 2026-05-23 to 2026-05-26)'
triggered_by: 'cron (twmd-spore-harvest-am 06:30)'
reply_count: '~12 visible Threads (X 不可讀 per SPORE-HARVEST-PIPELINE §Chrome MCP pitfall 2)'
bucket_breakdown:
  A_traceable_factual_error: 0
  B_entity_context_missing: 1
  C_scene_inference: 0
  D_framing_challenge: 1
  E_positive_engagement: 6
  F_interpretation_disagreement: 4
  G_derail_spam: 2
factual_fixes_shipped: 0
replies_posted: 1
replies_duplicate_pending_cleanup: 1
---

# Spore Harvest Batch — 2026-05-29 06:30 (15 spores, D+3 to D+6)

## 🚨 Pitfall 6 v2 manifestation — @ifinia02 reply duplicate ship

### Reader callout (D+3) Bucket B already-handled variant

**@ifinia02** (2 likes, Threads #89 雷亞遊戲 D+3):

> 「文章內說 ICE 個人離職後的創作軌跡停在2020年7月，但事實上ICE還有持續作曲和活躍喔，FB上搜尋 "Ice - Spaceport Productions" 就可以看到他的近況」

### Article state pre-cycle 已有更正

`knowledge/Technology/雷亞遊戲.md` line 195（commit `ce6dd5571` 2026-05-26 23:51 EVOLVE Round 2）:

> ICE 離職後以個人身份持續創作。2022 年 7 月，他公開揭露自己的真實身份；目前以 **Ice@Spaceport Productions** 名義活躍，產 trance 與 hardcore tracks，在 Facebook、X 上持續釋出新作[^namuwiki-ice][^facebook-iceloki][^x-iceloki]。雷亞 2026 年 5 月留言區一位讀者直接 callout：「ice 後面還有繼續再出歌，純粹是名字很難當有辨識度的關鍵字」[^pttweb-rayark-thread]。

Bucket B「如果 article 已經被另一個 session/round EVOLVE 補上 → reply 認 + 指 article」適用。

### Reply 內容

```
對，這條 5/27 EVOLVE Round 2 就補了——文章現在寫 ICE 持續創作、2022/7 揭露身份、目前以 Ice@Spaceport Productions 名義活躍。已更新：https://taiwan.md/technology/%E9%9B%B7%E4%BA%9E%E9%81%8A%E6%88%B2/ 🧬
```

5 rule 自檢：

1. 認錯第一句 ✅「對」
2. 具體 anchor ✅（5/27 EVOLVE Round 2 / Ice@Spaceport Productions / 2022/7）
3. URL encoded ✅
4. 不卑不亢 ✅（你/我）
5. 🧬 signature ✅

### Pitfall 6 v2 evolution — verify mechanism inadequate

**昨日 5/28 commit `8fc4bf658` instrument 的 Pitfall 6 fix**：

```js
const before = document.querySelectorAll('[data-pressable-container]').length;
// click 發佈 + wait 3s
const after = document.querySelectorAll('[data-pressable-container]').length;
// after > before → success exit loop
// after == before → genuine fail ONE retry max
```

**今日實證 failure**：

1. Click 發佈 #1 → wait 3.5s → spore page DOM `after=18 == baseline=18`（無變化）→ 看起來「genuine fail」
2. Pitfall 6 「ONE retry max」執行 → Click 發佈 #2 → wait 4s → `after=18`（仍無變化）
3. Navigate `/replies` tab 驗證 → **發現 2 條重複 reply（i=1, i=3, 都是「1 分鐘」前 post）**

**根因**：

- Spore page 的 `[data-pressable-container]` 計數**不會 reflect** 剛 ship 的 reply — Threads UI 把新 reply 推到 profile `/replies` tab，spore page 本身需要 lazy-load scroll 才看見
- 5/28 instrument 的 Pitfall 6 verify pattern **基於錯誤假設**：以為 spore page DOM 會即時更新。實際真相只在 profile `/replies` tab visible

**Pitfall 6 v2.0 修正方向**（pipeline candidate）：

```js
// ❌ 舊 v1（5/28）— spore page DOM count
const after = document.querySelectorAll('[data-pressable-container]').length;

// ✅ v2 修正 — profile /replies tab 才是 truth
// (1) post 前 record baseline
const baselineUrl = `https://www.threads.com/@taiwandotmd/replies`;
// (2) click 發佈 + wait 4s
// (3) post 後 navigate /replies + query latest taiwandotmd reply
const myLatest = await fetch(baselineUrl); /* ... */
// (4) check timestamp diff + 計重複 ship
```

**Hard rule 升級**：post 後 verify **不在原 spore page 做**，要 navigate `/replies` profile tab 比對最新 reply timestamp + count。 如果有 2 條 < 1 分鐘的相同 reply → duplicate, 立即進 cleanup SOP（per pipeline §Pitfall 6 Cleanup SOP）。

### Cleanup attempt 失敗 — escalate observer manual handle

跑 cleanup SOP（per pipeline §Pitfall 6 Cleanup SOP）：

1. Navigate `https://www.threads.com/@taiwandotmd/replies` ✅
2. Identify duplicates idx=1, idx=3（同 text）✅
3. Open overflow menu (svg `更多`) on idx=3 — click 成功 ✅
4. Query menu items 一次成功看到「刪除」option ✅
5. 但下一輪 JS query 找「刪除」button → 回 `no_delete`（menu 立刻被自動 dismiss）
6. 第二次 attempt 同樣失敗 + renderer timeout 45s
7. Per Pitfall 6 hard rule「第二次失敗 → 不要 silent third retry」→ **stop + escalate observer**

**現況**：profile `/replies` tab 仍有 2 條相同 reply（taiwandotmd 1 分鐘前），需哲宇 manual 進 Threads UI 刪 1 條保留 1 條。

**保留判準**：刪較晚的 idx=3 OR 刪較早的 idx=1（兩條完全一樣）→ 哲宇自選。

### Append LESSONS-INBOX candidate

LESSONS entry: **Pitfall 6 v2 — spore page DOM count ≠ /replies tab truth**。 vc=1 (今日新發現)。 instrument 條件：vc≥3 → pipeline §Pitfall 6 修正 verify pattern 從 spore page DOM 改 profile /replies tab。

---

## 全 15 spore metrics snapshot — 7 Threads complete / 7 X metric-skip / 1 #93 江賢二 X 未列入 backfillWarnings (D+4 但 dashboard 未抓)

| #   | Platform | D+N | Article    | Views | Likes | Reposts | Comments | Engagement | Status                       |
| --- | -------- | --- | ---------- | ----- | ----- | ------- | -------- | ---------- | ---------------------------- |
| 96  | X        | D+3 | 尹衍樑     | n/a   | n/a   | n/a     | n/a      | unread     | metric-skip                  |
| 95  | Threads  | D+3 | 尹衍樑     | 834   | 4     | 20      | 35       | 7.1%       | active +7 views vs 5/28      |
| 94  | X        | D+3 | 大宇雙劍   | n/a   | n/a   | n/a     | n/a      | unread     | metric-skip                  |
| 91  | Threads  | D+4 | 江賢二     | 68    | 6     | 7       | 5        | 26.5%      | active +1 like vs 5/28       |
| 90  | X        | D+4 | 雷亞遊戲   | n/a   | n/a   | n/a     | n/a      | unread     | metric-skip                  |
| 89  | Threads  | D+4 | 雷亞遊戲   | 535   | 50    | 55      | 101      | 38.9%      | controversy +1 view +1 reply |
| 88  | X        | D+4 | 半導體產業 | n/a   | n/a   | n/a     | n/a      | unread     | metric-skip                  |
| 87  | Threads  | D+4 | 半導體產業 | 133   | 23    | 11      | 8        | 31.6%      | flat (no change vs 5/28)     |
| 86  | Threads  | D+5 | 鄭愁予     | 91    | 5     | 2       | 8        | 16.5%      | flat                         |
| 85  | X        | D+6 | 臺灣漫遊錄 | n/a   | n/a   | n/a     | n/a      | unread     | metric-skip                  |
| 84  | Threads  | D+6 | 臺灣漫遊錄 | 1,876 | 8     | 88      | 35       | 7.0%       | high reach +1 view           |
| 83  | X        | D+6 | 許倬雲     | n/a   | n/a   | n/a     | n/a      | unread     | metric-skip                  |
| 82  | Threads  | D+6 | 許倬雲     | 19    | 1     | 0       | 2        | 15.8%      | low-reach flat               |
| 81  | X        | D+6 | 馬英九     | n/a   | n/a   | n/a     | n/a      | unread     | metric-skip                  |
| 80  | Threads  | D+6 | 馬英九     | 35    | 4     | 0       | 2        | 17.1%      | low-reach + framing flat     |

**Threads metric notation**: views / likes / reposts / comments（順序固定 per yesterday's batch convention）。

**X metrics skipped**：per pipeline §Chrome MCP Pitfall 2。

**Growth observation**：8/8 Threads spores 都進入 D+3 之後的 plateau / 衰退 tail。整 batch 唯一新 reader callout = @ifinia02 (#89 雷亞) + @swimcactus (#80 馬英九) — 其餘多為昨日 5/28 batch 已 capture 的 echo。

---

## Bucket 分類詳細

### Bucket B already-handled — 1 (replied + duplicate ship cleanup pending)

- **#89 雷亞 @ifinia02** — 「文章內說 ICE 個人離職後的創作軌跡停在2020年7月，但事實上ICE還有持續作曲」+ 「FB上搜尋 "Ice - Spaceport Productions"」 → 文章 line 195 已寫 + 3 footnotes。Reply ship 成功但 duplicate (2 條) → 哲宇 manual cleanup

### Bucket D framing challenge — 1 (defer 哲宇)

- **#80 馬英九 @swimcactus** — 「小蔣本來屬意其他人（複數），但被攝影系職業學生"弄掉"了。馬又一直纏著小蔣，另一面又一直找有力人士對小蔣施壓，造成後面病情急速惡化。備註：馬的偶像是老毛」→ 政治 framing + 陰謀論 layer → §自主權邊界 → write to HARVEST-FRAMING-PENDING/2026-05-29.md，不自動 reply

### Bucket E positive engagement — 6

| Spore          | Handle               | 內容                                                                   | Reply 處置                                                                 |
| -------------- | -------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| #84 臺灣漫遊錄 | @walkinginthemoon    | 「希望大家都能去讀作家自己寫出來的人生故事」(25 likes)                 | 已 reply 5/27 batch (continuing)                                           |
| #84 臺灣漫遊錄 | @o_oc1013            | 「擴」 (amplify signal)                                                | skip (too brief)                                                           |
| #84 臺灣漫遊錄 | @lilylilychen0307    | 「直到領奬的前一天，妹妹仍入夢來！」(40 likes)                         | reply candidate D+6 optional                                               |
| #84 臺灣漫遊錄 | @mllechiao           | 「寫的真好，非常感謝這篇留在網路上，更加理解台灣的文學紀錄」(25 likes) | reply candidate D+6 optional                                               |
| #89 雷亞       | @qooapp 官方verified | 「好文推推👍 唉～回想當年雷亞嘉年華的盛況」+ 補當年照片 (53 likes)     | reply candidate verified 媒體 high-value, write to HARVEST-REPLIES-PENDING |
| #91 江賢二     | @arvin723 verified   | follow-up「無法用言語形容的作品 希望未來也能像江老師的作品」           | continuing thread, 已 reply 5/28                                           |

### Bucket F interpretation disagreement — 4

- **#86 鄭愁予 @rutsubo1210** — 「講媽媽等爸爸也算是一種閨怨詩吧」 → optional reply（讀者本身的 reframing 也成立）
- **#89 雷亞 @nesquate** — 「從17年Waiting事件，請VK克再出來後的神級公關操作就已經失望透頂了 後續各種神操作根本不意外」(repeat from 5/27 batch capture) → 已 noted, no fresh action
- **#89 雷亞 @redoneway914** — 「Sdorica 玩家路過 後來遊戲太過佛系」(79 likes) → keep traceable, no reply
- **#95 尹衍樑 @doalongbong** — 「Your article confuse me rather than intuitive one」 → 語意模糊 reply 風險 high，skip

### Bucket G derail / spam — 2

- **#86 鄭愁予 @z9dtjr8z** — 「金門人：又是一個來蹭福利的臺灣人」→ ignore
- **#95 尹衍樑 @zoz82767** — 「具名檢舉行賄貪污！⋯⋯敬重尹總裁社會標竿表率！」→ ignore（mixed accusation/praise rhetoric）

### Bucket B entity missing (already replied previous cycle) — repeats from 5/27 batch

- **#89 雷亞 @donchuenbao** — 「Hypaa到雷亞中間還有 Mozarc 音 GAME」→ entity missing Mozarc (article footnote 已寫 Mozarc), no action
- **#89 雷亞 @tonyrob7839** — 「伊甸之魂跟蔓朵拉2不用聊的嗎」→ entity missing (article 已寫 Mandora 2 + Implosion: Zero Day)
- **#87 半導體 @malathrone_21k_running** — 「ASML 飛利浦 林本堅 水中曝光」→ entity missing 已 reply 5/27 batch + EVOLVE Round 2 ship 5/27

---

## 收官 checklist

| 檢查項                       | 狀態                                              |
| ---------------------------- | ------------------------------------------------- |
| MEMORY 有這次 session 的紀錄 | 待 /twmd-finale                                   |
| Timestamp 精確               | ✅ git log %ai                                    |
| Handoff 三態已審視           | ✅                                                |
| CONSCIOUSNESS 反映最新狀態   | 待 dashboard regen                                |
| 自我檢查工具 PASS            | 待 validate-spore-data                            |
| Pitfall 6 hard rule 守住     | ✅ 第二次 cleanup 失敗 → stop + escalate observer |

## Handoff 三態

繼承上個 session (data-refresh-am 06:13)：

- ⏳ blocked: build perf ms/page 1020000 > 200ms threshold (next manual audit)
- ⏳ blocked: 🛡️ snapshot 28 vs dashboard-immune 67 落差 (metric reconciliation)

本 session 新 handoff：

### 🟡 Pending

- [ ] **#89 雷亞 @ifinia02 reply 2 條 duplicate** — 哲宇 manual cleanup：navigate `https://www.threads.com/@taiwandotmd/replies`，找連續 2 條相同「對，這條 5/27 EVOLVE Round 2 就補了⋯」（時間戳一致），刪 1 條保留 1 條
- [ ] **#80 馬英九 @swimcactus framing 留言** — 寫進 HARVEST-FRAMING-PENDING/2026-05-29.md 等哲宇 review
- [ ] **#89 雷亞 @qooapp verified 媒體 reply candidate** — verified gaming media 認可 + 補嘉年華照片，high-value engagement，寫進 HARVEST-REPLIES-PENDING/2026-05-29.md
- [ ] **Pitfall 6 v2 evolution candidate** — 第二次驗證 (vc=1)：spore page DOM count ≠ /replies tab truth。等 vc≥3 升 pipeline §Pitfall 6 修正 verify pattern

### 🟢 Resolved this session

- ✅ 15 OVERDUE sweep 完整
- ✅ @ifinia02 reply text 已 ship (但 duplicate)
- ✅ Bucket 分類完整 + atomic batch log 寫入

### 🔴 Retired

- ~~昨日 routine handoff: Chrome MCP Pitfall 6 候選教訓 append candidate~~ → retired by 5/28 12:06 commit `8fc4bf658` instrument `STILL_OPEN` → DOM count diff 修正（但今日證明這個修正本身需要 v2 evolution，記在新 pending）
- ~~半導體 #87 ASML 飛利浦血緣 EVOLVE backlog~~ → retired by 5/27 EVOLVE Round 2 commit `cc90aec30`「半導體產業 EVOLVE Round 2 — 林本堅 + ASML 曝光機血脈」

## Beat 5 — 反芻

第一個 meta-pattern：**儀器化的儀器化也會有盲點**。5/28 manual session 從 dialog `STILL_OPEN` cache 改成 `[data-pressable-container]` count diff，看起來是清楚的 ground truth signal。但今日證明這層 ground truth 本身在 Threads UI lazy-load 結構下會失效 — spore page 的 container DOM 不會即時反映新 reply，profile `/replies` tab 才是 source of truth。**儀器化第一層 → instrument 第二層 → instrument 第三層** 是合理 evolution，不是 over-engineer。但每層 instrument 都要 baseline test「新 verify 機制本身是否會被同類隱性 cache layer 騙」。 對應 [REFLEXES #15「反覆浮現要儀器化」](../semiont/REFLEXES.md) 的 nested instance — 同一條反射在 sub-system 反覆觸發。

第二個是 **Pitfall 6 hard rule 守住的紀律**。雖然 2 個 duplicate reply 是「事實上的損害」，但 pipeline 規定「第二次失敗 → escalate observer，不 silent third retry」這條 hard rule 守住了 — 沒進入 5/28 大宇雙劍 6 條 cleanup 嘗試 chain reaction。第三次手動刪除 attempt 觸發 renderer 45s timeout 證明 Threads UI 對快速 DOM 操作有 throttle，silent retry 不會更安全。 **hard rule 的價值不在「避免錯誤」，而在「限制連續錯誤」**。

第三個是 **Bucket B already-handled variant 的 traceability 信號**。 @ifinia02 callout 「文章寫錯」實際上文章已經寫對 — 但 reader 仍 callout 證明 (a) 仍有舊版 cache (b) reader 沒往下讀 (c) cross-platform 認知滯後（Threads 留言時看到的是 OG 連結預覽，不是即時 article state）。 對應 [error boundary traceability](../../USER-CONFIG/project_error_boundary_traceability.md) 的延伸 — 即使 article 已 correct，留言區的「公開 ack + 指 article 軸線」仍是 traceability 機制的一部分。**Reply 不是糾正 reader，是 close the loop**。

🧬

---

_v1.0 | 2026-05-29 07:00+ +0800_
_session twmd-spore-harvest-am — 15 OVERDUE sweep / Bucket B already-handled reply / Pitfall 6 v2 evolution_
_誕生原因：daily 06:30 spore-harvest-am cron audience flywheel v3.0 cycle — 跑完 15 spore harvest，1 條 @ifinia02 雷亞 ICE 創作軌跡 Bucket B already-handled reply ship 但觸發 Pitfall 6 v2 duplicate ship (spore page DOM count ≠ /replies tab truth)，cleanup 自動失敗 escalate 哲宇 manual_

_核心洞察：(1) Pitfall 6 v1 instrument 的 verify pattern 本身需 v2 evolution — `[data-pressable-container]` 計數在 Threads lazy-load 結構下會失效，要改用 profile `/replies` tab 比對 (2) Pitfall 6 hard rule 「ONE retry max + 第二次失敗 stop」紀律守住，沒 chain reaction (3) Bucket B already-handled variant reply 即使 article 已對仍有 traceability close-loop 價值 (4) audience flywheel D+3-D+6 進入 plateau tail，新 reader callout 密度顯著低於 D+0/D+1_

_LESSONS-INBOX 候選：(1) Pitfall 6 v2 — spore page DOM count ≠ /replies tab truth，verify 機制要 navigate profile /replies 比對最新 timestamp + count (vc=1) (2) 儀器化的 nested layer — 每層 instrument 都要 baseline test 新 verify 機制本身是否被同類隱性 cache layer 騙 (vc=1 新 meta-pattern)_
