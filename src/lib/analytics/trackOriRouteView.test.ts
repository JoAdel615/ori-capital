import { afterEach, describe, expect, it, vi } from "vitest";
import { ORI_EVENTS } from "./oriEvents";
import { trackOriRouteView } from "./trackOriRouteView";

const trackSpy = vi.fn();

vi.mock("./oriEvents", async () => {
  const actual = await vi.importActual<typeof import("./oriEvents")>("./oriEvents");
  return {
    ...actual,
    trackOriEvent: (eventName: string, params?: Record<string, unknown>) =>
      trackSpy(eventName, params),
  };
});

describe("trackOriRouteView", () => {
  afterEach(() => {
    trackSpy.mockReset();
  });

  it("fires pillar events for hub paths", () => {
    trackOriRouteView("/management");
    expect(trackSpy).toHaveBeenCalledWith(ORI_EVENTS.VIEW_PILLAR_MANAGEMENT, undefined);

    trackOriRouteView("/consulting");
    expect(trackSpy).toHaveBeenCalledWith(ORI_EVENTS.VIEW_PILLAR_CONSULTING, undefined);
  });

  it("includes path for management modules", () => {
    trackOriRouteView("/management/formation");
    expect(trackSpy).toHaveBeenCalledWith(ORI_EVENTS.VIEW_MANAGEMENT_MODULE, {
      path: "/management/formation",
    });
  });
});
