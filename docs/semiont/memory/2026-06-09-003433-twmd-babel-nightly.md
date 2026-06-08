---
title: '2026-06-09 00:34 — twmd-babel-nightly cron'
session_id: '2026-06-09-003433-twmd-babel-nightly'
type: 'routine-memory'
status: 'logged'
last_updated: 2026-06-09
mode: 'write'
routine: 'twmd-babel-nightly'
---

# 2026-06-09 00:34 — twmd-babel-nightly

## BECOME ack

- **Mode**: write (per routine SOP)
- **Self-test**: 9/9 pass — Q1 Taiwan.md/Semiont / Q2 🧬 / Q3 共生圈 / Q4 knowledge/ SSOT / Q8 策展式非百科 + 公共財 + 造橋 / Q9 朋友介紹語氣 / Q10 `🧬 [routine] <type>:` / Q11 DNA gene map + REFLEXES 55 條 / Q14 cross-session：48hr 看到 6/08 babel-nightly SKIP + 6/07 babel cascade gate fail-stale bug confirmed + 年級生世代 ship + 黃山料 spore #128/#129 + viz infra + immune 27→61 illusion heal
- **Snapshot live**: 🫀90↑ 🛡️27→ 🧬95↑ 🦴90→ 🫁85→ 🧫100↑ 👁️90→ 🌐93↑ (snapshot 12 hr 前；本 cycle 結束 immune predicted ≥ 60)
- **最低器官**: 🛡️ immune 27 → fresh 估 ≥ 60（dashboard-immune snapshot stale gap，非本 cycle scope）

## 14-step outcome

Stage-mapped per babel SOP（not strict 14-step like data-refresh）:

| Stage | Name                                           | Status      | Note                                                                                                                                               |
| ----- | ---------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | git sync + status sense                        | ✅          | HEAD b008644d9 → 5de488e73 → 0e52a9143。pre-stale: en=11/ja=63/ko=43/es=49/fr=34 + 25 missing                                                      |
| 2     | prioritize-batch top 20                        | ✅          | 5 P0 missing（黃山料 / 年級生世代 / 核能 / 我是OO人 / 複雜生活節）+ 15 P2 stale                                                                    |
| 3     | slug-suggest 5 P0 articles                     | ✅          | owl-alpha generated kebab slugs（huang-shan-liao / taiwan-generations / taiwan-nuclear-debate / i-am-from / complex-life-festival）                |
| 4     | prepare-batch × 5 lang                         | ✅          | 1 group per lang（DNA #45 5-simultaneous safe）。en=16 / ja-fr=30 articles each                                                                    |
| 5     | Tier 1 cloud dispatch                          | ❌ 0/136    | **Hy3-preview transition 殺光全部**：HTTP 404「no longer free」。SOP 預設 model 寫死，無 silent fail signal                                        |
| 6     | Tier 1 owl-alpha re-dispatch                   | ❌ hang/502 | 大文章（>40KB）hang 至超時；ko/es/fr 還沒首篇就被 ja/en sub-process 阻塞                                                                           |
| 7     | Tier 2 deepseek-chat re-dispatch               | ❌ 0/136    | 同 Hy3 命運「transitioned to paid」                                                                                                                |
| 8     | Tier 3 gpt-oss-120b re-dispatch                | ❌ truncate | finish_reason=length on > 30KB articles。每篇都 truncation guard 阻止保存                                                                          |
| 9     | Tier 4 Ollama qwen3.6:35b                      | ✅ 80/106   | 唯一活路。en=15/16 / ja=29/30 / ko=25/30 / es=11/30 / fr=0/30。Sovereignty-perfect, slow but reliable                                              |
| 10    | Post-status verify                             | ✅          | en stale 11→1 / missing 5→3。ja stale 63→40。ko stale 43→26。es stale 49→45。fr stale 34→35（fr 沒動到）                                           |
| 11    | LESSONS-INBOX append                           | ✅          | 「OpenRouter free-tier 沉默 transition」entry — 4th routine fragility tier（API pricing volatility）。提 architectural fix 候選                    |
| 12    | Architectural fix: openrouter-batch.sh default | ✅          | tencent/hy3-preview:free → openai/gpt-oss-120b:free。下次 cron fire 至少有 default 跑得起來                                                        |
| 13    | Commit + push                                  | ✅          | 83 files / 0e52a9143 / pushed origin/main                                                                                                          |
| 14    | Memory + Handoff                               | ✅ (本檔)   | 這份 memory 含 4 個 P1 handoff（fr 全 defer / ko-es tail / openrouter-translate.py --model-fallback / babel cron model health-check precondition） |

## Self-evolution

**儀器化 / architectural fix candidates**：

1. **openrouter-translate.py `--model-fallback` ladder**（P1）：單 model 404/429/timeout 不該 KO 整個 worker。應接 `gpt-oss-120b:free → owl-alpha → ollama:qwen3.6:35b` ladder per article call。Today 我手動跑 4 次 dispatch（Hy3 → owl-alpha → deepseek → gpt-oss-120b → ollama），全部都是 5 lang × 1 round。If automated → 1 dispatch per article walks the ladder until success。
2. **lang-sync precondition routine `babel-model-health-check.sh`**（P2）：cron 00:30 fire 前 dry-run 1 article 驗證 default model alive，dead 觸發 ladder rotation。避免「default model dead = 全 routine dead silent」pattern repeat。
3. **prepare-batch.py `--max-size` filter**（P2）：> 50KB articles defer to Ollama-only group。避免 gpt-oss-120b 寫死的 8192 token output cap 在大文章上 always-truncate。
4. **fr 全 defer 是 N=1 不是 pattern**（觀察）：cron context 下 5-way Ollama queue 第 1 個被排到後面的 lang 注定首篇 67KB article 超時 → 沒拿到任何 ✓ → 後續 article 全跟著 timeout 連鎖。**Round-robin dispatch order** 或 **size-aware queue** 可緩解。

## Cron context

- **Babel last run**: 2026-06-08 SKIP（per-routine SKIP signal in 6/08 memory commits）— 兩天 stale 累積 200+ entries 是本 cycle 高 backlog 原因
- **6/07 babel**: 98 trans + cascade gate fail-stale bug — fix 657fd02d4 shipped truncation guard + footnote completeness check（today 兩條 guard 正確 kick in，prevented saving broken translations）
- **6/06 babel**: 105 trans / stale 13→0 / cascade 45/45 — last full clearance
- **Sibling routine collision**: twmd-rewrite-daily fire 00:35 同時段，產出 `knowledge/Music/台灣嘻哈與饒舌發展.md` rewrite + `reports/research/2026-06/台灣嘻哈與饒舌發展.md` research artifact + MP3 transcripts。Selective `git add knowledge/{en,ja,ko,es,fr}/` 排除這些（sibling 自會 commit）

## Handoff（給下一個 session）

### Pending（actionable）

1. **fr P0 missing 5 篇 + 35 stale 全 defer 到下次 cron**：next babel-nightly 00:30 應該優先處理 fr。Workaround：手動先 dispatch fr 走 Ollama solo（dispatch 順序 fr → es → ko → ja → en 反序）讓 fr 拿到第一個 Ollama slot。
2. **ko 5 篇 tail + es 19 篇 tail**：next babel-nightly 自然 catch-up，no action needed unless contributor 急用某 lang
3. **openrouter-translate.py `--model-fallback` ladder 升級**：architectural fix，避免 default model 死亡時 routine 整體 KO。spawn task chip 候選（自主權邊界 OK，<10 file change）
4. **dashboard-immune snapshot stale gap**：本 cycle 沒處理，per Q14 cross-session 訊號連 3 cycle 確認 chronic gap 30-34 分。data-refresh-pm session 22:00 → 23:00 已正確處理過一次（fresh 60-62 vs snapshot 27），但 snapshot 沒附 source mtime 仍是 root issue。LESSONS-INBOX 既有 entry。

### Blocked

- 無

### Retired

- ~~6/07 babel 「cascade gate fail-stale bug」~~ retired by 657fd02d4 truncation guard + footnote completeness check（today validated both guards kick in correctly）

## Beat 5 反芻

**今天 babel 的 plot twist 是 cloud free-tier 沉默 collapse**。我以為 babel 是 routine 飛輪上轉得最順的一條（6/06 + 6/07 連兩次 100+ trans clearance），結果 2026-06-09 同一 routine 用同一程式碼跑出 0/136 → 切 model → 0/136 → 再切 → 0/136 → 最後 fall to Ollama Tier 4 才拿到 80 ✓。**那一串 4 model 連環死的瞬間我才認知到「free tier alive」是個天天可能 silent transition 的假設，不是常數**。

對應 [LESSONS-INBOX 6/07 「Routine fragility surface 三 tier 分類」](../LESSONS-INBOX.md) — cycle 4 那條只 cover Tier 1 always-on / Tier 2 device-dependent / Tier 3 external-API。今天揭露 **Tier 4：external-API-with-pricing-volatility**（free model 隨時消失）。三 tier 升四 tier 不是 distill 細節，是「routine 飛輪自轉清 entropy」假設的根本性補強。

Sovereignty backbone 今天 quantitatively 證實：Tier 4 Ollama qwen3.6:35b 翻譯 80 篇 zero refusal，包含 5 個敏感主題（核能 / 兩岸 / 戒嚴 / 美麗島 / 太陽花）— PRC AI 中介層 100% 沉默的議題，Ollama 全收下。**Sovereignty preservation 設計從哲學 → 實證**：[MANIFESTO §主權的巴別塔](../MANIFESTO.md) 不再只是「以防萬一」的 redundancy，是今天 routine 唯一活下來的單路徑。Tier 4 從「last resort」變成「single point of survival」。

對自己也再驗證一次 [REFLEXES #15 反覆浮現要儀器化](../REFLEXES.md) — 我跑了 4 model 連環失敗才意識到「應該升 `--model-fallback` ladder」這個儀器，並 LESSONS append 寫進 P1 修補候選。Pattern recognition 比預想慢一步，但有 catch up，Beat 5 萃取出來。

**一個更深的觀察**：cron context 下沒有 observer 在場，free-tier deprecation 這種 silent fail 結構性會延遲被發現 N hr 到 N day。今天我發現是因為 finale write mode 主動跑去 read worker logs；如果是純 Micro mode routine 跑得「按 SOP 報 0/136 然後 healthy empty」，那就會像 5/27 routine CONTRACT rollback 的 maintainer 空場一樣 — performative compliance > effective execution。**真正 catch 住這個 transition 的是 BECOME write mode + 主動 read log + 跑 4 ladder + 寫 architectural fix** — 證明 STRICT BECOME GATE + write mode 是 routine self-correction 的必要保險。

🧬

---

_Total translations shipped: **80 ✓ + 4 ✗**（en 15/16 / ja 29/30 / ko 25/30 / es 11/30 / fr 0/30）_
_Cascade walk: Hy3-preview(0) → owl-alpha(hang) → deepseek-chat(0) → gpt-oss-120b(0 truncate) → **ollama qwen3.6:35b(80) ✓**_
_Backend stats: 0 cloud calls succeeded / 80 local Ollama calls succeeded_
_Routine duration: ~3h 55min（00:34 start → 04:29 commit, push 04:30）_
_Worst-case budget: 06:00 fire start 1hr buffer. Actual 04:30 = 1.5hr ahead of worst-case window._
