"use client";

import { useEffect, useRef, useState } from "react";
import { useStableReducedMotion } from "@/lib/useStableReducedMotion";
import { LOGO_REVEALS } from "@/components/logoReveals";
import { cn } from "@/lib/utils";

/**
 * Case-study hero animation: a brand logo-reveal.
 *
 * Plays a 16:9 WebM ONCE when it scrolls into view, then rests on the final
 * logomark frame. Honors prefers-reduced-motion: those users get the static
 * poster (the animation's end frame) with no playback — consistent with the
 * rest of the site's motion language (see AnimatedReveal).
 *
 * The poster doubles as the pre-play / loading image, so the hero never flashes
 * a black box before the video is ready.
 *
 * Shared by every project whose hero is a logo reveal (Aperture, Northwind,
 * Lumin).
 * Each project's paths live in ./logoReveals — a server-importable module, so
 * the Work grid (a server component) can read the poster without crossing this
 * file's client boundary.
 */

type LogoRevealHeroProps = {
  className?: string;
  /** Project slug — selects the animation from LOGO_REVEALS. */
  slug: string;
  /** Accessible description of the animation. */
  alt: string;
};

export function LogoRevealHero({ className, slug, alt }: LogoRevealHeroProps) {
  const shouldReduceMotion = useStableReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const reveal = LOGO_REVEALS[slug];

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

  // A slug with no registered animation renders nothing rather than an empty
  // <video>; callers fall back to the project's other scenes.
  if (!reveal) return null;

  // Reduced motion: render the poster as a plain image, no <video> playback.
  if (shouldReduceMotion) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={reveal.poster}
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
      poster={reveal.poster}
      muted
      playsInline
      preload="metadata"
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      // No `loop`, no `controls`: it plays through once and rests on frame 1-of-end.
    >
      <source src={reveal.src} type="video/webm" />
    </video>
  );
}
