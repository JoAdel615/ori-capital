import { describe, expect, it } from "vitest";
import { ROUTES } from "./navigation";
import { routeSurfaceForPath, shouldRedirectToAppOrigin } from "./routeBoundary";

describe("route boundary policy", () => {
  it("routes admin and partner portal surfaces to app", () => {
    expect(routeSurfaceForPath(ROUTES.ADMIN)).toBe("app");
    expect(routeSurfaceForPath(ROUTES.PARTNER_PORTAL)).toBe("app");
    expect(routeSurfaceForPath("/partner/clients")).toBe("app");
  });

  it("keeps partner registration as marketing surface", () => {
    expect(routeSurfaceForPath(ROUTES.PARTNER_REGISTER)).toBe("marketing");
    expect(shouldRedirectToAppOrigin(ROUTES.PARTNER_REGISTER)).toBe(false);
  });

  it("keeps unrelated pages on marketing surface", () => {
    expect(routeSurfaceForPath(ROUTES.HOME)).toBe("marketing");
    expect(routeSurfaceForPath(ROUTES.CONTACT)).toBe("marketing");
  });
});
