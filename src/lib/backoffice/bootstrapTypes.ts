import type {
  ActivityLogRecord,
  CommissionRecord,
  ConsultationRecord,
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

export type DashboardSnapshot = {
  totalLeads: number;
  leadsByCta: Record<string, number>;
  fundedVolume: number;
  commissionRevenue: number;
  activeSubscriptions: number;
  partnerLeaderboard: {
    partnerId: string;
    name: string;
    leads: number;
    commissionsOwed: number;
  }[];
  recentActivity: ActivityLogRecord[];
};

export type BackOfficeBootstrap = {
  ok: boolean;
  dashboard: DashboardSnapshot;
  leads: LeadRecord[];
  contacts: ContactRecord[];
  opportunities: OpportunityRecord[];
  fundingRecords: FundingRecord[];
  subscriptions: SubscriptionEnrollmentRecord[];
  consultations: ConsultationRecord[];
  partners: PartnerRecord[];
  commissions: CommissionRecord[];
  promoCodes: PromoCodeRecord[];
  testimonials: TestimonialRecord[];
  siteMetricConfig: SiteMetricConfig;
};
