/**
 * Enrollment checkout form (Three-Step Redirect).
 * Step One submits non-sensitive data server-side; card details are collected in Step Two on the gateway post URL.
 */
/* eslint-disable react-refresh/only-export-components -- shared checkout types/constants for enrollment flow */

import { Button } from "../Button";
import { Input } from "../Input";
import { SegmentedToggle } from "../SegmentedToggle";
import { useMemo } from "react";
import type { BillingType, TierId, SelectedEnrollments } from "../../data/fundingReadinessPricing";
import {
  PLANS,
  BILLING_TYPES,
  computeOrderSummary,
  formatPrice,
  getPlanPriceDisplay,
  getIndividualStandalonePriceDisplay,
  individualTierDisplayName,
} from "../../data/fundingReadinessPricing";
import { ROUTES } from "../../utils/navigation";
import { FundingReadinessCrossSellCard } from "../FundingReadinessCrossSellCard";

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
}

export const initialCheckoutFormData: CheckoutFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  businessName: "",
  streetAddress: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
};

export interface AcceleratorPayPayload {
  formData: CheckoutFormData;
  selectedEnrollments: SelectedEnrollments;
}

interface AcceleratorEnrollmentFormProps {
  selectedEnrollments: SelectedEnrollments;
  onEnrollmentsChange: (next: SelectedEnrollments) => void;
  formData: CheckoutFormData;
  onFormChange: (data: CheckoutFormData) => void;
  onPay: (payload: AcceleratorPayPayload) => Promise<void>;
  submitting?: boolean;
  paymentError?: string | null;
}

const TIER_OPTIONS = PLANS.map((p) => ({ value: p.id, label: p.displayName }));
const INDIVIDUAL_TIER_OPTIONS: { value: TierId; label: string }[] = [
  { value: "core", label: "Individual Core" },
  { value: "strategy", label: "Individual Plus" },
];
const BILLING_OPTIONS = BILLING_TYPES.map((b) => ({ value: b.value, label: b.label }));

export function AcceleratorEnrollmentForm({
  selectedEnrollments,
  onEnrollmentsChange,
  formData,
  onFormChange,
  onPay,
  submitting = false,
  paymentError,
}: AcceleratorEnrollmentFormProps) {
  const update = <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) =>
    onFormChange({ ...formData, [key]: value });

  const isStandalone = !!selectedEnrollments.individualStandalone;

  const setBusiness = (tier: TierId, billing: BillingType) =>
    onEnrollmentsChange({
      business: { tier, billing },
    });

  const setIndividualStandalone = (tier: TierId, billing: BillingType) =>
    onEnrollmentsChange({
      individualStandalone: { tier, billing },
      businessAddOn: selectedEnrollments.businessAddOn,
    });

  const setBusinessAddOnEnabled = (enabled: boolean) =>
    onEnrollmentsChange({
      ...selectedEnrollments,
      businessAddOn: enabled ? { tier: selectedEnrollments.businessAddOn?.tier ?? "core" } : undefined,
    });

  const setBusinessAddOnTier = (tier: TierId) =>
    onEnrollmentsChange({
      ...selectedEnrollments,
      businessAddOn: { tier },
    });

  const billingOk =
    formData.streetAddress.trim() &&
    formData.city.trim() &&
    formData.state.trim() &&
    formData.postalCode.trim();
  const needsBusinessName =
    !isStandalone || !!selectedEnrollments.businessAddOn;
  const canContinue =
    (isStandalone || !!selectedEnrollments.business) &&
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    (!needsBusinessName || formData.businessName.trim()) &&
    billingOk;

  async function handleContinue() {
    if (!canContinue || submitting) return;
    await onPay({ formData, selectedEnrollments });
  }

  const sectionClass = "space-y-3 rounded-lg border border-ori-border bg-ori-charcoal/40 p-4";
  const headingClass = "font-display text-sm font-semibold text-ori-foreground";
  const inputClass = "py-2 px-2.5 text-sm";
  const summary = useMemo(() => computeOrderSummary(selectedEnrollments), [selectedEnrollments]);

  const planSummary = useMemo(() => {
    if (selectedEnrollments.individualStandalone) {
      return getIndividualStandalonePriceDisplay(
        selectedEnrollments.individualStandalone.billing,
        selectedEnrollments.individualStandalone.tier
      );
    }
    const plan = PLANS.find((p) => p.id === selectedEnrollments.business?.tier);
    if (!plan || !selectedEnrollments.business) return null;
    return getPlanPriceDisplay(plan, selectedEnrollments.business.billing);
  }, [selectedEnrollments.business, selectedEnrollments.individualStandalone]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2 xl:gap-6">
        <div className="space-y-4">
          <section className={sectionClass}>
            <h2 className={headingClass}>Contact Information</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                className={inputClass}
              />
              <Input
                label="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                className={inputClass}
              />
            </div>
            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
            />
            <Input
              label="Phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass}
            />
            <Input
              label={needsBusinessName ? "Business name" : "Business name (optional)"}
              required={needsBusinessName}
              value={formData.businessName}
              onChange={(e) => update("businessName", e.target.value)}
              placeholder={needsBusinessName ? "Legal or DBA name" : "Legal or DBA, if applicable"}
              className={inputClass}
            />
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Plan</h2>
            {selectedEnrollments.individualStandalone ? (
              <div className="space-y-3 rounded-lg border border-ori-border bg-ori-surface/40 px-3 py-3">
                <div>
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-ori-muted">Tier</p>
                  <SegmentedToggle
                    options={INDIVIDUAL_TIER_OPTIONS}
                    value={selectedEnrollments.individualStandalone.tier}
                    onChange={(v) =>
                      setIndividualStandalone(v as TierId, selectedEnrollments.individualStandalone!.billing)
                    }
                    ariaLabel="Individual Core or Individual Plus"
                  />
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-ori-muted">Billing</p>
                  <SegmentedToggle
                    options={BILLING_OPTIONS}
                    value={selectedEnrollments.individualStandalone.billing}
                    onChange={(v) =>
                      setIndividualStandalone(selectedEnrollments.individualStandalone!.tier, v as BillingType)
                    }
                    ariaLabel="Weekly, monthly, or pay in full"
                  />
                </div>
                {planSummary ? (
                  <div className="rounded-md border border-ori-border bg-ori-surface/60 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-ori-muted">
                      {individualTierDisplayName(selectedEnrollments.individualStandalone.tier)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ori-accent">{planSummary.primary}</p>
                    <p className="mt-0.5 text-xs text-ori-muted">{planSummary.durationNote}</p>
                  </div>
                ) : null}

                <div className="rounded-md border border-ori-border bg-ori-surface/60 p-3">
                  <label className="flex cursor-pointer items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ori-foreground">Add business funding readiness</p>
                      <p className="mt-1 text-xs text-ori-muted">
                        Include Business Core or Business Pro at the same billing cadence (company name required).
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!selectedEnrollments.businessAddOn}
                      onChange={(e) => setBusinessAddOnEnabled(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-ori-border bg-ori-charcoal text-ori-accent focus:ring-ori-accent"
                      aria-label="Add Business Core or Business Pro"
                    />
                  </label>
                  {selectedEnrollments.businessAddOn ? (
                    <div className="mt-3">
                      <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-ori-muted">Business tier</p>
                      <SegmentedToggle
                        options={TIER_OPTIONS}
                        value={selectedEnrollments.businessAddOn.tier}
                        onChange={(v) => setBusinessAddOnTier(v as TierId)}
                        ariaLabel="Business Core or Business Pro"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ) : selectedEnrollments.business ? (
              <div className="space-y-3 rounded-lg border border-ori-border bg-ori-surface/40 px-3 py-3">
                <div>
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-ori-muted">Tier</p>
                  <SegmentedToggle
                    options={TIER_OPTIONS}
                    value={selectedEnrollments.business.tier}
                    onChange={(v) => setBusiness(v as TierId, selectedEnrollments.business!.billing)}
                    ariaLabel="Plan tier"
                  />
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-ori-muted">Billing</p>
                  <SegmentedToggle
                    options={BILLING_OPTIONS}
                    value={selectedEnrollments.business.billing}
                    onChange={(v) => setBusiness(selectedEnrollments.business!.tier, v as BillingType)}
                    ariaLabel="Weekly, monthly, or pay in full"
                  />
                </div>

                {planSummary ? (
                  <div className="rounded-md border border-ori-border bg-ori-surface/60 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-ori-muted">
                      {selectedEnrollments.business
                        ? PLANS.find((p) => p.id === selectedEnrollments.business!.tier)?.displayName
                        : "Business plan"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ori-accent">{planSummary.primary}</p>
                    <p className="mt-0.5 text-xs text-ori-muted">{planSummary.durationNote}</p>
                  </div>
                ) : null}

                <FundingReadinessCrossSellCard
                  title="Need individual funding readiness too?"
                  description="Funding readiness: Individual Core or Individual Plus—enroll separately on the individual track."
                  ctaLabel="View individual plans"
                  to={ROUTES.FUNDING_READINESS_INDIVIDUAL}
                />
              </div>
            ) : (
              <p className="text-xs text-ori-muted">Loading plan selection…</p>
            )}
          </section>
        </div>

        <div className="space-y-4">
          <section className={sectionClass}>
            <h2 className={headingClass}>Billing Address</h2>
            <Input
              label="Street"
              required
              value={formData.streetAddress}
              onChange={(e) => update("streetAddress", e.target.value)}
              className={inputClass}
            />
            <Input
              label="Line 2 (optional)"
              value={formData.addressLine2}
              onChange={(e) => update("addressLine2", e.target.value)}
              className={inputClass}
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="City"
                required
                value={formData.city}
                onChange={(e) => update("city", e.target.value)}
                className={inputClass}
              />
              <Input
                label="State"
                required
                value={formData.state}
                onChange={(e) => update("state", e.target.value)}
                className={inputClass}
              />
              <Input
                label="ZIP"
                required
                value={formData.postalCode}
                onChange={(e) => update("postalCode", e.target.value)}
                className={inputClass}
              />
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Order Summary</h2>
            <div className="rounded-lg border border-ori-border bg-ori-surface/40 p-3">
              {summary.lines.length === 0 ? (
                <p className="text-xs text-ori-muted">Select at least one enrollment to see your total.</p>
              ) : (
                <>
                  <ul className="space-y-2">
                    {summary.lines.map((line, i) => (
                      <li key={i} className="flex justify-between gap-2 text-xs leading-relaxed">
                        <span className="text-ori-foreground">{line.label}</span>
                        <span className="shrink-0 font-medium text-ori-foreground">{line.amount}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 border-t border-ori-border pt-3">
                    <div className="flex justify-between text-xs font-semibold text-ori-foreground">
                      <span>Due today</span>
                      <span>{formatPrice(summary.dueTodayTotal)}</span>
                    </div>
                    {summary.hasRecurring && summary.recurringNote ? (
                      <p className="mt-1 text-[11px] text-ori-muted">Recurring: {summary.recurringNote}</p>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="pt-1">
        {paymentError && (
          <p className="mb-2 rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-2 text-center text-xs text-red-100">
            {paymentError}
          </p>
        )}
        <Button
          type="button"
          className="w-full"
          size="lg"
          disabled={submitting || !canContinue}
          onClick={handleContinue}
        >
          {submitting ? "Preparing secure checkout..." : "Continue to secure card entry"}
        </Button>
      </div>
    </div>
  );
}
