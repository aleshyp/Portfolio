#!/usr/bin/env node
/**
 * Builds public/resume.pdf from the site's own data.
 *
 *   npm run resume
 *
 * The résumé used to be a hand-made PDF, and it drifted: it listed four case
 * studies after the site had five. Generating it from src/data/site.ts and
 * src/data/projects.ts means the roles, skills, tools and selected work on the
 * PDF are the same objects the site renders. Change the data, re-run this.
 *
 * Node strips the TypeScript types on import (Node 22.18+ / 23.6+ do it
 * unflagged); both data files are plain objects with no imports, which is what
 * makes that possible. Keep them that way.
 *
 * Renders with Playwright's Chromium (already installed for the e2e suite).
 * Fonts come from Google Fonts, so this needs a network connection.
 */
import { writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const { site, siteUrl, experience, leadership, educationGroups, skillGroups, tools } =
  await import("../src/data/site.ts");
const { projects } = await import("../src/data/projects.ts");

const OUT = new URL("../public/resume.pdf", import.meta.url);

// Fixed print palette. These mirror the light-theme tokens in globals.css
// (fg, fg-muted, fg-faint, brand-700, brand-50/200); a PDF can't read CSS
// variables from the app, so they're restated here rather than invented.
const C = {
  fg: "#0b1220",
  muted: "#475569",
  faint: "#64748b",
  brand: "#047857",
  brandSoft: "#ecfdf5",
  brandLine: "#a7f3d0",
  rule: "#e2e8f0",
};

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const host = new URL(siteUrl).host;
const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;

// The LinkedIn slug has a generated suffix; the short form reads better on
// paper and the link still goes to the real profile.
const contact = [
  `<span class="nowrap">${esc(site.location)}</span>`,
  link(`mailto:${site.email}`, site.email),
  link(`${siteUrl}/`, host),
  link(site.socials.linkedin, "linkedin.com/in/ian-riley"),
].join('<span class="dot">•</span>');

const skillsHtml = skillGroups
  .map(
    // Each skill stays whole, so a line never breaks inside "Accessibility (WCAG 2.2)".
    (g) =>
      `<div class="item"><h4>${esc(g.title)}</h4><p>${g.items.map((i) => `<span class="nowrap">${esc(i)}</span>`).join(", ")}</p></div>`,
  )
  .join("");

const toolsHtml = tools.map((t) => `<span class="pill">${esc(t)}</span>`).join("");

// "This Site" only makes sense while you're on the site. On paper it needs the
// site's name.
const resumeNames = { "portfolio-design-system": host };

const workHtml = projects
  .map((p) => {
    const name = resumeNames[p.slug] ?? p.title.split(":")[0];
    // Role is on the case study; the résumé keeps each entry to two lines.
    const meta = [p.year, p.concept ? "concept" : null, p.demoHref ? "coded prototype" : null]
      .filter(Boolean)
      .join(" · ");
    return `<div class="item">
      <h4>${link(`${siteUrl}/work/${p.slug}`, name)} <span class="meta">${esc(meta)}</span></h4>
      <p>${esc(p.blurb)}</p>
    </div>`;
  })
  .join("");

// Grouped by institution in site.ts, shared with the site's Education card.
const educationHtml = educationGroups()
  .map(
    (g) =>
      `<div class="item"><h4>${esc(g.title)}</h4><p>${esc(g.brief ?? g.detail)} <span class="meta">· ${esc(g.period)}</span></p></div>`,
  )
  .join("");

const experienceHtml = experience
  .map(
    // Highlights only: on the site each job also has a prose summary, but it
    // mostly restates its own bullets, and a résumé has one page to spend.
    (x) => `<div class="job">
      <div class="job-head"><h3>${esc(x.role)}</h3><span class="period">${esc(x.period)}</span></div>
      <p class="company">${esc(x.company)}</p>
      <ul>${x.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
    </div>`,
  )
  .join("");

// Same layout as a job. An entry without a title (see LeadershipItem) leads
// with the organisation and puts its context where the company would go.
const leadershipHtml = leadership
  .map(
    (x) => `<div class="job">
      <div class="job-head"><h3>${esc(x.role ?? x.org)}</h3><span class="period">${esc(x.period)}</span></div>
      ${x.role ? `<p class="company">${esc(x.org)}</p>` : `<p class="context">${esc(x.context ?? "")}</p>`}
      <ul>${x.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
    </div>`,
  )
  .join("");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(site.name)} — Résumé</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=block" rel="stylesheet">
<style>
  @page { size: Letter; margin: 0.5in 0.55in; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font: 9.4pt/1.4 Inter, sans-serif; color: ${C.muted}; }
  a { color: inherit; text-decoration: none; white-space: nowrap; }
  h1 { font: 700 26pt/1.1 Sora, sans-serif; color: ${C.fg}; letter-spacing: -0.02em; }
  .title { margin-top: 4pt; font: 600 12pt Inter, sans-serif; color: ${C.brand}; }
  .tagline { margin-top: 5pt; font-size: 10pt; }
  .contact { margin-top: 7pt; font-size: 8.8pt; }
  .nowrap { white-space: nowrap; }
  .dot { margin: 0 6pt; color: ${C.brandLine}; }
  header { padding-bottom: 12pt; border-bottom: 2pt solid ${C.brand}; }
  .cols { display: grid; grid-template-columns: 36% 1fr; gap: 22pt; margin-top: 14pt; }
  /* Kept modest: wider tracking makes some PDF text extractors (and so some
     applicant-tracking systems) read "SKILLS" as "SKI L LS". */
  h2 { font: 700 8.5pt Sora, sans-serif; letter-spacing: 0.06em; text-transform: uppercase;
       color: ${C.fg}; padding-bottom: 5pt; border-bottom: 1pt solid ${C.rule}; margin: 12pt 0 7pt; }
  section:first-child h2 { margin-top: 0; }
  .item { margin-bottom: 6pt; }
  .item h4 { font: 600 9.6pt Inter, sans-serif; color: ${C.fg}; }
  .item h4 .meta { font-weight: 400; margin-left: 3pt; }
  .meta { color: ${C.faint}; font-size: 8.6pt; }
  .pills { display: flex; flex-wrap: wrap; gap: 4pt 3pt; }
  .pill { font-size: 8.2pt; color: ${C.brand}; background: ${C.brandSoft};
          border: 0.75pt solid ${C.brandLine}; border-radius: 4pt; padding: 1.5pt 4pt; }
  .job { margin-bottom: 9pt; break-inside: avoid; }
  .job-head { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; }
  .job h3 { font: 600 10.6pt Inter, sans-serif; color: ${C.fg}; }
  .period { color: ${C.faint}; font-size: 8.8pt; white-space: nowrap; }
  .company { color: ${C.brand}; font-weight: 600; font-size: 9.6pt; }
  .summary { margin-top: 3pt; }
  .context { color: ${C.faint}; font-size: 9pt; }
  ul { margin-top: 4pt; padding-left: 12pt; }
  li { margin-bottom: 1.5pt; }
  li::marker { color: ${C.brand}; }
</style></head>
<body>
  <header>
    <h1>${esc(site.name)}</h1>
    <p class="title">${esc(site.role)}</p>
    <p class="tagline">${esc(site.tagline)}</p>
    <p class="contact">${contact}</p>
  </header>
  <div class="cols">
    <div>
      <section><h2>Skills</h2>${skillsHtml}</section>
      <section><h2>Tools</h2><div class="pills">${toolsHtml}</div></section>
      <section><h2>Selected work</h2>${workHtml}</section>
      <section><h2>Education</h2>${educationHtml}</section>
    </div>
    <div>
      <section><h2>Experience</h2>${experienceHtml}</section>
      <section><h2>Leadership</h2>${leadershipHtml}</section>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({ format: "Letter", printBackground: true, preferCSSPageSize: true });
  await writeFile(OUT, pdf);

  // One page is the whole point of a résumé. Fail loudly rather than quietly
  // shipping a second page with two orphaned lines on it.
  const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  console.log(`✔ Wrote public/resume.pdf (${pages} page${pages === 1 ? "" : "s"})`);
  if (pages !== 1) {
    console.error("✖ Résumé is not one page — tighten the copy in src/data/site.ts.");
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
