import { useState } from "react";
import { Link } from "react-router-dom";
import type { PreQualifyFormData } from "../data/preQualifyForm";
import { Button } from "./Button";
import { Input } from "./Input";
import { FormStep } from "./FormStep";

const STEPS = [
  "Contact",
  "Address",
  "Income",
  "Credit",
  "Business",
  "Consent",
] as const;

const creditScoreOptions = [
  { value: "", label: "Select range" },
  { value: "750-plus", label: "750+" },
  { value: "700-749", label: "700 – 749" },
  { value: "650-699", label: "650 – 699" },
  { value: "600-649", label: "600 – 649" },
  { value: "550-599", label: "550 – 599" },
  { value: "below-550", label: "Below 550" },
  { value: "not-sure", label: "Not sure" },
];

const businessTypeOptions = [
  { value: "", label: "Select" },
  { value: "llc", label: "LLC" },
  { value: "scorp", label: "S-Corp" },
  { value: "c corp", label: "C-Corp" },
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

const yearsInBusinessOptions = [
  { value: "", label: "Select" },
  { value: "0-1", label: "Less than 1 year" },
  { value: "1-2", label: "1 – 2 years" },
  { value: "2-5", label: "2 – 5 years" },
  { value: "5-plus", label: "5+ years" },
];

const monthlyRevenueOptions = [
  { value: "", label: "Select" },
  { value: "0-5k", label: "$0 – $5,000" },
  { value: "5k-15k", label: "$5,000 – $15,000" },
  { value: "15k-50k", label: "$15,000 – $50,000" },
  { value: "50k-100k", label: "$50,000 – $100,000" },
  { value: "100k-plus", label: "$100,000+" },
];

/** Format numeric string as USD for display (e.g. "100000" → "$100,000"). */
function formatDollars(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const n = parseInt(digits, 10);
  if (isNaN(n)) return value;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

/** Strip to digits only for storage. */
function parseDollarInput(value: string): string {
  return value.replace(/\D/g, "");
}

interface PreQualifyFormProps {
  form: PreQualifyFormData;
  update: (k: keyof PreQualifyFormData, v: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
}

export function PreQualifyForm({
  form,
  update,
  onSubmit,
  submitting,
  error,
}: PreQualifyFormProps) {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const selectClass =
    "w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-ori-foreground text-sm focus:border-ori-accent focus:outline-none";

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-1">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 max-w-[40px] rounded-full ${
              i <= step ? "bg-ori-accent" : "bg-ori-border"
            }`}
            aria-hidden
          />
        ))}
      </div>
      <p className="text-center text-sm text-ori-muted">
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </p>

      <form
        onSubmit={(e) => {
          if (step === STEPS.length - 1) {
            onSubmit(e);
            return;
          }
          e.preventDefault();
          if (step === 4 && !form.hasExistingBusiness) return;
          next();
        }}
        className="space-y-3"
      >
        {error && (
          <div
            className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-red-400"
            role="alert"
          >
            {error}
          </div>
        )}

        {step === 0 && (
          <FormStep title="Contact details" stepLabel="Contact" className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="First Name"
                required
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                className="py-2 px-3 text-sm"
              />
              <Input
                label="Last Name"
                required
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                className="py-2 px-3 text-sm"
              />
            </div>
            <Input
              label="Phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="py-2 px-3 text-sm"
              />
              <Input
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="py-2 px-3 text-sm"
              />
              <Input
                label="Date of Birth"
                type="date"
                required
                value={form.dateOfBirth}
                onChange={(e) => update("dateOfBirth", e.target.value)}
                className="py-2 px-3 text-sm"
              />
          </FormStep>
        )}

        {step === 1 && (
          <FormStep title="Home address" stepLabel="Address" className="space-y-3">
            <Input
              label="Street Address"
              required
              value={form.streetAddress}
              onChange={(e) => update("streetAddress", e.target.value)}
              className="py-2 px-3 text-sm"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="City"
                required
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="py-2 px-3 text-sm"
              />
              <Input
                label="State"
                required
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                className="py-2 px-3 text-sm"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Country"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className="py-2 px-3 text-sm"
              />
              <Input
                label="Postal Code"
                required
                value={form.postalCode}
                onChange={(e) => update("postalCode", e.target.value)}
                className="py-2 px-3 text-sm"
              />
            </div>
          </FormStep>
        )}

        {step === 2 && (
          <FormStep title="Income (pre-tax)" stepLabel="Income" className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="w-full">
                <label className="mb-1 block text-sm font-medium text-ori-foreground">
                  Annual Personal Income
                </label>
                <div className="flex rounded-lg border border-ori-border bg-ori-charcoal focus-within:border-ori-accent focus-within:ring-1 focus-within:ring-ori-accent">
                  <span className="flex items-center pl-3 text-sm text-ori-muted">$</span>
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 75,000"
                    value={formatDollars(form.annualPersonalIncome)}
                    onChange={(e) => update("annualPersonalIncome", parseDollarInput(e.target.value))}
                    className="w-full border-0 bg-transparent py-2 pr-3 pl-1 text-sm text-ori-foreground placeholder:text-ori-muted focus:outline-none"
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="mb-1 block text-sm font-medium text-ori-foreground">
                  Annual Household Income
                </label>
                <div className="flex rounded-lg border border-ori-border bg-ori-charcoal focus-within:border-ori-accent focus-within:ring-1 focus-within:ring-ori-accent">
                  <span className="flex items-center pl-3 text-sm text-ori-muted">$</span>
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 120,000"
                    value={formatDollars(form.annualHouseholdIncome)}
                    onChange={(e) => update("annualHouseholdIncome", parseDollarInput(e.target.value))}
                    className="w-full border-0 bg-transparent py-2 pr-3 pl-1 text-sm text-ori-foreground placeholder:text-ori-muted focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </FormStep>
        )}

        {step === 3 && (
          <FormStep title="Credit estimate" stepLabel="Credit">
            <div>
              <label className="mb-1 block text-sm font-medium text-ori-foreground">
                Estimated Credit Score
              </label>
              <select
                value={form.creditScoreRange}
                onChange={(e) => update("creditScoreRange", e.target.value)}
                className={selectClass}
                required
              >
                {creditScoreOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </FormStep>
        )}

        {step === 4 && (
          <FormStep title="Business info" stepLabel="Business">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ori-foreground">
                Do you own an existing business?
              </label>
              <div className="mt-1.5 flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hasExistingBusiness"
                    checked={form.hasExistingBusiness === "yes"}
                    onChange={() => update("hasExistingBusiness", "yes")}
                    className="border-ori-border bg-ori-charcoal text-ori-accent focus:ring-ori-accent"
                  />
                  <span className="text-ori-foreground">Yes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hasExistingBusiness"
                    checked={form.hasExistingBusiness === "no"}
                    onChange={() => update("hasExistingBusiness", "no")}
                    className="border-ori-border bg-ori-charcoal text-ori-accent focus:ring-ori-accent"
                  />
                  <span className="text-ori-foreground">No</span>
                </label>
              </div>
            </div>
            {form.hasExistingBusiness === "yes" && (
              <>
                <Input
                  label="Business name"
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                />
                <div>
                  <label className="mb-1 block text-sm font-medium text-ori-foreground">
                    Business type
                  </label>
                  <select
                    value={form.businessType}
                    onChange={(e) => update("businessType", e.target.value)}
                    className={selectClass}
                  >
                    {businessTypeOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ori-foreground">
                    Years in business
                  </label>
                  <select
                    value={form.yearsInBusiness}
                    onChange={(e) => update("yearsInBusiness", e.target.value)}
                    className={selectClass}
                  >
                    {yearsInBusinessOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ori-foreground">
                    Monthly revenue range
                  </label>
                  <select
                    value={form.monthlyRevenueRange}
                    onChange={(e) => update("monthlyRevenueRange", e.target.value)}
                    className={selectClass}
                  >
                    {monthlyRevenueOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </FormStep>
        )}

        {step === 5 && (
          <FormStep title="Consent" stepLabel="Consent">
            <div className="space-y-3 rounded-lg border border-ori-border bg-ori-surface p-3 text-sm text-ori-muted">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.consentSoftPull}
                  onChange={(e) => update("consentSoftPull", e.target.checked)}
                  className="mt-1 rounded border-ori-border bg-ori-charcoal text-ori-accent focus:ring-ori-accent"
                  required
                />
                <span>
                  I authorize Ori Capital and its underwriting partners to obtain and use consumer
                  report information (soft inquiry) to pre-qualify me for funding options. This
                  will not impact my credit score as a hard inquiry would.
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.consentSms}
                  onChange={(e) => update("consentSms", e.target.checked)}
                  className="mt-1 rounded border-ori-border bg-ori-charcoal text-ori-accent focus:ring-ori-accent"
                />
                <span>
                  I agree to receive SMS and phone communications from Ori Capital about my
                  application. Message and data rates may apply. I can opt out at any time.
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.consentAgree}
                  onChange={(e) => update("consentAgree", e.target.checked)}
                  className="mt-1 rounded border-ori-border bg-ori-charcoal text-ori-accent focus:ring-ori-accent"
                  required
                />
                <span>
                  I have read and agree to the{" "}
                  <Link to="/legal/terms" className="text-ori-accent hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/legal/disclosures" className="text-ori-accent hover:underline">
                    Disclosures
                  </Link>
                  . I AGREE to submit this pre-qualification request.
                </span>
              </label>
            </div>
          </FormStep>
        )}

        <div className="flex justify-between pt-4">
          <Button type="button" variant="ghost" onClick={prev} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="submit">Next</Button>
          ) : (
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
