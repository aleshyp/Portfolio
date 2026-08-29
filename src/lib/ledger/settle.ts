/**
 * Debt simplification — turning a pile of expenses into the fewest payments
 * that clear it.
 *
 * The naive model records who owes whom per expense: dinner gives Ana→Ben,
 * Ana→Cal; taxi gives Ben→Ana, Ben→Cal; and so on. Five people over a weekend
 * produces a dozen little arrows, several of which point both ways between the
 * same two people. Handing someone that list and asking them to settle up is
 * how a group chat dies.
 *
 * The insight is that only NET position matters. Once you know Ana is +£45 and
 * Ben is −£20, it's irrelevant which specific meals caused it — any set of
 * transfers that zeroes everyone out settles the group. So the algorithm throws
 * the per-expense edges away, computes one balance per person, and rebuilds a
 * minimal set of payments from those.
 *
 * Finding the true minimum is NP-hard (it's a partition problem — you'd have to
 * find every subset of people that sums to zero and settle each independently).
 * This uses the standard greedy max-debtor/max-creditor pairing, which is not
 * always optimal but is within one transaction of it in practice, runs in
 * O(n log n), and — importantly for a UI — is deterministic and explainable.
 * "The person who owes most pays the person who's owed most" is a sentence you
 * can put in a tooltip. See `settlementIsMinimal` for the honest caveat.
 */

import { type Pence, ZERO, abs, add, isZero, pence, subtract, sum } from "./money.ts";

export type PersonId = string;

export type Balance = {
  personId: PersonId;
  /** Positive = owed money by the group. Negative = owes the group. */
  net: Pence;
};

export type Payment = {
  from: PersonId;
  to: PersonId;
  amount: Pence;
};

/**
 * An expense as the ledger stores it: one payer, and the exact per-person
 * shares it breaks into. Shares are pre-split (see money.split) so this module
 * never does division — by the time an expense is stored, the awkward penny has
 * already been assigned to somebody.
 */
export type Expense = {
  id: string;
  description: string;
  /** Who actually paid the bill. */
  paidBy: PersonId;
  /** Exact shares, summing to the expense total. */
  shares: { personId: PersonId; amount: Pence }[];
  /** ISO date — display and ordering only; balances don't depend on it. */
  date: string;
};

/**
 * Nets every expense down to one signed balance per person.
 *
 * Each expense credits the payer the full amount and debits every participant
 * their share. Someone who pays for a meal they're also part of nets out to
 * (total − their own share), which is the intuitively right answer and falls
 * out of the model rather than needing a special case.
 *
 * `people` is passed explicitly rather than derived from the expenses so that a
 * member who hasn't spent anything yet still appears with a zero balance —
 * otherwise they'd silently vanish from the group view.
 */
export function computeBalances(
  people: readonly PersonId[],
  expenses: readonly Expense[],
): Balance[] {
  const net = new Map<PersonId, number>(people.map((id) => [id, 0]));

  for (const expense of expenses) {
    const total = sum(expense.shares.map((s) => s.amount));
    // An expense paid by someone outside the member list would otherwise create
    // a phantom balance that never nets to zero, so it's a hard error.
    if (!net.has(expense.paidBy)) {
      throw new Error(
        `Expense ${expense.id} paid by unknown person ${expense.paidBy}`,
      );
    }
    net.set(expense.paidBy, net.get(expense.paidBy)! + total);

    for (const share of expense.shares) {
      if (!net.has(share.personId)) {
        throw new Error(
          `Expense ${expense.id} has a share for unknown person ${share.personId}`,
        );
      }
      net.set(share.personId, net.get(share.personId)! - share.amount);
    }
  }

  return people.map((personId) => ({
    personId,
    net: pence(net.get(personId)!),
  }));
}

/**
 * Reduces balances to a set of payments that settles everyone.
 *
 * Greedy: repeatedly match the largest debtor against the largest creditor and
 * transfer the smaller of the two magnitudes, which zeroes out at least one of
 * them per step. That guarantees at most n−1 payments for n people, versus the
 * O(n²) edges the naive per-expense model can produce.
 *
 * Ties are broken by personId so the output is stable across runs — a UI that
 * reshuffles "who pays whom" between renders on identical data looks broken,
 * even when every version is arithmetically correct.
 */
export function settle(balances: readonly Balance[]): Payment[] {
  // Guard the precondition rather than trusting it: balances that don't sum to
  // zero mean a bug upstream, and the loop below would otherwise terminate with
  // debt silently unaccounted for.
  const total = sum(balances.map((b) => b.net));
  if (!isZero(total)) {
    throw new Error(
      `Balances must net to zero before settling, off by ${total}p`,
    );
  }

  const debtors = balances
    .filter((b) => b.net < 0)
    .map((b) => ({ id: b.personId, amount: abs(b.net) }))
    .sort((a, b) => b.amount - a.amount || a.id.localeCompare(b.id));

  const creditors = balances
    .filter((b) => b.net > 0)
    .map((b) => ({ id: b.personId, amount: b.net }))
    .sort((a, b) => b.amount - a.amount || a.id.localeCompare(b.id));

  const payments: Payment[] = [];
  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];
    const amount = pence(Math.min(debtor.amount, creditor.amount));

    payments.push({ from: debtor.id, to: creditor.id, amount });

    debtor.amount = subtract(debtor.amount, amount);
    creditor.amount = subtract(creditor.amount, amount);

    // Advance past anyone fully settled. Both can clear in the same step when
    // the amounts match exactly, which is why these are two ifs and not an
    // if/else — treating it as either/or leaves a zero-balance entry in place
    // and emits a spurious £0.00 payment on the next pass.
    if (isZero(debtor.amount)) d++;
    if (isZero(creditor.amount)) c++;
  }

  return payments;
}

/** Convenience: expenses straight to payments, the path the UI actually uses. */
export function settleExpenses(
  people: readonly PersonId[],
  expenses: readonly Expense[],
): Payment[] {
  return settle(computeBalances(people, expenses));
}

/**
 * How many payments the naive per-expense model would need, for comparison.
 *
 * Counts distinct ordered debtor→creditor pairs across all expenses — what you
 * get if every expense settles itself independently and nobody nets anything.
 * The case study quotes this against `settle().length` to make the improvement
 * concrete, so it counts the same thing the "before" diagram shows.
 */
export function naivePaymentCount(expenses: readonly Expense[]): number {
  const edges = new Set<string>();
  for (const expense of expenses) {
    for (const share of expense.shares) {
      if (share.personId === expense.paidBy) continue; // nobody pays themselves
      if (isZero(share.amount)) continue;
      edges.add(`${share.personId}->${expense.paidBy}`);
    }
  }
  return edges.size;
}

/**
 * True when `payments` is provably the minimum for these balances.
 *
 * n non-zero balances always need at least n−1 payments, and the greedy result
 * hits that bound unless the group happens to contain a subset that sums to
 * zero on its own (e.g. Ana +£10 / Ben −£10 sitting inside a larger group),
 * where an optimal solver would find the split and greedy might not.
 *
 * Exported because the UI states it honestly — "4 payments (minimal)" versus
 * "4 payments" — rather than claiming optimality it can't verify. Claiming the
 * minimum and being wrong is worse than not claiming it.
 */
export function settlementIsMinimal(
  balances: readonly Balance[],
  payments: readonly Payment[],
): boolean {
  const nonZero = balances.filter((b) => !isZero(b.net)).length;
  if (nonZero === 0) return payments.length === 0;
  return payments.length <= nonZero - 1;
}

/**
 * Applies payments to balances and returns what's left.
 *
 * Used by the tests to assert everyone lands on zero, and by the demo's
 * "settle up" flow to show the group clearing in real time.
 */
export function applyPayments(
  balances: readonly Balance[],
  payments: readonly Payment[],
): Balance[] {
  const net = new Map(balances.map((b) => [b.personId, b.net as number]));
  for (const p of payments) {
    net.set(p.from, net.get(p.from)! + p.amount);
    net.set(p.to, net.get(p.to)! - p.amount);
  }
  return balances.map((b) => ({
    personId: b.personId,
    net: pence(net.get(b.personId)!),
  }));
}

/** Sum of everything one person is owed, for the per-person summary row. */
export function totalOwedTo(payments: readonly Payment[], id: PersonId): Pence {
  return payments
    .filter((p) => p.to === id)
    .reduce<Pence>((acc, p) => add(acc, p.amount), ZERO);
}

/** Sum of everything one person owes. */
export function totalOwedBy(payments: readonly Payment[], id: PersonId): Pence {
  return payments
    .filter((p) => p.from === id)
    .reduce<Pence>((acc, p) => add(acc, p.amount), ZERO);
}
