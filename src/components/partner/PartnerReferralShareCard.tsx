import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORI_EVENTS, trackOriEvent } from "../../lib/analytics/oriEvents";
import { ROUTES } from "../../utils/navigation";
import { referralApplyUrl, referralSolutionUrl } from "./referralLinks";

type SolutionKey = "consulting" | "management" | "funding_readiness";

const SOLUTION_ROWS: Array<{ solution: SolutionKey; label: string }> = [
  { solution: "consulting", label: "Consulting" },
  { solution: "management", label: "Management" },
  { solution: "funding_readiness", label: "Funding" },
];

export type PartnerReferralShareCardProps = {
  referralCode: string;
};

export function PartnerReferralShareCard({ referralCode }: PartnerReferralShareCardProps) {
  const [copied, setCopied] = useState<SolutionKey | "base" | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(null), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const base = referralApplyUrl(referralCode);

  return (
    <div className="h-full rounded-xl border border-ori-border bg-ori-surface-panel/90 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ring-1 ring-white/[0.04] sm:p-5">
      <h3 className="ori-type-subtitle text-ori-foreground">Referral &amp; sharing</h3>
      <p className="mt-1.5 text-sm leading-snug text-ori-text-secondary">
        Share tracked links so Ori can attribute introductions to your organization.
      </p>

      <div className="mt-4 space-y-2.5">
        <div className="flex flex-col gap-3 rounded-xl border border-ori-border/80 bg-ori-surface-base/50 p-4 ring-1 ring-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="ori-type-label text-ori-text-secondary">Default referral</p>
            <p className="mt-1 truncate text-xs text-ori-foreground" title={base}>
              {base}
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg border border-ori-border px-3 py-2 text-xs font-semibold text-ori-foreground transition-colors hover:border-ori-accent hover:text-ori-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent"
            onClick={() => {
              void navigator.clipboard.writeText(base);
              setCopied("base");
              trackOriEvent(ORI_EVENTS.PARTNER_COPY_REFERRAL_LINK_CLICKED, {});
            }}
          >
            {copied === "base" ? "Copied" : "Copy"}
          </button>
        </div>

        <ul className="divide-y divide-ori-border/50 overflow-hidden rounded-xl border border-ori-border/80 bg-ori-surface-base/40 ring-1 ring-white/[0.03]">
          {SOLUTION_ROWS.map(({ solution, label }) => (
            <li key={solution} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ori-foreground">{label}</p>
                <p className="mt-0.5 truncate text-xs text-ori-muted" title={referralSolutionUrl(referralCode, solution)}>
                  {referralSolutionUrl(referralCode, solution)}
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg border border-ori-border px-3 py-2 text-xs font-semibold text-ori-foreground transition-colors hover:border-ori-accent hover:text-ori-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent"
                onClick={() => {
                  void navigator.clipboard.writeText(referralSolutionUrl(referralCode, solution));
                  setCopied(solution);
                  trackOriEvent(ORI_EVENTS.PARTNER_COPY_REFERRAL_LINK_CLICKED, { solution });
                }}
              >
                {copied === solution ? "Copied" : "Copy link"}
              </button>
            </li>
          ))}
        </ul>

        <Link
          to={`${ROUTES.REFERRAL}?ref=${encodeURIComponent(referralCode)}&solution=funding_readiness`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-ori-accent hover:underline focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-ori-accent"
        >
          Preview funding referral page →
        </Link>
      </div>
    </div>
  );
}
