import { Outlet, useLocation } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { RouteErrorBoundary } from "./ErrorBoundary";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { descriptionForPath } from "../lib/seo/routeDescriptions";

const routeTitles: Record<string, string> = {
  "/": "",
  "/funding": "Funding",
  "/access-capital": "Funding",
  "/apply": "Apply for Funding",
  "/admin": "Admin",
  "/partner": "Partner portal",
  "/partner/register": "Apply to Partner",
  "/referral": "Referred to Ori",
  "/testimonial": "Share your experience",
  "/pre-qualify": "Apply for Funding",
  "/approach": "Approach",
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

export function Layout() {
  const { pathname } = useLocation();
  const titleSegment =
    routeTitles[pathname] ?? (pathname.startsWith("/insights/") ? "Insights" : undefined);
  useDocumentHead({
    titleSegment,
    description: descriptionForPath(pathname),
    canonicalPath: pathname,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Nav />
      <main id="main" className="flex-1">
        <RouteErrorBoundary>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
