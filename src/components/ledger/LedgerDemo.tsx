"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Plus, RotateCcw, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { cn } from "@/lib/utils";
import { type Pence, format } from "@/lib/ledger/money.ts";
import {
  type DraftExpense,
  type Expense,
  type Group,
  type Payment,
  type ValidationError,
  buildExpense,
  addExpense,
  deriveView,
  emptyGroup,
  fakeNetwork,
  isSettlement,
  nextId,
  personById,
  recordSettlement,
  removeExpense,
  resetIds,
  seedGroup,
  validateDraft,
} from "@/lib/ledger/store.ts";
import {
  Avatar,
  AvatarStack,
  BalanceAmount,
  EmptyState,
  PanelHeading,
} from "./Primitives";
import { ExpenseForm } from "./ExpenseForm";

/**
 * The Ledger demo — the interactive proof behind the case study.
 *
 * The state model is the point of this component. An expense add is applied
 * OPTIMISTICALLY (the row appears immediately, marked pending) and rolled back
 * if the simulated request fails. That's the behaviour the case study describes,
 * and it's why `store.ts` exposes an async seam instead of a plain setter — a
 * synchronous demo would have quietly designed the interesting states away.
 *
 * Balances are never stored. Every render derives them from the expense list via
 * `deriveView`, so an optimistic row is reflected in the balances for free and a
 * rollback un-reflects it without a second code path. Storing them would mean
 * reconciling two sources of truth on every mutation, which is exactly where
 * this class of app usually goes wrong.
 */

/** A submission in flight — tracked so the UI can mark its row and roll it back. */
type Pending = {
  expense: Expense;
  /** Set when the request failed and the row is awaiting dismissal/retry. */
  error?: string;
};

export function LedgerDemo() {
  const [group, setGroup] = useState<Group>(() => seedGroup());
  const [pending, setPending] = useState<Pending[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [justSettled, setJustSettled] = useState<string | null>(null);

  /**
   * Announcements for screen readers. The demo's most important changes —
   * an expense landing, a rollback, a settlement — happen without focus moving,
   * so a live region is the only thing that surfaces them to a non-sighted user.
   */
  const [announcement, setAnnouncement] = useState("");

  // Rollback needs the timer id so an unmount mid-flight doesn't setState on a
  // dead component. Cleared in the settle/fail handlers.
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  /**
   * The group as the UI shows it: committed expenses plus anything in flight.
   *
   * Pending rows are included so balances update instantly — that IS the
   * optimistic update. Rows that have FAILED are excluded from the derivation
   * but still rendered in the list, so the numbers snap back to truth while the
   * failed row stays visible for the user to retry or dismiss.
   */
  const optimisticGroup = useMemo<Group>(() => {
    const live = pending.filter((p) => !p.error).map((p) => p.expense);
    return live.length === 0
      ? group
      : { ...group, expenses: [...group.expenses, ...live] };
  }, [group, pending]);

  const view = useMemo(() => deriveView(optimisticGroup), [optimisticGroup]);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
  }, []);

  /**
   * Submits a draft: validate, apply optimistically, then confirm or roll back.
   */
  const submit = useCallback(
    async (draft: DraftExpense) => {
      const validation = validateDraft(draft);
      setErrors(validation);
      if (validation.length > 0) {
        // Announced because the errors render below the fields; a keyboard user
        // who submitted from the button won't otherwise know why nothing moved.
        announce(
          `Couldn't add expense. ${validation.length} problem${validation.length > 1 ? "s" : ""} to fix.`,
        );
        return;
      }

      const id = nextId();
      const expense = buildExpense(draft, id, new Date().toISOString().slice(0, 10));

      setPending((current) => [...current, { expense }]);
      setFormOpen(false);
      announce(`Adding ${expense.description}, ${format(totalOf(expense))}.`);

      try {
        await fakeNetwork(failNext);
        // Committed: move it out of pending and into the real list in one pass,
        // so there's no frame where the row exists in both or in neither.
        setGroup((current) => addExpense(current, expense));
        setPending((current) => current.filter((p) => p.expense.id !== id));
        announce(`${expense.description} added.`);
      } catch {
        // Rolled back: the row stays in `pending` but flagged, which drops it
        // out of the balance derivation while keeping it on screen.
        setPending((current) =>
          current.map((p) =>
            p.expense.id === id
              ? { ...p, error: "Couldn't save — check your connection." }
              : p,
          ),
        );
        announce(
          `Couldn't save ${expense.description}. The balances have been restored.`,
        );
      } finally {
        // One-shot: a failure toggle that stays on would make the demo look
        // broken rather than instructive.
        setFailNext(false);
      }
    },
    [announce, failNext],
  );

  const retry = useCallback(
    async (id: string) => {
      const entry = pending.find((p) => p.expense.id === id);
      if (!entry) return;

      setPending((current) =>
        current.map((p) => (p.expense.id === id ? { expense: p.expense } : p)),
      );
      announce(`Retrying ${entry.expense.description}.`);

      try {
        await fakeNetwork(false);
        setGroup((current) => addExpense(current, entry.expense));
        setPending((current) => current.filter((p) => p.expense.id !== id));
        announce(`${entry.expense.description} added.`);
      } catch {
        setPending((current) =>
          current.map((p) =>
            p.expense.id === id
              ? { ...p, error: "Still couldn't save." }
              : p,
          ),
        );
      }
    },
    [announce, pending],
  );

  const dismiss = useCallback(
    (id: string) => {
      setPending((current) => current.filter((p) => p.expense.id !== id));
      announce("Discarded.");
    },
    [announce],
  );

  const remove = useCallback(
    (expense: Expense) => {
      setGroup((current) => removeExpense(current, expense.id));
      announce(`${expense.description} removed.`);
    },
    [announce],
  );

  const settleUp = useCallback(
    (payment: Payment) => {
      const from = personById(group, payment.from).name;
      const to = personById(group, payment.to).name;
      const key = `${payment.from}-${payment.to}`;

      setGroup((current) =>
        recordSettlement(current, payment, nextId(), new Date().toISOString().slice(0, 10)),
      );
      setJustSettled(key);
      announce(`Recorded ${from} paying ${to} ${format(payment.amount)}.`);

      const timer = setTimeout(() => {
        setJustSettled(null);
        timers.current.delete(timer);
      }, 2000);
      timers.current.add(timer);
    },
    [announce, group],
  );

  const reset = useCallback(() => {
    for (const timer of timers.current) clearTimeout(timer);
    timers.current.clear();
    resetIds();
    setGroup(seedGroup());
    setPending([]);
    setErrors([]);
    setFormOpen(false);
    setFailNext(false);
    setJustSettled(null);
    announce("Demo reset to the starting data.");
  }, [announce]);

  const clearAll = useCallback(() => {
    setGroup(emptyGroup());
    setPending([]);
    setFormOpen(false);
    announce("Group emptied.");
  }, [announce]);

  const isEmpty = view.group.expenses.length === 0 && pending.length === 0;

  return (
    // data-capture is the handle scripts/capture-ledger.mjs shoots against, so
    // the case-study screenshots frame the APP rather than the page's marketing
    // chrome. Keep it if the wrapper is refactored.
    <div className="space-y-6" data-capture="demo">
      {/* Live region. Always present in the DOM — a region added at the moment
          it gets content is inconsistently announced across screen readers. */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {/* Demo controls. Outside the app frame because they're about the DEMO,
          not the product — conflating the two is how a demo starts looking like
          a half-finished app. */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-surface-raised px-4 py-3">
        <p className="text-xs text-fg-muted">
          Seeded with a weekend away for five. Nothing here is saved.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-fg-muted">
            <input
              type="checkbox"
              checked={failNext}
              onChange={(e) => setFailNext(e.target.checked)}
              className="h-4 w-4 rounded border-border-subtle accent-brand-700"
            />
            Fail the next save
          </label>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-full px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg"
          >
            Empty group
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg"
          >
            <RotateCcw size={13} aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: balances + settlement */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <PanelHeading>Balances</PanelHeading>
            <ul className="mt-4 space-y-3">
              {view.balances.map((balance) => {
                const person = personById(view.group, balance.personId);
                return (
                  <li
                    key={balance.personId}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="flex items-center gap-2.5">
                      <Avatar person={person} />
                      <span className="text-sm font-medium text-fg">
                        {person.name}
                      </span>
                    </span>
                    <BalanceAmount
                      amount={balance.net}
                      name={person.name}
                      className="text-sm"
                    />
                  </li>
                );
              })}
            </ul>

            <p className="mt-5 border-t border-border-subtle pt-4 text-xs text-fg-faint">
              {view.group.expenses.length} expense
              {view.group.expenses.length === 1 ? "" : "s"} ·{" "}
              {format(view.totalSpend)} total
            </p>
          </Card>

          <SettlementPanel
            payments={view.payments}
            group={view.group}
            naiveCount={view.naiveCount}
            isMinimal={view.isMinimal}
            justSettled={justSettled}
            onSettle={settleUp}
          />
        </div>

        {/* Right: expenses. `h-full` so the card fills the column rather than
            ending above the settlement panel and leaving a hole beside it —
            the two columns are equal height, but the card wasn't stretching. */}
        <div className="lg:col-span-3">
          <Card className="h-full p-5">
            <div className="flex items-center justify-between gap-3">
              <PanelHeading>Expenses</PanelHeading>
              {!formOpen && (
                <Button
                  size="md"
                  onClick={() => {
                    setErrors([]);
                    setFormOpen(true);
                  }}
                  className="px-4 py-2 text-xs"
                >
                  <Plus size={14} aria-hidden="true" />
                  Add expense
                </Button>
              )}
            </div>

            {formOpen && (
              <div className="mt-4">
                <ExpenseForm
                  group={view.group}
                  errors={errors}
                  onSubmit={submit}
                  onCancel={() => {
                    setFormOpen(false);
                    setErrors([]);
                  }}
                />
              </div>
            )}

            <div className="mt-4">
              {isEmpty ? (
                <EmptyState
                  title="No expenses yet"
                  body="Add the first one and Ledger works out who owes what. Everyone starts settled."
                  action={
                    <Button size="md" onClick={() => setFormOpen(true)}>
                      <Plus size={14} aria-hidden="true" />
                      Add the first expense
                    </Button>
                  }
                />
              ) : (
                <ul className="divide-y divide-border-subtle">
                  {pending.map((entry) => (
                    <ExpenseRow
                      key={entry.expense.id}
                      expense={entry.expense}
                      group={view.group}
                      pending={!entry.error}
                      error={entry.error}
                      onRetry={() => retry(entry.expense.id)}
                      onDismiss={() => dismiss(entry.expense.id)}
                    />
                  ))}
                  {[...view.group.expenses].reverse().map((expense) => (
                    <ExpenseRow
                      key={expense.id}
                      expense={expense}
                      group={view.group}
                      onRemove={() => remove(expense)}
                    />
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/** Total of an expense — its shares always sum to it exactly. */
function totalOf(expense: Expense): Pence {
  return expense.shares.reduce<Pence>(
    (acc, s) => (acc + s.amount) as Pence,
    0 as Pence,
  );
}

/**
 * The settlement panel — the case study's headline claim, made visible.
 *
 * Shows the naive count against the optimised one, because the number on its
 * own ("4 payments") means nothing without the thing it replaced.
 */
function SettlementPanel({
  payments,
  group,
  naiveCount,
  isMinimal,
  justSettled,
  onSettle,
}: {
  payments: Payment[];
  group: Group;
  naiveCount: number;
  isMinimal: boolean;
  justSettled: string | null;
  onSettle: (payment: Payment) => void;
}) {
  if (payments.length === 0) {
    return (
      <Card variant="soft" className="p-5">
        <PanelHeading>Settle up</PanelHeading>
        <div className="mt-4 flex items-center gap-2.5 text-sm text-fg-muted">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
            <Check size={15} aria-hidden="true" />
          </span>
          Everyone&apos;s square.
        </div>
      </Card>
    );
  }

  return (
    <Card variant="soft" className="p-5">
      <PanelHeading>Settle up</PanelHeading>

      <p className="mt-3 text-xs leading-relaxed text-fg-muted">
        <span className="font-medium text-fg">
          {payments.length} payment{payments.length === 1 ? "" : "s"}
        </span>{" "}
        {isMinimal ? "clears" : "clear"} the group, down from {naiveCount} if
        every expense settled on its own.
        {!isMinimal && (
          // Stated rather than hidden: greedy can't always prove it hit the
          // floor, and claiming "minimal" when it isn't would be a lie the
          // reader can't check. See settlementIsMinimal.
          <span className="text-fg-faint"> Close to minimal, not provably it.</span>
        )}
      </p>

      <ul className="mt-4 space-y-2">
        {payments.map((payment) => {
          const key = `${payment.from}-${payment.to}`;
          const from = personById(group, payment.from);
          const to = personById(group, payment.to);
          const settled = justSettled === key;

          return (
            <li
              key={key}
              className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2.5"
            >
              <span className="flex min-w-0 items-center gap-2 text-sm">
                <Avatar person={from} size="sm" />
                <span className="truncate font-medium text-fg">{from.name}</span>
                <ArrowRight
                  size={13}
                  className="shrink-0 text-fg-faint"
                  aria-hidden="true"
                />
                <Avatar person={to} size="sm" />
                <span className="truncate font-medium text-fg">{to.name}</span>
              </span>

              <span className="flex shrink-0 items-center gap-2">
                <span className="font-display text-sm font-semibold tabular-nums text-fg">
                  {format(payment.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => onSettle(payment)}
                  disabled={settled}
                  // Bordered rather than bare text: at this size an unbordered
                  // label beside an amount reads as metadata, and the one
                  // action in the panel shouldn't need a hover to be findable.
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    settled
                      ? "border-transparent text-brand-700 dark:text-brand-400"
                      : "border-border-subtle text-fg-soft hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:hover:border-brand-500/50 dark:hover:bg-white/5 dark:hover:text-brand-300",
                  )}
                >
                  {settled ? (
                    <span className="inline-flex items-center gap-1">
                      <Check size={12} aria-hidden="true" />
                      Done
                    </span>
                  ) : (
                    <>
                      Mark paid
                      <span className="sr-only">
                        : {from.name} pays {to.name} {format(payment.amount)}
                      </span>
                    </>
                  )}
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/**
 * One expense row, in any of its four states: settled (normal), pending,
 * failed, or a recorded settlement transfer.
 */
function ExpenseRow({
  expense,
  group,
  pending = false,
  error,
  onRetry,
  onDismiss,
  onRemove,
}: {
  expense: Expense;
  group: Group;
  pending?: boolean;
  error?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  onRemove?: () => void;
}) {
  const payer = personById(group, expense.paidBy);
  const participants = expense.shares.map((s) => personById(group, s.personId));
  const total = totalOf(expense);
  const transfer = isSettlement(expense);

  return (
    <li
      className={cn(
        "group flex items-start justify-between gap-3 py-3 transition-opacity",
        // Pending rows are dimmed rather than replaced by a skeleton: the
        // content is already known, and swapping it for a placeholder would
        // discard information the user just typed.
        pending && "opacity-60",
        error && "opacity-100",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "truncate text-sm font-medium",
              transfer ? "text-fg-muted" : "text-fg",
            )}
          >
            {expense.description}
          </p>
          {pending && (
            <span className="shrink-0 text-xs text-fg-faint">Saving…</span>
          )}
          {transfer && (
            <span className="shrink-0 rounded-full bg-surface-raised px-2 py-0.5 text-xs text-fg-faint">
              Transfer
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-muted">
          <span>
            {payer.name} paid
            {transfer ? "" : ` · split ${expense.shares.length} ways`}
          </span>
          {!transfer && <AvatarStack people={participants} />}
        </div>

        {error && (
          <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-surface-raised px-2.5 py-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-fg-soft">
              <TriangleAlert
                size={13}
                className="shrink-0 text-accent"
                aria-hidden="true"
              />
              {error}
            </span>
            <span className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={onRetry}
                className="rounded-full px-2 py-1 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-white/5"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-full px-2 py-1 text-xs font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg"
              >
                Discard
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <span className="font-display text-sm font-semibold tabular-nums text-fg">
          {format(total)}
        </span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            // Visible on hover for mice, but always reachable by keyboard —
            // opacity-0 alone would make it focusable-but-invisible, so
            // focus-visible restores it.
            className="rounded-full p-1 text-fg-faint opacity-0 transition-opacity hover:bg-surface-raised hover:text-fg focus-visible:opacity-100 group-hover:opacity-100"
          >
            <X size={14} aria-hidden="true" />
            <span className="sr-only">Remove {expense.description}</span>
          </button>
        )}
      </div>
    </li>
  );
}
