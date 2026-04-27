import type { CSSProperties } from "react";
import { useState } from "react";
import {
  FileSearch,
  Gauge,
  Route,
  Headphones,
  Eye,
  ListChecks,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Button } from "../components/Button";
import { PricingTierCard } from "../components/PricingTierCard";
import { SegmentedToggle } from "../components/SegmentedToggle";
import { FundingReadinessCrossSellCard } from "../components/FundingReadinessCrossSellCard";
import {
  PageSection,
  SectionHeading,
  PageContainer,
  ScrollRevealSection,
  SECTION_Y,
} from "../components/system";
import {
  INDIVIDUAL_READINESS_HERO_BACKDROP,
  INDIVIDUAL_READINESS_STORY_IMAGES,
} from "../constants/siteImagery";
import { ROUTES } from "../utils/navigation";
import {
  BILLING_TYPES,
  getIndividualStandalonePriceDisplay,
  INDIVIDUAL_READINESS_STANDALONE_FEATURES,
  INDIVIDUAL_READINESS_STANDALONE_DESCRIPTOR,
  INDIVIDUAL_READINESS_STANDALONE_PLUS_FEATURES,
  INDIVIDUAL_READINESS_STANDALONE_PLUS_DESCRIPTOR,
  type BillingType,
  type TierId,
} from "../data/fundingReadinessPricing";

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

const PROGRAM_COMPONENTS: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Profile Intelligence",
    description:
      "Get a clear view of your current financial and business profile, so strengths, gaps, and risks are visible, not assumed.",
    icon: FileSearch,
  },
  {
    title: "Fundability Signals",
    description:
      "Understand what lenders actually evaluate, beyond a score, like utilization, inquiries, history, and positioning.",
    icon: Gauge,
  },
  {
    title: "Execution Roadmap",
    description:
      "Follow a structured roadmap that shows what to fix first, what can wait, and how to move toward approval efficiently.",
    icon: Route,
  },
  {
    title: "Guided Support",
    description:
      "Stay aligned as you improve your profile, with continued guidance as you prepare for your next funding move.",
    icon: Headphones,
  },
];

const MECHANISM_STEPS: { step: string; title: string; body: string; icon: LucideIcon }[] = [
  {
    step: "1",
    title: "See the evaluation lens",
    body: "Understand how funders evaluate your profile today: what they weight, what they ignore, and what is costing you options.",
    icon: Eye,
  },
  {
    step: "2",
    title: "Work the plan",
    body: "Improve the factors that impact approval, risk, and terms with a sequenced plan instead of random tips or one-off fixes.",
    icon: ListChecks,
  },
  {
    step: "3",
    title: "Apply with strategy",
    body: "When your profile is aligned, move forward with a clearer funding strategy instead of guessing your way into an application.",
    icon: TrendingUp,
  },
];

const PROGRAM_STEPS = [
  "Get access to your profile review and onboarding.",
  "Receive a breakdown of your current position and what is affecting approval.",
  "Follow a structured plan to improve the factors that matter most.",
  "Move toward applying with a clearer funding strategy and next step.",
];

const FIT_SIGNALS = [
  "You have been denied before or are not sure why.",
  "You want to apply for funding but do not know if you are ready.",
  "You want better terms, not just approval.",
];

const REALITY_SIGNALS = [
  "Most applicants are not as funding-ready as they think when they first apply.",
  "Lenders evaluate utilization, payment history, inquiries, and consistency, not just a headline score.",
  "Improving the right signals before you apply can change both approval odds and terms.",
];

const INDIVIDUAL_PLANS: {
  id: TierId;
  title: string;
  features: string[];
  footer: string;
  badge?: string;
  cta: string;
  variant: "primary" | "outline";
}[] = [
  {
    id: "core",
    title: "Individual Core",
    features: INDIVIDUAL_READINESS_STANDALONE_FEATURES,
    footer: INDIVIDUAL_READINESS_STANDALONE_DESCRIPTOR,
    cta: "Select Individual Core",
    variant: "primary",
  },
  {
    id: "strategy",
    title: "Individual Plus",
    badge: "Most support",
    features: INDIVIDUAL_READINESS_STANDALONE_PLUS_FEATURES,
    footer: INDIVIDUAL_READINESS_STANDALONE_PLUS_DESCRIPTOR,
    cta: "Select Individual Plus",
    variant: "outline",
  },
];

export function IndividualReadinessPage() {
  const [billingType, setBillingType] = useState<BillingType>("monthly");
  const [story0, story1, story2] = INDIVIDUAL_READINESS_STORY_IMAGES;

  return (
    <>
      <section
        className={`relative isolate flex min-h-[min(100dvh,920px)] flex-col justify-center overflow-hidden border-b ${hairline} bg-ori-surface-base text-ori-text-primary`}
        aria-labelledby="individual-readiness-hero-heading"
      >
        <img
          src={INDIVIDUAL_READINESS_HERO_BACKDROP.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-ori-black/78 md:bg-ori-black/70" aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-[0.32]" style={gridPlaneStyle} aria-hidden />
        <div className="pointer-events-none absolute inset-0" style={meshHeroStyle} aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ori-black/55 via-ori-black/60 to-ori-surface-base"
          aria-hidden
        />

        <div className="pointer-events-none absolute left-4 top-4 h-9 w-9 border-l border-t border-white/[0.12] sm:left-6 sm:top-6 lg:left-8 lg:top-8" aria-hidden />
        <div className="pointer-events-none absolute right-4 top-4 h-9 w-9 border-r border-t border-white/[0.12] sm:right-6 sm:top-6 lg:right-8 lg:top-8" aria-hidden />
        <div className="pointer-events-none absolute bottom-4 left-4 h-9 w-9 border-b border-l border-white/[0.12] sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8" aria-hidden />
        <div className="pointer-events-none absolute bottom-4 right-4 h-9 w-9 border-b border-r border-white/[0.12] sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8" aria-hidden />

        <PageContainer maxWidth="max-w-6xl" className="relative z-10 py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <p className="ori-type-eyebrow">Individual funding readiness</p>
              <h1
                id="individual-readiness-hero-heading"
                className="mt-4 font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-ori-text-primary sm:text-4xl md:text-5xl md:leading-[1.05] lg:text-[2.75rem] lg:tracking-[-0.04em]"
              >
                Prepare your personal profile{" "}
                <span className="text-ori-accent">before</span> you apply for funding
              </h1>
              <p className="mt-6 max-w-xl text-pretty ori-lead text-ori-text-secondary md:text-lg md:leading-relaxed">
                Most businesses apply too early and get denied, underfunded, or worse terms. This step exists so your next
                application reflects a stronger, clearer profile, not hope.
              </p>
              <div className="mt-10">
                <Button href="#individual-pricing" size="lg" className="w-full min-w-[200px] rounded-full px-8 sm:w-auto">
                  See plans &amp; enroll
                </Button>
              </div>
            </div>

            <div className="relative lg:col-span-6">
              <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-ori-accent/12 via-transparent to-ori-pillar-capital-hint/10 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[1.35rem] border border-white/[0.1] bg-ori-charcoal/90 shadow-[0_28px_90px_-36px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.06]">
                <div className="aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={story0.src}
                    alt={story0.alt}
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ori-black/50 via-transparent to-transparent" aria-hidden />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageSection variant="normal" className="bg-ori-black section-divider">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHeading
              align="left"
              eyebrow="What this is"
              title="What the Funding Readiness Program includes"
              subtitle={
                <>
                  <p>
                    A structured system designed to make you fundable, with visibility into your profile, clarity on what matters,
                    and a plan to move forward with confidence.
                  </p>
                  <p className="mt-4">
                    This isn&apos;t guesswork. It&apos;s guided execution.
                  </p>
                </>
              }
            />
            <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-2">
              <article className="overflow-hidden rounded-[1.15rem] ring-1 ring-ori-border/45">
                <img src={story1.src} alt={story1.alt} className="h-32 w-full object-cover sm:h-36" loading="lazy" decoding="async" />
              </article>
              <article className="overflow-hidden rounded-[1.15rem] ring-1 ring-ori-border/45">
                <img src={story2.src} alt={story2.alt} className="h-32 w-full object-cover sm:h-36" loading="lazy" decoding="async" />
              </article>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {PROGRAM_COMPONENTS.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="flex flex-col rounded-[1.15rem] border border-ori-border/60 bg-ori-surface-panel/85 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ring-1 ring-ori-border/35 backdrop-blur-[1px] md:p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ori-surface/90 text-ori-accent ring-1 ring-ori-border/45">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                    </span>
                    <h3 className="font-display text-base font-semibold tracking-tight text-ori-foreground md:text-lg">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ori-muted">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-section-alt section-divider">
        <div className="max-w-3xl">
          <p className="ori-type-eyebrow">How this works</p>
          <h2
            id="individual-readiness-mechanism"
            className="mt-3 font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl"
          >
            A condensed path from signal to strategy
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ori-muted md:text-base">
            Not the full lifecycle story, just the anchor: you learn how you are evaluated, you improve what matters, then you
            position for the apply moment with clarity.
          </p>
        </div>
        <div className="mt-10">
          <ol className="grid list-none gap-4 p-0 sm:grid-cols-3" aria-labelledby="individual-readiness-mechanism">
            {MECHANISM_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.step}
                  className="flex flex-col rounded-xl border border-ori-border bg-ori-surface-panel/90 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] md:p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-ori-accent">{item.step}</span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ori-black/30 text-ori-accent ring-1 ring-ori-border/40">
                      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-sm font-semibold text-ori-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ori-muted">{item.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </PageSection>

      <section className={`border-b ${hairline} bg-ori-surface-base ori-pillar-band-capital section-divider`}>
        <div className={`${SECTION_Y} mx-auto w-full max-w-[1240px] px-6 lg:px-8`}>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-stretch">
            <div className="flex flex-col justify-center rounded-[1.35rem] border border-ori-border/50 bg-ori-surface-panel/80 p-6 shadow-[0_0_40px_-20px_rgba(201,243,29,0.12)] ring-1 ring-ori-border/40 md:p-8">
              <p className="ori-type-eyebrow">Why this matters</p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl">
                Applying too early can cost more than a denial
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ori-muted md:text-base">
                Most businesses apply for funding before they are ready, leading to denials, lower limits, or worse terms. This
                program helps you avoid that by preparing your profile before you apply.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ori-muted md:text-base">
                This is the step that makes funding work better: fewer surprises, stronger positioning, and a clearer story when
                a lender pulls your file.
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.35rem] ring-1 ring-ori-border/45">
              <img
                src={story1.src}
                alt={story1.alt}
                className="h-full min-h-[220px] w-full object-cover sm:min-h-[280px] lg:min-h-full"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-3xl rounded-[1.15rem] border border-ori-border/60 bg-ori-black/25 p-6 ring-1 ring-ori-border/35 backdrop-blur-[1px] md:p-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-ori-accent">Reality check</p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ori-muted">
              {REALITY_SIGNALS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 font-semibold text-ori-accent">/</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PageSection id="individual-pricing" variant="normal" className="bg-ori-black section-divider">
        <SectionHeading
          title="Choose your level of support"
          subtitle="Choose your level of support and begin preparing your profile for funding. Pick a billing cadence, then continue to secure checkout when you are ready."
        />
        <div className="mt-2 rounded-[1.5rem] border border-ori-border/55 bg-ori-surface-panel/35 p-6 ring-1 ring-white/[0.04] backdrop-blur-[2px] md:p-10">
          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <div className="flex flex-col items-center gap-2">
              <p className="ori-type-label text-ori-muted">Billing</p>
              <SegmentedToggle
                options={BILLING_TYPES}
                value={billingType}
                onChange={(v) => setBillingType(v as BillingType)}
                ariaLabel="Weekly, monthly, or pay in full"
              />
            </div>
            {BILLING_TYPES.find((b) => b.value === billingType)?.microcopy && (
              <p className="text-center text-sm text-ori-muted">
                {BILLING_TYPES.find((b) => b.value === billingType)?.microcopy}
              </p>
            )}
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-stretch">
            {INDIVIDUAL_PLANS.map((plan) => {
              const { primary, durationNote } = getIndividualStandalonePriceDisplay(billingType, plan.id);
              const enrollHref = `${ROUTES.FUNDING_READINESS_ENROLL}?product=individual&plan=${plan.id}&billing=${billingType}`;
              return (
                <PricingTierCard
                  key={plan.id}
                  title={plan.title}
                  pricePrimary={primary}
                  durationNote={durationNote}
                  includes={plan.features}
                  footerLine={plan.footer}
                  badge={plan.badge}
                  highlighted={plan.variant === "primary"}
                  cta={
                    <Button
                      to={enrollHref}
                      size="lg"
                      className="min-w-[180px] rounded-full px-8"
                      variant={plan.variant === "primary" ? "primary" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  }
                />
              );
            })}
          </div>
        </div>
      </PageSection>

      <ScrollRevealSection className={`${SECTION_Y} border-b border-ori-border bg-ori-section-alt section-divider`}>
        <PageContainer>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[1.25rem] border border-ori-border/60 bg-ori-surface-panel/90 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ring-1 ring-ori-border/40 md:p-8">
              <SectionHeading
                align="left"
                eyebrow="After you start"
                title="What happens after you start"
                subtitle="No mystery after checkout: onboarding, a clear read of your position, a structured plan, and movement toward apply-ready positioning."
                className="mb-6"
              />
              <ol className="space-y-4">
                {PROGRAM_STEPS.map((step, index) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ori-accent/35 bg-ori-accent/10 text-sm font-semibold text-ori-accent">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-relaxed text-ori-muted">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="relative overflow-hidden rounded-[1.25rem] border border-ori-border/60 bg-ori-surface-panel/90 p-6 ring-1 ring-ori-border/40 md:p-8">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ori-accent/10 blur-3xl"
                aria-hidden
              />
              <SectionHeading
                align="left"
                eyebrow="Who this is for"
                title="This is for you if"
                subtitle="Founders and operators who want the apply moment to reflect preparation, not discovery."
                className="mb-6"
              />
              <ul className="space-y-4 text-sm leading-relaxed text-ori-muted">
                {FIT_SIGNALS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ori-accent/15 text-[10px] font-bold text-ori-accent">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageContainer>
      </ScrollRevealSection>

      <PageSection variant="normal" className="bg-ori-black section-divider">
        <div className="mx-auto w-full max-w-4xl">
          <FundingReadinessCrossSellCard
            title="Need business funding readiness too?"
            description="Compare Business Core and Business Pro: entity, business credit, and capital positioning."
            ctaLabel="View business plans"
            to={ROUTES.FUNDING_READINESS}
          />
        </div>
      </PageSection>
    </>
  );
}
