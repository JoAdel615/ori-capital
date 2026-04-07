import type { HTMLAttributes } from "react";
import { PageContainer } from "./PageContainer";
import { SECTION_Y, SECTION_Y_LOOSE, SECTION_Y_TIGHT } from "./rhythm";

interface PageSectionProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /** tight: less padding; normal: default; loose: more (e.g. hero areas) */
  variant?: "tight" | "normal" | "loose";
  /** If true, content is wrapped in PageContainer */
  container?: boolean;
  containerClass?: string;
  className?: string;
}

const variantClasses = {
  tight: SECTION_Y_TIGHT,
  normal: SECTION_Y,
  loose: SECTION_Y_LOOSE,
};

/**
 * Standard section wrapper with consistent vertical padding.
 * Use everywhere instead of ad-hoc py values.
 */
export function PageSection({
  children,
  variant = "normal",
  container = true,
  containerClass = "",
  className = "",
  ...props
}: PageSectionProps) {
  const content = container ? (
    <PageContainer className={containerClass}>{children}</PageContainer>
  ) : (
    children
  );
  return (
    <section
      className={`${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {content}
    </section>
  );
}
