/**
 * Uniform card for a funding product: title, description, exactly 3 "Best for" bullets, optional note.
 * Badge/pill sits in lower-right meta row with a divider for consistent height across grid.
 */
interface FundingTypeCardProps {
  title: string;
  description: string;
  bestFor: [string, string, string];
  note?: string;
  badge?: string;
}

export function FundingTypeCard({ title, description, bestFor, note, badge }: FundingTypeCardProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-ori-border bg-ori-surface transition-all duration-200 hover:border-ori-accent/40 hover:shadow-[0_0_24px_rgba(201,243,29,0.06)] hover:-translate-y-0.5">
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-semibold text-ori-foreground leading-snug mt-1">
          {title}
        </h3>
        <p className="mt-3 text-sm text-ori-muted leading-relaxed">{description}</p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ori-muted">
          Best for:
        </p>
        <ul className="mt-1.5 space-y-1.5 text-sm text-ori-foreground">
          {bestFor.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-ori-accent mt-0.5 shrink-0">•</span>
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
        {note && (
          <p className="mt-4 text-xs text-ori-muted leading-relaxed pt-2">
            {note}
          </p>
        )}
      </div>
      <div className="border-t border-ori-border mt-auto" aria-hidden />
      <div className="flex items-center justify-end px-6 py-3">
        {badge ? <span className="chip chip-accent text-xs">{badge}</span> : <span />}
      </div>
    </div>
  );
}
