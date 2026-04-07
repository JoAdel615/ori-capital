import { PageSection, SectionHeading } from "../system";
import { Check } from "lucide-react";

const points = [
  "Access to business funding options",
  "Guidance on preparing for capital",
  "Support navigating credit and financing",
  "A clear path forward based on your situation",
];

export function ReferralWhatWeHelp() {
  return (
    <PageSection variant="loose" className="section-divider flex min-h-screen min-h-dvh flex-col justify-center bg-ori-black">
      <SectionHeading
        title="What We Help With"
        subtitle="Straightforward support for owners who want clarity—not noise."
      />
      <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
        {points.map((text) => (
          <li
            key={text}
            className="flex gap-3 rounded-xl border border-ori-border bg-ori-surface/80 px-4 py-3 text-sm leading-relaxed text-ori-foreground"
          >
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-ori-accent" aria-hidden />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
