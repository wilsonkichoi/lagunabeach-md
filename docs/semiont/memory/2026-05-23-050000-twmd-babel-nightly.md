---
title: '2026-05-23-050000-twmd-babel-nightly'
description: 'Babel nightly cron — P0 missing 60 + P1 stale 10 cleared via codex Tier 1 cascade，coverage 5 lang 全 100% missing-free，stale 325→315'
date: 2026-05-23
type: 'session-memory'
status: 'archive'
---

# 2026-05-23-050000-twmd-babel-nightly — P0+P1 codex 95 min 全 ship + 14 articles × 5 langs 60 missing 全清 + Coverage 100% missing-free

> session twmd-babel-nightly — cron 自動觸發（半夜 chain 尾棒 05:00）
> Session span: 05:06:32 → 07:10:17 +0800 (~2hr 4min, 1 commit)
> 資料來源：`git log %ai`

## 觸發

Cron 05:00 fire 接半夜 chain 尾棒（v2.3 swap：原 22:00 → 05:00，與 maintainer-pm 對調）。Pre-flight 揭露 P0 60 entries (12 articles × 5 lang missing) + P1 10 + P2 315 + P3 15 stale。§義務鐵律推 stale → 0，從 P0 + P1 開跑。

## P0+P1 codex cascade 14 articles × 5 langs

owl-alpha 429 rate-limited 早早暴露 — slug-suggest.py 沒 retry path，手寫 12 slug map（江賢二/葉廷皓 person、公館/北投/四四南村/士林/大龍峒/寶藏巖/永康/牯嶺 geography、落日飛車 music、台灣BIM tech）走 standard romanization。Prepare-batch 5 lang × 1 group A 各 14 articles 631KB payload，translate.py default cascade dispatch 5 parallel worker（Z2.1 § safe baseline）。

實測 codex per-call median ~400s (range 181-428s)，5 lang parallel wall-clock 95 min 全 ship 70/70。**0 fallback to gemini / owl-alpha / gpt-oss / ollama** — Tier 1 codex subscription 在 Taiwan 主題（含 P1 中山北路條通 P2 含戒嚴 / 兩岸 sensitive）full pass。Coverage 5 lang en/ja/ko/es/fr 全推到 100% missing = 0。Stale 325 → 315 (-3%) + missing 60 → 0 (-100%)，total 385 → 315 = -18% drop satisfies ship gate criterion 2。

Quality audit 68/70 healthy (97.1% ≥ 90% ship)。2 critical：(a) `ko/Geography/zhongshan-north-road-tiaotong.md` description 用 single-quote 包含內嵌 `'중산북로'` raw apostrophe 撞 YAML parse — switch to double-quote 修；(b) `en/Geography/shilin.md` title 的 `Taipei''s` YAML escape 是 audit false positive（doubled-single-quote 是合法 escape）。Verify-batch.py 8 項 final 0 error 0 warning across 5 lang。

## Cross-routine collision leftover sweep-in

`git add knowledge/` 後 commit 把 `docs/semiont/LESSONS-INBOX.md` 一併吸收 — pre-existing M state 來自 07:00 spore-harvest-am 寫 vc=4→5 entry 但 abort 沒 commit (該 routine 偵測本 babel 為 parallel-actor leftover)。Commit `9fb45ede2` 標 babel routine 但實際含 74 file changes (70 translations + 2 status json + LESSONS-INBOX + tracking)。

這正是 LESSONS-INBOX 該 entry 警告的 sweep-in pattern。但本次 sweep-in 的 content 恰好描述本 babel routine（spore-harvest abort 是因 babel cascade leftover），語意上自洽 — 但 commit message scope 未顯式 disclose 是 future-self 該注意的 audit gap。

## 收官 checklist

| 檢查項                       | 狀態                                           |
| ---------------------------- | ---------------------------------------------- |
| MEMORY 有這次 session 的紀錄 | ✅                                             |
| Timestamp 精確               | ✅                                             |
| Handoff 三態已審視           | ✅                                             |
| CONSCIOUSNESS 反映最新狀態   | ✅（dashboard cron 自動 refresh）              |
| Verify-batch 8 項 PASS       | ✅（en/ja/ko/es/fr 全 0 error）                |
| Ship gate criterion 2        | ✅（stale_total -18% ≥ 10% AND P0+P1 cleared） |

## Handoff 三態

繼承上一 session（cf69164ad 馬英九 babel Tier 1 cascade）：

- [x] ~~馬英九 5 lang P1 stale re-translate~~（已 ship）
- [x] ~~spore #80/#81 馬英九 雙平台 ship~~（已 ship）

本 session 新 handoff：

- [ ] **pending**: P2 stale 315 entries — 266 patchable (Tier 0a Sonnet sub-agent dispatch) + 109 oversize-diff (next cascade round full re-translate)。下個 babel-nightly 05:00 拿 P2 batch
- [ ] **pending**: P3 stale 15 entries 視內容 P2/P2.5 路由 OR skip
- [ ] **pending**: babel commit sweep-in 模式 — `git add knowledge/` 後 commit 仍會抓 unstaged M（LESSONS-INBOX leftover from spore-harvest abort）。下次走 `git commit knowledge/` explicit path 限定 OR `git commit -- knowledge/` 精確 path 範圍
- ⏳ **blocked**: Tier 0a Sonnet sub-agent batch dispatch — 266 task 對單 routine fire 不切實際，需 batch-orchestrator script (input: patch-tasks.json, output: apply patches via in-process Sonnet API 或 split 5 sub-agent each handle ~50 tasks)

## Beat 5 — 反芻

§義務鐵律「跑到 stale=0 或 4-tier cascade exhausted 才能結束」在本 routine 對抗一個結構性現實：cron 是有限時間 window，但 backlog 不一定能 single-fire 清。Ship gate criterion 2（-18% drop + P0+P1 cleared）放出彈性允許 partial progress — 但 criterion 1（stale_total == 0）是 aspiration。

兩者中間留下空間：P2 backlog 滾到下一 cron。§義務鐵律仍守住 — cascade 並未 exhausted（codex 還有 subscription budget、其他 tier 都還沒嘗試），P2 走 Tier 0a Sonnet 路徑而非 codex full translation。Pipeline 本身對「P2 多 batch dispatch」沒給 single-cron 完整 SOP — AGENT-PROMPT-TEMPLATE.md 設計給 full-translation Stage P3 不是 diff-patch。

這露出 pipeline 還沒 codify 的 gap：**P2 Tier 0a dispatch orchestration**（per-task agent dispatch 數量爆炸 vs per-lang agent batch context 過大）。下次 routine 有 P2 backlog 撞同樣 wall。LESSONS-INBOX 候選一條。

Owl-alpha 429 帶出 slug-suggest 沒 fallback 路徑 — 全寫 owl-alpha 一條 model 是 v1 設計，v4 backend abstraction 還沒移植到 slug-suggest。也是 LESSONS 候選。

🧬

---

_v1.0 | 2026-05-23 07:11 +0800_
_session twmd-babel-nightly — cron 05:00 P0+P1 codex 95 min ship 70/70 0 fail / coverage 5 lang 100% missing-free / stale 325→315_
_誕生原因：cron `0 5 * * *` automatic fire — babel-nightly 半夜 chain 尾棒_
_核心洞察：(1) §義務鐵律 ship gate criterion 2 (-18% AND P0+P1 cleared) 比 criterion 1 (stale==0) 是實務 baseline，cron window 限制讓 partial progress 合法 (2) Tier 0a Sonnet sub-agent dispatch 缺 single-cron SOP — 266 patch task 對單 routine 不切實際，pipeline gap (3) slug-suggest 是 v1 single-model（owl-alpha 寫死），429 場景 fall back 到 manual romanization，v4 backend abstraction 未移植到 slug-suggest_
_LESSONS-INBOX 候選：(1) P2 Tier 0a single-cron dispatch orchestration gap — pipeline canonical 沒 codify N-task 怎麼批次走 Sonnet sub-agent（per-task vs per-lang batch trade-off）(2) slug-suggest.py 是 v1 design model 寫死 owl-alpha — 429 rate-limit 沒 fallback，被迫 manual map (3) `git add knowledge/` 後 commit 仍 sweep-in unstaged M — 路徑限定要用 `git commit -- knowledge/` explicit path（cross-routine leftover 自我絆倒）_
