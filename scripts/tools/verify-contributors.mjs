#!/usr/bin/env node
/**
 * verify-contributors.mjs
 *
 * Build-time silent-breakage detector for contributor display layer.
 *
 * Aligns with #1047 / PR #1052 review observation:
 *   contributor display depends on two standard layers maintained in sync:
 *     .mailmap            — unifies multiple commit identity variants to canonical name
 *     .all-contributorsrc — canonical name → {login, name} lookup
 *
 *   Either missing -> silent break (URL broken / display uses fallback authorName).
 *
 * This script runs git log --use-mailmap to get all canonical authors, checks against
 * .all-contributorsrc via contributorKey lookup (same normalization logic as
 * src/utils/contributors.ts), lists missing/URL-unsafe cases as warnings.
 *
 * Discipline:
 *   - No auto-add (respects all-contributors bot workflow)
 *   - No build failure (exit 0) — warn-only, avoids blocking contributor onboarding
 *
 * Hooked into npm run prebuild (parallel with generate-contributors-data).
 *
 * DNA refs (per #1052 review):
 *   - REFLEXES #52 Immune fail-loud is more dangerous than missing immune
 *   - REFLEXES #43 derived data instrumented into lifecycle trigger points
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { spawnSync } from 'child_process';

// ── GitHub login spec (aligned with src/utils/contributors.ts) ─────────────────────
// alphanumeric + single hyphens, not start/end with hyphen, max 39 chars
const GITHUB_LOGIN_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

function contributorKey(value) {
  return value.toLowerCase().replace(/[\s._-]+/g, '');
}

function isUrlSafeLogin(s) {
  return GITHUB_LOGIN_REGEX.test(s);
}

// ── Load contributor profiles ────────────────────────────────────────────────
function loadProfiles() {
  const configPath = resolve(process.cwd(), '.all-contributorsrc');
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  const byKey = new Map();
  for (const c of config.contributors || []) {
    if (!c.login || !c.name) continue;
    // Same as src/utils/contributors.ts — set two keys
    byKey.set(contributorKey(c.name), c);
    byKey.set(contributorKey(c.login), c);
  }
  return byKey;
}

// ── Get all unique mailmap-aware authors ─────────────────────────────────────
function getCanonicalAuthors() {
  // %aN/%aE uses .mailmap (same as src/utils/contributors.ts per #1052)
  // spawnSync + array args avoids shell parsing (| is pipe in Windows cmd)
  const result = spawnSync('git', ['log', '--all', '--format=%aN|%aE'], {
    encoding: 'utf-8',
    maxBuffer: 50 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`git log exited ${result.status}: ${result.stderr}`);
  }
  const out = result.stdout;
  const seen = new Map();
  for (const line of out.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const sepIdx = trimmed.indexOf('|');
    if (sepIdx < 0) continue;
    const name = trimmed.slice(0, sepIdx);
    const email = trimmed.slice(sepIdx + 1);
    if (!name) continue;
    const key = `${name}|${email}`;
    if (!seen.has(key)) seen.set(key, { name, email });
  }
  return [...seen.values()];
}

// ── Main verification ────────────────────────────────────────────────────────
function main() {
  let profiles;
  try {
    profiles = loadProfiles();
  } catch (e) {
    console.warn(
      `⚠️  verify-contributors: cannot load .all-contributorsrc — ${e.message}`,
    );
    return 0;
  }

  let authors;
  try {
    authors = getCanonicalAuthors();
  } catch (e) {
    console.warn(`⚠️  verify-contributors: cannot read git log — ${e.message}`);
    return 0;
  }

  const missing = [];
  const unsafe = [];

  for (const { name, email } of authors) {
    // Skip GitHub noreply email (already covered by regex in contributors.ts)
    if (email && /@users\.noreply\.github\.com$/i.test(email)) continue;
    // Skip [bot] authors with GitHub-noreply (handled above) or bot suffix
    if (/\[bot\]$/i.test(name)) continue;

    const profile = profiles.get(contributorKey(name));
    if (!profile) {
      // canonical author has no entry in .all-contributorsrc
      missing.push({ name, email });
      continue;
    }

    if (!isUrlSafeLogin(profile.login)) {
      // profile.login itself is not URL-safe (extremely rare, safety check)
      unsafe.push({ name, login: profile.login });
    }
  }

  // ── Report ─────────────────────────────────────────────────────────────────
  if (missing.length === 0 && unsafe.length === 0) {
    console.log(
      '✅ verify-contributors: all canonical authors have valid .all-contributorsrc entries',
    );
    return 0;
  }

  console.warn('');
  console.warn(
    '⚠️  verify-contributors: found missing/unsafe contributor entries',
  );
  console.warn(
    '   (same contributorKey lookup as contributors.ts — missing entry uses fallback)',
  );

  if (missing.length > 0) {
    console.warn('');
    console.warn(`   Missing .all-contributorsrc entries (${missing.length}):`);
    for (const { name, email } of missing) {
      console.warn(`     "${name}" <${email}>`);
    }
    console.warn('');
    console.warn('   Suggested fix with all-contributors bot:');
    console.warn(
      '     @all-contributors please add @<github-login> for <contribution-type>',
    );
    console.warn(
      '   (contribution type: code / content / doc / translation / bug / review / ...)',
    );
  }

  if (unsafe.length > 0) {
    console.warn('');
    console.warn(`   URL-unsafe profile.login (${unsafe.length}):`);
    for (const { name, login } of unsafe) {
      console.warn(`     "${name}" → login "${login}"`);
    }
  }

  console.warn('');
  console.warn(
    '   (WARN-only — does not fail build. See docs/contributors-maintenance.md)',
  );
  console.warn('');
  return 0; // exit 0 — never fail build
}

process.exit(main());
