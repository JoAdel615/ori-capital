/**
 * Modal for Funding Readiness Accelerator enrollment (optional; main flow is dedicated page).
 * Uses same form as enrollment page with local state.
 */

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { AcceleratorEnrollmentForm } from "./AcceleratorEnrollmentForm";
import { AcceleratorEnrollmentConfirmation } from "./AcceleratorEnrollmentConfirmation";
import { initialCheckoutFormData } from "./AcceleratorEnrollmentForm";
import type { AcceleratorPayPayload, CheckoutFormData, EnrollmentPaymentMethod } from "./AcceleratorEnrollmentForm";
import type { SelectedEnrollments } from "../../data/fundingReadinessPricing";

const MODAL_OVERLAY_Z = 9998;

interface AcceleratorEnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  selectedPlan: "core" | "strategy";
  onPay: (payload: AcceleratorPayPayload) => Promise<void>;
  submitted: boolean;
  submitting?: boolean;
  paymentError?: string | null;
}

export function AcceleratorEnrollmentModal({
  open,
  onClose,
  selectedPlan,
  onPay,
  submitted,
  submitting = false,
  paymentError,
}: AcceleratorEnrollmentModalProps) {
  const panelRef = useMemo(() => ({ current: null as HTMLDivElement | null }), []);
  const initialEnrollments: SelectedEnrollments = useMemo(
    () => ({ business: { tier: selectedPlan, billing: "monthly" } }),
    [selectedPlan]
  );
  const [selectedEnrollments, setSelectedEnrollments] = useState<SelectedEnrollments>(initialEnrollments);

  useEffect(() => {
    if (!open) return;
    setSelectedEnrollments(initialEnrollments);
    setPaymentMethod("card");
  }, [open, initialEnrollments]);
  const [formData, setFormData] = useState<CheckoutFormData>(initialCheckoutFormData);
  const [paymentMethod, setPaymentMethod] = useState<EnrollmentPaymentMethod>("card");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const modal = (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        style={{ zIndex: MODAL_OVERLAY_Z }}
        aria-hidden
        onClick={onClose}
      />
      <div
        ref={(el) => { panelRef.current = el; }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enrollment-modal-title"
        className="fixed left-1/2 top-1/2 z-[9999] w-[min(100vw-2rem,36rem)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 flex flex-col rounded-2xl border border-ori-border bg-ori-charcoal shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 flex justify-end border-b border-ori-border bg-ori-charcoal/95 p-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-ori-muted hover:bg-ori-surface hover:text-ori-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 md:p-8">
            <h1
              id="enrollment-modal-title"
              className="font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl"
            >
              Start Your Funding Readiness Accelerator
            </h1>

            {submitted ? (
              <div className="mt-8">
                <AcceleratorEnrollmentConfirmation />
              </div>
            ) : (
              <div className="mt-8">
                <AcceleratorEnrollmentForm
                  selectedEnrollments={selectedEnrollments}
                  onEnrollmentsChange={setSelectedEnrollments}
                  formData={formData}
                  onFormChange={setFormData}
                  onPay={onPay}
                  paymentMethod={paymentMethod}
                  onPaymentMethodChange={setPaymentMethod}
                  submitting={submitting}
                  paymentError={paymentError}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}
