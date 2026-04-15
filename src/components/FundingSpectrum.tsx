import { Building2, Landmark } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { FUNDING_GAP_NODES, type FundingGapNode } from "../data/fundingSpectrumStages";
import { CONTAINER_MAX } from "./system/rhythm";

const NODES = FUNDING_GAP_NODES;
const LAST = NODES.length - 1;

const STAT_LENDERS = {
  value: "~4 in 10",
  caption: "Businesses secure funding from lenders",
} as const;
const STAT_GAP = {
  value: "~78%",
  caption: "Businesses rely on founder self-funding",
} as const;
const STAT_INVESTORS = {
  value: "Less than 1%",
  caption: "Businesses raise funding from investors",
} as const;

interface FundingSpectrumProps {
  fullViewport?: boolean;
}

export function FundingSpectrum({ fullViewport = false }: FundingSpectrumProps) {
  const [index, setIndex] = useState(5);
  const [detailNode, setDetailNode] = useState<FundingGapNode>(NODES[5]!);
  const [sliderHover, setSliderHover] = useState(false);
  const [rangeFocused, setRangeFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ left: 0, top: 0 });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rangeId = useId();

  const active = NODES[index]!;

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const scheduleSliderLeave = useCallback(() => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => setSliderHover(false), 200);
  }, [clearLeaveTimer]);

  const updatePopoverPosition = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const thumbInset = 14;
    const usable = Math.max(0, rect.width - thumbInset * 2);
    const x = rect.left + thumbInset + (index / LAST) * usable;
    const y = rect.bottom + 10;
    setPopoverPos({ left: x, top: y });
  }, [index]);

  const popoverOpen = sliderHover || dragging || rangeFocused;

  useLayoutEffect(() => {
    if (!popoverOpen) return;
    updatePopoverPosition();
  }, [popoverOpen, updatePopoverPosition]);

  useEffect(() => {
    if (!popoverOpen) return;
    const onMove = () => updatePopoverPosition();
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  }, [popoverOpen, updatePopoverPosition]);

  useEffect(() => {
    if (!dragging) return;
    const end = () => setDragging(false);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [dragging]);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const openDetails = useCallback((node: FundingGapNode, idx: number) => {
    setDetailNode(node);
    setIndex(idx);
    window.setTimeout(() => dialogRef.current?.showModal(), 0);
  }, []);

  const setIndexFromRange = useCallback((raw: number) => {
    const v = Math.min(LAST, Math.max(0, Math.round(raw)));
    setIndex(v);
  }, []);

  const handleTrackHoverMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const railHitSlop = 12;
    const onRail = Math.abs(e.clientY - centerY) <= railHitSlop;
    if (!onRail) {
      setSliderHover(false);
      return;
    }

    const thumbInset = 14;
    const usable = Math.max(0, rect.width - thumbInset * 2);
    if (usable <= 0) return;
    const clamped = Math.min(rect.right - thumbInset, Math.max(rect.left + thumbInset, e.clientX));
    const ratio = (clamped - (rect.left + thumbInset)) / usable;
    setIndexFromRange(ratio * LAST);
    setSliderHover(true);
  }, [setIndexFromRange]);

  return (
    <section
      className={
        fullViewport
          ? "relative min-h-screen min-h-dvh flex flex-col justify-center bg-ori-black section-divider overflow-x-hidden py-12 md:py-16"
          : "relative py-28 bg-ori-black section-divider overflow-x-hidden"
      }
      aria-labelledby="funding-spectrum-heading"
    >
      <div className={`mx-auto w-full ${CONTAINER_MAX} px-6 lg:px-8`}>
        <header className="mb-10 text-center md:mb-12">
          <h2
            id="funding-spectrum-heading"
            className="font-display text-3xl font-bold tracking-tight text-ori-foreground md:text-4xl"
          >
            Most businesses fall into the funding gap
          </h2>
          <p className="mx-auto mt-5 max-w-[680px] text-lg leading-relaxed text-ori-muted">
            Traditional lenders prioritize stability. Investors prioritize scale. Most businesses fall somewhere in
            between—too early for one, not a fit for the other. That&apos;s where deals stall, and where strategy
            matters.
          </p>
        </header>

        <div className="relative z-0 rounded-2xl border border-ori-border bg-gradient-to-b from-ori-surface to-ori-charcoal p-6 shadow-sm ring-1 ring-ori-border/30 md:p-10">
          <div className="w-full rounded-xl bg-ori-black px-3 py-3 md:px-6 md:py-4">
            <SpectrumFraming />

            <div className="mx-auto mt-1 max-w-4xl md:mt-2">
              <p className="sr-only" id="funding-spectrum-slider-hint">
                {NODES.length} steps on a slider. Hover or drag the slider to see a short summary; it closes when you
                move away. Focus the slider to hear the current step. Arrow keys change the step. Enter opens full
                details.
              </p>

              <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-x-visible [&::-webkit-scrollbar]:hidden">
                <div className="relative mx-auto min-w-[520px] px-2 md:min-w-0">
                  <div
                    ref={trackRef}
                    className="relative z-[1] mt-6 h-[3.25rem] md:mt-8 md:h-14"
                    onMouseMove={handleTrackHoverMove}
                    onMouseLeave={scheduleSliderLeave}
                    onPointerDown={() => setDragging(true)}
                  >
                    <div
                      className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] flex -translate-y-1/2 items-center"
                      aria-hidden
                    >
                      <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-ori-accent/25 via-ori-border to-ori-accent/20 ring-1 ring-inset ring-ori-border/50" />
                    </div>

                    <div
                      className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] grid h-2.5 w-full -translate-y-1/2 grid-cols-11 place-items-center"
                      aria-hidden
                    >
                      {NODES.map((node, i) => {
                        const isActive = i === index;
                        return (
                          <span
                            key={`tick-${node.id}`}
                            className={`block h-2 w-2 rounded-full border-2 border-ori-black transition-opacity duration-150 ${
                              isActive ? "opacity-0" : "bg-ori-border opacity-100 ring-1 ring-ori-border/40"
                            }`}
                          />
                        );
                      })}
                    </div>

                    <label htmlFor={rangeId} className="sr-only">
                      Funding gap spectrum — {NODES.length} steps. Hover the track for a summary. Current: {active.title}.
                    </label>
                    <input
                      id={rangeId}
                      type="range"
                      className="funding-spectrum-range absolute inset-x-0 bottom-0 z-[2] w-full"
                      min={0}
                      max={LAST}
                      step={1}
                      value={index}
                      aria-valuemin={0}
                      aria-valuemax={LAST}
                      aria-valuenow={index}
                      aria-valuetext={active.title}
                      aria-describedby="funding-spectrum-slider-hint"
                      onInput={(e) => setIndexFromRange(Number((e.target as HTMLInputElement).value))}
                      onChange={(e) => setIndexFromRange(Number(e.target.value))}
                      onFocus={() => setRangeFocused(true)}
                      onBlur={(e) => {
                        const next = e.relatedTarget as Node | null;
                        if (next && popoverRef.current?.contains(next)) return;
                        setRangeFocused(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const v = Math.min(LAST, Math.max(0, Number(e.currentTarget.value)));
                          openDetails(NODES[v]!, v);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {popoverOpen &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                ref={popoverRef}
                role="tooltip"
                className="funding-spectrum-popover fixed z-[300] w-[min(272px,calc(100vw-2rem))] rounded-lg border border-ori-border bg-ori-surface px-3 py-3 motion-reduce:transition-none"
                style={{
                  left: popoverPos.left,
                  top: popoverPos.top,
                  transform: "translateX(-50%)",
                }}
              >
                <p className="font-display text-sm font-semibold text-ori-foreground">{active.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-ori-muted">{active.description}</p>
                <button
                  type="button"
                  className="mt-3 text-sm font-medium text-ori-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ori-surface rounded-sm"
                  onClick={() => openDetails(active, index)}
                >
                  See more
                </button>
              </div>,
              document.body,
            )}

          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-ori-border pt-8 md:grid-cols-3">
            <div className="rounded-xl border border-ori-border bg-ori-surface px-4 py-3 text-center shadow-sm">
              <p className="font-display text-xl font-bold text-ori-foreground">{STAT_LENDERS.value}</p>
              <p className="mt-0.5 text-xs text-ori-muted">{STAT_LENDERS.caption}</p>
            </div>
            <div className="rounded-xl border border-ori-border bg-ori-surface px-4 py-3 text-center shadow-sm">
              <p className="font-display text-xl font-bold text-ori-foreground">{STAT_GAP.value}</p>
              <p className="mt-0.5 text-xs text-ori-muted">{STAT_GAP.caption}</p>
            </div>
            <div className="rounded-xl border border-ori-border bg-ori-surface px-4 py-3 text-center shadow-sm">
              <p className="font-display text-xl font-bold text-ori-foreground">{STAT_INVESTORS.value}</p>
              <p className="mt-0.5 text-xs text-ori-muted">{STAT_INVESTORS.caption}</p>
            </div>
          </div>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="funding-spectrum-dialog funding-spectrum-dialog-panel fixed left-1/2 top-1/2 z-[100] w-[min(100%,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-ori-border bg-ori-surface p-6 text-ori-foreground"
        aria-labelledby="spectrum-dialog-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeDialog();
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 pr-2">
            <h2 id="spectrum-dialog-title" className="font-display text-lg font-semibold">
              {detailNode.title}
            </h2>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg border border-ori-border px-2 py-1 text-sm text-ori-muted hover:border-ori-accent hover:text-ori-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent"
            onClick={closeDialog}
          >
            Close
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ori-muted">{detailNode.description}</p>
        <dl className="mt-5 space-y-4 border-t border-ori-border pt-5">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-ori-accent">Best for</dt>
            <dd className="mt-1.5 text-sm text-ori-foreground">{detailNode.bestFor}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-ori-muted">Tradeoffs</dt>
            <dd className="mt-1.5 text-sm text-ori-muted">{detailNode.tradeoffs}</dd>
          </div>
        </dl>
      </dialog>
    </section>
  );
}

function SpectrumFraming() {
  const iconClass = "text-ori-muted shrink-0";
  const iconSize = 88;

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-4 md:grid-cols-3 md:gap-6">
      <div className="flex flex-col items-center justify-center gap-2 md:-translate-x-[18%] md:gap-3">
        <span className="inline-flex rounded-xl border border-ori-border bg-ori-surface p-4 shadow-sm" aria-hidden>
          <Landmark className={iconClass} width={iconSize} height={iconSize} strokeWidth={1.5} />
        </span>
        <span className="text-center text-xs font-semibold uppercase tracking-wider text-ori-muted">Lenders</span>
      </div>

      <div className="flex min-w-0 w-full items-center justify-center px-1 sm:px-2">
        <svg
          viewBox="0 0 560 86"
          className="h-[5.25rem] w-full max-w-2xl text-ori-border md:h-[6.25rem] lg:max-w-3xl"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <line
            x1="0"
            y1="43"
            x2="78"
            y2="43"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.55"
          />
          <line
            x1="482"
            y1="43"
            x2="560"
            y2="43"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.55"
          />
          <rect
            x="84"
            y="11"
            width="392"
            height="64"
            rx="8"
            fill="var(--color-ori-surface)"
            stroke="var(--color-ori-accent)"
            strokeWidth="2.5"
            strokeOpacity="0.85"
          />
          <text
            x="280"
            y="43"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-ori-accent)"
            fontSize="24"
            fontFamily="var(--font-display), system-ui, sans-serif"
            fontWeight="600"
            letterSpacing="-0.02em"
          >
            The Funding Gap
          </text>
        </svg>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 md:translate-x-[18%] md:gap-3">
        <span className="inline-flex rounded-xl border border-ori-border bg-ori-surface p-4 shadow-sm" aria-hidden>
          <Building2 className={iconClass} width={iconSize} height={iconSize} strokeWidth={1.5} />
        </span>
        <span className="text-center text-xs font-semibold uppercase tracking-wider text-ori-muted">Investors</span>
      </div>
    </div>
  );
}
