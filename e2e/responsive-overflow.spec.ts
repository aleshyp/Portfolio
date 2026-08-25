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

/**
 * The horizontal artboard scroller is reserved for the hand-drawn boards.
 *
 * Those 1600x900 SVGs carry 17-22px labels, so fitting one to a phone renders
 * its body text near 4.6px — they scroll at a legible 720px instead (see
 * WideScene). Everything else in a case study is photographic: exported product
 * screens, and the logo-reveal videos. Those stay legible when fitted, and
 * wrapping them made the reader drag a video sideways to see its own wordmark.
 *
 * The switch used to be per asset SET (`!intrinsicRatio`), which swept in all of
 * Aperture — hero video included. It's now per SCENE via `sceneNeedsScroll`.
 * This locks that in from the rendered page: no video, and nothing on a study
 * whose scenes are all real exports, may sit inside a scroller.
 */
test.describe("case-study media fits the phone viewport", () => {
  test("no hero video is trapped in a horizontal scroller @ 390px", async ({
    page,
  }) => {
    for (const slug of [
      "brand-identity-system",
      "marketing-landing-page",
      "learning-platform-ui",
    ]) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/work/${slug}`);

      const video = page.locator("article video").first();
      await expect(video).toBeVisible();

      // The video must fit its column, and must have no scrolling ancestor.
      const fit = await video.evaluate((el) => {
        const width = el.getBoundingClientRect().width;
        let node: HTMLElement | null = el.parentElement;
        let scroller: string | null = null;
        while (node && node.tagName !== "ARTICLE") {
          if (node.scrollWidth > node.clientWidth + 1) {
            scroller = node.className || node.tagName;
            break;
          }
          node = node.parentElement;
        }
        return { width, vw: document.documentElement.clientWidth, scroller };
      });

      expect(fit.scroller, `${slug}: hero video inside a scroller`).toBeNull();
      expect(fit.width, `${slug}: hero video wider than viewport`).toBeLessThanOrEqual(fit.vw);
    }
  });

  test("photographic studies use no artboard scroller @ 390px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const slug of [
      "brand-identity-system",
      "marketing-landing-page",
      "learning-platform-ui",
    ]) {
      await page.goto(`/work/${slug}`);
      await expect(
        page.getByRole("group", { name: /scrolls horizontally/i }),
        `${slug}: exported screens should fit, not scroll`,
      ).toHaveCount(0);
    }
  });

  test("the design-system scenes reflow instead of scrolling @ 390px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/work/portfolio-design-system");

    // These were 1600x900 SVG artboards in a horizontal scroller, read by
    // dragging them sideways at ~4.6px type. They are responsive DOM now, so
    // the whole scroller concept is gone from this study: nothing scrolls, and
    // the text is real text at a real size.
    await expect(
      page.getByRole("group", { name: /scrolls horizontally/i }),
    ).toHaveCount(0);

    // The scene shell is the only @container in the article; class-name
    // escaping for `@` is brittle in a selector string, so match on it via
    // the labelled group each scene is wrapped in.
    const scenes = page.locator("article [role='group'][aria-label]");
    await expect(scenes).toHaveCount(4);

    for (const scene of await scenes.all()) {
      const state = await scene.evaluate((el) => {
        const heading = el.querySelector("h3");
        return {
          scrolls: el.scrollWidth > el.clientWidth + 1,
          width: el.getBoundingClientRect().width,
          vw: document.documentElement.clientWidth,
          headingPx: heading
            ? parseFloat(getComputedStyle(heading).fontSize)
            : 0,
        };
      });
      expect(state.scrolls).toBe(false);
      expect(state.width).toBeLessThanOrEqual(state.vw);
      // The failure this replaced rendered labels at ~4.6px.
      expect(state.headingPx).toBeGreaterThanOrEqual(14);
    }
  });

  test("no scene clips its own title on a corner radius @ 400px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 400, height: 824 });
    await page.goto("/work/portfolio-design-system");

    // Regression guard: the case-study page applies `rounded-4xl` (32px) to
    // every scene slot. Once the scenes lost their padded background, their
    // headings sat flush against that edge and the corner curve clipped the
    // first glyph off the title. A scene may round + clip ONLY if it paints a
    // ground that insets its content away from the curve.
    for (const scene of await page
      .locator("article [role='group'][aria-label]")
      .all()) {
      const state = await scene.evaluate((el) => {
        const cs = getComputedStyle(el);
        const heading = el.querySelector("h3");
        const box = el.getBoundingClientRect();
        const hbox = heading!.getBoundingClientRect();
        return {
          radius: parseFloat(cs.borderTopLeftRadius),
          clips: cs.overflowX === "hidden",
          // How far the title starts from the clipping edge.
          inset: hbox.left - box.left,
          title: heading!.textContent ?? "",
        };
      });

      if (state.clips && state.radius > 0) {
        // Content must clear the curve — otherwise the glyph gets eaten.
        expect(
          state.inset,
          `"${state.title}" sits inside a ${state.radius}px clipped corner`,
        ).toBeGreaterThan(0);
      }
    }
  });

  test("every scene spans the same column as the prose @ 400px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 400, height: 824 });
    await page.goto("/work/portfolio-design-system");

    // These scenes are sections of the page, not pictures sitting on it, so
    // each one starts and ends on the same column edge as the case-study text
    // around it. The `gates` scene used to paint a padded ink ground, which
    // made its content 40px narrower than everything else and read as a stray
    // card. Any scene that reintroduces a ground+padding fails here.
    const geometry = await page.evaluate(() => {
      const prose = document
        .querySelector("article p")!
        .getBoundingClientRect();
      const scenes = [
        ...document.querySelectorAll("article [role='group'][aria-label]"),
      ].map((el) => {
        const h = el.querySelector("h3")!;
        const r = h.getBoundingClientRect();
        return {
          title: h.textContent ?? "",
          left: Math.round(r.left),
          width: Math.round(r.width),
        };
      });
      return {
        prose: { left: Math.round(prose.left), width: Math.round(prose.width) },
        scenes,
      };
    });

    expect(geometry.scenes.length).toBe(4);
    for (const scene of geometry.scenes) {
      expect(scene.left, `"${scene.title}" left edge`).toBe(
        geometry.prose.left,
      );
      expect(scene.width, `"${scene.title}" width`).toBe(
        geometry.prose.width,
      );
    }
  });
});
