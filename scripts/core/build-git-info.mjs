#!/usr/bin/env node
/**
 * Prebuild: src/data/git-info.json
 * Per-article git provenance (contributors / lastModified / commitHash /
 * revisionCount), computed ONCE in prebuild so the astro render stage has
 * ZERO git dependency.
 *
 * WHY (2026-06-13 EVO-A4 — reports/git-info-prebuild-2026-06-13.md):
 *   article.template.astro + 6 [slug] wrappers each called buildGitInfoCache()
 *   which shelled out to `git log --full-history`. The 2026-06-13 refactor
 *   session fixed the per-render-scope catastrophe (4,697 → 6 passes via a
 *   module-level memo), but 6 git subprocesses still ran INSIDE astro build —
 *   meaning the render stage depended on a full git history. This script is
 *   the structural endgame of that lesson: move the git pass entirely into
 *   prebuild (ONE pass over knowledge/ covers all 6 languages), emit a JSON
 *   the template imports like content-dates.json. Render stage becomes pure.
 *
 *   Knock-on wins: (a) astro stage drops its last execSync; (b) CI can later
 *   shallow-clone (the committed JSON survives a depth-1 checkout, the live
 *   git log would not); (c) removes one of the knowledge/ direct-read sources
 *   that make babel's parallel writes a read-tear risk (DUAL-1 in the
 *   architecture audit).
 *
 * CONSUMED BY:
 *   - src/utils/contributors.ts → buildGitInfoCache() now reads this JSON
 *     instead of shelling out. Same Map<absPath, GitInfo> interface, so the
 *     template + wrappers are untouched.
 *
 * INVARIANT (parity-critical): the contributor de-dup order, lastModified =
 *   newest commit date, and revisionCount semantics MUST byte-match the old
 *   in-astro buildGitInfoCache, or 4,758 article sidebars change. The git log
 *   ordering (newest-first) + push-on-first-sighting logic below is copied
 *   verbatim from the previous contributors.ts implementation.
 *
 * mailmap: uses %aN/%aE (mailmap-aware) so .mailmap consolidates author
 *   variants — identical to the old code.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const ROOT = process.cwd();
const OUT = resolve(ROOT, 'src/data/git-info.json');

// ── Contributor profile resolution (moved here from contributors.ts — this is
// build-time-only logic, prebuild is its correct home; zero other consumers) ──

let contributorProfiles = null;

function contributorKey(value) {
  return value.toLowerCase().replace(/[\s._-]+/g, '');
}

function getContributorProfiles() {
  if (contributorProfiles) return contributorProfiles;
  contributorProfiles = new Map();
  try {
    const config = JSON.parse(
      readFileSync(resolve(ROOT, '.all-contributorsrc'), 'utf-8'),
    );
    for (const contributor of config.contributors || []) {
      if (!contributor.login || !contributor.name) continue;
      const profile = { name: contributor.name, login: contributor.login };
      contributorProfiles.set(contributorKey(contributor.name), profile);
      contributorProfiles.set(contributorKey(contributor.login), profile);
    }
  } catch (e) {
    console.error('[git-info] contributor profile error:', e.message);
  }
  return contributorProfiles;
}

function resolveContributor(authorName, authorEmail) {
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

// ── ONE git pass over knowledge/ (covers all 6 languages) ────────────────────

function main() {
  let log = '';
  try {
    log = execSync(
      'git log --full-history -z --name-only --format="COMMIT|%H|%aI|%aN|%aE" -- knowledge/',
      { encoding: 'utf-8', maxBuffer: 256 * 1024 * 1024 },
    );
  } catch (e) {
    console.error('[git-info] git log failed:', e.message);
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(
      OUT,
      JSON.stringify({ _generated: null, count: 0, files: {} }),
    );
    return;
  }

  // files: relPath(NFC) -> { contributors:[{name,login}], lastModified, commitHash, revisionCount }
  const files = {};
  let currentHash = '';
  let currentDate = '';
  let currentContributor = null;

  for (let token of log.split('\0')) {
    token = token.replace(/^\n+/, '').trim();
    if (!token) continue;

    if (token.startsWith('COMMIT|')) {
      const parts = token.split('|');
      currentHash = parts[1] || '';
      currentDate = parts[2] || '';
      currentContributor = resolveContributor(parts[3] || '', parts[4] || '');
    } else if (token.startsWith('knowledge/') && token.endsWith('.md')) {
      // key = repo-relative NFC path (machine-independent, git-trackable;
      // contributors.ts re-derives abs path with resolve(cwd, key))
      const key = token.normalize('NFC');
      let entry = files[key];
      if (!entry) {
        // first sighting = newest commit (log is newest-first)
        entry = {
          contributors: [],
          lastModified: currentDate,
          commitHash: currentHash,
          revisionCount: 0,
        };
        files[key] = entry;
      }
      entry.revisionCount += 1;
      if (
        currentContributor &&
        !entry.contributors.some((c) => c.login === currentContributor.login)
      ) {
        entry.contributors.push(currentContributor);
      }
    }
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    JSON.stringify({
      _generated: new Date().toISOString(),
      count: Object.keys(files).length,
      files,
    }),
  );
  console.log(
    `[git-info] ${Object.keys(files).length} article files → src/data/git-info.json (1 git pass, was 6 in-astro)`,
  );
}

main();
