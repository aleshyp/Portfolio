import { test, expect } from "@playwright/test";

/**
 * SEO / metadata checks. See the `test-suite` skill
 * (references/performance-seo.md). Asserts the rendered <head> that Next's
 * Metadata API produces from src/app/layout.tsx, plus the generated OG image,
 * canonical, robots.txt, and sitemap.xml.
 */

test("home has a title and a substantial meta description", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/ian riley/i);
  const desc = page.locator('head meta[name="description"]');
  await expect(desc).toHaveAttribute("content", /.{50,}/);
});

test("home exposes Open Graph + Twitter card tags", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('head meta[property="og:title"]')).toHaveAttribute(
    "content",
    /.+/,
  );
  await expect(
    page.locator('head meta[property="og:description"]'),
  ).toHaveAttribute("content", /.+/);
  await expect(page.locator('head meta[property="og:type"]')).toHaveAttribute(
    "content",
    "website",
  );
  await expect(page.locator('head meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    /summary/,
  );
});

test("html has a lang attribute", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("skip-to-content link is the first focusable element", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: /skip to content/i }),
  ).toBeFocused();
});

test("unknown route returns a real 404 (not a soft-404)", async ({ page }) => {
  const res = await page.goto("/work/does-not-exist");
  expect(res?.status()).toBe(404);
});

test("home sets an og:image for link previews", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('head meta[property="og:image"]')).toHaveAttribute(
    "content",
    /^https?:\/\/.+/,
  );
});

test("home declares a canonical URL", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^https?:\/\/.+/,
  );
});

test("case study declares its own canonical + article OG type", async ({
  page,
}) => {
  await page.goto("/work/learning-platform-ui");
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/work\/learning-platform-ui$/,
  );
  await expect(page.locator('head meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  );
});

test("sitemap.xml is served and lists the home + case studies", async ({
  page,
}) => {
  const res = await page.goto("/sitemap.xml");
  expect(res?.status()).toBe(200);
  const body = (await res?.text()) ?? "";
  expect(body).toContain("<urlset");
  expect(body).toMatch(/\/work\/learning-platform-ui/);
});

test("robots.txt is served and references the sitemap", async ({ page }) => {
  const res = await page.goto("/robots.txt");
  expect(res?.status()).toBe(200);
  const body = (await res?.text()) ?? "";
  expect(body).toMatch(/user-agent/i);
  expect(body).toMatch(/sitemap:/i);
});
