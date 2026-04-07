import { Button } from "./Button";

const steps: Array<{
  number: number;
  title: string;
  copy: string;
  cta?: string;
  ctaTo?: string;
}> = [
  {
    number: 1,
    title: "Take the Funding Readiness Survey",
    copy: "Answer a few questions so we can match you to the right options.",
    cta: "Take the Survey",
    ctaTo: "/funding-readiness-survey",
  },
  {
    number: 2,
    title: "Apply for Funding",
    copy: "Soft-pull matching. No impact on your credit score.",
  },
  {
    number: 3,
    title: "Review Funding Options",
    copy: "We walk you through structures that fit your stage and goals.",
  },
  {
    number: 4,
    title: "Free Consultation + Next Steps",
    copy: "If you meet requirements, we'll contact you for a free consultation to review available funding options. If not, we'll recommend the Funding Readiness path.",
  },
];

export function HowItWorksStepper() {
  return (
    <div className="relative">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-xl border border-ori-border bg-ori-surface p-6 transition-all duration-200 hover:border-ori-accent/30 hover:shadow-[0_0_24px_rgba(201,243,29,0.06)] hover:-translate-y-0.5 flex flex-col"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ori-accent/20 text-ori-accent font-display font-bold text-lg">
              {step.number}
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ori-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-ori-muted leading-relaxed flex-1">
              {step.copy}
            </p>
            {step.cta && (
              <div className="mt-4">
                <Button to={step.ctaTo || "/apply"} size="sm">
                  {step.cta}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button to="/apply" size="lg">
          Apply for Funding
        </Button>
        <Button to="/funding-readiness" variant="outline" size="lg">
          Get Pre-Qualified
        </Button>
      </div>
    </div>
  );
}
