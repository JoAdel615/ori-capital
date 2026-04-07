/**
 * Server-only: charge via eCrypt Payment API (transact.php).
 * @see https://ecrypt.transactiongateway.com/merchants/resources/integration/integration_portal.php
 */

import { computeOrderSummary, type SelectedEnrollments } from "../src/data/fundingReadinessPricing";
import { isGatewayApproved, parseTransResponse } from "../src/lib/ecrypt/parseTransResponse";

export const ECRYPT_TRANSACT_URL = "https://ecrypt.transactiongateway.com/api/transact.php";

export interface BillingPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface ChargeRequestBody {
  paymentToken: string;
  enrollments: SelectedEnrollments;
  billing: BillingPayload;
}

function formatAmount(dollars: number): string {
  return dollars.toFixed(2);
}

function buildOrderDescription(enrollments: SelectedEnrollments): string {
  const { lines } = computeOrderSummary(enrollments);
  return lines.map((l) => l.label).join("; ").slice(0, 255);
}

export interface ChargeSuccess {
  ok: true;
  transactionId: string;
  authCode: string;
  responseText: string;
  customerVaultId?: string;
}

export interface ChargeFailure {
  ok: false;
  error: string;
  responseText?: string;
  gatewayCode?: string;
}

export type ChargeResult = ChargeSuccess | ChargeFailure;

export async function chargeEnrollmentSale(
  body: ChargeRequestBody,
  options: {
    securityKey: string;
    /** If true, store payment method in Customer Vault on approval (requires vault feature on account). */
    addToCustomerVault?: boolean;
    /**
     * One-off sandbox: sends test_mode=enabled (eCrypt Payment API). Use with official test cards + exp 10/25 (MMYY 1025).
     */
    testMode?: boolean;
  }
): Promise<ChargeResult> {
  const token = body.paymentToken?.trim();
  if (!token) {
    return { ok: false, error: "Missing payment token" };
  }

  const summary = computeOrderSummary(body.enrollments);
  if (summary.lines.length === 0 || summary.dueTodayTotal <= 0) {
    return { ok: false, error: "Invalid enrollment selection or amount" };
  }

  const billing = body.billing;
  if (
    !billing.firstName?.trim() ||
    !billing.lastName?.trim() ||
    !billing.email?.trim() ||
    !billing.phone?.trim() ||
    !billing.address1?.trim() ||
    !billing.city?.trim() ||
    !billing.state?.trim() ||
    !billing.zip?.trim()
  ) {
    return { ok: false, error: "Incomplete billing information" };
  }

  const params = new URLSearchParams();
  params.set("type", "sale");
  params.set("security_key", options.securityKey);
  params.set("payment_token", token);
  params.set("amount", formatAmount(summary.dueTodayTotal));
  params.set("orderid", `ori_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);
  params.set("order_description", buildOrderDescription(body.enrollments));

  params.set("first_name", billing.firstName.trim());
  params.set("last_name", billing.lastName.trim());
  params.set("email", billing.email.trim());
  params.set("phone", billing.phone.trim().replace(/\D/g, "").slice(0, 20));
  params.set("address1", billing.address1.trim());
  if (billing.address2?.trim()) params.set("address2", billing.address2.trim());
  params.set("city", billing.city.trim());
  params.set("state", billing.state.trim().slice(0, 2).toUpperCase());
  params.set("zip", billing.zip.trim());
  if (billing.company?.trim()) params.set("company", billing.company.trim());

  if (options.addToCustomerVault) {
    params.set("customer_vault", "add_customer");
  }

  if (options.testMode) {
    params.set("test_mode", "enabled");
  }

  let resText: string;
  try {
    const res = await fetch(ECRYPT_TRANSACT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/plain, */*",
      },
      body: params.toString(),
    });
    resText = await res.text();
  } catch (e) {
    return { ok: false, error: `Gateway request failed: ${e instanceof Error ? e.message : String(e)}` };
  }

  const parsed = parseTransResponse(resText);
  if (!isGatewayApproved(parsed)) {
    const msg =
      parsed.responsetext ||
      parsed["response_text"] ||
      (resText.startsWith("<") ? "Unexpected HTML response from gateway" : resText.slice(0, 200));
    return {
      ok: false,
      error: msg || "Transaction declined",
      responseText: parsed.responsetext,
      gatewayCode: parsed.response_code,
    };
  }

  return {
    ok: true,
    transactionId: parsed.transactionid || "",
    authCode: parsed.authcode || "",
    responseText: parsed.responsetext || "Approved",
    customerVaultId: parsed.customer_vault_id,
  };
}
