---
title: 'TRANSLATION-en'
description: '英文翻譯規範 — 用語對照表 + sovereignty-avoid 詞庫 + register + romanization 規則'
type: 'editorial-canonical'
status: 'canonical'
current_version: 'v1.0'
last_updated: 2026-05-24
last_session: '2026-05-24-twmd-translation-audit'
sister_docs:
  - 'TRANSLATION-ja.md'
  - 'TRANSLATION-ko.md'
  - 'TRANSLATION-es.md'
  - 'TRANSLATION-fr.md'
upstream_canonical:
  - '../EDITORIAL.md'
  - '../TERMINOLOGY.md'
  - '../../pipelines/TRANSLATION-PIPELINE.md'
  - '../../pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md'
research_evidence: '../../../reports/translation-research/en-2026-05-24.md'
audience: 'translator (human + AI)'
---

# TRANSLATION-en — Taiwan.md 英文翻譯規範

> 完整證據與 source citation 見 [reports/translation-research/en-2026-05-24.md](../../../reports/translation-research/en-2026-05-24.md)。本檔是 canonical actionable guide，每次翻譯前載入。

## TL;DR — 5 條最高優先規則

1. **`Taiwan` is the default name in body prose.** Reserve `Republic of China` / `ROC` for legal-precision contexts (treaties, court decisions, pre-1949 history, formal name disambiguation). Both AP and the Global Taiwan Institute style guide follow this pattern. Never use `Chinese Taipei` outside the specific Olympic / APEC / WHA international-organization contexts where Taiwan was forced into the name.

2. **A banned-phrases lint is the single highest-leverage defense against PRC-coded leak.** Top offenders: `Taiwan, China` / `Taiwan, Province of China` / `China's Taiwan` / `mainland China` (uncontextualized) / `renegade province` / `reunification` / `the island` (when used dismissively). Substitute with `Taiwan`, `the PRC` or `China`, `unification`, and `Taiwan` (repeated rather than `the island`).

3. **Personal names use Wade-Giles-derived ROC-official spelling for politicians and historical figures** (`Lee Teng-hui`, `Tsai Ing-wen`, `Lai Ching-te`, `Chiang Ching-kuo`, `Ma Ying-jeou`). These are the spellings the subjects themselves use and how Reuters / AP / BBC / NYT spell them. Hyphenate two-syllable given names with the second syllable lowercase (`Teng-hui`, never `Tenghui` or `Teng-Hui`). For people with established English names (`Audrey Tang`, `Joseph Wu`, `Hsiao Bi-khim`), use the English form on first reference, optionally with the Chinese form in parentheses.

4. **Place names use legacy Wade-Giles / postal romanization for major settlements** (`Taipei`, `Kaohsiung`, `Hsinchu`, `Taichung`, `Tainan`, `Keelung`, `Kinmen`, `Matsu`). These are the entrenched conventions Taiwan's MOFA-EN, tourism bureau, and international media all use. Hanyu Pinyin is correct for newer district / street level when the local government has adopted it (`Xinyi District` in Taipei; Kaohsiung still uses Tongyong for its districts). Never `Taibei`, `Gaoxiong`, `Xinzhu` — those read as PRC-coded.

5. **For Taiwan-specific cultural terms with no clean English equivalent, use the romanization + gloss pattern.** Format: _lurou fan_ (braised pork rice), _Mazu_ (sea goddess), _Tâi-gí_ (the Taiwanese / Hokkien language). Italicize the romanization on first use, romanization alone after. Prefer Tâi-gí / Taiwanese over Hokkien / Min-nan for the language as spoken in Taiwan — `Min-nan` carries Sinocentric framing many native speakers reject.

## 1. 國名 / 地區指稱（必查）

| zh-TW 源詞              | Recommended English                                                         | When to use                                                                                                                                 | Never use                                               | Notes                                                                                        |
| ----------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 台灣 / 臺灣             | **Taiwan**                                                                  | Default in all body prose, datelines, polity / people / geography / government references.                                                  | —                                                       | Never wrong as default.                                                                      |
| 中華民國                | **Republic of China (ROC)**                                                 | Legal-precision contexts; pre-1949 history when ROC governed the mainland; when distinguishing ROC state from `Taiwan` as cultural entity.  | As default name in casual prose.                        | Reads stiff / pre-2000s in body prose.                                                       |
| 中華民國 (台灣)         | **Republic of China (Taiwan)**                                              | MOFA-style formal first reference in political / diplomatic articles.                                                                       | Body prose after first mention.                         | —                                                                                            |
| 中華台北                | **Chinese Taipei**                                                          | ONLY Olympic / APEC / WHA / WTO contexts where this name was forced on Taiwan. Add scare quotes or `"the name imposed by..."` on first use. | As a name for Taiwan in any other context.              | Coerced compromise, not a neutral label.                                                     |
| 兩岸 / 海峽兩岸         | **cross-Strait** (modifier) / **Cross-Strait relations** (proper-noun-like) | Diplomatic / political framing of the Taiwan-PRC relationship.                                                                              | `cross-strait` (lowercase s is less sovereignty-aware). | Capital S; per GTI / Taiwan-studies academic preference.                                     |
| 台灣海峽                | **Taiwan Strait**                                                           | The body of water. Capitalize both words.                                                                                                   | `Formosa Strait` (historical only).                     | Per Chicago Manual of Style.                                                                 |
| 國家 / 我國 / 本國      | **Taiwan / the country / the nation**                                       | Translate the deictic into the explicit referent.                                                                                           | Leaving as `our country` reads odd to English readers.  | Taiwan IS a country — use the word without scare quotes.                                     |
| 中國大陸                | **China / the PRC / the People's Republic of China**                        | Modern PRC references.                                                                                                                      | `mainland China` uncontextualized.                      | `Mainland China` tacitly endorses PRC framing that Taiwan is non-mainland part of one China. |
| 大陸 (uncontextualized) | **China / the PRC**                                                         | Modern PRC references.                                                                                                                      | `the mainland`.                                         | Same fix as 中國大陸.                                                                        |
| 福爾摩沙                | **Formosa**                                                                 | Pre-1945 historical / literary contexts; proper nouns (Formosa Plastics).                                                                   | Modern references to country / island.                  | Archaic / colonial in 2026 prose.                                                            |

## 2. 人名 romanization 規則

**Default rule**: Use the romanization the person themselves uses. Check official bio, English-language interviews, or government profile.

**System defaults**:

- **Wade-Giles (ROC-official, simplified, no diacritics)** — politicians, historical figures, anyone whose passport follows this convention.
- **Gwoyeu Romatzyh (GR)** — specific cases like `Tsai Ing-wen` and `Ma Ying-jeou` (their given names are GR, not Wade-Giles). Use the form they use.
- **Hanyu Pinyin** — almost never for Taiwanese personal names. OK for mainland figures (Xi Jinping), or if the Taiwanese person explicitly self-spells in Pinyin.
- **Tâi-lô / POJ** — when the person publicly uses a Tâi-gí name (esp. indigenous-identifying figures, some musicians).

**Name order**:

- Family name first for all Chinese-character names: `Lee Teng-hui`, `Tsai Ing-wen`, `Chen Shui-bian`.
- Western order for people with English names: `Audrey Tang`, `Joseph Wu`, `Stan Shih`.
- Second reference: surname only (`Lee`, `Tsai`, `Lai`). For ambiguity (multiple Lees in the same piece), use full name each time.

**Hyphenation**:

- Two-syllable given names: hyphen + lowercase second syllable. `Lee Teng-hui`, `Tsai Ing-wen`, `Chiang Ching-kuo`, `Lai Ching-te`. NEVER `Lee Tenghui` / `Lee TengHui` / `Lee Teng-Hui` / `Lee Teng Hui`.
- One-syllable given names: no hyphen. `Wang Wei`.

**Canonical roster**:

| Chinese              | English                                     | Notes                                                                    |
| -------------------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| 蔡英文               | Tsai Ing-wen                                | GR for given name                                                        |
| 賴清德               | Lai Ching-te                                | —                                                                        |
| 李登輝               | Lee Teng-hui                                | NOT `Li Denghui`                                                         |
| 馬英九               | Ma Ying-jeou                                | GR for given name                                                        |
| 陳水扁               | Chen Shui-bian                              | —                                                                        |
| 蔣中正 / 蔣介石      | Chiang Kai-shek                             | Wade-Giles + Cantonese hybrid; entrenched                                |
| 蔣經國               | Chiang Ching-kuo                            | —                                                                        |
| 唐鳳                 | Audrey Tang                                 | English name; add `(唐鳳)` first mention if needed                       |
| 吳釗燮               | Joseph Wu                                   | English name; add `(Wu Jaushieh)` if needed                              |
| 蕭美琴               | Hsiao Bi-khim                               | She uses family-name-first form                                          |
| 柯文哲               | Ko Wen-je                                   | —                                                                        |
| 張忠謀               | Morris Chang                                | English name; founder of TSMC                                            |
| 黃仁勳               | Jensen Huang                                | English name; NVIDIA CEO                                                 |
| 李安                 | Ang Lee                                     | Western order; director                                                  |
| 侯孝賢               | Hou Hsiao-hsien                             | —                                                                        |
| 楊德昌               | Edward Yang                                 | English name; director                                                   |
| 林懷民               | Lin Hwai-min                                | Cloud Gate founder                                                       |
| 鄧麗君               | Teresa Teng                                 | English name; singer                                                     |
| 張惠妹               | A-mei (Chang Hui-mei)                       | Stage name primary                                                       |
| 阿信 (五月天)        | Ashin                                       | Stage name; add `(陳信宏 Chen Hsin-hung)` in music-focused first mention |
| 安溥 (formerly 張懸) | Anpu (formerly Deserts Chang / Chang Hsuan) | Use current stage name; note prior name biographically                   |

**Indigenous Taiwanese names**: Use the Latin-script romanization the person uses (e.g., `Kawlo Iyun Pacidal`, `Kolas Yotaka`). The 2024 amendments let indigenous Taiwanese register native names in Latin script — reflect this, don't force a Han name. Avoid `aborigines` / `aboriginal`; use `indigenous Taiwanese` or `Taiwan's Indigenous peoples`.

## 3. 地名 romanization

**Major cities** (Wade-Giles / postal — entrenched, what MOFA / tourism / international media use):

| Chinese | English        | Avoid                                 |
| ------- | -------------- | ------------------------------------- |
| 臺北    | **Taipei**     | Taibei                                |
| 高雄    | **Kaohsiung**  | Gaoxiong                              |
| 臺中    | **Taichung**   | Taizhong                              |
| 臺南    | **Tainan**     | —                                     |
| 新竹    | **Hsinchu**    | Xinzhu                                |
| 基隆    | **Keelung**    | Jilong                                |
| 桃園    | **Taoyuan**    | —                                     |
| 嘉義    | **Chiayi**     | Jiayi                                 |
| 宜蘭    | **Yilan**      | I-lan (current Hanyu Pinyin standard) |
| 花蓮    | **Hualien**    | Hualian                               |
| 臺東    | **Taitung**    | Taidong                               |
| 屏東    | **Pingtung**   | Pingdong                              |
| 苗栗    | **Miaoli**     | —                                     |
| 彰化    | **Changhua**   | Zhanghua                              |
| 雲林    | **Yunlin**     | —                                     |
| 南投    | **Nantou**     | —                                     |
| 新北    | **New Taipei** | Xinbei                                |

**Districts** (mixed — inherit parent city's system):

- **Taipei districts** = Hanyu Pinyin: `Xinyi District` (信義), `Da'an District` (大安), `Zhongshan District`, `Wanhua District`, `Shilin District`, `Songshan District`. Avoid older Wade-Giles `Hsinyi`, `Ta-an`, `Shihlin`, `Sungshan` in current content.
- **Kaohsiung districts** = Tongyong Pinyin: `Sinsing District` (新興), `Cianjhen District` (前鎮). Looks unusual but is the official local-government form.
- **Tainan / Taichung** = mixed; check the city government's current English signage.
- **Rule of thumb**: For Taipei use Hanyu Pinyin. For other cities, defer to most recent official local-government romanization.

**Outlying islands**:

| Chinese | English                                           | Avoid                                 |
| ------- | ------------------------------------------------- | ------------------------------------- |
| 金門    | **Kinmen** (or `Quemoy` pre-1990 historical only) | Jinmen, Chinmen                       |
| 馬祖    | **Matsu** (the islands)                           | `Mazu` is the goddess — don't confuse |
| 澎湖    | **Penghu** (or `Pescadores` historical only)      | —                                     |
| 蘭嶼    | **Orchid Island** or **Lanyu**                    | `Lan Yu` (no space)                   |
| 綠島    | **Green Island** or **Ludao**                     | —                                     |
| 龜山島  | **Guishan Island** or **Turtle Island**           | —                                     |

**Mountains and rivers**:

- 玉山 → **Yushan** (tourism: `Mount Jade`)
- 阿里山 → **Alishan**
- 雪山 → **Xueshan** (tourism: `Snow Mountain`)
- 淡水河 → **Tamsui River** (entrenched in tourism / historical) or `Danshui River` (Hanyu Pinyin)
- 濁水溪 → **Zhuoshui River**
- 高屏溪 → **Gaoping River**
- 日月潭 → **Sun Moon Lake** (translate; do not romanize)

## 4. 文化詞彙（romanize + gloss pattern）

**Pattern**: italicized romanization on first mention + parenthetical English gloss. Romanization alone after.

**Food**:

| Chinese  | First mention                                 | Subsequent       | Notes                                                    |
| -------- | --------------------------------------------- | ---------------- | -------------------------------------------------------- |
| 滷肉飯   | _lurou fan_ (braised pork rice)               | _lurou fan_      | Hanyu Pinyin standard in English food writing            |
| 牛肉麵   | _niurou mian_ (beef noodle soup)              | beef noodle soup | English form usually wins after intro                    |
| 珍珠奶茶 | **bubble tea** (also _boba_ / pearl milk tea) | bubble tea       | `boba` US-regional; `pearl milk tea` Taiwanese self-name |
| 鳳梨酥   | **pineapple cake**                            | pineapple cake   | Can add (_fenglisu_) first mention                       |
| 蚵仔煎   | _ô-á-chian_ (oyster omelet)                   | oyster omelet    | Tâi-gí romanization preferred (NOT _kezi jian_)          |
| 鹹酥雞   | _xian su ji_ (Taiwanese popcorn chicken)      | —                | Both forms common                                        |
| 小籠包   | **xiaolongbao** (soup dumplings)              | xiaolongbao      | Naturalized; no italics after intro                      |
| 滷味     | _lu wei_ (braised snacks)                     | _lu wei_         | —                                                        |
| 臭豆腐   | **stinky tofu** (_chou doufu_)                | stinky tofu      | Fully naturalized                                        |

**Sovereignty-preservation move**: prefer Taiwanese-language (Tâi-gí) romanization when the dish has Tâi-gí roots. Many "Chinese food" dishes are specifically Taiwanese.

**Religion / common spaces**:

| Chinese     | English                             | Notes                                                                    |
| ----------- | ----------------------------------- | ------------------------------------------------------------------------ |
| 媽祖        | **Mazu**                            | Sea goddess; NOT `Matsu` (= the islands)                                 |
| 觀音        | **Guanyin**                         | —                                                                        |
| 土地公      | **Earth God** (_tudi gong_)         | Translate                                                                |
| 城隍        | **City God** (_cheng huang_)        | Translate                                                                |
| 關公 / 關帝 | **Guandi** / **Guan Yu**            | Romanize                                                                 |
| 夜市        | **night market**                    | Translate; _yeshi_ only if emphasizing the term itself                   |
| 廟口        | **temple plaza** / **temple front** | Translate; _Miaokou_ only in proper nouns (Keelung Miaokou Night Market) |

**Festivals**:

| Chinese      | English                                       | Notes                                                        |
| ------------ | --------------------------------------------- | ------------------------------------------------------------ |
| 春節         | **Lunar New Year**                            | NOT `Chinese New Year` as default (sovereignty-aware choice) |
| 元宵節       | **Lantern Festival**                          | —                                                            |
| 端午節       | **Dragon Boat Festival**                      | —                                                            |
| 中秋節       | **Mid-Autumn Festival**                       | Also `Moon Festival`                                         |
| 中元節       | **Zhongyuan Festival** / **Ghost Festival**   | `Hungry Ghost Festival` also common                          |
| 鬼月         | **Ghost Month**                               | The whole seventh lunar month                                |
| 清明節       | **Tomb-Sweeping Day** / **Qingming Festival** | —                                                            |
| 雙十節       | **Double Tenth Day** / **National Day**       | Taiwan's national day, Oct 10                                |
| 大甲媽祖遶境 | **Dajia Mazu Pilgrimage**                     | Standard tourism / academic form                             |

**Language naming**:

- 台語 → **Taiwanese** (most common in English) or **Tâi-gí** (self-name, sovereignty-aware). Acceptable: **Taiwanese Hokkien**. AVOID `Min-nan` / `Minnan` (閩 historically meant "barbarian"; Sinocentric), `Southern Min`, `Fukienese`.
- 客家話 → **Hakka**.
- 國語 → **Mandarin** (in Taiwan). Avoid `Chinese` for the spoken language — ambiguous with PRC framing.
- Indigenous languages → use the language name directly (Atayal, Amis, Bunun, Paiwan, etc.).

## 5. 政治 / 歷史 sensitive terms

| Chinese      | English                                                    | Notes                                                                                                                             |
| ------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 二二八事件   | **228 Incident** / **February 28 Incident**                | Subsequent: `228` (no hyphen). `228 Massacre` acceptable when emphasizing scale (~28,000 dead).                                   |
| 228 紀念日   | **228 Peace Memorial Day**                                 | The public holiday                                                                                                                |
| 白色恐怖     | **White Terror**                                           | Capitalized, no quote marks. `White Terror (1947–1992)` or `(1949–1992)`                                                          |
| 戒嚴         | **martial law**                                            | Lowercase general; `the Martial Law era` capitalized for the 1949–1987 period                                                     |
| 解嚴         | **the lifting of martial law (1987)**                      | —                                                                                                                                 |
| 民國 (year)  | **convert to Gregorian** in body (民國 38 → 1949)          | If subject itself: `Year 38 of the Republic (1949)`. NEVER bare `ROC 115`.                                                        |
| 本省人       | **_benshengren_** (italicized + gloss)                     | Gloss: `Taiwanese whose families lived under Japanese rule, pre-1945`. `Native Taiwanese` ambiguous with indigenous.              |
| 外省人       | **_waishengren_** (italicized + gloss)                     | Gloss: `Chinese mainlanders who came to Taiwan with the KMT 1945–1949 and their descendants`. `Mainlander` creates PRC-confusion. |
| 原住民       | **indigenous Taiwanese** / **Taiwan's Indigenous peoples** | Capitalize `Indigenous` per international convention. Avoid `aborigines`.                                                         |
| 新住民       | **new immigrants** / **new residents**                     | Post-1990s, mostly SE Asian                                                                                                       |
| 日治時期     | **Japanese colonial period (1895–1945)**                   | Contemporary academic standard                                                                                                    |
| 日據時期     | **Japanese occupation period**                             | KMT-preferred framing; less used now                                                                                              |
| 皇民化       | **_kōminka_** (italicized) / **Imperialization**           | Late-period assimilation                                                                                                          |
| 一個中國原則 | **the PRC's One China principle**                          | Distinguish from US `One China policy` (different things)                                                                         |
| 九二共識     | **1992 Consensus**                                         | —                                                                                                                                 |
| 統一         | **unification**                                            | NOT `reunification`                                                                                                               |
| 獨立         | **independence** (Taiwan independence)                     | —                                                                                                                                 |
| 現狀         | **the status quo**                                         | —                                                                                                                                 |

**Political parties** (full English first use → abbreviation after):

| Chinese    | English                                | Notes                                                                      |
| ---------- | -------------------------------------- | -------------------------------------------------------------------------- |
| 中國國民黨 | **Kuomintang (KMT)**                   | The party uses `Kuomintang` on its own English materials, NOT `Guomindang` |
| 民主進步黨 | **Democratic Progressive Party (DPP)** | —                                                                          |
| 台灣民眾黨 | **Taiwan People's Party (TPP)**        | Ko Wen-je's party                                                          |
| 時代力量   | **New Power Party (NPP)**              | —                                                                          |
| 親民黨     | **People First Party (PFP)**           | —                                                                          |
| 中國共產黨 | **Chinese Communist Party (CCP)**      | NOT `CPC`                                                                  |
| 泛藍       | **Pan-Blue Coalition**                 | —                                                                          |
| 泛綠       | **Pan-Green Coalition**                | —                                                                          |

**Government bodies**: 總統府 → `Office of the President`; 立法院 → `Legislative Yuan`; 行政院 → `Executive Yuan`.

## 6. Sovereignty-avoid lexicon（PRC-coded → 替代）

| PRC-coded (avoid)                                                 | Taiwan-aligned (use)                                                                           |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `Taiwan, China`                                                   | `Taiwan`                                                                                       |
| `Taiwan, Province of China`                                       | `Taiwan` (only legitimate use: when discussing the labeling controversy itself)                |
| `China's Taiwan` / `Chinese Taiwan`                               | `Taiwan`                                                                                       |
| `renegade province`                                               | omit; if quoting PRC: `which Beijing claims as part of its territory`                          |
| `breakaway province`                                              | (same fix)                                                                                     |
| `reunification`                                                   | `unification` (potential future integration); `annexation` (if discussing PRC coercive intent) |
| `peaceful reunification`                                          | quote PRC verbatim if required; never adopt                                                    |
| `mainland China` (uncontextualized)                               | `China` / `the PRC` / `the People's Republic of China`                                         |
| `the mainland` (uncontextualized)                                 | `China` / `the PRC`                                                                            |
| `the island` (as primary referent for Taiwan-as-nation)           | `Taiwan` / `the country`                                                                       |
| `Taiwan authorities` (uncontextualized)                           | `Taiwan's government` / `the Taiwanese government`                                             |
| `leader of Taiwan`                                                | `President of Taiwan` / `Taiwan's President`                                                   |
| `Chinese Taipei` (outside Olympic/APEC/WHA)                       | `Taiwan`                                                                                       |
| `Chinese New Year`                                                | `Lunar New Year`                                                                               |
| `Min-nan` / `Southern Min` (for language in Taiwan)               | `Taiwanese` / `Tâi-gí`                                                                         |
| `Taiwanese aborigines`                                            | `indigenous Taiwanese` / `Taiwan's Indigenous peoples`                                         |
| `Formosa` (modern context)                                        | `Taiwan`                                                                                       |
| `One China` (ambiguous)                                           | distinguish `the PRC's One China principle` vs `US One China policy`                           |
| Scare quotes around `Taiwan` / `country` / `president` / `nation` | straightforward language; no scare quotes                                                      |

**Boilerplate framing — use with care**: prefer Taiwan-first framing over reflexive PRC-claim foregrounding.

- Avoid: `Taiwan, the self-ruled island that China claims as its own,`
- Use: `Taiwan, a democracy of 23 million,` / `Taiwan, an East Asian island nation,`
- Add `China claims` clause only when cross-Strait dimension is the actual subject.

## 7. Register & 風格規則

- **American English** site-wide. `color` not `colour`, `realize` not `realise`, `defense` not `defence`, `center` not `centre`, `traveled` not `travelled`. Rationale: Taiwan's own English pedagogy + Focus Taiwan / Taipei Times / Taiwan News all use American conventions; largest English-reading audience is North American.
- **Oxford comma**: yes. Standard in Chicago Manual, New Yorker, MIT Press, academic journals; unambiguous for translations from Chinese serial structures.
- **Date format**: `May 24, 2026` (American long form) in body; `1947–1987` (en dash, no spaces) for ranges; `the 1990s` (no apostrophe); `the 20th century` (numeric).
- **Capitalization for Taiwan-specific terms**: `White Terror`, `Sunflower Movement`, `228 Incident`, `Cross-Strait relations` (proper-noun-like), `the Martial Law era`, `Indigenous` (per international convention), `Pan-Blue Coalition` / `Pan-Green Coalition`.
- **Italics for romanized Chinese on first mention only**: _lurou fan_, _Tâi-gí_, _benshengren_, _kōminka_. Subsequent uses roman.
- **Voice**: long-form essay tone (Atlantic / Foreign Affairs / LARB register). Active voice predominant. First-person plural `we` sparingly when speaking from inside Taiwanese collective identity.
- **Numbers**: spell out one through nine; numerals for 10+. Always numeral: years, percentages, measurements. Currency: `NT$1,200` (no space).
- **Quotations**: double quotes for direct quotes; single quotes nested. American convention.
- **Names of works**: italicize book titles, films, albums, newspapers. Quote song titles, article titles, chapter titles.

## 8. CI Lint 候選 banned phrases

**Hard-fail (CI gate)**:

1. `Taiwan, China` — whitelist only: articles discussing the labeling controversy itself.
2. `Taiwan, Province of China` — whitelist only: same.
3. `China's Taiwan` / `Chinese Taiwan` — no whitelist.
4. `renegade province` — whitelist only: inside a quoted PRC speaker.
5. `reunification` — whitelist only: inside a direct quote from a PRC source (use editor's note).

**Warning-only**: 6. `mainland China` / `the mainland` (uncontextualized) — flag for human review; allow in quoted material and PRC-internal-context discussions. 7. `the island` (as primary referent for Taiwan) — flag dismissive uses; allow geographic-feature contexts (`Taiwan is the largest island in...`). 8. `Chinese New Year` — flag; allow if specifically discussing PRC's framing or in quoted material. 9. `Chinese Taipei` outside Olympic / APEC / WHA / WTO context — flag for human review. 10. `Min-nan` / `Southern Min` / `Minnan` for the language in Taiwan — flag; suggest `Taiwanese` / `Tâi-gí`.

**Source-string lint** (catches PRC-coded leak from Chinese sources): `中國臺灣`, `中國臺北` in en/\* output → always flag.

## 9. Open questions

1. **`mainland China` in direct quotes of PRC speakers** — allow with editor's note flag, or strip-and-paraphrase? Recommendation: allow in quoted material; flag if it would mislead.
2. **`Chinese New Year` retrofit** — existing en/\* articles may have hundreds of uses. Mass-replace to `Lunar New Year`, or per-article review? Recommendation: mass-PR with per-article diff review.
3. **`Indigenous` capitalization** — enforce site-wide per international convention? Pending observer call.
4. **`Quemoy` vs `Kinmen` in 1950s-crisis articles** — use `Kinmen (formerly Quemoy)` on first mention, or `Quemoy` throughout for period accuracy? Pending observer call.
5. **Tongyong vs Hanyu Pinyin for Kaohsiung districts** — mirror official Tongyong signage (`Sinsing`, `Cianjhen`) or default to Hanyu Pinyin for consistency? Recommendation: mirror official signage with parenthetical Han characters.

---

_v1.0 | 2026-05-24 — derived from translation conventions audit. Evidence base in `reports/translation-research/en-2026-05-24.md`._
