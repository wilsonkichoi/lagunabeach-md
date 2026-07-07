# Pin extraction deps to the fork's exact versions

When a task copies dependencies from the fork (`lagunabeach-md-v1`) `package.json`, pin
`astro`, `tailwindcss`, `@tailwindcss/vite`, and any coupled build-toolchain packages to the
fork's **exact** installed versions, and commit `package-lock.json`. Do not use caret ranges,
even when a packet's suggested steps write `^6` / `^4` — those are advisory; the fork's
installed version is the contract.

**Why:** In LB-1, the packet's `astro ^6` / `tailwindcss ^4` resolved to astro 6.4.8 +
tailwind 4.3.2, pulling mismatched vite majors (vite 8 via tailwind, vite 7 via astro) that
crash the rolldown resolver with `Missing field tsconfigPaths`. The build went green only
after pinning the fork's known-good 6.2.1 / 4.2.2 / 4.2.2. Caret ranges silently drift to a
broken latest on every fresh install.
