import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Analytics } from "./components/Analytics";

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
import { HomePage } from "./pages/HomePage";
import { AccessCapitalPage } from "./pages/AccessCapitalPage";
import { ApproachPage } from "./pages/ApproachPage";
import { CapitalReadinessPage } from "./pages/CapitalReadinessPage";
import { IndividualReadinessPage } from "./pages/IndividualReadinessPage";
import { AcceleratorEnrollmentPage } from "./pages/AcceleratorEnrollmentPage";
import { AcceleratorThreeStepEntryPage } from "./pages/AcceleratorThreeStepEntryPage";
import { AcceleratorThreeStepReturnPage } from "./pages/AcceleratorThreeStepReturnPage";
import { InsightsPage } from "./pages/InsightsPage";
import { InsightPostPage } from "./pages/InsightPostPage";
import { CapitalPartnersPage } from "./pages/CapitalPartnersPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { PreQualifyPage } from "./pages/PreQualifyPage";
import { AdminPage } from "./pages/AdminPage";
import { PartnerPortalPage } from "./pages/PartnerPortalPage";
import { PartnerRegisterPage } from "./pages/PartnerRegisterPage";
import { ReferralPage } from "./pages/ReferralPage";
import { TestimonialPage } from "./pages/TestimonialPage";
import { FundingReadinessSurveyPage } from "./pages/FundingReadinessSurveyPage";
import { PrivacyPage } from "./pages/legal/PrivacyPage";
import { TermsPage } from "./pages/legal/TermsPage";
import { DisclosuresPage } from "./pages/legal/DisclosuresPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnRouteChange />
      <Analytics />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="funding" element={<AccessCapitalPage />} />
          <Route path="access-capital" element={<Navigate to="/funding" replace />} />
          <Route path="apply" element={<PreQualifyPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="partner/register" element={<PartnerRegisterPage />} />
          <Route path="partner" element={<PartnerPortalPage />} />
          <Route path="referral" element={<ReferralPage />} />
          <Route path="testimonial" element={<TestimonialPage />} />
          <Route path="pre-qualify" element={<Navigate to="/apply" replace />} />
          <Route path="approach" element={<ApproachPage />} />
          <Route path="strategy" element={<Navigate to="/approach" replace />} />
          <Route path="model" element={<Navigate to="/approach" replace />} />
          <Route path="funding-readiness" element={<CapitalReadinessPage />} />
          <Route path="funding-readiness/individual" element={<IndividualReadinessPage />} />
          <Route path="funding-readiness/enroll" element={<AcceleratorEnrollmentPage />} />
          <Route path="funding-readiness/enroll/three-step" element={<AcceleratorThreeStepEntryPage />} />
          <Route path="funding-readiness/enroll/three-step/return" element={<AcceleratorThreeStepReturnPage />} />
          <Route path="funding-readiness-survey" element={<FundingReadinessSurveyPage />} />
          <Route path="capital-readiness" element={<Navigate to="/funding-readiness" replace />} />
          <Route path="readiness" element={<Navigate to="/funding-readiness" replace />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="insights/:slug" element={<InsightPostPage />} />
          <Route path="partners" element={<CapitalPartnersPage />} />
          <Route path="capital-partners" element={<Navigate to="/partners" replace />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="legal/privacy" element={<PrivacyPage />} />
          <Route path="legal/terms" element={<TermsPage />} />
          <Route path="legal/disclosures" element={<DisclosuresPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
