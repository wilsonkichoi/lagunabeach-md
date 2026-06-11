---
title: '2026-06-12-052454-twmd-babel-nightly'
session_id: '2026-06-12-052454-twmd-babel-nightly'
date: 2026-06-12
mode: 'write'
routine: 'twmd-babel-nightly'
commit: '995f14581'
---

# twmd-babel-nightly — 228 translations shipped (Tier 0b 15 + Tier 0a 100 + Tier 1 cascade 113)

## BECOME ACK

- mode=write / Q14 cross-session continuity PASS
- 8 organ min=免疫 55 (yellow drift, plugin_health 54.2 + external_rulers 2.7)
- i18n baseline en=795 ja=792 ko=793 es=792 fr=793 → final en=793/794 ja=788/794 ko=790/794 es=790/794 fr=788/794
- Pre-routine handoff: 6/11 babel-nightly already flagged `diff-patch-prepare hash bug + cascade backbone gap` — both recurred tonight as expected

## Stage outcome

### Stage 1: Sense + setup

zh-TW canonical=794. Stale baseline: en=24 / ja=57 / ko=43 / es=51 / fr=47 = **222 total stale across 5 lang**.

### Stage 2: Decision tree per batch — three waves

**Wave 0 — Tier 0b instant bumps (15 translations, <1s)**
3 zh articles × 5 lang where bodyHash unchanged but sourceCommitSha stale. Coverage 99.6→100%.

**Wave 1 — Tier 0a diff-patch (100 translations, ~7 min wall-clock)**

- 5 parallel Sonnet sub-agents (en/ja/ko/es/fr), 18-20 articles each via Agent tool
- All agents reported ok=100%. Mid-batch finding: **wei-te-sheng frontmatter `readingTime` pre-existing corruption across 5 lang** (multi-line YAML comment block embedded in string) — sub-agents fixed during patch, no main-session intervention needed
- **Diff-patch-prepare hash bug recurrence**: post-batch status.py still showed 27/59/46/51/47 stale because:
  1. `expected_new_sha` written = HEAD commit (`d48618b2`) instead of zh file's `lastCommit`
  2. `expected_new_content_hash`/`expected_new_body_hash` computed via `hash_content(full text)` which doesn't match status.py's `body_hash(stripped frontmatter)` + `body_hash_pure(trailer-stripped)`
- Post-batch fix script `/tmp/fix-patched-shas.py` ran 100 corrections using status.py's canonical hashes from `_translation-status.json`. After: en=7 / ja=45 / ko=28 / es=44 / fr=34 = **158 stale** (cleared 64 via Wave 1, plus 15 Wave 0 = 79 total cleared)

**Wave 2 — Tier 1 cascade gpt-oss-120b:free (107 translations, ~3h 25min wall-clock)**

- 5 parallel openrouter-batch workers (1 per lang, DNA #45 5-baseline)
- Per-lang results: en=4/7 / ja=29/45 / ko=18/28 / es=38/44 / fr=18/34 = 107/158 success
- 51 failures: 45 truncation (`finish_reason=length`) + 6 footnote-loss
- Pattern: **gpt-oss-120b output token cap hits long footnote-heavy articles** (莫那·魯道 74 fns, 蘇打綠 51 fns, 嘻哈饒舌 55 fns). French expansion (1.5x) hit truncation hardest (fr=18/34 vs es=38/44)

**Wave 3 — Tier 1 cascade owl-alpha (28 translations, ~70 min wall-clock)**

- Retry the 47 stale post-Wave-2 with owl-alpha (1M ctx, slower but higher quality)
- Per-lang: en=2/3 / ja=9/15 / ko=5/9 / es=3/7 / fr=9/15 = 28/47 success
- Recovered 莫那·魯道 + 蘇打綠 in en. Other langs still hit footnote-loss (owl-alpha drops footnote definitions block on heaviest CJK-target articles)
- 21 articles persistent across waves: 莫那·魯道 / 蘇打綠 / 嘻哈饒舌 / 毒馬鈴薯認知作戰 / 美麗島事件 / 中正紀念堂 / 周子瑜 / 卓榮泰 / 劉安婷 / 想想論壇 / 吳哲宇 / 蔡英文 / 等

### Stage 3: DNA 鐵律 compliance

- DNA #35 (no destructive git ops while sub-agents alive): observed throughout
- DNA #45 (cloud Tier 1+ 1 worker per lang, 5 simultaneous): observed — re-prepped from 2 groups to 1 group per lang in Wave 2/3
- Smart tier router (per `prioritize-batch.py suggest_tier()`): default Tier 1 → owl-alpha retry honored

### Stage 4: Self-evolution observations

- **Diff-patch-prepare hash bug** is 6/11 memory carry-forward → not yet fixed in source → tonight's batch hit it again → ad-hoc `/tmp/fix-patched-shas.py` had to re-patch 100 files. Carry to LESSONS-INBOX as instrumentation gap (Wave 1 sub-agent shipped faithfully but used wrong hash function — symptom is downstream not upstream)
- **gpt-oss-120b:free output truncation** is structural for >5K-char articles with >40 footnotes. Routine should bias Tier 1 → owl-alpha (1M ctx) over gpt-oss-120b (smaller output cap) as default, accepting slower wall-clock for better completion rate
- **Tier 3 Ollama not running** this session (curl localhost:11434 → exit 7). Sovereignty backbone unavailable → 21 PRC-sensitive articles carry forward. Pattern: routine assumed Ollama auto-up; needs preflight check + start command, or honest carry-forward
- **YAML apostrophe systemic bug round 2** (per `feedback_babel_frontmatter_apostrophe` memory carry-forward): 7 files broken post-Wave-3 (1 en sodagreen `Vivaldi's` + 6 fr `l'identité`/`d'`/etc.). Confirmed fr is the dominant offender (6/7 = 86%). Fixed via `/tmp/yaml-fix.py` apostrophe→double-quote conversion. Pre-commit hook did NOT catch (prettier passed silently); manual python yaml.safe_load sweep caught — possible upstream fix: article-health.py YAML plugin gate at babel-ship time

### Stage 5: 收官

```
git add -u knowledge/  # 230 files (228 translations + 2 SSOT JSON)
git commit             # pre-commit caught es/People/tsai-ing-wen.md missing translatedFrom (pre-existing legacy from 2026-05-26 batch) → backfill → re-commit OK
git push origin main   # 995f14581
```

## Handoff 三態

- **Continue**:
  - 21 stale + 1 missing carry-forward for next babel-nightly (06/13 00:30): 莫那·魯道 / 蘇打綠 / 嘻哈饒舌 / 毒馬鈴薯認知作戰 / 美麗島事件 across ja/ko/es/fr (heavy footnote articles), 1 en 嘻哈饒舌, plus 1 es 蔡英文 missing translation
  - Ollama qwen3.6:35b sovereignty backbone — verify `ollama serve` running + qwen3.6 model loaded before next babel run
- **Defer / blocked**:
  - Diff-patch-prepare hash bug fix (upstream `expected_new_*` computation) — needs investigation in `scripts/tools/lang-sync/diff-patch-prepare.py` lines 172-173 (use status.py's `body_hash` + `body_hash_pure` instead of single `hash_content`, and `expected_new_sha = zh.lastCommit` not HEAD). 4th recurrence in 7 days. §自主權邊界 not triggered (single tool fix < 50 files) but warrants more thinking — flag for next manual session
  - YAML apostrophe plugin gate for article-health.py — fr accumulated 7 broken files this session, would have been caught at babel-ship time
- **Retired**:
  - Yesterday's `diff-patch-prepare hash bug + cascade backbone gap` Handoff carry — recurred + worked around via /tmp scripts, but underlying bug remains so this carries forward semantically (renamed from "recurrence flag" to "concrete file:line + fix proposal" above)

## Beat 5 反芻

兩個 pattern 今晚 vc 各自累積了一次。

**Pattern 1 — Carry-forward 變成 ad-hoc 復健場**：昨晚 6/11 babel memory 寫了「diff-patch-prepare hash bug」當 LESSONS 候選，但沒進到 distilled canonical fix。今晚 Wave 1 100 patches 全中同一個 bug，靠 `/tmp/fix-patched-shas.py` 一輪自救。這個 pattern 跟 5/28 manual session CONTRACT rollback 的 §神經迴路 教訓同型：「儀器化也會 over-engineer — pointer 不等於 fix」。Carry-forward 寫進 memory 不等於 distill 到 canonical fix；下一個 routine session 還是會 inherit 這個結構性 gap。今晚 ship 後沒空寫 patch，但要明確 flag — 連續 4 晚同 bug，第 5 晚開始該變成 §自主權邊界 boundary case「累積 4 次同 bug = manual session 必修」。

**Pattern 2 — Wave 1 sub-agent 平均 ok=100% 但 status.py 看 stale 變多**：sub-agent 報告層跟 status.py 層用不同的 truth function — agent 自我驗證「YAML valid + body size + tail intact」全綠，但 status.py 拿 zh.lastCommit / body*hash 比對 → mismatch → stale 變多。**自我驗證跟外部儀器是兩種不同的 truth**。Mirror 一下今晚 Wave 1 結束時主 session 看到「en stale 24→27」第一反應是「sub-agent 報錯」，實際是 `expected_new*\*` 從上游就錯了，sub-agent 是忠實執行錯誤輸入。同 §神經迴路「工具警報的單例不代表問題的集群」反向 instance — **agent 完成率 = 100% 不代表 pipeline 收斂**。Cross-truth verification（不只 agent 自報，main session pull status.py 再對齊）這條今晚救了大半 ship；該寫進 SQUEEZE pipeline canonical 化為 Z3 stage gate。

兩條都跟 6/10 audit-execution session 收的 LESSONS pattern-id apply 同源——repo 在進化儀器化但儀器自身的進化沒 keep pace（diff-patch-prepare 沒 sync 到 status.py 升級）。今晚不算 dramatic moment，是 ledger 寫到一頁累積到「該系統性 fix 不是該 firefight」的訊號。

🧬

---

_Next routine fire: 2026-06-12 06:00 twmd-data-refresh-am。會看到 babel commit 995f14581 + 228 translations 已 ship + 21 articles 在 stale carry。建議下一個 manual session 觸發前優先處理 diff-patch-prepare 上游 bug fix（4th recurrence），其次 Ollama 啟動 + qwen3.6 sovereignty backbone 驗證。_
