# harvest/ — the Orchestrator subsystem

This directory is a **runtime application**, not cognitive-layer prose. It is LagunaBeach.md's agent **Orchestrator**: a backend that watches inboxes, spawns Claude Code sessions in worktrees to execute single tasks, schedules cron jobs, runs automation prompts, plus a UI control dashboard.

It lives at the repo root as a first-class subsystem (sibling to `workers/`, `cli/`, `scripts/`), separate from the cognitive layer in `docs/semiont/`. The operating principle that governs it — the design, the boot profiles, the autonomy boundaries — is documented one level up in [`docs/semiont/HARVEST.md`](../docs/semiont/HARVEST.md), which is the boot-loadable prose; this README and `backend/README.md` document the code.

## Status in this fork

Inherited from [Taiwan.md](https://github.com/frank890417/taiwan-md), where it ran in production wired to cron, social accounts, and analytics. In LagunaBeach.md it is kept whole as the Path A → Path B automation backbone but is **not wired on**: no `.claude/launch.json`, no daemon, no cron depends on it. The code is regrounded; switching it on is deferred until the project reaches the scale that needs cross-session orchestration (per `MIGRATION.md` Rule 1: defer activation, not translation).

## Layout

```
harvest/
├── backend/   # Bun + Hono + bun:sqlite — task store, intake, spawner, scheduler, reporter
│   └── README.md   # stack, HTTP API, boot profiles, tmux deploy, kill switch
└── ui/        # Astro + Solid.js islands dashboard (task queue, vitals, daily report)
    └── README.md   # tech stack, sections, backend dependency
```

`node_modules/`, `dist/`, `.harvest/` runtime task folders, and `*.db` files are gitignored — git tracks only the source (~90 files).

## Running it

The runtime is self-contained under `backend/` and `ui/`. See [`backend/README.md`](backend/README.md) for the backend (`cd harvest/backend && bun install && bun run dev`, HTTP on `:4319`) and [`ui/README.md`](ui/README.md) for the dashboard (`cd harvest/ui && bun install && bun run dev`, on `:4321`). These commands are for when the subsystem is activated; nothing in the main site build depends on this directory.
