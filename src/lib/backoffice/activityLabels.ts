import type { ActivityLogRecord } from "./types";

const ACTION_LABELS: Record<string, string> = {
  LEAD_CREATED: "New lead",
  PARTNER_REGISTRATION_SUBMITTED: "Partner registration received",
  LEAD_UPDATED: "Lead updated",
  PARTNER_CREATED: "Partner created",
  PARTNER_SELF_REGISTERED: "Partner self-registered",
  PARTNER_UPDATED: "Partner updated",
  PARTNER_INVITE_COMPLETED: "Partner finished registration",
  PARTNER_INVITE_SENT: "Partner invite sent",
  PARTNER_PORTAL_KEY_ISSUED: "Portal access key issued",
  PARTNER_APPROVAL_INVITE_QUEUED: "Partner approval invite queued",
  PARTNER_PORTAL_REVOKED: "Portal access revoked",
  PARTNER_REMOVED: "Partner removed",
  COMMISSION_LINE_ADDED: "Commission line added",
  COMMISSION_UPDATED: "Commission updated",
  OPPORTUNITY_UPDATED: "Opportunity updated",
  FUNDING_RECORD_CREATED: "Funding record added",
  FUNDING_RECORD_UPDATED: "Funding record updated",
  PROMO_UPDATED: "Promo code updated",
  PROMO_REVOKED: "Promo code revoked",
  TESTIMONIAL_SUBMITTED: "Testimonial submitted",
  TESTIMONIAL_APPROVED: "Testimonial approved",
  TESTIMONIAL_EDITED: "Testimonial edited",
};

const ENTITY_LABELS: Record<string, string> = {
  LEAD: "Lead",
  PARTNER: "Partner",
  OPPORTUNITY: "Opportunity",
  FUNDING: "Funding",
  COMMISSION: "Commission",
  PROMO: "Promo",
  TESTIMONIAL: "Testimonial",
};

function actionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action.replace(/_/g, " ").toLowerCase();
}

function entityLabel(entityType: string): string {
  return ENTITY_LABELS[entityType] ?? entityType;
}

function metadataHint(a: ActivityLogRecord): string {
  const m = a.metadata;
  if (!m || typeof m !== "object") return "";
  if (a.action === "LEAD_UPDATED" && typeof m.status === "string") return ` → ${m.status}`;
  if (a.action === "OPPORTUNITY_UPDATED" && typeof m.stage === "string") return ` → ${m.stage}`;
  if (a.action === "COMMISSION_UPDATED") {
    const parts: string[] = [];
    if (typeof m.status === "string") parts.push(m.status);
    if (typeof m.amount === "number") parts.push(`$${m.amount}`);
    if (parts.length) return ` → ${parts.join(" · ")}`;
  }
  return "";
}

/** Single readable line for admin dashboard activity feed. */
export function formatActivityLine(a: ActivityLogRecord): string {
  const when = new Date(a.createdAt).toLocaleString();
  return `${actionLabel(a.action)} — ${entityLabel(a.entityType)}${metadataHint(a)} · ${when}`;
}
