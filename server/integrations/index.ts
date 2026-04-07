/**
 * External provider hooks — env-driven; safe no-ops when keys are unset.
 * Wire real SDKs here without changing API route shapes.
 */

export { logIntegration } from "./log.js";
export {
  mailchimpMarketingReady,
  mailchimpSubscribe,
  mailchimpSubscriberHash,
} from "./mailchimp.js";
export { twilioSendSms, twilioSmsReady, normalizePhoneToE164 } from "./twilio.js";

const truthy = (v: string | undefined) => v === "1" || v?.toLowerCase() === "true";

/** True when Mailchimp API key + server prefix are set (audience may still be missing). */
export function mailchimpEnabled(): boolean {
  return Boolean(process.env.MAILCHIMP_API_KEY?.trim() && process.env.MAILCHIMP_SERVER_PREFIX?.trim());
}

export function twilioEnabled(): boolean {
  return Boolean(process.env.TWILIO_ACCOUNT_SID?.trim() && process.env.TWILIO_AUTH_TOKEN?.trim());
}

export function calendlyEnabled(): boolean {
  return truthy(process.env.CALENDLY_INTEGRATION_ENABLED) && Boolean(process.env.CALENDLY_TOKEN?.trim());
}
