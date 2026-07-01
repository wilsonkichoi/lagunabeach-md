#!/usr/bin/env python3
"""
register-ga4-custom-dimensions.py — GA4 event-param custom dimension SSOT (idempotent registration)

This is the single source of truth for all instrumentation event params that
need to be registered as GA4 event-scoped custom dimensions. Each time a new
gtag event param is instrumented, add it to the corresponding *_DIMENSIONS
list and re-run (idempotent; skips already-existing dimensions).

Permissions required:
  The service account must have **Editor** role on the GA4 property.
  If you get PermissionDenied: GA4 Admin > Account/Property access management > upgrade role.

Data retention:
  After registration, only NEW events carry these dimensions. Historical event
  params cannot be backfilled.

Usage:
    python3 scripts/tools/register-ga4-custom-dimensions.py [--dry-run]
"""
import argparse
import os
import sys
from pathlib import Path

CONFIG_DIR = Path.home() / ".config" / "lagunabeach-md"
CREDENTIALS_DIR = CONFIG_DIR / "credentials"
VENV_DIR = CONFIG_DIR / "venv"

if VENV_DIR.exists() and sys.prefix != str(VENV_DIR):
    venv_python = VENV_DIR / "bin" / "python3"
    if venv_python.exists() and __name__ == "__main__":
        os.execv(str(venv_python), [str(venv_python), __file__, *sys.argv[1:]])


# Search events (registered 2026-04-18)
SEARCH_DIMENSIONS = [
    ("search_term", "Search Term", "On-site search query string"),
    ("results_count", "Search Results Count", "Number of results returned"),
    ("search_lang", "Search Language", "Language interface of the search zh/en/ja/ko"),
    ("search_mode", "Search Mode", "Search mode instant / submit / etc"),
    ("click_title", "Clicked Result Title", "Article title clicked from search results"),
    ("click_url", "Clicked Result URL", "Article URL clicked from search results"),
    ("click_position", "Clicked Result Position", "Position of clicked result in list (1-based)"),
]

# Engagement events (2026-05-27 Wave 1+2+3 homepage; 2026-06-14 EventTracker
# refactored to generic cross-page events: scroll_depth / section_view /
# content_click / outbound_click / time_milestone, all carrying page_type).
# Param names match src/components/EventTracker.astro _fire() (SSOT alignment).
ENGAGEMENT_DIMENSIONS = [
    ("page_type", "Page Type", "Page type where event fires: home/article/category/latest... (2026-06-14 cross-page)"),
    ("section", "Engagement Section", "Landmark where section_view/content_click fires (related_articles/latest_rail/footnotes...)"),
    ("label", "Click Label", "content_click sub-item label (view_all_category/random_explore...)"),
    ("link_url", "Click URL", "Destination URL of content_click / outbound_click"),
    ("page_lang", "Page Language", "Language interface where event fires: zh-TW/en/ja/ko/es/fr"),
    ("seconds", "Time Milestone Seconds", "time_milestone stage 30/60/180/600"),
    ("elapsed_ms", "Elapsed MS", "Milliseconds from page load to section first entering viewport"),
    ("depth_pct", "Scroll Depth Percent", "scroll_depth stage 25/50/75/100 (replaces deprecated pct)"),
]

# Page-level events (404.astro page_404)
# GA4 display_name must start with a letter (cannot be "404 ...").
PAGE_DIMENSIONS = [
    ("failed_path", "Failed Path 404", "Non-existent path that triggered page_404"),
    ("failed_url", "Failed URL 404", "Full URL of page_404 (including query/hash)"),
    ("referrer", "Referrer 404", "Where the 404 was linked from (internal broken link vs external; direct = typed)"),
    ("had_suggestion", "Had Suggestion 404", "Whether smart-404 found a nearby article suggestion true/false"),
]

# Converter events (2026-06-13, terminology/converter.astro CONV-1)
# Param names match converter.astro track() (SSOT alignment).
# Feeds scripts/tools/converter-demand.py demand-loop queries.
CONVERTER_DIMENSIONS = [
    ("term_id", "Converter Term ID", "Term ID looked up by converter_term_lookup (= YAML id, demand-loop primary signal)"),
    ("direction", "Converter Direction", "converter_convert direction cn2tw / tw2cn"),
    ("category", "Converter Category", "term_lookup term category / example_click example category tech/life/..."),
    ("fork_type", "Converter Fork Type", "term_lookup term fork type A-F"),
    ("to", "Converter Toggle Target", "converter_direction_toggle target direction cn2tw/tw2cn"),
]

DIMENSIONS = (
    SEARCH_DIMENSIONS + ENGAGEMENT_DIMENSIONS + PAGE_DIMENSIONS + CONVERTER_DIMENSIONS
)

# Deprecated dimensions (archived, not deleted; GA4 archive is reversible).
# pct: mis-registered 2026-05-27. scroll_depth actually fires `depth_pct`;
# no gtag sends `pct`, so this dim is always (not set). Caught 2026-05-29.
DEPRECATED_DIMENSIONS = ["pct"]


def fail(msg):
    print(f"❌ {msg}", file=sys.stderr)
    sys.exit(1)


def load_property_id():
    env_path = CREDENTIALS_DIR / ".env"
    for line in env_path.read_text().splitlines():
        if line.startswith("GA4_PROPERTY_ID="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    fail("GA4_PROPERTY_ID not found")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    from google.analytics.admin_v1beta import AnalyticsAdminServiceClient
    from google.analytics.admin_v1beta.types import CustomDimension
    from google.oauth2 import service_account
    from google.api_core.exceptions import AlreadyExists, PermissionDenied

    sa_path = CREDENTIALS_DIR / "google-service-account.json"
    creds = service_account.Credentials.from_service_account_file(
        str(sa_path),
        scopes=["https://www.googleapis.com/auth/analytics.edit"],
    )
    client = AnalyticsAdminServiceClient(credentials=creds)
    property_id = load_property_id()
    parent = f"properties/{property_id}"

    print(f"📝 Registering {len(DIMENSIONS)} custom dimensions on {parent}")
    if args.dry_run:
        for p, name, desc in DIMENSIONS:
            print(f"  [dry-run] register {p} → {name}")
        for p in DEPRECATED_DIMENSIONS:
            print(f"  [dry-run] archive {p}")
        return

    # List existing (keep full objects so we can resolve names for archive)
    try:
        existing_objs = list(client.list_custom_dimensions(parent=parent))
    except PermissionDenied as e:
        fail(
            f"PermissionDenied: service account lacks Editor role\n"
            f"→ GA4 Admin → Property access management → upgrade to Editor\n"
            f"Details: {e}"
        )
    existing = {cd.parameter_name for cd in existing_objs}
    by_param = {cd.parameter_name: cd for cd in existing_objs}

    created, skipped = 0, 0
    for param_name, display_name, description in DIMENSIONS:
        if param_name in existing:
            print(f"  ⏭  {param_name} already exists")
            skipped += 1
            continue
        cd = CustomDimension(
            parameter_name=param_name,
            display_name=display_name,
            description=description,
            scope=CustomDimension.DimensionScope.EVENT,
        )
        try:
            result = client.create_custom_dimension(parent=parent, custom_dimension=cd)
            print(f"  ✅ {param_name} → {result.name}")
            created += 1
        except AlreadyExists:
            print(f"  ⏭  {param_name} (AlreadyExists race)")
            skipped += 1

    # Archive deprecated dims (reversible — GA4 archive can be undone by recreate)
    archived = 0
    for param_name in DEPRECATED_DIMENSIONS:
        cd = by_param.get(param_name)
        if not cd:
            print(f"  ⏭  {param_name} not present (already archived?)")
            continue
        try:
            client.archive_custom_dimension(name=cd.name)
            print(f"  🗄  archived {param_name} ({cd.name})")
            archived += 1
        except Exception as e:  # noqa: BLE001 — log + continue, archive is non-critical path
            print(f"  ⚠️  archive {param_name} failed: {type(e).__name__}: {e}")

    print(f"\n✅ Done: {created} created, {skipped} skipped, {archived} archived")
    print("\n⏱  Data availability: new events will carry these dimensions; historical data cannot be backfilled.")
    print("   Sanity query: scripts/tools/fetch-ga4.py")


if __name__ == "__main__":
    main()
