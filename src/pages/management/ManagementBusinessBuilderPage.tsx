import { PillarModulePage } from "../../components/pillars/PillarModulePage";
import { MANAGEMENT_IMAGE_SET, MODULE_HERO_BACKGROUNDS } from "../../constants/siteImagery";
import { ROUTES } from "../../utils/navigation";

export function ManagementBusinessBuilderPage() {
  return (
    <PillarModulePage
      pillar="management"
      eyebrow="Management / Business Builder"
      title="Turn ideas into a business model that can actually scale"
      subtitle="Use a practical builder workflow to clarify offers, customer problems, and validation evidence before committing resources."
      includes={[
        "Interactive business model and offer mapping",
        "Customer discovery prompts and interview workflows",
        "Validation notes and decision logs",
        "Action plans tied to your next execution milestone",
      ]}
      steps={[
        "Map your current assumptions and target customer profile.",
        "Run discovery prompts to collect real market feedback.",
        "Refine offer, messaging, and go-to-market priorities.",
        "Publish a clear action plan into your management workflow.",
      ]}
      outcomes={[
        "Better strategic clarity before spending on growth.",
        "Stronger product-market fit signals and positioning.",
        "A defensible narrative for operators, partners, and funders.",
      ]}
      faq={[
        {
          id: "early-stage",
          title: "Is this only for pre-revenue founders?",
          content:
            "No. It supports both new ideas and existing businesses that need to sharpen their model and customer strategy.",
        },
        {
          id: "team-collaboration",
          title: "Can teams collaborate in the builder process?",
          content:
            "Yes. Teams can align around one source of truth for assumptions, validation, and next steps.",
        },
        {
          id: "advisory-support",
          title: "Can consulting sessions support this process?",
          content:
            "Yes. Consulting is often paired with Builder to accelerate decision quality and execution.",
        },
      ]}
      primaryCta={{ label: "Build your model", to: ROUTES.CONSULTING_BOOK }}
      secondaryCta={{ label: "See management advisory", to: ROUTES.CONSULTING_STRUCTURING }}
      heroLayout="split"
      heroImage={MODULE_HERO_BACKGROUNDS.management}
      heroImageAlt="Founder workshop session with sticky notes and whiteboard"
      galleryLayout="bento"
      galleryImages={MANAGEMENT_IMAGE_SET}
      layoutVariant="alternating"
    />
  );
}
