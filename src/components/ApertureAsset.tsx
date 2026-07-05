import { cn } from "@/lib/utils";

/**
 * Aperture — fictional brand-identity case study assets.
 *
 * These are hand-built SVG "deliverables" standing in for the real brand work
 * described in the Aperture case study (logo, color, type, usage). Aperture is
 * a DISTINCT fictional client, so it carries its OWN identity — a warm
 * indigo/violet with an amber "light through a lens" highlight — deliberately
 * separate from the portfolio's emerald/ink tokens. That separation is the
 * point: a brand case study should show a brand that stands on its own.
 *
 * The lens/diaphragm motif (a hexagonal iris of six blades around a bright
 * center) runs through every scene so the set reads as one system.
 *
 * Swap any of these for a real <Image /> (a Figma export) when ready — see the
 * companion Figma-agent brief. Each scene is decorative-with-meaning, so we
 * expose an accessible label via role="img" + aria-label.
 */

// Aperture's own palette (self-contained; not portfolio tokens on purpose).
const A = {
  ink: "#171326", // deep aubergine-ink
  indigo: "#4F46E5",
  indigoDeep: "#312E81",
  violet: "#7C6CF0",
  amber: "#F5A524",
  amberSoft: "#FBCB6B",
  paper: "#FBFAFF",
  mist: "#EEEBFB",
  line: "#D8D2F2",
};

type Scene =
  | "logo-construction"
  | "logomark"
  | "palette"
  | "type-specimen"
  | "usage";

type ApertureAssetProps = {
  scene: Scene;
  className?: string;
  /** Accessible description of the deliverable. */
  alt: string;
};

/** Six-blade aperture iris. cx/cy/r place it; `open` (0–1) sets the opening. */
function Iris({
  cx,
  cy,
  r,
  open = 0.42,
  bladeFill = A.indigo,
  centerFill = A.amber,
  bladeOpacity = 1,
}: {
  cx: number;
  cy: number;
  r: number;
  open?: number;
  bladeFill?: string;
  centerFill?: string;
  bladeOpacity?: number;
}) {
  const blades = 6;
  const inner = r * open; // radius of the central opening (flat-to-flat)
  const paths: string[] = [];
  // A real diaphragm blade is a straight-edged leaf: its inner edge is a CHORD
  // of the opening (tangent to the inner hexagon), and consecutive blades
  // OVERLAP. Each blade spans two outer vertices; its inner edge is the chord
  // between the two opening vertices that sit "behind" the next blade, so the
  // straight cuts form a clean hexagonal hole instead of a pointed star.
  const vert = (rad: number, k: number) => {
    const a = (k / blades) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad] as const;
  };
  for (let i = 0; i < blades; i++) {
    const [ox, oy] = vert(r, i);
    const [nx, ny] = vert(r, i + 1);
    // inner chord shifted one vertex forward → overlapping straight blades
    const [ix, iy] = vert(inner, i + 1);
    const [jx, jy] = vert(inner, i + 2);
    paths.push(`M ${ox} ${oy} L ${nx} ${ny} L ${jx} ${jy} L ${ix} ${iy} Z`);
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={centerFill} />
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={bladeFill}
          fillOpacity={bladeOpacity}
          stroke={A.paper}
          strokeWidth={r * 0.018}
          strokeLinejoin="round"
        />
      ))}
      {/* thin rim ties the blades into a lens barrel */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={A.paper}
        strokeWidth={r * 0.03}
        strokeOpacity="0.9"
      />
    </g>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  // `meet` fits the whole 1600×900 artboard inside the (also 16:9) container,
  // so text near the edges is never cropped. Each scene paints a full-bleed
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

function LogoConstruction() {
  return (
    <Frame>
      <rect width="1600" height="900" fill={A.paper} />
      {/* construction grid */}
      <g stroke={A.line} strokeWidth="1.5">
        {Array.from({ length: 17 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="900" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 100} x2="1600" y2={i * 100} />
        ))}
      </g>
      {/* circle guides */}
      <g fill="none" stroke={A.violet} strokeWidth="2.5" strokeDasharray="10 8" opacity="0.7">
        <circle cx="800" cy="450" r="300" />
        <circle cx="800" cy="450" r="210" />
        <circle cx="800" cy="450" r="126" />
      </g>
      <Iris cx={800} cy={450} r={300} open={0.42} />
      {/* radial measure ticks */}
      <g stroke={A.indigoDeep} strokeWidth="3">
        <line x1="800" y1="90" x2="800" y2="150" />
        <line x1="800" y1="750" x2="800" y2="810" />
        <line x1="440" y1="450" x2="500" y2="450" />
        <line x1="1100" y1="450" x2="1160" y2="450" />
      </g>
    </Frame>
  );
}

function Logomark() {
  return (
    <Frame>
      <defs>
        <radialGradient id="ap-bg" cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor={A.indigoDeep} />
          <stop offset="100%" stopColor={A.ink} />
        </radialGradient>
        <radialGradient id="ap-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={A.amberSoft} />
          <stop offset="100%" stopColor={A.amber} />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#ap-bg)" />
      {/* soft lens flare */}
      <circle cx="500" cy="360" r="360" fill={A.violet} opacity="0.14" />
      <Iris
        cx={500}
        cy={450}
        r={215}
        open={0.4}
        bladeFill={A.violet}
        centerFill="url(#ap-glow)"
      />
      <text
        x="820"
        y="435"
        fill={A.paper}
        fontFamily="Sora, sans-serif"
        fontSize="132"
        fontWeight="700"
        letterSpacing="-4"
      >
        Aperture
      </text>
      <text
        x="824"
        y="520"
        fill={A.amberSoft}
        fontFamily="Inter, sans-serif"
        fontSize="38"
        letterSpacing="12"
      >
        BRAND SYSTEM
      </text>
    </Frame>
  );
}

function Palette() {
  const swatches = [
    { name: "Ink", hex: A.ink, text: A.paper },
    { name: "Indigo", hex: A.indigo, text: A.paper },
    { name: "Deep", hex: A.indigoDeep, text: A.paper },
    { name: "Violet", hex: A.violet, text: A.ink },
    { name: "Amber", hex: A.amber, text: A.ink },
    { name: "Mist", hex: A.mist, text: A.ink },
  ];
  const w = 1600 / swatches.length;
  return (
    <Frame>
      <rect width="1600" height="900" fill={A.paper} />
      {swatches.map((s, i) => (
        <g key={s.name}>
          <rect x={i * w} y="0" width={w} height="620" fill={s.hex} />
          <text
            x={i * w + 40}
            y="560"
            fill={s.text}
            fontFamily="Sora, sans-serif"
            fontSize="44"
            fontWeight="600"
          >
            {s.name}
          </text>
          <text
            x={i * w + 40}
            y="710"
            fill={A.ink}
            fontFamily="Inter, sans-serif"
            fontSize="30"
            letterSpacing="2"
          >
            {s.hex.toUpperCase()}
          </text>
          <text
            x={i * w + 40}
            y="760"
            fill={A.indigo}
            fontFamily="Inter, sans-serif"
            fontSize="26"
          >
            {`0${i + 1}`}
          </text>
        </g>
      ))}
    </Frame>
  );
}

function TypeSpecimen() {
  return (
    <Frame>
      <rect width="1600" height="900" fill={A.ink} />
      <Iris cx={1360} cy={200} r={150} open={0.44} bladeFill={A.indigo} />
      <text x="120" y="230" fill={A.amberSoft} fontFamily="Inter, sans-serif" fontSize="34" letterSpacing="10">
        TYPEFACE — SORA / INTER
      </text>
      <text x="112" y="430" fill={A.paper} fontFamily="Sora, sans-serif" fontSize="230" fontWeight="700" letterSpacing="-8">
        Aa
      </text>
      <text x="520" y="360" fill={A.violet} fontFamily="Sora, sans-serif" fontSize="90" fontWeight="700">
        Focus the frame.
      </text>
      <text x="522" y="450" fill={A.mist} fontFamily="Inter, sans-serif" fontSize="40">
        The quick brown fox jumps over the lazy dog.
      </text>
      <text x="120" y="640" fill={A.line} fontFamily="Inter, sans-serif" fontSize="34" letterSpacing="6">
        ABCDEFGHIJKLMNOPQRSTUVWXYZ
      </text>
      <text x="120" y="710" fill={A.line} fontFamily="Inter, sans-serif" fontSize="34" letterSpacing="6">
        abcdefghijklmnopqrstuvwxyz 0123456789
      </text>
    </Frame>
  );
}

function Usage() {
  return (
    <Frame>
      <rect width="1600" height="900" fill={A.mist} />
      {/* clearspace panel */}
      <rect x="80" y="90" width="700" height="720" rx="28" fill={A.paper} stroke={A.line} strokeWidth="2" />
      <g stroke={A.violet} strokeWidth="2" strokeDasharray="8 8" fill="none">
        <rect x="230" y="240" width="400" height="420" />
      </g>
      <Iris cx={430} cy={410} r={150} open={0.4} bladeFill={A.indigo} />
      <text x="430" y="740" fill={A.ink} fontFamily="Inter, sans-serif" fontSize="30" textAnchor="middle" letterSpacing="4">
        CLEARSPACE = 1× IRIS RADIUS
      </text>

      {/* do / don't panel */}
      <rect x="840" y="90" width="680" height="345" rx="24" fill={A.paper} stroke={A.line} strokeWidth="2" />
      <Iris cx={980} cy={260} r={95} open={0.4} bladeFill={A.indigo} />
      <text x="1120" y="250" fill="#1E7A46" fontFamily="Sora, sans-serif" fontSize="46" fontWeight="700">✓ Do</text>
      <text x="1120" y="310" fill={A.ink} fontFamily="Inter, sans-serif" fontSize="30">Full-color on light</text>

      <rect x="840" y="465" width="680" height="345" rx="24" fill={A.paper} stroke={A.line} strokeWidth="2" />
      <g opacity="0.55">
        <Iris cx={980} cy={635} r={95} open={0.4} bladeFill="#9AA0A6" centerFill="#C4C7CC" />
      </g>
      <line x1="905" y1="560" x2="1055" y2="710" stroke="#C2352F" strokeWidth="7" strokeLinecap="round" />
      <text x="1120" y="625" fill="#C2352F" fontFamily="Sora, sans-serif" fontSize="46" fontWeight="700">✕ Don&apos;t</text>
      <text x="1120" y="685" fill={A.ink} fontFamily="Inter, sans-serif" fontSize="30">Desaturate the mark</text>
    </Frame>
  );
}

const scenes: Record<Scene, () => React.JSX.Element> = {
  "logo-construction": LogoConstruction,
  logomark: Logomark,
  palette: Palette,
  "type-specimen": TypeSpecimen,
  usage: Usage,
};

export function ApertureAsset({ scene, className, alt }: ApertureAssetProps) {
  const Scene = scenes[scene];
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("relative overflow-hidden bg-white shadow-soft", className)}
    >
      <Scene />
    </div>
  );
}

/** Ordered scenes for the case-study gallery (hero first, then blocks). */
export const apertureScenes: { scene: Scene; alt: string }[] = [
  {
    scene: "logomark",
    alt: "Aperture logo reveal — the violet lens mark with its glowing amber center animates in beside the 'Aperture' wordmark and the tagline 'Focus the frame.', on a deep indigo field.",
  },
  {
    scene: "logo-construction",
    alt: "Logo construction sheet — the aperture mark built on a modular grid with concentric circle guides and measurement ticks.",
  },
  {
    scene: "palette",
    alt: "Color palette — six swatches from ink and indigo through violet and amber to a light mist, each labeled with its hex value.",
  },
  {
    scene: "type-specimen",
    alt: "Type specimen — a large Aa in Sora with the tagline 'Focus the frame.' and the full alphabet, on a dark ink background.",
  },
  {
    scene: "usage",
    alt: "Usage guidelines — logo clearspace defined as one iris radius, with correct full-color and incorrect desaturated do/don't examples.",
  },
];
