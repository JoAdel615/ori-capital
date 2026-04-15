# Phase 0 — Discovery & alignment (deliverables)

**Status:** Baseline captured — sign off when stakeholders confirm  
**Canonical spec:** [PLATFORM_LIFECYCLE_SPEC.md](./PLATFORM_LIFECYCLE_SPEC.md)  
**Related implementation:** Phase 1 foundations — `src/index.css`, `src/design/FOUNDATIONS.md`, `src/design/tokens.ts`

---

## 1. Sitemap v1 (approved target)

### 1.1 Live today (immutable unless migrated with redirects)

| Path | Purpose |
|------|---------|
| `/` | Home |
| `/funding` | Capital — explore funding |
| `/apply` | Capital — application |
| `/funding-readiness` | Capital — readiness hub |
| `/funding-readiness/individual` | Individual readiness |
| `/funding-readiness/enroll` | Accelerator enrollment |
| `/funding-readiness/enroll/three-step` | Checkout entry |
| `/funding-readiness/enroll/three-step/return` | Checkout return |
| `/funding-readiness-survey` | Survey |
| `/approach` | How Ori works |
| `/insights`, `/insights/:slug` | Editorial |
| `/partners` | Partner program |
| `/partner`, `/partner/register` | Partner portal / register |
| `/referral`, `/testimonial` | Referral flows |
| `/about`, `/contact` | Company |
| `/legal/privacy`, `/legal/terms`, `/legal/disclosures` | Legal |
| `/admin` | Back office |

### 1.2 Planned (Phase 3+)

| Path | Purpose |
|------|---------|
| `/management`, `/management/*` | Management pillar + modules |
| `/consulting`, `/consulting/*` | Consulting pillar + offers |
| `/capital` | Capital narrative hub (links to existing URLs) |
| `/pricing` | Unified tier narrative (quote-based); live |
| `/get-started` | Guided journey entry |

**Policy:** New marketing routes must map to a **page archetype** (see §2). No breaking removal of §1.1 paths without `Navigate`/`301` and `routeDescriptions` updates.

---

## 2. Page archetypes (enforced set)

| ID | Name | Use |
|----|------|-----|
| **A1** | Pillar hub | `/management`, `/consulting`, `/capital` |
| **A2** | Module / product | Management module pages |
| **A3** | Consulting offer | Coaching, structuring, capital strategy |
| **A4** | Capital product | Funding, readiness (existing pages align over time) |
| **A5** | Editorial | Insights |
| **A6** | Utility | Contact, legal, book |

**PR rule:** New route → state archetype ID and compositions used (see main spec §11).

---

## 3. Messaging matrix v1 (accountability)

Use for **pillar hub** copy review before launch. (Detail lives in PLATFORM_LIFECYCLE_SPEC §3.5.)

| Pillar hub | Headline rule | Proof points | Funding mentions in proof | Primary CTA verbs |
|------------|---------------|--------------|---------------------------|-------------------|
| Management | No other pillar subordinate | ≥3 | Prefer 0 | Get set up, Organize, Launch online |
| Consulting | No other pillar subordinate | ≥3 | ≤1 | Book, Plan, Talk to us |
| Capital | Funding-eligible | ≥3 | OK | Assess readiness, Apply, See options |

**Global / home:** Lifecycle-balanced; funding is **one** chapter, not the only outcome.

---

## 4. Immutable URL list (do not break)

These paths are **SEO, bookmarks, partner links, and campaigns**. Changes require redirects and meta updates:

- `/funding`
- `/apply`
- `/funding-readiness` and all nested paths under `/funding-readiness/*`
- `/funding-readiness-survey`
- `/insights` and `/insights/:slug`
- `/partners`
- `/partner`, `/partner/register`
- `/referral`, `/testimonial`
- `/legal/*`

**Aliases already in app:** `/access-capital` → `/funding`, `/pre-qualify` → `/apply`, `/capital-readiness` → `/funding-readiness`, `/readiness` → `/funding-readiness`, `/capital-partners` → `/partners`, `/strategy` → `/approach`, `/model` → `/approach`.

---

## 5. Sign-off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Product | | | |
| Design | | | |
| Engineering | | | |

When signed, mark Phase 0 **complete** in PLATFORM_LIFECYCLE_SPEC version history.

---

## Version

| Date | Change |
|------|--------|
| 2026-04-07 | Initial Phase 0 package for implementation kickoff |
