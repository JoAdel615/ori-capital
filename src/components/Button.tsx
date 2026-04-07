import { forwardRef, type ButtonHTMLAttributes, type MouseEventHandler } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  to?: string;
  /** For `to` / `href` links (e.g. open in a new tab). */
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ori-accent text-ori-black hover:bg-ori-accent-dim focus-visible:ring-ori-accent btn-lift btn-lift-primary",
  secondary:
    "bg-ori-surface text-ori-foreground border border-ori-border hover:border-ori-muted btn-lift",
  ghost: "text-ori-foreground hover:bg-ori-surface",
  outline:
    "border border-ori-accent text-ori-accent hover:bg-ori-glow focus-visible:ring-ori-accent btn-lift btn-lift-outline",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      href,
      to,
      target,
      rel,
      children,
      ...props
    },
    ref
  ) => {
    const { onClick, ...rest } = props;
    const base =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ori-black disabled:opacity-50 disabled:pointer-events-none";
    const combined = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

    const anchorClick = onClick as MouseEventHandler<HTMLAnchorElement> | undefined;
    if (to) {
      return (
        <Link to={to} className={combined} onClick={anchorClick} target={target} rel={rel}>
          {children}
        </Link>
      );
    }
    if (href) {
      const defaultTarget = href.startsWith("http") ? "_blank" : undefined;
      const defaultRel = href.startsWith("http") ? "noopener noreferrer" : undefined;
      return (
        <a
          href={href}
          className={combined}
          target={target ?? defaultTarget}
          rel={rel ?? defaultRel}
          onClick={anchorClick}
        >
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} type={rest.type ?? "button"} className={combined} {...rest} onClick={onClick}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
