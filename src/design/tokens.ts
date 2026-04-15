/**
 * Phase 1 design foundations — class names that map to `src/index.css`.
 * Use in compositions to avoid string drift; see `src/design/FOUNDATIONS.md`.
 */

export const oriSurface = {
  base: "bg-ori-surface-base",
  raised: "bg-ori-surface-raised",
  panel: "bg-ori-surface-panel",
  muted: "bg-ori-surface-muted",
} as const;

export const oriText = {
  primary: "text-ori-text-primary",
  secondary: "text-ori-text-secondary",
} as const;

/** Full-width section bands only — see FOUNDATIONS.md */
export const oriPillarBand = {
  management: "ori-pillar-band-management",
  consulting: "ori-pillar-band-consulting",
  capital: "ori-pillar-band-capital",
} as const;

export const oriType = {
  eyebrow: "ori-type-eyebrow",
  label: "ori-type-label",
  title: "ori-type-title",
  subtitle: "ori-type-subtitle",
  lead: "ori-lead",
  body: "ori-type-body",
  bodyMuted: "ori-type-body-muted",
  caption: "ori-type-caption",
} as const;
