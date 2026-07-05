# Aperture case-study assets — drop zone

Export the Figma deliverables here with the **exact filenames** below, then tell
Claude "the Aperture assets are in." Claude will move nothing you don't expect —
it wires these into `/work/brand-identity-system` (the Aperture case study).

Anything served from `/public` is available at the site root, so a file here at
`public/work/aperture/palette.png` loads at `/work/aperture/palette.png`.

## 1. Five case-study frames — **PNG @2x**

Export each Figma frame at **2× scale**, 16:9. High-res PNG is deliberate here:
AI-generated frames with nested vectors/effects render more reliably as PNG than
as raw SVG.

| Filename | Frame | Case-study slot |
|---|---|---|
| `logomark.png` | 01 Logomark / lockup | Hero (static fallback; see animation) |
| `construction.png` | 02 Logo construction sheet | Block 01 "The brief" |
| `palette.png` | 03 Color palette | Block 02 "Exploration" |
| `type-specimen.png` | 04 Type specimen | Block 03 "The system" |
| `usage.png` | 05 Usage guidelines | Block 04 "Outcome" |

## 2. Logo component — **SVG** (3 variants)

Export the logo variants as **SVG** (clean vector — these inline as a reusable
`<ApertureLogo variant="…" />` React component).

| Filename | Variant |
|---|---|
| `logo-full.svg` | Full lockup (mark + wordmark) |
| `logo-mark.svg` | Mark only (the iris) |
| `logo-mono.svg` | Monochrome / one-color |

> If your three variants are different (e.g. light/dark/stacked), just name them
> `logo-<variant>.svg` and note what each is — Claude will adapt.

## 3. Hero animation — **Lottie JSON** (preferred) or video

The hero plays this **once on scroll-into-view, then rests** on the final
logomark. Reduced-motion users see the static final frame only.

- **Preferred:** `logo-anim.json` — export via the **LottieFiles** Figma plugin
  (select the animation frames → Export Lottie). Vector, tiny, accessible.
- **Fallback:** `logo-anim.webm` (or `.mp4`) — screen-record the prototype and
  export. Heavier, doesn't theme-flip, but bulletproof.

Drop **one** of these. Claude wires a player that respects `prefers-reduced-motion`.

---

### Notes
- Filenames are case-sensitive on the deploy host — keep them lowercase as above.
- If a name doesn't match, that's fine — just tell Claude the actual filename.
- Delete this README once everything's wired (or keep it as documentation).
