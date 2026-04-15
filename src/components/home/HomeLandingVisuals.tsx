import { useId, useState } from "react";

/**
 * “Cadence” illustration: three live workstreams (bars) braid into one hub, then release as forward motion.
 * Layout reads left→right as scatter → integrate → run — distinct from prior ribbon/river treatment.
 */
export function CoordinatedProgressIllustration() {
  const id = useId();
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;
  const [focus, setFocus] = useState<number | null>(null);
  const dim = focus === null ? 1 : 0.3;

  return (
    <figure className="group/ill relative mx-auto w-full max-w-[760px]" onMouseLeave={() => setFocus(null)}>
      <svg
        viewBox="0 0 760 360"
        className="h-auto w-full overflow-visible"
        role="img"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <title id={titleId}>Workstreams align into one rhythm, then move forward together</title>
        <desc id={descId}>
          Three vertical activity bars connect through a central hub; a bright channel continues to the right
          suggesting coordinated forward motion.
        </desc>
        <defs>
          <linearGradient id={`${id}-bg`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="var(--color-ori-foreground)" stopOpacity="0.04" />
            <stop offset="50%" stopColor="var(--color-ori-accent)" stopOpacity="0.07" />
            <stop offset="100%" stopColor="var(--color-ori-foreground)" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id={`${id}-ch`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-ori-accent)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-ori-accent)" stopOpacity="0.95" />
          </linearGradient>
          <filter id={`${id}-b`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="x" />
            <feMerge>
              <feMergeNode in="x" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width="760" height="360" rx="24" fill={`url(#${id}-bg)`} />

        {/* Forward lane (right) */}
        <g opacity="0.9">
          <rect x="520" y="158" width="200" height="44" rx="22" fill="color-mix(in srgb, var(--color-ori-accent) 8%, transparent)" stroke="color-mix(in srgb, var(--color-ori-accent) 40%, transparent)" strokeWidth="1" />
          <path
            d="M 548 180 L 568 180 M 588 180 L 608 180 M 628 180 L 648 180 M 668 180 L 688 180"
            stroke={`url(#${id}-ch)`}
            strokeWidth="3"
            strokeLinecap="round"
            className="ori-home-coord-flow"
          />
        </g>

        {/* Hub */}
        <polygon
          points="380,120 420,180 380,240 340,180"
          fill="color-mix(in srgb, var(--color-ori-foreground) 6%, transparent)"
          stroke="color-mix(in srgb, var(--color-ori-accent) 50%, transparent)"
          strokeWidth="1.2"
          filter={`url(#${id}-b)`}
        />
        <circle cx="380" cy="180" r="8" fill="var(--color-ori-accent)" fillOpacity="0.65" />

        {/* Three streams + connectors */}
        {[
          { x: 112, h: 72, i: 0 },
          { x: 172, h: 110, i: 1 },
          { x: 232, h: 88, i: 2 },
        ].map(({ x, h, i }) => {
          const top = 360 - h - 48;
          const cy = top - 50 - i * 12;
          return (
          <g key={i} style={{ opacity: focus === null || focus === i ? 1 : dim }} className="motion-safe:transition-opacity motion-safe:duration-300">
            <rect
              x={x - 22}
              y={top}
              width="44"
              height={h}
              rx="12"
              fill="color-mix(in srgb, var(--color-ori-accent) 12%, transparent)"
              stroke="color-mix(in srgb, var(--color-ori-foreground) 18%, transparent)"
              strokeWidth="1"
              className="cursor-pointer"
              onMouseEnter={() => setFocus(i)}
            />
            <path
              d={`M ${x} ${top} Q ${x + 55} ${cy}, 340 180`}
              fill="none"
              stroke="color-mix(in srgb, var(--color-ori-foreground) 22%, transparent)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
          );
        })}

        {/* Hub to runway */}
        <path
          d="M 420 180 L 520 180"
          fill="none"
          stroke={`url(#${id}-ch)`}
          strokeWidth="4"
          strokeLinecap="round"
          className="ori-home-coord-flow"
          filter={`url(#${id}-b)`}
        />

        <text x="620" y="174" textAnchor="middle" fill="var(--color-ori-foreground)" className="text-[11px] font-semibold">
          Forward
        </text>
        <text x="620" y="192" textAnchor="middle" fill="var(--color-ori-muted)" className="text-[9px]">
          together
        </text>
      </svg>
      <figcaption className="mt-4 text-center text-xs leading-relaxed text-ori-muted">
        Hover each bar to highlight a workstream feeding the same operating rhythm.
      </figcaption>
    </figure>
  );
}

function StepUnderstandArt() {
  return (
    <svg viewBox="0 0 140 88" className="h-[4.5rem] w-full text-ori-accent" aria-hidden>
      <rect
        x="12"
        y="52"
        width="22"
        height="24"
        rx="4"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="0.8"
      />
      <rect
        x="40"
        y="44"
        width="22"
        height="32"
        rx="4"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="0.8"
      />
      <rect
        x="68"
        y="36"
        width="22"
        height="40"
        rx="4"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="0.8"
      />
      <circle cx="102" cy="28" r="22" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <line x1="94" y1="28" x2="110" y2="28" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <line x1="102" y1="20" x2="102" y2="36" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

function StepAlignArt() {
  return (
    <svg viewBox="0 0 140 88" className="h-[4.5rem] w-full text-ori-accent" aria-hidden>
      <path
        d="M 18 62 L 52 34"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.35"
        strokeLinecap="round"
      />
      <path
        d="M 70 68 L 70 38"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.45"
        strokeLinecap="round"
      />
      <path
        d="M 122 62 L 88 34"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.35"
        strokeLinecap="round"
      />
      <circle cx="70" cy="28" r="10" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
      <circle cx="70" cy="28" r="4" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

/** “Move” — ascending cadence + forward thrust (distinct from prior wave + dots). */
function StepMoveArt() {
  return (
    <svg viewBox="0 0 140 88" className="h-[4.5rem] w-full text-ori-accent" aria-hidden>
      <rect x="14" y="58" width="20" height="22" rx="4" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.7" />
      <rect x="40" y="48" width="20" height="32" rx="4" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.7" />
      <rect x="66" y="38" width="20" height="42" rx="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.7" />
      <path
        d="M 96 44 L 118 56 L 96 68 Z"
        fill="currentColor"
        fillOpacity="0.55"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <line x1="22" y1="28" x2="118" y2="28" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 5" />
      <line x1="26" y1="22" x2="114" y2="22" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 6" />
    </svg>
  );
}

export const HOW_STEP_ART = [StepUnderstandArt, StepAlignArt, StepMoveArt] as const;
