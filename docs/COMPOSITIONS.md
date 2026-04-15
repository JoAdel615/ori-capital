# Composition inventory

**Authority:** [PLATFORM_LIFECYCLE_SPEC.md](./PLATFORM_LIFECYCLE_SPEC.md) §7

Use compositions to assemble pages; avoid freeform sections that duplicate patterns.

## Components

### `ModuleGrid`
- **Use when:** showing linked modules/pillars/offers in card grid.
- **Do not use when:** content is long-form comparison table or non-link informational list.

### `LifecycleStrip`
- **Use when:** showing short stage labels for lifecycle progression.
- **Do not use when:** stage descriptions are long paragraphs or decision tree complexity is high.

### `CtaBand`
- **Use when:** closing or mid-page conversion block with focused actions.
- **Do not use when:** page already has dense CTA clusters nearby.

### `SplitHero`
- **Use when:** hero needs text + visual side-by-side.
- **Do not use when:** centered copy-only hero (`PageHero`) is sufficient.

### `PillarBridgeLinks`
- **Use when:** pillar hub pages need cross-links to **Consulting / Management / Capital** without a second `ModuleGrid` (list + icon + description + arrow; different silhouette than cards).
- **Do not use when:** you need pricing or module deep-links—use `ModuleGrid` instead.

### `PillarModulePage` (template)
- **Use when:** building A2/A3 style pages with repeated structure: hero, includes, steps, outcomes, FAQ, CTA.
- **Do not use when:** editorial pages or highly custom product storytelling requires different section rhythm.
- **Props (layout variety):** `pillar` (`consulting` | `management` | `capital`) sets the accent band on “How it works”; `heroLayout` `overlay` (full-bleed image) vs `split` (text + framed image); `galleryLayout` `bento` (asymmetric first tile) vs `equal` (three equal tiles); `layoutVariant` `standard` vs `alternating` (two-column includes/outcomes then steps); `faqSurface` `muted` vs `base` (section background). Mix these across SKUs so module pages do not all look identical.

## Archetype mapping

- **A1 (Pillar hub):** `PageHero` or `SplitHero` + `ModuleGrid` + `LifecycleStrip` + `CtaBand`
- **A2 (Module/product):** `PillarModulePage`
- **A3 (Consulting offer):** `PillarModulePage` (consulting copy)
- **A4 (Capital product):** bespoke page + optional `CtaBand` + FAQ schema
- **A5 (Editorial):** insights templates
- **A6 (Utility):** form/contact/book patterns
