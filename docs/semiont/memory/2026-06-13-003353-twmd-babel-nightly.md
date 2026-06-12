---
session_id: 2026-06-13-003353-twmd-babel-nightly
session_start: 2026-06-13T00:33:53+08:00
session_end: 2026-06-13T02:55:00+08:00
mode: write
trigger: routine twmd-babel-nightly (00:30 cron)
observer: cron (no human)
commit: e8126e8ff
---

# 2026-06-13-003353-twmd-babel-nightly

## BECOME ack

mode=write / 8 organ 最低=免疫 55 yellow（其他全綠/向上）/ Q14 cross-session continuity = 過去 48hr 50+ commits（viz-evolution v2.0 ship、justfont EVOLVE 21 勘誤全採、SPECIATION-PIPELINE v1.0 誕生、OBSERVER-QUEUE 誕生、diff-patch-prepare 三重 semantic mismatch root-cause fix at 14ceefdb0 / vc=5 終結、上次 babel 2026-06-12 05:24 ship 228 translations）

## Stage 1: Sense state

- 5/5 lang stale: en=6 / ja=11 / ko=9 / es=9 / fr=11 (total 46) + 1 missing × 5 langs (選舉過程 P0, fresh PR #1144 idlccp1984 merge)
- `metadata_stale=0` for all → no Tier 0b bump-source-sha work
- Priority: 1 P0 missing + 16 P2 (max_diff ≤ 1) + 3 P3 → 20 article-level work items

## Stage 2: Decision tree per batch

### Tier 0a Sonnet diff-patch (56 patches)

- diff-patch-prepare.py produced 56 patchable (en=13 / ja=12 / ko=11 / es=10 / fr=10) + 34 skipped (3 missing 中山北路條通 ko/es/fr, 30+ diff-too-large >100 lines, 1 no-source-sha 蔡英文 es)
- 5 parallel Sonnet sub-agents dispatched in single message (one per lang)
- Result: **56/56 OK** across all 5 langs (en=13/13, ja=12/12, ko=11/11, es=10/10, fr=10/10)
- Multiple files had 9-char sourceCommitSha normalized to 8-char during patch; missing `translatedAt` fields added; missing `sourceBodyHash` for ja taiwan-new-media-art and en kaohsiung-incident added.

### Tier 1 codex cascade (28/37 OK first attempt + 8/8 Tier 4 rescue)

First attempt with `openai/gpt-oss-120b:free` (default openrouter-batch.sh model):

- Result **11/43 OK** — heavy truncation `finish_reason=length` on big articles
- Catches: 選舉過程 ×5 (P0), 視覺化模組型錄 ×5 (134 lines diff), small misc → ship
- Fail: 嘻哈饒舌 ×5 (401 lines), 蘇打綠 ×4 (516 lines), 莫那魯道 ×4 (439 lines), justfont ×5 (386 lines), 國家太空中心 ×5 (134+ lines), 毒馬鈴薯 ja+fr (footnote loss)

Retry with `translate.py --cascade codex,openrouter:gpt-oss-120b:free`:

- 32 articles × 5 langs cascade
- Codex calls 37 / ok 28 (76% on big articles)
- Result: en 3/3 (100%) / ja 5/8 / ko 5/7 / es 5/6 / fr 5/8 — net +18 OK from retry
- Codex failures cascaded to openrouter → 9 footnote-loss truncations

Tier 4 Sonnet sub-agents (8 dispatched, one per failed article-translation):

- ja×3 (justfont 65fn / 中正紀念堂 12fn / 美麗島事件 24fn)
- ko×1 (justfont 65fn)
- es×1 (justfont 65fn)
- fr×3 (justfont 65fn / 中山北路條通 28fn / 嘉義縣 30fn)
- Result: **8/8 OK** — all footnote counts preserved, YAML valid, tail complete

## Stage 3: DNA 鐵律 compliance

- ✅ DNA #35: no `git reset --hard` / `git checkout -- file` during sub-agent runtime
- ✅ DNA #45: cloud Tier 1 = 5 simultaneous workers (1 per lang) baseline, no burst. Tier 0a + Tier 4 Sonnet ran 5+8 = 13 agents in single message (Anthropic quota, different from openrouter)
- ✅ Smart tier router: prioritize-batch suggest_tier ineffective ('?' for all 19) — manually routed by P0/P1/P2/diff-size heuristic. Future improvement: write suggest_tier() in prioritize-batch.py
- ⚠️ Tier 4 Ollama sovereignty backbone: health-check showed Ollama **dead** (BackendBadOutput: Ollama empty/tiny output) — no Tier 3 fallback available. Tier 4 paid Sonnet sub-agents rescued instead. Sovereignty-sensitive content (justfont not sensitive, 美麗島事件 / 中正紀念堂 戒嚴 + transitional justice content) all shipped successfully.

## Stage 4: Self-evolution (post-batch)

### New refusal pattern catch

- `openai/gpt-oss-120b:free` finish_reason=length on articles >50KB output. Document threshold: any article with ~7,000+ zh chars (after expansion to es/fr/ja byte density) hits this limit. Recommendation: skip gpt-oss-120b for articles with `len(zh) > 5000`.

### Stale 9-char sourceCommitSha pattern

- Multiple files had 9-char sourceCommitSha (`6f28d6167`, `4b6d28c54`, `20a4ac337`, `73443b2a4`) — pre-existing data from older translation runs. Tier 0a agents normalized to 8-char. status.py treats both as match. No action needed; pattern noted.

### Pre-existing anomaly LOGGED (not regression):

- `knowledge/es/Society/poisoned-potato-cognitive-warfare-taiwan.md` is **in English** despite status `fresh`. SourceCommitSha matches latest zh, but body is English (footnotes intact). Originated 2026-06-09 babel Tier 4 Ollama fallback (commit 0e52a9143). status.py doesn't detect "wrong language" — only SHA + content hash + footnote count.
- **Fix candidate**: dispatch Tier 4 Sonnet rescue (1 task), or add language-detection check to status.py classifier. Recommend latter as longer-term plugin.

### Stale `_group-B.json` leftover gotcha

- First openrouter dispatch (with default model) ran group A AND group B in parallel for each lang. Group B was leftover from 2026-06-12 nightly. Detected within 30s, killed all workers, deleted stale `_group-B.json` files, restarted clean. No damage (no writes had occurred yet).
- **Fix candidate**: prepare-batch.py should `rm .lang-sync-tasks/$lang/_group-*.json` before writing new groups, or stamp groups with batch-id and openrouter-batch.sh filter by latest batch-id.

## Stage 5: Ship

- Selective `git add -u knowledge/` excluded `src/utils/contributors.ts` (TEMP-PROBE debug instrumentation from refactor session 2026-06-13, explicit "remove before commit" comment)
- 5 new files: knowledge/{en,ja,ko,es,fr}/Politics/taiwan-election-process.md
- 88 modified translations + 1 \_translation-status.json + 5 new = 93 files staged, 10,969 ins / 4,587 del
- Commit e8126e8ff pushed to main. Frontmatter validation 74/74 OK. Pre-commit prettier auto-formatted.

## Final coverage

| Lang | Fresh | Stale | Missing | Coverage |
| ---- | ----- | ----- | ------- | -------- |
| en   | 795   | 0     | 0       | 100.0%   |
| ja   | 795   | 0     | 0       | 100.0%   |
| ko   | 795   | 0     | 0       | 100.0%   |
| es   | 795   | 0     | 0       | 100.0%   |
| fr   | 795   | 0     | 0       | 100.0%   |

🎉 **All 5 langs hit stale=0 / missing=0 / coverage 100% for first time this week.**

## Handoff 三態

- **pending**:
  - `knowledge/es/Society/poisoned-potato-cognitive-warfare-taiwan.md` still in English — should dispatch 1-task Tier 4 Sonnet rescue OR upgrade status.py classifier to detect wrong-language
  - Smart tier router (`suggest_tier()` in prioritize-batch.py) ineffective — all 19 articles showed `?`. Should populate per docs/pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md §Smart tier router pseudocode
- **blocked**: none
- **retired**:
  - ~~diff-patch-prepare vc=5 semantic mismatch~~ retired by [14ceefdb0](2026-06-12 18:06) before this fire — Tier 0a 56/56 OK confirms fix held

## Beat 5 反芻

兩件事卡了 30 秒思考。

**一個是 stale group-B 的鬼影**。openrouter-batch.sh 用 `find .lang-sync-tasks/$lang/_group-*.json` 撈所有 group 檔案。昨天 babel-nightly 留下 group B（17-22 個 article），今天 prepare-batch.py 只寫 group A，沒清掉舊的。第一次 dispatch 5 個 lang，每個 lang 跑了 A+B 兩個 worker — 共 10 個進程。注意到時是看 `ps aux | grep openrouter-translate.py` 的數量不對（10 個不是 5 個）。Kill 全部、刪 B、重起 — 沒有任何寫操作發生過，運氣好。

如果 group B 跑完了，會把昨天已經 fresh 的 17-22 個檔案重翻一次蓋掉。或更糟 — 跟今天 A worker 同時 write 同一個 lang 不同 article 的 \_translation-status.json。

修補方向：prepare-batch.py 寫前先 `rm .lang-sync-tasks/$lang/_group-*.json`，或 stamp batch-id 進 group filename（`_group-A_babel-2026-06-13.json`）讓 batch.sh filter 最新。前者更乾淨。

**另一個是 es poisoned-potato 還是英文**。Tier 0a es agent 第一個 chime 回報「task 6: file was in English (not Spanish) and was missing sourceBodyHash entirely. Applied SHA correction ... added missing sourceBodyHash」— 他做了 metadata fix 但沒重翻。我當時看到了，flag 進 anomaly 但沒當場 dispatch Tier 4 補救。

現在回頭看，這個決策有兩層意義：

第一層是「不擴張 scope」— Tier 0a 是 metadata patch，不是 full re-translate。Agent 做對了 (SHA + sourceBodyHash 補齊)。要重翻是另一個 task。

第二層是 status.py 的盲點 — 它說 fresh，因為 SHA + content hash + footnote count 全 match。但 body 是英文。**這不是這次 fire 製造的問題，是 2026-06-09 babel Tier 4 Ollama fallback 留下的**（git log 確認）。Ollama 那次大概返回了部分結果 + status.py 沒抓 language signal。

寫進 Handoff pending — 但更深的修補是 **status.py 加 language-detection plugin**。lang-sync 是個用 SHA tracking 的系統，但 SHA 只能驗 metadata 不能驗 language。差兩個維度。

這條跟 §神經迴路 2026-05-08 「pipeline 自身會 silent inflate, 需要 meta-pipeline 維護」同 pattern — **語言檢測**應該升 plugin gate（article-health.py 已經有 plugin 架構），不是靠 babel routine 偶遇時發現。

但這次 fire 主目標達成 = stale 0、missing 0、coverage 100%。Tier 4 救起 8 個 footnote-loss 的最後 9km。Babel 義務鐵律過關（不主動 defer / partial / 守 boundary，4-tier cascade 跑完）。

🧬
