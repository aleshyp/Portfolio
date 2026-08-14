"use client";

import { cn } from "@/lib/utils";

/**
 * Square icon-only control — the theme toggle, the mobile menu trigger, and the
 * back-to-top button, which previously shared a shape but had three different
 * hover treatments.
 *
 * Icon-only means there's no visible label, so `label` is required and becomes
 * the accessible name. `shape` covers the two radii already in use: `squircle`
 * for the navbar controls, `circle` for the footer's back-to-top.
 */

type Shape = "squircle" | "circle";

const shapes: Record<Shape, string> = {
  squircle: "rounded-xl hover:bg-brand-50 dark:hover:bg-white/5",
  circle:
    "rounded-full border border-border-subtle hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 dark:hover:border-brand-500/30 dark:hover:text-brand-300",
};

type IconButtonProps = {
  children: React.ReactNode;
  /** Accessible name — required, since the control shows no text. */
  label: string;
  onClick?: () => void;
  shape?: Shape;
  className?: string;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "className" | "onClick" | "children"
>;

export function IconButton({
  children,
  label,
  onClick,
  shape = "squircle",
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-10 w-10 items-center justify-center text-fg-soft transition-all dark:text-fg-faint",
        shapes[shape],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
