# Dependency notes

Why certain packages are deliberately held back. Re-check when the blocking
upstream work lands; until then, `npm outdated` showing these is expected.

Last verified: 2026-08-11.

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

### framer-motion 12 → 13 — done

Upgraded on its own branch. No source changes needed; the APIs this repo uses
(`motion`, `AnimatePresence`, `useReducedMotion`, `Variants`) are unchanged.
Verified with typecheck, production build, and the full Playwright suite
(73 passed), which covers the `AnimatePresence` hamburger menu, staggered
reveals, and `prefers-reduced-motion` paths.

## Re-checking

```bash
npm outdated                  # what has moved
npm audit --omit=dev          # what actually ships (CI gates on high)
npm run lint                  # the real test for the eslint/TS majors above
```

CI (`.github/workflows/ci.yml`) also runs `npm audit` weekly, so new advisories
against unchanged code surface without anyone remembering to look.
