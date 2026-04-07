import { useState } from "react";
import { Button } from "../components/Button";
import { PricingTierCard } from "../components/PricingTierCard";
import { SegmentedToggle } from "../components/SegmentedToggle";
import { FundingReadinessCrossSellCard } from "../components/FundingReadinessCrossSellCard";
import { PageSection, SectionHeading, PageContainer } from "../components/system";
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

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80&auto=format&fit=crop";

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

  return (
    <>
      <section className="relative overflow-hidden border-b border-ori-border bg-ori-section-alt">
        <div className="gradient-orb pointer-events-none absolute inset-0" aria-hidden />
        <PageSection variant="loose" container={false} className="relative">
          <div className="mx-auto w-full max-w-[1240px] px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-12">
              <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-none lg:text-left">
                <p className="text-xs font-semibold uppercase tracking-widest text-ori-accent">Funding Readiness</p>
                <h1 className="mt-2 font-display text-2xl font-bold leading-snug tracking-tight text-ori-foreground sm:text-3xl md:text-4xl">
                  Personal credit, aligned for what lenders see next
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-ori-muted md:text-base">
                  Lenders still read your personal profile—utilization, history, and how you show up. Individual Core and
                  Individual Plus give you a clear roadmap and support to strengthen that side of your funding story.
                </p>
              </div>
              <div className="relative mx-auto w-full max-w-xl lg:mx-0">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-ori-border/50 bg-ori-charcoal shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.06]">
                  <img
                    src={HERO_IMAGE}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </PageSection>
      </section>

      <PageSection id="individual-pricing" variant="normal" className="bg-ori-section-alt section-divider">
        <div className="min-w-0">
          <SectionHeading
            title="Get funding-ready"
            subtitle="Pick a tier and billing cadence, then continue to secure checkout when you are ready."
          />
          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-ori-muted">Billing</p>
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
                      className="min-w-[180px]"
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

      <PageSection variant="normal" className="bg-ori-black section-divider">
        <PageContainer>
          <div className="mx-auto w-full max-w-4xl">
            <FundingReadinessCrossSellCard
              title="Need business funding readiness too?"
              description="Compare Business Core and Business Pro—entity, business credit, and capital positioning."
              ctaLabel="View business plans"
              to={ROUTES.FUNDING_READINESS}
            />
          </div>
        </PageContainer>
      </PageSection>
    </>
  );
}
