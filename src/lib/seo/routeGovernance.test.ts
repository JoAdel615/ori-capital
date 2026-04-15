import { describe, expect, it } from "vitest";
import { CANONICAL_ROUTES } from "./canonicalRoutes";
import { shouldNoIndexPath } from "./indexing";
import { descriptionForPath } from "./routeDescriptions";
import { ROUTE_TITLES, titleSegmentForPath } from "./routeTitles";

describe("route governance", () => {
  it("ensures every canonical route has title metadata or explicit home-title behavior", () => {
    for (const path of CANONICAL_ROUTES) {
      const title = titleSegmentForPath(path);
      if (path === "/") {
        expect(title ?? "").toBe("");
      } else {
        expect(title).toBeTruthy();
      }
    }
  });

  it("ensures every canonical route has route description coverage", () => {
    const fallback = descriptionForPath("/__unknown__");
    for (const path of CANONICAL_ROUTES) {
      const desc = descriptionForPath(path);
      expect(desc).toBeTruthy();
      expect(desc).not.toBe(fallback);
    }
  });

  it("keeps noindex policy constrained to approved utility routes", () => {
    const noIndexRoutes = CANONICAL_ROUTES.filter((path) => shouldNoIndexPath(path));
    expect(noIndexRoutes.sort()).toEqual(["/admin", "/partner"]);
  });

  it("title map keys and canonical routes stay in sync (except dynamic insights fallback)", () => {
    const titleKeys = Object.keys(ROUTE_TITLES);
    for (const path of CANONICAL_ROUTES) {
      if (path === "/") continue;
      expect(titleKeys).toContain(path);
    }
  });
});
