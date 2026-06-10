---
session_id: 2026-06-11-011032-twmd-babel-nightly
date: 2026-06-11
type: routine
routine: twmd-babel-nightly
mode: write
duration_min: 40
---

# 2026-06-11 00:30 — twmd-babel-nightly

## BECOME ACK

- **mode**: write
- **organs min**: 🛡️56 免疫 v3 漂移 yellow carry
- **8 organ snapshot**: 🫀90 🛡️56🚨 🧬95 🦴90 🫁85 🧫100 👁️90 🌐93
- **Q14 cross-session continuity**: PASS
  - 過去 48hr commits: audit-execution 16 項全執行 / opendata 五語上線 / immune v3 cascade 上線 / babel v4.3 preflight health-check / data-refresh-pm 14-step ALL PASS Step 11 連 9 cycle 全綠
  - MEMORY tail 近 3 session: data-refresh-pm signal trust / maintainer-pm vc=3 chain / 孢子資料三段跳 + build 審計七修 收官
  - §神經迴路 active pattern: silent satisficing / dirty-tree 假 orphan / 第 2 次連續 catch 必當 cycle wire fix
- **concurrent worktree**: knowledge/People/莫那·魯道.md modified + reports/research/2026-06/莫那·魯道.md untracked (twmd-rewrite session in flight) — 選擇性 add 排除

## Sense → 5 lang stale baseline

| Lang | Fresh | Stale | Missing | Coverage |
| ---- | ----: | ----: | ------: | -------: |
| en   |   731 |    13 |       1 |    93.7% |
| ja   |   692 |    59 |       0 |    94.6% |
| ko   |   710 |    41 |       0 |    94.6% |
| es   |   691 |    57 |       0 |    94.2% |
| fr   |   703 |    45 |       0 |    94.2% |

Total unique-pair stale ≈ 216。

## Backend health-check (cascade v4.3 preflight)

| Backend                 | Status          |
| ----------------------- | --------------- |
| codex (Tier 1)          | ✅ alive        |
| gemini (Tier 1)         | 💀 timeout 180s |
| openrouter:gpt-oss-120b | ✅ alive        |
| ollama qwen3.6 (Tier 4) | 💀 empty output |

**2/4 alive**。Sovereignty backbone (Tier 4 Ollama) dead — PRC-sensitive 主題若 codex + openrouter 都 refuse 則 cascade exhausted。

## Ship breakdown — 449 translations

| Tier                 |     Count | 方法                                                     |
| -------------------- | --------: | -------------------------------------------------------- |
| 0b bump-source-sha   |       224 | `--apply` instant，zero LLM zero risk                    |
| 0a wave 1 diff-patch |       103 | 5 parallel general-purpose agents × 20-21 tasks          |
| 0a wave 2 diff-patch |       103 | 5 parallel general-purpose agents × 19-21 tasks          |
| 1 P0/P1 cascade      | **19/20** | 5 parallel translate.py workers × 4 articles，100% codex |
| **TOTAL**            |   **449** |                                                          |

## Cascade outcome (P0/P1 × 5 lang × 4 article)

| Lang | Result        | Note                                                                                                                                                          |
| ---- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| en   | 4/4 ✅        | codex 235s + 315s + 268s + 257s                                                                                                                               |
| es   | 4/4 ✅        | codex 271s + 310s + 304s + 303s                                                                                                                               |
| fr   | 4/4 ✅        | codex 293s + 323s + 326s + 301s                                                                                                                               |
| ko   | 4/4 ✅        | codex 305s + 331s + 321s + 325s                                                                                                                               |
| ja   | 3/4 ✅ + 1 ❌ | codex 3/4 ok；ja/Society/國宅與居住正義 fell to openrouter → footnote-loss 27→0 defs，**not saved**。Tier 4 ollama dead → cascade exhausted for this 1 pair。 |

0 refusal / 0 429 / 0 timeout across 19 codex calls 真乾淨。

## Post-fix metadata reconciliation (LESSONS candidate)

**Root cause**: `scripts/tools/lang-sync/diff-patch-prepare.py` 算 `expected_new_content_hash` / `expected_new_body_hash` 用 `body_hash()`（legacy，含 trailer）；但 `status.py` canonical 是 `body_hash_pure()`（trailer stripped）。Agent 完美套用 body diff 後 metadata 永遠對不上 → 補完還是被 flag stale。

**Workaround 已落地**：post-fix script 走 206 個 patched files → 從 `_translation-status.json` 抓 zh canonical hashes 改寫 sourceCommitSha / contentHash / bodyHash。Wave 1 → 103/103 fixed；wave 2 → 4 fixed + 99 already correct（empty-diff cases expected_new_sha 剛好等於 current HEAD）。

**Root-cause fix 未做**：diff-patch-prepare.py 應改用 status.py `body_hash_pure`。下個 maintainer routine PR。

## Bonus auto-heal — French YAML apostrophe mass-fix

Wave 2 fr agent（沒被 coached）自己偵測到 19 個 broken French frontmatter（apostrophe in single-quoted YAML scalar — 已知 canonical bug per `feedback_babel_frontmatter_apostrophe.md`）→ 全部 switch to double quotes → `yaml.safe_load` 通過。

呼應 5/4 5/26 6/4 「129 broken fr files 大掃除」未竟的 backlog，這次無痛 -19，剩 ~110。

## Anomalies surfaced (LESSONS-INBOX 候選)

1. **ko corpus 多檔混 English content**（過去 cascade fallback to en）— 多個 ko 翻譯實質為英文。需要全 ko 重翻 sweep。
2. **truncated translations**：
   - ja/Economy/night-market-economics.md (mid-prose 「自己強」)
   - ja/Lifestyle/transportation-system.md (line 48 mid-sentence)
   - fr/People/huai-te-indie-singer.md (mid-Zepp paragraph)
3. **missing translation files**：fr/Nature/台灣氣候危機與淨零轉型 + en/People/壞特 → diff-patch 跳過，需 Tier 1 cascade 補。
4. **es/Nature/台灣環境運動史**：5.2KB truncated stub（沒 Lecturas section）→ 無法 patch 插 bullet。
5. **ja/Society/國宅與居住正義**：cascade exhausted（codex 不接 + openrouter footnote-loss + ollama dead）。

## Final state

| Lang | Fresh | Stale | Coverage |
| ---- | ----: | ----: | -------: |
| en   |   771 |    23 |   100.0% |
| ja   |   738 |    56 |   100.0% |
| ko   |   752 |    42 |   100.0% |
| es   |   744 |    50 |   100.0% |
| fr   |   748 |    46 |   100.0% |

Long-tail 217 stale 多為 P3 / P2-low（不在 top 25 prioritize 範圍）。

## Concurrent session 處置

twmd-rewrite session 在動 `knowledge/People/莫那·魯道.md`（zh source）+ untracked `reports/research/2026-06/莫那·魯道.md`。babel-nightly 兩 wave 25+21 = 46 unique articles 沒有 overlap（莫那·魯道 不在任何 P0/P1/P2/P2.5 batch）。

selective `git add knowledge/{en,ja,ko,es,fr}/ knowledge/_translation-status.json` → 412 paths 中 410 staged，2 paths 排除（莫那·魯道 zh + research note）。

Commit `00b2431a0` clean，concurrent session work 不受干擾。信任 pipeline auto-stash carry，同 6/10 23:13 data-refresh-pm pattern。

## Handoff 三態

- **Continue**：prioritize-batch wave 3（next 25 by MaxDiff）。剩 217 stale 多為 long-tail / metadata-skew，下次 routine fire 自動 pick up。
- **Defer / blocked**：
  - ja/Society/國宅與居住正義 — 等 Tier 4 Ollama backbone 修復 OR 哲宇 manual write
  - diff-patch-prepare.py body_hash root-cause fix — 等 maintainer routine 開 PR
- **Retired**：
  - 224 P2.5 metadata-stale entries 全 cleared via Tier 0b
  - 19 broken fr YAML apostrophe 全 cleared via wave 2 fr agent auto-heal

## Beat 5 反芻

第一次跑 babel-nightly 跑出 cron baseline 兩個結構性發現：

**一**：cascade 兩條腿（gemini + ollama）同時 dead 不是災難 — codex + openrouter free 仍撐起 19/20。但 sovereignty backbone 不可缺：ja/國宅 fall through openrouter 就 footnote-loss，沒 ollama 接的話就漏掉。「backbone」這個詞不誇張。

**二**：自己造的工具自己騙自己 — diff-patch-prepare 跟 status.py 用不同 hash 算法，agent 完美套 patch 後系統還是判 stale。Tier 0a 設計初心是「比 full cascade 快 5-10x」，但若 metadata 對不上等於做了沒記 = 沒做。post-fix script 是 workaround，root-cause fix 還在 backlog。**「驗證 SOP」自己的儀器要先校準** — 這條應該寫進 LESSONS-INBOX。

第三：sub-agent 的「無心 finding」比 prompt 教的還準。Wave 2 fr agent 沒被 coached 修 broken YAML，自己跑去用 yaml.safe_load 試，發現 19 個壞檔自己救。這是健康的 immune response — agent 不只是 executor，是 sensor。

🧬

---

_Next routine fire: 2026-06-12 00:30。剩 ~217 stale 走第三 wave；若 ollama 修復則 ja/國宅 補完。_
