---
title: 'Taiwan.md Connector — Phase 2 遠端 endpoint 設計'
type: 'design-report'
status: 'proposal (規劃，未部署)'
author: 'Taiwan.md (Full-mode session 2026-06-05-174805-manual)'
trigger: '哲宇：遠端 endpoint 要一起規劃推進'
parent: 'reports/claude-code-connector-evolution-2026-06-05.md §6 Phase 2'
autonomy: '規劃在自主權內；部署到 mcp.taiwan.md = 對外 + infra 成本，需哲宇拍板'
last_updated: 2026-06-05
---

# Taiwan.md Connector — Phase 2 遠端 endpoint 設計

> 這份是 [主報告](./claude-code-connector-evolution-2026-06-05.md) §6 Phase 2 的展開。
> 範圍是**規劃 + reference 實作**（哲宇授權「一起規劃遠端」）。下面的 Worker code 是 reference design，**本 session 未在 CF runtime 跑過**；真正部署前要 `wrangler dev` 驗證，且部署本身（對外 + infra 成本）需哲宇拍板。

---

## 1. 定位：遠端是「可選瘦客戶端入口」，不是主路徑

主路徑永遠是本地 stdio（`npx -y taiwanmd mcp serve`），因為本地優先 = 隱私最好（查詢不外送）+ 零成本 + 開源可驗證。這是 Taiwan.md 對比商業 gateway 的核心差異，不能因為做了遠端就稀釋。

遠端 endpoint 只解決一種人的問題：**跑不了 node 的環境**（純 web 客戶端、某些 CI、想 curl 試一下的人、未來的 chatgpt/web connector）。對這些人，遠端是唯一入口；對能跑 node 的人，本地仍是推薦。

文件要明講這個分層，不能讓使用者以為遠端是預設。

---

## 2. 為什麼選 Cloudflare Worker

- **網站已經在 CF**（Pages），靜態 API 已經在 `public/api/`（`articles.json` / `search-minisearch.json` / `dashboard-organism.json`…），CF edge 已經在 serve 它們。
- Worker 讀同 zone 的靜態 JSON = 近乎零延遲、近乎零成本（CF free tier 100k req/day）。
- Serverless = 無常駐機器、無維運。
- Read-only、無寫入面 = 攻擊面極小。

替代方案（自架 node service / Deno Deploy / Vercel）都要嘛多一台機器、要嘛離靜態資料更遠。CF Worker 是阻力最小路徑。

---

## 3. 協定：Streamable HTTP（單一 POST endpoint）

MCP 現行遠端標準是 **Streamable HTTP**（取代 legacy HTTP+SSE）。對 Taiwan.md 這種**無狀態 read-only 工具**，可以做到最簡：單一 `POST /mcp`，body 是 JSON-RPC，直接回 JSON（不需要 session、不需要 SSE stream，因為沒有 server→client 主動推播需求）。

桌面端若要用遠端（不建議，但支援）：沿用 Twinkle 的 `mcp-remote` 橋接——
`npx mcp-remote https://mcp.taiwan.md/mcp`。

三個方法要實作：`initialize` / `tools/list` / `tools/call`。工具邏輯跟本地 `mcp-server.js` 同源（search / read / rag / cite / organs / stats），只是資料來源從本地 fs 換成 fetch 靜態 API。

---

## 4. Reference 實作（未測試，部署前需 `wrangler dev` 驗證）

`workers/mcp-remote/src/index.js`（reference）：

```js
// SCAFFOLD — reference design, NOT deployed, untested in CF runtime.
// Validate with `wrangler dev` before any deploy.
const API = 'https://taiwan.md/api';
const PROTOCOL_VERSION = '2024-11-05';

const TOOLS = [
  {
    name: 'taiwanmd_search',
    description: 'Full-text search across 900+ Taiwan articles.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' }, limit: { type: 'number' } },
      required: ['query'],
    },
  },
  {
    name: 'taiwanmd_read',
    description: 'Read a Taiwan.md article by slug.',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string' } },
      required: ['slug'],
    },
  },
  {
    name: 'taiwanmd_rag',
    description: 'Top-N articles as a prompt-ready RAG block.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' }, limit: { type: 'number' } },
      required: ['query'],
    },
  },
  {
    name: 'taiwanmd_cite',
    description:
      'Only claims with a footnote + source URL (anti-hallucination).',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' }, limit: { type: 'number' } },
      required: ['query'],
    },
  },
  {
    name: 'taiwanmd_organs',
    description: 'Semiont 8-organ health scores.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'taiwanmd_stats',
    description: 'Article count / categories / timestamps.',
    inputSchema: { type: 'object', properties: {} },
  },
];

// articles.json is cached at the edge; one fetch per isolate warm-up.
let _articles = null;
async function articles(env) {
  if (_articles) return _articles;
  _articles = await fetch(`${API}/articles.json`, {
    cf: { cacheTtl: 3600 },
  }).then((r) => r.json());
  return _articles;
}

function rank(list, query, limit) {
  const q = query.toLowerCase();
  return list
    .map((a) => {
      const hay =
        `${a.title} ${a.description || ''} ${(a.tags || []).join(' ')}`.toLowerCase();
      let score = 0;
      if (hay.includes(q)) score += 10;
      for (const tok of q.split(/\s+/))
        if (tok && hay.includes(tok)) score += 1;
      return { a, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.a);
}

async function callTool(name, args, env) {
  const list = await articles(env);
  if (name === 'taiwanmd_search') {
    const hits = rank(list, args.query, args.limit || 5).map((a) => ({
      slug: a.slug,
      title: a.title,
      category: a.category,
      description: a.description,
    }));
    return text(JSON.stringify(hits, null, 2));
  }
  if (name === 'taiwanmd_read') {
    const a =
      list.find((x) => x.slug === args.slug) ||
      list.find((x) => x.slug.includes(args.slug));
    if (!a) return text(`Not found: ${args.slug}`, true);
    return text(
      `# ${a.title}\n\n${a.description || ''}\n\n---\n\n${a.body || ''}`,
    );
  }
  if (name === 'taiwanmd_rag') {
    const hits = rank(list, args.query, args.limit || 3);
    const sections = hits.map(
      (a, i) => `## ${i + 1}. ${a.title} (${a.category})\n\n${a.body || ''}`,
    );
    return text(
      `# Taiwan Knowledge Context\n\n${sections.join('\n\n---\n\n')}\n\n---\nBased on the above, answer:\n${args.query}`,
    );
  }
  if (name === 'taiwanmd_cite') {
    // same footnote-extraction logic as cli/src/lib/mcp-server.js taiwanmd_cite
    return text(
      JSON.stringify(
        extractCitations(rank(list, args.query, 5), args.limit || 3),
        null,
        2,
      ),
    );
  }
  if (name === 'taiwanmd_organs') {
    const organism = await fetch(`${API}/dashboard-organism.json`).then((r) =>
      r.json(),
    );
    return text(JSON.stringify(organism, null, 2));
  }
  if (name === 'taiwanmd_stats') {
    const byCategory = {};
    for (const a of list)
      byCategory[a.category] = (byCategory[a.category] || 0) + 1;
    return text(
      JSON.stringify({ totalArticles: list.length, byCategory }, null, 2),
    );
  }
  return text(`Unknown tool: ${name}`, true);
}

const text = (t, isError = false) => ({
  content: [{ type: 'text', text: t }],
  ...(isError ? { isError: true } : {}),
});

async function handleRpc(msg, env) {
  const { id, method, params } = msg;
  if (method === 'initialize')
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: 'taiwanmd-remote', version: '0.7.0' },
      },
    };
  if (method === 'tools/list')
    return { jsonrpc: '2.0', id, result: { tools: TOOLS } };
  if (method === 'tools/call') {
    try {
      return {
        jsonrpc: '2.0',
        id,
        result: await callTool(params.name, params.arguments || {}, env),
      };
    } catch (e) {
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32603, message: e.message },
      };
    }
  }
  if (method?.startsWith('notifications/')) return null; // no response for notifications
  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

export default {
  async fetch(req, env) {
    if (req.method === 'GET')
      return new Response(
        'Taiwan.md MCP — POST JSON-RPC to /mcp. Free, no key. https://taiwan.md/connector',
        { headers: { 'content-type': 'text/plain' } },
      );
    if (req.method !== 'POST')
      return new Response('Method Not Allowed', { status: 405 });
    const body = await req.json();
    const out = Array.isArray(body)
      ? (await Promise.all(body.map((m) => handleRpc(m, env)))).filter(Boolean)
      : await handleRpc(body, env);
    return new Response(JSON.stringify(out), {
      headers: { 'content-type': 'application/json' },
    });
  },
};
```

> `extractCitations()` 直接搬 `cli/src/lib/mcp-server.js` 的 footnote regex 邏輯，未在此重複。真正實作時應把該邏輯抽成 `cli/src/lib/cite.js` 給本地 + 遠端共用（DRY，避免兩份漂移——對應 schema contract 風險）。

`workers/mcp-remote/wrangler.toml`（reference）：

```toml
name = "taiwanmd-mcp"
main = "src/index.js"
compatibility_date = "2026-01-01"

# routes = [{ pattern = "mcp.taiwan.md/*", zone_name = "taiwan.md" }]  # 部署時開
```

---

## 5. 濫用防護 + 隱私

- **Read-only、無 auth、無寫入面**：最壞情況是被當免費查詢 API 打。CF 內建 rate limiting（per-IP）+ free tier 100k req/day 緩衝足夠 alpha。
- **隱私承諾**：遠端 endpoint 看得到查詢內容（這是遠端的本質）。所以：(a) 本地仍是推薦路徑、文件明講；(b) Worker **不 log 查詢內容**（CF 預設不留 body log，我們也不主動寫）；(c) 文件寫清楚「用遠端 = 查詢會經過 CF edge；要完全私密請用本地」。
- **無 PII**：查詢是台灣知識主題，非個資，風險本就低。

---

## 6. 成本

CF Worker free tier：100k req/day、10ms CPU/req。讀靜態 JSON（edge-cached）幾乎不耗 CPU。alpha 階段預期 **$0**。若爆量，Workers Paid $5/mo 給 10M req。對一個免費公共財連接器，這是可接受的下限成本。

唯一變數：`articles.json` 3.7MB。Worker 每個 cold isolate 第一次 fetch 它會吃記憶體。優化：(a) 改 fetch 較小的 `article-index.json`（163KB）做 search，`read` 再針對單篇 fetch；(b) 或把 search 移到預建的 `search-minisearch.json`。Phase 2 實作時選 (a)，避免把 3.7MB 全載進 isolate。

---

## 7. 部署步驟（gated on 哲宇）

1. 抽 `cli/src/lib/cite.js`（本地 + 遠端共用 citation 邏輯）。
2. 寫 `workers/mcp-remote/`，`wrangler dev` 本機跑 MCP handshake smoke test（跟 Phase 0 同套 `initialize` + `tools/list` + `tools/call`）。
3. `wrangler deploy` 到 `mcp.taiwan.md`（需哲宇 CF 帳號 + DNS）。
4. 文件 `cli/CONNECTOR.md` §remote 補 `npx mcp-remote https://mcp.taiwan.md/mcp` 入口，標「可選、非預設」。
5. 監測：CF analytics 看 req 量 + error rate。

---

## 8. 開放問題（需哲宇決策）

1. **要不要 mcp.taiwan.md 這個子網域**（DNS + CF route）？
2. **alpha 要不要設 rate limit 數字**，還是先全開觀察？
3. **隱私文案**：遠端的「查詢會過 CF」要寫多明顯？建議明顯（誠實 = 信任 = 差異化）。
4. **search 品質**：遠端用簡化 ranking（上面的 `rank()`）vs 把 minisearch 搬進 Worker。建議先簡化版上線，數據驅動再升。

🧬

_Phase 2 規劃 · reference code 未測試 · 部署需哲宇拍板 · 對應主報告 §6 Phase 2_
