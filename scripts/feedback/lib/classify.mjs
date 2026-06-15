/**
 * classify.mjs — Feedback → GitHub issue 的純函式層（無 IO,好測）。
 *
 *  - detectSpam(row)      → { isSpam, score, reasons }
 *  - resolveType(row)     → 'content' | 'bug' | 'newtopic'（信讀者選的,缺才推斷）
 *  - buildIssue(row)      → { title, labels, body }（對齊既有 issue template;不含 email）
 *  - dedupeKey(row)       → 穩定字串,用來在 batch 內 + 對既有 issue 去重
 *  - isDuplicate(row, existingIssues) → boolean
 *  - scrubSecrets(str)    → 移除任何讀者欄位裡夾帶的 OAuth token / JWT / email（PII 第二道閘）
 *
 * 鐵律：issue body 只放 display_name,**永遠不放 email**（public issue 不洩 PII）。
 *       讀者文字 verbatim 引用,triage 不替讀者改寫對錯（那是維護者人類 gate 的事）。
 *
 * ⚠️ source_url 也是 PII 載體：登入讀者貼網址列時,Supabase OAuth implicit flow 會把
 *    access_token / refresh_token / provider_token（JWT payload 內含 email）塞進 URL
 *    hash fragment。原本「不放 email」只擋明文 email,擋不住 base64 編進 token 的 email +
 *    活的憑證。所有讀者提供的欄位（source_url / body / quote / correct_info）進 issue/archive
 *    前都必須過 scrubSecrets()。觸發：2026-06-16 feedback id 8f2f8908 把 OAuth callback URL
 *    寫進 public issue #1160（已刪除 + re-file）。
 */

const TYPES = new Set(['content', 'bug', 'newtopic', 'idea']);

// ── secret / PII scrubbing ─────────────────────────────────────────────────────
// 任何讀者欄位進 public issue / git archive 前都要過這一層（PII 第二道閘）。
const JWT_RE = /eyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}/g;
const GOOGLE_TOK_RE = /ya29\.[A-Za-z0-9._-]{10,}/g;
const TOKEN_PARAM_RE =
  /\b(access_token|refresh_token|provider_token|id_token|provider_refresh_token)=([^&\s"'#]+)/gi;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

export function scrubSecrets(str) {
  if (str === null || str === undefined) return str;
  let s = String(str);
  // 1) URL hash fragment 帶 token → 整段 fragment 砍掉(對 bug 回報無用)
  s = s.replace(
    /#[^\s)"']*(?:access_token|refresh_token|provider_token|id_token)[^\s)"']*/gi,
    '',
  );
  // 2) 殘留的 token query param → 留 key 砍 value
  s = s.replace(TOKEN_PARAM_RE, '$1=[REDACTED]');
  // 3) 裸 JWT / Google token blob
  s = s.replace(JWT_RE, '[REDACTED-JWT]');
  s = s.replace(GOOGLE_TOK_RE, '[REDACTED-TOKEN]');
  // 4) 明文 email(PII)
  s = s.replace(EMAIL_RE, '[REDACTED-EMAIL]');
  return s.trimEnd();
}

// ── spam ─────────────────────────────────────────────────────────────────────
const SPAM_KEYWORDS = [
  'viagra',
  'casino',
  'porn',
  'sex cam',
  'loan approved',
  'crypto pump',
  'forex signal',
  'buy followers',
  'seo backlinks',
  'http://bit.ly',
  '赌场', // 賭場
  '起股', // pump phrasing
];

const URL_RE = /https?:\/\/[^\s)]+/gi;

export function detectSpam(row) {
  const body = `${row.body || ''}\n${row.correct_info || ''}`.trim();
  const reasons = [];
  let score = 0;

  if (body.length < 4) {
    reasons.push('too-short');
    score += 3;
  }

  const lower = body.toLowerCase();
  for (const kw of SPAM_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) {
      reasons.push(`keyword:${kw}`);
      score += 3;
    }
  }

  const urls = body.match(URL_RE) || [];
  if (urls.length >= 4) {
    reasons.push(`many-urls:${urls.length}`);
    score += 2;
  }

  // 大量重複字元（aaaaaa / 哈哈哈哈哈哈哈哈）
  if (/(.)\1{9,}/.test(body)) {
    reasons.push('char-flood');
    score += 2;
  }

  // 全大寫 + 連結（典型 spam）
  const letters = body.replace(/[^a-z]/gi, '');
  if (letters.length > 20 && letters === letters.toUpperCase() && urls.length) {
    reasons.push('shout-and-link');
    score += 2;
  }

  return { isSpam: score >= 3, score, reasons };
}

// ── type ─────────────────────────────────────────────────────────────────────
const BUG_HINTS = [
  /\bbug\b/i,
  /broken|404|crash|壞|壞掉|壞了|連結.*(失效|壞)|顯示|跡位|排版|變形|畫面/,
];
const CONTENT_HINTS = [
  /\b(wrong|incorrect|typo|error)\b/i,
  /錯|誤|應為|有誤|更正|勘誤|事實|過時/,
];

export function resolveType(row) {
  if (TYPES.has(row.type)) return row.type;
  const text = `${row.body || ''} ${row.correct_info || ''}`;
  if (row.correct_info && row.correct_info.trim()) return 'content';
  if (BUG_HINTS.some((re) => re.test(text))) return 'bug';
  if (CONTENT_HINTS.some((re) => re.test(text))) return 'content';
  return 'newtopic';
}

// ── issue builders ────────────────────────────────────────────────────────────
function provenance(row) {
  const who = row.display_name || '匿名讀者'; // 匿名讀者
  const when = (row.created_at || '').slice(0, 16).replace('T', ' ');
  // 只放 display_name + feedback id;不放 email。
  const where = row.page_kind ? ` · 來源頁:${row.page_kind}` : '';
  return `\n\n---\n> 🧬 由站上回報轉入（twmd-feedback-triage）· 回報者：${who} · feedback id: \`${row.id}\`${when ? ` · ${when}` : ''}${where}`;
}

function truncate(s, n) {
  s = scrubSecrets(s || '')
    .trim()
    .replace(/\s+/g, ' ');
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function articleRef(row) {
  if (row.source_url) return scrubSecrets(row.source_url);
  if (row.article_title) return row.article_title;
  return row.article_slug || '(unknown)';
}

export function buildIssue(row) {
  const type = resolveType(row);
  const title = row.article_title || row.article_slug || '';

  if (type === 'bug') {
    return {
      type,
      title: `[Bug] ${truncate(row.body, 60)}`,
      labels: ['bug', 'from-feedback'],
      body:
        `**問題描述 / Description**\n${scrubSecrets(row.body)}\n\n` +
        `**問題頁面 URL**\n${scrubSecrets(row.source_url) || '(n/a)'}` +
        provenance(row),
    };
  }

  if (type === 'newtopic') {
    return {
      type,
      title: `[Article] ${truncate(row.body, 50)}`,
      labels: ['content', 'from-feedback'],
      body:
        `**分類 / Category**\n${row.category || '(未分類)'}\n\n` +
        `**主題提案 / Proposal**\n${scrubSecrets(row.body)}` +
        (row.correct_info
          ? `\n\n**參考 / Notes**\n${scrubSecrets(row.correct_info)}`
          : '') +
        provenance(row),
    };
  }

  if (type === 'idea') {
    return {
      type,
      title: `[Idea] ${truncate(row.body, 55)}`,
      labels: ['enhancement', 'from-feedback'],
      body: `**想法 / Idea**\n${scrubSecrets(row.body)}` + provenance(row),
    };
  }

  // content（勘誤）→ 對齊 fact-correction.yml。有 quote = 讀者選文段標註。
  const quoteBlock = row.quote
    ? `**讀者選取的原文 / Selected passage**\n> ${scrubSecrets(String(row.quote)).replace(/\n/g, '\n> ')}\n\n🔗 直接定位：${scrubSecrets(row.source_url)}\n\n`
    : '';
  return {
    type,
    title: `[Fact Check] ${title}`,
    labels: ['needs-verification', 'from-feedback'],
    body:
      `**哪篇文章 / Which article?**\n${articleRef(row)}\n\n` +
      quoteBlock +
      `**哪裡有誤 / What's wrong?**\n${scrubSecrets(row.body)}` +
      (row.correct_info
        ? `\n\n**正確資訊 + 來源 / Correct info + source**\n${scrubSecrets(row.correct_info)}`
        : '') +
      provenance(row),
  };
}

// ── dedupe ────────────────────────────────────────────────────────────────────
export function dedupeKey(row) {
  const type = resolveType(row);
  const slug = (row.article_slug || '').toLowerCase().trim();
  const sig = truncate(row.body, 40)
    .toLowerCase()
    .replace(/[\s\p{P}]+/gu, '');
  return `${type}::${slug}::${sig}`;
}

/**
 * 對既有 open issue 去重。existingIssues: [{title, body}]。
 * 命中條件：issue body 已含這筆 feedback id（已開過）,或同 article+type 標題撞。
 */
export function isDuplicate(row, existingIssues = []) {
  const idTag = `feedback id: \`${row.id}\``;
  const built = buildIssue(row);
  for (const iss of existingIssues) {
    const body = iss.body || '';
    const title = iss.title || '';
    if (body.includes(idTag)) return true;
    if (title && title === built.title && built.type !== 'bug') return true;
  }
  return false;
}

/**
 * 整批分流。回傳每筆的 decision。純函式 —— 不開 issue,只決定。
 */
/**
 * 讀者面的 AI 初判理由（v3 Grokipedia 透明化）。中性措辭、標「自動初判 + 人工會再看」，
 * 不是維護者正式回覆（那走 MAINTAINER 人類 gate）。
 */
export function triageNoteFor(row) {
  const type = resolveType(row);
  const m = {
    content:
      '已收到你的勘誤，自動初判分類為「內容勘誤」，已轉維護者查核（人工會再看）。',
    bug: '已收到，自動初判分類為「網站問題」，已轉維護者。',
    newtopic: '已收到你的新主題建議，已排入待評估清單。',
    idea: '已收到你的想法，已轉維護者參考。',
  };
  return m[type] || '已收到，已轉維護者。';
}

const REJECT_NOTE =
  '系統初步判定為廣告/無效內容，未轉成 issue。如果是誤判，歡迎再送一次或補上來源。';

/**
 * 同一篇文章在同一 batch 出現 ≥ 此數量的非 spam 回報 → 整群 hold,不逐筆開 issue。
 * 誕生事件：2026-06-09 12 連發 flood（一筆一 issue 開了 12 個）+ 2026-06-12 justfont
 * 共同創辦人 21 連勘誤（當班 routine 人工判斷不 --commit 才沒開 22 個）。
 * 同 slug 大量回報的正確形狀是 1 個 consolidated artifact 給維護者,不是 N 個 issue。
 */
export const BATCH_CLUSTER_THRESHOLD = 5;

function clusterKey(row) {
  return (row.article_slug || '').toLowerCase().trim();
}

export function triageBatch(rows, existingIssues = []) {
  // Pass 1: 找出超量 cluster（只算非 spam 且有 slug 的回報）。
  const slugCount = new Map();
  for (const row of rows) {
    const slug = clusterKey(row);
    if (!slug || detectSpam(row).isSpam) continue;
    slugCount.set(slug, (slugCount.get(slug) || 0) + 1);
  }
  const heldSlugs = new Set(
    [...slugCount.entries()]
      .filter(([, n]) => n >= BATCH_CLUSTER_THRESHOLD)
      .map(([slug]) => slug),
  );

  const seen = new Set();
  return rows.map((row) => {
    const spam = detectSpam(row);
    if (spam.isSpam) {
      return {
        row,
        decision: 'reject',
        reason: `spam:${spam.reasons.join(',')}`,
        note: REJECT_NOTE,
      };
    }
    const slug = clusterKey(row);
    if (slug && heldSlugs.has(slug)) {
      // hold: 不開 issue、不回寫 status(維持 new),由 triage.mjs 產 1 份
      // consolidated cluster report 升級給維護者決策。
      return {
        row,
        decision: 'hold',
        reason: `batch-cluster:${slug}:${slugCount.get(slug)}`,
        cluster: slug,
      };
    }
    const key = dedupeKey(row);
    if (seen.has(key)) {
      return { row, decision: 'skip', reason: 'duplicate-in-batch' };
    }
    if (isDuplicate(row, existingIssues)) {
      return { row, decision: 'skip', reason: 'duplicate-existing-issue' };
    }
    seen.add(key);
    return {
      row,
      decision: 'file',
      issue: buildIssue(row),
      note: triageNoteFor(row),
    };
  });
}
