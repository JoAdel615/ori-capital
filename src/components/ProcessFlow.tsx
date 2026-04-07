import { Button } from "./Button";
import { ROUTES } from "../utils/navigation";

const steps: Array<{
  number: number;
  title: string;
  copy: string;
  cta?: string;
  ctaTo?: string;
}> = [
  {
    number: 1,
    title: "Take Funding Readiness Survey",
    copy: "Answer a few questions so we can match you to the right options.",
    cta: "Take the Survey",
    ctaTo: ROUTES.FUNDING_READINESS_SURVEY,
  },
  {
    number: 2,
    title: "Apply for Funding",
    copy: "Pre-qualification form. Soft pull—no impact on your credit score.",
    cta: "Apply",
    ctaTo: ROUTES.APPLY,
  },
  {
    number: 3,
    title: "Review Funding Options",
    copy: "We walk you through structures that fit your stage and goals.",
  },
  {
    number: 4,
    title: "Free Consultation + Next Steps",
    copy: "If you meet requirements, we'll contact you for a free consultation. If not, we'll recommend the Funding Readiness path.",
  },
];

export function ProcessFlow() {
  return (
    <div className="relative">
      {/* Desktop: horizontal flow with connectors */}
      <div className="hidden lg:block">
        <div className="flex items-stretch justify-between gap-0">
          {steps.map((step, i) => (
            <div key={step.number} className="flex flex-1 items-stretch">
              <div className="flex flex-1 flex-col rounded-xl border border-ori-border bg-ori-surface p-5 transition-all duration-200 hover:border-ori-accent/30 hover:shadow-[0_0_24px_rgba(201,243,29,0.06)]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ori-accent/20 text-ori-accent font-display font-bold text-sm">
                  {step.number}
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-ori-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs text-ori-muted leading-relaxed flex-1">
                  {step.copy}
                </p>
                {step.cta && (
                  <div className="mt-3">
                    <Button to={step.ctaTo || ROUTES.APPLY} size="sm">
                      {step.cta}
                    </Button>
                  </div>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className="flex shrink-0 items-center px-1">
                  <span className="text-ori-muted">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="lg:hidden space-y-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex gap-4 rounded-xl border border-ori-border bg-ori-surface p-5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ori-accent/20 text-ori-accent font-display font-bold text-lg">
              {step.number}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-semibold text-ori-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-ori-muted leading-relaxed">
                {step.copy}
              </p>
              {step.cta && (
                <div className="mt-4">
                  <Button to={step.ctaTo || ROUTES.APPLY} size="sm">
                    {step.cta}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
<Button to={ROUTES.APPLY} size="lg">
        Apply for Funding
        </Button>
        <Button to={ROUTES.FUNDING_READINESS} variant="outline" size="lg">
          Get Pre-Qualified
        </Button>
      </div>
    </div>
  );
}
