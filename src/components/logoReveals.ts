/**
 * Per-project logo-reveal animation + poster paths, keyed by project slug.
 *
 * Deliberately split out of `LogoRevealHero.tsx`: that file is a client
 * component ("use client", for useStableReducedMotion), and a server component
 * importing a plain const across the client boundary gets `undefined` at render
 * time — which crashed the Work grid's prerender. Data lives here, in a
 * server-importable module; the component stays client-side. Same arrangement
 * as ./motionScenes.
 *
 * One definition so a case-study hero and its Work grid card thumbnail (which
 * uses the poster — no video in a six-card grid) can't drift apart.
 */
export const LOGO_REVEALS: Record<
  string,
  {
    src: string;
    poster: string;
    /**
     * The animation's own field color, shown while the video loads and in any
     * letterboxing. A CSS color rather than a token class: these are fictional
     * CLIENTS' brand colors, deliberately not portfolio tokens — the same
     * reasoning that keeps Lumin's palette local to LearningAsset.
     */
    backdrop: string;
  }
> = {
  "brand-identity-system": {
    src: "/work/aperture/aperture-animation.webm",
    poster: "/work/aperture/logo-anim-poster.jpg",
    backdrop: "#0b1220", // deep indigo field (matches ink)
  },
  "marketing-landing-page": {
    src: "/work/northwind/northwind-animation.webm",
    poster: "/work/northwind/logo-anim-poster.jpg",
    backdrop: "#0b1220", // dark navy field (matches ink)
  },
  // Lumin's reveal resolves on a soft lavender field, not the dark navy the
  // other two use — a navy frame around this one would read as a bug.
  "learning-platform-ui": {
    src: "/work/lumin/lumin-animation.webm",
    poster: "/work/lumin/logo-anim-poster.jpg",
    backdrop: "#F3F0FF", // = LearningAsset's `mist`, Lumin's page background
  },
};
