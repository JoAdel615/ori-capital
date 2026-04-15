# Ori Platform — Lifecycle Product, IA & Design System Specification

**Document type:** Product, UX, and engineering reference  
**Status:** Living document — version and review per [§11 Governance](#11-governance--change-control)  
**Primary codebase:** `ori-capital` (React / Vite marketing site)

This specification defines how Ori presents and builds a **holistic lifecycle offering** for entrepreneurs and business owners—**Management**, **Consulting**, and **Capital**—with a **design system** that prevents redundant layouts and keeps marketing **balanced** across pillars (not funding-first by default).

---

## Document control

| Field | Value |
|--------|--------|
| **Version** | 1.10.0 |
| **Last updated** | 2026-04-08 |
| **Owner** | Product / design (update on handoff) |
| **Review cadence** | After each major phase completion; at least quarterly |
| **Related docs** | `docs/vault-integrations.md`, `docs/FUNDING_READINESS_ENROLLMENT_NEXT_STEPS.md` |

**Semantic versioning (this doc):**

- **MAJOR** — Pillar model, IA, or archetype rules change in a breaking way.
- **MINOR** — New phases, routes, or compositions added; material new guidance.
- **PATCH** — Clarifications, typos, cross-links, acceptance criteria tweaks.

---

## Table of contents

1. [Purpose & scope](#1-purpose--scope)  
2. [Vision & positioning](#2-vision--positioning)  
3. [Audience, voice & tone](#3-audience-voice--tone)  
4. [Product model](#4-product-model)  
5. [Information architecture](#5-information-architecture)  
6. [Content & messaging standards](#6-content--messaging-standards)  
7. [Design system](#7-design-system)  
8. [Brand & visual guidelines](#8-brand--visual-guidelines)  
9. [SEO, analytics & accessibility](#9-seo-analytics--accessibility)  
10. [Implementation roadmap](#10-implementation-roadmap)  
11. [Governance & change control](#11-governance--change-control)  
12. [Codebase references](#12-codebase-references)  
- [Appendix A — URL inventory & redirects](#appendix-a--url-inventory--redirects)  
- [Appendix B — Glossary](#appendix-b--glossary)  
- [Appendix C — Partner / white-label positioning](#appendix-c--partner--white-label-positioning)

---

## 1. Purpose & scope

### 1.1 Purpose

- Provide a **single accountable reference** for strategy, site structure, UX patterns, and phased delivery.
- Align **marketing narrative** with **product truth**: Ori supports the **full business lifecycle**, not only capital.
- Constrain implementation to **reusable compositions** and **page archetypes** to avoid one-off redundant layouts.

### 1.2 In scope

- Public marketing site structure, navigation, and page patterns.
- Design tokens, typography roles, section compositions, and page archetypes.
- Cross-pillar messaging rules and lifecycle framing.
- Phased implementation plan with acceptance criteria.

### 1.3 Out of scope (unless explicitly added later)

- Back-office / partner portal feature specs (reference existing code and separate docs).
- Legal agreements, compliance sign-off copy (link to `legal/*` pages).
- Deep integration specs for CorpNet, Hosting.com, GoHighLevel (see `docs/vault-integrations.md` where applicable; vendor APIs belong in integration docs).

### 1.4 Principles (non-negotiable)

1. **Lifecycle parity** — No pillar is treated as the only “real” product in global surfaces (home, primary nav, default meta tone).
2. **Founder / operator language** — Prefer concrete operations vocabulary; funding is a **branch**, not the assumed identity of every visitor.
3. **Composition over customization** — New pages map to an **archetype**; new sections use **shared compositions** before bespoke CSS.
4. **Ori-owned experience** — Third-party engines power delivery; **customer-facing copy** emphasizes Ori outcomes, not vendor brand dumps.

---

## 2. Vision & positioning

### 2.1 Category

Ori is a **lifecycle operating partner** for startups and small businesses: from **idea** through **scale** and **exit readiness** (where applicable). Capital is **one critical chapter**, not the whole book.

### 2.2 Canonical positioning statement (external)

> Ori helps you build a real business, run it with structure, and grow it with judgment—so operations stay clear and capital is an option when it fits.

### 2.3 One-line variants (use cases)

- **Home / broad:** From idea to operation to scale—with the systems and guidance to do it without guessing.  
- **Pillar-agnostic CTA context:** Build it right. Run it properly. Grow with clarity.  
- **Capital-specific pages only:** When you’re ready for funding, your profile and story should already make sense.

### 2.4 Three pillars (equal strategic weight in IA and global marketing)

**Brand and navigation list order:** **Consulting → Management → Capital** (Ori Capital Holdings LLC).  
**Product dependency:** Management remains the **operational spine**—systems, compliance, and infrastructure that make consulting and capital outcomes credible; guided journeys may still start where the buyer is.

| Pillar | Job-to-be-done | Promise (outcome language) |
|--------|------------------|----------------------------|
| **Consulting** | Know **what to do next** and **in what order** | Coaching, structuring advisory, accountability |
| **Management** | Make the business **real, compliant, organized, present, and sellable** | Entity, identity, operations stack, web/email, CRM & growth |
| **Capital** | **Finance** the business when appropriate | Readiness, credit, access, structuring support |

**Dependency rule (product, not just copy):** Management is the **spine**; Consulting and Capital **attach**. Weak management undermines consulting efficacy and capital outcomes. Listing order above is **brand presentation**, not a mandate that every visitor starts in Consulting.

### 2.5 Lifecycle spine (canonical journey)

Use **one** journey everywhere it appears (home, pillar hubs, footers), unless a page explicitly targets a single pillar.

Suggested canonical stages (labels can ship in customer language):

1. **Clarify** — Idea, model, customer, offer.  
2. **Form & comply** — Entity, EIN, registrations, good standing.  
3. **Operate & document** — Business profile / identity vault, records, compliance visibility.  
4. **Reach customers** — Web, email, CRM, pipeline, automation.  
5. **Stabilize & measure** — Cash visibility, simple ops rhythm (not full accounting promise unless product supports it).  
6. **Scale** — Systems, delegation, growth loops.  
7. **Capital / strategic options** — When funding or transactions fit; readiness as prerequisite language.

**Capital** appears as **stage 7** (or parallel branch from 5–6), not as the climax on global pages.

### 2.6 Management modules (product breakdown)

Management comprises **five** customer-facing modules (names are customer-facing; backends may be CorpNet, Hosting.com, GoHighLevel, internal app):

| Module | Customer name | Outcome |
|--------|----------------|---------|
| 1 | Formation & compliance | Business is **real** and **compliant** |
| 2 | Business Profile (identity vault) | Business is **organized** and **credible** |
| 3 | Business Builder | Model and customers are **clear** |
| 4 | Web & email | Business is **online** and **reachable** |
| 5 | CRM & growth | Leads and customers are **tracked**; revenue **systematized** |

**GoHighLevel:** Present as **Ori CRM & growth** (or equivalent). Do **not** lead with vendor name in hero or primary value props; disclose in privacy/terms/partner materials as required.

---

## 3. Audience, voice & tone

### 3.1 Primary audiences

- **Founders** — Pre-launch through early revenue; high uncertainty; need sequencing.  
- **Operators** — Running day-to-day; need structure, documentation, and growth rhythm.  
- **Small business owners** — May be less “startup” language; emphasize reliability and clarity.

### 3.2 Voice

- **Direct, calm, competent** — Peer operator, not bank brochure.  
- **Specific verbs** — Structure, document, launch, sell, measure, comply.  
- **Conditional capital** — “When funding fits,” “If you choose to borrow or raise,” not “everyone should apply.”

### 3.3 Tone by pillar (guidance)

- **Management** — Clarity, checklists, “what good looks like,” reduced anxiety on compliance.  
- **Consulting** — Judgment, tradeoffs, partnership, accountability.  
- **Capital** — Precision, eligibility realism, respect for underwriting complexity.

### 3.4 Inclusive & general-audience guardrails

- Avoid assuming **loan** or **credit** as the visitor’s immediate goal on global pages.  
- Avoid jargon **or** explain once in plain language (e.g. “business credit profile (how vendors and lenders see your business)”).  
- Avoid **hype** (“guaranteed,” “instant approval” globally); pillar-specific pages follow legal/compliance review.

### 3.5 Messaging matrix (accountability check)

For **each** pillar hub, maintain:

| Element | Requirement |
|---------|----------------|
| Headline | No other pillar named as subordinate |
| Proof points | ≥3, **≤1** may mention funding on non-Capital hubs |
| Primary CTA | Pillar-appropriate (see §6.3) |
| Footer / next step | May link to other pillars **as options**, not as “the real product” |

---

## 4. Product model

### 4.1 Packaging philosophy

- Sell **progression** through lifecycle stages and **outcomes**, not a laundry list of disconnected tools.  
- Tiers (Foundation, Builder, Operator, Capital Ready, etc.) may appear on **Pricing** or **Get started** flows; pillar pages focus on **problems and outcomes**.

### 4.2 Optional tier narrative (commercial)

Aligns with lifecycle; exact SKUs and prices live in commerce/pricing implementation.

| Tier | Rough scope |
|------|-------------|
| Foundation | Formation + baseline identity + web/email entry |
| Builder | Business Builder + light CRM / capture |
| Operator | Business Profile + compliance visibility + full CRM/automation narrative |
| Capital Ready | Readiness scoring, credit narrative, pre-qualification |
| Capital Access | Facilitation, commission-based or deal-specific (as legally described) |

### 4.3 “Next best action” (future product direction)

Site and app should converge on **guided** recommendations (“what to do next”) vs. flat tool grids. Marketing copy should **foreshadow** guidance without over-promising automation not yet shipped.

---

## 5. Information architecture

### 5.1 Top-level navigation (target state)

**Primary (grouped):**

- **Management** (dropdown: Overview + 5 modules)  
- **Consulting** (dropdown: Overview + offers + book)  
- **Capital** (dropdown: Overview + funding + readiness + apply)  
- **Insights**  
- **About** · **Contact**

**Primary CTA:** Contextual—e.g. **Get started** (guided) or **Apply** on Capital-heavy contexts; avoid only “Apply for funding” as the global sole CTA.

**Secondary:** Partner, Login (drawer/footer acceptable).

### 5.2 Sitemap (marketing routes)

**Management**

| Path | Archetype |
|------|-----------|
| `/management` | Pillar hub |
| `/management/formation` | Module / product |
| `/management/business-profile` | Module / product |
| `/management/business-builder` | Module / product |
| `/management/hosting` | Module / product |
| `/management/crm-growth` | Module / product |

**Consulting**

| Path | Archetype |
|------|-----------|
| `/consulting` | Pillar hub |
| `/consulting/coaching` | Offer |
| `/consulting/structuring` | Offer (entity, ops, systems—pairs with Management) |
| `/consulting/capital-strategy` | Offer (sequencing and strategy when capital fits) |
| `/consulting/book` | Utility / conversion |

**Capital**

| Path | Archetype |
|------|-----------|
| `/capital` | Pillar hub (narrative; links to existing flows) |
| `/funding` | Existing — capital product / exploration |
| `/funding-readiness` | Existing — product |
| `/apply` | Existing — application |

**Cross-cutting**

| Path | Notes |
|------|--------|
| `/pricing` | Optional unified ladder or tabbed by pillar |
| `/get-started` | Guided journey (recommended) |
| `/approach` | Existing — align with Consulting or redirect with care (see Appendix A) |

### 5.3 URL stability policy

- **Do not break** existing capital URLs without `301`/`Navigate` and updated `routeDescriptions.ts`.  
- New pillar paths are **additive** until migration is intentional and documented.

### 5.4 Internal linking rules

- Every **Management** module page: optional “Consulting” and “Capital” **next steps** (not mandatory funding).  
- Every **Consulting** page: link to Management for “systems” and Capital for “when ready.”  
- **Capital** pages: acknowledge **readiness** and **operations** as prerequisites in intro copy where appropriate.

---

## 6. Content & messaging standards

### 6.1 Page structure (module / product archetype)

Order unless a documented exception:

1. Hero — outcome headline, proof line, primary + secondary CTA.  
2. Who it’s for — 2–3 bullets.  
3. What’s included — scannable list.  
4. How it works — 3–5 steps tied to lifecycle.  
5. Proof — compliance, time saved, credibility (honest).  
6. Pricing or “from $X” / contact—transparent where possible.  
7. FAQ — 3–5 objections.  
8. Footer CTA — optional cross-pillar.

### 6.2 Pillar hub structure

1. Hero — lifecycle-balanced.  
2. Three pillars — equal visual weight (card grid).  
3. Lifecycle diagram or journey strip.  
4. Module or offer preview.  
5. Social proof / insights teaser.  
6. CTA band.

### 6.3 CTA vocabulary (defaults)

| Pillar | Primary verbs |
|--------|----------------|
| Management | Get set up, Organize, Launch online, Start formation |
| Consulting | Book a session, Talk to us, Get a plan |
| Capital | Check readiness, Apply, See options |

### 6.4 SEO / meta balance

- Default and home descriptions must **not** read as funding-only (update `src/lib/seo/routeDescriptions.ts` when changing positioning).

---

## 7. Design system

### 7.1 Layered model (industry-standard structure)

1. **Foundations** — Tokens, typography scale, spacing, motion, elevation, focus.  
2. **Primitives** — Button, input, link, card shell, badge, accordion, drawer, etc.  
3. **Compositions** — Reusable **sections** (hero variants, module grids, journey strip, CTA band).  
4. **Page archetypes** — Templates that **only** assemble compositions.

### 7.2 Current codebase anchors

- Global styles & tokens: `src/index.css`  
- Layout rhythm: `src/components/system/rhythm.ts`  
- Layout primitives: `src/components/system/PageContainer.tsx`, `PageSection.tsx`, `PageHero.tsx`, `SectionHeading.tsx`  
- UI: `Button`, `Card`, `Accordion`, `Drawer`, etc.

### 7.3 Foundations (target enhancements)

**Semantic tokens (CSS variables or Tailwind theme extension):**

- Surfaces: base, raised, muted, invert (use sparingly).  
- Text: primary, secondary, tertiary, on-accent.  
- Borders, focus ring, radius scale.  
- Optional **pillar tint** tokens: use at **low opacity** (e.g. backgrounds/borders only), not for primary buttons or logo.

**Typography roles:**

| Role | Use |
|------|-----|
| Display / H1 | Page title, major hero |
| Title / H2–H3 | Section titles |
| Lead | Hero subcopy, section intros |
| Body | Paragraphs |
| Label | Eyebrows, form labels |
| Caption | Hints, footnotes |

**Spacing:** Prefer `SECTION_Y`, `SECTION_Y_TIGHT`, `SECTION_Y_LOOSE` from `rhythm.ts`; extend with documented tokens if new patterns repeat.

**Motion:** One standard reveal/stagger; respect `prefers-reduced-motion`.

### 7.4 Primitives policy

- **No ad-hoc variant explosion** — new variants need justification in this doc or a short ADR.  
- Shared props and accessibility (focus, `aria-*`) are mandatory for new primitives.

### 7.5 Compositions (required library direction)

Implement shared compositions under e.g. `src/components/compositions/` (path is a recommendation):

| Composition | Purpose |
|-------------|---------|
| `CenteredHero` | Text-forward hero (extends current `PageHero` behavior) |
| `SplitHero` | Text + visual (image, diagram, device frame) |
| `LifecycleStrip` | Horizontal or vertical journey with stages |
| `ModuleGrid` | 2×2 / 3×2 cards with **one** card component |
| `FeatureList` | Icon + title + one line |
| `SplitFeature` | Alternating image/copy bands |
| `ProofStrip` | Logos, metrics, or quotes |
| `PricingBand` | Uses standardized tier column / `PricingTierCard` |
| `CtaBand` | Full-width closing CTA |
| `ResourceRow` | Insights / resources |

**Rule:** Marketing pages **must not** duplicate the same section layout twice without extracting a composition.

### 7.6 Page archetypes (enforced set)

| ID | Name | Use |
|----|------|-----|
| A1 | Pillar hub | `/management`, `/consulting`, `/capital` |
| A2 | Module / product | Management module pages |
| A3 | Consulting offer | Coaching, structuring, capital strategy |
| A4 | Capital product | Funding, readiness (existing pages migrate toward A2/A4 consistency) |
| A5 | Editorial | Insights posts / index |
| A6 | Utility | Contact, legal, book |

**Enforcement:** New route → assign archetype in PR description; reject freeform “special” pages unless approved in governance.

### 7.7 Visual modes (anti-monotony)

Rotate **one** primary mode per major section or per page:

1. **Abstract / diagram** — lifecycle, system map.  
2. **Photography** — operators, founders, workspaces (non-bank cliché stock).  
3. **Product UI** — sanitized screenshots.

### 7.8 Design deliverables (when engaging design)

- Token table (name, value, usage).  
- Composition inventory with **when to use / when not to use** ([COMPOSITIONS.md](./COMPOSITIONS.md)).  
- Archetype wireframes (low-fi) before high-fi page sprawl.

---

## 8. Brand & visual guidelines

### 8.1 Brand hierarchy

- **Customer-facing brand:** Ori (e.g. Ori Capital as used today on site).  
- **Parent / legal:** Ori Capital Holdings LLC — footer and legal as appropriate.  
- **Pillars:** Consulting, Management, Capital as **navigation and narrative** labels (see `docs/ORI_DIGITAL_PRODUCT_STANDARD.md`), not separate logos unless brand team introduces sub-marks.

### 8.2 Imagery

- **Diverse** founders and operators; avoid single-industry or “Wall Street only” cues on global pages.  
- **Consistent** treatment (color grade or overlay) if mixing photo and UI.

### 8.3 Third-party engines

- **Customer promise:** Ori system and outcomes.  
- **Disclosure:** Privacy policy, terms, subprocessor lists as legally required.  
- **Avoid** vendor logos in hero unless partnership agreement requires it.

---

## 9. SEO, analytics & accessibility

### 9.1 SEO

- Unique `<title>` and meta description per route (`Layout` + `routeDescriptions.ts`).  
- Canonical URLs for any duplicate paths (`Navigate` aliases documented).  
- Structured data: evaluate `Organization`, `WebSite`, `FAQPage` where authentic—follow Google guidelines.  
- **Implementation:** `Organization` + `WebSite` JSON-LD via `src/components/JsonLd.tsx` in `Layout`.
- **Index control:** `noindex,nofollow` for non-marketing utility routes (`/admin`, `/partner`) via `useDocumentHead`.

### 9.2 Analytics

- Define events for: pillar hub views, module views, primary CTA clicks, guided journey steps, apply starts.  
- Keep event names stable; document in analytics tool or inline catalog.  
- **Implementation:** [ANALYTICS_EVENTS.md](./ANALYTICS_EVENTS.md); `trackOriRouteView` in `Analytics.tsx`; `trackOriEvent` on apply submit, get-started journeys, pricing CTAs, key home CTAs.

### 9.3 Accessibility (baseline)

- Logical heading order (one `h1` per view).  
- Visible focus; keyboard nav for drawers/menus.  
- Contrast meets WCAG 2.1 AA for text and interactive elements.  
- Images: meaningful `alt`; decorative `alt=""`.  
- Respect `prefers-reduced-motion`.  
- **Checklist:** [PHASE_9_ACCESSIBILITY.md](./PHASE_9_ACCESSIBILITY.md).

---

## 10. Implementation roadmap

Phases are **sequential** where noted; some work can overlap with clear ownership.

### Phase 0 — Discovery & alignment

**Deliverables:** Approved sitemap v1, archetype list, messaging matrix v1, list of immutable URLs.  
**Acceptance:** Stakeholder sign-off on lifecycle copy and pillar parity rules.  
**Duration (indicative):** 3–5 days.  
**Implementation:** Baseline captured in [PHASE_0_DELIVERABLES.md](./PHASE_0_DELIVERABLES.md) — complete sign-off table when stakeholders confirm.

### Phase 1 — Design foundations v1

**Deliverables:** Semantic tokens in CSS/Tailwind; typography role utilities or components; pillar tint rules documented.  
**Acceptance:** Dark/light themes pass contrast checks; no new arbitrary colors on pages without token.  
**Duration:** 1–2 weeks.  
**Implementation (started):** `src/index.css` (`@theme` semantic aliases, `ori-type-*`, `ori-pillar-band-*`); reference `src/design/FOUNDATIONS.md` and `src/design/tokens.ts`.

### Phase 2 — Composition library v1

**Deliverables:** 4–6 compositions in `src/components/compositions/`; refactor **one** existing page as reference.  
**Acceptance:** Each composition documented (comment block: purpose, props, do/don’t); duplicate layout threshold enforced in review.  
**Duration:** 2–3 weeks.  
**Depends on:** Phase 1.  
**Implementation:** `LifecycleStrip`, `ModuleGrid`, `CtaBand`, `SplitHero`; reference refactor: `HomePage` + `PillarModulePage` patterns.

### Phase 3 — IA & navigation

**Deliverables:** `ROUTES` + `App.tsx` routes; grouped `Nav.tsx`; `routeDescriptions.ts` updates; stub pillar hubs (A1).  
**Acceptance:** Mobile/desktop nav usable; meta descriptions lifecycle-balanced for new stubs.  
**Duration:** ~1 week.  
**Depends on:** Phase 2 (preferred) or minimal `PageHero` reuse.

### Phase 4 — Management pillar pages

**Deliverables:** `/management` + five module pages (A2); distinct visual mode per page where feasible.  
**Acceptance:** Copy review per §3.5; no funding-only closure on Management pages.  
**Duration:** 2–4 weeks (can split per module).

### Phase 5 — Consulting pillar pages

**Deliverables:** `/consulting` + offers + book (A3/A6).  
**Acceptance:** Clear differentiation from Management; booking path works.  
**Duration:** 1–2 weeks.

### Phase 6 — Capital alignment

**Deliverables:** `/capital` hub; refresh intros on key capital pages for lifecycle framing; cross-links.  
**Acceptance:** Capital still discoverable; global narrative not funding-only.  
**Duration:** 1–2 weeks.  
**Implementation:** `/capital` hub; `AccessCapitalPage` and `CapitalReadinessPage` hero copy with Management/Consulting links.

### Phase 7 — Home page v2

**Deliverables:** Home rebuilt with pillars + journey + balanced proof.  
**Acceptance:** Above-fold speaks to full lifecycle; funding is one section, not the whole story.  
**Duration:** 1–2 weeks.  
**Implementation:** `HomePage.tsx` — three-pillar `ModuleGrid`, `LifecycleStrip`, lifecycle `ProcessSteps`, capital sections reframed as “when ready.”

### Phase 8 — Pricing & guided journey

**Deliverables:** `/pricing` and/or `/get-started` wizard; analytics events.  
**Acceptance:** Journeys can recommend Management-first paths; capital is a branch.  
**Duration:** 2–3 weeks.  
**Implementation:** `/pricing` tier narrative page; `/get-started` guided paths; `ori_get_started_journey_select`, `ori_pricing_tier_cta`, route-view events via `trackOriRouteView`.

### Phase 9 — Quality bar sprint

**Deliverables:** A11y smoke, performance pass, heading/landmark audit.  
**Acceptance:** Checklist completed and filed (link in PR or wiki).  
**Duration:** ~1 week focused.  
**Implementation:** Baseline checklist in [PHASE_9_ACCESSIBILITY.md](./PHASE_9_ACCESSIBILITY.md) (execute per release); automated checks via `npm run test` and `npm run test:e2e`.
**Performance hardening:** route-level lazy loading in `App.tsx` with `Suspense` fallback; initial bundle reduced via page chunking.
**Regression guardrails:** e2e smoke extends to lifecycle hubs + noindex policy; route-title metadata centralized and tested.

### Phase 10 — Design system v2 (continuous)

**Deliverables:** Optional Storybook or extended composition docs; illustration versioning.  
**Acceptance:** Maintenance owner named; deprecation policy for old patterns.

---

## 11. Governance & change control

### 11.1 When to update this document

- New pillar, module, or archetype.  
- Navigation or URL strategy change.  
- New composition that **replaces** an old pattern.  
- Material messaging or compliance constraint.

### 11.2 Pull request expectations

- New marketing route: state **archetype ID**, list **compositions** used, confirm **pillar messaging matrix** for that page.  
- Token or primitive change: note **breaking** vs **non-breaking** for consumers.

### 11.3 Conflict resolution

- **Strategy** wins over local page preference.  
- **Design system** wins over one-off CSS unless exception approved (record date + reason in doc footer or ADR).

---

## 12. Codebase references

| Concern | Location |
|---------|----------|
| Routes | `src/App.tsx` |
| Route constants | `src/utils/navigation.ts` |
| Meta descriptions | `src/lib/seo/routeDescriptions.ts` |
| Main layout / chrome | `src/components/Layout.tsx`, `Nav.tsx`, `Footer.tsx` |
| System layout | `src/components/system/*` |
| Tests for SEO paths | `src/lib/seo/routeDescriptions.test.ts`, `src/lib/seo/routeCoverage.test.ts`, `src/lib/seo/routeTitles.test.ts`, `src/lib/seo/indexing.test.ts`, `src/lib/seo/routeGovernance.test.ts` |

---

## Appendix A — URL inventory & redirects

### A.1 Existing capital-related URLs (preserve)

Examples (non-exhaustive—sync with `App.tsx`):

- `/funding`, `/apply`, `/funding-readiness`, `/funding-readiness/*`, `/funding-readiness-survey`  
- Legacy redirects already in app: `/access-capital` → `/funding`, `/pre-qualify` → `/apply`, etc.

### A.2 Planned additions

- `/management`, `/management/*`, `/consulting`, `/consulting/*`, `/capital`  
- Optional: `/pricing`, `/get-started`

### A.3 `/approach` policy

- **Option A:** Keep as “how we work” and link from Consulting.  
- **Option B:** Redirect to `/consulting` with content merge.  
- Decision must be recorded in this doc’s version notes when executed.

---

## Appendix B — Glossary

| Term | Definition |
|------|------------|
| **Archetype** | Fixed page template (A1–A6) that only assembles compositions. |
| **Composition** | Reusable section pattern (hero variants, grids, CTA bands). |
| **Lifecycle** | End-to-end business journey from idea through scale (and optional exit/capital). |
| **Management spine** | Operations layer (formation, profile, builder, hosting, CRM) that other pillars build on. |
| **Business Profile** | Customer name for identity vault / structured business record. |
| **CRM & growth** | Lead capture, pipeline, automation—powered by GHL or equivalent behind Ori UX. |

---

## Appendix C — Partner / white-label positioning

- Partner-facing copy may emphasize **referral value** and **client outcomes**; still align with lifecycle framing.  
- Do not promise features not available in partner tier; sync with `PartnerSections` and partner docs.

---

## Version history

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-04-07 | Initial lifecycle spec, IA, design system, roadmap, governance. |
| 1.1.0 | 2026-04-07 | Phase 0 package (`PHASE_0_DELIVERABLES.md`); Phase 1 foundations in CSS + `src/design/*`. |
| 1.2.0 | 2026-04-08 | Home v2; `/pricing`; capital page intros; `SplitHero`; Approach page lifecycle alignment. |
| 1.3.0 | 2026-04-08 | JSON-LD; Ori analytics events + route mapping; Apply/Get started/Pricing/Home CTAs; partner + individual readiness copy; Phase 9 checklist doc. |
| 1.4.0 | 2026-04-08 | FAQ JSON-LD on capital pages; composition inventory doc; InfoPopover button semantics. |
| 1.5.0 | 2026-04-08 | Noindex helper + tests; Phase 9 accessibility checklist; spec linkage to tests and manual gate. |
| 1.6.0 | 2026-04-08 | Repo hygiene: snapshot audit doc removed (use checklist + CI); screenshot PNGs not versioned; redundant `dev:v2` script removed. |

---

*End of specification.*
