/**
 * classify.mjs — Feedback → GitHub issue 的純function層（無 IO,好測）。
 *
 *  - detectSpam(row)      → { isSpam, score, reasons }
 * - resolveType(row) → 'content' | 'bug' | 'newtopic'（信Reader選的,缺才推斷）
 * - buildIssue(row) → { title, labels, body }（alignmentexisting issue template;不含 email）
 * - dedupeKey(row) → 穩定characters串,用來在 batch inside + 對existing issue 去重
 *  - isDuplicate(row, existingIssues) → boolean
 * - scrubSecrets(str) → RemoveanyReaderfield裡夾帶的 OAuth token / JWT / email（PII 第二道閘）
 *
 * 鐵律：issue body 只放 display_name,**永遠不放 email**（public issue 不洩 PII）。
 * Reader文characters verbatim 引用,triage 不替Reader改寫對錯（那是Maintenance者人類 gate 的事）。
 *
 * ⚠️ source_url 也是 PII 載體：登入Reader貼網址列時,Supabase OAuth implicit flow 會把
 * access_token / refresh_token / provider_token（JWT payload inside含 email）塞進 URL
 * hash fragment。原本「不放 email」只擋明文 email,擋不住 base64 編進 token 的 email +
 * 活的Credentials。allReader提供的field（source_url / body / quote / correct_info）進 issue/archive
 * 前都Must過 scrubSecrets()。Trigger：2026-06-16 feedback id 8f2f8908 把 OAuth callback URL
 * 寫進 public issue #1160（已Delete + re-file）。
 */

const TYPES = new Set(['content', 'bug', 'newtopic', 'idea']);

// ── secret / PII scrubbing ─────────────────────────────────────────────────────
// anyReaderfield進 public issue / git archive 前都要過這一層（PII 第二道閘）。
const JWT_RE = /eyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}/g;
const GOOGLE_TOK_RE = /ya29\.[A-Za-z0-9._-]{10,}/g;
const TOKEN_PARAM_RE =
  /\b(access_token|refresh_token|provider_token|id_token|provider_refresh_token)=([^&\s"'#]+)/gi;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

export function scrubSecrets(str) {
  if (str === null || str === undefined) return str;
  let s = String(str);
  // 1) URL hash fragment 帶 token → 整段 fragment 砍掉(對 bug Report無用)
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

  // 大量duplicatecharacters元（aaaaaa / 哈哈哈哈哈哈哈哈）
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
  /broken|404|crash|壞|壞掉|壞了|連結.*(失效|壞)|display|跡位|排版|變形|畫面/,
];
const CONTENT_HINTS = [
  /\b(wrong|incorrect|typo|error)\b/i,
  /錯|誤|should be|有誤|更正|errata|事實|過時/,
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
  const where = row.page_kind ? ` · Source頁:${row.page_kind}` : '';
  return `\n\n---\n> 🧬 由站上Report轉入（twmd-feedback-triage）· Report者：${who} · feedback id: \`${row.id}\`${when ? ` · ${when}` : ''}${where}`;
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
        `**issuedescription / Description**\n${scrubSecrets(row.body)}\n\n` +
        `**issue頁面 URL**\n${scrubSecrets(row.source_url) || '(n/a)'}` +
        provenance(row),
    };
  }

  if (type === 'newtopic') {
    return {
      type,
      title: `[Article] ${truncate(row.body, 50)}`,
      labels: ['content', 'from-feedback'],
      body:
        `**category / Category**\n${row.category || '(未category)'}\n\n` +
        `**主題提案 / Proposal**\n${scrubSecrets(row.body)}` +
        (row.correct_info
          ? `\n\n**reference / Notes**\n${scrubSecrets(row.correct_info)}`
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

  // content（errata）→ alignment fact-correction.yml。有 quote = Reader選文段標註。
  const quoteBlock = row.quote
    ? `**Reader選取的原文 / Selected passage**\n> ${scrubSecrets(String(row.quote)).replace(/\n/g, '\n> ')}\n\n🔗 directly定位：${scrubSecrets(row.source_url)}\n\n`
    : '';
  return {
    type,
    title: `[Fact Check] ${title}`,
    labels: ['needs-verification', 'from-feedback'],
    body:
      `**哪Articles / Which article?**\n${articleRef(row)}\n\n` +
      quoteBlock +
      `**哪裡有誤 / What's wrong?**\n${scrubSecrets(row.body)}` +
      (row.correct_info
        ? `\n\n**correct資訊 + Source / Correct info + source**\n${scrubSecrets(row.correct_info)}`
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
 * 對existing open issue 去重。existingIssues: [{title, body}]。
 * 命中件：issue body 已含這筆 feedback id（已開過）,或同 article+type title撞。
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
 * 整批分流。return每筆的 decision。純function —— 不開 issue,只決定。
 */
/**
 * Reader面的 AI 初判理由（v3 Grokipedia 透明化）。中性措辭、標「automatic初判 + 人工會再看」，
 * notMaintenance者正式回覆（那走 MAINTAINER 人類 gate）。
 */
export function triageNoteFor(row) {
  const type = resolveType(row);
  const m = {
    content:
      '已收到你的errata，automatic初判category為「Contenterrata」，已轉Maintenance者查核（人工會再看）。',
    bug: '已收到，automatic初判category為「網站issue」，已轉Maintenance者。',
    newtopic: '已收到你的新主題suggestion，已排入待評估list。',
    idea: '已收到你的想法，已轉Maintenance者reference。',
  };
  return m[type] || '已收到，已轉Maintenance者。';
}

const REJECT_NOTE =
  'System初步判定為廣告/InvalidContent，未轉成 issue。If是誤判，歡迎再送一次或補上Source。';

/**
 * sameArticles在same batch 出現 ≥ 此數量的非 spam Report → 整群 hold,不逐筆開 issue。
 * 誕生event：2026-06-09 12 連發 flood（一筆一 issue 開了 12 ）+ 2026-06-12 justfont
 * 共同Creator 21 連errata（當班 routine 人工判斷不 --commit 才沒開 22 ）。
 * 同 slug 大量Report的correct形狀是 1 consolidated artifact 給Maintenance者,not N issue。
 */
export const BATCH_CLUSTER_THRESHOLD = 5;

function clusterKey(row) {
  return (row.article_slug || '').toLowerCase().trim();
}

export function triageBatch(rows, existingIssues = []) {
  // Pass 1: 找出超量 cluster（只算非 spam 且有 slug 的Report）。
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
      // consolidated cluster report 升級給Maintenance者決策。
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
