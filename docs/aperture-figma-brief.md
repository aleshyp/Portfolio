# Figma-Agent Brief — Aperture Brand Identity

A ready-to-paste brief for a Figma AI agent (or a designer) to produce the
**Aperture** brand-identity case-study assets. Aperture is a *fictional client*
in this portfolio (`src/data/projects.ts`, slug `brand-identity-system`). The
live site already ships hand-built SVG stand-ins for these deliverables
(`src/components/ApertureAsset.tsx`); this brief exists to upgrade them to
polished, exportable Figma artwork **without drifting from the established
identity**. Match the palette, motif, and type below exactly.

---

## Paste-into-agent prompt

> You are a senior brand designer. Design the visual-identity deliverables for a
> fictional startup called **Aperture** — a precision-optics / camera-lens brand.
> Aperture is modern, trustworthy, and technical-but-warm. The identity must scale
> from a **16px favicon to a billboard**, work in **light and dark**, and hold up
> in **monochrome**. Produce everything as an organized Figma file with named
> frames, components, auto-layout, and export-ready artboards at 1600×900 (16:9).
>
> **Core motif:** a **six-blade aperture diaphragm** — six straight-edged,
> overlapping iris leaves forming a clean **hexagonal opening** around a bright
> center (NOT a six-pointed star; the inner edges are chords, not spokes). The
> center reads as light passing through the lens.
>
> **Palette (use these exact values):**
> | Token | Hex | Role |
> |-------|-----|------|
> | Ink | `#171326` | Deep aubergine-ink; primary dark bg |
> | Indigo | `#4F46E5` | Primary brand |
> | Deep | `#312E81` | Indigo shade for gradients |
> | Violet | `#7C6CF0` | Blade fill / secondary |
> | Amber | `#F5A524` | Lens-center highlight (sparing) |
> | Amber Soft | `#FBCB6B` | Amber tint |
> | Mist | `#EEEBFB` | Light neutral bg |
> | Paper | `#FBFAFF` | Off-white surface |
>
> **Type:** Display/headings **Sora** (700). Body/labels **Inter**.
> Tagline: **"Focus the frame."**
>
> **Deliverables (one 1600×900 frame each, named as listed):**
> 1. **`01-logomark`** — Primary logo lockup: the aperture iris (violet blades,
>    amber/glow center, thin paper rim) beside the "Aperture" wordmark in Sora on
>    a deep indigo→ink radial background, with a soft violet lens flare. Small
>    "BRAND SYSTEM" label in amber-soft below, letter-spaced.
> 2. **`02-logo-construction`** — Construction sheet on a paper background: the
>    mark built on a 100px modular grid with concentric circle guides (dashed
>    violet) and radial measurement ticks. Technical, precise.
> 3. **`03-palette`** — Six full-height color swatches (Ink, Indigo, Deep, Violet,
>    Amber, Mist) each labeled with name, uppercase hex, and index (01–06).
> 4. **`04-type-specimen`** — Dark ink background: a large "Aa" in Sora, the
>    tagline "Focus the frame." in violet, a pangram in mist, and the full
>    upper/lowercase alphabet + numerals. A small iris mark top-right.
> 5. **`05-usage`** — Guidelines on a mist background: a clearspace panel
>    (clearspace = 1× iris radius, shown with a dashed bounding box) plus a
>    do/don't pair — ✓ full-color on light, ✕ desaturated mark (with a red slash).
>
> **Rules:** Build the iris as a reusable component (variant prop for
> opening size). Use auto-layout for the palette and specimen. Keep AA contrast
> for all text on its background. Export each frame as PNG @2x and SVG. Do not
> introduce colors outside the palette. Do not use a star shape for the iris.

---

## Extra deliverables worth requesting (beyond what the site shows)

If you want the case study to feel even fuller, ask the agent for:

- **App-icon grid** — the mark at 16 / 32 / 64 / 512 px to prove it holds at
  favicon size (directly supports the "16px favicon to billboard" copy).
- **Monochrome / one-color** lockups (all-ink, all-paper, knockout).
- **Real-world mockups** — app icon on a phone home screen, a business card, a
  billboard or tote. *(Photographic mockups are the main thing the in-repo SVGs
  can't do — this is where Figma earns its keep.)*
- **Motion end-frame** — the iris "opening" (blades rotating out) as a hero
  animation still.

## Wiring the Figma exports back into the site

Each frame maps 1:1 to a scene in `src/components/ApertureAsset.tsx` and a slot in
the case study (`src/app/work/[slug]/page.tsx`):

| Figma frame | Current SVG scene | Case-study slot |
|-------------|-------------------|-----------------|
| `01-logomark` | `logomark` | Hero / cover |
| `02-logo-construction` | `logo-construction` | Block 01 "The brief" |
| `03-palette` | `palette` | Block 02 "Exploration" |
| `04-type-specimen` | `type-specimen` | Block 03 "The system" |
| `05-usage` | `usage` | Block 04 "Outcome" |

To swap an SVG scene for a Figma PNG, replace the `<ApertureAsset>` with a
`next/image` `<Image>` pointing at the export, keeping the **same `alt` text**
(already written in `apertureScenes`) and the `aspect-[16/9] rounded-4xl` classes.
Export at 1600×900 (or 3200×1800 @2x) so it stays crisp on retina.
