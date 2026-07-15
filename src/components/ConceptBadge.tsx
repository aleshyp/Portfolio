import { cn } from "@/lib/utils";

/**
 * Marks a case study whose client and metrics are invented rather than measured.
 *
 * This is a disclosure, not decoration: the studies quote specific figures
 * ("+31% activation"), and without a visible label a reader reasonably assumes
 * they're a real track record. Deliberately styled in neutral `fg-*` tones
 * rather than `brand`, so it reads as a factual note and never competes with the
 * tag pills beside it — but it stays legible, not hidden. Don't drop it from a
 * study while that study still quotes invented numbers.
 */
export function ConceptBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border-subtle px-3 py-1 text-xs font-medium text-fg-muted",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-fg-faint"
      />
      Concept project
    </span>
  );
}
