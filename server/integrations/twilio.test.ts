import { describe, expect, it } from "vitest";
import { normalizePhoneToE164 } from "./twilio.js";

describe("normalizePhoneToE164", () => {
  it("formats 10-digit US", () => {
    expect(normalizePhoneToE164("5551234567")).toBe("+15551234567");
  });

  it("formats 11-digit US with leading 1", () => {
    expect(normalizePhoneToE164("1-555-123-4567")).toBe("+15551234567");
  });

  it("passes through valid +E.164", () => {
    expect(normalizePhoneToE164("+44 20 7946 0958")).toBe("+442079460958");
  });

  it("returns null for empty", () => {
    expect(normalizePhoneToE164("")).toBeNull();
    expect(normalizePhoneToE164("   ")).toBeNull();
  });
});
