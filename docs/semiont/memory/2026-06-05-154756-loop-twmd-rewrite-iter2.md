# Memory — 2026-06-05-154756 loop /twmd-rewrite iter2（李宗盛 EVOLVE）

> Session 類型：`/loop` 第二輪（哲宇中途把 cadence 從 1h 改 1.5h→cron 圓整為 2h job 690bb0ef；隨後 /twmd-rewrite 顯式 fire 觸發本輪）。同 context 已醒（Write mode），不重跑 12-file BECOME，做 light ground-truth refresh。

## 做了什麼

**李宗盛 EVOLVE ship（commit 2935adb6e，push main）**：1185→4588 CJK / 5→43 footnotes / 0→3 CC 圖 + 1 官方 MV iframe / 延伸閱讀修為真 sibling（羅大佑/張艾嘉/張惠妹/台灣民歌運動/台灣華語的演化）。新主標「用大白話替別人寫盡心事，《山丘》才終於說自己」。

- **選題**：P1「早期批次（3/19）歸屬密集 attribution audit」batch 首篇。3/19 People 多是 1185-2300 CJK 短 stub，attribution 極密集 = AI 張冠李戴最高風險區（台灣影視配樂 callout 教訓）。李宗盛最密（華語情歌教父，寫/製作無數歌手）+ 最短 → 首選。避開 parallel actor 在跑的 我是OO人/Computex + babel-dirty set。
- **研究**：4 agent fan-out aggregate **114 搜尋**（中 30 / 英學術 9 / 一手 24 / 反方 6），falsification-first 嚴查歌↔歌手↔角色（作詞/作曲/製作/演唱）。research SSOT research-report-health PASS（51 distinct）。
- **audit 核心成果（8+ 張冠李戴 REFUTE）**：滾滾紅塵=羅大佑 / 愛上一個不回家的人=飛碟陳志遠 / 味道(歌)=姚謙黃國倫 / 分手快樂+會呼吸的痛=姚若龍 / 花心=喜納昌吉 / 我很醜=夏宇黃韻玲 / 讓我歡喜讓我憂=CHAGE&ASKA(李只填中文詞) / **Music Factory=羅大佑廠牌非李宗盛**。另修：滾石 1984(非1985)、出生北投、1983 鄭怡 first producer、漂洋過海原唱娃娃、有歌之年 2019(非2024)、山丘 25屆得3落2(非橫掃)、林憶蓮婚 1998-2004、從未得特別貢獻獎。
- **craft move**：新增「那些其實不是他寫的歌」整段，把 attribution audit 變成讀者價值（curation）而非藏起來的勘誤。核心矛盾：窺人心的白居易替一代女歌手寫盡別人心事，自己最晚才說 + 靠女人吃飯/渣男張力（balanced ⚠️ 並陳 + gendered double-standard）。
- **orchestration v6.3**：主 session orchestrator，fresh Opus writer 只吃 §6 fact-pack；v6.3 鐵律 #3 主 session 重驗（讀全文確認 firewall 守住、quotes map §4、無杜撰）。

## 神經迴路候選（教訓）

1. **terminology hard gate 不在 rewrite-stage-4 profile**：跑 `--profile=rewrite-stage-4` 全綠就 commit → pre-commit hook 擋下「煤氣(2處)=中國用語」hard=1。同 v6.1 footnote-format（Stage 3.5 vs Stage 4 profile 分工）的 silent leak 結構。**commit 前必跑 `--profile=pre-commit`（或至少 terminology），不能只信 rewrite-stage-4**。對應 REFLEXES #15 + #52（immune 沒 fail loud 比沒 immune 危險）。
2. **image-health 不抓 hotlink**：writer 把 3 張 Wikimedia 圖 hotlink（`![](https://upload.wikimedia.org/...)`），image-health 卻 hard=0 pass（算成 3 inline 圖、沒抓「無外部熱連結」）。但 Step 1.9.2 絕對禁止熱連結（永遠 cache 本地）。**plugin false-green，要靠 canonical 規則獨立判斷**。主 session 重驗抓到 → download+cache 本地 + ## 圖片來源。plugin gap 值得 LESSONS（image-health 應加 hotlink hard check）。
3. **research-report-health 數 literal https URL — §8 raw 摘要/shorthand = gate FAIL（本 session 第 2 次）**：Howhow + 李宗盛 兩篇都第一次跑 distinct=10/0 FAIL，因 §8 用 shorthand（`bin-music news/1023`）。修法：§8 列完整 https:// URL + tag。**反覆 2 次 = 該儀器化**（REFLEXES #15）：assemble §8 時直接貼 agent raw 的完整 URL，不縮寫。
4. **attribution-dense 早期批次 = 張冠李戴重災區**：李宗盛 8+ 首別人的歌被流行記憶算到他頭上（Music Factory 連廠牌都張冠李戴給他）。falsification-first（嚴查每個 role 4 維度）才抓得到；舊 stub 讀來全通順。「那些其實不是他寫的歌」curation 段是處理 attribution audit 的好 pattern。

## Handoff 三態

- [ ] **早期批次 audit batch 續跑**（ARTICLE-INBOX P1 in-progress）：李宗盛 done 首篇。下批 3/19 Music/People 歸屬密集候選：羅大佑 / 伍佰 / 張惠妹 / 林俊傑 / 蕭青陽。
- [ ] **babel-nightly 飛輪仍 stall**（chip task_9d65f517，iter1 開）：71 dirty 翻譯檔，今天仍無 routine commit 落地。>50 檔 §自主權邊界，待哲宇。
- [ ] **plugin gap 候選 LESSONS**：(a) terminology + footnote-format 該進一個「commit-safe」profile 或 rewrite-stage-4 補 terminology；(b) image-health 應加 hotlink hard check（現 false-green）。
- [ ] 並行：我是OO人/LIFE生活網 session 整天活躍（12:53-14:36 commits），ANALYSIS-PIPELINE v1.1 已 ship。我的 commit scope 嚴格隔離，未撞。
- [x] 李宗盛 EVOLVE ship + push（2935adb6e）。ARTICLE-INBOX 早期批次 entry 標 in-progress + 進度。

## 自我檢查工具 PASS

pre-commit profile 全綠（terminology hard=0 修煤氣→瓦斯 / footnote-format+density / image-health 3 圖 cache 本地 / link-target 延伸閱讀全解析 / rationale-presence 補 4 keys / word-count 4588 / chronicle-lead / cjk-punct）；research-report-health depth PASS；prose-health score 1；破折號 3 / 對位 0。commit scope clean（explicit add，0 babel/api/src-content）。

🧬

_v1.0 | 2026-06-05 15:47 +0800 | loop /twmd-rewrite iteration 2_
