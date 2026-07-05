import { cn } from "@/lib/utils";

/**
 * Lumin — fictional online-learning-platform case study assets.
 *
 * Hand-built SVG "product-UI mockups" standing in for the real EdTech app
 * described in the "Online Learning Platform — Product UI" case study. Like
 * Aperture and Northwind, Lumin is a DISTINCT fictional client, so it carries
 * its OWN identity — a focused violet with a warm gold "keep going" accent —
 * deliberately separate from the portfolio's emerald/ink tokens AND from the
 * other case studies. Each set standing on its own is the point: these are
 * client products, not the portfolio's brand.
 *
 * The through-line is the product itself: a calm lesson view with a persistent
 * progress rail, a simplified course map, consistent lesson-type patterns
 * (video / reading / quiz), and rewarding completion feedback — exactly the
 * decisions the case study describes. A shared app chrome + the violet→gold
 * system tie the scenes together.
 *
 * Swap any of these for a real <Image /> (a Figma export or screenshot) when
 * ready. Each scene is decorative-with-meaning, so we expose an accessible
 * label via role="img" + aria-label on the wrapper.
 */

// Lumin's own palette (self-contained; not portfolio tokens on purpose).
const L = {
  ink: "#1C1633", // deep indigo-ink text
  violet: "#6D4AED",
  violetDeep: "#4C2CB8",
  lilac: "#A78BFA",
  gold: "#F5A524", // "keep going" accent
  goldSoft: "#FBCB6B",
  paper: "#FFFFFF",
  mist: "#F3F0FF", // page background tint
  cloud: "#F7F6FC", // panel fill
  line: "#E4DFF3",
  slate: "#6B6485", // muted body text
  mint: "#22C55E", // completion / done
  mintSoft: "#DCFCE7",
};

type Scene =
  | "lesson-view"
  | "course-map"
  | "progress"
  | "lesson-types"
  | "completion";

type LearningAssetProps = {
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

/** Lumin wordmark: a small "spark/lamp" mark + name. */
function Wordmark({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* rounded tile with a four-point spark */}
      <rect x="0" y="-26" width="36" height="36" rx="10" fill={L.violet} />
      <path
        d="M 18 -22 L 21 -11 L 30 -8 L 21 -5 L 18 6 L 15 -5 L 6 -8 L 15 -11 Z"
        fill={L.goldSoft}
      />
      <text
        x="48"
        y="3"
        fill={L.ink}
        fontFamily="Sora, sans-serif"
        fontSize="30"
        fontWeight="700"
        letterSpacing="-1"
      >
        Lumin
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
  h = 46,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  filled?: boolean;
  h?: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={h / 2}
        fill={filled ? L.gold : "none"}
        stroke={filled ? "none" : L.line}
        strokeWidth="2"
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 7}
        fill={filled ? L.ink : L.slate}
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

/**
 * The persistent left sidebar / course rail shared by the in-app scenes.
 * `active` picks which lesson row is highlighted; `done` marks completed rows.
 */
function CourseRail({
  x = 0,
  y = 0,
  active = 2,
  done = 2,
}: {
  x?: number;
  y?: number;
  active?: number;
  done?: number;
}) {
  const rows = [
    "Welcome & setup",
    "Core concepts",
    "Your first build",
    "Going deeper",
    "Ship it",
  ];
  const rowY = (i: number) => y + 210 + i * 78;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="360" height="900" fill={L.cloud} />
      <line x1="360" y1="0" x2="360" y2="900" stroke={L.line} strokeWidth="2" />
      <Wordmark x={44} y={80} />
      <text
        x="44"
        y="160"
        fill={L.slate}
        fontFamily="Inter, sans-serif"
        fontSize="20"
        fontWeight="600"
        letterSpacing="3"
      >
        INTRO TO DESIGN
      </text>

      {rows.map((label, i) => {
        const cy = rowY(i) - y;
        const isActive = i === active;
        const isDone = i < done;
        return (
          <g key={label}>
            {isActive && (
              <rect x="24" y={cy - 34} width="312" height="60" rx="14" fill={L.mist} />
            )}
            {/* status dot */}
            {isDone ? (
              <g>
                <circle cx="60" cy={cy - 4} r="15" fill={L.mint} />
                <path
                  d={`M 53 ${cy - 4} l 5 6 l 10 -12`}
                  fill="none"
                  stroke={L.paper}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ) : isActive ? (
              <g>
                <circle cx="60" cy={cy - 4} r="15" fill={L.violet} />
                <circle cx="60" cy={cy - 4} r="6" fill={L.paper} />
              </g>
            ) : (
              <circle
                cx="60"
                cy={cy - 4}
                r="14"
                fill="none"
                stroke={L.line}
                strokeWidth="3"
              />
            )}
            <text
              x="92"
              y={cy + 3}
              fill={isActive ? L.ink : isDone ? L.slate : L.slate}
              fontFamily="Inter, sans-serif"
              fontSize="23"
              fontWeight={isActive ? 700 : 500}
            >
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/**
 * The persistent progress rail — a labelled bar the case study calls out as
 * always-visible. `pct` 0–100.
 */
function ProgressRail({
  x,
  y,
  w,
  pct,
  label = "Course progress",
}: {
  x: number;
  y: number;
  w: number;
  pct: number;
  label?: string;
}) {
  const fill = (w * pct) / 100;
  return (
    <g>
      <text
        x={x}
        y={y - 14}
        fill={L.slate}
        fontFamily="Inter, sans-serif"
        fontSize="20"
        fontWeight="600"
      >
        {label}
      </text>
      <text
        x={x + w}
        y={y - 14}
        fill={L.violet}
        fontFamily="Sora, sans-serif"
        fontSize="20"
        fontWeight="700"
        textAnchor="end"
      >
        {pct}%
      </text>
      <rect x={x} y={y} width={w} height="14" rx="7" fill={L.line} />
      <rect x={x} y={y} width={fill} height="14" rx="7" fill={L.violet} />
    </g>
  );
}

/**
 * Hero / cover — the calm lesson view: a video player, the lesson title, the
 * persistent progress rail, an obvious "next" action, and the course rail.
 */
function LessonView() {
  return (
    <Frame>
      <defs>
        <linearGradient id="lm-video" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={L.violet} />
          <stop offset="100%" stopColor={L.violetDeep} />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={L.paper} />

      <CourseRail active={2} done={2} />

      {/* main lesson column */}
      <text
        x="440"
        y="120"
        fill={L.slate}
        fontFamily="Inter, sans-serif"
        fontSize="22"
        fontWeight="600"
        letterSpacing="2"
      >
        LESSON 3 · YOUR FIRST BUILD
      </text>
      <text
        x="440"
        y="176"
        fill={L.ink}
        fontFamily="Sora, sans-serif"
        fontSize="52"
        fontWeight="800"
        letterSpacing="-1.5"
      >
        Laying out a screen
      </text>

      {/* video player */}
      <g>
        <rect x="440" y="216" width="900" height="440" rx="24" fill="url(#lm-video)" />
        {/* play button */}
        <circle cx="890" cy="436" r="58" fill={L.paper} opacity="0.95" />
        <path d="M 872 406 L 872 466 L 918 436 Z" fill={L.violet} />
        {/* scrubber */}
        <rect x="480" y="600" width="820" height="8" rx="4" fill={L.paper} opacity="0.35" />
        <rect x="480" y="600" width="300" height="8" rx="4" fill={L.gold} />
        <circle cx="780" cy="604" r="10" fill={L.paper} />
      </g>

      {/* progress rail (persistent) */}
      <ProgressRail x={440} y={712} w={620} pct={45} />

      {/* obvious next action */}
      <Button x={1120} y={694} w={220} label="Next lesson →" />
      <text
        x="1230"
        y="770"
        fill={L.slate}
        fontFamily="Inter, sans-serif"
        fontSize="19"
        textAnchor="middle"
      >
        Up next: Going deeper
      </text>
    </Frame>
  );
}

/**
 * Course map — the simplified path through the course. Before/after framing:
 * a clean, linear map of modules with clear status.
 */
function CourseMap() {
  const nodes = [
    { label: "Welcome", state: "done" },
    { label: "Core concepts", state: "done" },
    { label: "Your first build", state: "active" },
    { label: "Going deeper", state: "todo" },
    { label: "Ship it", state: "todo" },
  ] as const;
  const startX = 200;
  const gap = 300;
  const cy = 470;
  return (
    <Frame>
      <rect width="1600" height="900" fill={L.mist} />
      <text
        x="800"
        y="150"
        fill={L.violet}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
        textAnchor="middle"
      >
        COURSE MAP
      </text>
      <text
        x="800"
        y="230"
        fill={L.ink}
        fontFamily="Sora, sans-serif"
        fontSize="56"
        fontWeight="800"
        letterSpacing="-2"
        textAnchor="middle"
      >
        Always know where you are.
      </text>

      {/* connecting track */}
      <line
        x1={startX}
        y1={cy}
        x2={startX + gap * 4}
        y2={cy}
        stroke={L.line}
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* completed portion of the track */}
      <line
        x1={startX}
        y1={cy}
        x2={startX + gap * 2}
        y2={cy}
        stroke={L.mint}
        strokeWidth="8"
        strokeLinecap="round"
      />

      {nodes.map((n, i) => {
        const nx = startX + i * gap;
        const isDone = n.state === "done";
        const isActive = n.state === "active";
        return (
          <g key={n.label}>
            {isActive && <circle cx={nx} cy={cy} r="48" fill={L.violet} opacity="0.14" />}
            <circle
              cx={nx}
              cy={cy}
              r="34"
              fill={isDone ? L.mint : isActive ? L.violet : L.paper}
              stroke={isDone ? L.mint : isActive ? L.violet : L.line}
              strokeWidth="4"
            />
            {isDone && (
              <path
                d={`M ${nx - 14} ${cy} l 9 11 l 18 -22`}
                fill="none"
                stroke={L.paper}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {isActive && <circle cx={nx} cy={cy} r="12" fill={L.paper} />}
            <text
              x={nx}
              y={cy + 90}
              fill={isActive ? L.ink : L.slate}
              fontFamily="Inter, sans-serif"
              fontSize="24"
              fontWeight={isActive ? 700 : 500}
              textAnchor="middle"
            >
              {n.label}
            </text>
            {isActive && (
              <text
                x={nx}
                y={cy + 122}
                fill={L.violet}
                fontFamily="Inter, sans-serif"
                fontSize="19"
                fontWeight="600"
                textAnchor="middle"
              >
                You're here
              </text>
            )}
          </g>
        );
      })}
    </Frame>
  );
}

/**
 * Progress & next-action — surfacing progress clearly and making the next
 * step obvious. A dashboard-y card with the progress ring + a "continue" CTA.
 */
function Progress() {
  // progress ring geometry
  const rx = 420;
  const ry = 430;
  const r = 140;
  const circ = 2 * Math.PI * r;
  const pct = 60;
  const dash = (circ * pct) / 100;
  return (
    <Frame>
      <rect width="1600" height="900" fill={L.cloud} />
      <text
        x="150"
        y="150"
        fill={L.violet}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
      >
        YOUR PROGRESS
      </text>
      <text
        x="150"
        y="230"
        fill={L.ink}
        fontFamily="Sora, sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-2"
      >
        The next step is obvious.
      </text>

      {/* progress ring card */}
      <rect x="150" y="300" width="560" height="440" rx="28" fill={L.paper} stroke={L.line} strokeWidth="2" />
      <circle cx={rx + 10} cy={ry + 90} r={r} fill="none" stroke={L.line} strokeWidth="26" />
      <circle
        cx={rx + 10}
        cy={ry + 90}
        r={r}
        fill="none"
        stroke={L.violet}
        strokeWidth="26"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform={`rotate(-90 ${rx + 10} ${ry + 90})`}
      />
      <text
        x={rx + 10}
        y={ry + 90}
        fill={L.ink}
        fontFamily="Sora, sans-serif"
        fontSize="72"
        fontWeight="800"
        textAnchor="middle"
      >
        {pct}%
      </text>
      <text
        x={rx + 10}
        y={ry + 132}
        fill={L.slate}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        textAnchor="middle"
      >
        of the course done
      </text>

      {/* "continue where you left off" card */}
      <rect x="760" y="300" width="690" height="440" rx="28" fill={L.paper} stroke={L.line} strokeWidth="2" />
      <text x="810" y="380" fill={L.slate} fontFamily="Inter, sans-serif" fontSize="22" fontWeight="600" letterSpacing="2">
        CONTINUE WHERE YOU LEFT OFF
      </text>
      {/* lesson thumbnail */}
      <rect x="810" y="410" width="180" height="120" rx="16" fill={L.mist} />
      <circle cx="900" cy="470" r="26" fill={L.paper} />
      <path d="M 892 458 L 892 482 L 912 470 Z" fill={L.violet} />
      <text x="1020" y="450" fill={L.ink} fontFamily="Sora, sans-serif" fontSize="34" fontWeight="700">
        Laying out a screen
      </text>
      <text x="1020" y="492" fill={L.slate} fontFamily="Inter, sans-serif" fontSize="24">
        Lesson 3 · 6 min left
      </text>

      <ProgressRail x={810} y={588} w={590} pct={45} label="This module" />

      <Button x={810} y={640} w={300} label="Continue lesson →" h={60} />
    </Frame>
  );
}

/**
 * Lesson-type patterns — consistent components for video, reading, and quiz,
 * the "consistent patterns" the case study describes.
 */
function LessonTypes() {
  const cards: {
    title: string;
    tag: string;
    icon: "video" | "reading" | "quiz";
  }[] = [
    { title: "Watch", tag: "VIDEO", icon: "video" },
    { title: "Read", tag: "READING", icon: "reading" },
    { title: "Practice", tag: "QUIZ", icon: "quiz" },
  ];
  return (
    <Frame>
      <rect width="1600" height="900" fill={L.paper} />
      <text
        x="800"
        y="150"
        fill={L.violet}
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="6"
        textAnchor="middle"
      >
        LESSON PATTERNS
      </text>
      <text
        x="800"
        y="230"
        fill={L.ink}
        fontFamily="Sora, sans-serif"
        fontSize="56"
        fontWeight="800"
        letterSpacing="-2"
        textAnchor="middle"
      >
        One rhythm, every format.
      </text>

      {cards.map((c, i) => {
        const cx = 150 + i * 445;
        return (
          <g key={c.title}>
            <rect x={cx} y="330" width="400" height="420" rx="24" fill={L.cloud} stroke={L.line} strokeWidth="2" />
            {/* media area */}
            <rect x={cx + 32} y="366" width="336" height="180" rx="16" fill={L.mist} />

            {c.icon === "video" && (
              <g>
                <circle cx={cx + 200} cy="456" r="40" fill={L.paper} />
                <path d={`M ${cx + 188} 436 L ${cx + 188} 476 L ${cx + 220} 456 Z`} fill={L.violet} />
              </g>
            )}
            {c.icon === "reading" && (
              <g stroke={L.lilac} strokeWidth="8" strokeLinecap="round">
                <line x1={cx + 72} y1="416" x2={cx + 328} y2="416" />
                <line x1={cx + 72} y1="456" x2={cx + 328} y2="456" />
                <line x1={cx + 72} y1="496" x2={cx + 250} y2="496" />
              </g>
            )}
            {c.icon === "quiz" && (
              <g>
                {[0, 1, 2].map((k) => (
                  <g key={k}>
                    <circle
                      cx={cx + 84}
                      cy={396 + k * 50}
                      r="14"
                      fill="none"
                      stroke={k === 1 ? L.violet : L.line}
                      strokeWidth="4"
                    />
                    {k === 1 && <circle cx={cx + 84} cy={396 + k * 50} r="7" fill={L.violet} />}
                    <rect x={cx + 114} y={388 + k * 50} width={k === 1 ? 200 : 160} height="16" rx="8" fill={L.line} />
                  </g>
                ))}
              </g>
            )}

            {/* tag */}
            <rect x={cx + 32} y="580" width={c.tag.length * 13 + 32} height="34" rx="17" fill={L.mist} />
            <text x={cx + 48} y="603" fill={L.violet} fontFamily="Inter, sans-serif" fontSize="18" fontWeight="700" letterSpacing="1.5">
              {c.tag}
            </text>
            <text x={cx + 32} y="672" fill={L.ink} fontFamily="Sora, sans-serif" fontSize="36" fontWeight="700">
              {c.title}
            </text>
            <text x={cx + 32} y="712" fill={L.slate} fontFamily="Inter, sans-serif" fontSize="22">
              Same layout, same controls.
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

/**
 * Completion — the rewarding feedback moment plus the headline outcomes.
 * A celebratory "lesson complete" card and the case-study result stats.
 */
function Completion() {
  const stats = [
    { value: "+29%", label: "lesson completion" },
    { value: "−40%", label: "navigation steps" },
    { value: "84", label: "SUS usability" },
  ];
  return (
    <Frame>
      <defs>
        <linearGradient id="lm-done" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={L.violet} />
          <stop offset="100%" stopColor={L.violetDeep} />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={L.mist} />

      {/* completion card */}
      <rect x="150" y="130" width="1300" height="360" rx="28" fill="url(#lm-done)" />
      {/* check badge */}
      <circle cx="320" cy="310" r="76" fill={L.paper} opacity="0.14" />
      <circle cx="320" cy="310" r="52" fill={L.mint} />
      <path
        d="M 296 310 l 16 18 l 32 -38"
        fill="none"
        stroke={L.paper}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="440" y="270" fill={L.goldSoft} fontFamily="Inter, sans-serif" fontSize="24" fontWeight="600" letterSpacing="3">
        LESSON COMPLETE
      </text>
      <text x="440" y="336" fill={L.paper} fontFamily="Sora, sans-serif" fontSize="56" fontWeight="800" letterSpacing="-1.5">
        Nice — you're on a roll.
      </text>
      <text x="440" y="386" fill={L.lilac} fontFamily="Inter, sans-serif" fontSize="26">
        3 of 5 modules done · keep the streak going.
      </text>
      <Button x={440} y={416} w={260} label="Next lesson →" h={56} />

      {/* result stats */}
      {stats.map((s, i) => {
        const cx = 150 + i * 445;
        return (
          <g key={s.label}>
            <rect x={cx} y="560" width="400" height="230" rx="24" fill={L.paper} stroke={L.line} strokeWidth="2" />
            <text x={cx + 200} y="680" fill={L.violet} fontFamily="Sora, sans-serif" fontSize="84" fontWeight="800" textAnchor="middle" letterSpacing="-3">
              {s.value}
            </text>
            <text x={cx + 200} y="732" fill={L.slate} fontFamily="Inter, sans-serif" fontSize="26" textAnchor="middle">
              {s.label}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}

const scenes: Record<Scene, () => React.JSX.Element> = {
  "lesson-view": LessonView,
  "course-map": CourseMap,
  progress: Progress,
  "lesson-types": LessonTypes,
  completion: Completion,
};

export function LearningAsset({ scene, className, alt }: LearningAssetProps) {
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
export const learningScenes: { scene: Scene; alt: string }[] = [
  {
    scene: "lesson-view",
    alt: "Lumin lesson view — a course sidebar with completed and current lessons, a large video player with a scrubber, an always-visible course-progress bar at 45%, and an obvious 'Next lesson' button.",
  },
  {
    scene: "course-map",
    alt: "Course map — five modules laid out as a linear path (Welcome, Core concepts, Your first build, Going deeper, Ship it) with completed steps checked in green and a 'You're here' marker under the current step.",
  },
  {
    scene: "progress",
    alt: "Progress view — a circular progress ring at 60% beside a 'Continue where you left off' card showing the next lesson, a module progress bar, and a 'Continue lesson' button.",
  },
  {
    scene: "lesson-types",
    alt: "Lesson-type patterns — three consistent cards for Video (Watch), Reading (Read), and Quiz (Practice) under the heading 'One rhythm, every format.'",
  },
  {
    scene: "completion",
    alt: "Completion moment — a celebratory 'Lesson complete' card with a green check and a next-lesson button, above three outcome stats (+29% lesson completion, −40% navigation steps, 84 SUS usability).",
  },
];
