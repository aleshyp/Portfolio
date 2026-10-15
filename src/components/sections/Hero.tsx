"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
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

  // The <h1> is this page's LCP element, so it must NOT fade from opacity 0:
  // Largest Contentful Paint is only recorded once the text reaches its final
  // opacity, which meant the staggered fade above pushed LCP from ~156ms to
  // ~1.05s locally (~3.1s under Lighthouse's CPU throttling — over the
  // LCP_RATCHET in scripts/lh-gate.mjs). Painting it opaque immediately and animating
  // only the transform keeps the entrance while letting LCP land on first frame;
  // transforms don't affect LCP timing. Keep opacity out of this variant.
  const heading = {
    hidden: reduce ? { opacity: 1 } : { opacity: 1, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden pb-4 pt-28 sm:pb-6 sm:pt-36">
      {/* soft emerald backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-500/10" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-brand-100/60 blur-3xl dark:bg-brand-500/10" />
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
                Open to UX/UI design roles
              </span>
            </motion.div>
          )}

          <motion.h1
            variants={heading}
            className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-balance text-fg sm:text-6xl"
          >
            Hi, I&apos;m {site.firstName}. I design{" "}
            <span className="text-gradient">products &amp; design systems</span>,
            and ship the code.
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg text-fg-muted sm:text-xl"
          >
            UX/UI designer and front-end developer in{" "}
            {site.location.split(",")[0]}. I design web and app pages in Figma,
            help maintain a production design system, and build in React, so
            the thing you approve is the thing that ships.
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
            className="mt-12 flex items-center justify-center gap-2 text-sm text-fg-faint"
          >
            <Sparkles size={15} className="text-brand-400" />
            <span>Graphic and motion design roots · UX/UI and front-end today</span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
