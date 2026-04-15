# Phase 9 — Accessibility & quality checklist

**Authority:** [PLATFORM_LIFECYCLE_SPEC.md](./PLATFORM_LIFECYCLE_SPEC.md) §9.3

Use this before major releases or quarterly. Record date and owner in your release notes when complete.

## Per-page / global

- [ ] **One `h1`** per route view (marketing + apply flows).
- [ ] **Heading order** — no skipped levels (`h1` → `h2` → `h3`).
- [ ] **Landmarks** — `main`, `header`/`nav`, `footer` present; skip link targets `#main`.
- [ ] **Focus visible** — keyboard tab through nav drawer, modals, forms; focus ring visible.
- [ ] **Images** — meaningful `alt`; decorative `alt=""`.

## Motion

- [ ] **`prefers-reduced-motion`** — decorative animations disabled or minimized (`index.css` + spot-check new components).

## Color & contrast

- [ ] **Body text** — readable on `bg-ori-black` / `bg-ori-section-alt` in dark and `html.light`.
- [ ] **Links** — accent links distinguishable from body (underline on hover acceptable).

## Forms

- [ ] **Labels** — inputs associated with labels or `aria-label`.
- [ ] **Errors** — announced or associated with fields (`aria-describedby` where applicable).

## Smoke targets

- [ ] Home → pillar hubs → module → apply
- [ ] Mobile nav drawer open/close + focus trap
- [ ] Partner page hero + register flow

## Performance (optional same pass)

- [ ] Lighthouse performance on Home + `/apply` (mobile).
- [ ] Large images lazy-loaded except LCP hero.


## Automated verification

Run `npm run test` and `npm run test:e2e` before release; fix any regressions those suites surface alongside this checklist.
