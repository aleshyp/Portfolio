const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy for this statically-generated site.
//
// script-src: 'unsafe-inline' is required. Next.js injects inline bootstrap &
// hydration scripts (with per-build/per-request streaming data) into the static
// HTML; under a strict `script-src 'self'` the browser blocks them and hydration
// breaks (verified — the page renders but is dead). The only ways to keep a
// strict script-src are (a) nonces, which force every page to DYNAMIC rendering
// and lose static generation/CDN caching, or (b) per-inline-script hashes, which
// aren't stable across builds. For a static marketing site with NO auth and NO
// sensitive data, trading away static rendering to harden scripts isn't worth it.
// So we accept 'unsafe-inline' for scripts and keep every other CSP protection
// strong. If this site ever handles sensitive/authenticated data, revisit with
// the nonce+middleware approach (see security-guidelines → references/headers-csp.md).
//
// style-src: 'unsafe-inline' is required for Framer Motion runtime styles and the
// next-themes anti-flash inline style. Inline styles can't execute JS — low risk.
// Fonts are self-hosted by next/font (font-src 'self'); no external origins needed.
// If you add a third-party script/analytics later, allow-list its specific origin
// here — never widen to '*'.
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  connect-src 'self' https://api.web3forms.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Stop MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Anti-clickjacking; frame-ancestors 'none' in the CSP is the modern equivalent,
  // X-Frame-Options covers older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  // Send origin only on cross-origin requests; full URL same-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable powerful features this site never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS: force HTTPS for two years. Only takes effect over HTTPS in production.
  // NOTE: deliberately no `preload`. Preloading bakes ianriley.co into a list
  // compiled into browser binaries; removal takes months to reach users, and it
  // binds every current and future subdomain to HTTPS-only. That's a bad trade for
  // a portfolio — the two-year max-age below already protects real visitors after
  // their first visit. See security-guidelines skill before reconsidering.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Next 16 only serves qualities on this allow-list (default `[75]`) and
    // 400s on anything else at REQUEST time — a build passes either way, so
    // this must stay in sync with any `quality` prop. 90 is here for the About
    // portrait: its source is a near-lossless export, and the default q75
    // re-encode visibly softens facial detail at the size it renders.
    qualities: [75, 90],
    // 1052 is the exact device-pixel width of a Work-grid card thumbnail at
    // DPR 2 (a 526px card in the 2-up md:grid-cols-2 layout inside max-w-6xl).
    //
    // Without it the browser picks the 1200w candidate and then downscales by
    // 1.14x to fit — a SECOND resample on top of the optimizer's, which costs
    // ~25% of fine detail and is what made the card thumbnails read as soft.
    // Serving the exact width removes that step: measurably sharper AND ~4KB
    // smaller per image than the 1200w candidate it replaces.
    //
    // It goes in imageSizes rather than deviceSizes because these are
    // fixed-width slots, not viewport breakpoints — deviceSizes is global and
    // would shift candidate selection for every image on the site. Note that a
    // `sizes` containing a vw unit filters out entries below deviceSizes[0]
    // (640), so only values above that are usable here.
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 1052],
  },
  // One host. www.ianriley.co served the whole site as a 200 duplicate of the
  // apex; canonical tags covered it for Google, but a permanent redirect
  // consolidates links and shares onto the apex too. Matches siteUrl in
  // src/data/site.ts. Preview deployments use other hosts and are unaffected.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ianriley.co" }],
        destination: "https://ianriley.co/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
