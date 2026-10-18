"use client";

import { createContext, useContext } from "react";
import { getCourse } from "./data";

/**
 * Prototype routing and shared state.
 *
 * WHICH screen is showing lives in the URL (`?screen=course&course=…`), so the
 * browser's Back button steps back through the prototype, a reload keeps your
 * place, and a test facilitator can link straight to a screen. Next.js syncs
 * `history.pushState` with useSearchParams, so no router round-trip is needed.
 *
 * WHAT the visitor did (search, chosen interests, the account) lives in React
 * state on the prototype root. Nothing is stored or sent anywhere: reload the
 * page and it's gone.
 */

export type Screen =
  | "catalog"
  | "course"
  | "signup"
  | "login"
  | "onboarding"
  | "sample"
  | "checkout";

export type Route = {
  screen: Screen;
  /** Course id, for every screen after the catalog. */
  course?: string;
  /** Onboarding step, 1–3. */
  step?: number;
};

const screens: Screen[] = [
  "catalog",
  "course",
  "signup",
  "login",
  "onboarding",
  "sample",
  "checkout",
];

/**
 * URL params are untrusted input: each is checked against a known set rather
 * than passed through. An unknown screen falls back to the catalog, and an
 * unknown course id is dropped, so it never reaches a link the prototype builds.
 */
export function parseRoute(params: URLSearchParams): Route {
  const raw = params.get("screen");
  const screen = screens.includes(raw as Screen) ? (raw as Screen) : "catalog";
  const step = Number(params.get("step"));
  return {
    screen,
    course: getCourse(params.get("course"))?.id,
    step: step >= 1 && step <= 3 ? step : 1,
  };
}

export function routeToSearch(route: Route): string {
  if (route.screen === "catalog") return "?";
  const params = new URLSearchParams({ screen: route.screen });
  if (route.course) params.set("course", route.course);
  if (route.screen === "onboarding") params.set("step", String(route.step ?? 1));
  return `?${params.toString()}`;
}

export type Account = {
  name: string;
  email: string;
  /** How they signed up. Social buttons are simulated. */
  via: "email" | "Google" | "GitHub";
  /** True when they came in through Log in, so onboarding is skipped. */
  returning: boolean;
};

export type Answers = {
  interests: string[];
  experience?: string;
  time?: string;
  skipped: boolean;
};

export type LuminState = {
  route: Route;
  navigate: (to: Route) => void;
  hrefFor: (to: Route) => string;
  query: string;
  setQuery: (q: string) => void;
  category: string | null;
  setCategory: (c: string | null) => void;
  account: Account | null;
  setAccount: (a: Account | null) => void;
  answers: Answers;
  setAnswers: (update: (prev: Answers) => Answers) => void;
  restart: () => void;
};

export const LuminContext = createContext<LuminState | null>(null);

export function useLumin(): LuminState {
  const ctx = useContext(LuminContext);
  if (!ctx) throw new Error("useLumin must be used inside <LuminPrototype>");
  return ctx;
}
