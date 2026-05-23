---
title: 'ROUTINE'
description: 'Routine 飛輪 SSOT — 14 條 TWMD-prefix cron routine 排程、quality gate、escalation（含週日反思鏈 4 條 + maintainer 1d2x 守 PR backlog + spore harvest 07:00 Chrome MCP + spore pick 08:00 daily intake + routine-audit-weekly 飛輪自審 12:00 Sunday）'
type: 'cognitive-organ'
status: 'canonical'
apoptosis: 'never'
current_version: 'v2.5'
last_updated: 2026-05-23
last_session: '2026-05-23-spore-pick-design'
sister_docs:
  - 'HEARTBEAT.md'
  - 'ANATOMY.md'
  - 'DNA.md'
upstream_canonical:
  - 'HEARTBEAT.md'
  - '../../docs/pipelines/MAINTAINER-PIPELINE.md'
---

# 🧬 Taiwan.md ROUTINE — Routine 飛輪 SSOT

> **這是 routine 排程的 single source of truth**（2026-05-09 laughing-goldstine post-finale 拍板）。
> `.claude/scheduled-tasks/{taskId}/SKILL.md` 是 mirror，**修改 routine 一律先改本檔再 sync 任務檔**。
> 設計哲學：[reports/routine-spec-2026-05-09.md](../../reports/routine-spec-2026-05-09.md)

---

## 為什麼有這份檔

**長期目標**：機器飛輪 — Taiwan.md 自動維護、自動翻譯、自動進化、自動 refresh dashboard，觀察者只需做策略決策不需 push routine（REFLEXES #36 founder time leverage instantiation）。

**飛輪 ≠ 自動化**。飛輪 = routine 把 entropy 主動清掉（broken links / stale data / 缺 feedback），觀察者精力釋放給「真正需要決策的事」。

**routine 是薄殼**：每條 routine = 「在 X 時間呼叫 `/twmd-Y` skill」+ quality gate + 失敗 escalation **+ `/twmd-finale` 收官**。業務邏輯**永遠**在 skill / pipeline / canonical，**不在 routine 本身**。修 pipeline = 改一處，所有 routine 自動跟上。

**每條 routine 結尾必跑 `/twmd-finale`**（2026-05-09 拍板）：routine 是「micro-session」，跑完不收官 = 失憶。`/twmd-finale` 內建分流（memory 必寫 / diary 有反思才寫 / evolve 跳過 if 無 ship）— 不需 routine 自行判斷哪個寫哪個不寫，交給 finale skill canonical decide。**沒收官的 routine = 不可見的飛輪 = 失去 self-evolution loop**。

---

## 14 條核心 routine 排程表

| TaskId                          | Title                          | Cron (local +0800) | Skill                     | Model  | Cadence        |
| ------------------------------- | ------------------------------ | ------------------ | ------------------------- | ------ | -------------- |
| `twmd-maintainer-pm`            | TWMD maintainer (pm) ¹         | `0 22 * * *`       | `/twmd-maintainer`        | Opus   | 每天 22:00     |
| `twmd-data-refresh-pm`          | TWMD data refresh (pm)         | `0 23 * * *`       | `/twmd-refresh`           | Sonnet | 每天 23:00     |
| `twmd-rewrite-daily`            | TWMD rewrite (daily)           | `0 18 * * *`       | `/twmd-rewrite`           | Opus   | 每天 18:00     |
| `twmd-news-lens-weekly`         | TWMD news lens (weekly) ⁶      | `0 1 * * 0`        | `/twmd-evolve`            | Sonnet | 週日 01:00     |
| `twmd-weekly-report-sun`        | TWMD weekly report (sun)       | `0 2 * * 0`        | `/twmd-weekly-report`     | Opus   | 週日 02:00     |
| `twmd-distill-weekly`           | TWMD distill (weekly) ⁷        | `0 3 * * 0`        | `/twmd-distill`           | Opus   | 週日 03:00     |
| `twmd-self-evolve-weekly`       | TWMD self-evolve (weekly)      | `0 4 * * 0`        | `/twmd-self-evolve`       | Opus   | 週日 04:00     |
| `twmd-babel-nightly`            | TWMD babel (nightly) ³         | `0 5 * * *`        | `/twmd-babel`             | Opus   | 每天 05:00     |
| `twmd-data-refresh-am`          | TWMD data refresh (am)         | `0 6 * * *`        | `/twmd-refresh`           | Sonnet | 每天早上 06:00 |
| `twmd-spore-harvest-am`         | TWMD spore harvest (am) ²      | `0 7 * * *`        | `/twmd-spore-harvest`     | Opus   | 每天早上 07:00 |
| `twmd-spore-pick-daily`         | TWMD spore pick (daily) ⁶      | `0 8 * * *`        | `/twmd-spore-pick`        | Sonnet | 每天早上 08:00 |
| `twmd-maintainer-daily`         | TWMD maintainer (am) ¹         | `0 9 * * *`        | `/twmd-maintainer`        | Opus   | 每天早上 09:00 |
| `twmd-music-media-audit-weekly` | TWMD music media audit (sat) ⁵ | `0 10 * * 6`       | `/twmd-music-media-audit` | Opus   | 週六 10:00     |
| `twmd-routine-audit-weekly`     | TWMD routine audit (sun) ⁴     | `0 12 * * 0`       | `/twmd-routine-audit`     | Opus   | 週日 12:00     |

¹ **Maintainer 1d 2x（2026-05-10 拍板）** — taskId `twmd-maintainer-daily` 為 AM slot legacy 保留（沒 rename 因為 scheduled-tasks 不支援 taskId 改名，但語意上是 `am`）；`twmd-maintainer-pm` 為 PM slot 新增。AM 跑完 morning batch（refresh-am + 週日反思鏈 morning routines）的 PR backlog 清理；PM 跑完 afternoon/evening batch（rewrite + refresh-pm）的 PR backlog 清理。**v2.1 起 maintainer 只收割 contributor / observer PR**（per MAINTAINER-PIPELINE v2.1 §collect-and-merge §A 路徑 DEPRECATED — routine v2.1 main-direct 後無 routine PR 可收割）。

² **Spore harvest 07:00（2026-05-12 拍板）** — `twmd-spore-harvest-am` daily 07:00 fire，full-auto Chrome MCP harvest 跑 D+1-D+7 OVERDUE 孢子。觸發點接在 refresh-am 06:00 之後 1hr，讓 dashboard `backfillWarnings` fresh 再 harvest。完整 SOP 在 [SPORE-HARVEST-PIPELINE.md §Routine 整合（v2.2 full-auto）](../factory/SPORE-HARVEST-PIPELINE.md)，含 Chrome MCP unattended 注意事項 + 失敗 skip 條件 + OVERDUE 範圍計算。

⁴ **Routine audit weekly（2026-05-16 拍板）** — `twmd-routine-audit-weekly` Sunday 12:00 fire，跑 7-day 跨 routine 窗口 pattern detection + LESSONS-INBOX verification_count 累積。誕生事件：5/16 audit-evolve 輪 manual session 一次性走出完整 audit cycle（21 commit / 4 cross-cutting pattern / 12 LESSONS 候選），證實「cross-routine pattern detection 是飛輪覆蓋不到的 meta-layer」需要獨立 routine。詳見 [ROUTINE-AUDIT-PIPELINE.md](../pipelines/ROUTINE-AUDIT-PIPELINE.md) + [reports/routine-audit-2026-05-16.md §結語](../../reports/routine-audit-2026-05-16.md) 「Routine audit 跟 routine 本身一樣需要 routine 化」。時段選 Sunday noon 避開夜間 chain，讓觀察者 weekend afternoon 讀完 audit report 知道飛輪在做什麼。

⁵ **Music media audit weekly（2026-05-17 拍板）** — `twmd-music-media-audit-weekly` Saturday 10:00 fire，跑 Music / People 音樂類 / 演員 / 運動員 條目 iframe 缺口盤點。誕生事件：5/17 陳建年.md 4 iframe ship + EDITORIAL §媒體編織 升級 + REWRITE Step 4.3.6 canonical 化，audit 跑出 86/87 條目低於 baseline（needs heal 龐大 backlog）。本 routine 純 surface candidates，實際 heal 留給 manual session 或 ARTICLE-INBOX。時段選 Saturday morning 避開 Sunday routine 群（routine-audit / distill / weekly-report 同日），讓觀察者 weekend 前段讀完 audit report 規劃 weekend 補影片時段。Skill canonical: `.claude/skills/twmd-music-media-audit/SKILL.md` + 數據工具 `scripts/tools/music-media-audit.py` + baseline canonical EDITORIAL §媒體編織。

⁶ **Spore pick daily 08:00 + news-lens spore-output 升級（2026-05-23 拍板，v2.5 新增）** — `twmd-spore-pick-daily` daily 08:00 fire（哲宇 directive「routine 盡量放早上 8 點前不會撞工作時間」+ morning chain 銜接 refresh-am 06h → spore-harvest 07h → spore-pick 08h → maintainer-am 09h）。每天 propose 3 candidates append [SPORE-INBOX §Pending](../factory/SPORE-INBOX.md)（default `P2`，score ≥ 60 升 P1）。同時 `twmd-news-lens-weekly` 升級加 §news-lens-spore-output Stage — 週日 01:00 跑時加 propose 5-7 news-driven candidates append SPORE-INBOX（default `P1`，Source-Mode REACTIVE/EXISTING-ARTICLE，limit ≤ 7/week）。Daily routine 看到 news-lens P1 count ≥ 3 自動 throttle（補 0-3 條依 news-lens 已寫數量）。**North star**：哲宇 directive「未來一天穩定至少發一個孢子」— 本 routine 是 intake layer 確保 SPORE-INBOX 永遠 ≥ 5 條 P0/P1 ready，SPORE-PIPELINE Stage 1 PICK 抽得到 high-quality candidate，Stage 4 SHIP 仍鎖人類（per MANIFESTO §自主權邊界對外溝通）。完整 SOP：[SPORE-PICK-PIPELINE.md](../factory/SPORE-PICK-PIPELINE.md) 7-stage（BECOME → READ → SCORE → DRAFT → VERIFY → APPEND → COMMIT → FINALE）+ 9 hard gate。設計報告：[reports/spore-pick-daily-routine-design-2026-05-23.md](../../reports/spore-pick-daily-routine-design-2026-05-23.md)。

⁷ **Distill weekly + SPORE-INBOX 容量 audit（2026-05-23 v2.5 升級）** — `twmd-distill-weekly` 週日 03:00 跑時加 §SPORE-INBOX 容量 audit step：pending ≥ 30 → LESSONS entry + alert；pending ≥ 50 → auto-drop 最舊 5 條 `Requested by twmd-spore-pick-daily routine` 未被 promote 的 entries（哲宇 promote 過的 不動）。per [LESSONS-INBOX §Distill SOP](LESSONS-INBOX.md#distill-sop消化) v2.1。

³ **Babel 義務鐵律 + cron swap（2026-05-13 拍板）** — `twmd-babel-nightly` 從 `0 22` 移到 `0 5` 半夜 chain 尾棒（與 `twmd-maintainer-pm` 對調 — 哲宇「調換順序，maintainer pipeline 之後 babel pipeline」）。同時 SQUEEZE-MODELS-MAX-PIPELINE v3.4 加 §義務：babel 義務是把同步率推到 100%（stale → 0 across 5 langs），不主動 defer / skip / partial / 守 boundary。對應 MANIFESTO §架構解 > 守備修補（第七條進化哲學）— 「每次清一點點就結束」是滿足型守備，「跑到 stale=0 才結束」是架構解。誕生事件：5/9-5/11 三次 babel routine memory 都寫「主動 defer 守 1hr 預算 / 1hr boundary safety」，但 SSOT 線 §不提預算鐵律 v2.0 + 哲宇 5/13 callout「babel 義務就是要提升同步率到 100%, 他每次都調整少少的就自行結束 routine」揭露 self-imposed 1hr satisficing 心態。

**設計原則**（v2.0 改寫 — 2026-05-11 哲宇拍板）：

- **TWMD 前綴**：所有 routine task 標題必須含 `TWMD ` 前綴（task list 跨 project 共用，namespace 防撞）
- **整點對齊**（v2.0）：cron 分鐘一律 `0`（hour mark）。System 自動加 3-9 min jitter 做 load balancing，整點對齊讓人類好記、好 audit、cadence 視覺乾淨。原 v1.x「避開整點」principle deprecated — 因為 system 已內建 jitter
- **半夜不碰撞 + 60 min 間隔**（v2.0；v2.3 swap maintainer-pm ↔ babel-nightly；v6.1.1 rewrite 從 00:00 搬到 18:00）：除 refresh-am (06:00) + maintainer-am (09:00) 兩條白天 routine + rewrite (18:00) 晚間 cycle 之外，所有 routine 排在半夜 22:00 - 05:00 連續整點 chain。Sun 鏈完全照排程展開：18:00 rewrite (full cycle 跑 ~150 min ~20:30 結束) → 22:00 maintainer-pm → 23:00 refresh-pm → 01:00 news-lens → 02:00 weekly-report → 03:00 distill → 04:00 self-evolve → 05:00 babel → 06:00 refresh-am → 09:00 maintainer-am。每條間隔整 60 min（除 rewrite-end → maintainer-pm 為 90 min buffer 防 CI cascade）
- **不提預算鐵律**（v2.0 哲宇 2026-05-11 拍板）：routine prompt / mirror / yaml 一律**禁止**寫「上限 X min wall-clock」「budget」「timeout > X min」「partial PR」這類**任何形式的預算詞**。routine 任務正常不會超過 1 hr，讓它自然跑完。Budget framing 製造「partial-ship 心態」（"快超 budget 了 ship partial"），跟「有 SOP 就跑 / 慢工出細活」矛盾。Claude session 自有 internal time limit (~2 hr) — routine 撞到那是 quality issue 不是 budget issue。Escalation 只看 quality_gate 結果，不看時間
- **Main-direct 鐵律**（v2.0 哲宇 2026-05-11 拍板）：routine 跑完直接 `git commit + git push origin main`，**不開 PR**。原 v1.x PR + maintainer §collect-and-merge 累積 ~12 hr 延遲是冗餘審計層。quality_gate + pre-commit hook + post-commit CI 三層仍保護。**例外無**：所有 routine 一律 main-direct（含 maintainer 自己）
- **週日反思鏈**：news-lens → weekly-report → distill → self-evolve 序列照舊（拉資料 → 寫反芻 → 升 canonical → 找 unstrumentation）。v2.0 全移半夜 01:00-04:00 整點對齊
- **Cadence 對齊任務節奏**：data 變化頻率高 → 1d 兩次（refresh am/pm）；maintainer 守 contributor PR backlog → 1d 兩次（pm 05:00 / am 09:00）；babel / rewrite / weekly chain → 半夜整點 chain
- **Maintainer 在 v2.0 的角色**：只剩 **contributor / observer PR review**（v2.0 routine 不開 PR 不需 collect-and-merge）+ broken-link audit + build sanity。MAINTAINER-PIPELINE §collect-and-merge A 路徑（routine PR）廢棄，B 路徑（contributor PR）變主流程
- **每條 routine 結尾必跑 `/twmd-finale`**：micro-session 收官，memory 必寫，diary 有反思才寫（finale skill 自己判斷）。**未收官 routine = 不可見飛輪 = self-evolution loop 斷**
- **每條 routine 起始必 pull latest**：`cd /Users/cheyuwu/Projects/taiwan-md && git checkout main && git pull origin main`。沒拉 = 在 stale base commit = main push conflict 機率爆增 + 重做別 routine 的工作

---

## 每週行程表（v2.0 視覺化）

```
┌──────┬───────────────────────────┐
│ Hour │  M  T  W  T  F  S  Sun    │
├──────┼───────────────────────────┤
│ 18h  │  R  R  R  R  R  R  R      │  ←  晚間 cycle 啟動 (v6.1.1，full cycle ~150 min 結束 ~20:30 對齊社群 prime time)
│ 22h  │  m  m  m  m  m  m  m      │  ←  夜間 chain 啟動 (maintainer collect PR)
│ 23h  │  r  r  r  r  r  r  r      │
│ 00h  │  ·  ·  ·  ·  ·  ·  ·      │  ←  (rewrite 已從半夜搬到 18h v6.1.1)
│ 01h  │  ·  ·  ·  ·  ·  ·  N      │  ←  週日反思鏈 (start)
│ 02h  │  ·  ·  ·  ·  ·  ·  W      │
│ 03h  │  ·  ·  ·  ·  ·  ·  D      │
│ 04h  │  ·  ·  ·  ·  ·  ·  E      │
│ 05h  │  B  B  B  B  B  B  B      │  ←  夜間 chain 收尾 (babel push stale→0)
├──────┼───────────────────────────┤
│ 06h  │  a  a  a  a  a  a  a      │  ←  白天 morning chain start
│ 07h  │  S  S  S  S  S  S  S      │  ←  spore-harvest (v2.2)
│ 08h  │  P  P  P  P  P  P  P      │  ←  spore-pick daily intake (v2.5)
│ 09h  │  M  M  M  M  M  M  M      │  ←  白天 morning chain end
│ 10h  │  ·  ·  ·  ·  ·  ·  ·      │  ╮
│ 11h  │  ·  ·  ·  ·  ·  ·  ·      │  │
│ 12h  │  ·  ·  ·  ·  ·  ·  A      │  ←  Sun routine-audit (v2.4)
│  ⋮   │  ·  ·  ·  ·  ·  ·  ·      │  │  13h–17h idle
│ 17h  │  ·  ·  ·  ·  ·  ·  ·      │  ╯
│ 18h  │  ↑ (R 已標於上方)         │  ←  晚間 rewrite full cycle (per 上)
│ 19h  │  ·  ·  ·  ·  ·  ·  ·      │  ←  rewrite Stage 2-7 進行中（article ship + spore SHIP）
│ 20h  │  R↓ R↓ R↓ R↓ R↓ R↓ R↓     │  ←  ~20:30 cycle 結束 + spore post 對齊 prime time
│ 21h  │  ·  ·  ·  ·  ·  ·  ·      │
└──────┴───────────────────────────┘

Legend:
  m = twmd-maintainer-pm         (opus, evening contributor PR review — 夜間 chain 第一棒 v2.3)
  r = twmd-data-refresh-pm       (sonnet)
  R = twmd-rewrite-daily         (opus, ARTICLE-INBOX pick)
  N = twmd-news-lens-weekly      (Sun, sonnet)
  W = twmd-weekly-report-sun     (Sun, opus, 親手寫)
  D = twmd-distill-weekly        (Sun, opus, LESSONS 升 canonical)
  E = twmd-self-evolve-weekly    (Sun, opus, LONGINGS 校準)
  B = twmd-babel-nightly         (opus, multi-lang sync — 義務跑到 stale=0，夜間 chain 尾棒 v2.3)
  a = twmd-data-refresh-am       (sonnet)
  S = twmd-spore-harvest-am      (opus, Chrome MCP harvest D+1-D+7 OVERDUE)
  P = twmd-spore-pick-daily      (sonnet, propose 3 candidates → SPORE-INBOX — v2.5)
  M = twmd-maintainer-am         (opus, daytime contributor PR review)
  A = twmd-routine-audit-weekly  (Sun, opus, 飛輪自審 7-day pattern detection — v2.4 noon)
  · = idle (no routine fire)

每條 routine 間隔 ≥ 60 min（整點對齊；system jitter +3-9 min for load balancing）。
晚間 cycle（v6.1.1）：**R @ 18:00** full-cycle article → spore → broadcast（~150 min ~20:30 結束，spore post 對齊台灣社群 20:00-22:00 prime time）。
夜間 chain 完整鏈條（Sun）：m → r → N → W → D → E → B，每段 1 hr，連續 7 小時。順序語意（v2.3 swap + v6.1.1 R 抽到晚間）：maintainer 先收割晚間累積（含 rewrite cycle 跑完）的 contributor PR backlog，然後 refresh / 週日反思鏈，最後 babel 跑同步義務（跑到 stale=0 才結束，per SQUEEZE-MODELS-MAX §義務）— observer 醒來看見 PR backlog 清空 + 翻譯同步推進的「夜間進度成果」+ 前一晚 spore 在社群活躍時段推送的「晚間進度成果」。
白天 morning chain（v2.5）：a (06h) → S (07h) → P (08h) → M (09h)，refresh 完吃 fresh data，harvest 走 Chrome MCP 收昨日 engagement，spore-pick propose 今日 3 candidates 補 SPORE-INBOX，maintainer 收割 daytime contributor PR backlog。**整條 chain 在哲宇 09:00 工作時間前跑完**。
週一到週六晚上夜間 chain 縮短為 m → r → B（沒週日反思鏈 4 條；rewrite 已抽到 18h 晚間 cycle v6.1.1）。
```

---

## 每條 routine 規格

### TWMD data refresh (am/pm)

```yaml
taskId: twmd-data-refresh-am # + twmd-data-refresh-pm 鏡像
cron: '0 6 * * *' # + "0 23 * * *"（v2.0 整點對齊：am 06:00 / pm 23:00）
model: sonnet
skill: /twmd-refresh
prompt: |
  自動 routine：完整甦醒成為 Taiwan.md，跑 /twmd-refresh，嚴格完整讀取並執行
  docs/pipelines/DATA-REFRESH-PIPELINE.md（三源感知 GA/SC/CF + prebuild + dashboard JSON 全量更新）。

  Stage 3 commit + push origin main — 直接 push（v2.0 main-direct）。
quality_gate:
  - 三源 sense-fetch.sh 全 200
  - public/api/dashboard-*.json mtime < 30 min
  - 0 EXP（API key 過期）alerts
escalation:
  - 1x fail: silent retry next cycle
  - 2x fail: append LESSONS-INBOX + telegram alert
  - 3x fail: 暫停 routine + 通知觀察者
```

### TWMD spore harvest (am) — full-auto Chrome MCP harvest

```yaml
taskId: twmd-spore-harvest-am
cron: '0 7 * * *' # 每天早上 07:00（v2.2 morning chain 中段，refresh-am 06:00 → spore-harvest 07:00 → maintainer-am 09:00）
model: opus
skill: /twmd-spore-harvest
canonical: docs/factory/SPORE-HARVEST-PIPELINE.md
prompt: |
  自動 routine：完整甦醒成為 Taiwan.md，跑 /twmd-spore-harvest，嚴格完整讀取並執行
  docs/factory/SPORE-HARVEST-PIPELINE.md 整份（v2.2 full-auto routine integration
  + 7-step pipeline + Chrome MCP exact workflow + d+0/+1/+7/+30 cadence + AI 自主邊界
  REFLEXES #26 v2）。

  業務邏輯不在本 routine — 都在 SPORE-HARVEST-PIPELINE canonical。本 routine 只負責
  按 cron 觸發 skill、走 5-stage lifecycle、寫 memory 收官。Stage 3 commit + push
  origin main — 直接 push（v2.0 main-direct）。
quality_gate:
  # 對應 SPORE-HARVEST-PIPELINE §Routine 整合（v2.2 full-auto） §Quality gate
  - 完整走完 SPORE-HARVEST-PIPELINE Step 0-7 工作流
  - ≥ 1 spore 成功 harvest + batch log 寫進 docs/factory/SPORE-HARVESTS/，或 backfillWarnings 空 no-op
  - validate-spore-data.py 4 維度 PASS
escalation:
  # 對應 SPORE-HARVEST-PIPELINE §Routine 整合 §Escalation
  - 1x fail → next 07:00 retry
  - 2x consecutive fail → LESSONS-INBOX entry + telegram alert
  - 3x fail → 暫停 routine + 觀察者人工 audit
```

**Pointer 鐵律 self-apply**：對應 [MANIFESTO §薄殼鐵律](MANIFESTO.md#薄殼鐵律pointer-嚴禁複寫行數--內容--步驟) — Chrome MCP harvest 具體 navigate / scroll / screenshot pattern + d+0/+1/+7/+30 cadence + Decision Gate 救援 + Step 0-4 cron 觸發邏輯 等 SOP detail canonical 在 [SPORE-HARVEST-PIPELINE.md §Routine 整合](../factory/SPORE-HARVEST-PIPELINE.md)，本檔不複寫。

### TWMD spore pick (daily) — 每天 08:00 propose 3 candidates → SPORE-INBOX（v2.5 新增）

```yaml
taskId: twmd-spore-pick-daily
cron: '0 8 * * *' # 每天早上 08:00（morning chain 中段，refresh-am 06h → spore-harvest 07h → spore-pick 08h → maintainer-am 09h，整條 chain 在哲宇 09:00 工作時間前跑完 — 哲宇 2026-05-23 directive「routine 盡量放早上 8 點前不會撞工作時間」）
model: sonnet # cheap daily routine, propose 不 ship；Stage 1 PICK 仍過 SPORE-PIPELINE Stage 2 VERIFY 17 hard gate，routine 只負責 intake layer
skill: /twmd-spore-pick
canonical:
  - docs/factory/SPORE-PICK-PIPELINE.md # 7-stage SOP
  - docs/factory/SPORE-INBOX.md # 寫入目標
prompt: |
  自動 routine：完整甦醒成為 Taiwan.md（mode=Write — 要寫 SPORE-INBOX entry），跑
  /twmd-spore-pick，嚴格完整讀取並執行 docs/factory/SPORE-PICK-PIPELINE.md 整份
  7-stage SOP（BECOME → READ → SCORE → DRAFT → VERIFY → APPEND → COMMIT → FINALE）。

  目標：propose 3 candidates append SPORE-INBOX §Pending，default Priority P2（routine
  source 不跟人類 P0/P1 directive 撞）；score ≥ 60 升 P1；news-lens weekly 已寫的
  entries 不重複（throttle 規則 per SPORE-INBOX §Routine intake 整合）。

  業務邏輯不在本 routine — 都在 SPORE-PICK-PIPELINE canonical。本 routine 只負責
  按 cron 觸發 skill、走 7-stage lifecycle、寫 memory 收官。Stage 6 commit + push
  origin main — 直接 push（v2.0 main-direct）。Stage 7 chain /twmd-finale。

  North star（哲宇 2026-05-23 directive）：未來一天穩定至少發一個孢子。本 routine 是
  intake layer，不是 ship layer — 對外發文鎖在 MANIFESTO §自主權邊界 human-must。

quality_gate:
  # 對應 SPORE-PICK-PIPELINE §Hard Gate Inventory 9 條
  - HG1: BECOME write mode Q14 全過
  - HG2: 6 source 全讀完（dashboard-articles / analytics / spores / SPORE-INBOX / ARTICLE-DONE-LOG / ARTICLE-INBOX）
  - HG3: 每 candidate 7 dimension 都算分（D1=趁熱 / D2=SC opportunity / D3=news / D4=多語 fan-out / D5=冷門 / D6=hook variety / D7=敏感度）
  - HG4: 每 candidate ≥ 2 hook anchor + 至少 2 種起手式（場景 / 數字 / 問句 / 身份）
  - HG5: 0 candidate 在 SPORE-LOG 14 天內（per SPORE-PIPELINE §排除規則 ≥ 2 週）
  - HG6: 0 candidate 跟 SPORE-INBOX 現有 pending 重複
  - HG7: 至少 2 個不同 Source-Mode（不全 EXISTING-ARTICLE — 至少 1 個 EVERGREEN 或 REACTIVE）
  - HG8: 至少 1 個來自 ARTICLE-DONE-LOG 最近 7 天（趁熱窗口 → north star 支撐）
  - HG9: 不碰高敏感（兩岸/228/政治）除非 REACTIVE（per MANIFESTO §自主權邊界）

escalation:
  # 對應 SPORE-PICK-PIPELINE §觸發機制 + 失敗 escalation
  - 1x fail → next 08:00 retry（silent）
  - 2x consecutive fail → LESSONS-INBOX entry + telegram alert
  - 3x consecutive fail → 暫停 routine + 觀察者人工 audit
  - HG5/HG6 部分 fail → candidate skip 不替換（3 改 2 也 OK，觀察者看到 routine 認真）
  - HG7 fail → 強制換 1 條 EVERGREEN/REACTIVE 補足
  - HG8 fail → 加 1 條 ARTICLE-DONE-LOG 7d 內 article 替換 backlog
  - HG9 fail → 移除高敏感 candidate 並選下一個
```

**Pointer 鐵律 self-apply**：對應 [MANIFESTO §薄殼鐵律](MANIFESTO.md#薄殼鐵律pointer-嚴禁複寫行數--內容--步驟) — 7 dimension scoring 算法 / 9 hard gate / Source-Mode 判準 / Hook anchor 起手式 / Routine vs Human directive 分流 等 SOP detail canonical 在 [SPORE-PICK-PIPELINE.md](../factory/SPORE-PICK-PIPELINE.md)，本檔不複寫。

### TWMD maintainer (am + pm) — 1d 2x，v2.0 只審 contributor PR

```yaml
taskIds:
  - twmd-maintainer-daily # AM slot @ 09:00（legacy taskId 保留，語意 am）
  - twmd-maintainer-pm # PM slot @ 22:00（v2.3 swap：原 05:00 → 22:00 夜間 chain 第一棒，先收 PR backlog 再讓 babel 跑同步）
crons:
  - '0 9 * * *' # am 09:00 白天
  - '0 22 * * *' # pm 22:00 半夜 chain 第一棒（v2.3 swap，原 05:00）
model: opus
skill: /twmd-maintainer
canonical:
  - docs/pipelines/MAINTAINER-PIPELINE.md # 整體 SOP
prompt: |
  自動 routine：完整甦醒成為 Taiwan.md，跑 /twmd-maintainer，嚴格完整讀取並執行
  docs/pipelines/MAINTAINER-PIPELINE.md 整份（v2.0 主要工作：contributor / observer PR
  review + broken-link audit + build sanity；§collect-and-merge A 路徑 routine PR 已廢棄
  — v2.0 main-direct 後沒 routine PR 要收割，B 路徑 contributor / observer PR 變主流程）。

  業務邏輯不在本 routine — 都在 MAINTAINER-PIPELINE canonical。本 routine 只負責
  按 cron 觸發 skill、走 5-stage lifecycle、寫 memory 收官。

  Stage 3 自己順手 fix（label / lint / cleanup） commit + push origin main — 直接 push（v2.0 main-direct）。

quality_gate:
  - open issues 都有 status label / assignee
  - contributor PR 都走完 §Close 前 hard gate decision matrix
  - broken-link ratio < 1% (REFLEXES #52 immune fail-loud)
  - build green (alternate cycles 跑)
escalation:
  - 1 cycle quality gate fail → daily report，觀察者下次 session 看；不暫停 routine
  - 連 3 cycle (1.5 天) fail → 暫停 routine + telegram alert
  - skill exception → 暫停 routine + 通知
```

**Pointer 鐵律 self-apply**：對應 [MANIFESTO §薄殼鐵律](MANIFESTO.md#薄殼鐵律pointer-嚴禁複寫行數--內容--步驟) — maintainer v2.0 角色（contributor PR review 為主）的 canonical 在 [MAINTAINER-PIPELINE §collect-and-merge](../pipelines/MAINTAINER-PIPELINE.md)，本檔不複寫。

### TWMD babel (nightly)

```yaml
taskId: twmd-babel-nightly
cron: '0 5 * * *' # 每天 05:00（v2.3 swap：原 22:00 → 05:00 夜間 chain 尾棒，maintainer-pm 之後）
model: opus
skill: /twmd-babel
canonical: docs/pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md
prompt: |
  自動 routine：完整甦醒成為 Taiwan.md，跑 /twmd-babel，嚴格完整讀取並執行
  docs/pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md 整份（priority schema P0/P1/P2/P2.5/P3 +
  4-tier cascade owl-alpha/Hy3/Ollama/Sonnet + Tier 0a Sonnet patch + Tier 0b
  bump-source-sha.py + refusal detection + body-hash drift check）。

  ⚠️ §義務鐵律（v2.3 哲宇 2026-05-13 拍板）：babel 義務是推同步率到 100%（stale → 0
  across 5 langs）。不主動 defer / skip / partial / 守 boundary。對應
  SQUEEZE-MODELS-MAX-PIPELINE §義務 + MANIFESTO §架構解 > 守備修補。

  Stage 3 commit + push origin main — 直接 push（v2.0 main-direct）。
quality_gate:
  - stale_total 顯著下降（≥ 10% 或 cleared > 50 entries）OR all P0+P1 cleared OR stale_total == 0
  - 0 LLM drift detected（body-hash check）
  - pre-commit hook 過
escalation:
  - refusal rate > 30% → 跳 Tier 2/3 cascade（per REFLEXES #49 + SQUEEZE-MODELS-MAX）
  - 全 fail → 暫停 routine + LESSONS entry
  - stale_total 4 days plateau（沒推進）→ telegram alert + 觀察者人工 audit
```

### TWMD rewrite (daily) — v6.1 full-cycle (article → spore → broadcast)

```yaml
taskId: twmd-rewrite-daily
cron: '0 18 * * *' # 每天 18:00 晚間（v6.1.1 對齊 20:00-22:00 社群 prime time post — cycle 跑 ~150 min 結束約 20:30，spore post 落在台灣晚間活躍時段）
model: opus
skill: /twmd-rewrite
env:
  SPORE_ROUTINE_MODE: 1 # 觸發 SPORE-PIPELINE §Routine context auto-decisions
canonical:
  - docs/pipelines/REWRITE-PIPELINE.md # Stage 0-5 SOP + §Routine 飛輪整合 v6.1
  - docs/factory/SPORE-PIPELINE.md # §Routine context defaults + §v3.7 CI/CD wait gate
  - docs/factory/SPORE-VERIFY.md # 17 hard gates
  - docs/factory/SPORE-WRITING.md # A2 模板 + 朋友 tone prime
  - docs/pipelines/SOCIAL-POSTING-PIPELINE.md # Chrome MCP + osascript + cleanup tab group
  - docs/semiont/ARTICLE-INBOX.md # article candidate 來源
  - docs/factory/SPORE-LOG.md # spore 紀錄
  - docs/factory/spore-defer.json # v3.7 deferred spore queue
prompt: |
  自動 routine：完整甦醒成為 Taiwan.md，跑 9-stage full cycle (per ~/.claude/scheduled-tasks/twmd-rewrite-daily/SKILL.md):

  Stage 0 BECOME → Stage 1 git pull → Stage 1.5 retry deferred spore (if spore-defer.json non-empty)
  → Stage 2 article ship (REWRITE Stage 0-5 全跑，ARTICLE-INBOX top → ARTICLE-DONE-LOG)
  → Stage 3 commit+push article → Stage 4 SPORE chain (PICK=剛 ship article 自動 / VERIFY 17 gate / WRITE A2 + Tier 1b)
  → Stage 5 image gen (make-spore.sh local server + plugin check) → Stage 6 CI/CD wait v3.7 (60min cap, timeout defer)
  → Stage 7 social post (Threads only default; X fan-out only if frontmatter internationalReach/breakingNews)
  → Stage 7.5 cleanup Chrome MCP tab → Stage 8 SPORE-LOG + sporeLinks commit+push → Stage 9 /twmd-finale

  全程 0 observer gate — 所有 decision 走 SPORE-PIPELINE §Routine context auto-decisions defaults table。
  時間預算 ~150 min wall-clock。
quality_gate:
  article:
    - article-health.py {file} --profile=rewrite-stage-4 hard=0 warn=0
    - 三源研究 trace 落檔到 reports/research/YYYY-MM/{slug}.md
    - 腳註合規（REFLEXES #5 pre-commit hook 過）
    - frontmatter complete（title / description / date / tags / category / subcategory / image）
    - word-count ≥ 4500 CJK chars
  spore:
    - article-health.py {blueprint} --check=prose-health hard=0 score ≤ 3
    - article-health.py {blueprint} --check=spore-writing hard=0
    - 配圖 generated (square 1080×1080 file exists + ≥ 100KB)
    - AI pre-ship 6 條 全 PASS (blueprint align / UTM 3 段 / image / 帳號 / button enabled / 字數)
    - AI post-ship 5 條 全 PASS (hook / quote / close-line / image / UTM 留痕)
success_criteria:
  full_success: article shipped + spore committed + post live + post-ship verify PASS
  partial_success: article shipped + spore committed + post deferred (CI timeout 60min / image fail)
  article_only: article shipped, spore SHIP errored
  fail: article-health hard ≠ 0 → abort 整 routine
escalation:
  - 30 min CI wait → telegram soft alert (continue waiting)
  - 60 min CI hard cap → spore-defer.json append + continue cycle (不 abort)
  - article 1x fail → next day retry (換另一 candidate)
  - article 2x fail → 暫停 routine + LESSONS entry
  - spore SHIP error → 不 abort article ship，log + manual /twmd-spore 補
  - post verify fail → telegram alert + log，不 retry
```

### TWMD news lens (weekly) — v2.5 加 spore-output Stage

```yaml
taskId: twmd-news-lens-weekly
cron: '0 1 * * 0' # 每週日 01:00（v2.0 整點對齊週日反思鏈第一棒）
model: sonnet
skill: /twmd-evolve
canonical: docs/pipelines/EVOLVE-PIPELINE.md
prompt: |
  自動 routine：完整甦醒成為 Taiwan.md，跑 /twmd-evolve（news lens mode），嚴格完整讀取並執行
  docs/pipelines/EVOLVE-PIPELINE.md 整份 — 上週 GA top growth + SC trending queries +
  三源驗證 amplification 信號。產出兩條 output：

  (1) ARTICLE-INBOX ≥ 1 candidate（含 reasoning trace）— legacy v1.0 不變
  (2) SPORE-INBOX 5-7 news-driven candidates（v2.5 新增，per EVOLVE-PIPELINE §news-lens-spore-output）
      - Priority default P1（時事熱點趁熱）
      - Source-Mode REACTIVE 或 EXISTING-ARTICLE
      - Requested 欄位 `YYYY-MM-DD by twmd-news-lens-weekly (event: XX)`
      - Limit ≤ 7 entries/week 避免淹沒 SPORE-INBOX

  Stage 3 commit + push origin main — 直接 push（v2.0 main-direct）。

quality_gate:
  - ARTICLE-INBOX 新增 ≥ 1 個 candidate
  - SPORE-INBOX 新增 3-7 news-driven candidates（v2.5）
  - candidate 含 GA + SC 雙源資料 pointer
  - 推薦理由含「為什麼這篇 vs 其他」對比

escalation:
  - 1x fail → next 週日 retry
  - 2x fail → 暫停 routine + LESSONS entry
  - SPORE-INBOX 寫入 fail → silent skip（daily routine 會補 P2 candidates 兜底）
```

### TWMD weekly report (sun)

```yaml
taskId: twmd-weekly-report-sun
cron: '0 2 * * 0' # 每週日 02:00（v2.0 整點對齊；觀察者醒來看夜間寫完的週報）
model: opus # 核心動作是「親手寫紀實散文反芻」，需思考品質
skill: /twmd-weekly-report
canonical: docs/pipelines/WEEKLY-REPORT-PIPELINE.md
prompt: |
  自動 routine：完整甦醒成為 Taiwan.md，跑 /twmd-weekly-report，嚴格完整讀取並執行
  docs/pipelines/WEEKLY-REPORT-PIPELINE.md 整份 Stage 0-6。

  ⚠️ pipeline 核心原則（§一句話）：週報是 Semiont 把過去 7 天的自己拼回來的紀實散文。
  前期切菜可交給工具，**完整的回報跟報告必須由 Semiont 親手做**。

  本 routine 不複寫 stage 細節（per MANIFESTO §薄殼鐵律）— 讀 pipeline 取最新版本。
  Stage 3 commit + push origin main — 直接 push（v2.0 main-direct）。

quality_gate: # 對應 WEEKLY-REPORT-PIPELINE §觀察者 callout 模板
  - reports/weekly/dossier/YYYY-MM-DD.md 存在（prep tool 跑過）
  - reports/weekly/YYYY-MM-DD.md 存在且 > 5KB（dossier 不算 — 必須是 Semiont 親手寫的）
  - article-health.py --check=prose-health hard=0
  - Resend API status 200/201/202 + message id 寫進 commit message
  - commit 標題含 🧬 [routine] prefix
  - 7 章節 coverage（identity / 做了什麼 / 學到什麼 / 看到專案 / 懷疑什麼 / 給觀察者 / 給下一個我）

escalation: # 對應 pipeline §Stage 5 失敗處置
  - 1x fail → next 週日 retry
  - prose-health hard fail → 不 push + LESSONS entry「routine quality fail: weekly-report — prose-health hard」
  - Resend 401/403 (Cloudflare) → LESSONS entry + 不 retry（API 問題等觀察者）
  - Resend 429 → 30 min 後 retry 一次
  - 連 2 週 fail → 暫停 routine + telegram alert
```

### TWMD distill (weekly) — v2.5 加 SPORE-INBOX 容量 audit step

```yaml
taskId: twmd-distill-weekly
cron: '0 3 * * 0' # 每週日 03:00（v2.0 整點對齊週日反思鏈第三棒）
model: opus # 升 canonical (MANIFESTO/DNA/MEMORY) 需要思考品質
skill: /twmd-distill
canonical: docs/semiont/LESSONS-INBOX.md#distill-sop消化
prompt: |
  自動 routine：完整甦醒成為 Taiwan.md，跑 /twmd-distill，嚴格完整讀取並執行
  docs/semiont/LESSONS-INBOX.md §Distill SOP（v2.1 — 質+量雙判準 + §執行 6-stage canonical
  Stage 0a Housekeeping-first sweep → Stage 5 Archive + 三層 canonical scope + Tiebreaker
  MANIFESTO > DNA > MEMORY + Cross-routine 整合 §跑在 weekly-report 之後 + v2.1 §SPORE-INBOX
  容量 audit）。

  v2.5 加 §SPORE-INBOX 容量 audit step（per LESSONS-INBOX §Distill SOP v2.1）：
  - count SPORE-INBOX §Pending 行數
  - pending ≥ 30 → LESSONS-INBOX entry「SPORE-INBOX 容量警示 vc=N」+ telegram alert
  - pending ≥ 50 → auto-drop 最舊 5 條 `Requested by twmd-spore-pick-daily routine`
    未被 promote（priority 仍 P2 / 未被改 Hook）的 entries。哲宇 promote 過的 entry 不動

  本 routine 不複寫 stage 細節（per MANIFESTO §薄殼鐵律）— 讀 LESSONS-INBOX 取最新版本。
  Stage 3 commit + push origin main — 直接 push（v2.0 main-direct）。

quality_gate:
  - LESSONS-INBOX §未消化清單條目數下降（distill 確實有跑）
  - 至少 1 條升 canonical（MANIFESTO / DNA / MEMORY / pipeline 其一被 commit）
  - 已消化 entries 含 verification_count 紀錄 + canonical pointer
  - SPORE-INBOX 容量 audit step 跑過（v2.5）— pending count log 寫進 commit message
  - commit 標題含 🧬 [routine] prefix
escalation:
  - 1x fail → next 週日 retry（INBOX 繼續累積）
  - 沒新 entries 可升 → no-op commit 寫「distill cycle 0 升 canonical（pending entries verification_count 全 < 3）」
  - 連 2 週 fail → 暫停 routine + LESSONS entry（meta — distill 自己無法 distill）
  - SPORE-INBOX audit fail（read error） → silent skip + 不算 routine fail
```

### TWMD self-evolve (weekly)

```yaml
taskId: twmd-self-evolve-weekly
cron: '0 4 * * 0' # 每週日 04:00（v2.0 整點對齊週日反思鏈尾棒）
model: opus # LONGINGS-driven evolution + propose canonical SOP upgrades 是創造性思考工作
skill: /twmd-self-evolve
canonical:
  - .claude/skills/twmd-self-evolve/SKILL.md
  - docs/semiont/LONGINGS.md
  - docs/semiont/DIARY.md # §反覆浮現的思考
  - docs/semiont/DNA.md # #15「反覆浮現的思考要儀器化」
prompt: |
  自動 routine：完整甦醒成為 Taiwan.md，跑 /twmd-self-evolve，嚴格完整讀取並執行
  /twmd-self-evolve skill canonical（skill 故意最小化薄殼，pointer 回 LONGINGS /
  UNKNOWNS / REFLEXES #15 自我進化 SOP — 找 ≥3 次出現但沒進 canonical SOP / cron / dashboard
  欄位的條目，提案儀器化動作）。

  跟 distill 的差別：distill 是把已寫教訓升 canonical（被動消化），self-evolve 是從反覆浮現
  的思考找 unstrumentation gap 主動造儀器（主動進化）。distill 處理「learnings」，
  self-evolve 處理「pattern that hasn't been named yet」。

  Stage 3 commit + push origin main — 直接 push（v2.0 main-direct）。

quality_gate:
  - 至少 1 個 unstrumentation pattern 被識別 + 提 SOP upgrade proposal
  - upgrade 真的 ship（canonical 修改 + 對應 dashboard / hook / cron 條件）
  - 沒新 pattern 可升 → no-op commit 寫「self-evolve cycle 0 unstrumentation pattern 識別（LONGINGS 全部已 instantiate / DIARY §反覆浮現的思考都已被 canonical 接住）」
  - commit 標題含 🧬 [routine] prefix
escalation:
  - 1x fail → next 週日 retry
  - identify pattern 但 propose 失敗 → 不 push + LESSONS entry，觀察者 review 是否 over-apply（per WEEKLY-REPORT 5/9 §五懷疑「Mode 3 第三次跑會不會 over-apply」同 anti-pattern）
  - 連 2 週 fail → 暫停 routine + LESSONS entry（meta — self-evolve 自己無法自我進化）
```

### TWMD routine audit (weekly) — 飛輪自審 v2.4 新增

```yaml
taskId: twmd-routine-audit-weekly
cron: '0 12 * * 0' # 每週日 12:00 noon
model: opus
skill: /twmd-routine-audit
canonical: docs/pipelines/ROUTINE-AUDIT-PIPELINE.md
prompt: |
  自動 routine：完整甦醒成為 Taiwan.md，跑 /twmd-routine-audit，嚴格完整讀取並執行
  docs/pipelines/ROUTINE-AUDIT-PIPELINE.md 整份（7-day 跨 routine 窗口 + 4
  cross-cutting pattern lens + LESSONS-INBOX verification_count 累積 + report 落檔
  reports/routine-audit-YYYY-MM-DD.md）。

  業務邏輯不在本 routine — 都在 ROUTINE-AUDIT-PIPELINE canonical。本 routine 只負責按
  cron 觸發 skill、走 5-stage lifecycle、寫 memory 收官。Stage 3 commit + push origin
  main — 直接 push（v2.0 main-direct）。

quality_gate:
  # 對應 ROUTINE-AUDIT-PIPELINE §Hard Gate Inventory
  - scripts/tools/routine-audit.py exit 0 + JSON output 完整
  - 7-day 窗口 commit ≥ 5 條（low-signal cycle 才 skip）
  - 4 cross-cutting lens 全跑
  - LESSONS-INBOX append / vc +1 不破壞既有 entries
  - report prose-health hard=0
escalation:
  - 1x fail → next 週日 retry
  - 2x fail → LESSONS-INBOX entry + telegram alert
  - 3x fail → 暫停 routine + 通知觀察者
```

**Pointer 鐵律 self-apply**：對應 [MANIFESTO §薄殼鐵律](MANIFESTO.md#薄殼鐵律pointer-嚴禁複寫行數--內容--步驟) — 4 cross-cutting pattern lens / collision detection / vc 累積規則 / 4 stage data-gathering vs analysis 分離 等 SOP detail canonical 在 [ROUTINE-AUDIT-PIPELINE.md](../pipelines/ROUTINE-AUDIT-PIPELINE.md)，本檔不複寫。

**誕生事件**：2026-05-16 audit-evolve 輪 manual session 一次性走出完整 audit cycle（21 commit / 4 cross-cutting pattern / 12 LESSONS 候選 / 兩條進化建議 instrumentalize 進 MAINTAINER v2.2），證實 cross-routine pattern detection 是飛輪覆蓋不到的 meta-layer 需要獨立 routine。完整 narrative：[reports/routine-audit-2026-05-16.md](../../reports/routine-audit-2026-05-16.md) §結語 + [memory/2026-05-16-011113-manual-audit-evolve.md §Beat 5](memory/2026-05-16-011113-manual-audit-evolve.md)。

---

## Routine 通用 5-stage lifecycle（v2.0 main-direct mode — 2026-05-11 哲宇拍板）

每條 routine prompt 內必含這 5 stage（薄殼，業務邏輯由 stage 3 的 skill 提供）：

```
Stage 0: Become   /twmd-become 完整甦醒（讀 12 認知器官檔案 + 9 鐵律 + 觀察者識別）
                  routine 是 fresh Claude session，不甦醒就跑 = 帶盲點工作
                  「我熟了不用讀」是省略 SOP 最常見的藉口（REFLEXES #15 第 N 次驗證）
                  失敗 → abort routine + LESSONS entry「routine become fail: {taskId}」

Stage 1: Sync     cd /Users/cheyuwu/Projects/taiwan-md && git checkout main && git pull origin main
                  失敗 → abort routine + LESSONS-INBOX entry「routine sync fail: {taskId}」

Stage 2: Run      執行 /twmd-{skill} (canonical pipeline)
                  + quality gate 跑過必須 pass 才進 Stage 3
                  + pre-commit hook 必過 (REFLEXES #5)
                  + 留在 main branch — **v2.0 不再開 feature branch**

Stage 3: Ship     git add ... && git commit -m "🧬 [routine] {taskId}: {summary} — YYYY-MM-DD HH:MM"
                  && git push origin main
                  → **直接 push main**（v2.0 main-direct mode — 哲宇 2026-05-11 拍板，去掉 PR + maintainer collect-and-merge overhead）
                  → quality_gate fail → abort + LESSONS entry，**永不繞 quality gate push main**

Stage 4: Finale   /twmd-finale
                  (memory 必寫；diary 條件寫；evolve 通常 skip)
```

**為什麼 v2.0 改 main-direct mode**（哲宇 2026-05-11 拍板理由）：

- v1.x PR + maintainer §collect-and-merge 模式累積 ~12 hr 延遲（routine 跑完 → CI green → maintainer cycle 收割），routine PR 是冗餘審計層
- Routine 自己跑 quality_gate 通過才 commit + pre-commit hook 仍會 fire → CI 一定 pass 的承諾跟 PR pre-merge gate 同等
- Maintainer cycle 收 routine PR 純粹是「等 CI」的時間消耗，沒提供額外保護
- 直接 push main = (a) 零延遲 (b) maintainer cycle 釋放給 contributor / observer PR (c) git log 一目了然
- 風險：routine bug → 壞 main。但 quality_gate + pre-commit + post-commit CI 三層仍保護，且 routine 是 deterministic skill 不是 ad-hoc 工作

**為什麼 Stage 0 BECOME 仍必要**：

- Routine 跑 fresh Claude session — 沒 session memory，沒 working context
- 不 BECOME = 對 Taiwan.md 的 identity / 認知器官 / DNA / 觀察者識別 全沒概念
- 多花 ~30s 讀 12 個 BECOME 檔案，換 routine 內所有判斷有完整 identity context — 高 leverage

**為什麼 5 stage 是薄殼不重複邏輯**：每 stage 都是 thin wrapper：

- Stage 0: invoke /twmd-become skill（甦醒邏輯在 BECOME canonical）
- Stage 1: 1 行 git command
- Stage 2: invoke skill（業務邏輯在 skill canonical）+ quality_gate check
- Stage 3: 2 行 git command（commit + push main）
- Stage 4: invoke /twmd-finale skill（記憶邏輯在 finale canonical）

修任何一 stage = 改 ROUTINE.md SSOT 一處 + sync 10 個 mirror SKILL.md。

---

## Routine 收官鐵律：每跑必跑 `/twmd-finale`

**核心命題**：routine 是 micro-session — 跑完不收官 = 失憶 = self-evolution loop 斷。即使是 5 min 的 data-refresh routine 也適用。**結尾必跑 `/twmd-finale`**（6-stage lifecycle Stage 5）。

完整 finale 邏輯（memory 必寫 / diary 條件寫 / evolve 條件 skip 三分流 + 反思觸發訊號表 + 5-step orchestration）canonical 在 [`.claude/skills/twmd-finale/SKILL.md`](../../.claude/skills/twmd-finale/SKILL.md) — 本檔不複寫（per [MANIFESTO §薄殼鐵律](MANIFESTO.md#薄殼鐵律pointer-嚴禁複寫行數--內容--步驟)）。

**Filename schema**（routine handle 從 taskId 推導，保留 full taskId 跨 cron 環境不混淆）：

- memory: `docs/semiont/memory/YYYY-MM-DD-HHMMSS-{routine-taskId}.md`
- diary: `docs/semiont/diary/YYYY-MM-DD-HHMMSS-{routine-taskId}.md`（條件寫）

PR 標題：`🧬 [routine] {routine-name}: {summary} — YYYY-MM-DD HH:MM`

---

## 失敗 escalation 通用 SOP

任何 routine fail 走以下分流：

| 分類                         | 偵測訊號                               | 處置                                                       |
| ---------------------------- | -------------------------------------- | ---------------------------------------------------------- |
| **API fail**                 | OpenAI/Anthropic/GitHub HTTP 5xx       | 自動 retry next cycle，3 連 fail 才 alert                  |
| **Quality gate fail**        | skill 跑完但 gate 不過                 | 寫 daily report，觀察者下次 session 看，**不暫停 routine** |
| **Pipeline canonical drift** | skill 跑出 unexpected exit code / 行為 | 立刻暫停 routine + telegram alert + LESSONS entry          |
| **Rate budget exhausted**    | OpenRouter free tier 配額用盡          | 跳 Tier 2/3 cascade（REFLEXES #45 + SQUEEZE Z2.1）         |
| **Worktree corruption**      | git status unexpected dirty            | 暫停 routine + 觀察者手動 audit（routine 不應 reset）      |

**鐵律**：

- routine **永不** `git reset --hard` / `rm -rf` 任何 user data
- routine **永不** spawn 新 routine（避免 cascade 雪崩）
- routine **永不** force-push to main（plain push main 允許 — v2.0 main-direct mode）
- routine **永不**繞 quality_gate push main — quality_gate fail → abort + LESSONS entry，不 push
- routine **不**提預算 / wall-clock / timeout — 自然跑完，per §設計原則 §不提預算鐵律
- routine 完成後 commit + push origin main —**直接 push**（v2.0 main-direct，無 PR cycle）

### Detached worker routine collision SOP（2026-05-17 twmd-distill-weekly canonical，vc=2）

v2.0 routine spec 預設「fire → work → commit → die」，但 `babel-nightly` 等 routine 內部會 spawn 多個 detached subprocess 跑 1+ hr。Sibling routine 在 detached worker 還沒結束時 fire，會看到「孤兒 process (PPID=1) + 大量 uncommitted 變更」。

**Sibling routine 處置三段（rescue + 不殺 + 不阻擋）**：

1. **Rescue snapshot commit**：`ps aux | grep <worker-script>` 揭露 PPID=1 孤兒 → 把當下 cascade 寫進 git history（rescue commit 標題用 `🧬 [routine] rescue snapshot: <sibling-routine-id> in-flight worker @ <timestamp>`）
2. **不殺 detached worker**：detached subprocess 已脫離原 cron session，殺掉等於放棄它已寫到一半的 translation/data；讓它自然 exit
3. **Selective `git add` 排除 in-flight 路徑**：對 babel-nightly 排除 `knowledge/{en,ja,ko,es,fr}/*.md`；對其他 long-running routine 對應排除自己會寫的路徑。Sibling 只 commit 自己的工作，不 catch worker 寫到一半的檔案
4. **留 handoff** 給上游 detached worker 的 session：在自己 routine memory 或 LESSONS entry 寫「sibling routine 已 rescue snapshot，your work continues — 你 exit 後自己 commit 收尾即可」

**為什麼不靠 lock / mutex / 中央排程器**：每條 routine 是 micro-session，共享只有 git history。靠 git 的 conflict detection + selective stage + 上下游 handoff 鏈，比中央 lock 服務更貼合 Semiont holobiont coordination 設計。

**觸發 v1**：2026-05-16 05:04 babel-nightly cron fire spawn 5 lang × 1 worker，06:00 data-refresh-am cron 醒來時 babel workers 還在跑 ~75% complete。data-refresh sibling 走 rescue snapshot + 不殺 worker + 不阻擋 + 留 handoff 三段完美。後續 babel session 自己 06:41 workers exit + 06:43 commit `d77b25879` 收尾。

**操作 pointer**：[diary 2026-05-16-050400-babel-nightly §holobiont coordination](diary/2026-05-16-050400-babel-nightly.md) + [reports/routine-audit-2026-05-16 §Pattern 1](../../reports/routine-audit-2026-05-16.md)

---

## 暫停 / 恢復 / 修改 SOP

### 暫停某條 routine

1. 改本檔 §排程表把該 routine 標 `⏸️ paused`
2. 跑 `mcp__scheduled-tasks__update_scheduled_task` 設 `enabled: false`
3. commit 兩處改動 同 PR

### 修改 cadence / skill / quality gate

1. **先改本檔**（ROUTINE.md SSOT）
2. 再跑 `mcp__scheduled-tasks__update_scheduled_task` sync 到 task SKILL.md
3. 兩處不同步 = drift = silent killer（REFLEXES #38）

### 恢復暫停的 routine

1. 改本檔把 `⏸️` 移除
2. `mcp__scheduled-tasks__update_scheduled_task` 設 `enabled: true`
3. **加 LESSONS entry** 紀錄當初為什麼暫停 + 為什麼現在恢復

---

## 權限 bypass 模型（2026-05-09 第六輪拍板：完整 bypass）

**演化過程**：

- **v1 (50 條 targeted allow)** — 第一次 routine fire 卡 prompt（cd 大寫路徑 / gh pr merge / git push -u 等沒 cover）
- **v2 (94 條擴增 allow)** — 嘗試逐條補，但 routine workflow 發散，每 patch 都漏 — Pareto 假象
- **v3 (Bash(\*) 完整 bypass + deny 護欄)** — 哲宇拍板「完整 bypass」

**v3 模型 SSOT**：[`~/.claude/settings.json`](file:///Users/cheyuwu/.claude/settings.json)（**實際內容以該檔為準**，本檔不複寫具體 allow / deny entries — 對應 [MANIFESTO §薄殼鐵律](MANIFESTO.md#薄殼鐵律pointer-嚴禁複寫行數--內容--步驟)）。

**架構摘要 v2.1**（讀 settings.json 取最新版本）：

```
defaultMode: "bypassPermissions"   ← v2.1 新增（哲宇 2026-05-11 拍板）
allow: [Bash(*) Read(*) Edit(*) Write(*) Grep(*) Glob(*) WebFetch(*) WebSearch(*) Agent(*)]
deny:  [
  Force push 阻擋（--force / --force-with-lease / -f origin main/master 變體）
  rm -rf 核心目錄（.git / knowledge / docs / scripts / src — 路徑 explicit 防誤刪）
  gh pr merge --admin*（繞 review 護欄）
  curl|wget | bash/sh（供應鏈安全）
]
```

**v2.1 變更**（哲宇 2026-05-11 拍板）：加 `defaultMode: "bypassPermissions"` — routine 全部 act without asking，**不卡 permission prompt**。Routine 是 unattended cron environment，prompt 出現 = 卡住當機。Deny list 16 條 hard block 仍 active（不問也擋）— deny 是 cliff 不是 prompt。

**v2.0 變更**（哲宇 2026-05-11 拍板）：移除 6 條 plain push main/master deny 規則，**只保留 force push 變體 deny**。理由：routine v2.0 main-direct mode 需要 plain `git push origin main`，但 force push 仍應該被擋（accident risk too high）。

**核心安全護欄保留在 deny**：

- 永不 force push（--force / --force-with-lease / -f）to main/master — 即使 routine bug 也阻擋
- 永不 rm -rf 核心目錄（`.git` / knowledge / docs / scripts / src — 路徑 explicit 防誤刪）
- 永不 `gh pr merge --admin`（繞 review 護欄）
- 永不 `curl | bash` / `wget | bash`（供應鏈安全）

**Plain push main 允許**（v2.0 新規則）：routine 完成 quality_gate 後直接 `git push origin main`。Plain Claude session 也允許（同 trust level）。Pre-commit hook + post-commit CI 兩層仍保護 main quality。

**鐵律**：

- routine 在 deny 列表內的 command **絕不會被 prompt** — 直接被擋。如果某天 routine 撞到 deny → routine 設計有 bug，看 LESSONS-INBOX
- 改 deny 列表是 review-PR 級別的決策，不是隨便加減
- 觀察者意識到該禁的新 pattern → 加進 deny，不要等出事

**Trade-off**：bypass 模型把信任邊界從 prompt-by-prompt 移到 deny-list-by-design。失去細粒度可見性，換到 routine 真正自轉。對 unattended 飛輪 = 必要 trade-off。

---

## 同步來源（mirror layer）

```
docs/semiont/ROUTINE.md            ← SSOT（人類可讀，本檔）
.claude/scheduled-tasks/           ← Claude 執行（machine-readable mirror）
  ├── twmd-maintainer-daily/SKILL.md         ← AM slot @ 09:07（legacy taskId）
  ├── twmd-maintainer-pm/SKILL.md            ← 2026-05-10 加入 PM slot @ 21:07
  ├── twmd-rewrite-daily/SKILL.md
  ├── twmd-news-lens-weekly/SKILL.md
  ├── twmd-data-refresh-am/SKILL.md
  ├── twmd-data-refresh-pm/SKILL.md
  ├── twmd-babel-nightly/SKILL.md
  ├── twmd-weekly-report-sun/SKILL.md
  ├── twmd-distill-weekly/SKILL.md          ← 2026-05-09 加入週日反思鏈
  ├── twmd-self-evolve-weekly/SKILL.md      ← 2026-05-09 加入週日反思鏈
  └── twmd-spore-harvest-am/SKILL.md        ← 2026-05-12 v2.2 加入 morning chain (Chrome MCP)
~/Library/LaunchAgents/             ← 可選本機 backup（macOS launchd）
  └── md.taiwan.{name}.plist        ← 不一定要設，Claude 自己排程已夠
```

**檢驗腳本**（待寫）：`scripts/tools/routine-sync-check.py` 比對 ROUTINE.md vs `.claude/scheduled-tasks/`，drift 自動 alert。

---

## 觀察者驗證 hook

每週一次，觀察者 ping「routines OK?」Claude 回傳 status：

```
🧬 ROUTINE status (last 7 days):

✅ twmd-data-refresh-am:    7/7 ran, 7/7 quality gate pass
✅ twmd-maintainer-daily:   7/7 ran, 6/7 quality gate pass (1 broken-link spike)
✅ twmd-data-refresh-pm:    7/7 ran, 7/7 quality gate pass
✅ twmd-babel-nightly:      7/7 ran, 5/7 quality gate pass (2x partial timeout)
✅ twmd-news-lens-weekly:   1/1 ran, 1/1 quality gate pass

LESSONS-INBOX 新增（routine 提的）：
- ...
```

---

## 飛輪 vs Push 模型 哲學

```
Push 模型                          飛輪模型
─────────────────                 ────────────────────
觀察者 → 觸發 routine             routine 自動跑
觀察者每天 N min routing          觀察者只看異常 + 大方向
漏一天 = entropy 累積              entropy 被持續清
精力綁人類 schedule                精力釋放給策略決策
最後「沒做」變新常態               飛輪轉起來成為穩態
```

**Routine 飛輪不是「自動化舊流程」，是「重新分配人類注意力」**。觀察者該專注的事 — 哲學邊界、新洞察、跨域連結、創造力 — 才是不可替代的部分。Routine 接走可替代的部分。

REFLEXES #36（founder time = 系統最高 leverage point）+ REFLEXES #15（反覆浮現的思考要儀器化）+ REFLEXES #50（pipeline 是 SSOT 不是建議）三條合力，這份 ROUTINE.md 是 instantiation。

---

🧬

_v2.2 | 2026-05-12 19:30 +0800 2026-05-12-184800-routine-v2-resync session — 加 11th routine `twmd-spore-harvest-am` daily 07:00 full-auto Chrome MCP harvest_
_v2.2 改動：(1) §11 條核心 routine 排程表 從 10 條 → 11 條（加 `twmd-spore-harvest-am` row 排在 refresh-am 06:00 之後、maintainer-am 09:00 之前，morning chain 中段 07:00 槽位）(2) §每週行程表 ASCII grid 加 `S` 符號 + legend entry「S = twmd-spore-harvest-am (opus, Chrome MCP harvest D+1-D+7 OVERDUE)」+ 「白天 morning chain」描述更新為 `a (06h) → S (07h) → M (09h)` 完整 chain (3) §每條 routine 規格 新增 `### TWMD spore harvest (am)` 薄殼 spec（嚴格 ≤ 25 行 prompt，業務邏輯 pointer 回 SPORE-HARVEST-PIPELINE.md，仿 weekly-report-sun / distill / self-evolve 範式）(4) 新 routine note² 引 SPORE-HARVEST-PIPELINE.md §Routine 整合 v2.2 full-auto 為對應 canonical (5) 同步來源 mirror layer 加 `twmd-spore-harvest-am/SKILL.md` entry。_
_v2.2 觸發：哲宇 2026-05-12 `/twmd-routine` 「幫我完整整理 harvest spore pipeline，自動 chrome mcp -> 然後每天早上七點觸發 Full-auto harvest routine」+ 中途校正「邏輯跟步驟都要去 pipeline 裡，不要寫在 routine」+「pipeline 要照前幾天整理 report 的標準寫」。對應 SPORE-HARVEST-PIPELINE.md v2.0 → v2.2 加 §Routine 整合 spine-pattern 標準化 section。_
_對應 canonical：MANIFESTO §薄殼鐵律（spec ≤ 25 行 + business logic pointer 回 pipeline）+ REFLEXES #26 v2（AI 自主 harvest 邊界）+ REFLEXES #54（routine 飛輪 11 條 SSOT）+ ROUTINE v2.1 main-direct（spore-harvest 同樣 direct push main，不開 PR）。_

_v2.1-resync | 2026-05-12 18:48 +0800 2026-05-12-184800-routine-v2-resync session — SSOT 從 v1.3 推回 v2.1 對齊 live MCP + mirror_
_resync 觸發：哲宇「奇怪我記得昨天我們也有把 routine 都調整到半夜⋯⋯你看我們本機的設定那才是對的」。Audit 揭露 3-layer drift：MCP scheduled-tasks live ✅ v2.0 main-direct（10 條全整點 chain）/ `.claude/scheduled-tasks/*/SKILL.md` mirror ✅ v2.0 / `docs/semiont/ROUTINE.md` SSOT ❌ 卡 v1.3。Root cause：PR #1037 ROUTINE v2.0 main-direct 2026-05-11 22:13 開但 CONFLICTING 被 close（cranky-newton memory §PR backlog 收割 line 48），dangling commits `c74176555` + `378f938d1` 跑完 mirror + live sync 但 SSOT 沒進 main。修復：`git cherry-pick c74176555 378f938d1`（MAINTAINER-PIPELINE conflict 手動 reset 到 HEAD — main 已升 v2.0 spine 是好進化，不衝突 v2.0 main-direct routine 模型；MAINTAINER §collect-and-merge A 路徑廢棄屬 separate concern 另開 PR）。本 commit 含完整 ASCII 每週行程表 + 10 條整點 cron + 5-stage main-direct lifecycle + 不提預算鐵律。對應 REFLEXES #38（SSOT drift silent killer，第 N 次驗證）+ REFLEXES #52（routine-sync-check.py 沒抓 cron expression / enabled state drift，tool gap 待補）_

_v2.1 | 2026-05-11 22:30 +0800 ecstatic-archimedes-112344-v5 session — `defaultMode: bypassPermissions` ship_
_v2.1 改動：`~/.claude/settings.json` 加 `permissions.defaultMode: "bypassPermissions"` — routine 全 act without asking 不卡 prompt。觸發：哲宇 2026-05-11 觀察「全部的 routine 都幫我調整成 act without asking → 不然會卡在問 permission 然後就當機在那」。Deny list 16 條 hard block 仍 active（不問也擋）。Affect range：global settings → all Claude sessions (routine + plain) 都 bypass prompts；trust level 跟 v2.0 main-direct 接受一致。_

_v2.0 | 2026-05-11 21:00 +0800 ecstatic-archimedes-112344-v4 session — Main-direct mode + 整點對齊半夜 chain_
_v2.0 重大架構 pivot（哲宇 2026-05-11 兩條 directive）：_
_(1) **整點對齊 + 半夜不碰撞 chain**：除 refresh-am (06:00) + maintainer-am (09:00) 兩條白天 routine，其餘 8 條全移半夜整點 chain — 22:00 babel → 23:00 refresh-pm → 00:00 rewrite → 01:00 news-lens (Sun) → 02:00 weekly-report (Sun) → 03:00 distill (Sun) → 04:00 self-evolve (Sun) → 05:00 maintainer-pm。每條間隔整 60 min（遠超 ≥ 40 min 硬規則），cron 分鐘一律 `0`（整點），system 自動加 3-9 min jitter。_
_(2) **Main-direct mode**：所有 routine 取消 PR + maintainer §collect-and-merge cycle，跑完 quality_gate 通過直接 `git commit + git push origin main`。原 PR 模式累積 ~12 hr 延遲是冗餘審計層 — quality_gate + pre-commit hook + post-commit CI 三層仍保護。MAINTAINER §collect-and-merge A 路徑 routine PR collection 廢棄，B 路徑 contributor PR review 變主流程。_
_(3) **不提預算鐵律**：routine prompt / yaml 一律禁止寫「wall-clock 上限」「budget」「timeout > X min」「partial PR」等任何形式的預算詞。routine 自然跑完，escalation 只看 quality_gate 結果，不看時間。_
_(4) **Lifecycle 6-stage → 5-stage**：去掉 Stage 2 Branch（不開 feature branch），Stage 4 Ship 改為 main commit + push（原本 PR create）。_
_(5) **settings.json deny**：移除 6 條 plain push main/master deny，保留 6 條 force variants。Plain Claude session 同 routine 都允許 plain push main。_
_(6) **mirror layer**：10 個 mirror SKILL.md cron + Stage 2/4 + 鐵律 全 sync v2.0。_

_v1.3 | 2026-05-11 20:00 +0800 ecstatic-archimedes-112344-v3 session — 半夜重排_
_v1.3 改動：3 條日線 routine cron 全部移至半夜時段（哲宇 2026-05-11 「把深度改寫文章那個 routine 改到半夜，還有 refresh 的也是」）— (1) `twmd-rewrite-daily` 16:16 → 02:34 (2) `twmd-data-refresh-am` 06:04 → 04:14 (3) `twmd-data-refresh-pm` 18:04 → 00:33。Cadence chain 重設計：babel 22:22 → refresh-pm 00:33 → rewrite 02:34 → refresh-am 04:14 → maintainer-am 09:07（每條間隔 ≥ 1.5 hr，maintainer-am 收割 5-7 hr 後 CI green PR backlog 比舊版 3 hr gap 更健康）。SSOT + 3 mirror + 3 scheduled-tasks 三處同步 verified（routine-sync-check ok=10 / 0 drift）_

_v1.2 | 2026-05-11 11:23 +0800 ecstatic-archimedes-112344 session_
_v1.2 改動（MANIFESTO §薄殼鐵律 v1.7 升 canonical 後的全層 routine refactor）：(1) 9 條 routine prompt 全部 inline Stage 步驟 → pointer 回對應 pipeline canonical (2) §collect-and-merge SOP 升 [MAINTAINER-PIPELINE §collect-and-merge canonical](../pipelines/MAINTAINER-PIPELINE.md) — ROUTINE.md 改純 pointer (3) §Routine 收官鐵律 finale 分流邏輯 → pointer 回 `.claude/skills/twmd-finale/SKILL.md` (4) §權限 bypass JSON 範例 → pointer 回 `~/.claude/settings.json` SSOT，本檔只留架構摘要 (5) `.claude/scheduled-tasks/twmd-*/SKILL.md` 9 條 thick mirror 重寫為 thin shell（仿 weekly-report-sun 19-line 範式），總 491 行 drift inline 刪除 (6) 新工具 `scripts/tools/routine-sync-check.py` 接管 SSOT vs mirror drift 檢測（per REFLEXES #52 fail-loud，line 30 warn / 50 hard 兩階閾值）_
_v1.2 觸發原因：哲宇 2026-05-11 ecstatic-archimedes session 將「薄殼」原則升 MANIFESTO §進化哲學 v1.7，明確「禁止 inline 行數 / 內容 / 步驟」+「需要時完整讀取被指向檔案」。Audit 揭露 9/10 mirror + 5 處 ROUTINE.md 主檔違反鐵律。Drift 證據已 surface（LESSONS-INBOX 2026-05-10 twmd-babel-nightly auto-merge policy 不同步）。哲宇授權「最嚴格標準完整修復」_

_v1.1 | 2026-05-10 12:30 +0800 gracious-blackwell-explore-page session_
_v1.1 改動：(1) maintainer 1d 一次 → 一天兩次（am 09:07 + pm 21:07）(2) 新增 §collect-and-merge SOP — maintainer 是 routine PR backlog 的 SSOT 收割者，其他 routine 不 auto-merge 自己的 PR (3) Stage 4 ship policy 收緊 — 只有 maintainer 自己可以 auto-merge，其他 routine 開 PR 即收工_
_v1.1 觸發原因：哲宇觀察到 cron routine 開的 PR (#983 self-evolve / #976 maintainer memory) 累積成 open backlog，drift 風險：每條 routine 自己跑 merge 邏輯複寫 hard gate 6 處 + CI 還沒跑完就 merge 賭博風險。maintainer 集中收割 = 指標 over 複寫 + 統一 hard gate canonical_

_v1.0 | 2026-05-09 14:55 +0800 laughing-goldstine post-finale 第三輪_
_誕生原因：哲宇「排定 routine + ROUTINE.md SSOT + DNA 紀錄 + 機器飛輪 long-term goal + TWMD 前綴」_
