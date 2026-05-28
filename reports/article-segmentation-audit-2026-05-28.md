---
title: 文章分段品質 audit — 早期 viral 範本 vs 最近 EVOLVE 5 篇對讀
date: 2026-05-28
session: opus-1m-segmentation-audit
scope: knowledge/Nature/黑冠麻鷺、Music/張懸與安溥（早期範本）vs Music/落日飛車、Technology/半導體產業、Music/周蕙（近 7 天 EVOLVE R2）
trigger: 哲宇 callout「好的文章分段，我們的 routine 出了什麼事」
methodology: scripts/tools-like Python AST scan over markdown body — strip frontmatter，per-H2 切段、CJK 字數統計、富文本/iframe/footnote/連續 bullet 偵測
---

## §量化對比 table

| 指標                          | 黑冠麻鷺 | 張懸與安溥 | 落日飛車 | 半導體產業 |     周蕙 |
| ----------------------------- | -------: | ---------: | -------: | ---------: | -------: |
| 全文 CJK 字數                 |    4,746 |      5,055 |    7,057 |      9,053 |    8,937 |
| H2 section 數                 |        9 |         12 |        9 |         15 |       12 |
| Prose 段落數                  |       52 |         90 |      106 |        116 |      122 |
| 段落 CJK mean                 |     84.9 |       53.5 |     61.5 |       72.0 |     68.7 |
| 段落 CJK median               |       81 |         42 |       52 |         66 |       58 |
| 段落 CJK stdev                |     45.7 |       34.2 |     42.2 |       45.0 |     42.8 |
| 段落 CJK max                  |      220 |        139 |      208 |        330 |      220 |
| 長段 >500 字 count            |        0 |          0 |        0 |          0 |        0 |
| 短段 <150 字 count            |       50 |         90 |       99 |        113 |      113 |
| 含 visual 的 H2/總 H2         |      1/9 |       0/12 |      4/9 |       3/15 |     7/12 |
| iframe+img / 1k CJK           |     0.21 |       0.00 |     0.99 |       0.44 | **1.23** |
| Footnote / 段                 |     0.87 |       1.06 |     0.87 |       0.71 |     0.86 |
| 富文本 callout / 1k CJK       |     0.42 |       0.59 |     0.57 |       0.77 |     0.67 |
| 連續 bullet >5 條的 list 群數 |        0 |          0 |        0 |          1 |        0 |

備註：半導體 list_dump=1 是 §量子站位仍空著 末段「延伸閱讀」8 條 footer（**結構性，不算 prose drift**）。最長 330 字段落也在該章——但實際內容是一條 `>✦` 收束 callout，屬於刻意的修辭密度，非段落崩壞。

## §主觀觀察（≤ 200 字）

**早期範本（黑冠麻鷺）**：H2 少（9 個）、字數少（4.7k）、段落少而飽（mean 85 字 / median 81），呼吸節奏穩定。每章 4-6 段、每段 80-100 字、stdev 45 — 接近正態分佈。

**最近 EVOLVE 共同 pattern**：CJK 字數膨脹 1.5–1.9 倍（7-9k）、段落數爆 2-2.3 倍（106-122 段）、但段落 mean 下降到 53-72 字、median 跌到 42-66。**沒有「段落過長 / list-dump / 事實堆疊」這幾種傳統 drift**，反而是反向 drift：**段落切碎、節奏破裂、視覺元素加重**。周蕙 iframe+img / 1k = 1.23（是黑冠麻鷺的 6 倍）；落日飛車 4/9 H2 含 visual。新文體偏向 scroll-friendly 媒體拼貼，犧牲了早期「敘事段落自己承擔張力」的呼吸節拍。

## §drift signals

1. **段落原子化（atomization）**：median 從 81 → 42-66。早期 1 段 1 個小論點，現在 1 段 1 個事實。讀者眼睛被迫頻繁跳行，敘事拉力被切碎。
2. **H2 通膨**：9 → 12-15 個 H2，每章承載的論證被切細。半導體 15 個 H2 是同類最高。
3. **Visual 倚賴上升**：1/9 → 7/12 含 visual section。文字本身的節奏感被 outsource 給 iframe / image 製造呼吸。
4. **無「過長段」也無「list-dump」**：5 篇都 0 條 >500 字段、僅 1 條結構性 footer bullet 群——傳統 reflexes 監控的反 pattern 沒觸發，所以 routine 沒 alert。

## §建議修補方向

**Root cause hypothesis**：[REWRITE-PIPELINE](/Users/cheyuwu/Projects/taiwan-md/docs/pipelines/REWRITE-PIPELINE.md) 在 Stage 4-5 sub-agent worktree spawn 時，新章每章只給 200-400 字 brief，agent 傾向「一個事實=一段」（safest）。MEDIA 子 pipeline 對 iframe sync 主動加章，讓 visual 自己承擔節奏，agent 不再需要寫「段落內邏輯轉折」。

**建議**（per EDITORIAL.md + MANIFESTO §11 書寫節制）：

1. **REWRITE-PIPELINE Stage 4 prompt 加 anti-example**：附 1 段早期範本（黑冠麻鷺 §結語 4 段呼吸節奏）+ 1 段近期 atomized 段落，要求 agent 維持 median 75-90 字 / 段。
2. **加 QA gate**：article-health.py 加 `paragraph_rhythm` plugin — flag median <55 字 或 paragraph >100 段的長文，視為 atomization drift。
3. **EDITORIAL §段落呼吸**新規條：每 H2 章節 prose 段落數 ≤ 8（含 footer / callout 不計）；超過代表該章該拆 H2 或合段。
4. **MEDIA / iframe density 上限**：> 0.8 iframe/1k CJK 觸發 review（周蕙 1.23 超標 50%）。Visual 是輔助呼吸，不是替代敘事節奏。
5. **Anti-pattern naming**：把這條命名為 **「Atomization drift」**進 LESSONS-INBOX，補進 reflexes monitor（已有 long-paragraph / list-dump 反 pattern；缺 atomization 反 pattern）。

關聯 reflexes 候選：「段落 median 字數是文體基因表達」「visual 不能替代段落呼吸」。
