#!/usr/bin/env bash
#
# check-instance-owned-docs.sh — instance guard (LB-62).
#
# Proves, by simulating a framework tag merge in a disposable git repository,
# that this instance's planning documents survive a framework upgrade
# byte-for-byte. It does not assert that `.gitattributes` contains four lines;
# it exercises the behaviour those lines are supposed to buy, which is the only
# thing that actually matters at upgrade time.
#
# Why this exists: sekai-kb carries the framework's own PRD, SPEC, ROADMAP, and
# ADRs at the SAME paths this instance uses for its own (ADR 008, upstream).
# Without `merge=ours` on those paths, the first framework tag merge replaces
# LB's planning documents with the framework's. `/sekai-upgrade`'s maintainer-doc
# reconcile pass detects the omission and stops the upgrade, but it never
# repairs it — the attribute is what makes the merge keep our text.
#
# The two inputs are DERIVED, never restated here:
#
#   1. the path set  — from the framework wizard's exported MAINTAINER_DOCS, via
#      `scripts/upgrade/maintainer-docs-state.mjs paths`. The same single source
#      the init strip, the framework-docs gate, and the upgrade reconcile use, so
#      a path added upstream is covered here on the next upgrade with no edit.
#   2. the protection — from this repository's real `.gitattributes`, copied into
#      the fixture verbatim. Delete `docs/SPEC.md merge=ours` and this guard goes
#      red, which is the drift it exists to catch.
#
# Because the two come from different files, the assertion is not tautological:
# it fails when the wizard's list and this instance's attributes disagree.
#
# Usage:
#   bash .agent-toolkit/scripts/check-instance-owned-docs.sh
#   bash .agent-toolkit/scripts/check-instance-owned-docs.sh --selftest
#
# `--selftest` proves the assertion is capable of failing: it reruns the same
# fixture with the `merge=ours` lines stripped and REQUIRES the merge to clobber
# the instance's documents. An assertion that cannot fail is not evidence.
#
# Portability: macOS bash 3.2 and CI bash 5 (no mapfile/readarray, no
# associative arrays, `unset CDPATH` before `cd` in a command substitution) —
# .agent-toolkit/rules/shell-script-portability.md.

set -eu

unset CDPATH
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." >/dev/null 2>&1 && pwd)"

SELFTEST=0
if [ "${1:-}" = "--selftest" ]; then
  SELFTEST=1
elif [ $# -gt 0 ]; then
  echo "usage: $0 [--selftest]" >&2
  exit 2
fi

fail() {
  echo "❌ instance-owned docs check FAILED: $1" >&2
  exit 1
}

ok() { echo "✓ $1"; }

MDOCS_HELPER="$ROOT/scripts/upgrade/maintainer-docs-state.mjs"
[ -f "$MDOCS_HELPER" ] || fail "framework helper not found at scripts/upgrade/maintainer-docs-state.mjs.
  It ships from sekai-kb v1.0.13 onward and is where the maintainer-doc path set is derived.
  remedy: adopt a framework release that carries it, or re-point this derivation."

GITATTRIBUTES="$ROOT/.gitattributes"
[ -f "$GITATTRIBUTES" ] || fail ".gitattributes is missing; there is no instance-owned list to verify."

# Path set, derived from the framework wizard (never restated here). bash 3.2 has
# no mapfile, so the list is carried as newline-separated text.
MAINTAINER_DOCS="$(node "$MDOCS_HELPER" paths --repo "$ROOT")" ||
  fail "could not derive the maintainer-doc path set from the framework wizard"
[ -n "$MAINTAINER_DOCS" ] || fail "the derived maintainer-doc path set is empty; it must name at least one path"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

INSTANCE_MARK="instance copy — written by lagunabeach-md, must survive the upgrade"
FRAMEWORK_MARK="framework copy — must NOT reach the instance"

# A maintainer-doc entry may be a file (docs/SPEC.md) or a directory (docs/adr).
# Resolve each to a concrete file path to write and compare.
doc_fixture_file() {
  case "$1" in
    *.md) echo "$1" ;;
    *) echo "$1/001-instance-decision.md" ;;
  esac
}

# Build one disposable instance+framework pair and merge the framework tag in.
#   $1 = fixture dir, $2 = "protected" | "unprotected"
# Prints nothing; leaves the merged instance repo at $1/instance.
build_and_merge() {
  local dir="$1" mode="$2" doc file
  mkdir -p "$dir/framework" "$dir/instance"

  # --- framework side: the tag an instance merges -------------------------
  (
    cd "$dir/framework"
    git init -q .
    git config user.email fixture@example.invalid
    git config user.name Fixture
    git config commit.gpgsign false
    echo "framework-owned code, unrelated to the documents under test" > src-marker.txt
    for doc in $MAINTAINER_DOCS; do
      file="$(doc_fixture_file "$doc")"
      mkdir -p "$(dirname "$file")"
      printf '%s\n' "$FRAMEWORK_MARK" > "$file"
    done
    git add -A
    git commit -q -m "framework release"
    git tag fixture-framework-v1
  )

  # --- instance side: this repository's attributes, its own documents ------
  (
    cd "$dir/instance"
    git init -q .
    git config user.email fixture@example.invalid
    git config user.name Fixture
    git config commit.gpgsign false
    # The `ours` driver is per-clone and not version-controlled; /sekai-upgrade
    # and the runbook set it, so the fixture models a correctly configured clone.
    git config merge.ours.driver true

    # The instance-owned list under test comes from the REAL .gitattributes.
    if [ "$mode" = "protected" ]; then
      cp "$GITATTRIBUTES" .gitattributes
    else
      # Non-vacuity control: same fixture, protection removed.
      grep -v 'merge=ours' "$GITATTRIBUTES" > .gitattributes || true
    fi

    echo "instance content, unrelated to the documents under test" > knowledge-marker.txt
    for doc in $MAINTAINER_DOCS; do
      file="$(doc_fixture_file "$doc")"
      mkdir -p "$(dirname "$file")"
      printf '%s\n' "$INSTANCE_MARK" > "$file"
    done
    git add -A
    git commit -q -m "instance documents"

    git remote add framework "$dir/framework"
    git fetch -q framework --tags
    # Unrelated histories: the shape of an instance's first merge, and the
    # harder case for merge=ours. A conflicting merge is a legitimate outcome
    # for the unprotected control, so failure here is not fatal.
    git merge --allow-unrelated-histories --no-edit fixture-framework-v1 >/dev/null 2>&1 || true
  )
}

# Unmerged paths that fall under a maintainer-doc path. Only those are under test:
# a framework-owned file conflicting is a normal upgrade event the human resolves,
# whereas one of THESE conflicting means the attribute did not apply.
doc_conflicts() {
  local conflicted doc
  ( cd "$1" && git diff --name-only --diff-filter=U ) | while IFS= read -r conflicted; do
    for doc in $MAINTAINER_DOCS; do
      case "$conflicted" in
        "$doc" | "$doc"/*) echo "$conflicted" ;;
      esac
    done
  done
}

# Assert every derived maintainer-doc path still holds the instance's bytes.
#   $1 = instance dir, $2 = label. Returns 1 on the first clobbered path.
assert_instance_bytes_survived() {
  local dir="$1" doc file
  for doc in $MAINTAINER_DOCS; do
    file="$(doc_fixture_file "$doc")"
    if [ ! -f "$dir/$file" ]; then
      echo "    $file: MISSING after the merge" >&2
      return 1
    fi
    if [ "$(cat "$dir/$file")" != "$INSTANCE_MARK" ]; then
      echo "    $file: instance content was overwritten by the framework's copy" >&2
      return 1
    fi
  done
  return 0
}

# ---------------------------------------------------------------------------
# Case 1 — the real contract: protected paths survive a framework tag merge.
# ---------------------------------------------------------------------------

build_and_merge "$TMP/protected" protected

DOC_CONFLICTS="$(doc_conflicts "$TMP/protected/instance")"
if [ -n "$DOC_CONFLICTS" ]; then
  fail "the framework merge left conflicts in the protected paths:
$(echo "$DOC_CONFLICTS" | sed 's/^/    /')
  merge=ours should resolve these without a conflict. Check that every maintainer-doc
  path in .gitattributes is spelled the way git matches it (a directory needs /**)."
fi

if ! assert_instance_bytes_survived "$TMP/protected/instance"; then
  fail "a framework tag merge overwrote this instance's planning documents.
  Every path below must carry \`merge=ours\` in .gitattributes:
$(echo "$MAINTAINER_DOCS" | sed 's/^/    /')
  A directory entry needs the \`/**\` form (\`docs/adr/** merge=ours\`)."
fi

echo "$MAINTAINER_DOCS" | while IFS= read -r doc; do
  [ -n "$doc" ] && ok "survives a framework tag merge byte-for-byte: $doc"
done

# ---------------------------------------------------------------------------
# Case 2 (--selftest) — non-vacuity: without the attributes, the same assertion
# must FAIL. Otherwise case 1 proves nothing about merge=ours.
# ---------------------------------------------------------------------------

if [ "$SELFTEST" = "1" ]; then
  build_and_merge "$TMP/unprotected" unprotected
  if assert_instance_bytes_survived "$TMP/unprotected/instance" 2>/dev/null; then
    fail "self-test vacuous: with every \`merge=ours\` line removed, the instance's
  documents STILL survived the merge. The assertion in case 1 is therefore not
  evidence that the attributes are doing anything. Fix this harness before trusting it."
  fi
  ok "self-test: without merge=ours the same assertion fails (case 1 is non-vacuous)"
fi

echo "✅ instance-owned docs check passed — $(echo "$MAINTAINER_DOCS" | grep -c .) maintainer-doc path(s) protected against framework tag merges"
