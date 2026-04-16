import { ORI_EVENTS, trackOriEvent } from "./oriEvents";

/**
 * Map SPA pathnames to lifecycle / pillar view events (once per navigation).
 */
export function trackOriRouteView(pathname: string): void {
  switch (pathname) {
    case "/tools":
      trackOriEvent(ORI_EVENTS.VIEW_PILLAR_MANAGEMENT);
      return;
    case "/services":
      trackOriEvent(ORI_EVENTS.VIEW_PILLAR_CONSULTING);
      return;
    case "/capital":
    case "/capital/leverage":
      trackOriEvent(ORI_EVENTS.VIEW_PILLAR_CAPITAL);
      return;
    case "/funding-readiness-survey":
      trackOriEvent(ORI_EVENTS.VIEW_GET_STARTED);
      return;
    case "/apply":
      trackOriEvent(ORI_EVENTS.VIEW_APPLY);
      return;
    default:
      break;
  }

  if (pathname.startsWith("/tools/")) {
    trackOriEvent(ORI_EVENTS.VIEW_MANAGEMENT_MODULE, { path: pathname });
    return;
  }

  if (
    pathname === "/services/coaching" ||
    pathname === "/services/structuring" ||
    pathname === "/services/capital-strategy" ||
    pathname === "/services/product-development" ||
    pathname === "/services/book" ||
    pathname.startsWith("/services/lifecycle/")
  ) {
    trackOriEvent(ORI_EVENTS.VIEW_CONSULTING_OFFER, { path: pathname });
  }
}
