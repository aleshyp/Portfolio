"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import { format, fromPounds, split, splitByWeight } from "@/lib/ledger/money.ts";
import type { DraftExpense, Group, ValidationError } from "@/lib/ledger/store.ts";

/**
 * The add-expense form.
 *
 * Two things here are deliberate and worth the comment:
 *
 * 1. The live split preview. The whole premise of the app is that dividing
 *    money is fiddlier than it looks, so the form shows the exact per-person
 *    pence BEFORE submitting — including which person absorbs the remainder
 *    penny. Hiding that until after the fact is what makes expense apps feel
 *    untrustworthy.
 *
 * 2. Errors are rendered from the parent's validation result, not held locally.
 *    Validation lives in `store.ts` next to the model it guards, so the same
 *    rules would apply if a server ever called it. The form only displays them.
 */

type ExpenseFormProps = {
  group: Group;
  errors: ValidationError[];
  onSubmit: (draft: DraftExpense) => void;
  onCancel: () => void;
};

export function ExpenseForm({
  group,
  errors,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const formId = useId();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(group.members[0]?.id ?? "");
  const [among, setAmong] = useState<string[]>(() =>
    group.members.map((m) => m.id),
  );
  const [uneven, setUneven] = useState(false);
  const [weights, setWeights] = useState<Record<string, string>>(() =>
    Object.fromEntries(group.members.map((m) => [m.id, "1"])),
  );

  const errorFor = (field: string) => errors.find((e) => e.field === field);

  /**
   * The live preview. Recomputed from the same functions the real submit path
   * uses — not a reimplementation — so what's previewed is exactly what's
   * stored. A preview with its own rounding logic would eventually disagree
   * with the ledger, which is worse than no preview.
   */
  const preview = useMemo(() => {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    // Sub-penny input is rejected by validateDraft; previewing a rounded figure
    // for it would show a number the user can't actually submit.
    if (Math.round(parsed * 100) !== parsed * 100) return null;

    try {
      const total = fromPounds(parsed);
      if (uneven) {
        const active = group.members
          .map((m) => ({ id: m.id, weight: Number(weights[m.id] ?? 0) }))
          .filter((w) => Number.isFinite(w.weight) && w.weight > 0);
        if (active.length === 0) return null;
        const shares = splitByWeight(
          total,
          active.map((a) => a.weight),
        );
        return active.map((a, i) => ({ id: a.id, amount: shares[i] }));
      }
      if (among.length === 0) return null;
      const shares = split(total, among.length);
      return among.map((id, i) => ({ id, amount: shares[i] }));
    } catch {
      // A malformed intermediate value (mid-typing) simply has no preview.
      return null;
    }
  }, [amount, among, group.members, uneven, weights]);

  /** True when shares differ — i.e. someone is absorbing the remainder penny. */
  const hasRemainder = useMemo(() => {
    if (!preview || preview.length < 2) return false;
    const amounts = preview.map((p) => p.amount);
    return Math.max(...amounts) !== Math.min(...amounts);
  }, [preview]);

  const toggleParticipant = (id: string) => {
    setAmong((current) =>
      current.includes(id)
        ? current.filter((p) => p !== id)
        : // Re-inserted in member order rather than appended, so the preview
          // rows don't reshuffle as people are toggled.
          group.members.map((m) => m.id).filter((m) => current.includes(m) || m === id),
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      description,
      amountPounds: Number(amount),
      paidBy,
      split: uneven
        ? {
            kind: "weighted",
            weights: group.members.map((m) => ({
              personId: m.id,
              weight: Number(weights[m.id] ?? 0),
            })),
          }
        : { kind: "even", among },
    });
  };

  const fieldClasses = (invalid: boolean) =>
    cn(
      "w-full rounded-xl border bg-surface px-3 py-2 text-sm text-fg transition-colors",
      "placeholder:text-fg-faint",
      invalid ? "border-accent" : "border-border-subtle",
    );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border-subtle bg-surface-raised p-4"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label
            htmlFor={`${formId}-description`}
            className="block text-xs font-medium text-fg-soft"
          >
            What was it?
          </label>
          <input
            id={`${formId}-description`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Dinner, taxi, tickets…"
            // aria-invalid + aria-describedby is what actually connects the
            // message to the field for a screen reader; the red border is the
            // sighted equivalent and neither alone is sufficient.
            aria-invalid={!!errorFor("description")}
            aria-describedby={
              errorFor("description") ? `${formId}-description-error` : undefined
            }
            className={cn("mt-1.5", fieldClasses(!!errorFor("description")))}
          />
          {errorFor("description") && (
            <p
              id={`${formId}-description-error`}
              className="mt-1.5 text-xs text-fg-soft"
            >
              {errorFor("description")!.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`${formId}-amount`}
            className="block text-xs font-medium text-fg-soft"
          >
            Amount
          </label>
          <div className="relative mt-1.5">
            <span
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-fg-faint"
              aria-hidden="true"
            >
              £
            </span>
            <input
              id={`${formId}-amount`}
              // inputMode numeric brings up the right keypad on mobile without
              // type="number"'s scroll-wheel and spinner behaviour, which is
              // hostile for currency.
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              aria-invalid={!!errorFor("amount")}
              aria-describedby={
                errorFor("amount") ? `${formId}-amount-error` : undefined
              }
              className={cn(
                "pl-7 tabular-nums sm:w-32",
                fieldClasses(!!errorFor("amount")),
              )}
            />
          </div>
          {errorFor("amount") && (
            <p id={`${formId}-amount-error`} className="mt-1.5 text-xs text-fg-soft">
              {errorFor("amount")!.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3">
        <label
          htmlFor={`${formId}-paidby`}
          className="block text-xs font-medium text-fg-soft"
        >
          Who paid?
        </label>
        <select
          id={`${formId}-paidby`}
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className={cn("mt-1.5 sm:w-48", fieldClasses(false))}
        >
          {group.members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <legend className="text-xs font-medium text-fg-soft">
            Split between
          </legend>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-fg-muted">
            <input
              type="checkbox"
              checked={uneven}
              onChange={(e) => setUneven(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border-subtle accent-brand-700"
            />
            Uneven split
          </label>
        </div>

        {uneven ? (
          <div className="mt-2 space-y-1.5">
            {group.members.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <label
                  htmlFor={`${formId}-w-${member.id}`}
                  className="w-16 shrink-0 text-sm text-fg-soft"
                >
                  {member.name}
                </label>
                <input
                  id={`${formId}-w-${member.id}`}
                  inputMode="numeric"
                  value={weights[member.id] ?? ""}
                  onChange={(e) =>
                    setWeights((current) => ({
                      ...current,
                      [member.id]: e.target.value,
                    }))
                  }
                  className={cn("w-16 tabular-nums", fieldClasses(false))}
                />
                <span className="text-xs text-fg-faint">
                  share{Number(weights[member.id]) === 1 ? "" : "s"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {group.members.map((member) => {
              const active = among.includes(member.id);
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleParticipant(member.id)}
                  // aria-pressed makes the toggle state audible; without it
                  // these read as five identical unlabelled buttons.
                  aria-pressed={active}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-brand-700 text-white"
                      : "bg-surface text-fg-muted hover:text-fg",
                  )}
                >
                  {member.name}
                </button>
              );
            })}
          </div>
        )}

        {errorFor("split") && (
          <p className="mt-2 text-xs text-fg-soft">{errorFor("split")!.message}</p>
        )}
      </fieldset>

      {/* Live split preview */}
      {preview && (
        <div className="mt-4 rounded-xl bg-surface p-3">
          <p className="text-xs font-medium text-fg-faint">Each person pays</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {preview.map((share) => {
              const member = group.members.find((m) => m.id === share.id);
              return (
                <li key={share.id} className="text-xs text-fg-soft">
                  {member?.name}{" "}
                  <span className="font-medium tabular-nums text-fg">
                    {format(share.amount)}
                  </span>
                </li>
              );
            })}
          </ul>
          {hasRemainder && (
            // The detail the whole case study is built on, surfaced in the UI
            // rather than buried: someone has to take the extra penny, and
            // saying so is what makes the arithmetic trustworthy.
            <p className="mt-2 text-xs text-fg-faint">
              Doesn&apos;t divide evenly — the spare penny goes to the first
              person listed.
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button type="submit" size="md" className="px-4 py-2 text-xs">
          Add expense
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-3 py-2 text-xs font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
