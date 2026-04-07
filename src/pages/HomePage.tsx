import { Building2, CalendarRange, CircleDollarSign, FileSearch, Handshake, Landmark, ShieldCheck, Timer, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { PageHero, PageSection } from "../components/system";
import {
  CriteriaGrid,
  ProcessSteps,
  ResourceCardGrid,
  TrustSectionIntro,
  type ResourceItem,
} from "../components/trust/TrustElements";
import { ROUTES } from "../utils/navigation";
import { FundingSpectrum } from "../components/FundingSpectrum";
import { FundingCounter } from "../components/FundingCounter";
import { ReadinessDemoPreview } from "../components/home/ReadinessDemoPreview";
import { config } from "../config";
import { blogPosts, getPostCoverSrc } from "../data/blog";
import { HERO_COLLABORATION_BG } from "../constants/siteImagery";

/** v2 home: each major block fills at least one viewport for scroll rhythm */
const fullPageSection =
  "min-h-screen min-h-dvh flex flex-col justify-center scroll-mt-20";

const HOME_LEARN_SLUGS = [
  "what-lenders-look-at-before-approving-financing",
  "why-businesses-get-denied",
  "business-credit-explained",
] as const;

function homeLearnFundingCards(): ResourceItem[] {
  return HOME_LEARN_SLUGS.flatMap((slug) => {
    const post = blogPosts.find((p) => p.slug === slug);
    const src = post ? getPostCoverSrc(post) : undefined;
    if (!post || !src) return [];
    return [
      {
        title: post.title,
        preview: post.excerpt,
        category: post.category,
        to: `/insights/${post.slug}`,
        image: src,
        imageAlt: post.title,
      },
    ];
  });
}

export function HomePage() {
  const calendlyUrl = config.calendlyUrl || "https://calendly.com/biz-oricapitalholdings/30min?month=2026-03";
  const lenderCriteria = [
    {
      title: "Business credibility",
      description: "Lenders check whether your business looks and operates like a legitimate, established entity.",
      icon: ShieldCheck,
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop",
      imageAlt: "Team collaborating in a modern office",
    },
    {
      title: "Cash flow and revenue",
      description: "Consistent cash flow helps lenders evaluate your repayment capacity and risk profile.",
      icon: CircleDollarSign,
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&auto=format&fit=crop",
      imageAlt: "Financial documents and planning",
    },
    {
      title: "Time in business",
      description: "Longer operating history can improve confidence and unlock broader funding options.",
      icon: Timer,
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop",
      imageAlt: "Workspace and business operations",
    },
    {
      title: "Credit profile",
      description: "Personal and business credit trends influence both approvals and the terms you receive.",
      icon: WalletCards,
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80&auto=format&fit=crop",
      imageAlt: "Credit and payments concept",
    },
    {
      title: "Assets or collateral",
      description: "Available collateral can support larger facilities or lower-cost structures when needed.",
      icon: Landmark,
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
      imageAlt: "Commercial building exterior",
    },
    {
      title: "Industry and risk profile",
      description: "Some sectors face tighter underwriting, which affects structure and eligibility.",
      icon: FileSearch,
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop",
      imageAlt: "Analytics and business metrics on a laptop",
    },
  ];

  return (
    <>
      {/* Hero — full-bleed photo, overlays, gradient orbs; content above */}
      <div className="relative flex min-h-screen min-h-dvh flex-col overflow-hidden bg-ori-black">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <img
            src={HERO_COLLABORATION_BG}
            alt=""
            className="h-full w-full object-cover object-center"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-ori-black/72" />
          <div className="absolute inset-0 bg-gradient-to-b from-ori-black/55 via-ori-black/65 to-ori-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_20%,rgba(201,243,29,0.07),transparent_55%)]" />
        </div>
        <div className="gradient-orb absolute inset-0 pointer-events-none opacity-50" aria-hidden />
        <div className="gradient-orb-accent absolute right-0 top-1/4 h-96 w-96 pointer-events-none opacity-40" aria-hidden />
        <PageHero
          size="home"
          title="You Build It. We Fund It."
          subtitle="We help startups and small businesses secure capital on stronger, more competitive terms."
          actions={
            <>
              {config.applyExternalUrl ? (
                <Button href={config.applyExternalUrl} size="lg" className="min-w-[180px]">
                  Apply for Funding
                </Button>
              ) : (
                <Button to={ROUTES.APPLY} size="lg" className="min-w-[180px]">
                  Apply for Funding
                </Button>
              )}
              <Button to={ROUTES.FUNDING_READINESS} variant="secondary" size="lg" className="min-w-[180px]">
                Get Pre-Qualified
              </Button>
            </>
          }
          helper={
            <>
              Not sure where you stand?{" "}
              <Link to={ROUTES.FUNDING_READINESS_SURVEY} className="text-ori-accent hover:underline">
                Take the Funding Readiness Survey
              </Link>
            </>
          }
          className="relative z-10 flex min-h-0 flex-1 flex-col justify-center border-b border-ori-border/80 bg-transparent"
        />
      </div>

      <FundingSpectrum fullViewport />

      <PageSection variant="normal" className={`bg-ori-section-alt section-divider ${fullPageSection}`}>
        <ReadinessDemoPreview />
      </PageSection>

      <PageSection variant="normal" id="how-it-works" className={`bg-ori-black section-divider ${fullPageSection}`}>
        <TrustSectionIntro
          title="How it works"
          subtitle="A clearer path to funding starts with understanding where your business stands and what lenders actually need to see."
        />
        <ProcessSteps
          items={[
            { title: "Apply", description: "Submit basic business and financial details.", icon: CalendarRange },
            { title: "Review", description: "We assess the signals lenders typically evaluate.", icon: FileSearch },
            { title: "Match or Prepare", description: "We identify funding options or the readiness work needed first.", icon: Handshake },
            { title: "Move Forward", description: "Apply with more clarity, confidence, and strategy.", icon: Building2 },
          ]}
        />
        <div className="mt-16 flex flex-col items-center gap-4 sm:mt-20">
          <p className="max-w-md text-center text-sm text-ori-muted">
            Ready to start? Choose how you&apos;d like to move forward—we&apos;ll meet you there.
          </p>
          <div className="flex w-full max-w-lg flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
            {config.applyExternalUrl ? (
              <Button href={config.applyExternalUrl} size="lg" className="min-h-[3rem] w-full min-w-[200px] sm:w-auto">
                Apply for Funding
              </Button>
            ) : (
              <Button to={ROUTES.APPLY} size="lg" className="min-h-[3rem] w-full min-w-[200px] sm:w-auto">
                Apply for Funding
              </Button>
            )}
            <Button to={ROUTES.FUNDING_READINESS} variant="secondary" size="lg" className="min-h-[3rem] w-full min-w-[200px] sm:w-auto">
              Get Pre-Qualified
            </Button>
          </div>
          <Link
            to={ROUTES.FUNDING_READINESS_SURVEY}
            className="text-sm font-medium text-ori-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-black"
          >
            Take the Funding Readiness Survey
          </Link>
        </div>
      </PageSection>

      <PageSection variant="normal" className={`relative overflow-hidden bg-ori-section-alt section-divider ${fullPageSection}`}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4] bg-[radial-gradient(circle_at_20%_30%,rgba(201,243,29,0.07),transparent_45%),radial-gradient(circle_at_85%_70%,rgba(201,243,29,0.05),transparent_40%)]"
          aria-hidden
        />
        <div className="relative">
          <TrustSectionIntro
            title="What lenders actually evaluate"
            subtitle="Most businesses are not denied randomly-they are missing one or more of the signals below."
          />
          <CriteriaGrid items={lenderCriteria} />
        </div>
      </PageSection>

      <PageSection variant="normal" className={`bg-ori-black section-divider ${fullPageSection}`}>
        <TrustSectionIntro title="Funding aligned with your business, not guesswork" />
        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              title: "Credit-based funding",
              description:
                "Useful for building access, flexibility, and working capital when credit profile and business setup support it.",
              bestFor: "Best for founders with stable credit and established operating basics.",
            },
            {
              title: "Revenue-based funding",
              description:
                "Can help businesses with active sales and cash flow that need speed or short-term growth capital.",
              bestFor: "Best for companies with active revenue and short runway needs.",
            },
            {
              title: "Asset-backed funding",
              description:
                "Best when equipment, invoices, or other assets can support borrowing and lower structural risk.",
              bestFor: "Best for businesses with financeable receivables, inventory, or equipment.",
            },
            {
              title: "Strategic funding pathways",
              description:
                "Sometimes the best move is improving readiness before applying so the next application is stronger.",
              bestFor: "Best for founders who want better odds and better terms before applying.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-ori-border bg-ori-surface p-6">
              <h3 className="font-display text-xl font-semibold text-ori-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ori-muted">{item.description}</p>
              <p className="mt-4 text-sm font-medium text-ori-foreground">{item.bestFor}</p>
            </article>
          ))}
        </div>
        <div className="mt-14 flex justify-center md:mt-16">
          <Button href={calendlyUrl} variant="outline" size="lg" className="min-w-[240px]">
            Schedule a consultation
          </Button>
        </div>
      </PageSection>

      {config.featureFlags.showFundingCounter && (
        <PageSection variant="normal" className={`bg-ori-section-alt section-divider ${fullPageSection}`}>
          <TrustSectionIntro
            title="You Build It. We Fund It"
            subtitle="Deals sourced for operators building durable businesses."
          />
          <FundingCounter />
        </PageSection>
      )}

      <PageSection variant="normal" className={`bg-ori-black section-divider ${fullPageSection}`}>
        <TrustSectionIntro title="Learn how funding actually works" />
        <ResourceCardGrid items={homeLearnFundingCards()} />
      </PageSection>

      <PageSection variant="normal" className={`bg-ori-section-alt section-divider ${fullPageSection}`}>
        <TrustSectionIntro
          title="Partner with Ori"
          subtitle="If you support founders and operators, we make it easy to refer clients into clear, structured capital support."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Advisors & consultants",
              body: "Refer clients who need funding clarity, stronger positioning, and realistic capital pathways.",
            },
            {
              title: "Service providers",
              body: "Add funding support to your client ecosystem without adding complexity to your own delivery.",
            },
            {
              title: "Strategic partners",
              body: "Create aligned referral workflows with transparent attribution and long-term relationship value.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-ori-border bg-ori-surface p-6">
              <h3 className="font-display text-xl font-semibold text-ori-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ori-muted">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button to={ROUTES.PARTNERS} variant="outline" size="lg" className="min-w-[220px]">
            Explore Partner Program
          </Button>
        </div>
      </PageSection>
    </>
  );
}
