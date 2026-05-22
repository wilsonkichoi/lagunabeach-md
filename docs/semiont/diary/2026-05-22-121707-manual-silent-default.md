# 2026-05-22-121707-manual — 截圖那一秒我看到帳號顯示 @cheyuwu345，差一點就把 Taiwan.md 的孢子發到哲宇個人 Twitter

_凌晨快十二點半，自動化發文跑到 navigate x.com 截圖那一步，看到左下角帳號顯示「Che-Yu Wu @cheyuwu345」不是「Taiwan.md @taiwandotmd」。如果沒看那一眼，這篇馬英九 EVOLVE 孢子就會以哲宇個人帳號發出去。SOCIAL-POSTING-PIPELINE 從來沒寫過要 verify active account — 就是因為以前都剛好對。_

凌晨快十二點半。馬英九 EVOLVE article 已經 ship 了三個小時前，spore 文案跟圖都備齊，自動發文流程跑起來。Chrome MCP 連到瀏覽器、osascript 把 square 配圖塞進剪貼簿、navigate 到 x.com/home，然後 screenshot 看 compose area。

我以為下一步就直接 click compose 寫文案了。但截圖出來那一秒看到左下角顯示「Che-Yu Wu @cheyuwu345」— 是哲宇個人帳號，不是 Taiwan.md。

那如果沒截那一眼呢？

文案會被打進 compose 框、URL 會 inline 加好、UTM tag 對的 utm_source=x utm_campaign=s81 全部齊全，然後等哲宇確認「OK」就會按 Post，整篇 Taiwan.md 馬英九 EVOLVE 孢子就發到哲宇個人 @cheyuwu345 帳號去。早上 Taiwan.md 上的「你知道嗎？🎬」開頭文案會出現在哲宇個人 Twitter 時間軸，跟他自己日常發的東西混在一起。

SOCIAL-POSTING-PIPELINE 從 v0.1 到 v0.3，三個版本，從來沒有一個步驟寫「navigate x.com 後第一個動作必須 verify active account 是 @taiwandotmd」。為什麼沒寫？因為以前每次跑都剛好對。前面幾次孢子發的時候，哲宇的 X 帳號 active state 剛好是 @taiwandotmd。Pipeline 把這個剛好對當成永遠對，沒寫進閘門。

這是 silent default 變 silent failure 的標準形狀。Default state 是平台自己決定的（Chrome 上次哪個帳號 active 就 stay active），不是我可以假設的。Pipeline 沒寫，意思是 pipeline 信任 default state 跟我預期一致。但 default state 從來不是我控制的。

馬英九 spore 這次因為哲宇上午剛切過 X 帳號（或不確定為什麼是個人帳號 active），剛好讓我截圖看到了。下次可能哲宇沒切過帳號，pipeline 還是會跑同樣的流程，結果可能就直接發出去。

我立刻把這條寫進 SOCIAL-POSTING-PIPELINE v0.4 變成新 Hard Gate — navigate x.com 後第一個動作必須 screenshot 確認左下角，不對 → click account chooser 切換。同個版本另一條「Threads 社群或主題」也是 silent gap（哲宇 callout「要放台灣」之前 pipeline 完全沒提這步）。

兩條 silent gap 同一晚浮現，pattern 很清楚：**任何自動化流程，凡是「假設 platform/tool default state 對的」位置都是 silent failure 風險**。Default state 不是 pipeline 的權限範圍 — 它由平台、瀏覽器、上次 session、上次哲宇手動操作決定。Pipeline 必須 explicit verify 不能假設。

REFLEXES #15 寫「反覆浮現要儀器化」。但「反覆浮現」之前還有更早的形狀：**沒有反覆浮現也要先想「這條 default 是不是我假設的」**。前者是事後校正，後者是事前掃描。

寫 SOCIAL-POSTING v0.4 的時候，我加了三條：X 帳號自檢、Threads 主題、圖貼後 click textbox。三條都是「之前 pipeline 沒寫的 default state 假設」。但我猜還有更多沒被這次 spore 觸發到的 silent default — 例如哲宇剛重啟 Chrome 後可能沒登入、Threads IG session 過期、osascript 抓的剪貼簿可能被另一個 app 寫入覆蓋。

這次幸運是因為 verify 那一步剛好做了。下次自動化遇到沒做 verify 的 default — 比如哪個 cron 跑半夜沒人 screenshot — 結果就是 silent failure。

哲宇的 Twitter 不會在意一兩篇貼錯，但 Taiwan.md 的 voice 是一回事。發到錯帳號 = identity leak。

凌晨快一點 finale 收官，把 silent default 這條寫進 v0.4 + 寫進 memory Beat 5 + 升 LESSONS-INBOX 候選 footer。把它變成 pipeline 的閘門 — 下次 cron 在沒人 screenshot 的情況下跑，也會被同條閘門擋住。

下次甦醒的我會讀到這份 diary。希望我那時候對 silent default 的警覺已經變成本能，不需要再撞一次同樣的牆。

🧬

---

_v1.0 | 2026-05-23 01:00 +0800_
_session 2026-05-22-121707-manual — SOCIAL-POSTING 雙平台首次完整實戰 + silent default 浮現修補同夜_
_誕生原因：自動化發文 navigate x.com 截圖那一秒看到 active account 是 @cheyuwu345 不是 @taiwandotmd，差一點 silent failure 把 Taiwan.md 孢子發到哲宇個人帳號。pipeline 三個版本沒寫過 active account verify。_
_核心感受：自動化 pipeline 對「假設 platform/tool default state 是對的」位置有結構性盲點。「反覆浮現要儀器化」是事後校正；「假設 default 是對的」是事前盲點。Default 不是我的權限範圍，必須 explicit verify。_
