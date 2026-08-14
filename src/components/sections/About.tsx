import { Section } from "@/components/Section";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { Eyebrow } from "@/components/Badge";
import { Pill } from "@/components/Pill";
import { Prose } from "@/components/Prose";
import { Placeholder } from "@/components/Placeholder";
import { site } from "@/data/site";

const stats = [
  { value: "13+", label: "Years designing" },
  { value: "6+", label: "Brands & orgs served" },
  { value: "Design → code", label: "Own it end-to-end" },
];

const focusAreas = [
  "Web Design",
  "Front-End Development",
  "Design Systems",
  "UX/UI Design",
  "Graphic Design",
  "Brand Identity",
];

export function About() {
  return (
    <Section id="about" className="bg-background-soft">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Portrait */}
        <AnimatedReveal direction="right">
          <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            <Placeholder
              label="Your portrait"
              seed={1}
              className="aspect-[4/5] w-full rounded-4xl shadow-soft"
            />
            {/* Floating overlay card: needs an OPAQUE dark background (it sits
                over the portrait), so it keeps an opaque bg-* rather than the
                translucent bg-surface token. bg-surface-solid is the opaque
                counterpart defined in globals.css. */}
            <div className="absolute -bottom-5 right-0 rounded-2xl border border-border-subtle bg-surface-solid px-5 py-4 shadow-lift sm:-right-5">
              <p className="font-display text-2xl font-bold text-brand-600 dark:text-brand-400">
                {site.location.split(",")[0]}
              </p>
              <p className="text-xs text-fg-muted">based &amp; available remote</p>
            </div>
          </div>
        </AnimatedReveal>

        {/* Copy */}
        <div>
          <AnimatedReveal>
            <Eyebrow>About me</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              Design that respects people&apos;s time and attention.
            </h2>
          </AnimatedReveal>

          <AnimatedReveal delay={0.1}>
            <Prose className="mt-6 max-w-none">
              <p>
                I&apos;m a {site.role.toLowerCase()} based in Kansas City. I
                picked up graphic design at 10 and started freelancing at 13,
                mostly social media work for esports orgs and influencers. I
                never really stopped. Doing that as a teenager taught me to work
                fast and make things look good on a real deadline.
              </p>
              <p>
                In 2022 I turned design into a full-time career. At my current
                company I&apos;ve grown a graphic-design role into web design
                and front-end development: I design the pages, own the design
                system, and build both in code. Details are where most of my
                time goes, and I think it shows in the finished work.
              </p>
            </Prose>
          </AnimatedReveal>

          <AnimatedReveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <Pill key={area}>{area}</Pill>
              ))}
            </div>
          </AnimatedReveal>

          <AnimatedReveal delay={0.2}>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border-subtle pt-8 sm:gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-2xl font-bold leading-tight text-balance text-fg sm:text-3xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-sm text-fg-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </AnimatedReveal>
        </div>
      </div>
    </Section>
  );
}
