import { cn } from "@/lib/utils";

/**
 * Form primitives for the contact form.
 *
 * These render on the permanently-dark Contact panel, so they use the fixed
 * `on-dark` and `danger` tokens rather than the theme-aware foreground set —
 * see the @theme block in globals.css. The control classes were previously
 * duplicated verbatim between the input and the textarea; they now share
 * `controlClasses`.
 *
 * Error handling follows the pattern the form already established: `aria-invalid`
 * plus `aria-describedby` pointing at a message with a derived `${id}-error` id,
 * so assistive tech announces the problem with the field rather than separately.
 */

/** Shared input/textarea styling, including the error state. */
export function controlClasses(error?: string, className?: string): string {
  return cn(
    "w-full rounded-xl border bg-surface-on-dark-raised px-4 py-3 text-sm text-on-dark placeholder:text-on-dark-faint transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950",
    error
      ? "border-danger focus-visible:ring-danger"
      : "border-border-on-dark focus:border-brand-300 focus-visible:ring-brand-300",
    className,
  );
}

export function Label({
  htmlFor,
  children,
  className,
}: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-1.5 block text-sm font-medium text-on-dark-muted",
        className,
      )}
    >
      {children}
    </label>
  );
}

export function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="mt-1.5 text-sm text-danger-soft">
      {children}
    </p>
  );
}

type FieldProps = {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  /** Renders a multi-line control instead of a single-line input. */
  multiline?: boolean;
  rows?: number;
};

/** Label + control + error message, wired together for assistive tech. */
export function Field({
  label,
  id,
  type = "text",
  placeholder,
  required = true,
  autoComplete,
  error,
  multiline = false,
  rows = 4,
}: FieldProps) {
  const errorId = `${id}-error`;
  const shared = {
    id,
    name: id,
    required,
    placeholder,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  };

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <textarea
          {...shared}
          rows={rows}
          className={controlClasses(error, "resize-none")}
        />
      ) : (
        <input {...shared} type={type} className={controlClasses(error)} />
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
