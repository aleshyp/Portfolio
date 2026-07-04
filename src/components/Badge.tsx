import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "soft" | "outline";
};

const variants = {
  solid: "bg-brand-700 text-white",
  soft: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  outline:
    "border border-brand-200 text-brand-700 dark:border-brand-500/30 dark:text-brand-300",
};

export function Badge({ children, className, variant = "soft" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Small label with a leading dot — used as an eyebrow above section titles. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-brand-700 dark:text-brand-400",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      {children}
    </span>
  );
}
