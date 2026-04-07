/**
 * Standard card container: border, background, radius, padding.
 * Use for form blocks, unlock cards, and content panels.
 */

import type { HTMLAttributes } from "react";

interface CardShellProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** default: standard padding; compact: less padding */
  padding?: "default" | "compact";
  /** optional accent ring (e.g. for unlock / focus cards) */
  accentRing?: boolean;
}

export function CardShell({
  children,
  padding = "default",
  accentRing = false,
  className = "",
  ...props
}: CardShellProps) {
  const padClass =
    padding === "compact"
      ? "p-3 sm:p-4"
      : "p-4 md:p-6";
  return (
    <div
      className={`rounded-xl border border-ori-border bg-ori-surface ${padClass} ${
        accentRing ? "ring-1 ring-ori-accent/15" : ""
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
