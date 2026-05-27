---
session_id: '2026-05-27-102155-twmd-spore-publish-daily'
session_span: '10:09 → 10:21 (~12 min, dual platform ship)'
session_type: 'routine'
routine: 'twmd-spore-publish-daily'
mode: 'write'
outcome: 'success — dual platform ship (#97 Threads + #98 X) — routine first successful auto-ship'
spore_numbers: ['#97', '#98']
article_slug: '台灣美食總覽'
article_category: 'Food'
---

# 2026-05-27 twmd-spore-publish-daily — 第一次成功自動 ship 雙平台 #97/#98 台灣美食總覽

## Stage 1 SELECT

讀 SPORE-INBOX §Pending，按 P0 > P1 > P2 > P3 + FIFO 篩。

**選文判斷**：

- P0 二二八事件 REACTIVE — 高敏感度（兩岸資訊戰 + 死亡人數爭議 + 族群創傷），routine 無 observer 政治時機 judgement → **defer to human**
- P1 台灣美食總覽 — 哲宇 5/21 directive 累積 6 天未發，article 5/18 ship 距今 9 天趁熱窗口最後一天 → **選為 candidate**
- 其餘 P2/P3 候選 11 條留 buffer

## Stage 2 QUALITY GATE — 全 5 條 PASS

```
prose-health      score=1 ≤ 3        ✅ (comfortable, 不是 borderline)
word-count        7234 CJK ≥ 4500    ✅ (161% of threshold)
footnote-density  0 violations       ✅
media-richness    11 image ≥ 2 hard  ✅ (iframe 0 INFO-only doesn't block)
lastVerified      2026-05-18, 9 天   ✅ (≤ 90 天)
```

對照 5/26 routine 9/9 倒在 media-richness（vc=2 instrument 觸發 pipeline v1.1 修補：iframe 降為 soft signal + Stage 2.6 spawn ARTICLE-INBOX EVOLVE）— 本日是 v1.1 修補後第一次有 candidate 過 gate。

## Stage 3 WRITE

**Hook 選擇**：場景 hook（option 2 from SPORE-INBOX entry）— 1949 嘉義噴水池圓環旁中山路 325 號 + 林添壽 + 美軍養剩的火雞 + 1925 蓬萊米 + 清代閩南醬油 = 五個獨立可查 anchor。

**模板**：B 冷知識型 — 反差 reveal 三層歷史（美軍 + 日治 + 清代），不是人物弧線、不是數字驚悚、不是時間軸。

**Tier**：1b 具體性槓桿（routine default per v3.8）。

**Prose**：270 CJK 主貼，5 段 sweet spot。三板斧自檢：

- 「不是 X 是 Y」對位句型：article title chiasmus closure 1 處 ✅ ≤ 1
- 破折號連用「—」：1 處（「你知道嗎—」）✅ ≤ 1
- 「不僅」「展現精神」：0 處 ✅

**事實藍圖**：7 條全 article footnote 支撐（[^1] 1949 林添壽 / [^2] 1925 磯永吉 / [^3] 農糧署票選 + article line 26 三層歷史 verbatim + article title chiasmus）。

## Stage 4 SHIP

### Routine context auto-decisions（v3.8 per SPORE_ROUTINE_MODE=1）

- Platform: **both (Threads + X) default v3.8** ✅
- Hook tier: 1b default ✅
- Multi-version proposal: skip ✅
- Multi-language fan-out: skip (zh only) ✅
- Image plugin check: passed visual 5/5 ✅
- 0 observer gate on text + image steps ✅

### 配圖

`public/spore-images/台灣美食總覽-square.png` (2160×2160 retina square, 491KB) via `make-spore.sh --prod`（舊文章 5/18 ship + 9 天 prod 穩定）。

AI 視覺自檢 v3.6 5/5 PASS：標題對 / hero 描述對 / breadcrumb 對 / Taiwan.md 簽名 / 無 404 loading skeleton。Font fallback (justfont timeout 15s 用 jf-kamabit) 但 render 完整。

### CI/CD wait gate (v3.7)

舊文章自動 PASS：`curl -sf https://taiwan.md/food/{encoded}/` HTTP 200, size 307489, keyword「噴水雞肉飯」+「林添壽」7× hits。

### Threads + X 雙平台 ship 流程

**X 流程**：

1. osascript clipboard set PNGf
2. navigate x.com/compose/post
3. screenshot 確認 @taiwandotmd account active ✅
4. click compose textbox → cmd+v image (5 imgs attached)
5. click compose 再 focus → type 文案 含 inline UTM URL utm_source=x&utm_campaign=s98
6. AI pre-ship 6/6 PASS（account / hook / quote / closeLine / UTM / image / postBtn enabled / textLen 416）
7. JS click `[data-testid="tweetButton"]`
8. navigate @taiwandotmd → JS query 抓 status URL `2059458468898287770`
9. post-ship verify 5/5 PASS

**Threads 流程**：

1. navigate threads.com → click 有什麼新鮮事 modal 開啟
2. click 「社群或主題」label (ref_168) → type「台灣」→ click dropdown 第一條
3. click 第一則 textbox → cmd+v image
4. click 文字框 (focus again) → type 主貼文案
5. find「新增到串文」(ref_185) + scroll_to + click → 出現第二則 textbox (ref_216)
6. scroll_to + click 第二則 textbox → type 「完整故事 👉 {UTM URL}」utm_campaign=s97
7. JS click `div[role="button"]` textContent==='發佈'（注意：是 DIV not BUTTON）
8. navigate @taiwandotmd → JS query 抓 post URL `DY0zmnNE5RT`
9. post-ship verify 5/5 PASS

### Post-ship verify

| Platform | URL                                                   | Verify                                                                                              |
| -------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Threads  | https://www.threads.com/@taiwandotmd/post/DY0zmnNE5RT | hasHook + hasQuote + hasCloseLine + hasURL + imageCount=5 cdninstagram thumbs ✅                    |
| X        | https://x.com/taiwandotmd/status/2059458468898287770  | textHasHook + textHasQuote + textHasCloseLine + hasShortener t.co + page title 含 prose verbatim ✅ |

### Tab cleanup

`tabs_close_mcp` tab 710172193 → group auto-removed ✅

## Stage 5 復盤

### Self-review 4 題

1. **Quality gate 過得乾不乾淨？**
   - **Comfortable pass**（不是 borderline）：prose-health score=1 well under 3 / word-count 161% / footnote 0 violations / media 11 imgs / lastVerified 9 days
   - 5/5 條都遠超門檻，無 borderline ⇒ 不算入「連續 ≥ 3 天 borderline pass」LESSONS 觸發

2. **Hook tier 達標？**
   - Tier 1b 具體性槓桿，5 個獨立可查 anchor（1949/嘉義/噴水池/林添壽/中山路 325 號 + 1925/磯永吉/竹子湖/蓬萊米 + 清代/閩南/醬油 + 美軍/養剩/火雞 + 三百年同台）
   - 反差 hook：「最台灣」一碗飯 + 美軍×日治×清代三層歷史
   - 預期 D+7 reach 10K-65K range (Tier 1b)

3. **朋友 tone prime 第一秒像不像新聞 lead？**
   - 開場「你知道嗎—台灣人吃下肚的『最台灣』一碗飯」朋友 tone ✅
   - 不像新聞 lead，curiosity prefix 標準
   - 不像觀光手冊腔

4. **事實對齊？**
   - 7 條 fact blueprint 全對齊 article footnote / line / title verbatim
   - 1949 中山路 325 號 / 1925 竹子湖蓬萊米 / 三百年同台 / 七十多年後 / 農糧署票選第一 / article title chiasmus / 美軍養剩的火雞 — 7/7 ✅
   - 算術自檢：1949 → 2026 = 77 年 → 寫「七十多年後」（避開精確「80 年」）✅

### LESSONS-INBOX surface 4 種結構性問題 check

- ❌ 0 entry 過 gate intake-gap — **不觸發**（1 candidate 過 gate + shipped）
- ❌ 連續 ≥ 3 天 borderline pass — **不觸發**（本日 comfortable pass, score=1 well under 3）
- ❌ CI/CD wait defer ≥ 2 次連續 — **不觸發**（auto-PASS 舊文章 9 天 live）
- ❌ 事實對齊 fail — **不觸發**（7/7 verify PASS）

**沒有 LESSONS 觸發**——routine 全綠 ship。

### 裡程碑

**spore-publish-daily routine 第一次成功自動 ship**：

| 日期           | 結果                                                            |
| -------------- | --------------------------------------------------------------- |
| 2026-05-25     | intake gap (design day)                                         |
| 2026-05-26     | 9/9 intake gap on media-richness → 哲宇 directive pipeline v1.1 |
| **2026-05-27** | **dual platform ship #97 + #98 success**                        |

v1.1 修補（iframe 降為 INFO + Stage 2.6 EVOLVE feedback loop）一個 cycle 後 instrument 化驗證成功。

## Handoff（給下一個 session）

### pending

- 雷亞遊戲 framing critical-balance review — carry-over from 5/26（§自主權邊界政治立場條款，哲宇拍板）
- 馬英九「清廉總統」framing vc=3 維持 — D+4 silence
- 半導體產業 D+2 9+ 技術 replies — 等 D+3-D+7 是否需 EVOLVE 補
- 許倬雲「七弟二姐 = 李建復」family-tree query carry-over D+4 — next maintainer 跨源 verify
- **#97/#98 台灣美食總覽 spore D+0 1h/3h/6h harvest** — 由下一輪 twmd-spore-harvest cron 自動撿（D+0 6h decision gate views < 500 → re-hook）

### routine timing anomaly continued

- 今日 cron fire 10:09 vs scheduled 10:00 — 約 9 min 延後但合理（vs 5/27 spore-harvest-am 09:19 vs 07:00 = 2.3hr delay）— **本 cycle delay 縮小**，無 LESSONS 觸發

### blocked

- P0 二二八事件 REACTIVE — routine 不適合 ship（高敏感度政治時機 + 兩岸資訊戰 framing 需 observer judgement）→ **defer to 哲宇 manual session**。下個觀察者來 chat 可考慮 prompt「228 spore 要不要本月內 ship？」

### Cross-session continuity

- SPORE-INBOX P1 哲宇 directive 累積 6 天未發案例：5/21 入庫 → 5/27 ship = **6 天 latency**（routine 5/25 + 5/26 intake gap 是延遲根因）
- v1.1 pipeline instrument 化（5/26 哲宇 directive → 5/27 first ship）= 1 cycle 驗證有效
- routine first dual-platform success 為「v3.8 default both」claim 提供首例 production evidence

## 配圖 + 工具觀察

- `make-spore.sh --prod` 用於舊文章（≥ 30 min 已 live）工作正常
- justfont 15s timeout fallback to jf-kamabit — render 完整可讀，但下次可考慮 `--no-font-wait` 降 latency
- 2160×2160 retina square 491KB 雙平台都顯示正常（X imageCount=5 imgs / Threads imageCount=5 cdninstagram thumbs）

🧬

---

_Routine cycle complete. Dual platform ship verified, SPORE-LOG 2 rows appended, SPORE-INBOX entry deleted, sporeLinks frontmatter written, working tree ready for commit + push origin main._
