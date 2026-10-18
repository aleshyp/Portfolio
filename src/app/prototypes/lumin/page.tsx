import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { Badge, Eyebrow } from "@/components/Badge";
import { ConceptBadge } from "@/components/ConceptBadge";
import {
  LuminPrototype,
  LuminPrototypeFallback,
} from "@/components/lumin/LuminPrototype";
import { JsonLd } from "@/components/JsonLd";
import { getProject } from "@/data/projects";
import { pageMetadata, prototypeJsonLd } from "@/lib/seo";

/**
 * The Lumin prototype page.
 *
 * Its own top-level route rather than under /work/[slug]/, for the reason the
 * old Ledger demo gave: a static segment inside the dynamic one would be
 * generated for every case study or shadow the slug page.
 *
 * The shell (heading, framing copy, notes) is server-rendered. The prototype
 * reads its screen from the URL with useSearchParams, which opts it out of
 * prerendering, so it sits in a Suspense boundary whose fallback is the
 * catalog itself: the static HTML paints the real first screen.
 */

const description =
  "The Lumin case study's route from course catalog to enrolled, built as a working prototype: search, a course page, sign-up and onboarding.";

const path = "/prototypes/lumin";

export const metadata: Metadata = pageMetadata({
  title: "Lumin prototype",
  description,
  path,
});

const study = getProject("learning-platform-ui")!;

export default function LuminPrototypePage() {
  return (
    <article className="pb-24 pt-28 sm:pt-32">
      <JsonLd
        data={prototypeJsonLd({
          name: "Lumin, from catalog to enrolled",
          description,
          path,
          study,
        })}
      />
      <Container>
        {/* No AnimatedReveal on the header: it fades from opacity 0, and LCP
            only records once text is fully opaque, so the fade decided this
            page's LCP (a bimodal 2.9s or 3.5s, over the ratchet). The home
            hero avoids the same trap; see the note in Hero.tsx. */}
        <div>
          <Link
            href={`/work/${study.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-fg-muted transition-colors hover:text-brand-700 dark:hover:text-brand-300"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to the case study
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Badge>Coded prototype</Badge>
            <ConceptBadge />
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-fg sm:text-5xl">
            Lumin, from catalog to enrolled
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-fg-muted">
            The route from the Lumin case study, working: search the catalog,
            open a course, sign up and get through onboarding. It runs entirely
            in your browser. Nothing you type is sent or saved.
          </p>
        </div>

        <div className="mt-10">
          <Suspense fallback={<LuminPrototypeFallback />}>
            <LuminPrototype />
          </Suspense>
        </div>

        <div className="mt-16 grid gap-12 border-t border-border-subtle pt-10 lg:grid-cols-2">
          <section aria-labelledby="try">
            <Eyebrow>What to try</Eyebrow>
            <h2 id="try" className="sr-only">
              What to try
            </h2>
            <ul className="mt-5 space-y-4 text-fg-muted">
              <li>
                <span className="font-medium text-fg">
                  Search for &ldquo;Advanced Motion&rdquo;.
                </span>{" "}
                The empty state keeps your query and offers one way back.
              </li>
              <li>
                <span className="font-medium text-fg">
                  Open a course you&apos;re not sure about.
                </span>{" "}
                The price card offers a lower-stakes second action.
              </li>
              <li>
                <span className="font-medium text-fg">
                  Enroll, then skip onboarding.
                </span>{" "}
                Skip for now sits under Continue on every step.
              </li>
              <li>
                <span className="font-medium text-fg">Use only a keyboard.</span>{" "}
                Focus moves to the top of each new screen, and the browser&apos;s
                Back button steps back through it.
              </li>
            </ul>
          </section>

          <section aria-labelledby="changed">
            <Eyebrow>What changed from the Figma screens</Eyebrow>
            <h2 id="changed" className="sr-only">
              What changed from the Figma screens
            </h2>
            <ul className="mt-5 space-y-4 text-fg-muted">
              <li>
                <span className="font-medium text-fg">
                  The three fixes the study names.
                </span>{" "}
                Catalog cards are links with no violet Enroll buttons, the
                logged-out curriculum shows no progress, and every card is one
                component.
              </li>
              <li>
                <span className="font-medium text-fg">
                  Onboarding steps two and three are new.
                </span>{" "}
                Figma had only step one. They follow its pattern.
              </li>
              <li>
                <span className="font-medium text-fg">
                  Development and Marketing courses are new,
                </span>{" "}
                so every category chip filters to something.
              </li>
              <li>
                <span className="font-medium text-fg">
                  Checkout and the lesson player still aren&apos;t designed.
                </span>{" "}
                The prototype says so where they would be.
              </li>
            </ul>
          </section>
        </div>
      </Container>
    </article>
  );
}
