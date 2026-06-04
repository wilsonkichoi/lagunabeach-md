---
session_id: '2026-06-04-200314-twmd-rewrite-daily'
date: 2026-06-04
type: 'routine-memory'
routine: 'twmd-rewrite-daily'
mode: 'Full (per routine STRICT BECOME GATE)'
fire_time: '~19:00 (cron 18:00 schedule + ~60 min agent fan-out wait)'
articles_shipped:
  - 'knowledge/Lifestyle/台灣醫療與全民健保.md (EVOLVE)'
commits:
  - 'd8473f1df research: 台灣醫療與全民健保 EVOLVE Stage 1 SSOT (96 搜尋 / 4-agent fanout)'
  - '49e065a4c rewrite: 台灣醫療與全民健保 EVOLVE — 99.6% 撐在 12.61% 之上的世界第一'
pushed: true
spore_shipped: false
spore_defer_reason: 'Gate 2.1 prose-health score 4 > ≤3 cap (borderline; 空洞詞 8 + lastHumanReview false + 破折號 13 共組成 score 4)'
---

# 2026-06-04 — twmd-rewrite-daily 18:00 fire / 台灣醫療與全民健保 EVOLVE

## Headline

twmd-rewrite-daily 18:00 routine 跑 v6.3 多 agent 編排（4 parallel research Sonnet + 1 media + 1 fresh Opus writer）將 lifestyle/台灣醫療與全民健保 從 1983 CJK 深 EVOLVE 為 6643 CJK / 42 footnote / 4 圖 + 1 iframe / 9 H2 scene-not-chronicle 文章。Title 從 STUB-TITLE「台灣醫療與全民健保」升級為冒號三明治「99.6% 撐在 12.61% 之上的世界第一」。10 條核心 falsification 全完成（含 IC 卡 Slovenia 早 3.5 年 / 五大皆空詞源是李玉春不是葉金川 / 「破產」是錯誤 framing / Reinhardt 自反美國複製 / 99.6% 合格人口 vs 全民）。Stage 4 hard gates 全過。SPORE chain Gate 2.1 borderline fail (prose-health score 4 > 3) → defer per cron fallback policy。

## Stage chain

### Stage 0 + 1: 觀點 + 取材 (orchestrator drafted §觀點 + 4-agent fanout)

主 session 略過 viewpoint Opus agent（budget），自己 draft §觀點成型 + spawn 4 parallel Sonnet research agents：

- §A 制度史 + 1995 改革（22 query）— 葉金川 / 楊志良 / Hsiao / 沈富雄 / 制度設計 single-payer 5 屬性
- §B 五大皆空 + 護理出走（30+ query）— 詞源是李玉春 / 監察院 2012 糾正案 / 護理 12.61% / 5 條反方論述
- §C 財務時鐘 + 部分負擔（19 query）— pay-as-you-go refute 破產 / 39.8% (主計總處) / 部分負擔反創新高
- §D 國際 + 學術 + 反方（24 query）— Numbeo perception / Bloomberg #14 / Hsiao Health Affairs (not Lancet) / Reinhardt 自反
- 媒體 manifest（12 query）— Wikimedia Commons 4 圖 + 健保署 30 週年紀錄片 iframe

Aggregate 96 query / 130 distinct sources / 70 zh / 35 en / 28 一手 / 12 反方。research-report-health.py PASS。

### Stage 2: WRITE — fresh Opus writer agent (blind to old article body)

只給 §6 clean fact-pack + §1 viewpoint + EDITORIAL（per v6.3 §多 agent 編排）。Writer 回 6643 CJK / 42 footnote / 9 H2 全 scene-not-chronicle。10 條 hard rules 全過。

### Stage 3: VERIFY (orchestrator spot-check)

- rewrite-stage-3-5 (footnote-format + footnote-density + correction-meta) hard=0 warn=0 ✅
- 10 條核心 quote Ctrl-F verbatim 驗證通過 (20 instances of 9 key quotes)
- prose-health score 4 (1 over ≤3 cap，warn-only — 不阻 Stage 3 commit gate)

### Stage 4: 形 + 媒體 cache

- rewrite-stage-4 9 plugin hard=0 warn=0 ✅
- 4 圖 cache (hero 459K / IC card 372K / 移動護理站 398K / 台大醫院 309K，全 aspect 護欄通過)
- 1 iframe 健保署 30 週年紀錄片 OAqQEHVO3a4 (官方頻道 @myegovnhi verified)

### Stage 5: 連 + ship

- 4 延伸閱讀 (醫療法 / 再生醫療 / 動物用藥 / 災難醫療)
- 醫療法 + 再生醫療雙向（再生醫療 broken link `/lifestyle/健保制度` heal → `/lifestyle/台灣醫療與全民健保`）
- 動物用藥 + 災難醫療 reverse cross-link DEFER (per Step 5.3 — siblings 缺延伸閱讀 section = 新增 section pre-existing tech debt > 1-row 修改 scope)
- sync.sh + 2 commit + push to main ✅

### Stage SPORE chain: DEFERRED

Gate 2.1 prose-health score 4 > ≤ 3 cap → skip ship per SPORE-PUBLISH-PIPELINE policy。spore candidate hook 候選最強：「葉金川自陳：『準備時間其實只有三天』」(1995 開辦反「世界第一」官方敘事)。等下次 spore-publish-daily routine pick 或哲宇 directive 重抽。

## 關鍵 falsification 戰果（給未來的我）

10 條核心 falsification 全部 carried into article（不是研究廢稿）：

1. **IC 卡「全球第一」refuted** — Slovenia 2000/9 nationwide smart card 比 Taiwan 2004 早 3.5 年（HIIS 自陳 "first country in the world" / PubMed 11187475）
2. **「五大皆空」詞源 refuted** — 不是葉金川或醫師公會，是陽明大學公衛教授李玉春 2009 年造「四大皆空」+ 媒體放大為「五大」
3. **「破產」是錯誤 framing** — pay-as-you-go 現收現付，沒破產概念。改用「安全準備金水位」
4. **2023 部分負擔改革效果反向** — 公視評估每人門診次數反創 4 年新高 14.3 次（policy 目標效果不存在）
5. **「歐巴馬學台灣」缺乏 government delegation 紀錄** — 改寫為「Taiwan 是美單一支付者倡議者最常引用的 case」+ Reinhardt + Cheng + Sanders 學術 + 政治引用鏈
6. **Numbeo Health Care Index** = user perception index (4,119 cities / 43.7k respondents) — 不是 institutional ranking
7. **Bloomberg Health-Care Efficiency Index** Taiwan 2018 = #14 不是 #9，2024 已停更
8. **Hsiao 2003 在 Health Affairs 22(3):77** 不是 Lancet（多年來常被誤引）
9. **Reinhardt 自反美國複製**：「I have not advocated the single-payer model here because our government is too corrupt」(設計者公開反對自己的設計被搬到美國)
10. **99.6% 覆蓋率是「合格人口」** — 失聯移工 / 黑戶嬰兒 / 海外停保族群在外

## Pattern-level 觀察（borderline diary 候選）

**「造詞者自反詞」是論述成熟度的指標**。健保這篇有三個 ironic 對照：

- 李玉春造「四大皆空」(2009) → 15 年後自己對《報導者》說「點值是現象解，不是根本解方」(2024)
- Reinhardt 1989 替台灣設計 single-payer NHI → 2017 過世前公開反對美國複製
- 楊志良 2010 推完二代健保下台 → 2011 年三讀後立刻自陳「補充保費是個錯誤」

三個案例堆疊在一篇文章裡是巧合，但「概念創造者自反」這個 pattern 不是 specific to 健保。當一個原本拉開警報的 framing 被它的創造者自己出來說「已經被誤用了」、「我並沒有主張這個」、「這是個錯誤」 — 那個 framing 進入 reflection 期。寫類似題目時，主動找這類 self-contradiction 可以拉開深度。

**未升級為 diary**（per DIARY-PIPELINE 門檻：需「跨日反覆浮現」或「session 結束時想說的話超越本次工作描述」）。當前是 single-session 觀察，等下次重複 instance 再考慮 promote。

## Handoff 三態

繼承上 session（2026-06-04 17:41 manual）：

- [x] ~~TASA NEW ship + sibling 反向 cross-link~~ 已 ship (a7dd61cd4 + a8b3ce931)
- [ ] sibling `台灣太空產業發展` 太空三期數字過時 — 仍 pending，待哲宇起 worktree
- [ ] 國家太空中心可發孢子 — 仍 defer 哲宇 directive

本 session 新 handoff：

- [ ] 台灣醫療與全民健保 spore 候選：「葉金川『準備時間其實只有三天』反『世界第一』官方敘事」— Gate 2.1 borderline pass 時 spore-publish-daily 自動 pick
- [ ] 動物用藥 + 災難醫療 siblings 缺延伸閱讀 section → 若有未來 EVOLVE 機會補 reverse cross-link
- [ ] 健保 article prose-health score 4（border over 3）— 13 破折號可進一步精簡（次要 polish 機會，非 hard fail）
- [ ] 「造詞者自反詞」pattern 觀察存放於本 memory，下次 instance 出現時可升 diary 或 LESSONS-INBOX

## Beat 5 — 反芻

未另寫 diary。Pattern-level 觀察已 in-memory。Multi-agent 編排這次工作得很順 — 4 parallel research agent 把 80+ aggregate 搜尋拿下來，fresh Opus writer 用 clean fact-pack 寫出 6643 字沒杜撰、scene-not-chronicle 結構成熟。唯一 friction 是 rationale 4 keys 名稱（why_hook vs why_this_hook 等）writer agent 用了錯的版本，pre-commit 卡了 1 commit attempt — 這個應該升 SPORE-WRITER prompt 範本 default key 名稱 canonical。

🧬

---

_v1.0 | 2026-06-04 20:03 +0800_
_session twmd-rewrite-daily 18:00 fire — 健保 EVOLVE 完整 cycle (article shipped + spore deferred)_
_誕生原因：cron routine fire + v6.3 multi-agent orchestration + 10 falsification carried into article_
_核心洞察：(1) 4 parallel research agent 在 80+ aggregate search 上 reliable (2) 「造詞者自反詞」(李玉春 + Reinhardt + 楊志良 三 ironic 對照) 是論述成熟度的 pattern (3) fresh writer + clean fact-pack + rationale key naming 是下次 prompt 範本要補的細節_
_LESSONS-INBOX 候選：rationale frontmatter 4 canonical keys (why_this_hook / whats_excluded / where_it_hedges / whos_pushing_back) 應寫進 writer agent prompt 範本 default — 這次 writer 用 (why_hook / where_hedges / whos_pushback) 導致 pre-commit hard=3 attempts 重試_
