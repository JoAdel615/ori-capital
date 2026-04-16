/**
 * Canonical title segments by route.
 * Keep in sync with App.tsx marketing + utility paths.
 */
export const ROUTE_TITLES: Record<string, string> = {
  "/": "",
  "/funding": "Funding",
  "/access-capital": "Funding",
  "/apply": "Apply for Funding",
  "/admin": "Admin",
  "/partner": "Partner portal",
  "/partner/register": "Extend your offering with Ori",
  "/referral": "Referred to Ori",
  "/testimonial": "Share your experience",
  "/pre-qualify": "Apply for Funding",
  "/tools": "Tools",
  "/tools/formation": "Formation & Compliance",
  "/tools/business-profile": "Ori Vault",
  "/tools/business-builder": "Business Builder",
  "/tools/hosting": "Hosting & VoIP",
  "/tools/crm-growth": "CRM & Growth",
  "/services": "Services",
  "/services/coaching": "Startup Coaching",
  "/services/structuring": "Management Advisory",
  "/services/capital-strategy": "Funding Strategy",
  "/services/product-development": "Product Development",
  "/services/book": "Book Advisory Session",
  "/services/lifecycle/sharpen-your-business-model": "Sharpen your business model",
  "/services/lifecycle/build-a-predictable-pipeline": "Establish a predictable pipeline",
  "/services/lifecycle/systemize-your-operations": "Turn operations into systems",
  "/services/lifecycle/install-your-growth-engine": "Run on real signals",
  "/services/lifecycle/build-the-right-foundation": "Build on solid ground",
  "/services/lifecycle/deploy-capital-strategically": "Deploy funding strategically",
  "/capital": "Funding",
  "/capital/leverage": "Funding & full stack",
  "/funding-readiness": "Funding Readiness",
  "/funding-readiness/individual": "Individual Readiness",
  "/funding-readiness/enroll": "Enroll — Funding Readiness Accelerator",
  "/funding-readiness/enroll/three-step": "Accelerator checkout",
  "/funding-readiness/enroll/three-step/return": "Enrollment complete",
  "/funding-readiness-survey": "Funding Readiness Survey",
  "/insights": "Insights",
  "/partners": "Partner With Ori",
  "/about": "About",
  "/contact": "Contact",
  "/legal/privacy": "Privacy Policy",
  "/legal/terms": "Terms of Service",
  "/legal/disclosures": "Disclosures",
};

export function titleSegmentForPath(pathname: string): string | undefined {
  if (pathname.startsWith("/insights/")) return "Insights";
  return ROUTE_TITLES[pathname];
}
