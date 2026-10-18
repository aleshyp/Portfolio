"use client";

import { useId, useRef } from "react";
import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, courses, matchesQuery, type Course } from "./data";
import { useLumin } from "./state";
import {
  CourseGlyph,
  LuminLink,
  Rating,
  ScreenHeading,
  Tag,
  luminButton,
} from "./ui";

/**
 * The catalog: search, category chips, and the course grid.
 *
 * Two fixes from the study's "What I'd change" are applied here:
 *   - No violet Enroll button on each card. The whole card is the link, so
 *     the grid no longer has six loud buttons competing with each other or
 *     with the header's gold Get Started.
 *   - Every card is the same component, so rating and length can't drift
 *     apart on one card the way they did in the Figma set.
 */
export function Catalog() {
  const { query, setQuery, category, setCategory } = useLumin();
  const searchRef = useRef<HTMLInputElement>(null);
  const searchId = useId();

  const results = courses.filter(
    (c) => (!category || c.category === category) && matchesQuery(c, query),
  );

  const status =
    results.length === 0
      ? "No courses found"
      : `${results.length} ${results.length === 1 ? "course" : "courses"}${
          category ? ` in ${category}` : ""
        }${query.trim() ? ` matching “${query.trim()}”` : ""}`;

  function browseAll() {
    setQuery("");
    setCategory(null);
    searchRef.current?.focus();
  }

  return (
    <div className="bg-linear-to-br from-(--l-cloud) to-(--l-mist) px-4 py-10 sm:px-8 sm:py-14">
      <ScreenHeading className="text-3xl sm:text-5xl">Course Catalog</ScreenHeading>

      <form
        role="search"
        className="mt-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor={searchId} className="sr-only">
          Search courses by topic, tool or skill
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-(--l-slate)"
          />
          <input
            ref={searchRef}
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses by topic, tool or skill…"
            autoComplete="off"
            className="w-full rounded-xl border border-(--l-slate) bg-white py-3.5 pl-12 pr-4 text-base text-(--l-ink) placeholder:text-(--l-slate)"
          />
        </div>
      </form>

      <div
        role="group"
        aria-label="Filter by category"
        className="mt-5 flex flex-wrap gap-2"
      >
        {[null, ...categories].map((c) => {
          const active = category === c;
          return (
            <button
              key={c ?? "all"}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-4 py-2 font-display text-sm font-semibold transition-colors",
                active
                  ? "bg-(--l-violet) text-white"
                  : "border border-(--l-line) bg-white text-(--l-ink) hover:border-(--l-lilac)",
              )}
            >
              {c ?? "All"}
            </button>
          );
        })}
      </div>

      <p
        role="status"
        className="mt-6 text-sm text-(--l-slate)"
      >
        {status}
      </p>

      {results.length > 0 ? (
        <ul aria-label="Courses" className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((course) => (
            <li key={course.id}>
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState query={query.trim()} onBrowseAll={browseAll} />
      )}
    </div>
  );
}

/** One component for every card: no drift between them. */
function CourseCard({ course }: { course: Course }) {
  const titleId = useId();
  const metaId = useId();
  return (
    <LuminLink
      to={{ screen: "course", course: course.id }}
      aria-labelledby={titleId}
      aria-describedby={metaId}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-(--l-line) bg-white transition-all hover:-translate-y-0.5 hover:border-(--l-lilac) hover:shadow-lift"
    >
      <div className="flex h-32 items-center justify-center bg-(--l-mist)">
        <CourseGlyph icon={course.icon} className="h-9 w-9 text-(--l-violet)" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Tag className="self-start">{course.category}</Tag>
        <h3
          id={titleId}
          className="mt-3 font-display text-lg font-bold leading-snug group-hover:text-(--l-violet)"
        >
          {course.title}
        </h3>
        <div id={metaId} className="mt-auto">
          <p className="mt-1 text-sm text-(--l-slate)">with {course.instructor}</p>
          <div className="mt-4 flex items-center justify-between border-t border-(--l-line) pt-3 text-sm">
            <Rating value={course.rating} />
            <span className="text-(--l-slate)">{course.hours} hours</span>
          </div>
        </div>
      </div>
    </LuminLink>
  );
}

/**
 * The search that fails. Keeps the query in view (in the box above, and named
 * here) and offers exactly one way back.
 */
function EmptyState({
  query,
  onBrowseAll,
}: {
  query: string;
  onBrowseAll: () => void;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center">
      <div aria-hidden="true" className="relative h-28 w-32">
        <span className="absolute left-2 top-6 h-20 w-20 -rotate-12 rounded-2xl bg-(--l-line)" />
        <span className="absolute right-3 top-0 h-16 w-16 rotate-12 rounded-2xl bg-(--l-lilac)/70" />
        <span className="absolute bottom-3 right-6 h-8 w-8 rounded-full bg-(--l-gold)" />
      </div>
      <h3 className="mt-6 font-display text-xl font-bold">No courses found</h3>
      <p className="mt-2 max-w-sm text-sm text-(--l-slate)">
        {query ? (
          <>Nothing matches &ldquo;{query}&rdquo;. </>
        ) : (
          <>Nothing in this category yet. </>
        )}
        Try a different search term, or browse everything to find your next
        skill.
      </p>
      <button
        type="button"
        onClick={onBrowseAll}
        className={luminButton("gold", "mt-6")}
      >
        Browse all courses
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
