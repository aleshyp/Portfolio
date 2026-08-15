# Fernweh — logo Figma prompt

Run this **after** prompt 0 (the design theme) in `FIGMA-PROMPT.md`, so the logo
inherits the same palette and type. The logo then feeds back into frames 1–5 —
it should appear in the phone mockups' app header.

**The constraint that matters:** these marks get hand-transcribed into React SVG.
Northwind's mark is two triangles and a rounded rect, which is why it reads
correctly at 36px inside `MarketingAsset.tsx`. A mark with gradients, blurs,
strokes-converted-to-outlines, or 40 nodes does not survive that trip. Design for
**under ~8 vector nodes, flat fills, no effects.**

---

## The prompt

Design a **logo system for Fernweh**, a trip-planning mobile app, on a 1600×900
presentation frame using the established Fernweh theme.

*Fernweh* is a German word for the ache to be somewhere far away — the opposite
of homesickness. The mark should feel like **calm forward motion**, not tourism.
No globes, no pins, no paper airplanes, no compass roses, no suitcases.

**The mark.** A single geometric symbol that works in a 32×32 rounded-square
tile — an app icon. Build it from **simple flat shapes only**: triangles,
circles, arcs, rectangles. No gradients, no shadows, no strokes, no more than
about eight shapes total. It has to stay legible at 24px. Think of a horizon, a
path, a rising line, or a distant peak reduced to its simplest possible form.

**The wordmark.** "Fernweh" set in the theme's sans, tuned for a logo — tighter
letterspacing, a considered weight. Not just the body font typed out.

Lay the frame out showing:

1. **The full lockup** — mark + wordmark, horizontal, large.
2. **The mark alone**, in its rounded-square tile, amber on off-white.
3. **A one-color version** — the whole lockup in a single flat navy, no tile.
   This is the version that proves the mark works.
4. **A size ramp** — the mark at 96px, 48px, and 24px, so legibility at small
   size is visible rather than assumed.
5. **Clear space and don'ts** — a minimum-margin diagram, plus two or three
   "don't" examples (don't stretch, don't recolor, don't add effects).

Keep it restrained. A portfolio reviewer should be able to describe this mark in
one sentence.

---

## Export drop zone

Export into `public/work/fernweh/` with these filenames:

| Filename | What | Format |
|---|---|---|
| `logo-full.svg` | Full lockup (mark + wordmark) | SVG |
| `logo-mark.svg` | Mark only, in its 32×32 tile | SVG |
| `logo-mono.svg` | One-color lockup | SVG |
| `06-logo-system.png` | The whole presentation frame | PNG @2x |

**SVG for the three logo files** — unlike the case-study frames (which are PNG
because AI-generated frames with nested effects don't vectorize reliably), a
logo *must* be clean vector. Before exporting: flatten to filled paths, outline
any strokes, and remove empty groups and clip paths. Open `logo-mark.svg` in a
text editor — if it isn't roughly as short as Northwind's five lines, it's too
complex to transcribe.

The PNG frame is the presentation artifact and can be added to the case-study
gallery as a sixth scene.

---

## What happens to these

Two different jobs, worth knowing so you export the right thing:

- **`logo-mark.svg` becomes code.** Its path geometry gets transcribed into a
  `Wordmark` helper inside `OnboardingAsset.tsx`, exactly as Northwind's mark
  was — see the comment at `MarketingAsset.tsx:98-104`. That's why node count
  and flat fills matter more than visual richness.
- **The lockup shows up in the frames.** Once the logo exists, regenerate or
  touch up frames 1 and 4 so the phone mockups carry the real app icon and
  header. A case study whose UI has no logo in it reads as unfinished.

If you also produce a logo-reveal animation, that path needs a `backdrop` entry
in `logoReveals.ts` — Fernweh's field is the warm off-white `#FAF7F4`, not the
dark navy Aperture and Northwind resolve on.
