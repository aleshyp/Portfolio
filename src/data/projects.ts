export type ContentBlock = {
  heading: string;
  body: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  /** Short one-liner used on cards. */
  blurb: string;
  tags: string[];
  role: string;
  year: string;
  client: string;
  duration: string;
  /** Three quick outcome stats shown on the case study. */
  results: { label: string; value: string }[];
  overview: string;
  blocks: ContentBlock[];
  /** Number of gallery placeholders to render. */
  gallery: number;
  accent: number; // seed for placeholder gradients
  /**
   * True when the client and its metrics are invented rather than measured.
   * Drives the visible "Concept project" badge on the card and case study, so a
   * reader is never left to assume the numbers are a real track record. Drop the
   * flag (and swap in the real figures) if a study is ever backed by real work.
   */
  concept?: boolean;
};

/**
 * Case studies — the single source of truth for the Work grid and detail pages.
 *
 * The first study ("This Site") is REAL: it documents this codebase, and every
 * figure in it is verifiable from the repo (token count in globals.css, budgets
 * in scripts/lh-gate.mjs, scans in e2e/a11y.spec.ts). It carries no `concept`
 * flag. If you change the system, update the study — it makes falsifiable claims.
 *
 * Every OTHER study is CONCEPT work: the clients are invented and the metrics are
 * illustrative targets, not measured outcomes. Each carries `concept: true`,
 * which renders a visible badge — that label is the honest signal a reader needs,
 * so don't remove it without replacing the invented numbers with real ones.
 *
 * The range is deliberate — brand, web, product UI, design systems, and motion.
 */
export const projects: Project[] = [
  {
    slug: "portfolio-design-system",
    title: "This Site — A Design System, Shipped",
    summary:
      "The site you're reading. A token-driven Tailwind design system with light/dark theming, WCAG 2.2 AA enforced by an automated axe-core suite, and a Lighthouse budget that fails the build on regression — designed and built end to end.",
    blurb: "The design system behind this site — designed, built, and tested.",
    tags: ["Design System", "Front-End", "Accessibility"],
    role: "Designer & Front-End Developer",
    year: "2026",
    client: "Personal project",
    duration: "Ongoing",
    results: [
      { label: "Accessibility budget", value: "100" },
      { label: "Design tokens", value: "33" },
      { label: "Design → live", value: "1 person" },
    ],
    overview:
      "Most portfolios show the output of design work. This one is the work. Every screen here is built from a documented token system, themed light and dark from a single source of truth, and held to WCAG 2.2 AA by tests that run before anything ships. It's the clearest evidence I can give of how I actually work: design decisions written down, encoded as tokens, and enforced by automation instead of good intentions.",
    blocks: [
      {
        heading: "The problem with a two-layer color model",
        body: "Dark mode breaks in a predictable way: a color that reads as text in one theme is a background in the other. I hit this directly — the dark navy in this palette is both the light-mode text color and the dark-mode page background, so re-pointing it for dark mode inverted the page. The fix was to split the palette in two: an `ink` layer that never flips (used for backgrounds) and an `fg` layer that does (used only for text). One utility, `text-fg-muted`, now reads correctly in both themes with no per-component dark overrides. That single rule eliminated the largest category of theme bugs in the codebase.",
      },
      {
        heading: "Tokens as the contract",
        body: "33 color tokens live in one CSS file — light values in Tailwind v4's `@theme` block, dark re-points in a `.dark` block — across four layers: foreground text, fixed ink, theme-aware surfaces, and brand. Hardcoded hex and arbitrary values are banned; if a value doesn't exist, it becomes a token rather than a one-off. On top of that sit 20 primitives — Button, Badge, Container, Section, ProjectCard, the shared motion components — so a new card is an existing recipe, not fresh inline styles. The whole system is documented in a DESIGN.md that ships with the code and is versioned alongside it, which means the rules can't silently drift from the implementation.",
      },
      {
        heading: "Accessibility as a build gate, not a review step",
        body: "An axe-core suite scans every route against WCAG 2.2 AA — home, all six case studies, the 404, and the contact form in its error state — plus a keyboard test asserting that submitting the form moves focus to the confirmation, so screen-reader and keyboard users aren't stranded on a button that no longer exists. Getting those scans trustworthy took real debugging: they flaked because axe was sampling contrast mid-animation, reading a badge at 3.2:1 that actually rests at 5.2:1. The fix was to emulate `prefers-reduced-motion` and freeze CSS transitions before scanning, so axe judges settled colors. That work also surfaced a genuine contrast failure — the brand green used for primary actions was too light against white, and moving it a step darker fixed it site-wide.",
      },
      {
        heading: "Holding the line",
        body: "A Lighthouse gate runs against a production build and exits non-zero if anything regresses past budget: accessibility and SEO must score 100, performance 90, best practices 95, with Core Web Vitals capped at LCP under 2.5s, CLS under 0.1, and TBT under 200ms. Playwright covers the user journeys, responsive behavior at three breakpoints, and SEO metadata. All motion honors `prefers-reduced-motion` through both a CSS media query and `useReducedMotion()` in JavaScript, because framer-motion animates via JS and ignores the CSS one.",
      },
      {
        heading: "Why this is the case study",
        body: "This is a small project, and I'm not claiming otherwise — there's no team, no stakeholders, no user research. What it does show is the part of the craft that's hardest to fake: a system with rules that survive contact with a real codebase, accessibility treated as a requirement rather than a cleanup pass, and design decisions documented well enough that someone else could build against them. It's the same way I approach product work; here the whole thing happens to be open for inspection.",
      },
    ],
    gallery: 0,
    accent: 4,
  },
  {
    slug: "brand-identity-system",
    title: "Aperture — A Brand Identity From Scratch",
    summary:
      "A complete visual identity — logo, type, color, and usage guidelines — built to scale from a single app icon to a full marketing site.",
    blurb: "A full visual identity system, logo to guidelines.",
    tags: ["Brand Identity", "Logo Design", "Graphic Design"],
    role: "Lead Designer",
    year: "2025",
    client: "Aperture",
    duration: "6 weeks",
    results: [
      { label: "Brand assets delivered", value: "40+" },
      { label: "Logo concepts explored", value: "12" },
      { label: "Guideline pages", value: "28" },
    ],
    overview:
      "A growing startup had a name and an idea but no visual language. I built an identity from the ground up — a flexible logo, a typographic system, a considered color palette, and a guidelines document the whole team could design against.",
    blocks: [
      {
        heading: "The brief",
        body: "The company needed an identity that felt modern and trustworthy without being generic. It had to work everywhere — a 16px favicon, a billboard, a dark-mode app, and a printed deck — so flexibility was as important as the look itself.",
      },
      {
        heading: "Exploration",
        body: "I started with mood boards and dozens of logo sketches, narrowing to three directions before refining the strongest. Every mark was tested at small sizes and in monochrome to make sure it held up in the real world.",
      },
      {
        heading: "The system",
        body: "Beyond the logo, I defined a type scale, a primary and extended color palette with accessible contrast, iconography rules, and layout principles — then packaged it all into a clear guidelines document so the brand stays consistent as the team grows.",
      },
      {
        heading: "Outcome",
        body: "The identity now spans the product, marketing site, and social channels. With a documented system in place, the team ships on-brand work without a designer in the loop for every asset.",
      },
    ],
    gallery: 4,
    accent: 0,
    concept: true,
  },
  {
    slug: "marketing-landing-page",
    title: "Northwind — Marketing Site, Designed & Built",
    summary:
      "A conversion-focused marketing site for a team-analytics startup — designed in Figma and shipped to production in React, closing the gap between design and front-end.",
    blurb: "A SaaS marketing site, designed in Figma and built in code.",
    tags: ["Web Design", "Front-End", "Branding"],
    role: "Designer & Front-End Developer",
    year: "2025",
    client: "Northwind (analytics SaaS)",
    duration: "5 weeks",
    results: [
      { label: "Lighthouse performance", value: "98" },
      { label: "Sign-up conversion", value: "+22%" },
      { label: "Design → live", value: "1 person" },
    ],
    overview:
      "Northwind is a team-analytics tool that needed a homepage to look as sharp as the product — and actually convert — without losing anything in a design-to-engineering handoff. I owned both sides: designed the full page in Figma, then built it in React and Tailwind so the live site matches the mockup pixel for pixel.",
    blocks: [
      {
        heading: "The brief",
        body: "Northwind had a strong product but a homepage that undersold it. The team wanted a fast, polished site that made the value obvious in one scroll and drove free-trial sign-ups — built on a modern stack they could maintain in-house afterward.",
      },
      {
        heading: "Design",
        body: "I designed the full page in Figma around a single conversion goal: a confident hero with a product preview, three scannable value props, real numbers as social proof, and one repeated call to action. The layout was planned mobile-first, so the responsive version was a first-class design, not an afterthought.",
      },
      {
        heading: "Build",
        body: "I built the site in React, TypeScript, and Tailwind CSS — semantic, accessible markup, tuned images, and no layout shift. Designing and coding it myself meant spacing, type, and motion survived intact from Figma to production instead of drifting in handoff.",
      },
      {
        heading: "Outcome",
        body: "The site shipped with a 98 Lighthouse performance score and lifted free-trial sign-ups 22% in the first quarter. One person carried it from blank Figma file to live, on-brand site — proof that closing the design-dev gap pays off.",
      },
    ],
    gallery: 3,
    accent: 1,
    concept: true,
  },
  {
    slug: "learning-platform-ui",
    title: "Lumin — Online Learning Platform UI",
    summary:
      "A clean, focused interface for an online learning experience — designed to keep students moving through lessons without friction.",
    blurb: "A focused UI for an online learning experience.",
    tags: ["UX/UI Design", "Web App", "EdTech"],
    role: "UX/UI Designer",
    year: "2024",
    client: "Lumin (online learning)",
    duration: "4 months",
    results: [
      { label: "Lesson completion", value: "+29%" },
      { label: "Navigation steps", value: "−40%" },
      { label: "Usability score", value: "84 SUS" },
    ],
    overview:
      "Online learning lives or dies on focus. This project reworked a course experience so students always knew where they were, what was next, and how far they had to go — with the interface stepping back so the content could lead.",
    blocks: [
      {
        heading: "The problem",
        body: "Students were dropping off mid-course. The old layout buried progress, mixed navigation with content, and made it easy to lose your place — small frictions that added up to lost momentum.",
      },
      {
        heading: "Design goals",
        body: "Make the next action obvious on every screen, surface progress clearly, and reduce the visual noise around the lesson itself. Every decision was weighed against one question: does this help the student keep going?",
      },
      {
        heading: "The solution",
        body: "A calm lesson view with a persistent progress rail, a simplified course map, and consistent patterns for video, reading, and assessment — with clear, rewarding feedback as students completed each step.",
      },
      {
        heading: "Outcome",
        body: "Lesson completion rose 29% and the path through a course got noticeably shorter. Students described the experience as 'easy to stick with' — exactly the goal.",
      },
    ],
    gallery: 4,
    accent: 2,
    concept: true,
  },
  {
    slug: "mobile-app-onboarding",
    title: "Fernweh — Onboarding That Converts",
    summary:
      "A reimagined first-run experience that gets new users to their first meaningful win in under two minutes.",
    blurb: "A first-run experience built around the first win.",
    tags: ["UX/UI Design", "Mobile", "Conversion"],
    role: "Product Designer",
    year: "2024",
    client: "Fernweh (travel planning)",
    duration: "3 months",
    results: [
      { label: "Activation", value: "+31%" },
      { label: "Time to value", value: "1m 50s" },
      { label: "Day-7 retention", value: "+19%" },
    ],
    overview:
      "Fernweh is a trip-planning app with plenty of signups and weak activation. The fix wasn't more explanation — it was momentum. Onboarding was rebuilt around one real first action: saving your first trip, in under two minutes.",
    blocks: [
      {
        heading: "The problem",
        body: "New users faced a nine-step setup wizard — permissions, preferences, a profile — before they ever saw a destination. Most never reached the moment the app is actually good at, and early churn was steep.",
      },
      {
        heading: "Strategy",
        body: "I mapped the shortest path to a genuine first win — one saved trip — and pulled everything else out of the critical path. Notifications and personalization moved to the moment they earn their place: after the user has something worth being notified about.",
      },
      {
        heading: "Craft",
        body: "Encouraging microcopy, a visible sense of 'you're almost there', and one job per step. The permission ask now arrives with a reason attached instead of a cold system dialog on launch.",
      },
      {
        heading: "Outcome",
        body: "The target: activation up 31% and day-7 retention up 19%, with the average user saving their first trip in under two minutes.",
      },
    ],
    gallery: 3,
    accent: 3,
    concept: true,
  },
  {
    slug: "design-system",
    title: "Halyard — A Design System That Scales",
    summary:
      "A token-driven component library that unified a product across platforms and kept design and engineering in sync.",
    blurb: "A token-driven design system, built to scale.",
    tags: ["Design System", "UI Design", "Front-End"],
    role: "Design Systems Lead",
    year: "2023",
    client: "Halyard (fintech platform)",
    duration: "5 months",
    results: [
      { label: "Design-dev parity", value: "+60%" },
      { label: "Ship velocity", value: "+2×" },
      { label: "Components", value: "100+" },
    ],
    overview:
      "Halyard's product had grown across three teams and two platforms. Inconsistent spacing, color, and components meant every screen was a little different and every handoff was a negotiation. A shared, token-based system gave design and engineering one source of truth.",
    blocks: [
      {
        heading: "The challenge",
        body: "Teams kept rebuilding the basics, design and code drifted apart, and accessibility was an afterthought. The product looked like it was made by several different hands.",
      },
      {
        heading: "Tokens first",
        body: "I started with a semantic token layer — color, type, spacing, radius, elevation — mapped one-to-one to code. That gave designers and engineers a shared vocabulary and made theming trivial.",
      },
      {
        heading: "Components & docs",
        body: "100+ accessible components with clear usage guidelines, paired with the front-end build so what designers saw in Figma matched what shipped in the browser.",
      },
      {
        heading: "Impact",
        body: "The goal: design-dev parity up 60%, feature velocity doubled, and accessibility built into every component rather than bolted on at review.",
      },
    ],
    gallery: 4,
    accent: 4,
    concept: true,
  },
  {
    slug: "motion-brand-identity",
    title: "Cadence — Brand in Motion",
    summary:
      "A motion system for a brand launch — an animated logo, kinetic type, and a set of reusable transitions that gave a static identity a living, on-screen voice.",
    blurb: "An animated identity system for a brand launch.",
    tags: ["Motion Design", "Animation", "Branding"],
    role: "Motion Designer",
    year: "2023",
    client: "Cadence (music streaming)",
    duration: "7 weeks",
    results: [
      { label: "Motion assets delivered", value: "24" },
      { label: "Avg. render length", value: "6s" },
      { label: "Reusable presets", value: "10+" },
    ],
    overview:
      "Cadence, a music-streaming service, had a strong static identity that fell flat the moment it hit video, social, and product. I designed a motion system — how the logo builds, how type enters, how scenes transition — so the brand felt just as considered in motion as it did on the page.",
    blocks: [
      {
        heading: "The brief",
        body: "The identity was made for print and screens that don't move. But launch content lived on video, reels, and product loops, and every animator improvised — so the brand moved differently every time it appeared.",
      },
      {
        heading: "Principles of motion",
        body: "I defined how the brand moves before animating a single frame: easing curves, timing, and a point of view on weight and momentum — so a logo reveal and a lower-third feel like they belong to the same system.",
      },
      {
        heading: "The system",
        body: "An animated logo build, kinetic-type templates, and a library of scene transitions and presets, delivered as editable After Effects files so the team could produce on-brand motion without me in the loop for every clip.",
      },
      {
        heading: "Outcome",
        body: "The brand now enters, moves, and transitions the same way everywhere it plays. Launch content shipped faster, and the identity finally felt alive instead of pasted onto video.",
      },
    ],
    gallery: 4,
    accent: 5,
    concept: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Returns the next project in the list (wraps around) for case-study footers. */
export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}
