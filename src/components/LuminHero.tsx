"use client";

import { useRef } from "react";
import { usePlayOnceInView } from "@/lib/usePlayOnceInView";
import { useStableReducedMotion } from "@/lib/useStableReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Lumin case-study hero animation.
 *
 * Same contract as ApertureHero: plays the brand logo-reveal (a 16:9 WebM) ONCE
 * when the user settles on it, then rests on the final lockup with the native
 * controls revealed for a replay. prefers-reduced-motion users get the static
 * poster — which IS the animation's end frame — with no playback, matching the
 * rest of the site's motion language.
 *
 * The poster doubles as the pre-play image so the hero never flashes an empty box.
 */

const SRC = "/work/lumin/lumin-animation.webm";
const POSTER = "/work/lumin/lumin-anim-poster.webp";

type LuminHeroProps = {
  className?: string;
  /** Accessible description of the animation. */
  alt: string;
};

export function LuminHero({ className, alt }: LuminHeroProps) {
  const shouldReduceMotion = useStableReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { hasEnded, onEnded } = usePlayOnceInView(videoRef, {
    enabled: !shouldReduceMotion,
  });

  if (shouldReduceMotion) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={POSTER}
        alt={alt}
        width={1600}
        height={900}
        fetchPriority="high"
        className={cn("block h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={cn("block h-full w-full object-cover", className)}
      poster={POSTER}
      muted
      playsInline
      // `none`, not `metadata`: the poster IS the resting frame, so nothing needs
      // decoding until the hero scrolls into view. Fetching video metadata up
      // front competes with the poster — the actual above-the-fold pixels — for
      // bandwidth and measurably delays the cover's paint.
      preload="none"
      aria-label={alt}
      // No `loop`: plays through once and rests on the final frame. `controls`
      // appears only after it has ended, so the reveal is uncluttered on first
      // watch but rewindable afterwards.
      controls={hasEnded}
      onEnded={onEnded}
    >
      <source src={SRC} type="video/webm" />
    </video>
  );
}
