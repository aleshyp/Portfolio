import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { OgFrame, OgTitleBlock, ogColors as C, ogSize } from "@/lib/ogCard";

/**
 * Open Graph / Twitter image for the Lumin prototype. Without its own file the
 * page shared with no image at all: the root card doesn't carry over once a
 * page sets its own `openGraph` (Next merges metadata shallowly).
 */

export const alt = `Lumin, from catalog to enrolled: a coded prototype by ${site.name}`;
export const size = ogSize;
export const contentType = "image/png";

export default function LuminPrototypeOgImage() {
  return new ImageResponse(
    (
      <OgFrame
        marker="Coded prototype"
        footerLeft={
          <div style={{ display: "flex", color: C.brand100 }}>{site.name}</div>
        }
        footerRight={
          <div style={{ display: "flex", opacity: 0.8 }}>
            {site.email.split("@")[1]}
          </div>
        }
      >
        <OgTitleBlock
          title="Lumin, from catalog to enrolled"
          subtitle="Search  ·  Course page  ·  Sign-up  ·  Onboarding"
        />
      </OgFrame>
    ),
    { ...size },
  );
}
