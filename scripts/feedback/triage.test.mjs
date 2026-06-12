/**
 * triage.test.mjs — classify.mjs 純函式測試。
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
  assert.equal(resolveType({ body: '日期有誤,應為 1993' }), 'content');
  assert.equal(resolveType({ body: '想看更多關於台灣茶的文章' }), 'newtopic');
  assert.equal(
    resolveType({ body: '無關鍵字', correct_info: '正確版本' }),
    'content',
  );
});

test('buildIssue maps content → fact-correction template + labels', () => {
  const iss = buildIssue(byId('1111'));
  assert.equal(iss.type, 'content');
  assert.match(iss.title, /^\[Fact Check\] 李安$/);
  assert.deepEqual(iss.labels, ['needs-verification', 'from-feedback']);
  assert.match(iss.body, /哪裡有誤/);
  assert.match(iss.body, /正確資訊/);
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
    // 沒有任何 email 形狀的字串混進 issue body
    assert.doesNotMatch(
      iss.body,
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,
      `email leaked in issue for ${row.id}`,
    );
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
    body: '希望每頁都能切深色模式',
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
    article_title: '李安',
    article_slug: '李安',
    page_kind: 'article',
    source_url: 'https://taiwan.md/people/李安#:~:text=1990',
    quote: '《臥虎藏龍》1990 年得獎',
    body: '年份錯了，應為 2001。',
  };
  const iss = buildIssue(row);
  assert.match(iss.body, /讀者選取的原文/);
  assert.match(iss.body, /《臥虎藏龍》1990 年得獎/);
  assert.match(iss.body, /直接定位/);
  assert.match(iss.body, /#:~:text=/);
  assert.doesNotMatch(iss.body, /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
});

test('provenance carries page_kind', () => {
  const iss = buildIssue({
    id: 'p1',
    type: 'bug',
    body: '這個數字怪怪的',
    page_kind: 'dashboard',
  });
  assert.match(iss.body, /來源頁:dashboard/);
});

// ── v3: reader-facing triage note (Grokipedia transparency) ──────────────────
test('triageNoteFor gives a type-specific reader note', () => {
  assert.match(triageNoteFor({ type: 'content', body: 'x' }), /勘誤/);
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
function clusterRows(n, slug = 'justfont與台灣字體發展') {
  return Array.from({ length: n }, (_, i) => ({
    id: `c${i}-uuid`,
    type: 'content',
    article_slug: slug,
    article_title: slug,
    display_name: '蘇煒翔',
    created_at: '2026-06-12T06:00:00Z',
    body: `第 ${i + 1} 段的事實有誤,正確版本是另一個說法 ${i}`,
    correct_info: `更正 ${i}`,
  }));
}

test(`batch-cluster: 同 slug ≥ ${BATCH_CLUSTER_THRESHOLD} 筆全 hold,0 筆 file`, () => {
  const rows = clusterRows(21);
  const results = triageBatch(rows, []);
  assert.equal(results.filter((r) => r.decision === 'hold').length, 21);
  assert.equal(results.filter((r) => r.decision === 'file').length, 0);
  assert.match(results[0].reason, /^batch-cluster:/);
  assert.equal(results[0].cluster, 'justfont與台灣字體發展'.toLowerCase());
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

test('batch-cluster: cluster 外的回報不受影響,照常 file', () => {
  const rows = [
    ...clusterRows(6),
    {
      id: 'solo-1',
      type: 'bug',
      article_slug: '李安',
      body: '這頁排版在手機上壞掉了',
    },
  ];
  const results = triageBatch(rows, []);
  const solo = results.find((r) => r.row.id === 'solo-1');
  assert.equal(solo.decision, 'file');
  assert.equal(results.filter((r) => r.decision === 'hold').length, 6);
});

test('batch-cluster: cluster 內的 spam 仍 reject,不算進 cluster 數', () => {
  const rows = [
    ...clusterRows(BATCH_CLUSTER_THRESHOLD - 1),
    {
      id: 'spam-1',
      article_slug: 'justfont與台灣字體發展',
      body: 'casino casino http://bit.ly/x crypto pump',
    },
  ];
  const results = triageBatch(rows, []);
  // spam 不計入 → 4 筆非 spam 低於閾值 → 照常 file
  assert.equal(results.filter((r) => r.decision === 'hold').length, 0);
  assert.equal(results.find((r) => r.row.id === 'spam-1').decision, 'reject');
});

test('batch-cluster: 無 slug 的回報不會被 cluster', () => {
  const rows = Array.from({ length: 8 }, (_, i) => ({
    id: `nos${i}`,
    type: 'idea',
    body: `想法 ${i}：完全不同的主題建議各自獨立 ${i}`,
  }));
  const results = triageBatch(rows, []);
  assert.equal(results.filter((r) => r.decision === 'hold').length, 0);
});
