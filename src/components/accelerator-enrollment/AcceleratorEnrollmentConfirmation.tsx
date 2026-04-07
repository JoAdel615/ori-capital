/**
 * Post-submission confirmation for Funding Readiness Accelerator enrollment.
 */

interface AcceleratorEnrollmentConfirmationProps {
  className?: string;
}

export function AcceleratorEnrollmentConfirmation({ className = "" }: AcceleratorEnrollmentConfirmationProps) {
  return (
    <div className={`text-center ${className}`.trim()}>
      <h2 className="font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl">
        You're In. Welcome to the Funding Readiness Accelerator.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-ori-muted leading-relaxed">
        Check your email for instructions to create your account and begin onboarding.
      </p>
    </div>
  );
}
