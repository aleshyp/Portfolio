/**
 * Money for the Ledger demo — integer pence, never floats.
 *
 * The whole module exists because `0.1 + 0.2 !== 0.3`. A group expense app that
 * stores pounds as a float accumulates error on every split and eventually shows
 * someone a balance that's off by a penny with no way to explain it. So: pence
 * are the unit of storage and arithmetic throughout, and pounds exist only as a
 * formatting concern at the very edge of the UI.
 *
 * The type is a branded number rather than a bare `number`. That's deliberate —
 * it makes `addExpense(amount)` reject a raw `12.5` at compile time, which is
 * exactly the bug this module is here to prevent. The brand costs one cast at
 * each boundary (`pence()`, `fromPounds()`) and catches everything after it.
 */

declare const penceBrand: unique symbol;

/** An integer number of pence. Construct via `pence()` or `fromPounds()`. */
export type Pence = number & { readonly [penceBrand]: true };

/** Zero, as a Pence. Common enough to be worth naming. */
export const ZERO = 0 as Pence;

/**
 * Asserts an integer and brands it. Throws on a non-integer rather than
 * rounding: a fractional pence reaching here means a caller did float math
 * somewhere upstream, and silently rounding would hide the actual bug.
 */
export function pence(n: number): Pence {
  if (!Number.isInteger(n)) {
    throw new RangeError(`Pence must be a whole number, got ${n}`);
  }
  if (!Number.isSafeInteger(n)) {
    throw new RangeError(`Pence out of safe integer range: ${n}`);
  }
  return n as Pence;
}

/**
 * Converts pounds (as typed by a human) to pence.
 *
 * `Math.round` after scaling, not `Math.trunc`: `19.99 * 100` is
 * 1998.9999999999998 in IEEE-754, and truncating gives £19.98. Rounding is what
 * makes the boundary safe, and it's the only place in the app where a rounding
 * decision is made on user input.
 */
export function fromPounds(pounds: number): Pence {
  if (!Number.isFinite(pounds)) {
    throw new RangeError(`Not a finite amount: ${pounds}`);
  }
  return pence(Math.round(pounds * 100));
}

export function add(a: Pence, b: Pence): Pence {
  return pence(a + b);
}

export function subtract(a: Pence, b: Pence): Pence {
  return pence(a - b);
}

export function negate(a: Pence): Pence {
  return pence(-a);
}

export function sum(amounts: readonly Pence[]): Pence {
  return pence(amounts.reduce<number>((total, n) => total + n, 0));
}

/** Absolute value — used when turning a signed balance into a payment amount. */
export function abs(a: Pence): Pence {
  return pence(Math.abs(a));
}

export function isZero(a: Pence): boolean {
  return a === 0;
}

/**
 * Splits `total` into `parts` shares that sum EXACTLY back to `total`.
 *
 * This is the function the case study is built around. £100 across 3 people is
 * not £33.33 each — that's £99.99, and the missing penny has to go somewhere.
 * Here the remainder is distributed one pence at a time to the first `r` shares,
 * so the result is [3334, 3333, 3333]. The invariant `sum(split(t, n)) === t`
 * holds for every input, which is the property the tests hammer.
 *
 * Shares are returned largest-first. Who *absorbs* the extra penny is a product
 * decision, not a math one — the demo rotates it by expense so the same person
 * isn't always paying it, but that rotation lives in the caller, not here. This
 * function stays deterministic.
 *
 * Negative totals split correctly too (a refund is an expense in reverse):
 * -100 across 3 gives [-34, -33, -33], still summing exactly.
 */
export function split(total: Pence, parts: number): Pence[] {
  if (!Number.isInteger(parts) || parts < 1) {
    throw new RangeError(`Need at least one part, got ${parts}`);
  }

  // Math.trunc, not Math.floor: for a negative total, floor rounds away from
  // zero (-34 for -100/3) and the remainder then has the wrong sign, which
  // breaks the exact-sum invariant. trunc keeps base and remainder consistent.
  const base = Math.trunc(total / parts);
  const remainder = total - base * parts;
  const step = remainder >= 0 ? 1 : -1;
  const extras = Math.abs(remainder);

  return Array.from({ length: parts }, (_, i) =>
    pence(i < extras ? base + step : base),
  );
}

/**
 * Splits `total` in proportion to `weights` — the uneven-split case (someone
 * had the lobster, someone had the soup).
 *
 * Largest-remainder method: floor every share, then hand the leftover pence to
 * whichever shares were cut hardest. Naively rounding each share independently
 * would miss or overshoot the total by a few pence, which is the same class of
 * bug as the even split but harder to spot because it only shows on some inputs.
 */
export function splitByWeight(total: Pence, weights: readonly number[]): Pence[] {
  if (weights.length === 0) {
    throw new RangeError("Need at least one weight");
  }
  if (weights.some((w) => !Number.isFinite(w) || w < 0)) {
    throw new RangeError("Weights must be finite and non-negative");
  }

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  // All-zero weights is a legitimate state in the UI (a fresh custom split
  // before anyone's typed anything), so fall back to an even split rather than
  // dividing by zero and rendering NaN.
  if (totalWeight === 0) return split(total, weights.length);

  const exact = weights.map((w) => (total * w) / totalWeight);
  const floored = exact.map((x) => Math.trunc(x));
  const allocated = floored.reduce((a, b) => a + b, 0);
  let remainder = total - allocated;
  const step = remainder >= 0 ? 1 : -1;

  // Rank by the fractional part that got discarded, largest first, so the
  // leftover pence land where the truncation hurt most. Index breaks ties, which
  // keeps the function deterministic for equal weights.
  const order = exact
    .map((x, i) => ({ i, frac: Math.abs(x - floored[i]) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);

  const shares = [...floored];
  for (const { i } of order) {
    if (remainder === 0) break;
    shares[i] += step;
    remainder -= step;
  }

  return shares.map((s) => pence(s));
}

/**
 * Formats pence for display: `12345` → `"£123.45"`.
 *
 * Uses Intl so the grouping separators are right, and pins en-GB explicitly
 * rather than taking the visitor's locale — the demo's seeded data is in
 * pounds, so rendering it as "$123.45" for a US visitor would be a lie.
 */
const formatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function format(amount: Pence): string {
  return formatter.format(amount / 100);
}

/** Formats without the currency symbol — for table cells and inputs. */
export function formatPlain(amount: Pence): string {
  return (amount / 100).toFixed(2);
}
