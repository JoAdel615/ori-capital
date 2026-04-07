import { apiUrl } from "../apiBase";
import type { SiteMetricConfig } from "../backoffice/types";

export type PublicTestimonialCard = {
  name: string;
  quote: string;
  company?: string;
  industry?: string;
  location?: string;
  fundingAmount?: number;
  businessType?: string;
};

export type PublicSiteContent = {
  ok: boolean;
  siteMetricConfig: SiteMetricConfig;
  approvedTestimonialFundingDollars: number;
  mainFundingDisplayValue: number;
  mainFundingUnit: "M" | "K";
  testimonialsForHomepage: PublicTestimonialCard[];
};

export async function fetchPublicSiteContent(): Promise<PublicSiteContent | null> {
  try {
    const res = await fetch(apiUrl("/api/public/site-content"), { method: "GET" });
    if (!res.ok) return null;
    const data = (await res.json()) as PublicSiteContent;
    return data.ok ? data : null;
  } catch {
    return null;
  }
}
