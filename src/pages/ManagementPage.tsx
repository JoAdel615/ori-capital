import { Button } from "../components/Button";
import { ManagementProductSections } from "../components/management/ManagementProductSections";
import { MANAGEMENT_HUB_HERO_BACKDROP } from "../constants/siteImagery";
export function ManagementPage() {
  return (
    <>
      <section className="relative flex min-h-[100dvh] min-h-screen flex-col justify-center overflow-hidden border-b border-ori-border bg-ori-black">
        <img
          src={MANAGEMENT_HUB_HERO_BACKDROP}
          alt="Business dashboards and KPI charts on a laptop—structured visibility into operations"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ori-black via-ori-black/82 to-ori-black/55" />
        <div className="relative ori-container flex min-h-0 flex-1 flex-col justify-center py-16 md:py-24">
          <p className="ori-type-eyebrow">Management</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-ori-foreground md:text-5xl lg:text-6xl">
            More hustle isn&apos;t the answer. Structure is.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ori-muted md:text-lg">
            Operations don&apos;t break because of effort. They break because of gaps. We help you put the right systems in
            place across the lifecycle of your business.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#management-products" size="lg">
              See how it works
            </Button>
          </div>
        </div>
      </section>

      <ManagementProductSections />
    </>
  );
}
