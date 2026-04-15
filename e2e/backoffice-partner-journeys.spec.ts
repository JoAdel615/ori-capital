/**
 * Serial integration tests: authenticated back office, partner portal APIs,
 * invite completion, claim links, and self-registration.
 * Requires `vite preview` with `BACKOFFICE_RELAX_AUTH=1` (see `playwright.config.ts`).
 */
import { expect, test, type APIRequestContext } from "@playwright/test";
import {
  adminLogin,
  authBearer,
  claimTokenFromUrl,
  e2ePartnerIntake,
  inviteTokenFromUrl,
} from "./http-helpers";

const json = { "Content-Type": "application/json" };

let adminToken: string;
let portalPartnerId: string;
let portalPartnerEmail: string;
let portalTempPassword: string;
let partnerSessionToken: string;
let clientLeadId: string;
let workshopId: string | undefined;
let manualLeadId: string;
let opportunityId: string;
let fundingRecordId: string;
let testimonialId: string;
let revokePartnerId: string;
let subscriptionId: string | undefined;

const ts = () => Date.now().toString(36);

async function adminPost(request: APIRequestContext, path: string, body: unknown) {
  return request.post(path, { headers: authBearer(adminToken), data: body });
}

async function adminPatch(request: APIRequestContext, path: string, body: unknown) {
  return request.patch(path, { headers: authBearer(adminToken), data: body });
}

async function adminPut(request: APIRequestContext, path: string, body: unknown) {
  return request.put(path, { headers: authBearer(adminToken), data: body });
}

async function adminDelete(request: APIRequestContext, path: string) {
  return request.delete(path, { headers: authBearer(adminToken) });
}

async function partnerGet(request: APIRequestContext, path: string) {
  return request.get(path, { headers: authBearer(partnerSessionToken) });
}

async function partnerPost(request: APIRequestContext, path: string, body: unknown) {
  return request.post(path, { headers: authBearer(partnerSessionToken), data: body });
}

async function partnerPatch(request: APIRequestContext, path: string, body: unknown) {
  return request.patch(path, { headers: authBearer(partnerSessionToken), data: body });
}

test.describe.serial("backoffice and partner API journeys", () => {
  test.setTimeout(120_000);

  test("admin login", async ({ request }) => {
    adminToken = await adminLogin(request);
  });

  test("GET /api/backoffice/bootstrap", async ({ request }) => {
  const res = await request.get("/api/backoffice/bootstrap", { headers: authBearer(adminToken) });
  expect(res.ok()).toBeTruthy();
  const data = (await res.json()) as { ok?: boolean; dashboard?: unknown };
  expect(data.ok).toBe(true);
  expect(data.dashboard).toBeTruthy();
});

test("PUT /api/backoffice/metrics", async ({ request }) => {
  const res = await adminPut(request, "/api/backoffice/metrics", {
    dealsSourcedSuffix: "+",
  });
  expect(res.ok()).toBeTruthy();
  const data = (await res.json()) as { ok?: boolean };
  expect(data.ok).toBe(true);
});

test("POST /api/backoffice/partners (admin onboarding → temp password)", async ({ request }) => {
  portalPartnerEmail = `e2e-portal-${ts()}@example.com`;
  const res = await adminPost(request, "/api/backoffice/partners", {
    type: "OTHER",
    organizationName: "E2E Portal Org",
    contactName: "E2E Portal User",
    email: portalPartnerEmail,
    phone: "5555550199",
    defaultCommissionRate: 0.04,
    partnerOnboarding: "ADMIN",
  });
  expect(res.ok()).toBeTruthy();
  const data = (await res.json()) as {
    ok?: boolean;
    partner?: { id: string };
    temporaryPassword?: string;
  };
  expect(data.ok).toBe(true);
  expect(data.partner?.id).toBeTruthy();
  expect(data.temporaryPassword).toBeTruthy();
  portalPartnerId = data.partner!.id;
  portalTempPassword = data.temporaryPassword!;
});

test("POST /api/partner/login (email + temp password)", async ({ request }) => {
  const res = await request.post("/api/partner/login", {
    headers: json,
    data: {
      email: portalPartnerEmail,
      password: portalTempPassword,
    },
  });
  expect(res.ok()).toBeTruthy();
  const data = (await res.json()) as { ok?: boolean; token?: string };
  expect(data.ok).toBe(true);
  expect(data.token).toBeTruthy();
  partnerSessionToken = data.token!;
});

test("GET /api/partner/bootstrap", async ({ request }) => {
  const res = await partnerGet(request, "/api/partner/bootstrap");
  expect(res.ok()).toBeTruthy();
  const data = (await res.json()) as { ok?: boolean; partner?: { id: string } };
  expect(data.ok).toBe(true);
  expect(data.partner?.id).toBe(portalPartnerId);
});

test("POST /api/partner/clients", async ({ request }) => {
  const res = await partnerPost(request, "/api/partner/clients", {
    name: "E2E Client Person",
    email: `e2e-client-${ts()}@example.com`,
    phone: "5555550111",
    company: "E2E Client Co",
    cohortName: "General",
  });
  expect(res.ok()).toBeTruthy();
  const data = (await res.json()) as { ok?: boolean; leadId?: string };
  expect(data.ok).toBe(true);
  expect(data.leadId).toBeTruthy();
  clientLeadId = data.leadId!;
});

test("POST /api/partner/assign-service", async ({ request }) => {
  const res = await partnerPost(request, "/api/partner/assign-service", {
    leadId: clientLeadId,
    serviceCode: "FORMATION",
  });
  expect(res.ok()).toBeTruthy();
  expect((await res.json()).ok).toBe(true);
});

test("POST /api/partner/assign-collaboration-service", async ({ request }) => {
  const res = await partnerPost(request, "/api/partner/assign-collaboration-service", {
    leadId: clientLeadId,
    serviceType: "STARTUP_COACHING",
    status: "ACTIVE",
    playbookName: "E2E Playbook",
    deliveryMode: "1:1",
  });
  expect(res.ok()).toBeTruthy();
  expect((await res.json()).ok).toBe(true);
});

test("POST /api/partner/assign-funding-readiness", async ({ request }) => {
  const res = await partnerPost(request, "/api/partner/assign-funding-readiness", {
    leadId: clientLeadId,
    enrollmentType: "BUSINESS",
  });
  expect(res.ok()).toBeTruthy();
  expect((await res.json()).ok).toBe(true);
});

test("POST /api/partner/workshops + PATCH status", async ({ request }) => {
  const scheduledAt = new Date(Date.now() + 86400000).toISOString();
  const createRes = await partnerPost(request, "/api/partner/workshops", {
    leadId: clientLeadId,
    workshopType: "Model & Offer",
    deliveryMode: "1:1",
    scheduledAt,
  });
  expect(createRes.ok()).toBeTruthy();
  expect((await createRes.json()).ok).toBe(true);

  const boot = await partnerGet(request, "/api/partner/bootstrap");
  expect(boot.ok()).toBeTruthy();
  const bootData = (await boot.json()) as { workshops?: Array<{ id: string }> };
  const w = bootData.workshops?.find((x) => x.id);
  expect(w?.id).toBeTruthy();
  workshopId = w!.id;

  const patchRes = await partnerPatch(request, `/api/partner/workshops/${encodeURIComponent(workshopId!)}`, {
    status: "Completed",
  });
  expect(patchRes.ok()).toBeTruthy();
  expect((await patchRes.json()).ok).toBe(true);
});

test("POST /api/partner/profile", async ({ request }) => {
  const res = await partnerPost(request, "/api/partner/profile", {
    organizationName: "E2E Portal Org Updated",
    contactName: "E2E Portal User",
    email: portalPartnerEmail,
    city: "Austin",
    state: "TX",
    phone: "5555550199",
  });
  expect(res.ok()).toBeTruthy();
  expect((await res.json()).ok).toBe(true);
});

test("POST /api/partner/set-password", async ({ request }) => {
  const res = await partnerPost(request, "/api/partner/set-password", {
    password: "E2E-new-pass-9",
  });
  expect(res.ok()).toBeTruthy();
  expect((await res.json()).ok).toBe(true);
});

test("POST /api/backoffice/leads (manual) + pipeline mutations", async ({ request }) => {
  const res = await adminPost(request, "/api/backoffice/leads", {
    name: "Manual Lead Person",
    email: `e2e-manual-${ts()}@example.com`,
    phone: "5555550122",
    ctaType: "CONSULT",
    sourceDetail: "E2E",
    status: "Pre-Qualify",
  });
  expect(res.ok()).toBeTruthy();
  const data = (await res.json()) as { ok?: boolean; lead?: { id: string } };
  expect(data.lead?.id).toBeTruthy();
  manualLeadId = data.lead!.id;

  const patchRes = await adminPatch(request, `/api/backoffice/leads/${manualLeadId}`, {
    notes: "E2E note",
    status: "Apply",
  });
  expect(patchRes.ok()).toBeTruthy();

  const boot = await request.get("/api/backoffice/bootstrap", { headers: authBearer(adminToken) });
  const bootData = (await boot.json()) as { subscriptions?: Array<{ id: string }> };
  subscriptionId = bootData.subscriptions?.[0]?.id;

  if (subscriptionId) {
    const subRes = await adminPatch(request, `/api/backoffice/subscriptions/${subscriptionId}`, {
      subscriptionStatus: "Active Client",
    });
    expect(subRes.ok()).toBeTruthy();
  }

  const oppRes = await adminPost(request, "/api/backoffice/opportunities", {
    leadId: manualLeadId,
    stage: "Underwriting",
    requestedAmount: 75000,
    fundingType: "Term loan",
  });
  expect(oppRes.ok()).toBeTruthy();
  const oppData = (await oppRes.json()) as { opportunity?: { id: string } };
  opportunityId = oppData.opportunity!.id;

  const oppPatch = await adminPatch(request, `/api/backoffice/opportunities/${opportunityId}`, {
    stage: "Approved",
  });
  expect(oppPatch.ok()).toBeTruthy();

  const fundRes = await adminPost(request, "/api/backoffice/funding-records", {
    opportunityId,
    approvedAmount: 50000,
    fundedAmount: 25000,
    commissionAmount: 500,
    lenderName: "E2E Bank",
    commissionStatus: "PENDING",
  });
  expect(fundRes.ok()).toBeTruthy();
  const fundData = (await fundRes.json()) as { fundingRecord?: { id: string } };
  fundingRecordId = fundData.fundingRecord!.id;

  const fundPatch = await adminPatch(request, `/api/backoffice/funding-records/${fundingRecordId}`, {
    fundedAmount: 30000,
  });
  expect(fundPatch.ok()).toBeTruthy();

  const boot2 = await request.get("/api/backoffice/bootstrap", { headers: authBearer(adminToken) });
  const boot2Data = (await boot2.json()) as { commissions?: Array<{ id: string }> };
  const comId = boot2Data.commissions?.[0]?.id;
  if (comId) {
    const comPatch = await adminPatch(request, `/api/backoffice/commissions/${comId}`, {
      status: "PAID",
      notes: "E2E paid",
    });
    expect(comPatch.ok()).toBeTruthy();
  }
});

test("POST /api/backoffice/testimonials + PATCH + approve", async ({ request }) => {
  const res = await adminPost(request, "/api/backoffice/testimonials", {
    name: "E2E T",
    quote: "Solid experience.",
    company: "E2E Co",
    isApproved: false,
  });
  expect(res.ok()).toBeTruthy();
  const data = (await res.json()) as { testimonial?: { id: string } };
  testimonialId = data.testimonial!.id;

  const patchRes = await adminPatch(request, `/api/backoffice/testimonials/${testimonialId}`, {
    quote: "Updated quote from E2E.",
  });
  expect(patchRes.ok()).toBeTruthy();

  const appr = await adminPatch(request, `/api/backoffice/testimonials/${testimonialId}/approve`, {});
  expect(appr.ok()).toBeTruthy();
});

test("POST /api/backoffice/testimonial-requests", async ({ request }) => {
  const res = await adminPost(request, "/api/backoffice/testimonial-requests", {
    recipientName: "E2E Recipient",
    recipientEmail: `e2e-treq-${ts()}@example.com`,
  });
  expect(res.ok()).toBeTruthy();
  const data = (await res.json()) as { ok?: boolean };
  expect(data.ok).toBe(true);
});

test("PATCH /api/backoffice/partners/:id + commission rate", async ({ request }) => {
  const patchRes = await adminPatch(request, `/api/backoffice/partners/${portalPartnerId}`, {
    notes: "E2E partner note",
    payoutTerms: "Net 30",
  });
  expect(patchRes.ok()).toBeTruthy();

  const comRes = await adminPatch(request, `/api/backoffice/partners/${portalPartnerId}/commission`, {
    defaultCommissionRate: 0.05,
    createPayoutForEntityId: opportunityId,
    amount: 120,
  });
  expect(comRes.ok()).toBeTruthy();
});

test("POST /api/backoffice/partners/:id/portal-key", async ({ request }) => {
  const res = await adminPost(request, `/api/backoffice/partners/${portalPartnerId}/portal-key`, {});
  expect(res.ok()).toBeTruthy();
  const data = (await res.json()) as { ok?: boolean; accessKey?: string };
  expect(data.ok).toBe(true);
  expect(data.accessKey).toBeTruthy();
});

test("POST /api/backoffice/partners/:id/approval-invite", async ({ request }) => {
  const res = await adminPost(request, `/api/backoffice/partners/${portalPartnerId}/approval-invite`, {});
  expect(res.ok()).toBeTruthy();
  const data = (await res.json()) as { ok?: boolean; accessKey?: string };
  expect(data.ok).toBe(true);
  expect(data.accessKey).toBeTruthy();
});

test("Invite-only partner: create → validate token → complete-invite", async ({ request }) => {
  const createRes = await adminPost(request, "/api/backoffice/partners", {
    partnerOnboarding: "INVITE",
    type: "BUSINESS_CONSULTANT_COACH",
    organizationName: "E2E Invited Org",
    contactName: "Pending partner",
    defaultCommissionRate: 0.03,
  });
  expect(createRes.ok()).toBeTruthy();
  const created = (await createRes.json()) as {
    ok?: boolean;
    partner?: { id: string };
    inviteUrl?: string;
  };
  expect(created.inviteUrl).toBeTruthy();
  const invitedPartnerId = created.partner!.id;
  const token = inviteTokenFromUrl(created.inviteUrl!);

  const val = await request.get(`/api/public/invite-partner?token=${encodeURIComponent(token)}`);
  expect(val.ok()).toBeTruthy();
  const valData = (await val.json()) as { valid?: boolean; organizationName?: string };
  expect(valData.valid).toBe(true);

  const email = `e2e-invite-done-${ts()}@example.com`;
  const complete = await request.post("/api/partner/complete-invite", {
    headers: json,
    data: {
      token,
      organizationName: "E2E Invited Org LLC",
      contactName: "Invite Completed",
      email,
      phone: "5555550133",
      partnerIntake: e2ePartnerIntake,
    },
  });
  expect(complete.ok()).toBeTruthy();
  const done = (await complete.json()) as { ok?: boolean; referralCode?: string };
  expect(done.ok).toBe(true);
  expect(done.referralCode).toBeTruthy();

  const refLookup = await request.get(
    `/api/public/referral-partner?ref=${encodeURIComponent(done.referralCode!)}`
  );
  expect(refLookup.ok()).toBeTruthy();
  const refData = (await refLookup.json()) as { found?: boolean; displayName?: string };
  expect(refData.found).toBe(true);

  const delInv = await adminDelete(request, `/api/backoffice/partners/${invitedPartnerId}`);
  expect(delInv.ok()).toBeTruthy();
});

test("POST /api/backoffice/partners/:id/invite (regenerate link for INVITED partner)", async ({ request }) => {
  const inviteOnly = await adminPost(request, "/api/backoffice/partners", {
    partnerOnboarding: "INVITE",
    type: "OTHER",
    organizationName: "E2E Resend Invite",
    contactName: "Pending",
    defaultCommissionRate: 0.03,
  });
  expect(inviteOnly.ok()).toBeTruthy();
  const row = (await inviteOnly.json()) as { partner?: { id: string } };
  const pid = row.partner!.id;

  const send = await adminPost(request, `/api/backoffice/partners/${pid}/invite`, {});
  expect(send.ok()).toBeTruthy();
  const sent = (await send.json()) as { ok?: boolean; inviteUrl?: string };
  expect(sent.inviteUrl).toMatch(/token=/);

  await adminDelete(request, `/api/backoffice/partners/${pid}`);
});

test("Claim link: partner with email → claim-link → validate → complete", async ({ request }) => {
  const email = `e2e-claim-${ts()}@example.com`;
  const createRes = await adminPost(request, "/api/backoffice/partners", {
    type: "OTHER",
    organizationName: "E2E Claim Org",
    contactName: "Claim User",
    email,
    phone: "5555550144",
    partnerOnboarding: "ADMIN",
  });
  expect(createRes.ok()).toBeTruthy();
  const claimPartnerId = ((await createRes.json()) as { partner: { id: string } }).partner.id;

  const linkRes = await adminPost(request, `/api/backoffice/partners/${claimPartnerId}/claim-link`, {});
  expect(linkRes.ok()).toBeTruthy();
  const linkData = (await linkRes.json()) as { claimUrl?: string };
  expect(linkData.claimUrl).toBeTruthy();
  const token = claimTokenFromUrl(linkData.claimUrl!);

  const val = await request.get(`/api/public/partner-claim?token=${encodeURIComponent(token)}`);
  expect(val.ok()).toBeTruthy();
  const valData = (await val.json()) as { valid?: boolean };
  expect(valData.valid).toBe(true);

  const complete = await request.post("/api/public/partner-claim/complete", {
    headers: json,
    data: { token, password: "E2EClaimPass9" },
  });
  expect(complete.ok()).toBeTruthy();
  const sess = (await complete.json()) as { ok?: boolean; token?: string };
  expect(sess.token).toBeTruthy();

  const boot = await request.get("/api/partner/bootstrap", {
    headers: authBearer(sess.token!),
  });
  expect(boot.ok()).toBeTruthy();
});

test("POST /api/partner/self-register", async ({ request }) => {
  const email = `e2e-selfreg-${ts()}@example.com`;
  const res = await request.post("/api/partner/self-register", {
    headers: json,
    data: {
      type: "OTHER",
      organizationName: "E2E Self Reg LLC",
      contactName: "Self Reg User",
      email,
      phone: "5555550155",
      city: "Denver",
      state: "CO",
      partnerIntake: e2ePartnerIntake,
    },
  });
  expect(res.ok()).toBeTruthy();
  const data = (await res.json()) as { ok?: boolean };
  expect(data.ok).toBe(true);
});

test("revoke portal + delete disposable partner", async ({ request }) => {
  const createRes = await adminPost(request, "/api/backoffice/partners", {
    type: "OTHER",
    organizationName: "E2E Revoke Org",
    contactName: "Revoke User",
    email: `e2e-revoke-${ts()}@example.com`,
    partnerOnboarding: "ADMIN",
  });
  expect(createRes.ok()).toBeTruthy();
  revokePartnerId = ((await createRes.json()) as { partner: { id: string } }).partner.id;

  const rev = await adminPost(request, `/api/backoffice/partners/${revokePartnerId}/revoke-portal`, {});
  expect(rev.ok()).toBeTruthy();

  const del = await adminDelete(request, `/api/backoffice/partners/${revokePartnerId}`);
  expect(del.ok()).toBeTruthy();
});

test("DELETE /api/backoffice/leads/:id (cleanup manual lead)", async ({ request }) => {
  const res = await adminDelete(request, `/api/backoffice/leads/${manualLeadId}`);
  expect(res.ok()).toBeTruthy();
});

});
