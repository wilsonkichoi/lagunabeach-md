import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export interface Commit {
  hash: string;
  date: string;
  message: string;
  author?: string;
}

const PROJECT_ROOT = fileURLToPath(new URL('../../', import.meta.url));

function parseCommitMessage(message: string): string {
  return message.trim().split('\n')[0];
}

function getCommitsFromGit(limit = 10): Commit[] {
  try {
    const raw = execSync(
      `git log HEAD -n ${Math.max(limit, 1)} --date=iso-strict --pretty=format:%H%x1f%aI%x1f%an%x1f%s`,
      {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
        maxBuffer: 16 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'ignore'],
      },
    ).trim();

    if (!raw) return [];

    return raw
      .split('\n')
      .map((line) => {
        const [hash, date, author, message] = line.split('\x1f');
        if (!hash || !date || !message) return null;
        return { hash, date, author, message: parseCommitMessage(message) };
      })
      .filter(Boolean) as Commit[];
  } catch {
    return [];
  }
}

export async function fetchRecentCommits(perPage = 5): Promise<Commit[]> {
  return getCommitsFromGit(perPage);
}

export function commitIcon(message: string): string {
  const normalized = message.toLowerCase().trim();
  if (normalized.startsWith('feat')) return '✨';
  if (normalized.startsWith('fix')) return '🐛';
  if (normalized.startsWith('docs')) return '📖';
  if (normalized.startsWith('style')) return '🎨';
  if (normalized.startsWith('refactor')) return '♻️';
  if (normalized.startsWith('chore')) return '🔧';
  if (normalized.startsWith('content')) return '📝';
  if (normalized.startsWith('merge')) return '🔀';
  return '📌';
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
