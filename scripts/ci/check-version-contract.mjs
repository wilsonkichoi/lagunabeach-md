#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';

const fail = (message) => {
  console.error(`version-contract FAILED: ${message}`);
  process.exit(1);
};

const readVersion = (path) => {
  if (!existsSync(path)) fail(`${path} is missing`);
  const value = readFileSync(path, 'utf8').trim();
  if (!/^v\d+\.\d+\.\d+$/.test(value)) {
    fail(`${path} must contain one v-prefixed semantic version, got ${JSON.stringify(value)}`);
  }
  return value;
};

const instanceVersion = readVersion('VERSION');
const frameworkVersion = readVersion('FRAMEWORK-VERSION');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));

if (pkg.private !== true) fail('package.json must set "private": true');
if (Object.hasOwn(pkg, 'version')) fail('package.json.version is forbidden; use VERSION');
if (Object.hasOwn(lock, 'version')) fail('package-lock.json root version is forbidden');
if (Object.hasOwn(lock.packages?.[''] ?? {}, 'version')) {
  fail('package-lock.json packages[""].version is forbidden');
}
if (lock.name !== pkg.name || lock.packages?.['']?.name !== pkg.name) {
  fail('package.json and package-lock.json root package names must match');
}

if (existsSync('.sekai-template') && process.env.GITHUB_REF_TYPE === 'tag') {
  const expectedTag = `sekai-kb-${frameworkVersion}`;
  if (process.env.GITHUB_REF_NAME !== expectedTag) {
    fail(`framework tag must match FRAMEWORK-VERSION: expected ${expectedTag}, got ${process.env.GITHUB_REF_NAME}`);
  }
}

console.log(
  `OK: VERSION ${instanceVersion}; FRAMEWORK-VERSION ${frameworkVersion}; private package ${pkg.name}`,
);
