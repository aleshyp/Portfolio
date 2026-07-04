import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility (WCAG 2.2 AA) scans via axe-core. See the `test-suite` skill
 * (references/accessibility.md) for the manual keyboard/screen-reader checks
 * that axe cannot cover.
 */

// Scan with reduced motion so framer's AnimatedReveal skips its entrance and
// renders content at rest (it honors useReducedMotion) — also a real-user state.
test.use({ reducedMotion: "reduce" });

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

// Freeze CSS transitions/animations before scanning. Contrast must be judged at
// the settled state: the site's <body> and elements carry `transition-colors`,
// and axe otherwise samples a mid-transition composited frame (e.g. the soft
// Badge momentarily reads ~3.6:1 instead of its at-rest 5.2:1) and reports a
// false violation. This is a standard visual/a11y-testing technique — it makes
// the scan deterministic without changing what a settled user actually sees.
async function freezeAnimations(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: `*, *::before, *::after {
      transition-duration: 0s !important;
      animation-duration: 0s !important;
      animation-delay: 0s !important;
    }`,
  });
}

const routes = ["/", "/work/learning-platform-ui"];

// The interactive sections ("use client") only respond once React has hydrated.
// Clicking before then races the handler attachment. The theme toggle's
// aria-label only becomes "Switch to …" after mount, so it's a reliable
// hydration signal — wait for it before exercising client behavior.
async function waitForHydration(page: import("@playwright/test").Page) {
  await expect(
    page
      .getByRole("button", { name: /switch to (dark|light) mode/i })
      .first(),
  ).toBeVisible();
}

for (const route of routes) {
  test(`no a11y violations: ${route}`, async ({ page }) => {
    await page.goto(route);
    // Wait until hydrated + theme-resolved BEFORE freezing/scanning. Under
    // `next dev` + parallel load, axe can otherwise scan before next-themes has
    // applied the theme class and the stylesheet has painted, reading a
    // transient white-on-white state (contrast ~1.0) that is not a real defect.
    // freezeAnimations alone only removes the animation window, not this
    // hydration race — both are needed for a deterministic scan.
    await waitForHydration(page);
    await freezeAnimations(page);
    const { violations } = await new AxeBuilder({ page })
      .withTags(WCAG)
      .analyze();
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  });
}

// The custom 404's own content must be accessible. We scan <main> rather than
// the whole page: in `next dev` an unmatched route renders through an internal
// `__next_error__` <html> shell that lacks lang="en" (a dev-only artifact — in
// a production build not-found.tsx renders inside the real root layout which
// sets lang). Scoping to #main tests what we actually own and control.
test("no a11y violations: custom 404 content", async ({ page }) => {
  const res = await page.goto("/work/does-not-exist");
  expect(res?.status()).toBe(404);
  await freezeAnimations(page);
  const { violations } = await new AxeBuilder({ page })
    .include("main")
    .withTags(WCAG)
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("no a11y violations: contact form with errors shown", async ({ page }) => {
  await page.goto("/#contact");
  await waitForHydration(page);
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText(/please enter your name/i)).toBeVisible();
  await freezeAnimations(page);
  const { violations } = await new AxeBuilder({ page })
    .include("#contact")
    .withTags(WCAG)
    .analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("keyboard: submit moves focus to the confirmation status", async ({
  page,
}) => {
  await page.goto("/#contact");
  await waitForHydration(page);
  await page.getByLabel("Name").fill("Jane Doe");
  await page.getByLabel("Email").fill("jane@company.com");
  await page.getByLabel(/project details/i).fill("Testing keyboard flow.");
  await page.getByRole("button", { name: /send message/i }).press("Enter");
  const confirmation = page.getByRole("status");
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toBeFocused();
});

test("exactly one h1 on the home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
});
