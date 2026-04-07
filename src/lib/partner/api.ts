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

export type PartnerBootstrap = {
  ok: boolean;
  partner: Pick<
    PartnerRecord,
    | "id"
    | "organizationName"
    | "contactName"
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

export async function getPartnerBootstrap(): Promise<PartnerBootstrap> {
  return partnerFetch<PartnerBootstrap>("/api/partner/bootstrap", { method: "GET" });
}
