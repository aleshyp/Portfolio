# Fernweh — Figma prompts

**Run prompt 0 first.** It establishes the visual system. Every frame prompt
after it is short *because* it inherits that system — run them in the same Figma
file / same chat so the style carries. If a frame comes back off-style, re-paste
the "House style" recap at the bottom of this file with it.

Export per the drop-zone table at the end.

---

## What 2026 changes about this deck

The good news first: this deck's existing direction — calm, warm, generous
whitespace, flat mockups — is exactly where 2026 landed. The dominant UX/UI
shift is toward **calm interfaces that reduce cognitive load**, and the things
now reading as dated are glassmorphism, extravagant gradients, heavy 3D bezels,
and over-animated interfaces. So most of this file stays.

What changed is the **standard of proof**. Recruiters scan a case study in
3–5 minutes, and the opening 0–3 seconds decide whether they keep reading. What
they're scanning for is decision-making and measurable outcomes, not polish.
That reprioritizes a few things:

- **Frame 1 must state the outcome, not just the promise.** A headline alone no
  longer clears the 3-second bar; a number does.
- **Show the decision, not just the result.** "Iteration signals maturity;
  silence suggests guesswork." The old deck showed five finished states and no
  evidence of a choice being made. Frame 3 now carries a rejected alternative.
- **Motion and hierarchy should explain, not perform.** This deck has no motion,
  but the same rule governs visual weight: every heavy element must be carrying
  an argument.

Two 2026 trends I deliberately did **not** adopt, because they fight the
project: tactile brutalism / aggressive contrast, and bright dopamine-color
palettes. Both are real directions this year and both would contradict a case
study whose entire thesis is *calm, reduced friction*. Warm minimalism is the
right lane here — the correction to make is against *sterile* minimalism, not
against restraint.

---

## 0 — Design theme (run this first)

Create a **design theme / style sheet frame** at 1600×900 for a portfolio case
study about a mobile app onboarding redesign.

The project is **Fernweh**, a trip-planning app. Its onboarding was a nine-step
setup wizard; the redesign rebuilds it around one real first action — **saving
your first trip, in under two minutes**. The mood is *calm, warm, confident* —
travel-adjacent without a single travel cliché. No passport stamps, no paper
airplanes, no world-map dot trails.

Lay the frame out as a style sheet showing:

- **Color.** Warm off-white background `#FAF7F4`. Deep slate-navy `#0F172A` for
  text and dark panels. A warm amber/terracotta accent — build a small ramp
  around `#C2703A` and `#E08A4C`. One success green `#16A34A`, reserved
  exclusively for a saved-trip confirmation. Show each as a labelled swatch with
  its hex.
- **Contrast check.** Next to the swatches, note the text/background pairings
  that are safe for body copy at WCAG AA (4.5:1). Amber on off-white will fail
  at small sizes — mark it as an accent-and-large-type color only, and use navy
  for anything set small. Accessibility in 2026 is treated as infrastructure,
  not a finishing pass, and a case study that visibly fails it undercuts itself.
- **Type.** A geometric or humanist sans (Inter, Sora, or similar). Show the
  scale: a big frame headline, a section heading, body text, and a small
  all-caps label. Nothing in the deck should be smaller than ~14px at 1600px
  wide. Set the scale with real contrast between steps — a headline that is only
  slightly larger than a heading reads as indecision.
- **Phone frame.** A single reusable device mockup: simple rounded rectangle,
  flat, straight-on, no glossy 3D bezel, no hand holding it, no perspective
  tilt. Show it empty as the template. Consistency across every frame matters
  more here than realism — one mockup style, reused, is what makes five frames
  read as one deck.
- **Annotation style.** A callout label with a leader line, and a small
  all-caps step/stat label — the two ways these frames will point at things.
- **Stat card.** A small reusable card for a number plus its label — big
  numeral, small caps caption. Frames 1 and 5 both need it, and it should be
  the same object in both.
- **Spacing.** Generous negative space is the point. Show the margin and the
  gap rhythm as a simple 8px-based scale, so spacing is a system rather than a
  per-frame judgment call.

This is the system the next five frames all use. Keep it minimal and usable —
a style sheet, not a poster.

---

## 1 — First win  → `01-first-win.png`

Using the Fernweh theme, a 1600×900 hero frame.

Large headline **"One saved trip. Under two minutes."** on the left. Directly
beneath it, one quiet line of supporting context: **"Activation +31% · nine
steps cut to three."** On the right, one phone showing a **saved Lisbon trip**:
a destination card, a green confirmation check, and a "Plan day one" button.

This is the frame that sells the project, and it has about three seconds to do
it — the headline carries the promise, the stat line proves it. Keep the stat
line visually subordinate to the headline (smaller, lighter), but present. Calm,
lots of air, nothing else competing. The green check is the *only* use of green
in the whole deck.

---

## 2 — Before / after  → `02-before-after.png`

Using the Fernweh theme, a 1600×900 comparison frame.

**Left:** the old **nine-step setup wizard** — nine small labelled steps
(notifications, location, profile, interests, and so on) with a visible drop-off
marker showing most users never finish.

**Right:** the rebuilt **three-step flow**, ending at a saved trip, labelled
**1m 50s**.

The contrast in visual weight *is* the argument: make the left side feel long
and heavy, the right side short and light. Label the two sides plainly (
**Before** / **After**) — a comparison a reviewer has to decode is a comparison
that doesn't land in a skim.

---

## 3 — The shortest path  → `03-shortest-path.png`

Using the Fernweh theme, a 1600×900 critical-path diagram.

Three steps on a single horizontal track: **"Where to?" → "How long?" → "Trip
saved."**

Below the track, three items branch *away* — notifications, interests, invites
— labelled **deferred, not deleted**. The branches must read as "moved later,"
never as "removed."

To one side, a small, visibly secondary panel headed **"Considered: one-screen
setup"** — a single screen holding all three questions at once, struck through
or dimmed, with a one-line reason: **"Faster on paper, but no sense of
progress."** This is the frame that shows a decision was made rather than
stumbled into. Keep it small — it's evidence, not a competing proposal.

---

## 4 — One job per step  → `04-one-job.png`

Using the Fernweh theme, a 1600×900 frame with three phone screens in a row,
each doing exactly one thing:

1. A **city search**.
2. A **trip-length picker** with a progress bar reading **"You're almost there."**
3. A **notification permission ask** that explains it will watch **Lisbon flight
   prices** — annotated as arriving *after* the trip exists, not on launch.

Small callout labels with leader lines pointing at the microcopy in each. The
callouts should name the *reason*, not describe the screen — "asks after the
trip exists, so the ask has a subject" rather than "permission dialog."

---

## 5 — Outcome  → `05-activation.png`

Using the Fernweh theme, a 1600×900 outcome frame.

A **funnel** comparing the old and rebuilt flows by share of users reaching
their first win. Below it, three stat cards using the theme's stat component:
**+31% activation**, **+19% day-7 retention**, **1m 50s to first win**.

Add one small line under the stat row noting these are **projected targets from
a concept project**, not shipped measurements. Overstated metrics are the
fastest way to lose a reviewer's trust; a stated constraint reads as
professional judgment rather than as a weakness.

Data-forward and confident, but still calm — same whitespace as the rest.

---

## House style (re-paste if a frame drifts)

1600×900 landscape. Warm off-white `#FAF7F4`, slate-navy `#0F172A`, amber
accent `#C2703A`/`#E08A4C`, green `#16A34A` only for the saved-trip check.
Geometric/humanist sans, big headline + small all-caps labels, nothing under
~14px, body text always navy (never amber). Flat straight-on phone frames, no
bezels, no hands, no tilt, no glassmorphism, no drop shadows on UI. Generous
whitespace on an 8px rhythm. Mobile UI shown *inside* a landscape composition —
never a phone screenshot cropped to widescreen. Every heavy element must be
carrying an argument. All five frames must read as one deck.

---

## Export drop zone

Export into `public/work/fernweh/` (create it — this brief lives in `docs/`,
the assets it produces are served from `public/`) with these exact filenames,
then tell Claude "the Fernweh assets are in."

| Filename | Frame | Case-study slot |
|---|---|---|
| `01-first-win.png` | 01 First win | Hero |
| `02-before-after.png` | 02 Before / after | Block 01 "The problem" |
| `03-shortest-path.png` | 03 Shortest path | Block 02 "Strategy" |
| `04-one-job.png` | 04 One job per step | Block 03 "Craft" |
| `05-activation.png` | 05 Outcome | Block 04 "Outcome" |

All five slots are real — the case study renders the hero plus one image per
block, and Fernweh has exactly four blocks. (The `gallery: 3` field in
[`projects.ts`](../../src/data/projects.ts) is **not** a limit here: the
gallery count only applies to projects with no asset set, and Fernweh has one.
See [`work/[slug]/page.tsx:190-196`](../../src/app/work/[slug]/page.tsx#L190-L196).)

**Export settings:** PNG @2x (so 3200×1800). Same as Aperture — AI-generated
frames with nested vectors and effects render more reliably as PNG than as raw
SVG. Claude re-encodes these to WebP at 2400w before wiring them in (that's what
cut Northwind from 6.2 MB to 282 KB with no visible loss).

The theme frame (prompt 0) doesn't need exporting — it's scaffolding. Keep it in
the Figma file so later frames stay consistent.

Filenames are case-sensitive on the deploy host — keep them lowercase. If a name
ends up different, that's fine, just say what it actually is.

The five scenes and their alt text already exist in
[`OnboardingAsset.tsx`](../../src/components/OnboardingAsset.tsx) — the exports
drop into those slots in order, and the hand-coded SVG stays as the fallback for
any frame not yet exported. Keep the frames faithful to the alt text (Lisbon,
"You're almost there", 1m 50s, +31%/+19%) or the alt text stops being accurate.

### Optional — logo + animation

Fernweh has no logo on the site yet. See
[`FIGMA-LOGO-PROMPT.md`](FIGMA-LOGO-PROMPT.md) for the logo system prompt —
worth running **before** frames 1 and 4, so the phone mockups can carry the real
app icon.

A logo-reveal WebM would also give Fernweh a video hero, like Aperture and Lumin
have. Note that the old shared `logoReveals.ts` registry no longer exists — each
hero is now its own component ([`ApertureHero.tsx`](../../src/components/ApertureHero.tsx),
[`LuminHero.tsx`](../../src/components/LuminHero.tsx)), so this means writing a
`FernwehHero` and branching for it in
[`projectAssets.tsx`](../../src/components/projectAssets.tsx). You'd need
`fernweh-animation.webm` plus a poster image of the animation's **end frame**,
both on the warm off-white field rather than dark navy. Skip this on the first
pass; the five frames are what unblock the case study.
