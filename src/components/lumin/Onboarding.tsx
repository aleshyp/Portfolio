"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  experienceLevels,
  interests,
  weeklyTime,
  type Course,
} from "./data";
import { useLumin } from "./state";
import { InterestGlyph, ScreenHeading, Tag, luminButton } from "./ui";

/**
 * Onboarding: ask, but don't gate. One question per step, Continue in gold,
 * and "Skip for now" directly under it on every step. The bar states the cost
 * up front: step one of three, not one of an unknown number.
 *
 * Only step 1 exists in the Figma set. Steps 2 and 3 were added in this build,
 * on step 1's pattern, so the bar's promise of three steps holds. The case
 * study says so.
 *
 * Tiles are native checkboxes (step 1, pick any) and radios (steps 2 and 3,
 * pick one), visually hidden inside a styled label. That gets the right
 * semantics and keyboard behavior for free: Space toggles, arrows move
 * between radios.
 */

const steps = [
  {
    title: "What do you want to learn?",
    body: "Pick any that interest you, so we can suggest a learning path for your goals.",
  },
  {
    title: "How much design experience do you have?",
    body: "So the first courses we suggest aren't too easy or too hard.",
  },
  {
    title: "How much time can you give it each week?",
    body: "We'll pace your suggested path to fit.",
  },
] as const;

const tile =
  "group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-(--l-line) bg-white p-4 text-center font-display text-sm font-bold transition-colors hover:border-(--l-lilac) has-checked:border-(--l-violet) has-checked:bg-(--l-violet) has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-(--l-violet)";

export function Onboarding({ step, course }: { step: number; course?: Course }) {
  const { navigate, answers, setAnswers } = useLumin();
  const { title, body } = steps[step - 1];

  function next() {
    navigate(
      step < 3
        ? { screen: "onboarding", course: course?.id, step: step + 1 }
        : { screen: "checkout", course: course?.id },
    );
  }

  function skip() {
    setAnswers((a) => ({ ...a, skipped: true }));
    navigate({ screen: "checkout", course: course?.id });
  }

  return (
    <div className="bg-(--l-mist) px-4 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-3xl text-center">
        {/* The visual bar is decorative; the text beside it carries the step. */}
        <div aria-hidden="true" className="mx-auto flex w-32 gap-1.5">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={cn(
                "h-1 flex-1 rounded-full",
                n <= step ? "bg-(--l-violet)" : "bg-(--l-line)",
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-xs font-semibold text-(--l-slate)">
          Step {step} of 3
        </p>
        <Tag className="mt-5">Personalize</Tag>
        <ScreenHeading className="mt-3 text-balance text-3xl sm:text-5xl">
          {title}
        </ScreenHeading>
        <p className="mx-auto mt-3 max-w-md text-(--l-slate)">{body}</p>

        <fieldset aria-labelledby="lumin-screen-heading" className="mt-8">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {interests.map(({ label, icon }) => (
                <label key={label} className={cn(tile, "min-h-28")}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={answers.interests.includes(label)}
                    onChange={(e) =>
                      setAnswers((a) => ({
                        ...a,
                        interests: e.target.checked
                          ? [...a.interests, label]
                          : a.interests.filter((i) => i !== label),
                      }))
                    }
                  />
                  <InterestGlyph
                    icon={icon}
                    className="h-6 w-6 text-(--l-violet) group-has-checked:text-white"
                  />
                  {label}
                </label>
              ))}
            </div>
          )}

          {step === 2 && (
            <ChoiceGrid
              name="experience"
              options={experienceLevels}
              value={answers.experience}
              onChange={(v) => setAnswers((a) => ({ ...a, experience: v }))}
            />
          )}

          {step === 3 && (
            <ChoiceGrid
              name="time"
              options={weeklyTime}
              value={answers.time}
              onChange={(v) => setAnswers((a) => ({ ...a, time: v }))}
            />
          )}
        </fieldset>

        <div className="mt-10 flex flex-col items-center gap-2">
          <button type="button" onClick={next} className={luminButton("gold")}>
            Continue
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
          <button type="button" onClick={skip} className={luminButton("quiet")}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}

function ChoiceGrid({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: readonly { label: string; detail: string }[];
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        options.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "sm:grid-cols-3",
      )}
    >
      {options.map(({ label, detail }) => (
        <label key={label} className={cn(tile, "min-h-24")}>
          <input
            type="radio"
            name={name}
            className="sr-only"
            checked={value === label}
            onChange={() => onChange(label)}
          />
          {label}
          <span className="font-sans text-xs font-normal text-(--l-slate) group-has-checked:text-white/90">
            {detail}
          </span>
        </label>
      ))}
    </div>
  );
}
