"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { IconButton } from "./IconButton";

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
    <IconButton
      label={
        mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={className}
    >
      {/* Suppress hydration warning: the icon depends on client-only theme state.
          size-4.5 (18px) matches the lucide glyph so the icon swap doesn't
          shift layout; size-4/5 (16/20px) would both nudge it. */}
      <span
        suppressHydrationWarning
        className="relative flex size-4.5 items-center justify-center"
      >
        {mounted && isDark ? <Sun size={18} /> : <Moon size={18} />}
      </span>
    </IconButton>
  );
}
