#!/usr/bin/env python3
"""
instrumentation-audit.py — GA4 event-param vs custom-dimension drift detector (immune Layer 1)

Bug class prevented: "what params code fires" vs "what custom dims GA4 has registered"
are two separate sources of truth maintained by different workflows (code changes vs
GA4 Admin / register script). Drift is silent.
2026-05-29 D+2 watch caught three instances:
  - pct: dim registered but code sends depth_pct (name mismatch -> attribution all not-set)
  - link_url: code fires but never registered (-> query side blind)
  - failed_path: page_404 fires but never registered (-> fetch-ga4 query swallows via try/except)

Code is SSOT (same principle as "knowledge/ is SSOT" extended to instrumentation layer).
Three-way alignment:
  (1) params code actually fires   — parsed from tracker source
  (2) register script declared SSOT — register-ga4-custom-dimensions.py *_DIMENSIONS list
  (3) GA4 live registered dims      — Admin API list (needs creds)

Two modes:
  --static  pure static (no creds needed, CI-safe): code params vs SSOT
  --live    needs creds: SSOT vs GA4 Admin live dims
  (no flag) runs both if creds available, static-only otherwise

Exit code: ERROR present -> 1 (CI gate), WARN only -> 0.

Usage:
    python3 scripts/tools/instrumentation-audit.py [--static | --live] [--json]
"""
import argparse
import importlib.util
import os
import re
import sys
from pathlib import Path

# Re-exec in venv if present (so --live google imports work). CI has no venv ->
# stays in system python for --static (pure stdlib). Must be before google import.
VENV_DIR = Path.home() / ".config" / "lagunabeach-md" / "venv"
if VENV_DIR.exists() and sys.prefix != str(VENV_DIR):
    _venv_py = VENV_DIR / "bin" / "python3"
    if _venv_py.exists() and __name__ == "__main__":
        os.execv(str(_venv_py), [str(_venv_py), __file__, *sys.argv[1:]])

REPO = Path(__file__).resolve().parents[2]
REGISTER_SCRIPT = REPO / "scripts" / "tools" / "register-ga4-custom-dimensions.py"

# Tracker source files: any file with _fire() / gtag('event', ...) instrumentation
TRACKER_FILES = [
    REPO / "src" / "components" / "EventTracker.astro",
    REPO / "src" / "layouts" / "Layout.astro",
    REPO / "src" / "pages" / "404.astro",
]

# Params intentionally NOT registered as custom dimensions (e.g. debug-only, or
# already covered by GA built-ins). Empty = all fired params should have a dim.
# Each entry added here must have a documented reason.
IGNORE_PARAMS = set()


# ── 1. Parse code: extract param keys actually fired by each event ────────────
def _balanced_object(text, start):
    """From text[start] at '{', return substring to matching '}' (inclusive)."""
    depth = 0
    for i in range(start, len(text)):
        c = text[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    return text[start:]


def _top_level_keys(obj_str):
    """Extract depth-1 key names from an object literal (avoids nested object + ternary colons)."""
    keys = []
    depth = 0
    expect_key = False
    i = 0
    while i < len(obj_str):
        c = obj_str[i]
        if c in "{[(":
            depth += 1
            if c == "{" and depth == 1:
                expect_key = True
            i += 1
            continue
        if c in "}])":
            depth -= 1
            i += 1
            continue
        if depth == 1 and c == ",":
            expect_key = True
            i += 1
            continue
        if depth == 1 and expect_key:
            m = re.match(r"\s*(\w+)\s*:", obj_str[i:])
            if m:
                keys.append(m.group(1))
                i += m.end()
                expect_key = False
                continue
            if obj_str[i].isspace():
                i += 1
                continue
            expect_key = False
        i += 1
    return keys


def parse_fired_events(files):
    """Return {event_name: set(params)}, scanning all _fire(...) and gtag('event', ...) calls."""
    events = {}
    # Two call patterns: _fire(  /  gtag('event',  /  gtag("event",
    call_re = re.compile(r"(_fire\s*\(|gtag\s*\(\s*['\"]event['\"]\s*,)")
    str_re = re.compile(r"""['"]([A-Za-z0-9_]+)['"]""")
    # wrapper-injected params: `params.X = ...` (e.g. EventTracker._fire injects page_type
    # into every event) -- not visible in call-site object literal, but every event carries them.
    inject_re = re.compile(r"params\.(\w+)\s*=(?!=)")
    injected = set()
    for f in files:
        if not f.exists():
            print(f"⚠️  tracker not found: {f}", file=sys.stderr)
            continue
        text = f.read_text()
        injected.update(inject_re.findall(text))
        for m in call_re.finditer(text):
            call_start = m.start()
            brace = text.find("{", m.end())
            if brace == -1:
                continue
            # event name = string literal between call start and object brace (excluding 'event')
            head = text[m.end() : brace]
            names = [s for s in str_re.findall(head) if s != "event"]
            if not names:
                continue
            obj = _balanced_object(text, brace)
            keys = set(_top_level_keys(obj))
            for name in names:
                events.setdefault(name, set()).update(keys)
    # apply wrapper-injected params to every fired event
    for name in events:
        events[name].update(injected)
    return events


# ── 2. Load register script declared SSOT ─────────────────────────────────────
def load_ssot():
    spec = importlib.util.spec_from_file_location("register_dims", REGISTER_SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    declared = {p for (p, _n, _d) in mod.DIMENSIONS}
    deprecated = set(getattr(mod, "DEPRECATED_DIMENSIONS", []))
    return declared, deprecated


# ── 3. GA4 live dims (needs creds) ────────────────────────────────────────────
def load_live_dims():
    from google.analytics.admin_v1beta import AnalyticsAdminServiceClient
    from google.oauth2 import service_account

    cred_dir = Path.home() / ".config" / "lagunabeach-md" / "credentials"
    pid = None
    for line in (cred_dir / ".env").read_text().splitlines():
        if line.startswith("GA4_PROPERTY_ID="):
            pid = line.split("=", 1)[1].strip().strip("\"'")
    creds = service_account.Credentials.from_service_account_file(
        str(cred_dir / "google-service-account.json"),
        scopes=["https://www.googleapis.com/auth/analytics.edit"],
    )
    client = AnalyticsAdminServiceClient(credentials=creds)
    return {cd.parameter_name for cd in client.list_custom_dimensions(parent=f"properties/{pid}")}


def creds_available():
    cred_dir = Path.home() / ".config" / "lagunabeach-md" / "credentials"
    return (cred_dir / "google-service-account.json").exists() and (cred_dir / ".env").exists()


# ── 4. Alignment logic ────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--static", action="store_true", help="code vs SSOT only (no creds needed, CI-safe)")
    ap.add_argument("--live", action="store_true", help="SSOT vs GA4 live only (needs creds)")
    ap.add_argument("--json", action="store_true", help="output JSON")
    args = ap.parse_args()

    run_static = args.static or not args.live
    run_live = args.live or (not args.static and creds_available())

    events = parse_fired_events(TRACKER_FILES)
    fired = set().union(*events.values()) if events else set()
    declared, deprecated = load_ssot()

    errors, warns, info = [], [], []
    info.append(f"events fired: {len(events)} / distinct params: {len(fired)} / SSOT declared: {len(declared)}")

    if run_static:
        # Code fires but SSOT doesn't declare (not in ignore/deprecated) -> query side blind
        fired_undeclared = fired - declared - IGNORE_PARAMS - deprecated
        for p in sorted(fired_undeclared):
            evs = sorted(e for e, ps in events.items() if p in ps)
            errors.append(f"[code vs SSOT] param `{p}` fired by ({', '.join(evs)}) but not declared in register script SSOT -> add to *_DIMENSIONS")
        # SSOT declares but no event fires (not deprecated) -> possibly dead dim
        declared_unfired = declared - fired - deprecated
        for p in sorted(declared_unfired):
            warns.append(f"[code vs SSOT] dim `{p}` in SSOT but no event fires it -> possibly dead, consider adding to DEPRECATED_DIMENSIONS")

    if run_live:
        try:
            live = load_live_dims()
            info.append(f"GA4 live dims: {len(live)}")
            # SSOT declares but GA4 hasn't registered -> run register script
            declared_not_live = declared - live
            for p in sorted(declared_not_live):
                errors.append(f"[SSOT vs GA4] `{p}` in SSOT but not registered in GA4 -> run register-ga4-custom-dimensions.py")
            # GA4 registered but SSOT doesn't declare (not deprecated) -> manual registration not codified
            live_undeclared = live - declared - deprecated
            for p in sorted(live_undeclared):
                warns.append(f"[SSOT vs GA4] GA4 has `{p}` but SSOT doesn't declare -> manual registration not codified, add to *_DIMENSIONS")
            # Deprecated still live in GA4 -> should archive
            still_live_dep = (deprecated & live)
            for p in sorted(still_live_dep):
                warns.append(f"[SSOT vs GA4] deprecated `{p}` still live in GA4 -> run register script archive")
        except Exception as e:  # noqa: BLE001
            warns.append(f"[SSOT↔GA4] live check skipped: {type(e).__name__}: {e}")

    if args.json:
        import json
        print(json.dumps({"errors": errors, "warns": warns, "info": info,
                          "events": {k: sorted(v) for k, v in events.items()}},
                         ensure_ascii=False, indent=2))
    else:
        print("🔬 instrumentation-audit — GA4 event-param vs custom-dim alignment")
        for line in info:
            print(f"   ℹ️  {line}")
        print(f"   mode: static={'on' if run_static else 'off'} live={'on' if run_live else 'off'}")
        for w in warns:
            print(f"   ⚠️  {w}")
        for e in errors:
            print(f"   ❌ {e}")
        if not errors and not warns:
            print("   ✅ code vs SSOT vs GA4 three-way aligned, no drift")
        elif not errors:
            print(f"   ✅ No ERROR ({len(warns)} warn, non-blocking)")

    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
