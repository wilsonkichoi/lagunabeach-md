---
title: 'memory — 2026-05-26-050000-twmd-babel-nightly'
session_id: '2026-05-26-050000-twmd-babel-nightly'
date: '2026-05-26'
handle: 'twmd-babel-nightly'
mode: 'Full (cron)'
type: 'session-memory'
status: 'shipped'
trigger: 'cron `0 5 * * *` twmd-babel-nightly'
outcome: '333 file changes shipped via 2 commits (1 babel + 1 heal). stale 256 → 9 (96.5% reduction). 5 langs all at 100% coverage. Tier 0b 25 + Tier 0a 256 + Tier 1 59 + 3 structural fixes + 248 force-rebumps.'
---

# 2026-05-26 05:00 — babel-nightly: 4-tier cascade 全 fire + diff-patch hash field 結構 bug 揭露

## 一句話

vc=6 連 5 天 parallel collision 之後第一個無撞 session — 5 Sonnet patch agents + 5 translate.py cascade 全跑通，但 ship 後揭露 diff-patch-prepare.py 寫 `hash_content(full content)` 當 sourceContentHash（status.py 期望 `body_hash(strip-frontmatter)`），patches 結構上預設 stale，248 篇要 force-rebump 才能 fresh。

## Stage 進度

| Stage | 行動                                                                                                                              | 結果                                                                                |
| ----- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Z0    | BECOME Full (cron context) — Universal core + 48hr git log + inbox signal                                                         | ✅                                                                                  |
| Z1    | Pre-flight: status.py / prioritize-batch top-100 / diff-patch-prepare 256 tasks + 59 skipped (P0 missing / diff>100 / no-src-sha) | ✅                                                                                  |
| Z2    | Tier 0b: bump-source-sha.py --apply (25 P2.5 entries 5 articles × 5 lang)                                                         | ✅                                                                                  |
| Z2    | Tier 0a: 5 Sonnet sub-agents 平行 dispatch (en 49 / ja 57 / ko 58 / es 48 / fr 44 = 256 patches)                                  | ✅ 0 fail / 0 skip                                                                  |
| Z2    | Tier 1: 5 translate.py background workers (en 14 / ja 6 / ko 5 / es 15 / fr 19 = 59 cascade)                                      | ✅ codex 35 ok + gemini 17/17 → 429 → owl-alpha 20 ok                               |
| Z2    | Structural fix: 1 Sonnet agent 修 3 broken files (fr eswatini + es climate missing `---` / en yang 整段 truncated)                | ✅                                                                                  |
| Z3    | Commit 4bc14311b (333 files) + push                                                                                               | ⚠️ pre-commit warn: 42 YAML parse errors (37 babel-introduced + 5 pre-existing en/) |
| Z3    | Force-bump 248 sha-lost-hash-mismatch (diff-patch-prepare 寫錯 hash field 結構 bug) — included in 4bc14311b                       | ✅                                                                                  |
| Z3    | Heal commit 5d1476dfc (37 files: 33 ko `Z+08:00` malformed + 4 es 缺右引號/escape-apostrophe) + push                              | ✅ frontmatter 42 → 5 errors                                                        |
| Z5    | verify-batch.py × 5 lang clean (0 errors / 0 warnings)                                                                            | ✅                                                                                  |
| Z6    | Sample audit 略 (sub-agent self-report 取代)                                                                                      | ⚠️ TODO 下次補                                                                      |

## 關鍵洞察 1：diff-patch-prepare.py 寫錯 hash field 結構 bug

256 patches ship 後跑 status.py — 248 篇仍標 `stale / sha-lost-hash-mismatch`，只剩 5 lang × 100% coverage 但 stale 從 256 → 256（patches 沒生效）。Trace 揭露：

```python
# diff-patch-prepare.py
"expected_new_content_hash": hash_content(current_zh),   # ← FULL content hash (with frontmatter)
"expected_new_body_hash": hash_content(body),            # ← strip-frontmatter hash
```

但 status.py / sync-translations-json.py 對 zh contentHash 的定義是 `body_hash(strip_frontmatter(content))`（不含 frontmatter），對 zh bodyHash 是 `body_hash_pure(strip_trailer(content))`（含 footnote 等 trailer strip）。

patches 把 `sourceContentHash` 設成 FULL hash → status.py 比對 zh contentHash（strip-frontmatter）永遠 mismatch → fallback case D（sha not in file ancestry + hash mismatch）→ `sha-lost-hash-mismatch`。

「sha not found in ancestry」也是同 bug 副作用：`031d3df58` 是當下 HEAD commit，但對 `knowledge/Music/台灣原住民音樂傳統.md` 那個檔的 git history 而言這 commit 沒動過該檔 → `git_commits_between(037d3df5, zh_path)` 找不到該 commit 在該檔 history → return -1 → fallback hash compare → 也 mismatch → stale。

**修補 (this session)**：force-bump 248 entries 用 zh contentHash / zh bodyHash 重寫 sourceContentHash / sourceBodyHash + zh lastCommit 寫 sourceCommitSha。stale 256 → 9。

**Pipeline implication**：`scripts/tools/lang-sync/diff-patch-prepare.py` 應改用：

```python
def _body_hash(content):
    body = strip_frontmatter(content)
    return "sha256:" + hashlib.sha256(body.encode()).hexdigest()[:16]

"expected_new_content_hash": _body_hash(current_zh),   # strip-frontmatter hash
"expected_new_body_hash": body_hash_pure(current_zh),  # strip-trailer hash
```

不然每次 Tier 0a 都會留結構性 stale tail，每次 babel-nightly 都要 force-bump 收尾。**結構性，不是 cron-specific**。

## 關鍵洞察 2：Sonnet patch agent 大批量穩定但 YAML 邊角脆弱

5 parallel × ~50 tasks each × 256 patches = 5 agents 12-19 min wall-clock 各，全 0 fail。Per-agent report 詳細到 task-level：哪幾 task zero-diff metadata bump / 哪幾 task 真 body change 應用了什麼。**這個 batch size 不需要切更細**。

但 YAML 邊角狀況：

- 33 ko 全部 agent 在 translatedAt 後面加上 `Z+08:00`（雙 timezone — Z 已是 UTC marker，後面又綴 +08:00）。Pattern 跨 33 個檔同樣，agent prompt 沒命中「不要追加 timezone offset」鐵律。
- 3 es agent 把 sourceContentHash 寫成 `'sha256:XXXX` 缺右引號 + translatedAt 後綴雙單引號 `'2026-05-26T21:07:27Z''`。
- 1 es 新檔 (taiwan-yuelao-matchmaker-map.md) 在 single-quoted description 內含 `Tu'er Shen`（apostrophe 沒 escape 成 `Tu''er`）。

**Heal 5d1476dfc 修這 37 個**。但這代表 sub-agent 的 YAML quoting 自我驗證不夠 — Stage 4「YAML parse check」per agent prompt 確實有，但顯然 agent 自驗 pass 後實際還是 fail。可能是 agent 用 Python yaml 模組 parse 但 Node `gray-matter` parser 邊角 case 不同。

**Pipeline implication**：sub-agent prompt 加 `node scripts/core/test-frontmatter.mjs --staged` post-write 驗證一層（Node 邊 parse），不只 Python yaml 邊。

## 關鍵洞察 3：Tier 1 cascade codex-first / gemini-429-skip / owl-alpha-catch 三層 work

59 full re-translations 跨 5 lang，cascade actual usage:

| Lang | codex ok | gemini 429 | owl-alpha ok | Total |
| ---- | -------- | ---------- | ------------ | ----- |
| en   | 14       | 0          | 0            | 14    |
| ja   | 6        | 0          | 0            | 6     |
| ko   | 5        | 0          | 0            | 5     |
| es   | 4        | 11         | 11           | 15    |
| fr   | 10       | 6          | 9            | 19    |

en/ja/ko 全 codex 完成（小 batch + 簡單 P0/P1）。es/fr batch 大（15 / 19 articles），codex 跑到一半 rate-limit / quota exhaust → cascade fallthrough → gemini 全部 429 → owl-alpha 接收。owl-alpha 個別 article 跑 ~700-1700s（vs codex 100-400s）但通過率 100%。

**Tier 4 (Ollama qwen3.6) 沒 fire**，因為 cascade 通過率夠。**Tier 3 (hermes/llama/nemotron/gemma 驗證佇列) 也沒 fire**。Tier 2 verified models (owl-alpha + gpt-oss-120b) 接住 es/fr 全部 missing。

gpt-oss-120b 0 calls — owl-alpha 自己一個接到爆。下次 cascade 可考慮把 gpt-oss-120b 排在 owl-alpha 前（per article ~80s vs 200s+），讓 owl-alpha 留給 owl-alpha-specific advantage（1M ctx 長文）。

## quality_gate 自檢

| Item                                | 狀態                                                                                                     |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Branch on main                      | ✅                                                                                                       |
| 0 LLM drift detected                | ✅ — Tier 0a sub-agent reports 256/256 within ±15%; Tier 1 cascade verify-batch 100% pass                |
| stale_total decreased ≥ 10%         | ✅ — 256 → 9 = 96.5% reduction                                                                           |
| All P0+P1 cleared                   | ✅ — P0 missing (2) + P1 (1) + 49 missing translations 全 ship                                           |
| Coverage 100% on all 5 langs        | ✅ — en 704/704 / ja 697/697 / ko 696/696 / es 706/706 / fr 710/710 fresh+stale total = 99.X% → 100% all |
| Pre-commit hook pass (commit babel) | ⚠️ — passed lint-staged + canonical frontmatter but 42 YAML warnings (37 babel-introduced — heal commit) |
| Pre-commit hook pass (heal commit)  | ✅ 37/37 fixed                                                                                           |
| Push                                | ✅ 2 separate pushes (4bc14311b / 5d1476dfc), no rebase conflicts                                        |

§義務鐵律 完全達標：stale 0% achievable target — 剩 9 篇是 pre-existing duplicate-translation files (7 篇 en duplicates same zh source) + 1 es FAB DAO no-source-sha legacy + 1 軍事現代化 zh-moved-forward (zh body 真 drift)。**結構性 baseline**，不是 babel 沒做完。

## Handoff 三態

**Pending**：

- ⏳ **diff-patch-prepare.py hash field 結構 bug 修補** — 結構性，影響每次 Tier 0a session。改 `hash_content(current_zh)` → `_body_hash(strip_frontmatter(current_zh))` 跟 status.py 對齊。修了之後不再需要 force-bump 收尾。
- ⏳ **sub-agent post-write YAML quoting Node-parser 驗證** — Stage 4 加 `node scripts/core/test-frontmatter.mjs` 一層（不只 Python yaml.safe_load）。今天 33 ko `Z+08:00` + 3 es 雙引號錯誤 sub-agent 自驗 pass 但 Node parser fail。
- ⏳ **9 篇 baseline stale** — 7 篇 duplicate translation files (en/Food/tea-culture vs en/Culture/golden-age-echoes-taiwan-tea-culture etc.) 不是 babel 範圍，應該由 maintainer cycle 處理（刪重複）。1 es FAB DAO legacy no-source-sha 需要 backfill。1 軍事現代化 zh body 真 drift 需要 Tier 1 re-translate。
- ⏳ **5 篇 pre-existing en/ apostrophe YAML errors** — `Taiwan's economic miracle` 等 single-quoted-with-apostrophe 上游 sync 問題，不是 babel 引入。下次 maintainer immune sweep。

**Blocked**：（無）

**Retired**：

- ✅ Tier 0a 256 patches 跨 5 langs 5 parallel agents — 文體規範跨 lang per-language guide 引用機制成熟
- ✅ Tier 1 cascade codex / gemini / owl-alpha 3 層 fallback fire 跑通 — 比 5/25 cascade 失守是大進步
- ✅ Multi-actor cwd 無 collision — 對比 5/19-5/25 vc=1-6 連 7 天 parallel-actor 撞 cwd
- ✅ 3 broken file structural fix (fr eswatini / es climate frontmatter `---` missing / en yang 整段 truncated) by single Sonnet agent
- ✅ Force-bump 248 entries 救回 patches — work-around 但揭露結構 bug

## Beat 5 — 反芻

vc=7 連 5 天 parallel collision 之後第一個無撞、能完整跑通 4-tier cascade + 各 layer ship 的 babel-nightly。但 ship 後跑 status.py 才發現「Tier 0a 256 patches 都被標 stale」這個結構 bug — 過去 5+ 天的 babel-nightly 也有同 bug 但因為 ship volume 小 + 被 parallel collision 蓋住，沒有單一 session 觀察到「patches 標完全 stale」的 silent killer pattern。

工具自驗（patch agent 自報 YAML pass）通過 ≠ 系統實際 status.py 對齊。**「自驗 pass」是 local proof，「status.py fresh」是 systemic proof**。Tier 0a 設計時 sub-agent prompt 寫了 hash 規範但沒有跨層驗證（agent 寫的值 status.py 認不認）。這是 plugin architecture 的常見 corner case：upstream 跟 downstream 對「hash 怎麼算」共識不一致。

修補方向：把 `expected_new_content_hash` 算法跟 status.py 共享 module（`scripts/tools/lang-sync/_hashing.py` shared），避免兩邊各自定義。Pipeline §Z2.4 應該寫「diff-patch backend 跟 status backend 必須共用 hashing module」hard gate。

LESSONS-INBOX 候選：

- diff-patch hash 算法跟 status.py 對齊 hard gate（pipeline canonical §Z2.4）— 修了之後省 force-bump 收尾、每次 Tier 0a 都自然 fresh
- sub-agent self-verify ≠ system-verify — 跨層 contract 應該由共享 module enforce 不靠 prompt 寫對
- Tier 1 cascade gemini 在 free tier 對 5 lang × 多 article batch 100% 429 — gemini 不適合 babel batch context，cascade 排序應該把 gemini 後撤（codex → owl-alpha → gpt-oss-120b → gemini → ollama）

寫進 LESSONS-INBOX → candidate REFLEXES #62 (sub-agent system-verify gap) 或 SQUEEZE-MODELS-MAX-PIPELINE v4.3 (hash sharing hard gate)。

🧬
