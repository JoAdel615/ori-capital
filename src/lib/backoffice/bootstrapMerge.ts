import type { BackOfficeBootstrap } from "./bootstrapTypes";
import type {
  CommissionRecord,
  ContactRecord,
  FundingRecord,
  LeadRecord,
  OpportunityRecord,
  PartnerRecord,
  PromoCodeRecord,
  SiteMetricConfig,
  SubscriptionEnrollmentRecord,
  TestimonialRecord,
} from "./types";

export function mergeLead(b: BackOfficeBootstrap, lead: LeadRecord): BackOfficeBootstrap {
  const exists = b.leads.some((l) => l.id === lead.id);
  return {
    ...b,
    leads: exists ? b.leads.map((l) => (l.id === lead.id ? lead : l)) : [lead, ...b.leads],
  };
}

/** After PATCH /leads — merges lead plus any opportunity/subscription/partner created on conversion. */
export function mergeLeadPatchResponse(
  b: BackOfficeBootstrap,
  res: {
    lead: LeadRecord;
    createdOpportunity?: OpportunityRecord;
    createdSubscription?: SubscriptionEnrollmentRecord;
    createdPartner?: PartnerRecord;
  }
): BackOfficeBootstrap {
  let next = mergeLead(b, res.lead);
  if (res.createdOpportunity) next = mergeOpportunity(next, res.createdOpportunity);
  if (res.createdSubscription) next = mergeSubscription(next, res.createdSubscription);
  if (res.createdPartner) next = mergePartner(next, res.createdPartner);
  return next;
}

export function mergeContact(b: BackOfficeBootstrap, contact: ContactRecord): BackOfficeBootstrap {
  const exists = b.contacts.some((c) => c.id === contact.id);
  return {
    ...b,
    contacts: exists ? b.contacts.map((c) => (c.id === contact.id ? contact : c)) : [contact, ...b.contacts],
  };
}

export function mergePartner(b: BackOfficeBootstrap, partner: PartnerRecord): BackOfficeBootstrap {
  const exists = b.partners.some((p) => p.id === partner.id);
  return {
    ...b,
    partners: exists ? b.partners.map((p) => (p.id === partner.id ? partner : p)) : [partner, ...b.partners],
  };
}

export function mergeCommission(b: BackOfficeBootstrap, row: CommissionRecord): BackOfficeBootstrap {
  const exists = b.commissions.some((c) => c.id === row.id);
  return {
    ...b,
    commissions: exists ? b.commissions.map((c) => (c.id === row.id ? row : c)) : [row, ...b.commissions],
  };
}

export function mergeOpportunity(b: BackOfficeBootstrap, opp: OpportunityRecord): BackOfficeBootstrap {
  const exists = b.opportunities.some((o) => o.id === opp.id);
  return {
    ...b,
    opportunities: exists ? b.opportunities.map((o) => (o.id === opp.id ? opp : o)) : [opp, ...b.opportunities],
  };
}

export function mergeFundingRecord(b: BackOfficeBootstrap, fr: FundingRecord): BackOfficeBootstrap {
  const exists = b.fundingRecords.some((f) => f.id === fr.id);
  return {
    ...b,
    fundingRecords: exists ? b.fundingRecords.map((f) => (f.id === fr.id ? fr : f)) : [fr, ...b.fundingRecords],
  };
}

export function mergeSubscription(b: BackOfficeBootstrap, sub: SubscriptionEnrollmentRecord): BackOfficeBootstrap {
  const exists = b.subscriptions.some((s) => s.id === sub.id);
  return {
    ...b,
    subscriptions: exists ? b.subscriptions.map((s) => (s.id === sub.id ? sub : s)) : [sub, ...b.subscriptions],
  };
}

export function mergePromoCode(b: BackOfficeBootstrap, pc: PromoCodeRecord): BackOfficeBootstrap {
  const exists = b.promoCodes.some((p) => p.id === pc.id);
  return {
    ...b,
    promoCodes: exists ? b.promoCodes.map((p) => (p.id === pc.id ? pc : p)) : [pc, ...b.promoCodes],
  };
}

export function mergeTestimonial(b: BackOfficeBootstrap, t: TestimonialRecord): BackOfficeBootstrap {
  const exists = b.testimonials.some((x) => x.id === t.id);
  return {
    ...b,
    testimonials: exists ? b.testimonials.map((x) => (x.id === t.id ? t : x)) : [t, ...b.testimonials],
  };
}

export function mergeSiteMetricConfig(b: BackOfficeBootstrap, siteMetricConfig: SiteMetricConfig): BackOfficeBootstrap {
  return { ...b, siteMetricConfig };
}

/**
 * Mirrors server cascade when a lead is deleted.
 * Partner organizations and contacts are not removed — only this lead and its pipeline rows.
 */
export function removeLeadCascade(b: BackOfficeBootstrap, leadId: string): BackOfficeBootstrap {
  const oppIds = new Set(b.opportunities.filter((o) => o.leadId === leadId).map((o) => o.id));
  return {
    ...b,
    leads: b.leads.filter((l) => l.id !== leadId),
    opportunities: b.opportunities.filter((o) => o.leadId !== leadId),
    fundingRecords: b.fundingRecords.filter((f) => !oppIds.has(f.opportunityId)),
    subscriptions: b.subscriptions.filter((s) => s.leadId !== leadId),
    commissions: b.commissions.filter(
      (c) =>
        !(
          (c.relatedEntityType === "LEAD" && c.relatedEntityId === leadId) ||
          (c.relatedEntityType === "OPPORTUNITY" && oppIds.has(c.relatedEntityId))
        )
    ),
  };
}

export function removePromoCode(b: BackOfficeBootstrap, promoId: string): BackOfficeBootstrap {
  return { ...b, promoCodes: b.promoCodes.filter((p) => p.id !== promoId) };
}

/** After DELETE /api/backoffice/partners/:id — mirrors server cascade (client bootstrap only). */
export function removePartnerCascade(b: BackOfficeBootstrap, partnerId: string): BackOfficeBootstrap {
  return {
    ...b,
    partners: b.partners.filter((p) => p.id !== partnerId),
    promoCodes: b.promoCodes.filter((pc) => pc.partnerId !== partnerId),
    commissions: b.commissions.filter((c) => c.partnerId !== partnerId),
    leads: b.leads.map((l) =>
      l.partnerId === partnerId ? { ...l, partnerId: undefined, updatedAt: l.updatedAt } : l
    ),
  };
}
