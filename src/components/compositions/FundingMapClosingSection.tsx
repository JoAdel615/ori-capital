/**
 * Premium closing band for the Funding (/capital) hub — split layout, pillar tint,
 * subtle structure overlays (matches home hero language without duplicating the full hero).
 */
import type { ReactNode } from "react";
import { Button } from "../Button";
import { PageSection } from "../system";
import { CAPITAL_IMAGE_SET } from "../../constants/siteImagery";

const ROUTE_STEPS = [
  { label: "Consulting", hint: "Direction and sequencing" },
  { label: "Management", hint: "Systems and operational spine" },
  { label: "Capital", hint: "When the profile supports it" },
] as const;

interface FundingMapClosingSectionProps {
  id?: string;
  title: ReactNode;
  body: ReactNode;
  ctaLabel: string;
  ctaTo: string;
}

export function FundingMapClosingSection({ id, title, body, ctaLabel, ctaTo }: FundingMapClosingSectionProps) {
  const headingId = id ?? "funding-map-closing-heading";

  return (
    <PageSection
      variant="loose"
      className="border-t border-ori-border bg-ori-black section-divider"
      aria-labelledby={headingId}
    >
      <div className="relative overflow-hidden rounded-[1.75rem] border border-ori-border/70 bg-ori-surface-panel shadow-[0_28px_90px_rgba(0,0,0,0.42)] ring-1 ring-white/[0.04] ori-pillar-band-capital">
        <img
          src={CAPITAL_IMAGE_SET[1]!.src}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.22]"
          loading="lazy"
          decoding="async"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ori-black/20 via-transparent to-ori-black/35"
          aria-hidden
        />

        <div className="pointer-events-none absolute left-5 top-5 h-9 w-9 border-l border-t border-white/[0.14] md:left-8 md:top-8" aria-hidden />
        <div className="pointer-events-none absolute right-5 top-5 h-9 w-9 border-r border-t border-white/[0.14] md:right-8 md:top-8" aria-hidden />
        <div className="pointer-events-none absolute bottom-5 left-5 h-9 w-9 border-b border-l border-white/[0.14] md:bottom-8 md:left-8" aria-hidden />
        <div className="pointer-events-none absolute bottom-5 right-5 h-9 w-9 border-b border-r border-white/[0.14] md:bottom-8 md:right-8" aria-hidden />

        <div className="relative z-[1] grid gap-12 p-6 md:p-10 lg:grid-cols-12 lg:items-center lg:gap-14 lg:p-12">
          <div className="lg:col-span-7">
            <p className="ori-type-eyebrow">Funding</p>
            <h2
              id={headingId}
              className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-[-0.03em] text-ori-text-primary md:text-4xl md:leading-[1.12]"
            >
              {title}
            </h2>
            <div className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ori-text-secondary md:text-lg md:leading-relaxed">
              {body}
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button to={ctaTo} size="lg" className="rounded-full px-10">
                {ctaLabel}
              </Button>
            </div>
          </div>

          <aside
            className="relative lg:col-span-5"
            aria-label="How inquiries are routed across Ori"
          >
            <div className="rounded-2xl border border-ori-border/60 bg-ori-black/30 p-6 backdrop-blur-sm md:p-7">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ori-muted">Route</p>
              <ol className="relative mt-6 space-y-0">
                {ROUTE_STEPS.map((step, i) => (
                  <li key={step.label} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < ROUTE_STEPS.length - 1 ? (
                      <span
                        className="absolute left-4 top-10 bottom-0 w-px bg-gradient-to-b from-ori-accent/50 to-ori-border/80"
                        aria-hidden
                      />
                    ) : null}
                    <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ori-accent/35 bg-ori-accent/10 font-display text-xs font-bold text-ori-accent">
                      {i + 1}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-display text-sm font-semibold text-ori-foreground md:text-base">{step.label}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ori-muted md:text-sm">{step.hint}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </PageSection>
  );
}
