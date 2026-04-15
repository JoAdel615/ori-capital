import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";

/** Tooltip portal z-index: above modals/drawers (e.g. Drawer uses 9999). */
const TOOLTIP_Z_INDEX = 10000;

interface InfoPopoverProps {
  title: string;
  content: React.ReactNode;
  /** When true, popover opens above the trigger. */
  openAbove?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const TOOLTIP_WIDTH = 280;
const GAP = 8;
const VIEWPORT_PADDING = 16;

export function InfoPopover({ title, content, openAbove = false, className = "", children }: InfoPopoverProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const contentEl = contentRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const tooltipHeight = contentEl ? contentEl.offsetHeight : 180;
    const spaceBelow = window.innerHeight - rect.bottom - GAP;
    const spaceAbove = rect.top - GAP;
    const showAbove = openAbove || spaceBelow < tooltipHeight;
    if (showAbove && spaceAbove < tooltipHeight) {
      // Prefer below if above doesn't fit
      const top = rect.bottom + GAP;
      const topClamped = Math.min(top, window.innerHeight - tooltipHeight - VIEWPORT_PADDING);
      const left = Math.max(
        VIEWPORT_PADDING,
        Math.min(rect.left, window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_PADDING)
      );
      setPosition({ top: Math.max(VIEWPORT_PADDING, topClamped), left });
    } else if (showAbove) {
      const top = Math.max(VIEWPORT_PADDING, rect.top - tooltipHeight - GAP);
      const left = Math.max(
        VIEWPORT_PADDING,
        Math.min(rect.left, window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_PADDING)
      );
      setPosition({ top, left });
    } else {
      const top = Math.max(VIEWPORT_PADDING, Math.min(rect.bottom + GAP, window.innerHeight - tooltipHeight - VIEWPORT_PADDING));
      const left = Math.max(
        VIEWPORT_PADDING,
        Math.min(rect.left, window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_PADDING)
      );
      setPosition({ top, left });
    }
  }, [openAbove]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    const raf = requestAnimationFrame(() => updatePosition());
    const observedEl = contentRef.current;
    const ro =
      observedEl &&
      typeof ResizeObserver !== "undefined" &&
      new ResizeObserver(() => updatePosition());
    if (ro && observedEl) ro.observe(observedEl);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      if (ro && observedEl) ro.unobserve(observedEl);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        contentRef.current && !contentRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const tooltipContent = open && typeof document !== "undefined" ? (
    <div
      ref={contentRef}
      role="tooltip"
      aria-label={title}
      className="fixed w-[280px] max-w-[calc(100vw-2rem)] max-h-[min(70vh,400px)] overflow-y-auto rounded-lg border border-ori-border bg-ori-surface p-3 text-left text-sm shadow-xl"
      style={{
        top: position.top,
        left: position.left,
        zIndex: TOOLTIP_Z_INDEX,
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <p className="font-semibold text-ori-foreground">{title}</p>
      <div className="mt-1.5 text-ori-muted leading-relaxed">{content}</div>
    </div>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        className={`relative inline-flex items-center gap-2 ${className}`.trim()}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
        <button
          type="button"
          aria-expanded={open}
          aria-label={`Info: ${title}`}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ori-border bg-ori-charcoal text-ori-muted hover:border-ori-accent/50 hover:text-ori-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ori-accent"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      {tooltipContent && createPortal(tooltipContent, document.body)}
    </>
  );
}
