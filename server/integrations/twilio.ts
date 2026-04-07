import { logIntegration } from "./log.js";

/**
 * Best-effort E.164 for US-heavy intake; returns null if unusable.
 */
export function normalizePhoneToE164(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (t.startsWith("+")) {
    const digits = t.slice(1).replace(/\D/g, "");
    if (digits.length >= 10 && digits.length <= 15) return `+${digits}`;
    return null;
  }
  const digits = t.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

function twilioBasicAuth(): string | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  if (!accountSid) return null;
  const keySid = process.env.TWILIO_API_KEY_SID?.trim();
  const keySecret = process.env.TWILIO_API_KEY_SECRET?.trim();
  if (keySid && keySecret) {
    return Buffer.from(`${keySid}:${keySecret}`).toString("base64");
  }
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  if (!token) return null;
  return Buffer.from(`${accountSid}:${token}`).toString("base64");
}

export function twilioSmsReady(): boolean {
  if (!process.env.TWILIO_ACCOUNT_SID?.trim()) return false;
  const hasClassic = Boolean(process.env.TWILIO_AUTH_TOKEN?.trim());
  const hasApiKey = Boolean(
    process.env.TWILIO_API_KEY_SID?.trim() && process.env.TWILIO_API_KEY_SECRET?.trim()
  );
  if (!hasClassic && !hasApiKey) return false;
  const from = process.env.TWILIO_FROM_NUMBER?.trim();
  const msid = process.env.TWILIO_MESSAGING_SERVICE_SID?.trim();
  return Boolean(from || msid);
}

export type TwilioSendResult =
  | { ok: true; sid?: string }
  | { ok: false; error: string; status?: number };

export async function twilioSendSms(toE164: string, body: string): Promise<TwilioSendResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const basic = twilioBasicAuth();
  if (!accountSid || !basic) {
    return { ok: false, error: "twilio_not_configured" };
  }
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID?.trim();
  const from = process.env.TWILIO_FROM_NUMBER?.trim();
  if (!messagingServiceSid && !from) {
    return { ok: false, error: "twilio_missing_from" };
  }

  const params = new URLSearchParams();
  params.set("To", toE164);
  params.set("Body", body);
  if (messagingServiceSid) params.set("MessagingServiceSid", messagingServiceSid);
  else params.set("From", from!);

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = (await res.json().catch(() => ({}))) as { sid?: string; message?: string; code?: number };
    if (!res.ok) {
      logIntegration("TWILIO_ERROR", {
        status: res.status,
        message: data.message || res.statusText,
      });
      return { ok: false, error: data.message || "twilio_request_failed", status: res.status };
    }
    logIntegration("TWILIO_SMS_OK", { sid: data.sid });
    return { ok: true, sid: data.sid };
  } catch (err) {
    logIntegration("TWILIO_ERROR", { error: String(err) });
    return { ok: false, error: String(err) };
  }
}
