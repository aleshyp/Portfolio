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
    title: "This Site: A Design System, Shipped",
    summary:
      "The site you're reading. A token-driven Tailwind design system with light and dark theming, WCAG 2.2 AA checked by an axe-core suite, and a Lighthouse budget that fails the build when a score slips. Designed and built end to end.",
    blurb: "The design system behind this site, built and tested in public.",
    tags: ["Design System", "Front-End", "Accessibility"],
    role: "Designer & Front-End Developer",
    year: "2026",
    client: "Personal project",
    duration: "Ongoing",
    results: [
      { label: "Accessibility budget", value: "100" },
      { label: "Design tokens", value: "35" },
      { label: "WCAG 2.2 AA scans", value: "6" },
    ],
    overview:
      "A portfolio usually shows you the output of the work. This one is the work. Every screen is built from a documented token system, themed light and dark from one source of truth, and checked against WCAG 2.2 AA by tests that run before anything ships. It's the clearest evidence I can give you of how I actually work, mostly because you can go read the code and check.",
    blocks: [
      {
        heading: "The problem with a two-layer color model",
        body: "Dark mode breaks in a predictable way: a color that's text in one theme is a background in the other. I walked straight into it. The dark navy in this palette is both the light-mode text color and the dark-mode page background, so re-pointing it for dark mode inverted the entire page. The fix was to split the palette in two. An ink layer that never flips, for backgrounds, and an fg layer that does, for text only. One utility, text-fg-muted, now reads correctly in both themes with no per-component dark overrides. That one rule killed off most of the theme bugs I'd been chasing.",
      },
      {
        heading: "Tokens as the contract",
        body: "35 color tokens live in one CSS file, with light values in Tailwind v4's @theme block and dark re-points in a .dark block, across five layers: foreground text, fixed ink, theme-aware surfaces, brand, and a fixed on-dark set for panels that stay dark in both themes. Hardcoded hex and arbitrary values are banned. If a value doesn't exist yet it becomes a token, not a one-off. Above that sit the shared primitives: Button, Badge, Container, Section, ProjectCard, the motion components. Building a new card means reaching for a recipe that already exists instead of writing fresh inline styles. The rules live in a DESIGN.md that ships with the code and gets versioned with it, so they can't quietly drift out of sync with what's actually implemented.",
      },
      {
        heading: "Accessibility as a build gate, not a review step",
        body: "An axe-core suite scans the site against WCAG 2.2 AA: home page, representative case studies, the 404, and the contact form in its error state. A keyboard test checks that submitting the form moves focus to the confirmation, so keyboard and screen-reader users aren't stranded on a button that no longer exists. Getting those scans trustworthy took some digging. They kept flaking, and the reason was that axe was sampling contrast mid-animation. It read a badge at 3.2:1 that actually settles at 5.2:1. Emulating prefers-reduced-motion and freezing CSS transitions before the scan fixed it. Along the way the scans caught a real failure I'd missed by eye: the brand green behind primary buttons was too light against white. One shade darker fixed it site-wide.",
      },
      {
        heading: "Holding the line",
        body: "A Lighthouse gate runs against a production build and exits non-zero if anything drops below budget: accessibility and SEO at 100, performance 90, best practices 95, CLS under 0.1, TBT under 200ms. LCP needed a judgment call. Lighthouse reports about 3.0s, which fails the 2.5s target. But its LCP-element audit comes back empty, which is the tell that the number is simulated from 4x CPU throttling rather than actually observed. Measured with a PerformanceObserver against the same build, real LCP lands under 200ms on the hero h1. So the gate ratchets against the simulated figure, which still catches a genuine render-blocking regression, and I don't claim a 2.5s pass I haven't earned. Chasing that number did turn up a real bug: the h1 was animating from opacity 0, and LCP only records once text hits final opacity, so my own entrance fade was pushing the metric back. It now paints opaque and animates transform only. Playwright covers the user journeys, three breakpoints, and SEO metadata. Motion honors prefers-reduced-motion twice over, through a CSS media query and useReducedMotion() in JS, because framer-motion animates in JavaScript and ignores the CSS one.",
      },
      {
        heading: "Why this is the case study",
        body: "It's a small project and I won't pretend otherwise. No team, no stakeholders, no user research. But the rules held up against a real codebase, accessibility was a requirement rather than a cleanup pass, and the decisions are written down well enough that someone else could build against them. I work the same way on bigger things. The difference is that here you can open the repo and check.",
      },
    ],
    gallery: 3,
    accent: 4,
  },
  {
    slug: "brand-identity-system",
    title: "Aperture: A Brand Identity From Scratch",
    summary:
      "A full visual identity (logo, type, color, and usage rules) built to hold up everywhere from a favicon to a marketing site.",
    blurb: "A full visual identity, logo through guidelines.",
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
      "A startup with a name, an idea, and nothing to look at. I built the identity from nothing: a flexible logo, a type system, a color palette, and a guidelines doc the whole team could design against without asking me first.",
    blocks: [
      {
        heading: "The brief",
        body: "They wanted something modern and trustworthy that didn't look like every other startup. It also had to survive a 16px favicon, a billboard, a dark-mode app, and a printed deck, so how far it stretched mattered as much as how it looked.",
      },
      {
        heading: "Exploration",
        body: "Mood boards, then dozens of sketches, down to three directions, then one. I tested every mark small and in monochrome early, because that's where a logo usually falls apart and it's cheaper to find out in week one.",
      },
      {
        heading: "The system",
        body: "Past the logo: a type scale, a primary and extended palette with contrast that passes, iconography rules, and layout principles. All of it packaged into a guidelines document written to be used by people who aren't designers.",
      },
      {
        heading: "Outcome",
        body: "The identity runs across the product, the marketing site, and social. The part I care about: with the system written down, the team ships on-brand work without a designer signing off on every asset.",
      },
    ],
    gallery: 4,
    accent: 0,
    concept: true,
  },
  {
    slug: "marketing-landing-page",
    title: "Northwind: Marketing Site, Designed & Built",
    summary:
      "A marketing site for a team-analytics startup, built to convert. Designed in Figma and shipped to production in React by one person.",
    blurb: "A SaaS marketing site, designed and then built.",
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
      "Northwind is a team-analytics tool with a homepage that made the product look worse than it was, and didn't convert. There was also no engineering time to spare for a handoff. So I did both sides. Designed the page in Figma, then built it in React and Tailwind. The live site matches the mockup because the same person made both.",
    blocks: [
      {
        heading: "The brief",
        body: "Good product, homepage that undersold it. They wanted something fast and polished that got the point across in one scroll and drove free-trial sign-ups, on a stack their own team could maintain after I left.",
      },
      {
        heading: "Design",
        body: "I designed the page in Figma around one conversion goal: a hero with a real product preview, three value props you can skim, customer numbers as proof, and the same call to action repeated down the page. I laid out the mobile version first, so it's a design rather than a squeezed-down desktop.",
      },
      {
        heading: "Build",
        body: "React, TypeScript, and Tailwind, with semantic markup, properly sized images, and no layout shift. Because I built what I'd drawn, the spacing and type and motion made it to production intact, without the small compromises that pile up in a handoff.",
      },
      {
        heading: "Outcome",
        body: "The targets were a 98 Lighthouse performance score and free-trial sign-ups up 22% in the first quarter. Blank Figma file to live site, one person, no handoff meeting.",
      },
    ],
    gallery: 3,
    accent: 1,
    concept: true,
  },
  {
    slug: "learning-platform-ui",
    title: "Lumin: Online Learning Platform UI",
    summary:
      "An interface for an online course, designed around one goal: keep students moving through lessons instead of quitting halfway.",
    blurb: "A UI built to stop students dropping off.",
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
      "Students quit online courses when they lose the thread. This was a rework of a course experience so you always know where you are, what's next, and how much is left, and so the interface isn't competing with the lesson for your attention.",
    blocks: [
      {
        heading: "The problem",
        body: "Students were dropping off mid-course. The old layout hid progress, tangled navigation into the content, and made it easy to lose your place after a break. No single one of those is a big deal. Together they're enough to make someone not come back tomorrow.",
      },
      {
        heading: "Design goals",
        body: "Make the next action obvious on every screen, put progress somewhere you can't miss it, and quiet everything around the lesson. When I wasn't sure about a decision I asked whether it helped someone keep going, and cut it if it didn't.",
      },
      {
        heading: "The solution",
        body: "A quiet lesson view with a progress rail that's always there, a course map you can actually read, and the same patterns for video, reading, and assessment so nothing needs relearning. Plus a clear bit of feedback every time you finish a step, because finishing things is the whole motivation.",
      },
      {
        heading: "Outcome",
        body: "The targets were lesson completion up 29% and a shorter path through each course. What I'd actually want to know is whether someone can sit down after a week away and pick up where they left off without hunting for it.",
      },
    ],
    gallery: 4,
    accent: 2,
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
