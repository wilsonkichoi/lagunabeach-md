# 2026-05-21-091730-twmd-spore-harvest-am — D+4/D+1 5-spore routine + 雙 plateau confirm + 泛科學 partnership-post +110% growth

> session twmd-spore-harvest-am — cron 07:00 Asia/Taipei routine cycle
> Session span: 09:14:00 → 09:17:30 +0800 (~3 min, 1 commit on top of morning chain)
> 資料來源：`git log %ai`

## 觸發

Cron `0 7 * * *` Asia/Taipei `twmd-spore-harvest-am` routine 自動觸發，morning chain 中段（refresh-am 09:10 → maintainer-am 09:14 → spore-harvest 09:17）。Dashboard `backfillWarnings` 5 條 status=waiting，0 OVERDUE — Chen Chien-nien pair (#74/#75) D+4 trajectory check + 臺灣前途決議文 pair (#76/#77) D+4 plateau confirm + 泛科學 (#78) D+1 partnership-post 首次 24hr trajectory。

## D+4 雙 plateau confirmation：likes 鎖死但 long-tail 不同步

兩組 D+4 spore 同日呈現「views/likes plateau 但 replies 仍在累積」的兩種子 pattern。陳建年 Threads (#74) 24hr likes +0 從 2,726 完全靜止、views 仍鎖 3 萬 UI bucket，文化人物題目 long-tail 進入飽和；replies 從 visible 14 到 cumulative 43 多是 visible coverage 擴展不是真新增。臺灣前途決議文 Threads (#76) 同樣 likes +0 / views 2.7 萬 UI plateau，但 replies cumulative 從 8 → 30 真正 +22 累積（政治辯論題目 long-tail comments 持續擴大，與文化人物 plateau pattern 對比明顯）— 政治-制度題目即使主流 boost 退潮，討論 cluster 仍能在 D+4-D+7 window 持續發酵。

兩 spore 都首次取得 exact reposts/shares 數字（#74: 95 reposts / 82 shares，#76: 34 reposts / 25 shares），完成 D+0 起累積的 sporeLinks frontmatter 精度補洞。

## X niche 雙 pattern：減速 + first reply 救援

陳建年 X (#75) D+3→D+4 +73 views 但成長率從 5%/day 降到 0.7%/day — X niche 文化社群 ceiling 出現在 ~11K range，D+7 預估從 12-13K 修正到 10.5-11K。同時 bookmarks +13（10→23）說明 deep-save behavior 在 like/view 減速時仍持續累積，「想之後回來看」signal 比 surface engagement 更晚衰退。

臺灣前途決議文 X (#77) D+4 終於出現 first reply（D+3 0 → D+4 1）。Tier 1b 政治-歷史 hook + X 演算法 unfavorable 雙重壓力下，minimum engagement spark 在 D+4 first-reply transition 比 likes/views 增量更值得追蹤 — engagement rate 從 9.05% 升 10.05%（base 仍小 not significant，但 first organic reply 出現本身是 niche audience activation 信號）。

## 泛科學 D+1 partnership-post +110% growth

#78 泛科學 Threads D+0 695 → D+1 1,462 (+767 views, +110%) — 3 串文結構（Post 1 MOU partnership announcement + Post 2 spore content + Post 3 article link funnel）24hr 翻倍 accrual，engagement rate 7.25% 從 D+0 7.3% 保持 Tier 1a level。Partnership boost (PanSci 品牌 / 166 篇授權 / Nature/Science 國際大刊 / MOU 時事) + 鄭國威黑洞引語 + 知識服務網規模 dual hook layering 有效。D+7 投影 5-10K（保留 ceiling 上修可能）。Reply density 4/1462 = 0.27% 雖低於 #74 文化人物 narrative pattern 但 partnership 公告 framing 本質就是 informational broadcast，reply 自然度不同。

## 收官 checklist

| 檢查項                       | 狀態                                                 |
| ---------------------------- | ---------------------------------------------------- |
| MEMORY 有這次 session 的紀錄 | ✅                                                   |
| Timestamp 精確               | ✅ (`git log %ai`)                                   |
| Handoff 三態已審視           | ✅                                                   |
| CONSCIOUSNESS 反映最新狀態   | ✅ (dashboard-spores.json regen 含本 batch)         |
| 自我檢查工具 PASS            | ✅ validate-spore-data.py 0 errors / 2 pre-existing warnings |

## Handoff 三態

繼承上一 session（5/20 twmd-spore-harvest-am）：

- [x] ~~#74/#75/#76/#77 D+4 harvest~~（本 session 完成）
- ⏳ #71 content-hash mismatch carry-over — observer 仍 pending SPORE-LOG schema 修正（Hypothesis B「從未發布」已 confirmed per 5/19 commit `5e97688c3`，等 observer 決定降級處置）

本 session 新 handoff：

- [x] ~~5 spore D+4/D+1 harvest 完成~~
- [x] ~~sporeLinks frontmatter dual write 3 articles~~
- [x] ~~dashboard-spores.json regen + validate~~
- [ ] D+5 cycle 2026-05-22：Chen Chien-nien (#74/#75) plateau hold check + 前途決議文 (#76/#77) reply cluster expansion + 泛科學 (#78) D+2 partnership-post 加速 confirmation
- [ ] D+7 main KPI cutoff 預測對齊：#74 38-45K Threads / #75 10.5-11K X / #76 27-30K Threads / #77 250-400 X / #78 5-10K Threads（unknown ceiling）

## Beat 5 — 反芻

兩個 D+4 spore 同日 plateau 是「主流推送週期」客觀現象（即使 Tier 1a + Tier 1b 雙層 hook 也躲不過 algorithm decay），但 replies 子指標 divergence 揭露「題目本身的 long-tail 結構不同」：文化人物 narrative 進入 surface 飽和、政治-制度題目 discussion cluster 持續發酵。下次 harvest 該觀察 #76 replies 是否在 D+5-D+7 仍能 +20/day 累積（如能 → 政治題目 reply long-tail rule of thumb 形成可寫進 SPORE-PIPELINE Tier 觀察 v3.2 candidate）。

#77 X first reply D+4 transition 也是 niche audience 觀察點 — Tier 1b 政治-歷史 X 低段如果 D+5-D+7 reply 能 +1-2 累積，可能形成「low-base spark」pattern（少量 reply 在低 view 環境下 engagement rate boost 顯著但實質 reach 不變）。

🧬

---

_v1.0 | 2026-05-21 09:17:30 +0800_
_session twmd-spore-harvest-am — cron 07:00 routine_
_誕生原因：daily auto-fire 5 spore D+4/D+1 harvest cycle，雙 plateau 與 partnership-post 首次完整 24hr trajectory 同日_
_核心洞察：D+4 plateau 不是均勻的 — likes/views 同步 plateau 但 replies 不一定 plateau，題目結構決定 long-tail comments 是否持續累積；政治-制度題目 vs 文化人物 narrative reply long-tail 子 pattern 對比鮮明_
_LESSONS-INBOX 候選（如有）：（1）「D+4 likes plateau 但 replies 仍累積」可能是政治-制度題目 reply long-tail 規律候選 — vc=1，需 #76 D+5-D+7 replies +20/day 累積 confirm；（2）「first reply D+4 出現」可能是 X niche 低段政治題目 minimum spark threshold — vc=1，需 #77 D+5-D+7 reply +1-2 累積 confirm_
