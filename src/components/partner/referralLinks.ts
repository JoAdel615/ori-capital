export function referralApplyUrl(code: string) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/referral?ref=${encodeURIComponent(code)}`;
}

export function referralSolutionUrl(code: string, solution: "consulting" | "management" | "funding_readiness") {
  if (typeof window === "undefined") return "";
  const base = `${window.location.origin}/referral?ref=${encodeURIComponent(code)}`;
  return `${base}&solution=${encodeURIComponent(solution)}`;
}
