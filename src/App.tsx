import { Suspense, lazy, type ReactNode, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "./components/Analytics";
import { Layout } from "./components/Layout";

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
const ConsultingBookPage = lazy(() => import("./pages/consulting/ConsultingBookPage").then((m) => ({ default: m.ConsultingBookPage })));
const ConsultingLifecycleLandingPage = lazy(() =>
  import("./pages/consulting/ConsultingLifecycleLandingPage").then((m) => ({ default: m.ConsultingLifecycleLandingPage })),
);
const ConsultingCapitalStrategyPage = lazy(() => import("./pages/consulting/ConsultingCapitalStrategyPage").then((m) => ({ default: m.ConsultingCapitalStrategyPage })));
const ConsultingProductDevelopmentPage = lazy(() =>
  import("./pages/consulting/ConsultingProductDevelopmentPage").then((m) => ({ default: m.ConsultingProductDevelopmentPage })),
);
const ConsultingCoachingPage = lazy(() => import("./pages/consulting/ConsultingCoachingPage").then((m) => ({ default: m.ConsultingCoachingPage })));
const ConsultingStructuringPage = lazy(() => import("./pages/consulting/ConsultingStructuringPage").then((m) => ({ default: m.ConsultingStructuringPage })));
const DisclosuresPage = lazy(() => import("./pages/legal/DisclosuresPage").then((m) => ({ default: m.DisclosuresPage })));
const PrivacyPage = lazy(() => import("./pages/legal/PrivacyPage").then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/legal/TermsPage").then((m) => ({ default: m.TermsPage })));
const ManagementBusinessBuilderPage = lazy(() => import("./pages/management/ManagementBusinessBuilderPage").then((m) => ({ default: m.ManagementBusinessBuilderPage })));
const ManagementBusinessProfilePage = lazy(() => import("./pages/management/ManagementBusinessProfilePage").then((m) => ({ default: m.ManagementBusinessProfilePage })));
const ManagementCrmGrowthPage = lazy(() => import("./pages/management/ManagementCrmGrowthPage").then((m) => ({ default: m.ManagementCrmGrowthPage })));
const ManagementFormationPage = lazy(() => import("./pages/management/ManagementFormationPage").then((m) => ({ default: m.ManagementFormationPage })));
const ManagementHostingPage = lazy(() => import("./pages/management/ManagementHostingPage").then((m) => ({ default: m.ManagementHostingPage })));

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

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnRouteChange />
      <Analytics />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={withSuspense(<HomePage />)} />

          <Route path="management" element={withSuspense(<ManagementPage />)} />
          <Route path="management/formation" element={withSuspense(<ManagementFormationPage />)} />
          <Route path="management/business-profile" element={withSuspense(<ManagementBusinessProfilePage />)} />
          <Route path="management/business-builder" element={withSuspense(<ManagementBusinessBuilderPage />)} />
          <Route path="management/hosting" element={withSuspense(<ManagementHostingPage />)} />
          <Route path="management/crm-growth" element={withSuspense(<ManagementCrmGrowthPage />)} />

          <Route path="consulting" element={withSuspense(<ConsultingPage />)} />
          <Route path="consulting/coaching" element={withSuspense(<ConsultingCoachingPage />)} />
          <Route path="consulting/structuring" element={withSuspense(<ConsultingStructuringPage />)} />
          <Route path="consulting/capital-strategy" element={withSuspense(<ConsultingCapitalStrategyPage />)} />
          <Route path="consulting/product-development" element={withSuspense(<ConsultingProductDevelopmentPage />)} />
          <Route path="consulting/book" element={withSuspense(<ConsultingBookPage />)} />
          <Route path="consulting/lifecycle/:slug" element={withSuspense(<ConsultingLifecycleLandingPage />)} />

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

          <Route path="approach" element={<Navigate to="/consulting" replace />} />
          <Route path="strategy" element={<Navigate to="/consulting" replace />} />
          <Route path="model" element={<Navigate to="/consulting" replace />} />

          <Route path="insights" element={withSuspense(<InsightsPage />)} />
          <Route path="insights/:slug" element={withSuspense(<InsightPostPage />)} />
          <Route path="partners" element={withSuspense(<CapitalPartnersPage />)} />
          <Route path="capital-partners" element={<Navigate to="/partners" replace />} />
          <Route path="about" element={withSuspense(<AboutPage />)} />
          <Route path="contact" element={withSuspense(<ContactPage />)} />
          <Route path="admin" element={withSuspense(<AdminPage />)} />
          <Route path="partner/register" element={withSuspense(<PartnerRegisterPage />)} />
          <Route path="partner" element={withSuspense(<PartnerPortalPage />)} />
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
