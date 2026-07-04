"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { site } from "@/data/site";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export function Hero() {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const item = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40">
      {/* soft emerald backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-500/10" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white dark:to-ink" />
      </div>

      <Container>
        <motion.div
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          {site.available && (
            <motion.div variants={item} className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-brand-700 shadow-soft backdrop-blur dark:border-brand-500/30 dark:bg-white/5 dark:text-brand-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                </span>
                Available for new projects
              </span>
            </motion.div>
          )}

          <motion.h1
            variants={item}
            className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-fg sm:text-6xl"
          >
            Hi, I&apos;m {site.firstName}. I design{" "}
            <span className="text-gradient">clean, human-centered</span>{" "}
            brands &amp; products.
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg text-fg-muted sm:text-xl"
          >
            A {site.role.toLowerCase()} based in {site.location}, blending
            graphic design and UX/UI — and the front-end code to ship it — into
            work that feels effortless.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button href="/#work" size="lg">
              View my work
              <ArrowUpRight size={18} />
            </Button>
            <Button href="/#contact" size="lg" variant="outline">
              Get in touch
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-16 flex items-center justify-center gap-2 text-sm text-fg-faint"
          >
            <Sparkles size={15} className="text-brand-400" />
            <span>Designing for esports orgs, influencers &amp; brands since 2014</span>
          </motion.div>
        </motion.div>
      </Container>

      {/* gentle scroll hint */}
      <div className="mt-14 flex justify-center pb-10">
        <motion.a
          href="/#work"
          aria-label="Scroll to work"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 text-brand-600 dark:border-brand-500/30 dark:text-brand-400"
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={18} />
        </motion.a>
      </div>
    </section>
  );
}
