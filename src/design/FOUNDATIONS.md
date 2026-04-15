# Design foundations (Phase 1)

**Authority:** [docs/PLATFORM_LIFECYCLE_SPEC.md](../../docs/PLATFORM_LIFECYCLE_SPEC.md) §7

## Where tokens live

- **Tailwind theme + global semantics:** `src/index.css` (`@theme`, `@layer base`, `@layer utilities`)
- **Layout rhythm (spacing):** `src/components/system/rhythm.ts`

## Semantic surfaces

Prefer these for **new** UI over raw `ori-black` / `ori-charcoal` when the role is “page vs raised vs panel”:

| Token / utility | Role |
|-----------------|------|
| `bg-ori-surface-base` | Page background (maps to `ori-black`) |
| `bg-ori-surface-raised` | Elevated band (maps to `ori-charcoal`) |
| `bg-ori-surface-panel` | Cards, panels (maps to `ori-surface`) |
| `bg-ori-surface-muted` | Alternate section band (maps to `ori-section-alt`) |

## Semantic text

| Token / utility | Role |
|-----------------|------|
| `text-ori-text-primary` | Primary body/headings on surface |
| `text-ori-text-secondary` | Supporting copy (maps to `ori-muted`) |

## Typography classes (`ori-type-*`)

| Class | Use |
|-------|-----|
| `ori-type-eyebrow` | Marketing label above title (accent) |
| `ori-type-label` | Form / UI labels (muted, uppercase) |
| `ori-type-title` | Section title (~h2) |
| `ori-type-subtitle` | Subsection (~h3) |
| `ori-type-lead` | Hero / intro paragraph (already existed as `ori-lead`) |
| `ori-type-body` | Default paragraph |
| `ori-type-body-muted` | Paragraph secondary |
| `ori-type-caption` | Fine print, hints |

Existing `ori-h1`, `ori-h2`, `ori-lead`, `ori-muted` remain valid; prefer `ori-type-*` for new compositions.

## Pillar section bands

**Use only** for full-width **section backgrounds** — not buttons, not logo. Subtle tint differentiates pillars while keeping one Ori brand. (Brand list order: Consulting → Management → Capital — see `docs/ORI_DIGITAL_PRODUCT_STANDARD.md`.)

| Class | Pillar |
|-------|--------|
| `ori-pillar-band-consulting` | Consulting |
| `ori-pillar-band-management` | Management |
| `ori-pillar-band-capital` | Capital |

## Motion

Decorative animations respect `prefers-reduced-motion` (see `index.css`). Prefer `motion-safe:` in Tailwind where adding new motion.

## TS helpers

`src/design/tokens.ts` exports class-name constants for compositions and tests.
