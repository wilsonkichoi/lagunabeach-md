---
spores: '#81, #83, #85, #88, #90, #94, #96, #97, #98, #99, #100, #101, #102, #103, #104'
harvest_date: '2026-06-13 06:38'
harvest_window_day: 'mixed (D+16 to D+21)'
batch_reason: 'twmd-spore-harvest-am cron — OVERDUE backfill sweep (dashboard backfillWarnings 15 entries D+16-D+21, all past 主排程 D+1-D+7 window — milestone-style backfill before D+30 cadence cutoff)'
triggered_by: 'cron'
reply_count: '14 visible Threads replies on #97 (台灣美食總覽) + 0 readable across other 14 spores (X Pitfall 2 lazy-load + Threads #99/#101/#103 had no real reader replies)'
bucket_breakdown: 'A-carry=2 (#97 nhu_us 1949 美軍 + ericten0704 醬油黑豆 — BOTH already fixed in article 5/27 commit chain per neily1_reader original D+0 fix) / B=2 (#97 chengleco 黃蘿蔔片 + zheng_xianyang 番膏 — entity missing candidates) / E≈5 (#97 hid_stor 21L echo, sophiameir 留友, transfinitesorcerer cross-cuisine relativism) / F≈4 (#97 alligator/el07fb02 嘉義人不吃這家 / transfinitesorcerer 巴斯克燉雞 interpretive) / D=0 / G=0'
---

# batch-2026-06-13-15-spores — twmd-spore-harvest-am OVERDUE sweep

> Routine cron 06:38 fire. 15 OVERDUE spores in D+16-D+21 range — past main D+1-D+7 cycle, captured before D+30 cutoff per §觸發時機 milestone cadence (effectively D+14/+30 backfill modes).
> 4 Threads spores (#97 / #99 / #101 / #103) navigated via Chrome MCP — only #97 had real reader replies (others self-thread continuation only).
> 11 X spores (#81/#83/#85/#88/#90/#94/#96/#98/#100/#102/#104) — metrics extracted from URL meta line; reply DOM not readable per Pitfall 2.

## Per-spore harvest

| #   | Slug               | Platform | D+N  | Views | Likes | Reposts | Comments | Shares/Bookmarks | Top bucket signal                                                                                         |
| --- | ------------------ | -------- | ---- | ----- | ----- | ------- | -------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| 81  | 馬英九             | x        | D+21 | 3,596 | 44    | 3       | 9        | 3                | replies not readable (X Pitfall 2)                                                                        |
| 83  | 許倬雲             | x        | D+21 | 2,466 | 20    | 2       | 5        | 3                | replies not readable                                                                                      |
| 85  | 臺灣漫遊錄         | x        | D+21 | 34.5K | 687   | 79      | 3        | 54               | 🔥 viral long-tail (34.5K / 687 likes — D+4 was 681 likes per metric event, +6 long-tail)                 |
| 88  | 半導體產業         | x        | D+19 | 4,522 | 134   | 14      | 2        | 11               | replies not readable                                                                                      |
| 90  | 雷亞遊戲           | x        | D+19 | 10.9K | 98    | 13      | 4        | 22               | replies not readable                                                                                      |
| 94  | 大宇雙劍           | x        | D+18 | 6,790 | 55    | 13      | 7        | 6                | replies not readable                                                                                      |
| 96  | 尹衍樑             | x        | D+18 | 9,291 | 236   | 29      | 1        | 20               | replies not readable                                                                                      |
| 97  | 台灣美食總覽       | threads  | D+17 | 7,460 | 473   | 23      | 62       | 44 (shares)      | 🚨 **A-carry x2 (already fixed) + B-2 + E-3 + F-4** — full reply harvest captured (see §#97 detail below) |
| 98  | 台灣美食總覽       | x        | D+17 | 12.9K | 371   | 73      | 6        | 36               | replies not readable                                                                                      |
| 99  | portaly-五月公開信 | threads  | D+17 | 1,752 | 97    | 2       | 8        | 14 (shares)      | 0 real reader replies (only taiwandotmd self-thread continuations to portaly + dashboard URLs)            |
| 100 | portaly-五月公開信 | x        | D+17 | 1,733 | 90    | 21      | 2        | 14               | replies not readable                                                                                      |
| 101 | 落日飛車           | threads  | D+17 | 701   | 26    | 1       | 1        | 0                | 0 real reader replies (only taiwandotmd self-thread article link)                                         |
| 102 | 落日飛車           | x        | D+17 | 1,045 | 25    | 4       | 1        | 2                | replies not readable                                                                                      |
| 103 | 周蕙               | threads  | D+16 | 3,099 | 52    | 1       | 1        | 0                | 0 real reader replies (only taiwandotmd self-thread article link)                                         |
| 104 | 周蕙               | x        | D+16 | 1,479 | 25    | 4       | 0        | 0                | replies not readable                                                                                      |

**Aggregate views this batch**: ~103K views across 15 surfaces. Top performer: #85 臺灣漫遊錄 X 34.5K — Tier 1a-like long-tail (continued accrual D+4→D+21 from 681→687 likes; modest tail but reach base solid).

## §#97 台灣美食總覽 Threads (D+17) — only spore with reader-replies harvested

**Article state cross-check (2026-06-13)**: BOTH carryover Bucket A challenges (1949 美軍嘉義 + 醬油源流) are already fixed in `knowledge/Food/台灣美食總覽.md` per 2026-05-27 original neily1_reader D+0 acute fix chain. Article body now reads「戰後駐台美軍進駐嘉義水上機場後帶大量火雞來台」(post-war, not 1949-specific) + footnote `[^台灣醬油]` explicitly attributes ericten0704 callout 「清代閩南帶來釀醬技術 + 台灣本土黑豆蔭油 + 日治後黃豆醬油雙傳統」. **No new article fix needed — these surface as repeat callouts because readers see the spore body (unchanged) not the article body**.

### 14 visible replies (sorted Threads 熱門 default)

| #   | Handle               | Date | Reply text excerpt                                                                                  | Likes | Bucket           | Action                                                                                                                                 |
| --- | -------------------- | ---- | --------------------------------------------------------------------------------------------------- | ----- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | @hid_stor            | 5-27 | 「從食物認識台灣真的是最好的手段」                                                                  | 21    | **E**            | strong echo of curatorial framing — optional ack reply (past D+7 acute, ≤2 cap)                                                        |
| 2   | @chengleco           | 5-28 | 「被遺忘的雞肉飯的另一配角---日式醃漬黃蘿蔔片！😍」                                                 | 1     | **B**            | entity missing — 日式醃漬黃蘿蔔片 (沢庵) accompanying 雞肉飯 — log Round 2 EVOLVE backlog (single, not 3+ → no priority bump)          |
| 3   | @alligator.4136660   | 5-27 | 「嘉義噴水雞肉飯哪家好吃？」                                                                        | 1     | F                | question / off-topic — ignore                                                                                                          |
| 4   | @el07fb02            | 5-27 | 「嘉義噴水雞肉飯是個品牌… 基本味道都一樣」                                                          | -     | F                | interpretation                                                                                                                         |
| 5   | @sophiameir          | 5-28 | 「留友看台灣飲食故事。」                                                                            | 1     | **E**            | bookmark intent — no reply needed                                                                                                      |
| 6   | @el07fb02            | 5-27 | 「然後嘉義人都不吃這家🤣」                                                                          | -     | F                | local insider humor                                                                                                                    |
| 7   | @transfinitesorcerer | 5-27 | 「但沒人說巴斯克燉雞、香蒜辣椒義大利麵、川味水煮牛、泰式打拋豬有美洲原住民馴化辣椒一萬年的味道欸」  | 1     | F (interpretive) | comparative-cuisine relativism — actually 補強 article 立論（混血是常態） — could E-ack but past acute window                          |
| 8   | @nhu_us              | 5-28 | 「1. 民國43年（1954年）韓戰爆發... 2. 美軍從不屯田... 3. 火雞不是養在籠子𥚃... 違反飛安被拖去關！」 | -     | **A-carry**      | **REPEAT of neily1_reader 5-27 callout**, all 3 sub-claims already addressed in article body / footnote [^1]. No new fix. Stale.       |
| 9   | @ericten0704         | 5-27 | 「台灣的醬油干清朝啥事？那時候台灣是黑豆，中國是黃豆」                                              | 10    | **A-carry**      | **Already canonical in footnote [^台灣醬油] attributed to this very handle**. Article body line 46 + 239 both reflect 雙傳統 narrative |
| 10  | @zheng_xianyang      | 5-27 | 「番膏呢？」                                                                                        | 1     | **B**            | entity missing — 番膏 (台灣原住民 / 排灣族 / 古早調味料) — log Round 2 EVOLVE backlog                                                  |

Plus 3 deeper-thread mentions visible mid-page incl reply to el07fb02 thread (「但沒人說...違反飛安」continuation).

### Bucket B / E aggregate actions

- **#97 chengleco 黃蘿蔔片 + zheng_xianyang 番膏** → log to `HARVEST-EVOLVES-PENDING/2026-06-13.md` for Round 2 EVOLVE backlog (single occurrences, not 3+ threshold for priority bump)
- **#97 hid_stor / sophiameir / transfinitesorcerer** → optional D+17 acknowledgment replies (≤2 cap per Decision Gate). **Defer to manual session** — at D+17 outside auto-ship window; cron `twmd-spore-harvest-am` AI 自主 scope per DNA #26 covers metrics + classification + article-fix-when-needed, NOT D+17 cold-acknowledgment reply (per §自主權邊界 + REFLEXES #26 reply layer human gate)
- **#97 nhu_us / ericten0704 A-carry** → no action; both challenges already addressed in current article state. Reader sees spore body (unchanged, intentionally), article body has the corrected narrative. This is a **meta-pattern instance**: spore body is frozen at ship time, factual fix lives in article — readers landing on spore at D+17 still see original framing. Possible LESSONS-INBOX candidate: "Spore body frozen vs article live drift — readers default to seeing pre-fix narrative on landing surface; consider in-spore pinned-reply pointer to corrected article?" — vc=1 (first time observed at D+17 layer)

## §X 11 spores — Pitfall 2 reply opacity continues

All 11 X spores show consistent format: views / replies / reposts / likes / bookmarks line readable from main tweet `[data-testid="cellInnerDiv"]` (count = 1, replies not in DOM per Pitfall 2 canonical). Reply harvest blocked on X regardless of D+N or platform engagement level.

Metric integrity unaffected — likes/reposts/comments counts are reliable from main tweet metric line.

**Per-spore views trajectory (X)**:

| #   | Slug             | Prior last (event store) | This harvest D+N | Δ likes      |
| --- | ---------------- | ------------------------ | ---------------- | ------------ |
| 81  | 馬英九           | D+4 44 likes             | D+21 44 likes    | 0            |
| 83  | 許倬雲           | D+4 20 likes             | D+21 20 likes    | 0            |
| 85  | 臺灣漫遊錄       | D+4 681 likes / 34.2K    | D+21 687 / 34.5K | +6 / +300    |
| 88  | 半導體產業       | D+2 131 likes / 4.24K    | D+19 134 / 4.52K | +3 / +280    |
| 90  | 雷亞遊戲         | D+2 97 likes / 10.66K    | D+19 98 / 10.9K  | +1 / +240    |
| 94  | 大宇雙劍         | D+? unset                | D+18 55 likes    | n/a          |
| 96  | 尹衍樑           | D+1 109 likes / 4K       | D+18 236 / 9.29K | +127 / +5.3K |
| 98  | 台灣美食總覽 X   | D+? unset                | D+17 371 / 12.9K | n/a          |
| 100 | portaly-公開信 X | n/a (no event)           | D+17 90 / 1.73K  | n/a          |
| 102 | 落日飛車 X       | D+? unset                | D+17 25 / 1.05K  | n/a          |
| 104 | 周蕙 X           | D+? unset                | D+16 25 / 1.48K  | n/a          |

Long-tail growth: #85 漫遊錄 D+4→D+21 +6 likes minimal; #96 尹衍樑 strong sustained tail D+1→D+18 +127 likes / +5.3K views (strong Tier 1b sustained-tail spore, 中國因素 + 潤泰 entrepreneur narrative).

## Pattern observations

1. **OVERDUE backfill (D+16-D+21) confirms long-tail asymmetry**: 中段 / Tier 1b spores like #85 漫遊錄 + #96 尹衍樑 + #98 美食總覽 continue earning impressions weeks past ship; pure 低段 (#81 馬英九 / #83 許倬雲 / #102 落日飛車 X / #104 周蕙 X) plateau in D+2-D+4 range with no growth at all.
2. **Threads self-thread continuation inflates「Views」against「Comments」on info-pure spores**: #99 portaly-公開信 D+17 1.7K views / 8 comments / 14 shares — but 0 actual reader replies (all 8 are taiwandotmd's own thread 2/3 + 3/3 + dashboard cards). Implies portaly fund-ask spore = low-conversion replies but moderate share intent (14 shares = bookmark / send-to-supporter pattern).
3. **Spore body vs article body fork on factual fix**: #97 carries Bucket A repeat callouts because spore prose is immutable post-ship; article fixes don't propagate. Worth考慮 spore-pinned-correction-thread pattern when an A-fix lands D+0 → pin a「文章已更正：URL」reply at top of spore so D+N readers see correction inline.

## Stage 6 pending files

- `HARVEST-EVOLVES-PENDING/2026-06-13.md`: 2 entity-missing entries (#97 chengleco 黃蘿蔔片 + zheng_xianyang 番膏) for Round 2 EVOLVE backlog
- `HARVEST-REPLIES-PENDING/2026-06-13.md`: 3 Bucket E ack candidates for manual session (#97 hid_stor / sophiameir / transfinitesorcerer)
- `HARVEST-FRAMING-PENDING/`: 0 — no Bucket D framing escalation this cycle

## Pitfall 6 retry tally

0 reply ships this cycle (all defer to manual session per §自主權邊界). Post-ship verify pattern not exercised — Pitfall 6 timestamp diff hard rule observed by skip.

## Chrome MCP cleanup

Tab group will be cleaned at routine end per §Cleanup tab group v2.3.

🧬
