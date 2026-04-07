import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageSection, PageContainer } from "../components/system";
import { apiUrl } from "../lib/apiBase";
import { ROUTES } from "../utils/navigation";
import { ECRYPT_SANDBOX_TEST_CARD } from "../lib/ecrypt/sandboxTestData";

interface SessionResponse {
  ok: boolean;
  formUrl?: string;
  error?: string;
}

export function AcceleratorThreeStepEntryPage() {
  const [params] = useSearchParams();
  const sid = params.get("sid") || "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formUrl, setFormUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!sid) {
        setError("Missing session id.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          apiUrl(`/api/payments/three-step/session?sid=${encodeURIComponent(sid)}`)
        );
        const data = (await res.json()) as SessionResponse;
        if (!res.ok || !data.ok || !data.formUrl) {
          setError(data.error || "Could not start secure card entry.");
          setLoading(false);
          return;
        }
        if (!cancelled) {
          setFormUrl(data.formUrl);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Network error loading secure card entry.");
          setLoading(false);
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [sid]);

  return (
    <>
      <PageSection variant="tight" className="border-b border-ori-border bg-ori-section-alt">
        <PageContainer>
          <h1 className="font-display text-xl font-bold tracking-tight text-ori-foreground md:text-2xl">
            Secure Card Entry
          </h1>
          <p className="mt-2 text-sm text-ori-muted">
            Step 2 of 3. Card details are submitted directly to the gateway.
          </p>
        </PageContainer>
      </PageSection>

      <PageSection variant="tight" className="bg-ori-black">
        <PageContainer maxWidth="max-w-2xl">
          <div className="rounded-xl border border-ori-border bg-ori-charcoal/60 p-5">
            {loading && <p className="text-sm text-ori-muted">Loading secure form...</p>}
            {error && (
              <div className="space-y-3">
                <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </p>
                <Link to={ROUTES.FUNDING_READINESS_ENROLL} className="text-ori-accent hover:underline">
                  Return to checkout
                </Link>
              </div>
            )}

            {!loading && !error && formUrl && (
              <form action={formUrl} method="POST" className="space-y-4">
                {import.meta.env.DEV && (
                  <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
                    Dev test card: {ECRYPT_SANDBOX_TEST_CARD.visa} / {ECRYPT_SANDBOX_TEST_CARD.expirationMMYY} / {" "}
                    {ECRYPT_SANDBOX_TEST_CARD.cvv}
                  </p>
                )}
                <div>
                  <label className="mb-1 block text-sm font-medium text-ori-foreground">Card Number</label>
                  <input
                    name="billing-cc-number"
                    autoComplete="cc-number"
                    className="w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-ori-foreground">Expiration (MMYY)</label>
                    <input
                      name="billing-cc-exp"
                      autoComplete="cc-exp"
                      placeholder="1025"
                      className="w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-ori-foreground">CVV</label>
                    <input
                      name="cvv"
                      autoComplete="cc-csc"
                      className="w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-ori-accent px-6 py-3 text-sm font-semibold text-ori-black hover:bg-ori-accent-dim"
                >
                  Submit secure payment details
                </button>
              </form>
            )}
          </div>
        </PageContainer>
      </PageSection>
    </>
  );
}
