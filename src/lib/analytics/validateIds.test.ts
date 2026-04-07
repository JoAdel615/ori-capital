import { describe, expect, it } from "vitest";
import { isValidGaMeasurementId, isValidMetaPixelId } from "./validateIds";

describe("validateIds", () => {
  it("accepts GA4-style measurement IDs", () => {
    expect(isValidGaMeasurementId("G-ABC123XYZ")).toBe(true);
    expect(isValidGaMeasurementId("g-abc12")).toBe(true);
    expect(isValidGaMeasurementId("UA-123")).toBe(false);
    expect(isValidGaMeasurementId("")).toBe(false);
  });

  it("accepts numeric Meta pixel IDs", () => {
    expect(isValidMetaPixelId("123456789012345")).toBe(true);
    expect(isValidMetaPixelId("123")).toBe(false);
    expect(isValidMetaPixelId("abc")).toBe(false);
  });
});
