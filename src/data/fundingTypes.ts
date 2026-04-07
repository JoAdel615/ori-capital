/**
 * Funding types for the Funding page. Each has exactly 3 "Best for" bullets for uniform cards.
 */
export interface FundingTypeItem {
  title: string;
  badge: string;
  description: string;
  bestFor: [string, string, string];
  note?: string;
}

export const fundingTypes: FundingTypeItem[] = [
  {
    title: "Lines of Credit",
    badge: "Flexible",
    description: "Flexible access to working capital. Borrow what you need, when you need it.",
    bestFor: [
      "Managing seasonal revenue",
      "Handling unexpected expenses",
      "Smoothing cash flow gaps",
    ],
  },
  {
    title: "Term Loans",
    badge: "Predictable",
    description: "Structured financing with predictable payments.",
    bestFor: ["Hiring", "Expansion", "Major investments and stabilizing growth"],
  },
  {
    title: "Revenue-Based Financing",
    badge: "Flexible",
    description: "Repayments tied to your revenue performance.",
    bestFor: [
      "E-commerce and SaaS",
      "Businesses with predictable monthly revenue",
      "Growth without fixed monthly payments",
    ],
  },
  {
    title: "Working Capital Facilities",
    badge: "Fast",
    description: "Short-term funding designed to move quickly.",
    bestFor: [
      "Inventory purchases",
      "Contract fulfillment",
      "Bridging timing gaps",
    ],
  },
  {
    title: "Business Credit Cards",
    badge: "Starter-friendly",
    description: "Often overlooked, but powerful for day-to-day spend and building business credit.",
    bestFor: [
      "Building business credit",
      "Managing recurring expenses",
      "Earning rewards while preserving cash",
    ],
  },
  {
    title: "Equipment & Asset Financing",
    badge: "Predictable",
    description: "Fund vehicles, equipment, or high-value tools tied to revenue.",
    bestFor: [
      "Equipment and vehicles",
      "High-value assets tied to revenue",
      "Spreading cost over useful life",
    ],
  },
  {
    title: "Startup-Friendly Options",
    badge: "Startup-friendly",
    description: "Financing designed for new businesses that may not yet fit traditional bank criteria.",
    bestFor: [
      "New businesses building traction",
      "Teams with limited credit history",
      "Founders seeking flexible early runway",
    ],
  },
  {
    title: "Contract / Invoice Funding",
    badge: "Flexible",
    description: "Invoice factoring and contract-based financing for service businesses.",
    bestFor: [
      "Freelancers and contractors",
      "Agencies with client invoices",
      "Project-based businesses waiting on payments",
    ],
  },
  {
    title: "Credit Builder Options",
    badge: "Starter-friendly",
    description: "Secured cards and starter products to establish or strengthen business credit.",
    bestFor: [
      "Founders establishing business credit",
      "New LLCs building profile",
      "Operators improving terms over time",
    ],
  },
];
