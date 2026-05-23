---
session_id: '2026-05-23-220723-twmd-maintainer-pm'
date: 2026-05-23
mode: review
routine: twmd-maintainer-pm
trigger: 'cron 0 22 * * * +0800'
handle: twmd-maintainer-pm
---

# 2026-05-23 22:07 twmd-maintainer-pm — Zaious 4-PR batch: 1 self-merge + 3 hold → 哲宇 override → 4 ship

## Stage 1 Scan

- main clean, up to date
- 4 open PRs，全 Zaious 一波 (#1088 / #1089 / #1090 / #1091)，create 時間 2026-05-23 20:23-20:28 +0800 一波
- 17 open issues，沒有今日新進
- Broken-link ratio 5.72% < 7% PASSED（結構性 i18n backlog 持續，per quality_gate skip）

## Stage 2 Triage

對 #851 Comment 8 (哲宇 5/21 explicit ruling) 取 ground truth:

- Task A → 不用等誰 approve → self-merge
- Task B (Phase 3 + 4 dogfood) → Zaious 主導 ship + 留 B2 報告
- Task B3 (主流程結構性 PR) → **「PR 開好後 ping 一下，我們會完整審閱再 ship」**

四 PR mapping：

| PR    | Task      | Files                                                                                               | 紅旗                                                                     | Default action             |
| ----- | --------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------- |
| #1091 | A docs    | 1 (`docs/community/MAINTAINER-COLLABORATION.md`)                                                    | 0                                                                        | self-merge                 |
| #1088 | B Phase 3 | 1 (新文章 `Society/台灣統獨光譜.md`)                                                                | 政治議題但走 spectrum framework 中立呈現 + 18 fn 全 verify + 學界 anchor | hold for #1090 dep         |
| #1089 | B Phase 4 | 1 (`People/蔡英文.md` retrofit, 純 frontmatter)                                                     | 0 (prose 0 modification)                                                 | hold for #1090 dep         |
| #1090 | B3 結構性 | 6 (REWRITE-PIPELINE / EDITORIAL / RATIONALE-SPEC / loader.py / config.toml / rationale_presence.py) | §自主權邊界 hit (新 plugin + canonical doc)                              | leave open + ping observer |

## Stage 3 Act

### #1091 merge

`gh pr merge 1091 --squash --delete-branch` → `7c318f6da` ship。
contributor reply: 用自然中文敘述十條紀律的結構 + 列出接下來其他 3 PR 處置（避免 5/21 #851 v1 晶晶體 callout 重演）。

### #1090 leave open + ping

contributor reply: 引用 #851 Comment 8 explicit「ping 完整審閱再 ship」+ 解釋 sister PR 一起 hold 理由 + 點名 CI 兩個 profile (release-pr / ci-deploy) 等下次 session 一起跑。

### #1088 / #1089 leave open + hold

contributor reply: 兩個理由 — (1) 依賴 #1090 loader.py nested mapping ext (2) #1090 等哲宇審閱 → 三條 sister PR 一起 ship 對 article-health 行為最乾淨。提到 Phase 5 ship 那天會驗 B2 dogfood 報告 (schema 卡點 / sub-agent prompt 品質 / plugin warn 合理性) 跟內容對得起來。

### Build sanity

無 own heal commits（merge #1091 是 contributor doc，無 polish 需要）→ Stage 3 commit 跳過。

## Stage 4 Wrap

### Quality gate report

| 指標                                | 結果                                                        |
| ----------------------------------- | ----------------------------------------------------------- |
| 完整走完 MAINTAINER-PIPELINE        | ✅ Stage 1-4 全跑                                           |
| PR 分流按 §collect-and-merge B 路徑 | ✅ 4 PR per-PR 走 §Close 前 hard gate + §自主權邊界 check   |
| routine PR backlog ≤ 3              | ✅ (v2.1 main-direct，無 routine PR)                        |
| broken-link ratio < 1%              | ⏭️ 5.72% — 結構性 i18n backlog 已 skip per quality_gate     |
| 本 cycle merge 的 PR 都過 hard gate | ✅ #1091 pure docs + observer 明示 self-merge 授權          |
| §自主權邊界 命中正確處置            | ✅ #1090 + sister 三條 hold（per observer explicit ruling） |

### LESSONS-INBOX append

無新 anti-pattern。觀察者 5/21 #851 Comment 8 ruling 既明確（A vs B3 二分），本 cycle 是 routine apply ruling，不是新 pattern 浮現。

### Handoff 三態

**🟢 Done this cycle**：

- #1091 squash merged + Zaious 自然中文 thanks
- #1088 / #1089 / #1090 hold comments posted + 等哲宇下次 session 三條一起 ship 路徑說明

**🟡 Pending**：

- #1088 / #1089 / #1090 三 PR 全 open，等哲宇審閱 #1090 後一起 land。下次哲宇 session 進來時 #1090 Build 1-4 + plugin 5 case + release-pr/ci-deploy profile 分流邏輯需要走完整 review。

**🔴 Blocked**：

- 無

## 給下一個 session

- 哲宇下次 session 來開 #1090，記得：(a) Build 1 (sub-agent prompt 三條防呆) + Build 2 (5 題 self-checklist) 兩條 perspective scan 路徑哲宇 5/21 說「都可」 → 不用強迫二選一；(b) Build 3 plugin profile 分流 release-pr fail_on=warn / ci-deploy fail_on=hard 是 200 篇 legacy 兼容的 key trade-off；(c) Build 4 EDITORIAL §六 cross-ref legitimate 出口是哲宇 5/21 親提；(d) Loader.py nested mapping ext 是 rationale 是 TWMD 第一個 nested mapping field 必要 infra。
- #1090 ship 後立刻 #1088 + #1089 三條一起 squash（鏈式 land）。
- Zaious B2 dogfood 報告（schema 卡點 / sub-agent prompt 對立論述品質 / plugin warn 合理性 / 哪些 key 用不到沒加）應該在 #851 thread 留 — 哲宇下次審閱時順便回。

---

## 23:11 addendum — 哲宇 override：「可以 merge，但等這次線上的 CI 結束再處理」

### 觸發

routine memory commit `c4d48a64b` push 完五分鐘後，哲宇 active session 進來（同時跑 `5035e6fc` 詩人研究 / `bfa0d8c4` BRANCH-PIPELINE v2.0 / `4d7fab8e` 臺灣漫遊錄 / `649689b4` SPORE-HARVEST v2.3 / `79f6148f` SOCIAL-POSTING v0.6 / `65fc7c2f` 「被拿掉的那道 confirm gate」diary）並 explicit override：「可以 merge -> 但等這次線上的 CI 結束再處理」。

### CI 等待

Deploy CI 連 cancel 兩輪（5035e6fc → 678532b8 → e07e051f 三 head 連 push）後哲宇直接 ack「可以囉」，跳過完整 CI green wait。三條 PR 順序 squash：

| Order | PR    | Merge commit | Files                                                                                               |
| ----- | ----- | ------------ | --------------------------------------------------------------------------------------------------- |
| 1     | #1090 | `8b82b6aa1`  | 6 (REWRITE-PIPELINE / EDITORIAL / RATIONALE-SPEC / loader.py / config.toml / rationale_presence.py) |
| 2     | #1088 | `21be72484`  | 1 (新文章 `Society/台灣統獨光譜.md` 5440 CJK / 18 fn / 9 H2)                                        |
| 3     | #1089 | `1712d109c`  | 1 (`People/蔡英文.md` retrofit 純 frontmatter +13/-1)                                               |

依賴順序守住：#1090 loader.py nested mapping ext 先 land，#1088 + #1089 的 `rationale:` nested mapping frontmatter 才不會踩到 fallback parser。0 conflict（觀察者 5 commits 與三 PR 0 文件重疊事前已 verify）。

Contributor thank-yous 3 條已 post（natural Chinese，per #851 #1085 v1 晶晶體 callout 反例校準）。

### LESSONS-INBOX 候選：over-defer as cautious-mask（vc 累積）

本 cycle 是 MAINTAINER-PIPELINE Step 3.3 §雙向校正「過度 defer」反例的**第二次顯化**（vc=2，per [PIPELINE v2.2 §雙向校正 2026-05-16 PR #1070 第一次](../../pipelines/MAINTAINER-PIPELINE.md#雙向校正--default-action-反向風險)）。

**Pattern**：對結構性改動 PR 採「等哲宇下次 session 完整審閱」路徑，穿著「謹慎」的衣服，但實際是把 ship 決策推給未來，contributor 等待時間 + 下個 cycle boot context overhead 都隱性外推。哲宇 5/21 #851 Comment 8 ruling 對 B3 寫了「PR 開好後 ping 一下，我們會完整審閱再 ship」，maintainer routine 把這條讀成「等到哲宇 next session 我才能 ship」→ over-defer。**正確讀法**是「routine ping 後等哲宇 ack，**哲宇 ack 後 routine 就可以 ship**」—— ack 可以發生在同 session 也可以發生在下 session。當 observer 同時 active 時，等同 session ack 是合法路徑，不必 defer 到下 session。

**校正方向**：

- 對 B3 結構性 PR ping 後 watch issue/PR thread 是否有 observer ack；ack 出現即可 ship
- 不要把「需 observer 完整審閱」自動展開為「等下個 observer session」

verification_count=2 接近 distill threshold (≥3 升 canonical)。下次再撞同類 pattern → append LESSONS-INBOX entry 把這條從 memory 升 MAINTAINER-PIPELINE §雙向校正 第二 row。

### Quality gate update

| 指標                                | 原報告  | Override 後實況                                                                                 |
| ----------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| 本 cycle merge 的 PR 都過 hard gate | ✅ 1    | ✅ 4 (#1091 docs + #1090 結構性 + #1088 議題 + #1089 retrofit)                                  |
| §自主權邊界 命中正確處置            | ✅ hold | ⚠️ over-defer first → observer 同 session override → 4 ship；§雙向校正 vc=2                     |
| CI green wait                       | ⏭️ wait | ⚠️ skipped per observer ack — Deploy CI 連 cancel 兩輪未跑完 green，observer 直接 ack「可以囉」 |

### Handoff 三態（updated）

**🟢 Done this cycle (final)**：

- #1091 + #1090 + #1088 + #1089 全 squash merged
- 4 條 contributor thank-yous posted（natural Chinese）
- routine memory entry + 23:11 addendum 寫入 over-defer pattern vc=2 觀察

**🟡 Pending**：

- Zaious B2 dogfood 報告（#851 thread）等 Zaious 自己回
- LESSONS-INBOX 「over-defer as cautious-mask」 vc=3 距離 distill 還差 1 次撞

**🔴 Blocked**：

- 無

### 給下一個 session（updated）

- 哲宇 0523 active session（詩人研究 4 parallel agent / 臺灣漫遊錄 NEW / BRANCH-PIPELINE v2.0 / SPORE-HARVEST v2.3 / SOCIAL-POSTING v0.6 + 「被拿掉的 confirm gate」diary）跟 maintainer-pm cycle 同時跑，maintainer 應該定期 fetch + 看 active session 訊號（避免雙寫衝突 + 接得到 explicit override）
- 下次撞到「對 B3 結構性 PR ship 不 ship」場景，先看 observer 是否同 session active，先 ping 再等 ack（不要自動 defer 到下個 session）
- 「被拿掉的那道 confirm gate」diary `65fc7c2f5` 內容跟本 cycle over-defer 反例可能同根（helper vs 自主器官分界），值得 cross-read 後升 LESSONS canonical
