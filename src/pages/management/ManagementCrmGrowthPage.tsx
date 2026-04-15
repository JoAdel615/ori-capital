import { PillarModulePage } from "../../components/pillars/PillarModulePage";
import { MANAGEMENT_IMAGE_SET, MODULE_HERO_BACKGROUNDS } from "../../constants/siteImagery";
import { ROUTES } from "../../utils/navigation";

export function ManagementCrmGrowthPage() {
  return (
    <PillarModulePage
      pillar="management"
      eyebrow="Management / Ori Growth"
      title="Turn pipeline activity into predictable revenue motion"
      subtitle="CRM and growth workflows that match how SMBs actually sell—simple enough to use weekly, strong enough to support delegation."
      includes={[
        "Pipeline structure aligned to your offer and sales motion",
        "Lead and opportunity hygiene practices that reduce leakage",
        "Reporting views operators can trust in weekly reviews",
        "Integration guidance with hosting and Vault where it helps proof",
      ]}
      steps={[
        "Map your funnel truthfully—including where deals stall.",
        "Configure stages, fields, and ownership rules.",
        "Train the team on a lightweight operating cadence.",
        "Iterate on reports and follow-up discipline.",
      ]}
      outcomes={[
        "Better forecast clarity without enterprise complexity.",
        "Cleaner handoffs between marketing, sales, and fulfillment.",
        "Evidence of traction that supports capital conversations.",
      ]}
      faq={[
        {
          id: "which-crm",
          title: "Do you mandate a specific CRM?",
          content:
            "No. We align process first, then configure the tool that fits your budget and team habits.",
        },
        {
          id: "solo-founder",
          title: "Is this only for teams?",
          content:
            "Solo operators benefit too—especially when pipeline discipline prevents feast-or-famine revenue cycles.",
        },
        {
          id: "hosting",
          title: "How does this relate to Hosting?",
          content:
            "Presence and comms (Hosting) support demand capture; Growth turns demand into qualified pipeline and closed revenue.",
        },
      ]}
      primaryCta={{ label: "Discuss Growth setup", to: ROUTES.CONTACT }}
      secondaryCta={{ label: "View Hosting & comms", to: ROUTES.MANAGEMENT_HOSTING }}
      heroLayout="overlay"
      heroImage={MODULE_HERO_BACKGROUNDS.capital}
      heroImageAlt="Team reviewing pipeline metrics and growth charts"
      galleryLayout="bento"
      galleryImages={MANAGEMENT_IMAGE_SET}
      layoutVariant="standard"
      faqSurface="base"
    />
  );
}
