import { test, expect } from "@playwright/test";

/**
 * Responsive & visual sanity checks. See the `test-suite` skill
 * (references/visual-responsive.md). These run per Playwright project, but the
 * viewport is overridden here so a single project exercises every breakpoint.
 */

const widths = [360, 390, 768, 1024, 1440];
const routes = ["/", "/work/learning-platform-ui"];

for (const route of routes) {
  for (const width of widths) {
    test(`no horizontal overflow ${route} @ ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const { scrollW, clientW } = await page.evaluate(() => {
        const el = document.documentElement;
        return { scrollW: el.scrollWidth, clientW: el.clientWidth };
      });
      // +1 tolerance for sub-pixel rounding.
      expect(scrollW).toBeLessThanOrEqual(clientW + 1);
    });
  }
}

test("nav: hamburger on mobile, hidden on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: /open menu/i }),
  ).toBeVisible();

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(
    page.getByRole("button", { name: /open menu/i }),
  ).toBeHidden();
});

test("no broken images or failed requests on home", async ({ page }) => {
  const failed: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // A broken image is one that FINISHED loading with no intrinsic size (a 404'd
  // or malformed src). `!img.complete` is deliberately NOT part of this check:
  // below-the-fold images are loading="lazy" (next/image's default), so while
  // the viewport sits at the top they are never requested at all and stay
  // `complete === false` forever — healthy, but indistinguishable from broken
  // by that flag. It flagged the footer logos, which decode fine at 160×160.
  // Failed requests for those images are still caught by `failed` below.
  const broken = await page.evaluate(() =>
    [...document.images]
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src),
  );
  expect(broken, "broken images").toEqual([]);
  expect(failed, "failed requests").toEqual([]);
});

test("clean console (no errors) on home", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});
