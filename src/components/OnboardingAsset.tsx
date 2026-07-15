import { cn } from "@/lib/utils";

/**
 * Fernweh — fictional trip-planning app, onboarding case study assets.
 *
 * Hand-built SVG mockups standing in for the first-run experience described in
 * the "Onboarding That Converts" case study. Like Aperture, Northwind, and
 * Lumin, Fernweh is a DISTINCT fictional client carrying its OWN identity — a
 * warm sunset coral with a deep teal — deliberately separate from the
 * portfolio's emerald/ink tokens AND from the other case studies. Each set
 * standing on its own is the point: these are client products, not the
 * portfolio's brand.
 *
 * The through-line is the argument the case study makes: the old wizard buried
 * value behind nine steps, so the scenes show the before/after step count, the
 * one-job-per-step rebuild, the permission ask that finally has a reason
 * attached, and the first-win moment that pays it all off.
 *
 * Swap any of these for a real <Image /> (a Figma export or screenshot) when
 * ready. Each scene is decorative-with-meaning, so we expose an accessible
 * label via role="img" + aria-label on the wrapper.
 */

// Fernweh's own palette (self-contained; not portfolio tokens on purpose).
const F = {
  ink: "#12242B", // deep teal-ink text
  teal: "#0E7C86",
  tealDeep: "#0A5560",
  coral: "#FF6B4A", // primary brand / CTA
  coralSoft: "#FFA88F",
  sand: "#FFF4EC", // page background tint
  paper: "#FFFFFF",
  cloud: "#F5F8F8", // panel fill
  line: "#E2E8E9",
  slate: "#5E7278", // muted body text
  mint: "#22C55E", // success / done
  amber: "#F5A524",
};

type Scene =
  | "first-win"
  | "before-after"
  | "shortest-path"
  | "one-job"
  | "activation";

type OnboardingAssetProps = {
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

/** Fernweh wordmark: a paper-plane mark + name. */
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
      <rect x="0" y="-26" width="36" height="36" rx="10" fill={F.coral} />
      {/* paper plane */}
      <path d="M 8 -8 L 29 -19 L 20 3 L 17 -5 Z" fill={F.paper} />
      <text
        x="48"
        y="3"
        fill={onDark ? F.paper : F.ink}
        fontFamily="Sora, sans-serif"
        fontSize="30"
        fontWeight="700"
        letterSpacing="-1"
      >
        Fernweh
      </text>
    </g>
  );
}

/** Rounded phone device chrome with a notch. Content is clipped to the screen. */
function Phone({
  x,
  y,
  w = 300,
  h = 620,
  fill = F.paper,
  id,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  fill?: string;
  id: string;
  children?: React.ReactNode;
}) {
  return (
    <g>
      {/* device body */}
      <rect
        x={x - 10}
        y={y - 10}
        width={w + 20}
        height={h + 20}
        rx="44"
        fill={F.ink}
        opacity="0.08"
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="36"
        fill={fill}
        stroke={F.line}
        strokeWidth="2"
      />
      <clipPath id={`fw-clip-${id}`}>
        <rect x={x} y={y} width={w} height={h} rx="36" />
      </clipPath>
      <g clipPath={`url(#fw-clip-${id})`}>{children}</g>
      {/* notch sits above the clipped content */}
      <rect x={x + w / 2 - 40} y={y + 14} width="80" height="10" rx="5" fill={F.line} />
    </g>
  );
}

/** A pill button. */
function Button({
  x,
  y,
  w,
  label,
  h = 52,
  filled = true,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  h?: number;
  filled?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={h / 2}
        fill={filled ? F.coral : "none"}
        stroke={filled ? "none" : F.line}
        strokeWidth="2"
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 7}
        fill={filled ? F.paper : F.slate}
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

/** Step dots showing progress through a flow — `total` dots, `at` filled. */
function StepDots({
  x,
  y,
  total,
  at,
  gap = 22,
}: {
  x: number;
  y: number;
  total: number;
  at: number;
  gap?: number;
}) {
  return (
    <g>
      {Array.from({ length: total }, (_, i) => (
        <circle
          key={i}
          cx={x + i * gap}
          cy={y}
          r={i === at ? 7 : 5}
          fill={i <= at ? F.coral : F.line}
        />
      ))}
    </g>
  );
}

/**
 * Hero / cover — the first-win moment: the trip is saved, two minutes in.
 * This is the payoff the whole case study is built around, so it leads.
 */
function FirstWin() {
  return (
    <Frame>
      <defs>
        <linearGradient id="fw-hero" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={F.sand} />
          <stop offset="100%" stopColor="#FFE8DC" />
        </linearGradient>
        <linearGradient id="fw-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={F.teal} />
          <stop offset="100%" stopColor={F.tealDeep} />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#fw-hero)" />

      <Wordmark x={140} y={130} />

      <text
        x="140"
        y="250"
        fill={F.coral}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
      >
        THE FIRST WIN
      </text>
      <text
        x="140"
        y="330"
        fill={F.ink}
        fontFamily="Sora, sans-serif"
        fontSize="62"
        fontWeight="800"
        letterSpacing="-2"
      >
        One saved trip.
      </text>
      <text
        x="140"
        y="404"
        fill={F.ink}
        fontFamily="Sora, sans-serif"
        fontSize="62"
        fontWeight="800"
        letterSpacing="-2"
      >
        Under two minutes.
      </text>
      <text
        x="140"
        y="470"
        fill={F.slate}
        fontFamily="Inter, sans-serif"
        fontSize="26"
      >
        Not a tour. Not a wizard. The thing they came for.
      </text>

      {/* timer chip */}
      <g>
        <rect x="140" y="516" width="230" height="56" rx="28" fill={F.paper} />
        <circle cx="176" cy="544" r="15" fill="none" stroke={F.mint} strokeWidth="4" />
        <path d="M 176 536 L 176 544 L 182 549" fill="none" stroke={F.mint} strokeWidth="4" strokeLinecap="round" />
        <text x="204" y="553" fill={F.ink} fontFamily="Sora, sans-serif" fontSize="24" fontWeight="700">
          1m 50s
        </text>
      </g>

      {/* phone: saved-trip confirmation */}
      <Phone x={1060} y={140} id="hero">
        <rect x="1060" y="140" width="300" height="620" fill={F.paper} />
        {/* trip hero image block */}
        <rect x="1060" y="140" width="300" height="250" fill="url(#fw-card)" />
        {/* simple mountain/sun scene */}
        <circle cx="1290" cy="215" r="26" fill={F.amber} opacity="0.9" />
        <path d="M 1060 390 L 1150 280 L 1215 390 Z" fill={F.tealDeep} opacity="0.7" />
        <path d="M 1160 390 L 1250 292 L 1340 390 Z" fill={F.ink} opacity="0.35" />

        {/* saved check badge */}
        <circle cx="1210" cy="390" r="38" fill={F.paper} />
        <circle cx="1210" cy="390" r="28" fill={F.mint} />
        <path
          d="M 1197 390 l 9 10 l 17 -20"
          fill="none"
          stroke={F.paper}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <text x="1210" y="470" fill={F.ink} fontFamily="Sora, sans-serif" fontSize="28" fontWeight="700" textAnchor="middle">
          Trip saved
        </text>
        <text x="1210" y="506" fill={F.slate} fontFamily="Inter, sans-serif" fontSize="19" textAnchor="middle">
          Lisbon · 5 days
        </text>

        {/* itinerary rows */}
        {[0, 1].map((i) => (
          <g key={i}>
            <rect x="1090" y={540 + i * 62} width="240" height="48" rx="12" fill={F.cloud} />
            <circle cx="1116" cy={564 + i * 62} r="10" fill={F.coralSoft} />
            <rect x="1136" y={558 + i * 62} width={i === 0 ? 120 : 90} height="12" rx="6" fill={F.line} />
          </g>
        ))}

        <Button x={1090} y={672} w={240} label="Plan day one" h={48} />
      </Phone>
    </Frame>
  );
}

/**
 * The problem — nine steps before value, shown against the rebuilt three.
 * The case study's core claim, made visual.
 */
function BeforeAfter() {
  const before = [
    "Notifications",
    "Location",
    "Create profile",
    "Pick interests",
    "Travel style",
    "Budget range",
    "Invite friends",
    "Connect calendar",
    "Newsletter",
  ];
  const after = ["Where to?", "How long?", "Trip saved"];
  return (
    <Frame>
      <rect width="1600" height="900" fill={F.cloud} />

      <text
        x="800"
        y="110"
        fill={F.coral}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
        textAnchor="middle"
      >
        THE PROBLEM
      </text>
      <text
        x="800"
        y="184"
        fill={F.ink}
        fontFamily="Sora, sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-2"
        textAnchor="middle"
      >
        Nine steps before a single destination.
      </text>

      {/* BEFORE column */}
      <g>
        <rect x="120" y="240" width="620" height="590" rx="24" fill={F.paper} stroke={F.line} strokeWidth="2" />
        <text x="160" y="298" fill={F.slate} fontFamily="Inter, sans-serif" fontSize="20" fontWeight="700" letterSpacing="3">
          BEFORE
        </text>
        <text x="700" y="298" fill={F.slate} fontFamily="Sora, sans-serif" fontSize="22" fontWeight="700" textAnchor="end">
          9 steps
        </text>
        {before.map((label, i) => (
          <g key={label}>
            <rect x="160" y={330 + i * 52} width="540" height="40" rx="10" fill={F.cloud} />
            <circle cx="186" cy={350 + i * 52} r="9" fill="none" stroke={F.line} strokeWidth="3" />
            <text x="212" y={357 + i * 52} fill={F.slate} fontFamily="Inter, sans-serif" fontSize="20">
              {label}
            </text>
          </g>
        ))}
        {/* drop-off marker */}
        <g>
          <line x1="160" y1="806" x2="700" y2="806" stroke={F.coral} strokeWidth="3" strokeDasharray="8 8" />
          <text x="430" y="796" fill={F.coral} fontFamily="Inter, sans-serif" fontSize="19" fontWeight="700" textAnchor="middle">
            most users never get past here
          </text>
        </g>
      </g>

      {/* AFTER column */}
      <g>
        <rect x="860" y="240" width="620" height="590" rx="24" fill={F.paper} stroke={F.coral} strokeWidth="3" />
        <text x="900" y="298" fill={F.coral} fontFamily="Inter, sans-serif" fontSize="20" fontWeight="700" letterSpacing="3">
          AFTER
        </text>
        <text x="1440" y="298" fill={F.coral} fontFamily="Sora, sans-serif" fontSize="22" fontWeight="700" textAnchor="end">
          3 steps
        </text>
        {after.map((label, i) => (
          <g key={label}>
            <rect x="900" y={330 + i * 62} width="540" height="50" rx="12" fill={F.sand} />
            <circle cx="930" cy={355 + i * 62} r="11" fill={F.coral} />
            <text x="960" y={363 + i * 62} fill={F.ink} fontFamily="Inter, sans-serif" fontSize="21" fontWeight="600">
              {label}
            </text>
          </g>
        ))}
        {/* everything else, moved later */}
        <text x="900" y="570" fill={F.slate} fontFamily="Inter, sans-serif" fontSize="19" fontWeight="700" letterSpacing="2">
          MOVED LATER — WHEN THEY EARN IT
        </text>
        {["Notifications", "Interests", "Invite friends", "Calendar"].map((label, i) => (
          <g key={label}>
            <rect
              x={900 + (i % 2) * 276}
              y={600 + Math.floor(i / 2) * 56}
              width="256"
              height="42"
              rx="10"
              fill={F.cloud}
            />
            <text
              x={920 + (i % 2) * 276}
              y={627 + Math.floor(i / 2) * 56}
              fill={F.slate}
              fontFamily="Inter, sans-serif"
              fontSize="19"
            >
              {label}
            </text>
          </g>
        ))}
        <g>
          <circle cx="930" cy="760" r="15" fill={F.mint} />
          <path d="M 923 760 l 5 6 l 10 -12" fill="none" stroke={F.paper} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="960" y="768" fill={F.ink} fontFamily="Inter, sans-serif" fontSize="20" fontWeight="600">
            First win reached in 1m 50s
          </text>
        </g>
      </g>
    </Frame>
  );
}

/**
 * Strategy — the shortest path to the first win, as a flow. Everything off the
 * critical path is shown branching away, deferred rather than deleted.
 */
function ShortestPath() {
  const steps = [
    { label: "Where to?", sub: "One question" },
    { label: "How long?", sub: "Two taps" },
    { label: "Trip saved", sub: "The first win" },
  ];
  const startX = 320;
  const gap = 480;
  const cy = 430;
  return (
    <Frame>
      <rect width="1600" height="900" fill={F.sand} />
      <text
        x="800"
        y="140"
        fill={F.teal}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
        textAnchor="middle"
      >
        STRATEGY
      </text>
      <text
        x="800"
        y="216"
        fill={F.ink}
        fontFamily="Sora, sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-2"
        textAnchor="middle"
      >
        The critical path, and nothing else.
      </text>

      {/* main track */}
      <line
        x1={startX}
        y1={cy}
        x2={startX + gap * 2}
        y2={cy}
        stroke={F.coralSoft}
        strokeWidth="8"
        strokeLinecap="round"
      />

      {steps.map((s, i) => {
        const nx = startX + i * gap;
        const isWin = i === steps.length - 1;
        return (
          <g key={s.label}>
            {isWin && <circle cx={nx} cy={cy} r="62" fill={F.mint} opacity="0.16" />}
            <circle
              cx={nx}
              cy={cy}
              r="46"
              fill={isWin ? F.mint : F.paper}
              stroke={isWin ? F.mint : F.coral}
              strokeWidth="5"
            />
            {isWin ? (
              <path
                d={`M ${nx - 18} ${cy} l 12 14 l 24 -28`}
                fill="none"
                stroke={F.paper}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <text
                x={nx}
                y={cy + 12}
                fill={F.coral}
                fontFamily="Sora, sans-serif"
                fontSize="34"
                fontWeight="800"
                textAnchor="middle"
              >
                {i + 1}
              </text>
            )}
            <text
              x={nx}
              y={cy + 108}
              fill={F.ink}
              fontFamily="Sora, sans-serif"
              fontSize="30"
              fontWeight="700"
              textAnchor="middle"
            >
              {s.label}
            </text>
            <text
              x={nx}
              y={cy + 146}
              fill={F.slate}
              fontFamily="Inter, sans-serif"
              fontSize="21"
              textAnchor="middle"
            >
              {s.sub}
            </text>
          </g>
        );
      })}

      {/* deferred branches drop away from the path */}
      {[
        { x: startX + 240, label: "Notifications" },
        { x: startX + 720, label: "Interests" },
        { x: startX + 960, label: "Invite friends" },
      ].map((b) => (
        <g key={b.label}>
          <path
            d={`M ${b.x} ${cy} q 0 90 0 130`}
            fill="none"
            stroke={F.line}
            strokeWidth="4"
            strokeDasharray="7 7"
          />
          <rect x={b.x - 100} y={cy + 130} width="200" height="46" rx="23" fill={F.paper} stroke={F.line} strokeWidth="2" />
          <text x={b.x} y={cy + 159} fill={F.slate} fontFamily="Inter, sans-serif" fontSize="19" textAnchor="middle">
            {b.label}
          </text>
        </g>
      ))}
      <text
        x="800"
        y={cy + 250}
        fill={F.slate}
        fontFamily="Inter, sans-serif"
        fontSize="22"
        textAnchor="middle"
        fontStyle="italic"
      >
        Deferred, not deleted — each returns at the moment it earns its place.
      </text>
    </Frame>
  );
}

/**
 * Craft — one job per step, and the permission ask with a reason attached.
 * Three phones showing the rebuilt flow.
 */
function OneJob() {
  return (
    <Frame>
      <rect width="1600" height="900" fill={F.paper} />
      <text
        x="800"
        y="110"
        fill={F.coral}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
        textAnchor="middle"
      >
        CRAFT
      </text>
      <text
        x="800"
        y="184"
        fill={F.ink}
        fontFamily="Sora, sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-2"
        textAnchor="middle"
      >
        One step. One job.
      </text>

      {/* Phone 1 — Where to? */}
      <Phone x={180} y={250} w={300} h={560} id="job1">
        <rect x="180" y="250" width="300" height="560" fill={F.paper} />
        <StepDots x={210} y={300} total={3} at={0} />
        <text x="210" y="368" fill={F.ink} fontFamily="Sora, sans-serif" fontSize="34" fontWeight="800">
          Where to?
        </text>
        <text x="210" y="404" fill={F.slate} fontFamily="Inter, sans-serif" fontSize="18">
          Start with a city. Change it later.
        </text>
        {/* search field */}
        <rect x="210" y="430" width="240" height="52" rx="14" fill={F.cloud} stroke={F.coral} strokeWidth="2" />
        <circle cx="236" cy="456" r="9" fill="none" stroke={F.slate} strokeWidth="3" />
        <line x1="243" y1="463" x2="250" y2="470" stroke={F.slate} strokeWidth="3" strokeLinecap="round" />
        <text x="262" y="463" fill={F.ink} fontFamily="Inter, sans-serif" fontSize="19">
          Lisbon
        </text>
        {/* suggestions */}
        {["Lisbon, Portugal", "Lisbon Coast", "Lisboa Norte"].map((s, i) => (
          <g key={s}>
            <text x="212" y={524 + i * 44} fill={i === 0 ? F.ink : F.slate} fontFamily="Inter, sans-serif" fontSize="18" fontWeight={i === 0 ? 600 : 400}>
              {s}
            </text>
            <line x1="210" y1={540 + i * 44} x2="450" y2={540 + i * 44} stroke={F.line} strokeWidth="1.5" />
          </g>
        ))}
        <Button x={210} y={706} w={240} label="Continue" h={48} />
      </Phone>

      {/* Phone 2 — How long? */}
      <Phone x={650} y={250} w={300} h={560} id="job2">
        <rect x="650" y="250" width="300" height="560" fill={F.paper} />
        <StepDots x={680} y={300} total={3} at={1} />
        <text x="680" y="368" fill={F.ink} fontFamily="Sora, sans-serif" fontSize="34" fontWeight="800">
          How long?
        </text>
        <text x="680" y="404" fill={F.slate} fontFamily="Inter, sans-serif" fontSize="18">
          Rough is fine.
        </text>
        {/* duration chips */}
        {["Weekend", "5 days", "2 weeks", "Not sure"].map((c, i) => {
          const sel = c === "5 days";
          return (
            <g key={c}>
              <rect
                x={680 + (i % 2) * 130}
                y={434 + Math.floor(i / 2) * 68}
                width="112"
                height="54"
                rx="14"
                fill={sel ? F.coral : F.cloud}
                stroke={sel ? "none" : F.line}
                strokeWidth="2"
              />
              <text
                x={736 + (i % 2) * 130}
                y={467 + Math.floor(i / 2) * 68}
                fill={sel ? F.paper : F.slate}
                fontFamily="Inter, sans-serif"
                fontSize="18"
                fontWeight="600"
                textAnchor="middle"
              >
                {c}
              </text>
            </g>
          );
        })}
        <text x="680" y="620" fill={F.slate} fontFamily="Inter, sans-serif" fontSize="17">
          You’re almost there.
        </text>
        <rect x="680" y="638" width="240" height="8" rx="4" fill={F.line} />
        <rect x="680" y="638" width="160" height="8" rx="4" fill={F.coral} />
        <Button x={680} y={706} w={240} label="Save my trip" h={48} />
      </Phone>

      {/* Phone 3 — permission with a reason */}
      <Phone x={1120} y={250} w={300} h={560} id="job3">
        <rect x="1120" y="250" width="300" height="560" fill={F.cloud} />
        {/* dimmed trip behind the sheet */}
        <rect x="1120" y="250" width="300" height="200" fill={F.tealDeep} opacity="0.25" />
        {/* the ask, as a sheet with context */}
        <rect x="1120" y="400" width="300" height="410" rx="28" fill={F.paper} />
        <circle cx="1270" cy="470" r="30" fill={F.sand} />
        <path
          d="M 1270 456 a 12 12 0 0 1 12 12 c 0 10 5 14 5 14 h -34 s 5 -4 5 -14 a 12 12 0 0 1 12 -12 z"
          fill={F.coral}
        />
        <circle cx="1270" cy="450" r="3.5" fill={F.coral} />
        <text x="1270" y="536" fill={F.ink} fontFamily="Sora, sans-serif" fontSize="26" fontWeight="700" textAnchor="middle">
          Price drop alerts?
        </text>
        <text x="1270" y="572" fill={F.slate} fontFamily="Inter, sans-serif" fontSize="17" textAnchor="middle">
          We’ll ping you if Lisbon flights
        </text>
        <text x="1270" y="596" fill={F.slate} fontFamily="Inter, sans-serif" fontSize="17" textAnchor="middle">
          drop below €180. Nothing else.
        </text>
        <Button x={1150} y={634} w={240} label="Yes, watch prices" h={48} />
        <Button x={1150} y={696} w={240} label="Not now" h={48} filled={false} />
        <text x="1270" y="778" fill={F.slate} fontFamily="Inter, sans-serif" fontSize="16" textAnchor="middle" fontStyle="italic">
          Asked after the trip exists — not on launch.
        </text>
      </Phone>
    </Frame>
  );
}

/**
 * Outcome — the target metrics, framed as goals rather than measured results to
 * stay consistent with the case study's concept framing.
 */
function Activation() {
  const stats = [
    { value: "+31%", label: "activation" },
    { value: "+19%", label: "day-7 retention" },
    { value: "1m 50s", label: "to first win" },
  ];
  return (
    <Frame>
      <defs>
        <linearGradient id="fw-out" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={F.teal} />
          <stop offset="100%" stopColor={F.tealDeep} />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={F.sand} />

      {/* funnel card */}
      <rect x="120" y="130" width="1360" height="380" rx="28" fill="url(#fw-out)" />
      <Wordmark x={170} y={210} onDark />
      <text x="170" y="290" fill={F.coralSoft} fontFamily="Inter, sans-serif" fontSize="22" fontWeight="600" letterSpacing="3">
        THE TARGET
      </text>
      <text x="170" y="350" fill={F.paper} fontFamily="Sora, sans-serif" fontSize="44" fontWeight="800" letterSpacing="-1.5">
        Momentum, not
      </text>
      <text x="170" y="400" fill={F.paper} fontFamily="Sora, sans-serif" fontSize="44" fontWeight="800" letterSpacing="-1.5">
        explanation.
      </text>
      <text x="170" y="446" fill={F.coralSoft} fontFamily="Inter, sans-serif" fontSize="22">
        Every step earns the next one.
      </text>

      {/* funnel bars: before vs after reaching the win. Sits right of the
          headline column, which runs to roughly x=980. */}
      {[
        { label: "Old flow", w: 130, fill: F.paper, op: 0.28 },
        { label: "Rebuilt flow", w: 340, fill: F.coral, op: 1 },
      ].map((b, i) => (
        <g key={b.label}>
          <rect x="1020" y={252 + i * 76} width={b.w} height="50" rx="25" fill={b.fill} opacity={b.op} />
          <text
            x="1036"
            y={283 + i * 76}
            fill={F.paper}
            fontFamily="Inter, sans-serif"
            fontSize="19"
            fontWeight="600"
            opacity={i === 0 ? 0.9 : 1}
          >
            {b.label}
          </text>
        </g>
      ))}
      <text x="1020" y="424" fill={F.coralSoft} fontFamily="Inter, sans-serif" fontSize="19">
        share of new users reaching their first win
      </text>

      {/* stats */}
      {stats.map((s, i) => {
        const cx = 120 + i * 460;
        return (
          <g key={s.label}>
            <rect x={cx} y="570" width="420" height="220" rx="24" fill={F.paper} stroke={F.line} strokeWidth="2" />
            <text
              x={cx + 210}
              y="686"
              fill={F.coral}
              fontFamily="Sora, sans-serif"
              fontSize="76"
              fontWeight="800"
              textAnchor="middle"
              letterSpacing="-3"
            >
              {s.value}
            </text>
            <text x={cx + 210} y="736" fill={F.slate} fontFamily="Inter, sans-serif" fontSize="25" textAnchor="middle">
              {s.label}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

const scenes: Record<Scene, () => React.JSX.Element> = {
  "first-win": FirstWin,
  "before-after": BeforeAfter,
  "shortest-path": ShortestPath,
  "one-job": OneJob,
  activation: Activation,
};

export function OnboardingAsset({ scene, className, alt }: OnboardingAssetProps) {
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
export const onboardingScenes: { scene: Scene; alt: string }[] = [
  {
    scene: "first-win",
    alt: "Fernweh's first-win moment — the headline 'One saved trip. Under two minutes.' beside a phone showing a saved Lisbon trip with a green confirmation check and a 'Plan day one' button.",
  },
  {
    scene: "before-after",
    alt: "Before and after comparison — the old nine-step setup wizard (notifications, location, profile, interests, and more) with a marker showing most users never finish, next to the rebuilt three-step flow that reaches a saved trip in 1m 50s.",
  },
  {
    scene: "shortest-path",
    alt: "The critical path — three steps (Where to?, How long?, Trip saved) on a single track, with notifications, interests, and invites branching away below as deferred, not deleted.",
  },
  {
    scene: "one-job",
    alt: "Three phone screens showing one job per step: a city search, a trip-length picker with a progress bar reading 'You're almost there', and a notification permission ask that explains it will watch Lisbon flight prices — shown after the trip exists rather than on launch.",
  },
  {
    scene: "activation",
    alt: "Outcome targets — a funnel comparing the old and rebuilt flows by share of users reaching their first win, above three stat cards: +31% activation, +19% day-7 retention, and 1m 50s to first win.",
  },
];
