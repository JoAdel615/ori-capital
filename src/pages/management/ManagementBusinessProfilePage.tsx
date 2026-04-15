import { PillarModulePage } from "../../components/pillars/PillarModulePage";
import { MANAGEMENT_IMAGE_SET, MODULE_HERO_BACKGROUNDS } from "../../constants/siteImagery";
import { ROUTES } from "../../utils/navigation";

export function ManagementBusinessProfilePage() {
  return (
    <PillarModulePage
      pillar="management"
      eyebrow="Management / Ori Vault"
      title="One source of truth for identity, documents, and compliance signals"
      subtitle="Centralize what funders, partners, and operators actually need to see—without scattered drives, lost versions, or mystery attachments."
      includes={[
        "Structured business profile and ownership documentation",
        "Versioned document patterns aligned to diligence questions",
        "Access and visibility controls for operators and advisors",
        "Readiness signals that connect to funding workflows",
      ]}
      steps={[
        "Inventory what exists today and where gaps show up in diligence.",
        "Define the canonical record structure for your stage.",
        "Migrate and normalize high-value artifacts first.",
        "Establish review cadence as the business changes.",
      ]}
      outcomes={[
        "Faster answers when lenders or partners ask for proof.",
        "Less operational drag hunting for the right file.",
        "Better continuity when teams or advisors change.",
      ]}
      faq={[
        {
          id: "security",
          title: "How is sensitive data handled?",
          content:
            "Access is role-based with operational defaults appropriate for SMB workflows. Your team controls what is shared outward.",
        },
        {
          id: "integrations",
          title: "Can this connect to other tools?",
          content:
            "Yes, where it improves truth and reduces duplicate entry. Scope depends on your stack and priorities.",
        },
        {
          id: "readiness",
          title: "Does this replace Funding Readiness?",
          content:
            "Vault supports readiness with evidence and structure. Readiness programs still guide sequencing, narrative, and application execution.",
        },
      ]}
      primaryCta={{ label: "Plan your Vault setup", to: ROUTES.CONTACT }}
      secondaryCta={{ label: "Go to Funding Readiness", to: ROUTES.FUNDING_READINESS }}
      heroLayout="split"
      heroImage={MODULE_HERO_BACKGROUNDS.management}
      heroImageAlt="Professional organizing business records and compliance documents"
      galleryLayout="equal"
      galleryImages={MANAGEMENT_IMAGE_SET}
      layoutVariant="standard"
      faqSurface="muted"
    />
  );
}
