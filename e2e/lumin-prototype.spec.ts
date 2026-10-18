import { test, expect, type Page } from "@playwright/test";

/**
 * The Lumin prototype (/prototypes/lumin): the route from catalog to enrolled,
 * plus the three fixes the case study promises it applies. If one of these
 * fails, the study's "What I'd change" block is making a false claim.
 */

// The static HTML shows the catalog as a Suspense fallback; the URL-driven
// app replaces it after hydration and marks itself data-lumin-live. Wait for
// that, or a deep link is tested against the fallback catalog.
async function open(page: Page, search = "") {
  await page.goto(`/prototypes/lumin${search}`);
  await expect(
    page.locator("[data-lumin-live] #lumin-screen-heading"),
  ).toBeVisible();
}

test("catalog → course → sign-up → onboarding → end, with focus following", async ({
  page,
}) => {
  await open(page);
  await expect(page.getByRole("status")).toHaveText("9 courses");

  // The Figma empty state: the query stays, one way back.
  await page.getByRole("searchbox").fill("Advanced Motion");
  await expect(page.getByRole("status")).toHaveText("No courses found");
  await expect(page.getByText(/Nothing matches “Advanced Motion”/)).toBeVisible();
  await page.getByRole("button", { name: "Browse all courses" }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(page.getByRole("searchbox")).toBeFocused();

  // Category chips filter, and say which one is on.
  await page.getByRole("button", { name: "Strategy" }).click();
  await expect(page.getByRole("button", { name: "Strategy" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("status")).toHaveText("1 course in Strategy");
  await page.getByRole("button", { name: "All" }).click();

  await page.getByRole("link", { name: "Design Systems for Scale" }).click();
  await expect(page).toHaveURL(/screen=course&course=design-systems-for-scale/);
  const heading = page.locator("#lumin-screen-heading");
  await expect(heading).toHaveText("Design Systems for Scale");
  await expect(heading).toBeFocused();

  await page.getByRole("link", { name: /Enroll Now/ }).click();
  await expect(heading).toHaveText("Create account");
  await expect(page.getByText(/to enroll in Design Systems for Scale/)).toBeVisible();

  // Empty submit: every problem flagged, focus on the first.
  await page.getByRole("button", { name: "Create account" }).click();
  const name = page.getByLabel("Full name");
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Enter your name.")).toBeVisible();

  await name.fill("Jordan Lee");
  await page.getByLabel("Email address").fill("jordan@example.com");
  await page.getByLabel("Password").fill("longenough");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(heading).toHaveText("What do you want to learn?");
  await expect(page.getByText("Step 1 of 3")).toBeVisible();
  await expect(page.getByText("Signed in as Jordan")).toBeAttached();
  await page.getByRole("checkbox", { name: /Typography/ }).check({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Step 2 of 3")).toBeVisible();

  // Skip for now ends onboarding from any step.
  await page.getByRole("button", { name: "Skip for now" }).click();
  await expect(heading).toHaveText("Next: checkout, then the first lesson");
  await expect(page.getByText("Design Systems for Scale · $149")).toBeVisible();
  await expect(page.getByText("Typography", { exact: true })).toBeVisible();
  await expect(page.getByText("Skipped with Skip for now")).toBeVisible();

  // Back steps back through the prototype, not off the page.
  await page.goBack();
  await expect(page.getByText("Step 2 of 3")).toBeVisible();
});

test("log in skips onboarding and goes to checkout", async ({ page }) => {
  await open(page, "?screen=course&course=color-theory");
  await page.getByRole("link", { name: "Log in" }).click();
  await expect(page.locator("#lumin-screen-heading")).toHaveText("Welcome back");
  await page.getByLabel("Email address").fill("sam@example.com");
  await page.getByLabel("Password").fill("longenough");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.locator("#lumin-screen-heading")).toHaveText(
    "Next: checkout, then the first lesson",
  );
  await expect(page.getByText("Logged in as sam@example.com")).toBeVisible();
});

test("the three fixes from the case study hold", async ({ page }) => {
  await open(page);

  // 1. No Enroll buttons on catalog cards: the whole card is the link.
  const grid = page.getByRole("list", { name: "Courses" });
  await expect(grid.getByRole("button")).toHaveCount(0);
  await expect(grid.getByText(/enroll/i)).toHaveCount(0);

  // 3. One card component: every card has the same rating/length row.
  const cards = grid.getByRole("link");
  const count = await cards.count();
  expect(count).toBe(9);
  for (let i = 0; i < count; i++) {
    await expect(cards.nth(i)).toContainText(/out of 5/);
    await expect(cards.nth(i)).toContainText(/\d+ hours/);
  }

  // 2. Logged out, the curriculum shows no progress: no completion checks.
  await cards.first().click();
  const curriculum = page.getByRole("region", { name: "Course curriculum" });
  // Every lesson carries the plain outline ring and nothing else: no check,
  // no filled "current lesson" dot.
  await expect(curriculum.locator("li")).toHaveCount(9);
  await expect(curriculum.locator("li svg.lucide-circle")).toHaveCount(9);
  await expect(curriculum.locator("li svg:not(.lucide-circle)")).toHaveCount(0);
});

test("nothing typed into the prototype leaves the browser", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (r) => {
    const url = new URL(r.url());
    if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1")
      external.push(r.url());
  });
  await open(page, "?screen=signup");
  await page.getByLabel("Full name").fill("Jordan Lee");
  await page.getByLabel("Email address").fill("jordan@example.com");
  await page.getByLabel("Password").fill("longenough");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.locator("#lumin-screen-heading")).toHaveText(
    "What do you want to learn?",
  );
  expect(external).toEqual([]);
});
