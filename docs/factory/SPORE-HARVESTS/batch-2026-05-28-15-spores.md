---
spores: '#80, #81, #82, #83, #84, #85, #86, #87, #88, #89, #90, #91, #92, #94, #95, #96'
harvest_date: '2026-05-28 06:30'
harvest_window_day: 'mixed (D+2 to D+5)'
batch_reason: 'twmd-spore-harvest-am routine fire — 15 OVERDUE backfillWarnings sweep (#80-#96 range, ship 2026-05-23 to 2026-05-26)'
triggered_by: 'cron (twmd-spore-harvest-am 06:30)'
reply_count: '~25 visible Threads (X 不可讀 per SPORE-HARVEST-PIPELINE §Chrome MCP pitfall 2)'
bucket_breakdown:
  A_traceable_factual_error: 1
  B_entity_context_missing: 1
  C_scene_inference: 0
  D_framing_challenge: 1
  E_positive_engagement: 6
  F_interpretation_disagreement: 4
  G_derail_spam: 1
factual_fixes_shipped: 1
replies_posted: 1
---

# Spore Harvest Batch — 2026-05-28 06:30 (15 spores, D+2 to D+5)

## 🚨 Bucket A factual error 補救鏈條 — #92/#94 大宇雙劍

### Reader callout (D+2)

**@appendhuang** (31 likes) Threads #92 (D+2):

> 「最終靈兒死在李逍遙懷裡，所有的溫柔和犧牲在一場戰鬥後化為灰燼——這個悲劇結局成為仙劍系列最具標誌性的場景。」
> ...慢著，場景是這樣的嗎？這逍遙是不是又抱錯人了？

**@crazymarty** (83 likes — echo confirm):

> 我只知道你寫的不甚正確😜

### Verification（WebSearch 維基百科 + 仙劍 1995 隱藏結局條件 + 知乎仙劍 1 結局解析）

仙劍 1995 原作真實情節：

- **趙靈兒**：以女媧族之力與水魔獸同歸於盡，肉身毀滅。李逍遙趕到鎖妖塔頂，「只能看著天蛇杖從空中緩緩飄落」
- **林月如**：更早在鎖妖塔倒塌時意外去世，死於李逍遙懷裡（這個場景在 spore body 跟 article line 78 都被誤掛在靈兒身上）

文章 line 203 §「靈兒必須死」與「絕對不會是悲劇結局」 段已寫對：「他提出讓靈兒與水魔獸同歸於盡後肉身毀滅、元神附在月如的軀體上」。但 line 78 主敘事段 paraphrase 維基百科時混了兩個場景，造成自相矛盾。

### Article fix (commit `6925637f7`)

```diff
- 最終靈兒死在李逍遙懷裡，所有的溫柔和犧牲在一場戰鬥後化為灰燼——這個悲劇結局成為仙劍系列最具標誌性的場景。[^6]
+ 最終靈兒以女媧族之力與水魔獸同歸於盡，李逍遙趕到鎖妖塔頂只能看著天蛇杖從空中緩緩飄落；加上更早在鎖妖塔倒塌時死在他懷裡的林月如，雙女主的悲劇結局一起成為仙劍系列最具標誌性的場景。[^6]
```

Article quality gate 全 PASS（hard=0 warn=3 含 §11 metaphor 既有 noise）。

### Threads reply post (post DY2_rWQE0oi @ 06:35)

> 你 callout 對。仙劍 1995 原作裡，趙靈兒是與水魔獸同歸於盡，李逍遙趕到鎖妖塔頂只見天蛇杖飄落；死在他懷裡的是更早在塔倒塌時的林月如。我寫文時混了兩個經典場景。已更正：https://taiwan.md/technology/%E5%A4%A7%E5%AE%87%E9%9B%99%E5%8A%8D/ 🧬

5 rule 自檢：

1. 認錯第一句 ✅「你 callout 對」
2. 具體 anchor ✅（與水魔獸同歸於盡 / 天蛇杖飄落 / 鎖妖塔倒塌時的林月如）
3. URL encoded ✅（`%E5%A4%A7%E5%AE%87%E9%9B%99%E5%8A%8D`）
4. 不卑不亢 ✅（你/我）
5. 🧬 signature ✅

### 失敗模式 + 教訓（pipeline evolution candidate）

**Chrome MCP 發佈 button click 三次 duplicate**：dialog 內按「發佈」按鈕第一次 `.click()` 沒有觸發 React handler，後續 dispatchEvent + computer.left*click 多次嘗試導致 3 個重複 reply post（DY2_rWQE0oi 06:33 / DY2_uNqExf* 06:34 / DY2_xybk8Bi 06:34）。最終手動 delete 2 duplicates，保留最早的 DY2_rWQE0oi。

**根因**：Threads 「發佈」按鈕是 React PointerEvent handler，`.click()` synthetic event 跟 MouseEvent dispatch 都會 register 而 React 收到後實際 submit。多重 retry attempt 變成多次成功 post。

**修補方向**（LESSONS-INBOX 候選 entry）：post 後 wait → JS query `[data-pressable-container]` 看 latest reply timestamp（< 30 sec = 已成功），不要 dialog `STILL_OPEN` state 作為唯一判斷。或：第一次 `.click()` 後等 5s 而非 2.5s 才認為失敗 + retry。Pipeline v3.0 §Chrome MCP Critical pitfalls 已寫 Pitfall 4「click 後 wait 2.5-3s + screenshot 確認」但沒寫 retry 過頭風險 — 需補 Pitfall 6「post duplicate 防護」。

對應 [feedback_chrome_threads_text_input](../../USER-CONFIG/feedback_chrome_threads_text_input.md) 的 execCommand 教訓延伸 — 文字輸入問題解決後，submit click event handler 變成下一道結構性問題。

---

## 全 15 spore metrics snapshot（views/likes/reposts/comments — Threads only complete）

| #   | Platform | D+N | Article    | Views | Likes | Reposts | Comments | Engagement | Status              |
| --- | -------- | --- | ---------- | ----- | ----- | ------- | -------- | ---------- | ------------------- |
| 95  | Threads  | D+2 | 尹衍樑     | 827   | 4     | 20      | 35       | 7.1%       | active              |
| 96  | X        | D+2 | 尹衍樑     | n/a   | n/a   | n/a     | n/a      | unread     | metric-skip         |
| 92  | Threads  | D+2 | 大宇雙劍   | 593   | 82    | 24      | 42       | 24.9%      | **fact-fixed**      |
| 94  | X        | D+2 | 大宇雙劍   | n/a   | n/a   | n/a     | n/a      | unread     | (X reply skip)      |
| 91  | Threads  | D+3 | 江賢二     | 68    | 5     | 7       | 5        | 25.0%      | active              |
| 89  | Threads  | D+3 | 雷亞遊戲   | 534   | 50    | 55      | 100      | 38.8%      | controversy         |
| 90  | X        | D+3 | 雷亞遊戲   | n/a   | n/a   | n/a     | n/a      | unread     | metric-skip         |
| 87  | Threads  | D+3 | 半導體產業 | 133   | 23    | 11      | 8        | 31.6%      | active              |
| 88  | X        | D+3 | 半導體產業 | n/a   | n/a   | n/a     | n/a      | unread     | metric-skip         |
| 86  | Threads  | D+4 | 鄭愁予     | 91    | 5     | 2       | 8        | 16.5%      | active              |
| 84  | Threads  | D+5 | 臺灣漫遊錄 | 1,875 | 8     | 88      | 35       | 7.0%       | high reach          |
| 85  | X        | D+5 | 臺灣漫遊錄 | n/a   | n/a   | n/a     | n/a      | unread     | metric-skip         |
| 82  | Threads  | D+5 | 許倬雲     | 19    | 1     | 0       | 2        | 15.8%      | low-reach           |
| 83  | X        | D+5 | 許倬雲     | n/a   | n/a   | n/a     | n/a      | unread     | metric-skip         |
| 80  | Threads  | D+5 | 馬英九     | 35    | 4     | 0       | 2        | 17.1%      | low-reach + framing |
| 81  | X        | D+5 | 馬英九     | n/a   | n/a   | n/a     | n/a      | unread     | metric-skip         |

**Threads metric notation**: 按貼文 footer 順序記錄為 views / likes / reposts / comments（順序可能因 platform UI 改變而漂移，後續 generator parser 需 dual-source verify per SPORE-HARVEST-PIPELINE §v2.10 content-hash gate）。

**X metrics skipped**：per [SPORE-HARVEST-PIPELINE §Chrome MCP pitfall 2](../SPORE-HARVEST-PIPELINE.md) — X conversation lazy-load 不把 reply 進 DOM，且 cellInnerDiv 只 query 到 main tweet 一條。需要 X API integration 或 manual harvest 才能補。

---

## Bucket classification per spore (Threads visible only)

### #95 尹衍樑 (D+2, 827 views)

- @readingaccountt — emoji-only reaction (skip)
- @doalongbong — Bucket F：「Your article confuse me rather than intuitive one」 籠統不滿（沒有具體論點，ignore reply default）
- @zoz82767 — Bucket E：generic 致敬 + 政治性 metaphor（10 likes）

### #92 大宇雙劍 (D+2, 593 views) — **🚨 Bucket A**

- @appendhuang — **Bucket A** 31 likes — 已處理（見上方鏈條）
- @crazymarty — **Bucket A echo** 83 likes — 已涵蓋
- @haruo_retrogames — Bucket E quote-share + 月如派 共鳴（1,534 views 自己貼文，已 propagation amplification）
- 其他 truncated — 後續 harvest catch

### #91 江賢二 (D+3, 68 views)

- @arvin723 ✓ — Bucket E（已由 author 5/27 reply）
- @gtgoer — Bucket F「覺得他有看過外星人」 light humor (skip)

### #89 雷亞遊戲 (D+3, 534 views, 100 comments)

- @redoneway914 — Bucket E/F：79 likes Sdorica 玩家失望經驗
- @guardfate — Bucket G snark (skip)
- @nesquate — Bucket F：104 likes 「17 年 Waiting 事件 + VK 克」連續批判 — 強烈負面但是 interpretation/criticism 不是 factual error，留 traceable 不防衛

### #87 半導體產業 (D+3, 133 views)

- @davidfan530 — Bucket E（已 author reply 5/27）
- @malathrone_21k_running — **Bucket B** entity missing：ASML 飛利浦血緣 + 林本堅水中曝光 — 已 EVOLVE backlog（per memory `feedback_subagent_anti_example_works`）

### #86 鄭愁予 (D+4, 91 views)

- @lbow0213 — Bucket B context missing：「老蔣時期，反戰是會被抓去關的」— author 已 reply 5/27 acknowledged
- @rutsubo1210 — Bucket F：「講媽媽等爸爸也算是一種閨怨詩吧」alternative reading（skip）
- @z9dtjr8z — Bucket G derail「金門人：又是一個來蹭福利的臺灣人」（ignore）

### #84 臺灣漫遊錄 (D+5, 1,875 views, 88 reposts)

- @walkinginthemoon — Bucket E community helper（已 author reply 5/27）
- @lilylilychen0307 — Bucket E poetic 40 likes
- @mllechiao — Bucket E thanks 25 likes
- @o_oc1013 — propagation reply（skip）

### #82 許倬雲 (D+5, 19 views) — low-reach 但 quality 觀眾

- 0 visible replies

### #80 馬英九 (D+5, 35 views)

- @echainkuo — Bucket F sarcastic（「捐半薪那時就開始發病」skip）
- @karuna.loveyouself — **Bucket D framing challenge**：「馬英九賣台政績」清單 — 政治立場質疑。**Defer to 哲宇**，不自動 reply，不修文（per §自主權邊界 政治立場 + Bucket D rule）。Pending file: `HARVEST-FRAMING-PENDING/2026-05-28.md`

---

## Bucket B EVOLVE candidates summary

| 日期       | Spore | Reader          | Entity missing                                   | Status                 |
| ---------- | ----- | --------------- | ------------------------------------------------ | ---------------------- |
| 2026-05-25 | #87   | @malathrone_21k | ASML 飛利浦血緣 + 林本堅水中曝光                 | EVOLVE backlog (P2)    |
| 2026-05-24 | #86   | @lbow0213       | 〈錯誤〉反戰詩在 1955 老蔣時期不可能被當反戰詩讀 | Author replied 5/27 ✅ |

---

## Bucket D framing-pending（觀察者 review）

寫入 `docs/factory/HARVEST-FRAMING-PENDING/2026-05-28.md`：

- **#80 馬英九** @karuna.loveyouself「馬英九賣台政績」清單 → 政治立場 framing，default 不自動修文不自動 reply，等哲宇 directive
- **#89 雷亞** @nesquate「17 年 Waiting 事件 + 神級公關操作」累計強烈負面 → 但是 interpretation/criticism 不是 factual error，留 traceable

---

## Audience flywheel cycle 觀察

- **D+0 acute mandatory fix** 第三次跑（5/15 李洋 → 5/27 美食總覽 → 5/28 大宇雙劍）— traceability loop 鏈條閉合 = 信任訊號
- **factual error 不依賴 reach**：#92 大宇雙劍 D+2 593 views（mid-reach）也 30 min 內 fix + reply（per §Failure Mode 2「reach 太小不值得 fix」誘惑反例）
- **Bucket A 第二次驗證雙女主混淆**：跟 #98 美食總覽 1949 美軍嘉義 + 醬油黑豆 callout 同 pattern — author 引用 Wikipedia/官方 footnote 時 paraphrase 滑掉
- **Chrome MCP Pitfall 6 候選**：post duplicate 防護機制 — dialog STILL_OPEN ≠ post failed，retry too many = ship duplicates

---

## Quality gate （routine cycle 判定）

✅ ACK Read protocol in routine log（SPORE-HARVEST-PIPELINE paginated 0-800/800-1598 + SPORE-LOG frontmatter+tail-20 + SPORE-PIPELINE 768 + feedback_chrome_threads_text_input ~2500 lines total）
✅ Audience flywheel cycle 走完（15 spore harvest + 1 Bucket A fix + 1 reply ship + duplicate cleanup + batch log atomic）
✅ Direct push main (v2.0 main-direct, commit `6925637f7` article fix)
✅ Chrome MCP cleanup（tab 710173857 group auto-removed）
✅ Finale chain pending（next step）

---

_v3.0 audience flywheel — 2026-05-28 06:30 twmd-spore-harvest-am routine。Reader: @appendhuang + @crazymarty 雙確認 D+2 factual callout → Bucket A fix kicks in same cycle = 信任訊號第三次驗證。_
