"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Copies the email address to the clipboard.
 *
 * Sits beside every mailto link because mailto is unreliable for exactly the
 * reader we want: on a work machine it often opens a mail client nobody uses,
 * and a recruiter who wanted to paste the address into their ATS gets nothing.
 *
 * `onDark` is for the permanently-dark panels (Contact), which use the fixed
 * on-dark tokens rather than the theme-aware ones.
 */
export function CopyEmailButton({
  tone = "default",
  className,
}: {
  tone?: "default" | "onDark";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure context, permissions). The address
      // is visible right beside the button, so there's nothing to fall back to.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex min-h-6 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
        tone === "onDark"
          ? "bg-surface-on-dark text-on-dark-muted ring-1 ring-border-on-dark hover:text-on-dark"
          : "border border-border-subtle text-fg-muted hover:border-brand-300 hover:text-brand-700 dark:hover:border-brand-500/30 dark:hover:text-brand-300",
        className,
      )}
    >
      {copied ? (
        <Check size={14} aria-hidden="true" />
      ) : (
        <Copy size={14} aria-hidden="true" />
      )}
      {/* The label itself changes, so a screen reader hears the result through
          the live region without a separate announcement element. */}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
