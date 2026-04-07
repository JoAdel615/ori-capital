interface FormStepProps {
  title: string;
  stepLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormStep({ title, stepLabel, children, className = "" }: FormStepProps) {
  return (
    <div className={`space-y-2 ${className}`.trim()}>
      {stepLabel && (
        <p className="text-sm font-medium text-ori-accent">{stepLabel}</p>
      )}
      <h3 className="font-display text-base font-semibold text-ori-foreground">{title}</h3>
      {children}
    </div>
  );
}
