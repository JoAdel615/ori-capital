import {
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Landmark,
  Layers,
  LineChart,
  ListTodo,
  RefreshCw,
  Sparkles,
  Target,
  User,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import { Accordion } from "../../components/Accordion";
import { Button } from "../../components/Button";
import {
  CoachingDeviceFrame,
  CoachingHeroFilmstrip,
  CoachingPipelineCanvas,
  CoachingPlaybookWindowMock,
  CoachingSignalRail,
  CoachingSessionRunsheetMock,
} from "../../components/consulting/CoachingPageVisuals";
import { FaqJsonLd } from "../../components/FaqJsonLd";
import { PageSection, ScrollRevealSection, SectionHeading } from "../../components/system";
import { COACHING_PRODUCT_IMAGERY, MODULE_HERO_BACKGROUNDS, type ImageAsset } from "../../constants/siteImagery";
import { config } from "../../config";
import { COACHING_PLAYBOOK_CARDS, SHARPEN_PLAYBOOK_DEEP_DIVE } from "../../data/coachingPlaybooks";
import { ROUTES } from "../../utils/navigation";
import { Link } from "react-router-dom";

const DEFAULT_BOOKING_URL = "https://calendly.com/biz-oricapitalholdings/30min?month=2026-03";

const FAQ_ITEMS = [
  {
    id: "playbook-vs-open",
    title: "How is a Playbook different from open-ended coaching?",
    content:
      "A Playbook is a focused track with a clear objective, guided sessions, and execution Plays between checkpoints. You still get judgment and adaptability—inside a structure designed to ship outcomes.",
  },
  {
    id: "sessions-format",
    title: "What happens in sessions vs. Plays?",
    content:
      "Sessions are live checkpoints: alignment, decisions, and feedback with a player-coach. Plays are the real work you run between sessions—interviews, experiments, narrative, and pipeline motion—so progress shows up as artifacts, not notes.",
  },
  {
    id: "team-involvement",
    title: "Can operators or co-founders join?",
    content:
      "Yes. When decision-makers share the same table, execution velocity usually improves—especially across offer, operations, and capital conversations.",
  },
  {
    id: "vs-management",
    title: "Where does Management fit?",
    content:
      "Startup coaching is the collaboration layer for clarity and execution. Management is how you run the business day-to-day—formation, records, hosting, CRM, and systems. The playbooks often feed clean decisions into those modules.",
  },
] as const;

const PIPELINE_STEPS = [
  { k: "Playbook", d: "Choose a focused track (e.g., Sharpen Your Model).", Icon: BookOpen },
  { k: "Sessions", d: "Live, guided checkpoints with a player-coach.", Icon: Video },
  { k: "Plays", d: "Execute real work between sessions.", Icon: ListTodo },
  { k: "Outcomes", d: "Artifacts, signal, and momentum you can show.", Icon: Target },
] as const;

const FILMSTRIP_IMAGES = COACHING_PRODUCT_IMAGERY.slice(0, 6);
const PHILOSOPHY_BG = COACHING_PRODUCT_IMAGERY[1]!;
const DEEP_DIVE_PANEL = COACHING_PRODUCT_IMAGERY[2]!;

function lifecyclePath(slug: string): string {
  return `/consulting/lifecycle/${slug}`;
}

function coachingAsset(i: number): ImageAsset {
  const list = COACHING_PRODUCT_IMAGERY;
  return list[((i % list.length) + list.length) % list.length]!;
}

function PlaybookCardMedia({ visualIndex, className = "" }: { visualIndex: number; className?: string }) {
  const img = coachingAsset(visualIndex);
  return (
    <div className={`relative overflow-hidden ${className}`.trim()}>
      <img src={img.src} alt={img.alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ori-black/80 via-ori-black/15 to-transparent" aria-hidden />
    </div>
  );
}

export function ConsultingCoachingPage() {
  const bookUrl = config.calendlyUrl || DEFAULT_BOOKING_URL;
  const featured = COACHING_PLAYBOOK_CARDS.find((p) => p.featured);
  const rest = COACHING_PLAYBOOK_CARDS.filter((p) => !p.featured);
  const [sideA, sideB, ...more] = rest;

  return (
    <>
      <FaqJsonLd
        faqs={FAQ_ITEMS.map((f) => ({
          question: f.title,
          answer: typeof f.content === "string" ? f.content : "",
        }))}
      />

      {/* 1 — Hero */}
      <section className="border-b border-ori-border ori-pillar-band-consulting">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 md:px-8 md:py-20 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-24">
          <div className="lg:col-span-6">
            <p className="ori-type-eyebrow">Collaboration · Ori Playbooks</p>
            <h1 className="mt-4 max-w-xl font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl lg:text-5xl">
              Build your business by doing the work—with a coach in the trenches
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ori-muted md:text-lg">
              Structured playbooks, guided sessions, and real execution—so you don&apos;t just learn what to do, you
              actually do it.
            </p>
            <ul className="mt-8 space-y-2.5 text-sm text-ori-text-secondary md:text-base">
              {[
                "Playbooks, not open-ended coaching",
                "Sessions plus execution (Plays)",
                "Built for outcomes—not generic advice",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-ori-accent" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button to={ROUTES.CONSULTING_BOOK} size="lg">
                Start a Playbook
              </Button>
              <Button href={bookUrl} size="lg" variant="outline" target="_blank" rel="noreferrer">
                Schedule a Session
              </Button>
            </div>
            <p className="mt-6">
              <a
                href="#playbooks"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ori-accent underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-black rounded"
              >
                <BookOpen className="h-4 w-4" aria-hidden />
                Explore Playbooks
              </a>
            </p>
          </div>
          <div className="relative mt-14 min-h-[220px] lg:col-span-6 lg:mt-0">
            <div className="hidden lg:block lg:absolute lg:-left-6 lg:top-10 lg:z-10 lg:w-[min(42%,200px)]">
              <div className="overflow-hidden rounded-2xl border border-ori-border/80 shadow-xl ring-1 ring-white/[0.05]">
                <img
                  src={COACHING_PRODUCT_IMAGERY[4]!.src}
                  alt={COACHING_PRODUCT_IMAGERY[4]!.alt}
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className="relative min-h-[240px] md:min-h-[380px]">
              <div className="relative h-full min-h-[240px] overflow-hidden rounded-[1.75rem] border border-ori-border/70 bg-ori-surface-panel shadow-[0_40px_120px_-48px_rgba(0,0,0,0.9)] md:min-h-[380px]">
                <img
                  src={MODULE_HERO_BACKGROUNDS.consulting}
                  alt="Coach working alongside a founder during execution planning"
                  className="h-full min-h-[240px] w-full object-cover md:min-h-[380px]"
                  fetchPriority="high"
                  decoding="async"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ori-black/70 via-transparent to-ori-black/20"
                  aria-hidden
                />
                <p className="pointer-events-none absolute bottom-6 left-6 right-6 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-ori-foreground/80 md:text-sm">
                  <LineChart className="h-4 w-4 text-ori-accent" aria-hidden />
                  Playbook → Sessions → Plays → Outcomes
                </p>
              </div>
              <CoachingPlaybookWindowMock className="absolute bottom-4 left-4 right-4 z-10 sm:left-auto sm:right-6 sm:max-w-[min(100%,300px)]" />
            </div>
          </div>
        </div>
      </section>

      <CoachingHeroFilmstrip images={FILMSTRIP_IMAGES} />
      <CoachingSignalRail />

      {/* 2 — System flow */}
      <ScrollRevealSection className="border-b border-ori-border bg-ori-black" aria-labelledby="how-it-works">
        <PageSection>
          <SectionHeading
            id="how-it-works"
            eyebrow="How it works"
            title="A simple system—built to ship"
            subtitle="You move through a pipeline, not a pile of meetings."
            align="left"
          />
          <ol className="mt-2 grid gap-10 md:grid-cols-4 md:gap-0 md:divide-x md:divide-ori-border/80">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = step.Icon;
              return (
                <li key={step.k} className="flex gap-4 md:px-6 md:first:pl-0">
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ori-accent/35 bg-ori-accent/10 text-ori-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="flex items-center gap-2 font-display text-lg font-semibold text-ori-foreground">
                      <span className="font-mono text-xs text-ori-muted">{i + 1}.</span>
                      {step.k}
                    </p>
                    <p className="mt-1 max-w-[20rem] text-sm leading-relaxed text-ori-muted">{step.d}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <CoachingPipelineCanvas className="mt-8" />
        </PageSection>
      </ScrollRevealSection>

      {/* 3 — Playbooks */}
      <PageSection id="playbooks" className="scroll-mt-24 bg-ori-section-alt">
        <SectionHeading
          eyebrow="The Ori Playbooks"
          title="Highest-leverage moves at each stage"
          subtitle="Every business follows a pattern. We focus on the moves that compound—then build from there."
          align="left"
        />
        {featured && (
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <article className="flex flex-col overflow-hidden rounded-2xl border border-ori-border bg-gradient-to-br from-ori-surface-panel to-ori-black/20 lg:col-span-7 lg:row-span-2 lg:min-h-[420px]">
              <PlaybookCardMedia visualIndex={featured.visualIndex} className="h-44 md:h-52 lg:h-56" />
              <div className="flex flex-1 flex-col justify-between gap-8 p-8 lg:p-10">
                <div>
                  <p className="ori-type-label text-ori-accent">Featured Playbook</p>
                  <h3 className="mt-3 font-display text-2xl font-bold text-ori-foreground md:text-3xl">{featured.title}</h3>
                  <p className="mt-4 max-w-prose ori-type-body-muted">{featured.objective}</p>
                  <p className="mt-4 text-sm font-medium text-ori-foreground">
                    What gets built: <span className="font-normal text-ori-muted">{featured.built}</span>
                  </p>
                </div>
                <div>
                  <Button to={lifecyclePath(featured.slug)} variant="outline">
                    View Playbook
                  </Button>
                </div>
              </div>
            </article>
            <div className="flex flex-col gap-6 lg:col-span-5">
              {[sideA, sideB].map(
                (p) =>
                  p && (
                    <article
                      key={p.slug}
                      className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-ori-border/90 bg-ori-surface-panel/80"
                    >
                      <PlaybookCardMedia visualIndex={p.visualIndex} className="h-32 sm:h-36" />
                      <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                        <div>
                          <h3 className="font-display text-lg font-semibold text-ori-foreground">{p.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-ori-muted">{p.objective}</p>
                          <p className="mt-3 text-xs text-ori-text-secondary">
                            Builds: <span className="text-ori-muted">{p.built}</span>
                          </p>
                        </div>
                        <Button
                          to={lifecyclePath(p.slug)}
                          variant="ghost"
                          className="self-start px-0 text-ori-accent hover:bg-transparent"
                        >
                          View Playbook →
                        </Button>
                      </div>
                    </article>
                  )
              )}
            </div>
            <div className="contents lg:contents">
              {more.map((p, idx) => (
                <article
                  key={p.slug}
                  className={`flex flex-col overflow-hidden rounded-2xl border border-ori-border bg-ori-black/30 lg:col-span-6 ${
                    idx === more.length - 1 ? "lg:col-span-8 lg:col-start-3" : ""
                  }`}
                >
                  <PlaybookCardMedia visualIndex={p.visualIndex} className="h-28 sm:h-32" />
                  <div className="p-6">
                    <h3 className="font-display text-lg font-semibold text-ori-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ori-muted">{p.objective}</p>
                    <p className="mt-3 text-xs text-ori-text-secondary">
                      Builds: <span className="text-ori-muted">{p.built}</span>
                    </p>
                    <Button
                      to={lifecyclePath(p.slug)}
                      variant="ghost"
                      className="mt-4 px-0 text-ori-accent hover:bg-transparent"
                    >
                      View Playbook →
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </PageSection>

      {/* 4 — Deep dive */}
      <PageSection className="border-t border-ori-border">
        <div className="lg:grid lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="ori-type-eyebrow">Inside one Playbook</p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ori-foreground md:text-3xl">
                {SHARPEN_PLAYBOOK_DEEP_DIVE.title}
              </h2>
              <p className="mt-4 ori-type-body-muted">{SHARPEN_PLAYBOOK_DEEP_DIVE.objective}</p>
              <CoachingSessionRunsheetMock className="mt-8" />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button to={lifecyclePath("sharpen-your-business-model")}>View full Playbook</Button>
                <Button href={bookUrl} variant="outline" target="_blank" rel="noreferrer">
                  Schedule a Session
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-14 space-y-16 lg:col-span-7 lg:mt-0">
            <CoachingDeviceFrame
              caption="Illustration: operators aligning on model and pipeline signal—not a live account."
              className="lg:max-w-none"
            >
              <img
                src={DEEP_DIVE_PANEL.src}
                alt={DEEP_DIVE_PANEL.alt}
                className="aspect-[16/10] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </CoachingDeviceFrame>
            <div>
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ori-foreground">
                <Video className="h-5 w-5 text-ori-accent" aria-hidden />
                Sessions (guided)
              </h3>
              <ul className="mt-6 divide-y divide-ori-border border-y border-ori-border">
                {SHARPEN_PLAYBOOK_DEEP_DIVE.sessions.map((s) => (
                  <li key={s.n} className="flex gap-4 py-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ori-border bg-ori-surface-panel font-mono text-xs text-ori-accent">
                      {s.n}
                    </span>
                    <div>
                      <p className="font-medium text-ori-foreground">{s.title}</p>
                      <p className="mt-1 text-sm text-ori-muted">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ori-foreground">
                <ListTodo className="h-5 w-5 text-ori-accent" aria-hidden />
                Plays (execution)
              </h3>
              <ul className="mt-6 space-y-3">
                {SHARPEN_PLAYBOOK_DEEP_DIVE.plays.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 border-l-2 border-ori-accent/70 bg-ori-surface-muted/40 py-3 pl-4 text-sm leading-relaxed text-ori-foreground md:text-base"
                  >
                    <ListTodo className="mt-0.5 h-4 w-4 shrink-0 text-ori-accent/80" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ori-foreground">
                <Target className="h-5 w-5 text-ori-accent" aria-hidden />
                Outcomes (what you leave with)
              </h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {SHARPEN_PLAYBOOK_DEEP_DIVE.outcomes.map((o) => (
                  <li
                    key={o}
                    className="flex gap-2.5 text-sm leading-relaxed text-ori-muted md:text-base"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ori-accent" aria-hidden />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 5 — Delivery */}
      <section className="border-y border-ori-border ori-pillar-band-consulting" aria-labelledby="delivery-heading">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-12 md:px-8 md:py-20 lg:gap-12">
          <div className="relative min-h-[200px] overflow-hidden rounded-2xl border border-ori-border/70 md:col-span-5">
            <img
              src={COACHING_PRODUCT_IMAGERY[3]!.src}
              alt={COACHING_PRODUCT_IMAGERY[3]!.alt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ori-black/85 via-ori-black/35 to-transparent" aria-hidden />
            <p className="absolute bottom-4 left-4 right-4 text-xs font-semibold uppercase tracking-widest text-ori-foreground/90">
              Formats that match real operator schedules
            </p>
          </div>
          <div className="md:col-span-7">
            <h2 id="delivery-heading" className="font-display text-2xl font-bold text-ori-foreground md:text-3xl">
              Delivered the way your business needs it
            </h2>
            <div className="mt-8 divide-y divide-ori-border/80 border-y border-ori-border/80">
              {[
                {
                  t: "1:1 Coaching",
                  b: "Hands-on, personalized execution when decisions are high-stakes and context-heavy.",
                  Icon: User,
                },
                {
                  t: "Cohort-Based",
                  b: "Learn alongside other founders—shared rhythm, peer signal, and accountable momentum.",
                  Icon: Users,
                },
                {
                  t: "Ongoing Engagement",
                  b: "Progress through multiple playbooks as the business matures from clarity → systems → capital.",
                  Icon: RefreshCw,
                },
              ].map((row) => {
                const RowIcon = row.Icon;
                return (
                  <div key={row.t} className="grid gap-4 py-8 md:grid-cols-12 md:items-start md:gap-6 md:py-10">
                    <div className="flex items-center gap-3 md:col-span-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-ori-border/80 bg-ori-black/25 text-ori-accent">
                        <RowIcon className="h-5 w-5" aria-hidden />
                      </span>
                      <p className="font-display text-lg font-semibold text-ori-foreground">{row.t}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-ori-muted md:col-span-8 md:text-base md:pt-1">{row.b}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Philosophy */}
      <section
        className="relative overflow-hidden border-b border-ori-border bg-ori-charcoal py-20 md:py-28"
        aria-labelledby="philosophy-heading"
      >
        <img
          src={PHILOSOPHY_BG.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.22] motion-reduce:opacity-[0.18]"
          loading="lazy"
          decoding="async"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ori-black/80 via-ori-charcoal/92 to-ori-black/88" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 20%, var(--color-ori-accent), transparent 55%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center md:px-8">
          <h2 id="philosophy-heading" className="font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-5xl">
            Not just advice. Execution.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-ori-muted md:text-xl">
            Most coaching tells you what to do. We work with you while you do it—so feedback lands in real deliverables,
            not slide decks.
          </p>
          <ul className="mx-auto mt-10 flex flex-col items-center gap-4 text-sm text-ori-text-secondary md:flex-row md:flex-wrap md:justify-center md:gap-x-10 md:text-base">
            {[
              { Icon: Video, label: "Real-time feedback on live work" },
              { Icon: ClipboardList, label: "Real deliverables between sessions" },
              { Icon: LineChart, label: "Real progress you can measure" },
            ].map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-ori-accent" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7 — Fit */}
      <PageSection>
        <div className="grid gap-12 border-t border-ori-border pt-14 md:grid-cols-2 md:gap-16 md:pt-16">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ori-foreground md:text-2xl">
              <CheckCircle2 className="h-6 w-6 text-ori-accent" aria-hidden />
              A strong fit if you are…
            </h2>
            <ul className="mt-6 space-y-3 text-ori-muted">
              {["Early-stage founders shipping toward traction", "Small business owners stuck between ideas and systems", "Teams trying to get unstuck on offer, pipeline, or model risk"].map((line) => (
                <li key={line} className="flex gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-ori-accent/80" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ori-muted md:text-2xl">
              <XCircle className="h-6 w-6 text-ori-muted" aria-hidden />
              Less ideal if you want…
            </h2>
            <ul className="mt-6 space-y-3 text-ori-muted/90">
              {[
                "Passive learning without execution between calls",
                "Open-ended exploration with no commitment to Plays",
                "A substitute for legal, tax, or investment advice—we collaborate; specialists sign where needed",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <XCircle className="mt-1 h-4 w-4 shrink-0 text-ori-muted" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageSection>

      {/* 8 — Engagement */}
      <PageSection className="bg-ori-section-alt">
        <SectionHeading
          eyebrow="Engagement"
          title="Flexible ways to work together"
          subtitle="Pricing depends on playbook depth, cadence, and whether you are 1:1 or cohort. We will match the model to your stage—without hiding behind vague retainers."
          align="left"
        />
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {[
            { t: "Per Playbook", b: "A bounded engagement with a defined objective and exit criteria.", Icon: Layers },
            { t: "Monthly rhythm", b: "Ongoing Sessions + Plays when you are navigating multiple bets at once.", Icon: CalendarClock },
            { t: "Cohort pricing", b: "Shared tracks when a peer cohort accelerates accountability.", Icon: Users },
          ].map((col) => {
            const CIcon = col.Icon;
            return (
              <div key={col.t} className="border-l-2 border-ori-accent/50 pl-6">
                <div className="flex items-center gap-2">
                  <CIcon className="h-5 w-5 text-ori-accent" aria-hidden />
                  <p className="font-display text-lg font-semibold text-ori-foreground">{col.t}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ori-muted">{col.b}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Button to={ROUTES.CONSULTING_BOOK} size="lg">
            Get started
          </Button>
          <Button to={ROUTES.CONTACT} variant="outline" size="lg">
            Talk to Ori
          </Button>
        </div>
      </PageSection>

      {/* 9 — Ecosystem */}
      <PageSection className="border-t border-ori-border">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-2xl font-bold text-ori-foreground md:text-3xl">
              Coaching builds clarity. Management runs the business. Funding scales it.
            </h2>
            <p className="mt-5 ori-type-body-muted">
              Ori Playbooks are the collaboration layer—decisions, sequencing, and execution discipline. That work feeds
              directly into Management (formation, Ori Vault, Builder, hosting, CRM) and into funding readiness and capital
              deployment when the signal supports it.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
            <li>
              <Link
                to={ROUTES.MANAGEMENT}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ori-border bg-ori-surface-panel/40 transition-colors hover:border-ori-accent/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-black"
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={COACHING_PRODUCT_IMAGERY[5]!.src}
                    alt=""
                    className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ori-black/70 to-transparent" aria-hidden />
                  <ClipboardList className="absolute bottom-2.5 left-3 h-5 w-5 text-ori-accent" aria-hidden />
                </div>
                <span className="flex flex-1 flex-col p-4">
                  <span className="font-display font-semibold text-ori-foreground">Management</span>
                  <span className="mt-1 text-sm text-ori-muted">Run operations with systems and records</span>
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.FUNDING_READINESS}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ori-border bg-ori-surface-panel/40 transition-colors hover:border-ori-accent/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-black"
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={COACHING_PRODUCT_IMAGERY[0]!.src}
                    alt=""
                    className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ori-black/70 to-transparent" aria-hidden />
                  <LineChart className="absolute bottom-2.5 left-3 h-5 w-5 text-ori-accent" aria-hidden />
                </div>
                <span className="flex flex-1 flex-col p-4">
                  <span className="font-display font-semibold text-ori-foreground">Funding readiness</span>
                  <span className="mt-1 text-sm text-ori-muted">Evidence, narrative, and checkpoints</span>
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.CAPITAL}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ori-border bg-ori-surface-panel/40 transition-colors hover:border-ori-accent/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-black"
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={COACHING_PRODUCT_IMAGERY[7]!.src}
                    alt=""
                    className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    loading="lazy"
                    decoding="async"
                    aria-hidden
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ori-black/70 to-transparent" aria-hidden />
                  <Landmark className="absolute bottom-2.5 left-3 h-5 w-5 text-ori-accent" aria-hidden />
                </div>
                <span className="flex flex-1 flex-col p-4">
                  <span className="font-display font-semibold text-ori-foreground">Capital</span>
                  <span className="mt-1 text-sm text-ori-muted">Deploy when the model is ready</span>
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </PageSection>

      {/* FAQ */}
      <PageSection className="border-t border-ori-border bg-ori-black">
        <SectionHeading title="Questions operators ask" align="left" />
        <Accordion
          items={FAQ_ITEMS.map((f) => ({
            id: f.id,
            title: f.title,
            content: <p>{f.content}</p>,
          }))}
        />
      </PageSection>

      {/* 10 — Final CTA */}
      <section
        className="relative overflow-hidden border-t border-ori-border bg-ori-section-alt py-20 md:py-24"
        aria-labelledby="final-cta-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30 motion-reduce:opacity-20"
          aria-hidden
          style={{
            backgroundImage: `linear-gradient(105deg, transparent 40%, color-mix(in srgb, var(--color-ori-accent) 12%, transparent)), url(${COACHING_PRODUCT_IMAGERY[6]!.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-2xl px-6 text-center md:px-8">
          <h2 id="final-cta-heading" className="font-display text-2xl font-bold text-ori-foreground md:text-4xl">
            Start your first Playbook
          </h2>
          <p className="mt-4 text-ori-muted">Or schedule a session to see how Sessions and Plays fit your stage.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button to={ROUTES.CONSULTING_BOOK} size="lg">
              Start Playbook
            </Button>
            <Button href={bookUrl} size="lg" variant="outline" target="_blank" rel="noreferrer">
              Schedule Session
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
