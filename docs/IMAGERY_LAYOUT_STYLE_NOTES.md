# Ori Rebrand - Imagery and Layout Style Notes

These notes capture implementation styles observed across reference websites and how to apply them in Ori.

## Core observation

Most reference sites do not rely on one visual type. They rotate between:

- Human photography (trust/emotion)
- Product UI mockups (capability/proof)
- Data/metric blocks (credibility)
- Logo rails and badges (social proof)
- Gradient/illustration backgrounds (brand texture)

The visual mix is what prevents "card fatigue."

## Site pattern notes

## Hosting.com

- Uses full-bleed product-like dashboard visuals with layered foreground cards.
- White-label imagery directly supports feature copy.
- Repeated "supporting overlay card" motif gives depth without long text.

Apply in Ori:
- Show mock CRM/readiness overlays on top of larger product canvases.
- Place short benefit copy directly on visual blocks.

## GoHighLevel

- Strong hero visuals + repeated "workflow" explanation frames.
- Feature groups include channel-specific iconography and mini visual cues.
- Copy is punchy, direct, and outcome-focused.

Apply in Ori:
- Use "single sentence outcome + visual panel" instead of long explanatory paragraphs.
- Add repeated but varied mini visuals inside each major feature section.

## Credit Suite

- Alternates photos, product demos, and process explanations.
- Emphasizes "old way vs new way" comparison blocks.

Apply in Ori:
- Add contrast layouts (before/after readiness, reactive vs strategic capital).
- Pair each comparison with visual cues or supporting screenshots.

## Mailchimp

- Heavy use of contextual product mockups by persona/industry.
- Repeated "left integrations + center product + right automation" triptych structure.
- Adds trust logos and ratings throughout.

Apply in Ori:
- Introduce multi-panel "system flow" visuals: inputs -> orchestration -> outputs.
- Add partner/tool logo strips where integrations are mentioned.

## Twilio

- Uses alternating image-content modules (left image/right copy, then reverse).
- Blends human portraits with code/product visuals.
- Strong proof tiles (reports, stats, customer logos, case outcomes).

Apply in Ori:
- Alternate layout direction every section to avoid monotony.
- Add proof/report tiles and measurable outcomes near CTAs.

## Techstars / EC / LaunchTN

- Community-first imagery (people, founders, events) to create momentum and belonging.
- Story cards with strong visual entry points.
- Section-level identity changes with varied spacing and density.

Apply in Ori:
- Add founder/team/community imagery where we discuss advisory and partnerships.
- Use story-style feature blocks with visual anchors and concise takeaways.

## Implementation styles for Ori (design system targets)

Every top-level page should include at least 3 of the 6 styles below:

1. Full-bleed hero image with overlay copy
2. Product mockup frame(s) with dashboard-style placeholders
3. Human photography strip or collage
4. Metric/proof tiles (stats, outcomes, readiness indicators)
5. Badge/logo rail (partners, tools, trust marks)
6. Split-band gradient + icon illustration section

## Copy tone direction

Target voice:

- Direct, confident, pragmatic
- Less "instructional explainer", more "operator shorthand"
- Outcome-first language with shorter sentences
- Avoid over-formal underwriting jargon where plain language works

Example shift:

- Old: "Use readiness tools and applications when financing is the right lever."
- New: "Apply when your profile is ready, not when panic kicks in."

## Asset pipeline recommendations

- Build `siteImagery.ts` as categorized sets (management, consulting, capital, partner).
- Support mixed source types:
  - Real photography
  - Product screenshot placeholders
  - Simple SVG/gradient illustrations
- Enforce alt text quality in each asset object.

## QA checklist for each page

- At least 2 real images visible above first two scrolls
- No more than 2 consecutive sections with identical layout structure
- At least one "proof" visual (metrics/badges/logos/reports)
- Copy blocks under ~3 lines per paragraph for scanability
- Mobile image cropping preserves subject focus
