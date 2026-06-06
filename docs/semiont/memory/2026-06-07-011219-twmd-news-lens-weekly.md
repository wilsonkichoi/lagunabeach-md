---
session_id: '2026-06-07-011219-twmd-news-lens-weekly'
date: 2026-06-07
type: 'routine-memory'
routine: 'twmd-news-lens-weekly'
mode: 'full'
pipeline: 'EVOLVE-PIPELINE v3.5 + §news-lens-spore-output v2.5'
---

# 2026-06-07 01:12 — twmd-news-lens-weekly (week 2026-W23)

## BECOME ACK

- **Mode**: full（routine 強制升 Full per BECOME §Step 0）
- **8 organ snapshot**: 🫀90↑ 🛡️27→ 🧬95↑ 🦴90→ 🫁85→ 🧫100↑ 👁️90→ 🌐93↑ (consciousness-snapshot.sh 即時讀；🛡️27 是 stale snapshot，data-refresh-pm 14/14 PASS 後 fresh = immune AM 61 → PM 58)
- **vitals**: articles=778 / contributors=63 / 7d=+50 / 30d=+204 / human-reviewed=26.9%
- **i18n**: en=795 ja=784 ko=779 es=776 fr=796
- **inbox**: LESSONS 未消化 216 / ARTICLE pending 79 / SPORE pending 25
- **Q1-Q14 self-test**: ALL PASS（Full mode 14/14）
- **觀察者**: cron routine `twmd-news-lens-weekly` Sunday 01:00（無 in-loop 觀察者）

## 三源 signal 交叉（DNA #4，至少 2 源確認才升 candidate）

| Source | Window           | Signal 摘要                                                                                                                                                                                                                                 |
| ------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GA4    | 7d topArticles   | Computex 1559v / 我是OO人 483v / OCF 343v / TASA 197v / 天燈 136v / 黑冠麻鷺 111v / 張懸與安溥 96v / 雷亞 83v / 颱風 64v / 邦交國 58v / 漫遊錄 46v / 美食總覽 44v / 道德課 35v / 楊致遠 31v / 魏哲家 30v / 阿神 29v / 搖滾史 28v / 藍鵲 26v |
| GA4    | 30d topPages     | 漫遊錄 1749v = top non-homepage / Computex 1559v / 雷亞 1334v / 我是OO人 483v / 大宇雙劍 447v / 蘋果西打 295v                                                                                                                               |
| SC     | 7d topQueries    | taiwan md 37c / 大陸用語轉換器 20c / 焦安溥 264imp pos 10.17 / 張懸 463imp pos 10.78 / 阿神本名 191imp pos 3.48 / computex 657imp pos 1.33 / 三大電腦展 cluster 141imp                                                                      |
| SC     | 7d opportunities | 台灣藍鵲 292imp 0c pos 1.81 / BIM EN 442imp 0c / 台灣日治時期 143imp / howhow 99imp / taiwan diplomatic allies 2026 cluster 137imp 0c                                                                                                       |
| CF     | 7d AI crawlers   | ChatGPT-User 12896 / FacebookBot 10760 / BingBot 10602 / Googlebot 7248 / PetalBot 6704 — 高度 AI ingest 活動                                                                                                                               |
| CF     | 7d traffic       | TW 156995 / US 91421 / SG 31938 / CN 23325 / JP 12074                                                                                                                                                                                       |

**雙源+ 確認 candidate pool**：張懸與安溥（GA+SC）/ 邦交國（GA+SC EN）/ 阿神（GA+SC）/ 魏哲家（GA + 半導體 current events）/ 漫遊錄（GA 30d top + Booker arc）/ 楊致遠（GA 7d viral + GA 30d top 15）

**排除（recency gate < 14 day）**：Computex（6/1+6/3 ship）/ 雷亞（5/25+5/26）/ 颱風（6/3）/ 我是OO人（6/5）/ OCF（6/3）/ 國宅（6/6）

**已 cover in pending**（skip）：TASA / 天燈 / 黑冠麻鷺 / 藍鵲 / 李國修 / 洪醒夫 / BIM / 搖滾大稻埕 / 西門町等

## 6 news-driven candidates appended SPORE-INBOX §Pending

| #   | 主題                 | Source-Mode      | 敏感度 | Multi-source 驗證                             |
| --- | -------------------- | ---------------- | ------ | --------------------------------------------- |
| 1   | 張懸與安溥           | EXISTING-ARTICLE | 中     | GA 7d 96v + SC 焦安溥 264imp + SC 張懸 463imp |
| 2   | 台灣邦交國與國際外交 | REACTIVE         | 高     | GA 7d 58v + SC EN 3-query cluster 137imp      |
| 3   | 阿神                 | EXISTING-ARTICLE | 低     | GA 7d 29v + SC 阿神本名 191imp pos 3.48       |
| 4   | 魏哲家               | EXISTING-ARTICLE | 中     | GA 7d 30v + TSMC current events 持續發酵      |
| 5   | 楊致遠               | EXISTING-ARTICLE | 低     | GA 7d 31v + GA 30d top 15 + 從未 spore'd      |
| 6   | 臺灣漫遊錄           | EXISTING-ARTICLE | 低     | GA 30d 1749v = top non-homepage + Booker arc  |

**Category 分布**：Music(1) / Society(1) / People(3) / Art(1) — People 略偏重但 SC demand 集中在人物。

**Limit 7/week**: 6 entries 在 5-7 範圍。

**高敏感 candidate frame 規則**（#2 邦交國）：REACTIVE + 三數字並列 (12+113+177) 不喊 isolation narrative、不選邊兩岸主動。

## Quality gate check

- ✅ SPORE-INBOX 新增 6 news-driven candidates（5-7 範圍）
- ✅ 每 entry 含 GA / SC / CF pointer（transparency in Notes）
- ✅ 高敏感 candidate (#2 邦交國) REACTIVE + frame 規則明示
- ✅ Entries 跨多 category（Music/Society/People/Art）
- ✅ 全部 Article-Path 驗證存在（`test -f` 6/6 PASS）
- ✅ 全部 hook anchor ≥ 2 跨 ≥ 2 起手式
- ✅ 跟既有 25 pending 無重複（手動 cross-check entries 標題）
- ✅ Recency gate（≥ 14 day SPORE-LOG）— Computex/雷亞/颱風/我是OO人/OCF/國宅 已 exclude

## Handoff 三態

**Pending**:

- 6 news-lens P1 candidates 待 Stage 1 PICK 抽走 ship（per SPORE-INBOX Routine intake 協調規則：daily routine 看到 P1 ≥ 3 → throttle 自己 propose 數量）
- daily `twmd-spore-pick-daily` 下次 08:00 fire 時應只 propose 0-1 P2（因為本 batch 6 P1）

**Blocked**: 無

**Retired**: 無（純 append routine）

## Beat 5 — 反芻

第二週 news-lens 跑下來，有兩件事值得記：

**1. SC EN demand 浮現結構性缺口** — taiwan diplomatic allies 2026 cluster 137imp 0 click 是這週最沉默的訊號：英文世界 137 個人主動找台灣 2026 邦交清單，全部停在第 7-10 頁。我們有那篇文章而且資訊是 2026 update 的，但 SERP 完全沒接到。SC 缺口不是「沒寫」，是「寫了被 Wikipedia 截走」。spore push 社群比 SEO 重寫快 — 把 article 直接送到讀者面前繞過 Google。

**2. GA 30d top non-homepage 是漫遊錄 1749v** — 比 Computex 還高。一本 2024 Booker 翻譯小說的 30 day 數據贏過剛開完的科技展。內容半衰期測試：時事 spike 高但衰減快，文學作品 baseline 低但穩態高。這對 routine 排程啟示是 — 趁熱（時事）+ 趁穩（文學/歷史 sustained）兩種模式都該入 SPORE-INBOX，不能只追 spike。

`twmd-spore-pick-daily` 接班規則明確：看到本 batch 6 P1 後 throttle，週一 08:00 應該只補 0-1 P2。week 2026-W23 的 spore intake 預期分布：news-lens 6 + 哲宇 directive 不定 + daily routine 0-7 = total 6-13/week。

## Pipeline 自評

- **Stage 1 Universal core**: 全跑 ✅（consciousness-snapshot + routine-status fail（exit 1 — 但其他源仍有 signal）+ inbox-signal + 48hr git log + MEMORY tail + contributor profile + handoff grep — latest memory 2026-06-06-231032）
- **Stage 2 三源交叉**: GA + SC + CF 全 200 ✅
- **Stage 3 candidate triage**: 6 entries 雙源確認 ✅
- **Stage 4 ENRICH + APPEND**: 每 entry GA/SC pointer + hook 候選 + 必驗事實 ✅
- **Stage 5 收官**: 本檔 + git commit + push origin main

## 教訓 candidate (待 distill 評估)

**`routine-status.sh` 連續 exit 1** — 第二次 cycle 確認 routine-status.sh 退出非零（這次跟昨夜 data-refresh-pm session 報的「snapshot.sh stale gap 連續 2 cycle 確認」相關）。Universal core §1.4 還能 fall through（其他 signal 源夠），但 routine 狀態不可見 = 跨 cycle 看不到「上次 fire 結果」。如果第三次仍 exit 1 → LESSONS-INBOX append + spawn fix chip。

---

_routine memory by twmd-news-lens-weekly v2.5 / EVOLVE-PIPELINE v3.5 §news-lens-spore-output_
