import { createHash } from "node:crypto";
import { logIntegration } from "./log.js";

const MC_STATUSES = new Set(["subscribed", "pending", "transactional"]);

export function mailchimpSubscriberHash(email: string): string {
  return createHash("md5").update(email.toLowerCase().trim()).digest("hex");
}

export function mailchimpMarketingReady(): boolean {
  return Boolean(
    process.env.MAILCHIMP_API_KEY?.trim() &&
      process.env.MAILCHIMP_SERVER_PREFIX?.trim() &&
      process.env.MAILCHIMP_AUDIENCE_ID?.trim()
  );
}

function memberStatus(): "subscribed" | "pending" | "transactional" {
  const raw = (process.env.MAILCHIMP_MEMBER_STATUS || "subscribed").trim().toLowerCase();
  return MC_STATUSES.has(raw) ? (raw as "subscribed" | "pending" | "transactional") : "subscribed";
}

function authHeader(): string {
  const key = process.env.MAILCHIMP_API_KEY!.trim();
  const token = Buffer.from(`ori:${key}`).toString("base64");
  return `Basic ${token}`;
}

function baseUrl(): string {
  const prefix = process.env.MAILCHIMP_SERVER_PREFIX!.trim();
  return `https://${prefix}.api.mailchimp.com/3.0`;
}

export type MailchimpSubscribeInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
};

/**
 * Upserts a list member and applies tags. Does not throw; logs on failure.
 */
export async function mailchimpSubscribe(input: MailchimpSubscribeInput): Promise<void> {
  if (!mailchimpMarketingReady()) {
    logIntegration("MAILCHIMP_SKIP", { reason: "not_configured" });
    return;
  }
  const email = String(input.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    logIntegration("MAILCHIMP_SKIP", { reason: "invalid_email" });
    return;
  }

  const listId = process.env.MAILCHIMP_AUDIENCE_ID!.trim();
  const hash = mailchimpSubscriberHash(email);
  const url = `${baseUrl()}/lists/${listId}/members/${hash}`;
  const merge: Record<string, string> = {};
  if (input.firstName?.trim()) merge.FNAME = input.firstName.trim();
  if (input.lastName?.trim()) merge.LNAME = input.lastName.trim();
  if (input.phone?.trim()) merge.PHONE = input.phone.trim();

  const body = {
    email_address: email,
    status_if_new: memberStatus(),
    ...(Object.keys(merge).length ? { merge_fields: merge } : {}),
  };

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      logIntegration("MAILCHIMP_ERROR", {
        status: res.status,
        detail: errText.slice(0, 500),
      });
      return;
    }
    logIntegration("MAILCHIMP_UPSERT_OK", { email: `${email.slice(0, 3)}…` });

    const tags = (input.tags || []).map((t) => t.trim()).filter(Boolean);
    if (tags.length === 0) return;

    const tagRes = await fetch(`${baseUrl()}/lists/${listId}/members/${hash}/tags`, {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags: tags.map((name) => ({ name, status: "active" as const })),
      }),
    });
    if (!tagRes.ok) {
      const errText = await tagRes.text().catch(() => "");
      logIntegration("MAILCHIMP_TAGS_ERROR", {
        status: tagRes.status,
        detail: errText.slice(0, 500),
      });
    }
  } catch (err) {
    logIntegration("MAILCHIMP_ERROR", { error: String(err) });
  }
}
