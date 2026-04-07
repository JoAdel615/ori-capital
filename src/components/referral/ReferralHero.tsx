import { Link } from "react-router-dom";
import { Button } from "../Button";
import { PageHero } from "../system";
import { pathWithRef, externalUrlWithRef } from "../../lib/referral/attribution";
import { ROUTES } from "../../utils/navigation";
import { config } from "../../config";
import { HERO_COLLABORATION_BG } from "../../constants/siteImagery";

type ApplyTarget =
  | { kind: "internal"; to: string }
  | { kind: "external"; href: string };

function buildApplyTarget(refCode: string): ApplyTarget {
  const ext = config.applyExternalUrl?.trim();
  if (ext) {
    return { kind: "external", href: externalUrlWithRef(ext, refCode) };
  }
  return { kind: "internal", to: pathWithRef(ROUTES.APPLY, refCode) };
}

type ReferralHeroProps = {
  refCode: string;
  onCtaClick?: (cta: string) => void;
};

export function ReferralHero({ refCode, onCtaClick }: ReferralHeroProps) {
  const apply = buildApplyTarget(refCode);
  const qualifyPath = pathWithRef(ROUTES.FUNDING_READINESS, refCode);
  const surveyPath = pathWithRef(ROUTES.FUNDING_READINESS_SURVEY, refCode);

  return (
    <div className="relative flex min-h-screen min-h-dvh flex-col overflow-hidden bg-ori-black">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src={HERO_COLLABORATION_BG}
          alt=""
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-ori-black/72" />
        <div className="absolute inset-0 bg-gradient-to-b from-ori-black/55 via-ori-black/65 to-ori-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_20%,rgba(201,243,29,0.07),transparent_55%)]" />
      </div>
      <div className="gradient-orb pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="gradient-orb-accent pointer-events-none absolute right-0 top-1/4 h-96 w-96 opacity-40" aria-hidden />
      <PageHero
        size="home"
        title="You Were Referred to Ori for a Reason"
        subtitle="Someone in your network thought you may benefit from funding or capital support."
        actions={
          <>
            {apply.kind === "external" ? (
              <Button
                href={apply.href}
                size="lg"
                className="min-w-[180px]"
                onClick={() => onCtaClick?.("hero_apply")}
              >
                Apply for Funding
              </Button>
            ) : (
              <Button
                to={apply.to}
                size="lg"
                className="min-w-[180px]"
                onClick={() => onCtaClick?.("hero_apply")}
              >
                Apply for Funding
              </Button>
            )}
            <Button
              to={qualifyPath}
              variant="secondary"
              size="lg"
              className="min-w-[180px]"
              onClick={() => onCtaClick?.("hero_prequal")}
            >
              Get Pre-Qualified
            </Button>
          </>
        }
        helper={
          <>
            Not sure where you stand?{" "}
            <Link
              to={surveyPath}
              onClick={() => onCtaClick?.("hero_survey")}
              className="text-ori-accent hover:underline"
            >
              Take the Funding Readiness Survey
            </Link>
          </>
        }
        className="relative z-10 flex min-h-0 flex-1 flex-col justify-center border-b border-ori-border/80 bg-transparent"
      />
    </div>
  );
}
