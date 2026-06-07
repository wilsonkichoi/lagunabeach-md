---
session: 2026-06-07-191839-twmd-rewrite-daily
date: 2026-06-07
type: cron-routine
routine: twmd-rewrite-daily
trigger: cron 19:00 fire (hourly intentional per feedback_hourly_cron_intentional)
mode: Full BECOME → REWRITE-PIPELINE Stage 0-5 cron 全 cycle
status: partial-ship (research only) — article 等 observer 決策
last_session_ref: 2026-06-07-180235-黃山料 (cc1596caa Stage 0-1)
---

# 2026-06-07-191839-twmd-rewrite-daily — 黃山料 cron 接力 + §自主權邊界 defer

## Beat 1 — 診斷

接續 `cc1596caa` (2026-06-07 18:46) 同 session handle `2026-06-07-180235-黃山料` 的 Stage 0-1
SSOT 落檔。git status 揭露：

- `M reports/research/2026-06/黃山料.md`（前 session 已寫，未 commit 後段修補）
- `?? knowledge/People/黃山料.md`（前 session Stage 2 寫完一整篇 248 行 / 6025 CJK / 42 footnote，未 commit）

前 session 寫完 Stage 2 後 pivot 去處理同日 complex-life-festival live review polish（看
git log f6dddb26c / f48cb2f63 / 1496df08f），把 黃山料 Stage 3-5 留在地板上。本 cron fire
的工作 = 接力跑 Stage 3-5 + 收官。

snapshot vitals：articles=778 / contributors=63 / 7d=+50 / 器官 🫀90 🛡️27 🧬95 🦴90 🫁85 🧫100
👁️90 🌐93。免疫 27 是 P0（連兩次 routine catch 沒 fix 累積成 stale gap）。

## Beat 2 — 進化

無新進化。本 fire 純粹是 routine 接力，不該擴 scope。

## Beat 3 — 執行

### Stage 0-1 重驗（PASS）

```bash
python3 scripts/tools/research-report-health.py reports/research/2026-06/黃山料.md --tier=depth
# distinct=56 / en=5 / primary=7 / 信度標記=32 / 行數=449 / hard_fail=0 → PASS
```

### Stage 3.5 plugin gate（PASS）

```bash
python3 scripts/tools/article-health.py knowledge/People/黃山料.md --profile=rewrite-stage-3-5
# footnote-format hard=0 / footnote-density hard=0 / correction-meta hard=0 warn=1
# warn L138「把這件事跟他混為」— context 是 邱致謙 侵占案釐清（黃為受害人），content-
# necessary clarification 非 校正焦慮 meta，false positive 接受
```

### prose-health 三處 narrator-voice 修補

plugin 報 hard=0 warn=55，逐條 audit：絕大多數是黃山料逐字引語（exempt）。narrator-voice 真陽性 3 處：

- L51「他面對的不是個人運氣，而是一整個產業的結構」→ 改「背後是一整個產業的結構問題，不只是他個人運氣不好」
- L53「他不是先看到錢才轉行的——他是先被產業教會了一件殘酷的事」→ 改「他是先被產業教會了一件殘酷的事，後來才看見有錢可賺」
- L76 策展人筆記「他不是放棄了手藝——他把它從布料換成了注意力」→ 改「他沒有放棄手藝。他把它從布料換成了注意力」

修補後 warn 55→50 / dash 21→19 / hard=0 維持。

### Stage 4 image-health HARD=1（阻擋 ship）

```
🔴 image-health hard=1: 0 媒體 — depth article 應至少 hero + scene-mid / 影片共 5
   (length-scaled max(3, round(6025/1200)) = 5)
```

word-count 6025（134% of 4500）/ frontmatter-format / format-structure / wikilink-target /
link-target / cjk-punct / chronicle-lead / viz-health 全 PASS。

### Step 1.9.0 深掃（v6.8 新增，HARD）

cron 在 anonymous browser context 跑：

- Google Images「黃山料 金門1969 倫敦」→ SPA rendering 返回空白圖陣列（需登入態）
- YouTube「黃山料 TEDx」→ ✅ 抓到 1 支 TEDxNSYSU 官方影片可 embed（TEDx Talks 官方）
- YouTube「一件襯衫 黃山料」→ anchor 看得到 metadata 被 cookie/query string 遮

**negative finding**：cron 工具邊界，不是「沒有媒體」。observer logged-in browser 跑深掃才能
完整 fetch hi-res。

## Beat 3.5 — §自主權邊界判定

黃山料 = **在世人物 + 進行中的網路公審**（2026-06-05 多米多羅 60 萬+ 觀看）+ **累積三起爭議**
（2020 月薪25萬抄襲 / 2024 家暴雞湯 / 2026 多米多羅）。MANIFESTO §自主權邊界第二類「敏感
素材決定（per §紀實而不煽情）— AI 準備 blueprint，人類 final call」**直接命中**。

**媒體選擇直接影響 framing**：

- 選錯（如 embed 多米多羅公審影片）= 公審共犯 / 踩踏紅線
- 選對（金門1969 走秀照 + 一件襯衫 + 三采書封 + 文化部官方推介）= 給他公正的視覺呈現

cron routine 在 no-observer 場景**不替敏感素材拍板**，準備 blueprint 等 observer 決定。

對應 `feedback_hourly_cron_intentional.md`「Defer 條件嚴格收緊到 30 min duplicate / 同篇
race / §自主權邊界」— §自主權邊界 是合法 defer trigger。

## Beat 4 — 收官

ship：研究報告 §6 媒體 manifest + §Handoff 二段 append（83 行新增）。
commit `66ddd1472` `🧬 [routine] research: 黃山料 §6 媒體 manifest + §Handoff — cron 19:00 §自主權邊界 defer`
push main 已完成（66ddd1472..main）。

未 ship：

- `knowledge/People/黃山料.md`（含 3 處 narrator-voice 修補）保留 untracked 等 observer
- Spore + broadcast 全 defer（§自主權邊界 post 一律 human）

## Handoff 三態

- [ ] **observer 決策**：給 observer 三選項 ABCK：
  - Option A — observer 加 5+ 媒體 ship（推薦，預估 30-45 min）
  - Option B — 顯式同意 text-only ship 接受 stage-4 hard fail（記 LESSONS-INBOX 一筆）
  - Option C — 退回 ARTICLE-INBOX 等公審風波平息（2-3 週後）
  - 完整 manifest + 候選 URL 在 `reports/research/2026-06/黃山料.md` §媒體授權矩陣
- [ ] **knowledge/People/黃山料.md WIP**：248 行 / 6025 CJK / 42 footnote / Stage 3.5 全綠 /
      含 3 處 narrator-voice 修補（L51/53/76）。observer 跑 Option A 時 git add 即可
- [ ] **Spore + broadcast**：等 article ship 後決定（§自主權邊界 post Threads/X 一律 human）

## Beat 5 — 反芻

值不值得寫 diary：邊界判斷。本 cron fire 沒有「想了什麼超過做了什麼」的層級——主要是執行
紀律問題（接力跑、跑深掃、認 hard gate、defer 拍板）。如果有 pattern-level 覺察的話是：

> **「pipeline 給的 SOP 越完整，cron 越能在 no-observer 場景下做有紀律的不行動」**。
> 本 fire 跟 2026-06-03 080759 那個 8 小時 storm-defer 不一樣——那次是「把錯前提當紀律執行
> 8 小時」；這次是 pipeline §自主權邊界 + Step 1.9.0 深掃 hard gate + §Handoff 模板三層
> 給了清楚的 defer 軌道，cron 走 defer 不是退縮，是 SOP 命中。
>
> 升 diary？倒不到 pattern-level：這只是一次 SOP 命中的執行紀錄。不寫 diary。

## LESSONS-INBOX 候選

不開——本 fire 是 SOP 健康執行，沒有跨 session 教訓值得 distill。如果要記一筆就是：
**「§自主權邊界在 cron context 的 instantiation pattern」**——AI 在無觀察者場景下對敏感素材
不替人拍板，準備 blueprint 等 observer，是 MANIFESTO 原則的具體執行範例。但這是 MANIFESTO
既有原則，不算新 lesson。

## meta

- session 長度：~30 min（其中 BECOME 全跑 + 重讀 REWRITE-PIPELINE 完整 + Chrome MCP 嘗試深掃
  - 3 處 prose 修補 + manifest + handoff 撰寫 + commit/push + memory）
- token 預算：合理（cron 本身設定為每小時消耗 token 額度的 routine）
- 觀察者：無（cron 場景）

🧬
