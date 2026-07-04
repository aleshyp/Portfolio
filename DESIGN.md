# Design System

The concrete design system for this portfolio — the tokens, primitives, and
rules that keep every screen consistent in both light and dark themes. This is
the source of truth for **what to use**; the `design-guidelines` skill is the
source of truth for **general best practice** (spacing, hierarchy, WCAG). Read
both before building UI.

- **Stack:** Next.js (App Router) · Tailwind CSS **v4** (CSS-first `@theme`) ·
  TypeScript · Framer Motion · next-themes (class strategy) · lucide-react.
- **Tokens live in** [`src/app/globals.css`](src/app/globals.css) under
  `@theme` (light values) with dark re-points in the `.dark` block.
- **Primitives live in** [`src/components/`](src/components/); page sections in
  [`src/components/sections/`](src/components/sections/).

---

## 1. Design tokens

All color/spacing/motion is expressed as tokens. **Never hardcode hex, and
never use arbitrary values** (`text-[#333]`, `p-[13px]`). If you need a value
that isn't a token, add it to `@theme` — don't inline it.

### 1.1 The two-layer color model (read this first)

The trickiest part of this system: some names are **fixed palette values** and
some are **theme-aware**. Mixing them up is how dark mode breaks.

| Layer | Tokens | Flips with theme? | Because… |
|---|---|---|---|
| **Ink** (palette) | `ink`, `ink-soft`, `ink-muted`, `ink-faint` | **No** | Used both as light-mode text *and* as dark-mode **backgrounds** (`bg-ink`, `dark:to-ink`, `dark:bg-ink/70`). Repointing them would turn the dark background light. |
| **Foreground** (text) | `fg`, `fg-soft`, `fg-muted`, `fg-faint` | **Yes** | Pure text color. Re-pointed in `.dark` so one utility reads correctly in both themes. |
| **Surface** | `surface`, `surface-raised`, `surface-solid`, `border-subtle` | **Yes** | Card/panel backgrounds + hairlines. No palette dual-use, so safe to flip. |
| **Brand / Accent** | `brand-50…950`, `accent`, `accent-soft` | **No** | Same hue in both themes; dark tweaks are per-component (e.g. `dark:text-brand-300`). |

**Rule of thumb:**
- Coloring **text**? → use `text-fg` / `text-fg-soft` / `text-fg-muted` /
  `text-fg-faint`. Do **not** add `dark:text-slate-*` — the token flips for you.
- Coloring a **background or gradient** with the dark navy? → use `bg-ink` /
  `to-ink` etc. (the fixed palette).
- A **card/panel**? → `bg-surface` + `border-border-subtle`.

### 1.2 Foreground (text) — `fg`

| Token | Light | Dark | Use for |
|---|---|---|---|
| `text-fg` | `#0b1220` | `#f1f5f9` | Headings, highest-emphasis text |
| `text-fg-soft` | `#1e293b` | `#e2e8f0` | Body copy, secondary headings |
| `text-fg-muted` | `#475569` | `#94a3b8` | Supporting body text (AA ≥ 4.5:1) |
| `text-fg-faint` | `#64748b` | `#94a3b8` | Captions, metadata, eyebrows (AA ≥ 4.5:1) |

> **Known limitation:** in dark mode `fg-muted` and `fg-faint` both resolve to
> slate-400, so the two lowest text levels collapse into one. This preserves the
> pre-existing look. If you want a distinct 4th level in dark, give `fg-faint` a
> dedicated dark value (e.g. slate-500) and re-check contrast on the ink bg.

### 1.3 Ink (fixed dark-navy palette)

| Token | Value | Use for |
|---|---|---|
| `ink` | `#0b1220` | Page background in dark (`dark:bg-ink`), dark CTA (`bg-ink`), gradient end (`dark:to-ink`) |
| `ink-soft` | `#1e293b` | (rarely used directly; slate-800) |
| `ink-muted` | `#475569` | — |
| `ink-faint` | `#64748b` | — |

Prefer `fg*` for text. Reach for `ink*` only when you specifically need the
navy as a **surface/background**.

### 1.4 Surfaces & borders

| Token | Light | Dark | Use for |
|---|---|---|---|
| `bg-surface` | `#ffffff` | `rgba(255,255,255,.03)` | Standard card (ProjectCard, Skills, Experience) — translucent in dark |
| `bg-surface-raised` | `#f8faf9` | `rgba(255,255,255,.05)` | Pills / chips / nested raised elements |
| `bg-surface-solid` | `#ffffff` | `#1e293b` | **Opaque** card that overlays a photo/gradient (e.g. About "Kansas City" label). Not translucent. |
| `border-border-subtle` | `#d1fae5` (brand-100) | `rgba(255,255,255,.1)` | Default hairline border on cards/dividers |

> **Why `surface-solid` exists:** `surface` is translucent in dark mode, which
> vanishes over a busy background. Overlay cards need opacity — use
> `bg-surface-solid`.

### 1.5 Brand & accent

- **`brand-50…950`** — emerald ramp. The one brand hue. Primary CTAs use
  `brand-700`; hover `brand-800`; active `brand-900`. Soft fills use `brand-50`
  (light) / `brand-500/15` (dark). Brand text on dark: `dark:text-brand-300/400`.
- **`accent` / `accent-soft`** — amber. **Sparing** warm highlight only. Not a
  second brand color; don't use it for large areas.

### 1.6 Non-color tokens

| Kind | Tokens |
|---|---|
| Shadow | `shadow-soft` (resting card), `shadow-lift` (hover), `shadow-glow` (brand emphasis) |
| Radius | `rounded-4xl` (2rem) for large cards; standard Tailwind radii otherwise (pills use `rounded-full`) |
| Fonts | `font-sans` (Inter, body) · `font-display` (Sora, headings) — loaded via `next/font` in `layout.tsx` |
| Motion | `animate-fade-up`, `animate-float`, `animate-shimmer` (+ `animate-delay-100/200/300`) |
| Backgrounds | `--background` / `--background-soft` (via `bg-background-soft`) flip per theme |

### 1.7 Spacing, layout & type

- **Spacing:** Tailwind's 4px scale only. No arbitrary one-offs.
- **Container:** [`<Container>`](src/components/Container.tsx) = `max-w-6xl` +
  responsive padding. Wrap page content in it (or in `<Section>`).
- **Section rhythm:** [`<Section>`](src/components/Section.tsx) = `py-20 sm:py-28`
  + `scroll-mt-24` for anchor offset. Use it for every top-level page section.
- **Reading width:** body prose ~65ch (`max-w-2xl`/`max-w-prose`).
- **Type:** body ≥ 16px, line-height ~1.5; headings tight (`leading-[1.1]`),
  `font-display`, `tracking-tight`. Cap ~4 sizes / 2 weights per view.

---

## 2. Component primitives

Reusable UI lives in `src/components/`. **Reach for these before writing new
markup** — they already encode the token usage and interaction states.

### `Button` — [`Button.tsx`](src/components/Button.tsx)
Renders `<button>`, internal `<Link>`, or external `<a>` (auto-adds
`rel="noopener noreferrer"` for `external`).
- **Variants:** `primary` (brand-700 fill), `outline` (brand border), `ghost`.
- **Sizes:** `md`, `lg`.
- All states baked in: hover (lift + shadow), active, `disabled` (opacity +
  no pointer). Focus ring is global (see §3).
- **One primary action per view.** Everything else is `outline`/`ghost`.

### `Badge` / `Eyebrow` — [`Badge.tsx`](src/components/Badge.tsx)
- `Badge` variants: `solid`, `soft` (default), `outline`. Pill, `text-xs`.
- `Eyebrow` — dotted uppercase label above section titles (`text-brand-700`).

### `Container` / `Section` — see §1.7.

### `AnimatedReveal` / `StaggerGroup` / `StaggerItem` — [`AnimatedReveal.tsx`](src/components/AnimatedReveal.tsx)
The shared motion language. Fades/slides content in on scroll (`whileInView`,
`once: true`). **All of it honors `prefers-reduced-motion`** — reduced users get
content at full opacity, no transform. Use these instead of ad-hoc `motion.div`.

### `ProjectCard` — [`ProjectCard.tsx`](src/components/ProjectCard.tsx)
The canonical card pattern: `rounded-4xl border-border-subtle bg-surface
shadow-soft`, hover `-translate-y-1 shadow-lift`. Copy this recipe for new cards.

### `ThemeToggle` / `ThemeProvider` — light/dark via next-themes (class strategy,
`defaultTheme="system"`). `suppressHydrationWarning` on `<html>`.

---

## 3. Interaction, accessibility & motion

- **Focus ring is global** — `:focus-visible` gets a 2px brand outline
  (brand-400 in dark) with offset, defined in `globals.css`. **Never** set
  `outline-none` without an equally visible replacement.
- **Every interactive element** needs default / hover / focus-visible / active /
  disabled states; async ones also loading; lists also empty + error.
- **Keyboard:** everything operable; a skip link (`Skip to content`) targets
  `#main`. Semantic HTML first (`<button>`, `<nav>`, `<main>`, ordered headings).
- **Targets** ≥ 24×24px (aim 44×44 on touch).
- **Contrast** ≥ 4.5:1 body / 3:1 large. The `fg-*` and `ink-faint` values are
  tuned to clear AA — don't lighten muted text past them.
- **Motion:** 150–300ms, purposeful; `prefers-reduced-motion` respected globally
  (via the media query in `globals.css` **and** `useReducedMotion()` in JS).

---

## 4. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| `text-fg-muted` | `text-ink-muted dark:text-slate-400` |
| `bg-surface border-border-subtle` | `bg-white dark:bg-white/[0.03] border-brand-100 dark:border-white/10` |
| `bg-surface-solid` for overlay cards | `bg-surface` over a photo (vanishes in dark) |
| `bg-ink` / `dark:to-ink` for dark navy backgrounds | `bg-fg` (fg is text; it's light in dark mode) |
| Add a token to `@theme` | `text-[#0b1220]`, `p-[13px]` |
| `<Button variant="outline">` | Re-implementing button styles inline |
| One `variant="primary"` per view | Two competing primary CTAs |
| Emerald `brand-*` for brand color | Amber `accent` as a second brand color |

---

## 5. Before you call UI work done

Run the **Review Pass** from the `design-guidelines` skill, plus these
system-specific checks:

1. **No raw dark overrides** — grep the diff for `dark:text-slate`,
   `dark:bg-white/`, `dark:border-white/`. If present, a token is missing or
   you skipped one. (Legit exceptions: Button's translucent fills, decorative
   blurs, opaque overlays via `surface-solid`.)
2. **Both themes** — actually view light *and* dark. The `fg`/`ink` split means
   a wrong token can look fine in one theme and break in the other.
3. **Tokens only** — no hardcoded hex, no arbitrary `[...]` values.
4. **Primitive reuse** — new button/badge/card should be the existing component
   or copy its recipe, not a fresh inline style.

See the `test-suite` skill to prove it (Playwright journeys, axe-core a11y,
Lighthouse, visual/responsive at 360 / 768 / 1280).
