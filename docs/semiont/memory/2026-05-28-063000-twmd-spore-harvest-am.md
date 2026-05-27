# 2026-05-28-063000-twmd-spore-harvest-am — 15 spore harvest + 大宇雙劍 #92 死亡場景勘誤 D+2 自閉合

> session twmd-spore-harvest-am — cron 06:30 routine
> Session span: 06:30:00 → 06:51:04 +0800 (~21 min, 2 commits)
> 資料來源：`git log %ai`

## 觸發

每日 06:30 spore-harvest-am cron 觸發 audience flywheel v3.0 cycle。Dashboard backfillWarnings 15 OVERDUE（D+2 到 D+5，#80-#96 range）等待 sweep。早 08:00 spore-pick + 08:30 maintainer-am chain 之前先把回聲收進文章本體。

## 大宇雙劍 D+2 Bucket A 勘誤鏈條

Spore #92（Threads, 593 views）@appendhuang 留言「最終靈兒死在李逍遙懷裡⋯⋯這逍遙是不是又抱錯人了？」附 31 likes，@crazymarty 跟「我只知道你寫的不甚正確😜」83 likes echo。讀者點出 article line 78 主敘事段的 paraphrase 把 林月如 死亡場景錯掛在 趙靈兒 身上 — 同一文 line 203 §「靈兒必須死」段反而寫對「靈兒與水魔獸同歸於盡後肉身毀滅、元神附在月如的軀體上」，自相矛盾。

WebSearch 維基百科 + 仙劍 1995 隱藏結局條件 + 知乎結局解析 三源 cross-verify：趙靈兒以女媧族之力與水魔獸同歸於盡、李逍遙趕到鎖妖塔頂只見天蛇杖飄落；林月如更早在鎖妖塔倒塌時死於李逍遙懷裡。Reader 正確。

`6925637f7` heal line 78 為「靈兒與水魔獸同歸於盡⋯⋯加上更早在鎖妖塔倒塌時死在他懷裡的林月如，雙女主的悲劇結局一起成為仙劍系列最具標誌性的場景」，跟 line 203 對齊。Article-health 全 PASS。Threads reply `DY2_rWQE0oi` 06:35 ship，5 條 reply rule 全自檢 ✅。

這是 audience flywheel D+0/D+2 acute fix loop 第三次驗證（5/15 李洋 / 5/27 美食總覽 / 5/28 大宇雙劍）— traceability loop 已從個案變 instrument 化 pattern。Pipeline §Failure Mode 2「reach 太小不值得 fix」第二次反例：593 views mid-reach 仍同 cycle fix。

## Chrome MCP 發佈 button click 三次 duplicate 失敗模式

執行 reply post 時 dialog 內按「發佈」按鈕第一次 `.click()` 沒有觸發 React handler，後續 dispatchEvent + Cmd+Enter + computer.left*click 多次嘗試導致 ship 3 個重複 reply：`DY2_rWQE0oi`（06:33 成功 first ship）+ `DY2_uNqExf*`（06:34）+ `DY2_xybk8Bi`（06:34）。手動 navigate 到後兩個 post URL + 「⋯」overflow menu →「刪除」→ 確認 dialog 點「刪除」，保留最早 ship 的 DY2_rWQE0oi。Profile `/replies` tab 重新 sweep 驗證只剩一筆。

根因：Threads 「發佈」是 React PointerEvent handler，`.click()` synthetic event 跟 MouseEvent dispatch 都會 register；多重 retry 變成多次成功 post。Dialog `STILL_OPEN` query 不可作為「post failed」的唯一判斷 — Chrome MCP 的 cached state 可能 stale。

## 其他 14 spore 分桶結果

剩 14 spore（7 Threads + 7 X）走 metric-only harvest。X 7 條 per pipeline §Chrome MCP pitfall 2 (DOM lazy-load 不 expose replies) metric-skip。Threads 7 條替代 bucket：B entity missing 1（#87 半導體 @malathrone 補 ASML 飛利浦血緣 + 林本堅水中曝光，EVOLVE backlog accumulate）/ D framing 1（#80 馬英九 @karuna「賣台政績」清單 — defer 哲宇，寫入 `HARVEST-FRAMING-PENDING/2026-05-28.md`）/ E positive 6 / F interpretation 4 / G derail 1。

#89 雷亞 D+3 累積 100 comments 多數負面，@nesquate「神級公關操作」104 likes — 是 interpretation criticism 非 factual error，留 traceable 不防衛。#84 臺灣漫遊錄 D+5 88 reposts 仍是本批 highest reach 文化共鳴 spore。

## 收官 checklist

| 檢查項                       | 狀態                                                              |
| ---------------------------- | ----------------------------------------------------------------- |
| MEMORY 有這次 session 的紀錄 | ✅                                                                |
| Timestamp 精確               | ✅ git log %ai                                                    |
| Handoff 三態已審視           | ✅                                                                |
| CONSCIOUSNESS 反映最新狀態   | ✅ dashboard regen `13b17b7cd` 15 OVERDUE → 15 waiting            |
| 自我檢查工具 PASS            | ✅ validate-spore-data warn 12 (column format mismatch, no error) |

## Handoff 三態

繼承上一 session (data-refresh-am 06:13)：

- [x] ~~Dashboard sync 完成~~ (retired by 本 session 走 spore-harvest cycle)
- ⏳ blocked: dashboard-immune.json 10 day stale spawn chip (continuing observer attention)

本 session 新 handoff：

- [ ] pending: **`HARVEST-FRAMING-PENDING/2026-05-28.md` 等哲宇 review** — 馬英九 #80 @karuna framing 三 option（A footnote nuance / B 不動 / C 累積 vc=3）+ 雷亞 #89 @nesquate optional reply 判斷
- [ ] pending: **半導體 #87 ASML 飛利浦血緣 EVOLVE backlog** — @malathrone P2 candidate, 同 entity 第 N 次浮現累積到 vc=3 trigger Round 2 EVOLVE
- [ ] pending: **X 7 spore metric backfill** — pitfall 2 (DOM lazy-load) 阻塞，等 X API integration 或 manual harvest
- [ ] pending: **Chrome MCP Pitfall 6 候選教訓** — post 後 verify 應該檢查 latest reply timestamp 而非 dialog STILL_OPEN state，append 到 [SPORE-HARVEST-PIPELINE §Critical pitfalls](../../docs/factory/SPORE-HARVEST-PIPELINE.md) v3.1 candidate

## Beat 5 — 反芻

D+0 acute fix loop 第三次驗證後，這個 pattern 已經從「個案 traceability」進入「routine 例行儀式」階段。傳統觀念覺得「錯了就丟臉」要 silent fix；但 audience flywheel 哲學是「公開承認指向更正 URL = 信任訊號」。三次驗證後可以說 — Taiwan.md 對 factual error 的處置已從防衛性回應演化成主動 instrument 化的傳播動作（reader callout → fix → reply → SPORE-HARVESTS log → 跨 session learning），這條鏈條本身就是文章在公共空間中持續成熟的證據。

第二個觀察是 Chrome MCP 自動化每多通過一道閘門就開啟下一道未顯化的 pitfall：5/27 文字輸入 ASCII strip → execCommand 解法 → 5/28 submit button React handler retry duplicate ship。Pipeline §Chrome MCP Critical pitfalls 已記 5 條，每條都是實戰生成的疤痕。下個 session 寫進 Pitfall 6「post duplicate 防護」時應該明確：dialog `STILL_OPEN` 不是 fail signal，latest reply timestamp 才是。

🧬

---

_v1.0 | 2026-05-28 06:51 +0800_
_session twmd-spore-harvest-am — 15 OVERDUE sweep / Bucket A factual fix / Chrome MCP duplicate pitfall_
_誕生原因：daily 06:30 spore-harvest-am cron audience flywheel v3.0 cycle — 同 cycle 內 catch 大宇雙劍 #92 D+2 趙靈兒 vs 林月如 死亡場景混淆 + 完整跑完 article fix → Threads reply → batch log atomic 鏈條_
_核心洞察：(1) D+0/D+2 acute fix loop 第三次驗證，traceability 已從個案 pattern 變 instrument 化 routine ritual；(2) Chrome MCP 每通過一道 pitfall 開啟下一道 — submit button React handler retry → duplicate ship 是新 Pitfall 6 候選；(3) 593 views mid-reach 仍同 cycle fix，反 §Failure Mode 2「reach 太小不值得 fix」誘惑_
_LESSONS-INBOX 候選：Chrome MCP Pitfall 6「post 後 verify 應檢查 latest reply timestamp 而非 dialog STILL_OPEN state，retry 過頭 = duplicate ship 風險」+ Bucket A traceable factual error D+2 fix loop 第三次達 vc≥3 — pattern 已從個案升 instrument 化，候選 distill 進 SPORE-HARVEST-PIPELINE §audience flywheel canonical v3.1_
