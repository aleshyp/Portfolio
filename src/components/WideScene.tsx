import { cn } from "@/lib/utils";

/**
 * Horizontal-scroll container for the wide case-study artboards on narrow screens.
 *
 * The scenes are 1600x900 SVG boards whose labels are sized for a desktop-width
 * render. Fitting one into a 390px phone viewport scales it to ~332px — 0.21x —
 * which drops 22px body labels to 4.6px and the smallest to 3.9px. That is not
 * "small", it is unreadable, so shrinking to fit is the wrong trade.
 *
 * Instead the board keeps a legible MIN width (720px, ~0.45x, which puts those
 * same labels near 10px) and the container scrolls horizontally beneath it. From
 * `sm` up the viewport can show the whole board legibly again, so the min-width
 * is dropped and the scene goes back to fitting its column exactly as before —
 * no scroll, and no change to the desktop layout.
 *
 * A11y: a scrollable region has to be reachable by keyboard (axe
 * `scrollable-region-focusable`, WCAG 2.1.1), so the scroller takes
 * `tabIndex={0}` and a group role/label naming what it scrolls. Both are
 * unconditional even though the element only actually scrolls below `sm`: the
 * class list is static, and a focusable no-op at desktop widths is harmless
 * where a missing tab stop on mobile is a real barrier.
 *
 * `touch-pan-x` keeps vertical page scrolling working when a finger starts on
 * the board, so a swipe up the page isn't swallowed by the scroller.
 */
export function WideScene({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="Case study artboard, scrolls horizontally"
      tabIndex={0}
      className={cn(
        "-mx-6 touch-pan-x overflow-x-auto overscroll-x-contain px-6",
        // Matches the focus treatment used elsewhere on the site.
        "rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "sm:mx-0 sm:overflow-visible sm:px-0",
        className,
      )}
    >
      <div className="min-w-180 sm:min-w-0">{children}</div>
    </div>
  );
}
