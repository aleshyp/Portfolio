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

// Every indexable route, with the title its share card should carry. Each must
// produce a complete card on its own: Next merges metadata shallowly, so a page
// that sets `openGraph` loses whatever the root layout set (src/lib/seo.ts).
const sharePages = [
  { path: "/", title: /ian riley/i },
  { path: "/work/learning-platform-ui", title: /^Lumin/ },
  { path: "/prototypes/lumin", title: /^Lumin prototype/ },
];

for (const { path, title } of sharePages) {
  test(`${path} has a complete share card`, async ({ page }) => {
    await page.goto(path);
    const og = (p: string) => page.locator(`head meta[property="og:${p}"]`);
    await expect(og("title")).toHaveAttribute("content", title);
    await expect(og("site_name")).toHaveAttribute("content", "Ian Riley");
    await expect(og("locale")).toHaveAttribute("content", "en_US");
    await expect(og("image")).toHaveAttribute("content", /^https?:\/\/.+/);
    // Not a generic label shared by every card.
    await expect(og("image:alt")).not.toHaveAttribute("content", /^Case study$/);
    // Twitter tags must describe THIS page, not fall back to the home page's.
    await expect(
      page.locator('head meta[name="twitter:title"]'),
    ).toHaveAttribute("content", title);
  });

  test(`${path} emits valid JSON-LD`, async ({ page }) => {
    await page.goto(path);
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(blocks).toHaveLength(1);
    const graph = JSON.parse(blocks[0])["@graph"] as { "@type": string }[];
    const types = graph.map((n) => n["@type"]);
    expect(types).toEqual(
      path === "/"
        ? ["WebSite", "ProfilePage", "Person"]
        : ["CreativeWork", "BreadcrumbList"],
    );
  });
}

test("the image named in each page's JSON-LD is served", async ({
  page,
  request,
}) => {
  for (const { path } of sharePages) {
    await page.goto(path);
    const graph = JSON.parse(
      await page.locator('script[type="application/ld+json"]').textContent() ??
        "{}",
    )["@graph"] as { image?: string }[];
    for (const { image } of graph.filter((n) => n.image)) {
      // JSON-LD carries absolute production URLs; check the path locally.
      const res = await request.get(new URL(image!).pathname);
      expect(res.status(), image).toBe(200);
      expect(res.headers()["content-type"]).toMatch(/^image\//);
    }
  }
});
