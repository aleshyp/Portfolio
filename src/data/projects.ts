export type ContentBlock = {
  heading: string;
  body: string;
}; export type Project = {
  slug: string;
  title: string;
  summary: string;
  /** Short one-liner used on cards. */
  blurb: string;
  tags: string[];
  role: string;
  /**
   * What I personally did, as a plain list — rendered as "What I did" on the
   * case study. A reader shouldn't have to infer my part from the prose.
   *
   * Every item has to be literally true, including how a tool was used: if a
   * layout started as an AI-generated draft, say so here rather than letting
   * "visual design" imply otherwise. An interviewer will ask.
   */
  contributions: string[];
  year: string;
  client: string;
  /** Omitted where the real figure isn't known — better blank than invented. */
  duration?: string;
  /** Three quick outcome stats shown on the case study. */
  results: { label: string; value: string }[];
  overview: string;
  /**
   * The cold-read summary under the overview: each decision paired with the
   * option it turned down. A reviewer who reads only this should be able to say
   * what was decided and what wasn't.
   *
   * Every entry restates a choice the study's own blocks already make, including
   * the rejected option. Don't add a decision here that the body doesn't argue.
   * `over` is a lowercase phrase that completes "Instead of …".
   */
  decisions?: { chose: string; over: string }[];
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
  /**
   * Route of a working demo for studies whose claims can be exercised rather
   * than just read. Renders a "Try it" link in the case-study header.
   *
   * Only set this where the demo IS the thing the study describes, working:
   * the same code (Ledger's engine), or the same designed route built for real
   * (Lumin's prototype). Its whole value is that a reader can check. A canned
   * walkthrough or a video belongs in `gallery`, not here.
   */
  demoHref?: string;
  /** Label for the `demoHref` button. Defaults to "Try the live demo". */
  demoLabel?: string;
  /**
   * Overrides the default concept-project disclaimer under the results panel.
   *
   * The default says the figures are design targets rather than measured
   * outcomes, which is right for a study whose numbers are illustrative. Set
   * this where that would be inaccurate in the other direction — a study whose
   * client is invented but whose figures are checkable needs to say which is
   * which, not disclaim both.
   */
  resultsNote?: string;
}; /**
 * Case studies — the single source of truth for the Work grid and detail pages.
 * Array order is the Work grid order, sequenced for product-design roles: the
 * design system first, product UI next, brand work last.
 *
 * "This Site" is REAL: it documents this codebase, and every figure in it is
 * verifiable from the repo (token count in globals.css, budgets in
 * scripts/lh-gate.mjs, scans in e2e/a11y.spec.ts). It carries no `concept`
 * flag. If you change the system, update the study — it makes falsifiable claims.
 *
 * Every OTHER study has an invented client and carries `concept: true`, which
 * renders a visible badge. Invented clients are fine; invented OUTCOMES are not.
 * So no concept study quotes adoption, conversion or usability figures — those
 * would need users these projects never had. Their `results` are properties of
 * the design itself (screens, steps, palette size), each one visible in the
 * study's own images, and each sets a `resultsNote` saying exactly that. Process
 * claims follow the same rule: if there are no sketches to show, the study
 * doesn't mention sketching.
 *
 * Ledger (an expense splitter with a live demo) was removed from the Work grid
 * on 2026-10-13. Its engine and tests are still in src/lib/ledger, its UI in
 * src/components/ledger, and its assets under public/work/ledger; restoring it
 * means reverting that commit, which also brings back the /ledger-demo route.
 * `demoHref` stays on the type for any future study with a working demo.
 *
 * The range is deliberate — brand, web, product UI, design systems, and motion.
 */
export const projects: Project[] = [
  {
    slug: "portfolio-design-system",
    title: "This Site: A Design System, Shipped",
    summary:
      "The site you're reading. A token-driven Tailwind design system with light and dark theming, WCAG 2.2 AA checked by an axe-core suite, and a Lighthouse budget that fails the build when a score slips. Designed and built end to end.",
    blurb: "A token-based design system whose accessibility and Lighthouse checks fail the build if a score slips.",
    tags: ["Design System", "Tailwind CSS", "Accessibility"],
    role: "Designer & Front-End Developer",
    contributions: [
      "Design system: 35 color tokens, light/dark theming, shared primitives",
      "Visual, layout and interaction design for every page",
      "Front-end build in Next.js, Tailwind CSS v4 and TypeScript",
      "Accessibility, end-to-end and Lighthouse test gates",
      "Built with Claude Code as a coding assistant",
    ],
    year: "2026",
    client: "Personal project, live",
    duration: "Ongoing",
    results: [
      { label: "Accessibility budget", value: "100" },
      { label: "Design tokens", value: "35" },
      { label: "WCAG 2.2 AA scans", value: "6" },
    ],
    overview:
      "A portfolio usually shows you the output of the work. This one is the work. Every screen is built from a documented token system, themed light and dark from one source of truth, and checked against WCAG 2.2 AA by tests that run before anything ships. It's the clearest evidence I can give you of how I actually work, mostly because you can go read the code and check.",
    decisions: [
      {
        chose: "Split the palette into text tokens that flip in dark mode and background tokens that never do.",
        over: "re-pointing one navy for dark mode, which inverted the whole page.",
      },
      {
        chose: "Accessibility checks that fail the build.",
        over: "an accessibility review step before launch.",
      },
      {
        chose: "Any value the system doesn't have yet becomes a token.",
        over: "hardcoded hex and one-off arbitrary values.",
      },
      {
        chose: "Gate LCP against Lighthouse's simulated figure, with a ratchet.",
        over: "claiming a 2.5-second pass the gate hasn't earned.",
      },
    ],
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
    slug: "learning-platform-ui",
    title: "Lumin: Online Learning, From Curious to Enrolled",
    summary:
      "The part of an online-learning product that decides whether anyone ever reaches a lesson: finding a course, judging it, and signing up. Ten screens held to one rule: nobody needs an account until they've decided to enroll.",
    blurb: "Ten screens from catalog to enrolled, and nobody needs an account to browse.",
    tags: ["UX/UI Design", "User Flows", "EdTech"],
    role: "Product Designer",
    contributions: [
      "Wrote the design brief: audience, palette, type, screen list",
      "Mapped the route from visitor to enrolled student (the flow below)",
      "Ten screens in Figma, including the empty search state",
      "Reviewed my own screens against the brief (see What I'd change)",
      "First-pass layouts generated with Figma AI from my brief, then redesigned by hand",
      "Built the route as a coded prototype in React, with Claude Code, applying those fixes",
    ],
    year: "2026",
    client: "Lumin (concept product)",
    results: [
      { label: "Screens designed", value: "10" },
      { label: "Accounts needed to browse courses", value: "0" },
      { label: "Onboarding steps, with a skip", value: "3" },
    ],
    overview:
      "Most learning-platform case studies start at the lesson player. Lumin starts earlier, at the stretch where people actually leave: a visitor who's curious, scrolling a catalog, deciding whether a course is worth their time and money. The client is invented and the screens haven't been tested with users yet, so there are no outcome numbers here. What there is: a route mapped end to end, the decisions that shape it, and an honest list of what I'd fix.",
    decisions: [
      {
        chose: "No account until someone decides to enroll.",
        over: "asking visitors to sign up before they can browse.",
      },
      {
        chose: "Onboarding asks one question per step, with Skip for now under Continue.",
        over: "a required questionnaire between sign-up and the course.",
      },
      {
        chose: "An empty search keeps the query in view and offers one way back.",
        over: "a blank grid with the filters still showing.",
      },
      {
        chose: "The price card carries a second, lower-stakes action: Try a sample lesson.",
        over: "a lone Enroll button that sends an unconvinced student off to compare tabs.",
      },
    ],
    blocks: [
      {
        heading: "From curious to enrolled",
        body: "The route runs homepage, catalog, course page, sign-up, onboarding, and the rule I held every screen to is that browsing never asks for anything. The catalog and course pages are logged-out views with Log in and Get started in the header; the account arrives at the moment someone decides to enroll, not before it. Every branch off the main path leads back onto it: a search with no results, a returning user, someone not ready to pay. The last step is drawn dashed because it isn't in this set of screens. Checkout and the lesson player would be the next things to design, and I'd rather show where the work stops than imply it doesn't.",
      },
      {
        heading: "Ask, but don't gate",
        body: "Onboarding asks one question per step: what do you want to learn? Eight interest tiles, one gold Continue, and 'Skip for now' directly underneath it. Personalising the catalog is useful to the product and optional to the student, and a questionnaire wedged between sign-up and the course they came for is exactly where someone who already knows what they want gives up. The three-segment bar at the top states the cost up front: this is step one of three, not one of an unknown number.",
      },
      {
        heading: "No dead ends",
        body: "Search takes a topic, a tool or a skill, and category chips narrow it without typing. The interesting screen is the one where that fails. The empty state keeps the query in the box so the student can see what they searched, says plainly that nothing matched, and offers a single way back: 'Browse all courses', in the same gold as the primary action elsewhere. The worst version of this screen is a blank grid with the filters still showing, which is a dead end that looks like a loading bug.",
      },
      {
        heading: "Two ways in",
        body: "The course page is built around one decision, so the price card stays pinned beside the content as you scroll. It carries two actions on purpose: 'Enroll now' for someone who's convinced, and 'Try a sample lesson' for someone who isn't yet. $149 is a real decision, and an outline button that lowers the stakes keeps that student on the page instead of sending them off to compare tabs. Below the card, the 'what you get' list answers the questions people otherwise go hunting for: how many lessons, whether there are project files, whether there's a certificate.",
      },
      {
        heading: "What I'd change",
        body: "Reviewing the set against my own brief turned up three problems. First, the brief reserves gold for the primary action, and onboarding, the empty state and the course page all follow it, but the catalog's Enroll buttons are violet. That's six loud buttons competing on one screen, and I'd make the whole card the link and drop the button. Second, the course page shows curriculum items ticked as complete next to 'Enroll now', which is progress belonging to someone who hasn't started. Logged out, those should be plain outlines, with progress appearing after enrollment. Third, one catalog card puts its rating and length together where the other five split them, a small sign the card drifted rather than being built as one component, which is the first thing I'd fix in the Figma file. The coded prototype linked at the top applies all three fixes; the Figma screens on this page are the originals. Building it meant adding what the set was missing: onboarding steps two and three, which follow step one's pattern, and a plain end screen where checkout and the lesson player would be. None of it has met a real student yet. The prototype is what the next step tests: a five-person test of this route, starting at the empty search.",
      },
    ],
    gallery: 4,
    accent: 2,
    concept: true,
    demoHref: "/prototypes/lumin",
    demoLabel: "Try the coded prototype",
    resultsNote:
      "Concept project: Lumin isn't a real client and hasn't been tested with users, so there are no outcome figures here. These numbers describe the design itself, and each one is visible in the screens on this page.",
  },
  {
    slug: "marketing-landing-page",
    title: "Northwind: A SaaS Marketing Site",
    summary:
      "A marketing site and account screens for a team-analytics startup, designed in Figma around a single ask: start a free trial.",
    blurb: "Six marketing pages and three account screens built around one ask: start a free trial.",
    tags: ["Web Design", "Branding", "Marketing Site"],
    role: "Web & Brand Designer",
    contributions: [
      "Wrote the design brief: positioning, palette, type, page list",
      "Logo mark and its animated reveal",
      "Six marketing pages and three account screens in Figma",
      "Phone layout of the product dashboard",
      "First-pass layouts generated with Figma AI from my brief, then redesigned by hand",
    ],
    year: "2026",
    client: "Northwind (concept product)",
    results: [
      { label: "Marketing pages designed", value: "6" },
      { label: "Account screens", value: "3" },
    ],
    overview:
      "Northwind is an invented team-analytics tool for engineering teams, and this is its marketing site: homepage, product, pricing, docs, about and community pages, plus sign-in, sign-up and password reset. It's a design study. I specified it for a React and Tailwind build, the same stack this site runs on, but Northwind itself was never built, so there's no performance or conversion number to quote.",
    decisions: [
      {
        chose: "The hero shows the product: a weekly-velocity chart beside the headline.",
        over: "describing it, to engineering leads who are allergic to marketing copy.",
      },
      {
        chose: "One ask, repeated after the proof.",
        over: "making whoever is ready scroll back up to act.",
      },
      {
        chose: "On a phone, the dashboard stacks its metrics as cards.",
        over: "squeezing the desktop table onto a small screen.",
      },
    ],
    blocks: [
      {
        heading: "The brief",
        body: "A product that's easy to describe badly. Every analytics tool promises dashboards, so the homepage had to say what's different in one scroll and turn that into a free-trial sign-up. The audience is engineering leads, who are allergic to marketing copy, so the hero shows the product rather than describing it: a real-looking weekly-velocity chart beside the headline, with 'Start free trial' as the primary action and 'Book a demo' as the quieter second one.",
      },
      {
        heading: "One scroll, one ask",
        body: "The value props are three numbered cards you can take in at a glance: one digest every Monday, connect in two clicks, everyone sees the same picture. Each answers an objection a lead would raise before trying the product: more noise, painful setup, another tool only managers look at. The homepage asks for one thing, and the trial call to action comes back after the proof, so whoever is ready by then doesn't have to scroll back up to act.",
      },
      {
        heading: "Proof, then the ask again",
        body: "Social proof sits directly before the closing call to action, because that's where a skeptical reader needs it: a rating, a team count, and one testimonial whose line, 'We replaced three dashboards with one Monday-morning email', restates the value prop in a customer's words. Since Northwind is invented, so is every figure in that section. They're the content a real version of the page would need, not a claim about a real product.",
      },
      {
        heading: "The product on a phone",
        body: "Engineering leads check numbers between meetings, so I laid out the product dashboard at phone width as well: velocity, PRs merged and review time stacked as cards instead of squeezed into a table. The marketing pages are desktop comps. Their mobile versions would be the next set to design, and this frame is the pattern they'd follow.",
      },
      {
        heading: "What I'd change",
        body: "The page argues with itself. The hero says 'No dashboards to babysit' beside what is plainly a dashboard, and the value-prop headline below it is 'Clarity, not more charts'. I'd lead with the Monday digest, the one thing the page says is different, and let the dashboard come second. The one action also goes by three names in the first screen alone (Start free, Start free trial, Get started), which is three decisions for a reader when there should be one. I'd also design the first-run state before any more marketing pages. A team that has just connected GitHub sees an empty dashboard, and that screen decides whether the free trial the whole site is selling actually converts. It isn't in this set, and it's the most important screen Northwind doesn't have.",
      },
    ],
    gallery: 3,
    accent: 1,
    concept: true,
    resultsNote:
      "Concept project: Northwind isn't a real client and was never built or launched, so there are no performance or conversion figures. These numbers describe the design itself, and each one is visible on this page.",
  },
  {
    slug: "brand-identity-system",
    title: "Aperture: A Brand Identity From Scratch",
    summary:
      "A visual identity built from nothing: a lens mark constructed on a grid, a six-color palette, a type system, and usage rules written for people who aren't designers.",
    blurb: "A lens mark built on a grid, with usage rules written for people who aren't designers.",
    tags: ["Brand Identity", "Logo Design", "Graphic Design"],
    role: "Brand Designer",
    contributions: [
      "Wrote the design brief: positioning, personality, deliverables",
      "Logo mark, construction grid and animated reveal",
      "Six-color palette and Sora type specimen",
      "Usage guidelines: clearspace and do/don't rules",
      "First-pass layouts generated with Figma AI from my brief, then redesigned by hand",
    ],
    year: "2026",
    client: "Aperture (concept brand)",
    results: [
      { label: "Brand deliverables", value: "5" },
      { label: "Palette colors", value: "6" },
      { label: "Clearspace unit", value: "1× iris" },
    ],
    overview:
      "A startup with a name, an idea, and nothing to look at. The brief was an identity that could hold up from a 16px favicon to a dark-mode app, with rules clear enough that the team could use it without asking a designer first. Five deliverables came out of it: the animated mark, its construction sheet, the palette, the type specimen and the usage guidelines.",
    decisions: [
      {
        chose: "Every proportion of the mark comes from a 100px construction grid, so anyone can redraw it exactly.",
        over: "eyeballed proportions.",
      },
      {
        chose: "Clearspace is measured in iris radii, a unit taken from the mark itself.",
        over: "a pixel measurement that breaks when the logo scales.",
      },
      {
        chose: "Usage rules shown as do and don't pictures.",
        over: "rules written only as sentences.",
      },
    ],
    blocks: [
      {
        heading: "A mark built on a grid",
        body: "Aperture is a camera word, so the mark is a lens: a violet iris around a warm amber center, with one segment cut to suggest the blades of a shutter. It's constructed on a 100px modular grid: an outer boundary circle, the opening at its center, and six blades with a 120° overlap. Every proportion comes from that geometry rather than from eyeballing, which is what makes the construction sheet worth having. Anyone redrawing the mark later can rebuild it exactly.",
      },
      {
        heading: "Six colors, each with a job",
        body: "Ink for text, three indigo-to-violet shades for the brand surfaces, amber for the one thing on a page that should catch your eye, and Mist as the light background. Amber is deliberately the only warm color, the same idea as the lens's lit center: one spot of warmth in a cool field.",
      },
      {
        heading: "Type that matches the geometry",
        body: "Sora for display and headings: a geometric sans whose round letterforms echo the circles the mark is built on. On the dark specimen it holds its weight at large sizes without turning heavy, which matters for a brand whose app would run in dark mode.",
      },
      {
        heading: "Rules anyone can follow",
        body: "The clearspace rule uses a unit taken from the mark itself, one iris radius, so it scales with the logo and nobody has to measure in pixels. The do and don't examples show the mistake people actually make, a washed-out or recolored mark, next to the right version, because a picture of the wrong thing gets followed more reliably than a sentence about it.",
      },
      {
        heading: "What I'd change",
        body: "The guidelines contradict the brief. The usage page says the mark always sits on Paper or Mist, and forbids desaturating it, yet the brief asked for a dark-mode app and the logo reveal itself plays on deep indigo. So the system needs two things it doesn't have yet: a reversed version for dark backgrounds, and a single-color version for embossing, one-color print and the places full color can't go. I'd also give each of the three purples a written role. Three close shades with no rule for when to use which is where an identity starts drifting.",
      },
    ],
    gallery: 4,
    accent: 0,
    concept: true,
    resultsNote:
      "Concept project: Aperture isn't a real company, so there's no adoption story to tell. These numbers describe the identity itself, and each one is visible in the deliverables on this page.",
  },
]; export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
} /** Returns the next project in the list (wraps around) for case-study footers. */
export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}
