# Portfolio — UX/UI Designer

A clean, crisp portfolio site with an emerald-green & white theme and subtle,
tasteful animations. Built with **Next.js 16 (App Router, Turbopack)**,
**Tailwind CSS 4**, **TypeScript**, **Framer Motion**, **next-themes**, and
**lucide-react** icons.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
npm run test:e2e # Playwright suite (e2e/) — boots a dev server if none is up
npm run test:lh  # Lighthouse budget gate (needs a production build served first)
```

### Environment

Both variables are optional; the site builds and runs without them.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, OG tags, sitemap and robots. Defaults to `https://ianriley.co` (`src/data/site.ts`). Set it per-environment to stop preview deploys claiming the production URL. |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Web3Forms access key for the contact form. Unset, the form runs a local demo path instead of sending. |

Put them in `.env.local` for development. Both are `NEXT_PUBLIC_*`, so they are
embedded in the client bundle — neither is a secret, and nothing secret should
be added alongside them.

## Making it yours

The content is real, not placeholder. To make the site your own, these are the
files to edit:

| What | Where |
| --- | --- |
| Your name, role, email, location, socials | `src/data/site.ts` |
| Projects / case studies | `src/data/projects.ts` |
| SEO / page metadata | `src/app/layout.tsx` (`metadata`) |
| Brand colors & design tokens | `src/app/globals.css` (Tailwind v4 `@theme` block — see `DESIGN.md`) |
| Fonts | `src/app/layout.tsx` (Inter + Sora) |
| Favicon | `src/app/icon.svg` |

### Images

Case-study visuals live in `public/work/<slug>/` and are wired up per study in
`src/data/projects.ts`. `<Placeholder />` (`src/components/Placeholder.tsx`) is
a gradient stand-in that only renders as a fallback for a study added without
assets — it is not the default any more.

To add a new study's images, drop them into `public/work/<slug>/` and reference
them from that study's entry in `src/data/projects.ts`. Use Next's `<Image />`
with explicit `width`/`height` so the layout doesn't shift:

```tsx
import Image from "next/image";

<Image
  src="/work/northwind/01-hero.webp"
  alt="Northwind banking app home screen"
  width={1280}
  height={800}
  className="aspect-[16/10] w-full rounded-4xl object-cover"
/>
```

### Contact form

`src/components/sections/Contact.tsx` submits to
[Web3Forms](https://web3forms.com). Set `NEXT_PUBLIC_WEB3FORMS_KEY` and it
sends for real; leave it unset and the form runs a local demo path that shows
the confirmation without sending anything, so the site still works out of the
box.

Client-side `validate()` is UX only — Web3Forms revalidates server-side and
handles spam and delivery. A hidden `botcheck` honeypot field is dropped
server-side and short-circuited locally.

## Structure

```
src/
  app/
    layout.tsx            # fonts, metadata, Navbar + Footer shell
    page.tsx              # home page (assembles sections)
    work/[slug]/page.tsx  # case-study detail template
    not-found.tsx         # 404 page
    opengraph-image.tsx   # generated OG image (also per-study)
    robots.ts             # robots.txt
    sitemap.ts            # sitemap.xml
    icon.svg              # favicon
    globals.css           # design tokens (@theme) + base styles
  components/
    AnimatedReveal.tsx    # shared scroll-reveal motion (respects reduced motion)
    Navbar.tsx, Footer.tsx, ThemeProvider.tsx, ThemeToggle.tsx
    Container.tsx, Section.tsx, Button.tsx, IconButton.tsx, Badge.tsx,
      Pill.tsx, Card.tsx, Field.tsx, Prose.tsx, Placeholder.tsx
    ProjectCard.tsx, CaseStudyCta.tsx, WideScene.tsx
    *Asset.tsx, *Hero.tsx  # per-study hand-built SVG scenes
    projectAssets.tsx     # maps a study slug to its scene set
    sections/             # Hero, About, Projects, Experience, Skills, Contact
  data/
    site.ts               # personal details, siteUrl, experience, skills
    projects.ts           # case-study content
  lib/
    utils.ts              # cn() className helper
    useActiveSection.ts   # nav scroll-spy
    usePlayOnceInView.ts  # one-shot scene playback
    useStableReducedMotion.ts
e2e/                      # Playwright specs (smoke, a11y, seo, responsive x2)
scripts/                  # lh-gate.mjs + issue/pr/land git helpers
```

Design tokens and the light/dark rules are documented in `DESIGN.md`.

## Accessibility & motion

- All animations respect `prefers-reduced-motion`.
- Semantic landmarks, skip-to-content link, visible focus rings, and labelled
  controls are built in.

## Deploy

The easiest path is [Vercel](https://vercel.com): push to GitHub and import the
repo, or run `npx vercel`. It works out of the box with zero config.

Set `NEXT_PUBLIC_SITE_URL` to the deployment's own origin for preview
environments, so previews don't emit canonical URLs and OG tags pointing at
production. Add `NEXT_PUBLIC_WEB3FORMS_KEY` if the contact form should send.
