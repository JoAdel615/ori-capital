import {
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  FileSearch,
  Handshake,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { FundingMapClosingSection } from "../components/compositions";
import { FundingCounter } from "../components/FundingCounter";
import { FundingSpectrum } from "../components/FundingSpectrum";
import { ReadinessDemoPreview } from "../components/home/ReadinessDemoPreview";
import { PageSection, SectionHeading } from "../components/system";
import {
  ResourceCardGrid,
  TrustSectionIntro,
  type ResourceItem,
} from "../components/trust/TrustElements";
import { CAPITAL_IMAGE_SET, type ImageAsset } from "../constants/siteImagery";
import { config } from "../config";
import { blogPosts, getPostCoverSrc } from "../data/blog";
import { ROUTES } from "../utils/navigation";

const CAPITAL_LEARN_SLUGS = [
  "what-lenders-look-at-before-approving-financing",
  "why-businesses-get-denied",
  "business-credit-explained",
] as const;

/** Capital page card copy (links still target the same insight posts). */
const CAPITAL_LEARN_CARD_OVERRIDES: Record<(typeof CAPITAL_LEARN_SLUGS)[number], { title: string; preview: string }> = {
  "what-lenders-look-at-before-approving-financing": {
    title: "What lenders see that you don't",
    preview: "The signals driving approvals—and where most businesses fall short.",
  },
  "why-businesses-get-denied": {
    title: "The real reason businesses get denied",
    preview: "It's not just credit. It's structure, timing, and missing signals.",
  },
  "business-credit-explained": {
    title: "What makes a business fundable",
    preview: "How to position your business so capital becomes accessible, not uncertain.",
  },
};

const PROCESS_STEPS: { step: string; title: string; body: string; icon: LucideIcon }[] = [
  {
    step: "1",
    title: "Know where you stand",
    body: "Get clear on your current position across signals. This determines what is possible before you apply anywhere.",
    icon: Calendar,
  },
  {
    step: "2",
    title: "Evaluate your signal",
    body: "We assess how lenders will view your business and where your profile is strong or exposed.",
    icon: FileSearch,
  },
  {
    step: "3",
    title: "Choose the right path",
    body: "Based on your profile, we either match you to funding options or outline what to improve first.",
    icon: Handshake,
  },
  {
    step: "4",
    title: "Move with confidence",
    body: "Apply with the right strategy, stronger positioning, and better odds.",
    icon: Building2,
  },
];

const FUNDER_REVIEW_SIGNALS: { title: string; body: string; image: ImageAsset }[] = [
  {
    title: "Business credit & financial profile",
    body: "Personal and business credit, repayment history, and existing obligations shape how lenders assess risk and reliability.",
    image: {
      src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1400&q=80&auto=format&fit=crop",
      alt: "Credit cards and payment cards on a desk",
    },
  },
  {
    title: "Revenue & cash flow visibility",
    body: "Bank statements, deposits, and financial performance show your ability to repay and sustain new capital.",
    image: {
      src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1400&q=80&auto=format&fit=crop",
      alt: "Financial documents and calculator on a desk for cash flow review",
    },
  },
  {
    title: "Business model & unit economics",
    body: "How you make money, your margins, and cost structure determine whether capital can be effectively deployed and returned.",
    image: {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=80&auto=format&fit=crop",
      alt: "Analytics dashboard with charts and business metrics",
    },
  },
  {
    title: "Legal structure & core documents",
    body: "Entity formation, operating agreements, EIN, licenses, and filings confirm legitimacy and reduce underwriting friction.",
    image: {
      src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&q=80&auto=format&fit=crop",
      alt: "Hands reviewing legal and business formation documents",
    },
  },
  {
    title: "Financials, decks, and supporting materials",
    body: "Financial statements, projections, pitch decks, and summaries help funders understand your story and opportunity.",
    image: {
      src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&q=80&auto=format&fit=crop",
      alt: "Team reviewing a presentation and business materials",
    },
  },
  {
    title: "Assets, accounts, and operational footprint",
    body: "Bank accounts, assets, contracts, and operational systems demonstrate stability, control, and available collateral or leverage.",
    image: {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80&auto=format&fit=crop",
      alt: "Modern city skyline representing business operations and assets",
    },
  },
];

const FUNDING_ACCESS_SIGNALS: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Cash flow",
    body: "Consistent revenue and deposits signal stability. Businesses with strong cash flow can access funding structured around performance, not just history.",
    icon: DollarSign,
  },
  {
    title: "Credit profile",
    body: "Personal and business credit reflect reliability. Strong credit unlocks flexible approvals, higher limits, and lower friction across lenders.",
    icon: CreditCard,
  },
  {
    title: "Collateral",
    body: "Assets such as equipment, inventory, invoices, or real estate provide security. Collateral enables larger facilities and more favorable terms.",
    icon: Landmark,
  },
] as const;

function capitalLearnFundingCards(): ResourceItem[] {
  return CAPITAL_LEARN_SLUGS.flatMap((slug) => {
    const post = blogPosts.find((p) => p.slug === slug);
    const src = post ? getPostCoverSrc(post) : undefined;
    if (!post || !src) return [];
    const override = CAPITAL_LEARN_CARD_OVERRIDES[slug];
    return [
      {
        title: override.title,
        preview: override.preview,
        category: post.category,
        to: `/insights/${post.slug}`,
        image: src,
        imageAlt: override.title,
      },
    ];
  });
}

export function CapitalPage() {
  return (
    <>
      <section className="relative flex min-h-[100dvh] min-h-screen flex-col justify-center overflow-hidden border-b border-ori-border bg-ori-black">
        <img
          src={CAPITAL_IMAGE_SET[0]!.src}
          alt={CAPITAL_IMAGE_SET[0]!.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ori-black/70 via-ori-black/70 to-ori-black" />
        <div className="relative ori-container flex min-h-0 flex-1 flex-col justify-center py-16 md:py-24">
          <p className="ori-type-eyebrow">Funding</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-ori-foreground md:text-5xl lg:text-6xl">
            Raise from leverage, not pressure.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ori-muted md:text-lg">
            Funding doesn&apos;t start with an application. It starts with how your business shows up. We help you build a
            profile lenders and investors actually respond to.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to={ROUTES.APPLY} size="lg">
              Apply for Funding
            </Button>
            <Button to={ROUTES.FUNDING_READINESS} size="lg" variant="outline">
              Get Pre-Qualified
            </Button>
          </div>
          <p className="mt-6 text-sm text-ori-muted">
            Not sure where you stand?{" "}
            <Link to={ROUTES.FUNDING_READINESS_SURVEY} className="font-semibold text-ori-accent hover:underline">
              Take the Funding Readiness Survey
            </Link>
          </p>
        </div>
      </section>

      <FundingSpectrum />

      <PageSection className="bg-ori-section-alt section-divider">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ori-foreground sm:text-4xl">
              There are only three ways to secure funding.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ori-muted sm:text-base">
              Lenders don&apos;t guess. They evaluate signal. Cash flow, credit, and collateral determine what you
              qualify for, how much you can access, and on what terms. The stronger your signal across one or more of
              these, the more leverage you have.
            </p>
            <div className="mt-7">
              <Button to={ROUTES.APPLY} size="lg">
                Apply for Funding
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4">
              <article className="col-span-2 overflow-hidden rounded-[1.4rem] bg-ori-surface-panel/90 ring-1 ring-ori-border/45">
                <img
                  src={CAPITAL_IMAGE_SET[0]!.src}
                  alt={CAPITAL_IMAGE_SET[0]!.alt}
                  className="h-48 w-full object-cover sm:h-56"
                  loading="lazy"
                  decoding="async"
                />
              </article>
              <article className="overflow-hidden rounded-[1.2rem] bg-ori-surface-panel/90 ring-1 ring-ori-border/40">
                <img
                  src={CAPITAL_IMAGE_SET[1]!.src}
                  alt={CAPITAL_IMAGE_SET[1]!.alt}
                  className="h-40 w-full object-cover sm:h-44"
                  loading="lazy"
                  decoding="async"
                />
              </article>
              <article className="overflow-hidden rounded-[1.2rem] bg-ori-surface-panel/90 ring-1 ring-ori-border/40">
                <img
                  src={CAPITAL_IMAGE_SET[2]!.src}
                  alt={CAPITAL_IMAGE_SET[2]!.alt}
                  className="h-40 w-full object-cover sm:h-44"
                  loading="lazy"
                  decoding="async"
                />
              </article>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-2 md:pt-3 lg:pt-4">
          <p className="mb-4 text-sm leading-relaxed text-ori-foreground sm:text-base">
            Most businesses only rely on one. <span className="font-semibold text-ori-accent">The strongest businesses leverage all three.</span>
          </p>
          <div className="mb-6 h-px bg-gradient-to-r from-transparent via-ori-border/70 to-transparent" />
          <div className="grid gap-4 md:grid-cols-3">
            {FUNDING_ACCESS_SIGNALS.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-[1.15rem] bg-ori-black/25 p-5 ring-1 ring-ori-border/40 backdrop-blur-[1px]"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ori-surface/90 text-ori-accent ring-1 ring-ori-border/45">
                      <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ori-accent">{item.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ori-foreground">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </PageSection>

      <PageSection className="bg-ori-black section-divider">
        <ReadinessDemoPreview />
      </PageSection>

      <PageSection className="bg-ori-black section-divider">
        <SectionHeading
          title="How funding actually works"
          subtitle="Funding isn't a single step - it's a sequence. We help you understand where you stand, what lenders will see, and the best path forward based on your signal."
          align="center"
        />
        <ol className="mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.step}
                className="flex flex-col rounded-xl border border-ori-border bg-ori-surface-panel/80 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] md:p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ori-accent font-display text-xs font-bold text-ori-black md:h-9 md:w-9 md:text-sm">
                    {item.step}
                  </div>
                  <Icon className="h-6 w-6 text-ori-accent md:h-7 md:w-7" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-ori-foreground md:text-lg">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ori-muted md:text-sm">{item.body}</p>
              </li>
            );
          })}
        </ol>
        <p className="mx-auto mt-12 max-w-2xl text-center text-base leading-relaxed text-ori-muted md:text-lg">
          Ready to start? Choose how you'd like to move forward-we'll meet you there.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button to={ROUTES.APPLY} size="lg">
            Apply for Funding
          </Button>
          <Button to={ROUTES.FUNDING_READINESS} size="lg" variant="outline">
            Get Pre-Qualified
          </Button>
        </div>
        <p className="mt-6 text-center text-sm text-ori-muted">
          <Link to={ROUTES.FUNDING_READINESS_SURVEY} className="font-semibold text-ori-accent underline-offset-4 hover:underline">
            Take the Funding Readiness Survey
          </Link>
        </p>
      </PageSection>

      <PageSection className="bg-ori-black section-divider">
        <SectionHeading
          title="What funders actually review"
          subtitle="Funding decisions aren&apos;t random. They&apos;re structured reviews. Lenders and investors evaluate signals, documents, and financial indicators that shape approvals, limits, and terms."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FUNDER_REVIEW_SIGNALS.map((item) => (
            <article
              key={item.title}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-ori-border bg-ori-surface shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-ori-accent/35"
            >
              <div className="h-32 shrink-0 overflow-hidden bg-ori-charcoal sm:h-36">
                <img
                  src={item.image.src}
                  alt={item.image.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="flex flex-1 flex-col p-4 md:p-5">
                <h3 className="font-display text-base font-semibold leading-snug text-ori-foreground md:text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ori-muted">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-ori-foreground sm:text-base">
          If any area is weak, missing, or unclear, funding gets harder or more expensive.
        </p>
      </PageSection>

      {config.featureFlags.showFundingCounter ? (
        <PageSection className="bg-ori-section-alt section-divider">
          <FundingCounter />
        </PageSection>
      ) : null}

      <PageSection className="bg-ori-black section-divider">
        <TrustSectionIntro
          title="Most businesses don&apos;t get funded. Here&apos;s why."
          subtitle="Most businesses apply too early, too late, or without the right signals. Learn how to align your business with how capital actually moves."
        />
        <ResourceCardGrid items={capitalLearnFundingCards()} />
      </PageSection>

      <FundingMapClosingSection
        title="Not sure where you stand? Let&apos;s map it out."
        body={
          <>
            Whether you&apos;re ready for funding or still putting the pieces together, we&apos;ll help you understand your
            position and the right next move.
          </>
        }
        ctaLabel="Start the conversation"
        ctaTo={ROUTES.CONTACT}
      />

    </>
  );
}
