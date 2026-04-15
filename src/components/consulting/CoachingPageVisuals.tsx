import type { ReactNode } from "react";
import { BookOpen, CheckCircle2, Circle, ListTodo, Radio, Video } from "lucide-react";
import type { ImageAsset } from "../../constants/siteImagery";

/** Decorative filmstrip under the hero — execution contexts. */
export function CoachingHeroFilmstrip({ images }: { images: readonly ImageAsset[] }) {
  return (
    <div className="border-b border-ori-border bg-ori-charcoal/80">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-6 py-4 md:gap-3 md:px-8 md:py-5 [scrollbar-width:thin]">
        {images.map((img, i) => (
          <figure
            key={`${img.src}-${i}`}
            className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-ori-border/70 sm:h-[4.5rem] sm:w-36 md:h-20 md:w-44"
          >
            <img src={img.src} alt={img.alt} className="h-full w-full object-cover opacity-90" loading="lazy" decoding="async" />
            <figcaption className="sr-only">{img.alt}</figcaption>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ori-black/50 to-transparent"
              aria-hidden
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

/** Product-signal rail: lightweight KPI chips to reinforce execution outcomes. */
export function CoachingSignalRail() {
  const items = [
    { label: "Active playbooks", value: "6 core tracks" },
    { label: "Session cadence", value: "Weekly / biweekly" },
    { label: "Execution window", value: "2-4 plays per sprint" },
    { label: "Primary output", value: "Operator-ready artifacts" },
  ] as const;

  return (
    <div className="border-y border-ori-border/80 bg-ori-black/70">
      <div className="mx-auto grid max-w-6xl gap-2 px-6 py-4 sm:grid-cols-2 md:grid-cols-4 md:px-8">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-ori-border/70 bg-ori-surface-panel/40 px-3.5 py-3"
          >
            <p className="text-[0.62rem] uppercase tracking-wider text-ori-muted">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-ori-foreground">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Floating “product” chrome over the hero — illustrates Playbook + Session + Plays at a glance (illustration, not live UI).
 */
export function CoachingPlaybookWindowMock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-ori-border/90 bg-ori-black/90 p-3.5 shadow-[0_24px_64px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.06] backdrop-blur-md sm:p-4 ${className}`.trim()}
      role="img"
      aria-label="Illustration of an Ori Playbook window showing session progress and next plays"
    >
      <div className="flex items-center gap-1.5 border-b border-ori-border/60 pb-2.5" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-red-500/80" />
        <span className="h-2 w-2 rounded-full bg-amber-400/80" />
        <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
        <span className="ml-auto font-mono text-[0.65rem] text-ori-muted">playbook.ori</span>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ori-accent">Active playbook</p>
          <p className="mt-0.5 font-display text-sm font-semibold text-ori-foreground sm:text-base">Sharpen Your Model</p>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-ori-accent/30 bg-ori-accent/10 px-2 py-0.5 text-[0.65rem] font-medium text-ori-accent">
          <Radio className="h-3 w-3" aria-hidden />
          Session 2
        </span>
      </div>
      <div className="mt-3 space-y-1.5 rounded-lg border border-ori-border/50 bg-ori-surface-panel/40 p-2.5">
        <p className="text-[0.65rem] font-medium uppercase tracking-wide text-ori-muted">Progress</p>
        <div className="h-1.5 overflow-hidden rounded-full bg-ori-border/80" aria-hidden>
          <div className="h-full w-[58%] rounded-full bg-ori-accent" />
        </div>
        <p className="text-[0.65rem] text-ori-muted">Plays complete · 58%</p>
      </div>
      <ul className="mt-3 space-y-1.5 text-[0.7rem] text-ori-text-secondary" aria-hidden>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-ori-accent" />
          <span className="truncate">Interview script + ICP draft</span>
        </li>
        <li className="flex items-center gap-2">
          <Video className="h-3.5 w-3.5 shrink-0 text-ori-accent" />
          <span className="truncate">Next checkpoint · Validate customer</span>
        </li>
        <li className="flex items-center gap-2 opacity-70">
          <ListTodo className="h-3.5 w-3.5 shrink-0 text-ori-muted" />
          <span className="truncate">Play · Pricing tests (queued)</span>
        </li>
      </ul>
    </div>
  );
}

/** Narrow “runsheet” for the deep-dive column — sessions vs plays. */
export function CoachingSessionRunsheetMock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-ori-border bg-gradient-to-b from-ori-surface-panel to-ori-black/40 ${className}`.trim()}
      role="img"
      aria-label="Illustration of a session runsheet with agenda items and play checklist"
    >
      <div className="flex items-center justify-between border-b border-ori-border/80 bg-ori-black/30 px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs font-semibold text-ori-foreground">
          <BookOpen className="h-3.5 w-3.5 text-ori-accent" aria-hidden />
          Session runsheet
        </span>
        <span className="rounded border border-ori-border/70 bg-ori-black/40 px-2 py-0.5 font-mono text-[0.65rem] text-ori-muted">
          Live
        </span>
      </div>
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="border-b border-ori-border/60 p-4 sm:border-b-0 sm:border-r sm:border-ori-border/60">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ori-muted">Agenda</p>
          <ol className="mt-2 space-y-2 text-xs text-ori-foreground">
            <li className="flex gap-2 opacity-60">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ori-accent" aria-hidden />
              Offer boundaries
            </li>
            <li className="flex gap-2">
              <Video className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ori-accent" aria-hidden />
              ICP + interview plan
            </li>
            <li className="flex gap-2 opacity-50">
              <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ori-muted" aria-hidden />
              Model stress test
            </li>
          </ol>
        </div>
        <div className="p-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ori-muted">Plays this week</p>
          <ul className="mt-2 space-y-2 text-xs text-ori-muted">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ori-accent" aria-hidden />
              6 / 12 interviews logged
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ori-border" aria-hidden />
              Value prop v2 in review
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Visual pipeline canvas for Playbook → Sessions → Plays → Outcomes. */
export function CoachingPipelineCanvas({ className = "" }: { className?: string }) {
  const stages = [
    { t: "Playbook", s: "Choose track", k: "1" },
    { t: "Sessions", s: "Guided checkpoints", k: "2" },
    { t: "Plays", s: "Execution between calls", k: "3" },
    { t: "Outcomes", s: "Signal + deliverables", k: "4" },
  ] as const;

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-ori-border bg-gradient-to-br from-ori-surface-panel/80 via-ori-black/50 to-ori-charcoal/70 p-4 sm:p-5 ${className}`.trim()}
      role="img"
      aria-label="Illustration of the coaching pipeline from playbook selection to measurable outcomes"
    >
      <div className="grid gap-3 sm:grid-cols-4 sm:gap-2">
        {stages.map((stage, i) => (
          <div key={stage.t} className="relative rounded-lg border border-ori-border/70 bg-ori-black/40 p-3">
            {i < stages.length - 1 ? (
              <span
                className="pointer-events-none absolute -right-1 top-1/2 hidden h-px w-2 bg-ori-accent/60 sm:block"
                aria-hidden
              />
            ) : null}
            <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-ori-accent">{stage.k}</p>
            <p className="mt-1 font-display text-sm font-semibold text-ori-foreground">{stage.t}</p>
            <p className="mt-1 text-[0.68rem] text-ori-muted">{stage.s}</p>
          </div>
        ))}
      </div>
      <div className="mt-3.5 rounded-lg border border-ori-border/70 bg-ori-black/35 px-3 py-2">
        <p className="text-[0.67rem] text-ori-muted">
          Example sprint output: ICP brief, interview log, revised value proposition, pricing test summary.
        </p>
      </div>
    </div>
  );
}

/** Laptop-style bezel around optional screenshot or diagram slot. */
export function CoachingDeviceFrame({
  children,
  caption,
  className = "",
}: {
  children: ReactNode;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={`mx-auto max-w-lg ${className}`.trim()}>
      <div
        className="rounded-[1.1rem] border border-zinc-600/35 bg-gradient-to-b from-zinc-700/50 via-zinc-900 to-zinc-950 p-2 shadow-[0_28px_56px_-28px_rgba(0,0,0,0.75)] ring-1 ring-white/[0.05] sm:rounded-[1.25rem] sm:p-2.5"
        aria-hidden
      >
        <div className="mb-2 flex justify-center sm:mb-2.5">
          <span className="h-1.5 w-8 rounded-full bg-zinc-800 ring-1 ring-zinc-700/80" />
        </div>
        <div className="overflow-hidden rounded-lg bg-ori-black ring-1 ring-black/50 sm:rounded-xl">{children}</div>
      </div>
      {caption ? <figcaption className="mt-3 text-center text-xs text-ori-muted">{caption}</figcaption> : null}
    </figure>
  );
}
