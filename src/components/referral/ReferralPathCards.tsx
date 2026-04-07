import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CardShell } from "../ui/CardShell";
import { PageSection, SectionHeading } from "../system";
import { pathWithRef } from "../../lib/referral/attribution";
import { ROUTES } from "../../utils/navigation";

type ReferralPathCardsProps = {
  refCode: string;
  onCardNavigate?: (cta: string) => void;
};

export function ReferralPathCards({ refCode, onCardNavigate }: ReferralPathCardsProps) {
  const applyPath = pathWithRef(ROUTES.APPLY, refCode);
  const surveyPath = pathWithRef(ROUTES.FUNDING_READINESS_SURVEY, refCode);
  const enrollPath = pathWithRef(ROUTES.FUNDING_READINESS_ENROLL, refCode);

  const cards = [
    {
      id: "apply",
      title: "Ready to explore funding options?",
      body: "If you’re ready to move forward, start your application and we’ll help you navigate available funding paths.",
      cta: "Apply Now",
      to: applyPath,
      trackId: "path_apply",
    },
    {
      id: "survey",
      title: "Not sure where you stand?",
      body: "Get a quick assessment of your current position and what may impact your ability to secure funding.",
      cta: "Check My Readiness",
      to: surveyPath,
      trackId: "path_survey",
    },
    {
      id: "prequal",
      title: "Want to strengthen your position first?",
      body: "Access a structured system designed to help you become more fundable and better positioned for approval.",
      cta: "Get Pre-Qualified",
      to: enrollPath,
      trackId: "path_prequal",
    },
  ] as const;

  return (
    <PageSection variant="loose" className="section-divider flex min-h-screen min-h-dvh flex-col justify-center bg-ori-section-alt">
      <SectionHeading
        title="Choose Your Next Step"
        subtitle="Three intentional paths—pick what matches where you are today. The survey is diagnostic; pre-qualification checkout is for the Funding Readiness Accelerator."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.id}
            to={card.to}
            className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-section-alt"
            onClick={() => onCardNavigate?.(card.trackId)}
          >
            <CardShell className="flex h-full flex-col transition-colors group-hover:border-ori-accent/40 group-hover:bg-ori-charcoal/30">
              <h3 className="font-display text-lg font-semibold text-ori-foreground md:text-xl">{card.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ori-muted">{card.body}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ori-accent">
                {card.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </CardShell>
          </Link>
        ))}
      </div>
    </PageSection>
  );
}
