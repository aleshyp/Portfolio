# Portfolio audit — 2026-10-14

Top-to-bottom review of the site against [portfolio-checklist.md](portfolio-checklist.md)
(IDs in brackets), plus the Review Pass from `design-guidelines` and the repo's
own test gates. Reviewed against a production build on :3000, at 1440px and
390px, in light and dark.

## Status (updated 2026-10-14, issue #42)

| # | Finding | Status |
|---|---|---|
| 1 | Freelance CTAs | **Fixed.** Contact, the form and the case-study CTA now address hiring managers |
| 2 | One real project, no research | **Open, needs you.** Run the 5-person Lumin test; decide on a text-only Acellus write-up |
| 3 | Behance | **Fixed.** Removed from site and résumé |
| 4 | Cropped first card | **Fixed.** New split light/dark capture (`scripts/capture-portfolio-card.mjs`) |
| 5 | Hero fills the fold | **Fixed.** Tighter spacing, scroll hint removed; Work now starts in the first screen |
| 6 | Card blurbs | **Fixed.** Rewritten as hooks |
| 7 | Résumé in nav/footer | **Fixed.** Header (desktop and mobile menu), footer, contact, case-study CTA |
| 8 | No captions | **Fixed.** Every scene has a visible caption |
| 9 | Logo-video covers | **Kept, deliberately.** They're motion work; captioned instead. Also fixed: the Lumin video carried the homepage's alt text, and the homepage screen itself never appeared anywhere. It's now in "More screens" |
| 10 | About | **Copy fixed** (accurate role history, how-I-work paragraph, real stats). **Photo needs you** |
| 11 | Timeline | **Partly fixed.** Hero no longer says "since 2014"; 2012 vs 2014 needs you to confirm |
| 12 | Testimonials | **Open, needs you** |
| 13 | Education card | **Fixed.** Grouped, shared with the résumé |
| 14 | Esports entries | Left as is (judgment call) |
| 15 | Copy email | **Fixed** |
| 16 | Stray Aperture downloads | **Fixed.** Lazy `<img>`; verified 0 downloads on home |
| 17 | Hero raw emerald | **Fixed.** Uses brand tokens |

Also corrected while fixing #1: the site said you *own* and *created* the design
system. It now says you helped create it and help maintain it, matching your
role. The Experience title is now "UX/UI Designer & Front-End Developer", and
the graphic and motion years are stated.

## Summary

The technical side is in very good shape and the writing is unusually honest:
every study has a "What I did" list, an AI disclosure, a concept badge where it
applies, and a "What I'd change" section. Most portfolios are missing all of
those.

The gaps are strategic, not technical:

1. The site talks to **freelance clients** in its calls to action, while the
   hero says it's looking for **product design roles**.
2. There's **one real project**, and no user research or testing appears
   anywhere. For product UX roles, that's the biggest evidence gap.
3. A few **first-impression details** undercut an otherwise polished site:
   the cropped first-card thumbnail, the Behance profile, and the portrait.

## Automated gates — all passing

| Check | Result |
|---|---|
| ESLint | clean |
| Unit tests | 65/65 |
| Playwright (E2E, axe WCAG 2.2 AA, responsive, SEO) | 131 passed, 1 skipped |
| Lighthouse (prod build) | Perf 94 · A11y 100 · BP 100 · SEO 100 · CLS 0 · TBT 9ms |
| Live contact form | Not in demo mode (key is set in production) |

Covers Q1–Q5 and Q7. Nothing to fix here.

---

## P0 — Fix first (highest impact on getting interviews)

### 1. The calls to action address freelance clients, not hiring managers [H2, H7, A3]
The hero badge says "Open to product design roles", but everywhere a reader is
asked to act, the copy is written for someone commissioning a project:

- Contact heading: "Got something you need built?" and "I have room for a
  couple more projects right now" — `src/components/sections/Contact.tsx`
- Form field "Project details", placeholder "What you need, and when you need it
  by." — same file
- Case-study CTA: "Want something like this for your project? I take on a
  couple of projects at a time… Start a project" — `src/components/CaseStudyCta.tsx`
- Behance profile headline: "Available for Freelance" (see #3)

A hiring manager who reaches the end of a case study is offered a freelance
engagement. Rewrite for the target reader, for example "Hiring a product
designer?" or "Let's talk about the role", a "Message" field, and "Get in
touch" / "Email me" buttons, with the résumé as a second action.

### 2. Only one real project, and no research or testing anywhere [T1, C7]
"This Site" is the only non-concept study, and it's an engineering-led story
about this codebase. The three concept studies are honest about having no users.
For product UX roles, reviewers look for evidence that you've learned something
from real people. Options, roughly in order of payoff:

- **Run the test the Lumin study already promises.** Its last block says "The
  next step is a five-person test of this route, starting at the empty search."
  Do it (a clickable Figma prototype plus five remote sessions is a weekend),
  then add a block covering what broke, what you changed, and the before/after.
  That turns the strongest product study into real evidence and shows iteration
  [C7, C10].
- **Describe the day job at the level you're allowed to.** Memory says the
  Acellus work is classified (only sprints and GitLab are OK to mention). If even
  a text-only overview is permitted (scope, team, how the design system is used,
  no screens), it would be the most credible item on the site [T2]. Needs your
  call, or your employer's.
- **Consider demoting Aperture** (pure brand work) to a smaller "Other work"
  row, so two deep product studies lead [C-size: 2–4 strong beats 4 mixed].

### 3. The Behance link works against the positioning [A4, T5]
The linked profile (behance.net/aleshyp) shows "Graphic Designer – UX/UI
Designer · Available for Freelance", says "designing for 5 years", and shows
esports social graphics (SK8ER GANG, Social Media, Noxious Gaming). That
contradicts the site's "13+ years" and its product-design focus. Either remove
it from Contact and Footer (`site.socials.behance`) or refresh the profile
first.

### 4. The first card's thumbnail is cropped [H3, Q7]
The "This Site" card (the first thing in the Work grid) shows its token-layers
scene clipped at the left edge ("ive token layers") with the next panel cut off
mid-row. This happens at both 1440px and 390px. The scene is built for the wide
case-study layout and doesn't fit the 16:9 card well. Give it a purpose-made
card frame, like the other three cards, or pick a scene that composes at card
size. See the `renderProjectScene` thumbnail selection in
`src/components/projectAssets.tsx`.

---

## P1 — Strong improvements

### 5. The hero fills the whole first screen [H1, H3]
At 1440×900 no work is visible until the visitor scrolls. The hero copy itself
is good: a specific title, a clear claim, two CTAs. But the large top padding,
the "Designing since 2014" line and the scroll-hint button push the Work grid
fully below the fold. Tighten the spacing so the top of the first cards shows.

### 6. Card blurbs describe the project rather than hook the reader [H3, H4]
Card text answers "what is it", not "why should I open this". Lead with the
strongest true fact, for example:
- This Site: "An accessibility and Lighthouse gate that fails the build if a
  score slips."
- Lumin: "Ten screens, zero accounts needed to browse."
Titles are already good: they name a problem or outcome, not just a product.

### 7. Résumé isn't in the nav or footer [H8, A2]
It's only linked from the Experience section. Add it to `site.nav` (or as a nav
button) and to the footer link row.

### 8. Case-study visuals have no captions [C6]
`/work/learning-platform-ui` has 10 images and zero captions. The page is
~15,000px tall, and the "More screens" gallery at the end is six uncaptioned
screens after the narrative has finished. Add a one-line caption to each scene
saying what to notice, and either caption the extras or trim them.

### 9. Concept-study covers are logo animations, not the product [C8, H3]
For Lumin and Northwind, the first visual a reader sees is a logo reveal. For a
product study, the strongest product screen should come first. Lumin's course
page, already used as its card thumbnail, would work. Keep the logo animation
for Aperture, where the logo *is* the work.

### 10. About section [A1]
- **Portrait:** a casual selfie with a second person half-cropped at the right
  edge. Use a solo photo where you're the clear subject. This also avoids
  publishing someone else's face.
- **Copy** is all background (started at 10, hired in 2022). It's missing the
  "how I work" paragraph reviewers look for: how you work with PMs and
  engineers, how you make decisions, and how you use AI. Two or three sentences
  is enough.
- The "1 — Design system, owned end to end" stat is weak as a number. Replace
  it with something with scale, or with a fact rather than a count.

### 11. The career timeline doesn't agree with itself [T5]
- Hero: "Designing since 2014"
- About: "Thirteen years in", "picked up graphic design at 10", stat "13+"
- Education: "Self-taught Designer – 13+ years · Since 2012"
- Experience: Freelance "2014 – 2022"
- Behance: "designing for 5 years"

Pick one origin year and derive the rest from it. Interviewers do notice.

### 12. No social proof [H6]
No testimonials anywhere. A one- or two-line quote from a manager or engineer
you've worked with (a quote about *you*, which shouldn't touch the classified
work) is one of the cheapest credibility boosts available. Label it with the
person's name and role.

---

## P2 — Polish

13. **Education card:** five Coursera security certificates take as much room
    as the work history. The explanation for them is good; keep it, but group
    them into one line, as the résumé builder already does
    (`scripts/build-resume.mjs`) [A4].
14. **Experience:** four of five entries are esports or graphic design.
    Consider folding Noxious, Buzzkill and Animosity into one "Earlier: brand
    and social design for esports orgs" entry, so the product role dominates.
15. **Copy-email button** next to the mailto in Contact and Footer [H7].
16. **Homepage downloads ~850 KB of Aperture PNGs it never shows.** The browser
    logs "preloaded but not used" warnings for the four `@2x` frames. This is
    probably Next prefetching `/work/brand-identity-system` as its card scrolls
    into view, pulling in that page's image preloads. Worth confirming and
    trimming, since mobile reviewers pay for it.
17. **Hero backdrop** uses raw `bg-emerald-100/60` / `dark:bg-emerald-500/10`
    rather than `brand-*` tokens (`Hero.tsx`), a small deviation from
    DESIGN.md.

## Already good — don't regress

- Specific role and value proposition in the hero [H1]; outcome-style card
  titles [H4]; role and concept labels on cards [H3].
- Case-study header: client, role, year, "What I did", visible concept badge,
  AI disclosure [C1, C11, T1, T4].
- Decision narratives that name the rejected alternative, and an honest "What
  I'd change" in every study [C3, C9, C10].
- Concept figures explicitly labeled as design properties, not results [T3].
  Northwind's in-mockup "+22%" is disclosed in the study text.
- End-of-study CTA plus a next-project link [C9]; wording to fix per #1.
- Accessibility, performance, SEO and responsive behavior all gated in CI
  [Q1–Q5, Q7].
