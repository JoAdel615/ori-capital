import { describe, it, expect } from "vitest";
import { calculateReadiness } from "./scoring";
import type { ReadinessAnswers } from "./types";

describe("calculateReadiness", () => {
  it("strong candidate: high score, Funding-Ready tier, Traditional Lending zone when credit 700+", () => {
    const answers: ReadinessAnswers = {
      revenue_status: "Yes",
      time_in_business: "2+ years",
      monthly_revenue: "$50–250k",
      revenue_consistency: "Consistent",
      credit_range: "750+",
      delinquencies_12mo: "No",
      utilization: "<30%",
      business_debt: "Light",
      obligations_cover: "Yes",
      collateral: ["Receivables", "Inventory"],
      registered_good_standing: "Yes",
      ein_and_bank: "Yes",
      business_credit_file: "Yes",
      financials_ready: "Yes (P&L + balance sheet)",
      funding_purpose: "Expansion",
      amount: "$100–500k",
    };
    const result = calculateReadiness(answers);
    expect(result.score).toBeGreaterThanOrEqual(65);
    expect(result.tier).toMatch(/Strong Candidate|Funding-Ready/);
    expect(result.zone).toBe("Traditional Lending");
    expect(result.signals.strengths).toHaveLength(3);
    expect(result.signals.improvements).toHaveLength(3);
  });

  it("low credit cap: credit Below 600 caps score at 72 and zone is not Traditional Lending", () => {
    const answers: ReadinessAnswers = {
      revenue_status: "Yes",
      time_in_business: "2+ years",
      monthly_revenue: "$50–250k",
      revenue_consistency: "Consistent",
      credit_range: "Below 600",
      delinquencies_12mo: "No",
      utilization: "<30%",
      business_debt: "None",
      obligations_cover: "Yes",
      collateral: ["Equipment"],
      registered_good_standing: "Yes",
      ein_and_bank: "Yes",
      business_credit_file: "Yes",
      financials_ready: "Yes (P&L + balance sheet)",
      funding_purpose: "Working capital",
      amount: "$25–100k",
    };
    const result = calculateReadiness(answers);
    expect(result.score).toBeLessThanOrEqual(72);
    expect(result.zone).not.toBe("Traditional Lending");
    expect(result.overridesApplied.some((o) => o.includes("72") || o.includes("credit"))).toBe(true);
  });

  it("heavy debt cap: Heavy debt + cannot cover caps score at 64", () => {
    const answers: ReadinessAnswers = {
      revenue_status: "Yes",
      time_in_business: "1–2 years",
      monthly_revenue: "$10–50k",
      revenue_consistency: "Seasonal",
      credit_range: "700–749",
      delinquencies_12mo: "No",
      utilization: "30–60%",
      business_debt: "Heavy",
      obligations_cover: "No",
      collateral: ["None"],
      registered_good_standing: "Yes",
      ein_and_bank: "Yes",
      business_credit_file: "Minimal",
      financials_ready: "Somewhat",
      funding_purpose: "Refinance",
      amount: "$100–500k",
    };
    const result = calculateReadiness(answers);
    expect(result.score).toBeLessThanOrEqual(64);
    expect(result.overridesApplied.some((o) => o.includes("64") || o.includes("heavy"))).toBe(true);
  });

  it("pre-revenue: zone is Equity / Grants / Competitions", () => {
    const answers: ReadinessAnswers = {
      revenue_status: "Pre-revenue",
      time_in_business: "Not launched",
      monthly_revenue: "$0",
      revenue_consistency: "Highly inconsistent",
      credit_range: "700–749",
      delinquencies_12mo: "No",
      utilization: "<30%",
      business_debt: "None",
      obligations_cover: "Yes",
      collateral: ["None"],
      registered_good_standing: "In progress",
      ein_and_bank: "Partial",
      business_credit_file: "No",
      financials_ready: "No",
      funding_purpose: "Hiring",
      amount: "< $25k",
      open_to_equity: "Yes",
    };
    const result = calculateReadiness(answers);
    expect(result.zone).toBe("Equity / Grants / Competitions");
    expect(result.tier).not.toBe("Strong Candidate");
  });

  it("returns exactly 3 strengths and 3 improvements", () => {
    const answers: ReadinessAnswers = {
      revenue_status: "Yes",
      time_in_business: "6–12 months",
      monthly_revenue: "$1–10k",
      revenue_consistency: "Consistent",
      credit_range: "650–699",
      delinquencies_12mo: "No",
      utilization: "30–60%",
      business_debt: "Light",
      obligations_cover: "Yes",
      collateral: ["Receivables"],
      registered_good_standing: "Yes",
      ein_and_bank: "Yes",
      business_credit_file: "Minimal",
      financials_ready: "Somewhat",
      funding_purpose: "Working capital",
      amount: "$25–100k",
    };
    const result = calculateReadiness(answers);
    expect(result.signals.strengths).toHaveLength(3);
    expect(result.signals.improvements).toHaveLength(3);
  });
});
