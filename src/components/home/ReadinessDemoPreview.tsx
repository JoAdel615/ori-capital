import { CheckCircle2, Play } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "../Button";
import { ROUTES } from "../../utils/navigation";

const DEMO_VIDEO_SRC = "/videos/fundability-demo-revised.mp4";
const DEMO_POSTER_SRC = "/videos/fundability-demo-poster.jpg";

const BULLETS = [
  "Build a stronger profile lenders are more likely to approve",
  "Understand where you stand and what to improve",
  "Access more capital options through a broader network",
] as const;

function ReadinessDemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  /** Native controls only after first playback so the initial state is a calm poster + play affordance. */
  const [hasStarted, setHasStarted] = useState(false);
  const showOverlay = !hasStarted;

  const handlePlayIntent = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    setHasStarted(true);
    void el.play();
  }, []);

  return (
    <div className="relative h-full min-h-[200px] w-full bg-ori-black">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-contain"
        poster={DEMO_POSTER_SRC}
        preload="metadata"
        playsInline
        controls={hasStarted}
        onPlay={() => setHasStarted(true)}
        onEnded={() => {
          const el = videoRef.current;
          if (el) el.currentTime = 0;
        }}
        aria-label="Fundability System demo video. Audio plays after you start playback."
      >
        <source src={DEMO_VIDEO_SRC} type="video/mp4" />
        Your browser does not support embedded video.{" "}
        <a href={DEMO_VIDEO_SRC} className="text-ori-accent underline">
          Download the demo
        </a>
        .
      </video>

      {showOverlay ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-ori-black/70 via-ori-black/25 to-ori-black/40">
          <button
            type="button"
            onClick={handlePlayIntent}
            className="group flex h-16 w-16 items-center justify-center rounded-full border border-ori-accent/50 bg-ori-black/75 text-ori-accent shadow-lg shadow-ori-black/50 backdrop-blur-sm transition-all hover:scale-105 hover:border-ori-accent hover:bg-ori-accent/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ori-accent md:h-[4.5rem] md:w-[4.5rem]"
            aria-label="Play Fundability System demo video"
          >
            <Play className="ml-1 h-7 w-7 fill-current md:h-8 md:w-8" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * iPad-style device frame: bezel, front camera, screen.
 */
function IpadDemoFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
      <div
        className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_20%,rgba(201,243,29,0.1),transparent_50%)] blur-xl"
        aria-hidden
      />
      <div
        className="relative rounded-[1.65rem] border border-zinc-600/40 bg-gradient-to-b from-zinc-600/90 via-zinc-800 to-zinc-900 p-2 shadow-[0_32px_64px_-20px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/[0.07] sm:rounded-[1.85rem] sm:p-2.5"
      >
        <div className="mb-2 flex justify-center sm:mb-2.5">
          <span
            className="h-2 w-2 rounded-full bg-zinc-950 ring-1 ring-zinc-700/80"
            aria-hidden
          />
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[0.65rem] bg-black ring-1 ring-black/60 sm:rounded-xl">
          <div className="absolute inset-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Home: split “Qualify before you apply” block with copy + Fundability System demo in an iPad frame.
 */
export function ReadinessDemoPreview() {
  return (
    <div className="w-full">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-14">
        <div className="min-w-0 lg:max-w-xl xl:max-w-none">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ori-accent/90">Funding readiness</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl">
            Qualify before you apply
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ori-muted md:text-lg">
            The Fundability System helps entrepreneurs identify gaps, strengthen the signals lenders evaluate, and prepare
            for funding with more clarity.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ori-foreground md:text-base">
            {BULLETS.map((text) => (
              <li key={text} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ori-accent" aria-hidden />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button to={ROUTES.FUNDING_READINESS} size="lg" className="min-w-[200px]">
              Get Pre-Qualified
            </Button>
          </div>
        </div>

        <div className="relative min-w-0">
          <IpadDemoFrame>
            <ReadinessDemoVideo />
          </IpadDemoFrame>
        </div>
      </div>
    </div>
  );
}
