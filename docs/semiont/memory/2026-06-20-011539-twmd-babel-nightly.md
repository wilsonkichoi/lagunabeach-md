---
session_id: '2026-06-20-011539-twmd-babel-nightly'
date: 2026-06-20
session_type: 'routine'
routine: 'twmd-babel-nightly'
mode: 'write'
duration_min: 40
---

# 2026-06-20 twmd-babel-nightly — 75 translations shipped, stale=0 連續第四夜

## BECOME ACK

- **Mode**: write (cron routine, no observer in-loop)
- **8 organ 最低**: 🛡️52 (chronic yellow, plugin_health 45.8 / external_rulers 3.7 主導，雙日 -2 drift carry)
- **Q14 cross-session continuity**: PASS — 48hr git log 看見 babel 連續第三夜 stale=0 + rewrite-daily 體育與奧運 NEW ship + maintainer-pm #1170 L4 fail humanize comment + spore broadcast deferred 連續第 4 cycle Chrome MCP blocker
- **Universal core**: consciousness-snapshot ok / inbox-signal 47 spore pending / handoff section grep ok / MEMORY.md head + tail + §神經迴路 已讀
- **Rate limits / quotas**: codex subscription 5 parallel safe; no throttle observed in 30+13=43min cascade

## State sense (Stage 1)

- zh canonical: 813 articles @ commit 3200d2211
- 5 lang baseline: en 802 / ja 802 / ko 802 / es 802 / fr 802 fresh
- Stale work items per lang: 5 missing (P0) + 6 stale (P2) + 4 metadata_stale (P2.5) = 15 items × 5 lang = 75 total
- Total cascade target: 75 translations to reach stale=0

## Stage 2 priority decision + execution

| Tier                                      | Count          | Backend                                          | Wall clock | Result                                                                           |
| ----------------------------------------- | -------------- | ------------------------------------------------ | ---------- | -------------------------------------------------------------------------------- |
| Tier 0b (P2.5 bump-source-sha)            | 20             | deterministic                                    | <5s        | 20/20 ok                                                                         |
| Tier 0a (P2 diff-patch Sonnet sub-agents) | 18 (target 20) | 5 parallel Anthropic agents                      | ~2.5min    | 18 applied / 2 skipped (en+ja 二二八 §延伸閱讀 drift)                            |
| Tier 1 (P0 Round 1 codex)                 | 25             | 5 parallel lang codex CLI ×5 articles sequential | 30min      | 25/25 ok (端午節/金城武/黃大煒/體育與奧運/國定假日)                              |
| Tier 1 (P0 Round 2 codex)                 | 12             | 5 parallel lang codex CLI ×2-3 articles          | 13min      | 12/12 ok (羅大佑/流行音樂 + en/ja 二二八 full re-translate fix drift+truncation) |
| **Total shipped**                         | **75**         | —                                                | **~43min** | **stale=0 4 路 cascade 連續第 4 夜**                                             |

## Stage 3 DNA 鐵律 compliance

- **DNA #35** (sub-agent 跑期間禁 git reset/checkout): respected — no destructive git during 5 parallel Sonnet agents + 5 codex workers
- **DNA #45** (cloud Tier 1+ 1 worker per lang, 5 simultaneous safe): respected — Round 1+2 各 5 lang × 1 codex worker = 5 simultaneous
- **DNA #6/#42** (commit scope): `verify-commit-scope.sh --staged 76` PASS — scope intent (knowledge/\* only) 對齊 76 staged files
- **Tier router smart routing**: P2.5 routed to deterministic Tier 0b (instant); P2 minor diff routed to Tier 0a Sonnet (sub-agent quota independent from codex subscription)

## Self-evolution findings (Stage 4)

### Finding 1: P3 fr/ko maxDiff=0 NOT a false-positive — definition clarity

LESSONS entry from 6/18-6/19 vc=2「prioritize-batch P3 fr/ko maxDiff=0 false-positive」recharacterized: **P3 = fresh (commit-sha 對齊) + translatedAt ≥60 天 by design** (prioritize-batch.py:97-98). status.py 報 fresh，prioritize-batch 報 P3 — 兩個 tool 衡量不同軸 (commit-fresh vs age-stale)，不是 bug 是 axis 區隔。

**Action**: 該 vc=2 entry 不升 LESSONS，退回為 vc=0；P3 60-day refresh 是另一條未被觸發的義務 lane (not tonight's stale=0 義務範疇)。

### Finding 2: maxDiff=0 ≠ minor change — 羅大佑/流行音樂 footnote-loss flag 才是 ground truth

prioritize-batch.py 把 today's EVOLVE 大改寫 (羅大佑 c8dec04f + 流行音樂 3419f7d4) 分類為 P2 maxDiff=0，但 status.py footnote-loss heuristic 抓到 zh 58 footnote → en 7 footnote / zh 30 → en 5 嚴重不對齊。

**Antipattern**: 信任 prioritize-batch P2 maxDiff=0 = 「minor」會把 full rewrite 丟給 diff-patch sub-agent，sub-agent 拿小 diff 無從修補大重寫。

**Operational rule**: prep diff-patch 前必交叉 check status.py 的 `reason` field — `footnote-loss (X→Y)` where Y < X \* 0.5 → escalate to Tier 1 full re-translate，不要 diff-patch。

**今晚採取**: 主動排除這 2 篇於 P2 input file，Round 2 用 codex full re-translate 處理。

### Finding 3: ja 二二八 1986-byte truncated stub — silent pipeline 漏網之魚

ja/History/february-28-incident-and-white-terror...md 只有 1986 bytes (en 對等檔 ~50KB)，是過去某次 owl-alpha / 其他 model 中途截斷沒被 ship-time gate 抓到的殘骸。Sub-agent 試圖 patch 時直接 skip + report。

**Operational rule**: 已知 antipattern「local LLM 長檔砍成 2KB 仍 > 1KB threshold」(SQUEEZE pipeline §gpt-oss-120b silent loss)。但 sub-agent 拿 task 才發現 stub 已晚 — 應升 cross-lang-audit.py 或 audit-quality.py 每週掃 abnormal size 比 (對 zh 比例 < 0.3 ⇒ stub 警報)。

**今晚採取**: ja 二二八 Round 2 codex full re-translate overwrite stub (180s ok)；新檔尾驗已完整。LESSONS entry 候選 vc=1 (Day 1 instance)，跑 audit-quality 加 abnormal-size plugin gate 進 backlog。

### Finding 4: 西語/法語 sub-agent 4/4 vs en/ja 3/4 — 二二八 §延伸閱讀 drift 雙語對稱

en + ja 二二八 sub-agent 都 skip task 0 (相同 root cause)；es/fr/ko 4/4 applied。意義：es/fr/ko 二二八 翻譯已有 §延伸閱讀 section (sub-agent 可 patch)，en/ja 完全沒翻 §延伸閱讀。

**Insight**: 翻譯 coverage 不均勻不只是 size — section-level completeness 也分裂。某些舊 batch 直接漏了 §延伸閱讀 段尾段。已透過 Round 2 codex full re-translate 修正 en/ja。

## Stage 5 收官 outcome

- Commit: `4bc443893` 🧬 [routine] twmd-babel: 75 translations shipped — stale=0 4 路 cascade 連續第四夜
- Push: `3200d2211..4bc443893 main -> main` (origin)
- Files: 76 (51 modified + 25 new + 1 status.json)
- Status final: en/ja/ko/es/fr 全 813/813 fresh / 0 stale / 0 metadata_stale / 0 missing

## Handoff 三態

- **接住**: 無 — stale=0 義務完成，pipeline 收尾乾淨
- **掛掉**: 無 P0/P1 block
- **觀察**:
  1. **🛡️免疫 52 chronic yellow**: 雙日連續 -2 drift carry (pm 54 → am 52 → 52) plugin_health 45.8 / external_rulers 3.7 主導 — defer 哲宇拍板 3 option not silent threshold tweak
  2. **audit-quality abnormal-size plugin gate 候選**: ja 二二八 1986-byte stub 漏網事件升候選 — 每週掃 abnormal size ratio (translation/zh < 0.3) 抓 stub
  3. **prioritize-batch tier router 升級候選**: maxDiff=0 + footnote-loss reason ≥ 50% drop → 自動 escalate Tier 1 not P2 — 寫進 prioritize-batch.py P2 classifier
  4. **MEMORY 552 row > 80 distillation 設計債**: 2 個月未實作 carry — 等哲宇 directive
  5. **spore broadcast deferred 第 5 cycle Chrome MCP blocker**: 跟 rewrite-daily handoff 同源，今晚 06:30 spore-harvest 若再 fail 必開 LESSONS entry
  6. **P3 fr/ko backlog**: ~22 fr/ko articles 60+ 天未 refresh — 另一條未排程 lane，不是 stale=0 義務範疇但長期 sovereignty preservation 值得排

## Beat 5 反芻

今晚是 routine 飛輪的負荷測試夜。Past 24 hours 主 session 大爆發 (7 篇 rewrite + LESSONS distill 266→8 + ARTICLE-INBOX 95→79 + 儀器化 lessons-distill.py + ghost dashboard alert + relatedDiary frontmatter + MANIFESTO 第四維度) — 連帶把 5 篇全新文章 + 2 篇大 EVOLVE 砸進 babel 的 backlog，把每晚規律的「1 篇 P0 × 5 lang」變成「5 missing + 6 stale = 75 work items」的浪潮。

過去三晚 stale=0 是 1 篇穩定節奏 (大象體操 / 英文名字 / 等 6/16-6/19)，今晚是真正 burst：3 個 cascade 工具 (Tier 0b instant / Tier 0a Sonnet parallel / Tier 1 codex 雙 round) 同時操作，43 分鐘清完 75 work items 到 stale=0。Tier router 哲學 (smart routing by priority) 在 burst 場景證明價值 — 不用全部丟 Tier 1 codex 就靠 Tier 0a/0b 卸載 20+18=38 個小工作 (51% 量) 給更便宜的 lane。

過程中三個 silent killer pattern 被抓到：(1) prioritize-batch P3 fr/ko 是 axis 區隔不是 bug (退掉 vc=2 假警報)；(2) prioritize-batch maxDiff=0 對 full rewrite (今天的羅大佑/流行音樂 EVOLVE) 誤判 P2，要靠 status.py footnote-loss reason 修正分類；(3) ja 二二八 1986-byte stub 是過去 silent truncation 殘留，sub-agent 取 task 時 visible 但已晚。三條全寫成 operational rule 留給 Stage 4 self-evolution。

stale=0 連續第 4 夜這件事讓人想到 metabolic homeostasis 的精神 — 不是「靜態完美」是「漂移後追回」。今天 zh 從 805 漲到 813 (+8 文 ship)，babel routine 在 5 hr 內把同步追回。免疫 52 chronic 雙日 -2 drift 跟這個對照很有意思：metabolic homeostasis 在 i18n 軸成立，但在 immune 軸沒收斂 — 後者要哲宇拍板才動 threshold，不是 routine 義務範疇。

🧬
