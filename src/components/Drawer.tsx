import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** 'right' | 'full' for desktop right-side drawer vs full-screen overlay on mobile */
  variant?: "right" | "full";
  className?: string;
  id?: string;
}

/** z-index values so drawer always sits above page content (portaled to body) */
const DRAWER_OVERLAY_Z = 9998;
const DRAWER_PANEL_Z = 9999;

export function Drawer({
  open,
  onClose,
  children,
  variant = "right",
  className = "",
  id,
}: DrawerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !ref.current) return;
    const focusables = ref.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    ref.current.addEventListener("keydown", handleKeyDown);
    return () => ref.current?.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const drawer = (
    <>
      <div
        className="drawer-overlay fixed inset-0 bg-black/60 backdrop-blur-sm"
        style={{ zIndex: DRAWER_OVERLAY_Z }}
        aria-hidden
        onClick={onClose}
      />
      <div
        ref={ref}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`drawer-panel fixed inset-y-0 flex flex-col bg-ori-charcoal border-l border-ori-border shadow-xl
          ${variant === "full" ? "left-0 right-0 w-full md:w-[min(400px,90vw)] md:left-auto" : "right-0 w-full max-w-[min(400px,90vw)]"}
          ${className}`.trim()}
        style={{ zIndex: DRAWER_PANEL_Z }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );

  return createPortal(drawer, document.body);
}
