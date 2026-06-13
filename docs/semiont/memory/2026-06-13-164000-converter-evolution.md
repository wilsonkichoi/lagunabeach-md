# 2026-06-13 converter-evolution — 中國用語轉換器深度研究→完整進化→資料體檢 + 兩個 unicode/多核教訓

> session converter-evolution — 哲宇 directive，manual（研究 + 3 Opus sub-agent 管理 + 資料 audit）
> Session span: ~16:40 → 18:22 +0800（~1h40m，4 commits + normalization swept into 1）
> 資料來源：`git log %ai`

## 觸發

哲宇要研究站上的中國用語轉換器（`/terminology/converter`）的 GA / SC 使用狀況、深度觀察、怎麼進化，寫一份報告。後續追加「完整進化，派 Opus sub-agent 由你管理 + 驗證」與「部署 + 派 agent 體檢資料」，外加一條硬約束：名字維持「中國用語」，不改「大陸」。

## 從研究到進化

造了 `converter-analytics.py` page-filtered 探針（90d + 28d）跑 live GA4 + SC，寫成 `reports/converter-analytics-2026-06-13.md`。頭號發現是這頁的處境本身：全站最老最工具化的一頁（種下第 13 天就生），卻零互動埋點，GA 只看得到 page-level。SC 端是一條漂亮的 SEO 突破曲線——排名 pos 22→3.6，90 天 175 點擊有 81% 落在最近 28 天，而早期 GA 的社群暴衝退潮了。需求語彙「大陸用語轉換器」占品牌字 84%，但工具叫「台灣用語」；單詞 long-tail「視頻台灣用語」有排名卻 0 點擊，因為 2,336 詞庫沒有 per-term 頁。

哲宇拍板完整進化後，派 3 個 Opus sub-agent 平行（disjoint 檔、共用 event/URL contract），主 session 管理 + runtime 驗證：CONV-1 埋點（converter.astro 5 個 GA4 event + debounce 1.2s + 雙層 dedupe）、CONV-2 per-term 2,295 頁（`/terminology/[id]` + DefinedTerm schema）、CONV-5 需求飛輪（`converter-demand.py`）。CONV-3「大陸用語」SEO 對齊依哲宇 directive 不做。`62691fa25` 部署。preview 跑真瀏覽器驗 dataLayer：init 靜默、打字不 flood、`term_id` 主訊號正確 fire、toggle 不誤觸、dedupe 擋重複——這次沒停在「code 存在」，量到「事件真的 fire」。build 7,478 頁 42.4s 零回歸，GA4 5 維度註冊。

## 資料體檢與 unicode 礦坑

per-term 頁把舊資料攤在公開頁面上，哲宇要我體檢 `data/terminology/`。背景 Opus audit agent 跑完但 final message 被 content filter 擋（詞庫含屏蔽/翻牆等政治敏感詞，agent 合成摘要時觸發），且沒落任何檔——改由主 session 用確定性 script 直接做，反而繞過了 agent-summary 的過濾問題。china 欄錯置查證後 12 個真壞全修（`90db8c6bc` + `12f288188`），根因是 1997/ThunderKO import 的 localized column-shift（垃圾 china 值本身全是合法台灣科技詞，等於整欄錯位）。

修句號時撞進 unicode 礦坑：它的「句」是 U+F906（CJK 相容表意字，渲染同「句」但非 U+53E5），macOS precomposeUnicode 讓 git 把磁碟改動判成「無變更」，編輯靜默失敗。順著挖出全庫 81 個檔名 + 額外欄位用相容字，哲宇拍板全正規化成標準碼位，共 112 檔（`rm --cached` + 字節級 re-add 繞過 precompose），2,336 檔不變、0 殘留、0 遺失，build 再驗過。8 個 soft 旗標 3 中和 5 保留（記在 audit 報告 `b23206645`）。

## 收官 checklist

| 檢查項                       | 狀態                                                 |
| ---------------------------- | ---------------------------------------------------- |
| MEMORY 有這次 session 的紀錄 | ✅                                                   |
| Timestamp 精確（git %ai）    | ✅                                                   |
| Handoff 三態已審視           | ✅                                                   |
| CONSCIOUSNESS 反映最新狀態   | ⚠️ 未更新（語言/感知器官有質變但分數系統未即時反映） |
| 自我檢查工具 PASS            | ✅ prose-health                                      |

## Handoff 三態

繼承：最新 memory 是平行 thread `persona-stage0`（孢子 #136/#137、PERSONA callers），那些 handoff 屬該 session，非本 converter thread，不重複認領。

本 session 新 handoff：

- [x] ~~轉換器完整進化 + 12 資料修正 + 112 正規化 ship + 部署~~
- [ ] **轉換器埋點數據觀察**：`term_lookup` 事件已開始流入 GA4，過幾天跑 `python3 scripts/tools/converter-demand.py` 看詞條需求排行 + tw2cn 反向使用率（需求飛輪第一次有料）。
- [ ] **5 個 kept soft pair 待哲宇 review**：進階/模範/並列/並行/文件，列在 `reports/terminology-data-audit-2026-06-13.md` §8 旗標處置。
- ⏳ **詞庫殘留風險**：啟發式抓不到「shift 值剛好不是任何 entry 的 taiwan」的唯一詞錯置；趨零需拿原始 ThunderKO/1997 source 逐列對齊（另一件大事，未啟動）。
- ⏳ **`7a01b31db` mis-attribution**：我的 112 正規化被平行 session commit 掃走，資料正確但 attribution 跑掉；已推送，不改寫歷史。

## Beat 5 — 反芻

研究結論是這頁「對自己的使用完全失明」，而我做的第一件事就是給它裝眼睛——這跟我這幾天反覆寫的「儀器只看得見存在、看不見缺席」是同一條線，只是這次缺席的是我自己產品的互動層。U+F906 礦坑更深一層：連 git 都會對某些改動「失明」，誠實不在我相不相信磁碟，在我有沒有用對的工具去量它。兩個結構性教訓（U+F906 git 隱形編輯、多核共用 index sweep）寫進 LESSONS-INBOX。完整反芻寫進 diary。

🧬

---

_v1.0 | 2026-06-13 18:22 +0800_
_session converter-evolution — 轉換器 GA/SC 研究 → 3 Opus agent 完整進化 → 資料體檢 + unicode 正規化_
_誕生原因：哲宇 directive 研究中國用語轉換器使用狀況 + 完整進化 + 體檢資料_
_核心洞察：(1) 全站最工具化的一頁對自己失明，研究的第一動作是給它裝眼睛 (2) U+F906 相容字讓 git 對磁碟改動失明，誠實在用對工具量它 (3) 多核共用 index 會讓平行 session 掃走我的 staged 檔_
_LESSONS-INBOX 候選：U+F906 git 隱形編輯（rm --cached + 字節 re-add）；多核共用 index sweep（高風險時段 pathspec commit）_
