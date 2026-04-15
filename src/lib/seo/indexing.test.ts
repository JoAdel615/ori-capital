import { describe, expect, it } from "vitest";
import { shouldNoIndexPath } from "./indexing";

describe("shouldNoIndexPath", () => {
  it("marks internal utility routes as noindex", () => {
    expect(shouldNoIndexPath("/admin")).toBe(true);
    expect(shouldNoIndexPath("/partner")).toBe(true);
  });

  it("keeps marketing routes indexable", () => {
    expect(shouldNoIndexPath("/")).toBe(false);
    expect(shouldNoIndexPath("/management")).toBe(false);
    expect(shouldNoIndexPath("/capital")).toBe(false);
  });
});
