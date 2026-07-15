import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects, getProject, getNextProject } from "@/data/projects";
import { Container } from "@/components/Container";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { Placeholder } from "@/components/Placeholder";
import { getAssetSet, renderProjectScene } from "@/components/projectAssets";
import { Badge, Eyebrow } from "@/components/Badge";
import { ConceptBadge } from "@/components/ConceptBadge";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  const path = `/work/${project.slug}`;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: path,
      type: "article",
      // og:image comes from ./opengraph-image.tsx (Next injects it per-slug).
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
    },
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(project.slug);

  // Scene sets + the renderer live in @/components/projectAssets, shared with the
  // Work grid so a card thumbnail and its case-study hero can't drift apart. The
  // Placeholder fallbacks below stay for any study added later without assets.
  const assetSet = getAssetSet(project.slug);
  const renderScene = (index: number, className: string) =>
    renderProjectScene(project.slug, index, className);

  return (
    <article className="pt-28 sm:pt-36">
      {/* Header */}
      <Container>
        <AnimatedReveal>
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm font-medium text-fg-muted transition-colors hover:text-brand-700 dark:hover:text-brand-300"
          >
            <ArrowLeft size={16} />
            Back to work
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
            {project.concept && <ConceptBadge />}
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-fg sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-fg-muted">
            {project.summary}
          </p>
        </AnimatedReveal>

        {/* Meta */}
        <AnimatedReveal delay={0.1}>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-border-subtle py-8 sm:grid-cols-4">
            {[
              { label: "Client", value: project.client },
              { label: "Role", value: project.role },
              { label: "Year", value: project.year },
              { label: "Duration", value: project.duration },
            ].map((m) => (
              <div key={m.label}>
                <dt className="text-xs font-medium uppercase tracking-wider text-fg-faint">
                  {m.label}
                </dt>
                <dd className="mt-1.5 font-medium text-fg">{m.value}</dd>
              </div>
            ))}
          </dl>
        </AnimatedReveal>
      </Container>

      {/* Cover */}
      <Container>
        <AnimatedReveal delay={0.05}>
          {renderScene(0, "mt-10 aspect-[16/9] w-full rounded-4xl") ?? (
            <Placeholder
              label="Hero visual"
              seed={project.accent}
              className="mt-10 aspect-[16/9] w-full rounded-4xl shadow-soft"
            />
          )}
        </AnimatedReveal>
      </Container>

      {/* Overview + results */}
      <Container>
        <div className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-16">
          <AnimatedReveal className="lg:col-span-2">
            <Eyebrow>Overview</Eyebrow>
            <p className="mt-4 text-lg leading-relaxed text-fg-soft">
              {project.overview}
            </p>
          </AnimatedReveal>

          <AnimatedReveal delay={0.1}>
            <div className="rounded-3xl border border-border-subtle bg-background-soft p-6 dark:bg-surface">
              <p className="text-sm font-medium uppercase tracking-wider text-fg-faint">
                Results
              </p>
              <dl className="mt-4 space-y-5">
                {project.results.map((r) => (
                  <div key={r.label}>
                    <dt className="font-display text-3xl font-bold text-brand-600 dark:text-brand-400">
                      {r.value}
                    </dt>
                    <dd className="text-sm text-fg-muted">{r.label}</dd>
                  </div>
                ))}
              </dl>
              {project.concept && (
                <p className="mt-5 border-t border-border-subtle pt-4 text-xs leading-relaxed text-fg-faint">
                  Concept project — {project.client.split(" (")[0]} is an
                  invented client, and these figures are the targets the design
                  was measured against, not results from a live product.
                </p>
              )}
            </div>
          </AnimatedReveal>
        </div>
      </Container>

      {/* Content blocks */}
      <Container>
        <div className="mt-20 space-y-16">
          {project.blocks.map((block, i) => (
            <AnimatedReveal key={block.heading}>
              <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                  <span className="font-display text-sm font-semibold text-brand-700 dark:text-brand-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-fg">
                    {block.heading}
                  </h2>
                </div>
                <p className="text-lg leading-relaxed text-fg-muted lg:col-span-8">
                  {block.body}
                </p>
              </div>

              {/* Insert a gallery image between blocks */}
              {assetSet
                ? renderScene(i + 1, "mt-10 aspect-[16/9] w-full rounded-4xl")
                : i < project.gallery && (
                    <Placeholder
                      label={`Screen ${i + 1}`}
                      seed={project.accent + i + 1}
                      className="mt-10 aspect-[16/9] w-full rounded-4xl shadow-soft"
                    />
                  )}
            </AnimatedReveal>
          ))}
        </div>
      </Container>

      {/* Next project */}
      <Container>
        <div className="mt-24 border-t border-border-subtle py-16">
          <AnimatedReveal>
            <p className="text-sm font-medium uppercase tracking-wider text-fg-faint">
              Next project
            </p>
            <Link
              href={`/work/${next.slug}`}
              className="group mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
            >
              <h2 className="font-display text-3xl font-bold tracking-tight text-fg transition-colors duration-300 group-hover:text-brand-700 dark:group-hover:text-brand-300 sm:text-4xl">
                {next.title}
              </h2>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-medium text-white transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-brand-800 group-hover:shadow-lift dark:group-hover:bg-brand-600">
                View case study
                <ArrowRight size={16} />
              </span>
            </Link>
          </AnimatedReveal>
        </div>
      </Container>
    </article>
  );
}
