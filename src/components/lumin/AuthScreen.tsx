"use client";

import { useId, useRef, useState } from "react";
import { ArrowRight, BookOpen, Clock, Info, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Course } from "./data";
import { useLumin, type Account } from "./state";
import { LuminLink, ScreenHeading, luminButton } from "./ui";

/**
 * Sign-up and log-in. The account arrives here, at the moment someone decides
 * to enroll, and not before.
 *
 * Nothing is sent anywhere. The form validates in the browser, then keeps the
 * name in React state so the header and the last screen can use it. The
 * social buttons are simulated. Both facts are stated under the form.
 */

type Mode = "signup" | "login";
type Errors = Partial<Record<"name" | "email" | "password", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthScreen({ mode, course }: { mode: Mode; course?: Course }) {
  const { navigate, setAccount } = useLumin();
  const signup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function finish(account: Account) {
    setAccount(account);
    if (account.returning) {
      // A returning student has done onboarding before.
      navigate(
        course
          ? { screen: "checkout", course: course.id }
          : { screen: "catalog" },
      );
    } else {
      navigate({ screen: "onboarding", course: course?.id, step: 1 });
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (signup && !name.trim()) next.name = "Enter your name.";
    if (!EMAIL.test(email.trim()))
      next.email = "Enter an email address like name@example.com.";
    if (password.length < 8)
      next.password = "Use at least 8 characters.";
    setErrors(next);

    // Focus the first field with a problem, so its message is read out.
    const first = (["name", "email", "password"] as const).find((k) => next[k]);
    if (first) {
      ({ name: nameRef, email: emailRef, password: passwordRef })[
        first
      ].current?.focus();
      return;
    }
    finish({
      name: signup ? name.trim() : "",
      email: email.trim(),
      via: "email",
      returning: !signup,
    });
  }

  return (
    <div className="grid lg:grid-cols-2">
      {/* The pitch, beside the form on wide screens. Hidden on a phone, where
          it would push the form below the fold. */}
      <div className="hidden items-start justify-center bg-linear-to-br from-(--l-deep) to-(--l-violet) px-10 py-14 lg:flex">
        <div className="max-w-sm rounded-3xl bg-white/95 p-8 text-center shadow-lift">
          <span
            aria-hidden="true"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-(--l-gold)"
          >
            <Sparkles className="h-6 w-6 text-white" />
          </span>
          <p className="mt-5 font-display text-2xl font-extrabold">
            Your next skill is waiting.
          </p>
          <p className="mt-2 text-sm text-(--l-slate)">
            Join a supportive community and start building the career you
            deserve.
          </p>
          <ul className="mt-6 space-y-2 text-left text-sm font-medium">
            {[
              { icon: Users, label: "20k+ students learning together" },
              { icon: Clock, label: "Learn at your own pace" },
              { icon: BookOpen, label: "100+ courses to explore" },
            ].map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border border-(--l-line) bg-(--l-cloud) p-3"
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--l-gold)"
                >
                  <Icon className="h-4 w-4 text-white" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-(--l-mist) px-4 py-10 sm:px-10 sm:py-14">
        <div className="mx-auto max-w-sm">
          <ScreenHeading className="text-3xl sm:text-4xl">
            {signup ? "Create account" : "Welcome back"}
          </ScreenHeading>
          <p className="mt-2 text-(--l-slate)">
            {course ? (
              <>
                {signup ? "Create an account to enroll in " : "Log in to enroll in "}
                <span className="font-semibold text-(--l-ink)">
                  {course.title}
                </span>
                .
              </>
            ) : signup ? (
              "Enter your details to start learning today."
            ) : (
              "Log in to pick up where you left off."
            )}
          </p>

          <form noValidate onSubmit={submit} className="mt-7 space-y-4">
            {signup && (
              <TextField
                label="Full name"
                value={name}
                onChange={setName}
                inputRef={nameRef}
                autoComplete="name"
                error={errors.name}
              />
            )}
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              inputRef={emailRef}
              autoComplete="email"
              error={errors.email}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              inputRef={passwordRef}
              autoComplete={signup ? "new-password" : "current-password"}
              hint={signup ? "At least 8 characters." : undefined}
              error={errors.password}
            />
            <button type="submit" className={luminButton("gold", "w-full")}>
              {signup ? "Create account" : "Log in"}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-sm text-(--l-slate)">
            <span aria-hidden="true" className="h-px flex-1 bg-(--l-line)" />
            or
            <span aria-hidden="true" className="h-px flex-1 bg-(--l-line)" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["Google", "GitHub"] as const).map((via) => (
              <button
                key={via}
                type="button"
                onClick={() =>
                  finish({ name: "", email: "", via, returning: !signup })
                }
                className={luminButton("outline", "w-full")}
              >
                <span className="sr-only">Continue with </span>
                {via}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-(--l-slate)">
            {signup ? "Already have an account? " : "New to Lumin? "}
            <LuminLink
              to={{ screen: signup ? "login" : "signup", course: course?.id }}
              className="rounded font-semibold text-(--l-violet) underline-offset-4 hover:underline"
            >
              {signup ? "Log in" : "Create an account"}
            </LuminLink>
          </p>

          <p className="mt-8 flex gap-2 rounded-xl border border-(--l-line) bg-white p-3 text-xs leading-relaxed text-(--l-slate)">
            <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Prototype: nothing you type here is sent or saved, so any details
              will do. Google and GitHub are simulated.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  type = "text",
  value,
  onChange,
  inputRef,
  autoComplete,
  hint,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  autoComplete: string;
  hint?: string;
  error?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  // The error replaces the hint rather than repeating it beside it.
  const showHint = hint && !error;
  const describedBy = error ? errorId : showHint ? hintId : undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-base text-(--l-ink)",
          error ? "border-2 border-(--l-error)" : "border-(--l-slate)",
        )}
      />
      {showHint && (
        <p id={hintId} className="mt-1.5 text-xs text-(--l-slate)">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-(--l-error)">
          {error}
        </p>
      )}
    </div>
  );
}
