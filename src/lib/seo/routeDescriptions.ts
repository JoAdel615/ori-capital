/**
 * Short meta descriptions per path. Keep in sync with `App.tsx` routes and `Layout` titles.
 * Fallbacks handle dynamic segments (e.g. /insights/:slug — overridden by InsightPostPage).
 */

const DEFAULT =
  "Ori Holdings helps founders and operators build, run, and grow resilient businesses with integrated management, consulting, and funding pathways.";

const BY_PATH: Record<string, string> = {
  "/":
    "Build it right, run it with structure, and scale with clarity. Ori Holdings supports founders across Consulting, Management, and Funding.",

  "/management":
    "Ori Management: formation, Ori Vault (system of record), Builder, Hosting, and Growth—one operating system for operators.",
  "/management/formation":
    "Start your business with the right legal structure, registrations, and compliance foundation.",
  "/management/business-profile":
    "Ori Vault: the source of truth for your business—identity, documents, ownership, and compliance in one structured record.",
  "/management/business-builder":
    "Use Ori Business Builder to validate your model, customers, and offer before scaling.",
  "/management/hosting":
    "Launch your domain, business email, web hosting, and VoIP with voice and SMS through Ori Hosting.",
  "/management/crm-growth":
    "Set up lead capture, pipeline visibility, and follow-up automations with Ori CRM & Growth.",

  "/consulting":
    "Ori Consulting provides coaching and strategic advisory for founders navigating structure, growth, and capital decisions.",
  "/consulting/coaching":
    "Ori Playbooks: structured startup coaching—guided sessions plus execution Plays—so you ship outcomes, not slide decks.",
  "/consulting/structuring":
    "Management advisory for entity choices, operating systems, and scalable compliance patterns.",
  "/consulting/capital-strategy":
    "Funding strategy advisory on timing, readiness, and structure before you raise.",
  "/consulting/product-development":
    "We build, not just advise—from scope to delivery, ideas become working products tied to real business outcomes.",
  "/consulting/book": "Book an advisory session with Ori Consulting.",
  "/consulting/lifecycle/sharpen-your-business-model":
    "Clarify who you serve, how you win, and what drives profit—then move into execution with Ori Consulting.",
  "/consulting/lifecycle/build-a-predictable-pipeline":
    "Replace guesswork with a measurable customer path: messaging, acquisition, and conversion aligned with Ori.",
  "/consulting/lifecycle/systemize-your-operations":
    "Turn people, tools, and workflows into systems with clear ownership so growth creates leverage, not chaos.",
  "/consulting/lifecycle/install-your-growth-engine":
    "Track conversion, cash flow, and unit economics so decisions follow signal—supported by Ori Consulting.",
  "/consulting/lifecycle/build-the-right-foundation":
    "Structure entity, compliance, and reporting correctly from the start with Ori management advisory support.",
  "/consulting/lifecycle/deploy-capital-strategically":
    "Time funding for when your model and operations can absorb and multiply it—with Ori at your side.",

  "/capital":
    "You build it; Ori helps you fund it. Startups and SMBs secure capital on stronger terms—apply, get pre-qualified, or take the readiness survey.",
  "/capital/leverage":
    "How Ori Funding fits as a pillar: readiness, pathways, lifecycle context, and connections to Consulting and Management.",
  "/funding":
    "Explore capital options and structures for entrepreneurs who want flexibility, control, and long-term viability.",
  "/apply": "Start your Ori capital application when your business is ready to move.",
  "/funding-readiness":
    "Assess and improve your funding readiness with a practical framework and guided support options.",
  "/funding-readiness/individual":
    "Individual funding readiness plans to strengthen your profile before capital conversations.",
  "/funding-readiness/enroll":
    "Enroll in the Funding Readiness Accelerator for structured support before applying.",
  "/funding-readiness/enroll/three-step":
    "Complete your accelerator enrollment checkout securely.",
  "/funding-readiness/enroll/three-step/return":
    "Enrollment confirmation and next steps after completing accelerator payment.",
  "/funding-readiness-survey":
    "Intake discovery survey—identify your stage and strongest next actions across operations, collaboration, and funding.",
  "/insights": "Insights on operations, growth, readiness, and funding strategy from Ori.",
  "/partners": "Partner with Ori to support founders with management, consulting, and funding pathways.",
  "/partner/register": "Apply to become an Ori partner.",
  "/partner": "Sign in to the Ori partner portal.",
  "/referral": "You were referred to Ori — here is what to expect next.",
  "/testimonial": "Share your experience with Ori.",
  "/about": "About Ori — who we serve and how we support business lifecycle outcomes.",
  "/contact":
    "Reach Ori Holdings for consulting, management, and capital—share where you are and what you’re trying to do, and we’ll route you.",
  "/legal/privacy": "Ori privacy policy.",
  "/legal/terms": "Ori terms of service.",
  "/legal/disclosures": "Important disclosures from Ori.",
  "/admin": "Ori back office sign-in.",
};

const INSIGHTS_FALLBACK =
  "Operator-first guidance on business systems, growth execution, readiness, and funding strategy.";

export function descriptionForPath(pathname: string): string {
  if (BY_PATH[pathname]) {
    return BY_PATH[pathname]!;
  }
  if (pathname.startsWith("/insights/")) {
    return INSIGHTS_FALLBACK;
  }
  return DEFAULT;
}
