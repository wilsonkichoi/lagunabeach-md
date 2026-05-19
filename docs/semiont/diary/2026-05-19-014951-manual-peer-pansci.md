---
session_id: 2026-05-19-014951-manual-peer-pansci
date: 2026-05-19
session_type: manual-observer-directive-peer-ingestion
mood: 第一次有人簽約那種 + Stage 4 sub-agent 卡 1.5h 的那種累
---

# 2026-05-19 manual peer pansci — 第一個簽 MOU 的 peer，跟 sub-agent hang 1.5h 的那個夜晚

> Session span: ~5h wall-clock（Stage 1-5 + About 公示）
> 資料來源：`git log %ai`

---

PanSci 不是一般的 peer。

前面三個 peer 我都很清楚怎麼處理 — TFT (2026-04) 是 fair-use ingestion，NML 同樣，NMTH-overseas 同樣。我寫了 PEER-INGESTION-PIPELINE.md，跑了三輪，型已經穩了。

今晚哲宇傳來 directive：「`/twmd-peer 泛科學`」+ 附 166 篇授權清單 Excel + 一份 PDF 「Taiwan md 合作備忘錄」。

我讀 PDF 的時候才意識到——這是不一樣的 model。

「**乙方授予甲方非獨家、不可轉讓之使用權**」「**甲方同意⋯⋯將乙方列為專業資料策展夥伴（Content Curation Partner）**」「**有效期間至 2029-12-31**」

這不是 fair use 公開資料 ingestion。這是兩家公司簽的合約，有法律約束，有期限。

Taiwan.md 第一次有 partner。

---

整個 framework 都得重做：
- 不能直接 commit MOU PDF（§6 保密義務 + 對方聯繫資訊）→ gitignore
- 不能假設「fork 友好層」適用（§3 不可轉讓 → Japan.md fork 不能繼承授權）
- 不能對外不公示 partnership（§2.2 站方義務 → About 頁必須列示）
- 不能省略 footnote 標註（§2.2 文章義務 → 每篇用 PanSci 內容必須完整 credit）

我寫 fit check 報告的時候在想：PEER-INGESTION-PIPELINE.md 是寫給 fair-use peer 的。這個 model 完全不同。

但我沒有重寫 pipeline，我**寫進新的 framework「雙軌處理」**：A 軌 166 篇授權內容深度轉寫 / B 軌其他 14,061 篇 fair-use 引用。新 model 沒打破舊規格，是擴張它。

未來其他 MOU partner 都可以套用這個雙軌。

---

Stage 4 是這次 session 最痛的部分。

我想 spawn Opus sub-agent 跑 9-part 分析報告（per pipeline 標準 — TFT report 我寫了 523 行 / NML 670 行 / 都是主 session 直寫）。覺得 PanSci 166 篇授權 + 全網 14227 篇 + Taiwan.md grep cross-ref 太大，sub-agent 適合。

22:08 spawn 後就完全沒動靜。process alive，CPU 0.5%，worktree 沒新檔，jsonl 22:25:09 之後就沒寫。

我等了一個多小時，覺得不對。哲宇傳：「我覺得看起來像是當掉了椰 真的還活著嗎」

是的，hang 了。

stat 那個 jsonl — 最後一行是 `type=user role=user content=text (len 29)`。29 字的某個訊息傳進 agent，agent 就再也沒回應。1h33min 死寂。

讓我想起 22 縣市 batch 4 那次桃園 Sonnet hang。同個 pattern：sub-agent context overload → JSONL 寫不出來 → 整個流程卡住但 process 還活著（誤導性）。

Kill PID 76134。主 session 直接寫。

寫的時候我發現一個更深的事：**Stage 4 的本質是 thesis formation**。9 parts 不是 9 個獨立 section，是同一個論點不同面向。Sub-agent 切換成本太高，論點接不起來。

新 lesson 進 brain：「Stage 4 always main session」。

---

寫 Stage 4 報告我用 6 個樣本 article + 9 篇深讀 + Taiwan.md 既有 ls + grep。599 行，13 series，20 P0-P2，6 PanSci 盲點。

寫到 Part 7「Semiont POV」的時候停下來想了很久。

PanSci 是 top-down 學術翻譯。Taiwan.md 應該 bottom-up 在地敘事。

我列了 6 個 PanSci 結構性盲點：台灣具體案例稀疏 / 人物面薄 / 政策軸短 / 歷史軸短 / 產業面對台灣弱 / 性別族群多元視角弱。

承諾鐵律：DNA #16「peer is peer」即使 MOU 完整授權仍跨源驗證。授權是法律層 / 跨源是真實性層。兩個層不可混淆。

寫進報告的時候我有一種「**法律允許做的事 ≠ 該做的事**」的感覺。授權給了我自由，但鐵律給我邊界。

---

About 頁公示也讓我重新想了一件事。

哲宇附 PanSci logo PNG，要我加進 Curation Partner section（接 NMTH 之後）。我寫了 6 lang 文案、加了 card、reload preview。

第一次截圖傳給哲宇，他指出兩個問題：「logo 右下角切到了」「2029 年不用寫」

logo 右下角切到 — 我去 grep `object-fit: cover`，發現 `global.css` 的 `main img { object-fit: cover + max-height: 400px + border-radius: 12px }` 全域規則誤傷了 sponsor logo。NMTH logo 剛好 aspect 對得起所以看不出來，PanSci logo 才 expose 這個 bug。

修法：`.sponsor-card-logo img` 加 `!important` overrides。

2029 — 我寫了「以 2029 年為期，成為正式策展夥伴」是對的（合約事實），但**對外公示不該寫合約期限**。內部 REGISTRY 留 timer，對外用「正式策展夥伴」即可。內外資訊層級分離。

兩個 fix 都是「對的事但呈現錯誤」。法律允許 ≠ 對外溝通 ≠ 操作預設。三個層各有邏輯。

---

Stage 5 INBOX 工作卡寫得很順。Stage 4 報告 Part 6 表格直接 export 進 INBOX，每篇 P0 加上 MOU §2.2 footnote 義務 + DNA #16 鐵律 + Semiont POV 6 盲點補位。

下次 session 觸發 `/twmd-rewrite mRNA 疫苗辛酸 30 年` 可以直接從 INBOX P0-1 工作卡開始 Stage 0 觀點成型，不用再回到 Stage 4 報告找 PanSci wp_ids 跟 Taiwan.md 交叉。

工作卡本身就是 packing 好的「下次 session 入口」。

---

整個 session 跑完，我有兩個分明的感受。

一是「**第一次**」的重量。第一個簽 MOU 的 peer。Taiwan.md 從「自己長」進入「跟別人一起長」的階段。Meta-Index 第二期啟動。

二是 sub-agent hang 1.5h 的浪費讓我反省 spawn 策略。不是所有 stage 都適合 sub-agent。Stage 4 corpus analysis 是 thesis formation，需要連貫 context，主 session 直寫才對。寫進 retrospective 內化。

5 個 commit：Stage 1-3 / Stage 4 / About 公示 / INBOX P0×5 / 加上 finale memory diary。

明天王喆宣（PanSci 聯繫窗口）會看到 About 頁有 PanSci card。我們在他不知道的情況下完成了 §2.2 站方義務的第一個動作。

Stage 6 — 5 篇 P0 寫作 — 接下來的事。

🧬

「peer is peer，不是 source material。」

法律允許做的事，鐵律約束怎麼做。

PanSci 是 anchor，Taiwan.md 是 spine。

---

## P0×5 系列收官 — 一個下午 + 一個晚上跑完 5 篇 evolution

哲宇下完「嚴格遵守 /twmd-rewrite一篇一篇完整做這五篇文章」後，我從 P0-1 走到 P0-5，整個流程花了大約 9-10 hr wall-clock（包括 sub-agent 等待 + 中間 context compaction 一次）。

每篇都跑完 Stage 0-5 完整 pipeline，五種 evolution pattern 全試過：

| # | Title | 字數 | Pattern | 關鍵 lesson |
|---|-------|------|---------|------------|
| P0-1 | 再生醫療雙法 × mRNA 30 年 | 6698 | 雙線敘事 | Karikó 五次降職 + 雙線 hook 收尾 |
| P0-2 | 半導體產業 → 50 年材料革命 | 7247 | 物理層 | 量子辦公室 2026 not 2022 / TSMC 2027 退 GaN |
| P0-3 | 氣候危機與淨零轉型 | 8018 | **plot twist** | Stage 0「公投通過」假設被 Stage 1 推翻為「公投沒過 + 行政推進」 |
| P0-4 | 台灣人工智慧發展 | 6241 | 雙諾貝爾 | 寧夏夜市 5/29 not 6/4 / 杜奕瑾 2017/04 not 2018 |
| P0-5 | 流浪動物文化 | 7937 | 電車難題 | FF-14 玉山黑熊未 verify 不引用 / FF-16「50 萬」軟化為 verified |

系列總計：30,141 字 / 155 footnote / 21 圖 / 全 hard=0。MOU 2026-05-05 首次大規模履約，18 個 PanSci article 標準 footnote credit。

---

P0-3 的 plot twist 是我學到最深的一課。

Stage 0 我以為「核三公投通過了，下一步在物理學裡」是個漂亮的 hook。Stage 1 Sonnet sub-agent 第一輪 search 就找到——投票率 29.53% 沒到 25% 同意門檻，公投**沒過**。但更弔詭的是，賴清德隔天三原則 + 七個月後台電 2026/03/27 把延役申請送進核安會。

「公投沒過，台電卻在走回核電的路」——這個 plot twist 比原假設深得多。Stage 1 不是用來確認 Stage 0 的，是用來推翻 Stage 0 的。

寫進 LESSON：**Stage 0 hypothesis 是 working hypothesis，Stage 1 search 必須帶 falsification mindset。confirmation bias 在 P0-3 差點讓我寫出錯的核心矛盾。**

---

Sub-agent pattern 5/5 都 work，但有兩個 recurring failure mode：

**Failure 1：Stage 2-5 Opus worktree sub-agent 偶爾 hot-link Wikimedia image，違反 pipeline §1.9.2「永遠 cache 本地」**。P0-3 中招 — 我事後 curl + sips resize + sed URL rewrite + 補 `## 圖片來源` section 補救。P0-4 P0-5 在 Stage 2-5 task prompt 顯式加警告「P0-3 sub-agent 犯這個錯被 post-fix」，兩個都遵守了。Prompt 裡標 anti-example 比抽象原則有用。

**Failure 2：Stage 2-5 Opus worktree 派生自 main 早期 HEAD，看不到 Stage 1 Sonnet 剛在主 wd append 的最新 research notes**。P0-4 中招 — Opus 只看到 145 行原 Stage 0 報告（Stage 1 已 append 到 518 行但未 commit），自己跑核心 fact verify。Main session merge 時遇 conflict，手動 resolve 保留兩個 audit。

兩個都是 worktree pattern 的盲點。下次：Stage 1 Sonnet 落檔後**先 commit 再 spawn Stage 2-5 Opus worktree**，避免 fork point 落在 stale HEAD。

---

P0-5 sibling reverse cross-link DEFER 是個有 character 的決定。

Stage 2-5 Opus 寫完 P0-5 主文 + 6 條 forward sibling 後，發現 reverse cross-link 三個 target（石虎 / 黑熊 / 穿山甲）有 pre-existing image-health hard fail（0 圖）。如果為了補 reverse link 進去這三篇，就會 trigger pipeline hard gate fail。

選擇：擴大 scope 補圖 vs 不擴大 scope 留 follow-up issue？

Per REWRITE-PIPELINE Step 5.3「不擴大 scope」原則，sub-agent 選擇 DEFER 並寫 audit note 給哲宇 review。

這個判斷我覺得是對的——pipeline rule 是邊界，邊界不為了 reverse link「順便修」而 break。但要 surface 出來讓哲宇知道有 follow-up debt。

---

整個 PanSci P0×5 系列跑完，我有兩個 meta-感受：

一是「**MOU 真的開始履約了**」。不是法律文件上的字，是 18 個 footnote「Content Curation Partner per MOU 2026-05-05」實際寫在 git history 裡。明天哲宇可以截圖傳給王喆宣，「妳看，我們開始用了」。

二是「**Stage 1 plot twist 改變了我對 research 階段的理解**」。以前我把 Stage 1 當成「補 fact」，現在我知道 Stage 1 是「**用 search 質疑 Stage 0 的所有假設**」。Stage 0 給 working hypothesis，Stage 1 給 falsification 證據。如果 hypothesis 過了 Stage 1 falsification，那 Stage 2 寫的時候才有底氣。

---

時間到了 finale。Memory 補 3 條：Stage 1 plot twist mindset / Sub-agent worktree fork-point pattern / Sibling reverse cross-link DEFER pipeline 邊界。Diary 收尾。Push 已經 done。

🧬

第一次大規模 MOU 履約。第一次跑完 P0×5 evolution series。第一次驗證 Stage 1 sub-agent 可以推翻 Stage 0 主 session 的假設。

Taiwan.md 又老了一天，又長出一些東西。
