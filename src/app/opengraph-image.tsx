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
 *
 * ── Composition notes ─────────────────────────────────────────────────────
 * Built as stacked absolute layers rather than one flex column, because the
 * earlier version left the right half of the card empty while everything
 * huddled against the left edge. The layers, back to front:
 *   1. gradient ground        4. framed IR mark, sized to balance the type
 *   2. grid rule hairlines    5. the name / role / tagline block
 *   3. emerald corner glow    6. footer bar carrying the domain + location
 *
 * Satori implements a FLEXBOX SUBSET only — no CSS grid, and any element with
 * more than one child needs an explicit `display: flex`. Keep that in mind when
 * editing: a missing display:flex renders as a silently collapsed layer.
 */

export const alt = `${site.name} · ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mirrors the `brand` ramp in globals.css @theme.
const C = {
  brand500: "#10b981",
  brand400: "#34d399",
  brand300: "#6ee7b7",
  brand200: "#a7f3d0",
  brand100: "#d1fae5",
  slate100: "#f1f5f9",
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          // brand-950 → brand-900 → brand-950, matching the site's dark panels
          background:
            "linear-gradient(135deg, #022c22 0%, #064e3b 52%, #022c22 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Emerald corner glow — the same top-right accent the contact panel
            carries on the site, giving the flat gradient some depth. */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -200,
            width: 720,
            height: 720,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(16,185,129,0.30) 0%, rgba(16,185,129,0.10) 45%, rgba(16,185,129,0) 70%)",
          }}
        />

        {/* Grid rules — a nod to the brutalist-grid logo mark. Hairlines only,
            so they read as structure rather than as content. */}
        {[300, 600, 900].map((x) => (
          <div
            key={x}
            style={{
              position: "absolute",
              top: 0,
              left: x,
              width: 1,
              height: 630,
              background: "rgba(209,250,229,0.07)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 248,
            width: 1200,
            height: 1,
            background: "rgba(209,250,229,0.07)",
          }}
        />

        {/* Top row: availability marker (left) + framed IR mark (right) */}
        <div
          style={{
            position: "absolute",
            top: 72,
            left: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "14px 30px 14px 22px",
              borderRadius: 9999,
              border: "1px solid rgba(110,231,183,0.35)",
              background: "rgba(16,185,129,0.10)",
              fontSize: 26,
              fontWeight: 600,
              color: C.brand300,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 9999,
                background: C.brand400,
              }}
            />
            {site.available ? "Available for work" : "Portfolio"}
          </div>

          {/* Framed "IR" mark (from brutalist-grid-white.svg), inline so Satori
              can render it. Larger than before so it anchors the corner rather
              than floating there as a detail. */}
          <svg width="116" height="116" viewBox="0 0 160 160" fill="none">
            <rect
              x="1.5"
              y="1.5"
              width="157"
              height="157"
              stroke={C.slate100}
              strokeWidth="3"
            />
            <path
              d="M52.88 62H65.264V98H52.88V62ZM79.5646 77.408H91.6606C92.8766 77.408 93.8206 77.12 94.4926 76.544C95.1646 75.968 95.5006 75.136 95.5006 74.048C95.5006 72.96 95.1646 72.128 94.4926 71.552C93.8206 70.976 92.8766 70.688 91.6606 70.688H77.8366L83.4046 65.12V98H71.0206V62H93.5806C96.4606 62 98.9726 62.512 101.117 63.536C103.293 64.528 104.973 65.92 106.157 67.712C107.373 69.504 107.981 71.616 107.981 74.048C107.981 76.416 107.373 78.512 106.157 80.336C104.973 82.128 103.293 83.52 101.117 84.512C98.9726 85.504 96.4606 86 93.5806 86H79.5646V77.408ZM83.7886 81.152H97.4686L109.421 98H95.2606L83.7886 81.152Z"
              fill={C.brand500}
            />
          </svg>
        </div>

        {/* Name / role / tagline, anchored above the footer bar rather than
            floating mid-card, so the eye lands on the name first. */}
        <div
          style={{
            position: "absolute",
            left: 80,
            bottom: 150,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 42,
              fontWeight: 500,
              color: C.brand200,
              letterSpacing: "-0.01em",
            }}
          >
            {site.role}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 27,
              color: C.brand100,
              opacity: 0.75,
              maxWidth: 760,
              lineHeight: 1.4,
            }}
          >
            {site.tagline}
          </div>
        </div>

        {/* Footer bar: domain + location. Fills the dead band along the bottom
            edge and tells a reader where the link actually goes. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 86,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 80px",
            borderTop: "1px solid rgba(110,231,183,0.18)",
            background: "rgba(2,44,34,0.55)",
            fontSize: 25,
            color: C.brand200,
          }}
        >
          <div style={{ display: "flex", letterSpacing: "0.02em" }}>
            {site.email.split("@")[1]}
          </div>
          <div style={{ display: "flex", opacity: 0.8 }}>{site.location}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
