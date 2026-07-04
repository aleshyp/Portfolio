import {
  PenTool,
  Sparkles,
  Layout,
  Code2,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/Section";
import { AnimatedReveal, StaggerGroup, StaggerItem } from "@/components/AnimatedReveal";
import { Eyebrow } from "@/components/Badge";

type SkillGroup = {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
};

const groups: SkillGroup[] = [
  {
    icon: PenTool,
    title: "Graphic Design",
    description: "Where it all started.",
    items: ["Brand Identity", "Social Media", "Layout", "Visual Design"],
  },
  {
    icon: Sparkles,
    title: "Branding",
    description: "Identities that stick.",
    items: ["Logo Design", "Brand Identity", "Style Guides", "Typography"],
  },
  {
    icon: Layout,
    title: "UX/UI Design",
    description: "Interfaces that feel obvious.",
    items: ["UI Design", "Prototyping", "Interaction", "Design Systems"],
  },
  {
    icon: Code2,
    title: "Front-End",
    description: "Shipping design in code.",
    items: ["React", "TypeScript", "Tailwind CSS", "TanStack"],
  },
];

const tools = [
  "Figma",
  "Photoshop",
  "Illustrator",
  "Affinity",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "TanStack",
  "Claude Code",
];

export function Skills() {
  return (
    <Section id="skills" className="bg-background-soft">
      <AnimatedReveal>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">Skills &amp; tools</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            A full-stack design toolkit.
          </h2>
          <p className="mt-4 text-fg-muted">
            From brand and graphics to product interfaces and the code that
            ships them — here&apos;s how I take work from idea to launch.
          </p>
        </div>
      </AnimatedReveal>

      <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <StaggerItem key={group.title}>
              <div className="group h-full rounded-3xl border border-border-subtle bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-500/15 dark:text-brand-400 dark:group-hover:bg-brand-600 dark:group-hover:text-white">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-fg">
                  {group.title}
                </h3>
                <p className="mt-1 text-sm text-fg-muted">
                  {group.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-fg-soft"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGroup>

      <AnimatedReveal delay={0.1}>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
          {tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-border-subtle bg-surface-raised px-4 py-2 text-sm font-medium text-fg-soft shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 dark:hover:border-brand-500/30 dark:hover:text-brand-300"
            >
              {tool}
            </span>
          ))}
        </div>
      </AnimatedReveal>
    </Section>
  );
}
