import { config } from "../config";

export type ClientErrorPayload = {
  message: string;
  stack?: string;
  componentStack: string;
  path: string;
  mode: string;
};

/**
 * Fire-and-forget client error reporting: console in dev, optional window hook, optional POST.
 * Does not rethrow; safe from error boundaries and unload.
 */
export function reportClientError(opts: { error: Error; componentStack: string }): void {
  const payload: ClientErrorPayload = {
    message: opts.error.message,
    stack: opts.error.stack,
    componentStack: opts.componentStack,
    path:
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : "",
    mode: import.meta.env.MODE,
  };

  if (import.meta.env.DEV && import.meta.env.MODE !== "test") {
    console.error("[Ori client error]", payload, opts.error);
  }

  if (typeof window !== "undefined") {
    try {
      window.__ORI_REPORT_CLIENT_ERROR__?.(payload);
    } catch {
      /* host hook must not break the app */
    }
  }

  const url = config.clientErrorReportUrl;
  if (!url) return;

  const body = JSON.stringify({
    ...payload,
    siteUrl: config.siteUrl,
  });

  try {
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      mode: "cors",
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
