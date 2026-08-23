import { cn } from "@/lib/utils";

/**
 * Northwind — fictional marketing-site case study assets.
 *
 * Hand-built SVG "mockups" standing in for the real marketing site described in
 * the Northwind case study (a team-analytics SaaS). Like Aperture, Northwind is
 * a DISTINCT fictional client, so it carries its OWN identity — a bright cyan
 * with a coral accent — deliberately separate from the portfolio's emerald/ink
 * tokens AND from Aperture's indigo/amber. Each set standing on its own is the
 * point: these are client brands, not the portfolio's brand.
 *
 * The scenes render the site itself: a hero landing view, a value-prop section,
 * a social-proof / analytics-dashboard section, and the mobile responsive view.
 * A common browser/device chrome and the cyan→coral system tie them together.
 *
 * Swap any of these for a real <Image /> (a Figma export or screenshot) when
 * ready. Each scene is decorative-with-meaning, so we expose an accessible
 * label via role="img" + aria-label on the wrapper.
 */

// Northwind's own palette (self-contained; not portfolio tokens on purpose).
// Brand refreshed to a cyan mark + wordmark (see public/work/northwind/ exports);
// `cobalt` is kept as the primary brand token name but now points at the cyan.
const N = {
  ink: "#0B1B3A", // deep navy text/ink
  cobalt: "#22D3EE", // primary brand (cyan tile / large fills)
  cobaltText: "#0E7490", // AA-safe cyan for text / thin lines on light bg
  cobaltDeep: "#0E9FB8", // cyan shade for gradients
  sky: "#67E8F9", // chart bars / secondary accent (cyan tint)
  coral: "#FB6F5B",
  coralSoft: "#FDA894",
  paper: "#FFFFFF",
  mist: "#ECFEFF", // page background tint (cyan-tinted)
  cloud: "#F6FCFD", // panel fill
  line: "#D3EEF3", // hairline borders (cyan-tinted)
  slate: "#5B6B8C", // muted body text
};

type Scene = "hero" | "value-props" | "social-proof" | "mobile";

type MarketingAssetProps = {
  scene: Scene;
  className?: string;
  /** Accessible description of the deliverable. */
  alt: string;
};

/** Rounded browser window with a traffic-light bar and a URL pill. */
function BrowserChrome({
  x,
  y,
  w,
  h,
  url = "northwind.app",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  url?: string;
}) {
  const bar = 56;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="24"
        fill={N.paper}
        stroke={N.line}
        strokeWidth="2"
      />
      {/* top bar */}
      <path
        d={`M ${x} ${y + 24} a 24 24 0 0 1 24 -24 h ${w - 48} a 24 24 0 0 1 24 24 v ${bar - 24} h ${-w} Z`}
        fill={N.cloud}
      />
      <line x1={x} y1={y + bar} x2={x + w} y2={y + bar} stroke={N.line} strokeWidth="2" />
      <circle cx={x + 30} cy={y + 28} r="7" fill="#FF5F57" />
      <circle cx={x + 54} cy={y + 28} r="7" fill="#FEBC2E" />
      <circle cx={x + 78} cy={y + 28} r="7" fill="#28C840" />
      <rect x={x + 120} y={y + 14} width={w - 200} height="28" rx="14" fill={N.paper} stroke={N.line} strokeWidth="1.5" />
      <text
        x={x + 140}
        y={y + 34}
        fill={N.slate}
        fontFamily="Inter, sans-serif"
        fontSize="20"
      >
        {url}
      </text>
    </g>
  );
}

/**
 * Northwind wordmark: the cyan tile mark (up/down triangles) + name.
 * Mark geometry mirrors public/work/northwind/Logo Mark — Export Ready.svg
 * (a 32×32 tile), placed on the scene's 36×36 tile at (0,-26): triangles are
 * scaled ×1.125 and shifted up 26px to match.
 */
function Wordmark({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* mark tile */}
      <rect x="0" y="-26" width="36" height="36" rx="10" fill={N.cobalt} />
      {/* up triangle (solid) + down triangle (dimmed), from the export */}
      <g transform="translate(0 -26) scale(1.125)">
        <path d="M16 6.5L20.1136 13.625H11.8864L16 6.5Z" fill={N.ink} />
        <path opacity="0.4" d="M16 25.5L11.8864 18.375H20.1136L16 25.5Z" fill={N.ink} />
      </g>
      <text x="48" y="3" fill={N.ink} fontFamily="Sora, sans-serif" fontSize="30" fontWeight="700" letterSpacing="-1">
        Northwind
      </text>
    </g>
  );
}

/** A small pill button. */
function Button({
  x,
  y,
  w,
  label,
  filled = true,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  filled?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height="46"
        rx="23"
        fill={filled ? N.coral : "none"}
        stroke={filled ? "none" : N.line}
        strokeWidth="2"
      />
      <text
        x={x + w / 2}
        y={y + 30}
        fill={filled ? N.paper : N.ink}
        fontFamily="Inter, sans-serif"
        fontSize="20"
        fontWeight="600"
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
}

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

/** Hero landing view — nav, headline, dual CTA, and a product preview panel. */
function Hero() {
  return (
    <Frame>
      <defs>
        <linearGradient id="nw-hero-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={N.mist} />
          <stop offset="100%" stopColor={N.paper} />
        </linearGradient>
        <linearGradient id="nw-preview" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={N.cobalt} />
          <stop offset="100%" stopColor={N.cobaltDeep} />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#nw-hero-bg)" />

      {/* nav */}
      <Wordmark x={110} y={100} />
      <g fill={N.slate} fontFamily="Inter, sans-serif" fontSize="22">
        <text x="900" y="102">Product</text>
        <text x="1050" y="102">Pricing</text>
        <text x="1180" y="102">Docs</text>
      </g>
      <Button x={1310} y={72} w={180} label="Start free" />

      {/* headline — three tight lines so it never reaches the preview card at x=820 */}
      <text x="110" y="300" fill={N.ink} fontFamily="Sora, sans-serif" fontSize="80" fontWeight="800" letterSpacing="-3">
        See what
      </text>
      <text x="110" y="390" fill={N.ink} fontFamily="Sora, sans-serif" fontSize="80" fontWeight="800" letterSpacing="-3">
        your team
      </text>
      <text x="110" y="480" fill={N.ink} fontFamily="Sora, sans-serif" fontSize="80" fontWeight="800" letterSpacing="-3">
        actually <tspan fill={N.cobaltText}>ships</tspan>.
      </text>
      <text x="112" y="548" fill={N.slate} fontFamily="Inter, sans-serif" fontSize="28">
        Northwind turns raw activity into clear,
      </text>
      <text x="112" y="586" fill={N.slate} fontFamily="Inter, sans-serif" fontSize="28">
        weekly signals, no dashboards to babysit.
      </text>
      <Button x={110} y={636} w={230} label="Start free trial" />
      <Button x={360} y={636} w={210} label="Book a demo" filled={false} />

      {/* product preview card */}
      <g>
        <rect x="820" y="200" width="680" height="470" rx="24" fill={N.paper} stroke={N.line} strokeWidth="2" />
        <rect x="820" y="200" width="680" height="470" rx="24" fill="url(#nw-preview)" opacity="0.06" />
        <text x="856" y="256" fill={N.ink} fontFamily="Sora, sans-serif" fontSize="26" fontWeight="700">This week</text>
        {/* mini bar chart */}
        {[120, 200, 160, 260, 220, 320, 280].map((barH, i) => (
          <rect
            key={i}
            x={860 + i * 74}
            y={620 - barH}
            width="44"
            height={barH}
            rx="8"
            fill={i === 5 ? N.coral : N.sky}
          />
        ))}
        <line x1="856" y1="620" x2="1464" y2="620" stroke={N.line} strokeWidth="2" />
        {/* rising trend line */}
        <path d="M 878 560 L 952 520 L 1026 540 L 1100 470 L 1174 490 L 1248 410 L 1322 440" fill="none" stroke={N.cobaltText} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* trust strip */}
      <text x="110" y="740" fill={N.slate} fontFamily="Inter, sans-serif" fontSize="20" letterSpacing="4">
        TRUSTED BY FAST-MOVING TEAMS
      </text>
      <g fill={N.line}>
        <rect x="110" y="770" width="150" height="34" rx="8" />
        <rect x="290" y="770" width="120" height="34" rx="8" />
        <rect x="440" y="770" width="160" height="34" rx="8" />
        <rect x="630" y="770" width="130" height="34" rx="8" />
      </g>
    </Frame>
  );
}

/** Value-props section — three feature cards with icons. */
function ValueProps() {
  const cards: { title: string; body: string; icon: "signal" | "plug" | "people" }[] = [
    { title: "Weekly signals", body: "The three things that\nmoved, surfaced for you.", icon: "signal" },
    { title: "Zero setup", body: "Connect once. No\ndashboards to maintain.", icon: "plug" },
    { title: "Shared context", body: "Everyone sees the same\npicture, in Slack.", icon: "people" },
  ];
  return (
    <Frame>
      <rect width="1600" height="900" fill={N.cloud} />
      <text x="800" y="180" fill={N.cobaltText} fontFamily="Inter, sans-serif" fontSize="24" fontWeight="600" letterSpacing="6" textAnchor="middle">
        WHY NORTHWIND
      </text>
      <text x="800" y="260" fill={N.ink} fontFamily="Sora, sans-serif" fontSize="58" fontWeight="800" letterSpacing="-2" textAnchor="middle">
        Clarity, not more charts.
      </text>

      {cards.map((c, i) => {
        const cx = 150 + i * 445;
        return (
          <g key={c.title}>
            <rect x={cx} y="360" width="400" height="380" rx="24" fill={N.paper} stroke={N.line} strokeWidth="2" />
            {/* icon tile — a distinct glyph per card */}
            <rect x={cx + 40} y="400" width="80" height="80" rx="20" fill={N.mist} />
            {c.icon === "signal" && (
              // rising bars
              <g>
                <rect x={cx + 58} y="452" width="12" height="16" rx="3" fill={N.cobalt} />
                <rect x={cx + 74} y="440" width="12" height="28" rx="3" fill={N.cobalt} />
                <rect x={cx + 90} y="424" width="12" height="44" rx="3" fill={N.coral} />
              </g>
            )}
            {c.icon === "plug" && (
              // lightning bolt
              <path d={`M ${cx + 86} 418 L ${cx + 66} 446 L ${cx + 80} 446 L ${cx + 74} 466 L ${cx + 96} 436 L ${cx + 82} 436 Z`} fill={N.cobalt} stroke={N.coral} strokeWidth="2" strokeLinejoin="round" />
            )}
            {c.icon === "people" && (
              // two overlapping avatars
              <g>
                <circle cx={cx + 74} cy="436" r="12" fill={N.cobalt} />
                <path d={`M ${cx + 60} 466 a 14 14 0 0 1 28 0 Z`} fill={N.cobalt} />
                <circle cx={cx + 92} cy="436" r="12" fill={N.coral} />
                <path d={`M ${cx + 78} 466 a 14 14 0 0 1 28 0 Z`} fill={N.coral} />
              </g>
            )}
            <text x={cx + 40} y="560" fill={N.ink} fontFamily="Sora, sans-serif" fontSize="34" fontWeight="700">
              {c.title}
            </text>
            {c.body.split("\n").map((ln, k) => (
              <text key={k} x={cx + 40} y={615 + k * 40} fill={N.slate} fontFamily="Inter, sans-serif" fontSize="26">
                {ln}
              </text>
            ))}
          </g>
        );
      })}
    </Frame>
  );
}

/** Social-proof section — headline metrics + a testimonial and a CTA band. */
function SocialProof() {
  const stats = [
    { value: "+22%", label: "trial conversion" },
    { value: "4.9/5", label: "customer rating" },
    { value: "12k+", label: "teams onboarded" },
  ];
  return (
    <Frame>
      <defs>
        {/* ink→deep-cyan keeps white CTA text legible (bright cyan is too light) */}
        <linearGradient id="nw-cta" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={N.ink} />
          <stop offset="100%" stopColor={N.cobaltDeep} />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={N.paper} />

      {/* stat row */}
      {stats.map((s, i) => {
        const cx = 267 + i * 533;
        return (
          <g key={s.label}>
            <text x={cx} y="230" fill={N.cobaltText} fontFamily="Sora, sans-serif" fontSize="90" fontWeight="800" textAnchor="middle" letterSpacing="-3">
              {s.value}
            </text>
            <text x={cx} y="280" fill={N.slate} fontFamily="Inter, sans-serif" fontSize="28" textAnchor="middle">
              {s.label}
            </text>
          </g>
        );
      })}

      {/* testimonial */}
      <rect x="150" y="350" width="1300" height="220" rx="24" fill={N.cloud} stroke={N.line} strokeWidth="2" />
      <text x="200" y="420" fill={N.coral} fontFamily="Sora, sans-serif" fontSize="80" fontWeight="800">“</text>
      <text x="260" y="440" fill={N.ink} fontFamily="Sora, sans-serif" fontSize="38" fontWeight="600">
        We replaced three dashboards with one Monday-morning email.
      </text>
      <text x="260" y="500" fill={N.slate} fontFamily="Inter, sans-serif" fontSize="26">
        Priya Nair · Head of Engineering, Lumen Labs
      </text>

      {/* CTA band */}
      <rect x="150" y="620" width="1300" height="180" rx="28" fill="url(#nw-cta)" />
      <text x="210" y="705" fill={N.paper} fontFamily="Sora, sans-serif" fontSize="46" fontWeight="800" letterSpacing="-1">
        Start seeing signals this week.
      </text>
      <text x="210" y="752" fill={N.sky} fontFamily="Inter, sans-serif" fontSize="26">
        Free 14-day trial · no credit card
      </text>
      <rect x="1140" y="670" width="230" height="60" rx="30" fill={N.coral} />
      <text x="1255" y="708" fill={N.paper} fontFamily="Inter, sans-serif" fontSize="24" fontWeight="700" textAnchor="middle">
        Start free
      </text>
    </Frame>
  );
}

/** Mobile responsive view — the same hero as a phone screen. */
function Mobile() {
  const px = 640;
  const py = 70;
  const pw = 320;
  const ph = 760;
  return (
    <Frame>
      <rect width="1600" height="900" fill={N.mist} />
      <text x="200" y="360" fill={N.cobaltText} fontFamily="Inter, sans-serif" fontSize="24" fontWeight="600" letterSpacing="6">
        RESPONSIVE
      </text>
      <text x="200" y="440" fill={N.ink} fontFamily="Sora, sans-serif" fontSize="60" fontWeight="800" letterSpacing="-2">
        Designed
      </text>
      <text x="200" y="510" fill={N.ink} fontFamily="Sora, sans-serif" fontSize="60" fontWeight="800" letterSpacing="-2">
        mobile-first.
      </text>
      <text x="202" y="575" fill={N.slate} fontFamily="Inter, sans-serif" fontSize="26">
        Every breakpoint is a real design,
      </text>
      <text x="202" y="612" fill={N.slate} fontFamily="Inter, sans-serif" fontSize="26">
        not an afterthought.
      </text>

      {/* phone */}
      <rect x={px} y={py} width={pw} height={ph} rx="46" fill={N.ink} />
      <rect x={px + 12} y={py + 12} width={pw - 24} height={ph - 24} rx="36" fill={N.paper} />
      {/* notch */}
      <rect x={px + pw / 2 - 45} y={py + 20} width="90" height="22" rx="11" fill={N.ink} />

      {/* screen content */}
      <Wordmark x={px + 40} y={py + 100} scale={0.7} />
      <text x={px + 40} y={py + 210} fill={N.ink} fontFamily="Sora, sans-serif" fontSize="34" fontWeight="800" letterSpacing="-1">
        See what
      </text>
      <text x={px + 40} y={py + 250} fill={N.ink} fontFamily="Sora, sans-serif" fontSize="34" fontWeight="800" letterSpacing="-1">
        your team
      </text>
      <text x={px + 40} y={py + 290} fill={N.cobaltText} fontFamily="Sora, sans-serif" fontSize="34" fontWeight="800" letterSpacing="-1">
        ships.
      </text>
      <rect x={px + 40} y={py + 320} width={pw - 80} height="48" rx="24" fill={N.coral} />
      <text x={px + pw / 2} y={py + 351} fill={N.paper} fontFamily="Inter, sans-serif" fontSize="20" fontWeight="600" textAnchor="middle">
        Start free trial
      </text>

      {/* mini preview card with bars */}
      <rect x={px + 40} y={py + 400} width={pw - 80} height="270" rx="18" fill={N.cloud} stroke={N.line} strokeWidth="2" />
      {[70, 110, 90, 150, 130].map((barH, i) => (
        <rect
          key={i}
          x={px + 62 + i * 50}
          y={py + 630 - barH}
          width="32"
          height={barH}
          rx="6"
          fill={i === 3 ? N.coral : N.sky}
        />
      ))}
    </Frame>
  );
}

const scenes: Record<Scene, () => React.JSX.Element> = {
  hero: Hero,
  "value-props": ValueProps,
  "social-proof": SocialProof,
  mobile: Mobile,
};

export function MarketingAsset({ scene, className, alt }: MarketingAssetProps) {
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
export const marketingScenes: { scene: Scene; alt: string }[] = [
  {
    scene: "hero",
    alt: "Northwind homepage hero with a nav bar, the headline 'See what your team actually ships,' start-trial and demo buttons, and a product preview card with a weekly bar chart and rising trend line.",
  },
  {
    scene: "value-props",
    alt: "Value-props section with three feature cards (Weekly signals, Zero setup, Shared context) under the heading 'Clarity, not more charts.'",
  },
  {
    scene: "social-proof",
    alt: "Social-proof section with headline metrics (+22% trial conversion, 4.9/5 rating, 12k+ teams), a customer testimonial, and a cobalt call-to-action band.",
  },
  {
    scene: "mobile",
    alt: "Responsive view showing the Northwind hero on a phone screen beside the label 'Designed mobile-first,' with the wordmark, headline, trial button, and a mini bar chart.",
  },
];
