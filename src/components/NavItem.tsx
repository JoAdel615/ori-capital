import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
  to: string;
  label: string;
  description: string;
  onClick?: () => void;
}

export function NavItem({ to, label, description, onClick }: NavItemProps) {
  const { pathname } = useLocation();
  const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`block rounded-lg px-4 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-charcoal ${
          isActive ? "bg-ori-surface border-l-2 border-ori-accent pl-[14px]" : "hover:bg-ori-surface border-l-2 border-transparent"
        }`}
      >
        <span className="font-semibold text-ori-foreground">{label}</span>
        <p className="mt-0.5 text-sm text-ori-muted">{description}</p>
      </Link>
    </li>
  );
}
