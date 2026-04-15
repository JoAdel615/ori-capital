import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Building2,
  CreditCard,
  FileCheck,
  Landmark,
  Layers,
  Percent,
  Play,
  Rocket,
  ShieldCheck,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { Button } from "../components/Button";
import { PricingTierCard } from "../components/PricingTierCard";
import { SegmentedToggle } from "../components/SegmentedToggle";
import {
  PageSection,
  SectionHeading,
  PageContainer,
  ScrollRevealSection,
  SECTION_Y,
} from "../components/system";
import { Accordion } from "../components/Accordion";
import { FaqJsonLd } from "../components/FaqJsonLd";
import { FundingReadinessCrossSellCard } from "../components/FundingReadinessCrossSellCard";
import {
  BUSINESS_FUNDING_READINESS_HERO_BACKDROP,
  BUSINESS_FUNDING_READINESS_STORY_IMAGES,
} from "../constants/siteImagery";
import { ROUTES } from "../utils/navigation";
import { PLANS, BILLING_TYPES, getPlanPriceDisplay, type BillingType } from "../data/fundingReadinessPricing";

/** Served from `public/videos/` (see repo `professional-10-minute-vsl.mp4`). */
const FUNDABILITY_VSL_SRC = "/videos/professional-10-minute-vsl.mp4";
/** Poster for demo preview + video element (`public/images/funding/fundability-demo-poster.png`). */
const FUNDABILITY_DEMO_POSTER = "/images/funding/fundability-demo-poster.png";

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
            How fundability is measured and improved
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
    title: "Been denied, or don't know why",
    description:
      "You need a clear read on what lenders saw and what to change before you try again, with a plan instead of guesswork.",
  },
  {
    title: "Want better terms, not just approval",
    description:
      "You may qualify today, but weak positioning shows up as limits, pricing, and structure. Readiness work improves leverage before you apply.",
  },
  {
    title: "Need a clear plan for approval",
    description:
      "You want sequencing and priorities instead of a pile of tasks. Ori helps you interpret signals and execute in the right order.",
  },
];

const readinessFaqSchemaItems = [
  {
    question: "How long does it usually take?",
    answer:
      "Most participants see meaningful progress within 3 to 6 months, depending on baseline profile and execution consistency.",
  },
  {
    question: "Will you guarantee approval?",
    answer:
      "No lender approvals can be guaranteed. The program provides a clear plan, support, and periodic re-evaluation.",
  },
  {
    question: "What if I already have debt?",
    answer:
      "Existing debt does not automatically disqualify you. We evaluate utilization, payment history, and structure to improve positioning.",
  },
  {
    question: "Do you help with business credit?",
    answer:
      "Yes. The accelerator includes business credit optimization and a roadmap to strengthen business credit over time.",
  },
  {
    question: "What happens after 60 days?",
    answer:
      "Pre-qualification is re-run to measure progress and define the best next step: apply or continue strengthening.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. The program is month-to-month without long-term lock-in.",
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
        We can&apos;t guarantee any lender will approve you—that&apos;s always their decision. We
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
        Having existing debt doesn&apos;t disqualify you. We&apos;ll look at your full picture and
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
        or strengthen business credit, so you&apos;re in a better position when you apply for
        funding.
      </>
    ),
  },
  {
    id: "after-60-days",
    title: "What happens after 60 days?",
    content: (
      <>
        We re-run pre-qualification so you see if your profile has improved. You&apos;ll get
        updated eligibility insights and a clear next step—whether that&apos;s applying for
        funding or continuing to strengthen.
      </>
    ),
  },
  {
    id: "cancel-anytime",
    title: "Can I cancel anytime?",
    content: (
      <>
        Yes. You can cancel anytime. We&apos;re month-to-month—no long-term lock-in. We&apos;d rather
        you stay because it&apos;s useful, not because you&apos;re stuck.
      </>
    ),
  },
];

const threeBlockers = [
  { icon: BarChart3, label: "Credit profile needs strengthening" },
  { icon: Percent, label: "Debt-to-income ratio is too tight" },
  { icon: Building2, label: "Business structure needs adjustment" },
];

const WHAT_THIS_INCLUDES = [
  "Fundability analysis with clear priorities and sequencing, so you know what to improve first and how it affects approval",
  "Business credit and profile optimization aligned to capital-provider expectations",
  "Strategic guidance on timing, positioning, and applications, tied to outcomes instead of disconnected tasks",
];

const FUNDABILITY_PROGRESSION: { step: string; title: string; lead: string; body: string; icon: LucideIcon }[] = [
  {
    step: "1",
    title: "Foundation",
    lead: "Make your business verifiable",
    body: "Ensure your entity, documentation, and core records align with funder expectations.",
    icon: FileCheck,
  },
  {
    step: "2",
    title: "Credibility",
    lead: "Build trust signals capital providers recognize",
    body: "Establish consistency across your business identity, records, and reporting.",
    icon: ShieldCheck,
  },
  {
    step: "3",
    title: "Fundability",
    lead: "Align your profile with real funding criteria",
    body: "Position your business to meet approval thresholds instead of applying blindly.",
    icon: Target,
  },
  {
    step: "4",
    title: "Reporting setup",
    lead: "Make your business visible to funders",
    body: "Ensure your activity and accounts are properly reflected in reporting systems.",
    icon: Activity,
  },
  {
    step: "5",
    title: "Credit depth",
    lead: "Build a track record underwriters can evaluate",
    body: "Add accounts and history that demonstrate reliability over time.",
    icon: Layers,
  },
  {
    step: "6",
    title: "Funding readiness",
    lead: "Move into applications with leverage",
    body: "Apply with a stronger profile, better positioning, and clearer expectations.",
    icon: Rocket,
  },
];

const AFTER_START_STEPS = [
  "Complete your onboarding and business profile.",
  "Get a breakdown of your current fundability.",
  "Follow a structured plan to improve your position.",
  "Move toward applying with a clear strategy.",
];

const FUNDABILITY_WALKTHROUGH_POINTS = [
  "How readiness shows up as funder-visible signals over time",
  "Where gaps appear before underwriting, and what to fix first",
  "How sequencing improves outcomes compared to ad-hoc fixes",
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
    title: "Cash flow",
    description: "Revenue history and ability to service debt. Weak signals here cap limits and tighten terms.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Financial planning and cash flow review",
  },
  {
    icon: CreditCard,
    title: "Credit",
    description: "Personal and business credit signals lenders review. Misalignment shows up as denials or worse pricing.",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Credit and payment history concept",
  },
  {
    icon: Landmark,
    title: "Collateral",
    description: "Assets or guarantees that back the funding. When expectations do not match reality, approvals stall.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Commercial property and business assets",
  },
];

export function CapitalReadinessPage() {
  const [billingType, setBillingType] = useState<BillingType>("monthly");
  const [vslOpen, setVslOpen] = useState(false);
  const closeVsl = useCallback(() => setVslOpen(false), []);
  const [storyA, storyB] = BUSINESS_FUNDING_READINESS_STORY_IMAGES;

  return (
    <>
      <section
        className={`relative isolate flex min-h-[min(100dvh,920px)] flex-col justify-center overflow-hidden border-b ${hairline} bg-ori-surface-base text-ori-text-primary`}
        aria-labelledby="business-readiness-hero-heading"
      >
        <img
          src={BUSINESS_FUNDING_READINESS_HERO_BACKDROP.src}
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
              <p className="ori-type-eyebrow">Business funding readiness</p>
              <h1
                id="business-readiness-hero-heading"
                className="mt-4 font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-ori-text-primary sm:text-4xl md:text-5xl md:leading-[1.05] lg:text-[2.75rem] lg:tracking-[-0.04em]"
              >
                Funding isn&apos;t the problem. <span className="text-ori-accent">Alignment</span> is.
              </h1>
              <p className="mt-6 max-w-xl text-pretty ori-lead text-ori-text-secondary md:text-lg md:leading-relaxed">
                Most businesses don&apos;t get denied because they&apos;re unqualified. They get denied because something doesn&apos;t line
                up.
              </p>
              <div className="mt-10 md:mt-12">
                <p className="text-sm font-medium uppercase tracking-wider text-ori-muted">In most cases, it comes down to this:</p>
                <ul className="mt-5 flex w-full max-w-xl flex-col gap-3">
                  {threeBlockers.map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-ori-text-primary backdrop-blur-sm"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-ori-accent" strokeWidth={1.75} aria-hidden />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10">
                <Button href="#business-pricing" size="lg" className="w-full min-w-[200px] rounded-full px-8 sm:w-auto">
                  See plans &amp; enroll
                </Button>
              </div>
            </div>

            <div className="relative lg:col-span-6">
              <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-ori-accent/12 via-transparent to-ori-pillar-capital-hint/10 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-[1.35rem] border border-white/[0.1] bg-ori-charcoal/90 shadow-[0_28px_90px_-36px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.06]">
                <div className="aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={storyA.src}
                    alt={storyA.alt}
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ori-black/55 via-transparent to-transparent" aria-hidden />
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
              title="What the Business Funding Readiness Program is"
              subtitle={
                <>
                  <p>
                    This is a structured system to align your business with how lenders actually evaluate funding
                    applications across credit, credibility, and financial positioning.
                  </p>
                  <p className="mt-4">
                    You&apos;re not guessing your way to approval. You&apos;re building toward it.
                  </p>
                </>
              }
            />
            <div className="mt-8 hidden gap-3 sm:grid sm:grid-cols-2">
              <article className="overflow-hidden rounded-[1.15rem] ring-1 ring-ori-border/45">
                <img src={storyB.src} alt={storyB.alt} className="h-32 w-full object-cover sm:h-36" loading="lazy" decoding="async" />
              </article>
              <article className="overflow-hidden rounded-[1.15rem] ring-1 ring-ori-border/45">
                <img
                  src={BUSINESS_FUNDING_READINESS_HERO_BACKDROP.src}
                  alt={BUSINESS_FUNDING_READINESS_HERO_BACKDROP.alt}
                  className="h-32 w-full object-cover sm:h-36"
                  loading="lazy"
                  decoding="async"
                />
              </article>
            </div>
          </div>
          <div className="flex flex-col justify-center lg:col-span-7">
            <ul className="space-y-4 rounded-[1.25rem] border border-ori-border/60 bg-ori-surface-panel/85 p-6 ring-1 ring-ori-border/35 md:p-8">
              {WHAT_THIS_INCLUDES.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm leading-relaxed text-ori-muted md:text-base">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ori-accent/15 text-[10px] font-bold text-ori-accent">
                    ✓
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageSection>

      <section className={`relative isolate overflow-hidden border-b ${hairline} section-divider`}>
        <img
          src={BUSINESS_FUNDING_READINESS_STORY_IMAGES[1]!.src}
          alt=""
          className="absolute inset-0 h-full min-h-[320px] w-full object-cover md:min-h-[380px]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-ori-black/80" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ori-black/92 via-ori-black/78 to-ori-black/55"
          aria-hidden
        />
        <div className={`${SECTION_Y} relative z-10 mx-auto w-full max-w-[1240px] px-6 lg:px-8`}>
          <SectionHeading
            align="center"
            title="Why this works"
            subtitle="Most businesses apply for funding without understanding how they&apos;re evaluated. This program flips that by aligning your business with real lending criteria before you apply."
            subtitleClassName="text-ori-text-secondary/95"
          />
        </div>
      </section>

      <PageSection variant="normal" className="bg-ori-section-alt section-divider">
        <div className="max-w-3xl">
          <p className="ori-type-eyebrow">Progression</p>
          <h2
            id="business-readiness-progression"
            className="mt-3 font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl"
          >
            How your business becomes fundable
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ori-muted md:text-base">
            Funders don&apos;t evaluate your business in one step. They evaluate signals over time. This framework shows how your
            business moves from unstructured to fundable.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-labelledby="business-readiness-progression">
          {FUNDABILITY_PROGRESSION.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.step}
                className="flex flex-col rounded-[1.15rem] border border-ori-border/60 bg-ori-surface-panel/90 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ring-1 ring-ori-border/35 md:p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ori-border/60 bg-ori-accent/10 text-ori-accent">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="text-xs font-bold text-ori-accent">Step {item.step}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-ori-foreground">{item.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ori-muted">{item.lead}</p>
                <p className="mt-3 text-sm leading-relaxed text-ori-muted">{item.body}</p>
              </article>
            );
          })}
        </div>
      </PageSection>

      <PageSection variant="normal" className="relative overflow-hidden bg-ori-black section-divider">
        <div className="pointer-events-none absolute inset-0 opacity-[0.22]" style={gridPlaneStyle} aria-hidden />
        <div className="relative">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
            <div className="lg:col-span-5">
              <p className="ori-type-eyebrow">Walkthrough</p>
              <h2
                id="fundability-walkthrough-heading"
                className="mt-3 font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl"
              >
                See how fundability is measured and improved
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ori-muted md:text-base">
                Get a closer look at how capital providers evaluate your business and how your profile evolves over time.
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-relaxed text-ori-muted md:text-base" aria-labelledby="fundability-walkthrough-heading">
                {FUNDABILITY_WALKTHROUGH_POINTS.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ori-accent" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <div className="relative">
                <div
                  className="pointer-events-none absolute -inset-4 rounded-[1.6rem] bg-gradient-to-br from-ori-accent/18 via-transparent to-ori-pillar-capital-hint/10 blur-2xl"
                  aria-hidden
                />
                <div className="relative overflow-hidden rounded-2xl border border-ori-border/55 bg-ori-charcoal ring-1 ring-white/[0.07] shadow-[0_32px_90px_-44px_rgba(0,0,0,0.95)]">
                  <button
                    type="button"
                    onClick={() => setVslOpen(true)}
                    className="group relative aspect-video w-full overflow-hidden text-left transition hover:border-ori-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-black"
                    aria-label="Play video: how fundability is measured and improved"
                  >
                    <img
                      src={FUNDABILITY_DEMO_POSTER}
                      alt=""
                      className="h-full w-full object-cover object-top opacity-[0.82] transition duration-500 motion-safe:group-hover:scale-[1.03] motion-safe:group-hover:opacity-[0.9]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ori-black/95 via-ori-black/55 to-ori-black/40" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(201,243,29,0.08),transparent_55%)]" aria-hidden />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-ori-black/80 text-ori-accent shadow-2xl backdrop-blur-md transition motion-safe:group-hover:scale-105 motion-safe:group-hover:border-ori-accent/50 md:h-[4.5rem] md:w-[4.5rem]">
                        <Play className="ml-1 h-9 w-9 text-ori-accent md:h-10 md:w-10" strokeWidth={1.75} aria-hidden />
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      <FundabilityVslModal open={vslOpen} onClose={closeVsl} />

      <PageSection id="business-pricing" variant="normal" className="bg-ori-section-alt section-divider">
        <div className="min-w-0">
          <SectionHeading
            title="Choose your level of support"
            subtitle="Choose your level of support and start aligning your business for funding. Pick a billing cadence, then continue to secure checkout when you are ready."
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
                        to={`${ROUTES.FUNDING_READINESS_ENROLL}?plan=${plan.id}&billing=${billingType}`}
                        size="lg"
                        className="min-w-[180px] rounded-full px-8"
                        variant={index === 1 ? "outline" : "primary"}
                      >
                        {plan.id === "core" ? "Select Business Core" : "Select Business Pro"}
                      </Button>
                    }
                  />
                );
              })}
            </div>
          </div>

          <div className="mx-auto mt-10 w-full max-w-4xl">
            <FundingReadinessCrossSellCard
              title="Need individual funding readiness too?"
              description="Personal credit and profile support with Individual Core or Individual Plus, without the business tier."
              ctaLabel="View individual plans"
              to={ROUTES.FUNDING_READINESS_INDIVIDUAL}
            />
          </div>
        </div>
      </PageSection>

      <ScrollRevealSection className={`${SECTION_Y} border-b border-ori-border bg-ori-black section-divider`}>
        <PageContainer>
          <div className="mx-auto max-w-3xl rounded-[1.25rem] border border-ori-border/60 bg-ori-surface-panel/90 p-6 ring-1 ring-ori-border/40 md:p-10">
            <SectionHeading
              align="center"
              eyebrow="After you start"
              title="What happens after you start"
              subtitle="A clear sequence from onboarding to strategy, so you know what you receive and how progress is measured."
            />
            <ol className="mx-auto mt-8 max-w-xl space-y-4">
              {AFTER_START_STEPS.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ori-accent/35 bg-ori-accent/10 text-sm font-semibold text-ori-accent">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-ori-muted md:text-base">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </PageContainer>
      </ScrollRevealSection>

      <PageSection variant="normal" className="relative bg-ori-section-alt section-divider">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] bg-[radial-gradient(circle_at_30%_20%,rgba(201,243,29,0.06),transparent_50%),radial-gradient(circle_at_80%_60%,rgba(201,243,29,0.04),transparent_45%)]"
          aria-hidden
        />
        <div className="relative">
          <SectionHeading
            title="What lenders and investors evaluate"
            subtitle="Every funding decision comes down to a few core signals. If these don&apos;t align, you get denied, or approved with worse terms."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lenderFactors.map(({ icon: Icon, title, description, image, imageAlt }) => (
              <article
                key={title}
                className="flex flex-col overflow-hidden rounded-xl border border-ori-border bg-ori-surface-panel/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ring-1 ring-ori-border/40"
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

      <PageSection variant="normal" className="bg-ori-black section-divider">
        <SectionHeading title="Who this is for" />
        <div className="grid gap-6 md:grid-cols-3">
          {whoThisIsFor.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.15rem] border border-ori-border/60 bg-ori-surface-panel/85 p-6 ring-1 ring-ori-border/35"
            >
              <h3 className="font-display text-lg font-semibold text-ori-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ori-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-section-alt section-divider">
        <SectionHeading title="FAQs" />
        <Accordion items={readinessFaqItems} defaultOpenId="how-long" />
      </PageSection>

      <PageSection variant="normal" className="bg-ori-black">
        <div className="rounded-3xl border border-ori-border/60 bg-ori-surface-panel/80 p-8 text-center ring-1 ring-ori-border/35 md:p-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ori-foreground md:text-3xl">
            Strengthen your funding profile before the next application
          </h2>
          <div className="mt-7">
            <Button to={`${ROUTES.FUNDING_READINESS_ENROLL}?billing=${billingType}`} size="lg" className="min-w-[200px] rounded-full px-8">
              Start readiness
            </Button>
          </div>
        </div>
      </PageSection>

      <FaqJsonLd faqs={readinessFaqSchemaItems} />
    </>
  );
}
