/**
 * Connect-style middleware for payment endpoints (Vite dev + preview).
 *
 * Referral attribution uses partner `referralCode` matching checkout `referralCode` (referral links).
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import { readState, writeState } from "./backofficeStore.js";
import type { ChargeRequestBody } from "./ecryptCharge";
import { chargeEnrollmentSale } from "./ecryptCharge";
import type { SelectedEnrollments } from "../src/data/fundingReadinessPricing";
import { computeOrderSummary } from "../src/data/fundingReadinessPricing";
import { getCheckoutPricing } from "../src/lib/checkoutPromotions";
import type { BillingPayload } from "./ecryptCharge";
import {
  completeThreeStepSale,
  initThreeStepSale,
  type ThreeStepCompleteResponse,
} from "./ecryptThreeStep";

interface ThreeStepSession {
  sid: string;
  formUrl: string;
  createdAt: number;
  billing?: BillingPayload;
  enrollments?: SelectedEnrollments;
  promoCode?: string;
  referralCode?: string;
  paymentMethod?: "card" | "bank" | "paypal";
}

const threeStepSessions = new Map<string, ThreeStepSession>();
const SESSION_TTL_MS = 1000 * 60 * 60; // 1 hour

/** Step 3 token-id can only be settled once; cache success for refresh + concurrent duplicate POSTs. */
const threeStepCompletedByToken = new Map<
  string,
  { transactionId: string; authCode: string; resultText: string }
>();
const threeStepCompleteInflight = new Map<string, Promise<ThreeStepCompleteResponse>>();

function nowIso(): string {
  return new Date().toISOString();
}

function id(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function syncPurchaseToBackoffice(input: {
  billing?: BillingPayload;
  enrollments?: SelectedEnrollments;
  promoCode?: string;
  referralCode?: string;
}): void {
  if (!input.billing?.email) return;
  const state = readState();
  state.contacts = Array.isArray(state.contacts) ? state.contacts : [];
  state.leads = Array.isArray(state.leads) ? state.leads : [];
  state.subscriptions = Array.isArray(state.subscriptions) ? state.subscriptions : [];
  state.commissions = Array.isArray(state.commissions) ? state.commissions : [];
  state.partners = Array.isArray(state.partners) ? state.partners : [];
  state.promoCodes = Array.isArray(state.promoCodes) ? state.promoCodes : [];
  state.activities = Array.isArray(state.activities) ? state.activities : [];

  const email = input.billing.email.trim().toLowerCase();
  const fullName = `${input.billing.firstName || ""} ${input.billing.lastName || ""}`.trim();
  const [firstName, ...rest] = fullName.split(/\s+/).filter(Boolean);
  let contact = state.contacts.find((c: any) => String(c.email || "").toLowerCase() === email);
  if (!contact) {
    contact = {
      id: id("ct"),
      firstName: firstName || "Unknown",
      lastName: rest.join(" "),
      email,
      phone: input.billing.phone || "",
      source: "SUBSCRIPTION_CHECKOUT",
      tags: ["subscriber"],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    state.contacts.unshift(contact);
  } else {
    contact.updatedAt = nowIso();
  }

  const partner = state.partners.find(
    (p: any) => String(p.referralCode || "").toUpperCase() === String(input.referralCode || "").toUpperCase()
  );
  const partnerId = partner?.id;

  let lead = state.leads.find((l: any) => l.contactId === contact.id && l.sourceType === "SUBSCRIPTION_CHECKOUT");
  if (!lead) {
    lead = {
      id: id("lead"),
      contactId: contact.id,
      ctaType: "PREQUAL",
      sourceType: "SUBSCRIPTION_CHECKOUT",
      sourceDetail: "Funding Readiness Enrollment",
      partnerId,
      status: "Pre-Qualify",
      intakePayload: {
        enrollments: input.enrollments,
        promoCode: input.promoCode,
        referralCode: input.referralCode,
      },
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    state.leads.unshift(lead);
  } else {
    lead.partnerId = lead.partnerId || partnerId;
    lead.updatedAt = nowIso();
  }

  const summary = computeOrderSummary((input.enrollments || {}) as SelectedEnrollments);
  const pricing = getCheckoutPricing((input.enrollments || {}) as SelectedEnrollments, input.promoCode);
  const existingSub = state.subscriptions.find((s: any) => s.leadId === lead.id);
  if (!existingSub) {
    state.subscriptions.unshift({
      id: id("sub"),
      leadId: lead.id,
      planName: summary.lines.map((l) => l.label).join(" + ").slice(0, 160) || "Funding Readiness",
      billingStatus: "Current",
      paymentStatus: "Paid",
      subscriptionStatus: "Active Client",
      startedAt: nowIso(),
      inviteStatus: "Invited",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
  }

  if (partnerId && pricing.dueTodayTotal > 0) {
    const alreadyEarned = state.commissions.some(
      (c: any) =>
        String(c.partnerId || "") === String(partnerId) &&
        c.relatedEntityType === "SUBSCRIPTION" &&
        String(c.relatedEntityId || "") === String(lead.id)
    );
    if (!alreadyEarned) {
      const rate = Number(partner.defaultCommissionRate || 0);
      const amount = Number((pricing.dueTodayTotal * rate).toFixed(2));
      state.commissions.unshift({
        id: id("com"),
        partnerId,
        relatedEntityType: "SUBSCRIPTION",
        relatedEntityId: lead.id,
        amount,
        status: "PENDING",
        earnedAt: nowIso(),
        createdAt: nowIso(),
        updatedAt: nowIso(),
      });
    }
  }

  state.activities.unshift({
    id: id("act"),
    entityType: "SUBSCRIPTION",
    entityId: lead.id,
    action: "SUBSCRIPTION_PURCHASE_SYNCED",
    metadata: { partnerId, promoCode: input.promoCode, referralCode: input.referralCode },
    createdAt: nowIso(),
  });
  writeState(state);
}

function isDuplicateGatewayMessage(result: { error?: string; resultText?: string }): boolean {
  const msg = `${result.resultText || ""} ${result.error || ""}`.toLowerCase();
  return msg.includes("duplicate");
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

function getBoolEnv(name: string): boolean {
  const v = process.env[name];
  return v === "1" || v === "true" || v === "enabled" || v === "add_customer";
}

function singleHeader(value: string | string[] | undefined): string {
  if (value === undefined) return "";
  const first = Array.isArray(value) ? value[0] : value;
  return typeof first === "string" ? first.trim() : "";
}

function getOrigin(req: IncomingMessage, candidate?: string): string {
  const c = (candidate || "").trim();
  if (/^https?:\/\//i.test(c)) return c;
  const rawProto = singleHeader(req.headers["x-forwarded-proto"]);
  const firstProto = rawProto.split(",")[0]?.trim().toLowerCase() || "";
  const proto =
    firstProto === "https" || firstProto === "http"
      ? firstProto
      : (req.socket as { encrypted?: boolean }).encrypted
        ? "https"
        : "http";
  const host = singleHeader(req.headers.host) || "localhost:5173";
  return `${proto}://${host}`;
}

function cleanExpiredSessions() {
  const now = Date.now();
  for (const [sid, sess] of threeStepSessions.entries()) {
    if (now - sess.createdAt > SESSION_TTL_MS) threeStepSessions.delete(sid);
  }
}

async function completeThreeStepDeduped(
  tokenId: string,
  sid: string,
  securityKey: string
): Promise<ThreeStepCompleteResponse> {
  const cached = threeStepCompletedByToken.get(tokenId);
  if (cached) {
    return {
      ok: true,
      transactionId: cached.transactionId,
      authCode: cached.authCode,
      resultText: cached.resultText,
    };
  }

  let inflight = threeStepCompleteInflight.get(tokenId);
  if (!inflight) {
    inflight = (async (): Promise<ThreeStepCompleteResponse> => {
      if (!threeStepSessions.has(sid)) {
        return { ok: false, error: "Three-step session not found or expired" };
      }
      const result = await completeThreeStepSale(tokenId, { securityKey });
      if (result.ok) {
        threeStepCompletedByToken.set(tokenId, {
          transactionId: result.transactionId,
          authCode: result.authCode,
          resultText: result.resultText,
        });
        threeStepSessions.delete(sid);
        return result;
      }
      let recovered = threeStepCompletedByToken.get(tokenId);
      if (recovered) {
        return {
          ok: true,
          transactionId: recovered.transactionId,
          authCode: recovered.authCode,
          resultText: recovered.resultText,
        };
      }
      // Second complete-action for the same token (lost in-memory cache on HMR, rare races).
      if (isDuplicateGatewayMessage(result)) {
        recovered = {
          transactionId: "",
          authCode: "",
          resultText: result.resultText || result.error || "Duplicate — already completed",
        };
        threeStepCompletedByToken.set(tokenId, recovered);
        threeStepSessions.delete(sid);
        return {
          ok: true,
          transactionId: recovered.transactionId,
          authCode: recovered.authCode,
          resultText: recovered.resultText,
        };
      }
      return result;
    })();
    threeStepCompleteInflight.set(tokenId, inflight);
    void inflight.finally(() => {
      threeStepCompleteInflight.delete(tokenId);
    });
  }

  return inflight;
}

export function paymentChargeMiddleware() {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const parsedUrl = new URL(req.url || "/", "http://localhost");
    const path = parsedUrl.pathname;

    const securityKey = process.env.ECRYPT_API_KEY?.trim() || process.env.ECRYPT_SECURITY_KEY?.trim() || "";

    // Step 2 page fetches form-url by sid
    if (path === "/api/payments/three-step/session" && req.method === "GET") {
      cleanExpiredSessions();
      const sid = (parsedUrl.searchParams.get("sid") || "").trim();
      if (!sid || !threeStepSessions.has(sid)) {
        sendJson(res, 404, { ok: false, error: "Three-step session not found or expired" });
        return;
      }
      const sess = threeStepSessions.get(sid)!;
      sendJson(res, 200, { ok: true, sid, formUrl: sess.formUrl, paymentMethod: sess.paymentMethod || "card" });
      return;
    }

    // Step 1 init
    if (path === "/api/payments/three-step/init" && req.method === "POST") {
      if (!securityKey) {
        sendJson(res, 503, {
          ok: false,
          error: "Payments are not configured (missing ECRYPT_API_KEY on the server).",
        });
        return;
      }

      let raw = "";
      try {
        raw = await readBody(req);
      } catch {
        sendJson(res, 400, { ok: false, error: "Could not read request body" });
        return;
      }

      let body: {
        enrollments?: SelectedEnrollments;
        billing?: BillingPayload;
        promoCode?: string;
        referralCode?: string;
        ref?: string;
        paymentMethod?: "card" | "bank" | "paypal";
        returnOrigin?: string;
      } = {};
      try {
        body = JSON.parse(raw || "{}");
      } catch {
        sendJson(res, 400, { ok: false, error: "Invalid JSON body" });
        return;
      }

      const sid = `tsp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      const origin = getOrigin(req, body.returnOrigin);
      const redirectUrl = `${origin}/funding-readiness/enroll/three-step/return?sid=${encodeURIComponent(sid)}`;

      const result = await initThreeStepSale(
        {
          enrollments: (body.enrollments || {}) as SelectedEnrollments,
          billing: (body.billing || {}) as BillingPayload,
          redirectUrl,
          promoCode: String(body.promoCode || "").trim() || undefined,
        },
        {
          securityKey,
          addToCustomerVault: getBoolEnv("ECRYPT_CUSTOMER_VAULT"),
        }
      );

      if (!result.ok) {
        sendJson(res, 402, { ok: false, error: result.error, resultText: result.resultText });
        return;
      }

      cleanExpiredSessions();
      threeStepSessions.set(sid, {
        sid,
        formUrl: result.formUrl,
        createdAt: Date.now(),
        billing: body.billing,
        enrollments: body.enrollments,
        promoCode: String(body.promoCode || "").trim() || undefined,
        referralCode: String(body.referralCode || body.ref || "").trim() || undefined,
        paymentMethod:
          body.paymentMethod === "bank" || body.paymentMethod === "paypal" || body.paymentMethod === "card"
            ? body.paymentMethod
            : "card",
      });

      sendJson(res, 200, {
        ok: true,
        sid,
        formUrl: result.formUrl,
        redirectTo: `/funding-readiness/enroll/three-step?sid=${encodeURIComponent(sid)}`,
      });
      return;
    }

    // Step 3 complete
    if (path === "/api/payments/three-step/complete" && req.method === "POST") {
      if (!securityKey) {
        sendJson(res, 503, {
          ok: false,
          error: "Payments are not configured (missing ECRYPT_API_KEY on the server).",
        });
        return;
      }

      let raw = "";
      try {
        raw = await readBody(req);
      } catch {
        sendJson(res, 400, { ok: false, error: "Could not read request body" });
        return;
      }

      let body: { sid?: string; tokenId?: string } = {};
      try {
        body = JSON.parse(raw || "{}");
      } catch {
        sendJson(res, 400, { ok: false, error: "Invalid JSON body" });
        return;
      }

      const sid = (body.sid || "").trim();
      const tokenId = (body.tokenId || "").trim();
      if (!sid || !tokenId) {
        sendJson(res, 400, { ok: false, error: "Missing sid or tokenId" });
        return;
      }

      const sess = threeStepSessions.get(sid);
      const result = await completeThreeStepDeduped(tokenId, sid, securityKey);
      if (!result.ok) {
        const status =
          result.error === "Three-step session not found or expired" ? 404 : 402;
        sendJson(res, status, { ok: false, error: result.error, resultText: result.resultText });
        return;
      }
      if (sess) {
        syncPurchaseToBackoffice({
          billing: sess.billing,
          enrollments: sess.enrollments,
          promoCode: sess.promoCode,
          referralCode: sess.referralCode,
        });
      }

      sendJson(res, 200, {
        ok: true,
        transactionId: result.transactionId,
        authCode: result.authCode,
        resultText: result.resultText,
      });
      return;
    }

    // Legacy tokenized path (kept for API testing/tools)
    if (path !== "/api/payments/charge" || req.method !== "POST") {
      next();
      return;
    }

    if (!securityKey) {
      sendJson(res, 503, {
        ok: false,
        error:
          "Payments are not configured (missing ECRYPT_API_KEY on the server). Add your gateway security key to .env.",
      });
      return;
    }

    let raw: string;
    try {
      raw = await readBody(req);
    } catch {
      sendJson(res, 400, { ok: false, error: "Could not read request body" });
      return;
    }

    let body: Partial<ChargeRequestBody & { promoCode?: string; referralCode?: string; ref?: string }>;
    try {
      body = JSON.parse(raw || "{}");
    } catch {
      sendJson(res, 400, { ok: false, error: "Invalid JSON body" });
      return;
    }

    const result = await chargeEnrollmentSale(
      {
        paymentToken: String(body.paymentToken || ""),
        enrollments: (body.enrollments || {}) as ChargeRequestBody["enrollments"],
        billing: (body.billing || {}) as ChargeRequestBody["billing"],
        promoCode: String(body.promoCode || "").trim() || undefined,
      },
      {
        securityKey,
        addToCustomerVault: getBoolEnv("ECRYPT_CUSTOMER_VAULT"),
        testMode: getBoolEnv("ECRYPT_TEST_MODE"),
      }
    );

    if (!result.ok) {
      sendJson(res, 402, { ok: false, error: result.error, gatewayCode: result.gatewayCode });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      transactionId: result.transactionId,
      authCode: result.authCode,
      customerVaultId: result.customerVaultId,
    });
    syncPurchaseToBackoffice({
      billing: body.billing,
      enrollments: body.enrollments,
      promoCode: String(body.promoCode || "").trim() || undefined,
      referralCode: String(body.referralCode || body.ref || "").trim() || undefined,
    });
  };
}
