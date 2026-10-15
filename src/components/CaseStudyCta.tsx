import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { site } from "@/data/site";
import { Container } from "./Container";
import { AnimatedReveal } from "./AnimatedReveal";
import { buttonClasses } from "./Button";

/**
 * The end-of-case-study exit.
 *
 * A study runs ~13 screens, so whoever reaches the bottom is the most engaged
 * reader on the site. Previously the only thing waiting was "Next project",
 * which loops them into another 13 screens — the one visitor most ready to make
 * contact was handed more reading instead of a way to do it.
 *
 * This sits above that next-project link rather than replacing it: browsing on
 * is still a legitimate intent, it just shouldn't be the *only* offer.
 *
 * Written for a hiring manager, not a client: this site is a job search, so
 * the end of a study offers a conversation and the résumé, not a freelance
 * engagement. The résumé is the second action because it's what that reader
 * needs next; the email address is in the Contact section the first one leads
 * to.
 */
export function CaseStudyCta() {
  return (
    <Container>
      {/* Spacing lives on this wrapper rather than on the panel inside the
          reveal, so the motion element's box matches the panel it animates. */}
      <div className="mt-24">
        <AnimatedReveal>
          {/* Permanently-dark panel, matching the home page's Contact band — so
              everything inside uses the fixed `on-dark` tokens rather than the
              theme-aware ones, which would flip out from under it. */}
          <div className="overflow-hidden rounded-4xl bg-linear-to-br from-brand-950 via-brand-900 to-emerald-950 p-8 text-on-dark shadow-lift sm:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Want to talk about this work?
                </h2>
                <p className="mt-3 text-on-dark-muted">
                  I&apos;m open to UX/UI and product design roles, and happy to
                  walk through any of this in more depth. I&apos;ll usually
                  reply within a day or two.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/#contact"
                  className={buttonClasses({
                    variant: "onDark",
                    size: "lg",
                    className: "whitespace-nowrap",
                  })}
                >
                  Get in touch
                  <ArrowRight size={16} />
                </Link>
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-3.5 text-base font-medium text-on-dark-muted transition-colors hover:text-on-dark"
                >
                  <FileText size={16} />
                  Résumé (PDF)
                </a>
              </div>
            </div>
          </div>
        </AnimatedReveal>
      </div>
    </Container>
  );
}
