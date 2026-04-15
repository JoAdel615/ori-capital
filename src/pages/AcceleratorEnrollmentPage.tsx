/**
 * Full-page checkout for Funding Readiness Accelerator.
 * Step 1 of eCrypt Three-Step Redirect.
 */

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PageSection, PageContainer } from "../components/system";
import {
  AcceleratorEnrollmentForm,
  initialCheckoutFormData,
  type AcceleratorPayPayload,
  type EnrollmentPaymentMethod,
} from "../components/accelerator-enrollment";
import type { CheckoutFormData } from "../components/accelerator-enrollment";
import { apiUrl } from "../lib/apiBase";
import { ROUTES } from "../utils/navigation";
import {
  computeOrderSummary,
  type BillingType,
  type SelectedEnrollments,
} from "../data/fundingReadinessPricing";
import { getCheckoutPricing } from "../lib/checkoutPromotions";
import { resolveCheckoutReferralCode } from "../lib/referral/attribution";

function parseBillingParam(v: string | null): BillingType | undefined {
  if (v === "weekly" || v === "monthly" || v === "full") return v;
  return undefined;
}

export function AcceleratorEnrollmentPage() {
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get("plan");
  const productParam = searchParams.get("product");
  const billingParam = searchParams.get("billing");
  const paymentMethodParam = searchParams.get("paymentMethod");

  const initialEnrollments = useMemo((): SelectedEnrollments => {
    if (productParam === "individual") {
      const billing = parseBillingParam(billingParam) ?? "monthly";
      const tier = planParam === "strategy" ? "strategy" : "core";
      return { individualStandalone: { tier, billing } };
    }
    const tier = planParam === "strategy" ? "strategy" : "core";
    const billing = parseBillingParam(billingParam) ?? "monthly";
    return { business: { tier, billing } };
  }, [planParam, productParam, billingParam]);

  const [selectedEnrollments, setSelectedEnrollments] = useState<SelectedEnrollments>(initialEnrollments);
  const [paymentMethod, setPaymentMethod] = useState<EnrollmentPaymentMethod>(() => {
    if (paymentMethodParam === "bank" || paymentMethodParam === "paypal" || paymentMethodParam === "card") {
      return paymentMethodParam;
    }
    return "card";
  });

  useEffect(() => {
    setSelectedEnrollments(initialEnrollments);
  }, [initialEnrollments]);
  useEffect(() => {
    if (paymentMethodParam === "bank" || paymentMethodParam === "paypal" || paymentMethodParam === "card") {
      setPaymentMethod(paymentMethodParam);
    }
  }, [paymentMethodParam]);
  const [formData, setFormData] = useState<CheckoutFormData>(initialCheckoutFormData);
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const isIndividualOnly = !!initialEnrollments.individualStandalone;

  async function handlePay(payload: AcceleratorPayPayload) {
    setSubmitting(true);
    setPaymentError(null);
    try {
      const summary = computeOrderSummary(payload.selectedEnrollments);
      if (summary.dueTodayTotal <= 0) {
        setPaymentError("Select at least one enrollment with a valid total.");
        return;
      }
      const pricing = getCheckoutPricing(payload.selectedEnrollments, payload.promoCode);
      if (pricing.dueTodayTotal <= 0) {
        setPaymentError("Order total must be greater than zero.");
        return;
      }

      const referralForCheckout = resolveCheckoutReferralCode({
        ref: searchParams.get("ref"),
        referral: searchParams.get("referral"),
      });

      const res = await fetch(apiUrl("/api/payments/three-step/init"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollments: payload.selectedEnrollments,
          billing: {
            firstName: payload.formData.firstName,
            lastName: payload.formData.lastName,
            email: payload.formData.email,
            phone: payload.formData.phone,
            company: payload.formData.businessName || undefined,
            address1: payload.formData.streetAddress,
            address2: payload.formData.addressLine2 || undefined,
            city: payload.formData.city,
            state: payload.formData.state,
            zip: payload.formData.postalCode,
          },
          referralCode: referralForCheckout || undefined,
          promoCode: payload.promoCode || undefined,
          paymentMethod: payload.paymentMethod,
          returnOrigin: window.location.origin,
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string; redirectTo?: string };
      if (!res.ok || !data.ok || !data.redirectTo) {
        setPaymentError(data.error || "Could not start secure card entry.");
        return;
      }

      window.location.assign(data.redirectTo);
    } catch {
      setPaymentError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageSection variant="tight" className="border-b border-ori-border bg-ori-section-alt">
        <PageContainer>
          <div className="mb-1">
            <Link
              to={isIndividualOnly ? ROUTES.FUNDING_READINESS_INDIVIDUAL : ROUTES.FUNDING_READINESS}
              className="text-sm text-ori-muted hover:text-ori-accent"
            >
              {isIndividualOnly ? "← Back to individual plans" : "← Back to plans"}
            </Link>
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight text-ori-foreground md:text-2xl">
            {isIndividualOnly ? "Get funding-ready" : "Start Your Funding Readiness Accelerator"}
          </h1>
          <p className="mt-1 text-sm text-ori-muted">
            {isIndividualOnly
              ? "Confirm Individual Core or Individual Plus, billing, and optional Business Core or Pro, then continue to secure card entry."
              : "Choose Business Core or Business Pro, then continue to secure card entry. Need individual only? Use the link in the plan section."}
          </p>
          <div className="mt-3 grid gap-2 text-[11px] text-ori-muted sm:grid-cols-3">
            <div className="rounded-md border border-ori-border bg-ori-surface/40 px-2 py-1.5">Step 1: Info</div>
            <div className="rounded-md border border-ori-border bg-ori-surface/40 px-2 py-1.5">Step 2: Plan</div>
            <div className="rounded-md border border-ori-border bg-ori-surface/40 px-2 py-1.5">Step 3: Payment</div>
          </div>
        </PageContainer>
      </PageSection>

      <PageSection variant="tight" className="bg-ori-black">
        <PageContainer>
          <div className="min-w-0 rounded-xl border border-ori-border bg-ori-surface/70 p-4 md:p-5">
            <AcceleratorEnrollmentForm
              selectedEnrollments={selectedEnrollments}
              onEnrollmentsChange={setSelectedEnrollments}
              formData={formData}
              onFormChange={setFormData}
              onPay={handlePay}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              submitting={submitting}
              paymentError={paymentError}
            />
          </div>
        </PageContainer>
      </PageSection>
    </>
  );
}
