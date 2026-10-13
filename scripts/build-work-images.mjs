#!/usr/bin/env node
/**
 * Re-derives the case-study screens in public/work/ from the full-resolution
 * Figma masters in assets-src/.
 *
 *   npm run images
 *
 * Each master produces two WebPs:
 *
 *   <name>.webp       2400px wide — the case-study column is 1088px, so a DPR-2
 *                     screen draws it at ~2176 device pixels. 2400 covers that
 *                     without upscaling. (These were once cut to 1800px, which
 *                     IS upscaled ~1.2x on a Retina screen, and read as blurry.)
 *   <name>-1200.webp  1200px wide — what a phone, or a DPR-1 desktop, needs.
 *
 * The page serves both through srcset/sizes, so nobody downloads the big one
 * unless their screen can use it.
 *
 * `smartSubsample` turns on libwebp's sharp-YUV conversion. Lossy WebP always
 * stores color at half resolution; on flat UI screenshots that smears thin
 * colored lines and small colored text, and sharp-YUV is libwebp's fix for
 * exactly that. It costs ~5% in file size.
 *
 * Also writes src/data/work-image-sizes.json — the intrinsic size of every
 * output, which the asset components read for width/height and aspect-ratio.
 * That replaces a hand-maintained table whose comment warned that a stale entry
 * silently distorts the frame. Generated sizes can't go stale.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = new URL("../", import.meta.url);

/**
 * master path (under assets-src/work/<project>/) → output name. Output names are
 * the scene keys the asset components already use, so no URL changes shape.
 *
 * Lumin has no entry because its masters were never kept: its screens are
 * 1800px WebPs with nothing larger to rebuild them from. Re-export the frames
 * from Figma at 2x into assets-src/work/lumin/, add them here, and they'll get
 * the same treatment.
 */
const MASTERS = {
  northwind: {
    "v5-01-hero.jpg": "01-hero",
    "v5-02-value-props.jpg": "02-value-props",
    "v5-03-social-proof.jpg": "03-social-proof",
    "v5-04-mobile.jpg": "04-mobile",
    "pages/page-product-final.jpg": "product",
    "pages/page-pricing-v2.jpg": "pricing",
    "pages/page-docs-v2.jpg": "docs",
    "pages/about-page.jpg": "about",
    "pages/community-page.jpg": "community",
    "pages/login-page.jpg": "login",
    "pages/signup-page.jpg": "signup",
    "pages/forgot-password-page.jpg": "forgot-password",
  },
};

const LARGE = { width: 2400, quality: 88 };
const SMALL = { width: 1200, quality: 85 };

const manifestUrl = new URL("src/data/work-image-sizes.json", root);
let manifest = {};
try {
  manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
} catch {
  // First run: no manifest yet.
}

let totalKb = 0;
for (const [project, files] of Object.entries(MASTERS)) {
  const outDir = new URL(`public/work/${project}/`, root);
  await mkdir(outDir, { recursive: true });
  manifest[project] = {};

  for (const [master, name] of Object.entries(files)) {
    const src = new URL(`assets-src/work/${project}/${master}`, root);
    const encode = ({ width, quality }) =>
      sharp(fileURLToPath(src))
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 6, smartSubsample: true })
        .toBuffer({ resolveWithObject: true });

    const large = await encode(LARGE);
    const small = await encode(SMALL);
    await writeFile(new URL(`${name}.webp`, outDir), large.data);
    await writeFile(new URL(`${name}-1200.webp`, outDir), small.data);

    manifest[project][name] = { w: large.info.width, h: large.info.height };
    const kb = (large.data.length + small.data.length) / 1024;
    totalKb += kb;
    console.log(
      `${project}/${name}`.padEnd(28),
      `${large.info.width}x${large.info.height}`.padEnd(10),
      `${Math.round(large.data.length / 1024)}KB + ${Math.round(small.data.length / 1024)}KB`,
    );
  }
}

await writeFile(manifestUrl, JSON.stringify(manifest, null, 2) + "\n");
console.log(`✔ Wrote ${Math.round(totalKb)}KB of WebP and src/data/work-image-sizes.json`);
