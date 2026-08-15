"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

// The server has no `matchMedia`, so it renders the non-reduced markup; the
// client's first paint uses this same value and then re-renders if the real
// preference differs. That ordering is the whole point — see below.
function getServerSnapshot() {
  return false;
}

/**
 * `prefers-reduced-motion`, safe to branch render output on.
 *
 * Framer's `useReducedMotion()` can't be used to pick *markup*: there is no
 * `matchMedia` on the server, so it returns `null` there, and on a
 * reduced-motion client the very first render disagrees with the server HTML.
 * React reports that as a hydration mismatch and leaves the markup unpatched —
 * which stranded case-study scenes in their pre-animation state (bars at
 * `height={0}`, wordmarks at `opacity: 0`) and, because the whole tree failed to
 * hydrate, dropped attributes the a11y suite checks for.
 *
 * `useSyncExternalStore` fixes that by design: it takes a separate server
 * snapshot, so hydration compares like with like, then subscribes to the media
 * query for live changes.
 *
 * Use this ONLY where the preference picks different *markup* — a different
 * element (`LogoRevealHero`'s <img> vs <video>) or different SSR'd attribute
 * values (`MotionAsset`'s SVG geometry). Those are the cases React can't patch.
 *
 * Do NOT swap it in for components that merely hand the value to Framer Motion
 * props, like `AnimatedReveal` / `ProjectCard` / `Hero`. Those pass it to
 * `variants`, which Framer applies client-side without baking it into the
 * server HTML, so they hydrate cleanly on `useReducedMotion()` as-is — and they
 * need the preference on the *first* client render, because e2e contrast scans
 * rely on reduced motion painting them at rest (opacity 1) from first paint.
 * The one-render delay here would restart the fade and reintroduce the
 * mid-animation contrast flake that `e2e/a11y.spec.ts` documents at length.
 *
 * That delay is the tradeoff: one render at the non-reduced value before the
 * real preference lands. Acceptable for markup swaps, where the alternative is
 * a mismatch that aborts hydration and strands scenes mid-animation.
 */
export function useStableReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
