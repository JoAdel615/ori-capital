import fs from "node:fs";
import path from "node:path";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import type {
  BackOfficeState,
  CommissionRecord,
  ContactRecord,
  FundingRecord,
  LeadRecord,
  OpportunityRecord,
  PartnerRecord,
  SiteMetricConfig,
  SubscriptionEnrollmentRecord,
  TestimonialRecord,
} from "../src/lib/backoffice/types";
import { PARTNER_TYPE_VALUES } from "../src/lib/backoffice/partnerFormOptions";
import {
  parsePartnerIntakePayload,
  validatePartnerIntakeRequired,
} from "../src/lib/partner/partnerRegistrationIntake";
import {
  logIntegration,
  normalizePhoneToE164,
  twilioEnabled,
  twilioSendSms,
  twilioSmsReady,
} from "./integrations/index.js";
import {
  afterCapitalPartnerInterest,
  afterContactIntake,
  afterNewsletterSignup,
  afterPrequalifyOrApply,
} from "./integrations/leadHooks.js";
import { getBackofficeAdminAuth, warnIfBackofficeLoginBlocked } from "./backofficeSecurity.js";
import { FailureRateLimiter } from "./loginRateLimit.js";

const PARTNER_TYPE_SET = new Set<string>(PARTNER_TYPE_VALUES);

function normalizePartnerType(raw: unknown): PartnerRecord["type"] {
  const s = String(raw || "").trim();
  return PARTNER_TYPE_SET.has(s) ? (s as PartnerRecord["type"]) : "OTHER";
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "backoffice.json");
const ADMIN_TOKEN_HEADER = "authorization";

/** Failed admin password attempts per IP (sliding window). */
const adminLoginFailLimiter = new FailureRateLimiter(20, 15 * 60 * 1000);
/** Failed partner sign-in attempts per IP (sliding window). */
const partnerLoginFailLimiter = new FailureRateLimiter(40, 15 * 60 * 1000);

const DEFAULT_SITE_METRIC_CONFIG: SiteMetricConfig = {
  totalFundingDisplayValue: 2.4,
  totalFundingUnit: "M",
  dealsSourcedValue: 50,
  dealsSourcedSuffix: "+",
  businessesFundedValue: 50,
  businessesFundedSuffix: "+",
  foundersSupportedValue: 100,
  foundersSupportedSuffix: "+",
  equityTakenValue: 0,
  configMode: "HYBRID",
};

const initialState: BackOfficeState = {
  contacts: [],
  businesses: [],
  leads: [],
  opportunities: [],
  fundingRecords: [],
  subscriptions: [],
  consultations: [],
  partners: [],
  commissions: [],
  testimonials: [],
  promoCodes: [],
  activities: [],
  siteMetricConfig: DEFAULT_SITE_METRIC_CONFIG,
  adminTokens: [],
  partnerSessions: [],
};

function ensureDb(): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialState, null, 2));
  }
}

/** Shared with payment middleware so checkout and intake use one persistence path. */
export function readState(): BackOfficeState {
  ensureDb();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<BackOfficeState>;
    return {
      ...initialState,
      ...parsed,
      partnerSessions: Array.isArray(parsed.partnerSessions) ? parsed.partnerSessions : [],
      siteMetricConfig: {
        ...DEFAULT_SITE_METRIC_CONFIG,
        ...(parsed.siteMetricConfig || {}),
      },
    };
  } catch {
    return initialState;
  }
}

export function writeState(next: BackOfficeState): void {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(next, null, 2));
}

function nowIso(): string {
  return new Date().toISOString();
}

function id(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function parseBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks).toString("utf8");
        resolve((JSON.parse(body || "{}") as Record<string, unknown>) || {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: unknown): void {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

/** Public partner registration anti-spam: sliding window per client IP. */
const PARTNER_REGISTER_MAX_PER_WINDOW = 5;
const PARTNER_REGISTER_WINDOW_MS = 15 * 60 * 1000;
const partnerRegisterHitsByIp = new Map<string, number[]>();

function trustXForwardedFor(): boolean {
  const v = process.env.TRUST_X_FORWARDED_FOR;
  return v === "1" || v === "true";
}

function getClientIp(req: IncomingMessage): string {
  if (trustXForwardedFor()) {
    const xf = req.headers["x-forwarded-for"];
    const first = Array.isArray(xf) ? xf[0] : String(xf || "").split(",")[0]?.trim();
    if (first) return first;
  }
  return req.socket?.remoteAddress || "unknown";
}

function partnerRegisterRateLimitOk(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - PARTNER_REGISTER_WINDOW_MS;
  let hits = partnerRegisterHitsByIp.get(ip) || [];
  hits = hits.filter((t) => t > cutoff);
  if (hits.length >= PARTNER_REGISTER_MAX_PER_WINDOW) {
    partnerRegisterHitsByIp.set(ip, hits);
    return false;
  }
  hits.push(now);
  partnerRegisterHitsByIp.set(ip, hits);
  return true;
}

/** Public referral funnel beacons — cap volume per IP to reduce log spam / storage abuse. */
const REFERRAL_TRACK_MAX_PER_WINDOW = 200;
const REFERRAL_TRACK_WINDOW_MS = 15 * 60 * 1000;
const referralTrackHitsByIp = new Map<string, number[]>();

function referralTrackRateLimitOk(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - REFERRAL_TRACK_WINDOW_MS;
  let hits = referralTrackHitsByIp.get(ip) || [];
  hits = hits.filter((t) => t > cutoff);
  if (hits.length >= REFERRAL_TRACK_MAX_PER_WINDOW) {
    referralTrackHitsByIp.set(ip, hits);
    return false;
  }
  hits.push(now);
  referralTrackHitsByIp.set(ip, hits);
  return true;
}

/** Honeypot field — must be empty (bots often fill hidden "website" fields). */
function isPartnerRegistrationHoneypotFilled(body: Record<string, unknown>): boolean {
  return String(body.partnerHoneypot ?? body.website ?? "").trim().length > 0;
}

function tokenFromReq(req: IncomingMessage): string {
  const raw = req.headers[ADMIN_TOKEN_HEADER];
  const value = Array.isArray(raw) ? raw[0] : raw || "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : "";
}

function isAuthed(req: IncomingMessage): boolean {
  const token = tokenFromReq(req);
  if (!token) return false;
  const state = readState();
  return state.adminTokens.some((row) => row.token === token);
}

function randomHex(bytes: number): string {
  return randomBytes(bytes).toString("hex");
}

function hashPortalKey(secret: string, salt: string): string {
  return scryptSync(secret, salt, 64).toString("hex");
}

function verifyPortalKey(storedHash: string, salt: string, input: string): boolean {
  try {
    const h = hashPortalKey(input, salt);
    const a = Buffer.from(storedHash, "hex");
    const b = Buffer.from(h, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function findPartnerByPortalAccessKey(state: BackOfficeState, accessKey: string): PartnerRecord | undefined {
  for (const p of state.partners) {
    if (!p.portalKeyHash || !p.portalKeySalt) continue;
    if (verifyPortalKey(p.portalKeyHash, p.portalKeySalt, accessKey)) return p;
  }
  return undefined;
}

/** Human-shareable one-time password for admin-created partners (email login). */
function randomTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const buf = randomBytes(16);
  let out = "";
  for (let i = 0; i < 16; i += 1) {
    out += chars[buf[i]! % chars.length];
  }
  return out;
}

function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  const user = email.slice(0, at);
  const domain = email.slice(at + 1);
  const u = user.length <= 2 ? `${user[0] ?? "*"}*` : `${user.slice(0, 2)}***`;
  return `${u}@${domain}`;
}

const INVITE_TTL_MS = 14 * 24 * 60 * 60 * 1000;

function getPublicOrigin(): string {
  return (
    process.env.SITE_PUBLIC_URL?.trim() ||
    process.env.VITE_SITE_URL?.trim() ||
    "http://localhost:5173"
  );
}

function referralLinkForCode(code: string): string {
  return `${getPublicOrigin()}/referral?ref=${encodeURIComponent(code)}`;
}

function partnerPortalRefLink(code: string): string {
  return `${getPublicOrigin()}/partner?ref=${encodeURIComponent(code)}`;
}

function generateReferralCode(state: BackOfficeState): string {
  for (let i = 0; i < 64; i++) {
    const tail = randomBytes(4).toString("hex").toUpperCase();
    const code = `ORI-${tail}`;
    const taken =
      state.partners.some((p) => p.referralCode === code) ||
      state.promoCodes.some((p) => p.code === code);
    if (!taken) return code;
  }
  return `ORI-${Date.now().toString(36).toUpperCase()}`;
}

function resolvePartnerByReferralCode(state: BackOfficeState, code: string): PartnerRecord | undefined {
  const c = String(code || "").trim().toUpperCase();
  if (!c) return undefined;
  return state.partners.find((p) => String(p.referralCode || "").toUpperCase() === c);
}

/** Sets portal key on partner and returns the one-time access key string. */
function assignPortalKeyToPartner(state: BackOfficeState, partner: PartnerRecord): string {
  const accessKey = randomHex(24);
  const salt = randomHex(16);
  partner.portalKeySalt = salt;
  partner.portalKeyHash = hashPortalKey(accessKey, salt);
  partner.portalKeyCreatedAt = nowIso();
  partner.updatedAt = nowIso();
  state.partnerSessions = (state.partnerSessions || []).filter((s) => s.partnerId !== partner.id);
  return accessKey;
}

function sanitizePartnerAdmin(p: PartnerRecord): PartnerRecord & {
  portalEnabled: boolean;
  invitePending: boolean;
} {
  // Destructure to omit sensitive fields from the spread sent to the admin UI.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- portalKeySalt, passwordHash, passwordSalt stripped intentionally
  const { portalKeyHash, portalKeySalt, inviteToken, passwordHash, passwordSalt, ...rest } = p;
  return {
    ...rest,
    portalEnabled: Boolean(portalKeyHash),
    invitePending: Boolean(inviteToken),
  };
}

function partnerIdFromSession(req: IncomingMessage): string | null {
  const token = tokenFromReq(req);
  if (!token) return null;
  const state = readState();
  const sessions = state.partnerSessions || [];
  const row = sessions.find((s) => s.token === token);
  return row ? row.partnerId : null;
}

function computePartnerBootstrap(state: BackOfficeState, partnerId: string) {
  const partner = state.partners.find((p) => p.id === partnerId);
  if (!partner) return null;
  const contactsById = new Map(state.contacts.map((c) => [c.id, c]));
  const leads = state.leads.filter((l) => l.partnerId === partnerId);
  const leadsOut = leads.map((lead) => {
    const c = contactsById.get(lead.contactId);
    const opps = state.opportunities.filter((o) => o.leadId === lead.id);
    let fundingRequested = 0;
    let fundingFunded = 0;
    for (const o of opps) {
      fundingRequested += Number(o.requestedAmount || 0);
      for (const fr of state.fundingRecords.filter((f) => f.opportunityId === o.id)) {
        fundingFunded += Number(fr.fundedAmount || 0);
      }
    }
    return {
      id: lead.id,
      ctaType: lead.ctaType,
      status: lead.status,
      createdAt: lead.createdAt,
      contactName: c ? `${c.firstName} ${c.lastName}`.trim() : "—",
      contactEmailMasked: c ? maskEmail(c.email) : "",
      fundingRequested,
      fundingFunded,
      fundingGap: Math.max(0, fundingRequested - fundingFunded),
    };
  });
  const commissions = state.commissions.filter((c) => c.partnerId === partnerId);
  const promoCodes = state.promoCodes.filter((p) => p.partnerId === partnerId);
  const leadsByCta = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.ctaType] = (acc[l.ctaType] || 0) + 1;
    return acc;
  }, {});
  const pending = commissions.filter((c) => c.status === "PENDING").reduce((s, c) => s + c.amount, 0);
  const received = commissions.filter((c) => c.status === "RECEIVED").reduce((s, c) => s + c.amount, 0);
  const paid = commissions.filter((c) => c.status === "PAID").reduce((s, c) => s + c.amount, 0);
  return {
    partner: {
      id: partner.id,
      organizationName: partner.organizationName,
      contactName: partner.contactName,
      referralCode: partner.referralCode,
      defaultCommissionRate: partner.defaultCommissionRate,
      payoutTerms: partner.payoutTerms,
      type: partner.type,
      status: partner.status,
    },
    stats: {
      totalLeads: leads.length,
      leadsByCta,
      commissionPending: pending,
      commissionReceived: received,
      commissionPaid: paid,
      activePromoCodes: promoCodes.filter((p) => p.active).length,
    },
    needsPasswordSetup: !partner.passwordHash,
    leads: leadsOut,
    commissions,
    promoCodes,
  };
}

function upsertContact(
  state: BackOfficeState,
  payload: { firstName: string; lastName: string; email: string; phone?: string; source?: string }
): ContactRecord {
  const email = payload.email.trim().toLowerCase();
  const existing = state.contacts.find((c) => c.email.toLowerCase() === email);
  if (existing) {
    existing.firstName = payload.firstName || existing.firstName;
    existing.lastName = payload.lastName || existing.lastName;
    existing.phone = payload.phone || existing.phone;
    existing.source = payload.source || existing.source;
    existing.updatedAt = nowIso();
    return existing;
  }
  const row: ContactRecord = {
    id: id("ct"),
    firstName: payload.firstName,
    lastName: payload.lastName,
    email,
    phone: payload.phone || "",
    source: payload.source,
    tags: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  state.contacts.unshift(row);
  return row;
}

function addLead(
  state: BackOfficeState,
  payload: Omit<LeadRecord, "id" | "createdAt" | "updatedAt">
): LeadRecord {
  const row: LeadRecord = {
    ...payload,
    id: id("lead"),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  state.leads.unshift(row);
  state.activities.unshift({
    id: id("act"),
    entityType: "LEAD",
    entityId: row.id,
    action: "LEAD_CREATED",
    metadata: { ctaType: row.ctaType, status: row.status },
    createdAt: nowIso(),
  });
  return row;
}

function ensureOpportunityForLead(state: BackOfficeState, lead: LeadRecord): void {
  const exists = state.opportunities.some((o) => o.leadId === lead.id);
  if (exists) return;
  state.opportunities.unshift({
    id: id("opp"),
    leadId: lead.id,
    stage: "Application Submitted",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
}

function ensureSubscriptionForLead(state: BackOfficeState, lead: LeadRecord): void {
  const exists = state.subscriptions.some((s) => s.leadId === lead.id);
  if (exists) return;
  state.subscriptions.unshift({
    id: id("sub"),
    leadId: lead.id,
    planName: "Pre-Qual Client",
    billingStatus: "Current",
    paymentStatus: "Paid",
    subscriptionStatus: "Active Client",
    startedAt: nowIso(),
    inviteStatus: "Invited",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
}

function normalizeForLeadDedupe(input: unknown): unknown {
  if (Array.isArray(input)) return input.map(normalizeForLeadDedupe);
  if (!input || typeof input !== "object") return input;
  const src = input as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(src).sort()) {
    // Exclude volatile timestamps so repeated submissions with same answers dedupe cleanly.
    if (k === "completedAt" || k === "updatedAt" || k === "submittedAt") continue;
    out[k] = normalizeForLeadDedupe(src[k]);
  }
  return out;
}

function sameLeadPayload(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  try {
    return JSON.stringify(normalizeForLeadDedupe(a)) === JSON.stringify(normalizeForLeadDedupe(b));
  } catch {
    return false;
  }
}

function computeDashboard(state: BackOfficeState) {
  const leadsByCta = state.leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.ctaType] = (acc[lead.ctaType] || 0) + 1;
    return acc;
  }, {});
  const fundedRecords = state.fundingRecords.filter((f) => (f.fundedAmount || 0) > 0);
  const fundedVolume = fundedRecords.reduce((sum, f) => sum + (f.fundedAmount || 0), 0);
  const commissionRevenue = state.fundingRecords.reduce((sum, f) => sum + (f.commissionAmount || 0), 0);
  return {
    totalLeads: state.leads.length,
    leadsByCta,
    fundedVolume,
    commissionRevenue,
    activeSubscriptions: state.subscriptions.filter((s) => s.subscriptionStatus === "Active Client").length,
    partnerLeaderboard: state.partners
      .map((p) => {
        const partnerLeadCount = state.leads.filter((l) => l.partnerId === p.id).length;
        const owed = state.commissions
          .filter((c) => c.partnerId === p.id && c.status === "PENDING")
          .reduce((sum, c) => sum + c.amount, 0);
        return { partnerId: p.id, name: p.organizationName, leads: partnerLeadCount, commissionsOwed: owed };
      })
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 8),
    recentActivity: state.activities.slice(0, 15),
  };
}

function approvedTestimonialFundingDollars(state: BackOfficeState): number {
  return state.testimonials
    .filter((t) => t.isApproved && typeof t.fundingAmount === "number" && t.fundingAmount > 0)
    .reduce((sum, t) => sum + (t.fundingAmount || 0), 0);
}

function computeMainFundingDisplay(state: BackOfficeState): { value: number; unit: "M" | "K" } {
  const cfg = state.siteMetricConfig;
  const divisor = cfg.totalFundingUnit === "M" ? 1e6 : 1e3;
  const testimonialDollars = approvedTestimonialFundingDollars(state);
  const fundedDollars = state.fundingRecords.reduce((sum, f) => sum + (f.fundedAmount || 0), 0);
  if (cfg.configMode === "MANUAL") {
    return { value: cfg.totalFundingDisplayValue, unit: cfg.totalFundingUnit };
  }
  if (cfg.configMode === "AUTO") {
    const totalDollars = fundedDollars + testimonialDollars;
    return { value: totalDollars / divisor, unit: cfg.totalFundingUnit };
  }
  return {
    value: cfg.totalFundingDisplayValue + testimonialDollars / divisor,
    unit: cfg.totalFundingUnit,
  };
}

function computePublicSiteContent(state: BackOfficeState) {
  const approved = state.testimonials.filter((t) => t.isApproved);
  const main = computeMainFundingDisplay(state);
  return {
    siteMetricConfig: state.siteMetricConfig,
    approvedTestimonialFundingDollars: approvedTestimonialFundingDollars(state),
    mainFundingDisplayValue: main.value,
    mainFundingUnit: main.unit,
    testimonialsForHomepage: approved.map((t) => ({
      name: t.name,
      quote: t.quote,
      company: t.company,
      industry: t.industry,
      location: t.location,
      fundingAmount: t.fundingAmount,
      businessType: t.businessType,
    })),
  };
}

function pushActivity(
  state: BackOfficeState,
  entityType: string,
  entityId: string,
  action: string,
  metadata?: Record<string, unknown>
): void {
  state.activities.unshift({
    id: id("act"),
    entityType,
    entityId,
    action,
    metadata,
    createdAt: nowIso(),
  });
  state.activities = state.activities.slice(0, 500);
}

export function attachBackOfficeRoutes(middlewares: {
  use: (handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void;
}) {
  warnIfBackofficeLoginBlocked();
  middlewares.use((req, res, next) => {
    const pathname = new URL(req.url || "/", "http://localhost").pathname;

    // public intake endpoints
    if (pathname === "/api/intake/contact" && req.method === "POST") {
      void (async () => {
        try {
          const body = await parseBody(req);
          const state = readState();
          const fullName = String(body.name || "").trim();
          const [firstName, ...rest] = fullName.split(/\s+/).filter(Boolean);
          const contact = upsertContact(state, {
            firstName: firstName || "Unknown",
            lastName: rest.join(" "),
            email: String(body.email || "").trim(),
            phone: String(body.phone || "").trim(),
            source: "CONTACT_FORM",
          });
          const refCode = String(body.referralCode || body.ref || "").trim();
          const affiliate = refCode ? resolvePartnerByReferralCode(state, refCode) : undefined;
          const enrichedBody: Record<string, unknown> = {
            ...body,
            ...(affiliate
              ? { affiliatePartnerName: affiliate.organizationName, referralCode: refCode }
              : refCode
                ? { referralCode: refCode }
                : {}),
          };
          const existing = state.leads.find(
            (l) =>
              l.contactId === contact.id &&
              l.ctaType === "CONSULT" &&
              l.sourceType === "CONTACT_FORM" &&
              l.sourceDetail === String(body.referralSource || "Unknown") &&
              (l.partnerId || undefined) === (affiliate?.id || undefined) &&
              sameLeadPayload(l.intakePayload, enrichedBody)
          );
          if (existing) {
            existing.updatedAt = nowIso();
            pushActivity(state, "LEAD", existing.id, "LEAD_DEDUPED", { source: "CONTACT_FORM" });
            writeState(state);
            afterContactIntake(enrichedBody);
            sendJson(res, 200, { ok: true, leadId: existing.id, deduped: true });
            return;
          }
          const lead = addLead(state, {
            contactId: contact.id,
            ctaType: "CONSULT",
            sourceType: "CONTACT_FORM",
            sourceDetail: String(body.referralSource || "Unknown"),
            status: "None",
            partnerId: affiliate?.id,
            intakePayload: enrichedBody,
          });
          writeState(state);
          afterContactIntake(enrichedBody);
          sendJson(res, 200, { ok: true, leadId: lead.id, deduped: false });
        } catch (err) {
          sendJson(res, 400, { ok: false, error: String(err) });
        }
      })();
      return;
    }

    if ((pathname === "/api/prequalify" || pathname === "/api/apply") && req.method === "POST") {
      void (async () => {
        try {
          const body = await parseBody(req);
          const state = readState();
          const contact = upsertContact(state, {
            firstName: String(body.firstName || "Unknown"),
            lastName: String(body.lastName || ""),
            email: String(body.email || "").trim(),
            phone: String(body.phone || "").trim(),
            source: "APPLY_FORM",
          });
          const sourceDetail = String(body.howDidYouHear || "Site");
          const refCode = String(body.referralCode || body.ref || "").trim();
          const affiliate = refCode ? resolvePartnerByReferralCode(state, refCode) : undefined;
          const enrichedBody: Record<string, unknown> = {
            ...body,
            ...(affiliate
              ? { affiliatePartnerName: affiliate.organizationName, referralCode: refCode }
              : refCode
                ? { referralCode: refCode }
                : {}),
          };
          const existing = state.leads.find(
            (l) =>
              l.contactId === contact.id &&
              l.ctaType === "APPLY" &&
              l.sourceType === "APPLY_FORM" &&
              l.sourceDetail === sourceDetail &&
              (l.partnerId || undefined) === (affiliate?.id || undefined) &&
              sameLeadPayload(l.intakePayload, enrichedBody)
          );
          if (existing) {
            existing.updatedAt = nowIso();
            pushActivity(state, "LEAD", existing.id, "LEAD_DEDUPED", { source: "APPLY_FORM" });
            writeState(state);
            afterPrequalifyOrApply(enrichedBody);
            sendJson(res, 200, { ok: true, leadId: existing.id, deduped: true });
            return;
          }
          const lead = addLead(state, {
            contactId: contact.id,
            ctaType: "APPLY",
            sourceType: "APPLY_FORM",
            sourceDetail,
            status: "None",
            partnerId: affiliate?.id,
            intakePayload: enrichedBody,
          });
          const requested = Number(body.requestedAmount || 0);
          state.opportunities.unshift({
            id: id("opp"),
            leadId: lead.id,
            stage: "Application Submitted",
            requestedAmount: Number.isFinite(requested) ? requested : undefined,
            fundingType: typeof body.fundingType === "string" ? body.fundingType : undefined,
            createdAt: nowIso(),
            updatedAt: nowIso(),
          });
          writeState(state);
          afterPrequalifyOrApply(enrichedBody);
          sendJson(res, 200, { ok: true, leadId: lead.id, deduped: false });
        } catch (err) {
          sendJson(res, 400, { ok: false, error: String(err) });
        }
      })();
      return;
    }

    if (pathname === "/api/newsletter" && req.method === "POST") {
      void (async () => {
        try {
          const body = await parseBody(req);
          const email = String(body.email || "").trim().toLowerCase();
          if (!email.includes("@") || email.length < 5) {
            sendJson(res, 400, { ok: false, error: "Valid email is required." });
            return;
          }
          afterNewsletterSignup(email);
          sendJson(res, 200, { ok: true });
        } catch (err) {
          sendJson(res, 400, { ok: false, error: String(err) });
        }
      })();
      return;
    }

    if (pathname === "/api/capital-partners" && req.method === "POST") {
      void (async () => {
        try {
          const body = await parseBody(req);
          const email = String(body.email || "").trim().toLowerCase();
          if (!email.includes("@") || email.length < 5) {
            sendJson(res, 400, { ok: false, error: "Valid email is required." });
            return;
          }
          afterCapitalPartnerInterest({
            email,
            name: String(body.name || "").trim() || undefined,
            organization:
              String(body.organization || body.companyName || "").trim() || undefined,
          });
          sendJson(res, 200, { ok: true });
        } catch (err) {
          sendJson(res, 400, { ok: false, error: String(err) });
        }
      })();
      return;
    }

    if (pathname === "/api/admin/login" && req.method === "POST") {
      void (async () => {
        const adminAuth = getBackofficeAdminAuth();
        if (adminAuth.productionLoginBlocked) {
          sendJson(res, 503, {
            ok: false,
            error: adminAuth.blockMessage || "Back office login is disabled for this environment.",
          });
          return;
        }
        const ip = getClientIp(req);
        if (!adminLoginFailLimiter.isAllowed(ip)) {
          sendJson(res, 429, {
            ok: false,
            error: "Too many login attempts. Try again later.",
          });
          return;
        }
        const body = await parseBody(req);
        const password = String(body.password || "");
        if (password !== adminAuth.passwordForComparison) {
          adminLoginFailLimiter.recordFailure(ip);
          sendJson(res, 401, { ok: false, error: "Invalid credentials" });
          return;
        }
        adminLoginFailLimiter.reset(ip);
        const state = readState();
        const token = id("adm");
        state.adminTokens.unshift({ token, createdAt: nowIso() });
        state.adminTokens = state.adminTokens.slice(0, 20);
        writeState(state);
        sendJson(res, 200, { ok: true, token });
      })();
      return;
    }

    if (pathname === "/api/public/site-content" && req.method === "GET") {
      const state = readState();
      sendJson(res, 200, { ok: true, ...computePublicSiteContent(state) });
      return;
    }

    if (pathname === "/api/intake/testimonial" && req.method === "POST") {
      void (async () => {
        try {
          const body = await parseBody(req);
          const state = readState();
          const parseFunding = (v: unknown): number | undefined => {
            if (typeof v === "number" && Number.isFinite(v)) return v;
            if (typeof v === "string") {
              const n = Number(String(v).replace(/[$,]/g, ""));
              return Number.isFinite(n) ? n : undefined;
            }
            return undefined;
          };
          const row: TestimonialRecord = {
            id: id("ts"),
            name: String(body.name || "").trim(),
            quote: String(body.feedback || body.quote || "").trim(),
            company: String(body.company || "").trim() || undefined,
            industry: String(body.industry || "").trim() || undefined,
            location: String(body.location || "").trim() || undefined,
            fundingAmount: parseFunding(body.fundingAmount),
            businessType: String(body.businessStage || body.businessType || "").trim() || undefined,
            isApproved: false,
            submittedAt: nowIso(),
          };
          if (!row.name || !row.quote) {
            sendJson(res, 400, { ok: false, error: "Name and feedback are required" });
            return;
          }
          state.testimonials.unshift(row);
          pushActivity(state, "TESTIMONIAL", row.id, "TESTIMONIAL_SUBMITTED", {});
          writeState(state);
          sendJson(res, 200, { ok: true, testimonialId: row.id });
        } catch (err) {
          sendJson(res, 400, { ok: false, error: String(err) });
        }
      })();
      return;
    }

    if (pathname === "/api/public/invite-partner" && req.method === "GET") {
      const u = new URL(req.url || "/", "http://localhost");
      const token = u.searchParams.get("token") || "";
      const state = readState();
      const partner = state.partners.find((p) => p.inviteToken === token);
      if (!partner || !token) {
        sendJson(res, 200, { ok: false, valid: false });
        return;
      }
      if (partner.inviteExpiresAt && new Date(partner.inviteExpiresAt) < new Date()) {
        sendJson(res, 200, { ok: false, valid: false, error: "expired" });
        return;
      }
      sendJson(res, 200, {
        ok: true,
        valid: true,
        organizationName: partner.organizationName,
        referralCode: partner.referralCode,
        partnerType: partner.type,
      });
      return;
    }

    if (pathname === "/api/public/referral-partner" && req.method === "GET") {
      const u = new URL(req.url || "/", "http://localhost");
      const ref = String(u.searchParams.get("ref") || "").trim();
      const state = readState();
      if (!ref) {
        sendJson(res, 200, { ok: true, found: false });
        return;
      }
      const partner = resolvePartnerByReferralCode(state, ref);
      if (!partner) {
        sendJson(res, 200, { ok: true, found: false });
        return;
      }
      const org = String(partner.organizationName || "").trim();
      const contact = String(partner.contactName || "").trim();
      const displayName = org || contact;
      sendJson(res, 200, {
        ok: true,
        found: true,
        partnerId: partner.id,
        referralCode: partner.referralCode || ref,
        displayName,
      });
      return;
    }

    if (pathname === "/api/public/referral-track" && req.method === "POST") {
      void (async () => {
        try {
          const ip = getClientIp(req);
          if (!referralTrackRateLimitOk(ip)) {
            sendJson(res, 429, { ok: false, error: "Too many requests. Please try again later." });
            return;
          }
          const body = await parseBody(req);
          const code = String(body.referralCode || body.ref || "").trim();
          const event = String(body.event || "");
          const state = readState();
          const partner = resolvePartnerByReferralCode(state, code);
          if (partner && (event === "landing" || event === "cta")) {
            pushActivity(state, "PARTNER", partner.id, "REFERRAL_FUNNEL_EVENT", {
              referralCode: partner.referralCode,
              event,
              cta: typeof body.cta === "string" ? body.cta : undefined,
            });
            writeState(state);
          }
          sendJson(res, 200, { ok: true });
        } catch {
          sendJson(res, 200, { ok: true });
        }
      })();
      return;
    }

    if (pathname === "/api/partner/complete-invite" && req.method === "POST") {
      void (async () => {
        try {
          const body = await parseBody(req);
          if (isPartnerRegistrationHoneypotFilled(body)) {
            sendJson(res, 200, {
              ok: true,
              message:
                "Thank you for your interest in partnering with Ori. We’ll follow up with next steps.",
              referralCode: "",
              referralLink: "",
              partnerPortalLink: "",
            });
            return;
          }
          const ip = getClientIp(req);
          if (!partnerRegisterRateLimitOk(ip)) {
            sendJson(res, 429, { ok: false, error: "Too many requests. Please try again later." });
            return;
          }
          const token = String(body.token || "").trim();
          const state = readState();
          const partner = state.partners.find((p) => p.inviteToken === token);
          if (!partner || !token) {
            sendJson(res, 400, { ok: false, error: "Invalid or expired invite" });
            return;
          }
          if (partner.status !== "INVITED") {
            sendJson(res, 400, { ok: false, error: "This partner is not awaiting invite completion" });
            return;
          }
          if (partner.inviteExpiresAt && new Date(partner.inviteExpiresAt) < new Date()) {
            sendJson(res, 400, { ok: false, error: "Invite has expired" });
            return;
          }
          partner.organizationName = String(body.organizationName || partner.organizationName).trim();
          partner.contactName = String(body.contactName || "").trim();
          partner.email = String(body.email || "").trim().toLowerCase() || undefined;
          partner.phone = String(body.phone || "").trim() || undefined;
          if (!partner.organizationName || !partner.contactName || !partner.email) {
            sendJson(res, 400, {
              ok: false,
              error: "Organization name, full name, and email are required.",
            });
            return;
          }
          const inviteIntake = parsePartnerIntakePayload(body.partnerIntake);
          const intakeCheck = validatePartnerIntakeRequired(inviteIntake);
          if (!intakeCheck.ok) {
            sendJson(res, 400, { ok: false, error: intakeCheck.error });
            return;
          }
          partner.partnerIntake = inviteIntake;
          partner.inviteToken = undefined;
          partner.inviteExpiresAt = undefined;
          partner.status = "ACTIVE";
          partner.updatedAt = nowIso();
          delete partner.passwordHash;
          delete partner.passwordSalt;
          delete partner.passwordSetAt;
          pushActivity(state, "PARTNER", partner.id, "PARTNER_INVITE_COMPLETED", {});
          writeState(state);
          const code = partner.referralCode || "";
          sendJson(res, 200, {
            ok: true,
            message:
              "Registration complete. Ori will enable portal access and email you when your account is ready.",
            referralCode: code,
            referralLink: referralLinkForCode(code),
            partnerPortalLink: partnerPortalRefLink(code),
          });
        } catch (err) {
          sendJson(res, 400, { ok: false, error: String(err) });
        }
      })();
      return;
    }

    if (pathname === "/api/partner/self-register" && req.method === "POST") {
      void (async () => {
        try {
          const body = await parseBody(req);
          if (isPartnerRegistrationHoneypotFilled(body)) {
            sendJson(res, 200, {
              ok: true,
              message:
                "Thanks — we received your partner application. Our team will review it and email you with next steps.",
            });
            return;
          }
          const ip = getClientIp(req);
          if (!partnerRegisterRateLimitOk(ip)) {
            sendJson(res, 429, { ok: false, error: "Too many requests. Please try again later." });
            return;
          }
          const email = String(body.email || "").trim().toLowerCase();
          const organizationName = String(body.organizationName || "").trim();
          const contactName = String(body.contactName || "").trim();
          if (!email || !organizationName || !contactName) {
            sendJson(res, 400, {
              ok: false,
              error: "Organization name, full name, and email are required.",
            });
            return;
          }
          const partnerIntake = parsePartnerIntakePayload(body.partnerIntake);
          const intakeCheck = validatePartnerIntakeRequired(partnerIntake);
          if (!intakeCheck.ok) {
            sendJson(res, 400, { ok: false, error: intakeCheck.error });
            return;
          }
          const state = readState();
          const emailTakenPartner = state.partners.some((p) => (p.email || "").trim().toLowerCase() === email);
          if (emailTakenPartner) {
            sendJson(res, 400, {
              ok: false,
              error: "An account with this email already exists. Sign in at the partner portal or contact Ori.",
            });
            return;
          }
          const existingContact = state.contacts.find((c) => c.email.toLowerCase() === email);
          if (existingContact) {
            const dupPartnerLead = state.leads.some(
              (l) => l.contactId === existingContact.id && l.ctaType === "PARTNER"
            );
            if (dupPartnerLead) {
              sendJson(res, 400, {
                ok: false,
                error: "We already received a partner registration from this email. Our team will follow up shortly.",
              });
              return;
            }
          }
          const [firstName, ...nameRest] = contactName.split(/\s+/).filter(Boolean);
          const contact = upsertContact(state, {
            firstName: firstName || "Partner",
            lastName: nameRest.join(" "),
            email,
            phone: String(body.phone || "").trim(),
            source: "PARTNER_SELF_REGISTER",
          });
          const intakePayload: Record<string, unknown> = {
            organizationName,
            partnerType: normalizePartnerType(body.type),
            partnerIntake,
            registrationPath: "PARTNER_SELF_REGISTER",
          };
          const lead = addLead(state, {
            contactId: contact.id,
            ctaType: "PARTNER",
            sourceType: "PARTNER_SELF_REGISTER",
            sourceDetail: "Partner registration (web)",
            status: "None",
            intakePayload,
          });
          pushActivity(state, "LEAD", lead.id, "PARTNER_REGISTRATION_SUBMITTED", { organizationName });
          writeState(state);
          sendJson(res, 200, {
            ok: true,
            message:
              "Thanks — we received your partner application. Our team will review it and email you with next steps.",
          });
        } catch (err) {
          sendJson(res, 400, { ok: false, error: String(err) });
        }
      })();
      return;
    }

    if (pathname === "/api/partner/login" && req.method === "POST") {
      void (async () => {
        try {
          const ip = getClientIp(req);
          if (!partnerLoginFailLimiter.isAllowed(ip)) {
            sendJson(res, 429, {
              ok: false,
              error: "Too many sign-in attempts. Try again later.",
            });
            return;
          }
          const body = await parseBody(req);
          const accessKey = String(body.accessKey || "").trim();
          const email = String(body.email || "").trim().toLowerCase();
          const password = String(body.password || "");
          const state = readState();

          let partner: PartnerRecord | undefined;

          if (email && password) {
            partner = state.partners.find((p) => (p.email || "").trim().toLowerCase() === email);
            if (!partner?.passwordHash || !partner.passwordSalt) {
              partnerLoginFailLimiter.recordFailure(ip);
              sendJson(res, 401, {
                ok: false,
                error:
                  "Use your portal access key, or sign in with email after you set a password in the portal.",
              });
              return;
            }
            if (!verifyPortalKey(partner.passwordHash, partner.passwordSalt, password)) {
              partnerLoginFailLimiter.recordFailure(ip);
              sendJson(res, 401, { ok: false, error: "Invalid email or password" });
              return;
            }
          } else if (accessKey) {
            partner = findPartnerByPortalAccessKey(state, accessKey);
            if (!partner) {
              partnerLoginFailLimiter.recordFailure(ip);
              sendJson(res, 401, { ok: false, error: "Invalid access key" });
              return;
            }
          } else {
            sendJson(res, 400, {
              ok: false,
              error: "Enter your portal access key, or sign in with email and password.",
            });
            return;
          }

          if (partner.status === "SUSPENDED") {
            sendJson(res, 403, { ok: false, error: "Partner account is suspended" });
            return;
          }
          if (partner.status === "INVITED") {
            sendJson(res, 403, {
              ok: false,
              error: "Complete your invite registration (link from Ori) before signing in",
            });
            return;
          }
          partnerLoginFailLimiter.reset(ip);
          if (!state.partnerSessions) state.partnerSessions = [];
          const token = id("prt");
          state.partnerSessions.unshift({ token, partnerId: partner.id, createdAt: nowIso() });
          state.partnerSessions = state.partnerSessions.slice(0, 200);
          writeState(state);
          sendJson(res, 200, { ok: true, token });
        } catch (err) {
          sendJson(res, 400, { ok: false, error: String(err) });
        }
      })();
      return;
    }

    if (pathname.startsWith("/api/partner")) {
      if (pathname === "/api/partner/set-password" && req.method === "POST") {
        void (async () => {
          try {
            const pid = partnerIdFromSession(req);
            if (!pid) {
              sendJson(res, 401, { ok: false, error: "Unauthorized" });
              return;
            }
            const body = await parseBody(req);
            const password = String(body.password || "");
            if (password.length < 8) {
              sendJson(res, 400, { ok: false, error: "Password must be at least 8 characters" });
              return;
            }
            const state = readState();
            const partner = state.partners.find((p) => p.id === pid);
            if (!partner) {
              sendJson(res, 404, { ok: false, error: "Partner not found" });
              return;
            }
            if (partner.status === "SUSPENDED") {
              sendJson(res, 403, { ok: false, error: "Partner account is suspended" });
              return;
            }
            const salt = randomHex(16);
            partner.passwordHash = hashPortalKey(password, salt);
            partner.passwordSalt = salt;
            partner.passwordSetAt = nowIso();
            partner.updatedAt = nowIso();
            writeState(state);
            sendJson(res, 200, { ok: true });
          } catch (err) {
            sendJson(res, 400, { ok: false, error: String(err) });
          }
        })();
        return;
      }
      if (pathname === "/api/partner/bootstrap" && req.method === "GET") {
        const pid = partnerIdFromSession(req);
        if (!pid) {
          sendJson(res, 401, { ok: false, error: "Unauthorized" });
          return;
        }
        const state = readState();
        const pRow = state.partners.find((p) => p.id === pid);
        if (pRow?.status === "SUSPENDED") {
          sendJson(res, 403, { ok: false, error: "Partner account is suspended" });
          return;
        }
        const payload = computePartnerBootstrap(state, pid);
        if (!payload) {
          sendJson(res, 404, { ok: false, error: "Partner not found" });
          return;
        }
        sendJson(res, 200, { ok: true, ...payload });
        return;
      }
      sendJson(res, 404, { ok: false, error: "Not found" });
      return;
    }

    if (!pathname.startsWith("/api/backoffice")) {
      next();
      return;
    }
    if (!isAuthed(req)) {
      sendJson(res, 401, { ok: false, error: "Unauthorized" });
      return;
    }

    if (pathname === "/api/backoffice/bootstrap" && req.method === "GET") {
      const state = readState();
      const partnersForAdmin = state.partners.map((p) => sanitizePartnerAdmin(p));
      sendJson(res, 200, {
        ok: true,
        dashboard: computeDashboard(state),
        leads: state.leads,
        contacts: state.contacts,
        opportunities: state.opportunities,
        fundingRecords: state.fundingRecords,
        subscriptions: state.subscriptions,
        consultations: state.consultations,
        partners: partnersForAdmin,
        commissions: state.commissions,
        promoCodes: state.promoCodes,
        testimonials: state.testimonials,
        siteMetricConfig: state.siteMetricConfig,
      });
      return;
    }

    if (pathname === "/api/backoffice/metrics" && req.method === "PUT") {
      void (async () => {
        const body = await parseBody(req);
        const state = readState();
        state.siteMetricConfig = {
          ...state.siteMetricConfig,
          ...(body as unknown as Partial<SiteMetricConfig>),
        };
        writeState(state);
        sendJson(res, 200, { ok: true, siteMetricConfig: state.siteMetricConfig });
      })();
      return;
    }

    if (pathname === "/api/backoffice/partners" && req.method === "POST") {
      void (async () => {
        try {
          const body = await parseBody(req);
          const state = readState();
          const rawOnboarding = String(body.partnerOnboarding || body.createMode || "ADMIN").toUpperCase();
          const isInvite =
            rawOnboarding === "INVITE" || rawOnboarding === "INVITE_ONLY" || rawOnboarding === "FULL_INVITE";
          const rawRate = body.defaultCommissionRate === undefined ? 0.03 : Number(body.defaultCommissionRate);
          const defaultCommissionRate = Math.min(0.5, Math.max(0, Number.isFinite(rawRate) ? rawRate : 0.1));
          const email = String(body.email || "").trim();
          if (!isInvite && !email) {
            sendJson(res, 400, {
              ok: false,
              error: "Email is required when creating a partner from the admin form (for temporary password sign-in).",
            });
            return;
          }
          const code = generateReferralCode(state);
          const row: PartnerRecord = {
            id: id("partner"),
            type: normalizePartnerType(body.type),
            organizationName: String(body.organizationName || "").trim(),
            contactName: String(body.contactName || "").trim() || (isInvite ? "Pending partner" : "—"),
            email: email || undefined,
            phone: String(body.phone || "").trim() || undefined,
            status: isInvite ? "INVITED" : "ACTIVE",
            referralCode: code,
            defaultCommissionRate,
            createdAt: nowIso(),
            updatedAt: nowIso(),
          };
          let temporaryPassword: string | undefined;
          let inviteUrl: string | undefined;
          if (isInvite) {
            row.inviteToken = randomHex(24);
            row.inviteExpiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();
            inviteUrl = `${getPublicOrigin()}/partner/register?token=${encodeURIComponent(row.inviteToken)}`;
          } else {
            const temp = randomTempPassword();
            const psalt = randomHex(16);
            row.passwordHash = hashPortalKey(temp, psalt);
            row.passwordSalt = psalt;
            row.passwordSetAt = nowIso();
            temporaryPassword = temp;
          }
          state.partners.unshift(row);
          pushActivity(state, "PARTNER", row.id, "PARTNER_CREATED", { mode: isInvite ? "INVITE" : "ADMIN" });
          writeState(state);
          sendJson(res, 200, {
            ok: true,
            partner: sanitizePartnerAdmin(row),
            referralCode: code,
            referralLink: referralLinkForCode(code),
            partnerPortalLink: partnerPortalRefLink(code),
            temporaryPassword,
            inviteUrl,
          });
        } catch (err) {
          sendJson(res, 400, { ok: false, error: String(err) });
        }
      })();
      return;
    }

    if (pathname === "/api/backoffice/leads" && req.method === "POST") {
      void (async () => {
        try {
          const body = await parseBody(req);
          const state = readState();
          const fullName = String(body.name || "").trim();
          const [firstName, ...rest] = fullName.split(/\s+/).filter(Boolean);
          const email = String(body.email || "").trim();
          if (!email) {
            sendJson(res, 400, { ok: false, error: "Email is required." });
            return;
          }
          const ctaTypeRaw = String(body.ctaType || "CONSULT").trim().toUpperCase();
          const ctaType = (
            ctaTypeRaw === "APPLY" ||
            ctaTypeRaw === "PREQUAL" ||
            ctaTypeRaw === "CONSULT" ||
            ctaTypeRaw === "PARTNER"
              ? ctaTypeRaw
              : "CONSULT"
          ) as LeadRecord["ctaType"];
          const statusRaw = typeof body.status === "string" ? body.status.trim() : "";
          const status =
            statusRaw !== ""
              ? statusRaw
              : "None";
          const contact = upsertContact(state, {
            firstName: firstName || "Unknown",
            lastName: rest.join(" "),
            email,
            phone: String(body.phone || "").trim(),
            source: "BACKOFFICE_MANUAL",
          });
          const lead = addLead(state, {
            contactId: contact.id,
            ctaType,
            sourceType: "BACKOFFICE_MANUAL",
            sourceDetail: String(body.sourceDetail || "Back Office"),
            status,
            partnerId: String(body.partnerId || "").trim() || undefined,
            intakePayload: body,
          });
          if (ctaType !== "PARTNER" && (status === "Apply" || status === "Converted to Apply" || ctaType === "APPLY"))
            ensureOpportunityForLead(state, lead);
          if (ctaType !== "PARTNER" && (status === "Pre-Qualify" || status === "Converted to Pre-Qual" || ctaType === "PREQUAL"))
            ensureSubscriptionForLead(state, lead);
          writeState(state);
          sendJson(res, 200, { ok: true, lead, contact });
        } catch (err) {
          sendJson(res, 400, { ok: false, error: String(err) });
        }
      })();
      return;
    }

    if (pathname === "/api/backoffice/testimonial-requests" && req.method === "POST") {
      void (async () => {
        try {
          const body = await parseBody(req);
          const recipientName = String(body.recipientName || "").trim();
          const recipientEmail = String(body.recipientEmail || "").trim();
          const recipientPhone = String(body.recipientPhone || "").trim();
          if (!recipientName) {
            sendJson(res, 400, { ok: false, error: "Recipient name is required." });
            return;
          }
          if (!recipientEmail && !recipientPhone) {
            sendJson(res, 400, { ok: false, error: "Provide an email and/or phone number." });
            return;
          }
          const state = readState();
          const testimonialPublicUrl = `${getPublicOrigin()}/testimonial`;
          const message =
            `Hi ${recipientName}, we'd appreciate a short testimonial about your experience with Ori. ` +
            `You can submit it here: ${testimonialPublicUrl}`;
          logIntegration("TESTIMONIAL_REQUEST_TRIGGERED", {
            recipientName,
            recipientEmail: recipientEmail || undefined,
            recipientPhone: recipientPhone || undefined,
            channel: recipientPhone ? "SMS_OR_WHATSAPP" : "EMAIL",
            twilioConfigured: twilioEnabled(),
            twilioSmsReady: twilioSmsReady(),
          });
          let smsSent = false;
          let smsError: string | undefined;
          if (recipientPhone && twilioSmsReady()) {
            const e164 = normalizePhoneToE164(recipientPhone);
            if (e164) {
              const smsResult = await twilioSendSms(e164, message);
              smsSent = smsResult.ok;
              if (!smsResult.ok) smsError = smsResult.error;
            } else {
              smsError = "invalid_phone";
            }
          } else if (recipientPhone && !twilioSmsReady()) {
            logIntegration("TESTIMONIAL_SMS_SKIP", { reason: "twilio_sms_not_configured" });
          }
          pushActivity(state, "TESTIMONIAL", id("req"), "TESTIMONIAL_REQUESTED", {
            recipientName,
            recipientEmail: recipientEmail || undefined,
            recipientPhone: recipientPhone || undefined,
            twilioConfigured: twilioEnabled(),
            smsSent,
          });
          writeState(state);
          sendJson(res, 200, {
            ok: true,
            queued: true,
            twilioConfigured: twilioEnabled(),
            twilioSmsReady: twilioSmsReady(),
            smsSent,
            ...(smsError ? { smsError } : {}),
            messagePreview: message,
          });
        } catch (err) {
          sendJson(res, 400, { ok: false, error: String(err) });
        }
      })();
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/partners\/[^/]+\/portal-key$/) && req.method === "POST") {
      void (async () => {
        const state = readState();
        const partnerId = pathname.split("/")[4];
        const partner = state.partners.find((p) => p.id === partnerId);
        if (!partner) {
          sendJson(res, 404, { ok: false, error: "Partner not found" });
          return;
        }
        if (!String(partner.referralCode || "").trim()) {
          sendJson(res, 400, {
            ok: false,
            error: "Set a referral code on the partner before enabling the partner portal",
          });
          return;
        }
        const accessKey = assignPortalKeyToPartner(state, partner);
        pushActivity(state, "PARTNER", partnerId, "PARTNER_PORTAL_KEY_ISSUED", {});
        writeState(state);
        sendJson(res, 200, {
          ok: true,
          accessKey,
          partner: sanitizePartnerAdmin(partner),
          message:
            "Share this access key with the partner once. Regenerating invalidates the previous key and signs them out.",
        });
      })();
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/partners\/[^/]+\/revoke-portal$/) && req.method === "POST") {
      void (async () => {
        const state = readState();
        const partnerId = pathname.split("/")[4];
        const partner = state.partners.find((p) => p.id === partnerId);
        if (!partner) {
          sendJson(res, 404, { ok: false, error: "Partner not found" });
          return;
        }
        delete partner.portalKeyHash;
        delete partner.portalKeySalt;
        delete partner.portalKeyCreatedAt;
        partner.updatedAt = nowIso();
        state.partnerSessions = (state.partnerSessions || []).filter((s) => s.partnerId !== partnerId);
        pushActivity(state, "PARTNER", partnerId, "PARTNER_PORTAL_REVOKED", {});
        writeState(state);
        sendJson(res, 200, { ok: true, partner: sanitizePartnerAdmin(partner) });
      })();
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/partners\/[^/]+\/invite$/) && req.method === "POST") {
      void (async () => {
        const state = readState();
        const partnerId = pathname.split("/")[4];
        const partner = state.partners.find((p) => p.id === partnerId);
        if (!partner) {
          sendJson(res, 404, { ok: false, error: "Partner not found" });
          return;
        }
        if (!String(partner.referralCode || "").trim()) {
          sendJson(res, 400, { ok: false, error: "Partner has no referral code" });
          return;
        }
        if (partner.status !== "INVITED") {
          sendJson(res, 400, {
            ok: false,
            error: "Invite link is only for partners in INVITED status (use invite-only create, or set status to INVITED).",
          });
          return;
        }
        partner.inviteToken = randomHex(24);
        partner.inviteExpiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();
        partner.updatedAt = nowIso();
        pushActivity(state, "PARTNER", partnerId, "PARTNER_INVITE_SENT", {});
        writeState(state);
        const inviteUrl = `${getPublicOrigin()}/partner/register?token=${encodeURIComponent(partner.inviteToken!)}`;
        sendJson(res, 200, {
          ok: true,
          inviteUrl,
          expiresAt: partner.inviteExpiresAt,
          partner: sanitizePartnerAdmin(partner),
        });
      })();
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/partners\/[^/]+\/approval-invite$/) && req.method === "POST") {
      void (async () => {
        const state = readState();
        const partnerId = pathname.split("/")[4];
        const partner = state.partners.find((p) => p.id === partnerId);
        if (!partner) {
          sendJson(res, 404, { ok: false, error: "Partner not found" });
          return;
        }
        if (!String(partner.referralCode || "").trim()) {
          sendJson(res, 400, { ok: false, error: "Partner has no referral code" });
          return;
        }
        const email = String(partner.email || "").trim();
        if (!email) {
          sendJson(res, 400, { ok: false, error: "Partner has no email on file" });
          return;
        }
        const accessKey = assignPortalKeyToPartner(state, partner);
        pushActivity(state, "PARTNER", partnerId, "PARTNER_APPROVAL_INVITE_QUEUED", {});
        logIntegration("PARTNER_APPROVAL_EMAIL_QUEUED", {
          to: email,
          partnerId,
          organizationName: partner.organizationName,
          accessKeyLength: accessKey.length,
        });
        writeState(state);
        sendJson(res, 200, {
          ok: true,
          accessKey,
          message:
            "Access key generated. Copy it for your records; email delivery will use Mailchimp or similar when configured.",
          partner: sanitizePartnerAdmin(partner),
        });
      })();
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/partners\/[^/]+\/commission$/) && req.method === "PATCH") {
      void (async () => {
        const body = await parseBody(req);
        const state = readState();
        const partnerId = pathname.split("/")[4];
        const partner = state.partners.find((p) => p.id === partnerId);
        if (!partner) {
          sendJson(res, 404, { ok: false, error: "Partner not found" });
          return;
        }
        const commissionRate = Number(body.defaultCommissionRate || 0);
        partner.defaultCommissionRate = Number.isFinite(commissionRate)
          ? Math.min(0.5, Math.max(0, commissionRate))
          : partner.defaultCommissionRate;
        partner.updatedAt = nowIso();
        let createdCommission: CommissionRecord | undefined;
        if (body.createPayoutForEntityId && Number(body.amount || 0) > 0) {
          const commission: CommissionRecord = {
            id: id("com"),
            partnerId,
            relatedEntityType: "OPPORTUNITY",
            relatedEntityId: String(body.createPayoutForEntityId),
            amount: Number(body.amount),
            status: "PENDING",
            earnedAt: nowIso(),
            createdAt: nowIso(),
            updatedAt: nowIso(),
          };
          state.commissions.unshift(commission);
          createdCommission = commission;
          pushActivity(state, "PARTNER", partnerId, "COMMISSION_LINE_ADDED", {
            amount: commission.amount,
            relatedEntityId: commission.relatedEntityId,
          });
        }
        writeState(state);
        sendJson(res, 200, {
          ok: true,
          partner: sanitizePartnerAdmin(partner),
          ...(createdCommission ? { createdCommission } : {}),
        });
      })();
      return;
    }

    if (pathname === "/api/backoffice/testimonials" && req.method === "POST") {
      void (async () => {
        const body = await parseBody(req);
        const state = readState();
        const row: TestimonialRecord = {
          id: id("ts"),
          name: String(body.name || "").trim(),
          quote: String(body.quote || "").trim(),
          company: String(body.company || "").trim() || undefined,
          industry: String(body.industry || "").trim() || undefined,
          location: String(body.location || "").trim() || undefined,
          fundingAmount: Number(body.fundingAmount || 0) || undefined,
          businessType: String(body.businessType || "").trim() || undefined,
          isApproved: Boolean(body.isApproved),
          submittedAt: nowIso(),
          approvedAt: body.isApproved ? nowIso() : undefined,
        };
        state.testimonials.unshift(row);
        writeState(state);
        sendJson(res, 200, { ok: true, testimonial: row });
      })();
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/testimonials\/[^/]+\/approve$/) && req.method === "PATCH") {
      const state = readState();
      const testimonialId = pathname.split("/")[4];
      const row = state.testimonials.find((t) => t.id === testimonialId);
      if (!row) {
        sendJson(res, 404, { ok: false, error: "Testimonial not found" });
        return;
      }
      row.isApproved = true;
      row.approvedAt = nowIso();
      pushActivity(state, "TESTIMONIAL", row.id, "TESTIMONIAL_APPROVED", {});
      writeState(state);
      sendJson(res, 200, { ok: true, testimonial: row });
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/partners\/[^/]+$/) && req.method === "PATCH") {
      void (async () => {
        const body = await parseBody(req);
        const state = readState();
        const partnerId = pathname.split("/")[4];
        const partner = state.partners.find((p) => p.id === partnerId);
        if (!partner) {
          sendJson(res, 404, { ok: false, error: "Partner not found" });
          return;
        }
        if (typeof body.organizationName === "string") partner.organizationName = body.organizationName.trim();
        if (typeof body.contactName === "string") partner.contactName = body.contactName.trim();
        if (typeof body.email === "string") partner.email = body.email.trim() || undefined;
        if (typeof body.phone === "string") partner.phone = body.phone.trim() || undefined;
        if (typeof body.status === "string") partner.status = body.status.trim();
        if (typeof body.notes === "string") partner.notes = body.notes.trim() || undefined;
        if (typeof body.payoutTerms === "string") partner.payoutTerms = body.payoutTerms.trim() || undefined;
        if (typeof body.type === "string") partner.type = body.type as PartnerRecord["type"];
        if (body.defaultCommissionRate !== undefined) {
          const r = Number(body.defaultCommissionRate);
          partner.defaultCommissionRate = Number.isFinite(r)
            ? Math.min(0.5, Math.max(0, r))
            : partner.defaultCommissionRate;
        }
        partner.updatedAt = nowIso();
        pushActivity(state, "PARTNER", partnerId, "PARTNER_UPDATED", {});
        writeState(state);
        sendJson(res, 200, { ok: true, partner: sanitizePartnerAdmin(partner) });
      })();
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/partners\/[^/]+$/) && req.method === "DELETE") {
      const state = readState();
      const partnerId = pathname.split("/")[4];
      const idx = state.partners.findIndex((p) => p.id === partnerId);
      if (idx < 0) {
        sendJson(res, 404, { ok: false, error: "Partner not found" });
        return;
      }
      const removed = state.partners[idx]!;
      state.partners.splice(idx, 1);
      state.promoCodes = state.promoCodes.filter((p) => p.partnerId !== partnerId);
      state.commissions = state.commissions.filter((c) => c.partnerId !== partnerId);
      for (const lead of state.leads) {
        if (lead.partnerId === partnerId) {
          lead.partnerId = undefined;
          lead.updatedAt = nowIso();
        }
      }
      state.partnerSessions = (state.partnerSessions || []).filter((s) => s.partnerId !== partnerId);
      pushActivity(state, "PARTNER", partnerId, "PARTNER_REMOVED", {
        organizationName: removed.organizationName,
      });
      writeState(state);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/leads\/[^/]+$/) && req.method === "PATCH") {
      void (async () => {
        const body = await parseBody(req);
        const state = readState();
        const leadId = pathname.split("/")[4];
        const lead = state.leads.find((l) => l.id === leadId);
        if (!lead) {
          sendJson(res, 404, { ok: false, error: "Lead not found" });
          return;
        }
        const prevStatus = lead.status;
        if (typeof body.status === "string") lead.status = body.status;
        if (typeof body.partnerId === "string" || body.partnerId === null) {
          lead.partnerId = body.partnerId === null || body.partnerId === "" ? undefined : String(body.partnerId);
        }
        if (typeof body.assignedUserId === "string" || body.assignedUserId === null) {
          lead.assignedUserId =
            body.assignedUserId === null || body.assignedUserId === "" ? undefined : String(body.assignedUserId);
        }
        if (typeof body.notes === "string") {
          lead.notes = body.notes.trim() || undefined;
        }
        if (body.intakePayload && typeof body.intakePayload === "object") {
          lead.intakePayload = {
            ...lead.intakePayload,
            ...(body.intakePayload as Record<string, unknown>),
          };
        }
        if (typeof body.appendClientNote === "string" && body.appendClientNote.trim()) {
          type NoteEntry = { text: string; createdAt: string };
          const payload = lead.intakePayload as Record<string, unknown> & {
            clientNoteHistory?: NoteEntry[];
          };
          const existing = Array.isArray(payload.clientNoteHistory) ? payload.clientNoteHistory : [];
          lead.intakePayload = {
            ...lead.intakePayload,
            clientNoteHistory: [
              {
                text: body.appendClientNote.trim(),
                createdAt: nowIso(),
              },
              ...existing,
            ],
          };
        }
        lead.updatedAt = nowIso();
        let createdOpportunity: OpportunityRecord | undefined;
        let createdSubscription: SubscriptionEnrollmentRecord | undefined;
        let createdPartner: (PartnerRecord & { portalEnabled: boolean; invitePending: boolean }) | undefined;
        let portalAccessKeyFromLead: string | undefined;
        if (
          (lead.status === "Converted to Apply" || lead.status === "Apply") &&
          prevStatus !== lead.status
        ) {
          const oppIdsBefore = new Set(state.opportunities.filter((o) => o.leadId === lead.id).map((o) => o.id));
          ensureOpportunityForLead(state, lead);
          createdOpportunity = state.opportunities.find((o) => o.leadId === lead.id && !oppIdsBefore.has(o.id));
          pushActivity(state, "LEAD", leadId, "LEAD_CONVERTED_TO_APPLY", {});
        }
        if (
          (lead.status === "Converted to Pre-Qual" || lead.status === "Pre-Qualify") &&
          prevStatus !== lead.status
        ) {
          const subIdsBefore = new Set(state.subscriptions.filter((s) => s.leadId === lead.id).map((s) => s.id));
          ensureSubscriptionForLead(state, lead);
          createdSubscription = state.subscriptions.find((s) => s.leadId === lead.id && !subIdsBefore.has(s.id));
          pushActivity(state, "LEAD", leadId, "LEAD_CONVERTED_TO_PREQUAL", {});
        }
        if (lead.status === "Partner" && prevStatus !== "Partner") {
          const contact = state.contacts.find((c) => c.id === lead.contactId);
          if (contact && !lead.partnerId) {
            const existingByEmail = state.partners.find(
              (p) => (p.email || "").trim().toLowerCase() === contact.email.toLowerCase()
            );
            if (existingByEmail) {
              lead.partnerId = existingByEmail.id;
              lead.intakePayload = {
                ...lead.intakePayload,
                affiliatePartnerName: existingByEmail.organizationName,
              };
            } else {
              const code = generateReferralCode(state);
              const orgFromIntake = String(
                (lead.intakePayload as Record<string, unknown>).companyName || ""
              ).trim();
              const row: PartnerRecord = {
                id: id("partner"),
                type: "OTHER",
                organizationName: orgFromIntake || `${contact.firstName} ${contact.lastName}`.trim() || "Partner",
                contactName: `${contact.firstName} ${contact.lastName}`.trim(),
                email: contact.email,
                phone: contact.phone || undefined,
                status: "ACTIVE",
                referralCode: code,
                defaultCommissionRate: 0.03,
                createdAt: nowIso(),
                updatedAt: nowIso(),
              };
              const accessKey = assignPortalKeyToPartner(state, row);
              state.partners.unshift(row);
              lead.partnerId = row.id;
              lead.intakePayload = {
                ...lead.intakePayload,
                affiliatePartnerName: row.organizationName,
                createdPartnerFromLeadAt: nowIso(),
              };
              createdPartner = sanitizePartnerAdmin(row);
              portalAccessKeyFromLead = accessKey;
              pushActivity(state, "PARTNER", row.id, "PARTNER_CREATED", { fromLeadId: lead.id });
            }
          }
        }
        pushActivity(state, "LEAD", leadId, "LEAD_UPDATED", { status: lead.status });
        writeState(state);
        sendJson(res, 200, {
          ok: true,
          lead,
          ...(createdOpportunity ? { createdOpportunity } : {}),
          ...(createdSubscription ? { createdSubscription } : {}),
          ...(createdPartner ? { createdPartner } : {}),
          ...(portalAccessKeyFromLead ? { portalAccessKey: portalAccessKeyFromLead } : {}),
        });
      })();
      return;
    }

    if (pathname === "/api/backoffice/opportunities" && req.method === "POST") {
      void (async () => {
        const body = await parseBody(req);
        const state = readState();
        const leadId = String(body.leadId || "").trim();
        const lead = state.leads.find((l) => l.id === leadId);
        if (!lead) {
          sendJson(res, 404, { ok: false, error: "Lead not found" });
          return;
        }
        const row: OpportunityRecord = {
          id: id("opp"),
          leadId,
          stage: String(body.stage || "Application Submitted").trim(),
          requestedAmount: Number(body.requestedAmount || 0) || undefined,
          fundingType: String(body.fundingType || "").trim() || undefined,
          externalTrackingNotes: String(body.externalTrackingNotes || "").trim() || undefined,
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        state.opportunities.unshift(row);
        pushActivity(state, "OPPORTUNITY", row.id, "OPPORTUNITY_CREATED", { leadId });
        writeState(state);
        sendJson(res, 200, { ok: true, opportunity: row });
      })();
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/leads\/[^/]+$/) && req.method === "DELETE") {
      const state = readState();
      const leadId = pathname.split("/")[4];
      const leadIdx = state.leads.findIndex((l) => l.id === leadId);
      if (leadIdx < 0) {
        sendJson(res, 404, { ok: false, error: "Lead not found" });
        return;
      }
      // Contacts and partner records are intentionally preserved; only the lead row and its pipeline are removed.
      const linkedOppIds = new Set(state.opportunities.filter((o) => o.leadId === leadId).map((o) => o.id));
      state.leads.splice(leadIdx, 1);
      state.opportunities = state.opportunities.filter((o) => o.leadId !== leadId);
      state.fundingRecords = state.fundingRecords.filter((f) => !linkedOppIds.has(f.opportunityId));
      state.consultations = state.consultations.filter((c) => c.leadId !== leadId);
      state.subscriptions = state.subscriptions.filter((s) => s.leadId !== leadId);
      state.commissions = state.commissions.filter(
        (c) => !(c.relatedEntityType === "LEAD" && c.relatedEntityId === leadId) &&
          !(c.relatedEntityType === "OPPORTUNITY" && linkedOppIds.has(c.relatedEntityId))
      );
      pushActivity(state, "LEAD", leadId, "LEAD_DELETED", { cascadeOppCount: linkedOppIds.size });
      writeState(state);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/opportunities\/[^/]+$/) && req.method === "PATCH") {
      void (async () => {
        const body = await parseBody(req);
        const state = readState();
        const oppId = pathname.split("/")[4];
        const opp = state.opportunities.find((o) => o.id === oppId);
        if (!opp) {
          sendJson(res, 404, { ok: false, error: "Opportunity not found" });
          return;
        }
        if (typeof body.stage === "string") opp.stage = body.stage;
        if (body.requestedAmount !== undefined) {
          const n = Number(body.requestedAmount);
          opp.requestedAmount = Number.isFinite(n) ? n : opp.requestedAmount;
        }
        if (typeof body.fundingType === "string" || body.fundingType === null) {
          opp.fundingType =
            body.fundingType === null || body.fundingType === "" ? undefined : String(body.fundingType);
        }
        if (typeof body.externalTrackingNotes === "string") {
          opp.externalTrackingNotes = body.externalTrackingNotes.trim() || undefined;
        }
        opp.updatedAt = nowIso();
        const lead = state.leads.find((l) => l.id === opp.leadId);
        if (lead && typeof body.stage === "string") {
          lead.status = body.stage;
          lead.updatedAt = nowIso();
        }
        pushActivity(state, "OPPORTUNITY", oppId, "OPPORTUNITY_UPDATED", { stage: opp.stage });
        writeState(state);
        sendJson(res, 200, { ok: true, opportunity: opp });
      })();
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/subscriptions\/[^/]+$/) && req.method === "PATCH") {
      void (async () => {
        const body = await parseBody(req);
        const state = readState();
        const subId = pathname.split("/")[4];
        const row = state.subscriptions.find((s) => s.id === subId);
        if (!row) {
          sendJson(res, 404, { ok: false, error: "Subscription not found" });
          return;
        }
        if (typeof body.planName === "string") row.planName = body.planName.trim() || row.planName;
        if (typeof body.subscriptionStatus === "string") row.subscriptionStatus = body.subscriptionStatus.trim();
        if (typeof body.paymentStatus === "string") row.paymentStatus = body.paymentStatus.trim();
        if (typeof body.billingStatus === "string") row.billingStatus = body.billingStatus.trim();
        if (typeof body.notes === "string") row.notes = body.notes.trim() || undefined;
        row.updatedAt = nowIso();
        pushActivity(state, "SUBSCRIPTION", row.id, "SUBSCRIPTION_UPDATED", { status: row.subscriptionStatus });
        writeState(state);
        sendJson(res, 200, { ok: true, subscription: row });
      })();
      return;
    }

    if (pathname === "/api/backoffice/funding-records" && req.method === "POST") {
      void (async () => {
        const body = await parseBody(req);
        const state = readState();
        const opportunityId = String(body.opportunityId || "");
        const opp = state.opportunities.find((o) => o.id === opportunityId);
        if (!opp) {
          sendJson(res, 404, { ok: false, error: "Opportunity not found" });
          return;
        }
        const row: FundingRecord = {
          id: id("fund"),
          opportunityId,
          approvedAmount: Number(body.approvedAmount || 0) || undefined,
          fundedAmount: Number(body.fundedAmount || 0) || undefined,
          commissionAmount: Number(body.commissionAmount || 0) || undefined,
          fundingProductType: String(body.fundingProductType || "").trim() || opp.fundingType || undefined,
          lenderName: String(body.lenderName || "").trim() || undefined,
          fundingDate: String(body.fundingDate || "").trim() || undefined,
          commissionStatus: (body.commissionStatus as FundingRecord["commissionStatus"]) || "PENDING",
          notes: String(body.notes || "").trim() || undefined,
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        state.fundingRecords.unshift(row);
        pushActivity(state, "FUNDING", row.id, "FUNDING_RECORD_CREATED", { opportunityId });
        writeState(state);
        sendJson(res, 200, { ok: true, fundingRecord: row });
      })();
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/funding-records\/[^/]+$/) && req.method === "PATCH") {
      void (async () => {
        const body = await parseBody(req);
        const state = readState();
        const frId = pathname.split("/")[4];
        const row = state.fundingRecords.find((f) => f.id === frId);
        if (!row) {
          sendJson(res, 404, { ok: false, error: "Funding record not found" });
          return;
        }
        if (body.approvedAmount !== undefined) {
          const n = Number(body.approvedAmount);
          row.approvedAmount = Number.isFinite(n) ? n : row.approvedAmount;
        }
        if (body.fundedAmount !== undefined) {
          const n = Number(body.fundedAmount);
          row.fundedAmount = Number.isFinite(n) ? n : row.fundedAmount;
        }
        if (body.commissionAmount !== undefined) {
          const n = Number(body.commissionAmount);
          row.commissionAmount = Number.isFinite(n) ? n : row.commissionAmount;
        }
        if (typeof body.lenderName === "string") row.lenderName = body.lenderName.trim() || undefined;
        if (typeof body.fundingDate === "string") row.fundingDate = body.fundingDate.trim() || undefined;
        if (typeof body.commissionStatus === "string") {
          row.commissionStatus = body.commissionStatus as FundingRecord["commissionStatus"];
        }
        if (typeof body.notes === "string") row.notes = body.notes.trim() || undefined;
        if (typeof body.fundingProductType === "string") {
          row.fundingProductType = body.fundingProductType.trim() || undefined;
        }
        row.updatedAt = nowIso();
        pushActivity(state, "FUNDING", frId, "FUNDING_RECORD_UPDATED", {});
        writeState(state);
        sendJson(res, 200, { ok: true, fundingRecord: row });
      })();
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/commissions\/[^/]+$/) && req.method === "PATCH") {
      void (async () => {
        const body = await parseBody(req);
        const state = readState();
        const comId = pathname.split("/")[4];
        const row = state.commissions.find((c) => c.id === comId);
        if (!row) {
          sendJson(res, 404, { ok: false, error: "Commission not found" });
          return;
        }
        if (body.amount !== undefined) {
          const n = Number(body.amount);
          row.amount = Number.isFinite(n) ? n : row.amount;
        }
        if (typeof body.status === "string") {
          row.status = body.status as CommissionRecord["status"];
          if (row.status === "PAID") row.paidAt = nowIso();
        }
        if (typeof body.notes === "string") row.notes = body.notes.trim() || undefined;
        row.updatedAt = nowIso();
        pushActivity(state, "COMMISSION", comId, "COMMISSION_UPDATED", { status: row.status, amount: row.amount });
        writeState(state);
        sendJson(res, 200, { ok: true, commission: row });
      })();
      return;
    }

    if (pathname.match(/^\/api\/backoffice\/testimonials\/[^/]+$/) && req.method === "PATCH") {
      void (async () => {
        const body = await parseBody(req);
        const state = readState();
        const testimonialId = pathname.split("/")[4];
        const row = state.testimonials.find((t) => t.id === testimonialId);
        if (!row) {
          sendJson(res, 404, { ok: false, error: "Testimonial not found" });
          return;
        }
        if (typeof body.name === "string") row.name = body.name.trim();
        if (typeof body.quote === "string") row.quote = body.quote.trim();
        if (typeof body.company === "string") row.company = body.company.trim() || undefined;
        if (typeof body.industry === "string") row.industry = body.industry.trim() || undefined;
        if (typeof body.location === "string") row.location = body.location.trim() || undefined;
        if (body.fundingAmount !== undefined) {
          const n = Number(body.fundingAmount);
          row.fundingAmount = Number.isFinite(n) ? n : undefined;
        }
        if (typeof body.businessType === "string") row.businessType = body.businessType.trim() || undefined;
        if (typeof body.isApproved === "boolean") {
          row.isApproved = body.isApproved;
          row.approvedAt = body.isApproved ? nowIso() : undefined;
        }
        pushActivity(state, "TESTIMONIAL", testimonialId, "TESTIMONIAL_EDITED", {});
        writeState(state);
        sendJson(res, 200, { ok: true, testimonial: row });
      })();
      return;
    }

    sendJson(res, 404, { ok: false, error: "Back office route not found" });
  });
}
