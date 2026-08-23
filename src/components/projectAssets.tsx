import { ApertureAsset, apertureScenes } from "@/components/ApertureAsset";
import { ApertureHero } from "@/components/ApertureHero";
import { NorthwindAsset, northwindScenes } from "@/components/NorthwindAsset";
import { LuminAsset, luminScenes } from "@/components/LuminAsset";
import { LuminHero } from "@/components/LuminHero";
import { NorthwindHero } from "@/components/NorthwindHero";
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
 * If an asset component ever needs "use client", split its scene list into its own
 * module — a plain const exported across the client boundary arrives EMPTY on the
 * server and silently drops the gallery back to the gradient Placeholder.
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

/**
 * Card thumbnails for the projects whose hero IS a logo animation.
 *
 * These are the animations' own poster frames — the still the video rests on —
 * so a card shows the same resting logo the case-study hero settles into, with
 * no playback in a seven-card grid. Kept in sync with the POSTER constants in
 * ApertureHero/LuminHero: same file, one per project.
 *
 * Only these three projects have an animation. Every other project's thumbnail
 * stays its generated SVG scene, which is the only imagery it has.
 */
const heroStill: Record<string, { src: string; width: number; height: number }> =
  {
    "brand-identity-system": {
      src: "/work/aperture/logo-anim-poster.jpg",
      width: 1600,
      height: 900,
    },
    "learning-platform-ui": {
      src: "/work/lumin/lumin-anim-poster.webp",
      width: 1600,
      height: 900,
    },
    "marketing-landing-page": {
      src: "/work/northwind/northwind-anim-poster.jpg",
      width: 1600,
      height: 900,
    },
  };

type AssetKind =
  | "aperture"
  | "marketing"
  | "lumin"
  | "portfolio-system";

type AssetSet = {
  scenes: { scene: string; alt: string }[];
  kind: AssetKind;
  /**
   * True when the scenes carry their OWN aspect ratio and must not be forced
   * into the gallery's default 16:9 box. Lumin's screens are full-page captures
   * (up to ~1:3), so cropping them to 16:9 would hide most of the design; the
   * case study reads this and drops its fixed-ratio class for those sets.
   */
  intrinsicRatio?: boolean;
};

const assetSets: Record<string, AssetSet> = {
  "portfolio-design-system": {
    scenes: portfolioSystemScenes,
    kind: "portfolio-system",
  },
  "brand-identity-system": { scenes: apertureScenes, kind: "aperture" },
  "marketing-landing-page": {
    scenes: northwindScenes,
    kind: "marketing",
    // The four numbered frames are 16:9, but the full-page screens run up to
    // ~1:2.6 — same situation as Lumin, so the study sizes each from its own
    // intrinsic ratio rather than a shared box.
    intrinsicRatio: true,
  },
  "learning-platform-ui": {
    scenes: luminScenes,
    kind: "lumin",
    intrinsicRatio: true,
  },
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

  // Hero slot, playback suppressed (the Work grid) — show the animation's still
  // rather than a substitute. Aperture's SVG logomark is a DIFFERENT mark from
  // the one the animation rests on, and Lumin's scene 0 is a product screenshot
  // cropped to 16:9, so both cards previously showed something the case-study
  // hero never settles into. The poster is that resting frame exactly.
  const still = index === 0 && !allowVideoHero ? heroStill[slug] : undefined;
  if (still) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={still.src}
        alt={alt}
        width={still.width}
        height={still.height}
        className={cn("block object-cover", className)}
      />
    );
  }

  if (assetSet.kind === "aperture") {
    // Aperture ships real Figma deliverables: the hero (scene 0) is the brand
    // logo-reveal animation; scenes 1–4 are exported PNG frames.
    if (index === 0) {
      if (!allowVideoHero) {
        // Reached only if `heroStill` loses its Aperture entry — the still above
        // is the real no-playback path. The SVG logomark is a related but
        // distinct mark, so it's a fallback, not an equivalent.
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

  if (assetSet.kind === "lumin") {
    // Like Aperture, Lumin's hero (scene 0) is a logo-reveal animation; the rest
    // are exported product screens at their own aspect ratios.
    if (index === 0 && allowVideoHero) {
      return (
        <div className={cn("overflow-hidden shadow-soft", className)}>
          <LuminHero alt={alt} />
        </div>
      );
    }
    return (
      <LuminAsset
        scene={item.scene as Parameters<typeof LuminAsset>[0]["scene"]}
        alt={alt}
        className={className}
        // Card-sized contexts (allowVideoHero: false) need a uniform thumbnail,
        // so pin it to 16:9 and crop from the top. The case study passes no
        // ratio and shows each screen whole. Scene 0 no longer arrives here in
        // a card — the hero still handles it — but the later screens still do.
        ratio={allowVideoHero ? undefined : 16 / 9}
      />
    );
  }
  if (assetSet.kind === "portfolio-system") {
    return (
      <PortfolioSystemAsset
        scene={
          item.scene as Parameters<typeof PortfolioSystemAsset>[0]["scene"]
        }
        alt={alt}
        className={className}
      />
    );
  }
  // Northwind ("marketing"), like Aperture and Lumin, opens on a logo-reveal
  // animation; every other scene is a real exported screen.
  //
  // This is the last branch because it's the last asset KIND — `marketing` was
  // previously the implicit fallback, rendering MarketingAsset's hand-built SVG
  // mockups. Those exports now cover every Northwind scene, so MarketingAsset is
  // no longer rendered anywhere; it stays in the tree as the record of what the
  // study looked like before the real screens landed. If a new kind is added,
  // give it its own branch above rather than letting it fall through to here.
  if (index === 0 && allowVideoHero) {
    return (
      <div className={cn("overflow-hidden bg-ink shadow-soft", className)}>
        <NorthwindHero alt={alt} />
      </div>
    );
  }
  return (
    <NorthwindAsset
      scene={item.scene as Parameters<typeof NorthwindAsset>[0]["scene"]}
      alt={alt}
      className={className}
      // Card-sized contexts need a uniform thumbnail, so pin the tall captures
      // to 16:9 and crop from the top; the case study shows each screen whole.
      ratio={allowVideoHero ? undefined : 16 / 9}
    />
  );
}
