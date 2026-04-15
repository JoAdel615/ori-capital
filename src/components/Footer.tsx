import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CONTAINER_MAX, CONTAINER_X } from "./system/rhythm";
import { ROUTES } from "../utils/navigation";
import { config } from "../config";

const CONTACT_EMAIL = "info@oricapitalholdings.com";
const CONTACT_ADDRESS = "611 Commerce Street, Suite 2611, Nashville, TN 37203";

const linkClass =
  "text-sm text-ori-text-secondary transition-colors hover:text-ori-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-surface-raised";

const colHeadingClass =
  "font-display text-sm font-bold tracking-tight text-ori-text-primary";

type SocialItem = {
  id: string;
  href: string;
  label: string;
  Icon: LucideIcon;
};

function buildSocialItems(): SocialItem[] {
  const items: SocialItem[] = [];
  if (config.socialXUrl) {
    items.push({ id: "x", href: config.socialXUrl, label: "Ori Holdings on X", Icon: Twitter });
  }
  if (config.socialLinkedinUrl) {
    items.push({
      id: "linkedin",
      href: config.socialLinkedinUrl,
      label: "Ori Holdings on LinkedIn",
      Icon: Linkedin,
    });
  }
  if (config.socialInstagramUrl) {
    items.push({
      id: "instagram",
      href: config.socialInstagramUrl,
      label: "Ori Holdings on Instagram",
      Icon: Instagram,
    });
  }
  if (config.socialFacebookUrl) {
    items.push({
      id: "facebook",
      href: config.socialFacebookUrl,
      label: "Ori Holdings on Facebook",
      Icon: Facebook,
    });
  }
  if (config.socialYoutubeUrl) {
    items.push({
      id: "youtube",
      href: config.socialYoutubeUrl,
      label: "Ori Holdings on YouTube",
      Icon: Youtube,
    });
  }
  return items;
}

function SocialCircleRow({ items }: { items: SocialItem[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2.5" aria-label="Social profiles">
      {items.map(({ id, href, label, Icon }) => (
        <li key={id}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-surface-raised"
            aria-label={label}
          >
            <Icon className="h-4 w-4" aria-hidden strokeWidth={2} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function SocialInlineRow({ items }: { items: SocialItem[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center gap-3" aria-label="Social profiles">
      {items.map(({ id, href, label, Icon }) => (
        <li key={id}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-ori-text-secondary transition-colors hover:text-ori-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-surface-raised"
            aria-label={label}
          >
            <Icon className="h-4 w-4" aria-hidden strokeWidth={2} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const socialItems = buildSocialItems();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

  const phoneTel = config.contactPhoneTel;
  const phoneDisplay = config.contactPhoneDisplay || phoneTel;

  return (
    <footer id="footer" className="border-t border-ori-border bg-ori-surface-raised" role="contentinfo">
      <div className={`mx-auto w-full ${CONTAINER_MAX} ${CONTAINER_X} py-6 md:py-7`}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_auto_minmax(0,1fr)] lg:gap-x-8 lg:gap-y-10">
          {/* Brand + social circles */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-2.5 font-display text-base font-bold text-ori-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-surface-raised"
            >
              <img src="/ori-crown-logo.png" alt="" className="h-8 w-8 object-contain" width={32} height={32} />
              <span>Ori Holdings</span>
            </Link>
            <p className="mt-2.5 max-w-sm text-sm leading-snug text-ori-text-secondary lg:max-w-none">
              Ori helps you navigate every stage of your business,
              <br />
              so you can move from idea to enterprise without losing momentum.
            </p>
            <SocialCircleRow items={socialItems} />
          </div>

          <nav aria-labelledby="footer-links-heading">
            <h3 id="footer-links-heading" className={colHeadingClass}>
              Links
            </h3>
            <ul className="mt-2.5 space-y-1.5">
              <li>
                <Link to={ROUTES.ABOUT} className={linkClass}>
                  About
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CONSULTING} className={linkClass}>
                  Consulting
                </Link>
              </li>
              <li>
                <Link to={ROUTES.INSIGHTS} className={linkClass}>
                  Insights
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CONTACT} className={linkClass}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="min-w-0 lg:max-w-[15rem]">
            <h3 className={colHeadingClass}>Contact</h3>
            <ul className="mt-2.5 space-y-2.5 text-sm leading-snug text-ori-text-secondary">
              <li>
                <span className="inline-flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ori-accent/80" aria-hidden strokeWidth={1.75} />
                  <span>{CONTACT_ADDRESS}</span>
                </span>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={`inline-flex items-start gap-2.5 ${linkClass}`}
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ori-accent/80" aria-hidden strokeWidth={1.75} />
                  <span>{CONTACT_EMAIL}</span>
                </a>
              </li>
              {phoneTel && phoneDisplay ? (
                <li>
                  <a href={`tel:${phoneTel}`} className={`inline-flex items-start gap-2.5 ${linkClass}`}>
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ori-accent/80" aria-hidden strokeWidth={1.75} />
                    <span>{phoneDisplay}</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div aria-labelledby="footer-newsletter-heading">
            <h3 id="footer-newsletter-heading" className={colHeadingClass}>
              Stay a step ahead
            </h3>
            <p className="mt-2.5 text-sm leading-snug text-ori-text-secondary">
              Just the things that matter when you&apos;re building, running, and trying to get it right.
            </p>
            {subscribed ? (
              <p className="mt-3 text-sm font-medium text-ori-accent" role="status">
                Thanks for subscribing.
              </p>
            ) : (
              <form
                className="mt-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setNewsletterError(null);
                  setSubmitting(true);
                  try {
                    const res = await fetch(config.newsletterApiUrl, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: email.trim() }),
                    });
                    const data = (await res.json().catch(() => ({}))) as { error?: string };
                    if (!res.ok) {
                      throw new Error(data.error || "Could not subscribe right now.");
                    }
                    setSubscribed(true);
                    setEmail("");
                  } catch (err) {
                    setNewsletterError(
                      err instanceof Error ? err.message : "We could not subscribe you. Please try again shortly."
                    );
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <div className="flex max-w-md rounded-lg border border-ori-border bg-ori-surface p-0.5 shadow-sm lg:max-w-none">
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={submitting}
                    className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-ori-foreground placeholder:text-ori-muted focus:outline-none focus:ring-0 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="shrink-0 rounded-md bg-ori-accent px-4 py-2 text-sm font-semibold text-ori-black transition-colors hover:bg-ori-accent-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-surface-raised disabled:pointer-events-none disabled:opacity-50"
                  >
                    {submitting ? "…" : "Sign Up"}
                  </button>
                </div>
                {newsletterError ? (
                  <p className="mt-2 text-sm text-red-400" role="alert">
                    {newsletterError}
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-ori-border pt-5 md:mt-7 md:pt-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-sm text-ori-text-secondary">
              © {new Date().getFullYear()} Ori Holdings. All rights reserved.
            </p>
            <div className="flex flex-col gap-3 sm:items-end">
              <nav className="flex flex-wrap gap-x-4 gap-y-1 sm:justify-end" aria-label="Legal">
                <Link to={ROUTES.LEGAL_PRIVACY} className={`${linkClass} text-xs uppercase tracking-wider`}>
                  Privacy
                </Link>
                <Link to={ROUTES.LEGAL_TERMS} className={`${linkClass} text-xs uppercase tracking-wider`}>
                  Terms
                </Link>
                <Link to={ROUTES.LEGAL_DISCLOSURES} className={`${linkClass} text-xs uppercase tracking-wider`}>
                  Disclosures
                </Link>
              </nav>
              <SocialInlineRow items={socialItems} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
