"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/** Light/dark toggle. Renders a stable placeholder until mounted to avoid hydration mismatch. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Intentional post-mount flag: the theme icon depends on client-only state,
  // so we render a stable placeholder on the server and first paint, then flip
  // to the real icon after mount to avoid a hydration mismatch. The one-time
  // setState is the point here, not an accidental cascade.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} mode`
          : "Toggle theme"
      }
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-brand-50 dark:text-ink-faint dark:hover:bg-white/5",
        className,
      )}
    >
      {/* Suppress hydration warning: the icon depends on client-only theme state. */}
      <span suppressHydrationWarning className="relative flex h-[18px] w-[18px] items-center justify-center">
        {mounted && isDark ? <Sun size={18} /> : <Moon size={18} />}
      </span>
    </button>
  );
}
