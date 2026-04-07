import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TrendingUp, CreditCard, Landmark, BarChart3, Percent, Building2, Play, X } from "lucide-react";
import { Button } from "../components/Button";
import { PricingTierCard } from "../components/PricingTierCard";
import { SegmentedToggle } from "../components/SegmentedToggle";
import { PageSection, SectionHeading } from "../components/system";
import { Accordion } from "../components/Accordion";
import { FundingReadinessCrossSellCard } from "../components/FundingReadinessCrossSellCard";
import { ROUTES } from "../utils/navigation";
import { PLANS, BILLING_TYPES, getPlanPriceDisplay, type BillingType } from "../data/fundingReadinessPricing";

/** Served from `public/videos/` (see repo `professional-10-minute-vsl.mp4`). */
const FUNDABILITY_VSL_SRC = "/videos/professional-10-minute-vsl.mp4";
/** Poster for demo preview + video element (`public/images/funding/fundability-demo-poster.png`). */
const FUNDABILITY_DEMO_POSTER = "/images/funding/fundability-demo-poster.png";

function FundabilityVslModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fundability-vsl-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-label="Close video"
        onClick={onClose}
      />
      <div className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-ori-border bg-ori-charcoal shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-ori-border px-4 py-3">
          <h2 id="fundability-vsl-title" className="font-display text-base font-semibold text-ori-foreground md:text-lg">
            The Fundability Framework
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-ori-muted hover:bg-ori-surface hover:text-ori-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ori-accent"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="aspect-video w-full bg-black">
          <video
            className="h-full w-full object-contain"
            controls
            playsInline
            preload="metadata"
            poster={FUNDABILITY_DEMO_POSTER}
            src={FUNDABILITY_VSL_SRC}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

const whoThisIsFor = [
  {
    title: "Denied or unsure where you stand",
    description:
      "You've been told no or don't know if you'd qualify. We help you understand your financial profile and what to improve.",
  },
  {
    title: "Want stronger terms",
    description:
      "You could qualify today but want better rates or structure. Funding Readiness Accelerator helps you optimize before you apply.",
  },
  {
    title: "Need a clear plan for approval",
    description:
      "You don't want to guess. We give you a roadmap and check-ins so you know exactly what to do next.",
  },
];

const readinessFaqItems = [
  {
    id: "how-long",
    title: "How long does it usually take?",
    content: (
      <>
        Most participants see meaningful progress within 3–6 months. It depends on your
        starting point and how consistently you follow the roadmap. We re-evaluate
        pre-qualification every 60 days.
      </>
    ),
  },
  {
    id: "guarantee-approval",
    title: "Will you guarantee approval?",
    content: (
      <>
        We can't guarantee any lender will approve you—that's always their decision. We
        do guarantee a clear plan, ongoing support, and re-evaluation so you know where
        you stand and what to do next.
      </>
    ),
  },
  {
    id: "already-have-debt",
    title: "What if I already have debt?",
    content: (
      <>
        Having existing debt doesn't disqualify you. We'll look at your full picture and
        help you optimize utilization, payment history, and structure. Pro tier
        includes debt restructuring review.
      </>
    ),
  },
  {
    id: "business-credit",
    title: "Do you help with business credit?",
    content: (
      <>
        Yes. The accelerator includes business credit optimization and a roadmap to build
        or strengthen business credit, so you're in a better position when you apply for
        funding.
      </>
    ),
  },
  {
    id: "after-60-days",
    title: "What happens after 60 days?",
    content: (
      <>
        We re-run pre-qualification so you see if your profile has improved. You'll get
        updated eligibility insights and a clear next step—whether that's applying for
        funding or continuing to strengthen.
      </>
    ),
  },
  {
    id: "cancel-anytime",
    title: "Can I cancel anytime?",
    content: (
      <>
        Yes. You can cancel anytime. We're month-to-month—no long-term lock-in. We'd rather
        you stay because it's useful, not because you're stuck.
      </>
    ),
  },
];

const threeBlockers = [
  { icon: BarChart3, label: "Credit profile needs strengthening" },
  { icon: Percent, label: "Debt-to-income ratio is too tight" },
  { icon: Building2, label: "Business structure needs adjustment" },
];

const lenderFactors: {
  icon: typeof TrendingUp;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}[] = [
  {
    icon: TrendingUp,
    title: "Cash Flow",
    description: "Revenue history and ability to service debt.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Financial planning and cash flow review",
  },
  {
    icon: CreditCard,
    title: "Credit",
    description: "Personal and business credit signals lenders review.",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Credit and payment history concept",
  },
  {
    icon: Landmark,
    title: "Collateral",
    description: "Assets or guarantees that back the funding.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Commercial property and business assets",
  },
];

/** Hero: wide contextual image (alignment / strategy). */
const FUNDING_READINESS_HERO_IMAGE =
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80&auto=format&fit=crop";

export function CapitalReadinessPage() {
  const [billingType, setBillingType] = useState<BillingType>("monthly");
  const [vslOpen, setVslOpen] = useState(false);
  const closeVsl = useCallback(() => setVslOpen(false), []);

  return (
    <>
      <section className="relative overflow-hidden border-b border-ori-border bg-ori-section-alt">
        <div className="gradient-orb pointer-events-none absolute inset-0" aria-hidden />
        <div className="gradient-orb-accent pointer-events-none absolute right-0 top-1/4 h-96 w-96" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_35%,rgba(201,243,29,0.08),transparent_65%)]"
          aria-hidden
        />
        <PageSection variant="loose" container={false} className="relative">
          <div className="mx-auto w-full max-w-[1240px] px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12 xl:gap-16">
              <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-none lg:text-left">
                <h1 className="font-display text-2xl font-bold leading-snug tracking-tight text-ori-foreground sm:text-3xl md:text-4xl">
                  For most businesses, funding isn’t out of reach, it’s a matter of alignment.
                </h1>
                <div className="mt-12 md:mt-14">
                  <p className="text-sm font-medium uppercase tracking-wider text-ori-muted">
                    It usually means one of three things:
                  </p>
                  <ul className="mx-auto mt-6 flex w-full max-w-xl flex-col gap-3 lg:mx-0">
                    {threeBlockers.map(({ icon: Icon, label }) => (
                      <li
                        key={label}
                        className="flex items-center gap-2 rounded-full border border-ori-border bg-ori-surface/90 px-4 py-2.5 text-sm font-medium text-ori-foreground shadow-sm"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-ori-accent" strokeWidth={1.75} aria-hidden />
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-ori-border/50 bg-ori-charcoal shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.06]">
                  <img
                    src={FUNDING_READINESS_HERO_IMAGE}
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

      <PageSection variant="normal" className="bg-ori-section-alt section-divider">
        <SectionHeading
          title="The Fundability Framework"
          subtitle="A step-by-step system to strengthen your business profile and improve your access to capital."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            { stage: "1. Foundation", body: "Confirm entity setup, core documents, and operating fundamentals." },
            { stage: "2. Credibility", body: "Strengthen trust signals lenders expect to see before underwriting." },
            { stage: "3. Fundability", body: "Align profile data to realistic funding structures and requirements." },
            { stage: "4. Reporting Setup", body: "Organize financial and credit reporting inputs for cleaner evaluations." },
            { stage: "5. Trade Lines", body: "Build business credit depth and positive payment behavior over time." },
            { stage: "6. Capital Readiness", body: "Move into applications with stronger positioning, clarity, and confidence." },
          ].map((item) => (
            <article key={item.stage} className="rounded-2xl border border-ori-border bg-ori-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ori-accent">Stage</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-ori-foreground">{item.stage}</h3>
              <p className="mt-3 text-sm text-ori-muted">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl text-center">
          <button
            type="button"
            onClick={() => setVslOpen(true)}
            className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-ori-border bg-ori-charcoal text-left shadow-[0_24px_64px_-32px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.06] transition hover:border-ori-accent/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-section-alt"
            aria-label="Play video: The Fundability Framework overview"
          >
            <img
              src={FUNDABILITY_DEMO_POSTER}
              alt="Fundability dashboard preview"
              className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ori-black/80 via-ori-black/25 to-ori-black/30" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-ori-black/75 text-ori-accent shadow-2xl backdrop-blur-sm transition group-hover:scale-105 group-hover:border-ori-accent/50 md:h-[4.5rem] md:w-[4.5rem]">
                <Play className="ml-1 h-9 w-9 text-ori-accent md:h-10 md:w-10" strokeWidth={1.75} aria-hidden />
              </span>
            </span>
            <span className="absolute bottom-3 left-4 right-4 font-display text-sm font-semibold text-ori-foreground drop-shadow md:bottom-4 md:left-5 md:text-base">
              Watch the overview
            </span>
          </button>
        </div>

        <FundabilityVslModal open={vslOpen} onClose={closeVsl} />
      </PageSection>

      <PageSection variant="normal" className="bg-ori-section-alt section-divider">
        <div className="min-w-0">
          <SectionHeading
            title="Get funding-ready"
            subtitle="Funding readiness: Business Core and Business Pro—business credit, profile, and capital positioning."
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
            {PLANS.map((plan, index) => {
              const { primary, durationNote } = getPlanPriceDisplay(plan, billingType);
              const features = plan.features.business;
              const descriptor = plan.descriptor.business;
              return (
                <PricingTierCard
                  key={plan.id}
                  title={plan.displayName}
                  pricePrimary={primary}
                  durationNote={durationNote}
                  includes={features}
                  footerLine={descriptor}
                  badge={plan.badge}
                  cta={
                    <Button
                      to={`${ROUTES.FUNDING_READINESS_ENROLL}?plan=${plan.id}`}
                      size="lg"
                      className="min-w-[180px]"
                      variant={index === 1 ? "outline" : "primary"}
                    >
                      {plan.id === "core" ? "Select Business Core" : "Select Business Pro"}
                    </Button>
                  }
                />
              );
            })}
          </div>

          <div className="mx-auto mt-10 w-full max-w-4xl">
            <FundingReadinessCrossSellCard
              title="Need individual funding readiness too?"
              description="Funding readiness: Individual Core or Individual Plus—personal credit and profile support without the business tier."
              ctaLabel="View individual plans"
              to={ROUTES.FUNDING_READINESS_INDIVIDUAL}
            />
          </div>
        </div>
      </PageSection>

      <PageSection variant="normal" className="relative bg-ori-black section-divider">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] bg-[radial-gradient(circle_at_30%_20%,rgba(201,243,29,0.06),transparent_50%),radial-gradient(circle_at_80%_60%,rgba(201,243,29,0.04),transparent_45%)]"
          aria-hidden
        />
        <div className="relative">
          <SectionHeading
            title="What lenders and investors evaluate"
            subtitle="Before lenders approve funding they evaluate these core areas. Readiness work often improves eligibility faster than guessing on applications."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lenderFactors.map(({ icon: Icon, title, description, image, imageAlt }) => (
              <article
                key={title}
                className="flex flex-col overflow-hidden rounded-xl border border-ori-border bg-ori-surface/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
              >
                <div className="relative h-32 overflow-hidden bg-ori-charcoal sm:h-36">
                  <img
                    src={image}
                    alt={imageAlt}
                    className="h-full w-full object-cover opacity-[0.92]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ori-black/90 via-ori-black/20 to-transparent" />
                  <span className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-lg border border-ori-border/80 bg-ori-black/70 text-ori-accent backdrop-blur-sm">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-semibold text-ori-accent">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ori-muted">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-section-alt section-divider">
        <SectionHeading title="Who this is for" />
        <div className="grid gap-6 md:grid-cols-3">
          {whoThisIsFor.map((item) => (
            <article key={item.title} className="rounded-2xl border border-ori-border bg-ori-surface p-6">
              <h3 className="font-display text-lg font-semibold text-ori-foreground">{item.title}</h3>
              <p className="mt-3 text-sm text-ori-muted leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-black section-divider">
        <SectionHeading title="FAQs" />
        <Accordion items={readinessFaqItems} defaultOpenId="how-long" />
      </PageSection>

      <PageSection variant="normal" className="bg-ori-section-alt">
        <div className="rounded-3xl border border-ori-border bg-ori-surface p-8 text-center md:p-12">
          <h2 className="font-display text-3xl font-semibold text-ori-foreground">Strengthen your funding profile before the next application</h2>
          <div className="mt-7">
            <Button to={ROUTES.FUNDING_READINESS_ENROLL} size="lg" className="min-w-[180px]">
              Start Readiness
            </Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
