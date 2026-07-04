import { ImageResponse } from "next/og";
import { site } from "@/data/site";

/**
 * Dynamic Open Graph / Twitter card image for the home page.
 * Next.js auto-wires og:image + twitter:image from this file (correct absolute
 * URL, dimensions, and content-type) — no static asset needed. Rendered at
 * build/request time with the Satori-backed ImageResponse.
 *
 * Brand colors mirror tailwind.config.ts `brand` (emerald) so the card matches
 * the site. 1200×630 is the standard OG size.
 */

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          // brand-950 → brand-900 → emerald-950 gradient, matching the site
          background:
            "linear-gradient(135deg, #022c22 0%, #064e3b 55%, #022c22 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "30px",
            fontWeight: 600,
            color: "#6ee7b7", // brand-300
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "9999px",
              background: "#34d399", // brand-400
            }}
          />
          Portfolio
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "84px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {site.name}
          </div>
          <div style={{ fontSize: "40px", fontWeight: 500, color: "#d1fae5" }}>
            {site.role}
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#a7f3d0", // brand-200
              maxWidth: "820px",
              lineHeight: 1.4,
            }}
          >
            {site.tagline}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
