"use client";

import { ArrowLeft, ArrowRight, Award, Circle, Download, Video } from "lucide-react";
import { lessonCount, type Course } from "./data";
import { useLumin } from "./state";
import { LuminLink, Rating, ScreenHeading, luminButton } from "./ui";

/**
 * The course page, built around one decision.
 *
 * The price card carries two actions on purpose: Enroll Now for someone who's
 * convinced, and Try a Sample Lesson for someone who isn't yet. On wide screens
 * it overlaps the hero and stays pinned while the curriculum scrolls past.
 *
 * Fix from "What I'd change": the Figma page ticked curriculum items as
 * complete beside "Enroll now", which is progress belonging to someone who
 * hasn't started. Here every lesson is a plain outline. Progress would appear
 * after enrolling, which is past where this prototype stops.
 */
export function CoursePage({ course }: { course: Course }) {
  const { account } = useLumin();
  const lessons = lessonCount(course);

  return (
    <div className="bg-linear-to-br from-(--l-cloud) to-(--l-mist) pb-14">
      {/* Hero */}
      <div className="bg-linear-to-br from-(--l-deep) to-(--l-violet) px-4 pb-10 pt-6 text-white sm:px-8 lg:pb-24">
        <LuminLink
          to={{ screen: "catalog" }}
          className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-white/90 hover:text-white"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          All courses
        </LuminLink>
        <div className="mt-6 lg:max-w-2xl">
          {course.bestseller && (
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              Bestseller
            </span>
          )}
          <ScreenHeading className="mt-3 text-3xl leading-tight text-white sm:text-5xl">
            {course.title}
          </ScreenHeading>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/90">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-display text-xs font-bold"
              >
                {course.instructor
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </span>
              Instructed by {course.instructor}
            </span>
            <span aria-hidden="true" className="hidden h-4 w-px bg-white/40 sm:block" />
            <span>
              {lessons} lessons · {course.hours} hours
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-8 px-4 sm:px-8 lg:grid-cols-3 lg:gap-10">
        {/* Price card first in the DOM: it's the decision the page exists for,
            so a screen reader reaches it straight after the title, and on a
            phone it sits right under the hero. On desktop it moves to the
            right column and rides up over the hero. */}
        <aside
          aria-label="Enroll"
          className="-mt-6 self-start rounded-2xl border border-(--l-line) bg-white p-6 shadow-lift lg:sticky lg:top-24 lg:col-start-3 lg:row-start-1 lg:-mt-20"
        >
          <p className="font-display text-4xl font-extrabold">${course.price}</p>
          <p className="mt-1 text-sm text-(--l-slate)">
            One-time payment for lifetime access
          </p>
          <div className="mt-5 grid gap-3">
            <LuminLink
              to={{
                // Already signed in (via Log in): go straight to checkout.
                screen: account ? "checkout" : "signup",
                course: course.id,
              }}
              className={luminButton("gold", "w-full")}
            >
              Enroll Now
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </LuminLink>
            <LuminLink
              to={{ screen: "sample", course: course.id }}
              className={luminButton("outline", "w-full")}
            >
              Try a Sample Lesson
            </LuminLink>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Video aria-hidden="true" className="h-4 w-4 text-(--l-violet)" />
              {lessons} lessons
            </li>
            <li className="flex items-center gap-3">
              <Download aria-hidden="true" className="h-4 w-4 text-(--l-violet)" />
              Project files
            </li>
            <li className="flex items-center gap-3">
              <Award aria-hidden="true" className="h-4 w-4 text-(--l-violet)" />
              Certificate of completion
            </li>
          </ul>
        </aside>

        <div className="min-w-0 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:pt-10">
          <section aria-labelledby="lumin-about">
            <h3 id="lumin-about" className="font-display text-2xl font-bold">
              About this course
            </h3>
            <p className="mt-3 max-w-prose text-(--l-slate)">{course.about}</p>
          </section>

          <section aria-labelledby="lumin-curriculum" className="mt-10">
            <h3 id="lumin-curriculum" className="font-display text-2xl font-bold">
              Course curriculum
            </h3>
            <div className="mt-4 divide-y divide-(--l-line) rounded-2xl border border-(--l-line) bg-white">
              {course.modules.map((m, i) => (
                <div key={m.title} className="p-5">
                  <h4 className="font-display font-bold">
                    Module {i + 1}: {m.title}
                  </h4>
                  <ul className="mt-3 space-y-2.5">
                    {m.lessons.map((lesson) => (
                      <li
                        key={lesson}
                        className="flex items-center gap-3 text-sm text-(--l-slate)"
                      >
                        <Circle
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-(--l-lilac)"
                        />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="lumin-reviews" className="mt-10">
            <h3 id="lumin-reviews" className="font-display text-2xl font-bold">
              Student reviews
            </h3>
            <p className="mt-2 flex items-center gap-2 text-sm">
              <Rating value={course.rating} />
              <span className="text-(--l-slate)">
                ({course.reviews.toLocaleString("en-US")} reviews)
              </span>
            </p>
            {course.testimonials && (
              <ul className="mt-4 space-y-3">
                {course.testimonials.map((t) => (
                  <li
                    key={t.name}
                    className="rounded-2xl border border-(--l-line) bg-white p-5"
                  >
                    <p className="font-display font-bold">{t.name}</p>
                    <p className="text-sm text-(--l-slate)">{t.role}</p>
                    <p className="mt-3 text-sm leading-relaxed">{t.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
