#!/usr/bin/env node
// check-adopted-version-docs.mjs -- the adopted-version documentation gate.
//
// Three version values describe this instance's current state: the adopted
// framework release (FRAMEWORK-VERSION), the instance's own release (VERSION),
// and the pinned dev-plugin release (dev_plugin_release in
// .agent-toolkit/dev.md). Prose restates them, and prose does not move when the
// files do: two days after the Phase 5 close, docs/ROADMAP.md still told a
// reader that LB had adopted sekai-kb v1.0.6 while FRAMEWORK-VERSION read
// v1.0.10. Wrong version text is worse than absent version text, because it
// gets believed rather than looked up.
//
// This guard DERIVES each value from its source file and asserts that every
// registered statement carries exactly that value. Bumping a version therefore
// changes what this guard demands, with no second edit here: the registry holds
// anchors (prose), never versions.
//
// Historical references ("re-based onto sekai-kb-v1.0.0 in LB-33", "release
// v1.0.5") are NOT claims about current state and are deliberately out of
// scope. Only registered anchors are checked, which is what keeps the guard
// from failing on the project's own history.
//
// Failure modes, all exit 1:
//   - a registered statement carries a version that is not its source's value;
//   - a registered anchor is NOT FOUND (someone reworded, moved, or deleted the
//     statement). This is a FAILURE, never a silent pass: an unfindable
//     statement is exactly how a stale one hides. Re-point the registry entry
//     in the same commit that rewords the statement;
//   - a registered anchor matches more than once, which would make "the version
//     on that line" ambiguous;
//   - a source file is missing or unparseable, which would otherwise let the
//     derivation silently weaken into a vacuous pass.
//
// Instance-owned (.agent-toolkit/** carries merge=ours). An adopter that never
// took this file simply never runs it.
//
// Success prints one summary line and exits 0.
//
// Usage: node .agent-toolkit/scripts/check-adopted-version-docs.mjs

import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SEMVER = /v\d+\.\d+\.\d+/;

function read(relPath) {
  try {
    return readFileSync(join(ROOT, relPath), 'utf8');
  } catch (err) {
    fail(`cannot read ${relPath}: ${err.message}`);
  }
}

function fail(message) {
  console.error(`adopted-version docs: ${message}`);
  process.exit(1);
}

// --- Derivation: each value comes from its own source of truth ---------------

function versionFile(relPath) {
  const raw = read(relPath).trim();
  if (!/^v\d+\.\d+\.\d+$/.test(raw)) {
    fail(`${relPath} does not hold a v-prefixed semver (read "${raw}")`);
  }
  return raw;
}

function devPluginRelease() {
  const source = read('.agent-toolkit/dev.md');
  const match = source.match(/^dev_plugin_release:\s*(dev-v\d+\.\d+\.\d+)\s*$/m);
  if (!match) {
    fail('.agent-toolkit/dev.md frontmatter has no parseable dev_plugin_release');
  }
  return match[1];
}

const SOURCES = {
  framework: { value: versionFile('FRAMEWORK-VERSION'), from: 'FRAMEWORK-VERSION' },
  instance: { value: versionFile('VERSION'), from: 'VERSION' },
  devPlugin: { value: devPluginRelease(), from: '.agent-toolkit/dev.md dev_plugin_release' },
};

// --- Registry: prose anchors, never versions ---------------------------------
//
// `anchor` is the literal text that introduces the claim. The checked version
// is the first semver on the same line, at or after the anchor.

const REGISTRY = [
  { file: 'docs/ROADMAP.md', anchor: 'LB adopts sekai-kb', source: 'framework' },
  { file: 'docs/ROADMAP.md', anchor: 'its own release is', source: 'instance' },
  { file: 'docs/ROADMAP.md', anchor: 'its dev plugin is pinned at', source: 'devPlugin' },
];

// --- Assertion ---------------------------------------------------------------

let checked = 0;

for (const entry of REGISTRY) {
  const { value, from } = SOURCES[entry.source];
  const lines = read(entry.file).split('\n');
  const hits = lines.filter((line) => line.includes(entry.anchor));

  if (hits.length === 0) {
    fail(
      `${entry.file}: anchor not found: "${entry.anchor}". The statement was reworded, ` +
        'moved, or deleted. Re-point this registry entry in the same commit.',
    );
  }
  if (hits.length > 1) {
    fail(
      `${entry.file}: anchor "${entry.anchor}" matches ${hits.length} lines, so the ` +
        'version it refers to is ambiguous. Make the anchor unique.',
    );
  }

  const tail = hits[0].slice(hits[0].indexOf(entry.anchor));
  const found = tail.match(SEMVER);
  if (!found) {
    fail(`${entry.file}: no version follows the anchor "${entry.anchor}" on its line.`);
  }
  // dev_plugin_release carries a `dev-` prefix that the line repeats before the semver.
  const expected = value.startsWith('dev-') ? value.slice('dev-'.length) : value;
  if (found[0] !== expected) {
    fail(
      `${entry.file}: "${entry.anchor}" states ${found[0]}, but ${from} is ${value}. ` +
        'Update the prose, or the source, so they agree.',
    );
  }
  checked += 1;
}

console.log(
  `adopted-version docs OK: ${checked} statements match FRAMEWORK-VERSION ` +
    `${SOURCES.framework.value}, VERSION ${SOURCES.instance.value}, ` +
    `${SOURCES.devPlugin.value}.`,
);
