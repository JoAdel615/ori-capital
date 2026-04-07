import { PageHero, PageSection } from "../../components/system";

export function DisclosuresPage() {
  return (
    <>
      <PageHero
        size="inner"
        title="Disclosures"
        subtitle="Important information about Ori Capital and our services"
        align="center"
        className="border-b border-ori-border bg-ori-section-alt"
      />

      <PageSection variant="normal" className="bg-ori-black">
        <div className="prose prose-invert max-w-3xl mx-auto text-ori-muted">
          <p className="text-ori-foreground font-medium">
            Please read these disclosures carefully. They apply to your use of our website and any applications or services.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Ori is not a bank</h2>
          <p>
            Ori Capital is not a bank, credit union, or depository institution. We are a capital platform and strategy partner. Banking products and regulatory protections associated with banks do not apply to our current services.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Funding outcomes</h2>
          <p>
            Funding outcomes depend on underwriting, eligibility, and availability of funding. Submission of an application does not guarantee approval. We reserve the right to approve, decline, or offer alternative pathways (such as the Funding Readiness Accelerator) at our sole discretion.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Timelines</h2>
          <p>
            Qualification decisions may be communicated in as little as 48 hours where applicable, but timelines may vary based on volume, complexity, and completeness of information. We do not guarantee a specific response time.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">No guarantee of approval</h2>
          <p>
            There is no guarantee that any applicant will receive funding. All funding is subject to separate agreements, terms, and conditions that will be provided upon approval.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Capital Partners</h2>
          <p>
            The Capital Partners page and related forms are for relationship and interest intake only. This is not an offer to sell securities. Any future investment or partnership would be subject to separate due diligence and agreements.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Ori Credit Union</h2>
          <p>
            Ori Credit Union is a future vision and does not exist today. References to it are forward-looking and subject to regulatory and other conditions. Current services are provided by Ori Capital as a capital platform.
          </p>

          <h2 className="mt-8 text-lg font-semibold text-ori-foreground">Contact</h2>
          <p>
            For questions about these disclosures, use our <a href="/contact" className="text-ori-accent hover:underline">Contact</a> page.
          </p>
        </div>
      </PageSection>
    </>
  );
}
