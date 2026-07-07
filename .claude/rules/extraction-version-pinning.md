# Pin build-toolchain deps to an exact, build-verified version — never caret ranges

When a task copies dependencies from the fork (`lagunabeach-md-v1`) `package.json`, pin
`astro`, `tailwindcss`, `@tailwindcss/vite`, and any coupled build-toolchain packages to an
**exact** version (no `^`/`~`), and commit `package-lock.json`. A packet's suggested `^6` /
`^4` ranges are advisory; caret ranges silently drift to a broken latest on every fresh
install.

**The contract is a known-good, build-verified exact pin — not the fork's version.** The
fork's installed version is a convenient *starting baseline* (it built once), not an
authority. This repo is a rebuild and holds authority over its own dependency set; the fork
can be stale or carry unpatched CVEs. Always prefer the newer, safer version:

- **Security patches take precedence over matching the fork.** If the fork's pinned version
  has a known advisory, move the pin to the patched version even though it diverges from the
  fork. Verify vite/toolchain-major compatibility and that `npm run build` stays green, then
  commit the lockfile. Do NOT "revert to the fork's version" to satisfy this rule — that
  reopens the vulnerability.
- **Compatibility is the real constraint, not fork-parity.** The LB-1 crash was a vite-major
  mismatch, not "wrong version number." Keep the toolchain internally consistent (below);
  within that, take the latest safe release.

**Why (LB-1 crash):** the packet's `astro ^6` / `tailwindcss ^4` resolved to astro 6.4.8 +
tailwind 4.3.2, pulling mismatched vite majors (vite 8 via tailwind, vite 7 via astro) that
crash the rolldown resolver with `Missing field tsconfigPaths`. The build went green only
after pinning an exact, mutually-compatible set (then astro 6.2.1 / tailwind 4.2.2 /
@tailwindcss/vite 4.2.2).

**Precedent (2026-07-07 security scan):** bumped astro 6.2.1 → 6.4.8 to patch three
XSS/SSRF advisories (GHSA-8hv8-536x-4wqp, GHSA-jrpj-wcv7-9fh9, GHSA-2pvr-wf23-7pc7), keeping
tailwind/@tailwindcss/vite at 4.2.2. Safe because astro's `vite ^7.3.2` dep is identical
between 6.2.1 and 6.4.8, so the bump does not touch the vite-major situation. Build verified
green. The pin now intentionally diverges from the fork (still on 6.2.1); that is correct.
