/**
 * eCrypt Three-Step Redirect API helpers.
 * Step 1: init transaction + form-url
 * Step 3: complete-action with token-id
 */

import { computeOrderSummary, type SelectedEnrollments } from "../src/data/fundingReadinessPricing";
import type { BillingPayload } from "./ecryptCharge";

export const ECRYPT_THREE_STEP_URL = "https://ecrypt.transactiongateway.com/api/v2/three-step";

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function tag(name: string, value: string): string {
  return `<${name}>${xmlEscape(value)}</${name}>`;
}

function getTag(xml: string, name: string): string | null {
  const rx = new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, "i");
  const match = rx.exec(xml);
  return match ? match[1].trim() : null;
}

async function postXml(xmlBody: string): Promise<string> {
  const res = await fetch(ECRYPT_THREE_STEP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
      Accept: "text/xml, application/xml, */*",
    },
    body: xmlBody,
  });
  return await res.text();
}

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

/** Step One expects state as a 2-letter subdivision code (see eCrypt Three-Step docs). */
const US_STATE_NAME_TO_ABBR: Record<string, string> = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  "district of columbia": "DC",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
};

function normalizeStepOneState(state: string): string {
  const s = state.trim();
  if (!s) return s;
  if (/^[a-zA-Z]{2}$/.test(s)) return s.toUpperCase();
  const abbr = US_STATE_NAME_TO_ABBR[s.toLowerCase()];
  return abbr ?? s.toUpperCase().slice(0, 2);
}

function buildOrderDescription(enrollments: SelectedEnrollments): string {
  const summary = computeOrderSummary(enrollments);
  return summary.lines.map((l) => l.label).join("; ").slice(0, 255);
}

export interface ThreeStepInitRequest {
  enrollments: SelectedEnrollments;
  billing: BillingPayload;
  redirectUrl: string;
}

export interface ThreeStepInitResult {
  ok: true;
  formUrl: string;
  amount: string;
}

export interface ThreeStepError {
  ok: false;
  error: string;
  result?: string;
  resultText?: string;
}

export type ThreeStepInitResponse = ThreeStepInitResult | ThreeStepError;

export async function initThreeStepSale(
  req: ThreeStepInitRequest,
  options: {
    securityKey: string;
    addToCustomerVault?: boolean;
  }
): Promise<ThreeStepInitResponse> {
  const summary = computeOrderSummary(req.enrollments);
  if (summary.lines.length === 0 || summary.dueTodayTotal <= 0) {
    return { ok: false, error: "Invalid enrollment selection or amount" };
  }

  const b = req.billing;
  if (
    !b.firstName?.trim() ||
    !b.lastName?.trim() ||
    !b.email?.trim() ||
    !b.phone?.trim() ||
    !b.address1?.trim() ||
    !b.city?.trim() ||
    !b.state?.trim() ||
    !b.zip?.trim()
  ) {
    return { ok: false, error: "Incomplete billing information" };
  }

  const amount = formatAmount(summary.dueTodayTotal);

  // Billing fields must be nested under <billing>, not as direct children of <sale>
  // (see eCrypt Three-Step PHP sample: appendChild billing element with first-name, etc.).
  const billingInner = [
    tag("first-name", b.firstName.trim()),
    tag("last-name", b.lastName.trim()),
    tag("email", b.email.trim()),
    tag("phone", b.phone.trim().replace(/\D/g, "").slice(0, 20)),
    tag("address1", b.address1.trim()),
    b.address2?.trim() ? tag("address2", b.address2.trim()) : "",
    tag("city", b.city.trim()),
    tag("state", normalizeStepOneState(b.state)),
    tag("postal", b.zip.trim()),
    tag("country", "US"),
    b.company?.trim() ? tag("company", b.company.trim()) : "",
  ]
    .filter(Boolean)
    .join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    "<sale>",
    tag("api-key", options.securityKey),
    tag("redirect-url", req.redirectUrl),
    tag("amount", amount),
    tag("order-description", buildOrderDescription(req.enrollments)),
    `<billing>${billingInner}</billing>`,
    options.addToCustomerVault ? tag("customer-vault", "add-customer") : "",
    "</sale>",
  ]
    .filter(Boolean)
    .join("");

  let responseText = "";
  try {
    responseText = await postXml(xml);
  } catch (err) {
    return {
      ok: false,
      error: `Three-Step Step 1 request failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  const result = getTag(responseText, "result") || "";
  const resultText = getTag(responseText, "result-text") || "";
  const formUrl = getTag(responseText, "form-url") || "";

  if (result !== "1" || !formUrl) {
    return {
      ok: false,
      error: resultText || "Step 1 failed",
      result,
      resultText,
    };
  }

  return { ok: true, formUrl, amount };
}

export interface ThreeStepCompleteSuccess {
  ok: true;
  transactionId: string;
  authCode: string;
  resultText: string;
  customerVaultId?: string;
}

export type ThreeStepCompleteResponse = ThreeStepCompleteSuccess | ThreeStepError;

export async function completeThreeStepSale(
  tokenId: string,
  options: { securityKey: string }
): Promise<ThreeStepCompleteResponse> {
  const token = tokenId.trim();
  if (!token) return { ok: false, error: "Missing token-id" };

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    "<complete-action>" +
    tag("api-key", options.securityKey) +
    tag("token-id", token) +
    "</complete-action>";

  let responseText = "";
  try {
    responseText = await postXml(xml);
  } catch (err) {
    return {
      ok: false,
      error: `Three-Step Step 3 request failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  const result = getTag(responseText, "result") || "";
  const resultText = getTag(responseText, "result-text") || "";

  if (result !== "1") {
    return {
      ok: false,
      error: resultText || "Transaction declined",
      result,
      resultText,
    };
  }

  return {
    ok: true,
    transactionId: getTag(responseText, "transaction-id") || "",
    authCode: getTag(responseText, "authorization-code") || "",
    resultText: resultText || "Approved",
    customerVaultId: getTag(responseText, "customer-vault-id") || undefined,
  };
}
