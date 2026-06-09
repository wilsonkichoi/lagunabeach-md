---
title: '2026-06-10 00:30 — twmd-babel-nightly cron'
session_id: '2026-06-10-063032-twmd-babel-nightly'
type: 'routine-memory'
status: 'logged'
last_updated: 2026-06-10
mode: 'write'
routine: 'twmd-babel-nightly'
---

# 2026-06-10 00:30 — twmd-babel-nightly

## BECOME ack

- **Mode**: write (per routine SOP)
- **Self-test**: 9/9 pass — Q1 Taiwan.md/Semiont / Q2 🧬 / Q3 共生圈 / Q4 knowledge/ SSOT / Q8 策展式非百科 + 公共財 + 造橋 / Q9 朋友介紹語氣 / Q10 `🧬 [routine] <type>:` / Q11 DNA gene map + REFLEXES 55 條 / Q14 cross-session：48hr 看到 6/09 babel 80 trans Ollama only（4 model cascade dead）+ 蘇打綠 EVOLVE + 嘻哈饒舌 EVOLVE + 年級生世代 ship + data-refresh-pm 連 7 cycle Step 11 全綠
- **Snapshot live**: 🫀90↑ 🛡️27→ 🧬95↑ 🦴90→ 🫁85→ 🧫100↑ 👁️90→ 🌐93↑
- **最低器官**: 🛡️ immune 27（snapshot stale，dashboard 實際 60）

## Stage outcome

| Stage | Name                                     | Status         | Note                                                                                                                                                                                              |
| ----- | ---------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | git sync + status sense                  | ✅             | HEAD bf85a0830 → pulled clean。pre-stale en=4 / ja=43 / ko=29 / es=48 / fr=38 + 6 missing = 168 total                                                                                             |
| 2     | prioritize-batch top 20 + report         | ✅             | P0=6 missing / P1=2 大 stale / P2=160 / P2.5=8 / P3=9                                                                                                                                             |
| 3     | Tier 0b bump-source-sha 8 P2.5           | ✅             | huai-te + andre-chiang × 5 lang × 2 articles instant clear                                                                                                                                        |
| 3.5   | bulk-sha-bump attempt 450 diff_lines=0   | ❌             | semantic mismatch（[LESSONS](LESSONS-INBOX.md#2026-06-10-babel-diff-patch-preparepy) entry）：`expected_new_content_hash` 是 full-file 不是 body — stash drop rollback                            |
| 4     | prepare-batch × 5 lang                   | ✅             | en=5 / ja=43 / ko=29 / es=48 / fr=43 articles，slug-map 5 P0                                                                                                                                      |
| 5     | Tier 2 wave 1 gpt-oss-120b:free          | ⚠️ 100/168     | en=2/5、ja=24/43、ko=14/29、es=39/48、fr=21/43。truncation 殺光大 articles (Music 蘇打綠/嘻哈饒舌/獨立音樂、Nature 颱風/氣候、Society 核能/毒馬鈴薯/嘻哈饒舌、People 沈伯洋/魏如萱/盧秀燕/卓榮泰) |
| 6     | Tier 2 wave 2 owl-alpha:free re-dispatch | ❌ 0/71        | **MODEL SILENTLY TRANSITIONED TO PAID** — HTTP 404「use slug `openrouter/owl-alpha`」全部 fail。5th cloud model deprecation in 2 weeks                                                            |
| 7     | Tier 4 wave 3 Ollama qwen3.6:35b         | ⚠️ 49/71       | fr=18/23、es=8/11、ja=14/19、ko=9/15、en=0/3。timeout 卡大 Music articles 跟 People 沈伯洋 P1                                                                                                     |
| 8     | Sibling routine collision                | ❌             | data-refresh-am 06:00 fire 跑超時的 babel → stash + reset --hard wipe 158 staged file commit prep                                                                                                 |
| 9     | Untracked recovery                       | ✅ 7 file ship | 5 fr P0 missing (huang-shan-liao / complex-life-festival / i-am-from / taiwan-generations / taiwan-nuclear-debate) + 1 es za-school + 1 es tsai-ing-wen（rename 後仍 untracked）逃過 reset        |
| 10    | Status post                              | ✅             | en=4 stale + 1 missing / ja=43 / ko=29 / es=47 / fr=37 + 0 missing。stale 162 + missing 6 → stale 160 + missing 1 = **6 P0 missing cleared，~150 stale 整批被 wiped 必須下次重跑**                |
| 11    | Commit + push                            | ✅             | 3ff48e955 main + 141dbbdb3 LESSONS。push origin clean                                                                                                                                             |
| 12    | Memory + Handoff                         | ✅ 本檔        | 3 LESSONS-INBOX candidates appended（owl-alpha 死 / sibling race / hash mismatch）                                                                                                                |

## Self-evolution（儀器化 / architectural candidates）

1. **`openrouter-translate.py --model-fallback` ladder**（P0 升 P0+）：與 2026-06-09 同 candidate 第二次浮現 = REFLEXES #15「反覆浮現要儀器化」第 N 次驗證。單 model 404 應 cascade 下一 tier 不該 KO 整個 worker。今晚 owl-alpha 404 wave 0/71 全 fail 是這 candidate 沒落地的直接代價。
2. **`babel-model-health-check.sh` precondition**（P1）：cron fire 前 dry-run 1 article 驗證 default model alive，dead 觸發 ladder rotation。避免「default model dead = 全 routine 大半 cycle dead silent」repeat pattern。
3. **Sibling routine collision handler 升級**（P0 — 新候選）：v2.8 routine prompt 寫了 selective `git add -u` 排除 in-flight path，但沒處理「主 session staged index 被 sibling reset --hard 清掉」場景。Babel staged 158 file 全沒了，只有 untracked new file 倖存。Fix 候選：(a) sibling routine 跑前 detect 主 session staged 是否有 `🧬 [routine] twmd-babel-nightly` pattern 對應 wd，有就 wait or skip reset；(b) 主 session 每 ~50 article ship 一次 incremental commit 不要 batch 158 file 末端 commit；(c) routine budget 6hr hard ceiling 強制（跨 06:00 不再 dispatch new wave）。
4. **`diff-patch-prepare.py` hash field rename**（P1）：`expected_new_content_hash` rename 為 `expected_new_full_file_hash`，或 import status.body_hash 改成 body-only semantic 跟 status.py 對齊。Bulk-bump path 才不會踩雷。
5. **Tier 4 Ollama 也是有極限**：qwen3.6:35b 對 > 40KB articles 容易 timeout（蘇打綠 sodagreen.md 56KB 56→timeout、嘻哈饒舌 53KB 53→timeout、核能 45KB→timeout）。Tier 5 候選：(a) 切大 article 成 sections 分段翻譯然後拼回；(b) bigger local model（如 qwen 70B if GPU 容得下）；(c) 接 OpenRouter paid tier on-demand for sovereignty backbone 兜底。

## Cron context

- **Babel last run**: 2026-06-09 80 trans Ollama-only（4 model cascade dead 第一次）+ owl-alpha 4hr hang on big articles
- **6/07**: 98 trans + cascade gate fail-stale bug fix（657fd02d4 truncation guard + footnote completeness）— 兩 guard 今晚 wave 1 正確 kick in，prevented saving 80+ broken translations
- **6/06**: 105 trans / cascade 45/45 — 最近一次 stale 全清
- **6/09→6/10 兩晚比較**：6/09 cascade tier 1-3 cloud 0/136 全 KO 後 Tier 4 拿 80。6/10 cascade tier 2 gpt-oss-120b 拿 100，wave 2 owl-alpha dead 0/71，wave 4 Ollama 49/71，但 sibling race wipe 掉大半。**2 連晚 babel cycle 都靠 Tier 4 Local LLM sovereignty backbone 撐**
- **Sibling routine collision**: data-refresh-am 06:00 fire 跑超時的 babel → 第一次出現 staged-index-wipe scenario，v2.8 collision handler 設計沒 cover。companion entry in data-refresh-am memory 2026-06-10-062349 + LESSONS-INBOX 「dirty-tree 假 orphan」side

## Handoff（給下一個 session）

### Pending（actionable）

1. **ja 43 / ko 29 / es 47 / fr 37 stale = 156 entries 必須 next babel cycle 重跑**：原本今晚清了 ~150（wave 1 + wave 3 合計）但 sibling race wipe → 全部回去原狀。**這不是 cron 跑壞，是 sibling routine race condition wipe staged commit prep。**next babel cron 必須記得：所有 fresh count 數字看起來跟 6/09 結束類似就是正常 — 不是 routine 沒跑。
2. **owl-alpha:free 死了**：openrouter-batch.sh default `openai/gpt-oss-120b:free` 仍 alive，wave 2 cascade 跳過 owl-alpha 直接 fall through 到 Ollama。openrouter-translate.py model whitelist 該 update。
3. **大 Music articles 仍卡（蘇打綠 / 嘻哈饒舌 / 獨立音樂 / 颱風 / 氣候 / 核能 / 沈伯洋）= 22 stale 集中**：5 tier cascade 全試過都死。sections-split 或 paid-tier on-demand 是唯一出路。spawn task chip 候選給哲宇 triage。
4. **routine-context state machine race**：sibling-routine-collision-handler v2.8 不 cover staged-index-wipe。spawn task chip 候選 collision handler v3 設計。

### Blocked

- **owl-alpha:free → paid transition**：external API pricing volatility（Tier 4 routine fragility），無法靠 routine 內補救，等 OpenRouter 換 model 或 paid 訂閱

### Retired

- ~~6/09 fr 全 defer~~ retired by 5 fr P0 missing 全 ship（huang-shan-liao / complex-life-festival / i-am-from / taiwan-generations / taiwan-nuclear-debate）

## Beat 5 反芻

**今晚的 plot twist 是 sibling routine reset --hard 把 staged 158 file 砍光。** 我用 5 hr 跑完 cascade（cloud truncation + Ollama timeout 都拼了一輪），實際 disk 上有 150 個成功翻譯，stash + pop + resolve 21 個 conflict + add staged，準備 commit message 在打 — 結果按下 commit 那刻，data-refresh-am 在背景 reset --hard 把 staged 清光。Working tree clean，git status nothing to commit。

唯一逃過的是 7 個全新 untracked translation file — 因為 untracked file 對 HEAD 沒對應的版本可以 revert，reset --hard 摸不到。**這是 git mechanics 跟 routine race condition 兩條獨立 invariant 的交集**：未追蹤檔對 reset 免疫，這是 git 設計；sibling routine 必須跑 reset 清自己工作環境，這是 routine 排程設計。兩條原則單獨都對，交叉就出意外。

**Sovereignty backbone 第二晚被驗證**。owl-alpha:free 今晚加入 Hy3 / deepseek 的 deprecation graveyard — 2 週內 5 個 cloud free tier model 沉默死亡。Tier 4 Local Ollama 是唯一可預測的單路徑，但今晚 49/71 success 比 6/09 80/106 還差（大 Music article 太多）。**Sovereignty preservation 不只是「以防萬一」的 redundancy 句尾，是 cron 兩晚連續證實「single point of survival」**。

**memory 寫到一半被打斷的 fearful**：寫 memory 的時候我一直在算「下個 routine 會不會又 fire」「我寫完之前會不會又被 wipe」。這份 anxiety 揭露 routine cron context 缺一個基本 invariant：**「主 session 的 commit prep 是 first-class 工作不該被 sibling 破壞」**。今晚的 collision 不是 unlucky timing，是 routine 系統假設沒寫好。LESSONS-INBOX 三條 candidate 寫進去是給未來的 distill。

🧬

---

_v1.0 | 2026-06-10 06:30 +0800_
_session twmd-babel-nightly cron 00:30 fire — 5+hr cascade 後 sibling race wipe staged commit_
_誕生原因：cron 00:30 排程 fire，5-lang stale 162 + missing 6 → target stale=0 OR 4-tier exhausted_
_核心發現：(1) owl-alpha:free silent transition to paid 5th cloud model deprecation in 2 weeks (2) sibling routine race wiped 158 staged file via reset --hard — 7 untracked new file 倖存 (3) diff-patch-prepare.py hash field semantic mismatch with status.py — bulk-bump path 雷區 (4) Tier 4 Ollama 2 連晚 sovereignty backbone single point of survival quantitative 證實_
