import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { projects, getProject, getNextProject } from "@/data/projects";
import { Container } from "@/components/Container";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { Placeholder } from "@/components/Placeholder";
import { WideScene } from "@/components/WideScene";
import {
  getAssetSet,
  renderProjectScene,
  sceneNeedsScroll,
} from "@/components/projectAssets";
import { Badge, Eyebrow } from "@/components/Badge";
import { ConceptBadge } from "@/components/ConceptBadge";
import { Card } from "@/components/Card";
import { CaseStudyCta } from "@/components/CaseStudyCta";
import { Button, buttonClasses } from "@/components/Button";
import { cn } from "@/lib/utils";

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

  // Most asset sets are 16:9 artboards, so the gallery pins that ratio. Sets
  // flagged `intrinsicRatio` (full-page screenshots) size themselves from their
  // own dimensions instead — pinning 16:9 there would crop the page away.
  const galleryRatio = assetSet?.intrinsicRatio ? "" : "aspect-[16/9]";

  // Only the hand-drawn artboards need the horizontal scroller: they're 1600x900
  // boards with desktop-sized labels, so fitting one to a phone renders its body
  // text at ~4.6px. Photographic scenes — exported screens, and the logo-reveal
  // videos — stay legible when fitted, so they just fit. `sceneNeedsScroll`
  // answers this per SCENE; asking it per set is what previously forced Aperture's
  // hero video out to 720px on a 390px phone.
  //
  // Returns null unchanged so `?? <Placeholder>` fallbacks still fire — a
  // WideScene wrapped around null is a truthy element and would swallow them.
  const wrapScene = (node: React.ReactNode, index: number) =>
    node && sceneNeedsScroll(project.slug, index) ? (
      <WideScene>{node}</WideScene>
    ) : (
      node
    );

  // Visible caption under a scene. Wraps in a <figure> only when there's a
  // caption to show, and passes null through so the Placeholder fallbacks
  // below still fire (same reason as wrapScene).
  const captioned = (node: React.ReactNode, index: number) => {
    const caption = assetSet?.scenes[index]?.caption;
    if (!node || !caption) return node;
    return (
      <figure>
        {node}
        <figcaption className="mt-3 max-w-prose text-sm text-fg-muted">
          {caption}
        </figcaption>
      </figure>
    );
  };

  // Scene 0 is the cover and each content block claims the next one, so a set
  // with more scenes than `blocks.length + 1` has leftovers. They render in the
  // "More screens" gallery below rather than being silently dropped.
  const usedScenes = project.blocks.length + 1;
  const extraScenes = Array.from(
    { length: Math.max(0, (assetSet?.scenes.length ?? 0) - usedScenes) },
    (_, i) => usedScenes + i,
  );

  return (
    <article className="pt-28 sm:pt-32">
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

          {/* Studies whose claims can be exercised rather than read get a link
              to the running thing, high enough that a reader who only skims the
              header still finds it. */}
          {project.demoHref && (
            <div className="mt-7">
              {/* No prefetch: this sits in the first screen, and fetching the
                  demo's bundle there cost the Lumin study ~150ms of LCP. */}
              <Button href={project.demoHref} size="md" prefetch={false}>
                {project.demoLabel ?? "Try the live demo"}
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </div>
          )}
        </AnimatedReveal>

        {/* Meta */}
        <AnimatedReveal delay={0.1}>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-border-subtle py-8 sm:grid-cols-4">
            {[
              { label: "Client", value: project.client },
              { label: "Role", value: project.role },
              { label: "Year", value: project.year },
              { label: "Duration", value: project.duration },
            ]
              // Duration is optional: omitted where the real figure isn't known.
              .filter((m) => m.value)
              .map((m) => (
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

      {/* Cover — straight after the meta row, so the first screen of a study
          shows the work and not only words about it. At 1440x900 it used to
          start below the fold, under the "What I did" list. */}
      <Container>
        <AnimatedReveal delay={0.05}>
          {captioned(wrapScene(
            // The cover uses the same ratio rule as the gallery: the video-hero
            // sets are genuinely 16:9 and get pinned, while a set that sizes
            // itself (the responsive design-system scenes, the full-page
            // captures) is left to its own height. Hardcoding 16:9 here cropped
            // the design-system cover to a 187px-tall letterbox on a phone.
            renderScene(0, cn("mt-10 w-full rounded-4xl", galleryRatio)),
            0,
          ), 0) ?? (
            <Placeholder
              label="Hero visual"
              seed={project.accent}
              className="mt-10 aspect-[16/9] w-full rounded-4xl shadow-soft"
            />
          )}
        </AnimatedReveal>
      </Container>

      <Container>
        {/* What I did — the reader's first question about any project is "what
            was YOUR part", so it's answered as a list right under the cover
            rather than left to be inferred from the prose below. */}
        <AnimatedReveal delay={0.1}>
          <div className="mt-10 border-y border-border-subtle py-8">
            <h2 className="text-xs font-medium uppercase tracking-wider text-fg-faint">
              What I did
            </h2>
            <ul className="mt-4 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {project.contributions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-fg-soft">
                  <Check
                    size={18}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-brand-700 dark:text-brand-400"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
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

            {/* The cold-read version: what was decided, and what was turned
                down. A reviewer who stops here can still say both. */}
            {project.decisions && (
              <div className="mt-8">
                <h2 className="text-xs font-medium uppercase tracking-wider text-fg-faint">
                  Key decisions
                </h2>
                <ul className="mt-4 space-y-4">
                  {project.decisions.map((d) => (
                    <li
                      key={d.chose}
                      className="border-l-2 border-brand-700 pl-4 dark:border-brand-400"
                    >
                      <p className="font-medium text-fg">{d.chose}</p>
                      <p className="mt-1 text-sm text-fg-muted">
                        Instead of {d.over}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AnimatedReveal>

          <AnimatedReveal delay={0.1}>
            <Card variant="soft" className="p-6">
              <p className="text-sm font-medium uppercase tracking-wider text-fg-faint">
                Results
              </p>
              <dl className="mt-4 space-y-5">
                {project.results.map((r) => (
                  // The label is the term and the figure its description, so a
                  // screen reader hears "Screens designed: 10". The column is
                  // reversed so the figure still reads first by eye.
                  <div key={r.label} className="flex flex-col-reverse">
                    <dt className="text-sm text-fg-muted">{r.label}</dt>
                    <dd className="font-display text-3xl font-bold text-brand-600 dark:text-brand-400">
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>
              {project.concept && (
                <p className="mt-5 border-t border-border-subtle pt-4 text-xs leading-relaxed text-fg-faint">
                  {/* Default: invented client AND invented figures. A study whose
                      numbers ARE checkable overrides this — saying "these are
                      targets, not results" about a verifiable test count would
                      undersell it in the name of honesty, which is its own kind
                      of inaccuracy. */}
                  {project.resultsNote ?? (
                    <>
                      Concept project. {project.client.split(" (")[0]} isn&apos;t
                      a real client, and these numbers are the targets I designed
                      against, not results from a shipped product.
                    </>
                  )}
                </p>
              )}
            </Card>
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
                ? captioned(
                    wrapScene(
                      renderScene(
                        i + 1,
                        cn("mt-10 w-full rounded-4xl", galleryRatio),
                      ),
                      i + 1,
                    ),
                    i + 1,
                  )
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

      {/* More screens
          The blocks above consume one scene each (hero = 0, then 1 per block),
          so a set with more scenes than blocks would silently strand the rest.
          Anything left over shows here at its own ratio. */}
      {extraScenes.length > 0 && (
        <Container>
          <div className="mt-24 border-t border-border-subtle pt-16">
            <AnimatedReveal>
              <Eyebrow>More screens</Eyebrow>
            </AnimatedReveal>
            <div className="mt-10 space-y-10">
              {extraScenes.map((sceneIndex) => (
                <AnimatedReveal key={sceneIndex}>
                  {captioned(
                    wrapScene(
                      renderScene(
                        sceneIndex,
                        cn("w-full rounded-4xl", galleryRatio),
                      ),
                      sceneIndex,
                    ),
                    sceneIndex,
                  )}
                </AnimatedReveal>
              ))}
            </div>
          </div>
        </Container>
      )}

      {/* Contact CTA — the reader who got this far is the most engaged one on
          the site, so they get a way to act before the next-project loop. */}
      <CaseStudyCta />

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
              {/* Looks like a primary Button but can't BE one: it sits inside
                  the wrapping <Link> above, and nesting a link in a link is
                  invalid — so it borrows the recipe instead of the element.
                  The group-hover: classes let the whole row drive the effect;
                  the variant's own hover: styles coincide with them (hovering
                  this span necessarily hovers the group) rather than fighting. */}
              <span
                className={buttonClasses({
                  className:
                    "shrink-0 group-hover:-translate-y-0.5 group-hover:bg-brand-800 group-hover:shadow-lift dark:group-hover:bg-brand-600",
                })}
              >
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
