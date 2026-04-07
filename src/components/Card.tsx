import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "bordered";
}

const variantClasses = {
  default: "bg-ori-surface card-hover",
  elevated: "bg-ori-surface shadow-xl shadow-black/20 card-hover",
  bordered: "bg-ori-surface border border-ori-border card-hover",
};

export function Card({
  children,
  variant = "default",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl p-6 ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
