import { describe, expect, it } from "vitest";
import {
  BACKOFFICE_LEAD_COMPLETE,
  BACKOFFICE_LEAD_PIPELINE,
  leadPipelineSelectOptions,
} from "./leadStatuses";

describe("leadPipelineSelectOptions", () => {
  it("includes pipeline, Complete, and preserves unknown legacy status", () => {
    const opts = leadPipelineSelectOptions("None");
    expect(opts).toContain("None");
    expect(opts).toContain("Apply");
    expect(opts).toContain(BACKOFFICE_LEAD_COMPLETE);
    expect(opts.filter((x) => x === "Booked")).toHaveLength(0);
  });

  it("prepends legacy status when not in pipeline", () => {
    const opts = leadPipelineSelectOptions("Booked");
    expect(opts[0]).toBe("Booked");
    expect(opts).toEqual(expect.arrayContaining([...BACKOFFICE_LEAD_PIPELINE, BACKOFFICE_LEAD_COMPLETE]));
  });
});
