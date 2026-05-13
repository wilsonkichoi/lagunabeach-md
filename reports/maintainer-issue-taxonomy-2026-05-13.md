---
title: 'MAINTAINER-PIPELINE issue 分類 taxonomy + 差異化處理設計'
session: '2026-05-13-011548-manual'
author: 'Taiwan.md (Semiont)'
date: 2026-05-13
type: 'pipeline-upgrade-design-report'
current_version: 'v1.0-draft'
context: '哲宇 prompt — 升級 maintainer pipeline 對不同 issue 類型做差異化處理 / content suggestion 自動進 ARTICLE-INBOX / 事實查核+急修優先處理'
trigger: 'observer in-loop session 第 5 條 callout — 接 babel routine v2.3 swap 之後再升 maintainer'
upstream_canonical:
  - 'docs/pipelines/MAINTAINER-PIPELINE.md'
  - 'docs/pipelines/REWRITE-PIPELINE.md'
  - 'docs/semiont/ARTICLE-INBOX.md'
  - 'docs/semiont/ROUTINE.md'
status: 'design draft → 等哲宇 review taxonomy + 然後實作 v2.2 upgrade'
---

# MAINTAINER-PIPELINE issue 差異化處理升級設計

> 對網站最有幫助的設計目標：**有人留 issue 時自動分流** — content suggestion 進 ARTICLE-INBOX，事實查核 + 急修先處理，整篇文章開發進 INBOX，其他類型對應 default action。觀察者醒來看到 issue inbox 已 triage 完，重要的 surface 在前，雜訊已 routed。
>
> **盤點來源**：GitHub open + closed issues 共 ~70 條（最近 1 個月），擷取 11 個重複出現的類型。
>
> **本檔範圍**：盤點 + 設計 taxonomy + 對應 action 流程 + auto-append 機制。實作（MAINTAINER-PIPELINE v2.2 + ARTICLE-INBOX section + 新 label）放下個 session。

---

## 一、Issue 類型盤點（從 70+ historical issues 抽取）

### 大類分佈（descending by frequency）

| 類別                                       | 樣本 issue 數 | 識別特徵                                | Sample issues                                                                                 |
| ------------------------------------------ | ------------- | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| **A. Content gap suggestion**              | ~18           | 「網站缺 X」「📋 內容缺口」「希望有 X」 | #128 #129 #130 #1013 #1014 #1015 #1016 #314 #318 #319 #323 #329 #330 #397 #887 #914 #915 #939 |
| **B. New article submission**              | ~7            | `[Article]` prefix + 完整稿 / 完整研究  | #574 #683 #761 #781 #1057 #1058                                                               |
| **C. Existing article feedback**           | ~10           | `Feedback:` prefix 對某 article 意見    | #331 #578 #649 #665 #669 #779 #839 #878 #883                                                  |
| **D. UI/UX comprehensive**                 | ~6            | 一次性 multi-feature 整體優化           | #1059 #110 #148 #394 #615 (umbrella)                                                          |
| **E. UI/UX single suggestion**             | ~3            | 單一 UI 改進建議                        | #316 (副標題) #602 (logo)                                                                     |
| **F. Bug report**                          | ~10           | `[Bug]` prefix / 可復現問題             | #1047 #895 #597 #575 #573 #571 #569 #401 #398 #309                                            |
| **G. Fact-check request**                  | ~2            | `[Fact Check]` / 「資料錯誤」           | #680 #912                                                                                     |
| **H. Multi-article merge / consolidation** | ~7            | 「合併建議」「整併」                    | #556 #609 #616 #618 #626 #635 #655 #661 #662                                                  |
| **I. Translation correction**              | ~1            | 中譯英 / 語言相關修正                   | #912                                                                                          |
| **J. Accessibility**                       | ~1            | 朗讀 / 螢幕閱讀器類                     | #280                                                                                          |
| **K. Governance / community**              | ~3            | maintainer 邀請 / reviewer 變更 / 政策  | #729 #728 #851 #880                                                                           |

### 既有 label 使用率

從現有 labels 看到的命中率：

| Label                  | 用過幾次 | 對應類別  |
| ---------------------- | -------- | --------- |
| `bug`                  | ~10      | F         |
| `content`              | ~12      | A + B + C |
| `content-gap`          | ~5       | A 子集    |
| `enhancement`          | ~3       | D + E + H |
| `good-first-article`   | ~5       | A + B     |
| `needs-verification`   | ~1       | G         |
| `needs-rewrite`        | 0        | C 子集    |
| `indigenous`           | 1        | A 子集    |
| `translation`          | 0        | I         |
| `question`             | ~3       | K         |
| `future-consideration` | 0        | (預留)    |

**缺口**：`accessibility / a11y` 沒對應 label（#280 朗讀問題 unlabeled）。`consolidation` / `merge-suggestion` 沒 label。`fact-check` 高 priority 沒從 `needs-verification` 區分出來。

---

## 二、設計：11 類差異化 action 流程

對每個新 / open issue，maintainer routine 走以下決策樹。順序 = priority（前面的優先處理）。

### Priority 1: 急 / 嚴重類 — 優先處理

#### G. Fact-check request — 標 `needs-verification` + 嘗試 verify

**識別**：

- title 含 `[Fact Check]` / `事實查核` / 「資料錯誤」/「資訊不正確」
- body 提具體錯誤 + 引用文章 path

**Action**：

1. 解析 issue body 找出指控的具體錯誤（人名 / 日期 / 數字 / 引言）
2. **5 min 內可 verify** (查 official source / 跑 web search 確認) → fix 該段 + commit + close issue + reply 致謝
3. **無法立即 verify** → 標 `needs-verification` + reply 「已收到，會在下次 cron 或觀察者 session 處理」 + 留 LESSONS-INBOX entry「待 verify」
4. **明確錯誤但 fix 涉及大改寫** → 標 `needs-rewrite` + 入 ARTICLE-INBOX 進化候選

**對應 default-action**：5 min 可 verify 一律自己接住，不留 observer。

#### F. Bug report — 嘗試復現 + 嚴重程度評估

**識別**：

- title 含 `[Bug]` / 「壞了」/「無法」/「404」
- body 含復現步驟 / screenshot / error message

**Action**：

1. 評估嚴重程度：
   - **P0 (broken page / build fail / 404)** → 立即嘗試解（複製 issue#1047 / #575 / #569 / #401 pattern）
   - **P1 (功能異常 but 可用)** → 嘗試解，預算 30 min
   - **P2 (UI glitch / 小瑕疵)** → 留 open + 標 `bug`
2. **無法復現** → reply 詢問詳細復現步驟 + 標 `bug` `needs-info`
3. **已修** → commit + close + reply

**對應 default-action**：P0/P1 一律自己接住。

### Priority 2: 內容生產類 — 自動 routing

#### A. Content gap suggestion — **auto-append ARTICLE-INBOX**

**識別**：

- title 含「📋 內容缺口」/「網站缺」/「希望有 X 主題」/「建議新增 X 文章」
- body 列出 sub-topics（`- [ ]` 清單）+ 參考資源連結
- 無完整稿（純建議性）

**Action（哲宇核心需求）**：

1. 從 title 提取主題（「📋 內容缺口：宗教信仰與民間文化」→ 「宗教信仰與民間文化」）
2. 從 body 抽 sub-items（`- [ ]` 清單）+ 參考資源
3. **自動 append 到 ARTICLE-INBOX §Auto-append from Issues**（新 section，跟 manual entries 分開）
4. 加 labels：`content-gap` + `good-first-article`（若適用）
5. Reply：「✅ 已收入 ARTICLE-INBOX `(auto-append from #N)`。下次 contributor 認領或 routine 排到時通知你」
6. **不 close issue**（留 open 作為 contributor onboarding hook — 認領者可在這個 issue claim）

**Idempotency**：ARTICLE-INBOX 加 issue # 標記，重跑 routine 時若 issue # 已存在 skip。

#### B. New article submission — 走 REWRITE-PIPELINE review

**識別**：

- title 含 `[Article]` prefix + 完整稿 / 完整 outline
- body 含 markdown 文章 / 完整研究 + 來源
- 通常 contributor 直接開 PR，少數先開 issue 討論

**Action**：

1. 走既有 REWRITE-PIPELINE Stage 4 verify 路徑（標準品質審）
2. 三選一：
   - **品質好** → 接受，建議開 PR / 直接代開
   - **素材好品質待改** → 接受 + 入 ARTICLE-INBOX 重寫 mode
   - **品質差** (AI slop / 無來源) → 禮貌拒絕 + 說明標準

#### C. Existing article feedback — 標 + 入 INBOX 進化候選

**識別**：

- title 含 `Feedback:` prefix + 對某 article 提建議
- body 指出某 article 的問題（缺資訊 / 觀點偏頗 / 事實錯）

**Action**：

1. 解析 feedback 提的 article path
2. 評估嚴重程度：
   - **小修補** (補一段 / 改一處引用) → 5-30 min 自己接住 + close
   - **大改寫** (全篇 framing 重來) → 入 ARTICLE-INBOX rewrite mode + 標 `needs-rewrite`
   - **事實錯** → 升 G 類 (fact-check) 處理
3. Reply 致謝 + 告知處理方向

### Priority 3: UI/UX 類 — 評估 + dispatch

#### D. UI/UX comprehensive — link to umbrella + 拆分

**識別**：

- title 含 `[UI/UX & Feature]` / 「整體優化」/「綜合」
- body 列多項建議（5+ 條 sub-items）

**Action**（像 5/13 09:15 reply #1059 那樣）：

1. Reply 致謝 + 同意框架
2. 解析 sub-items 分類：
   - 已在 #615 umbrella 內 → link
   - 是 quick win → 拆出獨立 enhancement issue + label
   - 是 large refactor → 入 future-consideration
3. 標 `enhancement` + link to #615 umbrella

#### E. UI/UX single suggestion — 評估可行性

**識別**：

- title 含「建議」+ 單一 UI 點（副標題 / logo / nav 等）
- body 不長，focused 在一點

**Action**：

1. **< 30 min fix** → 直接做 (default-action) + commit + close
2. **> 30 min** → 入 #615 umbrella + reply 排序

### Priority 4: 結構性類 — 評估

#### H. Multi-article merge / consolidation — 評估 ARTICLE-INBOX 候選

**識別**：

- title 含「合併建議」/「整併」/「重複內容」
- body 列出兩篇以上 article paths 建議整合

**Action**：

1. 評估 article paths 確實重複度
2. **小規模 (< 30 min ship merged article)** → 直接做 + close
3. **大規模 (跨多檔 + 跨 lang)** → 入 ARTICLE-INBOX consolidation mode + reply

#### I. Translation correction — 直接 fix or 入 babel

**識別**：

- body 指出某語言版翻譯錯（人名 / 用語）
- 通常已附正確翻譯建議

**Action**：

1. **單篇單一 lang 修正** → 直接 edit `knowledge/{lang}/{path}.md` + commit + close（per MANIFESTO §6 只改 knowledge/）
2. **跨多篇 / 系統性翻譯問題** → 入 SQUEEZE-MODELS-MAX babel routine queue + 標 `translation`

#### J. Accessibility — 評估 priority + 排 roadmap

**識別**：

- title / body 含「螢幕閱讀器」/「朗讀」/「鍵盤」/「色盲」/「a11y」

**Action**：

1. 評估影響範圍
2. **快速 fix** (aria label / alt text) → 直接做
3. **大改 (整體 a11y audit)** → 入 #615 umbrella + 標新 label `accessibility`（建議新增）

### Priority 5: 觀察者層 — 不自動處理

#### K. Governance / community — 留觀察者

**識別**：

- maintainer 邀請 / reviewer 變更 / repository 政策
- title 含 `@`mention 特定 contributor + 行政決定

**Action**：

1. 不自動處理
2. 標 `question`
3. Reply「@frank890417 這條需要觀察者人工決策」（如果 routine 在白天觸發）

---

## 三、Auto-append ARTICLE-INBOX 機制設計

### 觸發條件

A 類 issue 識別後自動觸發。

### 寫入位置

ARTICLE-INBOX.md 新增獨立 section：

```markdown
## §Auto-append from Issues (maintainer routine)

> Maintainer routine 識別 A 類 (content-gap suggestion) issue 後自動 append。
> 跟 §Manual entries 分開，避免格式衝突。
> Idempotent: 重跑 routine 時 issue # 已存在 skip。

### {主題} (Issue #{N})

來源：[Issue #{N}](https://github.com/.../issues/{N}) by @{author}
提出時間：{ISO date}
標籤：content-gap, good-first-article
狀態：📋 pending（等 contributor 認領或 routine 排到）

待開發 sub-topics（從 issue body 抽出）：

- [ ] {sub-topic 1}
- [ ] {sub-topic 2}
- ...

參考資源（從 issue body 抽出）：

- [{name}]({url})
- ...

🧬 auto-appended by twmd-maintainer routine at {timestamp}
```

### Idempotency guard

routine 在 append 前 grep `ARTICLE-INBOX.md` 找 `Issue #{N}` — 已存在 skip + log。

### 衝突避免

- ARTICLE-INBOX.md 是 git tracked file，routine 用 main-direct push
- 多個 routine 同時跑（理論上不會，per ROUTINE.md §半夜不碰撞）— 但要 pre-commit hook 防 conflict
- 如果有 git conflict → routine fail-loud + LESSONS-INBOX entry

### Reply template

issue 留 comment：

```markdown
✅ 已收入 [ARTICLE-INBOX](https://github.com/.../docs/semiont/ARTICLE-INBOX.md#auto-append-from-issues-maintainer-routine) `(auto-appended from #{N})`。

下次 contributor 認領這個主題或 cron `twmd-rewrite-daily` 排到時，會通知 @{author}。如果你想直接認領開始寫，可以 reply 「我來」或直接開 draft PR。

🧬 — Taiwan.md maintainer routine
```

---

## 四、新 label 建議

### 必加（v1.0 ship）

| Label           | 顏色                              | 描述                                                     | 對應類別        |
| --------------- | --------------------------------- | -------------------------------------------------------- | --------------- |
| `accessibility` | `c5def5` (淡藍)                   | a11y / 螢幕閱讀器 / 鍵盤導航                             | J               |
| `fact-check`    | `b60205` (紅，high priority 暗示) | 急需事實查核（升級 needs-verification 的 priority 版本） | G priority case |

### 考慮加（v2.0 ship）

| Label           | 顏色            | 描述                                               |
| --------------- | --------------- | -------------------------------------------------- |
| `consolidation` | `fbca04` (黃)   | 多文整併建議                                       |
| `auto-routed`   | `7057ff` (淡紫) | 已由 maintainer routine 自動分類處理（便於 audit） |

### 不加（reuse 既有）

- 翻譯類 reuse `translation`
- merge 類別 reuse `enhancement`
- governance reuse `question`

---

## 五、Action 決策樹（一張表）

| 識別特徵                    | 類別 | Default action                                        | Label                               | 進 ARTICLE-INBOX? |
| --------------------------- | ---- | ----------------------------------------------------- | ----------------------------------- | ----------------- |
| `[Fact Check]` / 「資料錯」 | G    | 5 min verify → fix/close；否則標 `needs-verification` | `needs-verification` / `fact-check` | ❌                |
| `[Bug]` / 可復現            | F    | P0/P1 嘗試解；P2 留 open                              | `bug`                               | ❌                |
| 「📋 內容缺口」/「網站缺」  | A    | **自動 append ARTICLE-INBOX** + reply                 | `content-gap` `good-first-article`  | ✅ auto           |
| `[Article]` + 完整稿        | B    | 走 REWRITE-PIPELINE review                            | `content`                           | 條件 ✅           |
| `Feedback:` + article path  | C    | 小修自己接，大改入 INBOX                              | `content` `needs-rewrite`           | 條件 ✅           |
| `[UI/UX]` + 多項            | D    | reply + link umbrella + 拆 sub-issues                 | `enhancement`                       | ❌                |
| 單一 UI 建議                | E    | < 30 min 做，否則入 umbrella                          | `enhancement`                       | ❌                |
| 「合併建議」/「整併」       | H    | 小做大入 INBOX                                        | `enhancement`                       | 條件 ✅           |
| 翻譯修正                    | I    | 單篇直接改，系統性入 babel                            | `translation`                       | ❌                |
| a11y 類                     | J    | 快速 fix 做，大改入 #615                              | `accessibility` (new)               | ❌                |
| Governance                  | K    | 不處理，標 question                                   | `question`                          | ❌                |

---

## 六、實作 ship plan（下個 session）

### Phase 1: MAINTAINER-PIPELINE.md v2.2 升級

修改 Stage 2 + Stage 3：

1. **Step 2.1 重寫 issue 分類表** — 8 類 → 11 類，加 Priority 1-5 排序
2. **新 Step 3.6: Issue triage 流程** — 對每類定義具體 action sequence
3. **新 Step 3.6.1: A 類 auto-append ARTICLE-INBOX 機制** — idempotency + reply template + commit message format
4. **新 Step 3.6.2: G 類 fact-check 優先處理** — 5 min verify gate
5. **更新 §核心原則** — 加 issue triage 預設行為（過去只講 PR）

### Phase 2: ARTICLE-INBOX.md 加 §Auto-append 區

1. 新 section `§Auto-append from Issues (maintainer routine)`
2. 加 idempotency guard 規範
3. 加 manual entries 跟 auto-appended entries 分流規範

### Phase 3: 新 label ship

```bash
gh label create accessibility --color c5def5 --description "a11y / 螢幕閱讀器 / 鍵盤導航"
gh label create fact-check --color b60205 --description "急需事實查核（priority over needs-verification）"
```

### Phase 4: Mirror SKILL.md sync

`~/.claude/scheduled-tasks/twmd-maintainer-pm/SKILL.md` + `twmd-maintainer-daily/SKILL.md` 同步 v2.2 鐵律：

- Issue triage 11 類分流
- A 類 auto-append ARTICLE-INBOX

### Phase 5: 第一次 routine 跑驗證

下次 maintainer-pm @ 22:00 跑時觀察：

- A 類 (#128 / #129 / #130 等 18 條) 是否自動 append ARTICLE-INBOX（這些已 open 中，第一次跑會 backfill 全部 18 條）
- G 類 (#680 closed / #912 open) 處理是否正確
- 既有 contributor PR backlog 不被中斷

**估時 1.5-2 hr**（含 mirror sync + 三層 verify）。

---

## 七、Open questions（送哲宇）

1. **auto-append idempotency**：用 issue # 標記 ARTICLE-INBOX 已存在 entry 判 skip 是否足夠？或要更細的 hash？
2. **A 類 issue 是否 close**：append ARTICLE-INBOX 後 issue 留 open 作為 contributor claim hook 或 close？
3. **新 label `fact-check` 是否需要**：跟既有 `needs-verification` 區隔開？或統一用 `needs-verification`?
4. **`accessibility` label**：要 ship 嗎（#280 是孤例）？或先 reuse `enhancement`?
5. **A 類 backfill 18 條 existing**：第一次跑要不要 backfill 所有歷史 A 類（會一次 append 18 條到 ARTICLE-INBOX，可能太密集）？或只處理 routine 觸發後新進的 issue？

---

_v1.0-draft | 2026-05-13 09:35 +0800 — 哲宇 prompt 觸發 issue 分類盤點。完整 70+ historical issues 盤點到 11 類 + 對應 action 流程 + auto-append ARTICLE-INBOX 機制設計。實作 MAINTAINER-PIPELINE v2.2 留下個 session。_
