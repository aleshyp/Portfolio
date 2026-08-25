import { Download, GraduationCap } from "lucide-react";
import { Section } from "@/components/Section";
import { AnimatedReveal, StaggerGroup, StaggerItem } from "@/components/AnimatedReveal";
import { Eyebrow } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { experience, education, site } from "@/data/site";

export function Experience() {
  return (
    <Section id="experience">
      <AnimatedReveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Experience</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              Where I&apos;ve worked.
            </h2>
            <p className="mt-4 text-fg-muted">
              The short version. Grab the résumé if you want dates and detail.
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
            <Card interactive className="group relative p-6 sm:p-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-lg font-semibold text-fg">
                  {item.role}
                  <span className="text-brand-700 dark:text-brand-400">
                    {" · "}
                    {item.company}
                  </span>
                </h3>
                <p className="shrink-0 text-sm font-medium text-fg-muted">
                  {item.period}
                </p>
              </div>
              <p className="mt-1 text-sm text-fg-muted">
                {item.location}
              </p>
              <p className="mt-4 text-fg-muted">
                {item.summary}
              </p>
              <ul className="mt-4 space-y-2">
                {item.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-sm text-fg-soft"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                    {h}
                  </li>
                ))}
              </ul>
            </Card>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Education */}
      <AnimatedReveal delay={0.1}>
        <Card variant="soft" className="mt-12 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
              <GraduationCap size={20} />
            </span>
            <h3 className="font-display text-lg font-semibold text-fg">
              Education &amp; certifications
            </h3>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-fg-muted">
            Self-taught on the design side. The security track is deliberate:
            I write the front-end, so knowing how forms, headers, and
            dependencies actually get attacked is part of the job.
          </p>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            {education.map((e) => (
              <div key={`${e.credential}-${e.period}`}>
                <dt className="font-medium text-fg">
                  {e.credential}
                </dt>
                <dd className="mt-1 text-sm text-fg-muted">
                  {e.institution} · {e.period}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </AnimatedReveal>
    </Section>
  );
}
