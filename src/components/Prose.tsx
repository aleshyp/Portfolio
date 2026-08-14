import { cn } from "@/lib/utils";

/**
 * Body-copy wrapper: stacked paragraphs at a comfortable measure.
 *
 * `space-y-4 text-fg-muted` recurred across About and the case-study page. The
 * `max-w-prose` cap keeps running text near the ~65ch reading width DESIGN.md
 * §1.7 asks for; pass `className="max-w-none"` where a parent already constrains
 * the column.
 */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-prose space-y-4 text-fg-muted", className)}>
      {children}
    </div>
  );
}
