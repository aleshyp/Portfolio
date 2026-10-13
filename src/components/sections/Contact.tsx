"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Send, Check, Loader2 } from "lucide-react";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Pill } from "@/components/Pill";
import { site } from "@/data/site";

const socials = [
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "Behance", href: site.socials.behance },
];

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Length caps. These mirror what a real person plausibly types and keep a bot
// from posting a multi-megabyte body. Enforced on the inputs (maxLength, so the
// browser stops the typing) AND here (so a scripted POST still gets rejected) —
// client-side validation is UX, not a security boundary, but Web3Forms is the
// one that actually revalidates.
const LIMITS = { name: 100, email: 254, company: 100, message: 4000 } as const;

// Web3Forms access key. This is a PUBLIC key by design — it maps to the target
// mailbox on Web3Forms' server and cannot be used to read submissions, so the
// NEXT_PUBLIC_ prefix (shipped to the browser) is correct here. Set it in
// .env.local (see .env.example). Without it, the form falls back to demo mode.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  // Move focus to the confirmation once the form is replaced, so keyboard and
  // screen-reader users aren't left on the now-removed submit button.
  useEffect(() => {
    if (submitted) confirmationRef.current?.focus();
  }, [submitted]);

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const message = (data.get("message") as string)?.trim();
    if (!name) next.name = "What should I call you?";
    else if (name.length > LIMITS.name)
      next.name = `Keep this under ${LIMITS.name} characters.`;

    if (!email) next.email = "I'll need an email to reply to.";
    else if (email.length > LIMITS.email || !EMAIL_RE.test(email))
      next.email = "That email doesn't look right.";

    if (!message) next.message = "Tell me what you're working on.";
    else if (message.length > LIMITS.message)
      next.message = `Keep this under ${LIMITS.message.toLocaleString()} characters.`;

    return next;
  }

  // Submits to Web3Forms (a hosted form backend). Client-side validate() is UX
  // only; Web3Forms revalidates and handles spam/delivery server-side. The
  // "botcheck" hidden field is a honeypot — real users leave it empty; bots that
  // fill it are dropped by Web3Forms.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return; // guard the Enter-key double-submit
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot tripped → a bot. Show the same confirmation a human sees rather
    // than an error, so the bot gets no signal about why nothing arrived, and
    // never send the request. Web3Forms drops these server-side too; bailing
    // here just saves the round trip.
    if ((data.get("botcheck") as string)?.trim()) {
      setSubmitted(true);
      return;
    }

    const found = validate(data);
    setErrors(found);
    setSubmitError(null);
    if (Object.keys(found).length > 0) {
      // Focus the first field with an error for keyboard/AT users.
      const firstKey = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    // No key configured → keep the safe demo behaviour so the site still works.
    if (!WEB3FORMS_KEY) {
      setPending(true);
      window.setTimeout(() => {
        setPending(false);
        setSubmitted(true);
      }, 900);
      return;
    }

    setPending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: (() => {
          const name = (data.get("name") as string).trim();
          data.set("access_key", WEB3FORMS_KEY);
          data.set("subject", `Portfolio enquiry from ${name}`);
          // Makes "Reply" in the notification email go to the sender rather
          // than to Web3Forms' relay address.
          data.set("replyto", (data.get("email") as string).trim());
          data.set("from_name", name);
          return data;
        })(),
      });
      const json: { success?: boolean } = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setSubmitted(true);
      } else {
        // Generic, non-leaky error message (see security-guidelines: don't echo
        // internals). Detail, if any, stays in the network tab / provider logs.
        setSubmitError("That didn't send. Email me directly and it'll reach me.");
      }
    } catch {
      setSubmitError("Couldn't reach the server. Email me directly instead.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        {/* Permanently-dark panel: it stays dark in BOTH themes, so everything
            inside uses the fixed `on-dark` tokens rather than the theme-aware
            foreground and surface tokens, which would flip out from under it. */}
        <div className="rounded-4xl border border-brand-100 bg-linear-to-br from-brand-950 via-brand-900 to-emerald-950 text-on-dark shadow-lift">
          {/* The clip lives on this inner element rather than on the bordered
              panel above: a 1px border and a clip sharing the 32px curve get
              antialiased in two passes that disagree, which reads as a fuzzy
              edge. Only the blur glow below needs containing, and its radius is
              inset by the border width to nest inside the outer curve. */}
          <div className="relative grid gap-10 overflow-hidden rounded-4xl-inner p-6 sm:p-12 lg:grid-cols-2 lg:gap-16">
            {/* Soft glow.
                Wrapped in its own clipping layer rather than sitting directly
                under the panel's overflow-hidden: a blur() filter promotes the
                element to its own compositing layer, and that layer is NOT
                subject to an ancestor's rounded clip — so the glow's square
                layer bounds punched out past the top-right corner radius. The
                wrapper is an unfiltered, un-promoted box carrying the same
                inner radius, which clips the blurred child correctly. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-4xl-inner"
            >
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
            </div>

            {/* Left: invitation.
                min-w-0: grid items default to min-width:auto, so the long
                unbreakable email address below forced this track to 290px
                inside a 260px panel at ~320px wide — clipped by the panel's
                overflow-hidden rather than scrolling, so it read as truncated
                text. Same reason the right column carries it. */}
            <AnimatedReveal className="min-w-0">
              <Eyebrow className="text-brand-300">
                <span className="bg-brand-300" />
                Contact
              </Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Got something you need built?
              </h2>
              <p className="mt-4 max-w-md text-on-dark-muted">
                I have room for a couple more projects right now. Send me the
                details and I&apos;ll usually reply within a day or two.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 rounded-lg text-on-dark-muted transition-colors hover:text-on-dark"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-on-dark">
                    <Mail size={18} />
                  </span>
                  {site.email}
                </a>
                <div className="flex items-center gap-3 text-on-dark-muted">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-on-dark">
                    <MapPin size={18} />
                  </span>
                  {site.location}
                </div>
              </div>

              {/* gap-1.5 below `sm`: the three socials need every pixel to stay on
                  one line at 360px — see the padding note in Pill. */}
              <div className="mt-8 flex flex-wrap gap-1.5 sm:gap-2">
                {socials.map((s) => (
                  <Pill key={s.label} href={s.href} external tone="onDark">
                    {s.label}
                  </Pill>
                ))}
              </div>
            </AnimatedReveal>

            {/* Right: placeholder form */}
            <AnimatedReveal delay={0.1} className="min-w-0">
              <div className="rounded-3xl bg-surface-on-dark p-6 ring-1 ring-border-on-dark backdrop-blur-sm sm:p-8">
                {submitted ? (
                  <div
                    ref={confirmationRef}
                    role="status"
                    tabIndex={-1}
                    className="flex h-full min-h-80 flex-col items-center justify-center text-center focus:outline-none"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-on-dark">
                      <Check size={26} />
                    </span>
                    <p className="mt-5 font-display text-xl font-semibold">
                      Got it. Thanks.
                    </p>
                    <p className="mt-2 text-sm text-on-dark-muted">
                      {WEB3FORMS_KEY
                        ? "I'll get back to you in a day or two."
                        : "This is a demo form. Add a Web3Forms key to receive real messages."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Honeypot: hidden from users & AT; bots that fill it are
                        dropped server-side. Not a security boundary on its own,
                        just cheap spam reduction. */}
                    <input
                      type="text"
                      name="botcheck"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                    />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Name"
                        id="name"
                        placeholder="Jane Doe"
                        autoComplete="name"
                        maxLength={LIMITS.name}
                        disabled={pending}
                        error={errors.name}
                      />
                      <Field
                        label="Email"
                        id="email"
                        type="email"
                        placeholder="jane@company.com"
                        autoComplete="email"
                        maxLength={LIMITS.email}
                        disabled={pending}
                        error={errors.email}
                      />
                    </div>
                    <Field
                      label="Company (optional)"
                      id="company"
                      placeholder="Acme Inc."
                      required={false}
                      autoComplete="organization"
                      maxLength={LIMITS.company}
                      disabled={pending}
                    />
                    <Field
                      label="Project details"
                      id="message"
                      multiline
                      placeholder="What you need, and when you need it by."
                      maxLength={LIMITS.message}
                      disabled={pending}
                      error={errors.message}
                    />
                    <Button
                      type="submit"
                      variant="onDark"
                      size="lg"
                      fullWidth
                      disabled={pending}
                      aria-busy={pending}
                      className="text-sm font-semibold disabled:opacity-70"
                    >
                      {pending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send message
                          <Send size={16} />
                        </>
                      )}
                    </Button>
                    {submitError && (
                      <p
                        role="alert"
                        className="text-center text-sm text-danger-soft"
                      >
                        {submitError}
                      </p>
                    )}
                    {!WEB3FORMS_KEY && (
                      <p className="text-center text-xs text-on-dark-muted">
                        Demo form. No message is actually sent.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

