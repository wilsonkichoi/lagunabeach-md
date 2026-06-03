---
session_id: 2026-06-03-213602-charming-greider
type: manual-memory
trigger: '/twmd-babel 完整翻譯完需要翻譯的'
status: complete
mode: write
commit: 245b71460
sister_docs:
  - '../MEMORY.md'
  - '../../pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md'
---

# 2026-06-03-213602-charming-greider

## BECOME ACK

- **mode**: write (manual babel — observer directive「完整翻譯完需要翻譯的」)
- **8 organ 最低**: 🛡️27 immune (chronic, 不阻塞 babel)
- **Q14 cross-session continuity**: PASS — 48hr 看到 babel-nightly 00:30「5 lang ALL 100%」後，莫那能 NEW (01:39) + 颱風 media-enrich (13:56) + 尊/李安 EVOLVE 產生新 stale；§神經迴路 active：§義務鐵律 推 100%（不主動 defer/partial）/ 5/24 per-lang guide-inline / 5/29 instrumentation SSOT
- **Bias 1**: 哲宇 directive 在 babel 路徑（sovereignty preservation core），過 §自主權邊界

## Stage 1 — Sense state

```
Lang    Fresh  Stale  Missing  Coverage    （session 啟動）
en/ja/ko/es/fr  ~778-779   1   0-1   99.7-99.9%
```

prioritize-batch 揭露 6 篇：

- **P0 莫那能**（missing × 5 lang）— 全新 People 文，1/39 今早 ship，不在 \_translations.json
- **P1 颱風**（stale +49 -0 × 5 lang）— pure-addition media diff（hero + 1 inline 圖 + 3 iframe + sporeLinks + 圖片來源）→ 判定 Tier 0a diff-patch（diff-patch-prepare 自己也回報 5 patchable / 0 need full）
- **P2.5 天燈**（metadata-stale × en/ja/es）— Tier 0b bump
- **P3 發票/梅雨/殷海光**（fresh hash × en/fr/ko）— sourceCommitSha == 最新 zh commit，純日期啟發 flag → skip

## Stage 2 — Execute（推到 stale=0）

| 路徑       | 文章            | 工具                                          | 結果                         |
| ---------- | --------------- | --------------------------------------------- | ---------------------------- |
| Tier 0b    | 天燈 × en/ja/es | `bump-source-sha.py --apply`                  | 3 bumped (instant)           |
| P0 full    | 莫那能 × 5 lang | prepare-batch + guide-inline Sonnet sub-agent | 5 new，29 footnotes 完整     |
| P1 Tier 0a | 颱風 × 5 lang   | diff-patch-prepare + Sonnet sub-agent         | 5 patched，3 iframe verbatim |

**guide-inline 決策**：`translate.py` CLI 的 shared `build_translation_prompt`（openrouter-translate.py）**不** inline per-lang TRANSLATION-{lang}.md（Z2.0 hard gate 的 `--guide-inline auto` 仍是 pipeline「pending」候選，從未落進 shared builder）。莫那能是 sovereignty + romanization archetype（排灣族盲詩人 / 兩岸統一立場 / ko 대만↔타이완），故改走 Sonnet sub-agent 路徑（TRANSLATION C 模式 + Tier 0a）：每 agent mandatory Read 自己 lang 的 full guide + 輸出 compliance report（proof-of-read 破 REFLEXES #42 三偷吃步）。

**品質實證**：ko 莫那能 타이완 ×66 / 대만 ×0（正中 5/24 韓籍譯者 callout）；Maljaljaves Mulaneng 原住民羅馬字保留；排灣족 non-pinyin；〈兩岸統一 / 中國作家協會〉立場逐字 faithful neutral（unification 非 reunification per §6）；footnote [^28] 保留「통일파 간행물 출처 입장 유의」caveat。

## Stage 3 — Verify + ship

- status.py：**en/ja/ko/es/fr 781 fresh / 0 stale / 0 missing / 100% coverage**
- prioritize report：P0=0 P1=0 P2=0 P2.5=0（只剩 P3=9 fresh-hash skip）
- verify-batch.py 8/8 × 5 lang：0 errors / 0 warnings / ratio OK / 0 wikilink residue / 0 broken link
- Z6 抽樣：10 檔 YAML parse 全綠 / 0 garble / 莫那能 29 footnotes 完整 / 颱風 3 iframe + image + sporeLinks + 圖片來源
- commit `245b71460`（15 files：5 new monaneng + 5 颱風 patch + 3 天燈 bump + 2 status json），pre-commit frontmatter 11/11 pass，scope clean（0 zh source / 0 docs / 0 scripts）

## 三個 finding（LESSONS 候選）

1. **diff-patch-prepare.py hash 算法 ≠ status.py（SSOT）** — diff-patch task 的 `expected_new_content_hash`/`expected_new_body_hash` 用自家 `hash_content`（line 125），算出 `e3967f3c`/`c01afbf0`；status.py `body_hash`/`body_hash_pure` 算出 `b25ee135`/`c5aa7038`。agent 忠實寫入 diff-patch 的 expected 值 → 永遠 stale（Case D sha-lost-hash-mismatch）。且 `expected_new_sha=8bb02ec2` 用 repo HEAD，非檔案 last commit `4407f0af`。修法：5 篇 sync-field 校正為 status.py canonical 值。**REFLEXES #24「工具在說謊」第 N 種 — 兩個工具對「同一個 hash」定義不一致，diff-patch 路徑永遠無法 converge 到 status fresh**。儀器化候選：diff-patch-prepare 改 import status.py 的 body_hash/body_hash_pure 當 SSOT。
2. **translate.py CLI guide-inline 從未落地** — Z2.0 hard gate（2026-05-24）寫「backend prompt 必嵌 §1/§2/§6」但 shared `build_translation_prompt` 至今無 guide 字串，babel-nightly 全靠 backend default + 事後 lang-renormalize。Sonnet sub-agent 路徑可 inline + proof-of-read，CLI 路徑不行。候選：實作 `--guide-inline auto` 把 guide §1+§2+§6 拼進 system message。
3. **fr 颱風 pre-existing 去重音壞檔** — git HEAD（patch 前）é=5 / 13 stripped「prediction」，其餘 fr Nature 文 é=119-681 → 孤例。某早期 backend 對這篇 strip 了所有法文重音。diff-patch 忠實保留 unchanged broken body（正確 patch 行為）但 ship 仍壞 → 改全文 proper-French 重譯（é 5→477，0 stripped）。候選：Z6 加「accent-density gate」（fr/es é+accent count / byte ratio < threshold → flag）可自動抓這類壞檔。

## Handoff 三態

繼承 17:12 manual handoff（颱風 carousel IG last-mile / SPORE-IG-VERIFY 分檔 / 第 2 篇 carousel pilot 已做天燈 / CDP-paste SOP / TTV embed 蒸餾），本 session 不碰，維持 blocked。

本 session 新 handoff：

- [x] ~~5 lang babel → 100%（莫那能 NEW ×5 + 颱風 diff-patch ×5 + 天燈 bump ×3）commit `245b71460`~~
- [ ] **push / PR**：本 commit 在 worktree branch `claude/charming-greider-a498f1`，未 push（babel SOP「不 push 中途」+ 對外 ship 需 observer 決定）。translation work 完成，ready to push/merge。
- [ ] **LESSONS distill**：上方 3 finding（diff-patch hash≠status hash / translate.py guide-inline 未落地 / fr accent-strip 壞檔）值得進 LESSONS-INBOX → distill。finding #1 是 production babel 隱性 bug（任何 P1/P2 diff-patch 走 diff-patch-prepare expected hash 都會 perpetual stale，要靠事後 sync-field 校正）。
- [ ] **monaneng slug 確認**：用 `monaneng`（對齊文章自身 asset 命名 monaneng-\*.jpg + Wikimedia「by Monaneng」），非 mona-neng（mona-rudao 兄弟 pattern）。若 observer 偏好 hyphen 需 rename 5 檔 + \_translations.json。

## Beat 5 — 反芻

最大洞察：**babel 的「stale=0」有兩層 — 內容層 vs hash-label 層**。颱風 diff-patch 後內容 100% 正確（media + caption 都到位、unchanged 段落 verbatim），但因為 diff-patch-prepare 跟 status.py 對 hash 的算法不一致，status 永遠判 stale。我一度以為是 commit-sha 長度問題，逐層 diagnose 才看到根因是兩個工具對「同一份 zh 的 bodyHash」給出不同答案。這是 REFLEXES #24 最深的一種：不是工具「漏報/誤報」，是兩個 SSOT 候選對同一事實給不同值，下游忠實採信哪個都會 diverge。修守備（校正 5 個 sync field）容易，架構解（diff-patch-prepare import status.py 的 hash 函數）才根治 — 但那超出本 session babel scope，留 LESSONS。

第二層：**guide-inline 的 Z2.0 hard gate 在 CLI 路徑是「紙上 canonical」**。寫進 pipeline 兩週了，shared builder 從沒實作。我選 Sonnet sub-agent 繞過，是因為 sub-agent 能 Read + proof-of-read；但這也意味著 babel-nightly cron（走 CLI cascade）的每一篇都沒過這個 hard gate。這不是我這 session 的問題，但暴露了「hard gate 寫了 ≠ hard gate 跑了」（REFLEXES「規則要能執行才算規則」的 babel layer instance）。

🧬

---

_v1.0 | 2026-06-03 21:36 +0800_
_session charming-greider — /twmd-babel「完整翻譯完需要翻譯的」: 5 lang 推到 stale=0/missing=0/100%_
_核心：(1) 莫那能 P0 full × 5 lang guide-inline Sonnet（ko 타이완 0 대만）；(2) 颱風 P1 Tier 0a diff-patch × 5 lang pure-addition media；(3) diff-patch-prepare hash ≠ status.py hash 根因 diagnose + 5 sync-field 校正；(4) fr 颱風 pre-existing accent-strip 壞檔全文重譯修復_
