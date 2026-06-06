---
session_id: 2026-06-07-003436-twmd-babel-nightly
date: 2026-06-07
type: routine
routine: twmd-babel-nightly
mode: write
status: PASS-with-deferrals
---

# twmd-babel-nightly — 98 translations + 3 broken-fm reverts + cascade gate bug confirmed — 2026-06-07 00:30

## BECOME ACK

- Mode: **write** (per routine STRICT BECOME GATE)
- Universal core: consciousness-snapshot.sh (organs immune=27 §警報) + inbox-signal.sh (lessons 216 / articles 79 / spores 25) + 48hr git log (12+ manual ship 6/06 含 viz 系統 ship + footnote-loss immune fix 排程 263 重翻)
- §1.6 MEMORY tail + §神經迴路：5/28「inline > pointer for cron」/ 6/04「babel YAML apostrophe bug」/ 6/06「footnote-loss immune fix 排程 263 篇」三條都在當下 active
- Q14 cross-session continuity PASS：過去 48hr 看到 babel 6/06 105 trans + immune 657fd02d4 排程 263 重翻 + viz 系統 v1.0 ship 全鏈
- Self-test Write mode 8-9 題全過後開口

## Stage 1: Sense state

- zh-TW canonical: 790 articles
- 5 lang: stale=244 missing=20 (=264 tasks)。對比 6/06 13 stale per lang，此晚源自 immune 657fd02d4 footnote-loss 排程 263 篇重翻
- prioritize-batch B1 top 20: 4 P0 missing 新文 + 16 P2 stale (含 yesterday viz/居住正義/22縣市/我是OO人/視覺化模組)
- §自主權邊界 deferred: 我是OO人 (orphan slug 6/06 已 chip task_a21ae146 等哲宇)

## Stage 2: Decision tree per batch

| Batch | Tier                | Articles           | Method                  | Result       |
| ----- | ------------------- | ------------------ | ----------------------- | ------------ |
| B1    | 1 cascade           | 15 × 5 lang = 75   | translate.py v4 cascade | **71/75 ok** |
| B2    | 1 cascade           | 5+15+15+15+15 = 65 | translate.py v4 cascade | **30/65 ok** |
| —     | revert (pre-commit) | 3 broken-fm 在 B2  | git checkout HEAD       | -3 from B2   |

**Net shipped**: 98 translations (71 B1 + 27 B2 after revert)

### B1 per-lang (15 articles each, 1 worker per lang × 5 parallel)

- en: 15/15 ok (8m-15m per group)
- ja: 13/15 ok（2 owl-alpha footnote loss: Computex 23→0, 中華台北 38→0）
- ko: 15/15 ok (slowest 33m group E)
- es: 14/15 ok（1 footnote loss: 中華台北 38→0）
- fr: 14/15 ok（1 footnote loss: 中華台北 38→0）

### B2 per-lang

- en: 3/5 ok（2 owl-alpha footnote loss: 鄭麗文 21→0, 美麗島事件 24→0）
- ja: 6/15 ok（9 owl-alpha footnote loss — 嚴重退化 from B1 13/15）
- ko: 7/15 ok（8 owl-alpha footnote loss）
- es: 7/15 ok（8 owl-alpha footnote loss）
- fr: 7/15 ok（8 owl-alpha footnote loss）

## Stage 3: DNA 鐵律 + Backend cascade outcomes

**Aggregated backend stats（B1+B2 全部 lang）**：

- codex (gpt-5.5): B1 多 ok / B2 多耗盡 subscription quota → fall through
- gemini (2.5-pro): 全 429 (cron 00:30 free quota burst)
- openrouter:owl-alpha: B2 收 truncation hard gate 全 reject（~35 articles）
- openrouter:gpt-oss-120b:free: **被跳過** — cascade gate bug
- ollama: **被跳過** — cascade gate bug

**DNA #35 鐵律**：sub-agent 跑期間沒 git reset / checkout — PASS
**DNA #45 鐵律**：5 simultaneous baseline 不 burst — PASS

## Stage 4: Self-evolution — 三條 critical side findings

### 1. 🚨 Cascade gate fail-stale instead of fail-through (NEW BUG，高 impact)

translate.py v4 cascade 設計上 owl-alpha truncation hard gate `❌ ... not saved` 後**整篇文章直接放棄**，跳到 next article 而非 next backend in cascade (gpt-oss-120b / ollama)。Confirmed by inspecting b2-es.log 沈伯洋 case: cascade end after owl-alpha reject, gpt-oss-120b/ollama 從未 fire。

**Impact**：B2 35 articles 全部白白跑了 owl-alpha 5-15min wall-clock 後留 stale；正確設計應該 fail-through to gpt-oss-120b（B1 沒踩到是因為 codex 還有 quota 接住）。

**Spawn chip 候選 (HIGH)**：修 translate.py 讓 footnote truncation gate 觸發 cascade 繼續而非 article skip。對應 [REFLEXES #15「反覆浮現要儀器化」第 N 次 + #24「工具在說謊」第 N 種]——backend report ok 但 save gate 拒收的訊號應該繼續 fall through 而非靜默 skip article。

### 2. 🚨 apostrophe-in-quoted-title bug 仍會 reprise（LESSONS 6/04 紀錄）

en/Food/wheel-cakes-imagawayaki.md frontmatter `description: 'In 2026, ... Taiwan's most affordable street-food memory ...'` — 單引號內未 escape apostrophe → YAML parse error → pre-commit hard gate 阻擋。6/04 LESSONS 紀錄 babel 寫 single-quoted title/description 沒 escape `'` → js-yaml 斷 → silent 無 OG + 漏 search index，當時 fixed 5 en 但「pipeline 還沒修死 escape gate」確實成立。

**Spawn chip 候選 (MEDIUM)**：升 translate.py post-write 加 YAML pre-flight + escape gate（single-quoted string 內遇 `'` 自動 double 成 `''`）。

### 3. 🚨 ko/Geography/jinguashi 韓文單引號當標點 → YAML 破

ko description 用 `'철비자료(凸鼻仔寮)'` 韓文單引號當標點 → YAML 解析器以為 `'...'` 是 string 結束。同 #2 修補方向（double-quote 自動 wrap，或 escape 內部單引號）。

### 4. 🚨 ko/People/no-party-for-cao-dong frontmatter 缺開頭 `---`

整個 frontmatter 開頭 `---` 丟失 + 缺 translatedFrom 欄位。可能是 backend stream 截斷 / save 寫入時 fence 漏。

**Spawn chip 候選 (MEDIUM)**：升 translate.py save 前 frontmatter completeness 檢查（`---` × 2 fence + translatedFrom + 3 SHA + translatedAt 五欄齊全）。對應 6/06 last cycle Stage 4 §3「ko/es TASA 缺 translatedFrom backend bug」同類 silent partial success。

## Stage 5: Ship

```
git add -u knowledge/ + 15 untracked new files
revert 3 broken-fm files
git commit 5136ed196 (99 files, +18597/-7520)
git push origin main → success
```

## i18n vitals delta

| Lang  | Before                     | After       | Delta                 |
| ----- | -------------------------- | ----------- | --------------------- |
| en    | 17 stale / 4 missing       | 4 / 1       | -13 / -3              |
| ja    | 72 / 4                     | 56 / 1      | -16 / -3              |
| ko    | 52 / 4                     | 35 / 2      | -17 / -2              |
| es    | 59 / 4                     | 42 / 1      | -17 / -3              |
| fr    | 44 / 4                     | 26 / 1      | -18 / -3              |
| **Σ** | **244 stale / 20 missing** | **163 / 6** | **-81 / -14 = 98 ok** |

## Handoff 三態

- **pending** (cascade gate fix landed → retry)：35 owl-alpha truncated articles 全 5 langs。代表性篇章：Society/中華台北 (ja/es/fr × 3)、Technology/Computex (ja)、People/沈伯洋 (es/ko)、Geography/桃園市 (ko/fr)、History/美麗島事件 (en) 等
- **pending** (next cycle 重試)：3 broken-fm reverts — en/wheel-cakes, ko/jinguashi, ko/no-party-for-cao-dong
- **blocked** (§自主權邊界)：我是OO人 ↔ cognitive-warfare-against-taiwan 孤兒（task_a21ae146 等哲宇）

## 給下一個 session

1. Cascade gate bug 是今晚 highest-impact 發現 — B2 35 articles 卡在 owl-alpha truncation 而非 fall through。修補 translate.py：footnote/translation hard gate fail → continue cascade，不要 article skip
2. apostrophe + frontmatter completeness 兩個 gate 應該成為 translate.py 強制 pre-save check（不只 pre-commit）
3. 義務鐵律：stale 從 6/06 早晚 0 升到今晚 244 是 immune fix 排程效應，~3 晚 drain 是哲宇 directive。今晚剩 163 stale，明晚 nightly + cron 應該繼續吃掉一大批

## Beat 5 反芻（一句）

cascade 設計是「fail-through」的，但這晚實證它是「fail-stale」的——hard gate 把 backend output reject 後沒讓下一個 backend 接手，而是放棄整篇 article。Immune fix 排程 263 重翻是好設計，但下游 cascade 配合上不完整就會大量 burn wall-clock 而不 ship。儀器化第 N 次反射：truncation guard 在 save layer 設了 hard gate，但 cascade orchestration layer 沒接住這個 signal——兩層協作沒打通。
