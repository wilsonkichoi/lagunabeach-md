/**
 * archive.test.mjs — git sovereignty layer record generator tests.
 * Run: node --test scripts/feedback/archive.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ym,
  archiveRelPath,
  buildArchiveRecord,
  mergeComments,
} from './lib/archive.mjs';

const row = {
  id: 'aaaa-bbbb',
  created_at: '2026-06-01T09:12:00Z',
  display_name: 'Coastal Reader',
  email: 'reader@example.com',
  type: 'content',
  status: 'filed',
  page_kind: 'article',
  article_slug: 'laguna-art-museum',
  article_title: 'Laguna Art Museum',
  lang: 'en',
  source_url:
    'https://lagunabeach.md/art-galleries/laguna-art-museum#:~:text=founded%20in%201929',
  quote: 'The museum was founded in 1929',
  correct_info: 'Correct: founded 1918. Source: https://lagunaartmuseum.org',
  triage_note:
    'Received your correction. Forwarded to maintainer for verification.',
  issue_url: 'https://github.com/wilsonkichoi/lagunabeach-md/issues/42',
  issue_number: 42,
};

test('ym extracts YYYY-MM', () => {
  assert.equal(ym('2026-06-01T09:12:00Z'), '2026-06');
  assert.equal(ym(''), '0000-00');
});

test('archiveRelPath: docs/feedback/archive/YYYY-MM/{id}.md', () => {
  assert.equal(
    archiveRelPath(row),
    'docs/feedback/archive/2026-06/aaaa-bbbb.md',
  );
});

test('buildArchiveRecord captures contributor/time/content + NEVER email', () => {
  const md = buildArchiveRecord(row, row.triage_note);
  assert.match(md, /contributor: "Coastal Reader"/);
  assert.match(md, /feedback_id: 'aaaa-bbbb'/);
  assert.match(md, /type: 'content'/);
  assert.match(md, /issue_number: 42/);
  assert.match(md, /Report content/);
  assert.match(md, /Selected passage/);
  assert.match(md, /The museum was founded in 1929/);
  assert.match(md, /Auto-triage note/);
  assert.match(md, /## Communication log/);
  assert.doesNotMatch(
    md,
    /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
    'email leaked',
  );
});

test('mergeComments appends new comments with markers', () => {
  const base = buildArchiveRecord(row, row.triage_note);
  const merged = mergeComments(base, [
    {
      id: 'maintainer-2026-06-01T10:00:00Z',
      author: 'maintainer',
      createdAt: '2026-06-01T10:00:00Z',
      body: 'Thanks for the report, fixed.',
    },
  ]);
  assert.match(merged, /<!-- comment:maintainer-2026-06-01T10:00:00Z -->/);
  assert.match(merged, /Thanks for the report, fixed\./);
});

test('mergeComments dedupes on re-run (idempotent)', () => {
  const base = buildArchiveRecord(row, row.triage_note);
  const c = [
    { id: 'x-1', author: 'm', createdAt: '2026-06-01T10:00:00Z', body: 'hi' },
  ];
  const once = mergeComments(base, c);
  const twice = mergeComments(once, c);
  assert.equal(once, twice, 're-merging same comment should be a no-op');
  assert.equal((twice.match(/<!-- comment:x-1 -->/g) || []).length, 1);
});

test('mergeComments no-op on empty', () => {
  const base = buildArchiveRecord(row, row.triage_note);
  assert.equal(mergeComments(base, []), base);
});
