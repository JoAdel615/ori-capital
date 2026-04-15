import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { JsonLd } from "./JsonLd";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { RouteErrorBoundary } from "./ErrorBoundary";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { descriptionForPath } from "../lib/seo/routeDescriptions";
import { shouldNoIndexPath } from "../lib/seo/indexing";
import { titleSegmentForPath } from "../lib/seo/routeTitles";
import { CONTACT_ATTRIBUTION_PRIOR_ROUTE_KEY, ROUTES } from "../utils/navigation";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === ROUTES.CONTACT) return;
    try {
      sessionStorage.setItem(CONTACT_ATTRIBUTION_PRIOR_ROUTE_KEY, pathname);
    } catch {
      /* ignore */
    }
  }, [pathname]);
  const noIndex = shouldNoIndexPath(pathname);
  const titleSegment = titleSegmentForPath(pathname);
  useDocumentHead({
    titleSegment,
    description: descriptionForPath(pathname),
    canonicalPath: pathname,
    noIndex,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Nav />
      <main id="main" className="flex-1">
        <RouteErrorBoundary>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      {pathname !== ROUTES.HOME ? <Footer /> : null}
      <JsonLd />
    </div>
  );
}
