import Image from "next/image";

import { ApertureAsset, apertureScenes } from "@/components/ApertureAsset";
import { ApertureHero } from "@/components/ApertureHero";
import { NorthwindAsset, northwindScenes } from "@/components/NorthwindAsset";
import { LedgerAsset, ledgerScenes } from "@/components/LedgerAsset";
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
 * NOT the animation poster frames, which is what these used to be. A poster is
 * the still the video RESTS on — for all three projects that's the end-card: a
 * small logo centered in a large empty field. Technically pristine (they're
 * flat vector on flat background, and next/image serves them at full retina
 * resolution), but as a thumbnail it's ~15% mark and ~85% background, so three
 * of four cards in the Work grid read as blank next to the design-system card's
 * dense token table. That contrast is what reads as "low quality" — it's a
 * content problem, not a compression one.
 *
 * So each card points at a representative SCENE from its own case study: real
 * designed work, at the same size, showing craft rather than a logo. The
 * case-study hero still plays its animation; only the grid thumbnail changed.
 *
 * Chosen for what survives at ~526px wide in a 2-up grid:
 *   - Aperture     type specimen — dark, high-contrast, unmistakably brand work
 *   - Northwind    the homepage hero it already uses as scene 1
 *   - Lumin        course detail — the violet hero block gives it its own
 *                  colour identity, distinct from Northwind's card grid
 *
 * `width`/`height` are the file's INTRINSIC size, so next/image reserves the
 * right box and picks a sane candidate.
 *
 * `position` sets the object-position for the 16:9 crop. It matters for the
 * full-page captures: object-cover centers by default, so Lumin's 1800x2649
 * course page would show its MIDDLE — a washed-out curriculum checklist —
 * instead of the violet hero at the top. Aperture's 4:3 specimen is close
 * enough to 16:9 that centering is right; top-cropping it would cut off the
 * wordmark it's meant to show.
 */
const cardScene: Record<
  string,
  { src: string; width: number; height: number; position?: string }
> = {
  "brand-identity-system": {
    src: "/work/aperture/04-type-specimen@2x.png",
    width: 3200,
    height: 2400,
  },
  "learning-platform-ui": {
    src: "/work/lumin/detail.webp",
    width: 1800,
    height: 2649,
    // Full-page capture: pin to the top so the card shows the course hero.
    position: "object-top",
  },
  "marketing-landing-page": {
    src: "/work/northwind/01-hero.webp",
    width: 1800,
    height: 1013,
  },
  // A dedicated crop, not the case-study cover.
  //
  // The full-app capture makes a poor thumbnail: at 526x296 it's two competing
  // panels with no single focal point, and the card's 16:9 box clips the
  // balances column off the left edge. This is the settle-up panel alone —
  // 656x318 native, so it barely crops — which carries the study's headline
  // claim ("4 payments … down from 16") in text that stays readable at card
  // size. Produced by scripts/capture-ledger.mjs alongside the scenes.
  //
  // Light only: next/image can't switch on prefers-color-scheme the way the
  // case study's <picture> does. At card size a light panel reads as a design
  // choice; a full-width dark screenshot on a light page would not.
  "expense-tracker-app": {
    src: "/work/ledger/card-light.webp",
    width: 1131,
    height: 636,
  },
};

type AssetKind =
  | "aperture"
  | "ledger"
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
   *
   * Ratio ONLY. This used to double as the horizontal-scroll switch by way of
   * its inverse, which is what dragged Aperture's video and PNG scenes into a
   * 720px scroller. Scrolling is now decided per scene by `sceneNeedsScroll`.
   */
  intrinsicRatio?: boolean;
};

const assetSets: Record<string, AssetSet> = {
  "portfolio-design-system": {
    scenes: portfolioSystemScenes,
    kind: "portfolio-system",
    // These scenes are responsive DOM, not fixed artboards: each one is as tall
    // as its own content at the current width (taller on a phone, where rows
    // stack). Pinning 16:9 would clip the stacked layout.
    intrinsicRatio: true,
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
  "expense-tracker-app": {
    scenes: ledgerScenes,
    kind: "ledger",
    // Mixed set: the diagram scenes are responsive DOM that sizes itself from
    // its own content, and the screenshots are captures with their own ratios
    // (the mobile one is nearly 1:4.3). Pinning 16:9 would crop both.
    intrinsicRatio: true,
  },
};

export function getAssetSet(slug: string): AssetSet | null {
  return assetSets[slug] ?? null;
}

/**
 * True when scene `index` of `slug` must scroll horizontally on a phone rather
 * than be fitted to the column (see WideScene).
 *
 * Currently ALWAYS false, and deliberately kept as the single place that would
 * answer otherwise. Two rounds of this got it wrong in opposite directions:
 *
 *   1. It was decided per asset SET, via `!intrinsicRatio` — which swept in all
 *      of Aperture, including a logo-reveal video the reader then had to drag
 *      sideways to see its own wordmark. Ratio and legibility are not the same
 *      question.
 *   2. The remaining real case was the design-system study, whose 1600x900 SVG
 *      artboards rendered 17-22px labels at ~4.6px once fitted. Those are now
 *      responsive DOM (see PortfolioSystemAsset) and reflow instead, so the
 *      last reason to scroll anything went away.
 *
 * Keep this hook rather than deleting the concept: a future set of genuinely
 * fixed-width deliverables (a real client artboard, a print piece) would need
 * it, and it should be answered per SCENE here rather than re-derived from some
 * adjacent flag at a call site.
 */
export function sceneNeedsScroll(slug: string, index: number): boolean {
  const assetSet = getAssetSet(slug);
  if (!assetSet?.scenes[index]) return false;
  return false;
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

  // Hero slot, playback suppressed (the Work grid) — show a representative
  // scene from the study rather than the animation's end-card. See cardScene.
  const still = index === 0 && !allowVideoHero ? cardScene[slug] : undefined;
  if (still) {
    return (
      /* next/image, not a raw <img>: these are full-size case-study exports
         (up to 3200px wide) being shown in a ~526px card. A raw <img> ships the
         whole file at every viewport; the optimizer re-encodes to WebP/AVIF and
         serves a width-appropriate candidate, which is what the rest of the site
         already does. */
      <Image
        src={still.src}
        alt={alt}
        width={still.width}
        height={still.height}
        /* Cards sit in a 2-up grid (md:grid-cols-2) inside the max-w-6xl
           container, so a card tops out near half of 1152px minus the gap —
           526px in practice. Declaring 526 (not the old rounded-up 560) lets a
           DPR-2 browser land exactly on the 1052 candidate added to
           `images.imageSizes`, so the image is never resampled a second time to
           fit. See the note in next.config.mjs. */
        sizes="(min-width: 768px) 526px, 100vw"
        className={cn("block object-cover", still.position, className)}
      />
    );
  }

  if (assetSet.kind === "aperture") {
    // Aperture ships real Figma deliverables: the hero (scene 0) is the brand
    // logo-reveal animation; scenes 1–4 are exported PNG frames.
    if (index === 0) {
      if (!allowVideoHero) {
        // Reached only if `cardScene` loses its Aperture entry — the scene above
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
  if (assetSet.kind === "ledger") {
    // Mixed set: LedgerAsset routes by scene name — the three diagrams render as
    // live DOM derived from the split engine, the rest are themed <picture>
    // captures of the running demo.
    return (
      <LedgerAsset
        scene={item.scene as Parameters<typeof LedgerAsset>[0]["scene"]}
        alt={alt}
        className={className}
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
