import { type Pence, format } from "@/lib/ledger/money.ts";
import { type Person } from "@/lib/ledger/store.ts";
import { cn } from "@/lib/utils";

/**
 * Small presentational pieces shared across the Ledger demo.
 *
 * All of these are server-safe (no "use client") so the demo's static shell can
 * render them and only the interactive parts ship as client components.
 */

/**
 * Avatar chip for a group member.
 *
 * Colour is derived from the person's index rather than hashed from their name:
 * a hash gives no control over which two people end up adjacent in the palette,
 * and with five members it's worth just picking. `brand` is reserved for the
 * primary CTA, so these use neutral surfaces with a brand ring for the "you"
 * case — an avatar row is decoration, not a call to action.
 */
export function Avatar({
  person,
  size = "md",
  highlight = false,
  className,
}: {
  person: Person;
  size?: "sm" | "md";
  highlight?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-medium",
        "bg-surface-raised text-fg-soft",
        highlight && "ring-2 ring-brand-500",
        size === "sm" ? "h-6 w-6 text-xs" : "h-8 w-8 text-xs",
        className,
      )}
      // The name is always rendered as text beside the avatar in every current
      // usage, so exposing it here too would double-announce it.
      aria-hidden="true"
    >
      {person.initials}
    </span>
  );
}

/** Overlapping avatar row for "who's in this expense". */
export function AvatarStack({
  people,
  max = 5,
}: {
  people: Person[];
  max?: number;
}) {
  const shown = people.slice(0, max);
  const overflow = people.length - shown.length;

  return (
    <span className="inline-flex items-center">
      {shown.map((person, i) => (
        <Avatar
          key={person.id}
          person={person}
          size="sm"
          className={cn(
            "ring-1 ring-surface",
            // Negative margin overlaps them; the first sits flush.
            i > 0 && "-ml-1.5",
          )}
        />
      ))}
      {overflow > 0 && (
        <span className="ml-1.5 text-xs text-fg-faint">+{overflow}</span>
      )}
      {/* The stack is decorative — this carries the real content for AT. */}
      <span className="sr-only">
        {people.map((p) => p.name).join(", ")}
      </span>
    </span>
  );
}

/**
 * A signed balance, coloured by direction.
 *
 * Colour alone can't carry the meaning (WCAG 1.4.1), so the sign and the
 * accompanying label do the work and colour is reinforcement. "owes" vs "is
 * owed" is spelled out in the visually-hidden text because "-£155.00" read
 * aloud is ambiguous about who owes whom.
 */
export function BalanceAmount({
  amount,
  name,
  className,
}: {
  amount: Pence;
  name?: string;
  className?: string;
}) {
  const settled = amount === 0;
  const owed = amount > 0;

  return (
    <span
      className={cn(
        "font-display font-semibold tabular-nums",
        settled && "text-fg-faint",
        // brand-700/300 is the same pairing the rest of the site uses for
        // positive emphasis; the negative case stays neutral rather than red,
        // because owing money in a friend group isn't an error state.
        owed && "text-brand-700 dark:text-brand-400",
        !settled && !owed && "text-fg-soft",
        className,
      )}
    >
      {settled ? (
        <>
          {name && <span className="sr-only">{name} is </span>}
          Settled up
        </>
      ) : (
        <>
          <span className="sr-only">
            {name ? `${name} ` : ""}
            {owed ? "is owed " : "owes "}
          </span>
          {/* The minus sign is redundant with the label for screen readers but
              essential visually, so it's hidden from AT rather than dropped. */}
          <span aria-hidden="true">{format(amount)}</span>
          <span className="sr-only">{format(amount > 0 ? amount : (-amount as Pence))}</span>
        </>
      )}
    </span>
  );
}

/** Section heading inside the demo chrome. */
export function PanelHeading({
  children,
  count,
}: {
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <h2 className="flex items-baseline gap-2 font-display text-sm font-semibold uppercase tracking-wider text-fg-faint">
      {children}
      {count !== undefined && (
        <span className="text-xs font-normal normal-case tracking-normal text-fg-faint">
          {count}
        </span>
      )}
    </h2>
  );
}

/**
 * The demo's empty state.
 *
 * Deliberately a real designed state rather than a bare "No expenses yet":
 * the case study makes the claim that every state got designed, and an empty
 * group is the first thing a new user sees, so it explains what to do next
 * instead of just reporting absence.
 */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border-subtle px-6 py-12 text-center">
      <p className="font-display text-base font-semibold text-fg">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">
        {body}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
