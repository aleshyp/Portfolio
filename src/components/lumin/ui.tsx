"use client";

import {
  BookOpen,
  Brush,
  CodeXml,
  Layers,
  LayoutTemplate,
  Megaphone,
  MousePointer2,
  Palette,
  PanelsTopLeft,
  PenTool,
  Play,
  Sparkles,
  Star,
  Type,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseIcon, InterestIcon } from "./data";
import { useLumin, type Route } from "./state";

/**
 * Lumin's primitives, rebuilt from the Figma components. Colors come from the
 * `--l-*` variables set on the prototype root (see luminPalette in data.ts).
 */

/** The spark mark: a gold four-point star on a violet tile. */
export function LuminMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--l-violet)",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5">
        <path
          d="M12 2.5c.7 5.6 3.9 8.8 9.5 9.5-5.6.7-8.8 3.9-9.5 9.5-.7-5.6-3.9-8.8-9.5-9.5 5.6-.7 8.8-3.9 9.5-9.5Z"
          fill="var(--l-gold-soft)"
        />
      </svg>
    </span>
  );
}

type ButtonVariant = "gold" | "outline" | "quiet";
type ButtonSize = "md" | "sm";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const buttonVariants: Record<ButtonVariant, string> = {
  // Gold is the ONLY primary action color in Lumin's brief. The catalog's
  // violet Enroll buttons broke that rule; the prototype doesn't.
  gold: "bg-(--l-gold) text-(--l-ink) hover:bg-(--l-gold-soft)",
  outline:
    "border border-(--l-line) bg-white text-(--l-ink) hover:border-(--l-lilac) hover:bg-(--l-cloud)",
  quiet: "text-(--l-slate) underline-offset-4 hover:text-(--l-ink) hover:underline",
};

// Padding is a size, not part of the variant: cn() doesn't dedupe, so a
// `px-3` passed in className would lose to a variant's own `px-6`.
const buttonSizes: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-sm",
  sm: "px-3 py-2 text-xs sm:px-4 sm:text-sm",
};

export function luminButton(
  variant: ButtonVariant = "gold",
  className?: string,
  size: ButtonSize = "md",
) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

/**
 * A link to another prototype screen. A real `href` (so middle-click and
 * "copy link" work) that navigates in place on a plain click.
 */
export function LuminLink({
  to,
  className,
  children,
  ...rest
}: {
  to: Route;
  className?: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const { navigate, hrefFor } = useLumin();
  return (
    <a
      href={hrefFor(to)}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
          return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Uppercase category pill, as on the catalog cards. */
export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md bg-(--l-mist) px-2 py-1 text-xs font-bold uppercase tracking-wide text-(--l-violet)",
        className,
      )}
    >
      {children}
    </span>
  );
}

const courseIcons: Record<CourseIcon, LucideIcon> = {
  book: BookOpen,
  palette: Palette,
  pointer: MousePointer2,
  layers: Layers,
  users: Users,
  sparkles: Sparkles,
  code: CodeXml,
  megaphone: Megaphone,
  panels: PanelsTopLeft,
};

const interestIcons: Record<InterestIcon, LucideIcon> = {
  layout: LayoutTemplate,
  type: Type,
  sparkles: Sparkles,
  play: Play,
  brush: Brush,
  pen: PenTool,
  code: CodeXml,
  palette: Palette,
};

export function CourseGlyph({
  icon,
  className,
}: {
  icon: CourseIcon;
  className?: string;
}) {
  const Icon = courseIcons[icon];
  return <Icon aria-hidden="true" strokeWidth={1.5} className={className} />;
}

export function InterestGlyph({
  icon,
  className,
}: {
  icon: InterestIcon;
  className?: string;
}) {
  const Icon = interestIcons[icon];
  return <Icon aria-hidden="true" strokeWidth={1.75} className={className} />;
}

/** "★ 4.8": the star is decoration, the number carries the meaning. */
export function Rating({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Star
        aria-hidden="true"
        className="h-4 w-4 fill-(--l-gold) text-(--l-gold)"
      />
      <span className="font-semibold text-(--l-ink)">
        {value.toFixed(1)}
        <span className="sr-only"> out of 5</span>
      </span>
    </span>
  );
}

/**
 * The heading every screen opens with. Focus moves here when the screen
 * changes (see LuminPrototype), so screen-reader and keyboard users land at the
 * top of the new screen rather than on a control that no longer exists.
 */
export function ScreenHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      id="lumin-screen-heading"
      tabIndex={-1}
      className={cn(
        // Color is inherited (ink from the frame root) or set by the screen:
        // cn() doesn't dedupe, so a text-* here would fight an override.
        "font-display font-extrabold tracking-tight focus:outline-none",
        className,
      )}
    >
      {children}
    </h2>
  );
}
