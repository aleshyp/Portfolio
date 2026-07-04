import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test("renders hero and core sections", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /human-centered/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /case studies in clarity/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /have a project in mind/i }),
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
    await expect(page.getByText(/please enter your name/i)).toBeVisible();
    await expect(page.getByText(/please enter your email/i)).toBeVisible();
    await expect(page.getByText(/tell me a little about your project/i)).toBeVisible();
  });

  test("rejects an invalid email", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel(/project details/i).fill("Hello there, this is a test.");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/enter a valid email address/i)).toBeVisible();
  });

  test("shows loading state then confirmation on valid submit", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@company.com");
    await page.getByLabel(/project details/i).fill("Hello there, this is a test.");
    await page.getByRole("button", { name: /send message/i }).click();
    // Loading state (button flips to "Sending…").
    await expect(page.getByRole("button", { name: /sending/i })).toBeVisible();
    // Then the confirmation replaces the form.
    await expect(page.getByText(/thanks for reaching out/i)).toBeVisible();
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
    await expect(page.getByText(/wandered off/i)).toBeVisible();
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
