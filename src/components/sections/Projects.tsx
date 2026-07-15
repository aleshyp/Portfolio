import { Section } from "@/components/Section";
import { AnimatedReveal, StaggerGroup } from "@/components/AnimatedReveal";
import { Eyebrow } from "@/components/Badge";
import { ProjectCard } from "@/components/ProjectCard";
import { renderProjectScene } from "@/components/projectAssets";
import { projects } from "@/data/projects";

export function Projects() {
  return (
    <Section id="work">
      <AnimatedReveal>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <Eyebrow>Selected work</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              Case studies in clarity and craft.
            </h2>
            <p className="mt-4 text-fg-muted">
              A few projects where thoughtful design moved the numbers — and made
              things genuinely nicer to use.
            </p>
          </div>
          <p className="text-sm font-medium text-fg-faint">
            {projects.length} projects
          </p>
        </div>
      </AnimatedReveal>

      <StaggerGroup className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            // The case-study hero (scene 0) doubles as the card thumbnail.
            // Decorative here — the card's heading names the project — and no
            // video in a six-card grid. See renderProjectScene.
            thumbnail={renderProjectScene(project.slug, 0, "h-full w-full", {
              allowVideoHero: false,
              decorative: true,
            })}
          />
        ))}
      </StaggerGroup>
    </Section>
  );
}
