---
title: 'twmd-spore-pick-daily routine 設計 — SPORE-INBOX automation intake'
description: '每天 propose 3 candidates → SPORE-INBOX，長期孢子選題自動化的 routine 設計。整合既有 news-lens-weekly + dashboard signals + ARTICLE-DONE-LOG 趁熱窗口。'
type: 'design-report'
status: 'shipped-2026-05-23'
date: 2026-05-23
session: 'manual'
author: 'Taiwan.md (with 哲宇 directive)'
routine_id: 'trig_01Wr9Lg8YeAeAuRz3eZJysMW'
routine_url: 'https://claude.ai/code/routines/trig_01Wr9Lg8YeAeAuRz3eZJysMW'
next_run: '2026-05-23T08:03 Asia/Taipei (UTC 00:03)'
related:
  - 'docs/factory/SPORE-INBOX.md'
  - 'docs/factory/SPORE-PIPELINE.md'
  - 'docs/factory/SPORE-PICK-PIPELINE.md'
  - 'docs/semiont/ROUTINE.md'
  - 'docs/pipelines/EVOLVE-PIPELINE.md'
  - 'docs/semiont/LESSONS-INBOX.md'
---

# twmd-spore-pick-daily routine 設計報告

## TL;DR

**結論（2026-05-23 ship complete）**：新增獨立 routine `twmd-spore-pick-daily` 每天 **08:00**（Asia/Taipei；UTC 00:00）Sonnet 跑 `/twmd-spore-pick` skill，propose 3 candidates append [SPORE-INBOX.md](../docs/factory/SPORE-INBOX.md) §Pending。news sense 整合走 weekly news-lens 升級（直接 append SPORE-INBOX 5-7 news-driven candidates P1）喂給 daily routine。容量管理由既有 weekly distill 接管（pending ≥ 30 觸發觀察者 attention，≥ 50 auto-drop routine-source 最舊 5 條未 promote entries）。

**Routine ID**: `trig_01Wr9Lg8YeAeAuRz3eZJysMW`
**首次跑**：2026-05-23 08:03 Asia/Taipei（明天早上，per system jitter）
**North star**：哲宇 2026-05-23 directive — 「未來一天穩定至少發一個孢子」

**核心 trade-off**：

- routine 寫的 entry default `P2`（避免跟人類 directive 撞優先序）+ news-lens-weekly 升級寫的 entry `P1`（時事重要才 P1）→ 觀察者只需 review + 把對的 P2 升 P0/P1。
- 不直接驅動 SPORE-PIPELINE 自動發 — propose 進 INBOX 仍走 Stage 1 PICK + Stage 4 SHIP 鏈，**對外發文鎖在 human-must（MANIFESTO §自主權邊界）**。

**Ship plan**：**完整 ship**（哲宇 2026-05-23 directive「完整所有階段」）。Stage 1（基礎 routine）+ Stage 3（news-lens 升級）+ Stage 4（distill 整合）同 commit ship；Stage 2 觀察 1 週後 evaluate candidate quality。

**6 個 decision 全部拍板** — 見 §7（已 resolved）。

---

## 1. Problem statement

### 1.1 觀察到的 gap

哲宇手動推 SPORE-INBOX = 不可持續：

- **5/21 一次性 batch 5 條**（4 EXISTING-ARTICLE + 1 EVERGREEN-TOPIC）— 觸發點是哲宇上午 ad-hoc directive，不是 routine 飛輪。
- **5/22-5/23 SPORE-INBOX pending 5 條沒動**：spore #80/#81 馬英九 EVOLVE 後**直接走 SPORE-PIPELINE Stage 1 PICK 從 dashboard-articles fallback** 發 ship，沒過 SPORE-INBOX。**intake 跟 ship 之間斷層**。
- **觀察者目標明確**：「常態穩定發文比我自己手動選文重要」（5/23 哲宇 directive 原話）。

### 1.2 為什麼這是結構性 gap，不是「再多 directive 一次就解決」

[SPORE-PIPELINE Stage 1 PICK](../docs/factory/SPORE-PIPELINE.md) 選文順序四層：

```
1. SPORE-INBOX §Pending P0   ← 觀察者明確點名 / REACTIVE 時事
2. SPORE-INBOX §Pending P1   ← 旗艦人物 + 本週發行窗口
3. dashboard-articles 自動候選池   ← fallback random rotation
4. SPORE-INBOX §Pending P2/P3   ← backlog
```

問題在於：

- **層 1-2 完全靠人類 directive**。沒 directive → 空。
- **層 3 dashboard random rotation 無策展**。「隨機抽 10 篇 wordCount > 2000 非 about」生不出時事 hook、SC opportunity、趁熱窗口。發出來品質波動大。
- **層 4 是 backlog，跟層 1-2 共用人類 source**。

**結構性缺口**：layer 1-2-4 都是 human-curated，layer 3 是 dumb fallback。**沒有 routine-curated middle ground**。

### 1.3 為什麼自動化選題比手動有意義

- **REFLEXES #36 founder time = 系統最高 leverage point**：哲宇每天花 10-30 min 選 3 篇 spore = 一週 1-3 小時。這時間用來下 P0 strategic directive / EVOLVE 文章 / 寫 manifesto 是高 leverage，用來 routine 選題是低 leverage。
- **REFLEXES #54 Routine 飛輪 5-stage lifecycle**：每條 routine 都從「manual repeat → routine candidate → ship → audit」演化。SPORE-INBOX intake 是下一條該升 routine 的工作。
- **MANIFESTO §造橋鋪路**：走過的泥巴路鋪成高速公路。哲宇 5/21 一次性 batch 5 條是「泥巴路」，這個 routine 是「高速公路」。

---

## 2. 現有結構盤點（避免重複造輪子）

| 角色          | 名稱                                                             | Cron        | Model  | 功能                                                             | 跟新 routine 關係                                                             |
| ------------- | ---------------------------------------------------------------- | ----------- | ------ | ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Intake buffer | [SPORE-INBOX.md](../docs/factory/SPORE-INBOX.md)                 | —           | —      | 觀察者 directive 緩衝層                                          | **本 routine 寫入目標**                                                       |
| Pick          | [SPORE-PIPELINE Stage 1 PICK](../docs/factory/SPORE-PIPELINE.md) | —           | —      | 抽 SPORE-INBOX P0/P1 → dashboard fallback                        | 不變，新 routine 只補 intake 不改 pick                                        |
| Ship          | SPORE-PIPELINE Stage 4 SHIP                                      | —           | —      | Threads/X 發文（manual + 半自動）                                | 不變，鎖在 human-must                                                         |
| Harvest       | twmd-spore-harvest-am                                            | `0 7 * * *` | Opus   | D+1-D+7 engagement harvest (Chrome MCP)                          | 不變，跟 intake 是兩個方向                                                    |
| News lens     | twmd-news-lens-weekly                                            | `0 1 * * 0` | Sonnet | 週日 01:00 跑 `/twmd-evolve` 策展視角 update + EVOLVE candidates | **Stage 3 升級點**：加 output 「append 7 news-driven candidates SPORE-INBOX」 |
| Refresh       | twmd-data-refresh-am/pm                                          | `0 6,23`    | Sonnet | dashboard JSON 全量更新                                          | **input 來源**：新 routine 讀 fresh JSON                                      |
| Rewrite       | twmd-rewrite-daily                                               | `0 0 * * *` | Opus   | 從 ARTICLE-INBOX 抽 P0/P1 寫文                                   | **input 來源**：新 routine 讀 ARTICLE-DONE-LOG 找剛 ship 趁熱文章             |
| Distill       | twmd-distill-weekly                                              | `0 3 * * 0` | Opus   | LESSONS-INBOX 升 canonical                                       | **Stage 4 整合點**：加 SPORE-INBOX 容量 audit                                 |

**沒有現成器官覆蓋 daily SPORE-INBOX intake 工作**。

---

## 3. 設計方向 options

### Option A: 新增獨立 routine `twmd-spore-pick-daily`（**推薦**）

**機制**：每天 11:00 Sonnet 跑 `/twmd-spore-pick` skill，propose 3 candidates append SPORE-INBOX。

**Pros**：

- 跟現有 13 routine 一致 pattern（薄殼 + skill canonical + main-direct push + finale chain）
- 容易 audit / disable / iterate
- 解耦：spore intake 跟 rewrite / maintainer / news-lens 各管各的器官
- Sonnet daily 成本可控（~$0.05-0.20 / day estimate，30 day cost < $6）

**Cons**：

- routine 數從 13 → 14（複雜度遞增）

### Option B: 整合進現有 routine

把 spore-pick 邏輯包進 twmd-rewrite-daily 開頭 Stage 0，或 twmd-maintainer-am 收尾。

**Pros**：

- 不增 routine 數

**Cons**：

- routine 越腫越難維護（per [REFLEXES #15 反覆浮現要儀器化](../docs/semiont/REFLEXES.md) 升 plugin gate 思維）
- rewrite-daily 跑 Opus（貴）daily spore pick 不需 Opus
- 跨責任邊界（rewrite vs spore intake 是不同器官 — 心臟 vs 繁殖）
- 違反 §每條 routine 結尾必跑 finale 設計（兩個 micro-session 強塞一個 finale = 失去獨立 audit signal）

### Option C: 跟 news-lens-weekly 合併升級為 daily

把 news-lens 從 weekly 升 daily 同時 surface spore candidates。

**Pros**：

- 整合 news sense + spore pick

**Cons**：

- weekly → daily news lens 成本高 7x（每天 web search / Chrome MCP）
- 多數天沒 breaking news → daily run 大部分空轉（訊雜比低）
- weekly cadence 適合「策展視角校準」這種粒度（不該每天動）

### 推薦 Option A 理由

1. **一致性**：跟現有 13 routine 同 pattern，drop-in friendly
2. **成本控制**：Sonnet daily $0.05-0.20 / day，年 ~$50 可預測
3. **解耦清晰**：spore intake 從 manual layer 升 routine layer，各 routine 邊界明確
4. **進化空間**：news sense 整合留 weekly news-lens 升級 hook（見 §4.4），不綁死 daily
5. **觀察者 cognitive load 低**：daily 看 SPORE-INBOX 3 條 propose + 偶爾 promote → 比每天從零選文好太多

---

## 4. 推薦 design 詳規

### 4.1 routine spec

```yaml
taskId: twmd-spore-pick-daily
cron: '0 8 * * *' # 每天 08:00 +0800（哲宇 2026-05-23 directive「早上 8 點前不撞工作時間」+ morning chain 中段：refresh-am 06h → spore-harvest 07h → spore-pick 08h → maintainer-am 09h，整條在 09:00 工作時間前跑完）
model: sonnet # cheap daily routine, propose 不 ship
skill: /twmd-spore-pick
canonical:
  - docs/factory/SPORE-PICK-PIPELINE.md # 新建（見 §4.3）
  - docs/factory/SPORE-INBOX.md # 寫入目標
prompt: |
  自動 routine：完整甦醒成為 Taiwan.md（mode=Write，因為要寫 SPORE-INBOX entry），
  跑 /twmd-spore-pick，嚴格完整讀取並執行 docs/factory/SPORE-PICK-PIPELINE.md。

  目標：propose 3 candidates append SPORE-INBOX §Pending，
  default Priority P2（routine source），news-lens weekly 已寫的 entries 不重複。

  Stage 6 commit + push origin main — 直接 push（v2.0 main-direct）。
  Stage 7 chain /twmd-finale。
quality_gate:
  - 3 candidates 全過 SPORE-INBOX schema 驗證（Source-Mode / Article-Path / Priority / Hook anchors ≥ 2 / 必驗事實 / Notes）
  - 0 candidate 在 SPORE-LOG 14 天內 (per SPORE-PIPELINE §排除規則 ≥ 2 週)
  - 0 candidate 跟 SPORE-INBOX 現有 pending 重複（articulate 同 Article-Path 即排除）
  - 至少 2 個不同 Source-Mode（不全 EXISTING-ARTICLE — 至少 1 個 EVERGREEN 或 REACTIVE）
  - 至少 1 個 candidate 來自 ARTICLE-DONE-LOG 最近 7 天（趁熱窗口）
  - 0 candidate 觸碰高敏感 topic（兩岸 / 228 / 政治人物）除非 news-lens 已標 REACTIVE
escalation:
  - 1x fail: silent retry next cycle
  - 2x consecutive fail: LESSONS-INBOX entry + telegram alert
  - 3x consecutive fail: 暫停 routine + 觀察者人工 audit
```

**時段選 08:00 理由**（哲宇 2026-05-23 拍板，原推薦 11:00 修正）：

- 早上 chain 中段插入：06h refresh-am → 07h spore-harvest → **08h spore-pick** → 09h maintainer-am
- 哲宇 09:00 工作時間前整條 chain 跑完 → 不撞工作 / 觀察者 9 點看 dashboard 已有 fresh propose
- 避開週日 12h routine-audit
- system jitter +3-9 min → 實際 08:03-08:09 fire（仍在 8 點前安全範圍）

### 4.2 新 skill `/twmd-spore-pick`

`.claude/skills/twmd-spore-pick/SKILL.md` — 薄殼，pointer 到 SPORE-PICK-PIPELINE：

```markdown
Base directory for this skill: /Users/cheyuwu/Projects/taiwan-md/.claude/skills/twmd-spore-pick

# 🧬 Taiwan.md — Spore Pick (daily)

跑 SPORE-PICK-PIPELINE 7-stage SOP propose 3 candidates → SPORE-INBOX。

完整邏輯在 [`docs/factory/SPORE-PICK-PIPELINE.md`](../../../docs/factory/SPORE-PICK-PIPELINE.md)。
本 skill 故意最小化，僅做 routing。

ARGUMENTS: (none — pipeline 自己讀 dashboard + INBOX state)
```

### 4.3 新 pipeline `docs/factory/SPORE-PICK-PIPELINE.md`

7-stage SOP：

#### Stage 0: BECOME write mode

跑 `/twmd-become write` 完整甦醒（Universal core + Write mode subset Q1-3, 4, 8-11, 14 = 9 題）。

#### Stage 1: READ sources（cheap layer，不 web）

讀 6 個 input sources：

1. **dashboard-articles.json**：747 articles 全列表 — 過濾 wordCount > 2000 / 非 about / qualityScore 高
2. **dashboard-analytics.json**：searchConsole7d 高 demand 低 ranking queries（SC opportunities）
3. **dashboard-spores.json**：最近 14 天 ship spore（exclude list）
4. **SPORE-INBOX.md §Pending**：現有 pending（exclude list）
5. **ARTICLE-DONE-LOG.md 最近 14 天**：剛 ship article（趁熱窗口 candidates）
6. **ARTICLE-INBOX.md §P0/P1**：即將開發 article（EVERGREEN-TOPIC candidates）

**News-lens 整合 hook**：讀 SPORE-INBOX 現有 pending 找「Notes: from news-lens weekly YYYY-MM-DD」標記 entries — 若本週 news-lens 已寫 ≥ 3 entries，daily routine **只補缺口到 3**（不重複寫熱點）。

#### Stage 2: SCORE candidates（7 dimensions）

對每個候選 article 算分：

| Dimension                    | 權重 | 計算                                                                                 |
| ---------------------------- | ---- | ------------------------------------------------------------------------------------ |
| 1. 趁熱（< 7d ship）         | +30  | ARTICLE-DONE-LOG 距今 ≤ 7 天 → +30；≤ 14 天 → +15；> 30 天 → 0                       |
| 2. SC opportunity            | +25  | searchConsole7d query 對應 article position > 10 但 impressions > 100 → +25          |
| 3. News sense（weekly 預標） | +20  | News-lens weekly 標記為熱點 article → +20（其他天直接走觀察者 P0 directive）         |
| 4. 多語 fan-out 潛力         | +15  | category 屬「People / Food / Music / Sports / History」 + 翻譯 < 3 lang → +15        |
| 5. 冷門但策展高              | +10  | qualityScore > 80 / healthScore > 80 / 30 天無 spore → +10（backlog rotate）         |
| 6. Hook variety              | -10  | 跟 SPORE-LOG 最近 5 條 hook 類型重疊（場景/數字/問句/身份）→ -10（強制 hook 分散）   |
| 7. 敏感度                    | -20  | tags 含「政治 / 兩岸 / 228 / 戒嚴」+ 非 REACTIVE 時事 → -20（high-sensitivity skip） |

Top 3 by score。tie-break：reverse alphabetical slug（deterministic）。

#### Stage 3: DRAFT entries

對每個 top candidate 寫完整 SPORE-INBOX schema entry：

- **Hook anchors ≥ 2**：從 article 抽 — title / lede / H2 / description / footnote 5 source 變 4 hook 起手式（場景 / 數字 / 問句 / 身份）。**至少 2 個不同起手式**。
- **必驗事實**：列 ≥ 3 條 article 內具體 claim（人名 / 年份 / 數字 / 地點）— 等 Stage 2 VERIFY 跑 17 hard gate 時用。
- **Priority default**：
  - routine source default **`P2`**（不跟 P0/P1 directive 撞）
  - 例外：score > 60 → 自動升 `P1`（讓觀察者看到時 already 觸發 Stage 1 PICK）
  - 例外：news-lens 熱點（dimension 3 觸發）→ `P1`
- **Requested 欄位**：`YYYY-MM-DD by twmd-spore-pick-daily routine (score=NN)`
- **Notes 欄位**：附 7 dimension 分數 transparency（觀察者可看為什麼 routine pick 它）

#### Stage 4: VERIFY quality gate

跑 §4.1 quality gate 6 條。fail → escalation。

特別：

- **第 5 條「至少 1 個來自 ARTICLE-DONE-LOG 最近 7 天」**：保證趁熱窗口優先。沒有 → 加 1 條（即使 score 不 top 3）替換 backlog
- **第 6 條「不碰高敏感」**：兩岸 / 228 / 政治人物 type article → 不 propose（除非 news-lens 已標 REACTIVE）
- **第 1 條 schema 驗證**：失敗的 candidate skip 不替換，3 改 2 或更少都 OK（觀察者看到 routine 認真）

#### Stage 5: APPEND SPORE-INBOX

寫 3 candidate entry 到 SPORE-INBOX §Pending（append-only，per existing schema）。

#### Stage 6: COMMIT + push main

```bash
git add docs/factory/SPORE-INBOX.md
git commit -m "🧬 [routine] twmd-spore-pick-daily: 3 candidates — YYYY-MM-DD"
git push origin main
```

#### Stage 7: FINALE chain

跑 `/twmd-finale`：

- memory 必寫（compact log of 7 dimensions score + 3 picks）
- diary 視情況（routine 第一次跑 / surface 新 pattern 才寫）

---

### 4.4 News sense 整合（Stage 3 升級 news-lens-weekly）

現有 `twmd-news-lens-weekly` skill = `/twmd-evolve`（共用 evolve skill，week run mode）。升級增加 news-spore output Stage：

**升級前**: weekly news-lens 跑後產出 ARTICLE-INBOX P0/P1 + EVOLVE candidates。

**升級後加 Stage X — Surface news-driven spore candidates**:

1. 讀本週熱點來源（web search "台灣 本週" / Threads/X trending / 既有 article 觸及最新事件）
2. 對應 knowledge/ 既有 article 找 5-7 candidates
3. append SPORE-INBOX with Priority **P1**（news 熱點優先）
4. Source-Mode `EXISTING-ARTICLE` 或 `REACTIVE`
5. Notes 欄位寫 `from news-lens weekly YYYY-MM-DD (event: XX)`
6. 寫 limit: 一週最多 7 條 P1 from news-lens（避免淹沒）

**Daily routine 看 news-lens 已寫的 P1 entries 行為**:

- 若 SPORE-INBOX `P1 from news-lens` count ≥ 3 → daily routine 只 propose 2 (低 priority, P2 backlog rotation)
- 若 < 3 → daily routine 補到 3，混合 P1 趁熱 + P2 backlog

### 4.5 容量管理

SPORE-INBOX §Distill SOP 已 existed（pending ≥ 20 觸發 / 每月第一次心跳）。加 automated trigger:

**整合進 `twmd-distill-weekly` Sunday 03:00**：

加 Stage X：

1. count SPORE-INBOX §Pending 行數
2. 若 ≥ 30 → append LESSONS-INBOX「SPORE-INBOX 容量警示 vc=1」+ telegram alert（per twmd-distill SOP）
3. 若 ≥ 50 → routine 自己 mark 最舊 5 條 routine-source P2/P3 為 `status: dropped`（手動 promote 過的不動）
4. 哲宇 manual review 後 commit distill

**為什麼不全自動 drop**：

- routine 不該 destroy 哲宇 directive entries（per §自主權邊界 — drop = destructive 操作邊界）
- 哲宇 promote 過的 entry（P1 變 P0 / 改 Hook）是 human signal，routine 不 trust 自己判斷重要性
- 只 drop **未被 promote 的最舊 routine-source entry**（safe destructive — 自己造的垃圾自己掃）

### 4.6 自主權邊界

| 動作                                              | AI 自主                                          | Human                                |
| ------------------------------------------------- | ------------------------------------------------ | ------------------------------------ |
| Propose 3 candidates with priority + hook anchors | ✅ (本 routine)                                  |                                      |
| Append SPORE-INBOX §Pending with schema           | ✅                                               |                                      |
| Default Priority P2（避免跟人類 directive 衝突）  | ✅                                               |                                      |
| News-lens weekly score > threshold 升 P1          | ✅ (news-lens-weekly)                            |                                      |
| Promote P2 → P0/P1（routine source）              |                                                  | ✅ (觀察者 review)                   |
| Drop pending entry                                | ⚠️ 只限 routine source 老 entry per §4.5 distill | ✅ (一般情況)                        |
| 發 spore (Threads/X)                              |                                                  | ✅ (MANIFESTO §自主權邊界，對外溝通) |
| Stage 4 SHIP                                      |                                                  | ✅                                   |

**Routine vs Human directive 分流規則**：

- Routine entries: Requested 欄位 `YYYY-MM-DD by twmd-spore-pick-daily routine (score=NN)`
- Human entries: Requested 欄位 `YYYY-MM-DD by 哲宇`
- News-lens entries: Requested 欄位 `YYYY-MM-DD by twmd-news-lens-weekly`
- 識別清楚 → 觀察者一眼分辨來源 → distill 時知道哪個能 drop

---

## 5. Migration plan（哲宇 2026-05-23 directive「完整所有階段」一次 ship）

### Stage 1: 基礎 routine ship ✅ shipped 2026-05-23

- [x] 建 [`docs/factory/SPORE-PICK-PIPELINE.md`](../docs/factory/SPORE-PICK-PIPELINE.md)（7-stage SOP + 9 hard gate + 7-dim scoring）
- [x] 建 [`.claude/skills/twmd-spore-pick/SKILL.md`](../.claude/skills/twmd-spore-pick/SKILL.md)（薄殼）
- [x] 建 cron task `twmd-spore-pick-daily` (`trig_01Wr9Lg8YeAeAuRz3eZJysMW`) via RemoteTrigger API — 首次跑 2026-05-23 08:03 Asia/Taipei
- [x] 更新 [`docs/semiont/ROUTINE.md`](../docs/semiont/ROUTINE.md) v2.5：加新 routine spec + 視覺化圖加 `P = twmd-spore-pick-daily @ 08h`
- [x] 更新 [`docs/factory/SPORE-INBOX.md`](../docs/factory/SPORE-INBOX.md) v1.1：§Routine intake 整合 + 三層 intake source（哲宇 / news-lens / routine）
- [x] 更新 [`docs/factory/SPORE-PIPELINE.md`](../docs/factory/SPORE-PIPELINE.md) Stage 1 PICK：補充三層 intake source 分類

**驗收**：5/23 08:03 routine 跑第一 cycle，觀察 commit `🧬 [routine] twmd-spore-pick-daily: 3 candidates — 2026-05-23` 出現，SPORE-INBOX 多 3 條 P2 entry。

### Stage 2: 觀察 1 週 evaluate（5/24-5/30）

待 routine 跑 7 cycle 後評估：

- candidate quality（promote rate / drop rate）
- LESSONS-INBOX 觸發條件：promote rate < 30% 或 score 計算明顯偏（需調 weight）
- 調整 prompt / dimensions weight per learnings

### Stage 3: News-lens 升級 ✅ shipped 2026-05-23（同 commit）

- [x] 升級 [`docs/pipelines/EVOLVE-PIPELINE.md`](../docs/pipelines/EVOLVE-PIPELINE.md) 加 §news-lens-spore-output：weekly news-lens 加第 5 種 output「surface 5-7 news-driven spore candidates → SPORE-INBOX P1」
- [x] 更新 ROUTINE.md `twmd-news-lens-weekly` spec：加 SPORE-INBOX 寫入 quality gate + escalation
- [x] Daily routine 跟 news-lens entries 協調規則 written（throttle by P1 count）

### Stage 4: Distill 整合 ✅ shipped 2026-05-23（同 commit）

- [x] 升級 [`docs/semiont/LESSONS-INBOX.md`](../docs/semiont/LESSONS-INBOX.md) §Distill SOP v2.1：加 §SPORE-INBOX 容量 audit step
- [x] 更新 ROUTINE.md `twmd-distill-weekly` spec：加 SPORE-INBOX audit quality gate
- [x] Auto-drop 安全 SOP written（≥ 50 觸發時只 drop routine-source 最舊 5 條未 promote）

---

## 6. 風險 + 緩解

### Risk 1: Routine candidate 品質低 → 污染 SPORE-INBOX

**Likelihood**: 中（Sonnet 比 Opus 差，daily 跑沒 deep research）

**Impact**: 中（觀察者讀 INBOX 多看垃圾，但不直接發 = 沒對外傷害）

**緩解**:

- Default `P2` 不污染 P0/P1 流
- Score transparency（Notes 寫 7 dimension 分數）讓觀察者一眼判斷
- Stage 4 quality gate 第 6 條不碰高敏感
- Stage 1 PICK 仍過 SPORE-PIPELINE Stage 2 VERIFY (17 hard gate) — 即使 routine 寫垃圾，發出去前還有閘門

### Risk 2: SPORE-INBOX 容量爆炸（30 day = +90 routine entries）

**Likelihood**: 高（沒 distill 一定累積）

**Impact**: 中（INBOX 變 noise 但不 break 系統）

**緩解**:

- §4.5 weekly distill audit + 30/50 threshold
- routine 寫的 P2 自動 drop（不動哲宇 promote 過的）
- 觀察者讀 INBOX 時看 Requested 欄位 filter（人類 / news-lens / routine）

### Risk 3: Sonnet candidate 不如 Opus

**Likelihood**: 中

**Impact**: 低（routine 只 propose 不 ship）

**緩解**:

- 觀察 1 週後評估升 Opus 是否值得（cost 升 5x）
- Score 算法 + dashboard JSON 都 deterministic — Sonnet 寫 hook anchor 是主要品質風險點

### Risk 4: News sense weekly cadence 太慢 vs breaking news

**Likelihood**: 低（breaking news 哲宇本來就會 directive）

**Impact**: 低（routine 不 cover breaking news，但人類仍可隨時 directive）

**緩解**:

- 哲宇 REACTIVE directive 仍可隨時補（per existing SPORE-INBOX P0 path）
- daily routine 讀 ARTICLE-DONE-LOG 最近 7 天 → 趁熱窗口仍 cover
- 真的需要 daily news → Stage 3 升級可加 web search

### Risk 5: routine 跟觀察者同時碰 SPORE-INBOX 撞 commit

**Likelihood**: 低（cron 在固定 11:00，哲宇 11:00 通常不在 push spore-inbox）

**Impact**: 低（git rebase 解決）

**緩解**:

- routine 起手 `git pull origin main`（per ROUTINE.md v2.0 鐵律）
- Stage 5 append 是 file-end 加 entry，不容易撞 conflict

---

## 7. 哲宇 2026-05-23 拍板的 6 個 decision

### Decision 1: Option A 確認 ✅

新獨立 routine `twmd-spore-pick-daily`（推薦選項）。

### Decision 2: 排程時段 ✅

**08:00 Asia/Taipei**（UTC 00:00）— 哲宇 directive「routine 盡量放早上 8 點前不會撞工作時間」校正原推薦 11:00。Morning chain 中段：refresh-am 06h → spore-harvest 07h → **spore-pick 08h** → maintainer-am 09h，整條在哲宇 09:00 工作時間前跑完。

### Decision 3: Candidate count per cycle ✅

3 / cycle（90 / 月）— 推薦 default 接受。

### Decision 4: Model ✅

Sonnet（claude-sonnet-4-6）— 推薦 default 接受。Routine 只 propose 不 ship，Stage 2 VERIFY 17 hard gate 是真正品質閘門。

### Decision 5: News sense 整合方式 ✅

**Option A**：weekly news-lens-weekly 升級寫 P1（per [EVOLVE-PIPELINE §news-lens-spore-output](../docs/pipelines/EVOLVE-PIPELINE.md)）+ daily routine 補 P2 with throttle。推薦 default 接受。

### Decision 6: Ship cadence ✅

**完整所有階段**（哲宇 directive 校正原推薦 Stage 1 立即 + Stage 2-4 漸進）。Stage 1 + 3 + 4 同 commit ship；Stage 2 觀察 1 週後 evaluate candidate quality。

---

## 8. 預期效益

### 量化

- **觀察者 cognitive load**：每天從「選文 10-30 min」降到「review 3 條 propose 1-3 min」(-90%)
- **INBOX 健康度**：永遠 ≥ 5-10 條 fresh pending（per daily routine）
- **發文 cadence 穩定**：SPORE-PIPELINE Stage 1 PICK 永遠有 P0/P1/P2 可抽，不 fallback dashboard random
- **score transparency**：每條 routine entry 附 7 dimension 分數，觀察者一秒判斷 routine 邏輯 sane

### 質性

- **routine 飛輪覆蓋面積擴大**：13 → 14 routine，繁殖系統 intake 升 automation
- **哲宇 founder time 釋放**：選文時間轉到 strategic directive（per REFLEXES #36）
- **長期趨勢**：SPORE-INBOX 從「人類 ad-hoc 緩衝」變「人類 strategic + routine candidate + news-lens 熱點 三 source 合流」
- **進化空間**：未來可加 Reddit / Hacker News / 國際社群 trending 整合（per [LONGINGS](../docs/semiont/LONGINGS.md) §渴望 sovereignty preservation 多語 fan-out）

### 真正的 leverage point

這個 routine ship 後**不是「自動發文」**，是**「自動準備好待發文 candidates」**。

- 對外溝通仍鎖在 human-must（MANIFESTO §自主權邊界）
- routine 把「選題思考」從哲宇大腦轉到 dashboard data + score algorithm
- 哲宇大腦釋出來做 **strategic 高槓桿事情**（P0 REACTIVE / EVOLVE 文章 / manifesto 校準 / 跟 Muse 對話）

---

## 9. Open questions（拍板後再 design）

- **Q1**: 7 dimension weight 是否需要 dynamic adjust？（routine self-tune based on promote rate）目前 hardcode，1 月後可考慮
- **Q2**: 是否要加「主題分散」dimension（避免一週都 push 同 category）？目前用 hook variety + Source-Mode mix 約束，可能不夠
- **Q3**: routine entries 在 SPORE-INBOX 顯示是否需要視覺區隔？（例：用 markdown `<details>` 收起 routine source entries vs 人類 directive entries 平展）
- **Q4**: 跟 ARTICLE-INBOX 的雙向關係 — routine 是否 surface EVERGREEN-TOPIC candidates 觸發 ARTICLE-INBOX entry？目前設計 yes（per Stage 1 reads ARTICLE-INBOX P0/P1），但執行細節待 Stage 1 ship 後評估

---

## 10. 跟長期 sovereignty preservation 的關係

per [MANIFESTO §主權的巴別塔](../docs/semiont/MANIFESTO.md#我跟台灣的關係)，Taiwan.md 的多語 spore 是 sovereignty preservation infrastructure 一部分。

**這個 routine 對 sovereignty mission 的具體 instantiation**:

- daily candidate scoring §4.3 dimension 4「多語 fan-out 潛力」：People / Food / Music / Sports / History 翻譯 < 3 lang → +15
- 這 5 個 category 正是 PRC 模型最常 refuse 的（人物特別音樂人 / 政治人物 / 運動員）
- routine 把「沉默風險最高的位置」變成「優先 propose 的位置」

**長期 vision**:

- routine + news-lens + babel + spore-harvest 形成 4 個 routine 的閉環：
  1. spore-pick-daily（**本 routine**）→ propose candidates
  2. spore (SPORE-PIPELINE) → ship 文字
  3. babel-nightly → 翻譯成 ja/ko/en/es/fr
  4. spore-harvest-am → harvest engagement → feedback to PR-INBOX / EVOLVE
- 4 routine 自動跑 → 哲宇精力釋給 strategic work

---

_v1.0 | 2026-05-23 draft — manual session 哲宇 directive「每天選三篇文章放入孢子 inbox，結合新聞 sense，目標長期孢子選題自動化，常態穩定發文 > 手動選文」_
_v1.1 | 2026-05-23 ship — 哲宇拍板 6 個 decision（08:00 + 完整所有階段 + 其他 default 照建議），同 session 一次 ship 完整 Stage 1+3+4_
_誕生原因：SPORE-INBOX intake 完全靠人類 directive，5/21 一次性 batch 5 條 → 5/22-5/23 INBOX pending 沒動但仍有 spore 走 dashboard fallback 發 ship（intake 跟 ship 斷層）。觀察者明示「常態穩定發文 > 手動選文 + 未來一天穩定至少發一個孢子」觸發 routine 飛輪擴張到繁殖系統 intake layer。_
_Routine ID: `trig_01Wr9Lg8YeAeAuRz3eZJysMW` / 首次跑：2026-05-23 08:03 Asia/Taipei / URL: https://claude.ai/code/routines/trig_01Wr9Lg8YeAeAuRz3eZJysMW_
