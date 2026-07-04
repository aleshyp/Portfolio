import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white shadow-soft hover:bg-brand-800 hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0 active:bg-brand-900 active:shadow-soft dark:hover:bg-brand-800 dark:active:bg-brand-900",
  outline:
    "border border-brand-200 bg-white text-brand-700 hover:border-brand-300 hover:bg-brand-50 hover:-translate-y-0.5 active:translate-y-0 active:bg-brand-100 dark:border-brand-500/30 dark:bg-white/5 dark:text-brand-300 dark:hover:border-brand-500/50 dark:hover:bg-white/10 dark:active:bg-white/[0.08]",
  ghost:
    "text-ink-soft hover:text-brand-700 hover:bg-brand-50 active:bg-brand-100 dark:text-ink-faint dark:hover:text-brand-300 dark:hover:bg-white/5 dark:active:bg-white/[0.08]",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
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

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
