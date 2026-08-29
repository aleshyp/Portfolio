/**
 * Demo state for Ledger — the seam where a real backend would go.
 *
 * Everything here is in-memory and seeded fresh on load. That's a deliberate
 * scope decision, not an unfinished one: this runs inside a statically-rendered
 * portfolio, so a live Postgres would mean a server runtime, a login wall in
 * front of a case study, and a database in the deploy path of a site whose
 * whole point is that it builds to files.
 *
 * What the demo does keep is the SHAPE of a networked app. `submitExpense` is
 * async, can fail, and is applied optimistically with a rollback — because
 * those are the states the UI has to handle, and a synchronous `setState` would
 * quietly design them away. Swapping `fakeNetwork` for a real fetch is the
 * contained change this file exists to make possible.
 */

import { type Pence, ZERO, add, fromPounds, pence, split, splitByWeight, sum } from "./money.ts";
import {
  type Balance,
  type Expense,
  type Payment,
  computeBalances,
  naivePaymentCount,
  settle,
  settlementIsMinimal,
} from "./settle.ts";

export type Person = {
  id: string;
  name: string;
  /** Initials for the avatar chip — precomputed so the UI never parses names. */
  initials: string;
};

export type Group = {
  id: string;
  name: string;
  members: Person[];
  expenses: Expense[];
};

/**
 * How an expense divides. `even` is the default and covers most real use;
 * `weighted` backs the custom-split UI (shares by portion, not by person).
 */
export type SplitMode =
  | { kind: "even"; among: string[] }
  | { kind: "weighted"; weights: { personId: string; weight: number }[] };

export type DraftExpense = {
  description: string;
  /** Pounds as typed by the user — converted at the boundary, never stored. */
  amountPounds: number;
  paidBy: string;
  split: SplitMode;
};

/** Everything the group view renders, derived in one pass. */
export type GroupView = {
  group: Group;
  balances: Balance[];
  payments: Payment[];
  isMinimal: boolean;
  naiveCount: number;
  totalSpend: Pence;
};

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

/**
 * A weekend away for five, chosen so the seeded state demonstrates the things
 * the case study claims:
 *
 *   - Mutual debt that nets out (Ana pays dinner, Ben pays the taxi).
 *   - Expenses that exclude someone (the taxi is three people, not five).
 *   - A total that doesn't divide cleanly (£125 / 5 is fine, but £68 / 3 isn't),
 *     so the remainder-penny rule is visible in real data rather than only in
 *     the tests.
 *   - Enough tangled edges that the naive count is ~12 and the settlement is 4,
 *     which is the before/after the study quotes.
 */
export const PEOPLE: Person[] = [
  { id: "ana", name: "Ana", initials: "A" },
  { id: "ben", name: "Ben", initials: "B" },
  { id: "cal", name: "Cal", initials: "C" },
  { id: "dee", name: "Dee", initials: "D" },
  { id: "eli", name: "Eli", initials: "E" },
];

const ALL = PEOPLE.map((p) => p.id);

/** Builds a seed expense, splitting evenly across `among`. */
function seed(
  id: string,
  description: string,
  paidBy: string,
  pounds: number,
  among: string[],
  date: string,
): Expense {
  const shares = split(fromPounds(pounds), among.length);
  return {
    id,
    description,
    paidBy,
    date,
    shares: among.map((personId, i) => ({ personId, amount: shares[i] })),
  };
}

export const SEED_EXPENSES: Expense[] = [
  seed("e1", "Hotel — two nights", "cal", 480, ALL, "2026-03-13"),
  seed("e2", "Dinner at the harbour", "ana", 125, ALL, "2026-03-13"),
  seed("e3", "Taxi from the station", "ben", 36, ["ben", "cal", "dee"], "2026-03-13"),
  seed("e4", "Brunch", "dee", 68, ["ana", "dee", "eli"], "2026-03-14"),
  seed("e5", "Boat tickets", "eli", 150, ALL, "2026-03-14"),
  seed("e6", "Drinks", "ana", 84, ["ana", "ben", "eli"], "2026-03-14"),
];

export function seedGroup(): Group {
  return {
    id: "weekend",
    name: "Weekend in Falmouth",
    members: PEOPLE,
    // Cloned so a caller mutating the returned group can't corrupt the seed
    // for the next reset — the demo's reset button depends on this.
    expenses: SEED_EXPENSES.map((e) => ({ ...e, shares: [...e.shares] })),
  };
}

/** The empty state, for the demo's "start a new group" path. */
export function emptyGroup(): Group {
  return { id: "empty", name: "New group", members: PEOPLE, expenses: [] };
}

// ---------------------------------------------------------------------------
// Derivation
// ---------------------------------------------------------------------------

/**
 * Derives everything the UI shows from the expense list.
 *
 * Deliberately a pure function of `group` rather than state kept alongside it.
 * Balances that are *stored* drift from the expenses that produced them the
 * moment anything is edited or deleted — the classic version of this bug is an
 * app that decrements a cached total on delete and slowly diverges from truth.
 * Recomputing is O(expenses) on a list that is realistically dozens long.
 */
export function deriveView(group: Group): GroupView {
  const people = group.members.map((m) => m.id);
  const balances = computeBalances(people, group.expenses);
  const payments = settle(balances);
  return {
    group,
    balances,
    payments,
    isMinimal: settlementIsMinimal(balances, payments),
    naiveCount: naivePaymentCount(group.expenses),
    totalSpend: group.expenses.reduce<Pence>(
      (acc, e) => add(acc, sum(e.shares.map((s) => s.amount))),
      ZERO,
    ),
  };
}

/** Looks up a member by id, falling back to a placeholder rather than crashing. */
export function personById(group: Group, id: string): Person {
  return (
    group.members.find((m) => m.id === id) ?? {
      id,
      name: "Unknown",
      initials: "?",
    }
  );
}

// ---------------------------------------------------------------------------
// Mutation
// ---------------------------------------------------------------------------

/**
 * Turns a draft into a stored expense, doing the split at the boundary.
 *
 * This is the only place pounds become pence and the only place division
 * happens. By the time an Expense exists, its shares are exact integers that
 * sum to the total — every consumer downstream can rely on that.
 */
export function buildExpense(draft: DraftExpense, id: string, date: string): Expense {
  const total = fromPounds(draft.amountPounds);

  if (draft.split.kind === "even") {
    const among = draft.split.among;
    if (among.length === 0) {
      throw new Error("An expense needs at least one participant");
    }
    const shares = split(total, among.length);
    return {
      id,
      description: draft.description.trim(),
      paidBy: draft.paidBy,
      date,
      shares: among.map((personId, i) => ({ personId, amount: shares[i] })),
    };
  }

  const weights = draft.split.weights;
  if (weights.length === 0) {
    throw new Error("An expense needs at least one participant");
  }
  const shares = splitByWeight(
    total,
    weights.map((w) => w.weight),
  );
  return {
    id,
    description: draft.description.trim(),
    paidBy: draft.paidBy,
    date,
    // A zero-weight participant contributes nothing and is dropped, so the
    // expense detail doesn't list people with a £0.00 share.
    shares: weights
      .map((w, i) => ({ personId: w.personId, amount: shares[i] }))
      .filter((s) => s.amount !== 0),
  };
}

export function addExpense(group: Group, expense: Expense): Group {
  return { ...group, expenses: [...group.expenses, expense] };
}

export function removeExpense(group: Group, expenseId: string): Group {
  return {
    ...group,
    expenses: group.expenses.filter((e) => e.id !== expenseId),
  };
}

/**
 * Records a settlement payment as an expense paid by the debtor, shared wholly
 * by the creditor.
 *
 * Modelling a transfer as an expense rather than a separate entity keeps one
 * code path for balances: `computeBalances` needs no notion of "payments", and
 * a settled group is just a group whose expenses happen to net to zero. The
 * `settlement` prefix on the id is what the UI keys off to render it
 * differently in the activity list.
 */
export function recordSettlement(
  group: Group,
  payment: Payment,
  id: string,
  date: string,
): Group {
  return addExpense(group, {
    id: `settlement-${id}`,
    description: "Settled up",
    paidBy: payment.from,
    date,
    shares: [{ personId: payment.to, amount: payment.amount }],
  });
}

export function isSettlement(expense: Expense): boolean {
  return expense.id.startsWith("settlement-");
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export type ValidationError = { field: string; message: string };

/**
 * Validates a draft before it's submitted.
 *
 * Client-side only, and that's stated plainly because it matters: in a real
 * deployment this is UX, not security — the server would have to re-validate
 * everything here, since anything running in the browser is under the user's
 * control. The demo has no server to be attacked, but the rule holds and the
 * comment is here so a future backend port doesn't treat this as sufficient.
 */
export function validateDraft(draft: DraftExpense): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!draft.description.trim()) {
    errors.push({ field: "description", message: "Give it a name" });
  } else if (draft.description.trim().length > 60) {
    errors.push({ field: "description", message: "Keep it under 60 characters" });
  }

  if (!Number.isFinite(draft.amountPounds) || draft.amountPounds <= 0) {
    errors.push({ field: "amount", message: "Enter an amount above £0" });
  } else if (draft.amountPounds > 1_000_000) {
    errors.push({ field: "amount", message: "That's more than this demo handles" });
  } else if (Math.round(draft.amountPounds * 100) !== draft.amountPounds * 100) {
    // Guards sub-penny input like "10.999" reaching fromPounds, where it would
    // be silently rounded — better to say so than to change someone's number.
    errors.push({ field: "amount", message: "Amounts go to the penny" });
  }

  const participants =
    draft.split.kind === "even"
      ? draft.split.among
      : draft.split.weights.filter((w) => w.weight > 0).map((w) => w.personId);

  if (participants.length === 0) {
    errors.push({ field: "split", message: "Pick at least one person" });
  }

  return errors;
}

// ---------------------------------------------------------------------------
// The fake network
// ---------------------------------------------------------------------------

export type SubmitResult =
  | { ok: true; expense: Expense }
  | { ok: false; error: string };

/**
 * Simulates a network round-trip so the UI has real async states to render.
 *
 * The latency is real (250–650ms) and the failure is deliberate: the demo has a
 * "simulate a failure" toggle, because the rollback path is the interesting one
 * and a demo that only ever succeeds never shows it. Without this, the error and
 * in-flight states would be untested claims in a case study rather than
 * something a reader can trigger themselves.
 */
export function fakeNetwork(shouldFail: boolean): Promise<void> {
  const latency = 250 + Math.random() * 400;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Couldn't reach the server"));
      } else {
        resolve();
      }
    }, latency);
  });
}

/** Monotonic id source — sufficient for a single-session demo. */
let idCounter = 0;
export function nextId(): string {
  idCounter += 1;
  return `x${idCounter}`;
}

/** Resets the id counter so a demo reset produces stable ids again. */
export function resetIds(): void {
  idCounter = 0;
}

export { type Balance, type Expense, type Payment } from "./settle.ts";
export { type Pence, format, formatPlain, fromPounds, pence } from "./money.ts";
