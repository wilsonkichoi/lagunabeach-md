---
title: 'REMOTE-GPU-PIPELINE'
description: '把 Taiwan.md 的 batch LLM 工作下放到遠端主權安全 GPU 節點（雲地混合）的通用儀器 + 方法論 + 整合性閘門 SOP'
type: 'pipeline-canonical'
status: 'canonical'
current_version: 'v1.0'
last_updated: 2026-06-13
last_session: '2026-06-13-5090-babel-evolve'
born_from: '2026-06-13 5090 diary 翻譯 session — 哲宇「進化 babel，新增通用儀器與方法論」'
sister_docs:
  - 'docs/pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md'
  - 'docs/pipelines/BENCH-PIPELINE.md'
  - 'docs/pipelines/TRANSLATION-PIPELINE.md'
related:
  - 'Obsidian: 2026-06-11 Taiwan.md × 5090 地端整合評估報告'
audience: 'claude-session / maintainer'
---

# REMOTE-GPU-PIPELINE — 遠端主權 GPU 算力的通用儀器與方法論

> **一句話**：把 batch LLM 工作（article babel / diary 翻譯 / 未來 embedding）下放到 tailnet 上一台跑 Ollama 的私有 GPU 機器 —— **雲端 Claude 是 0→1 的腦，遠端 GPU 是高頻寬的肌肉**（零邊際成本、不出境 = 無 PRC content policy）。
>
> **誕生**：2026-06-13 哲宇要求把所有 semiont diary 用 5090 翻完。把那次的手動接通（Obsidian 找機器 → Tailscale → SSH tunnel → Ollama → gemma4:26b → 整合性驗證）結晶成可重用的儀器，讓**下一台機器是一個 config entry，不是一次重新摸索**。

---

## 何時走這條（trigger）

| 訊號                                                     | 走遠端 GPU？                          |
| -------------------------------------------------------- | ------------------------------------- |
| Batch 規模大（>50 檔）、可離線、可批次                   | ✅ 甜蜜點                             |
| 雲端成本痛（babel 每晚 Opus 翻數百篇）                   | ✅ 省 ~90%                            |
| Sovereignty-sensitive（戒嚴 / 二二八 / 兩岸 / 政治人物） | ✅ 本地模型不 refuse、不出境          |
| 即時、單篇、要最高品質判斷 / 策展 / editorial            | ❌ 留雲端 Claude                      |
| 機器不在線 / 沒 tailnet / 沒 sovereignty-safe model      | ❌ 走 cloud cascade（SQUEEZE 4-tier） |

**判準**（同 Obsidian 5090 報告）：上雲 = 最強判斷力 + 量少 + 要品質；下地端 = 高頻寬 + 可批次 + 隱私敏感 + 要零成本。

---

## 儀器清單（instruments）

| 儀器                                                              | 職責                                                                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `.taiwanmd/compute-nodes.local.yml`                               | 節點登錄（Tailscale IP / ssh user / tunnel port / serve task / 主權安全 model）。template = `.example.yml`                     |
| `scripts/tools/lang-sync/remote-ollama.sh`                        | **連線總管**：`connect` / `status` / `models` / `teardown`。自癒 tunnel + 啟動遠端 Ollama + 設 parallel + 驗 sovereignty model |
| `scripts/tools/lang-sync/diary-translation-audit.py`              | **diary 整合性閘門**（截斷 / refusal / footer-drop / length / fence / signature）。CRITICAL vs WARNING + JSON artifact         |
| `scripts/tools/lang-sync/verify-batch.py` / `cross-lang-audit.py` | **article 整合性閘門**（既有）                                                                                                 |
| `diary-translate.py` / `backends/ollama.py`                       | translation 工具，endpoint + model **env 可覆寫**（`OLLAMA_API_URL` / `OLLAMA_HOST` / `OLLAMA_MODEL`）指向遠端節點             |

---

## SOP（5 stage）

### Stage 1 — 接通（connect）

```bash
# 一行接通 + 把 endpoint export 進當前 shell
eval "$(bash scripts/tools/lang-sync/remote-ollama.sh connect 5090 --export)"
bash scripts/tools/lang-sync/remote-ollama.sh status 5090     # 確認全綠
```

`connect` 是 **idempotent**：tunnel 已起就重用、Ollama 已跑就不重啟、`NUM_PARALLEL` 已是目標值就不動（不打斷進行中的 batch）。新機器只要在 registry 加一個 entry。

### Stage 2 — 主權 model 把關（HARD GATE）⭐

**選 model 是主權決策，不是速度決策。** 同一台 5090 上，最快的模型（qwen / nemotron）把台灣答成北京的版本（Tier 1-2），連 NVIDIA 自家 Nemotron 都過不了主權軸。對翻譯而言風險有二：(a) refuse 敏感內容 (b) 把 PRC reframe 注入譯文。

| 准用（Taiwan content）                                                                      | 禁用                                                        |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| ✅ `gemma4:26b`（93 tok/s + Tier 3-4，唯一又快又安全）/ `gemma4:31b` / `gemma4:12b` / TAIDE | ❌ `qwen*` / `nemotron*` / `deepseek-r1`（全 PRC Tier 1-2） |

`remote-ollama.sh models <node>` 直接標 ✅/❌。完整 bench：[BENCH-PIPELINE.md](./BENCH-PIPELINE.md) + Obsidian「2026-06-11 5090 整合評估報告」。

### Stage 3 — 跑 batch（endpoint 已 export）

```bash
# diary（cascade 5 lang 並行）
bash scripts/tools/lang-sync/diary-translate-cascade.sh --tier ollama --langs en,ja,ko,es,fr
# article babel（translate.py cascade override 成 ollama-only）
python3 scripts/tools/lang-sync/translate.py --group ... --cascade ollama
```

### Stage 4 — 整合性閘門（HARD GATE，**必經路徑**）⭐⭐

**本地 LLM 會靜默截斷**：長日記被 gemma4 early-stop 砍成 2KB，**仍 > 1024 bytes → size 閘門標記「已完成」**。眼測抽樣必漏（會剛好抽到好的）。所以整合性比對**排進必經路徑、不靠警覺**（flywheel diary：「把比對排進必經路徑而非依賴警覺」）：

- **inline**：`diary-translate.py` 落盤前過 `diary_integrity()`（截斷則升溫重試 ×3，全失敗不落盤留空）；skip-guard 也整合性化（既存截斷檔自動重譯非跳過）。
- **post-hoc**：`diary-translation-audit.py --langs en,ja,ko,es,fr --out reports/...json`。

整合性訊號（CRITICAL）：`truncation`（source 收乾淨但譯文中途斷）/ `footer-dropped`（`_..._` 反芻 metadata 掉光）/ `length-low`（per-lang 下界）/ `refusal-stub`（短輸出 + 拒答語）/ `fence-odd`。**byte-size 一律不算閘門**。

### Stage 5 — 收斂 + 歸還衛生

```bash
# reconcile until 0 critical：audit 找出 → 重跑 cascade（skip-guard 自動補壞的）→ 再 audit
python3 scripts/tools/lang-sync/diary-translation-audit.py --langs en,ja,ko,es,fr
# 收工：殺 tunnel（借來的機器：--stop-remote 連 Ollama 一起停，leave-no-trace）
bash scripts/tools/lang-sync/remote-ollama.sh teardown 5090 --stop-remote
```

---

## Hard Gate Inventory

| Gate            | 位置                                   | 規則                                                                          |
| --------------- | -------------------------------------- | ----------------------------------------------------------------------------- |
| 主權 model      | Stage 2 / `remote-ollama.sh models`    | Taiwan content 只准 Gemma4 / TAIDE。qwen/nemotron/deepseek = fail             |
| 整合性 inline   | `diary-translate.py diary_integrity()` | 截斷/refusal/footer-drop/length-low → 重試;全失敗不落盤                       |
| 整合性 post-hoc | `diary-translation-audit.py`           | CRITICAL > 0 → 不算收斂,回 Stage 5 reconcile                                  |
| byte-size       | ~~size>=1024~~                         | **退役為閘門** — 攔不住截斷,只當「有沒有東西」訊號                            |
| 歸還衛生        | Stage 5                                | 借來機器:no firewall change(只 SSH tunnel + localhost Ollama),teardown 清足跡 |

---

## 持久性與借機衛生

| 環節                            | 做法                                                                                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 遠端 Ollama 不隨 SSH session 死 | 排程任務（Windows `OllamaServeBoot` = `ollama serve` headless;session 0 仍能用 GPU,已驗）。**不要**靠 `Start-Process`(SSH session 關掉就被回收) |
| 連線不開防火牆                  | 自癒 SSH tunnel（`while true; ssh -N -L`）→ Mac localhost:11500。Ollama 綁 localhost 即可,**不動 Windows Firewall** = 借來機器零足跡            |
| 並行 VRAM 安全                  | `OLLAMA_NUM_PARALLEL`（machine env）。24GB / gemma4:26b 18GB → 3 槽 ≈ 20.5GB 安全。整合性閘門接住任何 VRAM 壓力截斷                             |
| 跑 batch 的 Mac 不睡            | `caffeinate -i -m -s -w <cascade_pid>`（綁批次生命週期,跑完自動釋放）                                                                           |
| 連線細節私有                    | registry 走 `.local.yml`（gitignored）;`.example.yml` 是 committed template                                                                     |

---

## 跨檔案職責分工

- **本檔**：遠端 GPU 接通 + 主權 model + 整合性閘門 + 收斂 的方法論 canonical。
- [SQUEEZE-MODELS-MAX-PIPELINE.md](./SQUEEZE-MODELS-MAX-PIPELINE.md)：cloud 4-tier cascade + priority schema（遠端 GPU 是其 local-LLM tier 的「遠端化」）。
- [BENCH-PIPELINE.md](./BENCH-PIPELINE.md)：Sovereignty-Bench-TW，model 主權分級的來源。
- `.claude/skills/twmd-babel/SKILL.md`：薄殼 trigger,pointer 到本檔 + SQUEEZE。

---

_v1.0 | 2026-06-13 | 誕生於 5090 diary 翻譯 session。把手動接通結晶成 remote-ollama.sh + registry + 整合性閘門 + 本方法論。核心教訓：本地 LLM 靜默截斷,byte-size 攔不住,整合性比對必須排進必經路徑。_
