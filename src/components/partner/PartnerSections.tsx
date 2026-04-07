import { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { PageHero, PageSection, SectionHeading } from "../system";
import { config } from "../../config";
import { ROUTES } from "../../utils/navigation";

const audienceCards: {
  title: string;
  image: string;
  imageAlt: string;
  benefit: string;
}[] = [
  {
    title: "Accelerators & Incubators",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Team collaborating at a table",
    benefit:
      "Extend your cohort programming with a capital readiness path—so founders leave with stronger profiles and clearer funding options, not just pitch decks.",
  },
  {
    title: "Investors & Angel Networks",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Business handshake",
    benefit:
      "Support portfolio companies and deal flow with structured readiness—helping teams show up fundable before term sheets, without you acting as the lender.",
  },
  {
    title: "CPAs, Accountants & Bookkeepers",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Financial documents and laptop",
    benefit:
      "Turn clean books into funding-ready stories: clients get clarity on credit, cash flow, and lender expectations beyond the tax return.",
  },
  {
    title: "Attorneys & Advisors",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Law library and professional setting",
    benefit:
      "Offer clients a trusted capital pathway alongside legal strategy—entity work meets underwriting reality so deals move faster.",
  },
  {
    title: "Consultants & Coaches",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Coaching session",
    benefit:
      "Pair your strategic advice with execution on fundability—so recommendations translate into credit, reporting, and lender-ready positioning.",
  },
  {
    title: "Real Estate & Business Brokers",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Keys and home model",
    benefit:
      "Help buyers and sellers secure financing that matches the transaction—readiness work reduces surprises at underwriting.",
  },
  {
    title: "Economic Development Organizations",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Urban skyline and city development",
    benefit:
      "Give local businesses a repeatable path to capital access—aligned with job growth and community outcomes you already measure.",
  },
  {
    title: "Agencies & Service Providers",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Creative team at work",
    benefit:
      "Bundle funding readiness with your delivery—clients get growth creative and a credible plan for how they’ll fund it.",
  },
];

const benefitCards: {
  title: string;
  copy: string;
  icon: "layers" | "network" | "trending" | "compass";
}[] = [
  {
    title: "Add Funding as a Capability",
    copy: "Offer your clients access to funding solutions and capital guidance without building a lending operation yourself.",
    icon: "layers",
  },
  {
    title: "Strengthen Client Relationships",
    copy: "Become a more valuable resource by helping clients navigate one of the most important parts of growth.",
    icon: "network",
  },
  {
    title: "Create a New Revenue Opportunity",
    copy: "Participate in a partnership model that can reward the value you already create.",
    icon: "trending",
  },
  {
    title: "Stay Focused on What You Do Best",
    copy: "Ori handles the funding side. You stay focused on serving your clients and growing your core business.",
    icon: "compass",
  },
];

function BenefitIcon({ name }: { name: (typeof benefitCards)[number]["icon"] }) {
  const common = "h-9 w-9 shrink-0 text-ori-accent";
  switch (name) {
    case "layers":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "network":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="12" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M10.5 8.5L7.5 15M13.5 8.5l3 6.5" strokeLinecap="round" />
        </svg>
      );
    case "trending":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M3 17l6-6 4 4 7-7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 8h7v7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "compass":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <path d="M14.5 9.5l-2 6-6-2 2-6 6 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

const processSteps = [
  {
    title: "Register as a Partner",
    copy: "Create your partner account and get set up with Ori.",
  },
  {
    title: "Share with Your Network",
    copy: "Use your custom referral link or introduce clients directly when funding support could add value.",
  },
  {
    title: "We Support the Process",
    copy: "Ori helps guide referred clients through funding readiness and capital pathways.",
  },
  {
    title: "Track Activity & Earn",
    copy: "Stay informed on your referrals and participate in aligned partnership economics tied to successful outcomes.",
  },
];

const clientValuePoints = [
  "Clearer capital pathways",
  "Funding readiness support",
  "A structured approach to financing options",
  "Stronger positioning for growth",
];

const partnerAudiencePrimary = audienceCards.slice(0, 6);
const partnerAudienceTail = audienceCards.slice(6);

function PartnerAudienceCard({
  item,
}: {
  item: (typeof audienceCards)[number];
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-ori-border bg-ori-surface shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-ori-accent/35">
      <div className="h-32 shrink-0 overflow-hidden bg-ori-charcoal sm:h-36">
        <img
          src={item.image}
          alt={item.imageAlt}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="font-display text-base font-semibold leading-snug text-ori-foreground md:text-lg">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ori-muted">{item.benefit}</p>
      </div>
    </article>
  );
}

const sectionFull =
  "min-h-screen flex flex-col justify-center py-16 md:py-24 scroll-mt-[var(--ori-header-offset,0px)]";

export function PartnerHeroSection() {
  return (
    <div className="relative flex min-h-screen min-h-dvh flex-col overflow-hidden bg-ori-section-alt">
      <div className="gradient-orb pointer-events-none absolute inset-0" aria-hidden />
      <div className="gradient-orb-accent pointer-events-none absolute right-0 top-1/4 h-96 w-96" aria-hidden />
      <PageHero
        size="home"
        title="Bring Capital to Your Network"
        subtitle="If you work with founders, startups, or small businesses, Ori helps you offer funding solutions without becoming a lender."
        actions={
          <>
            <Button to={ROUTES.PARTNER_REGISTER} size="lg" className="min-w-[180px]">
              Apply to Partner
            </Button>
            <Button to={ROUTES.CONTACT} variant="secondary" size="lg" className="min-w-[180px]">
              Get In Touch
            </Button>
          </>
        }
        className="relative flex min-h-0 flex-1 flex-col justify-center border-b border-ori-border"
      />
    </div>
  );
}

export function PartnerAudienceSection() {
  return (
    <PageSection variant="normal" container className="bg-ori-black py-16 md:py-24">
      <SectionHeading
        title="Built for Those Who Already Support Businesses"
        subtitle="If your clients or network ever need capital, financing guidance, or a trusted funding resource, Ori is built to help you extend what you already offer."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {partnerAudiencePrimary.map((item) => (
          <PartnerAudienceCard key={item.title} item={item} />
        ))}
      </div>
      <div className="mx-auto mt-5 grid w-full max-w-3xl gap-5 sm:grid-cols-2">
        {partnerAudienceTail.map((item) => (
          <PartnerAudienceCard key={item.title} item={item} />
        ))}
      </div>
    </PageSection>
  );
}

export function PartnerBenefitsSection() {
  return (
    <PageSection variant="loose" container className={`bg-ori-section-alt ${sectionFull}`}>
      <SectionHeading title="Expand What You Can Offer — Without Expanding Your Operations" />
      <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-2">
        {benefitCards.map((card) => (
          <article key={card.title} className="rounded-2xl border border-ori-border bg-ori-surface p-6 md:p-8">
            <div className="flex gap-5">
              <BenefitIcon name={card.icon} />
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold text-ori-foreground md:text-xl">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ori-muted md:text-base">{card.copy}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PageSection>
  );
}

export function PartnerHowItWorksSection() {
  return (
    <PageSection id="how-it-works" variant="loose" container className={`bg-ori-black ${sectionFull}`}>
      <SectionHeading title="How Partnering with Ori Works" />
      <ol className="mt-12 md:mt-16 grid gap-6 md:grid-cols-2">
        {processSteps.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-ori-border bg-ori-surface p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-ori-accent">Step {index + 1}</p>
            <h3 className="mt-3 font-display text-lg font-semibold text-ori-foreground md:text-xl">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ori-muted md:text-base">{step.copy}</p>
          </li>
        ))}
      </ol>
    </PageSection>
  );
}

export function PartnerClientValueSection() {
  return (
    <PageSection variant="loose" container className={`bg-ori-section-alt ${sectionFull}`}>
      <SectionHeading title="What Your Clients Gain Through Ori" />
      <div className="mt-12 md:mt-16 grid gap-4 sm:grid-cols-2">
        {clientValuePoints.map((point) => (
          <div key={point} className="rounded-2xl border border-ori-border bg-ori-surface px-5 py-5 md:px-6 md:py-6">
            <p className="text-sm font-medium text-ori-foreground md:text-base">{point}</p>
          </div>
        ))}
      </div>
    </PageSection>
  );
}

function PartnerQuickInterestForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(config.capitalPartnersApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          organization: organization.trim() || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Could not send your note.");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <p className="mt-8 text-sm text-ori-accent" role="status">
        Thanks — we received your note and will follow up soon.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-10 max-w-md space-y-3 text-left"
      aria-busy={submitting}
    >
      <p className="text-center text-xs font-medium uppercase tracking-widest text-ori-muted">
        Quick interest
      </p>
      <p className="text-center text-sm text-ori-muted">
        Share your email and we&apos;ll reach out. Or use Apply to Partner for the full form.
      </p>
      <Input
        label="Work email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={submitting}
      />
      <Input
        label="Name (optional)"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={submitting}
      />
      <Input
        label="Organization (optional)"
        autoComplete="organization"
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        disabled={submitting}
      />
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex justify-center pt-1">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Send interest"}
        </Button>
      </div>
    </form>
  );
}

export function PartnerFinalCtaSection() {
  return (
    <PageSection variant="loose" container className="min-h-[70vh] flex flex-col justify-center bg-ori-black py-16 md:py-24">
      <div className="mx-auto max-w-3xl rounded-3xl border border-ori-border bg-ori-surface px-6 py-10 text-center md:px-10 md:py-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl">
          Ready to Partner with Ori?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ori-muted md:text-base">
          Join a growing network of professionals and organizations helping businesses access capital more strategically.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button to={ROUTES.PARTNER_REGISTER}>Apply to Partner</Button>
          <Button to={ROUTES.CONTACT} variant="outline">
            Talk With Us First
          </Button>
        </div>
        <p className="mt-4 text-xs text-ori-muted">We&apos;ll review your submission and follow up with next steps.</p>
        <PartnerQuickInterestForm />
      </div>
    </PageSection>
  );
}
