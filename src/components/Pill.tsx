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
    // Horizontal padding steps down below `sm`. The Contact panel's three
    // social pills have to share one line: at 360px the row gets 252px of
    // content width, and three px-4 pills need ~290px, so the last one wrapped.
    // px-2.5 there (with the row's tighter gap) brings the three to ~250px,
    // which holds one line at 360px and up. At 320px the row only offers 212px,
    // so it wraps by design — closing that gap would mean shrinking the text
    // below 14px. Only the gutter shrinks — py-2 and text-sm still set the
    // height, so the touch target is unchanged.
    "inline-flex items-center rounded-full border px-2.5 py-2 text-sm font-medium sm:px-4",
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
