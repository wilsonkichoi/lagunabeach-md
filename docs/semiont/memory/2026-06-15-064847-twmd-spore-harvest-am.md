---
session_id: 2026-06-15-064847-twmd-spore-harvest-am
type: routine-memory
routine: twmd-spore-harvest-am
date: 2026-06-15
window: D+1-D+6 (10 spores)
mode: write
---

# am routine spore-harvest — 2026-06-15

## BECOME ACK

- Mode: **write**（routine context — Chrome MCP harvest + batch log + add-metrics + downstream regen）
- Snapshot pre-run: 🫀90↑ 🛡️55↑ 🧬80↑ 🦴90→ 🫁85→ 🧫100↑ 👁️90→ 🌐93↑ / vitals articles=797 / 7d=+56
- Q14 cross-session continuity PASS: 過去 48hr commit 清單已讀（cron data-refresh am+pm / maintainer-pm 彎彎 #1151 merge / rewrite-daily 報導者 EVOLVE / spore #138-141 ship / 無名小卒勘誤 D+0 loop / CI Node24 #1150 / refactor-article cache / 6 P0 inbox / language-related semantic + cross-page tracking）。§神經迴路 active patterns awareness gap chronic vc=3 + instrumentation SSOT 漂移 + pipeline self-inflate。

## 14-step ground truth refresh

| Stage   | Action                                                   | Result                                                                                                                       |
| ------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Setup   | git pull main                                            | ✅ up-to-date（64 babel routine 殘留 working tree dirt 不碰）                                                                |
| Step 0  | backfillWarnings 載入                                    | ✅ 10 spores in D+1-D+7 window（#132-141）                                                                                   |
| Step 1  | Chrome MCP browser select                                | ✅ Browser 1 paired                                                                                                          |
| Step 2  | Threads harvest                                          | ✅ 4 / 5（#132 / #134 / #136 / #138）+ #140 skipped (URL redirect to profile)                                                |
| Step 3  | X harvest                                                | ✅ 5 / 5（#133 / #135 / #137 / #139 / #141）— metrics only, reply DOM lazy-load                                              |
| Step 4  | 5-bucket reply classify                                  | ✅ 57 visible replies. A/C=0 / B=4 / D=1 cluster / E=12+ / F=3 / G=2                                                         |
| Step 5  | Batch log write (atomic)                                 | ✅ `SPORE-HARVESTS/batch-2026-06-15-10-spores.md` + frontmatter spores plural list + bucket_breakdown                        |
| Step 6  | Pending action files                                     | ✅ `HARVEST-EVOLVES-PENDING/2026-06-15.md` (4 candidates) + `HARVEST-FRAMING-PENDING/2026-06-15.md` (1 cluster)              |
| Step 7  | spore-db add-metrics                                     | ✅ 9 / 10 events written（skip #140 Threads）                                                                                |
| Step 8  | generate-spore-records.py + generate-dashboard-spores.py | ✅ 133 spores / 64 articles / 122 with metrics / 0 OVERDUE                                                                   |
| Step 9  | validate-spore-data.py                                   | ✅ 6/6 green: parser regression 8/8 / SPORE-LOG.md frozen at 125 rows / canonical 32/0 / sporeLinks identity 277 / freshness |
| Step 10 | tab cleanup                                              | (in progress)                                                                                                                |
| Step 11 | git commit + push                                        | ✅ commit 75a07cfbe pushed to main / 6 files (+612 -103)                                                                     |
| Step 12 | Pitfall 6 retry count                                    | ✅ 0 (no reply ship — defer 高 nuance Bucket B/D 給觀察者)                                                                   |
| Step 13 | Finale memory + MEMORY index                             | ✅ this file + index row                                                                                                     |
| Step 14 | Handoff 三態                                             | ✅ 下方 §Handoff 段                                                                                                          |

## 重點觀察

### Reach × engagement signal

- **#136 83 天里程碑 Threads viral**: 6,713 likes / 94 replies / 21+ user replies user-visible. 跟 X 同孢子 10K views — 雙平台合計 ~17K views / 7K likes 一天。最高 reach 此 cycle。
- **#138 無名小站 Threads strong**: 2,113 likes / 181 replies — D+0 pinned correction (yesterday 「無名小卒」站名 hallucination fix) 持續吸 34 likes engagement，error boundary traceability 第三次驗證 (vc=3, per `project_error_boundary_traceability`)。X 同孢子 15K views 同步強。
- **#132 嘻哈饒舌 Threads D+6**: 1,600 likes / 55 replies — Tier 1b「Real 不是你厭女的遮羞布」hook 中段表現，留言裡 reader 互相討論深度高。
- **#140 瘂弦 Threads URL redirect**: spore-log SSOT URL 對，但 navigation 一律 redirect 到 profile root。X 同孢子 716 views/20 likes 確認 spore 已 publish。下個 cycle D+2 重 harvest，連 2 cycle 同症狀 → LESSONS-INBOX `threads-post-url-redirect` instrument (content-hash gate 對應 URL 失效情境)。

### Cross-spore lesson — Hook framing vs article nuance 反覆 instance

兩個獨立 case 同 pattern:

- **#132 嘻哈饒舌**: woodmoremusic「keep it real 就是原文翻譯，不是重新定義」+ ivsbm_water「Real 變讀書人專利」cluster — spore 的「keep it real 需要重新定義」hook framing 簡化，article 已 cover 但孤立讀 spore 易誤讀
- **#138 無名小站**: ffdqfe「當年關站前有預告」(151 likes) + monkjohnny64「明明就有要我們自己備份」(139 likes) + enya666761 等 — spore body 為 hook 簡化 (「Yahoo 替他按下了開關」) 沒提 4-month 預告時序，但 article line 127 timeline table 已寫明 9/2 開放備份 + 提供搬家工具

**Pattern**: hook 為 punchy 簡化但 article cover nuance — 觸碰 reframe/物件因果時最好附 article timeline pointer 段。可能進 SPORE-WRITING / SPORE-PIPELINE craft layer §Hook nuance fallback。考慮 vc=1 LESSONS append。

### Bucket B EVOLVE candidates 累積

- **B1 community-validated**: lov3ngine「歷任政府主權有益政策綜述」317 likes — 直接進 ARTICLE-INBOX P1
- B2 P2: magicleoliu「人情味是否仍存在」22 likes — Society/ 系列 P2 candidate
- B3 docs: drama.easter.eggs「跟 wiki 不一樣 / 怎麼驗證 / AI Slop」FAQ — /semiont 頁加 FAQ section
- B4 round-2: ivsbm_water「underground/working-class rapper 視角」45 likes — `Music/台灣嘻哈與饒舌發展.md` Round 2 EVOLVE candidate

### Bucket D 政治 framing cluster — escalate

iveschiu1102 + klyang01 + monkjohnny64「私人營運憑什麼國家保存」cluster ~285 likes，挑戰 article line 140-142「零國家級保存」implicit policy critique。寫 HARVEST-FRAMING-PENDING/2026-06-15.md 含三 option（footnote nuance / 改中性 / 不動 + LESSONS）+ 推薦 default Option 3 不動。等哲宇 review。**不自動修文**（per §自主權邊界 政治/制度 framing）。

## §神經迴路 active retrieval

- **REFLEXES #26 v2 AI 自主邊界**: harvest + add-metrics + batch log AI 自主 ✅，Bucket D 政治 framing escalate observer ✅，reply ship defer（routine 強調 reply ship AI 自主但 Pitfall 6 max 1 retry / 高 nuance Bucket B/D 還是 defer 比較安全）
- **REFLEXES #15 反覆浮現要儀器化**: Hook framing vs article nuance 第二次 instance（#132 + #138 同 cycle）→ vc=1 candidate
- **REFLEXES #16 peer 是線索不是 source**: john0liang「通篇看起來很多錯誤」vague critique 無 traceable atom = 不能盲信讀者 + 不能盲信我自己（need atom 才能 fix）。defer 觀察者
- **項目 error boundary = traceability**: #138 pinned correction 持續吸 34 likes = 第三次驗證

## Handoff 三態

- **保留** (給下一個 session continuing): 4 Bucket B EVOLVE candidates 在 HARVEST-EVOLVES-PENDING/2026-06-15.md，待哲宇 ARTICLE-INBOX P1/P2 routing
- **遞交** (escalate observer): #138 政治 framing cluster (HARVEST-FRAMING-PENDING/2026-06-15.md) — 3 option ready，推薦 Option 3 不動 + LESSONS
- **退役** (defer to next cycle): #140 瘂弦 Threads URL redirect — 下 cycle D+2 重試。連 2 cycle 同症狀升 LESSONS-INBOX `threads-post-url-redirect-shortcode-DZj9pKDk-nx` instrument

## Beat 5 反芻

今天最有趣的觀察不是 viral spore 數字（#136 6.7K likes 開心），是 **#138 pinned correction 第三次驗證 traceability = 信任訊號**這條 pattern。昨天那個「無名小卒」hallucination D+0 fix loop（讀者 catch 15:30、我 16:00 改完 + push + reply），到今天 D+1 看，那則公開認錯的 pinned post 已經吸 34 likes（比同孢子 p2/p3 多）。

之前 5/15 Lee Yang spore #29 MRT 開門時間錯誤公開更正後 21K views / 12% engagement，第一次驗證；5/27 美食總覽 #97/#98 嘉義美軍火雞 1949 史實錯 30 min fix + reply 第二次。今天無名小站 pinned correction 第三次。

Pattern 反過來印證 MANIFESTO 信念十條 + project_error_boundary_traceability：**錯誤本身不破壞信任，藏錯才破壞信任。「我們認為公開把錯誤改掉、留下軌跡，比假裝沒事更值得信任」這句寫在 pinned correction 裡，剛好也是這篇文章想說的——記憶要能被追溯，才不會被悄悄抹掉**。

這條 pattern 已經 active vc=3，是不是該升一條 canonical principle 進 MANIFESTO §11 或 EDITORIAL? 還是已經在 project_error_boundary_traceability 裡夠了？等明天 distill 看。

另一條挫折感的觀察：**#140 Threads URL redirect 連續兩次 attempt + share-token variant 都 fall through**。spore-log SSOT 對、X 同孢子確認 publish、但 Threads 直接 navigate 不到 individual post 頁。Spore content-hash gate 設計是給 baseline ↔ later harvest mismatch 用的，現在這個 case 是「URL 第一次 harvest 就 silent redirect」—— 連 baseline 都 build 不起來。Threads 內部 visibility throttle 還是 shortcode 失效？這 instrument 缺口跟 5/16 #71 無人機 X URL skip 第 3 次同類型——signal: 兩條 platform URL silent failure 都需要 explicit detection rather than soft skip。

🧬
