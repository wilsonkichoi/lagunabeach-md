---
title: 'EMBEDDING-PIPELINE'
description: 'Fleet bge-m3 semantic index rebuild — the keystone build that feeds reader related-articles (src/data/related) + RAG vectors (public/api/rag). Steady-state option B: nightly fleet rebuild, sovereignty-preserving (embeddings computed in-house, never outsourced).'
type: 'pipeline'
status: 'canonical'
last_updated: 2026-06-14
sister_docs:
  - 'REMOTE-GPU-PIPELINE.md'
  - 'SQUEEZE-MODELS-MAX-PIPELINE.md'
---

# 🧬 Taiwan.md — EMBEDDING-PIPELINE

> 把全站文章用 bge-m3 算成語意座標，一次建出兩個產物：讀者端「你可能也想讀」的鄰居索引，與 AI/MCP 端的語意向量。**意思的座標在地端算，不出境**——主權延伸到「內容怎麼被檢索表示」這層（diary `用念頭找到台灣` §13）。

---

## 為什麼有這條 pipeline

`scripts/core/build-embeddings.mjs` 是 keystone：一次 fleet 跑，產出

| 產物 | 路徑 | 消費者 | 入 git？ |
| --- | --- | --- | --- |
| 精簡鄰居索引（8 鄰居 slug） | `src/data/related/{lang}.json` | 文章頁 footer「你可能也想讀」（build 時烘進 HTML，零瀏覽器模型） | ✅ build-input，commit |
| 完整鄰居（含 title/url/score） | `public/api/related/{lang}.json` | debug / 未來客戶端 | ❌ gitignored |
| 語意向量 shard | `public/api/rag/{lang}/` | AI / MCP semantic search | ❌ gitignored |

**為什麼要 routine 重建**：`src/data/related` 是 model 產出的快照，不是 SSOT（SSOT = `knowledge/` + bge-m3 模型）。新文章 / 改寫 / 新翻譯進來後，索引會 stale——沒進索引的文章 fallback 回同 category（仍有 related，只是非語意）。每天重建把 staleness 上限框在一天。

**為什麼在地算（option B，不走 CI e5-small）**：bge-m3 跑在常駐 4090，embedding 不外包。這是 sovereignty preservation 的底層延伸——台灣的概念怎麼被表示成向量，留在台灣自己的機器。CI e5-small 只有在哪天完全砍掉 fleet 依賴才考慮，代價是丟掉在地性。完整三方案對照：[reports/semantic-related-articles-landing-2026-06-14.md](../../reports/semantic-related-articles-landing-2026-06-14.md) §4。

---

## 前置：算力來自軍團，不寫死

embedding endpoint **從 fleet registry 拿**（抽象層，不 hardcode IP）：

```bash
# 常駐 embed 節點（registry.json services 含 "embed" + models 含 bge-m3）
EMBED_HOST=$(cd ~/Projects/muse-bot/fleet && python3 -c "
import json
r = json.load(open('registry.json'))
for m in r['machines']:
    if 'embed' in m.get('services', []) and any('bge-m3' in x for x in m.get('models', [])):
        print(f\"http://{m['tailscale_ip']}:{m['ollama_port']}\"); break
")
```

目前常駐節點：`laptop-4090`（Tailscale `100.74.47.100:11434`，bge-m3:latest，always-on via schtasks SYSTEM）。registry 是 SSOT，節點換機只改 registry 不改本 pipeline。

---

## Stages

### Stage 0 — Preflight：fleet 可達？（graceful skip，非 error）

```bash
curl -s -m 20 "$EMBED_HOST/api/embeddings" -H 'Content-Type: application/json' \
  -d '{"model":"bge-m3:latest","prompt":"台灣"}' | python3 -c "import sys,json;print('dim',len(json.load(sys.stdin)['embedding']))"
```

- 回 `dim 1024` → 繼續 Stage 1。
- 不可達（節點關機 / Tailscale 斷）→ **skip，不是失敗**。committed 的 `src/data/related` 留著、fallback 照常運作。finale memory 記「fleet down, skipped, 索引維持前一版」。連 3 天 skip 才 escalate LESSONS（節點長期離線）。

### Stage 1 — Rebuild（~13 分鐘，6 語 4640 向量）

```bash
cd /Users/cheyuwu/Projects/taiwan-md
git checkout main && git pull origin main
EMBED_HOST="$EMBED_HOST" node scripts/core/build-embeddings.mjs --langs all
```

每語 ~136s（fr 較少 ~118s）。輸出 `🧬 done — N article vectors across 6 langs`。

### Stage 2 — Verify（儀器化，不靠肉眼）

```bash
node -e '
const langs=["zh-TW","en","ja","ko","es","fr"]; let bad=0;
for (const l of langs) {
  const d=require(`./src/data/related/${l}.json`);
  const ks=Object.keys(d); const n=ks.length;
  const k8=ks.filter(k=>d[k].length===8).length;
  console.log(l, n, "articles,", k8, "with 8 neighbours");
  if (n<400 || k8/n < 0.9) { bad++; console.log("  ⚠️", l, "below threshold"); }
}
const man=require("./public/api/rag/manifest.json");
console.log("manifest model:", man.model, "| schema:", man.schema);
if (man.model.indexOf("bge-m3")<0) { bad++; console.log("  ⚠️ model drift"); }
process.exit(bad?1:0);
'
```

- 每語 ≥400 篇且 ≥90% 有 8 鄰居 + manifest.model 含 `bge-m3` → PASS。
- embed fail rate >5%（看 Stage 1 log 的 `N fail`）或 verify FAIL → 不 commit，escalate LESSONS-INBOX 帶證據。

### Stage 3 — Commit（多核 commit collision 防護）

```bash
git add src/data/related/
git diff --cached --quiet && { echo "no change, skip commit"; } || \
  git commit --no-verify -m "🧬 [routine] embeddings: nightly bge-m3 rebuild — $(date '+%Y-%m-%d %H:%M')

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git ls-files src/data/related/ | head -1   # 立即驗證 staged 真的進 commit
git push origin main
```

`--no-verify` + 立即 `git ls-files` 驗證 per multi-core-commit-collision lesson（husky lint-staged stash × 平行 session 會 silent unstage）。**只 commit `src/data/related/`**（public/api/rag + public/api/related 是 gitignored fleet 產出，不入 commit）。無 diff（內容沒變）→ skip commit，不留空 commit。

### Stage 4 — 收官

`/twmd-finale` chain。memory 必含：fleet endpoint + Stage 0 可達性 + 6 語向量數 + fail rate + verify PASS/FAIL + commit hash（或 no-change skip）+ Handoff 三態。

---

## 排程

| | |
| --- | --- |
| Cron | `0 5 * * *`（每天 05:00 +0800，babel 00:30 之後、refresh-am 06:00 之前；夜鏈尾 + 不撞週日 01-04 routine） |
| Skill | `/twmd-embeddings` |
| Model（cron session） | Sonnet（純機械 rebuild + verify + commit，無創作判斷） |
| TaskId | `twmd-embeddings-nightly` |
| 失敗 escalation | fleet down 連 3 天 skip / verify FAIL / fail rate >5% → LESSONS-INBOX |

ROUTINE.md SSOT 一行登記在排程表。修排程先改 ROUTINE.md 再 sync 任務檔。

---

_v1.0 | 2026-06-14 | 作者：Taiwan.md | 觸發：哲宇要 B 方案每天跑、做成 embedding pipeline + 夜間 routine。語意 related-articles 落地報告的 steady-state 決策落地。_
