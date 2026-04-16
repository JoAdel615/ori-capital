import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Drawer } from "./Drawer";
import { LoginModal } from "./LoginModal";
import { ThemeToggle } from "./ThemeToggle";
import { ROUTES } from "../utils/navigation";

const desktopNav = [
  { to: ROUTES.CONSULTING, label: "Collaboration" },
  { to: ROUTES.MANAGEMENT, label: "Management" },
  { to: ROUTES.CAPITAL, label: "Funding" },
  { to: ROUTES.PARTNERS, label: "Partners" },
] as const;

function drawerExploreClass({ isActive }: { isActive: boolean }) {
  return `block rounded-lg px-3 py-2.5 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-charcoal ${
    isActive ? "border-l-2 border-ori-accent bg-ori-surface pl-[10px] text-ori-accent" : "border-l-2 border-transparent text-ori-foreground hover:bg-ori-surface"
  }`;
}

export function Nav() {
  const location = useLocation();
  const partnerPortalChrome =
    location.pathname === ROUTES.PARTNER_PORTAL || location.pathname.startsWith(`${ROUTES.PARTNER_PORTAL}/`);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ori-border bg-ori-black/90 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-4 pr-6 sm:px-6 sm:pr-8 lg:px-8 lg:pr-12"
        aria-label="Main navigation"
      >
        <Link to={ROUTES.HOME} className="flex shrink-0 items-center gap-3 font-display text-xl font-bold text-ori-foreground">
          <img src="/ori-crown-logo.png" alt="" className="h-8 w-8 object-contain" width={32} height={32} />
          <span>Ori Holdings</span>
        </Link>

        {!partnerPortalChrome ? (
          <div className="hidden items-center gap-5 lg:flex">
            {desktopNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-semibold text-ori-foreground transition-colors hover:text-ori-accent"
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
          {!partnerPortalChrome ? (
            <Link
              to={ROUTES.CONTACT}
              className="hidden shrink-0 rounded-xl bg-ori-accent px-5 py-2.5 text-sm font-semibold text-ori-black hover:bg-ori-accent-dim md:inline-block"
            >
              Get Started
            </Link>
          ) : null}
          <ThemeToggle />
          <button
            type="button"
            className="shrink-0 rounded-lg p-2.5 text-ori-foreground hover:bg-ori-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent"
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
        <div className="flex h-full flex-col overflow-y-auto">
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
          <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 pb-8">
            <section aria-label="Primary destinations">
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-ori-muted">Explore</p>
              <ul className="space-y-1">
                {desktopNav.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} className={drawerExploreClass} onClick={closeDrawer}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <NavLink
                to={ROUTES.CONTACT}
                className="mt-3 block rounded-lg bg-ori-accent px-3 py-2.5 text-center text-sm font-semibold text-ori-black transition-colors hover:bg-ori-accent-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-charcoal md:hidden"
                onClick={closeDrawer}
              >
                Get Started
              </NavLink>
            </section>
          </div>
        </div>
      </Drawer>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
}
