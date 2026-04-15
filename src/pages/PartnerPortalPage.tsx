import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { PartnerAccountPanel, referralApplyUrl } from "../components/partner";
import {
  clearPartnerToken,
  completePartnerClaim,
  getPartnerBootstrap,
  getPartnerToken,
  partnerLogin,
  PartnerRequestError,
  setPartnerPassword,
  updatePartnerProfile,
  validatePartnerClaimToken,
  type PartnerBootstrap,
} from "../lib/partner/api";
import { ROUTES } from "../utils/navigation";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

type PartnerKpiSummary = PartnerBootstrap["kpis"];
type PartnerEarningsSummary = {
  pending: number;
  paid: number;
  commissions: PartnerBootstrap["commissions"];
};
type PartnerDashboardOverview = {
  kpis: PartnerKpiSummary;
  earnings: PartnerEarningsSummary;
};

function toDashboardOverview(data: PartnerBootstrap | null): PartnerDashboardOverview {
  if (!data) {
    return {
      kpis: {
        activeClients: 0,
        inProgress: 0,
        fundingReady: 0,
        capitalDeployed: 0,
        consultedClients: 0,
        fundedClients: 0,
        commissionPending: 0,
        commissionPaid: 0,
      },
      earnings: { pending: 0, paid: 0, commissions: [] },
    };
  }
  return {
    kpis: {
      ...data.kpis,
      consultedClients: data.kpis.consultedClients ?? 0,
      fundedClients: data.kpis.fundedClients ?? 0,
    },
    earnings: {
      pending: data.kpis.commissionPending,
      paid: data.kpis.commissionPaid,
      commissions: data.commissions,
    },
  };
}

export function PartnerPortalPage() {
  const [searchParams] = useSearchParams();
  const [authed, setAuthed] = useState(() => Boolean(getPartnerToken()));
  const claimToken = (searchParams.get("claim") || "").trim();
  const [accessKey, setAccessKey] = useState("");
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [claimPassword, setClaimPassword] = useState("");
  const [claimConfirmPassword, setClaimConfirmPassword] = useState("");
  const [claimOrgName, setClaimOrgName] = useState("");
  const [claimEmailMasked, setClaimEmailMasked] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claimReady, setClaimReady] = useState(false);
  const [useEmailLogin, setUseEmailLogin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [promptPassword, setPromptPassword] = useState("");
  const [promptConfirmPassword, setPromptConfirmPassword] = useState("");
  const [promptError, setPromptError] = useState("");
  const [promptSaving, setPromptSaving] = useState(false);
  const [data, setData] = useState<PartnerBootstrap | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const overview = useMemo(() => toDashboardOverview(data), [data]);

  const load = useCallback(async (opts?: { showSpinner?: boolean }) => {
    if (!getPartnerToken()) return;
    if (opts?.showSpinner) setLoading(true);
    setLoadError(null);
    try {
      const b = await getPartnerBootstrap();
      setData(b);
    } catch (e) {
      const authFailure =
        e instanceof PartnerRequestError &&
        (e.status === 401 || e.status === 403 || e.status === 404);
      if (authFailure) {
        clearPartnerToken();
        setAuthed(false);
        setData(null);
        setLoadError(null);
        setLoginError(
          e.status === 404
            ? "Account not found for this session. Sign in again."
            : e.status === 403 && e.message && !e.message.startsWith("Request failed")
              ? e.message
              : "Session expired or invalid. Sign in again."
        );
      } else {
        setLoadError(
          e instanceof PartnerRequestError
            ? e.message
            : "Could not load dashboard. Check your connection and try Refresh."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) void load();
  }, [authed, load]);

  useEffect(() => {
    if (authed && data?.needsPasswordSetup) {
      setShowPasswordPrompt(true);
    }
  }, [authed, data?.needsPasswordSetup]);

  useEffect(() => {
    if (authed || !claimToken) return;
    let cancelled = false;
    setClaimLoading(true);
    setClaimError("");
    void validatePartnerClaimToken(claimToken)
      .then((r) => {
        if (cancelled) return;
        if (!r.valid) {
          setClaimReady(false);
          if (r.error === "expired") {
            setClaimError("This claim link has expired. Ask Ori for a new claim link.");
          } else if (r.error === "claimed") {
            setClaimError("This claim link was already used. Sign in with your email and password.");
          } else {
            setClaimError("This claim link is not valid.");
          }
          return;
        }
        setClaimReady(true);
        setClaimOrgName(r.organizationName || "");
        setClaimEmailMasked(r.emailMasked || "");
      })
      .catch(() => {
        if (!cancelled) {
          setClaimReady(false);
          setClaimError("Could not validate your claim link. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setClaimLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authed, claimToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const r = useEmailLogin
      ? await partnerLogin({ email: emailLogin, password: passwordLogin })
      : await partnerLogin({ accessKey });
    if (r.ok) {
      setAuthed(true);
      setAccessKey("");
      setPasswordLogin("");
    } else {
      setLoginError(r.error || "Sign in failed.");
    }
  };

  const handleLogout = () => {
    clearPartnerToken();
    setAuthed(false);
    setData(null);
    setLoadError(null);
    setLoginError("");
    setShowPasswordPrompt(false);
  };

  const handlePromptPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromptError("");
    if (promptPassword.length < 8) {
      setPromptError("Use at least 8 characters.");
      return;
    }
    if (promptPassword !== promptConfirmPassword) {
      setPromptError("Passwords do not match.");
      return;
    }
    setPromptSaving(true);
    try {
      await setPartnerPassword(promptPassword);
      setShowPasswordPrompt(false);
      setPromptPassword("");
      setPromptConfirmPassword("");
      await load({ showSpinner: true });
    } catch (err) {
      setPromptError(err instanceof Error ? err.message : "Could not set password.");
    } finally {
      setPromptSaving(false);
    }
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimToken) return;
    setClaimError("");
    if (claimPassword.length < 8) {
      setClaimError("Use at least 8 characters.");
      return;
    }
    if (claimPassword !== claimConfirmPassword) {
      setClaimError("Passwords do not match.");
      return;
    }
    setClaimLoading(true);
    const r = await completePartnerClaim({ token: claimToken, password: claimPassword });
    setClaimLoading(false);
    if (!r.ok) {
      setClaimError(r.error || "Could not complete account claim.");
      return;
    }
    setAuthed(true);
    setClaimPassword("");
    setClaimConfirmPassword("");
  };

  if (!authed) {
    const inputFieldClass = "py-2 px-3 text-sm";

    return (
      <div className="ori-container ori-section max-w-2xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="mx-auto max-w-3xl font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl md:leading-tight">
            Partner portal
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium text-ori-muted">
            {claimToken
              ? "Finish account setup by creating your portal password."
              : "Sign in with your portal access key (from partner registration or one issued by Ori), or email and the temporary password from the back office. Set a password after sign-in to use email next time."}
          </p>
        </header>

        <div className="mx-auto max-w-xl">
          {claimToken ? (
            <div className="rounded-2xl border border-ori-border bg-ori-surface p-4 md:p-6">
              {claimOrgName ? (
                <p className="mb-4 text-sm text-ori-muted">
                  Claiming account for <span className="font-medium text-ori-foreground">{claimOrgName}</span>
                  {claimEmailMasked ? ` (${claimEmailMasked})` : ""}.
                </p>
              ) : null}
              <form onSubmit={handleClaim} className="space-y-4">
                <Input
                  label="Create password"
                  type="password"
                  value={claimPassword}
                  onChange={(e) => setClaimPassword(e.target.value)}
                  autoComplete="new-password"
                  className={inputFieldClass}
                  disabled={!claimReady || claimLoading}
                />
                <Input
                  label="Confirm password"
                  type="password"
                  value={claimConfirmPassword}
                  onChange={(e) => setClaimConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className={inputFieldClass}
                  disabled={!claimReady || claimLoading}
                />
                {claimError ? (
                  <div
                    className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                    role="alert"
                  >
                    {claimError}
                  </div>
                ) : null}
                <Button type="submit" className="w-full" disabled={!claimReady || claimLoading}>
                  {claimLoading ? "Completing setup..." : "Claim account"}
                </Button>
              </form>
              <p className="mt-5 text-center text-xs text-ori-muted">
                Already set up?{" "}
                <Link to={ROUTES.PARTNER} className="text-ori-accent hover:underline">
                  Go to sign-in
                </Link>
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-ori-border bg-ori-surface p-4 md:p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {useEmailLogin ? (
                  <>
                    <Input
                      label="Email"
                      type="email"
                      value={emailLogin}
                      onChange={(e) => setEmailLogin(e.target.value)}
                      autoComplete="username"
                      className={inputFieldClass}
                    />
                    <Input
                      label="Password"
                      type="password"
                      value={passwordLogin}
                      onChange={(e) => setPasswordLogin(e.target.value)}
                      autoComplete="current-password"
                      className={inputFieldClass}
                    />
                  </>
                ) : (
                  <Input
                    label="Access key"
                    type="password"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    autoComplete="current-password"
                    className={inputFieldClass}
                  />
                )}
                <button
                  type="button"
                  className="text-xs text-ori-accent hover:underline"
                  onClick={() => {
                    setUseEmailLogin(!useEmailLogin);
                    setLoginError("");
                  }}
                >
                  {useEmailLogin ? "Sign in with access key instead" : "Sign in with email and password"}
                </button>
                {loginError ? (
                  <div
                    className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                    role="alert"
                  >
                    {loginError}
                  </div>
                ) : null}
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </form>

              <div className="mt-6 border-t border-ori-border pt-6 text-center">
                <p className="text-sm font-medium text-ori-foreground">New partner?</p>
                <Button to={ROUTES.PARTNER_REGISTER} variant="outline" className="mt-3 w-full" size="md">
                  Partner registration
                </Button>
              </div>
            </div>
          )}

          <p className="mt-4 text-center text-sm text-ori-muted">
            Looking for funding for your business?{" "}
            <Link to={ROUTES.APPLY} className="text-ori-accent hover:underline">
              Apply for funding
            </Link>
          </p>
          <p className="mt-6 text-center text-sm text-ori-muted">
            <Link to={ROUTES.HOME} className="text-ori-accent hover:underline">
              Back to site
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ori-container ori-section mx-auto max-w-6xl pb-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to={ROUTES.HOME} className="text-sm text-ori-muted hover:text-ori-accent">
          ← Back to site
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void load({ showSpinner: true })}
            className="text-sm text-ori-muted hover:text-ori-accent"
            disabled={loading}
          >
            Refresh
          </button>
          <button type="button" onClick={handleLogout} className="text-sm text-ori-muted hover:text-ori-foreground">
            Sign out
          </button>
        </div>
      </div>

      {authed && !data && !loadError ? <p className="text-sm text-ori-muted">Loading your dashboard…</p> : null}
      {loadError ? <p className="text-sm text-red-400">{loadError}</p> : null}

      {data?.partner ? (
        <>
          <header className="border-b border-ori-border/80 pb-8 md:pb-10">
            <p className="ori-type-eyebrow text-ori-accent">Partner portal</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl">
              {data.partner.organizationName}
            </h1>
          </header>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-10">
            <Stat label="Consulted clients" value={String(overview.kpis.consultedClients)} />
            <Stat label="Subscribed clients" value={String(overview.kpis.activeClients)} />
            <Stat label="Enrolled clients" value={String(overview.kpis.inProgress)} />
            <Stat label="Funded clients" value={String(overview.kpis.fundedClients)} />
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Stat label="Commission pending" value={formatMoney(overview.kpis.commissionPending)} />
            <Stat label="Commission paid" value={formatMoney(overview.kpis.commissionPaid)} />
          </div>

          <section className="mt-8 rounded-xl border border-ori-border bg-ori-surface p-6">
            <h2 className="font-display text-lg font-semibold text-ori-foreground">What changed this week</h2>
            {data.activityTimeline.length === 0 ? (
              <p className="mt-3 text-sm text-ori-muted">No partner activity yet this week.</p>
            ) : (
              <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1 text-sm">
                {data.activityTimeline.map((item) => (
                  <li key={item.id} className="rounded-lg border border-ori-border/60 bg-ori-charcoal/35 p-3">
                    <p className="text-ori-foreground">{item.label}</p>
                    <p className="mt-1 text-xs text-ori-muted">{new Date(item.createdAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-8 rounded-xl border border-ori-border bg-ori-surface p-6">
            <h2 className="font-display text-lg font-semibold text-ori-foreground">Referrals &amp; Earnings</h2>
            {data.partner.referralCode ? (
              <p className="mt-2 text-xs text-ori-muted break-all">
                Referral link: {referralApplyUrl(data.partner.referralCode)}
              </p>
            ) : null}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ori-border text-xs text-ori-muted">
                    <th className="py-2 pr-2">Amount</th>
                    <th className="py-2 pr-2">Status</th>
                    <th className="py-2 pr-2">Type</th>
                    <th className="py-2">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.earnings.commissions.map((c) => (
                    <tr key={c.id} className="border-b border-ori-border/40">
                      <td className="py-2 pr-2">{formatMoney(c.amount)}</td>
                      <td className="py-2 pr-2">{c.status}</td>
                      <td className="py-2 pr-2">{c.relatedEntityType}</td>
                      <td className="py-2 text-ori-muted">{new Date(c.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {overview.earnings.commissions.length === 0 ? (
                <p className="mt-4 text-sm text-ori-muted">No commission lines yet.</p>
              ) : null}
            </div>
          </section>

          <PartnerAccountPanel
            partner={data.partner}
            needsPasswordSetup={data.needsPasswordSetup}
            className="mt-12 border-t border-ori-border/80 pt-12 md:mt-16 md:pt-16"
            onProfileSave={async (payload) => {
              await updatePartnerProfile(payload);
              await load({ showSpinner: true });
            }}
            onPasswordCommit={async (password) => {
              await setPartnerPassword(password);
              await load({ showSpinner: true });
            }}
          />
          {showPasswordPrompt ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-ori-black/75 p-4">
              <div className="w-full max-w-md rounded-2xl border border-ori-border bg-ori-surface p-5 shadow-xl">
                <h2 className="font-display text-xl font-semibold text-ori-foreground">Create your password</h2>
                <p className="mt-2 text-sm text-ori-muted">
                  Set a password now so you can sign in with your email next time.
                </p>
                <form className="mt-4 space-y-3.5" onSubmit={handlePromptPasswordSubmit}>
                  <Input
                    label="New password"
                    type="password"
                    value={promptPassword}
                    onChange={(e) => setPromptPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <Input
                    label="Confirm password"
                    type="password"
                    value={promptConfirmPassword}
                    onChange={(e) => setPromptConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  {promptError ? (
                    <p className="text-sm text-red-400" role="alert">
                      {promptError}
                    </p>
                  ) : null}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={promptSaving}
                      onClick={() => setShowPasswordPrompt(false)}
                    >
                      Later
                    </Button>
                    <Button type="submit" disabled={promptSaving}>
                      {promptSaving ? "Saving..." : "Save password"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ori-border bg-ori-surface-panel p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ring-1 ring-white/[0.04]">
      <p className="ori-type-label text-ori-text-secondary">{label}</p>
      <p className="mt-2 font-display text-xl font-semibold text-ori-foreground">{value}</p>
    </div>
  );
}
