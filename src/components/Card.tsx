import { cn } from "@/lib/utils";

/**
 * The canonical card surface.
 *
 * DESIGN.md used to call `ProjectCard` "the canonical card recipe" and instruct
 * you to *copy* it — which had happened four times (Skills, Experience twice,
 * and the case-study Results panel), two of them byte-identical. The recipe now
 * lives here, and `ProjectCard` composes `cardClasses` rather than restating it.
 *
 * - `default` — a card on the page background: opaque `surface` + shadow.
 * - `soft`    — a recessed panel: `background-soft` in light, `surface` in dark,
 *               no shadow. Used for the Education and Results panels, which sit
 *               *inside* content rather than floating above it.
 */

type Variant = "default" | "soft";

const variants: Record<Variant, string> = {
  default: "bg-surface shadow-soft",
  soft: "bg-background-soft dark:bg-surface",
};

/**
 * Class recipe, exported for the two cases that can't use the component:
 * an element that must render as a different tag, or one nested inside a link.
 */
export function cardClasses({
  variant = "default",
  interactive = false,
  className,
}: {
  variant?: Variant;
  interactive?: boolean;
  className?: string;
} = {}): string {
  return cn(
    "rounded-3xl border border-border-subtle",
    variants[variant],
    interactive &&
      "transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
    className,
  );
}

type CardProps = {
  children: React.ReactNode;
  variant?: Variant;
  /** Adds the hover lift. Only for cards that are themselves links/buttons. */
  interactive?: boolean;
  className?: string;
};

export function Card({
  children,
  variant = "default",
  interactive = false,
  className,
}: CardProps) {
  return (
    <div className={cardClasses({ variant, interactive, className })}>
      {children}
    </div>
  );
}
