import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { PageHero, PageSection } from "../components/system";
import { Textarea } from "../components/Textarea";
import { config } from "../config";
import {
  getLastReadinessSurveySnapshot,
  REFERRAL_OPTIONS,
  type ReferralOption,
} from "../data/contactSubmissions";
import { submitContactIntake } from "../lib/public/intake";

const QUICK_REASONS = [
  "Discuss funding options for my business",
  "Schedule a consultation",
  "Question about readiness or pre-qualification",
  "Partnership or media inquiry",
] as const;

const SCHEDULE_CONSULTATION = "Schedule a consultation";
const CALENDLY_DIRECT_DEFAULT_URL = "https://calendly.com/biz-oricapitalholdings/30min?month=2026-03";

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const referralCode = useMemo(() => (searchParams.get("ref") || "").trim(), [searchParams]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState("");
  const [quickReason, setQuickReason] = useState<string | null>(null);
  const [referralSource, setReferralSource] = useState<ReferralOption | null>(null);
  const [referralOtherDetail, setReferralOtherDetail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const calendlyDirectUrl = config.calendlyUrl || CALENDLY_DIRECT_DEFAULT_URL;

  function toggleQuickReason(reason: string) {
    setQuickReason((prev) => (prev === reason ? null : reason));
    setFormError(null);
  }

  function selectReferral(option: ReferralOption) {
    setReferralSource(option);
    if (option !== "Other") setReferralOtherDetail("");
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const hasMessage = message.trim().length > 0;
    if (!hasMessage && !quickReason) {
      setFormError("Choose a topic or add a short message so we know how to help.");
      return;
    }
    if (!referralSource) {
      setFormError("Please tell us how you heard about Ori.");
      return;
    }
    if (referralSource === "Other" && !referralOtherDetail.trim()) {
      setFormError("Please add who referred you or how you found us.");
      return;
    }

    const surveySnapshot = getLastReadinessSurveySnapshot();
    setSubmitting(true);
    const ok = await submitContactIntake({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      companyName: companyName.trim(),
      message: message.trim(),
      quickReason,
      referralSource,
      referralOtherDetail: referralSource === "Other" ? referralOtherDetail.trim() : "",
      surveySnapshot,
      ...(referralCode ? { referralCode, ref: referralCode } : {}),
    });
    setSubmitting(false);
    if (!ok) {
      setFormError("We could not save your message. Please try again or email us directly.");
      return;
    }
    if (quickReason === SCHEDULE_CONSULTATION) {
      window.location.assign(calendlyDirectUrl);
      return;
    }
    setSubmitted(true);
  }

  return (
    <>
      <PageHero
        size="inner"
        title="Contact"
        subtitle="Questions about funding, strategy, or partnerships? Reach out."
        align="center"
        className="border-b border-ori-border bg-ori-section-alt"
      />

      <PageSection variant="normal">
        <div className="mx-auto max-w-2xl">
          {submitted ? (
            <div className="rounded-xl border border-ori-border bg-ori-surface p-8 text-center space-y-4">
              <p className="text-ori-accent font-medium">Thanks for reaching out. We&apos;ll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                <Input
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  placeholder="Optional"
                />
                <Input
                  label="Company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  autoComplete="organization"
                  placeholder="Optional"
                />
              </div>

              <div>
                <p className="mb-2 block text-sm font-medium text-ori-foreground">
                  What can we help with?
                </p>
                <p className="mb-3 text-xs text-ori-muted">
                  Tap a topic if you prefer not to write a message—we&apos;ll follow up from there.
                </p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Quick contact reasons">
                  {QUICK_REASONS.map((reason) => {
                    const selected = quickReason === reason;
                    return (
                      <button
                        key={reason}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleQuickReason(reason)}
                        className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors ${
                          selected
                            ? "border-ori-accent bg-ori-glow text-ori-accent"
                            : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                        }`}
                      >
                        {reason}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Textarea
                label={quickReason ? "Message (optional)" : "Message"}
                required={!quickReason}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setFormError(null);
                }}
                placeholder={
                  quickReason
                    ? "Optional — add details if you’d like."
                    : "How can we help?"
                }
              />

              <div>
                <p className="mb-2 block text-sm font-medium text-ori-foreground">
                  How did you hear about us?
                </p>
                <p className="mb-3 text-xs text-ori-muted">
                  Helps us understand what&apos;s working so we can support founders like you.
                </p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Referral source">
                  {REFERRAL_OPTIONS.map((option) => {
                    const selected = referralSource === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => selectReferral(option)}
                        className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors ${
                          selected
                            ? "border-ori-accent bg-ori-glow text-ori-accent"
                            : "border-ori-border bg-ori-charcoal text-ori-foreground hover:border-ori-muted"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {referralSource === "Other" ? (
                  <div className="mt-3">
                    <Input
                      label="Please specify"
                      value={referralOtherDetail}
                      onChange={(e) => {
                        setReferralOtherDetail(e.target.value);
                        setFormError(null);
                      }}
                      placeholder="Name, organization, or link"
                      autoComplete="off"
                    />
                  </div>
                ) : null}
              </div>

              {formError && (
                <p className="text-sm text-red-400" role="alert">
                  {formError}
                </p>
              )}

              <Button type="submit" className="w-full md:w-auto" disabled={submitting}>
                {submitting ? "Sending…" : "Send"}
              </Button>
              <p className="text-sm text-ori-muted">
                If you&apos;re not ready yet, we&apos;ll help clarify what to improve and how to move forward.
              </p>
            </form>
          )}
        </div>
      </PageSection>
    </>
  );
}
