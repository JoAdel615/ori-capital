import { apiUrl } from "../apiBase";
import type { PartnerIntakePayload } from "../backoffice/types";

export async function validateInviteToken(token: string): Promise<{
  valid: boolean;
  organizationName?: string;
  referralCode?: string;
  partnerType?: string;
  error?: string;
}> {
  const res = await fetch(apiUrl(`/api/public/invite-partner?token=${encodeURIComponent(token)}`));
  const data = (await res.json()) as {
    ok?: boolean;
    valid?: boolean;
    organizationName?: string;
    referralCode?: string;
    partnerType?: string;
    error?: string;
  };
  return {
    valid: Boolean(data.valid),
    organizationName: data.organizationName,
    referralCode: data.referralCode,
    partnerType: data.partnerType,
    error: data.error,
  };
}

export async function registerPartnerSelfService(payload: {
  type: string;
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  partnerIntake: PartnerIntakePayload;
  /** Anti-spam honeypot — must be empty */
  partnerHoneypot?: string;
}): Promise<{
  ok: boolean;
  message?: string;
  error?: string;
}> {
  const res = await fetch(apiUrl("/api/partner/self-register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    return { ok: false, error: String(data.error || "Request failed") };
  }
  return data as { ok: boolean; message?: string };
}

export async function completePartnerInvite(payload: {
  token: string;
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  partnerIntake: PartnerIntakePayload;
  /** Anti-spam honeypot — must be empty */
  partnerHoneypot?: string;
}): Promise<{
  ok: boolean;
  message?: string;
  referralLink?: string;
  partnerPortalLink?: string;
  referralCode?: string;
  error?: string;
}> {
  const res = await fetch(apiUrl("/api/partner/complete-invite"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    return { ok: false, error: String(data.error || "Request failed") };
  }
  return data as {
    ok: boolean;
    message?: string;
    referralLink?: string;
    partnerPortalLink?: string;
    referralCode?: string;
  };
}
