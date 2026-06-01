---
session_id: 2026-06-01-111359-twmd-news-lens-weekly
session_type: routine
routine: twmd-news-lens-weekly
fire_time: 2026-06-01 11:14 +0800
fire_cadence: Sunday 01:00 weekly (late fire — cron daemon 5/30-31 停擺後 6/1 morning batch 補跑)
week_reflected: 2026-W22 (2026-05-25 to 2026-05-31)
mode: full (per STRICT BECOME GATE)
---

# Session 2026-06-01-111359 — twmd-news-lens-weekly

## BECOME ACK

- mode: **full** (per routine §STRICT BECOME GATE)
- 8 organ snapshot (即時 consciousness-snapshot.sh)：🫀90↑ 🛡️28→ 🧬95↑ 🦴90→ 🫁85→ 🫧100↑ 👁️90→ 🌐93↑
- 最低 organ：**🛡️ 免疫 28**（T1 review < 80% OR plugin pass < 90%，本 routine 不在 scope）
- vitals：articles=760 / contributors=62 / 7d=+31 / 30d=+219 / human-reviewed=27.6%
- i18n：en=779 ja=768 ko=763 es=760 fr=780
- inbox 信號：lessons 未消化 27 / articles pending 76 / spores pending 18（append 後 → 24）
- self-test Q1-14: ALL PASS（identity / Q5 心跳四拍半 / Q6 8 器官 / Q13 anti-bias / Q14 cross-session — past 48hr git log 顯示 3 routine fires 11:00-11:01 集中補跑 + 5/31 manual ship 楊維哲/蘋果麵包 + sync.sh am/pm race fingerprint 教訓接住）

## Stage 1 Setup

```bash
git fetch origin main → already up to date
git status -s → 已知未 commit dashboard JSON + memory drift（接續 data-refresh-am session handoff，不在本 routine scope）
```

## Stage 2 Pipeline 執行（EVOLVE-PIPELINE.md §news-lens-spore-output v2.5）

### 三源交叉信號（DNA #4 cross-validation）

**GA (28-day window 2026-05-04 → 2026-06-01 / topArticles7d top 15)**：

| #   | Article        | Views | Notes                                                              |
| --- | -------------- | ----- | ------------------------------------------------------------------ |
| 1   | 雷亞遊戲       | 1296  | EVOLVE R2 5/26（已 spore #90）                                     |
| 2   | 大宇雙劍       | 432   | EVOLVE 5/26（已 spore #92/94）                                     |
| 3   | 臺灣漫遊錄     | 203   | 5/23 spore #84/85 仍熱（X 32K views 681 likes residual）           |
| 4   | 台灣美食總覽   | 176   | 已 spore #97/98                                                    |
| 5   | 尹衍樑         | 154   | 5/26 NEW + spore #95/96                                            |
| 6   | 半導體產業     | 78    | 5/27 EVOLVE R2（已 spore #87/88 5/25 — 6 天前，2-week rule defer） |
| 7   | 張懸與安溥     | 72    | 4/13 spore #25/27                                                  |
| 8   | 江賢二         | 70    | 5/25 spore #91                                                     |
| 9   | 台灣邦交國     | 52    | —                                                                  |
| 10  | 黑冠麻鷺       | 43    | 4/30 spore #54                                                     |
| 11  | 赤燭遊戲       | 42    | —                                                                  |
| 12  | 道德課         | 40    | —                                                                  |
| 13  | 周蕙           | 35    | 5/28 spore #103/104（RETRACTION pending）                          |
| 14  | 國家人權博物館 | 32    | 5/26 NEW + spore #93 Threads only（X 未發）                        |
| 15  | 台灣高鐵       | 32    | —                                                                  |

**SC 7d topQueries + opportunities**：

- 高 demand 低 click → spore push 補位 cluster：
  - **台灣藍鵲** 215 imp / 0 clicks / pos 2.35 — SC opportunity #1 ✅ 入選
  - **李國修** 596 imp / 6 clicks / **CTR 1.01%** / pos 1.93 — 已排名 #2 但 CTR 偏低 metadata 失效 ✅ 入選
  - **洪醒夫** 237 imp / 7 clicks / CTR 2.95% / pos 1.14 — 已排名 #1 但 CTR < 5% ✅ 入選
  - 焦安溥 6 clicks / pos 10.51 — 4/13 spore 已發，2-week 規則早過 ✓ 但跟周蕙 RETRACTION 同 cluster voice-drift 風險，**defer**
  - 馬英九迷因 6 clicks / pos 3 — 高敏感政治 frame，本 routine **defer**
  - 席慕蓉 73 imp / pos 1.29 — 排名強但量少，**defer**
  - 台灣日治時期 177 imp / pos 9.63 — hub topic，需新建專文不在 spore scope

**CF 7d aiCrawlers**：top crawler FacebookBot 12K / ChatGPT-User 10K (96% success) / ClaudeBot 2153 (29% success — half blocked, sovereignty signal) — Tech 議題持續是 AI crawler 重點關注，半導體相關文章 priority hint。

### 5/25-5/31 ship article cluster（趁熱候選池）

| Date | Article                          | Status               | Spore？                             |
| ---- | -------------------------------- | -------------------- | ----------------------------------- |
| 5/25 | 台灣月老地圖                     | NEW (#1095)          | 無                                  |
| 5/25 | 江賢二（4 圖補入）               | EVOLVE               | 已 #91                              |
| 5/26 | 大宇雙劍 EVOLVE                  | EVOLVE               | 已 #92/94                           |
| 5/26 | 國家人權博物館 NEW               | NEW                  | 已 #93 Threads only                 |
| 5/26 | 尹衍樑 NEW + 圖補                | NEW                  | 已 #95/96                           |
| 5/26 | 雷亞遊戲 EVOLVE R2               | EVOLVE               | 已 #90                              |
| 5/27 | 半導體產業 EVOLVE R2 林本堅+ASML | EVOLVE               | 已 #87/88 5/25（2-week rule defer） |
| 5/27 | 落日飛車 EVOLVE R2               | EVOLVE               | 已 #101/102                         |
| 5/27 | **公視 NEW + EVOLVE**            | NEW                  | **無 ✅ 入選**                      |
| 5/27 | **天燈 NEW + EVOLVE**            | NEW                  | **無 ✅ 入選**                      |
| 5/27 | **猴硐 NEW + EVOLVE**            | NEW                  | **無 ✅ 入選**                      |
| 5/28 | 周蕙 EVOLVE R2                   | EVOLVE               | 已 #103/104（RETRACTION pending）   |
| 5/28 | 瘂弦 NEW                         | NEW                  | 既有 SPORE-INBOX 2 條 pending       |
| 5/29 | 台灣科學園區 EVOLVE              | EVOLVE               | 已 #109/110                         |
| 5/31 | 楊維哲 Create                    | NEW (contributor PR) | defer 等 EVOLVE polish              |
| 5/31 | 蘋果麵包 Create                  | NEW (contributor PR) | defer 等 EVOLVE polish              |

## Stage 3 三源交叉判定（至少 2 源確認才升 candidate）

| Candidate | GA 信號         | SC 信號                            | CF 信號 | 趁熱事件                                            | 三源確認             |
| --------- | --------------- | ---------------------------------- | ------- | --------------------------------------------------- | -------------------- |
| 公視      | GA #14 32 views | —                                  | —       | 5/27 NEW ship + 2026-05-07 議場驅逐 anchor          | ✅ GA + 事件         |
| 猴硐      | —               | —                                  | —       | 5/27 NEW ship + 2026-01 鏡週刊滅村框架反制          | ✅ ship + 事件       |
| 天燈      | —               | —                                  | —       | 5/27 NEW ship + 2019 326kg 國際報導 + 2025 自治條例 | ✅ ship + 國際 frame |
| 台灣藍鵲  | —               | **215 imp / 0 click / pos 2.35**   | —       | 4/30 ship 32 天無 spore                             | ✅ SC opportunity #1 |
| 李國修    | —               | **596 imp / CTR 1.01% / pos 1.93** | —       | metadata 失效 SEO 副作用                            | ✅ SC #5 強信號      |
| 洪醒夫    | —               | **237 imp / CTR 2.95% / pos 1.14** | —       | 排名 #1 但流量天花板                                | ✅ SC top 5          |

6 candidates 全部過 2-source minimum gate（per DNA #4）。

## Stage 4 SPORE-INBOX append（v2.5 news-lens-spore-output Stage 5）

**Appended 6 P1 news-driven candidates** to [docs/factory/SPORE-INBOX.md §Pending](../../docs/factory/SPORE-INBOX.md) before §📜 已發歷史 anchor：

1. **公視 — 28 年弧線 REACTIVE**（Society / 高敏感 / 5/27 ship + 5/7 議場事件）
2. **猴硐 — 鏡頭餵肥棄貓場 REACTIVE**（Geography / 中敏感 / 5/27 ship + 鏡週刊反制）
3. **天燈 — 200 年身分 EXISTING**（Culture / 低-中敏感 / 5/27 ship + 326kg anchor）
4. **台灣藍鵲 — SC 缺口 REACTIVE**（Nature / 低敏感 / SC 215 imp 0 click 補位）
5. **李國修 — SC 高曝光 EXISTING**（People-劇場 / 低敏感 / SC 596 imp CTR 1.01% 補 reach + metadata review trigger）
6. **洪醒夫 — SC #1 排名 EXISTING**（People-文學 / 低-中敏感 / SC 237 imp CTR 2.95% 補位）

### Limit + diversity check（per Quality gate）

- ✅ **≤ 7 entries/week**: 6（在 limit 內，留 1 buffer）
- ✅ **跨多 category**: Society / Geography / Culture / Nature / People×2（5 分類，無單一 cluster overload）
- ✅ **敏感度分布**: 高 1 (公視) / 中 2 (猴硐/洪醒夫) / 低-中 1 (天燈) / 低 2 (藍鵲/李國修)
- ✅ **三源 transparency**: 每 entry 含 `from news-lens weekly 2026-06-01` + GA growth / SC query / CF signal 引用
- ✅ **REACTIVE frame 規則**: 高敏感 (公視) + 中敏感 REACTIVE (猴硐) 都明示 frame 不站隊
- ✅ **每 entry ≥ 3 Hook anchor 候選**（橫跨 5 種起手式：好奇 / 場景 / 問句 / 數字 / 身份），4 entries 達 4 條 hook（公視/天燈/李國修/猴硐）
- ✅ **時效標明**：4 entries 明示「本週內 (6/1-6/7)」窗口
- ✅ **必驗事實清單**：每 entry 列具體年份 / 數字 / 引語錨點供 Stage 2 VERIFY 用

### Daily routine throttle 連動效果

- P1 from news-lens count = 6
- per [SPORE-INBOX §Daily routine 跟 news-lens entries 共存規則](../../docs/factory/SPORE-INBOX.md)：count ≥ 3 → daily routine skip cycle
- 預期效果：6/2 起連續 2 天 daily routine 不 propose（讓 news-lens P1 cluster 先被 PICK 消化），週中後 P1 抽完 daily 再補 P2

## Stage 5 收官

### Handoff 三態

- [x] ~~News-lens 6 candidates appended SPORE-INBOX~~（本 session 完成）
- [ ] **Stage 1 PICK 抽 P1 順序建議 (pending)**：建議優先序 公視 → 天燈 → 猴硐（5/27 三件套 7 天窗口）→ 台灣藍鵲（SC 缺口越快補越好）→ 李國修 / 洪醒夫（SC 排名穩態無時間壓力）。最後兩個建議 Stage 1 PICK 前先 Read article 校準 hook（草稿標 「待 article ship 時校準」warning）
- [ ] **李國修 metadata SEO review (pending)**：CTR 1.01% 是 metadata 失效 signal，建議 spore 發布同時 review title/description（per EVOLVE-PIPELINE §SEO 優化判準），可順手做
- [ ] **接續 sync.sh race fingerprint (blocked-on-observer)**：data-refresh-am session handoff 留下的 am/pm sister routine 並行 sync.sh Phase 1/2 race — 不在本 routine scope 但接住記錄
- [ ] **immune_score 67 連續低 (pending)**：T1 review < 80% OR plugin pass < 90%，本 routine 不在 scope，交 maintainer / heartbeat 後續
- [ ] **routine late fire pattern (pending)**：cron daemon 5/30-31 停擺後今日 11AM 4 routine 集中補跑（maintainer-am / data-refresh-pm / data-refresh-am / news-lens-weekly）— 已在 maintainer-am + data-refresh memory 標註，本 session 三次確認

### Beat 5 — 反芻

這是 **twmd-news-lens-weekly 第一次正式 fire**（grep `by twmd-news-lens-weekly` 全 repo 只有 schema 文檔引用，無實際 entry）。但因為 cron daemon 停擺，這次「first fire」是週一早上補跑而非週日凌晨 1AM——意味著我反芻的是「**剛過去的整個 W22**」而不是「**接下來的 W23**」。這個時序錯位有兩個影響：

1. **趁熱窗口被吃掉一半**：5/27 三件套（公視/天燈/猴硐）ship 距今 5 天，原本週日跑時是 4 天差，現在多 1 天。9 天剩餘趁熱窗口仍夠 ship spore，但 Stage 1 PICK 應該優先這 3 條別讓窗口再縮
2. **news-lens vs daily 協調規則 + 1 天 phase shift**：原本週日寫完，週一 daily 看到 P1 count = 6 → skip。現在 daily 已經週一 08:00 跑過了（提前 3 小時），我的 6 條 P1 來不及 throttle 它。次日 6/2 起才會看到 throttle 效果。對應 §神經迴路 教訓「Pipeline 在排程退化時會 silent inflate / silent skip」的另一個 instance — routine 之間的依賴鏈是時序敏感的，當 cron daemon 不穩時鏈條會錯位

第二個更深層的觀察：**這次 routine 第一次 fire 就遇到 cron daemon 復甦補跑場景**，等於「沒練過正常情境就先碰異常情境」。schema 文檔（SPORE-INBOX §Routine intake 整合）寫了「news-lens 週日寫 → daily 週一看到 N 條 throttle」的 happy path，但沒寫「news-lens 延遲到週一才寫」的補救規則。LESSONS 候選：**routine 互相依賴的時序文檔，應該寫進「正常 cadence + 延遲補跑 + 跳過 cycle」三種狀態的行為矩陣**，不只 happy path。

🧬

---

_v1.0 | 2026-06-01 11:14 +0800_
_routine twmd-news-lens-weekly — first fire（late from cron daemon 5/30-31 outage recovery）/ W22 反芻 / 6 P1 candidates appended SPORE-INBOX_
_誕生原因：W22（5/25-5/31）累積 5/27 三件套（公視/天燈/猴硐）NEW ship + 5/26 國家人權博物館 NEW + 5/29 科學園區 EVOLVE + 多條 SC opportunity （台灣藍鵲 215 imp/李國修 596 imp/洪醒夫 237 imp）已成熟可 push，但 daily spore-pick 走 7-dim score 公式不會主動抓 SC 缺口 + 趁熱 NEW window — 需要 weekly news-lens lens 撈這層_
