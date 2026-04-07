import { apiUrl } from "../apiBase";

/**
 * Referral attribution for partner links (?ref=CODE). Persists in sessionStorage
 * so CTAs keep context across in-app navigation when the query string is dropped.
 */

export const REFERRAL_STORAGE_KEY = "ori_referral_code";

export function normalizeReferralCode(raw: string | null | undefined): string {
  return String(raw ?? "").trim();
}

export function persistReferralCode(code: string): void {
  const c = normalizeReferralCode(code);
  if (typeof window === "undefined" || !c) return;
  try {
    sessionStorage.setItem(REFERRAL_STORAGE_KEY, c);
  } catch {
    /* quota / private mode */
  }
}

export function getStoredReferralCode(): string {
  if (typeof window === "undefined") return "";
  try {
    return normalizeReferralCode(sessionStorage.getItem(REFERRAL_STORAGE_KEY));
  } catch {
    return "";
  }
}

/** Append ?ref= or &ref= to an internal path. */
export function pathWithRef(path: string, ref: string): string {
  const r = normalizeReferralCode(ref);
  if (!r) return path;
  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}ref=${encodeURIComponent(r)}`;
}

/** Add ref to an absolute or relative external URL (apply form host, Calendly, etc.). */
export function externalUrlWithRef(url: string, ref: string): string {
  const r = normalizeReferralCode(ref);
  if (!r || !url.trim()) return url;
  try {
    const base = typeof window !== "undefined" ? window.location.origin : "https://oricapital.com";
    const u = new URL(url, base);
    u.searchParams.set("ref", r);
    return u.toString();
  } catch {
    return url;
  }
}

export function trackReferralFunnelEvent(payload: {
  referralCode: string;
  event: "landing" | "cta";
  cta?: string;
}): void {
  const code = normalizeReferralCode(payload.referralCode);
  if (!code) return;
  try {
    void fetch(apiUrl("/api/public/referral-track"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referralCode: code,
        event: payload.event,
        cta: payload.cta,
      }),
    });
  } catch {
    /* ignore */
  }
}
