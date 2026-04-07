export function logIntegration(event: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "development") {
    console.info(`[integrations] ${event}`, payload);
  }
}
