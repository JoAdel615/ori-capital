import { ROUTES } from "../../utils/navigation";

/**
 * Rebuilds the server-provided invite URL on the current browser origin so copied
 * links work in local dev (e.g. port 5174 vs SITE_PUBLIC_URL default 5173).
 */
export function partnerRegisterInviteUrl(inviteUrlFromServer: string): string {
  try {
    const u = new URL(
      inviteUrlFromServer,
      typeof window !== "undefined" ? window.location.origin : "http://localhost"
    );
    const token = u.searchParams.get("token");
    if (token && typeof window !== "undefined") {
      return `${window.location.origin}${ROUTES.PARTNER_REGISTER}?token=${encodeURIComponent(token)}`;
    }
  } catch {
    /* use server URL */
  }
  return inviteUrlFromServer;
}

export async function copyPartnerRegisterInviteLink(inviteUrlFromServer: string): Promise<void> {
  await navigator.clipboard.writeText(partnerRegisterInviteUrl(inviteUrlFromServer));
}
