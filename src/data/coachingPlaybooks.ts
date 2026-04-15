/**
 * Ori Playbooks — public coaching product page + lifecycle deep links.
 * Lifecycle slugs match `CONSULTING_LIFECYCLE_LANDINGS` / `/consulting/lifecycle/:slug`.
 * `visualIndex` maps to `COACHING_PRODUCT_IMAGERY` in `src/constants/siteImagery.ts` (length 8).
 */
export type CoachingPlaybookCard = {
  slug: string;
  title: string;
  objective: string;
  built: string;
  /** Index into `COACHING_PRODUCT_IMAGERY` for card photography. */
  visualIndex: number;
  featured?: boolean;
};

export const COACHING_PLAYBOOK_CARDS: CoachingPlaybookCard[] = [
  {
    slug: "sharpen-your-business-model",
    title: "Sharpen Your Model",
    objective: "Define a clear, testable business model with real customer validation.",
    built: "Offer clarity, ICP definition, and a model you can pressure-test.",
    visualIndex: 0,
    featured: true,
  },
  {
    slug: "build-the-right-foundation",
    title: "Build on Solid Ground",
    objective: "Stand up structure, compliance, and reporting that scale with you—not against you.",
    built: "Entity alignment, clean records, and fewer surprises as you grow.",
    visualIndex: 5,
  },
  {
    slug: "build-a-predictable-pipeline",
    title: "Establish a Predictable Pipeline",
    objective: "Replace guesswork with a measurable path from attention to revenue.",
    built: "Messaging, acquisition loops, and conversion checkpoints you can read weekly.",
    visualIndex: 2,
  },
  {
    slug: "systemize-your-operations",
    title: "Turn Operations into Systems",
    objective: "Move from heroic effort to repeatable execution with clear ownership.",
    built: "Workflows, roles, and handoffs that keep delivery consistent.",
    visualIndex: 4,
  },
  {
    slug: "install-your-growth-engine",
    title: "Run on Real Signals",
    objective: "Instrument what matters so decisions come from evidence—not vibes.",
    built: "A tight metric stack tied to cash, conversion, and unit economics.",
    visualIndex: 1,
  },
  {
    slug: "deploy-capital-strategically",
    title: "Deploy Capital Strategically",
    objective: "Time funding so it multiplies what already works—not paper over gaps.",
    built: "Readiness narrative, use-of-proceeds clarity, and capital sequencing.",
    visualIndex: 7,
  },
];

export const SHARPEN_PLAYBOOK_DEEP_DIVE = {
  title: "Sharpen Your Model",
  objective:
    "Define a clear, testable business model with real customer validation—so every later playbook builds on truth, not assumptions.",
  sessions: [
    { n: 1, title: "Define your offer", detail: "Tighten what you sell, to whom, and the promise you can defend." },
    { n: 2, title: "Validate your customer", detail: "Pressure-test who actually buys—and why now." },
    { n: 3, title: "Pressure test the model", detail: "Economics, constraints, and the riskiest assumptions on the table." },
    { n: 4, title: "Position & message", detail: "Turn clarity into language prospects recognize and respond to." },
  ],
  plays: [
    "Conduct 10–15 customer interviews",
    "Refine your value proposition against real objections",
    "Test pricing with real prospects—not spreadsheets",
  ],
  outcomes: [
    "Defined ICP you can aim campaigns and product at",
    "Validated problem language from real conversations",
    "Refined value proposition tied to willingness to pay",
    "Early revenue signal or qualified pipeline momentum",
  ],
} as const;
