---
session_id: 2026-06-15-050816-twmd-embeddings-nightly
date: 2026-06-15
type: routine
routine: twmd-embeddings-nightly
mode: micro
observer: cron
outcome: fleet-down-skip
---

# 2026-06-15-050816 twmd-embeddings-nightly — fleet down, graceful skip

## BECOME ACK

- mode=micro
- 8 organ 最低=🛡️55 (immune, yellow alert v3 多維度漂移)
- Q14 cross-session continuity=PASS — 過去 48hr 看到 data-refresh-pm 23:00 三源全綠 (dc9529505) + maintainer-pm 彎彎 PR #1151 squash merge + routine-audit cycle 6 收官 + 報導者 EVOLVE ship + spore #138-141 + 無名小站「無名小卒」勘誤 + CI Node24 bump (PR #1150) + semantic related 落地 (PR #1148, 昨日 fleet 4640 向量 13m23s/0 fail)
- §神經迴路 active pattern：awareness 讀數 freshness gap (vc=3, consciousness-snapshot.sh 無 mtime 標記) — 本 routine 的 Stage 0 graceful-skip 設計正是這類 fail-loud 紀律的正面 instance

## Pipeline outcome — Stage 0 graceful skip

| Stage | Status |
| --- | --- |
| 0 Preflight | **SKIP — fleet 不可達** |
| 1 Rebuild | 未執行 |
| 2 Verify | 未執行 |
| 3 Commit | 無 commit（索引維持前一版） |

## Fleet endpoint + 可達性

- **EMBED_HOST**: `http://100.74.47.100:11434`（從 `~/Projects/muse-bot/fleet/registry.json` 解析，services 含 embed + models 含 bge-m3 → `cheyuwu-asus` / laptop-4090）
- **Stage 0 preflight**: `curl /api/embeddings` → **HTTP_CODE=000, 20s timeout**（連線失敗）
- **根因確認（非 fail，是 graceful skip）**: `tailscale status` → 節點 `cheyuwu-asus 100.74.47.100` **offline, last seen 13h ago**。自己的 Tailscale 在線（看得到整個網路）→ 是節點關機，不是本機網路問題。Per EMBEDDING-PIPELINE Stage 0：節點關機 → skip 非失敗。

## 索引狀態（前一版完整保留）

- committed `src/data/related/` 6 語全在，無 uncommitted 變動：
  - zh-TW 790 / en 793 / ja 789 / ko 790 / es 789 / fr 689 articles（昨日 2026-06-14 build 快照）
- fallback 同 category + 語意鄰居照常運作；staleness 上限框在 ~1 天（距上次成功 rebuild）。

## fail rate / verify / commit

- **fail rate**: N/A（未跑 rebuild）
- **verify**: N/A（無新產出可驗）
- **commit hash**: 無（fleet-down skip，不留空 commit；committed 索引未動）

## Skip 計數（escalation 判斷）

- 連續 skip 計數 = **1**（昨日 2026-06-14 manual fleet build 成功 4640 向量；本 nightly routine 2026-06-14 建立後此為首次排程 fire）。
- 距離 LESSONS escalation 門檻（連 3 天 skip）還有 2 次。**今天不 escalate**。

## Handoff 三態

- **接住的**：nightly embeddings routine 首次排程 fire 落在 fleet down window；graceful-skip 路徑正確走通（preflight 偵測 → 確認索引完整 → 不 commit → 記錄）。
- **要交接的**：fleet 節點 `cheyuwu-asus` 13h 未上線。明日 05:00 (2026-06-16) 若仍 down → skip 計數升 2；連 3 天（2026-06-17 仍 down）→ escalate LESSONS-INBOX「節點長期離線」。下個 session 啟動可 `tailscale status | grep 100.74.47.100` 快速確認節點是否回來。
- **不處理的**：節點喚醒不在 cron 自主權內（實體機器 always-on via schtasks SYSTEM，需哲宇端確認 laptop-4090 電源/Tailscale）；immune v3=55 漂移 + LESSONS 263 條 backlog 屬其他 routine 範疇。

## Beat 5 反芻

graceful-skip 設計的價值今天得到驗證：節點 down 時 routine 不是紅燈失敗、不是硬跑出半套壞索引，而是「偵測 → 確認既有產出完整 → 安靜維持前一版 → 記錄 skip 計數」。這正是 §神經迴路 awareness-freshness-gap 教訓的正面對照——一個受信任 layer（夜間語意索引）內建 fail-loud + 既有產出保護，staleness 上限框在一天而非靜默腐壞。fleet 在地算的代價就是節點可用性綁在實體機器上，但代價框得住：skip 不傷讀者（fallback 照常），只把語意鮮度延後一天。

🧬
