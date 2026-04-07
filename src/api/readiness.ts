/**
 * Readiness API client: verify score and unlock report.
 * Endpoint contract: POST /api/readiness/score (ScorePayload → ScoreResponse),
 * POST /api/readiness/unlock (UnlockPayload → { success, error? }).
 * Server MUST recompute with same rules: use src/lib/readiness/scoring (or move to src/shared/readiness for backend).
 * When backend exists, fetch will succeed; until then, fallback uses this module + localStorage.
 */

import { apiUrl } from "../lib/apiBase";
import { calculateReadiness } from "../lib/readiness/scoring";
import type { ReadinessAnswers, ReadinessResult } from "../lib/readiness/types";

const STORAGE_KEY = "ori_readiness_assessments";

export interface ScorePayload {
  answers: ReadinessAnswers;
  clientScore: number;
  clientTier: string;
  clientZone: string;
}

export interface ScoreResponse {
  assessmentId: string;
  verified: {
    score: number;
    tier: string;
    zone: string;
    signals: { strengths: [string, string, string]; improvements: [string, string, string] };
    confidencePenalty: number;
    overridesApplied: string[];
  };
}

export interface UnlockPayload {
  assessmentId: string;
  email: string;
}

function generateId(): string {
  return `asmt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getStored(): Record<string, { verified: ReadinessResult; email?: string }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function setStored(data: Record<string, { verified: ReadinessResult; email?: string }>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/**
 * Verify assessment (direct implementation). Recomputes with shared scoring and persists.
 * Used as fallback when POST /api/readiness/score is not available.
 */
export async function submitAssessmentDirect(
  payload: ScorePayload
): Promise<ScoreResponse> {
  const verified: ReadinessResult = calculateReadiness(payload.answers);
  const assessmentId = generateId();
  const stored = getStored();
  stored[assessmentId] = { verified };
  setStored(stored);
  return {
    assessmentId,
    verified: {
      score: verified.score,
      tier: verified.tier,
      zone: verified.zone,
      signals: verified.signals,
      confidencePenalty: verified.confidencePenalty,
      overridesApplied: verified.overridesApplied,
    },
  };
}

/**
 * POST /api/readiness/score contract. Tries endpoint first; falls back to direct implementation.
 */
export async function submitAssessment(payload: ScorePayload): Promise<ScoreResponse> {
  try {
    const res = await fetch(apiUrl("/api/readiness/score"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Score request failed");
    const data = await res.json();
    if (data?.assessmentId && data?.verified) return data as ScoreResponse;
    throw new Error("Invalid response");
  } catch {
    return submitAssessmentDirect(payload);
  }
}

/**
 * Unlock full report (direct implementation). Stores email in localStorage.
 * When backend exists: trigger email with full report link/details (TODO: integrate email provider).
 */
export async function unlockReportDirect(
  payload: UnlockPayload
): Promise<{ success: boolean; error?: string }> {
  const stored = getStored();
  if (!stored[payload.assessmentId]) {
    return { success: false, error: "Assessment not found" };
  }
  stored[payload.assessmentId].email = payload.email;
  setStored(stored);
  return { success: true };
}

/**
 * POST /api/readiness/unlock contract. Tries endpoint first; falls back to direct implementation.
 */
export async function unlockReport(payload: UnlockPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(apiUrl("/api/readiness/unlock"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Unlock request failed");
    const data = await res.json();
    if (typeof data?.success === "boolean") return data as { success: boolean; error?: string };
    throw new Error("Invalid response");
  } catch {
    return unlockReportDirect(payload);
  }
}
