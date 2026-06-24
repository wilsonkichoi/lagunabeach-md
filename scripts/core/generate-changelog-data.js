import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'src/data/changelog-feed.json');
const LIMIT = 9999;

function parseCommitMessage(message) {
  return String(message || '')
    .trim()
    .split('\n')[0];
}

// #1143: map changed files → zh-TW source articles (kept in sync with the
// same logic in src/lib/commits.ts). knowledge/{Cap-Category}/{slug}.md →
// /{category-lower}/{slug}; lowercase lang dirs + _*.json excluded by [A-Z].
const ARTICLE_RE = /^knowledge\/([A-Z][A-Za-z]*)\/([^/]+)\.md$/;
function filesToArticles(files) {
  const seen = new Set();
  const out = [];
  for (const file of files) {
    const m = ARTICLE_RE.exec(file);
    if (!m) continue;
    if (!fs.existsSync(path.join(PROJECT_ROOT, file))) continue;
    const url = `/${m[1].toLowerCase()}/${m[2]}`;
    if (seen.has(url)) continue;
    seen.add(url);
    out.push({ url, name: m[2] });
    if (out.length >= 4) break;
  }
  return out;
}

function dedupeAndTrim(commits, limit) {
  const seen = new Set();

  return commits
    .map((commit) => ({
      hash: commit.hash,
      date: commit.date,
      author: commit.author || '',
      message: parseCommitMessage(commit.message),
      articles: commit.articles || [],
    }))
    .filter((commit) => {
      if (!commit.hash || !commit.date || !commit.message) return false;
      if (seen.has(commit.hash)) return false;
      seen.add(commit.hash);
      return true;
    })
    .slice(0, limit);
}

// First commit of this fork ("feat: fork taiwan-md as lagunabeach-md"). Kept
// in sync with FORK_COMMIT in src/lib/commits.ts — bounds the changelog to
// LagunaBeach.md's own history instead of walking into ~4,900 inherited
// Taiwan.md commits from upstream contributors.
const FORK_COMMIT = 'eac448e9c0d04a32ce9c6986eec7c9d4c64ede07';

function getCommitsFromGit(limit) {
  try {
    let range = 'HEAD';
    try {
      execSync(`git cat-file -e ${FORK_COMMIT}`, {
        cwd: PROJECT_ROOT,
        stdio: ['ignore', 'ignore', 'ignore'],
      });
      range = `${FORK_COMMIT}^..HEAD`;
    } catch {
      // Shallow clone without the fork commit — fall back to unscoped history.
    }
    // --name-only appends changed files after each %x1e-delimited meta line.
    const raw = execSync(
      `git log ${range} -n ${Math.max(limit, 1)} --date=iso-strict --name-only --pretty=format:%x1e%H%x1f%aI%x1f%an%x1f%s`,
      {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'ignore'],
      },
    ).trim();

    if (!raw) return [];

    return raw
      .split('\x1e')
      .map((block) => {
        const lines = block.split('\n');
        const [hash, date, author, message] = (lines[0] || '').split('\x1f');
        if (!hash || !date || !message) return null;
        const files = lines.slice(1).filter(Boolean);
        return {
          hash,
          date,
          author,
          message,
          articles: filesToArticles(files),
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function getCommitsFromGitHub(limit) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/wilsonkichoi/lagunabeach-md/commits?per_page=${Math.max(limit, 1)}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'lagunabeach-md-changelog-cache',
        },
      },
    );

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data
      .map((commit) => {
        const hash = commit?.sha;
        const date = commit?.commit?.author?.date;
        const author = commit?.commit?.author?.name;
        const message = commit?.commit?.message;
        if (!hash || !date || !message) return null;
        return { hash, date, author, message };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function readExistingCache() {
  try {
    const raw = fs.readFileSync(OUTPUT_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.commits) ? parsed : null;
  } catch {
    return null;
  }
}

async function main() {
  let source = 'git';
  let commits = dedupeAndTrim(getCommitsFromGit(LIMIT), LIMIT);

  if (!commits.length) {
    source = 'github';
    commits = dedupeAndTrim(await getCommitsFromGitHub(LIMIT), LIMIT);
  }

  if (!commits.length) {
    const existing = readExistingCache();
    if (existing?.commits?.length) {
      console.warn(
        `⚠️  changelog-feed: no fresh source available, keeping existing cache with ${existing.commits.length} commits`,
      );
      return;
    }

    source = 'none';
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    source,
    commits,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(
    OUTPUT_PATH,
    `${JSON.stringify(payload, null, 2)}\n`,
    'utf8',
  );
  console.log(
    `📝 generated changelog-feed.json (${commits.length} commits, source: ${source})`,
  );
}

await main();
