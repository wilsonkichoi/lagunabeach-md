import { readFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

export type Contributor = {
  name: string;
  login: string;
};

export type GitInfo = {
  contributors: Contributor[];
  lastModified: string;
  commitHash: string;
  revisionCount: number;
};

type ContributorProfile = {
  name: string;
  login: string;
};

let contributorProfiles: Map<string, ContributorProfile> | null = null;

function contributorKey(value: string) {
  return value.toLowerCase().replace(/[\s._-]+/g, '');
}

function getContributorProfiles() {
  if (contributorProfiles) return contributorProfiles;

  contributorProfiles = new Map();
  try {
    const configPath = resolve(process.cwd(), '.all-contributorsrc');
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    for (const contributor of config.contributors || []) {
      if (!contributor.login || !contributor.name) continue;
      const profile = {
        name: contributor.name,
        login: contributor.login,
      };
      contributorProfiles.set(contributorKey(contributor.name), profile);
      contributorProfiles.set(contributorKey(contributor.login), profile);
    }
  } catch (e) {
    console.error('Contributor profile error:', (e as Error).message);
  }

  return contributorProfiles;
}

export function resolveContributor(
  authorName: string,
  authorEmail: string,
): Contributor {
  const githubNoreplyMatch = authorEmail.match(
    /^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i,
  );
  const githubLogin = githubNoreplyMatch?.[1]?.toLowerCase();
  const profile =
    getContributorProfiles().get(contributorKey(githubLogin || '')) ||
    getContributorProfiles().get(contributorKey(authorName));
  const login = githubLogin || profile?.login || authorName;
  const isAuthorNameLogin =
    profile && contributorKey(authorName) === contributorKey(profile.login);

  return {
    name: isAuthorNameLogin
      ? profile.name
      : authorName || profile?.name || login,
    login,
  };
}

export function emptyGitInfo(): GitInfo {
  return {
    contributors: [],
    lastModified: '',
    commitHash: '',
    revisionCount: 0,
  };
}

// Module-level memo（per knowledgePath）。呼叫端有兩種 scope：
// (a) 6 個 [slug].astro wrapper 的 getStaticPaths — 各自 module cache，每語言一次
// (b) article.template.astro 的 per-render frontmatter — ⚠️ frontmatter 每頁重跑，
//     沒有這層 memo 時 git log 子程序每篇文章執行一次（4,895 頁 ≈ build 主要瓶頸，
//     2026-06-13 實測修復；詳 reports/article-template-refactor-2026-06-13.md）。
// Trade-off：dev server 進程存活期間 contributor 資訊不會跟著新 commit 更新
// （跟 articles-index.ts 同款 trade-off）；static build 一個進程內 git 狀態不變，無影響。
const _gitInfoCacheByPath = new Map<string, Map<string, GitInfo>>();

export function buildGitInfoCache(knowledgePath: string) {
  const memo = _gitInfoCacheByPath.get(knowledgePath);
  if (memo) return memo;
  const cache = new Map<string, GitInfo>();

  try {
    // Use %aN (mailmap-aware author name) + %aE (mailmap-aware email)
    // instead of %an/%ae so .mailmap consolidates author variants.
    // See: https://git-scm.com/docs/git-log#_pretty_formats
    const logOutput = execSync(
      `git log --full-history -z --name-only --format="COMMIT|%H|%aI|%aN|%aE" -- "${knowledgePath}"`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 },
    );
    let currentHash = '';
    let currentDate = '';
    let currentContributor: Contributor | null = null;

    for (let token of logOutput.split('\0')) {
      token = token.replace(/^\n+/, '').trim();
      if (!token) continue;

      if (token.startsWith('COMMIT|')) {
        const parts = token.split('|');
        currentHash = parts[1] || '';
        currentDate = parts[2] || '';
        currentContributor = resolveContributor(parts[3] || '', parts[4] || '');
      } else if (token.startsWith('knowledge/') && token.endsWith('.md')) {
        const key = resolve(process.cwd(), token).normalize('NFC');
        let entry = cache.get(key);
        if (!entry) {
          entry = {
            contributors: [],
            lastModified: currentDate,
            commitHash: currentHash,
            revisionCount: 0,
          };
          cache.set(key, entry);
        }
        entry.revisionCount += 1;
        if (
          currentContributor &&
          !entry.contributors.some(
            (contributor) => contributor.login === currentContributor?.login,
          )
        ) {
          entry.contributors.push(currentContributor);
        }
      }
    }
  } catch (e) {
    console.error('Git cache error:', (e as Error).message);
  }

  _gitInfoCacheByPath.set(knowledgePath, cache);
  return cache;
}
