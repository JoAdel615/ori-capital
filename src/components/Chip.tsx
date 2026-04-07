/**
 * Small badge/chip for labels like "48-hour decisions", "Founder-first", "Coming Soon".
 */
interface ChipProps {
  children: React.ReactNode;
  variant?: "accent" | "muted";
  className?: string;
}

export function Chip({ children, variant = "muted", className = "" }: ChipProps) {
  return (
    <span
      className={`chip ${variant === "accent" ? "chip-accent" : "chip-muted"} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
