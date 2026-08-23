import { cn } from "@/lib/utils";

/**
 * Northwind — case-study assets for the marketing-landing-page study.
 *
 * Real exported screens from the Northwind marketing site design (WebP, capped
 * at 1800px wide), replacing the hand-built SVG mockups in MarketingAsset that
 * stood in before them. MarketingAsset stays in the tree as the fallback for any
 * scene without an export, the same way ApertureAsset backs Aperture's PNGs.
 *
 * Two kinds of asset live here, which is why the ratios vary so much:
 *
 *   - `01-hero` … `04-mobile` are 16:9 case-study frames — composed presentation
 *     boards, one per block of the study, mirroring Aperture's numbered frames.
 *   - the rest are full-page screen captures (product is nearly 1:2.6), so each
 *     carries its own intrinsic width/height and the case study sizes the frame
 *     from that ratio. Forcing them into a shared 16:9 box would crop away most
 *     of the page, which is the part worth showing.
 *
 * How these files were produced, if a screen is ever re-exported from Figma:
 * resize to a max width of 1800px (width, not longest edge — capping the long
 * edge squeezes a tall full-page capture down to ~700px wide and it goes soft),
 * then encode WebP at quality 82. That took ~34MB of source JPEGs to under 1MB.
 *
 * Any re-export must update DIMENSIONS below to the new intrinsic size —
 * a stale entry doesn't fail the build, it silently distorts the frame and
 * reintroduces layout shift.
 */

type Scene =
  | "01-hero"
  | "02-value-props"
  | "03-social-proof"
  | "04-mobile"
  | "product"
  | "pricing"
  | "docs"
  | "about"
  | "community"
  | "login"
  | "signup"
  | "forgot-password";

/** Intrinsic dimensions of each export — drives both `aspect-ratio` and CLS-free layout. */
const DIMENSIONS: Record<Scene, { w: number; h: number }> = {
  "01-hero": { w: 1800, h: 1013 },
  "02-value-props": { w: 1800, h: 1013 },
  "03-social-proof": { w: 1800, h: 1013 },
  "04-mobile": { w: 1800, h: 1013 },
  product: { w: 1800, h: 4682 },
  pricing: { w: 1800, h: 2873 },
  docs: { w: 1800, h: 2579 },
  about: { w: 1800, h: 3866 },
  community: { w: 1800, h: 3674 },
  login: { w: 1800, h: 1013 },
  signup: { w: 1800, h: 1013 },
  "forgot-password": { w: 1800, h: 1013 },
};

type NorthwindAssetProps = {
  scene: Scene;
  className?: string;
  /** Accessible description of the screen. Empty string renders it decorative. */
  alt: string;
  /**
   * Constrain very tall full-page captures. The card grid needs a uniform
   * thumbnail, so it passes a ratio and the image crops from the top; the case
   * study leaves this off and shows the whole page.
   */
  ratio?: number;
};

export function NorthwindAsset({
  scene,
  className,
  alt,
  ratio,
}: NorthwindAssetProps) {
  const { w, h } = DIMENSIONS[scene];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/work/northwind/${scene}.webp`}
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
 * Scene order maps to the case study's structure: the four composed 16:9 frames
 * carry the narrative blocks, then the full-page screens show the built site.
 *
 *   0 01-hero          → the hero SLOT: projectAssets renders NorthwindHero (the
 *                        logo-reveal video) here, so this entry's alt describes
 *                        the animation and its `scene` is only the still used if
 *                        that interception is ever removed.
 *   1 01-hero          → the landing view, as a gallery frame
 *   2 02-value-props   → "Clarity, not more charts"
 *   3 03-social-proof  → metrics, testimonial, closing CTA
 *   4 04-mobile        → the responsive story
 *   5+ full-page screens — product, pricing, docs, about, community, then the
 *      three auth screens.
 */
export const northwindScenes: { scene: Scene; alt: string }[] = [
  {
    // Scene 0 fills the hero slot, where projectAssets swaps in NorthwindHero
    // (the logo-reveal video) — so this alt describes the ANIMATION, not the
    // frame below it. The 16:9 landing view returns as scene 1.
    scene: "01-hero",
    alt: "Northwind logo animation in which the cyan rounded-square mark with its paired up and down triangles resolves beside the 'Northwind' wordmark on a deep navy grid.",
  },
  {
    scene: "01-hero",
    alt: "Northwind homepage hero with the 'See what your team actually ships.' headline over start-trial and book-a-demo buttons, beside a weekly-velocity bar chart, a 47-PRs card, a +12% velocity card, and a 12k+ teams stat.",
  },
  {
    scene: "02-value-props",
    alt: "Value-props section headed 'Clarity, not more charts.' beside three numbered cards: One digest every Monday, Connect in two clicks, and Every teammate same picture.",
  },
  {
    scene: "03-social-proof",
    alt: "Social-proof section showing +22% trial conversion, a 4.9/5 average rating, 12k+ teams, a testimonial from Priya Nair reading 'We replaced three dashboards with one Monday-morning email,' and a 'Ready to see what your team ships?' call-to-action band.",
  },
  {
    scene: "04-mobile",
    alt: "Responsive view of the Northwind dashboard on a phone showing weekly velocity, PRs merged and average review time, beside the heading 'Designed mobile-first.' and its supporting bullets.",
  },
  {
    scene: "product",
    alt: "Product page headed 'The engineering hub for high-velocity teams.' above a PR-merge-velocity dashboard, a Weekly Velocity Digest panel, a real-time PR-tracking section, an integrations row, and a 'Stop babysitting dashboards' closing band.",
  },
  {
    scene: "pricing",
    alt: "Pricing page headed 'Transparent pricing for every team scale' above three tiers (Starter free, Team at $12 highlighted in cyan, Enterprise custom) with feature checklists, a six-row feature-comparison table, and a 'Stop babysitting dashboards' closing band.",
  },
  {
    scene: "docs",
    alt: "Documentation page showing a 'Quick Start Guide' article with a docs sidebar (Getting Started, Integrations, API Reference, CLI), numbered install steps with copyable bash snippets, and a Slack integration settings panel of toggles.",
  },
  {
    scene: "about",
    alt: "About page headed 'We make engineering work visible.' above the team grid, four core-value cards (Transparency, Speed, Signal over Noise, Builder-first), the investor row, and a 'Come build the future of visibility' hiring band.",
  },
  {
    scene: "community",
    alt: "Community page headed 'Built by engineers, for engineers.' above a Recent Discussions row, growth stats (4,200+ engineers, 890+ teams, 120+ countries), a 'Trending this week' thread grid, and a 'Ready to share what you have built?' band.",
  },
  {
    scene: "login",
    alt: "Log-in screen with a 'Welcome back' card offering a Continue-with-GitHub option, email and password fields, a Sign in button, and a trusted-by logo row.",
  },
  {
    scene: "signup",
    alt: "Create-account screen with a 'Create your account' card offering a Continue-with-GitHub option, full-name, work-email and password fields, a 'Get started for free' button, and a link back to sign in.",
  },
  {
    scene: "forgot-password",
    alt: "Password-reset screen with a 'Reset your password' card containing an email field, a Send reset link button, and a back-to-sign-in link.",
  },
];
