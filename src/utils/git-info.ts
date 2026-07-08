import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import placeConfig from '../../place.config';

export interface GitInfo {
  contributors: string[];
  commitHash: string;
}

const categoryFolderMap: Record<string, string> = Object.fromEntries(
  placeConfig.categories.map((c) => [c.slug, c.title]),
);

export function getGitInfo(category: string, slug: string): GitInfo {
  const folder = categoryFolderMap[category];
  if (!folder) return { contributors: [], commitHash: '' };

  const filePath = resolve(process.cwd(), 'knowledge', folder, `${slug}.md`);

  try {
    const authors = execSync(
      `git log --format="%aN" -- "${filePath}"`,
      { encoding: 'utf-8', timeout: 5000 },
    )
      .trim()
      .split('\n')
      .filter(Boolean);

    const unique = [...new Set(authors)];

    const hash = execSync(
      `git log -1 --format="%H" -- "${filePath}"`,
      { encoding: 'utf-8', timeout: 5000 },
    ).trim();

    return { contributors: unique, commitHash: hash };
  } catch {
    return { contributors: [], commitHash: '' };
  }
}
