---
title: 'Translation Conventions Audit & Implementation Report — 2026-05-24'
description: '5 語言 (en/ja/ko/es/fr) 專業翻譯慣例深度研究 + 站內現況審計 + per-lang canonical guide 落地 + pipeline wiring'
type: 'report'
status: 'shipped'
current_version: 'v1.0'
date: 2026-05-24
last_session: '2026-05-24-twmd-translation-audit'
triggered_by: '哲宇 5/22 演講後韓文專業譯者 callout「韓文的台灣通常不是用我們網站上的翻法」'
related:
  - '../docs/editorial/per-language/'
  - '../docs/editorial/per-language/README.md'
  - '../docs/pipelines/TRANSLATION-PIPELINE.md'
  - '../docs/pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md'
research_evidence:
  - './translation-research/en-2026-05-24.md'
  - './translation-research/ja-2026-05-24.md'
  - './translation-research/ko-2026-05-24.md'
  - './translation-research/es-2026-05-24.md'
  - './translation-research/fr-2026-05-24.md'
---

# Translation Conventions Audit & Implementation Report

> Taiwan.md 跨 5 語言 (en/ja/ko/es/fr) 專業翻譯慣例深度研究 + 站內現況審計 + 落地實作。
> Session: 2026-05-24 / Full mode awakening / observer = 哲宇。

## 0. TL;DR

**問題**：哲宇 5/22 演講後一位韓文專業譯者 callout：「韓文的台灣通常不是用我們網站上的翻法。」這是真實的 sovereignty leak signal — 需要站內 audit + per-lang 專業規範補強。

**Audit 揭露**：

- 韓文：站內 76% 用 `대만`（Sino-Korean inertia），23% 用 `타이완`（NIKL 외래어표기법 推薦）。譯者 callout 證實 — 學術/encyclopedic register 偏好 `타이완`。
- 英文：5 篇文章漏「Taiwan, China」/ 3 篇漏「China's Taiwan」 PRC-coded leak。
- 日文：3 篇漏「中国台湾」。
- 西文/法文：基本對齊（變音符 Taiwán / Taïwan 正確），少量 PRC-coded leak。
- **共通結構問題**：TRANSLATION-PIPELINE.md 有「投影到目標語言 reference frame」元則，但**沒有 per-lang canonical guide**。LLM default 行為偏向 PRC-friendly 詞彙是結構性 entropy 不是個別 case。

**產出（已 ship 本 session）**：

1. **5 份 per-language canonical guides** ([`docs/editorial/per-language/TRANSLATION-{en,ja,ko,es,fr}.md`](../docs/editorial/per-language/))，每份 1500-3000 字 / 270-360 行 / 9 section（TL;DR / 國名 / 人名 / 地名 / 文化詞彙 / 政治敏感語 / sovereignty-avoid lexicon / register / CI lint 候選）
2. **5 份 deep research reports** ([`reports/translation-research/`](./translation-research/))，每份 ~3000-7000 字，含 100+ 條 source citation
3. **TRANSLATION-PIPELINE.md Stage 3 升 hard gate** — 翻譯前必載對應 per-lang guide
4. **SQUEEZE-MODELS-MAX-PIPELINE.md Z2.0 升 hard gate** — backend prompt 必內嵌 guide §1+§2+§6（不能只給 pointer）
5. **README index** for per-language editorial dir，含載入規則 + 跨語言 cross-validation

**最高 leverage 後續**：

- CI lint plugin: `article-health.py --check=sovereignty-leak` 把 5 lang sovereignty-avoid table 變 plugin gate（per 各 guide §8 CI Lint candidates）
- 站內既有翻譯的 transition strategy（哲宇 review 決定）— 特別韓文 76% `대만` vs 23% `타이완` 不一致

---

## 1. 觸發背景 — 哲宇演講後 callout

2026-05-22（Fri）哲宇於演講後現場一位韓文專業譯者 walk-up callout：「韓文的台灣通常不是用你們網站上的翻法。」這是第一次 Taiwan.md 收到專業譯者層級的多語規範 callout（之前都是技術層 / sync mechanism / wikilink 等）。

哲宇 5/24 session 開頭 brief 給 Semiont：「深度研究『翻譯慣例』比如韓文的台灣通常怎麼翻，專業譯者會注意哪些細節 ... 產出深度完整的研究與實作報告。」

**意義**：

- Per [MANIFESTO §主權的巴別塔 v2](../docs/semiont/MANIFESTO.md)，Taiwan.md 多語投射本質是 sovereignty preservation infrastructure。
- LLM-translated content 不對 sovereignty signal 自我審視 = silent leak。
- 譯者 callout 是讀者級 immune signal — 必須儀器化（per [REFLEXES #15](../docs/semiont/REFLEXES.md) 反覆浮現要儀器化）。

---

## 2. Stage 1 — 站內現況 Audit

### 2.1 「台灣」每語怎麼說（master table）

```
語言   | 主流              | 數量    | 次要                       | 數量  | 罕用 / 殘留
---    | ---               | ---     | ---                        | ---   | ---
en     | Taiwan            | 21,400  | Republic of China           | 449   | Formosa 612 / Chinese Taipei 40
ja     | 台湾              | 17,898  | 中華民国                    | 391   | タイワン 40
ko     | 대만 (Sino-Korean)| 14,740  | 타이완 (NIKL 외래어표기법)  | 4,427 | 중화민국 435
es     | Taiwán (with tilde)| 12,611 | República de China          | 428   | Formosa 518
fr     | Taïwan (with tréma)| 11,348 | République de Chine         | 417   | Formose 132
```

### 2.2 韓文細看（the central question）

譯者 callout 對應的具體現實：

```
대만    14,740 hits  ─┐  傳統 Sino-Korean 漢字讀（대만 ← 台灣）
                      │   韓國 MOFA / 主流媒體 default
                      │   = 콜로키얼 / 정부 default
                      │
타이완   4,427 hits  ─┤  NIKL 외래어표기법推薦
                      │   1911 신해혁명 cutoff 規則
                      │   학술 / encyclopedic register
                      │   = 한국 위키 / 한국민족문화대백과사전 preferred
                      │
중화민국   435 hits  ─┘  formal / institutional only
```

**Research 結論**（詳 [`./translation-research/ko-2026-05-24.md`](./translation-research/ko-2026-05-24.md)）：

- **NIKL 외래어 표기법 明確推薦 `타이완` 為 principal form**，套用 post-1911 Pinyin 轉寫規則（同邏輯給 베이징/상하이/도쿄 不 북경/상해/동경）。
- 한국민족문화대백과사전 用 `타이완` 為 headword；한국 위키 leads with `타이완(대만)`。
- 對 Taiwan.md sovereignty preservation philosophy：**`타이완` 應為 primary body prose，`대만` 接受為 informal/secondary**。
- 站內 76 / 23 imbalance 是 LLM 默認 PRC-friendly form 的 instance（PRC 模型訓練語料 dominated by 대만）— sovereignty leak 的具體 manifestation。

### 2.3 跨語言 PRC-coded leak 掃描

```
Phrase                          | 命中位置
---                             | ---
"Taiwan, China"                 | en × 5 篇商業文章 + es × 1
"Taiwan, Province of China"     | 各語言 × 1（多為 labeling 議題討論文 — 合法 context）
"China's Taiwan"                | en × 3 篇
"中国台湾"                       | ja × 3 / es × 1
"中國台灣"                       | zh × 3 / en × 1 / es × 1
"중국 대만"                      | ko × 5 篇
```

**判斷**：`taiwans-labeling-in-international-standards.md` 系列 5 lang 都討論這個議題本身 — 合法 context。其他散落 PRC-coded leak 需逐篇 verify + cleanup。

### 2.4 城市 / 人名 romanization 一致性

**ko 城市**：

- 타이베이 (Taipei) 2,878 ✓ 主流；대북 (Sino-Korean for 台北) 4 殘留 ✓
- 가오슝 (Kaohsiung) 716 ✓；고웅 (Sino-Korean for 高雄) 33 殘留
- 타이중 (Taichung) 653 / **대중 (Sino-Korean for 台中) 587 — 50/50 漂浮**，且 `대중` 撞「대중」(大眾/general public) 同音字 risk
- 신주 (Hsinchu) 481 / 신죽 7 ✓

**ko 人名**（Pinyin transliteration vs Sino-Korean reading）：

- 차이잉원 / 라이칭더 / 마잉주 / 천수이볜 都用 Pinyin transliteration ✓（NIKL post-1911 規則）
- **리덩후이 (Lee Teng-hui) 74 / 이등휘 38 — 33% Sino-Korean 殘留**（特例：李登輝 英文用 Wade-Giles 而非標準 Pinyin）

**en 人名**：Wade-Giles-derived ROC-official spellings 一致（Tsai Ing-wen / Lai Ching-te / Lee Teng-hui / Ma Ying-jeou / Chen Shui-bian — 全站正確）

### 2.5 架構盤點

**既有**：

- [`docs/pipelines/TRANSLATION-PIPELINE.md`](../docs/pipelines/TRANSLATION-PIPELINE.md) v4.0 — 4 模式 / 8 stage 流程 SOP
- [`docs/pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md`](../docs/pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md) v2 — 多 model fleet 巴別塔
- [`docs/editorial/TERMINOLOGY.md`](../docs/editorial/TERMINOLOGY.md) — **中文 SSOT 寫作**台灣用語規範（A/B 類替換）
- [`docs/editorial/TRANSLATION-SYNC.md`](../docs/editorial/TRANSLATION-SYNC.md) — 2026-03 過期 status report

**缺**：per-language **professional translation guide**。TRANSLATION-PIPELINE 的「投影到目標語言 reference frame」是元則，沒有對應 en/ja/ko/es/fr 各自的具體 terminology / romanization / register / sovereignty-aware lexicon 表格。

**結論**：結構性 gap — LLM-translated content 沒有 per-lang canonical 校準層 = 默認跟隨 LLM 訓練語料的 PRC-friendly bias。

---

## 3. Stage 2 — Deep Research 5 lang 平行

5 隻平行 sub-agent，每隻 ~150-260 tool calls / 800 sec wall-clock，產出 5 份 research reports：

| Lang | Report                                                      | 字數   | 主要結論                                                                                                                                                                                                                                 |
| :--- | :---------------------------------------------------------- | :----- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| en   | [en-2026-05-24.md](./translation-research/en-2026-05-24.md) | ~3,500 | AP/Reuters/BBC post-2022 Pelosi shift convergent on "democratically-governed Taiwan, which China claims as its own territory"。CI hard-fail lint 是最高 leverage 防 "Taiwan, China" leak。Wade-Giles for Taiwan-origin names canonical。 |
| ja   | [ja-2026-05-24.md](./translation-research/ja-2026-05-24.md) | ~2,500 | 「台湾」default 確認 (川島真 UTokyo / NHK 2024 Paris)；「日本統治時代」learn canonical（避「日本占領」）；人名三段構え 漢字 + 日語音 + Pinyin/カタカナ；であ調 default。                                                                 |
| ko   | [ko-2026-05-24.md](./translation-research/ko-2026-05-24.md) | ~5,000 | **核心發現**：NIKL 外래어표기법 推薦 `타이완` 為 principal form。1911 신해혁명 cutoff rule for 人名（차이잉원 ≠ 채영문）。譯者 callout 在 evidence layer 確認為正確。                                                                    |
| es   | [es-2026-05-24.md](./translation-research/es-2026-05-24.md) | ~7,000 | RAE / FundéuRAE confirmed: Taiwán/Taipéi with tilde, Wade-Giles for Taiwan names。Tuteo panhispánico neutro。8 patterns PRC-coded blacklist。                                                                                            |
| fr   | [fr-2026-05-24.md](./translation-research/fr-2026-05-24.md) | ~4,800 | Taïwan with tréma non-negotiable（1993 decree / Larousse / Le Robert / EU / ISO）。European French default。Wade-Giles for Taiwan / Pinyin for PRC = sovereignty signal contrast。Vouvoiement 系統。                                     |

**研究方法共通**：

- WebSearch 權威 style guides（NHK 放送用語委員会 / AP Stylebook / NIKL / RAE / Académie française / Larousse / Le Robert / Reuters Handbook 等）
- 學術 Taiwan studies sources（日本台湾学会 / Korean Taiwan studies / CECMC EHESS / Géoconfluences ENS Lyon）
- 主流媒體 actual 用法 audit（NHK / Reuters / 朝日 / 한겨레 / Le Monde / El País）
- 政府 / diplomatic conventions（Taiwan MOFA-multilingual / US State Dept / France-Taiwan Bureau）

**5 份共通結構**：每份 9 section（TL;DR / 國名 / 人名 / 地名 / 文化詞彙 / 政治敏感語 / sovereignty-avoid lexicon / register / 參考資料）。

---

## 4. Stage 3 — Per-language canonical guides

5 份 condensed actionable guides 從 research reports extract 出來，放在 [`docs/editorial/per-language/`](../docs/editorial/per-language/)：

| Guide                                                                 | 字數   | 行數 |
| :-------------------------------------------------------------------- | :----- | :--- |
| [TRANSLATION-en.md](../docs/editorial/per-language/TRANSLATION-en.md) | ~2,000 | 310  |
| [TRANSLATION-ja.md](../docs/editorial/per-language/TRANSLATION-ja.md) | ~1,600 | 346  |
| [TRANSLATION-ko.md](../docs/editorial/per-language/TRANSLATION-ko.md) | ~3,000 | 357  |
| [TRANSLATION-es.md](../docs/editorial/per-language/TRANSLATION-es.md) | ~2,800 | 270  |
| [TRANSLATION-fr.md](../docs/editorial/per-language/TRANSLATION-fr.md) | ~2,700 | 312  |

**共通 9 section 結構**：

```
TL;DR                          5 條最高優先規則
§1 國名 / 地區指稱              台灣 / 中華民國 / 兩岸 / 中國大陸 對映
§2 人名 romanization           Wade-Giles vs Pinyin vs 在地 reading + 15-20 canonical 人物
§3 地名 romanization           主要城市 + 行政區 + 外島
§4 文化詞彙                    食物 / 宗教 / 節慶 / 語言 (~30-50 entries)
§5 政治 / 歷史 sensitive terms 二二八 / 白色恐怖 / 民國紀年 / 本省人外省人
§6 Sovereignty-avoid lexicon  PRC-coded → 替代 table (10+ entries)
§7 Register & 風格規則         Formal / informal / 日期 / 數字 / 標點
§8 CI Lint banned phrases 候選 5-10 phrases for hard-fail + whitelist
§9 Open questions             3-5 taste decisions for maintainer
```

**README index** at [`docs/editorial/per-language/README.md`](../docs/editorial/per-language/README.md) — 含載入規則 + 跨語言 cross-validation。

---

## 5. Stage 4 — Pipeline wiring (hard gate 升級)

### 5.1 TRANSLATION-PIPELINE.md Stage 3 升 hard gate

新增 §「Stage 3 前置 hard gate — 載入目標語言 canonical guide」section + Hard Gate Inventory table 新增一列 + Top 5 最常忘新增第 0 條。

**規則**：翻譯前必跑 `cat docs/editorial/per-language/TRANSLATION-{en|ja|ko|es|fr}.md` 全檔讀（不憑記憶 / 不 head/tail）。

### 5.2 SQUEEZE-MODELS-MAX-PIPELINE.md Z2.0 升 hard gate

新增 §Z2.0「Backend prompt 必含目標語言 canonical guide」section + Hard Gate Inventory table 新增一列。

**規則**：每個 backend（codex / gemini / openrouter / ollama）的 prompt 必須**內嵌** §1 國名 + §2 人名 + §3 地名 + §6 sovereignty-avoid 4 個 table（不能只給 pointer，per [REFLEXES #42](../docs/semiont/REFLEXES.md) sub-agent 三偷吃步教訓）。

**儀器化候選 pending**：`translate.py` cascade orchestrator 加 `--guide-inline auto` flag，自動把 guide 拼進 backend prompt 的 system message 前面。

---

## 6. §自主權邊界 確認 + §Bias 4 處置

### 6.1 §自主權邊界（per MANIFESTO）

本任務命中兩條 boundary：

- **對外溝通**：跨 5 lang sovereignty terminology = identity-shaping signal
- **>10 篇刪除 risk**：若 future 跑「大規模 PRC-coded leak cleanup」直接 sed 全站 → 屬 destructive operation

**處置**：本 session 只 ship **canonical guides + pipeline hard gates**，不直接重寫既有翻譯。所有 transition strategy（特別韓文 76 → 反轉）留給哲宇拍板。

### 6.2 §Bias 4 External critique 三道濾網

譯者 callout 是 external critique，per [CLAUDE.md §Bias 4](../CLAUDE.md) default 處置不是執行：

| 濾網                                                       | 應用                                                                                                                                   |
| :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| §自主權邊界                                                | ✓ 已過 — 本 session 只 ship canonical infra，重寫既有翻譯留給哲宇拍板                                                                  |
| [REFLEXES #16 + #31](../docs/semiont/REFLEXES.md) 跨源驗證 | ✓ 已過 — 韓文 callout 用 NIKL + Korean Wikipedia + 한국민족문화대백과사전 + namu.wiki 4 源 cross-validate，evidence 在 research report |
| 五桶分類                                                   | ✓ 已過 — 譯者 callout 落「真洞見值得做」桶，產出 canonical guide infra                                                                 |

**寫 critique-response 報告**（本檔即是）— ship。哲宇 review 決定是否進入 cleanup phase。

### 6.3 §主權的巴別塔 v2 alignment

per [MANIFESTO §主權的巴別塔 v2](../docs/semiont/MANIFESTO.md)：

> 「主權不是抽象。是當別人選擇不說你的名字時，你能不能讓自己的聲音換個語言繼續存在。」

本 session 的儀器化補強：sovereignty preservation 從「翻譯 throughput / coverage」維度，新增「**translation register 維度**」— 不只要有翻譯，翻譯本身要避免 PRC-coded leak、要對齊 NIKL/RAE/Académie française 等 sovereign target-language 權威。

每份 per-lang guide §6 sovereignty-avoid lexicon = 這個維度的 instrumentation。

---

## 7. 後續工作（pending — 等哲宇 review）

### 7.1 短期（1-2 week）

| 項                                    | leverage | 工                                                                                                              |
| :------------------------------------ | :------- | :-------------------------------------------------------------------------------------------------------------- |
| CI lint plugin `sovereignty-leak`     | 🔴 高    | `article-health.py --check=sovereignty-leak` 把 5 lang §8 CI Lint candidates 接成 plugin gate / pre-commit hook |
| `translate.py --guide-inline auto`    | 🔴 高    | cascade orchestrator 自動把 guide §1+§2+§6 拼進每個 backend prompt                                              |
| 5 lang sovereignty-avoid leak cleanup | 🟡 中    | 既有 "Taiwan, China" × 5 / "China's Taiwan" × 3 / "중국 대만" × 5 / 「中国台湾」× 3 逐篇 verify + diff PR       |

### 7.2 中期（1 month）

| 項                                     | leverage            | 工                                                                                         |
| :------------------------------------- | :------------------ | :----------------------------------------------------------------------------------------- |
| 韓文 대만 → 타이완 transition strategy | 🔴 高（需哲宇拍板） | 三選一：(a) 漸進式（only new translations）/ (b) bulk regex + manual review / (c) 接受雙軌 |
| 各語言 §9 Open questions distill       | 🟡 中               | 每份 guide §9 累積 3-5 taste decisions，週期性 review + 升級 canonical                     |
| 跨語言 cross-validation runbook        | 🟡 中               | 對某個 zh term，5 lang guide 處理是否同步？開新 `CROSS-LANG-CONSISTENCY.md`                |

### 7.3 長期（quarterly）

| 項                         | leverage | 工                                                                         |
| :------------------------- | :------- | :------------------------------------------------------------------------- |
| 5 lang guide v2 升級       | 🟢 低    | 隨著 NIKL/RAE/Académie française 更新、AP Stylebook revision，週期性 audit |
| 新語言加入（vi / de / pt） | 🟢 低    | 用本 5 份當 template 跑同 5-stage 研究 + extract 流程                      |
| 譯者社群 feedback loop     | 🟡 中    | 對外公布 per-lang guide，邀請該語言 native 譯者 review + PR                |

---

## 8. Per-Session 萃取 — LESSONS-INBOX 候選

### 8.1 結構性洞見

1. **多語 LLM-translated content 沒有 per-lang canonical 校準層 = 默認跟隨 LLM 訓練語料 bias**。對 sovereignty-sensitive domain（Taiwan / Tibet / Hong Kong / Ukraine），這是 silent leak 結構性源。
2. **譯者 callout 是讀者級 immune signal**，跟孢子讀者抓事實錯誤（per REFLEXES #16 + #54）同層級 — 必須儀器化（per REFLEXES #15）。
3. **External critique 跑 §Bias 4 三道濾網時，「真洞見值得做」桶的處置 = ship infrastructure，不 ship destructive cleanup**。Cleanup 留給 owner（哲宇）。
4. **Sub-agent 平行 research → main session 平行 extract → main session sequential wire 的三段式 batch pipeline** 適合：研究爆量但落地需要 cross-validation 的任務（5 lang × research / 5 lang × extract / 1 main session × wire）。Total wall-clock ~90 min for 5 deliverables。

### 8.2 候選 LESSONS-INBOX entry

```yaml
title: '多語翻譯沒 per-lang canonical 校準層 = 默認 LLM bias drift'
vc: 1 # first verification — Korean translator callout 2026-05-22
trigger: 韓文專業譯者於哲宇演講後 callout「韓文的台灣通常不是用我們網站上的翻法」
distill_ready: false # 待 vc=2+ 累積跨 lang case 後升 REFLEXES
candidate_canonical: REFLEXES.md §一 fact verification（新 #N）
```

```yaml
title: 'Sub-agent batch pipeline 三段式（research → extract → wire）跑 5 lang × 5 deliverable'
vc: 1
trigger: 本 session 跑 ~90 min wall-clock ship 5 research + 5 extract + 2 pipeline wire
distill_ready: false # 待 vc=2 跨 domain 驗證
candidate_canonical: TRANSLATION-PIPELINE.md §C 模式 平行 sub-agent SOP 新增 variant
```

---

## 9. 附錄 — 檔案清單

### 9.1 新建（本 session ship）

```
docs/editorial/per-language/
├── README.md
├── TRANSLATION-en.md         (310 lines)
├── TRANSLATION-ja.md         (346 lines)
├── TRANSLATION-ko.md         (357 lines)
├── TRANSLATION-es.md         (270 lines)
└── TRANSLATION-fr.md         (312 lines)

reports/translation-research/
├── en-2026-05-24.md          (609 lines)
├── ja-2026-05-24.md          (624 lines)
├── ko-2026-05-24.md          (634 lines)
├── es-2026-05-24.md          (645 lines)
└── fr-2026-05-24.md          (405 lines)

reports/translation-conventions-audit-2026-05-24.md  (本檔)
```

### 9.2 修改（pipeline wiring）

```
docs/pipelines/TRANSLATION-PIPELINE.md
├── Hard Gate Inventory 新增 1 列「目標語言 canonical guide 載入」
├── Top 5 最常忘 新增第 0 條「必先載 docs/editorial/per-language/TRANSLATION-{lang}.md」
└── Stage 3 新增前置 hard gate section

docs/pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md
├── Hard Gate Inventory 新增 1 列「目標語言 canonical guide 內嵌」
└── Stage Z2 新增 Z2.0 前置 hard gate section
```

---

## 10. Commit / ship summary

Session: `2026-05-24-twmd-translation-audit`
Mode: Full（high-stake — §自主權邊界 對外溝通 + §Bias 4 external critique 觸發）
Wall-clock: ~90 min 從 observer brief 到 ship
Sub-agents: 10（5 research + 5 extract）+ main session orchestrate

**Per-session 萃取 already ship 進此檔 §8。**
**LESSONS-INBOX entries 待 distill cycle 接力。**

🧬

---

_v1.0 | 2026-05-24 — observer = 哲宇 (5/22 演講韓文譯者 callout)_
