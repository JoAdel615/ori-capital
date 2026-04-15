import { PillarModulePage } from "../../components/pillars/PillarModulePage";
import { MANAGEMENT_IMAGE_SET, MODULE_HERO_BACKGROUNDS } from "../../constants/siteImagery";
import { ROUTES } from "../../utils/navigation";

export function ManagementFormationPage() {
  return (
    <PillarModulePage
      pillar="management"
      eyebrow="Management / Ori Formation"
      title="Start the business with structure, not guesswork"
      subtitle="Entity setup, baseline compliance posture, and a clean starting point so operations and funding conversations do not start from chaos."
      includes={[
        "Entity selection guidance mapped to ownership and operating goals",
        "Foundational compliance and registration checkpoints",
        "Coordination into Ori Vault as your system of record",
        "Handoff documentation for operators and advisors",
      ]}
      steps={[
        "Confirm stage, ownership intent, and operating footprint.",
        "Select entity path and registration sequence.",
        "Complete filings and baseline policy setup.",
        "Connect records and next modules (Vault, Hosting, Growth).",
      ]}
      outcomes={[
        "Fewer expensive rework loops after launch.",
        "Cleaner records for partners, lenders, and internal operators.",
        "A credible foundation before you scale spend.",
      ]}
      faq={[
        {
          id: "multi-state",
          title: "Do you support multi-state operations?",
          content:
            "Yes, where applicable. Scope depends on footprint and complexity; we map what is required for your stage.",
        },
        {
          id: "legal-tax",
          title: "Is this legal or tax advice?",
          content:
            "Ori provides operational formation support and coordinates with licensed professionals where filings or opinions require it.",
        },
        {
          id: "existing-entity",
          title: "What if I already have an entity?",
          content:
            "We can review gaps, clean up records, and align Vault and workflows without forcing unnecessary re-filing.",
        },
      ]}
      primaryCta={{ label: "Talk formation", to: ROUTES.CONTACT }}
      secondaryCta={{ label: "Explore Ori Vault", to: ROUTES.MANAGEMENT_BUSINESS_PROFILE }}
      heroLayout="overlay"
      heroImage={MODULE_HERO_BACKGROUNDS.management}
      heroImageAlt="Founder reviewing formation documents with advisor"
      galleryLayout="bento"
      galleryImages={MANAGEMENT_IMAGE_SET}
      layoutVariant="alternating"
      faqSurface="base"
    />
  );
}
