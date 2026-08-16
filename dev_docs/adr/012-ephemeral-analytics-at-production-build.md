# ADR 012: Fetch analytics ephemerally during the production build

**Date:** 2026-08-15
**Status:** Accepted

## Context

Phase 10 requires three analytics sources, GA4, Google Search Console, and Cloudflare
Analytics, to populate the deployed dashboard. The existing contract says the fetchers
write `src/data/analytics/*.json`, but `.gitignore` excludes `src/data/` and the Pages
workflow builds from a clean checkout. No deployed build can therefore see a local fetch.

ADR 005 assigned scheduled analytics refresh to a later data-only PR routine. Phase 11 is
now deferred indefinitely, and an ignored `src/data/` artifact cannot be carried by a PR in
any case. Phase 10 needs a complete delivery path of its own.

## Options

| Option | Pros | Cons | Cost |
|---|---|---|---|
| Fetch into ignored `src/data/analytics/` during the production Pages build | Preserves derived-data semantics; no analytics history or account identifiers enter git; a clean checkout can deploy current data; credential-absent builds remain supported | A deployed artifact is reproducible only with the external APIs and credentials available; analytics refreshes have workflow-run audit history rather than git history | One guarded build step, three normalized fetchers, and per-source dashboard degradation |
| Commit analytics snapshots through data-only PRs | Every deployed snapshot has git history and fits ADR 005's original routine wording | Requires a new instance-owned data namespace and retention/redaction contract; exposes raw history in the repository; contradicts the current ignored `src/data/` contract | New ownership surface, projection step, PR automation, and migration rules |

## Decision

Fetch analytics ephemerally during the production Pages build on a push to `main`.
`npm run fetch:analytics` writes versioned, normalized source files under
`src/data/analytics/`; those files remain ignored and are consumed only by the Astro build
running in the same job.

The fetch step runs only for a push to `main`, never for `pull_request`. It is opt-in through
the complete Actions credential set. With no credentials it reports a skip and the build
continues green. With an incomplete credential set or an API failure it reports a visible
failure, produces no malformed source file, and the build continues to the dashboard's
per-source unavailable state. An explicit local `npm run fetch:analytics` remains strict and
exits nonzero for missing credentials, invalid responses, or any source failure.

Browser collection is independently gated per provider. `features.analytics` must be true,
then `analytics.ga4MeasurementId` controls the Google tag and
`analytics.cloudflareWebAnalyticsToken` controls the Cloudflare beacon. A missing
`analytics` block, missing feature flag, or missing provider identifier injects no script for
that provider.

API credentials and account-scoped fetch identifiers remain environment-only. The generated
JSON contains normalized public metrics, period metadata, and source timestamps; it contains
no token, service-account field, GA4 property id, Search Console property URL, or Cloudflare
zone id.

## Consequences

- Phase 10 task 10.2 splits into 10.2a, the fetchers and normalized schemas, and 10.2b,
  production-build delivery plus dashboard panels. The original task crossed independent API,
  CI, and rendering failure domains and its estimate was not credible.
- A main-branch deployment remains available when analytics is unconfigured or an external
  provider is down. The dashboard names each unavailable source instead of hiding the entire
  dashboard or fabricating zeroes.
- Analytics data has no git retention. The workflow run and deployed artifact are the audit
  trail for a fetch against a particular main SHA.
- Deferred task 11.5 no longer opens a data-only PR. If Phase 11 is scheduled, it adds a
  scheduled rebuild/deploy of the current verified `main` SHA. This refreshes an external-data
  projection; it neither pushes nor merges source code.
- The archived fetchers are port sources, not contracts. Place-specific, multilingual, local
  virtualenv, cache-history, and hand-maintained-dashboard behavior is removed. Each current
  provider API is revalidated when implemented.
