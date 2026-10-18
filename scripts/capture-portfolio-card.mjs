// Captures the Work-grid thumbnail for the "This Site" case study into
// public/work/portfolio/card-light.webp and card-dark.webp.
//
// The card shows the study's contrast-audit scene: every text token's ratio
// against the 4.5:1 line, with the one failure in red. At card size the labels
// are too small to read, but the shape still says "accessibility, measured".
// The card used to be a light/dark capture of the home hero. It was accurate,
// but it showed the reader the screen they had just scrolled past.
//
// One capture per theme: the card swaps them with the site's theme class (see
// cardScene in src/components/projectAssets.tsx), so it never shows a white
// tile on the dark page or the reverse.
//
// It's a real capture of the live scene, so re-run it whenever the scene, the
// tokens or their ratios change. Use a production build: under `next dev` the
// dev-tools badge can land inside the shot.
//
//   npm run build && npm run start
//   node scripts/capture-portfolio-card.mjs [baseUrl]
//
// Requires the Playwright browser binaries the e2e suite already uses.

import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = new URL("../public/work/portfolio/", import.meta.url);

// A narrower column than desktop keeps the scene's labels larger relative to
// the frame. 900px wide gives an 836px column, still above the scene's @md
// container breakpoint, so it keeps its one-row-per-pair desktop layout.
const VIEWPORT = { width: 900, height: 1200 };
const DPR = 3;
// Final file: 2400x1350, the same as the other case-study exports (≥2400px,
// so a DPR-2 card at 526px still has headroom).
const OUT = { width: 2400, height: 1350 };
// Page background per theme: white, and ink (#0b1220) in dark.
const BG = { light: "#ffffff", dark: "#0b1220" };

async function shoot(browser, theme) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DPR,
    reducedMotion: "reduce",
    colorScheme: theme,
  });
  // next-themes reads its choice from localStorage before first paint.
  await context.addInitScript((t) => localStorage.setItem("theme", t), theme);
  const page = await context.newPage();
  await page.goto(`${base}/work/portfolio-design-system`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  // The scene board only, not its <figcaption>: the card names the project.
  const scene = page
    .locator("figure", { hasText: "Contrast audit" })
    .locator(":scope > :first-child");
  const png = await scene.screenshot({ type: "png" });
  await context.close();
  return png;
}

async function compose(png, theme) {
  // Fit the scene inside the 16:9 frame with a margin, centered on the page
  // background, so nothing is cropped whatever height the scene settles at.
  const pad = Math.round(OUT.width * 0.06);
  const fitted = await sharp(png)
    .resize({
      width: OUT.width - pad * 2,
      height: OUT.height - pad * 2,
      fit: "inside",
    })
    .toBuffer({ resolveWithObject: true });
  return sharp({
    create: { ...OUT, channels: 3, background: BG[theme] },
  })
    .composite([
      {
        input: fitted.data,
        left: Math.round((OUT.width - fitted.info.width) / 2),
        top: Math.round((OUT.height - fitted.info.height) / 2),
      },
    ])
    .webp({ quality: 90, smartSubsample: true })
    .toFile(fileURLToPath(new URL(`card-${theme}.webp`, outDir)));
}

const browser = await chromium.launch();
await mkdir(outDir, { recursive: true });
for (const theme of ["light", "dark"]) {
  await compose(await shoot(browser, theme), theme);
  console.log(
    `Wrote public/work/portfolio/card-${theme}.webp (${OUT.width}x${OUT.height})`,
  );
}
await browser.close();
