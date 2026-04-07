import { Link } from "react-router-dom";
import { PageHero, PageSection, SectionHeading } from "../components/system";
import { ROUTES } from "../utils/navigation";

const manifesto = [
  "Avoid the VC trap: hypergrowth and board seats aren't the only path to scale.",
  "Don't build your business around bank constraints. Outdated underwriting shouldn't define your ceiling.",
  "Capital should be catalytic, not extractive. We align with builders who create real economic value.",
  "Access → Structure → Scale → Ownership. That's the playbook.",
];

const roadmap = [
  {
    phase: "Phase 1",
    title: "Capital brokering & strategy",
    copy: "We're here now: brokering funding, strategy calls, and Funding Readiness Accelerator for builders. Qualification in as little as 48 hours.",
  },
  {
    phase: "Phase 2",
    title: "Scaled institution",
    copy: "Growing our capital base and product set to serve more builders with flexible structures and community-aligned terms.",
  },
  {
    phase: "Phase 3",
    title: "Ori Credit Union",
    copy: "Our long-term vision: a modern, community-rooted financial institution that aligns capital with ownership, growth, and long-term economic power. Not there yet—we're building toward it.",
  },
];

export function ModelPage() {
  return (
    <>
      <PageHero
        size="inner"
        title="The Ori Model"
        subtitle="A manifesto and roadmap for capital that serves builders—not gatekeepers."
        align="center"
        className="border-b border-ori-border bg-ori-section-alt"
      />

      <PageSection variant="normal" className="bg-ori-black">
        <SectionHeading title="Manifesto" />
        <ul className="mx-auto max-w-2xl space-y-6">
          {manifesto.map((line) => (
            <li
              key={line.slice(0, 30)}
              className="border-l-4 border-ori-accent pl-6 text-lg text-ori-foreground"
            >
              {line}
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-section-alt">
        <SectionHeading title="Our Roadmap" />
        <div className="mx-auto max-w-2xl space-y-8">
          {roadmap.map((r) => (
            <div
              key={r.phase}
              className="rounded-xl border border-ori-border bg-ori-surface p-6"
            >
              <span className="text-sm font-semibold uppercase tracking-wider text-ori-accent">
                {r.phase}
              </span>
              <h3 className="mt-2 font-display text-xl font-semibold text-ori-foreground">
                {r.title}
              </h3>
              <p className="mt-2 text-ori-muted">{r.copy}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-xl text-center text-sm text-ori-muted">
          Ori Credit Union is a future vision. Today we operate as a capital platform and strategy partner.
        </p>
      </PageSection>

      <PageSection variant="normal" className="bg-ori-black">
        <div className="text-center">
          <p className="text-ori-foreground">Ready to access capital or structure your stack?</p>
          <div className="ori-cta-row mt-6">
            <Link
              to={ROUTES.APPLY}
              className="inline-flex items-center justify-center rounded-lg bg-ori-accent px-6 py-3 font-semibold text-ori-black hover:bg-ori-accent-dim"
            >
              Apply for Funding
            </Link>
            <Link
              to="/strategy"
              className="inline-flex items-center justify-center rounded-lg border border-ori-accent px-6 py-3 font-semibold text-ori-accent hover:bg-ori-glow"
            >
              Strategy & Capital Formation
            </Link>
          </div>
        </div>
      </PageSection>
    </>
  );
}
