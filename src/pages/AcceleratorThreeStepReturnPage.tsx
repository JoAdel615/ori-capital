import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageContainer, PageSection } from "../components/system";
import { AcceleratorEnrollmentConfirmation } from "../components/accelerator-enrollment";
import { apiUrl } from "../lib/apiBase";
import { ROUTES } from "../utils/navigation";

type CompleteState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; transactionId: string; authCode: string };

const STORAGE_PREFIX = "ori-capital:three-step-complete";

function readStoredComplete(tokenId: string): CompleteState | null {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}:${tokenId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { transactionId: string; authCode: string };
    if (typeof parsed.transactionId !== "string") return null;
    return {
      status: "success",
      transactionId: parsed.transactionId,
      authCode: typeof parsed.authCode === "string" ? parsed.authCode : "",
    };
  } catch {
    return null;
  }
}

function writeStoredComplete(tokenId: string, data: { transactionId: string; authCode: string }) {
  try {
    sessionStorage.setItem(`${STORAGE_PREFIX}:${tokenId}`, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

/** One promise per sid+token so React Strict Mode (dev double-mount) does not POST complete twice. */
const completeInflight = new Map<string, Promise<CompleteState>>();

function completeThreeStepOnce(sid: string, tokenId: string): Promise<CompleteState> {
  const key = `${sid}:${tokenId}`;
  const existing = completeInflight.get(key);
  if (existing) return existing;

  const p = (async (): Promise<CompleteState> => {
    try {
      const res = await fetch(apiUrl("/api/payments/three-step/complete"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sid, tokenId }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        transactionId?: string;
        authCode?: string;
      };
      if (!res.ok || !data.ok) {
        return { status: "error", message: data.error || "Payment was not approved." };
      }
      const success = {
        status: "success" as const,
        transactionId: data.transactionId || "",
        authCode: data.authCode || "",
      };
      writeStoredComplete(tokenId, {
        transactionId: success.transactionId,
        authCode: success.authCode,
      });
      return success;
    } catch {
      return { status: "error", message: "Network error completing transaction." };
    }
  })();

  completeInflight.set(key, p);
  return p;
}

export function AcceleratorThreeStepReturnPage() {
  const [params] = useSearchParams();
  const sid = params.get("sid") || "";
  const tokenId = params.get("token-id") || "";

  const [state, setState] = useState<CompleteState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!sid || !tokenId) {
        setState({ status: "error", message: "Missing sid or token-id in callback URL." });
        return;
      }

      const cached = readStoredComplete(tokenId);
      if (cached) {
        if (!cancelled) setState(cached);
        return;
      }

      const next = await completeThreeStepOnce(sid, tokenId);
      if (!cancelled) setState(next);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [sid, tokenId]);

  return (
    <>
      <PageSection variant="tight" className="border-b border-ori-border bg-ori-section-alt">
        <PageContainer>
          <h1 className="font-display text-xl font-bold tracking-tight text-ori-foreground md:text-2xl">
            Completing Your Enrollment
          </h1>
        </PageContainer>
      </PageSection>

      <PageSection variant="tight" className="bg-ori-black">
        <PageContainer maxWidth="max-w-2xl">
          {state.status === "loading" && (
            <div className="rounded-xl border border-ori-border bg-ori-charcoal/60 p-5 text-sm text-ori-muted">
              Processing your transaction, please wait...
            </div>
          )}

          {state.status === "error" && (
            <div className="space-y-3 rounded-xl border border-red-500/40 bg-red-500/10 p-5">
              <p className="text-sm text-red-200">{state.message}</p>
              <Link to={ROUTES.FUNDING_READINESS_ENROLL} className="text-ori-accent hover:underline">
                Return to checkout
              </Link>
            </div>
          )}

          {state.status === "success" && (
            <div className="space-y-5 rounded-xl border border-ori-border bg-ori-charcoal/60 p-5">
              <AcceleratorEnrollmentConfirmation />
              <p className="text-xs text-ori-muted text-center">
                Transaction ID: {state.transactionId || "(not returned)"}
                {state.authCode ? ` · Auth: ${state.authCode}` : ""}
              </p>
              <p className="text-center">
                <Link to={ROUTES.FUNDING_READINESS} className="text-ori-accent hover:underline">
                  Return to Funding Readiness
                </Link>
              </p>
            </div>
          )}
        </PageContainer>
      </PageSection>
    </>
  );
}
