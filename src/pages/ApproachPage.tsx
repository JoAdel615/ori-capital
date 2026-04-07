import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { PageHero, PageSection } from "../components/system";
import { ROUTES } from "../utils/navigation";
import { config } from "../config";

export function ApproachPage() {
  return (
    <>
      <PageHero
        size="inner"
        title="Our Approach"
        subtitle="We believe funding should support builders — not control them. Ori was built for entrepreneurs and business owners navigating the space between traditional banks and venture capital. We help you understand your options, structure responsibly, and grow with clarity."
        align="center"
        actions={
          <>
            <Button to={ROUTES.FUNDING_READINESS} size="lg">
              Get Pre-Qualified
            </Button>
            {config.applyExternalUrl ? (
              <Button href={config.applyExternalUrl} variant="secondary" size="lg">
                Apply for Funding
              </Button>
            ) : (
              <Button to={ROUTES.APPLY} variant="secondary" size="lg">
                Apply for Funding
              </Button>
            )}
          </>
        }
        helper={
          <>
            Not sure?{" "}
            <Link to={ROUTES.FUNDING_READINESS_SURVEY} className="text-ori-accent hover:underline">
              Take the Funding Readiness Survey
            </Link>
          </>
        }
        className="border-b border-ori-border bg-ori-section-alt"
      />

      <PageSection variant="normal" className="bg-ori-black">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-ori-foreground">Ready to apply or talk structure?</p>
          <div className="ori-cta-row mt-8">
            <Button to={ROUTES.FUNDING_READINESS} size="lg">
              Get Pre-Qualified
            </Button>
            {config.applyExternalUrl ? (
              <Button href={config.applyExternalUrl} variant="secondary" size="lg">
                Apply for Funding
              </Button>
            ) : (
              <Button to={ROUTES.APPLY} variant="secondary" size="lg">
                Apply for Funding
              </Button>
            )}
          </div>
          <p className="ori-muted mt-6">
            Not sure?{" "}
            <Link to={ROUTES.FUNDING_READINESS_SURVEY} className="text-ori-accent hover:underline">
              Take the Funding Readiness Survey
            </Link>
          </p>
        </div>
      </PageSection>
    </>
  );
}
