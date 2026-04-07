export type SpectrumSide = "left" | "center" | "right";

export interface FundingGapNode {
  id: string;
  title: string;
  /** Short label for mobile chips */
  chipLabel: string;
  side: SpectrumSide;
  /** e.g. "Step 1" on arms; center uses "Center" */
  tierLabel: string;
  description: string;
  bestFor: string;
  tradeoffs: string;
}

/**
 * Left → right: lending / control (Advanced Debt … F&F loan) · Bootstrapping · investment / growth (F&F equity … PE).
 */
export const FUNDING_GAP_NODES: FundingGapNode[] = [
  {
    id: "advanced-debt",
    title: "Advanced Debt",
    chipLabel: "Adv. debt",
    side: "left",
    tierLabel: "Step 5",
    description:
      "Sophisticated senior, unitranche, or mezzanine-style facilities—often for larger or more mature businesses with strong reporting.",
    bestFor: "Stable cash flows, experienced finance teams, and operators comfortable with covenants and structured terms.",
    tradeoffs: "Heavy diligence, legal cost, and less flexibility than simpler credit—misalignment on leverage can bite quickly.",
  },
  {
    id: "bank-loan",
    title: "Bank Loan",
    chipLabel: "Bank loan",
    side: "left",
    tierLabel: "Step 4",
    description:
      "Traditional amortizing loans from banks—predictable schedules for equipment, working capital, or expansion when you qualify.",
    bestFor: "Documented revenue, strong credit, and a clear use of funds with modeled repayment capacity.",
    tradeoffs: "Underwriting can be slow and conservative; declines are common when the file isn’t lender-ready.",
  },
  {
    id: "lines-of-credit",
    title: "Lines of Credit",
    chipLabel: "LOC",
    side: "left",
    tierLabel: "Step 3",
    description:
      "A revolving limit to draw and repay as cash needs change—classic tool for working capital and short bridges.",
    bestFor: "Seasonal swings, inventory builds, and businesses with visible inflows and disciplined draw discipline.",
    tradeoffs: "Renewals and fees; availability can shrink if performance weakens or covenants tighten.",
  },
  {
    id: "business-credit",
    title: "Business Credit",
    chipLabel: "Biz credit",
    side: "left",
    tierLabel: "Step 2",
    description:
      "Business-name cards and similar products for operating spend—speed and convenience when used responsibly.",
    bestFor: "Smoothing small gaps, travel, and expenses you can pay down on a predictable rhythm.",
    tradeoffs: "Higher cost if balances revolve; personal guarantees are common at smaller scales.",
  },
  {
    id: "ff-loan",
    title: "Friends & Family (Loan)",
    chipLabel: "F&F loan",
    side: "left",
    tierLabel: "Step 1",
    description:
      "Informal loans from people who know you—often more flexible than institutions if terms are clear and documented.",
    bestFor: "Very early needs, small checks, and founders who can separate relationship from repayment expectations.",
    tradeoffs: "Ambiguous terms can damage trust; mixing personal and business finances without clarity is risky.",
  },
  {
    id: "bootstrap",
    title: "Bootstrapping",
    chipLabel: "Bootstrap",
    side: "center",
    tierLabel: "Center",
    description:
      "Funding growth from revenue, founder savings, and tight spend—maximum independence, typically slower scale.",
    bestFor: "Profitable or fast-payback models and founders who want control without outside mandates.",
    tradeoffs: "Runway and speed limits; capital-intensive or winner-take-all markets may outpace organic cash.",
  },
  {
    id: "ff-equity",
    title: "Friends & Family (Equity)",
    chipLabel: "F&F equity",
    side: "right",
    tierLabel: "Step 1",
    description:
      "Selling a small stake to people close to you—aligns upside but blends family dynamics with ownership and governance.",
    bestFor: "Very early believers and founders preparing for a cleaner priced round later with basic documentation.",
    tradeoffs: "Informal valuations and messy cap tables create expensive legal clean-up if terms weren’t crisp.",
  },
  {
    id: "angel",
    title: "Angel Investors",
    chipLabel: "Angels",
    side: "right",
    tierLabel: "Step 2",
    description:
      "Individual checks, often with advice and introductions—the bridge between bootstrap and institutional seed funds.",
    bestFor: "A crisp narrative, early proof, and a founder who can run a tight diligence and closing process.",
    tradeoffs: "Many small checks without a lead can fragment the cap table and complicate future rounds.",
  },
  {
    id: "seed-funding",
    title: "Seed Funding",
    chipLabel: "Seed",
    side: "right",
    tierLabel: "Step 3",
    description:
      "Institutional or organized capital to prove the core model—distribution, retention, and repeatability matter.",
    bestFor: "Teams with an MVP in market and evidence that demand is more than a one-off campaign.",
    tradeoffs: "Dilution and milestone pressure; mis-sized rounds can force awkward bridges or down rounds later.",
  },
  {
    id: "venture-capital",
    title: "Venture Capital",
    chipLabel: "VC",
    side: "right",
    tierLabel: "Step 4",
    description:
      "Pooled funds pursuing high growth—board involvement, reserves for follow-ons, and portfolio-return logic.",
    bestFor: "Large markets, venture-scale outcomes, and founders who want partners built for rapid expansion.",
    tradeoffs: "Preference stacks, governance, and tempo expectations—often a poor fit for lifestyle or slow-compound businesses.",
  },
  {
    id: "private-equity",
    title: "Private Equity",
    chipLabel: "PE",
    side: "right",
    tierLabel: "Step 5",
    description:
      "Control or significant-minority investing in mature companies—operations, M&A, and exit timelines tied to fund life.",
    bestFor: "Durable cash flows, clear value-creation levers, and owners ready for institutional process and reporting.",
    tradeoffs: "Intensive diligence, leverage in many structures, and decision-making aligned with fund economics—not yours alone.",
  },
];
