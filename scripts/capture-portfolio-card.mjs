// Captures the Work-grid thumbnail for the "This Site" case study into
// public/work/portfolio/card.webp.
//
// The study's case-study scenes are responsive DOM sized for the full column,
// so squeezed into a 16:9 card they cropped mid-word. The card shows the site
// itself instead: the home hero, left half light theme and right half dark,
// split down the middle. One page, one set of utilities, two themes, which is
// the study's whole argument in one frame.
//
// It's a real capture, so re-run it whenever the hero changes:
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

// 1600x900 CSS px at DPR 1.5 → 2400x1350, the same width the other case-study
// exports use (≥2400px, so a DPR-2 card at 526px still has headroom).
const VIEWPORT = { width: 1600, height: 900 };
const DPR = 1.5;

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
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: "png" });
  await context.close();
  return png;
}

const browser = await chromium.launch();
const [light, dark] = [await shoot(browser, "light"), await shoot(browser, "dark")];
await browser.close();

const W = VIEWPORT.width * DPR;
const H = VIEWPORT.height * DPR;
const half = W / 2;

const rightHalf = await sharp(dark)
  .extract({ left: half, top: 0, width: W - half, height: H })
  .toBuffer();

await mkdir(outDir, { recursive: true });
await sharp(light)
  .composite([{ input: rightHalf, left: half, top: 0 }])
  .webp({ quality: 90, smartSubsample: true })
  .toFile(fileURLToPath(new URL("card.webp", outDir)));

console.log(`Wrote public/work/portfolio/card.webp (${W}x${H})`);
