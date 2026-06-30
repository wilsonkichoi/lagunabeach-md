#!/usr/bin/env node
/**
 * generate-contributors-data.js
 *
 * output public/api/contributors.json — Dashboard Contribution Leaderboard 的Data層。
 *
 * Whyexists：
 * - about.template.astro 裡 45 contributor card 是manualMaintenance（易漏、易過時）
 * - Dashboard 繁殖System section Need data-driven 的 top 20 leaderboard
 * - Data層抽象化：未來Can多 consumer（about / dashboard / README / Spore）shared
 *
 * DataSource（雙軌）：
 * 1. GitHub /contributors endpoint — 權威的 login + avatar + commit 計數
 * （Avoid git log email → login 的corresponding模糊issue）
 * 2. git log — 活躍時段 + filepathcategory（email 匹配）
 *
 * Outputstructure：
 *   {
 *     lastUpdated: "2026-04-19T...",
 *     totals: { contributors: 46 },
 *     leaderboard: [{ login, commits, avatarUrl, profileUrl, primaryArea, lastActiveAt }, ...],
 *     topContent, topSystem, topTranslation: [...],
 *     weeklyActive, monthlyActive,
 *     recentlyJoined: [...]
 *   }
 *
 * Execute時機：
 * - npm run prebuild（加到 package.json）
 * - scripts/tools/refresh-data.sh（indirectly）
 *
 * CI 行為：
 * - GitHub API 必跑（prebuild chain 的一partial）
 * - Failed時 soft-fail：Output fallback 檔（只含 lastUpdated + 空 leaderboard），
 * consumer 不會 404
 *
 * v1.0 | 2026-04-19 β — CheYu 指派，配合 gitignore prebuild-regen JSON refactor
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'public/api/contributors.json');
const REPO = 'wilsonkichoi/lagunabeach-md';
const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';

// ─── Fork boundary ───────────────────────────────────────────────────────────
// LagunaBeach.md is a fork of LagunaBeach.md that carries the full upstream git
// history, so GitHub /contributors returns every historical LagunaBeach.md author
// (52). Those people authored the inherited infrastructure — they are not
// LagunaBeach contributors. They're credited once, as LagunaBeach.md, in README/about
// ("Built on LagunaBeach.md" + a link to upstream's contributor graph); this list is
// scoped to people active at/after the fork point.
//
// The fork instant is fixed history: first LagunaBeach.md commit 2026-06-20T09:36:05Z
// (Wilson Choi); last inherited LagunaBeach.md commit 2026-06-20T00:43:33Z (frank890417).
// Anyone whose most-recent commit is at/after the cutoff is a LagunaBeach
// contributor; the filter auto-includes future contributors with no manual upkeep.
// Compared via epoch, NOT lexical string compare — git %ai timestamps carry
// per-author UTC offsets, so same-calendar-date strings sort wrong across zones.
const FORK_EPOCH_MS = new Date('2026-06-20T09:36:05Z').getTime();

function isLagunaContributor(author, rcLogins) {
  if (rcLogins.has(author.login.toLowerCase())) return true; // curated LB overlay
  const t = author.lastCommitAt ? new Date(author.lastCommitAt).getTime() : 0;
  return t >= FORK_EPOCH_MS;
}

// ─── Step 1: GitHub API contributors ─────────────────────────────────────────

function fetchGh(urlPath) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.github.com',
      path: urlPath,
      method: 'GET',
      headers: {
        'User-Agent': 'lagunabeach-md-leaderboard/1.0',
        Accept: 'application/vnd.github+json',
      },
    };
    if (GH_TOKEN) opts.headers.Authorization = `Bearer ${GH_TOKEN}`;
    https
      .get(opts, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 120)}`));
          }
        });
      })
      .on('error', reject);
  });
}

async function fetchContributors() {
  const all = [];
  for (let page = 1; page <= 4; page++) {
    const batch = await fetchGh(
      `/repos/${REPO}/contributors?per_page=100&page=${page}`,
    );
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
  }
  // Filter bot 類。除了 type='Bot' / [bot] suffix，還要擋「User-typed bots」——
  // 用 User account 跑的機器人（如 astrobot-houston = Astro 的 Houston AI），
  // GitHub API 標 type='User' 會漏掉，明確列入 KNOWN_BOTS。
  const KNOWN_BOTS = new Set(['claude', 'astrobot-houston']);
  return all.filter(
    (c) =>
      !KNOWN_BOTS.has(c.login.toLowerCase()) &&
      c.type !== 'Bot' &&
      !c.login.endsWith('[bot]'),
  );
}

// ─── Step 2: git log 活躍時段 + filecategory ─────────────────────────────────────

/**
 * From git log 匯總Each email 的：firstAt, lastAt, content/system/translation 計數
 * return Map<email, { firstAt, lastAt, contentCommits, systemCommits, translationCommits }>
 */
function parseGitLog() {
  const SEP = '<<<__COMMIT__>>>';
  const out = execSync(
    `git log --no-merges --format='${SEP}%n%H%n%ae%n%ai' --name-only`,
    { cwd: PROJECT_ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
  );

  const byEmail = new Map();
  const commits = out.split(SEP).filter((c) => c.trim());

  for (const chunk of commits) {
    const lines = chunk.split('\n').filter((l) => l.length > 0);
    if (lines.length < 3) continue;
    const [hash, email, date, ...files] = lines;
    if (!email || !hash) continue;

    if (!byEmail.has(email)) {
      byEmail.set(email, {
        email,
        firstAt: date,
        lastAt: date,
        contentCommits: 0,
        systemCommits: 0,
        translationCommits: 0,
      });
    }
    const entry = byEmail.get(email);
    if (date < entry.firstAt) entry.firstAt = date;
    if (date > entry.lastAt) entry.lastAt = date;

    const hasKnowledge = files.some((f) => f.startsWith('knowledge/'));
    const hasSystem = files.some(
      (f) =>
        f.startsWith('src/') ||
        f.startsWith('scripts/') ||
        f.startsWith('.github/') ||
        f.startsWith('docs/') ||
        f === 'astro.config.mjs' ||
        f === 'package.json' ||
        f === '.gitignore',
    );
    const hasTranslation = files.some(
      (f) =>
        f.startsWith('knowledge/en/') ||
        f.startsWith('knowledge/ja/') ||
        f.startsWith('knowledge/ko/') ||
        f.startsWith('knowledge/es/') ||
        f.startsWith('knowledge/fr/') ||
        f.startsWith('src/i18n/'),
    );

    if (hasTranslation) entry.translationCommits += 1;
    else if (hasKnowledge) entry.contentCommits += 1;
    if (hasSystem) entry.systemCommits += 1;
  }

  return byEmail;
}

/**
 * 把 email map aggreagate 到 login：一 GitHub 帳號可能有多 email，
 * 用 email prefix fuzzy match（login ⊆ emailPrefix 或 emailPrefix ⊆ login）。
 * 同時Keepmanual alias cover常見 mismatch。
 */
const MANUAL_ALIASES = {
  // GitHub login → known email prefixes
  frank890417: ['cheyu.wu', '117846+frank890417', 'frank890417'],
  dreamline2: ['wilsonchen', 'wilson.chen.dev'],
  ceruleanstring: ['chilan'],
  AgendaLu: ['a9600125a'],
  idlccp1984: ['idlccp64', 'idlccp1984'],
  Link1515: ['terrylin1515', 'link1515'],
  fredchu: ['iamfredchu', 'fredchu'],
  Johnwang860424: ['ihatechina198964', 'johnwang860424'],
};

function matchEmailToLogin(email, login) {
  const prefix = email.split('@')[0].toLowerCase();
  const loginL = login.toLowerCase();
  if (prefix === loginL) return true;
  if (prefix.includes('+')) {
    const afterPlus = prefix.split('+')[1];
    if (afterPlus === loginL) return true;
  }
  // Manual aliases
  const aliases = MANUAL_ALIASES[login] || [];
  if (aliases.some((a) => a.toLowerCase() === prefix)) return true;
  // Fuzzy: substring match both ways
  if (prefix.includes(loginL) || loginL.includes(prefix)) return true;
  return false;
}

function aggregateByLogin(contributors, emailStats) {
  const out = [];
  for (const c of contributors) {
    let firstAt = null;
    let lastAt = null;
    let content = 0,
      system = 0,
      translation = 0;
    for (const [email, stats] of emailStats.entries()) {
      if (!matchEmailToLogin(email, c.login)) continue;
      if (!firstAt || stats.firstAt < firstAt) firstAt = stats.firstAt;
      if (!lastAt || stats.lastAt > lastAt) lastAt = stats.lastAt;
      content += stats.contentCommits;
      system += stats.systemCommits;
      translation += stats.translationCommits;
    }
    const max = Math.max(content, system, translation);
    let primaryArea = 'other';
    if (max > 0) {
      if (max === translation) primaryArea = 'translation';
      else if (max === content) primaryArea = 'content';
      else if (max === system) primaryArea = 'system';
    }
    out.push({
      login: c.login,
      commits: c.contributions,
      avatarUrl: c.avatar_url,
      profileUrl: c.html_url,
      firstCommitAt: firstAt,
      lastCommitAt: lastAt,
      primaryArea,
      breakdown: { content, system, translation },
    });
  }
  out.sort((a, b) => b.commits - a.commits);
  return out;
}

// ─── Step 3: Output ───────────────────────────────────────────────────────────

// all-contributors emoji key (https://allcontributors.org/docs/en/emoji-key) —
// the same standard the README ALL-CONTRIBUTORS table uses, so about + README
// show identical per-person badges.
const ALL_CONTRIB_EMOJI = {
  code: '💻',
  content: '🖋️',
  design: '🎨',
  ideas: '🤔',
  translation: '🌍',
  review: '👀',
  bug: '🐛',
  tool: '🔧',
  security: '🛡️',
  doc: '📖',
  projectManagement: '📆',
  infra: '🚇',
  maintenance: '🚧',
  test: '⚠️',
  question: '💬',
  blog: '📝',
};

function readAllContributorsRc() {
  try {
    return (
      JSON.parse(
        fs.readFileSync(path.join(PROJECT_ROOT, '.all-contributorsrc'), 'utf8'),
      ).contributors || []
    );
  } catch {
    return [];
  }
}

// Full contributor SSOT = UNION of GitHub /contributors committers AND
// .all-contributorsrc. 2026-06-13 (Cheyu callout): GitHub API alone (52) omits
// the 10 non-code contributors (ideas / translation / bug / review) that only
// live in .all-contributorsrc; .all-contributorsrc alone misses 5 newer
// committers. Union = 62, each carrying per-person contribution-type emoji
// (the about grid stamps these under each avatar, all-contributors style).
// Auto-infer base types from a committer's git-log breakdown — so a brand-new
// committer who's never in .all-contributorsrc still gets the right badges, and
// the count + base types stay correct even if nobody ever touches the rc file.
// .all-contributorsrc then only needs to ADD the curated types git can't detect
// (design / ideas / review / bug / doc / security…); it's an optional overlay,
// not a hard dependency. This is what makes the whole pipeline auto + SSOT:
// committers and base types are derived; only judgment-call types are manual.
function gitInferredTypes(author) {
  const b = author.breakdown || {};
  const t = [];
  if (b.system > 0) t.push('code'); // touched scripts/src/config
  if (b.content > 0) t.push('content'); // touched knowledge/*.md
  if (b.translation > 0) t.push('translation'); // touched knowledge/{lang}/
  return t.length ? t : ['code'];
}
const TYPE_ORDER = Object.keys(ALL_CONTRIB_EMOJI);

function buildAllContributors(authors) {
  const rc = readAllContributorsRc();
  const rcByLogin = new Map(rc.map((c) => [c.login.toLowerCase(), c]));
  const toEmoji = (types) =>
    [...new Set(types)]
      .sort((x, y) => TYPE_ORDER.indexOf(x) - TYPE_ORDER.indexOf(y))
      .map((t) => ALL_CONTRIB_EMOJI[t])
      .filter(Boolean);
  const seen = new Set();
  const out = [];
  // GitHub committers first (newest-commit ordering). Types = git-inferred base
  // ∪ .all-contributorsrc curated overlay.
  for (const a of authors) {
    const key = a.login.toLowerCase();
    seen.add(key);
    const rcEntry = rcByLogin.get(key);
    out.push({
      login: a.login,
      name: rcEntry?.name || a.login, // display name (README table), fallback login
      avatarUrl: a.avatarUrl,
      profileUrl: a.profileUrl,
      types: toEmoji([
        ...gitInferredTypes(a),
        ...(rcEntry?.contributions || []),
      ]),
    });
  }
  // .all-contributorsrc-only (non-committer contributors: ideas / bug reports /
  // translation suggestions that never produced a commit — purely manual).
  for (const c of rc) {
    if (seen.has(c.login.toLowerCase())) continue;
    out.push({
      login: c.login,
      name: c.name || c.login,
      avatarUrl: c.avatar_url,
      profileUrl: c.profile || `https://github.com/${c.login}`,
      types: toEmoji(c.contributions || []),
    });
  }
  return out;
}

function buildPayload(authors) {
  const now = Date.now();
  const DAY = 86400 * 1000;

  const weeklyActive = authors.filter(
    (a) =>
      a.lastCommitAt && now - new Date(a.lastCommitAt).getTime() <= 7 * DAY,
  ).length;
  const monthlyActive = authors.filter(
    (a) =>
      a.lastCommitAt && now - new Date(a.lastCommitAt).getTime() <= 30 * DAY,
  ).length;

  const recentlyJoined = authors
    .filter(
      (a) =>
        a.firstCommitAt &&
        now - new Date(a.firstCommitAt).getTime() <= 30 * DAY,
    )
    .sort(
      (a, b) =>
        new Date(a.firstCommitAt).getTime() -
        new Date(b.firstCommitAt).getTime(),
    )
    .slice(0, 10);

  // Full list = union(GitHub committers, .all-contributorsrc), each with
  // per-person contribution-type emoji. totals.contributors counts the union
  // (62) — was authors.length (52), which dropped the non-code contributors.
  const allContributors = buildAllContributors(authors);
  return {
    lastUpdated: new Date().toISOString(),
    totals: { contributors: allContributors.length, activeWindow: 'last 30d' },
    leaderboard: authors.slice(0, 20),
    // full名單（union GitHub committers + .all-contributorsrc 非 code Contributor），
    // 每人帶 per-person contribution-type emoji（all-contributors standard）。about
    // grid 用它做 data-driven 渲染，取代 57 manual硬encode card + fix只算 committer
    // 漏掉非 code Contributor的數characters。SSOT = .all-contributorsrc ∪ GitHub /contributors API。
    allContributors,
    topContent: authors.filter((a) => a.primaryArea === 'content').slice(0, 5),
    topSystem: authors.filter((a) => a.primaryArea === 'system').slice(0, 5),
    topTranslation: authors
      .filter((a) => a.primaryArea === 'translation')
      .slice(0, 5),
    weeklyActive,
    monthlyActive,
    recentlyJoined,
  };
}

function writeFallback(errorMsg) {
  // 2026-04-26 β8 fix: Don't在 API Failed時 wipe 掉上一筆好的 leaderboard。
  // Triggerscene：CF Pages CI 共享 IP 與other建置爭用 GitHub anon rate limit（60/hr），
  // 第 N build 一定撞 403 → before每次都 writeFallback 全 0 → Dashboard display 0
  // Contributor（事實是 50+）。fix：先讀現有 JSON，If有 > 0 leaderboard，
  // **KeepallData**，只在頂層加 staleness marker（lastUpdated 沿用、加 lastError）。
  // 只有「初次建置 + None舊檔」或「舊檔本身也是Empty」才寫真正的空 fallback。
  let existing = null;
  try {
    if (fs.existsSync(OUTPUT_PATH)) {
      existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
    }
  } catch (_) {
    /* corrupted file → fall through to fresh fallback */
  }

  if (
    existing &&
    Array.isArray(existing.leaderboard) &&
    existing.leaderboard.length > 0
  ) {
    // Keep上一筆好的Data；只Update staleness 旗標。
    existing.lastError = errorMsg;
    existing.lastErrorAt = new Date().toISOString();
    fs.writeFileSync(OUTPUT_PATH, serializeContributors(existing), 'utf8');
    console.warn(
      `⚠️ Keep上次Success的 leaderboard（${existing.leaderboard.length} 筆），` +
        `加 lastError 旗標。Dashboard 仍會displayData，只是 lastUpdated 不會推進。`,
    );
    return;
  }

  // 真正的初次建置 fallback：寫空檔（consumer 不會 404）
  const payload = {
    lastUpdated: new Date().toISOString(),
    totals: { contributors: 0, activeWindow: 'last 30d' },
    leaderboard: [],
    topContent: [],
    topSystem: [],
    topTranslation: [],
    weeklyActive: 0,
    monthlyActive: 0,
    recentlyJoined: [],
    error: errorMsg,
  };
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, serializeContributors(payload), 'utf8');
}

// Indent normally, but keep each contributor's `types` emoji array on one line.
// Matches the committed style so prebuild diffs show only real value changes —
// not array-reflow noise (61 arrays × ~9 lines each) that would spam every
// routine auto-commit. The emoji are quoted and comma-free, so split(',') is safe.
function serializeContributors(obj) {
  return JSON.stringify(obj, null, 2).replace(
    /"types": \[\s*([\s\S]*?)\s*\]/g,
    (_, inner) => {
      const items = inner
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return `"types": [${items.join(', ')}]`;
    },
  );
}

async function main() {
  console.log('👥 Generating contributors leaderboard...');

  let contributors;
  try {
    contributors = await fetchContributors();
    console.log(`   GitHub /contributors → ${contributors.length} users`);
  } catch (e) {
    console.warn(
      `⚠️ GitHub API Failed（Output fallback 空 leaderboard）: ${e.message}`,
    );
    writeFallback(e.message);
    return;
  }

  const emailStats = parseGitLog();
  console.log(`   git log parsed → ${emailStats.size} unique emails`);

  const rcLogins = new Set(
    readAllContributorsRc().map((c) => c.login.toLowerCase()),
  );
  const allAuthors = aggregateByLogin(contributors, emailStats);
  const authors = allAuthors.filter((a) => isLagunaContributor(a, rcLogins));
  console.log(
    `   fork filter → ${authors.length}/${allAuthors.length} authors kept ` +
      `(dropped ${allAuthors.length - authors.length} inherited LagunaBeach.md infra authors)`,
  );
  const payload = buildPayload(authors);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, serializeContributors(payload), 'utf8');

  console.log(
    `   ✅ contributors.json — ${payload.totals.contributors} total / ` +
      `${payload.weeklyActive} weekly / ${payload.monthlyActive} monthly / ` +
      `top 3: ${payload.leaderboard
        .slice(0, 3)
        .map((a) => `${a.login}(${a.commits})`)
        .join(', ')}`,
  );
}

main().catch((e) => {
  console.error('❌ generate-contributors-data Failed:', e);
  writeFallback(String(e.message || e));
  process.exit(0);
});
