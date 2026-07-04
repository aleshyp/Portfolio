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

// Tighten these once you've measured a baseline. A mostly-static portfolio
// should comfortably clear them.
const CATEGORY_BUDGET = {
  performance: 0.9,
  accessibility: 1.0,
  "best-practices": 0.95,
  seo: 1.0,
};
const CWV_BUDGET = {
  "largest-contentful-paint": 2500, // ms  (LCP < 2.5s)
  "cumulative-layout-shift": 0.1, // unitless (CLS < 0.1)
  "total-blocking-time": 200, // ms  (TBT, lab proxy for INP)
};

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

  for (const [id, min] of Object.entries(CATEGORY_BUDGET)) {
    const score = categories[id]?.score ?? 0;
    const label = `${id.padEnd(16)} ${(score * 100).toFixed(0).padStart(3)} / ${min * 100}`;
    if (score < min) failures.push(`FAIL  ${label}`);
    else console.log(`ok    ${label}`);
  }

  for (const [id, max] of Object.entries(CWV_BUDGET)) {
    const value = audits[id]?.numericValue ?? Infinity;
    const label = `${id.padEnd(28)} ${value.toFixed(id.includes("shift") ? 3 : 0)} (max ${max})`;
    if (value > max) failures.push(`FAIL  ${label}`);
    else console.log(`ok    ${label}`);
  }

  if (failures.length) {
    console.error("\nLighthouse budget FAILED:\n" + failures.join("\n"));
    process.exit(1);
  }
  console.log(`\nLighthouse budget PASSED for ${url}`);
} finally {
  await chrome.kill();
}
