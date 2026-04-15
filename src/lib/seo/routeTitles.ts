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
  "/management": "Management",
  "/management/formation": "Formation & Compliance",
  "/management/business-profile": "Ori Vault",
  "/management/business-builder": "Business Builder",
  "/management/hosting": "Hosting & VoIP",
  "/management/crm-growth": "CRM & Growth",
  "/consulting": "Collaboration",
  "/consulting/coaching": "Startup Coaching",
  "/consulting/structuring": "Management Advisory",
  "/consulting/capital-strategy": "Funding Strategy",
  "/consulting/product-development": "Product Development",
  "/consulting/book": "Book Advisory Session",
  "/consulting/lifecycle/sharpen-your-business-model": "Sharpen your business model",
  "/consulting/lifecycle/build-a-predictable-pipeline": "Establish a predictable pipeline",
  "/consulting/lifecycle/systemize-your-operations": "Turn operations into systems",
  "/consulting/lifecycle/install-your-growth-engine": "Run on real signals",
  "/consulting/lifecycle/build-the-right-foundation": "Build on solid ground",
  "/consulting/lifecycle/deploy-capital-strategically": "Deploy funding strategically",
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
