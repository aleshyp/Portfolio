"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Play a case-study hero video once, when the user has actually settled on it.
 *
 * Shared by ApertureHero / LuminHero / NorthwindHero, which all want identical
 * behaviour: play through once, then rest on the final frame.
 *
 * Two details matter, and both exist because the cover sits *below* the title
 * and meta block on `/work/[slug]`. On load only a sliver of it is on screen:
 *
 * 1. `threshold: 0.6` — a low threshold fired on that sliver, so the reveal
 *    played while it was still mostly below the fold and the user arrived to a
 *    static end frame. Requiring most of the hero to be visible means playback
 *    waits until they've scrolled to it.
 *
 * 2. `SETTLE_MS` — even at 0.6, a fast scroll past the hero would start
 *    playback the instant it clipped the threshold. The timer holds off until
 *    the hero has stayed in view that long, and is cancelled if it leaves
 *    first, so the animation only starts for someone who's actually looking.
 *
 * Playback is one-shot: once started, the observer disconnects and the video is
 * never replayed for that mount.
 */

/** How long the hero must remain in view before the reveal starts. */
const SETTLE_MS = 700;

/** Fraction of the hero that must be visible to count as "in view". */
const THRESHOLD = 0.6;

export function usePlayOnceInView(
  videoRef: RefObject<HTMLVideoElement | null>,
  { enabled }: { enabled: boolean },
) {
  // A ref, not state: flipping state here would re-run the effect and rebuild
  // the observer mid-flight. Playback is one-shot per mount either way.
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (hasPlayed.current) return;

          if (entry.isIntersecting) {
            settleTimer ??= setTimeout(() => {
              hasPlayed.current = true;
              observer.disconnect();
              video.play().catch(() => {
                // Autoplay can be blocked; the poster (final frame) still shows.
              });
            }, SETTLE_MS);
          } else if (settleTimer !== undefined) {
            // Scrolled back out before settling — reset and wait for a real stop.
            clearTimeout(settleTimer);
            settleTimer = undefined;
          }
        }
      },
      { threshold: THRESHOLD },
    );

    observer.observe(video);
    return () => {
      clearTimeout(settleTimer);
      observer.disconnect();
    };
  }, [enabled, videoRef]);
}
