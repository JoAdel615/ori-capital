/**
 * Standalone testimonial form for clients. Share this link to collect feedback.
 * Submissions are stored in localStorage (same as admin-managed testimonials).
 */

import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import type { TestimonialEntry } from "../data/testimonials";
import { submitTestimonialIntake } from "../lib/public/intake";

const initialForm: TestimonialEntry = {
  name: "",
  location: "",
  company: "",
  fundingAmount: "",
  businessStage: "",
  feedback: "",
};

const BUSINESS_STAGE_OPTIONS = [
  { value: "", label: "Select" },
  { value: "new", label: "New business" },
  { value: "existing", label: "Existing business" },
];

const INDUSTRY_OPTIONS = [
  "Technology / SaaS",
  "Healthcare",
  "Financial Services",
  "Professional Services",
  "Retail / E-commerce",
  "Manufacturing",
  "Construction",
  "Real Estate",
  "Transportation / Logistics",
  "Hospitality / Food Service",
  "Education",
  "Media / Marketing",
  "Energy / Utilities",
  "Agriculture",
  "Nonprofit",
  "Other",
] as const;

export function TestimonialPage() {
  const [form, setForm] = useState<TestimonialEntry>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof TestimonialEntry, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.feedback.trim()) return;
    setSubmitting(true);
    const ok = await submitTestimonialIntake({
      name: form.name.trim(),
      feedback: form.feedback.trim(),
      location: form.location?.trim() || undefined,
      company: form.company?.trim() || undefined,
      industry:
        form.industry === "Other"
          ? form.industryOther?.trim() || "Other"
          : form.industry?.trim() || undefined,
      fundingAmount: form.fundingAmount?.trim() || undefined,
      businessStage: form.businessStage?.trim() || undefined,
    });
    setSubmitting(false);
    if (!ok) {
      setError("Could not submit right now. Please try again.");
      return;
    }
    setForm(initialForm);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-ori-black flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <h1 className="font-display text-2xl font-bold text-ori-foreground">
            Thank you
          </h1>
          <p className="mt-4 text-ori-muted">
            Your feedback has been submitted. We appreciate you taking the time to share your experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ori-black flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        <h1 className="font-display text-2xl font-bold text-ori-foreground text-center">
          Share your experience
        </h1>
        <p className="mt-2 text-sm text-ori-muted text-center">
          Your feedback helps us improve. Name, location, and company are optional except where noted.
        </p>
        {error ? (
          <p className="mt-4 text-center text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            label="Client name"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Jane Doe"
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="e.g. Nashville"
          />
          <Input
            label="Company name (optional)"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="e.g. Logistics"
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-ori-foreground">Industry</label>
            <select
              value={form.industry ?? ""}
              onChange={(e) => update("industry", e.target.value)}
              className="w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground focus:border-ori-accent focus:outline-none focus:ring-1 focus:ring-ori-accent"
            >
              <option value="">Select industry</option>
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          {form.industry === "Other" ? (
            <Input
              label="Other industry"
              value={form.industryOther ?? ""}
              onChange={(e) => update("industryOther", e.target.value)}
              placeholder="Enter industry"
            />
          ) : null}
          <Input
            label="Funding amount"
            value={form.fundingAmount ?? ""}
            onChange={(e) => update("fundingAmount", e.target.value)}
            placeholder="e.g. $50,000"
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-ori-foreground">
              New or existing business
            </label>
            <select
              value={form.businessStage ?? ""}
              onChange={(e) => update("businessStage", e.target.value)}
              className="w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground focus:border-ori-accent focus:outline-none focus:ring-1 focus:ring-ori-accent"
            >
              {BUSINESS_STAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ori-foreground">
              Feedback
            </label>
            <textarea
              required
              value={form.feedback}
              onChange={(e) => update("feedback", e.target.value)}
              placeholder="Your experience or quote"
              rows={4}
              className="w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground placeholder:text-ori-muted focus:border-ori-accent focus:outline-none focus:ring-1 focus:ring-ori-accent"
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
