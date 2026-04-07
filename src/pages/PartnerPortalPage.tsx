import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import {
  clearPartnerToken,
  getPartnerBootstrap,
  getPartnerToken,
  partnerLogin,
  PartnerRequestError,
  setPartnerPassword,
  type PartnerBootstrap,
} from "../lib/partner/api";
import { ROUTES } from "../utils/navigation";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function referralApplyUrl(code: string) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/referral?ref=${encodeURIComponent(code)}`;
}

export function PartnerPortalPage() {
  const [authed, setAuthed] = useState(() => Boolean(getPartnerToken()));
  const [accessKey, setAccessKey] = useState("");
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [useEmailLogin, setUseEmailLogin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFormError, setPasswordFormError] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSavedNotice, setPasswordSavedNotice] = useState(false);
  const [data, setData] = useState<PartnerBootstrap | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFormError("");
    setPasswordSavedNotice(false);
    if (newPassword.length < 8) {
      setPasswordFormError("Use at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFormError("Passwords do not match.");
      return;
    }
    setPasswordSaving(true);
    try {
      await setPartnerPassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSavedNotice(true);
      await load({ showSpinner: true });
    } catch (err) {
      setPasswordFormError(err instanceof Error ? err.message : "Could not save password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = () => {
    clearPartnerToken();
    setAuthed(false);
    setData(null);
    setLoadError(null);
    setLoginError("");
    setPasswordSavedNotice(false);
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
            Sign in with your portal access key (from partner registration or one issued by Ori), or email and the
            temporary password from the back office. Set a password after sign-in to use email next time.
          </p>
        </header>

        <div className="mx-auto max-w-xl">
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
          <header className="border-b border-ori-border pb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-ori-accent">Partner</p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl">
              {data.partner.organizationName}
            </h1>
            {data.partner.referralCode ? (
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void navigator.clipboard.writeText(referralApplyUrl(data.partner.referralCode!))}
                >
                  Copy referral link
                </Button>
                <Button
                  to={`${ROUTES.REFERRAL}?ref=${encodeURIComponent(data.partner.referralCode!)}`}
                  variant="outline"
                  size="sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open referral page
                </Button>
              </div>
            ) : null}
            {data.partner.payoutTerms ? (
              <p className="mt-2 text-sm text-ori-muted">Payout terms: {data.partner.payoutTerms}</p>
            ) : null}
          </header>

          {data.needsPasswordSetup ? (
            <details open className="mt-6 rounded-xl border border-ori-accent/40 bg-ori-surface">
              <summary className="cursor-pointer list-none px-5 py-4 font-display text-base font-semibold text-ori-foreground [&::-webkit-details-marker]:hidden">
                <span className="inline-flex flex-wrap items-center gap-2">
                  Set your password
                  <span className="rounded-md bg-ori-accent/15 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-ori-accent">
                    Required for email sign-in
                  </span>
                </span>
              </summary>
              <div className="border-t border-ori-border px-5 pb-5 pt-1">
                <p className="text-sm text-ori-muted">
                  Keep your access key somewhere safe. Create a password so you can sign in with your email next time.
                </p>
                <form onSubmit={handleSetPassword} className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Input
                    label="New password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordSavedNotice(false);
                    }}
                    autoComplete="new-password"
                  />
                  <Input
                    label="Confirm password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordSavedNotice(false);
                    }}
                    autoComplete="new-password"
                  />
                  <div className="sm:col-span-2">
                    {passwordFormError ? (
                      <p className="text-sm text-red-400" role="alert">
                        {passwordFormError}
                      </p>
                    ) : null}
                    {passwordSavedNotice ? (
                      <p className="text-sm text-ori-accent" role="status">
                        Password saved. You can sign in with your email next time.
                      </p>
                    ) : null}
                    <Button type="submit" className="mt-2" disabled={passwordSaving}>
                      {passwordSaving ? "Saving…" : "Save password"}
                    </Button>
                  </div>
                </form>
              </div>
            </details>
          ) : (
            <details className="mt-6 rounded-xl border border-ori-border bg-ori-surface">
              <summary className="cursor-pointer list-none px-5 py-4 font-display text-base font-semibold text-ori-foreground [&::-webkit-details-marker]:hidden">
                Password &amp; sign-in
              </summary>
              <div className="border-t border-ori-border px-5 pb-5 pt-1">
                <p className="text-sm text-ori-muted">Update the password you use with your email for this portal.</p>
                <form onSubmit={handleSetPassword} className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Input
                    label="New password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordSavedNotice(false);
                    }}
                    autoComplete="new-password"
                  />
                  <Input
                    label="Confirm new password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordSavedNotice(false);
                    }}
                    autoComplete="new-password"
                  />
                  <div className="sm:col-span-2">
                    {passwordFormError ? (
                      <p className="text-sm text-red-400" role="alert">
                        {passwordFormError}
                      </p>
                    ) : null}
                    {passwordSavedNotice ? (
                      <p className="text-sm text-ori-accent" role="status">
                        Password updated.
                      </p>
                    ) : null}
                    <Button type="submit" className="mt-2" variant="outline" disabled={passwordSaving}>
                      {passwordSaving ? "Updating…" : "Update password"}
                    </Button>
                  </div>
                </form>
              </div>
            </details>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Attributed leads" value={String(data.stats.totalLeads)} />
            <Stat label="Commission pending" value={formatMoney(data.stats.commissionPending)} />
            <Stat label="Commission received" value={formatMoney(data.stats.commissionReceived)} />
            <Stat label="Commission paid" value={formatMoney(data.stats.commissionPaid)} />
          </div>

          <div className="mt-6 rounded-xl border border-ori-border bg-ori-surface p-6">
            <h2 className="font-display text-lg font-semibold text-ori-foreground">Leads by program</h2>
            <ul className="mt-3 space-y-1 text-sm text-ori-muted">
              {Object.entries(data.stats.leadsByCta).map(([k, v]) => (
                <li key={k}>
                  <span className="text-ori-foreground">{k}</span>: {v}
                </li>
              ))}
              {Object.keys(data.stats.leadsByCta).length === 0 ? (
                <li>No attributed leads yet. Share your referral link with clients.</li>
              ) : null}
            </ul>
          </div>

          <section className="mt-8 rounded-xl border border-ori-border bg-ori-surface p-6">
            <h2 className="font-display text-lg font-semibold text-ori-foreground">Recent leads</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {data.leads.slice(0, 25).map((row) => (
                <li key={row.id} className="border-b border-ori-border/50 pb-3 last:border-0">
                  <p className="font-medium text-ori-foreground">{row.contactName}</p>
                  <p className="text-xs text-ori-muted">{row.contactEmailMasked}</p>
                  <p className="text-xs text-ori-accent mt-1">
                    {row.ctaType} · {row.status}
                  </p>
                  <p className="text-xs text-ori-muted mt-1">
                    Funding: requested {formatMoney(row.fundingRequested)} · funded {formatMoney(row.fundingFunded)} ·
                    remaining {formatMoney(row.fundingGap)}
                  </p>
                  <p className="text-xs text-ori-muted">{new Date(row.createdAt).toLocaleString()}</p>
                </li>
              ))}
              {data.leads.length === 0 ? <li className="text-ori-muted">No leads attributed to your link yet.</li> : null}
            </ul>
          </section>

          <section className="mt-8 rounded-xl border border-ori-border bg-ori-surface p-6">
            <h2 className="font-display text-lg font-semibold text-ori-foreground">Commissions</h2>
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
                  {data.commissions.map((c) => (
                    <tr key={c.id} className="border-b border-ori-border/40">
                      <td className="py-2 pr-2">{formatMoney(c.amount)}</td>
                      <td className="py-2 pr-2">{c.status}</td>
                      <td className="py-2 pr-2">{c.relatedEntityType}</td>
                      <td className="py-2 text-ori-muted">{new Date(c.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.commissions.length === 0 ? (
                <p className="mt-4 text-sm text-ori-muted">No commission lines yet.</p>
              ) : null}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ori-border bg-ori-surface p-5">
      <p className="text-xs uppercase tracking-wider text-ori-muted">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold text-ori-foreground">{value}</p>
    </div>
  );
}
