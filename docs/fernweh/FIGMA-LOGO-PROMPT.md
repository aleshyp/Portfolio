# Fernweh — logo Figma prompt

Run this **after** prompt 0 (the design theme) in `FIGMA-PROMPT.md`, so the logo
inherits the same palette and type. The logo then feeds back into frames 1–5 —
it should appear in the phone mockups' app header.

**The constraint that matters:** these marks get hand-transcribed into React SVG.
Northwind's mark is two triangles and a rounded rect, which is why it reads
correctly at 36px inside `MarketingAsset.tsx`. A mark with gradients, blurs,
strokes-converted-to-outlines, or 40 nodes does not survive that trip. Design for
**under ~8 vector nodes, flat fills, no effects.**

That constraint is not a concession — it's aligned with where identity design
actually is in 2026. The thing that changed is *scope*: a single static mark is
no longer the deliverable. What's expected now is a small **adaptive system** —
a set of rules for how one mark behaves across sizes, surfaces, and light/dark.
The prompt below asks for that system, and every piece of it stays inside the
node budget.

Two 2026 notes worth holding while you generate:

- **Warm minimalism, not cold minimalism.** The 2010s sterile-geometric-sans look
  now reads as dated and generic. The correction is not maximalism here — it's
  keeping the simple form but giving it one human detail: an asymmetry, a
  slightly organic curve, an optical adjustment that a template wouldn't make.
- **Skip the trends that break transcription.** Atmospheric gradients, soft-3D
  and clay icons, chrome retro-futurism, and hand-drawn brushwork are all real
  2026 directions — and all of them are wrong for this project, because none of
  them survive being hand-copied into flat SVG paths. Distinctive *geometry* is
  what carries this mark, not surface treatment.

---

## The prompt

Design an **adaptive logo system for Fernweh**, a trip-planning mobile app, on a
1600×900 presentation frame using the established Fernweh theme.

*Fernweh* is a German word for the ache to be somewhere far away — the opposite
of homesickness. The mark should feel like **calm forward motion**, not tourism.
No globes, no pins, no paper airplanes, no compass roses, no suitcases, no
airplane swooshes, no sunsets over waves. These are the exact clichés that make
travel brands interchangeable.

**The mark.** A single geometric symbol that works in a 32×32 rounded-square
tile — an app icon. Build it from **simple flat shapes only**: triangles,
circles, arcs, rectangles. No gradients, no shadows, no strokes, no more than
about eight shapes total. It has to stay legible at 24px. Think of a horizon, a
path, a rising line, or a distant peak reduced to its simplest possible form.

Give it **one deliberate imperfection** — an asymmetry, an off-center weight, a
curve that isn't a perfect arc. Something a logo generator wouldn't produce. A
mark that is only clean is a mark that is forgettable; distinctiveness is what
makes it memorable, not polish.

**The wordmark.** "Fernweh" set in the theme's sans, tuned for a logo — tighter
letterspacing, a considered weight. Not just the body font typed out. Consider
one custom letterform adjustment (a modified terminal, a tightened junction) so
the wordmark isn't purely off-the-shelf type.

Lay the frame out showing:

1. **The full lockup** — mark + wordmark, horizontal, large.
2. **The mark alone**, in its rounded-square tile, amber on off-white.
3. **A one-color version** — the whole lockup in a single flat navy, no tile.
   This is the version that proves the mark works.
4. **A responsive size ramp** — the mark at 96px, 48px, and 24px, and a 16px
   favicon. Show what **drops out** at each step: the full lockup at large size,
   mark-plus-wordmark at medium, mark alone small, and the most reduced possible
   form at 16px. This is the adaptive-system rule, made visible.
5. **Light and dark pairing** — the lockup on the warm off-white `#FAF7F4` and
   again on the deep navy `#0F172A`. If the amber needs to shift value to hold
   contrast on dark, show the adjusted version rather than assuming one color
   works on both.
6. **Clear space and don'ts** — a minimum-margin diagram, plus two or three
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
text editor — if it isn't roughly as short as Northwind's, it's too complex to
transcribe. Northwind's is four lines:

```svg
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="32" height="32" rx="8" fill="#22D3EE"/>
<path d="M16 6.5L20.1136 13.625H11.8864L16 6.5Z" fill="black"/>
<path opacity="0.4" d="M16 25.5L11.8864 18.375H20.1136L16 25.5Z" fill="black"/>
</svg>
```

That is the whole budget. Flat fills, one opacity value, no defs.

The PNG frame is the presentation artifact and can be added to the case-study
gallery as a sixth scene.

---

## What happens to these

Two different jobs, worth knowing so you export the right thing:

- **`logo-mark.svg` becomes code.** Its path geometry gets transcribed into a
  `Wordmark` helper inside `OnboardingAsset.tsx`, exactly as Northwind's mark
  was — see the comment at [`MarketingAsset.tsx:98-104`](../../src/components/MarketingAsset.tsx#L98-L104),
  which scales the exported 32×32 tile geometry ×1.125 onto a 36×36 scene tile.
  That's why node count and flat fills matter more than visual richness.
- **The lockup shows up in the frames.** Once the logo exists, regenerate or
  touch up frames 1 and 4 so the phone mockups carry the real app icon and
  header. A case study whose UI has no logo in it reads as unfinished.

### If you want a video hero

Aperture and Lumin each open on a WebM logo-reveal
([`ApertureHero.tsx`](../../src/components/ApertureHero.tsx),
[`LuminHero.tsx`](../../src/components/LuminHero.tsx)); the rest of the projects
open on a static scene 0. There is **no longer a shared `logoReveals.ts`
registry** — that file no longer exists, and each hero is its own component with
its own poster image. Adding a Fernweh reveal means writing a `FernwehHero`
alongside those two and branching for it in
[`projectAssets.tsx`](../../src/components/projectAssets.tsx), not adding a
config entry. Treat it as optional and separate from the five frames.

If you do build one, note that Fernweh's field is the warm off-white `#FAF7F4`,
not the dark navy Aperture resolves on — the poster frame and the video's own
background both need to match it, or the hero will flash.
