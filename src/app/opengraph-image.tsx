import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { OgFrame, ogColors as C, ogSize } from "@/lib/ogCard";

/**
 * Dynamic Open Graph / Twitter card image for the home page.
 * Next.js auto-wires og:image + twitter:image from this file (correct absolute
 * URL, dimensions, and content-type) — no static asset needed. Rendered at
 * build/request time with the Satori-backed ImageResponse.
 *
 * The frame (ground, glow, grid rules, top row, footer bar) is shared with the
 * case-study and prototype cards in @/lib/ogCard; this file supplies the type.
 */

export const alt = `${site.name} · ${site.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        marker={site.available ? "Available for work" : "Portfolio"}
        footerLeft={
          <div style={{ display: "flex", letterSpacing: "0.02em" }}>
            {site.email.split("@")[1]}
          </div>
        }
        footerRight={
          <div style={{ display: "flex", opacity: 0.8 }}>{site.location}</div>
        }
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
      </OgFrame>
    ),
    { ...size },
  );
}
