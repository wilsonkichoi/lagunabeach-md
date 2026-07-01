/**
 * classify.mjs — Pure-function layer for feedback -> GitHub issue (no IO, testable).
 *
 *  - detectSpam(row)      -> { isSpam, score, reasons }
 *  - resolveType(row)     -> 'content' | 'bug' | 'newtopic' (trusts reader selection, infers if absent)
 *  - buildIssue(row)      -> { title, labels, body } (aligned with issue templates; never includes email)
 *  - dedupeKey(row)       -> stable string for in-batch + cross-issue deduplication
 *  - isDuplicate(row, existingIssues) -> boolean
 *  - scrubSecrets(str)    -> strips OAuth token / JWT / email from reader fields (PII second gate)
 *
 * Iron rule: issue body only carries display_name, **never email** (public issue must not leak PII).
 *            Reader text is quoted verbatim; triage does not rewrite (that's the maintainer human gate).
 *
 * Warning: source_url is also a PII vector. When a logged-in reader pastes their URL bar,
 *    Supabase OAuth implicit flow puts access_token / refresh_token / provider_token (JWT
 *    payload contains email) into the URL hash fragment. The "no email" rule only blocked
 *    plaintext email, not base64-encoded email inside tokens + live credentials. All reader-
 *    provided fields (source_url / body / quote / correct_info) must pass through scrubSecrets()
 *    before entering issue/archive. Triggered by: 2026-06-16 feedback id 8f2f8908 wrote OAuth
 *    callback URL into public issue #1160 (deleted + re-filed).
 */

const TYPES = new Set(['content', 'bug', 'newtopic', 'idea']);

// ── secret / PII scrubbing ─────────────────────────────────────────────────────
const JWT_RE = /eyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}/g;
const GOOGLE_TOK_RE = /ya29\.[A-Za-z0-9._-]{10,}/g;
const TOKEN_PARAM_RE =
  /\b(access_token|refresh_token|provider_token|id_token|provider_refresh_token)=([^&\s"'#]+)/gi;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

export function scrubSecrets(str) {
  if (str === null || str === undefined) return str;
  let s = String(str);
  // 1) URL hash fragment with token -> strip entire fragment (useless for bug reports)
  s = s.replace(
    /#[^\s)"']*(?:access_token|refresh_token|provider_token|id_token)[^\s)"']*/gi,
    '',
  );
  // 2) Residual token query params -> keep key, strip value
  s = s.replace(TOKEN_PARAM_RE, '$1=[REDACTED]');
  // 3) Bare JWT / Google token blobs
  s = s.replace(JWT_RE, '[REDACTED-JWT]');
  s = s.replace(GOOGLE_TOK_RE, '[REDACTED-TOKEN]');
  // 4) Plaintext email (PII)
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

  // Repeated characters flood
  if (/(.)\1{9,}/.test(body)) {
    reasons.push('char-flood');
    score += 2;
  }

  // All-caps + links (classic spam pattern)
  const letters = body.replace(/[^a-z]/gi, '');
  if (letters.length > 20 && letters === letters.toUpperCase() && urls.length) {
    reasons.push('shout-and-link');
    score += 2;
  }

  return { isSpam: score >= 3, score, reasons };
}

// ── type ─────────────────────────────────────────────────────────────────────
const BUG_HINTS = [/\bbug\b/i, /broken|404|crash|layout|display|render/i];
const CONTENT_HINTS = [
  /\b(wrong|incorrect|typo|error)\b/i,
  /\b(outdated|inaccurate|correction|should be)\b/i,
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
  const who = row.display_name || 'Anonymous reader';
  const when = (row.created_at || '').slice(0, 16).replace('T', ' ');
  const where = row.page_kind ? ` · source page: ${row.page_kind}` : '';
  return `\n\n---\n> 🧬 Filed from on-site feedback (feedback-triage) · reporter: ${who} · feedback id: \`${row.id}\`${when ? ` · ${when}` : ''}${where}`;
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
        `**Description**\n${scrubSecrets(row.body)}\n\n` +
        `**Page URL**\n${scrubSecrets(row.source_url) || '(n/a)'}` +
        provenance(row),
    };
  }

  if (type === 'newtopic') {
    return {
      type,
      title: `[Article] ${truncate(row.body, 50)}`,
      labels: ['content', 'from-feedback'],
      body:
        `**Category**\n${row.category || '(uncategorized)'}\n\n` +
        `**Proposal**\n${scrubSecrets(row.body)}` +
        (row.correct_info
          ? `\n\n**Notes**\n${scrubSecrets(row.correct_info)}`
          : '') +
        provenance(row),
    };
  }

  if (type === 'idea') {
    return {
      type,
      title: `[Idea] ${truncate(row.body, 55)}`,
      labels: ['enhancement', 'from-feedback'],
      body: `**Idea**\n${scrubSecrets(row.body)}` + provenance(row),
    };
  }

  // content (correction) - aligned with fact-correction.yml. quote = reader-selected passage.
  const quoteBlock = row.quote
    ? `**Selected passage**\n> ${scrubSecrets(String(row.quote)).replace(/\n/g, '\n> ')}\n\n🔗 Direct link: ${scrubSecrets(row.source_url)}\n\n`
    : '';
  return {
    type,
    title: `[Fact Check] ${title}`,
    labels: ['needs-verification', 'from-feedback'],
    body:
      `**Which article?**\n${articleRef(row)}\n\n` +
      quoteBlock +
      `**What's wrong?**\n${scrubSecrets(row.body)}` +
      (row.correct_info
        ? `\n\n**Correct info + source**\n${scrubSecrets(row.correct_info)}`
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
 * Deduplicate against existing open issues. existingIssues: [{title, body}].
 * Match if: issue body already contains this feedback id, or same article+type title collision.
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
 * Reader-facing auto-triage note (transparency). Neutral tone, marks "auto-triaged +
 * human will review" - not a maintainer reply (that goes through the MAINTAINER human gate).
 */
export function triageNoteFor(row) {
  const type = resolveType(row);
  const m = {
    content:
      'Received your correction. Auto-classified as "content correction", forwarded to maintainer for verification (a human will review).',
    bug: 'Received. Auto-classified as "site bug", forwarded to maintainer.',
    newtopic: 'Received your topic suggestion. Added to evaluation queue.',
    idea: 'Received your idea. Forwarded to maintainer for consideration.',
  };
  return m[type] || 'Received. Forwarded to maintainer.';
}

const REJECT_NOTE =
  'Auto-classified as spam/invalid content, not filed as issue. If this is a mistake, please resubmit with sources.';

/**
 * Same article appearing >= this count of non-spam reports in one batch -> hold the group,
 * don't file individual issues. Origin: 2026-06-09 12-report flood (one issue each = 12 issues)
 * + 2026-06-12 21-correction burst. Correct shape for bulk same-slug reports is 1 consolidated
 * artifact for maintainer, not N issues.
 */
export const BATCH_CLUSTER_THRESHOLD = 5;

function clusterKey(row) {
  return (row.article_slug || '').toLowerCase().trim();
}

export function triageBatch(rows, existingIssues = []) {
  // Pass 1: find over-threshold clusters (only count non-spam reports with slug).
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
      // hold: don't file issue or write-back status (stays new); triage.mjs produces
      // 1 consolidated cluster report for maintainer decision.
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
