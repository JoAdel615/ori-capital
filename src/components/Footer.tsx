import { Link } from "react-router-dom";

const CONTACT_EMAIL = "info@oricapitalholdings.com";
const CONTACT_ADDRESS = "611 Commerce Street, Suite 2611, Nashville, TN 37203";

export function Footer() {
  return (
    <footer id="footer" className="border-t border-ori-border bg-ori-section-alt">
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-2 lg:max-w-md">
            <Link to="/" className="flex items-center gap-3 font-display text-lg font-bold text-ori-foreground">
              <img src="/ori-crown-logo.png" alt="Ori Capital" className="h-8 w-8 object-contain" />
              <span>Ori Capital</span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ori-muted">
              Strategic funding guidance for clients and business owners looking for clearer capital decisions.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ori-muted">
              Ori Capital provides strategic funding guidance and access to financing options. We are not a direct lender.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ori-muted">Legal</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/legal/privacy" className="text-sm text-ori-foreground transition-colors hover:text-ori-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="text-sm text-ori-foreground transition-colors hover:text-ori-accent">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal/disclosures" className="text-sm text-ori-foreground transition-colors hover:text-ori-accent">
                  Disclosures
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ori-muted">Contact</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm text-ori-foreground transition-colors hover:text-ori-accent"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="text-sm leading-relaxed text-ori-foreground">{CONTACT_ADDRESS}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ori-muted">Navigation</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/" className="text-sm text-ori-foreground transition-colors hover:text-ori-accent">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/apply" className="text-sm text-ori-foreground transition-colors hover:text-ori-accent">
                  Apply for Funding
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-sm text-ori-foreground transition-colors hover:text-ori-accent">
                  Partner With Ori
                </Link>
              </li>
              <li>
                <Link
                  to="/funding-readiness"
                  className="text-sm text-ori-foreground transition-colors hover:text-ori-accent"
                >
                  Funding Readiness
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-ori-foreground transition-colors hover:text-ori-accent">
                  About
                </Link>
              </li>
              <li>
                <Link to="/insights" className="text-sm text-ori-foreground transition-colors hover:text-ori-accent">
                  Insights
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-ori-foreground transition-colors hover:text-ori-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-ori-border pt-5 sm:mt-10 sm:pt-6">
          <p className="text-sm text-ori-muted">
            © {new Date().getFullYear()} Ori Capital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
