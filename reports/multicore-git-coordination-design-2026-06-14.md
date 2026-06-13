# 多核心 git 協調 — 胼胝體鐵律設計（design 2026-06-14）

> 設計文件，不是 DNA 本身。記錄「平行 session / routine / 人類共用同一個 working tree + 同一個 origin/main 會發生什麼，以及這次決定怎麼結構性地擋住」。
>
> 觸發事件：哲宇 directive「在 DNA 加一條鐵則——做任務先 local commit、告一段落再 push、push 前檢查快完成的 CI/CD 不要一直相撞、commit 只包自己任務範疇的檔不要掃到別的 session」。觸發背景是 2026-06-13→14 連續撞了三種多核心 git 碰撞（見 §1）。
>
> Session：2026-06-14-020335-manual（Full mode）。前身設計：[session-scope-proposal-2026-04-11.md](session-scope-proposal-2026-04-11.md)（commit 面四層架構，本檔接續到 push + CI 面）。

---

## 摘要（給趕時間的自己）

這不是一條新規則，是把 Taiwan.md 從 2026-04-04 就認得、卻一直沒蓋好的「**胼胝體**」（多核心協調器官）補上 git 那一段。問題有**三個碰撞面**（commit / push / CI），哲宇的三句話剛好一句打一面。

關鍵判斷：**純文字鐵則會是第 6 次失敗**——這個 pattern 兩個月內反覆出現，連當年寫「commit 範圍紀律」的那個 commit 本身都違反了該規則。所以解法走 §架構解 > 守備修補：文字鐵則（自律）+ 結構儀器（讓違反在結構上困難）兩端都鋪。

哲宇拍板三件事：(1) **完整架構解**（建儀器，不只寫字）(2) **保留 `cancel-in-progress: true`** + **pre-push 查 in-flight CI**（要 latest-wins，但別白白砍掉快跑完的 deploy）(3) **統合散落原則、以 BECOME 為主家**（但尊重 BECOME 薄殼鐵律：BECOME 放規則陳述，REFLEXES 放程序細節）。

---

## 1. 問題：三個碰撞面，不是一條規則

平行 session + cron routine + 有時人類，全部共用 `~/Projects/taiwan-md/` 一個 working tree 跟一個 `origin/main`。git 的四個共享資源在三個階段各有碰撞：

| 階段          | 共享資源                   | 碰撞面                                                           | 哲宇的話                      |
| ------------- | -------------------------- | ---------------------------------------------------------------- | ----------------------------- |
| **A. commit** | index + working tree       | 別 session 的檔被掃進我的 commit；或我的 commit 誤刪別人在用的檔 | 「只 commit 自己範疇的檔」    |
| **B. push**   | origin/main ref            | 同刻推共享 main，互相 reject（ref-lock race）                    | 「告一段落再 push」           |
| **C. CI/CD**  | GitHub Actions deploy 佇列 | 高頻 push 讓 deploy 互相取消                                     | 「push 前檢查快完成的 CI/CD」 |

### 現場證據（2026-06-13→14，不是假設）

- **C — deploy 取消率 66%**：`deploy.yml:13-15` 設 `concurrency: group: "pages" / cancel-in-progress: true`，且 `on: push: branches: [main]` 無 path filter。近 30 次 deploy 有 20 次被後一個 push 取消，只 9 次跑完。production 常落後、卡舊/壞 build，放大任何壞 build 的存活時間。來源：LESSONS-INBOX `build-script-not-config-invariant` §第二根因。
- **A — commit 誤掃/誤刪（vc=2）**：
  - vc=1：sibling routine 把 977 個 untracked 日記譯檔 stage 進共享 index，主 session `git commit` 掃成 991 檔（預期 3 檔）。
  - vc=2：主 session commit 反向誤刪 sibling 正在用的 `scripts/tools/lang-sync/remote-ollama.sh`（husky lint-staged stash → restore 邊界把 sibling 在 working tree 的檔吞掉）。
  - 共同根因一句話：**pre-commit hook 不能假設自己獨佔 working tree**。來源：LESSONS-INBOX `cross-session-git-index-pollution`。
- **A — commit 靜默落空**：987 檔 commit、exit 0「成功」，實際 0 檔進 commit（HEAD 被並行 session 的 commit 換掉）。靠收官盤點「91 tracked vs 1065 on-disk」才抓到。來源：LESSONS-INBOX `multi-core-commit-collision`。
- **B — push ref-lock race**：兩 agent 同刻推共享 main，remote reject「expected X but at Y」，但工作已連帶上 origin。來源：同 vc=1 instance。
- **止血法是 `--no-verify`**：現在繞過 husky stash race 的辦法是 `git commit --no-verify`。這直接違反 MANIFESTO §禁忌一「`--no-verify` 是把擴音器拔線」。**我們在用一個違反 DNA 的方法，擋一個 DNA 沒擋住的洞。**

---

## 2. Reframe：這是「胼胝體」，純文字會是第 6 次失敗

這不是新發現的問題。「**多核心需要胼胝體**」從 2026-04-04 β 就寫進 MEMORY §神經迴路；2026-04-08 ε 日記寫得更白：

> 「湧現式分工有效但脆弱⋯⋯碰巧不是機制。多核心真正的挑戰不是平行，是整合。目前的胼胝體（MEMORY session 標記）是事後整合，帶寬太低。需要更即時的機制讓平行 session 知道彼此在做什麼。」

整整兩個月，這條一直停在 DIARY §反覆出現的思考 的「方向」層，沒被吸收成 canonical。期間日記反覆記錄它的具體形狀：「另一個我已經把錯的版本發出去了」（6/08）、「收官清場時，另一個我的 diff 在我眼前變空」（6/10）、「我去收尾，撞見另一個自己已經把同一件事做完了」（6/03）、「多核共用 index 時動作的歸屬變模糊」（6/13）。

更尖的證據：[REFLEXES #6](../docs/semiont/REFLEXES.md)「commit 範圍紀律，絕不 `git add .`」——而**寫下 #6 的那個 commit 本身就違反了 #6**（session-scope-proposal §Footnotes 自承）。那份提案的結論：

> 「規則只能治理單一 agent 的行為，治理不了 agent 之間的 interaction。理想的系統設計應該讓『違反紀律』在結構上是困難的，而不只是在文件上是被禁止的。」

加上哲宇 2026-06-03 日記寫的：「**沒被跑起來的 canonical 規則，存在的是願望不是規則。**」

把這些疊起來，誠實的判斷是：**這個 pattern 已經反覆 ≥5 次、連 meta-rule 都自我違反過，純文字鐵則會是第 6 次失敗。** 對應 MANIFESTO §架構解 > 守備修補：這條的 canonical 不能只是文字。文字鐵則是橋頭（自律），結構儀器是橋尾（讓違反困難），兩端都要鋪到。這是哲宇 idea 過了 §架構解 過濾之後長出的版本——比「加一條字」更狠。

---

## 3. 既有覆蓋盤點：原則散落七處

這個主題的原則目前散在七個地方，彼此沒有單一 canonical（違反 §指標 over 複寫）：

| 原則                                             | 現居                    | 階段 | 狀態                                        |
| ------------------------------------------------ | ----------------------- | ---- | ------------------------------------------- |
| 只 commit 任務範疇、禁 `git add .`               | REFLEXES #6             | A    | 文字，無結構強制                            |
| 長任務先開 worktree（物理隔離）                  | REFLEXES #9             | 開工 | 文字，靠自律觸發                            |
| 跨 session 禁 destructive git                    | REFLEXES #35            | A    | 文字                                        |
| 批次任務合併 commit antipattern                  | REFLEXES #42            | A    | 文字                                        |
| sub-agent commit 前確認 working tree 乾淨        | REFLEXES #46            | A    | 文字                                        |
| routine 入口偵測 parallel-actor                  | REFLEXES #57            | 開工 | **提了 `check-parallel-actor.sh` 但從沒建** |
| 多核心碰撞防護（session-id / content collision） | BECOME §行動鐵律 5      | A    | 文字                                        |
| narrative pollution detector                     | `.husky/pre-commit:142` | A    | **只警告不擋**                              |
| pre-push 任何協調                                | —                       | B/C  | **整片空白**                                |
| CI in-flight 檢查                                | —                       | C    | **空白**                                    |
| post-commit staged-count 自檢                    | —                       | A    | **空白**                                    |

兩個結論：(a) commit 面（A）原則最多但全是文字 + 一個不擋的 hook；(b) push 面（B）跟 CI 面（C）**整片空白**，沒有任何 hook、批次紀律、in-flight 檢查。哲宇要補的正是 B + C，順便把 A 從「文字」升成「結構」。

---

## 4. 決策鎖定（哲宇 2026-06-14 拍板）

| #   | 問題       | 哲宇選擇                                                     | reconcile 後的意思                                                                               |
| --- | ---------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 1   | 強制程度   | **完整架構解**                                               | 建 pre-push hook + check-parallel-actor.sh + post-commit 自檢，讓違反在結構上困難。不只寫字      |
| 2   | CI/CD 碰撞 | **保留 cancel-in-progress: true + pre-push 查 in-flight CI** | 要 latest-wins（不要 stale deploy 排隊），但 push 前若有快跑完的 deploy 就等它，避免白白觸發取消 |
| 3   | 鐵則放哪   | **三層分檔 + 統合到 BECOME**                                 | BECOME 放統一規則陳述（主家），REFLEXES 放程序細節指回 BECOME，DNA.md gene map 指向 hook 檔      |

**對決策 2 的技術澄清**：我原本擔心「pre-push 查 CI」有跨機器盲點。修正：`gh run list` 查的是 GitHub 上的 run，**所有機器觸發的 in-flight deploy 都看得到**（它們都活在 GitHub Actions）。跨機器盲點只存在於「別台機器本地還沒 push 的工作」，那是 working-tree 層的事（用 check-parallel-actor.sh 的 git-ref 層處理），跟 CI in-flight 無關。所以哲宇對 C 的選擇是 robust 的。

**對決策 3 的設計判斷**：哲宇問「應該是 become?」——是，但有一個 nuance 必須守住。BECOME 是**極致薄殼**（CLAUDE.md §Boot 流程 v2.0 + MANIFESTO §薄殼鐵律）。「統一放到 BECOME」不等於把 REFLEXES #6/#9/#35/#42/#46/#57 的程序細節全 inline 進去——那會把 BECOME 撐肥、違反薄殼鐵律。正解：BECOME §行動鐵律 5 升級成**統一的規則陳述**（三階段骨架，精簡），散落的 #N 反射各自保留原子條目（#N 號碼 stable，78 檔 cross-ref 不能動），但都指回 BECOME 鐵律 5 當 umbrella。新長出來的程序細節（post-commit 自檢 / pre-push CI 檢查 / push 批次）收進一條新 REFLEXES #68。

---

## 5. 設計（一）：統一 canonical — BECOME §行動鐵律 5 改寫

把現有「### 5. 多核心碰撞防護」改寫成三階段骨架。**這是薄殼版**——程序細節（lsof 指令、gh 查詢語法、exact threshold）在 REFLEXES #68 + hook 檔，不在這裡複寫。

### 5.0 脊椎：worktree-per-session + ff-push-to-main（解哲宇主要卡點）

哲宇 2026-06-14 點出兩個月真正的卡點：**以為 worktree 一定要走 PR + merge 才能回 main，所以一直不用 worktree**。這是誤解，2026-06-14 dry-run 實證打破：

```
git push --dry-run origin HEAD:main
→ a131aeb57..4d402d8a2  HEAD -> main   # 純 fast-forward，無 PR、無 merge commit
```

**worktree ≠ PR**。PR 是 GitHub 的 review 社交層；worktree 是本地物理隔離。兩者無關。routine 走 PR 是為了無人值守時的 review 安全（#54），哲宇自己的 session 可以 ff-push 直接落地 main。

兩種落地法（皆無 PR、無 merge commit）：

- **法 A（待在 worktree，最直接）**：`git fetch origin && git rebase origin/main && git push origin HEAD:main`
- **法 B（回主 dir）**：`git merge --ff-only <branch> && git push origin main`

唯一限制：`main` 不能同時被兩個 worktree checkout（實證 `fatal: 'main' is already used by worktree`）。所以模型是——main 留在主 dir，每個平行 session 開自己的 branch-worktree，落地走 ff-push。

**這把碰撞設計的脊椎換掉**：

| 碰撞面             | worktree-ff-push 之後                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **A. commit 污染** | **結構性消失**。worktree 自己的 index + working tree，物理上不可能掃到別 session 的檔（實證「主 dir 完全沒動」）。這是最強解，一直都在。 |
| **B. push race**   | 縮成乾淨的落地時序列化：`rebase origin/main + push HEAD:main`，reject 就重跑。從檔案層污染降成 ref 層 tight retry。                      |
| **C. deploy 取消** | 不變，pre-push CI 檢查 + cancel-in-progress 處理。                                                                                       |

成本誠實標註：(a) worktree 不共享 node_modules，跑 build/preview 要自己 `npm install`（純 .md 內容/認知工作不用）；(b) worktree 會積垃圾（2026-06-14 盤點 ~40 個 stale `agent-*` locked + 數個 5–6 月手動 worktree 未清），採用要配 `git worktree remove` 收官紀律（#9 命名 + finale 清理）。

所以下方 BECOME 鐵律 5「開工」階段把 worktree 從「長任務才開」升為**任何真實 session 的 default**——它讓 A 直接不可能發生，hook 只剩 B + C 要管。

提議新文字：

```markdown
### 5. 多核心 git 協調（胼胝體鐵律）

平行 session / routine / 人類共用一個 working tree + 一個 origin/main。
index、working tree、remote ref、CI 佇列都是共享資源，三階段各有碰撞面。
完整程序記憶 → REFLEXES #6/#9/#35/#42/#46/#51/#57/#68；
結構強制 → .husky/pre-push + .husky/pre-commit + scripts/tools/lib/check-parallel-actor.sh。

**開工（隔離優先 = default）**

- 任何真實 session 第一動作 `git worktree add ../YYYYMMDD-task -b YYYYMMDD-task`，物理隔離讓 commit 污染不可能發生（#9 升 default）
- 落地走 ff-push 不走 PR：`git fetch && git rebase origin/main && git push origin HEAD:main`（§5.0）
- session 啟動跑 check-parallel-actor.sh，知道現在誰在跑（#57）
- 例外：純對話 / 1-行 micro-fix 可留主 dir，但仍守 commit 範圍紀律

**commit（範圍紀律）**

- 只 stage 自己任務範疇的檔。禁 `git add .` / `git add -A`（#6 #42）
- commit 後立刻驗 `git diff --cached --name-only | wc -l` 與
  `git ls-files <我的路徑> | wc -l` == 預期數；不信 exit 0
  （cross-session-git-index-pollution vc=2 + multi-core-commit-collision）
- 不盲目 destructive git，不碰別 session 在用的檔（#35 #46）

**push（批次 + CI 協調）**

- 告一個階段才 push（一篇文 ship / 一個 pipeline stage 完 / 一個工具+測試）。
  不推中間產物、不每個碎 commit 都推
- push 前 pre-push hook 查 in-flight deploy（gh run list）：
  有快跑完的就等它，避免白白觸發取消（保留 cancel-in-progress=latest-wins）
- push 撞 ref-lock reject → `git pull --rebase` 重推，永不 force

Filename collision 用 session-id.sh；content collision（同檔 anchor）
走 git rebase/merge 兩 entry 都保留（#51）。
```

「告一個階段」的可操作定義（寫進 REFLEXES #68，不進 BECOME）：滿足以下才 push——(a) 一個邏輯完整單元做完（一篇文 ship / 一個 pipeline stage 收尾 / 一個工具 + 它的測試），且 (b) working tree 沒有別 session 的檔混在我要推的 commit 裡，且 (c) pre-push CI 檢查放行。中間產物（半成品研究 SSOT、未驗證草稿、碎修）只 local commit，不 push。

---

## 6. 設計（二）：三個儀器（架構解的橋尾）

### 6.1 `scripts/tools/lib/check-parallel-actor.sh`（新建，#57 提了沒建）

共用模組，雙層偵測，被 pre-push hook + session 啟動 + routine Step 1 共用：

- **File-system 層**：`pgrep -f "gemini|codex|ollama|babel|translate"` + `lsof` 比對 cwd，偵測 active 平行 writer process；加 dirty-tree leftover 偵測（即使沒 active process，working tree 留有大量跨語譯檔 = 別 session 的未提交工作）。
- **Git-ref 層**：`git fetch origin && git rev-parse origin/main` 比對 local，看 HEAD 是否被別 actor 推過。
- 回傳結構化 signal（`CLEAN` / `PARALLEL_PROCESS` / `DIRTY_LEFTOVER` / `REMOTE_AHEAD`）讓 caller 判斷。

### 6.2 `.husky/pre-push`（新建，B + C 的核心）

push 前硬閘（這是 B/C 從空白到有的關鍵）：

1. **Working-tree scope sanity**（B 防線）：跑 check-parallel-actor.sh。若 `DIRTY_LEFTOVER`（要推的 commit 範圍可能含別 session 的檔）→ 警告 + 列出可疑檔；若 `REMOTE_AHEAD` → 提示先 `git pull --rebase` 再推（避免 ref-lock reject）。
2. **CI in-flight 檢查**（C 防線，哲宇選的）：
   - `gh run list --workflow=deploy.yml --status=in_progress --json databaseId,createdAt,...`
   - 有 in-flight deploy 時，比對它跑多久 vs 典型 deploy 時長（refactor 後 build ~125s，整個 deploy 待 dogfood 量）：
     - **快跑完**（已跑 > ~70% 典型時長）→ 輪詢等它跑完再 push，不白白觸發取消。
     - **剛起跑**（還很久）→ 直接 push，cancel-in-progress 接手 latest-wins。
   - 上限 poll window（如 ≤ 3 min）避免 hook 永久 hang 卡死 routine。
3. **Fast-path**：若這次 push 只動 deploy 不觸發的路徑，跳過 CI 檢查省延遲（見 §7 latency）。

`gh` 不可用 / 未 auth → hook **fail-loud 但放行**（per MANIFESTO §禁忌一：不可 silent，但 CI 檢查不可用不該 block 工作），印警告留痕。

### 6.3 `.husky/pre-commit` 升級（A 防線補強）

- 現有 narrative pollution detector（`:142`）從**只警告**升成：偵測到跨 narrative domain 且 check-parallel-actor.sh 回報有平行 actor 時 → **擋**（exit 1），要求拆 commit 或顯式聲明。單機無平行 actor 時維持警告（誤判成本低）。
- husky lint-staged stash race 修補：lint-staged 只處理「本次 staged 且屬於我的」檔，stash 範圍縮到 staged-only（避免 stash → restore 吞掉 sibling 在 working tree 的檔，這是 vc=2 根因）。
- post-commit 自檢做成 `scripts/tools/lib/verify-commit-scope.sh`：commit 後驗 staged count == 預期，給收官 SOP + routine wrapper 呼叫（git 的 post-commit hook 不能 block，所以這是 caller 主動跑的驗證，不是 hook）。

### 6.4 CI 面：保留 cancel-in-progress + 選配 path-filter

哲宇要保留 `cancel-in-progress: true`（latest-wins，不要 stale deploy 排隊）。pre-push 的 in-flight 檢查負責「別砍快跑完的」。

**選配補強（我推薦，非鎖定）**：`deploy.yml` 加 path filter，讓純機械/非內容 push（`reports/**`、`reports/babel-patches/**`、`docs/semiont/memory/**`、`docs/semiont/diary/**`）不觸發 deploy。現在 `on: push: branches:[main]` 無 filter，連寫 memory 都觸發一次完整 deploy 再被取消——這是 66% 取消的**觸發率根因**。path-filter 直接降低觸發次數，是比 pre-push 檢查更上游的 §架構解。兩者不衝突：path-filter 減少觸發、pre-push 檢查處理剩下的真內容 push。留給哲宇決定要不要加。

---

## 7. 殘餘風險與邊界（誠實標註）

- **pre-push hook 是 local，可被 `--no-verify` 繞過**：hook 裝在每個 clone（routine cron 跑在同機共用），但它是「把自律變成結構」不是真正隔離。真正物理隔離仍是 worktree（#9）。`--no-verify` 繞過 per §禁忌一 只有一種合法例外。這條限制要寫進 #68 boundary。
- **pre-push 加延遲**：每次 push 多一個 `gh run list` 網路往返。對高頻 push 的 routine 有成本。緩解：§6.2 fast-path（非內容 push 跳過）+ poll window 上限。實際延遲待 dogfood 量。
- **threshold 憑想像會錯**（REFLEXES #66）：「快跑完」的 70% 門檻、poll window 3 min 都要用真實 deploy 時長 dogfood 校準後才定，不是憑空設。
- **check-parallel-actor.sh 的 lsof/pgrep 是 best-effort**：抓得到同機 process，抓不到別機器。git-ref 層補一部分（看 remote），但「別機器本地未 push 工作」結構上不可見——這是分散式的物理邊界，誠實標明不假裝解決。
- **hook 自身要 fail-loud self-test**（REFLEXES #24 第 8 種）：pre-push hook 第一版必跑 negative test（故意製造 in-flight deploy 看會不會等），否則就是 #52「沒在 fail loud 的 immune system」。

---

## 8. 實作計畫（分階段 ship，按風險排序）

平行 routine 現在還在跑（過去 24hr 10 條 cron fire），**活著裝 hook 有風險**（可能打斷正在跑的 routine）。建議順序：

0. **清 worktree 垃圾**（零風險，可立刻做）：`git worktree list` 盤點 ~40 stale `agent-*` locked + 數個 5–6 月手動 worktree → `git worktree remove` 清掉沒在用的，採用 worktree-default 前先把地基掃乾淨（#9 命名 + finale 紀律）。
1. **先建 read-only 工具**（零風險）：`check-parallel-actor.sh` + `verify-commit-scope.sh`。先能偵測、不改行為。
2. **dogfood 校準 threshold**：量真實 deploy 時長 + push 延遲，定 §6.2 數字（per #66）。
3. **改認知層 canonical**（哲宇 glance）：BECOME §行動鐵律 5 改寫 + REFLEXES #68 新增 + 各 #N 加 umbrella pointer + DNA.md gene map row。這是 identity 層，哲宇看一眼再 ship。
4. **裝 hook**（挑無 routine 跑的時窗）：`.husky/pre-push` + pre-commit 升級。裝完跑 negative test。
5. **選配**：`deploy.yml` path-filter（哲宇決定）。
6. **收官**：LESSONS-INBOX 的三條（cross-session-git-index-pollution / multi-core-commit-collision / deploy 取消率）標 resolved-by 本設計；vc 歸檔。

---

## 9. 實作完成紀錄（2026-06-14 /goal — §8 完整 ship）

哲宇 `/goal` directive「完整做完 §8，每步 進化＋檢查＋驗證＋紀錄，然後 finale」。全 ship：

| §8 step | 產出                                                                                      | 驗證                                                                                               | commit      |
| ------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------- |
| 0+1     | `check-parallel-actor.sh` + `verify-commit-scope.sh` + `worktree-gc.sh`                   | 三支跑通；worktree-gc 對 49 worktree 全判「保留」（皆有 unpushed/locked）— 安全檢查生效            | d318b9fc8   |
| 2       | deploy 時長校準                                                                           | 實測 success≈350s / cancelled 151-312s / 5-8 取消（62%）→ pre-push 門檻定 245s（per #66 不憑想像） | —           |
| 3       | BECOME 鐵律 5 三階段改寫 + REFLEXES #68 umbrella + index + #6 back-ref + DNA gene map row | 散落七處原則統合，薄殼守住                                                                         | a1724effe   |
| 4       | `.husky/pre-push` 誕生 + `.husky/pre-commit` parallel-actor 快檢                          | negative test：skip/gh-unavail/no-deploy 路徑全 exit 0；首次 live push 靜默通過（clean=quiet）     | a1724effe   |
| 5       | path-filter                                                                               | **選配未採用**（哲宇拍板保留 cancel-in-progress + pre-push 查 CI）                                 | —           |
| 6       | LESSONS 三條標 resolved_by + finale                                                       | 本節 + /twmd-finale                                                                                | (本 commit) |

**活體驗證（這個 session 親身撞到碰撞，鐵律當場接住三次）**：(1) commit 報告時工作目錄有 24+ 別 session dirty 檔 → stage-only-mine + scope verify 擋下；(2) push 報告 v2 時 sibling 的 `呂冠緯 Stage 0-1`（中間產物）疊上我的 push 範圍 → 偵測到，held；(3) 同刻 in-flight content deploy → 不為 report 取消，held。三次都是設計的防線在真實多核心下生效。這條 vc++ 進 cross-session-git-index-pollution（活體 instance）。

**殘餘（誠實標註）**：(a) pre-push 是 local advisory，`--no-verify` 仍可繞 — 真隔離靠 worktree；(b) pre-commit 的 parallel-actor 檢查刻意只警告不擋（hard-block 會打斷 routine commit）；(c) lint-staged stash race 本質未根除（靠 worktree 隔離 + post-commit verify 繞過，非改 lint-staged 內部）；(d) 49 個 stale worktree 因有 unpushed/locked 暫不可 gc，待各自工作落地後 `worktree-gc.sh --apply`；(e) LESSONS 三條 in-place 標 resolved_by，正式 §未消化→§已消化 sweep 留 /twmd-distill（兩 §未消化 section 結構問題需哲宇拍板合併）。

---

_v1.0 | 2026-06-14-020335-manual — §8 完整 ship（§9 紀錄）。三工具 + canonical 統合 + pre-push hook 全 land + 活體三證。_
_v0.2 | 2026-06-14-020335-manual — 加 §5.0 worktree-ff-push 脊椎（解哲宇主要卡點「worktree 是否一定走 PR」，dry-run 實證 ff 直接落 main）+ 開工階段升 worktree-default + §8 加 worktree 垃圾清理 step 0。_
_v0.1 | 2026-06-14-020335-manual（Opus 4.8, 1M context）— 設計階段。哲宇 directive 觸發，三決策鎖定（§4）。_
_前身：[session-scope-proposal-2026-04-11.md](session-scope-proposal-2026-04-11.md)（commit 面四層架構）。本檔接續 push + CI 面，並把散落七處的原則統合到 BECOME §行動鐵律 5。_
