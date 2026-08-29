import { format, pence, split } from "@/lib/ledger/money.ts";
import {
  deriveView,
  personById,
  seedGroup,
  type Person,
} from "@/lib/ledger/store.ts";
import { cn } from "@/lib/utils";

/**
 * Ledger — case-study scenes for the expense-splitter study.
 *
 * Built the same way as PortfolioSystemAsset and for the same reason: these are
 * RESPONSIVE DOM, not fixed artboards. The study's claim is that the engine is
 * real and checkable, so a diagram that could quietly drift from the engine
 * would undercut the whole thing.
 *
 * So nothing here is hand-typed. Every figure — the split shares, the balances,
 * the naive-vs-settled counts, the payment list — is DERIVED at render time from
 * the same `src/lib/ledger` functions the demo runs. Change the seed data and
 * these diagrams change with it; break the engine and they break loudly rather
 * than showing a stale number. That is the point.
 *
 * Server component: no hooks, no client boundary. The engine is pure, so it runs
 * happily at build time and these scenes are fully static HTML.
 */

type Scene = "split-math" | "settlement" | "states";

/** Small avatar chip. Local to the scenes so they don't depend on demo UI. */
function Chip({ person, tone = "muted" }: { person: Person; tone?: "muted" | "brand" }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
        tone === "brand"
          ? "bg-brand-700 text-white"
          : "bg-surface-raised text-fg-soft",
      )}
      aria-hidden="true"
    >
      {person.initials}
    </span>
  );
}

/** The frame every scene sits in — a card on the page, sized by its content. */
function Board({
  title,
  caption,
  children,
  className,
  alt,
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
  className?: string;
  alt: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden border border-border-subtle bg-surface p-6 shadow-soft sm:p-8",
        className,
      )}
      // The scene is a figure, not decoration: on the case study its alt is the
      // content. Empty alt (the card thumbnail) drops it from the a11y tree.
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      {/* Hidden from AT when the board carries its own aria-label, or the
          heading would be announced twice — once in the label, once as text. */}
      <div aria-hidden={alt ? true : undefined}>
        <p className="font-display text-base font-semibold text-fg sm:text-lg">
          {title}
        </p>
        <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-fg-muted sm:text-sm">
          {caption}
        </p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

/**
 * Scene 1 — why £100 ÷ 3 is a design problem.
 *
 * Shows the naive answer against the real one. The shares come from the actual
 * `split()`, so the "£33.34 / £33.33 / £33.33" here is the function's output,
 * not a number I typed to match it.
 */
function SplitMath({ alt }: { alt: string }) {
  const total = pence(10_000);
  const shares = split(total, 3);
  const naiveEach = 3333; // Math.floor(10000/3) — what dropping the remainder gives
  const naiveTotal = naiveEach * 3;
  const lost = total - naiveTotal;

  const group = seedGroup();
  const people = group.members.slice(0, 3);

  return (
    <Board
      title="£100 split three ways"
      caption="Divide it naively and a penny disappears. The remainder has to be allocated to someone, and the app has to be able to say who."
      alt={alt}
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {/* Naive */}
        <div className="rounded-2xl border border-border-subtle bg-surface-raised p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-fg-faint">
            Divide and round
          </p>
          <ul className="mt-3 space-y-2">
            {people.map((person) => (
              <li key={person.id} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Chip person={person} />
                  <span className="text-sm text-fg-soft">{person.name}</span>
                </span>
                <span className="font-display text-sm font-semibold tabular-nums text-fg-soft">
                  {format(pence(naiveEach))}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-3">
            <span className="text-xs text-fg-muted">Total collected</span>
            <span className="font-display text-sm font-semibold tabular-nums text-fg">
              {format(pence(naiveTotal))}
            </span>
          </div>
          {/* Not `text-accent`: amber (#f59e0b) on surface-raised measures
              2.04:1, well under the 4.5:1 AA threshold for 12px text — axe
              caught it. The amber tokens are fills, not small-text colors.
              The word "short" carries the meaning anyway, so colour was doing
              redundant work here (WCAG 1.4.1). */}
          <p className="mt-2 text-xs font-medium text-fg-soft">
            {format(pence(lost))} short of {format(total)}
          </p>
        </div>

        {/* Correct */}
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-500/30 dark:bg-brand-500/10">
          <p className="text-xs font-medium uppercase tracking-wider text-brand-700 dark:text-brand-300">
            Allocate the remainder
          </p>
          <ul className="mt-3 space-y-2">
            {people.map((person, i) => (
              <li key={person.id} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Chip person={person} tone={i === 0 ? "brand" : "muted"} />
                  <span className="text-sm text-fg-soft">{person.name}</span>
                </span>
                <span className="font-display text-sm font-semibold tabular-nums text-fg">
                  {format(shares[i])}
                  {i === 0 && (
                    <span className="ml-1.5 text-xs font-normal text-brand-700 dark:text-brand-300">
                      +1p
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-brand-200 pt-3 dark:border-brand-500/30">
            <span className="text-xs text-fg-muted">Total collected</span>
            <span className="font-display text-sm font-semibold tabular-nums text-fg">
              {format(total)}
            </span>
          </div>
          <p className="mt-2 text-xs font-medium text-brand-700 dark:text-brand-300">
            Exact, every time
          </p>
        </div>
      </div>

      <p className="mt-5 border-t border-border-subtle pt-4 text-xs leading-relaxed text-fg-faint">
        Asserted across 10,000 generated combinations: shares always sum back to
        the total exactly. Amounts are stored as integer pence, so the arithmetic
        never touches a float.
      </p>
    </Board>
  );
}

/**
 * Scene 2 — the headline claim: 16 debts collapse to 4 payments.
 *
 * The counts and the payment list both come from the engine against the seeded
 * weekend, so this scene cannot disagree with the demo.
 */
function Settlement({ alt }: { alt: string }) {
  const group = seedGroup();
  const view = deriveView(group);

  return (
    <Board
      title={`${view.naiveCount} debts become ${view.payments.length} payments`}
      caption="Settling each expense on its own means everyone owes everyone. Netting each person to a single balance first means most of those debts cancel before anybody transfers anything."
      alt={alt}
    >
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        {/* Before: the tangle */}
        <div className="flex flex-col rounded-2xl border border-border-subtle bg-surface-raised p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-fg-faint">
              Per expense
            </p>
            <p className="font-display text-2xl font-bold tabular-nums text-fg-soft">
              {view.naiveCount}
            </p>
          </div>
          {/* Each dash is one debt edge — the visual point is "too many". A
              fixed 4-column grid rather than flex-wrap: wrapping left an
              orphaned row of three, which reads as a layout bug rather than
              as a count. */}
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {Array.from({ length: view.naiveCount }, (_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full bg-fg-faint/40"
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-fg-muted">
            transfers, several cancelling each other out
          </p>
        </div>

        {/* The operation */}
        <div className="flex items-center justify-center lg:flex-col lg:px-2">
          <span className="rounded-full border border-border-subtle bg-surface px-3 py-1.5 text-xs font-medium text-fg-muted">
            net each person
          </span>
        </div>

        {/* After: the settlement */}
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-500/30 dark:bg-brand-500/10">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-brand-700 dark:text-brand-300">
              Settled
            </p>
            <p className="font-display text-2xl font-bold tabular-nums text-fg">
              {view.payments.length}
            </p>
          </div>
          <ul className="mt-3 space-y-1.5">
            {view.payments.map((payment) => {
              const from = personById(group, payment.from);
              const to = personById(group, payment.to);
              return (
                <li
                  key={`${payment.from}-${payment.to}`}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Chip person={from} />
                    <span className="text-fg-faint" aria-hidden="true">
                      →
                    </span>
                    <Chip person={to} />
                    <span className="truncate text-fg-soft">
                      {from.name} pays {to.name}
                    </span>
                  </span>
                  <span className="shrink-0 font-display font-semibold tabular-nums text-fg">
                    {format(payment.amount)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="mt-5 border-t border-border-subtle pt-4 text-xs leading-relaxed text-fg-faint">
        Greedy: the largest debtor pays the largest creditor until everyone is
        square, which is at most one payment per person minus one.
        {view.isMinimal
          ? " Here that hits the provable floor."
          : " The true minimum is NP-hard, so where greedy can't prove it hit the floor, the app says so rather than claiming it."}
      </p>
    </Board>
  );
}

/**
 * Scene 3 — the twelve interaction states.
 *
 * The claim this scene backs is "every state is a designed state", so it names
 * all twelve rather than showing four and implying the rest. Grouped by the
 * surface they belong to, because that's how they were actually worked through.
 */
function States({ alt }: { alt: string }) {
  const groups: { label: string; states: { name: string; note: string }[] }[] = [
    {
      label: "The list",
      states: [
        { name: "Empty", note: "no expenses yet — explains what to do" },
        { name: "Populated", note: "the ordinary case" },
        { name: "Settled", note: "everyone square, nothing to pay" },
      ],
    },
    {
      label: "Adding",
      states: [
        { name: "Form open", note: "live split preview as you type" },
        { name: "Invalid", note: "per-field errors, tied to their inputs" },
        { name: "Uneven split", note: "weights instead of an even divide" },
      ],
    },
    {
      label: "In flight",
      states: [
        { name: "Pending", note: "row shown optimistically, balances moved" },
        { name: "Committed", note: "confirmed, pending marker cleared" },
        { name: "Failed", note: "balances rolled back, row kept" },
      ],
    },
    {
      label: "Recovering",
      states: [
        { name: "Retrying", note: "same row, second attempt" },
        { name: "Discarded", note: "user drops it, nothing persisted" },
        { name: "Settling up", note: "a transfer recorded as an expense" },
      ],
    },
  ];

  const total = groups.reduce((n, g) => n + g.states.length, 0);

  return (
    <Board
      title={`${total} states, not one happy path`}
      caption="The path where everything works is a quarter of the design. These are the rest — each one a screen someone will actually see."
      alt={alt}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-medium uppercase tracking-wider text-fg-faint">
              {group.label}
            </p>
            <ul className="mt-2.5 space-y-2">
              {group.states.map((state) => (
                <li
                  key={state.name}
                  className="rounded-xl border border-border-subtle bg-surface-raised px-3 py-2.5"
                >
                  <p className="text-sm font-medium text-fg">{state.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-fg-muted">
                    {state.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-5 border-t border-border-subtle pt-4 text-xs leading-relaxed text-fg-faint">
        The failed and retrying states are reachable in the demo — tick
        &ldquo;fail the next save&rdquo; before adding an expense.
      </p>
    </Board>
  );
}

/**
 * Intrinsic sizes of the captures produced by scripts/capture-ledger.mjs, in CSS
 * pixels (the files themselves are 2x these).
 *
 * These drive width/height so the browser reserves the right box and the page
 * doesn't shift as they load. A stale entry here doesn't fail the build — it
 * silently distorts the frame and reintroduces layout shift — so re-run the
 * capture script and update these together.
 */
const SHOT_SIZES = {
  overview: { w: 1088, h: 778 },
  "add-expense": { w: 1088, h: 998 },
  "failed-save": { w: 1088, h: 778 },
  mobile: { w: 342, h: 1473 },
} as const;

type Shot = keyof typeof SHOT_SIZES;

/**
 * A screenshot scene, themed.
 *
 * Two captures per shot, picked by `prefers-color-scheme`. A single light
 * screenshot on a dark case study is a white rectangle glowing out of the page,
 * and vice versa — and since the demo's whole argument is that it's built from
 * the same theme-aware tokens as the site, showing it in one theme only would
 * undercut the point.
 *
 * <picture> with a media source rather than two <img>s toggled by CSS: the
 * browser fetches ONE of them. Toggling with `hidden` downloads both.
 *
 * Note this follows the OS preference, not the site's theme toggle — those can
 * disagree for a visitor who has overridden it. Matching the toggle would mean a
 * client component and a hydration round-trip for a decorative image, which is
 * the wrong trade for the case where they differ.
 */
function Screenshot({
  shot,
  alt,
  className,
}: {
  shot: Shot;
  alt: string;
  className?: string;
}) {
  const { w, h } = SHOT_SIZES[shot];
  const base = `/work/ledger/${shot}`;
  // The phone capture is 342px wide. Letting it fill the 1088px content column
  // scales it 3x — a soft, enormous 4679px-tall image that also becomes the
  // page's LCP element. Cap it at its own width and center it instead, so it
  // renders at 1:1 and reads as what it is: the app on a phone.
  const isPhone = shot === "mobile";

  return (
    <picture>
      <source
        srcSet={`${base}-dark.webp`}
        media="(prefers-color-scheme: dark)"
        type="image/webp"
      />
      <img
        src={`${base}-light.webp`}
        alt={alt}
        width={w}
        height={h}
        loading="lazy"
        decoding="async"
        className={cn(
          "block rounded-4xl border border-border-subtle shadow-soft",
          isPhone ? "mx-auto h-auto w-full max-w-sm" : "w-full",
          className,
        )}
      />
    </picture>
  );
}

type LedgerAssetProps = {
  scene: Scene | Shot;
  className?: string;
  /** Accessible description. Empty string renders the scene decorative. */
  alt: string;
};

export function LedgerAsset({ scene, className, alt }: LedgerAssetProps) {
  // Screenshots carry their own frame (border + radius on the <img>); the
  // diagram boards paint their own card, so they take the radius on the wrapper.
  if (scene in SHOT_SIZES) {
    return <Screenshot shot={scene as Shot} alt={alt} className={className} />;
  }

  const wrapper = cn("w-full [&>div]:rounded-4xl", className);

  switch (scene as Scene) {
    case "split-math":
      return (
        <div className={wrapper}>
          <SplitMath alt={alt} />
        </div>
      );
    case "settlement":
      return (
        <div className={wrapper}>
          <Settlement alt={alt} />
        </div>
      );
    case "states":
      return (
        <div className={wrapper}>
          <States alt={alt} />
        </div>
      );
  }
}

/**
 * Scene list for the case study.
 *
 * Order is load-bearing: the case-study template assigns scene 0 to the cover
 * and then one scene per content block, so these are sequenced to land under the
 * block each one illustrates.
 *
 *   0  overview      → cover: the real app, seeded
 *   1  split-math    → "£100 ÷ 3 is a design problem"
 *   2  settlement    → "Model the debt, not the transactions"
 *   3  states        → "Every state is a designed state"
 *   4  failed-save   → "Who can see what" (the client/server trust boundary —
 *                      the closest visual is the rollback, since it's the one
 *                      place the UI visibly defers to a server's answer)
 *   5  add-expense   → "What I'd do differently"
 *   6  mobile        → past the blocks, so it lands in "More screens"
 *
 * Diagrams are DOM (derived live from the engine); the rest are real captures
 * from scripts/capture-ledger.mjs. Re-run that script if the demo's UI changes.
 */
export const ledgerScenes: { scene: Scene | Shot; alt: string }[] = [
  {
    scene: "overview",
    alt: "The Ledger demo showing a seeded weekend away for five people. A balances panel lists each person's net position, from Cal owed £317.00 down to Ben owing £155.00. A settle-up panel shows the four payments that clear the group, down from sixteen. The expense list shows six items from a £480 hotel to £36 taxi, each with who paid and how many ways it split.",
  },
  {
    scene: "split-math",
    alt: "Splitting £100 three ways, two ways. Dividing and rounding gives each person £33.33 and collects £99.99, a penny short. Allocating the remainder gives £33.34, £33.33 and £33.33, collecting the full £100. Shares sum back exactly across 10,000 generated combinations, and amounts are stored as integer pence so the arithmetic never touches a float.",
  },
  {
    scene: "settlement",
    alt: "Sixteen debts reduced to four payments. Settling each expense on its own needs sixteen transfers between five people, many cancelling out. Netting each person to a single balance first leaves four: Ben pays Cal £155.00, Dee pays Cal £117.67, Eli pays Cal £44.33, and Eli pays Ana £7.33. The greedy algorithm pairs the largest debtor with the largest creditor, needing at most one payment per person minus one.",
  },
  {
    scene: "states",
    alt: "The twelve interaction states designed for the app, grouped by surface. The list: empty, populated, settled. Adding: form open with a live split preview, invalid with per-field errors, uneven split by weights. In flight: pending shown optimistically, committed, failed with balances rolled back. Recovering: retrying, discarded, and settling up as a recorded transfer.",
  },
  {
    scene: "failed-save",
    alt: "The rollback state in the running app. A newly added £48.00 expense sits at the top of the list with the message “Couldn't save — check your connection” and Retry and Discard buttons. The balances panel behind it still reads six expenses totalling £943.00 — the optimistic update has been reversed, but the row the user typed is kept rather than discarded for them.",
  },
  {
    scene: "add-expense",
    alt: "The add-expense form open in the running app, with £100 being split between three of the five members. A live preview below the participant toggles shows Ana £33.34, Ben £33.33 and Cal £33.33, with the note that it doesn't divide evenly and the spare penny goes to the first person listed.",
  },
  {
    scene: "mobile",
    alt: "The demo at phone width. The two-column layout stacks to one: demo controls, then balances, then the settle-up list, then the expenses. Every control stays at full size and nothing is cut off or requires sideways scrolling.",
  },
];
