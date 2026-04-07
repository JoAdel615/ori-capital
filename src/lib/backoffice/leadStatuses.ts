/** Pipeline statuses for lead routing in Back Office (shared across Leads and Clients). */
export const BACKOFFICE_LEAD_PIPELINE = ["None", "Apply", "Pre-Qualify", "Partner"] as const;

export const BACKOFFICE_LEAD_COMPLETE = "Complete";

export function leadPipelineSelectOptions(currentStatus: string): string[] {
  const pipeline = [...BACKOFFICE_LEAD_PIPELINE] as string[];
  const inPipeline = pipeline.includes(currentStatus);
  const head =
    currentStatus && !inPipeline && currentStatus !== BACKOFFICE_LEAD_COMPLETE ? [currentStatus] : [];
  return [...head, ...pipeline, BACKOFFICE_LEAD_COMPLETE];
}

/** @deprecated Use BACKOFFICE_LEAD_PIPELINE — kept for tests and gradual migration. */
export const LEAD_STATUS_OPTIONS: Record<string, string[]> = {
  CONSULT: [...BACKOFFICE_LEAD_PIPELINE],
  APPLY: [...BACKOFFICE_LEAD_PIPELINE],
  PREQUAL: [...BACKOFFICE_LEAD_PIPELINE],
  PARTNER: [...BACKOFFICE_LEAD_PIPELINE],
};

export function leadStatusOptionsForCta(_cta: string): string[] {
  return [...BACKOFFICE_LEAD_PIPELINE];
}

export const OPPORTUNITY_STAGE_OPTIONS = [
  "New Applicant",
  "Application Submitted",
  "Under Review",
  "Approved (Pending Details)",
  "Funded",
  "Declined",
  "Nurture / Retry Later",
] as const;

export const PARTNER_STATUS_OPTIONS = ["ACTIVE", "INVITED", "SUSPENDED", "ARCHIVED"] as const;
