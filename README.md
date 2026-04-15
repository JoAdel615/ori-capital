# Ori Capital — Website

Institution-grade, dark-mode website for Ori Capital: alternative capital platform for entrepreneurs, operators, and small business owners.

## Stack

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS v4** (dark theme, design system)
- **React Router 7** (client-side routing)

## Documentation

- **[Ori Digital Product Standard](docs/ORI_DIGITAL_PRODUCT_STANDARD.md)** — Brand pillars (Consulting → Management → Capital), design/content/analytics guardrails, layout diversity, product identity.
- **[Platform lifecycle, IA & design system](docs/PLATFORM_LIFECYCLE_SPEC.md)** — Canonical spec: pillars, lifecycle narrative, IA, design system, phased roadmap, governance.
- **[Phase 0 deliverables](docs/PHASE_0_DELIVERABLES.md)** — Sitemap v1, archetypes A1–A6, messaging matrix, immutable URLs (sign-off table).
- **Phase 1 foundations (code)** — `src/design/FOUNDATIONS.md`, `src/design/tokens.ts`, semantic tokens and `ori-type-*` / `ori-pillar-band-*` in `src/index.css`.
- **Routes (pillars)** — `/management`, `/consulting`, `/capital`, `/get-started`, `/pricing` (see `src/App.tsx` and `src/utils/navigation.ts`).
- **[Analytics events](docs/ANALYTICS_EVENTS.md)** — Custom GA4 / Meta events (`src/lib/analytics/oriEvents.ts`).
- **[Accessibility checklist](docs/PHASE_9_ACCESSIBILITY.md)** — Release-gate quality bar (manual); pair with `npm run test` and `npm run test:e2e` for automated checks.
- **[Composition inventory](docs/COMPOSITIONS.md)** — When to use each section composition and archetype mapping.

## Develop

```bash
npm install
npm run dev
```

**Checks:** `npm run ci` (lint + unit tests + build), then `npm run test:e2e` locally (first time: `npx playwright install chromium`). **GitHub Actions CI** is not in the repo until the deploy token has the `workflow` scope (or you use SSH); run the same checks locally or in another CI host before merging.

SEO governance is enforced in tests (`src/lib/seo/routeDescriptions.test.ts`, `src/lib/seo/routeCoverage.test.ts`, `src/lib/seo/routeTitles.test.ts`, `src/lib/seo/indexing.test.ts`, `src/lib/seo/routeGovernance.test.ts`).

Route-level code-splitting is enabled in `src/App.tsx` via `React.lazy` + `Suspense`.

E2E smoke now covers lifecycle hubs and noindex policy on utility routes.

Open [https://localhost:5173](https://localhost:5173) (HTTPS in dev via `@vitejs/plugin-basic-ssl`). Form submissions POST to `/api/*`; the Vite dev/preview server runs local middleware (readiness scoring, payments, back office, partner APIs). Unhandled `/api` routes are not faked—use the real handlers above or your own proxy.

## Build

```bash
npm run build
npm run preview
```

Static output is in `dist/`. For production, either:

- Point `/api/*` to your real backend (e.g. reverse proxy), or
- Use the redirect option below so applicants go to an external application URL.

## Configuration (env)

Create `.env` or `.env.production` and set any of:

| Variable | Description |
|----------|-------------|
| `VITE_APPLY_API_URL` | POST endpoint for Apply for Capital form (default: `/api/apply`) |
| `VITE_APPLY_EXTERNAL_URL` | If set, “Apply for Capital” redirects here instead of the embedded form (keeps experience embedded until CTA) |
| `VITE_CAPITAL_PARTNERS_API_URL` | POST endpoint for Capital Partners interest form (default: `/api/capital-partners`) |
| `VITE_NEWSLETTER_API_URL` | POST endpoint for newsletter signup (default: `/api/newsletter`) |
| `VITE_API_ORIGIN` | **Production:** public origin of the Node API when the site is static only (e.g. `https://api.oricapitalholdings.com`, no trailing slash). Empty in dev → same-origin `/api/*`. |
| `VITE_STRATEGY_CALL_URL` | URL for “Schedule Strategy Call” (default: `#contact`) |
| `VITE_SITE_URL` | Base URL for OG/canonical (default: `https://oricapital.com`) |
| `VITE_CLIENT_ERROR_REPORT_URL` | Optional. Absolute URL to `POST` JSON when the client error boundary catches (enable CORS for your site origin). Also: `window.__ORI_REPORT_CLIENT_ERROR__` for custom forwarding. |
| `VITE_GA_MEASUREMENT_ID` | Optional. GA4 ID (`G-…`); loads gtag and sends SPA page views via `Analytics` in `App.tsx`. |
| `VITE_META_PIXEL_ID` | Optional. Meta Pixel (numeric); loads `fbevents.js` and tracks `PageView` on route changes. |
| `ECRYPT_API_KEY` | **Backend only.** eCrypt Transaction Gateway private key (Payment API, Cart). Never expose via `VITE_*`. |

Use `.env.example` as a template; copy to `.env` and set real values. `.env` is gitignored.

### API server (production)

Static hosting (e.g. cPanel `public_html`) does **not** run the `/api/*` stack. Run the API on a **Node host** (VPS, Railway, Render, Fly.io, etc.):

```bash
npm run api
```

- **`PORT`**: listen port (default `8787`).
- **`API_CORS_ORIGIN`**: your **exact** public site origin, e.g. `https://oricapitalholdings.com` (required for browser admin, forms, and partner portal calling the API cross-origin). Omit only for same-origin setups.
- Load the same secrets as local dev: **`.env`**, **`vault/integrations.env`**, `ECRYPT_*`, `BACKOFFICE_ADMIN_PASSWORD`, etc. The API writes **`.data/backoffice.json`** on that machine—use a persistent disk.

**Frontend:** Build with `VITE_API_ORIGIN=https://your-api-host` so all `fetch` calls target the API. Example DNS: `api.oricapitalholdings.com` → your Node service, with TLS on that host.

#### cPanel — Setup Node.js App (same account)

1. **Upload** the full project (ZIP or `git clone`) into **Application root** so **`package.json`** is at the root of that folder.
2. **Run NPM Install** in the Node UI (or SSH into the virtualenv path cPanel shows).
3. **Application URL:** choose **`api.oricapitalholdings.com`** (or your API subdomain) if the dropdown allows it—avoid binding the API to the same URL as the static marketing site unless the host documents how to split traffic.
4. **Application startup file:** `server/cpanel-entry.cjs`  
   (fallback if the panel rejects `npx tsx server/apiServer.ts`; locally test with `npm run api:cpanel`).
5. **Environment variables** (minimum): `NODE_ENV=production`, `API_CORS_ORIGIN=https://oricapitalholdings.com`, `BACKOFFICE_ADMIN_PASSWORD` (16+ chars), plus `ECRYPT_*` and integration keys as needed. Optional: upload **`vault/integrations.env`** next to the app and keep it out of git.
6. **Save → Restart.** Smoke test: `curl -sS "https://api.oricapitalholdings.com/api/public/site-content"` → JSON with `"ok": true`.

`tsx` is a **runtime dependency** so production `npm install` can start the TypeScript API without `--include=dev`.

**Local data:** The dev server may write `.data/backoffice.json` (and related state). That directory is gitignored and may contain PII—do not commit it. **Integration secrets (Mailchimp, Twilio):** add `vault/integrations.env` (gitignored); Vite merges it for dev/preview. See `docs/vault-integrations.md`.

**Back office hardening (middleware):** When `NODE_ENV=production`, `/api/admin/login` is disabled until `BACKOFFICE_ADMIN_PASSWORD` is set to at least **16 characters** and is not the literal `admin`. For local `vite preview` after a production build, set **`BACKOFFICE_RELAX_AUTH=1`** (never in real production) or use a strong password. A startup warning is logged if `BACKOFFICE_RELAX_AUTH` is on in production. Failed admin and partner sign-ins are **rate-limited per IP** (sliding windows in `server/backofficeStore.ts`). **`TRUST_X_FORWARDED_FOR=1`** (or `true`) uses the first `X-Forwarded-For` hop for those limits when the app sits behind a **trusted** reverse proxy; otherwise the direct socket address is used (avoids clients spoofing `X-Forwarded-For`).

## Analytics

Set `VITE_GA_MEASUREMENT_ID` and/or `VITE_META_PIXEL_ID` at build time. The `Analytics` component (inside `BrowserRouter`) injects the official scripts and updates page views on client-side navigation. Invalid IDs are ignored (see `src/lib/analytics/validateIds.ts`). For custom funnel events, call `trackAnalyticsEvent` from `src/lib/analytics/events.ts`. Pair with your privacy/consent policy where required.

## Structure

- `src/` — App, routes, UI components, readiness survey, partner/referral flows, back-office UI
- `src/data/` — Static content and CMS-style data (e.g. `blog.ts`, testimonials, funding stats)
- `src/config.ts` — Public config from `VITE_*` env
- `src/lib/analytics/` — GA4 / Meta bootstrap, ID validation, `trackAnalyticsEvent`
- `server/` — Vite dev/preview middleware: back office persistence, payments (eCrypt), integrations
- `public/` — Static assets served as-is
- `scripts/` — Dev helpers (port cleanup, screenshots)
- `docs/` — Internal notes (e.g. enrollment follow-ups, `vault-integrations.md`)

## Accessibility

- Skip link to main content
- Semantic headings and landmarks
- Focus-visible outlines (accent color)
- Sufficient contrast (dark background, light text, accent for CTAs)
- Form labels and error association

## License

Proprietary — Ori Capital.
