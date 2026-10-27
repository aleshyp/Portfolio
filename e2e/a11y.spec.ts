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

// `page.goto` resolves on the `load` event, which under parallel worker load can
// land before the App Router has committed the real document. axe then scans a
// transitional shell and reports things that cannot actually be missing from the
// root layout — `html-has-lang` and `document-title` together, the tell-tale
// pair. Waiting for both to be present pins the scan to the real page.
//
// This was an intermittent ~1-in-6 failure on /work/portfolio-design-system
// (the heaviest route — it carries the hand-built SVG scenes), independent of
// any dependency version.
async function waitForDocumentReady(page: import("@playwright/test").Page) {
  // Only the two attributes axe misreports are checked. Waiting on
  // `readyState === "complete"` as well is both unnecessary (axe scans the DOM,
  // not pending sub-resources) and actively harmful: under parallel load it can
  // outlast the 30s test timeout on the SVG-heavy routes.
  await page.waitForFunction(
    () => document.documentElement.lang !== "" && document.title !== "",
  );
}

// One representative case study per asset family — the studies share a layout,
// so scanning every slug would mostly re-test the same markup. The three here
// differ in what they render: learning-platform-ui mixes exported screens with
// a DOM user-flow diagram (role="img" over aria-hidden step cards),
// portfolio-design-system carries the hand-built SVG scenes with long alt text,
// and marketing-landing-page is the widest set (16 scenes) and the only one that
// exercises the "More screens" gallery for scenes past the content blocks.
const routes = [
  "/",
  "/work/learning-platform-ui",
  "/work/portfolio-design-system",
  "/work/marketing-landing-page",
];

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
    await waitForDocumentReady(page);
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
  await expect(page.getByText(/what should i call you/i)).toBeVisible();
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
  // Stub the form backend. When NEXT_PUBLIC_WEB3FORMS_KEY is set (it is, in
  // .env.local), Contact.tsx POSTs to api.web3forms.com for real and only sets
  // `submitted` once that responds with { success: true }. Left unstubbed this
  // test depends on a third party over the network: the request routinely
  // hangs with no response, role="status" never mounts, and the assertion
  // below fails — the flake this test was known for. It also means every suite
  // run delivered a live form submission.
  //
  // Fulfilling the route keeps the assertion on what this test is actually
  // about (focus moves to the confirmation) and makes it hermetic.
  await page.route("https://api.web3forms.com/submit", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    }),
  );

  await page.goto("/#contact");
  await waitForHydration(page);
  await page.getByLabel("Name").fill("Jane Doe");
  await page.getByLabel("Email").fill("jane@company.com");
  await page.getByLabel(/^message$/i).fill("Testing keyboard flow.");

  // Locate the submit by its stable attribute, NOT by accessible name: the
  // label flips from "Send message" to "Sending…" on submit, and Playwright
  // re-resolves a locator on every assertion, so a name-based handle stops
  // matching the moment the state it is meant to observe begins. Same reason
  // the equivalent smoke test uses this selector.
  await page.locator('form button[type="submit"]').press("Enter");

  const confirmation = page.getByRole("status");
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toBeFocused();
});

test("exactly one h1 on the home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
});

// The Lumin prototype is one route whose screen comes from the query string,
// so each screen is its own scan. It renders client-side (useSearchParams
// opts it out of prerendering), so wait for the screen heading to mount
// before scanning. The static HTML carries the catalog as the Suspense
// fallback, so wait for the live (URL-driven) app, or a deep link would scan
// the catalog instead of the screen it names.
const luminScreens = [
  "/prototypes/lumin",
  "/prototypes/lumin?screen=course&course=design-systems-for-scale",
  "/prototypes/lumin?screen=signup&course=design-systems-for-scale",
  "/prototypes/lumin?screen=login",
  "/prototypes/lumin?screen=onboarding&step=1",
  "/prototypes/lumin?screen=onboarding&step=2",
  "/prototypes/lumin?screen=sample&course=ui-animation",
  "/prototypes/lumin?screen=checkout&course=design-systems-for-scale",
];

for (const route of luminScreens) {
  test(`no a11y violations: ${route}`, async ({ page }) => {
    await page.goto(route);
    await waitForDocumentReady(page);
    await expect(
      page.locator("[data-lumin-live] #lumin-screen-heading"),
    ).toBeVisible();
    await freezeAnimations(page);
    const { violations } = await new AxeBuilder({ page })
      .withTags(WCAG)
      .analyze();
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  });
}

test("no a11y violations: Lumin empty search and sign-up errors", async ({
  page,
}) => {
  const live = page.locator("[data-lumin-live] #lumin-screen-heading");
  await page.goto("/prototypes/lumin");
  await expect(live).toBeVisible();
  await page.getByRole("searchbox").fill("Advanced Motion");
  await expect(page.getByText("No courses found").first()).toBeVisible();
  await freezeAnimations(page);
  let { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);

  await page.goto("/prototypes/lumin?screen=signup");
  await expect(live).toHaveText("Create account");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Enter your name.")).toBeVisible();
  await freezeAnimations(page);
  ({ violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze());
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
