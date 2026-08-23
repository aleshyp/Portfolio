"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { Placeholder } from "./Placeholder";

/**
 * `thumbnail` is rendered by the parent (a server component) and passed in,
 * rather than imported here: the asset components are server-rendered SVG, and
 * this card is a client component for its hover/reveal motion. Passing the
 * element as a prop keeps the assets on the server side of the boundary. Falls
 * back to the gradient Placeholder when a project has no assets yet.
 */
export function ProjectCard({
  project,
  thumbnail,
}: {
  project: Project;
  thumbnail?: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="h-full"
      variants={{
        hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="group flex h-full flex-col rounded-4xl border border-border-subtle bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift dark:hover:border-brand-500/30"
      >
        {/* aria-hidden: the thumbnail is decorative HERE. Each scene carries a
            paragraph-length aria-label for the case study, where it IS the
            content — but inside this link that text would be absorbed into the
            link's accessible name, so the card would announce as a wall of
            description instead of the project title below. */}
        {/* The rounding lives HERE, not as `overflow-hidden` on the card above:
            a 1px border and a clip on the same element antialias the 32px curve
            in two separate passes that disagree, which reads as a fuzzy edge.
            The radius is inset by the border width so it nests concentrically
            inside the card's outer curve. */}
        <div
          className="overflow-hidden rounded-t-4xl-inner"
          aria-hidden="true"
        >
          {/* 16:9 to match the scene artboards — the assets fit-inside rather
              than crop, so a taller well would letterbox them. */}
          <div className="aspect-video w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            {thumbnail ?? (
              <Placeholder
                label={project.tags[0]}
                seed={project.accent}
                className="h-full w-full"
              />
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-fg-faint">
            <span>{project.year}</span>
            <span className="h-1 w-1 rounded-full bg-brand-300" />
            <span>{project.role}</span>
            {project.concept && (
              <>
                <span className="h-1 w-1 rounded-full bg-brand-300" />
                <span>Concept</span>
              </>
            )}
          </div>

          <h3 className="mt-3 flex items-start justify-between gap-3 font-display text-xl font-semibold text-fg">
            <span className="transition-colors duration-300 group-hover:text-brand-700 dark:group-hover:text-brand-300">
              {project.title}
            </span>
            <ArrowUpRight
              size={20}
              className="mt-0.5 shrink-0 text-fg-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600 dark:group-hover:text-brand-400"
            />
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            {project.blurb}
          </p>

          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
