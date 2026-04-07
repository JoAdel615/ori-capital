import { Button } from "./Button";

interface FundingReadinessCrossSellCardProps {
  title: string;
  description: string;
  ctaLabel: string;
  to: string;
  className?: string;
}

/**
 * Compact cross-sell block (matches “Need … too?” pattern on funding readiness pages).
 */
export function FundingReadinessCrossSellCard({
  title,
  description,
  ctaLabel,
  to,
  className = "",
}: FundingReadinessCrossSellCardProps) {
  return (
    <div
      className={`w-full rounded-2xl border border-ori-border bg-ori-surface p-6 text-left shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] md:p-7 ${className}`.trim()}
    >
      <h3 className="font-display text-lg font-semibold text-ori-foreground md:text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ori-muted">{description}</p>
      <div className="mt-5 flex w-full justify-center">
        <Button to={to} variant="outline" size="lg" className="min-w-[180px]">
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
