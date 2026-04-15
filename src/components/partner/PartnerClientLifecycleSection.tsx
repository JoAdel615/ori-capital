import type { ReactNode } from "react";
import type { PartnerBootstrap, PartnerServiceCode } from "../../lib/partner/api";
import { ORI_EVENTS, trackOriEvent } from "../../lib/analytics/oriEvents";

export type PartnerClientRow = PartnerBootstrap["clients"][number];

const MANAGEMENT_TOOL_OPTIONS: Array<{ code: PartnerServiceCode; label: string }> = [
  { code: "FORMATION", label: "Formation" },
  { code: "VAULT", label: "Vault" },
  { code: "BUILDER", label: "Builder" },
  { code: "HOSTING", label: "Hosting" },
  { code: "GROWTH", label: "Growth" },
];

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function serviceLabelFromCode(code: PartnerServiceCode): string {
  return MANAGEMENT_TOOL_OPTIONS.find((s) => s.code === code)?.label || code;
}

function fundingSnapshotLabel(client: PartnerClientRow) {
  if (client.fundingStatus === "Approved" || client.fundingStatus === "Funded") {
    return `${client.fundingStatus} · ${formatMoney(client.fundingAmount)}`;
  }
  return client.fundingStatus;
}

function stageChipClass(stage: PartnerClientRow["currentStage"]) {
  if (stage === "Funding") return "border-blue-500/40 bg-blue-500/10 text-blue-200";
  if (stage === "Management") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
  return "border-amber-500/40 bg-amber-500/10 text-amber-200";
}

function humanizeEnum(s: string) {
  return s
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (m) => m.toUpperCase());
}

function toolStatusClass(status: "ACTIVE" | "PENDING" | "NOT_ACTIVE") {
  if (status === "ACTIVE") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
  if (status === "PENDING") return "border-amber-500/40 bg-amber-500/10 text-amber-100";
  return "border-ori-border bg-ori-charcoal/70 text-ori-muted";
}

function LifecycleColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-ori-border/60 bg-ori-black/20 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ori-muted">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function CollaborationServicesBlock({ client }: { client: PartnerClientRow }) {
  const rows: Array<{ label: string; line: string }> = [];
  const coaching = client.collaborationServices.find((s) => s.type === "STARTUP_COACHING");
  const coachingStatus = (coaching?.status || "NOT_ACTIVE").replace(/_/g, " ").toLowerCase();
  const coachingBits = [
    coaching?.playbookName ? `Playbook: ${coaching.playbookName}` : null,
    coaching?.deliveryMode ? coaching.deliveryMode : null,
    coaching?.sessionStatus || client.workshopStatus,
  ]
    .filter(Boolean)
    .join(" · ");
  rows.push({
    label: "Startup coaching",
    line: `${humanizeEnum(coachingStatus)}${coachingBits ? ` · ${coachingBits}` : ""}`,
  });

  const pd = client.collaborationServices.find((s) => s.type === "PRODUCT_DEVELOPMENT");
  const pdText =
    pd?.projectStatus ||
    (pd?.status ? humanizeEnum(pd.status.replace(/_/g, " ")) : null) ||
    "Not active";
  rows.push({ label: "Product development", line: pdText });

  const adv = client.collaborationServices.find((s) => s.type === "MANAGEMENT_ADVISORY");
  rows.push({
    label: "Management advisory",
    line: humanizeEnum((adv?.status || "NOT_ACTIVE").replace(/_/g, " ")),
  });

  return (
    <ul className="space-y-2 text-xs text-ori-muted">
      {rows.map((r) => (
        <li key={r.label}>
          <span className="font-medium text-ori-foreground">{r.label}</span>
          <span className="mt-0.5 block leading-snug">{r.line}</span>
        </li>
      ))}
    </ul>
  );
}

function ManagementToolsBlock({ client }: { client: PartnerClientRow }) {
  return (
    <ul className="space-y-1.5 text-xs">
      {MANAGEMENT_TOOL_OPTIONS.map(({ code, label }) => {
        const row = client.managementTools.find((t) => t.code === code);
        const status = row?.status || "NOT_ACTIVE";
        return (
          <li key={code} className="flex items-center justify-between gap-2">
            <span className="text-ori-foreground">{label}</span>
            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${toolStatusClass(status)}`}>
              {status === "NOT_ACTIVE" ? "Off" : status}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function ProgramsBlock({ client }: { client: PartnerClientRow }) {
  const fr = client.fundingReadiness;
  return (
    <dl className="space-y-1.5 text-xs text-ori-muted">
      <div>
        <dt className="text-[10px] font-semibold uppercase tracking-wide text-ori-muted/90">Enrollment</dt>
        <dd className="text-ori-foreground">{humanizeEnum(fr.enrollmentType.replace(/_/g, " "))}</dd>
      </div>
      <div>
        <dt className="text-[10px] font-semibold uppercase tracking-wide text-ori-muted/90">Program status</dt>
        <dd className="text-ori-foreground">{fr.programStatus}</dd>
      </div>
      <div>
        <dt className="text-[10px] font-semibold uppercase tracking-wide text-ori-muted/90">Readiness stage</dt>
        <dd className="text-ori-foreground">{fr.readinessStage}</dd>
      </div>
      {fr.readyForFundingReview ? (
        <p className="text-[11px] font-medium text-ori-accent">Ready for funding review</p>
      ) : null}
    </dl>
  );
}

function FundingBlock({ client }: { client: PartnerClientRow }) {
  return (
    <dl className="space-y-1.5 text-xs text-ori-muted">
      <div>
        <dt className="text-[10px] font-semibold uppercase tracking-wide text-ori-muted/90">Pipeline</dt>
        <dd className="text-ori-foreground">{client.funding.status}</dd>
      </div>
      <div>
        <dt className="text-[10px] font-semibold uppercase tracking-wide text-ori-muted/90">Outcome</dt>
        <dd className="text-ori-foreground">{fundingSnapshotLabel(client)}</dd>
      </div>
      {client.fundingAmount > 0 ? (
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-ori-muted/90">Recorded amount</dt>
          <dd className="font-medium text-ori-foreground">{formatMoney(client.fundingAmount)}</dd>
        </div>
      ) : null}
    </dl>
  );
}

export type PartnerClientLifecycleSectionProps = {
  cohortOptions: string[];
  clientCohortFilter: string;
  onCohortFilterChange: (value: string) => void;
  clientStageFilter: "ALL" | "Collaboration" | "Management" | "Funding";
  onStageFilterChange: (value: "ALL" | "Collaboration" | "Management" | "Funding") => void;
  clientsByCohort: Array<[string, PartnerClientRow[]]>;
  hasAnyClients: boolean;
  filteredClientsEmpty: boolean;
  expandedClientId: string | null;
  onToggleClient: (clientId: string, nextOpen: boolean) => void;
};

export function PartnerClientLifecycleSection({
  cohortOptions,
  clientCohortFilter,
  onCohortFilterChange,
  clientStageFilter,
  onStageFilterChange,
  clientsByCohort,
  hasAnyClients,
  filteredClientsEmpty,
  expandedClientId,
  onToggleClient,
}: PartnerClientLifecycleSectionProps) {
  return (
    <section className="mt-8 rounded-xl border border-ori-border bg-ori-surface p-6">
      <h2 className="font-display text-lg font-semibold text-ori-foreground">Client lifecycle</h2>
      <p className="mt-1 max-w-3xl text-sm text-ori-muted">
        Monitor collaboration services in flight, management tools, funding readiness programs, and funding outcomes for each client Ori has linked to your workspace.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <label className="text-sm text-ori-muted">
          Cohort
          <select
            value={clientCohortFilter}
            onChange={(e) => onCohortFilterChange(e.target.value)}
            className="ml-2 rounded-lg border border-ori-border bg-ori-charcoal px-2 py-1 text-sm text-ori-foreground"
          >
            <option value="ALL">All cohorts</option>
            {cohortOptions.map((cohort) => (
              <option key={cohort} value={cohort}>
                {cohort}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-ori-muted">
          Stage
          <select
            value={clientStageFilter}
            onChange={(e) => onStageFilterChange(e.target.value as "ALL" | "Collaboration" | "Management" | "Funding")}
            className="ml-2 rounded-lg border border-ori-border bg-ori-charcoal px-2 py-1 text-sm text-ori-foreground"
          >
            <option value="ALL">All stages</option>
            <option value="Collaboration">Collaboration</option>
            <option value="Management">Management</option>
            <option value="Funding">Funding</option>
          </select>
        </label>
      </div>

      {!hasAnyClients ? (
        <p className="mt-4 text-sm text-ori-muted">
          No clients in your workspace yet. When Ori onboards clients for your organization, their services, tools, programs, and funding will show up here for monitoring.
        </p>
      ) : filteredClientsEmpty ? (
        <p className="mt-4 text-sm text-ori-muted">No clients match your filters.</p>
      ) : (
        <div className="mt-6 space-y-8 text-sm">
          {clientsByCohort.map(([cohortName, cohortClients]) => (
            <div key={cohortName}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ori-foreground">{cohortName}</h3>
                <span className="text-xs text-ori-muted">
                  {cohortClients.length} client{cohortClients.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="space-y-4">
                {cohortClients.map((client) => {
                  const isOpen = expandedClientId === client.id;
                  return (
                    <li key={client.id} className="rounded-xl border border-ori-border/70 bg-ori-charcoal/35">
                      <button
                        type="button"
                        className="w-full p-4 text-left transition-colors hover:bg-ori-charcoal/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent"
                        onClick={() => {
                          const next = !isOpen;
                          onToggleClient(client.id, next);
                          if (next) trackOriEvent(ORI_EVENTS.PARTNER_CLIENT_OPENED, { client_id: client.id });
                        }}
                        aria-expanded={isOpen}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-ori-foreground">{client.contactName}</p>
                            <p className="text-xs text-ori-muted">{client.companyName}</p>
                            <p className="mt-1 text-[11px] text-ori-muted">{client.contactEmailMasked}</p>
                          </div>
                          <span className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${stageChipClass(client.currentStage)}`}>
                            {client.currentStage}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          <LifecycleColumn title="Collaboration services">
                            <CollaborationServicesBlock client={client} />
                          </LifecycleColumn>
                          <LifecycleColumn title="Management tools">
                            <ManagementToolsBlock client={client} />
                          </LifecycleColumn>
                          <LifecycleColumn title="Programs">
                            <ProgramsBlock client={client} />
                          </LifecycleColumn>
                          <LifecycleColumn title="Funding">
                            <FundingBlock client={client} />
                          </LifecycleColumn>
                        </div>

                        <p className="mt-3 text-[11px] text-ori-muted">{isOpen ? "Hide detail" : "Show detail"} · Next: {client.nextAction}</p>
                      </button>

                      {isOpen ? (
                        <div className="border-t border-ori-border/60 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-ori-muted">Detail</p>
                          <div className="mt-3 grid gap-4 lg:grid-cols-3">
                            <div className="rounded-lg border border-ori-border bg-ori-black/20 p-3">
                              <h4 className="font-display text-base font-semibold text-ori-foreground">Collaboration</h4>
                              <ul className="mt-2 space-y-2 text-xs text-ori-muted">
                                <li className="flex items-center justify-between gap-2">
                                  <span className="text-ori-foreground">Startup Coaching</span>
                                  <span className="text-ori-muted">
                                    {(client.collaborationServices.find((s) => s.type === "STARTUP_COACHING")?.status || "NOT_ACTIVE")
                                      .replace("_", " ")
                                      .toLowerCase()
                                      .replace(/^\w/, (m) => m.toUpperCase())}
                                  </span>
                                </li>
                                <li className="text-[11px] text-ori-muted">
                                  Playbook: {client.collaborationServices.find((s) => s.type === "STARTUP_COACHING")?.playbookName || "Not assigned"} ·
                                  Delivery: {client.collaborationServices.find((s) => s.type === "STARTUP_COACHING")?.deliveryMode || "—"} ·
                                  Session:{" "}
                                  {client.collaborationServices.find((s) => s.type === "STARTUP_COACHING")?.sessionStatus || client.workshopStatus}
                                </li>
                                <li className="flex items-center justify-between gap-2">
                                  <span className="text-ori-foreground">Product Development</span>
                                  <span className="text-ori-muted">
                                    {client.collaborationServices.find((s) => s.type === "PRODUCT_DEVELOPMENT")?.projectStatus ||
                                      client.collaborationServices
                                        .find((s) => s.type === "PRODUCT_DEVELOPMENT")
                                        ?.status?.replace("_", " ")
                                        .toLowerCase()
                                        .replace(/^\w/, (m) => m.toUpperCase()) ||
                                      "Not active"}
                                  </span>
                                </li>
                                <li className="flex items-center justify-between gap-2">
                                  <span className="text-ori-foreground">Management Advisory</span>
                                  <span className="text-ori-muted">
                                    {(client.collaborationServices.find((s) => s.type === "MANAGEMENT_ADVISORY")?.status || "NOT_ACTIVE")
                                      .replace("_", " ")
                                      .toLowerCase()
                                      .replace(/^\w/, (m) => m.toUpperCase())}
                                  </span>
                                </li>
                              </ul>
                            </div>
                            <div className="rounded-lg border border-ori-border bg-ori-black/20 p-3">
                              <h4 className="font-display text-base font-semibold text-ori-foreground">Management</h4>
                              <ul className="mt-2 space-y-2 text-xs text-ori-muted">
                                {["Formation", "Vault", "Builder", "Hosting", "Growth"].map((service) => {
                                  const isActive = client.managementTools.some(
                                    (s) => serviceLabelFromCode(s.code) === service && s.status !== "NOT_ACTIVE"
                                  );
                                  return (
                                    <li key={service} className="flex items-center justify-between gap-2">
                                      <span className="text-ori-foreground">{service}</span>
                                      <span
                                        className={`rounded-full border px-2 py-0.5 ${
                                          isActive ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" : "border-ori-border bg-ori-charcoal/70 text-ori-muted"
                                        }`}
                                      >
                                        {isActive ? "Active" : "Not active"}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                            <div className="rounded-lg border border-ori-border bg-ori-black/20 p-3">
                              <h4 className="font-display text-base font-semibold text-ori-foreground">Funding Readiness &amp; Funding</h4>
                              <dl className="mt-2 space-y-2 text-xs">
                                <div>
                                  <dt className="text-ori-muted">Funding Readiness enrollment</dt>
                                  <dd className="text-ori-foreground">
                                    {client.fundingReadiness.enrollmentType.replace("_", " ").toLowerCase().replace(/^\w/, (m) => m.toUpperCase())}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-ori-muted">Program status</dt>
                                  <dd className="text-ori-foreground">{client.fundingReadiness.programStatus}</dd>
                                </div>
                                <div>
                                  <dt className="text-ori-muted">Readiness stage</dt>
                                  <dd className="text-ori-foreground">{client.fundingReadiness.readinessStage}</dd>
                                </div>
                                <div>
                                  <dt className="text-ori-muted">Funding pipeline</dt>
                                  <dd className="text-ori-foreground">{client.funding.status}</dd>
                                </div>
                                <div>
                                  <dt className="text-ori-muted">Outcome</dt>
                                  <dd className="text-ori-foreground">{fundingSnapshotLabel(client)}</dd>
                                </div>
                              </dl>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
