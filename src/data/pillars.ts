import {
  Briefcase,
  Building2,
  ClipboardList,
  Code2,
  Compass,
  Globe,
  Handshake,
  Landmark,
  LineChart,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { ModuleCardItem } from "../components/compositions";
import { ROUTES } from "../utils/navigation";

export const LIFECYCLE_STAGES = [
  "Clarify your model",
  "Form and comply",
  "Organize operations",
  "Reach customers",
  "Measure and grow",
  "Choose funding when it fits",
];

/**
 * Ori Management product suite — naming: `Ori + [Function]`.
 * Core: Formation, Vault (flagship system of record), Builder. Infrastructure: Hosting. Growth: Growth.
 */
export const MANAGEMENT_MODULES: ModuleCardItem[] = [
  {
    title: "Ori Formation",
    description: "Start your business the right way—structured, compliant, and ready to operate.",
    to: ROUTES.MANAGEMENT_FORMATION,
    icon: Building2,
    ctaLabel: "View product",
  },
  {
    title: "Ori Vault",
    description:
      "The source of truth for your business—identity, documents, ownership, and compliance in one place.",
    to: ROUTES.MANAGEMENT_BUSINESS_PROFILE,
    icon: ShieldCheck,
    ctaLabel: "View product",
  },
  {
    title: "Ori Builder",
    description: "Define your model and build with clarity before you scale.",
    to: ROUTES.MANAGEMENT_BUSINESS_BUILDER,
    icon: Compass,
    ctaLabel: "View product",
  },
  {
    title: "Ori Hosting",
    description:
      "Launch your business presence—domain, email, web, and VoIP with voice and SMS—so you operate professionally.",
    to: ROUTES.MANAGEMENT_HOSTING,
    icon: Globe,
    ctaLabel: "View product",
  },
  {
    title: "Ori Growth",
    description: "Capture demand, manage pipeline, and turn activity into predictable revenue.",
    to: ROUTES.MANAGEMENT_CRM_GROWTH,
    icon: LineChart,
    ctaLabel: "View product",
  },
];

/** Brand order (Consulting → Management → Funding) per Ori Capital Holdings LLC pillar strategy. */
export const PILLAR_OVERVIEW_CARDS: ModuleCardItem[] = [
  {
    title: "Consulting",
    description: "Get strategic guidance on sequencing, decisions, and execution from experienced operators.",
    to: ROUTES.CONSULTING,
    icon: Users,
  },
  {
    title: "Management",
    description: "Operate the business with systems, compliance, digital presence, and customer pipeline control.",
    to: ROUTES.MANAGEMENT,
    icon: ClipboardList,
  },
  {
    title: "Funding",
    description:
      "Access readiness support and funding pathways once your structure and records in Ori Vault support the conversation.",
    to: ROUTES.CAPITAL,
    icon: Landmark,
  },
];

export const CONSULTING_OFFERS: ModuleCardItem[] = [
  {
    title: "Startup coaching",
    description:
      "Move from idea to execution with clear direction, focused priorities, and early traction that actually compounds.",
    to: ROUTES.CONSULTING_COACHING,
    icon: Briefcase,
    badge: "Consulting",
  },
  {
    title: "Product development",
    description:
      "We design and build products from scope to delivery, turning ideas into working solutions tied to real outcomes.",
    to: ROUTES.CONSULTING_PRODUCT_DEVELOPMENT,
    icon: Code2,
    badge: "Consulting",
  },
  {
    title: "Management advisory",
    description:
      "Structure how the business runs day to day—systems, workflows, and activities that scale without breaking.",
    to: ROUTES.CONSULTING_STRUCTURING,
    icon: ShieldCheck,
    badge: "Consulting",
  },
  {
    title: "Funding strategy",
    description:
      "Raise when it makes sense and on your terms, positioning your business to be credible, fundable, and in control.",
    to: ROUTES.CONSULTING_CAPITAL_STRATEGY,
    icon: Handshake,
    badge: "Consulting",
  },
];
