import { Button } from "../Button";
import { InfoPopover } from "../InfoPopover";
import { ROUTES } from "../../utils/navigation";
import { config } from "../../config";

const LENDERS_BULLETS = ["Risk-averse", "Collateral-based", "Cash-flow first", "Predictable terms"];
const INVESTORS_BULLETS = ["Power-law bets", "Growth required", "Dilution tradeoff", "Exit-driven"];
const GAP_BULLETS = [
  "Revenue is real",
  "Cash flow is tight",
  "Traction ≠ scale",
  "Not bank-ready",
  "Not VC-shaped",
];

const STATS = [
  {
    big: "< 1%",
    label: "Businesses raise venture capital",
    tooltip:
      "Across the U.S., only a tiny fraction of businesses raise VC in a given year. This is often described as \"less than 1%.\"",
  },
  {
    big: "~ 4 in 10",
    label: "Applicants receive all funding sought",
    tooltip:
      "In the Federal Reserve's Small Business Credit Survey, a minority of financing applicants report receiving the full amount they sought.",
  },
  {
    big: "Majority",
    label: "Startups begin with personal savings",
    tooltip:
      "Startup finance research consistently shows most founders start with personal/family savings before outside capital is available.",
  },
] as const;

/**
 * Home section: one diagram (Lenders — bridge — Investors) with operators under the bridge.
 * Single SVG, chip stats, clear CTAs. Respects prefers-reduced-motion.
 */
export function FundingGapIllustration() {
  return (
    <section
      className="relative py-28 bg-ori-black section-divider overflow-x-hidden"
      aria-labelledby="funding-gap-illustration-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <header className="text-center mb-12">
          <h2
            id="funding-gap-illustration-heading"
            className="font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl"
          >
            Most operators live in the gap.
          </h2>
          <p className="mx-auto mt-5 max-w-[680px] text-lg text-ori-muted leading-relaxed">
            Banks want collateral and predictability. Investors want hypergrowth and upside. Most builders are real
            businesses—too early for one, too &quot;normal&quot; for the other.
          </p>
        </header>

        {/* Single illustration card: one SVG diagram + legend row + chips + CTAs */}
        <div className="rounded-2xl border border-ori-border bg-gradient-to-b from-ori-surface to-ori-charcoal p-6 shadow-sm ring-1 ring-ori-border/30 md:p-10">
          {/* One integrated SVG: buildings left, bridge center, buildings right, operators under */}
          <div className="w-full overflow-hidden rounded-xl bg-ori-black py-6 px-4 md:px-6">
            <BridgeDiagram />
          </div>

          {/* Legend: three columns of bullets under the diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mt-8">
            <div className="text-center md:text-left">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-ori-muted">Lenders</h3>
              <ul className="mt-2 space-y-1 text-sm text-ori-muted">
                {LENDERS_BULLETS.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ori-accent">Where most builders live</h3>
              <h3 className="font-display text-lg font-semibold text-ori-foreground mt-1">The Gap</h3>
              <ul className="mt-2 space-y-1 text-sm text-ori-foreground">
                {GAP_BULLETS.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-ori-muted leading-relaxed max-w-[260px] mx-auto md:mx-auto">
                Ori structures capital for the gap—clear options, clean terms, and a path to readiness.
              </p>
            </div>
            <div className="text-center md:text-right">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-ori-muted">Investors</h3>
              <ul className="mt-2 space-y-1 text-sm text-ori-muted">
                {INVESTORS_BULLETS.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stat chips: pill style with border and background */}
          <div className="mt-8 pt-8 border-t border-ori-border flex flex-wrap justify-center gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="inline-flex flex-col sm:flex-row sm:items-center gap-1.5 rounded-xl border border-ori-border bg-ori-charcoal/80 px-4 py-3 min-w-[200px] sm:min-w-0"
              >
                <div className="flex items-center justify-center gap-2">
                  <InfoPopover title={stat.label} content={<p className="text-ori-muted text-sm">{stat.tooltip}</p>}>
                    <span className="font-display text-xl font-bold text-ori-foreground">{stat.big}</span>
                  </InfoPopover>
                </div>
                <span className="text-xs text-ori-muted text-center sm:text-left">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs: clearly below the card with copy */}
        <p className="mt-8 text-center text-sm text-ori-muted">
          Funding isn&apos;t broken. It&apos;s fragmented. We bring structure to the space between banks and venture.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          {config.applyExternalUrl ? (
            <Button href={config.applyExternalUrl} size="lg">
              Apply for Funding
            </Button>
          ) : (
            <Button to={ROUTES.APPLY} size="lg">
              Apply for Funding
            </Button>
          )}
          <Button to={ROUTES.FUNDING_READINESS} variant="secondary" size="lg">
            Get Pre-Qualified
          </Button>
        </div>
      </div>
    </section>
  );
}

/** Single SVG: left buildings, bridge beam with glow, right buildings, operators under, dotted flow line */
function BridgeDiagram() {
  return (
    <svg
      viewBox="0 0 800 260"
      className="w-full h-auto min-h-[200px] md:min-h-[240px]"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <linearGradient id="bridge-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-ori-accent)" stopOpacity="0" />
          <stop offset="30%" stopColor="var(--color-ori-accent)" stopOpacity="0.2" />
          <stop offset="50%" stopColor="var(--color-ori-accent)" stopOpacity="0.35" />
          <stop offset="70%" stopColor="var(--color-ori-accent)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--color-ori-accent)" stopOpacity="0" />
        </linearGradient>
        <filter id="bridge-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feFlood floodColor="var(--color-ori-accent)" floodOpacity="0.4" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="var(--color-ori-muted)" fillOpacity="0.6" />
        </marker>
      </defs>

      {/* Left buildings */}
      <g fill="var(--color-ori-muted)" fillOpacity="0.85" stroke="var(--color-ori-border)" strokeWidth="0.5">
        <rect x="24" y="72" width="56" height="88" rx="2" />
        <rect x="32" y="84" width="10" height="10" fill="var(--color-ori-charcoal)" />
        <rect x="48" y="84" width="10" height="10" fill="var(--color-ori-charcoal)" />
        <rect x="32" y="100" width="10" height="10" fill="var(--color-ori-charcoal)" />
        <rect x="48" y="100" width="10" height="10" fill="var(--color-ori-charcoal)" />
        <rect x="92" y="48" width="64" height="112" rx="2" />
        <rect x="104" y="62" width="12" height="12" fill="var(--color-ori-charcoal)" />
        <rect x="124" y="62" width="12" height="12" fill="var(--color-ori-charcoal)" />
        <rect x="104" y="82" width="12" height="12" fill="var(--color-ori-charcoal)" />
        <rect x="124" y="82" width="12" height="12" fill="var(--color-ori-charcoal)" />
        <rect x="104" y="102" width="12" height="12" fill="var(--color-ori-charcoal)" />
        <rect x="124" y="102" width="12" height="12" fill="var(--color-ori-charcoal)" />
        <rect x="168" y="88" width="48" height="72" rx="2" />
        <rect x="180" y="100" width="10" height="10" fill="var(--color-ori-charcoal)" />
        <rect x="196" y="100" width="10" height="10" fill="var(--color-ori-charcoal)" />
      </g>
      <text x="144" y="178" textAnchor="middle" className="fill-ori-muted text-[11px] font-semibold" fontFamily="var(--font-display), system-ui, sans-serif">Lenders</text>

      {/* Right buildings */}
      <g fill="var(--color-ori-muted)" fillOpacity="0.85" stroke="var(--color-ori-border)" strokeWidth="0.5">
        <rect x="528" y="96" width="44" height="64" rx="2" />
        <rect x="538" y="108" width="8" height="8" fill="var(--color-ori-charcoal)" />
        <rect x="552" y="108" width="8" height="8" fill="var(--color-ori-charcoal)" />
        <rect x="584" y="64" width="56" height="96" rx="2" />
        <rect x="596" y="78" width="10" height="10" fill="var(--color-ori-charcoal)" />
        <rect x="614" y="78" width="10" height="10" fill="var(--color-ori-charcoal)" />
        <rect x="596" y="98" width="10" height="10" fill="var(--color-ori-charcoal)" />
        <rect x="614" y="98" width="10" height="10" fill="var(--color-ori-charcoal)" />
        <rect x="652" y="80" width="64" height="80" rx="2" />
        <rect x="668" y="94" width="12" height="12" fill="var(--color-ori-charcoal)" />
        <rect x="688" y="94" width="12" height="12" fill="var(--color-ori-charcoal)" />
        <rect x="668" y="114" width="12" height="12" fill="var(--color-ori-charcoal)" />
        <rect x="688" y="114" width="12" height="12" fill="var(--color-ori-charcoal)" />
        <rect x="728" y="100" width="48" height="60" rx="2" />
        <rect x="740" y="112" width="8" height="8" fill="var(--color-ori-charcoal)" />
      </g>
      <text x="656" y="178" textAnchor="middle" className="fill-ori-muted text-[11px] font-semibold" fontFamily="var(--font-display), system-ui, sans-serif">Investors</text>

      {/* Bridge beam: glow layer (pulses) + deck on top */}
      <rect
        x="208"
        y="84"
        width="384"
        height="52"
        rx="6"
        fill="var(--color-ori-accent)"
        fillOpacity="0.12"
        filter="url(#bridge-soft-glow)"
        className="gap-glow-pulse"
      />
      <rect x="216" y="92" width="368" height="36" rx="4" fill="url(#bridge-glow-grad)" opacity="0.4" />
      <rect
        x="216"
        y="92"
        width="368"
        height="36"
        rx="4"
        fill="var(--color-ori-surface)"
        stroke="var(--color-ori-accent)"
        strokeWidth="2"
        strokeOpacity="0.8"
      />
      <line x1="230" y1="108" x2="582" y2="108" stroke="var(--color-ori-border)" strokeWidth="0.5" opacity="0.6" />
      <line x1="230" y1="118" x2="582" y2="118" stroke="var(--color-ori-border)" strokeWidth="0.5" opacity="0.6" />
      <text x="400" y="115" textAnchor="middle" className="fill-ori-accent text-[12px] font-semibold" fontFamily="var(--font-display), system-ui, sans-serif">The Gap</text>

      {/* Dotted flow line along bridge (animates left to right) */}
      <line
        x1="220"
        y1="128"
        x2="580"
        y2="128"
        stroke="var(--color-ori-muted)"
        strokeWidth="1"
        strokeOpacity="0.5"
        className="gap-dotted-flow"
      />

      {/* Operators under the bridge */}
      <g>
        {[280, 320, 360, 400, 440, 480, 520].map((cx, i) => (
          <circle key={i} cx={cx} cy="168" r="8" fill="var(--color-ori-muted)" fillOpacity={0.35 + (i % 3) * 0.15} />
        ))}
        <text x="400" y="198" textAnchor="middle" className="fill-ori-muted text-[10px]" fontFamily="var(--font-sans), system-ui, sans-serif">Most operators end up here</text>
      </g>

      {/* Flow arrow: operators → bridge */}
      <line x1="400" y1="160" x2="400" y2="128" stroke="var(--color-ori-muted)" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="4 3" markerEnd="url(#arrow)" />
    </svg>
  );
}
