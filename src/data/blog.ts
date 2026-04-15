/**
 * CMS-ready blog structure: tags, categories, author, date, reading time
 * Seed articles for Ori Capital Insights
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  date: string; // ISO
  readingTimeMinutes: number;
  tags: string[];
  category: string;
  /** @deprecated Prefer imageSrc; kept for backward compatibility */
  image?: string;
  /** Card and hero photography (HTTPS URL). */
  imageSrc?: string;
}

/** Unsplash photos — topic-aligned, consistent sizing. */
const COVER = {
  underwriting:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop",
  readiness:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop",
  credit:
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80&auto=format&fit=crop",
  fundingTypes:
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80&auto=format&fit=crop",
  fundability:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80&auto=format&fit=crop",
} as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "what-lenders-look-at-before-approving-financing",
    title: "What lenders look at before approving financing",
    excerpt: "Understand the core underwriting signals that influence approvals, limits, and pricing.",
    body: "Lenders typically evaluate business credibility, revenue consistency, time in business, credit profile, and overall risk. This guide breaks down each signal and explains how to strengthen weak areas before applying so your application is easier to approve.",
    author: "Ori Holdings",
    date: "2026-03-20",
    readingTimeMinutes: 5,
    tags: ["underwriting", "funding readiness", "lender criteria"],
    category: "Underwriting",
    imageSrc: COVER.underwriting,
  },
  {
    slug: "why-businesses-get-denied",
    title: "Why businesses get denied",
    excerpt: "Most denials are not random. They are usually tied to missing signals or misaligned product choice.",
    body: "When businesses are declined, it is often due to readiness gaps, weak documentation, thin credit depth, or product mismatch. This article outlines the most common denial reasons and practical actions to fix them before the next application.",
    author: "Ori Holdings",
    date: "2026-03-21",
    readingTimeMinutes: 6,
    tags: ["denials", "application strategy", "readiness"],
    category: "Readiness",
    imageSrc: COVER.readiness,
  },
  {
    slug: "business-credit-explained",
    title: "Business credit explained",
    excerpt: "A practical walkthrough of how business credit is built and why it matters for funding access.",
    body: "Business credit affects lender confidence, facility size, and borrowing flexibility. This guide explains reporting basics, trade lines, utilization, and timeline expectations so founders can build stronger credit infrastructure over time.",
    author: "Ori Holdings",
    date: "2026-03-22",
    readingTimeMinutes: 7,
    tags: ["business credit", "credit building", "fundability"],
    category: "Credit",
    imageSrc: COVER.credit,
  },
  {
    slug: "funding-types-breakdown",
    title: "Funding types breakdown",
    excerpt: "Compare credit cards, lines of credit, term loans, and other common structures by use case.",
    body: "Every funding type has tradeoffs. This resource compares common products, when each is useful, when to avoid it, and what requirements are typical so you can choose strategically instead of reactively.",
    author: "Ori Holdings",
    date: "2026-03-23",
    readingTimeMinutes: 4,
    tags: ["funding types", "funding strategy", "credit options"],
    category: "Funding Types",
    imageSrc: COVER.fundingTypes,
  },
  {
    slug: "how-to-become-more-fundable",
    title: "How to become more fundable",
    excerpt: "A staged readiness roadmap to improve lender confidence before your next application.",
    body: "Fundability improves when your business sends stronger operational and financial signals. This article covers the Ori readiness stages and how to move from uncertain eligibility to stronger approval potential with a clear plan.",
    author: "Ori Holdings",
    date: "2026-03-24",
    readingTimeMinutes: 5,
    tags: ["fundability", "readiness framework", "approval odds"],
    category: "Fundability",
    imageSrc: COVER.fundability,
  },
  {
    slug: "sharpen-your-business-model",
    title: "Sharpen your business model",
    excerpt: "Define who you serve, how you win, and what actually drives profit.",
    body: "Full article coming soon.",
    author: "Ori Holdings",
    date: "2026-03-25",
    readingTimeMinutes: 6,
    tags: ["consulting", "business model", "strategy"],
    category: "Consulting",
    imageSrc: COVER.readiness,
  },
  {
    slug: "build-the-right-foundation",
    title: "Build the right foundation",
    excerpt: "Structure the business correctly from day one—entity, compliance, and reporting.",
    body: "Full article coming soon.",
    author: "Ori Holdings",
    date: "2026-03-26",
    readingTimeMinutes: 6,
    tags: ["consulting", "compliance", "entity"],
    category: "Consulting",
    imageSrc: COVER.credit,
  },
  {
    slug: "systemize-your-operations",
    title: "Systemize your operations",
    excerpt: "Turn moving parts into systems with clear ownership.",
    body: "Full article coming soon.",
    author: "Ori Holdings",
    date: "2026-03-27",
    readingTimeMinutes: 6,
    tags: ["consulting", "operations", "systems"],
    category: "Consulting",
    imageSrc: COVER.underwriting,
  },
  {
    slug: "build-a-predictable-pipeline",
    title: "Build a predictable pipeline",
    excerpt: "Replace guesswork with a measurable path to customers.",
    body: "Full article coming soon.",
    author: "Ori Holdings",
    date: "2026-03-28",
    readingTimeMinutes: 5,
    tags: ["consulting", "pipeline", "growth"],
    category: "Consulting",
    imageSrc: COVER.fundingTypes,
  },
  {
    slug: "install-your-growth-engine",
    title: "Install your growth engine",
    excerpt: "Track what actually matters: conversion, cash flow, and unit economics.",
    body: "Full article coming soon.",
    author: "Ori Holdings",
    date: "2026-03-29",
    readingTimeMinutes: 6,
    tags: ["consulting", "metrics", "growth"],
    category: "Consulting",
    imageSrc: COVER.readiness,
  },
  {
    slug: "deploy-capital-strategically",
    title: "Deploy capital strategically",
    excerpt: "Use funding when the business is ready to absorb and multiply it.",
    body: "Full article coming soon.",
    author: "Ori Holdings",
    date: "2026-03-30",
    readingTimeMinutes: 6,
    tags: ["consulting", "capital", "strategy"],
    category: "Consulting",
    imageSrc: COVER.fundability,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const byTag = blogPosts.filter(
    (p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t))
  );
  const byCategory = blogPosts.filter(
    (p) => p.slug !== post.slug && p.category === post.category && !byTag.includes(p)
  );
  const combined = [...byTag, ...byCategory];
  return combined.slice(0, limit);
}

/** Cover image for cards and related posts (photo URL or legacy bundled asset). */
export function getPostCoverSrc(post: BlogPost): string | undefined {
  return post.imageSrc ?? post.image;
}

/** Consistent abstract gradient for post card thumbnails when image is not set (hash from slug). */
const GRADIENTS = [
  "linear-gradient(135deg, rgba(201,243,29,0.12) 0%, rgba(201,243,29,0.02) 50%, transparent 70%)",
  "linear-gradient(225deg, rgba(201,243,29,0.08) 0%, transparent 50%)",
  "linear-gradient(315deg, rgba(201,243,29,0.06) 0%, rgba(42,42,46,0.8) 100%)",
  "linear-gradient(180deg, rgba(201,243,29,0.1) 0%, transparent 60%)",
];

export function getPostThumbnailStyle(slug: string): { backgroundImage: string } {
  let n = 0;
  for (let i = 0; i < slug.length; i++) n += slug.charCodeAt(i);
  const idx = Math.abs(n) % GRADIENTS.length;
  return { backgroundImage: GRADIENTS[idx] };
}
