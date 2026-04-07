import type { HTMLAttributes } from "react";
import { CONTAINER_MAX, CONTAINER_X } from "./rhythm";

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Override max width (e.g. max-w-3xl for narrow content) */
  maxWidth?: string;
  className?: string;
}

/**
 * Wraps page content with consistent max width and horizontal padding.
 * Default: max-w-6xl mx-auto px-6 lg:px-8
 */
export function PageContainer({
  children,
  maxWidth,
  className = "",
  ...props
}: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${maxWidth ?? CONTAINER_MAX} ${CONTAINER_X} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
