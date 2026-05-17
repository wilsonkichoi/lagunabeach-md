---
type: orchestration
date: 2026-05-18
session: 2026-05-17-230616-manual (continuation)
trigger: 哲宇 directive「直接指揮大量 sub-agent 分批跑剩 21 篇縣市，嚴格遵守 rewrite-pipeline + pilot 累積經驗智慧 + 確保品質與流程嚴謹被遵守 + 我做最終檢查跟統合推 main」
parent_plan: reports/cities-series-planning-2026-05-17.md
pilot_done: 基隆市 commit f187773fe (5168 字 / 5 圖 / hard=0 全綠 / 41 搜尋 / pilot retrospective §10)
total_remaining: 21 篇
batch_strategy: 5 批次 × 4-5 agents parallel + main session audit + merge
---

# 22 縣市系列 — 剩 21 篇 sub-agent orchestration plan

## 1. 為什麼分批 + worktree isolation

per [DNA #46 sub-agent worktree clean](../docs/semiont/DNA.md) + REWRITE-PIPELINE「Cron 鐵律 一次一篇」實戰教訓：
- **N agents 平行直寫同一個 main branch** = 必然 file conflict + 互相覆蓋
- **N agents 平行寫各自 worktree** = file isolated，但 audit + merge 由主 session 序列做

**選擇**：每 agent 用 `Agent(isolation: "worktree")` 跑一篇，commit 在自己 worktree，回傳 worktree path + branch name + commit hash。主 session 序列審核 → cherry-pick / merge 到 main。

## 2. 五批次分配（21 → 5×4-5 agents）

排序原則：**先做 niche/中型搶 SEO 空缺 → 再做大都會**（per cities-series-planning §7 第 2 條建議）。

### 🎯 批次 1 (niche/離島 + 中型，schedule pilot 學習擴散)
1. 嘉義市（27 萬 / 雞肉飯 / 北回歸線 / 被搶走的科學園區）
2. 連江縣（馬祖，1.3 萬 / 戰地遺產 / 藍眼淚 / 福州話）
3. 澎湖縣（11 萬 / 72 島 / 玄武岩 / 拒博弈案例）
4. 宜蘭縣（45 萬 / 雪隧前後 / 員山礁溪五結）
5. 苗栗縣（53 萬 / 客家本色 / 政府破產案例）

### 批次 2 (中型客家/原民縣)
6. 新竹縣（57 萬 / 客家庄圍繞科技園區）
7. 嘉義縣（49 萬 / 阿里山 / 三個時代觀光策略）
8. 屏東縣（79 萬 / 最南端 / 排灣 / 88 風災）
9. 花蓮縣（32 萬 / 太魯閣 / 0403 地震 / 阿美太魯閣）
10. 台東縣（21 萬 / 南迴 / 蘭嶼 / 卑南陳建年連動）

### 批次 3 (中型農業/工業縣)
11. 南投縣（47 萬 / 唯一不靠海 / 921 震央）
12. 雲林縣（64 萬 / 六輕代價 / 北港媽祖）
13. 彰化縣（124 萬 / 第一大平原縣 / 鹿港）
14. 金門縣（14 萬 / 戰地觀光 / 高粱 / 廈門對望）

### 批次 4 (省轄市 + 直轄市 lower complexity)
15. 新竹市（45 萬 / 風城變科技城 / 眷村）
16. 桃園市（230 萬 / 機場 + 半導體 + 移工）
17. 台南市（186 萬 / 400 年首府）
18. 高雄市（273 萬 / 重工業港都轉型）

### 批次 5 (北部最大 — 最複雜，留最後)
19. 台中市（285 萬 / 中部生活圈樞紐）
20. 新北市（401 萬 / 包圍台北環狀都會）
21. 台北市（247 萬 / 首都內部分層）

**為什麼台北留最後**：資料海最深、政治符號最集中、最容易迷失。pilot 累積經驗 + 前 20 篇做完後對 22 縣市相對關係已熟悉，台北才有 frame 可選。

## 3. 每個 sub-agent 的 task prompt 模板

每 agent 跑 isolated worktree，task prompt 必含以下強制章節（避免 agent 偷工）：

```
你是 Taiwan.md 的 rewrite agent，這次任務是寫 22 縣市系列其中一篇：「{縣市名}」。

## 你必須遵守的 hard gates（不過 = retry / 不 merge）

### Stage 0 §觀點成型 (HARD GATE)
1. 讀 docs/pipelines/REWRITE-PIPELINE.md 全 1794 行
2. 讀 docs/editorial/EDITORIAL.md 全 1324 行  
3. 讀 docs/editorial/RESEARCH.md 全 438 行
4. 讀 reports/cities-series-planning-2026-05-17.md (含 pilot 校準的 15 條 caveats + §10 retrospective)
5. 讀 knowledge/Geography/基隆市.md (pilot 範例)
6. 在 reports/research/2026-05/{縣市}.md 落 §觀點成型 section 含 6 核心問題 + 7 品質維度 + Geography 類型加權矩陣 + viewpoint_formed: true
7. 找出本縣市的「凌晨四點時刻」(per pilot retrospective)

### Stage 1 (HARD GATE)
8. 40+ 次搜尋（中文 24+ / 英文 5+ / 一手來源 6+ / WebFetch 中文必用中文 prompt 求 verbatim）
9. 落 reports/research/2026-05/{縣市}.md
10. 核心矛盾鎖定 ≤ 30 字
11. 媒體授權三表 append research 檔 (inline 外連 manifest + 圖片素材 ≥5 + transcript)

### Stage 2 (HARD GATE)
12. 結尾先寫
13. Title 冒號三明治格式 (主題：副標 hook)
14. Description 120-160 字含具體 anchor
15. 7-8 H2 narrative 標題（非編年體 / 場景物件矛盾驅動）
16. 4500-6000 CJK chars
17. 25-32 footnotes (canonical 格式 [^N]: [Title](URL) — description)
18. 開場場景 + 結尾首尾呼應
19. **找具體場景畫面，避免抽象 framing 結尾**（per 哲宇 2026-05-18 callout）

### Stage 3 (HARD GATE)
20. prose-health score ≤ 3 pass
21. 對位句型 ≤ 3 處 (≤ 3 limit)
22. 破折號 ≤ 15 per 1500 字
23. 三角自檢 (算術 / 單位 / 引語) PASS
24. 引語逐字 Ctrl-F 驗證

### Stage 3.5 (HARD GATE)
25. footnote-format profile hard=0
26. footnote-density profile hard=0
27. FACTCHECK Quick Mode 所有 atom verified

### Stage 4 (HARD GATE - 2026-05-18 升級)
28. article-health rewrite-stage-4 profile hard=0
29. **≥5 張圖**（hero frontmatter + 4 inline scene-mid，from Wikimedia Commons CC BY-SA hot-link allowed）
30. **建議再加 1-2 video iframe**（per EDITORIAL §媒體編織 Geography baseline，觀光局 / 縣市政府官方 / 公視）

### Stage 5
31. 7-8 forward cross-link 含具體說明
32. 1-2 strongest reverse cross-link 加到 sibling

## Pilot retrospective 5 條校準（必遵守）

11. 降雨數字分 layer（年雨量 vs 降雨日 vs 平地 vs 測站）
12. 結構性轉變用區間時間不單一年份斷言
13. 「衰退」frame 必有具體數字證據
14. 本地 vs 觀光客 fault line 是 Geography 觀點核心
15. 日治現代化必具體化建築/年份/數字

## 共通 research caveats（pipeline §4 + §10 全 15 條，務必讀完再動手）

## Output 要求

完成後 commit 到本 worktree branch，commit message:
"🧬 [semiont] new: {縣市} — 22 縣市系列 batch {N} / {代表 hook}"

回傳：
- branch name + commit hash
- 字數 + footnote 數 + 圖片數
- 任何 fact flag / SOFT-FIX 待 main session audit 的條目
- 5 分鐘 reading test 自評
```

## 4. 主 session audit + merge 流程

每 batch 完成後：

1. **平行 audit**：每 agent commit 跑 article-health full + rewrite-stage-3-5 + rewrite-stage-4 profile，hard=0 才接受
2. **prose 5 分鐘 reading test**：拿給主 session 讀 5 min，confirm 5 品質維度（溫度 / 人味 / 故事 / 策展 / 觀點 / 體驗 / 歷史社會關聯）站住
3. **核心矛盾驗證**：description / 開場 / 中段 / 結尾 四處有沒有 anchor 貫穿
4. **圖片可用性**：5 張 Wikimedia URL hot-link 驗證 file exists
5. **Cherry-pick / merge**：每 agent 一個 commit cherry-pick 到 main，或 fast-forward merge worktree branch
6. **INBOX cleanup**：對應 entry 移除 + ARTICLE-DONE-LOG append
7. **CI 確認**：每 batch push 後等 CI 過

## 5. Quality red lines

任何 batch agent 出現以下狀況 = **reject，要求 retry**：

- ❌ word-count < 4500 CJK
- ❌ < 5 張圖
- ❌ 對位句 > 3
- ❌ 破折號 > 25 (全文)
- ❌ 編年體 H2 標題
- ❌ description < 120 字 or > 160 字
- ❌ Title 沒走冒號三明治
- ❌ 引語有 wikipedia 回譯嫌疑
- ❌ 任何 footnote URL 4xx/5xx
- ❌ 結尾抽象 framing 沒有具體畫面

## 6. 預估時間表

- **批次 1 (5 agents parallel)**：~3-5 小時 agent run + 1 小時 main audit/merge
- **批次 2-5 (各 4-5 agents)**：類似 cadence
- **全部完成**：5-7 個 sub-session 跨多天

不要 push 速度，push 品質。

## 7. 下一步立即動作

主 session 同 turn 立即 spawn 批次 1 五個 agents（嘉義市 / 連江 / 澎湖 / 宜蘭 / 苗栗）isolation: worktree。

每個 agent 跑完 ~3-5 小時後，主 session audit + merge → 觸發 批次 2。

---

_v1.0 | 2026-05-18 session 230616-manual (continuation)_
_誕生原因：哲宇 directive「直接指揮大量 sub-agent 分批跑 21 篇縣市」+「最後由你做完整檢查跟統合推到 main」_
_核心精神：質量 > 速度。pilot 經驗智慧儀器化進 agent task prompt，每篇都 pipeline-grade，不是 routine churn。_
