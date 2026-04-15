export type CtaType = "APPLY" | "PREQUAL" | "CONSULT" | "PARTNER";

export type CommissionStatus = "PENDING" | "RECEIVED" | "PAID" | "NOT_APPLICABLE";

export type PartnerType =
  | "ACCELERATOR_INCUBATOR"
  | "BUSINESS_CONSULTANT_COACH"
  | "ACCOUNTANT_BOOKKEEPER"
  | "ATTORNEY"
  | "BANK_LENDER"
  | "INVESTOR_VC_ANGEL"
  | "ECONOMIC_DEV_NONPROFIT"
  | "COWORKING_OPERATOR"
  | "AGENCY_SERVICE_PROVIDER"
  | "OTHER"
  | "ENTREPRENEUR_CENTER"
  | "COMMUNITY_ORG"
  | "AFFILIATE"
  | "INTERNAL_MANUAL";

/** Qualification data from public partner registration (CRM / routing). */
export interface PartnerIntakePayload {
  roleTitle?: string;
  clientSegments?: string[];
  fundingNeedFrequency?: string;
  partnershipInterest?: string;
  estimatedReferralsPerMonth?: string;
  currentClientGap?: string;
  additionalNotes?: string;
  source_page?: string;
  entry_cta?: string;
  partner_type_preselected?: string;
  utm_source?: string;
  utm_campaign?: string;
  referral_partner?: string;
}

export interface ContactRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleTitle?: string;
  source?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BusinessRecord {
  id: string;
  name: string;
  legalName?: string;
  entityType?: string;
  industry?: string;
  website?: string;
  annualRevenue?: number;
  timeInBusiness?: string;
  city?: string;
  state?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadRecord {
  id: string;
  contactId: string;
  businessId?: string;
  ctaType: CtaType;
  sourceType: string;
  sourceDetail: string;
  partnerId?: string;
  status: string;
  notes?: string;
  assignedUserId?: string;
  intakePayload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityRecord {
  id: string;
  leadId: string;
  stage: string;
  requestedAmount?: number;
  fundingType?: string;
  externalTrackingNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FundingRecord {
  id: string;
  opportunityId: string;
  approvedAmount?: number;
  fundedAmount?: number;
  commissionAmount?: number;
  /** Product / structure label for funding history rows (e.g. Term Loan). */
  fundingProductType?: string;
  lenderName?: string;
  fundingDate?: string;
  commissionStatus: CommissionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionEnrollmentRecord {
  id: string;
  leadId: string;
  planName: string;
  billingStatus: string;
  paymentStatus: string;
  subscriptionStatus: string;
  startedAt?: string;
  inviteSentAt?: string;
  inviteStatus: string;
  externalSystemStatus?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationRecord {
  id: string;
  leadId: string;
  /** Partner-facing workshop type (e.g. Model & Offer). */
  workshopType?: string;
  /** Partner-facing workshop delivery mode. */
  deliveryMode?: "1:1" | "Cohort";
  scheduledAt?: string;
  confirmedAt?: string;
  completedAt?: string;
  attendanceStatus: string;
  recommendationType?: string;
  outcomeNotes?: string;
  nextAction?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerRecord {
  id: string;
  type: PartnerType;
  organizationName: string;
  contactName: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  referralCode?: string;
  payoutTerms?: string;
  status: string;
  notes?: string;
  /** Light qualification from partner registration (self-serve or invite completion). */
  partnerIntake?: PartnerIntakePayload;
  defaultCommissionRate?: number;
  /** scrypt hash (hex) of portal access key; set when admin generates a key */
  portalKeyHash?: string;
  /** salt for portal key (hex) */
  portalKeySalt?: string;
  portalKeyCreatedAt?: string;
  /** Set after partner chooses a password (hashed on server) */
  passwordHash?: string;
  passwordSalt?: string;
  passwordSetAt?: string;
  /** Set only in admin API responses (secrets are never returned) */
  portalEnabled?: boolean;
  /** Admin API: invite link is valid and not yet completed */
  invitePending?: boolean;
  inviteToken?: string;
  inviteExpiresAt?: string;
  /** One-time partner claim link (hashed token only, never exposed). */
  claimTokenHash?: string;
  claimTokenSalt?: string;
  claimTokenIssuedAt?: string;
  claimTokenExpiresAt?: string;
  claimClaimedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionRecord {
  id: string;
  partnerId: string;
  relatedEntityType: "LEAD" | "OPPORTUNITY" | "SUBSCRIPTION";
  relatedEntityId: string;
  amount: number;
  status: "PENDING" | "RECEIVED" | "PAID";
  earnedAt?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialRecord {
  id: string;
  name: string;
  company?: string;
  industry?: string;
  location?: string;
  quote: string;
  fundingAmount?: number;
  businessType?: string;
  isApproved: boolean;
  submittedAt: string;
  approvedAt?: string;
}

export interface SiteMetricConfig {
  totalFundingDisplayValue: number;
  totalFundingUnit: "M" | "K";
  dealsSourcedValue: number;
  dealsSourcedSuffix: string;
  businessesFundedValue: number;
  businessesFundedSuffix: string;
  foundersSupportedValue: number;
  foundersSupportedSuffix: string;
  equityTakenValue: number;
  configMode: "MANUAL" | "AUTO" | "HYBRID";
}

export interface PromoCodeRecord {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "AMOUNT";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  applicablePlan?: string;
  active: boolean;
  usageLimit?: number;
  usageCount: number;
  startsAt?: string;
  expiresAt?: string;
  partnerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogRecord {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  metadata?: Record<string, unknown>;
  actorUserId?: string;
  createdAt: string;
}

export interface BackOfficeState {
  contacts: ContactRecord[];
  businesses: BusinessRecord[];
  leads: LeadRecord[];
  opportunities: OpportunityRecord[];
  fundingRecords: FundingRecord[];
  subscriptions: SubscriptionEnrollmentRecord[];
  consultations: ConsultationRecord[];
  partners: PartnerRecord[];
  commissions: CommissionRecord[];
  testimonials: TestimonialRecord[];
  promoCodes: PromoCodeRecord[];
  activities: ActivityLogRecord[];
  siteMetricConfig: SiteMetricConfig;
  adminTokens: { token: string; createdAt: string }[];
  partnerSessions: { token: string; partnerId: string; createdAt: string }[];
}
