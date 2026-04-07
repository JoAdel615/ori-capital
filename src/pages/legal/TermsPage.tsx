import { PageHero, PageSection } from "../../components/system";

export function TermsPage() {
  return (
    <>
      <PageHero
        size="inner"
        title="Terms of Service"
        subtitle="Last updated: February 2025"
        align="center"
        className="border-b border-ori-border bg-ori-section-alt"
      />

      <PageSection variant="normal" className="bg-ori-black">
        <div className="prose prose-invert max-w-3xl mx-auto text-ori-muted">
          <p>
            These Terms of Service (“Terms”) govern your use of the Ori Capital website and related services. By using our site or submitting applications or forms, you agree to these Terms and our <a href="/legal/disclosures" className="text-ori-accent hover:underline">Disclosures</a>.
          </p>
          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Eligibility</h2>
          <p>
            Our services are offered to businesses and individuals who meet applicable eligibility criteria. We reserve the right to decline or discontinue service at our discretion.
          </p>
          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Use of site & information</h2>
          <p>
            You agree to provide accurate information and to use the site only for lawful purposes. You may not misuse our systems, attempt unauthorized access, or use our content for commercial reuse without permission.
          </p>
          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Applications & funding</h2>
          <p>
            Submitting an application does not guarantee funding. All funding is subject to underwriting, eligibility, and separate agreements. See our Disclosures for important limitations.
          </p>
          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Intellectual property</h2>
          <p>
            Content on this site is owned by Ori Capital or its licensors. You may not copy, modify, or distribute it without permission.
          </p>
          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Limitation of liability</h2>
          <p>
            To the extent permitted by law, Ori Capital is not liable for indirect, incidental, or consequential damages arising from your use of the site or our services.
          </p>
          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Changes</h2>
          <p>
            We may update these Terms. Continued use after changes constitutes acceptance. For questions, contact us via our <a href="/contact" className="text-ori-accent hover:underline">Contact</a> page.
          </p>
        </div>
      </PageSection>
    </>
  );
}
