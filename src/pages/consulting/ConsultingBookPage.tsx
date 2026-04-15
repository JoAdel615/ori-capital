import { Button } from "../../components/Button";
import { CtaBand } from "../../components/compositions";
import { PageHero, PageSection } from "../../components/system";
import { config } from "../../config";
import { ROUTES } from "../../utils/navigation";

const DEFAULT_BOOKING_URL = "https://calendly.com/biz-oricapitalholdings/30min?month=2026-03";

export function ConsultingBookPage() {
  const bookUrl = config.calendlyUrl || DEFAULT_BOOKING_URL;

  return (
    <>
      <PageHero
        eyebrow="Collaboration / Book"
        title="Book your Ori advisory session"
        subtitle="Bring your current stage, constraints, and goals. We will map practical next actions across Consulting, Management, and Funding pathways."
        actions={
          <>
            <Button href={bookUrl} size="lg">
              Open scheduling
            </Button>
            <Button to={ROUTES.CONTACT} variant="outline" size="lg">
              Prefer contact form
            </Button>
          </>
        }
        className="ori-pillar-band-consulting border-b border-ori-border"
      />

      <PageSection>
        <div className="mx-auto max-w-3xl rounded-2xl border border-ori-border bg-ori-surface-panel p-6 md:p-8">
          <h2 className="ori-type-title">Before your call</h2>
          <ul className="mt-4 space-y-2 text-sm text-ori-text-secondary">
            <li>Share your current business stage and timeline.</li>
            <li>List the top 2-3 decisions you are trying to make.</li>
            <li>Bring any formation, readiness, or pipeline context you already have.</li>
          </ul>
        </div>
      </PageSection>

      <CtaBand
        title="Need help choosing the right advisory path first?"
        body="Start with the consulting overview and choose coaching, structuring, or funding strategy based on your current bottlenecks."
        actions={
          <>
            <Button to={ROUTES.CONSULTING}>Consulting overview</Button>
            <Button to={ROUTES.MANAGEMENT} variant="secondary">
              Management modules
            </Button>
          </>
        }
      />
    </>
  );
}
