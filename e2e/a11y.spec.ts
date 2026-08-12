import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility (WCAG 2.2 AA) scans via axe-core. See the `test-suite` skill
 * (references/accessibility.md) for the manual keyboard/screen-reader checks
 * that axe cannot cover.
 */

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

// Emulate prefers-reduced-motion for every test in this file BEFORE any goto,
// so framer's AnimatedReveal renders content at rest (opacity 1, no transform)
// from first paint. This is load-bearing for contrast scanning: AnimatedReveal
// fades opacity 0→1 via Framer Motion (JS-driven, NOT a CSS transition — so
// freezeAnimations below can't stop it). Scanning mid-fade composites text
// against the page and reads a transient low contrast (e.g. a Badge momentarily
// ~3.6:1 vs its at-rest 5.2:1, or text over white reading ~1.0). AnimatedReveal
// honors useReducedMotion(), so this makes it skip the entrance and render at
// final opacity — a real user state, and the settled contrast is what we assert.
// Without it the scans flake intermittently under parallel load.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

// Put the page in a settled, at-rest state before scanning, so axe judges
// contrast at final colors — not a transient mid-animation frame.
//
// Two independent animation sources must both be neutralized:
//  1. framer-motion's AnimatedReveal fades opacity 0→1 via JS (inline styles /
//     Web Animations API, NOT CSS transitions). emulateMedia reduced-motion
//     makes it honor useReducedMotion and render at opacity 1 immediately.
//  2. CSS `transition-colors` on <body> and elements. A stylesheet zeroing
//     transition/animation durations settles those.
// Without this, axe samples a partly-faded, lighter-composited color (e.g. the
// soft Badge reads ~3.2:1 instead of its at-rest 5.2:1) and reports a false
// violation that varies run-to-run.
async function freezeAnimations(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: `*, *::before, *::after {
      transition-duration: 0s !important;
      animation-duration: 0s !important;
      animation-delay: 0s !important;
    }`,
  });
}

// One representative case study per asset family — the studies share a layout,
// so scanning every slug would mostly re-test the same markup. The two here
// differ in what they render: learning-platform-ui uses the standard scene set,
// portfolio-design-system carries the hand-built SVG scenes with long alt text.
const routes = ["/", "/work/learning-platform-ui", "/work/portfolio-design-system"];

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
