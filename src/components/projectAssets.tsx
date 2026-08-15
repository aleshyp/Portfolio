import { ApertureAsset, apertureScenes } from "@/components/ApertureAsset";
import { LogoRevealHero } from "@/components/LogoRevealHero";
import { LOGO_REVEALS } from "@/components/logoReveals";
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
import Image from "next/image";
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

// Northwind's scenes map to exported Figma frames under /public, same arrangement
// as Aperture above. Keyed by MarketingAsset scene name, so the hand-built SVG in
// MarketingAsset stays the fallback for any scene without an export.
//
// These are WebP re-encodes of the 3200×1800 Figma JPGs, downscaled to 2400w
// (the widest they're ever displayed, at 2x on a ~1200px container): 6.2 MB of
// JPG became 282 KB with no visible quality loss — flat UI screenshots compress
// far better as WebP than as photographic JPG. The source JPGs are kept in the
// repo as the re-encode masters. Unlike Aperture's raw <img> PNGs above, these
// go through next/image for srcset + lazy-loading.
const marketingWebp: Record<string, string> = {
  hero: "/work/northwind/v5-01-hero.webp",
  "value-props": "/work/northwind/v5-02-value-props.webp",
  "social-proof": "/work/northwind/v5-03-social-proof.webp",
  mobile: "/work/northwind/v5-04-mobile.webp",
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
   * fall back to the video's poster (its end frame) as a static image.
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

  // Aperture, Northwind and Lumin all open on a brand logo-reveal WebM (scene 0).
  // One branch serves them all so the case studies can't drift apart.
  const reveal = index === 0 ? LOGO_REVEALS[slug] : undefined;
  if (reveal) {
    if (!allowVideoHero) {
      // The video's poster IS the animation's end frame — the same image the
      // video rests on, without the playback cost. (Aperture's hand-drawn
      // `logomark` SVG predates the real Figma deliverable and no longer
      // matches it.)
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={reveal.poster}
          alt={alt}
          width={1600}
          height={900}
          className={cn("block object-cover shadow-soft", className)}
        />
      );
    }
    return (
      <div
        className={cn("overflow-hidden shadow-soft", className)}
        style={{ backgroundColor: reveal.backdrop }}
      >
        <LogoRevealHero slug={slug} alt={alt} />
      </div>
    );
  }

  if (assetSet.kind === "aperture") {
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
  const webp = marketingWebp[item.scene];
  if (webp) {
    return (
      <Image
        src={webp}
        alt={alt}
        width={2400}
        height={1350}
        // Case study: one column, capped at the prose container. Work grid: up to
        // three cards across. Without this, next/image assumes 100vw and ships a
        // far larger file than any slot actually renders.
        sizes="(min-width: 1024px) 50vw, 100vw"
        // The hero is the case study's LCP element — load it eagerly. Scenes
        // below the fold stay lazy (next/image's default).
        priority={index === 0}
        className={cn("block object-cover shadow-soft", className)}
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
