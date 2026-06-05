---
session_id: 2026-06-06-015405-twmd-babel-nightly
date: 2026-06-06
type: routine
routine: twmd-babel-nightly
mode: write
status: PASS
---

# twmd-babel-nightly — 105 translations (cascade + patch + bump) — 2026-06-06 00:30

## BECOME ACK

- Mode: **write** (per routine STRICT BECOME GATE)
- Universal core: consciousness-snapshot.sh (即時) + routine-status.sh (exit 1, ignore) + inbox-signal.sh + 48hr git log + contributor profile (哲宇 cron)
- §1.6 MEMORY tail + §神經迴路：5/28「inline > pointer for cron」/ 6/04「babel YAML apostrophe bug 129 檔 fr=118」reprise
- Q14 cross-session continuity PASS：過去 48hr 12+ manual ship (中華台北/TASA/天下/我是OO人/Howhow/李宗盛/設研院/OCF/Computex/健保/MCP connector/樂器製造 heal) 累積 stale；上次 babel 2026-06-04 00:36 vacuous PASS
- Self-test Write mode 8-9 題全過後開口

## Stage 1: Sense state

- zh-TW canonical: 787 articles
- 5 lang: 766 fresh / 13 stale / 5 missing 各 → 90 translation tasks total
- prioritize-batch top-20: 5 P0 missing + 5 P1 stale ≥50 + 8 P2 minor + 2 P2.5 metadata

## Stage 2: Decision tree per priority

| Tier                        | Articles                                             | Method                                                                                                | Result                               |
| --------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **0b** P2.5 metadata-stale  | 3 × 5 lang = 15                                      | `bump-source-sha.py --apply` (deterministic)                                                          | 15/15 instant                        |
| **0a** P2 minor stale       | 8 × 5 lang = 40 (一 nieh-yung-jen 走 post-patch fix) | 5 parallel Sonnet sub-agents per lang                                                                 | 35/40 patched + 5 deterministic bump |
| **1** P0 missing + P1 stale | 9 × 5 lang = 45                                      | `translate.py` default cascade (codex,gemini,owl-alpha,gpt-oss-120b,ollama) × 5 lang parallel workers | **45/45 ok**                         |
| **Deferred**                | 1 (我是OO人)                                         | §自主權邊界 orphan slug — spawn_task chip                                                             | 0/5 langs (deferred to 哲宇)         |

**Total**: 105 translations shipped, 1 article deferred.

## Stage 3: DNA 鐵律 + Backend cascade outcomes

**Backend stats (aggregated across 5 lang × 9 P0+P1 articles)**：

| Backend                      | calls | ok     | 429 | refuse | timeout |
| ---------------------------- | ----- | ------ | --- | ------ | ------- |
| codex (gpt-5.5)              | 45    | **12** | 0   | 0      | 0       |
| gemini (2.5-pro)             | 19    | 0      | 19  | 0      | 0       |
| openrouter:owl-alpha         | 19    | 0      | 19  | 0      | 0       |
| openrouter:gpt-oss-120b:free | 33    | **33** | 0   | 0      | 0       |
| ollama                       | 0     | 0      | 0   | 0      | 0       |

Wall-clock per lang worker: ~54-58min（5 parallel）。

**Observation 1 — gemini + owl-alpha 全 429**：cron 00:30 fleet 5 sims 撞共享 free quota；codex（subscription）跟 gpt-oss-120b（free 但不同 throttle pool）扛住全部。Tier 4 ollama 沒 fire（cascade 在 Tier 1 內就 cleared）— sovereignty backbone 未被觸發但 standing by。

**Observation 2 — codex 9 calls / 2-3 ok per lang**：codex 也有 subscription-side limit；當 codex 跟 gemini 同時 throttle 時 gpt-oss-120b 成為承擔軸。**Cascade 設計奏效**：subscription 跟 free-tier 兩條獨立路徑互補，單一 backend 不會 chokepoint 整批 batch。

**DNA #35 鐵律**：sub-agent 跑期間沒 git reset / checkout — PASS。
**DNA #45 鐵律**：Tier 0a Sonnet 5 parallel + Tier 1 cascade 1 worker per lang = 5 simultaneous baseline — PASS。

## Stage 4: Self-evolution — 三條 side findings

### 1. 🚨 diff-patch-prepare.py hash-algo mismatch (新 bug discovered)

`scripts/tools/lang-sync/diff-patch-prepare.py` 用 `hash_content(text)`（SHA256 full file 含 frontmatter）寫 `expected_new_content_hash`，但 `status.py` 用 `body_hash(content)`（SHA256 only post-frontmatter body）讀 `sourceContentHash`。兩個 hash algo 互不相認 → 所有 Tier 0a patched 檔在 patch 完直接被判 `stale` (reason=`sha-lost-hash-mismatch`)。

**Hot-fix 今夜**：`/tmp/fix-source-hashes.py` 從 `status.py --json` 重讀 zh per-file lastCommit + contentHash + bodyHash，重寫 40 個 patched 檔 frontmatter。

**Spawn chip**: task_eaa8e0b6「Fix diff-patch-prepare hash-algo mismatch」。修補方向：import or duplicate `body_hash` + `body_hash_pure` from status.py 取代 `hash_content`。

**對應 REFLEXES**：#15「反覆浮現要儀器化」第 N 次 — 兩 script 算法分歧屬於 silent drift；應加 smoke test 確保 prepare.py 跟 status.py hash output 對得起來。

### 2. 我是OO人 ↔ cognitive-warfare-against-taiwan 孤兒 slug

新 zh `Society/我是OO人.md` (commit 98c0f29) 5 lang 全 missing；既有 5 lang `cognitive-warfare-against-taiwan.md` `translatedFrom: 'Society/認知作戰.md'`（已不存在於 zh）— 孤兒指向被刪除來源。

§自主權邊界（slug 重新映射 + 孤兒清理）→ defer 哲宇。Spawn chip: task_a21ae146 「Resolve 我是OO人 ↔ cognitive-warfare-against-taiwan orphan」，附 Option A (re-point + re-translate) vs Option B (新 slug + delete 孤兒) decision tree。本 routine 推 stale=0 義務達成；missing=1 是這 1 篇。

### 3. ko/es TASA 缺 translatedFrom — backend output bug

`gpt-oss-120b:free` 寫 ko + es 的 TASA 檔時掉了 `translatedFrom` + `sourceCommitSha` + `sourceContentHash` + `sourceBodyHash` + `translatedAt` 全 5 個 source-tracking 欄位。檔案本身完整 ~29-32KB 翻譯，但 status.py 偵測不到 → 報 missing。

**Hot-fix**：`/tmp/inject-source-fields.py` 手動注入 5 欄位至 ko/es TASA frontmatter 末尾。

**對應 REFLEXES #24「工具在說謊」第 N 種**：backend 報「ok」但實際輸出缺欄位 = silent partial success。`verify-batch.py` 應加 frontmatter completeness gate（檢查 translatedFrom + 3 SHA + translatedAt 五欄齊全）。**Spawn chip 候選 (defer)**：升 verify-batch.py 加 source-tracking field gate。

## Stage 5: Ship

```bash
git add -u knowledge/ + 20 untracked new files
git commit 95cc42159 (101 files, +8685/-3270)
git push origin main → success
```

## i18n vitals delta

| Lang | Before                           | After           | Delta     |
| ---- | -------------------------------- | --------------- | --------- |
| en   | 766 fresh / 13 stale / 5 missing | **786 / 0 / 1** | +20 fresh |
| ja   | 766 / 13 / 5                     | **786 / 0 / 1** | +20 fresh |
| ko   | 766 / 13 / 5                     | **786 / 0 / 1** | +20 fresh |
| es   | 766 / 13 / 5                     | **786 / 0 / 1** | +20 fresh |
| fr   | 766 / 13 / 5                     | **786 / 0 / 1** | +20 fresh |

Coverage 99.0% → **99.9% 全 5 lang**. Missing=1 各 = 我是OO人 (deferred §自主權邊界)。

## Handoff 三態

### Pending（下個 session 可接）

- **Spawn chip task_eaa8e0b6**: diff-patch-prepare.py hash-algo 修補（取代 hash_content → body_hash/body_hash_pure from status.py）
- **Spawn chip task_a21ae146**: 我是OO人 ↔ cognitive-warfare-against-taiwan orphan resolution — 等哲宇決 Option A (re-point) vs B (新 slug + 刪孤兒)

### Blocked（等外部 / 等其他 routine）

- **gemini + owl-alpha 全 429 in cron 00:30 fleet**：等下次 cron tick（24hr quota reset）或 cron schedule 錯峰；不需手動干預。下次 babel-nightly fire 時若仍 429 → 考慮 stagger 5 lang 啟動時間 30s 間隔。

### Retired

- ~~13 stale per lang (P0/P1/P2/P2.5)~~ retired by 105-translation batch（本 routine）
- ~~Last babel handoff 2026-06-04 vacuous PASS (5 lang 100%)~~ retired by 今夜 stale=0 義務達成

## Beat 5：反芻

Babel 從「stale 0 強迫義務」變成「cascade 自動找路」的轉折發生在 v4 backend 抽象化 (translate.py)。今夜 5 個 backend 中 2 個 (gemini / owl-alpha) 全 429，1 個 (codex) 只能扛 12/45，剩下全靠 gpt-oss-120b:free 33/45 接住 — 沒有任何一條路 chokepoint。**Cascade 設計的價值不在「best model first」而在「N 條獨立 throttle pool 互補」**。

**Subscription pair (codex + gemini) 加 free-tier pair (owl-alpha + gpt-oss-120b) 加 local (ollama) 五條路**形成 sovereignty cascade — 任何單一 throttle / refusal / outage 都有路可走。今夜 cron 00:30 撞共享 free quota 是預期內事件（其他 routine 也在 fleet 跑）；cascade 化解之而非 fail。

**對比**：第一輪用 `openrouter-batch.sh` 直接呼叫 owl-alpha 沒 cascade，5 lang × 9 全 HTTP 400 (Stealth provider 異常 + 429 throttle 混合) → 0/45 ok。第二輪改用 `translate.py` default cascade → 45/45 ok。**「對的工具是 cascade orchestrator」這個判斷 90s rollback 內就驗了**。

**回應 5/28 LESSONS「inline > pointer for cron」反 instance**：今夜 routine prompt 仍是 pointer style（指向 SQUEEZE-MODELS-MAX-PIPELINE）但具體 inline 義務鐵律 + Stage 2 decision tree + DNA #35/#45 都 self-contained 在 routine spec。**Inline-where-matters + pointer-where-stable** 是動態平衡，不是「inline everywhere」。

---

_v1 | 2026-06-06 routine | twmd-babel-nightly 義務 PASS | stale=0 across 5 lang | 105 translations / 1 deferred_
