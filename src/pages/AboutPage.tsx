import { Button } from "../components/Button";
import { PageHero, PageSection } from "../components/system";
import { TrustSectionIntro } from "../components/trust/TrustElements";
import { ROUTES } from "../utils/navigation";

export function AboutPage() {
  return (
    <>
      <PageHero
        size="inner"
        title="Built for businesses operating in today’s funding landscape."
        subtitle="Ori Capital exists to help entrepreneurs better understand, prepare for, and access funding with more clarity and less confusion."
        align="center"
        className="border-b border-ori-border bg-ori-section-alt"
      />

      <PageSection variant="normal" className="bg-ori-black section-divider">
        <TrustSectionIntro title="What Ori Capital is" />
        <div className="max-w-3xl text-base leading-relaxed text-ori-muted">
          Ori Capital is a strategic capital solutions business helping entrepreneurs access funding through better positioning, stronger readiness, and smarter decisions-not just more applications.
        </div>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-section-alt section-divider">
        <TrustSectionIntro title="Why we exist" />
        <div className="max-w-3xl space-y-4 text-base leading-relaxed text-ori-muted">
          <p>Most founders sit in the gap between traditional lenders and investors.</p>
          <p>Banks usually prioritize lower risk and stronger fundamentals. Investors usually prioritize scale and traction. Many good businesses are caught in between.</p>
          <p>Ori exists to close that gap with clearer strategy, practical readiness support, and better-aligned funding paths.</p>
        </div>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-black section-divider">
        <TrustSectionIntro title="How we're different" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {["Education-first", "Strategy before application", "Multiple funding pathways", "Long-term positioning over short-term guesswork"].map((item) => (
            <article key={item} className="rounded-2xl border border-ori-border bg-ori-surface p-6">
              <h3 className="font-display text-lg font-semibold text-ori-foreground">{item}</h3>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-black">
        <div className="rounded-3xl border border-ori-border bg-ori-surface p-8 text-center md:p-12">
          <h2 className="font-display text-3xl font-semibold text-ori-foreground">Work With Us</h2>
          <p className="mx-auto mt-4 max-w-2xl text-ori-muted">If you want a clearer funding path, we can help you evaluate where you stand and what to do next.</p>
          <div className="mt-7">
            <Button to={ROUTES.CONTACT} size="lg">Work With Us</Button>
          </div>
        </div>
      </PageSection>
    </>
  );
}
