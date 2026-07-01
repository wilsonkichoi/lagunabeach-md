/**
 * triage.test.mjs — classify.mjs pure function tests.
 * Run: node --test scripts/feedback/triage.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  detectSpam,
  resolveType,
  buildIssue,
  dedupeKey,
  isDuplicate,
  triageBatch,
  triageNoteFor,
  scrubSecrets,
  BATCH_CLUSTER_THRESHOLD,
} from './lib/classify.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(readFileSync(join(here, 'seed-feedback.json'), 'utf8'));
const byId = (id) => seed.find((r) => r.id.startsWith(id));

test('detectSpam flags the obvious spam row', () => {
  const spam = byId('4444');
  const r = detectSpam(spam);
  assert.equal(r.isSpam, true);
  assert.ok(r.score >= 3);
});

test('detectSpam passes a genuine correction', () => {
  const ok = byId('1111');
  assert.equal(detectSpam(ok).isSpam, false);
});

test('resolveType trusts the reader-selected type', () => {
  assert.equal(resolveType(byId('1111')), 'content');
  assert.equal(resolveType(byId('2222')), 'bug');
  assert.equal(resolveType(byId('3333')), 'newtopic');
});

test('resolveType infers when type missing', () => {
  assert.equal(resolveType({ body: 'the link is broken 404' }), 'bug');
  assert.equal(
    resolveType({ body: 'the date is wrong, should be 1993' }),
    'content',
  );
  assert.equal(
    resolveType({ body: 'would love more about local trails' }),
    'newtopic',
  );
  assert.equal(
    resolveType({
      body: 'no keywords here',
      correct_info: 'the correct version',
    }),
    'content',
  );
});

test('buildIssue maps content → fact-correction template + labels', () => {
  const iss = buildIssue(byId('1111'));
  assert.equal(iss.type, 'content');
  assert.match(iss.title, /^\[Fact Check\] Laguna Art Museum$/);
  assert.deepEqual(iss.labels, ['needs-verification', 'from-feedback']);
  assert.match(iss.body, /What's wrong/);
  assert.match(iss.body, /Correct info/);
});

test('buildIssue maps bug → bug template + labels', () => {
  const iss = buildIssue(byId('2222'));
  assert.equal(iss.type, 'bug');
  assert.match(iss.title, /^\[Bug\] /);
  assert.deepEqual(iss.labels, ['bug', 'from-feedback']);
});

test('buildIssue maps newtopic → article template + labels', () => {
  const iss = buildIssue(byId('3333'));
  assert.equal(iss.type, 'newtopic');
  assert.match(iss.title, /^\[Article\] /);
  assert.deepEqual(iss.labels, ['content', 'from-feedback']);
});

test('issue body carries display_name + feedback id but NEVER email', () => {
  for (const row of seed) {
    const iss = buildIssue(row);
    assert.match(iss.body, /feedback id:/);
    assert.doesNotMatch(
      iss.body,
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
      `email leaked in issue for ${row.id}`,
    );
  }
});

// 2026-06-16 regression: feedback 8f2f8908 leaked OAuth callback URL into public issue #1160.
test('scrubSecrets strips OAuth tokens / JWT / email from a Supabase auth callback URL', () => {
  const toxic =
    'https://lagunabeach.md/about/#access_token=eyJSAMPLE.eyJzdWIiOiJ4In0.eyJzaWci&expires_at=9999999999&provider_token=ya29.FAKEPROVIDER&refresh_token=FAKEREFRESH123&token_type=bearer';
  const out = scrubSecrets(toxic);
  assert.equal(out, 'https://lagunabeach.md/about/');
  for (const leak of ['access_token', 'eyJ', 'ya29', 'FAKEREFRESH123']) {
    assert.ok(!out.includes(leak), `scrubSecrets leaked ${leak}`);
  }
  assert.match(scrubSecrets('mail reader@example.com'), /\[REDACTED-EMAIL\]/);
});

test('buildIssue scrubs a token-bearing source_url before it reaches issue body', () => {
  const iss = buildIssue({
    id: 'tok-1',
    type: 'bug',
    body: 'The map pin is in the wrong spot',
    display_name: 'tester',
    created_at: '2026-06-16T00:00:00Z',
    source_url:
      'https://lagunabeach.md/about/#access_token=eyJabc.eyJdef.sig&refresh_token=secret123&provider_token=ya29.LEAK',
  });
  for (const leak of [
    'access_token',
    'eyJabc',
    'refresh_token=secret123',
    'ya29.LEAK',
  ]) {
    assert.ok(!iss.body.includes(leak), `issue body leaked ${leak}`);
  }
});

test('blank display_name falls back to Anonymous reader in provenance', () => {
  const iss = buildIssue(byId('2222')); // display_name === ''
  assert.match(iss.body, /reporter: Anonymous reader/);
});

test('dedupeKey is stable for the same logical report', () => {
  assert.equal(dedupeKey(byId('1111')), dedupeKey(byId('5555')));
});

test('isDuplicate catches an already-filed feedback id', () => {
  const row = byId('1111');
  const built = buildIssue(row);
  assert.equal(
    isDuplicate(row, [{ title: built.title, body: built.body }]),
    true,
  );
  assert.equal(isDuplicate(row, [{ title: 'unrelated', body: 'nope' }]), false);
});

test('triageBatch: file genuine, reject spam, skip in-batch dup', () => {
  const results = triageBatch(seed, []);
  const decisions = Object.fromEntries(
    results.map((r) => [r.row.id.slice(0, 4), r.decision]),
  );
  assert.equal(decisions['1111'], 'file'); // genuine content
  assert.equal(decisions['2222'], 'file'); // genuine bug
  assert.equal(decisions['3333'], 'file'); // genuine newtopic
  assert.equal(decisions['4444'], 'reject'); // spam
  assert.equal(decisions['5555'], 'skip'); // duplicate of 1111 in same batch

  const filed = results.filter((r) => r.decision === 'file');
  assert.equal(filed.length, 3);
});

// ── v2: idea type + selected-quote annotation ────────────────────────────────
test('resolveType passes idea through', () => {
  assert.equal(resolveType({ type: 'idea', body: 'an idea' }), 'idea');
});

test('buildIssue maps idea → enhancement + [Idea] title', () => {
  const iss = buildIssue({
    id: 'i1',
    type: 'idea',
    body: 'Would love a dark mode toggle on every page',
    page_kind: 'home',
  });
  assert.equal(iss.type, 'idea');
  assert.match(iss.title, /^\[Idea\] /);
  assert.deepEqual(iss.labels, ['enhancement', 'from-feedback']);
});

test('content issue embeds selected quote + text-fragment deep link', () => {
  const row = {
    id: 'q1',
    type: 'content',
    article_title: 'Laguna Art Museum',
    article_slug: 'laguna-art-museum',
    page_kind: 'article',
    source_url:
      'https://lagunabeach.md/art-galleries/laguna-art-museum#:~:text=founded%20in%201929',
    quote: 'The museum was founded in 1929',
    body: 'The year is wrong, it should be 1918.',
  };
  const iss = buildIssue(row);
  assert.match(iss.body, /Selected passage/);
  assert.match(iss.body, /The museum was founded in 1929/);
  assert.match(iss.body, /Direct link/);
  assert.match(iss.body, /#:~:text=/);
  assert.doesNotMatch(iss.body, /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
});

test('provenance carries page_kind', () => {
  const iss = buildIssue({
    id: 'p1',
    type: 'bug',
    body: 'This number looks off',
    page_kind: 'dashboard',
  });
  assert.match(iss.body, /source page: dashboard/);
});

// ── v3: reader-facing triage note (transparency) ──────────────────
test('triageNoteFor gives a type-specific reader note', () => {
  assert.match(triageNoteFor({ type: 'content', body: 'x' }), /correction/);
  assert.match(triageNoteFor({ type: 'newtopic', body: 'x' }), /suggestion/);
});

test('triageBatch attaches note to file + reject decisions', () => {
  const results = triageBatch(seed, []);
  const filed = results.find((r) => r.decision === 'file');
  const rejected = results.find((r) => r.decision === 'reject');
  assert.ok(filed.note && filed.note.length > 0);
  assert.ok(rejected.note && rejected.note.length > 0);
});

// ── v4: batch-cluster guard (high-volume same-slug bursts) ──
function clusterRows(n, slug = 'founding-and-early-history') {
  return Array.from({ length: n }, (_, i) => ({
    id: `c${i}-uuid`,
    type: 'content',
    article_slug: slug,
    article_title: 'Founding and Early History',
    display_name: 'Local Historian',
    created_at: '2026-06-12T06:00:00Z',
    body: `Paragraph ${i + 1} has a factual error, the correct version is different ${i}`,
    correct_info: `Correction ${i}`,
  }));
}

test(`batch-cluster: same slug >= ${BATCH_CLUSTER_THRESHOLD} entries all hold, 0 file`, () => {
  const rows = clusterRows(21);
  const results = triageBatch(rows, []);
  assert.equal(results.filter((r) => r.decision === 'hold').length, 21);
  assert.equal(results.filter((r) => r.decision === 'file').length, 0);
  assert.match(results[0].reason, /^batch-cluster:/);
  assert.equal(results[0].cluster, 'founding-and-early-history');
});

test('batch-cluster: below threshold files normally', () => {
  const rows = clusterRows(BATCH_CLUSTER_THRESHOLD - 1);
  const results = triageBatch(rows, []);
  assert.equal(results.filter((r) => r.decision === 'hold').length, 0);
  assert.equal(
    results.filter((r) => r.decision === 'file').length,
    BATCH_CLUSTER_THRESHOLD - 1,
  );
});

test('batch-cluster: reports outside cluster are unaffected, file normally', () => {
  const rows = [
    ...clusterRows(6),
    {
      id: 'solo-1',
      type: 'bug',
      article_slug: 'laguna-art-museum',
      body: 'Layout is broken on mobile for this page',
    },
  ];
  const results = triageBatch(rows, []);
  const solo = results.find((r) => r.row.id === 'solo-1');
  assert.equal(solo.decision, 'file');
  assert.equal(results.filter((r) => r.decision === 'hold').length, 6);
});

test('batch-cluster: spam within cluster still rejected, not counted toward threshold', () => {
  const rows = [
    ...clusterRows(BATCH_CLUSTER_THRESHOLD - 1),
    {
      id: 'spam-1',
      article_slug: 'founding-and-early-history',
      body: 'casino casino http://bit.ly/x crypto pump',
    },
  ];
  const results = triageBatch(rows, []);
  assert.equal(results.filter((r) => r.decision === 'hold').length, 0);
  assert.equal(results.find((r) => r.row.id === 'spam-1').decision, 'reject');
});

test('batch-cluster: reports without slug are never clustered', () => {
  const rows = Array.from({ length: 8 }, (_, i) => ({
    id: `nos${i}`,
    type: 'idea',
    body: `Idea ${i}: a completely different topic suggestion ${i}`,
  }));
  const results = triageBatch(rows, []);
  assert.equal(results.filter((r) => r.decision === 'hold').length, 0);
});
