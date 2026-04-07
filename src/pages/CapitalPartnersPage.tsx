import {
  PartnerAudienceSection,
  PartnerBenefitsSection,
  PartnerClientValueSection,
  PartnerFinalCtaSection,
  PartnerHeroSection,
  PartnerHowItWorksSection,
} from "../components/partner/PartnerSections";

export function CapitalPartnersPage() {
  return (
    <>
      <PartnerHeroSection />
      <PartnerAudienceSection />
      <PartnerBenefitsSection />
      <PartnerHowItWorksSection />
      <PartnerClientValueSection />
      <PartnerFinalCtaSection />
    </>
  );
}
