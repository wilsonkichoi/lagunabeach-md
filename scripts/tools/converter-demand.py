#!/usr/bin/env python3
"""
converter-demand.py — Terminology converter "demand feedback loop": read which terms
people actually look up via GA4 events

Flips term growth from "author guesses" to "demand-driven". The 5 events from
converter.astro (converter_term_lookup / converter_convert /
converter_example_click / converter_copy / converter_direction_toggle) feed in
and answer four questions:

  1. Term demand ranking (PRIMARY): which term_ids are looked up most. Filter
     eventName == converter_term_lookup, group by customEvent:term_id.
  2. Direction usage: cn2tw vs tw2cn -- is anyone using the reverse direction?
  3. Example category popularity: converter_example_click by customEvent:category.
  4. Funnel: converter_convert / converter_copy event counts (rough convert-to-copy ratio).

===============================================================================
KNOWN LIMITATION (do not over-trust this data)
===============================================================================
converter_term_lookup only fires when a "matched rule" (term already in the
database) is hit. So this ranking measures demand distribution among the
existing ~1,800 terms -- it CANNOT see "missing terms" (input the user typed
that we haven't added to the mapping table yet).

In other words: this tool tells you "which existing terms deserve the most
attention", but does NOT tell you "which terms to add". Detecting missing
terms requires a different future signal, e.g.:
  - Track inputs where post-conversion localization score remains low
  - Add a "report missing term" button in the frontend

Until that signal exists, this ranking mirrors "known demand", not "unknown demand".

===============================================================================
GA4 custom-dimension reality (graceful degradation)
===============================================================================
Event params (term_id / direction / category / fork_type ...) must first be
registered as event-scoped custom dimensions via Admin API before the Data API
can group by them. Data API reference: customEvent:term_id, etc.

Registration script: scripts/tools/register-ga4-custom-dimensions.py

This tool handles two "not ready yet" situations without crashing:
  (a) Dimension not registered -> GA4 returns dimension-not-found error ->
      CATCH + print hint "run register script"; that report stays empty, others proceed.
  (b) Events just shipped, no data accumulated -> report empty -> prints
      friendly "instrumentation just shipped" message.

Usage:
    python3 scripts/tools/converter-demand.py                 # 90d + 28d
    python3 scripts/tools/converter-demand.py --json          # raw JSON output
    python3 scripts/tools/converter-demand.py --windows 90,28 # custom windows (default 90,28)
    python3 scripts/tools/converter-demand.py --limit 50      # top term count (default 50)

Output:
    Human-readable section report (same style as converter-analytics.py)
    raw JSON -> ~/.config/lagunabeach-md/cache/converter-demand-latest.json

Credentials / venv same as fetch-ga4.py (~/.config/lagunabeach-md/credentials/).
"""
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

CONFIG_DIR = Path.home() / ".config" / "lagunabeach-md"
CREDENTIALS_DIR = CONFIG_DIR / "credentials"
CACHE_DIR = CONFIG_DIR / "cache"
VENV_DIR = CONFIG_DIR / "venv"
ENV_FILE = CREDENTIALS_DIR / ".env"
SERVICE_ACCOUNT_FILE = CREDENTIALS_DIR / "google-service-account.json"
REGISTER_SCRIPT = "scripts/tools/register-ga4-custom-dimensions.py"

# Converter events emitted by src/pages/terminology/converter.astro.
EVT_LOOKUP = "converter_term_lookup"
EVT_CONVERT = "converter_convert"
EVT_EXAMPLE = "converter_example_click"
EVT_COPY = "converter_copy"
EVT_TOGGLE = "converter_direction_toggle"
ALL_EVENTS = [EVT_LOOKUP, EVT_CONVERT, EVT_EXAMPLE, EVT_COPY, EVT_TOGGLE]


def load_env():
    env = dict(os.environ)
    if ENV_FILE.exists():
        for line in ENV_FILE.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                k, _, v = line.partition("=")
                env[k.strip()] = v.strip().strip("'\"")
    return env


def reexec_in_venv():
    venv_python = VENV_DIR / "bin" / "python3"
    if not venv_python.exists():
        return
    in_venv = sys.prefix != sys.base_prefix
    if in_venv and Path(sys.prefix).resolve() == VENV_DIR.resolve():
        return
    os.execv(str(venv_python), [str(venv_python), *sys.argv])


def daterange(days):
    end = datetime.now()
    start = end - timedelta(days=days)
    return start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")


# ─────────────────────────────────────────────────────────────────────────
# Custom-dimension graceful degradation: see module docstring for rationale.
# ─────────────────────────────────────────────────────────────────────────
def _is_unregistered_dimension_error(exc):
    """Heuristic: did GA4 reject the request because a customEvent dimension
    isn't a registered event-scoped custom dimension yet?

    The Data API returns an INVALID_ARGUMENT whose message mentions the field
    is not a valid dimension / not compatible. We match loosely so a wording
    change on Google's side still degrades gracefully rather than crashing."""
    msg = str(exc).lower()
    needles = [
        "did not match",
        "not a valid",
        "is not a valid dimension",
        "incompatib",          # "are incompatible"
        "not compatible",
        "customevent",
        "field",
    ]
    return any(n in msg for n in needles)


class _Ctx:
    """Per-report helpers bound to one window: builds requests + runs them
    with custom-dimension-aware error handling. Each report writes a
    structured result dict so the caller can render hint / empty / data."""

    def __init__(self, client, prop, date_range, types):
        self.client = client
        self.prop = prop
        self.dr = date_range
        self.t = types  # the imported types module-ish namespace (a dict)

    def _event_filter(self, event_name):
        T = self.t
        return T["FilterExpression"](
            filter=T["Filter"](
                field_name="eventName",
                string_filter=T["Filter"].StringFilter(
                    match_type=T["Filter"].StringFilter.MatchType.EXACT,
                    value=event_name,
                ),
            )
        )

    def run_dimensioned(self, event_name, custom_dim, value_label):
        """One event filtered, grouped by a customEvent:<param> dimension,
        ordered by eventCount desc. Returns a structured status dict:
          {status: data|hint|empty|error, rows|message, dimension}
        """
        T = self.t
        try:
            req = T["RunReportRequest"](
                property=self.prop,
                date_ranges=[self.dr],
                dimensions=[T["Dimension"](name=custom_dim)],
                metrics=[T["Metric"](name="eventCount")],
                dimension_filter=self._event_filter(event_name),
                order_bys=[
                    T["OrderBy"](
                        metric=T["OrderBy"].MetricOrderBy(metric_name="eventCount"),
                        desc=True,
                    )
                ],
                limit=10000,
            )
            resp = self.client.run_report(req)
        except Exception as e:  # noqa: BLE001 — degrade, never crash
            if _is_unregistered_dimension_error(e):
                return {
                    "status": "hint",
                    "dimension": custom_dim,
                    "message": (
                        f"⚠️  custom dimension {custom_dim} not registered yet — "
                        f"add it to {REGISTER_SCRIPT} (CONVERTER_DIMENSIONS), run it, "
                        f"then wait for events to accumulate"
                    ),
                }
            return {"status": "error", "dimension": custom_dim, "message": f"{type(e).__name__}: {e}"}

        rows = [
            {value_label: (r.dimension_values[0].value or "(not set)"),
             "count": int(r.metric_values[0].value)}
            for r in resp.rows
        ]
        if not rows:
            return {"status": "empty", "dimension": custom_dim, "rows": []}
        return {"status": "data", "dimension": custom_dim, "rows": rows}

    def event_count(self, event_name):
        """Total eventCount for one event (no dimension). Returns int or None
        on error. Empty (event never fired) reads as 0, not error."""
        T = self.t
        try:
            req = T["RunReportRequest"](
                property=self.prop,
                date_ranges=[self.dr],
                metrics=[T["Metric"](name="eventCount")],
                dimension_filter=self._event_filter(event_name),
            )
            resp = self.client.run_report(req)
        except Exception:  # noqa: BLE001
            return None
        if not resp.rows:
            return 0
        return int(resp.rows[0].metric_values[0].value)


def fetch_window(property_id, cred_path, days, limit):
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        DateRange, Dimension, Filter, FilterExpression, Metric,
        RunReportRequest, OrderBy,
    )
    from google.oauth2 import service_account

    creds = service_account.Credentials.from_service_account_file(str(cred_path))
    client = BetaAnalyticsDataClient(credentials=creds)
    start, end = daterange(days)
    dr = DateRange(start_date=start, end_date=end)
    prop = f"properties/{property_id}"

    types = {
        "DateRange": DateRange, "Dimension": Dimension, "Filter": Filter,
        "FilterExpression": FilterExpression, "Metric": Metric,
        "RunReportRequest": RunReportRequest, "OrderBy": OrderBy,
    }
    ctx = _Ctx(client, prop, dr, types)

    out = {"window_days": days, "start": start, "end": end}

    # Sanity: which converter_* events have ANY data in this window?
    # Single grouped query by eventName, filtered to our 5 events. This is the
    # "did instrumentation produce anything yet?" probe and never needs a
    # custom dimension (eventName is a built-in dimension), so it works from
    # day one even before register-ga4-custom-dimensions.py runs.
    event_totals = {}
    try:
        in_filter = FilterExpression(
            filter=Filter(
                field_name="eventName",
                in_list_filter=Filter.InListFilter(values=ALL_EVENTS),
            )
        )
        resp = client.run_report(RunReportRequest(
            property=prop, date_ranges=[dr],
            dimensions=[Dimension(name="eventName")],
            metrics=[Metric(name="eventCount")],
            dimension_filter=in_filter,
            order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="eventCount"), desc=True)],
            limit=25,
        ))
        for r in resp.rows:
            event_totals[r.dimension_values[0].value] = int(r.metric_values[0].value)
    except Exception as e:  # noqa: BLE001
        out["event_totals_error"] = f"{type(e).__name__}: {e}"
    out["event_totals"] = event_totals
    out["any_converter_events"] = sum(event_totals.values()) > 0

    # Report 1 (PRIMARY): term demand ranking
    term_rank = ctx.run_dimensioned(EVT_LOOKUP, "customEvent:term_id", "term_id")
    if term_rank.get("status") == "data":
        term_rank["rows"] = term_rank["rows"][:limit]
    out["term_demand"] = term_rank

    # Report 2: direction usage (convert split by direction)
    # Primary: split converter_convert by customEvent:direction.
    out["direction_convert"] = ctx.run_dimensioned(
        EVT_CONVERT, "customEvent:direction", "direction")
    # Secondary cross-check: converter_direction_toggle by customEvent:to.
    # Answers "how often did people actively flip the toggle, and to what".
    out["direction_toggle"] = ctx.run_dimensioned(
        EVT_TOGGLE, "customEvent:to", "to")

    # Report 3: example category popularity
    out["example_categories"] = ctx.run_dimensioned(
        EVT_EXAMPLE, "customEvent:category", "category")

    # Report 4: funnel counts (convert -> copy)
    convert_n = ctx.event_count(EVT_CONVERT)
    copy_n = ctx.event_count(EVT_COPY)
    lookup_n = ctx.event_count(EVT_LOOKUP)
    ratio = None
    if convert_n and copy_n is not None and convert_n > 0:
        ratio = round(copy_n / convert_n, 4)
    out["funnel"] = {
        "converter_convert": convert_n,
        "converter_copy": copy_n,
        "converter_term_lookup": lookup_n,
        "copy_per_convert": ratio,
    }

    return out


def _render_dim_report(title, rep, *, value_key, label_w=40, top=None):
    """Pretty-print one dimensioned report's status dict."""
    print(f"  ── {title} ──")
    if rep is None:
        print("    (report not run)")
        return
    st = rep.get("status")
    if st == "hint":
        print(f"    {rep['message']}")
        return
    if st == "error":
        print(f"    ⚠️  {rep['dimension']} error: {rep['message']}")
        return
    if st == "empty":
        print(f"    (no rows yet for {rep['dimension']} — instrumentation just shipped)")
        return
    rows = rep.get("rows", [])
    if top:
        rows = rows[:top]
    for i, row in enumerate(rows, 1):
        val = str(row.get(value_key, "(not set)"))
        print(f"    {i:>3}. {val:<{label_w}} {row['count']:>7}")


def render_human(result, windows, limit):
    for w in windows:
        ga = result["windows"].get(str(w), {})
        print(f"\n{'='*64}")
        print(f"📅 Window {w}d  ({ga.get('start','?')} → {ga.get('end','?')})")
        print(f"{'='*64}")

        if "error" in ga:
            print("  ❌ window error:", ga["error"])
            continue

        totals = ga.get("event_totals", {})
        if "event_totals_error" in ga:
            print("  ⚠️  event-totals probe error:", ga["event_totals_error"])
        if not ga.get("any_converter_events"):
            print("  ℹ️  no converter_* events in this window yet "
                  "(instrumentation just shipped — give it days/weeks).")
        else:
            print("  event totals:",
                  ", ".join(f"{ev}={totals.get(ev,0)}" for ev in ALL_EVENTS))

        # 1. PRIMARY: term demand
        print()
        _render_dim_report(
            f"(1) Term demand ranking (top {limit} most looked-up term_ids) — PRIMARY",
            ga.get("term_demand"), value_key="term_id", label_w=40, top=limit)

        # 2. direction
        print()
        _render_dim_report("(2) Direction usage — converter_convert by direction",
                           ga.get("direction_convert"), value_key="direction", label_w=12)
        _render_dim_report("    Direction toggle — converter_direction_toggle (to)",
                           ga.get("direction_toggle"), value_key="to", label_w=12)

        # 3. example categories
        print()
        _render_dim_report("(3) Example category popularity — converter_example_click by category",
                           ga.get("example_categories"), value_key="category", label_w=28)

        # 4. funnel
        print()
        f = ga.get("funnel", {})
        print("  ── (4) Funnel convert → copy ──")

        def _fmt(v):
            return "(error)" if v is None else v
        print(f"    converter_convert     = {_fmt(f.get('converter_convert'))}")
        print(f"    converter_copy        = {_fmt(f.get('converter_copy'))}")
        print(f"    converter_term_lookup = {_fmt(f.get('converter_term_lookup'))}")
        cpc = f.get("copy_per_convert")
        print(f"    copy / convert ratio  = {cpc if cpc is not None else '(n/a — no converts yet)'}")

    print(f"\n💾 saved → {CACHE_DIR / 'converter-demand-latest.json'}")
    print("ℹ️  Limitation: this ranking only covers demand for EXISTING terms; "
          "cannot see missing terms (see module docstring).")


def main():
    import argparse
    parser = argparse.ArgumentParser(
        description="Converter demand-loop: read which terms people actually look up (GA4 events)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Reports (per 90d + 28d window):\n"
            "  ① term demand ranking  — converter_term_lookup × customEvent:term_id (PRIMARY)\n"
            "  ② direction usage      — converter_convert × customEvent:direction (+ toggle)\n"
            "  ③ example categories   — converter_example_click × customEvent:category\n"
            "  ④ funnel               — converter_convert / converter_copy counts\n\n"
            "Custom dims not registered yet → prints a hint and keeps going.\n"
            "No data yet → prints 'instrumentation just shipped' (events just deployed).\n"
            "LIMITATION: ranks demand among EXISTING terms only; does NOT reveal\n"
            "MISSING terms users typed that we don't yet map (see module docstring)."
        ),
    )
    parser.add_argument("--json", action="store_true", help="raw JSON only")
    parser.add_argument("--windows", default="90,28", help="comma-separated day windows (default 90,28)")
    parser.add_argument("--limit", type=int, default=50, help="how many top term_ids to show (default 50)")
    args = parser.parse_args()

    reexec_in_venv()

    env = load_env()
    property_id = env.get("GA4_PROPERTY_ID", "").strip()
    if not property_id:
        print(f"❌ GA4_PROPERTY_ID not set in {ENV_FILE}", file=sys.stderr)
        sys.exit(1)
    cred_path = SERVICE_ACCOUNT_FILE
    if not cred_path.exists():
        print(f"❌ service account missing at {cred_path}", file=sys.stderr)
        sys.exit(1)

    try:
        windows = [int(x) for x in args.windows.split(",") if x.strip()]
    except ValueError:
        print(f"❌ --windows must be comma-separated ints, got {args.windows!r}", file=sys.stderr)
        sys.exit(1)
    if not windows:
        windows = [90, 28]

    result = {
        "fetched_at": datetime.now().isoformat(),
        "property_id": property_id,
        "primary_signal": EVT_LOOKUP,
        "limitation": (
            "Ranks demand among EXISTING terms only (converter_term_lookup fires "
            "only on matched rules). Does NOT reveal missing terms users typed that "
            "we don't yet map — that needs a different future signal."
        ),
        "windows": {},
    }
    for w in windows:
        try:
            result["windows"][str(w)] = fetch_window(property_id, cred_path, w, args.limit)
        except Exception as e:  # noqa: BLE001 — one window failing shouldn't kill the rest
            result["windows"][str(w)] = {"error": f"{type(e).__name__}: {e}"}

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    out_path = CACHE_DIR / "converter-demand-latest.json"
    out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2))

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return

    render_human(result, windows, args.limit)


if __name__ == "__main__":
    main()
