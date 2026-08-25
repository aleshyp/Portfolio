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
  // NOTE: no `preload` — that's a hard-to-reverse commitment. Add it only once the
  // real domain is live and permanently HTTPS-only (see security-guidelines skill).
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
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
