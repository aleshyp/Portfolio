"use client";

import { useEffect, useState } from "react";

/**
 * The horizontal line, in px from the top of the viewport, that decides which
 * section is "current". Sits just below the fixed navbar (h-16/h-20, plus the
 * 96px `scroll-mt-24` the sections already use for anchor landings), so the
 * section a reader is looking at under the header is the one that wins.
 */
const ACTIVE_LINE_PX = 136;

/**
 * Tracks which page section is currently in view, for the navbar's active-link
 * indicator. Returns the id of the section under the reading line, or `null`
 * above the first one (the hero) and on routes with none of them.
 *
 * ## Why a scroll listener and not IntersectionObserver
 *
 * An observer is the reflex here, and it was the first attempt — but it can't
 * express this rule. IO answers "is any part of the target inside the root
 * band", and these sections are far taller (up to ~2093px) than any useful
 * band, so several qualify at once and the tie has to be broken by hand.
 * Shrinking the band with a percentage `rootMargin` doesn't fix it: a tall
 * preceding section still overlaps the band while the section the reader has
 * actually reached has not yet entered it, so the highlight sits one or two
 * sections behind. Measured against ground truth, the `rootMargin` variants
 * scored 0/5 correct; this line test scores 5/5.
 *
 * The sections tile exactly — each one's bottom is the next one's top — so
 * "which box straddles this line" has exactly one answer at any scroll offset,
 * with no tie-break and no ambiguity. That is the rule we actually want, and
 * `getBoundingClientRect` states it directly.
 *
 * Cost is a scroll handler, kept cheap deliberately: it is passive, coalesced
 * to one read per animation frame (so a fast scroll measures once per paint,
 * not once per event), and it only calls `setState` when the id actually
 * changes — so steady scrolling inside one long section triggers no re-renders
 * at all.
 *
 * Motion-independent: this reads scroll position only, and the consumer renders
 * the result as a static style change, so there is nothing to gate behind
 * `prefers-reduced-motion`.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= ACTIVE_LINE_PX && bottom > ACTIVE_LINE_PX) {
          current = id;
          break;
        }
      }
      // Only re-render on an actual change: scrolling within one section is by
      // far the common case, and it should cost nothing.
      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      // Coalesce to one measurement per frame.
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    // Measure once on mount so a deep link (/#skills) or a restored scroll
    // position starts with the right link lit, rather than waiting for a scroll.
    measure();

    window.addEventListener("scroll", onScroll, { passive: true });
    // Section offsets move when the viewport resizes (text reflows, the grid
    // switches columns), so re-measure there too.
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  return active;
}
