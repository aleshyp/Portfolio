import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { Badge, Eyebrow } from "@/components/Badge";
import { ConceptBadge } from "@/components/ConceptBadge";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { LedgerDemo } from "@/components/ledger/LedgerDemo";

/**
 * The Ledger interactive demo.
 *
 * Lives at its own top-level route rather than under /work/[slug]/ — a static
 * `demo` segment inside the dynamic one would either be generated for every
 * case study or shadow the slug page, and neither is what's wanted.
 *
 * The page shell is a server component; only <LedgerDemo> is client-side, so
 * the heading, framing copy and back-link are in the static HTML. That keeps the
 * route indexable and gives it something to paint before hydration.
 */

export const metadata: Metadata = {
  title: "Ledger — interactive demo",
  description:
    "A working demo of the Ledger split engine: add an expense, watch the balances net out, and see 16 payments collapse into 4.",
  alternates: { canonical: "/ledger-demo" },
  openGraph: {
    title: "Ledger — interactive demo",
    description:
      "Add an expense, watch the balances net out, and see 16 payments collapse into 4.",
    url: "/ledger-demo",
    type: "website",
  },
};

export default function LedgerDemoPage() {
  return (
    <article className="pt-28 pb-24 sm:pt-36">
      <Container>
        <AnimatedReveal>
          <Link
            href="/work/expense-tracker-app"
            className="inline-flex items-center gap-2 text-sm font-medium text-fg-muted transition-colors hover:text-brand-700 dark:hover:text-brand-300"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to the case study
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Badge>Interactive demo</Badge>
            <ConceptBadge />
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-fg sm:text-5xl">
            Ledger, running
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-fg-muted">
            The real split engine, in your browser. Add an expense and the
            balances re-derive; hit &ldquo;fail the next save&rdquo; to watch an
            optimistic update roll back. Nothing is stored — refresh and it&apos;s
            back to the weekend away.
          </p>
        </AnimatedReveal>

        <AnimatedReveal delay={0.1}>
          <div className="mt-10">
            <LedgerDemo />
          </div>
        </AnimatedReveal>

        <AnimatedReveal delay={0.15}>
          <div className="mt-16 border-t border-border-subtle pt-10">
            <Eyebrow>What to try</Eyebrow>
            <ul className="mt-5 grid gap-4 text-sm leading-relaxed text-fg-muted sm:grid-cols-2">
              <li>
                <span className="font-medium text-fg">Split £100 three ways.</span>{" "}
                The preview shows £33.34 / £33.33 / £33.33 — the spare penny has
                to land somewhere, and the app says where.
              </li>
              <li>
                <span className="font-medium text-fg">Fail a save.</span> Tick the
                box, add an expense: the row appears instantly, the balances move,
                then both roll back when the request fails.
              </li>
              <li>
                <span className="font-medium text-fg">Empty the group.</span> Even
                with nothing in it there&apos;s a screen there, not a blank list.
              </li>
              <li>
                <span className="font-medium text-fg">Mark a payment paid.</span>{" "}
                A transfer is recorded as an expense, so settling up needs no
                special case in the balance logic.
              </li>
            </ul>
          </div>
        </AnimatedReveal>
      </Container>
    </article>
  );
}
