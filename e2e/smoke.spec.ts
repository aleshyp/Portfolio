import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test("renders hero and core sections", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /brands & products/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /written up properly/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /something you need built/i }),
    ).toBeVisible();
  });
});

test.describe("theme toggle", () => {
  test("switches between light and dark", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    // The button's aria-label is "Toggle theme" until the client mounts, then
    // becomes "Switch to dark/light mode". Wait for the mounted label so we're
    // not racing hydration, then toggle by matching either target label.
    // Desktop and mobile layouts each render a toggle (one hidden via CSS);
    // pick the one that's actually visible for this viewport.
    const toggle = page
      .getByRole("button", { name: /switch to (dark|light) mode/i })
      .filter({ visible: true })
      .first();
    await expect(toggle).toBeVisible();

    const wasDark = (await html.getAttribute("class"))?.includes("dark");
    await toggle.click();
    if (wasDark) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }

    // Flip back and confirm it returns to the original state.
    await toggle.click();
    if (wasDark) {
      await expect(html).toHaveClass(/dark/);
    } else {
      await expect(html).not.toHaveClass(/dark/);
    }
  });
});

test.describe("contact form", () => {
  test("shows inline validation errors on empty submit", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/what should i call you/i)).toBeVisible();
    await expect(page.getByText(/i'll need an email to reply to/i)).toBeVisible();
    await expect(page.getByText(/tell me what you're working on/i)).toBeVisible();
  });

  test("rejects an invalid email", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel(/project details/i).fill("Hello there, this is a test.");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/that email doesn't look right/i)).toBeVisible();
  });

  test("shows loading state then confirmation on valid submit", async ({ page }) => {
    // Stub the form backend — see the matching note in e2e/a11y.spec.ts. With
    // NEXT_PUBLIC_WEB3FORMS_KEY set (as it is in .env.local) this form POSTs to
    // api.web3forms.com for real and only confirms on { success: true }, so
    // unstubbed this test rides a third-party request that routinely hangs —
    // and delivers a live submission on every run.
    //
    // The delay is deliberate. This test asserts the loading state, and an
    // instant stub resolves before the assertion can poll: the form unmounts
    // and aria-busy is never observed ("element(s) not found"). 300ms is long
    // enough to observe, far below the 5s assertion timeout, and still an
    // honest stand-in for a real round trip.
    await page.route("https://api.web3forms.com/submit", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto("/#contact");
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@company.com");
    await page.getByLabel(/project details/i).fill("Hello there, this is a test.");
    // Locate the submit by its stable attribute, NOT by accessible name: the
    // label flips from "Send message" to "Sending…" on submit, and Playwright
    // re-resolves a locator on every assertion, so a name-based handle stops
    // matching the moment the state it is meant to observe begins.
    const submit = page.locator('form button[type="submit"]');
    await submit.click();

    // Loading state, asserted via aria-busy rather than the "Sending…" text.
    // Both flip together, but the state is brief — with the route stubbed the
    // response is near-immediate — so a loaded worker can miss a text match.
    // aria-busy is also what assistive tech announces, making it the more
    // meaningful assertion.
    await expect(submit).toHaveAttribute("aria-busy", "true");

    // Then the confirmation replaces the form.
    await expect(page.getByText(/got it\. thanks/i)).toBeVisible();
  });
});

test.describe("case study routing", () => {
  test("navigates to a case study and back", async ({ page }) => {
    await page.goto("/work/learning-platform-ui");
    await expect(
      page.getByRole("heading", { name: /online learning platform/i }),
    ).toBeVisible();
    await expect(page.getByText(/next project/i)).toBeVisible();
  });

  test("unknown slug renders the custom 404", async ({ page }) => {
    const res = await page.goto("/work/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByText(/nothing here/i)).toBeVisible();
  });
});

// The case-study hero (ApertureHero/LuminHero/NorthwindHero) autoplays its logo
// reveal once, then exposes the native controls so the reveal can be replayed.
// Controls staying hidden during the first play is the point — see
// `usePlayOnceInView`.
test.describe("case study hero video", () => {
  test("reveals controls once the reveal has played through", async ({
    page,
  }) => {
    await page.goto("/work/marketing-landing-page");
    const video = page.locator("video").first();

    // Scroll it into view and let the settle timer start playback.
    await video.scrollIntoViewIfNeeded();
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused), {
        timeout: 10_000,
      })
      .toBe(false);

    // Mid-play the hero stays uncluttered.
    expect(
      await video.evaluate((v: HTMLVideoElement) => v.controls),
    ).toBe(false);

    // Once it ends, controls appear so the user can rewind and rewatch.
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.controls), {
        timeout: 15_000,
      })
      .toBe(true);
    expect(await video.evaluate((v: HTMLVideoElement) => v.ended)).toBe(true);
  });

  test("keeps the controls visible through a replay", async ({ page }) => {
    await page.goto("/work/marketing-landing-page");
    const video = page.locator("video").first();
    await video.scrollIntoViewIfNeeded();
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.controls), {
        timeout: 20_000,
      })
      .toBe(true);

    await video.evaluate(async (v: HTMLVideoElement) => {
      v.currentTime = 0;
      await v.play();
    });
    expect(await video.evaluate((v: HTMLVideoElement) => v.controls)).toBe(
      true,
    );
  });
});

// Mobile-only: the hamburger menu is hidden on desktop (lg:hidden).
test.describe("mobile navigation", () => {
  test("opens and closes the hamburger menu", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile viewport only");
    await page.goto("/");
    await page.getByRole("button", { name: /open menu/i }).click();
    const menu = page.getByRole("link", { name: /^work$/i });
    await expect(menu.last()).toBeVisible();
    await page.getByRole("button", { name: /close menu/i }).click();
  });
});
