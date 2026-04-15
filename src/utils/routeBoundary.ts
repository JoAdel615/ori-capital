import { ROUTES } from "./navigation";

export type RouteSurface = "marketing" | "app";

/**
 * Explicit domain boundary policy:
 * - marketing: public browsing and lead capture
 * - app: authenticated operational surfaces
 */
const EXACT_ROUTE_SURFACE: Record<string, RouteSurface> = {
  [ROUTES.ADMIN]: "app",
  [ROUTES.PARTNER_PORTAL]: "app",
  [ROUTES.PARTNER_REGISTER]: "marketing",
};

export function routeSurfaceForPath(pathname: string): RouteSurface {
  const exact = EXACT_ROUTE_SURFACE[pathname];
  if (exact) return exact;

  // Treat nested admin/partner paths as app surfaces, while preserving
  // partner registration as a public marketing intake.
  if (pathname.startsWith(`${ROUTES.ADMIN}/`)) return "app";
  if (
    pathname.startsWith(`${ROUTES.PARTNER_PORTAL}/`) &&
    !pathname.startsWith(`${ROUTES.PARTNER_REGISTER}/`)
  ) {
    return "app";
  }
  return "marketing";
}

export function shouldRedirectToAppOrigin(pathname: string): boolean {
  return routeSurfaceForPath(pathname) === "app";
}
