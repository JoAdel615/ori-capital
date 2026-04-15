import { PillarModulePage } from "../../components/pillars/PillarModulePage";
import { CONSULTING_IMAGE_SET, MODULE_HERO_BACKGROUNDS } from "../../constants/siteImagery";
import { ROUTES } from "../../utils/navigation";

export function ConsultingCapitalStrategyPage() {
  return (
    <PillarModulePage
      pillar="consulting"
      eyebrow="Collaboration / Funding Strategy"
      title="Plan funding decisions before you submit applications"
      subtitle="Use advisory support to determine when to apply, what structures fit, and how to strengthen positioning before entering active capital conversations."
      includesTitle="Funding strategy advisory includes"
      includes={[
        "Funding timing and instrument fit guidance",
        "Readiness gap analysis and prioritization",
        "Narrative and documentation preparation support",
        "Application sequencing recommendations",
      ]}
      steps={[
        "Assess current readiness across operations, profile, and revenue quality.",
        "Select practical capital pathways aligned to your goals.",
        "Address priority gaps that impact approvals or terms.",
        "Proceed to readiness/apply flows with clearer strategy.",
      ]}
      outcomes={[
        "Better qualification odds and stronger terms positioning.",
        "Reduced wasted applications and avoidable denials.",
        "A funding plan connected to real operating outcomes.",
      ]}
      faq={[
        {
          id: "should-i-apply-now",
          title: "Can you tell me if I should apply now or wait?",
          content:
            "Yes. A core goal is determining whether to apply immediately or improve readiness first for better outcomes.",
        },
        {
          id: "capital-types",
          title: "Do you only advise on loans?",
          content:
            "No. Strategy can include multiple pathways depending on stage, ownership goals, and cash flow realities.",
        },
        {
          id: "paired-readiness",
          title: "Should this be paired with Funding Readiness?",
          content:
            "Usually yes. Strategy sessions are often paired with readiness tools to operationalize recommendations.",
        },
      ]}
      primaryCta={{ label: "Book funding strategy", to: ROUTES.CONSULTING_BOOK }}
      secondaryCta={{ label: "Go to Funding", to: ROUTES.CAPITAL }}
      heroClassName="ori-pillar-band-consulting border-b border-ori-border"
      heroLayout="overlay"
      heroImage={MODULE_HERO_BACKGROUNDS.capital}
      heroImageAlt="Advisor and founder reviewing funding strategy deck"
      galleryLayout="bento"
      galleryImages={CONSULTING_IMAGE_SET}
      layoutVariant="alternating"
    />
  );
}
