import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Button } from "../Button";
import { PageContainer } from "../system";
import { pathWithRef } from "../../lib/referral/attribution";
import { ROUTES } from "../../utils/navigation";
import { HOME_DIVERSE_FOUNDERS, HOME_HERO_BACKGROUND } from "../../constants/siteImagery";

/** Inset portrait — professional founder context (distinct from full-bleed meeting photo). */
const referralHeroInset = HOME_DIVERSE_FOUNDERS[0];

const hairline = "border-white/[0.08]";

const gridPlaneStyle: CSSProperties = {
  backgroundImage: `
    linear-gradient(to right, color-mix(in srgb, var(--color-ori-foreground) 5%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--color-ori-foreground) 5%, transparent) 1px, transparent 1px)
  `,
  backgroundSize: "56px 56px",
};

const meshHeroStyle: CSSProperties = {
  background: `
    radial-gradient(ellipse 100% 80% at 50% -20%, color-mix(in srgb, var(--color-ori-accent) 18%, transparent), transparent 55%),
    radial-gradient(ellipse 60% 50% at 100% 60%, color-mix(in srgb, var(--color-ori-pillar-consulting-hint) 12%, transparent), transparent 45%),
    radial-gradient(ellipse 50% 45% at 0% 70%, color-mix(in srgb, var(--color-ori-pillar-capital-hint) 10%, transparent), transparent 42%)
  `,
};

type ReferralHeroProps = {
  refCode: string;
  onCtaClick?: (cta: string) => void;
};

export function ReferralHero({ refCode, onCtaClick }: ReferralHeroProps) {
  const individualPath = pathWithRef(ROUTES.FUNDING_READINESS_INDIVIDUAL, refCode);
  const businessPath = pathWithRef(ROUTES.FUNDING_READINESS, refCode);
  const surveyPath = pathWithRef(ROUTES.FUNDING_READINESS_SURVEY, refCode);

  return (
    <section
      className={`relative isolate flex min-h-[min(92dvh,900px)] flex-col justify-center overflow-hidden border-b ${hairline} bg-ori-surface-base text-ori-text-primary`}
      aria-labelledby="referral-hero-heading"
    >
      <img
        src={HOME_HERO_BACKGROUND}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      <div className="pointer-events-none absolute inset-0 bg-ori-black/74 md:bg-ori-black/66" aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]" style={gridPlaneStyle} aria-hidden />
      <div className="pointer-events-none absolute inset-0" style={meshHeroStyle} aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ori-black/45 via-ori-black/55 to-ori-surface-base"
        aria-hidden
      />

      <div className="pointer-events-none absolute left-4 top-4 h-9 w-9 border-l border-t border-white/[0.12] sm:left-6 sm:top-6 lg:left-8 lg:top-8" aria-hidden />
      <div className="pointer-events-none absolute right-4 top-4 h-9 w-9 border-r border-t border-white/[0.12] sm:right-6 sm:top-6 lg:right-8 lg:top-8" aria-hidden />
      <div className="pointer-events-none absolute bottom-4 left-4 h-9 w-9 border-b border-l border-white/[0.12] sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8" aria-hidden />
      <div className="pointer-events-none absolute bottom-4 right-4 h-9 w-9 border-b border-r border-white/[0.12] sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8" aria-hidden />

      <PageContainer maxWidth="max-w-6xl" className="relative z-10 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <h1
              id="referral-hero-heading"
              className="font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-ori-text-primary sm:text-4xl md:text-5xl md:leading-[1.05] lg:text-[2.75rem] lg:tracking-[-0.04em]"
            >
              Don&apos;t just apply for funding,{" "}
              <span className="text-ori-accent">qualify for it</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty ori-lead text-ori-text-secondary md:text-lg md:leading-relaxed">
              The Funding Readiness Program helps you build a personal and business profile funders look for, so you
              don&apos;t get denied or underfunded.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                to={individualPath}
                size="lg"
                className="w-full min-w-[180px] rounded-full px-8 sm:w-auto"
                onClick={() => onCtaClick?.("hero_individual")}
              >
                Individual
              </Button>
              <Button
                to={businessPath}
                variant="outline"
                size="lg"
                className="w-full min-w-[180px] rounded-full border-white/22 bg-transparent text-ori-text-primary hover:bg-white/[0.06] sm:w-auto"
                onClick={() => onCtaClick?.("hero_business")}
              >
                Business
              </Button>
            </div>
            <p className="mt-6 text-sm text-ori-text-secondary/90">
              Not sure where you stand?{" "}
              <Link
                to={surveyPath}
                onClick={() => onCtaClick?.("hero_survey")}
                className="font-medium text-ori-accent underline-offset-4 hover:text-ori-accent hover:underline"
              >
                Take the Funding Readiness Survey
              </Link>
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-md lg:mx-0 lg:max-w-none">
              <div
                className="pointer-events-none absolute -inset-px rounded-[1.35rem] bg-gradient-to-br from-white/20 via-transparent to-ori-accent/25 opacity-80 blur-sm motion-reduce:opacity-40"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-ori-black/40 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-[2px]">
                <div className="aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
                  <img
                    src={referralHeroInset.src}
                    alt={referralHeroInset.alt}
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ori-black/80 via-ori-black/20 to-transparent" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
