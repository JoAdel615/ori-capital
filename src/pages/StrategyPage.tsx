import { Button } from "../components/Button";
import { PageHero, PageSection, SectionHeading } from "../components/system";
import { ROUTES } from "../utils/navigation";
import { config } from "../config";

export function StrategyPage() {
  return (
    <>
      <PageHero
        size="inner"
        title="Strategy & Capital Formation"
        subtitle="Capital formation strategy under a financial planning umbrella—so you stack, structure, and deploy capital with intention."
        align="center"
        className="border-b border-ori-border bg-ori-section-alt"
      />

      <PageSection variant="normal" className="bg-ori-black">
        <SectionHeading title="What We Offer" />
        <ul className="mx-auto max-w-2xl space-y-6">
          <li className="flex gap-4 rounded-lg border border-ori-border bg-ori-surface p-6">
            <span className="text-ori-accent font-semibold">Capital stacking</span>
            <p className="text-ori-muted">
              Layer debt, revenue-based capital, and strategic equity in a structure that fits your business and preserves ownership.
            </p>
          </li>
          <li className="flex gap-4 rounded-lg border border-ori-border bg-ori-surface p-6">
            <span className="text-ori-accent font-semibold">Funding structure advisory</span>
            <p className="text-ori-muted">
              Terms, covenants, and deal structures that align with your runway and growth—not one-size-fits-all templates.
            </p>
          </li>
          <li className="flex gap-4 rounded-lg border border-ori-border bg-ori-surface p-6">
            <span className="text-ori-accent font-semibold">Cost-of-capital literacy</span>
            <p className="text-ori-muted">
              Understand true cost: fees, dilution, and opportunity cost so you can compare options like an operator.
            </p>
          </li>
          <li className="flex gap-4 rounded-lg border border-ori-border bg-ori-surface p-6">
            <span className="text-ori-accent font-semibold">Risk + runway planning</span>
            <p className="text-ori-muted">
              Map capital to milestones and runway so you're never caught short—or over-leveraged.
            </p>
          </li>
          <li className="flex gap-4 rounded-lg border border-ori-border bg-ori-surface p-6">
            <span className="text-ori-accent font-semibold">Credit optimization</span>
            <p className="text-ori-muted">
              One component of a broader strategy: strengthen your profile and terms as part of your Funding Readiness Accelerator.
            </p>
          </li>
        </ul>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-section-alt">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-ori-foreground">
            Ready to structure funding for your next phase? Apply for funding.
          </p>
          <div className="ori-cta-row mt-8">
            {config.applyExternalUrl ? (
              <Button href={config.applyExternalUrl} size="lg">
                Apply for Funding
              </Button>
            ) : (
              <Button to={ROUTES.APPLY} size="lg">
                Apply for Funding
              </Button>
            )}
          </div>
        </div>
      </PageSection>
    </>
  );
}
