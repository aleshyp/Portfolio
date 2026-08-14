import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The rounded chip used for tag lists, tool lists and social links.
 *
 * Distinct from `Badge`: that one is a small brand-tinted label (`text-xs`,
 * non-interactive) used to categorize something. This is the larger `text-sm`
 * neutral chip, often a link, that carries its own hover treatment.
 *
 * Four near-identical copies of this markup existed before it was extracted
 * (About focus areas, Skills tools, Footer socials, Contact socials), each with
 * slightly different padding and hover — which is how the Footer and Contact
 * social lists drifted apart despite rendering the same three links.
 */

type Tone = "default" | "onDark";

/** Resting styles. `onDark` is for the permanently-dark Contact panel. */
const tones: Record<Tone, string> = {
  default: "border-border-subtle bg-surface-raised text-fg-soft",
  onDark: "border-border-on-dark-strong text-on-dark-muted",
};

/** Hover/focus treatment, applied only when the pill is interactive. */
const interactiveTones: Record<Tone, string> = {
  default:
    "transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 hover:shadow-soft dark:hover:border-brand-500/30 dark:hover:text-brand-300",
  onDark:
    "transition-all duration-300 hover:-translate-y-0.5 hover:border-on-dark hover:text-on-dark",
};

type CommonProps = {
  children: React.ReactNode;
  className?: string;
  tone?: Tone;
};

type PillAsSpan = CommonProps & { href?: undefined; external?: never };
type PillAsLink = CommonProps & { href: string; external?: boolean };

export function Pill(props: PillAsSpan | PillAsLink) {
  const { children, className, tone = "default" } = props;
  const interactive = "href" in props && Boolean(props.href);

  const classes = cn(
    "inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium",
    tones[tone],
    interactive && interactiveTones[tone],
    className,
  );

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

  return <span className={classes}>{children}</span>;
}
