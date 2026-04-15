import {
  PartnerAudienceSection,
  PartnerBestFitSection,
  PartnerHeroSection,
  PartnerHowPartnershipWorksSection,
  PartnerModelsSection,
  PartnerOfferThroughOriSection,
  PartnerUnlockSection,
} from "../components/partner/PartnerSections";

export function CapitalPartnersPage() {
  return (
    <>
      <PartnerHeroSection />
      <PartnerAudienceSection />
      <PartnerUnlockSection />
      <PartnerOfferThroughOriSection />
      <PartnerHowPartnershipWorksSection />
      <PartnerModelsSection />
      <PartnerBestFitSection />
    </>
  );
}
