import { Download, GraduationCap } from "lucide-react";
import { Section } from "@/components/Section";
import { AnimatedReveal, StaggerGroup, StaggerItem } from "@/components/AnimatedReveal";
import { Eyebrow } from "@/components/Badge";
import { Button } from "@/components/Button";
import { experience, education, site } from "@/data/site";

export function Experience() {
  return (
    <Section id="experience">
      <AnimatedReveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Experience</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink dark:text-slate-100 sm:text-4xl">
              A track record of shipping.
            </h2>
            <p className="mt-4 text-ink-muted dark:text-slate-400">
              The short version of where I&apos;ve worked and what I&apos;ve
              shipped. Want the full picture? Grab the PDF.
            </p>
          </div>
          <Button
            href={site.resumeUrl}
            external
            variant="outline"
            size="md"
            className="shrink-0 whitespace-nowrap"
          >
            <Download size={16} />
            Download résumé
          </Button>
        </div>
      </AnimatedReveal>

      {/* Timeline */}
      <StaggerGroup className="mt-12 space-y-4">
        {experience.map((item) => (
          <StaggerItem key={`${item.company}-${item.period}`}>
            <div className="group relative rounded-3xl border border-brand-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift dark:border-white/10 dark:bg-white/[0.03] sm:p-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-lg font-semibold text-ink dark:text-slate-100">
                  {item.role}
                  <span className="text-brand-700 dark:text-brand-400">
                    {" · "}
                    {item.company}
                  </span>
                </h3>
                <p className="shrink-0 text-sm font-medium text-ink-muted dark:text-slate-400">
                  {item.period}
                </p>
              </div>
              <p className="mt-1 text-sm text-ink-muted dark:text-slate-400">
                {item.location}
              </p>
              <p className="mt-4 text-ink-muted dark:text-slate-400">
                {item.summary}
              </p>
              <ul className="mt-4 space-y-2">
                {item.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-sm text-ink-soft dark:text-slate-300"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Education */}
      <AnimatedReveal delay={0.1}>
        <div className="mt-12 rounded-3xl border border-brand-100 bg-background-soft p-6 dark:border-white/10 dark:bg-white/[0.03] sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
              <GraduationCap size={20} />
            </span>
            <h3 className="font-display text-lg font-semibold text-ink dark:text-slate-100">
              Education &amp; certifications
            </h3>
          </div>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            {education.map((e) => (
              <div key={`${e.credential}-${e.period}`}>
                <dt className="font-medium text-ink dark:text-slate-100">
                  {e.credential}
                </dt>
                <dd className="mt-1 text-sm text-ink-muted dark:text-slate-400">
                  {e.institution} · {e.period}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </AnimatedReveal>
    </Section>
  );
}
