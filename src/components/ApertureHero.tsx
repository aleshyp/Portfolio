"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Aperture case-study hero animation.
 *
 * Plays the brand's logo-reveal (a 16:9 WebM) ONCE when it scrolls into view,
 * then rests on the final logomark frame. Honors prefers-reduced-motion: those
 * users get the static poster (the animation's end frame) with no playback —
 * consistent with the rest of the site's motion language (see AnimatedReveal).
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
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const video = videoRef.current;
    if (!video) return;

    // Play once when the hero enters the viewport; hold on the last frame.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasPlayed) {
            video.play().catch(() => {
              // Autoplay can be blocked; the poster (final frame) still shows.
            });
            setHasPlayed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [shouldReduceMotion, hasPlayed]);

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
      // No `loop`, no `controls`: it plays through once and rests on frame 1-of-end.
    >
      <source src={SRC} type="video/webm" />
    </video>
  );
}
