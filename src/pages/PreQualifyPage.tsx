import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Accordion } from "../components/Accordion";
import { PreQualifyForm } from "../components/PreQualifyForm";
import { initialPreQualifyForm, type PreQualifyFormData } from "../data/preQualifyForm";
import { config } from "../config";
import { ORI_EVENTS, trackOriEvent } from "../lib/analytics/oriEvents";
import { ROUTES } from "../utils/navigation";
import { resolveCheckoutReferralCode } from "../lib/referral/attribution";

const requirementItems = [
  {
    id: "credit-strength",
    title: "Credit strength",
    content: (
      <>
        Lenders typically look at personal and sometimes business credit. Stronger scores and
        clean history improve options and terms. We use a soft pull for pre-qualification—no
        impact on your score.
      </>
    ),
  },
  {
    id: "utilization",
    title: "Credit utilization",
    content: (
      <>
        Lower utilization (how much of your available credit you use) is generally better.
        High utilization can signal risk. We'll help you understand where you stand.
      </>
    ),
  },
  {
    id: "payment-history",
    title: "Payment history",
    content: (
      <>
        On-time payments matter. A consistent track record supports approval. Past issues
        aren't automatic disqualifiers—we look at context and improvement.
      </>
    ),
  },
  {
    id: "revenue-cashflow",
    title: "Revenue and cash flow",
    content: (
      <>
        Many products require evidence of revenue or predictable cash flow. Startups and
        very early-stage businesses may qualify for founder-focused or early-stage options
        instead of traditional term loans.
      </>
    ),
  },
  {
    id: "debt-income",
    title: "Debt-to-income",
    content: (
      <>
        Lenders consider how much you already owe relative to income. A manageable ratio
        improves your profile. Our Funding Readiness Accelerator can help you optimize before
        applying.
      </>
    ),
  },
];

export function PreQualifyPage() {
  const [searchParams] = useSearchParams();
  const referralCode = useMemo(
    () =>
      resolveCheckoutReferralCode({
        ref: searchParams.get("ref"),
        referral: searchParams.get("referral"),
      }),
    [searchParams]
  );
  const [form, setForm] = useState<PreQualifyFormData>(initialPreQualifyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof PreQualifyFormData, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    trackOriEvent(ORI_EVENTS.APPLY_SUBMIT_ATTEMPT);
    setSubmitting(true);
    try {
      const res = await fetch(config.applyApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...(referralCode ? { referralCode, ref: referralCode } : {}),
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      trackOriEvent(ORI_EVENTS.APPLY_SUBMIT_SUCCESS);
      setSubmitted(true);
    } catch {
      setError("We could not submit your request right now. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="ori-container ori-section max-w-xl mx-auto text-center">
        <h1 className="ori-h2">
          Thanks — we received your request
        </h1>
        <p className="ori-readable mt-6 mx-auto text-ori-muted leading-relaxed">
          If you meet requirements, we'll contact you for a free consultation to review available options.
        </p>
        <p className="mt-10 text-sm text-ori-muted">
          <Link to={ROUTES.HOME} className="text-ori-accent hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="ori-container ori-section max-w-2xl mx-auto">
      <header className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-ori-accent">Funding / Apply</p>
        <h1 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl md:leading-tight">
          Apply when funding is the right next move for your business
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm font-medium text-ori-muted">
          This intake helps us match you to appropriate funding paths. It is a pre-qualification review—not a commitment or hard credit pull.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ori-muted">
          Still setting up operations or structure? Start with{" "}
          <Link to={ROUTES.MANAGEMENT} className="text-ori-accent hover:underline">
            Management
          </Link>{" "}
          or{" "}
          <Link to={ROUTES.GET_STARTED} className="text-ori-accent hover:underline">
            Get started
          </Link>
          , or strengthen your profile via{" "}
          <Link to={ROUTES.FUNDING_READINESS} className="text-ori-accent hover:underline">
            Funding Readiness
          </Link>{" "}
          first.
        </p>
      </header>

      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl border border-ori-border bg-ori-surface p-4 md:p-6">
          <PreQualifyForm
            form={form}
            update={update}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
          />
        </div>

        <p className="mt-4 text-center text-sm text-ori-muted">
          If you are not ready yet, we will help clarify what to improve and how to move forward.
        </p>
        <p className="mt-1 text-center text-sm text-ori-muted">
          Compare structures first:{" "}
          <Link to={ROUTES.FUNDING} className="text-ori-accent hover:underline">
            Explore funding options
          </Link>{" "}
          ·{" "}
          <Link to={ROUTES.CAPITAL} className="text-ori-accent hover:underline">
            Funding overview
          </Link>
        </p>
      </div>

      {/* Typical requirements below the form */}
      <section className="mt-24 mb-10">
        <h2 className="ori-h2">
          Typical Funding Requirements
        </h2>
        <p className="mt-1 text-sm text-ori-muted leading-relaxed">
          Different products have different bars. If you're not there yet, our Funding Readiness Accelerator can help.
        </p>
        <Accordion items={requirementItems} className="mt-4" />
        <p className="mt-4 text-sm text-ori-muted">Not sure you qualify yet?</p>
        <div className="mt-2">
          <Button to={ROUTES.FUNDING_READINESS} variant="outline" size="sm">
            Explore Funding Readiness
          </Button>
        </div>
      </section>
    </div>
  );
}
