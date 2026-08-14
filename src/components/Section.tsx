import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionProps = {
  children: React.ReactNode;
  id?: string;
  className?: string;
  /**
   * When false, content is rendered without the Container wrapper — for a
   * section whose children manage their own full-width layout.
   *
   * Note this differs from a full-bleed *panel*: Contact's dark band is still
   * inside the Container (it aligns with the grid), it just paints edge to edge
   * within it. That case wants `contained` left alone; the panel itself carries
   * the background.
   */
  contained?: boolean;
};

/** Provides consistent vertical rhythm and an optional anchor id. */
export function Section({
  children,
  id,
  className,
  contained = true,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-20 sm:py-28", className)}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
