# Portfolio — Ian Riley, Multidisciplinary Designer

A clean, crisp portfolio site with an emerald-green & white theme, full light/dark
theming, and subtle, tasteful animations. Built with **Next.js 16** (App Router,
Turbopack), **Tailwind CSS 4** (CSS-first `@theme`), **TypeScript**, **Framer
Motion**, **next-themes**, and **lucide-react**.

Statically rendered end to end — every route is prerendered at build time.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Where things live

| What | Where |
| --- | --- |
| Name, role, email, location, socials | `src/data/site.ts` |
| Projects / case studies | `src/data/projects.ts` |
| Résumé / work history, education | `src/data/site.ts` (`experience`, `education`) |
| SEO / page metadata | `src/app/layout.tsx` (`metadata`); case studies use `generateMetadata` |
| Design tokens (brand colors, surfaces, text) | `src/app/globals.css` — Tailwind v4 `@theme` block |
| Fonts | `src/app/layout.tsx` (Inter + Sora, via `next/font`) |
| Favicon | `src/app/icon.svg` |

Tokens are **CSS-first**: there is no `tailwind.config.ts`. Light values sit in
`@theme`, dark re-points in the `.dark` block below it. Don't hardcode hex or use
arbitrary values (`text-[#…]`) — add a token instead. The two-layer color model
(`fg-*` for theme-aware text, `ink*` for fixed dark-navy backgrounds) is the rule
that prevents the most dark-mode bugs; [`DESIGN.md`](DESIGN.md) has the full
reference.

### Case-study imagery

Studies with real assets (Aperture, Northwind) render them from
`src/components/projectAssets.tsx`. Anything without assets falls back to
`<Placeholder />` (`src/components/Placeholder.tsx`), a gradient stand-in — so a
new study renders cleanly before its visuals exist. To add real images, drop them
into `public/work/<slug>/` and wire them up in `projectAssets.tsx`.

### Contact form

The form in `src/components/sections/Contact.tsx` posts to
[Web3Forms](https://web3forms.com). It needs `NEXT_PUBLIC_WEB3FORMS_KEY` set (see
[`.env.example`](.env.example)); **without a key it runs in demo mode** — the
submit succeeds visually, no message is sent, and the UI says so. Set the key in
`.env.local` for development and in your host's environment for production.

## Structure

```
src/
  app/
    layout.tsx            # fonts, metadata, Navbar + Footer shell
    page.tsx              # home page (assembles sections)
    work/[slug]/page.tsx  # case-study detail template
    not-found.tsx         # 404 page
    robots.ts, sitemap.ts # generated from src/data/projects.ts
    opengraph-image.tsx   # generated OG images (home + per case study)
    icon.svg              # favicon
    globals.css           # design tokens (@theme + .dark) + base styles
  components/
    AnimatedReveal.tsx    # shared scroll-reveal motion (respects reduced motion)
    Navbar.tsx, Footer.tsx, ThemeToggle.tsx
    Container.tsx, Section.tsx, Button.tsx, Badge.tsx, Card.tsx, Field.tsx …
    ProjectCard.tsx, projectAssets.tsx   # case-study cards + real imagery
    sections/             # Hero, Projects, About, Experience, Skills, Contact
  data/
    site.ts               # personal details, experience, education
    projects.ts           # case-study content
  lib/
    utils.ts                   # cn() className helper
    useStableReducedMotion.ts  # hydration-safe prefers-reduced-motion
```

## Testing

```bash
npm run test:e2e    # Playwright: smoke, responsive, SEO, a11y (desktop + mobile)
npm run test:a11y   # axe-core WCAG 2.2 AA scans only
npm run test:lh     # Lighthouse budget — needs a production server on :3000
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck, build, the full e2e suite,
the Lighthouse budget, and a production-dependency `npm audit` on every PR, plus
a weekly audit for newly-published advisories.

## Accessibility & motion

- All animations respect `prefers-reduced-motion`.
- Semantic landmarks, skip-to-content link, visible focus rings, and labelled
  controls are built in.
- WCAG 2.2 AA is enforced by axe-core scans in CI, not left to review.

## Deploy

The easiest path is [Vercel](https://vercel.com): push to GitHub and import the
repo, or run `npx vercel`. It builds with zero config.

Set two environment variables in your host before going live:

| Variable | Why it matters |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Origin for every canonical URL, the sitemap, and all OG/Twitter tags. Defaults to `https://ianriley.com` — if that isn't the live domain, the deployed site advertises canonicals that don't resolve. |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Without it the contact form runs in demo mode and no message is delivered. |

Both are `NEXT_PUBLIC_*` and ship to the browser, which is correct here — neither
is a secret (the Web3Forms key only permits sending to your mailbox). Never put an
actual secret behind that prefix.

## Development workflow

Changes go **issue → branch → PR → squash-merge**, automated by `npm run issue`,
`npm run pr`, and `npm run land`. See [`WORKFLOW.md`](WORKFLOW.md).
