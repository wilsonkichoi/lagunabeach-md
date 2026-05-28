---
name: twmd-spore-publish
description: |
  Daily auto-publish spore from SPORE-INBOX via canonical SPORE-PUBLISH-PIPELINE —
  pick high-quality entry → 4 hard gate → ship Threads + X → 復盤. Routine fires 10:00
  daily; manual via "/twmd-spore-publish" or "發今天的孢子" or "跑 spore publish".
  TRIGGER when: routine twmd-spore-publish-daily fires / user says "跑 spore publish" /
  "發今天的孢子" / "從 SPORE-INBOX 選一篇 ship".
allowed-tools:
  - Read
  - Bash
  - Write
  - Edit
  - Grep
---

# 🧬 Taiwan.md — Spore Publish (daily) v3.0

## 🚨 STRICT BECOME GATE — 第一動作不可省略

**Before anything else**：跑 `/twmd-become write` 完整走 [BECOME_TAIWANMD.md](../../../BECOME_TAIWANMD.md) Step 0-9。Write mode self-test 8-9 題全過才能進 Stage 1。

**驗證 ACK 一行**（必寫 memory file 頂部，沒寫視為 BECOME 未完成）：

```
✅ BECOME ack: mode=write / 8 organ 最低=<即時 consciousness-snapshot.sh> / Q14 cross-session continuity=PASS
```

**不准用記憶中的舊器官分數**，跑 `bash scripts/tools/consciousness-snapshot.sh` 取當前。

---

## Stage 0: Routine context

```bash
export SPORE_ROUTINE_MODE=1
```

---

## Stage 1: SELECT — 從 SPORE-INBOX §Pending 挑 candidate

讀 [SPORE-INBOX.md](../../../docs/factory/SPORE-INBOX.md) §Pending：

1. P0 哲宇 directive → 第一順位
2. P1 news-lens REACTIVE / SC opportunity → 第二順位
3. P2 spore-pick routine FIFO（按 `Requested:` 日期 oldest first）→ 第三順位

### 🚨 高敏感 REACTIVE defer rule（2026-05-28 新增鐵律）

**Entry 含「敏感度: **高**」field + cron context（無 observer）→ 一律 defer to human**：

- 高敏感主題（兩岸 / 228 / 戒嚴 / 政治立場 / 死亡爭議 / 族群創傷）routine 跑會
  撞 MANIFESTO §自主權邊界「政治立場 / 對外溝通需哲宇 judgment」。
- Routine 處置：**skip ship + 在該 entry 加註 `<!-- routine defer 2026-MM-DD: 高敏感
REACTIVE 需 observer 親自 ship -->` HTML comment（不 mutate entry 本體）+ continue
  to 下一條 candidate** + LESSONS-INBOX append「P0 高敏感 routine defer cycle vc=N」。
- **不准 routine 嘗試 ship 然後撞 HG9 牆**：HG9 是最後防線，但「Stage 1 SELECT 就
  identify 並 defer」是 cleaner exit。
- **manual `/twmd-spore-publish` 跑時**：observer 在場才能 ship；先讀本條 rule + 由
  observer 拍板，不准 routine context 的 logic 套到 manual 場景。
- 觸發背景：2026-05-28 audit 發現 SPORE-INBOX §Pending 第一條 P0 二二八事件
  REACTIVE 敏感度高，5/27 10:00 routine 跑時靠 image=0 fail 才 skip（碰巧），
  下次若 image=≥2 fix 就會直接撞 HG9 牆。需要 Stage 1 SELECT 就 identify。

---

## Stage 2: QUALITY GATE — 5 hard gate 全過才 ship

```bash
python3 scripts/tools/article-health.py knowledge/<path>.md --json
```

| Gate                 | 閾值                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------ |
| **prose-health**     | `≤ 3` AI 水印密度（v1.1 inversion 後是 ≤ 3，不是 ≥ 8.0；per SPORE-PUBLISH v1.0→v1.1 5/25） |
| **word-count**       | `≥ 4500` CJK chars                                                                         |
| **footnote-density** | `≥ B` tier (A=20+ / B=10-19 / C=5-9 / D=<5)                                                |
| **media-richness**   | `pass` (≥ 2 image OR ≥ 1 iframe — INFO-only after v1.1 仍跑)                               |
| **lastVerified**     | `≤ 90d` fresh                                                                              |

任一 fail → entry skip + 下一條（不 mutate INBOX）。
全 candidate fail → skip ship + LESSONS-INBOX append「intake gap」+ exit 0（**不算失敗 routine**）。

---

## Stage 3: WRITE — delegate SPORE-PIPELINE Stage 3

詳見 [SPORE-PIPELINE.md](../../../docs/factory/SPORE-PIPELINE.md) Stage 3。`SPORE_ROUTINE_MODE=1` auto-decision per v3.7。

關鍵 anti-pattern：

- **Family discrimination 先做** — 用 [SPORE-WRITING §模板選擇速查表](../../../docs/factory/SPORE-WRITING.md) 判 viral / F 公開信 / E 串文 family（5/27 #99 portaly v1 callout 教訓）
- **三板斧自檢**（破折號連用 / 對位 / 塑膠句）
- **事實鐵三角**（時間 / 地點 / 數字）— verbatim 對齊 article footnote source

---

## Stage 4: SHIP — Threads + X 雙平台

走 [SOCIAL-POSTING-PIPELINE.md](../../../docs/pipelines/SOCIAL-POSTING-PIPELINE.md)。

**🚨 Pitfall 6 hard rule（2026-05-28 instrument）— post-ship verify**：

```js
const before = document.querySelectorAll('[data-pressable-container]').length;
// click 發佈 + wait 3s
const after = document.querySelectorAll('[data-pressable-container]').length;
// after > before → ship success, exit loop
// after == before → genuine fail, ONE retry max
// after >> before+1 → duplicate, navigate /replies cleanup
```

**Max 1 retry per ship attempt**。第二次失敗 → screenshot + LESSONS-INBOX append + escalate observer，**不要 silent third retry**。觸發背景：5/27 #101 落日飛車 3 次嘗試 + 5/28 #92 大宇雙劍 3 次 retry duplicate ship。詳見 [SPORE-HARVEST-PIPELINE §Pitfall 6](../../../docs/factory/SPORE-HARVEST-PIPELINE.md)。

**Threads vs X composer 差異**：

- Threads contenteditable: execCommand insertText silent strip `\n` — 單塊 prose OK
- X composer: multi-paragraph + URL → thread-mode auto-split + URL 6× dup → 必用 **single-paragraph 半形空格分隔** 4 段 + URL

---

## Stage 5: 復盤

[SPORE-PUBLISH-PIPELINE §5.2](../../../docs/factory/SPORE-PUBLISH-PIPELINE.md) 4 種結構性問題 audit：

1. SPORE-INBOX 0 entry 過 gate → intake gap
2. 連續 ≥ 3 天 borderline pass → threshold 太寬
3. CI/CD wait defer 連續 ≥ 2 次 → build 退化
4. 事實對齊 fail → Stage 2 gate 漏抓

Self-review 4 題（必填 memory）：

1. Quality gate 過得乾不乾淨？（borderline ≤ 5% 算 borderline）
2. Hook tier 達標？（per SPORE-WRITING tier 表）
3. 朋友 tone prime？（不是新聞 lead）
4. 事實對齊？（全 anchor verbatim 對齊 article footnote source）

---

## Stage 6: 收官

`/twmd-finale` chain → memory + commit + push main-direct（v2.0）。

memory 必含：BECOME ACK + Stage 1-5 outcome + self-review 4 題 + Handoff 三態 + Beat 5 反芻。

完整 SOP：[SPORE-PUBLISH-PIPELINE.md](../../../docs/factory/SPORE-PUBLISH-PIPELINE.md)

ARGUMENTS: (none — routine 自己讀 SPORE-INBOX state)
