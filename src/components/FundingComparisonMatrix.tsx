import { Button } from "./Button";
import { InfoPopover } from "./InfoPopover";
import { ROUTES } from "../utils/navigation";

const ROWS: {
  type: string;
  speed: string;
  cost: string;
  flexibility: string;
  ownership: string;
  bestFor: string;
  tooltip: { title: string; content: React.ReactNode };
}[] = [
  {
    type: "Grants",
    speed: "Slow",
    cost: "Low",
    flexibility: "Med",
    ownership: "None",
    bestFor: "Non-dilutive, mission-aligned",
    tooltip: {
      title: "Grants",
      content: (
        <>
          Free money you don't repay. Usually tied to a mission or use (e.g. small business, minority-owned).
          Common types: federal SBA, state, corporate, nonprofit. Best for: filling gaps without debt or dilution.
        </>
      ),
    },
  },
  {
    type: "Competitions",
    speed: "Slow–Med",
    cost: "None",
    flexibility: "Low",
    ownership: "None",
    bestFor: "Non-dilutive validation, visibility, and early capital",
    tooltip: {
      title: "Competitions",
      content: (
        <>
          <strong>Explanation:</strong> Cash prizes, pitch competitions, business plan competitions, ecosystem challenges.
          <br /><br />
          <strong>Examples:</strong> Accelerator demo day prizes, local ecosystem pitch nights, corporate innovation challenges.
        </>
      ),
    },
  },
  {
    type: "Loans",
    speed: "Med",
    cost: "Low–Med",
    flexibility: "Low",
    ownership: "None",
    bestFor: "Predictable payments, assets",
    tooltip: {
      title: "Term loans",
      content: (
        <>
          You borrow a set amount and repay on a schedule. Common: bank term loans, SBA 7(a), equipment loans.
          Best for: known costs (hire, inventory, equipment) when you want predictable monthly payments.
        </>
      ),
    },
  },
  {
    type: "Lines of Credit",
    speed: "Med",
    cost: "Med",
    flexibility: "High",
    ownership: "None",
    bestFor: "Working capital, draw as needed",
    tooltip: {
      title: "Lines of credit",
      content: (
        <>
          A credit line you draw from when you need it; repay and reuse. Common: bank LOC, business LOC.
          Best for: seasonal cash flow, unexpected expenses, smoothing gaps without taking a lump sum.
        </>
      ),
    },
  },
  {
    type: "Business Credit Cards",
    speed: "Fast",
    cost: "Med–High",
    flexibility: "Med",
    ownership: "None",
    bestFor: "Day-to-day spend, credit building",
    tooltip: {
      title: "Business credit cards",
      content: (
        <>
          Revolving credit for everyday spend; build business credit and earn rewards. Common: issuer cards, secured cards.
          Best for: recurring expenses, separating business/personal, building a credit profile.
        </>
      ),
    },
  },
  {
    type: "Revenue-Based Financing",
    speed: "Med",
    cost: "Med–High",
    flexibility: "High",
    ownership: "None",
    bestFor: "Recurring revenue, flexible repay",
    tooltip: {
      title: "Revenue-based financing",
      content: (
        <>
          Repayment is a percentage of monthly revenue, so it scales with your sales. Common: revenue-based loans, MRR-based advances.
          Best for: SaaS, e‑commerce, or any business with predictable monthly revenue.
        </>
      ),
    },
  },
  {
    type: "Investment",
    speed: "Slow–Med",
    cost: "High",
    flexibility: "Med",
    ownership: "High",
    bestFor: "Scale, willing to share upside",
    tooltip: {
      title: "Investment",
      content: (
        <>
          Investors get a share of your company in exchange for capital. Common: angels, VC, pre-seed/seed funds.
          Best for: high-growth companies willing to trade ownership for scale; not for everyone.
        </>
      ),
    },
  },
];

const COLUMN_LABELS = ["Funding type", "Speed to access", "Cost of capital", "Flexibility", "Ownership impact", "Best for"];

export function FundingComparisonMatrix() {
  return (
    <section className="mx-auto max-w-5xl">
      <h2 className="font-display text-2xl font-bold text-ori-foreground md:text-3xl">
        Understand Your Funding Options
      </h2>
      <p className="mt-2 text-ori-muted leading-relaxed max-w-[680px]">
        Different capital tools solve different problems. Here's a simple way to compare your options.
      </p>

      <div className="mt-6 rounded-2xl border-2 border-ori-border bg-ori-surface shadow-lg overflow-hidden">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-ori-border bg-ori-charcoal">
                {COLUMN_LABELS.map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left font-semibold text-ori-foreground first:rounded-tl-2xl last:rounded-tr-2xl"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.type}
                  className={`border-b border-ori-border last:border-b-0 transition-colors hover:bg-ori-charcoal/60 ${
                    i % 2 === 1 ? "bg-ori-charcoal/40" : ""
                  }`}
                >
                  <td className="relative px-4 py-2.5 font-medium text-ori-foreground">
                    <InfoPopover
                      title={row.tooltip.title}
                      content={row.tooltip.content}
                      openAbove
                    >
                      {row.type}
                    </InfoPopover>
                  </td>
                  <td className="px-4 py-2.5 text-ori-muted">{row.speed}</td>
                  <td className="px-4 py-2.5 text-ori-muted">{row.cost}</td>
                  <td className="px-4 py-2.5 text-ori-muted">{row.flexibility}</td>
                  <td className="px-4 py-2.5 text-ori-muted">{row.ownership}</td>
                  <td className="px-4 py-2.5 text-ori-muted">{row.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-8 text-center text-ori-foreground font-medium">
        Ready to start? Apply for funding and we'll match you to the right options.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <Button to={ROUTES.APPLY} size="lg">
          Apply for Funding
        </Button>
        <Button to={ROUTES.FUNDING_READINESS} variant="outline" size="lg">
          Get Pre-Qualified
        </Button>
      </div>
    </section>
  );
}
