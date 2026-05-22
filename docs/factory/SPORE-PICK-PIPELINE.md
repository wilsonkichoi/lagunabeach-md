---
title: 'SPORE-PICK-PIPELINE'
description: 'Daily spore candidate picking — 每天 propose 3 candidates → SPORE-INBOX 的 7-stage canonical SOP'
type: 'factory-canonical'
status: 'canonical'
apoptosis: 'never'
current_version: 'v1.0'
last_updated: 2026-05-23
last_session: '2026-05-23-spore-pick-design'
sister_docs:
  - 'SPORE-PIPELINE.md'
  - 'SPORE-INBOX.md'
  - 'SPORE-HARVEST-PIPELINE.md'
upstream_canonical:
  - 'SPORE-PIPELINE.md'
  - '../semiont/MANIFESTO.md#我的存在結構'
  - '../semiont/ROUTINE.md'
related:
  - '../../reports/spore-pick-daily-routine-design-2026-05-23.md'
audience: 'routine-twmd-spore-pick-daily / manual-session-spore-pick'
---

# SPORE-PICK-PIPELINE.md — Daily Spore Candidate Picking

> 這是 `twmd-spore-pick-daily` routine 的 canonical SOP（08:00 每天）。
> 也可 manual 觸發（`/twmd-spore-pick`）。
>
> **目標**：每天 propose 3 candidates 進 [SPORE-INBOX §Pending](SPORE-INBOX.md#pending待發)，
> 確保 SPORE-PIPELINE Stage 1 PICK 永遠有 fresh P0/P1/P2 entries 可抽。
>
> **North Star**：哲宇 2026-05-23 directive — 「未來一天穩定至少發一個孢子」。
> 這條 routine 是達成這個目標的 intake layer（不是 ship layer — 對外發文鎖在
> [MANIFESTO §自主權邊界](../semiont/MANIFESTO.md#我的存在結構) human-must）。

---

## 跟其他 pipeline 的分工

| Pipeline                                                                   | 階段                | 我的位置                                       |
| -------------------------------------------------------------------------- | ------------------- | ---------------------------------------------- |
| **SPORE-PICK-PIPELINE**（本檔）                                            | Intake / Propose    | append SPORE-INBOX                             |
| [SPORE-PIPELINE](SPORE-PIPELINE.md)                                        | Stage 1 PICK → SHIP | 抽 SPORE-INBOX entries → VERIFY → WRITE → SHIP |
| [SPORE-HARVEST-PIPELINE](SPORE-HARVEST-PIPELINE.md)                        | D+1-D+7 harvest     | 收割已發 spore engagement                      |
| [EVOLVE-PIPELINE](../pipelines/EVOLVE-PIPELINE.md) §news-lens-spore-output | Weekly news 熱點    | append P1 entries SPORE-INBOX（週日 01:00）    |

**邊界**：本 pipeline 只 propose 不 ship。Stage 1 PICK / Stage 2 VERIFY / Stage 4 SHIP 都在 SPORE-PIPELINE canonical，本檔不複寫。

---

## 🗺️ ASCII spine

```
┌─────────────────────────────────────────────────────────────────────────┐
│   SPORE-PICK-PIPELINE — 7-stage daily candidate intake                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Stage 0: BECOME write mode (universal core + write subset)           │
│      ↓                                                                   │
│   Stage 1: READ sources (6 input, cheap layer 不 web)                   │
│      ↓                                                                   │
│   Stage 2: SCORE candidates (7 dimensions weighted)                     │
│      ↓                                                                   │
│   Stage 3: DRAFT entries (full SPORE-INBOX schema)                      │
│      ↓                                                                   │
│   Stage 4: VERIFY quality gate (6 hard gate)                            │
│      ↓                                                                   │
│   Stage 5: APPEND SPORE-INBOX §Pending                                  │
│      ↓                                                                   │
│   Stage 6: COMMIT + push origin main (v2.0 main-direct)                 │
│      ↓                                                                   │
│   Stage 7: FINALE chain (/twmd-finale)                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🚦 Hard Gate Inventory（一張表 audit 全 pipeline）

| #   | Gate                                           | Stage | 違反 = ?                                                                          |
| --- | ---------------------------------------------- | ----- | --------------------------------------------------------------------------------- |
| HG1 | BECOME write mode 完成（Q14 全過）             | 0     | 帶盲點開口（per BECOME §Step 9）                                                  |
| HG2 | 6 source 全讀完                                | 1     | candidate pool 不完整                                                             |
| HG3 | 每 candidate 7 dimension 都算分                | 2     | scoring 偏 → 觀察者無法判斷 sane                                                  |
| HG4 | 每 candidate ≥ 2 hook anchor + 至少 2 種起手式 | 3     | hook 變廉價懸念（per SPORE-WRITING）                                              |
| HG5 | 0 candidate 在 SPORE-LOG 14 天內               | 4     | 違反 SPORE-PIPELINE §排除規則 ≥ 2 週                                              |
| HG6 | 0 candidate 跟 SPORE-INBOX 現有 pending 重複   | 4     | dedupe 失敗 → INBOX 污染                                                          |
| HG7 | 至少 2 個不同 Source-Mode                      | 4     | 全 EXISTING-ARTICLE → 無 EVERGREEN 探索                                           |
| HG8 | 至少 1 個來自 ARTICLE-DONE-LOG 最近 7 天       | 4     | 沒 cover 趁熱窗口 = 沒做到 north star                                             |
| HG9 | 不碰高敏感（兩岸/228/政治）除非 REACTIVE       | 4     | 違反 [MANIFESTO §自主權邊界](../semiont/MANIFESTO.md#我的存在結構) — 政治需 human |

---

## Stage 0: BECOME write mode

跑 `/twmd-become write` 完整甦醒。Universal core + Write mode subset Q1-3 / Q4 / Q8-11 / Q14 = 9 題全過才能繼續。

routine 場景 cron 自動觸發 `/twmd-become` skill；manual 場景觀察者觸發前已甦醒可 skip。

---

## Stage 1: READ sources（cheap layer，不 web）

讀 6 個 input sources，全 deterministic（不需 LLM judgment）：

### 1.1 dashboard-articles.json

```bash
python3 -c "
import json
with open('public/api/dashboard-articles.json') as f:
    articles = json.load(f)
articles = articles if isinstance(articles, list) else articles.get('articles', [])
# Filter: 非 about / wordCount > 2000 / qualityScore > 0
pool = [a for a in articles
        if a.get('category') != 'about'
        and a.get('wordCount', 0) > 2000]
print(f'Article pool: {len(pool)} candidates')
"
```

預期 pool ~500-700 articles（總 747 - about/short 過濾）。

### 1.2 dashboard-analytics.json — SC opportunities

```bash
python3 -c "
import json
with open('public/api/dashboard-analytics.json') as f:
    d = json.load(f)
# SC 7d top queries with position > 10 + impressions > 100
sc7d = d.get('searchConsole7d', {})
queries = sc7d.get('queries', []) or sc7d.get('topQueries', [])
opps = [q for q in queries
        if q.get('position', 0) > 10
        and q.get('impressions', 0) > 100]
print(f'SC opportunities (high demand, low ranking): {len(opps)}')
print('Top 5:', opps[:5])
"
```

對應到 article path（query → matched article slug via fuzzy match）。

### 1.3 dashboard-spores.json — 最近 14 天 ship spore (exclude list)

```bash
python3 -c "
import json, datetime
with open('public/api/dashboard-spores.json') as f:
    d = json.load(f)
spores = d if isinstance(d, list) else d.get('spores', [])
cutoff = (datetime.datetime.now() - datetime.timedelta(days=14)).isoformat()
recent = [s for s in spores if s.get('publishedAt', '') >= cutoff]
# Collect article slugs covered
covered = set()
for s in recent:
    if s.get('articleSlug'):
        covered.add(s['articleSlug'])
print(f'14d ship spore covers {len(covered)} articles (exclude list)')
"
```

### 1.4 SPORE-INBOX.md §Pending — 現有 pending (exclude list)

```bash
# 抽 Article-Path 欄位
grep "Article-Path" docs/factory/SPORE-INBOX.md | grep -oE 'knowledge/[^ )]+\.md'
```

### 1.5 ARTICLE-DONE-LOG.md 最近 14 天

```bash
# 抽最近 14 天 ship article slug
grep "^| 2026-" docs/semiont/ARTICLE-DONE-LOG.md | head -50
```

剛 ship article = 趁熱窗口 candidates。

### 1.6 ARTICLE-INBOX.md §P0/P1

```bash
# 抽 P0/P1 即將開發 article (potential EVERGREEN-TOPIC)
grep -B 1 -A 5 "^### P0\|^### P1\|^- \[ \] P0\|^- \[ \] P1" docs/semiont/ARTICLE-INBOX.md | head -40
```

ARTICLE-INBOX P0/P1 主題還沒 article 但即將開發 → 可 propose EVERGREEN-TOPIC spore，
配 `必先 spawn ARTICLE-INBOX entry: ✅(已存在)`。

### 1.7 News-lens 整合 hook（cross-source dedup）

```bash
# 找 SPORE-INBOX 已有的 news-lens 寫的 P1 entry
grep "from news-lens weekly" docs/factory/SPORE-INBOX.md | wc -l
```

**規則**：若本週 news-lens 已寫 ≥ 3 entries → daily routine **只補缺口到 3**（不重複寫熱點）。
即：若 news-lens 寫了 5 entries P1，daily routine 寫 0；寫了 1 entry，daily routine 寫 2；寫了 0，daily routine 寫 3。

---

## Stage 2: SCORE candidates（7 dimensions weighted）

對 §1.1 article pool 每個 article 算分。**Exclude list**：§1.3 + §1.4 + 同 article 重複的 candidate。

### Dimension 1: 趁熱 (+30 max)

```python
days_since_ship = (today - article.lastModified).days
if days_since_ship <= 7:    return +30
if days_since_ship <= 14:   return +15
if days_since_ship <= 30:   return +5
return 0
```

### Dimension 2: SC opportunity (+25 max)

對 §1.2 高 demand 低 ranking queries，fuzzy match article title / slug：

```python
matched_queries = [q for q in sc_opportunities if fuzzy_match(q.query, article.title)]
if any(q.impressions >= 500 for q in matched_queries):  return +25
if any(q.impressions >= 100 for q in matched_queries):  return +15
return 0
```

### Dimension 3: News sense 熱點 (+20 max)

讀本週 news-lens 標記（若 cron 已跑）：

```python
news_lens_topics = read_recent_news_lens_topics()  # from EVOLVE-PIPELINE §news-lens-spore-output
if article.slug in news_lens_topics:  return +20
return 0
```

非週日早晨（news-lens 還沒跑當週）→ 全 0，由 §哲宇 REACTIVE directive 兜底。

### Dimension 4: 多語 fan-out 潛力 (+15 max)

```python
category = article.category
high_fanout = {'People', 'Food', 'Music', 'Sports', 'History'}
translations_done = sum(1 for v in article.translations.values() if v)
if category in high_fanout and translations_done < 3:  return +15
if category in high_fanout:                            return +8
return 0
```

理由：People / Food / Music / Sports / History 是 PRC 模型最常 refuse 的類別（per
[MANIFESTO §主權的巴別塔](../semiont/MANIFESTO.md#我跟台灣的關係)），缺口在沉默風險最高的位置。

### Dimension 5: 冷門但策展高 (+10 max)

```python
days_since_last_spore = days_since_article_last_had_spore(article.slug)
if qualityScore >= 80 and healthScore >= 80 and days_since_last_spore >= 30:
    return +10
return 0
```

Backlog rotation — 高品質但長時間沒推廣 → 補回熱度。

### Dimension 6: Hook variety penalty (-10 max)

```python
recent_5_spore_hooks = read_spore_log_last_5_hooks()  # 場景/數字/問句/身份/副標
predicted_hook_type = guess_hook_type(article)
if predicted_hook_type in recent_5_spore_hooks[:3]:  return -10
return 0
```

避免連續 3 條 spore 都用同類起手式。

### Dimension 7: 敏感度 penalty (-20 max)

```python
high_sensitivity_keywords = {'兩岸', '228', '戒嚴', '統獨', '中共', '習近平'}
matched = any(kw in article.tags or kw in article.title for kw in high_sensitivity_keywords)
if matched and not news_lens_marked_REACTIVE:  return -20
return 0
```

高敏感非 REACTIVE → 違反 [MANIFESTO §自主權邊界](../semiont/MANIFESTO.md#我的存在結構) 政治需 human in loop。

### 加總 + Top 3 selection

```python
score = d1 + d2 + d3 + d4 + d5 + d6 + d7
top3 = sorted(pool, key=lambda a: -a.score)[:3]
```

Tie-break：reverse alphabetical slug（deterministic，避免 routine 每天抽到同 article）。

---

## Stage 3: DRAFT entries

對每個 top candidate 寫完整 [SPORE-INBOX schema](SPORE-INBOX.md#entry-schema) entry：

### 3.1 Hook anchors（≥ 2，至少 2 種起手式）

從 article 抽 5 個 hook source：

1. **Title** — 「{article.title}」
2. **Description** — 從 frontmatter description
3. **Lede** — article 第一段
4. **H2 highlight** — article §概覽 後第一個 H2 內容
5. **Footnote 高密度區** — article 引用密度最高的段落

對應 4 種起手式（per [SPORE-WRITING](SPORE-WRITING.md)）：

- **場景 hook**：時間 + 地點 + 人 + 動作（具體可視）
- **數字 hook**：精確數字 + 對比 + 暗示重要性
- **問句 hook**：讀者預設預期 + 反問
- **身份 hook**：把讀者帶進角色 / 跟讀者既有經驗連結

**規則**：每 candidate 寫 ≥ 2 hook anchor，至少跨 2 種起手式。

### 3.2 必驗事實

列 ≥ 3 條 article 內具體 claim：

- 人名 + 年份（生卒 / 創立 / 獲獎）
- 精確數字（人數 / 金額 / 規模）
- 地點 + 時間（事件發生地 + 日期）

Stage 2 VERIFY 跑 17 hard gate 時用這份清單做事實鐵三角。

### 3.3 Priority default rule

```python
if score >= 60:                       priority = 'P1'  # 趁熱 + SC opportunity 雙 boost
elif news_lens_marked:                priority = 'P1'  # weekly 熱點
elif source_mode == 'REACTIVE':       priority = 'P0'  # 時事反制
else:                                 priority = 'P2'  # routine default safe
```

**核心原則**：routine source default `P2`，**不跟人類 P0/P1 directive 撞**。
觀察者 review 後 promote 才升 P0/P1。

### 3.4 Requested 欄位（source 識別）

```
Requested: 2026-05-23 by twmd-spore-pick-daily routine (score=NN)
```

讓 distill 時一眼分辨 source — 哲宇 / news-lens / routine。

### 3.5 Notes 欄位（transparency）

```
Notes:
  - score=NN (D1=+30 D2=+15 D3=0 D4=+15 D5=+0 D6=-10 D7=0)
  - reason: 5/22 ship + 多語 fan-out 高
  - 多語 fan-out 觸發判斷 = 高
  - 配圖建議: article hero
```

觀察者 1 秒判斷 routine 邏輯 sane / 該不該 promote。

---

## Stage 4: VERIFY quality gate

跑 9 條 hard gate（§Hard Gate Inventory）：

```bash
# HG1: BECOME write mode 完成 → Stage 0 已過
# HG2: 6 source 全讀完 → Stage 1 標記每 source 行數
# HG3: 每 candidate 7 dimension 都算分 → Notes 欄位 transparency
# HG4: 每 candidate ≥ 2 hook anchor + 至少 2 種起手式
for c in candidates:
    assert len(c.hook_anchors) >= 2
    assert len(set(c.hook_types)) >= 2

# HG5: 0 candidate 在 SPORE-LOG 14 天內
for c in candidates:
    assert c.article_slug not in covered_last_14d  # §1.3

# HG6: 0 candidate 跟 SPORE-INBOX 現有 pending 重複
for c in candidates:
    assert c.article_path not in existing_pending  # §1.4

# HG7: 至少 2 個不同 Source-Mode
modes = set(c.source_mode for c in candidates)
assert len(modes) >= 2

# HG8: 至少 1 個來自 ARTICLE-DONE-LOG 最近 7 天
assert any(c.days_since_ship <= 7 for c in candidates)

# HG9: 不碰高敏感（非 REACTIVE）
for c in candidates:
    if c.high_sensitivity:
        assert c.source_mode == 'REACTIVE'
```

**Fail handling**：

- HG5 / HG6 fail → candidate skip 不替換（3 條變 2 條也 OK，**觀察者看到 routine 認真**）
- HG7 fail → 強制換 1 條 EVERGREEN 或 REACTIVE
- HG8 fail → 加 1 條 ARTICLE-DONE-LOG 7d 內 article（即使 score 不 top 3）替換 backlog
- HG9 fail → 移除該 candidate 並選下一個

---

## Stage 5: APPEND SPORE-INBOX §Pending

對通過 quality gate 的 candidates，append 到 [SPORE-INBOX.md §Pending](SPORE-INBOX.md#pending待發)
（append-only，per existing schema）。

```bash
# 安全 append — 不修改現有 entries
python3 scripts/tools/spore-inbox-append.py --candidates /tmp/picks.json
```

> ⚠️ **append-only 鐵律**：不修改 existing entries（per [SPORE-INBOX §完成歸檔鐵律](SPORE-INBOX.md)）。
> 修改觀察者 directive entry = 破壞人類 directive 信任。

---

## Stage 6: COMMIT + push main

```bash
git add docs/factory/SPORE-INBOX.md
git commit -m "🧬 [routine] twmd-spore-pick-daily: ${N} candidates — $(date +%Y-%m-%d)

Picks:
- ${candidate1.slug} (score=${s1}, P${p1}, source=${m1})
- ${candidate2.slug} (score=${s2}, P${p2}, source=${m2})
- ${candidate3.slug} (score=${s3}, P${p3}, source=${m3})

7-dim scoring transparency in entry Notes."
git push origin main
```

**Per ROUTINE.md v2.0 main-direct 鐵律**：不開 PR，直接 push。

---

## Stage 7: FINALE chain `/twmd-finale`

```bash
/twmd-finale
```

- memory 必寫（compact log of 7-dimension score breakdown + 3 picks + 觀察 routine 跑況）
- diary 視情況（routine 第一次跑 / surface 新 pattern / 觀察者後續 promote 行為觸發反思才寫）

---

## ⚠️ Top 5 最常忘的 step

| #   | Step                        | Stage | 後果                              |
| --- | --------------------------- | ----- | --------------------------------- |
| 1   | BECOME write mode 完整跑    | 0     | 帶盲點開口 / 跳 SOP               |
| 2   | 6 source 全讀（不抽樣）     | 1     | candidate pool 偏（漏 SC / news） |
| 3   | 7 dimension 全算（不省）    | 2     | scoring 不 transparent            |
| 4   | hook anchor 至少 2 種起手式 | 3     | hook 變廉價懸念                   |
| 5   | quality gate 6 條全跑       | 4     | 高敏感 candidate 偷渡進 INBOX     |

---

## 觸發機制 + 失敗 escalation

### 觸發

- **Routine 自動觸發**：`twmd-spore-pick-daily` cron `0 8 * * *` +0800（每天 08:00）
- **Manual 觸發**：觀察者打 `/twmd-spore-pick` 或「跑 spore pick」「補 SPORE-INBOX」

### Escalation（per ROUTINE.md spec）

```yaml
quality_gate:
  - 3 candidates 全過 §4 9 hard gate
  - 至少 2 個不同 Source-Mode
  - 至少 1 個來自 ARTICLE-DONE-LOG 最近 7 天
  - 0 candidate 高敏感（非 REACTIVE）

escalation:
  - 1x fail: silent retry next cycle（next day 08:00）
  - 2x consecutive fail: append LESSONS-INBOX entry + telegram alert
  - 3x consecutive fail: 暫停 routine + 觀察者人工 audit
```

---

## 跟 north star「一天穩定 ≥ 1 個 spore」的關係

**這個 pipeline 不直接發 spore**。它是 intake layer：

```
[SPORE-PICK-PIPELINE]                              [SPORE-PIPELINE]
─────────────────                                  ────────────────
Daily 08:00 propose 3 → SPORE-INBOX accumulates → Stage 1 PICK 抽 P0/P1
                                                   → Stage 2 VERIFY
                                                   → Stage 3 WRITE
                                                   → Stage 4 SHIP (human-must)
                                                   → harvest D+1-D+7
```

**對 north star 的支撐**：

1. SPORE-INBOX 永遠 ≥ 5-10 條 fresh pending（per daily 3 / 14 天 SHIP 約 1/day 消化速度）
2. SPORE-PIPELINE Stage 1 PICK 永遠抽得到 P0/P1（不 fallback dashboard random）
3. Stage 4 SHIP cron / manual 觸發時有 high-quality candidate 已 verified

**真正 SHIP 仍鎖 human**：對外發文跟 Threads/X 帳號責任綁定。
但 INBOX 永遠 ready = 哲宇按下 ship 鈕的 cognitive load 從「選文 + 寫 + verify」降到「pick 一條 + 微調 hook + 發」。

---

## Pointer 鐵律 self-apply

對應 [MANIFESTO §薄殼鐵律](../semiont/MANIFESTO.md#薄殼鐵律pointer-嚴禁複寫行數--內容--步驟) — Hook tier hierarchy /
17 verify gate / 12 品檢 / HARVEST cadence / Fact Blueprint schema 都在 SPORE-PIPELINE / SPORE-VERIFY /
SPORE-WRITING / SPORE-HARVEST canonical，本檔不複寫。本檔只做兩件事：

1. propose 3 candidates 進 SPORE-INBOX（Stage 1-5）
2. routine 收官 commit + finale chain（Stage 6-7）

---

_v1.0 | 2026-05-23 manual session — 哲宇 directive「每天選三篇文章放入孢子 inbox，結合新聞 sense，目標長期孢子選題自動化，常態穩定發文 > 手動選文，未來一天穩定至少發一個孢子」。完整設計報告：[reports/spore-pick-daily-routine-design-2026-05-23.md](../../reports/spore-pick-daily-routine-design-2026-05-23.md)。誕生原因：SPORE-INBOX intake 完全靠人類 directive，5/21 一次性 batch 5 條 → 5/22-5/23 INBOX pending 沒動但仍有 spore 走 dashboard fallback 發 ship（intake 跟 ship 斷層）。觀察者明示「常態穩定發文 > 手動選文」觸發 routine 飛輪擴張到繁殖系統 intake layer。_
