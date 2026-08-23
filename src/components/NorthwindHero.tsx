"use client";

import { useEffect, useRef, useState } from "react";
import { useStableReducedMotion } from "@/lib/useStableReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Northwind case-study hero animation.
 *
 * Same contract as ApertureHero/LuminHero: plays the brand logo-reveal (a 16:9
 * WebM) ONCE when it scrolls into view, then rests on the final cyan lockup.
 * prefers-reduced-motion users get the static poster — which IS the animation's
 * end frame — with no playback, matching the rest of the site's motion language.
 *
 * The poster doubles as the pre-play image so the hero never flashes an empty box.
 */

const SRC = "/work/northwind/northwind-animation.webm";
const POSTER = "/work/northwind/northwind-anim-poster.jpg";

type NorthwindHeroProps = {
  className?: string;
  /** Accessible description of the animation. */
  alt: string;
};

export function NorthwindHero({ className, alt }: NorthwindHeroProps) {
  const shouldReduceMotion = useStableReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const video = videoRef.current;
    if (!video) return;

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
      // No `loop`, no `controls`: plays through once and rests on the final frame.
    >
      <source src={SRC} type="video/webm" />
    </video>
  );
}
