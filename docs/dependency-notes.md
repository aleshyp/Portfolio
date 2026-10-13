# Dependency notes

Why certain packages are deliberately held back. Re-check when the blocking
upstream work lands; until then, `npm outdated` showing these is expected.

Last verified: 2026-10-13.

## Held back

### typescript 6 → 7 — blocked

TypeScript 7 typechecks this codebase cleanly (`tsc --noEmit` passes, build
passes), but **`npm run lint` fails outright**:

```
Error: typescript-eslint does not support TS 7.0.
```

`typescript-eslint` hard-errors on the TS 7 compiler API. `8.67.0` is the
newest published version and still declares `typescript: >=4.8.4 <6.1.0`,
so there is no release to upgrade into. Tracked upstream in
[typescript-eslint#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)
for TS >= 7.1.

There is an official side-by-side workaround (run typescript-eslint against a
second, TS 6 API install), but that means two TypeScript versions in the tree —
one typechecking the code, a different one linting it — for no user-visible
gain on a static site. Not worth the complexity here.

**Unblocks when:** typescript-eslint ships TS 7 support and `eslint-config-next`
picks it up.

### eslint 9 → 10 — blocked

`eslint-config-next@16.3.0` advertises `eslint: >=9.0.0`, which *looks* like
v10 is supported. It isn't. Its bundled `typescript-eslint@8.67` calls a
scope-manager API that ESLint 10 removed, and lint crashes on every file:

```
TypeError: scopeManager.addGlobals is not a function
```

The declared peer range is optimistic; the actual code is not v10-ready. Don't
trust the range alone — re-test by running `npm run lint`.

**Unblocks when:** `eslint-config-next` ships a `typescript-eslint` built
against the ESLint 10 API.

### @types/node 24 → 26 — intentional, not a blocker

Pinned to the major matching the Node runtime in `.nvmrc` (24). Node 26 types
would describe APIs the runtime doesn't have. Bump only alongside `.nvmrc` and
the `engines.node` floor in `package.json`.

## Cleared

### framer-motion 12 → 13 — done, merged 2026-08-14

No source changes needed; the APIs this repo uses (`motion`, `AnimatePresence`,
`useReducedMotion`, `Variants`) are unchanged. Verified with typecheck,
production build, and the full Playwright suite, which covers the
`AnimatePresence` hamburger menu, staggered reveals, and
`prefers-reduced-motion` paths.

This sat finished-but-unmerged on `chore/framer-motion-13` for three days
while this file already called it done — `package.json` was the source of
truth and still said `^12`. **When recording something as cleared here, check
that the version bump is actually on `main`.**

### next / eslint-config-next 16.3.0 → 16.3.1 — done

Patch release, taken 2026-08-14. It surfaced a latent reduced-motion hydration
mismatch that 16.3.0 tolerated: components picking *markup* from
`useReducedMotion()` (which returns `null` server-side) rendered differently on
the client's first pass, and the failed hydration showed up as an a11y scan
reporting a missing `lang` attribute. Fixed with `useStableReducedMotion()` in
`src/lib/` — see that hook's docstring for which components need it and, just
as importantly, which must NOT use it.

### next / eslint-config-next 16.3.1 → 16.4.0, sharp 0.35.5 — done 2026-10-13 (security)

Taken via `npm audit fix` (non-breaking) after the CI audit job had been
failing on `main` for weeks. 16.3.x carried a critical RCE in
`next/og`'s ImageResponse, which this site uses for its OG images, plus
cache-poisoning, image-optimizer SSRF and metadata-route disclosure advisories.
Floors raised to `^16.4.0` so a fresh install can't resolve back. No source
changes; verified with typecheck, lint, unit tests, production build, the
Lighthouse gate and two full e2e runs.

## Known, accepted

### braces (dev-only) — no fix exists

`npm audit` (without `--omit=dev`) still reports a high-severity
stack-exhaustion DoS in `braces`, affecting every published version, reached
through `@next/eslint-plugin-next` → `fast-glob`. It runs only at lint time on
this repo's own files and never ships, and CI gates on `--omit=dev`. Re-check
when `npm audit` reports a fix.

## Re-checking

```bash
npm outdated                  # what has moved
npm audit --omit=dev          # what actually ships (CI gates on high)
npm run lint                  # the real test for the eslint/TS majors above
npm run test:e2e              # run it more than once; see below
```

As of 2026-08-14 `npm outdated` should list exactly three packages — `eslint`,
`typescript`, and `@types/node` — all three deliberate, all three explained
above. Anything else on that list is genuinely behind.

A note on the e2e suite: it is the real gate for upgrades that touch rendering,
but a single green run doesn't prove much. The a11y scans were failing ~4 runs
in 10 from a race unrelated to any dependency, which is easy to misread as an
upgrade regression. Run it several times, and kill stray `next dev` processes
between runs or the next run inherits a broken server.

CI (`.github/workflows/ci.yml`) also runs `npm audit` weekly, so new advisories
against unchanged code surface without anyone remembering to look.
