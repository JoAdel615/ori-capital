import { PageSection, SectionHeading } from "../system";

const steps: {
  title: string;
  copy: string;
  image: string;
  imageAlt: string;
}[] = [
  {
    title: "Understand Your Position",
    copy: "We assess where you are and what may affect your path forward.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Reviewing business documents and strategy",
  },
  {
    title: "Map Your Options",
    copy: "We help identify the most realistic next steps based on your business and goals.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Planning next steps together",
  },
  {
    title: "Help You Move Forward",
    copy:
      "Whether that means applying now or strengthening your position first, we help you take the next step with more clarity.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Partners moving forward with a plan",
  },
];

export function ReferralHowOriSupports() {
  return (
    <PageSection variant="loose" className="section-divider flex min-h-screen min-h-dvh flex-col justify-center bg-ori-black">
      <SectionHeading title="How Ori Supports You" />
      <ol className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-3 md:gap-8">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="flex flex-col overflow-hidden rounded-2xl border border-ori-border bg-ori-surface/90 text-center md:text-left shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
          >
            <div className="relative h-40 overflow-hidden bg-ori-charcoal sm:h-44 md:min-h-[11rem]">
              <img
                src={step.image}
                alt={step.imageAlt}
                className="h-full w-full object-cover opacity-95"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ori-black/85 via-ori-black/15 to-transparent" />
              <span className="absolute bottom-3 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-ori-border/80 bg-ori-black/60 font-display text-lg font-bold text-ori-accent backdrop-blur-sm md:left-6 md:translate-x-0">
                {i + 1}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-display text-lg font-semibold text-ori-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ori-muted">{step.copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </PageSection>
  );
}
