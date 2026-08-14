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
      "The site you're reading. A token-driven Tailwind design system with light/dark theming, WCAG 2.2 AA enforced by an automated axe-core suite, and a Lighthouse budget that fails the build when something regresses. Designed and built end to end.",
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
      "Most portfolios show the output of design work. This one is also the work itself. Every screen here is built from a documented token system, themed light and dark from a single source of truth, and held to WCAG 2.2 AA by tests that run before anything ships. If you want to know how I actually work, this is the clearest evidence I can offer: decisions written down, encoded as tokens, and checked by automation rather than by good intentions.",
    blocks: [
      {
        heading: "The problem with a two-layer color model",
        body: "Dark mode breaks in a predictable way: a color that reads as text in one theme is a background in the other. I hit this directly. The dark navy in this palette is both the light-mode text color and the dark-mode page background, so re-pointing it for dark mode inverted the whole page. The fix was to split the palette in two: an ink layer that never flips, used for backgrounds, and an fg layer that does, used only for text. One utility, text-fg-muted, now reads correctly in both themes with no per-component dark overrides. That single rule took out the biggest category of theme bugs in the codebase.",
      },
      {
        heading: "Tokens as the contract",
        body: "33 color tokens live in one CSS file, with light values in Tailwind v4's @theme block and dark re-points in a .dark block, across four layers: foreground text, fixed ink, theme-aware surfaces, and brand. Hardcoded hex and arbitrary values are banned; if a value doesn't exist yet, it becomes a token rather than a one-off. On top of that sit 20 primitives (Button, Badge, Container, Section, ProjectCard, the shared motion components), so building a new card means reaching for an existing recipe instead of writing fresh inline styles. The whole system is documented in a DESIGN.md that ships with the code and is versioned alongside it, so the rules can't quietly drift away from the implementation.",
      },
      {
        heading: "Accessibility as a build gate, not a review step",
        body: "An axe-core suite scans the site against WCAG 2.2 AA: the home page, representative case studies, the 404, and the contact form in its error state. A keyboard test asserts that submitting the form moves focus to the confirmation, so screen-reader and keyboard users aren't stranded on a button that no longer exists. Getting those scans trustworthy took real debugging. They kept flaking because axe was sampling contrast mid-animation, reading a badge at 3.2:1 that actually rests at 5.2:1. Emulating prefers-reduced-motion and freezing CSS transitions before the scan fixed it, so axe now judges settled colors. That work also turned up a genuine contrast failure: the brand green behind primary actions was too light against white, and stepping it one shade darker fixed it site-wide.",
      },
      {
        heading: "Holding the line",
        body: "A Lighthouse gate runs against a production build and exits non-zero if anything regresses past budget: accessibility and SEO must score 100, performance 90, best practices 95, with Core Web Vitals capped at LCP under 2.5s, CLS under 0.1, and TBT under 200ms. Playwright covers the user journeys, responsive behavior at three breakpoints, and SEO metadata. All motion honors prefers-reduced-motion through both a CSS media query and useReducedMotion() in JavaScript, because framer-motion animates via JS and ignores the CSS one.",
      },
      {
        heading: "Why this is the case study",
        body: "This is a small project and I won't pretend otherwise. There's no team, no stakeholders, no user research. What it does show is the part of the craft that's hardest to fake: a system whose rules survive contact with a real codebase, accessibility treated as a requirement instead of a cleanup pass, and decisions documented well enough that someone else could build against them. I approach product work the same way. The difference here is that the whole thing is open for inspection.",
      },
    ],
    gallery: 3,
    accent: 4,
  },
  {
    slug: "brand-identity-system",
    title: "Aperture — A Brand Identity From Scratch",
    summary:
      "A complete visual identity (logo, type, color, and usage guidelines) built to scale from a single app icon up to a full marketing site.",
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
      "A growing startup had a name and an idea but no visual language. I built the identity from the ground up: a flexible logo, a typographic system, a considered color palette, and a guidelines document the whole team could design against.",
    blocks: [
      {
        heading: "The brief",
        body: "The company needed an identity that felt modern and trustworthy without being generic. It also had to work at a 16px favicon, on a billboard, inside a dark-mode app, and in a printed deck, so flexibility mattered as much as the look itself.",
      },
      {
        heading: "Exploration",
        body: "I started with mood boards and dozens of logo sketches, narrowing to three directions before refining the strongest. Every mark was tested at small sizes and in monochrome to make sure it held up in the real world.",
      },
      {
        heading: "The system",
        body: "Beyond the logo, I defined a type scale, a primary and extended color palette with accessible contrast, iconography rules, and layout principles, then packaged it into a guidelines document clear enough to keep the brand consistent as the team grows.",
      },
      {
        heading: "Outcome",
        body: "The identity now spans the product, the marketing site, and social channels. With the system documented, the team ships on-brand work without needing a designer to sign off on every asset.",
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
      "A conversion-focused marketing site for a team-analytics startup, designed in Figma and shipped to production in React by one person.",
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
      "Northwind is a team-analytics tool whose homepage didn't look as sharp as the product, and didn't convert. It also couldn't afford to lose anything in a design-to-engineering handoff. I owned both sides: I designed the full page in Figma, then built it in React and Tailwind, so the live site matches the mockup pixel for pixel.",
    blocks: [
      {
        heading: "The brief",
        body: "Northwind had a strong product but a homepage that undersold it. The team wanted a fast, polished site that made the value obvious in one scroll and drove free-trial sign-ups, built on a stack they could maintain in-house afterward.",
      },
      {
        heading: "Design",
        body: "I designed the full page in Figma around a single conversion goal: a confident hero with a product preview, three scannable value props, real numbers as social proof, and one repeated call to action. The layout was planned mobile-first, so the responsive version was a first-class design, not an afterthought.",
      },
      {
        heading: "Build",
        body: "I built the site in React, TypeScript, and Tailwind CSS, with semantic markup, tuned images, and no layout shift. Designing and coding it myself meant the spacing, type, and motion survived intact from Figma to production instead of drifting during handoff.",
      },
      {
        heading: "Outcome",
        body: "The targets: a 98 Lighthouse performance score and free-trial sign-ups up 22% in the first quarter. One person carried it from a blank Figma file to a live, on-brand site, which is the argument for closing the design-dev gap in the first place.",
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
      "A clean, focused interface for an online learning experience, designed to keep students moving through lessons without friction.",
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
      "Online learning lives or dies on focus. This project reworked a course experience so students always knew where they were, what came next, and how far they had left to go, with the interface stepping back so the content could lead.",
    blocks: [
      {
        heading: "The problem",
        body: "Students were dropping off mid-course. The old layout buried progress, mixed navigation into the content, and made it easy to lose your place. Individually small frictions, but together they cost students their momentum.",
      },
      {
        heading: "Design goals",
        body: "Make the next action obvious on every screen, surface progress clearly, and reduce the visual noise around the lesson itself. Every decision was weighed against one question: does this help the student keep going?",
      },
      {
        heading: "The solution",
        body: "A calm lesson view with a persistent progress rail, a simplified course map, and consistent patterns for video, reading, and assessment, plus clear feedback each time a student finished a step.",
      },
      {
        heading: "Outcome",
        body: "The targets: lesson completion up 29%, and a noticeably shorter path through each course. The real measure of success was whether a student could sit down and keep going without the interface getting in the way.",
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
      "A rebuilt first-run experience that gets new users to a real first win in under two minutes.",
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
      "Fernweh is a trip-planning app with plenty of signups and weak activation. More explanation wasn't going to fix that; momentum was. I rebuilt onboarding around one real first action, saving your first trip, in under two minutes.",
    blocks: [
      {
        heading: "The problem",
        body: "New users faced a nine-step setup wizard (permissions, preferences, a profile) before they ever saw a destination. Most never reached the part the app is actually good at, and early churn was steep.",
      },
      {
        heading: "Strategy",
        body: "I mapped the shortest path to a genuine first win, one saved trip, and pulled everything else out of the way. Notifications and personalization moved to the point where they earn their place: after the user has something worth being notified about.",
      },
      {
        heading: "Craft",
        body: "Encouraging microcopy, a visible sense that you're almost there, and one job per step. The permission ask now arrives with a reason attached, rather than as a cold system dialog on launch.",
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
      "A token-driven component library that pulled a product back together across platforms and kept design and engineering in sync.",
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
      "Halyard's product had grown across three teams and two platforms. Spacing, color, and components had drifted apart, so every screen was a little different and every handoff turned into a negotiation. A shared, token-based system gave design and engineering one source of truth.",
    blocks: [
      {
        heading: "The challenge",
        body: "Teams kept rebuilding the basics, design and code drifted apart, and accessibility was an afterthought. The product looked like it was made by several different hands.",
      },
      {
        heading: "Tokens first",
        body: "I started with a semantic token layer for color, type, spacing, radius, and elevation, mapped one-to-one to code. That gave designers and engineers a shared vocabulary, and it made theming almost free.",
      },
      {
        heading: "Components & docs",
        body: "100+ accessible components with clear usage guidelines, paired with the front-end build so what designers saw in Figma matched what shipped in the browser.",
      },
      {
        heading: "Impact",
        body: "The goal: design-dev parity up 60%, feature velocity doubled, and accessibility built into every component instead of bolted on at review.",
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
      "A motion system for a brand launch: an animated logo, kinetic type, and a set of reusable transitions that gave a static identity a voice on screen.",
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
      "Cadence, a music-streaming service, had a strong static identity that fell flat the moment it hit video, social, and product. I designed a motion system covering how the logo builds, how type enters, and how scenes transition, so the brand felt as considered in motion as it did on the page.",
    blocks: [
      {
        heading: "The brief",
        body: "The identity was made for print and for screens that don't move. Launch content lived on video, reels, and product loops, and with nothing written down every animator improvised, so the brand moved differently every time it appeared.",
      },
      {
        heading: "Principles of motion",
        body: "I defined how the brand moves before animating a single frame: easing curves, timing, and a point of view on weight and momentum. The test was whether a logo reveal and a lower-third felt like they belonged to the same system.",
      },
      {
        heading: "The system",
        body: "An animated logo build, kinetic-type templates, and a library of scene transitions and presets, all delivered as editable After Effects files so the team could produce on-brand motion without pulling me into every clip.",
      },
      {
        heading: "Outcome",
        body: "The brand now enters, moves, and transitions the same way everywhere it plays. Launch content shipped faster, and the identity finally looked like it belonged on video rather than pasted onto it.",
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
