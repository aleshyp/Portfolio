"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import type { Course } from "./data";
import { useLumin } from "./state";
import { LuminLink, ScreenHeading, Tag, luminButton } from "./ui";

/**
 * Where the prototype stops. The flow on the case study draws checkout and the
 * lesson player dashed, because they aren't designed. These screens say so in
 * place, rather than faking a payment form or a video player.
 */

export function Checkout({ course }: { course?: Course }) {
  const { account, answers, restart } = useLumin();

  const accountLine = !account
    ? "Not signed in"
    : account.via !== "email"
      ? `Signed in with ${account.via} (simulated)`
      : account.returning
        ? `Logged in as ${account.email}`
        : `${account.name} · ${account.email}`;

  const rows: { label: string; value: string }[] = [
    {
      label: "Course",
      value: course ? `${course.title} · $${course.price}` : "None chosen yet",
    },
    { label: "Account", value: accountLine },
  ];
  if (!account?.returning) {
    rows.push({
      label: "Interests",
      value: answers.interests.length
        ? answers.interests.join(", ")
        : answers.skipped
          ? "Skipped"
          : "None picked",
    });
    if (answers.experience)
      rows.push({ label: "Experience", value: answers.experience });
    if (answers.time) rows.push({ label: "Time per week", value: answers.time });
    if (answers.skipped)
      rows.push({ label: "Onboarding", value: "Skipped with Skip for now" });
  }

  return (
    <EndFrame>
      <ScreenHeading className="mt-3 text-balance text-3xl sm:text-4xl">
        Next: checkout, then the first lesson
      </ScreenHeading>
      <p className="mx-auto mt-3 max-w-lg text-(--l-slate)">
        Those screens aren&apos;t designed yet, so this is where the prototype
        ends. Here&apos;s what this run captured, which is what they&apos;d
        start from.
      </p>

      <dl className="mx-auto mt-8 max-w-lg divide-y divide-(--l-line) rounded-2xl border border-(--l-line) bg-white text-left text-sm">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-1 px-5 py-3 sm:grid-cols-3">
            <dt className="font-semibold">{r.label}</dt>
            <dd className="text-(--l-slate) sm:col-span-2">{r.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button type="button" onClick={restart} className={luminButton("gold")}>
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Start again
        </button>
        <Link
          href="/work/learning-platform-ui"
          className={luminButton("outline")}
        >
          Back to the case study
        </Link>
      </div>
    </EndFrame>
  );
}

export function SampleLesson({ course }: { course: Course }) {
  const { account } = useLumin();
  return (
    <EndFrame>
      <ScreenHeading className="mt-3 text-balance text-3xl sm:text-4xl">
        The sample lesson isn&apos;t designed yet
      </ScreenHeading>
      <p className="mx-auto mt-3 max-w-lg text-(--l-slate)">
        Try a Sample Lesson is the lower-stakes way in, for someone who
        isn&apos;t sure about {course.title} yet. The lesson player is one of
        the next screens to design, so the prototype stops here.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <LuminLink
          to={{ screen: "course", course: course.id }}
          className={luminButton("outline")}
        >
          Back to the course
        </LuminLink>
        <LuminLink
          to={{ screen: account ? "checkout" : "signup", course: course.id }}
          className={luminButton("gold")}
        >
          Enroll Now
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </LuminLink>
      </div>
    </EndFrame>
  );
}

function EndFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-(--l-mist) px-4 py-14 text-center sm:px-8 sm:py-20">
      <div
        aria-hidden="true"
        className="mx-auto h-24 w-full max-w-xs rounded-2xl border-2 border-dashed border-(--l-lilac)"
      />
      <Tag className="mt-8">End of prototype</Tag>
      {children}
    </div>
  );
}
