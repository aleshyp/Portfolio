# Figma-Agent Brief — Northwind Marketing Site

A ready-to-paste brief for a Figma AI agent (or a designer) to produce the
**Northwind** marketing-site case-study assets. Northwind is a *fictional client*
in this portfolio (`src/data/projects.ts`, slug `marketing-landing-page`) — a
team-analytics SaaS. The live site already ships hand-built SVG stand-ins for
these screens (`src/components/MarketingAsset.tsx`); this brief exists to upgrade
them to polished, exportable Figma artwork **without drifting from the
established identity**. Match the palette, wordmark, and type below exactly.

---

## Paste-into-agent prompt

> You are a senior product & marketing designer. Design the marketing-site
> deliverables for a fictional startup called **Northwind** — a **team-analytics
> SaaS** that turns raw team activity into clear weekly signals ("no dashboards to
> babysit"). The brand is confident, calm, and modern — data you can trust at a
> glance, not another busy dashboard. The site's single job is to drive
> **free-trial sign-ups**. Design **mobile-first**, work in **light and dark**,
> and hit **WCAG AA** contrast on every text/background pair. Produce everything as
> an organized Figma file with named frames, components, auto-layout, and
> export-ready artboards at **1600×900 (16:9)**.
>
> **Brand mark:** a small **compass needle** inside a soft rounded-square tile —
> a cobalt north-pointing needle whose north half is coral (a "true north /
> northwind" idea). It sits left of the **"Northwind"** wordmark. Keep the mark
> simple enough to read at favicon size.
>
> **Palette (use these exact values):**
> | Token | Hex | Role |
> |-------|-----|------|
> | Ink | `#0B1B3A` | Deep navy; primary text / device body |
> | Cobalt | `#2563EB` | Primary brand |
> | Cobalt Deep | `#1E40AF` | Cobalt shade for gradients |
> | Sky | `#60A5FA` | Chart bars / secondary accent |
> | Coral | `#FB6F5B` | CTA + highlight (the one warm accent) |
> | Coral Soft | `#FDA894` | Coral tint |
> | Mist | `#EEF3FF` | Page background tint |
> | Cloud | `#F6F8FD` | Panel / section fill |
> | Line | `#DCE4F5` | Hairline borders |
> | Slate | `#5B6B8C` | Muted body text |
>
> **Type:** Display/headings **Sora** (700–800, tight tracking). Body/labels
> **Inter**. Primary buttons are **coral** pills; secondary buttons are outline.
> Headline: **"See what your team actually ships."** ("ships" set in cobalt.)
>
> **Deliverables (one 1600×900 frame each, named as listed):**
> 1. **`01-hero`** — The landing hero: top nav (wordmark + Product/Pricing/Docs +
>    a coral "Start free"), the headline over a slate subhead, a coral "Start free
>    trial" + outline "Book a demo" CTA pair, and a "logos" trust strip. On the
>    right, a **product-preview card** ("This week") showing a weekly bar chart
>    (sky bars, one coral peak) with a rising cobalt trend line. Light mist→paper
>    background.
> 2. **`02-value-props`** — A "WHY NORTHWIND" section titled "Clarity, not more
>    charts." with **three feature cards** on a cloud background. Each card has a
>    distinct mist icon tile, a Sora title, and two lines of slate body:
>    **Weekly signals** (rising-bars icon), **Zero setup** (lightning-bolt icon),
>    **Shared context** (overlapping-avatars icon).
> 3. **`03-social-proof`** — A conversion section on paper: a three-stat row
>    (**+22%** trial conversion · **4.9/5** rating · **12k+** teams) in big cobalt
>    Sora, a bordered testimonial card ("We replaced three dashboards with one
>    Monday-morning email." — Priya Nair, Head of Engineering, Lumen Labs), and a
>    cobalt-gradient **CTA band** with a coral "Start free" button.
> 4. **`04-mobile`** — The responsive story: a **phone frame** (ink body, notch)
>    rendering the hero at mobile width — wordmark, stacked headline, full-width
>    coral "Start free trial", and a mini preview card with bars — beside a
>    "RESPONSIVE / Designed mobile-first." caption. Mist background.
>
> **Rules:** Build the **wordmark**, the **compass mark**, and the **button** as
> reusable components (button variants: filled/outline). Use auto-layout for the
> nav, the value-prop cards, and the stat row. Coral is the *only* warm color —
> use it for CTAs and single highlights, never large fills. Keep AA contrast for
> all text on its background. Export each frame as PNG @2x and SVG. Do not
> introduce colors outside the palette.

---

## Extra deliverables worth requesting (beyond what the site shows)

If you want the case study to feel even fuller, ask the agent for:

- **A true dark-mode variant** of the hero and value-props (ink backgrounds,
  lightened text) — the site wraps these on a dark page, so a real dark comp
  sells the "works in light and dark" claim.
- **Real-world mockups** — the site open in a laptop browser, the phone screen in
  a hand, an OG/social share card. *(Photographic mockups are the main thing the
  in-repo SVGs can't do — this is where Figma earns its keep.)*
- **A component/spec sheet** — the button, input, card, and chart tokens with
  spacing and states, to back up the "designed **and** built, no handoff gap"
  story that is the whole point of this case study.
- **Favicon / app-icon grid** — the compass mark at 16 / 32 / 64 / 512 px.

## Wiring the Figma exports back into the site

Each frame maps 1:1 to a scene in `src/components/MarketingAsset.tsx` and a slot
in the case study (`src/app/work/[slug]/page.tsx`):

| Figma frame | Current SVG scene | Case-study slot |
|-------------|-------------------|-----------------|
| `01-hero` | `hero` | Hero / cover |
| `02-value-props` | `value-props` | Block 01 "The brief" |
| `03-social-proof` | `social-proof` | Block 02 "Design" |
| `04-mobile` | `mobile` | Block 03 "Build" |

(Block 04 "Outcome" has no gallery scene — `gallery: 3` — so there are four
blocks but only three inter-block visuals, plus the hero cover.)

To swap an SVG scene for a Figma PNG, replace the `<MarketingAsset>` with a
`next/image` `<Image>` pointing at the export, keeping the **same `alt` text**
(already written in `marketingScenes`) and the `aspect-[16/9] rounded-4xl`
classes. Export at 1600×900 (or 3200×1800 @2x) so it stays crisp on retina.
