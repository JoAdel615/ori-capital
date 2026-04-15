# Route Ownership & Domain Boundaries

This document defines which domain owns each route surface so marketing, app, and API concerns stay decoupled.

## Domain Roles

- `oricapitalholdings.com` — public marketing and acquisition pages.
- `app.oricapitalholdings.com` — authenticated operational app surfaces (admin, partner portal).
- `api.oricapitalholdings.com` — API endpoints only (no marketing UI).

## Current Route Ownership Policy

### Marketing Domain (`oricapitalholdings.com`)

- All public pillar, product, legal, insight, and contact pages.
- Public intake routes, including `"/partner/register"`.
- Canonical examples:
  - `"/"`
  - `"/consulting/*"`
  - `"/management/*"`
  - `"/capital"`, `"/funding"`, `"/apply"`
  - `"/partners"`, `"/contact"`, `"/about"`
  - `"/partner/register"`

### App Domain (`app.oricapitalholdings.com`)

- Authenticated operational routes:
  - `"/admin"`
  - `"/partner"` and nested partner portal paths (`"/partner/*"`, except marketing `"/partner/register"`).

### API Domain (`api.oricapitalholdings.com`)

- All backend endpoints, such as:
  - `"/api/newsletter"`
  - `"/api/apply"`
  - `"/api/capital-partners"`
  - backoffice and partner API routes.

## Redirect Contract

- Marketing app shell may receive direct hits to `"/admin"` or `"/partner"`.
- When `VITE_APP_ORIGIN` is configured, these routes redirect to the app domain.
- `"/partner/register"` remains on marketing and never auto-redirects to app.
- When `VITE_APP_ORIGIN` is not set (local/dev fallback), app routes continue to render in the same SPA.

## Configuration

- `VITE_APP_ORIGIN`: app UI origin (example: `https://app.oricapitalholdings.com`).
- `VITE_API_ORIGIN`: API origin (example: `https://api.oricapitalholdings.com`).

## Source of Truth in Code

- Route boundary policy: `src/utils/routeBoundary.ts`
- App-domain redirect gate: `src/App.tsx` (`AppDomainRoute`)
- Route constants: `src/utils/navigation.ts`

## Change Management Rule

When adding or changing auth-sensitive routes:

1. Update `src/utils/routeBoundary.ts`.
2. Add or adjust tests in `src/utils/routeBoundary.test.ts`.
3. Confirm no unintended SEO exposure (`noindex` and canonical behavior where relevant).
