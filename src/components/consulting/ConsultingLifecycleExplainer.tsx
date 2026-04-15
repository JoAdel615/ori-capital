import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CONSULTING_LIFECYCLE_LANDINGS } from "../../data/consultingLifecycleLandings";
import { PageSection, SectionHeading } from "../system";

type StageDef = (typeof CONSULTING_LIFECYCLE_LANDINGS)[number] & {
  Illustration: () => ReactNode;
};

function SvgFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div
      className="flex h-24 w-full items-center justify-center rounded-lg border border-ori-border/70 bg-gradient-to-b from-ori-black/80 to-ori-surface-panel/90 p-2 sm:h-28"
      role="img"
      aria-label={label}
    >
      <svg viewBox="0 0 320 140" className="h-[4.5rem] w-full max-w-[220px] text-ori-accent sm:h-[5.25rem]" aria-hidden>
        {children}
      </svg>
    </div>
  );
}

function IlluBusinessModelCanvas() {
  return (
    <SvgFrame label="Business model canvas-style grid">
      <g fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.85">
        <rect x="8" y="8" width="304" height="124" rx="6" className="stroke-ori-border" />
        <line x1="108" y1="8" x2="108" y2="132" strokeDasharray="4 3" opacity="0.5" />
        <line x1="208" y1="8" x2="208" y2="132" strokeDasharray="4 3" opacity="0.5" />
        <line x1="8" y1="52" x2="312" y2="52" strokeDasharray="4 3" opacity="0.5" />
        <line x1="8" y1="96" x2="312" y2="96" strokeDasharray="4 3" opacity="0.5" />
        <rect x="18" y="18" width="78" height="26" rx="3" className="fill-ori-accent/15 stroke-ori-accent/50" />
        <rect x="118" y="62" width="78" height="26" rx="3" className="fill-ori-accent/10 stroke-ori-accent/35" />
        <rect x="218" y="18" width="78" height="26" rx="3" className="fill-ori-accent/8 stroke-ori-accent/30" />
        <circle cx="260" cy="110" r="10" className="fill-ori-accent/25 stroke-ori-accent" />
        <path d="M256 110h8M260 106v8" stroke="currentColor" strokeWidth="1.5" />
      </g>
    </SvgFrame>
  );
}

function IlluCompliance() {
  return (
    <SvgFrame label="Formation and compliance documents">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="40" y="24" width="100" height="130" rx="4" className="stroke-ori-border fill-ori-black/40" />
        <rect x="56" y="40" width="68" height="6" rx="1" className="fill-ori-accent/35" />
        <rect x="56" y="54" width="52" height="4" rx="1" className="fill-ori-foreground/15" />
        <rect x="56" y="64" width="60" height="4" rx="1" className="fill-ori-foreground/12" />
        <path d="M52 118l10 10 22-22" className="stroke-ori-accent" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="170" y="34" width="110" height="120" rx="4" className="stroke-ori-border/70 fill-ori-surface-panel/50" />
        <rect x="186" y="52" width="78" height="5" rx="1" className="fill-ori-foreground/12" />
        <rect x="186" y="66" width="64" height="5" rx="1" className="fill-ori-foreground/10" />
      </g>
    </SvgFrame>
  );
}

function IlluProcessFlow() {
  return (
    <SvgFrame label="Process flow between teams and systems">
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="20" y="48" width="72" height="44" rx="6" className="fill-ori-accent/12 stroke-ori-accent/45" />
        <rect x="124" y="48" width="72" height="44" rx="6" className="fill-ori-surface-panel stroke-ori-border" />
        <rect x="228" y="48" width="72" height="44" rx="6" className="fill-ori-surface-panel stroke-ori-border" />
        <path d="M92 70h24M196 70h24" className="stroke-ori-accent/70" markerEnd="url(#ori-consult-flow-arrow)" />
        <defs>
          <marker id="ori-consult-flow-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="#c9f31d" />
          </marker>
        </defs>
        <text x="36" y="38" className="fill-ori-muted text-[10px] font-medium" fontSize="10">
          Input
        </text>
        <circle cx="160" cy="24" r="6" className="fill-ori-accent/30 stroke-ori-accent" />
      </g>
    </SvgFrame>
  );
}

function IlluReach() {
  return (
    <SvgFrame label="Reach and acquisition channels">
      <g fill="none" stroke="currentColor">
        <circle cx="160" cy="70" r="36" className="stroke-ori-accent/40" strokeWidth="1.5" />
        <circle cx="100" cy="70" r="14" className="fill-ori-accent/20 stroke-ori-accent/60" />
        <circle cx="220" cy="70" r="14" className="fill-ori-accent/12 stroke-ori-border" />
        <circle cx="160" cy="34" r="12" className="fill-ori-accent/25 stroke-ori-accent/50" />
        <line x1="112" y1="70" x2="128" y2="70" className="stroke-ori-accent/35" strokeWidth="1.2" />
        <line x1="192" y1="70" x2="208" y2="70" className="stroke-ori-accent/35" strokeWidth="1.2" />
        <line x1="160" y1="46" x2="160" y2="58" className="stroke-ori-accent/35" strokeWidth="1.2" />
      </g>
    </SvgFrame>
  );
}

function IlluMeasure() {
  return (
    <SvgFrame label="Metrics and growth measurement">
      <g fill="none" stroke="currentColor">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={48 + i * 44}
            y={100 - i * 14}
            width="28"
            height={20 + i * 14}
            rx="2"
            className={i >= 3 ? "fill-ori-accent/35 stroke-ori-accent/60" : "fill-ori-foreground/10 stroke-ori-border"}
          />
        ))}
        <path
          d="M52 32 Q120 8 200 24 T300 18"
          className="stroke-ori-accent/50"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="300" cy="18" r="5" className="fill-ori-accent" />
      </g>
    </SvgFrame>
  );
}

function IlluLeverageCapital() {
  return (
    <SvgFrame label="Leverage funding at the right time">
      <g fill="none" stroke="currentColor">
        <path d="M40 100 L140 40 L240 100" className="stroke-ori-border" strokeWidth="1.2" />
        <rect x="120" y="88" width="80" height="36" rx="6" className="fill-ori-accent/18 stroke-ori-accent/55" />
        <text x="132" y="112" fill="#c9f31d" fontSize="11" fontWeight="600">
          Funding
        </text>
        <circle cx="60" cy="108" r="16" className="fill-ori-surface-panel stroke-ori-accent/40" />
        <circle cx="260" cy="108" r="16" className="fill-ori-surface-panel stroke-ori-accent/40" />
        <path d="M76 108h168" className="stroke-ori-accent/45" strokeWidth="2" strokeDasharray="6 4" />
        <path d="M160 52v28" className="stroke-ori-accent" strokeWidth="2" markerEnd="url(#ori-consult-cap-arrow)" />
        <defs>
          <marker id="ori-consult-cap-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill="#c9f31d" />
          </marker>
        </defs>
      </g>
    </SvgFrame>
  );
}

const ILLUSTRATION_BY_SLUG: Record<(typeof CONSULTING_LIFECYCLE_LANDINGS)[number]["slug"], () => ReactNode> = {
  "sharpen-your-business-model": IlluBusinessModelCanvas,
  "build-the-right-foundation": IlluCompliance,
  "build-a-predictable-pipeline": IlluReach,
  "systemize-your-operations": IlluProcessFlow,
  "install-your-growth-engine": IlluMeasure,
  "deploy-capital-strategically": IlluLeverageCapital,
};

const STAGES: StageDef[] = CONSULTING_LIFECYCLE_LANDINGS.map((landing) => ({
  ...landing,
  Illustration: ILLUSTRATION_BY_SLUG[landing.slug],
}));

export function ConsultingLifecycleExplainer() {
  return (
    <PageSection className="bg-ori-section-alt">
      <SectionHeading
        title="The Ori Playbook"
        subtitle="Every business has different constraints, but the path forward follows a pattern. We focus on the highest-leverage moves at each stage, then build from there."
        align="left"
      />
      <ol className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {STAGES.map((stage) => {
          const Illu = stage.Illustration;
          return (
            <li key={stage.slug}>
              <Link
                to={`/consulting/lifecycle/${stage.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-ori-border bg-ori-black/40 transition-colors hover:border-ori-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-section-alt"
              >
                <Illu />
                <div className="flex flex-1 flex-col p-3 md:p-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-ori-muted/65 md:text-[11px]">
                    {stage.phase}
                  </p>
                  <h3 className="mt-2 font-display text-base font-semibold text-ori-foreground md:text-lg">{stage.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-ori-muted md:text-sm">{stage.body}</p>
                  <span className="mt-3 text-xs font-semibold text-ori-accent group-hover:underline">Learn more</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </PageSection>
  );
}
