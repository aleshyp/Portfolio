/**
 * Cadence's ordered case-study scenes.
 *
 * Deliberately split out of `MotionAsset.tsx`: that file is a client component
 * ("use client", for useReducedMotion), and a server component importing a
 * plain const across the client boundary gets an EMPTY array at render time —
 * which silently drops the whole gallery back to the gradient Placeholder. Data
 * lives here, in a server-importable module; the component stays client-side.
 *
 * The other asset sets (Aperture, Northwind, Lumin, Fernweh, Halyard) are pure
 * server components, so they can keep their scene arrays in-file.
 */

export type MotionScene =
  | "logo-build"
  | "easing"
  | "kinetic-type"
  | "transitions"
  | "system";

export const motionScenes: { scene: MotionScene; alt: string }[] = [
  {
    scene: "logo-build",
    alt: "Cadence's logo build — four equaliser bars rise from a baseline and settle into the brand mark, then the Cadence wordmark and the line 'Sound in motion' fade up beneath it. Labelled 'Logo build · 1.6s'.",
  },
  {
    scene: "easing",
    alt: "The three motion curves — Entrance (fast in, soft landing), Exit (gathers speed, leaves), and Transition (even on both ends) — each plotted with a dot travelling the curve and its cubic-bezier spec listed below.",
  },
  {
    scene: "kinetic-type",
    alt: "Kinetic type templates shown as four timed frames at 0.0s, 0.3s, 0.6s and 1.2s, where the words 'New this week' enter one at a time and the final word takes emphasis, above a spec strip listing the stagger, easing, and hold timings.",
  },
  {
    scene: "transitions",
    alt: "The transition library — six preset cards (Wipe, Push, Fade through, Mark in, Lower third, Beat cut), each sketched as a frame-to-frame arrow diagram with its duration.",
  },
  {
    scene: "system",
    alt: "Outcome — a magenta-to-indigo banner reading 'The brand moves the same way everywhere it plays' beside a waveform, above three stats: 24 motion assets delivered, 6s average render length, and 10+ reusable presets.",
  },
];
