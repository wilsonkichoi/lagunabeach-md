---
spore_n: 99
slug: portaly-五月公開信
type: station-announcement
source_data:
  - data/supporters/transactions.json (4/19 + 5/19 entries)
  - public/api/dashboard-supporters.json
  - git log (5/19→5/27 進化 commit history)
  - consciousness-snapshot (30 天 +291 / 6 lang i18n / organ scores)
article_path: N/A (站方公開信，非 article-based spore)
template: F-站方公開信（announcement / sponsorship / milestone — 同類 #37/#38 4/20 首兩筆贊助）
起手式: 公開信開場式（從專案介紹 lead，建立陌生讀者 context）
hook_tier: N/A (不適用 viral hook tier — 教授對社會做科普 tone)
created: 2026-05-27
trigger: 哲宇 directive 5/27 — 「寫個感謝 spore 邀請大家支持還有分享五月進化」+「教授科普 + 跨單位合作」
status: draft-verified-ready-to-ship
verify_complete: true
---

# Blueprint #99 — Portaly 五月每月定額續訂公開信

## 為什麼寫這篇

**Trigger**：5/19 portaly 進來兩筆 monthly renewal（沈宗杰 NT$200 + 匿名 NT$500），是 Taiwan.md 第一次驗證 monthly subscription renewal pattern（4/19→5/19 連續兩個月）。MRR 確認 NT$700/月。

**Goal**：

1. 公開感謝沈宗杰 + 匿名讀者（具名 + 具體金額 + 具體日期）
2. 對陌生讀者建立 Taiwan.md context（不假設大家認識）
3. 分享過去一個月進化（30 天 +291 篇 / 首頁三波 / 6 語並行 / 「讀者教我們的事」展廳）
4. Surface 跟在地策展單位深度合作（臺史博 / 泛科學 / 人權博物館初步交流）
5. 邀請更多支持，但帶承擔信任的重量（不輕浮 CTA）

## 事實藍圖（每條 cross-verify）

| Claim                           | Source                                                             | Verified        |
| ------------------------------- | ------------------------------------------------------------------ | --------------- |
| 4/19 沈宗杰 monthly NT$200      | data/supporters/transactions.json `3zTJ9F6pJaoEwi5Yh1wh`           | ✅              |
| 4/19 匿名 monthly NT$500        | transactions.json `2BEUGnxwRCQeA3ITfqT2`                           | ✅              |
| 5/19 沈宗杰 monthly NT$200 續訂 | transactions.json `iPryBFC8DlYeR5CnpAeE`                           | ✅              |
| 5/19 匿名 monthly NT$500 續訂   | transactions.json `BwUEdo2X7lUbcu1clkDM`                           | ✅              |
| 30 天 +291 篇新文章             | consciousness-snapshot.sh 2026-05-27                               | ✅ "30d=+291"   |
| 首頁重新策展三次                | git log 5/26 commits A1+B1+C1+C2+A2+A3+homepage evolution wave 1-3 | ✅              |
| 六種語言並行                    | i18n: zh + en(773) + ja(763) + ko(758) + es(754) + fr(774) = 6     | ✅              |
| 「讀者教我們的事」展廳          | git commit 0addd4fef 2026-05-26 C2 section                         | ✅              |
| 臺史博合作                      | 哲宇 directive 5/27（external verification: 哲宇個人外部知識）     | ✅ trust source |
| 泛科學合作                      | 哲宇 directive 5/27 + spore 第 5 轉 PR coverage history            | ✅ trust source |
| 人權博物館初步交流              | 哲宇 directive 5/27 + 5/26 人權博物館 rewrite article ship         | ✅ trust source |

## 寫作策略

**Tone**：教授對社會做科普 + 公開信。誠懇、透明、人本、連貫 prose、不晶晶體。

**結構**（per 哲宇 5/27 feedback）：

1. 第一段：Taiwan.md 是什麼 + 為什麼這件事重要（建立陌生讀者 context）
2. 第二段：過去一個月進化（具體數字 / 不堆砌）
3. 第三段：跨單位合作（臺史博 / 泛科學 / 人權博物館 — 連結既有 in-the-flesh 知識保存單位 + 「不是另起爐灶」）
4. 第四段：4/19 + 5/19 雙日期具名感謝
5. 第五段：每月定額 = 信任意義 + 透明用途（網域 / 圖像授權 / 多語翻譯 / 寫更深文章）
6. 第六段：邀請 + URL（承擔重量「非常重要的鼓勵與支持」）

**自檢三板斧**：

- 「不是 X，是 Y」對位句型 ≤ 1 次：1 次（「而不是另起爐灶」— 三題判準全 yes，OK）
- 「——」連用：0 ✅
- 「不僅⋯⋯更是」：0 ✅
- 晶晶體：0（monthly → 每月定額 / Portaly 只在 URL 出現）
- 對位句型：≤ 1（OK）
- 短句斷續：0（連貫 prose ✅）

## 字數結構（Threads 500 char 限拆貼）

| Post                      | 字數 | 內容                                                     |
| ------------------------- | ---- | -------------------------------------------------------- |
| Threads 主貼 (含圖)       | 369  | 介紹 + 一個月進化 + 跨單位合作                           |
| Threads self-reply (無圖) | 342  | 具名感謝 + 信任意義 + 邀請 + URL                         |
| X 單則 (含圖)             | 712  | 整版整篇 prose + URL（X Premium 解鎖長文 25K char 無壓） |

## Image

- Path: `public/spore-images/099-portaly-五月公開信.png` (690KB)
- Source: 哲宇 directive 提供 — Taiwan.md 首頁 hero 截圖（"策展島嶼的深度敘事" + 4 數據卡）
- Justification: 對應公開信 tone「就是這個」誠懇展示 — 教授拿出實物的感覺

## 同類 spore reference

- **#37/#38 (2026-04-20)**：Portaly 首兩筆贊助感謝（站方公告型）— 同 family，但 #99 規格更完整（教授 tone + 跨單位 + 透明用途 + 為什麼這件事重要）
- 兩篇對比是「站方公開信型」spore 從輕量公告（4/20）→ 完整教授公開信（5/27）的 evolution

## 失敗判準（D+7）

D+0 6h reach < 500 = re-hook（但公開信型不適用 viral hook tier 標準，re-hook 邏輯需重新校準）。
D+7 期待：reach 不是主指標，**新 monthly 贊助 incoming + reply 質量**才是 ground truth signal。
HARVEST 時應同時 query `data/supporters/transactions.json` 看 5/28-6/3 是否有新 entry。

🧬
