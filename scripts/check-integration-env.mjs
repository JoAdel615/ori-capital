#!/usr/bin/env node
/**
 * Prints whether Mailchimp / Twilio env is sufficient for server integrations (same rules as server code).
 * Run: node scripts/check-integration-env.mjs
 * Loads vault/integrations.env the same way as vite.config (KEY=VAL lines).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const vaultFile = path.join(root, "vault", "integrations.env");

function mergeVault() {
  if (!fs.existsSync(vaultFile)) {
    console.log("vault/integrations.env — not found (create from integrations.vault.example)\n");
    return;
  }
  const raw = fs.readFileSync(vaultFile, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key) process.env[key] = val;
  }
}

mergeVault();

const mc =
  Boolean(process.env.MAILCHIMP_API_KEY?.trim()) &&
  Boolean(process.env.MAILCHIMP_SERVER_PREFIX?.trim()) &&
  Boolean(process.env.MAILCHIMP_AUDIENCE_ID?.trim());

const twSid = Boolean(process.env.TWILIO_ACCOUNT_SID?.trim());
const twAuth =
  Boolean(process.env.TWILIO_AUTH_TOKEN?.trim()) ||
  (Boolean(process.env.TWILIO_API_KEY_SID?.trim()) &&
    Boolean(process.env.TWILIO_API_KEY_SECRET?.trim()));
const twFrom =
  Boolean(process.env.TWILIO_FROM_NUMBER?.trim()) ||
  Boolean(process.env.TWILIO_MESSAGING_SERVICE_SID?.trim());
const twilio = twSid && twAuth && twFrom;

console.log("Integration env (after vault/integrations.env)\n");
console.log(`  Mailchimp audience upserts: ${mc ? "READY" : "NOT READY"} (needs MAILCHIMP_AUDIENCE_ID + key + prefix)`);
console.log(`  Twilio SMS:                ${twilio ? "READY" : "NOT READY"} (needs SID + auth + FROM or Messaging Service)`);
if (!mc && process.env.MAILCHIMP_API_KEY) {
  console.log("\n  Hint: set MAILCHIMP_AUDIENCE_ID in vault/integrations.env");
}
if (!twilio && twSid && twAuth) {
  console.log("\n  Hint: set TWILIO_FROM_NUMBER=+1... or TWILIO_MESSAGING_SERVICE_SID=MG...");
}
console.log("");
