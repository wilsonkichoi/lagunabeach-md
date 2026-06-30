#!/usr/bin/env python3
"""
translate.py — Translation cascade orchestrator (backend-agnostic).

Single entry point for SQUEEZE-MODELS-MAX-PIPELINE v4 (post-2026-05-12 backend
abstraction). Replaces the model-specific scripts (openrouter-translate.py /
codex-translate.py / ollama-translate.py) for new work.

The cascade tries backends in priority order, skipping any that report
`is_available()=False` or `in_cooldown()`, and falling through to the next on
`BackendError` (rate limit / refusal / timeout / bad output). First success wins.

Existing scripts kept for back-compat — this is the **new canonical entry point**.

Usage:
    # Translate entire group via default cascade
    python3 translate.py --group .lang-sync-tasks/ja/_group-A.json

    # Override cascade: codex first, then OpenRouter owl-alpha, then Ollama
    python3 translate.py --group ... --cascade codex,openrouter:owl-alpha,ollama

    # Single article test
 python3 translate.py --zh-path Society/颱風假.md --lang ja --cascade codex

Cascade syntax:
    backend_name[:option]
    - `codex`
    - `openrouter:MODEL` (e.g. `openrouter:openrouter/owl-alpha`)
    - `gemini[:MODEL]`
    - `ollama[:MODEL]`

Designed perCheyu 2026-05-12 callout 「儘可能module化 抽象化 可抽換化」.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path
from typing import Optional

from backends import (
    BackendError,
    BackendRateLimited,
    BackendRefusal,
    BackendTimeout,
    BackendUnavailable,
    CodexBackend,
    GeminiBackend,
    OllamaBackend,
    OpenRouterBackend,
    TranslationBackend,
    build_translation_prompt,
)

REPO = Path(__file__).resolve().parent.parent.parent.parent
KNOWLEDGE = REPO / "knowledge"


# ────────────────── Cascade defaults ──────────────────

DEFAULT_CASCADE_ID = "codex,gemini,openrouter:openai/gpt-oss-120b:free,ollama"
"""Default cascade priority (v4.3 2026-06-10 audit D-2; v4.2 2026-05-16 Cheyu callout「codex + gemini 為priority」):

1. **codex (gpt-5.5)** — subscription, top quality, ~100% Taiwan pass (production verified)
2. **gemini (gemini-2.5-pro)** — Google subscription priority partner (對 sensitive 主題待 calibrate)
3. **openrouter gpt-oss-120b:free** — verified free（大Articles會 truncate，ratio gate 接手）
4. **ollama (qwen3.6)** — sovereignty backbone, never refuses（需 `ollama serve` 啟動）

v4.3 變更：owl-alpha 移出 default — 2026-06-10 babel-nightly 證實 silent 轉 paid
（HTTP 404，兩週inside第 5 cloud free tier 死亡：Hy3 → deepseek → qwen3 → owl-alpha）。
「free tier alive 是 daily-deprecating 假設not常數」(memory 2026-06-09-003433)。
要retry owl-alpha 走 `--cascade openrouter:openrouter/owl-alpha,...` 顯式 override。

Verifyqueue model (Llama-3.3-70b / Hermes-3-405b / Gemma-4-31b 等) not in default cascade —
要Verify走 `--cascade openrouter:{MODEL}` override + SQUEEZE-MODELS-MAX-PIPELINE §Verify SOP。

搭配 preflight health-check（v4.3 add，audit D-2）：batch Mode default 先 probe Each
backend，死模型整 run 冷凍一次，不再讓 168 各自撞 timeout 燒掉幾hours。

Pipeline canonical: docs/pipelines/SQUEEZE-MODELS-MAX-PIPELINE.md
"""


def build_cascade(cascade_id: str = DEFAULT_CASCADE_ID) -> "TranslationCascade":
    """Build a cascade from a comma-separated backend spec."""
    backends = []
    for spec in cascade_id.split(","):
        spec = spec.strip()
        if not spec:
            continue
        name, _, opt = spec.partition(":")
        name = name.strip()
        opt = opt.strip()

        if name == "codex":
            backends.append(CodexBackend())
        elif name == "openrouter":
            model = opt or "openrouter/owl-alpha"
            backends.append(OpenRouterBackend(model=model))
        elif name == "gemini":
            backends.append(GeminiBackend(model=opt) if opt else GeminiBackend())
        elif name == "ollama":
            model = opt or "qwen3.6:35b-a3b-coding-nvfp4"
            backends.append(OllamaBackend(model=model))
        else:
            print(f"⚠️  Unknown backend in cascade: {spec!r}", file=sys.stderr)

    return TranslationCascade(backends)


# ────────────────── Cascade orchestrator ──────────────────

class CascadeExhausted(Exception):
    """All backends in cascade failed."""


class TranslationCascade:
    """Cascade across multiple backends; first success wins."""

    def __init__(self, backends: list[TranslationBackend]):
        self.backends = backends

    def translate(self, system: str, user: str, **kw) -> tuple[str, str]:
        """Try each backend in order. Return (output, backend_name).

        Skips backends that are:
        - Not available (is_available() = False)
        - In cool-down (in_cooldown() = True)
        - Raised non-recoverable error (refusal / bad output) — but tries next anyway

        Raises CascadeExhausted if all backends failed.
        """
        errors = []
        for backend in self.backends:
            if not backend.is_available():
                errors.append(f"{backend.name}: not available (skipped)")
                continue
            if backend.in_cooldown():
                errors.append(f"{backend.name}: in cool-down (skipped)")
                continue

            try:
                output = backend.translate(system, user, **kw)
                return output, backend.name
            except BackendRateLimited as e:
                errors.append(f"{backend.name}: rate-limited → {e}")
                # cool_down already marked inside backend
                continue
            except BackendRefusal as e:
                errors.append(f"{backend.name}: refused → {e}")
                continue
            except BackendTimeout as e:
                errors.append(f"{backend.name}: timeout → {e}")
                continue
            except BackendUnavailable as e:
                errors.append(f"{backend.name}: became unavailable → {e}")
                continue
            except BackendError as e:
                errors.append(f"{backend.name}: error → {e}")
                continue

        raise CascadeExhausted(
            "All backends in cascade failed:\n" + "\n".join(f"  - {e}" for e in errors)
        )

    def stats_report(self) -> str:
        """One-line per-backend stats summary."""
        lines = []
        for b in self.backends:
            s = b.stats
            lines.append(
                f"  {b.name:35s}  calls={s.calls:3d}  ok={s.successes:3d}  "
                f"429={s.rate_limited:2d}  refuse={s.refusals:2d}  timeout={s.timeouts:2d}"
            )
        return "\n".join(lines)

    def preflight(self, probe_timeout: int = 180, cool_down_seconds: int = 6 * 3600) -> dict:
        """Probe each backend once with a tiny translation before a batch run
        (audit 2026-06-10 D-2).

 Why：2026-06-09/10 babel-nightly 兩晚，owl-alpha silent 轉 paid（404）
 + other cloud 連環死，cascade None preflight，每Articles都對死模型重撞一次
 timeout，5hr cascade 大半燒在已死的層。preflight 把「模型死了」的發現
 成本From per-article 降到 per-run。

 Dead/abnormal backend → mark_cool_down(6h)，整 batch run automaticSkipped。
        Returns {backend_name: "alive" | "dead: <reason>"}.
        """
        results = {}
        probe_system = "You are a translator. Translate the user text to English. Reply with the translation only."
 # Probe Must長到能過各 backend 的 anti-truncation 最小Output守衛
 # （首版用「你好，台灣。」→ 14 char Output被all backend 的 tiny-output
 # guard 誤殺 — REFLEXES #66 probe 也要用真實 validator 校準）。
 # Content刻意中性（夜市），不撞 PRC content policy — probe 量的是
 # 「模型活著嗎」not「sovereignty refusal」（那是 cascade 本體的事）。
        probe_user = (
 "台灣的夜市文化是日常生活的一partial。傍晚過後，攤位陸續點燈，"
 "From蚵仔煎、鹽酥雞到珍珠奶茶，Each攤子都有自己的常客。"
 "對許多人來說，夜市不只是吃東西的地方，也是朋友見面、"
 "家人散步、觀光客認識在地生活的entry point。"
        )
        for backend in self.backends:
            if not backend.is_available():
                results[backend.name] = "dead: not available (config/binary missing)"
                continue
            try:
                out = backend.translate(probe_system, probe_user,
                                        max_tokens=64, timeout=probe_timeout)
                if out and out.strip():
                    results[backend.name] = "alive"
                else:
                    backend.mark_cool_down(cool_down_seconds)
                    results[backend.name] = "dead: empty probe output"
            except Exception as e:  # any backend error → freeze for this run
                backend.mark_cool_down(cool_down_seconds)
                results[backend.name] = f"dead: {type(e).__name__}: {str(e)[:120]}"
        return results


# ────────────────── Per-article driver ──────────────────

def translate_one(article: dict, lang: str, cascade: TranslationCascade,
                  dry_run: bool = False) -> tuple[bool, Optional[str], Optional[str]]:
    """Translate one article via the cascade.

    Returns (success, error_msg, backend_used).
    """
    zh_path = article["zh_path"]
    out_path = REPO / article["en_path"]

    zh_full = KNOWLEDGE / zh_path
    if not zh_full.exists():
        return False, f"zh source not found: {zh_path}", None

    zh_content = zh_full.read_text()
    system, user_msg = build_translation_prompt(article, zh_content, lang)

    if dry_run:
        print(f"DRY RUN: would translate {zh_path} → {out_path}")
        return True, None, "dry-run"

    try:
        output, backend_used = cascade.translate(system, user_msg)
    except CascadeExhausted as e:
        return False, str(e), None

    # Strip markdown code fence wrapper if present
    output = output.strip()
    if output.startswith("```markdown"):
        output = output[len("```markdown"):].lstrip("\n")
    elif output.startswith("```"):
        output = output[3:].lstrip("\n")
    if output.endswith("```"):
        output = output[:-3].rstrip("\n")

    # Footnote completeness hard gate (2026-06-06): reject truncated/incomplete output.
    # The cascade model can hit its token limit and cut off the article tail (image
    # credits + footnote definitions), silently de-citationing the translation. If the
    # output has fewer [^n]: definitions than the source, don't save it — return failure
    # so the article stays stale and is retried (possibly by a different backend) next run.
    fn_def_re = re.compile(r"(?m)^\[\^[^\]]+\]:")
    src_fns = len(fn_def_re.findall(zh_content))
    out_fns = len(fn_def_re.findall(output))
    if src_fns > 0 and out_fns < src_fns:
        return False, f"footnote loss ({src_fns}→{out_fns} defs) via {backend_used} — incomplete, not saved", backend_used

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(output + "\n")

    size = out_path.stat().st_size
    if size < 1000:
        try:
            out_path.unlink()
        except Exception:  # noqa: BLE001
            pass
        return False, f"output too small ({size} bytes) — file removed", backend_used

    return True, None, backend_used


# ────────────────── CLI ──────────────────

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--group", help="group manifest JSON (created by prepare-batch.py)")
    ap.add_argument("--zh-path", help="single zh path to translate (use with --lang)")
    ap.add_argument("--lang", help="target lang (required for --zh-path mode)")
    ap.add_argument("--cascade", default=DEFAULT_CASCADE_ID,
                    help=f"comma-separated backend spec (default: {DEFAULT_CASCADE_ID})")
    ap.add_argument("--max-articles", type=int, help="cap on articles processed")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--health-check", action="store_true",
                    help="probe each backend with a tiny translation, print table, exit "
                         "(audit 2026-06-10 D-2)")
    ap.add_argument("--no-preflight", action="store_true",
                    help="skip the automatic batch-mode preflight probe")
    args = ap.parse_args()

    cascade = build_cascade(args.cascade)

    print(f"📋 Cascade: {' → '.join(b.name for b in cascade.backends)}")
    print(f"   Available: {[b.name for b in cascade.backends if b.is_available()]}")

    if args.health_check:
        print("🩺 Preflight health-check (tiny probe per backend)...")
        results = cascade.preflight()
        dead = 0
        for name, verdict in results.items():
            icon = "✅" if verdict == "alive" else "💀"
            if verdict != "alive":
                dead += 1
            print(f"   {icon} {name:35s} {verdict}")
        print(f"🩺 {len(results) - dead}/{len(results)} alive")
        sys.exit(0 if dead < len(results) else 1)

 # Batch (--group) Mode default 跑 preflight：死模型整 run 冷凍一次，
 # 不讓每Articles各撞一次 timeout（2026-06-09/10 babel 5hr lesson）。
    if args.group and not args.no_preflight and not args.dry_run:
        print("🩺 Batch preflight...")
        for name, verdict in cascade.preflight().items():
            icon = "✅" if verdict == "alive" else "💀 frozen 6h:"
            print(f"   {icon} {name:35s} {verdict if verdict != 'alive' else ''}")

    if args.group:
        group_path = Path(args.group).resolve()
        group = json.loads(group_path.read_text())
        articles = group.get("articles", group) if isinstance(group, dict) else group
        if args.max_articles:
            articles = articles[: args.max_articles]
        lang = args.lang or group_path.parent.name

    elif args.zh_path:
        if not args.lang:
            print("❌ --lang required for --zh-path mode", file=sys.stderr)
            sys.exit(2)
        # Build a minimal article record from manifest
        manifest_path = REPO / ".lang-sync-tasks" / args.lang / "_batch-manifest.json"
        if not manifest_path.exists():
            print(f"❌ no manifest at {manifest_path}", file=sys.stderr)
            sys.exit(2)
        manifest = json.loads(manifest_path.read_text())
        articles = [a for a in manifest.get("articles", []) if a["zh_path"] == args.zh_path]
        if not articles:
            print(f"❌ {args.zh_path} not in {args.lang} manifest", file=sys.stderr)
            sys.exit(2)
        lang = args.lang
    else:
        ap.error("either --group or (--zh-path + --lang) required")

    print(f"   Translating {len(articles)} article(s) to {lang}")
    print()

    ok = 0
    fail = 0
    start = time.time()
    for idx, article in enumerate(articles, 1):
        t0 = time.time()
        zh = article["zh_path"]
        print(f"[{idx}/{len(articles)}] {zh}", end=" ", flush=True)
        success, err, backend_used = translate_one(article, lang, cascade, dry_run=args.dry_run)
        dt = int(time.time() - t0)
        if success:
            ok += 1
            print(f"→ ok via {backend_used} ({dt}s)")
        else:
            fail += 1
            print(f"❌ {err[:120] if err else 'unknown'} ({dt}s)")

    elapsed = int(time.time() - start)
    print()
    print(f"✅ done: {ok}/{len(articles)} ok, {fail} fail in {elapsed}s ({elapsed // 60}m{elapsed % 60}s)")
    print()
    print("Backend stats:")
    print(cascade.stats_report())

    sys.exit(0 if fail == 0 else 1)


if __name__ == "__main__":
    main()
