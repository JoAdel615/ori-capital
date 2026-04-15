import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { PageSection } from "../../components/system";
import { CONSULTING_LIFECYCLE_LANDINGS } from "../../data/consultingLifecycleLandings";
import { ROUTES } from "../../utils/navigation";

export function ConsultingLifecycleLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const entry = CONSULTING_LIFECYCLE_LANDINGS.find((x) => x.slug === slug);
  if (!entry) return <Navigate to={ROUTES.CONSULTING} replace />;

  return (
    <PageSection className="border-b border-ori-border bg-ori-black" variant="loose">
      <div className="max-w-3xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-ori-muted/65 md:text-[11px]">{entry.phase}</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl">{entry.title}</h1>
        <p className="mt-4 text-base leading-relaxed text-ori-muted md:text-lg">{entry.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to={ROUTES.CONTACT} size="lg">
            Get in touch
          </Button>
          <Button to={ROUTES.CONSULTING_BOOK} size="lg" variant="outline">
            Book advisory
          </Button>
        </div>
        <p className="mt-6 text-sm text-ori-muted">
          Prefer to talk it through?{" "}
          <Link to={ROUTES.CONTACT} className="font-semibold text-ori-accent hover:underline">
            Contact us
          </Link>
        </p>
        <p className="mt-10">
          <Link to={ROUTES.CONSULTING} className="text-sm font-medium text-ori-muted hover:text-ori-foreground">
            ← Back to Collaboration
          </Link>
        </p>
      </div>
    </PageSection>
  );
}
