import Image from "next/image";
import { Section } from "@/components/Section";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { Eyebrow } from "@/components/Badge";
import { Pill } from "@/components/Pill";
import { Prose } from "@/components/Prose";
import { site } from "@/data/site";

const stats = [
  { value: "13+", label: "Years designing" },
  { value: "6+", label: "Brands & orgs served" },
  { value: "Design → code", label: "Start to finish" },
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
            {/* Rounding lives on an overflow-hidden wrapper so the corners clip
                the image without also clipping the shadow. */}
            <div className="overflow-hidden rounded-4xl shadow-soft">
              <Image
                src="/personal-branding/portrait.jpg"
                alt={`${site.name}, smiling in a parka on a boat with a snow-capped coastline behind`}
                width={1760}
                height={2200}
                /* The portrait column tops out at ~512px (max-w-6xl container,
                   minus px-8, halved, minus half the gap-16). Declaring that
                   real cap instead of a loose 40vw stops the browser from
                   picking an undersized srcset candidate on wide viewports. */
                sizes="(min-width: 1024px) 512px, (min-width: 640px) 24rem, 100vw"
                /* The source is a lightly-compressed (~q90) JPEG; the default
                   q75 re-encode visibly softens skin and hair detail on a photo
                   this size. 90 keeps it crisp — it's one hero image. */
                quality={90}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
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
              Thirteen years in, still fixing the small stuff.
            </h2>
          </AnimatedReveal>

          <AnimatedReveal delay={0.1}>
            <Prose className="mt-6 max-w-none">
              <p>
                I picked up graphic design at 10 and started freelancing at 13,
                mostly social graphics for esports orgs and influencers. I never
                really stopped. Getting paid for that as a teenager taught me to
                work fast and hit a deadline, which turned out to be most of the
                job.
              </p>
              <p>
                In 2022 it became full-time. I was hired as a graphic designer
                and talked my way into the web side; now I design the pages, own
                the design system, and build them in React. Most of my time goes
                into details nobody is supposed to notice.
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
