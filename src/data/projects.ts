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
   * Only set this where the demo runs the SAME code the study describes — its
   * whole value is that a reader can check. A canned walkthrough or a video
   * belongs in `gallery`, not here.
   */
  demoHref?: string;
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
 * interaction-heavy study first, the design system second, brand work last.
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
 * "Ledger" is a third case, and the reason `demoHref` exists. Its client is
 * invented (so it keeps `concept: true`), but the engineering is real and
 * running: the split engine, the settlement algorithm and their 65 unit tests
 * live in `src/lib/ledger/`, and the demo at /ledger-demo executes that same
 * code. Its figures are therefore split by kind. The countable ones (tests,
 * payments, states) are verifiable from the repo; anything about adoption or
 * users wouldn't be, so it isn't claimed. Keep that line where it is — the
 * study's value is that a reader can check the parts it asserts.
 *
 * The range is deliberate — brand, web, product UI, design systems, and motion.
 */
export const projects: Project[] = [
  {
    slug: "expense-tracker-app",
    title: "Ledger: Splitting Money Without Losing Cents",
    summary:
      "A group expense splitter built around the two problems that make it harder than it looks: money doesn't divide evenly, and a weekend away generates far more debts than anyone wants to settle one by one. The split engine and the settlement algorithm are real, tested, and running in the browser.",
    blurb: "A shared expense tracker, with the money maths done properly.",
    // Front-End, not Full-Stack: the study itself explains there's no server.
    tags: ["Product Design", "Interaction Design", "Front-End"],
    role: "Product Designer & Front-End Developer",
    contributions: [
      "Problem framing: why splitting money is harder than it looks",
      "Interaction design for 12 states, including failure and recovery",
      "UI design, built on this site's design system",
      "Split engine, settlement algorithm and 65 unit tests",
      "Built with Claude Code as a coding assistant",
    ],
    year: "2026",
    client: "Ledger (concept product)",
    duration: "5 weeks",
    results: [
      { label: "Rounding error across 10k splits", value: "£0.00" },
      { label: "Payments to settle, from 16", value: "4" },
      { label: "Unit tests on the money logic", value: "65" },
    ],
    overview:
      "Every expense-splitting app looks trivial until you divide £100 three ways. The naive version loses a penny, and the naive data model asks five people to make sixteen separate transfers to settle a weekend away. Ledger is a concept product, but the engine underneath it isn't. The arithmetic and the settlement algorithm are real code with real tests, and the demo runs that exact code in your browser. The client is invented; the maths you can check.",
    blocks: [
      {
        heading: "£100 ÷ 3 is a design problem",
        body: "It's £33.33 each, which is £99.99. A penny is missing and it has to go somewhere. Almost every version of this bug starts with storing money as a floating-point number, where 0.1 + 0.2 isn't 0.3 and the error compounds quietly until a balance is off by a few pence with no explanation. So Ledger stores pence as integers everywhere and converts to pounds only when it displays them. The type system enforces it: amounts are a branded Pence type, so passing a raw 12.5 into an expense is a compile error rather than a rounding surprise three screens later. The split function distributes the remainder explicitly, turning £100 across three into 3334, 3333, 3333, and a test asserts that shares sum back to the total across ten thousand generated combinations. The form shows all of this before you submit: it doesn't divide evenly, and here's who picks up the extra penny. An app that rounds quietly is one people eventually stop trusting.",
      },
      {
        heading: "Model the debt, not the transactions",
        body: "The obvious data model records who owes whom per expense. Dinner gives you three arrows, the taxi adds two more pointing partly backwards, and by Sunday five people have sixteen small debts between them, several of which cancel out. Nobody is going to work through that list. The fix is to throw the per-expense edges away and keep only net position. Once you know Ana is up £7.33 and Ben is down £155, it doesn't matter which meals caused it: any set of transfers that zeroes everyone out settles the group. Ledger nets every expense into one balance per person, then matches the largest debtor against the largest creditor until nobody is owed anything. Sixteen payments become four. That greedy pass isn't always optimal. Finding the true minimum means finding every zero-summing subset of people, which is NP-hard, so the app checks whether it managed to hit the provable n−1 floor and says 'close to minimal, not provably it' when it can't. Claiming an optimum you haven't verified seemed worse than being one transaction off.",
      },
      {
        heading: "Every state is a designed state",
        body: "The happy path is maybe a quarter of the work. Adding an expense in Ledger is optimistic: the row appears the moment you submit and the balances move with it, because waiting on a spinner for something that will almost certainly succeed makes an app feel slower than it is. But 'almost certainly' is the whole problem, so the failure path got designed too. The demo has a 'fail the next save' toggle because a demo that only ever succeeds never shows the interesting half. Trip it and the row stays on screen, marked, with retry and discard, while the balances snap back to truth. All of that falls out of one decision: balances are never stored. They're derived from the expense list on every render, so an optimistic row is reflected for free and a rollback un-reflects it without a second code path to keep in sync. Cache the balances instead and you spend the rest of the project reconciling them. Empty group, first expense, in-flight, failed, offline, settled: six states that aren't the happy path, and each one is a screen someone will actually see.",
      },
      {
        heading: "Who can see what",
        body: "This is the part I designed and deliberately didn't ship, so it's worth being straight about why. The demo runs entirely in the browser on a statically-rendered portfolio, so there's no server to authorize against and no database to protect. Adding one would have meant putting a login wall in front of a case study and a live database in the deploy path of a site whose whole point is that it builds to files. What the code does carry is the shape of it. Validation lives next to the model rather than in the form, so the same rules would run server-side unchanged. The design assumed row-level security in the database rather than checks in the client: a member may read expenses only for groups they belong to, enforced where the data lives, because anything running in the browser is under the user's control. Client-side validation is UX. It tells you your amount is malformed before you wait on a round-trip, and that's all it's for.",
      },
      {
        heading: "What I'd do differently",
        body: "I designed multi-currency in early and it was the wrong call. Every amount had to carry a currency code, every sum had to check that two amounts matched before adding them, and the settlement algorithm, which is the actually interesting problem, got harder to reason about for a feature nobody on a weekend away needs. I cut it and the engine got smaller and more obviously correct. If I picked it up again I'd handle it at the boundary: convert on entry at the day's rate, store one currency, and keep the original on the expense for anyone who wants to see it. The other thing I'd change is the remainder rule. Right now the spare penny always goes to the first person in the list, which is easy to explain but means the same person absorbs it every time if the order doesn't change. Rotating it per expense is a two-line change and a fairer default. I left it as it is because a demo that shuffles is harder to trust than one that's predictably a penny unfair, though I think that trade goes the other way in a real app.",
      },
    ],
    gallery: 3,
    accent: 3,
    concept: true,
    demoHref: "/ledger-demo",
    resultsNote:
      "Concept project: Ledger isn't a real client and it has no users. These three numbers aren't about adoption, though. They're properties of the code, and all three are checkable — the tests are in src/lib/ledger, and the demo runs the same engine.",
  },
  {
    slug: "portfolio-design-system",
    title: "This Site: A Design System, Shipped",
    summary:
      "The site you're reading. A token-driven Tailwind design system with light and dark theming, WCAG 2.2 AA checked by an axe-core suite, and a Lighthouse budget that fails the build when a score slips. Designed and built end to end.",
    blurb: "The design system behind this site, built and tested in public.",
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
    blurb: "Course discovery and sign-up, designed with no dead ends.",
    tags: ["UX/UI Design", "User Flows", "EdTech"],
    role: "Product Designer",
    contributions: [
      "Wrote the design brief: audience, palette, type, screen list",
      "Mapped the route from visitor to enrolled student (the flow below)",
      "Ten screens in Figma, including the empty search state",
      "Reviewed my own screens against the brief (block 05)",
      "First-pass layouts generated with Figma AI from my brief, then redesigned by hand",
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
        body: "Reviewing the set against my own brief turned up three problems. First, the brief reserves gold for the primary action, and onboarding, the empty state and the course page all follow it, but the catalog's Enroll buttons are violet. That's six loud buttons competing on one screen, and I'd make the whole card the link and drop the button. Second, the course page shows curriculum items ticked as complete next to 'Enroll now', which is progress belonging to someone who hasn't started. Logged out, those should be plain outlines, with progress appearing after enrollment. Third, one catalog card puts its rating and length together where the other five split them, a small sign the card drifted rather than being built as one component, which is the first thing I'd fix in the Figma file. And none of it has met a real student. The next step is a five-person test of this route, starting at the empty search.",
      },
    ],
    gallery: 4,
    accent: 2,
    concept: true,
    resultsNote:
      "Concept project: Lumin isn't a real client and hasn't been tested with users, so there are no outcome figures here. These numbers describe the design itself, and each one is visible in the screens on this page.",
  },
  {
    slug: "marketing-landing-page",
    title: "Northwind: A SaaS Marketing Site",
    summary:
      "A marketing site and account screens for a team-analytics startup, designed in Figma around a single ask: start a free trial.",
    blurb: "A SaaS marketing site, from brand mark to sign-in.",
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
    blurb: "A full visual identity, logo through guidelines.",
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
