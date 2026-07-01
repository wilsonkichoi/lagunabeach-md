/**
 * archive.mjs — Store reader feedback + communication records in git repo (sovereignty layer, pure functions).
 *
 * Why: live feedback data lives in external BaaS (Supabase), but canonical records go into git
 * (per MANIFESTO: knowledge lives in git, not black boxes / distributed + unkillable). If BaaS dies,
 * all reports + maintainer communication remain in repo markdown, diffable + exportable + greppable.
 *
 * PII iron rule: only store display_name (nickname/fallback, = already public in issue), **never email**.
 *
 * Pure functions (no IO); triage.mjs handles file reads/writes.
 *   - archiveRelPath(row)              -> docs/feedback/archive/YYYY-MM/{id}.md
 *   - buildArchiveRecord(row, note)    -> initial markdown (frontmatter + content + empty communication log)
 *   - mergeComments(content, comments) -> append new issue comments into communication log (deduplicated)
 *
 * Warning: source_url / body / quote / correct_info are reader fields, may contain OAuth token / JWT
 *    (logged-in reader's URL bar with Supabase auth fragment). All pass through scrubSecrets()
 *    before entering git (same PII second gate as classify.mjs issue body). Triggered 2026-06-16.
 */

import { scrubSecrets } from './classify.mjs';

function fm(v) {
  if (v === null || v === undefined || v === '') return '';
  return String(v).replace(/\n/g, ' ').replace(/"/g, "'");
}

export function ym(createdAt) {
  const s = String(createdAt || '');
  const m = s.match(/^(\d{4})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}` : '0000-00';
}

export function archiveRelPath(row) {
  return `docs/feedback/archive/${ym(row.created_at)}/${row.id}.md`;
}

const COMMENTS_HEADING = '## Communication log';

export function buildArchiveRecord(row, note) {
  const who = row.display_name || 'Anonymous reader';
  const target =
    row.article_title || row.article_slug || row.page_kind || '(site)';
  const front = [
    '---',
    `feedback_id: '${fm(row.id)}'`,
    `created_at: '${fm(row.created_at)}'`,
    `contributor: "${fm(who)}"`,
    `type: '${fm(row.type)}'`,
    `status: '${fm(row.status || 'new')}'`,
    `page_kind: '${fm(row.page_kind)}'`,
    `article_slug: "${fm(row.article_slug)}"`,
    `lang: '${fm(row.lang)}'`,
    `source_url: "${fm(scrubSecrets(row.source_url))}"`,
    `issue_url: "${fm(row.issue_url)}"`,
    `issue_number: ${row.issue_number || 'null'}`,
    '---',
  ].join('\n');

  const parts = [front, '', `# Feedback — ${row.type} · ${target}`, ''];
  parts.push(`**Reporter**: ${who}`, `**Time**: ${row.created_at || ''}`, '');
  parts.push('**Report content**', scrubSecrets(row.body) || '', '');
  if (row.quote) {
    parts.push(
      '**Selected passage**',
      `> ${scrubSecrets(String(row.quote)).replace(/\n/g, '\n> ')}`,
      '',
    );
  }
  if (row.correct_info) {
    parts.push('**Correct info + source**', scrubSecrets(row.correct_info), '');
  }
  if (note || row.triage_note) {
    parts.push('**Auto-triage note**', note || row.triage_note, '');
  }
  if (row.issue_url) {
    parts.push(`**GitHub issue**: ${row.issue_url}`, '');
  }
  parts.push(COMMENTS_HEADING, '');
  parts.push('<!-- issue comments synced by feedback-triage -->', '');
  return parts.join('\n');
}

/**
 * Append new issue comments into communication log. comments: [{id, author, createdAt, body}].
 * Uses `<!-- comment:<id> -->` markers for deduplication; re-runs are idempotent.
 */
export function mergeComments(content, comments) {
  if (!comments || !comments.length) return content;
  const existing = new Set(
    [...content.matchAll(/<!-- comment:([^\s]+) -->/g)].map((m) => m[1]),
  );
  const fresh = comments.filter((c) => c && !existing.has(String(c.id)));
  if (!fresh.length) return content;

  const blocks = fresh
    .map((c) => {
      const when = (c.createdAt || '').slice(0, 16).replace('T', ' ');
      return `<!-- comment:${c.id} -->\n**${c.author || '?'}**${when ? ` · ${when}` : ''}\n\n${(c.body || '').trim()}\n`;
    })
    .join('\n');

  const idx = content.indexOf(COMMENTS_HEADING);
  if (idx === -1) {
    return `${content.trimEnd()}\n\n${COMMENTS_HEADING}\n\n${blocks}\n`;
  }
  // Append at end of heading block.
  return `${content.trimEnd()}\n\n${blocks}\n`;
}
