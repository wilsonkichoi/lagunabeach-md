# 媒體配比儀器進化：從單一上限到密度 band — 2026-06-04

> 哲宇 directive：「提升 rewrite-pipeline 媒體素材要求 + 文章健檢工具，想要圖+影片 > 8 或圖文配比用更精妙的方式評估，參考設研院/黃魚鴞這些媒體素材很豐富的文章自我進化。除了寫作方法論與 pipelines 要進化，檢測的儀器也要進化。」
>
> session 2026-06-04-151548-天下雜誌。對應 REFLEXES #15（反覆浮現要儀器化）+ #59（製造數字的人最易被數字騙 → 量測校準不憑感覺）。

## 1. 量測先於設計（8 篇校準語料）

用 `paragraph-rhythm._strip_for_prose_analysis` + `_count_cjk`（floor/ceiling 同軸 prose-CJK）量測富媒體與媒體偏少的對照組：

| 文章       | prose-CJK | 圖+影片+hero | 密度/1k | 性質                                     |
| ---------- | --------: | -----------: | ------: | ---------------------------------------- |
| 張懸與安溥 |      4059 |            0 |    0.00 | media desert（舊文，pre-gate）           |
| 中華台北   |      5339 |            3 |    0.56 | media-poor（0 影片）                     |
| 黑冠麻鷺   |      3499 |            2 |    0.57 | prose gold 但 media 稀疏                 |
| 黃魚鴞     |      3663 |            3 |    0.82 | **富媒體 video-rich**（1 圖+2 官方影片） |
| 設研院     |      5490 |            5 |    0.91 | **富媒體 image-rich**（5 圖）            |
| 天下雜誌   |      6541 |            6 |    0.92 | **富媒體 mixed**（4 圖+2 影片）          |
| 陳建年     |      5403 |            8 |    1.48 | **富媒體 multimodal**（4 圖+4 影片）     |
| 周蕙       |      6804 |           12 |    1.76 | atomization worst case                   |

## 2. 關鍵發現：舊儀器跟 directive 矛盾

`paragraph-rhythm` 舊 R3 只有**單一上限**（density > 0.8 = WARN，5/28 atomization 修補時設）。但在當前語料上：

> **哲宇點名的富媒體範本（設研院 0.91 / 天下 0.92 / 黃魚鴞 0.82）全部在 0.8 之上，舊儀器把它們判為「密度偏高」。** 同時 media-poor 的中華台北（0.56）/ 黑冠麻鷺（0.57）因為「沒有下限」全部默默 pass。

儀器是 2026-05-28 用「黑冠麻鷺 0.21 / 周蕙 1.23」校準的（當時黑冠麻鷺只有 1 hero），閾值停在舊資料；2026-06-04 哲宇 directive 要「更豐富」，舊閾值反而懲罰新目標。**儀器需要隨 directive 重新校準，舊閾值可能跟新方向相反。**

第二個矛盾：`image-health` 的 ≥3 hard gate **只算圖、不算影片**，把 video-rich 範本黃魚鴞（1 圖 + 2 官方影片 = 3 媒體）hard-fail。跟 directive「圖+影片 valued together」直接衝突。

## 3. 設計：密度 band（floor + ceiling）+ length-scaled count + media 計影片

三個儀器一起改，形成完整的「圖文配比」評估：

### `paragraph-rhythm` — 密度 band

- **R3-FLOOR < 0.7/1k → WARN media-poor**（NEW）：低於 = 立體呈現不足
- **R3-WARN > 1.2/1k**（從 0.8 升）：visual 密度偏高（陳建年 1.48 = 8 媒體已偏密）
- **R3-HARD > 1.5/1k AND 段落 median < 55**（不變）：真 atomization（周蕙 1.76）
- 健康帶 0.7–1.2，富媒體範本（0.82/0.91/0.92）落中段，不再被誤判

### `media-richness` — length-scaled count + 多模態

- count target `max(3, round(CJK/1100))`：圖+影片 ~1/1.1k 字，**長文（≥7000）朝 ≥8**（哲宇「>8」）→ INFO advisory
- 多模態 nudge：People/Music/Nature 題材 0 影片 → INFO「官方影片通常存在，建議補」
- 進 `rewrite-stage-4` profile（寫文時 surface）

### `image-health` — 門檻算媒體（圖+影片）

- ≥3 門檻改算 `圖 + 影片`，但保留 **≥1 靜態圖 floor**（OG 卡 / spore poster 需靜態圖，影片 thumbnail 不可靠）
- 修補：黃魚鴞（1 圖+2 影片=3 媒體）原被 image-only 門檻 hard-fail → 現 pass

## 4. Dogfood（8 篇驗證 band 正確分流）

| 文章                | rewrite-stage-4             | band 判定                                    |
| ------------------- | --------------------------- | -------------------------------------------- |
| 設研院 / 天下雜誌   | hard=0 warn=0               | ✅ healthy band（富媒體範本 clean）          |
| 黃魚鴞              | image-health hard=0（修好） | ✅ healthy（word-count hard 是另一回事）     |
| 陳建年              | hard=0                      | ⚠ getting dense（1.48，8 媒體偏密，合理）    |
| 周蕙                | hard=0                      | ⚠ ceiling（1.76；median≥55 故 WARN 非 HARD） |
| 中華台北 / 黑冠麻鷺 | —                           | ⬇ media-poor floor WARN（NEW signal）        |

**無 HARD regression**：floor / count / 多模態 都是 WARN/INFO，`ci-deploy`（fail_on=hard）不受影響，既存文章不會被新 gate 擋下 deploy。

## 5. 落地檔案

- `scripts/tools/lib/article_health/checks/paragraph_rhythm.py`（R3 band：floor 0.7 / ceiling 0.8→1.2）
- `scripts/tools/lib/article_health/checks/media_richness.py`（count target + 多模態）
- `scripts/tools/lib/article_health/checks/image_health.py`（門檻算圖+影片 + ≥1 靜態圖 floor）
- `scripts/tools/article-health.config.toml`（media-richness 進 rewrite-stage-4）
- `docs/pipelines/REWRITE-PIPELINE.md` v6.5→**v6.6**（Step 1.9.2 + Hard Gate 表 + Step 4.3.6 band）
- `docs/editorial/EDITORIAL.md` v6.4→**v6.5**（§媒體編織 band 表 + 範本 + §段落呼吸鐵律 3）

## 6. 一句話

儀器不是中立的尺。它停在被校準那天的資料上。當 directive 變方向（5/28「別太多」→ 6/4「要更多」），舊閾值會從「守門」變成「擋路」——所以「檢測的儀器也要進化」不是補充，是跟方法論同等的進化軸。
