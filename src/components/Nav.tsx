import { useState } from "react";
import { Link } from "react-router-dom";
import { Drawer } from "./Drawer";
import { LoginModal } from "./LoginModal";
import { NavItem } from "./NavItem";
import { NavMenuAction } from "./NavMenuAction";
import { ThemeToggle } from "./ThemeToggle";
import { ROUTES } from "../utils/navigation";

const navItems = [
  { to: ROUTES.HOME, label: "Home", description: "Overview of Ori and how funding works" },
  {
    to: ROUTES.APPLY,
    label: "Apply for Funding",
    description: "Start the funding application",
  },
  {
    to: ROUTES.PARTNERS,
    label: "Partner With Ori",
    description: "For advisors, networks, and service providers",
  },
  { to: ROUTES.FUNDING_READINESS, label: "Funding Readiness", description: "Prepare your profile before applying" },
  { to: ROUTES.INSIGHTS, label: "Insights", description: "Founder-first funding education" },
  { to: ROUTES.ABOUT, label: "About", description: "The story and vision behind Ori" },
  { to: ROUTES.CONTACT, label: "Contact", description: "Reach the team" },
];

export function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);
  const openLogin = () => {
    closeDrawer();
    setLoginOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ori-border bg-ori-black/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-4 pr-6 sm:px-6 sm:pr-8 lg:px-8 lg:pr-12" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-3 font-display text-xl font-bold text-ori-foreground shrink-0">
          <img src="/ori-crown-logo.png" alt="Ori Capital" className="h-8 w-8 object-contain" />
          <span>Ori Capital</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0 min-w-0">
          <Link
            to={ROUTES.APPLY}
            className="hidden rounded-xl bg-ori-accent px-5 py-2.5 text-sm font-semibold text-ori-black hover:bg-ori-accent-dim md:inline-block shrink-0"
          >
            Apply for Funding
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="rounded-lg p-2.5 shrink-0 text-ori-foreground hover:bg-ori-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent"
            aria-expanded={drawerOpen}
            aria-controls="nav-drawer"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            onClick={() => setDrawerOpen(true)}
          >
            {drawerOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <Drawer open={drawerOpen} onClose={closeDrawer} variant="full" id="nav-drawer">
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between gap-2 border-b border-ori-border p-4">
            <span className="font-display text-lg font-bold text-ori-foreground">Menu</span>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button
                type="button"
                onClick={closeDrawer}
                className="rounded p-2 text-ori-muted hover:text-ori-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <ul className="flex-1 space-y-1 px-4 py-4 pb-8">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                description={item.description}
                onClick={closeDrawer}
              />
            ))}
            <NavMenuAction
              label="Login"
              description="Partner portal or admin"
              onClick={openLogin}
            />
          </ul>
        </div>
      </Drawer>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
}
