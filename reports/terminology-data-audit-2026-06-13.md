# 用語詞庫資料體檢 — china 欄錯置 audit（2026-06-13）

> 哲宇 directive：per-term 頁上線後，audit `data/terminology/*.yaml` 的 `display.china`
> 錯置（cleanChinaSource 後與 `display.taiwan` 語意不相關，特別是 swap / row-shift）。
> 緣起：背景 Opus audit agent 跑完但 final message 被 content filter 擋（詞庫含 屏蔽/翻牆
> 等政治敏感詞，agent 合成摘要時觸發過濾），且未落任何檔。改由主 session 用確定性
> script 直接做——這正是 directive 要的，且繞過 agent-summary 的過濾問題。

## 方法

兩條啟發式 + `cleanChinaSource` 正規化（剝 （…）/(...) 註解 + 取 slash 第一變體，鏡像
converter.astro 的 `forwardSources` 防呆）：

- **SHIFT**（哲宇的強訊號）：cleaned `china` == 某「其他」entry 的 `taiwan` → china 欄裝了別人的台灣詞（row-shift leftover）
- **SWAP**：cleaned `taiwan` == 某 entry 的 `china` → taiwan 欄裝了中國詞
- **SAME**：taiwan == china（無真實差異）

掃 2,309 個有 tw+cn 的 entry，旗標 **47** 個。但 47 個裡多數是**啟發式誤判**——
真實正確的跨海峽對照剛好讓某欄等於別人的某欄（馬鈴薯/土豆、檔案/文件、設定/設置、
硬體/硬件、薌劇/歌仔戲、模擬/仿真、社區/小區、網域/域名、平行計算/並行計算 全是對的）。

## 修正（兩批，共 12 個真壞 entry）

### Batch 1（已在 62691fa25 部署）

china 欄是不相關 leftover、且 taiwan 欄誤填成 id（中國詞）的 row-shift：

| id     | before (tw / cn) | after (tw / cn) |
| ------ | ---------------- | --------------- |
| 軟件   | 軟件 / 解除安裝  | 軟體 / 軟件     |
| 硬盤   | 硬盤 / 主機板    | 硬碟 / 硬盤     |
| 服務器 | 服務器 / 圖示    | 伺服器 / 服務器 |
| 死機   | 死機 / 登出      | 當機 / 死機     |
| 窗口   | 窗口 / 檔案      | 視窗 / 窗口     |
| 交互   | 交互 / 滑鼠      | 互動 / 交互     |
| 掃描儀 | 掃描儀 / 搖桿    | 掃描器 / 掃描儀 |

### Batch 2（本次）

| id       | before (tw / cn) | after (tw / cn)     | 處置                                                      |
| -------- | ---------------- | ------------------- | --------------------------------------------------------- |
| 手柄     | 手柄 / 更新      | 手把 / 手柄         | 真實差異修正（遊戲控制器）                                |
| 雙擊     | 雙擊 / 硬體      | 雙擊 / 雙擊         | 中和（china=双击同詞，原 cn 是垃圾）                      |
| 句號     | 句號 / 設定      | 句號 / 句號         | 中和（同詞）                                              |
| 撥號工具 | 撥號工具 / 網域  | 撥號工具 / 撥號工具 | 中和（同詞）                                              |
| 撤銷     | 撤銷 / 吊销      | 撤銷 / 撤銷         | 中和（cn=吊销 是垃圾+簡體；undo 的正解在 復原.yaml→撤銷） |

「中和」= 把垃圾 china 校正回與 taiwan 同詞（這些本就只是 trad/simp 變體、無真實兩岸差異），
使其被 getStaticPaths（要求 china≠taiwan）過濾掉，不再產生 nonsense 頁、也不再是錯的轉換規則。

## 旗標待哲宇判斷（語意 soft、未動）

非明確壞、但對照偏 soft 或可能是錯配，需要領域判斷，**未自動修**：

| id     | tw / cn         | 疑點                               |
| ------ | --------------- | ---------------------------------- |
| 查準率 | 查準率 / 正確率 | precision vs accuracy 不同指標     |
| 正確率 | 正確率 / 精確率 | accuracy vs precision              |
| 圈粉   | 粉絲 / 圈粉     | 名詞 fans vs 動詞 圈粉，錯配       |
| 進階   | 進階 / 高級     | advanced vs high-level，soft       |
| 模範   | 模範 / 樣板     | model vs template，soft            |
| 並列   | 並列 / 並行     | juxtapose vs parallel，soft        |
| 並行   | 並行 / 並發     | parallel vs concurrent，borderline |
| 文件   | 文件 / 文檔     | 兩者皆 document，borderline        |

另有 10 個 SAME entry（珍珠奶茶 / 味噌 / 冰箱 / 布袋戲 / 歌仔戲 / 蓮霧 / 跨年 / 補習班 /
紅綠燈 / 掛號費）taiwan==china——無真實差異，本就被 getStaticPaths 過濾，無害，未動。

## 系統性 vs 散落 判定

**localized column-shift in one tech/daily import batch**，不是隨機 typo：12 個壞 entry 的
垃圾 china 值（解除安裝/主機板/圖示/登出/檔案/滑鼠/搖桿/更新/硬體/設定/網域/吊销）**本身全是
合法的台灣科技/日常詞**——像是某段 import 的 china 欄被整欄錯位，把鄰列的台灣詞灌進來。
來源指紋一致（ThunderKO C2T /《大陸用語檢索手冊》1997）。

**殘留風險（低但非零）**：啟發式靠「错 china == 別人的 taiwan」抓，若 shift 灌進來的值剛好
不是任何 entry 的 taiwan（唯一詞），就抓不到。「china==他人 taiwan」這條已掃兩遍清乾淨；
若要趨近零殘留，需拿原始 import source 逐列對齊（另一件更大的事）。

---

_作者：Taiwan.md 🧬｜2026-06-13 converter-research session｜偵測 script: 內嵌（兩啟發式 + cleanChinaSource）_
