import { logIntegration } from "./log.js";
import { mailchimpSubscribe } from "./mailchimp.js";
import { normalizePhoneToE164, twilioSendSms, twilioSmsReady } from "./twilio.js";

function fire(p: Promise<void>): void {
  void p.catch((err) => console.error("[integrations] async hook failed", err));
}

const SMS_CONFIRM =
  process.env.TWILIO_PREQUAL_SMS_BODY?.trim() ||
  "Ori Capital: You're signed up for SMS updates about your application. Reply STOP to opt out. Msg & data rates may apply.";

export function afterPrequalifyOrApply(body: Record<string, unknown>): void {
  fire(
    (async () => {
      const email = String(body.email || "").trim();
      const firstName = String(body.firstName || "").trim();
      const lastName = String(body.lastName || "").trim();
      const phone = String(body.phone || "").trim();
      await mailchimpSubscribe({
        email,
        firstName,
        lastName,
        phone,
        tags: ["prequal", "apply"],
      });

      const consentSms = body.consentSms === true;
      if (!consentSms || !twilioSmsReady()) {
        if (consentSms && !twilioSmsReady()) {
          logIntegration("TWILIO_SKIP", { reason: "sms_not_fully_configured", context: "prequal_sms_opt_in" });
        }
        return;
      }
      const e164 = normalizePhoneToE164(phone);
      if (!e164) {
        logIntegration("TWILIO_SKIP", { reason: "invalid_phone", context: "prequal_sms_opt_in" });
        return;
      }
      await twilioSendSms(e164, SMS_CONFIRM);
    })()
  );
}

export function afterContactIntake(body: Record<string, unknown>): void {
  fire(
    (async () => {
      const fullName = String(body.name || "").trim();
      const [firstName, ...rest] = fullName.split(/\s+/).filter(Boolean);
      await mailchimpSubscribe({
        email: String(body.email || "").trim(),
        firstName: firstName || undefined,
        lastName: rest.join(" ") || undefined,
        phone: String(body.phone || "").trim() || undefined,
        tags: ["contact"],
      });
    })()
  );
}

export function afterNewsletterSignup(email: string): void {
  fire(
    (async () => {
      await mailchimpSubscribe({
        email,
        tags: ["newsletter", "insights"],
      });
    })()
  );
}

export function afterCapitalPartnerInterest(input: {
  email: string;
  name?: string;
  organization?: string;
}): void {
  fire(
    (async () => {
      const name = input.name?.trim() || "";
      const [firstName, ...rest] = name.split(/\s+/).filter(Boolean);
      await mailchimpSubscribe({
        email: input.email,
        firstName: firstName || undefined,
        lastName: rest.join(" ") || undefined,
        tags: ["partner-interest", "capital-partners"],
        phone: undefined,
      });
      if (input.organization?.trim()) {
        logIntegration("CAPITAL_PARTNER_INTAKE", {
          organization: input.organization.trim().slice(0, 80),
        });
      }
    })()
  );
}
