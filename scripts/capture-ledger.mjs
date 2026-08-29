// Captures the Ledger demo's screenshot scenes into public/work/ledger/.
//
// These are real captures of the running app, not mockups — the whole premise
// of the study is that the engine is real, so a hand-drawn picture of it would
// be the wrong medium. Re-run this whenever the demo's UI changes:
//
//   npm run dev                     # or npm run start, after a build
//   node scripts/capture-ledger.mjs
//
// Pass a base URL to point it elsewhere: node scripts/capture-ledger.mjs http://localhost:3001
//
// Captures in BOTH themes at 2x DPR. The case study picks per-theme via
// <picture>/media queries in LedgerAsset, so a reader in dark mode sees a dark
// screenshot rather than a white rectangle glowing out of the page.
//
// Requires the `playwright` browser binaries that the e2e suite already uses.

import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = new URL("../public/work/ledger/", import.meta.url);
const DEMO = `${base}/ledger-demo`;

/**
 * Each shot names the element to capture rather than the viewport, so the
 * screenshots are of the APP, not of the page's marketing chrome around it.
 * `prepare` drives the demo into the state we want to show.
 */
const SHOTS = [
  {
    name: "overview",
    selector: "[data-capture='demo']",
    width: 1440,
    // The seeded weekend, untouched — the cover shot.
    prepare: async () => {},
  },
  {
    name: "add-expense",
    selector: "[data-capture='demo']",
    width: 1440,
    // The form open with a live split preview mid-typing.
    prepare: async (page) => {
      await page.getByRole("button", { name: /^add expense$/i }).click();
      await page.getByLabel(/what was it/i).fill("Kayak hire");
      await page.getByLabel(/amount/i).fill("100");
      // Drop two people so the split is 3-way and the remainder note appears —
      // that's the detail the scene is meant to show.
      for (const name of ["Dee", "Eli"]) {
        await page.getByRole("button", { name, pressed: true }).click();
      }
      await page.getByText(/doesn.t divide evenly/i).waitFor();
    },
  },
  {
    name: "failed-save",
    selector: "[data-capture='demo']",
    width: 1440,
    // The rollback: row kept, balances restored.
    prepare: async (page) => {
      await page.getByLabel(/fail the next save/i).check();
      await page.getByRole("button", { name: /^add expense$/i }).click();
      await page.getByLabel(/what was it/i).fill("Kayak hire");
      await page.getByLabel(/amount/i).fill("48");
      await page.getByRole("button", { name: /^add expense$/i }).last().click();
      await page.getByRole("button", { name: /retry/i }).waitFor();
    },
  },
  {
    name: "mobile",
    selector: "[data-capture='demo']",
    width: 390,
    prepare: async () => {},
  },
  {
    // Work-grid thumbnail ONLY — not a case-study scene.
    //
    // The full-app capture makes a poor card: at 526x296 it's two competing
    // panels with no focal point, and the 16:9 crop clips the balances column.
    // This shoots the settle-up panel alone, which carries the study's headline
    // claim ("4 payments … down from 16") in text that stays readable at card
    // size.
    //
    // Viewport width is chosen so the panel comes out at ~16:9 — the card's
    // aspect-video box. Shot at 720 the panel is 656x318 (2.06:1), and
    // object-cover then crops the SIDES, cutting off "SETTLE UP" and the "Mark
    // paid" buttons: the exact content the crop existed to show. Padding the
    // frame to the target ratio here means the card scales rather than crops.
    name: "card",
    selector: "[data-capture='settle']",
    width: 560,
    // Pads the capture to 16:9 around the panel rather than letting the card
    // crop it. The fill matches the demo's page background in each theme.
    padTo: 16 / 9,
    prepare: async () => {},
  },
];

async function capture(theme) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    deviceScaleFactor: 2,
    colorScheme: theme,
    // Freeze entrance motion so nothing is captured mid-fade. AnimatedReveal
    // honors reduced-motion, so this also guarantees opacity 1 at capture time
    // — the same reason the a11y suite sets it.
    reducedMotion: "reduce",
  });

  for (const shot of SHOTS) {
    const page = await context.newPage();
    await page.setViewportSize({ width: shot.width, height: 1000 });
    await page.goto(DEMO, { waitUntil: "networkidle" });

    // The theme is class-based (next-themes), and its stored preference wins
    // over the OS colorScheme above — so set it explicitly and wait for the
    // class to land before shooting.
    await page.evaluate((t) => {
      localStorage.setItem("theme", t);
      document.documentElement.classList.toggle("dark", t === "dark");
    }, theme);
    await page.waitForFunction(
      (t) => document.documentElement.classList.contains("dark") === (t === "dark"),
      theme,
    );

    await shot.prepare(page);

    // Hide the site chrome before shooting. An element screenshot captures the
    // element's BOX, not its stacking context, so the fixed navbar paints over
    // the top of the frame — the first capture came out with "Work About
    // Experience" floating across the demo's own control bar. These scenes are
    // pictures of the app, not of the page it happens to sit on.
    await page.addStyleTag({
      content: `header, nav[aria-label], footer { visibility: hidden !important; }
        /* Next's dev error/indicator overlay renders in a shadow host outside
           the app tree and floats over the bottom-left. It baked a red "1 issue"
           badge into a capture. Hidden here so a dev-server run produces the
           same image a production run would. */
        nextjs-portal, #__next-build-watcher, [data-nextjs-toast] {
          display: none !important;
        }`,
    });

    const target = page.locator(shot.selector);
    await target.waitFor();
    const png = await target.screenshot({ scale: "device" });

    // Encode to WebP rather than shipping the PNG. These are 2x screenshots of
    // a text-heavy UI: as PNG the set runs ~2MB, which is a lot to put on a page
    // that has to hold a Lighthouse budget. Quality 82 is the same setting the
    // Lumin exports use and the difference is not visible at render size.
    const file = fileURLToPath(new URL(`${shot.name}-${theme}.webp`, outDir));

    let pipeline = sharp(png);
    if (shot.padTo) {
      // Extend the capture to the target aspect ratio so the consuming card
      // scales it instead of cropping it. Background matches the demo's page
      // background per theme, so the padding is invisible against the card.
      const meta = await pipeline.metadata();
      const targetW = Math.max(meta.width, Math.round(meta.height * shot.padTo));
      const targetH = Math.max(meta.height, Math.round(meta.width / shot.padTo));
      pipeline = pipeline.extend({
        top: Math.floor((targetH - meta.height) / 2),
        bottom: Math.ceil((targetH - meta.height) / 2),
        left: Math.floor((targetW - meta.width) / 2),
        right: Math.ceil((targetW - meta.width) / 2),
        // --background in globals.css (line 137/143): white light, ink dark.
        background: theme === "dark" ? "#0b1220" : "#ffffff",
      });
    }

    const { info } = await pipeline
      .webp({ quality: 82 })
      .toFile(file)
      .then(async (i) => ({ info: i }));

    const box = await target.boundingBox();
    console.log(
      `  ${shot.name}-${theme}.webp`.padEnd(28),
      `${info.width}x${info.height} @2x`,
      `${(info.size / 1024).toFixed(0)}KB`,
      `(css ${Math.round(box.width)}x${Math.round(box.height)})`,
    );
    await page.close();
  }

  await browser.close();
}

await mkdir(outDir, { recursive: true });
console.log(`Capturing ${DEMO}`);
for (const theme of ["light", "dark"]) {
  await capture(theme);
}
console.log("\nDone. Files are 2x DPR — LedgerAsset declares their intrinsic size.");
