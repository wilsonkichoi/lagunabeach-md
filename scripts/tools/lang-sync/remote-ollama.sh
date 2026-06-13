#!/usr/bin/env bash
# remote-ollama.sh — connect & manage a remote sovereignty-safe GPU compute node
# for Taiwan.md batch LLM work (article babel / diary translation / embedding).
#
# Encapsulates the 2026-06-13 RTX-5090 session into ONE reusable instrument so a
# future node (any GPU box on the tailnet running Ollama) is a config entry, not
# a manual rediscovery:
#   node registry → start remote Ollama (headless serve task) → self-healing SSH
#   tunnel → set GPU parallelism → verify sovereignty-safe model → health → teardown.
#
# Methodology / SOP : docs/pipelines/REMOTE-GPU-PIPELINE.md
# Node registry     : .taiwanmd/compute-nodes.local.yml (template: .example.yml)
# Integrity gate    : every translation tool that targets a node MUST run an
#                     instrumented integrity audit (diary-translation-audit.py /
#                     verify-batch.py) — local LLM truncates silently; the
#                     byte-size guard cannot see it.
#
# Usage:
#   remote-ollama.sh status   [node]            # health: tunnel / ollama / model / GPU / VRAM / parallel
#   remote-ollama.sh connect  [node]            # bring node up (idempotent) + tunnel + parallel; prints export
#   remote-ollama.sh connect  [node] --export   # print ONLY the `export OLLAMA_API_URL=... OLLAMA_MODEL=...` line
#   remote-ollama.sh models   [node]            # list models + sovereignty classification (✅ safe / ❌ PRC)
#   remote-ollama.sh teardown [node]            # kill local tunnel (leave-no-trace). --stop-remote also stops Ollama
#   remote-ollama.sh help
#
# Wire a batch onto the node:
#   eval "$(bash remote-ollama.sh connect 5090 --export)"
#   bash diary-translate-cascade.sh --tier ollama --langs en,ja,ko,es,fr
#   bash remote-ollama.sh status 5090            # watch health while it runs
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$SCRIPT_DIR/../../.." && pwd)"
REGISTRY="$REPO/.taiwanmd/compute-nodes.local.yml"

die() { echo "❌ $*" >&2; exit 1; }
[ -f "$REGISTRY" ] || die "no registry at $REGISTRY — copy .taiwanmd/compute-nodes.example.yml and fill in"

# ── node config loader (emits N_* shell vars) ────────────────────────────────
_load_node() {
  local node="${1:-}"
  eval "$(python3 - "$REGISTRY" "$node" <<'PY'
import yaml, sys, shlex
reg, node = sys.argv[1], sys.argv[2]
nodes = (yaml.safe_load(open(reg)) or {}).get("nodes", {})
nodes = {str(k): v for k, v in nodes.items()}   # numeric ids (e.g. 5090) → str keys
if not nodes:
    sys.stderr.write("registry has no nodes\n"); sys.exit(3)
if not node:
    node = next(iter(nodes))           # default: first node
if node not in nodes:
    sys.stderr.write(f"node '{node}' not in registry. Available: {', '.join(nodes)}\n"); sys.exit(3)
n = nodes[node]
def g(k, d=""):
    v = n.get(k, d)
    return " ".join(map(str, v)) if isinstance(v, list) else str(v)
print(f"N_ID={shlex.quote(node)}")
for k in ("ssh_host","ssh_user","ollama_port","tunnel_port","serve_task","platform","num_parallel","model"):
    print(f"N_{k.upper()}={shlex.quote(g(k))}")
print(f"N_SAFE_MODELS={shlex.quote(g('safe_models'))}")
print(f"N_UNSAFE_MODELS={shlex.quote(g('unsafe_models'))}")
PY
)"
  : "${N_OLLAMA_PORT:=11434}" "${N_TUNNEL_PORT:=11500}" "${N_PLATFORM:=windows}"
}

_ssh() { ssh -o ConnectTimeout=10 -o BatchMode=yes "${N_SSH_USER}@${N_SSH_HOST}" "$@"; }

_tunnel_up() { pgrep -f "${N_TUNNEL_PORT}:localhost:${N_OLLAMA_PORT}" >/dev/null 2>&1; }

_endpoint_ok() { curl -s --max-time 6 "http://localhost:${N_TUNNEL_PORT}/api/version" >/dev/null 2>&1; }

_remote_ollama_up() {
  if [ "$N_PLATFORM" = "windows" ]; then
    [ -n "$(_ssh 'tasklist | findstr /I ollama' 2>/dev/null | head -1)" ]
  else
    [ -n "$(_ssh 'pgrep ollama' 2>/dev/null | head -1)" ]
  fi
}

_start_remote_ollama() {
  if [ "$N_PLATFORM" = "windows" ]; then
    _ssh "Start-ScheduledTask -TaskName ${N_SERVE_TASK}; Start-Sleep 10" >/dev/null 2>&1 || true
  else
    _ssh "nohup ollama serve >/tmp/ollama.log 2>&1 & sleep 8" >/dev/null 2>&1 || true
  fi
}

_gpu() { _ssh 'nvidia-smi --query-gpu=memory.used,memory.total,utilization.gpu --format=csv,noheader' 2>/dev/null | head -1; }

# ── subcommands ──────────────────────────────────────────────────────────────
cmd_status() {
  _load_node "$1"
  local tun ep rproc
  _tunnel_up && tun="UP" || tun="DOWN"
  _endpoint_ok && ep="REACHABLE" || ep="UNREACHABLE"
  _remote_ollama_up && rproc="UP" || rproc="DOWN"
  echo "🖥  node: $N_ID (${N_SSH_USER}@${N_SSH_HOST}, $N_PLATFORM)"
  echo "   tunnel    : $tun  (localhost:${N_TUNNEL_PORT} → ${N_SSH_HOST} localhost:${N_OLLAMA_PORT})"
  echo "   endpoint  : $ep  (http://localhost:${N_TUNNEL_PORT}/api/chat)"
  echo "   remote ollama: $rproc"
  echo "   GPU       : $(_gpu)"
  echo "   model     : $N_MODEL  | parallel target: ${N_NUM_PARALLEL:-auto}"
  [ "$ep" = "REACHABLE" ] && echo "   loaded    : $(curl -s --max-time 6 http://localhost:${N_TUNNEL_PORT}/api/ps 2>/dev/null | python3 -c 'import sys,json;[print(m["name"],round(m.get("size_vram",0)/1e9,1),"GB") for m in json.load(sys.stdin).get("models",[])]' 2>/dev/null || echo none)"
}

cmd_models() {
  _load_node "$1"
  _endpoint_ok || die "endpoint not reachable — run: $0 connect $N_ID"
  echo "🧬 models on $N_ID (✅ = sovereignty-safe for Taiwan content, ❌ = PRC Tier 1-2 — never use):"
  TAGS_JSON="$(curl -s --max-time 8 "http://localhost:${N_TUNNEL_PORT}/api/tags")" \
  python3 - "$N_SAFE_MODELS" "$N_UNSAFE_MODELS" <<'PY'
import os, sys, json
safe = {s.split(":")[0] for s in sys.argv[1].split()}      # normalize family (drop :tag)
unsafe = {s.split(":")[0] for s in sys.argv[2].split()}
for m in json.loads(os.environ.get("TAGS_JSON") or "{}").get("models", []):
    name = m["name"]; base = name.split(":")[0]
    mark = "✅" if base in safe else ("❌" if base in unsafe else "❓")
    print(f"  {mark} {name:34s} {round(m['size']/1e9,1)} GB")
PY
}

cmd_connect() {
  _load_node "$1"
  local export_only=0; [ "${2:-}" = "--export" ] && export_only=1

  # 1. ensure remote Ollama is serving (idempotent)
  if ! _remote_ollama_up; then
    [ "$export_only" = 1 ] || echo "↻ starting remote Ollama on $N_ID via $N_SERVE_TASK ..." >&2
    _start_remote_ollama
  fi

  # 2. set GPU parallelism (machine env) — only restart if it actually changed
  if [ -n "${N_NUM_PARALLEL:-}" ] && [ "$N_PLATFORM" = "windows" ]; then
    local cur
    cur=$(_ssh '[Environment]::GetEnvironmentVariable("OLLAMA_NUM_PARALLEL","Machine")' 2>/dev/null | tr -d '\r')
    if [ "$cur" != "$N_NUM_PARALLEL" ]; then
      [ "$export_only" = 1 ] || echo "↻ OLLAMA_NUM_PARALLEL ${cur:-unset}→$N_NUM_PARALLEL (restarting Ollama) ..." >&2
      _ssh "[Environment]::SetEnvironmentVariable('OLLAMA_NUM_PARALLEL','$N_NUM_PARALLEL','Machine'); Stop-ScheduledTask -TaskName $N_SERVE_TASK; Stop-Process -Name ollama -Force -ErrorAction SilentlyContinue; Start-Sleep 3; Start-ScheduledTask -TaskName $N_SERVE_TASK; Start-Sleep 10" >/dev/null 2>&1 || true
    fi
  fi

  # 3. self-healing SSH tunnel (idempotent — reuse if already up)
  if ! _tunnel_up; then
    [ "$export_only" = 1 ] || echo "↻ starting self-healing tunnel localhost:${N_TUNNEL_PORT} → ${N_SSH_HOST}:${N_OLLAMA_PORT} ..." >&2
    nohup bash -c "while true; do ssh -N -L ${N_TUNNEL_PORT}:localhost:${N_OLLAMA_PORT} -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -o ExitOnForwardFailure=yes -o BatchMode=yes ${N_SSH_USER}@${N_SSH_HOST}; echo \"[tunnel] dropped, reconnecting \$(date)\"; sleep 5; done" \
      > "/tmp/remote-ollama-tunnel-${N_ID}.log" 2>&1 &
    sleep 8
  fi

  # 4. verify endpoint + sovereignty-safe model present
  _endpoint_ok || die "tunnel up but endpoint unreachable — check remote Ollama / sshd AllowTcpForwarding"
  if ! curl -s --max-time 8 "http://localhost:${N_TUNNEL_PORT}/api/tags" | grep -q "\"${N_MODEL%%:*}"; then
    die "sovereignty-safe model '$N_MODEL' not pulled on $N_ID — run: $0 models $N_ID"
  fi

  # 5. emit the export line for translation tools.
  #    OLLAMA_API_URL (full /api/chat) → diary-translate.py ; OLLAMA_HOST (base)
  #    → backends/ollama.py (article babel) ; OLLAMA_MODEL → both.
  local line="export OLLAMA_API_URL=http://localhost:${N_TUNNEL_PORT}/api/chat OLLAMA_HOST=http://localhost:${N_TUNNEL_PORT} OLLAMA_MODEL=${N_MODEL}"
  if [ "$export_only" = 1 ]; then
    echo "$line"
  else
    echo "✅ $N_ID ready. Wire a batch onto it:" >&2
    echo "$line"
  fi
}

cmd_teardown() {
  _load_node "$1"
  local stop_remote=0; [ "${2:-}" = "--stop-remote" ] && stop_remote=1
  pkill -f "${N_TUNNEL_PORT}:localhost:${N_OLLAMA_PORT}" 2>/dev/null && echo "✓ tunnel killed" || echo "· no tunnel running"
  if [ "$stop_remote" = 1 ]; then
    if [ "$N_PLATFORM" = "windows" ]; then
      _ssh "Stop-ScheduledTask -TaskName $N_SERVE_TASK; Stop-Process -Name ollama -Force -ErrorAction SilentlyContinue" >/dev/null 2>&1 || true
    else
      _ssh 'pkill ollama' >/dev/null 2>&1 || true
    fi
    echo "✓ remote Ollama stopped on $N_ID (leave-no-trace)"
  else
    echo "· remote Ollama left running (use --stop-remote for borrowed-machine hygiene)"
  fi
}

case "${1:-help}" in
  status)   cmd_status "${2:-}" ;;
  connect|up) cmd_connect "${2:-}" "${3:-}" ;;
  models)   cmd_models "${2:-}" ;;
  teardown|down) cmd_teardown "${2:-}" "${3:-}" ;;
  help|-h|--help)
    sed -n '2,30p' "$0" | sed 's/^# \{0,1\}//' ;;
  *) die "unknown subcommand '$1' — try: status | connect | models | teardown | help" ;;
esac
