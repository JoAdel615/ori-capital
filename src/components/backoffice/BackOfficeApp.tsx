import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router-dom";
import { Button } from "../Button";
import { Input } from "../Input";
import {
  adminLogin,
  approveTestimonial,
  clearAdminToken,
  createManualLead,
  createOpportunity,
  createFundingRecord,
  createPartner,
  createTestimonialAdmin,
  deleteLead,
  deletePartner,
  generatePartnerPortalKey,
  getAdminToken,
  getBackOfficeBootstrap,
  patchCommission,
  patchFundingRecord,
  patchLead,
  patchOpportunity,
  patchSubscription,
  patchTestimonial,
  sendTestimonialRequest,
  sendPartnerInvite,
  sendPartnerApprovalInvite,
  updatePartner,
  updateSiteMetrics,
} from "../../lib/backoffice/api";
import {
  BACKOFFICE_LEAD_COMPLETE,
  BACKOFFICE_LEAD_PIPELINE,
  leadPipelineSelectOptions,
  PARTNER_STATUS_OPTIONS,
} from "../../lib/backoffice/leadStatuses";
import type { BackOfficeBootstrap } from "../../lib/backoffice/bootstrapTypes";
import type {
  CommissionRecord,
  ContactRecord,
  FundingRecord,
  LeadRecord,
  OpportunityRecord,
  PartnerRecord,
  SiteMetricConfig,
  SubscriptionEnrollmentRecord,
  TestimonialRecord,
} from "../../lib/backoffice/types";
import {
  CLIENT_SEGMENT_OPTIONS,
  FUNDING_NEED_OPTIONS,
  PARTNERSHIP_INTEREST_OPTIONS,
} from "../../lib/partner/partnerRegistrationIntake";
import { ROUTES } from "../../utils/navigation";
import { formatActivityLine } from "../../lib/backoffice/activityLabels";
import { COMMISSION_PCT_OPTIONS, PARTNER_TYPES } from "../../lib/backoffice/partnerFormOptions";
import { copyPartnerRegisterInviteLink } from "../../lib/partner/inviteUrl";
import {
  mergeCommission,
  mergeContact,
  mergeFundingRecord,
  mergeLead,
  mergeLeadPatchResponse,
  mergeOpportunity,
  mergePartner,
  mergeSiteMetricConfig,
  mergeSubscription,
  mergeTestimonial,
  removeLeadCascade,
  removePartnerCascade,
} from "../../lib/backoffice/bootstrapMerge";

const FUNDING_TYPE_OPTIONS = [
  "Term Loan",
  "Line of Credit",
  "SBA Loan",
  "Revenue-Based Financing",
  "Equipment Financing",
  "Invoice Financing",
  "Merchant Cash Advance",
  "Grant",
  "Equity / Angel / VC",
  "Other",
] as const;

const CLIENT_STATE_OPTIONS = ["Active", "Inactive", "Archive"] as const;

const REMOVE_PARTNER_SELECT = "__REMOVE_PARTNER__";

const ADMIN_PORTAL_KEYS_STORAGE = "ori_admin_last_portal_keys_v1";

function readPortalKeysFromSession(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(ADMIN_PORTAL_KEYS_STORAGE);
    if (!raw) return {};
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object" || Array.isArray(o)) return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "string" && v.length > 0) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

type Tab = "dashboard" | "leads" | "clients" | "partners" | "metrics" | "testimonials";

function tabClass(active: boolean) {
  return `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    active
      ? "bg-ori-accent/20 text-ori-accent"
      : "text-ori-muted hover:bg-ori-charcoal/80 hover:text-ori-foreground"
  }`;
}

function partnerStatusPillClass(status: string): string {
  const s = String(status || "ACTIVE").toUpperCase();
  const base = "rounded-full px-2 py-0.5 text-xs font-medium border";
  if (s === "ACTIVE") return `${base} border-emerald-500/50 bg-emerald-500/15 text-emerald-300`;
  if (s === "INVITED") return `${base} border-amber-500/50 bg-amber-500/15 text-amber-200`;
  if (s === "SUSPENDED") return `${base} border-red-500/50 bg-red-500/15 text-red-300`;
  if (s === "ARCHIVED") return `${base} border-ori-border bg-ori-charcoal/70 text-ori-muted`;
  return `${base} border-ori-border bg-ori-charcoal/60 text-ori-muted`;
}

function clientFundingSnapshotForLead(
  leadId: string,
  opportunitiesByLeadId: Map<string, OpportunityRecord[]>,
  fundingByOppId: Map<string, FundingRecord[]>
) {
  const opps = opportunitiesByLeadId.get(leadId) || [];
  let totalRequested = 0;
  let totalApproved = 0;
  let totalFunded = 0;
  for (const opp of opps) {
    totalRequested += Number(opp.requestedAmount || 0);
    for (const fr of fundingByOppId.get(opp.id) || []) {
      totalApproved += Number(fr.approvedAmount || 0);
      totalFunded += Number(fr.fundedAmount || 0);
    }
  }
  return {
    totalRequested,
    totalApproved,
    totalFunded,
    remainingGap: Math.max(0, totalRequested - totalFunded),
  };
}

export function BackOfficeApp() {
  const [tab, setTab] = useState<Tab>(() => {
    if (typeof window === "undefined") return "dashboard";
    const q = new URLSearchParams(window.location.search).get("tab");
    if (q === "promos") return "partners";
    const allowed: Tab[] = ["dashboard", "leads", "clients", "partners", "metrics", "testimonials"];
    return allowed.includes(q as Tab) ? (q as Tab) : "dashboard";
  });
  const [authed, setAuthed] = useState(() => Boolean(getAdminToken()));
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<BackOfficeBootstrap | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastPortalKeys, setLastPortalKeys] = useState<Record<string, string>>(readPortalKeysFromSession);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(ADMIN_PORTAL_KEYS_STORAGE, JSON.stringify(lastPortalKeys));
    } catch {
      /* quota / private mode */
    }
  }, [lastPortalKeys]);

  const refresh = useCallback(async (options?: { showLoading?: boolean }) => {
    if (!getAdminToken()) return;
    if (options?.showLoading) setLoading(true);
    setLoadError(null);
    try {
      const b = await getBackOfficeBootstrap();
      setData(b);
    } catch {
      setLoadError("Could not load back office data. Check your session.");
      // Preserve the current UI snapshot on transient failures.
    } finally {
      setLoading(false);
    }
  }, []);

  const mergeBootstrap = useCallback((fn: (b: BackOfficeBootstrap) => BackOfficeBootstrap) => {
    setData((prev) => (prev ? fn(prev) : prev));
  }, []);

  /** Full bootstrap replace without browser reload (no loading spinner). */
  const resyncBootstrap = useCallback(async () => {
    if (!getAdminToken()) return;
    try {
      const b = await getBackOfficeBootstrap();
      setData(b);
    } catch {
      /* keep snapshot */
    }
  }, []);

  useEffect(() => {
    if (authed) void refresh();
  }, [authed, refresh]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
  }, [tab]);

  const contactsById = useMemo(() => {
    const m = new Map<string, ContactRecord>();
    data?.contacts.forEach((c) => m.set(c.id, c));
    return m;
  }, [data]);

  const opportunitiesByLeadId = useMemo(() => {
    const m = new Map<string, OpportunityRecord[]>();
    data?.opportunities.forEach((o) => {
      const list = m.get(o.leadId) || [];
      list.push(o);
      m.set(o.leadId, list);
    });
    return m;
  }, [data]);

  const fundingByOppId = useMemo(() => {
    const m = new Map<string, FundingRecord[]>();
    data?.fundingRecords.forEach((f) => {
      const list = m.get(f.opportunityId) || [];
      list.push(f);
      m.set(f.opportunityId, list);
    });
    return m;
  }, [data]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const ok = await adminLogin(password);
    if (ok) {
      setAuthed(true);
      setPassword("");
    } else {
      setLoginError("Invalid credentials.");
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setAuthed(false);
    setData(null);
  };

  if (!authed) {
    return (
      <div className="ori-container ori-section max-w-xs mx-auto">
        <div className="rounded-xl border border-ori-border bg-ori-surface/80 p-6">
          <h1 className="font-display text-xl font-bold text-ori-foreground">Back Office</h1>
          <p className="mt-1 text-sm text-ori-muted">
            Sign in with the operations password. Data is stored on the server (see <code className="text-xs">.data/backoffice.json</code>).
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {loginError ? (
              <p className="text-sm text-red-400" role="alert">
                {loginError}
              </p>
            ) : null}
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="ori-container ori-section max-w-6xl mx-auto pb-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to={ROUTES.HOME} className="text-sm text-ori-muted hover:text-ori-accent">
          ← Back to site
        </Link>
        <button type="button" onClick={handleLogout} className="text-sm text-ori-muted hover:text-ori-foreground">
          Sign out
        </button>
      </div>

      <header className="border-b border-ori-border pb-6">
        <h1 className="font-display text-2xl font-bold text-ori-foreground">Ori Back Office</h1>
        <p className="mt-1 text-sm text-ori-muted">
          Intake, routing, partners, commissions, and site metrics — unified with persistent storage.
        </p>
        <nav className="mt-4 flex flex-wrap gap-1" aria-label="Back office sections">
          {(
            [
              ["dashboard", "Dashboard"],
              ["leads", "Leads"],
              ["clients", "Clients"],
              ["partners", "Partners"],
              ["metrics", "Site metrics"],
              ["testimonials", "Testimonials"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" className={tabClass(tab === id)} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      {loadError ? (
        <p className="mt-6 text-sm text-red-400">{loadError}</p>
      ) : null}
      {!data && authed ? (
        <p className="mt-8 text-sm text-ori-muted">Loading…</p>
      ) : null}

      {data && tab === "dashboard" ? (
        <DashboardSection dashboard={data.dashboard} onRefresh={() => void refresh({ showLoading: true })} loading={loading} />
      ) : null}
      {data && tab === "leads" ? (
        <LeadsSection
          leads={data.leads}
          contactsById={contactsById}
          partners={data.partners}
          commissions={data.commissions}
          subscriptions={data.subscriptions}
          mergeBootstrap={mergeBootstrap}
        />
      ) : null}
      {data && tab === "clients" ? (
        <ClientsSection
          leads={data.leads}
          contactsById={contactsById}
          partners={data.partners}
          opportunitiesByLeadId={opportunitiesByLeadId}
          fundingByOppId={fundingByOppId}
          subscriptions={data.subscriptions}
          mergeBootstrap={mergeBootstrap}
        />
      ) : null}
      {data && tab === "partners" ? (
        <PartnersSection
          partners={data.partners}
          leads={data.leads}
          commissions={data.commissions}
          mergeBootstrap={mergeBootstrap}
          lastPortalKeys={lastPortalKeys}
          setLastPortalKeys={setLastPortalKeys}
        />
      ) : null}
      {data && tab === "metrics" ? (
        <MetricsSection config={data.siteMetricConfig} mergeBootstrap={mergeBootstrap} />
      ) : null}
      {data && tab === "testimonials" ? (
        <TestimonialsBackOffice testimonials={data.testimonials} mergeBootstrap={mergeBootstrap} resyncBootstrap={resyncBootstrap} />
      ) : null}
    </div>
  );
}

function DashboardSection({
  dashboard,
  onRefresh,
  loading,
}: {
  dashboard: BackOfficeBootstrap["dashboard"];
  onRefresh: () => void;
  loading: boolean;
}) {
  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          Refresh
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total leads" value={String(dashboard.totalLeads)} />
        <StatCard label="Funded volume ($)" value={dashboard.fundedVolume.toLocaleString()} />
        <StatCard label="Commission revenue ($)" value={dashboard.commissionRevenue.toLocaleString()} />
        <StatCard label="Active subscriptions" value={String(dashboard.activeSubscriptions)} />
      </div>
      <div className="rounded-xl border border-ori-border bg-ori-surface/80 p-6">
        <h2 className="font-display text-lg font-semibold text-ori-foreground">Leads by CTA</h2>
        <ul className="mt-3 space-y-1 text-sm text-ori-muted">
          {Object.entries(dashboard.leadsByCta).map(([k, v]) => (
            <li key={k}>
              <span className="text-ori-foreground">{k}</span>: {v}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-ori-border bg-ori-surface/80 p-6">
          <h2 className="font-display text-lg font-semibold text-ori-foreground">Partner leaderboard</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {dashboard.partnerLeaderboard.map((p) => (
              <li
                key={p.partnerId}
                className="border-b border-ori-border/40 pb-3 last:border-0 text-ori-muted"
              >
                <span className="font-medium text-ori-foreground">{p.name}</span>
                <span className="mt-0.5 block text-xs sm:inline sm:ml-2">
                  {p.leads} leads · ${p.commissionsOwed.toLocaleString()} owed
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-ori-border bg-ori-surface/80 p-6">
          <h2 className="font-display text-lg font-semibold text-ori-foreground">Recent activity</h2>
          <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-xs text-ori-muted">
            {dashboard.recentActivity.map((a) => (
              <li key={a.id} className="leading-relaxed text-ori-foreground/90">
                {formatActivityLine(a)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ori-border bg-ori-charcoal/50 p-4">
      <p className="text-xs uppercase tracking-wider text-ori-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ori-foreground">{value}</p>
    </div>
  );
}

function LeadsSection({
  leads,
  contactsById,
  partners,
  commissions,
  subscriptions,
  mergeBootstrap,
}: {
  leads: LeadRecord[];
  contactsById: Map<string, ContactRecord>;
  partners: PartnerRecord[];
  commissions: CommissionRecord[];
  subscriptions: SubscriptionEnrollmentRecord[];
  mergeBootstrap: (fn: (b: BackOfficeBootstrap) => BackOfficeBootstrap) => void;
}) {
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterCta, setFilterCta] = useState<string>("");
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [leadStatusDrafts, setLeadStatusDrafts] = useState<Record<string, string>>({});
  const [manual, setManual] = useState({
    name: "",
    email: "",
    phone: "",
    ctaType: "CONSULT",
    status: "None",
    sourceDetail: "Back Office",
  });

  const manualStatusOptions = useMemo(() => [...BACKOFFICE_LEAD_PIPELINE], []);

  useEffect(() => {
    setManual((m) => ({
      ...m,
      status: (BACKOFFICE_LEAD_PIPELINE as readonly string[]).includes(m.status) ? m.status : "None",
    }));
  }, [manual.ctaType]);

  const filtered = useMemo(() => {
    if (!filterCta) return leads;
    return leads.filter((l) => l.ctaType === filterCta);
  }, [leads, filterCta]);

  useEffect(() => {
    const valid = new Set(filtered.map((l) => l.id));
    setSelectedLeadIds((prev) => prev.filter((id) => valid.has(id)));
  }, [filtered]);

  return (
    <div className="mt-8 space-y-4">
      <section className="rounded-xl border border-ori-border bg-ori-surface/80 p-4 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="font-display text-md font-semibold text-ori-foreground">Add lead manually</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => setAddLeadOpen((o) => !o)}>
            {addLeadOpen ? "Close" : "Add lead"}
          </Button>
        </div>
        {!addLeadOpen ? (
          <p className="text-xs text-ori-muted">
            Use <span className="font-semibold text-ori-foreground">Add lead</span> to open the form. New leads default
            to status <span className="font-semibold text-ori-foreground">None</span>.
          </p>
        ) : (
          <>
            <div className="mt-1 grid gap-2 sm:grid-cols-3">
              <Input label="Full name" value={manual.name} onChange={(e) => setManual((m) => ({ ...m, name: e.target.value }))} />
              <Input
                label="Email"
                type="email"
                value={manual.email}
                onChange={(e) => setManual((m) => ({ ...m, email: e.target.value }))}
              />
              <Input label="Phone" value={manual.phone} onChange={(e) => setManual((m) => ({ ...m, phone: e.target.value }))} />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <label className="text-sm text-ori-muted">
                Type
                <select
                  value={manual.ctaType}
                  onChange={(e) => setManual((m) => ({ ...m, ctaType: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-ori-border bg-ori-charcoal px-2 py-1.5 text-ori-foreground"
                >
                  <option value="CONSULT">CONSULT</option>
                  <option value="APPLY">APPLY</option>
                  <option value="PREQUAL">PREQUAL</option>
                  <option value="PARTNER">PARTNER</option>
                </select>
              </label>
              <label className="text-sm text-ori-muted">
                Status
                <select
                  value={manual.status}
                  onChange={(e) => setManual((m) => ({ ...m, status: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-ori-border bg-ori-charcoal px-2 py-1.5 text-ori-foreground"
                >
                  {manualStatusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <Input
                label="Source"
                value={manual.sourceDetail}
                onChange={(e) => setManual((m) => ({ ...m, sourceDetail: e.target.value }))}
              />
            </div>
            <div>
              <Button
                type="button"
                size="sm"
                onClick={async () => {
                  const res = await createManualLead(manual);
                  setManual({
                    name: "",
                    email: "",
                    phone: "",
                    ctaType: "CONSULT",
                    status: "None",
                    sourceDetail: "Back Office",
                  });
                  setAddLeadOpen(false);
                  mergeBootstrap((b) => mergeLead(mergeContact(b, res.contact), res.lead));
                }}
              >
                Save lead
              </Button>
            </div>
          </>
        )}
      </section>
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-ori-muted">
          CTA filter{" "}
          <select
            value={filterCta}
            onChange={(e) => setFilterCta(e.target.value)}
            className="ml-2 rounded-lg border border-ori-border bg-ori-charcoal px-2 py-1 text-ori-foreground"
          >
            <option value="">All</option>
            <option value="APPLY">APPLY</option>
            <option value="PREQUAL">PREQUAL</option>
            <option value="CONSULT">CONSULT</option>
            <option value="PARTNER">PARTNER</option>
          </select>
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-ori-muted">
          <input
            type="checkbox"
            checked={filtered.length > 0 && selectedLeadIds.length === filtered.length}
            onChange={(e) => {
              if (e.target.checked) setSelectedLeadIds(filtered.map((l) => l.id));
              else setSelectedLeadIds([]);
            }}
          />
          Select all
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
          disabled={selectedLeadIds.length === 0}
          onClick={async () => {
            const count = selectedLeadIds.length;
            const ok = window.confirm(`Delete ${count} selected lead${count === 1 ? "" : "s"} and linked records?`);
            if (!ok) return;
            const ids = [...selectedLeadIds];
            if (expanded && ids.includes(expanded)) setExpanded(null);
            setSelectedLeadIds([]);
            await Promise.all(ids.map((id) => deleteLead(id)));
            mergeBootstrap((b) => ids.reduce((acc, id) => removeLeadCascade(acc, id), b));
          }}
        >
          Delete selected ({selectedLeadIds.length})
        </Button>
      </div>
      <ul className="space-y-3 max-h-[58vh] overflow-y-auto pr-1">
        {filtered.map((lead) => {
          const c = contactsById.get(lead.contactId);
          const sub = subscriptions.find((s) => s.leadId === lead.id);
          const payload = lead.intakePayload as Record<string, unknown>;
          const surveySnapshot = payload?.surveySnapshot as
            | { result?: { score?: number; tier?: string; zone?: string } }
            | undefined;
          const isOpen = expanded === lead.id;
          return (
            <li key={lead.id} className="rounded-xl border border-ori-border bg-ori-surface/80 overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-2 p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.includes(lead.id)}
                    onChange={(e) => {
                      setSelectedLeadIds((prev) =>
                        e.target.checked ? Array.from(new Set([...prev, lead.id])) : prev.filter((id) => id !== lead.id)
                      );
                    }}
                    aria-label={`Select lead ${lead.id}`}
                    className="mt-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ori-foreground">{c ? `${c.firstName} ${c.lastName}` : "Contact"}</p>
                    <p className="text-sm text-ori-accent">{c?.email}</p>
                    <dl className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2 text-xs">
                      <div>
                        <dt className="text-ori-muted font-medium uppercase tracking-wide">Created</dt>
                        <dd className="text-ori-foreground mt-0.5">{new Date(lead.createdAt).toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt className="text-ori-muted font-medium uppercase tracking-wide">Status</dt>
                        <dd className="text-ori-foreground mt-0.5">{lead.status}</dd>
                      </div>
                      <div>
                        <dt className="text-ori-muted font-medium uppercase tracking-wide">Type</dt>
                        <dd className="text-ori-foreground mt-0.5">{lead.ctaType}</dd>
                      </div>
                      <div>
                        <dt className="text-ori-muted font-medium uppercase tracking-wide">Affiliate</dt>
                        <dd className="text-ori-foreground mt-0.5">
                          {(lead.partnerId && partners.find((p) => p.id === lead.partnerId)?.organizationName) ||
                            (typeof payload.affiliatePartnerName === "string" ? payload.affiliatePartnerName : null) ||
                            "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-ori-muted font-medium uppercase tracking-wide">Referral</dt>
                        <dd className="text-ori-foreground mt-0.5">
                          {String(payload?.referralSource || lead.sourceDetail || "Unknown")}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-ori-muted font-medium uppercase tracking-wide">Readiness survey</dt>
                        <dd className="text-ori-foreground mt-0.5">
                          {surveySnapshot?.result ? (
                            <>
                              Score {surveySnapshot.result.score} · {surveySnapshot.result.tier} · {surveySnapshot.result.zone}
                            </>
                          ) : (
                            "No snapshot in payload"
                          )}
                        </dd>
                      </div>
                      {sub ? (
                        <div>
                          <dt className="text-ori-muted font-medium uppercase tracking-wide">Subscription</dt>
                          <dd className="text-ori-foreground mt-0.5">{sub.subscriptionStatus}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setExpanded(isOpen ? null : lead.id)}>
                  {isOpen ? "Close" : "Manage"}
                </Button>
              </div>
              {isOpen ? (
                <div className="border-t border-ori-border bg-ori-charcoal/40 p-4 space-y-4 text-sm">
                  <div className="max-w-xs">
                    <label className="block text-xs text-ori-muted">Status</label>
                    <select
                      value={
                        leadStatusDrafts[lead.id] ??
                        ((BACKOFFICE_LEAD_PIPELINE as readonly string[]).includes(lead.status) ? lead.status : "None")
                      }
                      className="mt-1 w-full rounded-lg border border-ori-border bg-ori-charcoal px-2 py-1.5"
                      onChange={async (e) => {
                        const next = e.target.value;
                        if (next === BACKOFFICE_LEAD_COMPLETE) {
                          const ok = window.confirm(
                            "Remove this lead and its linked opportunity, funding, and subscription records?"
                          );
                          if (!ok) {
                            setLeadStatusDrafts((prev) => {
                              const { [lead.id]: _, ...rest } = prev;
                              return rest;
                            });
                            return;
                          }
                          await deleteLead(lead.id);
                          if (expanded === lead.id) setExpanded(null);
                          mergeBootstrap((b) => removeLeadCascade(b, lead.id));
                          return;
                        }
                        setLeadStatusDrafts((prev) => ({ ...prev, [lead.id]: next }));
                        try {
                          const res = await patchLead(lead.id, { status: next });
                          mergeBootstrap((b) => mergeLeadPatchResponse(b, res));
                          if (res.portalAccessKey) {
                            window.alert(
                              `Partner profile created.\n\nCopy the portal access key now (shown once):\n\n${res.portalAccessKey}`
                            );
                          }
                          setLeadStatusDrafts((prev) => {
                            const { [lead.id]: _, ...rest } = prev;
                            return rest;
                          });
                        } catch {
                          setLeadStatusDrafts((prev) => {
                            const { [lead.id]: _, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                    >
                      {leadPipelineSelectOptions(lead.status).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={async () => {
                        const ok = window.confirm(
                          "Delete this lead and its linked opportunity/funding records? This cannot be undone."
                        );
                        if (!ok) return;
                        await deleteLead(lead.id);
                        if (expanded === lead.id) setExpanded(null);
                        mergeBootstrap((b) => removeLeadCascade(b, lead.id));
                      }}
                    >
                      Delete lead
                    </Button>
                  </div>
                  <details className="text-xs text-ori-muted">
                    <summary className="cursor-pointer text-ori-foreground">Intake payload</summary>
                    <pre className="mt-2 max-h-40 overflow-auto rounded bg-ori-black/40 p-2">
                      {JSON.stringify(lead.intakePayload, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      <div className="rounded-xl border border-ori-border bg-ori-surface/80 p-6">
        <h3 className="font-display text-md font-semibold text-ori-foreground">Commission lines</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {commissions.slice(0, 40).map((cm) => {
            const p = partners.find((x) => x.id === cm.partnerId);
            return (
              <li key={cm.id} className="flex flex-wrap items-center gap-2 justify-between border-b border-ori-border/50 pb-2">
                <span>
                  {p?.organizationName ?? cm.partnerId} · ${cm.amount.toLocaleString()} · {cm.status}
                </span>
                <span className="flex flex-wrap gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="!px-2 !py-1 text-xs"
                    onClick={async () => {
                      const res = await patchCommission(cm.id, { status: "RECEIVED" });
                      mergeBootstrap((b) => mergeCommission(b, res.commission));
                    }}
                  >
                    Received
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="!px-2 !py-1 text-xs"
                    onClick={async () => {
                      const res = await patchCommission(cm.id, { status: "PAID" });
                      mergeBootstrap((b) => mergeCommission(b, res.commission));
                    }}
                  >
                    Paid
                  </Button>
                  <input
                    type="number"
                    className="w-20 rounded border border-ori-border bg-ori-charcoal px-1 text-xs"
                    defaultValue={cm.amount}
                    onBlur={async (e) => {
                      const res = await patchCommission(cm.id, { amount: Number(e.target.value) });
                      mergeBootstrap((b) => mergeCommission(b, res.commission));
                    }}
                  />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function PartnersSection({
  partners,
  leads,
  commissions,
  mergeBootstrap,
  lastPortalKeys,
  setLastPortalKeys,
}: {
  partners: PartnerRecord[];
  leads: LeadRecord[];
  commissions: CommissionRecord[];
  mergeBootstrap: (fn: (b: BackOfficeBootstrap) => BackOfficeBootstrap) => void;
  lastPortalKeys: Record<string, string>;
  setLastPortalKeys: Dispatch<SetStateAction<Record<string, string>>>;
}) {
  const [form, setForm] = useState({
    type: "ACCELERATOR_INCUBATOR" as PartnerRecord["type"],
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    defaultCommissionRate: 0.03,
  });
  const [partnerSearch, setPartnerSearch] = useState("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [addPartnerOpen, setAddPartnerOpen] = useState(false);
  const [partnerNotice, setPartnerNotice] = useState<{ partnerId: string; variant: "ok" | "err"; message: string } | null>(
    null
  );

  const filteredPartners = useMemo(() => {
    const q = partnerSearch.trim().toLowerCase();
    const list = [...partners].sort((a, b) => a.organizationName.localeCompare(b.organizationName));
    if (!q) return list;
    return list.filter(
      (p) =>
        p.organizationName.toLowerCase().includes(q) ||
        (p.referralCode && applyRefUrl(p.referralCode).toLowerCase().includes(q)) ||
        (p.referralCode || "").toLowerCase().includes(q) ||
        (p.email || "").toLowerCase().includes(q)
    );
  }, [partners, partnerSearch]);

  useEffect(() => {
    const v = filteredPartners;
    setSelectedPartnerId((prev) => {
      if (prev && v.some((x) => x.id === prev)) return prev;
      return v[0]?.id ?? null;
    });
  }, [filteredPartners]);

  useEffect(() => {
    setPartnerNotice(null);
  }, [selectedPartnerId]);

  const selected = useMemo(() => partners.find((p) => p.id === selectedPartnerId) ?? null, [partners, selectedPartnerId]);

  const applyRefUrl = (c: string) =>
    `${typeof window !== "undefined" ? window.location.origin : ""}/referral?ref=${encodeURIComponent(c)}`;

  const resetForm = () =>
    setForm({
      type: "ACCELERATOR_INCUBATOR",
      organizationName: "",
      contactName: "",
      email: "",
      phone: "",
      defaultCommissionRate: 0.03,
    });

  const payloadBase = () => ({
    type: form.type,
    organizationName: form.organizationName.trim(),
    contactName: form.contactName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    defaultCommissionRate: form.defaultCommissionRate,
  });

  const submitAdmin = async () => {
    if (!form.organizationName.trim()) return;
    if (!form.email.trim()) {
      window.alert("Email is required to create a partner from the admin form (temporary password sign-in).");
      return;
    }
    try {
      const res = await createPartner({ ...payloadBase(), partnerOnboarding: "ADMIN" });
      if (res.temporaryPassword) {
        window.alert(
          `Partner created.\n\nEmail: ${form.email.trim()}\nTemporary password (copy now — share securely):\n${res.temporaryPassword}\n\nReferral link (share with clients):\n${res.referralLink}`
        );
      }
      resetForm();
      setAddPartnerOpen(false);
      mergeBootstrap((b) => mergePartner(b, res.partner));
      setSelectedPartnerId(res.partner.id);
    } catch {
      window.alert("Could not create partner.");
    }
  };

  const submitInvite = async () => {
    try {
      const base = typeof window !== "undefined" ? window.location.origin : "";
      const registerLink = `${base}${ROUTES.PARTNER_REGISTER}`;
      await copyPartnerRegisterInviteLink(registerLink);
      window.alert("Partner registration form link copied to clipboard.");
    } catch {
      window.alert("Could not copy partner registration link.");
    }
  };

  const partnerTypeLabel = (t: PartnerRecord["type"]) => PARTNER_TYPES.find((x) => x.value === t)?.label ?? t;

  const segmentLabel = (v: string) => CLIENT_SEGMENT_OPTIONS.find((o) => o.value === v)?.label ?? v;
  const fundingLabel = (v: string) => FUNDING_NEED_OPTIONS.find((o) => o.value === v)?.label ?? v;
  const interestLabel = (v: string) => PARTNERSHIP_INTEREST_OPTIONS.find((o) => o.value === v)?.label ?? v;

  return (
    <div className="mt-8 space-y-8">
      <section className="rounded-xl border border-ori-border bg-ori-surface/80 p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ori-foreground">Add partner</h2>
          <Button type="button" variant="outline" size="sm" onClick={() => setAddPartnerOpen((o) => !o)}>
            {addPartnerOpen ? "Close" : "Add partner"}
          </Button>
        </div>
        {!addPartnerOpen ? (
          <p className="text-xs text-ori-muted">
            Use <span className="font-semibold text-ori-foreground">Add partner</span> to create an account or copy the
            public registration link. Partner defaults and intake stay in the back office.
          </p>
        ) : (
          <>
            <p className="text-xs text-ori-muted">
              Internal defaults (commission, type) stay in the back office. The public /partner/register form collects a
              fuller partner intake. <span className="font-semibold text-ori-foreground">Create partner</span> adds the
              partner in Ori and shows a one-time temporary password for email sign-in at /partner.{" "}
              <span className="font-semibold text-ori-foreground">Partner link</span> copies the registration URL.
            </p>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div>
                <label className="text-xs text-ori-muted">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as PartnerRecord["type"] }))}
                  className="mt-1 w-full rounded-lg border border-ori-border bg-ori-charcoal px-2 py-2"
                >
                  {PARTNER_TYPES.map((pt) => (
                    <option key={pt.value} value={pt.value}>
                      {pt.label}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Organization"
                value={form.organizationName}
                onChange={(e) => setForm((f) => ({ ...f, organizationName: e.target.value }))}
                required
              />
              <Input
                label="Full name"
                value={form.contactName}
                onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              <div>
                <label className="text-xs text-ori-muted">Default commission</label>
                <select
                  value={form.defaultCommissionRate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, defaultCommissionRate: Number(e.target.value) }))
                  }
                  className="mt-1 w-full rounded-lg border border-ori-border bg-ori-charcoal px-2 py-2"
                >
                  {COMMISSION_PCT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button type="button" onClick={() => void submitAdmin()}>
                  Create partner
                </Button>
                <Button type="button" variant="outline" onClick={() => void submitInvite()}>
                  Copy registration link
                </Button>
              </div>
            </form>
          </>
        )}
      </section>
      <section className="rounded-xl border border-ori-border bg-ori-surface/80 p-6 space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-ori-foreground">Partner management</h2>
          <p className="text-xs text-ori-muted mt-1 max-w-2xl">
            Search and select a partner to view profile, intake, referral links, and portal tools. Inline edits update
            without reloading the page.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(240px,280px)_1fr] min-h-[420px]">
          <aside className="rounded-lg border border-ori-border bg-ori-charcoal/40 p-3 flex flex-col gap-2 max-h-[70vh]">
            <Input
              label="Search partners"
              value={partnerSearch}
              onChange={(e) => setPartnerSearch(e.target.value)}
              placeholder="Name, email, link…"
            />
            <ul className="space-y-1 overflow-y-auto flex-1 pr-1 min-h-0">
              {filteredPartners.map((row) => {
                const owed = commissions
                  .filter((c) => c.partnerId === row.id && c.status === "PENDING")
                  .reduce((s, c) => s + c.amount, 0);
                const leadCount = leads.filter((l) => l.partnerId === row.id).length;
                const active = row.id === selectedPartnerId;
                return (
                  <li key={row.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedPartnerId(row.id)}
                      className={`w-full text-left rounded-lg px-3 py-2 transition-colors ${
                        active ? "bg-ori-accent/15 text-ori-foreground ring-1 ring-ori-accent/40" : "hover:bg-ori-charcoal/80 text-ori-muted"
                      }`}
                    >
                      <span className="block text-sm font-medium text-ori-foreground truncate">{row.organizationName}</span>
                      <span className="block text-[11px] text-ori-muted mt-0.5 truncate">
                        {leadCount} leads · ${owed.toLocaleString()} owed
                        {row.referralCode ? "" : " · no referral link"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {filteredPartners.length === 0 ? <p className="text-xs text-ori-muted">No matches.</p> : null}
          </aside>
          <div className="rounded-lg border border-ori-border bg-ori-charcoal/30 p-4 min-h-[320px] overflow-y-auto max-h-[70vh]">
            {!selected ? (
              <p className="text-sm text-ori-muted">Select a partner from the list.</p>
            ) : (
              <div className="space-y-6">
                {(() => {
                  const p = selected;
                  const owed = commissions
                    .filter((c) => c.partnerId === p.id && c.status === "PENDING")
                    .reduce((s, c) => s + c.amount, 0);
                  const leadCount = leads.filter((l) => l.partnerId === p.id).length;
                  const code = p.referralCode || "";
                  const defaultPct = ((p.defaultCommissionRate ?? 0) * 100).toFixed(0);
                  const intake = p.partnerIntake;
                  return (
                    <>
                      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ori-border/60 pb-4">
                        <div>
                          <h3 className="font-display text-lg font-semibold text-ori-foreground">{p.organizationName}</h3>
                          <p className="text-xs text-ori-muted mt-1">{partnerTypeLabel(p.type)}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-end text-xs">
                          <span className={partnerStatusPillClass(p.status || "ACTIVE")}>
                            {p.status || "ACTIVE"}
                          </span>
                          <span className="rounded-full border border-ori-border/80 bg-ori-charcoal/50 px-2 py-0.5 text-ori-muted">
                            {leadCount} leads
                          </span>
                          <span className="rounded-full border border-amber-500/30 bg-amber-500/5 px-2 py-0.5 text-amber-100/90">
                            ${owed.toLocaleString()} pending
                          </span>
                          <span className="rounded-full border border-ori-border px-2 py-0.5 text-ori-accent">
                            Default {defaultPct}%
                          </span>
                        </div>
                      </header>
                      {partnerNotice && partnerNotice.partnerId === p.id ? (
                        <div
                          className={`rounded-lg border px-3 py-2 text-xs ${
                            partnerNotice.variant === "ok"
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                              : "border-red-500/40 bg-red-500/10 text-red-200"
                          }`}
                          role="status"
                        >
                          {partnerNotice.message}
                        </div>
                      ) : null}
                      <div className="grid gap-4 sm:grid-cols-2 text-xs">
                        <div>
                          <p className="text-ori-muted font-medium uppercase tracking-wide">Contact</p>
                          <p className="text-ori-foreground mt-1">{p.contactName || "—"}</p>
                          <p className="text-ori-accent mt-0.5">{p.email || "—"}</p>
                          <p className="text-ori-muted mt-0.5">{p.phone || "—"}</p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-ori-muted font-medium uppercase tracking-wide">Referral link</p>
                            {code ? (
                              <>
                                <p className="mt-1 break-all text-[11px] text-ori-accent leading-snug">{applyRefUrl(code)}</p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => void navigator.clipboard.writeText(applyRefUrl(code))}
                                >
                                  Copy referral link
                                </Button>
                              </>
                            ) : (
                              <p className="mt-1 text-ori-muted">No referral link until this partner has a referral id.</p>
                            )}
                          </div>
                          <div className="rounded-lg border border-ori-border bg-ori-charcoal/50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-ori-muted">Access key</p>
                            {lastPortalKeys[p.id] ? (
                              <>
                                <p className="mt-1 font-mono text-xs break-all text-ori-foreground">{lastPortalKeys[p.id]}</p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => void navigator.clipboard.writeText(lastPortalKeys[p.id]!)}
                                >
                                  Copy access key
                                </Button>
                              </>
                            ) : (
                              <p className="mt-1 text-[11px] text-ori-muted leading-relaxed">
                                Not stored in this browser. Use <span className="text-ori-foreground">Send approval &amp; key</span>{" "}
                                or <span className="text-ori-foreground">Generate access key</span> and copy the value when it is
                                shown once.
                              </p>
                            )}
                            {p.portalEnabled ? (
                              <p className="mt-2 text-[10px] text-ori-muted">Portal access enabled.</p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      {intake ? (
                        <div>
                          <p className="text-xs font-semibold text-ori-foreground">Registration intake</p>
                          <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
                            {intake.roleTitle ? (
                              <div>
                                <dt className="text-ori-muted font-medium uppercase tracking-wide">Role</dt>
                                <dd className="text-ori-foreground mt-0.5">{intake.roleTitle}</dd>
                              </div>
                            ) : null}
                            {intake.clientSegments?.length ? (
                              <div className="sm:col-span-2">
                                <dt className="text-ori-muted font-medium uppercase tracking-wide">Audiences</dt>
                                <dd className="text-ori-foreground mt-0.5">
                                  {intake.clientSegments.map((s) => segmentLabel(s)).join(", ")}
                                </dd>
                              </div>
                            ) : null}
                            {intake.fundingNeedFrequency ? (
                              <div>
                                <dt className="text-ori-muted font-medium uppercase tracking-wide">Funding need</dt>
                                <dd className="text-ori-foreground mt-0.5">{fundingLabel(intake.fundingNeedFrequency)}</dd>
                              </div>
                            ) : null}
                            {intake.partnershipInterest ? (
                              <div>
                                <dt className="text-ori-muted font-medium uppercase tracking-wide">Interest</dt>
                                <dd className="text-ori-foreground mt-0.5">{interestLabel(intake.partnershipInterest)}</dd>
                              </div>
                            ) : null}
                            {intake.additionalNotes ? (
                              <div className="sm:col-span-2">
                                <dt className="text-ori-muted font-medium uppercase tracking-wide">Notes</dt>
                                <dd className="text-ori-foreground mt-0.5 whitespace-pre-wrap">{intake.additionalNotes}</dd>
                              </div>
                            ) : null}
                          </dl>
                        </div>
                      ) : (
                        <p className="text-xs text-ori-muted border border-dashed border-ori-border/60 rounded-lg p-3">
                          No registration intake on file for this partner.
                        </p>
                      )}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="text-xs text-ori-muted">Account status</label>
                          <select
                            value={p.status || "ACTIVE"}
                            onChange={async (e) => {
                              const v = e.target.value;
                              if (v === REMOVE_PARTNER_SELECT) {
                                if (
                                  !window.confirm(
                                    "Permanently remove this partner? Leads will be unlinked; related commission rows are removed."
                                  )
                                ) {
                                  return;
                                }
                                await deletePartner(p.id);
                                mergeBootstrap((b) => removePartnerCascade(b, p.id));
                                setLastPortalKeys((prev) => {
                                  const { [p.id]: _, ...rest } = prev;
                                  return rest;
                                });
                                return;
                              }
                              const r = await updatePartner(p.id, { status: v });
                              mergeBootstrap((b) => mergePartner(b, r.partner));
                            }}
                            className="mt-1 w-full rounded-lg border border-ori-border bg-ori-charcoal px-2 py-1.5 text-sm"
                          >
                            {PARTNER_STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                            <option value={REMOVE_PARTNER_SELECT}>Complete (remove partner)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-ori-muted">Default commission</label>
                          <select
                            value={p.defaultCommissionRate ?? 0}
                            onChange={async (e) => {
                              const r = await updatePartner(p.id, { defaultCommissionRate: Number(e.target.value) });
                              mergeBootstrap((b) => mergePartner(b, r.partner));
                            }}
                            className="mt-1 w-full rounded-lg border border-ori-border bg-ori-charcoal px-2 py-1.5 text-sm"
                          >
                            {COMMISSION_PCT_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 border-t border-ori-border/50 pt-4">
                        {p.status === "INVITED" ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                const r = await sendPartnerInvite(p.id);
                                await copyPartnerRegisterInviteLink(r.inviteUrl);
                                mergeBootstrap((b) => mergePartner(b, r.partner));
                                setPartnerNotice({
                                  partnerId: p.id,
                                  variant: "ok",
                                  message: "Invite link copied to clipboard.",
                                });
                              } catch {
                                setPartnerNotice({
                                  partnerId: p.id,
                                  variant: "err",
                                  message: "Could not refresh partner link.",
                                });
                              }
                            }}
                          >
                            Partner link
                          </Button>
                        ) : null}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              const r = await sendPartnerApprovalInvite(p.id);
                              mergeBootstrap((b) => mergePartner(b, r.partner));
                              setLastPortalKeys((prev) => ({ ...prev, [p.id]: r.accessKey }));
                              setPartnerNotice({
                                partnerId: p.id,
                                variant: "ok",
                                message: `${r.message} Copy the access key from the card below.`,
                              });
                            } catch {
                              setPartnerNotice({
                                partnerId: p.id,
                                variant: "err",
                                message: "Could not queue approval or issue a key.",
                              });
                            }
                          }}
                        >
                          Send approval & key
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              const r = await generatePartnerPortalKey(p.id);
                              setLastPortalKeys((prev) => ({ ...prev, [p.id]: r.accessKey }));
                              mergeBootstrap((b) => mergePartner(b, r.partner));
                              setPartnerNotice({
                                partnerId: p.id,
                                variant: "ok",
                                message: `${r.message} Access key is shown below — copy it now.`,
                              });
                            } catch {
                              setPartnerNotice({
                                partnerId: p.id,
                                variant: "err",
                                message: "Could not generate access key.",
                              });
                            }
                          }}
                        >
                          {p.portalEnabled ? "Regenerate access key" : "Generate access key"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          onClick={async () => {
                            const nextStatus = (p.status || "ACTIVE") === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
                            const confirmText =
                              nextStatus === "SUSPENDED"
                                ? "Suspend this partner account? This will sign them out immediately."
                                : "Unsuspend this partner account and allow sign-in again?";
                            if (!window.confirm(confirmText)) return;
                            try {
                              const r = await updatePartner(p.id, { status: nextStatus });
                              mergeBootstrap((b) => mergePartner(b, r.partner));
                            } catch {
                              window.alert(nextStatus === "SUSPENDED" ? "Could not suspend." : "Could not unsuspend.");
                            }
                          }}
                        >
                          {(p.status || "ACTIVE") === "SUSPENDED" ? "Unsuspend account" : "Suspend account"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          onClick={async () => {
                            if (
                              !window.confirm(
                                "Permanently remove this partner? Leads will be unlinked and related commission rows removed."
                              )
                            ) {
                              return;
                            }
                            await deletePartner(p.id);
                            mergeBootstrap((b) => removePartnerCascade(b, p.id));
                            setLastPortalKeys((prev) => {
                              const { [p.id]: _, ...rest } = prev;
                              return rest;
                            });
                          }}
                        >
                          Delete partner
                        </Button>
                      </div>
                      <div>
                        <label className="text-xs text-ori-muted">Admin notes</label>
                        <textarea
                          key={p.id}
                          defaultValue={p.notes ?? ""}
                          placeholder="Notes"
                          className="mt-1 w-full rounded border border-ori-border bg-ori-charcoal px-2 py-1 text-xs min-h-[48px]"
                          onBlur={async (e) => {
                            const r = await updatePartner(p.id, { notes: e.target.value });
                            mergeBootstrap((b) => mergePartner(b, r.partner));
                          }}
                        />
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ClientsSection({
  leads,
  contactsById,
  partners,
  opportunitiesByLeadId,
  fundingByOppId,
  subscriptions,
  mergeBootstrap,
}: {
  leads: LeadRecord[];
  contactsById: Map<string, ContactRecord>;
  partners: PartnerRecord[];
  opportunitiesByLeadId: Map<string, OpportunityRecord[]>;
  fundingByOppId: Map<string, FundingRecord[]>;
  subscriptions: SubscriptionEnrollmentRecord[];
  mergeBootstrap: (fn: (b: BackOfficeBootstrap) => BackOfficeBootstrap) => void;
}) {
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
  const [leadStatusDrafts, setLeadStatusDrafts] = useState<Record<string, string>>({});
  const [subStatusDrafts, setSubStatusDrafts] = useState<Record<string, string>>({});
  const [requestedDrafts, setRequestedDrafts] = useState<Record<string, string>>({});
  const [fundingTypeDrafts, setFundingTypeDrafts] = useState<Record<string, string>>({});
  const [approvedDrafts, setApprovedDrafts] = useState<Record<string, string>>({});
  const [fundedDrafts, setFundedDrafts] = useState<Record<string, string>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const converted = useMemo(
    () =>
      leads.filter(
        (l) =>
          ["Converted to Apply", "Converted to Pre-Qual"].includes(l.status) ||
          l.status === "Apply" ||
          l.ctaType === "APPLY" ||
          l.ctaType === "PREQUAL" ||
          opportunitiesByLeadId.has(l.id) ||
          subscriptions.some((s) => s.leadId === l.id)
      ),
    [leads, opportunitiesByLeadId, subscriptions]
  );

  const subByLead = new Map(subscriptions.map((s) => [s.leadId, s]));
  return (
    <section className="mt-8 rounded-xl border border-ori-border bg-ori-surface/80 p-6">
      <h2 className="font-display text-lg font-semibold text-ori-foreground">Clients</h2>
      <p className="mt-1 text-sm text-ori-muted">
        Converted leads are tracked here so they stay visible after conversion. Update lead and subscription status from this tab.
      </p>
      <ul className="mt-4 space-y-3 max-h-[58vh] overflow-y-auto pr-1">
        {converted.map((lead) => {
          const c = contactsById.get(lead.contactId);
          const opp = (opportunitiesByLeadId.get(lead.id) || [])[0];
          const funding = opp ? (fundingByOppId.get(opp.id) || [])[0] : undefined;
          const sub = subByLead.get(lead.id);
          const isOpen = expandedClientId === lead.id;
          const payload = lead.intakePayload as Record<string, unknown>;
          const affiliateLabel =
            (lead.partnerId && partners.find((p) => p.id === lead.partnerId)?.organizationName) ||
            (typeof payload.affiliatePartnerName === "string" ? payload.affiliatePartnerName : null) ||
            "—";
          const snap = clientFundingSnapshotForLead(lead.id, opportunitiesByLeadId, fundingByOppId);
          return (
            <li key={lead.id} className="rounded-lg border border-ori-border bg-ori-charcoal/50 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ori-foreground">{c ? `${c.firstName} ${c.lastName}` : "Contact"}</p>
                  <p className="text-xs text-ori-muted">{c?.email || "—"}</p>
                  <p className="text-[11px] text-ori-muted mt-1">
                    Affiliate: <span className="text-ori-foreground">{affiliateLabel}</span>
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <select
                    value={
                      leadStatusDrafts[lead.id] ??
                      ((BACKOFFICE_LEAD_PIPELINE as readonly string[]).includes(lead.status) ? lead.status : "None")
                    }
                    onChange={async (e) => {
                      const next = e.target.value;
                      if (next === BACKOFFICE_LEAD_COMPLETE) {
                        const ok = window.confirm(
                          "Remove this client (lead) and linked opportunity, funding, and subscription records?"
                        );
                        if (!ok) {
                          setLeadStatusDrafts((prev) => {
                            const { [lead.id]: _, ...rest } = prev;
                            return rest;
                          });
                          return;
                        }
                        await deleteLead(lead.id);
                        if (expandedClientId === lead.id) setExpandedClientId(null);
                        mergeBootstrap((b) => removeLeadCascade(b, lead.id));
                        return;
                      }
                      setLeadStatusDrafts((prev) => ({ ...prev, [lead.id]: next }));
                      try {
                        const res = await patchLead(lead.id, { status: next });
                        mergeBootstrap((b) => mergeLeadPatchResponse(b, res));
                        if (res.portalAccessKey) {
                          window.alert(
                            `Partner profile created.\n\nCopy the portal access key now (shown once):\n\n${res.portalAccessKey}`
                          );
                        }
                        setLeadStatusDrafts((prev) => {
                          const { [lead.id]: _, ...rest } = prev;
                          return rest;
                        });
                      } catch {
                        setLeadStatusDrafts((prev) => {
                          const { [lead.id]: _, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    className="rounded border border-ori-border bg-ori-charcoal px-2 py-1 text-xs"
                  >
                    {leadPipelineSelectOptions(lead.status).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {sub ? (
                    <select
                      value={
                        subStatusDrafts[sub.id] ??
                        (sub.subscriptionStatus === "Active Client"
                          ? "Active"
                          : (CLIENT_STATE_OPTIONS as readonly string[]).includes(sub.subscriptionStatus)
                            ? sub.subscriptionStatus
                            : "Active")
                      }
                      onChange={async (e) => {
                        const next = e.target.value;
                        setSubStatusDrafts((prev) => ({ ...prev, [sub.id]: next }));
                        try {
                          const res = await patchSubscription(sub.id, { subscriptionStatus: next });
                          mergeBootstrap((b) => mergeSubscription(b, res.subscription));
                          setSubStatusDrafts((prev) => {
                            const { [sub.id]: _, ...rest } = prev;
                            return rest;
                          });
                        } catch {
                          setSubStatusDrafts((prev) => {
                            const { [sub.id]: _, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                      className="rounded border border-ori-border bg-ori-charcoal px-2 py-1 text-xs"
                    >
                      {CLIENT_STATE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs text-ori-muted">No subscription yet</span>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setExpandedClientId(isOpen ? null : lead.id)}>
                    {isOpen ? "Close" : "Open profile"}
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-xs text-ori-muted">
                Opportunity: {opp ? opp.stage : "none"} · Subscription: {sub ? sub.subscriptionStatus : "none"}
              </p>
              {isOpen ? (
                <div className="mt-3 space-y-3 border-t border-ori-border/50 pt-3">
                  <div>
                    <p className="text-xs font-semibold text-ori-foreground">Funding snapshot</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg border border-ori-border/70 bg-ori-charcoal/40 px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-ori-muted">Requested</p>
                        <p className="mt-0.5 font-display text-base font-semibold text-ori-foreground">
                          ${snap.totalRequested.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg border border-ori-border/70 bg-ori-charcoal/40 px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-ori-muted">Approved</p>
                        <p className="mt-0.5 font-display text-base font-semibold text-ori-foreground">
                          ${snap.totalApproved.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg border border-ori-border/70 bg-ori-charcoal/40 px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-ori-muted">Funded</p>
                        <p className="mt-0.5 font-display text-base font-semibold text-ori-foreground">
                          ${snap.totalFunded.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg border border-ori-border/70 bg-ori-charcoal/40 px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-ori-muted">Remaining</p>
                        <p className="mt-0.5 font-display text-base font-semibold text-ori-foreground">
                          ${snap.remainingGap.toLocaleString()}
                        </p>
                        <p className="mt-0.5 text-[10px] text-ori-muted/80">Requested − funded</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                  {!opp ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        const res = await createOpportunity({ leadId: lead.id, stage: "Application Submitted" });
                        mergeBootstrap((b) => mergeOpportunity(b, res.opportunity));
                      }}
                    >
                      Create funding profile
                    </Button>
                  ) : (
                    <>
                      <label className="text-xs text-ori-muted">
                        Requested amount
                        <input
                          type="number"
                          value={requestedDrafts[lead.id] ?? String(opp.requestedAmount ?? "")}
                          className="mt-1 w-full rounded border border-ori-border bg-ori-charcoal px-2 py-1 text-sm text-ori-foreground"
                          onChange={(e) =>
                            setRequestedDrafts((prev) => ({ ...prev, [lead.id]: e.target.value }))
                          }
                        />
                      </label>
                      <label className="text-xs text-ori-muted">
                        Funding type
                        <select
                          value={fundingTypeDrafts[lead.id] ?? opp.fundingType ?? ""}
                          onChange={(e) =>
                            setFundingTypeDrafts((prev) => ({ ...prev, [lead.id]: e.target.value }))
                          }
                          className="mt-1 w-full rounded border border-ori-border bg-ori-charcoal px-2 py-1 text-sm text-ori-foreground"
                        >
                          <option value="">Select type</option>
                          {FUNDING_TYPE_OPTIONS.map((ft) => (
                            <option key={ft} value={ft}>
                              {ft}
                            </option>
                          ))}
                        </select>
                      </label>
                      {!funding ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            const res = await createFundingRecord({ opportunityId: opp.id, commissionStatus: "PENDING" });
                            mergeBootstrap((b) => mergeFundingRecord(b, res.fundingRecord));
                          }}
                        >
                          Add funding record
                        </Button>
                      ) : null}
                      <label className="text-xs text-ori-muted">
                        Approved amount
                        <input
                          type="number"
                          className="mt-1 w-full rounded border border-ori-border bg-ori-charcoal px-2 py-1 text-sm text-ori-foreground"
                          value={approvedDrafts[lead.id] ?? String(funding?.approvedAmount ?? "")}
                          onChange={(e) =>
                            setApprovedDrafts((prev) => ({ ...prev, [lead.id]: e.target.value }))
                          }
                        />
                      </label>
                      <label className="text-xs text-ori-muted">
                        Funded amount
                        <input
                          type="number"
                          className="mt-1 w-full rounded border border-ori-border bg-ori-charcoal px-2 py-1 text-sm text-ori-foreground"
                          value={fundedDrafts[lead.id] ?? String(funding?.fundedAmount ?? "")}
                          onChange={(e) =>
                            setFundedDrafts((prev) => ({ ...prev, [lead.id]: e.target.value }))
                          }
                        />
                      </label>
                      <div className="sm:col-span-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={async () => {
                            const ft = fundingTypeDrafts[lead.id] ?? opp.fundingType ?? "";
                            const oRes = await patchOpportunity(opp.id, {
                              requestedAmount: Number(requestedDrafts[lead.id] ?? opp.requestedAmount ?? 0) || 0,
                              fundingType: ft,
                            });
                            let fRes: Awaited<ReturnType<typeof patchFundingRecord>> | undefined;
                            if (funding) {
                              const fundedVal = Number(fundedDrafts[lead.id] ?? funding.fundedAmount ?? 0) || 0;
                              fRes = await patchFundingRecord(funding.id, {
                                approvedAmount: Number(approvedDrafts[lead.id] ?? funding.approvedAmount ?? 0) || 0,
                                fundedAmount: fundedVal,
                                commissionAmount: 0,
                                fundingProductType: ft || undefined,
                              });
                            }
                            mergeBootstrap((b) => {
                              let next = mergeOpportunity(b, oRes.opportunity);
                              if (funding && fRes) next = mergeFundingRecord(next, fRes.fundingRecord);
                              return next;
                            });
                          }}
                        >
                          Confirm funding update
                        </Button>
                      </div>
                    </>
                  )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs text-ori-muted">Client note</label>
                    <textarea
                      value={noteDrafts[lead.id] ?? ""}
                      onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                      className="w-full rounded border border-ori-border bg-ori-charcoal px-2 py-1 text-xs min-h-[64px]"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const note = (noteDrafts[lead.id] || "").trim();
                          if (!note) return;
                          const res = await patchLead(lead.id, { appendClientNote: note });
                          setNoteDrafts((prev) => ({ ...prev, [lead.id]: "" }));
                          mergeBootstrap((b) => mergeLeadPatchResponse(b, res));
                        }}
                      >
                        Add note
                      </Button>
                    </div>
                  </div>
                  <div className="sm:col-span-2 rounded border border-ori-border/50 bg-ori-charcoal/30 p-3">
                    <p className="text-xs font-semibold text-ori-foreground">Funding history</p>
                    <div className="mt-2 overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-ori-border/60 text-ori-muted text-left">
                            <th className="py-1.5 pr-3 font-medium">Recorded</th>
                            <th className="py-1.5 pr-3 font-medium">Type</th>
                            <th className="py-1.5 pr-3 font-medium">Requested</th>
                            <th className="py-1.5 pr-3 font-medium">Approved</th>
                            <th className="py-1.5 pr-3 font-medium">Funded</th>
                          </tr>
                        </thead>
                        <tbody className="text-ori-foreground">
                          {(opp ? fundingByOppId.get(opp.id) || [] : []).map((fr) => (
                            <tr key={fr.id} className="border-b border-ori-border/30 last:border-0">
                              <td className="py-2 pr-3 align-top whitespace-nowrap">
                                {new Date(fr.createdAt).toLocaleString()}
                              </td>
                              <td className="py-2 pr-3 align-top text-ori-muted">
                                {fr.fundingProductType || opp?.fundingType || "—"}
                              </td>
                              <td className="py-2 pr-3 align-top">${Number(opp?.requestedAmount ?? 0).toLocaleString()}</td>
                              <td className="py-2 pr-3 align-top">${Number(fr.approvedAmount ?? 0).toLocaleString()}</td>
                              <td className="py-2 pr-3 align-top">${Number(fr.fundedAmount ?? 0).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {!(opp ? fundingByOppId.get(opp.id) || [] : []).length ? (
                        <p className="text-xs text-ori-muted mt-2">No funding rounds yet.</p>
                      ) : null}
                    </div>
                    <p className="mt-4 text-xs font-semibold text-ori-foreground">Notes history</p>
                    <ul className="mt-2 space-y-3 text-xs">
                      {(
                        ((lead.intakePayload as Record<string, unknown>).clientNoteHistory as Array<{
                          text: string;
                          createdAt: string;
                        }>) || []
                      ).map((n, idx) => (
                        <li
                          key={`${n.createdAt}-${idx}`}
                          className="rounded border border-ori-border/40 bg-ori-charcoal/20 p-2"
                        >
                          <p className="text-ori-muted font-medium">{new Date(n.createdAt).toLocaleString()}</p>
                          <p className="text-ori-foreground mt-1 whitespace-pre-wrap">{n.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
        {converted.length === 0 ? <li className="text-sm text-ori-muted">No converted leads yet.</li> : null}
      </ul>
    </section>
  );
}

function MetricsSection({
  config,
  mergeBootstrap,
}: {
  config: SiteMetricConfig;
  mergeBootstrap: (fn: (b: BackOfficeBootstrap) => BackOfficeBootstrap) => void;
}) {
  const [form, setForm] = useState<SiteMetricConfig>(config);

  useEffect(() => {
    setForm(config);
  }, [config]);

  const save = async () => {
    const r = await updateSiteMetrics(form);
    mergeBootstrap((b) => mergeSiteMetricConfig(b, r.siteMetricConfig));
  };

  return (
    <section className="mt-8 rounded-xl border border-ori-border bg-ori-surface/80 p-6 space-y-4">
      <h2 className="font-display text-lg font-semibold text-ori-foreground">Homepage metrics</h2>
      <p className="text-sm text-ori-muted">
        Manual values feed the public site when mode is MANUAL or HYBRID. AUTO uses funded deal totals plus approved
        testimonial dollars for the hero number.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="text-xs text-ori-muted">Config mode</label>
          <select
            value={form.configMode}
            onChange={(e) =>
              setForm((f) => ({ ...f, configMode: e.target.value as SiteMetricConfig["configMode"] }))
            }
            className="mt-1 w-full rounded-lg border border-ori-border bg-ori-charcoal px-2 py-2"
          >
            <option value="MANUAL">Manual</option>
            <option value="HYBRID">Hybrid (manual + testimonials)</option>
            <option value="AUTO">Auto (funded records + testimonials)</option>
          </select>
        </div>
        <Input
          label="Total funding display (number)"
          type="text"
          value={String(form.totalFundingDisplayValue)}
          onChange={(e) =>
            setForm((f) => ({ ...f, totalFundingDisplayValue: Number(e.target.value) || 0 }))
          }
        />
        <div>
          <label className="text-xs text-ori-muted">Unit</label>
          <select
            value={form.totalFundingUnit}
            onChange={(e) =>
              setForm((f) => ({ ...f, totalFundingUnit: e.target.value as "M" | "K" }))
            }
            className="mt-1 w-full rounded-lg border border-ori-border bg-ori-charcoal px-2 py-2"
          >
            <option value="M">Millions (M)</option>
            <option value="K">Thousands (K)</option>
          </select>
        </div>
        <Input
          label="Deals sourced"
          type="text"
          value={String(form.dealsSourcedValue)}
          onChange={(e) =>
            setForm((f) => ({ ...f, dealsSourcedValue: Number(e.target.value) || 0 }))
          }
        />
        <Input
          label="Deals suffix"
          value={form.dealsSourcedSuffix}
          onChange={(e) => setForm((f) => ({ ...f, dealsSourcedSuffix: e.target.value }))}
        />
        <Input
          label="Equity taken"
          type="text"
          value={String(form.equityTakenValue)}
          onChange={(e) =>
            setForm((f) => ({ ...f, equityTakenValue: Number(e.target.value) || 0 }))
          }
        />
        <Input
          label="Businesses funded"
          type="text"
          value={String(form.businessesFundedValue)}
          onChange={(e) =>
            setForm((f) => ({ ...f, businessesFundedValue: Number(e.target.value) || 0 }))
          }
        />
        <Input
          label="Businesses suffix"
          value={form.businessesFundedSuffix}
          onChange={(e) => setForm((f) => ({ ...f, businessesFundedSuffix: e.target.value }))}
        />
        <Input
          label="Founders supported"
          type="text"
          value={String(form.foundersSupportedValue)}
          onChange={(e) =>
            setForm((f) => ({ ...f, foundersSupportedValue: Number(e.target.value) || 0 }))
          }
        />
        <Input
          label="Founders suffix"
          value={form.foundersSupportedSuffix}
          onChange={(e) => setForm((f) => ({ ...f, foundersSupportedSuffix: e.target.value }))}
        />
      </div>
      <Button type="button" onClick={save}>
        Save metrics
      </Button>
    </section>
  );
}

function TestimonialsBackOffice({
  testimonials,
  mergeBootstrap,
  resyncBootstrap,
}: {
  testimonials: TestimonialRecord[];
  mergeBootstrap: (fn: (b: BackOfficeBootstrap) => BackOfficeBootstrap) => void;
  resyncBootstrap: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: "",
    quote: "",
    company: "",
    location: "",
    fundingAmount: "",
  });
  const [requestOpen, setRequestOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requestForm, setRequestForm] = useState({
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
  });

  const testimonialPublicUrl =
    typeof window !== "undefined" ? `${window.location.origin}${ROUTES.TESTIMONIAL}` : ROUTES.TESTIMONIAL;

  return (
    <div className="mt-8 space-y-8">
      <section className="rounded-xl border border-ori-border bg-ori-surface/80 p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-ori-foreground">Collect testimonials</h2>
        <p className="text-sm text-ori-muted">
          Send a testimonial request directly from back office with recipient details, or copy the public form link.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setRequestOpen(true)}>
            Request testimonial
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(testimonialPublicUrl);
              window.alert("Public testimonial form link copied.");
            }}
          >
            Copy sharable link
          </Button>
        </div>
        {requestOpen ? (
          <div className="rounded-lg border border-ori-border bg-ori-charcoal/40 p-4 space-y-3">
            <p className="text-sm text-ori-foreground">Who should receive this request?</p>
            <Input
              label="Name"
              value={requestForm.recipientName}
              onChange={(e) => setRequestForm((f) => ({ ...f, recipientName: e.target.value }))}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Email"
                type="email"
                value={requestForm.recipientEmail}
                onChange={(e) => setRequestForm((f) => ({ ...f, recipientEmail: e.target.value }))}
              />
              <Input
                label="Phone"
                value={requestForm.recipientPhone}
                onChange={(e) => setRequestForm((f) => ({ ...f, recipientPhone: e.target.value }))}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                disabled={requesting}
                onClick={async () => {
                  setRequesting(true);
                  try {
                    const result = await sendTestimonialRequest({
                      recipientName: requestForm.recipientName.trim(),
                      recipientEmail: requestForm.recipientEmail.trim() || undefined,
                      recipientPhone: requestForm.recipientPhone.trim() || undefined,
                    });
                    window.alert(
                      result.twilioConfigured
                        ? "Request sent/logged successfully."
                        : "Request logged. Add Twilio env vars to send SMS automatically."
                    );
                    setRequestForm({ recipientName: "", recipientEmail: "", recipientPhone: "" });
                    setRequestOpen(false);
                    await resyncBootstrap();
                  } catch {
                    window.alert("Could not send testimonial request.");
                  } finally {
                    setRequesting(false);
                  }
                }}
              >
                Send request
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setRequestOpen(false);
                  setRequestForm({ recipientName: "", recipientEmail: "", recipientPhone: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </section>
      <section className="rounded-xl border border-ori-border bg-ori-surface/80 p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-ori-foreground">Add testimonial (admin)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Input
            label="Funding amount (number)"
            value={form.fundingAmount}
            onChange={(e) => setForm((f) => ({ ...f, fundingAmount: e.target.value }))}
          />
        </div>
        <Input label="Company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
        <Input
          label="Location"
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
        />
        <div>
          <label className="text-sm text-ori-muted">Quote</label>
          <textarea
            value={form.quote}
            onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
            rows={3}
            className="mt-1 w-full rounded-lg border border-ori-border bg-ori-charcoal px-3 py-2 text-sm"
          />
        </div>
        <Button
          type="button"
          onClick={async () => {
            const res = await createTestimonialAdmin({
              name: form.name,
              quote: form.quote,
              company: form.company,
              location: form.location,
              fundingAmount: form.fundingAmount ? Number(form.fundingAmount) : 0,
              isApproved: true,
            });
            setForm({ name: "", quote: "", company: "", location: "", fundingAmount: "" });
            mergeBootstrap((b) => mergeTestimonial(b, res.testimonial));
          }}
        >
          Save & approve
        </Button>
      </section>
      <section className="rounded-xl border border-ori-border bg-ori-surface/80 p-6">
        <h2 className="font-display text-lg font-semibold text-ori-foreground">Queue</h2>
        <ul className="mt-4 space-y-3 max-h-[58vh] overflow-y-auto pr-1">
          {testimonials.map((t) => (
            <li key={t.id} className="rounded-lg border border-ori-border bg-ori-charcoal/50 p-3 text-sm">
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-medium text-ori-foreground">{t.name}</p>
                  <p className="text-ori-muted mt-1">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-xs text-ori-muted mt-1">
                    {t.isApproved ? "Approved" : "Pending"} · ${t.fundingAmount?.toLocaleString() ?? "—"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  {!t.isApproved ? (
                    <button
                      type="button"
                      className="text-xs text-ori-accent"
                      onClick={async () => {
                        const res = await approveTestimonial(t.id);
                        mergeBootstrap((b) => mergeTestimonial(b, res.testimonial));
                      }}
                    >
                      Approve
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="text-xs text-ori-muted"
                    onClick={async () => {
                      const res = await patchTestimonial(t.id, { isApproved: false });
                      mergeBootstrap((b) => mergeTestimonial(b, res.testimonial));
                    }}
                  >
                    Unpublish
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

