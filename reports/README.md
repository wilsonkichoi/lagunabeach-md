# reports/ — Session 報告與歷史快照層

> 2026-06-10 audit D-9 立此索引。reports/ 是認知層的「歷史 snapshot 層」（ANATOMY promotion flow Layer 4）：
> canonical 檔案凋亡後的歸宿、session 工作的證據鏈、設計決策的出生紀錄。
> **它刻意不是 canonical**——這裡的內容代表寫下當時的真相，不保證現在還對。

## 目錄 taxonomy

| 子目錄                                                                         | 內容                                               | 生命週期                                                           |
| ------------------------------------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------ |
| `research/YYYY-MM/`                                                            | REWRITE Stage 1 研究 SSOT（每篇文章一份）          | 永久（文章的證據鏈）；**音檔不入 git**（.gitignore 2026-06-10 起） |
| `factcheck/YYYY-MM/`                                                           | FACTCHECK Full mode 報告                           | 永久（immune v3 external_rulers 的資料源）                         |
| `weekly/`                                                                      | 週報                                               | 永久                                                               |
| `audit/`、`ab-tests/`、`probe/`、`translation-research/`、`music-media-audit/` | 各類專項掃描                                       | 永久                                                               |
| `visual/`                                                                      | 截圖 / 視覺驗證 artifacts（多為 untracked 本機檔） | **TTL 90 天**：超過 90 天的本機截圖可清（git-tracked 的保留）      |
| `scratch/`                                                                     | 暫存草稿                                           | TTL 30 天，隨手清                                                  |
| `archive/`                                                                     | 季度歸檔（2026-05-27 archival audit 建立）         | 永久                                                               |
| 根目錄 `*.md`                                                                  | 設計報告 / critique-response / session 級報告      | 永久                                                               |

## 命名公約

`{slug}-{YYYY-MM-DD}.md`（日期在尾），session 級加 handle：`{slug}-{YYYY-MM-DD}-{handle}.md`。

## Canonical-grade reports（被認知器官 / pipeline 引用，刪前先查反向引用）

這些報告被 active layer 指向，地位接近 canonical 附錄：

- `become-boot-mode-design-2026-05-13.md` — BECOME v2.0 mode dispatcher 設計（BECOME/CLAUDE.md 引用）
- `sync-architecture-evolution-2026-05-12.md` — knowledge/ → src/content 轉錄架構（MANIFESTO §6 引用）
- `immune-score-redesign-2026-05-16.md` — immune v2/v3 公式設計（generate-dashboard-immune.py 引用）
- `session-id-naming-2026-05-04.md` — session ID schema（BECOME 鐵律 2 引用）
- `heartbeat-pre-thinning-2026-05-13.md` — HEARTBEAT v2.x 全文 archive（HEARTBEAT v3.0 引用）
- `routine-contract-rollback-2026-05-28.md` — REFLEXES #63 引用
- `article-health-ssot-design-2026-05-04.md` — article-health.py 引用
- `semiont-full-audit-2026-06-10.md` + `semiont-full-audit-2026-06-10-execution.md` — 全身審計 + 執行日誌

完整反向引用查法：`grep -rl "reports/{檔名}" docs .claude scripts BECOME_TAIWANMD.md CLAUDE.md`

## 寫新報告前

1. 先查本索引 taxonomy，放對子目錄（根目錄保留給設計 / 決策級報告）
2. 一次性 session artifact 優先進對應子目錄，不要堆根目錄
3. 報告被 canonical 引用後，加進上方 canonical-grade 清單
