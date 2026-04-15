# Ori Digital Product Standard (ODPS)

**Purpose:** Single source of truth for how **Ori Capital Holdings LLC** shows up digitally—brand, information architecture, design system usage, product identity, and measurable quality. Use this with `src/design/FOUNDATIONS.md` and `docs/PLATFORM_LIFECYCLE_SPEC.md`.

**Audience:** Founders, operators, and small business owners. The site is an **onramp** to real offerings; pillars organize the story; **products and services** deserve distinct identity (not generic “another card on the marketing site”).

---

## 1. Business & brand truth

- **Entity:** Ori Capital Holdings LLC.
- **Mission (concise):** Support **entrepreneurs and business owners**—including startups and SMBs—through three primary pillars: **Consulting**, **Management**, and **Capital**.
- **Listing order (brand, nav, any place all three appear):** **Consulting → Management → Capital.**  
  This is **presentation order**, not a claim that every buyer starts in Consulting.
- **Operational dependency (product reality):** **Management** (systems, compliance, infrastructure, pipeline) is often the **spine** that makes consulting outcomes and capital outcomes credible. Messaging can still lead with Consulting when speaking to strategy-heavy buyers; journeys should meet people where they are.

---

## 2. Reference frameworks (guardrails, not cargo-cult)

These are **industry-standard lenses**. We do not import Material or Carbon wholesale; we **borrow rules** and map them to Ori tokens and components.

| Layer | Canonical influences | In this repo |
|-------|----------------------|--------------|
| **Visual & interaction** | Material Design (spacing rhythm, states), Carbon (dense B2B clarity, workflows) | `src/index.css` (`@theme`), `ori-type-*`, focus rings, `src/design/tokens.ts` |
| **UI structure** | Atomic Design (atoms → molecules → organisms → templates → pages) | `components/ui`-style primitives → `components/system` → `components/compositions` → `Layout` / pillar shells → `pages/*` |
| **Product thinking** | Design Thinking, Lean Startup | Discovery → MVP → measure; avoid speculative breadth in UI |
| **Growth & analytics** | Amplitude-style event model, AARRR | `src/lib/analytics/oriEvents.ts`, `trackOriRouteView`, meaningful CTA events—not noise |
| **Content** | StoryBrand, Jobs To Be Done (JTBD) | Each route: what it is, for whom, why it matters, next step; see §5 |
| **UX quality** | Nielsen heuristics | Visible status, consistency, error prevention, recognition over recall |

---

## 3. Design system (non-negotiables)

1. **Use design tokens and semantic utilities** for new work (`ori-type-*`, surface tokens, pillar bands). See `src/design/FOUNDATIONS.md`.
2. **8px-aligned spacing** via Tailwind/theme; avoid arbitrary one-off gaps that break rhythm (`src/components/system/rhythm.ts` where applicable).
3. **Accessibility:** one `h1` per view, logical heading order, landmarks, focus visible, `prefers-reduced-motion` for decorative motion.
4. **No orphan UI:** Prefer existing compositions (`ModuleGrid`, `CtaBand`, `PageSection`, etc.) before inventing parallel patterns.

---

## 4. Layout & visual diversity (anti-“blocky”)

The site must not read as **the same section repeated**. Enforce variety:

| Rule | Implementation hint |
|------|------------------------|
| **No back-to-back identical composition + band combo** on long pages | Alternate `bg-ori-black` / `bg-ori-section-alt` / pillar bands; vary column counts and image vs text lead |
| **Hero archetypes** | Split hero, image overlay, minimal text band—rotate across pillar hubs and key product landings |
| **Product / service pages** | Each offering should have **named positioning** (eyebrow, title, proof, CTA), optional **product-specific** imagery or iconography—not only `ModuleGrid` clones |
| **Placeholder pages** | Allowed: clear “what this will be” copy, single CTA, **distinct section title** and layout variant so placeholders don’t all look identical |

---

## 5. Content contract (JTBD + StoryBrand-lite)

For every **meaningful route** (especially products and money paths), ensure:

1. **JTBD:** When *[situation]*, I want *[progress]*, so I can *[outcome]* (can be implicit in copy).
2. **Guide positioning:** Ori is the **guide**; the founder is the **hero**.
3. **Next step:** Primary CTA + secondary escape hatch (e.g. pricing, contact, readiness).

---

## 6. Analytics contract

- Meaningful user actions emit structured events (`ORI_EVENTS`, funnel events where applicable).
- New flows should define **activation** and **drop-off** hypotheses (even if instrumentation ships iteratively).

---

## 7. What “good” looks like next

- **Pillar hubs** reinforce Consulting / Management / Capital **without** repeating the same block rhythm as the home page.
- **Product routes** gain **identity** (visual + narrative) as they are built; placeholders are honest and visually distinct.
- **Design system** grows via **atoms/molecules** in `system` and **organisms** in `compositions`—not one-off page CSS.

### 7.1 Module / product template (`PillarModulePage`)

- Set **`pillar`** so the process (“How it works”) section uses the correct **`ori-pillar-band-*`** tint (consulting vs management vs capital)—never default everything to Management.
- Rotate **`heroLayout`** (`overlay` vs `split`) and **`galleryLayout`** (`bento` vs `equal`) across offerings so adjacent routes in the nav do not share the same silhouette.
- Use **`faqSurface`** to alternate FAQ background where back-to-back module pages would otherwise match.

---

*Version 1.0 — aligned with Ori Capital Holdings LLC pillar strategy and modern digital product practice.*
