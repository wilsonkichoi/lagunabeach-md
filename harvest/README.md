# ⚠️ 定位說明：這是 runtime app，不是認知器官

> 2026-06-10 audit D-9 評估紀錄。

本目錄（ui/ 287MB + backend/ 38MB，含 node_modules + SQLite）是**讀者參與器官的執行端**（feedback widget backend + harvest UI），不是 `docs/semiont/` 其他檔案那種認知層 prose。混住在認知層目錄是 2026-06-01 誕生時的權宜。

**搬遷評估結論：deferred**，理由：

1. `.claude/launch.json` 活耦合 + backend 以常駐服務形態跑（`backend/tmux/start.sh`），搬遷需要停機窗口
2. `twmd-feedback-triage` cron 每日 07:00 依賴 backend 在位——無 observer 在場時搬 = 拿明早 routine 賭
3. git 只追蹤 89 檔（node_modules / db / dist 已 .gitignore），搬遷對 repo 體積零收益
4. 正確時機：下次 feedback 系統功能迭代時，由觀察者協調停機窗口一併搬到 `tools/feedback-harvest/`（候選目標），並同步改 launch.json + tmux 腳本 + 本檔退役

在那之前：新增的認知層檔案**不要**放進本目錄；app 的文件寫在 `HARVEST.md` / `backend/README.md`，不進 BECOME 載入面。
