import { describe, expect, it } from "vitest";
import { mailchimpSubscriberHash } from "./mailchimp.js";

describe("mailchimpSubscriberHash", () => {
  const exampleHash = "b58996c504c5638798eb6b511e6f49af";

  it("matches Mailchimp MD5 of lowercased email", () => {
    expect(mailchimpSubscriberHash("User@Example.COM")).toBe(exampleHash);
  });

  it("trims whitespace", () => {
    expect(mailchimpSubscriberHash("  user@example.com  ")).toBe(exampleHash);
  });
});
