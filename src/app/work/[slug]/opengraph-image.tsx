import { ImageResponse } from "next/og";
import { getProject, projects } from "@/data/projects";
import { site } from "@/data/site";

/**
 * Per-case-study Open Graph / Twitter image. Next auto-wires og:image +
 * twitter:image for /work/[slug] from this file, generating one per slug at
 * build time. Mirrors the site's brand (emerald) styling.
 */

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-generate an image for each known slug (matches generateStaticParams).
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function CaseStudyOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  const title = project?.title ?? "Case study";
  const tags = project?.tags.join("  ·  ") ?? "";

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
            fontSize: "28px",
            fontWeight: 600,
            color: "#6ee7b7",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "9999px",
              background: "#34d399",
            }}
          />
          {site.name} — Case Study
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>
          {tags ? (
            <div style={{ fontSize: "30px", fontWeight: 500, color: "#a7f3d0" }}>
              {tags}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size },
  );
}
