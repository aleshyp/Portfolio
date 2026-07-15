import { ImageResponse } from "next/og";
import { site } from "@/data/site";

/**
 * Dynamic Open Graph / Twitter card image for the home page.
 * Next.js auto-wires og:image + twitter:image from this file (correct absolute
 * URL, dimensions, and content-type) — no static asset needed. Rendered at
 * build/request time with the Satori-backed ImageResponse.
 *
 * Brand colors mirror the `brand` (emerald) tokens in globals.css @theme so the
 * card matches the site. 1200×630 is the standard OG size.
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
            justifyContent: "space-between",
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

          {/* Framed "IR" mark (from ir-glyph-on-dark.svg), inline so Satori can render it. */}
          <svg width="88" height="88" viewBox="0 0 160 160" fill="none">
            <rect x="1.5" y="1.5" width="157" height="157" stroke="#F1F5F9" strokeWidth="3" />
            <path
              d="M52.88 62H65.264V98H52.88V62ZM79.5646 77.408H91.6606C92.8766 77.408 93.8206 77.12 94.4926 76.544C95.1646 75.968 95.5006 75.136 95.5006 74.048C95.5006 72.96 95.1646 72.128 94.4926 71.552C93.8206 70.976 92.8766 70.688 91.6606 70.688H77.8366L83.4046 65.12V98H71.0206V62H93.5806C96.4606 62 98.9726 62.512 101.117 63.536C103.293 64.528 104.973 65.92 106.157 67.712C107.373 69.504 107.981 71.616 107.981 74.048C107.981 76.416 107.373 78.512 106.157 80.336C104.973 82.128 103.293 83.52 101.117 84.512C98.9726 85.504 96.4606 86 93.5806 86H79.5646V77.408ZM83.7886 81.152H97.4686L109.421 98H95.2606L83.7886 81.152Z"
              fill="#10B981"
            />
          </svg>
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
