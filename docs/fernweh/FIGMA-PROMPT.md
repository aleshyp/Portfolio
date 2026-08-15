# Fernweh — Figma prompts

**Run prompt 0 first.** It establishes the visual system. Every frame prompt
after it is short *because* it inherits that system — run them in the same Figma
file / same chat so the style carries. If a frame comes back off-style, re-paste
the "House style" recap at the bottom of this file with it.

Export per the drop-zone table at the end.

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
- **Type.** A geometric or humanist sans (Inter, Sora, or similar). Show the
  scale: a big frame headline, a section heading, body text, and a small
  all-caps label. Nothing in the deck should be smaller than ~14px at 1600px
  wide.
- **Phone frame.** A single reusable device mockup: simple rounded rectangle,
  flat, straight-on, no glossy 3D bezel, no hand holding it, no perspective
  tilt. Show it empty as the template.
- **Annotation style.** A callout label with a leader line, and a small
  all-caps step/stat label — the two ways these frames will point at things.
- **Spacing.** Generous negative space is the point. Show the margin and the
  gap rhythm.

This is the system the next five frames all use. Keep it minimal and usable —
a style sheet, not a poster.

---

## 1 — First win  → `01-first-win.png`

Using the Fernweh theme, a 1600×900 hero frame.

Large headline **"One saved trip. Under two minutes."** on the left. On the
right, one phone showing a **saved Lisbon trip**: a destination card, a green
confirmation check, and a "Plan day one" button.

This is the frame that sells the project — calm, lots of air, nothing competing
with the headline. The green check is the *only* use of green in the whole deck.

---

## 2 — Before / after  → `02-before-after.png`

Using the Fernweh theme, a 1600×900 comparison frame.

**Left:** the old **nine-step setup wizard** — nine small labelled steps
(notifications, location, profile, interests, and so on) with a visible drop-off
marker showing most users never finish.

**Right:** the rebuilt **three-step flow**, ending at a saved trip, labelled
**1m 50s**.

The contrast in visual weight *is* the argument: make the left side feel long
and heavy, the right side short and light.

---

## 3 — The shortest path  → `03-shortest-path.png`

Using the Fernweh theme, a 1600×900 critical-path diagram.

Three steps on a single horizontal track: **"Where to?" → "How long?" → "Trip
saved."**

Below the track, three items branch *away* — notifications, interests, invites
— labelled **deferred, not deleted**. The branches must read as "moved later,"
never as "removed."

---

## 4 — One job per step  → `04-one-job.png`

Using the Fernweh theme, a 1600×900 frame with three phone screens in a row,
each doing exactly one thing:

1. A **city search**.
2. A **trip-length picker** with a progress bar reading **"You're almost there."**
3. A **notification permission ask** that explains it will watch **Lisbon flight
   prices** — annotated as arriving *after* the trip exists, not on launch.

Small callout labels with leader lines pointing at the microcopy in each.

---

## 5 — Outcome  → `05-activation.png`

Using the Fernweh theme, a 1600×900 outcome frame.

A **funnel** comparing the old and rebuilt flows by share of users reaching
their first win. Below it, three stat cards: **+31% activation**, **+19% day-7
retention**, **1m 50s to first win**.

Data-forward and confident, but still calm — same whitespace as the rest.

---

## House style (re-paste if a frame drifts)

1600×900 landscape. Warm off-white `#FAF7F4`, slate-navy `#0F172A`, amber
accent `#C2703A`/`#E08A4C`, green `#16A34A` only for the saved-trip check.
Geometric/humanist sans, big headline + small all-caps labels, nothing under
~14px. Flat straight-on phone frames, no bezels, no hands, no tilt. Generous
whitespace. Mobile UI shown *inside* a landscape composition — never a phone
screenshot cropped to widescreen. All five frames must read as one deck.

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

**Export settings:** PNG @2x (so 3200×1800). Same as Aperture — AI-generated
frames with nested vectors and effects render more reliably as PNG than as raw
SVG. Claude re-encodes these to WebP at 2400w before wiring them in (that's what
cut Northwind from 6.2 MB to 282 KB with no visible loss).

The theme frame (prompt 0) doesn't need exporting — it's scaffolding. Keep it in
the Figma file so later frames stay consistent.

Filenames are case-sensitive on the deploy host — keep them lowercase. If a name
ends up different, that's fine, just say what it actually is.

### Optional — logo + animation

Fernweh has no logo on the site yet. If Figma produces a decent wordmark, export
`logo-full.svg` and `logo-mark.svg` and it can become a reusable component.

A logo-reveal WebM (like Aperture and Northwind have) would also give Fernweh a
video hero — `fernweh-animation.webm` plus `logo-anim-poster.jpg` (the
animation's **end frame**, used as the Work-grid card thumbnail). That path also
needs a `backdrop` color in `logoReveals.ts` — the animation's own field color,
which for Fernweh would be the warm off-white, not the dark navy Aperture and
Northwind use. Skip this on the first pass; the five frames are what unblock the
case study.
