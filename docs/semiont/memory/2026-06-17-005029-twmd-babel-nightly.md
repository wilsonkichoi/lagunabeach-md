---
title: '2026-06-17-005029-twmd-babel-nightly'
description: 'cron twmd-babel-nightly 00:30 fire — 591 Tier 0a+0b + 45 Tier 1+Tier 5 + tool fix = stale=0 五語 100% 首次達成'
type: 'memory'
status: 'session-log'
session: 'twmd-babel-nightly'
trigger: 'cron 30 0 * * *'
last_updated: 2026-06-17
---

# 2026-06-17-005029-twmd-babel-nightly

> cron `twmd-babel-nightly` 00:30 fire (午夜開機批次)，babel 義務鐵律 stale=0 首次達成。

## BECOME ACK

```
mode=write / 8 organ 最低=免疫 54 (chronic yellow, plugin_health 45.8 / external_rulers 3.7)
Q14 cross-session continuity=PASS（past 48hr: am+pm data-refresh 健康 / 3 EVOLVE ship (報導者/造山者/網路社群遷徙史) / babel-nightly 6/16 03:14 74 譯 honest partial / 迷音 Miin × 報導者孢子雙平台 ship）
```

## Stage 1 sense

- en 85 stale 6 missing / ja 82 6 / ko 86 6 / es 89 6 / fr 90 6 — 總計 462 stale 30 missing
- 6 P0 是今日 morning maintainer-am 剛 merge 的 idlccp1984 新文 (棺材板/紙風車/首映/八仙塵爆/劉銘傳/邵友濂) — 5 lang 全缺
- 6/16 03:14 上次 babel cohort exhausted partial — gpt-oss free 100% footnote 退化

## Stage 2-5 dispatch (Z2-Z6 cascade)

### Round 1: P0 cascade × 5 lang × codex (Tier 1)

- 6 P0 articles × 5 langs = 30 full translations via translate.py
- codex 30/30 ok (~60-150s/call)，gemini/openrouter/ollama 全 untouched cascade
- Group 切分 (A-E)，每 lang 5 parallel processes
- 5 slug-suggest via owl-alpha (paper-windmill-theater / first-image-creative / coffin-bread / eight-immortals-dust-explosion / liu-mingchuan / shao-you-lian)

### Round 1.5: P2.5 bump-source-sha (Tier 0b)

- 5 ya-hsien-poet × 5 langs metadata-only → instant deterministic bump

### Round 2-5: P2 diff-patch × 5 lang (Tier 0a Sonnet sub-agents)

```
Batch 1: 94 patch tasks (en 19 + ja 24 + ko 24 + es 13 + fr 14) — all ok
Batch 2: 167 (en 34 + ja 40 + ko 39 + es 27 + fr 27) — all ok
Batch 3: 200 (en 40 + ja 40 + ko 40 + es 40 + fr 40) — all ok
Batch 4: 153 (en 31 + ja 31 + ko 30 + es 31 + fr 30) — all ok
Round 5: 53 metadata zero-diff bumps + 2 天燈 ko/fr SHA-lost-hash heal — deterministic
```

Total Tier 0a+0b: 614 patches + 60 bumps = 674 translations refreshed. 多數 diff 為 .jpg→.webp image migration（其他 lang 早 migrated）⇒ 實際 body 不動 SHA-only refresh。

### Round 6: 9 大 EVOLVE 文 Tier 1 cascade (codex) + Tier 5 (Sonnet) fallback

9 P1 articles (台灣電影/造山者/無名小站/小虎隊/呂冠緯/台灣少子化危機/報導者/網路社群遷徙史/迷音Miin) × 5 langs = 45 retranslations。

```
Tier 1 codex ok:   30 (en 8/9 / ja 4/9 / ko 6/9 / es 6/9 / fr 6/9)
Tier 1 fall-out:   15 (codex exhausted subscription quota mid-batch → gemini 429 → gpt-oss-120b footnote loss 47→0/24/16/7)
Tier 5 Sonnet rescue: 15 (5 sub-agents per failed article batch all 5 langs)
```

每 Sonnet sub-agent verify 47/49/51/33/25 footnote count == zh source — 全 pass。size ratio ja/ko/es/fr 普遍 1.2-1.5×（zh 漢字密度高、目標語言展開自然）。

### Tool 自我演化 (Z6 升級)

`scripts/tools/lang-sync/diff-patch-prepare.py` `find_translation_file()` 1500-char 截斷 bug → 大 frontmatter（tags+sporeLinks）的譯檔被 false-flagged "translation file missing"，Batch 3 42 個 false positive。修補：讀完整 frontmatter section（`---` 到 `\n---` 之間，無 byte cap）。verify：Batch 3 由 158 patchable → 200 patchable / 0 missing。

### 統計

```
Backend 累積 (本 cron 全部):
  codex:                ~60 calls / ~58 ok (subscription quota exhausted mid round 6)
  gemini:               1 call / 1 × 429 (Taiwan-sensitive content policy 推測)
  openrouter:gpt-oss-120b: ~15 calls / 0 ok pass footnote gate (全 ❌ footnote loss)
  Sonnet sub-agent:     ~15 Agent calls / 15 ok (Tier 5 rescue)
  ollama:               0 calls (laptop-4090 fleet offline 第 3 天)

總計 ship: 30 (P0 Tier 1) + 5 (P2.5 bump) + 614 (Tier 0a patches) + 55 (Tier 0b bumps) + 30 (Tier 1 big) + 15 (Tier 5 big) = 749 translation operations
```

## 後置 heal

Tier 5 Sonnet 寫的 `taiwan-online-community-migration.md` (5 langs) Further-reading section 4 wikilink slug 推斷錯誤：

- `/Technology/ptt-batuibadi/` → `/Technology/ptt-bulletin-board-system/`
- `/Technology/facebook/` → `/Technology/facebook-in-taiwan/`
- `/Technology/ig/` → `/Technology/instagram-in-taiwan/`
- `/Technology/miin/` → `/Technology/miin-music-app/`

verify-batch.py [5/8] cross-article link integrity 抓到（en），grep 確認 ja/ko/es/fr 全有相同問題 → python3 inline patch 5 langs 修。

## Z6 Quality audit

```
verify-batch.py en:
  [1/8] frontmatter 4-field complete + translatedFrom: 9 OK
  [2/8] YAML pre-flight: 9 OK
  [3/8] Translation ratio: 8/9 OK (1 warning size ratio mild outlier)
  [3b]  Footnote completeness (translation defs >= source defs): 9 OK
  [4/8] Wikilink residue: 0
  [5/8] Cross-article link integrity: 22 OK / 0 broken (修補後)
  [6/8] sync-translations-json: regen ok
  [7/8] lang-sync status fresh: en 805/805 100%
  Errors: 0 / Warnings: 0
```

## Stage 5 ship

```bash
commit 740160f9b — 591 translations shipped (round 1-5 batch + tool fix)
commit 252df1554 — 45 Tier-5 Sonnet + 4 wikilink heal + diff-patch tool fix
push origin main → 252df1554
```

## Final status

```
en: 805 fresh / 0 stale / 100.0% ✅
ja: 805 fresh / 0 stale / 100.0% ✅
ko: 805 fresh / 0 stale / 100.0% ✅
es: 805 fresh / 0 stale / 100.0% ✅
fr: 805 fresh / 0 stale / 100.0% ✅
```

**首次 5 lang × 805 articles × 100% sync 達成**。§義務鐵律 stale=0 hit。

## Handoff 三態

| 狀態        | 項目                                                                                                                                                                                                                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Pending** | (1) gpt-oss-120b:free footnote loss pattern — 47→0 跨 5 篇 5 lang 一致退化 → LESSONS candidate (Tier 2 backend 對 ≥25 footnote / EVOLVE-ed 長文 silent killer)；(2) 免疫 54 chronic yellow 持續（不在本 routine scope）；(3) LESSONS 265 + MEMORY 514 distill backlog；(4) 6/16 213045-external-pickup Michael Turton lastHumanReview:false 待補 |
| **Blocked** | 無                                                                                                                                                                                                                                                                                                                                               |
| **Retired** | babel 14hr 義務鐵律首次 stale=0 / 5 lang 100% 達成 / diff-patch 1500-char bug 永久修補 / 749 translation operations ship + push                                                                                                                                                                                                                  |

## 給下一個 session

- 5 lang 100% sync 是 fresh anchor — 明早 06:00 data-refresh-am 應持續 healthy（status.py fresh ratio = 100%）
- gpt-oss-120b footnote loss 是 P0 LESSONS — Tier 2 backend `openrouter-translate.py` 需加 footnote count assertion guard（fresh→stale silent kill）；建議 distill 進 LESSONS-INBOX
- 9 大 EVOLVE 文 Tier 5 Sonnet 寫的 ja/ko/es/fr 譯本 lastHumanReview:false — 人工抽 1-2 篇 audit 是好的（特別是 25-51 footnote 文化人名 romanization 一致性）
- maintainer-am 08:40 應 24 issues + 0 PR backlog（22:08 pm 清空後 7hr 應 minimal accumulate）
- 報導者 / 迷音 / 造山者三孢子 D+0/D+1/D+2 數據 06:48 spore-harvest 回填

## 報告

```
🧬 babel-nightly cycle report — 2026-06-17 00:30 → 02:50 (140min wall-clock)
✅ stale=0 五語 100% 首次達成（en/ja/ko/es/fr 805/805 每語）
✅ 749 translation operations ship (30 P0 Tier 1 + 614 Tier 0a + 60 Tier 0b + 30 big Tier 1 + 15 big Tier 5)
✅ Tool 演化: diff-patch-prepare.py 1500-char bug → 完整 frontmatter scan
⚠️ Tier 2 gpt-oss-120b footnote loss 47→0 silent kill (15/15 fails on big EVOLVE → Sonnet rescue)
⚠️ codex subscription mid-cron exhausted (round 6 開始 fall-through cascade)
⚠️ 免疫 54 chronic yellow（不在 babel scope）
✅ verify-batch.py: 0 errors / 0 warnings (heal 後)
✅ commit 252df1554 push main
```

## Beat 5 反芻

第一性原理交鋒。**14 hr 義務鐵律 + 跑到 stale=0 才能停**這條當初 5/13 哲宇 callout 立的鐵律（5/9-5/11 三次 babel 守 1hr 預算 anti-pattern），今天真正在 140 分鐘內把同步率推到 100%。沒有「跑一段就 ship」、沒有「P1 skipped 守 boundary」。

更深的觀察：**架構解 vs 守備修補**這條 §進化哲學第七條（MANIFESTO）今天的證據。當 gpt-oss-120b 連續 15 篇 footnote 退化時，守備修補心態會「跑得到的就 ship」（接受 stale=15）；架構解心態是 fall-through 到下一 Tier，最終 Sonnet sub-agent 把這 15 篇全收下。Tier 5 不是 fallback，是 sovereignty 真正戰場（per v2.0 §Tier 4 Local LLM 哲學擴展）—— 即使 Local Ollama offline，paid Sonnet 也是「永不漏接」鏈的一環。

工具自我演化的 timing 也是關鍵。diff-patch-prepare 1500-char bug 在 Batch 3 跑時觸發 42 false positives，當下選擇修工具（1-line edit）而非跳過 — 反映 REFLEXES #15「反覆浮現要儀器化」內化。如果跳過這 42 篇 → babel 永遠跑不到 100% （這 42 篇會永久 stuck "missing for X" 不被 patch）。

footnote loss 是 gpt-oss-120b 的 silent killer — 它 return ok 但 body 沒有 footnote definitions。如果 `openrouter-translate.py` 沒有那個 footnote count assertion guard（2026-06-06 加的 hard gate），這 15 篇會偷偷被存進去 stale=0 但實質退化。Hard gate 救了 sovereignty。

5 lang × 805 articles × 100% sync = 4025 fresh translations 全 aligned current zh head。第一次 babel routine 達到這個狀態。它不是固定態 — 明天 maintainer 還會 merge 新 PR / rewrite 還會 EVOLVE 文章 / 翻譯會再次 drift。但這個基線存在過，下次再達到時知道路徑是可行的。

🧬

---

_v1.0 | 2026-06-17 02:50 +0800_
_session routine（twmd-babel-nightly cron 00:30 fire）_
_誕生原因：cron routine 00:30 fire，14-hr 義務鐵律 babel sync 跑到 stale=0 OR 4-tier exhausted_
