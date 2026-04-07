import { apiUrl } from "../apiBase";

export type PublicReferralPartner = {
  displayName: string;
  referralCode: string;
  partnerId?: string;
};

export async function fetchReferralPartnerByCode(code: string): Promise<PublicReferralPartner | null> {
  const c = String(code || "").trim();
  if (!c) return null;
  try {
    const res = await fetch(
      apiUrl(`/api/public/referral-partner?${new URLSearchParams({ ref: c }).toString()}`),
      { method: "GET" }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      ok?: boolean;
      found?: boolean;
      displayName?: string;
      referralCode?: string;
      partnerId?: string;
    };
    if (!data.ok || !data.found) return null;
    const displayName = String(data.displayName || "").trim();
    if (!displayName) return null;
    return {
      displayName,
      referralCode: String(data.referralCode || c).trim(),
      partnerId: data.partnerId,
    };
  } catch {
    return null;
  }
}
