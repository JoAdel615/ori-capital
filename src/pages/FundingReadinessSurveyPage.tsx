import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { ReadinessGauge } from "../components/readiness/ReadinessGauge";
import { CardShell } from "../components/ui/CardShell";
import { PageSection } from "../components/system";
import { ROUTES } from "../utils/navigation";
import { calculateReadiness } from "../lib/readiness/scoring";
import type { ReadinessAnswers, CollateralOption } from "../lib/readiness/types";
import { shouldAskOpenToEquity, STEP_LABELS } from "../lib/readiness/questions";
import { submitAssessment } from "../api/readiness";
import type { ReadinessResult } from "../lib/readiness/types";
import { saveLastReadinessSurveySnapshot } from "../data/contactSubmissions";
import {
  getStoredReferralCode,
  normalizeReferralCode,
  pathWithRef,
  persistReferralCode,
  externalUrlWithRef,
} from "../lib/referral/attribution";
import { config } from "../config";

const TOTAL_STEPS = 5;

/** At or above this readiness score, primary recommendation is Apply for Funding (else Get Pre-Qualified). */
const APPLY_RECOMMENDATION_THRESHOLD = 65;

const INITIAL_ANSWERS: ReadinessAnswers = {};

function recommendApplyForFunding(score: number): boolean {
  return score >= APPLY_RECOMMENDATION_THRESHOLD;
}

function getRecommendationCopy(score: number): { headline: string; supporting: string } {
  if (recommendApplyForFunding(score)) {
    return {
      headline: "Apply for funding",
      supporting:
        "Your answers suggest you’re in a strong position to start an application—or set up a consultation if you’d rather talk it through first.",
    };
  }
  return {
    headline: "Get pre-qualified first",
    supporting:
      "Your answers suggest a short pre-qualification step will help before you apply—or set up a consultation to map the best path with our team.",
  };
}

export function FundingReadinessSurveyPage() {
  const [searchParams] = useSearchParams();
  const referralRef = useMemo(() => {
    const q = normalizeReferralCode(searchParams.get("ref"));
    if (q) return q;
    return getStoredReferralCode();
  }, [searchParams]);

  useEffect(() => {
    if (referralRef) persistReferralCode(referralRef);
  }, [referralRef]);

  const [phase, setPhase] = useState<"intro" | "survey" | "results">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ReadinessAnswers>(INITIAL_ANSWERS);
  const [microFeedback, setMicroFeedback] = useState<string | null>(null);
  const [result, setResult] = useState<ReadinessResult | null>(null);

  const updateAnswer = useCallback(
    <K extends keyof ReadinessAnswers>(key: K, value: ReadinessAnswers[K]) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      setMicroFeedback(null);
    },
    []
  );

  const nextStep = () => {
    setMicroFeedback(null);
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else finishSurvey();
  };

  const prevStep = () => {
    setMicroFeedback(null);
    setStep((s) => Math.max(0, s - 1));
  };

  async function finishSurvey() {
    const provisional = calculateReadiness(answers);
    let finalResult: ReadinessResult = provisional;
    try {
      const res = await submitAssessment({
        answers,
        clientScore: provisional.score,
        clientTier: provisional.tier,
        clientZone: provisional.zone,
      });
      finalResult = {
        ...res.verified,
        signals: res.verified.signals,
      } as ReadinessResult;
    } catch {
      finalResult = provisional;
    }
    setResult(finalResult);
    saveLastReadinessSurveySnapshot({
      completedAt: new Date().toISOString(),
      answers: { ...answers },
      result: {
        score: finalResult.score,
        tier: finalResult.tier,
        zone: finalResult.zone,
      },
    });
    setPhase("results");
  }

  const progressPct = phase === "survey" ? ((step + 1) / TOTAL_STEPS) * 100 : 100;

  // ——— Intro ———
  if (phase === "intro") {
    return (
      <PageSection variant="normal" className="py-16 md:py-20">
        <div className="mx-auto max-w-md text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ori-accent/90">No credit pull</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl">
            Funding readiness
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ori-muted">
            Five questions. We’ll suggest whether to <span className="text-ori-foreground">apply for funding</span> or{" "}
            <span className="text-ori-foreground">get pre-qualified</span> first.
          </p>
          <div className="mt-10 flex justify-center">
            <Button onClick={() => setPhase("survey")} size="lg" className="min-w-[200px]">
              Begin
            </Button>
          </div>
          <p className="mx-auto mt-8 max-w-sm text-[11px] leading-relaxed text-ori-muted">
            Self-reported, informational only—not a credit decision, offer, or guarantee.
          </p>
        </div>
      </PageSection>
    );
  }

  // ——— Results ———
  if (phase === "results") {
    const r = result!;
    const score = r.score;
    const primaryApply = recommendApplyForFunding(score);
    const { headline, supporting } = getRecommendationCopy(score);
    const extApply = config.applyExternalUrl?.trim();
    const applyHref = extApply ? externalUrlWithRef(extApply, referralRef) : null;
    const applyTo = pathWithRef(ROUTES.APPLY, referralRef);
    const contactTo = pathWithRef(ROUTES.CONTACT, referralRef);
    const enrollTo = pathWithRef(ROUTES.FUNDING_READINESS_ENROLL, referralRef);

    return (
      <PageSection variant="normal" className="py-12 md:py-16">
        <div className="mx-auto max-w-xl">
          <h1 className="text-center font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl">
            Your results
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-center text-xs text-ori-muted">
            Funding Readiness Index™ · self-reported · not underwriting
          </p>

          <div className="mt-8 rounded-2xl border border-ori-border bg-ori-surface/90 px-6 py-8 md:px-10">
            <div className="flex flex-col items-center">
              <ReadinessGauge score={score} className="w-full max-w-[300px]" />
            </div>
            <div className="mt-8 border-t border-ori-border pt-8 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-ori-muted">Suggested next step</p>
              <p className="mt-2 font-display text-xl font-semibold text-ori-accent md:text-2xl">{headline}</p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ori-muted">{supporting}</p>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-center text-xs font-medium uppercase tracking-wider text-ori-muted">Choose how to continue</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {primaryApply ? (
                <>
                  {applyHref ? (
                    <Button href={applyHref} size="lg" className="w-full min-h-[3rem]">
                      Apply for Funding
                    </Button>
                  ) : (
                    <Button to={applyTo} size="lg" className="w-full min-h-[3rem]">
                      Apply for Funding
                    </Button>
                  )}
                  <Button to={contactTo} variant="outline" size="lg" className="w-full min-h-[3rem]">
                    Set up a consultation
                  </Button>
                </>
              ) : (
                <>
                  <Button to={enrollTo} size="lg" className="w-full min-h-[3rem]">
                    Get Pre-Qualified
                  </Button>
                  <Button to={contactTo} variant="outline" size="lg" className="w-full min-h-[3rem]">
                    Set up a consultation
                  </Button>
                </>
              )}
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-md text-center text-[11px] leading-relaxed text-ori-muted">
            No credit pull. Informational only—not a credit decision, loan offer, or guarantee of funding.
          </p>
        </div>
      </PageSection>
    );
  }

  // ——— Survey steps ———
  const isGeneratingRevenue = answers.revenue_status === "Yes";
  const canProceed =
    step === 0
      ? Boolean(
          answers.revenue_status &&
            answers.time_in_business &&
            (isGeneratingRevenue ? answers.monthly_revenue && answers.revenue_consistency : true)
        )
      : step === 1
        ? answers.credit_range !== undefined && answers.delinquencies_12mo !== undefined && answers.utilization !== undefined
        : step === 2
          ? answers.business_debt !== undefined &&
            answers.obligations_cover !== undefined &&
            Array.isArray(answers.collateral) &&
            answers.collateral.length > 0
          : step === 3
            ? answers.registered_good_standing !== undefined &&
              answers.ein_and_bank !== undefined &&
              answers.business_credit_file !== undefined &&
              answers.financials_ready !== undefined
            : step === 4
              ? answers.funding_purpose !== undefined &&
                answers.amount !== undefined &&
                (shouldAskOpenToEquity(answers) ? answers.open_to_equity !== undefined : true)
              : false;

  return (
    <PageSection variant="normal">
      <div className="max-w-2xl mx-auto">
      <header className="text-center mb-5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl">
          Funding Readiness Survey
        </h1>
        <p className="ori-muted mt-1.5 text-sm">
          Step {step + 1} of {TOTAL_STEPS}: {STEP_LABELS[step]} · {Math.round(progressPct)}% complete
        </p>
      </header>

      <CardShell>
        <div className="mb-4" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-label={`Step ${step + 1} of ${TOTAL_STEPS}`}>
          <div className="flex justify-between text-xs text-ori-muted mb-1">
            <span>Step {step + 1} of {TOTAL_STEPS}</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="h-2 rounded-full bg-ori-border overflow-hidden">
            <div
              className="readiness-progress-bar h-full bg-ori-accent rounded-full transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            nextStep();
          }}
          className="space-y-4"
        >
          {/* Step 0: Business stage */}
          {step === 0 && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">Generating revenue?</label>
                <div className="flex flex-wrap gap-2">
                  {(["Yes", "Pre-revenue"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        updateAnswer("revenue_status", opt);
                        if (opt === "Pre-revenue") {
                          updateAnswer("monthly_revenue", "$0");
                          updateAnswer("revenue_consistency", "None");
                        }
                      }}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        answers.revenue_status === opt
                          ? "border-ori-accent bg-ori-glow text-ori-accent"
                          : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {isGeneratingRevenue ? (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-ori-foreground">Avg monthly revenue</label>
                    <div className="flex flex-wrap gap-2">
                      {(["$0", "$1–10k", "$10–50k", "$50–250k", "$250k+"] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateAnswer("monthly_revenue", opt)}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                            answers.monthly_revenue === opt
                              ? "border-ori-accent bg-ori-glow text-ori-accent"
                              : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-ori-foreground">Revenue consistency</label>
                    <div className="flex flex-wrap gap-2">
                      {(["Consistent", "Seasonal", "Highly inconsistent", "None"] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateAnswer("revenue_consistency", opt)}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                            answers.revenue_consistency === opt
                              ? "border-ori-accent bg-ori-glow text-ori-accent"
                              : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">Time in business</label>
                <select
                  value={answers.time_in_business ?? ""}
                  onChange={(e) => updateAnswer("time_in_business", e.target.value as ReadinessAnswers["time_in_business"])}
                  className="w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground focus:border-ori-accent focus:outline-none"
                >
                  <option value="">Select</option>
                  {(["Not launched", "<6 months", "6–12 months", "1–2 years", "2+ years"] as const).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Step 1: Credit profile */}
          {step === 1 && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">Personal credit range</label>
                <div className="flex flex-wrap gap-2">
                  {(["750+", "700–749", "650–699", "600–649", "Below 600", "Unsure"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer("credit_range", opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        answers.credit_range === opt
                          ? "border-ori-accent bg-ori-glow text-ori-accent"
                          : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">Recent delinquencies (last 12 months)?</label>
                <div className="flex gap-2">
                  {(["No", "Yes"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer("delinquencies_12mo", opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        answers.delinquencies_12mo === opt
                          ? "border-ori-accent bg-ori-glow text-ori-accent"
                          : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">Utilization range</label>
                <div className="flex flex-wrap gap-2">
                  {(["<30%", "30–60%", ">60%", "Unsure"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer("utilization", opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        answers.utilization === opt
                          ? "border-ori-accent bg-ori-glow text-ori-accent"
                          : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 2: Debt & risk */}
          {step === 2 && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">Current business debt</label>
                <div className="flex flex-wrap gap-2">
                  {(["None", "Light", "Moderate", "Heavy"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer("business_debt", opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        answers.business_debt === opt
                          ? "border-ori-accent bg-ori-glow text-ori-accent"
                          : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">Can you comfortably cover current obligations?</label>
                <div className="flex flex-wrap gap-2">
                  {(["Yes", "Barely", "No"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer("obligations_cover", opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        answers.obligations_cover === opt
                          ? "border-ori-accent bg-ori-glow text-ori-accent"
                          : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">Collateral available (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {(["Equipment", "Receivables", "Inventory", "None"] as const).map((opt) => {
                    const selected = answers.collateral?.includes(opt) ?? false;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          const current = (answers.collateral ?? []) as CollateralOption[];
                          const next: CollateralOption[] = selected
                            ? current.filter((c) => c !== opt)
                            : current.includes("None") && opt !== "None"
                              ? [...current.filter((c) => c !== "None"), opt]
                              : opt === "None"
                                ? ["None"]
                                : [...current, opt];
                          updateAnswer("collateral", next);
                        }}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          selected
                            ? "border-ori-accent bg-ori-glow text-ori-accent"
                            : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Step 3: Structure */}
          {step === 3 && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">Business registered & in good standing?</label>
                <div className="flex flex-wrap gap-2">
                  {(["Yes", "In progress", "No"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer("registered_good_standing", opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        answers.registered_good_standing === opt
                          ? "border-ori-accent bg-ori-glow text-ori-accent"
                          : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">EIN + business bank account</label>
                <div className="flex flex-wrap gap-2">
                  {(["Yes", "Partial", "No"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer("ein_and_bank", opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        answers.ein_and_bank === opt
                          ? "border-ori-accent bg-ori-glow text-ori-accent"
                          : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">Business credit file established</label>
                <div className="flex flex-wrap gap-2">
                  {(["Yes", "Minimal", "No", "Not sure"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer("business_credit_file", opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        answers.business_credit_file === opt
                          ? "border-ori-accent bg-ori-glow text-ori-accent"
                          : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">Financials (P&L / balance sheet) ready?</label>
                <div className="flex flex-wrap gap-2">
                  {(["Yes (P&L + balance sheet)", "Somewhat", "No"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer("financials_ready", opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        answers.financials_ready === opt
                          ? "border-ori-accent bg-ori-glow text-ori-accent"
                          : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 4: Capital intent */}
          {step === 4 && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">Primary use of funds</label>
                <div className="flex flex-wrap gap-2">
                  {(["Working capital", "Inventory", "Equipment", "Hiring", "Expansion", "Refinance", "Unsure"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer("funding_purpose", opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        answers.funding_purpose === opt
                          ? "border-ori-accent bg-ori-glow text-ori-accent"
                          : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ori-foreground">Target amount</label>
                <div className="flex flex-wrap gap-2">
                  {(["< $25k", "$25–100k", "$100–500k", "$500k+"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer("amount", opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        answers.amount === opt
                          ? "border-ori-accent bg-ori-glow text-ori-accent"
                          : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {shouldAskOpenToEquity(answers) && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-ori-foreground">Open to equity?</label>
                  <div className="flex flex-wrap gap-2">
                    {(["Yes", "Maybe", "No"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateAnswer("open_to_equity", opt)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          answers.open_to_equity === opt
                            ? "border-ori-accent bg-ori-glow text-ori-accent"
                            : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {microFeedback && (
            <p className="text-sm text-ori-muted italic" role="status">
              {microFeedback}
            </p>
          )}

          <div className="flex justify-between pt-3">
            <Button type="button" variant="ghost" onClick={prevStep} disabled={step === 0}>
              Back
            </Button>
            <Button type="submit" disabled={!canProceed}>
              {step < TOTAL_STEPS - 1 ? "Next" : "See my results"}
            </Button>
          </div>
        </form>
        <p className="ori-muted ori-readable mt-4 text-center mx-auto text-xs leading-relaxed">
          No credit pull is performed. Your answers are self-reported and used only to guide next steps. This is an informational readiness assessment — not a credit decision, loan offer, or guarantee of funding.
        </p>
      </CardShell>
      </div>
    </PageSection>
  );
}

