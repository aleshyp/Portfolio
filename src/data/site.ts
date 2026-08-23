/**
 * The canonical origin for the site. All metadata (canonical URLs, OG/Twitter,
 * sitemap, robots) derives from this. Override per-environment with
 * NEXT_PUBLIC_SITE_URL; falls back to the production domain.
 *
 * Apex is canonical — www.ianriley.co 301-redirects here (configured in Vercel's
 * domain settings). Keep this in sync with that redirect: if the canonical ever
 * flips to www, both have to change together or canonical tags will point at a
 * URL that redirects away.
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
  role: "Multidisciplinary Designer",
  tagline:
    "I design brands, products, and websites, and build the front end too.",
  location: "Kansas City, United States",
  // Delivered by Cloudflare Email Routing (forwards to a personal inbox).
  email: "hello@ianriley.co",
  available: true,
  resumeUrl: "/resume.pdf",
  socials: {
    dribbble: "https://dribbble.com/aleshyp",
    linkedin: "https://www.linkedin.com/in/ian-riley-242a4a300/",
    behance: "https://www.behance.net/aleshyp",
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
  {
    role: "Web Designer & Front-End Developer",
    company: "International Academy of Science",
    period: "2022 – Present",
    location: "United States",
    summary:
      "Hired as a graphic designer, ended up doing web design and front-end too. I design pages for Acellus, an online learning program, keep the design system in order, and build the designs out in code.",
    highlights: [
      "Design web pages for Acellus, an online learning platform.",
      "Built the design system and still maintain it.",
      "Build my own designs in React, TypeScript, Tailwind CSS, and TanStack.",
      "Use Claude Code daily to move faster.",
    ],
  },
  {
    role: "Creative Director",
    company: "Noxious Gaming",
    period: "1 year",
    location: "Remote",
    summary:
      "Ran creative for an esports org. Set the visual identity and made the social and brand work for the team and its players.",
    highlights: [
      "Set the visual identity and directed creative output.",
      "Made social and brand designs for the org and its players.",
    ],
  },
  {
    role: "Graphic Designer",
    company: "Buzzkill Esports",
    period: "6 months",
    location: "Remote",
    summary:
      "Social graphics and brand assets on a matchday schedule: announcements, results, and player content.",
    highlights: ["Made matchday graphics, roster announcements, and results posts."],
  },
  {
    role: "Graphic Designer",
    company: "Animosity Esports",
    period: "6 months",
    location: "Remote",
    summary:
      "Social and brand design for the org, working to a weekly content calendar.",
    highlights: ["Made social designs and matchday graphics on a weekly turnaround."],
  },
  {
    role: "Freelance Designer",
    company: "Self-employed",
    period: "2014 – 2022",
    location: "Remote",
    summary:
      "Started at 13, making social designs for esports orgs and influencers. Eight years of learning the job by doing it for people who were paying.",
    highlights: [
      "Built a client base of esports orgs and influencers while still in school.",
      "Social designs and brand assets across a lot of different organizations.",
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
};

export const education: EducationItem[] = [
  {
    credential: "Self-taught Designer, 13+ years",
    institution: "Graphic & UX/UI design",
    period: "Since 2012",
  },
  {
    credential: "Foundations of Cybersecurity",
    institution: "Coursera",
    period: "September 2025",
  },
  {
    credential: "Play It Safe: Manage Security Risks",
    institution: "Coursera",
    period: "September 2025",
  },
  {
    credential: "Connect and Protect: Networks and Network Security",
    institution: "Coursera",
    period: "September 2025",
  },
  {
    credential: "Tools of the Trade: Linux and SQL",
    institution: "Coursera",
    period: "September 2025",
  },
  {
    credential: "Assets, Threats, and Vulnerabilities",
    institution: "Coursera",
    period: "October 2025",
  },
];
