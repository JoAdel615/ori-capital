import { apiUrl } from "../apiBase";
import type { BackOfficeBootstrap } from "./bootstrapTypes";
import type {
  CommissionRecord,
  ContactRecord,
  FundingRecord,
  LeadRecord,
  OpportunityRecord,
  PartnerRecord,
  SiteMetricConfig,
  SubscriptionEnrollmentRecord,
  TestimonialRecord,
} from "./types";

const ADMIN_TOKEN_KEY = "ori_backoffice_admin_token";

export function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

export function setAdminToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function adminLogin(password: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl("/api/admin/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return false;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      return false;
    }
    const data = (await res.json()) as { ok?: boolean; token?: string };
    if (!data.ok || !data.token) return false;
    setAdminToken(data.token);
    return true;
  } catch {
    return false;
  }
}

async function authedFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const target = url.startsWith("http") ? url : apiUrl(url);
  const res = await fetch(target, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function getBackOfficeBootstrap(): Promise<BackOfficeBootstrap> {
  return authedFetch<BackOfficeBootstrap>("/api/backoffice/bootstrap", { method: "GET" });
}

export async function updateSiteMetrics(payload: Partial<SiteMetricConfig>) {
  return authedFetch<{ ok: boolean; siteMetricConfig: SiteMetricConfig }>("/api/backoffice/metrics", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export type CreatePartnerResult = {
  ok: boolean;
  partner: PartnerRecord & { portalEnabled: boolean; invitePending: boolean };
  referralCode: string;
  referralLink: string;
  partnerPortalLink: string;
  /** Admin-created partner: one-time password for email sign-in at /partner */
  temporaryPassword?: string;
  inviteUrl?: string;
};

export async function createPartner(payload: Record<string, unknown>) {
  return authedFetch<CreatePartnerResult>("/api/backoffice/partners", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function revokePartnerPortal(partnerId: string) {
  return authedFetch<{ ok: boolean; partner: PartnerRecord & { portalEnabled: boolean; invitePending: boolean } }>(
    `/api/backoffice/partners/${partnerId}/revoke-portal`,
    { method: "POST", body: "{}" }
  );
}

export async function sendPartnerInvite(partnerId: string) {
  return authedFetch<{
    ok: boolean;
    inviteUrl: string;
    expiresAt: string;
    partner: PartnerRecord & { portalEnabled: boolean; invitePending: boolean };
  }>(`/api/backoffice/partners/${partnerId}/invite`, { method: "POST", body: "{}" });
}

export async function updatePartner(partnerId: string, payload: Record<string, unknown>) {
  return authedFetch<{ ok: boolean; partner: PartnerRecord & { portalEnabled?: boolean; invitePending?: boolean } }>(
    `/api/backoffice/partners/${partnerId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

export async function deletePartner(partnerId: string) {
  return authedFetch<{ ok: boolean }>(`/api/backoffice/partners/${partnerId}`, {
    method: "DELETE",
  });
}

export async function updatePartnerCommission(partnerId: string, payload: Record<string, unknown>) {
  return authedFetch<{
    ok: boolean;
    partner: PartnerRecord & { portalEnabled?: boolean; invitePending?: boolean };
    createdCommission?: CommissionRecord;
  }>(`/api/backoffice/partners/${partnerId}/commission`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function patchLead(leadId: string, payload: Record<string, unknown>) {
  return authedFetch<{
    ok: boolean;
    lead: LeadRecord;
    createdOpportunity?: OpportunityRecord;
    createdSubscription?: SubscriptionEnrollmentRecord;
    createdPartner?: PartnerRecord & { portalEnabled?: boolean; invitePending?: boolean };
    portalAccessKey?: string;
  }>(`/api/backoffice/leads/${leadId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function createManualLead(payload: Record<string, unknown>) {
  return authedFetch<{ ok: boolean; lead: LeadRecord; contact: ContactRecord }>("/api/backoffice/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteLead(leadId: string) {
  return authedFetch<{ ok: boolean }>(`/api/backoffice/leads/${leadId}`, {
    method: "DELETE",
  });
}

export async function patchOpportunity(opportunityId: string, payload: Record<string, unknown>) {
  return authedFetch<{ ok: boolean; opportunity: OpportunityRecord }>(`/api/backoffice/opportunities/${opportunityId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function createOpportunity(payload: Record<string, unknown>) {
  return authedFetch<{ ok: boolean; opportunity: OpportunityRecord }>("/api/backoffice/opportunities", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function patchSubscription(subscriptionId: string, payload: Record<string, unknown>) {
  return authedFetch<{ ok: boolean; subscription: SubscriptionEnrollmentRecord }>(
    `/api/backoffice/subscriptions/${subscriptionId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

export async function createFundingRecord(payload: Record<string, unknown>) {
  return authedFetch<{ ok: boolean; fundingRecord: FundingRecord }>("/api/backoffice/funding-records", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function patchFundingRecord(fundingRecordId: string, payload: Record<string, unknown>) {
  return authedFetch<{ ok: boolean; fundingRecord: FundingRecord }>(`/api/backoffice/funding-records/${fundingRecordId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function patchCommission(commissionId: string, payload: Record<string, unknown>) {
  return authedFetch<{ ok: boolean; commission: CommissionRecord }>(`/api/backoffice/commissions/${commissionId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function createTestimonialAdmin(payload: Record<string, unknown>) {
  return authedFetch<{ ok: boolean; testimonial: TestimonialRecord }>("/api/backoffice/testimonials", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function approveTestimonial(testimonialId: string) {
  return authedFetch<{ ok: boolean; testimonial: TestimonialRecord }>(`/api/backoffice/testimonials/${testimonialId}/approve`, {
    method: "PATCH",
  });
}

export async function patchTestimonial(testimonialId: string, payload: Record<string, unknown>) {
  return authedFetch<{ ok: boolean; testimonial: TestimonialRecord }>(`/api/backoffice/testimonials/${testimonialId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function sendTestimonialRequest(payload: {
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
}) {
  return authedFetch<{ ok: boolean; queued: boolean; twilioConfigured: boolean; messagePreview: string }>(
    "/api/backoffice/testimonial-requests",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function generatePartnerPortalKey(partnerId: string) {
  return authedFetch<{
    ok: boolean;
    accessKey: string;
    message: string;
    partner: PartnerRecord & { portalEnabled: boolean; invitePending: boolean };
  }>(`/api/backoffice/partners/${partnerId}/portal-key`, { method: "POST", body: "{}" });
}

export async function sendPartnerApprovalInvite(partnerId: string) {
  return authedFetch<{
    ok: boolean;
    accessKey: string;
    message: string;
    partner: PartnerRecord & { portalEnabled: boolean; invitePending: boolean };
  }>(`/api/backoffice/partners/${partnerId}/approval-invite`, { method: "POST", body: "{}" });
}
