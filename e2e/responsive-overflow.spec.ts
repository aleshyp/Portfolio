import { test, expect, type Page } from "@playwright/test";

/**
 * Element-level overflow checks.
 *
 * Why this exists alongside responsive.spec.ts: `html`/`body` carry
 * `overflow-x: hidden` (globals.css) to tame the decorative blurred backdrops.
 * That silently MASKS real layout bugs from a `scrollWidth > clientWidth`
 * assertion — content can be clipped off-screen while documentElement still
 * measures clean. These tests measure every painted box against the viewport
 * instead, so clipped-but-broken layout still fails.
 *
 * 320px is included deliberately: it's the narrowest width in common use
 * (iPhone SE, Galaxy Fold cover screen) and the width the flex/grid bugs
 * this suite was written for actually appeared at.
 */

const WIDTHS = [320, 360, 390, 414, 640, 768, 1024, 1280, 1440];
const ROUTES = ["/", "/work/learning-platform-ui"];

type Offender = { cls: string; text: string; over: number };

/**
 * Boxes painted past the right viewport edge. Skips `pointer-events: none`
 * (the decorative off-canvas blurs, which are intentionally oversized) and
 * anything hidden.
 */
async function overflowingElements(page: Page): Promise<Offender[]> {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out: { cls: string; text: string; over: number }[] = [];
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (
        cs.pointerEvents === "none" ||
        cs.visibility === "hidden" ||
        cs.display === "none"
      ) {
        continue;
      }
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      // 1px tolerance for sub-pixel rounding.
      if (r.right > vw + 1) {
        out.push({
          cls: (
            (el as HTMLElement).className?.toString() ?? ""
          ).slice(0, 70),
          text: (el.textContent ?? "").trim().slice(0, 30),
          over: Math.round(r.right - vw),
        });
      }
    }
    return out;
  });
}

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    test(`no element overflows ${route} @ ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const offenders = await overflowingElements(page);
      expect(
        offenders,
        `elements painted past the viewport:\n${JSON.stringify(offenders, null, 2)}`,
      ).toEqual([]);
    });
  }
}

test("mobile menu does not overflow when open @ 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");
  await page.getByRole("button", { name: /open menu/i }).click();
  await expect(page.getByRole("link", { name: /let's talk/i })).toBeVisible();

  const offenders = await overflowingElements(page);
  expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
});

test("contact grid does not blow out its track @ 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");

  // Regression guard for the grid `min-width: auto` blowout: the long email
  // address forced the single-column track wider than the panel, and the
  // panel's overflow-hidden clipped it instead of scrolling.
  const panel = page.locator("#contact .rounded-4xl");
  const grid = panel.locator("> div").first();
  const panelBox = await panel.boundingBox();
  const gridBox = await grid.boundingBox();
  expect(panelBox).not.toBeNull();
  expect(gridBox).not.toBeNull();
  expect(gridBox!.width).toBeLessThanOrEqual(panelBox!.width + 1);
});
