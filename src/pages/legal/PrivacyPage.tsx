import { PageHero, PageSection } from "../../components/system";

export function PrivacyPage() {
  return (
    <>
      <PageHero
        size="inner"
        title="Privacy Policy"
        subtitle="Last updated: February 2025"
        align="center"
        className="border-b border-ori-border bg-ori-section-alt"
      />

      <PageSection variant="normal" className="bg-ori-black">
        <div className="prose prose-invert max-w-3xl mx-auto text-ori-muted">
          <p>
            Ori Capital (“we,” “us,” “our”) respects your privacy. This policy describes how we collect, use, and protect your information when you use our website and services.
          </p>
          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Information we collect</h2>
          <p>
            We collect information you provide directly: name, email, phone, business details, and other data you submit via forms (e.g., applications, contact, newsletter). We may also collect usage data and cookies for site operation and analytics.
          </p>
          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">How we use it</h2>
          <p>
            We use your information to process applications, respond to inquiries, send updates (with your consent), improve our services, and comply with legal obligations.
          </p>
          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Sharing</h2>
          <p>
            We do not sell your data. We may share information with service providers who assist our operations, or when required by law.
          </p>
          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Security & retention</h2>
          <p>
            We use reasonable measures to protect your data. We retain information as needed for our operations and legal requirements.
          </p>
          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Your rights</h2>
          <p>
            You may request access, correction, or deletion of your data, or opt out of marketing, by contacting us.
          </p>
          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Changes</h2>
          <p>
            We may update this policy. The “Last updated” date will reflect the latest version. Continued use of our site after changes constitutes acceptance.
          </p>
          <p className="mt-8">
            Contact: for privacy questions, use our <a href="/contact" className="text-ori-accent hover:underline">Contact</a> page.
          </p>
        </div>
      </PageSection>
    </>
  );
}
