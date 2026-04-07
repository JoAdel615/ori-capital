# Vault: local integration secrets

The `vault/` directory is **gitignored**. Use `vault/integrations.env` for Mailchimp and Twilio (see **`integrations.vault.example`** in the repo root for a full template).

`vite.config.ts` loads `vault/integrations.env` when you run **`npm run dev`** or **`npm run preview`**, merging into `process.env` so server middleware sees them without copying into `.env`.

## Go-live checklist

### Mailchimp (audience upserts)

1. `MAILCHIMP_API_KEY` — API key from **Account → Extras → API keys** (includes suffix like `-us20`).
2. `MAILCHIMP_SERVER_PREFIX` — Datacenter from the key suffix (e.g. `us20`).
3. **`MAILCHIMP_AUDIENCE_ID`** — **Required.** In Mailchimp: **Audience → Settings → Audience name and defaults → Audience ID** (copy the hex id). Without this, form hooks skip Mailchimp (no API calls).
4. Optional: `MAILCHIMP_MEMBER_STATUS` — `subscribed` (default), `pending` (double opt-in), or `transactional`.

### Twilio (SMS: prequal opt-in + back office testimonial requests)

1. `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` **or** `TWILIO_API_KEY_SID` + `TWILIO_API_KEY_SECRET` (with Account SID still used in the message URL).
2. **`TWILIO_FROM_NUMBER`** (E.164, e.g. `+15551234567`) **or** **`TWILIO_MESSAGING_SERVICE_SID`** (`MG…`). Without one of these, `twilioSmsReady()` is false and SMS is skipped.
3. Optional: `TWILIO_PREQUAL_SMS_BODY` — custom prequal SMS confirmation text.

**Never commit secrets.** If keys appear in chat, screenshots, or logs, **rotate** them in Mailchimp and Twilio.

## cPanel (Hosting.com / deploy automation)

Use **`vault/cpanel.env`** (not merged by Vite — keep deploy credentials separate from dev middleware). Template: **`cpanel.vault.example`**.

Set `CPANEL_HOST`, `CPANEL_PORT` (usually `2083` for HTTPS), **`CPANEL_USER`** (your cPanel username), and **`CPANEL_API_TOKEN`** (token from **Manage API Tokens**). UAPI calls use Basic auth: `username:APITOKEN`.

**Deploy from this repo:** `npm run deploy:cpanel` runs `npm run build` then `scripts/deploy-cpanel.mjs` (uses `vault/cpanel.env`, UAPI `Fileman::upload_files` with `overwrite=1`). By default files over **100 MiB** are skipped (e.g. very large MP4s) — upload those with **SFTP** or **File Manager**, or set `CPANEL_MAX_UPLOAD_MB=0` in `vault/cpanel.env` (may time out).

Automated deploy is **not** the only option; you can also use **Git Version Control** or **SFTP** in cPanel. The token grants whatever scope you chose in cPanel (an unrestricted token can manage files, DBs, domains, etc. — treat it like a password).
