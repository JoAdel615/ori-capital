/**
 * In-memory readiness survey API (score + unlock). Shared by Vite dev and standalone API server.
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import { calculateReadiness } from "../src/lib/readiness/scoring";

const readinessStore = new Map<
  string,
  {
    verified: {
      score: number;
      tier: string;
      zone: string;
      signals: unknown;
      confidencePenalty: number;
      overridesApplied: string[];
    };
    email?: string;
  }
>();

export function attachReadinessRoutes(middlewares: {
  use: (handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void;
}): void {
  middlewares.use((req, res, next) => {
    const url = req.url?.split("?")[0];
    const isReadinessScore = url === "/api/readiness/score";
    const isReadinessUnlock = url === "/api/readiness/unlock";
    if (!isReadinessScore && !isReadinessUnlock) {
      return next();
    }
    if (req.method !== "POST") return next();
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks).toString("utf8");
        const payload = JSON.parse(body || "{}");
        if (isReadinessScore) {
          const verified = calculateReadiness(payload.answers || {});
          const assessmentId = `asmt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          readinessStore.set(assessmentId, { verified });
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              assessmentId,
              verified: {
                score: verified.score,
                tier: verified.tier,
                zone: verified.zone,
                signals: verified.signals,
                confidencePenalty: verified.confidencePenalty,
                overridesApplied: verified.overridesApplied,
              },
            })
          );
        } else {
          if (!readinessStore.has(payload.assessmentId)) {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify({ success: false, error: "Assessment not found" }));
            return;
          }
          const rec = readinessStore.get(payload.assessmentId)!;
          rec.email = payload.email;
          readinessStore.set(payload.assessmentId, rec);
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
        }
      } catch (err) {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(err) }));
      }
    });
  });
}
