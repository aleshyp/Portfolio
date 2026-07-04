"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { Placeholder } from "./Placeholder";

export function ProjectCard({ project }: { project: Project }) {
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
        className="group flex h-full flex-col overflow-hidden rounded-4xl border border-brand-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand-500/30"
      >
        <div className="overflow-hidden">
          <Placeholder
            label={project.tags[0]}
            seed={project.accent}
            className="aspect-[16/10] w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex items-center gap-3 text-xs font-medium text-ink-faint dark:text-slate-400">
            <span>{project.year}</span>
            <span className="h-1 w-1 rounded-full bg-brand-300" />
            <span>{project.role}</span>
          </div>

          <h3 className="mt-3 flex items-start justify-between gap-3 font-display text-xl font-semibold text-ink dark:text-slate-100">
            <span className="transition-colors duration-300 group-hover:text-brand-700 dark:group-hover:text-brand-300">
              {project.title}
            </span>
            <ArrowUpRight
              size={20}
              className="mt-0.5 shrink-0 text-ink-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600 dark:text-slate-500 dark:group-hover:text-brand-400"
            />
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-slate-400">
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
