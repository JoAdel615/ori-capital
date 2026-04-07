import type { HTMLAttributes } from "react";
import { SectionHeader } from "./ui/SectionHeader";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  /** Optional eyebrow (small uppercase label) */
  eyebrow?: string;
  containerClass?: string;
  /** default: standard padding; tight: less padding; hero: larger top/bottom */
  variant?: "default" | "tight" | "hero";
}

const variantClasses = {
  default: "ori-section",
  tight: "ori-section-tight",
  hero: "ori-section-hero",
};

export function Section({
  children,
  title,
  subtitle,
  eyebrow,
  containerClass = "",
  className = "",
  variant = "default",
  ...props
}: SectionProps) {
  return (
    <section
      className={`${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      <div className={`ori-container ${containerClass}`.trim()}>
        {title && (
          <SectionHeader
            title={title}
            subtitle={subtitle}
            eyebrow={eyebrow}
            align="center"
            size={variant === "hero" ? "lg" : "md"}
            className="mb-10 md:mb-14"
          />
        )}
        {children}
      </div>
    </section>
  );
}
