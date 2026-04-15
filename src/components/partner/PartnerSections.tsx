import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../Button";
import { PageSection, SectionHeading } from "../system";
import {
  PARTNER_SOLUTIONS_CAPITAL_IMAGE,
  CONSULTING_IMAGE_SET,
  PARTNER_BEST_FIT_PANEL,
  PARTNER_HERO_BG,
  PARTNER_UNLOCK_BENTO,
  PARTNER_WORKFLOW_STEPS,
} from "../../constants/siteImagery";
import type { PartnerType } from "../../lib/backoffice/types";
import { ORI_EVENTS, trackOriEvent } from "../../lib/analytics/oriEvents";
import { ROUTES } from "../../utils/navigation";

const audienceCards: {
  title: string;
  image: string;
  imageAlt: string;
  benefit: string;
  partnerType: PartnerType;
}[] = [
  {
    title: "Accelerators & Incubators",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Team collaborating at a table",
    benefit:
      "Turn cohorts into companies that keep moving after the program ends. We help founders carry momentum into real operations, decisions, and growth.",
    partnerType: "ACCELERATOR_INCUBATOR",
  },
  {
    title: "Investors & Angel Networks",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Business handshake",
    benefit:
      "See stronger founders earlier and spend more time backing, not sorting. We help founders show up with clarity and readiness before you engage deeply.",
    partnerType: "INVESTOR_VC_ANGEL",
  },
  {
    title: "CPAs, Accountants & Bookkeepers",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Financial documents and laptop",
    benefit:
      "Help clients act on the numbers, not just report them. We connect financial insight to direction, decisions, and forward movement.",
    partnerType: "ACCOUNTANT_BOOKKEEPER",
  },
  {
    title: "Attorneys & Advisors",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Law library and professional setting",
    benefit:
      "Keep deals and decisions moving instead of stalling after structure is set. We help clients follow through so strategy turns into real progress.",
    partnerType: "ATTORNEY",
  },
  {
    title: "Consultants & Coaches",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Coaching session",
    benefit:
      "Turn insight into progress your clients can actually sustain. We help translate clarity into action, momentum, and next steps.",
    partnerType: "BUSINESS_CONSULTANT_COACH",
  },
  {
    title: "Real Estate & Business Brokers",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Keys and home model",
    benefit:
      "Make sure deals translate into outcomes that hold after closing. We help clients get positioned before and operate effectively after the transaction.",
    partnerType: "OTHER",
  },
  {
    title: "Economic Development Organizations",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Urban skyline and city development",
    benefit:
      "Drive measurable progress across the businesses you support. We help standardize how businesses move forward so outcomes can be tracked and scaled.",
    partnerType: "ECONOMIC_DEV_NONPROFIT",
  },
  {
    title: "Agencies & Service Providers",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Creative team at work",
    benefit:
      "Deliver more value to clients without changing how you operate. We plug into your existing model and extend it into deeper support and results.",
    partnerType: "AGENCY_SERVICE_PROVIDER",
  },
];

const unlockPillars: {
  title: string;
  copy: string;
  icon: "lifecycle" | "execution" | "infrastructure" | "retention";
}[] = [
  {
    title: "A complete business lifecycle solution",
    copy: "From formation to operations to funding, your clients move through a single, connected system instead of fragmented services.",
    icon: "lifecycle",
  },
  {
    title: "Built-in execution, not just advice",
    copy: "Move beyond recommendations into implementation, systems, and real operational progress your clients can actually run on.",
    icon: "execution",
  },
  {
    title: "Infrastructure without overhead",
    copy: "Deliver systems, workflows, and capital readiness without hiring, building, or managing new internal teams.",
    icon: "infrastructure",
  },
  {
    title: "Stronger retention and higher client value",
    copy: "Clients stay longer, go further, and rely on you for more because you're tied to outcomes, not just sessions.",
    icon: "retention",
  },
];

const partnershipSteps = [
  {
    title: "Introduce",
    copy: "You identify clients who need more than what you currently offer.",
  },
  {
    title: "Activate",
    copy: "We engage with your client through services, tools, or capital pathways.",
  },
  {
    title: "Deliver",
    copy: "Your client gets outcomes. You stay positioned as the trusted partner.",
  },
];

const offerColumns: {
  title: string;
  copy: string;
  imageSrc: string;
  borderAccent: string;
  detailParagraphs: string[];
  learnMoreTo: (typeof ROUTES)[keyof typeof ROUTES];
}[] = [
  {
    title: "Services",
    copy: "Clarity at the moments that matter",
    imageSrc: CONSULTING_IMAGE_SET[2].src,
    borderAccent: "var(--color-ori-pillar-consulting-hint)",
    learnMoreTo: ROUTES.CONSULTING,
    detailParagraphs: [
      "Give your clients operator-level access: what to do, what to delay, and what drives real progress. We help turn insight and ideas into decisions and products that move the business forward.",
    ],
  },
  {
    title: "Tools",
    copy: "Execution that actually holds",
    imageSrc: CONSULTING_IMAGE_SET[1].src,
    borderAccent: "color-mix(in srgb, var(--color-ori-accent) 65%, var(--color-ori-surface-base))",
    learnMoreTo: ROUTES.MANAGEMENT,
    detailParagraphs: [
      "Turn your recommendations into systems, workflows, and structure your clients can operate on. What you advise becomes how the business runs.",
    ],
  },
  {
    title: "Capital",
    copy: "Access, on the right terms",
    imageSrc: PARTNER_SOLUTIONS_CAPITAL_IMAGE.src,
    borderAccent: "var(--color-ori-pillar-capital-hint)",
    learnMoreTo: ROUTES.CAPITAL,
    detailParagraphs: [
      "Help your clients become fundable. We align the business with how capital actually works, then help access it when the timing is right.",
    ],
  },
];

const partnershipModels: {
  title: string;
  lead: string;
  body: string[];
  icon: "referral" | "embedded" | "strategic";
}[] = [
  {
    title: "Referral",
    lead: "Send opportunities. We handle delivery.",
    body: [
      "You stay focused on your core work while giving clients access to deeper support when they need it.",
    ],
    icon: "referral",
  },
  {
    title: "Embedded",
    lead: "Ori becomes part of your offering or program.",
    body: [
      "We integrate directly into how you already serve clients—whether that’s a cohort, service package, or ongoing engagement.",
    ],
    icon: "embedded",
  },
  {
    title: "Strategic",
    lead: "Deeper collaboration across your ecosystem or portfolio.",
    body: [
      "We work alongside you at the portfolio or network level—shaping how businesses move from early support to real outcomes.",
    ],
    icon: "strategic",
  },
];

const bestFitLines = [
  "Work directly with founders, operators, or small businesses",
  "Influence decisions around growth, operations, or funding",
  "Want to deliver more outcomes without building new infrastructure",
];

function UnlockIcon({
  name,
  compact,
}: {
  name: (typeof unlockPillars)[number]["icon"];
  compact?: boolean;
}) {
  const common = compact ? "h-6 w-6 shrink-0 text-ori-accent" : "h-9 w-9 shrink-0 text-ori-accent";
  const sw = compact ? "1.5" : "1.75";
  switch (name) {
    case "lifecycle":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} aria-hidden>
          <circle cx="12" cy="5.5" r="2.25" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="16.5" r="2.25" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="16.5" r="2.25" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M11 7.4L7.3 14.6M13 7.4l3.7 7.2M7.9 16.5h8.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "execution":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} aria-hidden>
          <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "infrastructure":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} aria-hidden>
          <path d="M3 21h18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 21V10l6-3.5V21M12 6.5L18 10v11" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 14h1.5M9 17.5h1.5M13.5 14H15M13.5 17.5H15" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "retention":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} aria-hidden>
          <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 7h7v7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

/** Asymmetric mosaic — avoids mirroring the text grid; uses depth, rotation, and varied scale. */
function PartnerUnlockMosaic() {
  const [primary, overlap, satellite, strip] = PARTNER_UNLOCK_BENTO;
  return (
    <figure
      className="group/mosaic relative mx-auto w-full max-w-xl sm:max-w-2xl lg:mx-0 lg:max-w-none"
      aria-label="Operators and teams in professional settings"
    >
      <div
        className="pointer-events-none absolute -left-[12%] -top-[10%] h-[55%] w-[70%] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-ori-accent)_14%,transparent),transparent_68%)] opacity-80 blur-3xl motion-reduce:opacity-40 motion-reduce:blur-2xl"
        aria-hidden
      />
      <div className="relative z-10 pt-2 sm:pt-4 lg:pt-1">
        <div className="relative w-[96%] max-w-[400px] sm:max-w-[460px] lg:max-w-none lg:w-[92%]">
          <div className="relative aspect-[3/4] max-h-[min(400px,56vh)] overflow-hidden rounded-2xl shadow-[0_36px_90px_-44px_rgba(0,0,0,0.95)] ring-1 ring-white/[0.08] sm:max-h-[min(440px,54vh)] lg:max-h-[min(520px,54vh)] lg:rounded-[1.5rem]">
            <img
              src={primary.src}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ori-black/65 via-ori-black/10 to-ori-black/35" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
          </div>

          <div
            className="motion-safe:transition motion-safe:duration-500 motion-safe:ease-out absolute -right-[4%] bottom-[6%] z-20 w-[min(58%,288px)] sm:w-[min(56%,332px)] lg:-right-[2%] lg:bottom-[10%] lg:w-[50%] motion-safe:group-hover/mosaic:-translate-y-1"
          >
            <div className="group/mosaic-overlap relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.08] bg-ori-charcoal shadow-[0_28px_70px_-36px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.06] motion-safe:transition motion-safe:duration-500 motion-reduce:rotate-0 sm:rotate-[2.5deg] motion-safe:group-hover/mosaic:sm:rotate-[1deg]">
              <img
                src={overlap.src}
                alt=""
                className="h-full w-full object-cover motion-safe:transition motion-safe:duration-700 motion-safe:group-hover/mosaic-overlap:scale-[1.03]"
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ori-black/75 via-transparent to-ori-black/20" />
            </div>
          </div>

          <div className="absolute -right-[2%] top-[2%] z-30 hidden w-[38%] max-w-[172px] sm:block lg:max-w-[200px]">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/[0.1] shadow-[0_20px_50px_-28px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.05] motion-reduce:rotate-0 sm:-rotate-[4deg]">
              <img
                src={satellite.src}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ori-black/40 via-transparent to-ori-black/50" />
            </div>
          </div>

          <div className="absolute bottom-[2%] left-[6%] z-10 hidden h-14 w-[62%] overflow-hidden rounded-lg border border-white/[0.06] shadow-lg ring-1 ring-inset ring-white/[0.05] md:block lg:h-16 lg:w-[66%]">
            <img
              src={strip.src}
              alt=""
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ori-black/50 via-transparent to-ori-black/40" />
          </div>
        </div>
      </div>
    </figure>
  );
}

/**
 * Partnership model marks — keep in sync with `PartnerModelMicroCue` (same story, smaller rhythm line).
 * Referral: linear handoff. Embedded: Ori as a module inside your program edge. Strategic: hub + satellites.
 */
function ModelIcon({ name, compact }: { name: (typeof partnershipModels)[number]["icon"]; compact?: boolean }) {
  const sw = compact ? "1.55" : "1.6";
  const common = compact ? "h-5 w-5 shrink-0 text-ori-accent" : "h-8 w-8 shrink-0 text-ori-accent";
  switch (name) {
    case "referral":
      /* You → Ori → client handoff (not a generic “send” mark). */
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="5.5" cy="12" r="2.2" stroke="currentColor" strokeWidth={sw} strokeOpacity="0.55" />
          <path d="M8 12h2.25" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeOpacity="0.5" />
          <circle cx="12" cy="12" r="3.35" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth={sw} />
          <path d="M15.25 12H17" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeOpacity="0.5" />
          <circle cx="18.5" cy="12" r="2.2" stroke="currentColor" strokeWidth={sw} strokeOpacity="0.55" />
        </svg>
      );
    case "embedded":
      /* Your program boundary (dashed) + Ori as the filled module inside — mirrors referral’s “center weight”. */
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="3.5"
            stroke="currentColor"
            strokeWidth={sw}
            strokeDasharray="3 3.5"
            strokeOpacity="0.38"
            strokeLinejoin="round"
          />
          <rect
            x="7"
            y="7"
            width="10"
            height="10"
            rx="2"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="currentColor"
            strokeWidth={compact ? "1.75" : "1.85"}
            strokeLinejoin="round"
          />
        </svg>
      );
    case "strategic":
      /* Same hub-and-spoke topology as the micro cue: one coordinating center, three ecosystem nodes. */
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 7.35V9.85M7.35 15.45l2.15-1.55M16.65 15.45l-2.15-1.55"
            stroke="currentColor"
            strokeWidth={compact ? "1.35" : "1.4"}
            strokeLinecap="round"
            strokeOpacity="0.42"
          />
          <circle cx="12" cy="5.25" r="2" stroke="currentColor" strokeWidth={sw} strokeOpacity="0.65" />
          <circle cx="6.2" cy="16.2" r="2" stroke="currentColor" strokeWidth={sw} strokeOpacity="0.65" />
          <circle cx="17.8" cy="16.2" r="2" stroke="currentColor" strokeWidth={sw} strokeOpacity="0.65" />
          <circle cx="12" cy="12" r="3.35" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth={sw} />
        </svg>
      );
    default:
      return null;
  }
}

/** Under-lead rhythm line — same metaphor as `ModelIcon`, not a second concept. */
function PartnerModelMicroCue({ variant }: { variant: (typeof partnershipModels)[number]["icon"] }) {
  if (variant === "referral") {
    return (
      <svg
        className="mt-3 h-[14px] w-full max-w-[5.75rem] text-ori-accent sm:max-w-[6.25rem]"
        viewBox="0 0 72 14"
        fill="none"
        aria-hidden
      >
        <circle cx="9" cy="7" r="2.75" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
        <path d="M12 7H32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
        <circle cx="36" cy="7" r="4" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.2" />
        <path d="M40 7H60" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
        <circle cx="63" cy="7" r="2.75" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
      </svg>
    );
  }
  if (variant === "embedded") {
    return (
      <svg
        className="mt-3 h-[18px] w-full max-w-[4.5rem] text-ori-accent"
        viewBox="0 0 48 18"
        fill="none"
        aria-hidden
      >
        <rect
          x="1"
          y="1"
          width="46"
          height="16"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeDasharray="3 3"
          strokeOpacity="0.35"
        />
        <rect
          x="12"
          y="5"
          width="24"
          height="8"
          rx="1.75"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeOpacity="0.95"
        />
      </svg>
    );
  }
  return (
    <svg
      className="mt-3 h-[18px] w-full max-w-[6.5rem] text-ori-accent sm:max-w-[7rem]"
      viewBox="0 0 80 18"
      fill="none"
      aria-hidden
    >
      <circle cx="40" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.45" />
      <path d="M40 6.75v2.25" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.38" />
      <circle cx="14" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.45" />
      <path d="M16.2 12.4l4.2-3.1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.38" />
      <circle cx="66" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.45" />
      <path d="M63.8 12.4l-4.2-3.1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.38" />
      <circle cx="40" cy="12" r="4.25" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.15" />
    </svg>
  );
}

function PartnerOfferPillarRow({ col, index }: { col: (typeof offerColumns)[number]; index: number }) {
  const rowRef = useRef<HTMLElement>(null);
  const [isLg, setIsLg] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );
  const [revealedByScroll, setRevealedByScroll] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    const mqLg = window.matchMedia("(min-width: 1024px)");
    let io: IntersectionObserver | undefined;

    const syncLg = () => setIsLg(mqLg.matches);
    syncLg();

    const attachIo = () => {
      io?.disconnect();
      io = undefined;
      if (!el || mqLg.matches) {
        setRevealedByScroll(false);
        return;
      }
      io = new IntersectionObserver(
        ([e]) => {
          if (e?.isIntersecting) setRevealedByScroll(true);
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
      );
      io.observe(el);
    };

    attachIo();
    const onMq = () => {
      syncLg();
      setRevealedByScroll(false);
      attachIo();
    };
    mqLg.addEventListener("change", onMq);
    return () => {
      io?.disconnect();
      mqLg.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <article
      ref={rowRef}
      className={`group/offer flex flex-col overflow-hidden rounded-xl border border-ori-border bg-ori-surface/95 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.05] lg:flex-row lg:items-stretch ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
    >
      <div className="relative aspect-[2/1] min-h-[7rem] shrink-0 sm:aspect-[16/9] lg:aspect-auto lg:w-[36%] lg:min-h-[9.5rem]">
        <img
          src={col.imageSrc}
          alt=""
          className="h-full w-full object-cover motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ori-black/85 via-ori-black/35 to-ori-black/15 lg:bg-gradient-to-r lg:from-transparent lg:via-ori-black/25 lg:to-ori-black/70" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
        <p className="absolute bottom-3 left-3 font-display text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ori-accent/90 lg:top-3 lg:bottom-auto">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="absolute bottom-3 right-3 max-w-[78%] text-right font-display text-2xl font-bold tracking-tight text-ori-foreground drop-shadow-[0_2px_14px_rgba(0,0,0,0.92)] sm:text-3xl lg:bottom-auto lg:left-3 lg:right-auto lg:top-1/2 lg:max-w-[88%] lg:-translate-y-1/2 lg:text-left lg:text-4xl">
          {col.title}
        </h3>
      </div>
      <div
        className={`flex flex-1 flex-col justify-center border-ori-border/80 bg-ori-black/12 px-4 py-6 backdrop-blur-[2px] md:px-7 md:py-7 lg:max-w-none lg:border-t-0 lg:py-8 ${index % 2 === 0 ? "border-t-[3px] lg:border-l-[3px] lg:border-t-0" : "border-t-[3px] lg:border-r-[3px] lg:border-t-0"}`}
        style={
          index % 2 === 0
            ? { borderLeftColor: col.borderAccent, borderTopColor: col.borderAccent }
            : { borderRightColor: col.borderAccent, borderTopColor: col.borderAccent }
        }
      >
        <p className="max-w-2xl text-[0.9375rem] leading-[1.65] text-ori-muted md:text-base md:leading-[1.6]">{col.copy}</p>
        {!isLg && !revealedByScroll ? (
          <p className="mt-2 text-[0.65rem] uppercase tracking-wider text-ori-muted/70">Scroll — more opens as this row enters view</p>
        ) : null}
        <div
          className="mt-4 grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:grid-rows-[1fr] lg:mt-5 lg:grid-rows-[0fr] lg:group-hover/offer:grid-rows-[1fr]"
          style={!isLg ? { gridTemplateRows: revealedByScroll ? "1fr" : "0fr" } : undefined}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="border-t border-ori-border/50 pt-4">
              <p className="max-w-2xl text-sm leading-[1.65] text-ori-muted/95 md:text-[0.9375rem] md:leading-[1.7] text-pretty">
                {col.detailParagraphs.join(" ")}
              </p>
              <div className="mt-4">
                <Button to={col.learnMoreTo} variant="outline" size="sm">
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

const partnerAudiencePrimary = audienceCards.slice(0, 6);
const partnerAudienceTail = audienceCards.slice(6);

function PartnerAudienceCard({
  item,
}: {
  item: (typeof audienceCards)[number];
}) {
  const to = `${ROUTES.PARTNER_REGISTER}?type=${encodeURIComponent(item.partnerType)}`;
  return (
    <Link
      to={to}
      className="group flex flex-col overflow-hidden rounded-xl border border-ori-border bg-ori-surface shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition hover:border-ori-accent/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-black"
      onClick={() =>
        trackOriEvent(ORI_EVENTS.PARTNER_FUNNEL_CTA, { cta: "audience_card", segment: item.title })
      }
    >
      <div className="h-32 shrink-0 overflow-hidden bg-ori-charcoal sm:h-36">
        <img
          src={item.image}
          alt=""
          className="h-full w-full object-cover transition duration-500 motion-reduce:transition-none group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="font-display text-base font-semibold leading-snug text-ori-foreground md:text-lg">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ori-muted">{item.benefit}</p>
      </div>
    </Link>
  );
}

const sectionScroll = "scroll-mt-[var(--ori-header-offset,0px)]";

export function PartnerHeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] min-h-screen flex-col justify-center overflow-hidden border-b border-ori-border bg-ori-black">
      <img
        src={PARTNER_HERO_BG}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ori-black/75 via-ori-black/70 to-ori-black" />
      <div className="relative ori-container flex min-h-0 flex-1 flex-col justify-center py-16 md:py-24">
        <p className="ori-type-eyebrow">Partners</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-ori-foreground md:text-5xl lg:text-6xl">
          Add what your network is missing
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ori-muted md:text-lg">
          You already serve entrepreneurs. We help you extend your offering with consulting, operational systems, and access to
          capital.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            to={ROUTES.PARTNER_REGISTER}
            size="lg"
            className="min-w-[180px]"
            onClick={() => trackOriEvent(ORI_EVENTS.PARTNER_FUNNEL_CTA, { cta: "hero_apply" })}
          >
            Partner with Ori
          </Button>
          <Button
            href="#how-partnership-works"
            variant="outline"
            size="lg"
            className="min-w-[180px]"
            onClick={() => trackOriEvent(ORI_EVENTS.PARTNER_FUNNEL_CTA, { cta: "hero_see_how" })}
          >
            See how it works
          </Button>
        </div>
      </div>
    </section>
  );
}

export function PartnerAudienceSection() {
  return (
    <PageSection variant="normal" container className={`bg-ori-black py-16 md:py-24 ${sectionScroll}`}>
      <SectionHeading
        align="left"
        title="Where Ori fits in your world"
        subtitle="You support businesses in different ways. We add the infrastructure and capital pathways your clients need to move forward."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {partnerAudiencePrimary.map((item) => (
          <PartnerAudienceCard key={item.title} item={item} />
        ))}
      </div>
      <div className="mx-auto mt-5 grid w-full max-w-3xl gap-5 sm:grid-cols-2">
        {partnerAudienceTail.map((item) => (
          <PartnerAudienceCard key={item.title} item={item} />
        ))}
      </div>
    </PageSection>
  );
}

export function PartnerUnlockSection() {
  return (
    <PageSection
      variant="normal"
      container
      className={`relative overflow-hidden bg-ori-section-alt py-12 md:py-20 ${sectionScroll}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_0%,color-mix(in_srgb,var(--color-ori-accent)_4%,transparent)_42%,transparent_78%)] opacity-70"
        aria-hidden
      />
      <div className="relative">
        <SectionHeading
          align="left"
          title="Offer an end-to-end business resource to your clients"
          subtitle="Ori extends your work across consulting, operations, and capital so your clients don’t stall between steps"
          className="max-w-3xl !mb-0"
        />

        <div className="mt-8 flex flex-col gap-10 lg:mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8 lg:gap-y-0 xl:gap-x-10">
          <div className="order-2 lg:order-none lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <PartnerUnlockMosaic />
          </div>

          <div className="order-1 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <ul className="divide-y divide-ori-border/70">
              {unlockPillars.map((pillar, index) => (
                <li key={pillar.title} className="py-5 first:pt-0 last:pb-0 sm:py-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                      <span className="font-display text-xl font-bold tabular-nums leading-none text-ori-accent/[0.22] sm:text-2xl">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-ori-accent/30 bg-ori-black/25 text-ori-accent ring-1 ring-inset ring-white/[0.05] backdrop-blur-[2px] sm:h-10 sm:w-10">
                        <UnlockIcon name={pillar.icon} compact />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 pt-0 sm:pt-0.5">
                      <h3 className="font-display text-base font-semibold tracking-tight text-ori-foreground sm:text-lg">
                        {pillar.title}
                      </h3>
                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ori-muted">
                        {pillar.copy}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageSection>
  );
}

export function PartnerHowPartnershipWorksSection() {
  return (
    <PageSection
      id="how-partnership-works"
      variant="normal"
      container
      className={`relative overflow-hidden bg-ori-black py-14 md:py-20 ${sectionScroll}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_15%,color-mix(in_srgb,var(--color-ori-accent)_5%,transparent)_48%,transparent_82%)] opacity-60"
        aria-hidden
      />
      <div className="relative">
        <SectionHeading
          align="left"
          title="How we work together"
          subtitle="Simple, structured, and built to fit into how you already operate."
          className="max-w-3xl"
        />

        <div className="relative mt-10 overflow-hidden rounded-2xl border border-ori-border bg-ori-charcoal/30 ring-1 ring-white/[0.05]">
          <div className="grid grid-cols-3 gap-px bg-ori-border/40">
            {PARTNER_WORKFLOW_STEPS.map((s, i) => (
              <div
                key={i}
                className="group/tri relative aspect-[5/3] min-h-[5.5rem] overflow-hidden bg-ori-black sm:min-h-[6.5rem] md:min-h-[7.5rem]"
              >
                <img
                  src={s.src}
                  alt=""
                  className="h-full w-full object-cover opacity-45 motion-safe:transition-opacity motion-safe:duration-500 motion-safe:group-hover/tri:opacity-[0.58]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ori-black via-ori-black/40 to-ori-black/20" />
              </div>
            ))}
          </div>
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center font-display text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-ori-muted">
            Introduce · Activate · Deliver
          </p>
        </div>

        <div className="relative mt-10 md:mt-12">
          <div
            className="pointer-events-none absolute left-[14%] right-[14%] top-[1.125rem] hidden h-px bg-gradient-to-r from-transparent via-ori-accent/25 to-transparent md:block"
            aria-hidden
          />
          <ol className="grid gap-8 md:grid-cols-3 md:gap-5">
            {partnershipSteps.map((step, index) => (
              <li key={step.title} className="relative text-center">
                <div className="relative z-10 mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-ori-accent font-display text-[0.65rem] font-bold tabular-nums text-ori-black shadow-[0_0_18px_-5px_var(--color-ori-accent)] md:mb-4 md:h-10 md:w-10 md:text-xs">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-base font-semibold text-ori-foreground md:text-lg">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[260px] text-sm leading-relaxed text-ori-muted md:max-w-[280px]">
                  {step.copy}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-3 md:mt-12">
          <Button
            to={ROUTES.PARTNER_REGISTER}
            size="lg"
            className="min-w-[200px]"
            onClick={() => trackOriEvent(ORI_EVENTS.PARTNER_FUNNEL_CTA, { cta: "how_works_partner" })}
          >
            Partner with Ori
          </Button>
        </div>
      </div>
    </PageSection>
  );
}

export function PartnerOfferThroughOriSection() {
  return (
    <PageSection
      variant="normal"
      container
      className={`relative overflow-hidden bg-ori-section-alt py-16 md:py-24 ${sectionScroll}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(95deg,transparent_0%,color-mix(in_srgb,var(--color-ori-pillar-consulting-hint)_6%,transparent)_35%,transparent_70%)] opacity-50"
        aria-hidden
      />
      <div className="relative">
        <SectionHeading
          align="left"
          title="Expand what you can deliver"
          subtitle="Ori gives you the resources to deliver deeper outcomes across strategy, execution, and capital."
          subtitleClassName="!max-w-3xl text-pretty"
          className="max-w-3xl"
        />
        <div className="mt-10 flex flex-col gap-5 lg:mt-12 lg:gap-6">
          {offerColumns.map((col, index) => (
            <PartnerOfferPillarRow key={col.title} col={col} index={index} />
          ))}
        </div>
      </div>
    </PageSection>
  );
}

export function PartnerModelsSection() {
  const [active, setActive] = useState(0);
  const model = partnershipModels[active] ?? partnershipModels[0];

  return (
    <PageSection
      variant="normal"
      container
      className={`relative overflow-hidden bg-ori-black py-14 md:py-20 ${sectionScroll}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(-105deg,transparent_25%,color-mix(in_srgb,var(--color-ori-accent)_2.5%,transparent)_52%,transparent_88%)] opacity-40"
        aria-hidden
      />
      <div className="relative">
        <SectionHeading
          align="left"
          title="Flexible partnership models"
          subtitle={
            <>
              <p className="mb-4">
                Work with Ori in a way that fits how you already support your clients, without changing how you work or
                adding operational overhead.
              </p>
              <p>
                Each model is designed to create aligned outcomes so your clients get results and your business captures
                new revenue.
              </p>
            </>
          }
          className="max-w-2xl"
        />
        <div className="mt-10 lg:mt-12 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-8 xl:gap-10">
          <div className="lg:col-span-5">
            <div
              className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Partnership models"
            >
              {partnershipModels.map((m, i) => {
                const selected = i === active;
                return (
                  <button
                    key={m.title}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    id={`partner-model-tab-${i}`}
                    aria-controls={`partner-model-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={`flex min-w-[9.5rem] shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition motion-reduce:transition-none lg:min-w-0 lg:px-4 lg:py-3.5 ${
                      selected
                        ? "border-ori-border bg-ori-surface/90 text-ori-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.03)] ring-1 ring-inset ring-white/[0.04] lg:border-l-[3px] lg:border-l-ori-accent/45"
                        : "border-ori-border/70 bg-ori-black/20 text-ori-muted hover:border-ori-border hover:bg-ori-charcoal/25 hover:text-ori-foreground"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-ori-black/30 ring-1 ring-inset ring-white/[0.04] ${
                        selected ? "border-ori-border/80 text-ori-accent" : "border-ori-border/60 text-ori-muted"
                      }`}
                    >
                      <ModelIcon name={m.icon} compact />
                    </span>
                    <span className="font-display text-sm font-semibold tracking-tight sm:text-base">{m.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative mt-8 lg:col-span-7 lg:mt-0">
            <div
              id="partner-model-panel"
              role="tabpanel"
              aria-labelledby={`partner-model-tab-${active}`}
              className="relative overflow-hidden rounded-xl border border-ori-border bg-ori-surface/95 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] ring-1 ring-inset ring-white/[0.04]"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-ori-border bg-ori-black/25 text-ori-accent ring-1 ring-inset ring-white/[0.04]">
                    <ModelIcon name={model.icon} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-ori-foreground md:text-2xl">{model.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-snug text-ori-foreground md:text-base">{model.lead}</p>
                    <PartnerModelMicroCue variant={model.icon} />
                    <div className="mt-3 space-y-2 text-sm leading-relaxed text-ori-muted md:text-base">
                      {model.body.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}

export function PartnerBestFitSection() {
  return (
    <PageSection
      variant="normal"
      container
      className={`relative overflow-hidden bg-ori-section-alt py-14 md:py-20 ${sectionScroll}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent_30%,color-mix(in_srgb,var(--color-ori-accent)_3%,transparent)_60%,transparent_90%)] opacity-80"
        aria-hidden
      />
      <div className="relative lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-14">
        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
          <SectionHeading
            align="left"
            title="Best fit partners"
            subtitle="This works best if you already:"
            className="max-w-xl !mb-0"
          />
          <div className="mt-8 rounded-2xl border border-ori-border bg-ori-surface/95 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] ring-1 ring-inset ring-white/[0.04] sm:mt-9 md:p-8 lg:mt-10">
            <ul className="flex list-none flex-col gap-2.5 sm:gap-3">
              {bestFitLines.map((line) => (
                <li
                  key={line}
                  className="flex gap-3 rounded-xl border border-ori-border/60 bg-ori-black/15 px-4 py-3.5 text-sm leading-[1.6] text-ori-foreground ring-1 ring-inset ring-white/[0.03] sm:text-[0.9375rem] md:px-5 md:py-4"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ori-accent/90"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-ori-border/50 pt-8">
              <Button
                to={ROUTES.CONTACT}
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => trackOriEvent(ORI_EVENTS.PARTNER_FUNNEL_CTA, { cta: "best_fit_get_in_touch" })}
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-10 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-2">
          <div className="relative mx-auto max-w-md lg:mx-0 lg:max-w-none lg:sticky lg:top-[calc(var(--ori-header-offset,0px)+1.5rem)]">
            <div className="relative overflow-hidden rounded-2xl border border-ori-border bg-ori-charcoal/40 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.9)] ring-1 ring-inset ring-white/[0.05]">
              <div className="aspect-[4/5] max-h-[min(520px,72vh)] w-full sm:mx-auto sm:max-w-md lg:max-h-[min(560px,75vh)] lg:max-w-none">
                <img
                  src={PARTNER_BEST_FIT_PANEL.src}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ori-black/70 via-ori-black/15 to-transparent" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
