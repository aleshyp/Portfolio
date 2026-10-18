import { ImageResponse } from "next/og";
import { getProject, projects } from "@/data/projects";
import { site } from "@/data/site";
import { OgFrame, OgTitleBlock, ogColors as C, ogSize } from "@/lib/ogCard";

/**
 * Per-case-study Open Graph / Twitter image. Next auto-wires og:image +
 * twitter:image for /work/[slug] from this file, generating one per slug at
 * build time.
 *
 * Shares its frame with the home card through @/lib/ogCard, so a shared
 * case-study link and a shared home link read as one family.
 */

// Pre-generate an image for each known slug (matches generateStaticParams).
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/**
 * One image per study, here rather than as a static `alt` export so the alt
 * text can name the study. A fixed export gave every card the alt "Case
 * study", which is what screen readers and crawlers got for all of them.
 */
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await params;
  const title = getProject(slug)?.title ?? "Case study";
  return [
    {
      id: "card",
      alt: `${title}, a case study by ${site.name}`,
      size: ogSize,
      contentType: "image/png",
    },
  ];
}

export default async function CaseStudyOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  return new ImageResponse(
    (
      <OgFrame
        marker="Case study"
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
          title={project?.title ?? "Case study"}
          subtitle={project?.tags.join("  ·  ")}
        />
      </OgFrame>
    ),
    { ...ogSize },
  );
}
