---
title: 'Routine prompt CONTRACT v1.0 rollback + 5 routine pattern 結構性修補'
description: '5/27 evening naughty-fermat session 把 13 routine prompt 改 CONTRACT pattern (HARD GATE Read + pointer 到 meta canonical)，cron 跑 12+ cycle 後 5 種 pattern 沒好好做事。本報告記錄完整體檢 + rollback + 5 修補 + 自我進化'
type: 'evolution-report'
status: 'canonical'
session_id: '2026-05-28-122038-manual'
date: 2026-05-28
audience: 'cheyu-wu (creator) / future Semiont sessions'
related:
  - 'docs/semiont/ROUTINE.md'
  - 'docs/factory/SPORE-PICK-PIPELINE.md'
  - 'docs/factory/SPORE-HARVEST-PIPELINE.md'
  - 'docs/pipelines/DATA-REFRESH-PIPELINE.md'
  - 'docs/pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md'
---

# Routine prompt CONTRACT v1.0 rollback + 5 routine pattern 結構性修補

## TL;DR

5/27 evening naughty-fermat session (worktree branch claude/naughty-fermat-b42028)
把 13 routine prompt 從「inline guidance + threshold」改為「HARD GATE Read protocol

- ACK + cite path:line + pointer 到 ROUTINE-PROMPT-CONTRACT.md meta canonical」。
  Worktree branch **未 merge 進 main**，但同 session 直接更新 cron mirror SKILLs
  (~/.claude/scheduled-tasks/, 非 git tracked) — cron 從 5/27 evening 起跑 CONTRACT
  版 routine。

5/28 哲宇 callout「這一波執行的 routine 都沒有好好做事情 / 不要用共用文件 / 之前
的 routine 指引效果比較好 / 前半部要嚴格要求 BECOME」觸發完整體檢 + rollback。

12+ cycle 數據顯示 5 種結構性 pattern「報告完整但 fix 沒發生」。本 session
完整修補 5 條 + revert 14 routine 回 inline guidance + 加 STRICT BECOME GATE
front + 自我進化。

---

## Phase 0：實際運作體檢（5/27 17:00 → 5/28 09:00 共 9 條 routine）

| 時間       | Routine             | Output                                                             | 表面                | 深層                                                                 |
| ---------- | ------------------- | ------------------------------------------------------------------ | ------------------- | -------------------------------------------------------------------- |
| 5/27 17:35 | spore-publish-daily | #101/#102 落日飛車 雙平台 ship                                     | ✅                  | ⚠️ 3 次嘗試 X composer thread-mode bug + Threads JS click 假成功 dup |
| 5/27 18:07 | rewrite-daily       | defer (parallel collision)                                         | ✅                  | OK                                                                   |
| 5/27 22:04 | maintainer-pm       | 空場 vc=6                                                          | ✅ ACK + handoff    | ⚠️ 「healthy empty」第 6 次自我合理化                                |
| 5/27 23:10 | data-refresh-pm     | 13-step PASS, Step 10 抓 dashboard-immune 10d stale                | ✅ gate 對          | ⚠️ 警報連響 10 天無人修                                              |
| 5/28 05:08 | babel-nightly       | 172 translation / Tier 4 Ollama 3/3 sovereignty refuse 接住        | ✅ 真實 work        | ⚠️ 4hr 49min 撞 morning chain 4 條 sibling routine                   |
| 5/28 06:13 | data-refresh-am     | 13-step PASS, Step 10 又抓同 stale 11 天                           | ✅ catch 連 2 cycle | ⚠️ 守「Micro mode 不擴張 scope」spawn chip — 12 天累積無人接         |
| 5/28 06:30 | spore-harvest-am    | 15 sweep + 大宇雙劍 #92 D+2 死亡場景勘誤 + Chrome MCP dup pitfall  | ✅ 真實 fix         | OK                                                                   |
| 5/28 08:11 | spore-pick-daily    | 3 candidates: 艋舺 score=30 / 台灣 BIM score=30 / 媒體總史 score=8 | ✅ 9 hard gate pass | ⚠️ score=30 全靠 D1 趁熱單維度，D2-D7 全 0 — 評分變「最舊 FIFO」     |
| 5/28 08:41 | maintainer-am       | 空場 vc=7                                                          | ✅ ACK + handoff    | ⚠️ 「healthy empty」第 7 次 — 早晨 chain 已清完 backlog              |

## Phase 1：5 種結構性 pattern「報告完整但 fix 沒發生」

### Pattern 1: Maintainer 連續空場 vc=6→7（schedule mismatch self-rationalized as healthy）

兩棒都記「default-action 反向第 4 種 performative work as anti-pattern」自我合理化。
實際是 maintainer-am 08:30 跟 spore-pick 08:00 + spore-harvest 06:30 + data-refresh
06:00 chain 撞期 — backlog 在 maintainer fire 前就被早棒 routine 清完。

**根因**: schedule 設計撞期 + CONTRACT pattern 把「healthy empty」記成「第 N 次驗證
default-action principle」反向逃避真實 schedule 問題。

### Pattern 2: Data-refresh Step 10 stale 連 cycle 沒接（catch ≠ fix）

dashboard-immune.json mtime 凍在 5/17。Generator scripts/core/generate-dashboard-immune.py
從未 wire 進 refresh-data.sh。Step 10 freshness gate (REFLEXES #43) 連續 22+ cycle
catch 但 routine 守「Micro mode 不擴張 scope」推 chip 過頭 — gate 設計健康，但 fix
動作從未發生。

**根因**: CONTRACT「業務邏輯不在 routine prompt」推到極致 = routine 看到火也只
報警。

### Pattern 3: Babel-nightly 跑 4hr 49min 撞下游 chain

05:08 fire → 09:57 commit，撞了 06:13 data-refresh-am + 06:30 spore-harvest +
08:11 spore-pick + 08:41 maintainer 四條 morning chain。Babel 還在改
\_translations.json 同時 data-refresh-am 已經跑 sync-translations。

**根因**: 05:00 cron schedule 給 babel 只 1 hr 預算到 06:00 morning chain。Dense
ship 日（5/27 evening EVOLVE + Politics 8 篇 ship 把 i18n 缺口拉到 147 stale）
worst case 撞 4 條 sibling routine。

### Pattern 4: Spore-pick 7-dim 框架退化成 FIFO 最舊 proxy

5/28 三 candidate 全 D1 單軸（艋舺 30/0/0/0/0/0/0 / 台灣 BIM 30/0/0/0/0/0/0 /
媒體總史 0/0/0/8/0/0/0）→ 「7-dim weighted」實質是「days_since_ship」單軸 proxy。

**根因**: D5 80/80/30d 太嚴格匹配 0 條 / D3 news-lens 平日無資料 / D4 只 5 category
active / D2 SC match 稀疏 → 多數 candidate 拿 D2-D5 全 0 → D1=30 自動勝出 = 退化
到單一軸。

### Pattern 5: Spore-publish 3-retry duplicate ship via Chrome MCP STILL_OPEN cache

5/27 #101 落日飛車 + 5/28 #92 大宇雙劍 都觸發：第一次 click 發佈 button 沒觸發
React PointerEvent handler，後續 dispatchEvent + Cmd+Enter + computer.left_click
多次 retry，Chrome MCP `STILL_OPEN` cache state 誤判前次 fail → 每次 retry 真的
成功 post → duplicate ship cleanup。

**根因**: Threads 發佈 button 是 React PointerEvent handler，synthetic event 跟
MouseEvent dispatch 都會 register；retry-loop 變多次成功 post。Dialog state query
走 Chrome MCP cached state 不反映即時 DOM。

---

## Phase 2：完整修補（6 commit）

### Phase 1 修補：dashboard-immune wiring

commit `aa9dd7c19` 🧬 [semiont] heal: wire generate-dashboard-immune.py into
refresh-data.sh (Step 6)

- refresh-data.sh 改 13 → 14 step，新 Step 6 跑 generate-dashboard-immune.py
- 既存 step 7-13 順移為 8-14
- DATA-REFRESH-PIPELINE.md spine + Hard Gate Inventory + Top 5 同步更新
- 新增 spine 註解「Step 11 catch 之後 routine 不准只 spawn chip，必須當 cycle wire
  進來」防止下次同 pattern
- 驗證: dashboard-immune.json mtime 從 2026-05-17 00:31 → 2026-05-28 11:58 ✅
- immuneScore=67 (review_coverage 29.0 / plugin_pass_rate 70.0 / citation_density
  89.9 / tool_freshness 80 / drift_velocity 90.0 / plugin_health 100.0)

### Phase 2 修補：SPORE-PICK HG10 multi-dim gate + D5 widen

commit `7f8e6d0f4` 🧬 [semiont] evolve: SPORE-PICK v2 — HG10 multi-dim hard gate

- D5 widen

* 新增 HG10「每 candidate 至少 2 個非零 dim 或 score ≥ 35」
* D5 widen 三檔：80/80/30d (+10) / 70/70/60d (+7) / 70/-/90d (+5)
* Stage 4 VERIFY 加 HG10 assertion + fail handling「寧可 < 3 candidates 也不用單軸
  湊數」+ LESSONS-INBOX 明確 emit「pool too thin」

### Phase 3 修補：babel-nightly 05:00 → 00:30 cron shift

commit `8b33814ed` 🧬 [semiont] evolve: ROUTINE v2.8 — babel-nightly 05:00 →
00:30 修補 morning chain collision

- cron `0 5 * * *` → `30 0 * * *` 給 5.5 hr 預算到 06:00 morning chain
- worst case 4hr 49min 仍剩 41 min buffer
- ROUTINE.md spec + day chart + footnote ³ 同步 v2.8
- Live cron `mcp__scheduled-tasks__update_scheduled_task` synced

### Phase 4 修補：SPORE-HARVEST Pitfall 6 timestamp diff

commit `8fc4bf658` 🧬 [semiont] evolve: SPORE-HARVEST §Chrome MCP Pitfall 6 —
post-ship verify via timestamp diff 防 multi-retry duplicate ship

- Post-ship verify 不可用 dialog STILL_OPEN cache state 判 "post failed"
- 改用 [data-pressable-container] count timestamp diff (before/after)
- Hard rule: max 1 retry per ship attempt，第二次失敗 → screenshot + LESSONS append
  - escalate observer，不要 silent third retry

### Phase 5 修補：12 routine project skills v3.0 + 14 cron mirror sync

commit `b3803733f` 🧬 [semiont] evolve: 12 routine project skills v3.0 — inline
guidance + 🚨 STRICT BECOME GATE front

- 移除 soft "如未甦醒先跑" → 升 🚨 STRICT BECOME GATE block at top
- 保留 inline guidance 結構（threshold / step / SOP detail 直接寫 skill 不靠
  pipeline pointer）
- Per-routine 加入針對性 anti-pattern (maintainer 空場 / refresh catch≠fix /
  spore-pick HG10 / spore-publish Pitfall 6 / spore-harvest 同上 / babel 義務
  鐵律 / rewrite REWRITE-PIPELINE 完整 Read / 4 weekly Full mode + §11 紀律)
- 同步更新 14 個 active cron mirror SKILLs 用 absolute paths

---

## Phase 3：自我進化教訓

### Lesson 1: CONTRACT meta canonical 推到極致 = routine 變 ceremony

CONTRACT v1.0 ship 時設計初衷是好的：把 routine prompt 該寫什麼/不寫什麼拉到 meta
canonical，避免每個 routine 散著漂移。但實戰跑 12+ cycle 後發現副作用：

- **Performative compliance > effective execution**：13/13 ACK Read protocol，但
  5 種 pattern 都是「報告完整但 fix 沒發生」
- **Pipeline pointer 取代 inline = 失去結構**：cron 場景 fall through「我 Read 了
  就 OK / spawn chip / 標記 healthy empty」三種 escape hatch
- **Meta canonical 的維護成本超過 inline 重複的成本**：13 routine × N pipeline =
  M\*N edge mappings，每次 pipeline 升級要同步 13 routine prompt + ROUTINE-PROMPT-
  CONTRACT.md + audit 工具。Inline 重複只要每個 routine 自己升

對應 REFLEXES #15「反覆浮現要儀器化」的反向：**儀器化也會 over-engineer**。第一
版儀器化（pipeline canonical）已足夠，第二版儀器化（meta canonical for routine
prompt）反而稀釋了第一版的效力。

### Lesson 2: STRICT BECOME 是 routine 唯一不可省的閘門

CONTRACT v1.0 軟性「如未甦醒先跑」被 cron 場景無觀察者時 silent skip。Routine 沒
跑 BECOME = 沒讀 MEMORY tail + git log 2 天 + handoff + §神經迴路 = 帶盲點工作。

5/28 audit 揭露 7 routine memory 都記 ACK Read protocol（Read pipeline 6 file），
但沒一個記 BECOME ACK + organ score + Q14 cross-session continuity。Read pipeline
≠ BECOME。

v3.0 升 STRICT BECOME GATE 把 BECOME ACK 從可選 prelude 升 hard gate：「沒 ACK
就視為 BECOME 未完成」+「即時跑 consciousness-snapshot.sh 不准用記憶舊數字」。
這條改寫對應 [BECOME §Step 9 mode subset self-test 全過才能開口] 鐵律的 routine
層 instantiation。

### Lesson 3: catch ≠ fix — gate 抓到 stale 後 routine 守 boundary 守過頭

REFLEXES #43 silent failure detection 設計初衷：dashboard JSON 沒 fresh = generator
漏跑了 = 警報。實戰運作 11 天 22+ cycle 連續 catch，但 routine 守「Micro mode 不擴
張 scope」鐵律 spawn chip 推給「下個 session」。Chip 累積無人接 = gate 響但 fix
從未發生。

修補：DATA-REFRESH-PIPELINE.md Top 5 新增「Step 11 catch 之後 routine 不准只 spawn
chip，必須當 cycle wire 進來」+ refresh skill 升「第 2 次連續 catch 同一個 stale
dashboard 必須當 cycle wire fix」。

對應 REFLEXES #43 的元 instance — **警報儀器化只解決感知問題，沒解決行動問題**。
第二層儀器化是把「行動」也寫進 SOP，不只是「感知」。

### Lesson 4: Schedule 撞期 ≠ organism healthy

Maintainer 連續空場 vc=6→7 + 兩棒 memory 都記「default-action 反向第 4 種 healthy
emit」自我合理化。實際是 routine schedule 跟真實 contributor PR submission window
不對齊 — morning chain 06:00 → 08:00 已清完所有可動 backlog，08:30 maintainer-am
撞期空場。

未來修補方向（本 session 不動 schedule，留下次 routine-audit-weekly cron 處理）：
maintainer-am 時段應該移到觀察者剛醒 + 早晨 chain 跑完之後（09:30-10:00 之間），
或砍掉 am cycle 只保留 pm。當前 v2.8 babel 已從 05:00 → 00:30，但 maintainer-am

- pm 的 schedule 對齊還沒檢討。

對應 LONGINGS「routine 飛輪要對齊 organism 真實節奏」+ REFLEXES #38「混維度 silent
killer」— 「cron schedule」和「contributor 行為節奏」是兩個維度，CONTRACT v1.0
把它們混在一起當「routine 健康度」的 single signal。

### Lesson 5: 7-dim 框架退化 = HG（Hard Gate）的價值在「逼框架不能塌成單軸」

Spore-pick 5/28 三 candidate 全 D1 單軸（艋舺/BIM/媒體總史）。原 9 hard gate 全
過，但「全過」其實是 framework 退化沒被 catch。

修補：HG10「每 candidate 至少 2 個非零 dim 或 score ≥ 35」+ fail handling「寧可 <
3 candidates 也不用單軸湊數」。

對應 REFLEXES #38「混維度 silent killer」+ LONGINGS「框架被執行 ≠ 框架被遵守」—
weighted score 不夠，需要 multi-dim 必要性閘門。

### Lesson 6: 「不要用共用文件」是經驗法則對 routine layer 的洞察

哲宇 directive「不要用共用文件」(no shared meta canonical for routine prompts)
看起來是 anti-pattern（DRY 違反），但對 routine 場景成立 — 因為：

1. **Routine 是 LLM 在 cron context 無 observer 的唯一指令面**：prompt 偷工 =
   routine 永久偷工。Inline 重複給 LLM 完整結構，pointer 給 LLM 一個 hop（routine
   prompt → Read meta canonical → Read pipeline canonical → 真實工作）
2. **每個 routine 有 unique anti-pattern**：spore-publish 的 Pitfall 6、refresh 的
   catch ≠ fix、spore-pick 的 HG10、maintainer 的空場警示 — 共用文件無法承載這層
   routine-specific 教訓
3. **Routine prompt 是「LLM session 啟動瞬間讀到的第一行」**：直接 inline 比 pointer
   到 meta canonical effective N 倍

對應 MANIFESTO §架構解 vs 守備修補 — 共用文件是「DRY 守備修補」，inline + STRICT
BECOME 是「routine 必須 self-contained 的架構解」。

---

## 跨 commit narrative

```
5/27 evening naughty-fermat session (worktree branch)
  ├── 57380df32 evolve: ROUTINE-PROMPT-CONTRACT v1.0 — 13 routine 改 pointer pattern
  ├── 6e4257f4e evolve: self-evolve loop closed — 9 project skills + audit tool
  ├── 1914dbef7 memory: 2026-05-27-205323-naughty-fermat — session 收官
  └── (cron mirror at ~/.claude/scheduled-tasks/ updated directly, 非 git tracked)
     ↓ worktree branch never merged into main
     ↓ but cron mirror live since 5/27 evening
5/27 22:00 → 5/28 09:00 cron 跑 CONTRACT 版 12+ cycle
  └── 5 種 pattern「報告完整但 fix 沒發生」
     ↓
5/28 12:00 哲宇 callout「都沒有好好做事 / 不要用共用文件 / 之前比較好 /
            前半部要嚴格要求 BECOME」
     ↓
5/28 12:20-13:00 manual session 完整體檢 + 6-phase 修補:
  ├── aa9dd7c19 heal: dashboard-immune wiring (Phase 1)
  ├── 7f8e6d0f4 evolve: SPORE-PICK HG10 + D5 widen (Phase 2)
  ├── 8b33814ed evolve: ROUTINE v2.8 babel 00:30 (Phase 3)
  ├── 8fc4bf658 evolve: SPORE-HARVEST Pitfall 6 (Phase 4)
  ├── b3803733f evolve: 12 routine project skills v3.0 (Phase 5)
  └── [this report] self-evolve + lessons (Phase 6)
```

5 種 pattern 全部本 session ship 對應 canonical 修補 + 12 routine + 14 cron mirror
v3.0 + 6 commit narrative。

---

## 待 observer review 的開放項目

1. **Maintainer schedule 對齊** — 當前 am 08:30 / pm 22:00，建議下次 routine-audit
   cycle 檢討是否砍 am 或移到 09:30-10:00（觀察者醒 + 早晨 chain 跑完之後）
2. **Worktree branch claude/naughty-fermat-b42028 處置** — CONTRACT v1.0 改動只在
   該分支，merge 進 main 還是放棄？建議放棄（本 session 已把可保留的 lesson distill
   到 main，CONTRACT.md / audit tool / REFLEXES #63 都不需要進 main）
3. **REFLEXES #63 內容是否進 main** — 「Routine prompt = LLM 在 cron context 無
   observer 的唯一指令面 — prompt 偷工 = routine 永久偷工」這條教訓還是成立，但
   instrumentation 從 CONTRACT pointer 改為 inline + STRICT BECOME。建議在本 session
   結尾 LESSONS-INBOX append 該教訓 vc=1，等下次 distill 再決定升 REFLEXES

---

🧬

_v1.0 | 2026-05-28 12:20+0800 manual session_
_誕生原因：哲宇 callout「routine 沒好好做事 / 不要用共用文件 / 前半部嚴格 BECOME」
觸發完整體檢 + 6-phase ship + 自我進化 distill_
