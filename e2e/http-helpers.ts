import { expect, type APIRequestContext } from "@playwright/test";

const jsonHeaders = { "Content-Type": "application/json" };

export function authBearer(token: string): Record<string, string> {
  return { ...jsonHeaders, Authorization: `Bearer ${token}` };
}

/** Admin login with `BACKOFFICE_RELAX_AUTH=1` preview (password `admin`). */
export async function adminLogin(request: APIRequestContext): Promise<string> {
  const res = await request.post("/api/admin/login", {
    headers: jsonHeaders,
    data: { password: "admin" },
  });
  expect(res.ok(), await res.text()).toBeTruthy();
  const data = (await res.json()) as { ok?: boolean; token?: string };
  expect(data.token).toBeTruthy();
  return data.token!;
}

export function inviteTokenFromUrl(inviteUrl: string): string {
  const u = new URL(inviteUrl);
  const token = u.searchParams.get("token");
  if (!token) throw new Error(`No token in invite URL: ${inviteUrl}`);
  return token;
}

/** Public claim links use `?claim=`; the API expects the raw value as `token` in query/body. */
export function claimTokenFromUrl(claimUrl: string): string {
  const u = new URL(claimUrl);
  const token = u.searchParams.get("claim") || u.searchParams.get("token");
  if (!token) throw new Error(`No claim/token in URL: ${claimUrl}`);
  return token;
}

/** Valid minimal `partnerIntake` for `validatePartnerIntakeRequired`. */
export const e2ePartnerIntake = {
  clientSegments: ["SMALL_BUSINESSES"],
  partnershipInterest: "REFERRING_CLIENTS",
  roleTitle: "Founder",
};
