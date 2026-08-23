import { cn } from "@/lib/utils";

/**
 * "This Site" — case-study assets for the portfolio's own design system.
 *
 * Deliberately UNLIKE the other asset sets. Aperture, Northwind and Lumin are
 * fictional clients, so each carries its own invented identity kept separate
 * from the portfolio's brand. Here the portfolio IS the
 * subject, so these scenes use the REAL emerald/ink palette and the REAL values
 * from the codebase — that's the whole point of the study.
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
 * Colors are hardcoded hex here for the same reason the other asset files are:
 * an SVG mockup is a picture OF a design system, not UI built with it. Tailwind
 * tokens can't be referenced inside raw SVG fill attributes, and these swatches
 * must render the literal documented values (including both themes side by side)
 * regardless of the viewer's current theme.
 *
 * ── Two color layers in this file ──────────────────────────────────────────
 * That rule applies to the SPECIMEN — the thing each scene is a picture of.
 * It does NOT apply to the artboard around it, and conflating the two left
 * three white-canvas scenes floating on the dark page.
 *
 *   SPECIMEN  → literal hex from `P` below. Fixed in both themes, because the
 *               scene asserts these values: the light/dark comparison panels in
 *               ThemeSplit, the swatch rows in Layers, the ratio bars and their
 *               measured numbers in Contrast. Theming these would make the
 *               claims false.
 *   CHROME    → `C` below (var(--asset-*), re-pointed in the .dark block of
 *               globals.css). The canvas, card fills, hairlines and the label
 *               text sitting on them. Follows the theme, asserts nothing.
 *
 * The split is why this component can stay a server component: CSS variables
 * resolve at paint time, so there's no useTheme(), no client boundary, and no
 * flash of the wrong palette before hydration.
 *
 * When adding to a scene, ask whether the color is part of the CLAIM. If yes,
 * use `P`. If it's just the frame around the claim, use `C`.
 */

// The portfolio's real palette, mirrored from globals.css.
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

/**
 * Theme-aware artboard chrome. Defined in globals.css (`:root` + `.dark`) and
 * resolved at paint time, so these work in a server-rendered SVG. See the
 * specimen-vs-chrome note in the file header before reaching for one.
 */
const C = {
  canvas: "var(--asset-canvas)",
  canvasAlt: "var(--asset-canvas-alt)",
  canvasSoft: "var(--asset-canvas-soft)",
  card: "var(--asset-card)",
  line: "var(--asset-line)",
  lineSoft: "var(--asset-line-soft)",
  label: "var(--asset-label)",
  text: "var(--asset-text)",
  textFaint: "var(--asset-text-faint)",
  pill: "var(--asset-pill)",
  pillLine: "var(--asset-pill-line)",
  pillText: "var(--asset-pill-text)",
  danger: "var(--asset-danger)",
};

type Scene = "layers" | "theme-split" | "contrast" | "gates";

type PortfolioSystemAssetProps = {
  scene: Scene;
  className?: string;
  /** Accessible description of the deliverable. */
  alt: string;
};

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {children}
    </svg>
  );
}

function Mono({
  x,
  y,
  children,
  fill = C.text,
  size = 20,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  fill?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      fontSize={size}
      textAnchor={anchor}
    >
      {children}
    </text>
  );
}

function Label({
  x,
  y,
  children,
  fill = C.label,
  size = 24,
  weight = 600,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  fill?: string;
  size?: number;
  weight?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontFamily="Sora, sans-serif"
      fontSize={size}
      fontWeight={weight}
      letterSpacing="-0.3"
      textAnchor={anchor}
    >
      {children}
    </text>
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
    <Frame>
      <rect width="1600" height="900" fill={C.canvasAlt} />
      <Label x={90} y={116} size={40} weight={700}>
        Five token layers
      </Label>
      <Mono x={90} y={156} size={22}>
        src/app/globals.css · 35 color tokens
      </Mono>

      {/* Five rows in the same 900px artboard: pitch tightened from 150 to 136
          and row height from 120 to 116 when the on-dark layer was added. Last
          row ends at 862, clear of the frame. */}
      {rows.map((row, i) => {
        const y = 206 + i * 136;
        return (
          <g key={row.name}>
            <rect
              x="90"
              y={y}
              width="1420"
              height="116"
              rx="20"
              fill={C.card}
              stroke={C.line}
              strokeWidth="2"
            />
            <Mono x={130} y={y + 56} size={28} fill={C.label}>
              {row.name}-*
            </Mono>
            <text
              x={130}
              y={y + 87}
              fill={C.textFaint}
              fontFamily="Sora, sans-serif"
              fontSize="19"
            >
              {row.desc}
            </text>

            {/* Swatch FILLS are specimen — the literal token values, fixed in
                both themes. Only the outline is chrome: a neutral #e2e8f0 hairline
                disappears against the dark card, and these swatches include near-
                white values that need an edge to read as a chip rather than a hole. */}
            {row.swatches.map((s, j) => (
              <rect
                key={j}
                x={470 + j * 86}
                y={y + 30}
                width="72"
                height="56"
                rx="12"
                fill={s}
                stroke={C.lineSoft}
                strokeWidth="1.5"
              />
            ))}

            <rect
              x={900}
              y={y + 38}
              width={row.flips ? 200 : 232}
              height="40"
              rx="20"
              fill={row.flips ? C.pill : C.canvasSoft}
              stroke={row.flips ? C.pillLine : C.lineSoft}
              strokeWidth="2"
            />
            <text
              x={row.flips ? 1000 : 1016}
              y={y + 64}
              fill={row.flips ? C.pillText : C.text}
              fontFamily="Sora, sans-serif"
              fontSize="19"
              fontWeight="600"
              textAnchor="middle"
            >
              {row.flips ? "flips in dark" : "never flips"}
            </text>
          </g>
        );
      })}

    </Frame>
  );
}

/** Scene 2 — why ink and fg had to be split apart. */
function ThemeSplit() {
  return (
    <Frame>
      <rect width="1600" height="900" fill={C.canvas} />
      <Label x={90} y={110} size={40} weight={700}>
        One value, two jobs
      </Label>
      <text
        x={90}
        y={152}
        fill={C.text}
        fontFamily="Sora, sans-serif"
        fontSize="22"
      >
        #0b1220 is light-mode text AND the dark-mode page background.
      </text>

      {/* Light panel — SPECIMEN, stays literal in both themes. This panel and
          the dark one beside it ARE the argument: the same UI, one set of
          utilities, two grounds. Theming either half would collapse the
          comparison into two identical panels. Only its outer hairline is
          chrome, so the panel edge survives on the dark artboard. */}
      <g>
        <rect
          x="90"
          y="210"
          width="660"
          height="470"
          rx="28"
          fill={P.paper}
          stroke={C.line}
          strokeWidth="3"
        />
        <Mono x={130} y={262} size={20} fill={P.fgFaint}>
          light
        </Mono>
        <Label x={130} y={330} size={34} fill={P.ink}>
          Heading text
        </Label>
        <text
          x={130}
          y={378}
          fill={P.fgMuted}
          fontFamily="Sora, sans-serif"
          fontSize="22"
        >
          Supporting body copy sits here.
        </text>
        <rect x="130" y="424" width="180" height="52" rx="26" fill={P.brand700} />
        <text
          x={220}
          y={457}
          fill={P.paper}
          fontFamily="Sora, sans-serif"
          fontSize="20"
          fontWeight="600"
          textAnchor="middle"
        >
          Primary
        </text>
        <Mono x={130} y={540} size={19}>
          text-fg → #0b1220
        </Mono>
        <Mono x={130} y={576} size={19}>
          bg → #ffffff
        </Mono>
        <Mono x={130} y={612} size={19}>
          brand-700 fill
        </Mono>
      </g>

      {/* Dark panel — SPECIMEN, likewise literal. Its ink fill equals the dark
          artboard exactly, so the chrome hairline is what separates panel from
          canvas; the old ink-soft stroke only read against the white artboard. */}
      <g>
        <rect
          x="850"
          y="210"
          width="660"
          height="470"
          rx="28"
          fill={P.ink}
          stroke={C.line}
          strokeWidth="3"
        />
        <Mono x={890} y={262} size={20} fill={P.darkFgMuted}>
          dark
        </Mono>
        <Label x={890} y={330} size={34} fill={P.darkFg}>
          Heading text
        </Label>
        <text
          x={890}
          y={378}
          fill={P.darkFgMuted}
          fontFamily="Sora, sans-serif"
          fontSize="22"
        >
          Supporting body copy sits here.
        </text>
        <rect x="890" y="424" width="180" height="52" rx="26" fill={P.brand600} />
        <text
          x={980}
          y={457}
          fill={P.paper}
          fontFamily="Sora, sans-serif"
          fontSize="20"
          fontWeight="600"
          textAnchor="middle"
        >
          Primary
        </text>
        <Mono x={890} y={540} size={19} fill={P.darkFgMuted}>
          text-fg → #f1f5f9
        </Mono>
        <Mono x={890} y={576} size={19} fill={P.darkFgMuted}>
          bg → ink #0b1220
        </Mono>
        <Mono x={890} y={612} size={19} fill={P.darkFgMuted}>
          same utility, no override
        </Mono>
      </g>

      {/* The rule */}
      <rect
        x="90"
        y="726"
        width="1420"
        height="104"
        rx="24"
        fill={C.pill}
        stroke={C.pillLine}
        strokeWidth="2"
      />
      <Mono x={130} y={772} size={22} fill={C.pillText}>
        ✓ text-fg-muted
      </Mono>
      <text
        x={130}
        y={806}
        fill={C.text}
        fontFamily="Sora, sans-serif"
        fontSize="19"
      >
        one utility, correct in both themes
      </text>
      {/* red-600 #dc2626 is only 4.0:1 on ink — step to red-400 in dark, which
          clears AA on both artboards. */}
      <Mono x={820} y={772} size={22} fill={C.danger}>
        ✗ text-ink dark:text-slate-400
      </Mono>
      <text
        x={820}
        y={806}
        fill={C.text}
        fontFamily="Sora, sans-serif"
        fontSize="19"
      >
        the pattern this system replaced
      </text>
    </Frame>
  );
}

/** Scene 3 — the contrast audit, including the real brand-600 → 700 fix. */
function Contrast() {
  // Ratios are computed from the real token hex values against white using the
  // WCAG 2.x relative-luminance formula — not eyeballed. Bar widths are scaled
  // from the ratio (~21.4px per point) so the chart can't disagree with the number
  // beside it. Recompute these if a token value changes.
  const rows = [
    { token: "fg on surface", ratio: "18.7:1", pass: true, bar: 400 },
    { token: "fg-soft on surface", ratio: "14.6:1", pass: true, bar: 312 },
    { token: "fg-muted on surface", ratio: "7.6:1", pass: true, bar: 162 },
    { token: "fg-faint on surface", ratio: "4.8:1", pass: true, bar: 102 },
    { token: "brand-700 on white", ratio: "5.5:1", pass: true, bar: 118 },
    { token: "brand-600 on white", ratio: "3.8:1", pass: false, bar: 81 },
  ];

  return (
    <Frame>
      <rect width="1600" height="900" fill={C.canvasSoft} />
      <Label x={90} y={112} size={40} weight={700}>
        Contrast audit · WCAG 2.2 AA
      </Label>
      <Mono x={90} y={152} size={22}>
        body text must clear 4.5:1
      </Mono>

      {rows.map((r, i) => {
        const y = 216 + i * 96;
        return (
          <g key={r.token}>
            <rect
              x="90"
              y={y}
              width="1420"
              height="76"
              rx="18"
              fill={C.card}
              stroke={r.pass ? C.line : C.danger}
              strokeWidth={r.pass ? 2 : 3}
            />
            <Mono x={128} y={y + 48} size={22} fill={C.label}>
              {r.token}
            </Mono>
            {/* The BAR is specimen — brand-500 is the measured swatch, and its
                width encodes the ratio printed beside it. Fixed in both themes. */}
            <rect
              x={700}
              y={y + 26}
              width={r.bar}
              height="24"
              rx="12"
              fill={r.pass ? P.brand500 : C.danger}
            />
            <Mono
              x={1180}
              y={y + 48}
              size={22}
              fill={r.pass ? C.label : C.danger}
              anchor="end"
            >
              {r.ratio}
            </Mono>
            <rect
              x={1240}
              y={y + 22}
              width="100"
              height="32"
              rx="16"
              fill={r.pass ? C.pill : "none"}
              stroke={r.pass ? C.pillLine : C.danger}
              strokeWidth="2"
            />
            <text
              x={1290}
              y={y + 44}
              fill={r.pass ? C.pillText : C.danger}
              fontFamily="Sora, sans-serif"
              fontSize="18"
              fontWeight="600"
              textAnchor="middle"
            >
              {r.pass ? "AA" : "FAIL"}
            </text>
            {!r.pass && (
              <text
                x={1370}
                y={y + 44}
                fill={C.text}
                fontFamily="Sora, sans-serif"
                fontSize="17"
              >
                → brand-700
              </text>
            )}
          </g>
        );
      })}

      <text
        x={90}
        y={846}
        fill={C.text}
        fontFamily="Sora, sans-serif"
        fontSize="20"
      >
        The failing pair was the site&apos;s primary action color. Fixed site-wide
        by stepping brand-600 → brand-700.
      </text>
    </Frame>
  );
}

/** Scene 4 — the automated gates that run before anything ships. */
function Gates() {
  const budgets = [
    { label: "Accessibility", value: "100", unit: "min" },
    { label: "SEO", value: "100", unit: "min" },
    { label: "Best practices", value: "95", unit: "min" },
    { label: "Performance", value: "90", unit: "min" },
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

  return (
    <Frame>
      {/* This scene is ink-on-ink with the dark page background and needs a
          visible card edge, but the border canNOT be drawn here: an `rx` in
          viewBox units scales with the render width, so it never matches the
          wrapper's fixed 32px `rounded-4xl` clip, and the mismatched curves cut
          each other off at the corners. The wrapper draws the edge instead —
          see `edge` in PortfolioSystemAsset below. */}
      <rect width="1600" height="900" fill={P.ink} />
      <Label x={90} y={112} size={40} weight={700} fill={P.darkFg}>
        The build gate
      </Label>
      <Mono x={90} y={152} size={22} fill={P.darkFgMuted}>
        scripts/lh-gate.mjs · exits 1 on regression
      </Mono>

      {budgets.map((b, i) => (
        <g key={b.label}>
          <rect
            x={90 + i * 358}
            y="212"
            width="328"
            height="188"
            rx="24"
            fill={P.inkSoft}
          />
          <text
            x={90 + i * 358 + 164}
            y="308"
            fill={P.brand400}
            fontFamily="Sora, sans-serif"
            fontSize="62"
            fontWeight="700"
            textAnchor="middle"
          >
            {b.value}
          </text>
          <text
            x={90 + i * 358 + 164}
            y="352"
            fill={P.darkFgSoft}
            fontFamily="Sora, sans-serif"
            fontSize="21"
            textAnchor="middle"
          >
            {b.label}
          </text>
        </g>
      ))}

      {/* Core Web Vitals */}
      {cwv.map((c, i) => (
        <g key={c.label}>
          <rect
            x={90 + i * 478}
            y="440"
            width="448"
            height="120"
            rx="20"
            fill="none"
            stroke={P.inkSoft}
            strokeWidth="3"
          />
          <Mono x={130 + i * 478} y={492} size={22} fill={P.darkFgMuted}>
            {c.label}
          </Mono>
          <text
            x={130 + i * 478}
            y={534}
            fill={P.brand300}
            fontFamily="Sora, sans-serif"
            fontSize="30"
            fontWeight="600"
          >
            {c.value}
          </text>
        </g>
      ))}

      {/* axe-core coverage */}
      <rect
        x="90"
        y="606"
        width="1420"
        height="212"
        rx="24"
        fill={P.inkSoft}
      />
      <Label x={130} y={664} size={26} fill={P.darkFg}>
        axe-core · WCAG 2.2 AA scans
      </Label>
      {[
        "home",
        "case studies",
        "404",
        "contact form errors",
        "keyboard focus",
      ].map((r, i) => (
        <g key={r}>
          <rect
            x={130 + i * 270}
            y="700"
            width="248"
            height="52"
            rx="26"
            fill="none"
            stroke={P.brand500}
            strokeWidth="2"
          />
          <text
            x={130 + i * 270 + 124}
            y="733"
            fill={P.brand300}
            fontFamily="Sora, sans-serif"
            fontSize="19"
            textAnchor="middle"
          >
            {r}
          </text>
        </g>
      ))}
      <Mono x={130} y={794} size={19} fill={P.darkFgMuted}>
        + Playwright journeys · responsive at 360 / 768 / 1280 · SEO metadata
      </Mono>
    </Frame>
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
      className={cn(
        "overflow-hidden shadow-soft",
        // The scenes are ink-on-ink with the dark page background, so they need
        // a visible card edge. It's an inset `ring` rather than a `border` or an
        // <rect> inside the SVG: a ring shares this element's border-radius
        // exactly and sits inside the clip, so there's one curve instead of two
        // that disagree. An SVG-drawn edge can't work here — its `rx` is in
        // viewBox units and rescales with the render width, so it drifts away
        // from the wrapper's fixed radius and the corners cut each other off.
        "inset-ring-1 inset-ring-border-on-dark",
        className,
      )}
      role={alt ? "img" : undefined}
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
