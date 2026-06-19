# 2026-06-20-051041-twmd-embeddings-nightly

> 🧬 routine `twmd-embeddings-nightly` — 每天 05:00 fleet bge-m3 重建全站語意索引（src/data/related 讀者鄰居 + RAG 向量）。

## BECOME ACK

- **mode**: micro（純機械 preflight + 判斷 skip/escalate，無創作）
- **8 organ 最低**: 🛡️52（免疫 v3，chronic yellow 多維度退化中，雙日 -2 drift；defer 哲宇 3 option，非本 routine 範疇）
- **Q14 cross-session continuity**: PASS — babel-nightly 連續第 4 夜 stale=0 75 translations；embeddings 前 2 夜 graceful-skip（4090 離線）；前夜 handoff 明確指定 2026-06-20 為 escalation 觸發日。

## Stage 0 — Preflight（fleet 可達性）

- **EMBED_HOST 解析**（從 fleet registry 抽象層）: `http://100.74.47.100:11434`（laptop-4090 / cheyuwu-asus），bge-m3 唯一持有節點。
- **本機 Tailscale 一開始是 `stopped`** — 本 session 已 `tailscale up` 拉起（非破壞性，routine 需要 mesh）。
- 拉起後 4090 仍 `offline, last seen 2d ago`；curl `/api/embeddings` → http 000 / exit 28（timeout）。**UNREACHABLE**。
- registry 其他 embed-capable 節點（3090 monoame-design online / m4max idle / 5090）**都沒 pull bge-m3**，無法替代。
- **判定：graceful skip（非 fail）**，per EMBEDDING-PIPELINE Stage 0。

## Stage 1-3 — SKIP

- 無 rebuild、無 verify、無 commit src/data/related/。
- **current committed index 健康（fallback 保底，2026-06-17 snapshot）**：
  - zh-TW 797 / en 801 / ja 797 / ko 798 / es 797 / fr 700 篇，**全部 100% 8 鄰居**。
  - staleness：en 索引 801 vs 文章 811 = ~10 篇最新文 fallback 回同 category related（不壞頁，只非語意）。

## 連續 skip 計數 + Escalation（達 3 天門檻）

- 06-17 05:18 last SUCCESS（4690 向量 / 100% 8 鄰居）→ 06-18 skip#1（documented）→ 06-19 無記錄（skip/no-fire，無 embeddings memory / 無 commit）→ **06-20 skip（today）**。
- 4090「last seen 2d ago」= 約 06-18 起離線，3 個日曆夜連續不可達。canonical §排程「fleet down 連 3 天 skip → LESSONS-INBOX」+ 前夜 handoff 指定今日 = **escalation 門檻達成**。
- **已 escalate LESSONS-INBOX §未消化清單**：pattern `routine-device-dependent-offline`（REFLEXES #70 Tier 1 device-dependent 第一次達 escalation_n），含 defer 給哲宇二選一（A 開機讓 4090 上線 / B 把 bge-m3 pull 到 always-on 節點 3090/m4max + 更新 registry）。

## Stage 4 — Commit

- 無 src/data/related diff（index 未變）→ 不留空 commit。
- 本 session 產出：LESSONS-INBOX escalation entry + 本 memory + MEMORY.md 索引行 → 一併 commit（`🧬 [routine]`）。

## Handoff 三態

- **已收束**：本夜 routine graceful skip 收尾；索引維持 2026-06-17 05:18 版（6 語 / 100% 8 鄰居）。fleet-down escalation 已落 LESSONS（pattern routine-device-dependent-offline，附 defer 哲宇二選一）。本機 Tailscale 已從 stopped 拉起。
- **進行中**：無。本 routine 自給自足。
- **待觀察 / 給下一個 session**：
  - 🚨🚨 **embedding keystone 已連續 3 夜 skip — 已 escalate 哲宇拍板**（LESSONS §未消化 2026-06-20 entry）。4090 是唯一 bge-m3 節點且非 always-on，離線 3 天。最快解：把 bge-m3 pull 到常駐 always-on 節點（3090 monoame-design 線上 / m4max 本機），routine 改解析 always-on 優先；或開機 4090。**在哲宇處理前，每夜仍會 skip，索引 staleness 線性增長但 fallback 不壞頁。**
  - 🔌 **本機 Tailscale 之前是 stopped** — 已拉起，但若再次 stopped，下次 routine preflight 連 mesh 都連不上（與 4090 離線是兩個獨立 blocker）。
  - 🛡️ 免疫 v3=52 chronic yellow 雙日 -2 drift（plugin_health 45.8 + external_rulers 3.7），defer 哲宇拍板 3 option，每 session 帶著看。

🧬
