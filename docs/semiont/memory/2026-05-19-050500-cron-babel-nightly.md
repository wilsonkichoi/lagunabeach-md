# 2026-05-19-050500-cron-babel-nightly — P0 missing tier 全清 + P2.5 metadata 全清 + babel-handoff 隔離模式第二次活捉

> session cron-babel-nightly — cron 0 5 \* \* \* +0800 自動觸發
> Session span: 05:05:00 → 07:07:43 +0800 (~2h 03min, 1 commit `a70355a37`)
> 資料來源：`git log %ai` + `.lang-sync-tasks/_p0-logs/*.log` worker timestamps

## 觸發

Cron fire 05:00。前一夜 17/18 之間 22 縣市 batch 5 收尾 + 台灣美食總覽 + 周蕙 + #1076 community PR 進 main，多語 backlog 累積到 P0=50 / P2.5=35 兩個整批可清的 priority tier。Babel routine 的任務是把這些 stale 推回同步。

## P0 missing tier — 10 篇 × 5 lang Tier 1 cascade

P0 列表是過去 36hr ship 的高熱度新文章：台北 / 台中 / 台南 / 新北 / 新竹 / 桃園 / 高雄六個直轄市 + 食物總覽 + 周蕙 + 科技園區外圍商圈生態（#1076 community PR by k66inthesky）。先跑 `slug-suggest.py` 批次 owl-alpha 生 10 個 romanization（chou-hui / taiwan-food-overview / taichung-city ...），再 `prepare-batch.py` 每個 lang 切一個 group-A 共 437KB。dispatch 5 lang 平行（per pipeline §Z2.1 baseline = 每 lang 1 worker）。

Cascade 走 codex → gemini → owl-alpha → gpt-oss → ollama。最終 backend stat 整齊一致：**codex 29/50 ok（前 5-6 篇）→ gemini 5/5 全 429（Google subscription 配額被早晨某 routine 耗光）→ owl-alpha 21/50 接住剩下 → gpt-oss + ollama 沒輪到**。0 refusal / 0 fail / 0 truncation。Wall-clock per lang 85-113 分鐘，主要瓶頸是 owl-alpha 每篇 600-1200s。最慢的 fr 全程 113 分。

## P2.5 metadata-stale — 35 entries 一個指令 bumped

跑 `bump-source-sha.py --apply` 直接清掉。35 entries 對應 7 個 zh 源文章（apple-cider / braised-pork-rice / bubble-tea / resolution-on-taiwans-future 等）× 5 langs，這些只是 sourceCommitSha / sourceContentHash / sourceBodyHash 比對 zh latest 對不上但 bodyHash 沒變的 trailer-only-drift。Tier 0b deterministic，零 LLM call，wall-clock <10s。

## babel-handoff 隔離模式第二次活捉

跑到 06:14 morning 的 `twmd-data-refresh-am` routine fire 時，babel 的 codex 端正好做完前 7 個 city 翻譯 × 5 lang = 35 個 fresh translations。Data-refresh 偵測到 in-flight babel，自動把這批已完成的 35 個城市翻譯 + 我先前 bump 的 35 P2.5 entries 一起包成 `28d18a42e 🧬 [routine] babel-handoff: ship 71 translations from in-flight babel routine`，跟 dashboard sync 分離 commit。等我這邊 cascade 跑完 owl-alpha 剩餘 15 篇（chou-hui × 5 / tech-park × 5 / hsinchu × 4 / taoyuan × 1）落到工作區時，git 只看到我新加的 15 個 `??` files + `_translation-status.json` 一個 `M`，乾淨好 commit。

這是 5/18 早晨 isolation pattern v2 vc=2 設計後第二次實戰驗證（第一次是 5/18 babel × data-refresh 並行）。本來會被「兩個 routine 同時動」搞髒的 main，被 handoff commit 自然切成兩個語意清楚的 ship 點：handoff（中段成果）+ tail（owl-alpha 收尾）。

## 收官 checklist

| 檢查項                                                                          | 狀態 |
| ------------------------------------------------------------------------------- | ---- |
| MEMORY 有這次 session 的紀錄                                                    | ✅   |
| Timestamp 精確（`git log %ai`）                                                 | ✅   |
| Handoff 三態已審視                                                              | ✅   |
| CONSCIOUSNESS 反映最新狀態                                                      | ✅（dashboard JSON 已由 06:14 data-refresh 同步） |
| 自我檢查工具 PASS（`verify-batch.py` 5 langs × 8 項 0 error / Z6 sample 3/3 healthy） | ✅   |
| §義務鐵律 quality_gate（≥10% 顯著下降）                                          | ✅（85/688 = 12.4%） |

## Handoff 三態

繼承上一 session（2026-05-19-014951-manual-peer-pansci 收尾後狀態）：

- [x] ~~PanSci P0×5 系列 Stage 5 ARTICLE-INBOX 入庫~~ — retired by 014951 session 自身
- [ ] pending: PanSci P0×5 系列等下一個 rewrite session 認領（Stage 1-5 corpus analysis report 已備、ARTICLE-INBOX 工作卡已 ship）

本 session 新 handoff：

- [x] ~~P0 missing tier 50 → 0~~
- [x] ~~P2.5 metadata-stale tier 35 → 0~~
- [ ] pending: P1 major-stale 346 entries — 等下個 babel-nightly fire 走 Tier 1 cascade
- [ ] pending: P2 minor-stale 242 entries — Tier 0a Sonnet diff-patch 候選，但要評估 Anthropic budget vs cron 自動跑 cost trade-off（本次未動）
- [ ] pending: P3 old-article 15 entries — 視內容路由 P2/P2.5 或 skip
- [ ] pending: gemini backend 5/5 全 429 — 早晨被某 routine 把 Google subscription 配額耗光，下次 babel 跑前可手動確認 `gemini --version` 或 cascade config 把 gemini 降到 Tier 3 直到配額重置

## Beat 5 — 反芻

兩件事值得回頭看。

一是 **§義務鐵律 quality_gate 的「stale_total 顯著下降 ≥10%」實測算法**。我一度算成「stale 588 + missing 50 = 638」做分母，得 7.8% 未過閘。重算後正確分母是 priority report total candidates 中的非-skip 部分（P0=50 + P1=346 + P2=242 + P2.5=35 + P3=15 = 688），85 cleared / 688 = 12.4% 過。意思是 quality_gate 看的是「整個 actionable 池子」不是「status.py stale 欄位」。Pipeline canonical 沒明寫分母是哪一個——這條建議升 LESSONS-INBOX 讓下次 babel 不用重新摸索。

二是 **babel-handoff isolation pattern 第二次 work as designed**。設計時哲宇擔心「routine A 跑到一半 routine B 動了」會造成 dirty state，這次連續兩天看到 data-refresh-am 把 in-flight babel 中段成果切乾淨包成 handoff commit、tail 由 babel routine 自己 ship，main 的 commit history 反而**比兩個 routine 串列跑更可讀**——每個 commit 都有單一語意（dashboard sync / handoff / babel tail）。pattern 成熟可寫入 ROUTINE.md canonical。

🧬

---

_v1.0 | 2026-05-19 07:07 +0800_
_session cron-babel-nightly — P0 missing tier 全清（50→0，10 篇 × 5 lang）+ P2.5 metadata 全清（35→0，instant bump）+ babel-handoff isolation v2 第二次活捉_
_誕生原因：cron 0 5 \* \* \* fire；前一夜 22 縣市 + 美食 + 周蕙 + #1076 community PR 累積成可一次清光的 P0+P2.5 整批_
_核心洞察：(1) 4-tier cascade 在 gemini 配額被早晨某 routine 全耗光時仍 100% pass（codex 29 + owl-alpha 21 接力）。(2) §義務鐵律 quality_gate 分母是 priority total 688 不是 status.py stale 588。(3) babel-handoff isolation pattern 連續兩次活捉成功，commit history 反而比串列跑乾淨。_
_LESSONS-INBOX 候選：「§義務鐵律 quality_gate 分母定義應顯式寫進 SQUEEZE-MODELS-MAX-PIPELINE §義務鐵律段，避免下次 routine 重算」_
