import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright e2e config. Run with `npm run test:e2e`.
 *
 * Port selection is deliberate. Next 16 refuses to start a second dev server
 * for the same project directory — it exits with "Another next dev server is
 * already running" *after* printing "Ready", so a hardcoded dedicated port
 * fails as an opaque 120s webServer timeout whenever a `npm run dev` is open.
 * Instead we target the conventional dev port and let `reuseExistingServer`
 * adopt that server when it's up, or boot one when it isn't.
 *
 * Override with PW_PORT to point at a server on another port.
 */
const PORT = Number(process.env.PW_PORT ?? 3000);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /**
   * Capped deliberately. Unbounded workers (one per core, x2 projects) starve
   * the shared dev server and Chromium dies with "Target crashed" — a failure
   * that looks like a flaky assertion but is really resource exhaustion.
   */
  workers: process.env.CI ? 2 : 4,
  /**
   * On CI, "github" alone writes no files — it only emits inline annotations,
   * so there is nothing for the workflow to upload when a run fails. Pair it
   * with the HTML reporter (never auto-opening, which would hang a CI job) so
   * a failed run leaves behind a report and the on-first-retry traces.
   */
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Mobile viewport so the responsive nav (hamburger menu) is exercised.
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `next dev --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
