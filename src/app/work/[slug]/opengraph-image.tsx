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
            justifyContent: "space-between",
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
            {site.name} · Case Study
          </div>

          {/* Framed "IR" mark (from brutalist-grid-white.svg), inline so Satori can render it. */}
          <svg width="80" height="80" viewBox="0 0 160 160" fill="none">
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
