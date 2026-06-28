/**
 * liveStats.ts — module-level cache for prebuilt vitals reads.
 *
 * Build audit hotspot #5: SEO.astro had readFileSync(dashboard-vitals) in
 * component frontmatter → re-ran every page render = 8,400+ syscalls/build.
 * Hoisted to module scope, entire build process reads once.
 * (No top-level JSON import: file is gitignored, may not exist on fresh clone dev,
 * import would crash — lazy read + fallback preserves original error tolerance.)
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

let _cached: number | null = null;

export function getLiveArticleCount(fallback = 752): number {
  if (_cached !== null) return _cached;
  try {
    const vitalsPath = resolve(
      process.cwd(),
      'public/api/dashboard-vitals.json',
    );
    const v = JSON.parse(readFileSync(vitalsPath, 'utf-8'));
    _cached = typeof v.totalArticles === 'number' ? v.totalArticles : fallback;
  } catch {
    _cached = fallback;
  }
  return _cached;
}
