/**
 * classify.mjs — Feedback → GitHub issue 的純函式層（無 IO,好測）。
 *
 *  - detectSpam(row)      → { isSpam, score, reasons }
 *  - resolveType(row)     → 'content' | 'bug' | 'newtopic'（信讀者選的,缺才推斷）
 *  - buildIssue(row)      → { title, labels, body }（對齊既有 issue template;不含 email）
 *  - dedupeKey(row)       → 穩定字串,用來在 batch 內 + 對既有 issue 去重
 *  - isDuplicate(row, existingIssues) → boolean
 *
 * 鐵律：issue body 只放 display_name,**永遠不放 email**（public issue 不洩 PII）。
 *       讀者文字 verbatim 引用,triage 不替讀者改寫對錯（那是維護者人類 gate 的事）。
 */

const TYPES = new Set(['content', 'bug', 'newtopic']);

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
  return `\n\n---\n> 🧬 由站上回報轉入（twmd-feedback-triage）· 回報者：${who} · feedback id: \`${row.id}\`${when ? ` · ${when}` : ''}`;
}

function truncate(s, n) {
  s = (s || '').trim().replace(/\s+/g, ' ');
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function articleRef(row) {
  if (row.source_url) return row.source_url;
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
        `**問題描述 / Description**\n${row.body}\n\n` +
        `**問題頁面 URL**\n${row.source_url || '(n/a)'}` +
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
        `**主題提案 / Proposal**\n${row.body}` +
        (row.correct_info ? `\n\n**參考 / Notes**\n${row.correct_info}` : '') +
        provenance(row),
    };
  }

  // content（勘誤）→ 對齊 fact-correction.yml
  return {
    type,
    title: `[Fact Check] ${title}`,
    labels: ['needs-verification', 'from-feedback'],
    body:
      `**哪篇文章 / Which article?**\n${articleRef(row)}\n\n` +
      `**哪裡有誤 / What's wrong?**\n${row.body}` +
      (row.correct_info
        ? `\n\n**正確資訊 + 來源 / Correct info + source**\n${row.correct_info}`
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
export function triageBatch(rows, existingIssues = []) {
  const seen = new Set();
  return rows.map((row) => {
    const spam = detectSpam(row);
    if (spam.isSpam) {
      return {
        row,
        decision: 'reject',
        reason: `spam:${spam.reasons.join(',')}`,
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
    return { row, decision: 'file', issue: buildIssue(row) };
  });
}
