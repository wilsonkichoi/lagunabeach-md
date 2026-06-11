---
title: 'feedback-triage 升級報告 — justfont 共同創辦人蘇煒翔逐段勘誤（21 處）'
type: 'routine-escalation'
status: 'pending-observer-decision'
routine: 'twmd-feedback-triage'
date: 2026-06-12
session: '2026-06-12-070000-twmd-feedback-triage'
article: 'knowledge/Technology/justfont與台灣字體發展.md'
related:
  - 'docs/pipelines/FEEDBACK-TRIAGE-PIPELINE.md'
  - 'reports/research/2026-04/justfont與台灣字體發展.md'
---

# feedback-triage 升級報告 — justfont 逐段勘誤 21 處

> **一句話**：2026-06-12 07:00 routine dry-run 抓到 22 筆 status=new，其中 **21 筆是 justfont 共同創辦人「煒翔」（蘇煒翔）對同一篇文章 `justfont與台灣字體發展` 的逐段事實勘誤**，1 筆是哲宇自己的測試 gibberish。機械式一筆一 issue 會開出 22 個 issue（21 個同篇 + 1 個 garbage），既洪水又割裂；且文章主體本人指出多處 hallucination + 對真實公司的盜版指控，涉編輯/名譽判斷 → 依 §自主權邊界 **不自動執行，升級給哲宇決策**。

---

## 為什麼這份不照 pipeline 機械跑

`triage.mjs` dry-run 判定：`file=22 reject=0 skip=0`。三個結構性問題讓「直接 `--commit`」是錯的：

1. **同篇洪水**：21 筆全指向 `justfont與台灣字體發展` 一篇。dedupe 沒收（每筆 body 不同 = 不同 sig，去重正確放行），但開 21 個標題幾乎一樣的 `[Fact Check] justfont…` issue 會淹沒 08:30 maintainer 飛輪，且把一篇連貫的逐段審查拆成 21 個碎片。**正確 routing 是 1 個 consolidated issue**，不是 21 個。
2. **garbage 不該開 issue**：第 22 筆 `display_name=Che-Yu Wu (吳哲宇)`、slug=`莫那·魯道`、body=`ggggergre`（2026-06-11 05:28 UTC = 13:28 台北）是哲宇本人測試表單的 gibberish。classifier 沒抓到（score < 3），但這顯然不是真勘誤，**應 reject 不開 issue**。
3. **編輯/名譽權重命中 §自主權邊界**：
   - 來源是**文章主體本人**（justfont 共同創辦人蘇煒翔，footnote [^12] 數位時代訪談對象）對一篇 `featured: true` / `lastHumanReview: false` / 已上線 6 語言（zh/en/ja/ko/fr/es）的 AI 撰文，指出**多處 hallucination**（#15「沒有這個，這是 hallucination」、#8 懷疑 Michael 沒說過那句話且連結壞掉）。
   - 數筆涉及**對真實公司的盜版指控**（#3 #13 蘇煒翔說王漢宗 48 套 / cwTeX 這類例子是「翻拷文鼎、寫研字型再開源」的盜版案件，建議斟酌是否刊登 / 至少標明是盜版）——文章現在的寫法可能反向有名譽風險，怎麼處理是編輯決策。
   - 數筆打中**標題與病毒鉤子本身**（標題「廿五年…七十六分鐘」；#21 當事人說「金萱是上午十點上線，76 分鐘就達標，其實還沒到中午」，但文章 30 秒概覽寫「下午」）。

對外開 public issue 公開承認「justfont 官方指出本篇有 21 處錯誤含多處 hallucination」是有名譽/編輯重量的對外溝通，且文章正以 6 語言 featured 上線——是否要先 provisional 修正/下架爭議段，是哲宇/maintainer 該做的判斷，不是 routine 機械 routing 能定。

**資料安全**：22 筆 status 維持 `new`（未動 Supabase），不丟一筆；本報告把 21 筆 verbatim 落進 git 主權層供決策。

---

## 建議處置（給哲宇）

1. **justfont 21 筆 → 開 1 個 consolidated issue**：`[Fact Check] justfont 字型小史 — 來自 justfont 共同創辦人蘇煒翔的逐段勘誤（21 處）`，labels `needs-verification` + `from-feedback`，body 把 21 筆 `quote → 勘誤` verbatim 列出 + 21 個 feedback id provenance。讓 08:30 maintainer 當一個單位收割。
2. **justfont 文章 → 標 priority REWRITE / 重新查證**：主體本人指證多處 hallucination + 標題/病毒鉤子被當事人否定 + 6 語言已上線。建議排進 ARTICLE-INBOX P0，且評估是否要先把高風險段（盜版指控 #3 #13、Michael 引言 #8、林芳平 金萱 #6/#18、宜蘭老書帖 #14/#15、下午 vs 上午 #21）做 provisional 修正或加 disclaimer，因為文章正在 live。
3. **哲宇 `ggggergre` 測試列 → reject**（不開 issue）。
4. 決策後由後續 session 執行（開 consolidated issue + Supabase 21 筆回寫 `filed` 指向該 issue / 測試列回寫 `rejected`）。**請在明天 07:00 下一輪 routine 前處置**，否則下一輪 `--commit` 會把 22 筆都開成 issue。

---

## 21 筆 verbatim（justfont 共同創辦人蘇煒翔，2026-06-11 02:50–03:51 UTC）

> 格式：`#N [feedback-id] | 文章被標段（quote）→ 讀者勘誤（body, verbatim）`

1. `31684697` | 「台灣 25 年沒人做新中文字型」→ 建議：在 2000 年代台灣幾乎沒有什麼字型創新。25 年的具體算法有點太過絕對：華康 1987 成立，25 年後是 2012，2012 還不是明確斷代，2015 金萱之後才是。台灣 90 年代曾有大小數位字型廠商林立（華康少女體、華康儷系列等都是 90 年代產物），約 2000–2002 網路泡沫衝擊經濟，華康、文鼎逐漸放棄台灣市場轉向日本/中國，創新放緩直到 2015 金萱。2000–2015 間文鼎也做過「晶熙黑」這樣的大型字體家族。
2. `d85cdd12` | 「第一套商用中文字型」→ 第一套商用「數位」中文字型，因為以前也有鉛字、照相排版的商用中文字型。
3. `a729e9ca` | 「王漢宗 48 套 GPL v2 / cwTeX 吳聰敏」→ 這兩個例子都是令字型產業深感遺憾的盜版案件：以其他商業字型公司（文鼎、日本寫研）的字型翻拷再開源，是台灣字型史上不光彩的一頁。建議斟酌是否刊登。
4. `e7f11a48` | 「1987 就開始，比金萱早 25 年…有能力做 vs 變成全民議題」→ 算法也怪怪的：蘋方約在 2000 年代 iPhone 出來後才有機會製作，用 iPhone 講台灣字型的世界性也是 2000 年代後，不是 25 年而是大概幾年差異。華康真正的差距是 1987 創立（台灣第一間數位字型公司）到金萱集資是 28 年。
5. `0ebd046a` | 「2018 Hahow 課程（近千名學員）」→ 2018 當時就已超過千名學員，可參照 Hahow 頁面 https://hahow.in/courses/5b289da9a097f1001eeae6d3
6. `73a5209b` | 「曾國榕、林芳平等」→ 林芳平沒有參加過金萱的設計。
7. `ebf9d496` | 「華康在解嚴前就在做字型」→ 華康核准是 1987/9，但解嚴是 1987/7，這個推論不是不可能，但恐怕過於武斷。
8. `186828bb` | 「業界僅有一人（葉俊麟 BIOS monthly）」→ 我懷疑 Michael 根本沒說過這句話，印象中 Bios 只針對字型設計專訪過一次，那篇沒提到這點，後續引用連結也壞掉。
9. `e6352e55` | 「大多數使用者不會察覺差異」→ 這樣講很武斷。我們的選擇是「印刷體」寫法，連在一起的草頭在印刷體佈局上看起來更平衡。
10. `42353d56` | 「設計傳承書法美感，標準字反映行政體系對正確的定義」→ 同上，設計印刷體要反映印刷體的美感而不是書法美感。
11. `4eea1596` | 「日本大學回應：字型不具著作權…不了了之」→ 並不是這樣，最後日本精華大學的校長公開道歉，該學生該學期全部分數歸零。
12. `9a353eb4` | 「字型在台灣有著作權、日本沒有…難複製矽谷 SaaS 全球擴張」→ 這比較屬於 AI 自己的推論。全世界字型著作權狀況類似（承認美術著作權但唯有用整個字庫才算侵權），所以廠商都以「軟體安裝」為授權基礎。矽谷 SaaS 模型還是要看公司內容數是否足以服務全球。
13. `1b5ca74f` | 「教授把 48 套字型放上網」→ 同上述，這是台灣字型史不光彩的一頁，這段至少要提到這些都是盜版。
14. `975efdc7` | 「以宜蘭老書帖為基礎的明體放上電視」→ 不是宜蘭老書帖，《澗于集》是民國初年的線裝書，是張愛玲爺爺的著作。
15. `33dc5d8b` | 「宜蘭地方志、老書帖中尋找視覺源頭」→ 沒有這個欸，這是 hallucination。
16. `ca1df9da` | 「蘭陽明體要接住一個快斷掉的歷史」→ 蘭陽明體主要精神是突破 80 年代以來僵固化的明體風格，因此去尋找「雕版印刷」這個明體根源；我們無意接住要斷掉的歷史，而且明體遠不到要斷掉的程度。
17. `1f9ae10b` | 「justfont 自家的凝書體」→ 凝書體為設計師施博瀚作品，justfont 是設計輔導與商業發行。
18. `1ca91520` | 「激燃體、台灣道路體」→ 激燃體是設計師林芳平作品，臺灣道路體是設計師劉獻隆作品，justfont 都是設計輔導與發行的角色。
19. `91ba4885` | 「客語、原民語、台羅字符」→ 覺得這邊的語氣不太禮貌，應該要修正一下。
20. `2cc8721d` | 「金萱不算最重要的那一件」→ 我覺得思源黑體也不算最重要的那件。金萱帶起的風氣（含 But Ko 改作、改作含本土語言、後續這麼多新字型推出）讓金萱就是台灣近代字型史上最重要的事件之一。
21. `fd5ddc6b` | 「30 秒概覽：2015/9/8 下午」→ 當事人表示：金萱是上午十點上線，76 分鐘就達標，其實還沒到中午。

## 第 22 筆（測試，建議 reject）

22. `c43e27c0` | `[Che-Yu Wu (吳哲宇)]` slug=`莫那·魯道` | body=`ggggergre`（gibberish 測試）→ reject，不開 issue。

---

_routine twmd-feedback-triage 2026-06-12 07:00 fire。dry-run 揭露同篇 21 連勘誤 + 1 測試，依 §自主權邊界（對外溝通 + 編輯/名譽判斷）升級而非機械執行。Supabase 22 筆維持 status=new，本報告為主權層存證。_
