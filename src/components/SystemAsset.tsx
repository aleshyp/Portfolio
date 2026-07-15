import { cn } from "@/lib/utils";

/**
 * Halyard — fictional fintech platform, design-system case study assets.
 *
 * Hand-built SVG mockups standing in for the token-driven system described in
 * the "A Design System That Scales" case study. Like the other studies, Halyard
 * is a DISTINCT fictional client carrying its OWN identity — a precise
 * slate-blue with a copper accent — deliberately separate from the portfolio's
 * emerald/ink tokens AND from Aperture, Northwind, Lumin, Fernweh and Cadence.
 * Each set standing on its own is the point: these are client products, not the
 * portfolio's brand.
 *
 * A design system case study has to SHOW the system, so the scenes are the
 * artifacts themselves: the drift that motivated the work, the semantic token
 * layer mapped one-to-one to code, the component library with its states, and
 * the accessibility contrast grid the case study says became built-in.
 *
 * Swap any of these for a real <Image /> (a Figma export or screenshot) when
 * ready. Each scene is decorative-with-meaning, so we expose an accessible
 * label via role="img" + aria-label on the wrapper.
 */

// Halyard's own palette (self-contained; not portfolio tokens on purpose).
const H = {
  ink: "#141A24", // near-black slate text
  slateBlue: "#3B5BDB",
  slateDeep: "#26398F",
  sky: "#8DA2F0",
  copper: "#C2703D", // accent
  copperSoft: "#E8A87C",
  paper: "#FFFFFF",
  mist: "#F0F3FC", // page background tint
  cloud: "#F7F8FB", // panel fill
  line: "#DFE3ED",
  slate: "#5D6779", // muted body text
  mint: "#12A57A", // pass / success
  red: "#DC3B3B", // fail
};

type Scene = "tokens" | "drift" | "token-layer" | "components" | "a11y";

type SystemAssetProps = {
  scene: Scene;
  className?: string;
  /** Accessible description of the deliverable. */
  alt: string;
};

function Frame({ children }: { children: React.ReactNode }) {
  // `meet` fits the whole 1600×900 artboard inside the (also 16:9) container so
  // nothing near the edges is cropped. Each scene paints a full-bleed
  // background rect, so there are no letterbox bars.
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

/** Halyard wordmark: a cleat/knot mark + name. */
function Wordmark({
  x,
  y,
  scale = 1,
  onDark = false,
}: {
  x: number;
  y: number;
  scale?: number;
  onDark?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="0" y="-26" width="36" height="36" rx="10" fill={H.slateBlue} />
      {/* halyard: a line through two cleats */}
      <path
        d="M 10 -20 L 26 -20 M 18 -20 L 18 4 M 10 4 L 26 4"
        stroke={H.paper}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="18" cy="-8" r="4" fill={H.copperSoft} />
      <text
        x="48"
        y="3"
        fill={onDark ? H.paper : H.ink}
        fontFamily="Sora, sans-serif"
        fontSize="30"
        fontWeight="700"
        letterSpacing="-1"
      >
        Halyard
      </text>
    </g>
  );
}

/** Monospace-ish code chip, used to pair a token with its code name. */
function CodeChip({
  x,
  y,
  w,
  label,
  fill = H.cloud,
  text = H.slate,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  fill?: string;
  text?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="32" rx="8" fill={fill} />
      <text
        x={x + 12}
        y={y + 22}
        fill={text}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="17"
      >
        {label}
      </text>
    </g>
  );
}

/**
 * Hero / cover — the token sheet: the system's primitives laid out as an
 * artifact you could actually hand to a team.
 */
function Tokens() {
  const colors = [
    { name: "brand.600", hex: H.slateBlue },
    { name: "brand.800", hex: H.slateDeep },
    { name: "brand.300", hex: H.sky },
    { name: "accent.500", hex: H.copper },
    { name: "success", hex: H.mint },
    { name: "danger", hex: H.red },
  ];
  const spacing = [4, 8, 12, 16, 24, 32, 48];
  return (
    <Frame>
      <rect width="1600" height="900" fill={H.mist} />
      <Wordmark x={120} y={120} />
      <text
        x="120"
        y="212"
        fill={H.slateBlue}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
      >
        DESIGN TOKENS
      </text>
      <text
        x="120"
        y="278"
        fill={H.ink}
        fontFamily="Sora, sans-serif"
        fontSize="56"
        fontWeight="800"
        letterSpacing="-2"
      >
        One source of truth.
      </text>

      {/* color row */}
      <text x="120" y="356" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="19" fontWeight="700" letterSpacing="2">
        COLOR
      </text>
      {colors.map((c, i) => {
        const cx = 120 + i * 172;
        return (
          <g key={c.name}>
            <rect x={cx} y="376" width="150" height="110" rx="16" fill={c.hex} />
            <CodeChip x={cx} y={496} w={150} label={c.name} fill={H.paper} />
          </g>
        );
      })}

      {/* spacing scale */}
      <text x="120" y="592" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="19" fontWeight="700" letterSpacing="2">
        SPACING
      </text>
      {spacing.map((s, i) => {
        const cx = 120 + i * 108;
        const barH = s * 2.4;
        return (
          <g key={s}>
            <rect x={cx} y={680 - barH} width="72" height={barH} rx="6" fill={H.sky} />
            <text x={cx + 36} y="708" fill={H.slate} fontFamily="ui-monospace, monospace" fontSize="17" textAnchor="middle">
              {s}
            </text>
          </g>
        );
      })}

      {/* type scale */}
      <text x="960" y="592" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="19" fontWeight="700" letterSpacing="2">
        TYPE
      </text>
      {[
        { label: "Display", size: 44 },
        { label: "Heading", size: 30 },
        { label: "Body", size: 21 },
        { label: "Caption", size: 16 },
      ].map((t, i) => (
        <g key={t.label}>
          <text
            x="960"
            y={648 + i * 56}
            fill={H.ink}
            fontFamily="Sora, sans-serif"
            fontSize={t.size}
            fontWeight="700"
          >
            {t.label}
          </text>
          <text
            x="1420"
            y={648 + i * 56}
            fill={H.slate}
            fontFamily="ui-monospace, monospace"
            fontSize="17"
            textAnchor="end"
          >
            {t.size}/{Math.round(t.size * 1.4)}
          </text>
          <line x1="960" y1={664 + i * 56} x2="1480" y2={664 + i * 56} stroke={H.line} strokeWidth="1.5" />
        </g>
      ))}
    </Frame>
  );
}

/**
 * The challenge — drift. The same button, rebuilt six ways by three teams.
 * This is the case study's "made by several different hands" made literal.
 */
function Drift() {
  const buttons = [
    { w: 168, h: 48, rx: 24, fill: "#3B5BDB", label: "Continue", fs: 19 },
    { w: 150, h: 40, rx: 6, fill: "#2F4FC4", label: "Continue", fs: 17 },
    { w: 190, h: 56, rx: 28, fill: "#4361D0", label: "CONTINUE", fs: 16 },
    { w: 160, h: 44, rx: 12, fill: "#3355E0", label: "Continue →", fs: 18 },
    { w: 176, h: 52, rx: 4, fill: "#2B47B8", label: "Continue", fs: 21 },
    { w: 144, h: 46, rx: 23, fill: "#5570E8", label: "continue", fs: 18 },
  ];
  return (
    <Frame>
      <rect width="1600" height="900" fill={H.paper} />
      <text
        x="800"
        y="120"
        fill={H.copper}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
        textAnchor="middle"
      >
        THE CHALLENGE
      </text>
      <text
        x="800"
        y="196"
        fill={H.ink}
        fontFamily="Sora, sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-2"
        textAnchor="middle"
      >
        One button. Six teams. Six buttons.
      </text>
      <text
        x="800"
        y="248"
        fill={H.slate}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        textAnchor="middle"
      >
        Every screen a little different. Every handoff a negotiation.
      </text>

      {/* the six drifted buttons, each annotated with what's off */}
      {buttons.map((b, i) => {
        const cx = 170 + (i % 3) * 440;
        const cy = 350 + Math.floor(i / 3) * 230;
        return (
          <g key={i}>
            <rect x={cx} y={cy} width="360" height="180" rx="20" fill={H.cloud} stroke={H.line} strokeWidth="2" />
            <text x={cx + 24} y={cy + 40} fill={H.slate} fontFamily="ui-monospace, monospace" fontSize="16">
              team-{["billing", "cards", "web", "mobile", "admin", "growth"][i]}
            </text>
            <g>
              <rect
                x={cx + 180 - b.w / 2}
                y={cy + 90 - b.h / 2}
                width={b.w}
                height={b.h}
                rx={b.rx}
                fill={b.fill}
              />
              <text
                x={cx + 180}
                y={cy + 90 + b.fs / 3}
                fill={H.paper}
                fontFamily="Inter, sans-serif"
                fontSize={b.fs}
                fontWeight="600"
                textAnchor="middle"
              >
                {b.label}
              </text>
            </g>
            <text x={cx + 180} y={cy + 152} fill={H.copper} fontFamily="ui-monospace, monospace" fontSize="15" textAnchor="middle">
              {b.fill} · r{b.rx} · {b.h}px
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

/**
 * Tokens first — the semantic layer mapped one-to-one to code. The case study's
 * central claim: a shared vocabulary that makes theming trivial.
 */
function TokenLayer() {
  const rows = [
    { sem: "surface.raised", hex: "#FFFFFF", dark: "#1B2233", css: "--hy-surface-raised" },
    { sem: "text.primary", hex: "#141A24", dark: "#F2F5FB", css: "--hy-text-primary" },
    { sem: "text.muted", hex: "#5D6779", dark: "#9AA6BC", css: "--hy-text-muted" },
    { sem: "action.primary", hex: "#3B5BDB", dark: "#8DA2F0", css: "--hy-action-primary" },
    { sem: "border.subtle", hex: "#DFE3ED", dark: "#2C3346", css: "--hy-border-subtle" },
  ];
  return (
    <Frame>
      <rect width="1600" height="900" fill={H.cloud} />
      <text
        x="120"
        y="130"
        fill={H.slateBlue}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
      >
        TOKENS FIRST
      </text>
      <text
        x="120"
        y="200"
        fill={H.ink}
        fontFamily="Sora, sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-2"
      >
        Semantic, not literal.
      </text>
      <text x="120" y="252" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="24">
        Designers and engineers name the same thing the same way — so theming is a swap, not a rewrite.
      </text>

      {/* column headers */}
      {[
        { x: 140, label: "TOKEN" },
        { x: 560, label: "LIGHT" },
        { x: 800, label: "DARK" },
        { x: 1060, label: "IN CODE" },
      ].map((c) => (
        <text
          key={c.label}
          x={c.x}
          y="326"
          fill={H.slate}
          fontFamily="Inter, sans-serif"
          fontSize="18"
          fontWeight="700"
          letterSpacing="2"
        >
          {c.label}
        </text>
      ))}
      <line x1="120" y1="344" x2="1480" y2="344" stroke={H.line} strokeWidth="2" />

      {rows.map((r, i) => {
        const y = 372 + i * 96;
        return (
          <g key={r.sem}>
            <rect x="120" y={y} width="1360" height="76" rx="14" fill={i % 2 === 0 ? H.paper : "transparent"} />
            <text x="140" y={y + 47} fill={H.ink} fontFamily="ui-monospace, monospace" fontSize="21" fontWeight="600">
              {r.sem}
            </text>
            {/* light swatch */}
            <rect x="560" y={y + 20} width="40" height="36" rx="8" fill={r.hex} stroke={H.line} strokeWidth="1.5" />
            <text x="614" y={y + 45} fill={H.slate} fontFamily="ui-monospace, monospace" fontSize="17">
              {r.hex}
            </text>
            {/* dark swatch */}
            <rect x="800" y={y + 20} width="40" height="36" rx="8" fill={r.dark} stroke={H.line} strokeWidth="1.5" />
            <text x="854" y={y + 45} fill={H.slate} fontFamily="ui-monospace, monospace" fontSize="17">
              {r.dark}
            </text>
            {/* code name */}
            <CodeChip x={1060} y={y + 22} w={310} label={r.css} fill={H.mist} text={H.slateDeep} />
          </g>
        );
      })}

      <text x="120" y="856" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="21" fontStyle="italic">
        Same name in Figma, same name in the browser. That’s the whole trick.
      </text>
    </Frame>
  );
}

/**
 * Components & docs — the library with real states, since a system is only as
 * good as its states (hover, focus, disabled, error).
 */
function Components() {
  return (
    <Frame>
      <rect width="1600" height="900" fill={H.paper} />
      <text
        x="120"
        y="126"
        fill={H.slateBlue}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
      >
        COMPONENTS & DOCS
      </text>
      <text
        x="120"
        y="192"
        fill={H.ink}
        fontFamily="Sora, sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-2"
      >
        Every state, documented.
      </text>

      {/* Button states */}
      <text x="120" y="266" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="19" fontWeight="700" letterSpacing="2">
        BUTTON
      </text>
      {[
        { label: "Default", fill: H.slateBlue, ring: false, op: 1 },
        { label: "Hover", fill: H.slateDeep, ring: false, op: 1 },
        { label: "Focus", fill: H.slateBlue, ring: true, op: 1 },
        { label: "Disabled", fill: H.slateBlue, ring: false, op: 0.38 },
      ].map((s, i) => {
        const cx = 120 + i * 240;
        return (
          <g key={s.label}>
            {s.ring && (
              <rect x={cx - 6} y={292} width="184" height="60" rx="30" fill="none" stroke={H.copper} strokeWidth="4" />
            )}
            <rect x={cx} y="298" width="172" height="48" rx="24" fill={s.fill} opacity={s.op} />
            <text
              x={cx + 86}
              y="329"
              fill={H.paper}
              fontFamily="Inter, sans-serif"
              fontSize="19"
              fontWeight="600"
              textAnchor="middle"
              opacity={s.op}
            >
              Continue
            </text>
            <text x={cx + 86} y="382" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="18" textAnchor="middle">
              {s.label}
            </text>
          </g>
        );
      })}

      {/* Input states */}
      <text x="120" y="452" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="19" fontWeight="700" letterSpacing="2">
        INPUT
      </text>
      {[
        { label: "Rest", stroke: H.line, msg: "", msgFill: H.slate },
        { label: "Focus", stroke: H.slateBlue, msg: "", msgFill: H.slate },
        { label: "Error", stroke: H.red, msg: "Enter a valid account number", msgFill: H.red },
      ].map((s, i) => {
        const cx = 120 + i * 460;
        return (
          <g key={s.label}>
            <rect x={cx} y="480" width="400" height="56" rx="12" fill={H.cloud} stroke={s.stroke} strokeWidth={s.label === "Rest" ? 2 : 3} />
            <text x={cx + 18} y="516" fill={s.label === "Rest" ? H.slate : H.ink} fontFamily="Inter, sans-serif" fontSize="19">
              {s.label === "Rest" ? "Account number" : "4491 0000 1234"}
            </text>
            {s.msg && (
              <text x={cx} y="566" fill={s.msgFill} fontFamily="Inter, sans-serif" fontSize="17">
                {s.msg}
              </text>
            )}
            <text x={cx} y="600" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="18">
              {s.label}
            </text>
          </g>
        );
      })}

      {/* usage guidance: do / don't */}
      <g>
        <rect x="120" y="648" width="640" height="180" rx="20" fill={H.cloud} stroke={H.mint} strokeWidth="2" />
        <circle cx="164" cy="694" r="16" fill={H.mint} />
        <path d="M 156 694 l 6 7 l 12 -14" fill="none" stroke={H.paper} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="192" y="702" fill={H.ink} fontFamily="Inter, sans-serif" fontSize="22" fontWeight="700">
          Do
        </text>
        <text x="164" y="748" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="19">
          One primary action per view. Reach for
        </text>
        <text x="164" y="778" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="19">
          secondary for everything else.
        </text>
      </g>
      <g>
        <rect x="840" y="648" width="640" height="180" rx="20" fill={H.cloud} stroke={H.red} strokeWidth="2" />
        <circle cx="884" cy="694" r="16" fill={H.red} />
        <path d="M 877 687 l 14 14 M 891 687 l -14 14" fill="none" stroke={H.paper} strokeWidth="3.5" strokeLinecap="round" />
        <text x="912" y="702" fill={H.ink} fontFamily="Inter, sans-serif" fontSize="22" fontWeight="700">
          Don’t
        </text>
        <text x="884" y="748" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="19">
          Stack three primaries and let the user
        </text>
        <text x="884" y="778" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="19">
          guess which one you meant.
        </text>
      </g>

      {/* count chip — sits clear of the button row's focus ring (ends x≈1052) */}
      <g>
        <rect x="1210" y="266" width="270" height="130" rx="20" fill={H.slateBlue} />
        <text x="1345" y="336" fill={H.paper} fontFamily="Sora, sans-serif" fontSize="58" fontWeight="800" textAnchor="middle" letterSpacing="-2">
          100+
        </text>
        <text x="1345" y="370" fill={H.sky} fontFamily="Inter, sans-serif" fontSize="19" textAnchor="middle">
          components shipped
        </text>
      </g>
    </Frame>
  );
}

/**
 * Impact — accessibility built in, shown as the contrast grid that every token
 * pair has to clear. The case study says a11y stopped being an afterthought;
 * this is what that looks like as an artifact.
 */
function A11y() {
  const pairs = [
    { fg: "text.primary", bg: "surface", ratio: "15.8", pass: true, fgHex: H.ink, bgHex: H.paper },
    { fg: "text.muted", bg: "surface", ratio: "5.9", pass: true, fgHex: H.slate, bgHex: H.paper },
    { fg: "on.action", bg: "action.primary", ratio: "7.1", pass: true, fgHex: H.paper, bgHex: H.slateBlue },
    { fg: "text.primary", bg: "surface.sunk", ratio: "14.2", pass: true, fgHex: H.ink, bgHex: H.cloud },
    { fg: "accent.500", bg: "surface", ratio: "3.9", pass: false, fgHex: H.copper, bgHex: H.paper },
    { fg: "on.danger", bg: "danger", ratio: "5.4", pass: true, fgHex: H.paper, bgHex: H.red },
  ];
  return (
    <Frame>
      <rect width="1600" height="900" fill={H.mist} />
      <text
        x="120"
        y="126"
        fill={H.slateBlue}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
      >
        IMPACT
      </text>
      <text
        x="120"
        y="192"
        fill={H.ink}
        fontFamily="Sora, sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-2"
      >
        Accessibility, built in.
      </text>
      <text x="120" y="244" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="24">
        Every token pair carries its contrast ratio. Fail the gate, fail the build.
      </text>

      {/* contrast grid */}
      {pairs.map((p, i) => {
        const cx = 120 + (i % 3) * 460;
        const cy = 296 + Math.floor(i / 3) * 216;
        return (
          <g key={`${p.fg}-${p.bg}`}>
            <rect x={cx} y={cy} width="400" height="180" rx="18" fill={p.bgHex} stroke={H.line} strokeWidth="2" />
            <text x={cx + 28} y={cy + 74} fill={p.fgHex} fontFamily="Sora, sans-serif" fontSize="32" fontWeight="700">
              Aa
            </text>
            <text x={cx + 88} y={cy + 74} fill={p.fgHex} fontFamily="Inter, sans-serif" fontSize="19">
              {p.fg} on {p.bg}
            </text>
            {/* ratio + verdict */}
            <rect
              x={cx + 28}
              y={cy + 104}
              width="150"
              height="44"
              rx="22"
              fill={p.pass ? H.mint : H.red}
            />
            <text
              x={cx + 103}
              y={cy + 133}
              fill={H.paper}
              fontFamily="Sora, sans-serif"
              fontSize="20"
              fontWeight="700"
              textAnchor="middle"
            >
              {p.ratio}:1
            </text>
            <text
              x={cx + 194}
              y={cy + 133}
              fill={p.pass ? (p.bgHex === H.paper || p.bgHex === H.cloud ? H.slate : H.paper) : H.red}
              fontFamily="Inter, sans-serif"
              fontSize="18"
              fontWeight="600"
            >
              {p.pass ? "AA pass" : "large text only"}
            </text>
          </g>
        );
      })}

      {/* impact stats */}
      {[
        { value: "+60%", label: "design-dev parity" },
        { value: "2×", label: "ship velocity" },
        { value: "100+", label: "components" },
      ].map((s, i) => {
        const cx = 120 + i * 460;
        return (
          <g key={s.label}>
            <rect x={cx} y="740" width="400" height="120" rx="18" fill={H.paper} stroke={H.line} strokeWidth="2" />
            <text x={cx + 32} y="818" fill={H.slateBlue} fontFamily="Sora, sans-serif" fontSize="52" fontWeight="800" letterSpacing="-2">
              {s.value}
            </text>
            <text x={cx + 380} y="818" fill={H.slate} fontFamily="Inter, sans-serif" fontSize="21" textAnchor="end">
              {s.label}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

const scenes: Record<Scene, () => React.JSX.Element> = {
  tokens: Tokens,
  drift: Drift,
  "token-layer": TokenLayer,
  components: Components,
  a11y: A11y,
};

export function SystemAsset({ scene, className, alt }: SystemAssetProps) {
  const Scene = scenes[scene];
  return (
    <div
      // Empty alt = decorative (e.g. a card thumbnail whose heading already
      // names the project): expose nothing rather than a paragraph of alt text.
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn("relative overflow-hidden bg-white shadow-soft", className)}
    >
      <Scene />
    </div>
  );
}

/** Ordered scenes for the case-study gallery (hero first, then blocks). */
export const systemScenes: { scene: Scene; alt: string }[] = [
  {
    scene: "tokens",
    alt: "Halyard's token sheet — six named color swatches (brand, accent, success, danger) each labelled with its code name, a spacing scale from 4 to 48 pixels, and a four-step type scale from Display to Caption.",
  },
  {
    scene: "drift",
    alt: "The drift problem — the same Continue button rebuilt six different ways by six teams, each annotated with its own mismatched hex, corner radius, and height.",
  },
  {
    scene: "token-layer",
    alt: "The semantic token layer — a table mapping tokens like surface.raised and action.primary to their light value, dark value, and CSS custom property name, showing the same name is used in Figma and in the browser.",
  },
  {
    scene: "components",
    alt: "The component library — button states (default, hover, focus, disabled), input states (rest, focus, error with a validation message), a '100+ components shipped' card, and paired Do and Don't usage guidance.",
  },
  {
    scene: "a11y",
    alt: "The accessibility contrast grid — six token pairs each showing sample text with its measured contrast ratio and an AA pass verdict, with one accent pair flagged as large-text-only, above impact stats of +60% design-dev parity, 2× ship velocity, and 100+ components.",
  },
];
