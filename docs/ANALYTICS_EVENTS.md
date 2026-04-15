# Ori marketing analytics events

**Authority:** [PLATFORM_LIFECYCLE_SPEC.md](./PLATFORM_LIFECYCLE_SPEC.md) §9.2

Events are sent via **`window.gtag`** (GA4) and **`window.fbq('trackCustom', …)`** (Meta) when those scripts are loaded. In local dev without IDs, calls are no-ops.

## Automatic route views

On each React Router navigation, `trackOriRouteView(pathname)` runs from `Analytics.tsx`.

| Event name | When |
|------------|------|
| `ori_view_pillar_management` | `/management` |
| `ori_view_pillar_consulting` | `/consulting` |
| `ori_view_pillar_capital` | `/capital` |
| `ori_view_get_started` | `/get-started` |
| `ori_view_pricing` | `/pricing` |
| `ori_view_apply` | `/apply` |
| `ori_view_management_module` | `/management/*` (param `path`) |
| `ori_view_consulting_offer` | `/consulting/coaching`, `structuring`, `capital-strategy`, `book` (param `path`) |

## Explicit actions

| Event name | When |
|------------|------|
| `ori_apply_submit_attempt` | Apply form submit started |
| `ori_apply_submit_success` | Apply form POST succeeded |
| `ori_get_started_journey_select` | Get started card CTA (param `journey_id`) |
| `ori_pricing_tier_cta` | Pricing “Request quote” (param `tier`) |
| `ori_home_primary_cta` | Home hero / key CTAs (param `cta`) |
| `ori_partner_funnel_cta` | Partners page CTAs (params `cta`, optional `segment`) |

## GA4 configuration

Register custom definitions in GA4 (Admin → Custom definitions) for parameters you care about: `path`, `journey_id`, `tier`, `cta`.

## Code

- `src/lib/analytics/oriEvents.ts` — names + `trackOriEvent`
- `src/lib/analytics/trackOriRouteView.ts` — pathname mapping
