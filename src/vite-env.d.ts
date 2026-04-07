/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional origin for all /api/* calls when the SPA is static (e.g. https://api.oricapitalholdings.com). No trailing slash. */
  readonly VITE_API_ORIGIN?: string;
  readonly VITE_ECRYPT_TOKENIZATION_KEY?: string;
  /** Public Calendly event URL for iframe/widget embeds only */
  readonly VITE_CALENDLY_URL?: string;
  /** Optional absolute URL to POST JSON client error payloads (CORS must allow your origin). */
  readonly VITE_CLIENT_ERROR_REPORT_URL?: string;
  /** GA4 measurement ID (e.g. G-XXXXXXXX). Loaded only when set and valid. */
  readonly VITE_GA_MEASUREMENT_ID?: string;
  /** Meta Pixel ID (numeric). Loaded only when set and valid. */
  readonly VITE_META_PIXEL_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** eCrypt Collect.js (loaded from https://ecrypt.transactiongateway.com/token/Collect.js) */
interface EcryptCollectJsResponse {
  tokenType: string;
  token: string;
  initiatedBy?: Event;
  card?: {
    number: string;
    bin: string;
    exp: string;
    hash: string;
    type: string;
  };
}

interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  /** Optional host script: receive client error payloads from the error boundary. */
  __ORI_REPORT_CLIENT_ERROR__?: (payload: {
    message: string;
    stack?: string;
    componentStack: string;
    path: string;
    mode: string;
  }) => void;
  Calendly?: {
    initInlineWidget: (opts: {
      url: string;
      parentElement: HTMLElement;
      prefill?: Record<string, unknown>;
      utm?: Record<string, unknown>;
    }) => void;
  };
  CollectJS?: {
    configure: (opts: {
      variant?: string;
      callback?: (response: EcryptCollectJsResponse) => void;
      [key: string]: unknown;
    }) => void;
    startPaymentRequest: (event?: Event) => void;
    clearInputs?: () => void;
  };
}
