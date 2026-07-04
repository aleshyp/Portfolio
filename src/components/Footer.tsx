"use client";

import Link from "next/link";
import { ArrowUp, Mail } from "lucide-react";
import { site } from "@/data/site";
import { Container } from "./Container";

const socialLinks = [
  { label: "Dribbble", href: site.socials.dribbble },
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "Behance", href: site.socials.behance },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-background-soft dark:border-white/10">
      <Container>
        <div className="flex flex-col gap-10 py-14 sm:py-16">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-md">
              <p className="font-display text-2xl font-semibold text-ink dark:text-slate-100">
                Let&apos;s build something{" "}
                <span className="text-gradient">people love</span>.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-300"
              >
                <Mail size={16} />
                {site.email}
              </a>
            </div>

            <nav aria-label="Social links">
              <ul className="flex flex-wrap gap-2">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 hover:shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-brand-500/30 dark:hover:text-brand-300"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 border-t border-brand-100 pt-8 text-sm text-ink-faint dark:border-white/10 dark:text-slate-400 sm:flex-row sm:items-center">
            <p>
              © {new Date().getFullYear()} {site.name}. Designed &amp; built with
              care.
            </p>
            <div className="flex items-center gap-6">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-brand-700 dark:hover:text-brand-300"
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 text-ink-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:text-slate-400 dark:hover:border-brand-500/30 dark:hover:text-brand-300"
                aria-label="Back to top"
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
