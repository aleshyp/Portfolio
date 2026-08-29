/**
 * Split-engine tests. Run with `npm run test:unit`.
 *
 * Node's built-in test runner, deliberately — this is pure logic with no DOM,
 * and the repo already has Playwright for anything that needs a browser. Adding
 * vitest/jest to run three files of arithmetic would be a dependency and a
 * config file for no capability the platform doesn't already ship.
 *
 * The style is property-first: most of these assert an INVARIANT over many
 * generated inputs rather than checking one hand-picked case. Money bugs hide
 * in specific values (the ones where IEEE-754 rounds the wrong way), and I'm
 * not clever enough to guess which ones — so the exhaustive loops do it.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ZERO,
  abs,
  add,
  format,
  formatPlain,
  fromPounds,
  isZero,
  negate,
  pence,
  split,
  splitByWeight,
  subtract,
  sum,
} from "./money.ts";

describe("pence()", () => {
  it("accepts whole numbers", () => {
    assert.equal(pence(0), 0);
    assert.equal(pence(1234), 1234);
    assert.equal(pence(-500), -500);
  });

  it("rejects fractional pence rather than rounding them away", () => {
    // Rounding here would mask a float bug upstream instead of surfacing it.
    assert.throws(() => pence(12.5), RangeError);
    assert.throws(() => pence(0.1 + 0.2), RangeError);
  });

  it("rejects values outside the safe integer range", () => {
    assert.throws(() => pence(Number.MAX_SAFE_INTEGER + 2), RangeError);
    assert.throws(() => pence(Infinity), RangeError);
    assert.throws(() => pence(NaN), RangeError);
  });
});

describe("fromPounds()", () => {
  it("converts clean amounts", () => {
    assert.equal(fromPounds(0), 0);
    assert.equal(fromPounds(1), 100);
    assert.equal(fromPounds(123.45), 12345);
  });

  it("survives the float values that break naive truncation", () => {
    // 19.99 * 100 === 1998.9999999999998. Math.trunc would give £19.98 —
    // this is the exact bug the module exists to prevent.
    assert.equal(fromPounds(19.99), 1999);
    assert.equal(fromPounds(0.29), 29);
    assert.equal(fromPounds(8.11), 811);
  });

  it("rounds a half-penny by the double that actually reaches it", () => {
    // Documented, not aspirational. `1.005 * 100` is 100.49999999999999, so
    // this rounds DOWN to £1.00 — the literal `1.005` is already not 1.005 by
    // the time fromPounds sees it, and no rounding mode inside this function
    // can recover the digit the parser lost.
    //
    // It's benign here because the only caller is a currency input capped at
    // two decimals, where a true half-penny can't be entered. Worth a test
    // anyway: it pins the behaviour so a future "fix" has to justify itself,
    // and it's the honest version of the claim that pence arithmetic is exact.
    // Exact *after* the boundary — the boundary itself is still a double.
    assert.equal(fromPounds(1.005), 100);
    assert.equal(fromPounds(1.015), 101);
    // Where the scaled double lands exactly ON the midpoint, it rounds up —
    // 2.675 * 100 is precisely 267.5, unlike the two above.
    assert.equal(fromPounds(2.675), 268);
  });

  it("round-trips every penny value from £0.00 to £100.00", () => {
    for (let p = 0; p <= 10_000; p++) {
      const pounds = p / 100;
      assert.equal(
        fromPounds(pounds),
        p,
        `£${pounds.toFixed(2)} should be ${p}p`,
      );
    }
  });

  it("handles negative amounts (refunds)", () => {
    assert.equal(fromPounds(-19.99), -1999);
  });

  it("rejects non-finite input", () => {
    assert.throws(() => fromPounds(NaN), RangeError);
    assert.throws(() => fromPounds(Infinity), RangeError);
  });
});

describe("arithmetic", () => {
  it("adds, subtracts, negates and sums", () => {
    assert.equal(add(pence(100), pence(250)), 350);
    assert.equal(subtract(pence(100), pence(250)), -150);
    assert.equal(negate(pence(100)), -100);
    assert.equal(sum([pence(1), pence(2), pence(3)]), 6);
  });

  it("sums an empty list to zero", () => {
    assert.equal(sum([]), 0);
  });

  it("reports absolute value and zero-ness", () => {
    assert.equal(abs(pence(-450)), 450);
    assert.equal(abs(pence(450)), 450);
    assert.ok(isZero(ZERO));
    assert.ok(!isZero(pence(1)));
  });

  it("never accumulates float error across many operations", () => {
    // The canonical float failure: 0.1 + 0.2 repeated. In pence it's exact.
    let total = ZERO;
    for (let i = 0; i < 1000; i++) total = add(total, pence(10));
    assert.equal(total, 10_000);
  });
});

describe("split() — the even split", () => {
  it("splits evenly when it divides cleanly", () => {
    assert.deepEqual(split(pence(900), 3), [300, 300, 300]);
  });

  it("allocates the remainder penny rather than losing it", () => {
    // The case study's headline example: £100 across 3.
    assert.deepEqual(split(pence(10_000), 3), [3334, 3333, 3333]);
  });

  it("allocates two remainder pence to the first two shares", () => {
    assert.deepEqual(split(pence(10_001), 3), [3334, 3334, 3333]);
  });

  it("handles a single part", () => {
    assert.deepEqual(split(pence(999), 1), [999]);
  });

  it("handles zero", () => {
    assert.deepEqual(split(ZERO, 4), [0, 0, 0, 0]);
  });

  it("splits negative totals (refunds) without breaking the invariant", () => {
    const shares = split(pence(-10_000), 3);
    assert.deepEqual(shares, [-3334, -3333, -3333]);
    assert.equal(sum(shares), -10_000);
  });

  it("rejects a non-positive or fractional part count", () => {
    assert.throws(() => split(pence(100), 0), RangeError);
    assert.throws(() => split(pence(100), -1), RangeError);
    assert.throws(() => split(pence(100), 2.5), RangeError);
  });

  it("returns exactly `parts` shares", () => {
    for (let n = 1; n <= 12; n++) {
      assert.equal(split(pence(1234), n).length, n);
    }
  });

  it("never spreads shares more than a penny apart", () => {
    // The fairness property: nobody should absorb more than one extra penny.
    for (let total = 0; total <= 2000; total += 7) {
      for (let n = 1; n <= 9; n++) {
        const shares = split(pence(total), n);
        assert.ok(
          Math.max(...shares) - Math.min(...shares) <= 1,
          `split(${total}, ${n}) spread too wide: ${shares.join(",")}`,
        );
      }
    }
  });

  it("sums back to the total for 10,000 combinations", () => {
    // The invariant that matters. If this ever fails, money is being created
    // or destroyed — which is the "£0.00 rounding error" claim in the study.
    let checked = 0;
    for (let total = 0; total < 1000; total++) {
      for (let n = 1; n <= 10; n++) {
        assert.equal(
          sum(split(pence(total), n)),
          total,
          `split(${total}, ${n}) did not sum back`,
        );
        checked++;
      }
    }
    assert.equal(checked, 10_000);
  });

  it("sums back for negative totals too", () => {
    for (let total = -500; total < 0; total++) {
      for (let n = 1; n <= 8; n++) {
        assert.equal(sum(split(pence(total), n)), total);
      }
    }
  });
});

describe("splitByWeight() — the uneven split", () => {
  it("splits in proportion", () => {
    assert.deepEqual(splitByWeight(pence(1000), [1, 1, 2]), [250, 250, 500]);
  });

  it("gives leftover pence to the most-truncated shares", () => {
    // 1000 / 3 across equal weights: exact shares are 333.33 each, so the
    // largest-remainder pass hands the spare penny to the first.
    const shares = splitByWeight(pence(1000), [1, 1, 1]);
    assert.equal(sum(shares), 1000);
    assert.deepEqual(shares, [334, 333, 333]);
  });

  it("handles a zero weight (someone who didn't participate)", () => {
    const shares = splitByWeight(pence(1000), [1, 0, 1]);
    assert.deepEqual(shares, [500, 0, 500]);
  });

  it("falls back to an even split when all weights are zero", () => {
    // A fresh custom-split form before anyone types: must not divide by zero.
    assert.deepEqual(splitByWeight(pence(900), [0, 0, 0]), [300, 300, 300]);
  });

  it("handles fractional weights", () => {
    const shares = splitByWeight(pence(10_000), [0.5, 1.5, 2]);
    assert.equal(sum(shares), 10_000);
  });

  it("rejects negative or non-finite weights", () => {
    assert.throws(() => splitByWeight(pence(100), [1, -1]), RangeError);
    assert.throws(() => splitByWeight(pence(100), [1, NaN]), RangeError);
    assert.throws(() => splitByWeight(pence(100), []), RangeError);
  });

  it("sums back to the total across many weightings", () => {
    const weightings = [
      [1, 2, 3],
      [5, 1, 1, 1],
      [1, 1],
      [7, 3],
      [1, 1, 1, 1, 1, 1, 1],
      [2.5, 1.25, 0.25],
      [100, 1],
    ];
    for (let total = 0; total < 400; total++) {
      for (const weights of weightings) {
        assert.equal(
          sum(splitByWeight(pence(total), weights)),
          total,
          `splitByWeight(${total}, [${weights}]) did not sum back`,
        );
      }
    }
  });

  it("is deterministic for equal weights", () => {
    const a = splitByWeight(pence(1000), [1, 1, 1]);
    const b = splitByWeight(pence(1000), [1, 1, 1]);
    assert.deepEqual(a, b);
  });
});

describe("formatting", () => {
  it("formats pence as pounds", () => {
    assert.equal(format(pence(12_345)), "£123.45");
    assert.equal(format(ZERO), "£0.00");
    assert.equal(format(pence(5)), "£0.05");
  });

  it("groups thousands", () => {
    assert.equal(format(pence(123_456_789)), "£1,234,567.89");
  });

  it("formats negatives", () => {
    assert.equal(format(pence(-1999)), "-£19.99");
  });

  it("formats plainly for inputs and table cells", () => {
    assert.equal(formatPlain(pence(12_345)), "123.45");
    assert.equal(formatPlain(pence(5)), "0.05");
  });

  it("round-trips through fromPounds", () => {
    for (let p = 0; p <= 5000; p += 13) {
      assert.equal(fromPounds(Number(formatPlain(pence(p)))), p);
    }
  });
});
