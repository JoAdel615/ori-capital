/**
 * Short meta descriptions per path. Keep in sync with `App.tsx` routes and `Layout` titles.
 * Fallbacks handle dynamic segments (e.g. /insights/:slug — overridden by InsightPostPage).
 */

const DEFAULT =
  "Ori Capital — You Build It. We Fund It. Decisions in as little as 48 hours. Flexible facilities and structuring support for operators.";

const BY_PATH: Record<string, string> = {
  "/":
    "Ori Capital — You Build It. We Fund It. Decisions in as little as 48 hours. Flexible facilities and structuring support for operators.",
  "/funding":
    "Explore alternative capital options, flexible facilities, and structuring support built for entrepreneurs who want to stay in control.",
  "/apply": "Apply for funding with Ori Capital. Share a few details to start the conversation.",
  "/approach":
    "How Ori works with operators — access, structure, scale, and ownership without giving up the driver's seat.",
  "/funding-readiness":
    "Assess and improve funding readiness with a clear framework, tiers, and optional accelerator enrollment.",
  "/funding-readiness/individual":
    "Individual funding readiness plans and pricing — strengthen your profile before your next capital conversation.",
  "/funding-readiness/enroll":
    "Enroll in the Funding Readiness Accelerator — structured support to close readiness gaps before you apply.",
  "/funding-readiness/enroll/three-step":
    "Complete your accelerator enrollment checkout securely.",
  "/funding-readiness/enroll/three-step/return":
    "Enrollment confirmation and next steps after completing accelerator payment.",
  "/funding-readiness-survey": "Take the funding readiness survey and see where you stand.",
  "/insights": "Insights on underwriting, credit, fundability, and capital strategy from Ori Capital.",
  "/partners": "Partner with Ori Capital — referral programs, co-marketing, and support for aligned introducers.",
  "/partner/register": "Apply to become an Ori Capital partner.",
  "/partner": "Sign in to the Ori partner portal to manage referrals and resources.",
  "/referral": "You were referred to Ori Capital — how we support you and what to expect next.",
  "/testimonial": "Share your experience with Ori Capital.",
  "/about": "About Ori Capital — who we serve, how we think about capital, and what makes us different.",
  "/contact": "Contact Ori Capital — questions, consultations, partnerships, and media.",
  "/legal/privacy": "Ori Capital privacy policy — how we handle personal information.",
  "/legal/terms": "Ori Capital terms of service.",
  "/legal/disclosures": "Important disclosures from Ori Capital.",
  "/admin": "Ori Capital back office sign-in.",
};

const INSIGHTS_FALLBACK =
  "Guidance on funding, readiness, underwriting, and capital strategy from Ori Capital.";

export function descriptionForPath(pathname: string): string {
  if (BY_PATH[pathname]) {
    return BY_PATH[pathname]!;
  }
  if (pathname.startsWith("/insights/")) {
    return INSIGHTS_FALLBACK;
  }
  return DEFAULT;
}
