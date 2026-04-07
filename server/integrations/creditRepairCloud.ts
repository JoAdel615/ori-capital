/**
 * Credit Repair Cloud — server-side credentials only (never VITE_*).
 * Add CRC_API_KEY and CRC_SECRET_KEY to your local vault (.env); see .env.example.
 * Implement XML/REST calls here when ready; exported helpers are safe stubs.
 */

import { logIntegration } from "./log.js";

export function getCreditRepairCloudCredentials(): { apiKey: string; secretKey: string } | null {
  const apiKey = process.env.CRC_API_KEY?.trim();
  const secretKey = process.env.CRC_SECRET_KEY?.trim();
  if (!apiKey || !secretKey) return null;
  return { apiKey, secretKey };
}

export function crcIntegrationEnabled(): boolean {
  return getCreditRepairCloudCredentials() !== null;
}

/** Placeholder for bidirectional sync between Ori back office and CRC. */
export async function syncCreditRepairCloudStub(
  direction: "export" | "import",
  payload: unknown
): Promise<{ ok: boolean }> {
  if (!crcIntegrationEnabled()) {
    return { ok: false };
  }
  logIntegration("CRC_SYNC_STUB", { direction, hasPayload: Boolean(payload) });
  return { ok: true };
}
