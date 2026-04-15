/** Full-bleed collaboration / team photo used on home, referral hero, partner portal. */
export const HERO_COLLABORATION_BG =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80&auto=format&fit=crop";

/** Home hero only — multiracial team in a modern office meeting (same collaboration context as site management imagery). */
export const HOME_HERO_BACKGROUND =
  "https://images.unsplash.com/photo-1758691737543-09a1b2b715fa?w=1920&q=80&auto=format&fit=crop";

export interface ImageAsset {
  src: string;
  alt: string;
}

/**
 * Real photo assets by context.
 * Keep a blend of human/team/product-desk photos to avoid visual monotony.
 */
/** `/management` hub hero only — dashboards and metrics (structure / systems), not a generic meeting photo. */
export const MANAGEMENT_HUB_HERO_BACKDROP =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format&fit=crop";

export const MANAGEMENT_IMAGE_SET: ImageAsset[] = [
  {
    src: "https://images.unsplash.com/photo-1758691737543-09a1b2b715fa?w=1400&q=80&auto=format&fit=crop",
    alt: "Multiracial team of women and men collaborating in a modern office meeting",
  },
  {
    src: "https://images.unsplash.com/photo-1573497161079-f3fd25cc6b90?w=1400&q=80&auto=format&fit=crop",
    alt: "Professional working at a laptop in an office setting",
  },
  {
    src: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=1400&q=80&auto=format&fit=crop",
    alt: "Latino entrepreneur reviewing notes in a coworking space",
  },
];

export const CONSULTING_IMAGE_SET: ImageAsset[] = [
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&q=80&auto=format&fit=crop",
    alt: "Advisor presenting a strategic framework to a startup team",
  },
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=80&auto=format&fit=crop",
    alt: "Analytics dashboard with growth charts and trend lines",
  },
  {
    src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1400&q=80&auto=format&fit=crop",
    alt: "Consultant working through planning notes with a founder",
  },
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&q=80&auto=format&fit=crop",
    alt: "Developers collaborating on product and code",
  },
];

export const CAPITAL_IMAGE_SET: ImageAsset[] = [
  {
    src: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1400&q=80&auto=format&fit=crop",
    alt: "Closeup of financial planning and loan documents",
  },
  {
    src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1400&q=80&auto=format&fit=crop",
    alt: "Founder reviewing capital projections on a tablet",
  },
  {
    src: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1400&q=80&auto=format&fit=crop",
    alt: "Business partners shaking hands after agreement",
  },
];

/** Partners “Solutions → Capital” row — loan paperwork, funding docs, capital-ready desk (not the generic tablet-founder crop). */
export const PARTNER_SOLUTIONS_CAPITAL_IMAGE: ImageAsset = {
  src: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1400&q=80&auto=format&fit=crop",
  alt: "Financial planning and loan documents on a desk — funding paperwork and capital readiness",
};

/**
 * Home “where you fit” spotlight — one image per tab, matched to the story (starting vs scaling vs supporting).
 */
export const HOME_FIT_SPOTLIGHT: ImageAsset[] = [
  {
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80&auto=format&fit=crop",
    alt: "Founder workspace from above—laptop, notebook, and coffee while figuring out the next steps",
  },
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop",
    alt: "Growth and operations data on a laptop dashboard—tracking what to scale and what to fix",
  },
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&auto=format&fit=crop",
    alt: "Advisor walking a team through strategy at a whiteboard—supporting clients without doing it all yourself",
  },
];

/**
 * Photography for `/consulting/coaching` — playbook cards, filmstrips, and section accents.
 * Mix collaboration, desk execution, analytics, and capital context (distinct crops from generic hero).
 */
export const COACHING_PRODUCT_IMAGERY: readonly ImageAsset[] = [
  CONSULTING_IMAGE_SET[0]!,
  CONSULTING_IMAGE_SET[2]!,
  CONSULTING_IMAGE_SET[1]!,
  CONSULTING_IMAGE_SET[3]!,
  HOME_FIT_SPOTLIGHT[0]!,
  HOME_FIT_SPOTLIGHT[1]!,
  MANAGEMENT_IMAGE_SET[1]!,
  CAPITAL_IMAGE_SET[1]!,
] as const;

export const HOME_DIVERSE_FOUNDERS: ImageAsset[] = [
  {
    src: "https://images.unsplash.com/photo-1573496799515-eebbb63814f2?w=1400&q=80&auto=format&fit=crop",
    alt: "Black woman founder smiling in a modern office",
  },
  {
    src: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=1400&q=80&auto=format&fit=crop",
    alt: "Latino entrepreneur reviewing notes in a coworking space",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1400&q=80&auto=format&fit=crop",
    alt: "Multiracial team collaborating around a laptop",
  },
];

export const PARTNER_HERO_BG =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80&auto=format&fit=crop";

/**
 * Four-pane bento for Partners page “unlock” band (beside pillar copy).
 * Professional / operator contexts — matches hero + audience photography tone.
 */
export const PARTNER_UNLOCK_BENTO: readonly ImageAsset[] = [
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80&auto=format&fit=crop",
    alt: "",
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop",
    alt: "",
  },
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&auto=format&fit=crop",
    alt: "",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80&auto=format&fit=crop",
    alt: "",
  },
] as const;

/** Imagery for Partners “how we work together” steps (introduce → activate → deliver). */
export const PARTNER_WORKFLOW_STEPS: readonly ImageAsset[] = [
  {
    src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop",
    alt: "",
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80&auto=format&fit=crop",
    alt: "",
  },
  {
    src: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&q=80&auto=format&fit=crop",
    alt: "",
  },
] as const;

/** Wide panel for Partners “best fit” band — trusted-advisor context. */
export const PARTNER_BEST_FIT_PANEL: ImageAsset = {
  src: "https://images.unsplash.com/photo-1573497161079-f3fd25cc6b90?w=1400&q=80&auto=format&fit=crop",
  alt: "",
};

/** Soft backdrop for Partners final CTA (low-contrast; sits under elevated card). */
export const PARTNER_FINAL_CTA_BACKDROP =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80&auto=format&fit=crop";

export const MODULE_HERO_BACKGROUNDS = {
  management:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80&auto=format&fit=crop",
  consulting:
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&q=80&auto=format&fit=crop",
  capital:
    "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1920&q=80&auto=format&fit=crop",
} as const;

/** Referral “what determines funding” panel — underwriting-style desk (not hero inset or process strip). */
export const REFERRAL_FUNDING_EVAL_PANEL: ImageAsset = {
  src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1400&q=80&auto=format&fit=crop",
  alt: "Professional reviewing financial statements and funding paperwork at a desk",
};

/** Referral “why you’re here” backdrop — trusted partner introduction (avoid consumer trading / phone UI). */
export const REFERRAL_TRUST_INTRO_BACKDROP =
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=80&auto=format&fit=crop";

/**
 * `/funding-readiness/individual` hero — underwriting-style desk (personal credit + funding prep).
 * Distinct from generic “meeting” hero; matches Capital / referral funding-eval photography tone.
 */
export const INDIVIDUAL_READINESS_HERO_BACKDROP: ImageAsset = {
  src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80&auto=format&fit=crop",
  alt: "Professional reviewing financial statements and funding paperwork at a desk",
};

/**
 * `/funding-readiness` (business) hero — strategy / alignment context (not a generic stock-office crop).
 */
export const BUSINESS_FUNDING_READINESS_HERO_BACKDROP: ImageAsset = {
  src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&q=80&auto=format&fit=crop",
  alt: "Business team collaborating in a modern office — alignment and funding readiness",
};

/** Accent images for business readiness narrative bands. */
export const BUSINESS_FUNDING_READINESS_STORY_IMAGES: readonly ImageAsset[] = [
  {
    src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1400&q=80&auto=format&fit=crop",
    alt: "Financial documents and planning on a desk",
  },
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=80&auto=format&fit=crop",
    alt: "Business analytics and performance on a laptop",
  },
] as const;

/** Accent images for individual readiness story band (credit signal → review → clarity). */
export const INDIVIDUAL_READINESS_STORY_IMAGES: readonly ImageAsset[] = [
  {
    src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1400&q=80&auto=format&fit=crop",
    alt: "Credit cards and payment cards — personal credit signals lenders review",
  },
  {
    src: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1400&q=80&auto=format&fit=crop",
    alt: "Loan and financial planning documents on a desk",
  },
  {
    src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1400&q=80&auto=format&fit=crop",
    alt: "Founder reviewing projections on a tablet — planning the next funding step",
  },
] as const;
