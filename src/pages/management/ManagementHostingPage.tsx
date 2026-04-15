import { PillarModulePage } from "../../components/pillars/PillarModulePage";
import { MANAGEMENT_IMAGE_SET, MODULE_HERO_BACKGROUNDS } from "../../constants/siteImagery";
import { ROUTES } from "../../utils/navigation";

export function ManagementHostingPage() {
  return (
    <PillarModulePage
      pillar="management"
      eyebrow="Management / Hosting & comms"
      title="Get your business online with professional infrastructure"
      subtitle="Launch domain, hosting, business email, and VoIP—with voice, SMS, and unified comms—in a setup built for reliability, not technical overwhelm."
      includes={[
        "Domain setup and DNS guidance",
        "Business email configuration",
        "Hosting environment setup and basic cPanel support",
        "VoIP, business voice, and SMS aligned to how your team actually works",
        "Operational handoff documentation for your team",
      ]}
      steps={[
        "Choose your domain and email structure.",
        "Ori provisions hosting and core services.",
        "We configure baseline security and operational settings.",
        "You launch with a stable online presence and support path.",
      ]}
      outcomes={[
        "A credible online footprint for clients and partners.",
        "Reduced setup errors across DNS and email.",
        "Infrastructure aligned with your wider Ori management stack.",
      ]}
      faq={[
        {
          id: "existing-domain",
          title: "Can I use my existing domain?",
          content:
            "Yes. Existing domains can be connected and migrated with a controlled transition plan.",
        },
        {
          id: "website-build",
          title: "Do you also build websites?",
          content:
            "We can support setup and infrastructure. Build scope depends on your package and project requirements.",
        },
        {
          id: "ownership",
          title: "Do I retain ownership of my assets?",
          content:
            "Yes. Domains, accounts, and business assets remain under your business ownership with documented access.",
        },
      ]}
      primaryCta={{ label: "Get online", to: ROUTES.CONTACT }}
      secondaryCta={{ label: "View CRM & Growth", to: ROUTES.MANAGEMENT_CRM_GROWTH }}
      heroLayout="overlay"
      heroImage={MODULE_HERO_BACKGROUNDS.management}
      heroImageAlt="Engineer configuring web hosting infrastructure"
      galleryLayout="equal"
      galleryImages={MANAGEMENT_IMAGE_SET}
    />
  );
}
