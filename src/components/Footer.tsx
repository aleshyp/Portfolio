"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Mail } from "lucide-react";
import { site } from "@/data/site";
import { Container } from "./Container";
import { IconButton } from "./IconButton";
import { Pill } from "./Pill";
import { CopyEmailButton } from "./CopyEmailButton";

const socialLinks = [
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "Résumé (PDF)", href: site.resumeUrl },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-background-soft">
      <Container>
        <div className="flex flex-col gap-10 py-14 sm:py-16">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-md">
              <p className="font-display text-2xl font-semibold text-fg">
                Still reading? <span className="text-gradient">Say hi</span>.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-fg-muted transition-colors hover:text-brand-700 dark:hover:text-brand-300"
                >
                  <Mail size={16} />
                  {site.email}
                </a>
                <CopyEmailButton />
              </div>
            </div>

            <nav aria-label="Profiles">
              <ul className="flex flex-wrap gap-2">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <Pill href={s.href} external>
                      {s.label}
                    </Pill>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 border-t border-border-subtle pt-8 text-sm text-fg-faint sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              {/* loading="eager" on both: next/image lazy-loads by default, but
                  these are a 32px theme-swapped pair where exactly one is
                  display:none at any time. A hidden lazy image never enters the
                  viewport, so it can still be unloaded (naturalWidth 0) after
                  networkidle — which made the "no broken images" check depend on
                  the page's exact height. They're ~1KB inline SVGs; there is
                  nothing to defer. */}
              <Image
                src="/personal-branding/brutalist-grid-emerald.svg"
                alt=""
                width={32}
                height={32}
                loading="eager"
                className="h-8 w-8 dark:hidden"
              />
              <Image
                src="/personal-branding/brutalist-grid-white.svg"
                alt=""
                width={32}
                height={32}
                loading="eager"
                className="hidden h-8 w-8 dark:block"
              />
              <p>
                © {new Date().getFullYear()} {site.name}. Every pixel my own
                fault.
              </p>
            </div>
            {/* Wraps: five nav links + the back-to-top button exceed a ~320px
                viewport on one line, which pushed the row ~109px past the
                screen edge (masked by body's overflow-x: hidden). */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-brand-700 dark:hover:text-brand-300"
                >
                  {item.label}
                </Link>
              ))}
              <IconButton
                shape="circle"
                label="Back to top"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ArrowUp size={16} />
              </IconButton>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
