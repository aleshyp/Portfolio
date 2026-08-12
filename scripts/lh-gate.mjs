// Lighthouse budget gate. Runs Lighthouse against a *production* build and
// fails (exit 1) if category scores or Core Web Vitals regress past budget.
// See the `test-suite` skill (references/performance-seo.md).
//
// Usage:
//   npm run build && npm run start &        # serve production on :3000
//   node scripts/lh-gate.mjs [url]          # defaults to http://localhost:3000
//
// Requires the `lighthouse` and `chrome-launcher` devDependencies.

import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const url = process.argv[2] ?? "http://localhost:3000";

// Measured 2026-08-11 against a local production build, so these are no longer
// aspirational — every budget below is one the site actually meets, except the
// LCP ratchet called out further down.
// The performance SCORE is computed from the same CPU-bound metrics that CI
// throttling inflates, so it is unreliable on a shared runner (measured 95
// locally vs 58 in CI on identical code). The quality-signal categories below
// are not timing-dependent and hold everywhere.
const CATEGORY_BUDGET = {
  performance: 0.9, // measured 95 locally — see CI override below
  accessibility: 1.0,
  "best-practices": 0.95, // measured 100
  seo: 1.0,
};

// Performance scoring on a shared CI runner is noise. Keep the category
// enforced strictly on local runs, and hold CI to a floor that still catches a
// genuine collapse without failing on runner variance.
const CI_CATEGORY_FLOOR = { performance: 0.4 };

// The Core Web Vitals target we ultimately want. LCP is NOT met today — see
// LCP_RATCHET below.
const CWV_TARGET = {
  "largest-contentful-paint": 2500, // ms  (LCP < 2.5s)
  "cumulative-layout-shift": 0.1, // unitless (CLS < 0.1) — measured 0.000
  "total-blocking-time": 200, // ms  (TBT, lab proxy for INP) — measured ~10
};

// KNOWN FAILURE — pre-existing, not a regression.
//
// LCP measures ~3.0s locally against the 2.5s target. This predates the gate:
// `main` measured 3405ms, so the budget has simply never been enforced before.
// Lighthouse does not attribute it to an image (the LCP-element audit comes
// back empty), which points at render-blocking JS rather than an unoptimized
// asset — the nav logos already use `priority`.
//
// Rather than ship a permanently-red gate or delete the check, we ratchet:
// fail if LCP gets WORSE than the current measurement, so the number can only
// improve. Lower this as it improves; delete it once it clears CWV_TARGET.
// Real fix tracked separately — it's page-level perf work, not a dependency bump.
const LCP_RATCHET = 3200; // ms — local measurement is ~3002 (main was 3405)

// CI runners are shared and CPU-throttled, which inflates CPU-bound metrics
// badly (TBT measured 1251ms in CI vs ~10ms locally — a 78x gap). Those numbers
// say nothing about the site, so CPU-bound budgets are relaxed under CI.
const isCI = !!process.env.CI;
// TBT measured 1251ms and 2191ms across two CI runs of identical code — the
// variance alone is larger than the entire local budget, so this needs wide
// headroom to avoid flaking. LCP is far less CPU-sensitive and needs less.
const CI_MULTIPLIER = { "total-blocking-time": 25, "largest-contentful-paint": 1.5 };

const CWV_BUDGET = Object.fromEntries(
  Object.entries({ ...CWV_TARGET, "largest-contentful-paint": LCP_RATCHET }).map(
    ([id, max]) => [id, isCI ? max * (CI_MULTIPLIER[id] ?? 1) : max],
  ),
);

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--no-sandbox"],
});

try {
  const runnerResult = await lighthouse(url, {
    port: chrome.port,
    output: "json",
    logLevel: "error",
    onlyCategories: Object.keys(CATEGORY_BUDGET),
  });

  const { categories, audits } = runnerResult.lhr;
  const failures = [];

  for (const [id, target] of Object.entries(CATEGORY_BUDGET)) {
    const relaxed = isCI && CI_CATEGORY_FLOOR[id] !== undefined;
    const min = relaxed ? CI_CATEGORY_FLOOR[id] : target;
    const score = categories[id]?.score ?? 0;
    const suffix = relaxed ? `  [CI floor; local target ${target * 100}]` : "";
    const label = `${id.padEnd(16)} ${(score * 100).toFixed(0).padStart(3)} / ${min * 100}${suffix}`;
    if (score < min) failures.push(`FAIL  ${label}`);
    else console.log(`ok    ${label}`);
  }

  for (const [id, max] of Object.entries(CWV_BUDGET)) {
    const value = audits[id]?.numericValue ?? Infinity;
    // Flag budgets that aren't the real target, so a pass here is never read as
    // "meets Core Web Vitals".
    const notes = [];
    if (id === "largest-contentful-paint") notes.push(`ratchet, target ${CWV_TARGET[id]}`);
    if (isCI && CI_MULTIPLIER[id]) notes.push("CI-relaxed");
    const suffix = notes.length ? `  [${notes.join("; ")}]` : "";
    const isUnitless = id.includes("shift");
    const shownMax = isUnitless ? max : Math.round(max);
    const label = `${id.padEnd(28)} ${value.toFixed(isUnitless ? 3 : 0)} (max ${shownMax})${suffix}`;
    if (value > max) failures.push(`FAIL  ${label}`);
    else console.log(`ok    ${label}`);
  }

  if (failures.length) {
    console.error("\nLighthouse budget FAILED:\n" + failures.join("\n"));
    process.exit(1);
  }
  console.log(`\nLighthouse budget PASSED for ${url}${isCI ? " (CI-relaxed CPU budgets)" : ""}`);
  console.log(
    `NOTE: LCP is gated by a ratchet (${LCP_RATCHET}ms), not the ${CWV_TARGET["largest-contentful-paint"]}ms CWV target. See scripts/lh-gate.mjs.`,
  );
} finally {
  await chrome.kill();
}

