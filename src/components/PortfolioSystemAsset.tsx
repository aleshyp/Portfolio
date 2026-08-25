import { cn } from "@/lib/utils";

/**
 * "This Site" — case-study assets for the portfolio's own design system.
 *
 * Deliberately UNLIKE the other asset sets, in two ways.
 *
 * 1. Aperture, Northwind and Lumin are fictional clients, so each carries its
 *    own invented identity kept separate from the portfolio's brand. Here the
 *    portfolio IS the subject, so these scenes use the REAL emerald/ink palette
 *    and the REAL values from the codebase — that's the whole point of the study.
 *
 * 2. These are RESPONSIVE DOM, not fixed-viewBox SVG artboards. The other sets
 *    are pictures of someone else's work, where a fixed 1600x900 board is an
 *    honest representation of a delivered file. This study argues that the site
 *    ships a responsive, theme-aware, accessible system — so drawing it as a
 *    board that cannot reflow was the medium contradicting the message. It also
 *    failed concretely: fitting a 1600x900 board with 17-22px labels into a
 *    390px phone renders its body text near 4.6px, so the scenes had to be put
 *    in a horizontal scroller and read by dragging them sideways.
 *
 *    Built as DOM they simply reflow — rows stack, grids drop to one column, and
 *    every figure stays at a real, selectable, zoomable size at every width. No
 *    scroller, and no second set of hand-placed coordinates to keep in sync.
 *
 * Every figure drawn here is verifiable against the repo:
 *   - token values / count  → src/app/globals.css (@theme + .dark); the count is
 *                             UNIQUE --color-* names, so the .dark re-points of
 *                             fg/surface tokens are not counted twice
 *   - contrast ratios       → computed from the hex pairs in DESIGN.md §1.2
 *   - budgets               → scripts/lh-gate.mjs (CATEGORY_BUDGET, CWV_BUDGET,
 *                             LCP_RATCHET — LCP is gated by the ratchet, NOT the
 *                             2.5s CWV target; don't redraw it as "< 2.5s")
 *   - scanned routes        → e2e/a11y.spec.ts
 * If any of those change, update these scenes — the study makes falsifiable
 * claims and a stale diagram would turn one into a false one.
 *
 * ── Two color layers in this file ──────────────────────────────────────────
 * The scenes make falsifiable claims about literal hex values, so those values
 * must render EXACTLY as documented regardless of the viewer's theme. That rule
 * applies to the SPECIMEN — the thing each scene is a picture of. It does NOT
 * apply to the frame around it.
 *
 *   SPECIMEN  → literal hex from `P` below, applied as an inline `style`.
 *               Fixed in both themes, because the scene asserts these values:
 *               the light/dark comparison panels in ThemeSplit, the swatch rows
 *               in Layers, the ratio bars in Contrast. Theming these would make
 *               the claims false. Inline style rather than a utility is the
 *               point — it is a VALUE being exhibited, not a choice being made.
 *   CHROME    → ordinary theme tokens as Tailwind utilities (`text-fg-muted`,
 *               `border-border-subtle`…). The canvas, card fills, hairlines and
 *               label text. Follows the theme, asserts nothing.
 *
 * Using real utilities for the chrome is now self-demonstrating: the scene that
 * explains `text-fg-muted` is itself rendered with `text-fg-muted`. The old
 * `--asset-*` variables existed only because raw SVG `fill=` attributes cannot
 * reference Tailwind tokens; DOM can, so they are gone from globals.css.
 *
 * When adding to a scene, ask whether the color is part of the CLAIM. If yes,
 * use `P` inline. If it is just the frame around the claim, use a token utility.
 *
 * Server component: no hooks, no client boundary, no flash of the wrong palette.
 */

// The portfolio's real palette, mirrored from globals.css. SPECIMEN ONLY — see
// the note above before reaching for one of these for anything structural.
const P = {
  ink: "#0b1220", // --color-ink        (dark bg / light text)
  inkSoft: "#1e293b", // --color-ink-soft
  fgMuted: "#475569", // --color-fg-muted   (light)
  fgFaint: "#64748b", // --color-fg-faint   (light)
  darkFg: "#f1f5f9", // fg in dark
  darkFgSoft: "#e2e8f0", // fg-soft in dark
  darkFgMuted: "#94a3b8", // fg-muted in dark
  brand700: "#047857", // primary CTA
  brand600: "#059669",
  brand500: "#10b981",
  brand400: "#34d399",
  brand300: "#6ee7b7",
  brand100: "#d1fae5", // border-subtle (light)
  brand50: "#ecfdf5",
  paper: "#ffffff",
  cloud: "#f8faf9", // surface-raised (light)
  line: "#e2e8f0",
  amber: "#f59e0b", // accent
  red: "#dc2626",
};

type Scene = "layers" | "theme-split" | "contrast" | "gates";

type PortfolioSystemAssetProps = {
  scene: Scene;
  className?: string;
  /** Accessible description of the deliverable. */
  alt: string;
};

/**
 * Shared artboard shell.
 *
 * `@container` queries, not viewport breakpoints, do the reflowing. These scenes
 * are not always full-bleed — the same component renders in the case-study
 * column and could later sit in a narrower slot — so a `sm:` breakpoint would
 * lay out for the WINDOW while sitting in a 380px box. `@md` lays out for the
 * box it is actually in. That is the same argument the study is making.
 */
function Board({ children }: { children: React.ReactNode }) {
  return (
    // No ground, no padding, no rounding — on ANY scene.
    //
    // Every scene now starts at the same column edge as the case-study prose
    // around it, which is the point: these are sections of the page, not
    // pictures sitting on it. `gates` was the last holdout, keeping an ink
    // ground because it depicts build output. But a padded ground makes its
    // content narrower than everything else on the page (302px against 342px
    // at a 400px viewport), and that mismatch reads as a stray card. Its inner
    // tiles carry their own ink fills, so it stays legible without one.
    <div className="@container h-full w-full">{children}</div>
  );
}

/** Scene title + monospace subtitle. `onDark` for the always-ink board. */
function Heading({
  title,
  meta,
  onDark = false,
}: {
  title: string;
  meta: string;
  onDark?: boolean;
}) {
  return (
    <header className="mb-5 @md:mb-7">
      <h3
        className={cn(
          "font-display text-lg font-bold tracking-tight @md:text-2xl @xl:text-3xl",
          !onDark && "text-fg",
        )}
        style={onDark ? { color: P.darkFg } : undefined}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-1 font-mono text-[11px] @md:text-sm",
          !onDark && "text-fg-muted",
        )}
        style={onDark ? { color: P.darkFgMuted } : undefined}
      >
        {meta}
      </p>
    </header>
  );
}

/** Scene 1 — the five token layers, and which ones flip with the theme. */
function Layers() {
  const rows = [
    {
      name: "fg",
      desc: "text only",
      flips: true,
      swatches: [P.ink, P.inkSoft, P.fgMuted, P.fgFaint],
    },
    {
      name: "ink",
      desc: "backgrounds only",
      flips: false,
      swatches: [P.ink, P.inkSoft, P.fgMuted, P.fgFaint],
    },
    {
      name: "surface",
      desc: "cards & hairlines",
      flips: true,
      swatches: [P.paper, P.cloud, P.paper, P.brand100],
    },
    {
      name: "brand",
      desc: "one hue, 50–950",
      flips: false,
      swatches: [P.brand100, P.brand400, P.brand600, P.brand700],
    },
    {
      // Fixed like `ink`: these describe "text on a dark ground", not "text in
      // dark theme", so there is nothing to re-point in .dark. Used by panels
      // that stay dark in BOTH themes (the Contact band).
      name: "on-dark",
      desc: "always-dark panels",
      flips: false,
      swatches: [P.paper, P.brand100, P.inkSoft, P.ink],
    },
  ];

  return (
    <Board>
      <Heading
        title="Five token layers"
        meta="src/app/globals.css · 35 color tokens"
      />

      <ul className="space-y-2.5 @md:space-y-3">
        {rows.map((row) => (
          <li
            key={row.name}
            className={cn(
              "rounded-2xl border border-border-subtle bg-surface p-3.5 @md:p-4",
              // Narrow: name/desc, swatches, then the pill — stacked. Wide: all
              // three on one row, which is the original board layout.
              "flex flex-col gap-3 @2xl:flex-row @2xl:items-center @2xl:gap-5",
            )}
          >
            <div className="@2xl:w-56 @2xl:shrink-0">
              <p className="font-mono text-sm font-medium text-fg @md:text-base">
                {row.name}-*
              </p>
              <p className="mt-0.5 text-xs text-fg-faint @md:text-sm">
                {row.desc}
              </p>
            </div>

            {/* Swatch FILLS are specimen — the literal token values, fixed in
                both themes. The outline is chrome: these include near-white
                values that need an edge to read as a chip rather than a hole. */}
            <div className="flex gap-2">
              {row.swatches.map((s, j) => (
                <div
                  key={j}
                  className="h-8 w-11 rounded-md ring-1 ring-border-subtle @md:h-10 @md:w-14"
                  style={{ background: s }}
                />
              ))}
            </div>

            <div className="@2xl:ml-auto @2xl:shrink-0">
              <span
                className={cn(
                  "inline-block rounded-full px-3 py-1 text-xs font-semibold @md:text-sm",
                  row.flips
                    ? "bg-brand-50 text-brand-700 ring-1 ring-brand-300 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-300/45"
                    : "bg-surface-raised text-fg-muted ring-1 ring-border-subtle",
                )}
              >
                {row.flips ? "flips in dark" : "never flips"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Board>
  );
}

/**
 * One half of the ThemeSplit comparison.
 *
 * Entirely specimen: both panels render literal hex in both themes, because the
 * two side by side ARE the argument. Theming either half would collapse the
 * comparison into two identical panels.
 */
function SpecimenPanel({
  mode,
  ground,
  heading,
  body,
  button,
  buttonFill,
  notes,
}: {
  mode: "light" | "dark";
  ground: string;
  heading: string;
  body: string;
  button: string;
  buttonFill: string;
  notes: string[];
}) {
  const onDark = mode === "dark";
  return (
    <div
      className="flex-1 rounded-2xl border border-border-subtle p-4 @md:p-6"
      style={{ background: ground }}
    >
      <p
        className="font-mono text-[11px] @md:text-xs"
        style={{ color: onDark ? P.darkFgMuted : P.fgFaint }}
      >
        {mode}
      </p>
      <p
        className="mt-3 font-display text-base font-semibold @md:text-xl"
        style={{ color: onDark ? P.darkFg : P.ink }}
      >
        {heading}
      </p>
      <p
        className="mt-1.5 text-xs @md:text-sm"
        style={{ color: onDark ? P.darkFgMuted : P.fgMuted }}
      >
        {body}
      </p>
      <p
        className="mt-3 inline-block rounded-full px-4 py-1.5 text-xs font-semibold @md:text-sm"
        style={{ background: buttonFill, color: P.paper }}
      >
        {button}
      </p>
      <div className="mt-4 space-y-1">
        {notes.map((n) => (
          <p
            key={n}
            className="font-mono text-[11px] @md:text-xs"
            style={{ color: onDark ? P.darkFgMuted : P.fgMuted }}
          >
            {n}
          </p>
        ))}
      </div>
    </div>
  );
}

/** Scene 2 — why ink and fg had to be split apart. */
function ThemeSplit() {
  return (
    <Board>
      <Heading
        title="One value, two jobs"
        meta="#0b1220 is light-mode text AND the dark-mode page background."
      />

      <div className="flex flex-col gap-3 @md:gap-4 @lg:flex-row">
        <SpecimenPanel
          mode="light"
          ground={P.paper}
          heading="Heading text"
          body="Supporting body copy sits here."
          button="Primary"
          buttonFill={P.brand700}
          notes={["text-fg → #0b1220", "bg → #ffffff", "brand-700 fill"]}
        />
        <SpecimenPanel
          mode="dark"
          ground={P.ink}
          heading="Heading text"
          body="Supporting body copy sits here."
          // brand-700 in BOTH panels, matching the real Button: its resting
          // primary fill is bg-brand-700 with no dark: override (see
          // Button.tsx). The old SVG drew this panel with brand-600, which is
          // white-on-3.76:1 — a genuine AA failure that the fixed artboard hid,
          // since axe cannot see text inside an SVG marked role="img". As real
          // DOM it was caught immediately. Fitting, given the scene two along
          // is the contrast audit that documents this exact class of bug.
          button="Primary"
          buttonFill={P.brand700}
          notes={[
            "text-fg → #f1f5f9",
            "bg → ink #0b1220",
            "same utility, no override",
          ]}
        />
      </div>

      {/* The rule. Chrome, not specimen — it states the pattern rather than
          exhibiting a value, so it follows the theme like any other UI. */}
      <div className="mt-3 grid gap-3 rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-300 @md:mt-4 @lg:grid-cols-2 dark:bg-brand-500/15 dark:ring-brand-300/45">
        <div>
          <p className="font-mono text-xs font-medium text-brand-700 @md:text-sm dark:text-brand-300">
            ✓ text-fg-muted
          </p>
          <p className="mt-0.5 text-xs text-fg-muted @md:text-sm">
            one utility, correct in both themes
          </p>
        </div>
        <div>
          {/* red-600 is only 4.0:1 on ink, so the dark: step keeps this AA on
              both grounds — the same fix this scene is describing. */}
          <p className="font-mono text-xs font-medium text-red-600 @md:text-sm dark:text-red-400">
            ✗ text-ink dark:text-slate-400
          </p>
          <p className="mt-0.5 text-xs text-fg-muted @md:text-sm">
            the pattern this system replaced
          </p>
        </div>
      </div>
    </Board>
  );
}

/** Scene 3 — the contrast audit, including the real brand-600 → 700 fix. */
function Contrast() {
  // Ratios are computed from the real token hex values against white using the
  // WCAG 2.x relative-luminance formula — not eyeballed. Bar width is derived
  // from the ratio against the 18.7:1 maximum, so the chart cannot disagree with
  // the number beside it. Recompute these if a token value changes.
  const MAX_RATIO = 18.7;
  const rows = [
    { token: "fg on surface", ratio: 18.7, pass: true },
    { token: "fg-soft on surface", ratio: 14.6, pass: true },
    { token: "fg-muted on surface", ratio: 7.6, pass: true },
    { token: "fg-faint on surface", ratio: 4.8, pass: true },
    { token: "brand-700 on white", ratio: 5.5, pass: true },
    { token: "brand-600 on white", ratio: 3.8, pass: false },
  ];

  return (
    <Board>
      <Heading
        title="Contrast audit · WCAG 2.2 AA"
        meta="body text must clear 4.5:1"
      />

      <ul className="space-y-2 @md:space-y-2.5">
        {rows.map((r) => (
          <li
            key={r.token}
            className={cn(
              "rounded-xl bg-surface p-3 @md:p-3.5",
              "flex flex-col gap-2 @2xl:flex-row @2xl:items-center @2xl:gap-4",
              r.pass
                ? "ring-1 ring-border-subtle"
                : "ring-2 ring-red-600 dark:ring-red-400",
            )}
          >
            <p className="font-mono text-xs text-fg @md:text-sm @2xl:w-52 @2xl:shrink-0">
              {r.token}
            </p>

            <div className="flex items-center gap-3 @2xl:flex-1 @2xl:pr-2">
              {/* The BAR is specimen — brand-500 is the measured swatch, and its
                  width encodes the ratio printed beside it. */}
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-raised">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(r.ratio / MAX_RATIO) * 100}%`,
                    background: r.pass ? P.brand500 : P.red,
                  }}
                />
              </div>
              <p
                className={cn(
                  "w-14 shrink-0 text-right font-mono text-xs @md:text-sm",
                  r.pass ? "text-fg" : "text-red-600 dark:text-red-400",
                )}
              >
                {r.ratio.toFixed(1)}:1
              </p>
            </div>

            <div className="flex items-center gap-2 @2xl:shrink-0">
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  r.pass
                    ? "bg-brand-50 text-brand-700 ring-1 ring-brand-300 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-300/45"
                    : "text-red-600 ring-1 ring-red-600 dark:text-red-400 dark:ring-red-400",
                )}
              >
                {r.pass ? "AA" : "FAIL"}
              </span>
              {!r.pass && (
                <span className="text-xs text-fg-muted">→ brand-700</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-fg-muted @md:text-sm">
        The failing pair was the site&apos;s primary action color. Fixed
        site-wide by stepping brand-600 → brand-700.
      </p>
    </Board>
  );
}

/** Scene 4 — the automated gates that run before anything ships. */
function Gates() {
  const budgets = [
    { label: "Accessibility", value: "100" },
    { label: "SEO", value: "100" },
    { label: "Best practices", value: "95" },
    { label: "Performance", value: "90" },
  ];
  // LCP is gated by a RATCHET against Lighthouse's simulated figure, not the
  // 2.5s CWV target — the simulated ~3.0s is a 4x-CPU-throttling artifact and
  // real observed LCP is ~136ms. Drawing "< 2.5s" here would claim a gate the
  // build doesn't enforce. Mirrors LCP_RATCHET in scripts/lh-gate.mjs.
  const cwv = [
    { label: "LCP (simulated)", value: "< 3.2s ratchet" },
    { label: "CLS", value: "< 0.1" },
    { label: "TBT", value: "< 200ms" },
  ];
  const routes = [
    "home",
    "case studies",
    "404",
    "contact form errors",
    "keyboard focus",
  ];

  return (
    <Board>
      {/* No `onDark`: with the ink ground gone this title sits on the PAGE, so
          it takes the theme tokens like every other scene heading. Left as
          on-dark it was near-white on a white page in light mode. */}
      <Heading
        title="The build gate"
        meta="scripts/lh-gate.mjs · exits 1 on regression"
      />

      {/* Two-up on a phone rather than four: a 4-col grid at 380px leaves each
          score ~80px wide, which shrinks the numerals that are the whole point. */}
      <div className="grid grid-cols-2 gap-2.5 @md:gap-3 @lg:grid-cols-4">
        {budgets.map((b) => (
          <div
            key={b.label}
            className="rounded-2xl p-3 text-center @md:p-5"
            style={{ background: P.inkSoft }}
          >
            <p
              className="font-display text-3xl font-bold @md:text-5xl"
              style={{ color: P.brand400 }}
            >
              {b.value}
            </p>
            <p
              className="mt-1 text-[11px] @md:text-sm"
              style={{ color: P.darkFgSoft }}
            >
              {b.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-2.5 grid gap-2.5 @md:mt-3 @md:gap-3 @lg:grid-cols-3">
        {cwv.map((c) => (
          // Outlined, sitting directly on the page — so border and text are
          // theme tokens, not the on-dark specimen values. brand-300 mint was
          // fine on ink and fails AA on white.
          <div
            key={c.label}
            className="rounded-xl border border-border-subtle p-3 @md:p-4"
          >
            <p className="font-mono text-[11px] text-fg-muted @md:text-sm">
              {c.label}
            </p>
            <p className="mt-1 font-display text-base font-semibold text-brand-700 @md:text-xl dark:text-brand-300">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-2.5 rounded-2xl p-4 @md:mt-3 @md:p-5"
        style={{ background: P.inkSoft }}
      >
        <p
          className="font-display text-sm font-semibold @md:text-lg"
          style={{ color: P.darkFg }}
        >
          axe-core · WCAG 2.2 AA scans
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {routes.map((r) => (
            <li
              key={r}
              className="rounded-full border px-3 py-1 text-[11px] @md:text-sm"
              style={{ borderColor: P.brand500, color: P.brand300 }}
            >
              {r}
            </li>
          ))}
        </ul>
        <p
          className="mt-3 font-mono text-[11px] leading-relaxed @md:text-xs"
          style={{ color: P.darkFgMuted }}
        >
          + Playwright journeys · responsive at 360 / 768 / 1280 · SEO metadata
        </p>
      </div>
    </Board>
  );
}

const scenes: Record<Scene, () => React.JSX.Element> = {
  layers: Layers,
  "theme-split": ThemeSplit,
  contrast: Contrast,
  gates: Gates,
};

export function PortfolioSystemAsset({
  scene,
  className,
  alt,
}: PortfolioSystemAssetProps) {
  const Scene = scenes[scene];
  return (
    <div
      // No ring, no shadow, and — for the groundless scenes — no rounding or
      // clipping either.
      //
      // All of it was holdover from the SVG era, when each scene was a flat
      // picture that needed an edge to read as a card sitting ON the page. These
      // scenes are built from the site's own surfaces now, so the ring drew a
      // second edge around rows that already carry their own borders, and the
      // shadow lifted a full-width block that isn't floating above anything.
      //
      // The rounding had to go with them. `rounded-4xl` (32px) arrives from the
      // case-study page for every scene, and with the board's padding removed
      // the content sits flush against that edge — so the corner curve clipped
      // the first glyph of the title. A scene with no ground has no card shape
      // to round: there is nothing to clip TO, only content to clip OFF. Only
      // the `gates` board, which paints a real ink ground, rounds itself (and
      // insets its content) — see Board.
      // `rounded-none` comes AFTER className so it beats the `rounded-4xl` the
      // case-study page applies to every scene slot. No scene paints a ground
      // any more, so none has a card shape to round: a radius here would have
      // nothing to clip TO, only content to clip OFF — which is exactly how the
      // first glyph of a title got eaten. No `overflow-hidden` for the same
      // reason. See the note on Board.
      className={cn(className, "rounded-none")}
      // A labelled GROUP, not role="img". These scenes are real text now, and
      // role="img" would hide the readable markup inside from assistive tech —
      // the opposite of what a DOM rebuild is for. The alt becomes the group's
      // accessible name, and the content inside stays reachable.
      role={alt ? "group" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <Scene />
    </div>
  );
}

/** Ordered scenes for the case-study gallery (hero first, then blocks). */
export const portfolioSystemScenes: { scene: Scene; alt: string }[] = [
  {
    scene: "layers",
    alt: "The five token layers of this site's design system. Fg for text and surface for cards both flip in dark mode, while ink for backgrounds, the emerald brand ramp, and the on-dark set for always-dark panels never flip. Each row shows four sample swatches, drawn from the 35 color tokens in globals.css.",
  },
  {
    scene: "theme-split",
    alt: "Why the palette is split in two: the same value, #0b1220, is light-mode text and the dark-mode page background. Light and dark panels show identical UI rendered from one set of utilities, with the correct pattern (text-fg-muted) contrasted against the pattern it replaced (text-ink with a dark:text-slate-400 override).",
  },
  {
    scene: "contrast",
    alt: "A WCAG 2.2 AA contrast audit of the text tokens, each with its measured ratio against the 4.5:1 body-text threshold. Five pairs pass, from fg at 18.7:1 down to fg-faint at 4.8:1; brand-600 on white fails at 3.8:1. That was the site's primary action color, fixed site-wide by stepping it to brand-700 at 5.5:1.",
  },
  {
    scene: "gates",
    alt: "The automated build gate: Lighthouse minimums of 100 accessibility, 100 SEO, 95 best practices and 90 performance, with CLS under 0.1, TBT under 200 milliseconds, and LCP held to a 3.2-second ratchet against Lighthouse's simulated figure rather than the 2.5-second target, since real observed LCP lands under 200 milliseconds. Below, axe-core WCAG 2.2 AA coverage across the home page, case studies, the 404 page, contact form errors and keyboard focus.",
  },
];
