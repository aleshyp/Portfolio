"use client";

import { useRef } from "react";
import { usePlayOnceInView } from "@/lib/usePlayOnceInView";
import { useStableReducedMotion } from "@/lib/useStableReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Aperture case-study hero animation.
 *
 * Plays the brand's logo-reveal (a 16:9 WebM) ONCE when the user settles on it
 * (see `usePlayOnceInView`), then rests on the final logomark frame and reveals
 * the native video controls so it can be replayed. Honors
 * prefers-reduced-motion: those users get the static poster (the animation's
 * end frame) with no playback — consistent with the rest of the site's motion
 * language (see AnimatedReveal).
 *
 * The poster doubles as the pre-play / loading image, so the hero never flashes
 * a black box before the video is ready.
 */

const SRC = "/work/aperture/aperture-animation.webm";
const POSTER = "/work/aperture/logo-anim-poster.jpg";

type ApertureHeroProps = {
  className?: string;
  /** Accessible description of the animation. */
  alt: string;
};

export function ApertureHero({ className, alt }: ApertureHeroProps) {
  const shouldReduceMotion = useStableReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play once the hero has settled in view; holds on the last frame, then hands
  // the user the native controls so they can replay the reveal.
  const { hasEnded, onEnded } = usePlayOnceInView(videoRef, {
    enabled: !shouldReduceMotion,
  });

  // Reduced motion: render the poster as a plain image, no <video> playback.
  if (shouldReduceMotion) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={POSTER}
        alt={alt}
        width={1600}
        height={900}
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
      preload="metadata"
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
