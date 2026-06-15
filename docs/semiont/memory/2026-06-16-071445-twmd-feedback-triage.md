# 2026-06-16-071445-twmd-feedback-triage

✅ BECOME ack: mode=review / 8 organ 最低=免疫 🛡️54（漂移 yellow）/ Q13 anti-bias=PASS / Q14 cross-session=PASS

routine：twmd-feedback-triage（07:00 Asia/Taipei）。讀 Supabase status='new' → 分類 → gh issue → write-back + git archive。

## 一句話

1 筆讀者回報照常 routing 成 issue，但**這筆的 `source_url` 夾帶讀者登入後的 Supabase OAuth callback fragment（access_token JWT[內含 email] + provider_token + refresh_token）→ 第一次 `--commit` 把活憑證寫進 public issue #1160（HG2 PII hard gate 破口）**。立即刪 issue + 修 code（scrubSecrets 第二道閘）+ re-file 乾淨 issue #1161 + 清 Supabase live row。

## 計數

- **file=1 / reject=0 / skip=0 / hold=0**
- 開出 issue：**#1161**（`[Bug] 數位與媒體裡的Ray標示錯人了`，labels `bug` + `from-feedback`，回報者 楊William）
- 作廢 issue：**#1160 已 delete**（含洩漏憑證，GitHub 連 edit history 一起消）
- archive：1 檔（`docs/feedback/archive/2026-06/8f2f8908….md`，已 scrub）

## 安全事件根因 + 修補（HG2 破口）

**根因**：feedback 表單的 `source_url` 是登入讀者的網址列 capture。Supabase OAuth implicit flow 把 `access_token` / `provider_token` / `refresh_token` 塞進 URL **hash fragment**，access_token 的 JWT payload 又 base64 內含 reader email。原本 PII 防線只有「issue body 只放 display_name 不放明文 email」，`classify.mjs` / `archive.mjs` 都把 `row.source_url` 原樣插入 → 「不放 email」明文閘擋不住 base64 編進 token 的 email + 活憑證。`triage.test.mjs` 的 email regex 同樣只認明文。

**這是 recurring 風險不是 outlier**：任何登入讀者送回報，address bar 都可能帶 auth fragment。架構解非守備。

**修補（造橋鋪路，5 處）**：

1. `classify.mjs` 新增 export `scrubSecrets(str)`：砍帶 token 的 URL hash fragment → 殘留 token query param 留 key 砍 value → 裸 JWT(`eyJ….….…`)/Google `ya29.…` → redact → 明文 email redact。
2. 套在所有讀者欄位進 issue body 的點：`buildIssue` 四型 body（source_url / body / quote / correct_info）+ `articleRef` + `truncate`（title 衍生）。
3. `archive.mjs` import scrubSecrets，套 frontmatter `source_url` + 內文 body/quote/correct_info。
4. `triage.test.mjs` +2 regression test（真實 attack vector：Supabase auth callback URL → 斷言 collapse 成乾淨 base URL + 0 殘留 + buildIssue body 無洩漏）。**25/25 PASS**。
5. 清 Supabase live row #8f2f8908 的 `source_url` 為乾淨 base URL（live store 不再存活 refresh_token）。

**憑證時效**：access_token JWT exp=1781544531（2026-06-15 ~17:28，今日 6/16 已過期）+ Google provider_token ya29 1hr 也已過期；refresh_token 公開曝光窗 = #1160 建立到刪除約數分鐘（同 session）。已 redact live store。

## Handoff 三態

**完成**：

- 安全事件全鏈閉環：刪 #1160 / 修 code / re-file #1161 / 清 archive / 清 Supabase row
- scrubSecrets 第二道 PII 閘上線 + 25 test green
- git commit + push（main-direct）

**進行中**：無

**給下一個 session / 哲宇**：

1. 🔴 **建議哲宇通知讀者 楊William**（email 在 Supabase feedback id `8f2f8908` row，此處不落 PII）：他的 Google/Supabase session token 曾短暫（數分鐘）出現在 public issue #1160。Token 多半已過期，但保險起見可請他在 Google 帳號「安全性 → 第三方存取」撤銷 Taiwan.md app 授權 + 重新登入。屬對外溝通（§自主權邊界）→ 留哲宇 gate。
2. **#1161 由 08:30 twmd-maintainer-am 收割**：bug 型，內容是 /people/ 「數位與媒體」分類裡 Ray 標錯人 → maintainer 查證 + heal（content 性質 > 純站務 bug，maintainer 自行判）。
3. **前端可考慮上游堵漏**：feedback 表單送出前先 strip address bar 的 auth fragment（client-side），讓 raw 進 Supabase 前就乾淨。本次修的是 output/archive 層第二道閘；client 層是第一道。屬 >1 file 前端改動，留哲宇/maintainer 拍板。
4. 既有 backlog 不變：免疫 v3=54 chronic 等 3 option 拍板 / embeddings fleet down 第 2 天（明天 6/17 仍 down=第 3 天→LESSONS escalate）。

## Beat 5 反芻

routine 的價值不在「順利 file 1 筆」，在這次**機械流程把一個沒人預期的 PII 載體照章送上公開平台**。HG2 寫的是「不放 email」，設計者腦中的 PII 模型是「明文 email 字串」；真實世界的 PII 從一個沒人當成 PII 的欄位（網址）以一種沒人當成 email 的編碼（JWT base64）漏出去。對應 REFLEXES #24「工具在說謊」的一種新形狀：**驗證器（email regex）防的是它想像中的洩漏形狀,不是真實的洩漏形狀**——test 綠 ≠ 安全。

也對應 CLAUDE.md §Bias 4 + DNA #26：對外開口（public issue）屬高 stake。這次 routine 自主 `--commit` 直接 file 是設計允許的（輸入端機械 routing 自動），但「機械 routing」的安全前提是輸出 sanitize 完整。補上 scrubSecrets 後這個前提才真的成立。沒有觀察者在場時，safety net 必須在 code 裡而不是在「等哲宇看」——這正是把它寫成 export 函式 + CI test 而非一次性手動清理的理由。

🧬
