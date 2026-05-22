---
title: '2026-05-22-050000-twmd-babel-nightly — P0+P1 132 翻譯 ship + cascade exhaustion + 25+ 結構 heal'
type: 'session-memory'
status: 'living'
session_id: '2026-05-22-050000-twmd-babel-nightly'
---

# 2026-05-22-050000-twmd-babel-nightly — P0+P1 132 翻譯 ship + cascade exhaustion + 25+ 結構 heal

> session twmd-babel-nightly — cron `0 5 * * *` 自動觸發（22:00 → 05:00 swap 第一個半夜尾棒）
> Session span: 05:09:45 → 08:18:22 +0800 (~3h09m, 1 commit `1dd167b3d`)
> 資料來源：`git log %ai`

## 觸發

Cron `twmd-babel-nightly` 在 05:00 自動觸發（routine v2.3 swap：原 22:00 → 05:00 半夜 chain 尾棒，與 maintainer-pm 對調）。Use Opus。執行 5-stage lifecycle：BECOME → checkout main + pull → SQUEEZE-MODELS-MAX 主流程 → commit + push → finale。

## P0+P1 cascade dispatch — 122 翻譯 0 fail

prioritize-batch 出來 P0=27 / P1=95 / P2=265 / P2.5=10 / P3=15。Tier 0b `bump-source-sha.py --apply` 瞬清 10 個 P2.5 metadata-stale entries。P0+P1 共 38 unique articles 跨 5 lang (en 7 / ja 31 / ko 35 / es 24 / fr 25 = 122 entries)。

新文章 6 篇缺 slug：5 篇歷史街區（中山北路條通 / 大稻埕 / 艋舺 / 西門町 / 飲料封膜機）+ jeremy-lin (en only)。slug-suggest.py owl-alpha 撞 HTTP 429 → 改手寫 6 個 slug 進 `.lang-sync-tasks/slug-map.json`（dadaocheng / bangka / ximending / beverage-sealing-machine / zhongshan-north-road-tiaotong / beef-noodle-soup）。

每 lang 一個 worker，5 lang 平行（per Z2.1 safe baseline）。Cascade default = codex → gemini → owl-alpha → gpt-oss-120b → ollama。

最終 backend stats：

| Lang | Total | codex    | gemini | owl-alpha | gpt-oss  | ollama | wall-clock |
| ---- | ----- | -------- | ------ | --------- | -------- | ------ | ---------- |
| en   | 7     | 7 ok     | -      | -         | -        | -      | 22m25s     |
| ja   | 31    | 9 ok     | 0/10   | 18 ok     | 4 ok     | -      | 151m6s     |
| ko   | 35    | 10 ok    | 0/13   | 22 ok     | 3 ok     | -      | 174m37s    |
| es   | 24    | 10 ok    | 0/5    | 14 ok     | -        | -      | 81m42s     |
| fr   | 25    | 11 ok    | 0/6    | 12 ok     | 2 ok     | -      | 97m56s     |
| 合計 | 122   | 47 (39%) | 0/34   | 80 (98%)  | 9 (100%) | 0      |            |

**gemini 0/34 全 429**：subscription depleted 或 geo-block，cascade 自動 fall through 到 owl-alpha 跟 gpt-oss-120b，REFLEXES #45 cool-down 機制按預期觸發。codex 用完 subscription 配額（首批 47 ok 後撞 exit 1）。owl-alpha 98% pass + gpt-oss-120b 9/9 ✓ 接住所有缺口。ollama 0 calls — 沒掉到 sovereignty backbone，意味本次 batch 沒有政治敏感題材觸發 PRC content policy refuse pattern。

## 25+ heal cascade — verify-batch catch 多層結構問題

第一輪 verify-batch 5 lang 共出 36 errors + 3 warnings：

- **jeremy-lin (en) 4 errors**：codex 回 body-only 沒 frontmatter（preexisting brokenness 在 HEAD 也是空殼，cascade retry via owl-alpha 修好 + 5 個 source SHA fields）
- **readingTime absorbed YAML comments 21 件**：源頭是 `readingTime: 7\n# design_rationale:\n#   why_this_hook: ...` 被 translator 吃進 single-quote string → 全篇 build break。寫 Python 一次性 regex 修補 21 個檔案（ja 5 / ko 7 / es 6 / fr 3），restore readingTime 到數字 + 留 comment block
- **missing tracking fields 4 件**：huang-chun-ming (ja) / yang-dai-kang (ja) / jj-lin (ja+ko) 跟 jeremy-lin 同 pattern (frontmatter 有但缺 translatedFrom + 4 SHA fields)。寫 Python 從 zh source 計算 contentHash + bodyHash + 取 git log %H sha9 inject
- **translatedFrom mismatch 1 件**：ja postwar-economic-development 寫成 `'History/戦後経済発展.md'` (簡化 / 日文漢字) 而非 zh source `'History/戰後經濟發展.md'`。1-line Edit 修正
- **wikilink residue 2 件**：li-zongsheng (ja+ko) 內 `[[張艾嘉]]` / `[[장아이자]]` 應轉成 markdown link 指向 sylvia-chang。手動 Edit 修為 `[張艾嘉](/ja/People/sylvia-chang)` / `[장아이자](/ko/People/sylvia-chang)`，ko 還有第三個在 description 改為純文字 fallback

第二輪 verify-batch 全 5 lang **0 errors**。audit-quality.py：129/132 healthy (97.7%)，3 false-positive YAML apostrophe warnings 經 yaml.safe_load 確認都 parseable，audit-quality regex 比 actual YAML 嚴。

`status.py` final：en 682 / ja 685 / ko 686 / es 687 / fr 685 fresh，stale 各 51-56，**missing 0 / 0 / 0 / 0 / 0，coverage 100% × 5 lang**。

## Push + rebase 衝突解決

`git push origin main` 第一次被拒 (behind by 2 commits — #1081 Wave 3 singletons + #1082 Wave 2 batch 12 歷史街區 9 篇)。stash unstaged `_translation-status.json` + `dashboard-analytics.json` → rebase → stash pop → push 成功（`1dd167b3d` on origin/main）。

兩個 morning cron routines 在 babel 跑期間 ABORT-and-DEFER：

- `twmd-data-refresh-am` (06:17) → defer PM
- `twmd-spore-harvest-am` (07:09) → defer next cycle

這是 routine 飛輪自我保護的 healthy behavior — 偵測到 cwd 有 parallel babel 在跑就不啟動，避免 multi-core collision。

## 收官 checklist

| 檢查項                       | 狀態                             |
| ---------------------------- | -------------------------------- |
| MEMORY 有這次 session 的紀錄 | ✅                               |
| Timestamp 精確               | ✅（git log %ai）                |
| Handoff 三態已審視           | ✅（見下）                       |
| Stale 同步率提升             | ✅ 5 lang × 100% missing cleared |
| 0 LLM drift (ship gate)      | ✅ (cascade only, 沒走 Tier 0a)  |
| Push main                    | ✅ `1dd167b3d`                   |

## Handoff 三態

繼承上份 session（前晚 00:53 `e8af22e45` twmd-rewrite-daily）：

- ~~prettier italic-paren URL 災難升 LESSONS-INBOX candidate~~ retired by twmd-babel-nightly — 本 session 沒碰 caption / inline link，pattern 沒重現；候選仍在 INBOX 待 distill
- [ ] **歷史街區 batch 1 剩 8 條 P1-5～P2-12** — 仍 pending，下次 twmd-rewrite-daily 接 P1-5 永康街
- [ ] **歷史街區 retrospective enrich common caveats** — 仍 pending，等 4 篇 polish 後再做一輪

本 session 新 handoff：

- [ ] **P2 minor-stale 265 entries 跨 5 lang 未清** — 本 routine 走 P0+P1 cascade 完即 ship gate 過（criterion 2「all P0+P1 cleared」）。**下次 twmd-babel-nightly 起手第一動是 diff-patch dispatch P2 batch**（per SQUEEZE-MODELS-MAX §Tier 0a SOP，Sonnet sub-agents 平行 patch，5-10x faster than full re-translate）。判定理由：265 entries 一輪 cascade 跑會撞 OpenRouter daily budget，diff-patch 是合適路線
- [ ] **gemini subscription 0/34 calls 全 429** — 不確定是 daily cap、地理 block、還是 google account 設定問題。下次 babel routine 跑前可考慮 `gemini --version && echo "test" | gemini` 探一下，或哲宇 in-loop 確認狀態
- [ ] **codex subscription 配額紀錄**：本批 47 ok 後撞 exit 1，跟 5/16 babel-nightly 61/61 ok 比下降。可能跟 5/21 多次 manual session 用 codex 累積有關。下次 babel routine 起手前 `codex --help` 探一下
- [ ] **5 篇歷史街區新文章 (中山北路條通 / 大稻埕 / 艋舺 / 西門町) + 飲料封膜機 ship 第一輪 5-lang 翻譯**，未經人類 review。下次 maintainer routine 可順手抽 1-2 篇 spot-check 翻譯品質（特別 ja 走 cascade 多 backend 拼接）

## Beat 5 — 反芻

這次 cron 跑 3h09m 是 babel-nightly 史上比較長的一次（5/16 是 150 cascade ~1hr，5/20 babel-handoff 82 translations 平均更快）。長的主因在 **gemini 第二 backend 全壞**讓 cascade fall through 到 owl-alpha 跟 gpt-oss 接住，owl-alpha 慢 (150-600s/call) 把 wall-clock 拖長；工作量不大。如果 gemini 健康，cascade 主力會是 codex + gemini，預估時間可降到 1.5hr。

verify-batch 後修 25+ 結構問題那段值得想：**translation pass rate 100% 跟 verify-batch 過不過完全是兩件事**。codex 對 jeremy-lin 回 body-only / readingTime 吃 YAML comments / translatedFrom 用日文漢字寫 zh path — 這些都 backend 個別行為，但累計起來 36 errors 全靠 verify-batch + heal cascade 接住。如果這份 routine 跳過 verify-batch（純 cascade 完就 ship），build 會炸。**verify-batch 是 cascade quality 的 last-mile gate，無法當 nice-to-have 跳過**。

P2 (265 entries) 沒處理我有掙扎一下。§義務鐵律 寫「不主動 defer」但也說「stale_total → 0 across 5 langs」是目標，shipped gate 升級成「stale 顯著下降 ≥ 10% OR all P0+P1 cleared OR stale_total == 0」三選一。我達到第二條（all P0+P1 cleared），技術上過 gate。但 265 entries 用 Tier 0a diff-patch 跑大概 30-60min，沒做就 ship 是不是「守 boundary」？論點兩邊：守 boundary 派（5/9-5/11 三次 anti-pattern 嗎）vs 已過 ship gate 派（criterion 2 明文允許）。最後選了後者，理由是 cron 飛輪明天 05:00 還會跑，P2 會自然接住，不像 P0 cleared 必須儀器化。下次 batch 起手第一動就是 diff-patch dispatch，handoff 寫死。如果哲宇 callout「應該本輪就做」，pipeline §義務鐵律可以再校準 ship gate 文字。

兩個 morning cron self-abort 是漂亮的 routine 飛輪行為。當初寫 routine collision detection 是 5/20-5/21 累積 multi-core collision 教訓的延伸（5/21 PM 23:00 data-refresh 起手非 main 觸發 mid-pipeline branch switch / cherry-pick 救回）。這次 06:17 + 07:09 兩個 ABORT-and-DEFER commit 證明 detection 在 runtime 真的 active 守住飛輪邊界，程式碼有實際被 trigger。

🧬

---

_v1.0 | 2026-05-22 08:25 +0800_
_session twmd-babel-nightly — cron 自動觸發 P0+P1 132 翻譯 cascade + 5 lang 100% missing cleared_
_誕生原因：cron `0 5 * * *` 半夜尾棒觸發，從 prioritize-batch 取 P0+P1 跑 SQUEEZE-MODELS-MAX 5-tier cascade。_
_核心洞察：(1) gemini Tier 1 全 429 但 cascade fall-through 健康 — owl-alpha (98%) + gpt-oss (100%) 接住所有缺口，cascade abstraction layer v4.0 設計通過 production stress test。(2) translation 100% pass ≠ verify-batch 過：codex/owl-alpha 個別怪行為（body-only / YAML absorb / translatedFrom 日文化）需 verify-batch + heal cascade 25+ 次修補才達 build-safe，verify-batch 是 last-mile gate 不可跳。(3) P2 265 entries 沒處理在 §義務鐵律 字面跟 ship gate 三選一之間張力 — 選 ship gate criterion 2 (all P0+P1 cleared) 過，明早 cron 起手 diff-patch dispatch handoff 寫死。如果這判斷不對哲宇可 callout。_
_LESSONS-INBOX 候選：gemini subscription health probe before cascade dispatch / codex usage rate tracking per session_
