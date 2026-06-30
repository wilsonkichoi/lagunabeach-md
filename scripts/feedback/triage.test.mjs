/**
 * triage.test.mjs — classify.mjs 純functiontest。
 * 跑：node --test scripts/feedback/triage.test.mjs
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
  assert.equal(resolveType({ body: '這裡連結壞掉了 404' }), 'bug');
  assert.equal(resolveType({ body: '日期有誤,should be 1993' }), 'content');
  assert.equal(
    resolveType({ body: '想看更多關於台灣茶的Articles' }),
    'newtopic',
  );
  assert.equal(
    resolveType({ body: '無關鍵characters', correct_info: 'correctversion' }),
    'content',
  );
});

test('buildIssue maps content → fact-correction template + labels', () => {
  const iss = buildIssue(byId('1111'));
  assert.equal(iss.type, 'content');
  assert.match(iss.title, /^\[Fact Check\] Ang Lee$/);
  assert.deepEqual(iss.labels, ['needs-verification', 'from-feedback']);
  assert.match(iss.body, /哪裡有誤/);
  assert.match(iss.body, /correct資訊/);
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
    // Noneany email 形狀的characters串混進 issue body
    assert.doesNotMatch(
      iss.body,
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
      `email leaked in issue for ${row.id}`,
    );
  }
});

// 2026-06-16 regression: feedback 8f2f8908 把 Supabase OAuth callback URL（含 access_token
// JWT[inside含 email] + provider_token + refresh_token）寫進 public issue #1160（已Delete）。
// source_url 是登入Reader的網址列 capture,implicit flow 把活Credentials塞進 hash fragment。
// 「不放 email」明文閘擋不住 base64 編進 token 的 email → 需 scrubSecrets 第二道閘。
test('scrubSecrets strips OAuth tokens / JWT / email from a Supabase auth callback URL', () => {
  // 完全合成值,不含any真實Credentials/email（Otherwise test 本身就是 PII 載體,= 它要防的 bug）。
  const toxic =
    'https://lagunabeach.md/people/#access_token=eyJSAMPLE.eyJzdWIiOiJ4In0.eyJzaWci&expires_at=9999999999&provider_token=ya29.FAKEPROVIDER&refresh_token=FAKEREFRESH123&token_type=bearer';
  const out = scrubSecrets(toxic);
  assert.equal(out, 'https://lagunabeach.md/people/');
  for (const leak of ['access_token', 'eyJ', 'ya29', 'FAKEREFRESH123']) {
    assert.ok(!out.includes(leak), `scrubSecrets leaked ${leak}`);
  }
  // 明文 email 也要 redact
  assert.match(scrubSecrets('mail reader@example.com'), /\[REDACTED-EMAIL\]/);
});

test('buildIssue scrubs a token-bearing source_url before it reaches issue body', () => {
  const iss = buildIssue({
    id: 'tok-1',
    type: 'bug',
    body: 'Ray 標示錯人了',
    display_name: 'tester',
    created_at: '2026-06-16T00:00:00Z',
    source_url:
      'https://lagunabeach.md/people/#access_token=eyJabc.eyJdef.sig&refresh_token=secret123&provider_token=ya29.LEAK',
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

test('blank display_name falls back to 匿名讀者 in provenance', () => {
  const iss = buildIssue(byId('2222')); // display_name === ''
  assert.match(iss.body, /回報者：匿名讀者/);
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
  assert.equal(resolveType({ type: 'idea', body: '想法' }), 'idea');
});

test('buildIssue maps idea → enhancement + [Idea] title', () => {
  const iss = buildIssue({
    id: 'i1',
    type: 'idea',
    body: '希望每頁都能切深色Mode',
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
    article_title: 'Ang Lee',
    article_slug: 'Ang Lee',
    page_kind: 'article',
    source_url: 'https://lagunabeach.md/people/Ang Lee#:~:text=1990',
    quote: '《臥虎藏龍》1990 年得獎',
    body: '年份錯了，should be 2001。',
  };
  const iss = buildIssue(row);
  assert.match(iss.body, /讀者選取的原文/);
  assert.match(iss.body, /《臥虎藏龍》1990 年得獎/);
  assert.match(iss.body, /directly定位/);
  assert.match(iss.body, /#:~:text=/);
  assert.doesNotMatch(iss.body, /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
});

test('provenance carries page_kind', () => {
  const iss = buildIssue({
    id: 'p1',
    type: 'bug',
    body: '這數characters怪怪的',
    page_kind: 'dashboard',
  });
  assert.match(iss.body, /來源頁:dashboard/);
});

// ── v3: reader-facing triage note (Grokipedia transparency) ──────────────────
test('triageNoteFor gives a type-specific reader note', () => {
  assert.match(triageNoteFor({ type: 'content', body: 'x' }), /errata/);
  assert.match(triageNoteFor({ type: 'newtopic', body: 'x' }), /新主題/);
});

test('triageBatch attaches note to file + reject decisions', () => {
  const results = triageBatch(seed, []);
  const filed = results.find((r) => r.decision === 'file');
  const rejected = results.find((r) => r.decision === 'reject');
  assert.ok(filed.note && filed.note.length > 0);
  assert.ok(rejected.note && rejected.note.length > 0);
});

// ── v4: batch-cluster guard（2026-06-09 12 連發 + 2026-06-12 justfont 21 連發）──
function clusterRows(n, slug = 'justfont與台灣characters體發展') {
  return Array.from({ length: n }, (_, i) => ({
    id: `c${i}-uuid`,
    type: 'content',
    article_slug: slug,
    article_title: slug,
    display_name: '蘇煒翔',
    created_at: '2026-06-12T06:00:00Z',
    body: `第 ${i + 1} 段的事實有誤,correctversion是另一說法 ${i}`,
    correct_info: `更正 ${i}`,
  }));
}

test(`batch-cluster: 同 slug ≥ ${BATCH_CLUSTER_THRESHOLD} 筆全 hold,0 筆 file`, () => {
  const rows = clusterRows(21);
  const results = triageBatch(rows, []);
  assert.equal(results.filter((r) => r.decision === 'hold').length, 21);
  assert.equal(results.filter((r) => r.decision === 'file').length, 0);
  assert.match(results[0].reason, /^batch-cluster:/);
  assert.equal(
    results[0].cluster,
    'justfont與台灣characters體發展'.toLowerCase(),
  );
});

test('batch-cluster: 低於閾值照常逐筆 file', () => {
  const rows = clusterRows(BATCH_CLUSTER_THRESHOLD - 1);
  const results = triageBatch(rows, []);
  assert.equal(results.filter((r) => r.decision === 'hold').length, 0);
  assert.equal(
    results.filter((r) => r.decision === 'file').length,
    BATCH_CLUSTER_THRESHOLD - 1,
  );
});

test('batch-cluster: cluster 外的Report不受impact,照常 file', () => {
  const rows = [
    ...clusterRows(6),
    {
      id: 'solo-1',
      type: 'bug',
      article_slug: 'Ang Lee',
      body: '這頁排版在手機上壞掉了',
    },
  ];
  const results = triageBatch(rows, []);
  const solo = results.find((r) => r.row.id === 'solo-1');
  assert.equal(solo.decision, 'file');
  assert.equal(results.filter((r) => r.decision === 'hold').length, 6);
});

test('batch-cluster: cluster inside的 spam 仍 reject,does not count進 cluster 數', () => {
  const rows = [
    ...clusterRows(BATCH_CLUSTER_THRESHOLD - 1),
    {
      id: 'spam-1',
      article_slug: 'justfont與台灣characters體發展',
      body: 'casino casino http://bit.ly/x crypto pump',
    },
  ];
  const results = triageBatch(rows, []);
  // spam 不計入 → 4 筆非 spam 低於閾值 → 照常 file
  assert.equal(results.filter((r) => r.decision === 'hold').length, 0);
  assert.equal(results.find((r) => r.row.id === 'spam-1').decision, 'reject');
});

test('batch-cluster: 無 slug 的Report不會被 cluster', () => {
  const rows = Array.from({ length: 8 }, (_, i) => ({
    id: `nos${i}`,
    type: 'idea',
    body: `想法 ${i}：完全different的主題suggestion各自獨立 ${i}`,
  }));
  const results = triageBatch(rows, []);
  assert.equal(results.filter((r) => r.decision === 'hold').length, 0);
});
