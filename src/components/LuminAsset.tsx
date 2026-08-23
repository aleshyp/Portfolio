import { cn } from "@/lib/utils";

/**
 * Lumin — case-study assets for the online-learning-platform study.
 *
 * These are real exported screens from the Lumin product design (WebP, capped at
 * 1800px wide), replacing the hand-built SVG mockups that stood in before them.
 *
 * Unlike the other asset sets, these are NOT all 16:9. Lumin's marketing pages
 * are full-page captures — the homepage is nearly 1:3 — so each scene carries its
 * own intrinsic width/height and the case study sizes the frame from that ratio.
 * Forcing them into a shared 16:9 box would crop away most of the page, which is
 * the part worth showing.
 *
 * How these files were produced, if a screen is ever re-exported from Figma:
 * resize to a max width of 1800px (width, not longest edge — capping the long
 * edge squeezes a tall full-page capture down to ~700px wide and it goes soft),
 * then encode WebP at quality 82. That took ~27MB of source JPEGs to under 1MB.
 *
 * `onboarding`, `signup` and `website-login` came out of Figma centered on a
 * much larger blank canvas, and were trimmed to the actual artboard before
 * resizing (sharp's `.trim({ threshold: 12 })`). Skipping that step leaves the
 * screen floating in a wide band of whitespace. The other seven need no trim.
 *
 * Any re-export must update DIMENSIONS below to the new intrinsic size —
 * a stale entry doesn't fail the build, it silently distorts the frame and
 * reintroduces layout shift.
 */

type Scene =
  | "homepage"
  | "catalog"
  | "detail"
  | "mentors"
  | "pricing"
  | "resources"
  | "onboarding"
  | "signup"
  | "website-login"
  | "emptycatalog";

/** Intrinsic dimensions of each export — drives both `aspect-ratio` and CLS-free layout. */
const DIMENSIONS: Record<Scene, { w: number; h: number }> = {
  homepage: { w: 1800, h: 5133 },
  catalog: { w: 1800, h: 1751 },
  detail: { w: 1800, h: 2649 },
  mentors: { w: 1800, h: 2523 },
  pricing: { w: 1800, h: 1451 },
  resources: { w: 1800, h: 2515 },
  onboarding: { w: 1800, h: 1241 },
  signup: { w: 1800, h: 1125 },
  "website-login": { w: 1800, h: 1125 },
  emptycatalog: { w: 1800, h: 1428 },
};

type LuminAssetProps = {
  scene: Scene;
  className?: string;
  /** Accessible description of the screen. Empty string renders it decorative. */
  alt: string;
  /**
   * Constrain very tall full-page captures. The Work-grid card needs a uniform
   * thumbnail, so it passes a ratio and the image crops from the top; the case
   * study leaves this off and shows the whole page.
   */
  ratio?: number;
};

export function LuminAsset({ scene, className, alt, ratio }: LuminAssetProps) {
  const { w, h } = DIMENSIONS[scene];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/work/lumin/${scene}.webp`}
      alt={alt}
      width={w}
      height={h}
      loading="lazy"
      decoding="async"
      style={{ aspectRatio: ratio ?? `${w} / ${h}` }}
      className={cn(
        "block w-full bg-surface-raised shadow-soft",
        // Cropping from the top keeps the header/hero visible when a ratio is
        // imposed; without one the natural ratio means there's nothing to crop.
        ratio ? "object-cover object-top" : "object-contain",
        className,
      )}
    />
  );
}

/**
 * Scene order maps to the case study's structure, so each screen lands beside
 * the block it illustrates:
 *
 *   0 homepage    → hero (the video plays here; this is the card thumbnail and
 *                   the reduced-motion still)
 *   1 onboarding  → "The problem"    — the first-run path students dropped off
 *   2 catalog     → "Design goals"   — making the next action obvious
 *   3 detail      → "The solution"   — the lesson/curriculum view with progress
 *   4 mentors     → "Outcome"        — the payoff screen
 *
 * Scenes past index 4 aren't rendered by the current four-block study; they stay
 * here so a new block (or a future gallery section) can pull one in without
 * re-exporting anything.
 */
export const luminScenes: { scene: Scene; alt: string }[] = [
  {
    scene: "homepage",
    alt: "Lumin marketing homepage with a 'Master the craft of digital design' hero above a video player, three lesson-format cards (Interactive Video, Real-world Tasks, Guided Paths), a popular-courses row, and student testimonials.",
  },
  {
    scene: "onboarding",
    alt: "Onboarding step 1 of 3, headed 'What do you want to learn?', with eight selectable interest tiles (UI/UX Design selected), a Continue button, and a 'Skip for now' escape hatch.",
  },
  {
    scene: "catalog",
    alt: "Course catalog with a search field and category filter chips above a grid of course cards, each showing its category, title, instructor, star rating, length, and an Enroll button.",
  },
  {
    scene: "detail",
    alt: "Course detail page for 'Design Systems for Scale', showing a violet hero with instructor and last-updated date, a sticky $149 enrollment card, a three-module curriculum with completion checkmarks, and student reviews.",
  },
  {
    scene: "mentors",
    alt: "Mentors directory headed 'Learn from the best in the craft', above a filterable grid of mentor cards showing photo, expertise tags, role, rating and review count, each with a 'Book a Session' button.",
  },
  {
    scene: "pricing",
    alt: "Pricing page with three tiers (Free, Pro at $29/mo highlighted in violet, Team at $99/mo) with feature checklists, above a 'Need help choosing?' discovery-call prompt.",
  },
  {
    scene: "resources",
    alt: "Free resource library with filter chips above a grid of downloadable templates, guides, toolkits and checklists, each with a description and Download Free button, over a newsletter sign-up band.",
  },
  {
    scene: "emptycatalog",
    alt: "Catalog empty state where a search for 'Advanced Motion' returns 'No courses found' with a friendly illustration and a 'Browse all courses' recovery action.",
  },
  {
    scene: "signup",
    alt: "Create-account screen in a split layout, with 'Your next skill is waiting' and social-proof stats on the left, and a name/email/password form with Google and GitHub options on the right.",
  },
  {
    scene: "website-login",
    alt: "Log-in screen headed 'Welcome back', with completion-rate and active-learner stats beside an email and password form, social log-in options, and a link to sign up.",
  },
];
