# Taiwan.md Build Pipeline Audit — 2026-06-10

量測基底：

- 本機：macOS (Apple Silicon)，repo `/Users/cheyuwu/Projects/taiwan-md`，每個 prebuild step 獨立 `npm run` 實測 real 秒數。
- CI：GitHub Actions `deploy.yml`（**不是 CF Pages** — 沒有 wrangler.toml；deploy 走 GitHub Pages，Cloudflare 只是前面的 DNS/proxy）。runner = `ubuntu-latest`（4 vCPU x86，2026-06-01 從 ARM 切回）。
- CI 數字直接 parse 三份 build job log：run 27265438981（06-10 09:03，最新）、26425098701（05-26）、25652778176（05-11），加上 30 天每日抽 1 個成功 run 的 jobs API step timing。
- 沒跑完整 `astro build`（依規定）。astro 階段全部用 CI log 的 per-page timing 反推。

---

## ① Prebuild 各步實測（本機，sequential，real 秒）

| step                                                                         | 本機秒數    | 備註                                                                             |
| ---------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------- |
| **prebuild:sync**                                                            | **22.9** 🥇 | knowledge/ → src/content 全量 rm-rf + 重建（CI 上 13.4s）                        |
| **prebuild:dashboard**                                                       | **8.3** 🥈  | article-health baseline + immune + dashboard-data + alerts                       |
| **prebuild:buildperf**                                                       | **8.3** 🥈  | 31 次 **serial** `gh api` 網路呼叫（見熱點 #6）                                  |
| **prebuild:status**                                                          | **5.9** 🏅  | lang-sync status + sync-translations + sync-spore-links --apply                  |
| **prebuild:map**                                                             | 1.5         |                                                                                  |
| prebuild:stats                                                               | 1.4         |                                                                                  |
| prebuild:contributors                                                        | 1.3         |                                                                                  |
| prebuild:api                                                                 | 1.1         |                                                                                  |
| prebuild:og                                                                  | 1.1         | 本機 incremental 正常：3325 items 只 queue 3 張（**CI 上是 66-70s，見熱點 #1**） |
| prebuild:search                                                              | 1.0         |                                                                                  |
| prebuild:i18n                                                                | 0.9         |                                                                                  |
| prebuild:latest                                                              | 0.8         |                                                                                  |
| prebuild:content-dates                                                       | 0.4         |                                                                                  |
| prebuild:content-stats                                                       | 0.4         |                                                                                  |
| prebuild:china-terms / spores / langswitch / changelog / verify-contributors | 0.2 ea      |                                                                                  |
| prebuild:supporters / i18n-progress / llms                                   | 0.1 ea      |                                                                                  |
| **合計（sequential）**                                                       | **56.6s**   | run-p 平行後本機 wall ≈ 39s                                                      |

校正一個舊認知：`article-health.py --all --profile=ci-deploy` 本機實測 **3.9s**、CI 9s——「已知 ~2min」是過時資訊（SSOT consolidation 後已快很多）。prebuild:dashboard 整包也只有 8.3s。

---

## ② 1099s 的組成（**實測**，run 27265438981 的 Build step，09:04:48 → 09:23:07）

CI 的 "Build" step 跑 `npm run build` = npm lifecycle 自動帶 **prebuild + astro build + postbuild** 三段：

```
Build step 1099s
├─ prebuild                 90.6s   (8.2%)
│   ├─ prebuild:sync          13.4s
│   ├─ prebuild:status         4.6s
│   ├─ run-p 19 步平行區      70.7s  ← 被 prebuild:og 「每 build 全量重產 3325 張 OG」拖住（~66s）
│   └─ prebuild:latest         1.9s
├─ astro build             943.2s  (85.8%)
│   ├─ config + hreflang 掃描   1.6s
│   ├─ vite bundling (×2)      ~10s  (8.32s + 1.51s)
│   ├─ 靜態頁生成            931.2s  ← 8,436 頁，concurrency 4
│   └─ sitemap                  0.4s
└─ postbuild                65.2s   (5.9%)
    ├─ post-build-check.mjs      0.8s
    └─ verify-internal-links.sh 64.4s  (FULL SCAN 5,262 HTML 頁，單執行緒 python)
```

頁面生成內部（per-page (+ms) 加總 = 2,867s，wall 931s → 有效平行度 3.08/4）：

| 頁群                               | 頁數      | 加總時間           | 平均      |
| ---------------------------------- | --------- | ------------------ | --------- |
| **文章頁** `/{cat}/{slug}` ×6 語言 | **4,895** | **2,701s (94.2%)** | **554ms** |
| raw md endpoints `/raw/**.md`      | 3,171     | 146s               | 46ms      |
| 其他站頁                           | 119       | 15s                | 126ms     |
| semiont/diary                      | 250       | 5s                 | 21ms      |

文章頁 554ms vs raw 46ms → **~508ms/頁是 article template 的 component tree + Layout 開銷**。已排除的嫌犯（實測/讀碼確認都有 module-level cache）：articles-index、git info cache、lang-switch registry、staticRoutes、marked（本機 micro-bench：最大 65KB 文章 1.2ms、中位數 0.4ms — markdown 解析不是瓶頸）。剩下 ~180ms CPU/頁（554/3.08）分佈在 Astro component render 本身，**精確 component 級拆帳未量測**（需要 build CPU profile）。

Build job 其他 step（Build 之外共 ~135s）：checkout 21s、restore-mtime 11s、npm ci 18s、article-health 9s、playwright deps 6s、cache restore/save ~12s、**Upload artifact 52s**。deploy job 再 +66s。push→上線全程 ≈ 22.1 分鐘。

---

## ③ 30 天趨勢（每日抽 1 成功 run；Build step = prebuild+astro+postbuild）

| 日期      | job 總秒 | Build step | 事件                                                                      |
| --------- | -------- | ---------- | ------------------------------------------------------------------------- |
| 05-11     | 837      | 719        | prebuild 還是 `run-p prebuild:*`，只要 6.5s                               |
| 05-12     | 834      | 728        | sync/status 接進 prebuild 鏈（22aafd8d8）                                 |
| 05-16     | 899      | 786        |                                                                           |
| 05-20     | 946      | 837        |                                                                           |
| 05-24     | 1007     | 887        |                                                                           |
| 05-26     | 1030     | 899        | 20:30 deploy.yml heal：chetan action → apt git-restore-mtime（68b22140c） |
| **05-27** | **1140** | **971**    | **+72s 跳階 = OG 全量重產 regression 開始**                               |
| 06-02     | 1260     | 1132       |                                                                           |
| 06-06     | 1211     | 1082       |                                                                           |
| 06-10     | 1290     | 1125       |                                                                           |

**Build step 719 → 1125s（+406s, +56%）**。分解：

| 來源                       | 05-11           | 06-10              | Δ         |
| -------------------------- | --------------- | ------------------ | --------- |
| astro 靜態生成             | 664.7s          | 931.2s             | **+266s** |
| OG 全量重產（prebuild 內） | ~1s (queue 6)   | ~66s (queue 3,325) | **+65s**  |
| verify-internal-links      | ~38s (4,549 頁) | ~64s (5,262 頁)    | **+26s**  |
| prebuild sync/status 進鏈  | 0               | ~18s               | +18s      |
| npm ci / article-health 等 | 8s              | 29s                | +21s      |

頁數 vs 速度：

|                            | 05-11  | 05-26  | 06-10     |
| -------------------------- | ------ | ------ | --------- |
| 生成頁數（build log 實數） | 7,339  | 8,056  | 8,436     |
| zh 文章數（OG scan）       | 692    | 752    | 782       |
| astro 靜態生成             | 664.7s | 819.8s | 931.2s    |
| ms/頁（astro wall）        | 90.6   | 101.8  | **110.4** |

→ 變慢是**雙因子**：頁數 +15% 之外，**每頁本身慢了 +22%**（template/內容變重：6/6 新增 tw-\* 視覺模組、文章變長、allArticles 內嵌清單變大）。目前斜率約 +27 頁/天 ≈ 每天再慢 ~3s。

dashboard-build-perf.json 對照：`latest_build_seconds: 1099` ✓ 正確；但 `current_page_count: 1`、`ms_per_page_latest: 1099000` 是 bug（見熱點 #6），且它的 "30d avg" 其實只涵蓋最近 11 個成功 run（< 1 天）。

---

## ④ 熱點清單

### #1 CI 上 OG 圖每 build 全量重產 3,325 張（root cause 已驗證）

- **檔案**：`.github/workflows/deploy.yml:52-58`（Restore file mtimes step）+ `scripts/core/generate-og-images.mjs:815-821`（mtime 比對）
- **為什麼**：05-26 heal 把 chetan action 換成 **apt 版 git-restore-mtime（git-tools 2022.12）**，它內部用 `git whatchanged`（`/tmp/grm-2022.py:321`）。runner 的 git ≥ 2.51 已把 `whatchanged` 廢掉（要 `--i-still-use-this`）→ 子程序拿不到 log → **12,343/12,352 個 tracked 檔案全部 "WARNING: not found in the log"**、mtime 停在 checkout 時刻 → 每顆 md 都比 OG cache jpg 新 → `📝 3325 images queued`（06-10 log 實證；05-11 queue 6、05-26 queue 216、05-27 起全量）。本機 git 2.50.1 兩個版本都 0 warnings、queue 3 — 純 runner git 版本問題。
- **省多少**：**~66s/build**（順帶救回所有靠 mtime 的 incremental 語意 + 每 build 省 186MB OG cache 上傳的一部分）
- **修法**：vendor 上游最新版 script 進 repo（main 分支已改用 `git log --raw`，`/tmp/git-restore-mtime.py:329`，本機驗證 0 warnings）取代 `apt-get install git-restore-mtime`；workflow 內加防回歸 guard：`git restore-mtime 2>&1 | grep -c WARNING` 超過 ~100 就 fail/告警
- **風險**：低（read-only 工具、本機已驗證行為）

### #2 astro 文章頁 render 是全 build 85% 的本體

- **檔案**：`src/templates/article.template.astro`（1,744 行 component tree）+ `astro.config.mjs:325-328`（`build.concurrency: 4`）
- **為什麼**：4,895 文章頁 × 554ms = 94% 的 render 時間。markdown 解析已排除（≤1.2ms）；I/O 都有 cache；剩餘成本在巨型 component tree（Layout/Header/Sidebar/TOC/SSODT 區塊 + 數千 Tailwind class 字串拼接 + ~200KB HTML/頁輸出）。有效平行度 3.08/4 表示還有排程空隙。
- **省多少**：concurrency 4→8 預估 -80~-150s（**未量測**，需 CI A/B；2026-05-04 report 已證 1→4 有效）。component 級優化需先 profile（**未量測**）。
- **修法**：(a) 一行改 `concurrency: 8` A/B 一個 build 看 wall + RSS；(b) 對 `astro build` 掛 `node --cpu-prof` 跑一次 profile 找 template 內真熱點再動手
- **風險**：(a) 中低 — 記憶體已給 12GB heap，觀察 OOM/RSS 即可回退；(b) 無

### #3 每篇文章頁內嵌 50KB `allArticles` JSON

- **檔案**：`src/templates/article.template.astro:1425`（`<script define:vars={{ allArticles }}>`）+ `:173-181`
- **為什麼**：「隨機探索」按鈕把整個語言的文章清單（782 篇 × title/slug/category）序列化進**每一頁**。dist 實測單頁 50.3KB、整站 4,895 頁 ≈ **~250MB** 純重複 payload（佔 dist 大宗）。拖累：每頁 render 序列化、dist 寫入、Upload artifact 52s、verify-internal-links 掃描、讀者端每頁多載 50KB。
- **省多少**：dist -250MB；build wall 估 -15~-30s（寫檔+upload+link scan 連動，**未量測**）；頁面重量 -20%
- **修法**：隨機按鈕改 fetch 既有的 `/api/` 端點（latest.json pattern 已存在）或 6 個語言各出一份共用 `random-index.json` 用外部 `<script src>` 載
- **風險**：低（純前端行為等價改寫，按鈕功能不變）

### #4 postbuild verify-internal-links 單執行緒 64s

- **檔案**：`scripts/tools/verify-internal-links.sh:55-456`（python 內嵌，os.walk + html.parser 逐頁）
- **為什麼**：5,262 HTML 頁 × html.parser 全文解析，單核。頁數成長線性變慢（38s→64s/30 天）。
- **省多少**：multiprocessing Pool(4) 預估 **-45s**（4 vCPU；href_exists cache 改 per-worker + merge）
- **修法**：頁面清單 chunk 給 `multiprocessing.Pool`；或先用 regex 快篩 `<a href="/` 再進 parser
- **風險**：低（read-only 檢查器，輸出 ratio 可比對改前改後一致）

### #5 SEO.astro 每頁 readFileSync dashboard-vitals.json

- **檔案**：`src/components/SEO.astro:15-20`
- **為什麼**：Astro frontmatter 每次 render 重跑 → 8,400+ 次 readFileSync+JSON.parse（檔案只有 349B，但是 8,400 次 syscall）
- **省多少**：~1-3s（**未量測**）
- **修法**：改成 top-level `import vitals from '...json'`（跟 article.template 對 content-dates.json 的做法一致）或 module-level lazy cache
- **風險**：極低

### #6 extract-build-perf.mjs 的感測器本身壞掉 + 在 build 關鍵路徑上打 31 次 API

- **檔案**：`scripts/core/extract-build-perf.mjs:124`（`grep -c '<url>'` 數的是「行數」，sitemap 單行 → 永遠 1）；`:160-165`（30 個 run 逐一 serial fetchJobs）；`:173-174`（"30d avg" 實為「最近 ≤30 個成功 run」≈ 當前 <1 天）
- **為什麼**：`ms_per_page_latest: 1099000`、`flag_slow` 永真 — 這顆專門抓 build 變慢的感測器自己在說謊；且每次 prebuild 花 8.3s 打 GitHub API（網路抖動直接進 build 時間）
- **省多少**：~5-8s/build + dashboard 數據恢復可信
- **修法**：`grep -o '<url>' | wc -l`；trend 標籤改 last-N-runs；fetchJobs 改 Promise.all 並行或把這步移出 CI prebuild（dashboard refresh routine 跑就好，CI 上 `CI=true` 時 skip）
- **風險**：低

### #7 deploy.yml 的 .astro content-collection cache 是死重

- **檔案**：`.github/workflows/deploy.yml:86-93`
- **為什麼**：全 repo `getCollection(` 出現次數 = **0**（不用 content collections，文章是 fs 直讀），cache 實測只有 **4,558 bytes**。兩個 step 白跑。
- **省多少**：~2s + workflow 簡化
- **修法**：刪掉 restore/save 兩步；或（大工程、另案）真的遷去 content collections 換取 Astro 增量 parse
- **風險**：無

### #8 異常頁面 outlier（觀察項）

- CI log 有單頁 122.7s（`/ko/raw/.../kmt-government-relocation...md`）與 80.9s（`/en/society/breakfast-shops.../index.html`）的極端值 — 在 concurrency 下疑似 event-loop 長 stall（GC 或某 await 卡住），量級不影響大局但值得在 profile 時順帶看。

---

## ⑤ CI / cache 機會

- **每 push 只跑 deploy.yml**（push→main）；其餘 workflow 都是 PR-triggered（pr-review / i18n-smoke / translation-check）— 沒有重複浪費 ✓
- npm cache hit ✓（61MB，npm ci 仍要 18s — `--prefer-offline` 已開，剩的是 node_modules 解壓本體；可考慮 cache node_modules 整包 + key=lock hash，省 ~10s，風險低）
- Playwright cache hit ✓（253MB，binary 安裝全 skip，只剩 install-deps 6s）
- OG cache：**每 run 必存新 186MB**（key 含 run_id 的 always-save 設計）。修好 #1 後 jpg 不再每 build 重寫，但 actions/cache 比對的是 key 不是內容 → 還是每 run 上傳 186MB（4s）。可改成「OG step 有產圖才 save」（`if: steps.og-changes...`）省 cache quota churn（目前 ~15 run/天 × 186MB ≈ 2.8GB/天，10GB quota 會 LRU 擠掉別的 cache）
- **mtime restore 修好之前，所有 cache 的「增量」語意都是擺設**（#1 是 cache 體系的地基）
- Upload artifact 52s 與 dist 體積直接相關 → #3 連動改善
- timeout-minutes: 120 目前餘裕充足（job ~21min）

---

## ⑥ 最值得做的前五件事

1. **修 mtime restore（熱點 #1）**：vendor 新版 git-restore-mtime script（`git log --raw` 版）進 repo + workflow 加 WARNING 數 guard。**-66s/build，立即見效**，且把整個 mtime-incremental 體系從「靜默全壞」救回來。半小時工程，低風險。
2. **verify-internal-links 平行化（#4）**：Pool(4) 改寫 python 主迴圈。**-45s/build**，read-only 工具好驗證。
3. **`build.concurrency: 4 → 8` A/B（#2a）**：一行 config，下一個 build 直接讀數字，RSS 超標就回退。潛在 **-80~150s**，是 astro 943s 大頭裡唯一的「便宜槓桿」。
4. **拔掉每頁 50KB allArticles 內嵌（#3）**：改共用 JSON endpoint。dist **-250MB**、artifact upload 與 link-scan 連動加速（估 -15~30s），讀者端每頁 -50KB 是順手的大 SEO/體驗紅利。
5. **修 build-perf 感測器 + 移出關鍵路徑（#6）+ SEO.astro hoist（#5）**：把 `ms_per_page=1099000` 的假數據修正、31 次 serial API 移出 CI prebuild、SEO 每頁 readFileSync 改 import。合計 **-10~15s**，更重要的是讓「build 變慢」下次能被儀表板自己抓到而不是靠人問。

做完 1+2+5 ≈ **-120s**（1099→~980s）；3 若 A/B 成功再 -100s 上下（→ ~880s）。長期曲線仍由頁數驅動（+27 頁/天），結構性天花板要靠 per-page render profile（#2b）與增量 build 策略另案處理。

---

### 附註

- 本機量測時跑了全套 prebuild step，工作樹留有 26 個 regen 檔案修改（public/api/\*.json、knowledge/People/李洋.md、\_translation-status.json 等 prebuild 正常產物），未 commit。
- 任務說明寫「CF Pages CI」— 實際是 GitHub Actions + GitHub Pages（deploy.yml），無 CF Pages 設定檔。
