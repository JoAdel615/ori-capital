import { describe, expect, it } from "vitest";
import { ROUTE_TITLES, titleSegmentForPath } from "./routeTitles";

describe("route title metadata", () => {
  it("includes title segments for canonical routes", () => {
    expect(ROUTE_TITLES["/tools"]).toBe("Tools");
    expect(ROUTE_TITLES["/services"]).toBe("Services");
    expect(ROUTE_TITLES["/capital"]).toBe("Funding");
    expect(ROUTE_TITLES["/funding-readiness-survey"]).toBe("Funding Readiness Survey");
  });

  it("maps dynamic insights routes to Insights title", () => {
    expect(titleSegmentForPath("/insights/how-to-prepare")).toBe("Insights");
  });

  it("returns undefined for unknown paths", () => {
    expect(titleSegmentForPath("/unknown")).toBeUndefined();
  });
});
