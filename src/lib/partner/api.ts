import { apiUrl } from "../apiBase";
import type { CommissionRecord, PartnerRecord, PromoCodeRecord } from "../backoffice/types";

const PARTNER_TOKEN_KEY = "ori_partner_token";

/** Thrown when a partner API request fails; includes HTTP status for auth handling. */
export class PartnerRequestError extends Error {
  readonly status: number;
  readonly body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "PartnerRequestError";
    this.status = status;
    this.body = body;
  }
}

export function getPartnerToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(PARTNER_TOKEN_KEY) || "";
}

export function setPartnerToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PARTNER_TOKEN_KEY, token);
}

export function clearPartnerToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PARTNER_TOKEN_KEY);
}

export async function partnerLogin(payload: {
  accessKey?: string;
  email?: string;
  password?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(apiUrl("/api/partner/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accessKey: (payload.accessKey || "").trim(),
      email: (payload.email || "").trim().toLowerCase(),
      password: payload.password ?? "",
    }),
  });
  let data: { ok?: boolean; token?: string; error?: string } = {};
  try {
    data = (await res.json()) as typeof data;
  } catch {
    /* ignore */
  }
  if (!res.ok || !data.ok || !data.token) {
    return { ok: false, error: data.error || "Sign in failed" };
  }
  setPartnerToken(data.token);
  return { ok: true };
}

export async function setPartnerPassword(password: string): Promise<void> {
  const res = await fetch(apiUrl("/api/partner/set-password"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getPartnerToken()}`,
    },
    body: JSON.stringify({ password }),
  });
  let data: { ok?: boolean; error?: string } = {};
  try {
    data = (await res.json()) as typeof data;
  } catch {
    /* ignore */
  }
  if (!res.ok || !data.ok) {
    throw new Error(data.error || "Could not set password");
  }
}

export async function validatePartnerClaimToken(token: string): Promise<{
  valid: boolean;
  organizationName?: string;
  emailMasked?: string;
  error?: string;
}> {
  const res = await fetch(apiUrl(`/api/public/partner-claim?token=${encodeURIComponent(token)}`));
  const data = (await res.json()) as {
    ok?: boolean;
    valid?: boolean;
    organizationName?: string;
    emailMasked?: string;
    error?: string;
  };
  return {
    valid: Boolean(data.valid),
    organizationName: data.organizationName,
    emailMasked: data.emailMasked,
    error: data.error,
  };
}

export async function completePartnerClaim(payload: {
  token: string;
  password: string;
}): Promise<{ ok: boolean; token?: string; error?: string }> {
  const res = await fetch(apiUrl("/api/public/partner-claim/complete"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as { ok?: boolean; token?: string; error?: string };
  if (!res.ok || !data.ok || !data.token) {
    return { ok: false, error: data.error || "Could not claim account." };
  }
  setPartnerToken(data.token);
  return { ok: true, token: data.token };
}

export type PartnerLeadRow = {
  id: string;
  ctaType: string;
  status: string;
  createdAt: string;
  contactName: string;
  contactEmailMasked: string;
  fundingRequested: number;
  fundingFunded: number;
  fundingGap: number;
};

export type PartnerServiceCode =
  | "FORMATION"
  | "VAULT"
  | "BUILDER"
  | "HOSTING"
  | "GROWTH"
  | "FUNDING_READINESS"
  | "CAPITAL";

export type PartnerServiceStatus = "ACTIVE" | "PENDING" | "NOT_ACTIVE";
export type FundingReadinessEnrollmentType = "INDIVIDUAL" | "BUSINESS" | "BOTH" | "NOT_ENROLLED";
export type CollaborationServiceType = "STARTUP_COACHING" | "PRODUCT_DEVELOPMENT" | "MANAGEMENT_ADVISORY";

export type PartnerBootstrap = {
  ok: boolean;
  partner: Pick<
    PartnerRecord,
    | "id"
    | "organizationName"
    | "contactName"
    | "email"
    | "phone"
    | "city"
    | "state"
    | "referralCode"
    | "defaultCommissionRate"
    | "payoutTerms"
    | "type"
    | "status"
  >;
  stats: {
    totalLeads: number;
    leadsByCta: Record<string, number>;
    commissionPending: number;
    commissionReceived: number;
    commissionPaid: number;
    activePromoCodes: number;
  };
  needsPasswordSetup: boolean;
  leads: PartnerLeadRow[];
  kpis: {
    activeClients: number;
    inProgress: number;
    fundingReady: number;
    capitalDeployed: number;
    /** Partner clients currently in the Collaboration lifecycle stage */
    consultedClients: number;
    /** Partner clients with funded status */
    fundedClients: number;
    commissionPending: number;
    commissionPaid: number;
  };
  clients: Array<{
    id: string;
    leadId: string;
    contactName: string;
    contactEmailMasked: string;
    companyName: string;
    currentStage: "Collaboration" | "Management" | "Funding";
    cohortName: string;
    collaborationServices: Array<{
      type: CollaborationServiceType;
      status: "ACTIVE" | "PENDING" | "NOT_ACTIVE";
      playbookName?: string;
      deliveryMode?: "1:1" | "Cohort";
      sessionStatus?: "Not started" | "Scheduled" | "Completed";
      engagementType?: "One-off" | "Ongoing";
      projectStatus?: "Scoped" | "In build" | "In revision" | "Complete";
    }>;
    managementTools: Array<{ code: PartnerServiceCode; status: PartnerServiceStatus }>;
    fundingReadiness: {
      enrollmentType: FundingReadinessEnrollmentType;
      programStatus: string;
      readinessStage: string;
      readyForFundingReview: boolean;
    };
    funding: {
      status: string;
      amount: number;
    };
    workshopStatus: "Not started" | "Scheduled" | "Completed";
    fundingStatus: string;
    fundingAmount: number;
    nextAction: string;
  }>;
  workshops: Array<{
    id: string;
    leadId: string;
    clientName: string;
    name: string;
    deliveryMode: "1:1" | "Cohort";
    scheduledAt: string;
    status: "Scheduled" | "Completed" | "No-show";
  }>;
  activityTimeline: Array<{
    id: string;
    createdAt: string;
    label: string;
  }>;
  commissions: CommissionRecord[];
  promoCodes: PromoCodeRecord[];
};

async function partnerFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getPartnerToken();
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = undefined;
  }
  if (!res.ok) {
    const errMsg =
      body &&
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof (body as { error: unknown }).error === "string"
        ? (body as { error: string }).error
        : `Request failed: ${res.status}`;
    throw new PartnerRequestError(errMsg, res.status, body);
  }
  return body as T;
}

export type PartnerProfileUpdatePayload = {
  organizationName: string;
  contactName: string;
  email: string;
  city?: string;
  state?: string;
  phone?: string;
};

export async function updatePartnerProfile(payload: PartnerProfileUpdatePayload): Promise<void> {
  await partnerFetch<{ ok: boolean }>("/api/partner/profile", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getPartnerBootstrap(): Promise<PartnerBootstrap> {
  return partnerFetch<PartnerBootstrap>("/api/partner/bootstrap", { method: "GET" });
}

export async function partnerAddClient(payload: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  cohortName?: string;
}): Promise<{ ok: boolean; leadId: string }> {
  return partnerFetch<{ ok: boolean; leadId: string }>("/api/partner/clients", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function partnerAssignService(payload: {
  leadId: string;
  serviceCode: PartnerServiceCode;
}): Promise<{ ok: boolean }> {
  return partnerFetch<{ ok: boolean }>("/api/partner/assign-service", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function partnerAssignCollaborationService(payload: {
  leadId: string;
  serviceType: CollaborationServiceType;
  status?: "ACTIVE" | "PENDING";
  playbookName?: string;
  deliveryMode?: "1:1" | "Cohort";
  engagementType?: "One-off" | "Ongoing";
  projectStatus?: "Scoped" | "In build" | "In revision" | "Complete";
}): Promise<{ ok: boolean }> {
  return partnerFetch<{ ok: boolean }>("/api/partner/assign-collaboration-service", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function partnerAssignFundingReadiness(payload: {
  leadId: string;
  enrollmentType: Exclude<FundingReadinessEnrollmentType, "NOT_ENROLLED">;
}): Promise<{ ok: boolean }> {
  return partnerFetch<{ ok: boolean }>("/api/partner/assign-funding-readiness", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function partnerScheduleWorkshop(payload: {
  leadId: string;
  workshopType: string;
  deliveryMode: "1:1" | "Cohort";
  scheduledAt: string;
}): Promise<{ ok: boolean }> {
  return partnerFetch<{ ok: boolean }>("/api/partner/workshops", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function partnerUpdateWorkshopStatus(payload: {
  workshopId: string;
  status: "Scheduled" | "Completed" | "No-show";
}): Promise<{ ok: boolean }> {
  return partnerFetch<{ ok: boolean }>(`/api/partner/workshops/${encodeURIComponent(payload.workshopId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status: payload.status }),
  });
}
