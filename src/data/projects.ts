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
};

/**
 * PLACEHOLDER case studies.
 * These are realistic, recruiter-friendly stand-ins covering the range of work
 * Ian does — brand, web, product UI, design systems, and social. Swap the
 * copy for your real projects and add <Image /> assets when you're ready.
 *
 * This is the single source of truth for the Work grid and the detail pages.
 */
export const projects: Project[] = [
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
  },
  {
    slug: "marketing-landing-page",
    title: "Marketing Site — Designed & Built",
    summary:
      "A conversion-focused marketing site, designed in Figma and shipped to production in React — bridging the gap between design and front-end.",
    blurb: "A marketing site, designed in Figma and built in code.",
    tags: ["Web Design", "Front-End", "Branding"],
    role: "Designer & Front-End Developer",
    year: "2025",
    client: "Marketing site (placeholder)",
    duration: "5 weeks",
    results: [
      { label: "Lighthouse score", value: "98" },
      { label: "Sign-up conversion", value: "+22%" },
      { label: "Design-to-live", value: "1 person" },
    ],
    overview:
      "A site that needed to look sharp and convert — without a handoff gap between design and engineering. I designed it in Figma and built it myself in React and Tailwind, so the live page matches the mockup pixel for pixel.",
    blocks: [
      {
        heading: "The brief",
        body: "The team wanted a fast, polished marketing site that clearly communicated the product and drove sign-ups — built on a modern stack the team could maintain.",
      },
      {
        heading: "Design",
        body: "I designed the full page in Figma — a strong hero, clear value props, social proof, and a focused call to action — with a responsive layout planned from mobile up.",
      },
      {
        heading: "Build",
        body: "I built the site in React, TypeScript, and Tailwind CSS, with accessible markup and a strong focus on performance. Designing and coding it myself meant no detail got lost in handoff.",
      },
      {
        heading: "Outcome",
        body: "The site shipped with a 98 Lighthouse score and lifted sign-up conversion 22% — proof that good design and clean front-end work pay off together.",
      },
    ],
    gallery: 3,
    accent: 1,
  },
  {
    slug: "learning-platform-ui",
    title: "Online Learning Platform — Product UI",
    summary:
      "A clean, focused interface for an online learning experience — designed to keep students moving through lessons without friction.",
    blurb: "A focused UI for an online learning experience.",
    tags: ["UX/UI Design", "Web App", "EdTech"],
    role: "UX/UI Designer",
    year: "2024",
    client: "EdTech (placeholder)",
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
  },
  {
    slug: "mobile-app-onboarding",
    title: "Onboarding That Converts",
    summary:
      "A reimagined first-run experience that gets new users to their first meaningful win in under two minutes.",
    blurb: "A first-run experience built around the first win.",
    tags: ["UX/UI Design", "Mobile", "Conversion"],
    role: "Product Designer",
    year: "2024",
    client: "App (placeholder)",
    duration: "3 months",
    results: [
      { label: "Activation", value: "+31%" },
      { label: "Time to value", value: "1m 50s" },
      { label: "Day-7 retention", value: "+19%" },
    ],
    overview:
      "Plenty of signups, weak activation. The fix wasn't more explanation — it was momentum. We rebuilt onboarding to celebrate a real first action instead of walking through every feature.",
    blocks: [
      {
        heading: "The problem",
        body: "New users faced a long setup wizard before seeing any value. Many never reached the 'aha' moment, and early churn was steep.",
      },
      {
        heading: "Strategy",
        body: "I mapped the shortest path to a genuine first win and pulled everything else out of the critical path. Personalization moved later, where it actually earned its place.",
      },
      {
        heading: "Craft",
        body: "Encouraging microcopy, clean visuals, and a clear sense of 'you're almost there' kept users moving. Each step did exactly one thing — no more.",
      },
      {
        heading: "Outcome",
        body: "Activation rose 31% and day-7 retention climbed 19%, with the average user reaching their first win in under two minutes.",
      },
    ],
    gallery: 3,
    accent: 3,
  },
  {
    slug: "design-system",
    title: "A Design System That Scales",
    summary:
      "A token-driven component library that unified a product across platforms and kept design and engineering in sync.",
    blurb: "A token-driven design system, built to scale.",
    tags: ["Design System", "UI Design", "Front-End"],
    role: "Design Systems Lead",
    year: "2023",
    client: "Product team (placeholder)",
    duration: "5 months",
    results: [
      { label: "Design-dev parity", value: "+60%" },
      { label: "Ship velocity", value: "+2×" },
      { label: "Components", value: "100+" },
    ],
    overview:
      "Inconsistent spacing, color, and components meant every screen was a little different and every handoff was a negotiation. A shared, token-based system gave design and engineering one source of truth.",
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
        body: "Design-dev parity improved 60%, feature velocity doubled, and accessibility became built-in rather than bolted on.",
      },
    ],
    gallery: 4,
    accent: 4,
  },
  {
    slug: "esports-social-branding",
    title: "Esports Social Media & Brand Kit",
    summary:
      "Matchday graphics, player announcements, and a social template kit for an esports organization — built for a fast, consistent posting cadence.",
    blurb: "Social graphics & brand kit for an esports org.",
    tags: ["Graphic Design", "Social Media", "Branding"],
    role: "Creative Director / Designer",
    year: "2023",
    client: "Esports org (placeholder)",
    duration: "Ongoing",
    results: [
      { label: "Templates built", value: "20+" },
      { label: "Turnaround", value: "Same-day" },
      { label: "Platforms", value: "X · IG · YT" },
    ],
    overview:
      "Esports moves fast, and the brand has to keep up. This is the kind of high-volume social work I cut my teeth on — a flexible template system that keeps an organization looking sharp across every announcement, matchday, and roster change.",
    blocks: [
      {
        heading: "The need",
        body: "Esports orgs post constantly — lineups, scores, signings, hype. Doing each one from scratch isn't sustainable, and inconsistency makes a team look smaller than it is.",
      },
      {
        heading: "A system, not one-offs",
        body: "I built a kit of modular templates — matchday, win/loss, player reveal, schedule — all sharing a consistent visual language so anything posted instantly reads as the brand.",
      },
      {
        heading: "Built for speed",
        body: "Templates were organized so graphics could go out same-day, even during live events, without sacrificing polish. This is where I learned to design fast and consistently under real deadlines.",
      },
      {
        heading: "Outcome",
        body: "A recognizable, cohesive social presence that scaled with the org — and a workflow the team could run without rebuilding the wheel for every post.",
      },
    ],
    gallery: 4,
    accent: 5,
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
