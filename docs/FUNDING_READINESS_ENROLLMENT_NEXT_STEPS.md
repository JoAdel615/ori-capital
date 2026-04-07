# Funding Readiness Accelerator — Next Steps

Notes for completing the enrollment flow and backend integration.

## 1. Payment / eCrypt integration

- The checkout page shows **standard payment fields** (cardholder name, card number, expiration, CVV, billing ZIP and address). These are UI-only; no payment is processed client-side.
- **Backend:** Connect the form submission to your eCrypt (or other) payment gateway. Send `CheckoutFormData` (contact + payment fields) and `selectedEnrollments` (individual/business, tier, billing per type) to your API.
- Compute totals and any gateway-specific payload (e.g. tokenization) on the server. Do not send raw card numbers to a non-payment endpoint; use your gateway’s tokenization or hosted fields if required.

## 2. Enrollment API

- In `src/pages/AcceleratorEnrollmentPage.tsx`, update `handleSubmit` to:
  - Send `formData` (`CheckoutFormData`) and `selectedEnrollments` to your API (registration, CRM metadata, payment).
  - On success, set `submitted` to show the confirmation view.
  - On error, show a message and keep the form open.

## 3. CRM metadata

- Add any extra fields to `CheckoutFormData` and the form (e.g. source, campaign, UTM params).
- Include them in the same payload sent to your backend/CRM.

## 4. Post-enrollment

- After successful payment, trigger your “email invite to register and complete onboarding” flow.
