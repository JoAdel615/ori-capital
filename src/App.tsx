import { Suspense, lazy, type ReactNode, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "./components/Analytics";
import { Layout } from "./components/Layout";
import { appRouteUrl, ROUTES } from "./utils/navigation";
import { shouldRedirectToAppOrigin } from "./utils/routeBoundary";

const AccessCapitalPage = lazy(() => import("./pages/AccessCapitalPage").then((m) => ({ default: m.AccessCapitalPage })));
const AcceleratorEnrollmentPage = lazy(() => import("./pages/AcceleratorEnrollmentPage").then((m) => ({ default: m.AcceleratorEnrollmentPage })));
const AcceleratorThreeStepEntryPage = lazy(() => import("./pages/AcceleratorThreeStepEntryPage").then((m) => ({ default: m.AcceleratorThreeStepEntryPage })));
const AcceleratorThreeStepReturnPage = lazy(() => import("./pages/AcceleratorThreeStepReturnPage").then((m) => ({ default: m.AcceleratorThreeStepReturnPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const AdminPage = lazy(() => import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })));
const CapitalPage = lazy(() => import("./pages/CapitalPage").then((m) => ({ default: m.CapitalPage })));
const CapitalLeveragePage = lazy(() => import("./pages/CapitalLeveragePage").then((m) => ({ default: m.CapitalLeveragePage })));
const CapitalPartnersPage = lazy(() => import("./pages/CapitalPartnersPage").then((m) => ({ default: m.CapitalPartnersPage })));
const CapitalReadinessPage = lazy(() => import("./pages/CapitalReadinessPage").then((m) => ({ default: m.CapitalReadinessPage })));
const ConsultingPage = lazy(() => import("./pages/ConsultingPage").then((m) => ({ default: m.ConsultingPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const FundingReadinessSurveyPage = lazy(() => import("./pages/FundingReadinessSurveyPage").then((m) => ({ default: m.FundingReadinessSurveyPage })));
const HomePage = lazy(() => import("./pages/HomePage").then((m) => ({ default: m.HomePage })));
const IndividualReadinessPage = lazy(() => import("./pages/IndividualReadinessPage").then((m) => ({ default: m.IndividualReadinessPage })));
const InsightPostPage = lazy(() => import("./pages/InsightPostPage").then((m) => ({ default: m.InsightPostPage })));
const InsightsPage = lazy(() => import("./pages/InsightsPage").then((m) => ({ default: m.InsightsPage })));
const ManagementPage = lazy(() => import("./pages/ManagementPage").then((m) => ({ default: m.ManagementPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));
const PartnerPortalPage = lazy(() => import("./pages/PartnerPortalPage").then((m) => ({ default: m.PartnerPortalPage })));
const PartnerRegisterPage = lazy(() => import("./pages/PartnerRegisterPage").then((m) => ({ default: m.PartnerRegisterPage })));
const PreQualifyPage = lazy(() => import("./pages/PreQualifyPage").then((m) => ({ default: m.PreQualifyPage })));
const ReferralPage = lazy(() => import("./pages/ReferralPage").then((m) => ({ default: m.ReferralPage })));
const TestimonialPage = lazy(() => import("./pages/TestimonialPage").then((m) => ({ default: m.TestimonialPage })));
const DisclosuresPage = lazy(() => import("./pages/legal/DisclosuresPage").then((m) => ({ default: m.DisclosuresPage })));
const PrivacyPage = lazy(() => import("./pages/legal/PrivacyPage").then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/legal/TermsPage").then((m) => ({ default: m.TermsPage })));

function ScrollToTopOnRouteChange() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
        return () => clearTimeout(t);
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function RouteLoadingFallback() {
  return (
    <div className="ori-container ori-section">
      <p className="ori-type-body-muted">Loading page...</p>
    </div>
  );
}

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<RouteLoadingFallback />}>{node}</Suspense>;
}

function AppDomainRoute({ path, fallback }: { path: string; fallback: ReactNode }) {
  const redirectToAppOrigin = shouldRedirectToAppOrigin(path);
  const destination = redirectToAppOrigin ? appRouteUrl(path) : null;

  useEffect(() => {
    if (!destination) return;
    window.location.replace(destination);
  }, [destination]);

  if (destination) {
    return (
      <div className="ori-container ori-section">
        <p className="ori-type-body-muted">Redirecting to secure app...</p>
      </div>
    );
  }
  return fallback;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnRouteChange />
      <Analytics />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={withSuspense(<HomePage />)} />

          <Route path="tools" element={withSuspense(<ManagementPage />)} />
          <Route path="tools/formation" element={<Navigate to="/tools" replace />} />
          <Route path="tools/business-profile" element={<Navigate to="/tools" replace />} />
          <Route path="tools/business-builder" element={<Navigate to="/tools" replace />} />
          <Route path="tools/hosting" element={<Navigate to="/tools" replace />} />
          <Route path="tools/crm-growth" element={<Navigate to="/tools" replace />} />

          <Route path="management" element={<Navigate to="/tools" replace />} />
          <Route path="management/formation" element={<Navigate to="/tools" replace />} />
          <Route path="management/business-profile" element={<Navigate to="/tools" replace />} />
          <Route path="management/business-builder" element={<Navigate to="/tools" replace />} />
          <Route path="management/hosting" element={<Navigate to="/tools" replace />} />
          <Route path="management/crm-growth" element={<Navigate to="/tools" replace />} />

          <Route path="services" element={withSuspense(<ConsultingPage />)} />
          <Route path="services/coaching" element={<Navigate to="/services" replace />} />
          <Route path="services/structuring" element={<Navigate to="/services" replace />} />
          <Route path="services/capital-strategy" element={<Navigate to="/services" replace />} />
          <Route path="services/product-development" element={<Navigate to="/services" replace />} />
          <Route path="services/book" element={<Navigate to="/services" replace />} />
          <Route path="services/lifecycle/:slug" element={<Navigate to="/services" replace />} />

          <Route path="consulting" element={<Navigate to="/services" replace />} />
          <Route path="consulting/coaching" element={<Navigate to="/services" replace />} />
          <Route path="consulting/structuring" element={<Navigate to="/services" replace />} />
          <Route path="consulting/capital-strategy" element={<Navigate to="/services" replace />} />
          <Route path="consulting/product-development" element={<Navigate to="/services" replace />} />
          <Route path="consulting/book" element={<Navigate to="/services" replace />} />
          <Route path="consulting/lifecycle/:slug" element={<Navigate to="/services" replace />} />

          <Route path="capital/leverage" element={withSuspense(<CapitalLeveragePage />)} />
          <Route path="capital" element={withSuspense(<CapitalPage />)} />
          <Route path="funding" element={withSuspense(<AccessCapitalPage />)} />
          <Route path="access-capital" element={<Navigate to="/funding" replace />} />
          <Route path="apply" element={withSuspense(<PreQualifyPage />)} />
          <Route path="pre-qualify" element={<Navigate to="/apply" replace />} />
          <Route path="funding-readiness" element={withSuspense(<CapitalReadinessPage />)} />
          <Route path="funding-readiness/individual" element={withSuspense(<IndividualReadinessPage />)} />
          <Route path="funding-readiness/enroll" element={withSuspense(<AcceleratorEnrollmentPage />)} />
          <Route path="funding-readiness/enroll/three-step" element={withSuspense(<AcceleratorThreeStepEntryPage />)} />
          <Route path="funding-readiness/enroll/three-step/return" element={withSuspense(<AcceleratorThreeStepReturnPage />)} />
          <Route path="funding-readiness-survey" element={withSuspense(<FundingReadinessSurveyPage />)} />
          <Route path="capital-readiness" element={<Navigate to="/funding-readiness" replace />} />
          <Route path="readiness" element={<Navigate to="/funding-readiness" replace />} />

          <Route path="approach" element={<Navigate to="/services" replace />} />
          <Route path="strategy" element={<Navigate to="/services" replace />} />
          <Route path="model" element={<Navigate to="/services" replace />} />

          <Route path="insights" element={withSuspense(<InsightsPage />)} />
          <Route path="insights/:slug" element={withSuspense(<InsightPostPage />)} />
          <Route path="partners" element={withSuspense(<CapitalPartnersPage />)} />
          <Route path="capital-partners" element={<Navigate to="/partners" replace />} />
          <Route path="about" element={withSuspense(<AboutPage />)} />
          <Route path="contact" element={withSuspense(<ContactPage />)} />
          <Route
            path="admin"
            element={<AppDomainRoute path={ROUTES.ADMIN} fallback={withSuspense(<AdminPage />)} />}
          />
          <Route path="partner/register" element={withSuspense(<PartnerRegisterPage />)} />
          <Route
            path="partner"
            element={<AppDomainRoute path={ROUTES.PARTNER_PORTAL} fallback={withSuspense(<PartnerPortalPage />)} />}
          />
          <Route path="referral" element={withSuspense(<ReferralPage />)} />
          <Route path="testimonial" element={withSuspense(<TestimonialPage />)} />
          <Route path="legal/privacy" element={withSuspense(<PrivacyPage />)} />
          <Route path="legal/terms" element={withSuspense(<TermsPage />)} />
          <Route path="legal/disclosures" element={withSuspense(<DisclosuresPage />)} />

          <Route path="get-started" element={<Navigate to="/funding-readiness-survey" replace />} />
          <Route path="guided-path" element={<Navigate to="/funding-readiness-survey" replace />} />
          <Route path="pricing" element={<Navigate to="/" replace />} />
          <Route path="*" element={withSuspense(<NotFoundPage />)} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
