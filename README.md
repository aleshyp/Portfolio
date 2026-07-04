# Portfolio — UX/UI Designer

A clean, crisp portfolio site with an emerald-green & white theme and subtle,
tasteful animations. Built with **Next.js (App Router)**, **Tailwind CSS**,
**Framer Motion**, and **lucide-react** icons.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Making it yours

Everything is placeholder content — swap it out:

| What | Where |
| --- | --- |
| Your name, role, email, location, socials | `src/data/site.ts` |
| Projects / case studies | `src/data/projects.ts` |
| SEO / page metadata | `src/app/layout.tsx` (`metadata`) |
| Brand colors | `tailwind.config.ts` (`colors.brand`) |
| Fonts | `src/app/layout.tsx` (Inter + Sora) |
| Favicon | `src/app/icon.svg` |

### Swapping placeholder images for real ones

All visuals currently use `<Placeholder />` (`src/components/Placeholder.tsx`),
a gradient stand-in. To use real screenshots:

1. Drop images into `public/` (e.g. `public/work/northwind-cover.png`).
2. Replace `<Placeholder ... />` with Next's `<Image />`:

   ```tsx
   import Image from "next/image";

   <Image
     src="/work/northwind-cover.png"
     alt="Northwind banking app home screen"
     width={1280}
     height={800}
     className="aspect-[16/10] w-full rounded-4xl object-cover"
   />
   ```

   The main spots are `ProjectCard.tsx`, `sections/About.tsx`, and
   `app/work/[slug]/page.tsx`.

### Contact form

The contact form (`src/components/sections/Contact.tsx`) is a **demo** — it
doesn't send anything. Wire `handleSubmit` to a form backend (Formspree,
Resend, a Next.js route handler, etc.) when you're ready.

## Structure

```
src/
  app/
    layout.tsx            # fonts, metadata, Navbar + Footer shell
    page.tsx              # home page (assembles sections)
    work/[slug]/page.tsx  # case-study detail template
    not-found.tsx         # 404 page
    icon.svg              # favicon
    globals.css           # theme + base styles
  components/
    AnimatedReveal.tsx    # shared scroll-reveal motion (respects reduced motion)
    Navbar.tsx, Footer.tsx
    Container.tsx, Section.tsx, Button.tsx, Badge.tsx, Placeholder.tsx
    ProjectCard.tsx
    sections/             # Hero, About, Projects, Skills, Contact
  data/
    site.ts               # personal details
    projects.ts           # case-study content
  lib/utils.ts            # cn() className helper
```

## Accessibility & motion

- All animations respect `prefers-reduced-motion`.
- Semantic landmarks, skip-to-content link, visible focus rings, and labelled
  controls are built in.

## Deploy

The easiest path is [Vercel](https://vercel.com): push to GitHub and import the
repo, or run `npx vercel`. It works out of the box with zero config.
