import { PillarModulePage } from "../../components/pillars/PillarModulePage";
import { CONSULTING_IMAGE_SET, MODULE_HERO_BACKGROUNDS } from "../../constants/siteImagery";
import { ROUTES } from "../../utils/navigation";

export function ConsultingStructuringPage() {
  return (
    <PillarModulePage
      pillar="consulting"
      eyebrow="Collaboration / Management Advisory"
      title="Design an operating structure that scales"
      subtitle="Get advisory support for entity decisions, compliance patterns, and operating systems that reduce risk as your business grows."
      includesTitle="Management advisory includes"
      includes={[
        "Entity and ownership structuring guidance",
        "Compliance and governance process recommendations",
        "Operating model and role clarity design",
        "Coordination with Management module rollout",
      ]}
      steps={[
        "Review current structure and risk points.",
        "Define target operating model for your next stage.",
        "Map required systems, processes, and policy basics.",
        "Implement with check-ins and staged milestones.",
      ]}
      outcomes={[
        "Cleaner systems for growth and delegation.",
        "Fewer compliance and process blind spots.",
        "Better readiness for investor or lender scrutiny.",
      ]}
      faq={[
        {
          id: "legal-advice",
          title: "Is this legal or tax advice?",
          content:
            "No. Ori provides strategic operating guidance and coordinates with licensed legal and tax professionals where appropriate.",
        },
        {
          id: "existing-business",
          title: "Can this help an existing business that feels messy?",
          content:
            "Yes. Management advisory is often most valuable when cleaning up fragmented operations and compliance patterns.",
        },
        {
          id: "duration",
          title: "How long does an engagement run?",
          content:
            "Most engagements run in focused sprints, then shift to cadence reviews as systems stabilize.",
        },
      ]}
      primaryCta={{ label: "Start management advisory", to: ROUTES.CONSULTING_BOOK }}
      secondaryCta={{ label: "Formation module", to: ROUTES.MANAGEMENT_FORMATION }}
      heroClassName="ori-pillar-band-consulting border-b border-ori-border"
      heroLayout="overlay"
      heroImage={MODULE_HERO_BACKGROUNDS.consulting}
      heroImageAlt="Consulting team mapping organizational structure"
      galleryLayout="equal"
      galleryImages={CONSULTING_IMAGE_SET}
      layoutVariant="alternating"
      faqSurface="base"
    />
  );
}
