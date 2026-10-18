"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCourse, luminPalette } from "./data";
import {
  LuminContext,
  parseRoute,
  routeToSearch,
  type Account,
  type Answers,
  type LuminState,
  type Route,
  useLumin,
} from "./state";
import { LuminLink, LuminMark, luminButton } from "./ui";
import { Catalog } from "./Catalog";
import { CoursePage } from "./CoursePage";
import { AuthScreen } from "./AuthScreen";
import { Onboarding } from "./Onboarding";
import { Checkout, SampleLesson } from "./EndScreens";

/**
 * The Lumin prototype: the route from catalog to enrolled, as working UI.
 *
 * Rendered inside a browser-window frame on /prototypes/lumin. Two exports:
 *
 *   LuminPrototype          reads the screen from the URL. useSearchParams opts
 *                           it out of prerendering, so it must sit in <Suspense>.
 *   LuminPrototypeFallback  the same app pinned to the catalog, for that
 *                           Suspense fallback. It's what the static HTML
 *                           carries, so the catalog paints before any JS runs
 *                           (it was an empty "Loading" box, and the page's LCP
 *                           waited for hydration). A deep link to another
 *                           screen shows the catalog until hydration swaps it.
 */

const emptyAnswers: Answers = { interests: [], skipped: false };

/** The address shown in the frame's fake URL bar. Decorative. */
function fakeUrl(route: Route): string {
  switch (route.screen) {
    case "catalog":
      return "lumin.app/courses";
    case "course":
      return `lumin.app/courses/${route.course ?? ""}`;
    case "sample":
      return `lumin.app/courses/${route.course ?? ""}/sample`;
    case "signup":
      return "lumin.app/signup";
    case "login":
      return "lumin.app/login";
    case "onboarding":
      return "lumin.app/welcome";
    case "checkout":
      return "lumin.app/checkout";
  }
}

export function LuminPrototype() {
  const searchParams = useSearchParams();
  const route = useMemo(() => parseRoute(searchParams), [searchParams]);
  return <LuminApp route={route} live />;
}

const catalogRoute: Route = { screen: "catalog", step: 1 };

export function LuminPrototypeFallback() {
  return <LuminApp route={catalogRoute} />;
}

/**
 * `live` marks the URL-driven app, as opposed to the prerendered fallback.
 * It's exposed as `data-lumin-live` so tests can wait for the real screen
 * rather than the catalog the static HTML shows first.
 */
function LuminApp({ route, live = false }: { route: Route; live?: boolean }) {
  const pathname = usePathname();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [answers, setAnswersState] = useState<Answers>(emptyAnswers);

  const hrefFor = useCallback(
    (to: Route) => {
      const search = routeToSearch(to);
      return search === "?" ? pathname : `${pathname}${search}`;
    },
    [pathname],
  );

  const navigate = useCallback(
    (to: Route) => window.history.pushState(null, "", hrefFor(to)),
    [hrefFor],
  );

  const restart = useCallback(() => {
    setQuery("");
    setCategory(null);
    setAccount(null);
    setAnswersState(emptyAnswers);
    navigate({ screen: "catalog" });
  }, [navigate]);

  const state: LuminState = {
    route,
    navigate,
    hrefFor,
    query,
    setQuery,
    category,
    setCategory,
    account,
    setAccount,
    answers,
    setAnswers: setAnswersState,
    restart,
  };

  // On every screen change (not the first render): move focus to the new
  // screen's heading, and bring the top of the frame back into view if the
  // visitor had scrolled down a long screen. Without this, a keyboard user is
  // left on a button that no longer exists, and a mouse user at the bottom of
  // the course page lands mid-way down the sign-up form.
  const frameRef = useRef<HTMLDivElement>(null);
  const routeKey = routeToSearch(route);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const frame = frameRef.current;
    if (frame) {
      // The site navbar is fixed at the top; leave room for it.
      const top = frame.getBoundingClientRect().top;
      if (top < 0) {
        window.scrollTo({ top: window.scrollY + top - 96, behavior: "instant" });
      }
    }
    document
      .getElementById("lumin-screen-heading")
      ?.focus({ preventScroll: true });
  }, [routeKey]);

  const course = getCourse(route.course ?? null);

  let screen: React.ReactNode;
  switch (route.screen) {
    case "course":
      screen = course ? <CoursePage course={course} /> : <Catalog />;
      break;
    case "signup":
    case "login":
      screen = <AuthScreen mode={route.screen} course={course} />;
      break;
    case "onboarding":
      screen = <Onboarding step={route.step ?? 1} course={course} />;
      break;
    case "sample":
      screen = course ? <SampleLesson course={course} /> : <Catalog />;
      break;
    case "checkout":
      screen = <Checkout course={course} />;
      break;
    default:
      screen = <Catalog />;
  }

  return (
    <LuminContext.Provider value={state}>
      <div
        ref={frameRef}
        data-lumin-frame
        data-lumin-live={live || undefined}
        style={luminPalette as React.CSSProperties}
        className={cn(
          // overflow-clip, not overflow-hidden: both clip the rounded
          // corners, but hidden makes the frame a scroll container, and then
          // the course page's price card can't stick to the viewport.
          "overflow-clip rounded-3xl border border-border-subtle bg-white font-sans text-(--l-ink) shadow-lift",
          // Lumin's own focus color inside the frame, instead of the site's
          // emerald. Violet on white is 5.5:1, comfortably over the 3:1 a
          // focus indicator needs.
          "[&_:focus-visible]:outline-(--l-violet)",
        )}
      >
        {/* Browser chrome: purely decorative, so it's hidden from assistive
            tech. The prototype's own navigation is the Lumin header below. */}
        <div
          aria-hidden="true"
          className="flex items-center gap-3 border-b border-(--l-line) bg-(--l-cloud) px-4 py-2.5"
        >
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-(--l-line)" />
            <span className="h-2.5 w-2.5 rounded-full bg-(--l-line)" />
            <span className="h-2.5 w-2.5 rounded-full bg-(--l-line)" />
          </div>
          <div className="min-w-0 flex-1 truncate rounded-full bg-white px-3 py-1 text-center text-xs text-(--l-slate)">
            {fakeUrl(route)}
          </div>
          <div className="w-10" />
        </div>

        <LuminHeader />

        <div key={routeKey}>{screen}</div>
      </div>
    </LuminContext.Provider>
  );
}

/** Lumin's top bar: logged-out (Log in / Get Started) or logged-in (avatar). */
function LuminHeader() {
  const { route, account } = useLumin();
  const onCatalog = route.screen === "catalog" || route.screen === "course";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-(--l-line) bg-white px-4 py-3 sm:px-6">
      <LuminLink
        to={{ screen: "catalog" }}
        className="flex items-center gap-2 rounded-lg font-display text-lg font-bold"
      >
        <LuminMark />
        {/* Mark only on the narrowest screens: at 320px the wordmark, Log in
            and Get Started don't fit on one row. The name stays for screen
            readers. */}
        <span className="sr-only sm:not-sr-only">Lumin</span>
        <span className="sr-only">, course catalog</span>
      </LuminLink>

      <nav aria-label="Lumin" className="hidden items-center gap-7 text-sm md:flex">
        <LuminLink
          to={{ screen: "catalog" }}
          aria-current={onCatalog ? "page" : undefined}
          className={cn(
            "rounded",
            onCatalog
              ? "font-semibold text-(--l-ink)"
              : "text-(--l-slate) hover:text-(--l-ink)",
          )}
        >
          Courses
        </LuminLink>
        {/* Not built in this prototype. Plain text rather than dead links, so
            nothing invites a click that goes nowhere. */}
        {["Mentors", "Pricing", "Resources"].map((label) => (
          <span key={label} className="text-(--l-slate)">
            {label}
          </span>
        ))}
      </nav>

      {route.screen === "signup" || route.screen === "login" ? (
        // On the auth screens the form already links between the two.
        <span />
      ) : account ? (
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-(--l-mist) font-display text-xs font-bold text-(--l-violet)"
          >
            {account.name ? initials(account.name) : <UserRound className="h-4 w-4" />}
          </span>
          {/* Social sign-in and Log in don't collect a name. */}
          <span>
            {account.name ? (
              <>
                <span className="sr-only">Signed in as </span>
                {account.name.split(" ")[0]}
              </>
            ) : (
              "Signed in"
            )}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3">
          <LuminLink
            to={{ screen: "login", course: route.course }}
            className="whitespace-nowrap rounded-full px-2 py-2 text-sm font-medium hover:bg-(--l-cloud) sm:px-3"
          >
            Log in
          </LuminLink>
          <LuminLink
            to={{ screen: "signup", course: route.course }}
            className={luminButton("gold", "whitespace-nowrap", "sm")}
          >
            Get Started
          </LuminLink>
        </div>
      )}
    </header>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts.at(-1)![0] : "")).toUpperCase();
}
