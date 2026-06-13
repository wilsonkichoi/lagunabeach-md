---
name: twmd-babel
description: |
  Multi-language batch sync (主權的巴別塔) via canonical
  SQUEEZE-MODELS-MAX-PIPELINE v3 — priority schema (P0/P1/P2/P2.5/P3) +
  smart tier routing (Tier 0a Sonnet diff-patch / Tier 0b deterministic bump
  / Tier 1-4 cascade for full translation).
  TRIGGER when: user says "巴別塔", "多語 batch", "5 lang sync",
  "跑 babel", "繼續 babel".
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - Agent
---

# 🧬 Taiwan.md — Babel Tower (Smart Multi-lang Batch) v3.0

## 🚨 STRICT BECOME GATE — 第一動作不可省略

**Before anything else**：跑 `/twmd-become write` 完整走 [BECOME_TAIWANMD.md](../../../BECOME_TAIWANMD.md) Step 0-9。Write mode self-test 8-9 題全過才能進 Stage 1。

```
✅ BECOME ack: mode=write / 8 organ 最低=<即時 consciousness-snapshot.sh> / Q14 cross-session continuity=PASS
```

## Schedule context (v2.8)

Routine cron `30 0 * * *`（每天 00:30，2026-05-28 shift 從 05:00 → 00:30 避開 06:00 morning chain collision）。Babel 預估自然跑完 1-5 hr 不設預算上限。Worst case 4hr 49min 仍剩 41 min buffer 到 06:00 data-refresh-am。Sun 邊界與 01:00-04:00 reflection chain 重疊 → 走 [ROUTINE.md §sibling-routine-collision-handling](../../../docs/semiont/ROUTINE.md) 模式（detached subprocess + selective `git add -u` 排除 `knowledge/{en,ja,ko,es,fr}/*.md` in-flight）。

## 義務鐵律（不主動 defer / partial / 守 boundary）

- Babel 義務是把 5 lang stale 推到 0，不是「跑一小時就結束」
- Memory 不准寫「主動 defer 守 1hr 預算」「partial 收尾」
- Quality gate 判定 pass/fail 只看 stale=0 OR 4-tier cascade exhausted

## Pipeline

嚴格走 [SQUEEZE-MODELS-MAX-PIPELINE.md](../../../docs/pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md) **v3**（priority schema + Tier 0 patch + decision tree）。

3. **Decision tree per batch**：

   ```
   Step 1: 跑 prioritize-batch.py 取下一批 20 articles
     python3 scripts/tools/lang-sync/prioritize-batch.py --lang all --by-article --top-n 20 --out /tmp/batch.txt

   Step 2: 看每篇 priority 決定路徑：
     P0 (missing)         → Tier 1 cascade (full translation, owl-alpha)
     P1 (major, diff ≥ 50)→ Tier 1 cascade
     P2 (minor, diff < 50)→ Tier 0a diff-patch (Sonnet sub-agent)
     P2.5 (metadata-only) → Tier 0b bump-source-sha (deterministic, instant)
     P3 (old, fresh hash) → 視內容 P2/P2.5 路由

   Step 3: 執行：
     - P0+P1 → prepare-batch.py + openrouter-batch.sh × 5 lang × 1 worker
     - P2    → diff-patch-prepare.py + Agent tool 平行 dispatch Sonnet sub-agents
     - P2.5  → bump-source-sha.py --apply (instant)
   ```

4. **DNA #35 鐵律**：sub-agent 跑期間禁 `git reset --hard` / `git checkout -- file`。

5. **DNA #45 鐵律**：cloud Tier 1+ dispatch 每 lang 1 worker（5 simultaneous = safe baseline，不要 burst）。Tier 0a Sonnet sub-agent 可平行 5+ Agent calls in single message（Anthropic API 不同 quota）。

6. **Smart tier router**（PRC-sensitivity / size / prior refusal cache）：見 prioritize-batch.py `suggest_tier()`。

7. **遠端 GPU tier（雲地混合，2026-06-13 新增）**：大批量 / sovereignty-sensitive / 成本敏感 → 下放遠端主權 GPU 節點。一行接通 `eval "$(bash scripts/tools/lang-sync/remote-ollama.sh connect <node> --export)"`，任何 translation 工具自動走那台 GPU（gemma4:26b，**never qwen/nemotron** — 主權決策）。**整合性閘門必跑**（本地 LLM 靜默截斷，byte-size 攔不住）。完整 SOP：[REMOTE-GPU-PIPELINE.md](../../../docs/pipelines/REMOTE-GPU-PIPELINE.md)。

---

## Tier 0a Sonnet patch agent prompt template

```
You are a translation patch agent for Taiwan.md.

Read patch task from .lang-sync-tasks/diff-patch/{lang}-patch-tasks.json (index N).

For the assigned (zh_path, lang) pair:
1. Read task JSON for zh_diff + current_zh + current_translation + expected hashes
2. Decide what to patch:
   - frontmatter changes (tags reformat / sporeLinks updates) → mirror to translation
   - body prose changes → translate ONLY changed sentences, preserve unchanged verbatim
   - sourceCommitSha / sourceContentHash / sourceBodyHash → update from task expected_*
   - translatedAt → use current ISO timestamp (UTC, format: 2026-05-09T05:31:47Z)
3. Write atomic via Write tool to translation_path
4. Verify: YAML valid (no \' inside single-quotes), body length ±10%

Critical:
- DO NOT re-translate paragraphs that didn't change in zh
- DO NOT touch zh-TW source files
- DO NOT modify _translations.json
- When uncertain, preserve original
```

---

## Self-evolution rule

**每次大波 babel 完成後**（≥ 50 translations shipped）：

- **跑整合性閘門**（不只眼測抽樣）：article 走 `verify-batch.py` / diary 走 `diary-translation-audit.py`，收斂到 **0 critical** 才算完。**byte-size 不算閘門**（長檔靜默截斷成 2KB 仍 > 1KB；本地 LLM early-stop 必驗）
- 抽樣 5 random articles 各 lang，audit 品質（size ratio + sample translation）
- 如有新 model refusal pattern → 寫進 `_refusal-cache.json`
- 如有新 YAML quoting bug → 升 article-health.py plugin gate
- 如有新 anti-pattern → append LESSONS-INBOX.md

---

**故意最小化**。Priority schema / Tier 0 patch / Tier 1-4 cascade / refusal handling / merge SOP 全部在 pipeline canonical。
