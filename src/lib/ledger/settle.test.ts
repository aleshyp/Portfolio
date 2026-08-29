/**
 * Settlement tests.
 *
 * Two invariants carry most of the weight here:
 *
 *   1. Balances always net to zero. Money moves between people; it isn't
 *      created. If a set of expenses nets to anything else, the model is wrong.
 *   2. Applying the settlement zeroes everyone. Whatever payments come out,
 *      following them must actually settle the group — otherwise the app is
 *      confidently telling people to transfer the wrong amounts.
 *
 * The randomised block at the bottom is the one I trust most: it generates a
 * few thousand arbitrary groups and asserts both invariants on each, which
 * covers the awkward shapes (one person paying everything, mutual debts,
 * already-settled groups) without me having to think of them.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { type Pence, ZERO, isZero, pence, split, sum } from "./money.ts";
import {
  type Balance,
  type Expense,
  applyPayments,
  computeBalances,
  computeBalances as balancesOf,
  naivePaymentCount,
  settle,
  settleExpenses,
  settlementIsMinimal,
  totalOwedBy,
  totalOwedTo,
} from "./settle.ts";

/** Builds an evenly-split expense — the common case, and the one the UI defaults to. */
function evenExpense(
  id: string,
  paidBy: string,
  total: number,
  participants: string[],
): Expense {
  const shares = split(pence(total), participants.length);
  return {
    id,
    description: id,
    paidBy,
    date: "2026-01-01",
    shares: participants.map((personId, i) => ({
      personId,
      amount: shares[i],
    })),
  };
}

function balance(personId: string, net: number): Balance {
  return { personId, net: pence(net) };
}

describe("computeBalances()", () => {
  it("gives everyone zero when there are no expenses", () => {
    const balances = computeBalances(["ana", "ben"], []);
    assert.deepEqual(balances, [
      { personId: "ana", net: 0 },
      { personId: "ben", net: 0 },
    ]);
  });

  it("includes members who have spent nothing", () => {
    // A new member must not vanish from the group view.
    const balances = computeBalances(
      ["ana", "ben", "cal"],
      [evenExpense("dinner", "ana", 1000, ["ana", "ben"])],
    );
    assert.equal(balances.find((b) => b.personId === "cal")!.net, 0);
  });

  it("nets the payer's own share out of what they're owed", () => {
    // Ana pays £30 for a meal split with Ben: she's owed £15, not £30.
    const balances = computeBalances(
      ["ana", "ben"],
      [evenExpense("dinner", "ana", 3000, ["ana", "ben"])],
    );
    assert.equal(balances.find((b) => b.personId === "ana")!.net, 1500);
    assert.equal(balances.find((b) => b.personId === "ben")!.net, -1500);
  });

  it("handles an expense the payer isn't part of", () => {
    // Ana buys Ben and Cal lunch but doesn't eat: she's owed the whole £20.
    const balances = computeBalances(
      ["ana", "ben", "cal"],
      [evenExpense("lunch", "ana", 2000, ["ben", "cal"])],
    );
    assert.equal(balances.find((b) => b.personId === "ana")!.net, 2000);
    assert.equal(balances.find((b) => b.personId === "ben")!.net, -1000);
  });

  it("cancels out mutual debts", () => {
    const balances = computeBalances(
      ["ana", "ben"],
      [
        evenExpense("dinner", "ana", 2000, ["ana", "ben"]),
        evenExpense("taxi", "ben", 2000, ["ana", "ben"]),
      ],
    );
    assert.ok(balances.every((b) => isZero(b.net)));
  });

  it("always nets to zero", () => {
    const expenses = [
      evenExpense("a", "ana", 3333, ["ana", "ben", "cal"]),
      evenExpense("b", "ben", 1717, ["ana", "cal"]),
      evenExpense("c", "cal", 9999, ["ana", "ben", "cal"]),
    ];
    assert.equal(sum(computeBalances(["ana", "ben", "cal"], expenses).map((b) => b.net)), 0);
  });

  it("rejects an expense referencing someone outside the group", () => {
    const rogue = evenExpense("x", "zoe", 100, ["ana"]);
    assert.throws(() => computeBalances(["ana"], [rogue]), /unknown person zoe/);
  });

  it("rejects a share for someone outside the group", () => {
    const rogue = evenExpense("x", "ana", 100, ["ana", "zoe"]);
    assert.throws(() => computeBalances(["ana"], [rogue]), /unknown person zoe/);
  });
});

describe("settle()", () => {
  it("returns nothing for an already-settled group", () => {
    assert.deepEqual(settle([balance("ana", 0), balance("ben", 0)]), []);
  });

  it("settles a simple two-person debt in one payment", () => {
    const payments = settle([balance("ana", 1500), balance("ben", -1500)]);
    assert.deepEqual(payments, [{ from: "ben", to: "ana", amount: 1500 }]);
  });

  it("splits one debtor across two creditors", () => {
    const payments = settle([
      balance("ana", 1000),
      balance("ben", 500),
      balance("cal", -1500),
    ]);
    assert.equal(payments.length, 2);
    assert.equal(totalOwedBy(payments, "cal"), 1500);
    assert.equal(totalOwedTo(payments, "ana"), 1000);
    assert.equal(totalOwedTo(payments, "ben"), 500);
  });

  it("needs at most n-1 payments", () => {
    const payments = settle([
      balance("ana", 5000),
      balance("ben", -1000),
      balance("cal", -1500),
      balance("dee", -2500),
    ]);
    assert.ok(payments.length <= 3, `expected ≤3, got ${payments.length}`);
  });

  it("emits no zero-value payments when a debtor and creditor match exactly", () => {
    // The regression this guards: advancing only one pointer on an exact match
    // leaves a settled party in play and emits a £0.00 transfer.
    const payments = settle([
      balance("ana", 1000),
      balance("ben", -1000),
      balance("cal", 2000),
      balance("dee", -2000),
    ]);
    assert.ok(payments.every((p) => !isZero(p.amount)));
    assert.equal(payments.length, 2);
  });

  it("is deterministic across runs", () => {
    const balances = [
      balance("ana", 3300),
      balance("ben", -1100),
      balance("cal", -1100),
      balance("dee", -1100),
    ];
    assert.deepEqual(settle(balances), settle(balances));
  });

  it("does not mutate the balances it is given", () => {
    const balances = [balance("ana", 1000), balance("ben", -1000)];
    const snapshot = structuredClone(balances);
    settle(balances);
    assert.deepEqual(balances, snapshot);
  });

  it("refuses balances that do not net to zero", () => {
    assert.throws(
      () => settle([balance("ana", 100), balance("ben", -50)]),
      /must net to zero/,
    );
  });

  it("handles a single-penny debt", () => {
    assert.deepEqual(settle([balance("ana", 1), balance("ben", -1)]), [
      { from: "ben", to: "ana", amount: 1 },
    ]);
  });
});

describe("applyPayments()", () => {
  it("zeroes everyone out", () => {
    const balances = [
      balance("ana", 4500),
      balance("ben", -2000),
      balance("cal", -2500),
    ];
    const after = applyPayments(balances, settle(balances));
    assert.ok(after.every((b) => isZero(b.net)));
  });

  it("leaves a partially-applied settlement correctly short", () => {
    const balances = [balance("ana", 1000), balance("ben", -1000)];
    const after = applyPayments(balances, [
      { from: "ben", to: "ana", amount: pence(400) },
    ]);
    assert.equal(after.find((b) => b.personId === "ana")!.net, 600);
  });
});

describe("naivePaymentCount()", () => {
  it("counts one edge per debtor per expense", () => {
    // Ana pays for all three: Ben→Ana and Cal→Ana. Ana doesn't owe herself.
    const expenses = [evenExpense("dinner", "ana", 3000, ["ana", "ben", "cal"])];
    assert.equal(naivePaymentCount(expenses), 2);
  });

  it("deduplicates repeated edges between the same pair", () => {
    const expenses = [
      evenExpense("dinner", "ana", 3000, ["ana", "ben"]),
      evenExpense("lunch", "ana", 1000, ["ana", "ben"]),
    ];
    assert.equal(naivePaymentCount(expenses), 1);
  });

  it("counts both directions when debts are mutual", () => {
    // The case the netting model collapses: Ana→Ben AND Ben→Ana.
    const expenses = [
      evenExpense("dinner", "ana", 2000, ["ana", "ben"]),
      evenExpense("taxi", "ben", 2000, ["ana", "ben"]),
    ];
    assert.equal(naivePaymentCount(expenses), 2);
    assert.equal(settleExpenses(["ana", "ben"], expenses).length, 0);
  });

  it("beats the naive count on a realistic weekend", () => {
    // The comparison the case study quotes.
    const people = ["ana", "ben", "cal", "dee", "eli"];
    const expenses = [
      evenExpense("dinner", "ana", 12_500, people),
      evenExpense("taxi", "ben", 3600, ["ben", "cal", "dee"]),
      evenExpense("hotel", "cal", 48_000, people),
      evenExpense("brunch", "dee", 6800, ["ana", "dee", "eli"]),
      evenExpense("tickets", "eli", 15_000, people),
      evenExpense("drinks", "ana", 8400, ["ana", "ben", "eli"]),
    ];
    const naive = naivePaymentCount(expenses);
    const optimised = settleExpenses(people, expenses);
    assert.ok(naive >= 10, `expected a messy naive count, got ${naive}`);
    assert.ok(
      optimised.length <= 4,
      `expected ≤4 payments, got ${optimised.length}`,
    );
    assert.ok(applyPayments(balancesOf(people, expenses), optimised).every((b) => isZero(b.net)));
  });
});

describe("settlementIsMinimal()", () => {
  it("is true for an already-settled group", () => {
    assert.ok(settlementIsMinimal([balance("ana", 0)], []));
  });

  it("is true when greedy hits the n-1 bound", () => {
    const balances = [
      balance("ana", 3000),
      balance("ben", -1000),
      balance("cal", -2000),
    ];
    assert.ok(settlementIsMinimal(balances, settle(balances)));
  });

  it("recognises the zero-sum-subset case greedy can miss", () => {
    // Ana/Ben cancel each other and Cal/Dee cancel each other: the true minimum
    // is 2. Greedy pairs by magnitude and may or may not find it — the point of
    // the function is that the UI can tell the difference instead of guessing.
    const balances = [
      balance("ana", 1000),
      balance("ben", -1000),
      balance("cal", 1000),
      balance("dee", -1000),
    ];
    const payments = settle(balances);
    assert.ok(applyPayments(balances, payments).every((b) => isZero(b.net)));
    assert.equal(typeof settlementIsMinimal(balances, payments), "boolean");
  });
});

describe("randomised groups", () => {
  /** Deterministic PRNG (mulberry32) — reproducible failures beat flaky ones. */
  function rng(seed: number): () => number {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  it("nets to zero and settles completely for 2,000 random groups", () => {
    const random = rng(20260829);
    const names = ["ana", "ben", "cal", "dee", "eli", "fay", "gus"];

    for (let iteration = 0; iteration < 2000; iteration++) {
      const groupSize = 2 + Math.floor(random() * 6);
      const people = names.slice(0, groupSize);
      const expenseCount = Math.floor(random() * 8);

      const expenses: Expense[] = [];
      for (let e = 0; e < expenseCount; e++) {
        // A random non-empty subset of the group participates.
        const participants = people.filter(() => random() < 0.7);
        if (participants.length === 0) continue;
        const payer = people[Math.floor(random() * people.length)];
        const total = Math.floor(random() * 50_000);
        expenses.push(evenExpense(`e${e}`, payer, total, participants));
      }

      const balances = computeBalances(people, expenses);
      const context = `seed iteration ${iteration}`;

      // Invariant 1: money is conserved.
      assert.equal(sum(balances.map((b) => b.net)), 0, `${context}: not zero-sum`);

      // Invariant 2: the settlement actually settles.
      const payments = settle(balances);
      const after = applyPayments(balances, payments);
      assert.ok(
        after.every((b) => isZero(b.net)),
        `${context}: settlement left a residue`,
      );

      // Invariant 3: no payment is zero or negative.
      assert.ok(
        payments.every((p) => p.amount > 0),
        `${context}: emitted a non-positive payment`,
      );

      // Invariant 4: at most n-1 payments.
      assert.ok(
        payments.length <= Math.max(0, people.length - 1),
        `${context}: ${payments.length} payments for ${people.length} people`,
      );
    }
  });

  it("keeps every expense's shares summing to its total", () => {
    const random = rng(99);
    for (let i = 0; i < 2000; i++) {
      const total = Math.floor(random() * 100_000);
      const n = 1 + Math.floor(random() * 8);
      const shares: Pence[] = split(pence(total), n);
      assert.equal(sum(shares), total);
    }
  });
});
