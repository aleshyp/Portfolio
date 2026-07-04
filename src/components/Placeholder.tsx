import { cn } from "@/lib/utils";

type PlaceholderProps = {
  label?: string;
  className?: string;
  /** Seed changes the gradient hue so cards look distinct from each other. */
  seed?: number;
  /**
   * Text alternative for when this is swapped for a real screenshot.
   * TODO(images): when replacing Placeholder with next/image, pass a meaningful
   * `alt` describing the visual (not the filename). If the image is purely
   * decorative, use alt="" instead. Today the gradient is decorative, so the
   * wrapper is aria-hidden unless an alt is provided.
   */
  alt?: string;
};

// Light mode fades to white; dark mode keeps a colored hue instead of graying
// out, so the cards stay vivid rather than flat. See note at the overlay below.
const gradients = [
  "from-brand-100 via-brand-50 to-white dark:from-brand-900 dark:via-emerald-950 dark:to-ink",
  "from-brand-200 via-emerald-50 to-white dark:from-emerald-800 dark:via-brand-950 dark:to-ink",
  "from-emerald-100 via-teal-50 to-white dark:from-teal-800 dark:via-emerald-950 dark:to-ink",
  "from-brand-100 via-teal-50 to-white dark:from-brand-800 dark:via-teal-950 dark:to-ink",
  "from-teal-100 via-brand-50 to-white dark:from-teal-900 dark:via-brand-950 dark:to-ink",
  "from-brand-50 via-emerald-100 to-white dark:from-emerald-900 dark:via-brand-950 dark:to-ink",
];

/**
 * A tasteful gradient placeholder standing in for project imagery.
 * Swap these out for real <Image /> screenshots later — see README.
 */
export function Placeholder({ label, className, seed = 0, alt }: PlaceholderProps) {
  const gradient = gradients[seed % gradients.length];
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className,
      )}
      // Decorative gradient today; when `alt` is supplied (real imagery), expose
      // it to assistive tech instead of hiding the element.
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      {/* subtle dotted texture */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(16,185,129,0.18) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-2xl dark:bg-white/10" />
      {label ? (
        <span className="relative z-10 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-brand-700 backdrop-blur dark:bg-ink/60 dark:text-brand-300">
          {label}
        </span>
      ) : null}
    </div>
  );
}
