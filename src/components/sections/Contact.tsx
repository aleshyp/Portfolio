"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Send, Check, Loader2 } from "lucide-react";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Badge";
import { cn } from "@/lib/utils";
import { site } from "@/data/site";

const socials = [
  { label: "Dribbble", href: site.socials.dribbble },
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "Behance", href: site.socials.behance },
];

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    if (!name) next.name = "Please enter your name.";
    if (!email) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address.";
    if (!message) next.message = "Tell me a little about your project.";
    return next;
  }

  // Submits to Web3Forms (a hosted form backend). Client-side validate() is UX
  // only; Web3Forms revalidates and handles spam/delivery server-side. The
  // "botcheck" hidden field is a honeypot — real users leave it empty; bots that
  // fill it are dropped by Web3Forms.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
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
          data.set("access_key", WEB3FORMS_KEY);
          data.set("subject", "New message from your portfolio");
          return data;
        })(),
      });
      const json: { success?: boolean } = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setSubmitted(true);
      } else {
        // Generic, non-leaky error message (see security-guidelines: don't echo
        // internals). Detail, if any, stays in the network tab / provider logs.
        setSubmitError("Something went wrong. Please email me directly instead.");
      }
    } catch {
      setSubmitError("Couldn't reach the server. Please email me directly instead.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <div className="overflow-hidden rounded-4xl border border-brand-100 bg-gradient-to-br from-brand-950 via-brand-900 to-emerald-950 text-white shadow-lift">
          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16">
            {/* soft glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />

            {/* Left: invitation */}
            <AnimatedReveal>
              <Eyebrow className="text-brand-300">
                <span className="bg-brand-300" />
                Contact
              </Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Have a project in mind? Let&apos;s talk.
              </h2>
              <p className="mt-4 max-w-md text-brand-50">
                I&apos;m currently taking on a few new projects. Tell me a little
                about what you&apos;re building and I&apos;ll get back to you
                within a day or two.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 rounded-lg text-brand-100 transition-colors hover:text-white"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Mail size={18} />
                  </span>
                  {site.email}
                </a>
                <div className="flex items-center gap-3 text-brand-100">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <MapPin size={18} />
                  </span>
                  {site.location}
                </div>
              </div>

              <div className="mt-8 flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-brand-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:text-white"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </AnimatedReveal>

            {/* Right: placeholder form */}
            <AnimatedReveal delay={0.1}>
              <div className="rounded-3xl bg-white/[0.06] p-6 backdrop-blur-sm ring-1 ring-white/10 sm:p-8">
                {submitted ? (
                  <div
                    ref={confirmationRef}
                    role="status"
                    tabIndex={-1}
                    className="flex h-full min-h-[320px] flex-col items-center justify-center text-center focus:outline-none"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white">
                      <Check size={26} />
                    </span>
                    <p className="mt-5 font-display text-xl font-semibold">
                      Thanks for reaching out!
                    </p>
                    <p className="mt-2 text-sm text-brand-100">
                      {WEB3FORMS_KEY
                        ? "I'll get back to you within a day or two."
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
                        error={errors.name}
                      />
                      <Field
                        label="Email"
                        id="email"
                        type="email"
                        placeholder="jane@company.com"
                        autoComplete="email"
                        error={errors.email}
                      />
                    </div>
                    <Field
                      label="Company (optional)"
                      id="company"
                      placeholder="Acme Inc."
                      required={false}
                      autoComplete="organization"
                    />
                    <div>
                      <label
                        htmlFor="message"
                        className="mb-1.5 block text-sm font-medium text-brand-100"
                      >
                        Project details
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        aria-invalid={errors.message ? true : undefined}
                        aria-describedby={
                          errors.message ? "message-error" : undefined
                        }
                        placeholder="Tell me about your project, timeline, and goals…"
                        className={cn(
                          "w-full resize-none rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950",
                          errors.message
                            ? "border-red-400 focus-visible:ring-red-400"
                            : "border-white/15 focus:border-brand-300 focus-visible:ring-brand-300",
                        )}
                      />
                      {errors.message && (
                        <p
                          id="message-error"
                          className="mt-1.5 text-sm text-red-300"
                        >
                          {errors.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={pending}
                      aria-busy={pending}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-brand-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-lift active:translate-y-0 active:shadow-soft disabled:pointer-events-none disabled:opacity-70"
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
                    </button>
                    {submitError && (
                      <p
                        role="alert"
                        className="text-center text-sm text-red-300"
                      >
                        {submitError}
                      </p>
                    )}
                    {!WEB3FORMS_KEY && (
                      <p className="text-center text-xs text-brand-100">
                        Demo form — no message is actually sent.
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

function Field({
  label,
  id,
  type = "text",
  placeholder,
  required = true,
  autoComplete,
  error,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-brand-100"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950",
          error
            ? "border-red-400 focus-visible:ring-red-400"
            : "border-white/15 focus:border-brand-300 focus-visible:ring-brand-300",
        )}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
