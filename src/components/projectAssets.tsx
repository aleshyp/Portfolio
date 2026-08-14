import { ApertureAsset, apertureScenes } from "@/components/ApertureAsset";
import { ApertureHero } from "@/components/ApertureHero";
import { MarketingAsset, marketingScenes } from "@/components/MarketingAsset";
import { LearningAsset, learningScenes } from "@/components/LearningAsset";
import { OnboardingAsset, onboardingScenes } from "@/components/OnboardingAsset";
import { SystemAsset, systemScenes } from "@/components/SystemAsset";
import { MotionAsset } from "@/components/MotionAsset";
import { motionScenes } from "@/components/motionScenes";
import {
  PortfolioSystemAsset,
  portfolioSystemScenes,
} from "@/components/PortfolioSystemAsset";
import { cn } from "@/lib/utils";

/**
 * Maps a project slug to its case-study scene set, and renders a scene by index.
 *
 * Shared by the case study page (full gallery) and the Work grid (hero scene as
 * the card thumbnail) so the two can't drift — a project with real assets shows
 * them in both places, from one definition.
 *
 * Server-only by design: the scene DATA must be importable by server components.
 * MotionAsset is a client component ("use client" for useReducedMotion), which is
 * why Cadence's scenes live in ./motionScenes rather than in the component file —
 * a plain const exported across the client boundary arrives EMPTY on the server
 * and silently drops the gallery back to the gradient Placeholder.
 */

// Aperture's non-hero scenes map to exported Figma PNG frames (@2x, 3200×1800)
// under /public. Keyed by ApertureAsset scene name so the SVG stays the fallback
// for any scene without a PNG.
const aperturePng: Record<string, string> = {
  "logo-construction": "/work/aperture/02-logo-construction@2x.png",
  palette: "/work/aperture/03-palette@2x.png",
  "type-specimen": "/work/aperture/04-type-specimen@2x.png",
  usage: "/work/aperture/05-usage@2x.png",
};

type AssetKind =
  | "aperture"
  | "marketing"
  | "learning"
  | "onboarding"
  | "system"
  | "portfolio-system"
  | "motion";

type AssetSet = {
  scenes: { scene: string; alt: string }[];
  kind: AssetKind;
};

const assetSets: Record<string, AssetSet> = {
  "portfolio-design-system": {
    scenes: portfolioSystemScenes,
    kind: "portfolio-system",
  },
  "brand-identity-system": { scenes: apertureScenes, kind: "aperture" },
  "marketing-landing-page": { scenes: marketingScenes, kind: "marketing" },
  "learning-platform-ui": { scenes: learningScenes, kind: "learning" },
  "mobile-app-onboarding": { scenes: onboardingScenes, kind: "onboarding" },
  "design-system": { scenes: systemScenes, kind: "system" },
  "motion-brand-identity": { scenes: motionScenes, kind: "motion" },
};

export function getAssetSet(slug: string): AssetSet | null {
  return assetSets[slug] ?? null;
}

type RenderOptions = {
  /**
   * Aperture's hero is a <video> logo reveal. It's right for the case study, but
   * a card thumbnail shouldn't autoplay video in a six-card grid — pass false to
   * fall back to the static SVG logomark.
   */
  allowVideoHero?: boolean;
  /**
   * Render the scene as decorative — no accessible name at all.
   *
   * On a case study the scene IS the content, so its long alt earns its place.
   * In the Work grid the card's heading already names the project, so exposing
   * the same paragraph would bury the link's real name and leave the alt text
   * matchable by name (it collided with the contact form's "Name" field). The
   * card wrapper is aria-hidden too; this drops the label from the DOM.
   */
  decorative?: boolean;
};

/**
 * Renders scene `index` (hero = 0) from `slug`'s asset set, or null if the
 * project has no assets yet — callers fall back to <Placeholder>.
 */
export function renderProjectScene(
  slug: string,
  index: number,
  className: string,
  { allowVideoHero = true, decorative = false }: RenderOptions = {},
) {
  const assetSet = getAssetSet(slug);
  const item = assetSet?.scenes[index];
  if (!assetSet || !item) return null;

  // Empty alt = decorative. Each asset component drops role="img"/aria-label
  // when alt is falsy, so nothing reaches the accessibility tree.
  const alt = decorative ? "" : item.alt;

  if (assetSet.kind === "aperture") {
    // Aperture ships real Figma deliverables: the hero (scene 0) is the brand
    // logo-reveal animation; scenes 1–4 are exported PNG frames.
    if (index === 0) {
      if (!allowVideoHero) {
        // The logomark scene is the animation's end frame — the same image the
        // video rests on, without the playback cost.
        return (
          <ApertureAsset scene="logomark" alt={alt} className={className} />
        );
      }
      return (
        <div className={cn("overflow-hidden bg-ink shadow-soft", className)}>
          <ApertureHero alt={alt} />
        </div>
      );
    }
    const png = aperturePng[item.scene];
    if (png) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={png}
          alt={alt}
          width={3200}
          height={1800}
          className={cn("block object-cover shadow-soft", className)}
        />
      );
    }
    return (
      <ApertureAsset
        scene={item.scene as Parameters<typeof ApertureAsset>[0]["scene"]}
        alt={alt}
        className={className}
      />
    );
  }

  if (assetSet.kind === "learning") {
    return (
      <LearningAsset
        scene={item.scene as Parameters<typeof LearningAsset>[0]["scene"]}
        alt={alt}
        className={className}
      />
    );
  }
  if (assetSet.kind === "onboarding") {
    return (
      <OnboardingAsset
        scene={item.scene as Parameters<typeof OnboardingAsset>[0]["scene"]}
        alt={alt}
        className={className}
      />
    );
  }
  if (assetSet.kind === "portfolio-system") {
    return (
      <PortfolioSystemAsset
        scene={item.scene as Parameters<typeof PortfolioSystemAsset>[0]["scene"]}
        alt={alt}
        className={className}
      />
    );
  }
  if (assetSet.kind === "system") {
    return (
      <SystemAsset
        scene={item.scene as Parameters<typeof SystemAsset>[0]["scene"]}
        alt={alt}
        className={className}
      />
    );
  }
  if (assetSet.kind === "motion") {
    return (
      <MotionAsset
        scene={item.scene as Parameters<typeof MotionAsset>[0]["scene"]}
        alt={alt}
        className={className}
      />
    );
  }
  return (
    <MarketingAsset
      scene={item.scene as Parameters<typeof MarketingAsset>[0]["scene"]}
      alt={alt}
      className={className}
    />
  );
}
