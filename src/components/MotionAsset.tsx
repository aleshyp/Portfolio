"use client";

import { cn } from "@/lib/utils";
import { useStableReducedMotion } from "@/lib/useStableReducedMotion";
import type { MotionScene } from "./motionScenes";

/**
 * Cadence — fictional music-streaming brand, motion-identity case study assets.
 *
 * Hand-built SVG mockups standing in for the motion system described in the
 * "Brand in Motion" case study. Like the other studies, Cadence is a DISTINCT
 * fictional client carrying its OWN identity — an electric magenta-to-indigo
 * with a signal-green accent — deliberately separate from the portfolio's
 * emerald/ink tokens AND from Aperture, Northwind, Lumin, Fernweh and Halyard.
 * Each set standing on its own is the point: these are client products, not the
 * portfolio's brand.
 *
 * A motion case study that doesn't move is a contradiction, so the hero and the
 * easing scene ACTUALLY ANIMATE, in SVG/SMIL — no video asset, no JS timeline.
 * Both honor prefers-reduced-motion by rendering the animation's end state
 * statically, consistent with the site's motion language (see AnimatedReveal
 * and LogoRevealHero). The remaining scenes are static artifacts: the easing
 * curves, the kinetic-type frames, and the transition library.
 *
 * Swap any of these for a real <Image /> or video when ready. Each scene is
 * decorative-with-meaning, so we expose an accessible label via role="img" +
 * aria-label on the wrapper.
 */

// Cadence's own palette (self-contained; not portfolio tokens on purpose).
const C = {
  ink: "#0A0616", // near-black violet stage
  inkSoft: "#151029",
  magenta: "#E6399B",
  magentaSoft: "#F77FC4",
  indigo: "#5B3DF5",
  indigoDeep: "#3A22B8",
  signal: "#37E0A0", // accent / "live" green
  paper: "#FFFFFF",
  mist: "#F4F1FF",
  line: "#2A2140", // on-dark hairline
  lineLight: "#E5E0F5", // on-light hairline
  slate: "#9A93B8", // muted text on dark
  slateDark: "#5F5880", // muted text on light
};

// Scene names + the ordered gallery data live in ./motionScenes so the server
// component can import them across this file's client boundary.
type Scene = MotionScene;

type MotionAssetProps = {
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

/**
 * Hero — the logo build, animated. Four bars rise and settle into the Cadence
 * mark, then the wordmark fades up: the "how the logo builds" the case study
 * describes. Under reduced motion the same composition renders at its end state.
 */
function LogoBuild({ still }: { still: boolean }) {
  // Bar geometry — the equaliser that resolves into the mark.
  const bars = [
    { x: 690, h: 150, delay: 0 },
    { x: 750, h: 260, delay: 0.12 },
    { x: 810, h: 200, delay: 0.24 },
    { x: 870, h: 110, delay: 0.36 },
  ];
  const baseY = 520;
  return (
    <Frame>
      <defs>
        <linearGradient id="cd-stage" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.inkSoft} />
          <stop offset="100%" stopColor={C.ink} />
        </linearGradient>
        <linearGradient id="cd-bar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={C.indigo} />
          <stop offset="100%" stopColor={C.magenta} />
        </linearGradient>
        <radialGradient id="cd-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={C.magenta} stopOpacity="0.35" />
          <stop offset="100%" stopColor={C.magenta} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#cd-stage)" />
      {/* stage glow behind the mark */}
      <circle cx="800" cy="430" r="300" fill="url(#cd-glow)" />

      {/* the equaliser bars building the mark */}
      {bars.map((b) => (
        <g key={b.x}>
          <rect
            x={b.x}
            y={still ? baseY - b.h : baseY}
            width="40"
            height={still ? b.h : 0}
            rx="20"
            fill="url(#cd-bar)"
          >
            {!still && (
              <>
                <animate
                  attributeName="height"
                  values={`0; ${b.h * 1.12}; ${b.h}`}
                  keyTimes="0; 0.7; 1"
                  dur="1.1s"
                  begin={`${b.delay}s`}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.22 1 0.36 1; 0.22 1 0.36 1"
                />
                <animate
                  attributeName="y"
                  values={`${baseY}; ${baseY - b.h * 1.12}; ${baseY - b.h}`}
                  keyTimes="0; 0.7; 1"
                  dur="1.1s"
                  begin={`${b.delay}s`}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.22 1 0.36 1; 0.22 1 0.36 1"
                />
              </>
            )}
          </rect>
        </g>
      ))}

      {/* baseline the bars sit on */}
      <line x1="640" y1={baseY} x2="960" y2={baseY} stroke={C.line} strokeWidth="3" strokeLinecap="round" />

      {/* wordmark fades up after the bars settle */}
      <g opacity={still ? 1 : 0}>
        {!still && (
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.5s"
            begin="1.0s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.22 1 0.36 1"
          />
        )}
        <text
          x="800"
          y="622"
          fill={C.paper}
          fontFamily="Sora, sans-serif"
          fontSize="76"
          fontWeight="800"
          letterSpacing="-3"
          textAnchor="middle"
        >
          Cadence
        </text>
        <text
          x="800"
          y="676"
          fill={C.magentaSoft}
          fontFamily="Inter, sans-serif"
          fontSize="24"
          fontWeight="600"
          letterSpacing="8"
          textAnchor="middle"
        >
          SOUND IN MOTION
        </text>
      </g>

      {/* corner label */}
      <text x="80" y="120" fill={C.slate} fontFamily="Inter, sans-serif" fontSize="22" fontWeight="600" letterSpacing="4">
        LOGO BUILD · 1.6s
      </text>
    </Frame>
  );
}

/**
 * Principles of motion — the easing curves, with a dot actually running each
 * one so the difference is felt rather than described. Reduced motion parks the
 * dots at the end of their travel.
 */
function Easing({ still }: { still: boolean }) {
  const curves = [
    {
      name: "Entrance",
      spec: "cubic-bezier(0.22, 1, 0.36, 1)",
      note: "Fast in, soft landing",
      path: "M 0 160 C 35 160 58 8 160 0",
      splines: "0.22 1 0.36 1",
      dur: "1.4s",
    },
    {
      name: "Exit",
      spec: "cubic-bezier(0.64, 0, 0.78, 0)",
      note: "Gathers speed, leaves",
      path: "M 0 160 C 102 160 125 8 160 0",
      splines: "0.64 0 0.78 0",
      dur: "1.4s",
    },
    {
      name: "Transition",
      spec: "cubic-bezier(0.65, 0, 0.35, 1)",
      note: "Even on both ends",
      path: "M 0 160 C 104 160 56 0 160 0",
      splines: "0.65 0 0.35 1",
      dur: "1.4s",
    },
  ];
  return (
    <Frame>
      <rect width="1600" height="900" fill={C.mist} />
      <text
        x="120"
        y="130"
        fill={C.indigo}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
      >
        PRINCIPLES OF MOTION
      </text>
      <text
        x="120"
        y="200"
        fill={C.ink}
        fontFamily="Sora, sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-2"
      >
        Decide how it moves. Then animate.
      </text>
      <text x="120" y="252" fill={C.slateDark} fontFamily="Inter, sans-serif" fontSize="24">
        Three curves, one point of view on weight and momentum.
      </text>

      {curves.map((c, i) => {
        const cx = 120 + i * 460;
        const cy = 320;
        return (
          <g key={c.name}>
            <rect x={cx} y={cy} width="400" height="440" rx="24" fill={C.paper} stroke={C.lineLight} strokeWidth="2" />

            {/* curve plot */}
            <g transform={`translate(${cx + 120} ${cy + 60})`}>
              {/* axes */}
              <line x1="0" y1="0" x2="0" y2="160" stroke={C.lineLight} strokeWidth="2" />
              <line x1="0" y1="160" x2="160" y2="160" stroke={C.lineLight} strokeWidth="2" />
              {/* the curve */}
              <path d={c.path} fill="none" stroke={C.magenta} strokeWidth="4" strokeLinecap="round" />
              {/* dot travelling the curve */}
              <circle r="9" fill={C.indigo} cx={still ? 160 : 0} cy={still ? 0 : 160}>
                {!still && (
                  <animateMotion dur={c.dur} repeatCount="indefinite" path={c.path} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines={c.splines} />
                )}
              </circle>
            </g>

            {/* a bar demonstrating the same curve in translation */}
            <g>
              <rect x={cx + 32} y={cy + 262} width="336" height="10" rx="5" fill={C.mist} />
              <circle cx={still ? cx + 358 : cx + 42} cy={cy + 267} r="11" fill={C.magenta}>
                {!still && (
                  <animate
                    attributeName="cx"
                    values={`${cx + 42}; ${cx + 358}`}
                    dur={c.dur}
                    repeatCount="indefinite"
                    calcMode="spline"
                    keySplines={c.splines}
                  />
                )}
              </circle>
            </g>

            <text x={cx + 32} y={cy + 330} fill={C.ink} fontFamily="Sora, sans-serif" fontSize="30" fontWeight="700">
              {c.name}
            </text>
            <text x={cx + 32} y={cy + 366} fill={C.slateDark} fontFamily="Inter, sans-serif" fontSize="20">
              {c.note}
            </text>
            <rect x={cx + 32} y={cy + 386} width="336" height="34" rx="8" fill={C.mist} />
            <text x={cx + 44} y={cy + 409} fill={C.indigoDeep} fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="15">
              {c.spec}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

/**
 * The system — kinetic type templates, shown as sequential frames with their
 * timings, the way a motion spec is actually handed over.
 */
function KineticType(_: { still: boolean }) {
  const frames = [
    { t: "0.0s", words: ["New"], op: [1], y: [0] },
    { t: "0.3s", words: ["New", "this"], op: [1, 1], y: [0, 0] },
    { t: "0.6s", words: ["New", "this", "week"], op: [1, 1, 1], y: [0, 0, 0] },
    { t: "1.2s", words: ["New", "this", "week"], op: [0.25, 0.25, 1], y: [0, 0, 0] },
  ];
  return (
    <Frame>
      <rect width="1600" height="900" fill={C.ink} />
      <text
        x="120"
        y="120"
        fill={C.magentaSoft}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
      >
        KINETIC TYPE
      </text>
      <text
        x="120"
        y="190"
        fill={C.paper}
        fontFamily="Sora, sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-2"
      >
        Type enters on the beat.
      </text>
      <text x="120" y="242" fill={C.slate} fontFamily="Inter, sans-serif" fontSize="24">
        Word-by-word, 0.3s apart — then the emphasis lands.
      </text>

      {frames.map((f, i) => {
        const cx = 120 + i * 350;
        return (
          <g key={f.t}>
            {/* frame */}
            <rect x={cx} y="310" width="310" height="330" rx="18" fill={C.inkSoft} stroke={C.line} strokeWidth="2" />
            {/* timecode */}
            <rect x={cx} y="310" width="86" height="34" rx="8" fill={C.magenta} />
            <text x={cx + 43} y="334" fill={C.paper} fontFamily="ui-monospace, monospace" fontSize="17" fontWeight="700" textAnchor="middle">
              {f.t}
            </text>
            {/* the words stacked */}
            {f.words.map((w, k) => (
              <text
                key={w}
                x={cx + 32}
                y={420 + k * 62}
                fill={f.op[k] === 1 ? C.paper : C.slate}
                opacity={f.op[k]}
                fontFamily="Sora, sans-serif"
                fontSize="48"
                fontWeight="800"
                letterSpacing="-1.5"
              >
                {w}
              </text>
            ))}
            {/* the emphasis underline on the final frame */}
            {i === 3 && (
              <rect x={cx + 32} y="556" width="150" height="6" rx="3" fill={C.signal} />
            )}
          </g>
        );
      })}

      {/* the spec strip beneath */}
      <rect x="120" y="694" width="1360" height="110" rx="18" fill={C.inkSoft} stroke={C.line} strokeWidth="2" />
      <text x="152" y="742" fill={C.slate} fontFamily="Inter, sans-serif" fontSize="19" fontWeight="700" letterSpacing="2">
        SPEC
      </text>
      <text x="152" y="782" fill={C.paper} fontFamily="ui-monospace, monospace" fontSize="19">
        stagger 0.3s · entrance cubic-bezier(0.22, 1, 0.36, 1) · emphasis at 1.2s · hold 0.8s
      </text>
    </Frame>
  );
}

/**
 * The system — the transition library, delivered as reusable presets. Each is a
 * named card with its motion sketched as an arrow diagram.
 */
function Transitions(_: { still: boolean }) {
  const presets = [
    { name: "Wipe", dur: "0.4s", desc: "Scene to scene" },
    { name: "Push", dur: "0.5s", desc: "Forward in a flow" },
    { name: "Fade thru", dur: "0.3s", desc: "Unrelated content" },
    { name: "Mark in", dur: "0.6s", desc: "Logo sting" },
    { name: "Lower third", dur: "0.5s", desc: "Name plate" },
    { name: "Beat cut", dur: "0.1s", desc: "On the downbeat" },
  ];
  return (
    <Frame>
      <rect width="1600" height="900" fill={C.mist} />
      <text
        x="800"
        y="120"
        fill={C.indigo}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
        textAnchor="middle"
      >
        THE SYSTEM
      </text>
      <text
        x="800"
        y="192"
        fill={C.ink}
        fontFamily="Sora, sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-2"
        textAnchor="middle"
      >
        Ten presets. No improvising.
      </text>
      <text x="800" y="244" fill={C.slateDark} fontFamily="Inter, sans-serif" fontSize="24" textAnchor="middle">
        Editable After Effects files — the team ships on-brand motion without me.
      </text>

      {presets.map((p, i) => {
        const cx = 120 + (i % 3) * 460;
        const cy = 300 + Math.floor(i / 3) * 280;
        return (
          <g key={p.name}>
            <rect x={cx} y={cy} width="400" height="240" rx="22" fill={C.paper} stroke={C.lineLight} strokeWidth="2" />
            {/* motion sketch: two frames + an arrow */}
            <rect x={cx + 32} y={cy + 32} width="120" height="76" rx="10" fill={C.mist} />
            <rect x={cx + 248} y={cy + 32} width="120" height="76" rx="10" fill={C.indigo} opacity="0.16" />
            <line
              x1={cx + 168}
              y1={cy + 70}
              x2={cx + 232}
              y2={cy + 70}
              stroke={C.magenta}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d={`M ${cx + 222} ${cy + 62} l 12 8 l -12 8`}
              fill="none"
              stroke={C.magenta}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x={cx + 32} y={cy + 168} fill={C.ink} fontFamily="Sora, sans-serif" fontSize="30" fontWeight="700">
              {p.name}
            </text>
            <text x={cx + 32} y={cy + 204} fill={C.slateDark} fontFamily="Inter, sans-serif" fontSize="20">
              {p.desc}
            </text>
            {/* duration chip */}
            <rect x={cx + 300} y={cy + 148} width="68" height="32" rx="16" fill={C.signal} />
            <text x={cx + 334} y={cy + 170} fill={C.ink} fontFamily="ui-monospace, monospace" fontSize="16" fontWeight="700" textAnchor="middle">
              {p.dur}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

/**
 * Outcome — the delivered system, summarised as the case study's stats over the
 * brand's stage. Framed as targets, matching the concept framing.
 */
function System(_: { still: boolean }) {
  const stats = [
    { value: "24", label: "motion assets delivered" },
    { value: "6s", label: "avg. render length" },
    { value: "10+", label: "reusable presets" },
  ];
  return (
    <Frame>
      <defs>
        <linearGradient id="cd-out" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.magenta} />
          <stop offset="100%" stopColor={C.indigoDeep} />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={C.ink} />

      {/* outcome banner */}
      <rect x="120" y="130" width="1360" height="330" rx="28" fill="url(#cd-out)" />
      <text x="170" y="222" fill={C.paper} fontFamily="Inter, sans-serif" fontSize="22" fontWeight="600" letterSpacing="3" opacity="0.85">
        OUTCOME
      </text>
      <text x="170" y="296" fill={C.paper} fontFamily="Sora, sans-serif" fontSize="52" fontWeight="800" letterSpacing="-2">
        The brand moves the same way
      </text>
      <text x="170" y="360" fill={C.paper} fontFamily="Sora, sans-serif" fontSize="52" fontWeight="800" letterSpacing="-2">
        everywhere it plays.
      </text>
      <text x="170" y="412" fill={C.paper} fontFamily="Inter, sans-serif" fontSize="24" opacity="0.8">
        Enter, move, transition — one system, every screen.
      </text>

      {/* waveform flourish */}
      {Array.from({ length: 34 }, (_, i) => {
        const h = 20 + Math.abs(Math.sin(i * 0.7)) * 90;
        return (
          <rect
            key={i}
            x={1060 + i * 12}
            y={295 - h / 2}
            width="5"
            height={h}
            rx="2.5"
            fill={C.paper}
            opacity="0.5"
          />
        );
      })}

      {/* stats */}
      {stats.map((s, i) => {
        const cx = 120 + i * 460;
        return (
          <g key={s.label}>
            <rect x={cx} y="530" width="400" height="240" rx="24" fill={C.inkSoft} stroke={C.line} strokeWidth="2" />
            <text
              x={cx + 200}
              y="660"
              fill={C.magentaSoft}
              fontFamily="Sora, sans-serif"
              fontSize="82"
              fontWeight="800"
              textAnchor="middle"
              letterSpacing="-3"
            >
              {s.value}
            </text>
            <text x={cx + 200} y="712" fill={C.slate} fontFamily="Inter, sans-serif" fontSize="23" textAnchor="middle">
              {s.label}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

// Every scene takes `still` for a uniform signature; the static ones ignore it.
const scenes: Record<Scene, (p: { still: boolean }) => React.JSX.Element> = {
  "logo-build": LogoBuild,
  easing: Easing,
  "kinetic-type": KineticType,
  transitions: Transitions,
  system: System,
};

export function MotionAsset({ scene, className, alt }: MotionAssetProps) {
  // The animated scenes (logo build, easing) render their end state instead of
  // playing when the user asks for reduced motion. This drives markup, not just
  // animation props, so it has to survive hydration — see the hook's note.
  const still = useStableReducedMotion();
  const Scene = scenes[scene];
  return (
    <div
      // Empty alt = decorative (e.g. a card thumbnail whose heading already
      // names the project): expose nothing rather than a paragraph of alt text.
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn("relative overflow-hidden bg-ink shadow-soft", className)}
    >
      <Scene still={still} />
    </div>
  );
}

