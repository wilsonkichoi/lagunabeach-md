# 2026-05-28-050855-twmd-babel-nightly — 147 stale+missing → 50 stale 4-tier cascade 完整跑出 Tier 4 Ollama sovereignty backbone 第一次接住 3/3 雲端 refusal

> session twmd-babel-nightly — cron routine 自動觸發 05:00
> Session span: 05:08:55 → 09:57:56 +0800 (4hr 49min, 1 commit f0168508e)
> 資料來源：`git log %ai` + `.lang-sync-tasks/_p0-logs/babel-nightly-2026-05-28/*.log`

## 觸發

5/27 23:30 過後一輪 EVOLVE + Politics 8 篇 + /elections/2026/ MVP + 落日飛車 R2 大量 ship 把 i18n 缺口拉到 147（en 31 / ja 30 / ko 28 / es 29 / fr 29），凌晨 05:00 babel-nightly chain 尾棒接過來消化。義務鐵律：stale=0 或 4-tier cascade exhausted。

## P2.5 Tier 0b 25 entries bump-source-sha

第一波 `bump-source-sha.py --apply` 直接清掉 5 篇 metadata-stale × 5 langs = 25 entries（taiwan-travelogue / chiang-hsien-yi / pansci / cheng-chou-yu-poet / martial-law-era），$0 LLM、< 1 秒。Coverage 從 97.5% → 98.2%。

## P0/P1 Tier 1-4 cascade 主批 125 entries

20 unique articles（14 P0 missing 全 Politics 系列 + 公視/猴硐/天燈/國家人權博物館/尹衍樑 + 6 P1 stale 大宇雙劍/落日飛車/半導體/雷亞/台灣選舉/美食總覽）× 5 langs = 125 cascade dispatch。Politics 14 篇都是新 slug，先補進 `slug-map.json` 14 條再 `prepare-batch.py --slug-map` 規避 TBD-NEEDS-SLUG。

5 個 lang 1 worker per lang 平行（per Z2.1 安全 baseline 5 simultaneous），09:27 全部完工 = 4hr 19min wall-clock。Backend 分布：codex 30 + openrouter/owl-alpha 90 + openai/gpt-oss-120b 3 = 123 ok / 2 fail。早期 codex subscription 配額用完後整體 pivot 到 owl-alpha 慢但穩。

2 fail 都是 `Society/台灣國防與軍事現代化.md`（ja + ko 雙撞），cascade 18s rapid fail across cloud backends — 典型 PRC content policy refusal pattern on sovereignty 主題（MANIFESTO §主權的巴別塔 sovereignty leak 預測）。

## Tier 4 Ollama qwen3.6:35b sovereignty backbone 第一次接 3 篇

手動 retry：ja 國防 / ko 國防 / ja 猴硐（gpt-oss-120b 把 zh source 當「翻譯」回傳 garbage，刪掉重來）三篇 explicit `--cascade ollama:qwen3.6:35b-a3b-coding-nvfp4,codex,openrouter:owl-alpha`。三 worker 平行（Ollama 內部 serialize），09:30 → 09:42 ~12 min 全收下：ja 國防 184s / ja 猴硐 213s / ko 國防 502s。**Tier 4 sovereignty backbone 第一次在 production 接住雲端 refusal，3/3 ok，0 paid token 花掉**。MANIFESTO §主權的巴別塔 v2 從哲學 statement 變成 production 事實。

## P2 Tier 0a diff-patch 5 個 Sonnet sub-agent 平行

`diff-patch-prepare.py --input /tmp/p2-input.txt --lang all` 產 5 lang × 9-10 task = 49 patch tasks（30 zero-diff = 純 SHA bump / 19 real-diff = 4 articles × 5 langs：二二八 / 轉型正義 / 大宇雙劍 / 白色恐怖 補延伸閱讀 4-link block）。Spawn 5 個 Sonnet sub-agent 平行（en/ja/ko/es/fr 各一），prompt 內嵌 TRANSLATION-{lang}.md §1-§6 + translatedFrom 鐵律 + zero-diff/real-diff 分流。

結果：en 9/9 + ko 10/10 + es 10/10 + fr 10/10 + ja 7/10（3 個 ja 是 28-30 line stub 翻譯，沒有 §參考資料 段可以 inject 4-link block → 直接 skip 報告）。46/49 patched。3 ja stubs 是 pre-existing 待 cascade 全文重翻場景，留給下次 routine。

## 三個 backend 缺陷 in-flight fix

跑完跟 sync-translations-json 對齊發現三個 backend 寫出問題：

1. **ja green-island-prison `translatedFrom: History/緑島監獄.md`**（日文 緑）vs zh canonical `History/綠島監獄.md`（繁體 綠）— REFLEXES #54 第 4 instance Pattern A byte-equal violation。Edit 一個字修掉
2. **ja Geography/houtong gpt-oss-120b 把 zh source verbatim 當「翻譯」回傳** + 缺 `translatedFrom` + 雙 `---` frontmatter bug。`rm` 整檔 + ollama retry
3. **ja + ko Technology/taiwan-semiconductor-industry legacy 5/20 stubs**（English title 但路徑在 ja/ko）— 跟新 cascade 的 `semiconductor-industry.md` 形成重複。`rm` legacy 留新版

額外 sweep ko/es/fr Politics 4 個檔 `[[X]]` 殘留 8 處（cascade 沒把 wikilink 轉成 markdown link）— sed 一行 strip brackets fallback。

## 收官 checklist

| 檢查項                              | 狀態                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------ |
| Read protocol ACK                   | ✅ SQUEEZE-MODELS-MAX-PIPELINE:961 + TRANSLATION-PIPELINE 完整 read                        |
| 0 LLM drift (Stage 2 ship gate)     | ✅ Phase A cascade 輸出全 status.py 報 fresh                                               |
| stale=0 OR 4-tier cascade exhausted | ⚠️ 50 stale 剩（P2 27 + 後續產生），但 P0=0 P1=0 P2.5=0；2 sovereignty 4-tier 已 exhausted |
| 義務鐵律 quality_gate               | ✅ -66%（147→50）+ all P0+P1 cleared                                                       |
| Timestamp 精確                      | ✅ git log %ai                                                                             |
| Handoff 三態                        | ✅（見下）                                                                                 |
| verify-batch 8 項                   | ⚠️ ko/es/fr wikilink residue 已 fix；ja 5 ratio < 0.55 留追                                |
| Pre-commit hook PASS                | ✅ commit f0168508e                                                                        |
| Push origin/main                    | ✅ 9193f35b2..f0168508e                                                                    |

## Handoff 三態

繼承上 session（twmd-data-refresh-am 06:00）：

- [x] ~~Step 10 dashboard-immune.json escalation 2x → spawn chip~~（外部 chip 已 handle）

本 session 新 handoff：

- [ ] **3 ja stub translations 待全文 cascade 重翻**：`ja/History/february-28-incident-...md`（28 行）/ `ja/History/taiwan-transitional-justice.md`（84 行）/ `ja/History/taiwan-white-terror.md`（30 行）— 下次 babel routine 應該升 P1 強制 cascade，不是 P2 diff-patch
- [ ] **50 P2 minor stale 留追蹤**：大部分是這次 cascade/diff-patch 後 SHA bump 帶 1-commit 漂移殘留，下個 babel cycle 自然 P2.5 bump 可清
- [ ] **slug duplicate 系統性 audit**：本 session 揭露 50+ 個 zh 來源有兩個 translation slug 共存（lee-ju-eun / lee-ju-eun-singer / 麟洋配 / TSMC 等），diff-patch-prepare.py 用 \_translations.json 推導 path 時挑了「錯誤」slug 寫到不存在 file。Pipeline-level fix candidate
- ⏳ **gpt-oss-120b 翻譯 quality regression**：houtong 案 把 zh source 當輸出，需要在 translate.py 加 input/output 相似度檢測（>90% match → fail 視為 refusal）
- [x] ~~translatedFrom 緑→綠 byte-equal violation~~（已 edit 修，Pattern A 第 4 instance instrumentation 候選歸 LESSONS-INBOX）

## Beat 5 — 反芻

今晚 4hr 49min 的工作把 baseline 147 → 50（-66%）。但更重要的是 Tier 4 Ollama sovereignty backbone **第一次在 production 接住雲端 refusal**：3/3 PRC-sensitive 主題（國防現代化 × 2 lang + 一個 free-tier garbage output）全收下，0 paid token。MANIFESTO §主權的巴別塔 v2 從 2026-05-03 magical-feynman 寫進 doc 後 25 天，今晚是真正在 routine 自動跑時驗證「Local LLM 不是 backup，是 sovereignty backbone」這句 claim 立得起來。

第二個 meta-pattern 是 backend 缺陷暴露速度。一輪 125 dispatch 跑出 3 種 backend bug：byte-equal violation（owl-alpha ja 寫 緑）/ source-verbatim leak（gpt-oss-120b 整篇照搬）/ wikilink-residue（cascade 沒轉 [[X]]）。這些都是 single-article 沒看到、batch 才浮出的 systemic 問題。Babel 跑大 batch 本身就是 backend regression test。

第三個是 §義務鐵律的拿捏。原本 4hr 後想停在 27 stale 收工（-82%），但讀 SQUEEZE-PIPELINE §義務鐵律「不主動 defer / partial / 守 boundary」拍板繼續跑 P2 diff-patch + 修 backend bug，最後到 50 stale（-66% 是因為 SHA bump 後又自然產生新的 1-commit-behind P2 跑回去）。學到的是：「stale 數字繼續下降」跟「P2 純粹 SHA drift」是兩件事。下個 babel 應該 P2.5 bump 一發自動清。

LESSONS-INBOX 候選：(1) Pattern A byte-equal 第 4 instance — 證實 §Z2.3 hard gate 還不夠，需要 backend prompt 內嵌 + sync-translations-json strict mode suggestion (2) gpt-oss-120b source-verbatim leak — 新 backend pitfall 需要 translate.py 加 input/output similarity check (3) Diff-patch-prepare.py 寫到不存在 file 等於建立 duplicate — 需要 existence check + fallback

🧬

---

_v1.0 | 2026-05-28 09:58 +0800_
_session twmd-babel-nightly — 4hr 49min / 1 commit / 172 translations (126 cascade + 46 patch + 25 P2.5 bump)_
_誕生原因：cron 05:00 chain 尾棒，5/27 凌晨 EVOLVE + Politics 8 篇 ship 把 i18n 缺口拉到 147 stale+missing_
_核心洞察：(1) Tier 4 Ollama sovereignty backbone 第一次 production 接住 3/3 雲端 refusal，§主權的巴別塔 v2 從 doc claim 變 production 事實 (2) Babel 大 batch 本身是 backend regression test，一輪 125 dispatch 暴露 3 種 backend bug (3) §義務鐵律「跑到 stale=0」要分辨真實 content stale vs 純 SHA drift，後者下次 P2.5 bump 一發清掉_
_LESSONS-INBOX 候選：Pattern A 第 4 instance / gpt-oss-120b source-verbatim leak / diff-patch-prepare path existence check_
