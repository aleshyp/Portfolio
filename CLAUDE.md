# Portfolio

Personal portfolio site. Next.js 14 (App Router) · Tailwind CSS 3.4 · TypeScript · Framer Motion · next-themes · lucide-react.

## Design & UI work

Before building, reviewing, or refining any UI in this project, use the **`design-guidelines`** skill (invoke `/design-guidelines` or reference it). It's the source of truth for layout/spacing, color, typography, components & interaction states, accessibility (WCAG 2.2 AA), responsive design, motion, performance (Core Web Vitals), and Tailwind conventions — tuned to this stack.

Run its **Review Pass** before considering UI work done.

## Testing

Before writing, running, or reviewing tests, use the **`test-suite`** skill (`/test-suite`). It covers E2E user journeys (Playwright), accessibility (axe-core), performance/SEO (Lighthouse), and visual/responsive checks, grounded in this project's real routes and tokens. Run its **Test Pass** before calling a feature done.

## Security

Before adding user input (forms, params), wiring a backend/API route, handling external links or third-party scripts, configuring headers/CSP, or touching dependencies/secrets, use the **`security-guidelines`** skill (`/security-guidelines`). It's grounded in OWASP Top 10 (2025) and the Next.js security model, tuned to this statically-rendered site. Key standing rules: never use `dangerouslySetInnerHTML`; every `target="_blank"` needs `rel="noopener noreferrer"`; nothing secret goes in `NEXT_PUBLIC_*` or client code; client-side validation is UX, not security. Run its **Security Pass** before shipping security-relevant work.

## Project conventions

- **Design tokens** live in `tailwind.config.ts`: `brand` (emerald 50–950), `ink` (DEFAULT/soft/muted/faint), `accent` (amber). Use these tokens — don't hardcode hex or use arbitrary values (`text-[#…]`, `p-[13px]`). Add to the theme instead.
- **Fonts:** `font-sans` (Inter) and `font-display` (Sora), loaded via `next/font` in `layout.tsx`.
- **`cn()`** helper in `src/lib/utils.ts` is a simple class joiner (no `tailwind-merge` dedupe).
- **Motion:** shared `AnimatedReveal` / `StaggerGroup` / `StaggerItem` in `components/AnimatedReveal.tsx`; all motion honors `prefers-reduced-motion` via `useReducedMotion()`.
- Reusable UI primitives live in `src/components/` (`Button`, `Badge`, `Container`, `Section`, etc.); page sections in `src/components/sections/`.
