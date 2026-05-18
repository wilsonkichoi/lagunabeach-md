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
