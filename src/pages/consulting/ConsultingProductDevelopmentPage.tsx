import { PillarModulePage } from "../../components/pillars/PillarModulePage";
import { CONSULTING_IMAGE_SET, MODULE_HERO_BACKGROUNDS } from "../../constants/siteImagery";
import { ROUTES } from "../../utils/navigation";

export function ConsultingProductDevelopmentPage() {
  return (
    <PillarModulePage
      pillar="consulting"
      eyebrow="Collaboration / Product development"
      title="Design and build products tied to real outcomes"
      subtitle="Move from scope to delivery with engineering-minded collaboration—so what ships matches what the business needs, not a generic build checklist."
      includesTitle="Product development includes"
      includes={[
        "Discovery and scope definition aligned to customer and revenue goals",
        "Architecture and delivery planning with clear milestones",
        "Build execution support coordinated with your operators",
        "Handoff patterns so your team can own and extend the product",
      ]}
      steps={[
        "Clarify the problem, users, and success metrics.",
        "Shape the minimum viable path and technical approach.",
        "Execute in iterations with visible checkpoints.",
        "Stabilize, document, and transition ownership.",
      ]}
      outcomes={[
        "Less rework from unclear requirements.",
        "Faster path from idea to something users can adopt.",
        "Better alignment between product, operations, and capital story.",
      ]}
      faq={[
        {
          id: "who-builds",
          title: "Do you replace an in-house engineering team?",
          content:
            "No. Ori collaborates with your builders or partners. The goal is clarity, sequencing, and delivery discipline—not to displace your team.",
        },
        {
          id: "mvp",
          title: "Is this only for MVPs?",
          content:
            "MVPs are common starting points, but engagements can also focus on refactors, new modules, or technical debt reduction when that unlocks growth.",
        },
        {
          id: "management",
          title: "How does this connect to Management?",
          content:
            "Strong products sit on reliable operations. Formation, records, hosting, and CRM modules often support what you ship and how you prove traction.",
        },
      ]}
      primaryCta={{ label: "Discuss product scope", to: ROUTES.CONSULTING_BOOK }}
      secondaryCta={{ label: "View Management", to: ROUTES.MANAGEMENT }}
      heroLayout="split"
      heroImage={MODULE_HERO_BACKGROUNDS.consulting}
      heroImageAlt="Developers collaborating on product and code"
      galleryLayout="bento"
      galleryImages={CONSULTING_IMAGE_SET}
      layoutVariant="alternating"
      faqSurface="base"
    />
  );
}
