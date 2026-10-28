/**
 * The canonical origin for the site. All metadata (canonical URLs, OG/Twitter,
 * sitemap, robots) derives from this. Override per-environment with
 * NEXT_PUBLIC_SITE_URL; falls back to the production domain.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ianriley.co";

/**
 * Central place for personal details and social links.
 * Edit these values to make the site your own.
 */
export const site = {
  name: "Ian Riley",
  firstName: "Ian",
  role: "UX/UI Designer & Front-End Developer",
  tagline:
    "I design web and app interfaces, then write the front-end code that ships them.",
  location: "Kansas City, MO",
  email: "hello@ianriley.co",
  available: true,
  resumeUrl: "/resume.pdf",
  socials: {
    linkedin: "https://www.linkedin.com/in/ian-riley-242a4a300/",
  },
  nav: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
    { label: "Experience", href: "/#experience" },
    { label: "Skills", href: "/#skills" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

/**
 * Skills, grouped roughly in the order a project moves through them. Shared by
 * the Skills section and the generated résumé (scripts/build-resume.mjs), so
 * the two can't list different things. Icons are a UI concern and live in
 * Skills.tsx, keyed by group title.
 */
export const skillGroups = [
  {
    title: "UX/UI Design",
    description: "Screens that don't need a tutorial.",
    items: [
      "UI Design",
      "User Flows",
      "Interaction Design",
      "Prototyping",
      "Accessibility (WCAG 2.2)",
    ],
  },
  {
    title: "Design Systems",
    description: "One source of truth, in Figma and in code.",
    items: ["Design Tokens", "Component Libraries", "Theming", "Documentation"],
  },
  {
    title: "Front-End",
    description: "Shipping design in code.",
    items: ["React", "TypeScript", "Tailwind CSS", "TanStack"],
  },
  {
    title: "Brand & Graphic Design",
    description: "Where it all started.",
    items: ["Brand Identity", "Logo Design", "Motion Design", "Typography"],
  },
] as const;

// Code tools already appear under the Front-End skill group; listing them here
// too just spent résumé space saying the same thing twice.
export const tools = [
  "Figma",
  "After Effects",
  "Photoshop",
  "Illustrator",
  "Affinity",
  "Claude Code",
  "GitLab",
] as const;

/**
 * Résumé / work history.
 */
export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
};

export const experience: ExperienceItem[] = [
  // One employer, two entries: the move from graphic/motion into UX/UI is the
  // strongest line on the résumé, and a dated title change shows it. The first
  // entry is also `worksFor` in the JSON-LD (lib/seo.ts), so keep it current.
  {
    role: "UX/UI Designer & Front-End Developer",
    company: "International Academy of Science",
    period: "2024 – Present",
    location: "United States",
    summary:
      "I design web and app pages for Acellus, an online learning platform used by over a million students, help maintain the design system behind them, and build those pages in code.",
    highlights: [
      "Designed 50+ web and app pages for Acellus, an online learning platform used by over a million students.",
      "Helped create and maintain a 100-component design system in Figma. Using Claude, replaced a bloated stylesheet full of duplicate components so one fix now reaches everywhere.",
      "Build designs into shippable pages with React, TypeScript, Tailwind CSS, and TanStack.",
      "Work project by project with the programming team, from kickoff to retrospective, tracked in GitLab.",
    ],
  },
  {
    role: "Graphic & Motion Designer",
    company: "International Academy of Science",
    period: "2022 – 2024",
    location: "United States",
    summary:
      "Hired for graphic and motion design. After two years I moved into UX/UI and front-end development.",
    highlights: [
      "Proficient in motion and graphic design using After Effects and Photoshop.",
    ],
  },
  // The esports roles ran inside the freelance years, so they're named here
  // rather than listed as undated jobs of their own. Noxious Gaming, a
  // creative-director role, lives under `leadership` instead.
  {
    role: "Freelance Designer",
    company: "Self-employed",
    period: "2014 – 2022",
    location: "Remote",
    summary:
      "Started freelancing at 13, producing social media designs for esports organizations and influencers, and took on longer roles with a few orgs along the way. This is where the brand and design work began.",
    highlights: [
      "Built a client base of esports orgs and influencers.",
      "Graphic designer for Buzzkill Esports and Animosity Esports, producing matchday, roster, and results graphics.",
    ],
  },
];

/**
 * Leadership, shared by the Experience section and the résumé.
 *
 * `role` is optional on purpose. The Acellus leadership is real but has no
 * title, so it carries `context` instead and must never be given a `role`
 * like "Team Lead": an interviewer will ask, and the answer has to match.
 */
export type LeadershipItem = {
  org: string;
  role?: string;
  context?: string;
  period: string;
  highlights: string[];
};

export const leadership: LeadershipItem[] = [
  {
    org: "International Academy of Science",
    context: "Alongside the UX/UI role",
    period: "2024 – Present",
    highlights: [
      "As the only designer, the go-to for 20+ programmers over the years on design, specs, issues, code, and company questions, so the project manager can focus on the bigger picture.",
      "Answer the programmers' daily “which token or component?” questions, so the product stays consistent.",
      "Train new developers, review teammates' code every day, and help set the standards for the design system.",
    ],
  },
  {
    org: "Third Studio",
    role: "Co-owner & Lead Designer",
    period: "1 year",
    highlights: ["Co-owned the studio and managed its team of 4 designers."],
  },
  {
    org: "Noxious Gaming",
    role: "Creative Director",
    period: "1 year",
    highlights: [
      "Set the esports org's visual identity and directed its creative output.",
    ],
  },
];

/**
 * Education / certifications.
 */
export type EducationItem = {
  credential: string;
  institution: string;
  period: string;
  /** Subject shared by a run of courses; titles the grouped entry. */
  track?: string;
};

export const education: EducationItem[] = [
  {
    credential: "Self-taught Designer – 12+ years",
    institution: "Graphic & UX/UI design",
    period: "Since 2014",
  },
  {
    credential: "Foundations of Cybersecurity",
    institution: "Coursera",
    track: "Cybersecurity",
    period: "September 2025",
  },
  {
    credential: "Play It Safe: Manage Security Risks",
    institution: "Coursera",
    track: "Cybersecurity",
    period: "September 2025",
  },
  {
    credential: "Connect and Protect: Networks and Network Security",
    institution: "Coursera",
    track: "Cybersecurity",
    period: "September 2025",
  },
  {
    credential: "Tools of the Trade: Linux and SQL",
    institution: "Coursera",
    track: "Cybersecurity",
    period: "September 2025",
  },
  {
    credential: "Assets, Threats, and Vulnerabilities",
    institution: "Coursera",
    track: "Cybersecurity",
    period: "October 2025",
  },
];

/**
 * Education collapsed by institution, so five Coursera courses read as one
 * line of coursework instead of five entries outweighing the work history.
 * Shared by the Experience section and the résumé so they can't disagree.
 */
export type EducationGroup = {
  title: string;
  detail: string;
  period: string;
  /** One-line stand-in for `detail` where space is tight (the résumé). */
  brief?: string;
};

export function educationGroups(): EducationGroup[] {
  const byInstitution = new Map<string, EducationItem[]>();
  for (const e of education) {
    byInstitution.set(e.institution, [
      ...(byInstitution.get(e.institution) ?? []),
      e,
    ]);
  }
  return [...byInstitution.entries()].map(([institution, items]) =>
    items.length === 1
      ? {
          title: items[0].credential,
          detail: institution,
          period: items[0].period,
        }
      : {
          title: `${items[0].track ?? institution} coursework`,
          // "Play It Safe: Manage Security Risks" → "Manage Security Risks"
          detail: items.map((i) => i.credential.split(": ").at(-1)).join("; "),
          brief: `${institution} · ${items.length} courses`,
          // "October 2025" → "2025"
          period: items.at(-1)!.period.split(" ").at(-1)!,
        },
  );
}
