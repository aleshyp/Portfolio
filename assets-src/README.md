# assets-src — design masters, not served

Full-resolution exports from Figma, kept as the **masters** for the optimized
images in `public/`. Nothing here is served to browsers.

Everything under `public/` is published at the site root, so a 7.5 MB JPG sitting
there is publicly fetchable even when no page links it, and it inflates the
deploy. Masters live here instead, and only the optimized derivatives go in
`public/`.

## Rebuilding the web images

```bash
npm run images
```

`scripts/build-work-images.mjs` turns each master into two WebPs in
`public/work/<project>/`:

| Output | Width | For |
|---|---|---|
| `<name>.webp` | 2400px | high-density (Retina) screens. The case-study column is 1088px, so DPR 2 needs ~2176px |
| `<name>-1200.webp` | 1200px | phones and standard-density screens |

It also writes `src/data/work-image-sizes.json`, which the asset components read
for width/height, so a re-export can't leave a stale size behind.

Encoding is WebP q88 (large) / q85 (small) with sharp-YUV (`smartSubsample`),
which keeps thin colored lines and small colored text crisp. Plain lossy WebP
stores color at half resolution and smears them.

**Don't drop below 2400px.** These were once re-encoded at 1800px, which a
Retina screen has to stretch ~1.2x, and the case studies looked blurry.

## work/northwind

All twelve case-study screens. The script's `MASTERS` table maps each file here
to its output name (e.g. `v5-01-hero.jpg` → `01-hero.webp`,
`pages/page-product-final.jpg` → `product.webp`).

## work/lumin

All ten case-study screens, 2880px (2x) Figma exports from 2026-10-13. The
onboarding, sign-up and log-in frames came out of Figma centered on a larger
blank canvas, so the script trims those three (`trim: true` in `MASTERS`).
Don't trim the full-page frames: the threshold also eats their light footer.

## Not here

**Aperture.** Its case-study frames are served straight from 3200px PNGs in
`public/work/aperture/`, so they're already sharp.
