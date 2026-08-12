# Portfolio

Personal portfolio site. Next.js 16 (App Router, Turbopack) · Tailwind CSS 4 (CSS-first `@theme`) · TypeScript · Framer Motion · next-themes · lucide-react.

## Design & UI work

Two complementary skills — use both:

- **`design-system`** (`/design-system`) — this repo's *concrete* system: the actual tokens (`fg-*`, `surface-*`, `ink`, `brand`), primitives, and light/dark rules. The full reference is [`DESIGN.md`](DESIGN.md) in the repo root. **The rule that prevents the most dark-mode bugs:** text uses theme-aware `fg-*` tokens (`text-fg`, `text-fg-muted`…), **not** `text-ink dark:text-slate-*`. `ink` is a fixed dark-navy used for *backgrounds* and does not flip.
- **`design-guidelines`** (`/design-guidelines`) — general UX/UI best practice: layout/spacing, color, typography, components & states, accessibility (WCAG 2.2 AA), responsive, motion, Core Web Vitals.

Run the **Review Pass** (both skills) before considering UI work done.

## Testing

Before writing, running, or reviewing tests, use the **`test-suite`** skill (`/test-suite`). It covers E2E user journeys (Playwright), accessibility (axe-core), performance/SEO (Lighthouse), and visual/responsive checks, grounded in this project's real routes and tokens. Run its **Test Pass** before calling a feature done.

## Security

Before adding user input (forms, params), wiring a backend/API route, handling external links or third-party scripts, configuring headers/CSP, or touching dependencies/secrets, use the **`security-guidelines`** skill (`/security-guidelines`). It's grounded in OWASP Top 10 (2025) and the Next.js security model, tuned to this statically-rendered site. Key standing rules: never use `dangerouslySetInnerHTML`; every `target="_blank"` needs `rel="noopener noreferrer"`; nothing secret goes in `NEXT_PUBLIC_*` or client code; client-side validation is UX, not security. Run its **Security Pass** before shipping security-relevant work.

## Project conventions

- **Design tokens** live in `src/app/globals.css` (Tailwind v4 `@theme` block; the old `tailwind.config.ts` is gone). Light values in `@theme`, dark re-points in the `.dark` block. Two-layer color model: **`fg-*`** (theme-aware text) vs **`ink*`** (fixed dark-navy, used as backgrounds) — see `DESIGN.md`. Also `surface`/`surface-raised`/`surface-solid`/`border-subtle` (theme-aware), `brand` (emerald 50–950), `accent` (amber, sparing). Don't hardcode hex or use arbitrary values (`text-[#…]`, `p-[13px]`) — add to `@theme`.
- **Fonts:** `font-sans` (Inter) and `font-display` (Sora), loaded via `next/font` in `layout.tsx`.
- **`cn()`** helper in `src/lib/utils.ts` is a simple class joiner (no `tailwind-merge` dedupe).
- **Motion:** shared `AnimatedReveal` / `StaggerGroup` / `StaggerItem` in `components/AnimatedReveal.tsx`; all motion honors `prefers-reduced-motion` via `useReducedMotion()`.
- Reusable UI primitives live in `src/components/` (`Button`, `Badge`, `Container`, `Section`, etc.); page sections in `src/components/sections/`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
