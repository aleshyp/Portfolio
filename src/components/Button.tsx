import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "ink" | "onDark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white shadow-soft hover:bg-brand-800 hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0 active:bg-brand-900 active:shadow-soft dark:hover:bg-brand-800 dark:active:bg-brand-900",
  outline:
    "border border-brand-200 bg-white text-brand-700 hover:border-brand-300 hover:bg-brand-50 hover:-translate-y-0.5 active:translate-y-0 active:bg-brand-100 dark:border-brand-500/30 dark:bg-white/5 dark:text-brand-300 dark:hover:border-brand-500/50 dark:hover:bg-white/10 dark:active:bg-white/[0.08]",
  ghost:
    "text-fg-soft hover:text-brand-700 hover:bg-brand-50 active:bg-brand-100 dark:text-fg-faint dark:hover:text-brand-300 dark:hover:bg-white/5 dark:active:bg-white/[0.08]",
  // Navy fill in light, brand fill in dark — the navbar's "Let's talk" CTA,
  // deliberately distinct from `primary` so it doesn't read as a second one.
  ink: "bg-ink text-white hover:bg-brand-700 hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0 dark:bg-brand-700 dark:hover:bg-brand-600",
  // Inverted: for use ON a permanently-dark panel (the Contact band).
  onDark:
    "bg-on-dark text-brand-800 hover:bg-brand-50 hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0 active:shadow-soft",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** Stretches to fill its container — for stacked mobile menus and forms. */
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  /**
   * Renders a plain <a download> for same-origin files (the résumé PDF), so the
   * browser saves the file instead of navigating to it. `external` opens a new
   * tab and would leave the visitor in a PDF viewer they have to back out of —
   * wrong for a button that says "Download". Ignored when `external` is set.
   */
  download?: boolean;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

/**
 * Class recipe, exported for the one case that can't use the component: the
 * case-study "View case study" affordance, which is a <span> inside a wrapping
 * <Link>. It looks like a button but can't BE one — nesting a link inside a
 * link is invalid HTML — so it borrows the classes instead of the element.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
} = {}): string {
  return cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
    children,
  } = props;
  const classes = buttonClasses({ variant, size, fullWidth, className });

  if ("href" in props && props.href) {
    // download wins over Link: next/link would client-navigate to the asset.
    if (props.download && !props.external) {
      return (
        <a href={props.href} download className={classes}>
          {children}
        </a>
      );
    }
    if (props.external) {
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    fullWidth: _fw,
    className: _c,
    children: _ch,
    ...rest
  } = props as ButtonAsButton;
  // Default to type="button": a bare <button> inside a form implicitly submits
  // it, which is a trap for anyone reusing this outside a submit context.
  // Callers that DO want to submit pass type="submit" explicitly.
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
