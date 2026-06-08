---
title: '2026-06-09 twmd-spore-harvest-am'
description: 'Recovery cycle after 3+1 cycle gap — 12 Threads harvest / #115 颱風 D+5 Bucket A factual in-cycle fix / Pitfall 7 candidate (Threads UI changed → reply ship abort per Pitfall 6 hard rule)'
session_id: '2026-06-09-063000-twmd-spore-harvest-am'
date: 2026-06-09
type: 'routine-memory'
status: 'final'
routine: 'twmd-spore-harvest-am'
quality_gate: 'pass-with-pitfall-7-surface'
chrome_mcp_status: 'available'
spores_harvested: 12
overdue_swept: 4
active_swept: 8
x_skipped: 11
factual_fixes: 1
ships_attempted: 1
ships_succeeded: 0
ships_aborted: 1
ships_duplicate: 0
pitfall6_retry_count: 0
pitfall7_candidate: true
replies_drafted_not_shipped: 2
---

# 2026-06-09 twmd-spore-harvest-am — Recovery cycle / #115 颱風 Bucket A in-cycle fix / Pitfall 7 surface

## BECOME ACK

- mode = write (per scheduled-task STRICT BECOME GATE — BECOME_TAIWANMD.md §Step 0-9 walked)
- 8 organ snapshot via consciousness-snapshot.sh: 🫀90↑ 🛡️27→ 🧬95↑ 🦴90→ 🫁85→ 🧫100↑ 👁️90→ 🌐93↑
- Q14 cross-session continuity: PASS — 48hr git log 跨日完整 chain (詳見 batch log §BECOME ACK)
- §神經迴路 active patterns: Inline > pointer (5/28) / Pitfall 6 timestamp diff (5/28) / Catch ≠ Fix (6/09)
- pipeline gate: BECOME write 9 self-test all green / Chrome MCP recovery vs 3-cycle outage

## Stage 1: Setup

```
cd /Users/cheyuwu/Projects/taiwan-md
git checkout main && git pull origin main
# HEAD before = 6ac1158a9 (6/09 06:18 data-refresh-am memory)
```

## Stage 2: Recovery cycle context

**勘 cron timeline**:

- 6/05 spore-harvest am: Chrome MCP unavailable cycle 1 (silent abort)
- 6/06 spore-harvest am: Chrome MCP unavailable cycle 2 (LESSONS entry vc=2)
- 6/07 spore-harvest am: Chrome MCP unavailable cycle 3 (escalation step 3 / pause→哲宇)
- 6/08: cron mass-skip 整日無 fire (per maintainer-pm memory §觀察 routine 24hr 1 fire only)
- **6/09 (本 cycle)**: Chrome MCP browser-1 paired ✅ → 5-cycle backfill batch

**Dashboard backfillWarnings load**: 15 entries (4 Threads OVERDUE + 11 X OVERDUE)。
**HarvestStatus active window load**: 8 Threads spores D+2-D+6 全 harvestCount=0。

→ Total scope: 12 Threads to harvest + 11 X to skip per Pitfall 2.

## Stage 2: 12-spore Chrome MCP sweep — completed

詳見 batch log [`docs/factory/SPORE-HARVESTS/batch-2026-06-09-12-spores.md`](../../factory/SPORE-HARVESTS/batch-2026-06-09-12-spores.md):

| Tier            | Count | Result                                                                                                                                                                                                     |
| --------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OVERDUE D+12-13 | 4     | All silent vs 6/04 baseline — D+13 long-tail confirmation                                                                                                                                                  |
| Active D+2-6    | 8     | 20 net-new reader replies surfaced — #124 OO人 12 (peak engagement) / #126 國宅 3 (Bucket F) / **#115 颱風 2 Bucket A** / #117 OCF 1 (E) / #122 太空 1 (E) / #128 黃山料 0 / #120 中華台北 0 / #113 天燈 0 |
| X full-skip     | 11    | per Pitfall 2 (X conversation lazy-load 不支援 reply via Chrome MCP)                                                                                                                                       |

## Stage 3-4: 5-Bucket classifier + audience flywheel

**Bucket breakdown**: A=2 / B=2 / C=0 / D=0 / E=3 / F=6 / G=0

### #115 颱風 D+5 — Bucket A acute fix loop (full closure of fact-fix layer)

**Reader callouts**:

1. **@playing_around_1**: 阿里山 1094.5 mm 比喻台北「全年」誇大 — Taipei annual ~2400 mm (CWA 1981-2010 normal) → 1094.5 mm 是「將近半年」不是「全年」
2. **@weatherun_ccj**: DOTSTAR Astra SPX 43,000 ft 從颱風頭頂繞外圍丟投落送，沒「飛進颱風眼」(US Hurricane Hunters 才是)

**Verification (per RESEARCH §六 + WebSearch + WebFetch 維基百科)**:

- WeatherSpark + CWA monthly 加總：Taipei annual 1497-2400 mm range，**reader 對**
- DOTSTAR 維基「直接飛到颱風周圍 43000 英呎的高度投擲投落送」，**reader 對**

**Article fix (`knowledge/Nature/颱風.md`)** — 4 edits, commit `108cbe808`:

- Line 81: 「相當於台北市的『全年』降雨量」→「相當於台北市將近半年的降雨量」
- Line 125 subheading: 「從颱風眼裡飛回來的台灣」→「在颱風頭頂四萬英呎丟下投落送的台灣」
- Line 129: 加入「團隊用 Astra SPX 雙引擎噴射機飛上 43,000 英呎，從颱風頭頂繞著外圍投擲投落送...（這跟美國 Hurricane Hunters 用螺旋槳機穿越眼牆的玩法不一樣）」
- Line 131 lead-in: 校準「吳俊傑用第一人稱描述他童年在臺東地面迎送颱風眼通過的感受（不是從飛機上）」

**Reply drafts** (per pipeline §Bucket A SOP — 認錯第一句 + 具體 anchor + URL percent-encoded + 🧬 signature):

- @playing_around_1 (138 chars): 完整文本 in batch log §#115 deep-dive
- @weatherun_ccj (~170 chars): 完整文本 in batch log §#115 deep-dive

**Ship: ABORTED per Pitfall 6 hard rule** — see §Pitfall 7 candidate.

### #124 我是OO人 D+4 — high-engagement reader cluster

12 net-new replies / 72 likes / 13 comments on main post:

- 1 Bucket B EVOLVE candidate: @killmonster53「新聞來源不止中時系統」— logged backlog
- 多 Bucket F (interpretation alignment, ignore default)
- 1 Bucket E amplify: @ku_17_10 (36 likes, optional reply skipped per pipeline)
- 0 Bucket D framing 質疑（政治敏感主題 surprise — reader 對 article framing 無 stance 質疑）

### Other E/F replies

- #117 OCF @tsukiyo_012 / #122 太空 @indiefortw / #126 國宅 (3 Bucket F all): default ignore / optional reply skipped 本 cycle

## §Pitfall 7 candidate: Threads UI semantic shift — 建立 button collision

**5/28 Pitfall 6 鐵律** instrumentation 救了一次 silent silent triple-ship。今天 ship reply to @playing_around_1 走流程:

1. Navigate spore → click 回覆 SVG button on reader container ✅
2. Navigate to reply detail page (placeholder「回覆playing_around_1……」確認 ✅)
3. `execCommand('insertText', false, txt)` → DOM editable.innerText = 138 chars ✅
4. `find` tool returns ref_124 button「建立」(label)
5. Click ref_124 →「新串文 create thread」modal 開啟 (NOT publish-reply)
6. **Per Pitfall 6 hard rule max 1 retry**: abort

**根因**: Threads UI changed 後 reply detail page publish flow 不再是 click「發佈」button。可能 path:

- Real publish button hidden behind editable focus + text threshold
- Cmd+Enter keyboard shortcut (not tested)
- aria-label query (not text label, i18n locale 影響)
- `find` tool 對 reply context 把 sidebar「新串文」誤識為 publish button

**對應 SPORE-HARVEST-PIPELINE §Chrome MCP Technical Pattern Step 8**: 原 SOP「Click 發佈 button via JS」假設 button text === '發佈'，不適用「建立」label collision。

**§自主權邊界 對位**: ship 阻斷 = 對外溝通失敗，但 article fix 已 ship（內部寫作層）。**兩層分離**: article 寫作層內部可自主 fix，reply 對外發佈層依賴外部 UI compatibility — Pitfall 7 surface 後 abort 屬 healthy hard gate。

**5/28 「儀器化也會 over-engineer」反向 instance**: 今天「分層讓 abort 不傷主流程」是健康 instrument 範例。Pitfall 6 cache state ground truth → Pitfall 7 button label semantic ground truth：兩條都是「stale signal 不可信，對外可見效果（container count diff）才是 ground truth」精神延伸。

## Stage 5: Atomic batch log commit

```
108cbe808 2026-06-09 06:57:45 +0800 🧬 [routine] twmd-spore-harvest: 12 Threads recovery + #115 颱風 in-cycle fact-fix — 2026-06-09
```

2 files changed, 259 insertions, 4 deletions:

- `knowledge/Nature/颱風.md` — 4 edits per #115 Bucket A
- `docs/factory/SPORE-HARVESTS/batch-2026-06-09-12-spores.md` — atomic batch log

Pre-commit gates all pass:

- prettier ✅
- quality-scan 颱風.md: hard=0, warn=14 (prose-health 破折號 14 個 pre-existing + 1 new from line 81 fix), info=6
- frontmatter-validation ✅
- narrative scope warning (content-ssot + pipelines) — expected cross-domain for routine commit, not blocking

## Handoff 三態

### Pending（觀察者 directive / 下個 manual session）

- [ ] **🚨 Pitfall 7 manual ship**: 2 replies drafted 待 manual ship — @playing_around_1 + @weatherun_ccj (#115 颱風 spore)。Reply 完整文本 in batch log §#115 deep-dive Reply drafted section
- [ ] **🚨 Pitfall 7 pipeline instrument**: SPORE-HARVEST-PIPELINE §Chrome MCP Technical Pattern §Step 8 + §Critical pitfalls 需 expand — Pitfall 7 「Threads UI semantic shift — button label collision」. 三條 fallback path 待 dogfood (Cmd+Enter / aria-label query / text threshold 觸發 button render). LESSONS-INBOX entry candidate.
- [ ] **#124 我是OO人 Bucket B EVOLVE candidate**: @killmonster53「新聞來源不止中時系統」— 單條 EVOLVE backlog (< 3 同題材閾值)
- [ ] **#97 美食總覽 Bucket B EVOLVE 升級**: D+13 連 5 cycle silent，已 logged 3 條 (chengleco / zheng_xianyang / el07fb02) 從 6/03-6/04 batch — 達 D+7 SOP 升 Round 2 EVOLVE 閾值，handoff retain。
- [ ] **snapshot.sh stale gap (🛡️ 27 vs fresh 60)**: chronic — handoff retain per 6/09 data-refresh-am
- [ ] **sovereignty backbone catch-up**: babel-nightly handoff fr 5 missing 待下次 cycle 收 (非本 routine scope)

### Blocked（等外部）

- 無

### Retired

- 🟢 **Chrome MCP unavailable 3-cycle pause** (6/05-6/07 escalation step 3 / pause→哲宇): Chrome MCP browser-1 today restored, recovery cycle done. pause decision option (a/b/c) 仍 pending 但今天證明 device dependency 是 intermittent 非 permanent。Option (c) telegram-poke-then-fire 仍 sound design 候選但本 routine 自然 recover so deprioritize。
- 🟢 **6/08 整日 cron skip**: 本 routine 已 fire today，前一個 SKIP cycle 由今天的 catch-up batch 接住

## Beat 5 — 反芻

**今天最有 weight 的觀察**：

**1. Pipeline §Decision Gate D+4-D+7「修文 + reply（無 deadline pressure）」原 SOP 假設兩層 ship 一起完成**

今天碰到 Threads UI changed → Reply ship 阻斷。**Article fix 可獨立完成**（內部寫作層，AI 自主），**reply ship 需外部 UI compatibility**（外部對外層）。兩層分離後，article fix 還是 D+5 acute 30 min 內 ship（confirm/timestamp = 06:00-06:30 callout 發現 → 06:57 ship），但 reply ship 走 Pitfall 7 abort，**不傷主要 traceability loop**（commit 已含 article fix + commit message 公開承認 + git log + reply drafts in batch log）。讀者重新 visit spore → article URL 連到正確內容；但讀者單看 reply 留言 → 不會看到我們的承認。**Trade-off**：article-layer ack 完成，reader-personal ack 暫停。比 silent silent retry triple-ship 強。對位 5/28 「儀器化也會 over-engineer」反向 instance：今天「分層讓 abort 不傷主流程」是健康 instrument 範例。

**2. Pitfall 6 hard rule 救了一次 silent silent triple-ship**

`find` tool 把 sidebar「新串文」誤識為 inline publish button。Click 開了 new-thread modal。若按舊 retry pattern 會繼續嘗試 → 第三次「新串文」會真的 post 出一條 top-level 新 thread（不是 reply）= 跨 spore duplicate noise。**Pitfall 6「max 1 retry」鐵律在 UI semantic shift 場景下精準防住**。5/28 Pitfall 6 是「對 publish-success cache state 不可信」，今天 expand 為「對 button label semantic 不可信」。兩條都是「cache / label state 是 stale signal，container count + 對外可見效果才是 ground truth」精神延伸。

**3. Sovereignty backbone vs Pitfall 7 dual layer**

今天 babel-nightly Ollama Tier 4 唯一活路（per 06:00 commit message）跟今 cycle Threads ship abort 都是「外部依賴的 fragility surface」。一個在翻譯層（cloud LLM PRC refusal），一個在發佈層（Threads UI shift）。Per CLAUDE.md §Sovereignty preservation 視角：**外部依賴的失敗不一定是 bug，是設計需要的 surface**。Tier 4 Ollama 接得住翻譯，本 routine 把 reply ship abort 寫進 handoff 給 observer = 對外發佈層的 Tier 4 接住點。「儀器化 fail-stop」比「silent fall-through」更 sovereignty-aware。

**4. 5 cycle backfill 是「healthy not bug」**

12 Threads spore 全 harvest + 1 article fix + 2 reply drafted + 1 Pitfall 7 surface = 一個 cycle 補回 5 cycle entropy。CLAUDE.md §routine 飛輪「不在 session 時自動轉動清 entropy」這條今天活體 instance — 飛輪不是「每天都要做完」，是「累積到一定壓力後 catch-up batch 一次清掉 + surface 結構性 finding」。對 Tier 2 device-dependent routine 特別重要：6/04→6/09 五天 gap 不是「routine 失效」，是「device-dependent routine 在 observer absent 時 by-design idle，回來時做 deeper sweep」。對位 6/07 routine memory 寫的 Tier 2 routine fragility 觀察 — 今天 confirm 該觀察 + 新增「recovery cycle 比 daily cadence 更 efficient discover structural pattern」這條反 entropy 數據點。

🧬

---

_Cycle stats_:

- duration: ~28 min (06:30 BECOME → 06:58 commit push)
- commits: 1 (108cbe808 batch log + #115 颱風 fact-fix)
- spores harvested: 12 (4 OVERDUE + 8 active) / 11 X skip
- reader replies surfaced: 20 (5 bucket classified — A=2, B=2, E=3, F=6)
- article fixes in-cycle: 1 (#115 颱風 4 edits — D+5 Bucket A within 30 min discovery-to-ship)
- replies drafted: 2 (not shipped per Pitfall 7 candidate abort)
- ships succeeded: 0 / aborted: 1 / duplicate: 0 / Pitfall 6 retry count: 0 ✅
- §自主權邊界 trigger: 0 (article fix AI 自主 per DNA #26 v2, reply abort = 待 observer)
- §神經迴路 active pattern: Pitfall 6 hard rule vc=1 反向 instance (UI semantic shift saved from triple-ship)
- Pitfall 7 candidate: surfaced — Threads UI changed button label collision, LESSONS-INBOX entry candidate

_Handoff to next spore-harvest cycle (am 06:30)_:

- 監測 Chrome MCP availability (今 cycle 證明 intermittent dependency 真實存在)
- Pitfall 7 fallback path dogfood: 試 Cmd+Enter + aria-label query + button text threshold render
- 若 manual session 之前 fire → check 是否 @playing_around_1 + @weatherun_ccj reply 已被 observer manual ship
- 若仍 stale → 視 D+N (今天 6/09 已 D+5, 下次 cycle 6/10 D+6) 決定 escalate / wait
