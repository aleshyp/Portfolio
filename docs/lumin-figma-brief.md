# Figma-Agent Brief — Lumin Online-Learning Platform

A ready-to-paste brief for a Figma AI agent (or a designer) to produce the
**Lumin** online-learning-platform case-study assets. Lumin is a *fictional
client* in this portfolio (`src/data/projects.ts`, slug `learning-platform-ui`)
— an EdTech product whose UI is designed to keep students moving through lessons
without friction. The live site already ships hand-built SVG stand-ins for these
product screens (`src/components/LearningAsset.tsx`); this brief exists to upgrade
them to polished, exportable Figma artwork **without drifting from the
established identity**. Match the palette, wordmark, and type below exactly.

---

## Paste-into-agent prompt

> You are a senior product designer. Design the product-UI deliverables for a
> fictional online-learning platform called **Lumin** — an EdTech app whose
> whole job is to keep students **focused and moving** through a course. The
> guiding principle: on every screen the student always knows *where they are,
> what's next, and how far they have to go*, while the interface steps back so
> the lesson content leads. The brand is calm, encouraging, and low-noise —
> never gamified-to-distraction. Design **web-app screens**, work in **light and
> dark**, and hit **WCAG AA** contrast on every text/background pair. Produce
> everything as an organized Figma file with named frames, components,
> auto-layout, and export-ready artboards at **1600×900 (16:9)**.
>
> **Brand mark:** a small **four-point spark** (a "lumin/lightbulb" idea) inside
> a soft rounded-square tile — a violet tile with a warm gold spark. It sits left
> of the **"Lumin"** wordmark. Keep the mark simple enough to read at favicon
> size.
>
> **Palette (use these exact values):**
> | Token | Hex | Role |
> |-------|-----|------|
> | Ink | `#1C1633` | Deep indigo; primary text |
> | Violet | `#6D4AED` | Primary brand |
> | Violet Deep | `#4C2CB8` | Violet shade for gradients |
> | Lilac | `#A78BFA` | Secondary accent / muted marks |
> | Gold | `#F5A524` | "Keep going" accent — CTAs, scrubber fill |
> | Gold Soft | `#FBCB6B` | Gold tint / spark mark |
> | Mint | `#22C55E` | Completion / "done" status |
> | Mint Soft | `#DCFCE7` | Mint tint |
> | Mist | `#F3F0FF` | Page background tint |
> | Cloud | `#F7F6FC` | Panel / sidebar fill |
> | Line | `#E4DFF3` | Hairline borders |
> | Slate | `#6B6485` | Muted body text |
>
> **Type:** Display/headings **Sora** (700–800, tight tracking). Body/labels
> **Inter**. Primary buttons are **gold** pills (the "keep going" action);
> secondary buttons are outline. Completed/done states use **mint** (a green
> check); the current step uses **violet**.
>
> **Deliverables (one 1600×900 frame each, named as listed):**
> 1. **`01-lesson-view`** — The calm lesson screen: a left **course rail**
>    (Lumin wordmark, "INTRO TO DESIGN", five lesson rows with mint checks for
>    done, a violet dot for the active row, empty rings for upcoming), a lesson
>    eyebrow + Sora title, a large **violet video player** (center play button,
>    a scrubber with a gold-filled progress portion), an **always-visible
>    course-progress bar** ("Course progress 45%"), and one obvious gold
>    **"Next lesson →"** button with an "Up next" hint. This is the hero/cover.
> 2. **`02-course-map`** — On a mist background, "COURSE MAP" over the headline
>    **"Always know where you are."** A horizontal **five-node path** (Welcome,
>    Core concepts, Your first build, Going deeper, Ship it) connected by a track
>    that is mint up to the current node; done nodes are mint checks, the current
>    node is a violet dot with a soft halo and a **"You're here"** caption,
>    upcoming nodes are outline rings.
> 3. **`03-progress`** — On a cloud background, "YOUR PROGRESS" over
>    **"The next step is obvious."** Two cards: a **circular progress ring** card
>    (violet arc at 60%, big Sora "60%" in the center, "of the course done"), and
>    a **"Continue where you left off"** card with a lesson thumbnail (mini play
>    button), the lesson title + "Lesson 3 · 6 min left", a module progress bar,
>    and a gold **"Continue lesson →"** button.
> 4. **`04-lesson-types`** — On paper, "LESSON PATTERNS" over **"One rhythm,
>    every format."** **Three consistent cards** sharing one layout — a media
>    area, a mist tag pill, a Sora title, and a slate subline ("Same layout, same
>    controls."): **Watch** (VIDEO, play-button media), **Read** (READING, three
>    lilac text lines), **Practice** (QUIZ, three radio options with the middle
>    one selected in violet).
> 5. **`05-completion`** — On mist, a celebratory **violet-gradient completion
>    card**: a mint check badge, "LESSON COMPLETE", the headline **"Nice — you're
>    on a roll."**, a "3 of 5 modules done · keep the streak going." subline, and
>    a gold "Next lesson →" button. Below it, a **three-stat result row** in big
>    violet Sora on paper cards: **+29%** lesson completion · **−40%** navigation
>    steps · **84** SUS usability.
>
> **Rules:** Build the **wordmark**, the **spark mark**, the **button**
> (variants: filled-gold / outline), the **progress bar**, and a **lesson-status
> dot** (done / active / todo) as reusable components. Use auto-layout for the
> course rail, the value/lesson cards, and the stat row. Gold is the *only* warm
> color — reserve it for the primary "keep going" action; mint is *only* for
> completion. Keep the interface quiet: generous whitespace, one clear next
> action per screen, AA contrast for all text on its background. Export each
> frame as PNG @2x and SVG. Do not introduce colors outside the palette.

---

## Extra deliverables worth requesting (beyond what the site shows)

If you want the case study to feel even fuller, ask the agent for:

- **A true dark-mode variant** of the lesson view and progress screens (ink
  backgrounds, lightened text) — the site wraps these on a dark page, so a real
  dark comp sells the "works in light and dark" claim.
- **Real-world mockups** — the app open in a laptop browser, the lesson view on a
  tablet a student is holding, an OG/social share card. *(Photographic mockups
  are the main thing the in-repo SVGs can't do — this is where Figma earns its
  keep.)*
- **A component/spec sheet** — the button, progress bar, lesson-status dot, and
  card tokens with spacing and states, to back up the "consistent patterns for
  video, reading, and assessment" story that is central to this case study.
- **An empty / first-run state** — the course rail before any lesson is done, so
  the "always know where you are" claim holds at 0% too.
- **Favicon / app-icon grid** — the spark mark at 16 / 32 / 64 / 512 px.

## Wiring the Figma exports back into the site

Each frame maps 1:1 to a scene in `src/components/LearningAsset.tsx` and a slot
in the case study (`src/app/work/[slug]/page.tsx`):

| Figma frame | Current SVG scene | Case-study slot |
|-------------|-------------------|-----------------|
| `01-lesson-view` | `lesson-view` | Hero / cover |
| `02-course-map` | `course-map` | Block 01 "The problem" |
| `03-progress` | `progress` | Block 02 "Design goals" |
| `04-lesson-types` | `lesson-types` | Block 03 "The solution" |
| `05-completion` | `completion` | Block 04 "Outcome" |

(Unlike Northwind, Lumin has `gallery: 4` and a full five-scene set — the hero
cover plus one visual after each of the four content blocks.)

To swap an SVG scene for a Figma PNG, replace the `<LearningAsset>` with a
`next/image` `<Image>` pointing at the export, keeping the **same `alt` text**
(already written in `learningScenes`) and the `aspect-[16/9] rounded-4xl`
classes. Export at 1600×900 (or 3200×1800 @2x) so it stays crisp on retina.
