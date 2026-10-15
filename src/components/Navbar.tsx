"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/data/site";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";
import { Button, buttonClasses } from "./Button";
import { IconButton } from "./IconButton";
import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/utils";

// "/#work" -> "work". The nav hrefs are absolute so they work from a case
// study, but the observer needs the bare element ids.
const SECTION_IDS = site.nav.map((item) => item.href.replace("/#", ""));

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // The tracked sections only exist on the home page. Passing an empty list
  // elsewhere keeps the hook from observing ids that will never resolve, and
  // leaves every nav link unhighlighted on a case study — which is correct:
  // none of them is where the reader currently is.
  const onHome = pathname === "/";
  const trackedIds = useMemo(() => (onHome ? SECTION_IDS : []), [onHome]);
  const activeSection = useActiveSection(trackedIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the menu when the viewport crosses into the desktop nav (lg, 1024px).
  // Without this, resizing or rotating while it's open hides the toggle button
  // but leaves `open` true — which keeps body scroll locked with no way to
  // undo it. Matches the lg: breakpoint the markup below uses — lg, not md:
  // with six links, the theme toggle and the CTA, the row didn't fit at 768px
  // (the CTA wrapped to two lines and the links ran into the logo).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "glass border-b border-border-subtle shadow-soft"
          : "bg-transparent",
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between sm:h-20">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-lg text-base font-semibold text-fg"
            onClick={() => setOpen(false)}
            aria-label={`${site.name}, home`}
          >
            {/* Framed "IR" mark. Two files so the tile flips with the theme
                (emerald-on-white for light, white-on-navy for dark). */}
            <Image
              src="/personal-branding/brutalist-grid-emerald.svg"
              alt={site.name}
              width={36}
              height={36}
              priority
              className="h-9 w-9 transition-transform duration-300 group-hover:scale-105 dark:hidden"
            />
            <Image
              src="/personal-branding/brutalist-grid-white.svg"
              alt={site.name}
              width={36}
              height={36}
              priority
              className="hidden h-9 w-9 transition-transform duration-300 group-hover:scale-105 dark:block"
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 lg:flex">
            {site.nav.map((item) => {
              const isActive =
                activeSection === item.href.replace("/#", "");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    // aria-current tells assistive tech which section the reader
                    // is in — the same information the color change carries
                    // visually, which on its own would not be conveyed at all.
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "text-brand-700 dark:text-brand-300"
                        : "text-fg-muted hover:text-brand-700 dark:text-fg-faint dark:hover:text-brand-300",
                    )}
                  >
                    {item.label}
                    {/* Underline dot. Color alone can't be the only signal
                        (WCAG 1.4.1), so the active link also carries a mark. */}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand-600 dark:bg-brand-400"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
            {/* Résumé sits outside site.nav: that list doubles as the
                scroll-spy's section ids, and a PDF isn't a section. New tab so
                a reader who opens it doesn't lose their place on the page. */}
            <li>
              <a
                href={site.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-4 py-2 text-sm font-medium text-fg-muted transition-colors duration-200 hover:text-brand-700 dark:text-fg-faint dark:hover:text-brand-300"
              >
                Résumé
              </a>
            </li>
            <li className="ml-1">
              <ThemeToggle />
            </li>
            <li className="ml-1">
              <Button href="/#contact" variant="ink">
                Let&apos;s talk
              </Button>
            </li>
          </ul>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <IconButton
              label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </IconButton>
          </div>
        </nav>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border-subtle bg-white shadow-soft backdrop-blur-xl lg:hidden dark:bg-ink"
          >
            <Container>
              <ul className="flex flex-col gap-1 py-4">
                {site.nav.map((item) => {
                  const isActive =
                    activeSection === item.href.replace("/#", "");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                          isActive
                            ? "bg-brand-50 text-brand-700 dark:bg-white/5 dark:text-brand-300"
                            : "text-fg-soft hover:bg-brand-50 hover:text-brand-700 dark:text-fg-faint dark:hover:bg-white/5 dark:hover:text-brand-300",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <a
                    href={site.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-fg-soft transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-fg-faint dark:hover:bg-white/5 dark:hover:text-brand-300"
                  >
                    Résumé (PDF)
                  </a>
                </li>
                <li className="pt-2">
                  <Link
                    href="/#contact"
                    onClick={() => setOpen(false)}
                    className={buttonClasses({
                      fullWidth: true,
                      // The mobile menu uses a softer radius than the pill-shaped
                      // CTAs elsewhere, matching the nav links stacked above it.
                      className: "rounded-xl px-4 py-3 text-base",
                    })}
                  >
                    Let&apos;s talk
                  </Link>
                </li>
              </ul>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
