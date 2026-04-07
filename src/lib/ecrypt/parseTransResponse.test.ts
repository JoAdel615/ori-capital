import { describe, expect, it } from "vitest";
import { isGatewayApproved, parseTransResponse } from "./parseTransResponse";

describe("parseTransResponse", () => {
  it("parses a typical approved body", () => {
    const p = parseTransResponse("response=1&responsetext=Approved&transactionid=123&authcode=ABC");
    expect(p.response).toBe("1");
    expect(p.responsetext).toBe("Approved");
    expect(p.transactionid).toBe("123");
    expect(isGatewayApproved(p)).toBe(true);
  });

  it("treats non-1 response as not approved", () => {
    const p = parseTransResponse("response=2&responsetext=Declined");
    expect(isGatewayApproved(p)).toBe(false);
  });
});
