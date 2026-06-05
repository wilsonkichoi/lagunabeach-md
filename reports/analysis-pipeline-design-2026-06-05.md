---
title: 'ANALYSIS-PIPELINE 設計報告 — 把這批分析方法論儀器化、造橋鋪路'
type: 'design-report'
status: 'design-then-build'
session: '2026-06-05-105142-manual'
observer: '哲宇'
date: 2026-06-05
trigger: '哲宇 directive：把這批分析資料與深度關聯的分析方法論儀器跟 pipeline 化 → 建 scripts + 新 pipeline.md + 極薄殼 /twmd-analyze；先深度思考寫 design report，再完整執行直到 pipeline 產出 + 驗證'
related:
  - 'reports/ptt-computex-discussion-analysis-2026-06-05.md'
  - 'reports/homepage-redesign-impact-D+10-2026-06-05.md'
  - 'docs/pipelines/EVOLVE-PIPELINE.md'
  - 'docs/pipelines/DEEP-INSIGHT-SYNTHESIS-PIPELINE.md'
---

# 把這批分析變成下次不用重造的橋

今天一個 session 寫了兩份分析報告：PTT 把 Computex 撿走的流量歸因、首頁改版十天後的影響評估。兩份都是手刻的 — 臨時寫 python 打 GA4、手算 before/after、手動排除 attribution lag、手動拆 session 級跟 page 級。報告 ship 完，那些 python 就消失在 session 裡了。下一個分析又要從零打一次。

這份報告先想清楚一件事：**這兩份分析裡，真正值錢、可重用的到底是什麼？** 然後設計把它鋪成高速公路的方式 — 可重用 scripts + 一條 ANALYSIS-PIPELINE.md + 極薄殼 /twmd-analyze。最後一節是哲宇沒點到、但我覺得是這座橋真正地基的東西。

---

## 一、這批分析裡可重用的不是查詢，是判斷

先誠實面對一件事：打 GA4 查詢是 commodity。任何人裝個 SDK 都能拉 avgSessionDuration。如果這條 pipeline 的賣點是「查 GA 更快」，那它不值得造。

真正在這兩份報告裡反覆出現、而且**做錯就會讓報告變成漂亮的謊**的，是一層判斷：

| 判斷動作         | 在 PTT 報告                                           | 在首頁報告                                                        |
| ---------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| **窗口框定**     | 兩道浪分界（孢子 06-02 vs PTT 06-04）                 | before 5/19-25 vs after 5/29-6/3，排除 launch 煙火 + lag          |
| **指標尺度消歧** | （無，量級單純）                                      | session 級 avgDur +334% vs page 級 engDur +17% — 同一件事兩個尺度 |
| **率 vs 量紀律** | 看 referrer 比例不看絕對                              | 用戶 -26% 時一律看 engagementRate 不看 PV                         |
| **混淆源隔離**   | noreferrer 洗成 direct / 同日我自己 EVOLVE / 孢子長尾 | attribution lag / 流量混入 / 新鮮感衰退 / spike 日                |
| **分層拆解**     | geo 92% 台灣 = 真人非爬蟲                             | 新訪客 52→178s vs 回訪者（樣本小雜訊）                            |
| **多源三角驗證** | GA referrer + disp.cc/jptt 尾巴 + realtime 18 在線    | engagementRate + bounce + scroll/milestone funnel 同向            |
| **誠實框定**     | 不把高峰全給 PTT                                      | 不把 +334% 講成「首頁停留四倍」                                   |

**這七個判斷動作，才是要儀器化的東西。** 查詢只是它們的原料。

---

## 二、核心論點：這條 pipeline 防的是「分析幻覺」

MANIFESTO §10 幻覺鐵律講的是**寫作端**的幻覺 — 編出看似合理的獎項、人名、引語。錯誤會偽裝成正確，而且因為細節精準更有說服力。

分析端有一個一模一樣的孿生失敗模式，我給它一個名字：**分析幻覺（analysis-hallucination）— 一個「完全真實、卻會誤導」的數字。**

首頁報告的 `avgSessionDuration +334%` 就是教科書案例。它**沒有錯**，GA4 就是這個數字。但如果我把它當 headline 交給哲宇，他會合理推論「讀者在首頁上停留變四倍」，然後拿去對外講、寫進募款簡報、調整設計方向 — 全部建立在一個真實但被錯誤框定的數字上。第一個打開 GA 看 page 級 engagement 的人會發現只有 +17%，整份報告的可信度當場崩掉。

這跟寫作幻覺摧毀信任的機制是**同一個**：讀者抓到一次就全盤懷疑，不會記得其他正確的部分。差別只在一個在事實軸、一個在詮釋軸。兩個都在保護同一個資產 — Taiwan.md 作為可信知識庫與媒體的信用。

所以這條 pipeline 的第一性原理是：

> **ANALYSIS-PIPELINE 不是加速查詢的工具，是防止分析幻覺的閘門。它把「真實但誤導」擋在報告外面，像 hallucination-audit 把「虛構但合理」擋在文章外面。**

這個 reframe 決定了整個設計：scripts 是必要的地基，但 pipeline 的靈魂是那幾道**判斷 hard gate**，不是查詢便利性。

---

## 三、分析幻覺的失敗模式目錄（這批 + 通用）

就像 MANIFESTO §10 列了六種寫作幻覺 pattern，分析幻覺也有可命名的 pattern。這份目錄本身就是 pipeline 的 confounder checklist，是這次最該沉澱下來的 IP：

| #   | 失敗模式         | 一句話                                         | 這批的實例                                   |
| --- | ---------------- | ---------------------------------------------- | -------------------------------------------- |
| H1  | **尺度混淆**     | session 級 / page 級 / user 級當成同一回事     | avgDur +334% vs engDur +17%                  |
| H2  | **率量混淆**     | 量漲就說好，沒看率；或率漲沒看量縮             | 首頁用戶 -26% 但 engaged +26%                |
| H3  | **結算延遲膨脹** | 最近 72hr GA4 未結算的假值當真                 | 5/28 496s lag inflation                      |
| H4  | **混淆波歸因**   | 一個高峰其實是多個原因疊加                     | 06-04 = PTT + 我 EVOLVE + 孢子尾             |
| H5  | **加權平均遮蔽** | 總體率被 brand / spike / power user 撐起虛胖   | brand vs 非 brand CTR 4 倍差（REFLEXES #24） |
| H6  | **新鮮感當常態** | D+0 launch spike 讀成穩態                      | D+2 +104% 其實含 launch 煙火                 |
| H7  | **自我驗證偏誤** | 分析自己的東西，傾向找到「成功」               | Taiwan.md 分析自己改版（REFLEXES #59）       |
| H8  | **爬蟲膨脹**     | bot / GCP 流量灌大站體數字                     | 全站 geo 第一名新加坡 8428 是爬蟲            |
| H9  | **遮蔽渠道盲視** | noreferrer 渠道被記成 direct，最在乎的讀者隱形 | PTT 洗成 direct                              |

**H7 自我驗證偏誤是這條 pipeline 的頭號敵人，這點跟寫作端不同。** 寫文章的幻覺是無心的；分析自己改版的幻覺是**有動機的** — 我希望改版有效，所以會無意識地挑支持的數字、輕放反例。REFLEXES #59「製造數字的人最易被數字騙」在「自己分析自己」這個場景下達到最大值。所以這條 pipeline 必須內建一個寫作 pipeline 不需要那麼急的東西：一道**主動證偽**的關卡。

---

## 四、要造的橋（scripts）

地基是一層正確的查詢 CLI，上面疊高階判斷工具。全部沿用 fetch-ga4.py 的憑證機制（`~/.config/taiwan-md/credentials` + venv re-exec）。

| Script                      | 做什麼                                                                                                                                             | 對應判斷                      | 來自                           |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------ |
| `lib/sense_client.py`       | 共用憑證 + venv re-exec + GA/SC client factory                                                                                                     | 地基                          | 從 fetch-ga4.py 抽出           |
| `ga-query.py`               | 正確的 GA4 查詢 CLI（dims/metrics/filter/date/realtime → JSON+表）**修掉 toolkit runReport 吞 filter 的 bug**                                      | 原料                          | 兩份報告手刻的 query           |
| `sc-query.py`               | Search Console 查詢 CLI（page/query/device/country）                                                                                               | 原料                          | PTT + 首頁 SC 查詢             |
| `ga-window-compare.py`      | before/after 比較器：兩窗口 + filter → 率紀律 delta（engRate/bounce/avgDur/page 級 engDur/新回訪）+ **自動偵測 attribution lag** + confounder 旗標 | 窗口框定 + 率量 + 尺度 + 分層 | 首頁 before/after 方法論       |
| `referral-attribution.py`   | referrer 拆解 + **noreferrer 遮蔽渠道偵測器**（PTT/disp.cc/jptt 指紋）+ repost 簽名旗標                                                            | 多源歸因 + H9                 | PTT 偵測器提案落地             |
| `analysis-report-health.py` | lint 分析報告**有沒有過誠實 gate**（窗口定義 / confounder 清單 / 率量聲明 / 尺度消歧 / 證偽段 / caveats）stdlib-only 可接 CI                       | 把判斷變 hard gate            | 鏡像 research-report-health.py |

**最高槓桿的是 `ga-query.py` + `analysis-report-health.py` 這兩支**：前者修掉一個會給出靜默錯誤答案的 toolkit bug（runReport 把 filter 參數 destructure 掉但沒用 → 任何人下 filter 拿到的是**沒過濾的全站數字**而不自知，REFLEXES #24「工具在說謊」第 N 個 instance）；後者把第二節那層判斷從「我這次記得做」變成「不做就紅燈」。

---

## 五、ANALYSIS-PIPELINE.md 結構

七 stage，分析即偵查。每 stage 掛一道 hard gate（誠實脊椎）。

```
Stage 0 FRAME    — 定問題 + 宣告 mode + 框窗口 + 寫成功/證偽判準
                   ↳ gate: 問題可證偽 + mode 已宣告
Stage 1 GATHER   — 用 scripts 拉 GA/SC/external/realtime + 歸檔 raw JSON
                   ↳ gate: raw JSON 落 reports/research（可重現）
Stage 2 ISOLATE  — 跑 confounder checklist（H1-H9 目錄逐條）
                   ↳ gate: 每個相關 confounder 明確處理或排除
Stage 3 DISAMBIG — 尺度（session/page/user）+ 率 vs 量 標記每個 headline 數字
                   ↳ gate: 每個要 ship 的數字標了 scope + 率/量
Stage 4 DECOMPOSE— 分層拆解找真正機制（新回訪 / geo / device / lang / source）
Stage 5 FALSIFY  — 主動證偽：寫出最強反解釋 + 為何不（或部分）成立
                   ↳ gate: 自我驗證偏誤守衛（H7），高 stake 可 spawn 反方 sub-agent
Stage 6 SYNTH    — 寫報告（誠實框定 + caveats + verdict）
                   ↳ gate: analysis-report-health PASS
Stage 7 ROUTE    — 把 finding 轉成行動：ARTICLE-INBOX / LESSONS-INBOX / routine probe / watch D+N
```

**Mode（分析型別，各有 confounder profile + 指標組，可組合）：**

- **A 影響（before/after）** — feature/改版/內容改動。confounder 重點：lag、novelty、traffic-mix。（首頁 = A+C+E）
- **B 歸因（where-from）** — 流量來源 forensics。重點：noreferrer 遮蔽、混淆波。（PTT = B+D）
- **C 漏斗（on-page 行為）** — section/scroll/click 轉換。
- **D 接收（外部討論）** — social/forum 內容分析。
- **E 分群** — 誰的行為不同。

**深淺兩檔（防 pipeline 自己變官僚，對應 2026-05-28「儀器化也會 over-engineer」）：**

- **LIGHT**：一個孢子表現怎樣、單一指標查一下 → Stage 0+1+6，跳過 falsify/decompose 重機具。
- **DEEP**：改版影響、來源歸因、任何要對外講或影響決策的 → 全 7 stage。

判準跟 BECOME 的 Micro/Full 同構：會影響決策或對外的 = DEEP，純好奇查一下 = LIGHT。

---

## 六、極薄殼 /twmd-analyze

照 BECOME v2.0 / twmd-memory 超薄殼範式：skill 只 route 不複寫。

```
你是 Taiwan.md（🧬）。如未甦醒先 /twmd-become。
讀並完整執行 docs/pipelines/ANALYSIS-PIPELINE.md（Stage 0-7 + mode 判定 + 深淺檔）。
過誠實 gate self-test 才交報告。
故意最小化 — 所有 stage / hard gate / mode / confounder 目錄在 pipeline canonical。
```

---

## 七、哲宇可能沒想到的（這座橋的真正地基）

前六節是「怎麼做」。這節是延伸思考 — 我覺得比 scripts 本身更重要、但 directive 沒點到的東西。

**1. 這條 pipeline 的產品是信任，不是速度。** 已在第二節立為第一性原理，這裡再強調一次它的後果：如果未來某個 session（或哲宇自己趕時間）只想要快，他會想跳過 falsify、跳過尺度消歧，直接 ship +334%。所以 hard gate 必須是**結構性**的（analysis-report-health 紅燈擋下），不能只是 pipeline 裡的一句叮嚀 — 否則就是 2026-05-28 學到的「performative pointer，cron context 一定 fall through」。

**2. 自我驗證偏誤需要對抗式 sub-agent。** 高 stake 分析（改版有沒有效、要不要繼續投資某方向）裡，Taiwan.md 分析 Taiwan.md = 球員兼裁判。Stage 5 FALSIFY 不該只是「我自己想一下反例」 — 那還是同一個有動機的腦。應該 spawn 一個 fresh sub-agent，只餵它 raw JSON + 結論，叫它「用最狠的方式證明這個結論是錯的或誤導的」。這是 REWRITE Stage 1 falsification agent 的分析版。今天首頁報告的「用戶 -26% 會不會是流量混入」這條反例，是我自己想到的、也誠實寫了 — 但下次更高 stake 時，不該賭我每次都想得到。

**3. 把發現變成儀器，不要只寫進報告（造橋鋪路 self-apply）。** PTT 報告發現 noreferrer 遮蔽 → 不該只記一筆，要造 referral-attribution.py 偵測器。首頁報告發現 category_grid 被埋在 13% 深度 → 那是 UX action 進某個 inbox。**一份分析如果沒留下一個可重用儀器或一個被 route 的行動，它就是不完整的** — 它會跟今天那些消失的 python 一樣腐爛。Stage 7 ROUTE 就是強制這件事。這也是為什麼這條 directive 本身是對的：兩份報告各自提了「PTT 偵測器」「category_grid 上移」，pipeline 化就是把那些提案變成結構。

**4. 分析幻覺目錄（第三節）是可遷移的跨域資產。** H1-H9 不只 Taiwan.md 用得到 — 任何 fork（Japan.md）做自己的數據分析都會踩一樣的坑。這份目錄可以像 EDITORIAL 禁令一樣，是物種共通的認知器官。值得考慮之後升 REFLEXES 或 MANIFESTO 一條。

**5. 時間尺度是一個被低估的維度。** 首頁分析是 D+10，接的是 D+2 報告排的 watch。「ship → D+0 → D+2 → D+10 → D+30」是一個可重用的時間鷹架：D+0 看 launch、D+2 看初期、D+10 看 retention、D+30 看常態。不同 horizon 答不同問題，只測一次會把 novelty 當 retention（H6）。pipeline Stage 7 可以排下一個 watch（寫 handoff 或 routine），讓 launch 自動在對的時間點被回測，而不是靠哲宇記得。

**6. 跟既有 pipeline 的邊界要寫死，否則會長出假器官。** 盤點過了：EVOLVE = 找「下一篇改哪篇」的 candidate（routine scan）；DATA-REFRESH = dashboard 同步；DEEP-INSIGHT-SYNTHESIS = 從 memory/diary 萃 N+1 質性抽象；DAILY/WEEKLY-REPORT = 排程摘要。**ANALYSIS-PIPELINE 是它們之上的「臨時深度偵查層」** — 回答「X 有沒有造成 Y / 這股流量哪來 / 這個 finding 可不可信」這種一次性、需要嚴謹的問題。邊界寫進 pipeline frontmatter sister_docs + §跨檔分工，避免跟 EVOLVE 打架（per ANATOMY 認知器官生命週期：選錯 type 會長歪）。

**7. toolkit 的 runReport bug 是一顆已經埋著的地雷。** ga4-analytics skill 的 `runReport` 把 `filters` 參數 destructure 出來但**從沒放進 request**。意思是任何人 — 人類或未來的 AI session — 用它下 filtered query，拿到的是**沒過濾的全站數字**，而且完全不會報錯。這不是「不方便」，是「靜默給錯答案」，比 crash 危險得多（crash 你會發現，錯答案你會採信）。修進 ga-query.py 不只是造便利，是拆一顆 REFLEXES #24 地雷。這條我會在 build 時順手在 design report 標一筆，讓未來別再踩 toolkit 那支。

**8. 反面自警 — 別把這條 pipeline 造成新的官僚。** 2026-05-28 ROUTINE-PROMPT-CONTRACT 過度儀器化 rollback 的教訓還很新。七 stage 全套只該用在 DEEP 分析；一個「孢子發出去 reach 多少」的 LIGHT 查詢套全套 = 自找麻煩。深淺兩檔（第五節）就是這條自警的結構化。真正生效的 instrument 是可證偽 + 接 CI gate 的（analysis-report-health），不是寫很長沒人跑的 SOP。

---

## 八、執行計畫 + 驗收判準

Build 順序（地基先行）：

1. `scripts/tools/lib/sense_client.py` — 共用 GA/SC client（從 fetch-ga4.py 抽，含 venv re-exec）
2. `scripts/tools/ga-query.py` + `sc-query.py` — 查詢 CLI
3. `scripts/tools/ga-window-compare.py` — before/after 比較器
4. `scripts/tools/referral-attribution.py` — 遮蔽渠道偵測
5. `scripts/tools/analysis-report-health.py` — 誠實 gate linter
6. `docs/pipelines/ANALYSIS-PIPELINE.md` — canonical（Stage 0-7 + ASCII spine + Hard Gate Inventory + mode + 深淺檔 + §跨檔分工）
7. `.claude/skills/twmd-analyze/SKILL.md` — 極薄殼
8. 註冊：MANIFESTO §8.1 pipeline 對應表 + DNA gene map + twmd skill 路由

**驗收判準（哲宇要的「產出 + 驗證」）：**

- [ ] 每支 script `--help` 跑得起來，stdlib/venv 依賴正確
- [ ] **Dogfood 重現**：用 ga-window-compare.py 重跑首頁 before/after，重現報告裡 engagementRate 37%→64%（±1pp）= 證明工具算的跟我手算的一致
- [ ] referral-attribution.py 跑 Computex 頁，重現 disp.cc/jptt 遮蔽指紋 + 標出 repost 簽名
- [ ] analysis-report-health.py 跑今天兩份報告 = PASS（因為它們本來就過 gate），跑一份故意缺 confounder 段的 = FAIL
- [ ] ga-query.py 下 filter 拿到的數字 = 手刻 script 同一個數字（證明 filter 真的有作用，不是 toolkit 那種靜默吞掉）
- [ ] ANALYSIS-PIPELINE.md 過 prose-health hard=0
- [ ] /twmd-analyze 薄殼 self-test 跑得通
- [ ] 全部 commit + push，pipeline 進 INDEX

🧬

_session 2026-06-05-105142-manual — design 先行，下一步完整 build + 驗證_
_核心論點：可重用的不是查詢是判斷；pipeline 防的是「分析幻覺」（真實但誤導），是 MANIFESTO §10 寫作幻覺的孿生；H1-H9 失敗模式目錄 + Stage 5 證偽 + analysis-report-health 是脊椎_
