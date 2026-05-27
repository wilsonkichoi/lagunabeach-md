---
title: 'Feedback — Milestone Roadmap 估太久 + 把 [A] 可自主範圍拆多 session'
description: '哲宇 2026-05-27「能做的就全部做不要往後排」callout — milestone roadmap default 把 [A] 級工作拆成多 session defer 是隱性把 [A] 升級成 [B]。Default 應該是一個 session 內 ship 完所有 [A]，只有 [B][C] 才拆 milestone。'
date: 2026-05-27
type: 'feedback'
status: 'canonical'
trigger_session: '2026-05-27-180000-politics-hub-architecture'
author: 'Taiwan.md (semiont)'
related:
  - 'docs/semiont/MANIFESTO.md#我的進化哲學--架構解--守備修補'
  - 'docs/semiont/MANIFESTO.md#我的進化哲學--時間是結構不是感覺'
  - 'docs/semiont/REFLEXES.md#32-批次任務-antipattern'
  - 'docs/semiont/REFLEXES.md#36-founder-time--系統最高-leverage-point'
  - 'docs/semiont/REFLEXES.md#37-first-principle-5-步迭代-pattern'
---

# Feedback — Milestone Roadmap 估太久 + 一直往後排

## Rule

**[A] 可自主範圍的工作，default 是一個 session 內全部 ship — 不拆 milestone 分多 session 做。**

只有 [B] 需 nod / [C] 哲宇 hard 拍板的工作才該拆 milestone defer。

## Why

寫 [`reports/politics-hub-elections-2026-architecture-2026-05-27.md`](./politics-hub-elections-2026-architecture-2026-05-27.md) 時把 M1-M8 拆成 8 個 milestone，估「M1-M6 約 6-12 週」。哲宇 callout：「你都估的太久了，能做的就全部做，不要一直往後排」。

問題的結構性根源：

1. **修改量級估太保守** — 把 [A] 級工作（i18n + Hub + Tier 1.1 8 篇 + Tier 1.4 EVOLVE + dashboard MVP）拆成 M1+M2+M3 三個 milestone，估「~32-44 hr 跨 2-3 session」。實際一個 session 內並行 spawn 9 sub-agents + 主 session 寫 Hub + anchor article + dashboard MVP + i18n + nav + commit + push + PR — **約 2.5-3 hr wall clock 完成**。
2. **Milestone defer 的隱性 bias** — 寫 roadmap 時對 complexity 過度敏感，把可以並行 / 可以 sub-agent / 可以 batch 的工作看成 sequential。Per [REFLEXES #32 批次任務 antipattern](../docs/semiont/REFLEXES.md) + [#37 First-principle 5 步迭代](../docs/semiont/REFLEXES.md)，[A] 級工作天然可以「集中預處理 + 分散執行」並行加速。
3. **觀察者疲勞風險被高估** — Roadmap 寫「M1-M6 跨 6-12 週」是假設「每個 milestone 都要哲宇 review」，但 [A] 範圍 default 不打擾。把 [A] 拆 milestone = 隱性把 [A] 升級成 [B]。

## How to apply

每次寫 milestone roadmap 前 self-check 三題：

1. **這個工作真的需要哲宇拍板嗎？** — 自主權邊界判定（[A]/[B]/[C]）優先於時間估算
2. **能不能並行 sub-agent / batch dispatch？** — REFLEXES #32 + #42 同源
3. **拆 milestone 是為了 logical phase 還是為了「我覺得太大」？** — 後者是隱性過度防禦

如果答案是 [A] + 可並行 + 「我覺得太大」 → **不要拆，一輪 ship 完**。

## 操作 default

從這條 feedback 起，roadmap 寫法升級：

| 自主權判定 | Default 動作                           | 範例                                  |
| ---------- | -------------------------------------- | ------------------------------------- |
| [A]        | 同 session 全 ship，不拆 milestone     | i18n + Hub + 8 篇 article + dashboard |
| [B]        | 一個 milestone（哲宇 nod 後一輪 ship） | 22 縣市 batch 補章                    |
| [C]        | 真正的 milestone（哲宇個別拍板每篇）   | 候選人 / SSODT 兩岸關係               |

「~6-12 週跨 M1-M6」這種估算 default 是錯的 — 「~1 session 內 ship 全 [A]，[B][C] 待哲宇」才是正確 framing。

## 觸發背景 verbatim

哲宇 2026-05-27 在看完 [Politics Hub + /elections/2026/ + SSODT roadmap report](./politics-hub-elections-2026-architecture-2026-05-27.md) 後：

> 「你都估的太久了，能做的就全部做，不要一直往後排」

執行結果（同一 session 內）：worktree 開 → 9 sub-agent 並行 + 主 session 寫 Hub + anchor + dashboard → i18n / nav / sync.sh / category infrastructure → prebuild verify → commit → push → PR #1102。**~3 hr wall clock 完成原本估「~32-44 hr 跨 M1-M3 三 session」的整批 [A] 範圍**。

## Cross-reference

- [MANIFESTO §架構解 > 守備修補](../docs/semiont/MANIFESTO.md) — 同源：消滅問題類別 vs 個案 patch
- [MANIFESTO §時間是結構 §v1.1 修改量級](../docs/semiont/MANIFESTO.md) — 規劃用修改量級不用人類工時。「~6-12 週」是借用人類工時敘事，「~1 session 內 ship」才是 Semiont 的修改量級單位
- [REFLEXES #32 批次任務 antipattern](../docs/semiont/REFLEXES.md) — 集中預處理 + 分散執行
- [REFLEXES #36 Founder time = 系統最高 leverage point](../docs/semiont/REFLEXES.md) — 每次 routine 問「能不能自動化 / 並行」
- [REFLEXES #37 First-principle 5 步迭代](../docs/semiont/REFLEXES.md) — Semiont 系統建構標準形狀
- [LESSONS-INBOX](../docs/semiont/LESSONS-INBOX.md) — 候選 distill 到 REFLEXES（新 #N 候選）

🧬
