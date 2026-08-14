/**
 * The canonical origin for the site. All metadata (canonical URLs, OG/Twitter,
 * sitemap, robots) derives from this. Override per-environment with
 * NEXT_PUBLIC_SITE_URL.
 *
 * PRE-LAUNCH: ianriley.com is NOT registered yet, so this fallback is a stated
 * intent rather than a live origin. Nothing breaks locally or in CI, but a
 * production deploy without NEXT_PUBLIC_SITE_URL set will publish canonical
 * URLs, a sitemap, and OG tags pointing at a domain that doesn't resolve —
 * which search engines and link unfurlers both act on. Either register the
 * domain or set the env var to the real origin before going live.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ianriley.com";

/**
 * Central place for personal details and social links.
 * Edit these values to make the site your own.
 */
export const site = {
  name: "Ian Riley",
  firstName: "Ian",
  role: "Multidisciplinary Designer",
  tagline:
    "I design clean, human-centered work across brand, product, and the web.",
  location: "Kansas City, United States",
  // PRE-LAUNCH: this mailbox does not exist yet (it depends on the unregistered
  // domain above). It is displayed and linked as a mailto: in both the Contact
  // section and the Footer, so until the mailbox is live, mail sent here bounces
  // — and that is the fallback path the contact form itself points people to on
  // submit failure. Set up the mailbox, or swap in a working address.
  email: "hello@ianriley.com",
  available: true,
  // PRE-LAUNCH: /public/resume.pdf is a one-page placeholder stub, not a real
  // résumé. The Experience section links it as a visible "Résumé" button, so
  // anyone clicking it today downloads the stub. Replace the file in /public
  // (the path and link need no change), or hide the button until it's real.
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
 * Résumé / work history. Rendered by the Experience section, most recent first.
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
    period: "2022 — Present",
    location: "United States",
    summary:
      "Joined as a graphic designer and grew the role into web design and front-end development. I design pages for Acellus, an online learning program, own and maintain the design system, then build those designs into shippable pages in code.",
    highlights: [
      "Design web pages for Acellus, an online learning platform.",
      "Created and maintain the design system that keeps the product consistent.",
      "Transform designs into shippable pages with React, TypeScript, Tailwind CSS, and TanStack.",
      "Use Claude Code to boost development efficiency and productivity.",
    ],
  },
  {
    role: "Creative Director",
    company: "Noxious Gaming",
    period: "1 year",
    location: "Remote",
    summary:
      "Led creative direction for an esports organization, setting the visual identity and producing social and brand designs across the org.",
    highlights: [
      "Directed the visual identity and creative output for the organization.",
      "Produced social media and brand designs for players and the org.",
    ],
  },
  {
    role: "Graphic Designer",
    company: "Buzzkill Esports",
    period: "6 months",
    location: "Remote",
    summary:
      "Designed social media graphics and brand assets for an esports organization.",
    highlights: ["Created social media designs and matchday graphics."],
  },
  {
    role: "Graphic Designer",
    company: "Animosity Esports",
    period: "6 months",
    location: "Remote",
    summary:
      "Designed social media graphics and brand assets for an esports organization.",
    highlights: ["Created social media designs and matchday graphics."],
  },
  {
    role: "Freelance Designer",
    company: "Self-employed",
    period: "2014 — 2022",
    location: "Remote",
    summary:
      "Started freelancing at 13, producing social media designs for esports organizations and influencers. This is where the brand and design work began.",
    highlights: [
      "Built a client base of esports orgs and influencers as a teenager.",
      "Specialized in social media designs and brand assets across multiple organizations.",
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
    credential: "Self-taught Designer — 13+ years",
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
