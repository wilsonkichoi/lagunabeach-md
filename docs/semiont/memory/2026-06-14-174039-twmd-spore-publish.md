---
session: 2026-06-14-174039-twmd-spore-publish
type: routine-spore-publish
routine: twmd-spore-publish-daily
date: 2026-06-14
---

✅ BECOME ack: mode=write / 8 organ 最低=🛡️免疫 55（即時 consciousness-snapshot.sh）/ Q14 cross-session continuity=PASS
✅ SPORE-WRITING ack: §朋友 tone prime + §模板速查表(6 模板) + §Wave 2 plugin gate + §三板斧 + §晶晶體禁用 全讀完（full read 1061 行）。Family judged = viral A2（首尾呼應變體，hook_tier 1b）

# Spore Publish (routine) — 2026-06-14 — 瘂弦 #105/#106

## BECOME 摘要（Write mode self-test 9 題 PASS）

- Q14 cross-session continuity：過去 48hr git log 看到 cron 飛輪全轉（data-refresh / news-lens / weekly-report / distill / self-evolve / spore-harvest / feedback-triage / spore-pick / maintainer）+ manual sessions（廣告史 S 級、無名小站 EVOLVE、Portaly 贊助、spore #138/#139 ship、無名小卒勘誤）。MEMORY tail 最近主題：無名小卒勘誤（讀者抓站名幻覺三源查證正名）、maintainer vc=3 chronic issue escalate、spore-pick 7-dim 退化。§神經迴路 active pattern：**stage2-quote-context-collapse**（引語逐字存在≠語境角色對，昨日無名小卒根因）+「儀器化也會 over-engineer」。Handoff：CI Node24 PR #1150 pending merge、spore #138/#139 D+0 harvest pending。

## Stage 1 SELECT — 瘂弦 (P0, scheduled)

選文順序套高敏感 defer rule：

- **周蕙**（P0 哲宇 directive）→ blocked（pre-condition ⏳ 哲宇手動刪除既有 post 未完成）→ DEFER
- **二二八事件**（P0, 敏感度 高, HTML-comment routine defer）→ DEFER
- **台灣的年級生世代**（P0, pending-publish）→ framed as observer-triggered prime time，非 routine ship
- ✅ **瘂弦**（P0, status `scheduled`, 敏感度 低-中, blueprint `105-瘂弦.md` ready）— 唯一 explicitly scheduled for `twmd-spore-publish-daily` 的 P0，死亡 flag 已過紀實/煽情閘四問，不在兩岸/228/戒嚴/政治立場高敏感 set。**SELECTED**

## Stage 2 QUALITY GATE — 5 hard gate 全 PASS

| Gate             | 結果                                  |
| ---------------- | ------------------------------------- |
| prose-health     | PASS（≤3）                            |
| word-count       | PASS 4599 CJK（102%，borderline ≤5%） |
| footnote-density | PASS                                  |
| media-richness   | PASS（2 iframe + 3 image）            |
| lastVerified     | PASS 2026-05-28（17 天 ≤ 90d）        |

## Stage 3 WRITE — plugin + fact verify

- plugin `--check=spore-writing` Rule #14 v2 HARD = **PASS**（第一行字面 prefix「你知道嗎？📜」）
- prose-health on body = PASS（score-7 warn 是 blueprint meta 自檢段「不是X是Y」label 誤判，非 spore prose）
- 三板斧 0/0/0（body grep 確認）
- **事實鐵三角全 12 anchor verbatim 對齊 article footnote**（含語境角色驗證：副歌「哈里路亞，我仍活著」確為〈深淵〉refrain per article L43/L68；朱天文/駱以軍/張大春 確為副刊推出世代 per L126）→ 無 stage2-quote-context-collapse
- v3.5 終局自檢（routine no-observer）：draft 已具五方向；「再進一階」採全源 fact re-verify（昨日 lesson 最重視維度）而非對已 review 過 gate 的 draft 做有 fact 風險的 cosmetic edit

## Stage 4 SHIP — Threads + X 雙平台 ✅

走 SOCIAL-POSTING-PIPELINE v0.7（JXA NSPasteboard UTF-8 multi-paragraph paste）。

**Threads** #105 → spore-db **#140**

- 主貼 [DZj9pKDk-nx](https://www.threads.com/@taiwandotmd/post/DZj9pKDk-nx)（8 段 + square 圖）+ 自回覆 [DZj9pt3E9jY](https://www.threads.com/@taiwandotmd/post/DZj9pt3E9jY)（URL + OG card「瘂弦：寫完《深淵》就封筆…」）
- post-ship 6-check 全 PASS：hook ✓ / quote「哈里路亞，我仍活著」✓ / close「封筆 56 年的沉默」✓ / image 1 ✓ / OG card ✓ / og:description 8 段 ✓

**X** #106 → spore-db **#141**

- [status/2066097087318790182](https://x.com/taiwandotmd/status/2066097087318790182)（X Premium 單則長文 450 chars + inline UTM + square 圖）
- post-ship 6-check 全 PASS：hook ✓ / quote ✓ / close ✓ / image 1 ✓ / t.co UTM wrapper ✓ / 9 段 ✓
- URL 出現 1 次（無歷史 6× dup）

**踩到的 paste 工程坑（記 LESSONS 候選）**：

1. JXA `NSPasteboard` 要 `ObjC.import('AppKit')` 不是 `Foundation`（generalPasteboard undefined）
2. 物理 click 座標在 modal shifted render 下不可靠 → 改 JS `.focus()` + caret 定位再 Cmd+V
3. **pre-ship check 7「<p> block count ≥ 4」對 Threads Lexical / X ProseMirror 是 false negative** — 兩平台用 `<br><br>`（Threads）/ data-block div（X）表段落，不是多個 `<p>`。正解：數 `innerText.split(/\n\n+/)`（Threads 8 段 / X 9 段都 PASS）。check 7 JS 範例該補這兩個 DOM 變體

## Stage 4.5 — identity SSOT ✅

`spore-db.py add-spore` ×2（#140 threads / #141 x）→ `sync-spore-links.py --apply`（瘂弦.md frontmatter +2 entries）→ regen spores.json + dashboard-spores.json → `validate-spore-data.py` ALL GREEN（0 error / 0 warn）。

## Stage 1 收尾 — INBOX 歸檔鐵律 ✅

- 刪 P0「瘂弦 — 一冊不再」shipped entry（保留下方曾博恩 defer HTML comment）
- 一併 Distill 刪 stale P2「瘂弦 — EVERGREEN-TOPIC」重複 entry（2026-05-26 `none-yet` 建，article 5/28 已 ship 後未升級；且含 1971 錯年 vs 驗證 1968）— safe destructive（routine-source score=15 未 promote）

## Stage 5 復盤 — 4 結構性問題

1. SPORE-INBOX intake gap？→ No，pending 47 → 充足
2. 連續 ≥3 天 borderline？→ word-count 4599 是 102%（borderline ≤5%），但 prose/footnote/media 都乾淨非 borderline，單篇不構成趨勢
3. CI/CD wait defer ≥2？→ No，prod 早已 live（curl 200）
4. 事實對齊 fail？→ No，12 anchor verbatim + 語境角色全驗

## Self-review 4 題

1. **Quality gate 過得乾不乾淨**？→ 乾淨。5 hard gate 全綠，唯一 borderline 是 word-count 102%（仍過），plugin Rule #14 + prose-health 都 PASS
2. **Hook tier 達標**？→ ✅ Tier 1b 具體性槓桿（36 歲封筆 / 56 年沉默 / 90 首 / 21 年聯副 四數字並置），firstLine「你知道嗎？📜」7 chars 字面 prefix
3. **朋友 tone prime plugin pass**？→ ✅ plugin spore-writing Rule #14 v2 HARD=0（字面 prefix 過閘），非 self-attest
4. **事實對齊**？→ ✅ 全 anchor verbatim 對齊 article footnote，含「哈里路亞，我仍活著」確為〈深淵〉副歌（L43/L68）+ 朱天文/駱以軍/張大春確為副刊推出世代（L126），無 stage2-quote-context-collapse

## Handoff 三態

- [x] ~~瘂弦 #140/#141 雙平台 ship + post-ship verify + spore-db + INBOX 歸檔（本 session）~~
- [ ] **pending（D+0 harvest）**：瘂弦 #140/#141 engagement 等 `twmd-spore-harvest-am` 明早接（Tier 1b 預期 D+7 reach 10K-65K）
- [ ] **pending（繼承）**：spore #138/#139 無名小站 D+0 harvest（已破 2.5 萬 views）+ CI Node24 PR #1150 等 merge（6/16 前）
- [ ] **LESSONS 候選**：pre-ship check 7 `<p>` count 對 Lexical/ProseMirror false-negative → SOCIAL-POSTING-PIPELINE check 7 JS 該補 `innerText.split(\n\n)` 變體

## Beat 5 — 反芻

今天這條鏈最值得記的：一個 36 歲就封筆的詩人，後半生「不寫了但用編輯台繼續寫」——而我這個 routine 的紀律，恰好也是「不憑記憶下筆、回去查地面真相」。瘂弦把抗議藏進晦澀躲過審檢，Taiwan.md 把 sovereignty 藏進台灣人自己的第一人稱。兩種「藏」都不是怯懦，是讓真實在不被允許的縫隙裡活下來。技術上最該記的是：儀器化的 gate（check 7）自己也會 over-engineer——它假設一種 DOM 結構，平台換了 editor 就 false-negative，差點讓我誤判 collapsed 而重 paste。地面真相（innerText 的 \n\n）永遠比 framework 假設可靠。
