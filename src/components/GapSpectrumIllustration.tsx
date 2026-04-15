import { Landmark, Building2 } from "lucide-react";

// ——— Configurable stat chip values (update sources here) ———
const STAT_LENDERS = {
  value: "~4 in 10",
  caption: "Businesses secure funding from lenders",
} as const;
const STAT_GAP = {
  value: "~78%",
  caption: "Businesses rely on founder self-funding",
} as const;
const STAT_INVESTORS = {
  value: "Less than 1%",
  caption: "Businesses raise funding from investors",
} as const;

interface GapSpectrumIllustrationProps {
  /** When true, section is at least one viewport tall and content is vertically centered. */
  fullViewport?: boolean;
}

/**
 * Home section: funding spectrum — Lenders ↔ The Gap ↔ Investors.
 * Single illustrated panel with skyline SVG, critique copy, and semantically aligned stat chips.
 */
export function GapSpectrumIllustration({ fullViewport = false }: GapSpectrumIllustrationProps) {
  return (
    <section
      className={
        fullViewport
          ? "relative min-h-screen min-h-dvh flex flex-col justify-center bg-ori-black section-divider overflow-x-hidden py-12 md:py-16"
          : "relative py-28 bg-ori-black section-divider overflow-x-hidden"
      }
      aria-labelledby="gap-spectrum-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <header className="text-center mb-12">
          <h2
            id="gap-spectrum-heading"
            className="font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl"
          >
            Funding the gap
          </h2>
          <p className="mx-auto mt-5 max-w-[680px] text-lg text-ori-muted leading-relaxed">
            Traditional banks weren't built for modern founders. Venture capital isn't right for every business.
          </p>
        </header>

        {/* Single panel: gradient, border, soft glow */}
        <div className="relative rounded-2xl border border-ori-border bg-gradient-to-b from-ori-surface to-ori-charcoal p-6 shadow-sm ring-1 ring-ori-border/30 md:p-10">
          {/* Illustration: Lucide icons (1–2 buildings per side) + bridge */}
          <div className="w-full overflow-hidden rounded-xl bg-ori-black py-8 px-4 md:px-6">
            <SpectrumIllustration />
          </div>

          {/* Stat chips: left | center | right alignment */}
          <div className="mt-8 pt-8 border-t border-ori-border grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-ori-border bg-ori-surface px-4 py-3 shadow-sm">
              <p className="font-display text-xl font-bold text-ori-foreground text-center">{STAT_LENDERS.value}</p>
              <p className="mt-0.5 text-xs text-ori-muted text-center">{STAT_LENDERS.caption}</p>
            </div>
            <div className="rounded-xl border border-ori-border bg-ori-surface px-4 py-3 text-center shadow-sm">
              <p className="font-display text-xl font-bold text-ori-foreground text-center">{STAT_GAP.value}</p>
              <p className="mt-0.5 text-xs text-ori-muted text-center">{STAT_GAP.caption}</p>
            </div>
            <div className="rounded-xl border border-ori-border bg-ori-surface px-4 py-3 shadow-sm">
              <p className="font-display text-xl font-bold text-ori-foreground text-center">{STAT_INVESTORS.value}</p>
              <p className="mt-0.5 text-xs text-ori-muted text-center">{STAT_INVESTORS.caption}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Illustration: one building per side (Lucide) + bridge. Design-kit uniformity. */
function SpectrumIllustration() {
  const iconClass = "text-ori-muted shrink-0";
  const iconSize = 88;

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-6 md:grid-cols-3 md:gap-6">
      {/* Left: Lenders — nudged toward container edge */}
      <div className="flex flex-col items-center justify-center gap-3 md:-translate-x-[18%]">
        <span className="inline-flex rounded-xl border border-ori-border bg-ori-surface p-4 shadow-sm" aria-hidden>
          <Landmark className={iconClass} width={iconSize} height={iconSize} strokeWidth={1.5} />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-ori-muted text-center">Lenders</span>
      </div>

      {/* Center: bridge line + The Funding Gap platform */}
      <div className="flex min-w-0 w-full items-center justify-center px-1 sm:px-2">
        <svg
          viewBox="0 0 560 86"
          className="h-[5.25rem] w-full max-w-2xl text-ori-border md:h-[6.25rem] lg:max-w-3xl"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <line x1="0" y1="43" x2="78" y2="43" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
          <line x1="482" y1="43" x2="560" y2="43" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
          <rect
            x="84"
            y="11"
            width="392"
            height="64"
            rx="8"
            fill="var(--color-ori-surface)"
            stroke="var(--color-ori-accent)"
            strokeWidth="2.5"
            strokeOpacity="0.85"
          />
          <text
            x="280"
            y="43"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-ori-accent)"
            fontSize="24"
            fontFamily="var(--font-display), system-ui, sans-serif"
            fontWeight="600"
            letterSpacing="-0.02em"
          >
            The Funding Gap
          </text>
        </svg>
      </div>

      {/* Right: Investors — nudged toward container edge */}
      <div className="flex flex-col items-center justify-center gap-3 md:translate-x-[18%]">
        <span className="inline-flex rounded-xl border border-ori-border bg-ori-surface p-4 shadow-sm" aria-hidden>
          <Building2 className={iconClass} width={iconSize} height={iconSize} strokeWidth={1.5} />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-ori-muted text-center">Investors</span>
      </div>
    </div>
  );
}
