/**
 * Pricing tier card for Funding Readiness Accelerator.
 * Supports primary price, optional secondary line (e.g. duration), badge, benefits list, descriptor, CTA.
 */
interface PricingTierCardProps {
  title: string;
  pricePrimary: string;
  durationNote: string;
  includes: string[];
  footerLine: string;
  cta: React.ReactNode;
  highlighted?: boolean;
  badge?: string;
}

export function PricingTierCard({
  title,
  pricePrimary,
  durationNote,
  includes,
  footerLine,
  cta,
  highlighted = false,
  badge,
}: PricingTierCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-xl border p-6 transition-all duration-200 md:p-7 ${
        highlighted
          ? "border-ori-accent/50 bg-ori-surface shadow-[0_0_32px_rgba(201,243,29,0.08)]"
          : "border-ori-border bg-ori-surface hover:border-ori-accent/30 hover:shadow-[0_0_24px_rgba(201,243,29,0.05)]"
      }`}
    >
      {badge && (
        <span className="absolute right-5 top-5 rounded-full border border-ori-accent/40 bg-ori-accent/10 px-2.5 py-0.5 text-xs font-medium text-ori-accent">
          {badge}
        </span>
      )}
      <h3 className="font-display text-xl font-semibold text-ori-foreground pr-20">{title}</h3>
      <p className="mt-3 text-2xl font-bold text-ori-accent">{pricePrimary}</p>
      <p className="mt-1 text-sm text-ori-muted">{durationNote}</p>
      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-ori-muted">
        Includes
      </p>
      <ul className="mt-2 flex-1 space-y-2.5 text-sm text-ori-foreground">
        {includes.map((item, idx) => {
          const isPrefix =
            item.startsWith("Everything in") && (item.includes("plus") || item.includes("Plus"));
          const segments = item.split("\n").map((s) => s.trim()).filter(Boolean);
          const [lead, ...rest] = segments;
          const detail = rest.join(" ");
          const hasStackedLines = !isPrefix && segments.length > 1;
          return (
            <li key={`${idx}-${lead}`} className={isPrefix ? "pb-1" : "flex items-start gap-2"}>
              {isPrefix ? (
                <span className="font-semibold text-ori-accent">{item}</span>
              ) : (
                <>
                  <span className="text-ori-accent shrink-0 pt-0.5">✓</span>
                  {hasStackedLines ? (
                    <span className="min-w-0">
                      <span className="block font-semibold text-ori-foreground">{lead}</span>
                      {detail ? (
                        <span className="mt-0.5 block text-sm leading-relaxed text-ori-muted">{detail}</span>
                      ) : null}
                    </span>
                  ) : (
                    <span>{item}</span>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-6 pt-4 border-t border-ori-border text-sm text-ori-muted">{footerLine}</p>
      <div className="mt-5 flex w-full justify-center">{cta}</div>
    </div>
  );
}
