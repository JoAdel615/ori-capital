import { describe, expect, it } from "vitest";
import { FailureRateLimiter } from "./loginRateLimit.js";

describe("FailureRateLimiter", () => {
  it("blocks after max failures in window", () => {
    const l = new FailureRateLimiter(3, 60_000);
    expect(l.isAllowed("ip")).toBe(true);
    l.recordFailure("ip");
    expect(l.isAllowed("ip")).toBe(true);
    l.recordFailure("ip");
    l.recordFailure("ip");
    expect(l.isAllowed("ip")).toBe(false);
  });

  it("reset clears failures", () => {
    const l = new FailureRateLimiter(1, 60_000);
    l.recordFailure("x");
    expect(l.isAllowed("x")).toBe(false);
    l.reset("x");
    expect(l.isAllowed("x")).toBe(true);
  });
});
