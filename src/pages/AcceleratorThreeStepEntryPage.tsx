import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageSection, PageContainer } from "../components/system";
import { apiUrl } from "../lib/apiBase";
import { ROUTES } from "../utils/navigation";
import { ECRYPT_SANDBOX_TEST_CARD } from "../lib/ecrypt/sandboxTestData";

interface SessionResponse {
  ok: boolean;
  formUrl?: string;
  paymentMethod?: "card" | "bank" | "paypal";
  error?: string;
}

export function AcceleratorThreeStepEntryPage() {
  const [params] = useSearchParams();
  const sid = params.get("sid") || "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formUrl, setFormUrl] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "paypal">("card");

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
          if (data.paymentMethod === "bank" || data.paymentMethod === "paypal" || data.paymentMethod === "card") {
            setPaymentMethod(data.paymentMethod);
          }
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
            {paymentMethod === "card"
              ? "Secure Card Entry"
              : paymentMethod === "bank"
                ? "Secure Bank Entry"
                : "Secure PayPal Entry"}
          </h1>
          <p className="mt-2 text-sm text-ori-muted">
            Step 2 of 3. Payment details are submitted directly to the gateway.
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

            {!loading && !error && formUrl && paymentMethod === "card" && (
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

            {!loading && !error && formUrl && paymentMethod === "bank" && (
              <form action={formUrl} method="POST" className="space-y-4">
                <input type="hidden" name="payment" value="check" />
                <div>
                  <label className="mb-1 block text-sm font-medium text-ori-foreground">Account Holder Name</label>
                  <input
                    name="checkname"
                    autoComplete="name"
                    className="w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-ori-foreground">Routing Number</label>
                    <input
                      name="checkaba"
                      inputMode="numeric"
                      className="w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-ori-foreground">Account Number</label>
                    <input
                      name="checkaccount"
                      inputMode="numeric"
                      className="w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-ori-foreground">Account Type</label>
                    <select
                      name="account_type"
                      className="w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground"
                      defaultValue="checking"
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-ori-foreground">Holder Type</label>
                    <select
                      name="account_holder_type"
                      className="w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground"
                      defaultValue="personal"
                    >
                      <option value="personal">Personal</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-ori-accent px-6 py-3 text-sm font-semibold text-ori-black hover:bg-ori-accent-dim"
                >
                  Submit secure bank details
                </button>
              </form>
            )}

            {!loading && !error && formUrl && paymentMethod === "paypal" && (
              <form action={formUrl} method="POST" className="space-y-4">
                <input type="hidden" name="payment" value="paypal" />
                <div>
                  <label className="mb-1 block text-sm font-medium text-ori-foreground">PayPal Email</label>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm text-ori-foreground"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-ori-accent px-6 py-3 text-sm font-semibold text-ori-black hover:bg-ori-accent-dim"
                >
                  Continue with PayPal
                </button>
              </form>
            )}
          </div>
        </PageContainer>
      </PageSection>
    </>
  );
}
