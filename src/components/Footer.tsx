"use client";

import Link from "next/link";
import Image from "next/image";
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
    <footer className="border-t border-border-subtle bg-background-soft">
      <Container>
        <div className="flex flex-col gap-10 py-14 sm:py-16">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-md">
              <p className="font-display text-2xl font-semibold text-fg">
                Let&apos;s build something{" "}
                <span className="text-gradient">people love</span>.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 inline-flex items-center gap-2 text-fg-muted transition-colors hover:text-brand-700 dark:hover:text-brand-300"
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
                      className="inline-flex rounded-full border border-border-subtle bg-surface-raised px-4 py-2 text-sm font-medium text-fg-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 hover:shadow-soft dark:hover:border-brand-500/30 dark:hover:text-brand-300"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 border-t border-border-subtle pt-8 text-sm text-fg-faint sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/personal-branding/ian-riley-logo-emerald.svg"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 dark:hidden"
              />
              <Image
                src="/personal-branding/ian-riley-logo-emerald-dark.svg"
                alt=""
                width={32}
                height={32}
                className="hidden h-8 w-8 dark:block"
              />
              <p>
                © {new Date().getFullYear()} {site.name}. Designed &amp; built
                with care.
              </p>
            </div>
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-fg-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 dark:hover:border-brand-500/30 dark:hover:text-brand-300"
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
