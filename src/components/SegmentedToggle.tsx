/**
 * Segmented control for pricing (e.g. billing cadence).
 * On-brand: dark background, accent for active, clear inactive state.
 */

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedToggleProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className = "",
}: SegmentedToggleProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex max-w-full flex-wrap justify-center gap-1 rounded-lg border border-ori-border bg-ori-charcoal/80 p-1 ${className}`.trim()}
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-charcoal ${
              isActive
                ? "bg-ori-accent text-ori-black shadow-sm"
                : "text-ori-muted hover:text-ori-foreground hover:bg-ori-surface/50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
