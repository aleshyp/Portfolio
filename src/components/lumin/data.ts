/**
 * Content and palette for the Lumin prototype (/prototypes/lumin).
 *
 * Lumin is a concept product, so everything here is invented. The six Figma
 * catalog courses and the "Design Systems for Scale" course page are carried
 * over as designed. The Development and Marketing courses are new, so those
 * category chips have something to filter to.
 */

/**
 * Lumin's palette, from docs/lumin-figma-brief.md.
 *
 * Applied as CSS variables on the prototype's root element and used through
 * Tailwind's variable syntax (`bg-(--l-violet)`), NOT added to the site's
 * @theme. This is a fictional client's identity, a specimen in the same sense as
 * the hex values in PortfolioSystemAsset, and the site's own token set is a
 * claim the "This Site" study makes (35 tokens). Adding Lumin to it would make
 * that claim false.
 *
 * Text pairs used, all AA: ink on mist 15.5:1 · slate on white 5.6:1 · slate
 * on mist 4.9:1 · violet on white 5.5:1 · white on violet 5.5:1 · ink on gold
 * 8.5:1. Lilac and mint are decoration only (2.7:1 and 2.3:1 on white).
 */
export const luminPalette = {
  "--l-ink": "#1C1633",
  "--l-violet": "#6D4AED",
  "--l-deep": "#4C2CB8",
  "--l-lilac": "#A78BFA",
  "--l-gold": "#F5A524",
  "--l-gold-soft": "#FBCB6B",
  "--l-mist": "#F3F0FF",
  "--l-cloud": "#F7F6FC",
  "--l-line": "#E4DFF3",
  "--l-slate": "#6B6485",
  // Not in the brief, which has no error color: added for form validation.
  // Red-700, 6.5:1 on white.
  "--l-error": "#B91C1C",
} as const;

export const categories = [
  "Design",
  "Development",
  "Marketing",
  "Strategy",
  "Branding",
] as const;
export type Category = (typeof categories)[number];

export type CourseIcon =
  | "book"
  | "palette"
  | "pointer"
  | "layers"
  | "users"
  | "sparkles"
  | "code"
  | "megaphone"
  | "panels";

export type Course = {
  id: string;
  title: string;
  category: Category;
  instructor: string;
  rating: number;
  reviews: number;
  hours: number;
  price: number;
  icon: CourseIcon;
  bestseller?: boolean;
  about: string;
  /** Extra search terms: tools and skills a student might type. */
  keywords: string[];
  modules: { title: string; lessons: string[] }[];
  /** Written reviews, where the Figma screen had them. */
  testimonials?: { name: string; role: string; body: string }[];
};

export const courses: Course[] = [
  {
    id: "design-systems-for-scale",
    title: "Design Systems for Scale",
    category: "Design",
    instructor: "Sarah Jenkins",
    rating: 4.8,
    reviews: 1284,
    hours: 14,
    price: 149,
    icon: "panels",
    bestseller: true,
    about:
      "Learn how to build, document, and maintain a design system that supports multi-platform applications, from naming conventions to cross-functional governance.",
    keywords: ["tokens", "figma", "components", "documentation"],
    modules: [
      {
        title: "Foundations",
        lessons: ["Tokens & Color", "Typography Systems", "Grid & Spacing"],
      },
      {
        title: "Component Design",
        lessons: ["Button Systems", "Form Patterns", "Navigation Design"],
      },
      {
        title: "Documentation & Handoff",
        lessons: ["Writing Component Specs", "Figma Annotations", "Dev Mode Setup"],
      },
    ],
    testimonials: [
      {
        name: "Maya Chen",
        role: "Product Designer",
        body: "The typography systems lesson alone was worth the price. The way Sarah breaks down naming conventions makes it easy to scale across our entire product suite.",
      },
      {
        name: "David Kim",
        role: "Design Lead",
        body: "The governance section was incredibly practical. We've already implemented the cross-functional review process and it's saved us weeks of back-and-forth.",
      },
    ],
  },
  {
    id: "typography-foundations",
    title: "Typography Foundations",
    category: "Design",
    instructor: "Elena Ross",
    rating: 4.9,
    reviews: 862,
    hours: 8,
    price: 89,
    icon: "book",
    about:
      "Choose, pair and set type with confidence: hierarchy, measure and rhythm for interfaces that read easily at every size.",
    keywords: ["type", "fonts", "hierarchy"],
    modules: [
      {
        title: "Reading Type",
        lessons: ["Anatomy of a Typeface", "Serif, Sans and Beyond", "Pairing Fonts"],
      },
      {
        title: "Setting Type for Screens",
        lessons: ["Building a Type Scale", "Line Length & Leading", "Responsive Type"],
      },
    ],
  },
  {
    id: "color-theory",
    title: "Color Theory",
    category: "Design",
    instructor: "Marcus Chen",
    rating: 4.8,
    reviews: 640,
    hours: 6,
    price: 79,
    icon: "palette",
    about:
      "Build palettes that hold up in light and dark themes, pass contrast checks, and still feel like a brand.",
    keywords: ["palette", "contrast", "accessibility", "dark mode"],
    modules: [
      {
        title: "How Color Works",
        lessons: ["Hue, Value & Saturation", "Color Harmony", "Color & Meaning"],
      },
      {
        title: "Color in Interfaces",
        lessons: ["Accessible Contrast", "Semantic Color Roles", "Dark Mode Palettes"],
      },
    ],
  },
  {
    id: "ui-animation",
    title: "UI Animation",
    category: "Design",
    instructor: "Sarah Jenkins",
    rating: 4.7,
    reviews: 517,
    hours: 10,
    price: 119,
    icon: "pointer",
    about:
      "Motion that explains rather than decorates: timing, easing and transitions that help people follow what changed.",
    keywords: ["motion", "transitions", "easing", "prototyping"],
    modules: [
      {
        title: "Principles of Motion",
        lessons: ["Timing & Easing", "Motion With Purpose", "Reduced Motion"],
      },
      {
        title: "Motion in Product",
        lessons: ["Micro-interactions", "Page Transitions", "Handing Off Motion Specs"],
      },
    ],
  },
  {
    id: "product-thinking",
    title: "Product Thinking",
    category: "Design",
    instructor: "David Kim",
    rating: 4.9,
    reviews: 731,
    hours: 12,
    price: 129,
    icon: "layers",
    about:
      "Frame the problem before the pixels: goals, trade-offs and how designers make the case for a decision.",
    keywords: ["strategy", "problem framing", "prioritization"],
    modules: [
      {
        title: "Framing the Problem",
        lessons: ["Jobs to Be Done", "Defining Success", "Scoping the Work"],
      },
      {
        title: "Making Decisions",
        lessons: ["Weighing Trade-offs", "Writing a Design Rationale", "Presenting to Stakeholders"],
      },
    ],
  },
  {
    id: "ux-research-mastery",
    title: "UX Research Mastery",
    category: "Strategy",
    instructor: "Priya Nair",
    rating: 4.8,
    reviews: 958,
    hours: 20,
    price: 159,
    icon: "users",
    about:
      "Plan, run and synthesize research that changes decisions, from five-person usability tests to interview programs.",
    keywords: ["research", "usability testing", "interviews", "synthesis"],
    modules: [
      {
        title: "Planning Research",
        lessons: ["Choosing a Method", "Writing a Test Plan", "Recruiting Participants"],
      },
      {
        title: "Running and Synthesizing",
        lessons: ["Moderating a Session", "Affinity Mapping", "Sharing Findings"],
      },
    ],
  },
  {
    id: "brand-identity-design",
    title: "Brand Identity Design",
    category: "Branding",
    instructor: "Leo Grant",
    rating: 4.6,
    reviews: 402,
    hours: 15,
    price: 139,
    icon: "sparkles",
    about:
      "Take a brand from a name to a working system: logo construction, palette, type and usage rules people can follow.",
    keywords: ["logo", "brand", "guidelines", "identity"],
    modules: [
      {
        title: "Building the Mark",
        lessons: ["Briefs & Positioning", "Logo Construction", "Testing at Small Sizes"],
      },
      {
        title: "The System Around It",
        lessons: ["Palette & Type", "Usage Guidelines", "Brand in Motion"],
      },
    ],
  },
  {
    id: "front-end-for-designers",
    title: "Front-End for Designers",
    category: "Development",
    instructor: "Noah Patel",
    rating: 4.7,
    reviews: 389,
    hours: 16,
    price: 139,
    icon: "code",
    about:
      "Enough HTML, CSS and React to prototype your own ideas and talk shop with the engineers who build them.",
    keywords: ["html", "css", "react", "code"],
    modules: [
      {
        title: "Markup and Style",
        lessons: ["Semantic HTML", "Layout With Flexbox & Grid", "Responsive CSS"],
      },
      {
        title: "Components in Code",
        lessons: ["React Basics", "Props & State", "From Figma to Component"],
      },
    ],
  },
  {
    id: "launch-copy",
    title: "Writing Launch Copy",
    category: "Marketing",
    instructor: "Ava Moreno",
    rating: 4.6,
    reviews: 274,
    hours: 5,
    price: 69,
    icon: "megaphone",
    about:
      "Headlines, landing pages and announcement emails that say what's new and why it matters, in fewer words.",
    keywords: ["copywriting", "landing page", "email", "launch"],
    modules: [
      {
        title: "Finding the Message",
        lessons: ["Who It's For", "The One-Line Pitch", "Proof Over Claims"],
      },
      {
        title: "Writing the Launch",
        lessons: ["Landing Page Structure", "Announcement Emails", "Editing for Length"],
      },
    ],
  },
];

export function getCourse(id: string | null): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function lessonCount(course: Course): number {
  return course.modules.reduce((n, m) => n + m.lessons.length, 0);
}

/**
 * Whole-phrase match against everything a student might type: title,
 * category, instructor, keywords and lesson titles. "Advanced Motion" finds
 * nothing (the Figma empty state), while "motion" finds UI Animation.
 */
export function matchesQuery(course: Course, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    course.title,
    course.category,
    course.instructor,
    ...course.keywords,
    ...course.modules.flatMap((m) => m.lessons),
  ]
    .join(" · ")
    .toLowerCase();
  return haystack.includes(q);
}

/** Onboarding step 1 tiles, as designed in Figma. */
export const interests = [
  { label: "UI/UX Design", icon: "layout" },
  { label: "Typography", icon: "type" },
  { label: "Branding", icon: "sparkles" },
  { label: "Motion Design", icon: "play" },
  { label: "Illustration", icon: "brush" },
  { label: "Figma", icon: "pen" },
  { label: "Code for Designers", icon: "code" },
  { label: "Color Theory", icon: "palette" },
] as const;
export type InterestIcon = (typeof interests)[number]["icon"];

/**
 * Onboarding steps 2 and 3. NOT in the Figma set, which only designed step 1
 * of 3. They follow its pattern (one question, tiles, Continue, Skip for now)
 * and the case study says they were added in the build.
 */
export const experienceLevels = [
  { label: "Just starting", detail: "New to design" },
  { label: "Some projects", detail: "A few things made" },
  { label: "Working designer", detail: "It's my job" },
  { label: "Leading a team", detail: "I review others' work" },
] as const;

export const weeklyTime = [
  { label: "1–2 hours", detail: "A lesson or two" },
  { label: "3–5 hours", detail: "A module a week" },
  { label: "6+ hours", detail: "Full steam" },
] as const;
