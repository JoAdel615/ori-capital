import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Accordion } from "../components/Accordion";
import { FaqJsonLd } from "../components/FaqJsonLd";
import { PageHero, PageSection } from "../components/system";
import { TrustSectionIntro } from "../components/trust/TrustElements";
import { ROUTES } from "../utils/navigation";


const faqSchemaItems = [
  {
    question: "Will this hurt my credit?",
    answer:
      "Our pre-qualification uses a soft inquiry, which does not affect your credit score. If you move forward with a formal application, some lenders may perform a hard pull.",
  },
  {
    question: "Do I need revenue to qualify?",
    answer:
      "It depends on the product. Traditional term loans and lines of credit often require revenue. We also source founder-focused and early-stage options for businesses that are not revenue-ready yet.",
  },
  {
    question: "Can startups qualify?",
    answer:
      "Yes. We work with startups and small businesses in the space between traditional banks and venture capital. Pre-revenue or early-revenue companies may qualify for specific products designed for their stage.",
  },
  {
    question: "How fast is the process really?",
    answer:
      "Pre-qualification decisions can be delivered in as little as 48 hours. Full applications and funding disbursement depend on the product and lender.",
  },
  {
    question: "What if I have been denied before?",
    answer:
      "A prior denial does not disqualify you. We evaluate your current profile and match options that fit. If needed, Funding Readiness can help strengthen your profile first.",
  },
  {
    question: "Is this a loan application?",
    answer:
      "No. Pre-qualification is a first step to see what you may qualify for, with no obligation.",
  },
  {
    question: "What documents might you ask for later?",
    answer:
      "Depending on the product, we may request bank statements, tax returns, business formation documents, or proof of revenue.",
  },
  {
    question: "What happens after I pre-qualify?",
    answer:
      "If you meet requirements, we schedule a consultation to review options, terms, and next steps. If not ready, we provide a path to improve and return stronger.",
  },
];

const faqItems = [
  {
    id: "hurt-credit",
    title: "Will this hurt my credit?",
    content: (
      <>
        Our pre-qualification uses a soft inquiry, which does not affect your credit score.
        If you move forward with a formal application, some lenders may perform a hard pull—
        we'll explain when that applies.
      </>
    ),
  },
  {
    id: "need-revenue",
    title: "Do I need revenue to qualify?",
    content: (
      <>
        It depends on the product. Traditional term loans and lines of credit often require
        revenue. We also source founder-focused and early-stage options for businesses that
        aren't revenue-ready yet.
      </>
    ),
  },
  {
    id: "startups-qualify",
    title: "Can startups qualify?",
    content: (
      <>
        Yes. We work with startups and small businesses in the gray area between banks and
        VC. Pre-revenue or early-revenue companies may qualify for specific products
        designed for their stage.
      </>
    ),
  },
  {
    id: "how-fast",
    title: "How fast is the process really?",
    content: (
      <>
        Pre-qualification decisions can be delivered in as little as 48 hours. Full
        applications and funding disbursement depend on the product and lender—we'll set
        expectations up front.
      </>
    ),
  },
  {
    id: "denied-before",
    title: "What if I've been denied before?",
    content: (
      <>
        A prior denial doesn't disqualify you. We look at your current profile and match you
        to options that fit. If you're not there yet, our Funding Readiness Accelerator can help
        you strengthen your profile and try again.
      </>
    ),
  },
  {
    id: "loan-application",
    title: "Is this a loan application?",
    content: (
      <>
        No. Pre-qualification is a first step to see what you may qualify for—no obligation.
        If you qualify and choose to proceed, we'll guide you through the next steps with
        the right lender or product.
      </>
    ),
  },
  {
    id: "documents",
    title: "What documents might you ask for later?",
    content: (
      <>
        Depending on the product, we may ask for bank statements, tax returns, business
        formation documents, or proof of revenue. We'll only request what's needed for the
        options you're pursuing.
      </>
    ),
  },
  {
    id: "after-prequalify",
    title: "What happens after I pre-qualify?",
    content: (
      <>
        If you meet requirements, we'll contact you for a free consultation to review
        available funding options. We'll explain structures, terms, and next steps. If
        you're not ready today, we'll recommend a clear path—including our Funding
        Readiness Accelerator—so you can return stronger.
      </>
    ),
  },
];

export function AccessCapitalPage() {
  const fundingTypes = [
    {
      title: "Business credit cards",
      what: "Revolving business credit limits used for short-term expenses and working capital.",
      bestFor: "Owners managing monthly operating costs and wanting flexibility.",
      avoid: "When balances will likely carry long-term and become expensive.",
      requirements: "Business entity details, credit profile, basic income or revenue support.",
    },
    {
      title: "Lines of credit",
      what: "Reusable access to capital that can be drawn as needed and repaid over time.",
      bestFor: "Cash flow smoothing, seasonal needs, and operating buffer.",
      avoid: "When your business needs fixed long-term financing for one major investment.",
      requirements: "Business bank history, revenue consistency, and underwriting documentation.",
    },
    {
      title: "Term loans",
      what: "Lump-sum funding repaid on a fixed schedule with defined terms.",
      bestFor: "Expansion projects, hiring, and structured growth initiatives.",
      avoid: "If monthly payment pressure would strain cash flow right now.",
      requirements: "Revenue history, debt capacity, and complete financial context.",
    },
    {
      title: "Revenue-based financing",
      what: "Capital repaid using a share of future revenue, often with faster decisions.",
      bestFor: "Businesses with active sales that need speed and flexibility.",
      avoid: "When margins are too thin to support variable repayment pace.",
      requirements: "Sales performance data, bank statements, and predictable inflows.",
    },
    {
      title: "Equipment financing",
      what: "Financing secured by business equipment or vehicles being acquired.",
      bestFor: "Companies acquiring tools, machines, or hardware tied to production.",
      avoid: "When the financed asset does not materially support revenue generation.",
      requirements: "Equipment quote, business details, and repayment ability indicators.",
    },
    {
      title: "SBA-style options",
      what: "Government-backed structures offered through approved lenders with defined criteria.",
      bestFor: "Established businesses seeking longer terms and larger facilities.",
      avoid: "When timing is urgent and documentation is not yet ready.",
      requirements: "Strong documentation package, financials, and underwriting readiness.",
    },
  ];

  return (
    <>
      <PageHero
        size="inner"
        eyebrow="Funding"
        title="Explore funding options built for how your business actually operates"
        subtitle="Different businesses need different forms of capital. We help you understand the options, the tradeoffs, and where your business may fit best."
        body={
          <p className="mt-4 text-base text-ori-muted">
            Funding works best after formation, profile, and operations are credible. If you are earlier in the lifecycle, start with{" "}
            <Link to={ROUTES.MANAGEMENT} className="text-ori-accent hover:underline">
              Management
            </Link>{" "}
            or{" "}
            <Link to={ROUTES.CONSULTING} className="text-ori-accent hover:underline">
              Consulting
            </Link>
            —then return here when financing is the right lever.
          </p>
        }
        align="center"
        className="border-b border-ori-border bg-ori-section-alt"
      />

      <PageSection variant="normal" id="types" className="scroll-mt-24 bg-ori-black section-divider">
        <TrustSectionIntro title="Funding types explained clearly" />
        <div className="grid gap-5 md:grid-cols-2">
          {fundingTypes.map((ft) => (
            <article key={ft.title} className="rounded-2xl border border-ori-border bg-ori-surface p-6">
              <h3 className="font-display text-xl font-semibold text-ori-foreground">{ft.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ori-muted">{ft.what}</p>
              <details className="mt-4 group rounded-xl border border-ori-border bg-ori-charcoal/40 p-4">
                <summary className="cursor-pointer list-none text-sm font-semibold text-ori-accent group-open:mb-3">
                  See details
                </summary>
                <ul className="space-y-2 text-sm leading-relaxed text-ori-foreground">
                  <li><span className="font-semibold text-ori-accent">Best for:</span> {ft.bestFor}</li>
                  <li><span className="font-semibold text-ori-accent">When to avoid:</span> {ft.avoid}</li>
                  <li><span className="font-semibold text-ori-accent">Typical requirements:</span> {ft.requirements}</li>
                </ul>
              </details>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-section-alt section-divider">
        <TrustSectionIntro title="Find the right fit" />
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-ori-border bg-ori-surface p-6">
            <h3 className="font-display text-xl font-semibold text-ori-foreground">Early-stage</h3>
            <p className="mt-3 text-sm text-ori-muted">Credit building, startup positioning, and selective starter funding paths.</p>
          </article>
          <article className="rounded-2xl border border-ori-border bg-ori-surface p-6">
            <h3 className="font-display text-xl font-semibold text-ori-foreground">Growing</h3>
            <p className="mt-3 text-sm text-ori-muted">Working capital, cash flow support, and flexible access to capital.</p>
          </article>
          <article className="rounded-2xl border border-ori-border bg-ori-surface p-6">
            <h3 className="font-display text-xl font-semibold text-ori-foreground">Established</h3>
            <p className="mt-3 text-sm text-ori-muted">Expansion capital, structured financing, and larger facility options.</p>
          </article>
        </div>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-black section-divider">
        <TrustSectionIntro title="What you will need" />
        <div className="rounded-2xl border border-ori-border bg-ori-surface p-6">
          <ul className="grid gap-3 text-sm text-ori-foreground md:grid-cols-2">
            {["EIN", "Business bank account", "Revenue history", "Business address", "Basic financials", "Business entity setup", "Time-in-business context if applicable"].map((item) => (
              <li key={item} className="rounded-xl border border-ori-border bg-ori-charcoal/40 px-4 py-3">{item}</li>
            ))}
          </ul>
        </div>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-section-alt section-divider">
        <div className="rounded-3xl border border-ori-border bg-ori-surface p-8 text-center md:p-12">
          <h2 className="font-display text-3xl font-semibold text-ori-foreground">See what funding may fit your business</h2>
          <div className="mt-7">
            <Button to={ROUTES.APPLY} size="lg">Get Pre-Qualified</Button>
          </div>
        </div>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-black">
        <TrustSectionIntro title="Frequently asked questions" />
        <Accordion items={faqItems} />
      </PageSection>

      <FaqJsonLd faqs={faqSchemaItems} />
    </>
  );
}
